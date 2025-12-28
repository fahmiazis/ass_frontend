/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react'
import Sidebar from '../components/Sidebar'
import auth from '../redux/actions/auth'
import { Input, Button, Modal, ModalHeader, ModalBody, Alert, Collapse,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Dropdown, Row } from 'reactstrap'
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
import Bell from '../components/Bell'
import Account from '../components/Account'
import { FaBell, FaUser, FaBars, FaTimes, FaMobileAlt } from 'react-icons/fa';
import styleHome from '../assets/css/Home.module.css'
import pengadaanIm from '../assets/img/io.png'
import disposalIm from '../assets/img/dis.png'
import mutasiIm from '../assets/img/mutasis.png'
import opnameIm from '../assets/img/opname.png'
import logo from '../assets/img/logo.png'
import {AiFillHome, AiOutlineMenu} from 'react-icons/ai'
import {FiLogOut, FiUser, FiUsers, FiMail, FiEye} from 'react-icons/fi'
import { BsClipboardData, BsHouseDoor, BsFileCheck } from 'react-icons/bs'
import { FaDatabase, FaHome, FaFileArchive, FaCartPlus, FaRecycle, FaTasks, } from 'react-icons/fa'
import { RiArrowLeftRightFill, RiMoneyDollarCircleFill } from 'react-icons/ri'

