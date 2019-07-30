// pages/bookshelf/bookshelf.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookshelf:[],
    noCover: '../../images/noCover.jpg'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.getStorageInfo({
    //   success:(res) => {
    //     console.log(res.keys);
    //     let keys = res.keys.filter(item => item.includes("bookshelf_"));
    //     let bookshelf = [];
    //     for(let item of keys){
    //       console.log(item);
    //       bookshelf.push(wx.getStorageSync(item))
    //     }
    //     console.log(bookshelf);
    //     this.setData({
    //       bookshelf: bookshelf
    //     })
    //     for (let i in bookshelf) {
    //       wx.createIntersectionObserver().relativeToViewport({ bottom: 20 }).observe('.item-' + i, (res) => {
    //         console.log(res);
    //         if (res.intersectionRatio > 0) {
    //           this.setData({
    //             [`bookshelf[${i}].show`]: true
    //           })
    //         }
    //       })
    //     }
    //   }
    // })
  },
  GetDateTimeDiff(startTime, endTime) {
    let retValue = {};

    let date3 = endTime.getTime() - startTime.getTime();  //时间差的毫秒数

    //计算出相差天数
    let days = Math.floor(date3 / (24 * 3600 * 1000));
    retValue.Days = days;

    let years = Math.floor(days / 365);
    retValue.Years = years;

    let months = Math.floor(days / 30);
    retValue.Months = months;

    //计算出小时数
    let leave1 = date3 % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
    let hours = Math.floor(leave1 / (3600 * 1000));
    retValue.Hours = hours;

    //计算相差分钟数
    let leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数
    let minutes = Math.floor(leave2 / (60 * 1000));
    retValue.Minutes = minutes;

    //计算相差秒数
    let leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数
    let seconds = Math.round(leave3 / 1000);
    retValue.Seconds = seconds;

    let strTime = "";
    if(years >= 1) {
      strTime = years + "年前";
    } else if (months >= 1) {
      strTime = months + "个月前";
    } else if (days >= 1) {
      strTime = days + "天前";
    } else if (hours >= 1) {
      strTime = hours + "小时前";
    } else {
      strTime = minutes + "分钟前";
    }
    retValue.PubTime = strTime;
    return retValue;
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
    this.getBookshelf()
  },

  getBookshelf(){
    wx.getStorageInfo({
      success: (res) => {
        console.log(res.keys);
        let keys = res.keys.filter(item => item.includes("bookshelf_"));
        let bookshelf = [];
        for (let item of keys) {
          console.log(item);
          bookshelf.push(wx.getStorageSync(item))
        }
        console.log(bookshelf);
        this.setData({
          bookshelf: bookshelf
        })
        for (let i in bookshelf) {
          console.log(new Date().getTime());
          let updatedTime = new Date(bookshelf[`${i}`].detail.updated);
          let endTime = new Date();
          let time = this.GetDateTimeDiff(updatedTime, endTime);
          console.log(time);
          bookshelf[`${i}`].detail.updated = time.PubTime;
          wx.createIntersectionObserver().relativeToViewport({ bottom: 20 }).observe('.item-' + i, (res) => {
            console.log(res);
            if (res.intersectionRatio > 0) {
              this.setData({
                [`bookshelf[${i}].show`]: true,
                bookshelf: bookshelf
              })
            }
          })
        }
      }
    })
  },

  deleteBook(event){
    console.log(event);
    wx.removeStorage({
      key: 'bookshelf_' + event.currentTarget.dataset.id,
      success: (res) => {
        this.getBookshelf()
      }
    })
  },

  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },
})