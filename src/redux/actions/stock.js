/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    submitStock: (token) => ({
        type: 'SUBMIT_STOCK',
        payload: http(token).get('/stock/submit')
    }),
    getStockAll: (token, search, limit, page, group) => ({
        type: 'GET_STOCK',
        payload: http(token).get(`/stock/get?limit=${limit === undefined ? 10 : limit}&search=${search === undefined ? '' : search}&page=${page === undefined ? 1 : page}&group=${group === undefined ? '' : group}`)
    }),
    getReportAll: (token, search, limit, page, group) => ({
        type: 'REPORT_STOCK',
        payload: http(token).get(`/stock/report?limit=${limit === undefined ? 10 : limit}&search=${search === undefined ? '' : search}&page=${page === undefined ? 1 : page}&group=${group === undefined ? '' : group}`)
    }),
    getDetailStock: (token, id) => ({
        type: 'DETAIL_STOCK',
        payload: http(token).get(`/stock/detail/${id}`)
    }),
    getDocumentStock: (token, no) => ({
        type: 'DOK_STOCK',
        payload: http(token).get(`/stock/doc/${no}`)
    }),
    cekDocumentStock: (token, no) => ({
        type: 'CEK_DOC',
        payload: http(token).get(`/stock/cekdoc/${no}`)
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
    }),
    getStatus: (token, fisik, kondisi) => ({
        type: 'GET_STATUS',
        payload: http(token).get(`/stock/status/get?fisik=${fisik === undefined ? '' : fisik}&kondisi=${kondisi === undefined ? '' : kondisi}`)
    }),
    getStatusAll: (token) => ({
        type: 'STATUS_ALL',
        payload: http(token).get(`/stock/status/all`)
    }),
    resetStock: () => ({
        type: 'RESET_STOCK'
    })
}