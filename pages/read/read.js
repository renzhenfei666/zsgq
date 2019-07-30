// pages/read/read.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:null,
    catalog:[],
    show: false,
    show2: false,
    catalogCur:null,
    scrollTop: 0,
    id:null,
    bookId:null,
    previousChapter:false,
    nextChapter: false,
    index:null,
    bgColor:{
      defaultBg:'#f1eeeb',
      darkBg:'#1f1f1f',
      potectEyesBg:'#c7edcc'
    },
    fontColor:{
      defaultFc:'#333333',
      darkFc: '#666666',
      potectEyesFc: '#233323',
    },
    bgFont:1,
    titleFontSize:40,
    contentFontSize:34

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    let link = options.link;
    let id = options.id;
    wx.getStorage({
      key: 'navigationBarColor',
      success: (res) => {
        this.setData({
          bgFont: res.data.bgFont,
        })
      },
    })
    wx.getStorage({
      key: 'fontSize',
      success: (res) => {
        this.setData({
          titleFontSize: res.data.titleFontSize,
          contentFontSize: res.data.contentFontSize
        })
      },
    })
    this.setData({ catalogCur: decodeURIComponent(link),bookId:id});
    this.getContent(link);
    this.getSourceId(id);

  },
  //获取章节内容
  getContent(link){
    console.log(link);
    wx.request({
      url: 'https://chapterup.zhuishushenqi.com/chapter/' + link, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success:(res) => {
        wx.hideLoading();
        this.setData({ content: res.data.chapter, show: false, show2: false, catalogCur: decodeURIComponent(link)});
        wx.setNavigationBarTitle({
          title: res.data.chapter.title
        });
        wx.getStorage({
          key: 'bookshelf_'+this.data.bookId,
          success:(res) => {
            console.log(res.data);
            this.setData({
              scrollTop: res.data.scrollTop
            })
            let data = res.data;
            data.link = link;
            wx.setStorageSync('bookshelf_' + this.data.bookId,data)
          },
          fail:(res) =>{
            this.setData({
              scrollTop: 0 
            })
          }
        })
      }
    });
  },
  //获取源ID,用于获取目录（需根据bookId）
  getSourceId(id){
    wx.request({
      url: `https://api.zhuishushenqi.com/atoc?view=summary&book=${id}`, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success:(res) => {
        console.log(res);
        let _id = res.data[0]._id;
        this.setData({ id: _id });
        this.getCatalog(_id);
      }
    });
  },

  //获取目录
  getCatalog(id) {
    wx.request({
      url: `https://api.zhuishushenqi.com/btoc/${id}?view=chapters`, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success:(res) => {
        console.log(res);
        let index = res.data.chapters.findIndex(item => {
          return item.link == this.data.catalogCur
        });
        console.log(index);
        this.setData({
          index: index,
          catalog: res.data.chapters
        });
        if (res.data.chapters.length>1){
          if (index < 1) {
            this.setData({
              previousChapter: false,
              nextChapter: true
            });
          } else if (index == res.data.chapters.length-1){
            this.setData({
              previousChapter: true,
              nextChapter: false
            });
          }else{
            this.setData({
              previousChapter: true,
              nextChapter: true
            });
          }
        }
      }
    });
  },
  //下一章
  nextChapter(){
    // console.log(this.data.catalog[this.data.index + 1].link)
    // console.log(this.data.catalog);
    // console.log(decodeURIComponent(link));
    // let index = this.data.catalog.findIndex(item => {
    //   return item.link == decodeURIComponent(link)
    // });
    // console.log(index);
    this.setData({ index: this.data.index + 1 });
    wx.getStorage({
      key: 'bookshelf_' + this.data.bookId,
      success: (res) => {

        let data = res.data;
        data.scrollTop = 0;
        console.log(data);
        wx.setStorageSync('bookshelf_' + this.data.bookId, data)
      },
    })
    console.log(this.data.index);
    this.getContent(encodeURIComponent(this.data.catalog[this.data.index].link));
  },
  //上一章
  previousChapter() {
    // console.log(this.data.catalog[this.data.index + 1].link)
    this.setData({ index: this.data.index - 1 });
    wx.getStorage({
      key: 'bookshelf_' + this.data.bookId,
      success: (res) => {
        let data = res.data;
        data.scrollTop = 0;
        wx.setStorageSync('bookshelf_' + this.data.bookId, data)
      },
    })
    this.getContent(encodeURIComponent(this.data.catalog[this.data.index].link));
  },

  leftPopup() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  onClose2() {
    this.setData({ show2: false });
  },
  bottomPopup(){
    this.setData({ show2: true });
  },
  switchChapter(event){
    let link = encodeURIComponent(event.currentTarget.dataset.link);
    let id = encodeURIComponent(event.currentTarget.dataset.id);
    let index = this.data.catalog.findIndex(item => {
      return item.link == event.currentTarget.dataset.link
    });
    console.log(index);
    this.setData({
      index: index
    });
    wx.getStorage({
      key: 'bookshelf_' + this.data.bookId,
      success: (res) => {
        let data = res.data;
        data.scrollTop = 0;
        wx.setStorageSync('bookshelf_' + this.data.bookId, data)
      },
    })
    this.getContent(link);
  },
  scroll(e) {
    this.scrollTop = e.detail.scrollTop;
    wx.getStorage({
      key: 'bookshelf_' + this.data.bookId,
      success: (res) => {
        let data = res.data;
        data.scrollTop = e.detail.scrollTop;
        wx.setStorageSync('bookshelf_' + this.data.bookId, data)
      },
    })
  },
  handelDefault() {
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: this.data.bgColor.defaultBg,
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    });
    this.setData({ bgFont: 1, show: false});
    let data = {
      bgFont: 1
    }
    wx.setStorageSync('navigationBarColor', data)

  },
  handelDark() {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: this.data.bgColor.darkBg,
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    });
    this.setData({ bgFont: 2, show: false});
    let data = {
      bgFont: 2
    }
    wx.setStorageSync('navigationBarColor', data)
  },
  handelProtectEyes() {
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: this.data.bgColor.potectEyesBg,
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    });
    this.setData({ bgFont: 3, show: false});
    let data = {
      bgFont: 3
    }
    wx.setStorageSync('navigationBarColor', data)
  },
  reduceFontSize() {
    if (this.data.titleFontSize!=24){
      this.setData({ titleFontSize: this.data.titleFontSize - 4, contentFontSize: this.data.contentFontSize - 4});
      let data = {
        titleFontSize: this.data.titleFontSize,
        contentFontSize: this.data.contentFontSize
      }
      wx.setStorageSync('fontSize', data)
    }
  },
  increaseFontSize() {
    if (this.data.titleFontSize != 56) {
      this.setData({ titleFontSize: this.data.titleFontSize + 4, contentFontSize: this.data.contentFontSize + 4 });
      let data = {
        titleFontSize: this.data.titleFontSize,
        contentFontSize: this.data.contentFontSize
      }
      wx.setStorageSync('fontSize', data)
    }
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