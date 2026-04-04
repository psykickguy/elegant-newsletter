import { Bot, Monitor, Rocket, Shield, Workflow, Layers } from "lucide-react";
import { themeMap } from "./themes";
import { layoutMap } from "./templates";

const sampleSlides = [
  {
    title: "Frontend Trends",
    body: "The biggest shifts in frontend and AI this week.",
    icon: Monitor,
    theme: themeMap["dark blue gradient"],
    layout: "centered-title-centered-body",
  },
  {
    title: "Privacy Tools",
    body: "Marco shows privacy-first products are becoming more important.",
    icon: Shield,
    theme: themeMap["dark glassmorphism"],
    layout: "split-left-text-right-image",
  },
  {
    title: "Notebook Workflows",
    body: "Looseleaf reflects demand for flexible developer workflows.",
    icon: Workflow,
    theme: themeMap["futuristic cyan glow"],
    layout: "title-left-body-right",
  },
  {
    title: "AI Creation",
    body: "TailorToJob shows AI is helping non-developers create faster.",
    icon: Bot,
    theme: themeMap["black and purple neon"],
    layout: "title-top-icon-center",
  },
  {
    title: "Big Shift",
    body: "Developers want tools that are simpler and more focused.",
    icon: Layers,
    theme: themeMap["modern fintech dark"],
    layout: "full-background-image-overlay-text",
  },
  {
    title: "Follow Elegant",
    body: "Follow Elegant Frontend for weekly frontend insights.",
    icon: Rocket,
    theme: themeMap["midnight AI theme"],
    layout: "centered-title-centered-body",
  },
];

export default function App() {
  return (
    <div className="bg-slate-950 min-h-screen p-10 flex flex-col gap-20">
      {sampleSlides.map((slide, index) => {
        const LayoutComponent = layoutMap[slide.layout];

        return (
          <div key={index} className="w-full flex justify-center py-10">
            <div className="scale-[0.35] origin-top">
              <LayoutComponent
                title={slide.title}
                body={slide.body}
                icon={slide.icon}
                theme={slide.theme}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
