import React, { useEffect, useState, useCallback } from 'react';
import { StarObject, AIDetailResponse } from '../types';
import { fetchConstellationDetails, fetchConstellationImage } from '../services/geminiService';
import { X, Sparkles, Compass, Clock, BookOpen, Share2, Star, RefreshCw, Image as ImageIcon } from 'lucide-react';

interface DetailModalProps {
  item: StarObject | null;
  onClose: () => void;
}

const LOADING_MESSAGES = [
  "별들의 목소리에 귀 기울이는 중...",
  "오래된 신화를 펼쳐보는 중...",
  "망원경의 초점을 맞추는 중...",
  "은하수를 건너 정보를 가져오는 중...",
  "밤하늘의 지도를 그리는 중..."
];

const IMAGE_LOADING_MESSAGES = [
  "밤하늘의 모습을 그리는 중...",
  "별빛을 모아 사진을 현상 중...",
  "우주의 풍경을 담는 중..."
];

const DetailModal: React.FC<DetailModalProps> = ({ item, onClose }) => {
  const [data, setData] = useState<AIDetailResponse | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [imgMsgIndex, setImgMsgIndex] = useState(0);

  const loadData = useCallback(() => {
    if (item) {
      setLoading(true);
      setImageLoading(true);
      setData(null);
      setGeneratedImage(null);
      setLoadingMsgIndex(0);
      
      // Fetch Text Details
      fetchConstellationDetails(item.name).then((res) => {
        setData(res);
        setLoading(false);
      });

      // Fetch Image (Parallel but independent state)
      fetchConstellationImage(item.name).then((imgUrl) => {
        setGeneratedImage(imgUrl);
        setImageLoading(false);
      });
    }
  }, [item]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Rotate loading messages
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (!imageLoading) return;
    const interval = setInterval(() => {
      setImgMsgIndex((prev) => (prev + 1) % IMAGE_LOADING_MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [imageLoading]);

  const handleShare = async () => {
    if (!item || !data) return;
    const text = `[StarGazer] ${item.name} 이야기\n\n${data.story.slice(0, 80)}...\n\n자세한 내용은 앱에서 확인하세요!`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.name,
          text: text,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Sharing failed', err);
      }
    } else {
      await navigator.clipboard.writeText(text);
      alert("내용이 클립보드에 복사되었습니다!");
    }
  };

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col ring-1 ring-white/10">
        
        {/* Header / Image Area */}
        <div className="relative h-64 sm:h-80 shrink-0 bg-slate-800 group overflow-hidden">
          {generatedImage ? (
            <img 
              src={generatedImage} 
              alt={item.name} 
              className="w-full h-full object-cover animate-fade-in duration-700 hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-indigo-950 flex flex-col items-center justify-center">
               {imageLoading ? (
                 <div className="flex flex-col items-center space-y-3">
                   <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                   <p className="text-indigo-200/70 text-sm font-medium animate-pulse">{IMAGE_LOADING_MESSAGES[imgMsgIndex]}</p>
                 </div>
               ) : (
                 <div className="text-slate-600 flex flex-col items-center">
                    <ImageIcon size={48} className="mb-2 opacity-50" />
                    <span className="text-sm">이미지를 불러올 수 없습니다</span>
                 </div>
               )}
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white/80 hover:text-white transition-all transform hover:rotate-90 duration-300 z-10"
          >
            <X size={24} />
          </button>

          <div className="absolute bottom-6 left-6 sm:left-8 right-6">
             <div className="flex items-center space-x-2 mb-2">
               <span className="px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase bg-indigo-500/80 backdrop-blur text-white rounded-lg shadow-lg">
                {item.type}
               </span>
               {data && !loading && (
                 <span className={`px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase rounded-lg shadow-lg border ${
                   data.difficulty === 'Easy' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200' :
                   data.difficulty === 'Medium' ? 'bg-amber-500/20 border-amber-500/50 text-amber-200' :
                   'bg-rose-500/20 border-rose-500/50 text-rose-200'
                 }`}>
                   {data.difficulty}
                 </span>
               )}
             </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white drop-shadow-lg tracking-tight">{item.name}</h2>
            <p className="text-slate-300 mt-2 text-sm sm:text-base font-light max-w-xl text-shadow">{item.description}</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-gradient-to-b from-slate-900 to-slate-950">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-6">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin"></div>
                <Star className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-400 animate-pulse" size={20} fill="currentColor"/>
              </div>
              <p className="text-indigo-300/80 font-medium animate-pulse text-center min-w-[200px]">
                {LOADING_MESSAGES[loadingMsgIndex]}
              </p>
            </div>
          ) : data ? (
            <div className="p-6 sm:p-8 space-y-8 animate-fade-in-up">
              
              {/* Action Bar */}
              <div className="flex justify-end">
                 <button 
                  onClick={handleShare}
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-full text-sm text-indigo-300 hover:text-indigo-200 transition-colors border border-slate-700 hover:border-indigo-500/30"
                >
                  <Share2 size={16} />
                  <span>친구에게 공유</span>
                </button>
              </div>

              {/* Story Section */}
              <section className="relative">
                <h3 className="flex items-center text-xl font-bold text-indigo-300 mb-4">
                  <BookOpen size={24} className="mr-3 text-indigo-400" /> 
                  별이 들려주는 이야기
                </h3>
                <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 leading-relaxed text-slate-300 text-lg shadow-inner">
                  {data.story}
                </div>
              </section>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Viewing Time */}
                <section>
                  <h3 className="flex items-center text-lg font-bold text-amber-300 mb-3">
                    <Clock size={20} className="mr-2 text-amber-400" /> 관측 시기
                  </h3>
                  <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 h-full hover:bg-slate-800/60 transition-colors">
                    <p className="text-slate-300">{data.bestViewingTime}</p>
                  </div>
                </section>

                {/* Finding Tip */}
                <section>
                  <h3 className="flex items-center text-lg font-bold text-emerald-300 mb-3">
                    <Compass size={20} className="mr-2 text-emerald-400" /> 찾는 방법
                  </h3>
                  <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 h-full hover:bg-slate-800/60 transition-colors">
                    <p className="text-slate-300">{data.findingTip}</p>
                  </div>
                </section>
              </div>

              {/* Interesting Facts */}
              <section>
                <h3 className="flex items-center text-lg font-bold text-pink-300 mb-4">
                  <Sparkles size={20} className="mr-2 text-pink-400" /> 알고 계셨나요?
                </h3>
                <ul className="grid grid-cols-1 gap-3">
                  {data.interestingFacts.map((fact, idx) => (
                    <li key={idx} className="flex items-start bg-slate-800/30 p-4 rounded-xl border border-slate-800 hover:border-pink-500/30 transition-colors">
                      <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 text-xs font-bold mr-3 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-slate-300">{fact}</span>
                    </li>
                  ))}
                </ul>
              </section>

            </div>
          ) : (
             <div className="flex flex-col items-center justify-center py-20 space-y-4">
               <p className="text-slate-400">데이터를 불러오는데 실패했습니다.</p>
               <button 
                 onClick={loadData}
                 className="flex items-center space-x-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
               >
                 <RefreshCw size={18} />
                 <span>다시 시도하기</span>
               </button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailModal;