<script setup lang="ts">
import type { Measurement, MeasurementPoint } from '~/utils/api'

const apiBase = useRuntimeConfig().public.apiBase

// server: false – the page is statically generated, but the list should be current
// instead of being frozen at build time
const { data: measurementPoints, status: pointsStatus, refresh: reloadPoints } = useFetch<MeasurementPoint[]>(
  '/measurement-points',
  { baseURL: apiBase, server: false, default: () => [] }
)

const search = ref('')
const selectedId = ref<number | null>(null)

const filteredPoints = computed(() => {
  const query = search.value.trim().toLocaleLowerCase('de')
  return measurementPoints.value
    .filter(point =>
      [point.measurementPoint, point.waters, point.district]
        .some(text => text.toLocaleLowerCase('de').includes(query))
    )
    .sort((a, b) =>
      a.waters.localeCompare(b.waters, 'de') || a.measurementPoint.localeCompare(b.measurementPoint, 'de')
    )
})

const selectedPoint = computed(() =>
  measurementPoints.value.find(point => point.id === selectedId.value) ?? null
)

// Only load the measurement of the selected point – loading all at once would exceed the rate limit (60/min)
const measurement = ref<Measurement | null>(null)
const measurementState = ref<'idle' | 'loading' | 'success' | 'missing' | 'error'>('idle')

watch(selectedId, async (id) => {
  measurement.value = null
  if (id === null) {
    measurementState.value = 'idle'
    return
  }
  measurementState.value = 'loading'
  try {
    const result = await $fetch<Measurement>(`/measurement-points/${id}/measurement`, { baseURL: apiBase })
    // The user may have selected another measurement point in the meantime
    if (selectedId.value !== id) return
    measurement.value = result
    measurementState.value = 'success'
  } catch (error) {
    if (selectedId.value !== id) return
    measurementState.value = statusCodeOf(error) === 404 ? 'missing' : 'error'
  }
})

// Example in the hero, so visitors see what they get before choosing anything.
// Matched by name, because the id differs between the local and the prod database.
const FEATURED_POINT = { waters: 'Isar', measurementPoint: 'München' }
const featuredPoint = computed(() =>
  measurementPoints.value.find(point =>
    point.waters === FEATURED_POINT.waters && point.measurementPoint === FEATURED_POINT.measurementPoint
  ) ?? null
)
const featuredMeasurement = ref<Measurement | null>(null)
const featuredState = ref<'loading' | 'success' | 'error'>('loading')

watch(featuredPoint, async (point) => {
  if (point === null) return
  try {
    featuredMeasurement.value = await $fetch<Measurement>(`/measurement-points/${point.id}/measurement`, { baseURL: apiBase })
    featuredState.value = 'success'
  } catch {
    // the example is optional, the hero just hides it
    featuredState.value = 'error'
  }
})

watch(pointsStatus, (status) => {
  if (status === 'error' || (status === 'success' && featuredPoint.value === null)) {
    featuredState.value = 'error'
  }
})

function chooseFeaturedPoint() {
  if (featuredPoint.value === null) return
  // narrows the list so the selected point is visible in it
  search.value = featuredPoint.value.measurementPoint
  selectedId.value = featuredPoint.value.id
}

const temperatureFormat = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
const dateFormat = new Intl.DateTimeFormat('de-DE', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Europe/Berlin'
})
const timeFormat = new Intl.DateTimeFormat('de-DE', { timeStyle: 'short', timeZone: 'Europe/Berlin' })
const dayFormat = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', timeZone: 'Europe/Berlin' })

/** "heute, 07:45 Uhr" or "27.10., 07:45 Uhr" */
function measuredAtText(measuredAt: string): string {
  const date = new Date(measuredAt)
  const day = dayFormat.format(date) === dayFormat.format(new Date()) ? 'heute' : dayFormat.format(date)
  return `${day}, ${timeFormat.format(date)} Uhr`
}

// Subscription form
const email = ref('')
const submitState = ref<'idle' | 'sending' | 'success' | 'error'>('idle')
const submitError = ref('')

async function subscribe() {
  if (selectedId.value === null) return
  submitState.value = 'sending'
  try {
    await $fetch('/subscriptions', {
      baseURL: apiBase,
      method: 'POST',
      body: { email: email.value.trim(), measurementPointId: selectedId.value }
    })
    submitState.value = 'success'
  } catch (error) {
    submitError.value = errorMessage(error, {
      400: 'Bitte prüfe deine E-Mail-Adresse.',
      429: 'Zu viele Anmeldeversuche.'
    })
    submitState.value = 'error'
  }
}

function startOver() {
  email.value = ''
  selectedId.value = null
  submitState.value = 'idle'
}
</script>

