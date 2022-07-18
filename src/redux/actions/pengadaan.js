/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    getPengadaan: (token, status) => ({
        type: 'GET_PENGADAAN',
        payload: http(token).get(`/ticket/get?status=${status}`)
    }),
    getTrackIo: (token) => ({
        type: 'GET_TRACKIO',
        payload: http(token).get(`/ticket/track`)
    }),
    getRevisi: (token, status) => ({
        type: 'GET_REVISI',
        payload: http(token).get(`/ticket/rev?status=${status}`)
    }),
    getApproveIo: (token, no) => ({
        type: 'GET_APPROVEIO',
        payload: http(token).get(`/ticket/approve/${no}`)
    }),
    getDocumentIo: (token, no) => ({
        type: 'GET_DOCIO',
        payload: http(token).get(`/ticket/document/${no}`)
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
        payload: http(token).get(`/ticket/detail/${no}`)
    }),
    updateDataIo: (token, id, data) => ({
        type: 'UPDATE_IO',
        payload: http(token).patch(`/ticket/upasset/${id}`, qs.stringify(data))
    }),
    updateNoIo: (token, no, data) => ({
        type: 'UPDATE_NOIO',
        payload: http(token).patch(`/ticket/upnoio/${no}`, qs.stringify(data))
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
        payload: http(token).patch(`/ticket/subasset/${no}`)
    }),
    submitBudget: (token, no) => ({
        type: 'SUBMIT_BUDGET',
        payload: http(token).patch(`/ticket/subbudget/${no}`)
    }),
    submitEks: (token, no) => ({
        type: 'SUBMIT_EKS',
        payload: http(token).patch(`/ticket/subeks/${no}`)
    }),
    approveIo: (token, no) => ({
        type: 'APPROVE_IO',
        payload: http(token).patch(`/ticket/app/${no}`)
    }),
    rejectIo: (token, no, data) => ({
        type: 'REJECT_IO',
        payload: http(token).patch(`/ticket/rej/${no}`, qs.stringify(data))
    }),
    getTempAsset: (token, no) => ({
        type: 'TEMP_ASSET',
        payload: http(token).get(`/ticket/temp/${no}`)
    }),
    uploadMasterTemp: (token, data, no) => ({
        type: 'UPLOAD_TEMP',
        payload: http(token).post(`/ticket/master/${no}`, data)
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
    updateCart: (token, id, data) => ({
        type: 'UPCART_IO',
        payload: http(token).patch(`/ticket/upcart/${id}`, qs.stringify(data))
    }),
    deleteCart: (token, id) => ({
        type: 'DELCART_IO',
        payload: http(token).delete(`/ticket/delcart/${id}`)
    }),
    getDocCart: (token, no) => ({
        type: 'DOCCART_IO',
        payload: http(token).get(`/ticket/doccart/${no}`)
    }),
    approveAll: (token, data) => ({
        type: 'APPROVE_ALL',
        payload: http(token).patch(`/ticket/appall`, qs.stringify(data))
    }),
    updateRecent: (token, no, data) => ({
        type: 'UPDATE_RECENT',
        payload: http(token).patch(`/ticket/uprecent/${no}`, qs.stringify(data))
    }),
    submitNotAsset: (token, no) => ({
        type: 'SUBMIT_NOTASSET',
        payload: http(token).patch(`/ticket/subnot/${no}`)
    }),
    testApiPods: (token) => ({
        type: 'TESTAPI_PODS',
        payload: http(token).get(`/ticket/tpods`)
    }),
    podsSend: (token, no) => ({
        type: 'PODS_SEND',
        payload: http(token).get(`/ticket/send/${no}`)
    }),
    resetError: () => ({
        type: 'RESET'
    }),
    resetApp: () => ({
        type: 'APP_RESET'
    })
}
