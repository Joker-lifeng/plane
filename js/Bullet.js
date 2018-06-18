//子弹的构造函数
(function() {
  var Bullet = (window.Bullet = function() {
    //子弹图片
    this.img = game.imgS.bullet;
    //子弹的宽高 X  Y坐标
    this.height = this.img.height;
    this.width = this.img.width;
    this.x = game.myplane.imgX + game.myplane.imgW / 2 - 5; //子弹的X坐标就是sm对象的飞机坐标
    this.y = game.myplane.imgY;
    this.speed = 20;
    this.alive = true;
    game.bulletArr.push(this);
  });
  //子弹的渲染
  Bullet.prototype.render = function() {
    this.alive &&
      game.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  };
  //子弹的更新
  Bullet.prototype.update = function() {
    //子弹Y坐标 - 速度
    this.y -= this.speed;
    //如果子弹的y坐标小于-20那么从game的bulletArr中删除自己
    if (this.y < -20) {
      for (let i = 0; i < game.bulletArr.length; i++) {
        if (game.bulletArr[i] === this) {
          game.bulletArr.splice(i, 1);
        }
      }
    }
    //子弹的碰撞检测线
    this.B = this.y + this.height;
    this.L = this.x;
    this.R = this.x + this.width;
    this.T = this.y;
  };
})();
