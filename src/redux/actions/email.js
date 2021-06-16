/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    addEmail: (token, data) => ({
        type: 'ADD_EMAIL',
        payload: http(token).post(`/email/add`, qs.stringify(data))
    }),
    updateEmail: (token, id, data) => ({
        type: 'UPDATE_EMAIL',
        payload: http(token).patch(`/email/update/${id}`, qs.stringify(data)),
    }),
    getEmail: (token, limit, search, page) => ({
        type: 'GET_EMAIL',
        payload: http(token).get(`/email/get?limit=${limit}&search=${search}&page=${page === undefined ? 1 : page}`)
    }),
    uploadMaster: (token, data) => ({
        type: 'UPLOAD_MASTER',
        payload: http(token).post(`/email/master`, data)
    }),
    exportMaster: (token) => ({
        type: 'EXPORT_MASTER_EMAIL',
        payload: http(token).get(`/email/export`)
    }),
    getDetailEmail: (token, id) => ({
        type: 'GET_DETAIL_EMAIL',
        payload: http(token).get(`/email/detail/${id}`)
    }),
    deleteEmail: (token, id) => ({
        type: 'DELETE_EMAIL',
        payload: http(token).delete(`/email/delete/${id}`)
    }),
    nextPage: (token, link) => ({
        type: 'NEXT_DATA_EMAIL',
        payload: http(token).get(`${link}`)
    }),
    resetError: () => ({
        type: 'RESET'
    })
}
