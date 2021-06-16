import React, { Component } from 'react'
import img from '../assets/img/image.png'
import logo from '../assets/img/logo.png'
import {Formik} from 'formik'
import * as Yup from 'yup'
import {Form, Button, Alert} from 'react-bootstrap'
import {connect} from "react-redux"
import auth from '../redux/actions/auth'

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

    render() {
        const {isError} = this.props.auth
        return (
            <div className="body-Login">
                <div className="leftSide">
                    <img src={img} className="img-back" />
                    <div className="sideInfo">
                        <div className="bigTitle">PT. Pinus Merah Abadi</div>
                        <div className="mt-3">
                            <div className="textBjk">Being a good quality of food and beverage company through out</div>
                            <div className="textBjk">a wide and established distribution network</div>
                            <div className="textBjk">and get respect from customers.</div>
                        </div>
                    </div>
                </div>
                    <Formik
                    initialValues={{ username: '', password: ''}}
                    validationSchema={loginSchema}
                    onSubmit={(values, { resetForm }) => {this.login(values); resetForm({ values: '' })}}>
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                        <div className="rightSide">
                        <img src={logo} className="logoLogin" />
                        <text className="titleLogin">Welcome Back</text>
                        <Form className="formLogin">
                            { isError ? (
                                <Alert variant="danger" className="alertWrong">
                                    username or password invalid !
                                </Alert>
                            ): (
                                <div></div>
                            )}
                            <Form.Group className="mb-4">
                                <Form.Label className="labelLogin">Username</Form.Label>
                                <Form.Control 
                                size="lg" 
                                type="name" 
                                placeholder="Username" 
                                onChange={handleChange("username")}
                                onBlur={handleBlur("username")}
                                value={values.username}
                                />
                                {errors.username ? (
                                    <text className="txtError">{errors.username}</text>
                                ) : null}
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className="labelLogin">Password</Form.Label>
                                <Form.Control 
                                size="lg" 
                                type="password" 
                                placeholder="Password" 
                                onChange={handleChange("password")}
                                onBlur={handleBlur("password")}
                                value={values.password}
                                />
                                {errors.password ? (
                                    <text className="txtError">{errors.password}</text>
                                ) : null}
                            </Form.Group>
                        </Form>
                        <div className="txtInfo"><text className="textForgot">Forgot your password?</text> <text className="textPic">Contact your pic</text></div>
                        <Button variant="danger" size="lg" className="btnLogin" onClick={handleSubmit}>Login</Button>
                        <div className="footLogin"><text>Don't have an account?</text> <text className="textForgot">Contact your pic</text></div>
                        </div>
                    )}
                    </Formik>
            </div>
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
