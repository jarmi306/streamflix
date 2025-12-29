import React, { useState, useEffect, useMemo, useRef } from 'react';
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

/** * STREAMFLIX PRO - CONSOLIDATED VERSION
 * Everything is in one file to prevent "Could not resolve" errors.
 */

// --- CONFIGURATION ---
const apiKey = ""; // Runtime provided

// --- MOVIE DATABASE ---
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
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21ai?auto=format&fit=crop&w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1446776811953-b23d57bd21ai?auto=format&fit=crop&w=800&q=80",
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

// --- AI LOGIC ---
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
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Enjoy the cinematic experience!";
  } catch (e) {
    return "The movie AI is currently offline, but the show must go on!";
  }
};

// --- SUB-COMPONENTS ---

const VideoPlayer = ({ movie, onClose }) => {
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
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
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
              Streaming UHD
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
          className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            if (videoRef.current) videoRef.current.currentTime = pos * videoRef.current.duration;
          }}
        >
          <div className="bg-red-600 h-full transition-all duration-150" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-8">
            <button onClick={togglePlay} className="hover:scale-110 transition-transform">
              {isPlaying ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current" />}
            </button>
            <button onClick={() => { if(videoRef.current) videoRef.current.currentTime -= 10 }} className="hover:text-zinc-300 transition-colors">
              <RotateCcw className="w-7 h-7" />
            </button>
            <Volume2 className="w-7 h-7 opacity-60" />
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
      const amt = dir === 'left' ? -500 : 500;
      rowRef.current.scrollBy({ left: amt, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-4 py-6 px-4 md:px-12 group/row">
      <h2 className="text-2xl font-black text-zinc-100 flex items-center gap-2 group-hover/row:translate-x-1 transition-transform">
        {title} <ChevronRight className="w-5 h-5 text-red-600 opacity-0 group-hover/row:opacity-100 transition-opacity" />
      </h2>
      <div className="relative">
        <button onClick={() => scroll('left')} className="absolute left-0 top-0 bottom-0 z-40 w-10 bg-black/60 opacity-0 group-hover/row:opacity-100 transition-all flex items-center justify-center text-white"><ChevronLeft /></button>
        <div ref={rowRef} className="flex gap-4 overflow-x-auto scrollbar-hide py-4">
          {movies.map(movie => (
            <div 
              key={movie.id}
              className="relative flex-none w-64 md:w-80 aspect-video rounded-xl overflow-hidden cursor-pointer group shadow-xl transition-all duration-500 hover:scale-110 hover:z-50 border border-white/5"
              onClick={() => onSelect(movie)}
            >
              <img src={movie.thumb} className="w-full h-full object-cover" alt={movie.title} />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all p-4 flex flex-col justify-end">
                <div className="flex gap-3 mb-4">
                  <div 
                    onClick={(e) => { e.stopPropagation(); onPlay(movie); }}
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black hover:bg-zinc-200"
                  >
                    <Play fill="currentColor" size={16} />
                  </div>
                  <div className="w-10 h-10 rounded-full border border-zinc-500 flex items-center justify-center text-white"><Plus size={16} /></div>
                </div>
                <h3 className="text-white font-bold text-sm tracking-wide">{movie.title}</h3>
                <span className="text-green-500 font-bold text-xs">{movie.rating}</span>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => scroll('right')} className="absolute right-0 top-0 bottom-0 z-40 w-10 bg-black/60 opacity-0 group-hover/row:opacity-100 transition-all flex items-center justify-center text-white"><ChevronRight /></button>
      </div>
    </div>
  );
};

const MovieDetailsModal = ({ movie, onClose, onPlay }) => {
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!movie) return;
    const fetchAI = async () => {
      setLoading(true);
      const res = await callGemini(`Tell me why ${movie.title} is worth watching.`);
      setInsight(res);
      setLoading(false);
    };
    fetchAI();
  }, [movie]);

  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-[500] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-900 w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl relative border border-white/10 max-h-[90vh] overflow-y-auto scrollbar-hide animate-zoom-in">
        <button onClick={onClose} className="absolute top-6 right-6 z-50 p-2 bg-black/60 rounded-full text-white"><X /></button>
        <div className="relative h-[300px] md:h-[500px]">
          <img src={movie.image} className="w-full h-full object-cover" alt={movie.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
          <div className="absolute bottom-10 left-10 space-y-4">
            <h2 className="text-4xl md:text-7xl font-black text-white">{movie.title}</h2>
            <button 
              onClick={() => onPlay(movie)}
              className="flex items-center gap-3 bg-white text-black px-10 py-3 rounded-xl font-black hover:bg-zinc-200 transition-all"
            >
              <Play fill="currentColor" /> Play
            </button>
          </div>
        </div>
        <div className="p-8 md:p-12 space-y-8">
          <div className="flex items-center gap-4 text-zinc-400 font-bold text-sm tracking-widest">
            <span className="text-green-500">{movie.rating}</span>
            <span>{movie.year}</span>
            <span className="border border-zinc-700 px-2 rounded">4K</span>
            <span>{movie.duration}</span>
          </div>
          <p className="text-zinc-200 text-lg md:text-xl leading-relaxed">{movie.description}</p>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <div className="text-red-500 text-xs font-black mb-2 flex items-center gap-2">
              <Sparkles size={14} /> AI PERSPECTIVE
            </div>
            {loading ? <div className="animate-pulse text-zinc-500">Generating insight...</div> : <p className="text-zinc-400 italic font-serif">"{insight}"</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

export default function App() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [activeStream, setActiveStream] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-red-600/50">
      <style>{`
        /* GLOBAL RESET & FALLBACKS */
        body, html, #root { 
          margin: 0; padding: 0; background-color: #09090b !important; color: white !important; min-height: 100vh; overflow-x: hidden;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes zoom-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
        .animate-zoom-in { animation: zoom-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      {/* NAVBAR */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 px-6 md:px-12 py-4 flex items-center justify-between ${isScrolled ? 'bg-zinc-950 shadow-2xl border-b border-white/5' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
        <h1 className="text-red-600 text-3xl font-black tracking-tighter uppercase cursor-pointer">StreamFlix</h1>
        <div className="flex items-center gap-6">
          <Search className="w-5 h-5 cursor-pointer hover:text-red-500 transition-colors" />
          <div className="w-8 h-8 rounded bg-indigo-600 overflow-hidden shadow-lg border border-white/20">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Max" alt="user" />
          </div>
        </div>
      </nav>

      <main className="pb-20">
        {/* HERO SECTION */}
        <div className="relative h-[85vh] w-full overflow-hidden">
          <img src={MOVIE_DATABASE[0].image} className="w-full h-full object-cover brightness-[0.4]" alt="hero" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
          <div className="absolute bottom-[15%] left-6 md:left-12 max-w-2xl space-y-6">
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-none">{MOVIE_DATABASE[0].title}</h2>
            <p className="text-zinc-400 text-lg md:text-xl font-medium line-clamp-3">{MOVIE_DATABASE[0].description}</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setActiveStream(MOVIE_DATABASE[0])}
                className="flex items-center gap-3 bg-white text-black px-10 py-4 rounded-xl font-black hover:bg-zinc-200 transition-all shadow-xl"
              >
                <Play fill="currentColor" /> Play Now
              </button>
              <button 
                onClick={() => setSelectedMovie(MOVIE_DATABASE[0])}
                className="flex items-center gap-3 bg-zinc-800/60 text-white px-10 py-4 rounded-xl font-black backdrop-blur-md border border-white/10 hover:bg-zinc-800/80 transition-all"
              >
                <Info /> More Info
              </button>
            </div>
          </div>
        </div>

        {/* CONTENT ROWS */}
        <div className="relative -mt-32 z-10 space-y-12">
          <MovieRow title="Trending Across Android" movies={MOVIE_DATABASE} onSelect={setSelectedMovie} onPlay={setActiveStream} />
          <MovieRow title="Blockbuster Animations" movies={MOVIE_DATABASE.filter(m => m.genre.includes('Animation'))} onSelect={setSelectedMovie} onPlay={setActiveStream} />
          <MovieRow title="Warp into Sci-Fi" movies={MOVIE_DATABASE.filter(m => m.genre.includes('Sci-Fi'))} onSelect={setSelectedMovie} onPlay={setActiveStream} />
        </div>
      </main>

      {/* MODALS */}
      {selectedMovie && <MovieDetailsModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} onPlay={setActiveStream} />}
      {activeStream && <VideoPlayer movie={activeStream} onClose={() => setActiveStream(null)} />}
    </div>
  );
}