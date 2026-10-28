import type { Layout } from "./LayoutConstants"

export default function selectLayout(viewportWidth: number, viewportHeight: number): Layout {
    if (viewportWidth > 800 || viewportHeight > 800) {
      return "desktop";
    }
    if (viewportWidth > viewportHeight) {
      return "mobile-landscape";
    }
    return "mobile-portrait";
}