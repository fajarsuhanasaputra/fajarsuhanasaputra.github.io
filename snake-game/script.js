const CELL_SIZE = 20;
const CANVAS_SIZE = 500;
const REDRAW_INTERVAL = 50;
const WIDTH = CANVAS_SIZE / CELL_SIZE;
const HEIGHT = CANVAS_SIZE / CELL_SIZE;
const DIRECTION = {
  LEFT: 0,
  RIGHT: 1,
  UP: 2,
  DOWN: 3,
};
// Soal no 2: Pengaturan Speed (semakin kecil semakin cepat) ubah dari 150 ke 120
const MOVE_INTERVAL = 180;
const gulpSound = new Audio("assets/sound_effect/level1.mp3");
const level2sound = new Audio("assets/sound_effect/level2.mp3");
const level3sound = new Audio("assets/sound_effect/level3.mp3");
const level4sound = new Audio("assets/sound_effect/level4.mp3");
const level5sound = new Audio("assets/sound_effect/level5.mp3");

function initPosition() {
  return {
    x: Math.floor(Math.random() * WIDTH),
    y: Math.floor(Math.random() * HEIGHT),
  };
}

function initHeadAndBody() {
  let head = initPosition();
  let body = [{ x: head.x, y: head.y }];
  return {
    head: head,
    body: body,
  };
}
function initDirection() {
  return Math.floor(Math.random() * 4);
}

function initSnake(color) {
  return {
    color: color,
    ...initHeadAndBody(),
    direction: initDirection(),
    score: 0,
    level: 1,
  };
}

let snake1 = initSnake("green");
// Soal no 4: make apples array
let apples = [
  {
    position: initPosition(),
  },
  {
    position: initPosition(),
  },
];

function levelUp() {
  switch (snake1.score) {
    case 5:
      snake1.level = 2;
      break;
    case 10:
      snake1.level = 3;
      break;
    case 15:
      snake1.level = 4;
      break;
    case 20:
      snake1.level = 5;
      break;

    default:
      break;
  }
}

function soundEffectLevelUp() {
  if (snake1.score === 5) level2sound.play();
  if (snake1.score === 10) level3sound.play();
  if (snake1.score === 15) level4sound.play();
  if (snake1.score === 20) level5sound.play();
}
function eat(snake, apples) {
  for (let i = 0; i < apples.length; i++) {
    let apple = apples[i];
    if (snake.head.x == apple.position.x && snake.head.y == apple.position.y) {
      apple.position = initPosition();
      snake.score++;
      gulpSound.play();
      snake.body.push({ x: snake.head.x, y: snake.head.y });
    }
  }
}
function drawLevelAndSpeed() {
  let levelCanvas = document.getElementById("level");
  let speedCanvas = document.getElementById("speed");
  levelCanvas.innerText = `Snake Game - Level ${snake1.level}`;
  speedCanvas.innerText = `Speed ${MOVE_INTERVAL}.ms`;
}

