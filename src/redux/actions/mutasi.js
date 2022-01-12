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
    getMutasi: (token, status) => ({
        type: 'GET_MUTASI',
        payload: http(token).get(`/mutasi/get?status=${status === undefined ? 2 : status}`)
    }),
    getMutasiRec: (token, tipe) => ({
        type: 'GET_MUTASI_REC',
        payload: http(token).get(`/mutasi/rec?tipe=${tipe}`)
    }),
    deleteMutasi: (token, no) => ({
        type: 'DELETE_MUTASI',
        payload: http(token).delete(`/mutasi/del/${no}`)
    }),
    submitMutasi: (token, data) => ({
        type: 'SUBMIT_MUTASI',
        payload: http(token).post(`/mutasi/submit`, qs.stringify(data))
    }),
    getDetailMutasi: (token, no, tipe) => ({
        type: 'GET_DETAIL_MUT',
        payload: http(token).get(`/mutasi/detail/${no}/${tipe}`)
    }),
    getApproveMutasi: (token, no, nama) => ({
        type: 'GET_APPROVE_MUT',
        payload: http(token).get(`/mutasi/approve/${no}/${nama}`)
    }),
    approveMutasi: (token, no) => ({
        type: 'APPROVE_MUTASI',
        payload: http(token).patch(`/mutasi/app/${no}`)
    }),
    rejectMutasi: (token, no, data) => ({
        type: 'REJECT_MUTASI',
        payload: http(token).patch(`/mutasi/rej/${no}`, qs.stringify(data))
    }),
    rejectEksekusi: (token, no, data) => ({
        type: 'REJECT_EKS',
        payload: http(token).patch(`/mutasi/rejeks/${no}`, qs.stringify(data))
    }),
    getDocumentMut: (token, no, nomut) => ({
        type: 'DOKUMEN_MUT',
        payload: http(token).get(`/mutasi/doc/${no}/${nomut}`)
    }),
    rejectDocMut: (token, id, data, tipe) => ({
        type:'REJECT_DOCMUT',
        payload: http(token).patch(`/mutasi/docrej/${id}?tipe=${tipe}`, qs.stringify(data))
    }),
    updateBudget: (token, id, status) => ({
        type:'STATUS_BUDGET',
        payload: http(token).patch(`/mutasi/status/${id}/${status}`)
    }),
    submitEksekusi: (token, no) => ({
        type:'SUBMIT_EKS',
        payload: http(token).get(`/mutasi/eks/${no}`)
    }),
    submitBudget: (token, no) => ({
        type:'SUBMIT_BUDGET',
        payload: http(token).get(`/mutasi/budget/${no}`)
    }),
    updateStatus: (token, id, data) => ({
        type: 'UPDATE_EKS',
        payload: http(token).patch(`/mutasi/upstat/${id}`, qs.stringify(data))
    }),
    changeDate: (token, no, data) => ({
        type: 'CHANGE_DATE',
        payload: http(token).patch(`/mutasi/changeDate/${no}`, qs.stringify(data))
    }),
    submitEdit: (token, no) => ({
        type: 'SUBMIT_EDIT',
        payload: http(token).patch(`/mutasi/subedit/${no}`)
    }),
    resetAddMut: () => ({
        type: 'RESET_ADD_MUT'
    }),
    resetAppRej: () => ({
        type: 'RESET_APPREJMUT'
    })
}