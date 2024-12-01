let wireColors = ['red', 'blue', 'yellow', 'green'];
let leftNodes = [];
let rightNodes = [];
let wires = [];
let draggingWire = null;
let offsetX = 0;
let offsetY = 0;
let timer = 15; // 15 seconds timer
let timerStart = 0;
let gameOver = false;
let winCondition = false;
let timerRunning = true; // Flag to indicate if the timer should continue running

function setup() {
  createCanvas(400, 400);
  resetGame();
  timerStart = millis(); // Initialize the start time of the timer
}

function resetGame() {
  leftNodes = [];
  rightNodes = [];
  wires = [];
  draggingWire = null;
  gameOver = false;
  winCondition = false;
  timerRunning = true; // Reset the timer to run

  // Generate positions for left nodes and shuffle colors
  let shuffledColors = shuffleArray([...wireColors]);
  for (let i = 0; i < wireColors.length; i++) {
    leftNodes.push({ x: 50, y: 80 + i * 80, color: shuffledColors[i] });
  }

  // Generate positions for right nodes and shuffle colors
  shuffledColors = shuffleArray([...wireColors]);
  for (let i = 0; i < wireColors.length; i++) {
    rightNodes.push({ x: 350, y: 80 + i * 80, color: shuffledColors[i] });
  }

  // Create wires based on randomized left nodes and shuffled right nodes
  for (let i = 0; i < wireColors.length; i++) {
    let targetNode = rightNodes.find(node => node.color === leftNodes[i].color);
    wires.push({
      startX: leftNodes[i].x,
      startY: leftNodes[i].y,
      endX: leftNodes[i].x,
      endY: leftNodes[i].y,
      targetX: targetNode.x,
      targetY: targetNode.y,
      color: leftNodes[i].color,
      connected: false
    });
  }
}

function draw() {
  if (timerRunning) {
    let elapsedTime = (millis() - timerStart) / 1000;
    timer = Math.max(0, 15 - elapsedTime); // Ensure timer doesn't go below 0

    if (timer <= 0 && !gameOver) {
      if (!winCondition) {
        gameOver = true; // End the game if the timer reaches 0 and win condition isn't met
      }
      timerRunning = false; // Stop the timer after it runs out
    }
  }

  if (!gameOver) {
    // Set a metallic, futuristic background
    background(30);
    drawMetallicBackground();

    // Draw the border with rounded corners
    stroke(100); // Border color (e.g., white)
    strokeWeight(30); // Border thickness
    fill(0, 0); // Transparent fill
    rect(5, 5, width - 10, height - 10, 40); // x, y, width, height, border radius
    rect(0, 0, 10, 10);
    rect(0, 400, 10, 10);
    rect(400, 0, 10, 10);
    rect(400, 400, 10, 10);

    // Display the timer at the top left corner if the game isn't over
    fill(255);
    textAlign(LEFT, TOP);
    textSize(16);
    stroke('black');
    strokeWeight(2);
    text(`Time: ${Math.ceil(timer)}s`, 160, 30);

    //Directions text
    text(`Connect the left nodes to the right nodes!`, 55, 350);

    // Draw the game elements if the game is not over
    // Draw left nodes
    for (let node of leftNodes) {
      fill(node.color);
      noStroke();
      ellipse(node.x, node.y, 20, 20);
    }

    // Draw right nodes
    for (let node of rightNodes) {
      fill(node.color);
      noStroke();
      ellipse(node.x, node.y, 20, 20);
    }

    // Draw wires
    for (let wire of wires) {
      stroke(wire.color);
      strokeWeight(4);
      line(wire.startX, wire.startY, wire.endX, wire.endY);
    }

    // Check for success
    if (wires.every(wire => wire.connected)) {
      fill(0, 255, 0);
      textAlign(CENTER, CENTER);
      textSize(32);
      stroke('black');
      text('Success!', width / 2, height / 2);
      winCondition = true; // Mark the game as won
      gameOver = true; // End the game when successful
      timerRunning = false; // Stop the timer when success is achieved
    }
  } else {
    // If the game is over and it is a failure, display "Failure"
    if (!winCondition) {
      fill(255, 0, 0);
      textAlign(CENTER, CENTER);
      textSize(32);
      stroke('black');
      text('Failure', width / 2, height / 2);
    }
  }
}


// Function to draw a metallic, technological background
function drawMetallicBackground() {
  // Create a gradient background
  for (let y = 0; y < height; y += 5) {
    let gradient = map(y, 0, height, 50, 100);
    stroke(gradient);
    line(0, y, width, y);
  }

  // Add subtle grid lines to give a technological feel
  stroke(100, 100, 100, 50); // Light gray with transparency
  for (let x = 0; x < width; x += 20) {
    line(x, 0, x, height);
  }
  for (let y = 0; y < height; y += 20) {
    line(0, y, width, y);
  }

  // Add noise or subtle texture
  for (let i = 0; i < 200; i++) {
    let x = random(width);
    let y = random(height);
    stroke(150, 150, 150, random(20, 50)); // Subtle noise effect
    point(x, y);
  }
}

function drawCircuitBoardBackground() {
  // Set a dark green background color
  background(30);
  
  // Set the circuit trace color
  stroke(0, 128, 0);
  strokeWeight(1);

  // Draw horizontal and vertical grid lines
  for (let x = 0; x < width; x += 20) {
    line(x, 0, x, height);
  }
  for (let y = 0; y < height; y += 20) {
    line(0, y, width, y);
  }

  // Draw some circuit-like nodes or components
  fill(0, 128, 0);
  for (let x = 0; x < width; x += 40) {
    for (let y = 0; y < height; y += 40) {
      ellipse(x, y, 8, 8);
    }
  }
}

function mousePressed() {
  for (let wire of wires) {
    if (!wire.connected) {
      let d = dist(mouseX, mouseY, wire.endX, wire.endY);
      if (d < 10) {
        draggingWire = wire;
        offsetX = mouseX - wire.endX;
        offsetY = mouseY - wire.endY;
        break;
      }
    }
  }
}

function mouseDragged() {
  if (draggingWire) {
    draggingWire.endX = mouseX - offsetX;
    draggingWire.endY = mouseY - offsetY;
  }
}

function mouseReleased() {
  if (draggingWire) {
    let d = dist(draggingWire.endX, draggingWire.endY, draggingWire.targetX, draggingWire.targetY);
    if (d < 15) {
      draggingWire.endX = draggingWire.targetX;
      draggingWire.endY = draggingWire.targetY;
      draggingWire.connected = true;
    }
    draggingWire = null;
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
