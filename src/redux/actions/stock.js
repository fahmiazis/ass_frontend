/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    submitStock: (token) => ({
        type: 'SUBMIT_STOCK',
        payload: http(token).get('/stock/submit')
    }),
    submitStockFinal: (token, no) => ({
        type: 'SUBFINAL_STOCK',
        payload: http(token).patch(`/stock/subfinal`, qs.stringify(no))
    }),
    getStockArea: (token, search, limit, page, status) => ({
        type: 'STOCK_AREA',
        payload: http(token).get(`/stock/area?limit=${limit === undefined ? 100 : limit}&search=${search === undefined ? '' : search}&page=${page === undefined ? 1 : page}&status=${status === undefined ? '' : status}`)
    }),
    getStockAll: (token, search, limit, page, group, status, time1, time2) => ({
        type: 'GET_STOCK',
        payload: http(token).get(`/stock/get?limit=${limit === undefined ? 100 : limit}&search=${search === undefined ? '' : search}&page=${page === undefined ? 1 : page}&group=${group === undefined ? '' : group}&status=${status}&time1=${time1}&time2=${time2}`)
    }),
    getReportAll: (token, search, limit, page, group, fisik, sap, kondisi, plant, time1, time2) => ({
        type: 'REPORT_STOCK',
        payload: http(token).get(`/stock/report?limit=${limit === undefined ? 100 : limit}&search=${search === undefined ? '' : search}&page=${page === undefined ? 1 : page}&group=${group === undefined ? '' : group}&fisik=${fisik === undefined ? '' : fisik}&sap=${sap === undefined ? '' : sap}&kondisi=${kondisi === undefined ? '' : kondisi}&plant=${plant === undefined ? '' : plant}&time1=${time1}&time2=${time2}`)
    }),
    getDetailStock: (token, no) => ({
        type: 'DETAIL_STOCK',
        payload: http(token).patch(`/stock/detail`, qs.stringify({no: no}))
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
    getApproveStock: (token, id) => ({
        type: 'GET_APPSTOCK',
        payload: http(token).get(`/stock/approve/${id}`)
    }),
    deleteStock: (token, id) => ({
        type: 'DELETE_STOCK',
        payload: http(token).delete(`/stock/delete/${id}`)
    }),
    approveStock: (token, no) => ({
        type: 'APPROVE_STOCK',
        payload: http(token).patch(`/stock/app`, qs.stringify({no: no}))
    }),
    rejectStock: (token, data) => ({
        type: 'REJECT_STOCK',
        payload: http(token).patch(`/stock/rej`, data)
    }),
    uploadPicture: (token, id, data) => ({
        type: 'UPLOAD_PICTURE',
        payload: http(token).post(`/stock/img/${id}`, data)
    }),
    uploadImage: (token, id, data) => ({
        type: 'UPLOAD_IMAGE',
        payload: http(token).post(`/stock/pict/${id}`, data)
    }),
    getStatus: (token, fisik, kondisi, sap) => ({
        type: 'GET_STATUS',
        payload: http(token).get(`/stock/status/get?fisik=${fisik === undefined ? '' : fisik}&kondisi=${kondisi === undefined ? '' : kondisi}&sap=${sap}`)
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
    appRevisi: (token, id) => ({
        type: 'APP_REVISI',
        payload: http(token).patch(`/stock/apprev/${id}`)
    }),
    submitAsset: (token, no) => ({
        type: 'SUBMIT_ASET',
        payload: http(token).patch(`/stock/subaset`, qs.stringify({no: no}))
    }),
    addStock: (token, data) => ({
        type: 'ADD_STOCK',
        payload: http(token).post(`/stock/add`, qs.stringify(data))
    }),
    resetStock: () => ({
        type: 'RESET_STOCK'
    })
}