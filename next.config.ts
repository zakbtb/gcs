import type { NextConfig } from "next";

const securityHeaders = [
  // Force HTTPS pendant 2 ans (actif uniquement quand le site est servi en HTTPS)
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(self \"https://js.stripe.com\")" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Embarque les fichiers data/*.json (produits, tarifs) avec les fonctions serveur sur Vercel
  outputFileTracingIncludes: { "/**": ["./data/*.json"] },
  // Page cachée de l'équipe : générateur de posts + charte GCS (non indexée par Google)
  async rewrites() {
    return [
      { source: "/outils/posts", destination: "/outils/posts/index.html" },
      // Adresse « about » attendue par les robots et agents : même page que /a-propos
      { source: "/about", destination: "/a-propos" },
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/outils/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
};

export default nextConfig;
