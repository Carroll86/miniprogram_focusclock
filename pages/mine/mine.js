// pages/mine/mine.js
var app = getApp()
Page({
  onGotUserInfo: function (event) {
    let that = this;
    wx.cloud.callFunction({
      name: "login",
      success: res => {
        console.log("云函数调用成功");
        that.setData({
          openid: res.result.openid,
          userinfo: event.detail.userInfo
        })
        that.data.userinfo.openid = that.data.openid
        wx.setStorageSync('userinfo', that.data.userinfo)
      },
      fail: err => {
        console.log("云函数调用失败");
      }
    })
  },
  onLoad: function () {
    let ui = wx.getStorageSync('userinfo');
    this.setData({
      userinfo: ui,
      openid: ui.openid
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    isShowUserName: false,
    openid: "",
    name: "",
    featureItems: [
      { text: '功能指南', url: '../guide/guide', icon: '/images/feature_guide.png', img: '/images/arrow_right.png'},
      { text: '清空记录', url: '#', icon: '/images/feature_empty.png', img: '/images/arrow_right.png' },
      { text: '关于作者', url: '../author/author', icon: '/images/feature_author.png', img: '/images/arrow_right.png' }
    ]
  },
  getUserProfile: function (event) {
    wx.getUserProfile({
      desc: '用于完善用户资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中
      success: res => {
        let user = res.userInfo
        wx.setStorageSync('user', user) //保存信息到本地
        this.setData({
          isShowUserName: true,
          userInfo: user
        })
        console.log("获取用户信息成功");
      },
      fail: err => {
        console.log("获取用户信息失败！");
      }
    })
  },
  onShow(options) {
    wx.setNavigationBarTitle({
      title: '我的'
    })
    this.getUserProfile()
    var user = wx.getStorageSync('user') //本地缓存取用户信息
    if (user && user.nickName) { //如果本地缓存有信息，显示本地缓存
      this.setData({
        isShowUserName: true,
        userInfo: user
      })
    }
  },
  //清空记录
  empty: function (event) {
    var index = event.currentTarget.dataset.index;
    if (index == 1) {
      // const ui = wx.getStorageSync('userinfo')
      var user = wx.getStorageSync('user')
      if (!user.nickName) {
        wx.showModal({
          title: '温馨提示',
          content: '此功能需要登录后使用',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              wx.switchTab({
                url: '/pages/mine/mine'
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      } else {
        wx.showModal({
          title: '温馨提示',
          content: '记录删除后无法找回，确定删除吗？',
          success: function (res) {
            if (res.confirm) {           
              var openid = app.globalData.openid;           
              //云函数删除
              wx.cloud.callFunction({
                name: "deletelog",
                data: {
                  openid: openid,
                },
                success: res => {
                  wx.showToast({
                    title: '删除成功！',
                  })
                  console.log('删除成功！', res)
                },
                fail: err => {
                  wx.showToast({
                    title: '调用失败' + err,
                  })
                  console.error('调用失败', err)
                }
              })
            } else if (res.cancel) {
              return false;
            }
          }
        })
      }
    }
  },
  //用户点击右上角分享
  onShareAppMessage: function () {
    wx.showShareMenu({
      withShareTicket: true
    })
  }
})