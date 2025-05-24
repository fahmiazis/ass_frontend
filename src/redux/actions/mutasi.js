/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'
const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
 };

export default {
    addMutasi: (token, no, plant) => ({
        type: 'ADD_MUTASI',
        payload: http(token).post(`/mutasi/add/${no}/${plant}`)
    }),
    updateMutasi: (token, data) => ({
        type: 'UPDATE_MUTASI',
        payload: http(token).patch(`/mutasi/update`, qs.stringify(data))
    }),
    getCart: (token) => ({
        type: 'GET_CART_MUTASI',
        payload: http(token).get(`/mutasi/cart`)
    }),
    getMutasi: (token, status, time1, time2, search, limit) => ({
        type: 'GET_MUTASI',
        payload: http(token).get(`/mutasi/get?status=${status}&time1=${time1}&time2=${time2}&search=${search}&limit=${limit}&page=1`)
    }),
    getMutasiRec: (token, tipe) => ({
        type: 'GET_MUTASI_REC',
        payload: http(token).get(`/mutasi/rec?tipe=${tipe}`)
    }),
    deleteMutasi: (token, id) => ({
        type: 'DELETE_MUTASI',
        payload: http(token).delete(`/mutasi/del/${id}`)
    }),
    submitMutasi: (token, data) => ({
        type: 'SUBMIT_MUTASI',
        payload: http(token).post(`/mutasi/submit`, qs.stringify(data))
    }),
    submitMutasiFinal: (token, data) => ({
        type: 'SUBMIT_MUTASI_FINAL',
        payload: http(token).post(`/mutasi/subfin`, qs.stringify(data))
    }),
    getDetailMutasi: (token, no, tipe) => ({
        type: 'GET_DETAIL_MUT',
        payload: http(token).patch(`/mutasi/detail`, qs.stringify({no: no, tipe: tipe}))
    }),
    getApproveMutasi: (token, no, nama) => ({
        type: 'GET_APPROVE_MUT',
        payload: http(token).patch(`/mutasi/approve`, qs.stringify({no: no, nama: nama}))
    }),
    approveMutasi: (token, no, index) => ({
        type: 'APPROVE_MUTASI',
        payload: http(token).patch(`/mutasi/app`, qs.stringify({no: no, indexApp: index}))
    }),
    rejectMutasi: (token, data) => ({
        type: 'REJECT_MUTASI',
        payload: http(token).patch(`/mutasi/rej`, data)
    }),
    rejectEksekusi: (token, no, data) => ({
        type: 'REJECT_EKS',
        payload: http(token).patch(`/mutasi/rejeks`, qs.stringify({...data, no: no}))
    }),
    getDocumentMut: (token, no, nomut) => ({
        type: 'DOKUMEN_MUT',
        payload: http(token).patch(`/mutasi/doc`, qs.stringify({no: no, nomut: nomut}))
    }),
    uploadDocument: (token, id, data) => ({
        type: 'UPLOAD_DOCMUT',
        payload: http(token).post(`/mutasi/upload/${id}`, data)
    }),
    approveDocument: (token, id) => ({
        type: 'APPROVE_DOCMUT',
        payload: http(token).patch(`/mutasi/appdoc/${id}`)
    }),
    rejectDocMut: (token, id, data) => ({
        type: 'REJECT_DOCMUT',
        payload: http(token).patch(`/mutasi/rejdoc/${id}`, qs.stringify(data))
    }),
    updateBudget: (token, id, status) => ({
        type:'STATUS_BUDGET',
        payload: http(token).patch(`/mutasi/status/${id}/${status}`)
    }),
    submitEksekusi: (token, no) => ({
        type:'SUBMIT_EKS',
        payload: http(token).patch(`/mutasi/eks`, qs.stringify({no: no}))
    }),
    submitBudget: (token, no) => ({
        type:'SUBMIT_BUDGET',
        payload: http(token).patch(`/mutasi/budget`, qs.stringify({no: no}))
    }),
    updateStatus: (token, id, data) => ({
        type: 'UPDATE_EKS',
        payload: http(token).patch(`/mutasi/upstat/${id}`, qs.stringify(data))
    }),
    changeDate: (token, no, data) => ({
        type: 'CHANGE_DATE',
        payload: http(token).patch(`/mutasi/changeDate`, qs.stringify({...data, no: no}))
    }),
    submitEdit: (token, no) => ({
        type: 'SUBMIT_EDIT',
        payload: http(token).patch(`/mutasi/subedit`, qs.stringify({no: no}))
    }),
    appRevisi: (token, id, type) => ({
        type: 'APP_REVISI_MUTASI',
        payload: http(token).patch(`/mutasi/apprev/${id}/${type === undefined ? 'kode' : type}`)
    }),
    submitRevisi: (token, data) => ({
        type: 'SUBMIT_REVISI_MUTASI',
        payload: http(token).patch(`/mutasi/subrev`, qs.stringify(data))
    }),
    updateReason: (token, data) => ({
        type: 'UPDATE_REASON_MUTASI',
        payload: http(token).patch(`/mutasi/upreason`, qs.stringify(data))
    }),
    resetAddMut: () => ({
        type: 'RESET_ADD_MUT'
    }),
    resetMutasi: () => ({
        type: 'RESET_MUTASI'
    })
}