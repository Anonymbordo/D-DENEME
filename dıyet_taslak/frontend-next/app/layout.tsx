import type { Metadata } from "next";
import "./globals.css";
import "./styles-imported.css";

export const metadata: Metadata = {
  title: "HEALFLOW - Kişiselleştirilmiş Beslenme Platformu",
  description: "Sağlığa açılan kişiselleştirilmiş akış. AI destekli beslenme danışmanlığı.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
