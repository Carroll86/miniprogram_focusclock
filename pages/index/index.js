// index.js
//获取应用实例
const app = getApp()
//引入util.js
const util = require('../../utils/util.js')

Page({
  data: {
    Y: '',
    M: '',
    D: '',
    h: '',
    m: '',
    s: '',
    backShow: false,
    pauseShow: true,
    continueCancelShow: false,
    //倒计时数
    timeStr: '05:00',
    //倒计时总毫秒数
    mTime: '',
    clockHeight: '',
    clockShow: false,
    //存储用户当前选中分类的index
    cateActive: '0',
    //选择的专注时间
    time: '5',
    ft_index:null,
    min_15:'15',
    min_45:'45',
    min_90:'90',
    timer: null,
    cateArr: [{
        icon: 'work',
        text: '工作'
      },
      {
        icon: 'study',
        text: '学习'
      },
      {
        icon: 'think',
        text: '思考'
      },
      {
        icon: 'writing',
        text: '写作'
      },
      {
        icon: 'sports',
        text: '运动'
      },
      {
        icon: 'reading',
        text: '阅读'
      }
    ]
  },
  onLoad: function () {
    //750rpx
    let res = wx.getSystemInfoSync();
    let rate = 750 / res.windowWidth;
    this.setData({
      rate: 750 / res.windowWidth,
      clockHeight: rate * res.windowHeight
    })
  },
  //获取用户信息
  getUserInfo: function (event) {
    let user = wx.getStorageSync('user')
    app.globalData.userInfo = user.userInfo
    this.setData({
      userInfo: user.userInfo,
      hasUserInfo: true
    })
  },
  //选择专注时间滑块
  _sliderChange: function (event) {
    let val = event.detail.value;
    console.log(event);
    this.setData({
      time: val,
      ft_index: null
    })
  },
  //点击15·45·90的专注时间
  _changeMin: function (event){
    const ft_index = event.currentTarget.dataset.index;
    const min_15 = event.currentTarget.dataset.min_15;
    const min_45 = event.currentTarget.dataset.min_45;
    const min_90 = event.currentTarget.dataset.min_90;
    this.setData({
      ft_index: ft_index
    })
    if(min_15){
      this.setData({
        time: this.data.min_15
      })
    }else if(min_45){
      this.setData({
        time: this.data.min_45
      })
    }else if(min_90){
      this.setData({
        time: this.data.min_90
      })
    }
  },
  _clickCate: function (event) {
    let currentindex = event.currentTarget.dataset.index
    this.setData({
      cateActive: currentindex
    })
  },
  //点击开始专注
  _start: function (event) {
    let user = wx.getStorageSync('user')
    if (!user) {
      wx.showModal({
        title: '温馨提示',
        content: '登录才能进行计时',
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
      let date = new Date();
      //年  
      var Y = date.getFullYear();
      //月  
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
      //日  
      var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      //时  
      var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
      //分  
      var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
      //秒  
      var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
      this.setData({
        openid: app.globalData.openid,
        Y: Y,
        M: M,
        D: D,
        h: h,
        m: m,
        s: s,
        pauseShow: true,
        clockShow: true,
        mTime: this.data.time * 60 * 1000,
        timeStr: parseInt(this.data.time) >= 10 ? (this.data.time) + ":00" : '0' + (this.data.time) + ':00'
      })
    }
    this.drawBg();
    this.drawActive();
  },
  //画时钟的圆
  drawBg: function () {
    let lineWidth = 6 / this.data.rate //canvas中画圆以PX为单位
    let ctx = wx.createCanvasContext('progress_bg');
    ctx.setLineWidth(lineWidth);
    ctx.setStrokeStyle("#000");
    ctx.setLineCap("round");
    ctx.beginPath();
    ctx.arc(400 / this.data.rate / 2, 400 / this.data.rate / 2, 400 / this.data.rate / 2 - 2 * lineWidth,
      0, 2 * Math.PI, false);
    ctx.stroke();
    ctx.draw();
  },
  //画时钟倒计时的动态圆
  drawActive: function () {
    var _this = this;
    var timer = setInterval(function () {
      var angle = 1.5 + 2 * (_this.data.time * 60 * 1000 - _this.data.mTime) / (_this.data.time * 60 * 1000);
      var currentTime = _this.data.mTime - 100;
      _this.setData({
        mTime: currentTime
      });
      if (angle < 3.5) {
        if (currentTime % 1000 == 0) {
          var timeStr1 = currentTime / 1000; // 得到倒计时钟的秒数
          var timeStr2 = parseInt(timeStr1 / 60) //得到倒计时钟的分钟数
          var timeStr3 = (timeStr1 - timeStr2 * 60) >= 10 ? (timeStr1 - timeStr2 * 60) : "0" + (timeStr1 - timeStr2 * 60)
          var timeStr2 = timeStr2 >= 10 ? timeStr2 : '0' + timeStr2
          _this.setData({
            timeStr: timeStr2 + ":" + timeStr3
          })
        }
        let lineWidth = 6 / _this.data.rate //canvas中画圆以PX为单位
        let ctx = wx.createCanvasContext('progress_active');
        ctx.setLineWidth(lineWidth);
        ctx.setStrokeStyle("#fff");
        ctx.setLineCap("round");
        ctx.beginPath();
        ctx.arc(400 / _this.data.rate / 2, 400 / _this.data.rate / 2, 400 / _this.data.rate / 2 - 2 * lineWidth, 1.5 * Math.PI, angle * Math.PI, false);
        ctx.stroke();
        ctx.draw();
      } else {
        var logs = wx.getStorageSync('logs') || [];
        logs.unshift({
          date: util.formatTime(new Date),
          cate: _this.data.cateActive,
          time: _this.data.time
        });
        wx.setStorageSync('logs', logs);
        _this.setData({
          timeStr: "00:00",
          backShow: true,
          pauseShow: false,
          continueCancelShow: false
        })
        clearInterval(timer);
      }
    }, 100)
    this.setData({
      timer: timer
    })
  },
  _pause: function () {
    //点击暂停清除计时器
    clearInterval(this.data.timer);
    this.setData({
      pauseShow: false,
      continueCancelShow: true,
      backShow: false
    })
  },
  _continue: function () {
    //点击继续按钮继续倒计时画圆
    this.drawActive()
    this.setData({
      backShow: false,
      continueCancelShow: false,
      pauseShow: true
    })
  },
  //点击放弃按钮回到计时首页
  _cancel: function () {
    var _this = this;
    wx.showModal({
      title: '温馨提示',
      content: '坚持与放弃只有一笔之差，结果却相差甚远',
      confirmText: '选择放弃',
      cancelText: '继续坚持',
      success(res) {
        if (res.confirm) {
          clearInterval(_this.data.timer);
          _this.setData({
            pauseShow: false,
            continueCancelShow: false,
            backShow: false,
            clockShow: false,
            time: '5'
          })
        } else if (res.cancel) {
          wx.hideToast({
            success: (res) => {},
          })
        }
      }
    })

  },
  //点击返回按钮
  _back: function () {
    clearInterval(this.data.timer);
    this.setData({
      pauseShow: false,
      backShow: false,
      continueCancelShow: false,
      clockShow: false
    })
    wx.cloud.callFunction({
      name: "createlog",
      data: {
        Y: this.data.Y,
        M: this.data.M,
        D: this.data.D,
        h: this.data.h,
        m: this.data.m,
        s: this.data.s,
        cateActive: this.data.cateActive,
        time: this.data.time,
        openid: app.globalData.openid
      }
    })
  },
  //用户点击分享
  onShareAppMessage: function () {
    wx.showShareMenu({
      withShareTicket: true
    })
  }
})