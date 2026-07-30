function BackgroundDecor() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, #c97a1d 0%, transparent 50%), radial-gradient(circle at 80% 70%, #6d8b3d 0%, transparent 50%), radial-gradient(circle at 50% 50%, #3b82f6 0%, transparent 60%)' }} />

      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hex-grid" width="60" height="52" patternUnits="userSpaceOnUse">
            <path d="M30 0 L60 15 L60 37 L30 52 L0 37 L0 15 Z" fill="none" stroke="#c97a1d" strokeWidth="0.3" opacity="0.3" />
          </pattern>
          <pattern id="circuit" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M0 20 L15 20 M25 20 L40 20 M20 0 L20 15 M20 25 L20 40" fill="none" stroke="#c97a1d" strokeWidth="0.3" opacity="0.2" />
            <circle cx="20" cy="20" r="1.5" fill="#c97a1d" opacity="0.2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex-grid)" />
        <rect width="100%" height="100%" fill="url(#circuit)" />
      </svg>

      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-eco-primary/[0.02] blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-eco-success/[0.02] blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-eco-accent/[0.015] blur-3xl" />

      <svg className="absolute top-0 left-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <line x1="10%" y1="20%" x2="30%" y2="30%" stroke="#c97a1d" strokeWidth="0.5" opacity="0.15" />
        <line x1="30%" y1="30%" x2="50%" y2="25%" stroke="#c97a1d" strokeWidth="0.5" opacity="0.12" />
        <line x1="50%" y1="25%" x2="70%" y2="35%" stroke="#6d8b3d" strokeWidth="0.5" opacity="0.12" />
        <line x1="70%" y1="35%" x2="90%" y2="20%" stroke="#3b82f6" strokeWidth="0.5" opacity="0.1" />
        <line x1="20%" y1="60%" x2="40%" y2="55%" stroke="#c97a1d" strokeWidth="0.5" opacity="0.1" />
        <line x1="40%" y1="55%" x2="60%" y2="50%" stroke="#6d8b3d" strokeWidth="0.5" opacity="0.1" />
        <line x1="60%" y1="50%" x2="80%" y2="60%" stroke="#06b6d4" strokeWidth="0.5" opacity="0.1" />
        <circle cx="30%" cy="30%" r="2" fill="#c97a1d" opacity="0.15" />
        <circle cx="50%" cy="25%" r="1.5" fill="#6d8b3d" opacity="0.15" />
        <circle cx="70%" cy="35%" r="2" fill="#3b82f6" opacity="0.15" />
      </svg>

      <div className="absolute top-1/3 right-1/5 w-2 h-2 rounded-full bg-eco-primary/20 animate-pulse" />
      <div className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 rounded-full bg-eco-success/20 animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-1/3 w-1 h-1 rounded-full bg-eco-accent/20 animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-1.5 h-1.5 rounded-full bg-eco-primary/15 animate-pulse" style={{ animationDelay: '0.5s' }} />
    </div>
  );
}

export default BackgroundDecor;