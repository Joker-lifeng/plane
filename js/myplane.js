//定义玩家飞机的构造函数
(function() {
  var Myplane = (window.Myplane = function() {
    //从game对象的imgs数组中得到飞机的图片
    this.img = game.imgS.myplane;
    //飞机图片的宽高
    this.imgW = this.img.width / 2;
    this.imgH = this.img.height;
    //飞机的出现位置
    this.imgX = (game.myCanvas.width - this.imgW) / 2;
    this.imgY = game.myCanvas.height - 85;
    //飞机的存活状态
    this.alive = true;
  });
  //飞机的渲染方法
  Myplane.prototype.render = function() {
    //绘制飞机
    game.ctx.drawImage(
      this.img,
      0,
      0,
      this.imgW,
      this.imgH,
      this.imgX,
      this.imgY,
      this.imgW,
      this.imgH
    );
  };


  Myplane.prototype.update = function() {

  };

  Myplane.prototype.bindMouse = function() {
   
  };
})();
