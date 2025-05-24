/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    login: (data) => ({
        type: 'AUTH_USER',
        payload: http().post(`/auth/login`, qs.stringify(data)),
    }),
    choosePlant: (token, data) => ({
        type: 'CH_PLANT',
        payload: http(token).patch(`/user/chplant`, qs.stringify(data)),
    }),
    getLogin: (token, id) => ({
        type: 'GET_LOGIN',
        payload: http(token).patch(`/user/data/${id}`),
    }),
    getToken: (token, id) => ({
        type: 'GET_TOKEN',
        payload: http(token).patch(`/user/token/${id}`),
    }),
    setToken: (token) => ({
        type: 'SET_TOKEN',
        payload: { token }
    }),
    logout: () => ({
        type: 'LOGOUT',
    }),
    resetError: () => ({
        type: 'RESET'
    }),
    goRoute: () => ({
        type: 'ROUTE'
    })
}
