// pages/dorecord/dorecord.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    // tab切换
    currentTab: 1,
    inviteList: [],
    visitList: [],
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
  //点击列表项查看受邀详细内容
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
    var that = this
    //获得邀请列表请求
    wx.request({
      url: getApp().globalData.server + '/Invitation/invitationList.do',
      method: 'get',
      data: {
        staffId: wx.getStorageSync('wxuserInfo').staffId
      },
      success: function (res) {
        console.log("获得邀请记录")
        var inviteList = res.data
        for (var inv of inviteList) {
          var date = util.tranStamp(inv.visitorDay, 0)
          inv.year = date[0]
          inv.month = date[1]
          inv.day = date[2]
        }
        that.setData({
          inviteList: inviteList
        })
      }
    })
    //获得受邀列表请求
    wx.request({
      url: getApp().globalData.server + '/Invitation/invitedList.do',
      method: 'get',
      data: {
        userId: wx.getStorageSync('wxuserInfo').id
      },
      success: function (res) {
        console.log("获得受邀记录")
        var visitList = res.data
        for (var vis of visitList){
          var date = util.tranStamp(vis.visitorDay, 0)
          vis.year = date[0]
          vis.month = date[1]
          vis.day = date[2]
        }
        that.setData({
          visitList: visitList
        })
      }
    })
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