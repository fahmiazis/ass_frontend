import React, { Component } from 'react'
import { Input, Button, UncontrolledDropdown, DropdownToggle, Spinner,
    DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody } from 'reactstrap'
import {FaBars, FaFileSignature, FaUserCircle} from 'react-icons/fa'
import { FiLogOut, FiUser } from 'react-icons/fi'
import auth from '../redux/actions/auth'
import user from '../redux/actions/user'
import depo from '../redux/actions/depo'
import {connect} from 'react-redux'
import {Formik} from 'formik'
import * as Yup from 'yup'
import newnotif from '../redux/actions/newnotif'
import tempmail from '../redux/actions/tempmail'
import {VscAccount} from 'react-icons/vsc'
import style from '../assets/css/input.module.css'
import styleHome from '../assets/css/Home.module.css'
import pengadaanIm from '../assets/img/io.png'
import disposalIm from '../assets/img/dis.png'
import mutasiIm from '../assets/img/mutasis.png'
import opnameIm from '../assets/img/opname.png'
import Email from './User/Email'

const changeSchema = Yup.object().shape({
    current_password: Yup.string().required('must be filled'),
    confirm_password: Yup.string().required('must be filled'),
    new_password: Yup.string().required('must be filled')
});

const userSchema = Yup.object().shape({
    username: Yup.string().required(),
    fullname: Yup.string().required(),
    email: Yup.string().email().required(),
    request_kode: Yup.string(),
    request_level: Yup.string().required(),
    nik: Yup.number().required(),
    status_it: Yup.string()
});

class Account extends Component {

    state = {
        modalEdit: false,
        relog: false,
        alert: false,
        setting: false,
        modalConfirm: false,
        modalChange: false,
        stateUser: {},
        request: false,
        info: false,
        openDraft: false,
        dataUpdate: {},
        message: '',
        subject: ''
    }

    editUser = async (val) => {
        const token = localStorage.getItem("token")
        const data = {
            new: val.new_password,
            current: val.current_password
        }
        await this.props.changePassword(token, data)
     }

     getMessage = (val) => {
        this.setState({ message: val.message, subject: val.subject })
        console.log(val)
    }

     openModalEdit = () => {
        this.setState({modalEdit: !this.state.modalEdit})
    }

    openConfirm = () => {
        this.setState({modalConfirm: !this.state.modalConfirm})
    }

    logout = () => {
        this.props.logout()
    }

    componentDidMount() {
        this.getData()
    }

    prosesOpenChange = async (val) => {
        const token = localStorage.getItem("token")
        const id = localStorage.getItem("id")
        await this.props.getLogin(token, id)
        this.openChange()
    }

    openChange = () => {
        this.setState({modalChange: !this.state.modalChange})
    }

    goPage = (val) => {
        this.props.handleRoute(val)
    }

    changeUser = async (val) => {
        const token = localStorage.getItem("token")
        await this.props.getToken(token, val.id)
        const {dataToken} = this.props.auth
        console.log(dataToken)
        console.log(val)
        const chPlant = (val.kode_plant === undefined || val.kode_plant === null || val.kode_plant === '') ? val.username : val.kode_plant
        await this.props.getAllNewNotif(dataToken.Token)
        localStorage.setItem('token', dataToken.Token)
        localStorage.setItem('chplant', chPlant)
        localStorage.setItem('kode', val.kode_plant)
        localStorage.setItem('id', val.id)
        localStorage.setItem('name', val.username)
        localStorage.setItem('fullname', val.fullname)
        localStorage.setItem('it', val.status_it)
        localStorage.setItem('level', val.user_level)
        localStorage.setItem('role', val.role.name)
        this.goPage('')
        this.setState({modalChange: false})
    }

    getData = async () => {
        const token = localStorage.getItem("token")
        await this.props.getAllNewNotif(token)
        this.cekUser()
    }

    cekUser = async () => {
        const token = localStorage.getItem("token")
        const { listUser } = this.props.auth
        const cekUser = parseInt(localStorage.getItem('dataUser'))
        const idUser = parseInt(localStorage.getItem('id'))
        const getPlant = localStorage.getItem('chplant')
        const level = localStorage.getItem('level')
        const cekPlant = getPlant === undefined || getPlant === null || getPlant === ''
        await this.props.getDetailUser(token, parseInt(idUser))
        console.log(cekUser)
        console.log(listUser)
        const { detailUser } = this.props.user
        if (level === '50' && detailUser.status_request === 2) {
            this.prosesRelog()
        } else if (level === '50' && detailUser.status_request === 1) {
            this.prosesOpenInfo()
        } else if (level === '50') {
            await this.props.getDepo(token, 1000, '')
            await this.props.getRole(token, '')
            this.prosesOpenRequest()
        } else if (cekUser > 1 && cekPlant) {
            this.prosesOpenChange()
        }
    }

