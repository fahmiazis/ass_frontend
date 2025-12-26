/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { Component } from 'react'
import {NavbarBrand, UncontrolledDropdown, DropdownToggle, DropdownMenu, Dropdown,
    DropdownItem, Table, ButtonDropdown, Input, Button, Row, Col, Card, CardBody,
    Modal, ModalHeader, ModalBody, ModalFooter, Container, Alert, Spinner, Collapse} from 'reactstrap'
import logo from "../../assets/img/logo.png"
import Pdf from "../../components/Pdf"
import style from '../../assets/css/input.module.css'
import {FaSearch, FaUserCircle, FaBars, FaTrash, FaFileSignature} from 'react-icons/fa'
import {AiOutlineFileExcel, AiFillCheckCircle,  AiOutlineCheck, AiOutlineClose, AiOutlineInbox} from 'react-icons/ai'
import {BsCircle, BsDashCircleFill, BsFillCircleFill} from 'react-icons/bs'
import {MdAssignment} from 'react-icons/md'
import {FiSend, FiTruck, FiSettings, FiUpload} from 'react-icons/fi'
import {Formik} from 'formik'
import * as Yup from 'yup'
import pengadaan from '../../redux/actions/pengadaan'
import disposal from '../../redux/actions/disposal'
import tracking from '../../redux/actions/tracking'
import setuju from '../../redux/actions/setuju'
import {connect} from 'react-redux'
import moment from 'moment'
import auth from '../../redux/actions/auth'
import {default as axios} from 'axios'
import Sidebar from "../../components/Header";
import MaterialTitlePanel from "../../components/material_title_panel";
import SidebarContent from "../../components/sidebar_content";
import placeholder from  "../../assets/img/placeholder.png"
import b from "../../assets/img/b.jpg"
import e from "../../assets/img/e.jpg"
import NavBar from '../../components/NavBar'
import styleTrans from '../../assets/css/transaksi.module.css'
import NewNavbar from '../../components/NewNavbar'
const {REACT_APP_BACKEND_URL} = process.env

const dokumenSchema = Yup.object().shape({
    nama_dokumen: Yup.string().required(),
    jenis_dokumen: Yup.string().required(),
    divisi: Yup.string().required(),
});

const disposalSchema = Yup.object().shape({
    merk: Yup.string().validateSync(""),
    keterangan: Yup.string().required('must be filled'),
    nilai_jual: Yup.string().required()
})

class MonitoringDisposal extends Component {
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
            newDis: [],
            detailDis: [],
            formDis: false,
            collap: false,
            tipeCol: '',
            filter: ''
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

