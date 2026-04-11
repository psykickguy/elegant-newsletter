export default function TerminologySlide({
  title,
  terms = [],
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
        {/* Header */}
        <div className="flex items-center gap-5 mb-10">
          {Icon && (
            <div
              className={`w-20 h-20 rounded-3xl flex items-center justify-center ${theme.section} ${theme.border}`}
            >
              <Icon className={`w-10 h-10 ${theme.accent}`} />
            </div>
          )}

          <h1 className={`text-[64px] leading-[1.05] font-bold ${theme.title}`}>
            {title}
          </h1>
        </div>

        {/* Terms Grid */}
        <div className="grid grid-cols-2 gap-6 flex-1">
          {terms.map((item, index) => (
            <div
              key={index}
              className={`rounded-[28px] p-8 flex flex-col gap-4 ${theme.section} ${theme.border}`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${theme.accentBg}`}
                >
                  <span className="text-white text-lg font-bold">
                    {index + 1}
                  </span>
                </div>

                <h2
                  className={`text-[30px] font-bold leading-[1.2] ${theme.title}`}
                >
                  {item.term}
                </h2>
              </div>

              <p className={`text-[24px] leading-[1.5] ${theme.body}`}>
                {item.definition}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
