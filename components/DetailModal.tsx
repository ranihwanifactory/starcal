import React, { useEffect, useState } from 'react';
import { StarObject, AIDetailResponse } from '../types';
import { fetchConstellationDetails } from '../services/geminiService';
import { X, Sparkles, Compass, Clock, BookOpen, Share2 } from 'lucide-react';

interface DetailModalProps {
  item: StarObject | null;
  onClose: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ item, onClose }) => {
  const [data, setData] = useState<AIDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setLoading(true);
      setData(null);
      fetchConstellationDetails(item.name).then((res) => {
        setData(res);
        setLoading(false);
      });
    }
  }, [item]);

  const handleShare = async () => {
    if (!item || !data) return;
    const text = `[StarGazer] ${item.name} 관측 정보\n\n${data.story.slice(0, 50)}...\n\n지금 앱에서 확인해보세요!`;
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
      alert("클립보드에 복사되었습니다.");
      navigator.clipboard.writeText(text);
    }
  };

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header Image */}
        <div className="relative h-48 sm:h-64 shrink-0">
          <img 
            src={item.imagePlaceholder} 
            alt={item.name} 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
          >
            <X size={24} />
          </button>
          <div className="absolute bottom-4 left-6">
             <span className="px-2 py-1 text-xs font-semibold bg-indigo-500 text-white rounded-md mb-2 inline-block">
              {item.type}
             </span>
            <h2 className="text-3xl font-bold text-white shadow-sm">{item.name}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-indigo-300 animate-pulse">Gemini가 별의 이야기를 읽어오고 있습니다...</p>
            </div>
          ) : data ? (
            <div className="space-y-6 text-slate-200">
              
              {/* Difficulty Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                   <span className={`px-3 py-1 rounded-full text-sm font-bold border ${
                     data.difficulty === 'Easy' ? 'border-green-500 text-green-400 bg-green-500/10' :
                     data.difficulty === 'Medium' ? 'border-yellow-500 text-yellow-400 bg-yellow-500/10' :
                     'border-red-500 text-red-400 bg-red-500/10'
                   }`}>
                     난이도: {data.difficulty}
                   </span>
                </div>
                <button 
                  onClick={handleShare}
                  className="flex items-center space-x-1 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  <Share2 size={16} />
                  <span>공유하기</span>
                </button>
              </div>

              {/* Story */}
              <section className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <h3 className="flex items-center text-lg font-bold text-indigo-300 mb-2">
                  <BookOpen size={20} className="mr-2" /> 신화와 이야기
                </h3>
                <p className="leading-relaxed text-sm sm:text-base text-slate-300">
                  {data.story}
                </p>
              </section>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Viewing Time */}
                <section className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                  <h3 className="flex items-center text-lg font-bold text-amber-300 mb-2">
                    <Clock size={20} className="mr-2" /> 관측 시기
                  </h3>
                  <p className="text-sm text-slate-300">{data.bestViewingTime}</p>
                </section>

                {/* Finding Tip */}
                <section className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                  <h3 className="flex items-center text-lg font-bold text-emerald-300 mb-2">
                    <Compass size={20} className="mr-2" /> 찾는 법
                  </h3>
                  <p className="text-sm text-slate-300">{data.findingTip}</p>
                </section>
              </div>

              {/* Interesting Facts */}
              <section>
                <h3 className="flex items-center text-lg font-bold text-pink-300 mb-3">
                  <Sparkles size={20} className="mr-2" /> 흥미로운 사실들
                </h3>
                <ul className="space-y-2">
                  {data.interestingFacts.map((fact, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-pink-400 mt-2 mr-2 shrink-0"></span>
                      <span className="text-slate-300 text-sm">{fact}</span>
                    </li>
                  ))}
                </ul>
              </section>

            </div>
          ) : (
            <div className="text-center py-10 text-slate-400">데이터를 불러오지 못했습니다.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
