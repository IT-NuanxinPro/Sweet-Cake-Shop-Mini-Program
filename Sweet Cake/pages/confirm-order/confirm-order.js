import { request } from "../../request/index.js"
Page({
  data:{
    noteMaxLen:60,
    currentNoteLen:0,
    remarktext:"",
    show:false,
    list:[],
    totalPrice:0,
    price:0,
    cake:{},
    address:{},
    defaultaddress:{},
    order:[],
    signFlag:false,
    repalce:""
  },
  
  onLoad(options){
    this.getAllAddress();
    // 获取页面栈
    const pages = getCurrentPages();
    //获取上一个页面实例对象
    const prevPage = pages[pages.length - 2];
    if(prevPage.route === "pages/cart/cart"){
      const cake = JSON.parse(options.cake);
      this.setData({
        order:cake
      })
      this.setData({
        totalPrice:cake.reduce((acc, item) => {
          return acc + item.price * item.num;
        }
        , 0).toFixed(2)
      })
      this.buyWay();
    }else if(prevPage.route === "pages/details/details"){
      const cake = JSON.parse(options.cake);
      wx.setStorageSync('cakeData',cake);
     this.setData({
      order: [wx.getStorageSync('cakeData')[0]]
    });
    this.buyWay();
    }
  },

  onShow(){
    let item=JSON.parse(decodeURIComponent(this.data.item))
    this.setData({
      address:item
    })  
    
  },

  buyWay(){
    this.data.order.forEach((item)=>{
      if(item.buyWay == "" || item.buyWay == "立即购买"){
        this.setData({
          totalPrice:(this.data.totalPrice + item.price * item.num).toFixed(2),
          signFlag:false
        })
      }else if(item.buyWay == "先用后付"){
        this.setData({
          totalPrice:0,
          price:(item.price * item.num).toFixed(2),
          signFlag:true
        })
      }
    })
  },
  
  //获取默认地址
  async getAllAddress(){
    const res = await request('/getalladdress');
    const defaultAddress = res.data.find(item=>item.isDefault === true);
    this.setData({
      address:defaultAddress
  })
  },
  
  // 显示备注弹出框
  showremark(){
    this.setData({show:true})
  },
  
  // 关闭备注弹出框
  onClose() {
    this.setData({show:false});
  },
  
  // 提交备注
  submitremark(){
    this.onClose()
  },
  
  // 输入备注
  input(event) {
    var value = event.detail.value,
        len = parseInt(value.length);
    let that = this;
    that.setData({
      currentNoteLen: len,
      noteMaxLen: this.data.noteMaxLen,
      remarktext: value
    })
  },
  
  
  async handlePay() {
    if (this.data.address) {
         await request("/createorder", {
          tokenId: wx.getStorageSync("tokenId"),
          list: this.data.order 
        });
        wx.showToast({
          title: "支付成功", icon: "success", duration: 2000
        });
        const list_rest = this.data.list.filter(item => item.isSelect !== true);
        this.setData({
          list: list_rest,
          totalPrice: 0
        });
      setTimeout(function () {
        wx.redirectTo({
          url: '/pages/successPay/successPay'
        })
      }, 500);
    }else{
      wx.showToast({
        title: "请选择地址", icon: "none", duration: 2000
      });
    }
  },
  bindchange(e){}
})
