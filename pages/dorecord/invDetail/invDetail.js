// pages/dorecord/invDetail/invDetail.js
var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invitationId: '',//邀请id
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
    hidenIndex: null,
    hidenTag: false,
    memberList: [
      { head: '../../resource/images/timg.png', name: '小明', company: '人人智能', phone: '18401610488', show: 1 },
      { head: '../../resource/images/timg.png', name: '小红', company: '小红公司', phone: '18234343443', show: 1 },
      { head: '../../resource/images/timg.png', name: '小光', company: '小光公司', phone: '15464342343', show: 1 },
      { head: '../../resource/images/timg.png', name: '小亮', company: '小亮公司', phone: '17332434255', show: 1 },
    ]
  },

  //拒绝事件
  reject: function(){
    var that=this
    that.data.memberList[that.data.hidenIndex].show=0
    that.setData({
      memberList: that.data.memberList
    })
  },
  //接受事件
  accept: function(){
    var that = this
    that.data.memberList[that.data.hidenIndex].show = 1
    that.setData({
      memberList: that.data.memberList
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
    console.log("查看第" + (index + 1) + "项")
    if(this.data.hidenIndex!=index){
      this.setData({
        hidenIndex: index,
        hidenTag: true
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
        console.log(res)
        // this.setData({
        //   memberList: res.data
        // })

      }
    })
    var invitor = this.data.invitor
    invitor.name = detail.invitationManName
    invitor.phone = detail.invitationManPhone
    invitor.company = detail.invitationManAddress
    var date = util.tranStamp(detail.visitorDay,0)
    this.setData({
      reason: detail.reason,
      year: date[0],
      month: date[1],
      day: date[2],
      starttime: util.tranStamp(detail.startTime, 1),
      endtime: util.tranStamp(detail.endTime, 1),
      address: detail.regionNames,
      num: detail.visitorCount,
      vistorName: detail.visitorLinkmanName,
      vistorPhone: detail.visitorLinkmanPhone,
      invitationId: detail.id,//邀请id
      invitor: invitor,
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