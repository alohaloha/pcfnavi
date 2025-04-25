import Link from "next/link"
import Image from "next/image"
import {cn} from "@/lib/utils"
import {formatDate} from "@/lib/utils"
import {Card, CardContent, CardHeader} from "@/components/ui/card"

interface PostCardProps {
    title: string
    excerpt: string
    date: string
    slug: number
    image?: string
    className?: string
}

export function PostCard({title, excerpt, date, slug, image, className}: PostCardProps) {
    return (
        <Link href={`/blog/${slug}`} className="block h-full">
            <Card className={cn("h-full overflow-hidden transition-all hover:shadow-md", className)}>
                {image && (
                    <div className="aspect-video relative overflow-hidden">
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover transition-transform hover:scale-105"
                        />
                    </div>
                )}
                <CardHeader className="p-4">
                    <h3 className="text-xl font-bold">{title}</h3>
                    <time className="text-sm text-muted-foreground">{formatDate(date)}</time>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <p className="line-clamp-3 text-muted-foreground">{excerpt}</p>
                </CardContent>
            </Card>
        </Link>
    )
} 