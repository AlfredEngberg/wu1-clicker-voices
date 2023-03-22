/* Med document.queryselector(selector) kan vi hämta
 * de element som vi behöver från html dokumentet.
 * Vi spearar elementen i const variabler då vi inte kommer att
 * ändra dess värden.
 * Läs mer:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const
 * https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
 * Viktigt: queryselector ger oss ett html element eller flera om det finns.
 */
const clickerButton = document.querySelector('#game-button');
const moneyTracker = document.querySelector('#money');
const mpsTracker = document.querySelector('#mps'); // money per second
const mpcTracker = document.querySelector('#mpc'); // money per click
const upgradesTracker = document.querySelector('#upgrades');
const upgradeList = document.querySelector('#upgradelist');
const msgbox = document.querySelector('#msgbox');
const audioAchievement = document.querySelector('#swoosh');

const voice1 = document.querySelector("#with_you");
const voice2 = document.querySelector("#back_alive");
const voice3 = document.querySelector("#your_escape");
const voice4 = document.querySelector("#astral_plane");
const voice5 = document.querySelector("#eerie_whisper");
const voice6 = document.querySelector("#crying");
const voice7 = document.querySelector("#four_whispers");
const voice8 = document.querySelector("#help_us");
const voice9 = document.querySelector("#man_noices");
const voice10 = document.querySelector("#no_time");
const voice11 = document.querySelector("#theyre_here");
const voice12 = document.querySelector("#where_are_you");
const voice13 = document.querySelector("#wake_up");
const voice14 = document.querySelector("#voices_crying");
const voice15 = document.querySelector("#whispers");
const voice16 = document.querySelector("#fatRat");
const voice17 = document.querySelector("#dj_outlaw");


/* Följande variabler använder vi för att hålla reda på hur mycket pengar som
 * spelaren, har och tjänar.
 * last används för att hålla koll på tiden.
 * För dessa variabler kan vi inte använda const, eftersom vi tilldelar dem nya
 * värden, utan då använder vi let.
 * Läs mer: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let
 */
let achievement = 0;
let money = 0;
let moneyPerClick = 1;
let moneyPerSecond = 0;
let acquiredUpgrades = 0;
let last = 0;
let numberOfClicks = 0; // hur många gånger har spelare eg. klickat
let active = false; // exempel för att visa att du kan lägga till klass för att indikera att spelare får valuta

// likt upgrades skapas här en array med objekt som innehåller olika former
// av achievements.
// requiredSOMETHING är vad som krävs för att få dem


// antal achivments = 4 av 16
let achievements = [
    {
        description: 'Dom kallar på mig...',
        requiredUpgrades: 1,
        acquired: false,
    },
    {
        description: 'Dom vill ta över...',
        requiredUpgrades: 10,
        acquired: false,
    },
    {
        description: 'Jag hör dom...',
        requiredClicks: 10,
        acquired: false,
    },
    {
        description: 'Jag följer rösterna...',
        requiredClicks: 100,
        acquired: false,
    },
    {
        description: 'Rösterna... dom tar över',
        requiredUpgrades: 5,
        acquired: false,
    },
    {
        description: 'Det var rösterna som sa år mig...',
        requiredUpgrades: 15,
        acquired: false,
    },
];

/* Med ett valt element, som knappen i detta fall så kan vi skapa listeners
 * med addEventListener så kan vi lyssna på ett specifikt event på ett html-element
 * som ett klick.
 * Detta kommer att driva klickerknappen i spelet.
 * Efter 'click' som är händelsen vi lyssnar på så anges en callback som kommer
 * att köras vi varje klick. I det här fallet så använder vi en anonym funktion.
 * Koden som körs innuti funktionen är att vi lägger till moneyPerClick till
 * money.
 * Läs mer: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
 */
clickerButton.addEventListener(
    'click',
    () => {
        // vid click öka score med moneyPerClick
        money += moneyPerClick;
        // håll koll på hur många gånger spelaren klickat
        numberOfClicks += 1;
        // console.log(clicker.score);
    },
    false
);

/* För att driva klicker spelet så kommer vi att använda oss av en metod som heter
 * requestAnimationFrame.
 * requestAnimationFrame försöker uppdatera efter den refresh rate som användarens
 * maskin har, vanligtvis 60 gånger i sekunden.
 * Läs mer: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
 * funktionen step används som en callback i requestanaimationframe och det är
 * denna metod som uppdaterar webbsidans text och pengarna.
 * Sist i funktionen så kallar den på sig själv igen för att fortsätta uppdatera.
 */
function step(timestamp) {
    moneyTracker.textContent = Math.round(money);
    mpsTracker.textContent = moneyPerSecond;
    mpcTracker.textContent = moneyPerClick;
    upgradesTracker.textContent = acquiredUpgrades;

    if (timestamp >= last + 1000) {
        money += moneyPerSecond;
        last = timestamp;
    }

    if (moneyPerSecond > 0 && !active) {
        mpsTracker.classList.add('active');
        active = true;
    }

    // achievements, utgår från arrayen achievements med objekt
    // koden nedan muterar (ändrar) arrayen och tar bort achievements
    // som spelaren klarat
    // villkoren i första ifsatsen ser till att achivments som är klarade
    // tas bort. Efter det så kontrolleras om spelaren har uppfyllt kriterierna
    // för att få den achievement som berörs.
    achievements = achievements.filter((achievement) => {
        if (achievement.acquired) {
            return false;
        }
        if (
            achievement.requiredUpgrades &&
            acquiredUpgrades >= achievement.requiredUpgrades
        ) {
            achievement.acquired = true;
            message(achievement.description, 'achievement');
            return false;
        } else if (
            achievement.requiredClicks &&
            numberOfClicks >= achievement.requiredClicks
        ) {
            achievement.acquired = true;
            message(achievement.description, 'achievement');
            return false;
        }
        return true;
    });

    window.requestAnimationFrame(step);
}

