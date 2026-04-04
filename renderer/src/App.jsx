import singleSlide from "./sample-data/singleSlide";
import { resolveSlide } from "./utils/resolveSlideComponent";

export default function App() {
  const { LayoutComponent, ThemeComponent, IconComponent } =
    resolveSlide(singleSlide);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-10">
      <div className="w-[1080px] h-[1080px] scale-[0.65] origin-center">
        <LayoutComponent
          title={singleSlide.title}
          body={singleSlide.body}
          icon={IconComponent}
          theme={ThemeComponent}
          accentColor={singleSlide.accentColor}
        />
      </div>
    </div>
  );
}
