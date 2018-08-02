/**
 * 用户相关服务
 */
const util = require('../utils/util.js');
const api = require('../config/api.js');

/**
 * Promise封装wx.checkSession
 */
const checkSession = () => new Promise((resolve, reject) => {
    wx.checkSession({
        success: () => {
            resolve(true);
        },
        fail: () => {
            reject(false);
        }
    })
});

/**
 * Promise封装wx.login
 */
const login = () => new Promise((resolve, reject) => {
    wx.login({
        success: (res) => {
            if (res.code) {
                resolve(res);
            } else {
                reject(res);
            }
        },
        fail: (err) => {
            reject(err);
        }
    })
});

/**
 * 调用微信登录
 */
const loginByWeixin = (userInfo) => new Promise((resolve, reject) =>
    login().then(res => {
        console.log(api.AuthLoginByWeixin)
        // 登录远程服务器
        util.request(api.AuthLoginByWeixin, {
            code: res.code,
            userInfo
        }, 'POST').then(result => {
            console.log('result:', result);
            if (result.errno === 0) {
                //存储用户信息
                wx.setStorageSync('userInfo', res.data.userInfo);
                wx.setStorageSync('token', res.data.token);
                resolve(res);
            } else {
                reject(result);
            }
        }).catch(err => {
            console.log('error',err);
            reject(err);
        })
    }).catch(err => {
        reject(err);
    })
);

/**
 * 判断用户是否登录
 */
const checkLogin = () => new Promise((resolve, reject) => {
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('token')) {
        checkSession().then(() => {
            resolve(true);
        }).catch(() => {
            reject(false);
        })
    } else {
        reject(false);
    }
});
module.exports = {
    loginByWeixin,
    checkLogin,
};