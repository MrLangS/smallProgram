// pages/dorecord/dorecord.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    height:0,
    // tab切换
    currentTab: 1,
    showInvList:[],//显示列表
    showVisList: [],//显示列表
    loadInvCount: 1,
    loadVisCount: 1,
    inviteList: [],
    visitList: [],
    role:0,//用户角色
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
    var staffId = wx.getStorageSync('wxuserInfo').staffId
    if (staffId != null || staffId.length!=0){
      that.setData({
        role: 1,
      }); 
    }
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
          height:120*10,
          inviteList: inviteList,
          showInvList: inviteList.slice(0,10)
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
    if(this.data.currentTab==0){
      this.setData({
        loadInvCount: this.data.loadInvCount + 1
      })
      if (10 * (this.data.loadInvCount - 1) >= this.data.inviteList.length) {
        wx.showLoading({
          title: '已加载至最底部',
        })
      } else {
        wx.showLoading({
          title: '正在加载',
        })
        var showInvList = this.data.inviteList.slice(0, 10 * this.data.loadInvCount)
        var len = showInvList.length
        this.setData({
          showInvList: showInvList,
          height: 120 * len
        })
      }
    }else{
      this.setData({
        loadVisCount: this.data.loadVisCount + 1
      })
      if (10 * (this.data.loadVisCount - 1) >= this.data.visitList.length) {
        wx.showLoading({
          title: '已加载至最底部',
        })
      } else {
        wx.showLoading({
          title: '正在加载',
        })
        console.log(this.data.visitList)
        var showVisList = this.data.visitList.slice(0, 10 * this.data.loadVisCount)
        var len = showVisList.length
        this.setData({
          showVisList: showVisList,
          height: 120 * len
        })
      }
    }
    setTimeout(function () {
      wx.hideLoading()
    }, 500)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})