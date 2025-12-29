import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
  Play, 
  Info, 
  Plus, 
  Search, 
  Bell, 
  ChevronDown, 
  X, 
  ThumbsUp, 
  Volume2, 
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Loader2,
  Pause,
  RotateCcw,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

// --- CONFIGURATION ---
const apiKey = ""; // Runtime provided

// --- STABLE VIDEO DATABASE ---
const MOVIE_DATABASE = [
  {
    id: "sintel",
    title: "Sintel",
    description: "A lonely young woman, Sintel, helps and befriends a small scaly dragon she calls Scales. When Scales is kidnapped, she begins a dangerous journey to find him.",
    rating: "98% Match",
    year: "2010",
    duration: "15m",
    genre: ["Animation", "Fantasy", "Adventure"],
    image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=800&q=80",
    streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    category: ['trending', 'popular']
  },
  {
    id: "tears-of-steel",
    title: "Tears of Steel",
    description: "In a future where robots have taken over, a group of scientists attempts to restart a world-saving technology using a captured robot.",
    rating: "94% Match",
    year: "2012",
    duration: "12m",
    genre: ["Sci-Fi", "Action"],
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80",
    streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    category: ['trending', 'scifi']
  },
  {
    id: "big-buck-bunny",
    title: "Big Buck Bunny",
    description: "A giant rabbit with a heart of gold is forced to take action against three bullying rodents who are terrorizing the forest creatures.",
    rating: "92% Match",
    year: "2008",
    duration: "10m",
    genre: ["Animation", "Comedy"],
    image: "https://images.unsplash.com/photo-1585675100414-add2e465a136?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1585675100414-add2e465a136?auto=format&fit=crop&w=800&q=80",
    streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    category: ['popular', 'animation']
  },
  {
    id: "elephants-dream",
    title: "Elephants Dream",
    description: "Friends Proog and Emo explore a complex and surreal world of machines and strange architecture.",
    rating: "90% Match",
    year: "2006",
    duration: "11m",
    genre: ["Sci-Fi", "Surreal"],
    image: "https://images.unsplash.com/photo-1535016120720-40c646bebbfc?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1535016120720-40c646bebbfc?auto=format&fit=crop&w=800&q=80",
    streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    category: ['scifi', 'classic']
  }
];

// --- AI UTILITY ---
const callGemini = async (prompt, systemInstruction = "") => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined
  };

  let delay = 1000;
  for (let i = 0; i < 5; i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Enjoy the show!";
    } catch (e) {
      if (i === 4) return "Failed to reach the AI. Sit back and enjoy the movie!";
      await new Promise(r => setTimeout(r, delay));
      delay *= 2;
    }
  }
};

// --- COMPONENTS ---

const CinematicPlayer = ({ movie, onClose }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (videoRef.current?.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black flex items-center justify-center">
      <div className="absolute top-0 w-full p-6 md:p-10 flex justify-between items-center z-50 bg-gradient-to-b from-black/90 to-transparent">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all">
            <ChevronLeft className="w-8 h-8" />
          </button>
          <div className="space-y-1">
            <h2 className="text-white text-xl md:text-2xl font-black tracking-tight">{movie.title}</h2>
            <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Streaming 1080p
            </div>
          </div>
        </div>
        <button onClick={onClose} className="text-white opacity-60 hover:opacity-100 transition-opacity"><X className="w-8 h-8" /></button>
      </div>

      <video 
        ref={videoRef}
        autoPlay 
        className="w-full h-full object-contain cursor-pointer"
        onTimeUpdate={handleTimeUpdate}
        onClick={togglePlay}
        onEnded={onClose}
      >
        <source src={movie.streamUrl} type="video/mp4" />
      </video>

      <div className="absolute bottom-0 w-full p-6 md:p-12 bg-gradient-to-t from-black/90 to-transparent space-y-6">
        <div 
          className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden cursor-pointer group"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            if (videoRef.current) videoRef.current.currentTime = pos * videoRef.current.duration;
          }}
        >
          <div className="bg-red-600 h-full group-hover:bg-red-500 transition-all duration-150" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-8">
            <button onClick={togglePlay} className="hover:scale-110 transition-transform">
              {isPlaying ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current" />}
            </button>
            <button onClick={() => { if(videoRef.current) videoRef.current.currentTime -= 10 }} className="hover:text-zinc-300 transition-colors">
              <RotateCcw className="w-7 h-7" />
            </button>
            <Volume2 className="w-7 h-7 opacity-60 hover:opacity-100 cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
};

