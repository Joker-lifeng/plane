//采用中介者模式 ,Game对象统领其他所有对象演员：Langd,background,Pipe,bird,

//获取canvas元素
var myCanvas = document.getElementById("canvas1");
if (myCanvas.getContext) {
  //IE低版本的兼容不至于BOOM！
  var ctx = myCanvas.getContext("2d");
}

////不怂 ！上来直接就是一个IIFE，直接就是干，将Game类暴露到全局，game游戏开始再实例化他的子对象
(function() {
  //定义Game类构造函数
  var Game = (window.Game = function(CanvasElement) {
    //获取canvas和画笔ctx上下文,游戏的绘画canvas都是通过game对象的属性canvas来绘画
    this.myCanvas = CanvasElement;
    this.ctx = this.myCanvas.getContext("2d");
    //保存this指向
    var that = this;
    //得到图片资源的类数组 保存了图片img对象
    this.imgS = {};
    this.speed = 0; //游戏速度
    //game对象的分数定义
    this.score = 789;
    //game对象的生命值
    this.life = 0;
    this.fno = 0; //设置帧编号
    this.bulletArr = []; //子弹数组
    this.enemyArr = []; //敌机数组
    //游戏的启动都要等imgsLoad执行结束，图片资源加载完毕，才会执行实参中回调函数(让图片资源加载完毕事件来驱动)：也就是启动游戏和绑定点击事件
    this.imgsLoad(function() {
      //图片加载完成onload要执行start方法
      console.log(456);
      that.start();
    });
  });

  //图片加载事件：全部加载完成再执行游戏初始化game.init（）,因为图片的载入是异步意见，所以要添加载入完成事件
  Game.prototype.imgsLoad = function(callback) {
    var that = this;
    //这里是图片的资源，需要改的话改name 和 src，新增直接写在数组
    this.imgArr = [
      { name: "background", src: "images/bk.png" },
      { name: "big", src: "images/big.png" },
      { name: "bossbullet", src: "images/bossbullet.png" },
      { name: "bossplane", src: "images/bossplane.png" },
      { name: "myplane", src: "images/myplane.png" },
      { name: "small", src: "images/small.png" },
      { name: "text", src: "images/text.png" },
      { name: "planeicon", src: "images/planeicon.png" },
      { name: "play", src: "images/play.png" },
      { name: "bullet", src: "images/bullet.png" },
      { name: "bullet2", src: "images/bullet2.png" },
      { name: "myplaneexplosion", src: "images/myplaneexplosion.png" },
      { name: "bossplanebomb", src: "images/bossplanebomb.png" }
    ];
    this.scoreArr = {
      num0: 0,
      num1: 120 / 10,
      num2: (120 / 10) * 2,
      num3: (120 / 10) * 3,
      num4: (120 / 10) * 4,
      num5: (120 / 10) * 5,
      num6: (120 / 10) * 6,
      num7: (120 / 10) * 7,
      num8: (120 / 10) * 8,
      num9: (120 / 10) * 9
    };
    this.lifeArr = {
      num0: 0,
      num1: 120 / 10,
      num2: (120 / 10) * 2,
      num3: (120 / 10) * 3,
      num4: (120 / 10) * 4,
      num5: (120 / 10) * 5,
      num6: (120 / 10) * 6,
      num7: (120 / 10) * 7,
      num8: (120 / 10) * 8,
      num9: (120 / 10) * 9
    };

    var imglodCount = 0; //每一张图片载入完成就++，信号量的判断
    //入口函数判断图片是否 全部加载完成
    for (var i = 0; i < this.imgArr.length; i++) {
      var imgname = this.imgArr[i].name;
      // var newImg = new Image();
      // newImg.src = this.imgArr[i].src;
      //给Game构造函数的imgS属性里面添加遍历到的图片img对象
      this.imgS[imgname] = new Image();
      this.imgS[imgname].src = this.imgArr[i].src;
      //绑定图片载入完成事件
      this.imgS[imgname].onload = function() {
        imglodCount++;
        // console.log(imglodCount);
        that.ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
        var txt = "资源载入中" + imglodCount + "/" + that.imgArr.length;
        that.ctx.font = "oblique small-caps bold 14px Arial";
        that.ctx.fillText(txt, myCanvas.width / 2 - 30, myCanvas.height / 2);
        if (imglodCount == that.imgArr.length) {
          console.log("图片加载完毕");
          callback(); //图片加载完毕执行回调函数：游戏开始start方法
        }
      };
    }
  };
  //game类的启动游戏方法
  Game.prototype.start = function() {
    console.log("游戏开始");
    var that = this; //保存this指向
    //game对象作为中介统领全局对象这些对象都是game对象的实例都通过game对象来通信，图片载入完成触发游戏start函数那么才实例化这些对象
    //实例化SceneManager场景管理器对象!!!!!!!!!!
    this.SM = new SceneManager();
    //实例化my飞机
    this.myplane = new Myplane();
    //实例化敌机
    this.enemy = new Enemy();
    //实例化boss敌机
    this.bossplane = new Bossplane();

    //定时器开启，开始不断更新渲染游戏场景
    this.timer = setInterval(function() {
      //帧编号++  ,帧编号决定了多少时间刷新一个敌机
      that.fno++;
      //定时器每次清除画布canvas
      that.ctx.clearRect(0, 0, 1000, 1000);
      //场景管理器的更新然后渲染
      that.SM.update();
      that.SM.render();
      //渲染帧时间FON信息还有另外一些信息
      that.ctx.font = "16px consolas";
      that.ctx.fillStyle = "black";
      that.ctx.beginPath();
      that.ctx.fillText("FNO:" + that.fno, 0, 18);
    }, 20);
  };

  //定义一个得分计算的渲染的方法
  Game.prototype.scoreGet = function() {
    //打印得分
    //将分数数字转成字符串,这样就能取得分数字符串的长度，比如1234，长度是4，咱for循环这个长度,把每一位数字进行打印
    var score = game.score.toString();
    //for循环 进行图片的打印,有一根基准中心对准线，myCanvas.width / 2 - score.length / 2 * 间隔
    for (let i = 0; i <= score.length; i++) {
      game.ctx.save();
      //打印哪个数字？charAt() 方法可返回指定位置的字符。,搜索出来的i位置的数字进行字符串拼接得到imgs数组中的数字图片就能for循环打印分数了
      //数字打印的起点是中轴线，canvas中轴线就是 myCanvas.width /2,中轴线需要根据数字的长度来进行计算，得分长度 /2 就能得到偶数或者奇数，再乘以34也就是间隔，就能得到第一张图片要位移的距离，第二张图片的移动距离要 加上 for循环的i变量*34
      var inx = score.charAt(i); //charset搜索字符串中数字
      var a = game.ctx.drawImage(
        game.imgS["score"],
        game.scoreArr["num" + inx], //X从哪截取
        0, //Y从哪开始截取
        game.imgS["score"].width / 10, //截取的宽
        game.imgS["score"].height, //截取的高
        myCanvas.width - (score.length / 2) * 30 + i * 14,
        myCanvas.height - 18,
        game.imgS.score.width / 10,
        game.imgS.score.height
      );
      game.ctx.restore();
    }
  };

  //IIFE结束口括号处，语句请写在口号里面
})();
////////////////
//整个游戏的总开关：实例化游戏对象game
if (myCanvas.getContext) {
  var game = new Game(document.getElementById("canvas1"));
}
