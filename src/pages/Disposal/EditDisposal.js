/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { Component } from 'react'
import {NavbarBrand, UncontrolledDropdown, DropdownToggle, DropdownMenu, Dropdown,
    DropdownItem, Table, ButtonDropdown, Input, Button, Row, Col,
    Modal, ModalHeader, ModalBody, ModalFooter, Container, Alert, Spinner} from 'reactstrap'
import logo from "../../assets/img/logo.png"
import style from '../../assets/css/input.module.css'
import {FaSearch, FaUserCircle, FaBars, FaTrash, FaFileSignature} from 'react-icons/fa'
import {AiOutlineFileExcel, AiFillCheckCircle,  AiOutlineCheck, AiOutlineClose, AiOutlineInbox} from 'react-icons/ai'
import {BsCircle, BsBell, BsFillCircleFill} from 'react-icons/bs'
import {Formik} from 'formik'
import * as Yup from 'yup'
import disposal from '../../redux/actions/disposal'
import {connect} from 'react-redux'
import moment from 'moment'
import Pdf from "../../components/Pdf"
import pengadaan from '../../redux/actions/pengadaan'
import auth from '../../redux/actions/auth'
import {default as axios} from 'axios'
import Sidebar from "../../components/Header";
import MaterialTitlePanel from "../../components/material_title_panel";
import SidebarContent from "../../components/sidebar_content";
import placeholder from  "../../assets/img/placeholder.png"
import a from "../../assets/img/a.jpg"
import b from "../../assets/img/b.jpg"
import c from "../../assets/img/c.jpg"
import d from "../../assets/img/d.jpg"
import e from "../../assets/img/e.jpg"
import f from "../../assets/img/f.png"
import g from "../../assets/img/g.png"
import notif from '../../redux/actions/notif'
import NavBar from '../../components/NavBar'
import styleTrans from '../../assets/css/transaksi.module.css'
import NewNavbar from '../../components/NewNavbar'
import tempmail from '../../redux/actions/tempmail'
import newnotif from '../../redux/actions/newnotif'
import TrackingDisposal from '../../components/Disposal/TrackingDisposal'
import Email from '../../components/Disposal/Email'
import FormDisposal from '../../components/Disposal/FormDisposal'
import FormPersetujuan from '../../components/Disposal/FormPersetujuan'
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

