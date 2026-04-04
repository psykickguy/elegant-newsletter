import { iconContainerStyles, iconSizeStyles } from "../icons/iconStyles";

export default function CenteredTitleCenteredBody({
  title,
  body,
  icon: Icon,
  theme,
}) {
  return (
    <div
      className={`w-full h-[1080px] rounded-[40px] overflow-hidden relative flex flex-col items-center justify-center text-center px-24 ${theme.background}`}
    >
      <div className={`absolute inset-0 ${theme.decorativeGradient}`} />

      <div className="absolute top-16 right-16 w-40 h-40 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute bottom-10 left-10 w-60 h-60 rounded-full bg-white/5 blur-3xl" />

      <div
        className={`relative z-10 mb-12 ${iconContainerStyles.large} ${theme.cardBackground} ${theme.cardBorder} ${theme.accentGlow}`}
      >
        <Icon className={`${iconSizeStyles.large} ${theme.textSecondary}`} />
      </div>

      <h1
        className={`relative z-10 text-[88px] leading-[0.95] font-bold max-w-[850px] mb-10 ${theme.textPrimary}`}
      >
        {title}
      </h1>

      <p
        className={`relative z-10 text-[34px] leading-[1.5] max-w-[760px] ${theme.mutedText}`}
      >
        {body}
      </p>
    </div>
  );
}
