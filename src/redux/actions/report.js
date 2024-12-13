/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    getReportDisposal: (token, limit, search, page, status, tipe) => ({
        type: 'GET_REPORT_DISPOSAL',
        payload: http(token).get(`/report/disposal?limit=${limit === undefined ? 10 : limit}&search=${search === undefined ? '' : search}&page=${page === undefined ? 1 : page}&status=${status === undefined ? 1 : status}&tipe=${tipe === undefined ? 'disposal' : tipe}`)
    }),
    getReportMutasi: (token, limit, search, page, status, tipe) => ({
        type: 'GET_REPORT_MUTASI',
        payload: http(token).get(`/report/mutasi?limit=${limit === undefined ? 10 : limit}&search=${search === undefined ? '' : search}&page=${page === undefined ? 1 : page}&status=${status === undefined ? 1 : status}&tipe=${tipe === undefined ? 'disposal' : tipe}`)
    }),
    getReportIo: (token, limit, search, page, status, tipe) => ({
        type: 'GET_REPORT_IO',
        payload: http(token).get(`/report/io?limit=${limit === undefined ? 100 : limit}&search=${search === undefined ? '' : search}&page=${page === undefined ? 1 : page}&status=${status === undefined ? 8 : status}&tipe=${tipe === undefined ? 'selesai' : tipe}`)
    }),
    getExportStock: (token, no, date) => ({
        type: 'EXPORT_STOCK',
        payload: http(token).patch(`/stock/export?date=${date}`, qs.stringify({no: no}))
    })
}