import { useTheme } from "@/components/Theme/ThemeProvider"

export function Logo({ className }) {
  const { theme } = useTheme()

  return (
    <div className={className}>
      <img src={theme === "dark" ? "@/assets/logo-dark.svg" : "@/assets/logo-light.svg"} alt="Vaultbox" className="h-8 w-auto" />
    </div>
  )
}

