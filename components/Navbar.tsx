"use client";
import { signOut, useSession } from "next-auth/react";
import { UserButton } from "./auth/user/user-button";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import { ModeToggle } from "@/components/togglebtn";
import Image from "next/image";
import { MainNav } from "@/components/main-nav";
import StoreSwitcher from "./store-switcher";
import { StoreIcon } from "lucide-react";
import { MobileNav } from "./main-m-nav";

export const Navbar = () => {
  const navRef = useRef<HTMLElement>(null);
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNavigation = async (href: string) => {
    if (session) {
      await signOut({ redirect: false });
    }
    router.push(href);
  };

  if (!mounted) return null;

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 shadow-sm ${
        isScrolled
          ? "backdrop-blur-sm border"
          : "bg-gradient-to-b from-purple-50 to-white dark:from-slate-800 dark:to-slate-950"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between p-5 px-6 py-2 lg:py-4  sm:py-3 ">
        <Link href="/">
          <Image
            src="/vercel.svg"
            alt="logo"
            width={35}
            height={35}
          />
        </Link>

        <div className="flex items-center space-x-4">
          {!["/", "/profile", "/settings"].includes(pathname) &&
            session?.user.stores.length > 0 && (
              <>
                <StoreSwitcher className="" items={session?.user.stores} />
                <MainNav className="lg:flex hidden" />
                <MobileNav />
              </>
            )}
          {["/", "/profile", "/settings"].includes(pathname) &&
            session?.user.stores.length > 0 && (
              <Link href="/stores-setup">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                >
                  <StoreIcon />
                  <span className="ml-1 hidden md:block">Open Store</span>
                </Button>
              </Link>
            )}

          <ModeToggle />

          {session?.user?.phoneNumberVerified ? (
            <div className="hidden md:flex ">
              <UserButton />
            </div>
          ) : (
            <>
              <div className="hidden md:flex items-center space-x-2">
                <Button
                  variant={pathname === "/login" ? "default" : "outline"}
                  size="sm"
                  className={
                    pathname === "/login"
                      ? "bg-purple-600 hover:bg-purple-700 text-white backdrop-blur"
                      : "text-purple-600 dark:hover:bg-slate-800 backdrop-blur"
                  }
                  onClick={() => handleNavigation("/login")}
                >
                  Login
                </Button>

                <Button
                  variant={pathname === "/register" ? "default" : "outline"}
                  size="sm"
                  className={
                    pathname === "/register"
                      ? "bg-purple-600 hover:bg-purple-700 text-white backdrop-blur"
                      : "text-purple-600 dark:hover:bg-slate-800 backdrop-blur"
                  }
                  onClick={() => handleNavigation("/register")}
                >
                  Register
                </Button>
              </div>

              <div className="md:hidden">
                <Button
                  variant="default"
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 text-white backdrop-blur"
                  onClick={() => handleNavigation("/login")}
                >
                  Login
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
