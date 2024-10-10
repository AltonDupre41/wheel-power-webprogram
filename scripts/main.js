let number = 0;
let myButton = document.querySelector("button");
let myHeading = document.querySelector("h1");

function upButtonNumber() {
    // const myName = prompt("Please enter your name.");
    //localStorage.setItem("name", myName);
    //myHeading.textContent = `Mozilla is cool, ${myName}`;
    number = number + 1;
    myHeading.textContent = `TIMES CLICKED: ${number}`;
}


myButton.onclick = () => {
    upButtonNumber();
};