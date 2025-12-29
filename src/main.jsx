import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Play, 
  Info, 
  Plus, 
  Search, 
  Bell, 
  X, 
  Volume2, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Loader2, 
  Pause, 
  RotateCcw, 
  CheckCircle2,
  ThumbsUp,
  Share2
} from 'lucide-react';

/** * SECTION 1: THE MOVIE DATABASE
 * Add, delete, or edit your movies here. 
 * 'poster' = Vertical image (for Originals)
 * 'backdrop' = Horizontal image (for Rows)
 */
const MOVIE_DATABASE = [
  // --- ORIGINALS (Vertical Style) ---
  {
    id: "sintel",
    title: "Sintel",
    description: "A lonely young woman, Sintel, helps and befriends a small scaly dragon she calls Scales. When Scales is kidnapped, she begins a dangerous journey.",
    rating: "98% Match",
    year: "2024",
    duration: "1h 25m",
    genre: ["Fantasy", "Adventure"],
    poster: "https://images.unsplash.com/photo-1614728263952-84ea206f99b6?auto=format&fit=crop&w=800&q=80",
    backdrop: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=1200&q=80",
    streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    categories: ['originals', 'trending']
  },
  {
    id: "neon-knights",
    title: "Neon Knights",
    description: "In a rain-soaked cyberpunk future, a rogue detective uncovers a conspiracy that threatens the city's digital soul.",
    rating: "95% Match",
    year: "2025",
    duration: "Season 1",
    genre: ["Sci-Fi", "Crime"],
    poster: "https://images.unsplash.com/photo-1605806616949-1e87b487fc2f?auto=format&fit=crop&w=800&q=80",
    backdrop: "https://images.unsplash.com/photo-1542382257-80dedb735070?auto=format&fit=crop&w=1200&q=80",
    streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    categories: ['originals', 'scifi']
  },
  {
    id: "ocean-breath",
    title: "Ocean's Breath",
    description: "An immersive look at the hidden depths of the Pacific, where creatures of light live in eternal darkness.",
    rating: "99% Match",
    year: "2024",
    duration: "1h 10m",
    genre: ["Nature", "Docuseries"],
    poster: "https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&w=800&q=80",
    backdrop: "https://images.unsplash.com/photo-1518467166778-b88f373ffec7?auto=format&fit=crop&w=1200&q=80",
    streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    categories: ['originals', 'family']
  },

  // --- TRENDING & ACTION ---
  {
    id: "tears-of-steel",
    title: "Tears of Steel",
    description: "In a future where robots have taken over, a group of scientists attempt to restart a world-saving technology using a captured robot.",
    rating: "94% Match",
    year: "2012",
    duration: "12m",
    genre: ["Sci-Fi", "Action"],
    poster: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=800&q=80",
    backdrop: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80",
    streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    categories: ['action', 'scifi', 'trending']
  },
  {
    id: "the-last-colony",
    title: "The Last Colony",
    description: "After Earth becomes uninhabitable, the last remnants of humanity struggle to survive on a desolate moon station.",
    rating: "91% Match",
    year: "2023",
    duration: "2h 5m",
    genre: ["Drama", "Sci-Fi"],
    poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    backdrop: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80",
    streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    categories: ['scifi', 'trending']
  },
  {
    id: "vanguard",
    title: "Vanguard",
    description: "An elite squad of soldiers is sent into a high-tech war zone to retrieve a lost AI core before it falls into the wrong hands.",
    rating: "89% Match",
    year: "2024",
    duration: "1h 45m",
    genre: ["Action", "Thriller"],
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80",
    backdrop: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80",
    streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    categories: ['action']
  },

  // --- FAMILY & COMEDY ---
  {
    id: "big-buck-bunny",
    title: "Big Buck Bunny",
    description: "A giant rabbit with a heart of gold is forced to take action against three bullying rodents who are terrorizing the forest creatures.",
    rating: "92% Match",
    year: "2008",
    duration: "10m",
    genre: ["Animation", "Comedy"],
    poster: "https://images.unsplash.com/photo-1585675100414-add2e465a136?auto=format&fit=crop&w=800&q=80",
    backdrop: "https://images.unsplash.com/photo-1585675100414-add2e465a136?auto=format&fit=crop&w=1200&q=80",
    streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    categories: ['family', 'trending']
  },
  {
    id: "llama-drama",
    title: "Llama Drama",
    description: "Koro the Llama encounters a series of hilarious obstacles in the mountains of Patagonia.",
    rating: "96% Match",
    year: "2024",
    duration: "Season 2",
    genre: ["Comedy", "Animation"],
    poster: "https://images.unsplash.com/photo-1518112166137-85899ef05497?auto=format&fit=crop&w=800&q=80",
    backdrop: "https://images.unsplash.com/photo-1518112166137-85899ef05497?auto=format&fit=crop&w=1200&q=80",
    streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    categories: ['family', 'trending']
  }
];

