// src/helpers/approvalHelper.js (UPDATED)

export const buildListRole = (detailUser, dataRole) => {
  const arrRole = detailUser?.detail_role || []
  const listRole = []
  
  for (let i = 0; i < arrRole.length + 1; i++) {
    if (detailUser?.level === 1 || detailUser?.user_level === 1) {
      // Admin role
      if (i === 0) {
        listRole.push({
          fullname: 'admin',
          name: 'admin',
          nomor: '1',
          type: 'all'
        })
      }
    } else if (i === arrRole.length) {
      // User's main role/level
      const cek = dataRole.find(item => parseInt(item.nomor) === detailUser?.level)
      if (cek !== undefined) {
        listRole.push(cek)
      }
    } else {
      // User's additional roles from detail_role
      const cek = dataRole.find(item => parseInt(item.nomor) === arrRole[i].id_role)
      if (cek !== undefined) {
        listRole.push(cek)
      }
    }
  }
  
  return listRole
}

export const checkAvailableApproval = (item, listRole, dataDepo, detailUser, level, kode) => {
  const depoFrm = dataDepo.find(d => d.kode_plant === item.kode_plant)
  
  for (let x = 0; x < listRole.length; x++) {
    const app = item.appForm || []
    
    const cekFrm = listRole[x].type === 'area' && depoFrm !== undefined
      ? ((depoFrm.nama_bm && depoFrm.nama_bm.toLowerCase() === detailUser?.fullname.toLowerCase()) ||
         (depoFrm.nama_om && depoFrm.nama_om.toLowerCase() === detailUser?.fullname.toLowerCase()) ||
         (depoFrm.nama_aos && depoFrm.nama_aos.toLowerCase() === detailUser?.fullname.toLowerCase())
          ? 'pengirim'
          : 'not found')
      : 'all'
    
    const cekFin = cekFrm === 'pengirim' ? 'all' : 'all'
    
    const cekApp = app.find(a =>
      (a.jabatan === listRole[x].name) &&
      (cekFin === 'all'
        ? (a.struktur === null || a.struktur === 'all')
        : (a.struktur === cekFin))
    )
    
    const find = app.indexOf(cekApp)
    
    if (find === -1) continue
    
    // Check approval conditions
    if (level === '5' || level === '9') {
      if (find === 0 || find === '0') {
        if (item.status_reject !== 1 &&
            app[find] !== undefined &&
            app[find + 1]?.status === 1 &&
            app[find].status !== 1) {
          return true
        }
      } else {
        if (find !== app.length - 1) {
          if (item.status_reject !== 1 &&
              app[find] !== undefined &&
              app[find + 1]?.status === 1 &&
              app[find - 1]?.status === null &&
              app[find].status !== 1) {
            return true
          }
        }
      }
    } else if (find === 0 || find === '0') {
      if (item.status_reject !== 1 &&
          app[find] !== undefined &&
          app[find + 1]?.status === 1 &&
          app[find].status !== 1) {
        return true
      }
    } else {
      if (item.status_reject !== 1 &&
          app[find] !== undefined &&
          app[find + 1]?.status === 1 &&
          app[find - 1]?.status === null &&
          app[find].status !== 1) {
        return true
      }
    }
  }
  
  return false
}

