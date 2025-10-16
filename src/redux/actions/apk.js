/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    addApk: (token, data) => ({
        type: 'ADD_APK',
        payload: http(token).post(`/apk/add`, data),
    }),
    getApk: (token, limit, search, page, filter) => ({
        type: 'GET_APK',
        payload: http(token).get(`/apk/get?limit=${limit}&search=${search}&page=${page === undefined ? 1 : page}&filter=${filter}`),
    }),
    getDetailApk: (token, id) => ({
        type: 'DETAIL_APK',
        payload: http(token).get(`/apk/detail/${id}`),
    }),
    resetError: () => ({
        type: 'RESET_APK'
    }),
}
