/**
 * 关于用户订单所有的接口封装
 * 调用封装在App.vue 里面的global_request
 * 参数详解:global_request(url, data, method, flag)
 * url:表示拼接的地址,data:数据对象,method:请求方式,flag:可以不传值
 */
//! 解构获取global_request函数
const {global_request} = getApp().globalData;

export default {
	/**
	 * 新增购物车订单
	 */
	addOrder(data) {
		return global_request('/api/purchase/order/add',data,'POST',true)
	},
	/**
	 * 查询购物车订单列表
	 */
	orderList(data) {
		return global_request('/api/purchase/order/list',data,'GET') 
	},
	/**
	 * 根据id获取对应的购物车订单
	 */
	getOrderById(data) {
		return global_request('/api/purchase/order/get',data,'GET')
	}
}
