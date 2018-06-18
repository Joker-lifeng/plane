(function () {
  //实例化非常牛逼并且非常吊的场景管理器SceneManager，并将它暴露到全局
  var SceneManager = window.SceneManager = function () {
    //sceneNum代表了当前的场景：1是欢迎界面，2是开始游戏界面，3是GAMEOVER界面，3是GAMEOVER界面
    this.sceneNum = 1;
    this.planeicon = game.imgS.planeicon;
    //背景图
    this.background = game.imgS.background;
    //play按钮
    this.button_play = game.imgS.text;
    //定义飞机大战按钮宽高
    this.button_playW = 240;
    this.button_playH = 50;
    //play按钮的X坐标
    this.button_playX = (game.myCanvas.width - this.button_playW) / 2;
    //play按钮的Y坐标
    this.button_playY = (game.myCanvas.height - this.button_playH) / 2;
    //定义按钮的四条边
    this.button_playT = this.button_playY;
    this.button_playB = this.button_playY + this.button_playH;
    this.button_playL = this.button_playX;
    this.button_playR = this.button_playX + this.button_playW;
    //绑定事件监听
    this.bindEvent();

    // //定义logo的y坐标
    // this.logoY = -41;//logo从上面往下落


    //把管子背景鸟对象添加到game中介者对象中
    // game.bird = new Bird();
    // game.land = new Land();
    // game.backgroun = new Background();
    //实例化后就绑定点击事件
    this.bindEvent();
  };
  //场景管理器的更新方法
  SceneManager.prototype.update = function () {
    //对场景的编号进行switch判断
    switch (this.sceneNum) {
        //场景一要进行的渲染
      case 1:
        //渲染背景
        game.ctx.drawImage(this.background, 0, 0, this.background.width, this.background.height);
        //渲染开始游戏按钮
        game.ctx.drawImage(this.button_play, 0, 0, this.button_playW, this.button_playH, this.button_playX, this.button_playY, this.button_playW, this.button_playH);
        //绘制欢迎界面的飞机
        game.ctx.drawImage(this.planeicon, (game.myCanvas.width - this.planeicon.width) / 2, this.button_playY - 75, 48, 48);
        game.ctx.fillStyle = 'red';
        game.ctx.fillText("打飞机无敌版！点击开始游戏", 150, 260);


        break;
        //场景2的更新
      case 2:
        //每10帧实例化一个子弹
        if (game.fno % 5 === 0) {
          new Bullet();
        }
       //每20帧更新一个小敌机:难度控制
        if (game.fno % 50 ===0){
          new Enemy();
        }


        break;

    }
  };
  //场景管理器的渲染方法    //对场景的编号进行switch判断
  SceneManager.prototype.render = function () {

    switch (this.sceneNum) {
        //场景2要进行的渲染
      case 2:
        //渲染背景
        game.ctx.drawImage(this.background, 0, 0, this.background.width, this.background.height);
        //渲染飞机
        game.myplane.render();
        //for循环game的子弹数组渲染子弹
        for (var i = 0; i < game.bulletArr.length; i++) {
          //game.bulletArr[i]中有对象 才进行渲染和更新
          game.bulletArr[i] && game.bulletArr[i].update();
          game.bulletArr[i] && game.bulletArr[i].render();
        }
        //for循环game的enemy数组 渲染更新敌机
        for (var i = 0; i < game.enemyArr.length; i++) {
          //game.enemyArr[i]有对象 才进行渲染和更新
          game.enemyArr[i] && game.enemyArr[i].update();
          game.enemyArr[i] && game.enemyArr[i].render();
        }

        break;


    }
  };
  //enter方法在的执行会将SM对象的场景编号切换为实参，也就是执行enter方法都会切换方法，enter方法控制了切换场景，在enter方法中进行判断每个场景刚进入第一件事要干啥
  SceneManager.prototype.enter = function (num) {
    //只要这个方法被调用将场景编号变为调用这个函数时候的实参,那么就能改变场景
    this.sceneNum = num;
  };
  //场景管理器的监听事件，监听来切换场景,需要兼容手机端，那么就要绑定点击和touch时间
  SceneManager.prototype.bindEvent = function () {
    //canvas中是没有dom元素的，不能给img加监听，只能给canvas对象加监听
    var that = this;
    //绑定onclick
    game.myCanvas.onclick = function (e) {
      //click之后执行Eventhandler并把鼠标相对于canvas的坐标传参
      that.Eventhandler(e.offsetX, e.offsetY);
    };
    //绑定touchstart
    game.myCanvas.addEventListener("touchstart", function (e) {
      //touchstart之后执行Eventhandler并把触摸点相对于canvas的坐标传参
      that.Eventhandler(e.touches[0].offsetX, e.touches[0].offsetY);
    });
    //document页面绑定鼠标移动事件
    myCanvas.addEventListener("mousemove", function (e) {
      switch (that.sceneNum) {
          //判断如果是场景2，那么那飞机跟随鼠标
        case 2:
          //让飞机跟随鼠标
          // console.log(e.offsetX);
          game.myplane.imgX = e.offsetX - game.myplane.imgW / 2;
          game.myplane.imgY = e.offsetY - game.myplane.imgH / 2;

          if (game.myplane.imgX <= 0) {
            game.myplane.imgX = 0;
          }
          if (game.myplane.imgY <= 0) {
            game.myplane.imgY = 0;
          }
          if (game.myplane.imgX >= game.myCanvas.width - game.myplane.width + 30) {
            game.myplane.imgX = game.myCanvas.width - game.myplane.width + 30;
          }
          if (game.myplane.imgY >= myCanvas.height - game.myplane.imgH) {
            game.myplane.imgY = myCanvas.height - game.myplane.imgH;

          }
          break;


      }
    });
  };
  //事件处理方法:点击或者触摸后要干嘛
  SceneManager.prototype.Eventhandler = function (mouseX, mouseY) {
    var that = this;
    //鼠标点击处理事件，判断sceneNum，在哪个场景
    switch (this.sceneNum) {
        //场景2要进行的鼠标点击判断，就是判断进入游戏按钮
      case 1:
        //判断点击的位置是否在开始游戏按钮中
        if (mouseX >= this.button_playL && mouseX <= this.button_playR && mouseY >= this.button_playT && mouseY <= this.button_playB) {
          //如果判定点击了 调用enter进入场景2
          that.enter(2);
        }
        break;
        //场景2要进行鼠标点击判断
      case 2:

        break;

    }

  };
  // SceneManager.prototype.textenter = function () {
  //
  //   if (game.fno > 100) {
  //     game.ctx.save();
  //     game.ctx.fillStyle = bg3();
  //     game.ctx.fillText(this.text0, game.txtfno, 90);
  //     game.ctx.restore();
  //   }
  //
  //   if (game.fno > 300) {
  //     game.ctx.save();
  //     game.ctx.fillStyle = bg3();
  //     game.ctx.fillText(this.text1, game.txtfno + 150, 155);
  //     game.ctx.restore();
  //   }
  //   if (game.fno > 700) {
  //     game.ctx.save();
  //     game.ctx.fillStyle = "purple";
  //     game.ctx.fillText(this.text2, game.txtfno + 400, myCanvas.height * 0.78 + 50);
  //     game.ctx.restore();
  //   }
  //   if (game.fno > 1000) {
  //     game.ctx.save();
  //     game.ctx.fillStyle = "darkred";
  //     game.ctx.fillText(this.text3, game.txtfno + 570, 290);
  //     game.ctx.restore();
  //   }
  // }

})();
