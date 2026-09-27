import { ansattedata } from "./ansatte.js"

const minEl = document.querySelector("#min")
const maxEl = document.querySelector("#max")
const btnEl = document.querySelector("#btn")
const HaraldEl = document.querySelector(".Harald")
const topNumberEl = document.querySelector("#topNumber")
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

    const tilfeldig = tilfeldigTall(min, max)
    let navn = ""
    let harBilde = false

    ansatte.forEach((ansatt) => {
      if (ansatt.numbers.includes(tilfeldig)) {
        navn = ansatt.name
        harBilde = ansatt.hasImage
      }
    })

    HaraldEl.classList.remove("is-falling")
    void HaraldEl.offsetWidth
    HaraldEl.classList.add("is-falling")
    HaraldEl.style.height = "0"
    topNumberEl.classList.remove("result-visible")
    topNumberEl.innerText = ""
    topNumberEl.style.fontSize = "120px"

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
    }, 3750)

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
