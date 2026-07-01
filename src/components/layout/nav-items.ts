import {
  LayoutDashboard,
  Users,
  UserCheck,
  ClipboardList,
  Calculator,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/prospek", label: "Prospek", icon: Users },
  { href: "/nasabah", label: "Nasabah", icon: UserCheck },
  { href: "/kegiatan", label: "Kegiatan", icon: ClipboardList },
  { href: "/kalkulator", label: "Kalkulator Angsuran", icon: Calculator },
];