export const checkAvailableApprovalMutasi = (item, listRole, dataDepo, detailUser, level, kode) => {
  const depoFrm = dataDepo.find(d => d.kode_plant === item.kode_plant)
  const depoTo = dataDepo.find(d => d.kode_plant === item.kode_plant_rec)
  
  for (let x = 0; x < listRole.length; x++) {
    const app = item.appForm || []
    
    const cekFrm = listRole[x].type === 'area' && depoFrm !== undefined
      ? ((depoFrm.nama_bm && depoFrm.nama_bm.toLowerCase() === detailUser?.fullname.toLowerCase()) ||
         (depoFrm.nama_om && depoFrm.nama_om.toLowerCase() === detailUser?.fullname.toLowerCase()) ||
         (depoFrm.nama_aos && depoFrm.nama_aos.toLowerCase() === detailUser?.fullname.toLowerCase())
          ? 'pengirim'
          : 'not found')
      : 'all'
    
    const cekTo = listRole[x].type === 'area' && depoTo !== undefined
      ? ((depoTo.nama_bm && depoTo.nama_bm.toLowerCase() === detailUser?.fullname.toLowerCase()) ||
         (depoTo.nama_om && depoTo.nama_om.toLowerCase() === detailUser?.fullname.toLowerCase()) ||
         (depoTo.nama_aos && depoTo.nama_aos.toLowerCase() === detailUser?.fullname.toLowerCase())
          ? 'penerima'
          : 'not found')
      : 'all'
    
    const cekFin = cekFrm === 'pengirim' ? 'pengirim' : cekTo === 'penerima' ? 'penerima' : 'all'
    
    const cekApp = app.find(a =>
      (a.jabatan === listRole[x].name) &&
      (cekFin === 'all'
        ? (a.struktur === null || a.struktur === 'all')
        : (a.struktur === cekFin))
    )
    
    const find = app.indexOf(cekApp)
    
    if (find === -1) continue
    
    // Check approval conditions for Mutasi
    if (level === '5' || level === '9') {
      if (find === 0 || find === '0') {
        if (item.status_reject !== 1 &&
            app[find] !== undefined &&
            app[find + 1]?.status === 1 &&
            app[find].status !== 1 &&
            item.kode_plant_rec === kode) {
          return true
        }
      } else {
        if (find !== app.length - 1) {
          if (item.status_reject !== 1 &&
              app[find] !== undefined &&
              app[find + 1]?.status === 1 &&
              app[find - 1]?.status === null &&
              app[find].status !== 1 &&
              item.kode_plant_rec === kode) {
            return true
          }
        }
      }
    } else if (find === 0 || find === '0') {
      if (item.status_reject !== 1 &&
          app[find] !== undefined &&
          app[find + 1]?.status === 1 &&
          app[find].status !== 1) {
        return true
      }
    } else {
      if (item.status_reject !== 1 &&
          app[find] !== undefined &&
          app[find + 1]?.status === 1 &&
          app[find - 1]?.status === null &&
          app[find].status !== 1) {
        return true
      }
    }
  }
  
  return false
}

export const checkAvailablePengadaanArea = (item, listRole, dataDepo, detailUser, level) => {
  const depoFrm = dataDepo.find(d => d.kode_plant === item.kode_plant)
  
  for (let x = 0; x < listRole.length; x++) {
    const app = item.appForm || []
    
    const cekFrm = listRole[x].type === 'area' && depoFrm !== undefined
      ? ((depoFrm.nama_bm && depoFrm.nama_bm.toLowerCase() === detailUser?.fullname.toLowerCase()) ||
         (depoFrm.nama_om && depoFrm.nama_om.toLowerCase() === detailUser?.fullname.toLowerCase()) ||
         (depoFrm.nama_aos && depoFrm.nama_aos.toLowerCase() === detailUser?.fullname.toLowerCase())
          ? 'pengirim'
          : 'not found')
      : 'all'
    
    const cekFin = cekFrm === 'pengirim' ? 'all' : 'all'
    
    const cekApp = app.find(a =>
      (a.jabatan === listRole[x].name) &&
      (cekFin === 'all'
        ? (a.struktur === null || a.struktur === 'all')
        : (a.struktur === cekFin))
    )
    
    const find = app.indexOf(cekApp)
    
    if (level === '5' || level === '9') {
      if (item.status_reject !== 1 &&
          item.status_form === '2' &&
          (app[find] === undefined || app.length === 0)) {
        return true
      } else if (item.status_reject !== 1 &&
                 item.status_form === '2' &&
                 app[find]?.status === null) {
        return true
      }
    } else if (find === 0 || find === '0') {
      if (item.status_reject !== 1 &&
          app[find] !== undefined &&
          app[find + 1]?.status === 1 &&
          app[find].status !== 1) {
        return true
      }
    } else if (find === (app.length - 1)) {
      if (item.status_reject !== 1 &&
          app[find] !== undefined &&
          app[find - 1]?.status === null &&
          app[find]?.status !== 1) {
        return true
      }
    } else {
      if (item.status_reject !== 1 &&
          app[find] !== undefined &&
          app[find + 1]?.status === 1 &&
          app[find - 1]?.status === null &&
          app[find]?.status !== 1) {
        return true
      }
    }
  }
  
  return false
}