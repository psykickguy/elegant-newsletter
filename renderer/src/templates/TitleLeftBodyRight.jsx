export default function TitleLeftBodyRight({ title, body, icon: Icon, theme }) {
  return (
    <div
      className={`w-full h-[1080px] rounded-[40px] overflow-hidden relative p-20 ${theme.background}`}
    >
      <div className={`absolute inset-0 ${theme.decorativeGradient}`} />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start">
          <div className="max-w-[450px]">
            <div
              className={`w-28 h-28 rounded-[28px] flex items-center justify-center mb-10 ${theme.cardBackground} ${theme.cardBorder} ${theme.accentGlow}`}
            >
              <Icon className={`w-14 h-14 ${theme.textSecondary}`} />
            </div>

            <h1
              className={`text-[84px] leading-[0.95] font-bold ${theme.textPrimary}`}
            >
              {title}
            </h1>
          </div>

          <div
            className={`max-w-[420px] text-[32px] leading-[1.6] mt-10 ${theme.mutedText}`}
          >
            {body}
          </div>
        </div>

        <div className="flex-1 flex items-end justify-center">
          <div
            className={`w-full h-[320px] rounded-[40px] ${theme.cardBackground} ${theme.cardBorder} mt-16`}
          />
        </div>
      </div>
    </div>
  );
}
