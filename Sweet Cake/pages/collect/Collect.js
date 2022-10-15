import {assertUrl, request} from "../../request/index";
const app = getApp()
Page({
  data: {
    collectlist:[],
    assertUrl
  },
  onLoad(){
    request("/islogin",{
      tokenId: wx.getStorageSync("tokenId")
    })
  },

  onShow(){
    this.setData({
      collectlist:app.globalData.collect,
    })
    
  }

})