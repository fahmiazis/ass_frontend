/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react'
import Sidebar from '../../components/Sidebar'
import {VscAccount} from 'react-icons/vsc'
import { Row, DropdownItem, UncontrolledDropdown, DropdownToggle, DropdownMenu, Button,
    Modal, ModalHeader, ModalBody, Input } from 'reactstrap'
import {FiLogOut, FiSend, FiTruck} from 'react-icons/fi'
import {BiRevision} from 'react-icons/bi'
import {MdAssignment, MdVerifiedUser} from 'react-icons/md'
import {HiOutlineDocumentReport} from 'react-icons/hi'
import {RiDraftFill} from 'react-icons/ri'
import {FaFileSignature} from 'react-icons/fa'
import {BsBell, BsFillCircleFill} from 'react-icons/bs'
import moment from 'moment'
import {connect} from 'react-redux'
import auth from '../../redux/actions/auth'
import user from '../../redux/actions/user'
import notif from '../../redux/actions/notif'
import {Formik} from 'formik'
import * as Yup from 'yup'
import '../../assets/css/style.css'
import style from '../../assets/css/input.module.css'
import Bell from '../../components/Bell'
import Account from '../../components/Account'
import styleHome from '../../assets/css/Home.module.css'

const changeSchema = Yup.object().shape({
    current_password: Yup.string().required('must be filled'),
    confirm_password: Yup.string().required('must be filled'),
    new_password: Yup.string().required('must be filled')
})

class NavTicket extends Component {

    constructor(props) {
        super(props);
        this.state = {
          isOpen: false,
          searchQuery: '',
          filterStatus: 'Semua Status',
          sidebarOpen: true, // Untuk expand/collapse di mode web
          mobileSidebarVisible: false, // Untuk hidden/show di mode mobile
          isMobile: window.innerWidth <= 768, // Mendeteksi apakah di mode mobile
          dataNull: [],
          relog: false
        };
    }

    relogin = () => {
        this.props.logout()
        this.props.history.push('/login')
    }

    openModalChange = () => {
        this.setState({modalChange: !this.state.modalChange})
    }

    goRoute = (route) => {
        this.props.history.push(`/${route}`)
    }

