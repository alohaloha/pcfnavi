import Link from "next/link"
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

export function MainNav({className}: MainNavProps) {
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
                {routes.map((route) => (
                    <NavigationMenuItem key={route.href}>
                        <NavigationMenuLink asChild>
                            <Link
                                href={route.href}
                                className="text-sm font-medium transition-colors hover:text-white"
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
