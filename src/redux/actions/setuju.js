/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

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
        payload: http(token).get(`/disposal/setuju/approve/${no}?nama=${nama}`)
    }),
    approveSetDisposal: (token, no) => ({
        type: 'APPROVE_SETDIS',
        payload: http(token).patch(`/disposal/setuju/app/${no}`)
    }),
    rejectSetDisposal: (token, no, data, tipe) => ({
        type: 'REJECT_SETDIS',
        payload: http(token).patch(`/disposal/setuju/rej/${no}?tipe=${tipe}`, qs.stringify(data))
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
    resetSetuju: () => ({
        type: 'RESET_SETUJU'
    }),
    resetAppSet: () => ({
        type: 'RESET_APPSET'
    })
}