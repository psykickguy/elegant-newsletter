export function GlowOrb({ className = "", color = "bg-cyan-400/20" }) {
  return (
    <div className={`absolute rounded-full blur-3xl ${color} ${className}`} />
  );
}

export function GlassCard({ className = "" }) {
  return (
    <div
      className={`absolute bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[28px] ${className}`}
    />
  );
}

export function DotGrid({ className = "" }) {
  return (
    <div
      className={`absolute opacity-20 ${className}`}
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,0.35) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
    />
  );
}

export function GradientLine({ className = "" }) {
  return (
    <div
      className={`absolute rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent ${className}`}
    />
  );
}

export function DashboardWidget({ className = "" }) {
  return (
    <div
      className={`absolute bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[28px] p-5 ${className}`}
    >
      <div className="absolute bottom-6 left-6 flex items-end gap-3">
        <div className="w-4 h-10 rounded-full bg-white/15" />
        <div className="w-4 h-16 rounded-full bg-white/20" />
        <div className="w-4 h-24 rounded-full bg-white/30" />
        <div className="w-4 h-14 rounded-full bg-white/20" />
      </div>
    </div>
  );
}

export function AnimatedBorder({ className = "" }) {
  return (
    <div
      className={`absolute rounded-[32px] border border-white/10 before:absolute before:inset-0 before:rounded-[32px] before:border before:border-cyan-300/20 before:animate-pulse ${className}`}
    />
  );
}
