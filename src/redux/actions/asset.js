/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    getAsset: (token, limit, search, page, tipe) => ({
        type: 'GET_ASSET',
        payload: http(token).get(`/asset/get?limit=${limit}&search=${search}&page=${page === undefined ? 1 : page}&sort=id&tipe=${tipe === undefined ? 'all' : tipe}`)
    }),
    nextPage: (token, link) => ({
        type: 'NEXT_DATA_ASSET',
        payload: http(token).get(`${link}`)
    }),
    resetError: () => ({
        type: 'RESET_ASSET'
    }),
    updateAsset: (token, id, data) => ({
        type: 'UPDATE_ASSET',
        payload: http(token).patch(`/asset/update/${id}`, qs.stringify(data))
    })
}