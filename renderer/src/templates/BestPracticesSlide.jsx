export default function BestPracticesSlide({
  title,
  practices = [],
  highlight,
  cta,
  icon: Icon,
  theme,
}) {
  return (
    <div
      className={`w-full h-[1080px] overflow-hidden relative p-16 ${theme.background}`}
    >
      <div
        className={`w-full h-full rounded-[40px] p-14 flex flex-col ${theme.card} ${theme.shadow}`}
      >
        {/* Top Section */}
        <div className="mb-10 flex items-center gap-6">
          {Icon && (
            <div
              className={`w-20 h-20 rounded-3xl flex items-center justify-center ${theme.section} ${theme.border}`}
            >
              <Icon className={`w-10 h-10 ${theme.accent}`} />
            </div>
          )}

          <h1
            className={`text-[64px] leading-[1.05] font-bold max-w-[850px] ${theme.title}`}
          >
            {title}
          </h1>
        </div>

        {/* Practices Grid */}
        <div className="grid grid-cols-2 gap-6 flex-1">
          {practices.map((practice, index) => (
            <div
              key={index}
              className={`rounded-[28px] p-8 flex gap-5 items-start ${theme.section} ${theme.border}`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${theme.accentBg}`}
              >
                <span className="text-white text-xl font-bold">
                  {index + 1}
                </span>
              </div>

              <p
                className={`text-[28px] leading-[1.45] font-medium ${theme.body}`}
              >
                {practice}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-10 flex flex-col gap-5">
          <div
            className={`rounded-[24px] px-8 py-6 ${theme.section} ${theme.border}`}
          >
            <p className={`text-[26px] font-medium ${theme.title}`}>
              {highlight}
            </p>
          </div>

          <div
            className={`rounded-[24px] px-8 py-5 flex items-center justify-between ${theme.accentBg}`}
          >
            <p className="text-white text-[24px] font-semibold">{cta}</p>

            <div className="text-white text-[20px] font-bold">→</div>
          </div>
        </div>
      </div>
    </div>
  );
}
