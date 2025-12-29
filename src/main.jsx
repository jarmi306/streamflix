import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';
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
  CheckCircle2,
  List,
  User
} from 'lucide-react';

/** * STREAMFLIX PRO - CINEMATIC EXPANSION
 * Expanded database and category-based layout.
 */

// --- CONFIGURATION ---
const apiKey = ""; 

// --- EXPANDED MOVIE DATABASE ---
const MOVIE_DATABASE = [
  {
    id: "sintel",
    title: "Sintel",
    description: "A lonely young woman, Sintel, helps and befriends a small scaly dragon she calls Scales. When Scales is kidnapped, she begins a dangerous journey to find him.",
    rating: "98% Match",
    year: "2010",
    duration: "15m",
    genre: ["Fantasy", "Adventure"],
    image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=800&q=80",
    streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    categories: ['originals', 'trending']
  },
  {
    id: "tears-of-steel",
    title: "Tears of Steel",
    description: "In a future where robots have taken over, a group of scientists and soldiers attempt to restart a world-saving technology.",
    rating: "94% Match",
    year: "2012",
    duration: "12m",
    genre: ["Sci-Fi", "Action"],
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80",
    streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    categories: ['action', 'scifi', 'trending']
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
    categories: ['family', 'trending']
  },
  {
    id: "cosmos-laundromat",
    title: "Cosmos Laundromat",
    description: "On a desolate island, a suicidal sheep named Franck meets a quirky salesman who offers him the gift of a lifetime.",
    rating: "99% Match",
    year: "2015",
    duration: "13m",
    genre: ["Surreal", "Sci-Fi"],
    image: "https://images.unsplash.com/photo-1614728263952-84ea206f99b6?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1614728263952-84ea206f99b6?auto=format&fit=crop&w=800&q=80",
    streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/CosmosLaundromat.mp4",
    categories: ['originals', 'scifi']
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
    categories: ['scifi']
  },
  {
    id: "caminandes-1",
    title: "Caminandes: Llama Drama",
    description: "In the rugged mountains of Patagonia, a brave llama named Koro encounters a strange barrier blocking his path.",
    rating: "95% Match",
    year: "2013",
    duration: "2m",
    genre: ["Animation", "Comedy"],
    image: "https://images.unsplash.com/photo-1518112166137-85899ef05497?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1518112166137-85899ef05497?auto=format&fit=crop&w=800&q=80",
    streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    categories: ['family', 'originals']
  },
  {
    id: "caminandes-2",
    title: "Caminandes: Llamigos",
    description: "Koro the Llama is back, this time competing with a penguin for the last tasty snack in the Antarctic.",
    rating: "93% Match",
    year: "2016",
    duration: "3m",
    genre: ["Animation", "Comedy"],
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    categories: ['family', 'trending']
  },
  {
    id: "glass-half",
    title: "Glass Half",
    description: "A short comedy about subjectivity and how we see the world through different lenses.",
    rating: "88% Match",
    year: "2015",
    duration: "3m",
    genre: ["Animation", "Comedy"],
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80",
    streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    categories: ['family']
  }
];

// --- AI UTILITY ---
const callGemini = async (prompt, systemInstruction = "") => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined
  };
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Enjoy the show!";
  } catch (e) {
    return "The cinema AI is currently off-script, but the movies are still running!";
  }
};

