var util = require('../../../utils/util.js')
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    authorizeTAG: false,
    invitationId: '',//邀请id
    invitor: { name: '', company: '', phone: '' },
    vistorName: '',
    vistorPhone: '',
    reason: '',
    // starttime: '',
    // endtime: '',
    address: '',
    num: 1,
    status:1,
    callIcon: '../../resource/images/call.png',
    invPNG: '../../resource/images/invited.png',
    downPNG: '../../resource/images/down.png',
    winWidth: '',
    winHeight: '',
    registed: 0,//1代表用户已注册
    // 访客部分信息
    picId: 0,
    name: '',//姓名
    phone: '',//手机号
    visCompany: '',
    code: '',//验证码
    picManage: '添加头像',
    disabled: false,
    disAccept: false,
    iscode: '',//用于存放验证码接口里获取到的code
    avatarUrl: "../../resource/images/default.png", //默认头像图片
    logIcon: "../../resource/images/user_background.png",
    phoneIcon: "../../resource/images/phone.png",
    pwdIcon: "../../resource/images/pwdIcon.png",
    verifiIcon: "../../resource/images/verifiIcon.png",
    companyIcon: "../../resource/images/company.png",
    imgArr: ['D:/627wx1/wx_app/pages/resource/images/default.png'],
    quality: 1,//图片质量
    codename: '获取验证码',
    isPost: 0,//判断页面是否由转发进入
    ddl: false,//判断邀请是否过期
  },
  makecall: function(){
    wx.makePhoneCall({
      phoneNumber: this.data.invitor.phone,
    })
  },
  back: function(){
    wx.switchTab({
      url: '../../dorecord/dorecord',
    })
  },
  //接受邀请
  accept: function(e){
    var that=this
    if(app.globalData.sysWXUser){
      //已注册的接受
      wx.showModal({
        title: '提示',
        content: '确认接受邀请吗？',
        success: function (res) {
          if (res.confirm) {
            that.setData({
              disAccept: true
            })
            wx.request({
              url: getApp().globalData.server + '/Invitation/changeVisitorStatus.do',
              data: {
                invitationId: that.data.invitationId,
                userId: getApp().globalData.sysWXUser.id,
                formId: e.detail.formId,
                openId: getApp().globalData.realOpenid,
                status: 2
              },
              method: 'get',
              success: function (res) {
                console.log("确认邀请结果信息:")
                console.log(res.data)
                if (res.data = 'SUCCESS') {
                  that.setData({
                    status: 2
                  })
                  wx.showToast({
                    title: '接受成功',
                    icon: 'success',
                    duration: 1500
                  })
                } else if (res.data == 'confirmCountIsOverflow') {
                  wx.showToast({
                    title: '人数已满，接受失败',
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
    }else{
      //未注册的接受
      wx.navigateTo({
        url: '../../regWxUser/regWxUser?invitationId=' +that.data.invitationId,
      })
    }
    
  },
  //未注册的接受   ()
  accept02: function (e) {
    var that=this
    if (util.checkForm(that)){
      wx.showModal({
        title: '提示',
        content: '确认接受邀请吗？',
        success: function (res) {
          console.log(res.confirm)
          if (res.confirm) {
            that.setData({
              disAccept: true
            })
            wx.request({
              url: getApp().globalData.server + '/Invitation/addVisitorAndRegisterUser.do',
              method: 'post',
              data: {
                wxOpenId: getApp().globalData.openid,
                username: that.data.name,
                address: that.data.visCompany,
                phonenum: that.data.phone,
                photoURL: that.data.avatarUrl,
                picId: that.data.picId,
                invitationId: that.data.invitationId,
                formId: e.detail.formId,
                openId: getApp().globalData.realOpenid,
              },
              success: function (res) {
                console.log(res)
                if (res.data.msg == 'ok') {
                  wx.setStorageSync('wxuserInfo', res.data.sysWXUser);
                  wx.setStorageSync('registed', 1)
                  that.setData({
                    status: 2
                  })
                  wx.showToast({
                    title: '接受成功',
                    icon: 'success',
                    duration: 1500
                  })
                } else if (res.data.msg = 'confirmCountIsOverflow') {
                  wx.showToast({
                    title: '人数已满，接受失败',
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
    }
  },

  onLoad: function (options) {
    var that = this

    //初始化页面的数据
    if (typeof (options.dataset) != 'undefined') {
      util.inviteInfo(that, options.dataset, 0)
      that.setData({
        status: 1,
        isPost: 1
      })

      // 查看是否授权
      wx.getSetting({
        success: function (res) {
          console.log(res)
          if (res.authSetting['scope.userInfo']) {
            //登录
            util.login()

          } else {
            wx.navigateTo({
              url: '/pages/authorize/authorize?tag=1',
            })
          }
        }
      })

    } else {
      util.inviteInfo(that, options.detail, 1)
    }

    if (util.compareTime(that)) {
      console.log("该邀请未过期")
    } else {
      console.log("该邀请已过期")
      that.setData({
        status: 4
      })
    }
    
  },

  onShow: function () {
    var that=this
    if(this.data.authorizeTAG){
      //登录
      util.login()
    }
  },

  onReady: function () {
    //为邀请函添加访客
    var that = this
    
    if (this.data.isPost == 1 && wx.getStorageSync('wxUserId')){
      console.log('userId:' + wx.getStorageSync('wxUserId'))
      var invIdArr = wx.getStorageSync('invIdArr')
      console.log('invIdArr:')
      console.log(invIdArr)
      var idArr = invIdArr ? invIdArr : []
      if (idArr.indexOf(that.data.invitationId) == -1){
        console.log('未关联邀请')
        wx.request({
          url: app.globalData.server + '/Invitation/addVisitor.do',
          method: 'get',
          data: {
            invitationId: that.data.invitationId,
            userId: wx.getStorageSync('wxUserId')
          },
          success: function (res) {
            idArr.push(that.data.invitationId)
            wx.setStorageSync('invIdArr', idArr)
          }
        })
      }else{
        console.log('已关联邀请')
        this.setData({
          accepted: true,
          status: 2
        })
      }
    }
  },
  /**
   * 转发
   */
  onShareAppMessage: function (res) {
    var that = this
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: '邀请函',
      path: 'pages/dorecord/visDetail/visDetail?dataset=' + util.tran(this,"vis"),
      imageUrl: '../../resource/images/inv.jpg',
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
        var shareTickets = res.shareTickets;

      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },

})