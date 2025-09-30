import "./globals.css";

export const metadata = {
  title: "Ubushi — Digital Growth Agency",
  description: "From zero digital presence to industry-leading brands. We craft conversion-focused websites and scale businesses through strategic design and proven growth systems.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
