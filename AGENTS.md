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
MERK: Mari K og Mari KK er to ulike personer!
MERK: Tomme tall (uten person) 252-262, 275, 280.
