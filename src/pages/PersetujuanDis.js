/* eslint-disable jsx-a11y/no-distracting-elements */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react'
import { Container, Collapse, Nav, Navbar,
    NavbarToggler, NavbarBrand, NavItem, NavLink,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, Dropdown,
    DropdownItem, Table, ButtonDropdown, Input, Button, Col,
    Alert, Spinner, Row, ModalBody, ModalHeader, Modal, ModalFooter} from 'reactstrap'
import logo from "../assets/img/logo.png"
import style from '../assets/css/input.module.css'
import {FaSearch, FaUserCircle, FaBars, FaCartPlus} from 'react-icons/fa'
import {BsCircle, BsDashCircleFill, BsFillCircleFill} from 'react-icons/bs'
import { AiOutlineCheck, AiOutlineClose, AiFillCheckCircle} from 'react-icons/ai'
import {Formik} from 'formik'
import * as Yup from 'yup'
import Pdf from "../components/Pdf"
import asset from '../redux/actions/asset'
import pengadaan from '../redux/actions/pengadaan'
import approve from '../redux/actions/approve'
import {connect} from 'react-redux'
import moment from 'moment'
import TablePeng from '../components/TablePeng'
import TablePdf from "../components/Table"
import auth from '../redux/actions/auth'
import setuju from '../redux/actions/setuju'
import {default as axios} from 'axios'
import Sidebar from "../components/Header";
import MaterialTitlePanel from "../components/material_title_panel";
import SidebarContent from "../components/sidebar_content";
import placeholder from  "../assets/img/placeholder.png"
import disposal from '../redux/actions/disposal'
import notif from '../redux/actions/notif'
import a from "../assets/img/a.jpg"
import b from "../assets/img/b.jpg"
import c from "../assets/img/c.jpg"
import d from "../assets/img/d.jpg"
import e from "../assets/img/e.jpg"
import f from "../assets/img/f.png"
import g from "../assets/img/g.png"
import NavBar from '../components/NavBar'
const {REACT_APP_BACKEND_URL} = process.env

const disposalSchema = Yup.object().shape({
    merk: Yup.string().validateSync(""),
    keterangan: Yup.string().required('must be filled'),
    nilai_jual: Yup.string().required()
})

const alasanSchema = Yup.object().shape({
    alasan: Yup.string().required()
});

const alasanDisSchema = Yup.object().shape({
    alasan: Yup.string().required(),
    jenis_reject: Yup.string().required()
});

