import { useEffect } from "react";

export default function AdBanner({ className = "" }) {
  useEffect(() => {
    try {
      if (window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <ins
      className={`adsbygoogle block ${className}`}
      style={{ display: "block", textAlign: "center" }}
      data-ad-client="ca-pub-XXXXXXX" // Replace with your Publisher ID
      data-ad-slot="XXXXXXX" // Replace with your Ad Unit ID
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
}
