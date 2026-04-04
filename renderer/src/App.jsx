import { themeMap } from "./themes";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 p-10">
      <div className="grid grid-cols-2 gap-8">
        {Object.values(themeMap).map((theme) => (
          <div
            key={theme.name}
            className={`rounded-[32px] p-8 h-[300px] relative overflow-hidden ${theme.background} ${theme.accentBorder}`}
          >
            <div className={`absolute inset-0 ${theme.decorativeGradient}`} />

            <div className="relative z-10">
              <p
                className={`text-sm uppercase tracking-[0.2em] mb-4 ${theme.mutedText}`}
              >
                Theme Preview
              </p>

              <h2 className={`text-3xl font-bold mb-4 ${theme.textPrimary}`}>
                {theme.name}
              </h2>

              <p className={`text-lg ${theme.textSecondary}`}>
                Premium futuristic slide styling for LinkedIn carousel
                generation.
              </p>

              <div
                className={`mt-8 w-20 h-20 rounded-2xl ${theme.cardBackground} ${theme.cardBorder} ${theme.accentGlow}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
