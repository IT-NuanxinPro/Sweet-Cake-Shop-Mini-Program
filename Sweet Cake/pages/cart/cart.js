import { request } from "../../request/index.js"
Page({
  data: {
    list:[],
    ifshowAddress:false,
    address:"请选择配送地址",
    addtext:"",
    totalPrice:0,
    allSelect:false,
    hasUserInfo:false,
    addressList:[],
    wayFlag:false
  },
  
  onShow(){
    this.setData({
      hasUserInfo:wx.getStorageInfo('hasUserInfo')
    })
    this.initData()
  },
  
 async initData(){
    const res = await request("/cart",{
      tokenId: wx.getStorageSync('tokenId'),
   });
    this.setData({
      list: res,
      totalPrice: this.data.list.reduce((acc, item) => {
        if (item.isSelect === true) {
          return acc + item.price * item.num;
        } else {
          return acc;
        }
      }, 0).toFixed(2),
    });
    
    this.data.list.forEach(item=>{
      if(item.buyWay== "" || item.buyWay=="立即购买"){
         this.setData({
          wayFlag:false
        })
        console.log(1111);
      }else if(item.buyWay=="先用后付"){
        this.setData({
          wayFlag:true
        })
      }
    })

  },
  
  onPullDownRefresh(){
    wx.showLoading({
      title: '加载中',
      mark: true
    })
    this.initData();
    setTimeout(()=>{
      wx.stopPullDownRefresh();
      wx.hideLoading();
    },500)
  },
  
  //更新购物车
  updateCart(){
    const totalPrice = this.data.list.reduce((acc, item) => {
      if (item.isSelect === true) {
        return acc+item.price*item.num;
      } else {
        return acc
      }
    }, 0).toFixed(2);
    request("/updatecart",{
      tokenId:wx.getStorageSync('tokenId'),
      list:this.data.list
    }).then(res => {
      this.setData({
        list:this.data.list,
        totalPrice
      })
    }).catch(reason => {
      wx.showToast({
        title:reason,
        icon:"none",
        duration:3000
      })
    })
  },
  
  // 添加商品数量
  numChangeAdd(e){
    const foodId = e.currentTarget.dataset.good.goodId
    this.data.list.forEach((item,index)=>{
      if(item.goodId === foodId){
        item.num++
      }
    })
    this.updateCart();
  },
  
  // 减少商品数量
  numChangeDec(e){
    const foodId = e.currentTarget.dataset.good.goodId
    const index = e.currentTarget.dataset.index;
    this.data.list.forEach((item,index)=>{
      if(item.goodId === foodId){
        if(item.num === 1){
          wx.showModal({
            title: '是否删除本商品?',
            success:(res)=> {
              if (res.confirm) {
                this.data.list.splice(index, 1);
                this.updateCart();
              }else if (res.cancel){
                  return
              }
            }
        })
        }else if(item.num >0){
          item.num--
        }
      }
      this.updateCart()
    })
  },
  
  // 删除购物车商品
  delete_item(e){
    const index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '是否删除本商品?',
      success:(res)=> {
        if (res.confirm) {
          this.data.list.splice(index, 1);
          this.updateCart()
        }else if (res.cancel){
            return
        }
      }
    }) 
  },
  
  //商品选择状态改变
  handleItemChange(e) {
    const foodId = e.currentTarget.dataset.good.goodId;
    this.data.list.forEach((item,index)=>{
      if(item.goodId === foodId){
        item.isSelect=!item.isSelect
      }
    })
    const ifAllSelect = this.data.list.some(v=> {
      return v.isSelect !== true 
    })
    if(ifAllSelect){
      this.setData({
        allSelect:false
      })
    }else if(!ifAllSelect){
      this.setData({
        allSelect:true
      })
    }
    this.updateCart()
  },
  
  // 全选按钮改变
  handleItemAllChange() {
    if(!this.data.allSelect){
      this.data.list.forEach(v => {
        v.isSelect = true
      })
      this.setData({
        allSelect:true
      })
    }else if(this.data.allSelect){
      this.setData({
        allSelect:false
      })
      this.data.list.forEach(v => {
        v.isSelect = false
      })
    }
    this.updateCart();
  },
  
  // 跳转到确认订单页面
  pay(){
    const list = this.data.list.filter(item => item.isSelect === true)
    if(list.length < 1){
      wx.showToast({
        title:'请选择购买的商品',
        icon:'none'
      })
    }else{
      this.setData({
        allSelect:false
      })
      wx.navigateTo({
        url: "/pages/confirm-order/confirm-order?cake=" + JSON.stringify(list)
      })
    }
  },
  
  // 跳转详情页
  gotoDetail(e) {
    const cakes = JSON.stringify(e.currentTarget.dataset.cake)
    wx.navigateTo({
      url: '/pages/details/details' + '?cake=' + cakes,
    });
  },
})