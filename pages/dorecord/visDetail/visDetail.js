// pages/dorecord/visDetail/visDetail.js
var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invitor: '',
    company: '',
    phone: '',
    reason: '',
    year: '',
    month: '',
    day: '',
    starttime: '',
    endtime: '',
    address: '',
    index:0,
    num: 1,
    show:1,
    callIcon: '../../resource/images/call.png'
  },
  makecall: function(){
    wx.makePhoneCall({
      phoneNumber: this.data.phone,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var detail = JSON.parse(options.detail)
    this.setData({
      reason: detail.reason,
      year: detail.year,
      month: detail.month,
      day: detail.day,
      starttime: detail.starttime,
      endtime: detail.endtime,
      address: detail.address,
      num: detail.num,
      index: detail.num-1,
      invitor: detail.invitor,
      company: detail.company,
      phone: detail.phone,
      show: detail.show
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
  onShareAppMessage: function (res) {
    var that = this
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: '邀请函',
      path: 'pages/invite/invite?dataset=' + util.tran(this),
      success: function (res) {
        // 转发成功

        console.log("转发成功:" + JSON.stringify(res));
        var shareTickets = res.shareTickets;
        // if (shareTickets.length == 0) {
        //   return false;
        // }
        // //可以获取群组信息
        // wx.getShareInfo({
        //   shareTicket: shareTickets[0],
        //   success: function (res) {
        //     console.log(res)
        //   }
        // })
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  }
})