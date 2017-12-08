;
(function (win) {

  function ran(num) {
    return num
      ? Math.random() * num
      : Math.random();
  }

  function Circle(winWidth, winHeight) {
    this.x = ran(winWidth || window.innerWidth);
    this.y = ran(winHeight || window.innerHeight);
    this.r = ran(10);
    this.vx = ran(10);
    this.vy = ran(10);
    this.color = 'red'
  }

  Circle.prototype = {
    constructor: Circle,
    draw: function (ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, 360);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
    },
    update: function (ctx) {
      var canvasWidth = ctx.canvas.width,
        canvasHeight = ctx.canvas.height;
      if (this.x > (canvasWidth - this.r) || this.x < this.r) {
        this.vx = -this.vx;
      }

      if (this.y > (canvasHeight - this.r) || this.y < this.r) {
        this.vy = -this.vy;
      }

      this.x += this.vx;
      this.y += this.vy;

    },
    drawLine: function (ctx, nextCircle) {
      var d = 100;
      var x = nextCircle.x - this.x;
      var y = nextCircle.y - this.y;
      var result = Math.sqrt(x * x + y * y);
      if (result < d) {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(nextCircle.x, nextCircle.y);
        ctx.strokeStyle = Mock
          .Random
          .color();
        ctx.stroke();
        ctx.closePath();
      }
    }

  }

  win.Shape = {
    Circle: Circle,
    addShape: function (shapeName, shapeConstructor) {
      this[shapeName] = shapeConstructor;
    }
  }

}(window));