import { request ,assertUrl} from "../../request/index.js"

const app=getApp();
Page({
  data: {
    assertUrl,
    cakes: [],
    activeIndex: 0,
    tabs: [
      {
        id: 1,
        name: "点餐",
        isActive: true
      },
      {
        id: 2,
        name: "评论",
        isActive: false
      },
      {
        id: 3,
        name: "商家",
        isActive: false
      }
    ],
    activeKey: 0,
    changeCakes: [],
    message: "",
    sendMessage: [],
    comment: null,
    date: "",
    get: [
      {
        unique: "a",
        title: "领取",
        money: 10,
        moneyName: "￥10"
      },
      {
        unique: "b",
        title: "领取",
        money: 50,
        moneyName: "￥50"
      },
      {
        unique: "c",
        title: "领取",
        money: 200,
        moneyName: "￥200"
      }
    ],
    commentNum: 0
  },
  
  //获取优惠券
 async getCoupon(e){
    //如果不是登录状态,则跳转到登录页面
    const res = await request("/islogin", {
      tokenId: wx.getStorageSync('tokenId'),
    })
   
    const money = e.currentTarget.dataset.money
    const title = e.currentTarget.dataset.title
    
    if (title === '已领取') {
      this.data.get.forEach((item) => {
        if (item.title === '已领取') {
          wx.showToast({
            title: '您已成功领取' + money + "元优惠卷!",
            icon: 'none',
            duration: 1500,
            mask: false,
          });
        }
      })
      this.setData({
        get: this.data.get
      })
      
    } else {
      app.globalData.coupon.unshift(money)
      this.data.get.forEach((item) => {
        if (item.money === money) {
          item.title = "已领取"
        }
      })
      this.setData({
        get: this.data.get
      })
      wx.showToast({
        title: '您成功领取' + money + "元优惠卷!",
        icon: 'none',
        duration: 1500,
        mask: false,
      });
    }
  },
  
  //切换tab
  changeIndex(e) {
    this.data.tabs.forEach((item, index) => {
      if (index === e.detail.index) {
        item.isActive = true
      } else {
        item.isActive = false
      }
    });
    this.setData({
      activeIndex: parseInt(e.detail.index, 10),
      tabs: this.data.tabs
    })
  },
  
  //初始化页面数据
  onLoad() {
    this.getCateList();
  },
  
  //获取分类列表数据
  async getCateList() {
    try {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      const res = await request("/cateList");
      this.setData({
        cakes: res.data,
        changeCakes: res.data[0].children
      });
      wx.setStorageSync("cates", this.data.cakes);
      setTimeout(() => {
        wx.hideLoading();
      },500)
    } catch (e) {
      wx.showToast({
        title: e,
        icon: "none"
      });
    }
  },
  
  onChange(e) {
    const index = e.detail
    this.data.cakes.forEach((item, i) => {
      if (index === i) {
        this.setData({
          changeCakes: item.children
        })
      }
    })
  },
  
  onChangeStart(e) {
    wx.showToast({
      title: "您的支持是我们的动力!",
      icon: 'none',
      duration: 1500,
      mask: false,
    });
  },
  // 处理 scroll-view事件
  upper(e) {
  },
  lower(e) {
  },
  scroll(e) {
  },
  scrollToTop() {
    this.setAction({
      scrollTop: 0
    })
  },
  
  //跳转详情页面
  goToDetail(e) {
    const cakes = JSON.stringify(e.target.dataset.cake)
    wx.navigateTo({
      url: '/pages/details/details' + '?cake=' + cakes,
    });
  },
  
  //用户评论
  changeComment(e) {
    this.setData({
      message: e.detail
    })
  },
  
  //发送评论
  sendComment(e) {
    if (this.data.message !== "") {
      this.data.sendMessage.unshift(e.target.dataset.message)
      this.data.commentNum += 1
      this.setData({
        sendMessage: this.data.sendMessage,
        commentNum: this.data.commentNum,
        message: ""
      })
    } else {
      wx.showToast({
        title: '请输入评论内容',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
    }
  },
  
  // 评论当前时间
  formatDate() {
    const date = new Date(),
     year = date.getFullYear(),
     month = date.getMonth() + 1,
     day = date.getDate(),
     hours = date.getHours(),
     minutes = date.getMinutes(),
     second = date.getSeconds()
    
    //补0操作
    const formatNumber = n => {
      n = n.toString()
      return n[1] ? n : '0' + n
    }
    return [year, month, day].map(formatNumber).join('-') + ' ' +
           [hours, minutes, second].map(formatNumber).join(':')
    
  },
  
  
  onReady() {
    this.setData({
      container: () => wx.createSelectorQuery().select('#comment'),
      date: this.formatDate()
    });
  },
  
  
  refreshData() {
    const cake = wx.getStorageSync("cates");
    if (!cake) {
      request("/cateList")
          .then((res) => {
            wx.setStorageSync("cates", res);
          }).catch((e) => {
      });
    } else {
      this.setData({
        cakes: wx.getStorageSync("cates"),
        changeCakes: wx.getStorageSync("cates")[0].children
      });
    }
  },
  
  onPullDownRefresh() {
    wx.showLoading({
      title: '加载中',
      duration:1500
    })
    this.refreshData();
    setTimeout(() => {
      wx.stopPullDownRefresh()
      wx.hideLoading()
    }, 1000)
  }
  
})