function drawCell(ctx, x, y, color, image) {
  if (image) {
    ctx.drawImage(image, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  } else {
    ctx.fillStyle = color;
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  }
}

function drawScore(snake) {
  let scoreCanvas;
  if (snake.color == snake1.color) {
    scoreCanvas = document.getElementById("score1Board");
  }
  let scoreCtx = scoreCanvas.getContext("2d");

  scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  scoreCtx.font = "33px Arial";
  scoreCtx.fillStyle = snake.color;
  scoreCtx.fillText(snake.score, 40, scoreCanvas.scrollHeight / 2);
  scoreCtx.textAlign = "center";
}

function draw() {
  setInterval(function () {
    let snakeCanvas = document.getElementById("snakeBoard");
    let ctx = snakeCanvas.getContext("2d");

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    var snakeImg = document.getElementById("snake");

    drawCell(ctx, snake1.head.x, snake1.head.y, snake1.color, snakeImg);
    for (let i = 1; i < snake1.body.length; i++) {
      drawCell(ctx, snake1.body[i].x, snake1.body[i].y, snake1.color, snakeImg);
    }

    for (let i = 0; i < apples.length; i++) {
      let apple = apples[i];

      // Soal no 3: DrawImage apple dan gunakan image id:
      var img = document.getElementById("apple");
      ctx.drawImage(
        img,
        apple.position.x * CELL_SIZE,
        apple.position.y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );
    }

    drawScore(snake1);
    drawLevelAndSpeed();
    levelUp();
    soundEffectLevelUp();
  }, REDRAW_INTERVAL);
}

function teleport(snake) {
  if (snake.head.x < 0) {
    snake.head.x = CANVAS_SIZE / CELL_SIZE - 1;
  }
  if (snake.head.x >= WIDTH) {
    snake.head.x = 0;
  }
  if (snake.head.y < 0) {
    snake.head.y = CANVAS_SIZE / CELL_SIZE - 1;
  }
  if (snake.head.y >= HEIGHT) {
    snake.head.y = 0;
  }
}

// Soal no 4: Jadikan apples array
function eat(snake, apples) {
  for (let i = 0; i < apples.length; i++) {
    let apple = apples[i];
    if (snake.head.x == apple.position.x && snake.head.y == apple.position.y) {
      apple.position = initPosition();
      snake.score++;
      gulpSound.play();
      snake.body.push({ x: snake.head.x, y: snake.head.y });
    }
  }
}

function moveLeft(snake) {
  snake.head.x--;
  teleport(snake);
  eat(snake, apples);
}

function moveRight(snake) {
  snake.head.x++;
  teleport(snake);
  eat(snake, apples);
}

function moveDown(snake) {
  snake.head.y++;
  teleport(snake);
  eat(snake, apples);
}

function moveUp(snake) {
  snake.head.y--;
  teleport(snake);
  eat(snake, apples);
}

function checkCollision(snakes) {
  let isCollide = false;
  //this
  for (let i = 0; i < snakes.length; i++) {
    for (let j = 0; j < snakes.length; j++) {
      for (let k = 1; k < snakes[j].body.length; k++) {
        if (
          snakes[i].head.x == snakes[j].body[k].x &&
          snakes[i].head.y == snakes[j].body[k].y
        ) {
          isCollide = true;
        }
      }
    }
  }
  if (isCollide) {
    // Soal no 5: Add game over audio:
    var audio = new Audio("assets/sound_effect/game-over1.mp3");
    audio.play();

    alert("Game over");
    snake1 = initSnake("purple");
  }
  return isCollide;
}

function move(snake) {
  switch (snake.direction) {
    case DIRECTION.LEFT:
      moveLeft(snake);
      break;
    case DIRECTION.RIGHT:
      moveRight(snake);
      break;
    case DIRECTION.DOWN:
      moveDown(snake);
      break;
    case DIRECTION.UP:
      moveUp(snake);
      break;
  }
  moveBody(snake);
  // Soal no 6: Check collision dengan snake3
  if (!checkCollision([snake1])) {
    setTimeout(function () {
      move(snake);
    }, MOVE_INTERVAL);
  } else {
    initGame();
  }
}

function moveBody(snake) {
  snake.body.unshift({ x: snake.head.x, y: snake.head.y });
  snake.body.pop();
}

function turn(snake, direction) {
  const oppositeDirections = {
    [DIRECTION.LEFT]: DIRECTION.RIGHT,
    [DIRECTION.RIGHT]: DIRECTION.LEFT,
    [DIRECTION.DOWN]: DIRECTION.UP,
    [DIRECTION.UP]: DIRECTION.DOWN,
  };

  if (direction !== oppositeDirections[snake.direction]) {
    snake.direction = direction;
  }
}

document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowLeft") {
    turn(snake1, DIRECTION.LEFT);
  } else if (event.key === "ArrowRight") {
    turn(snake1, DIRECTION.RIGHT);
  } else if (event.key === "ArrowUp") {
    turn(snake1, DIRECTION.UP);
  } else if (event.key === "ArrowDown") {
    turn(snake1, DIRECTION.DOWN);
  }
});

function initGame() {
  move(snake1);
}

initGame();
