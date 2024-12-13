/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { Component } from 'react'
import {NavbarBrand, UncontrolledDropdown, DropdownToggle, DropdownMenu, Dropdown,
    DropdownItem, Table, ButtonDropdown, Input, Button, Row, Col, Card, CardBody,
    Modal, ModalHeader, ModalBody, ModalFooter, Container, Alert, Spinner, Collapse} from 'reactstrap'
import logo from "../assets/img/logo.png"
import Pdf from "../components/Pdf"
import style from '../assets/css/input.module.css'
import {FaSearch, FaUserCircle, FaBars, FaTrash, FaFileSignature} from 'react-icons/fa'
import {AiOutlineFileExcel, AiFillCheckCircle,  AiOutlineCheck, AiOutlineClose, AiOutlineInbox} from 'react-icons/ai'
import {BsCircle, BsDashCircleFill, BsFillCircleFill} from 'react-icons/bs'
import {MdAssignment} from 'react-icons/md'
import {FiSend, FiTruck, FiSettings, FiUpload} from 'react-icons/fi'
import {Formik} from 'formik'
import * as Yup from 'yup'
import {connect} from 'react-redux'
import moment from 'moment'
import auth from '../redux/actions/auth'
import newnotif from '../redux/actions/newnotif'
import Sidebar from "../components/Header";
import MaterialTitlePanel from "../components/material_title_panel";
import SidebarContent from "../components/sidebar_content";
import NavBar from '../components/NavBar'
import placeholder from  "../assets/img/placeholder.png"
import styleTrans from '../assets/css/transaksi.module.css'
import NewNavbar from '../components/NewNavbar'
const {REACT_APP_BACKEND_URL} = process.env

