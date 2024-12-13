/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    createMenu: (token, data) => ({
        type: 'CREATE_MENU',
        payload: http(token).post(`/menu/create`, qs.stringify(data))
    }),
    createNameMenu: (token, data) => ({
        type: 'CREATE_NAME_MENU',
        payload: http(token).post(`/menu/add`, qs.stringify(data))
    }),
    getMenu: (token) => ({
        type: 'GET_MENU',
        payload: http(token).get(`/menu/get`)
    }),
    getAllMenu: (token, type, name) => ({
        type: 'GET_ALL_MENU',
        payload: http(token).get(`/menu/all/${type}?name=${name}`)
    }),
    getDetailMenu: (token, nama) => ({
        type: 'GET_DETAIL_MENU',
        payload: http(token).get(`/menu/detail/${nama}`)
    }),
    getNameMenu: (token) => ({
        type: 'GET_NAME_MENU',
        payload: http(token).get(`/menu/name`)
    }),
    updateMenu: (token, id, data) => ({
        type: 'UPDATE_MENU',
        payload: http(token).patch(`/menu/update/${id}`, qs.stringify(data))
    }),
    deleteMenu: (token, id) => ({
        type: 'DELETE_MENU',
        payload: http(token).delete(`/menu/delete/${id}`)
    }),
    resetError: () => ({
        type: 'RESET_MENU'
    })
}
