import {request} from "../../request/index";

Page({
  data: {
    activeIndex:0,
    tabs:[
      {
        id: 1,
        name: "体验问题",
        isActive: true
      },
      {
        id: 2,
        name: "商品投诉",
        isActive: false
      }
    ],
    textVal:"",
    textValT:"",
    textInput:"",
    chooseImgs:[]
  },
  
  onLoad(){
    request("/islogin",{
      tokenId: wx.getStorageSync("tokenId")
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
  },
  
  //点击+号 选择图片
  handleChooseImg(){
    wx.chooseImage({
      count: 9,
      sizeType: ['original','compressed'],
      sourceType: ['album','camera'],
      success: (result) => {
        this.setData({
          chooseImgs:[...this.data.chooseImgs,...result.tempFilePaths]
        })
      }
    })
  },
  
  //删除上传图片
  handleRemoveImg(e){
    //获取被点击组件的索引你
    const {index} = e.currentTarget.dataset
    //获取data中的图片数组
    let {chooseImgs} = this.data
    //删除元素
    chooseImgs.splice(index,1)
    this.setData({
      chooseImgs
    })
  },
  
  //文本域输入事件
  handleInputTextarea(e){
    textVal:e.detail.value
  },
   //提交
  handleSubmit(){
    const {textVal} = this.data
    wx.showToast({
      title: '提交成功！',
      icon:"success"
    })
    this.setData({
      chooseImgs:[],
      textVal:"",
      textValT:"",
      textInput:""
    })
  }
})