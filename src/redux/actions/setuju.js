/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    submitSetDisposal: (token, data) => ({
        type: 'SUBMIT_SETDIS',
        payload: http(token).patch(`/disposal/setuju/submit`, data)
    }),
    getSetDisposal: (token, limit, search, page, status, tipe) => ({
        type: 'GET_SETDIS',
        payload: http(token).get(`/disposal/setuju/get?limit=${limit === undefined ? 100 : limit}&search=${search === undefined ? '' : search}&page=${page === undefined ? 1 : page}&status=${status === undefined ? 1 : status}&tipe=${tipe === undefined ? 'disposal' : tipe}`)
    }),
    getApproveSetDisposal: (token, no, nama) => ({
        type: 'GET_APPSET',
        payload: http(token).patch(`/disposal/setuju/getapp`, qs.stringify({no: no}))
    }),
    approveSetDisposal: (token, type, data) => ({
        type: 'APPROVE_SETDIS',
        payload: http(token).patch(`/disposal/setuju/approve?type=${type}`, data)
    }),
    rejectSetDisposal: (token, data) => ({
        type: 'REJECT_SETDIS',
        payload: http(token).patch(`/disposal/setuju/reject`, qs.stringify(data))
    }),
    submitEksDisposal: (token, data) => ({
        type: 'SUBMIT_EKSEKUSI',
        payload: http(token).patch(`/disposal/eks/submit`, qs.stringify(data))
    }),
    submitTaxFinDisposal: (token, data) => ({
        type: 'SUBMIT_TAXFIN',
        payload: http(token).patch(`/disposal/taxfin/submit`, qs.stringify(data))
    }),
    submitFinalDisposal: (token, data) => ({
        type: 'SUBMIT_FINAL',
        payload: http(token).patch(`/disposal/final/submit`, qs.stringify(data))
    }),
    submitPurchDisposal: (token, data) => ({
        type: 'SUBMIT_PURCH',
        payload: http(token).patch(`/disposal/purch/submit`, qs.stringify(data))
    }),
    submitEditTaxFin: (token, no) => ({
        type: 'SUBMIT_EDIT_TAXFIN',
        payload: http(token).patch(`/disposal/taxfin/edit/${no}`)
    }),
    rejectTaxFin: (token, no, tipe) => ({
        type: 'REJECT_TAXFIN',
        payload: http(token).patch(`/disposal/taxfin/rej/${no}?tipe=${tipe}`)
    }),
    getDataPurch: (token) => ({
        type: 'GET_PURCH',
        payload: http(token).get('/disposal/purch/get')
    }),
    genNoSetDisposal: (token) => ({
        type: 'GENERATE_NOSET',
        payload: http(token).patch(`/disposal/gennoset`)
    }),
    resetSetuju: () => ({
        type: 'RESET_SETUJU'
    }),
    resetAppSet: () => ({
        type: 'RESET_APPSET'
    })
}