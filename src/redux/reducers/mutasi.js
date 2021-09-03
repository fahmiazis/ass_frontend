/* eslint-disable import/no-anonymous-default-export */
const mutasiState = {
    isAdd: false,
    isUpdate: false,
    isGet: false,
    isGetRec: false,
    isGetApprove: false,
    isGetDet: false,
    isDokumen: false,
    isSubmit: false,
    isDelete: false,
    isLoading: false,
    isError: false,
    isApprove: false,
    isReject: false,
    detailMut: {},
    mutApp: {},
    nomor_mutasi: '',
    alertMsg: '',
    alertM: '',
    dataMut: [],
    page: {},
    noMut: [],
    dataDoc: [],
    errorAdd: false
};

export default (state=mutasiState, action) => {
        switch(action.type){
            case 'ADD_MUTASI_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'ADD_MUTASI_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: true,
                    alertMsg: 'get approve Succesfully'
                };
            }
            case 'ADD_MUTASI_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    errorAdd: true,
                    isError: true,
                    alertMsg: "Unable connect to server",
                    alertM: action.payload.response.data.message
                };
            }
            case 'GET_MUTASI_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_MUTASI_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: true,
                    dataMut: action.payload.data.result.rows,
                    noMut: action.payload.data.noMut,
                    alertMsg: 'get mutasi Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'GET_MUTASI_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_MUTASI_REC_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_MUTASI_REC_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGetRec: true,
                    dataMut: action.payload.data.result.rows,
                    noMut: action.payload.data.noMut,
                    alertMsg: 'get mutasi Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'GET_MUTASI_REC_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_DETAIL_MUT_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_DETAIL_MUT_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGetDet: true,
                    dataMut: action.payload.data.result.rows,
                    alertMsg: 'get mutasi Succesfully',
                };
            }
            case 'GET_DETAIL_MUT_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'SUBMIT_MUTASI_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'SUBMIT_MUTASI_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isSubmit: true,
                    nomor_mutasi: action.payload.data.nomor_mutasi,
                    alertMsg: 'submit mutasi Succesfully'
                };
            }
            case 'SUBMIT_MUTASI_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_APPROVE_MUT_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_APPROVE_MUT_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGetApprove: true,
                    mutApp: action.payload.data.result,
                    alertMsg: 'get mutasi Succesfully',
                };
            }
            case 'GET_APPROVE_MUT_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'APPROVE_MUTASI_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'APPROVE_MUTASI_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isApprove: true,
                    alertMsg: 'approve mutasi Succesfully'
                };
            }
            case 'APPROVE_MUTASI_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'REJECT_MUTASI_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'REJECT_MUTASI_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isReject: true,
                    alertMsg: 'reject mutasi Succesfully'
                };
            }
            case 'REJECT_MUTASI_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'DOKUMEN_MUT_PENDING': {
                return {
                    ...state,
                    isDokumen: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'DOKUMEN_MUT_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isDokumen: true,
                    dataDoc: action.payload.data.result,
                    alertMsg: 'get document disposal Succesfully'
                };
            }
            case 'DOKUMEN_MUT_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'RESET_ADD_MUT': {
                return {
                    ...state,
                    errorAdd: false
                };
            }
            default: {
                return state;
            }
        }
    }