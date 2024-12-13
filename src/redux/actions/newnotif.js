/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    getNewNotif: (token, limit, search, page) => ({
        type: 'GET_NEWNOTIF',
        payload: http(token).get(`/newnotif/get?limit=${limit}&search=${search === undefined ? '' : search}&page=${page === undefined ? 1 : page}`),
    }),
    getAllNewNotif: (token, tipe) => ({
        type: 'GET_ALL_NEWNOTIF',
        payload: http(token).get(`/newnotif/all?tipe=${tipe}`)
    }),
    addNewNotif: (token, data) => ({
        type: 'ADD_NEWNOTIF',
        payload: http(token).post(`/newnotif/add`, data)
    }),
    readNewNotif: (token, id) => ({
        type: 'READ_NEWNOTIF',
        payload: http(token).patch(`/newnotif/read/${id}`)
    }),
    deleteNewNotif: (token, id) => ({
        type: 'DELETE_NEWNOTIF',
        payload: http(token).delete(`/newnotif/del/${id}`)
    }),
    nextPage: (token, link) => ({
        type: 'NEXT_DATA_NEWNOTIF',
        payload: http(token).get(`${link}`)
    }),
    resetError: () => ({
        type: 'RESET_NEWNOTIF'
    })
}
