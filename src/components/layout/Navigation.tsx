"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {cn} from "@/lib/utils"

const routes = [
    {
        href: "/rules",
        label: "ルール",
    },
    {
        href: "/event",
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

export function MainNav({className}: MainNavProps) {
    const pathname = usePathname()

    // クラス名に応じてスタイルを適応させる
    const menuClass = cn(
        "flex items-center",
        // className に 'flex-col' が含まれる場合、NavigationMenuListも縦並びにする
        className?.includes('flex-col') ? "" : "space-x-4 lg:space-x-6",
        className || ""
    )

    const listClass = cn(
        // className に 'flex-col' が含まれる場合、listも縦並びにする
        className?.includes('flex-col') ? "flex flex-col space-y-2 w-full" : ""
    )

    return (
        <NavigationMenu className={menuClass}>
            <NavigationMenuList className={listClass}>
                {routes.map((route) => {
                    const isActive = pathname.startsWith(route.href)
                    return (
                        <NavigationMenuItem key={route.href}>
                            <NavigationMenuLink asChild>
                                <Link
                                    href={route.href}
                                    className={cn(
                                        "text-sm font-medium transition-colors hover:text-white hover:bg-accent rounded-md px-3 py-2",
                                        isActive && "text-white font-bold bg-accent"
                                    )}
                                >
                                    {route.label}
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    )
                })}
            </NavigationMenuList>
        </NavigationMenu>
    )
}
