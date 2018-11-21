// pages/dorecord/visDetail/visDetail.js
var util = require('../../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    invitationId: '',//邀请id
    invitor: { name: '', company: '', phone: '' },
    vistorName: '',
    vistorPhone: '',
    reason: '',
    year: '',
    month: '',
    day: '',
    starttime: '',
    endtime: '',
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
    headpic: '',//头像
    name: '',//姓名
    phone: '',//手机号
    visCompany: '',
    code: '',//验证码
    picManage: '添加头像',
    disabled: false,
    iscode: '',//用于存放验证码接口里获取到的code
    avatarUrl: "../../resource/images/default.png", //默认头像图片
    logIcon: "../../resource/images/logIcon.png",
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
      url: '../../index/index',
    })
  },
  scrollDown: function () {
    wx.pageScrollTo({
      scrollTop: this.data.winHeight,
      duration: 500
    })
  },
  scrollUp: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 500
    })
  },
  scrBotm:function(){
    wx.pageScrollTo({
      scrollTop: 2000,
      duration: 500
    })
  },
  //接受邀请
  //已注册的接受
  accept01: function(){
    var that=this
    wx.showModal({
      title: '提示',
      content: '确认接受邀请吗？',
      success: function (res) {
        console.log(res.confirm)
        if (res.confirm){
          wx.request({
            url: getApp().globalData.server + '/Invitation/changeVisitorStatus.do',
            data: {
              invitationId: that.data.invitationId,
              userId: wx.getStorageSync('wxuserInfo').id,
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
              } else if (res.data = 'confirmCountIsOverflow') {
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
  },
  //未注册的接受
  accept02: function () {
    var that=this
    if (util.checkForm(that)){
      wx.showModal({
        title: '提示',
        content: '确认接受邀请吗？',
        success: function (res) {
          console.log(res.confirm)
          if (res.confirm) {
            wx.request({
              url: getApp().globalData.server + '/Invitation/addVisitorAndRegisterUser.do',
              method: 'post',
              data: {
                wxOpenId: wx.getStorageSync('openid'),
                username: that.data.name,
                address: that.data.visCompany,
                phonenum: that.data.phone,
                photoURL: that.data.avatarUrl,
                invitationId: that.data.invitationId,
              },
              success: function (res) {
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

  test: function(){
    console.log("转发测试")
    console.log(this.data.registed)
    console.log(typeof(this.data.registed))
    console.log(this.data.status)
  },
  onLoad: function (options) {
    var that = this
    //初始化页面的数据
    if (typeof (options.dataset) != 'undefined'){
      //登录
      util.login(that)
      util.inviteInfo(that, options.dataset, 0)
      that.setData({
        // registed: wx.getStorageSync('registed'),
        // registed: 0,
        status:1,
        isPost: 1
      })
      console.log('测试')
      console.log(this.data.registed)
      console.log(this.data.status)
    }else{
      console.log('测试2')
      console.log(options.detail)
      util.inviteInfo(that, options.detail,1)
      that.setData({
        registed: wx.getStorageSync('registed')
      })
    }
    
    if(util.compareTime(that)){
      console.log("该邀请未过期")
    }else{
      console.log("该邀请已过期")
      that.setData({
        status: 4
      })
    }
    //获得手机屏幕信息
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
    //为邀请函添加访客
    if (this.data.isPost==1&&wx.getStorageSync('wxuserInfo').id!=null){
      wx.request({
        url: getApp().globalData.server + '/Invitation/addVisitor.do',
        method: 'get',
        data: {
          invitationId: this.data.invitationId,
          userId: wx.getStorageSync('wxuserInfo').id
        },
        success: function (res) {
          console.log(res.data)
        }
      })
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
  },
  // 个人填写信息部分
  //预览头像
  preview: function (e) {
    var that = this
    var imgArr = this.data.imgArr
    wx.previewImage({
      urls: imgArr,
      success: function (res) { },
      fail: function (res) { },
      complete: function (e) { }
    })
  },
  //添加头像
  onPicBtn: function () {
    var that = this
    var imgArr = that.data.imgArr
    var openIdValue = wx.getStorageSync('openid');
    console.log(openIdValue)
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var uploadUserUrl = getApp().globalData.server + "/SysWXUserAction/uploadPhoto.do"
        var tempFilePaths = res.tempFilePaths
        if (tempFilePaths.length > 0) {
          imgArr[0] = tempFilePaths[0]
          wx.uploadFile({
            url: uploadUserUrl,
            filePath: tempFilePaths[0],
            name: 'personPhoto',
            header: { "Content-Type": "multipart/form-data" },
            formData: {
              openId: openIdValue
            },
            success: function (res) {
              console.log('上传图片请求...')
              var data = JSON.parse(res.data)
              console.log(data)
              if (data.quality == 0) {
                that.setData({
                  avatarUrl: data.photoURL,
                  imgArr: imgArr,
                  quality: 0,
                })
                wx.showToast({
                  title: '上传成功',
                  icon: 'success',
                  duration: 1500
                })
              } else {
                wx.showToast({
                  title: '照片须为本人清晰头像',
                  icon: 'none',
                  duration: 1500
                })
              }
            },
            fail: function (res) {
              console.log('上传失败...')
              wx.showModal({
                title: '提示',
                content: '上传失败',
                showCancel: false
              })
            },
          })
        }

      },
    })
  },
  //自动获取微信绑定手机号，需要微信认证可使用
  getPhoneNumber: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedDate)
    if (e.detail.errMsg == 'getPhoneNumber:fail 该 appid 没有权限') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function (res) { }
      })
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '同意授权',
        success: function (res) { }
      })
    }
  },
  //获取input输入框的值
  getNameValue: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  getPhoneValue: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  getCodeValue: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  getCompany: function (e) {
    this.setData({
      visCompany: e.detail.value
    })
  },
  //获取验证码
  getVerificationCode() {
    util.getCode(this)
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

  }

})