class TrackingMutasi extends Component {
    constructor(props) {
        super(props);
        this.state = {
            docked: false,
            open: false,
            transitions: true,
            touch: true,
            shadow: true,
            pullRight: false,
            touchHandleWidth: 20,
            dragToggleDistance: 30,
            alert: false,
            confirm: "",
            isOpen: false,
            dropOpen: false,
            dropOpenNum: false,
            value: '',
            onChange: new Date(),
            sidebarOpen: false,
            modalAdd: false,
            modalEdit: false,
            modalUpload: false,
            modalDownload: false,
            modalConfirm: false,
            detail: {},
            dataDivisi: [],
            upload: false,
            errMsg: '',
            fileUpload: '',
            limit: 10,
            search: '',
            modalRinci: false,
            dataRinci: {},
            openModalDoc: false,
            alertSubmit: false,
            openPdf: false,
            newData: [],
            detailMut: [],
            formDis: false,
            collap: false,
            tipeCol: '',
            dataNull: []
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
    }

    prosesSidebar = (val) => {
        this.setState({sidebarOpen: val})
    }
    
    goRoute = (val) => {
        this.props.history.push(`/${val}`)
    }

    showAlert = () => {
        this.setState({alert: true, modalEdit: false, modalAdd: false, modalUpload: false })
       
         setTimeout(() => {
            this.setState({
                alert: false
            })
         }, 10000)
    }

    showCollap = (val) => {
        if (val === 'close') {
            this.setState({collap: false})
        } else {
            this.setState({collap: false})
            setTimeout(() => {
                this.setState({collap: true, tipeCol: val})
             }, 500)
        }
    }

    showDokumen = async (value) => {
        const token = localStorage.getItem('token')
        await this.props.showDokumen(token, value.id)
        this.setState({date: value.updatedAt, idDoc: value.id, fileName: value})
        const {isShow} = this.props.pengadaan
        if (isShow) {
            this.openModalPdf()
        }
    }

    updateAll = async () => {
        const token = localStorage.getItem('token')
        await this.props.upAllNotif(token)
        this.getDataNotif()
    }

    updateNotif = async (val) => {
        const token = localStorage.getItem('token')
        await this.props.upNotif(token, val)
        this.getDataNotif()
    }

    deleteNotif = async (val) => {
        const token = localStorage.getItem('token')
        await this.props.delNotif(token, val)
        this.getDataNotif()
    }

    deleteAll = async () => {
        const token = localStorage.getItem('token')
        await this.props.delAllNotif(token)
        this.getDataNotif()
    }

    openReq = async (val) => {
        const token = localStorage.getItem('token')
        await this.props.upNotif(token, val.id)
        const ket = val.keterangan
        const jenis = (val.jenis === '' || val.jenis === null) && val.no_proses.split('')[0] === 'O' ? 'Stock Opname' : val.jenis
        const route = ket === 'tax' || ket === 'finance' || ket === 'tax and finance' ? 'taxfin' : ket === 'eksekusi' && jenis === 'disposal' ? 'eksdis' : jenis === 'disposal' && ket === 'pengajuan' ? 'disposal' : jenis === 'mutasi' && ket === 'pengajuan' ? 'mutasi' : jenis === 'Stock Opname' && ket === 'pengajuan' ? 'stock' : jenis === 'disposal' ? 'navdis' : jenis === 'mutasi' ? 'navmut' : jenis === 'Stock Opname' && 'navstock' 
        this.props.history.push(`/${route}`)
    }

    openModalPdf = () => {
        this.setState({openPdf: !this.state.openPdf})
        this.setState({openModalDoc: !this.state.openModalDoc})
    }

    onChangeUpload = e => {
        const {size, type} = e.target.files[0]
        this.setState({fileUpload: e.target.files[0]})
        if (size >= 20000000) {
            this.setState({errMsg: "Maximum upload size 20 MB"})
            this.uploadAlert()
        } else if (type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && type !== 'application/vnd.ms-excel' && type !== 'application/pdf' && type !== 'application/x-7z-compressed' && type !== 'application/vnd.rar' && type !== 'application/zip' && type !== 'application/x-zip-compressed' && type !== 'application/octet-stream' && type !== 'multipart/x-zip' && type !== 'application/x-rar-compressed') {
            this.setState({errMsg: 'Invalid file type. Only excel, pdf, zip, and rar files are allowed.'})
            this.uploadAlert()
        } else {
            const {detail} = this.state
            const token = localStorage.getItem('token')
            const data = new FormData()
            data.append('document', e.target.files[0])
            this.props.uploadDocumentDis(token, detail.id, data)
        }
    }

    closeProsesModalDoc = () => {
        this.setState({openModalDoc: !this.state.openModalDoc})
        this.setState({modalRinci: !this.state.modalRinci})
    }

    openProsesModalDoc = async (value) => {
        const token = localStorage.getItem('token')
        this.setState({dataRinci: value})
        console.log(value)
        await this.props.getDocumentDis(token, value.no_asset, 'disposal', value.nilai_jual === "0" ? 'dispose' : 'sell')
        this.closeProsesModalDoc()
    }

    openModalRinci = () => {
        this.setState({modalRinci: !this.state.modalRinci})
    }

    uploadAlert = () => {
        this.setState({upload: true, modalUpload: false })
       
         setTimeout(() => {
            this.setState({
                upload: false
            })
         }, 10000)
    }

    toggle = () => {
        this.setState({isOpen: !this.state.isOpen})
    }

    openConfirm = () => {
        this.setState({modalConfirm: !this.state.modalConfirm})
    }

    dropDown = () => {
        this.setState({dropOpen: !this.state.dropOpen})
    }
    dropOpen = () => {
        this.setState({dropOpenNum: !this.state.dropOpenNum})
    }
    onSetSidebarOpen = () => {
        this.setState({ sidebarOpen: !this.state.sidebarOpen });
    }

    openModalDownload = () => {
        this.setState({modalUpload: !this.state.modalUpload})
    }

    componentDidUpdate() {
        const {isError, isGet, isUpload, isSubmit} = this.props.disposal
        const token = localStorage.getItem('token')
        const {dataRinci} = this.state
        if (isError) {
            this.props.resetError()
            this.showAlert()
        } else if (isUpload) {
            setTimeout(() => {
                this.props.resetError()
                this.setState({modalUpload: false})
             }, 1000)
             setTimeout(() => {
                this.props.getDocumentDis(token, dataRinci.no_asset)
             }, 1100)
        } else if (isSubmit) {
            this.props.resetError()
            setTimeout(() => {
                this.getDataNotif()
             }, 1000)
        }
    }

    componentDidMount() {
        this.getDataNotif()
    }

    getDataNotif = async () => {
        const token = localStorage.getItem('token')
        await this.props.getAllNewNotif(token, '')
        this.filterData()
    }
    
    filterData = () => {
        const { dataAllNotif } = this.props.newnotif
        const newData = []
        const dataNull = []
        const dataRead = []
        for (let i = 0; i < dataAllNotif.length; i++) {
            newData.push(dataAllNotif[i])
            if (dataAllNotif[i].status === null) {
                dataNull.push(dataAllNotif[i])
            } else {
                dataRead.push(dataAllNotif[i])
            }
        }
        this.setState({ newData: newData, dataNull: dataNull })
    }

    menuButtonClick(ev) {
        ev.preventDefault();
        this.onSetOpen(!this.state.open);
    }

    onSetOpen(open) {
        this.setState({ open });
    }

    updateDataDis = async (value) => {
        const token = localStorage.getItem('token')
        const { dataRinci } = this.state
        await this.props.updateDisposal(token, dataRinci.id, value)
        this.getDataNotif()
    }

    getDetailDisposal = async (value) => {
        const { dataMut } = this.props.tracking
        const detail = []
        for (let i = 0; i < dataMut.length; i++) {
            if (dataMut[i].no_mutasi === value) {
                detail.push(dataMut[i])
            }
        }
        console.log(detail[0].no_mutasi)
        this.setState({detailMut: detail})
        this.openModalDis()
    }

    openModalDis = () => {
        this.setState({formDis: !this.state.formDis})
    }


    render() {
        const {isOpen, dropOpen, dropOpenNum, detail, alert, newData, dataNull} = this.state
        const {} = this.props.newnotif
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')

        const contentHeader =  (
            <div className={style.navbar}>
                <NavbarBrand
                    href="#"
                    onClick={this.menuButtonClick}
                    >
                        <FaBars size={20} className={style.white} />
                    </NavbarBrand>
                    <NavBar />
            </div>
        )

        const sidebar = <SidebarContent />
        const sidebarProps = {
            sidebar,
            docked: this.state.docked,
            sidebarClassName: "custom-sidebar-class",
            contentId: "custom-sidebar-content-id",
            open: this.state.open,
            touch: this.state.touch,
            shadow: this.state.shadow,
            pullRight: this.state.pullRight,
            touchHandleWidth: this.state.touchHandleWidth,
            dragToggleDistance: this.state.dragToggleDistance,
            transitions: this.state.transitions,
            onSetOpen: this.onSetOpen
          };
        return (
            <>
                {/* <Sidebar {...sidebarProps}>
                    <MaterialTitlePanel title={contentHeader}>
                        <div className={style.backgroundLogo}>
                            <div className={style.bodyDashboard}>
                                <Alert color="danger" className={style.alertWrong} isOpen={alert}>
                                </Alert>
                                <div className={style.headMaster}> 
                                    <div className={style.titleDashboard}>Notification</div>
                                </div>
                                <Row className="cartDisposal">
                                    {newData.length === 0 ? (
                                        <Col md={8} xl={8} sm={12}>
                                            <div className="txtDisposEmpty"></div>
                                        </Col>
                                    ) : (
                                        <Col md={8} xl={8} sm={12} className="mb-5 mt-5">
                                        {newData.length !== 0 && newData.map(item => {
                                            return (
                                                <div className="cart">
                                                    <div className="navCart">
                                                        <FaFileSignature className="cartImg" />
                                                        <Button className="labelBut" color={item.status === null ? "danger" : "success"} size="sm">{item.status === null ? 'unread' : 'read'}</Button>
                                                        <div className="txtCart">
                                                            <button className='openReq' size='sm' onClick={() => this.openReq(item)}>Open request</button>
                                                            <div>
                                                                <div className="textNotif mb-3">{item.keterangan} {(item.jenis === '' || item.jenis === null) && item.no_proses.split('')[0] === 'O' ? 'Stock Opname' : item.jenis}</div>
                                                                <div className="textNotif mb-3">No {item.jenis}: {item.no_proses}</div>
                                                                <div>{moment(item.createdAt).format('LLL')}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="footCart">
                                                        <div><FaTrash size={20} onClick={() => this.deleteNotif(item.id)} className="txtError"/></div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </Col>
                                    )}
                                    {newData.length === 0 || newData === undefined ? (
                                        null
                                    ) : (
                                        <Col md={4} xl={4} sm={12} className="mt-5">
                                            <div className="sideSum">
                                                <div className="titSum">Notification data</div>
                                                <div className="txtSum">
                                                    <div className="totalSum">Total Notification</div>
                                                    <div className="angkaSum">{newData.length}</div>
                                                </div>
                                                <div className="txtSum">
                                                    <div className="totalSum">Notification unread</div>
                                                    <div className="angkaSum">{dataNull.length}</div>
                                                </div>
                                                <Row>
                                                    <Col lg={6} md={6} xl={6}>
                                                        <button className="btnSum" disabled={newData.length === 0 ? true : false } onClick={() => this.deleteAll()}>Delete all</button>
                                                    </Col>
                                                    <Col lg={6} md={6} xl={6}>
                                                        <button className="btnSum1" disabled={newData.length === 0 ? true : false } onClick={() => this.updateAll()}>Mark all read</button>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Col>
                                    )}
                                </Row>
                            </div>
                        </div>
                    </MaterialTitlePanel>
                </Sidebar> */}
                <div className={styleTrans.app}>
                    <NewNavbar handleSidebar={this.prosesSidebar} handleRoute={this.goRoute} />

                    <div className={`${styleTrans.mainContent} ${this.state.sidebarOpen ? styleTrans.collapsedContent : ''}`}>
                        <h2 className={styleTrans.pageTitle}>Notifikasi</h2>

                        <Row className="cartDisposal">
                            {newData.length === 0 ? (
                                <Col md={8} xl={8} sm={12}>
                                    <div className="txtDisposEmpty"></div>
                                </Col>
                            ) : (
                                <Col md={8} xl={8} sm={12} className="mb-5 mt-5">
                                {newData.length !== 0 && newData.map(item => {
                                    return (
                                        <div className="cart">
                                            <div className="navCart">
                                                <FaFileSignature className="cartImg" />
                                                <Button className="labelBut" color={item.status === null ? "danger" : "success"} size="sm">{item.status === null ? 'unread' : 'read'}</Button>
                                                <div className="txtCart">
                                                    <button className='openReq' size='sm' onClick={() => this.openReq(item)}>Open request</button>
                                                    <div>
                                                        <div className="textNotif mb-3">{item.keterangan} {(item.jenis === '' || item.jenis === null) && item.no_proses.split('')[0] === 'O' ? 'Stock Opname' : item.jenis}</div>
                                                        <div className="textNotif mb-3">No {item.jenis}: {item.no_proses}</div>
                                                        <div>{moment(item.createdAt).format('LLL')}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="footCart">
                                                <div><FaTrash size={20} onClick={() => this.deleteNotif(item.id)} className="txtError"/></div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </Col>
                            )}
                            {newData.length === 0 || newData === undefined ? (
                                null
                            ) : (
                                <Col md={4} xl={4} sm={12} className="mt-5">
                                    <div className="sideSum">
                                        <div className="titSum">Notification data</div>
                                        <div className="txtSum">
                                            <div className="totalSum">Total Notification</div>
                                            <div className="angkaSum">{newData.length}</div>
                                        </div>
                                        <div className="txtSum">
                                            <div className="totalSum">Notification unread</div>
                                            <div className="angkaSum">{dataNull.length}</div>
                                        </div>
                                        <Row>
                                            <Col lg={6} md={6} xl={6}>
                                                <button className="btnSum" disabled={newData.length === 0 ? true : false } onClick={() => this.deleteAll()}>Delete all</button>
                                            </Col>
                                            <Col lg={6} md={6} xl={6}>
                                                <button className="btnSum1" disabled={newData.length === 0 ? true : false } onClick={() => this.updateAll()}>Mark all read</button>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            )}
                        </Row>
                        {newData.length === 0 && (
                            <div className={style.spinCol}>
                                <AiOutlineInbox size={50} className='secondary mb-4' />
                                <div className='textInfo'>Data notifikasi tidak ditemukan</div>
                            </div>
                        )}
                    </div>
                </div>
                <Modal isOpen={this.props.disposal.isLoading ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className={style.cekUpdate}>
                                <Spinner />
                                <div sucUpdate>Waiting....</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
                <Modal isOpen={this.state.openPdf} size="xl" toggle={this.openModalPdf} centered={true}>
                    <ModalHeader>Dokumen</ModalHeader>
                    <ModalBody>
                        <div className={style.readPdf}>
                            <Pdf pdf={`${REACT_APP_BACKEND_URL}/show/doc/${this.state.idDoc}`} />
                        </div>
                        <hr/>
                        <div className={style.foot}>
                            <div>
                                <Button color="success">Download</Button>
                            </div>
                        {level === '5' ? (
                            <Button color="primary" onClick={() => this.setState({openPdf: false})}>Close</Button>
                            ) : (
                                <div>
                                    <Button color="danger" className="mr-3" onClick={this.openModalRejectDis}>Reject</Button>
                                    <Button color="primary" onClick={this.openModalApproveDis}>Approve</Button>
                                </div>
                            )}
                        </div>
                    </ModalBody>
                </Modal>
            </>
        )
    }
}

const mapStateToProps = state => ({
    disposal: state.disposal,
    setuju: state.setuju,
    pengadaan: state.pengadaan,
    tracking: state.tracking,
    newnotif: state.newnotif
})

const mapDispatchToProps = {
    logout: auth.logout,
    getAllNewNotif: newnotif.getAllNewNotif
}

export default connect(mapStateToProps, mapDispatchToProps)(TrackingMutasi)
