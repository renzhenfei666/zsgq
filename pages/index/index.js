//index.js

Page({
  data: {
    list:null,
  },

  onLoad: function () {
    this.getData()
  },
  getData:function(){
    wx.request({
      url: 'https://api.zhuishushenqi.com/ranking/5a322ef4fc84c2b8efaa8335', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success:(res) => {
        console.log(res);
        let list = res.data.ranking.books;
        list.forEach((val,index) => {
          console.log(val)
          val.cover = decodeURIComponent(val.cover).replace("/agent/", "");
        })
        this.setData({ list: list });
        for (let i in res.data.ranking.books) {
          wx.createIntersectionObserver().relativeToViewport({ bottom: 20 }).observe('.item-' + i, (res) => {
            if (res.intersectionRatio > 0) {
              list[i].show = true
            }
            this.setData({
              list: list
            })
          })
        }
      }
    })
  }
})
