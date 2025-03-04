import { Metadata } from "next";
import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
export const metadata: Metadata = {
  title: "Dashboard",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
     <body className="bg-gray-100">{children}</body>
    </html>
  );
}
