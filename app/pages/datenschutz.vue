<script setup lang="ts">
useHead({ title: 'Datenschutz – DipCheck' })
</script>

<template>
  <article class="prose">
    <h1>Datenschutzerklärung</h1>

    <h2>1. Verantwortlicher</h2>
    <p>
      {{ operator.name }}<br>
      {{ operator.street }}<br>
      {{ operator.city }}<br>
      E-Mail: <a :href="`mailto:${operator.email}`">{{ operator.email }}</a>
    </p>

    <h2>2. Das Wichtigste in Kürze</h2>
    <ul>
      <li>Diese Website setzt keine Cookies und verwendet kein Tracking und keine Analyse-Tools.</li>
      <li>Es werden keine Inhalte von Drittanbietern (z. B. Schriftarten, Karten, Videos) eingebunden.</li>
      <li>
        Personenbezogene Daten verarbeiten wir nur, wenn du die tägliche Wassertemperatur per E-Mail
        abonnierst: deine E-Mail-Adresse und die gewählte Messstelle.
      </li>
    </ul>

    <h2>3. Hosting und Aufruf der Website</h2>
    <p>
      Website und Server-Anwendung laufen auf einem Server bei {{ operator.hoster }}.
      Mit dem Anbieter besteht ein Vertrag zur Auftragsverarbeitung nach Art. 28 DSGVO.
      Beim Aufruf der Website und beim Abruf der Messdaten verarbeitet der Server technisch
      notwendig deine IP-Adresse, um die Inhalte an deinen Browser auszuliefern.
      Zugriffsprotokolle mit IP-Adressen werden dabei nicht dauerhaft gespeichert.
    </p>
    <p>
      Zum Schutz vor Missbrauch (z. B. massenhaften Anmeldungen) begrenzen wir die Anzahl der
      Anfragen pro IP-Adresse. Dafür wird die IP-Adresse zusammen mit einem Anfragezähler im
      Arbeitsspeicher gehalten und spätestens eine Stunde nach der letzten Anfrage gelöscht.
      Sie wird nicht auf Datenträgern gespeichert.
    </p>
    <p>
      Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt im
      sicheren und stabilen Betrieb der Website.
    </p>

    <h2>4. E-Mail-Abo der Wassertemperatur</h2>
    <p>
      Wenn du eine Messstelle abonnierst, speichern wir deine E-Mail-Adresse, die gewählte Messstelle,
      den Zeitpunkt der Anmeldung und den Zeitpunkt der Bestätigung. Die Angabe der E-Mail-Adresse
      ist für den Versand erforderlich, weitere Angaben erheben wir nicht.
    </p>
    <p>
      <strong>Double-Opt-in:</strong> Nach der Anmeldung bekommst du eine E-Mail mit einem
      Bestätigungslink. Erst nach der Bestätigung schicken wir dir die täglichen Messwerte.
      So stellen wir sicher, dass niemand eine fremde Adresse eintragen kann. Die gespeicherten
      Zeitpunkte dienen als Nachweis deiner Einwilligung. Nicht bestätigte Anmeldungen werden
      nach 24 Stunden beim nächsten nächtlichen Aufräumlauf automatisch gelöscht.
    </p>
    <p>
      <strong>Rechtsgrundlage</strong> ist deine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO).
      Du kannst sie jederzeit mit Wirkung für die Zukunft widerrufen. Nutze dafür den Abmeldelink
      in jeder E-Mail oder schreib uns eine E-Mail. Nach der Abmeldung löschen wir dein Abo
      sofort.
    </p>

    <h2>5. E-Mail-Versand über Brevo</h2>
    <p>
      Für den Versand der E-Mails nutzen wir den Dienst Brevo der Sendinblue GmbH,
      Köpenicker Straße 126, 10179 Berlin. Brevo verarbeitet deine E-Mail-Adresse und den Inhalt
      der E-Mails in unserem Auftrag. Mit Brevo besteht ein Vertrag zur Auftragsverarbeitung
      nach Art. 28 DSGVO.
      Brevo erfasst, ob E-Mails geöffnet und Links angeklickt werden. Dafür enthalten die E-Mails
      ein unsichtbares Zählpixel, und Links werden über einen Server von Brevo weitergeleitet.
      Wir haben die Anonymisierung dieser Daten aktiviert: Öffnungen und Klicks werden keiner
      E-Mail-Adresse zugeordnet, wir sehen nur Gesamtzahlen.
      Versandprotokolle (Empfängeradresse, Zeitpunkt, Zustellstatus) und eine Vorschau der E-Mails
      speichert Brevo einen Monat lang, um Zustellprobleme nachvollziehen zu können. Danach werden
      sie automatisch gelöscht.
    </p>
    <p>
      Brevo fügt jeder E-Mail zusätzlich einen eigenen Abmeldelink hinzu. Wenn du dich über diesen
      Link abmeldest, löschen wir dein Abo bei uns ebenfalls. Brevo setzt deine Adresse außerdem auf
      eine Sperrliste, damit du keine weiteren E-Mails von uns bekommst. Möchtest du später wieder
      ein Abo abschließen, schreib uns bitte eine E-Mail. Dann heben wir die Sperre auf.
    </p>
    <p>
      Weitere Informationen findest du in der
      <a href="https://www.brevo.com/de/legal/privacypolicy/" rel="noopener">Datenschutzerklärung von Brevo</a>.
    </p>

    <h2>6. Kontakt per E-Mail</h2>
    <p>
      Wenn du uns eine E-Mail schreibst, verarbeiten wir deine Adresse und deine Nachricht, um dein
      Anliegen zu bearbeiten (Art. 6 Abs. 1 lit. f DSGVO). Die E-Mail löschen wir, sobald das
      Anliegen erledigt ist und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
    </p>

    <h2>7. Deine Rechte</h2>
    <p>Du hast das Recht auf</p>
    <ul>
      <li>Auskunft über die zu deiner Person gespeicherten Daten (Art. 15 DSGVO),</li>
      <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO),</li>
      <li>Löschung (Art. 17 DSGVO) und Einschränkung der Verarbeitung (Art. 18 DSGVO),</li>
      <li>Datenübertragbarkeit (Art. 20 DSGVO),</li>
      <li>
        Widerspruch gegen Verarbeitungen, die auf Art. 6 Abs. 1 lit. f DSGVO beruhen (Art. 21 DSGVO),
      </li>
      <li>Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO).</li>
    </ul>
    <p>
      Wende dich dafür einfach per E-Mail an uns. Außerdem kannst du dich bei einer
      Datenschutz-Aufsichtsbehörde beschweren (Art. 77 DSGVO), zum Beispiel beim Bayerischen
      Landesamt für Datenschutzaufsicht, Promenade 18, 91522 Ansbach.
    </p>

    <h2>8. Datenquelle</h2>
    <p>
      Die Messwerte stammen vom Gewässerkundlichen Dienst Bayern. Beim Abruf dieser Daten werden
      keine Daten über dich an den Gewässerkundlichen Dienst übermittelt: Unser Server lädt die
      Messwerte selbst herunter.
    </p>

    <p class="updated">Stand: Oktober 2026</p>
  </article>
</template>