// --- SUB-COMPONENTS ---

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

  return (
    <div className="fixed inset-0 z-[1000] bg-black flex items-center justify-center animate-fade-in">
      <div className="absolute top-0 w-full p-6 md:p-10 flex justify-between items-center z-50 bg-gradient-to-b from-black/90 to-transparent">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all">
            <ChevronLeft className="w-8 h-8" />
          </button>
          <div className="space-y-1">
            <h2 className="text-white text-xl md:text-2xl font-black tracking-tight">{movie.title}</h2>
            <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Streaming UHD 4K
            </div>
          </div>
        </div>
        <button onClick={onClose} className="text-white opacity-60 hover:opacity-100 transition-opacity"><X className="w-8 h-8" /></button>
      </div>

      <video 
        ref={videoRef}
        autoPlay 
        className="w-full h-full object-contain cursor-pointer"
        onTimeUpdate={() => setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100)}
        onClick={togglePlay}
        onEnded={onClose}
      >
        <source src={movie.streamUrl} type="video/mp4" />
      </video>

      <div className="absolute bottom-0 w-full p-6 md:p-12 bg-gradient-to-t from-black/90 to-transparent space-y-6">
        <div 
          className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden cursor-pointer group relative"
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
            <button onClick={togglePlay} className="hover:scale-110 transition-transform active:scale-90">
              {isPlaying ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current" />}
            </button>
            <button onClick={() => { if(videoRef.current) videoRef.current.currentTime -= 10 }} className="hover:text-zinc-300 transition-colors active:scale-90">
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

  if (movies.length === 0) return null;

  return (
    <div className="space-y-4 py-6 group/row">
      <h2 className="text-2xl md:text-3xl font-black text-zinc-100 px-6 md:px-12 flex items-center gap-2 group-hover/row:translate-x-1 transition-transform cursor-pointer">
        {title} <ChevronRight className="w-6 h-6 text-red-600 opacity-0 group-hover/row:opacity-100 transition-opacity" />
      </h2>
      <div className="relative">
        <button onClick={() => scroll('left')} className="absolute left-0 top-0 bottom-0 z-40 w-12 bg-black/60 opacity-0 group-hover/row:opacity-100 transition-all flex items-center justify-center text-white"><ChevronLeft className="w-10 h-10" /></button>
        <div ref={rowRef} className="flex gap-4 overflow-x-auto scrollbar-hide px-6 md:px-12 py-4">
          {movies.map(movie => (
            <div 
              key={movie.id}
              className="relative flex-none w-64 md:w-80 aspect-video rounded-xl overflow-hidden cursor-pointer group shadow-2xl transition-all duration-500 hover:scale-105 hover:z-50 border border-white/5"
              onClick={() => onSelect(movie)}
            >
              <img src={movie.thumb} className="w-full h-full object-cover group-hover:brightness-50 transition-all duration-500" alt={movie.title} />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all p-4 flex flex-col justify-end">
                <div className="flex gap-3 mb-4">
                  <div 
                    onClick={(e) => { e.stopPropagation(); onPlay(movie); }}
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black hover:bg-zinc-200 active:scale-90 transition-transform shadow-xl"
                  >
                    <Play fill="currentColor" size={18} />
                  </div>
                  <div className="w-10 h-10 rounded-full border border-zinc-500 flex items-center justify-center text-white hover:bg-white/10 active:scale-90 transition-transform"><Plus size={18} /></div>
                </div>
                <h3 className="text-white font-black text-sm uppercase tracking-wider line-clamp-1">{movie.title}</h3>
                <div className="flex gap-2 items-center mt-1">
                  <span className="text-green-500 font-bold text-xs">{movie.rating}</span>
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
        `Describe the cinematic tone and visual legacy of "${movie.title}".`,
        "You are an expert Hollywood film critic. Respond in two punchy, exciting sentences."
      );
      setInsight(res);
      setLoading(false);
    };
    fetchAI();
  }, [movie]);

  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 animate-fade-in overflow-hidden">
      <div className="bg-zinc-900 w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl relative border border-white/10 max-h-[95vh] overflow-y-auto scrollbar-hide animate-zoom-in">
        <button onClick={onClose} className="absolute top-6 right-6 z-50 p-2 bg-black/60 rounded-full text-white hover:bg-zinc-800 transition-all"><X /></button>
        
        <div className="relative h-[400px] md:h-[600px]">
          <img src={movie.image} className="w-full h-full object-cover" alt={movie.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
          <div className="absolute bottom-12 left-8 md:left-20 space-y-8 max-w-4xl">
            <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter drop-shadow-2xl uppercase">{movie.title}</h2>
            <div className="flex gap-4">
              <button 
                onClick={() => onPlay(movie)}
                className="flex items-center gap-4 bg-white text-black px-12 md:px-16 py-4 rounded-2xl font-black hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 shadow-2xl"
              >
                <Play fill="currentColor" className="w-7 h-7" /> Play Now
              </button>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-20 grid md:grid-cols-3 gap-16">
          <div className="md:col-span-2 space-y-12">
            <div className="flex items-center gap-6 text-zinc-400 font-black text-xs uppercase tracking-[0.2em]">
              <span className="text-green-500">{movie.rating}</span>
              <span>{movie.year}</span>
              <span className="border-2 px-2 py-0.5 rounded-md border-zinc-700 text-[10px]">UHD 4K</span>
              <span>{movie.duration}</span>
            </div>
            <p className="text-xl md:text-2xl text-zinc-200 leading-relaxed font-medium">{movie.description}</p>
            
            <div className="bg-red-600/5 border border-red-600/20 p-8 rounded-3xl space-y-4">
              <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-[0.3em]">
                <Sparkles className="w-4 h-4" /> AI Critical Insight
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

// --- MAIN APP COMPONENT ---

const App = () => {
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
    if (!query || query.length < 3) return;
    setIsMagicSearching(true);
    setAiFilter(null);
    try {
      const inventory = MOVIE_DATABASE.map(m => ({ id: m.id, title: m.title, desc: m.description }));
      const prompt = `Based on these movies: ${JSON.stringify(inventory)}, which match the user's vibe: "${query}"? Return ONLY a JSON array of IDs.`;
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
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-red-600/50">
      <style>{`
        body { background-color: #09090b !important; margin: 0; font-family: 'Inter', -apple-system, sans-serif; color: white; }
        #root { min-height: 100vh; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes zoom-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
        .animate-zoom-in { animation: zoom-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      {/* NAVBAR */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 px-6 md:px-12 py-5 flex items-center justify-between ${isScrolled ? 'bg-zinc-950 shadow-2xl border-b border-white/5' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
        <div className="flex items-center gap-12">
          <h1 className="text-red-600 text-3xl md:text-4xl font-black tracking-tighter uppercase cursor-pointer transition-transform active:scale-95">StreamFlix</h1>
          <ul className="hidden lg:flex items-center gap-8 text-xs font-black text-zinc-400 tracking-[0.2em] uppercase">
            <li className="text-white cursor-pointer">Home</li>
            <li className="hover:text-white cursor-pointer transition-colors">TV Shows</li>
            <li className="hover:text-white cursor-pointer transition-colors">Movies</li>
            <li className="hover:text-white cursor-pointer transition-colors">My List</li>
          </ul>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="hidden sm:flex items-center bg-black/40 border border-zinc-800 rounded-full px-5 py-2 focus-within:border-zinc-500 focus-within:bg-black/60 transition-all w-64 md:w-[400px] group shadow-inner">
            <Search className="w-4 h-4 text-zinc-500" />
            <input 
              className="bg-transparent border-none outline-none text-sm w-full ml-3 text-white placeholder-zinc-600"
              placeholder="Search or describe a vibe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleMagicSearch(searchQuery)}
            />
            {searchQuery.length > 2 && (
              <button 
                onClick={() => handleMagicSearch(searchQuery)}
                className="bg-red-600 hover:bg-red-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 ml-2"
              >
                {isMagicSearching ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                Mood
              </button>
            )}
          </div>
          <div className="flex items-center gap-6">
            <Bell className="w-5 h-5 text-zinc-400 hover:text-white cursor-pointer" />
            <div className="w-10 h-10 rounded-lg bg-indigo-600 overflow-hidden shadow-xl ring-2 ring-transparent hover:ring-white transition-all cursor-pointer">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
            </div>
          </div>
        </div>
      </nav>

      <main className="pb-32">
        {(!searchQuery && !aiFilter) ? (
          <>
            <div className="relative h-[90vh] w-full overflow-hidden">
              <img src={MOVIE_DATABASE[0].image} className="w-full h-full object-cover brightness-[0.35]" alt="hero" />
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
              <div className="absolute bottom-[20%] left-6 md:left-12 max-w-3xl space-y-8 animate-in slide-up">
                <div className="flex items-center gap-3">
                   <div className="bg-red-600 text-[10px] font-black px-2 py-1 rounded text-white tracking-[0.2em] uppercase shadow-lg">Original Series</div>
                   <div className="text-white text-xs font-black uppercase tracking-widest opacity-60">Season 1 Now Streaming</div>
                </div>
                <h2 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] uppercase italic">{MOVIE_DATABASE[0].title}</h2>
                <p className="text-zinc-300 text-xl md:text-2xl font-medium line-clamp-3 leading-relaxed max-w-2xl">{MOVIE_DATABASE[0].description}</p>
                <div className="flex gap-6">
                  <button onClick={() => setActiveStream(MOVIE_DATABASE[0])} className="flex items-center gap-4 bg-white text-black px-12 py-5 rounded-2xl font-black hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 shadow-2xl">
                    <Play fill="currentColor" size={24} /> Play Now
                  </button>
                  <button onClick={() => setSelectedMovie(MOVIE_DATABASE[0])} className="flex items-center gap-4 bg-zinc-800/40 text-white px-12 py-5 rounded-2xl font-black backdrop-blur-2xl border border-white/10 hover:bg-zinc-800/60 transition-all active:scale-95">
                    <Info size={24} /> More Info
                  </button>
                </div>
              </div>
            </div>

            <div className="relative -mt-48 z-10 space-y-16">
              <MovieRow title="StreamFlix Originals" movies={MOVIE_DATABASE.filter(m => m.categories.includes('originals'))} onSelect={setSelectedMovie} onPlay={setActiveStream} />
              <MovieRow title="Trending Now" movies={MOVIE_DATABASE.filter(m => m.categories.includes('trending'))} onSelect={setSelectedMovie} onPlay={setActiveStream} />
              <MovieRow title="Warp into Sci-Fi" movies={MOVIE_DATABASE.filter(m => m.categories.includes('scifi'))} onSelect={setSelectedMovie} onPlay={setActiveStream} />
              <MovieRow title="Explosive Action" movies={MOVIE_DATABASE.filter(m => m.categories.includes('action'))} onSelect={setSelectedMovie} onPlay={setActiveStream} />
              <MovieRow title="Family Favorites" movies={MOVIE_DATABASE.filter(m => m.categories.includes('family'))} onSelect={setSelectedMovie} onPlay={setActiveStream} />
            </div>
          </>
        ) : (
          <div className="pt-40 px-6 md:px-12 min-h-screen animate-fade-in">
             <div className="flex justify-between items-end mb-16 border-b border-zinc-900 pb-8">
               <div className="space-y-3">
                 <h2 className="text-red-600 text-xs font-black uppercase tracking-[0.4em]">Mood Search</h2>
                 <p className="text-4xl font-black tracking-tighter italic">"{searchQuery}"</p>
               </div>
               <button onClick={() => {setAiFilter(null); setSearchQuery("");}} className="text-zinc-500 hover:text-white font-black text-xs uppercase tracking-widest transition-colors">Reset</button>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                {filteredMovies.map(m => (
                  <div key={m.id} className="group cursor-pointer space-y-4" onClick={() => setSelectedMovie(m)}>
                    <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/5 shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:ring-4 ring-red-600/30">
                      <img src={m.thumb} className="w-full h-full object-cover" alt={m.title} />
                    </div>
                    <h4 className="text-white font-black text-xl tracking-tight group-hover:text-red-500 transition-colors">{m.title}</h4>
                  </div>
                ))}
             </div>
          </div>
        )}
      </main>

      <footer className="px-6 md:px-12 py-32 bg-zinc-950 border-t border-zinc-900 text-zinc-600 text-sm">
         <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-16 font-bold uppercase tracking-widest text-[10px]">
           <ul className="space-y-5"><li>Audio Description</li><li>Investor Relations</li><li>Privacy</li><li>Legal Notices</li></ul>
           <ul className="space-y-5"><li>Help Center</li><li>Jobs</li><li>Cookie Preferences</li><li>Corporate Information</li></ul>
           <ul className="space-y-5"><li>Gift Cards</li><li>Terms of Use</li><li>Service Code</li><li>Media Center</li></ul>
           <ul className="space-y-5"><li>StreamFlix Shop</li><li>Contact Us</li><li>© 2025 StreamFlix Cinema</li></ul>
         </div>
      </footer>

      {selectedMovie && <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} onPlay={setActiveStream} />}
      {activeStream && <CinematicPlayer movie={activeStream} onClose={() => setActiveStream(null)} />}
    </div>
  );
};

// --- MOUNT THE APP ---
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<React.StrictMode><App /></React.StrictMode>);
}

export default App;