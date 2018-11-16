// pages/dorecord/invDetail/invDetail.js
var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invitationId: 0,//邀请id
    invitor: { name: '', company: '', phone: '' },
    reason:'',
    year: '',
    month:'',
    day: '',
    starttime: '',
    endtime: '',
    address: '',
    num: 0,
    vistorName: '',
    vistorPhone: '',
    index:0,
    hidenIndex: null,
    hidenTag: false,
    memberList: [],
    phoneIcon: '/pages/resource/images/call.png',
    ddl: false,//邀请是否过期标签
  },

  //拨打电话
  call:function(e){
    wx.makePhoneCall({
      phoneNumber: this.data.memberList[this.data.index].visitorPhoneNo,
    })
  },
  //拒绝事件
  reject: function(){
    var that=this
    wx.showModal({
      title: '提示',
      content: '确认拒绝该访客吗？',
      success: function(res){
        if (res.confirm) {
          wx.request({
            url: getApp().globalData.server + '/Invitation/changeVisitorStatus.do',
            data: {
              invitationId: that.data.invitationId,
              userId: that.data.memberList[that.data.hidenIndex].userId,
              status: 3
            },
            method: 'get',
            success: function (res) {
              if (res.data) {
                that.data.memberList[that.data.hidenIndex].visitorStatus = 3
                that.setData({
                  memberList: that.data.memberList
                })
                wx.showToast({
                  title: '拒绝成功',
                  icon: 'success',
                  duration: 1500
                })
              } else {
                wx.showToast({
                  title: '操作异常',
                  duration: 1500
                })
              }
            }
          })
        }
      }
    })
    
  },
  //接受事件
  accept: function(){
    var that = this
    wx.showModal({
      title: '提示',
      content: '确认接受该访客吗?',
      success: function(res){
        if(res.confirm){
          wx.request({
            url: getApp().globalData.server + '/Invitation/changeVisitorStatus.do',
            data: {
              invitationId: that.data.invitationId,
              userId: wx.getStorageSync('wxuserInfo').id,
              status: 2
            },
            method: 'get',
            success: function (res) {
              if (res.data = 'SUCCESS') {
                that.data.memberList[that.data.hidenIndex].visitorStatus = 2
                that.setData({
                  memberList: that.data.memberList
                })
                wx.showToast({
                  title: '接受成功',
                  icon: 'success',
                  duration: 1500
                })
              } else if (res.data = 'confirmCountIsOverflow') {
                wx.showToast({
                  title: '抱歉！人数已满，接受失败',
                  icon: 'none',
                  duration: 1500
                })
              } else {
                wx.showToast({
                  title: '出现异常，请重试',
                  icon: 'none',
                  duration: 1500
                })
              }
            }
          })
        }
      }
    }) 
  },
  //折叠或展开
  expand: function(){
    this.setData({
      hidenTag: !this.data.hidenTag
    })
  },
  clickItem: function (e) {
    var index = e.currentTarget.dataset.index
    // console.log("查看第" + (index + 1) + "项")
    if(this.data.hidenIndex!=index){
      this.setData({
        hidenIndex: index,
        hidenTag: true,
        index: index
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    var detail=JSON.parse(options.detail)
    //获得邀请人员列表请求
    wx.request({
      url: getApp().globalData.server + '/Invitation/getOneInvitationVisitors.do',
      method: 'get',
      data: {
        invitationId: detail.id
      },
      success: function (res) {
        console.log("成员列表:" )
        if(res.data!=null){
          that.setData({
            memberList: res.data
          })
        }   
      }
    })
    var invitor = that.data.invitor
    invitor.name = detail.invitationManName
    invitor.phone = detail.invitationManPhone
    invitor.company = detail.invitationManAddress
    var date = util.tranStamp(detail.visitorDay,0)
    that.setData({
      reason: detail.reason,
      year: date[0],
      month: date[1],
      day: date[2],
      starttime: util.tranStamp(detail.startTime, 1),
      endtime: util.tranStamp(detail.endTime, 1),
      address: detail.devNames,
      num: detail.visitorCount,
      vistorName: detail.visitorLinkmanName,
      vistorPhone: detail.visitorLinkmanPhone,
      invitationId: detail.id,//邀请id
      invitor: invitor,
    })
    if (util.compareTime(that)) {
      console.log("该邀请未过期")
    } else {
      console.log("该邀请已过期")
      that.setData({
        ddl: true
      })
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
  onShareAppMessage: function (res) {
    var that = this
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: '邀请函',
      path: 'pages/dorecord/visDetail/visDetail?dataset=' + util.tran(this, "vis"),
      imageUrl: '../../resource/images/inv.jpg',
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