import {combineReducers} from 'redux'

import pengadaan from './pengadaan'
import auth from './auth'
import depo from './depo'
import user from './user'
import asset from './asset'
import email from './email'
import dokumen from './dokumen'
import disposal from './disposal'

export default combineReducers({
  pengadaan,
  auth,
  depo,
  user,
  asset,
  email,
  dokumen,
  disposal
})
