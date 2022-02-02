/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'

export default {
    getTrack: (token) => ({
        type: 'GET_TRACK',
        payload: http(token).get(`/track/get`)
    }),
    trackMutasi: (token) => ({
        type: 'TRACK_MUT',
        payload: http(token).get(`/track/mutasi`)
    })
}


