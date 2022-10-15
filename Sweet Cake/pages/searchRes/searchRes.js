import { request } from "../../request/index.js";

Page({
  data:{
    value:"",
    goodList:[],
    scrollTop:false,
    option1: [
      { text: '全部商品', value: 0 },
      { text: '新款商品', value: 1 },
      { text: '特惠商品', value: 2 },
      { text: '热卖商品', value: 3 },
    ],
    option2: [
      { text: '默认排序', value: 'a' },
      { text: '价格升序', value: 'b' },
      { text: '价格降序', value: 'c' },
      { text: '销量排序', value: 'd' },
    ],
    value1: 0,
    value2: 'a',
  },

  changeTag(e){
    //对goodLists本地存储进行过滤操作
    //对if判断 优化
   switch (e.detail) {
      case 0:
        this.setData({goodList:wx.getStorageSync('goodList')});
        break;
      case 1:
        this.setData({goodList:wx.getStorageSync('goodList').filter(item=>item.tag_title=="新品")});
        break;
      case 2:
        this.setData({goodList:wx.getStorageSync('goodList').filter(item=>item.tag_title=="特惠")});
        break;
      case 3:
        this.setData({goodList:wx.getStorageSync('goodList').filter(item=>item.tag_title=="热卖")});
    }
  
  },
 
  changeSort(e) {
    switch (e.detail) {
      //默认排序
      case 'a':
        this.setData({
          goodList: wx.getStorageSync('goodList')
        })
      case 'b':
        //价格升序
        this.setData({
          goodList: this.data.goodList.sort((a, b) => {
            return a.price - b.price
          })
        })
        break;
      case 'c':
        //价格降序
        this.setData({
          goodList: this.data.goodList.sort((a, b) => {
            return b.price - a.price
          })
        })
        break;
      case 'd':
        this.setData({
          goodList: this.data.goodList.sort((a, b) => {
            return b.goods_sales - a.goods_sales
          })
        })
        break;
    }
    
  },
  
  changeVal(e){
    this.setData({
      value: e.detail
    }) 
   
    if (e.detail == "") {
      this.setData({
        goodList: []
      })
    } 
   //对输入框做防抖处理
    /* let timer = null;
    clearTimeout(timer);
    timer = setTimeout(() => {
       
    }, 1000); */
  },

  onLoad(options){
    this.setData({
      value: options.value
    })
    this.search();
  },
  
  // 搜索商品
  async search(){
    if (this.data.value == "") {
      this.setData({goodList: []});
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'none'
      })
    } else {
      try {
        const res = await request('/goodList', { keyword: this.data.value }, "POST");
        this.setData({ goodList: res.data })
        // 如果搜索结果为空,提示用户
        if (res.data.length == 0) {
          wx.showToast({
            title: '没有搜索到相关商品',
            icon: 'none',
            duration: 3000
          })
        } else {
          wx.showToast({
            title: '搜索成功',
            icon: 'success',
            duration: 1000
          })
        }
      } catch (e) {
        wx.showToast({
          title: e,
          icon: "none"
        })
      }

    }
    
    wx.setStorageSync('goodList', this.data.goodList);

  },
  
  goToDetail(e){
    const cakes = JSON.stringify(e.currentTarget.dataset.cake)
    wx.navigateTo({
      url: '/pages/details/details' + '?cake=' + cakes,
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

  //添加到购物车
  addCart(e){
    wx.showToast({
      title: '添加成功',
      icon: 'success',
      duration: 1000 
    })
  }

})