
Page({
   
  onLoad(){
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    prevPage.initData();
  },

  goToHome(){
    wx.switchTab({
      url: '/pages/home/home'
    })
  },

  goToOrder(){
    wx.reLaunch({
      url: '/pages/order/order'
    })
  }

})