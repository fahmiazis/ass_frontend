/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    getDisposal: (token, limit, search, page, status, tipe, time1, time2) => ({
        type: 'GET_DISPOSAL',
        payload: http(token).get(`/disposal/get?limit=${limit === undefined ? 10 : limit}&search=${search === undefined ? '' : search}&page=${page === undefined ? 1 : page}&status=${status === undefined ? 1 : status}&tipe=${tipe === undefined ? 'disposal' : tipe}&time1=${time1}&time2=${time2}`)
    }),
    getCartDisposal: (token) => ({
        type: 'GET_CART',
        payload: http(token).get(`/disposal/cart`)
    }),
    getNewDisposal: (token, form, limit, search, page, status, tipe, time1, time2) => ({
        type: 'GETNEW_DISPOSAL',
        payload: http(token).get(`/disposal/get?limit=${limit === undefined ? 10 : limit}&search=${search === undefined ? '' : search}&page=${page === undefined ? 1 : page}&status=${status === undefined ? 1 : status}&tipe=${tipe === undefined ? 'disposal' : tipe}&form=${form}&time1=${time1}&time2=${time2}`)
    }),
    getSubmitDisposal: (token, limit, search, page, status, tipe) => ({
        type: 'GET_SUBMIT_DISPOSAL',
        payload: http(token).get(`/disposal/get?limit=${limit === undefined ? 10 : limit}&search=${search === undefined ? '' : search}&page=${page === undefined ? 1 : page}&status=${status === undefined ? 1 : status}&tipe=${tipe === undefined ? 'disposal' : tipe}`)
    }),
    getDetailDisposal: (token, no, tipe) => ({
        type: 'DETAIL_DISPOSAL',
        payload: http(token).patch(`/disposal/detail?tipe=${tipe === undefined ? 'pengajuan' : tipe}`, qs.stringify({nomor: no}))
    }),
    getNewDetailDisposal: (token, no, tipe) => ({
        type: 'NEWDETAIL_DISPOSAL',
        payload: http(token).patch(`/disposal/detail?tipe=${tipe === undefined ? 'pengajuan' : tipe}`, qs.stringify({nomor: no}))
    }),
    addDisposal: (token, no) => ({
        type: 'ADD_DISPOSAL',
        payload: http(token).post(`/disposal/add/${no}`)
    }),
    addSell: (token, no) => ({
        type: 'ADD_DISPOSAL',
        payload: http(token).post(`/disposal/sell/${no}`)
    }),
    deleteDisposal: (token, asset) => ({
        type: 'DELETE_DISPOSAL',
        payload: http(token).delete(`/disposal/delete/${asset}`)
    }),
    updateDisposal: (token, id, data, tipe) => ({
        type: 'UPDATE_DISPOSAL',
        payload: http(token).patch(`/disposal/update/${id}/${tipe === undefined ? 'king' : tipe}`, qs.stringify(data))
    }),
    submitDisposal: (token) => ({
        type: 'SUBMIT_DISPOSAL',
        payload: http(token).post(`/disposal/submit`)
    }),
    submitDisposalFinal: (token, data) => ({
        type: 'SUBMIT_FINAL_DISPOSAL',
        payload: http(token).patch(`/disposal/subfin`, qs.stringify(data))
    }),
    getApproveDisposal: (token, no, nama) => ({
        type: 'GET_APPDIS',
        payload: http(token).patch(`/disposal/approval?nama=${nama}`, qs.stringify({no: no}))
    }),
    approveDisposal: (token, data) => ({
        type: 'APPROVE_DIS',
        payload: http(token).patch(`/disposal/approve`, qs.stringify(data))
    }),
    rejectDisposal: (token, data) => ({
        type: 'REJECT_DIS',
        payload: http(token).patch(`/disposal/reject`, data)
    }),
    getDocumentDis: (token, data, tipeDokumen, tipe, npwp) => ({
        type: 'GET_DOCDIS',
        payload: http(token).patch(`/disposal/doc?tipeDokumen=${tipeDokumen}&tipe=${tipe}&npwp=${npwp === undefined ? '' : npwp}`, qs.stringify(data))
    }),
    uploadDocumentDis: (token, id, data, tipe, ket) => ({
        type: 'UPLOAD_DOCDIS',
        payload: http(token).post(`/disposal/upload/${id}?tipe=${tipe}&ket=${ket}`, data)
    }),
    approveDocDis: (token, id) => ({
        type: 'APPROVE_DOCDIS',
        payload: http(token).patch(`/disposal/docapp/${id}`)
    }),
    rejectDocDis: (token, id, data, tipe, ket) => ({
        type:'REJECT_DOCDIS',
        payload: http(token).patch(`/disposal/docrej/${id}?tipe=${tipe}&ket=${ket}`, qs.stringify(data))
    }),
    submitEditDis: (token, no, id) => ({
        type: 'SUBMIT_EDITDIS',
        payload: http(token).patch(`/disposal/editdis/${no}?id=${id}`)
    }),
    submitEditEks: (token, id) => ({
        type: 'SUBMIT_EDITEKS',
        payload: http(token).patch(`/disposal/editeks?id=${id}`)
    }),
    rejectEks: (token, id, data) => ({
        type: 'REJECT_EKS',
        payload: http(token).patch(`/disposal/rejeks?id=${id}`, qs.stringify(data))
    }),
    getKeterangan: (token, nilai) => ({
        type: 'GET_KET',
        payload: http(token).get(`/ket/get/${nilai}`)
    }),
    appRevisi: (token, id, type) => ({
        type: 'APP_REVISI_DISPOSAL',
        payload: http(token).patch(`/disposal/apprev/${id}/${type === undefined ? 'kode' : type}`)
    }),
    submitRevisi: (token, data) => ({
        type: 'SUBMIT_REVISI_DISPOSAL',
        payload: http(token).patch(`/disposal/subrev`, qs.stringify(data))
    }),
    reset: () => ({
        type: 'RESET_DISPOSAL'
    }),
    resAppRej: () => ({
        type: 'RESET_APPREJ'
    })
}