    prosesRelog = () => {
        this.setState({relog: true})
    }

    prosesOpenRequest = async () => {
        const { listUser } = this.props.auth
        const { detailUser } = this.props.user
        this.setState({ stateUser: detailUser })
        this.openRequest()
    }

    openRequest = async () => {
        this.setState({request: !this.state.request})
    }

    updateUser = async (values) => {
        const token = localStorage.getItem("token")
        // const destruct = values.depo === "" ? ["", ""] : values.depo.split('-')
        const { listRole } = this.state
        console.log(values)
        const data = {
            username: values.username,
            fullname: values.fullname,
            user_level: 50,
            request_level: values.request_level,
            request_kode: values.request_kode,
            status_request: 1,
            email: values.email,
            multi_role: '',
            status: 'active',
            kode_plant: (values.request_level == '5' || values.request_level == '9') ? values.depo : '',
            nik: values.nik,
            status_it: values.request_level == '9' ? values.status_it : ''
        }
        const { detailUser } = this.props.user
        await this.props.updateUser(token, detailUser.id, data)
        this.prosesOpenInfo()
        this.openRequest()
    }

    prosesOpenInfo = () => {
        this.setState({info: !this.state.info})
    }

    prepSendEmail = async (val) => {
        const token = localStorage.getItem("token")
        const { detailUser } = this.props.user
        this.setState({
            dataUpdate: {
                ...val,
                mpn_number: detailUser.mpn_number
            } 
        })
        const tipe = 'submit'

        const tempno = {
            no: detailUser.mpn_number,
            kode: 'P01H060002',
            jenis: 'user',
            tipe: tipe,
            menu: 'Pengajuan Data User (Verifikasi User)'
        }
        this.setState({ tipeEmail: 'submit' })
        await this.props.getDraftEmail(token, tempno)
        this.openDraftEmail()
    }

    openDraftEmail = () => {
        this.setState({ openDraft: !this.state.openDraft })
    }

    submitVerif = async () => {
        const { dataUpdate } = this.state
        await this.updateUser(dataUpdate)
        await this.prosesSendEmail('submit')
        this.openDraftEmail()
    }

    prosesSendEmail = async (val) => {
        const token = localStorage.getItem('token')
        const { draftEmail } = this.props.tempmail
        const { detailUser } = this.props.user
        const { message, subject } = this.state
        const cc = draftEmail.cc
        const tempcc = []
        for (let i = 0; i < cc.length; i++) {
            tempcc.push(cc[i].email)
        }
        const sendMail = {
            draft: draftEmail,
            nameTo: draftEmail.to.fullname,
            to: draftEmail.to.email,
            cc: tempcc.toString(),
            message: message,
            subject: subject,
            no: detailUser.mpn_number,
            tipe: 'user',
            menu: `Pengajuan Data User`,
            proses: val,
            route: 'user'
        }
        await this.props.sendEmail(token, sendMail)
        const sendNotif = {
            ...sendMail,
            nameTo: 'admin'
        }
        await this.props.addNewNotif(token, sendNotif)
    }

