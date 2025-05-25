import Link from "next/link"
import {Fa6BrandsSquareXTwitter} from "@/components/icon/Fa6BrandsSquareXTwitter";

const footerLinks = {
    about: [
        {
            title: "このサイトについて",
            href: "/about",
        },
        {
            title: "お問合せ",
            href: "https://forms.gle/ULgwcr2wqbVSLv9Q6",
        },
    ],
    legal: [
        {
            title: "Privacy Policy",
            href: "/privacy-policy",
        },
    ],
    resources: [
        {
            title: "よくある質問",
            href: "/faq",
        },
        {
            title: "イベント情報",
            href: "/calendar",
        },
    ],
}

const socialLinks = [
    {
        title: "Twitter",
        href: "https://twitter.com/denkuru_navi",
        icon: "twitter",
    },
]

export function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="container py-8 md:py-12 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div>
                        <h2 className="font-display font-bold text-2xl mb-4">電くるなび</h2>
                        <p className="text-sm text-muted-foreground">
                            電動車椅子サッカーの総合情報サイト
                        </p>
                    </div>
                    <nav className="space-y-4">
                        <h3 className="font-bold">概要</h3>
                        <ul className="space-y-2">
                            {footerLinks.about.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <nav className="space-y-4">
                        <h3 className="font-bold">お役立ち情報</h3>
                        <ul className="space-y-2">
                            {footerLinks.resources.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <div className="space-y-4">
                        <nav className="space-y-4">
                            <h3 className="font-bold">その他</h3>
                            <ul className="space-y-2">
                                {footerLinks.legal.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {link.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                        <nav className="space-y-4">
                            <h3 className="font-bold">Social</h3>
                            <ul className="flex space-x-4">
                                {socialLinks.map((link) => (
                                    <li key={link.href}>
                                        <a
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            <span className="sr-only">{link.title}</span>
                                            <Fa6BrandsSquareXTwitter/>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
                <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
                    <p>&copy; 2025 電くるなび. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
} 