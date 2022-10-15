import { request, assertUrl } from "../../request/index.js"
const app = getApp();
Page({
  data: {
    cake: {},
    order:[],
    buyFlag: false,
    count: 1,
    favourName:"",
    buyWay: "",
    active: 0,
    isCollect: false,
    assertUrl,
    swiperIndex: 0,
    show: false,
    popupList:{
      favour:["原味","牛奶味","抹茶味"],
      buyWay:["立即购买","先用后付"]
    },
    favourIndex:3,
    buyIndex:0,
    scrollTop:false,
    WayFlag:false,
  },

  changeColor(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      favourIndex: index
    })
    const Favour = e.currentTarget.dataset.name;
    this.setData({
      favourName: Favour
    })
  },

  changeBuyWay(e) {
    const index = e.currentTarget.dataset.index;
    if(index===1){
      this.setData({
        WayFlag:true
      })
    }else if(index===0){
      this.setData({
        WayFlag:false
      })
    }
    this.setData({
      buyIndex: index
    })
    const way = e.currentTarget.dataset.way;
    this.setData({
      buyWay: way
    })
  },

  swiperChange(e) {
    this.setData({
      swiperIndex: e.detail.current
    })
  },

  //添加购物车
  addCart() {
    request('/islogin', {
      tokenId: wx.getStorageSync('tokenId')
    });

    this.setData({
      buyFlag: false,
      show: true
    })
  },

  //确认加入购物车
  confirCart(){
    request("/addcart", {
      tokenId: wx.getStorageSync("tokenId"),
      ...this.data.cake,
      num: this.data.count,
      favourName: this.data.favourName,
      buyWay: this.data.buyWay
    });
    wx.showToast({
      title: '添加成功',
      icon: 'success',
      duration: 2000
    })
    this.setData({
      show: false
    })
  },

  onClose() {
    this.setData({
      show: false
    })
  },

  onChange(event) {
    this.setData({
      num: event.detail
    })
  },

  add() {
    this.setData({
      count: this.data.count + 1 >9 ? 9 : this.data.count + 1
    })
  },
  sub() {
    this.setData({
      count: this.data.count - 1 < 1 ? 1 : this.data.count - 1
    })
  },

  //收藏
 async addCollect() {
   const res = await request("/islogin", {
     tokenId: wx.getStorageSync('tokenId'),
   })
   wx.hideLoading();
    if (!this.data.cake.addCollect) {
      this.data.cake.addCollect = true
      this.setData({
        isCollect: true,
        collect : this.data.cake 
      })
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        duration: 1000
      })
      app.globalData.collect = app.globalData.collect.concat(this.data.collect)
    } else {
      this.data.cake.addCollect = false
      this.setData({
        isCollect: false
      })
      wx.showToast({
        title: '取消收藏',
        icon: '',
        duration: 1000
      })
      //如果取消收藏,则收藏夹中的收藏数据相应删除
      app.globalData.collect = app.globalData.collect.filter(item => item.id !== this.data.cake.id);
    }
  },

  //购买
  goToCart(e) {
    wx.switchTab({
      url: '/pages/cart/cart'
    })
  },
  
  async goToBuy(e){
    await request("/islogin", {
      tokenId: wx.getStorageSync('tokenId'),
    })
    this.setData({
      show: true,
      buyFlag: true
    })
  },
  
  //立即去购买
  confirBuy(){
    if(!this.data.WayFlag){
      this.data.cake.num = this.data.count;
      this.data.cake.favourName = this.data.favourName;
      this.data.cake.buyWay = this.data.buyWay;
      this.data.order.push(this.data.cake);
      wx.navigateTo({
        url: "/pages/confirm-order/confirm-order?cake=" + JSON.stringify(this.data.order)
      })
    }else{
      this.data.cake.num = this.data.count;
      this.data.cake.favourName = this.data.favourName;
      this.data.cake.buyWay = this.data.buyWay;
      this.data.order.push(this.data.cake);
      wx.navigateTo({
        url: "/pages/confirm-order/confirm-order?cake=" + JSON.stringify(this.data.order)
      })
    }
    
  },
  
  //获取详情
  onLoad(options) {
    const replaceCake = JSON.parse(options.cake);
    this.setData({
      cake: replaceCake,
    })
    //如果有收藏,则设置收藏状态
    if (app.globalData.collect.length > 0) {
      app.globalData.collect.forEach(item => {
        if (item.id === replaceCake.id) {
          this.setData({
            isCollect: true
          })
        }
      })
    }else {
      this.setData({
        isCollect: false
      })
    }
  },

  //分享
  shareWays() {
    wx.showActionSheet({
      itemList: ['分享到朋友圈', '分享到微信好友', '分享到QQ好友', '分享到QQ空间'],
      success: (res) => {
      },
      fail: (res) => {
      }
    })
  },

  //预览图片
  previewHandler(e){
    const current = this.data.swiperIndex;
    const urls =  this.data.cake.swiperList.map(item => this.data.assertUrl + item);
    wx.previewImage({
      current: urls[current],
      urls
  })
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
  }
})