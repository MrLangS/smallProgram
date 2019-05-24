var util=require('../../utils/util.js')
var year=util.getPicker('year')
var month=util.getPicker('month')
var day=util.getPicker('day')
var app = getApp()

Page({
  data: {
    bcgImg: '../resource/images/2.jpg',
    address: '',
    regionList: [],
    regionIds: [],
    hideTag: false,
    hideTag01:true,
    numArr: util.getPickerList('nums'),
    index: 0,
    hiddenmodal: true,
    modal_are: true,
    currentDay: {year : util.getPicker('year'), month : util.getPicker('month'), day : util.getPicker('day')},
    value: util.getPicker('arr'),
    invitor: {name: '',company: '',phone: ''},
    reason: '',  
    vistorName: '',//代表成员姓名
    vistorPhone: '',//代表成员手机号
    count: 0,//记录点击邀请按钮的次数
    invitationId: 0,//邀请id 
    list: [],
    modal: true,
    staffId: 0,
    //时间选择器
    isPickerRender: false,
    isPickerShow: false,
    startTimeArr: util.getTimeAfter(10).split(' '),
    endTimeArr: util.getLastTime().split(" "),
    pickerConfig: {
      endDate: true,
      column: "minute",
      dateLimit: true,
      initStartTime: util.getTimeAfter(10),
      initEndTime: util.getLastTime(),
      limitStartTime: "2015-05-06 12:32:44",
      limitEndTime: "2055-05-06 12:32:44"
    }
  },

  pickerShow: function () {
    this.setData({
      isPickerShow: true,
      isPickerRender: true,
      chartHide: true
    });
  },
  pickerHide: function () {
    this.setData({
      isPickerShow: false,
      chartHide: false
    });
  },

  bindPickerChange: function (e) {
    this.getData(this.data.sensorList[e.detail.value].id);
    this.setData({
      index: e.detail.value,
      sensorId: this.data.sensorList[e.detail.value].id
    });
  },
  setPickerTime: function (val) {
    let data = val.detail;
    this.setData({
      startTimeArr: data.startTime.split(" "),
      endTimeArr: data.endTime.split(" ")
    });
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
    this.setData({
      starttime: e.detail.value
    })
  },
  endTimeChange: function (e) {
    this.setData({
      endtime: e.detail.value
    })
  },
  //人数选择器事件
  bindNumChange: function (e) {
    this.setData({
      index: e.detail.value
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
    this.setData({
      modal_are: !this.data.modal_are
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
  
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket:true
    })
    
  },

  onShow: function () {
    var that = this
    var staff = app.globalData.staff
    if (staff.id) {
      var invitor = this.data.invitor
      invitor.name = staff.personName
      invitor.phone = staff.phoneNo
      invitor.company = staff.personCompany
      wx.request({
        url: getApp().globalData.server + '/Invitation/getdevices.do',
        data: { staffId: staff.id },
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

  //确认邀请函
  invite: function(e){
    var that = this
    if (util.checkInvitation(this)){
      if (that.data.count == 0) {
        /*发起邀请请求*/
        var invitor = app.globalData.staff
        
        wx.request({
          url: getApp().globalData.server + "/Invitation/sponsorInvitation.do",
          data: {
            startTime: that.data.startTimeArr.join("\ "),
            endTime: that.data.endTimeArr.join("\ "),
            visitorCount: that.data.numArr[that.data.index],
            staffId: invitor.id,
            username: invitor.personName,
            phonenum: invitor.phoneNo,
            company: invitor.personCompany,
            visitorLinkmanName: that.data.vistorName,
            visitorLinkmanPhone: that.data.vistorPhone,
            reason: that.data.reason,
            devIds: that.data.regionIds,
            formId: e.detail.formId,
            openId: getApp().globalData.realOpenid,
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
        var invitor = app.globalData.staff
        wx.request({
          url: getApp().globalData.server + "/Invitation/updateInvitation.do",
          data: {
            startTime: that.data.startTimeArr.join("\ "),
            endTime: that.data.endTimeArr.join("\ "),
            visitorCount: that.data.numArr[that.data.index],
            staffId: invitor.id,
            username: invitor.personName,
            phonenum: invitor.phoneNo,
            company: invitor.personCompany,
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
    //转发部分
    return {
      title: '邀请函',
      path: 'pages/dorecord/visDetail/visDetail?dataset=' + util.tran(that, "inv"),
      imageUrl: '../resource/images/inv.jpg',
      success: function (res) {
        that.setData({
          hideTag01: false
        })
        console.log("转发成功:" + JSON.stringify(res));
        var shareTickets = res.shareTickets;
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

})