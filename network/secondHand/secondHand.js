/**
 * 关于二手所需的接口封装
 * 调用封装在App.vue 里面的global_request
 * 参数详解:global_request(url, data, method, flag)
 * url:表示拼接的地址,data:数据对象,method:请求方式,flag:可以不传值默认为false使用application/json方式传输，true使用application/x-www-form-urlencoded
 */

//! 解构获取global_request函数
const {global_request} = getApp().globalData;

export default {
	//! 二手登录
	getList(data) {
		return global_request('/api/transaction/list',data,'GET',true);
	},
	add(data) {
		return global_request('/api/transaction/add',data,'POST',true);
	},
	detail(data) {
		return global_request('/api/transaction/get',data,'GET',true);
	},
	
	
}