    componentDidMount() {
        const email = localStorage.getItem('email')
        const fullname = localStorage.getItem('fullname')
        const id = localStorage.getItem('id')
        const level = localStorage.getItem('level')
        window.addEventListener("resize", this.handleResize);
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

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize)
    }

    handleResize = () => {
        this.setState({ isMobile: window.innerWidth <= 768 })
    };

    editPass = async (val) => {
        const token = localStorage.getItem("token")
        const data = {
            new: val.new_password,
            current: val.current_password
        }
        await this.props.changePassword(token, data)
     }

     logout = () => {
        this.props.logout()
        this.props.history.push('/login')
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

    getNotif = async () => {
        const token = localStorage.getItem("token")
        await this.props.getNotif(token)
        const { data } = this.props.notif
        const dataNull = []
        const dataRead = []
        for (let i = 0; i < data.length; i++) {
            if (data[i].status === null) {
                dataNull.push(data[i])
            } else {
                dataRead.push(data[i])
            }
        }
        this.setState({ dataNull: dataNull })
    }
    
    goNotif = async (val) => {
        const token = localStorage.getItem('token')
        if (val === 'notif') {
            localStorage.setItem('route', val)
            this.props.history.push(`/${val}`)
        } else {
            await this.props.upNotif(token, val.id)
            await this.props.getNotif(token)
            const ket = val.keterangan
            const jenis = (val.jenis === '' || val.jenis === null) && val.no_proses.split('')[0] === 'O' ? 'Stock Opname' : val.jenis
            const route = ket === 'tax' || ket === 'finance' || ket === 'tax and finance' ? 'taxfin' : ket === 'eksekusi' && jenis === 'disposal' ? 'eksdis' : jenis === 'disposal' && ket === 'pengajuan' ? 'disposal' : jenis === 'mutasi' && ket === 'pengajuan' ? 'mutasi' : jenis === 'Stock Opname' && ket === 'pengajuan' ? 'stock' : jenis === 'disposal' ? 'navdis' : jenis === 'mutasi' ? 'navmut' : jenis === 'Stock Opname' && 'navstock' 
            localStorage.setItem('route', route)
            this.props.history.push(`/${route}`)
        }
    }

    render() {
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const {dataNull} = this.state
        const dataNotif = this.props.notif.data
        return (
            <>
            <div className="bodyHome">
                <div className="leftHome">
                    <Sidebar isMobile={this.state.isMobile} />
                </div>
                <div className="rightHome">
                    <div className="bodyAkun">
                        <div></div>
                        <div className="akun">
                            <Bell dataNotif={dataNotif} color={"black"}/>
                            <Account color={"black"}/>
                        </div>
                    </div>
                    <div className={styleHome.mainContent}>
                        <main className={styleHome.mainSection}>
                        <h1 className={styleHome.title}>Menu Pengadaan Aset</h1>
                        <h4 className={styleHome.subtitle}>Please select an option</h4>
                            <div className={`${styleHome.assetContainer} row`}>
                            {level === '5' ? (
                                <>
                                    <div onClick={() => this.goRoute('pengadaan')} className="col-12 col-md-6 col-lg-3 mb-4">
                                        <div className={styleHome.navCard}>
                                            <FiSend size={150} className='mt-4 mb-4' />
                                            <p className='mt-4'>Pengajuan Pengadaan Asset</p>
                                        </div>
                                    </div>
                                    <div onClick={() => this.goRoute('revtick')} className="col-12 col-md-6 col-lg-3 mb-4">
                                        <div className={styleHome.navCard}>
                                            <BiRevision size={150} className='mt-4 mb-4' />
                                            <p className='mt-4'>Revisi Pengadaan Asset</p>
                                        </div>
                                    </div>
                                </>
                            ) : level === '2' ? (
                                <>
                                    <div onClick={() => this.goRoute('pengadaan')} className="col-12 col-md-6 col-lg-3 mb-4">
                                        <div className={styleHome.navCard}>
                                            <FiSend size={150} className='mt-4 mb-4' />
                                            <p className='mt-4'>Pengajuan Pengadaan Asset</p>
                                        </div>
                                    </div>
                                    <div onClick={() => this.goRoute('ekstick')} className="col-12 col-md-6 col-lg-3 mb-4">
                                        <div className={styleHome.navCard}>
                                            <FiTruck size={150} className='mt-4 mb-4' />
                                            <p className='mt-4'>Eksekusi pengadaan asset</p>
                                        </div>
                                    </div>
                                    <div onClick={() => this.goRoute('revtick')} className="col-12 col-md-6 col-lg-3 mb-4">
                                        <div className={styleHome.navCard}>
                                            <BiRevision size={150} className='mt-4 mb-4' />
                                            <p className='mt-4'>Revisi Pengadaan Asset</p>
                                        </div>
                                    </div>
                                    <div onClick={() => this.goRoute('navtick')} className="col-12 col-md-6 col-lg-3 mb-4">
                                        <div className={styleHome.navCard}>
                                            <HiOutlineDocumentReport size={150} className='mt-4 mb-4' />
                                            <p className='mt-4'>Report pengadaan asset</p>
                                        </div>
                                    </div>
                                </>
                            ) : level === '8' ? (
                                <>
                                    <div onClick={() => this.goRoute('pengadaan')} className="col-12 col-md-6 col-lg-3 mb-4">
                                        <div className={styleHome.navCard}>
                                            <FiSend size={150} className='mt-4 mb-4' />
                                            <p className='mt-4'>Pengajuan Pengadaan Asset</p>
                                        </div>
                                    </div>
                                    <div onClick={() => this.goRoute('revtick')} className="col-12 col-md-6 col-lg-3 mb-4">
                                        <div className={styleHome.navCard}>
                                            <BiRevision size={150} className='mt-4 mb-4' />
                                            <p className='mt-4'>Revisi Pengadaan Asset</p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div onClick={() => this.goRoute('pengadaan')} className="col-12 col-md-6 col-lg-3 mb-4">
                                        <div className={styleHome.navCard}>
                                            <FiSend size={150} className='mt-4 mb-4' />
                                            <p className='mt-4'>Pengajuan Pengadaan Asset</p>
                                        </div>
                                    </div>
                                </>
                            )}
                            </div>
                        </main>
                    </div>
                    {/* <div>
                        {level === '5' ? (
                            <div className="mainBody">
                                <button className="cardNav1" onClick={() => this.goRoute('pengadaan')}>
                                    <FiSend size={150} className="picHome" />
                                    <div className="titCard">
                                        Pengajuan Pengadaan Asset
                                    </div>
                                </button>
                                <button className="cardNav1" onClick={() => this.goRoute('revtick')}>
                                    <BiRevision size={150} className="picHome" />
                                    <div className="titCard">
                                        Revisi Pengadaan Asset
                                    </div>
                                </button>
                            </div>
                        ) : level === '2' ? (
                            <div className="mainBody">
                                <button className="cardNav1" onClick={() => this.goRoute('pengadaan')}>
                                    <FiSend size={150} className="picHome" />
                                    <div className="titCard">
                                        Pengajuan Pengadaan Asset
                                    </div>
                                </button>
                                <button className="cardNav1" onClick={() => this.goRoute('ekstick')}>
                                    <FiTruck size={150} className="picHome" />
                                    <div className="titCard">
                                        Eksekusi pengadaan asset
                                    </div>
                                </button>
                                <button className="cardNav1" onClick={() => this.goRoute('revtick')}>
                                    <BiRevision size={150} className="picHome" />
                                    <div className="titCard">
                                        Revisi Pengadaan Asset
                                    </div>
                                </button>
                                <button className="cardNav1">
                                    <HiOutlineDocumentReport size={150} className="picHome" />
                                    <div className="titCard">
                                        Report pengadaan asset
                                    </div>
                                </button>
                            </div>
                        ) : level === '8' ? (
                            <div className="mainBody">
                                <button className="cardNav1" onClick={() => this.goRoute('pengadaan')}>
                                    <FiSend size={150} className="picHome" />
                                    <div className="titCard">
                                        Pengajuan Pengadaan Asset
                                    </div>
                                </button>
                                <button className="cardNav1" onClick={() => this.goRoute('revtick')}>
                                    <BiRevision size={150} className="picHome" />
                                    <div className="titCard">
                                        Revisi Pengadaan Asset
                                    </div>
                                </button>
                            </div>
                        ) : (
                            <div className="mainBody">
                                <button className="cardNav1" onClick={() => this.goRoute('pengadaan')}>
                                    <FiSend size={150} className="picHome" />
                                    <div className="titCard">
                                        Pengajuan Pengadaan Asset
                                    </div>
                                </button>
                            </div>
                        )}
                    </div> */}
                </div>
            </div>
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
    getNotif: notif.getNotif,
    upNotif: notif.upNotif
}

export default connect(mapStateToProps, mapDispatchToProps)(NavTicket)