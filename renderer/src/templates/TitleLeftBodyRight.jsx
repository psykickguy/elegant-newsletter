import { iconContainerStyles, iconSizeStyles } from "../icons/iconStyles";
import {
  GlowOrb,
  GlassCard,
  DotGrid,
  DashboardWidget,
  GradientLine,
} from "../components/DecorativeElements";

export default function TitleLeftBodyRight({ title, body, icon: Icon, theme }) {
  return (
    <div
      className={`w-full h-[1080px] overflow-hidden relative p-20 ${theme.background}`}
    >
      <div className={`absolute inset-0 ${theme.decorativeGradient}`} />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start">
          <div className="max-w-[450px]">
            <div
              className={`mb-10 ${iconContainerStyles.medium} ${theme.cardBackground} ${theme.cardBorder} ${theme.accentGlow}`}
            >
              <Icon
                className={`${iconSizeStyles.medium} ${theme.textSecondary}`}
              />
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

        <div className="flex-1 flex items-end justify-center relative">
          <GlowOrb
            className="w-[500px] h-[300px] left-10 bottom-0"
            color="bg-cyan-400/10"
          />

          <DotGrid className="w-[260px] h-[160px] right-10 bottom-10" />

          <GlassCard className="left-0 bottom-0 w-[260px] h-[180px]" />

          <DashboardWidget className="left-[300px] bottom-0 w-[260px] h-[180px]" />

          <GlassCard className="right-0 bottom-0 w-[260px] h-[180px]" />

          <GradientLine className="bottom-[220px] left-0 w-full h-[2px]" />
        </div>
      </div>
    </div>
  );
}
