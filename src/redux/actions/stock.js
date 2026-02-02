/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    submitStock: (token, data) => ({
        type: 'SUBMIT_STOCK',
        payload: http(token).patch('/stock/submit', qs.stringify(data))
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
    searchStock: (token, search, limit, page, group, status, time1, time2) => ({
        type: 'SEARCH_STOCK',
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
    uploadDocument: (token, id, data) => ({
        type: 'UPLOAD_DOCSTOCK',
        payload: http(token).post(`/stock/upload/${id}`, data)
    }),
    getDocumentStock: (token, no, id) => ({
        type: 'DOK_STOCK',
        payload: http(token).get(`/stock/doc/${no}/${id === undefined ? 'undefined' : id}`)
    }),
    cekDocumentStock: (token, no, id) => ({
        type: 'CEK_DOC',
        payload: http(token).get(`/stock/cekdoc/${no}/${id === undefined ? 'undefined' : id}`)
    }),
    getApproveStock: (token, id) => ({
        type: 'GET_APPSTOCK',
        payload: http(token).get(`/stock/approve/${id}`)
    }),
    deleteStock: (token, id) => ({
        type: 'DELETE_STOCK',
        payload: http(token).delete(`/stock/delete/${id}`)
    }),
    approveStock: (token, data) => ({
        type: 'APPROVE_STOCK',
        payload: http(token).patch(`/stock/app`, qs.stringify(data))
    }),
    rejectStock: (token, data) => ({
        type: 'REJECT_STOCK',
        payload: http(token).patch(`/stock/rej`, data)
    }),
    uploadPicture: (token, id, data) => ({
        type: 'UPLOAD_PICTURE',
        payload: http(token).post(`/stock/pict/${id}`, data)
    }),
    uploadImage: (token, id, data) => ({
        type: 'UPLOAD_IMAGE',
        payload: http(token).post(`/stock/img/${id}`, data)
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
    addStock: (token, data, type) => ({
        type: 'ADD_STOCK',
        payload: http(token).post(`/stock/add?type=${type ? type : 'draft'}`, type && type === 'revisi' ? data : qs.stringify(data))
    }),
    deleteAdd: (token, id) => ({
        type: 'DELETE_ADDSTOCK',
        payload: http(token).delete(`/stock/deleteAdd/${id}`),
    }),
    uploadDraftStock: (token, data) => ({
        type: 'UPLOAD_DRAFTSTOCK',
        payload: http(token).post(`/stock/draft-upload`, data)
    }),
    updateClear: (token, data) => ({
        type: 'UPDATE_CLEARSTOCK',
        payload: http(token).post(`/stock/update-clear`, data)
    }),
    setReminder: (data) => ({
        type: 'SET_REMINDER',
        payload: data
    }),
    resetStock: () => ({
        type: 'RESET_STOCK'
    })
}