import { LucideProps } from "lucide-react"
import {
  Calendar,
  FileText,
  Image as ImageIcon,
  Info,
} from "lucide-react"

export type IconName = "calendar" | "rules" | "gallery" | "events" | "info"

interface IconProps extends LucideProps {
  name: IconName
}

const icons = {
  calendar: Calendar,
  rules: FileText,
  gallery: ImageIcon,
  events: Calendar,
  info: Info
}

export function Icon({ name, ...props }: IconProps) {
  const IconComponent = icons[name]
  return <IconComponent {...props} />
} 