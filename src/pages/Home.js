/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react'
import Sidebar from '../components/Sidebar'
import auth from '../redux/actions/auth'
import { Input, Button, Modal, ModalHeader, ModalBody, Alert } from 'reactstrap'
import {connect} from 'react-redux'
import addPicture from '../assets/img/add.png'
import disposPicture from '../assets/img/disposal.png'
import mutasiPicture from '../assets/img/mutasi1.png'
import repPicture from '../assets/img/report.png'
import stockPicture from '../assets/img/stock.svg'
import {Formik} from 'formik'
import user from '../redux/actions/user'
import * as Yup from 'yup'
import {VscAccount} from 'react-icons/vsc'
import '../assets/css/style.css'
import style from '../assets/css/input.module.css'

const userEditSchema = Yup.object().shape({
    fullname: Yup.string().required('must be filled'),
    email: Yup.string().email().required('must be filled')
});

class Home extends Component {

    state = {
        modalEdit: false,
        relog: false,
        alert: false
    }

    openModalEdit = () => {
        this.setState({modalEdit: !this.state.modalEdit})
    }

    showAlert = () => {
        this.setState({alert: true})
       
         setTimeout(() => {
            this.setState({
                alert: false
            })
         }, 10000)
    }

    relogin = () => {
        this.props.logout()
        this.props.history.push('/login')
    }

    goPengadaan = () => {
        this.props.history.push('/pengadaan')
    }

    goRoute = (route) => {
        this.props.history.push(`/${route}`)
    }

    editUser = async (values,id) => {
        const token = localStorage.getItem("token")
        const names = localStorage.getItem('name')
        const data = {
            username: names,
            fullname: values.fullname,
            email: values.email
        }
        await this.props.updateUser(token, id, data)
    }

    componentDidUpdate() {
        const {isUpdate, isError} = this.props.user
        if (isUpdate) {
            this.openModalEdit()
            this.setState({relog: true})
            this.props.reset()
        } else if (isError) {
            this.showAlert()
            this.props.reset()
        }
    }

    componentDidMount() {
        const email = localStorage.getItem('email')
        const fullname = localStorage.getItem('fullname')
        const id = localStorage.getItem('id')
        const level = localStorage.getItem('level')
        if (email === 'null' || email === '' || fullname === 'null' || fullname === '') {
            if (id !== null && level !== '5') {
                this.openModalEdit()
            } else if (level === '5') {
                console.log('5')
            } else {
                this.relogin()
            }
        } else if (id === null) {
            this.relogin()
        }
    }

    render() {
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const email = localStorage.getItem('email')
        const fullname = localStorage.getItem('fullname')
        const id = localStorage.getItem('id')
        const { alertM, alertMsg } = this.props.user
        return (
            <>
            <div className="bodyHome">
                <div className="leftHome">
                    <Sidebar />
                </div>
                <div className="rightHome">
                    {/* 
                    
                    <img src={repPicture} />
                    <img src={stockPicture} /> */}
                    <div className="bodyAkun">
                        <div></div>
                        <div className="akun">
                            <VscAccount size={30} className="mr-2" />
                            <text>{level === '1' ? 'Super Admin' : names}</text>
                        </div>
                    </div>
                    <div>
                        <div className="titHome">Welcome to web asset</div>
                        <div className="txtChoose">Please select an option</div>
                        <div className="mainBody">
                            <button className="cardHome1" onClick={this.goPengadaan}>
                                <img src={addPicture} className="picHome" />
                                <div className="titCard">
                                    Pengadaan Asset
                                </div>
                            </button>
                            <button className="cardHome1" onClick={() => this.goRoute('navdis')}>
                                <img src={disposPicture} className="picHome" />
                                <div className="titCard">
                                    Disposal Asset
                                </div>
                            </button>
                            <button className="cardHome1" onClick={() => this.goRoute('navstock')}>
                                <img src={stockPicture} className="picHome1" />
                                <div className="titCard">
                                    Stock Opname Asset
                                </div>
                            </button>
                            <button className="cardHome1" onClick={() => this.goRoute('mutasi')}>
                                <img src={mutasiPicture} className="picHome" />
                                <div className="titCard mt-4">
                                    Mutasi
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Modal isOpen={this.state.modalEdit}>
                <ModalHeader>Lengkapi nama lengkap dan email terlebih dahulu</ModalHeader>
                <Formik
                initialValues={{
                fullname: fullname === 'null' ? null : fullname,
                email: email === 'null' ? null : email
                }}
                validationSchema={userEditSchema}
                onSubmit={(values) => {this.editUser(values, id)}}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                <ModalBody>
                    <Alert color="danger" className={style.alertWrong} isOpen={this.state.alert}>
                        <div>{alertMsg}</div>
                        <div>{alertM}</div>
                    </Alert>
                    <div className={style.addModalDepo}>
                        <text className="col-md-3">
                            Fullname
                        </text>
                        <div className="col-md-9">
                            <Input 
                            type="name" 
                            name="fullname"
                            value={values.fullname}
                            onBlur={handleBlur("fullname")}
                            onChange={handleChange("fullname")}
                            />
                            {errors.fullname ? (
                                <text className={style.txtError}>{errors.fullname}</text>
                            ) : null}
                        </div>
                    </div>
                    <div className={style.addModalDepo}>
                        <text className="col-md-3">
                            Email
                        </text>
                        <div className="col-md-9">
                            <Input 
                            type="name" 
                            name="email"
                            value={values.email}
                            onBlur={handleBlur("email")}
                            onChange={handleChange("email")}
                            />
                            {errors.email ? (
                                <text className={style.txtError}>{errors.email}</text>
                            ) : null}
                        </div>
                    </div>
                    <hr/>
                    <div className={style.foot}>
                        <div></div>
                        <div>
                            <Button className="mr-2" onClick={handleSubmit} color="primary">Save</Button>
                            <Button className="mr-3" onClick={this.relogin} color="danger">Logout</Button>
                        </div>
                    </div>
                </ModalBody>
                    )}
                </Formik>
            </Modal>
            <Modal isOpen={this.state.relog}>
            <ModalBody>
                    <div className={style.modalApprove}>
                        <div className="relogin">
                            System membutuhkan anda untuk login ulang
                        </div>
                        <div className={style.btnApprove}>
                            <Button color="primary" onClick={this.relogin}>Relogin</Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    user: state.user
})

const mapDispatchToProps = {
    updateUser: user.updateUser,
    reset: user.resetError,
    logout: auth.logout
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
