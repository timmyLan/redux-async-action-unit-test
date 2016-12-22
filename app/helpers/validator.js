/**
 * Created by llan on 2016/12/20.
 */
export function changeStart(value) {
	var reg = new RegExp(/^[1-5]$/);
	if (typeof(value) === 'number' && reg.test(value)) {
		return ''
	}
	return '星数必须为正整数且在1~5之间'
}
