/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    submitStock: (token) => ({
        type: 'SUBMIT_STOCK',
        payload: http(token).get('/stock/submit')
    }),
    getStockArea: (token, search, limit, page, status) => ({
        type: 'STOCK_AREA',
        payload: http(token).get(`/stock/area?limit=${limit === undefined ? 10 : limit}&search=${search === undefined ? '' : search}&page=${page === undefined ? 1 : page}&status=${status === undefined ? '' : status}`)
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
    getDetailItem: (token, id) => ({
        type: 'DETAIL_ITEM',
        payload: http(token).get(`/stock/item/${id}`)
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
    updateStock: (token, id, data) => ({
        type: 'UPDATE_STOCK',
        payload: http(token).patch(`/stock/update/${id}`, qs.stringify(data))
    }),
    updateStockNew: (token, id, data) => ({
        type: 'UPDATE_STOCKNEW',
        payload: http(token).patch(`/stock/update/${id}`, qs.stringify(data))
    }),
    submitRevisi: (token, id) => ({
        type: 'SUBMIT_REVISI',
        payload: http(token).patch(`/stock/subrev/${id}`)
    }),
    addStock: (token, data) => ({
        type: 'ADD_STOCK',
        payload: http(token).post(`/stock/add`, qs.stringify(data))
    }),
    resetStock: () => ({
        type: 'RESET_STOCK'
    })
}