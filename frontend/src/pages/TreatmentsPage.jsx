import { useEffect } from "react";
import TreatmentSection from "../components/TreatmentSection";
import SpecializedCareSection from "../components/SpecializedCareSection";

export default function TreatmentsPage() {
  useEffect(() => {
    document.title = "Ayurvedic Treatments | Jeevanjyot";
  }, []);

  return (
    <div>
      <TreatmentSection />
      <SpecializedCareSection />
    </div>
  );
}
