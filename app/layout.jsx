// app/layout.jsx
import "./globals.css";
import Providers from "./components/Providers";

export const metadata = {
  title: "Mon site next.js cree pour la premier fois",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
