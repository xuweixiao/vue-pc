import { get, post, form } from '@/common/net/serviceUtil'

/**
 * 标注列表
 * @param {string} params.name
 * @param {Object} params.pageDto
 *
 * @returns {Promise}
 */
export function tagList(params) {
  return get('/label/list', params)
}

/**
 * 标注详情
 * @param {string} params.sid
 *
 * @returns {Promise}
 */
export function tagDetail(params) {
  return post('/label/detail', params)
}

/**
 * 标注保存
 * @param {string} params.sid
 * @param {Array} params.labelContent
 *
 * @returns {Promise}
 */
export function saveTag(params) {
  return post('/label/sheet', params)
}

/**
 * 上传照片
 * @param {file} params.img
 *
 * @returns {Promise}
 */
export function upImage(params) {
  return form('/label/uploadSheet', params)
}
