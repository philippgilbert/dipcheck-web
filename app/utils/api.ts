export interface MeasurementPoint {
  id: number
  measurementPoint: string
  waters: string
  district: string
}

export interface Measurement {
  measuredAt: string
  waterTemperature: number
}

/** HTTP status of a failed $fetch, undefined if no response could be read. */
export function statusCodeOf(error: unknown): number | undefined {
  return (error as { statusCode?: number } | null)?.statusCode
}

/** Seconds from the Retry-After header of a failed $fetch, undefined if missing or not a number. */
export function retryAfterSecondsOf(error: unknown): number | undefined {
  const header = (error as { response?: Response } | null)?.response?.headers.get('Retry-After')
  const seconds = Number(header)
  // the backend sends seconds; the HTTP-date form of the header is not used
  return header && Number.isFinite(seconds) && seconds > 0 ? seconds : undefined
}

/** "in 30 Sekunden", "in 5 Minuten" – rounded up, the backend allows at most one hour. */
function waitTimeText(seconds: number): string {
  if (seconds < 60) {
    return seconds === 1 ? 'in einer Sekunde' : `in ${seconds} Sekunden`
  }
  const minutes = Math.ceil(seconds / 60)
  return minutes === 1 ? 'in einer Minute' : `in ${minutes} Minuten`
}

/**
 * Turns a failed $fetch into a message for users.
 * The backend returns errors as ProblemDetail, but its `detail` is English and meant
 * for developers – hence our own texts per status code.
 * For 429 the wait time from Retry-After is appended to the message.
 */
export function errorMessage(error: unknown, messagesByStatus: Record<number, string> = {}): string {
  const status = statusCodeOf(error)
  if (status === undefined) {
    // No readable response: server unreachable or response without CORS headers
    return 'Der Server ist gerade nicht erreichbar. Bitte versuche es später noch einmal.'
  }
  if (status === 429) {
    const seconds = retryAfterSecondsOf(error)
    const waitTime = seconds === undefined ? 'gleich' : waitTimeText(seconds)
    return `${messagesByStatus[429] ?? 'Zu viele Anfragen.'} Bitte versuche es ${waitTime} noch einmal.`
  }
  if (messagesByStatus[status]) {
    return messagesByStatus[status]
  }
  return 'Da ist etwas schiefgelaufen. Bitte versuche es später noch einmal.'
}
