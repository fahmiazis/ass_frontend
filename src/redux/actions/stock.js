/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    submitStock: (token) => ({
        type: 'SUBMIT_STOCK',
        payload: http(token).get('/stock/submit')
    }),
    getStockAll: (token) => ({
        type: 'GET_STOCK',
        payload: http(token).get('/stock/get')
    }),
    getDetailStock: (token, id) => ({
        type: 'DETAIL_STOCK',
        payload: http(token).get(`/stock/detail/${id}`)
    }),
    getApproveStock: (token, no, nama) => ({
        type: 'GET_APPSTOCK',
        payload: http(token).get(`/stock/approve/${no}/${nama}`)
    }),
    deleteStock: (token, id) => ({
        type: 'DELETE_STOCK',
        payload: http(token).delete(`/stock/delete/${id}`)
    }),
    approveStock: (token, no) => ({
        type: 'APPROVE_STOCK',
        payload: http(token).patch(`/stock/app/${no}`)
    }),
    rejectStock: (token, no, data) => ({
        type: 'REJECT_STOCK',
        payload: http(token).patch(`/stock/rej/${no}`, qs.stringify(data))
    }),
    uploadPicture: (token, id, data) => ({
        type: 'UPLOAD_PICTURE',
        payload: http(token).post(`/stock/img/${id}`, data)
    })
}