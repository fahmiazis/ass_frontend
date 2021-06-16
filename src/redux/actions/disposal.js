import http from '../../helpers/http'
import qs from 'qs'

export default {
    getDisposal: (token) => ({
        type: 'GET_DISPOSAL',
        payload: http(token).get(`/disposal/get`)
    }),
    addDisposal: (token, id) => ({
        type: 'ADD_DISPOSAL',
        payload: http(token).post(`/disposal/add/${id}`)
    }),
    deleteDisposal: (token, asset) => ({
        type: 'DELETE_DISPOSAL',
        payload: http(token).delete(`/disposal/delete/${asset}`)
    }),
    reset: () => ({
        type: 'RESET_DISPOSAL'
    })
}