import {FiSend, FiTruck} from 'react-icons/fi'
import {BiRevision} from 'react-icons/bi'
import {MdAssignment, MdVerifiedUser, MdOutlineVerifiedUser, MdMonetizationOn, MdDomainVerification} from 'react-icons/md'
import {HiOutlineDocumentReport} from 'react-icons/hi'
import {RiDraftFill} from 'react-icons/ri'
import {FaFileSignature} from 'react-icons/fa'
import {BsBell, BsFillCircleFill} from 'react-icons/bs'

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
        modalChange: false,
        sidebarVisible: false,
        dataNull: [],
        isOpen: false,
        openTicket: false,
        openDis: false,
        openStock: false,
        openMut: false,
    }

    toggle = () => {
        this.setState({isOpen: !this.state.isOpen})
    }

    toggleTicket = () => {
        this.setState({openTicket: !this.state.openTicket})
    }

    toggleDis = () => {
        this.setState({openDis: !this.state.openDis})
    }

    toggleStock = () => {
        this.setState({openStock: !this.state.openStock})
    }

    toggleMut = () => {
        this.setState({openMut: !this.state.openMut})
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
            const route = ket === 'tax' || ket === 'finance' || ket === 'tax and finance' ? 'taxfin' : ket === 'eksekusi' && jenis === 'disposal' ? 'eksdis' : jenis === 'disposal' && ket === 'pengajuan' ? 'disposal' : jenis === 'mutasi' && ket === 'pengajuan' ? 'mutasi' : jenis === 'Stock Opname' && ket === 'pengajuan' ? 'stock' : jenis === 'disposal' ? 'navdis' : jenis === 'mutasi' ? 'nav-mutasi' : jenis === 'Stock Opname' && 'navstock' 
            localStorage.setItem('route', route)
            this.props.history.push(`/${route}`)
        }
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
        document.addEventListener('mousedown', this.closeSidebar)
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
        document.removeEventListener('mousedown', this.closeSidebar);
    }

    toggleSidebar = () => {
        this.setState((prevState) => ({
          sidebarVisible: !prevState.sidebarVisible,
        }))
      }
    
      closeSidebar = (event) => {
        if (this.sidebarRef && this.sidebarRef.contains(event.target)) {
          return // Jika klik di dalam sidebar, tidak melakukan apa-apa
        }
        this.setState({ sidebarVisible: false })
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
        const {dataNull} = this.state
        const id = localStorage.getItem('id')
        const { alertM, alertMsg } = this.props.user
        const dataNotif = this.props.notif.data
        const allowSet = ['1','17','20', '21', '22', '23', '24', '25', '32']
        const disposalRoute = level === '6' ? 'purchdis' : level === '3' || level === '4' ? 'taxfin-disposal' : 'disposal'
        const mutasiRoute = level === '2' ? 'eks-mutasi' : level === '8' ? 'budget-mutasi' : 'mutasi'
        
        return (
            <>
            {/* <div className="bodyHome">
                <div className="leftHome">
                    <Sidebar />
                </div>
                <div className="rightHome">
                    <div className="bodyAkun">
                        <div></div>
                        <div className="akun">
                            <Bell dataNotif={dataNotif} color={"black"}/>
                            <Account color={"black"}/>
                        </div>
                    </div>
                    <div className='mainHome'>
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
                            <button className="cardHome1" onClick={() => this.goRoute('nav-mutasi')}>
                                <img src={mutasiPicture} className="picHome" />
                                <div className="titCard mt-4">
                                    Mutasi
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div> */}
            <div className={styleHome.homeContainer}>
                <header className={styleHome.header}>
                    <FaBars className={styleHome.burgerMenu} onClick={this.toggleSidebar} />
                    <div className={styleHome.icons}>
                        <Bell dataNotif={[]} color={"black"}/>
                        <Account color={"black"} handleRoute={this.goRoute}/>
                    </div>
                </header>
        
                <aside
                    className={`${styleHome.sidebar} ${this.state.sidebarVisible ? styleHome.show : styleHome.hide}`}
                    ref={(ref) => (this.sidebarRef = ref)} // Mengaitkan referensi sidebar
                >
                    <div className={styleHome.logo}>
                        <img src={logo} alt="Logo"  className={styleHome.imgLogo}/>
                    </div>
                    <nav className={styleHome.nav}>
                    <ul>
                        <li className={styleHome.alignCenter} onClick={() => this.goRoute('')}>
                            <AiFillHome className='mr-2' />
                            Home
                        </li>
                        {(level === '1' || level === '2' || level === '5' || level === '9') && (
                            <li className={styleHome.alignCenter} onClick={() => this.goRoute('asset')}>
                                <RiMoneyDollarCircleFill className='mr-2' />
                                My Asset
                            </li>
                        )}
                        <li className={styleHome.alignCenter} 
                        // onClick={() => this.goRoute('navtick')}
                        onClick={this.toggleTicket}
                        >
                            <FaCartPlus className='mr-2' />
                            Pengadaan Aset
                        </li>
                        <Collapse isOpen={this.state.openTicket} className="ml-3 mt-3">
                            {(level !== '2' && level !== '8') && (
                                <li onClick={() => this.goRoute('pengadaan')} className={styleHome.alignCenter}>
                                    <FiSend className="mr-2"/>
                                    Pengajuan Pengadaan Asset
                                </li>
                            )}
                            {(level === '5' || level === '9') && (
                                <li onClick={() => this.goRoute('revtick')} className={styleHome.alignCenter}>
                                    <BiRevision className="mr-2"/>
                                    Revisi Pengadaan Asset
                                </li>
                            )}

                            {(level === '2') && (
                                <li onClick={() => this.goRoute('pengadaan')} className={styleHome.alignCenter}>
                                    <MdDomainVerification className="mr-2"/>
                                    Verifikasi Pengadaan Asset
                                </li>
                            )}

                            {(level === '8') && (
                                <li onClick={() => this.goRoute('pengadaan')} className={styleHome.alignCenter}>
                                    <MdOutlineVerifiedUser className="mr-2"/>
                                    Verifikasi Budget Pengadaan
                                </li>
                            )}

                            {(level === '2') && (
                                <li onClick={() => this.goRoute('ekstick')} className={styleHome.alignCenter}>
                                    <FiTruck className="mr-2"/>
                                    Eksekusi Pengadaan Asset
                                </li>
                            )}
                            {(level === '2' || level === '1') && (
                                <li onClick={() => this.goRoute('reportio')} className={styleHome.alignCenter}>
                                    <HiOutlineDocumentReport className="mr-2"/>
                                    Report Pengadaan Asset
                                </li>
                            )}
                            {/* <li onClick={() => this.goRoute('navtick')} className={styleHome.alignCenter}>
                                <AiOutlineMenu className="mr-2"/>
                                Navigasi Pengadaan Asset
                            </li> */}
                        </Collapse>
                        <li className={styleHome.alignCenter} 
                        // onClick={() => this.goRoute('navdis')} 
                        onClick={this.toggleDis}
                        >
                            <FaRecycle className='mr-2' />
                            Disposal Aset
                        </li>
                        <Collapse isOpen={this.state.openDis} className="ml-3 mt-3">
                            {(level !== '6') && ( 
                                <li onClick={() => this.goRoute('disposal')} className={styleHome.alignCenter}>
                                    <FiSend className="mr-2"/>
                                    Pengajuan Disposal
                                </li>
                            )}
                            {allowSet.find(item => item === level) && ( 
                                <li onClick={() => this.goRoute('persetujuan-disposal')} className={styleHome.alignCenter}>
                                    <FiSend className="mr-2"/>
                                    Persetujuan Disposal
                                </li>
                            )}
                            {(level === '6') && (
                                <li onClick={() => this.goRoute('purchdis')} className={styleHome.alignCenter}>
                                    <MdMonetizationOn className="mr-2"/>
                                    Verifikasi Purchasing
                                </li>
                            )}
                            {/* {(level === '2' || level === '5' || level === '9') && ( */}
                            {(level === '2') && (
                                <>
                                    <li onClick={() => this.goRoute('eksdis')} className={styleHome.alignCenter}>
                                        <FiTruck className="mr-2"/>
                                        Eksekusi Disposal
                                    </li>
                                </>
                            )}
                            {(level === '3') && (
                                <li onClick={() => this.goRoute('taxfin-disposal')} className={styleHome.alignCenter}>
                                    <MdMonetizationOn className="mr-2"/>
                                    Proses Tax Disposal
                                </li>
                            )}
                            {(level === '4') && (
                                <li onClick={() => this.goRoute('taxfin-disposal')} className={styleHome.alignCenter}>
                                    <MdMonetizationOn className="mr-2"/>
                                    Proses Finance Disposal
                                </li>
                            )}
                            {(level === '2') && (
                                <li onClick={() => this.goRoute('taxfin-disposal')} className={styleHome.alignCenter}>
                                    <MdDomainVerification className="mr-2"/>
                                    Verifikasi Final Disposal
                                </li>
                            )}
                            {(level === '2' || level === '1') && (
                                <li onClick={() => this.goRoute('report-disposal')} className={styleHome.alignCenter}>
                                    <HiOutlineDocumentReport className="mr-2"/>
                                    Report Disposal Asset
                                </li>
                            )}
                            {(level === '5' || level === '9') && (
                                <li onClick={() => this.goRoute('rev-disposal')} className={styleHome.alignCenter}>
                                    <BiRevision className="mr-2"/>
                                    Revisi Disposal Asset
                                </li>
                            )}
                            {/* <li onClick={() => this.goRoute('navdis')} className={styleHome.alignCenter}>
                                <AiOutlineMenu className="mr-2"/>
                                Navigasi Disposal Asset
                            </li> */}
                        </Collapse>
                        <li className={styleHome.alignCenter} 
                        // onClick={() => this.goRoute('nav-mutasi')} 
                        onClick={this.toggleMut}
                        >
                            <RiArrowLeftRightFill className='mr-2' />
                            Mutasi Aset
                        </li>
                        <Collapse isOpen={this.state.openMut} className="ml-3 mt-3">
                           {(level !== '8') && ( 
                            <li onClick={() => this.goRoute('mutasi')} className={styleHome.alignCenter}>
                                    <FiSend className="mr-2"/>
                                    Pengajuan Mutasi Asset
                                </li>
                            )}
                            {(level === '5' || level === '9') && (
                                <li onClick={() => this.goRoute('rev-mutasi')} className={styleHome.alignCenter}>
                                    <BiRevision className="mr-2"/>
                                    Revisi Mutasi Asset
                                </li>
                            )}
                            {(level === '2') && (
                                <>
                                    <li onClick={() => this.goRoute('eks-mutasi')} className={styleHome.alignCenter}>
                                        <FiTruck className="mr-2"/>
                                        Eksekusi Mutasi Asset
                                    </li>
                                </>
                            )}
                            {(level === '8') && (
                                <li onClick={() => this.goRoute('budget-mutasi')} className={styleHome.alignCenter}>
                                    <MdOutlineVerifiedUser className="mr-2"/>
                                    Verifikasi Budget Mutasi
                                </li>
                            )}
                            {(level === '2' || level === '1') && (
                                <li onClick={() => this.goRoute('report-mutasi')} className={styleHome.alignCenter}>
                                    <HiOutlineDocumentReport className="mr-2"/>
                                    Report Mutasi Asset
                                </li>
                            )}
                            {/* <li onClick={() => this.goRoute('nav-mutasi')} className={styleHome.alignCenter}>
                                <AiOutlineMenu className="mr-2"/>
                                Navigasi Mutasi Asset
                            </li> */}
                        </Collapse>
                        <li className={styleHome.alignCenter} 
                        // onClick={() => this.goRoute('navstock')} 
                        onClick={this.toggleStock}
                        >
                            <FaTasks className='mr-2' />
                            Stock Opname Aset
                        </li>
                        <Collapse isOpen={this.state.openStock} className="ml-3 mt-3">
                            {(level !== '2') && (
                                <li onClick={() => this.goRoute('stock')} className={styleHome.alignCenter}>
                                    <FiSend className="mr-2"/>
                                    Pengajuan Stock Opname
                                </li>
                            )}
                            {(level === '2') && (
                                <li onClick={() => this.goRoute('stock')} className={styleHome.alignCenter}>
                                    <FiTruck className="mr-2"/>
                                    Terima Stock Opname
                                </li>
                            )}
                            {(level === '2') && (
                                <li onClick={() => this.goRoute('monstock')} className={styleHome.alignCenter}>
                                    <FiEye className="mr-2"/>
                                    Monitoring Stock Opname
                                </li>
                            )}
                            {(level === '5' || level === '9') && (
                                <li onClick={() => this.goRoute('editstock')} className={styleHome.alignCenter}>
                                    <BiRevision className="mr-2"/>
                                    Revisi Stock Opname
                                </li>
                            )}
                            {(level === '2' || level === '1') && (
                                <li onClick={() => this.goRoute('repstock')} className={styleHome.alignCenter}>
                                    <HiOutlineDocumentReport className="mr-2"/>
                                    Report Stock Opname
                                </li>
                            )}
                            {/* <li onClick={() => this.goRoute('navstock')} className={styleHome.alignCenter}>
                                <AiOutlineMenu className="mr-2"/>
                                Navigasi Stock Opname
                            </li> */}
                        </Collapse>
                        {level === '1' ? (
                            <li className={styleHome.alignCenter} onClick={this.toggle}>
                                <FaDatabase className="mr-2"/> Master
                            </li>
                        ) : (
                            <div></div>
                        )}
                        <Collapse isOpen={this.state.isOpen} className="ml-3 mt-3">
                            {/* <button onClick={() => this.goRoute('alasan')} className={styleHome.alignCenter}>
                                <RiFileUnknowLine className="mr-2"/>
                                Master Alasan
                            </button> */}
                            <li onClick={() => this.goRoute('depo')} className={styleHome.alignCenter}>
                                <BsHouseDoor className="mr-2"/>
                                Master Depo
                            </li>
                            {/* <li onClick={() => this.goRoute('email')} className={styleHome.alignCenter}>
                                <FiMail className="mr-2"/>
                                Master Email
                            </li> */}
                            <li onClick={() => this.goRoute('dokumen')} className={styleHome.alignCenter}>
                                <BsClipboardData className="mr-2"/>
                                Master Document
                            </li>
                            <li onClick={() => this.goRoute('menu')} className={styleHome.alignCenter}>
                                <AiOutlineMenu className="mr-2"/>
                                Master Menu
                            </li>
                            <li onClick={() => this.goRoute('role')} className={styleHome.alignCenter}>
                                <FiUser className="mr-2"/>
                                Master Role
                            </li>
                            <li onClick={() => this.goRoute('status-stock')} className={styleHome.alignCenter}>
                                <FiUser className="mr-2"/>
                                Master Status Stock
                            </li>
                            <li onClick={() => this.goRoute('tempmail')} className={styleHome.alignCenter}>
                                <FiMail className="mr-2"/>
                                Master Template Email
                            </li>
                            <li onClick={() => this.goRoute('user')} className={styleHome.alignCenter}>
                                <FiUser className="mr-2"/>
                                Master User
                            </li>
                            {/* <li onClick={() => this.goRoute('divisi')} className={styleHome.alignCenter}>
                                <GiFamilyTree className="mr-2"/>
                                Master Divisi
                            </li> */}
                            
                            <li onClick={() => this.goRoute('approval')} className={styleHome.alignCenter}>
                                <BsClipboardData className="mr-2"/>
                                Setting Approval
                            </li>
                            <li onClick={() => this.goRoute('clossing')} className={styleHome.alignCenter}>
                                <BsClipboardData className="mr-2"/>
                                Setting Clossing
                            </li>
                            {/* <li onClick={() => this.goRoute('pic')} className={styleHome.alignCenter}>
                                <FiUsers className="mr-2"/>
                                Master PIC
                            </li> */}
                        </Collapse>
                        <li className={styleHome.alignCenter} onClick={() => this.goRoute('release-apk')}>
                            <FaMobileAlt className='mr-2' />
                            Release APK
                        </li>
                    </ul>
                    </nav>
                </aside>
        
                <div className={styleHome.mainContent}>
                    <main className={styleHome.mainSection}>
                    <h1 className={styleHome.title}>Welcome to web asset</h1>
                    <h4 className={styleHome.subtitle}>Please select an option</h4>

                    <div className={`${styleHome.assetContainer} row`}>
                        {/* Pengadaan Aset */}
                        <div 
                        onClick={() => this.goRoute('pengadaan')} 
                        // onClick={() => this.goRoute('navtick')} 
                        className="col-12 col-md-6 col-lg-3 mb-4">
                            <div className={styleHome.assetCard}>
                                <img className='mt-4' src={pengadaanIm} alt="Pengadaan Aset"  />
                                <p className='mt-4'>Pengadaan Aset</p>
                            </div>
                        </div>

                        {/* Disposal Aset */}
                        <div 
                        onClick={() => this.goRoute(disposalRoute)} 
                        // onClick={() => this.goRoute('navdis')} 
                        className="col-12 col-md-6 col-lg-3 mb-4">
                            <div className={styleHome.assetCard}>
                                <img className='mt-4' src={disposalIm} alt="Disposal Aset"  />
                                <p className='mt-4'>Disposal Aset</p>
                            </div>
                        </div>

                        {/* Stock Opname Aset */}
                        <div 
                        onClick={() => this.goRoute('stock')} 
                        // onClick={() => this.goRoute('navstock')} 
                        className="col-12 col-md-6 col-lg-3 mb-4">
                            <div className={styleHome.assetCard}>
                                <img className='mt-4' src={opnameIm}alt="Stock Opname Aset"  />
                                <p className='mt-4'>Stock Opname Aset</p>
                            </div>
                        </div>

                        {/* Mutasi Aset */}
                        <div 
                        onClick={() => this.goRoute(mutasiRoute)} 
                        // onClick={() => this.goRoute('nav-mutasi')} 
                        className="col-12 col-md-6 col-lg-3 mb-4">
                            <div className={styleHome.assetCard}>
                                <img className='mt-4' src={mutasiIm} alt="Mutasi Aset"  />
                                <p className='mt-4'>Mutasi Aset</p>
                            </div>
                        </div>
                    </div>
                    </main>
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
    getNotif: notif.getNotif,
    upNotif: notif.upNotif
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
