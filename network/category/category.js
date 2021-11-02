/**
 * 关于分类所需的接口封装
 * 调用封装在App.vue 里面的global_request
 * 参数详解:global_request(url, data, method, flag)
 * url:表示拼接的地址,data:数据对象,method:请求方式,flage:可以不传值
 */

//! 解构获取global_request函数
const {global_request} = getApp().globalData;


export default {
	/**
	 * 获取分类的接口
	 */
	categoryList(data) {
		return global_request('/api/shop/category/list',data,'GET');
	},
	/**
	 * 分类对应的详情又有其子分类
	 * 调用子分类的接口
	 */
	subCategory(data) {
		return  global_request('/api/shop/goods/category/list',data,'GET');
	},
	/**
	 * 查询对应分类下的所有商品列表
	 * 传参传递category_id可以区分对应的分类
	 */
	goodsList(data) {
		return global_request('/api/shop/goods/list',data,'GET');
	},
	/**
	 * 根据id获取商品的详情
	 */
	goodsDetail(data) {
		return global_request('/api/shop/goods/get',data,'GET');
	},
	/**
	 * 根据商品的id获取对应的型号
	 */
	goodsModel(data) {
		return global_request('/api/goods/model/list',data,'GET');
	}
}