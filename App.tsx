import React, { useState, useMemo } from 'react';
import { Search, Download, Share2, Star, Calendar, Info } from 'lucide-react';
import { CALENDAR_DATA } from './constants';
import { StarObject } from './types';
import StarBackground from './components/StarBackground';
import DetailModal from './components/DetailModal';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<StarObject | null>(null);
  const [showInstallToast, setShowInstallToast] = useState(false);

  // Get Current Month (1-12)
  const currentMonth = new Date().getMonth() + 1;

  // Filter logic
  const filteredMonths = useMemo(() => {
    if (!searchTerm) return CALENDAR_DATA;
    
    return CALENDAR_DATA.map(month => ({
      ...month,
      objects: month.objects.filter(obj => 
        obj.name.includes(searchTerm) || 
        obj.description.includes(searchTerm) ||
        month.monthName.includes(searchTerm)
      )
    })).filter(month => month.objects.length > 0);
  }, [searchTerm]);

  const currentMonthData = useMemo(() => {
    return CALENDAR_DATA.find(m => m.month === currentMonth);
  }, [currentMonth]);

  const handleInstallClick = () => {
    setShowInstallToast(true);
    setTimeout(() => setShowInstallToast(false), 5000);
  };

  const handleGlobalShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'StarGazer',
          text: '계절별 별자리 관측 가이드, StarGazer를 확인해보세요!',
          url: window.location.href,
        });
      } catch (e) {
        console.log('Share canceled');
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert('주소가 클립보드에 복사되었습니다.');
    }
  };

  // Helper to render a card without broken images
  const StarCard = ({ obj, onClick, featured = false }: { obj: StarObject, onClick: () => void, featured?: boolean }) => (
    <div 
      onClick={onClick}
      className={`group relative overflow-hidden bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 hover:border-indigo-500/50 rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 ${featured ? 'flex items-center p-3' : 'flex flex-col'}`}
    >
       {/* Beautiful Gradient Background instead of broken images */}
       <div className={`${featured ? 'h-20 w-20 sm:h-24 sm:w-24 rounded-lg' : 'aspect-[2/1] w-full'} shrink-0 relative overflow-hidden bg-gradient-to-br from-slate-800 via-indigo-950 to-slate-900 group-hover:from-indigo-900 group-hover:to-slate-800 transition-colors duration-500`}>
          {/* Decorative Stars */}
          <div className="absolute top-1/4 left-1/4 w-0.5 h-0.5 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-indigo-300 rounded-full opacity-60"></div>
          <div className="absolute top-1/2 right-1/4 w-0.5 h-0.5 bg-white rounded-full"></div>
          
          {/* Icon/Text Centered */}
          <div className="absolute inset-0 flex items-center justify-center">
             <Star className="text-white/20 group-hover:text-white/40 transition-colors" size={featured ? 32 : 48} strokeWidth={1} />
          </div>

          {!featured && (
             <div className="absolute bottom-2 left-3 right-3">
               <span className="text-white font-bold text-lg drop-shadow-md">{obj.name}</span>
             </div>
          )}
       </div>

       <div className={`${featured ? 'ml-4 flex-1' : 'p-3 flex-1 flex flex-col'}`}>
          {featured && (
             <div className="flex justify-between items-start">
                <h4 className="font-bold text-lg text-slate-100">{obj.name}</h4>
                <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">{obj.type}</span>
             </div>
          )}
          <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed group-hover:text-slate-300 transition-colors">
            {obj.description}
          </p>
          {!featured && (
             <div className="mt-3 flex justify-between items-center opacity-60 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">{obj.type}</span>
                <div className="flex text-indigo-400 items-center text-xs">
                   <span>상세보기</span>
                </div>
             </div>
          )}
       </div>
    </div>
  );

  return (
    <div className="relative min-h-screen text-slate-100 font-sans selection:bg-indigo-500/30">
      <StarBackground />

      {/* Navbar / Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/60 border-b border-white/5 supports-[backdrop-filter]:bg-slate-950/60">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="p-1.5 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow-lg shadow-indigo-500/20">
              <Star className="text-white fill-white" size={20} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-white to-purple-200">
              StarGazer
            </h1>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Desktop Search */}
            <div className="hidden sm:flex items-center bg-white/5 rounded-full px-4 py-1.5 border border-white/10 focus-within:border-indigo-400/50 focus-within:bg-white/10 transition-all duration-300">
              <Search size={16} className="text-slate-400 mr-2" />
              <input 
                type="text" 
                placeholder="별자리, 성운 검색..." 
                className="bg-transparent border-none outline-none text-sm text-white placeholder-slate-400 w-40 focus:w-56 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button 
              onClick={handleGlobalShare}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors active:scale-95"
              title="앱 공유하기"
            >
              <Share2 size={20} />
            </button>
            <button 
              onClick={handleInstallClick}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors active:scale-95"
              title="앱 설치"
            >
              <Download size={20} />
            </button>
          </div>
        </div>
        
        {/* Mobile Search */}
        <div className="sm:hidden px-4 pb-3">
           <div className="flex items-center bg-slate-900/50 rounded-xl px-3 py-2.5 border border-white/5 focus-within:border-indigo-500/50 transition-colors">
              <Search size={18} className="text-slate-400 mr-3" />
              <input 
                type="text" 
                placeholder="별자리 검색..." 
                className="bg-transparent border-none outline-none text-base text-white placeholder-slate-500 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        
        {/* Intro / Featured Section (Only when not searching) */}
        {!searchTerm && (
          <div className="mb-16 animate-fade-in-up">
            <div className="text-center space-y-4 py-8 mb-8">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                오늘 밤, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">별을 보러 갈까요?</span>
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto text-lg">
                매달 밤하늘이 들려주는 새로운 이야기를 Gemini AI와 함께 만나보세요.
              </p>
            </div>

            {/* Current Month Highlights */}
            {currentMonthData && (
               <div className="bg-slate-900/40 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-sm relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  <div className="flex items-center space-x-3 mb-6 relative z-10">
                    <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/30 text-white font-bold text-lg">
                       {currentMonth}
                    </span>
                    <div>
                       <h3 className="text-xl font-bold text-white">이번 달 추천 관측 대상</h3>
                       <p className="text-indigo-300 text-sm">지금이 가장 관측하기 좋은 시기입니다</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 relative z-10">
                      {currentMonthData.objects.map((obj) => (
                        <StarCard key={obj.id} obj={obj} onClick={() => setSelectedItem(obj)} featured={true} />
                      ))}
                  </div>
               </div>
            )}
          </div>
        )}

        {/* Calendar Grid */}
        <div className="space-y-8">
           {!searchTerm && <h3 className="text-2xl font-bold text-white flex items-center"><Calendar className="mr-2 text-indigo-400" /> 전체 캘린더</h3>}
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMonths.map((data) => (
              <div key={data.month} className="space-y-3">
                <div className="flex items-baseline justify-between px-1 border-b border-white/5 pb-2 mb-2">
                  <span className="text-2xl font-bold text-slate-200">{data.monthName}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                    data.season === 'Spring' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' :
                    data.season === 'Summer' ? 'text-sky-400 border-sky-500/30 bg-sky-500/10' :
                    data.season === 'Autumn' ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' :
                    'text-indigo-400 border-indigo-500/30 bg-indigo-500/10'
                  }`}>
                    {data.season}
                  </span>
                </div>

                <div className="space-y-3">
                  {data.objects.map((obj) => (
                    <StarCard key={obj.id} obj={obj} onClick={() => setSelectedItem(obj)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredMonths.length === 0 && (
           <div className="flex flex-col items-center justify-center py-24 text-center">
             <div className="p-6 rounded-full bg-slate-800/50 mb-4 animate-bounce">
                <Search size={40} className="text-slate-500" />
             </div>
             <p className="text-2xl font-bold text-slate-300 mb-2">검색 결과가 없습니다</p>
             <p className="text-slate-500">다른 별자리 이름이나 계절로 검색해보세요.</p>
           </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 mt-20 border-t border-white/5 bg-slate-950/80 text-center text-slate-600 text-sm">
        <p className="mb-2">© 2024 StarGazer Project. All rights reserved.</p>
        <p className="text-xs text-slate-700">Powered by Google Gemini 2.5 Flash & Image</p>
      </footer>

      {/* Detail Modal */}
      {selectedItem && (
        <DetailModal 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )}

      {/* PWA Install Toast Simulation */}
      {showInstallToast && (
        <div className="fixed bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-auto z-50 animate-fade-in-up">
           <div className="bg-slate-800/90 backdrop-blur-md border border-indigo-500/30 text-white p-4 rounded-2xl shadow-2xl flex items-center space-x-4 max-w-md mx-auto">
              <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shrink-0">
                 <Download size={24} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm mb-1">앱 설치하기</h4>
                <p className="text-xs text-slate-300 leading-snug">
                  iOS: <span className="bg-slate-700 px-1 rounded">공유</span> 버튼 → <span className="font-semibold text-white">'홈 화면에 추가'</span><br/>
                  Android: 메뉴 → <span className="font-semibold text-white">'앱 설치'</span> 또는 <span className="font-semibold text-white">'홈 화면에 추가'</span>
                </p>
              </div>
              <button onClick={() => setShowInstallToast(false)} className="p-2 hover:bg-white/10 rounded-full">
                <span className="sr-only">닫기</span>
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
           </div>
        </div>
      )}
    </div>
  );
}

export default App;