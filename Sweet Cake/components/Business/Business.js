import {assertUrl} from "../../request/index.js"
Component({
  properties: {
  },
  data: {
    business:[
      {
        id:"001",
        address_title:"香喷喷蛋糕店",
        address_detail:"天津市大学软件学院5公寓202,203,204室",
        business_classify:"蛋糕",
        business_time:"00:00-23:59",
      }
    ],
    assertUrl,
    steps: [
      {
        text: '尚未下单'
      },
      {
        text: '买家下单'
      },
      {
        text: '商家接单'
      },
      {
        text: '买家提货'
      },
      {
        text: '交易完成'
      },
    ],
    active:0
  },
  methods: {
    callPhone(){
      wx.makePhoneCall({
        phoneNumber: '17320289373' //仅为示例，并非真实的电话号码
      })
    }
  }
})
