function naturalOrdinalSuffix(day: number): string {
  switch (day % 10) {
    case 1:
      return 'st'
    case 2:
      return 'nd'
    case 3:
      return 'rd'
    default:
      return 'th'
  }
}

function formatToNaturalDate(date: Date): string {
  const day = date.getDate()
  const year = date.getFullYear()

  const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date)
  const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date)

  return `${dayOfWeek}, ${month} ${day}${naturalOrdinalSuffix(day)}, ${year}`
}

export { formatToNaturalDate }
