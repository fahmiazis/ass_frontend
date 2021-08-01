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
    getApprove: (token) => ({
        type: 'GET_APPROVE',
        payload: http(token).get(`/approve/get`)
    }),
    getDetailApprove: (token, nama) => ({
        type: 'GET_DETAIL',
        payload: http(token).get(`/approve/detail/${nama}`)
    }),
    getNameApprove: (token) => ({
        type: 'GET_NAME',
        payload: http(token).get(`/approve/name`)
    }),
    updateApprove: (token, id, data) => ({
        type: 'UPDATE_APPROVE',
        payload: http(token).patch(`/approve/update/${id}`, qs.stringify(data))
    }),
    deleteApprove: (token, id) => ({
        type: 'DELETE_APPROVE',
        payload: http(token).delete(`/approve/delete/${id}`)
    }),
    resetError: () => ({
        type: 'RESET_APPROVE'
    })
}
