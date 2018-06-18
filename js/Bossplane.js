(function() {
  //BOSS敌机的构造函数
  var Bossplane = (window.Bossplane = function() {
    //boss机图片
    this.img = game.imgS.bossplane;
    //BOSS机爆炸图片
    this.bossplanebomb = game.imgS.bossplanebomb;
    this.boomH = this.bossplanebomb.height / 5;
    //敌机的大小
    this.width = this.img.width;
    this.height = 212;
    //敌机的坐标x y     从屏幕上方出现，x 随机
    this.x = getRandom(this.width, myCanvas.width - this.width);
    this.y = -this.height;
    this.speed = 2; //敌机的速度
    this.alive = true;
    this.life = 0;
    this.boom = this.boomH * 2; //爆炸状态1
    this.boom2 = this.boomH * 3; //爆炸状态2
    this.health = 15;
    //实例化后将自己push到game。enemyArr数组
    game.enemyArr.push(this);
  });
  //boss敌机的渲染
  Bossplane.prototype.render = function() {
    //alive活着才渲染
    if (this.alive) {
      game.ctx.drawImage(
        this.img,
        0,
        0,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
  };
  //boss敌机的更新
  Bossplane.prototype.update = function() {
    //对死亡状态进行判定以及验收
    if (this.alive) {
      //活着的话那么改变Y值
      //敌机的y坐标的移动
      this.y += this.speed;
    } else if (this.alive === false) {
      this.y = this.y; //死了Y坐标不再移动
      this.life++; //生命周期++

      //判断生命周期
      if (this.life < 25) {
        //30以下的生命周期死亡状态渲染爆炸图片状态
        game.ctx.drawImage(
          this.bossplanebomb,
          0,
          this.boom,
          this.width,
          this.height,
          this.x,
          this.y,
          this.width,
          this.height
        );
      } else if (this.life < 45) {
        //生命周期2的图片
        game.ctx.drawImage(
          this.bossplanebomb,
          0,
          this.boom2,
          this.width,
          this.height,
          this.x,
          this.y,
          this.width,
          this.height
        );
      } else if (this.life > 45) {
        //生命周期大于30了，for循环从enemy数组中删除自己,并且再创建一个boss敌机
        for (let k = 0; k < game.enemyArr.length; k++) {
          if (game.enemyArr[k] === this) {
            game.enemyArr.splice(k, 1);
            new Bossplane();
          }
        }
      }
    }

    //如果敌机的y坐标大于mycanvas的高 + 30那么从game的bulletArr中删除自己
    if (this.y > myCanvas.height + 30) {
      for (let i = 0; i < game.enemyArr.length; i++) {
        if (game.enemyArr[i] === this) {
          game.enemyArr.splice(i, 1);
          //如果飞机出了屏幕那么再刷新一个
          new Bossplane();
        }
      }
    }

    //子弹碰撞检测
    //敌机的碰撞检测线
    this.B = this.y + this.height;
    this.L = this.x;
    this.R = this.x + this.width;
    this.T = this.y;

    //遍历子弹数组判断子弹是不是和自己碰撞
    for (let i = 0; i < game.bulletArr.length; i++) {
      // console.log(game.bulletArr[i].T);
      if (
        game.bulletArr[i].T < this.B &&
        game.bulletArr[i].R > this.L &&
        game.bulletArr[i].L < this.R
      ) {
        this.health--; //boss机的生命--
        //删除子弹
        game.bulletArr[i].alive = false;
        game.bulletArr.splice(game.bulletArr[i], 1);
      }
    }
    //如果生命值变为0，那么变成死亡状态
    if (this.health == 0) {
      //死亡状态变为死亡
      this.alive = false;
    }
  };
})();
