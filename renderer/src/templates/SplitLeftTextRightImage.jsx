import { iconContainerStyles, iconSizeStyles } from "../icons/iconStyles";

export default function SplitLeftTextRightImage({
  title,
  body,
  icon: Icon,
  theme,
}) {
  return (
    <div
      className={`w-full h-[1080px] overflow-hidden relative flex ${theme.background}`}
    >
      <div className={`absolute inset-0 ${theme.decorativeGradient}`} />

      <div className="w-1/2 flex flex-col justify-center px-20 relative z-10">
        <div
          className={`mb-10 ${iconContainerStyles.medium} ${theme.cardBackground} ${theme.cardBorder} ${theme.accentGlow}`}
        >
          <Icon className={`${iconSizeStyles.medium} ${theme.textSecondary}`} />
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
          className={`relative z-10 ${iconContainerStyles.circle} ${theme.cardBackground} ${theme.cardBorder} ${theme.accentGlow}`}
        >
          <Icon className={`${iconSizeStyles.hero} ${theme.textSecondary}`} />
        </div>
      </div>
    </div>
  );
}
