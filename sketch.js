const gameWidth = 10;
const gameHeight = 10;
const speed = 14;
const width = gameWidth * 20;
const height = (gameHeight * 20) + 50;

let length = 3;
let orientation = 1;
let orientationQueue = 1;
let headPos;
let tailPos = [];
let fruitPos;

let displayText = "Snake!";
let frameTime = 0;
let paused = false;
let dead = false;

function setup() {

  print("Initiating Setup");
  createCanvas(width, height);
  frameRate(60);

  headPos = createVector(0, 0);
  fruitPos = createVector(0, 0);


  headPos.x = floor(gameWidth / 8) * 20;
  headPos.y = floor(gameHeight / 2) * 20;

  fruitPos.x = width - headPos.x - 20;
  fruitPos.y = headPos.y;

  tailPos.length = gameWidth * gameHeight;
  for (let i = 0; i < tailPos.length; i++) {

    tailPos[i] = createVector(headPos.x, headPos.y);
  }
  print("-=* Setup Complete *=-");
}

function draw() {

  background(20);

  noStroke();
  fill(210, 255, 52);
  rect(0, height - 50, width, 50);

  if (frameTime >= speed) {//update-----

    orientation = orientationQueue;
    if (orientation == 0) {//moving and detecting wall hit

      if (headPos.y - 20 < 0) {

        die();
      } else {

        headPos.y = headPos.y - 20;
      }

    } else if (orientation == 1) {

      if (headPos.x + 20 >= width - 1) {

        die();
      } else {

        headPos.x = headPos.x + 20;
      }
    } else if (orientation == 2) {

      if (headPos.y + 20 >= height - 51) {

        die();
      } else {

        headPos.y = headPos.y + 20;
      }
    } else if (orientation == 3) {

      if (headPos.x - 20 < 0) {

        die();
      } else {

        headPos.x = headPos.x - 20;
      }
    } else {

      orientation = 0;
      print("MANUAL ERROR: invalid orientation")
    }

    for (let i = 1; i < tailPos.length; i++) {//updating tail

      tailPos[tailPos.length - i].x = tailPos[(tailPos.length - i) - 1].x;
      tailPos[tailPos.length - i].y = tailPos[(tailPos.length - i) - 1].y;
    }
    tailPos[0].x = headPos.x;
    tailPos[0].y = headPos.y;

    for (let i = 1; i < length + 1; i++) {//checking tail collisions

      if (headPos.x == tailPos[i].x && headPos.y == tailPos[i].y && !dead) {

        die();
      }
    }

    if (length + 1 == gameWidth * gameHeight) {// checking for win

      paused = true;
    }

    frameTime = 0;
  } else {

    if (!paused) {

      frameTime++;
    }
  }

  if (headPos.x == fruitPos.x && headPos.y == fruitPos.y) {// detecting fruit collisions

    length++;
    generateNewFruit();
  }

  noStroke();// drawing and stuff
  fill(50, 150, 255);
  if (!dead) {

    for (let i = 1; i < length + 1; i++) {
      rect(tailPos[i].x + 2, tailPos[i].y + 2, 16, 16, 4);
      rect((tailPos[i].x + tailPos[i - 1].x) / 2 + 2, (tailPos[i].y + tailPos[i - 1].y) / 2 + 2, 16, 16, 4);
    }
  } else {

    for (let i = 1; i < length + 2; i++) {

      rect(tailPos[i].x + 2, tailPos[i].y + 2, 16, 16, 4);
      rect((tailPos[i].x + tailPos[i - 1].x) / 2 + 2, (tailPos[i].y + tailPos[i - 1].y) / 2 + 2, 16, 16, 4);
    }
  }
  rect(headPos.x + 2, headPos.y + 2, 16, 16, 4);

  fill(255, 0, 150);
  rect(fruitPos.x + 2, fruitPos.y + 2, 16, 16, 5);

  stroke(10);
  strokeWeight(4);
  fill(255);
  textSize(30);
  textAlign(LEFT, TOP);
  rect(6, height - 44, textWidth(str(length)) + 12, 38, 10);
  fill(10);
  noStroke();
  text(str(length), 12, height - 38);

  stroke(10);
  strokeWeight(4);
  fill(255);
  textAlign(RIGHT, TOP);
  rect(width - (textWidth(displayText) + 12) - 6, height - 44, textWidth(displayText) + 12, 38, 10);
  fill(10);
  noStroke();
  text(displayText, width - 12, height - 38);
}

function keyPressed() {

  if (!paused && !dead) {

    if (key == 'w' || key == 'W' || keyCode == UP_ARROW) {

      if (orientation != 2) {

        orientationQueue = 0;
      }
      frameTime = speed - 2;
    }
    if (key == 'd' || key == 'D' || keyCode == RIGHT_ARROW) {

      if (orientation != 3) {

        orientationQueue = 1;
      }
      frameTime = speed - 2;
    }
    if (key == 's' || key == 'S' || keyCode == DOWN_ARROW) {

      if (orientation != 0) {

        orientationQueue = 2;
      }
      frameTime = speed - 2;
    }
    if (key == 'a' || key == 'A' || keyCode == LEFT_ARROW) {

      if (orientation != 1) {

        orientationQueue = 3;
      }
      frameTime = speed - 2;
    }
  }

  if (!dead) {

    if (keyCode == ESCAPE) {

      if (paused) { paused = false; } else { paused = true };
    }
  }
}

function die () {

  paused = true;
  dead = true;
  displayText = "Game Over :("
}

function generateNewFruit () {

  fruitPos.x = floor(random(0, gameWidth)) * 20;
  fruitPos.y = floor(random(0, gameHeight)) * 20;

  for (let i = 1; i < length + 1; i++) {

    if (fruitPos.x == tailPos[i].x && fruitPos.y == tailPos[i].y) {

      generateNewFruit();
      break;
    }
  }
}
