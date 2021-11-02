/**
 * 关于用户所需的接口封装
 * 调用封装在App.vue 里面的global_request
 * 参数详解:global_request(url, data, method, flag)
 * url:表示拼接的地址,data:数据对象,method:请求方式,flage:可以不传值默认为false使用application/json方式传输，true使用application/x-www-form-urlencoded
 */

//! 解构获取global_request函数
const {global_request} = getApp().globalData;

export default {
	/**
	 * 用户登录接口
	 * @param {Object} data
	 */
	login(data) {
		return global_request('/api/wxuser/login',data,'POST',true);
	},
	/**
	 * 修改用户信息
	 * @param {Object} data
	 */
	editUserInfo(data) {
		return global_request('/api/user/update',data,'POST',true);
	},
	/**
	 * 获取用户的详情信息
	 * @param {Object} data
	 */
	detail(data) {
		return global_request('/api/user/get',data,'GET');
	},
	/**
	 * 查询用户的设备维修订单列表
	 * @param {Object} data 
	 */
	repairList(data) {
		return global_request('/api/er/list',data,'GET')
	},
	/**
	 * 用户搜索记录
	 */
	searchHistory(data) {
		return global_request('/api/history/list',data,'GET');
	}
	
}
