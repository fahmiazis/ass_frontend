/* eslint-disable import/no-anonymous-default-export */
const dokumenState = {
    isAdd: false,
    isUpload: false,
    isUpdate: false,
    isGet: false,
    isDetail: false,
    isDelete: false,
    token: '',
    isLoading: false,
    isError: false,
    alertMsg: '',
    dataDokumen: [],
    detailDokumen: {},
    alertM: '',
    alertUpload: [],
    page: {},
    isExport: false,
    link: '',
    dataDoc: [],
    appdoc: null,
    rejdoc: null,
    isShow: null,
    tipeDoc: [
        { tipe: 'sell', title: 'eksekusi penjualan', trans: 'disposal'},
        { tipe: 'dispose', title: 'eksekusi pemusnahan', trans: 'disposal' },
        { tipe: 'tax', title: 'verifikasi tax', trans: 'disposal' },
        { tipe: 'finance', title: 'verifikasi finance', trans: 'disposal' },
        { tipe: 'purch', title: 'verifikasi purchasing', trans: 'disposal' },
        { tipe: 'jual', title: 'pengajuan penjualan', trans: 'disposal' },
        { tipe: 'npwp', title: 'eksekusi penjualan npwp', trans: 'disposal' },
        { tipe: 'rec', title: 'terima mutasi', trans: 'mutasi' },
        { tipe: 'akta', title: 'Akta', trans: 'pengadaan' },
        { tipe: 'gudang', title: 'Gudang', trans: 'pengadaan' },
        { tipe: 'pengajuan', title: 'Pengajuan', trans: 'all' },
        { tipe: 'persetujuan', title: 'Persetujuan', trans: 'all' },
        { tipe: 'finance', title: 'verifikasi finance', trans: 'pengadaan' },
    ],
    tipeTrans: [
        { trans: 'disposal', title: 'Disposal asset' },
        { trans: 'mutasi', title: 'Mutasi asset' },
        { trans: 'pengadaan', title: 'Pengadaan asset' },
        { trans: 'stock', title: 'Stock Opname asset' }
    ],
    isEditName: null,
    isCreate: null,
    isGetName: null,
    dataName: [],
    isDetName: true,
    detailName: [],
    isDeleteName: null,
    idName: {},
    isTempName: null,
    isAddDocTemp: null,
    isUpdateDocTemp: null,
    isUploadDocTemp: null,
    isDeleteDocTemp: null,
    dataDocTemp: []
};

