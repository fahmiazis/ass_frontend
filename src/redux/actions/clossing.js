/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    getAllClossing: (token, tipe) => ({
        type: 'GET_ALLCLOSSING',
        payload: http(token).get(`/clossing/all/${tipe}`),
    }),
    getClossing: (token, limit, search, page) => ({
        type: 'GET_CLOSSING',
        payload: http(token).get(`/clossing/get?limit=${limit}&search=${search}&page=${page === undefined ? 1 : page}`)
    }),
    getDetailClossing: (token, id) => ({
        type: 'DETAIL_CLOSSING',
        payload: http(token).get(`/clossing/detail/${id}`),
    }),
    addClossing: (token, data) => ({
        type: 'ADD_CLOSSING',
        payload: http(token).post(`/clossing/add`, qs.stringify(data))
    }),
    updateClossing: (token, id, data) => ({
        type: 'UPDATE_CLOSSING',
        payload: http(token).patch(`/clossing/update/${id}`, qs.stringify(data))
    }),
    deleteClossing: (token, id) => ({
        type: 'DELETE_CLOSSING',
        payload: http(token).delete(`/clossing/delete/${id}`)
    }),
    nextPage: (token, link) => ({
        type: 'NEXT_DATA_CLOSSING',
        payload: http(token).get(`${link}`)
    }),
    resetError: () => ({
        type: 'RESET_CLOSSING'
    })
}
