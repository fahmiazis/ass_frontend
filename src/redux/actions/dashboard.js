/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http';
import qs from 'qs';
import moment from 'moment'

export default {
  getDashboard: (token, year) => ({
    type: 'GET_DASHBOARD',
    payload: http(token).get(`/dashboard/get-six?year=${year === undefined ? moment().format('YYYY') : year}`),
  }),
  getCountTransaction: (token, year) => ({
    type: 'GET_COUNT_TRANSACTION_DASHBOARD',
    payload: http(token).get(`/dashboard/count-transaction`),
  }),
};
