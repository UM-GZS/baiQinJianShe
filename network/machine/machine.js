//! 解构获取global_request函数
const {global_request} = getApp().globalData;

export default {
	/**
	 * 获取新机购置的详情
	 */
	 machineDetail(data) {
		return global_request('/api/machines/get',data,'GET');
	},
	/**
	 * 获取新机购置列表
	 */
	machineList(data) {
		return global_request('/api/machines/list',data,'GET');
	}
}