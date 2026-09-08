import { useEffect } from "react";
import GallerySection from "../components/GallerySection";

export default function GalleryPage() {
  useEffect(() => {
    document.title = "Gallery | Jeevanjyot";
  }, []);

  return (
    <div>
      <GallerySection />
    </div>
  );
}
