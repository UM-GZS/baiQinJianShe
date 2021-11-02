/**
 * 关于分类所需的接口封装
 * 调用封装在App.vue 里面的global_request
 * 参数详解:global_request(url, data, method, flag)
 * url:表示拼接的地址,data:数据对象,method:请求方式,flage:可以不传值
 */

//! 解构获取global_request函数
const {global_request} = getApp().globalData;


export default {
	// 添加购物车
	addCart(data) {
		return global_request('/api/shop/cart/add', data, 'POST', true);
	},
	// 获取购物车列表
	cartList(data) {
		return global_request('/api/shop/cart/list', data, 'GET');
	},
	// 购物车结算
	cartPay(data) {
		return global_request('/api/shop/cart/order', data, 'POST', true);
	},
	// 删除购物车
	cartDetele(data) {
		return global_request('/api/shop/cart/delete', data, 'POST', true);
	},
	// 修改购物车
	updateCart(data) {
		return global_request('/api/shop/cart/update', data, 'POST', true);
	}
}