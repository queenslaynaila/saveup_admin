export const formatDate = (dateString: string, type: 'full' | 'short' = 'full') => {
  if (dateString === "") return "No records"
  
  const date = new Date(dateString)
  
  const fullOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }

  const shortOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }

  try {
    return date.toLocaleDateString(
      'en-US', 
      type === 'full' ? fullOptions : shortOptions
    )
  } catch (error) {
    console.log(error)
    return 'Invalid date'
  }
}