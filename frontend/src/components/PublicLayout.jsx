import { Outlet } from "react-router-dom";
import { Leaf } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useLanguage } from "../context/LanguageContext";

export default function PublicLayout() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#F7F3E8] text-[#17231C]">

      {/* Announcement Bar */}
      <div className="bg-[#0B291D] px-4 py-2.5 text-center text-sm text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2">
          <Leaf size={15} />
          <span>
            {t("announcement.text", "Ayurveda • Panchakarma • Diabetes & Infertility Care")}
          </span>
        </div>
      </div>

      {/* Shared Navbar */}
      <Navbar />

      {/* Page Content */}
      <main>
        <Outlet />
      </main>

      {/* Shared Footer */}
      <Footer />

    </div>
  );
}
