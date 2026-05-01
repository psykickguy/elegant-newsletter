import { iconContainerStyles, iconSizeStyles } from "../icons/iconStyles";
import {
  GlowOrb,
  DotGrid,
  GradientLine,
  GlassCard,
} from "../components/DecorativeElements";
import DynamicVisualScene from "../components/DynamicVisualScene";

export default function TitleTopIconCenter({
  title,
  body,
  imagePrompt,
  icon: Icon,
  theme,
  accentColor,
}) {
  return (
    <div
      className={`w-full h-[1080px] overflow-hidden relative flex flex-col items-center px-20 py-24 text-center ${theme.background}`}
    >
      <div className={`absolute inset-0 ${theme.decorativeGradient}`} />
      <DynamicVisualScene
        imagePrompt={imagePrompt}
        title={title}
        body={body}
        accentColor={accentColor || theme.accentColor}
      />

      <GlowOrb
        className="top-10 left-10 w-[260px] h-[260px]"
        color="bg-violet-400/10"
      />

      <GlowOrb
        className="bottom-20 right-10 w-[320px] h-[320px]"
        color="bg-cyan-400/10"
      />

      <DotGrid className="top-20 right-20 w-[240px] h-[240px]" />

      <GradientLine className="top-[420px] left-0 w-full h-[2px]" />

      <GlassCard className="bottom-24 left-20 w-[220px] h-[140px]" />

      <GlassCard className="bottom-24 right-20 w-[220px] h-[140px]" />

      <h1
        className={`relative z-10 text-[84px] leading-[0.95] font-bold max-w-[850px] mb-12 ${theme.textPrimary}`}
      >
        {title}
      </h1>

      <div
        className={`relative z-10 mb-12 ${iconContainerStyles.circle} ${theme.cardBackground} ${theme.cardBorder} ${theme.accentGlow}`}
      >
        <Icon className={`${iconSizeStyles.hero} ${theme.textSecondary}`} />
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
