/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    getPengadaan: (token) => ({
        type: 'GET_PENGADAAN',
        payload: http(token).get(`/peng/get`)
    }),
    getApproveIo: (token, no) => ({
        type: 'GET_APPROVEIO',
        payload: http(token).get(`/peng/approve/${no}`)
    }),
    getDocumentIo: (token, no) => ({
        type: 'GET_DOCIO',
        payload: http(token).get(`/peng/document/${no}`)
    }),
    uploadDocument: (token, id, data) => ({
        type: 'UPLOAD_DOCIO',
        payload: http(token).post(`/peng/upload/${id}`, data)
    }),
    approveDocument: (token, id) => ({
        type: 'APPROVE_DOCIO',
        payload: http(token).patch(`/peng/appdoc/${id}`)
    }),
    rejectDocument: (token, id, data) => ({
        type: 'REJECT_DOCIO',
        payload: http(token).patch(`/peng/rejdoc/${id}`, qs.stringify(data))
    }),
    showDokumen: (token, id) => ({
        type: 'SHOW',
        payload: http(token).get(`/show/doc/${id}`)
    }),
    resetError: () => ({
        type: 'RESET'
    })
}
