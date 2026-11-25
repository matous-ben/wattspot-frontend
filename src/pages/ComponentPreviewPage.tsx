import { useId, useState, type ReactNode } from 'react'
import {
  Plus,
  Search,
  WashingMachine,
} from 'lucide-react'
import { Alert } from '../components/ui/Alert'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Checkbox } from '../components/ui/Checkbox'
import { EmptyState } from '../components/ui/EmptyState'
import { IconButton } from '../components/ui/IconButton'
import { Input } from '../components/ui/Input'
import { Logo } from '../components/ui/Logo'
import { MetricCard } from '../components/ui/MetricCard'
import { Modal } from '../components/ui/Modal'
import { NumberStepper } from '../components/ui/NumberStepper'
import { SegmentedControl } from '../components/ui/SegmentedControl'
import { Skeleton } from '../components/ui/Skeleton'
import { Toggle } from '../components/ui/Toggle'
import { WizardProgress } from '../components/ui/WizardProgress'

function PreviewSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  const sectionId = useId()

  return (
    <section aria-labelledby={`${sectionId}-heading`}>
      <h2
        id={`${sectionId}-heading`}
        className="mb-3 text-lg font-semibold text-fg"
      >
        {title}
      </h2>
      <Card className="space-y-4">{children}</Card>
    </section>
  )
}

export function ComponentPreviewPage() {
  const [period, setPeriod] = useState<'today' | 'tomorrow'>('today')
  const [email, setEmail] = useState('')
  const [power, setPower] = useState('3,5')
  const [checked, setChecked] = useState(true)
  const [enabled, setEnabled] = useState(true)
  const [stepperValue, setStepperValue] = useState(2)
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-8 pb-28">
      <header className="space-y-4">
        <Logo />
        <div>
          <h1 className="text-2xl font-semibold text-fg">
            Náhled UI komponent
          </h1>
          <p className="mt-2 text-sm text-fg-muted">
            Vývojová stránka pro kontrolu vzhledu a stavů znovupoužitelných
            komponent.
          </p>
        </div>
      </header>

      <PreviewSection title="Tlačítka a ikonová tlačítka">
        <div className="flex flex-wrap gap-3">
          <Button>Přidat spotřebič</Button>
          <Button variant="secondary">Zrušit</Button>
          <Button variant="ghost">Více informací</Button>
          <Button variant="destructive">Smazat</Button>
          <Button size="sm" variant="secondary">
            Malé tlačítko
          </Button>
          <Button loading>Ukládání</Button>
          <Button disabled>Zakázané</Button>
          <IconButton
            icon={<Plus size={24} strokeWidth={2} />}
            label="Přidat"
            variant="primary"
          />
          <IconButton
            icon={<Search size={24} strokeWidth={2} />}
            label="Hledat"
            variant="ghost"
          />
        </div>
      </PreviewSection>

      <PreviewSection title="Štítky">
        <div className="flex flex-wrap gap-2">
          <Badge level="cheap" dot>
            Levná
          </Badge>
          <Badge level="mid" dot>
            Střední
          </Badge>
          <Badge level="expensive" dot>
            Drahá
          </Badge>
          <Badge level="negative" dot>
            Záporná
          </Badge>
          <Badge status="active" dot>
            Aktivní
          </Badge>
          <Badge status="warning" dot>
            Upozornění
          </Badge>
          <Badge status="error" dot>
            Chyba
          </Badge>
          <Badge>Neutrální</Badge>
        </div>
      </PreviewSection>

      <PreviewSection title="Formuláře a ovládání">
        <div className="space-y-5">
          <Input
            label="E-mail"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="jan@example.cz"
            helper="Použije se pro přihlášení."
          />
          <Input
            label="Výkon FVE"
            value={power}
            onChange={setPower}
            suffix="kWp"
          />
          <Input
            label="Neplatná hodnota"
            value=""
            onChange={() => undefined}
            error="Zadej platnou hodnotu."
          />
          <Input
            label="Zakázané pole"
            value="Nelze upravit"
            onChange={() => undefined}
            disabled
          />
          <Checkbox
            checked={checked}
            onChange={setChecked}
            label="Souhlasím s podmínkami"
          />
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-fg">Fotovoltaika</span>
            <Toggle
              checked={enabled}
              onChange={setEnabled}
              label="Fotovoltaika"
            />
          </div>
          <NumberStepper
            value={stepperValue}
            onChange={setStepperValue}
            min={1}
            max={10}
            step={0.5}
            unit="kW"
            label="Příkon"
          />
          <SegmentedControl
            label="Časový úsek"
            value={period}
            onChange={setPeriod}
            options={[
              { value: 'today', label: 'Dnes' },
              { value: 'tomorrow', label: 'Zítra' },
            ]}
          />
        </div>
      </PreviewSection>

      <PreviewSection title="Karty a metriky">
        <div className="grid gap-3 sm:grid-cols-2">
          <Card>
            <h3 className="font-semibold text-fg">Základní karta</h3>
            <p className="mt-2 text-sm text-fg-muted">
              Obsah karty používá tokeny aplikace.
            </p>
          </Card>
          <MetricCard
            label="Průměrná cena"
            value="2,35"
            unit="Kč/kWh"
            delta={{ text: 'O 12 % levněji', status: 'active' }}
          />
        </div>
      </PreviewSection>

      <PreviewSection title="Upozornění a prázdný stav">
        <div className="space-y-3">
          <Alert type="info">Ceny jsou převzaté z ukázkových dat.</Alert>
          <Alert type="success">Spotřebič byl uložen.</Alert>
          <Alert type="warning">Zítřejší ceny zatím nejsou dostupné.</Alert>
          <Alert type="error" onClose={() => undefined}>
            Ceny se nepodařilo načíst. Zkus to znovu.
          </Alert>
          <EmptyState
            icon={<WashingMachine size={28} strokeWidth={2} />}
            title="Zatím tu nic není"
            text="Přidej první spotřebič a ukážeme ti, kdy ho pustit."
            action={<Button>Přidat spotřebič</Button>}
          />
        </div>
      </PreviewSection>

      <PreviewSection title="Načítání a průvodce">
        <div className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-32 w-full" />
          <WizardProgress step={3} />
        </div>
      </PreviewSection>

      <PreviewSection title="Dialog">
        <Button onClick={() => setModalOpen(true)}>Otevřít dialog</Button>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Přidat spotřebič"
          footer={
            <>
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Zrušit
              </Button>
              <Button onClick={() => setModalOpen(false)}>Uložit</Button>
            </>
          }
        >
          <p className="text-sm text-fg-muted">
            Na mobilu se dialog zobrazuje jako spodní sheet a od šířky md jako
            centrované okno.
          </p>
        </Modal>
      </PreviewSection>

    </div>
  )
}
