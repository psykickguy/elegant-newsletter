import generatedCarousel from "./sample-data/generatedCarousel.json";
import { resolveSlide } from "./utils/resolveSlideComponent";

export default function App() {
  const carouselSlides = generatedCarousel.slides || [];

  const params = new URLSearchParams(window.location.search);
  const slideIndex = Number(params.get("slide")) || 0;

  const slide = carouselSlides[slideIndex] || {
    title: "No Slides Found",
    body: "The renderer did not receive any slide data yet.",
    icon: "sparkles",
    theme: "lightMinimal",
    layout: "centered-title-centered-body",
    accentColor: "#3B82F6",
  };

  const { LayoutComponent, ThemeComponent, IconComponent } =
    resolveSlide(slide);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center overflow-hidden">
      <div className="w-[1080px] h-[1080px]">
        <LayoutComponent
          title={slide.title}
          body={slide.body}
          practices={slide.practices}
          highlight={slide.highlight}
          cta={slide.cta}
          icon={IconComponent}
          theme={ThemeComponent}
          accentColor={slide.accentColor}
        />
      </div>
    </div>
  );
}
