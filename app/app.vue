<template>
  <div class="page">
    <NuxtRouteAnnouncer />
    <header class="site-header">
      <NuxtLink to="/" class="logo">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2.5c-.3 0-.6.1-.8.4C9.6 5 5 11 5 14.8 5 18.8 8.1 22 12 22s7-3.2 7-7.2C19 11 14.4 5 12.8 2.9c-.2-.3-.5-.4-.8-.4Z" />
        </svg>
        DipCheck
      </NuxtLink>
    </header>
    <main>
      <NuxtPage />
    </main>
    <footer class="site-footer">
      <!-- GKD data is licensed under CC BY 4.0, attribution wording as required on gkd.bayern.de/de/impressum -->
      <p>
        Datenquelle: Bayerisches Landesamt für Umwelt,
        <a href="https://www.lfu.bayern.de" rel="noopener">www.lfu.bayern.de</a>
        (<a href="https://www.gkd.bayern.de" rel="noopener">Gewässerkundlicher Dienst Bayern</a>),
        Lizenz: <a href="https://creativecommons.org/licenses/by/4.0/deed.de" rel="noopener license">CC BY 4.0</a>.
        Angaben ohne Gewähr.
      </p>
      <nav>
        <NuxtLink to="/impressum">Impressum</NuxtLink>
        <NuxtLink to="/datenschutz">Datenschutz</NuxtLink>
      </nav>
    </footer>
  </div>
</template>
