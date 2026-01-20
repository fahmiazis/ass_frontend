/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    getPengadaan: (token, status, time1, time2, search, limit) => ({
        type: 'GET_PENGADAAN',
        payload: http(token).get(`/ticket/get?status=${status}&time1=${time1}&time2=${time2}&search=${search}&limit=${limit}&page=1`)
    }),
    searchIo: (token, status, time1, time2, search, limit) => ({
        type: 'SEARCH_IO',
        payload: http(token).get(`/ticket/get?status=${status}&time1=${time1}&time2=${time2}&search=${search}&limit=${limit}&page=1`)
    }),
    getTrackIo: (token) => ({
        type: 'GET_TRACKIO',
        payload: http(token).get(`/ticket/track`)
    }),
    getRevisi: (token, status) => ({
        type: 'GET_REVISI',
        payload: http(token).get(`/ticket/rev?status=${status}`)
    }),
    getDocumentIo: (token, no) => ({
        type: 'GET_DOCIO',
        payload: http(token).patch(`/ticket/document`, qs.stringify({no: no}))
    }),
    uploadDocument: (token, id, data) => ({
        type: 'UPLOAD_DOCIO',
        payload: http(token).post(`/ticket/upload/${id}`, data)
    }),
    approveDocument: (token, id) => ({
        type: 'APPROVE_DOCIO',
        payload: http(token).patch(`/ticket/appdoc/${id}`)
    }),
    rejectDocument: (token, id, data) => ({
        type: 'REJECT_DOCIO',
        payload: http(token).patch(`/ticket/rejdoc/${id}`, qs.stringify(data))
    }),
    showDokumen: (token, id, no) => ({
        type: 'SHOW',
        payload: http(token).get(`/show/doc/${id}?no=${no}`)
    }),
    getDetail: (token, no) => ({
        type: 'DETAIL_IO',
        payload: http(token).patch(`/ticket/detail`, qs.stringify({no: no}))
    }),
    updateDataIo: (token, id, data) => ({
        type: 'UPDATE_IO',
        payload: http(token).patch(`/ticket/upasset/${id}`, qs.stringify(data))
    }),
    updateNoIo: (token, data) => ({
        type: 'UPDATE_NOIO',
        payload: http(token).patch(`/ticket/upnoio`, qs.stringify(data))
    }),
    updateNoAsset: (token, id, data) => ({
        type: 'NO_ASSET',
        payload: http(token).patch(`/ticket/noasset/${id}`, qs.stringify(data))
    }),
    updateTemp: (token, id, data) => ({
        type: 'UPDATE_TEMP',
        payload: http(token).patch(`/ticket/uptemp/${id}`, qs.stringify(data))
    }),
    submitIsAsset: (token, no) => ({
        type: 'SUBMIT_ISASSET',
        payload: http(token).patch(`/ticket/subasset`, qs.stringify({no: no}))
    }),
    submitBudget: (token, no) => ({
        type: 'SUBMIT_BUDGET',
        payload: http(token).patch(`/ticket/subbudget`, qs.stringify({no: no}))
    }),
    submitEks: (token, no) => ({
        type: 'SUBMIT_EKS',
        payload: http(token).patch(`/ticket/subeks`, qs.stringify({no: no}))
    }),
    submitRevisi: (token, data) => ({
        type: 'SUBMIT_REVISI',
        payload: http(token).patch(`/ticket/subrev`, qs.stringify(data))
    }),
    approveIo: (token, no) => ({
        type: 'APPROVE_IO',
        payload: http(token).patch(`/ticket/app`, qs.stringify({no: no}))
    }),
    rejectIo: (token, no, data) => ({
        type: 'REJECT_IO',
        payload: http(token).patch(`/ticket/rej`, data)
    }),
    getTempAsset: (token, no) => ({
        type: 'TEMP_ASSET',
        payload: http(token).patch(`/ticket/temp`, qs.stringify({no: no}))
    }),
    uploadMasterTemp: (token, data, no) => ({
        type: 'UPLOAD_TEMP',
        payload: http(token).post(`/ticket/master`, data)
    }),
    addCart: (token, data) => ({
        type: 'ADDCART_IO',
        payload: http(token).post(`/ticket/addcart`, qs.stringify(data))
    }),
    getCart: (token) => ({
        type: 'GETCART_IO',
        payload: http(token).get(`/ticket/cart`)
    }),
    submitCart: (token) => ({
        type: 'SUBCART_IO',
        payload: http(token).patch(`/ticket/subcart`)
    }),
    submitIo: (token) => ({
        type: 'SUBMIT_IO',
        payload: http(token).patch(`/ticket/submit`)
    }),
    submitIoFinal: (token, no) => ({
        type: 'SUBFINAL_IO',
        payload: http(token).patch(`/ticket/subfinio`, qs.stringify(no))
    }),
    updateCart: (token, id, data) => ({
        type: 'UPCART_IO',
        payload: http(token).patch(`/ticket/upcart/${id}`, qs.stringify(data))
    }),
    appRevisi: (token, id) => ({
        type: 'APP_REVISI',
        payload: http(token).patch(`/ticket/apprev/${id}`)
    }),
    deleteCart: (token, id) => ({
        type: 'DELCART_IO',
        payload: http(token).delete(`/ticket/delcart/${id}`)
    }),
    getDocCart: (token, id) => ({
        type: 'DOCCART_IO',
        payload: http(token).get(`/ticket/doccart/${id}`)
    }),
    approveAll: (token, data) => ({
        type: 'APPROVE_ALL',
        payload: http(token).patch(`/ticket/appall`, qs.stringify(data))
    }),
    updateReason: (token, no, data) => ({
        type: 'UPDATE_REASON',
        payload: http(token).patch(`/ticket/upreason`, qs.stringify({...data, no: no}))
    }),
    submitNotAsset: (token, no) => ({
        type: 'SUBMIT_NOTASSET',
        payload: http(token).patch(`/ticket/subnot`, qs.stringify({no: no}))
    }),
    generateAssetSap: (token, no) => ({
        type: 'GENNO_SAP',
        payload: http(token).patch(`/ticket/asetsap`, qs.stringify({no: no}))
    }),
    testApiPods: (token) => ({
        type: 'TESTAPI_PODS',
        payload: http(token).get(`/ticket/tpods`)
    }),
    podsSend: (token, no) => ({
        type: 'PODS_SEND',
        payload: http(token).patch(`/ticket/send`, qs.stringify({no: no}))
    }),

    // Detail Item
    addDetailItem: (token, data) => ({
        type: 'ADD_DETAILITEM',
        payload: http(token).post(`/ticket/item-add`, data)
    }),
    updateDetailItem: (token, data) => ({
        type: 'UPDATE_DETAILITEM',
        payload: http(token).patch(`/ticket/item-update`, qs.stringify(data))
    }),
    deleteDetailItem: (token, id) => ({
        type: 'DELETE_DETAILITEM',
        payload: http(token).delete(`/ticket/item-delete/${id}`)
    }),
    getDetailItem: (token, id) => ({
        type: 'GET_DETAILITEM',
        payload: http(token).get(`/ticket/item-get/${id}`)
    }),

    // approval
    getApproveIo: (token, no, type) => ({
        type: 'GET_APPROVEIO',
        payload: http(token).patch(`/ticket/approve`, qs.stringify({no: no, type: type || 'all'}))
    }),
    makeApproval: (token, id, data, type) => ({
        type: 'MAKE_APPROVALIO',
        payload: http(token).patch(`/ticket/makeapp/${id}?type=${type ? type : 'update'}`, qs.stringify({dataApp: data}))
    }),
    deleteApproval: (token, id) => ({
        type: 'DELETE_APPROVALIO',
        payload: http(token).delete(`/ticket/delapp/${id}`)
    }),
    saveApproval: (token, no) => ({
        type: 'SAVE_APPROVALIO',
        payload: http(token).patch(`/ticket/saveapp`, qs.stringify({no: no}))
    }),
    

    resetError: () => ({
        type: 'RESET'
    }),
    resetApp: () => ({
        type: 'APP_RESET'
    })
}
