import { iconContainerStyles, iconSizeStyles } from "../icons/iconStyles";

export default function FullBackgroundImageOverlayText({
  title,
  body,
  icon: Icon,
  theme,
}) {
  return (
    <div
      className={`w-full h-[1080px] rounded-[40px] overflow-hidden relative ${theme.background}`}
    >
      <div className="absolute inset-0 bg-black/30 z-10" />
      <div className={`absolute inset-0 ${theme.decorativeGradient}`} />

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-[-120px] left-[-120px] w-[600px] h-[600px] rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative z-20 flex flex-col justify-end h-full p-20">
        <div
          className={`mb-10 ${iconContainerStyles.medium} ${theme.cardBackground} ${theme.cardBorder} ${theme.accentGlow}`}
        >
          <Icon className={`${iconSizeStyles.medium} ${theme.textSecondary}`} />
        </div>

        <h1
          className={`text-[88px] leading-[0.95] font-bold max-w-[760px] mb-8 ${theme.textPrimary}`}
        >
          {title}
        </h1>

        <p
          className={`text-[32px] leading-[1.5] max-w-[620px] ${theme.mutedText}`}
        >
          {body}
        </p>
      </div>
    </div>
  );
}
