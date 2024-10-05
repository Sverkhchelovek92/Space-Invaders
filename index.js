import Spaceship from "./Spaceship.js";
import BulletController from "./BulletController.js";
import EnemyController from "./EnemyController.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const background = new Image();
background.src = "images/space-bg.jpeg";

const spaceshipBulletController = new BulletController(canvas, 12, "yellow");
const spaceship = new Spaceship(canvas, 3, spaceshipBulletController);

const enemyBulletController = new BulletController(canvas, 4, "cyan");
const enemyController = new EnemyController(
  canvas,
  enemyBulletController,
  spaceshipBulletController
);

let isGameOver = false;
let didWin = false;

function game() {
  checkGameOver();
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  displayGameOver();
  if (!isGameOver) {
    spaceship.draw(ctx);
    enemyController.draw(ctx);
    spaceshipBulletController.draw(ctx);
    enemyBulletController.draw(ctx);
  }
}

function displayGameOver() {
  if (isGameOver) {
    let text = didWin ? "You Win" : "Game Over";
    let textOffset = didWin ? 3 : 3.5;
    ctx.fillStyle = didWin ? "white" : "red";
    ctx.font = "70px Arial";
    ctx.fillText(text, canvas.width / textOffset, canvas.height / 2);
  }
}

function checkGameOver() {
  if (isGameOver) {
    return;
  }

  if (enemyBulletController.collideWith(spaceship)) {
    isGameOver = true;
    console.log("Game Over");
  }

  if (enemyController.collideWith(spaceship)) {
    isGameOver = true;
  }

  if (enemyController.enemyRows.y >= canvas.height) {
    isGameOver = true;
  }

  if (enemyController.enemyRows.length === 0) {
    didWin = true;
    isGameOver = true;
  }
}

setInterval(game, 1000 / 60);