class Disposal extends Component {
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
            dropApp: false,
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
            rinciAdmin: false,
            upload: false,
            errMsg: '',
            fileUpload: '',
            limit: 12,
            search: '',
            formDis: false,
            openDoc: false,
            modalRinci: false,
            dataRinci: {},
            detailDis: [],
            nama: "Pilih Approval",
            openReject: false,
            openApprove: false,
            preview: false,
            openPdf: false,
            idDoc: 0,
            openApproveDis: false,
            openRejectDis: false,
            fileName: {},
            dataApp: {},
            preset: false,
            formset: false,
            listMut: [],
            listStat: [],
            newDis: [],
            detailData: [],
            view: ''
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
    }

    getApproveDis = async (value) => {
        this.setState({nama: value.nama})
        const token = localStorage.getItem('token')
        await this.props.getApproveDisposal(token, value.no, value.nama)
    }

    openModalRinci = () => {
        this.setState({modalRinci: !this.state.modalRinci})
    }

    statusApp = (val) => {
        const { listStat } = this.state
        listStat.push(val)
        this.setState({listStat: listStat})
    }

    statusRej = (val) => {
        const { listStat } = this.state
        const data = []
        for (let i = 0; i < listStat.length; i++) {
            if (listStat[i] === val) {
                data.push()
            } else {
                data.push(listStat[i])
            }
        }
        this.setState({listStat: data})
    }


    openRinciAdmin = () => {
        this.setState({rinciAdmin: !this.state.rinciAdmin})
    }

    openPreview = () => {
        this.setState({preview: !this.state.preview})
    }

    openModPreview = async (value) => {
        const token = localStorage.getItem('token')
        await this.props.getApproveDisposal(token, value.no, value.nama)
        this.openPreview()
    }

    goCartDispos = () => {
        this.props.history.push('/cart')
    }

    closeProsesModalDoc = () => {
        this.setState({openDoc: !this.state.openDoc})
    }

    openModalApproveDis = () => {
        this.setState({openApproveDis: !this.state.openApproveDis})
    }
    openModalRejectDis = () => {
        this.setState({openRejectDis: !this.state.openRejectDis})
    }

    openModalReject = () => {
        this.setState({openReject: !this.state.openReject})
    }

    openModalApprove = () => {
        this.setState({openApprove: !this.state.openApprove})
    }

    approveDokumen = async () => {
        const {fileName} = this.state
        const token = localStorage.getItem('token')
        await this.props.approveDocDis(token, fileName.id)
        this.setState({openApproveDis: !this.state.openApproveDis})
        this.openModalPdf()
    }

    rejectDokumen = async (value) => {
        const {fileName} = this.state
        const token = localStorage.getItem('token')
        await this.props.rejectDocDis(token, fileName.id, value)
        this.setState({openRejectDis: !this.state.openRejectDis})
        this.openModalPdf()
    }

    openProsesModalDoc = async (val) => {
        const token = localStorage.getItem('token')
        await this.props.getDocumentDis(token, val, 'disposal', 'pengajuan')
        this.closeProsesModalDoc()
    }


    approveDisposal = async (value) => {
        const token = localStorage.getItem('token')
        await this.props.approveDisposal(token, value)
        this.getDataDisposal()
    }

    rejectDisposal = async (value) => {
        const token = localStorage.getItem('token')
        const {detailDis} = this.props.disposal
        const list  = this.state.listMut
        const { listStat } = this.state
        if (detailDis.length !== list.length && value.value.jenis_reject === "batal") {
            this.openConfirm(this.setState({confirm: 'rejbatal'}))
        } else {
            let reason = ''
            let status = '1'
            for (let i = 0; i < listStat.length; i++) {
                reason += listStat[i] + '.'
                if (listStat[i] === 'Nilai jual tidak sesuai') {
                    status += '2'
                }
            }
            const data = {
                alasan: reason + value.value.alasan,
                listMut: list
            }
            await this.props.rejectSetDisposal(token, detailDis[0].no_persetujuan, data, value.value.jenis_reject, status)
            await this.props.notifDisposal(token, detailDis[0].no_persetujuan, 'reject', value.value.jenis_reject, null, 'persetujuan')
            this.getDataDisposal()
            this.openModalReject()
            this.openFormSet()
            this.openConfirm(this.setState({confirm: 'reject'}))
        }
    }

    showAlert = () => {
        this.setState({alert: true, modalEdit: false, modalAdd: false, modalUpload: false })
       
         setTimeout(() => {
            this.setState({
                alert: false
            })
         }, 10000)
    }

    next = async () => {
        const { page } = this.props.asset
        const token = localStorage.getItem('token')
        await this.props.nextPage(token, page.nextLink)
    }

    prev = async () => {
        const { page } = this.props.asset
        const token = localStorage.getItem('token')
        await this.props.nextPage(token, page.prevLink)
    }

    uploadAlert = () => {
        this.setState({upload: true, modalUpload: false })
       
         setTimeout(() => {
            this.setState({
                upload: false
            })
         }, 10000)
    }

    getDetailDisposal = async (val) => {
        const { detailDis } = this.props.disposal
        const token = localStorage.getItem('token')
        await this.props.getApproveDisposal(token, val, 'disposal pengajuan')
        const detail = []
        for (let i = 0; i < detailDis.length; i++) {
            if (detailDis[i].no_disposal === val) {
                detail.push(detailDis[i])
            }
        }
        this.setState({detailData: detail})
        this.openModalDis()
    }

    toggle = () => {
        this.setState({isOpen: !this.state.isOpen})
    }

    openConfirm = () => {
        this.setState({modalConfirm: !this.state.modalConfirm})
    }

    openModalDis = () => {
        this.setState({formDis: !this.state.formDis})
    }

    dropDown = () => {
        this.setState({dropOpen: !this.state.dropOpen})
    }
    dropApp = () => {
        this.setState({dropApp: !this.state.dropApp})
    }
    dropOpen = () => {
        this.setState({dropOpenNum: !this.state.dropOpenNum})
    }
    onSetSidebarOpen = () => {
        this.setState({ sidebarOpen: !this.state.sidebarOpen });
    }
    openModalAdd = () => {
        this.setState({modalAdd: !this.state.modalAdd})
    }
    openModalEdit = () => {
        this.setState({modalEdit: !this.state.modalEdit})
    }
    openModalUpload = () => {
        this.setState({modalUpload: !this.state.modalUpload})
    }
    openModalDownload = () => {
        this.setState({modalUpload: !this.state.modalUpload})
    }

    openModalPdf = () => {
        this.setState({openPdf: !this.state.openPdf})
    }

    addDokumen = async (values) => {
        const token = localStorage.getItem("token")
        await this.props.addDokumen(token, values)
        const {isAdd} = this.props.asset
        if (isAdd) {
            this.setState({confirm: 'add'})
            this.openConfirm()
            this.openModalAdd()
            setTimeout(() => {
                this.getDataAsset()
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

    approveSet = async e => {
        const {detailDis} = this.props.disposal
        const token = localStorage.getItem("token")
        const data = new FormData()
        data.append('document', e.target.files[0])
        await this.props.approveSetDisposal(token, detailDis[0].no_persetujuan, data)
        await this.props.notifDisposal(token, detailDis[0].no_persetujuan, 'approve', null, null, 'persetujuan')
        this.getDataDisposal()
        this.openFormSet()
        this.openConfirm(this.setState({confirm: 'approve'}))
    }

    approveSetDis = async () => {
        const {detailDis} = this.props.disposal
        const token = localStorage.getItem("token")
        await this.props.approveSetDisposal(token, detailDis[0].no_persetujuan)
        await this.props.notifDisposal(token, detailDis[0].no_persetujuan, 'approve', null, null, 'persetujuan')
        this.getDataDisposal()
        this.openModalApprove()
        this.openFormSet()
        this.openConfirm(this.setState({confirm: 'approve'}))
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

    goFormSet = async (val) => {
        const token = localStorage.getItem('token')
        await this.props.getSetDisposal(token, 100, "", 1, val, 'persetujuan')
        this.props.history.push('/formset')
    }

    chekApp = (val) => {
        const { listMut } = this.state
        listMut.push(val)
        this.setState({listMut: listMut})
    }

    chekRej = (val) => {
        const { listMut } = this.state
        const data = []
        for (let i = 0; i < listMut.length; i++) {
            if (listMut[i] === val) {
                data.push()
            } else {
                data.push(listMut[i])
            }
        }
        this.setState({listMut: data})
    }

    onChangeHandler = e => {
        const {size, type} = e.target.files[0]
        if (size >= 5120000) {
            this.setState({errMsg: "Maximum upload size 5 MB"})
            this.uploadAlert()
        } else if (type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && type !== 'application/vnd.ms-excel' ){
            this.setState({errMsg: 'Invalid file type. Only excel files are allowed.'})
            this.uploadAlert()
        } else {
            this.setState({fileUpload: e.target.files[0]})
        }
    }

    componentDidUpdate() {
        const {isError, isUpload, isExport} = this.props.asset
        const {isAdd, isDelete, isAppDoc, isRejDoc} = this.props.disposal
        const {errorRej, errorApp} = this.props.setuju
        const token = localStorage.getItem('token')
        const { dataRinci } = this.state
        if (isError) {
            this.props.resetError()
            this.showAlert()
        } else if (isUpload) {
            setTimeout(() => {
                this.props.resetError()
                this.setState({modalUpload: false})
             }, 2000)
             setTimeout(() => {
                this.getDataAsset()
             }, 2100)
        } else if (isAdd) {
            setTimeout(() => {
                this.props.resetErrorDis()
             }, 2000)
        } else if (isExport) {
            this.props.resetError()
            this.DownloadMaster()
        } else if (isAppDoc === true || isRejDoc === true) {
            setTimeout(() => {
                this.props.resetDis()
             }, 1000)
             setTimeout(() => {
                this.props.getDocumentDis(token, dataRinci.no_asset)
             }, 1100)
        } if (errorRej) {
            this.openConfirm(this.setState({confirm: 'rejReject'}))
            this.props.resetAppSet()
        } else if (errorApp) {
            this.openConfirm(this.setState({confirm: 'rejApprove'}))
            this.props.resetAppSet()
        }
    }

    onSearch = async (e) => {
        this.setState({search: e.target.value})
        const token = localStorage.getItem("token")
        if(e.key === 'Enter'){
            await this.props.getAsset(token, 10, e.target.value, 1)
            // this.getDataAsset({limit: 10, search: this.state.search})
        }
    }

    componentDidMount() {
        this.getDataDisposal()
    }

    getDataAsset = async (value) => {
        const token = localStorage.getItem("token")
        const { page } = this.props.asset
        const search = value === undefined ? '' : this.state.search
        const limit = value === undefined ? this.state.limit : value.limit
        await this.props.getAsset(token, limit, search, page.currentPage)
        this.setState({limit: value === undefined ? 12 : value.limit})
    }

    getDataDisposal = async (value) => {
        const token = localStorage.getItem("token")
        const { page } = this.props.disposal
        const search = value === undefined ? '' : this.state.search
        const limit = value === undefined ? this.state.limit : value.limit
        await this.props.getDisposal(token, limit, search, page.currentPage, 3, 'persetujuan')
        this.setState({limit: value === undefined ? 12 : value.limit})
        this.changeView('available')
    }

    changeView = (val) => {
        const newDis = []
        const { dataDis, noDis } = this.props.disposal
        const role = localStorage.getItem('role')
        const level = localStorage.getItem('level')
        if (val === 'available') {
            for (let i = 0; i < noDis.length; i++) {
                const index = dataDis.indexOf(dataDis.find(({no_persetujuan}) => no_persetujuan === noDis[i]))
                if (dataDis[index] !== undefined) {
                    const app = dataDis[index].ttdSet
                    const find = app.indexOf(app.find(({jabatan}) => jabatan === role))
                    if (find === app.length - 1) {
                        if (app[find] !== undefined && (app[find].status === null)) {
                            newDis.push(dataDis[index])
                        }
                    } else if (find === 0 || find === '0') {
                        if (app[find] !== undefined && app[find + 1].status === 1 && app[find].status === null) {
                            newDis.push(dataDis[index])
                        }
                    } else {
                        if (app[find] !== undefined && app[find + 1].status === 1 && app[find - 1].status === null && app[find].status === null) {
                            newDis.push(dataDis[index])
                        }
                    }
                }
            }
            this.setState({view: val, newDis: newDis})
        } else if (val === 'revisi') {
            for (let i = 0; i < noDis.length; i++) {
                const index = dataDis.indexOf(dataDis.find(({no_persetujuan}) => no_persetujuan === noDis[i]))
                const resdis = dataDis[index]
                const app = dataDis[index].ttdSet
                const find = app.indexOf(app.find(({jabatan}) => jabatan === role))
                if (resdis !== undefined && resdis.status_reject === 4) {
                    if (app[find] !== undefined && app[find].status === 0) {
                        newDis.push(resdis)
                    }
                }
            }
            this.setState({view: val, newDis: newDis})
        } else if (val === 'reject') {
            for (let i = 0; i < noDis.length; i++) {
                const index = dataDis.indexOf(dataDis.find(({no_persetujuan}) => no_persetujuan === noDis[i]))
                const resdis = dataDis[index]
                if (resdis !== undefined && resdis.status_reject !== null) {
                    newDis.push(resdis)
                }
            }
            this.setState({view: val, newDis: newDis})
        } else {
            for (let i = 0; i < noDis.length; i++) {
                const index = dataDis.indexOf(dataDis.find(({no_persetujuan}) => no_persetujuan === noDis[i]))
                if (dataDis[index] !== undefined) {
                    newDis.push(dataDis[index])
                }
            }
            this.setState({view: val, newDis: newDis})
        }
    }

    menuButtonClick(ev) {
        ev.preventDefault();
        this.onSetOpen(!this.state.open);
    }

    onSetOpen(open) {
        this.setState({ open });
    }

    addDisposal = async (value) => {
        const token = localStorage.getItem("token")
        await this.props.addDisposal(token, value)
        this.getDataAsset()
    }

    modalPers = () => {
        this.setState({preset: !this.state.preset})
    }

    persetujuanDisposal = async (value) => {
        const token = localStorage.getItem('token')
        await this.props.getDetailDis(token, value, 'persetujuan')
        await this.props.getApproveSetDisposal(token, value, 'disposal persetujuan')
        this.modalPers()
    }

    prosesSetDisposal = async (value) => {
        const token = localStorage.getItem('token')
        await this.props.getDetailDis(token, value, 'persetujuan')
        await this.props.getApproveSetDisposal(token, value, 'disposal persetujuan')
        this.openFormSet()
    }

    openFormSet = () => {
        this.setState({formset: !this.state.formset})
    }

    render() {
        const {listMut, alert, upload, errMsg, newDis, listStat, detailData} = this.state
        const {dataAsset, alertM, alertMsg, alertUpload} = this.props.asset
        const page = this.props.disposal.page
        const role = localStorage.getItem('role')
        const { dataDis, noDis, dataDoc, detailDis } = this.props.disposal
        const appPeng = this.props.disposal.disApp
        const { disApp } = this.props.setuju
        const { dataName } = this.props.approve
        const {dataRinci} = this.state
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
                <Sidebar {...sidebarProps}>
                    <MaterialTitlePanel title={contentHeader}>
                        <div className={style.backgroundLogo}>
                            <Alert color="danger" className={style.alertWrong} isOpen={alert}>
                                <div>{alertMsg}</div>
                                <div>{alertM}</div>
                                {alertUpload !== undefined && alertUpload.map(item => {
                                    return (
                                        <div>{item}</div>
                                    )
                                })}
                            </Alert>
                            <Alert color="danger" className={style.alertWrong} isOpen={upload}>
                                <div>{errMsg}</div>
                            </Alert>
                            <div className={style.bodyDashboard}>
                                <div className={style.headMaster}> 
                                    <div className={style.titleDashboard}>Persetujuan Disposal Asset</div>
                                </div>
                                <div className={[style.secEmail]}>
                                    <div className="mt-5">
                                        <Input type="select" value={this.state.view} onChange={e => this.changeView(e.target.value)}>
                                            <option value="all">All</option>
                                            <option value="available">Available Approve</option>
                                            <option value="revisi">Available Reapprove (Revisi)</option>
                                            <option value="reject">Reject</option>
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
                                    {this.props.disposal.isGet === false || noDis === undefined  || level === '5' || level === '12' || level === '7' ? (
                                        <div></div>
                                    ) : (
                                        <Row className="bodyDispos">
                                        {noDis.length !== 0 && newDis.map(item => {
                                            return (
                                                    <div className="bodyCard">
                                                    <img src={placeholder} className="imgCard1" />
                                                    
                                                    {item.nilai_jual === '0' ? 
                                                     (
                                                        <Button size="sm" color="success" className="labelBut">Pemusnahan</Button>
                                                     ) : (
                                                         <div></div>
                                                     )}
                                                     {item.nilai_jual !== '0' ?
                                                     (
                                                        <Button size="sm" color="warning" className="labelBut">Penjualan</Button>
                                                     ) : (
                                                         <div></div>
                                                     )}
                                                    {/* <button className="btnDispos" onClick={() => this.openModalRinci(this.setState({dataRinci: item}))}></button> */}
                                                    <div className="ml-2">
                                                        <div className="txtDoc mb-2">
                                                            Persetujuan Disposal Asset
                                                        </div>
                                                        <Row className="mb-2">
                                                            <Col md={6} className="txtDoc">
                                                            Kode Plant
                                                            </Col>
                                                            <Col md={6} className="txtDoc">
                                                                <div>:</div>
                                                                {item.kode_plant}
                                                            </Col>
                                                        </Row>
                                                        <Row className="mb-2">
                                                            <Col md={6} className="txtDoc">
                                                            Area
                                                            </Col>
                                                            <Col md={6} className="txtDoc">
                                                                <div>:</div>
                                                                {item.area}
                                                            </Col>
                                                        </Row>
                                                        <Row className="mb-2">
                                                            <Col md={6} className="txtDoc">
                                                            No Persetujuan
                                                            </Col>
                                                            <Col md={6} className="txtDoc">
                                                                <div>:</div>
                                                                {item.no_persetujuan}
                                                            </Col>
                                                        </Row>
                                                        <Row className="mb-2">
                                                            <Col md={6} className="txtDoc">
                                                            Status Approval
                                                            </Col>
                                                            {item.ttdSet.find(({status}) => status === 0) !== undefined ? (
                                                                <Col md={6} className="txtDoc">
                                                                    <div>:</div>
                                                                    Reject {item.ttdSet.find(({status}) => status === 0).jabatan}
                                                                </Col>
                                                            ) : item.ttdSet.find(({status}) => status === 1) !== undefined ? (
                                                                <Col md={6} className="txtDoc">
                                                                    <div>:</div>
                                                                    Approve {item.ttdSet.find(({status}) => status === 1).jabatan}
                                                                </Col>
                                                            ) : (
                                                                <Col md={6} className="txtDoc">
                                                                : -
                                                                </Col>
                                                            )}
                                                            
                                                        </Row>
                                                    </div>
                                                    <Row className="footCard mb-3 mt-3">
                                                        <Col md={12} xl={12}>
                                                            <Button className="btnSell" color="primary" onClick={() => this.prosesSetDisposal(item.no_persetujuan)}>Proses</Button>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            )
                                        })}
                                        </Row>
                                    )}
                                <div>
                                    <div className={style.infoPageEmail}>
                                        <text>Showing {page.currentPage === undefined ? '0' : page.currentPage} of {page.pages === undefined ? '0' : page.pages} pages</text>
                                        <div className={style.pageButton}>
                                            <button className={style.btnPrev} color="info" disabled={page.prevLink === undefined || page.prevLink === null ? true : false} onClick={this.prev}>Prev</button>
                                            <button className={style.btnPrev} color="info" disabled={page.nextLink === undefined || page.nextLink === null ? true : false} onClick={this.next}>Next</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </MaterialTitlePanel>
                </Sidebar>
                <Modal isOpen={this.props.disposal.isLoading || this.props.setuju.isLoading ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className={style.cekUpdate}>
                                <Spinner />
                                <div sucUpdate>Waiting....</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
                <Modal isOpen={this.props.disposal.isAdd ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className={style.cekUpdate}>
                                <div sucUpdate>Berhasil menambahkan item disposal</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
                <Modal isOpen={this.state.formset} toggle={this.openFormSet} size="xl">
                    <ModalBody>
                        <div>PT. Pinus Merah Abadi</div>
                        <div className="modalDis">
                            <text className="titleModDis">Persetujuan Disposal Asset</text>
                        </div>
                        <div className="mb-2"><text className="txtTrans">Bandung</text>, {moment().format('DD MMMM YYYY ')}</div>
                        <Row>
                            <Col md={2} className="mb-3">
                            Hal : Persetujuan Disposal Asset
                            </Col>
                        </Row>
                        <div>Kepada Yth.</div>
                        <div className="mb-3">Bpk. Erwin Lesmana</div>
                        <div className="mb-3">Dengan Hormat,</div>
                        <div>Sehubungan dengan surat permohonan disposal aset area PMA terlampir</div>
                        <div className="mb-3">Dengan ini kami mohon persetujuan untuk melakukan disposal aset dengan perincian sbb :</div>
                        <Table striped bordered responsive hover className="tableDis mb-3">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Nomor Aset / Inventaris</th>
                                    <th>Area (Cabang/Depo/CP)</th>
                                    <th>Nama Barang</th>
                                    <th>Nilai Buku</th>
                                    <th>Nilai Jual</th>
                                    <th>Tanggal Perolehan</th>
                                    <th>Keterangan</th>
                                    <th>Select item to reject</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detailDis.length !== 0 ? detailDis.map(item => {
                                    return (
                                        <tr>
                                            <th onClick={() => this.getDetailDisposal(item.no_disposal)} scope="row">{detailDis.indexOf(item) + 1}</th>
                                            <td onClick={() => this.getDetailDisposal(item.no_disposal)}>{item.no_asset}</td>
                                            <td onClick={() => this.getDetailDisposal(item.no_disposal)}>{item.area}</td>
                                            <td onClick={() => this.getDetailDisposal(item.no_disposal)}>{item.nama_asset}</td>
                                            <td onClick={() => this.getDetailDisposal(item.no_disposal)}>{item.nilai_buku === null || item.nilai_buku === undefined ? 0 : item.nilai_buku.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                            <td onClick={() => this.getDetailDisposal(item.no_disposal)}>{item.nilai_jual === null || item.nilai_jual === undefined ? 0 : item.nilai_jual.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                            <td onClick={() => this.getDetailDisposal(item.no_disposal)}>{moment(item.dataAsset.tanggal).format('DD/MM/YYYY')}</td>
                                            <td onClick={() => this.getDetailDisposal(item.no_disposal)}>{item.keterangan}</td>
                                            <td> 
                                                <Input
                                                addon
                                                disabled={this.state.view !== 'available' && this.state.view !== 'revisi' ? true : false}
                                                checked={listMut.find(element => element === item.id) !== undefined ? true : false}
                                                type="checkbox"
                                                onClick={listMut.find(element => element === item.id) === undefined ? () => this.chekApp(item.id) : () => this.chekRej(item.id)}
                                                value={item.id} />
                                            </td>
                                            <td onClick={() => this.getDetailDisposal(item.no_disposal)}>{item.isreject === 1 ? 'Reject' : item.isreject === 2 ? 'Revisi' : '-'}</td>
                                        </tr>
                                    )
                                }) : (
                                    <tr>
                                        <th scope="row">1</th>
                                        <td> </td>
                                        <td> </td>
                                        <td> </td>
                                        <td> </td>
                                        <td> </td>
                                        <td> </td>
                                        <td> </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                        <div className="mb-3">Demikian hal yang dapat kami sampaikan perihal persetujuan disposal aset, atas perhatiannya kami mengucapkan terima kasih.</div>
                    </ModalBody>
                    <div className="btnFoot1 mb-3">
                        <Button onClick={() => this.persetujuanDisposal(detailDis[0].no_persetujuan)} color="primary" className="btnDownloadForm ml-3">
                            Preview
                        </Button>
                        <div className="btnfootapp">
                            {(disApp.pembuat !== undefined || disApp.penyetuju !== undefined) && (disApp.pembuat.find(({jabatan}) => jabatan === role) !== undefined || disApp.penyetuju.find(({jabatan}) => jabatan === role) !== undefined) ? (
                                <>
                                    <Button disabled={this.state.view !== 'available' && this.state.view !== 'revisi' ? true : listMut.length === 0 ? true : false} className="mr-2" color="danger" onClick={this.openModalReject}>
                                        Reject
                                    </Button>
                                    {level === '23' || level === '22' || level === '25' ? (
                                        <Button disabled={this.state.view !== 'available' && this.state.view !== 'revisi' ? true : false} color="success">
                                            <label>
                                                <input disabled={this.state.view !== 'available' && this.state.view !== 'revisi' ? true : false} type="file" className="file-upload2" onChange={this.approveSet}/>
                                                Approve
                                            </label>
                                        </Button>
                                    ) : (
                                        <Button disabled={this.state.view !== 'available' && this.state.view !== 'revisi' ? true : false} color="success" onClick={this.openModalApprove}>
                                            Approve
                                        </Button>
                                    )}
                                </>
                            ) : (
                                null
                            )}
                        </div>
                    </div>
                </Modal>
                <Modal isOpen={this.state.preset} toggle={this.modalPers} centered={true} size="xl">
                    <ModalBody>
                        <div className="bodyPer">
                            <div>PT. Pinus Merah Abadi</div>
                            <div className="modalDis">
                                <text className="titleModDis">Persetujuan Disposal Asset</text>
                            </div>
                            <div className="mb-2"><text className="txtTrans">Bandung</text>, {moment().format('DD MMMM YYYY ')}</div>
                            <Row>
                                <Col md={2} className="mb-3">
                                Hal : Persetujuan Disposal Asset
                                </Col>
                            </Row>
                            <div>Kepada Yth.</div>
                            <div className="mb-3">Bpk. Erwin Lesmana</div>
                            <div className="mb-3">Dengan Hormat,</div>
                            <div>Sehubungan dengan surat permohonan disposal aset area PMA terlampir</div>
                            <div className="mb-3">Dengan ini kami mohon persetujuan untuk melakukan disposal aset dengan perincian sbb :</div>
                            <Table striped bordered responsive hover className="tableDis mb-3">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Nomor Aset / Inventaris</th>
                                        <th>Area (Cabang/Depo/CP)</th>
                                        <th>Nama Barang</th>
                                        <th>Nilai Buku</th>
                                        <th>Nilai Jual</th>
                                        <th>Tanggal Perolehan</th>
                                        <th>Keterangan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detailDis.length !== 0 ? detailDis.map(item => {
                                        return (
                                            <tr>
                                                <th scope="row">{detailDis.indexOf(item) + 1}</th>
                                                <td>{item.no_asset}</td>
                                                <td>{item.area}</td>
                                                <td>{item.nama_asset}</td>
                                                <td>{item.nilai_buku === null || item.nilai_buku === undefined ? 0 : item.nilai_buku.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                <td>{item.nilai_jual === null || item.nilai_jual === undefined ? 0 : item.nilai_jual.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                <td>{moment(item.dataAsset.tanggal).format('DD/MM/YYYY')}</td>
                                                <td>{item.keterangan}</td>
                                            </tr>
                                        )
                                    }) : (
                                        <tr>
                                            <th scope="row">1</th>
                                            <td> </td>
                                            <td> </td>
                                            <td> </td>
                                            <td> </td>
                                            <td> </td>
                                            <td> </td>
                                            <td> </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                            <div className="mb-3">Demikian hal yang dapat kami sampaikan perihal persetujuan disposal aset, atas perhatiannya kami mengucapkan terima kasih.</div>
                            <Table borderless className="tabPreview">
                                <thead>
                                    <tr>
                                        <th className="buatPre">Diajukan oleh,</th>
                                        <th className="buatPre">Disetujui oleh,</th>
                                    </tr>
                                </thead>
                                <tbody className="tbodyPre">
                                    <tr>
                                        <td className="restTable">
                                            <Table bordered className="divPre">
                                                <thead>
                                                    <tr>
                                                        {disApp.pembuat !== undefined && disApp.pembuat.map(item => {
                                                            return (
                                                                <th className="headPre">
                                                                    <div className="mb-2">{item.nama === null ? "" : item.status === 0 ? `Reject (${moment(item.updatedAt).format('LL')})` : moment(item.updatedAt).format('LL')}</div>
                                                                    <div>{item.nama === null ? "" : item.nama}</div>
                                                                </th>
                                                            )
                                                        })}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        {disApp.pembuat !== undefined && disApp.pembuat.map(item => {
                                                            return (
                                                                <td className="footPre">{item.jabatan === null ? "" : item.jabatan === 'NFAM' ? 'Head of Finance Accounting PMA' : item.jabatan}</td>
                                                            )
                                                        })}
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </td>
                                        <td className="restTable">
                                            <Table bordered className="divPre">
                                                <thead>
                                                    <tr>
                                                        {disApp.penyetuju !== undefined && disApp.penyetuju.map(item => {
                                                            return (
                                                                <th className="headPre">
                                                                    <div className="mb-2">{item.nama === null ? "-" : item.status === 0 ? `Reject (${moment(item.updatedAt).format('LL')})` : moment(item.updatedAt).format('LL')}</div>
                                                                    <div>{item.nama === null ? "-" : item.nama}</div>
                                                                </th>
                                                            )
                                                        })}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        {disApp.penyetuju !== undefined && disApp.penyetuju.map(item => {
                                                            return (
                                                                <td className="footPre">{item.jabatan === null ? "-" : item.jabatan}</td>
                                                            )
                                                        })}
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                            <div className="btnFoot">
                                <Button className="mr-2" color="warning">
                                    <TablePdf dataDis={detailDis} />
                                </Button>
                                <Button color="success" onClick={this.modalPers}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.formDis} toggle={this.openModalDis} size="xl">
                    <ModalBody>
                        <div>PT. Pinus Merah Abadi</div>
                        <div className="modalDis">
                            <text className="titleModDis">Form Pengajuan Disposal Asset</text>
                        </div>
                        <div className="mb-2"><text className="txtTrans">{detailDis[0] !== undefined && detailDis[0].area}</text>, {moment(detailDis[0] !== undefined && detailDis[0].createdAt).locale('idn').format('DD MMMM YYYY ')}</div>
                        <Row>
                            <Col md={2}>
                            Hal
                            </Col>
                            <Col md={10}>
                            : Pengajuan Disposal Asset
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col md={2}>
                            {detailDis[0] === undefined ? "" :
                            detailDis[0].status_depo === "Cabang Scylla" || detailDis.status_depo === "Cabang SAP" ? "Cabang" : "Depo"}
                            </Col>
                            <Col md={10} className="txtTrans">
                            : {detailDis[0] !== undefined && detailDis[0].area}
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
                                    <th>Status Depo</th>
                                    <th>Cost Center</th>
                                    <th>Nilai Buku</th>
                                    <th>Nilai Jual</th>
                                    <th>Keterangan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detailData.length !== 0 && detailData.map(item => {
                                    return (
                                        <tr onClick={() => this.openProsesModalDoc(item.no_asset)}>
                                            <th scope="row">{detailData.indexOf(item) + 1}</th>
                                            <td>{item.no_asset}</td>
                                            <td>{item.nama_asset}</td>
                                            <td>{item.merk}</td>
                                            <td>{item.kategori}</td>
                                            <td>{item.status_depo}</td>
                                            <td>{item.cost_center}</td>
                                            <td>{item.nilai_buku}</td>
                                            <td>{item.nilai_jual}</td>
                                            <td>{item.keterangan}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                        <div className="mb-3">Demikianlah hal yang kami sampaikan, atas perhatiannya kami mengucapkan terima kasih</div>
                       <Table borderless responsive className="tabPreview">
                           <thead>
                               <tr>
                                   <th className="buatPre">Dibuat oleh,</th>
                                   <th className="buatPre">Diperiksa oleh,</th>
                                   <th className="buatPre">Disetujui oleh,</th>
                               </tr>
                           </thead>
                           <tbody className="tbodyPre">
                               <tr>
                                   <td className="restTable">
                                       <Table bordered responsive className="divPre">
                                            <thead>
                                                <tr>
                                                    {appPeng.pembuat !== undefined && appPeng.pembuat.map(item => {
                                                        return (
                                                            <th className="headPre">
                                                                <div className="mb-2">{item.nama === null ? "-" : moment(item.updatedAt).format('LL')}</div>
                                                                <div>{item.nama === null ? "-" : item.nama}</div>
                                                            </th>
                                                        )
                                                    })}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                {appPeng.pembuat !== undefined && appPeng.pembuat.map(item => {
                                                    return (
                                                        <td className="footPre">{item.jabatan === null ? "-" : item.jabatan}</td>
                                                    )
                                                })}
                                                </tr>
                                            </tbody>
                                       </Table>
                                   </td>
                                   <td className="restTable">
                                       <Table bordered responsive className="divPre">
                                            <thead>
                                                <tr>
                                                    {appPeng.pemeriksa !== undefined && appPeng.pemeriksa.map(item => {
                                                        return (
                                                            item.jabatan === 'asset' ? (
                                                                null
                                                            ) : (
                                                                <th className="headPre">
                                                                    <div className="mb-2">{item.nama === null ? "-" : moment(item.updatedAt).format('LL')}</div>
                                                                    <div>{item.nama === null ? "-" : item.nama}</div>
                                                                </th>
                                                            )
                                                        )
                                                    })}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    {appPeng.pemeriksa !== undefined && appPeng.pemeriksa.map(item => {
                                                        return (
                                                            item.jabatan === 'asset' ? (
                                                                null
                                                            ) : (
                                                                <td className="footPre">{item.jabatan === null ? "-" : item.jabatan}</td>
                                                            )
                                                        )
                                                    })}
                                                </tr>
                                            </tbody>
                                       </Table>
                                   </td>
                                   <td className="restTable">
                                       <Table bordered responsive className="divPre">
                                            <thead>
                                                <tr>
                                                    {appPeng.penyetuju !== undefined && appPeng.penyetuju.map(item => {
                                                        return (
                                                            <th className="headPre">
                                                                <div className="mb-2">{item.nama === null ? "-" : moment(item.updatedAt).format('LL')}</div>
                                                                <div>{item.nama === null ? "-" : item.nama}</div>
                                                            </th>
                                                        )
                                                    })}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    {appPeng.penyetuju !== undefined && appPeng.penyetuju.map(item => {
                                                        return (
                                                            <td className="footPre">{item.jabatan === null ? "-" : item.jabatan}</td>
                                                        )
                                                    })}
                                                </tr>
                                            </tbody>
                                       </Table>
                                   </td>
                               </tr>
                           </tbody>
                       </Table>
                    </ModalBody>
                    <hr />
                    <div className="modalFoot ml-3">
                        <div></div>
                        <div className="btnFoot">
                            <Button className="mr-2" color="warning">
                                <TablePeng detailDis={detailData} />
                            </Button>
                            <Button color="success" onClick={this.openPreview}>
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
                                <img src={dataRinci.no_asset === '4100000150' ? b : dataRinci.no_asset === '4300001770' ? e : placeholder} className="imgRinci" />
                                <div className="secImgSmall">
                                    <button className="btnSmallImg">
                                        <img src={dataRinci.no_asset === '4100000150' ? b : dataRinci.no_asset === '4300001770' ? e : placeholder} className="imgSmallRinci" />
                                    </button>
                                    <button className="btnSmallImg">
                                        <img src={dataRinci.no_asset === '4100000150' ? a : dataRinci.no_asset === '4300001770' ? d : placeholder} className="imgSmallRinci" />
                                    </button>
                                    <button className="btnSmallImg">
                                        <img src={dataRinci.no_asset === '4100000150' ? c : dataRinci.no_asset === '4300001770' ? f : placeholder} className="imgSmallRinci" />
                                    </button>
                                    <button className="btnSmallImg">
                                        <img src={dataRinci.no_asset === '4100000150' ? a : dataRinci.no_asset === '4300001770' ? g : placeholder} className="imgSmallRinci" />
                                    </button>
                                    <button className="btnSmallImg">
                                        <img src={dataRinci.no_asset === '4100000150' ? c : dataRinci.no_asset === '4300001770' ? d : placeholder} className="imgSmallRinci" />
                                    </button>
                                </div>
                            </div>
                            <div className="rightRinci">
                                <div>
                                    <div className="titRinci">{dataRinci.nama_asset}</div>
                                    <div className="secSmallRinci">
                                        <div className="titSmallRinci">No Asset</div>
                                        <div className="txtAreaRinci">{dataRinci.no_asset}</div>
                                    </div>
                                    <div className="secSmallRinci">
                                        <div className="titSmallRinci">Area</div>
                                        <div className="txtAreaRinci">{dataRinci.area}</div>
                                    </div>
                                    <div className="secSmallRinci">
                                        <div className="titSmallRinci">Kode Plant</div>
                                        <div className="txtAreaRinci">{dataRinci.kode_plant}</div>
                                    </div>
                                </div>
                                <div className="footRinci">
                                    <Button className="btnFootRinci" size="lg" color="warning">Sell</Button>
                                    <Button className="btnFootRinci" size="lg" color="info" onClick={() => this.addDisposal(dataRinci.id)}>Dispose</Button>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.rinciAdmin} toggle={this.openRinciAdmin} size="xl">
                    <ModalHeader>
                        Rincian
                    </ModalHeader>
                    <ModalBody>
                        <div className="mainRinci">
                            <div className="leftRinci">
                                <img src={dataRinci.no_asset === '4100000150' ? b : dataRinci.no_asset === '4300001770' ? e : placeholder} className="imgRinci" />
                                <div className="secImgSmall">
                                    <button className="btnSmallImg">
                                        <img src={dataRinci.no_asset === '4100000150' ? b : dataRinci.no_asset === '4300001770' ? e : placeholder} className="imgSmallRinci" />
                                    </button>
                                    <button className="btnSmallImg">
                                        <img src={dataRinci.no_asset === '4100000150' ? a : dataRinci.no_asset === '4300001770' ? d : placeholder} className="imgSmallRinci" />
                                    </button>
                                    <button className="btnSmallImg">
                                        <img src={dataRinci.no_asset === '4100000150' ? c : dataRinci.no_asset === '4300001770' ? f : placeholder} className="imgSmallRinci" />
                                    </button>
                                    <button className="btnSmallImg">
                                        <img src={dataRinci.no_asset === '4100000150' ? a : dataRinci.no_asset === '4300001770' ? g : placeholder} className="imgSmallRinci" />
                                    </button>
                                    <button className="btnSmallImg">
                                        <img src={dataRinci.no_asset === '4100000150' ? c : dataRinci.no_asset === '4300001770' ? d : placeholder} className="imgSmallRinci" />
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
                                        <Row className="mb-2">
                                            <Col md={3}>No Asset</Col>
                                            <Col md={9}>:  <input className="inputRinci" value={dataRinci.no_asset} disabled /></Col>
                                        </Row>
                                        <Row className="mb-2">
                                            <Col md={3}>Merk / Type</Col>
                                            <Col md={9}>:  <input
                                                type= "text" 
                                                className="inputRinci"
                                                value={values.merk}
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
                                                    <div className="ml-2"><input type="checkbox"/> IT</div>
                                                    <div className="ml-3"><input type="checkbox"/> Non IT</div>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row className="mb-2">
                                            <Col md={3}>Status Area</Col>
                                            <Col md={9}>:  <input className="inputRinci" value={dataRinci.status_depo} disabled /></Col>
                                        </Row>
                                        <Row className="mb-2">
                                            <Col md={3}>Cost Center</Col>
                                            <Col md={9}>:  <input className="inputRinci" value={dataRinci.cost_center} disabled /></Col>
                                        </Row>
                                        <Row className="mb-2">
                                            <Col md={3}>Nilai Buku</Col>
                                            <Col md={9}>:  <input className="inputRinci" disabled /></Col>
                                        </Row>
                                        <Row className="mb-2">
                                            <Col md={3}>Nilai Jual</Col>
                                            <Col md={9}>:  <input 
                                                className="inputRinci" 
                                                value={values.nilai_jual} 
                                                onBlur={handleBlur("nilai_jual")}
                                                onChange={handleChange("nilai_jual")}
                                                disabled={dataRinci.nilai_jual === '0' ? true : false}
                                                />
                                            </Col>
                                        </Row>
                                        {errors.nilai_jual ? (
                                            <text className={style.txtError}>{errors.nilai_jual}</text>
                                        ) : null}
                                        <Row>
                                            <Col md={3}>Keterangan</Col>
                                            <Col md={9}>:  <input
                                                className="inputRinci" 
                                                type="text" 
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
                                    <div className="footRinci1">
                                        <Button className="btnFootRinci1" size="lg" color="primary" onClick={handleSubmit}>Save</Button>
                                        <Button className="btnFootRinci1" size="lg" color="success" onClick={this.openProsesModalDoc}>Dokumen</Button>
                                        <Button className="btnFootRinci1" size="lg" color="secondary" onClick={() => this.openRinciAdmin()}>Close</Button>
                                    </div>
                                </div>
                            )}
                            </Formik>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal size="xl" isOpen={this.state.openDoc} toggle={this.closeProsesModalDoc}>
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
                                        <Col md={6} lg={6} >
                                            {x.status === 0 ? (
                                                <AiOutlineClose size={20} />
                                            ) : x.status === 3 ? (
                                                <AiOutlineCheck size={20} />
                                            ) : (
                                                <BsCircle size={20} />
                                            )}
                                            <button className="btnDocIo" onClick={() => this.showDokumen(x)} >{x.nama_dokumen}</button>
                                        </Col>
                                    ) : (
                                        <Col md={6} lg={6} >
                                            -
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
            <Modal isOpen={this.state.openReject} toggle={this.openModalReject} centered={true}>
                    <ModalBody>
                    <Formik
                    initialValues={{
                    alasan: ".",
                    jenis_reject: "revisi"
                    }}
                    validationSchema={alasanDisSchema}
                    onSubmit={(values) => {this.rejectDisposal({value: values, no: detailDis[0].no_disposal})}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                            <div className={style.modalApprove}>
                            <div className='colred'>Anda yakin untuk reject</div>
                            <div className='mb-2 mt-2'>
                                {listMut.map(item => {
                                    return (
                                        <div className="blue">- {detailDis.find(({id}) => id === item).nama_asset}</div>
                                    )
                                })}
                            </div>
                            <div className='mb-2 mt-4'>Pilih tipe reject :</div>
                            <Input 
                            type="select" 
                            name="jenis_reject" 
                            className="ml-2"
                            value={values.jenis_reject}
                            onChange={handleChange('jenis_reject')}
                            onBlur={handleBlur('jenis_reject')}
                            >
                                <option value="revisi">Perbaikan </option>
                                <option value="batal">Pembatalan </option>
                            </Input>
                            <div className='ml-2'>
                                {errors.jenis_reject ? (
                                    <text className={style.txtError}>{errors.jenis_reject}</text>
                                ) : null}
                            </div>
                            <div className='mb-2 mt-4'>Pilih alasan :</div>
                            <div className="ml-2">
                                <Input
                                addon
                                type="checkbox"
                                checked= {listStat.find(element => element === 'Nilai jual tidak sesuai') !== undefined ? true : false}
                                onClick={listStat.find(element => element === 'Nilai jual tidak sesuai') === undefined ? () => this.statusApp('Nilai jual tidak sesuai') : () => this.statusRej('Nilai jual tidak sesuai')}
                                />  Nilai jual tidak sesuai
                            </div>
                            <div className={style.alasan}>
                                <text className="ml-2">
                                    Lainnya
                                </text>
                            </div>
                            <Input 
                            type="name" 
                            name="alasan" 
                            className="ml-2"
                            value={values.alasan}
                            onChange={handleChange('alasan')}
                            onBlur={handleBlur('alasan')}
                            />
                            <div className='ml-2'>
                                {errors.alasan && listStat.length === 0 ? (
                                    <text className={style.txtError}>{errors.alasan}</text>
                                ) : null}
                            </div>
                            <div className={style.btnApprove}>
                                <Button color="primary" disabled={(values.alasan === '.' || values.alasan === '') && listStat.length === 0 ? true : false} onClick={handleSubmit}>Reject</Button>
                                <Button color="secondary" onClick={this.openModalReject}>Close</Button>
                            </div>
                        </div>
                        )}
                        </Formik>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.openApprove} toggle={this.openModalApprove} centered={true}>
                    <ModalBody>
                        <div className={style.modalApprove}>
                            <div>
                                <text>
                                    Anda yakin untuk approve     
                                    <text className={style.verif}> </text>
                                    pada tanggal
                                    <text className={style.verif}> {moment().format('LL')}</text> ?
                                </text>
                            </div>
                            <div className={style.btnApprove}>
                                <Button color="primary" onClick={() => this.approveSetDis(detailDis[0].no_persetujuan)}>Ya</Button>
                                <Button color="secondary" onClick={this.openModalApprove}>Tidak</Button>
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
                                <Button color="success" onClick={() => this.downloadData()}>Download</Button>
                            </div>
                        {/* {level === '5' ? (
                            <Button color="primary" onClick={() => this.setState({openPdf: false})}>Close</Button>
                            ) : (
                                <div>
                                    <Button color="danger" className="mr-3" onClick={this.openModalRejectDis}>Reject</Button>
                                    <Button color="primary" onClick={this.openModalApproveDis}>Approve</Button>
                                </div>
                            )} */}
                            <div></div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.openApproveDis} toggle={this.openModalApproveDis} centered={true}>
                    <ModalBody>
                        <div className={style.modalApprove}>
                            <div>
                                <text>
                                    Anda yakin untuk approve 
                                    <text className={style.verif}>  </text>
                                    pada tanggal
                                    <text className={style.verif}> {moment().format('LL')}</text> ?
                                </text>
                            </div>
                            <div className={style.btnApprove}>
                                <Button color="primary" onClick={this.approveDokumen}>Ya</Button>
                                <Button color="secondary" onClick={this.openModalApproveDis}>Tidak</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.openRejectDis} toggle={this.openModalRejectDis} centered={true}>
                    <ModalBody>
                    <Formik
                    initialValues={{
                    alasan: "",
                    }}
                    validationSchema={alasanSchema}
                    onSubmit={(values) => {this.rejectDokumen(values)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                            <div className={style.modalApprove}>
                            <div className={style.quest}>Anda yakin untuk reject {this.state.fileName.nama_dokumen} ?</div>
                            <div className={style.alasan}>
                                <text className="col-md-3">
                                    Alasan
                                </text>
                                <Input 
                                type="name" 
                                name="select" 
                                className="col-md-9"
                                value={values.alasan}
                                onChange={handleChange('alasan')}
                                onBlur={handleBlur('alasan')}
                                />
                            </div>
                            {errors.alasan ? (
                                    <text className={style.txtError}>{errors.alasan}</text>
                                ) : null}
                            <div className={style.btnApprove}>
                                <Button color="primary" onClick={handleSubmit}>Ya</Button>
                                <Button color="secondary" onClick={this.openModalRejectDis}>Tidak</Button>
                            </div>
                        </div>
                        )}
                        </Formik>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalConfirm} toggle={this.openConfirm} size="sm">
                    <ModalBody>
                        {this.state.confirm === 'edit' ? (
                        <div className={style.cekUpdate}>
                            <AiFillCheckCircle size={80} className={style.green} />
                            <div className={[style.sucUpdate, style.green]}>Berhasil Update Dokumen</div>
                        </div>
                        ) : this.state.confirm === 'add' ? (
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Menambah Dokumen</div>
                            </div>
                        ) : this.state.confirm === 'approve' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Approve</div>
                            </div>
                            </div>
                        ) : this.state.confirm === 'reject' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                    <div className={[style.sucUpdate, style.green]}>Berhasil Reject</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'rejApprove' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Approve</div>
                                <div className="errApprove mt-2">{this.props.setuju.alertM === undefined ? '' : this.props.setuju.alertM}</div>
                            </div>
                            </div>
                        ) : this.state.confirm === 'rejReject' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Reject</div>
                                <div className="errApprove mt-2">{this.props.setuju.alertM === undefined ? '' : this.props.setuju.alertM}</div>
                            </div>
                            </div>
                        ) : this.state.confirm === 'rejbatal' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Reject</div>
                                <div className="errApprove mt-2">Pilih semua item untuk reject pembatalan</div>
                            </div>
                            </div>
                        ) : (
                            <div></div>
                        )}
                    </ModalBody>
                </Modal>
            </>
        )
    }
}

const mapStateToProps = state => ({
    asset: state.asset,
    disposal: state.disposal,
    approve: state.approve,
    pengadaan: state.pengadaan,
    setuju: state.setuju
})

const mapDispatchToProps = {
    logout: auth.logout,
    getAsset: asset.getAsset,
    resetError: asset.resetError,
    nextPage: asset.nextPage,
    getDisposal: disposal.getDisposal,
    addDisposal: disposal.addDisposal,
    deleteDisposal: disposal.deleteDisposal,
    resetErrorDis: disposal.reset,
    getNameApprove: approve.getNameApprove,
    getApproveDisposal: disposal.getApproveDisposal,
    approveDisposal: disposal.approveDisposal,
    rejectDisposal: disposal.rejectDisposal,
    getDocumentDis: disposal.getDocumentDis,
    approveDocDis: disposal.approveDocDis,
    rejectDocDis: disposal.rejectDocDis,
    showDokumen: pengadaan.showDokumen,
    resetDis: disposal.reset,
    getSetDisposal: setuju.getSetDisposal,
    getDetailDis: disposal.getDetailDisposal,
    getNewDetailDis: disposal.getNewDetailDisposal,
    getApproveSetDisposal: setuju.getApproveSetDisposal,
    approveSetDisposal: setuju.approveSetDisposal,
    rejectSetDisposal: setuju.rejectSetDisposal,
    notifDisposal: notif.notifDisposal,
    getNotif: notif.getNotif,
    resetAppSet: setuju.resetAppSet,
}

export default connect(mapStateToProps, mapDispatchToProps)(Disposal)
