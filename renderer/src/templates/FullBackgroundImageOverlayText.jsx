import { iconContainerStyles, iconSizeStyles } from "../icons/iconStyles";
import {
  GlowOrb,
  DotGrid,
  GradientLine,
} from "../components/DecorativeElements";
import DynamicVisualScene from "../components/DynamicVisualScene";

export default function FullBackgroundImageOverlayText({
  title,
  body,
  imagePrompt,
  icon: Icon,
  theme,
  accentColor,
}) {
  return (
    <div
      className={`w-full h-[1080px] overflow-hidden relative ${theme.background}`}
    >
      <div className="absolute inset-0 bg-black/30 z-10" />
      <div className={`absolute inset-0 ${theme.decorativeGradient}`} />
      <DynamicVisualScene
        imagePrompt={imagePrompt}
        title={title}
        body={body}
        accentColor={accentColor || theme.accentColor}
      />

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <GlowOrb
          className="w-[500px] h-[500px] top-[-100px] right-[-100px]"
          color="bg-indigo-400/10"
        />

        <GlowOrb
          className="w-[600px] h-[600px] bottom-[-120px] left-[-120px]"
          color="bg-cyan-400/10"
        />

        <DotGrid className="top-20 right-20 w-[300px] h-[300px]" />

        <GradientLine className="top-32 left-0 w-full h-[2px]" />
      </div>

      <div className="relative z-20 flex flex-col justify-end h-full p-20">
        <div
          className={`mb-10 ${iconContainerStyles.medium} ${theme.cardBackground} ${theme.cardBorder} ${theme.accentGlow}`}
        >
          <Icon className={`${iconSizeStyles.medium} ${theme.textSecondary}`} />
        </div>

        <h1
          className={`text-[92px] leading-[0.92] font-bold max-w-[860px] mb-8 ${theme.textPrimary}`}
        >
          {title}
        </h1>

        <p
          className={`text-[34px] leading-[1.5] max-w-[700px] ${theme.mutedText}`}
        >
          {body}
        </p>
      </div>
    </div>
  );
}
