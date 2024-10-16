const clickButton = document.getElementById('click-btn');
const progressBar = document.getElementById('progress-bar');
const durabilityBar = document.getElementById('durability-bar');
const clickCountDisplay = document.getElementById('click-count');
const autoClickCountDisplay = document.getElementById('auto-click-count');
const repairButton = document.getElementById('repair-btn');

let autoClickActive = false
let autoClickBroken = false
let autoClickDurability = 10
let autoClickMaxDurability = 10

let clickCount = 0;
let autoClickCount = 0;
let maxClicks = 100;


function updateProgress() {
    let totalClicks = clickCount + autoClickCount;

    //move progress bar
    let progress = (totalClicks / maxClicks) * 100;
    if (progress > 100) progress = 100;
    progressBar.style.width = progress + '%';

    //change progress bar colors
    const red = Math.max(255 - (progress * 2.55), 0);
    const green = Math.min(progress * 2.55, 255);
    progressBar.style.backgroundColor = `rgb(${red}, ${green}, 0)`;

    //reset progress bar after it fills
    if (totalClicks >= maxClicks) {
        setTimeout(() => {
            alert("You have max power!");
            clickCount = 0;
            autoClickCount = 0;
            progressBar.style.width = '0%';
            progressBar.style.backgroundColor = 'rgb(255, 0, 0)';
            clickCountDisplay.textContent = clickCount;
            autoClickCountDisplay.textContent = autoClickCount;
        }, 500);
    }
}

function updateDurability(){
    //move progress bar
    let durability = (autoClickDurability / autoClickMaxDurability) * 100;
    if (durability > 100) durability = 100;
    durabilityBar.style.width = (durability) + '%';

    //change progress bar colors
    const red = Math.min(durability * 2.55, 255);
    const green = Math.max(255 - (durability * 2.55), 0);
    durabilityBar.style.backgroundColor = `rgb(${green}, ${red}, 0)`;

}

//manual click function
clickButton.addEventListener('click', () => {
    if (!autoClickActive){autoClickActive = true;}
    clickCount++;
    clickCountDisplay.textContent = clickCount;
    updateProgress();
});

//autoclick function
setInterval(() => {
    if (!autoClickActive || autoClickBroken){return;} 
    autoClickCount++;
    autoClickCountDisplay.textContent = autoClickCount;
    updateProgress();
    
    if (autoClickDurability <= 0) {
        autoClickBroken = true
        updateDurability()
        //TODO: add a repair button to repair the auto clicker, how its repaired could just be a simple, Press 4 buttons
    }
    else {
        autoClickDurability--;
        updateDurability()
    }
    

}, 1000); //auto click every X000 (every 1000 is 1 sec)


//autoclick function for when the autoclicker is broken
setInterval(() => {
    if (!autoClickActive || !autoClickBroken){return;} 
    autoClickCount++;
    autoClickCountDisplay.textContent = autoClickCount;
    updateProgress();
}, 2000); //auto click every X000 (every 1000 is 1 sec)
