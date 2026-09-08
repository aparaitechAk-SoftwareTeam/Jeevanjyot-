import { useEffect } from "react";
import DoctorSection from "../components/DoctorSection";

export default function DoctorPage() {
  useEffect(() => {
    document.title = "Dr. Jeevan Atole | Jeevanjyot";
  }, []);

  return (
    <div>
      <DoctorSection />
    </div>
  );
}
