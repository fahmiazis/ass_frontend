/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    getReportDisposal: (token, limit, search, page, status, tipe) => ({
        type: 'GET_REPORTDIS',
        payload: http(token).get(`/report/disposal?limit=${limit === undefined ? 10 : limit}&search=${search === undefined ? '' : search}&page=${page === undefined ? 1 : page}&status=${status === undefined ? 1 : status}&tipe=${tipe === undefined ? 'disposal' : tipe}`)
    }),
    getReportMutasi: (token, limit, search, page, status, tipe) => ({
        type: 'GET_REPORTMUT',
        payload: http(token).get(`/report/mutasi?limit=${limit === undefined ? 10 : limit}&search=${search === undefined ? '' : search}&page=${page === undefined ? 1 : page}&status=${status === undefined ? 1 : status}&tipe=${tipe === undefined ? 'disposal' : tipe}`)
    }),
}