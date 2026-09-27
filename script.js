// Lager variabler basert på DOM
const minEl = document.querySelector('#min')
const maxEl = document.querySelector('#max')
const topEl = document.querySelector('#top')
const btnEl = document.querySelector("#btn")
const HaraldEl = document.querySelector('.Harald')

// Lager et array med heltall fra og med low til og med high
function nArray(low, high){
    let i = low;
    arr = [i]
    while (i < high){
        i++;
        arr.push(i)
    }

    return arr
}

// Ansatt klasse
class Ansatt{
    constructor(name, low, high, hasImage=false){
        this.name = name
        this.numbers = nArray(low, high)
        this.hasImage = hasImage
    }
}


// Lager objekter av de ansatte, og legger i et array 
let ansatte = []

// Velger hvilket bilde av Harald som skal brukes basert på vindusbredde
window.addEventListener('resize', setHarald);
window.addEventListener('load', setHarald);

function setHarald(){
    if (window.innerWidth <= 650) {
        /* Bildet er hentet fra Viken fylkeskommune */
        HaraldEl.src = "./bilder/Harald.jpg"
    }
    else {
        /* Bilde er hentet fra: https://www.budstikka.no/debatt/la-biblioteket-leve/25958!/ */
        HaraldEl.src = "./bilder/Harald_bibliotek.jpg"
    }
}



topNumberEl = document.querySelector('#topNumber')

// Lyd
let audio = new Audio('drumroll_tada.mp3');
audio.load()

// Lager et tilfeldig heltall fra og med min til og med max
function tilfeldigTall(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min
}

// Tester funksjonen som trekker tilfeldige tall
function testTilfeldig(){
    let min = Number(minEl.value)
    let max = Number(maxEl.value)

    let l = max-min+1

    tallArr = new Array(l).fill(0)

    let n = 10000000

    for(let i=0; i<n; i++){
        tall = tilfeldigTall(min, max)
        tallArr[tall-1] += 1
    }

    for(let i=0; i<l; i++){
        console.log(`${i+1}: ${tallArr[i]*100/n} %`)
    }

    //console.log(tallArr)

}

// Bør gi lik sannsynlighet for alle tall
//testTilfeldig()



// Trekker ansatt
function tilfeldigTrekk(){
    audio.load()
    let min = Number(minEl.value)
    let max = Number(maxEl.value)

    btnEl.classList.toggle("trukket")
    
    if (btnEl.classList.contains("trukket")) {
        audio.play();
        let tilfeldig = tilfeldigTall(min, max)
        let navn = "";
        let harBilde = false;
        ansatte.forEach(ansatt => {
            if(ansatt.numbers.includes(tilfeldig)){
                navn = ansatt.name
                harBilde = ansatt.hasImage
            }
        })
        
        HaraldEl.classList.toggle("zoom")
        HaraldEl.style.height = '0';
        
        topNumberEl.innerHTML = `<p>${tilfeldig}</p>`

        if (navn != ""){
            topNumberEl.innerHTML += `<p id="navn">(${navn})</p>`

            if(harBilde){
                topNumberEl.innerHTML += `<img src="./bilder/ansatte/${navn}.jpg" alt="${navn}">`
            }

            topNumberEl.style.fontSize = "80px"            
        }
        else {
            topNumberEl.style.fontSize = "120px" 
            topNumberEl.innerHTML += `<p class="smallerText">(sjekk lista)</p>`
        }

        btnEl.innerText = "Igjen?"
    } else {
        btnEl.innerText = "Trekk!"
        
        HaraldEl.classList.toggle("zoom")
        HaraldEl.style.height = '95%'
        topNumberEl.innerText = "0"
    }
    
}