/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    getDisposal: (token, limit, search, page, status, tipe) => ({
        type: 'GET_DISPOSAL',
        payload: http(token).get(`/disposal/get?limit=${limit === undefined ? 10 : limit}&search=${search === undefined ? '' : search}&page=${page === undefined ? 1 : page}&status=${status === undefined ? 1 : status}&tipe=${tipe === undefined ? 'disposal' : tipe}`)
    }),
    getCartDisposal: (token) => ({
        type: 'GET_CART',
        payload: http(token).get(`/disposal/cart`)
    }),
    getNewDisposal: (token, form, limit, search, page, status, tipe) => ({
        type: 'GETNEW_DISPOSAL',
        payload: http(token).get(`/disposal/get?limit=${limit === undefined ? 10 : limit}&search=${search === undefined ? '' : search}&page=${page === undefined ? 1 : page}&status=${status === undefined ? 1 : status}&tipe=${tipe === undefined ? 'disposal' : tipe}&form=${form}`)
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
        type: 'DETAIL_DISPOSAL',
        payload: http(token).get(`/disposal/detail?tipe=${tipe === undefined ? 'pengajuan' : tipe}`, qs.stringify({nomor: no}))
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
    getApproveDisposal: (token, no, nama) => ({
        type: 'GET_APPDIS',
        payload: http(token).get(`/disposal/approve/${no}?nama=${nama}`)
    }),
    approveDisposal: (token, no) => ({
        type: 'APPROVE_DIS',
        payload: http(token).patch(`/disposal/app/${no}`)
    }),
    rejectDisposal: (token, no, data, tipe, status) => ({
        type: 'REJECT_DIS',
        payload: http(token).patch(`/disposal/rej/${no}?tipe=${tipe}&status=${status}`, qs.stringify(data))
    }),
    getDocumentDis: (token, no, tipeDokumen, tipe, npwp) => ({
        type: 'GET_DOCDIS',
        payload: http(token).get(`/disposal/doc/${no}?tipeDokumen=${tipeDokumen}&tipe=${tipe}&npwp=${npwp === undefined ? '' : npwp}`)
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
    reset: () => ({
        type: 'RESET_DISPOSAL'
    }),
    resAppRej: () => ({
        type: 'RESET_APPREJ'
    })
}
