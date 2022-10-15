import { request } from "../../request/index.js"
const app = getApp();
Page({
  
  data:{
    goodList:[],
    addCardNum:0,
    userInfo:{},
    hasUserInfo:false,
    couponNum:0,
    collectNum:0
  },
  
  onShow(){
    this.getcardNum();
    this.setData({
      userInfo:wx.getStorageSync('userInfo'),
      hasUserInfo:wx.getStorageSync('hasUserInfo'),
      couponNum:app.globalData.coupon.length,
      collectNum:app.globalData.collect.length
    })
  },
  
   async getcardNum(){
    const res = await request("/cart",{
      tokenId: wx.getStorageSync('tokenId'),
    })
     this.setData({
       addCardNum: res.length
     });
  },
  
  //登录
  handleGetUserInfo(){
    wx.getUserProfile({
      desc: "授权用户信息",
      success: res => {
        request("/login", {
          nickName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl
        }).then(fetchRes => {
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 1000,
            mark: true
          })
          wx.setStorageSync('userInfo', res.userInfo)
          wx.setStorageSync('hasUserInfo', true)
          wx.setStorageSync('tokenId', fetchRes.data.tokenId)
        }).catch(reason => {
          wx.showToast({
            title: reason,
            icon: "none",
            duration: 3000
          })
        })
      }
    })
    app.globalData.hasUserInfo = true
    
  },
  
  //退出登录
  loginout(){
    const that = this;
    wx.showModal({
      title: '退出登陆',
      content: '您确定要退出嘛',
      success: function (res) {
        if (res.confirm) {
          request("/logout", {
            tokenId: wx.getStorageSync('tokenId')
          }).then(fetchRes => {
            that.setData({
              userInfo: {},
              hasUserInfo: false
            })
            wx.showToast({
              title: '退出成功',
              icon: 'success',
              duration: 1000,
              mark: true
            })
            wx.removeStorageSync('userInfo')
            wx.removeStorageSync('hasUserInfo')
            wx.removeStorageSync('tokenId')
          }).catch(() => {
            wx.showToast({
              title: "退出失败",
              icon: "none",
              duration: 3000
            })
          })
        } else if (res.cancel) {
          return
        }
      }
    })
  },
  
  goToCate(e){
    wx.switchTab({
      url: e.currentTarget.dataset.url
    })
  }
})