import carouselSlides from "./sample-data/carouselSlides";
import { resolveSlide } from "./utils/resolveSlideComponent";

export default function App() {
  const params = new URLSearchParams(window.location.search);
  const slideIndex = Number(params.get("slide")) || 0;

  const slide = carouselSlides[slideIndex];

  const { LayoutComponent, ThemeComponent, IconComponent } =
    resolveSlide(slide);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center overflow-hidden">
      <div className="w-[1080px] h-[1080px]">
        <LayoutComponent
          title={slide.title}
          body={slide.body}
          icon={IconComponent}
          theme={ThemeComponent}
          accentColor={slide.accentColor}
        />
      </div>
    </div>
  );
}
