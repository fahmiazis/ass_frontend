/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react'
import Sidebar from '../components/Sidebar'
import auth from '../redux/actions/auth'
import { Input, Button, Modal, ModalHeader, ModalBody, Alert, 
    UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Dropdown } from 'reactstrap'
import {connect} from 'react-redux'
import addPicture from '../assets/img/add.png'
import disposPicture from '../assets/img/disposal.png'
import mutasiPicture from '../assets/img/mutasi1.png'
import repPicture from '../assets/img/report.png'
import stockPicture from '../assets/img/stock.svg'
import {Formik} from 'formik'
import user from '../redux/actions/user'
import notif from '../redux/actions/notif'
import * as Yup from 'yup'
import {VscAccount} from 'react-icons/vsc'
import '../assets/css/style.css'
import style from '../assets/css/input.module.css'
import moment from 'moment'
import {BsFillCircleFill, BsBell} from 'react-icons/bs'
import { FaFileSignature } from 'react-icons/fa'
import { FiLogOut } from 'react-icons/fi'

const userEditSchema = Yup.object().shape({
    fullname: Yup.string().required('must be filled'),
    email: Yup.string().email().required('must be filled')
});

const changeSchema = Yup.object().shape({
    current_password: Yup.string().required('must be filled'),
    confirm_password: Yup.string().required('must be filled'),
    new_password: Yup.string().required('must be filled')
});

class Home extends Component {

