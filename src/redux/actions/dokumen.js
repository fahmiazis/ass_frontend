/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    addDokumen: (token, data) => ({
        type: 'ADD_DOKUMEN',
        payload: http(token).post(`/dokumen/add`, qs.stringify(data))
    }),
    updateDokumen: (token, id, data) => ({
        type: 'UPDATE_DOKUMEN',
        payload: http(token).patch(`/dokumen/update/${id}`, qs.stringify(data)),
    }),
    getAllDokumen: (token, limit, search, page) => ({
        type: 'GET_DOKUMEN',
        payload: http(token).get(`/dokumen/get?limit=${limit}&search=${search}&page=${page === undefined ? 1 : page}`)
    }),
    uploadMaster: (token, data) => ({
        type: 'UPLOAD_MASTER',
        payload: http(token).post(`/dokumen/master`, data)
    }),
    exportMaster: (token) => ({
        type: 'EXPORT_MASTER_DOKUMEN',
        payload: http(token).get(`/dokumen/export`)
    }),
    getDetailDokumen: (token, id) => ({
        type: 'GET_DETAIL_DOKUMEN',
        payload: http(token).get(`/dokumen/detail/${id}`)
    }),
    deleteDokumen: (token, id) => ({
        type: 'DELETE_DOKUMEN',
        payload: http(token).delete(`/dokumen/delete/${id}`)
    }),
    nextPage: (token, link) => ({
        type: 'NEXT_DATA_DOKUMEN',
        payload: http(token).get(`${link}`)
    }),
    getDokumen: (token, data) => ({
        type: 'GET_DOKUMEN',
        payload: http(token).patch(`/dokumen/docuser`, qs.stringify(data)),
    }),
    approveDokumen: (token, id, data) => ({
        type: 'APPROVE_DOKUMEN',
        payload: http(token).patch(`/dokumen/approve/${id === undefined ? 0 : id}`, data === undefined ? { list: [] } : data),
    }),
    rejectDokumen: (token, id, data) => ({
        type: 'REJECT_DOKUMEN',
        payload: http(token).patch(`/dokumen/reject/${id === undefined ? 0 : id}`, data === undefined ? { list: [] } : data),
    }),
    showDokumen: (token, id, no) => ({
        type: 'SHOW_DOK',
        payload: http(token).get(`/show/doc/${id}?no=${no}`)
    }),

    createNameDocument: (token, data) => ({
        type: 'CREATE_NAMEDOK',
        payload: http(token).post(`/dokumen/create`, qs.stringify(data))
    }),
    updateNameDocument: (token, data, id) => ({
        type: 'UPDATE_NAMEDOK',
        payload: http(token).patch(`/dokumen/name/edit/${id}`, qs.stringify(data))
    }),
    getNameDocument: (token, limit, search, page) => ({
        type: 'GET_NAMEDOK',
        payload: http(token).get(`/dokumen/name?limit=${limit}&search=${search}&page=${page === undefined ? 1 : page}`)
    }),
    getDetailDocument: (token, nama, kode) => ({
        type: 'GET_DETAIL_NAMEDOK',
        payload: http(token).get(`/dokumen/detail?nama=${nama}&kode=${kode}`)
    }),
    deleteNameDocument: (token, id) => ({
        type: 'DELETE_NAMEDOK',
        payload: http(token).delete(`/dokumen/delete/name/${id}`)
    }),
    getTempDoc: (token, id) => ({
        type: 'GET_TEMPLATE_NAMEDOK',
        payload: http(token).get(`/dokumen/template?id=${id}`)
    }),
    getDetailId: (token, id) => ({
        type: 'GET_DETAIL_DOKUMEN',
        payload: http(token).get(`/dokumen/detail/${id}`)
    }),

    resetError: () => ({
        type: 'RESET'
    })
}