// --- AI UTILITY ---
const apiKey = ""; 
const callGemini = async (prompt, systemInstruction = "") => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined
  };
  try {
    const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Enjoy the show!";
  } catch (e) { return "AI unavailable. Enjoy the film!"; }
};

// --- COMPONENTS ---

const CinematicPlayer = ({ movie, onClose }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (videoRef.current?.paused) { videoRef.current.play(); setIsPlaying(true); }
    else { videoRef.current?.pause(); setIsPlaying(false); }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black flex items-center justify-center animate-fade-in">
      <div className="absolute top-0 w-full p-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/90 to-transparent">
        <button onClick={onClose} className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white"><ChevronLeft /></button>
        <h2 className="text-white text-lg font-black uppercase tracking-widest">{movie.title}</h2>
        <button onClick={onClose} className="text-white opacity-60 hover:opacity-100"><X /></button>
      </div>
      <video ref={videoRef} autoPlay className="w-full h-full object-contain cursor-pointer" onTimeUpdate={() => setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100)} onClick={togglePlay} onEnded={onClose}>
        <source src={movie.streamUrl} type="video/mp4" />
      </video>
      <div className="absolute bottom-0 w-full p-6 md:p-12 bg-gradient-to-t from-black/90 to-transparent space-y-4">
        <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden cursor-pointer" onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pos = (e.clientX - rect.left) / rect.width;
          videoRef.current.currentTime = pos * videoRef.current.duration;
        }}>
          <div className="bg-red-600 h-full" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center gap-8 text-white">
          <button onClick={togglePlay}>{isPlaying ? <Pause size={32} /> : <Play size={32} fill="currentColor" />}</button>
          <button onClick={() => videoRef.current.currentTime -= 10}><RotateCcw /></button>
          <Volume2 className="opacity-60" />
        </div>
      </div>
    </div>
  );
};

