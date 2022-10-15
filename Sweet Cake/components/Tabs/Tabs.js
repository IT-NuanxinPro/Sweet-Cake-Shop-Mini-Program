Component({
  options: {
    multipleSlots: true 
  },
  properties: {
    tabs:{
      type:Array,
      value:[]
    },
    commentNum:Number
  },
  data: {
  },
  methods: {
    changeIndex(e) {
      this.triggerEvent("tabsItemChange",{
        "index":e.currentTarget.dataset.index
      })
    }
  }
})
