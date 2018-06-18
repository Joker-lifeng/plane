//敌人的飞机构造函数
(function () {
  var Enemy = window.Enemy = function () {
    //获得敌机的图片
    this.img = game.imgS.small;
    //敌机的大小
    this.width = this.img.width;
    this.height = this.img.height / 3;
    //敌机的坐标x y     从屏幕上方出现，x 随机
    this.x = getRandom(34, myCanvas.width - this.width);
    this.y = getRandom(-this.height, -this.height * 4);
    this.speed = 2;  //敌机的速度
    this.boom = this.height;  //爆炸状态1
    this.boom2 = this.height * 2;//爆炸状态2
    this.alive = true; //是否活着
    this.life = 0; //死亡后的生命周期
    game.enemyArr.push(this); //敌机一旦实例化push到game的敌机数组中，让场景管理器来负责循环渲染更新敌机

  };
  //渲染敌机
  Enemy.prototype.render = function () {
   //如果活着才渲染飞机
    if (this.alive) {
      game.ctx.drawImage(this.img, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height);
    }
  };
//更新敌机
  Enemy.prototype.update = function () {
  //如果活着Y坐标+速度
    if (this.alive) {
      //敌机的y坐标的移动
      this.y += this.speed;
    } else if (this.alive === false) {  //如果死了，Y坐标保持不变，那么死了也存货45帧的生命周期，在生命周期内三个阶段：爆炸图1 爆炸图2，从数组中删除自己
      this.y = this.y;  //死了Y坐标不再移动
      this.life++;  //开始计时死亡后的生命周期 生命周期++
      //判断生命周期
      if (this.life < 25) {
        //25以下的生命周期死亡状态渲染爆炸图片状态1
        game.ctx.drawImage(this.img, 0, this.boom, this.width, this.height, this.x, this.y, this.width, this.height);
      } else if (this.life < 45) {
        //生命周期2的图片
        game.ctx.drawImage(this.img, 0, this.boom2, this.width, this.height, this.x, this.y, this.width, this.height);
      }else if (this.life > 45){
        //生命周期大于30了，for循环从enemy数组中删除自己
        for (let k = 0; k < game.enemyArr.length; k++) {
          if (game.enemyArr[k] === this) {
            game.enemyArr.splice(k, 1)
          }
        }
      }

    }

    //防止内存泄露：如果敌机的y坐标大于mycanvas的高 + 30那么从game的bulletArr中删除自己，并再次实例化一个敌机
    if (this.y > myCanvas.height + 30) {
      for (let i = 0; i < game.enemyArr.length; i++) {
        if (game.enemyArr[i] === this) {
          game.enemyArr.splice(i, 1)
          //如果飞机出了屏幕那么再刷新一个
          new Enemy();
        }
      }
    }
    //子弹碰撞检测
    //敌机的碰撞检测线四条线的定义
    this.B = this.y + this.height;
    this.L = this.x;
    this.R = this.x + this.width;
    this.T = this.y;
//循环子弹数组，拿自己的碰撞盒去判断是否和子弹接触
    for (let i = 0; i < game.bulletArr.length; i++) {
      // console.log(game.bulletArr[i].T);
      if (game.bulletArr[i].T < this.B && game.bulletArr[i].R > this.L && game.bulletArr[i].L < this.R && game.bulletArr[i].B < this.T) {
        //死亡状态变为死亡，进入死亡生命周期
        this.alive = false;
        //删除子弹
        game.bulletArr.splice(game.bulletArr[i],1);

      }
    }


  };


})();