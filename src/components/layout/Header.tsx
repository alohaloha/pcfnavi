import Link from "next/link"
import {Menu} from "lucide-react"
import {MainNav} from "./Navigation"
import {Sheet, SheetContent, SheetTrigger, SheetTitle} from "@/components/ui/sheet"
import Image from "next/image";

export function Header() {
    return (
        <header
            className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4 md:px-8 max-w-7xl mx-auto">
                <Link href="/" className="font-display font-bold text-2xl">
                    <Image
                        src="/images/header_logo.jpg"
                        alt="電くるなび"
                        height={160}
                        width={160}
                    />
                </Link>

                {/* デスクトップナビゲーション */}
                <div className="hidden md:block">
                    <MainNav/>
                </div>

                {/* モバイルナビゲーション */}
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger aria-label="メニューを開く" className="p-2 -m-2">
                            <Menu className="h-6 w-6"/>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-64">
                            <SheetTitle className="text-white">メニュー</SheetTitle>
                            <div className="mt-6">
                                <MainNav className="flex flex-col space-y-4 text-white"/>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}
