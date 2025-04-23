import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"

const routes = [
  {
    href: "/rules",
    label: "ルール",
  },
  {
    href: "/events",
    label: "イベント",
  },
  {
    href: "/gallery",
    label: "ギャラリー",
  },
  {
    href: "/blog",
    label: "ブログ",
  },
]

interface MainNavProps {
  className?: string
}

export function MainNav({ className }: MainNavProps) {
  return (
    <NavigationMenu className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      <NavigationMenuList>
        {routes.map((route) => (
          <NavigationMenuItem key={route.href}>
            <NavigationMenuLink asChild>
              <Link 
                href={route.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {route.label}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
} 