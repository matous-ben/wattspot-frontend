export const formatPrice = (value: number) =>
  new Intl.NumberFormat('cs-CZ', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)

export const formatDate = (date: Date) => {
  const formatted = new Intl.DateTimeFormat('cs-CZ', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date)

  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}
