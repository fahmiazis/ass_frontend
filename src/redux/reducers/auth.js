/* eslint-disable import/no-anonymous-default-export */
const authState = {
    isLogin: false,
    isRegister: false,
    token: '',
    isLoading: false,
    isError: false,
    alertMsg: '',
    level: 0,
    isRoute: false
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
                return {
                    ...state,
                    level: action.payload.data.user.user_level,
                    isLogin: true,
                    isError: false,
                    isLoading: false,
                    token: action.payload.data.Token,
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
                return authState
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