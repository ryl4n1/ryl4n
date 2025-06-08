import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface FooterProps {
  copyright: {
    text: string
  }
}

export function Footer({
  copyright,
}: FooterProps) {
  return (
    <footer className="pb-6 pt-8 lg:pb-8 lg:pt-12">
      <div className="px-4 lg:px-8">
        <div className="flex flex-col items-center justify-center">
          <div className="text-sm text-muted-foreground">
            {copyright.text}
          </div>
        </div>
      </div>
    </footer>
  )
}
