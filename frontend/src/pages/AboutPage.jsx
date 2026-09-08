import { useEffect } from "react";
import AboutSection from "../components/AboutSection";
import TrustHighlights from "../components/TrustHighlights";
import WhyChooseSection from "../components/WhyChooseSection";

export default function AboutPage() {
  useEffect(() => {
    document.title = "About Jeevanjyot | Ayurveda & Panchakarma";
  }, []);

  return (
    <div>
      <AboutSection />
      <TrustHighlights />
      <WhyChooseSection />
    </div>
  );
}
