<script setup lang="ts">
useHead({
  title: 'Abo beenden – DipCheck',
  meta: [{ name: 'robots', content: 'noindex' }]
})

const apiBase = useRuntimeConfig().public.apiBase
const token = useRoute().params.token as string

// No request on page load: mail scanners open links automatically and would cancel the subscription
const state = ref<'idle' | 'sending' | 'success' | 'invalid' | 'error'>('idle')
const errorText = ref('')

async function unsubscribe() {
  state.value = 'sending'
  try {
    await $fetch(`/subscriptions/${encodeURIComponent(token)}`, { baseURL: apiBase, method: 'DELETE' })
    state.value = 'success'
  } catch (error) {
    const status = statusCodeOf(error)
    // 404: unknown token or subscription already deleted, 400: not a valid UUID
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
      <h1>Du bist abgemeldet</h1>
      <p>Du bekommst für diese Messstelle keine E-Mails mehr. Deine Daten dazu haben wir gelöscht.</p>
      <NuxtLink to="/">Zur Startseite</NuxtLink>
    </template>

    <template v-else-if="state === 'invalid'">
      <h1>Link ungültig</h1>
      <p>
        Zu diesem Link gibt es kein Abo. Wahrscheinlich hast du dich schon abgemeldet,
        dann musst du nichts weiter tun.
      </p>
      <p class="hint">
        Bekommst du trotzdem noch E-Mails? Dann melde dich über die Kontaktdaten im
        <NuxtLink to="/impressum">Impressum</NuxtLink>.
      </p>
    </template>

    <template v-else>
      <h1>Abo beenden?</h1>
      <p>
        Wenn du auf „Abmelden“ klickst, bekommst du für diese Messstelle keine tägliche
        Wassertemperatur mehr. Abos für andere Messstellen bleiben bestehen.
      </p>
      <p v-if="state === 'error'" class="message error" role="alert">{{ errorText }}</p>
      <button type="button" :disabled="state === 'sending'" @click="unsubscribe">
        {{ state === 'sending' ? 'Wird abgemeldet …' : 'Abmelden' }}
      </button>
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
