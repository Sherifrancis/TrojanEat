// pages/home/home.js
import request from "../request/request";
var app = getApp();

Page({
	refresh() {
		let now = +new Date();
		this.setData({
			now:now,
		})
		if (this.data.now - this.data.prev > 3000) {
			this.setData({
				prev: now,
			})
			app.globalData.dhRank = [];
			app.globalData.dhRec = [];
			app.globalData.displayRecTypes = [];
			app.globalData.recDish = [];
			app.globalData.otherDh = [];
			app.globalData.otherDhRec = [];
			app.globalData.evkRec = [];
			app.globalData.vlgRec = [];
			app.globalData.pksRec = [];
			app.globalData.userPreference = [];
			app.globalData.userPreferenceEng = [];
			app.globalData.evkMenu = [];
			app.globalData.pksMenu = [];
			app.globalData.vlgMenu = [];
			app.globalData.evkCate = [];
			app.globalData.evkDish = [];
			app.globalData.pksCate = [];
			app.globalData.pksDish = [];
			app.globalData.vlgCate = [];
			app.globalData.vlgDish = [];
			app.globalData.recDishEng = [];
			app.globalData.otherDhRecEng = [];
			app.globalData.isOpen = true;
			app.onLaunch();
		} else {
			wx.showToast({
				title: '请三秒后再尝试刷新',
				icon: 'error',
			})
		}
	},
	/**
	 * 页面的初始数据
	 */
	data: {
		userInfo: {},
		openid: 0,
		havePreference: true,
		myDate: "0000-00-00",
		mealIndex: -1,
		isOpen: false,
		isFirst: true,
		isWeekDay: true,
		isBreakfast: false,
		isLunch: false,
		isDinner: false,
		vlgOpen: true,
		evkOpen: true,
		pksOpen: true,
		dhRank: [],
		dhArr: ["EVK", "PKS", "VLG"],
		dhRec: [],
		dhRecEng: [],
		displayRecTypes: [],
		recDish: [],
		otherDh: [],
		otherDhRec: [],
		otherDhRecEng: [],
		vlgRec: [],
		evkMenu: [],
		pksMenu: [],
		prev: 0,
		now: 0,
	},
	// 首页登陆
	homeLogin() {
		wx.login({
			success: async (res) => {
				let code = res.code;
				let result = await request("/getOpenId", { code });
				app.globalData.openid = result;
				// console.log(this.data.openid);
				this.setData({
					openId: result,
				});
			},
			fail: (res) => {
				wx.showToast({
					title: "登陆失败，请重新登录",
					icon: "none",
				});
			},
		});
		wx.getUserProfile({
			desc: "desc",
			success: (result) => {
				app.globalData.userInfo = result.userInfo;
				this.setData({
					userInfo: result.userInfo,
				});
			},
			fail: (result) => {
				wx.showToast({
					title: "请登陆以获取推荐",
					icon: "none",
				});
			},
		});
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		if (app.globalData.dhRec.length) {
			this.setData({
				userInfo: app.globalData.userInfo,
				isFirst: app.globalData.isFirst,
				dhRank: app.globalData.dhRank,
				dhRec: app.globalData.dhRec,
				displayRecTypes: app.globalData.displayRecTypes,
				recDish: app.globalData.recDish,
				recDishEng: app.globalData.recDishEng,
				otherDh: app.globalData.otherDh,
				otherDhRec: app.globalData.otherDhRec,
				otherDhRecEng: app.globalData.otherDhRecEng,
				havePreference: app.globalData.havePreference,
				isOpen: app.globalData.isOpen,
			});
			console.log(this.data.otherDhRecEng);
		} else {
			app.userCallBack = (res) => {
				if (res) {
					this.setData({
						userInfo: app.globalData.userInfo,
						isFirst: app.globalData.isFirst,
						dhRank: app.globalData.dhRank,
						dhRec: app.globalData.dhRec,
						displayRecTypes: app.globalData.displayRecTypes,
						recDish: app.globalData.recDish,
						recDishEng: app.globalData.recDishEng,
						otherDh: app.globalData.otherDh,
						otherDhRec: app.globalData.otherDhRec,
						otherDhRecEng: app.globalData.otherDhRecEng,
						havePreference: app.globalData.havePreference,
						isOpen: app.globalData.isOpen,
					});
					console.log(this.data.isOpen);
				}
			};
		}
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		// console.log(app.globalData.dhRec);

		/* 日期设定 */
		let date = new Date();
		let myDay = date.getDay();
		let myTime = date.toTimeString();
		let myDate =
			date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
		// 判断是否工作日
		if (myDay >= 1 && myDay <= 5) {
			this.setData({
				isWeekDay: true,
			});
		}
		// 判断是否开门
		if (myTime >= "21:00") {
			this.setData({
				vlgOpen: true,
				evkOpen: false,
				pksOpen: false,
			});
		}
		if (myTime >= "22:00" || myTime <= "07:00") {
			this.setData({
				vlgOpen: false,
				evkOpen: false,
				pksOpen: false,
			});
		}
		if (myTime >= "07:00" && myTime <= "10:30") {
			this.setData({
				vlgOpen: true,
				evkOpen: true,
				pksOpen: true,
			});
		}
		if (myTime >= "10:30" && myTime <= "11:00") {
			this.setData({
				vlgOpen: false,
				evkOpen: false,
				pksOpen: false,
			});
		}
		// 判断mealtime
		if (myTime <= "10:30" && myTime >= "07:00") {
			this.setData({
				isBreakfast: true,
				isLunch: false,
				isDinner: false,
			});
		}
		if (myTime <= "16:00" && myTime >= "10:30") {
			this.setData({
				isBreakfast: false,
				isLunch: true,
				isDinner: false,
			});
		}
		if (myTime <= "22:00" && myTime >= "16:00") {
			this.setData({
				isBreakfast: false,
				isLunch: false,
				isDinner: true,
			});
		}
		/* 日期 */
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {},
});
