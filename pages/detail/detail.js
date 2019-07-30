// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:null,
    activeNames: ['1'],
    reviews:[],
    link:null,
    hasStorage:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    wx.request({
      url: 'https://api.zhuishushenqi.com/book/' + options.id, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success:(res) => {
        console.log(res);
        let detail = res.data;
        detail.cover = decodeURIComponent(detail.cover).replace("/agent/", "");
        detail.wordCount = parseFloat(detail.wordCount / 10000).toFixed(2);
        wx.setNavigationBarTitle({
          title: detail.title
        });
        this.setData({
          detail: detail
        });
        wx.getStorage({
          key: 'bookshelf_' +detail._id,
          success:(res) => {
            this.setData({
              hasStorage: true
            });
            console.log(res.data);
          },
          fail:(res) => {
            console.log(res);
            this.setData({
              hasStorage: false
            });
          }
        })
        console.log(this.data);
        this.startRead()
      }
    });
    wx.request({
      url: 'https://api.zhuishushenqi.com/post/review/by-book', //仅为示例，并非真实的接口地址
      data:{
        book: options.id,
        sort: 'updated',
        start: 0,
        limit: 5,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success:(res) => {
        console.log(res);
        let reviews = res.data.reviews;
        this.setData({
          reviews: reviews
        })
      }
    });
  },
  onChange(event) {
    console.log(event);
    this.setData({
      activeNames: event.detail
    });
  },
  startRead() {
    let bookId = this.data.detail._id;
    wx.request({
      url: `https://api.zhuishushenqi.com/atoc?view=summary&book=${bookId}`, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success:(res) => {
        console.log(res);
        let id = res.data[0]._id
        // this.startRead(id);
        wx.request({
          url: `https://api.zhuishushenqi.com/btoc/${id}?view=chapters`, //仅为示例，并非真实的接口地址
          header: {
            'content-type': 'application/json' // 默认值
          },
          success:(res) => {
            wx.hideLoading();
            console.log(res);
            let link = encodeURIComponent(res.data.chapters[0].link);
            console.log(bookId)
            this.setData({
              link: link
            })
            // wx.navigateTo({
            //   url:'../read/read?link='+link+'&id='+bookId
            // })
          }
        });
      }
    });
  },
  joinBookshelf(){
    wx.setStorage({
      key: 'bookshelf_'+this.data.detail._id,
      data: {
        detail:this.data.detail,
        link:this.data.link,
        scrollTop:0
      },
      success: (res) => {
        this.setData({
          hasStorage: true
        });
      },
    })
  },
  noMorePursuit(){
    wx.removeStorage({
      key: 'bookshelf_' +this.data.detail._id,
      success:(res) => {
        this.setData({
          hasStorage: false
        });
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