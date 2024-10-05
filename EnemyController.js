import Enemy from "./Enemy.js";
import Moves from "./Moves.js";

export default class EnemyController {
  enemyMap = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  enemyRows = [];

  currentDirection = Moves.right;
  xVelocity = 0;
  yVelocity = 0;
  defaultXVelocity = 1;
  defaultYVelocity = 1;
  moveDownTimerDefault = 30;
  moveDownTimer = this.moveDownTimerDefault;
  fireBulletTimerDefault = 100;
  fireBulletTimer = this.fireBulletTimerDefault;

  constructor(canvas, enemyBulletController, spaceshipBulletController) {
    this.canvas = canvas;
    this.enemyBulletController = enemyBulletController;
    this.spaceshipBulletController = spaceshipBulletController;
    this.createEnemies();
  }

  draw(ctx) {
    this.decrementMoveDownTimer();
    this.updateVelocityAndDirection();
    this.collisionCheck();
    this.drawEnemies(ctx);
    this.resetMoveDownTimer();
    this.fireBullet();
  }

  collisionCheck() {
    this.enemyRows.forEach((enemyRow) => {
      enemyRow.forEach((enemy, enemyIndex) => {
        if (this.spaceshipBulletController.collideWith(enemy)) {
          enemyRow.splice(enemyIndex, 1);
        }
      });
    });

    this.enemyRows = this.enemyRows.filter((enemyRow) => enemyRow.length > 0);
  }

  fireBullet() {
    this.fireBulletTimer--;
    if (this.fireBulletTimer <= 0) {
      this.fireBulletTimer = this.fireBulletTimerDefault;
      const enemies = this.enemyRows.flat();
      const enemyId = Math.floor(Math.random() * enemies.length);
      const shootingEnemy = enemies[enemyId];
      this.enemyBulletController.shoot(
        shootingEnemy.x + shootingEnemy.width / 2,
        shootingEnemy.y,
        -3
      );
    }
  }

  decrementMoveDownTimer() {
    if (
      this.currentDirection === Moves.downLeft ||
      this.currentDirection === Moves.downRight
    ) {
      this.moveDownTimer--;
    }
  }

  resetMoveDownTimer() {
    if (this.moveDownTimer <= 0) {
      this.moveDownTimer = this.moveDownTimerDefault;
    }
  }

  updateVelocityAndDirection() {
    for (const enemyRow of this.enemyRows) {
      if (this.currentDirection == Moves.right) {
        this.xVelocity = this.defaultXVelocity;
        this.yVelocity = 0;

        const rightEnemy = enemyRow[enemyRow.length - 1];
        if (rightEnemy.x + rightEnemy.width >= this.canvas.width) {
          this.currentDirection = Moves.downLeft;
          break;
        }
      } else if (this.currentDirection === Moves.downLeft) {
        if (this.moveDown(Moves.left)) {
          break;
        }
      } else if (this.currentDirection === Moves.left) {
        this.xVelocity = -this.defaultXVelocity;
        this.yVelocity = 0;
        const leftEnemy = enemyRow[0];
        if (leftEnemy.x <= 0) {
          this.currentDirection = Moves.downRight;
          break;
        }
      } else if (this.currentDirection === Moves.downRight) {
        if (this.moveDown(Moves.right)) {
          break;
        }
      }
    }
  }

  moveDown(newDirection) {
    this.xVelocity = 0;
    this.yVelocity = this.defaultYVelocity;
    if (this.moveDownTimer <= 0) {
      this.currentDirection = newDirection;
      return true;
    }
    return false;
  }

  drawEnemies(ctx) {
    this.enemyRows.flat().forEach((enemy) => {
      enemy.move(this.xVelocity, this.yVelocity);
      enemy.draw(ctx);
    });
  }

  createEnemies() {
    this.enemyMap.forEach((row, rowIndex) => {
      this.enemyRows[rowIndex] = [];
      row.forEach((enemyNumber, enemyIndex) => {
        if (enemyNumber > 0) {
          this.enemyRows[rowIndex].push(
            new Enemy(enemyIndex * 45, rowIndex * 30, enemyNumber)
          );
        }
      });
    });
  }

  collideWith(sprite) {
    return this.enemyRows.flat().some((enemy) => enemy.collideWith(sprite));
  }
}
