(function (win) {

  var defaultOption = {
    el: '#canvas',
    width: window.innerWidth,
    height: window.innerHeight
  }

  function extend(taget, obj) {
    for (var key in obj) {
      taget[key] = obj[key];
    }
    return taget;
  }

  function Stage(opt) {
    this.config = extend(defaultOption, opt);
    this.canvas = document.querySelector(this.config.el);
    this.canvas.width = this.config.width;
    this.canvas.height = this.config.height;
    this.ctx = this
      .canvas
      .getContext('2d');
    this.timer = null;
    this.shapes = [];

    this.currentShape = null;
    // this.init();

  }
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
  Stage.prototype = {
    constructor: Stage,
    addShape: function () {
      /**
       *
       *  addShape(shape1,shape2,shape3)
       *
       *
       *  addShape([shoape1,shape2,shape3],[shoape1,shape2,shape3])
       *
       *
       */
      var _self = this;
      var arg = arguments;
      (function (a) {
        var _me = arguments.callee;
        []
          .slice
          .call(a)
          .forEach(function (item, index) {
            if (item instanceof Array) {
              _me(item);
            } else {
              _self
                .shapes
                .push(item);
            }
          })
      }(arg));
      // for(var i =0 ;i=)
    },
    start: function () {
      this
        .ctx
        .clearRect(0, 0, this.width, this.height);
      for (var i = 0; i < this.shapes.length; i++) {
        console.log(this.shapes[i], 'jalkdsfjklj');
        this
          .shapes[i]
          .draw(this.ctx);
      }
    },
    getEventPos: function (e) {
      return {x: e.clientX, y: e.clientY}
    },
    hasSelect: function (curPos, shape) {
      // 圆
      if (shape instanceof Shape.Circle) {
      
        var curx = curPos.x,
          cury = curPos.y,
          x = shape.x,
          y = shape.y,
          r = shape.r;
        // console.log(arguments);
        console.table(
          {
            'x下限':x-r,
            'x上限':x+r,
            'y下限':y-r,
            'y上限':y+r,

            '当前x':curx,
            '当前y':cury

          }
        )
        if (((curx > (x - r)) && (curx <( x + r))) && ((cury >( y - r)) && (cury < (y + r)))) {
          return true;
        } else {
          return false;
        }
      }

    },
    on: function (type, handle) {
      var _self = this;
      var ctx = this.ctx;
      var canvas = this.canvas;
      var shapes = this.shapes;
      this
        .canvas
        .addEventListener(type, function (ev) {
          var pos = _self.getEventPos(ev);
          for (var i = 0; i < shapes.length; i++) {
            if (_self.hasSelect(pos, shapes[i])) {
              _self.currentShape = shapes[i];
              

              
              console.log('选中了形状',shapes[i]);
              handle.call(_self.currentShape, _self.currentShape, _self);
              break;
            }
          }

         
        });
    }
  }

  Stage.Draw = Draw;

  win.Stage = Stage;
}(window));