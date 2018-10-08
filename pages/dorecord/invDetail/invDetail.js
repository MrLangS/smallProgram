// pages/dorecord/invDetail/invDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reason:'',
    year: '',
    month:'',
    day: '',
    starttime: '',
    endtime: '',
    address: '',
    num: 0,
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
    this.setData({
      reason: detail.reason,
      year: detail.year,
      month: detail.month,
      day: detail.day,
      starttime: detail.starttime,
      endtime: detail.endtime,
      address: detail.address,
      num: detail.num
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