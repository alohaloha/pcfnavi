import Link from "next/link"

const footerLinks = {
  about: [
    {
      title: "About",
      href: "/about",
    },
    {
      title: "FAQ",
      href: "/faq",
    },
    {
      title: "Contact",
      href: "/contact",
    },
  ],
  legal: [
    {
      title: "Privacy Policy",
      href: "/privacy-policy",
    },
    {
      title: "Terms of Use",
      href: "/terms",
    },
  ],
  faq: [
    {
      title: "電動車椅子サッカーとは？",
      href: "/faq#what-is-pcf",
    },
    {
      title: "観戦するには？",
      href: "/faq#how-to-watch",
    },
    {
      title: "競技を始めるには？",
      href: "/faq#how-to-start",
    },
  ],
}

const socialLinks = [
  {
    title: "Twitter",
    href: "https://twitter.com/pcf_navi",
    icon: "twitter",
  },
  {
    title: "Facebook",
    href: "https://facebook.com/pcf_navi",
    icon: "facebook",
  },
  {
    title: "Instagram",
    href: "https://instagram.com/pcf_navi",
    icon: "instagram",
  },
]

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h2 className="font-display font-bold text-2xl mb-4">PCF Navi</h2>
            <p className="text-sm text-muted-foreground">
              電動車椅子サッカーの総合情報サイト
            </p>
          </div>
          <nav className="space-y-4">
            <h3 className="font-bold">About</h3>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
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
            <h3 className="font-bold">よくある質問</h3>
            <ul className="space-y-2">
              {footerLinks.faq.map((link) => (
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
              <h3 className="font-bold">Legal</h3>
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
                      {/* アイコンは後ほど追加 */}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} PCF Navi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 