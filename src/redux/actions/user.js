/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'
import httpsync from '../../helpers/httpsync'

export default {
    addUser: (token, data) => ({
        type: 'ADD_USER',
        payload: http(token).post(`/user/add`, qs.stringify(data))
    }),
    updateUser: (token, id, data) => ({
        type: 'UPDATE_USER',
        payload: http(token).patch(`/user/update/${id}`, qs.stringify(data)),
    }),
    getUser: (token, limit, search, page, filter, sortName, sortType, typeData) => ({
        type: 'GET_USER',
        payload: http(token).get(`/user/get?limit=${limit}&search=${search}&page=${page === undefined ? 1 : page}&filter=${filter}&sortName=${sortName}&sortType=${sortType}&typeData=${typeData}`)
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
    deleteUser: (token, data) => ({
        type: 'DELETE_USER',
        payload: http(token).patch(`/user/delete`, data)
    }),
    changePassword: (token, data) => ({
        type: 'CHANGE_PW',
        payload: http(token).patch('/user/password', qs.stringify(data))
    }),
    resetPassword: (token, id, data) => ({
        type: 'RESET_PW',
        payload: http(token).patch(`/user/reset/${id}`, qs.stringify(data))
    }),

    // Role
    getRole: (token, search) => ({
        type: 'GET_ROLE',
        payload: http(token).get(`/user/role/get?search=${search === undefined ? '' : search}`)
    }),
    addRole: (token, data) => ({
        type: 'ADD_ROLE',
        payload: http(token).post(`/user/role/add`, qs.stringify(data))
    }),
    updateRole: (token, id, data) => ({
        type: 'UPDATE_ROLE',
        payload: http(token).patch(`/user/role/update/${id}`, qs.stringify(data)),
    }),
    getDetailRole: (token, id) => ({
        type: 'GET_DETAIL_ROLE',
        payload: http(token).get(`/user/role/detail/${id}`)
    }),
    getRoleMenu: (token, id) => ({
        type: 'GET_MENU_ROLE',
        payload: http(token).get(`/user/role/menu-get/${id}`)
    }),
    updateRoleMenu: (token, id, data) => ({
        type: 'UPDATE_MENU_ROLE',
        payload: http(token).patch(`/user/role/menu-update/${id}`, qs.stringify(data))
    }),

    // HC PORTAL
    syncOnboarding: (token) => ({
        type: 'SYNC_ONBOARDING',
        payload: httpsync(token).get(`/edot/sync-onboarding`),
    }),
    syncOffboarding: (token) => ({
        type: 'SYNC_OFFBOARDING',
        payload: httpsync(token).get(`/edot/sync-offboarding`),
    }),
    resetError: () => ({
        type: 'RESET'
    })
}