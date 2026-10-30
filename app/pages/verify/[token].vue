<script setup lang="ts">
useHead({
  title: 'Abo bestätigen – DipCheck',
  meta: [{ name: 'robots', content: 'noindex' }]
})

const apiBase = useRuntimeConfig().public.apiBase
const token = useRoute().params.token as string

// No request on page load: mail scanners open links automatically (some even run JavaScript)
// and would confirm subscriptions nobody asked for – same as on the unsubscribe page
const state = ref<'idle' | 'sending' | 'success' | 'invalid' | 'error'>('idle')
const errorText = ref('')

async function verify() {
  state.value = 'sending'
  try {
    await $fetch(`/subscriptions/${encodeURIComponent(token)}/verify`, { baseURL: apiBase, method: 'POST' })
    state.value = 'success'
  } catch (error) {
    const status = statusCodeOf(error)
    // 404: unknown or already used token, 400: not a valid UUID
    if (status === 404 || status === 400) {
      state.value = 'invalid'
      return
    }
    errorText.value = errorMessage(error)
    state.value = 'error'
  }
}
</script>

<template>
  <section class="card status" aria-live="polite">
    <template v-if="state === 'success'">
      <h1>Geschafft!</h1>
      <p>
        Dein Abo ist bestätigt. Ab morgen früh bekommst du die tagesaktuelle Wassertemperatur
        deiner Messstelle per E-Mail.
      </p>
      <NuxtLink to="/">Weitere Messstelle abonnieren</NuxtLink>
    </template>

    <template v-else-if="state === 'invalid'">
      <h1>Link ungültig</h1>
      <p>
        Dieser Bestätigungslink ist ungültig oder abgelaufen. Hast du dein Abo schon bestätigt,
        ist alles in Ordnung und du musst nichts weiter tun.
      </p>
      <p class="hint">
        Nicht bestätigte Anmeldungen werden nach 24 Stunden gelöscht. Du kannst dich einfach
        noch einmal anmelden.
      </p>
      <NuxtLink to="/">Zur Startseite</NuxtLink>
    </template>

    <template v-else>
      <h1>Abo bestätigen</h1>
      <p>
        Nur noch ein Klick: Bestätige dein Abo, dann bekommst du ab morgen früh jeden Tag
        die Wassertemperatur deiner Messstelle per E-Mail.
      </p>
      <p v-if="state === 'error'" class="message error" role="alert">{{ errorText }}</p>
      <button type="button" :disabled="state === 'sending'" @click="verify">
        {{ state === 'sending' ? 'Wird bestätigt …' : 'Abo bestätigen' }}
      </button>
      <p class="hint">
        Du hast dich nicht angemeldet? Dann ignoriere diese Seite einfach. Ohne Bestätigung
        wird die Anmeldung nach 24 Stunden gelöscht.
      </p>
    </template>
  </section>
</template>

<style scoped>
.status {
  gap: 1rem;
  margin-top: 1rem;
}

.status h1 {
  margin: 0;
  font-size: 1.75rem;
}
</style>
