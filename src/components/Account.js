import React, { Component } from 'react'
import { Input, Button, UncontrolledDropdown, DropdownToggle,
    DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody } from 'reactstrap'
import {FaBars, FaFileSignature, FaUserCircle} from 'react-icons/fa'
import { FiLogOut, FiUser } from 'react-icons/fi'
import auth from '../redux/actions/auth'
import user from '../redux/actions/user'
import {connect} from 'react-redux'
import {Formik} from 'formik'
import * as Yup from 'yup'
import newnotif from '../redux/actions/newnotif'
import {VscAccount} from 'react-icons/vsc'
import style from '../assets/css/input.module.css'
import styleHome from '../assets/css/Home.module.css'
import pengadaanIm from '../assets/img/io.png'
import disposalIm from '../assets/img/dis.png'
import mutasiIm from '../assets/img/mutasis.png'
import opnameIm from '../assets/img/opname.png'

const changeSchema = Yup.object().shape({
    current_password: Yup.string().required('must be filled'),
    confirm_password: Yup.string().required('must be filled'),
    new_password: Yup.string().required('must be filled')
});

class Account extends Component {

    state = {
        modalEdit: false,
        relog: false,
        alert: false,
        setting: false,
        modalConfirm: false,
        modalChange: false
    }

    editUser = async (val) => {
        const token = localStorage.getItem("token")
        const data = {
            new: val.new_password,
            current: val.current_password
        }
        await this.props.changePassword(token, data)
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
        const { listUser } = this.props.auth
        const cekUser = parseInt(localStorage.getItem('dataUser'))
        const getPlant = localStorage.getItem('chplant')
        const level = localStorage.getItem('level')
        const cekPlant = getPlant === undefined || getPlant === null || getPlant === ''
        console.log(cekUser)
        console.log(listUser)
        if (cekUser > 1 && cekPlant) {
            this.prosesOpenChange()
        }
    }

  render() {
    const level = localStorage.getItem('level')
    const names = localStorage.getItem('fullname')
    const { listUser } = this.props.auth
    const cekUser = parseInt(localStorage.getItem('dataUser'))
    const getPlant = localStorage.getItem('chplant')
    const cekPlant = getPlant === undefined || getPlant === null || getPlant === ''
    const color = this.props.color
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
    getAllNewNotif: newnotif.getAllNewNotif,
    changePassword: user.changePassword,
    goRoute: auth.goRoute,
    choosePlant: auth.choosePlant,
    getLogin: auth.getLogin,
    getToken: auth.getToken
}

export default connect(mapStateToProps, mapDispatchToProps)(Account)