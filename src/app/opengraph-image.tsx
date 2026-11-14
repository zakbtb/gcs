import { ImageResponse } from "next/og";

export const alt = "GCS Montpellier – Réparation de téléphone & création de sites web";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "linear-gradient(135deg, #160c33 0%, #2e2063 60%, #4520c2 100%)", color: "white", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: "#d8ff3e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, fontWeight: 800, color: "#160c33" }}>G</div>
          <div style={{ fontSize: 44, fontWeight: 800 }}>GCS · Global Connect Services</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05 }}>Votre téléphone réparé.</div>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, color: "#d8ff3e" }}>Votre entreprise en ligne.</div>
        </div>
        <div style={{ fontSize: 30, color: "rgba(255,255,255,0.75)" }}>Montpellier · Réparation smartphone · Création de sites web · Boutique</div>
      </div>
    ),
    size,
  );
}
