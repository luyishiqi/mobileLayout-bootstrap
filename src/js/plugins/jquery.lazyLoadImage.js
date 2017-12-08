;
(function ($, win) {

  /**
   * 防抖函数
   * @param {*} fn
   * @param {*} time
   */
  function throoe(fn, time) {
    var _startTime = Date.now();
    var time = time || 500;
    return function () {
      var _endTime = Date.now();
      if (_endTime - _startTime < time) {
        return;
      }
      fn.apply(null, arguments);
      _startTime = _endTime;
    }
  }

  /**
   * 判断图片是否在可视区域内
   */
  function isSee(image) {
    var winH = $(win).height();
    var top = image.getBoundingClientRect().top;
    return top<winH;
  }

  /**
   * 加载真正的图片
   */
  function setImageSource(image) {
    var src = $(image).attr('asrc');
    $(image).attr('src', src);
  }

  /**
   * 懒加载主函数
   */
  function lazyLoadImage(images) {
    images
      .each(function (index, item) {
        if (isSee(item)) {
          setImageSource(item);
        }
      })
  }

  $.fn.lazyLoadImage = function () {
    // return this.each(function(index,item){ })
    var $images = $('.lazy-load-image[asrc]');
    lazyLoadImage($images);
    $(win).scroll(throoe(function () {
      lazyLoadImage($images);
    }))
    return this;
  }
}(jQuery, window));