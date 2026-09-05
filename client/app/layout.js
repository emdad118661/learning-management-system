import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "../components/Navbar"; // Navbar

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "LMS Platform",
  description: "Learning Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar /> {/* Navbar */}
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}