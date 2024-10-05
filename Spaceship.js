export default class Spaceship {
  leftPressed = false;
  rightPressed = false;
  shootPressed = false;

  constructor(canvas, velocity, bulletController) {
    this.canvas = canvas;
    this.velocity = velocity;
    this.bulletController = bulletController;

    this.x = canvas.width / 2 - 22.5;
    this.y = canvas.height - 52;

    this.width = 45;
    this.height = 43;

    this.image = new Image();
    this.image.src = "images/ship-small.png";

    document.addEventListener("keydown", this.keydown);
    document.addEventListener("keyup", this.keyup);
  }

  draw(ctx) {
    this.move();
    this.collide();
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    this.shoot();
  }

  shoot() {
    if (this.shootPressed) {
      console.log("shoot");
      const bulletSpeed = 4;
      const bulletGap = 6;
      const bulletX = this.x + this.width / 2;
      const bulletY = this.y;
      this.bulletController.shoot(bulletX, bulletY, bulletSpeed, bulletGap);
    }
  }

  collide() {
    if (this.x < 0) {
      this.x = 0;
    }

    if (this.x > this.canvas.width - this.width) {
      this.x = this.canvas.width - this.width;
    }
  }

  move() {
    if (this.rightPressed) {
      this.x += this.velocity;
    } else if (this.leftPressed) {
      this.x += -this.velocity;
    }
  }

  keydown = (event) => {
    if (event.code == "ArrowRight") {
      this.rightPressed = true;
    }
    if (event.code == "ArrowLeft") {
      this.leftPressed = true;
    }
    if (event.code == "Space") {
      this.shootPressed = true;
    }
  };
  keyup = (event) => {
    if (event.code == "ArrowRight") {
      this.rightPressed = false;
    }
    if (event.code == "ArrowLeft") {
      this.leftPressed = false;
    }
    if (event.code == "Space") {
      this.shootPressed = false;
    }
  };
}
