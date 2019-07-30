//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    list:null
  },

  onLoad: function () {
    this.getData()
  },
  getData:function(){
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    wx.request({
      url: 'https://api.zhuishushenqi.com/cats/lv2/statistics', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success:(res) => {
        wx.hideLoading();
        let list = res.data.male;
        list.forEach(val => {
          val.bookCover.forEach((item,index) =>{
            val.bookCover[index] = decodeURIComponent(item).replace("/agent/", "");
          })
        })
        this.setData({ list: list });
      }
    })
  }
})