<template>
  <div>
    <section class="hero">
      <div class="hero-content">
        <h1>Wie warm ist das Wasser heute?</h1>
        <p class="hero-text">
          DipCheck schickt dir jeden Morgen die Wassertemperatur deiner Messstelle
          an einem bayerischen Gewässer per E&#8209;Mail.
        </p>
        <ul class="facts">
          <li>Kostenlos</li>
          <li>Ohne Konto</li>
          <li>Jederzeit abbestellbar</li>
        </ul>
      </div>

      <aside v-if="featuredState !== 'error'" class="teaser" :aria-busy="featuredState === 'loading'">
        <p class="teaser-label">Aktueller Messwert</p>
        <p class="teaser-temperature">
          {{ featuredMeasurement ? temperatureFormat.format(featuredMeasurement.waterTemperature) : '–' }}&nbsp;°C
        </p>
        <p class="teaser-place">
          {{ FEATURED_POINT.waters }}, {{ FEATURED_POINT.measurementPoint }}
          <span v-if="featuredMeasurement" class="teaser-time">{{ measuredAtText(featuredMeasurement.measuredAt) }}</span>
        </p>
        <a href="#abonnieren" class="teaser-link" @click="chooseFeaturedPoint">Diese Messstelle abonnieren</a>
      </aside>

      <svg class="hero-wave" viewBox="0 0 1200 60" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 30c150 -30 300 30 450 15S750 -10 900 15s225 25 300 10V60H0Z" />
      </svg>
    </section>

    <h2 id="abonnieren" class="form-heading">Wassertemperatur abonnieren</h2>

    <section v-if="submitState === 'success'" class="card" aria-live="polite">
      <h2>Fast geschafft!</h2>
      <p>
        Wir haben dir eine E-Mail an <strong>{{ email }}</strong> geschickt.
        Bitte bestätige dein Abo über den Link darin.
      </p>
      <details>
        <summary>Keine E-Mail bekommen?</summary>
        <p>
          Schau bitte auch im Spam-Ordner nach. Wenn die Mail auch dort nicht ankommt,
          melde dich über die Kontaktdaten im <NuxtLink to="/impressum">Impressum</NuxtLink>.
        </p>
      </details>
      <button type="button" class="secondary" @click="startOver">Weitere Messstelle abonnieren</button>
    </section>

    <form v-else class="card" @submit.prevent="subscribe">
      <fieldset>
        <legend><span class="step">1</span>Messstelle wählen</legend>

        <label for="search" class="label">Suche nach Ort, Gewässer oder Landkreis</label>
        <input
          id="search"
          v-model="search"
          type="search"
          placeholder="z. B. Isar, Starnberg …"
          autocomplete="off"
        >

        <!-- 'idle' too: in the generated HTML the request has not started yet -->
        <p v-if="pointsStatus === 'idle' || pointsStatus === 'pending'" class="hint">Messstellen werden geladen …</p>
        <div v-else-if="pointsStatus === 'error'" class="message error">
          <p>Die Messstellen konnten nicht geladen werden.</p>
          <button type="button" class="secondary" @click="reloadPoints()">Erneut versuchen</button>
        </div>
        <p v-else-if="filteredPoints.length === 0" class="hint">Keine Messstelle gefunden.</p>

        <ul v-else class="point-list">
          <li v-for="point in filteredPoints" :key="point.id">
            <label class="point" :class="{ selected: point.id === selectedId }">
              <input v-model="selectedId" type="radio" name="measurementPoint" :value="point.id" required>
              <span>
                <span class="point-name">{{ point.waters }} – {{ point.measurementPoint }}</span>
                <span class="point-district">{{ point.district }}</span>
              </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <div v-if="selectedPoint" class="measurement" aria-live="polite">
        <p v-if="measurementState === 'loading'" class="hint">Aktueller Messwert wird geladen …</p>
        <template v-else-if="measurementState === 'success' && measurement">
          <p class="temperature">{{ temperatureFormat.format(measurement.waterTemperature) }} °C</p>
          <p class="hint">
            {{ selectedPoint.waters }}, {{ selectedPoint.measurementPoint }} ·
            gemessen am {{ dateFormat.format(new Date(measurement.measuredAt)) }} Uhr
          </p>
        </template>
        <p v-else-if="measurementState === 'missing'" class="hint">
          Für diese Messstelle gibt es gerade keinen aktuellen Messwert.
        </p>
        <p v-else-if="measurementState === 'error'" class="hint">
          Der aktuelle Messwert konnte nicht geladen werden.
        </p>
      </div>

      <fieldset>
        <legend><span class="step">2</span>E-Mail-Adresse eintragen</legend>
        <label for="email" class="label">E-Mail-Adresse</label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          maxlength="254"
          autocomplete="email"
          placeholder="du@example.de"
        >
        <p class="hint">
          Du bekommst zuerst eine Mail mit einem Bestätigungslink. Abmelden kannst du dich jederzeit
          über den Link in jeder Mail. Mehr dazu in der <NuxtLink to="/datenschutz">Datenschutzerklärung</NuxtLink>.
        </p>
      </fieldset>

      <p v-if="submitState === 'error'" class="message error" role="alert">{{ submitError }}</p>

      <button type="submit" :disabled="selectedId === null || submitState === 'sending'">
        {{ submitState === 'sending' ? 'Wird gesendet …' : 'Abonnieren' }}
      </button>
      <p v-if="selectedId === null" class="hint">Bitte wähle zuerst eine Messstelle.</p>
    </form>
  </div>
</template>

