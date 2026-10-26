# AGENTS.md

## Prosjekt

Haralds vintrekking — en enkel nettside som trekker et tilfeldig tal (vinflaske) mellom en minimums- og maksimumsverdi.

## Retningslinjer

- Dette er et enkelt hobbyprosjekt. Ikke trenger fancy sikkerhet, autentisering, databaser eller lignende.
- Siden skal kun brukes på PC / stor skjerm. Ikke fokuser på mobil eller responsivt design.
- Det skal ikke være noen funksjonalitet for historikk / tidligere trekninger.

## Ansatte-data

Logikken i nummer-trekkingen er litt rar: Vi skal bare trekke et tilfeldig tall mellom min og maks
som brukeren angir i web-appen. Så sjekker vi ansattedata.js om dette samsvarerer med en person
eller ikke. Vi viser uansett vinnertallet, og viser navn og eventuelt bilde av personen om det finnes.
Dersom vi "traff et hull" i ansattedata.js så viser vi bare vinnertallet uten noe mer.
Så er det opp til brukeren av web-appen om det skal trekkes igjen, eller om det kanskje er
kommet nye spillere på listen (som er en fysisk liste) som har vunnet, som ikke web-appen
vet om enda.
Ansattedata finnes i to versjoner: En txt fil som er "fasiten" vi har fått
fra Harald (som arrangerer vin-trekningen), og en js versjon som er den vi bruker
i web-appen. Disse to filene skal matche 100%.
MERK: Mari K og Mari KK er to ulike personer!
MERK: Tomme tall (uten person) 252-262, 275, 280.

## Én vinner per person per dag

Samme person skal ikke kunne vinne to ganger samme dag. Siden er ren statisk
HTML/JS på GitHub Pages og kan ikke skrive til en fil på disk, så «den lokale
fila» er implementert med `localStorage` i `script.js`:

- Nøkkel: `haraldsvin.vinnere`. Format: `{ dato: "YYYY-MM-DD", vinnere: [navn, ...] }`.
- Ved trekning: hvis lagret dato er dagens dato beholdes lista, og det trekkes
  på nytt dersom tallet tilhører en person som allerede har vunnet i dag.
  Tall uten person («hull») er alltid greie og blokkeres ikke.
- Hvis lagret dato er en annen dag: lista nullstilles og dagens dato + vinner skrives.
- Lagring er per nettleser/maskin. Byttes nettleser, eller dataene ryddes, starter lista på nytt.

## Server / publisering

- Siden er ren statisk HTML/CSS/JS og hostes på **GitHub Pages** (gratis). Repoet er public.
- **Deploy:** automatisk fra `main` (repo-rot) ved hver push. Bygg tar ~1 minutt.
- **Live-URL:** https://haraldsvin.no (fallback: https://rasmusgraver.github.io/HaraldsVin/).
- **Custom domain** settes via `CNAME`-fil i repo-rot med innhold `haraldsvin.no`.
- **DNS** (hos registrar, f.eks. Domeneshop): A-records for `haraldsvin.no` →
  185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153 (GitHubs Pages-IP-er).
  `www` kan pekes med CNAME → `rasmusgraver.github.io`.
- **HTTPS:** GitHub Pages utsteder automatisk sertifikat (Let's Encrypt) for custom domain.
  `https_enforced` er på.
