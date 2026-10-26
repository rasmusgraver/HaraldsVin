import { ansattedata } from "./ansattedata.js"

const minEl = document.querySelector("#min")
const maxEl = document.querySelector("#max")
const btnEl = document.querySelector("#btn")
const HaraldEl = document.querySelector(".Harald")
const topNumberEl = document.querySelector("#topNumber")
const reduserBevegelse = window.matchMedia("(prefers-reduced-motion: reduce)")
let resultTimeoutId = null

function nArray(low, high) {
  const numbers = []

  for (let i = low; i <= high; i++) {
    numbers.push(i)
  }

  return numbers
}

class Ansatt {
  constructor(name, low, high, hasImage = false) {
    this.name = name
    this.numbers = nArray(low, high)
    this.hasImage = hasImage
  }
}

const ansatte = ansattedata.map(
  (ans) => new Ansatt(ans.name, ans.start, ans.end, ans.hasImage),
)

function getRange() {
  const min = Number(minEl.value)
  const max = Number(maxEl.value)

  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return { min: 0, max: 0, valid: false }
  }

  if (min > max) {
    return { min: 0, max: 0, valid: false }
  }

  const safeMin = Math.max(0, min)
  const safeMax = Math.max(0, max)

  return { min: safeMin, max: safeMax, valid: true }
}

function setHarald() {
  if (window.innerWidth <= 650) {
    /* Bildet er hentet fra Viken fylkeskommune */
    HaraldEl.src = "./bilder/Harald.jpg"
  } else {
    /* Bilde er hentet fra: https://www.budstikka.no/debatt/la-biblioteket-leve/25958!/ */
    HaraldEl.src = "./bilder/Harald_bibliotek.jpg"
  }
}

window.addEventListener("resize", setHarald)
window.addEventListener("load", setHarald)

const audio = new Audio("drumroll_tada.mp3")
audio.load()

function tilfeldigTall(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function finnPerson(tall) {
  for (const ansatt of ansatte) {
    if (ansatt.numbers.includes(tall)) {
      return ansatt
    }
  }

  return null
}

/*
Vinnere per dag. Siden er ren statisk HTML/JS på GitHub Pages, kan vi ikke
skrive til en fil på disk. Vi bruker derfor localStorage, som er nettleserens
«lokale fil»: den holder seg til og med neste dag, på samme maskin/nettleser.
Format: { dato: "YYYY-MM-DD", vinnere: [navn, ...] }
*/
const STORAGE_KEY = "haraldsvin.vinnere"

function dagensDato() {
  const d = new Date()
  const mnd = String(d.getMonth() + 1).padStart(2, "0")
  const dag = String(d.getDate()).padStart(2, "0")

  return `${d.getFullYear()}-${mnd}-${dag}`
}

function lesVinnere() {
  const dato = dagensDato()

  try {
    const lagret = JSON.parse(localStorage.getItem(STORAGE_KEY))

    if (lagret && lagret.dato === dato && Array.isArray(lagret.vinnere)) {
      return { dato, vinnere: lagret.vinnere }
    }
  } catch {
    /* korrupt eller utilgjengelig lagring -> start på nytt */
  }

  return { dato, vinnere: [] }
}

function lagreVinnere(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    /* lagring utilgjengelig (f.eks. privat modus) -> trekningen virker likevel */
  }
}

/*
Trekker et tall, og trekker på nytt dersom tallet tilhører en person som
allerede har vunnet i dag. Tall uten person («hull») er alltid greie.
*/
function trekkVinner(min, max, vinnere) {
  const maksForsok = 500
  let tall = tilfeldigTall(min, max)
  let person = finnPerson(tall)
  let forsok = 0

  while (person && vinnere.includes(person.name) && forsok < maksForsok) {
    tall = tilfeldigTall(min, max)
    person = finnPerson(tall)
    forsok++
  }

  return { tall, person }
}

function tilfeldigTrekk() {
  const { min, max, valid } = getRange()

  if (!valid) {
    return
  }

  btnEl.classList.toggle("trukket")

  if (btnEl.classList.contains("trukket")) {
    if (resultTimeoutId) {
      clearTimeout(resultTimeoutId)
    }

    audio.load()
    audio.play()

    const vinnerData = lesVinnere()
    const { tall: tilfeldig, person } = trekkVinner(min, max, vinnerData.vinnere)
    let navn = ""
    let harBilde = false

    if (person) {
      navn = person.name
      harBilde = person.hasImage

      if (!vinnerData.vinnere.includes(navn)) {
        vinnerData.vinnere.push(navn)
        lagreVinnere(vinnerData)
      }
    }

    HaraldEl.classList.remove("is-falling")
    void HaraldEl.offsetWidth
    HaraldEl.classList.add("is-falling")
    HaraldEl.style.height = "0"
    topNumberEl.classList.remove("result-visible")
    topNumberEl.innerText = ""
    topNumberEl.style.fontSize = "120px"

    /* Ved «reduser bevegelse» er animasjonen borte, så vi viser resultatet med en gang */
    const visningsForsinkelse = reduserBevegelse.matches ? 200 : 3750

    resultTimeoutId = window.setTimeout(() => {
      topNumberEl.innerHTML = `<p>${tilfeldig}</p>`

      if (navn !== "") {
        topNumberEl.innerHTML += `<p id="navn">(${navn})</p>`

        if (harBilde) {
          topNumberEl.innerHTML += `<img src="./bilder/ansatte/${navn}.jpg" alt="${navn}">`
        }

        topNumberEl.style.fontSize = "80px"
      } else {
        topNumberEl.style.fontSize = "120px"
        topNumberEl.innerHTML += `<p class="smallerText">(sjekk lista)</p>`
      }

      topNumberEl.classList.add("result-visible")
    }, visningsForsinkelse)

    btnEl.innerText = "Igjen?"
  } else {
    if (resultTimeoutId) {
      clearTimeout(resultTimeoutId)
      resultTimeoutId = null
    }

    btnEl.innerText = "Trekk!"

    HaraldEl.classList.remove("is-falling")
    HaraldEl.style.height = "92%"
    topNumberEl.classList.remove("result-visible")
    topNumberEl.innerText = ""
    topNumberEl.style.fontSize = "120px"
  }
}

btnEl.addEventListener("click", tilfeldigTrekk)
