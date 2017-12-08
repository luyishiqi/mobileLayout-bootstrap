;
(function (win) {
  function Draw(canvas) {
    if (!(this instanceof Draw)) {
      return new Draw(canvas);
    }
    var c = null;
    if (canvas.nodeType) {
      c = canvas;
    }
    if (typeof canvas === 'string') {
      c = document.querySelector(canvas);
    }
    this.ctx = c.getContext('2d');
  }
  Draw.prototype.start = function (x, y) {
    this
      .ctx
      .beginPath();
    this
      .ctx
      .moveTo(x, y);
    return this;
  }
  Draw.prototype.to = function (x, y) {
    this
      .ctx
      .lineTo(x, y);
    return this;
  }
  Draw.prototype.end = function (type) {
    if (type === 'fill') {
      this
        .ctx
        .fill();
    }
    if (type === 'stroke') {
      this
        .ctx
        .stroke();
    }
    this
      .ctx
      .closePath();
  }
  Draw.prototype.fill = function (style) {
    style && (this.ctx.fillStyle = style);
    this.end('fill');
    return this;
  }
  Draw.prototype.stroke = function (style) {
    style && (this.ctx.strokeStyle = style);
    this.end('stroke');
    return this;
  }
  Draw.prototype.rect = function (x, y, w, h) {
    this
      .start(x, y)
      .to(x + w, y)
      .to(x + w, y + h)
      .to(x, y + h)
      .to(x, y);
    return this;
  }
  Draw.prototype.circle = function (x, y, r) {
    this
      .ctx
      .beginPath();
    this
      .ctx
      .arc(x, y, r, 0, 360);
    return this;
  }
  Draw.prototype.square = function (x, y, w) {
    return this.rect(x, y, w, w);
  }
  win.Draw = Draw;
}(window));