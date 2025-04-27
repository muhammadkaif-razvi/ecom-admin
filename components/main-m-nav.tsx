"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  ChevronsUpDown,
  EllipsisVertical,
  Settings,
  ShieldHalf,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useTheme } from "next-themes"; // Import the useTheme hook
import { Monitor, Moon, Sun } from "lucide-react"; // Import theme-related icons
import { UserButton } from "./auth/user/user-button";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ExitIcon } from "@radix-ui/react-icons";
import { signOut } from "next-auth/react";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const params = useParams();
  const { theme, setTheme, systemTheme } = useTheme();
  const user = useCurrentUser();
  const [mounted, setMounted] = useState(false);

  // Ensure correct theme detection after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine the current theme properly
  const currentTheme = theme === "system" ? systemTheme : theme;

  // Toggle the theme between light, dark, and system
  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  // Define the routes dynamically based on storeId
  const routes = [
    {
      href: `/${params.storeId}`,
      label: "Overview",
      active: pathname === `/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/billboards`,
      label: "Billboards",
      active: pathname === `/${params.storeId}/billboards`,
    },
    {
      href: `/${params.storeId}/categories`,
      label: "Categories",
      active: pathname === `/${params.storeId}/categories`,
    },
    {
      href: `/${params.storeId}/faces`,
      label: "Face Filter",
      active: pathname === `/${params.storeId}/faces`,
    },
    {
      href: `/${params.storeId}/hairs`,
      label: "Hairs Filter",
      active: pathname === `/${params.storeId}/hairs`,
    },
    {
      href: `/${params.storeId}/makeups`,
      label: "Makeup Filter",
      active: pathname === `/${params.storeId}/makeups`,
    },

    {
      href: `/${params.storeId}/bodys`,
      label: "Body Filter",
      active: pathname === `/${params.storeId}/bodys`,
    },
    {
      href: `/${params.storeId}/combos`,
      label: "Combos Filter",
      active: pathname === `/${params.storeId}/combos`,
    },
    {
      href: `/${params.storeId}/fragrances`,
      label: "Fragrances Filter",
      active: pathname === `/${params.storeId}/fragrances`,
    },
    {
      href: `/${params.storeId}/ingredients`,
      label: "Ingredients Filter",
      active: pathname === `/${params.storeId}/ingredients`,
    },

    {
      href: `/${params.storeId}/prices`,
      label: "Prices Filter",
      active: pathname === `/${params.storeId}/prices`,
    },
    {
      href: `/${params.storeId}/products`,
      label: "products",
      active: pathname === `/${params.storeId}/products`,
    },
    {
      href: `/${params.storeId}/variants`,
      label: "Variants",
      active: pathname === `/${params.storeId}/variants`,
    },
    {
      href: `/${params.storeId}/orders`,
      label: "Orders",
      active: pathname === `/${params.storeId}/orders`,
    },
    {
      href: `/${params.storeId}/settings`,
      label: "Settings",
      active: pathname === `/${params.storeId}/settings`,
    },
  ];

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <>
      {/* Menu Toggle Button */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-md hover:bg-muted p-2"
          >
            <EllipsisVertical className="w-6 h-6 text-primary" />
          </Button>
        </SheetTrigger>

        {/* Sidebar Drawer */}
        <SheetContent
          side="left"
          className="p-6 bg-background rounded-lg flex flex-col shadow-lg max-w-[250px]"
        >
          <div className="flex-1  space-y-1 scrollbar-hide overflow-y-auto">
            {/* Heading */}
            <SheetHeader>
              <SheetTitle>Store Management</SheetTitle>
              <SheetDescription>
                Navigate through different sections of your store to manage your
                content and settings.
              </SheetDescription>
            </SheetHeader>
            {/* Theme Toggle Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-full mb-4 py-2 mt-1 border border-muted text-muted bg-black transition-all"
            >
              {currentTheme === "light" && <Sun className="h-5 w-5" />}
              {currentTheme === "dark" && <Moon className="h-5 w-5" />}
              {currentTheme === "system" && <Monitor className="h-5 w-5" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
            {/* Navigation Links */}
            <nav className="flex flex-col">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={`block px-4 py-2 text-lg font-semibold rounded-lg transition-all hover:bg-muted hover:text-primary ${
                    route.active ? "text-primary bg-muted" : "text-foreground"
                  }`}
                  onClick={() => setOpen(false)} // Close menu on click
                >
                  {route.label}
                </Link>
              ))}
            </nav>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="py-3  border-t flex sticky bottom-0 bg-background w-full">
                <div className="flex flex-row space-x-2">
                  <UserButton />
                  <div>
                    <div className="grid flex-1 text-left text-sm min-w-0 text-muted-foreground">
                      <span className="truncate font-semibold">
                        {user.name}
                      </span>
                      <span className="truncate text-xs">{user.email}</span>
                    </div>
                  </div>
                  <div>
                    <ChevronsUpDown className="text-muted-foreground" />
                  </div>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-white dark:bg-slate-800 shadow-lg rounded-lg p-2  border border-gray-200 dark:border-slate-700 transition-colors"
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 lg:h-9 lg:w-9">
                    <AvatarImage src={user?.image || ""} />
                    <AvatarFallback className="bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-800 dark:text-purple-100 rounded-full flex items-center justify-center w-full h-full text-sm font-medium transition-colors">
                      {user?.name
                        ?.split(" ")[0] // Take the first word only
                        .charAt(0) // Take the first letter
                        .toUpperCase()}{" "}
                      {/* Capitalize the first letter */}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* Navigation Links */}
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className={`p-2 text-gray-800 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-slate-700 rounded-md transition-colors ${
                    pathname === "/settings"
                      ? "bg-purple-100 dark:bg-purple-900/30"
                      : ""
                  }`}
                >
                  <Link href="/settings" className="w-full flex items-center">
                    <Settings className="mr-2 h-4 w-4 text-purple-600 dark:text-purple-400" />
                    Settings
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  className={`p-2 text-gray-800 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-slate-700 rounded-md transition-colors ${
                    pathname === "/profile"
                      ? "bg-purple-100 dark:bg-purple-900/30"
                      : ""
                  }`}
                >
                  <Link href="/profile" className="w-full flex items-center">
                    <User className="mr-2 h-4 w-4 text-purple-600 dark:text-purple-400" />
                    Profile
                  </Link>
                </DropdownMenuItem>

                {user?.role === "ADMIN" && (
                  <DropdownMenuItem
                    className={`p-2 text-gray-800 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-slate-700 rounded-md transition-colors ${
                      pathname === "/admin"
                        ? "bg-purple-100 dark:bg-purple-900/30"
                        : ""
                    }`}
                  >
                    <Link href="/admin" className="w-full flex items-center">
                      <ShieldHalf className="mr-2 h-4 w-4 text-purple-600 dark:text-purple-400" />
                      Admin
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />

              {/* Logout Button */}
              <DropdownMenuItem
                className="cursor-pointer p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors flex items-center"
                onClick={() => signOut()}
              >
                <ExitIcon className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SheetContent>
      </Sheet>
    </>
  );
}
