import {combineReducers} from 'redux'
import { persistReducer } from "redux-persist";

import pengadaan from './pengadaan'
import auth from './auth'
import depo from './depo'
import user from './user'
import asset from './asset'
import approve from './approve'
import email from './email'
import tempmail from './tempmail'
import setuju from './setuju'
import dokumen from './dokumen'
import disposal from './disposal'
import stock from './stock'
import mutasi from './mutasi'
import notif from './notif'
import tracking from './tracking'
import report from './report'
import menu from './menu'
import newnotif from './newnotif'

export default combineReducers({
  pengadaan,
  auth,
  depo,
  user,
  asset,
  email,
  tempmail,
  dokumen,
  disposal,
  approve,
  setuju,
  stock,
  mutasi,
  notif,
  tracking,
  report,
  menu,
  newnotif
})
