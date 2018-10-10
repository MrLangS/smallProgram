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
    iscode: '01',//用于存放验证码接口里获取到的code
    avatarUrl: "../resource/images/timg.png", //默认头像图片
    logIcon: "../resource/images/logIcon.png",
    phoneIcon: "../resource/images/phone.png",
    pwdIcon: "../resource/images/pwdIcon.png",
    verifiIcon: "../resource/images/verifiIcon.png",
    companyIcon: "../resource/images/company.png",
    imgArr: ['D:/627wx1/wx_app/pages/resource/images/timg.png'],
    codename: '获取验证码'
  },
  //预览头像
  preview: function (e) {
    var that=this
    var imgArr=this.data.imgArr
    wx.previewImage({
      urls: imgArr,
      success: function(res) {},
      fail: function(res){},
      complete: function(e){}
    })
  },
  //添加头像
  onPicBtn: function(){
    var that=this
    var imgArr = that.data.imgArr
    var openIdValue = wx.getStorageSync('openid');
    console.log(openIdValue)
    wx.chooseImage({
      count: 1,
      sizeType: ['original','compressed'],
      sourceType: ['album','camera'],
      success: function(res) {
        var uploadUserUrl = getApp().globalData.server + "/SysWXUserAction/uploadPhoto.do"
        var tempFilePaths=res.tempFilePaths
        if(tempFilePaths.length>0){
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
                  title: '图片不合格',
                  icon: 'loading',
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
    this.getCode();
    var that = this
    that.setData({
      disabled: true
    })
  },
  getCode: function () {
    var a = this.data.phone;
    var _this = this;
    if (this.checkPhone()){
      wx.request({
        url: getApp().globalData.server + "/SysWXUserAction/registerWXUser.do",
        data: {},
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
  
  //提交表单信息
  formSubmit: function(e){
    var that=this
    var formIdValue=e.detail.formId
    var openIdValue = wx.getStorageSync('openid');
    console.log('get openid is: ' + openIdValue)
    var flag=util.checkForm(this)//图片还没加，为了方便测试
    // var flag=this.checkName()&&this.checkPhone()&&this.checkCode()
    
    var uploadUserUrl ="" //getApp().globalData.server + 'UserApplyAction!uploadUserInfo.do'
    if(flag){
      wx.request({
        url: getApp().globalData.server + "/SysWXUserAction/registerWXUser.do",
        data:{
          wxOpenId: openIdValue,
          username: that.data.name,
          address: that.data.company,
          phonenum: that.data.phone,
          photoURL: that.data.avatarUrl,
          formId: formIdValue
        },
        method: 'post',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data)
          if(res.data.msg=='ok'){
            console.log('注册成功...')
            wx.setStorageSync("wxuserInfo", res.data.sysWXUser)
            wx.showToast({
              title: '注册成功',
              icon: 'success',
              duration: 1500
            })
          }else{
            console.log('注册失败...')
            wx.showToast({
              title: '注册失败',
              icon: 'loading',
              duration: 1500
            })
          }
          
          // wx.redirectTo({
          //   url: 'wait/wait',
          // })

        },
        fail: function (e) {
        },
      })
    }
  },

  //     wx.setStorageSync('name', this.data.name);
  //     wx.setStorageSync('phone', this.data.phone);
  //     wx.redirectTo({
  //       url: '../add/add',
  //     })


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