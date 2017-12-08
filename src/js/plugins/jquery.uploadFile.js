define('uploadFile', function (require, exports, module) {
  var $ = require('jquery');
  var imgReg = /image\/(?:png|jpe?g|git|svg)/;
  $(document).on('drop', function (event) {
    event.preventDefault();
  })
  $(document).on('dragover', function (event) {
    event.preventDefault();
  })
  var defaultOption = {
    el: ''
  };

  function UploadFile(option) {
    this.config = $.extend(defaultOption, option);
    this.inputFile = $(this.config.el);
    this.thumbDom = this.config.thumb ? $(this.config.thumb) : null;
    this.url = this.config.url;
    this.files = [];
    var _self = this;

    this.inputFile.on('change', function (event) {
      var files = this.files;
      for (var i = 0; i < files.length; i++) {
        _self.addFile(files[i]);
      }

      _self._init();

    });


    if (this.config.drop) {
      this.thumbDom.on('drop', function (event) {
        var files = event.originalEvent.dataTransfer.files;
        for (var i = 0; i < files.length; i++) {
          _self.addFile(files[i]);
        }
        _self._init();
      })
    }
  }
  UploadFile.prototype = {
    constructor: UploadFile,
    addFile: function (file) {
      // console.log(file);
      var size = (file.size / 1024).toFixed(2); //kb;
      console.log(size);
      if (size > this.config.maxsize) {
        alert(file.name + '的大小太大了，超出了范围：' + this.config.maxsize + 'kb');
        return;
      } else {
        this.files.push(file);
      }

    },
    createImage: function (src) {

      var $image = $('<img>').attr('src', src).addClass('picute');
      console.log($image);
      $image.load(function () {
        var w = this.width,
          h = this.height;
        if (w > h) {
          $image.addClass('transform-x');
        }
        if (w < h) {
          $image.addClass('transform-y');
        }
      });

      return $('<figute>').addClass('thumb-img').append($image).get(0);
    },
    start: function () {
      var formData = new FormData();
      var files = this.files;
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        formData.append('upload', file);
      }

      this._upload(formData)

    },
    _upload: function (data) {
      var _self = this;
      var xhr = new XMLHttpRequest();
      xhr.open('post', this.url);

      xhr.upload.onprogress = function (e) {
        var cur = e.loaded; //当前上传的量
        var total = e.total; //总的量
        _self.config.progress &&
          _self.config.progress(cur, total);

      }
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 2) {
          _self.config.beforeSend &&
            _self.config.beforeSend(_self, xhr);
        }
        if (xhr.status === 200 && xhr.readyState === 4) {
          _self.config.done &&
            _self.config.done(xhr.responseText, _self, xhr);
        }
        console.log('====================================');
        console.log(xhr.status);
        console.log('====================================');
        if (xhr.readyState === 0) {
          console.log('错误')
        }
      }
      xhr.send(data);
    },
    _init: function () {
      var _self = this;
      _self.thumbDom.html('');

      $.each(_self.files, function (index, file) {

        if (_self.thumbDom) {
          var url = window.URL.createObjectURL(file);
          var image = _self.createImage(url);
          _self.thumbDom.append(image);
        }
      })
    }
  }


  module.exports = function (option) {
    return new UploadFile(option);
  }

})