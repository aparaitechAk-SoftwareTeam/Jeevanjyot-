import { useEffect } from "react";
import KnowledgeCenterSection from "../components/KnowledgeCenterSection";
import TestimonialsFAQSection from "../components/TestimonialsFAQSection";

export default function KnowledgeCenterPage() {
  useEffect(() => {
    document.title = "Knowledge Center | Jeevanjyot";
  }, []);

  return (
    <div>
      <KnowledgeCenterSection />
      <TestimonialsFAQSection />
    </div>
  );
}
