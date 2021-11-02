//! 解构获取global_request函数
const {global_request} = getApp().globalData;

export default {
	/**
	 * 添加车辆
	 * @param {Object} data
	 */
	addCar(data) {
		return global_request('/api/mycar/add',data,'POST',true)
	},
	/**
	 * 根据id获取车辆的详情信息
	 * @param {Object} data
	 */
	getCarById(data) {
		return global_request('/api/mycar/get',data,'GET')
	},
	//! 删除处理
	delCarById(data) {
		return global_request('/api/mycar/delete',data,'POST',true)
	},
	/**
	 * 修改车辆信息
	 * @param {Object} data
	 */
	updateCar(data) {
		return global_request('/api/mycar/update',data,'POST',true)
	},
	/**
	 * 获取当前用户的车辆
	 */
	carList(data) {
		return global_request('/api/mycar/list',data,'GET');
	}
}