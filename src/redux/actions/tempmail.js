/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    getEmail: (token, limit, search, page) => ({
        type: 'GET_TEMPMAIL',
        payload: http(token).get(`/tempmail/get?limit=${limit}&search=${search}&page=${page === undefined ? 1 : page}`),
    }),
    getAllEmail: (token) => ({
        type: 'GET_ALL_TEMPMAIL',
        payload: http(token).get(`/tempmail/all`)
    }),
    getDetailEmail: (token, id) => ({
        type: 'DETAIL_TEMPMAIL',
        payload: http(token).get(`/tempmail/detail/${id}`)
    }),
    addEmail: (token, data) => ({
        type: 'ADD_TEMPMAIL',
        payload: http(token).post(`/tempmail/add`, qs.stringify(data))
    }),
    getDraftEmail: (token, data) => ({
        type: 'DRAFT_TEMPMAIL',
        payload: http(token).patch(`/tempmail/draft`, data)
    }),
    getDraftAjuan: (token, data) => ({
        type: 'AJUAN_TEMPMAIL',
        payload: http(token).patch(`/tempmail/drajuan`, data)
    }),
    sendEmail: (token, data) => ({
        type: 'SEND_TEMPMAIL',
        payload: http(token).patch(`/tempmail/send`, data)
    }),
    updateEmail: (token, data, id) => ({
        type: 'UPDATE_TEMPMAIL',
        payload: http(token).patch(`/tempmail/update/${id}`, qs.stringify(data))
    }),
    deleteEmail: (token, id) => ({
        type: 'DELETE_TEMPMAIL',
        payload: http(token).delete(`/tempmail/del/${id}`)
    }),
    getResmail: (token, data) => ({
        type: 'GET_RESMAIL',
        payload: http(token).patch(`/tempmail/resmail`, data)
    }),
    nextPage: (token, link) => ({
        type: 'NEXT_DATA_TEMPMAIL',
        payload: http(token).get(`${link}`)
    }),
    resetError: () => ({
        type: 'RESET_TEMPMAIL'
    })
}
