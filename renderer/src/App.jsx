import { resolveSlide } from "./utils/resolveSlideComponent";

const sampleSlides = [
  {
    title: "Frontend Trends",
    body: "The biggest shifts in frontend and AI this week.",
    icon: "monitor",
    theme: "dark blue gradient",
    layout: "centered-title-centered-body",
  },
  {
    title: "Privacy Tools",
    body: "Marco shows privacy-first products are becoming more important.",
    icon: "shield",
    theme: "dark glassmorphism",
    layout: "split-left-text-right-image",
  },
  {
    title: "Notebook Workflows",
    body: "Looseleaf reflects demand for flexible developer workflows.",
    icon: "workflow",
    theme: "futuristic cyan glow",
    layout: "title-left-body-right",
  },
  {
    title: "AI Creation",
    body: "TailorToJob shows AI is helping non-developers create faster.",
    icon: "bot",
    theme: "black and purple neon",
    layout: "title-top-icon-center",
  },
  {
    title: "Big Shift",
    body: "Developers want tools that are simpler and more focused.",
    icon: "layers",
    theme: "modern fintech dark",
    layout: "full-background-image-overlay-text",
  },
  {
    title: "Follow Elegant",
    body: "Follow Elegant Frontend for weekly frontend insights.",
    icon: "rocket",
    theme: "midnight AI theme",
    layout: "centered-title-centered-body",
  },
  {
    title: "Broken Input Test",
    body: "This should still render even if theme, icon, or layout is wrong.",
    icon: "nonexistent-icon",
    theme: "fake-theme",
    layout: "wrong-layout",
  },
];

export default function App() {
  return (
    <div className="bg-slate-950 min-h-screen p-10 flex flex-col gap-20">
      {sampleSlides.map((slide, index) => {
        const { LayoutComponent, ThemeComponent, IconComponent } =
          resolveSlide(slide);

        return (
          <div key={index} className="w-full flex justify-center py-10">
            <div className="scale-[0.32] origin-top">
              <LayoutComponent
                title={slide.title}
                body={slide.body}
                icon={IconComponent}
                theme={ThemeComponent}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
