import { request ,assertUrl} from "../../request/index.js"

Component({
  properties: {
    arr:{
      type:Array,
      value:[]
    }
  },
  
  data: {
    flag: false,
    money: 50,
    money1:50,
    arr:[],
  },

  methods: {
  async receive(){
    
    const res = await request("/islogin", {
      tokenId: wx.getStorageSync('tokenId'),
    })
    wx.hideLoading()
     this.triggerEvent('Get',{});
     this.triggerEvent('GetOne',{});
      if (this.data.flag) {
        return
      }else{
        this.setData({
          flag: true
        })
      }
    }
  }
})
