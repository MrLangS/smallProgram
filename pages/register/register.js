var util = require('../../utils/util.js')
Page({
  data: {
    quality: 1,//头像合格判断
    name: '',//姓名
    phone: '',//手机号
    code: '',//验证码
    company: '',//公司名称
    picManage: '添加头像',
    disabled: false,
    registed: 0,
    iscode: '',//用于存放验证码接口里获取到的code
    avatarUrl: "../resource/images/default.png", //默认头像图片
    logIcon: "../resource/images/logIcon.png",
    phoneIcon: "../resource/images/phone.png",
    pwdIcon: "../resource/images/pwdIcon.png",
    verifiIcon: "../resource/images/verifiIcon.png",
    companyIcon: "../resource/images/company.png",
    imgArr: ['D:/627wx1/wx_app/smallProgram/pages/resource/images/default.png'],
    codename: '获取验证码',
    list: [],
    picId: 0,
    modal: true,
    staffId: 0,
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      staffId: e.detail.value
    })
  },
  cancel: function () {
    this.setData({
      modal: true,
      staffId: 0
    });
  },
  confirm: function () {
    var that=this
    if (this.data.staffId==0){
      wx.showToast({
        title: '请选择对应的内部人员',
        icon: 'none',
        duration: 1500,
      })
    }else{
      this.setData({
        modal: true
      })
      //添加人员
      var openIdValue = wx.getStorageSync('openid');
      wx.request({
        url: getApp().globalData.server + "/SysWXUserAction/registerWXUser.do",
        data: {
          wxOpenId: openIdValue,
          username: that.data.name,
          address: that.data.company,
          phonenum: that.data.phone,
          photoURL: that.data.avatarUrl,
          staffId: parseInt(that.data.staffId), 
          picId: that.data.picId,
        },
        method: 'post',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data)
          if (res.data.msg == 'ok') {
            console.log('注册成功...')
            wx.setStorageSync("wxuserInfo", res.data.sysWXUser)
            wx.setStorageSync('registed', 1)
            wx.redirectTo({
              url: '../result/result',
            })
          } else {
            console.log('注册失败...')
            wx.showToast({
              title: '注册失败',
              icon: 'loading',
              duration: 1500
            })
          }
        },
        fail: function (e) {
        },
      })
      
    }
  },
  //提交表单信息
  formSubmit: function (e) {
    var that = this
    var formIdValue = e.detail.formId
    var flag = util.checkForm(this)//表单验证
    var uploadUserUrl = "" //getApp().globalData.server + 'UserApplyAction!uploadUserInfo.do' 

    if (flag){
      wx.request({
        url: getApp().globalData.server + '/SysWXUserAction/getPersonByPhoneNum.do?phoneNum=' + that.data.phone,
        method: 'post',
        success: (res) => {
          console.log(res)
          var list = res.data
          if (list.length == 0) {
            console.log('不是内部用户手机号')
            wx.showToast({
              title: '抱歉，该手机号非内部用户手机号，不能注册',
              icon: 'none',
              duration: 2000,
            })
          } else {
            for (let i in list) {
              console.log(i)
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
    }
  },
  //预览头像
  // preview: function (e) {
  //   var that=this
  //   var imgArr=this.data.imgArr
  //   wx.previewImage({
  //     urls: imgArr,
  //     success: function(res) {},
  //     fail: function(res){},
  //     complete: function(e){}
  //   })
  // },

  //添加头像avatarUrl
  onPicBtn: function(){
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var uploadUserUrl = getApp().globalData.server + "/SysWXUserAction/uploadPhoto.do"
        var tempFilePaths = res.tempFilePaths
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            // console.log('data:image/png;base64,' + res.data)
            console.log(res)
            wx.request({
              url: uploadUserUrl,
              method: 'post',
              data: {
                personPhoto: res.data
              },
              success: (res) => {
                console.log('上传图片请求结果：')
                console.log(res)
                if (res.data.quality == 0) {
                  that.setData({
                    avatarUrl: res.data.photoURL,
                    picId: res.data.picId,
                    quality: 0,
                  })
                } else {
                  wx.showToast({
                    title: '上传失败,图片须为本人清晰头像',
                    icon: 'none',
                    duration: 1500
                  })
                }
              }
            })
          },
          fail: (res) => {
            wx.showToast({
              title: '网络开小差，请稍后再试',
              icon: 'none',
              duration: 1500
            })
          }
        })
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
  getCompanyValue: function(e){
    this.setData({
      company: e.detail.value
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

  //获取验证码
  getVerificationCode() {
    util.getCode(this)
  },
  
  onLoad: function (options) {
    util.login(this)
  },
})