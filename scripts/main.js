const clickButton = document.getElementById('click-btn');
const progressBar = document.getElementById('progress-bar');
const clickCountDisplay = document.getElementById('click-count');
const autoClickCountDisplay = document.getElementById('auto-click-count');
const popupDialog = document.getElementById("popupDialog");
const popupMessage = document.getElementById("popupMessage");
const curLevel = document.getElementById("current-level");
const manualContainer = document.getElementById("Manual-Click");
const tutorialText = document.getElementById("tutorial-text")
const tutorialTitle = document.getElementById("tutorial-content");

let repair1Buttons = 0;

let clickCount = 0;
let autoClickCount = 0;
let maxClicks = 10;

let repairTutorial = true;

let minigameActive = false;

let pauseUpdate = false;

let postGameImages = ["images/hamster.gif", "images/hamster.gif", "images/windmill.gif", "images/windmill.gif",]


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
    },
    "Auto3":{
        "Active":false,
        "Broken":false,
        "Durability":10,
        "MaxDurability":10,
        "DurabilityBar":document.getElementById("durability3"),
        "AutoClickDisplay":document.getElementById("autocount3"),
        "add":4,
        "clickCount":0,
        "update":4000,
        "brokenUpdate":8000,
    },
    "Auto4":{
        "Active":false,
        "Broken":false,
        "Durability":10,
        "MaxDurability":10,
        "DurabilityBar":document.getElementById("durability4"),
        "AutoClickDisplay":document.getElementById("autocount4"),
        "add":8,
        "clickCount":0,
        "update": 4000,
        "brokenUpdate":16000,
    }

};



//Levels in the program work with a key:value pair
//keys dignify how far the player has progressed(how many times the progression bar is filled)
//values are what elements are enabled when the player reaches that level and the max power needed for the next level
let levels = {
    1:{
        "elements":".level1",
        "maxVal":50,
        "background": ["images/hamster.gif", "images/hamster.gif", "images/hamster.gif", "images/hamster.gif", "images/hamster.gif"]
    },

    2:{"elements":".level2",
        "maxVal":100,
        "background": ["images/windmill.gif", "images/windmill.gif", "images/windmill.gif", "images/windmill.gif", "images/windmill.gif"]
    },

    3:{"elements":".level3",
        "maxVal":200,
        "background":[]
    },

    4:{"elements":".level4",
        "maxVal":400,
        "background":[]
    },
};
let level = 0;


function setup() {
    if (document.getElementById("defaultCanvas0") != null){
      const temp_canvas = document.getElementById("defaultCanvas0");
      temp_canvas.remove()
    }
  }

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

//Minigame Handler
function minigameHandler(currentGame) {
    switch (currentGame){
        case "Auto1":
            openRepairPopup();
            break;
        case "Auto2":
            minigame();
            break;
        case "Auto3":
            const screwMinigame = document.getElementById("screwMinigame");
            screwMinigame.style.display = "flex";
            setupScrews()
            startScrews()
            break;
        case "Auto4":
            const wiresMinigame = document.getElementById("wiresMinigame");
            wiresMinigame.style.display = "flex";
            startWires()
            break;
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
                repair("Auto2")
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
        }
    }, 5000); //5 sec counter for minigame
}

function levelUp() {
    if (!(levels[level])){ //once the player has unlocked everything, just make the number go up

        
        
        }
    else{
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

    }
    if (manualContainer.style.width != '50%'){manualContainer.style.width = '50%';}
    curLevel.textContent = "Level " + level;
    if (!(levels[level])){maxClicks = maxClicks + (100*level) }
    else{maxClicks = levels[level]["maxVal"];}


    if(!(levels[level])) {
        const gameContainer = document.querySelector(".game-container");
        postGameImages.forEach((imgSrc) => {
                const img = document.createElement("img");
                img.src = imgSrc;
                img.alt = "Level background";
                img.classList.add("level-background");
                
                // Randomize placement for added visual interest
                img.style.top = `${70 + Math.random() * 30}%`;
                img.style.left = `${Math.random() * 90}%`;

                gameContainer.appendChild(img);
            });
        }
    else{
        const gameContainer = document.querySelector(".game-container");
        levels[level].background.forEach((imgSrc) => {
            const img = document.createElement("img");
            img.src = imgSrc;
            img.alt = "Level background";
            img.classList.add("level-background");
            
            // Randomize placement for added visual interest
            img.style.top = `${70 + Math.random() * 30}%`;
            img.style.left = `${Math.random() * 90}%`;

            gameContainer.appendChild(img);
        });
    }
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

    if (autoclicker["Durability"] <= 0){
        autoclicker["Broken"] = true
        if (repairTutorial) {
            openTutorialPopup("It looks like one of your autoclickers has broken down, it'lll continue to autoclick but at a slower rate. To repair, click on the repair button and preform a short minigame", "OH NO!");
            repairTutorial = false;
        }
    }

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
    updateDurability(autoID)
}

//change repair button color from red to green with call so css pseduo function 'clicked'
function repairButtonChangeColor(button){
    button.classList.toggle("clicked");
    setTimeout(()=>checkRepair1Btns(button), 100)
}

function checkRepair1Btns(button){
    if (button.classList.contains("clicked")) {
        repair1Buttons++;
    }
    else {
        repair1Buttons--;
    }
    if (repair1Buttons == 4) {
        closeRepairPopup();
        let buttons = document.getElementsByClassName("repair-btn-change");
        let buttons_size = buttons.length;
        for (let i = 0; i < buttons_size; i++){
            buttons[i].classList.toggle("clicked");
            repair1Buttons--;
        }
        repair("Auto1");
    }
}

//opens repair popup
function openRepairPopup() {
    popupDialog.style.visibility = popupDialog.style.visibility === "visible" ? "hidden" : "visible";
}

//closes repair popup
function closeRepairPopup() {
    popupDialog.style.visibility = popupDialog.style.visibility === "visible" ? "hidden" : "visible";
}

function openTutorialPopup(newString = "", titleString = "") {
    if (newString.localeCompare("") != 0){
        tutorialText.textContent = newString;
        tutorialTitle.textContent = titleString;
    }
    document.getElementById("tutorialPopup").style.display = "flex";
}

function closeTutorialPopup() {
    document.getElementById("tutorialPopup").style.display = "none";
}

function screwWin(){
    repair("Auto3");
    const screwMinigame = document.getElementById("screwMinigame");
    screwMinigame.style.display = "none";
  } 

function wiresWin(){
    repair("Auto4");
    const wiresMinigame = document.getElementById("wiresMinigame");
    wiresMinigame.style.display = "none";
}