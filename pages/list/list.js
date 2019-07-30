// pages/list/list.js
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast'; 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: 0,
    list:null,
    name:'',
    start:0,
    hasData:true,
    limit:20,
    noCover: '../../images/noCover.jpg',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    // 先取出页面高度 windowHeight
    wx.getSystemInfo({
      success:(res) => {
        this.setData({
          windowHeight: res.windowHeight
        });
      }
    });
    this.setData({ name: options.name });
    wx.request({
      url: 'https://api.zhuishushenqi.com/book/by-categories', //仅为示例，并非真实的接口地址
      data: {
        gender: 'male',
        type: 'hot',
        major: options.name,
        start: 0,
        limit: this.data.limit,

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success:(res) => {
        wx.hideLoading();
        if (res.data.books.length < this.data.limit) {
          this.setData({ hasData: false });
        }
        let list = res.data.books;
        list.forEach(val => {
          val.cover = decodeURIComponent(val.cover).replace("/agent/", "");
        })
        this.setData({ list: list, start: res.data.books.length});
        for (let i in res.data.books) {
          wx.createIntersectionObserver().relativeToViewport({ bottom: 20 }).observe('.item-' + i, (res) => {
            if (res.intersectionRatio > 0) {
              this.setData({
                [`list[${i}].show`]: true
              })
            }
          })
        }
      }
    })
  },

  loadMore:function(){
    if (!this.data.hasData){
      Toast('我是有底线的~');
      return;
    }
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    wx.request({
      url: 'https://api.zhuishushenqi.com/book/by-categories', //仅为示例，并非真实的接口地址
      data: {
        gender: 'male',
        type: 'hot',
        major: this.data.name,
        start: this.data.start,
        limit: this.data.limit,

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success:(res) => {
        wx.hideLoading();
        if (res.data.books.length < this.data.limit){
          this.setData({ hasData: false});
        }
        console.log(res);
        let list = res.data.books;
        list.forEach(val => {
          console.log(val);
          val.cover = decodeURIComponent(val.cover).replace("/agent/", "");
          val.shortIntro = val.shortIntro.substring(0, 80);
        })
        let data = [...this.data.list,...list]
        this.setData({ list: data, start: parseInt(this.data.start + res.data.books.length)});
        for (let i in this.data.list) {
          wx.createIntersectionObserver().relativeToViewport({ bottom: 20 }).observe('.item-' + i, (res) => {
            console.log(res);
            if (res.intersectionRatio > 0) {
              this.setData({
                [`list[${i}].show`]: true
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