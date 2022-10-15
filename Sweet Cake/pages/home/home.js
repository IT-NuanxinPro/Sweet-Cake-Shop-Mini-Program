import { request,assertUrl } from "../../request/index.js"
const app = getApp();
Page({
  data: {
    interval:3000,
    duration:1500,
    imgList:['img/swiper1.jpg','img/swiper2.jpg'],
    imgNavLists: [
      {
        img:'img/1.png',
        title:'今日推荐'
      },
      {
        img:'img/2.png',
        title:'蛋糕外卖'
      },
      {
        img:'img/3.png',
        title:'新鲜送达'
      },
      {
        img:'img/4.png',
        title:'每日优惠'
      }
    ],
    bannerLists: ['img/cake1.png', 'img/cake2.png', 'img/cake3.png'],
    time: 30 * 60 * 60 * 1000,
    timeData: {},
    newProductList: [],
    assertUrl,
    scrollTop:false,
    couponData:{},
    couponData1:{}
  },
  
  //发送请求获取数据
  onLoad() {
    this.getNewProductList(false);
    this.setData({
      couponData: this.selectComponent('#coupon').data,
      couponData1: this.selectComponent('.coupon').data
    })
  },

  getCoupon(){
    if(this.data.couponData.flag){
      return
    }else{
      this.setData({
        couponData: {
          flag: true,
          arr: this.data.couponData.arr.concat(this.data.couponData.money)
        }
      })
    }
    const {arr} = this.data.couponData;
    app.globalData.coupon = arr;
    wx.showToast({
      title: '领取成功',
      icon: 'success',
      duration: 1000
    })
  },
  //获取优惠券
  getCoupon1(){
    if(this.data.couponData1.flag){
      return
    }else{
      this.setData({
        couponData1: {
          flag: true,
          arr: this.data.couponData1.arr.concat(this.data.couponData1.money)
        }
      })
    }
    const arr1 = this.data.couponData1.arr; 
    const {arr} = this.data.couponData;
    app.globalData.coupon = arr.concat(arr1);
    wx.showToast({
      title: '领取成功',
      icon: 'success',
      duration: 1000
    })
  },


  async getNewProductList() {
    try {
      wx.showLoading({
        title:'加载中',
        mask:true
      })
      const res = await request("/cateList");
      this.setData({ newProductList: res.data})
      setTimeout(() => {
        wx.hideLoading();
      },500)
    } catch (e) {
      wx.showToast({
        title: e,
        icon: "none"
      })
    }
  },

  //跳转指定页面
  goto(e) {
    wx.navigateTo({
      url: e.target.dataset.url,
    })
  },
  
  //跳转到分类页
  goToCate(e) {
    wx.switchTab({
      url: e.target.dataset.cate
    })
  },
  
  //跳转到详情页
  goToDetail(e) {
    const cakes = JSON.stringify(e.currentTarget.dataset.cake)
    wx.navigateTo({
      url: '/pages/details/details' + '?cake=' + cakes,
    });
  },
  
  //首页商品倒计时
  onChangeTime(e) {
    this.setData({
      timeData: e.detail,
    });
  },
  
  //一键回到顶部
  toTop(e){
    if(wx.pageScrollTo){
      wx.pageScrollTo({
        scrollTop:0,
      })
    }else{
      wx.showToast({
        title:'提示',
        content:'当前微信版本过低,无法使用该功能,请升级到最新微信版本后重试.',
        icon:'none'
      })
    }
  },
  
  //监听页面滚动
  onPageScroll(e){
    if(e.scrollTop>0){
      this.setData({
        scrollTop:true
      })
    }else{
      this.setData({
        scrollTop:false
      })
    }
  },

  //监听下拉刷新
  onPullDownRefresh() {
    wx.showLoading({
      title: '加载中',
      duration:1500
    })
    this.getNewProductList();
    setTimeout(() => {
      wx.stopPullDownRefresh();
      wx.hideLoading();
    }, 500)
  }
  
})