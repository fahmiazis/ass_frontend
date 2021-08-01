/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'

export default {
    submitSetDisposal: (token) => ({
        type: 'SUBMIT_SETDIS',
        payload: http(token).get(`/disposal/setuju/submit`)
    }),
    getSetDisposal: (token, limit, search, page, status, tipe) => ({
        type: 'GET_SETDIS',
        payload: http(token).get(`/disposal/setuju/get?limit=${limit === undefined ? 100 : limit}&search=${search === undefined ? '' : search}&page=${page === undefined ? 1 : page}&status=${status === undefined ? 1 : status}&tipe=${tipe === undefined ? 'disposal' : tipe}`)
    }),
    getApproveSetDisposal: (token, no, nama) => ({
        type: 'GET_APPSET',
        payload: http(token).get(`/disposal/setuju/approve/${no}/${nama}`)
    }),
    approveSetDisposal: (token, no) => ({
        type: 'APPROVE_SETDIS',
        payload: http(token).patch(`/disposal/setuju/app/${no}`)
    }),
    submitEksDisposal: (token, no) => ({
        type: 'SUBMIT_EKSEKUSI',
        payload: http(token).patch(`/disposal/eks/submit/${no}`)
    }),
    submitTaxFinDisposal: (token, no) => ({
        type: 'SUBMIT_TAXFIN',
        payload: http(token).patch(`/disposal/taxfin/submit/${no}`)
    }),
    submitFinalDisposal: (token, no) => ({
        type: 'SUBMIT_FINAL',
        payload: http(token).patch(`/disposal/final/submit/${no}`)
    }),
    submitPurchDisposal: (token, no) => ({
        type: 'SUBMIT_PURCH',
        payload: http(token).patch(`/disposal/purch/submit/${no}`)
    })
}