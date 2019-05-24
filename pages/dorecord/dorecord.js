var app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    height: 120 * 10,
    // tab切换
    currentTab: 1,
    showInvList: [],//显示列表
    showVisList: [],//显示列表
    loadInvCount: 1,
    loadVisCount: 1,
    inviteList: [],
    visitList: [],
    role: 0,//用户角色
    isHideLoadMore: true,
    tip: '正在加载'
  },
  //点击列表项查看邀请详细内容
  clickInvite: function (e) {
    var index = e.currentTarget.dataset.index
    console.log("查看第" + (index + 1) + "项")

    var detail = JSON.stringify(this.data.inviteList[index])
    wx.navigateTo({
      url: './invDetail/invDetail?detail=' + detail,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
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
  bindChange: function (e) {
    var that = this
    that.setData({ currentTab: e.detail.current })
    var inv = that.data.showInvList.length
    var vis = that.data.showVisList.length
    if (e.detail.current == 0) {
      if (inv > 10) {
        that.setData({ height: 120 * inv })
      } else {
        that.setData({ height: 120 * 10 })
      }
    } else {
      if (vis > 10) {
        that.setData({ height: 120 * vis })
      } else {
        that.setData({ height: 120 * 10 })
      }
    }
  },
  //点击tab切换
  swichNav: function (e) {
    var that = this
    var current = e.target.dataset.current
    if (this.data.currentTab === current) {
      return false
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
      if (current == 0) {
        that.setData({ height: 120 * that.data.showInvList.length })
      } else {
        that.setData({ height: 120 * that.data.showVisList.length })
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },

  onShow: function () {
    var that = this
    var staff = app.globalData.staff

    //获得邀请列表请求
    if (staff) {
      that.setData({
        role: 1,
      })
      wx.request({
        url: getApp().globalData.server + '/Invitation/invitationList.do',
        method: 'get',
        data: {
          staffId: app.globalData.staff.id
        },
        success: function (res) {
          console.log("获得邀请记录")
          var inviteList = res.data
          for (var inv of inviteList) {
            var date = inv.startTime.split('\ ')[0].split('-')
            inv.year = date[0]
            inv.month = date[1]
            inv.day = date[2]
          }
          that.setData({
            inviteList: inviteList,
            showInvList: inviteList.slice(0, 10 * that.data.loadInvCount)
          })
        }
      })
    }
    //获得受邀列表请求
    if (app.globalData.sysWXUser){
      wx.request({
        url: app.globalData.server + '/Invitation/invitedList.do',
        method: 'get',
        data: {
          userId: app.globalData.sysWXUser.id
        },
        success: function (res) {
          console.log("获得受邀记录")
          var visitList = res.data
          for (var vis of visitList) {
            var date = vis.startTime.split('\ ')[0].split('-')
            vis.year = date[0]
            vis.month = date[1]
            vis.day = date[2]
          }
          that.setData({
            visitList: visitList,
            showVisList: visitList.slice(0, 10 * that.data.loadVisCount)
          })
        }
      })
    }

  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    //模拟加载
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1000);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    setTimeout(() => {
      this.setData({
        isHideLoadMore: false,
      })
      if (this.data.currentTab == 0) {
        this.setData({
          loadInvCount: this.data.loadInvCount + 1
        })
        if (10 * (this.data.loadInvCount - 1) >= this.data.inviteList.length) {
          this.setData({
            tip: '已加载至最底部',
          })
        } else {
          this.setData({
            tip: '正在加载',
          })
          var showInvList = this.data.inviteList.slice(0, 10 * this.data.loadInvCount)
          var len = showInvList.length
          this.setData({
            showInvList: showInvList,
            height: 120 * len
          })
        }
      } else {
        this.setData({
          loadVisCount: this.data.loadVisCount + 1
        })
        if (10 * (this.data.loadVisCount - 1) >= this.data.visitList.length) {
          this.setData({
            tip: '已加载至最底部',
          })

        } else {
          this.setData({
            tip: '正在加载',
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
        that.setData({
          isHideLoadMore: true,
        })
      }, 500)
    }, 300)

    // setTimeout(function () {
    //   wx.hideLoading()
    // }, 500)
  },

})