export default (state=dokumenState, action) => {
        switch(action.type){
            case 'SHOW_DOK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'SHOW_DOK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isShow: true,
                    dataShow: action.payload.config.url,
                    alertMsg: 'show document succesfully',
                };
            }
            case 'SHOW_DOK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isShow: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'EXPORT_MASTER_DOKUMEN_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'EXPORT_MASTER_DOKUMEN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isExport: true,
                    link: action.payload.data.link,
                    alertMsg: 'success export data'
                };
            }
            case 'EXPORT_MASTER_DOKUMEN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isExport: false,
                    isError: true,
                    alertMsg: 'Failed export data'
                };
            }
            case 'ADD_DOKUMEN_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'ADD_DOKUMEN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: true,
                    isError: false,
                    alertMsg: 'add dokumen Succesfully'
                };
            }
            case 'ADD_DOKUMEN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertM: action.payload.response.data.error
                };
            }
            case 'GET_DOKUMEN_PENDING': {
                return {
                    ...state,
                    isGet: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_DOKUMEN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isGet: true,
                    dataDokumen: action.payload.data.result.rows,
                    alertMsg: 'get dokumen Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'GET_DOKUMEN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'NEXT_DATA_DOKUMEN_PENDING': {
                return {
                    ...state,
                    isGet: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'NEXT_DATA_DOKUMEN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isGet: true,
                    dataDokumen: action.payload.data.result.rows,
                    alertMsg: 'get dokumen Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'NEXT_DATA_DOKUMEN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_DETAIL_DOKUMEN_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    isDetail: false,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_DETAIL_DOKUMEN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isDetail: true,
                    detailDokumen: action.payload.data.result,
                    alertMsg: 'get detail dokumen Succesfully'
                };
            }
            case 'GET_DETAIL_DOKUMEN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isDetail: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alert: action.payload.response.data.error
                };
            }
            case 'UPDATE_DOKUMEN_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Login in ....'
                };
            }
            case 'UPDATE_DOKUMEN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpdate: true,
                    isError: false,
                    alertMsg: 'update dokumen Succesfully'
                };
            }
            case 'UPDATE_DOKUMEN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpdate: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertM: action.payload.response.data.error
                };
            }
            case 'UPLOAD_MASTER_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting....'
                };
            }
            case 'UPLOAD_MASTER_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpload: true,
                    isError: false,
                    alertMsg: 'upload master Succesfully'
                };
            }
            case 'UPLOAD_MASTER_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpload: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertUpload: action.payload.response.data.result
                };
            }
            case 'APPROVE_DOKUMEN_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'APPROVE_DOKUMEN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    appdoc: true,
                    alertMsg: 'upload document succesfully',
                };
            }
            case 'APPROVE_DOKUMEN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    appdoc: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'REJECT_DOKUMEN_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'REJECT_DOKUMEN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    rejdoc: true,
                    alertMsg: 'upload document succesfully',
                };
            }
            case 'REJECT_DOKUMEN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    rejdoc: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_USER_DOKUMEN_PENDING': {
                return {
                    ...state,
                    isGet: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_USER_DOKUMEN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isGet: true,
                    dataDoc: action.payload.data.result,
                    alertMsg: 'get document io Succesfully',
                };
            }
            case 'GET_USER_DOKUMEN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'CREATE_NAMEDOK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'CREATE_NAMEDOK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isCreate: true,
                    alertMsg: 'add approve Succesfully'
                };
            }
            case 'CREATE_NAMEDOK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isCreate: false,
                    alertMsg: action.payload.response.data === undefined ? "Unable connect to server" : action.payload.response.data.message
                };
            }
            case 'UPDATE_NAMEDOK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'UPDATE_NAMEDOK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isEditName: true,
                    alertMsg: 'edit name approve Succesfully'
                };
            }
            case 'UPDATE_NAMEDOK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isEditName: false,
                    alertMsg: action.payload.response.data === undefined ? "Unable connect to server" : action.payload.response.data.message
                };
            }
            case 'GET_NAMEDOK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_NAMEDOK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGetName: true,
                    dataName: action.payload.data.result.rows,
                    page: action.payload.data.pageInfo,
                    alertMsg: 'get approve Succesfully',
                };
            }
            case 'GET_NAMEDOK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isGetName: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_TEMPLATE_NAMEDOK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_TEMPLATE_NAMEDOK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isTempName: true,
                    idName: action.payload.data.result,
                    alertMsg: 'get detail approve Succesfully',
                };
            }
            case 'GET_TEMPLATE_NAMEDOK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isTempName: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_DETAIL_NAMEDOK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_DETAIL_NAMEDOK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isDetName: true,
                    detailName: action.payload.data.result,
                    alertMsg: 'get detail approve Succesfully',
                };
            }
            case 'GET_DETAIL_NAMEDOK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isDetName: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'DELETE_NAMEDOK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'DELETE_NAMEDOK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isDeleteName: true,
                    alertMsg: 'delete approve Succesfully',
                };
            }
            case 'DELETE_NAMEDOK_REJECTED': {
                return {
                    ...state,
                    isDeleteName: false,
                    isLoading: false,
                    alertMsg: "Unable connect to server"
                };
            }

            // Document Template
            case 'ADD_DOCTEMP_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'ADD_DOCTEMP_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAddDocTemp: true,
                    alertMsg: 'delete approve Succesfully',
                };
            }
            case 'ADD_DOCTEMP_REJECTED': {
                return {
                    ...state,
                    isAddDocTemp: false,
                    isLoading: false,
                    alertMsg: "Unable connect to server"
                };
            }

            case 'UPDATE_DOCTEMP_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'UPDATE_DOCTEMP_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpdateDocTemp: true,
                    alertMsg: 'delete approve Succesfully',
                };
            }
            case 'UPDATE_DOCTEMP_REJECTED': {
                return {
                    ...state,
                    isUpdateDocTemp: false,
                    isLoading: false,
                    alertMsg: "Unable connect to server"
                };
            }

            case 'UPLOAD_DOCTEMP_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'UPLOAD_DOCTEMP_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUploadDocTemp: true,
                    alertMsg: 'delete approve Succesfully',
                };
            }
            case 'UPLOAD_DOCTEMP_REJECTED': {
                return {
                    ...state,
                    isUploadDocTemp: false,
                    isLoading: false,
                    alertMsg: "Unable connect to server"
                };
            }

            case 'DELETE_DOCTEMP_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'DELETE_DOCTEMP_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isDeleteDocTemp: true,
                    alertMsg: 'delete approve Succesfully',
                };
            }
            case 'DELETE_DOCTEMP_REJECTED': {
                return {
                    ...state,
                    isDeleteDocTemp: false,
                    isLoading: false,
                    alertMsg: "Unable connect to server"
                };
            }

            case 'GET_DOCTEMP_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_DOCTEMP_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    dataDocTemp: action.payload.data.result,
                    alertMsg: 'delete approve Succesfully',
                };
            }
            case 'GET_DOCTEMP_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    alertMsg: "Unable connect to server"
                };
            }

            case 'RESET': {
                return {
                    ...state,
                    isError: false,
                    isUpload: false,
                    isExport: false,
                    isShow: null,
                    isEditName: null,
                    isCreate: null,
                    isDetName: null,
                    isGetName: null,
                    isTempName: null,
                    isDeleteName: null,
                }
            }
            default: {
                return state;
            }
        }
    }