import Bullet from "./Bullet.js";

export default class BulletController {
  bullets = [];
  bulletGap = 0;

  constructor(canvas, maxBulletsQuantity, bulletColor) {
    this.canvas = canvas;
    this.maxBulletsQuantity = maxBulletsQuantity;
    this.bulletColor = bulletColor;
  }

  draw(ctx) {
    this.bullets = this.bullets.filter(
      (bullet) =>
        bullet.y + bullet.width > 0 &&
        bullet.y + bullet.width < this.canvas.height
    );

    this.bullets.forEach((bullet) => bullet.draw(ctx));
    if (this.bulletGap > 0) {
      this.bulletGap--;
    }
  }

  collideWith(sprite) {
    const bulletHitSpriteId = this.bullets.findIndex((bullet) =>
      bullet.collideWith(sprite)
    );

    if (bulletHitSpriteId >= 0) {
      this.bullets.splice(bulletHitSpriteId, 1);
      return true;
    }

    return false;
  }

  shoot(x, y, velocity, bulletGap = 0) {
    if (this.bulletGap <= 0 && this.bullets.length < this.maxBulletsQuantity) {
      const bullet = new Bullet(this.canvas, x, y, velocity, this.bulletColor);
      this.bullets.push(bullet);
      this.bulletGap = bulletGap;
    }
  }
}
