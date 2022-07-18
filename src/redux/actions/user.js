/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    addUser: (token, data) => ({
        type: 'ADD_USER',
        payload: http(token).post(`/user/add`, qs.stringify(data))
    }),
    updateUser: (token, id, data) => ({
        type: 'UPDATE_USER',
        payload: http(token).patch(`/user/update/${id}`, qs.stringify(data)),
    }),
    getUser: (token, limit, search, page, filter) => ({
        type: 'GET_USER',
        payload: http(token).get(`/user/get?limit=${limit}&search=${search}&page=${page === undefined ? 1 : page}&filter=${filter}`)
    }),
    uploadMaster: (token, data) => ({
        type: 'UPLOAD_MASTER',
        payload: http(token).post(`/user/master`, data)
    }),
    exportMaster: (token) => ({
        type: 'EXPORT_MASTER_USER',
        payload: http(token).get(`/user/export`)
    }),
    getDetailUser: (token, id) => ({
        type: 'GET_DETAIL_USER',
        payload: http(token).get(`/user/detail/${id}`)
    }),
    nextPage: (token, link) => ({
        type: 'NEXT_DATA_USER',
        payload: http(token).get(`${link}`)
    }),
    deleteUser: (token, id) => ({
        type: 'DELETE_USER',
        payload: http(token).delete(`/user/delete/${id}`)
    }),
    getRole: (token) => ({
        type: 'GET_ROLE',
        payload: http(token).get(`/user/role/get`)
    }),
    changePassword: (token, data) => ({
        type: 'CHANGE_PW',
        payload: http(token).patch('/user/password', qs.stringify(data))
    }),
    resetPassword: (token, id, data) => ({
        type: 'RESET_PW',
        payload: http(token).patch(`/user/reset/${id}`, qs.stringify(data))
    }),
    resetError: () => ({
        type: 'RESET'
    })
}