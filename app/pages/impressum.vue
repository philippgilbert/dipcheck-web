<script setup lang="ts">
useHead({ title: 'Impressum – DipCheck' })
</script>

<template>
  <article class="prose">
    <h1>Impressum</h1>

    <h2>Angaben gemäß § 5 DDG</h2>
    <p>
      {{ operator.name }}<br>
      {{ operator.street }}<br>
      {{ operator.city }}
    </p>

    <h2>Kontakt</h2>
    <p>E-Mail: <a :href="`mailto:${operator.email}`">{{ operator.email }}</a></p>

    <h2>Datenquelle</h2>
    <p>
      Die angezeigten Wassertemperaturen stammen vom Bayerischen Landesamt für Umwelt,
      <a href="https://www.gkd.bayern.de" rel="noopener">Gewässerkundlicher Dienst Bayern</a>.
      Es handelt sich um ungeprüfte Rohdaten. Für ihre Richtigkeit, Vollständigkeit und Aktualität
      wird keine Gewähr übernommen.
    </p>

    <h2>Hinweis</h2>
    <p>
      DipCheck ist ein privates, nicht kommerzielles Projekt. Die Angaben ersetzen keine
      Beurteilung vor Ort: Ob und wo Baden sicher ist, hängt nicht nur von der Wassertemperatur ab.
    </p>
  </article>
</template>
