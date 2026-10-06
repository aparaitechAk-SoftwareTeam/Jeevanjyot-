import { useEffect } from "react";
import PanchakarmaSection from "../components/PanchakarmaSection";
import PatientJourneySection from "../components/PatientJourneySection";

export default function PanchakarmaPage() {
  useEffect(() => {
    document.title = "Panchakarma | Jeevanjyot";
  }, []);

  return (
    <div>
      <PanchakarmaSection />
      <PatientJourneySection />
    </div>
  );
}
