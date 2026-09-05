export default function AuthBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grid */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00d4ff" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Abstract parcel map */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.07]" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
        {/* Large parcels */}
        <polygon points="100,80 280,60 320,180 140,210" fill="none" stroke="#00d4ff" strokeWidth="1" />
        <polygon points="280,60 460,40 500,160 320,180" fill="none" stroke="#8b5cf6" strokeWidth="1" />
        <polygon points="460,40 640,55 660,175 500,160" fill="none" stroke="#00d4ff" strokeWidth="1" />
        <polygon points="140,210 320,180 340,310 160,330" fill="none" stroke="#3b82f6" strokeWidth="1" />
        <polygon points="320,180 500,160 520,280 340,310" fill="none" stroke="#00d4ff" strokeWidth="1" />
        <polygon points="500,160 660,175 680,300 520,280" fill="none" stroke="#8b5cf6" strokeWidth="1" />
        <polygon points="160,330 340,310 360,440 180,455" fill="none" stroke="#00d4ff" strokeWidth="1" />
        <polygon points="340,310 520,280 540,420 360,440" fill="none" stroke="#3b82f6" strokeWidth="1" />
        <polygon points="520,280 680,300 700,420 540,420" fill="none" stroke="#00d4ff" strokeWidth="1" />
        {/* Smaller inner parcels */}
        <polygon points="150,120 230,100 250,160 170,175" fill="none" stroke="#00d4ff" strokeWidth="0.7" />
        <polygon points="230,100 310,90 320,150 250,160" fill="none" stroke="#00d4ff" strokeWidth="0.7" />
        <polygon points="350,120 430,110 440,165 360,175" fill="none" stroke="#8b5cf6" strokeWidth="0.7" />
        {/* Road lines */}
        <line x1="0" y1="240" x2="800" y2="220" stroke="#3b82f6" strokeWidth="2" opacity="0.5" />
        <line x1="340" y1="0" x2="360" y2="600" stroke="#3b82f6" strokeWidth="1.5" opacity="0.4" />
        {/* Building footprints */}
        {[
          [170, 130, 30, 20], [210, 115, 25, 18], [370, 125, 28, 22], [410, 118, 22, 18],
          [170, 350, 32, 22], [210, 340, 26, 20], [380, 330, 30, 24],
        ].map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} fill="rgba(0,212,255,0.15)" stroke="#00d4ff" strokeWidth="0.8" rx="1" />
        ))}
        {/* Glow center */}
        <circle cx="400" cy="300" r="200" fill="none" stroke="#00d4ff" strokeWidth="0.5" opacity="0.3" />
        <circle cx="400" cy="300" r="120" fill="none" stroke="#8b5cf6" strokeWidth="0.5" opacity="0.2" />
      </svg>

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.08]"
        style={{ background: "radial-gradient(circle, rgba(0,212,255,0.4) 0%, transparent 70%)" }} />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-[0.05]"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.5) 0%, transparent 70%)" }} />
    </div>
  );
}
