import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Button } from '../components/ui/Button'
import { Checkbox } from '../components/ui/Checkbox'
import { IconButton } from '../components/ui/IconButton'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { NumberStepper } from '../components/ui/NumberStepper'
import { SegmentedControl } from '../components/ui/SegmentedControl'
import { Toggle } from '../components/ui/Toggle'
import { WizardProgress } from '../components/ui/WizardProgress'
import { ComponentPreviewPage } from '../pages/ComponentPreviewPage'

afterEach(cleanup)

function CheckboxExample() {
  const [checked, setChecked] = useState(false)
  return (
    <Checkbox checked={checked} onChange={setChecked} label="Souhlasím" />
  )
}

function SegmentedExample() {
  const [value, setValue] = useState<'today' | 'tomorrow'>('today')
  return (
    <SegmentedControl
      label="Den"
      value={value}
      onChange={setValue}
      options={[
        { value: 'today', label: 'Dnes' },
        { value: 'tomorrow', label: 'Zítra' },
      ]}
    />
  )
}

describe('UI primitives', () => {
  it('disables Button and exposes loading text', () => {
    const { rerender } = render(
      <Button disabled>Uložit</Button>,
    )
    const disabledButton = screen.getByRole('button', { name: 'Uložit' })
    expect(disabledButton).toBeDisabled()
    expect(disabledButton).toHaveClass('disabled:cursor-not-allowed')

    rerender(<Button loading>Uložit</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByRole('button', { name: 'Načítání' })).toBeInTheDocument()
  })

  it('uses pointer cursors for enabled desktop controls', () => {
    render(
      <>
        <Button>Akce</Button>
        <Toggle checked={false} onChange={() => undefined} label="Přepínač" />
        <IconButton
          icon={<span aria-hidden="true">+</span>}
          label="Přidat"
        />
      </>,
    )

    expect(screen.getByRole('button', { name: 'Akce' })).toHaveClass(
      'cursor-pointer',
    )
    expect(screen.getByRole('switch', { name: 'Přepínač' })).toHaveClass(
      'cursor-pointer',
    )
    expect(screen.getByRole('button', { name: 'Přidat' })).toHaveClass(
      'cursor-pointer',
    )
  })

  it('renders Checkbox and updates its checked state', () => {
    render(<CheckboxExample />)

    const checkbox = screen.getByRole('checkbox', { name: 'Souhlasím' })
    expect(checkbox).not.toBeChecked()
    fireEvent.click(checkbox)
    expect(checkbox).toBeChecked()
  })

  it('renders Toggle and calls onChange with the next state', () => {
    const onChange = vi.fn()
    render(<Toggle checked={false} onChange={onChange} label="Tmavý režim" />)

    fireEvent.click(screen.getByRole('switch', { name: 'Tmavý režim' }))
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('shows Input error and links it to the field', () => {
    render(
      <Input
        label="E-mail"
        value=""
        onChange={() => undefined}
        error="Zadej platný e-mail."
      />,
    )

    const input = screen.getByRole('textbox', { name: 'E-mail' })
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Zadej platný e-mail.')).toBeInTheDocument()
  })

  it('creates unique field ids for repeated Input labels', () => {
    render(
      <>
        <Input label="Výkon" value="" onChange={() => undefined} />
        <Input label="Výkon" value="" onChange={() => undefined} />
      </>,
    )

    const fields = screen.getAllByRole('textbox', { name: 'Výkon' })
    expect(fields).toHaveLength(2)
    expect(fields[0].id).not.toBe(fields[1].id)
  })

  it('clamps NumberStepper values at min and max', () => {
    const onChange = vi.fn()
    render(
      <NumberStepper
        value={1}
        onChange={onChange}
        min={1}
        max={3}
        step={1}
        unit="kW"
        label="Příkon"
      />,
    )

    expect(screen.getByRole('button', { name: 'Snížit Příkon' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Zvýšit Příkon' }))
    expect(onChange).toHaveBeenCalledWith(2)
  })

  it('formats NumberStepper decimal values using Czech separators', () => {
    render(
      <NumberStepper
        value={2.5}
        onChange={() => undefined}
        min={1}
        max={3}
        step={0.5}
        unit="kW"
        label="Příkon"
      />,
    )

    expect(screen.getByText('2,5 kW')).toBeInTheDocument()
  })

  it('changes SegmentedControl selection', () => {
    render(<SegmentedExample />)

    fireEvent.click(screen.getByRole('radio', { name: 'Zítra' }))
    expect(screen.getByRole('radio', { name: 'Zítra' })).toBeChecked()
  })

  it('vertically centers 44px segments in the 54px Figma control', () => {
    render(<SegmentedExample />)

    const group = screen.getByRole('radiogroup', { name: 'Den' })
    const segment = screen.getByRole('radio', { name: 'Dnes' })
    expect(group.className).toContain('h-[54px]')
    expect(group.className).toContain('p-1')
    expect(segment.parentElement?.className).toContain('h-11')
  })

  it('closes Modal with Escape', () => {
    const onClose = vi.fn()
    render(
      <Modal open onClose={onClose} title="Přidat spotřebič">
        Obsah
      </Modal>,
    )

    expect(screen.getByRole('dialog', { name: 'Přidat spotřebič' })).toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('wraps focus within the Modal', () => {
    render(
      <Modal
        open
        onClose={() => undefined}
        title="Test dialog"
        footer={<button type="button">Potvrdit</button>}
      >
        Obsah
      </Modal>,
    )

    const dialog = screen.getByRole('dialog', { name: 'Test dialog' })
    const closeButton = screen.getByRole('button', { name: 'Zavřít' })
    const confirmButton = screen.getByRole('button', { name: 'Potvrdit' })
    dialog.focus()
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
    expect(confirmButton).toHaveFocus()
    confirmButton.focus()
    fireEvent.keyDown(document, { key: 'Tab' })
    expect(closeButton).toHaveFocus()
  })

  it('clamps WizardProgress values to its valid step range', () => {
    render(<WizardProgress step={10} total={5} />)

    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '5',
    )
  })

  it('shows the UI component catalog and opens its dialog', () => {
    render(<ComponentPreviewPage />)

    expect(
      screen.getByRole('heading', { name: 'Náhled UI komponent' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('radiogroup', { name: 'Časový úsek' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('switch', { name: 'Fotovoltaika' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Otevřít dialog' }))
    expect(
      screen.getByRole('dialog', { name: 'Přidat spotřebič' }),
    ).toBeInTheDocument()
  })
})
