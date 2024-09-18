import { Urbanist } from "next/font/google";
import "./globals.css";
const font = Urbanist({ subsets: ["latin"] });

export const metadata = {
  title: "ProAgents Admin",
  description: "Admin Website of ProAgents",
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={font.className}>{children}</body>
    </html>
  );
}
