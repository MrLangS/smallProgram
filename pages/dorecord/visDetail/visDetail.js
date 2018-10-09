// pages/dorecord/visDetail/visDetail.js
var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invitor: '',
    reason: '',
    year: '',
    month: '',
    day: '',
    starttime: '',
    endtime: '',
    address: '',
    num: 1,
    show:0,
    callIcon: '../../resource/images/call.png',
    winWidth: '',
    winHeight: '',
    registed: 1,//1代表用户已注册
    // 访客部分信息
    headpic: '',//头像
    name: '',//姓名
    visphone: '',//手机号
    visCompany: '',
    code: '',//验证码
    picManage: '添加头像',
    iscode: '01',//用于存放验证码接口里获取到的code
    avatarUrl: "../../resource/images/timg.png", //默认头像图片
    logIcon: "../../resource/images/logIcon.png",
    phoneIcon: "../../resource/images/phone.png",
    pwdIcon: "../../resource/images/pwdIcon.png",
    verifiIcon: "../../resource/images/verifiIcon.png",
    companyIcon: "../../resource/images/company.png",
    imgArr: ['D:/627wx1/wx_app/pages/resource/images/timg.png'],
    codename: '获取验证码',
  },
  makecall: function(){
    wx.makePhoneCall({
      phoneNumber: this.data.phone,
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
  //接受邀请
  accept: function(){
    // wx.request({
    //   url: '',
    //   method: 'post',
    //   data:{},
    //   success: function(res){

    //   }
    // })
    this.setData({
      show: 1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //初始化页面的数据
    if(options.dataset!=null){
      util.inviteInfo(this,options.dataset)
    }else{
      util.inviteInfo(this, options.detail)
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: '邀请函',
      path: 'pages/dorecord/visDetail/visDetail?dataset=' + util.tran(this,"vis"),
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
    console.log("预览头像")
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
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        if (tempFilePaths.length > 0) {
          imgArr[0] = tempFilePaths[0]
          that.setData({
            avatarUrl: tempFilePaths,
            imgArr: imgArr,
            picManage: '更换头像'
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
    this.getCode();
    var that = this
    that.setData({
      disabled: true
    })
  },
  getCode: function () {
    var a = this.data.phone;
    var _this = this;
    if (util.checkPhone(this)) {
      wx.request({
        data: {},
        'url': '接口地址',
        success(res) {
          console.log(res.data.data)
          _this.setData({
            iscode: res.data.data
          })
          var num = 61;
          var timer = setInterval(function () {
            num--;
            if (num <= 0) {
              clearInterval(timer);
              _this.setData({
                codename: '重新发送',
                disabled: false
              })

            } else {
              _this.setData({
                codename: num + "s"
              })
            }
          }, 1000)
        }
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

  }

})