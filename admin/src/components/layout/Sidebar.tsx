import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  Star,
  Image,
  FileText,
  Handshake,
  Factory,
  Filter,
  Settings,
  PackageSearch,
} from "lucide-react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/hooks/store";

const navigation = [
  { key: "dashboard", href: "/", icon: LayoutDashboard },
  { key: "products", href: "/products", icon: Package },
  { key: "categories", href: "/categories", icon: FolderTree },
  { key: "orders", href: "/orders", icon: ShoppingCart },
  { key: "users", href: "/users", icon: Users },
  { key: "reviews", href: "/reviews", icon: Star },
  { key: "productRequests", href: "/product-requests", icon: PackageSearch },
  { key: "banners", href: "/banners", icon: Image },
  { key: "blogs", href: "/blogs", icon: FileText },
  { key: "partners", href: "/partners", icon: Handshake },
  { key: "industries", href: "/industries", icon: Factory },
  { key: "settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const { t } = useTranslation();

  const user = useAppSelector((s) => s.auth.user);

  const visibleNav = navigation.filter((item) => {
    if (user?.role === "CALL_MANAGER") {
      return ["dashboard", "orders", "reviews", "productRequests", "settings"].includes(item.key);
    }
    return true;
  });

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-slate-900">
      <div className="flex h-16 items-center gap-3 px-6">
        <div className="rounded-lg bg-blue-600 p-2">
          <Filter className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-white">
            {t("sidebar.filterSystem")}
          </h1>
          <p className="text-xs text-slate-400">{t("sidebar.adminPanel")}</p>
        </div>
      </div>

      <nav className="mt-4 flex-1 space-y-1 px-3">
        {visibleNav.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === "/"}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white",
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {t(`sidebar.${item.key}`)}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
