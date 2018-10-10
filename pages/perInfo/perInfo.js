// pages/perInfo/perInfo.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    quality: 1,//头像是否合格
    name: '',//姓名
    phone: '',//手机号
    company: '',
    picManage: '更换头像',
    disabled: false,
    avatarUrl: "../resource/images/timg.png", //默认头像图片
    logIcon: "../resource/images/logIcon.png",
    phoneIcon: "../resource/images/phone.png",
    pwdIcon: "../resource/images/pwdIcon.png",
    verifiIcon: "../resource/images/verifiIcon.png",
    companyIcon: "../resource/images/company.png",
    imgArr: ['D:/627wx1/wx_app/pages/resource/images/timg.png'],
    changeBtn: true,
    inputTag: true,
    focus: false,
    codeTag: true,//验证码区域显示标签
    codename: '获取验证码'
  },
  //修改手机号
  modifyPhone: function(){
    this.setData({
      codeTag: false
    })
  },
  cancelModify:function(){
    this.setData({
      phone: wx.getStorageSync('oldPhone'),
      codeTag: true
    })
  },
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
  //更换头像
  onPicBtn: function () {
    var that = this
    var imgArr = that.data.imgArr
    var openIdValue = wx.getStorageSync('openid');
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
              openId: openIdValue,
              photoId: wx.getStorageSync("wxuserInfo").picId
            },
            success: function (res) {
              console.log('上传图片请求...')
              console.log(res)
              var data = JSON.parse(res.data)
              console.log(data)
              if (data.quality == 0) {
                that.setData({
                  avatarUrl: data.photoURL,
                  imgArr: imgArr,
                  quality: 0,
                })
                wx.showToast({
                  title: '更换成功',
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
              console.log('失败...')
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
  //修改个人信息
  modify: function(){
    wx.setStorageSync("oldPhone", this.data.phone)
    this.setData({
      changeBtn: false,
      inputTag: false,
      focus: true
    })
  },
  //修改确认
  formSubmit: function(e){
    var that=this
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    if (util.checkPerInfo(this)){
      wx.request({
        url: getApp().globalData.server + '/SysWXUserAction/updateUserMsg.do',
        data: {
          wxOpenId: wx.getStorageSync("openid"),
          username: this.data.name,
          oldPhoneNO: wx.getStorageSync("oldPhone"),
          newPhoneNO: this.data.phone,
          address: this.data.company
        },
        method: 'post',
        success: function(res){
          console.log(res)
          var user = res.data.sysWXUser
          wx.setStorageSync("wxuserInfo", user)
          that.setData({
            name: user.username,
            company: user.company,
            phone: user.phonenum,
            changeBtn: true,
            inputTag: true,
            focus: false,
            codeTag: true
          })
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 1000
          })
        }
      })
      
    }
  },
  //修改取消
  cancel: function(){
    var initdata = wx.getStorageSync("wxuserInfo")
    this.setData({
      name: initdata.username,
      phone: initdata.phonenum,
      company: initdata.address,
      changeBtn: true,
      inputTag: true,
      focus: false,
      codeTag: true
    })
  },
  //获取input输入框的值
  getNameValue: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  getCompanyValue: function (e) {
    this.setData({
      company: e.detail.value
    })
  },
  getPhoneValue: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var initdata = wx.getStorageSync('wxuserInfo')
    this.setData({
      name: initdata.username,
      phone: initdata.phonenum,
      company: initdata.address,
      avatarUrl: initdata.photoURL,
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