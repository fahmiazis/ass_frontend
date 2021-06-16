/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    getAsset: (token, limit, search, page) => ({
        type: 'GET_ASSET',
        payload: http(token).get(`/asset/get?limit=${limit}&search=${search}&page=${page === undefined ? 1 : page}`)
    }),
    nextPage: (token, link) => ({
        type: 'NEXT_DATA_ASSET',
        payload: http(token).get(`${link}`)
    }),
    resetError: () => ({
        type: 'RESET_ASSET'
    })
}