/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    login: (data) => ({
        type: 'AUTH_USER',
        payload: http().post(`/auth/login`, qs.stringify(data)),
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
    })
}
