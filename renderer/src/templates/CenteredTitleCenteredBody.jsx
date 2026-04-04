import { iconContainerStyles, iconSizeStyles } from "../icons/iconStyles";
import {
  GlowOrb,
  DotGrid,
  GradientLine,
} from "../components/DecorativeElements";

export default function CenteredTitleCenteredBody({
  title,
  body,
  icon: Icon,
  theme,
}) {
  return (
    <div
      className={`w-full h-[1080px] overflow-hidden relative flex flex-col items-center justify-center text-center px-24 ${theme.background}`}
    >
      <div className={`absolute inset-0 ${theme.decorativeGradient}`} />

      <GlowOrb
        className="top-20 left-20 w-[300px] h-[300px]"
        color="bg-cyan-400/10"
      />

      <GlowOrb
        className="bottom-10 right-10 w-[300px] h-[300px]"
        color="bg-blue-500/10"
      />

      <DotGrid className="top-16 right-16 w-[240px] h-[240px]" />

      <GradientLine className="bottom-32 left-0 w-full h-[2px]" />

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
