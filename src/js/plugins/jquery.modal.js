;
(function ($) {


  // 默认选项
  var defaultOption = {
    mark: true, //是否需要 遮罩层
    title: '标题', //标题
    content: '', //内容
    btns: [],
    btnCallbacks: null,
    template: null,
    clickIsAutoClose: true,
    doneCallback:null,
    //模板  字符串 模板id
  }


  function Modal(option) {
    if (!(this instanceof Modal)) {
      return new Modal(option);
    }
    this.opt = $.extend({}, defaultOption, option); //拷贝合并对象
    this.modal = $('<div class="modal">');
    this.mark = $('<div class="modal-mark">');
    this.content = $('<div class="modal-content">');
    this.header = $('<div class="modal-header">');
    this.title = $('<h4 class="modal-title">');
    this.close = $('<span class="modal-close">&times;</span>');
    this.body = $('<div class="modal-body">');
    this.footer = $('<div class="modal-footer">');

    this.template = this._getTemplte();
    console.log(this.template);


    this.init();
  }

  // 每一个函数只做一件事
  Modal.prototype = {
    constructor: Modal,

    /**
     * 初始化模态框
     * 拼接dom结构，在插入到dom结构中
     */
    init: function () {
      this._markInit();
      this._contentInit();
      this.modal.append(this.content)
      if (this.opt.btnCallbacks && this.opt.btns) {
        this.opt.btnCallbacks(this.modal.find('.modal-btn'), this.body, this._closeModal.bind(this));
      }
      this._apppendDom();
      this.opt.doneCallback&& this.opt.doneCallback(this.body);
    },
    _markInit: function () {
      var _self = this;
      if (this.opt.mark) {
        this.modal.append(this.mark);
      }
      this._clickClose('.modal-mark');
    },
    _headerInit: function () {
      this.title.html(this.opt.title).appendTo(this.header);
      this.close.html('&times;').appendTo(this.header);
      this._clickClose('.modal-close');
      this.header.appendTo(this.content);
    },
    _bodyInit: function () {
      var content = this.template ? this.template : this.opt.content;
      this.body.html(content).appendTo(this.content);
    },
    _footerInit: function () {
      var _self = this;
      if (this.opt.btns) {
        $.each(this.opt.btns, function (index, item) {
          _self.footer.append(_self._createBtn(item));
        });
        this.footer.appendTo(this.content);
      }



    },
    _contentInit: function () {
      this._headerInit();
      this._bodyInit();
      this._footerInit();
    },

    on: function () {
      // 使用事件委托添加事件
      this.modal.on.apply(this.modal, arguments);
    },

    _closeModal: function () {
      this.modal.fadeOut(function () {
        $(this).remove();
      })
    },
    _clickClose: function (select) {
      var _self = this;
      this.on('click', select, function () {
        // console.log('mark 关闭')
        _self._closeModal();

      })
    },
    _getTemplte: function () {
      return $('script[modal-template="' + this.opt.template + '"]').html();
    },

    /**
     * 创建按钮
     */
    _createBtn: function (val) {
      if (this.opt.clickIsAutoClose) {
        this._clickClose('.modal-btn');
      }
      return $('<button class="modal-btn">').html(val);
    },

    _apppendDom: function () {
      var _self = this;
      this.modal.appendTo('body');
      this.mark.fadeIn(function () {
        _self.content.animate({
          top: '10%',
          opacity: 1
        })
      })
    },

  }



  //静态方法
  // Modal.alert = function (option) {
  //   return Modal(option);
  // }
  // Modal.confirm = function (option) {
  //   return Modal(option);
  // }
  // Modal.prompt = function (option) {
  //   return Modal(option);
  // }

  $.modal = {
    alert: function (option) {
      if ($.type(option) === 'string') {
        return Modal({
          mark: false,
          title: '警告',
          content: option,
          btns: ['确定']
        })
      }
    },
    confirm: function (question) {
      // return Modal.confirm(option);
      var def = $.Deferred();
      Modal({
        mark: false,
        content: question,
        btns: ['确定', '取消'],
        btnCallbacks: function (btns) {
          btns.eq(0).on('click', function () {
            def.resolve(true);
          })
          btns.eq(1).on('click', function () {
            def.reject(false);
          })
        }
      });
      return def;
    },
    prompt: function (option) {
      var def = $.Deferred();
      var input = $('<input class="modal-prompt" type="text">')
      Modal({
        mark: false,
        content: input,
        btns: ['确定', '取消'],
        btnCallbacks: function (btns, body) {
          btns.eq(0).on('click', function () {
            var val = body.find('.modal-prompt').val();
            def.resolve(val);
          })
          btns.eq(1).on('click', function () {
            def.reject('');
          })
        }
      });
      return def;
    },
    // 底层  自定义
    base: function (option) {
      return Modal(option);
    }
  };
}(jQuery));