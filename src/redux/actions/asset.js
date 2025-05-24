/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import httpsync from '../../helpers/httpsync'
import qs from 'qs'

export default {
    getAsset: (token, limit, search, page, tipe) => ({
        type: 'GET_ASSET',
        payload: http(token).get(`/asset/get?limit=${limit}&search=${search}&page=${page === undefined ? 1 : page}&sort=id&tipe=${tipe === undefined ? 'all' : tipe}`)
    }),
    getAssetAll: (token, limit, search, page, tipe, area) => ({
        type: 'GET_ASSETALL',
        payload: http(token).get(`/asset/all?limit=${limit}&search=${search}&page=${page === undefined ? 1 : page}&sort=id&tipe=${tipe === undefined ? 'all' : tipe}&area=${area === undefined ? 'all' : area}`)
    }),
    getDetailAsset: (token, no) => ({
        type: 'GET_DETAIL',
        payload: http(token).get(`/asset/detail/${no}`)
    }),
    nextPage: (token, link) => ({
        type: 'NEXT_DATA_ASSET',
        payload: http(token).get(`${link}`)
    }),
    updateAsset: (token, id, data) => ({
        type: 'UPDATE_ASSET',
        payload: http(token).patch(`/asset/update/${id}`, qs.stringify(data))
    }),
    uploadMasterAsset: (token, data) => ({
        type: 'UPLOAD_ASSET',
        payload: http(token).post(`/asset/master`, data)
    }),
    updateAssetNew: (token, id, data) => ({
        type: 'UPDATE_ASSETNEW',
        payload: http(token).patch(`/asset/update/${id}`, qs.stringify(data))
    }),
    syncAsset: (token, type, noAset, date1) => ({
        type: 'SYNC_ASSET',
        payload: httpsync(token).get(`/asset/sync?type=${type}&noAset=${noAset}&date1=${date1}`),
    }),
    resetError: () => ({
        type: 'RESET_ASSET'
    }),
    resetData: () => ({
        type: 'RESET_DATA'
    })
}