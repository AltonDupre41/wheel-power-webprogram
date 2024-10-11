const clickButton = document.getElementById('click-btn');
const progressBar = document.getElementById('progress-bar');
const clickCountDisplay = document.getElementById('click-count');
const autoClickCountDisplay = document.getElementById('auto-click-count');

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

//manual click function
clickButton.addEventListener('click', () => {
    clickCount++;
    clickCountDisplay.textContent = clickCount;
    updateProgress();
});

//autoclick function
setInterval(() => {
    autoClickCount++;
    autoClickCountDisplay.textContent = autoClickCount;
    updateProgress();
}, 2000); //auto click every X000 (every 1000 is 1 sec)
