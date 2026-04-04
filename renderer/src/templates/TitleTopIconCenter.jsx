export default function TitleTopIconCenter({ title, body, icon: Icon, theme }) {
  return (
    <div
      className={`w-full h-[1080px] rounded-[40px] overflow-hidden relative flex flex-col items-center px-20 py-24 text-center ${theme.background}`}
    >
      <div className={`absolute inset-0 ${theme.decorativeGradient}`} />

      <h1
        className={`relative z-10 text-[84px] leading-[0.95] font-bold max-w-[850px] mb-12 ${theme.textPrimary}`}
      >
        {title}
      </h1>

      <div
        className={`relative z-10 w-[260px] h-[260px] rounded-full flex items-center justify-center mb-12 ${theme.cardBackground} ${theme.cardBorder} ${theme.accentGlow}`}
      >
        <Icon className={`w-28 h-28 ${theme.textSecondary}`} />
      </div>

      <p
        className={`relative z-10 text-[34px] leading-[1.5] max-w-[760px] ${theme.mutedText}`}
      >
        {body}
      </p>

      <div className="absolute bottom-16 flex gap-4">
        <div className={`w-4 h-4 rounded-full ${theme.textSecondary}`} />
        <div className="w-4 h-4 rounded-full bg-white/30" />
        <div className="w-4 h-4 rounded-full bg-white/20" />
      </div>
    </div>
  );
}
