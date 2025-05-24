/* eslint-disable import/no-anonymous-default-export */

const authState = {
    isLogin: false,
    isRegister: false,
    token: '',
    isLoading: false,
    isError: false,
    alertMsg: '',
    level: 0,
    isRoute: false,
    listUser: [],
    dataToken: {}
};

export default (state=authState, action) => {
        switch(action.type){
            case 'AUTH_USER_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Login in ....'
                };
            }
            case 'AUTH_USER_FULFILLED': {
                localStorage.setItem('token', action.payload.data.Token)
                localStorage.setItem('level', action.payload.data.user.user_level)
                localStorage.setItem('name', action.payload.data.user.username)
                localStorage.setItem('fullname', action.payload.data.user.fullname)
                localStorage.setItem('email', action.payload.data.user.email)
                localStorage.setItem('kode', action.payload.data.user.kode_plant)
                localStorage.setItem('id', action.payload.data.user.id)
                localStorage.setItem('role', action.payload.data.user.role)
                localStorage.setItem('it', action.payload.data.user.status_it)
                localStorage.setItem('dataUser', action.payload.data.user.dataUser.length)
                return {
                    ...state,
                    level: action.payload.data.user.user_level,
                    isLogin: true,
                    isError: false,
                    isLoading: false,
                    token: action.payload.data.Token,
                    listUser: action.payload.data.user.dataUser,
                    alertMsg: 'Login Succesfully'
                };
            }
            case 'AUTH_USER_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isLogin: false,
                    isError: true,
                    alertMsg: 'Login Failed'
                };
            }
            case 'CH_PLANT_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Login in ....'
                };
            }
            case 'CH_PLANT_FULFILLED': {
                localStorage.setItem('chplant', action.payload.data.result.kode_plant)
                return {
                    ...state,
                    isLoading: false,
                    alertMsg: 'Login Succesfully'
                };
            }
            case 'CH_PLANT_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    alertMsg: 'Login Failed'
                };
            }
            case 'GET_LOGIN_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Login in ....'
                };
            }
            case 'GET_LOGIN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    listUser: action.payload.data.result,
                    alertMsg: 'Login Succesfully'
                };
            }
            case 'GET_LOGIN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    alertMsg: 'Login Failed'
                };
            }
            case 'GET_TOKEN_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Login in ....'
                };
            }
            case 'GET_TOKEN_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    dataToken: action.payload.data.result,
                    alertMsg: 'Login Succesfully'
                };
            }
            case 'GET_TOKEN_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    alertMsg: 'Login Failed'
                };
            }
            case 'SET_TOKEN': {
                return {
                  ...state,
                  token: action.payload.token,
                  isLogin: true,
                }
            }
            case 'LOGOUT': {
                localStorage.removeItem('token')
                localStorage.removeItem('level')
                localStorage.removeItem('chplant')
                localStorage.removeItem('dataUser')
                return {
                    state: undefined
                }
            }
            case 'RESET': {
                return {
                    ...state,
                    isLogin: false,
                    isRoute: false
                }
            }
            case 'ROUTE' : {
                return {
                    ...state,
                    isRoute: true
                }
            }
            default: {
                return state;
            }
        }
    }