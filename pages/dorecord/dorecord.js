// pages/dorecord/dorecord.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    // tab切换
    currentTab: 0,
    inviteList: [
      { reason: '讨论', year: '2018', month: '09', day: '29', 
      starttime: '09:00', endtime: '14:00', address: '北京', num: 2},
      {
        reason: '学术', year: '2018', month: '08', day: '31',
        starttime: '13:00', endtime: '14:00', address: '上海', num: 1
      },
      {
        reason: '研究', year: '2018', month: '07', day: '11',
        starttime: '08:00', endtime: '14:00', address: '吉林', num: 4
      },
      {
        reason: '会议', year: '2018', month: '09', day: '29',
        starttime: '11:00', endtime: '14:00', address: '江西', num: 3
      },
      {
        reason: '峰会', year: '2018', month: '06', day: '06',
        starttime: '09:00', endtime: '14:00', address: '杭州', num: 11
      }
    ],
    visitList: [
      {
        reason: '讨论', year: '2018', month: '09', day: '29', 
        invitor: { name: '老王', company: '老王公司', phone: '18201020394'} , show: 1,
        starttime: '09:00', endtime: '14:00', address: '北京', num: 2
      },
      {
        reason: '学术', year: '2018', month: '08', day: '31', 
        invitor: { name: '老汪', company: '老汪公司', phone: '18201020394'} , show: 0,
        starttime: '13:00', endtime: '14:00', address: '上海', num: 1
      },
      {
        reason: '研究', year: '2018', month: '07', day: '11', 
        invitor: {name: '老郎',company: '老郎公司', phone: '18201020394'}, show: 2,
        starttime: '08:00', endtime: '14:00', address: '吉林', num: 4
      },
      {
        reason: '会议', year: '2018', month: '09', day: '29', 
        invitor: {name: '老曲', company: '老曲公司', phone: '18201020394'}, show: 1,
        starttime: '11:00', endtime: '14:00', address: '江西', num: 3
      },
      {
        reason: '峰会', year: '2018', month: '06', day: '06', 
        invitor: {name: '老江',company: '老江公司', phone: '18201020394'} , show: 1,
        starttime: '09:00', endtime: '14:00', address: '杭州', num: 11
      }
    ],
  },
  //点击列表项查看邀请详细内容
  clickInvite: function(e){
    var index = e.currentTarget.dataset.index
    console.log("查看第"+(index+1)+"项")
    
    var detail = JSON.stringify(this.data.inviteList[index])
    wx.navigateTo({
      url: './invDetail/invDetail?detail='+detail,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  //点击列表项查看邀请详细内容
  clickVisit: function (e) {
    var index = e.currentTarget.dataset.index
    console.log("查看第" + (index + 1) + "项")
    var detail = JSON.stringify(this.data.visitList[index])
    wx.navigateTo({
      url: './visDetail/visDetail?detail=' + detail,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //滑动切换tab
  bindChange: function(e){
    var that=this
    that.setData({currentTab: e.detail.current})
  },
  //点击tab切换
  swichNav: function(e){
    var that=this
    if(this.data.currentTab===e.target.dataset.current){
      return false
    }else{
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    wx.getSystemInfo({ 
      success: function (res) { 
        that.setData({ 
          winWidth: res.windowWidth, 
          winHeight: res.windowHeight 
        }); 
      } 
    });

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