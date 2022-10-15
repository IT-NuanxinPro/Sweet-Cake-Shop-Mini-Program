import { request,assertUrl} from "../../request/index.js"
Page({
  data: {
    tabs:[
      {
        id: 1,
        name: "已完成",
        isActive: false
      },
      {
        id: 2,
        name: "待付款",
        isActive: false
      },
      {
        id: 3,
        name: "待使用",
        isActive: false
      },
      {
        id: 4,
        name: "待评价",
        isActive: false
      },
      {
        id: 5,
        name: "退款/售后",
        isActive: false
      }
    ],
    goodList:[],
    assertUrl,
    activeIndex: 0,
  },
  
  
  onShow(options){
    // 获取当前的小程序页面栈- 数组  长度最大时10页面
    let pages = getCurrentPages();
    // 数组中 索引最大页面就是当前页面
    let  currentPage = pages[pages.length-1]
    //获取url上type的参数
    const {type} = currentPage.options
    //激活选中页面标题 当type=1 index = 0
    this.changeTitleIndex(type-1)
    this.getOrderList(type);
  },
  
  async getOrderList(){
    const res = await request("/orderlist",{tokenId: wx.getStorageSync("tokenId")});
     this.setData({
       goodList:res.data
     })
  },
  
  //根据标题索引来激活选中标题数组
  changeTitleIndex(index){
    let {tabs} = this.data;
    tabs.forEach((v,i) => i ===index ? v.isActive = true :v.isActive = false)
    this.setData({
      tabs,
      activeIndex:index
    })
  },
  
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
    const {index} = e.detail;
    this.changeTitleIndex(index);
    this.getOrderList(index+1)
  },
})