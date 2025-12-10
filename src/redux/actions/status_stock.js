/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    getStatusStock: (token, tipe) => ({
        type: 'GET_STATUS_STOCK',
        payload: http(token).get(`/status-stock/all/${tipe}`),
    }),
    getAllStatusStock: (token, limit, search, page) => ({
        type: 'GET_ALLSTATUS_STOCK',
        payload: http(token).get(`/status-stock/get?limit=${limit}&search=${search}&page=${page === undefined ? 1 : page}`)
    }),
    getDetailStatusStock: (token, id) => ({
        type: 'DETAIL_STATUS_STOCK',
        payload: http(token).get(`/status-stock/detail/${id}`),
    }),
    addStatusStock: (token, data) => ({
        type: 'ADD_STATUS_STOCK',
        payload: http(token).post(`/status-stock/add`, qs.stringify(data))
    }),
    updateStatusStock: (token, data, id) => ({
        type: 'UPDATE_STATUS_STOCK',
        payload: http(token).patch(`/status-stock/update/${id}`, qs.stringify(data))
    }),
    deleteStatusStock: (token, id) => ({
        type: 'DELETE_STATUS_STOCK',
        payload: http(token).delete(`/status-stock/del/${id}`)
    }),
    uploadMaster: (token, data) => ({
        type: 'UPLOAD_STATUS_STOCK',
        payload: http(token).post(`/status-stock/master`, data)
    }),
    exportMaster: (token) => ({
        type: 'EXPORT_MASTER_STATUS_STOCK',
        payload: http(token).get(`/status-stock/export`)
    }),
    nextPage: (token, link) => ({
        type: 'NEXT_DATA_STATUS_STOCK',
        payload: http(token).get(`${link}`)
    }),
    resetError: () => ({
        type: 'RESET_STATUS_STOCK'
    })
}
