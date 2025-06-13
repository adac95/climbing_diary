import Header from "@components/Header";
import { Poppins } from "next/font/google";
import "../styles/globals.css";

const inter = Poppins({
  weight: ["100", "300", "500", "700"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Topos y pegues",
  description: "Topos y diario de escalada",
  icons: [{ rel: "icon", url: "/favicon.svg", type: "image/svg+xml" }],
};

export default function RootLayout({ children }) {
  return (
    <html lang='es'>
      <body>
        <div className={`${inter.className} antialiased`}>
          <Header />
          <div className='bodyContainer'>{children}</div>
        </div>
      </body>
    </html>
  );
}
