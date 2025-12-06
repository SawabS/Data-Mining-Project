import { ThemeToggle } from "./shared/ThemeToggle";
import { MapPin, Activity } from "lucide-react";

const Header = () => {
  return (
    <header className="p-4 w-full bg-[var(--card_full_white)] border-b border-[var(--border-color)] shadow-sm sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <div className="absolute inset-0 bg-[var(--cta)] opacity-20 rounded-xl rotate-3 group-hover:rotate-6 transition-transform duration-300"></div>
            <div className="absolute inset-0 bg-[var(--cta)] opacity-20 rounded-xl -rotate-3 group-hover:-rotate-6 transition-transform duration-300"></div>
            <div className="relative w-full h-full bg-gradient-to-br from-[var(--cta)] to-[var(--cta-hover)] rounded-xl flex items-center justify-center shadow-lg shadow-[var(--cta)]/20">
              <MapPin className="w-5 h-5 text-white absolute" />
              <Activity className="w-8 h-8 text-white opacity-20" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--cta)] tracking-tight">
              Traffic Analytics
            </h1>
            <p className="text-[10px] font-medium text-[var(--muted)] uppercase tracking-wider">
              US Accident Data Explorer
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6">
            <span className="text-sm font-medium text-[var(--text)] hover:text-[var(--cta)] cursor-pointer transition-colors">
              Dashboard
            </span>
            <span className="text-sm font-medium text-[var(--muted)] hover:text-[var(--cta)] cursor-pointer transition-colors">
              Reports
            </span>
            <span className="text-sm font-medium text-[var(--muted)] hover:text-[var(--cta)] cursor-pointer transition-colors">
              About
            </span>
          </nav>
          <div className="h-6 w-px bg-[var(--border-color)] mx-2 hidden md:block"></div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