  render() {
    const level = localStorage.getItem('level')
    const names = localStorage.getItem('fullname')
    const { listUser } = this.props.auth
    const cekUser = parseInt(localStorage.getItem('dataUser'))
    const getPlant = localStorage.getItem('chplant')
    const cekPlant = getPlant === undefined || getPlant === null || getPlant === ''
    const color = this.props.color
    const { stateUser, tipeEmail, dataRej } = this.state
    const { dataDepo } = this.props.depo
    const { dataRole } = this.props.user
    return (
        <>
            <UncontrolledDropdown>
                <DropdownToggle nav>
                    <FaUserCircle size={25} className={color === undefined ? 'mr-2 white' : `mr-2 ${color}`} />
                    <text className={color === undefined ? 'white' : `${color}`}>
                        {/* {level === '1' ? 'Super Admin' : names !== null && names.slice(0, 15)} */}
                        {level === '1' ? 'Super Admin' 
                            : names === undefined ? '' 
                            : names.length <= 17 ? names.split(" ").map((word) => { 
                                return word[0] === undefined ? '' : word[0].toUpperCase() + word.substring(1)
                            }).join(" ")
                            : names.slice(0, 16).split(" ").map((word) => { 
                                return word[0] === undefined ? '' : word[0].toUpperCase() + word.substring(1)
                            }).join(" ") + '.'
                        }
                    </text>
                </DropdownToggle>
                <DropdownMenu right>
                    {/* {(level === '5' || level === '9') && listUser.length > 1 && ( */}
                    {cekUser > 1 && (
                        <DropdownItem onClick={this.prosesOpenChange}>
                            Change User
                        </DropdownItem>
                    )}
                    <DropdownItem onClick={this.openModalEdit}>
                        Change Password
                    </DropdownItem>
                    <DropdownItem onClick={() => this.logout()}>
                        <FiLogOut size={15} />
                        <text className="txtMenu2">Logout</text>
                    </DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>
            <Modal isOpen={this.state.modalEdit} toggle={this.openModalEdit}>
                <ModalHeader>Change Password</ModalHeader>
                <Formik
                initialValues={{
                current_password: '',
                confirm_password: '',
                new_password: ''
                }}
                validationSchema={changeSchema}
                onSubmit={(values) => {this.editUser(values)}}
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
                            <Button className="mr-3" onClick={this.openModalEdit} color="danger">Close</Button>
                        </div>
                    </div>
                </ModalBody>
                )}
            </Formik>
        </Modal>
        <Modal isOpen={this.state.request} size='lg'>
            <ModalHeader>{stateUser.status_request === 0 ? 'Kelengkapan data user anda telah ditolak, mohon lengkapi ulang data user' : 'Lengkapi Data User'}</ModalHeader>
            <Formik
                initialValues={{
                    username: stateUser.username,
                    fullname: stateUser.fullname,
                    email: stateUser.email,
                    request_kode: (stateUser.request_level == '5' || stateUser.request_level == '9') ? stateUser.kode_plant : '',
                    request_level: stateUser.request_level, 
                    nik: stateUser.nik,
                    status_it: stateUser.status_it
                }}
                validationSchema={userSchema}
                onSubmit={(values) => {this.prepSendEmail(values)}}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                <ModalBody>
                    {/* <Alert color="danger" className={style.alertWrong} isOpen={this.state.alert}>
                        <div>{alertMsg}</div>
                        <div>{alertM}</div>
                    </Alert> */}
                    <div className={style.addModalDepo}>
                        <text className="col-md-3">
                            User Name
                        </text>
                        <div className="col-md-9">
                            <Input 
                            type="name" 
                            name="username"
                            value={values.username}
                            onBlur={handleBlur("username")}
                            onChange={handleChange("username")}
                            />
                            {errors.username ? (
                                <text className={style.txtError}>{errors.username}</text>
                            ) : null}
                        </div>
                    </div>
                    <div className={style.addModalDepo}>
                        <text className="col-md-3">
                            Full Name
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
                            NIK
                        </text>
                        <div className="col-md-9">
                            <Input 
                            type="name" 
                            name="nik"
                            value={values.nik}
                            onBlur={handleBlur("nik")}
                            onChange={handleChange("nik")}
                            />
                            {errors.nik ? (
                                <text className={style.txtError}>{errors.nik}</text>
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
                    <div className={style.addModalDepo}>
                        <text className="col-md-3">
                            Role User
                        </text>
                        <div className="col-md-9">
                        <Input 
                            type="select" 
                            name="select"
                            value={values.request_level}
                            onChange={handleChange("request_level")}
                            onBlur={handleBlur("request_level")}
                            >
                                <option>-Pilih Role-</option>
                                {dataRole.length !== 0 && dataRole.map(item => {
                                    return (
                                        <option value={item.nomor}>{item.name}</option>
                                    )
                                })}
                            </Input>
                            {errors.request_level ? (
                                <text className={style.txtError}>{errors.request_level}</text>
                            ) : null}
                        </div>
                    </div>
                    {(values.request_level === '5' || values.request_level === 5) || (values.request_level === '9' || values.request_level === 9) ? (
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Area
                            </text>
                            <div className="col-md-9">
                            <Input 
                                type="select" 
                                name="select"
                                value={values.request_kode}
                                onChange={handleChange("request_kode")}
                                onBlur={handleBlur("request_kode")}
                                >
                                    <option>-Pilih Area-</option>
                                    {dataDepo.length !== 0 && dataDepo.map(item => {
                                        return (
                                            (values.request_level === '5' || values.request_level === 5) && item.kode_plant.length === 4 ? (
                                                <option value={item.kode_plant}>{item.kode_plant + '-' + item.nama_area}</option>
                                            ) : (values.request_level === '9' || values.request_level === 9) && item.kode_plant.length > 4 && (
                                                <option value={item.kode_plant}>{item.kode_plant + '-' + item.nama_area}</option>
                                            )
                                        )
                                    })}
                                </Input>
                                {errors.request_kode ? (
                                    <text className={style.txtError}>{errors.request_kode}</text>
                                ) : null}
                            </div>
                        </div>
                    ) : (
                        <div></div>
                    )}
                    {(values.request_level === '9' || values.request_level === 9) && (
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Status IT
                            </text>
                            <div className="col-md-9">
                            <Input 
                                type="select"
                                name="select"
                                value={values.status_it}
                                onChange={handleChange("status_it")}
                                onBlur={handleBlur("status_it")}
                                >   
                                    <option>-Pilih Status-</option>
                                    <option value="it">IT</option>
                                    <option value="non-it">NON IT</option>
                                </Input>
                                {errors.status_it ? (
                                    <text className={style.txtError}>{errors.status_it}</text>
                                ) : null}
                            </div>
                        </div>
                    )}
                    <hr/>
                    <div className={style.foot}>
                        <div></div>
                        <div>
                            <Button className="mr-2" onClick={handleSubmit} color="primary">Submit</Button>
                            <Button color="danger" onClick={this.logout}>Logout</Button>
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
                        <Button color="primary" onClick={this.logout}>Relogin</Button>
                    </div>
                </div>
            </ModalBody>
        </Modal>
        <Modal isOpen={this.state.info}>
            <ModalBody>
                <div className={style.modalApprove}>
                    <div className="relogin">
                        Kelengkapan data user anda sedang dalam proses verifikasi oleh tim asset
                    </div>
                    <div className='itemCenter mt-4'>
                        <Button color="primary" onClick={this.logout}>Logout</Button>
                    </div>
                </div>
            </ModalBody>
        </Modal>
        <Modal isOpen={this.state.modalChange} size='xl' toggle={!cekPlant && this.openChange}>
            <ModalBody>
            <div className={styleHome.mainContent}>
                    <main className={styleHome.mainSection}>
                    <h1 className={styleHome.title}>Please select your user</h1>
                    <h4 className={styleHome.subtitle}></h4>

                    <div className={`${styleHome.assetContainer} row`}>
                        {listUser.length > 0 && listUser.map(item => {
                            return (
                                <div 
                                onClick={() => this.changeUser(item)} 
                                className="col-12 col-md-6 col-lg-3 mb-4">
                                    <div className={styleHome.assetCard1}>
                                        <FiUser size={150} className='mt-4 mb-4' />
                                        <p className='mt-2 mb-4 sizeCh'>{item.username}{(level === '5' || level === '9') ? `-${item.kode_plant}` : ''}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    </main>
                </div>
            </ModalBody>
        </Modal>
        <Modal isOpen={this.state.openDraft} size='xl'>
            <ModalHeader>Email Pemberitahuan</ModalHeader>
            <ModalBody>
                <Email handleData={this.getMessage} detailData={this.state.dataUpdate} />
                <div className={style.foot}>
                    <div></div>
                    <div>
                        <Button
                            disabled={this.state.message === '' ? true : false}
                            className="mr-2"
                            onClick={() => this.submitVerif()}
                            color="primary"
                        >
                            Submit & Send Email
                        </Button>
                        <Button className="mr-3" onClick={this.openDraftEmail}>Cancel</Button>
                    </div>
                </div>
            </ModalBody>
        </Modal>
        <Modal
            isOpen={
                this.props.user.isLoading
                || this.props.newnotif.isLoading
                || this.props.tempmail.isLoading
            } size="sm"
        >
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
    auth: state.auth,
    user: state.user,
    notif: state.notif,
    depo: state.depo,
    tempmail: state.tempmail,
    newnotif: state.newnotif,
})

const mapDispatchToProps = {
    updateUser: user.updateUser,
    getDetailUser: user.getDetailUser,
    reset: user.resetError,
    logout: auth.logout,
    getAllNewNotif: newnotif.getAllNewNotif,
    changePassword: user.changePassword,
    goRoute: auth.goRoute,
    choosePlant: auth.choosePlant,
    getLogin: auth.getLogin,
    getToken: auth.getToken,
    getDepo: depo.getDepo,
    getRole: user.getRole,
    addNewNotif: newnotif.addNewNotif,
    getDraftEmail: tempmail.getDraftEmail,
    sendEmail: tempmail.sendEmail,
}

export default connect(mapStateToProps, mapDispatchToProps)(Account)