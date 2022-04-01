/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    getPengadaan: (token) => ({
        type: 'GET_PENGADAAN',
        payload: http(token).get(`/ticket/get`)
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
    showDokumen: (token, id) => ({
        type: 'SHOW',
        payload: http(token).get(`/show/doc/${id}`)
    }),
    getDetail: (token, no) => ({
        type: 'DETAIL_IO',
        payload: http(token).get(`/ticket/detail/${no}`)
    }),
    resetError: () => ({
        type: 'RESET'
    })
}
