import { cn } from "@/lib/utils";

interface GridProps {
  children: React.ReactNode;
  className?: string;
  cols?: number;
  gap?: number;
}

export function Grid({ 
  children, 
  className, 
  cols = 3, 
  gap = 6 
}: GridProps) {
  return (
    <div 
      className={cn(
        `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${cols} gap-${gap}`,
        className
      )}
    >
      {children}
    </div>
  );
} 