class EditDisposal extends Component {
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
            dataSubmit: {},
            openSubmit: false,
            sidebarOpen: false,
            listMut: [],
            subject: '',
            message: ''
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
    }

    getMessage = (val) => {
        this.setState({ message: val.message, subject: val.subject })
        console.log(val)
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
    }

    downloadData = () => {
        const { fileName } = this.state
        const download = fileName.path.split('/')
        const cek = download[2].split('.')
        axios({
            url: `${REACT_APP_BACKEND_URL}/uploads/${download[2]}`,
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${fileName.nama_dokumen}.${cek[1]}`); //or any other extension
            document.body.appendChild(link);
            link.click();
        });
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
            this.props.uploadDocumentDis(token, detail.id, data, 'edit', 'peng')
        }
    }

    getNotif = async () => {
        const token = localStorage.getItem("token")
        await this.props.getNotif(token)
    }

    closeProsesModalDoc = () => {
        this.setState({openModalDoc: !this.state.openModalDoc})
        // this.setState({modalRinci: !this.state.modalRinci})
    }

    openProsesModalDoc = async () => {
        const token = localStorage.getItem('token')
        const { dataRinci } = this.state
        const data = {
            noId: dataRinci.id,
            noAsset: dataRinci.no_asset
        }
        await this.props.getDocumentDis(token, data, 'edit', 'pengajuan')
        this.closeProsesModalDoc()
    }

    openProsesDocEks = async () => {
        const token = localStorage.getItem('token')
        const { dataRinci } = this.state
        const data = {
            noId: dataRinci.id,
            noAsset: dataRinci.no_asset
        }
        const tipeDis = dataRinci.nilai_jual === "0" ? 'dispose' : 'sell'
        await this.props.getDocumentDis(token, data, 'disposal', tipeDis, dataRinci.npwp)
        this.closeProsesModalDoc()
    }

    prosesOpenDisposal = async (val) => {
        const token = localStorage.getItem('token')
        await this.props.getDetailDisposal(token, val.no_disposal, 'pengajuan')
        await this.props.getApproveDisposal(token, val.no_disposal, 'Disposal')
        this.openModalDis()
    }

    openModalDis = () => {
        this.setState({formDis: !this.state.formDis})
    }

    openModalReject = () => {
        this.setState({openReject: !this.state.openReject})
    }

    prosesOpenDetail = (val) => {
        this.setState({dataRinci: val})
        this.openModalRinci()
    }

    openModalRinci = () => {
        this.setState({modalRinci: !this.state.modalRinci})
    }

    prosesOpenTracking = async (val) => {
        const token = localStorage.getItem('token')
        const cekApp = {
            nama: val.kode_plant.split('').length === 4 ? 'disposal pengajuan' :  'disposal pengajuan HO',
            no: val.no_disposal
        }
        await this.props.getDetailDisposal(token, val.no_disposal, 'pengajuan')
        this.openModalTrack()
    }

    openModalTrack = () => {
        this.setState({modalTrack: !this.state.modalTrack})
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

    deleteItem = async (value) => {
        const token = localStorage.getItem('token')
        await this.props.deleteDisposal(token, value)
        this.getDataDisposal()
    }

    componentDidUpdate() {
        const {isError, isGet, isUpload, isSubmit, isSubmitDis} = this.props.disposal
        const token = localStorage.getItem('token')
        const {dataRinci} = this.state
        if (isError) {
            this.props.resetError()
            this.showAlert()
        } else if (isUpload) {
            this.props.resetError()
            this.setState({modalUpload: false})
            this.props.getDocumentDis(token, dataRinci.no_asset, 'edit', 'pengajuan')
            this.getDataDisposal()
        } else if (isSubmit) {
            this.props.resetError()
            setTimeout(() => {
                this.getDataDisposal()
             }, 1000)
        } else if (isSubmitDis === true) {
            this.setState({confirm: 'submit'})
            this.openConfirm()
            this.props.resetError()
            this.getDataDisposal()
        } else if (isSubmitDis === false) {
            this.setState({confirm: 'falsubmit'})
            this.openConfirm()
            this.props.resetError()
        }
    }

    onSearch = (e) => {
        this.setState({search: e.target.value})
        if(e.key === 'Enter'){
            this.getDataDisposal({limit: 10, search: this.state.search})
        }
    }

    componentDidMount() {
        // this.getNotif()
        this.getDataDisposal()
    }

    getDataDisposal = async () => {
        const token = localStorage.getItem('token')
        await this.props.getDisposal(token, 'editdis', 100, '',  1, 'all', 'all', 'all', 'all')
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
        this.getDataDisposal()
    }

    cekSubmit = async (val) => {
        const { detailDis } = this.props.disposal
        if (detailDis.find((item) => item.isreject === 1)) {
            this.setState({confirm: 'rejsubmit'})
            this.openConfirm()
        } else {
            this.setState({dataSubmit: val})
           this.openModalSubmit()
        }
        
    }

    openModalSubmit = () => {
        this.setState({openSubmit: !this.state.openSubmit})
    }

    saveRevisi = async (val) => {
        const token = localStorage.getItem('token')
        const { detailDis } = this.props.disposal
        const { dataRinci } = this.state
        await this.props.appRevisi(token, dataRinci.id, 'reason')
        await this.props.getDetailDisposal(token, detailDis[0].no_disposal)
        this.setState({confirm: 'update'})
        this.openConfirm()
    }

    prepSendEmail = async () => {
        const token = localStorage.getItem("token")
        const { detailDis } = this.props.disposal

        const tipe =  'revisi'

        const tempno = {
            no: detailDis[0].no_disposal,
            kode: detailDis[0].kode_plant,
            jenis: 'disposal',
            tipe: tipe,
            menu: 'Revisi (Disposal asset)'
        }
        this.setState({ tipeEmail: 'submit' })
        await this.props.getDetailDisposal(token, detailDis[0].no_disposal)
        await this.props.getApproveDisposal(token, detailDis[0].no_disposal, 'Disposal')
        await this.props.getDraftEmail(token, tempno)
        this.openDraftEmail()
    }

    openDraftEmail = () => {
        this.setState({ openDraft: !this.state.openDraft })
    }

    submitRevDis = async () => {
        const token = localStorage.getItem('token')
        const { detailDis } = this.props.disposal
        const cekTipe = detailDis[0].status_form === 3 ? 'persetujuan' : 'disposal'
        const data = {
            no: cekTipe === 'persetujuan' ? detailDis[0].no_persetujuan : detailDis[0].no_disposal,
            tipe: cekTipe
        }
        await this.props.submitRevisi(token, data)
        this.prosesSendEmail('submit')
        this.openModalDis()
        this.getDataDisposal()
        this.openDraftEmail()
        this.openModalSubmit()
        this.setState({confirm: 'submit'})
        this.openConfirm()
    }

    prosesSendEmail = async (val) => {
        const token = localStorage.getItem('token')
        const { draftEmail } = this.props.tempmail
        const { detailDis } = this.props.disposal
        const { message, subject } = this.state
        const cc = draftEmail.cc
        const tempcc = []
        for (let i = 0; i < cc.length; i++) {
            tempcc.push(cc[i].email)
        }

        const statForm = detailDis[0].status_form
        const route = statForm === 26 ? 'purchdis' : statForm === 3 ? 'persetujuan-disposal' : statForm === 4 ? 'eksdis' : statForm === 5 || statForm === 6 ? 'taxfin-disposal' : 'disposal'
        const sendMail = {
            draft: draftEmail,
            nameTo: draftEmail.to.fullname,
            to: draftEmail.to.email,
            cc: tempcc.toString(),
            message: message,
            subject: subject,
            no: detailDis[0].no_disposal,
            tipe: 'disposal',
            menu: `disposal asset`,
            proses: 'submit',
            route: route
        }
        await this.props.sendEmail(token, sendMail)
        await this.props.addNewNotif(token, sendMail)
    }

    render() {
        const {isOpen, dropOpen, dropOpenNum, detail, alert, upload, errMsg, dataRinci, listMut} = this.state
        const {dataDis, isGet, alertM, alertMsg, alertUpload, page, dataDoc, detailDis, disApp} = this.props.disposal
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const dataNotif = this.props.notif.data

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
                        {level === '5' || level === '9' ? (
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
                                <div className={style.titleDashboard1}>Edit Pengajuan Disposal</div>
                            </div>
                            <Alert color="danger" className={style.alertWrong} isOpen={this.state.alertSubmit}>
                                <div>Lengkapi rincian data asset yang ingin diajukan</div>
                            </Alert>
                            <Row className="cartDisposal2">
                                {dataDis.length === 0 ? (
                                    <Col md={8} xl={8} sm={12}>
                                        <div className="txtDisposEmpty">Disposal Data is empty</div>
                                    </Col>
                                ) : (
                                    <Col md={12} xl={12} sm={12} className="mb-5 mt-5">
                                    {dataDis.length !== 0 && dataDis.map(item => {
                                        return (
                                            <div className="cart1">
                                                <div className="navCart">
                                                    <img src={placeholder} className="cartImg" />
                                                    <div className="txtCart">
                                                        <div>
                                                            <div className="nameCart mb-3">{item.nama_asset}</div>
                                                            <div className="noCart mb-3">No asset: <text className='subCart'>{item.no_asset}</text></div>
                                                            <div className="noCart mb-3">No disposal: <text className='subCart'>D{item.no_disposal}</text></div>
                                                            <div className="noCart mb-3">Status lampiran: <text className='subCart'>{item.docAsset.find(({status, tipe}) => (status === 0 && tipe !== 'purch')) !== undefined ? item.docAsset.filter(data => { return data.status === 0 }).length + " Dokumen Reject" : item.docAsset.find(({divisi, tipe}) => (divisi === '0' && tipe !== 'purch')) !== undefined ? item.docAsset.filter(data => { return data.divisi === '0' }).length + " Dokumen Reject" : "Tidak ada dokumen yang direject"}</text></div>
                                                            <div className="noCart mb-3">Alasan reject: <text className='subCart'>{item.reason}</text></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="footCart">
                                                    <Button color="primary" onClick={() => this.openModalRinci(this.setState({dataRinci: item}))}>Rincian</Button>
                                                    <Button color="success" className='ml-2' onClick={() => this.cekSubmit(item)}>Submit</Button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </Col>
                                )}
                            </Row>
                        </div>
                        ) : (
                            <div className={style.headMaster}>
                                <div className={style.titleDashboard1}>Anda tidak memiliki akses dihalaman ini</div>
                            </div>
                        )}
                        </div>
                    </MaterialTitlePanel>
                </Sidebar> */}
                <div className={styleTrans.app}>
                    <NewNavbar handleSidebar={this.prosesSidebar} handleRoute={this.goRoute} />

                    <div className={`${styleTrans.mainContent} ${this.state.sidebarOpen ? styleTrans.collapsedContent : ''}`}>
                        <h2 className={styleTrans.pageTitle}>Revisi Disposal Asset</h2>
                        <div className={styleTrans.searchContainer}>
                            <div className='rowCenter'>
                            </ div>
                            <input
                                type="text"
                                placeholder="Search..."
                                onChange={this.onSearch}
                                value={this.state.search}
                                onKeyPress={this.onSearch}
                                className={styleTrans.searchInput}
                            />
                        </div>

                        <table className={styleTrans.table}>
                            <thead>
                                <tr>
                                    <th>NO</th>
                                    <th>NO.AJUAN</th>
                                    <th>AREA</th>
                                    <th>KODE PLANT</th>
                                    <th>COST CENTER</th>
                                    <th>TANGGAL AJUAN</th>
                                    <th>STATUS</th>
                                    <th>OPSI</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataDis.length !== 0 && dataDis.map(item => {
                                    return (
                                        <tr className={item.status_reject === 0 ? 'note' : item.status_transaksi === 0 ? 'fail' : item.status_reject === 1 && 'bad'}>
                                            <td>{dataDis.indexOf(item) + 1}</td>
                                            <td>{item.no_disposal}</td>
                                            <td>{item.area}</td>
                                            <td>{item.kode_plant}</td>
                                            <td>{item.cost_center}</td>
                                            <td>{moment(item.tanggalDis).format('DD MMMM YYYY')}</td>
                                            <td>{item.history !== null && item.history.split(',').reverse()[0]}</td>
                                            <td>
                                                <Button 
                                                className="mr-1 mt-1" 
                                                color="primary" 
                                                onClick={() => this.prosesOpenDisposal(item)}>
                                                    Proses
                                                </Button>
                                                <Button
                                                className='mt-1'
                                                color='warning'
                                                onClick={() => this.prosesOpenTracking(item)}
                                                >
                                                    Tracking
                                                </Button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        {dataDis.length === 0 && (
                            <div className={style.spinCol}>
                                <AiOutlineInbox size={50} className='secondary mb-4' />
                                <div className='textInfo'>Data ajuan tidak ditemukan</div>
                            </div>
                        )}
                    </div>
                </div>
                <Modal isOpen={this.state.formDis} toggle={this.openModalDis} size="xl" className='xl'>
                    <ModalBody>
                        <div className="preDis">
                            <text className='bold'>PT. Pinus Merah Abadi</text>
                            <text></text>
                        </div>
                        <div className="modalDis">
                            <text className="titleModDis">FORM PENGAJUAN DISPOSAL ASET</text>
                        </div>
                        <div className="mb-2 bold">
                            <text className="txtTrans">
                                {detailDis[0] !== undefined && detailDis[0].area}
                            </text>, 
                            {moment(detailDis[0] !== undefined && detailDis[0].tanggalDis).locale('idn').format('DD MMMM YYYY ')}
                        </div>
                        <Row>
                            <Col md={2} className='bold'>
                            Hal
                            </Col>
                            <Col md={10} className='bold'>
                            : Pengajuan Disposal Asset
                            </Col>
                        </Row>
                        <Row className="mb-2 bold">
                            <Col md={2}>
                            {detailDis[0] === undefined ? "" :
                            detailDis[0].status_depo === "Cabang Scylla" || detailDis[0].status_depo === "Cabang SAP" ? "Cabang" : "Depo"}
                            </Col>
                            <Col md={10} className="txtTrans">
                            : {detailDis[0] !== undefined && detailDis[0].area + ' - ' + detailDis[0].cost_center} 
                            </Col>
                        </Row>
                        <div>Kepada Yth.</div>
                        <div>Bpk/Ibu Pimpinan</div>
                        <div className="mb-2">Di tempat</div>
                        <div>Dengan Hormat,</div>
                        <div className="mb-3">Dengan surat ini kami mengajukan permohonan disposal aset dengan perincian sbb :</div>
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
                                    <th>Opsi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detailDis.length !== 0 && detailDis.map(item => {
                                    return (
                                        <tr>
                                            <th scope="row" >{detailDis.indexOf(item) + 1}</th>
                                            {/* <td onClick={() => this.openDataRinci(item)}>{item.no_asset}</td> */}
                                            <td>{item.no_asset}</td>
                                            <td>{item.nama_asset}</td>
                                            <td>{item.merk}</td>
                                            <td>{item.kategori}</td>
                                            <td>{item.nilai_buku === null || item.nilai_buku === undefined ? 0 : item.nilai_buku.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                            <td>{item.nilai_jual === null || item.nilai_jual === undefined ? 0 : item.nilai_jual.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                            <td>{item.keterangan}</td>
                                            <td >
                                                {item.isreject === 1 ? 'Perlu Diperbaiki' : 'Telah diperbaiki'}
                                                <Button color='success' className='ml-2' onClick={() => this.prosesOpenDetail(item)}>Proses</Button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                        <div className="mb-3">Demikianlah hal yang kami sampaikan, atas perhatiannya kami mengucapkan terima kasih</div>
                        <Table bordered responsive className="tabPreview">
                            <thead>
                                <tr>
                                    <th className="buatPre" colSpan={disApp.pembuat?.length || 1}>Dibuat oleh,</th>
                                    <th className="buatPre" colSpan={
                                        disApp.pemeriksa?.filter(item => item.id_role !== 2 && item.jabatan !== 'asset').length || 1
                                    }>Diperiksa oleh,</th>
                                    <th className="buatPre" colSpan={disApp.penyetuju?.length || 1}>Disetujui oleh,</th>
                                </tr>
                                <tr>
                                    {disApp.pembuat?.map(item => (
                                        <th className="headPre">
                                            <div>{item.status === 0 ? 'Reject' : item.status === 1 ? moment(item.updatedAt).format('LL') : '-'}</div>
                                            <div>{item.nama ?? '-'}</div>
                                        </th>
                                    ))}
                                    {disApp.pemeriksa?.filter(item => item.id_role !== 2 && item.jabatan !== 'asset').map(item => (
                                        <th className="headPre">
                                            <div>{item.status === 0 ? 'Reject' : item.status === 1 ? moment(item.updatedAt).format('LL') : '-'}</div>
                                            <div>{item.nama ?? '-'}</div>
                                        </th>
                                    ))}
                                    {disApp.penyetuju?.map(item => (
                                        <th className="headPre">
                                            <div>{item.status === 0 ? 'Reject' : item.status === 1 ? moment(item.updatedAt).format('LL') : '-'}</div>
                                            <div>{item.nama ?? '-'}</div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {disApp.pembuat?.map(item => (
                                        <td className="footPre">{item.jabatan ?? '-'}</td>
                                    ))}
                                    {disApp.pemeriksa?.filter(item => item.id_role !== 2 && item.jabatan !== 'asset').map(item => (
                                        <td className="footPre">{item.jabatan ?? '-'}</td>
                                    ))}
                                    {disApp.penyetuju?.map(item => (
                                        <td className="footPre">{item.jabatan ?? '-'}</td>
                                    ))}
                                </tr>
                            </tbody>
                        </Table>
                    </ModalBody>
                    <hr />
                    <div className="modalFoot ml-3">
                        <div className="btnFoot">
                            <FormDisposal />
                            {detailDis.length > 0 && detailDis[0].status_form !== 26 && detailDis[0].status_form !== 9 && detailDis[0].status_form >= 3 && (
                                <FormPersetujuan />
                            )}
                        </div>
                        
                        <div className="btnFoot">
                            <Button className='mr-2' color="primary" onClick={this.cekSubmit}>
                                Submit
                            </Button>
                            <Button className="" color="secondary" onClick={this.openModalDis}>
                                Close
                            </Button>
                        </div>
                    </div>
                </Modal>
                <Modal isOpen={this.state.modalRinci} toggle={this.openModalRinci} size="xl">
                    <ModalHeader>
                        Rincian
                    </ModalHeader>
                    <ModalBody>
                        <div className="mainRinci">
                            <div className="leftRinci">
                                <img src={placeholder} className="imgRinci" />
                                <div className="secImgSmall">
                                    <button className="btnSmallImg">
                                        <img src={placeholder} className="imgSmallRinci" />
                                    </button>
                                </div>
                            </div>
                            <Formik
                            initialValues = {{
                                keterangan: dataRinci.keterangan === null ? '' : dataRinci.keterangan,
                                nilai_jual: dataRinci.nilai_jual,
                                merk: dataRinci.merk
                            }}
                            validationSchema = {disposalSchema}
                            onSubmit={(values) => {this.updateDataDis(values)}}
                            >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                                <div className="rightRinci">
                                    <div>
                                        <div className="titRinci">{dataRinci.nama_asset}</div>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Area</Col>
                                            <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.area} disabled /></Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>No Asset</Col>
                                            <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.no_asset} disabled /></Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Merk / Type</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                type= "text" 
                                                className="inputRinci"
                                                value={values.merk}
                                                disabled
                                                onBlur={handleBlur("merk")}
                                                onChange={handleChange("merk")}
                                                />
                                            </Col>
                                        </Row>
                                        {errors.merk ? (
                                            <text className={style.txtError}>{errors.merk}</text>
                                        ) : null}
                                        <Row className="mb-2">
                                            <Col md={3}>Kategori</Col>
                                            <Col md={9} className="katCheck">: 
                                                <div className="katCheck">
                                                    <div className="ml-2"><input type="checkbox" checked={dataRinci.kategori === 'IT' ? true : false} /> IT</div>
                                                    <div className="ml-3"><input type="checkbox" checked={dataRinci.kategori === 'NON IT' ? true : false} /> Non IT</div>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Status Area</Col>
                                            <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.status_depo} disabled /></Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Cost Center</Col>
                                            <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.cost_center} disabled /></Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Nilai Buku</Col>
                                            <Col md={9} className="colRinci">:  <Input className="inputRinci" disabled value={dataRinci.nilai_buku === null || dataRinci.nilai_buku === undefined ? 0 : dataRinci.nilai_buku.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} /></Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col  md={3}>Nilai Jual</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                className="inputRinci" 
                                                value={values.nilai_jual === null ? values.nilai_jual : values.nilai_jual.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} 
                                                onBlur={handleBlur("nilai_jual")}
                                                onChange={handleChange("nilai_jual")}
                                                disabled={true}
                                                />
                                            </Col>
                                        </Row>
                                        {errors.nilai_jual ? (
                                            <text className={style.txtError}>{errors.nilai_jual}</text>
                                        ) : null}
                                        <Row className="mb-4 rowRinci">
                                            <Col md={3}>Keterangan</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                className="inputRinci" 
                                                type="text"
                                                disabled={level !== 5 ? true : false}
                                                value={values.keterangan} 
                                                onBlur={handleBlur("keterangan")}
                                                onChange={handleChange("keterangan")}
                                                />
                                            </Col>
                                        </Row>
                                        {errors.keterangan ? (
                                            <text className={style.txtError}>{errors.keterangan}</text>
                                        ) : null}
                                    </div>
                                    <div className="footRinci1 mt-3">
                                        <div className='rowGeneral'>
                                            <Button className="" size="md" color="success" onClick={this.openProsesModalDoc}>Dokumen Ajuan</Button>
                                            {(dataRinci.status_form !== 26 && dataRinci.status_form !== 9 && dataRinci.status_form !== 15) && (dataRinci.status_form >= 4) && (
                                                <Button className="ml-2" size="md" color="warning" onClick={this.openProsesDocEks}>Dokumen Eksekusi</Button>
                                            )}
                                        </div>
                                        <div>
                                            {/* <Button className="btnFootRinci1" size="lg" color="primary" onClick={handleSubmit}>Save</Button> */}
                                            <Button className="" size="md" color="primary" onClick={this.saveRevisi}>Save</Button>
                                            <Button className="ml-2" size="md" color="secondary" onClick={() => this.openModalRinci()}>Close</Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            </Formik>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalTrack} toggle={() => this.openModalTrack()} size="xl">
                    <TrackingDisposal />
                    <hr />
                    <div className="modalFoot ml-3">
                        {/* <Button color="primary" onClick={() => this.openModPreview({nama: 'disposal pengajuan', no: detailDis[0] !== undefined && detailDis[0].no_disposal})}>Preview</Button> */}
                        <div></div>
                        <div className="btnFoot">
                            <Button color="primary" onClick={() => this.openModalTrack()}>
                                Close
                            </Button>
                        </div>
                    </div>
                </Modal>
                <Modal isOpen={
                    this.props.disposal.isLoading ||
                    this.props.tempmail.isLoading ||
                    this.props.newnotif.isLoading ? true : false
                    } size="sm">
                        <ModalBody>
                        <div>
                            <div className={style.cekUpdate}>
                                <Spinner />
                                <div sucUpdate>Waiting....</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
                <Modal size="xl" isOpen={this.state.openModalDoc} toggle={this.closeProsesModalDoc}>
                <ModalHeader>
                   Kelengkapan Dokumen
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
                                        <Col md={6} lg={6}>
                                            <div className="lsDoc">
                                                {x.status === 0 ? (
                                                    <AiOutlineClose size={20} />
                                                ) : x.status === 3 ? (
                                                    <AiOutlineCheck size={20} />
                                                ) : (
                                                    <BsCircle size={20} />
                                                )}
                                                {x.divisi === '0' ? (
                                                    <AiOutlineClose size={20} />
                                                ) : x.divisi === '3' ? (
                                                    <AiOutlineCheck size={20} />
                                                ) : (
                                                    <BsCircle size={20} />
                                                )}
                                                <button className="btnDocIo" onClick={() => this.showDokumen(x)} >{x.nama_dokumen}</button>
                                            </div>
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
                            <Button color="success" onClick={() => this.downloadData()}>Download</Button>
                        </div>
                        <Button color="primary" onClick={() => this.setState({openPdf: false})}>Close</Button>
                    </div>
                </ModalBody>
            </Modal>
                <Modal isOpen={this.state.modalConfirm} toggle={this.openConfirm} size="sm">
                    <ModalBody>
                        {this.state.confirm === 'edit' ? (
                        <div className={style.cekUpdate}>
                            <AiFillCheckCircle size={80} className={style.green} />
                            <div className={[style.sucUpdate, style.green]}>Berhasil Update Dokumen</div>
                        </div>
                        ) : this.state.confirm === 'submit' ? (
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Submit</div>
                            </div>
                        ) : this.state.confirm === 'update' ? (
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Update</div>
                            </div>
                        ) : this.state.confirm === 'rejsubmit' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Submit</div>
                                <div className="errApprove mt-2">Pastikan data telah diperbaiki</div>
                            </div>
                            </div>
                        ) : this.state.confirm === 'falsubmit' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Submit</div>
                                <div className="errApprove mt-2">Terjadi kesalahan pada sistem</div>
                            </div>
                            </div>
                        ) : (
                            <div></div>
                        )}
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.openSubmit} toggle={this.openModalSubmit} centered={true}>
                    <ModalBody>
                        <div className={style.modalApprove}>
                            <div>
                                <text>
                                    Anda yakin untuk submit revisi ?
                                </text>
                            </div>
                            <div className={style.btnApprove}>
                                <Button color="primary" onClick={() => this.prepSendEmail()}>Ya</Button>
                                <Button color="secondary" onClick={this.openModalSubmit}>Tidak</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.openDraft} size='xl'>
                    <ModalHeader>Email Pemberitahuan</ModalHeader>
                    <ModalBody>
                        <Email handleData={this.getMessage}/>
                        <div className={style.foot}>
                            <div></div>
                            <div>
                                <Button
                                    disabled={this.state.message === '' ? true : false} 
                                    className="mr-2"
                                    onClick={ () => this.submitRevDis()} 
                                    color="primary"
                                >
                                    Submit & Send Email
                                </Button>
                                <Button className="mr-3" onClick={this.openDraftEmail}>Cancel</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </>
        )
    }
}

const mapStateToProps = state => ({
    disposal: state.disposal,
    pengadaan: state.pengadaan,
    notif: state.notif,
    tempmail: state.tempmail,
    newnotif: state.newnotif
})

const mapDispatchToProps = {
    logout: auth.logout,
    getDisposal: disposal.getNewDisposal,
    submitDisposal: disposal.submitDisposal,
    resetError: disposal.reset,
    deleteDisposal: disposal.deleteDisposal,
    updateDisposal: disposal.updateDisposal,
    getDocumentDis: disposal.getDocumentDis,
    uploadDocumentDis: disposal.uploadDocumentDis,
    showDokumen: pengadaan.showDokumen,
    submitEditDis: disposal.submitEditDis,
    getNotif: notif.getNotif,
    getDetailDisposal: disposal.getDetailDisposal,
    getApproveDisposal: disposal.getApproveDisposal,
    getDraftEmail: tempmail.getDraftEmail,
    sendEmail: tempmail.sendEmail,
    addNewNotif: newnotif.addNewNotif,
    appRevisi: disposal.appRevisi,
    submitRevisi: disposal.submitRevisi
}

export default connect(mapStateToProps, mapDispatchToProps)(EditDisposal)
