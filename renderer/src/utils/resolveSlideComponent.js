import { layoutMap } from "../templates";
import { themeMap } from "../themes";
import { iconMap } from "../icons/iconMap";

export function resolveLayout(layoutName) {
  return layoutMap[layoutName] || layoutMap["centered-title-centered-body"];
}

export function resolveTheme(themeName) {
  return themeMap[themeName] || themeMap.lightMinimal;
}

export function resolveIcon(iconName) {
  return iconMap[iconName] || iconMap["sparkles"];
}

export function resolveSlide(slide) {
  return {
    LayoutComponent: resolveLayout(slide.layout),
    ThemeComponent: resolveTheme(slide.theme),
    IconComponent: resolveIcon(slide.icon),
  };
}
