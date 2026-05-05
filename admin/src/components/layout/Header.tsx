import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Bell,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/hooks/store";
import { logout, clearNotifications } from "@/store/authSlice";

const routeNames: Record<string, string> = {
  "/": "sidebar.dashboard",
  "/products": "sidebar.products",
  "/categories": "sidebar.categories",
  "/orders": "sidebar.orders",
  "/users": "sidebar.users",
  "/reviews": "sidebar.reviews",
  "/banners": "sidebar.banners",
  "/settings": "sidebar.settings",
};

export function Header() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const notifications = useAppSelector((s) => s.auth.notifications);
  const [profileOpen, setProfileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setProfileOpen(false);
      if (langRef.current && !langRef.current.contains(e.target as Node))
        setLangOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const currentRoute =
    Object.keys(routeNames).find((route) =>
      route === "/"
        ? location.pathname === "/"
        : location.pathname.startsWith(route),
    ) || "/";

  const pageTitle = t(routeNames[currentRoute] || "sidebar.dashboard");

  const languages = [
    { code: "en", label: "English", flag: "\u{1F1EC}\u{1F1E7}" },
    {
      code: "ru",
      label: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439",
      flag: "\u{1F1F7}\u{1F1FA}",
    },
    { code: "uz", label: "O'zbek", flag: "\u{1F1FA}\u{1F1FF}" },
    { code: "kz", label: "\u049A\u0430\u0437\u0430\u049B\u0448\u0430", flag: "\u{1F1F0}\u{1F1FF}" },
  ];

  const currentLang =
    languages.find((l) => l.code === i18n.language) || languages[0];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const roleColors: Record<string, string> = {
    ADMIN: "bg-blue-100 text-blue-700",
    CALL_MANAGER: "bg-emerald-100 text-emerald-700",
    CLIENT: "bg-slate-100 text-slate-700",
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left: Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <LayoutDashboard className="h-4 w-4 text-slate-400" />
          <span className="text-slate-400">/</span>
          <span className="font-semibold text-slate-900">{pageTitle}</span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Language */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <span>{currentLang.flag}</span>
              <span className="hidden sm:inline">{currentLang.label}</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 w-40 rounded-xl bg-white border border-slate-200 shadow-xl py-1 z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      i18n.changeLanguage(lang.code);
                      setLangOpen(false);
                    }}
                    className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                      i18n.language === lang.code
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>{lang.flag}</span>
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications */}
          <button
            onClick={() => dispatch(clearNotifications())}
            className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <span className="absolute top-1 right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                {notifications > 9 ? "9+" : notifications}
              </span>
            )}
          </button>

          {/* Divider */}
          <div className="h-8 w-px bg-slate-200 mx-1" />

          {/* Profile */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 rounded-xl px-2 py-1.5 hover:bg-slate-50 transition-colors"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-bold text-white shadow-sm">
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-slate-900 leading-tight">
                  {user?.name}
                </p>
                <p className="text-xs text-slate-500 leading-tight">
                  {user?.role === "ADMIN"
                    ? t("users.roles.ADMIN")
                    : t("users.roles.CALL_MANAGER")}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400 hidden sm:block" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-xl bg-white border border-slate-200 shadow-xl overflow-hidden z-50">
                {/* User info */}
                <div className="px-4 py-4 border-b border-slate-100 bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-base font-bold text-white">
                      {user?.name?.charAt(0)?.toUpperCase() || "A"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {user?.name}
                      </p>
                      <span
                        className={`inline-flex mt-0.5 items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${roleColors[user?.role || "ADMIN"]}`}
                      >
                        {user?.role}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Actions */}
                <div className="py-1">
                  <button
                    onClick={() => { navigate("/settings"); setProfileOpen(false); }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    {t("sidebar.settings")}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    {t("auth.logout")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
