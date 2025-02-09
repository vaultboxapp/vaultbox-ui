"use client"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "@/components/Theme/ThemeProvider"
import { useFont } from "@/context/font"

const APP_VERSION = "1.0.0"

const Settings = () => {
  const { theme, setTheme } = useTheme()
  const { font, setFont } = useFont()

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">Appearance</h2>
          <div className="space-y-4">
            <div className="space-y-3">
              <Label>Theme</Label>
              <RadioGroup value={theme} onValueChange={setTheme} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light">Light</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark">Dark</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="system" id="system" />
                  <Label htmlFor="system">System</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>Font</Label>
              <RadioGroup value={font} onValueChange={setFont} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sans" id="sans" />
                  <Label htmlFor="sans">Sans-serif</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="serif" id="serif" />
                  <Label htmlFor="serif">Serif</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mono" id="mono" />
                  <Label htmlFor="mono">Monospace</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </section>

        <Separator />

        <section>
          <h2 className="text-xl font-semibold mb-4">About</h2>
          <p className="text-sm text-muted-foreground">App Version: {APP_VERSION}</p>
        </section>
      </div>
    </div>
  )
}

export default Settings
