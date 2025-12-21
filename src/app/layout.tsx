import { Outfit } from 'next/font/google';
import './globals.css';
import { ToastContainer } from 'react-toastify';
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import ClientLoader from "@/components/ClientLoader";
import { ReduxProvider } from '@/redux/ReduxProvider';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ReduxProvider>

      <ClientLoader/>
        <ThemeProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
          </ReduxProvider>
<ToastContainer  style={{ top: "70px" }} />
      </body>
    </html>
  );
}
