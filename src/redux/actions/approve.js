/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    createApprove: (token, data) => ({
        type: 'CREATE_APPROVE',
        payload: http(token).post(`/approve/create`, qs.stringify(data))
    }),
    createNameApprove: (token, data) => ({
        type: 'CREATE_NAME',
        payload: http(token).post(`/approve/add`, qs.stringify(data))
    }),
    updateNameApprove: (token, data, id) => ({
        type: 'UPDATE_NAMEAPP',
        payload: http(token).patch(`/approve/name/edit/${id}`, qs.stringify(data))
    }),
    getApprove: (token) => ({
        type: 'GET_APPROVE',
        payload: http(token).get(`/approve/get`)
    }),
    getDetailApprove: (token, nama, kode) => ({
        type: 'GET_DETAIL',
        payload: http(token).get(`/approve/detail?nama=${nama}&kode=${kode}`)
    }),
    getDetailId: (token, id) => ({
        type: 'GET_DETAILID',
        payload: http(token).get(`/approve/detail/name/${id}`)
    }),
    getNameApprove: (token) => ({
        type: 'GET_NAME',
        payload: http(token).get(`/approve/name`)
    }),
    getAppPlant: (token, kode) => ({
        type: 'GET_PLANTAPP',
        payload: http(token).get(`/approve/plant?kode=${kode}`)
    }),
    updateApprove: (token, id, data) => ({
        type: 'UPDATE_APPROVE',
        payload: http(token).patch(`/approve/update/${id}`, qs.stringify(data))
    }),
    deleteApprove: (token, id) => ({
        type: 'DELETE_APPROVE',
        payload: http(token).delete(`/approve/delete/${id}`)
    }),
    deleteNameApprove: (token, id) => ({
        type: 'DELETE_NAMEAPPROVE',
        payload: http(token).delete(`/approve/delete/name/${id}`)
    }),
    resetError: () => ({
        type: 'RESET_APPROVE'
    })
}
