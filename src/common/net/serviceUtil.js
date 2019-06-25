/**
 * @description axios 网络请求封装
 * @author xudanfeng
 */

import axios from 'axios'
import router from '@/router/index.js'
let querystring = require('querystring')

axios.defaults.baseURL = 'http://139.129.205.233:17676'

axios.defaults.timeout = 10000 // 超时时长
axios.defaults.withCredentials = true // 携带cookie
// 这样设置无效，需要在拦截器中设置
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

axios.interceptors.request.use(config => {
  config.headers = {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  }
  return config
}, err => {
  return Promise.reject(err)
})

axios.interceptors.response.use(response => {
  return response
}, err => {
  if (err.response.status === 401) {
    router.replace('/login')
  }
  return Promise.reject(err)
})

/**
 * get请求
 * @param {string} url 请求url
 * @param {Object} data 请求参数
 */
export function get (url, data = {}) {
  return axios.get(url, {params: data})
}

/**
 * post请求
 * @param {string} url 请求url
 * @param {Object} data 请求参数
 */
export function post (url, data = {}) {
  return axios.post(url, querystring.stringify(data))
}

/**
 * post请求
 * @param {string} url 请求url
 * @param {Object} data 请求参数
 */
export function postWithJson (url, data = {}) {
  return axios.post(url, data)
}

/**
 * post form参数请求
 *
 * @param {string} url 请求 url
 * @param {Object} data 发送的数据
 * @return {Promise}
 */
export function form (url, data = {}) {
  return axios.post(url,
    data,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )
}
