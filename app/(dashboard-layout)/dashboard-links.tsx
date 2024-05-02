import type { NavigationLinkGroups } from "@/features/navigation/navigation.type";
import { LayoutDashboard, Settings } from "lucide-react";

export const DASHBOARD_LINKS: NavigationLinkGroups[] = [
  {
    links: [
      {
        title: "Dashboard",
        icon: <LayoutDashboard />,
        url: "/dashboard",
      },
      {
        title: "Configuration",
        icon: <Settings />,
        url: "/configuration",
      },
    ],
  },
];