const MovieRow = ({ title, movies, onSelect, onPlay }) => {
  const rowRef = useRef(null);
  const scroll = (dir) => {
    if (rowRef.current) {
      const scrollAmount = dir === 'left' ? -600 : 600;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-4 py-6 group/row">
      <h2 className="text-2xl md:text-3xl font-black text-zinc-100 px-4 md:px-12 flex items-center gap-2 group-hover/row:translate-x-1 transition-transform cursor-pointer">
        {title} <ChevronRight className="w-6 h-6 text-red-600 opacity-0 group-hover/row:opacity-100 transition-opacity" />
      </h2>
      <div className="relative">
        <button onClick={() => scroll('left')} className="absolute left-0 top-0 bottom-0 z-40 w-12 bg-black/60 opacity-0 group-hover/row:opacity-100 transition-all flex items-center justify-center text-white"><ChevronLeft className="w-10 h-10" /></button>
        <div ref={rowRef} className="flex gap-4 overflow-x-auto scrollbar-hide px-4 md:px-12 py-4">
          {movies.map(movie => (
            <div 
              key={movie.id}
              className="relative flex-none w-64 md:w-80 aspect-video rounded-xl overflow-hidden cursor-pointer group shadow-2xl transition-all duration-500 hover:scale-110 hover:z-50 border border-white/5"
              onClick={() => onSelect(movie)}
            >
              <img src={movie.thumb} className="w-full h-full object-cover" alt={movie.title} />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all p-4 flex flex-col justify-end">
                <div className="flex gap-3 mb-4">
                  <div 
                    onClick={(e) => { e.stopPropagation(); onPlay(movie); }}
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black hover:bg-zinc-200 shadow-xl"
                  >
                    <Play fill="currentColor" size={18} />
                  </div>
                  <div className="w-10 h-10 rounded-full border border-zinc-500 flex items-center justify-center text-white hover:bg-white/10"><Plus size={18} /></div>
                </div>
                <h3 className="text-white font-black text-sm uppercase tracking-wider">{movie.title}</h3>
                <div className="flex gap-2 items-center mt-1">
                  <span className="text-green-500 font-bold text-xs">{movie.rating}</span>
                  <span className="text-[10px] text-zinc-400 border border-zinc-700 px-1 rounded uppercase">Full Stream</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => scroll('right')} className="absolute right-0 top-0 bottom-0 z-40 w-12 bg-black/60 opacity-0 group-hover/row:opacity-100 transition-all flex items-center justify-center text-white"><ChevronRight className="w-10 h-10" /></button>
      </div>
    </div>
  );
};

const MovieModal = ({ movie, onClose, onPlay }) => {
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!movie) return;
    const fetchAI = async () => {
      setLoading(true);
      const res = await callGemini(
        `Why is "${movie.title}" a cinematic masterpiece? Focus on its legacy and visual tone.`,
        "You are an expert Hollywood film critic. Respond in two exciting, punchy sentences."
      );
      setInsight(res);
      setLoading(false);
    };
    fetchAI();
  }, [movie]);

  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8">
      <div className="bg-zinc-900 w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl relative border border-white/10 max-h-[95vh] overflow-y-auto scrollbar-hide">
        <button onClick={onClose} className="absolute top-6 right-6 z-50 p-2 bg-black/60 rounded-full text-white hover:bg-zinc-800 transition-all"><X /></button>
        
        <div className="relative h-[400px] md:h-[600px]">
          <img src={movie.image} className="w-full h-full object-cover" alt={movie.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/30 to-transparent" />
          <div className="absolute bottom-12 left-8 md:left-20 space-y-8">
            <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter drop-shadow-2xl">{movie.title}</h2>
            <div className="flex gap-4">
              <button 
                onClick={() => onPlay(movie)}
                className="flex items-center gap-4 bg-white text-black px-12 md:px-16 py-4 rounded-2xl font-black hover:bg-zinc-200 transition-all hover:scale-105 shadow-2xl"
              >
                <Play fill="currentColor" className="w-7 h-7" /> Play Now
              </button>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-20 grid md:grid-cols-3 gap-16">
          <div className="md:col-span-2 space-y-12">
            <div className="flex items-center gap-6 text-zinc-400 font-black text-sm uppercase tracking-widest">
              <span className="text-green-500">{movie.rating}</span>
              <span>{movie.year}</span>
              <span className="border-2 px-2 py-0.5 rounded-md border-zinc-700 text-xs">UHD 4K</span>
              <span>{movie.duration}</span>
            </div>
            <p className="text-xl md:text-2xl text-zinc-200 leading-relaxed font-medium">{movie.description}</p>
            
            <div className="bg-red-600/5 border border-red-600/20 p-8 rounded-3xl space-y-4">
              <div className="flex items-center gap-2 text-red-500 text-xs font-black uppercase tracking-widest">
                <Sparkles className="w-5 h-5" /> AI Critical Insight
              </div>
              {loading ? (
                <div className="flex items-center gap-3 text-zinc-600 animate-pulse">
                  <Loader2 className="animate-spin w-5 h-5" /> 
                  Analysing directorial style...
                </div>
              ) : (
                <p className="text-zinc-300 text-lg italic leading-relaxed font-serif">"{insight}"</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [activeStream, setActiveStream] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [aiFilter, setAiFilter] = useState(null);
  const [isMagicSearching, setIsMagicSearching] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMagicSearch = async (query) => {
    if (!query) return;
    setIsMagicSearching(true);
    setAiFilter(null);
    try {
      const inventory = MOVIE_DATABASE.map(m => ({ id: m.id, title: m.title, desc: m.description }));
      const prompt = `Based on these movies: ${JSON.stringify(inventory)}, which match the vibe: "${query}"? Return ONLY a JSON array of IDs.`;
      const res = await callGemini(prompt, "You are a movie concierge. Return ONLY a JSON array.");
      const cleaned = res.replace(/```json|```/g, '').trim();
      const ids = JSON.parse(cleaned);
      if (Array.isArray(ids)) setAiFilter(ids);
    } catch (e) {
      console.error("AI Search Error:", e);
    } finally {
      setIsMagicSearching(false);
    }
  };

  const filteredMovies = useMemo(() => {
    if (aiFilter) return MOVIE_DATABASE.filter(m => aiFilter.includes(m.id));
    if (!searchQuery) return MOVIE_DATABASE;
    return MOVIE_DATABASE.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, aiFilter]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 px-6 md:px-12 py-5 flex items-center justify-between ${isScrolled ? 'bg-zinc-950 shadow-2xl border-b border-white/5' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
        <div className="flex items-center gap-12">
          <h1 className="text-red-600 text-3xl md:text-4xl font-black tracking-tighter uppercase cursor-pointer select-none">StreamFlix</h1>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="hidden sm:flex items-center bg-black/40 border border-zinc-800 rounded-full px-5 py-2.5 focus-within:border-zinc-500 transition-all w-64 md:w-[450px] group shadow-inner">
            <Search className="w-4 h-4 text-zinc-500" />
            <input 
              className="bg-transparent border-none outline-none text-sm w-full ml-3"
              placeholder="Search or describe a vibe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery.length > 2 && (
              <button 
                onClick={() => handleMagicSearch(searchQuery)}
                disabled={isMagicSearching}
                className="bg-red-600 hover:bg-red-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                {isMagicSearching ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                AI
              </button>
            )}
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-600 overflow-hidden shadow-xl">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Max" alt="avatar" />
          </div>
        </div>
      </nav>

      <main className="pb-32">
        {(!searchQuery && !aiFilter) ? (
          <>
            <div className="relative h-[90vh] w-full overflow-hidden">
              <img src={MOVIE_DATABASE[0].image} className="w-full h-full object-cover brightness-[0.3]" alt="hero" />
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
              <div className="absolute bottom-[20%] left-6 md:left-12 max-w-3xl space-y-8">
                <h2 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85]">{MOVIE_DATABASE[0].title}</h2>
                <p className="text-zinc-300 text-xl md:text-2xl font-medium line-clamp-3 leading-relaxed max-w-2xl">{MOVIE_DATABASE[0].description}</p>
                <div className="flex gap-6">
                  <button 
                    onClick={() => setActiveStream(MOVIE_DATABASE[0])}
                    className="flex items-center gap-4 bg-white text-black px-12 py-5 rounded-2xl font-black hover:bg-zinc-200 transition-all hover:scale-105 shadow-2xl"
                  >
                    <Play fill="currentColor" size={24} /> Play Now
                  </button>
                  <button 
                    onClick={() => setSelectedMovie(MOVIE_DATABASE[0])}
                    className="flex items-center gap-4 bg-zinc-400/20 text-white px-12 py-5 rounded-2xl font-black backdrop-blur-2xl border border-white/10"
                  >
                    <Info size={24} /> More Info
                  </button>
                </div>
              </div>
            </div>

            <div className="relative -mt-40 z-10 space-y-16">
              <MovieRow title="Trending Across StreamFlix" movies={MOVIE_DATABASE} onSelect={setSelectedMovie} onPlay={setActiveStream} />
            </div>
          </>
        ) : (
          <div className="pt-40 px-6 md:px-12 min-h-screen">
             <div className="flex justify-between items-end mb-16 border-b border-zinc-900 pb-8">
               <div className="space-y-2">
                 <h2 className="text-zinc-500 text-xl font-black uppercase tracking-widest">Discovery Results</h2>
                 <p className="text-4xl font-black">
                   {aiFilter ? <span>✨ Inspired by: <span className="text-red-600 italic">"{searchQuery}"</span></span> : <span>Found for: <span className="text-white">"{searchQuery}"</span></span>}
                 </p>
               </div>
               {aiFilter && <button onClick={() => setAiFilter(null)} className="text-red-500 font-black text-sm uppercase tracking-widest border-b-2 border-red-500/20 hover:border-red-500 transition-all pb-1">Reset Search</button>}
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                {filteredMovies.map(m => (
                  <div key={m.id} className="group cursor-pointer space-y-4" onClick={() => setSelectedMovie(m)}>
                    <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/5 shadow-2xl transition-all duration-500 group-hover:scale-105">
                      <img src={m.thumb} className="w-full h-full object-cover" alt={m.title} />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                        <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                          <Play fill="currentColor" size={28} />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-white font-black text-xl tracking-tight">{m.title}</h4>
                      <p className="text-zinc-500 text-sm font-medium">{m.year} • {m.genre[0]}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </main>

      {selectedMovie && <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} onPlay={setActiveStream} />}
      {activeStream && <CinematicPlayer movie={activeStream} onClose={() => setActiveStream(null)} />}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}