const MovieRow = ({ title, movies, onSelect, onPlay, isOriginals = false }) => {
  const rowRef = useRef(null);
  const scroll = (dir) => { rowRef.current.scrollBy({ left: dir === 'left' ? -600 : 600, behavior: 'smooth' }); };

  return (
    <div className="space-y-4 py-4 group/row">
      <h2 className="text-xl md:text-2xl font-black text-zinc-100 px-6 md:px-12 flex items-center gap-2 group-hover/row:translate-x-1 transition-transform">
        {title} <ChevronRight className="text-red-600 opacity-0 group-hover/row:opacity-100 transition-opacity" />
      </h2>
      <div className="relative">
        <button onClick={() => scroll('left')} className="absolute left-0 top-0 bottom-0 z-40 w-12 bg-black/60 opacity-0 group-hover/row:opacity-100 transition-all flex items-center justify-center text-white"><ChevronLeft size={32} /></button>
        <div ref={rowRef} className="flex gap-3 overflow-x-auto scrollbar-hide px-6 md:px-12 py-4">
          {movies.map(movie => (
            <div 
              key={movie.id} 
              onClick={() => onSelect(movie)}
              className={`relative flex-none rounded-md overflow-hidden cursor-pointer group shadow-2xl transition-all duration-500 hover:scale-110 hover:z-50 border border-white/5 ${isOriginals ? 'w-40 md:w-56 aspect-[2/3]' : 'w-64 md:w-80 aspect-video'}`}
            >
              <img src={isOriginals ? movie.poster : movie.backdrop} className="w-full h-full object-cover" alt={movie.title} />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all p-4 flex flex-col justify-end">
                <div className="flex gap-2 mb-2">
                   <div onClick={(e) => { e.stopPropagation(); onPlay(movie); }} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black hover:bg-zinc-200"><Play fill="currentColor" size={14} /></div>
                   <div className="w-8 h-8 rounded-full border border-zinc-500 flex items-center justify-center text-white"><Plus size={14} /></div>
                </div>
                <h3 className="text-white font-black text-[10px] uppercase tracking-wider truncate">{movie.title}</h3>
                <span className="text-green-500 font-bold text-[10px]">{movie.rating}</span>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => scroll('right')} className="absolute right-0 top-0 bottom-0 z-40 w-12 bg-black/60 opacity-0 group-hover/row:opacity-100 transition-all flex items-center justify-center text-white"><ChevronRight size={32} /></button>
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
      const res = await callGemini(`Describe the tone of "${movie.title}".`, "Expert film critic. Two punchy sentences.");
      setInsight(res);
      setLoading(false);
    };
    fetchAI();
  }, [movie]);

  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-[500] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 animate-fade-in">
      <div className="bg-zinc-900 w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl relative border border-white/10 max-h-[90vh] overflow-y-auto scrollbar-hide animate-zoom-in">
        <button onClick={onClose} className="absolute top-6 right-6 z-50 p-2 bg-black/60 rounded-full text-white hover:bg-zinc-800"><X /></button>
        <div className="relative h-[300px] md:h-[500px]">
          <img src={movie.backdrop} className="w-full h-full object-cover" alt={movie.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
          <div className="absolute bottom-10 left-10 space-y-6 max-w-2xl">
            <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase italic">{movie.title}</h2>
            <div className="flex gap-4">
              <button onClick={() => onPlay(movie)} className="flex items-center gap-3 bg-white text-black px-10 py-3 rounded-md font-black hover:bg-zinc-200 transition-all active:scale-95 shadow-xl"><Play fill="currentColor" /> Play</button>
              <button className="flex items-center justify-center p-3 border-2 border-zinc-600 rounded-full text-white hover:bg-white/10"><Plus /></button>
            </div>
          </div>
        </div>
        <div className="p-8 md:p-12 grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-8">
            <div className="flex items-center gap-6 text-zinc-400 font-black text-xs tracking-widest">
              <span className="text-green-500">{movie.rating}</span>
              <span>{movie.year}</span>
              <span className="border border-zinc-700 px-2 rounded">4K UHD</span>
              <span>{movie.duration}</span>
            </div>
            <p className="text-lg md:text-xl text-zinc-200 leading-relaxed">{movie.description}</p>
            <div className="bg-red-600/5 border border-red-600/20 p-6 rounded-xl">
              <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-[0.3em] mb-3"><Sparkles size={14} /> AI Perspective</div>
              {loading ? <div className="animate-pulse text-zinc-600 text-sm">Generating critique...</div> : <p className="text-zinc-300 italic font-serif leading-relaxed">"{insight}"</p>}
            </div>
          </div>
          <div className="space-y-6 text-sm">
            <div><span className="text-zinc-600 uppercase font-black text-[10px] block mb-1">Genres</span><span className="text-zinc-300">{movie.genre.join(', ')}</span></div>
            <div><span className="text-zinc-600 uppercase font-black text-[10px] block mb-1">Maturity Rating</span><span className="border border-zinc-700 px-2 py-1 rounded text-white">TV-MA</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- APP ---

const App = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [activeStream, setActiveStream] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [aiFilter, setAiFilter] = useState(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredMovies = useMemo(() => {
    if (aiFilter) return MOVIE_DATABASE.filter(m => aiFilter.includes(m.id));
    if (!searchQuery) return MOVIE_DATABASE;
    return MOVIE_DATABASE.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, aiFilter]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-red-600/50">
      <style>{`
        body { background-color: #09090b !important; margin: 0; font-family: 'Inter', sans-serif; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes zoom-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
        .animate-zoom-in { animation: zoom-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 px-6 md:px-12 py-5 flex items-center justify-between ${isScrolled ? 'bg-zinc-950 shadow-2xl border-b border-white/5' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
        <div className="flex items-center gap-12">
          <h1 className="text-red-600 text-3xl md:text-4xl font-black tracking-tighter uppercase cursor-pointer transition-transform active:scale-95">StreamFlix</h1>
          <ul className="hidden lg:flex items-center gap-8 text-[10px] font-black text-zinc-400 tracking-[0.2em] uppercase">
            <li className="text-white cursor-pointer">Home</li>
            <li className="hover:text-white cursor-pointer transition-colors">TV Shows</li>
            <li className="hover:text-white cursor-pointer transition-colors">Movies</li>
            <li className="hover:text-white cursor-pointer transition-colors">My List</li>
          </ul>
        </div>
        <div className="flex items-center gap-8">
          <div className="hidden sm:flex items-center bg-black/40 border border-zinc-800 rounded-full px-5 py-2 focus-within:border-zinc-500 transition-all w-64 md:w-[350px] group">
            <Search className="w-4 h-4 text-zinc-500" />
            <input className="bg-transparent border-none outline-none text-sm w-full ml-3 text-white placeholder-zinc-600" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <div className="w-9 h-9 rounded bg-indigo-600 overflow-hidden shadow-xl ring-2 ring-transparent hover:ring-white transition-all cursor-pointer">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
          </div>
        </div>
      </nav>

      <main className="pb-32">
        {!searchQuery ? (
          <>
            <div className="relative h-[85vh] w-full overflow-hidden">
              <img src={MOVIE_DATABASE[0].backdrop} className="w-full h-full object-cover brightness-[0.4] transition-transform duration-[20s] hover:scale-110" alt="hero" />
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
              <div className="absolute bottom-[20%] left-6 md:left-12 max-w-3xl space-y-6 animate-fade-in">
                <div className="flex items-center gap-3">
                   <div className="bg-red-600 text-[9px] font-black px-2 py-1 rounded text-white tracking-[0.2em] uppercase shadow-lg">New Release</div>
                </div>
                <h2 className="text-6xl md:text-9xl font-black tracking-tighter leading-none uppercase italic">{MOVIE_DATABASE[0].title}</h2>
                <p className="text-zinc-300 text-lg md:text-xl line-clamp-3 leading-relaxed max-w-2xl">{MOVIE_DATABASE[0].description}</p>
                <div className="flex gap-4 pt-4">
                  <button onClick={() => setActiveStream(MOVIE_DATABASE[0])} className="flex items-center gap-3 bg-white text-black px-12 py-3 rounded-md font-black hover:bg-zinc-200 transition-all active:scale-95 shadow-2xl"><Play fill="currentColor" /> Play</button>
                  <button onClick={() => setSelectedMovie(MOVIE_DATABASE[0])} className="flex items-center gap-3 bg-zinc-800/60 text-white px-12 py-3 rounded-md font-black backdrop-blur-md border border-white/10 hover:bg-zinc-800/80 transition-all active:scale-95"><Info /> More Info</button>
                </div>
              </div>
            </div>

            <div className="relative -mt-32 z-10 space-y-12">
              <MovieRow title="StreamFlix Originals" movies={MOVIE_DATABASE.filter(m => m.categories.includes('originals'))} onSelect={setSelectedMovie} onPlay={setActiveStream} isOriginals={true} />
              <MovieRow title="Trending Now" movies={MOVIE_DATABASE.filter(m => m.categories.includes('trending'))} onSelect={setSelectedMovie} onPlay={setActiveStream} />
              <MovieRow title="Warp into Sci-Fi" movies={MOVIE_DATABASE.filter(m => m.categories.includes('scifi'))} onSelect={setSelectedMovie} onPlay={setActiveStream} />
              <MovieRow title="Explosive Action" movies={MOVIE_DATABASE.filter(m => m.categories.includes('action'))} onSelect={setSelectedMovie} onPlay={setActiveStream} />
              <MovieRow title="Family Favorites" movies={MOVIE_DATABASE.filter(m => m.categories.includes('family'))} onSelect={setSelectedMovie} onPlay={setActiveStream} />
            </div>
          </>
        ) : (
          <div className="pt-32 px-6 md:px-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-fade-in">
             {filteredMovies.map(m => (
               <div key={m.id} className="group cursor-pointer space-y-2" onClick={() => setSelectedMovie(m)}>
                 <div className="relative aspect-video rounded-md overflow-hidden border border-white/5 transition-all duration-300 group-hover:scale-105 group-hover:ring-4 ring-red-600/30">
                    <img src={m.backdrop} className="w-full h-full object-cover" alt={m.title} />
                 </div>
                 <h4 className="text-white font-black text-xs uppercase tracking-wider truncate">{m.title}</h4>
               </div>
             ))}
          </div>
        )}
      </main>

      <footer className="px-6 md:px-12 py-24 bg-zinc-950 border-t border-zinc-900 text-zinc-600 text-[10px] font-black tracking-widest uppercase">
         <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
           <ul className="space-y-4"><li>Privacy Policy</li><li>Help Center</li><li>Netflix Shop</li></ul>
           <ul className="space-y-4"><li>Investor Relations</li><li>Terms of Use</li><li>Contact Us</li></ul>
           <ul className="space-y-4"><li>Legal Notices</li><li>Media Center</li><li>Gift Cards</li></ul>
           <ul className="space-y-4"><li>© 2025 StreamFlix Cinema</li></ul>
         </div>
      </footer>

      {selectedMovie && <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} onPlay={setActiveStream} />}
      {activeStream && <CinematicPlayer movie={activeStream} onClose={() => setActiveStream(null)} />}
    </div>
  );
};

// --- MOUNT ---
const rootElement = document.getElementById('root');
if (rootElement) { createRoot(rootElement).render(<React.StrictMode><App /></React.StrictMode>); }
export default App;