export default function SplitLeftTextRightImage({
  title,
  body,
  icon: Icon,
  theme,
}) {
  return (
    <div
      className={`w-full h-[1080px] rounded-[40px] overflow-hidden relative flex ${theme.background}`}
    >
      <div className={`absolute inset-0 ${theme.decorativeGradient}`} />

      <div className="w-1/2 flex flex-col justify-center px-20 relative z-10">
        <div
          className={`w-28 h-28 rounded-[28px] flex items-center justify-center mb-10 ${theme.cardBackground} ${theme.cardBorder} ${theme.accentGlow}`}
        >
          <Icon className={`w-14 h-14 ${theme.textSecondary}`} />
        </div>

        <h1
          className={`text-[82px] leading-[0.95] font-bold mb-8 ${theme.textPrimary}`}
        >
          {title}
        </h1>

        <p
          className={`text-[32px] leading-[1.5] max-w-[450px] ${theme.mutedText}`}
        >
          {body}
        </p>
      </div>

      <div className="w-1/2 relative flex items-center justify-center">
        <div
          className={`absolute top-24 right-20 w-[420px] h-[700px] rounded-[40px] ${theme.cardBackground} ${theme.cardBorder}`}
        />
        <div
          className={`absolute top-40 right-40 w-[280px] h-[180px] rounded-[28px] ${theme.cardBackground} ${theme.cardBorder}`}
        />
        <div
          className={`absolute bottom-36 right-32 w-[340px] h-[220px] rounded-[28px] ${theme.cardBackground} ${theme.cardBorder}`}
        />

        <div
          className={`relative z-10 w-[260px] h-[260px] rounded-full flex items-center justify-center ${theme.cardBackground} ${theme.cardBorder} ${theme.accentGlow}`}
        >
          <Icon className={`w-28 h-28 ${theme.textSecondary}`} />
        </div>
      </div>
    </div>
  );
}