    changeFilter = (val) => {
        const newDis = []
        const { dataDis, noDis } = this.props.tracking
        if (val === 'selesai') {
            for (let i = 0; i < noDis.length; i++) {
                const index = dataDis.indexOf(dataDis.find(({no_disposal}) => no_disposal === noDis[i]))
                const resdis = dataDis[index]
                if (resdis !== undefined && resdis.status_form === 8) {
                    newDis.push(dataDis[index])
                }
            }
            this.setState({filter: val, newDis: newDis})
        } else if (val === 'proses') {
            for (let i = 0; i < noDis.length; i++) {
                const index = dataDis.indexOf(dataDis.find(({no_disposal}) => no_disposal === noDis[i]))
                const resdis = dataDis[index]
                if (resdis !== undefined && resdis.status_form !== 8 && (resdis.status_reject === null || resdis.status_reject === 4 || resdis.status_reject === 6)) {
                    newDis.push(resdis)
                }
            }
            this.setState({filter: val, newDis: newDis})
        } else if (val === 'reject') {
            for (let i = 0; i < noDis.length; i++) {
                const index = dataDis.indexOf(dataDis.find(({no_disposal}) => no_disposal === noDis[i]))
                const resdis = dataDis[index]
                if (resdis !== undefined && (resdis.status_reject === 0 || resdis.status_reject === 1 || resdis.status_reject === 2 || resdis.status_reject === 3 || resdis.status_reject === 5)) {
                    newDis.push(resdis)
                }
            }
            this.setState({filter: val, newDis: newDis})
        } else {
            for (let i = 0; i < noDis.length; i++) {
                const index = dataDis.indexOf(dataDis.find(({no_disposal}) => no_disposal === noDis[i]))
                if (dataDis[index] !== undefined) {
                    newDis.push(dataDis[index])
                }
            }
            this.setState({filter: val, newDis: newDis})
        }
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
                this.getDataTrack()
             }, 1000)
        }
    }

    componentDidMount() {
        this.getDataTrack()
    }

    getDataTrack = async () => {
        const token = localStorage.getItem('token')
        await this.props.getTrack(token)
        this.changeFilter('all')
    }
    
    filterData = () => {
        const { noDis, dataDis } = this.props.tracking
        const newDis = []
        for (let i = 0; i < noDis.length; i++) {
            const index = dataDis.indexOf(dataDis.find(({no_disposal}) => no_disposal === noDis[i]))
            if (dataDis[index] !== undefined) {
                newDis.push(dataDis[index])
            }
        }
        this.setState({ newDis: newDis })
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
        this.getDataTrack()
    }

    getDetailDisposal = async (value) => {
        const { dataDis } = this.props.tracking
        const detail = []
        for (let i = 0; i < dataDis.length; i++) {
            if (dataDis[i].no_disposal === value) {
                detail.push(dataDis[i])
            }
        }
        console.log(detail[0].no_disposal)
        this.setState({detailDis: detail})
        this.openModalDis()
    }

    openModalDis = () => {
        this.setState({formDis: !this.state.formDis})
    }


    render() {
        const {isOpen, dropOpen, dropOpenNum, detail, alert, newDis, detailDis} = this.state
        const {dataDis, isGet, alertM, alertMsg, alertUpload, page, dataDoc} = this.props.disposal
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
                                    <div>{alertMsg}</div>
                                    <div>{alertM}</div>
                                    {alertUpload !== undefined && alertUpload.map(item => {
                                        return (
                                            <div>{item}</div>
                                        )
                                    })}
                                </Alert>
                                <div className={style.headMaster}>
                                    <div className={style.titleDashboard}>Tracking Disposal</div>
                                </div>
                                <div className={[style.secEmail]}>
                                    <div className="mt-5">
                                        <Input type="select" value={this.state.view} onChange={e => this.changeFilter(e.target.value)}>
                                            <option value="all">All</option>
                                            <option value="proses">On Proses</option>
                                            <option value="reject">Reject</option>
                                            <option value="selesai">Selesai</option>
                                        </Input>
                                    </div>
                                    <div className={[style.searchEmail]}>
                                        <text>Search: </text>
                                        <Input 
                                        className={style.search}
                                        onChange={this.onSearch}
                                        value={this.state.search}
                                        onKeyPress={this.onSearch}
                                        >
                                            <FaSearch size={20} />
                                        </Input>
                                    </div>
                                </div>
                                <Table bordered striped responsive hover className={style.tab}>
                                    <thead>
                                        <tr>
                                            <th>NO</th>
                                            <th>NO.AJUAN</th>
                                            <th>AREA</th>
                                            <th>KODE PLANT</th>
                                            <th>STATUS</th>
                                            <th>OPSI</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {newDis !== undefined && newDis.length > 0 && newDis.map(item => {
                                        return (
                                        <tr className={item.status_reject === 0 ? 'note' : item.status_form == 0 ? 'fail' : item.status_reject === 1 && 'bad'}>
                                            <td>{newDis.indexOf(item) + 1}</td>
                                            <td>{item.no_disposal}</td>
                                            <td>{item.area}</td>
                                            <td>{item.kode_plant}</td>
                                            <td>On Proses</td>
                                            <td>
                                                <Button className="btnSell" color="primary" onClick={() => {this.getDetailDisposal(item.no_disposal)}}>Lacak</Button>
                                            </td>
                                        </tr>
                                        )
                                    })}
                                    </tbody>
                                </Table>
                                {newDis.length === 0 && (
                                    <div className={style.spin}>
                                        <text className='textInfo'>Data ajuan tidak ditemukan</text>
                                    </div>
                                )}
                                <div className='mt-4'>
                                    <div className={style.infoPageEmail1}>
                                        <text>Showing 1 of 1 pages</text>
                                        <div className={style.pageButton}>
                                            <button className={style.btnPrev} color="info" disabled>Prev</button>
                                            <button className={style.btnPrev} color="info" disabled>Next</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </MaterialTitlePanel>
                </Sidebar> */}
                <div className={styleTrans.app}>
                    <NewNavbar handleSidebar={this.prosesSidebar} handleRoute={this.goRoute} />

                    <div className={`${styleTrans.mainContent} ${this.state.sidebarOpen ? styleTrans.collapsedContent : ''}`}>
                        <h2 className={styleTrans.pageTitle}>Tracking Disposal</h2>

                        <div className={styleTrans.searchContainer}>
                            <input
                                type="text"
                                placeholder="Search..."
                                onChange={this.onSearch}
                                value={this.state.search}
                                onKeyPress={this.onSearch}
                                className={styleTrans.searchInput}
                            />
                            <select value={this.state.filter} onChange={e => this.changeFilter(e.target.value)} className={styleTrans.searchInput}>
                                <option value="all">All</option>
                                <option value="proses">On Proses</option>
                                <option value="reject">Reject</option>
                                <option value="selesai">Selesai</option>
                            </select>
                        </div>

                        <table className={styleTrans.table}>
                            <thead>
                                <tr>
                                    <th>NO</th>
                                    <th>NO AJUAN</th>
                                    <th>KODE AREA</th>
                                    <th>NAMA AREA</th>
                                    <th>TANGGAL AJUAN</th>
                                    <th>STATUS</th>
                                    <th>OPSI</th>
                                </tr>
                            </thead>
                            <tbody>
                                {newDis !== undefined && newDis.length > 0 && newDis.map(item => {
                                    return (
                                    <tr className={item.status_reject === 0 ? 'note' : item.status_form == 0 ? 'fail' : item.status_reject === 1 && 'bad'}>
                                        <td>{newDis.indexOf(item) + 1}</td>
                                        <td>{item.no_disposal}</td>
                                        <td>{item.kode_plant}</td>
                                        <td>{item.area}</td>
                                        <td>{moment(item.tanggalDis).format('DD MMMM YYYY')}</td>
                                        <td>On Proses</td>
                                        <td>
                                            <Button className="btnSell" color="primary" onClick={() => {this.getDetailDisposal(item.no_disposal)}}>Lacak</Button>
                                        </td>
                                    </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        {newDis.length === 0 && (
                            <div className={style.spinCol}>
                                <AiOutlineInbox size={50} className='secondary mb-4' />
                                <div className='textInfo'>Data ajuan tidak ditemukan</div>
                            </div>
                        )}
                    </div>
                </div>
                <Modal isOpen={this.props.tracking.isLoading ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className={style.cekUpdate}>
                                <Spinner />
                                <div sucUpdate>Waiting....</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
                <Modal isOpen={this.state.formDis} toggle={() => {this.openModalDis(); this.showCollap('close')}} size="xl">
                    <ModalBody>
                        <Row className='trackTitle ml-4'>
                            <Col>
                                Tracking Disposal
                            </Col>
                        </Row>
                        <Row className='ml-4 trackSub'>
                            <Col md={3}>
                                Area
                            </Col>
                            <Col md={9}>
                            : {detailDis[0] === undefined ? '' : detailDis[0].area}
                            </Col>
                        </Row>
                        <Row className='ml-4 trackSub'>
                            <Col md={3}>
                            No disposal
                            </Col>
                            <Col md={9}>
                            : {detailDis[0] === undefined ? '' : 'D' + detailDis[0].no_disposal}
                            </Col>
                        </Row>
                        <Row className='ml-4 trackSub1'>
                            <Col md={3}>
                            Tanggal Pengajuan Disposal
                            </Col>
                            <Col md={9}>
                            : {detailDis[0] === undefined ? '' : moment(detailDis[0].tanggalDis === null ? detailDis[0].createdAt : detailDis[0].tanggalDis).locale('idn').format('DD MMMM YYYY ')}
                            </Col>
                        </Row>
                        <div class="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
                            <div class="step completed">
                                <div class="step-icon-wrap">
                                <button class="step-icon" onClick={() => this.showCollap('Submit')} ><FiSend size={40} className="center1" /></button>
                                </div>
                                <h4 class="step-title">Submit Disposal</h4>
                            </div>
                            {detailDis[0] === undefined ? (
                                <div></div>
                            ) : detailDis.find(({nilai_jual}) => nilai_jual !== '0') && (
                                <div class={detailDis[0] === undefined ? 'step' : detailDis[0].status_form !== 26 && detailDis[0].status_form !== 9 && (detailDis[0].status_form === 2 || detailDis[0].status_form > 2) ? "step completed" : 'step'}>
                                    <div class="step-icon-wrap">
                                        <button class="step-icon" onClick={() => this.showCollap('Purchasing')}><FiSettings size={40} className="center" /></button>
                                    </div>
                                    <h4 class="step-title">Proses Purchasing</h4>
                                </div>
                            )}
                            <div class={detailDis[0] === undefined ? 'step' : detailDis[0].status_form !== 26 && detailDis[0].status_form > 2 ? "step completed" : 'step'} >
                                <div class="step-icon-wrap">
                                    <button class="step-icon" onClick={() => this.showCollap('Pengajuan')}><MdAssignment size={40} className="center" /></button>
                                </div>
                                <h4 class="step-title">Pengajuan Disposal</h4>
                            </div>
                            <div class={detailDis[0] === undefined ? 'step' : detailDis[0].status_form !== 26 && detailDis[0].status_form !== 9 && detailDis[0].status_form > 3 ? "step completed" : 'step'}>
                                <div class="step-icon-wrap">
                                    <button  class="step-icon" onClick={() => this.showCollap('Persetujuan')}><MdAssignment size={40} className="center" /></button >
                                </div>
                                <h4 class="step-title">Persetujuan Disposal</h4>
                            </div>
                            <div class={detailDis[0] === undefined ? 'step' : detailDis[0].status_form !== 26 && detailDis[0].status_form !== 9 && detailDis[0].status_form > 5 ? "step completed" : 'step'}>
                                <div class="step-icon-wrap">
                                    <button class="step-icon" onClick={() => this.showCollap('Eksekusi')}><FiTruck size={40} className="center" /></button>
                                </div>
                                <h4 class="step-title">Eksekusi Disposal</h4>
                            </div>
                            {detailDis[0] === undefined ? (
                                <div></div>
                            ) : detailDis.find(({nilai_jual}) => nilai_jual !== '0') && (
                                <div class={detailDis[0] === undefined ? 'step' : detailDis[0].status_form !== 26 && detailDis[0].status_form !== 9 && detailDis[0].status_form > 7 ? "step completed" : 'step'}>
                                    <div class="step-icon-wrap">
                                        <button class="step-icon" onClick={() => this.showCollap('Proses Tax and Finance')}><FiSettings size={40} className="center" /></button>
                                    </div>
                                    <h4 class="step-title">Proses Tax Dan Finance</h4>
                                </div>
                            )}
                            <div class={detailDis[0] === undefined ? 'step' : detailDis[0].status_form !== 26 && detailDis[0].status_form !== 9 && detailDis[0].status_form === 8 ? "step completed" : 'step'}>
                                <div class="step-icon-wrap">
                                    <button class="step-icon"><AiOutlineCheck size={40} className="center" /></button>
                                </div>
                                <h4 class="step-title">Selesai</h4>
                            </div>
                        </div>
                        <Collapse isOpen={this.state.collap} className="collapBody">
                            <Card className="cardCollap">
                                <CardBody>
                                    <div className='textCard1'>{this.state.tipeCol} Disposal</div>
                                    {this.state.tipeCol === 'submit' ? (
                                        <div>Tanggal submit : {detailDis[0] === undefined ? '' : moment(detailDis[0].tanggalDis === null ? detailDis[0].createdAt : detailDis[0].tanggalDis).locale('idn').format('DD MMMM YYYY ')}</div>
                                    ) : (
                                        <div></div>
                                    )}
                                    <div>Rincian Asset:</div>
                                    <Table striped bordered responsive hover className="tableDis mb-3">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Nomor Asset</th>
                                                <th>Nama Barang</th>
                                                <th>Merk/Type</th>
                                                <th>Kategori</th>
                                                <th>Nilai Buku</th>
                                                <th>Nilai Jual</th>
                                                <th>Keterangan</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {detailDis.length !== 0 && detailDis.map(item => {
                                                return (
                                                    <tr>
                                                        <th scope="row">{detailDis.indexOf(item) + 1}</th>
                                                        <td>{item.no_asset}</td>
                                                        <td>{item.nama_asset}</td>
                                                        <td>{item.merk}</td>
                                                        <td>{item.kategori}</td>
                                                        <td>{item.nilai_buku === null || item.nilai_buku === undefined ? 0 : item.nilai_buku.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                        <td>{item.nilai_jual === null || item.nilai_jual === undefined ? 0 : item.nilai_jual.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                        <td>{item.keterangan}</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </Table>
                                    {detailDis[0] === undefined || this.state.tipeCol === 'Submit' ? (
                                        <div></div>
                                    ) : (
                                        <div>
                                            <div className="mb-4 mt-2">Tracking {this.state.tipeCol} :</div>
                                            {this.state.tipeCol === 'Pengajuan' ? (
                                                <div class="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
                                                    {detailDis[0] !== undefined && detailDis[0].appForm.length && detailDis[0].appForm.slice(0).reverse().map(item => {
                                                        return (
                                                            <div class={item.status === 1 ? 'step completed' : item.status === 0 ? 'step reject' : 'step'}>
                                                                <div class="step-icon-wrap">
                                                                <button class="step-icon"><FaFileSignature size={30} className="center2" /></button>
                                                                </div>
                                                                <h4 class="step-title">{item.jabatan}</h4>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            ) : this.state.tipeCol === 'Persetujuan' ? (
                                                <div class="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
                                                    {detailDis[0] !== undefined && detailDis[0].ttdSet.length > 0 && detailDis[0].ttdSet.slice(0).reverse().map(item => {
                                                        return (
                                                            <div class={item.status === 1 ? 'step completed' : item.status === 0 ? 'step reject' : 'step'}>
                                                                <div class="step-icon-wrap">
                                                                <button class="step-icon"><FaFileSignature size={30} className="center2" /></button>
                                                                </div>
                                                                <h4 class="step-title">{item.jabatan}</h4>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            ) : this.state.tipeCol === 'Eksekusi' ? (
                                                <div class="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
                                                    <div class={detailDis[0] === undefined ? 'step' : detailDis[0].status_form !== 26 && detailDis[0].status_form !== 9 && (detailDis[0].status_form > 4 || detailDis[0].status_form === 4) ? "step completed" : 'step'}>
                                                        <div class="step-icon-wrap">
                                                        <button class="step-icon" ><FiSettings size={30} className="center2" /></button>
                                                        </div>
                                                        <h4 class="step-title">Proses Eksekusi</h4>
                                                    </div>
                                                    <div class={detailDis[0] === undefined ? 'step' : detailDis[0].status_form !== 26 && detailDis[0].status_form !== 9 && detailDis[0].status_form > 5 ? "step completed" : 'step'}>
                                                        <div class="step-icon-wrap">
                                                        <button class="step-icon" ><FaFileSignature size={30} className="center2" /></button>
                                                        </div>
                                                        <h4 class="step-title">Check Dokumen Eksekusi Oleh Asset</h4>
                                                    </div>
                                                    <div class={detailDis[0] === undefined ? 'step' : detailDis[0].status_form !== 26 && detailDis[0].status_form !== 9 && detailDis[0].status_form > 5 ? "step completed" : 'step'}>
                                                        <div class="step-icon-wrap">
                                                        <button class="step-icon" ><AiOutlineCheck size={30} className="center2" /></button>
                                                        </div>
                                                        <h4 class="step-title">Selesai</h4>
                                                    </div>
                                                </div>
                                            ) : this.state.tipeCol === 'Proses Tax and Finance' ? (
                                                <div class="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
                                                    <div class={detailDis[0] === undefined ? 'step' : detailDis[0].status_form !== 26 && detailDis[0].status_form !== 9 && (detailDis[0].status_form > 6 || detailDis[0].status_form === 6) ? "step completed" : 'step'}>
                                                        <div class="step-icon-wrap">
                                                        <button class="step-icon" ><FiUpload size={30} className="center2" /></button>
                                                        </div>
                                                        <h4 class="step-title">Upload Dokumen oleh Tax and Finance</h4>
                                                    </div>
                                                    <div class={detailDis[0] === undefined ? 'step' : detailDis[0].status_form !== 26 && detailDis[0].status_form !== 9 && detailDis[0].status_form > 7 ? "step completed" : 'step'}>
                                                        <div class="step-icon-wrap">
                                                        <button class="step-icon" ><FaFileSignature size={30} className="center2" /></button>
                                                        </div>
                                                        <h4 class="step-title">Check Dokumen Tax and Finance Oleh Asset</h4>
                                                    </div>
                                                    <div class={detailDis[0] === undefined ? 'step' : detailDis[0].status_form !== 26 && detailDis[0].status_form !== 9 && detailDis[0].status_form > 7 ? "step completed" : 'step'}>
                                                        <div class="step-icon-wrap">
                                                        <button class="step-icon" ><AiOutlineCheck size={30} className="center2" /></button>
                                                        </div>
                                                        <h4 class="step-title">Selesai</h4>
                                                    </div>
                                                </div>
                                            ) : this.state.tipeCol === 'Purchasing' && (
                                                <div class="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
                                                    <div class={detailDis[0] === undefined ? 'step' : detailDis[0].status_form === 26 || (detailDis[0].status_form > 2 || detailDis[0].status_form === 2) ? "step completed" : 'step'}>
                                                        <div class="step-icon-wrap">
                                                        <button class="step-icon" ><FiUpload size={30} className="center2" /></button>
                                                        </div>
                                                        <h4 class="step-title">Upload Dokumen oleh Purchasing</h4>
                                                    </div>
                                                    <div class={detailDis[0] === undefined ? 'step' : detailDis[0].status_form !== 26 && (detailDis[0].status_form > 2 || detailDis[0].status_form === 2) ? "step completed" : 'step'}>
                                                        <div class="step-icon-wrap">
                                                        <button class="step-icon" ><AiOutlineCheck size={30} className="center2" /></button>
                                                        </div>
                                                        <h4 class="step-title">Selesai</h4>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardBody>
                            </Card>
                        </Collapse>
                    </ModalBody>
                    <hr />
                    <div className="modalFoot ml-3">
                        {/* <Button color="primary" onClick={() => this.openModPreview({nama: 'disposal pengajuan', no: detailDis[0] !== undefined && detailDis[0].no_disposal})}>Preview</Button> */}
                        <div></div>
                        <div className="btnFoot">
                            <Button color="primary" onClick={() => {this.openModalDis(); this.showCollap('close')}}>
                                Close
                            </Button>
                        </div>
                    </div>
                </Modal>
                <Modal size="xl" isOpen={this.state.openModalDoc} toggle={this.closeProsesModalDoc}>
                <ModalHeader>
                   Kelengkapan Dokumen Eksekusi Disposal
                </ModalHeader>
                <ModalBody>
                    <Container>
                        <Alert color="danger" className="alertWrong" isOpen={this.state.upload}>
                            <div>{this.state.errMsg}</div>
                        </Alert>
                        {dataDoc !== undefined && dataDoc.map(x => {
                            return (
                                <Row className="mt-3 mb-4">
                                    <Col md={6} lg={6} >
                                        <text>{x.nama_dokumen}</text>
                                    </Col>
                                    {x.path !== null ? (
                                        <Col md={6} lg={6} >
                                            {x.status === 0 ? (
                                                <AiOutlineClose size={20} />
                                            ) : x.status === 3 ? (
                                                <AiOutlineCheck size={20} />
                                            ) : (
                                                <BsCircle size={20} />
                                            )}
                                            <button className="btnDocIo" onClick={() => this.showDokumen(x)} >{x.nama_dokumen}</button>
                                            <div>
                                                <input
                                                className="ml-4"
                                                type="file"
                                                onClick={() => this.setState({detail: x})}
                                                onChange={this.onChangeUpload}
                                                />
                                            </div>
                                        </Col>
                                    ) : (
                                        <Col md={6} lg={6} >
                                            <input
                                            className="ml-4"
                                            type="file"
                                            onClick={() => this.setState({detail: x})}
                                            onChange={this.onChangeUpload}
                                            />
                                        </Col>
                                    )}
                                </Row>
                            )
                        })}
                    </Container>
                </ModalBody>
                <ModalFooter>
                    <Button className="mr-2" color="secondary" onClick={this.closeProsesModalDoc}>
                            Close
                        </Button>
                        <Button color="primary" onClick={this.closeProsesModalDoc}>
                            Save 
                    </Button>
                </ModalFooter>
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
    tracking: state.tracking
})

const mapDispatchToProps = {
    logout: auth.logout,
    getDisposal: disposal.getDisposal,
    submitDisposal: disposal.submitDisposal,
    resetError: disposal.reset,
    deleteDisposal: disposal.deleteDisposal,
    updateDisposal: disposal.updateDisposal,
    getDocumentDis: disposal.getDocumentDis,
    uploadDocumentDis: disposal.uploadDocumentDis,
    submitEksDisposal: setuju.submitEksDisposal,
    showDokumen: pengadaan.showDokumen,
    getTrack: tracking.getTrack
}

export default connect(mapStateToProps, mapDispatchToProps)(MonitoringDisposal)
