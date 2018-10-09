var util=require('../../utils/util.js')
var year=util.getPicker('year')
var month=util.getPicker('month')
var day=util.getPicker('day')
//缓存 日期选择器 改变前的日期
function buff(that) {
  year = that.data.year
  month = that.data.month
  day = that.data.day
}
Page({
  data: {
    starttime: '09:00',
    endtime: '14:00',
    address: '',
    hideTag: false,
    numArr: util.getPickerList('nums'),
    index: 0,
    hiddenmodal: true,
    years: util.getPickerList('years'),
    year: year,
    months: util.getPickerList('months'),
    month: month,
    days: util.getPickerList('days'),
    day: day,
    currentDay: {year : util.getPicker('year'), month : util.getPicker('month'), day : util.getPicker('day')},
    value: util.getPicker('arr'),
    invitor: {name: '郎某',company: '人人智能',phone: '18401610488'},
    role: "admin",
    registed: 0,
    reason: '学术讨论学术研究',  
  },
  //时间选择器事件
  startTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      starttime: e.detail.value
    })
  },
  endTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      endtime: e.detail.value
    })
  },
  //人数选择器事件
  bindNumChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  //日期选择器事件
  bindChange: function (e) {
    const val = e.detail.value
    console.log(val)  
    this.setData({
      year: this.data.years[val[0]],
      month: this.data.months[val[1]],
      day: this.data.days[val[2]]
    })
  },
  //转换邀请页面
  switchChange: function(){
    this.setData({
      hideTag: !this.data.hideTag
    })
  },
  //弹出框
  chooseDay: function () {
    buff(this)
    console.log("改变前日期为:"+year+"/"+month+"/"+day)
    this.setData({
      hiddenmodal: !this.data.hiddenmodal
    })
  },
  cancel: function () {
    this.setData({
      hiddenmodal: true,
      year: year,
      month: month,
      day: day
    });
  },
  confirm: function () {
    this.setData({
      hiddenmodal: true
    })
  },
  //测试
  test: function(){
    console.log("test")
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket:true
    })
    var that=this
    var staffId = wx.getStorageSync('wxuserInfo').staffId
    if (staffId!=null){
      wx.request({
        url: getApp().globalData.server +'/Invitation/getRegions.do',
        data: { staffId: staffId},
        method: 'get',
        success: function(res){
          console.log(res.data[0])
        }
      })
    }
    // if (wx.getStorageSync("registed")==1){
    //   var info = wx.getStorageSync('wxuserInfo')
    //   that.setData({
    //     name: info.username,
    //     visCompany: info.company,
    //     phone: info.phonenum,
    //     registed: 1,
    //     // avatarUrl: ''
    //   })
    // }
    
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
   * 用户点击分享
   */
  onShareAppMessage: function (res) {
    var that=this
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: '邀请函',
      // path: 'pages/invite/invite?dataset='+util.tran(this),
      path: 'pages/dorecord/visDetail/visDetail?dataset=' + util.tran(this,"inv"),
      success: function (res) {
        // 转发成功
        //提交邀请表单
        //that.invformSubmit()
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
        /*发起邀请请求*/
        // wx.request({
        //   url: getApp().globalData.server + "/SysWXUserAction/registerWXUser.do",
        //   data: {
        //     wxOpenId: openIdValue,
        //     username: that.data.name,
        //     company: that.data.company,
        //     phonenum: that.data.phone,
        //     photoURL: that.data.avatarUrl,
        //     formId: formIdValue
        //   },
        //   method: 'post',
        //   success: function (res) {
        //     console.log(res.data)
        //     if (res.data.msg == 'ok') {
        //       console.log('邀请成功...')
        //       wx.showToast({
        //         title: '邀请成功',
        //         icon: 'success',
        //         duration: 1500
        //       })
        //     } else {
        //       console.log('邀请失败...')
        //       wx.showToast({
        //         title: '邀请失败',
        //         icon: 'loading',
        //         duration: 1500
        //       })
        //     }
        //   },
        // })
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },
  //获取input输入框的值
  getAds: function(e){
    this.setData({
      address: e.detail.value
    })
  },
  getReason: function (e) {
    this.setData({
      reason: e.detail.value
    })
  },

  //提交表单信息
  invformSubmit: function () {
    var invData= this.data
    var openIdValue = wx.getStorageSync('openid');
    console.log('get openid is: ' + openIdValue)
    //var flag = util.checkForm(this)
    var uploadUserUrl = "" //getApp().globalData.server + 'UserApplyAction!uploadUserInfo.do'
    // if(true){
    //   wx.request({
    //     url: '',
    //     method: 'post',
    //     data:{
    //       starttime: invData.starttime,
    //       endtime: endtime,
    //       address: address,
    //       day: day,
    //       invitor: invitor,
    //       company: company,
    //       phone: phone,
    //       reason: reason
    //     },
    //     success: function(res){
          
    //     }
    //   })
    // }
    // if (flag) {
    //   wx.uploadFile({
    //     url: uploadUserUrl,
    //     filePath: that.data.avatarUrl,
    //     name: 'file',
    //     header: { "Content-Type": "multipart/form-data" },
    //     formData: {
    //       openId: openIdValue,
    //       name: that.data.name,
    //       company: that.data.company,
    //       phone: that.data.phone,
    //       formId: formIdValue
    //     },
    //     success: function (res) {
    //       console.log('上传成功...')
    //       var data = res.data

    //       wx.showModal({
    //         title: '提示',
    //         content: '上传成功，请耐心等待审批',
    //         showCancel: false

    //       })

    //       wx.redirectTo({
    //         url: 'wait/wait',
    //       })

    //     },
    //     fail: function (e) {
    //       console.log('上传失败...')
    //       wx.showModal({
    //         title: '提示',
    //         content: '上传失败',
    //         showCancel: false
    //       })
    //     },
    //   })
    // }
  },
})