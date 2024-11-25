let birds = [];
let birdCount = 5;
let turbine;
let turbineBase;
let gameOver = false;
let reticle;
let waveDelay = 2000; // Delay between waves (in milliseconds)
let lastWaveTime = 0; // Timestamp of the last wave
let waveIndex = 0; // Which wave we're on
let birdSpacing = 30; // Vertical spacing between birds
let turbineAngle = 0; // Angle for rotating turbine blades
let birdImg; // Variable to hold the bird GIF
let deadBirdImg; // Bird gif when dead
let successMessageTime = -1; // Store the time when the success message should appear
let successVar = false;
let birdsShot = 0;
let soundFile;

function preload() {
  birdImg = loadImage("Bird.gif"); // Load the flying bird GIF
  deadBirdImg = loadImage("DeadBird.gif"); // Load the dead bird GIF
  soundFile = loadSound('gunshot.mp3');
}

function setup() {
  createCanvas(400, 400);
  turbine = createVector(width - 50, height / 2 - 20);
  turbineBase = createVector(turbine.x, height / 2 + 50); // Position for the pillar base
  reticle = createVector(width / 2, height / 2);
  lastWaveTime = millis(); // Start timing for the first wave
}

function draw() {
  // Draw the background (field and sky)
  drawBackground();

  // Display the instruction at the top
  textAlign(LEFT);
  textSize(20);
  fill(0);
  text("Shoot down the birds!", 10, 30);

  if (gameOver) {
    textAlign(CENTER);
    textSize(32);
    fill(255, 0, 0); // Red color for failure
    text("Failure", width / 2, height / 2);
    return;
  }

  // Draw turbine pillar and rotating blades
  drawWindmill();

  // Spawn birds if it's time for the next wave
  if (millis() - lastWaveTime >= waveDelay && waveIndex < 6) {
    spawnBirds(waveIndex);
    lastWaveTime = millis();
    waveIndex++;
  }

  // Update and display birds
  for (let i = birds.length - 1; i >= 0; i--) {
    birds[i].update();
    birds[i].show();

    // Check if bird hits the turbine
    if (birds[i].x > turbine.x - 25 && birds[i].x < turbine.x + 25 && birds[i].y > turbine.y - 25 && birds[i].y < turbine.y + 25) {
      gameOver = true;
    }

    // Remove bird if it goes off-screen
    if (birds[i].x > width) {
      birds.splice(i, 1);
      birdsShot += 1;
    }
    if (birds[i].y > 400) {
      birds.splice(i, 1);
      birdsShot += 1;
    }
  }

  // Draw the sniper reticle (crosshair)
  drawSniperReticle(mouseX, mouseY);

  // Check for mouse clicks to shoot
  if (mouseIsPressed) {
    soundFile.play();
    for (let i = birds.length - 1; i >= 0; i--) {
      if (dist(mouseX, mouseY, birds[i].x, birds[i].y) < birds[i].r) {
        birds[i].shot = true; // Mark bird as shot
        birds[i].falling = true; // Start falling
        birds[i].yVel = 2; // Set initial falling velocity
      }
    }
  }

  if (birdsShot === 9) {
    stroke("green");
    textAlign(CENTER);
    textSize(32);
    fill(0, 255, 0); // Green color for success
    text("Success!", width / 2, height / 2);
  }
}

function mouseMoved() {
  reticle.x = mouseX;
  reticle.y = mouseY;
}

function spawnBirds(waveIndex) {
  let birdY = height / 2;

  // Based on the waveIndex, adjust the vertical position of the birds
  if (waveIndex === 0) {
    birds.push(new Bird(birdY)); // First bird at the center
  } else if (waveIndex === 1) {
    birds.push(new Bird(birdY - birdSpacing)); // Second bird slightly above
    birds.push(new Bird(birdY + birdSpacing)); // Third bird slightly below
  } else if (waveIndex === 2) {
    birds.push(new Bird(birdY)); // Fourth bird at the center
    birds.push(new Bird(birdY - birdSpacing)); // Fifth bird slightly above
    birds.push(new Bird(birdY + birdSpacing)); // Sixth bird slightly below
  } else if (waveIndex === 3) {
    birds.push(new Bird(birdY)); // Seventh bird at the center
  } else if (waveIndex === 4) {
    birds.push(new Bird(birdY - birdSpacing)); // Eighth bird slightly above
    birds.push(new Bird(birdY + birdSpacing)); // Ninth bird slightly below
  }
  else if (waveIndex === 5) {
    
    successVar = true;
  }
}

