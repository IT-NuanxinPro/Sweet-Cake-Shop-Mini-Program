import { request } from "../../request/index.js"
Page({

  data: {
    address: {
      id: Math.floor(Math.random() * 100 + 1),
      name: "",
      mobile: "",
      city: "",
      street: "",
      isDefault: false,
      checked: false,
      isSelect:false
    }
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
  
  formSubmit(e) {
    if(!this.checkAddress()){
      return
    }
    request("/addaddress", {
      address: this.data.address
    }).then((res) => {
        wx.showToast({
          title: "添加成功",
          icon: "success",
          duration: 2000
        })
    })
     
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    prevPage.getALLAddress();
    wx.navigateBack({
      delta: 1  
    })
  }
})
