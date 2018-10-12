// pages/dorecord/thrDetail/thrDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visitList: [
      {
        reason: '讨论', year: '2018', month: '09', day: '29', invitationId: 1,
        invitor: { name: '老王', company: '老王公司', phone: '18201020394' }, show: 1,
        starttime: '09:00', endtime: '14:00', address: '北京', num: 2
      },
      {
        reason: '学术', year: '2018', month: '08', day: '31', invitationId: 2,
        invitor: { name: '老汪', company: '老汪公司', phone: '18201020394' }, show: 0,
        starttime: '13:00', endtime: '14:00', address: '上海', num: 1
      },
      {
        reason: '研究', year: '2018', month: '07', day: '11', invitationId: 3,
        invitor: { name: '老郎', company: '老郎公司', phone: '18201020394' }, show: 2,
        starttime: '08:00', endtime: '14:00', address: '吉林', num: 4
      },
      {
        reason: '会议', year: '2018', month: '09', day: '29', invitationId: 4,
        invitor: { name: '老曲', company: '老曲公司', phone: '18201020394' }, show: 1,
        starttime: '11:00', endtime: '14:00', address: '江西', num: 3
      },
      {
        reason: '峰会', year: '2018', month: '06', day: '06', invitationId: 5,
        invitor: { name: '老江', company: '老江公司', phone: '18201020394' }, show: 1,
        starttime: '09:00', endtime: '14:00', address: '杭州', num: 11
      }
    ],
    jso:{},
  },

  add: function(){
    var json = this.data.jso
    json.name='hello'
    this.setData({
      jso: json
    })
    console.log(this.data.jso)
  },
  test: function(){
    var testList = this.data.visitList
    for (var vis of testList){
      vis.test01=1
    }
    this.setData({
      visitList:testList
    })
    console.log(this.data.visitList)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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