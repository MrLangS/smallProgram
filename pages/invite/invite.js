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
    regionList: [],
    regionIds: [],
    hideTag: false,
    hideTag01:true,
    numArr: util.getPickerList('nums'),
    index: 0,
    hiddenmodal: true,
    modal_are: true,
    years: util.getPickerList('years'),
    year: year,
    months: util.getPickerList('months'),
    month: month,
    days: util.getPickerList('days'),
    day: day,
    // date: [year, month, day],
    currentDay: {year : util.getPicker('year'), month : util.getPicker('month'), day : util.getPicker('day')},
    value: util.getPicker('arr'),
    invitor: {name: '',company: '',phone: ''},
    role: 0,//判断角色，0为普通用户
    registed: 0,
    reason: '',  
    vistorName: '',//代表成员姓名
    vistorPhone: '',//代表成员手机号
    count: 0,//记录点击邀请按钮的次数
    invitationId: 0,//邀请id 
    list: [],
    modal: true,
    staffId: 0,
  },
  //新增空白邀请
  newInv: function () {
    this.setData({
      count: 0,
      year: this.data.currentDay.year,
      month: this.data.currentDay.month,
      day: this.data.currentDay.day,
      starttime: '09:00',
      endtime: '14:00',
      address: '', 
      index: 0,
      reason: '',
      vistorName: '',//代表成员姓名
      vistorPhone: '',//代表成员手机号
      invitationId: 0,//邀请id 
      hideTag: !this.data.hideTag,
      hideTag01: true
    })
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
  //区域多选事件
  checkboxChange: function(e){
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    var text=[]
    var ids=[]
    for(var i=0;i<e.detail.value.length;i++){
      var row=e.detail.value[i].split(',');
      text=text.concat(row[0])
      ids=ids.concat(row[1])
    }
    this.setData({
      address: text,
      regionIds: ids
    })
  },
  //获取区域的值
  getAds: function () {
    // this.setData({
    //   address: e.detail.value
    // })
    this.setData({
      modal_are: !this.data.modal_are
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
  cancel_are: function () {
    this.setData({
      modal_are: true,
    });
  },
  confirm_are: function () {
    this.setData({
      modal_are: true
    })
  },
  
  //测试
  test: function(){
    console.log("test")
    console.log(util.formatTimestamp(this,0))
    console.log(util.formatTime(new Date()))
    if (util.formatTimestamp(this, 0) > util.formatTime(new Date())){
      console.log(true)
    }else{
      console.log(false)
    }
  },

  bindInterpeo: function(){
    var that=this
    if (typeof (wx.getStorageSync('wxuserInfo').phonenum)!="undefined"){
      var phonenum = wx.getStorageSync('wxuserInfo').phonenum
      wx.request({
        url: getApp().globalData.server + '/SysWXUserAction/getPersonByPhoneNum.do?phoneNum=' + phonenum,
        method: 'post',
        success: (res) => {
          console.log(res)
          var list = res.data
          if (list.length == 0) {
            console.log('不是内部用户手机号')
            wx.showToast({
              title: '抱歉，您非内部用户，不能绑定',
              icon: 'none',
              duration: 2000,
            })
          } else {
            for (let i in list) {
              list[i].createTime = list[i].createTime.substr(0, 10)
            }
            that.setData({
              list: list
            })
            this.setData({
              modal: !this.data.modal
            })
          }
        }
      })
    }else{
      wx.showToast({
        title: '抱歉！您当前尚未注册',
        icon: 'none',
        duration: 2000
      })
    }
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      staffId: e.detail.value
    })
  },
  cancel01: function () {
    this.setData({
      modal: true,
    });
  },
  confirm01: function () {
    var that = this
    if (this.data.staffId == 0) {
      wx.showToast({
        title: '请选择对应的内部人员',
        icon: 'none',
        duration: 1500,
      })
    } else {
      var openid = wx.getStorageSync('openid')
      wx.request({
        url: getApp().globalData.server + '/SysWXUserAction/relevanceInnerPerson.do?openId=' + openid +'&staffId='+that.data.staffId,
        method: 'post',
        success: (res)=>{
          console.log(res)
          if (res.data.staffId){
            that.setData({
              role: 1
            })
            var userInfo = wx.getStorageSync('wxuserInfo')
            userInfo.staffId = that.data.staffId
            wx.setStorageSync('wxuserInfo', userInfo)
            var invitor = that.data.invitor
            invitor.name = userInfo.username
            invitor.phone = userInfo.phonenum
            invitor.company = userInfo.company
            wx.request({
              url: getApp().globalData.server + '/Invitation/getdevices.do',
              data: { staffId: that.data.staffId },
              method: 'get',
              success: function (res) {
                console.log(res)
                that.setData({
                  invitor: invitor,
                  regionList: res.data
                })
              }
            })
          }
          this.setData({
            modal: true
          })
        }
      })
      
    }
  },
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket:true
    })
    
  },

  onShow: function () {
    var that = this
    var userInfo = wx.getStorageSync('wxuserInfo')
    var staffId = userInfo.staffId
    console.log(userInfo)
    if (staffId) {
      that.setData({
        role: 1
      })
      var invitor = this.data.invitor
      invitor.name = userInfo.username
      invitor.phone = userInfo.phonenum
      invitor.company = userInfo.company
      wx.request({
        url: getApp().globalData.server + '/Invitation/getdevices.do',
        data: { staffId: staffId },
        method: 'get',
        success: function (res) {
          console.log("获取设备")
          console.log(res)
          that.setData({
            invitor: invitor,
            regionList: res.data
          })
        }
      })
    }
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
  //确认邀请函
  invite: function(){
    var that = this
    console.log(that.data.count)
    if (util.checkInvitation(this)){
      if (that.data.count == 0) {
        /*发起邀请请求*/
        var date = util.formatDay(that)
        var starttime = util.formatTimestamp(that, 0)
        var endtime = util.formatTimestamp(that, 1)
        var invitor = wx.getStorageSync("wxuserInfo")
        wx.request({
          url: getApp().globalData.server + "/Invitation/sponsorInvitation.do",
          data: {
            visitorDay: date,
            startTime: starttime,
            endTime: endtime,
            visitorCount: that.data.numArr[that.data.index],
            staffId: invitor.staffId,
            username: invitor.username,
            phonenum: invitor.phonenum,
            company: invitor.company,
            visitorLinkmanName: that.data.vistorName,
            visitorLinkmanPhone: that.data.vistorPhone,
            reason: that.data.reason,
            devIds: that.data.regionIds
          },
          method: 'post',
          success: function (res) {
            console.log(res.data)
            if (res.data.msg == 'ok') {
              // wx.setStorageSync('invitationId', res.data.invitationId)
              that.setData({
                invitationId: res.data.invitationId
              })
              console.log('邀请添加成功...')
              console.log("邀请id:" + that.data.invitationId)
              wx.showToast({
                title: '添加邀请成功',
                icon: 'success',
                duration: 1500
              })
            } else {
              console.log('邀请添加失败...')
            }
            that.setData({
              count: ++that.data.count
            })
          },
        })
      } else {
        /*修改邀请请求*/
        var date = util.formatDay(that)
        var starttime = util.formatTimestamp(that, 0)
        var endtime = util.formatTimestamp(that, 1)
        var invitor = wx.getStorageSync("wxuserInfo")
        wx.request({
          url: getApp().globalData.server + "/Invitation/updateInvitation.do",
          data: {
            visitorDay: date,
            startTime: starttime,
            endTime: endtime,
            visitorCount: that.data.numArr[that.data.index],
            staffId: invitor.staffId,
            username: invitor.username,
            company: invitor.company,
            phonenum: invitor.phonenum,
            visitorLinkmanName: that.data.vistorName,
            visitorLinkmanPhone: that.data.vistorPhone,
            reason: that.data.reason,
            invitationId: that.data.invitationId,
            devIds: that.data.regionIds
          },
          method: 'post',
          success: function (res) {
            if (res.data.msg == 'ok') {
              // wx.setStorageSync('invitationId', res.data.invitationId)
              console.log('邀请函修改成功...')
              wx.showToast({
                title: '邀请函修改成功',
                icon: 'success',
                duration: 1500
              })
            } else {
              console.log('邀请函修改失败...')
            }
          },
        })
        that.setData({
          count: ++that.data.count
        })
      }
      this.setData({
        hideTag: !this.data.hideTag
      })
    }
    
  },
  onShareAppMessage: function () {
    var that=this
    // if (res.from === 'button') {
    //   console.log(res.target)
    // }
    //转发部分
    return {
      title: '邀请函',
      path: 'pages/dorecord/visDetail/visDetail?dataset=' + util.tran(that, "inv"),
      imageUrl: '../resource/images/inv.jpg',
      success: function (res) {
        // 转发成功
        //提交邀请表单
        //that.invformSubmit()
        that.setData({
          hideTag01: false
        })
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
        wx.showToast({
          title: '邀请失败',
          icon: 'loading',
          duration: 1500
        })
      }
    }
    //转发部分末尾
  },
  getReason: function (e) {
    this.setData({
      reason: e.detail.value
    })
  },
  getVistorName: function(e){
    this.setData({
      vistorName: e.detail.value
    })
  },
  getVistorPhone: function (e) {
    this.setData({
      vistorPhone: e.detail.value
    })
  },

  //提交表单信息
  invformSubmit: function (e) {
    var invData= this.data
    console.log(e)
  },
})