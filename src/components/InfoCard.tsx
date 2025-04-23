import Link from "next/link"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface InfoCardProps {
  title: string
  description: string
  href: string
  icon?: React.ReactNode
  className?: string
}

export function InfoCard({ title, description, href, icon, className }: InfoCardProps) {
  return (
    <Link href={href} className="block h-full">
      <Card className={cn("h-full transition-all hover:shadow-md", className)}>
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          {icon && <div className="text-primary">{icon}</div>}
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  )
} 