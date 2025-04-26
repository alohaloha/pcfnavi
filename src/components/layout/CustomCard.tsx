import React, {ReactNode} from 'react';
import Image from 'next/image';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';

interface CustomCardProps {
    title: string;
    description?: ReactNode;
    image?: {
        src: string;
        alt: string;
    };
    badges?: {
        text: string;
        variant?: 'default' | 'secondary' | 'destructive' | 'outline';
        className?: string;
    }[];
    children?: ReactNode;
    footer?: ReactNode;
    className?: string;
    onClick?: () => void;
    featured?: boolean;
    cornerBadge?: {
        text: string;
        className?: string;
    };
}

export const CustomCard = ({
                               title,
                               description,
                               image,
                               badges = [],
                               children,
                               footer,
                               className = '',
                               onClick,
                               featured = false,
                               cornerBadge,
                           }: CustomCardProps) => {
    return (
        <Card
            className={`overflow-hidden h-full transition-all hover:shadow-lg ${featured ? 'border-primary' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}
            onClick={onClick}
        >
            {image && (
                <div className="relative h-48 w-full">
                    <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                    />
                    {cornerBadge && (
                        <Badge className={`absolute top-2 right-2 ${cornerBadge.className || ''}`}>
                            {cornerBadge.text}
                        </Badge>
                    )}
                </div>
            )}

            <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
                </div>
                {badges.length > 0 && (
                    <CardDescription className="flex flex-wrap gap-1 mt-1">
                        {badges.map((badge, index) => (
                            <Badge
                                key={index}
                                variant={badge.variant || 'outline'}
                                className={badge.className}
                            >
                                {badge.text}
                            </Badge>
                        ))}
                    </CardDescription>
                )}
                {description && (
                    <CardDescription className="mt-1">
                        {description}
                    </CardDescription>
                )}
            </CardHeader>

            {children && (
                <CardContent className="p-4 pt-2 pb-2">
                    {children}
                </CardContent>
            )}

            {footer && (
                <CardFooter className="p-4 pt-2">
                    {footer}
                </CardFooter>
            )}
        </Card>
    );
}; 