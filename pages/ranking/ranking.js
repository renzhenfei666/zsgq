// pages/ranking/ranking.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    TabCur: '',
    TabCur2: '',
    tab: [],
    list: [],
    tab2: [],
    list2: [],
    noCover:'../../images/noCover.jpg',
    scrollTop:0,
    VerticalNavTop:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: 'https://api.zhuishushenqi.com/ranking/gender', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success:(res) => {
        console.log(res);
        console.log(res.data.male);
        let list = res.data.male;
        this.setData({ tab: list, TabCur: list[0]._id});
        this.getArticle(list[0]._id);
        let list2 = res.data.female;
        this.setData({ tab2: list2, TabCur2: list2[0]._id });
        this.getArticle2(list2[0]._id)
      }
    })
  },

  getArticle(id){
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    wx.request({
      url: 'https://api.zhuishushenqi.com/ranking/'+id, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success:(res) => {
        wx.hideLoading();
        console.log(res);
        let list = res.data.ranking.books;
        list.forEach(val => {
          val.cover = decodeURIComponent(val.cover).replace("/agent/", "");
        })
        this.setData({ list: list });
        for (let i in res.data.ranking.books) {
          wx.createIntersectionObserver().relativeToViewport({ bottom: 20 }).observe('.item-' + i, (res) => {
            console.log(res);
            if (res.intersectionRatio > 0) {
              this.setData({
                [`list[${i}].show`]: true
              })
            }
          })
        }
        console.log(list);
      }
    })
  },

  getArticle2(id) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    wx.request({
      url: 'https://api.zhuishushenqi.com/ranking/' + id, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success:(res) => {
        wx.hideLoading();
        console.log(res);
        let list = res.data.ranking.books;
        list.forEach(val => {
          val.cover = decodeURIComponent(val.cover).replace("/agent/", "");
        })
        this.setData({ list2: list });
        for (let i in res.data.ranking.books) {
          wx.createIntersectionObserver().relativeToViewport({ bottom: 20 }).observe('.item2-' + i, (res) => {
            if (res.intersectionRatio > 0) {
              this.setData({
                [`list2[${i}].show`]: true
              })
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideLoading()
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollTop:0
    })
    this.getArticle(e.currentTarget.dataset.id)
  },

  tabSelect2(e) {
    console.log(e);
    this.setData({
      TabCur2: e.currentTarget.dataset.id,
      scrollTop: 0
    })
    this.getArticle2(e.currentTarget.dataset.id)
  },
  scroll(e) {
    this.scrollTop = e.detail.scrollTop;
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})