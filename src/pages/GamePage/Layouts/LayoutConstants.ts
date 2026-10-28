import type { MapMode } from "../../../components/MapModeBar/MapModeBar";
import type { Message } from "../../../types/Messages";
import type { Nation } from "../../../types/Nation";
import type { NotificationPopup } from "../../../types/NotificationPopup";
import type { Territory } from "../../../types/Territory";
import type { Selection } from "../../../types/Selection";

export type Layout = "desktop" | "mobile-landscape" | "mobile-portrait";

export interface LayoutProps {
    selection: Selection;
    setSelection: (selection: Selection) => void;
    activeCommand: string | null;
    setActiveCommand: (command: string | null) => void;
    notifPopup: NotificationPopup;
    setNotifPopup: (popup: NotificationPopup) => void;
    nation: Nation | null;
    messages: Message[];
    territories: Territory[];
    nations: Nation[];
    gameTime: number;
    mapChanged: boolean;
    updateMap: () => Promise<void>;
    mapMode: MapMode;
    setMapMode: (mode: MapMode) => void;
}

export const LayoutConstants = {
  navbarHeight: 60,
  entitySearchHeight: 50,
  mapModeBarHeight: 50,
} as const;