<style scoped>
.hero {
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 2rem;
  overflow: hidden;
  padding: 2.75rem 2.5rem 4rem;
  color: #fff;
  background: var(--hero-gradient);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
}

.hero h1 {
  margin: 0 0 0.875rem;
  font-size: clamp(1.875rem, 6vw, 2.25rem);
}

.hero-text {
  max-width: 26rem;
  margin: 0 0 1.5rem;
  font-size: 1.0625rem;
  opacity: 0.92;
}

.facts {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.facts li {
  padding: 0.3rem 0.8rem;
  font-size: 0.875rem;
  font-weight: 500;
  background: rgb(255 255 255 / 0.14);
  border: 1px solid rgb(255 255 255 / 0.22);
  border-radius: 999px;
}

.facts li::before {
  content: '✓ ';
  opacity: 0.8;
}

.teaser {
  position: relative;
  z-index: 1;
  min-width: 12.5rem;
  padding: 1.25rem 1.5rem;
  text-align: center;
  background: rgb(255 255 255 / 0.14);
  border: 1px solid rgb(255 255 255 / 0.25);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(4px);
}

.teaser p {
  margin: 0;
}

.teaser-label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  opacity: 0.85;
}

.teaser-temperature {
  font-size: 3.25rem;
  font-weight: 700;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}

.teaser-place {
  font-weight: 600;
}

.teaser-time {
  display: block;
  font-size: 0.8125rem;
  font-weight: 400;
  opacity: 0.85;
}

.teaser-link {
  display: inline-block;
  margin-top: 0.875rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #0a5f8e;
  text-decoration: none;
  background: #fff;
  border-radius: 999px;
  transition: transform 0.1s, box-shadow 0.15s;
}

.teaser-link:hover {
  box-shadow: 0 4px 14px rgb(0 0 0 / 0.18);
}

.teaser-link:active {
  transform: translateY(1px);
}

.teaser-link:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

.hero-wave {
  position: absolute;
  right: 0;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2.5rem;
  fill: var(--color-bg);
  opacity: 0.35;
}

.form-heading {
  margin: 3rem 0 1.25rem;
  font-size: 1.5rem;
  scroll-margin-top: 1rem;
}

details summary {
  cursor: pointer;
  color: var(--color-primary);
}

details p {
  margin-top: 0.5rem;
  color: var(--color-muted);
}

fieldset {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

legend {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 0.75rem;
  padding: 0;
  font-size: 1.125rem;
  font-weight: 600;
}

.step {
  display: inline-grid;
  place-items: center;
  width: 1.75rem;
  height: 1.75rem;
  font-size: 0.875rem;
  color: var(--color-primary);
  background: var(--color-primary-soft);
  border-radius: 50%;
}

.label {
  font-size: 0.9375rem;
  font-weight: 500;
}

input[type='search'],
input[type='email'] {
  width: 100%;
  padding: 0.75rem 1rem;
  font: inherit;
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  transition: border-color 0.15s, box-shadow 0.15s;
}

input[type='search']:focus,
input[type='email']:focus {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 0 3px var(--color-primary-soft);
}

.point:has(input:focus-visible) {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.point-list {
  max-height: 22rem;
  margin: 0.25rem 0 0;
  padding: 0.375rem;
  overflow-y: auto;
  list-style: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
}

.point {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 0.875rem;
  border-radius: calc(var(--radius) - 3px);
  cursor: pointer;
  transition: background-color 0.15s;
}

.point:hover {
  background: var(--color-bg);
}

.point.selected {
  background: var(--color-primary-soft);
}

.point input {
  flex-shrink: 0;
  margin-top: 0.3rem;
  accent-color: var(--color-primary);
}

.point-name {
  display: block;
  font-weight: 500;
}

.point-district {
  display: block;
  font-size: 0.875rem;
  color: var(--color-muted);
}

.measurement {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1.75rem 1rem;
  text-align: center;
  background: var(--color-primary-soft);
  border-radius: var(--radius);
}

.measurement p {
  margin: 0;
}

.temperature {
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.1;
  color: var(--color-primary);
  font-variant-numeric: tabular-nums;
}

button[type='submit'] + .hint {
  margin-top: -1.25rem;
}

@media (max-width: 40rem) {
  .hero {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  /* temperature and place side by side, so the teaser stays compact */
  .teaser {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    column-gap: 1.25rem;
    padding: 1rem 1.25rem;
    text-align: left;
  }

  .teaser-label {
    grid-column: 1 / -1;
  }

  .teaser-temperature {
    font-size: 2.5rem;
  }

  .teaser-link {
    grid-column: 1 / -1;
    justify-self: stretch;
    text-align: center;
  }
}

@media (max-width: 32rem) {
  .hero {
    padding: 1.75rem 1.25rem 3rem;
  }

  .hero-text {
    margin-bottom: 1.25rem;
    font-size: 1rem;
  }

  .form-heading {
    margin-top: 2.25rem;
    font-size: 1.25rem;
  }

  /* shorter list, so the e-mail field is not far away on small screens */
  .point-list {
    max-height: 16rem;
  }

  button[type='submit'] {
    align-self: stretch;
  }
}
</style>
