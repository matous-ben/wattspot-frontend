import { Card } from '../components/ui/Card'

export function DashboardPage() {
  return (
    <Card>
      <p className="text-sm text-fg-muted">Přehled</p>
      <h1 className="mt-1 text-2xl font-semibold">Dashboard</h1>
      <p className="mt-3 text-fg-muted">Tady uvidíš dnešní ceny elektřiny.</p>
    </Card>
  )
}
