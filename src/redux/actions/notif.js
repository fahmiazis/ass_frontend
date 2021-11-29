/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    getNotif: (token) => ({
        type: 'GET_NOTIF',
        payload: http(token).get(`/notif/get`)
    })
}
