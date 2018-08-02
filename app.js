const user = require('./utils/user.js');
App({
  onLaunch: function () {

  },
  onShow: function () {
    user.checkLogin().then(() => {
      this.globalData.hasLogin = true;
    }).catch(() => {
      this.globalData.hasLogin = false;
    })
  },
  globalData: {
    hasLogin: false
  }
})