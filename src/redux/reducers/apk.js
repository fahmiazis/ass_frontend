/* eslint-disable import/no-anonymous-default-export */

const apkState = {
    isAdd: null,
    isLoading: false,
    isError: false,
    alertMsg: '',
    isRoute: false,
    dataApk: [],
    dataToken: {}
};

export default (state=apkState, action) => {
        switch(action.type){
            case 'ADD_APK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting....'
                };
            }
            case 'ADD_APK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: true,
                    alertMsg: 'Login Succesfully'
                };
            }
            case 'ADD_APK_REJECTED': {
                return {
                    ...state,
                    isAdd: false,
                    isLoading: false,
                    alertMsg: 'Login Failed'
                };
            }
            case 'GET_APK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting....'
                };
            }
            case 'GET_APK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    dataApk: action.payload.data.result.rows,
                    alertMsg: 'Login Succesfully'
                };
            }
            case 'GET_APK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    alertMsg: 'Login Failed'
                };
            }
            case 'DETAIL_APK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting....'
                };
            }
            case 'DETAIL_APK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    detailApk: action.payload.data.result,
                    alertMsg: 'Login Succesfully'
                };
            }
            case 'DETAIL_APK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    alertMsg: 'Login Failed'
                };
            }
            case 'RESET_APK': {
                return {
                    ...state,
                    isAdd: null,
                }
            }
            default: {
                return state;
            }
        }
    }