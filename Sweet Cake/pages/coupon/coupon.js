import {assertUrl, request} from "../../request/index";

const app = getApp()
Page({

  data: {
    coupon:[],
    assertUrl
  },

  onShow(){
    request("/islogin",{
      tokenId: wx.getStorageSync("tokenId")
    })
    this.setData({
      coupon:app.globalData.coupon,
    })
  }

})