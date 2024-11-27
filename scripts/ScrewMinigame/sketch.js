let screws = [];
let screwSize = 30;
let screwDepth = 50; // Total depth to screw in
let screwSpeed = 10; // Amount screwed in per click
let particles = [];
let timer = 15; // 15-second timer
let gameWon = false;
let gameLost = false;
let winDelay = 60; // Frames to wait after winning for particles to dissipate

function setupScrews() {
  createCanvas(400, 400);
  gameWon = false;
  gameLost = false;
  timer = 15;

  // Adjust screw placement to align above decorative bolts
  let sheetX = 50;
  let sheetY = 50;
  let sheetWidth = width - 100;
  let sheetHeight = height - 150;

  screws = [
    { x: sheetX + 20, y: sheetY + 20, depth: 0, completed: false }, // Top-left
    { x: sheetX + sheetWidth - 20, y: sheetY + 20, depth: 0, completed: false }, // Top-right
    { x: sheetX + 20, y: sheetY + sheetHeight - 20, depth: 0, completed: false }, // Bottom-left
    { x: sheetX + sheetWidth - 20, y: sheetY + sheetHeight - 20, depth: 0, completed: false }, // Bottom-right
  ];
}

  function startScrews(){
  loop()
  // Timer setup
  setInterval(() => {
    if (!gameWon && !gameLost) {
      timer--;
      if (timer <= 0) {
        gameLost = true;
        clearInterval(refreshIntervalId);
        noLoop();
      }
    }
  }, 1000);
}

function draw() {
  background(50); // Dark gray background

  // Draw the background (sheet metal and machine details)
  drawBackground();

  // Draw the screws
  for (let screw of screws) {
    drawScrew(screw.x, screw.y, screwSize, screw.depth);
  }

  // Update and draw particles
  updateParticles();

  // Display instructions or game status
  fill(255);
  textSize(16);
  if (gameLost) {
    drawCenteredText("Failure", color(255, 0, 0));
    if (document.getElementById("defaultCanvas0") != null){
      const temp_canvas = document.getElementById("defaultCanvas0");
      temp_canvas.remove()
    }
  } else if (gameWon) {
    winDelay--;
    if (winDelay <= 0) noLoop();
    drawCenteredText("Success!", color(0, 200, 0), true); // Success with outline
    screwWin();
    if (document.getElementById("defaultCanvas0") != null){
      const temp_canvas = document.getElementById("defaultCanvas0");
      temp_canvas.remove()
    }
  } else {
    noStroke();
    text(`Time: ${timer}s`, 10, height - 50);
    text("Click screws to tighten them!", 10, height - 20);
    if (screws.every(screw => screw.depth >= screwDepth)) {
      gameWon = true;
    }
  }
}

function mousePressed() {
  if (gameWon || gameLost) return;

  // Check if a screw is clicked
  for (let screw of screws) {
    let d = dist(mouseX, mouseY, screw.x, screw.y);
    if (d < screwSize / 2 && screw.depth < screwDepth) {
      screw.depth += screwSpeed;
      if (screw.depth >= screwDepth && !screw.completed) {
        screw.completed = true;
        createParticles(screw.x, screw.y); // Create particle effect
      }
    }
  }
}

function drawBackground() {
  // Draw sheet metal
  push();
  fill(200);
  stroke(100);
  strokeWeight(2);
  rect(50, 50, width - 100, height - 150, 10); // Rounded rectangle for sheet metal
  pop();

  // Draw machine grooves and details
  push();
  stroke(100);
  strokeWeight(2);
  line(50, height / 2 - 25, width - 50, height / 2 - 25); // Centered horizontal groove
  line(width / 2, 50, width / 2, height - 100); // Vertical groove
  pop();

  // Draw bolts on sheet metal corners
  push();
  fill(100);
  noStroke();
  ellipse(70, 70, 15, 15); // Top-left bolt
  ellipse(width - 70, 70, 15, 15); // Top-right bolt
  ellipse(70, height - 120, 15, 15); // Bottom-left bolt
  ellipse(width - 70, height - 120, 15, 15); // Bottom-right bolt
  pop();
}

function drawScrew(x, y, size, depth) {
  let progress = depth / screwDepth;

  // Screw hole
  push();
  fill(100);
  noStroke();
  ellipse(x, y, size, size);
  pop();

  // White border fades to light gray and shrinks as screwed in
  let borderColor = lerpColor(color(255), color(180), progress); // White to light gray
  fill(borderColor);
  let borderSize = size - progress * (size / 4);
  ellipse(x, y, borderSize, borderSize);

  // Screw head (Philips style cross, shrinks slightly but remains visible)
  fill(50); // Darker grey screw head
  let headSize = max(size * 0.5, size - progress * (size * 0.5)); // Ensure a minimum visible size
  ellipse(x, y, headSize, headSize);

  // Philips cross (scales with head size)
  push();
  stroke(200); // Light grey for the cross
  strokeWeight(2);
  line(x - headSize / 4, y, x + headSize / 4, y); // Horizontal line
  line(x, y - headSize / 4, x, y + headSize / 4); // Vertical line
  pop();
}

function drawCenteredText(msg, color, outline = false) {
  textAlign(CENTER, CENTER);
  textSize(32);
  let x = width / 2;
  let y = height / 2 - 25; // Centered to intersecting lines
  if (outline) {
    stroke(0);
    strokeWeight(3);
  } else {
    noStroke();
  }
  fill(color);
  text(msg, x, y);
}

function createParticles(x, y) {
  for (let i = 0; i < 15; i++) {
    let angle = random(TWO_PI);
    let speed = random(2, 5);
    particles.push({
      x: x,
      y: y,
      vx: cos(angle) * speed,
      vy: sin(angle) * speed,
      alpha: 255, // Opacity of the particle
    });
  }
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= 255 / 30; // Fade out over 30 frames (1 second at 60 FPS)
    if (p.alpha <= 0) {
      particles.splice(i, 1); // Remove faded particles
    } else {
      push();
      noStroke();
      fill(255, p.alpha); // White particles fading out
      ellipse(p.x, p.y, 5, 5);
      pop();
    }
  }
}
