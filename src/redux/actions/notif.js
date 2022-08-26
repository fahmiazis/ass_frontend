/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    getNotif: (token, limit) => ({
        type: 'GET_NOTIF',
        payload: http(token).get(`/notif/get?limit=${limit === undefined ? 20 : limit}`)
    }),
    delNotif: (token, id) => ({
        type: 'DEL_NOTIF',
        payload: http(token).delete(`/notif/delete/${id}`)
    }),
    upNotif: (token, id) => ({
        type: 'UP_NOTIF',
        payload: http(token).patch(`/notif/update/${id}`)
    }),
    delAllNotif: (token) => ({
        type: 'DELALL_NOTIF',
        payload: http(token).delete(`/notif/delall`)
    }),
    upAllNotif: (token) => ({
        type: 'UPALL_NOTIF',
        payload: http(token).patch(`/notif/upall`)
    }),
    notifDisposal: (token, no, tipe, apptipe, act, status, data) => ({
        type: 'NOTIF_DIS',
        payload: http(token).patch(`/notif/disposal/${no}?tipe=${tipe}&apptipe=${apptipe}&act=${act}&status=${status}`, qs.stringify(data))
    }),
    notifStock: (token, no, tipe, apptipe, act, status, data) => ({
        type: 'NOTIF_STOCK',
        payload: http(token).patch(`/notif/stock/${no}?tipe=${tipe}&apptipe=${apptipe}&act=${act}&status=${status}`, qs.stringify(data))
    }),
    notifMutasi: (token, no, tipe, apptipe, act, status, data) => ({
        type: 'NOTIF_MUT',
        payload: http(token).patch(`/notif/mutasi/${no}?tipe=${tipe}&apptipe=${apptipe}&act=${act}&status=${status}`, qs.stringify(data))
    }),
}
