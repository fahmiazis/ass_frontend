import React, { Component } from 'react'
import {Formik} from 'formik'
import * as Yup from 'yup'
import auth from '../redux/actions/auth'
import {connect} from 'react-redux'
import { Input, Container, Form, Alert, Modal, ModalBody, Spinner } from 'reactstrap'
import logo from '../assets/img/logo.png'
import style from '../assets/css/input.module.css'
import { AiOutlineCopyrightCircle } from "react-icons/ai"

const loginSchema = Yup.object().shape({
    username: Yup.string().required('must be filled'),
    password: Yup.string().required('must be filled'),
  });

class Login extends Component {

    login = async (values) => {
        await this.props.login(values)
        const {isLogin} = this.props.auth
        if (isLogin) {
            this.props.history.push('/')
        }
    }

    componentDidUpdate() {
        const {isLogin} = this.props.auth
        if (isLogin) {
            this.props.history.push('/')
            this.props.resetError()
        }
    }

    // componentDidMount(){
    //     if (localStorage.getItem('token')) {
    //         this.props.setToken(localStorage.getItem('token'))
    //         this.props.history.push('/')  
    //     }
    // }

    render() {
        const {isError} = this.props.auth
        return (
            <>
            <Formik
                initialValues={{ username: '', password: ''}}
                validationSchema={loginSchema}
                onSubmit={(values, { resetForm }) => {this.login(values); resetForm({ values: '' })}}>
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                <Form className={style.bodyLogin}>
                    { isError ? (
                        <Alert color="danger" className={style.alertWrong}>
                            username or password invalid !
                        </Alert>
                    ): (
                        <div></div>
                    )}
                    <div className={style.imgLogin}>
                        <img src={logo} alt='logo' className={style.imgBig} />
                    </div>
                        <div className={style.form}>
                            <div className={style.textLogin}>Please login with your account</div>
                            <div>
                            <input 
                            className={style.input1}
                            placeholder='User Name'
                            type='name' 
                            onChange= {handleChange('username')}
                            onBlur= {handleBlur('username')}
                            value={values.username}
                            />
                            </div>
                            {errors.username ? (
                                <text className={style.txtError}>{errors.username}</text>
                            ) : null}
                            <div>
                            <input
                            className={style.input2}
                            placeholder='Password'
                            type='password'
                            onChange= {handleChange('password')}
                            onBlur= {handleBlur('password')}
                            value={values.password}
                            />
                            </div>
                            {errors.password ? (
                                <text className={style.txtError}>{errors.password}</text>
                            ) : null}
                            <button onClick={handleSubmit} className={style.button}>LOGIN</button>
                        </div>
                        {/* <div className='icon mt-4'><AiOutlineCopyrightCircle size={18} className="mr-3" />IT-PMA 2019</div> */}
                </Form>
                )}
                </Formik>
                <Modal isOpen={this.props.auth.isLoading ? true: false} size="sm">
                    <ModalBody>
                        <div>
                            <div className={style.cekUpdate}>
                                <Spinner />
                                <div sucUpdate>Waiting....</div>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth
})

const mapDispatchToProps = {
    login: auth.login,
    setToken: auth.setToken,
    resetError: auth.resetError
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)