/* Här använder vi en listener igen. Den här gången så lyssnar iv efter window
 * objeket och när det har laddat färdigt webbsidan(omvandlat html till dom)
 * När detta har skett så skapar vi listan med upgrades, för detta använder vi
 * en forEach loop. För varje element i arrayen upgrades så körs metoden upgradeList
 * för att skapa korten. upgradeList returnerar ett kort som vi fäster på webbsidan
 * med appendChild.
 * Läs mer:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
 * https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild
 * Efter det så kallas requestAnimationFrame och spelet är igång.
 */
window.addEventListener('load', (event) => {
    upgrades.forEach((upgrade) => {
        upgradeList.appendChild(createCard(upgrade));
    });
    window.requestAnimationFrame(step);
});

/* En array med upgrades. Varje upgrade är ett objekt med egenskaperna name, cost
 * och amount. Önskar du ytterligare text eller en bild så går det utmärkt att
 * lägga till detta.
 * Läs mer:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer
 */
upgrades = [
    {
        name: 'Depression',
        cost: 10,
        amount: 1,
    },
    {
        name: 'Alkoholmissbruk',
        cost: 50,
        clicks: 2,
    },
    {
        name: 'Drogmissbruk',
        cost: 2,
        clicks: 5,
    },
    {
        name: 'Schizofreni',
        cost: 1000,
        amount: 100,
    },
];

/* createCard är en funktion som tar ett upgrade objekt som parameter och skapar
 * ett html kort för det.
 * För att skapa nya html element så används document.createElement(), elementen
 * sparas i en variabel så att vi kan manipulera dem ytterligare.
 * Vi kan lägga till klasser med classList.add() och text till elementet med
 * textcontent = 'värde'.
 * Sedan skapas en listener för kortet och i den hittar vi logiken för att köpa
 * en uppgradering.
 * Funktionen innehåller en del strängar och konkatenering av dessa, det kan göras
 * med +, variabel + 'text'
 * Sist så fäster vi kortets innehåll i kortet och returnerar elementet.
 * Läs mer:
 * https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
 * https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
 * https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
 */
function createCard(upgrade) {
    const card = document.createElement('div');
    card.classList.add('card');
    const header = document.createElement('p');
    header.classList.add('title');
    const cost = document.createElement('p');
    if (upgrade.amount) {
        header.textContent = `${upgrade.name}, +${upgrade.amount} per sekund.`;
    } else {
        header.textContent = `${upgrade.name}, +${upgrade.clicks} per klick.`;
    }
    cost.textContent = `Köp för ${upgrade.cost} röster.`;

    card.addEventListener('click', (e) => {
        if (money >= upgrade.cost) {
            acquiredUpgrades++;
            money -= upgrade.cost;
            upgrade.cost *= 1.5;
            cost.textContent = 'Köp för ' + upgrade.cost + ' röster';
            moneyPerSecond += upgrade.amount ? upgrade.amount : 0;
            moneyPerClick += upgrade.clicks ? upgrade.clicks : 0;
            message('Du hör dom, dom kallar på dig', 'success');
        } else {
            message('Du måste lyssna på rösterna mer', 'warning');
        }
    });

    card.appendChild(header);
    card.appendChild(cost);
    return card;
} 

/* Message visar hur vi kan skapa ett html element och ta bort det.
 * appendChild används för att lägga till och removeChild för att ta bort.
 * Detta görs med en timer.
 * Läs mer:
 * https://developer.mozilla.org/en-US/docs/Web/API/Node/removeChild
 * https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout
 */
function message(text, type) {
    const p = document.createElement('p');
    p.classList.add(type);
    p.textContent = text;
    msgbox.appendChild(p);
    if (type === 'achievement') {
        audioAchievement.play();
        achievement++
    }
    if (achievement === 1) {
        voice1.play();
    }  else if (achievement === 2) {
        voice2.play();
    } else if (achievement === 3) {
        voice3.play();
    } else if (achievement === 4) {
        voice4.play();
    } else if (achievement === 5) {
        voice5.play();
    } else if (achievement === 6) {
        voice6.play();
    } else if (achievement === 7) {
        voice7.play();
    } else if (achievement === 8) {
        voice8.play();
    } else if (achievement === 9) {
        voice9.play();
    } else if (achievement === 10) {
        voice10.play();
    } else if (achievement === 11) {
        voice11.play();
    } else if (achievement === 12) {
        voice12.play();
    } else if (achievement === 13) {
        voice13.play();
    } else if (achievement === 14) {
        voice14.play();
    } else if (achievement === 15) {
        voice15.play();
    } else if (achievement === 16) {
        voice16.play();
    }
    setTimeout(() => {
        p.parentNode.removeChild(p);
    }, 2000);
}
