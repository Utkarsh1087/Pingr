const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12 relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

      <div className="max-w-md text-center relative z-10">
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-3xl bg-primary/20 
                ${i % 2 === 0 ? "animate-pulse" : "hover:scale-105 transition-transform duration-500"}
                ${i % 3 === 0 ? "bg-primary/10 shadow-glass-sm" : "shadow-lg"}
              `}
            />
          ))}
        </div>
        <h2 className="text-3xl font-extrabold mb-5 tracking-tight bg-gradient-to-br from-base-content to-base-content/60 bg-clip-text text-transparent">
          {title}
        </h2>
        <p className="text-base-content/50 font-medium leading-relaxed">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
