/**
 * 关于设备维修所需的接口封装
 * 调用封装在App.vue 里面的global_request
 * 参数详解:global_request(url, data, method, flag)
 * url:表示拼接的地址,data:数据对象,method:请求方式,flag:可以不传值
 */

//! 解构获取global_request函数
const {global_request} = getApp().globalData;


export default {
	/**
	 * 获取所有设备的类型
	 */
	deviceType(data) {
		return global_request('/api/types/list',data,'GET');
	},
	/**
	 * 获取所有设备的品牌
	 */
	deviceBrand(data) {
		return global_request('/api/brand/list',data,'GET');
	},
	/**
	 * 获取所有设备的型号
	 */
	deviceModel(data) {
		return global_request('/api/model/list',data,'GET');
	},
	/**
	 * 设备维修订单接口
	 */
	deviceOrder(data) {
		return global_request('/api/er/add',data,'POST',true);
	}
}