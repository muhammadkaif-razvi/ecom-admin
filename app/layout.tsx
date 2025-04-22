import type { Metadata } from "next";
import "@/app/globals.css";
import { auth } from "@/auth";
import { Navbar } from "@/components/Navbar";
import { Providers } from "@/components/Providers";
import { ModalProvider } from "@/providers/modal-provider";
import { Toaster } from "react-hot-toast";



export const metadata: Metadata = {
  title: "Admin CMS Dashboard",
  description: "Manage your store with ease",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
   
      >
        <Providers session={session}>
          <Navbar />
          <main style={{ paddingTop: "var(--navbar-height, 2rem)" }}>
            <ModalProvider />
            {children}
            <Toaster />
          </main>
        </Providers>
      </body>
    </html>
  );
}
