import { request } from "../../request/index.js"
Page({
  data: {
    // 数据库已经有数据
    oldaddress: [],
    //新建地址时默认值
    address: {
      id: Math.floor(Math.random() * 100 + 1),
      name: "",
      mobile: "",
      city: "",
      street: "",
      isDefault: false,
      checked: false
    }
  },
  // 新增地址页面
  addAddress() {
    wx.navigateTo({
      url: '/pages/addaddress/addaddress',
    })
  },
  //删除  这个部分需要连接跟新数据库
  checkDelete(e) {
    var index = e.currentTarget.dataset.index;
    for (let i = 0, length = this.data.oldaddress.length; i < length; i++) {
      if (i == index) {
        request("/deleteaddress", {
          address: this.data.oldaddress[i]
        }).then((res) => {})
        this.data.oldaddress.splice(i, 1);
      }
    }
    this.setData({
      oldaddress: this.data.oldaddress
    })

  },
  //编辑地址 保存后更新
  chickEdit(e) {
    var index = e.currentTarget.dataset.index;
    var address = this.data.oldaddress[index];
    wx.navigateTo({
      url: "/pages/redactaddress/redactaddress?address=" + JSON.stringify(address)
    })
  },
  onShow(options) {

    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    const address = currentPage.options
    if (address.address) {
      this.setData({
        address: JSON.parse(address.address)
      })
    } else {
      this.initData()
    }
  },
  onLoad() {
    request("/islogin",{
      tokenId: wx.getStorageSync("tokenId")
    }).then(()=>{
      this.getALLAddress(); 
    })
  },

  getALLAddress(){
    request("/getalladdress").then((res) => {
      this.setData({
        oldaddress: res.data
      })
    })
  },
  
  initData() {
    this.setData({
      address: this.data.address
    })

  },
  //验证地址信息
  checkAddress() {
    var address = this.data.address;
    var tipStr = "";
    if (address.name.length == 0) {
      tipStr = "请填写收货人姓名"
    } else if (address.mobile.length == 0) {
      tipStr = "请填写收货人手机号"
    } else if (address.city.length == 0) {
      tipStr = "请填写收货人所在地址"
    } else if (address.street.length == 0) {
      tipStr = "请填写收货人详细地址"
    }
    if (tipStr.length == 0) {
      return true
    } else {
      wx.showToast({
        title: tipStr,
        icon: "none"
      })
      return false
    }
  },
  inputName(e) {
    this.data.address.name = e.detail.value;
    this.setData({
      address: this.data.address
    })
  },
  inputMobile(e) {
    this.data.address.mobile = e.detail.value;
    this.setData({
      address: this.data.address
    })
  },
  inputStreet(e) {
    this.data.address.street = e.detail.value;
    this.setData({
      address: this.data.address
    })
  },
  //选择所在地址
  bindRegionChange(e) {
    var city = e.detail.value;
    this.data.address.city = city.join(" ")
    this.setData({
      address: this.data.address
    })
  },
  //默认地址
  checkDefault() {
    if (this.data.address.isDefault) {
      this.data.address.isDefault = false
    } else {
      this.data.address.isDefault = true
    }
    this.setData({
      address: this.data.address
    })
  },
  
  chickAdd() {
    if (!this.checkAddress()) {
      return
    }
    request("/editaddress", {
      tokenId: wx.getStorageSync('tokenId'),
      ...this.data.address
    }).then(res => {
      wx.reLaunch({
        url: "/pages/confirm-order/confirm-order?address=" + JSON.stringify(this.data.address),
      })
      wx.showToast({
        title: res.data.data,
        icon: "none",
        duration: 3000
      })

    }).catch((reason) => {
      wx.showToast({
        title: reason,
        icon: "none",
        duration: 3000
      })

    })
  }
})