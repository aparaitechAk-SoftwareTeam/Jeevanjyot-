import { useEffect } from "react";
import ContactSection from "../components/ContactSection";

export default function ContactPage() {
  useEffect(() => {
    document.title = "Contact | Jeevanjyot";
  }, []);

  return (
    <div>
      <ContactSection />
    </div>
  );
}
