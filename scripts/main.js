const clickButton = document.getElementById('click-btn');
const progressBar = document.getElementById('progress-bar');
const clickCountDisplay = document.getElementById('click-count');
const autoClickCountDisplay = document.getElementById('auto-click-count');
const popupDialog = document.getElementById("popupDialog");
const popupMessage = document.getElementById("popupMessage");
const curLevel = document.getElementById("current-level");
const manualContainer = document.getElementById("Manual-Click");

let autoClickActive = false
let autoClickBroken = false
let autoClickDurability = 10
let autoClickMaxDurability = 10

let clickCount = 0;
let autoClickCount = 0;
let maxClicks = 10;

let minigameActive = false;

let pauseUpdate = false;


//Database for AutoClickers
//keyvalue pair where the key is the class of the autoclicker and the value includes data about the autoclicker
//TODO: Convert code to work with this data
let AutoClickDATA = {
    "Auto1":{
        "Active":false, //Determines if the AutoClicker is Active
        "Broken":false, // If the autoclicker is broken
        "Durability":10, // current durability
        "MaxDurability":10, // max durability, used to apply to durability with the repair() function
        "DurabilityBar":document.getElementById("durability1"), //the durability bar element
        "AutoClickDisplay":document.getElementById("autocount1"), //the count display
        "add":1, // How much the autoclicker adds
        "clickCount":0, // how much the autoclicker has added
        "update":1000, // time between autoclicks
        "brokenUpdate":2000, //time between autoclicks when broken
    },
    "Auto2":{
        "Active":false,
        "Broken":false,
        "Durability":10,
        "MaxDurability":10,
        "DurabilityBar":document.getElementById("durability2"),
        "AutoClickDisplay":document.getElementById("autocount2"),
        "add":2,
        "clickCount":0,
        "update":2000,
        "brokenUpdate":4000,
    }
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
    if (pauseUpdate){return;}
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
        pauseUpdate = true;
        setTimeout(() => {

            level++;
            levelUp();

            clickCount = 0;
            autoClickCount = 0;
            progressBar.style.width = '0%';
            progressBar.style.backgroundColor = 'rgb(255, 0, 0)';
            clickCountDisplay.textContent = clickCount;

            pauseUpdate = false;

        }, 500);
    }
}

//First minigame
function minigame() {
    if (minigameActive) return;
    minigameActive = true;
    ballsClicked = 0;
    const minigamePopup = document.getElementById("minigamePopup");
    minigamePopup.style.display = "flex";
    const balls = []; //array of balls on the screen

    //add balls to the screen
    for (let i = 0; i < 5; i++) {
        const ball = document.createElement("div");
        ball.classList.add("minigame-ball");
        ball.style.top = `${Math.random() * 80 + 10}%`;
        ball.style.left = `${Math.random() * 80 + 10}%`;

        //remove balls on click
        ball.addEventListener("click", () => {
            ball.remove();
            ballsClicked++;
            if (ballsClicked == 5) {
                minigamePopup.style.display = "none";
                minigameActive = false;
                balls.forEach(b => b.remove()); //removes balls off screen
            }
        });
        minigamePopup.appendChild(ball);
        balls.push(ball);
    }

    //moves player down a level if they fail the minigame
    setTimeout(() => {
        if (ballsClicked < 5) {
            minigamePopup.style.display = "none";
            minigameActive = false;
            balls.forEach(b => b.remove());
            level = Math.max(0, level - 1);
            levelUp();
        }
    }, 3000); //3 sec counter for minigame
}

//Gives random chance of minigame activating
function checkForMinigame() {
    if (Math.random() < 0.8) {
        minigame();
    }
}

function levelUp() {
    if (!(levels[level])){return;}
    let nodeList = document.querySelectorAll(levels[level]["elements"]);
    let i;
    for (i = 0; (nodeList.length != 0 && i != nodeList.length); i++){
        let elementID = nodeList[i].id;
        nodeList[i].removeAttribute("hidden");
        
        if(!nodeList[i].classList.contains("level-text")){
            AutoClickDATA[elementID]["Active"] = true;
            setTimeout(() => AutoClick(elementID), AutoClickDATA[elementID]["update"]);
        }
        
    }
    if (manualContainer.style.width != '50%'){manualContainer.style.width = '50%';}
    curLevel.textContent = "Level " + level;
    maxClicks = levels[level]["maxVal"];
    checkForMinigame();
}

function updateDurability(autoID){
    let autoclicker = AutoClickDATA[autoID];
    //move progress bar
    let durability = (autoclicker["Durability"] / autoclicker["MaxDurability"]) * 100;
    if (durability > 100) durability = 100;
    autoclicker["DurabilityBar"].style.width = (durability) + '%';

    //change progress bar colors
    const red = Math.min(durability * 2.55, 255);
    const green = Math.max(255 - (durability * 2.55), 0);
    autoclicker["DurabilityBar"].style.backgroundColor = `rgb(${green}, ${red}, 0)`;

}

//manual click function
clickButton.addEventListener('click', () => {
    clickCount++;
    clickCountDisplay.textContent = clickCount;
    updateProgress();
});

//A frame where the game processes the AutoClickers
function AutoClick(autoID){
    let autoclicker = AutoClickDATA[autoID];
    autoClickCount += autoclicker["add"];
    autoclicker["clickCount"] += autoclicker["add"];
    autoclicker["AutoClickDisplay"].textContent = autoclicker["clickCount"];

    updateProgress();

    if (autoclicker["Durability"] <= 0){autoclicker["Broken"] = true}

    if (autoclicker["Broken"]){
        setTimeout(() => AutoClick(autoID), autoclicker["brokenUpdate"]);
        return;
    }

    autoclicker["Durability"]--;
    updateDurability(autoID);

    if (autoclicker["Active"]){
        setTimeout(() => AutoClick(autoID), autoclicker["update"]);
        return;
    }
}

function repair(autoID){
    let autoclicker = AutoClickDATA[autoID];
    autoclicker["Broken"] = false;
    autoclicker["Durability"] = autoclicker["MaxDurability"];
}

//change repair button color from red to green with call so css pseduo function 'clicked'
function repairButtonChangeColor(button){
    button.classList.toggle("clicked");
}

//opens repair popup
function openRepairPopup() {
    popupDialog.style.visibility = popupDialog.style.visibility === "visible" ? "hidden" : "visible";
}

//closes repair popup
function closeRepairPopup() {
    popupDialog.style.visibility = popupDialog.style.visibility === "visible" ? "hidden" : "visible";
}

//needed separate open/close functions for the tutorial popup
function openTutorialPopup() {
    document.getElementById("tutorialPopup").style.display = "flex";
}

function closeTutorialPopup() {
    document.getElementById("tutorialPopup").style.display = "none";
}