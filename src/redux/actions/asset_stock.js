/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import httpsync from '../../helpers/httpsync'
import qs from 'qs'

export default {
    getAsset: (token, limit, search, page, tipe) => ({
        type: 'GET_ASSETSTOCK',
        payload: http(token).get(`/asset-stock/get?limit=${limit}&search=${search}&page=${page === undefined ? 1 : page}&sort=id&tipe=${tipe === undefined ? 'all' : tipe}`)
    }),
    getAssetAll: (token, limit, search, page, tipe, area) => ({
        type: 'GET_ASSETSTOCKALL',
        payload: http(token).get(`/asset-stock/all?limit=${limit}&search=${search}&page=${page === undefined ? 1 : page}&sort=id&tipe=${tipe === undefined ? 'all' : tipe}&area=${area === undefined ? 'all' : area}`)
    }),
    getDetailAsset: (token, no) => ({
        type: 'GET_DETAIL',
        payload: http(token).get(`/asset-stock/detail/${no}`)
    }),
    nextPage: (token, link) => ({
        type: 'NEXT_DATA_ASSETSTOCK',
        payload: http(token).get(`${link}`)
    }),
    updateAsset: (token, id, data) => ({
        type: 'UPDATE_ASSETSTOCK',
        payload: http(token).patch(`/asset-stock/update/${id}`, qs.stringify(data))
    }),
    uploadMasterAsset: (token, data) => ({
        type: 'UPLOAD_ASSETSTOCK',
        payload: http(token).post(`/asset-stock/master`, data)
    }),
    updateAssetNew: (token, id, data) => ({
        type: 'UPDATE_ASSETSTOCKNEW',
        payload: http(token).patch(`/asset-stock/update/${id}`, qs.stringify(data))
    }),
    syncAsset: (token, type, noAset, date1) => ({
        type: 'SYNC_ASSETSTOCK',
        payload: httpsync(token).get(`/asset-stock/sync?type=${type}&noAset=${noAset}&date1=${date1}`),
    }),
    resetError: () => ({
        type: 'RESET_ASSETSTOCK'
    }),
    resetData: () => ({
        type: 'RESET_DATA'
    })
}