function drawBackground() {
  // Sky
  background(135, 206, 235); // Light blue color for the sky

  // Field with hills on the horizon
  fill(34, 139, 34); // Forest green for the field
  noStroke();
  beginShape();
  vertex(0, height / 2 + 50);
  bezierVertex(width / 4, height / 2 + 100, 3 * width / 4, height / 2 + 120, width, height / 2 + 50); // Creating a hill
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

  // Add some cloud-like shapes for additional atmosphere (optional)
  fill(255);
  ellipse(100, 100, 80, 50);
  ellipse(150, 120, 100, 60);
  ellipse(120, 140, 70, 40);
}

function drawSniperReticle(x, y) {
  // Outer circle of the reticle (large)
  noFill();
  stroke(255, 0, 0);
  strokeWeight(2);
  ellipse(x, y, 50, 50);

  // Inner circle of the reticle (small)
  ellipse(x, y, 10, 10);

  // Crosshair lines
  line(x - 25, y, x + 25, y); // Horizontal line
  line(x, y - 25, x, y + 25); // Vertical line
}

function drawWindmill() {
  // Draw the pillar for the windmill
  fill(150);
  rect(turbineBase.x - 10, turbineBase.y, 20, height / 2);
  // Draw the windmill blades
  push();
  translate(turbine.x, turbineBase.y); // Move to the turbine base
  ellipse(0, 0, 40, 40);
  rotate(radians(turbineAngle)); // Rotate the blades

  // Windmill blades (3 elliptical blades, spaced 120 degrees apart)
  fill(155); // Light grey for the blades

  // Blade 1 (top)
  ellipse(0, -50, 30, 100);

  // Blade 2 (bottom)
  push();
  rotate(TWO_PI / 3); // Rotate by 120 degrees
  ellipse(0, -50, 30, 100); 
  pop();

  // Blade 3 (left)
  push();
  rotate(-TWO_PI / 3); // Rotate by -120 degrees
  ellipse(0, -50, 30, 100);
  pop();

  pop();

  turbineAngle += 6; // Increment rotation angle for the blades
}

class Bird {
  constructor(y) {
    this.x = 0;
    this.y = y;
    this.r = 15; // Radius used for collision detection
    this.speed = 1; // Slower speed
    this.shot = false; // Indicates if the bird has been shot
    this.falling = false; // Indicates if the bird is falling
    this.yVel = 0; // Vertical velocity for falling
    this.fallOffset = random(-30, 30); // Random vertical variation for landing position
    this.angle = random(TWO_PI); // Random initial angle for spinning
    this.spinSpeed = random(0.05, 0.1); // Random spin speed after the bird is shot
    this.scaleFactor = 0.3; // Scale down factor for the bird's image (adjusted for smaller size)
  }

  update() {
    //birdsShot += 1;
    if (this.falling) {
      this.y += this.yVel;
      this.yVel += 0.1; // Gravity effect

      // Stop bird on the grass and add random variation to the fall distance
      if (this.y > height / 2 + 50 - this.r + 280 + this.fallOffset) {
        this.y = height / 2 + 50 - this.r + 280 + this.fallOffset;
        this.yVel = 0; // Stop vertical movement
      }

      // Rotate the dead bird as it falls
      this.angle += this.spinSpeed; // Apply rotation
    } else {
      this.x += this.speed;
    }
  }

  show() {
    if (this.shot) {
      // Show the dead bird image and spin it while falling
      push();
      translate(this.x, this.y); // Move the origin to the bird's position
      rotate(this.angle); // Apply rotation based on angle
      imageMode(CENTER);
      image(deadBirdImg, 0, 0, deadBirdImg.width * this.scaleFactor, deadBirdImg.height * this.scaleFactor); // Scaled down dead bird
      pop();
    } else {
      // Show the live bird gif while it is still flying
      imageMode(CENTER);
      image(birdImg, this.x, this.y, birdImg.width * this.scaleFactor, birdImg.height * this.scaleFactor); // Scaled down flying bird
    }
  }
}
