const clickButton = document.getElementById('click-btn');
const progressBar = document.getElementById('progress-bar');
const durabilityBar = document.getElementById('durability1');
const clickCountDisplay = document.getElementById('click-count');
const autoClickCountDisplay = document.getElementById('auto-click-count');
const popupDialog = document.getElementById("popupDialog");
const curLevel = document.getElementById("current-level");

let autoClickActive = false
let autoClickBroken = false
let autoClickDurability = 10
let autoClickMaxDurability = 10

let clickCount = 0;
let autoClickCount = 0;
let maxClicks = 10;


//Database for AutoClickers
//keyvalue pair where the key is the name of the autoclicker and the value includes data about the autoclicker
//TODO: Convert code to work with this data
let AutoClickDATA = {

};


//Levels in the program work with a key:value pair
//keys dignify how far the player has progressed(how many times the progression bar is filled)
//values are what elements are enabled when the player reaches that level and the max power needed for the next level
let levels = {
    1:{
        "elements":".level1",
        "maxVal":100,
    },

    2:{"elements":".level2",
        "maxVal":200,
    }
};
let level = 0;


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

            level++;
            levelUp();

            clickCount = 0;
            autoClickCount = 0;
            progressBar.style.width = '0%';
            progressBar.style.backgroundColor = 'rgb(255, 0, 0)';
            clickCountDisplay.textContent = clickCount;
            autoClickCountDisplay.textContent = autoClickCount;
            //updateProgress();

        }, 500);
    }
}

function levelUp() {
    if (!(levels[level])){return;}
    let nodeList = document.querySelectorAll(levels[level]["elements"]);
    let i;
    for (i = 0; (nodeList.length != 0 && i != nodeList.length); i++){
        nodeList[i].removeAttribute("hidden");

        //Temp code before I add code for making multiple autoclickers active
        if(nodeList[i].classList.contains("Auto1")){
            autoClickActive = true;
        }

    }
    curLevel.textContent = "Level " + level;
    maxClicks = levels[level]["maxVal"]
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

function openPopup() {
    popupDialog.style.visibility = popupDialog.style.visibility === "visible" ? "hidden" : "visible";
}

function closePopup() {
    popupDialog.style.visibility = popupDialog.style.visibility === "visible" ? "hidden" : "visible";
}