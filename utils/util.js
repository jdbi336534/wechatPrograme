const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 封装微信的requset
 */
const request = (url, data = {}, method = 'GET') => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json',
        'X-litemall-Token': wx.getStorageSync('token')
      },
      success: res => {
        if (res.statusCode == 200) {
          if (res.data.errno == 501) {
            try {
              wx.removeStorageSync('userInfo');
              wx.removeStorageSync('token');
            } catch (e) {

            }
            wx.navigateTo({
              url: '/page/auth/login/login'
            });
          } else {
            resolve(res.data);
          }
        } else {
          reject(res.errMsg)
        }
      },
      fail: err => {
        reject(err);
      }
    });
  })
}
const redirect = (url) => {
  if (false) {
    wx.redirectTo({
      url: '/pages/auth/login/login'
    });
    return false;
  } else {
    wx.redirectTo({
      url: url
    })
  }
}

const showErrorToast = (msg) => {
  wx.showToast({
    title: msg,
    image: '/static/images/icon_error.png'
  })
}
module.exports = {
  formatTime,
  request,
  redirect,
  showErrorToast
}