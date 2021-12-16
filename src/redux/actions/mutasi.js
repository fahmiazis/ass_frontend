/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    addMutasi: (token, no, plant) => ({
        type: 'ADD_MUTASI',
        payload: http(token).post(`/mutasi/add/${no}/${plant}`)
    }),
    getMutasi: (token) => ({
        type: 'GET_MUTASI',
        payload: http(token).get(`/mutasi/get`)
    }),
    getMutasiRec: (token) => ({
        type: 'GET_MUTASI_REC',
        payload: http(token).get(`/mutasi/rec`)
    }),
    deleteMutasi: (token, no) => ({
        type: 'DELETE_MUTASI',
        payload: http(token).delete(`/mutasi/del/${no}`)
    }),
    submitMutasi: (token, data) => ({
        type: 'SUBMIT_MUTASI',
        payload: http(token).post(`/mutasi/submit`, qs.stringify(data))
    }),
    getDetailMutasi: (token, no) => ({
        type: 'GET_DETAIL_MUT',
        payload: http(token).get(`/mutasi/detail/${no}`)
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
        payload: http(token).patch(`/mutasi/app/${no}`, qs.stringify(data))
    }),
    getDocumentMut: (token, no, nomut) => ({
        type: 'DOKUMEN_MUT',
        payload: http(token).get(`/mutasi/doc/${no}/${nomut}`)
    }),
    resetAddMut: () => ({
        type: 'RESET_ADD_MUT'
    }),
    resetAppRej: () => ({
        type: 'RESET_APPREJMUT'
    })
}