    state = {
        modalEdit: false,
        relog: false,
        alert: false,
        setting: false,
        modalChange: false
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

    settingUser = () => {
        this.setState({setting: !this.state.setting})
    }

    relogin = () => {
        this.props.logout()
        this.props.history.push('/login')
    }

    goPengadaan = () => {
        this.props.history.push('/navtick')
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
    
    editPass = async (val) => {
        const token = localStorage.getItem("token")
        const data = {
            new: val.new_password,
            current: val.current_password
        }
        await this.props.changePassword(token, data)
     }

    getNotif = async () => {
        const token = localStorage.getItem("token")
        await this.props.getNotif(token)
    }

    componentDidUpdate() {
        const {isUpdate, isError, isChange} = this.props.user
        if (isUpdate) {
            this.openModalEdit()
            this.setState({relog: true})
            this.props.reset()
        } else if (isError) {
            this.showAlert()
            this.props.reset()
        } else if (isChange) {
            this.openModalChange()
            this.setState({relog: true})
            this.props.reset()
        }
    }

    componentDidMount() {
        const email = localStorage.getItem('email')
        const fullname = localStorage.getItem('fullname')
        const id = localStorage.getItem('id')
        const level = localStorage.getItem('level')
        this.getNotif()
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

    openModalChange = () => {
        this.setState({modalChange: !this.state.modalChange})
    }

    logout = () => {
        this.props.logout()
        this.props.history.push('/login')
    }

    render() {
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const email = localStorage.getItem('email')
        const fullname = localStorage.getItem('fullname')
        const id = localStorage.getItem('id')
        const { alertM, alertMsg } = this.props.user
        const dataNotif = this.props.notif.data
        return (
            <>
            <div className="bodyHome">
                <div className="leftHome">
                    <Sidebar />
                </div>
                <div className="rightHome">
                    <div className="bodyAkun">
                        <div></div>
                        <div className="akun">
                            <UncontrolledDropdown>
                                <DropdownToggle nav>
                                    <div className={style.optionType}>
                                        <BsBell size={30} className="black" />
                                        {dataNotif.length > 0 ? (
                                            <BsFillCircleFill className="red ball" size={10} />
                                        ) : (
                                            <div></div>
                                        ) }
                                    </div>
                                </DropdownToggle>
                                <DropdownMenu right
                                modifiers={{
                                    setMaxHeight: {
                                        enabled: true,
                                        order: 890,
                                        fn: (data) => {
                                        return {
                                            ...data,
                                            styles: {
                                            ...data.styles,
                                            overflow: 'auto',
                                            maxHeight: '600px',
                                            },
                                        };
                                        },
                                    },
                                }}>
                                    {dataNotif.length > 0 ? (
                                        dataNotif.map(item => {
                                            return (
                                                <DropdownItem onClick={() => this.goRoute(item.keterangan === 'tax' || item.keterangan === 'finance' ? 'taxfin' : item.keterangan === 'eksekusi' && item.jenis === 'disposal' ? 'eksdis' : item.jenis === 'disposal' ? 'navdis' : item.jenis === 'mutasi' && 'navmut')}>
                                                    <div className={style.notif}>
                                                        <FaFileSignature size={90} className="mr-4"/>
                                                        <div>
                                                            <div>Request</div>
                                                            <div className="textNotif">{item.keterangan} {item.jenis}</div>
                                                            <div className="textNotif">No {item.jenis}: {item.no_proses}</div>
                                                            <div>{moment(item.createdAt).format('LLL')}</div>
                                                        </div>
                                                    </div>
                                                    <hr/>
                                                </DropdownItem>
                                            )
                                        })
                                    ) : (
                                        <DropdownItem>
                                            <div className={style.grey}>
                                                You don't have any notifications 
                                            </div>        
                                        </DropdownItem>
                                    )}
                                </DropdownMenu>
                            </UncontrolledDropdown>
                            <UncontrolledDropdown>
                                <DropdownToggle nav>
                                    <VscAccount size={30} className="mr-2 black" />
                                    <text className="black">{level === '1' ? 'Super Admin' : names}</text>
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem onClick={this.openModalChange}>
                                        Change Password
                                    </DropdownItem>
                                    <DropdownItem onClick={() => this.logout()}>
                                        <FiLogOut size={15} />
                                        <text className="txtMenu2">Logout</text>
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
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
                            <button className="cardHome1" onClick={() => this.goRoute('navmut')}>
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
            <Modal isOpen={this.state.modalChange} toggle={this.openModalChange}>
                <ModalHeader>Change Password</ModalHeader>
                <Formik
                initialValues={{
                current_password: '',
                confirm_password: '',
                new_password: ''
                }}
                validationSchema={changeSchema}
                onSubmit={(values) => {this.editPass(values)}}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                <ModalBody>
                    {/* <Alert color="danger" className={style.alertWrong} isOpen={this.state.alert}>
                        <div>{alertMsg}</div>
                        <div>{alertM}</div>
                    </Alert> */}
                    <div className={style.addModalDepo}>
                        <text className="col-md-4">
                            Current password
                        </text>
                        <div className="col-md-8">
                            <Input 
                            type='password' 
                            name="current_password"
                            value={values.current_password}
                            onBlur={handleBlur("current_password")}
                            onChange={handleChange("current_password")}
                            />
                            {errors.current_password ? (
                                <text className={style.txtError}>{errors.current_password}</text>
                            ) : null}
                        </div>
                    </div>
                    <div className={style.addModalDepo}>
                        <text className="col-md-4">
                            New password
                        </text>
                        <div className="col-md-8">
                            <Input 
                            type='password' 
                            name="new_password"
                            value={values.new_password}
                            onBlur={handleBlur("new_password")}
                            onChange={handleChange("new_password")}
                            />
                            {errors.new_password ? (
                                <text className={style.txtError}>{errors.new_password}</text>
                            ) : null}
                        </div>
                    </div>
                    <div className={style.addModalDepo}>
                        <text className="col-md-4">
                            Confirm password
                        </text>
                        <div className="col-md-8">
                            <Input 
                            type='password' 
                            name="confirm_password"
                            value={values.confirm_password}
                            onBlur={handleBlur("confirm_password")}
                            onChange={handleChange("confirm_password")}
                            />
                            {values.confirm_password !== values.new_password ? (
                                <text className={style.txtError}>Password do not match</text>
                            ) : null}
                        </div>
                    </div>
                    <hr/>
                    <div className={style.foot}>
                        <div></div>
                        <div>
                            <Button className="mr-2" onClick={handleSubmit} color="primary">Save</Button>
                            <Button className="mr-3" onClick={this.openModalChange} color="danger">Close</Button>
                        </div>
                    </div>
                </ModalBody>
                    )}
                </Formik>
            </Modal>
            <Modal>
                <ModalBody>
                    
                </ModalBody>
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
    user: state.user,
    notif: state.notif
})

const mapDispatchToProps = {
    updateUser: user.updateUser,
    reset: user.resetError,
    logout: auth.logout,
    changePassword: user.changePassword,
    getNotif: notif.getNotif
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
