import generatedCarousel from "./runtime/generatedCarousel.json";
import { resolveSlide } from "./utils/resolveSlideComponent";
import DownloadLinksCard from "./components/DownloadLinksCard";

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

  const result = {
    pdfUrl: "https://example.com/sample.pdf",
    zipUrl: "https://example.com/sample.zip",
    slideUrls: ["https://example.com/slide-1.png"],
    linkedinPostUrl: "https://linkedin.com",
  };

  const { LayoutComponent, ThemeComponent, IconComponent } =
    resolveSlide(slide);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center gap-10 p-10 overflow-auto">
      <div className="w-[1080px] h-[1080px] shrink-0">
        <LayoutComponent
          title={slide.title}
          body={slide.body}
          imagePrompt={slide.imagePrompt}
          practices={slide.practices}
          highlight={slide.highlight}
          cta={slide.cta}
          terms={slide.terms}
          icon={IconComponent}
          theme={ThemeComponent}
          accentColor={slide.accentColor}
        />
      </div>

      <DownloadLinksCard
        pdfUrl={result.pdfUrl}
        zipUrl={result.zipUrl}
        slideUrls={result.slideUrls}
        linkedinPostUrl={result.linkedinPostUrl}
      />
    </div>
  );
}
