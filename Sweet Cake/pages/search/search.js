import Toast from '@vant/weapp/toast/toast';

Page({

  data:{
    value:"",
    searchHistory: [],
    goodList:[],
    searchFound:["马卡龙","黑糖松饼","蜂蜜千层","流心巧克力","蓝莓慕斯","坚果蛋糕"],
    showFlag:true
  },

  changeVal(e) {
    this.setData({
      value: e.detail
    })
  
  },

  onShow() {
    this.setData({
      searchHistory: wx.getStorageSync('history'),
      value: ''
    })
  },

  search(e){
    if (this.data.value === '') {

      Toast({
        message: '请输入搜索内容',
        duration: 1000,
        position:"bottom",
        icon: 'none',
        mask: true,
        zIndex: 999,
        loadingType: 'spinner', 
     })
      return
    }

    const history = wx.getStorageSync('history')
    if (history) {
      // 判断是否有重复的搜索记录
      const index = history.indexOf(this.data.value)
      if (index > -1) {
        history.splice(index, 1)
      }
      history.unshift(this.data.value)
      wx.setStorageSync('history', history) 

    } else {
      wx.setStorageSync('history', [this.data.value])
    }

   this.goto(e); 
  },

  // 跳转到搜索结果页面
   goto(e){
     wx.navigateTo({
       url: e.currentTarget.dataset.url +'?value=' + this.data.value
     })
   },
  

  // 清空搜索历史
  clearHistory() {
    wx.showModal({
      title: '提示',
      content: '确定要清空搜索历史吗?',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('history')
          this.setData({
            searchHistory: []
          })
        }else{
          return
        }
      }
    })
  },

  // 搜索历史单击事件
  clickHistory(e){
    this.setData({
      value: e.target.dataset.content
    })
    this.search(e)
  },
   
  //长按删除搜索历史
  longPress(e){
    wx.showModal({
      title: '提示',
      content: '确定要删除该条搜索历史吗?',
      success: (res) => {
        if (res.confirm) {
          const history = wx.getStorageSync('history')
          const index = e.target.dataset.index
          history.splice(index, 1)
          wx.setStorageSync('history', history)
          this.setData({
            searchHistory: history
          })
        }else{
          return
        }
      }
    })
  },

  //点击隐藏搜索发现
  showContent(){
    this.setData({
      showFlag:!this.data.showFlag
    })
  }

})