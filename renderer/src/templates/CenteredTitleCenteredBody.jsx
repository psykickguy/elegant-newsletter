import { iconContainerStyles, iconSizeStyles } from "../icons/iconStyles";
import {
  GlowOrb,
  DotGrid,
  GradientLine,
} from "../components/DecorativeElements";
import DynamicVisualScene from "../components/DynamicVisualScene";

export default function CenteredTitleCenteredBody({
  title,
  body,
  imagePrompt,
  icon: Icon,
  theme,
  accentColor,
}) {
  return (
    <div
      className={`w-full h-[1080px] overflow-hidden relative flex items-center justify-center p-16 ${theme.background}`}
    >
      <div className={`absolute inset-0 ${theme.decorativeGradient || ""}`} />
      <DynamicVisualScene
        imagePrompt={imagePrompt}
        title={title}
        body={body}
        accentColor={accentColor || theme.accentColor}
      />

      <GlowOrb
        className="top-20 left-20 w-[260px] h-[260px]"
        color="bg-orange-200/30"
      />

      <GlowOrb
        className="bottom-10 right-10 w-[260px] h-[260px]"
        color="bg-blue-200/30"
      />

      <DotGrid className="top-16 right-16 w-[220px] h-[220px] opacity-30" />

      <GradientLine className="bottom-24 left-0 w-full h-[2px] opacity-30" />

      <div
        className={`relative z-10 w-full h-full max-w-[920px] flex flex-col items-center justify-center text-center rounded-[40px] p-16 ${theme.card} ${theme.shadow}`}
      >
        <div
          className={`mb-10 ${iconContainerStyles.large} ${theme.section} ${theme.border}`}
        >
          <Icon className={`${iconSizeStyles.large} ${theme.accent}`} />
        </div>

        <h1
          className={`text-[82px] leading-[0.95] font-bold max-w-[850px] mb-8 ${theme.title}`}
        >
          {title}
        </h1>

        <p className={`text-[32px] leading-[1.5] max-w-[760px] ${theme.body}`}>
          {body}
        </p>
      </div>
    </div>
  );
}
