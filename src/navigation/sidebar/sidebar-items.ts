import {
  Home,
  ChartPie,
  Grid2X2,
  ChartLine,
  ShoppingBag,
  BookA,
  Forklift,
  Mail,
  MessageSquare,
  Calendar,
  Kanban,
  ReceiptText,
  Users,
  Lock,
  Fingerprint,
  SquareArrowUpRight,
  type LucideIcon,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Principale",
    items: [
      {
        title: "Contabilità",
        url: "/dashboard",
        icon: Home,
        subItems: [
          { title: "Andamento", url: "/dashboard", icon: ChartPie },
          { title: "Costi", url: "/dashboard/costi", icon: Grid2X2 },
          { title: "Costi Periodici", url: "/dashboard/costi-periodici", icon: ChartLine },
          { title: "Profitti", url: "/dashboard/profitti", icon: ShoppingBag },
          { title: "Archivio", url: "/dashboard/archivio", icon: BookA },
          { title: "Fatture", url: "/dashboard/fatture", icon: Forklift },
          { title: "Rapportini", url: "/dashboard/rapportini", icon: Forklift },
          { title: "Scadenze", url: "/dashboard/scadenze", icon: Forklift },
        ],
      },
    ],
  },
  {
    id: 2,
    label: "Servizi",
    items: [
      {
        title: "Autorizzati",
        url: "/auth",
        icon: Fingerprint,
        subItems: [
          { title: "FrameTech SL", url: "/auth/v1/login", newTab: true },
          { title: "JP La Villa", url: "/auth/v1/register", newTab: true },
        ],
      },
      {
        title: "JP La Villa",
        url: "/mail",
        icon: Mail,
        comingSoon: true,
      },
      {
        title: "Documenti",
        url: "/chat",
        icon: MessageSquare,
        comingSoon: true,
      },
      {
        title: "Calendario",
        url: "/calendar",
        icon: Calendar,
        comingSoon: true,
      },
      {
        title: "Storico",
        url: "/kanban",
        icon: Kanban,
        comingSoon: true,
      },
      {
        title: "Note",
        url: "/invoice",
        icon: ReceiptText,
        comingSoon: true,
      },
      {
        title: "Galleria",
        url: "/users",
        icon: Users,
        comingSoon: true,
      },
      {
        title: "Keraglass",
        url: "/roles",
        icon: Lock,
        comingSoon: true,
      },
    ],
  },
  {
    id: 3,
    label: "Assistente",
    items: [
      {
        title: "BOT Keraglass",
        url: "/others",
        icon: SquareArrowUpRight,
        comingSoon: true,
      },
    ],
  },
];
