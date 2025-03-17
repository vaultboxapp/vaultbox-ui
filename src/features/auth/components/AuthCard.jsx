import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/ui/logo"

const AuthCard = ({ title, subtitle, children, footer }) => {
  return (
    <Card className="w-full max-w-md mx-auto bg-card dark:bg-card border-border dark:border-border shadow-lg">
      <CardHeader className="space-y-2 text-center px-6 pt-6 pb-4 sm:px-8 sm:pt-8 sm:pb-6">
        <div className="flex justify-center mb-2">
          <Logo className="h-12 w-auto" />
        </div>
        {title && <CardTitle className="text-2xl font-medium">{title}</CardTitle>}
        {subtitle && <CardDescription className="text-muted-foreground">{subtitle}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4 px-6 sm:px-8">{children}</CardContent>
      {footer && (
        <CardFooter className="flex justify-center pt-2 pb-6 border-t border-border px-6 sm:px-8 sm:pb-8">
          {footer}
        </CardFooter>
      )}
    </Card>
  )
}

export default AuthCard

