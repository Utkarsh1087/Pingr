const AuthImagePattern = ({ title, subtitle }) => {
  const bubbles = [
    { id: 1, size: "size-32", top: "10%", left: "15%", icon: "🕊️", text: "Ghosted again?", color: "from-blue-400/20 to-cyan-400/10" },
    { id: 2, size: "size-40", top: "25%", left: "55%", icon: "🤌", text: "Main character energy", color: "from-purple-400/20 to-pink-400/10" },
    { id: 3, size: "size-28", top: "55%", left: "10%", icon: "🤡", text: "Sent 'Lol' to a tragedy", color: "from-orange-400/20 to-red-400/10" },
    { id: 4, size: "size-48", top: "45%", left: "40%", icon: "✨", text: "Manifesting a reply", color: "from-green-400/20 to-emerald-400/10" },
    { id: 5, size: "size-24", top: "75%", left: "60%", icon: "🍕", text: "Pizza > People", color: "from-yellow-400/20 to-orange-400/10" },
    { id: 6, size: "size-36", top: "15%", left: "75%", icon: "🔋", text: "Social battery at 2%", color: "from-red-400/20 to-rose-400/10" },
  ];

  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12 relative overflow-hidden">
      {/* Soft Ambient Background Glows */}
      <div className="absolute top-0 right-0 size-[600px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 size-[600px] bg-secondary/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

      {/* Animated Mesh Noise Overlay */}
      <div className="absolute inset-0 opacity-[0.4] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='noiseFilter'%3%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3%3C/filter%3%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3%3C/svg%3")` }} />

      <div className="w-full h-full relative z-10 flex flex-col items-center justify-center">
        {/* The Vibe Cloud (Bubble Cluster) */}
        <div className="relative w-full h-[450px] mb-8">
          {bubbles.map((bubble) => (
            <div
              key={bubble.id}
              className={`absolute ${bubble.size} rounded-full bg-gradient-to-br ${bubble.color} backdrop-blur-md border border-white/40 shadow-glass flex items-center justify-center cursor-pointer group transition-all duration-700 hover:scale-110 hover:shadow-2xl hover:z-20 animate-float`}
              style={{
                top: bubble.top,
                left: bubble.left,
                animationDelay: `${bubble.id * 0.5}s`,
                animationDuration: `${5 + bubble.id}s`
              }}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl filter transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 border-none">
                  {bubble.icon}
                </span>

                {/* Reveal Text on Hover */}
                <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500 overflow-hidden text-center">
                  <span className="text-[10px] font-black uppercase tracking-tight text-base-content/60 px-2 py-1">
                    {bubble.text}
                  </span>
                </div>
              </div>

              {/* Inner Gloss Shine */}
              <div className="absolute top-2 left-4 w-1/2 h-1/4 bg-white/20 rounded-full blur-sm" />
            </div>
          ))}
        </div>

        {/* Text Meta Content */}
        <div className="max-w-md text-center space-y-4">
          <h2 className="text-5xl font-black tracking-tighter text-base-content leading-tight">
            {title}
          </h2>
          <p className="text-base-content/50 font-bold leading-relaxed max-w-sm mx-auto text-lg">
            {subtitle}
          </p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-30px) rotate(3deg); }
        }
        .animate-float {
          animation: float infinite ease-in-out;
        }
      `}} />
    </div>
  );
};

export default AuthImagePattern;
