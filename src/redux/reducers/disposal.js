/* eslint-disable import/no-anonymous-default-export */
const disposalState = {
    isAdd: false,
    isUpload: false,
    isUpdate: false,
    isGet: false,
    isDetail: false,
    isDelete: false,
    isLoading: false,
    isError: false,
    alertMsg: '',
    dataDis: [],
    alertM: '',
    page: {},
    isExport: false,
    link: ''
};

export default (state=disposalState, action) => {
        switch(action.type){
            case 'GET_DISPOSAL_PENDING': {
                return {
                    ...state,
                    isGet: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_DISPOSAL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: true,
                    dataDis: action.payload.data.result.rows,
                    alertMsg: 'get disposal Succesfully',
                };
            }
            case 'GET_DISPOSAL_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'ADD_DISPOSAL_PENDING': {
                return {
                    ...state,
                    isAdd: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'ADD_DISPOSAL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: true,
                    alertMsg: 'add disposal Succesfully',
                };
            }
            case 'ADD_DISPOSAL_REJECTED': {
                return {
                    ...state,
                    isAdd: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'DELETE_DISPOSAL_PENDING': {
                return {
                    ...state,
                    isDelete: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'DELETE_DISPOSAL_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isDelete: true,
                    alertMsg: 'add disposal Succesfully',
                };
            }
            case 'DELETE_DISPOSAL_REJECTED': {
                return {
                    ...state,
                    isDelete: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'RESET_DISPOSAL': {
                return {
                    ...state,
                    isError: false,
                    isUpload: false,
                    isGet: false,
                    isAdd: false,
                    isExport: false,
                    isDelete: false
                }
            }
            default: {
                return state;
            }
        }
    }