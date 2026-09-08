import { useEffect } from "react";
import AppointmentSection from "../components/AppointmentSection";

export default function BookAppointmentPage() {
  useEffect(() => {
    document.title = "Book Appointment | Jeevanjyot";
  }, []);

  return (
    <div>
      <AppointmentSection />
    </div>
  );
}
