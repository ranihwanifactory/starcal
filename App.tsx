import React, { useState, useMemo } from 'react';
import { Search, Download, Share2, Star, Calendar } from 'lucide-react';
import { CALENDAR_DATA } from './constants';
import { StarObject } from './types';
import StarBackground from './components/StarBackground';
import DetailModal from './components/DetailModal';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<StarObject | null>(null);
  const [showInstallToast, setShowInstallToast] = useState(false);

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

  const handleInstallClick = () => {
    setShowInstallToast(true);
    setTimeout(() => setShowInstallToast(false), 4000);
  };

  const handleGlobalShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'StarGazer',
          text: '별자리 관측 달력 앱을 확인해보세요!',
          url: window.location.href,
        });
      } catch (e) {
        console.log('Share canceled');
      }
    } else {
      alert('현재 브라우저에서는 공유 기능을 지원하지 않습니다. URL을 복사해주세요.');
    }
  };

  return (
    <div className="relative min-h-screen text-slate-100 font-sans selection:bg-indigo-500/30">
      <StarBackground />

      {/* Navbar / Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/70 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-indigo-600 rounded-lg">
              <Star className="text-white fill-current" size={20} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-purple-200">
              StarGazer
            </h1>
          </div>

          <div className="flex items-center space-x-3">
             {/* Search Input Desktop */}
            <div className="hidden sm:flex items-center bg-white/10 rounded-full px-3 py-1.5 border border-white/5 focus-within:border-indigo-400 transition-colors">
              <Search size={16} className="text-slate-400 mr-2" />
              <input 
                type="text" 
                placeholder="별자리 검색..." 
                className="bg-transparent border-none outline-none text-sm text-white placeholder-slate-400 w-32 focus:w-48 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button 
              onClick={handleGlobalShare}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              title="앱 공유하기"
            >
              <Share2 size={20} />
            </button>
            <button 
              onClick={handleInstallClick}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              title="앱 설치"
            >
              <Download size={20} />
            </button>
          </div>
        </div>
        
        {/* Search Input Mobile */}
        <div className="sm:hidden px-4 pb-3">
           <div className="flex items-center bg-white/10 rounded-lg px-3 py-2 border border-white/5">
              <Search size={16} className="text-slate-400 mr-2" />
              <input 
                type="text" 
                placeholder="별자리, 성운 검색..." 
                className="bg-transparent border-none outline-none text-sm text-white placeholder-slate-400 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        
        {/* Intro Banner */}
        {!searchTerm && (
          <div className="mb-10 text-center space-y-4 py-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              밤하늘의 이야기를 만나보세요
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              1월부터 12월까지, 계절마다 가장 아름답게 빛나는 별자리와 성운을 엄선했습니다.
              카드를 눌러 Gemini AI가 들려주는 신비로운 이야기를 들어보세요.
            </p>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMonths.map((data) => (
            <div key={data.month} className="space-y-3 group">
              {/* Month Header */}
              <div className="flex items-center space-x-2 px-1">
                <span className="text-2xl font-bold text-indigo-300">{data.monthName}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  {data.season}
                </span>
              </div>

              {/* Objects List for the Month */}
              <div className="space-y-4">
                {data.objects.map((obj) => (
                  <div 
                    key={obj.id}
                    onClick={() => setSelectedItem(obj)}
                    className="relative overflow-hidden bg-slate-900/40 backdrop-blur-sm border border-slate-800 hover:border-indigo-500/50 rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/10 group-hover:bg-slate-800/60"
                  >
                    <div className="h-32 w-full overflow-hidden relative">
                      <img 
                        src={obj.imagePlaceholder} 
                        alt={obj.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100 grayscale group-hover:grayscale-0"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                      <div className="absolute bottom-2 left-3">
                         <span className="text-xs text-indigo-200 font-medium tracking-wider uppercase bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-md">
                           {obj.type}
                         </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-slate-100 mb-1 flex items-center justify-between">
                        {obj.name}
                        <Calendar size={14} className="text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h3>
                      <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                        {obj.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredMonths.length === 0 && (
           <div className="text-center py-20">
             <div className="inline-block p-4 rounded-full bg-slate-800 mb-4">
                <Search size={32} className="text-slate-500" />
             </div>
             <p className="text-xl text-slate-300">검색 결과가 없습니다.</p>
             <p className="text-slate-500 mt-2">다른 검색어로 밤하늘을 찾아보세요.</p>
           </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 mt-12 border-t border-white/5 bg-slate-950 text-center text-slate-600 text-sm">
        <p>© 2024 StarGazer Project. Powered by Gemini API.</p>
      </footer>

      {/* Detail Modal */}
      {selectedItem && (
        <DetailModal 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )}

      {/* Simulated Install Toast */}
      {showInstallToast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-slate-800 border border-indigo-500/30 text-white px-6 py-4 rounded-xl shadow-2xl animate-fade-in-up flex items-center space-x-4 max-w-sm w-full mx-4">
          <div className="p-2 bg-indigo-600 rounded-lg shrink-0">
             <Download size={24} />
          </div>
          <div className="text-sm">
            <p className="font-bold mb-1">앱 설치하기</p>
            <p className="text-slate-300 text-xs">
              브라우저 메뉴에서 <strong>'홈 화면에 추가'</strong>를 선택하여 앱처럼 사용하세요.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
