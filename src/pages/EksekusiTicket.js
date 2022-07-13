/* eslint-disable jsx-a11y/no-distracting-elements */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react'
import { Container, NavbarBrand, Table, Input, Button, Col,
    Alert, Spinner, Row, Modal, ModalBody, ModalHeader, ModalFooter,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap'
import style from '../assets/css/input.module.css'
import {FaSearch, FaUserCircle, FaBars, FaCartPlus, FaFileSignature} from 'react-icons/fa'
import {BsCircle, BsBell, BsFillCircleFill} from 'react-icons/bs'
import { AiOutlineInfoCircle, AiOutlineCheck, AiOutlineClose, AiFillCheckCircle, AiOutlineFileExcel} from 'react-icons/ai'
import {Formik} from 'formik'
import * as Yup from 'yup'
import Pdf from "../components/Pdf"
import {Form} from 'react-bootstrap'
import logo from '../assets/img/logo.png'
import {connect} from 'react-redux'
import pengadaan from '../redux/actions/pengadaan'
import OtpInput from "react-otp-input";
import moment from 'moment'
import auth from '../redux/actions/auth'
import {default as axios} from 'axios'
import Sidebar from "../components/Header"
import MaterialTitlePanel from "../components/material_title_panel"
import SidebarContent from "../components/sidebar_content"
import placeholder from  "../assets/img/placeholder.png"
import TablePeng from '../components/TablePeng'
import notif from '../redux/actions/notif'
import NavBar from '../components/NavBar'
import ReactHtmlToExcel from "react-html-table-to-excel"
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

class EksekusiTicket extends Component {
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
            openModalDoc: false,
            modalRinci: false,
            dataRinci: {},
            detailDis: [],
            nama: "Pilih Approval",
            openReject: false,
            openApprove: false,
            preview: false,
            openPdf: false,
            idDoc: 0,
            openApproveIo: false,
            openRejectDis: false,
            fileName: {},
            dataApp: {},
            img: '',
            limImage: 20000,
            submitPre: false,
            date: '',
            view: '',
            newDis: [],
            app: [],
            find: null,
            openModalIo: false,
            openModalTtd: false,
            profit: "",
            io: "",
            data: [],
            index: 0,
            rinciIo: {},
            total: 0,
            openFill: false,
            download: '',
            idTab: null
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
    }

    getApproveDis = async (value) => {
        const token = localStorage.getItem('token')
        await this.props.getApproveDisposal(token, value.no, value.nama)
    }

    openModalRinci = () => {
        this.setState({modalRinci: !this.state.modalRinci})
    }

    openRinciAdmin = () => {
        this.setState({rinciAdmin: !this.state.rinciAdmin})
    }

    openPreview = () => {
        this.setState({preview: !this.state.preview})
    }

    openModPreview = async (val) => {
        const token = localStorage.getItem('token')
        await this.props.getApproveIo(token, val.no_pengadaan)
        this.openPreview()
    }

    onChange = value => {
        this.setState({value: value})
    }

    openFill = () => {
        this.setState({openFill: !this.state.openFill})
    }

    openTemp = async () => {
        const token = localStorage.getItem('token')
        const { detailIo } = this.props.pengadaan
        await this.props.getTempAsset(token, detailIo[0].no_pengadaan)
        this.openFill()
    }

    downloadTemp = (val) => {
        this.setState({download: val})
    }

    updateNomorIo = async (val) => {
        const {value} = this.state
        const token = localStorage.getItem('token')
        const data = {
            no_io: value
        }
        await this.props.updateNoIo(token, val, data)
        await this.props.getDetail(token, val)
        this.setState({confirm: 'isupdate'})
        this.openConfirm()
    }

    submitBudget = async () => {
        const token = localStorage.getItem('token')
        const { detailIo } = this.props.pengadaan
        const cek = []
        for (let i = 0; i < detailIo.length; i++) {
            if (detailIo[i].no_io === null || detailIo[i].no_io === '') {
                cek.push(detailIo[i])  
            }
        }
        if (cek.length) {
            this.setState({confirm: 'rejSubmit'})
            this.openConfirm()
        } else {
            await this.props.submitBudget(token, detailIo[0].no_pengadaan)
            this.getDataAsset()
            this.setState({confirm: 'submit'})
            this.openConfirm()
        }
    }

    goCartDispos = () => {
        this.props.history.push('/cart')
    }

    closeProsesModalDoc = () => {
        this.setState({openModalDoc: !this.state.openModalDoc})
    }

    updateIo = async (val) => {
        const token = localStorage.getItem('token')
        const data = {
            isAsset: val.item.isAsset,
            jenis: val.value
        }
        await this.props.updateDataIo(token, val.item.id, data)
        await this.props.getDetail(token, val.item.no_pengadaan)
    }

    openModalApproveIo = () => {
        this.setState({openApproveIo: !this.state.openApproveIo})
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

    modalSubmitPre = () => {
        this.setState({submitPre: !this.state.submitPre})
    }

    uploadMaster = async () => {
        const token = localStorage.getItem('token')
        const data = new FormData()
        const { dataTemp } = this.props.pengadaan
        data.append('master', this.state.fileUpload)
        await this.props.uploadMasterTemp(token, data, dataTemp[0].no_pengadaan)
    }

    prosesModalDoc = async () => {
        const data = this.props.pengadaan.detailIo
        const token = localStorage.getItem('token')
        await this.props.getDocumentIo(token, data[0].no_pengadaan)
        this.closeProsesModalDoc()
    }

    approveDokumen = async () => {
        const {fileName} = this.state
        const token = localStorage.getItem('token')
        await this.props.approveDocDis(token, fileName.id)
        this.setState({openApprove: !this.state.openApprove})
        this.openModalPdf()
    }

    rejectIo = async (value) => {
        const { detailIo } = this.props.pengadaan
        const token = localStorage.getItem('token')
        this.openModalReject()
        await this.props.rejectIo(token, detailIo[0].no_pengadaan, value)
        this.getDataAsset()
    }

    openProsesModalDoc = async () => {
        const token = localStorage.getItem('token')
        const { dataRinci } = this.state
        await this.props.getDocumentDis(token, dataRinci.no_asset, 'disposal', 'pengajuan')
        this.closeProsesModalDoc()
    }


    approveIo = async () => {
        const token = localStorage.getItem('token')
        const { detailIo } = this.props.pengadaan
        this.openModalApproveIo()
        await this.props.approveIo(token, detailIo[0].no_pengadaan)
        this.getDataAsset()
    }

    submitAsset = async (val) => {
        const token = localStorage.getItem('token')
        const cek = []
        const { detailIo } = this.props.pengadaan
        for (let i = 0; i < detailIo.length; i++) {
            if (detailIo[i].isAsset === 'true') {
                if (detailIo[i].no_asset !== null) {
                    const data = detailIo[i].no_asset.split(',') === undefined ? 1 : detailIo[i].no_asset.split(',')  
                    if (data.length !== parseInt(detailIo[i].qty) || detailIo[i].jenis === null) {
                        cek.push(detailIo[i])
                    }
                } else {
                    cek.push(1)
                }
            }
        }
        if (cek.length > 0) {
            this.setState({confirm: 'falseSubmit'})
            this.openConfirm()
        } else {
            await this.props.submitEks(token, val)
            if (detailIo[0].ticket_code === null) {
                this.getDataAsset()
                this.setState({confirm: 'submit'})
                this.openConfirm()
            } else {
                await this.props.podsSend(token, val)
            }
        }
    }

    openForm = async (val) => {
        const token = localStorage.getItem('token')
        const level = localStorage.getItem('level')
        await this.props.getDetail(token, val.no_pengadaan)
        await this.props.getApproveIo(token, val.no_pengadaan)
        const data = this.props.pengadaan.detailIo
        let num = 0
        for (let i = 0; i < data.length; i++) {
            if (data[i].isAsset !== 'true' && level !== '2' ) {
                const temp = 0
                num += temp
            } else {
                const temp = parseInt(data[i].price) * parseInt(data[i].qty)
                num += temp
            }
        }
        this.setState({total: num, value: data[0].no_io})
        this.prosesModalIo()
    }

    rejectDisposal = async (value) => {
        const token = localStorage.getItem('token')
        const data = {
            alasan: value.value.alasan
        }
        if (value.value.jenis_reject === 'batal') {
            this.openModalDis()
        } 
        await this.props.rejectDisposal(token, value.no, data, value.value.jenis_reject)
        this.openModalReject()
        this.getDataDisposal()
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

    prosesModalIo = () => {
        this.setState({openModalIo: !this.state.openModalIo})
    }

    getDetailDisposal = async (value) => {
        const { dataDis } = this.props.disposal
        const detail = []
        for (let i = 0; i < dataDis.length; i++) {
            if (dataDis[i].no_disposal === value) {
                detail.push(dataDis[i])
            }
        }
        this.setState({detailDis: detail})
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

    DownloadTemplate = () => {
        axios({
            url: `${REACT_APP_BACKEND_URL}/masters/dokumen.xlsx`,
            method: 'GET',
            responseType: 'blob',
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "dokumen.xlsx");
            document.body.appendChild(link);
            link.click();
        });
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
        console.log(value)
        const {isShow} = this.props.pengadaan
        if (isShow) {
            this.openModalPdf()
        }
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

    updateNoAsset = async (value) => {
        const token = localStorage.getItem("token")
        const data = {
            [value.target.name]: value.target.value
        }
        if (value.target.name === 'no_asset') {
            if (value.key === 'Enter') {
                await this.props.updateTemp(token, value.item.id, data)
                await this.props.getTempAsset(token, value.item.no_pengadaan)
                await this.props.getDetail(token, value.item.no_pengadaan)
            } else {
                this.setState({idTab: value.item.id})
            }
        }
    }

    componentDidUpdate() {
        const {isError, isUpload, isUpdate, approve, rejApprove, reject, rejReject, detailIo, errUpload, uploadTemp, podssend} = this.props.pengadaan
        const {rinciIo} = this.state
        const token = localStorage.getItem('token')
        if (isError) {
            this.props.resetError()
            this.showAlert()
        } else if (isUpload) {
            setTimeout(() => {
                this.props.resetError()
             }, 2000)
             setTimeout(() => {
                this.props.getDocumentIo(token, rinciIo.no_pengadaan)
             }, 2100)
        } else if (isUpdate) {
            setTimeout(() => {
                this.props.resetError()
             }, 2000)
             setTimeout(() => {
                this.props.getDocumentIo(token, rinciIo.no_pengadaan)
             }, 2100)
        } else if (approve) {
            this.setState({confirm: 'approve'})
            this.openConfirm()
            this.props.resetApp()
            this.props.getApproveIo(token, detailIo[0].no_pengadaan)
        } else if (rejApprove) {
            this.setState({confirm: 'rejApprove'})
            this.openConfirm()
            this.props.resetApp()
        } else if (reject) {
            this.setState({confirm: 'reject'})
            this.openConfirm()
            this.props.resetApp()
            this.props.getApproveIo(token, detailIo[0].no_pengadaan)
        } else if (rejReject) {
            this.setState({confirm: 'rejReject'})
            this.openConfirm()
            this.props.resetApp()
        } else if (uploadTemp) {
            this.props.getDetail(token, detailIo[0].no_pengadaan)
            this.props.getTempAsset(token, detailIo[0].no_pengadaan)
            this.setState({confirm: 'success'})
            this.openConfirm()
            this.props.resetError()
        } else if (errUpload) {
            this.setState({confirm: 'failed'})
            this.openConfirm()
            this.props.resetError()
        } else if (podssend === true) {
            this.getDataAsset()
            this.setState({confirm: 'sucpods'})
            this.openConfirm()
            this.props.resetApp()
        } else if (podssend === false) {
            this.getDataAsset()
            this.setState({confirm: 'falpods'})
            this.openConfirm()
            this.props.resetApp()
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

    goSetDispos = async () => {
        const token = localStorage.getItem("token")
        await this.props.submitSetDisposal(token)
        this.modalSubmitPre()
        this.getDataDisposal()
    }
    
    getNotif = async () => {
        const token = localStorage.getItem("token")
        await this.props.getNotif(token)
    }

    componentDidMount() {
        this.getNotif()
        this.getDataAsset()
    }

    getDataAsset = async (value) => {
        const token = localStorage.getItem("token")
        this.props.getPengadaan(token, '9')
    }

    getSubmitDisposal = async (value) => {
        const token = localStorage.getItem("token")
        const { page } = this.props.disposal
        await this.props.getSubmitDisposal(token, 1000, '', page.currentPage, 9)
        this.modalSubmitPre()
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

    addSell = async (value) => {
        const token = localStorage.getItem("token")
        await this.props.addSell(token, value)
        this.getDataAsset()
    }

    openDataRinci = (val) => {
        this.setState({dataRinci: val})
        const role = localStorage.getItem('role')
        const app = val.appForm
        const find = app.indexOf(app.find(({jabatan}) => jabatan === role))
        this.setState({app: app, find: find})
        this.openRinciAdmin()
    }

    render() {
        const {alert, upload, errMsg, rinciIo, total} = this.state
        const {dataAsset, alertM, alertMsg, alertUpload, page} = this.props.asset
        const pages = this.props.disposal.page 
        const {dataPeng, isLoading, isError, dataApp, dataDoc, detailIo, dataTemp} = this.props.pengadaan
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const dataNotif = this.props.notif.data
        const role = localStorage.getItem('role')

        const contentHeader =  (
            <div className={style.navbar}>
                <NavbarBrand
                    href="#"
                    onClick={this.menuButtonClick}
                    >
                    <FaBars size={20} className={style.white} />
                </NavbarBrand>
                <NavBar dataNotif={dataNotif} />
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
                                    <div className={style.titleDashboard}>Eksekusi Pengadaan Asset</div>
                                </div>
                                <div className={level === '2' ? style.secEmail1 : style.secEmail}>
                                    {level === '5' || level === '9' ? (
                                        <div className={style.headEmail}>
                                            <button className="btnGoCart"><FaCartPlus size={60} className="green ml-2" /></button>
                                        </div>
                                    ) : level === '2' || level === '12' ? (
                                        <div className="mt-5">
                                            {/* <Button onClick={this.getSubmitDisposal} color="info" size="lg" className="btnGoCart mb-4">Submit</Button>
                                            <Input type="select" value={this.state.view} onChange={e => this.changeView(e.target.value)}>
                                                <option value="not available">All</option>
                                                <option value="available">Available To Approve</option>
                                                <option value="revisi">Revisi</option>
                                            </Input> */}
                                        </div>
                                    ) : (
                                        <div className="mt-3">
                                            {/* <Input type="select" value={this.state.view} onChange={e => this.changeView(e.target.value)}>
                                                <option value="not available">All</option>
                                                <option value="available">Available To Approve</option>
                                            </Input> */}
                                        </div>
                                    )}
                                    <div className={style.searchEmail}>
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
                                {level === '5' || level === '9' ? (
                                    dataPeng === undefined ? (
                                        <div></div>
                                    ) : (
                                        <Row className="bodyDispos">
                                        {dataPeng.length !== 0 && dataPeng.map(item => {
                                            return (
                                                item.status_form !== '3' ? (
                                                    null
                                                ) : (
                                                    <div className="bodyCard">
                                                    <img src={placeholder} className="imgCard1" />
                                                    <Button size="sm" color="success" className="labelBut">Pengadaan</Button>
                                                    <div className="ml-2">
                                                        <div className="txtDoc mb-2">
                                                            Pengadaan Asset
                                                        </div>
                                                        <Row className="mb-2">
                                                            <Col md={6} className="txtDoc">
                                                            Kode Area
                                                            </Col>
                                                            <Col md={6} className="txtDoc">
                                                            : {item.kode_plant}
                                                            </Col>
                                                        </Row>
                                                        <Row className="mb-2">
                                                            <Col md={6} className="txtDoc">
                                                            Area
                                                            </Col>
                                                            <Col md={6} className="txtDoc">
                                                            : {item.depo === null ? '' : item.area === null ? item.depo.nama_area : item.area}
                                                            </Col>
                                                        </Row>
                                                        <Row className="mb-2">
                                                            <Col md={6} className="txtDoc">
                                                            No Pengadaan
                                                            </Col>
                                                            <Col md={6} className="txtDoc">
                                                            : {item.no_pengadaan}
                                                            </Col>
                                                        </Row>
                                                        <Row className="mb-2">
                                                            {/* <Col md={6} className="txtDoc">
                                                            Status Approval
                                                            </Col> */}
                                                            {/* {item.appForm.find(({status}) => status === 0) !== undefined ? (
                                                                <Col md={6} className="txtDoc">
                                                                : Reject {item.appForm.find(({status}) => status === 0).jabatan}
                                                                </Col>
                                                            ) : item.appForm.find(({status}) => status === 1) !== undefined ? (
                                                                <Col md={6} className="txtDoc">
                                                                : Approve {item.appForm.find(({status}) => status === 1).jabatan}
                                                                </Col>
                                                            ) : (
                                                                <Col md={6} className="txtDoc">
                                                                : -
                                                                </Col>
                                                            )} */}
                                                        </Row>
                                                    </div>
                                                    <Row className="footCard mb-3 mt-3">
                                                        <Col md={12} xl={12}>
                                                            <Button className="btnSell" color="primary" onClick={() => this.openForm(item)}>Proses</Button>
                                                        </Col>
                                                    </Row>
                                                </div>
                                                )
                                            )
                                        })}
                                        </Row>
                                    )
                                ) : level === '2' && (
                                    dataPeng === undefined ? (
                                        <div></div>
                                    ) : (
                                        <Row className="bodyDispos">
                                        {dataPeng.length !== 0 && dataPeng.map(item => {
                                            return (
                                                dataPeng.length === 0 ? (
                                                    <div></div>
                                                ) : (
                                                    item.status_form === '9' && (
                                                        <div className="bodyCard">
                                                        <img src={placeholder} className="imgCard1" />
                                                        <Button size="sm" color="success" className="labelBut">Pengadaan</Button>
                                                        <div className="ml-2">
                                                            <div className="txtDoc mb-2">
                                                                Pengadaan Asset
                                                            </div>
                                                            <Row className="mb-2">
                                                                <Col md={6} className="txtDoc">
                                                                Kode Area
                                                                </Col>
                                                                <Col md={6} className="txtDoc">
                                                                : {item.kode_plant}
                                                                </Col>
                                                            </Row>
                                                            <Row className="mb-2">
                                                                <Col md={6} className="txtDoc">
                                                                Area
                                                                </Col>
                                                                <Col md={6} className="txtDoc">
                                                                : {item.depo === null ? '' : item.area === null ? item.depo.nama_area : item.area}
                                                                </Col>
                                                            </Row>
                                                            <Row className="mb-2">
                                                                <Col md={6} className="txtDoc">
                                                                No Pengadaan
                                                                </Col>
                                                                <Col md={6} className="txtDoc">
                                                                : {item.no_pengadaan}
                                                                </Col>
                                                            </Row>
                                                            <Row className="mb-2">
                                                                {/* <Col md={6} className="txtDoc">
                                                                Status Approval
                                                                </Col> */}
                                                                {/* {item.appForm.find(({status}) => status === 0) !== undefined ? (
                                                                    <Col md={6} className="txtDoc">
                                                                    : Reject {item.appForm.find(({status}) => status === 0).jabatan}
                                                                    </Col>
                                                                ) : item.appForm.find(({status}) => status === 1) !== undefined ? (
                                                                    <Col md={6} className="txtDoc">
                                                                    : Approve {item.appForm.find(({status}) => status === 1).jabatan}
                                                                    </Col>
                                                                ) : (
                                                                    <Col md={6} className="txtDoc">
                                                                    : -
                                                                    </Col>
                                                                )} */}
                                                            </Row>
                                                        </div>
                                                        <Row className="footCard mb-3 mt-3">
                                                            <Col md={12} xl={12}>
                                                            <Button className="btnSell" color="primary" onClick={() => this.openForm(item)}>Proses</Button>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                    )
                                                )
                                            )
                                        })}
                                        </Row>
                                    )
                                )}
                                <div>
                                </div>
                            </div>
                        </div>
                    </MaterialTitlePanel>
                </Sidebar>
                <Modal size="xl" isOpen={this.state.openModalIo} toggle={this.prosesModalIo}>
                <ModalBody className="mb-5">
                    <Container>
                        <Row className="rowModal">
                            <Col md={3} lg={3}>
                                <img src={logo} className="imgModal" />
                            </Col>
                            <Col md={9} lg={9}>
                                <text className="titModal">FORM INTERNAL ORDER ASSET</text>
                            </Col>
                        </Row>
                        <div className="mt-4 mb-3">Io type:</div>
                        <div className="mb-4">
                            <Form.Check 
                                type="checkbox"
                                label="CB-20 IO Capex"
                            />
                        </div>
                        <Row className="rowModal">
                            <Col md={2} lg={2}>
                                Nomor IO
                            </Col>
                            <Col md={10} lg={10} className="colModal">
                            <text className="mr-3">:</text>
                            <OtpInput
                                value={this.state.value}
                                onChange={this.onChange}
                                numInputs={11}
                                inputStyle={style.otp}
                                containerStyle={style.containerOtp}
                            />
                            {level === '8' && (
                                <Button className='ml-3' size='sm' color='success' onClick={() => this.updateNomorIo(detailIo[0].no_pengadaan)}>Save</Button>
                            )}
                            </Col>
                        </Row>
                        <Row className="mt-4">
                            <Col md={2} lg={2}>
                                Deskripsi
                            </Col>
                            <Col md={10} lg={10} className="colModalTab">
                                <text className="mr-3">:</text>
                                <Table bordered stripped responsive>
                                    <thead>
                                        <tr>
                                            <th>Qty</th>
                                            <th>Description</th>
                                            <th>Price/unit</th>
                                            <th>Total Amount</th>
                                            {level === '2' && (
                                                <th>Cek IT</th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {detailIo !== undefined && detailIo.length > 0 && detailIo.map(item => {
                                            return (
                                                item.isAsset === 'false' ? (
                                                    null
                                                ) : (
                                                    <tr onClick={() => this.openModalRinci()}>
                                                        <td>{item.qty}</td>
                                                        <td>{item.nama}</td>
                                                        <td>Rp {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                        <td>Rp {(parseInt(item.price) * parseInt(item.qty)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                        {level === '2' && (
                                                            <td className='colTable'>
                                                                <div>
                                                                    <Input
                                                                    addon
                                                                    checked={item.jenis === 'it' ? true : false}
                                                                    type="checkbox"
                                                                    onClick={() => this.updateIo({item: item, value: 'it'})}
                                                                    value={item.no_asset} />
                                                                    <text className='ml-2'>IT</text>
                                                                </div>
                                                                <div>
                                                                    <Input
                                                                    addon
                                                                    checked={item.jenis === 'non-it' ? true : false}
                                                                    type="checkbox"
                                                                    onClick={() => this.updateIo({item: item, value: 'non-it'})}
                                                                    value={item.no_asset} />
                                                                    <text className='ml-2'>NON IT</text>
                                                                </div>
                                                            </td>
                                                        )}
                                                    </tr>
                                                )
                                            )
                                        })}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                        <Row className="rowModal mt-4">
                            <Col md={2} lg={2}>
                                Cost Center
                            </Col>
                            <Col md={10} lg={10} className="colModal">
                            <text className="mr-3">:</text>
                            <OtpInput
                                value={detailIo[0] === undefined ? '' : detailIo[0].depo === undefined ? '' : detailIo[0].depo === null ? '' : detailIo[0].depo.cost_center}
                                isDisabled
                                numInputs={10}
                                inputStyle={style.otp}
                                containerStyle={style.containerOtp}
                            />
                            </Col>
                        </Row>
                        <Row className="rowModal mt-2">
                            <Col md={2} lg={2}>
                                Profit Center
                            </Col>
                            <Col md={10} lg={10} className="colModal">
                            <text className="mr-3">:</text>
                            <OtpInput
                                value={detailIo[0] === undefined ? '' : detailIo[0].depo === undefined ? '' : detailIo[0].depo === null ? '' : detailIo[0].depo.profit_center}
                                isDisabled
                                numInputs={10}
                                inputStyle={style.otp}
                                containerStyle={style.containerOtp}
                            />
                            </Col>
                        </Row>
                        <Row className="rowModal mt-4">
                            <Col md={2} lg={2}>
                                Kategori
                            </Col>
                            <Col md={10} lg={10} className="colModal">
                            <text className="mr-3">:</text>
                                <Col md={4} lg={4}>
                                    <Form.Check 
                                        type="checkbox"
                                        label="Budget"
                                        checked={detailIo[0] === undefined ? '' : detailIo[0].kategori === 'budget' ? true : false}
                                    />
                                </Col>
                                <Col md={4} lg={4}>
                                    <Form.Check 
                                        type="checkbox"
                                        label="Non Budgeted"
                                        checked={detailIo[0] === undefined ? '' : detailIo[0].kategori === 'non-budget' ? true : false}
                                    />
                                </Col>
                                <Col md={4} lg={4}>
                                    <Form.Check 
                                        type="checkbox"
                                        label="Return"
                                        checked={detailIo[0] === undefined ? '' : detailIo[0].kategori === 'return' ? true : false}
                                    />
                                </Col>
                            </Col>
                        </Row>
                        <Row className="rowModal mt-4">
                            <Col md={2} lg={2}>
                                Amount
                            </Col>
                            <Col md={10} lg={10} className="colModal">
                            <text className="mr-3">:</text>
                            <text>Rp {total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</text>
                            </Col>
                        </Row>
                        <Row className="rowModal mt-4">
                            <Col md={2} lg={2}>
                                Alasan
                            </Col>
                            <Col md={10} lg={10} className="colModal">
                            <text className="mr-3">:</text>
                            <text>-</text>
                            </Col>
                        </Row>
                    </Container>
                </ModalBody>
                <hr />
                <div className="modalFoot">
                    <div className="btnFoot">
                        <Button className="ml-4" color="primary" onClick={this.prosesModalDoc}>
                            Dokumen 
                        </Button>
                        <Button className="ml-2" color="warning" onClick={() => this.openModPreview(detailIo[0])}>
                            Preview
                        </Button>
                    </div>
                    {level === '2' ? (
                        <div className="btnFoot">
                            <Button className="mr-2" color="primary" onClick={this.openTemp}>
                                Fill No.Asset
                            </Button>
                            <Button color="success" onClick={() => this.submitAsset(detailIo[0].no_pengadaan)}>
                                Submit
                            </Button>
                        </div>
                    ) : (
                        null
                    )}
                </div>
            </Modal>
            <Modal size="xl" isOpen={this.state.openFill} toggle={this.openFill}>
                <ModalHeader>
                    Filling No. Asset
                </ModalHeader>
                <ModalBody>
                    <Alert color="info" className="alertWrong" isOpen={false}>
                        <div>Gunakan tanda koma (,) sebagai pemisah antara nomor asset satu dengan yang lainnya, ex: 1000876,20006784,1000756</div>
                    </Alert>
                    <Table bordered stripped responsive id="table-to-xls">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>No Pengadaan</th>
                                <th>Description</th>
                                <th>Price/unit</th>
                                <th>Total Amount</th>
                                <th>No Asset</th>
                                <th>ID Asset</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataTemp !== undefined && dataTemp.length > 0 && dataTemp.map(item => {
                                return (
                                    // item.isAsset === 'false' ? (
                                    //     null
                                    // ) : (
                                        <tr onClick={() => this.openModalRinci()}>
                                            <td>{dataTemp.indexOf(item) + 1}</td>
                                            <th>{item.no_pengadaan}</th>
                                            <td>{item.nama}</td>
                                            <td>Rp {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                            <td>Rp {(parseInt(item.price) * parseInt(item.qty)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                            <td onClick={() => this.downloadTemp('false')}>
                                                {this.state.download === 'true' ? (
                                                    item.no_asset
                                                ) : (
                                                    <Input 
                                                    name="no_asset"
                                                    value={this.state.idTab == item.id ? null : item.no_asset !== null ? item.no_asset : ''}
                                                    defaultValue={item.no_asset === null ? '' : item.no_asset}
                                                    onChange={e => this.updateNoAsset({item: item, target: e.target, key: e.key})}
                                                    onKeyPress={e => this.updateNoAsset({item: item, target: e.target, key: e.key})}
                                                     />
                                                )}
                                            </td>
                                            <td>{item.id}</td>
                                        </tr>
                                    // )
                                )
                            })}
                        </tbody>
                    </Table>
                    <div className="mt-3 modalFoot">
                        <div className="btnFoot" onClick={() => this.downloadTemp('true')}>
                            {this.state.download === 'true' ? (
                                <ReactHtmlToExcel
                                    id="test-table-xls-button"
                                    className="btn btn-success"
                                    table="table-to-xls"
                                    filename="Filling No asset"
                                    sheet="Template"
                                    buttonText="Download Template"
                                />
                            ) : (
                            <Button className="mr-2" color="warning" onClick={() => this.downloadTemp('true')}>
                                Download
                            </Button>
                            )}
                        </div>
                        <div className="btnFoot">
                            <Button className="mr-2" color="primary" onClick={this.openModalUpload} >
                                Upload
                            </Button>
                            <Button color="secondary" onClick={this.openFill}>
                                Close
                            </Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
            <Modal size="xl" isOpen={this.state.preview} toggle={this.openPreview}>
                <ModalBody className="mb-5">
                    <Container>
                        <Row className="rowModal">
                            <Col md={3} lg={3}>
                                <img src={logo} className="imgModal" />
                            </Col>
                            <Col md={9} lg={9}>
                                <text className="titModal">FORM INTERNAL ORDER ASSET</text>
                            </Col>
                        </Row>
                        <div className="mt-4 mb-3">Io type:</div>
                        <div className="mb-4">
                            <Form.Check 
                                type="checkbox"
                                label="CB-20 IO Capex"
                            />
                        </div>
                        <Row className="rowModal">
                            <Col md={2} lg={2}>
                                Nomor IO
                            </Col>
                            <Col md={10} lg={10} className="colModal">
                            <text className="mr-3">:</text>
                            <OtpInput
                                value={this.state.value}
                                onChange={this.onChange}
                                numInputs={11}
                                inputStyle={style.otp}
                                containerStyle={style.containerOtp}
                                isDisabled
                            />
                            </Col>
                        </Row>
                        <Row className="mt-4">
                            <Col md={2} lg={2}>
                                Deskripsi
                            </Col>
                            <Col md={10} lg={10} className="colModalTab">
                                <text className="mr-3">:</text>
                                <Table bordered stripped responsive>
                                    <thead>
                                        <tr>
                                            <th>Qty</th>
                                            <th>Description</th>
                                            <th>Price/unit</th>
                                            <th>Total Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {detailIo !== undefined && detailIo.length > 0 && detailIo.map(item => {
                                            return (
                                                item.isAsset === 'false' && level !== '2' ? (
                                                    null
                                                ) : (
                                                <tr onClick={() => this.openModalRinci()}>
                                                    <td>{item.qty}</td>
                                                    <td>{item.nama}</td>
                                                    <td>Rp {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                    <td>Rp {(parseInt(item.price) * parseInt(item.qty).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."))}</td>
                                                </tr>
                                                )
                                            )
                                        })}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                        <Row className="rowModal mt-4">
                            <Col md={2} lg={2}>
                                Cost Center
                            </Col>
                            <Col md={10} lg={10} className="colModal">
                            <text className="mr-3">:</text>
                            <OtpInput
                                value={detailIo[0] === undefined ? '' : detailIo[0].depo === undefined ? '' : detailIo[0].depo === null ? '' : detailIo[0].depo.cost_center}
                                isDisabled
                                numInputs={10}
                                inputStyle={style.otp}
                                containerStyle={style.containerOtp}
                            />
                            </Col>
                        </Row>
                        <Row className="rowModal mt-2">
                            <Col md={2} lg={2}>
                                Profit Center
                            </Col>
                            <Col md={10} lg={10} className="colModal">
                            <text className="mr-3">:</text>
                            <OtpInput
                                value={detailIo[0] === undefined ? '' : detailIo[0].depo === undefined ? '' : detailIo[0].depo === null ? '' : detailIo[0].depo.profit_center}
                                isDisabled
                                numInputs={10}
                                inputStyle={style.otp}
                                containerStyle={style.containerOtp}
                            />
                            </Col>
                        </Row>
                        <Row className="rowModal mt-4">
                            <Col md={2} lg={2}>
                                Kategori
                            </Col>
                            <Col md={10} lg={10} className="colModal">
                            <text className="mr-3">:</text>
                                <Col md={4} lg={4}>
                                    <Form.Check 
                                        type="checkbox"
                                        label="Budget"
                                        checked={detailIo[0] === undefined ? '' : detailIo[0].kategori === 'budget' ? true : false}
                                    />
                                </Col>
                                <Col md={4} lg={4}>
                                    <Form.Check 
                                        type="checkbox"
                                        label="Non Budgeted"
                                        checked={detailIo[0] === undefined ? '' : detailIo[0].kategori === 'non-budget' ? true : false}
                                    />
                                </Col>
                                <Col md={4} lg={4}>
                                    <Form.Check 
                                        type="checkbox"
                                        label="Return"
                                        checked={detailIo[0] === undefined ? '' : detailIo[0].kategori === 'return' ? true : false}
                                    />
                                </Col>
                            </Col>
                        </Row>
                        <Row className="rowModal mt-4">
                            <Col md={2} lg={2}>
                                Amount
                            </Col>
                            <Col md={10} lg={10} className="colModal">
                            <text className="mr-3">:</text>
                            <text>Rp {total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</text>
                            </Col>
                        </Row>
                        <Row className="rowModal mt-4">
                            <Col md={2} lg={2}>
                                Alasan
                            </Col>
                            <Col md={10} lg={10} className="colModal">
                            <text className="mr-3">:</text>
                            <text>-</text>
                            </Col>
                        </Row>
                    </Container>
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
                                                {dataApp.pembuat !== undefined && dataApp.pembuat.map(item => {
                                                    return (
                                                        <th className="headPre">
                                                            <div className="mb-2">{item.nama === null ? "-" : item.status === 0 ? 'Reject' : moment(item.updatedAt).format('LL')}</div>
                                                            <div>{item.nama === null ? "-" : item.nama}</div>
                                                        </th>
                                                    )
                                                })}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                            {dataApp.pembuat !== undefined && dataApp.pembuat.map(item => {
                                                return (
                                                    <td className="footPre">{item.jabatan === null ? "-" : item.jabatan === 'area' ? 'AOS' : item.jabatan}</td>
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
                                                {dataApp.pemeriksa !== undefined && dataApp.pemeriksa.map(item => {
                                                    return (
                                                        <th className="headPre">
                                                            <div className="mb-2">{item.nama === null ? "-" : item.status === 0 ? 'Reject' : moment(item.updatedAt).format('LL')}</div>
                                                            <div>{item.nama === null ? "-" : item.nama}</div>
                                                        </th>
                                                    )
                                                })}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                {dataApp.pemeriksa !== undefined && dataApp.pemeriksa.map(item => {
                                                    return (
                                                        <td className="footPre">{item.jabatan === null ? "-" : item.jabatan === 'ROM' ? 'OM' : item.jabatan}</td>
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
                                                {dataApp.penyetuju !== undefined && dataApp.penyetuju.map(item => {
                                                    return (
                                                        <th className="headPre">
                                                            <div className="mb-2">{item.nama === null ? "-" : item.status === 0 ? 'Reject' : moment(item.updatedAt).format('LL')}</div>
                                                            <div>{item.nama === null ? "-" : item.nama}</div>
                                                        </th>
                                                    )
                                                })}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                {dataApp.penyetuju !== undefined && dataApp.penyetuju.map(item => {
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
                <div className="modalFoot">
                    <div className="btnFoot">
                    </div>
                    <div className="btnFoot">
                        <Button className="mr-2" color="warning" onClick={this.openPreview}>
                            Download
                        </Button>
                        <Button color="secondary" onClick={this.openPreview}>
                            Close 
                        </Button>
                    </div>
                </div>
            </Modal>
            <Modal>
                <ModalBody>
                    
                </ModalBody>
            </Modal>
            <Modal size="md" isOpen={this.state.openModalTtd} toggle={this.prosesModalTtd}>
                <ModalHeader>
                    Proses Tanda Tangan
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Col md={3} lg={3}>
                            Nama
                        </Col>
                        <Col md={9} lg={9}>
                            : <input />
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button variant="secondary" onClick={this.prosesModalTtd}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={this.prosesModalTtd}>
                        Save 
                    </Button>
                </ModalFooter>
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
                                    <Col md={12} lg={12} >
                                        <text>{dataDoc.indexOf(x) + 1}. {x.nama_dokumen}</text>
                                    </Col>
                                    {x.path !== null ? (
                                        <Col md={12} lg={12} >
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
                                                // className="ml-4"
                                                type="file"
                                                onClick={() => this.setState({detail: x})}
                                                onChange={this.onChangeUpload}
                                                />
                                            </div>
                                        </Col>
                                    ) : (
                                        <Col md={12} lg={12} >
                                            <input
                                            // className="ml-4"
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
            <Modal isOpen={this.props.pengadaan.isLoading ? true: false} size="sm">
                <ModalBody>
                    <div>
                        <div className={style.cekUpdate}>
                            <Spinner />
                            <div sucUpdate>Waiting....</div>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
            <Modal isOpen={this.props.pengadaan.isUpload ? true: false} size="sm">
                <ModalBody>
                    <div>
                        <div className={style.cekUpdate}>
                            <AiFillCheckCircle size={80} className={style.green} />
                            <div className={[style.sucUpdate, style.green]}>Success</div>
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
                                {/* <div>{moment(this.state.date).format('LLL')}</div> */}
                                <Button variant="success">Download</Button>
                            </div>
                        {level === '1' || level === '2' || level === '3' ? (
                            <div>
                                <Button variant="danger" className="mr-3" onClick={this.openModalReject}>Reject</Button>
                                <Button variant="primary" onClick={this.openModalApprove}>Approve</Button>
                            </div>
                            ) : (
                                <Button variant="primary" onClick={() => this.setState({openPdf: false})}>Close</Button>
                            )}
                        </div>
                    </ModalBody>
                    {/* {level === '1' || level === '2' || level === '3' ? (
                    
                    <ModalFooter>
                        <div>{moment(this.state.date).format('LL')}</div>
                        <Button color="danger" onClick={this.openModalReject}>Reject</Button>
                        <Button color="primary" onClick={this.openModalApprove}>Approve</Button>
                    </ModalFooter>
                    ) : (
                    <ModalFooter>
                        <Button color="primary" onClick={() => this.setState({openPdf: false})}>Close</Button>
                    </ModalFooter>)} */}
                </Modal>
                <Modal isOpen={this.state.openApprove} toggle={this.openModalApprove} centered={true}>
                    <ModalBody>
                        <div className={style.modalApprove}>
                            <div>
                                <text>
                                    Anda yakin untuk approve 
                                    <text className={style.verif}> {this.state.fileName.nama_dokumen} </text>
                                    pada tanggal
                                    <text className={style.verif}> {moment().format('LL')}</text> ?
                                </text>
                            </div>
                            <div className={style.btnApprove}>
                                <Button variant="primary" onClick={this.approveDokumen}>Ya</Button>
                                <Button variant="secondary" onClick={this.openModalApprove}>Tidak</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.openReject} toggle={this.openModalReject} centered={true}>
                    <ModalBody>
                    <Formik
                    initialValues={{
                    alasan: "",
                    }}
                    validationSchema={alasanSchema}
                    onSubmit={(values) => {this.rejectIo(values)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                            <div className={style.modalApprove}>
                            <div className={style.quest}>Anda yakin untuk reject ?</div>
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
                                <Button color="secondary" onClick={this.openModalReject}>Tidak</Button>
                            </div>
                        </div>
                        )}
                        </Formik>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.openApproveIo} toggle={this.openModalApproveIo} centered={true}>
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
                                <Button color="primary" onClick={this.approveIo}>Ya</Button>
                                <Button color="secondary" onClick={this.openModalApproveIo}>Tidak</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalConfirm} toggle={this.openConfirm} size="sm">
                <ModalBody>
                    {this.state.confirm === 'submit' ?(
                        <div>
                            <div className={style.cekUpdate}>
                            <AiFillCheckCircle size={80} className={style.green} />
                            <div className={[style.sucUpdate, style.green]}>Berhasil Submit</div>
                        </div>
                        </div>
                    ) : this.state.confirm === 'isupdate' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Update Nomor IO</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'approve' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Approve</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'success' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Upload</div>
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
                        </div>
                        </div>
                    ) : this.state.confirm === 'rejReject' ?(
                        <div>
                            <div className={style.cekUpdate}>
                            <AiOutlineClose size={80} className={style.red} />
                            <div className={[style.sucUpdate, style.green]}>Gagal Reject</div>
                        </div>
                        </div>
                    ) : this.state.confirm === 'failed' ?(
                        <div>
                            <div className={style.cekUpdate}>
                            <AiOutlineClose size={80} className={style.red} />
                            <div className={[style.sucUpdate, style.green]}>Gagal Upload</div>
                        </div>
                        </div>
                    ) : this.state.confirm === 'rejSubmit' ?(
                        <div>
                            <div className={style.cekUpdate}>
                            <AiOutlineClose size={80} className={style.red} />
                            <div className={[style.sucUpdate, style.green]}>Gagal Submit</div>
                            <div className="errApprove mt-2">Mohon isi Nomor IO terlebih dahulu</div>
                        </div>
                        </div>
                    ) : this.state.confirm === 'falseSubmit' ?(
                        <div>
                            <div className={style.cekUpdate}>
                            <AiOutlineClose size={80} className={style.red} />
                            <div className={[style.sucUpdate, style.green]}>Gagal Submit</div>
                            <div className="errApprove mt-2">Pastikan telah mengidentifikasi status IT dan mengisi no asset dengan benar</div>
                        </div>
                        </div>
                    ) : this.state.confirm === 'sucpods' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil submit dan kirim ke pods</div>
                                <div className="errApprove mt-2">Berhasil kirim data ke pods</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'falpods' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineInfoCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil submit</div>
                                <div className="errApprove mt-2">Gagal kirim data ke pods</div>
                            </div>
                        </div>
                    ) : (
                        <div></div>
                    )}
                </ModalBody>
            </Modal>
            <Modal toggle={this.openModalUpload} isOpen={this.state.modalUpload} >
                <ModalHeader>Upload File Excel</ModalHeader>
                <ModalBody className={style.modalUpload}>
                    <div className={style.titleModalUpload}>
                        <text>Upload File: </text>
                        <div className={style.uploadFileInput}>
                            <AiOutlineFileExcel size={35} />
                            <div className="ml-3">
                                <Input
                                type="file"
                                name="file"
                                accept=".xls,.xlsx"
                                onChange={this.onChangeHandler}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={style.btnUpload}>
                        <div></div>
                        
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" disabled={this.state.fileUpload === "" ? true : false } onClick={this.uploadMaster}>Upload</Button>
                    <Button onClick={this.openModalUpload}>Cancel</Button>
                </ModalFooter>
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
    setuju: state.setuju,
    notif: state.notif,
    auth: state.auth
})

const mapDispatchToProps = {
    logout: auth.logout,
    getNotif: notif.getNotif,
    resetAuth: auth.resetError,
    getPengadaan: pengadaan.getPengadaan,
    getApproveIo: pengadaan.getApproveIo,
    getDocumentIo: pengadaan.getDocumentIo,
    uploadDocument: pengadaan.uploadDocument,
    approveDocument: pengadaan.approveDocument,
    rejectDocument: pengadaan.rejectDocument,
    resetError: pengadaan.resetError,
    showDokumen: pengadaan.showDokumen,
    getDetail: pengadaan.getDetail,
    updateDataIo: pengadaan.updateDataIo,
    submitIsAsset: pengadaan.submitIsAsset,
    updateNoIo: pengadaan.updateNoIo,
    submitBudget: pengadaan.submitBudget,
    approveIo: pengadaan.approveIo,
    rejectIo: pengadaan.rejectIo,
    resetApp: pengadaan.resetApp,
    updateNoAsset: pengadaan.updateNoAsset,
    submitEks: pengadaan.submitEks,
    getTempAsset: pengadaan.getTempAsset,
    updateTemp: pengadaan.updateTemp,
    uploadMasterTemp: pengadaan.uploadMasterTemp,
    podsSend: pengadaan.podsSend
}

export default connect(mapStateToProps, mapDispatchToProps)(EksekusiTicket)
