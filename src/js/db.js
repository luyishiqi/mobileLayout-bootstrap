(function (win) {
  // 本地存储   local
  win.cookiedb = {
    
  }
  win.localdb = {
    set: function (key, data) {
      localStorage.setItem(key, JSON.stringify(data));
    },
    get: function (key) {
      return JSON.parse(localStorage.getItem(key));
    },
    del: function (key) {
      localStorage.removeItem(key);
    },
    clear: function () {
      localStorage.clear();
    }
  }
  //会话存储
  win.sesstiondb = {
    set: function (key, data) {
      sessionStorage.setItem(key, JSON.stringify(data));
    },
    get: function (key) {
      return JSON.parse(sessionStorage.getItem(key));
    },
    del: function (key) {
      sessionStorage.removeItem(key);
    },
    clear: function () {
      sessionStorage.clear();
    }
  }
}(window))