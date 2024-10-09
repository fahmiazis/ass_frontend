import React, { Component } from 'react'
import {Formik} from 'formik'
import * as Yup from 'yup'
import auth from '../redux/actions/auth'
import {connect} from 'react-redux'
import { Input, Container, Form, Alert, Modal, ModalBody, Spinner, 
    Button, FormGroup, Label, Row, Col, Card, CardBody, CardTitle } from 'reactstrap'
import logo from '../assets/img/logo.png'
import style from '../assets/css/input.module.css'
import { AiOutlineCopyrightCircle } from "react-icons/ai"
import officeImage from '../assets/img/loginOffice.webp'

const loginSchema = Yup.object().shape({
    username: Yup.string().required('must be filled'),
    password: Yup.string().required('must be filled')
});

class Login extends Component {

    login = async (values) => {
        await this.props.login(values)
        const {isLogin} = this.props.auth
        if (isLogin) {
            this.props.history.push('/')
        }
    }

    state = {
        cost_center: ''
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
                initialValues={{ username: '', password: '', cost_center: ''}}
                validationSchema={loginSchema}
                onSubmit={(values, { resetForm }) => {this.login(values); resetForm({ values: '' })}}>
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                <Container fluid className="d-flex align-items-center justify-content-center min-vh-100" style={{ backgroundImage: `url(${officeImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    <Row className="w-100">
                    <Col sm="12" md="8" lg="4" className="mx-auto"> {/* Menggunakan 'lg-4' agar tidak terlalu lebar di desktop */}
                        <Card className="shadow-lg" style={{ opacity: 0.95 }}>
                        <CardBody>
                            { isError ? (
                                <Alert color="danger" className={style.alertWrong}>
                                    username or password invalid !
                                </Alert>
                            ): (
                                <div></div>
                            )}
                            <CardTitle tag="h3" className="text-center text-danger mb-4">Login</CardTitle>
                            <Form>
                            <FormGroup>
                                <Label for="username">Username</Label>
                                <Input 
                                    type="text" 
                                    name="username" 
                                    id="username" 
                                    placeholder="Enter your username" 
                                    onChange= {handleChange('username')}
                                    onBlur= {handleBlur('username')}
                                    value={values.username}
                                />
                                {errors.username ? (
                                    <text className={style.txtError}>{errors.username}</text>
                                ) : null}
                            </FormGroup>
                            <FormGroup>
                                <Label for="password">Password</Label>
                                <Input 
                                    type="password" 
                                    name="password" 
                                    id="password" 
                                    placeholder="Enter your password" 
                                    onChange= {handleChange('password')}
                                    onBlur= {handleBlur('password')}
                                    value={values.password}
                                />
                                {errors.password ? (
                                    <text className={style.txtError}>{errors.password}</text>
                                ) : null}
                            </FormGroup>
                            <Button 
                            type='submit'
                            disabled={(values.username === 'p000' || values.username === 'P000') && 
                            values.cost_center === '' ? true : false} 
                            onClick={handleSubmit}
                            color="danger" 
                            block>Login</Button>
                            </Form>
                        </CardBody>
                        </Card>
                    </Col>
                    </Row>
                </Container>
                // <Form className={style.bodyLogin}>
                //     { isError ? (
                //         <Alert color="danger" className={style.alertWrong}>
                //             username or password invalid !
                //         </Alert>
                //     ): (
                //         <div></div>
                //     )}
                //     <div className={style.imgLogin}>
                //         <img src={logo} alt='logo' className={style.imgBig} />
                //     </div>
                //         <div className={style.form}>
                //             <div className={style.textLogin}>Please login with your account</div>
                //             <div>
                //                 <input 
                //                 className={style.input1}
                //                 placeholder='Username'
                //                 type='name' 
                //                 onChange= {handleChange('username')}
                //                 onBlur= {handleBlur('username')}
                //                 value={values.username}
                //                 />
                //             </div>
                //             {errors.username ? (
                //                 <text className={style.txtError}>{errors.username}</text>
                //             ) : null}
                //             {(values.username === 'P000' || values.username === 'p000') && (
                //                 <>
                //                     <div>
                //                         <input 
                //                         className={style.input2}
                //                         placeholder='Cost Center'
                //                         type='text' 
                //                         onChange= {handleChange('cost_center')}
                //                         onBlur= {handleBlur('cost_center')}
                //                         value={values.cost_center}
                //                         />
                //                     </div>
                //                     {values.cost_center === '' ? (
                //                         <text className={style.txtError}>must be filled</text>
                //                     ) : null}
                //                 </>
                //             )}
                //             <div>
                //                 <input
                //                 className={style.input2}
                //                 placeholder='Password'
                //                 type='password'
                //                 onChange= {handleChange('password')}
                //                 onBlur= {handleBlur('password')}
                //                 value={values.password}
                //                 />
                //             </div>
                //             {errors.password ? (
                //                 <text className={style.txtError}>{errors.password}</text>
                //             ) : null}
                //             <button 
                //               disabled={(values.username === 'p000' || values.username === 'P000') && values.cost_center === '' ? true : false} 
                //               onClick={handleSubmit} 
                //               className={style.button}
                //               >LOGIN
                //               </button>
                //         </div>
                //         {/* <div className='icon mt-4'><AiOutlineCopyrightCircle size={18} className="mr-3" />IT-PMA 2019</div> */}
                // </Form>
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