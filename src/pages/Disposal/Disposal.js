/* eslint-disable jsx-a11y/no-distracting-elements */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react'
import { Container, NavbarBrand, Table, Input, Button, Col,
    Alert, Spinner, Row, Modal, ModalBody, ModalHeader, ModalFooter,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap'
import style from '../../assets/css/input.module.css'
import {FaSearch, FaUserCircle, FaBars, FaCartPlus, FaFileSignature} from 'react-icons/fa'
import {BsCircle, BsBell, BsFillCircleFill} from 'react-icons/bs'
import { AiOutlineCheck, AiOutlineClose, AiFillCheckCircle, AiOutlineInbox} from 'react-icons/ai'
import {Formik} from 'formik'
import * as Yup from 'yup'
import Pdf from "../../components/Pdf"
import asset from '../../redux/actions/asset'
import pengadaan from '../../redux/actions/pengadaan'
import approve from '../../redux/actions/approve'
import user from '../../redux/actions/user'
import {connect} from 'react-redux'
import tracking from '../../redux/actions/tracking'
import moment from 'moment'
import auth from '../../redux/actions/auth'
import setuju from '../../redux/actions/setuju'
import {default as axios} from 'axios'
import Sidebar from "../../components/Header"
import MaterialTitlePanel from "../../components/material_title_panel"
import SidebarContent from "../../components/sidebar_content"
import placeholder from  "../../assets/img/placeholder.png"
import disposal from '../../redux/actions/disposal'
import b from "../../assets/img/b.jpg"
import e from "../../assets/img/e.jpg"
import TablePeng from '../../components/TablePeng'
import notif from '../../redux/actions/notif'
import NavBar from '../../components/NavBar'
import styleTrans from '../../assets/css/transaksi.module.css'
import NewNavbar from '../../components/NewNavbar'
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
            limit: 10,
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
            openApproveDis: false,
            openRejectDis: false,
            fileName: {},
            dataApp: {},
            img: '',
            limImage: 20000,
            submitPre: false,
            date: '',
            filter: '',
            newDis: [],
            app: [],
            find: null,
            listMut: [],
            listStat: [],
            baseData: []
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

    getApproveDis = async (value) => {
        const token = localStorage.getItem('token')
        await this.props.getApproveDisposal(token, value.no, value.nama)
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

    openModalRinci = () => {
        this.setState({modalRinci: !this.state.modalRinci})
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
        this.setState({openModalDoc: !this.state.openModalDoc})
    }

    openModalApproveDis = () => {
        this.setState({openApproveDis: !this.state.openApproveDis})
    }
    openModalRejectDis = () => {
        this.setState({openRejectDis: !this.state.openRejectDis})
    }

    openModalReject = () => {
        this.setState({listStat: [], openReject: !this.state.openReject})
    }

    openModalApprove = () => {
        this.setState({openApprove: !this.state.openApprove})
    }

    modalSubmitPre = () => {
        this.setState({submitPre: !this.state.submitPre})
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
        this.setState({openRejectDis: !this.state.openRejectDis})
        await this.props.rejectDocDis(token, fileName.id, value, 'edit', 'peng')
        this.openModalPdf()
    }

    openProsesModalDoc = async () => {
        const token = localStorage.getItem('token')
        const { dataRinci } = this.state
        await this.props.getDocumentDis(token, dataRinci.no_asset, 'disposal', 'pengajuan')
        this.closeProsesModalDoc()
    }


    approveDisposal = async (value) => {
        const token = localStorage.getItem('token')
        await this.props.approveDisposal(token, value)
        this.getDataDisposal()
        this.openModalApprove()
        this.openConfirm(this.setState({confirm: 'approve'}))
        this.openModalDis()
        await this.props.notifDisposal(token, value, 'approve', 'HO', null, null)
    }

    rejectDisposal = async (value) => {
        const detailData = this.props.disposal.detailDis
        const list  = this.state.listMut
        const { listStat } = this.state
        const token = localStorage.getItem('token')
        if (detailData.length !== list.length && value.value.jenis_reject === "batal") {
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
            await this.props.rejectDisposal(token, value.no, data, value.value.jenis_reject, status)
            this.getDataDisposal()
            this.openModalReject()
            this.openModalDis()
            this.openConfirm(this.setState({confirm: 'reject'}))
            await this.props.notifDisposal(token, value, 'reject', value.value.jenis_reject, null, null)
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

    getDetailDisposal = async (value) => {
        const { dataDis } = this.props.disposal
        const token = localStorage.getItem('token')
        const detail = []
        await this.props.getDetailDis(token, value, 'pengajuan')
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

    componentDidUpdate() {
        const {isError, isUpload, isExport} = this.props.asset
        const {isRoute} = this.props.auth
        const {isAdd, isAppDoc, isRejDoc, approve, reject, rejReject, rejApprove} = this.props.disposal
        const token = localStorage.getItem('token')
        const { dataRinci } = this.state
        if (isError) {
            this.props.resetError()
            this.showAlert()
        } else if (isRoute) {
            const route = localStorage.getItem('route')
            this.props.resetAuth()
            this.props.history.push(`/${route}`)
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
                this.props.getDocumentDis(token, dataRinci.no_asset, 'disposal', 'pengajuan')
             }, 1100)
        } 
        // else if (reject) {
        //     this.openConfirm(this.setState({confirm: 'reject'}))
        //     this.props.resAppRej()
        //     this.openModalDis()
        // }
        // else if (approve) {
        //     this.openConfirm(this.setState({confirm: 'approve'}))
        //     this.props.resAppRej()
        //     this.openModalDis()
        // }
        else if (rejReject) {
            this.openConfirm(this.setState({confirm: 'rejReject'}))
            this.openModalReject()
            this.props.resAppRej()
        } else if (rejApprove) {
            this.openConfirm(this.setState({confirm: 'rejApprove'}))
            this.openModalApprove()
            this.props.resAppRej()
        }
    }

    onSearch = async (e) => {
        const str = e.target.value
        this.setState({search: e.target.value})
        const {baseData} = this.state 
        const newData = []
        if(e.key === 'Enter'){
            if (str === '') {
                this.setState({newDis: baseData})
            } else {
                for (let i = 0; i < baseData.length; i++) {
                    const data = Object.values(baseData[i])
                    const cek = []
                    for (let j = 0; j < data.length; j++) {
                        if (typeof data[j] !== 'object' && data[j] !== null && data[j] !== undefined) {
                            const senten = data[j].toString()
                            if (senten.includes(str)) {
                                cek.push(1)
                            }
                        }
                    }
                    if (cek.length) {
                        newData.push(baseData[i])
                    }
                }
                this.setState({newDis: newData})
            }
        } else if (str === '') {
            this.setState({newDis: baseData})
        }
    }

    goSetDispos = async (val) => {
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
        const level = localStorage.getItem('level')
        this.getNotif()
        if (level === "5" || level === '9') {
            this.getDataTrack()
        } else {
            this.getDataDisposal()
        }
    }

    getDataTrack = async () => {
        const token = localStorage.getItem('token')
        await this.props.getTrack(token)
        this.changeFilter('all')
    }

    getDataAsset = async (value) => {
        const token = localStorage.getItem("token")
        const { page } = this.props.asset
        const search = value === undefined ? '' : this.state.search
        const limit = value === undefined ? this.state.limit : value.limit
        await this.props.getAsset(token, limit, search, page === undefined || page.currentPage === undefined ? 1 : page.currentPage, 'disposal')
        this.setState({limit: value === undefined ? 10 : value.limit})
    }

    getDataDisposal = async (value) => {
        const token = localStorage.getItem("token")
        const { page } = this.props.disposal
        const search = value === undefined ? '' : this.state.search
        const limit = value === undefined ? this.state.limit : value.limit
        await this.props.getDisposal(token, limit, search, page === undefined || page.currentPage === undefined ? 1 : page.currentPage, 2)
        await this.props.getRole(token)
        this.changeFilter('available')
        this.setState({limit: value === undefined ? 10 : value.limit})
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

    changeFilter = (val) => {
        const role = localStorage.getItem('role')
        const level = localStorage.getItem('level')
        const { dataDis, noDis } = this.props.disposal
        const aosDis = this.props.tracking.dataDis
        const aosNo = this.props.tracking.noDis
        const dataTemp = level === '5' ?  aosDis : dataDis
        const noTemp = level === '5' ?  aosNo : noDis
        const {dataRole} = this.props.user
        const divisi = level === '16' || level === '13' ? dataRole.find(({nomor}) => nomor === '27').name : role
        if (val === 'available') {
            const newDis = []
            for (let i = 0; i < noTemp.length; i++) {
                const index = dataTemp.indexOf(dataTemp.find(({no_disposal}) => no_disposal === noTemp[i]))
                if (dataTemp[index] !== undefined && dataTemp[index].status_form !== 26) {
                    const app = dataTemp[index].appForm
                    const find = app.indexOf(app.find(({jabatan}) => jabatan === role))
                    const findApp = app.indexOf(app.find(({jabatan}) => jabatan === divisi))
                    if (level === '11') {
                        if (app[find] !== undefined && app[find + 1].status === 1 && (app[find].status === null)) {
                            newDis.push(dataTemp[index])
                        }
                    } else if (level === '12' || level === '27') {
                        if ((app.length === 0 || app[app.length - 1].status === null) || (app[find] !== undefined && app[find + 1].status === 1 && app[find - 1].status === null && (app[find].status === null))) {
                            newDis.push(dataTemp[index])
                        }
                    } else if (level === '13' || level === '16') {
                        if ((app.length === 0 || app[app.length - 1].status === null) || (app[find] !== undefined && app[find + 1].status === 1 && (app[find].status === null))) {
                            newDis.push(dataTemp[index])
                        } else if ((app.length === 0 || app[app.length - 1].status === null) || (app[findApp] !== undefined && app[findApp + 1].status === 1 && (app[findApp].status === null))) {
                            newDis.push(dataTemp[index])
                        }
                    } else if (find === 0 || find === '0') {
                        if (app[find] !== undefined && app[find + 1].status === 1 && app[find].status === null) {
                            newDis.push(dataTemp[index])
                        }
                    } else {
                        if (app[find] !== undefined && app[find + 1].status === 1 && app[find - 1].status === null && app[find].status === null) {
                            newDis.push(dataTemp[index])
                        }
                    }
                }
            }
            this.setState({filter: val, newDis: newDis, baseData: newDis})
        } else if (val === 'revisi') {
            const newDis = []
            for (let i = 0; i < noTemp.length; i++) {
                const index = dataTemp.indexOf(dataTemp.find(({no_disposal}) => no_disposal === noTemp[i]))
                const resdis = dataTemp[index]
                const app = dataTemp[index].appForm
                const find = app.indexOf(app.find(({jabatan}) => jabatan === role))
                const findApp = app.indexOf(app.find(({jabatan}) => jabatan === divisi))
                if (resdis !== undefined && resdis.status_reject === 4) {
                    if (app[find] !== undefined && app[find].status === 0) {
                        newDis.push(resdis)
                    }
                }
            }
            this.setState({filter: val, newDis: newDis, baseData: newDis})
        } else if (val === 'reject') {
            const newDis = []
            for (let i = 0; i < noTemp.length; i++) {
                const index = dataTemp.indexOf(dataTemp.find(({no_disposal}) => no_disposal === noTemp[i]))
                const resdis = dataTemp[index]
                if (resdis !== undefined && resdis.status_reject !== null) {
                    newDis.push(resdis)
                }
            }
            this.setState({filter: val, newDis: newDis, baseData: newDis})
        } else if (val === 'full') {
            const newDis = []
            for (let i = 0; i < noTemp.length; i++) {
                const index = dataTemp.indexOf(dataTemp.find(({no_disposal}) => no_disposal === noTemp[i]))
                const resdis = dataTemp[index]
                const app = dataTemp[index].appForm
                if (app.find(({status}) => status === 0) === undefined && app.find(({status}) => status === null) === undefined) {
                    newDis.push(resdis)
                }
            }
            this.setState({filter: val, newDis: newDis, baseData: newDis})
        } else {
            const newDis = []
            for (let i = 0; i < noTemp.length; i++) {
                const index = dataTemp.indexOf(dataTemp.find(({no_disposal}) => no_disposal === noTemp[i]))
                if (dataTemp[index] !== undefined) {
                    newDis.push(dataTemp[index])
                }
            }
            this.setState({filter: val, newDis: newDis, baseData: newDis})
        }
    }

    render() {
        const {alert, upload, errMsg, detailDis, app, find, fileName, listMut, listStat} = this.state
        const {dataAsset, alertM, alertMsg, alertUpload, page} = this.props.asset
        const pages = this.props.disposal.page 
        const { dataDis, noDis, dataDoc, disApp, dataSubmit } = this.props.disposal
        const detailData = this.props.disposal.detailDis
        const {dataRinci, newDis} = this.state
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
                {/* <Sidebar {...sidebarProps}>
                    <MaterialTitlePanel title={contentHeader}>
                        <div className={style.backgroundLogo}>
                            <div className={style.bodyDashboard}>
                                <div className={style.headMaster}> 
                                    <div className={style.titleDashboard}>Disposal Asset</div>
                                </div>
                                <div className={level === '2' ? style.secEmail1 : style.secEmail}>
                                    {level === '5' || level === '9' ? (
                                        <div className={style.headEmail}>
                                            <Button size='lg' color="success" onClick={this.goCartDispos}>Create</Button>
                                        </div>
                                    ) : level === '2' || level === '12' || level === '27' ? (
                                        <div className="mt-5">
                                            {level === '2' && this.state.view === 'full' && (
                                                <Button onClick={this.getSubmitDisposal} color="info" size="lg" className="mb-4">Submit</Button>
                                            )}
                                            <Input type="select" value={this.state.view} onChange={e => this.changeFilter(e.target.value)}>
                                                <option value="all">All</option>
                                                <option value="available">Available Approve</option>
                                                <option value="revisi">Available Reapprove (Revisi)</option>
                                                <option value="full">Full Approve</option>
                                                <option value="reject">Reject</option>
                                            </Input>
                                        </div>
                                    ) : (
                                        <div className="mt-3">
                                            <Input type="select" value={this.state.view} onChange={e => this.changeFilter(e.target.value)}>
                                                <option value="all">All</option>
                                                <option value="available">Available Approve</option>
                                                <option value="revisi">Available Reapprove (Revisi)</option>
                                                <option value="full">Full Approve</option>
                                                <option value="reject">Reject</option>
                                            </Input>
                                        </div>
                                    )}
                                    <div className={style.searchEmail2}>
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
                                    <Table bordered striped responsive hover className={style.tab}>
                                        <thead>
                                            <tr>
                                                <th>NO</th>
                                                <th>NO.AJUAN</th>
                                                <th>AREA</th>
                                                <th>KODE PLANT</th>
                                                <th>COST CENTER</th>
                                                <th>TANGGAL SUBMIT</th>
                                                <th>STATUS</th>
                                                <th>OPSI</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {newDis.length !== 0 && newDis.map(item => {
                                            return (
                                                <tr className={item.status_reject === 0 ? 'note' : item.status_transaksi === 0 ? 'fail' : item.status_reject === 1 && 'bad'}>
                                                    <td>{newDis.indexOf(item) + 1}</td>
                                                    <td>{item.no_disposal}</td>
                                                    <td>{item.area}</td>
                                                    <td>{item.kode_plant}</td>
                                                    <td>{item.cost_center}</td>
                                                    <td>{moment(item.tanggalDis).format('DD MMMM YYYY')}</td>
                                                    <td>On Proses</td>
                                                    <td>
                                                        <Button color="primary" className='mr-1 mb-1' onClick={() => {this.getDetailDisposal(item.no_disposal); this.getApproveDis({nama: item.kode_plant.split('').length === 4 ? 'disposal pengajuan' :  'disposal pengajuan HO', no: item.no_disposal})}}>
                                                            Rincian
                                                        </Button>
                                                        <Button color="warning" onClick={() => {this.getDetailDisposal(item.no_disposal); this.getApproveDis({nama: item.kode_plant.split('').length === 4 ? 'disposal pengajuan' :  'disposal pengajuan HO', no: item.no_disposal})}}>
                                                            Tracking
                                                        </Button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                        </tbody>
                                    </Table>
                                ) : (
                                    <Table bordered striped responsive hover className={style.tab}>
                                        <thead>
                                            <tr>
                                                <th>NO</th>
                                                <th>NO.AJUAN</th>
                                                <th>AREA</th>
                                                <th>KODE PLANT</th>
                                                <th>COST CENTER</th>
                                                <th>TANGGAL SUBMIT</th>
                                                <th>STATUS</th>
                                                <th>OPSI</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {newDis.length !== 0 && newDis.map(item => {
                                            return (
                                                <tr className={item.status_reject === 0 ? 'note' : item.status_transaksi === 0 ? 'fail' : item.status_reject === 1 && 'bad'}>
                                                    <td>{newDis.indexOf(item) + 1}</td>
                                                    <td>{item.no_disposal}</td>
                                                    <td>{item.area}</td>
                                                    <td>{item.kode_plant}</td>
                                                    <td>{item.cost_center}</td>
                                                    <td>{moment(item.tanggalDis).format('DD MMMM YYYY')}</td>
                                                    <td>On Proses</td>
                                                    <td>
                                                        <Button className="btnSell" color="primary" onClick={() => {this.getDetailDisposal(item.no_disposal); this.getApproveDis({nama: item.kode_plant.split('').length === 4 ? 'disposal pengajuan' :  'disposal pengajuan HO', no: item.no_disposal})}}>Proses</Button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                        </tbody>
                                    </Table>
                                )}
                                <div>
                                    <div className={style.infoPageEmail1}>
                                        {level === '5' || level === '9' ? (
                                            <text>Showing {page === undefined ? 1 : page.currentPage} of {page.pages === undefined ? 1 : page.pages} pages</text>
                                        ) : (
                                            <text>Showing 1 of 1 pages</text>
                                        )}
                                        <div className={style.pageButton}>
                                            {level === '5' || level === '9' ? (
                                                <button className={style.btnPrev} color="info" disabled={page.prevLink === undefined || page.prevLink === null ? true : false} onClick={this.prev}>Prev</button>
                                            ) : (
                                                <button className={style.btnPrev} color="info" disabled>Prev</button>
                                            )}
                                            {level === '5' || level === '9' ? (
                                                <button className={style.btnPrev} color="info" disabled={page.nextLink === undefined || page.nextLink === null ? true : false} onClick={this.next}>Next</button>
                                            ) : (
                                                <button className={style.btnPrev} color="info" disabled>Next</button>
                                            )}
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
                        <h2 className={styleTrans.pageTitle}>Disposal Asset</h2>

                        {(level === '5' || level === '9' ) && (
                            <div className={styleTrans.searchContainer}>
                                <Button size="lg" color='primary' onClick={this.goCartDispos}>Create</Button>
                            </div>
                        )}

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
                                <option value="available">Available Approve</option>
                                <option value="full">Full Approve</option>
                                <option value="reject">Reject</option>
                            </select>
                        </div>

                        <table className={styleTrans.table}>
                            <thead>
                                <tr>
                                    <th>NO</th>
                                    <th>NO.AJUAN</th>
                                    <th>AREA</th>
                                    <th>KODE PLANT</th>
                                    <th>COST CENTER</th>
                                    <th>TANGGAL SUBMIT</th>
                                    <th>STATUS</th>
                                    <th>OPSI</th>
                                </tr>
                            </thead>
                            <tbody>
                                {newDis.length !== 0 && newDis.map(item => {
                                    return (
                                        <tr className={item.status_reject === 0 ? 'note' : item.status_transaksi === 0 ? 'fail' : item.status_reject === 1 && 'bad'}>
                                            <td>{newDis.indexOf(item) + 1}</td>
                                            <td>{item.no_disposal}</td>
                                            <td>{item.area}</td>
                                            <td>{item.kode_plant}</td>
                                            <td>{item.cost_center}</td>
                                            <td>{moment(item.tanggalDis).format('DD MMMM YYYY')}</td>
                                            <td>On Proses</td>
                                            <td>
                                                <Button className="btnSell" color="primary" onClick={() => {this.getDetailDisposal(item.no_disposal); this.getApproveDis({nama: item.kode_plant.split('').length === 4 ? 'disposal pengajuan' :  'disposal pengajuan HO', no: item.no_disposal})}}>Proses</Button>
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
                <Modal isOpen={this.props.asset.isLoading && (level === '5' || level === '9') ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className={style.cekUpdate}>
                                <Spinner />
                                <div sucUpdate>Waiting....</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
                <Modal isOpen={this.props.disposal.isLoading || this.props.notif.isLoading ? true: false} size="sm">
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
                <Modal isOpen={this.state.formDis} toggle={this.openModalDis} size="xl">
                    <Alert color="danger" className={style.alertWrong} isOpen={detailDis.find(({status_form}) => status_form === 26) === undefined ? false : true}>
                        <div>Data Penjualan Asset Sedang Dilengkapi oleh divisi purchasing</div>
                    </Alert>
                    <ModalBody>
                        <div className="preDis">
                            <text>PT. Pinus Merah Abadi</text>
                            <text></text>
                        </div>
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
                                    <th>Select item to reject</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detailData.length !== 0 && detailData.map(item => {
                                    return (
                                        <tr>
                                            <th scope="row" onClick={() => this.openDataRinci(item)}>{detailData.indexOf(item) + 1}</th>
                                            <td onClick={() => this.openDataRinci(item)}>{item.no_asset}</td>
                                            <td onClick={() => this.openDataRinci(item)}>{item.nama_asset}</td>
                                            <td onClick={() => this.openDataRinci(item)}>{item.merk}</td>
                                            <td onClick={() => this.openDataRinci(item)}>{item.kategori}</td>
                                            <td onClick={() => this.openDataRinci(item)}>{item.nilai_buku === null || item.nilai_buku === undefined ? 0 : item.nilai_buku.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                            <td onClick={() => this.openDataRinci(item)}>{item.nilai_jual === null || item.nilai_jual === undefined ? 0 : item.nilai_jual.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                            <td onClick={() => this.openDataRinci(item)}>{item.keterangan}</td>
                                            <td> 
                                                <Input
                                                addon
                                                disabled={this.state.view !== 'available' && this.state.view !== 'revisi' ? true : false}
                                                checked={listMut.find(element => element === item.id) !== undefined ? true : false}
                                                type="checkbox"
                                                onClick={listMut.find(element => element === item.id) === undefined ? () => this.chekApp(item.id) : () => this.chekRej(item.id)}
                                                value={item.id} />
                                            </td>
                                            <td>{item.isreject === 1 ? 'Reject' : item.isreject === 2 ? 'Revisi' : '-'}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                        <div className="mb-3">Demikianlah hal yang kami sampaikan, atas perhatiannya kami mengucapkan terima kasih</div>
                    </ModalBody>
                    <hr />
                    <div className="modalFoot ml-3">
                        <Button color="primary" onClick={() => this.openModPreview({nama: detailDis[0] !== undefined && detailDis[0].kode_plant.split('').length === 4 ? 'disposal pengajuan' : 'disposal pengajuan HO', no: detailDis[0] !== undefined && detailDis[0].no_disposal})}>Preview</Button>
                        <div className="btnFoot">
                            <Button className="mr-2" color="danger" disabled={this.state.view !== 'available' && this.state.view !== 'revisi' ? true : listMut.length === 0 ? true : detailDis.find(({status_form}) => status_form === 26) === undefined ? false : true} onClick={this.openModalReject}>
                                Reject
                            </Button>
                            <Button color="success" onClick={this.openModalApprove} disabled={this.state.view !== 'available' && this.state.view !== 'revisi' ? true : detailDis.find(({status_form}) => status_form === 26) === undefined ? false : true}>
                                Approve
                            </Button>
                        </div>
                    </div>
                </Modal>
                <Modal isOpen={this.state.preview} toggle={this.openPreview} size="xl">
                    <Alert color="danger" className={style.alertWrong} isOpen={detailDis.find(({status_form}) => status_form === 26) === undefined ? false : true}>
                        <div>Data Penjualan Asset Sedang Dilengkapi oleh divisi purchasing</div>
                    </Alert>
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
                                </tr>
                            </thead>
                            <tbody>
                                {detailData.length !== 0 && detailData.map(item => {
                                    return (
                                        <tr>
                                            <th scope="row">{detailData.indexOf(item) + 1}</th>
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
                                                    {disApp.pembuat !== undefined && disApp.pembuat.map(item => {
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
                                                {disApp.pembuat !== undefined && disApp.pembuat.map(item => {
                                                    return (
                                                        <td className="footPre">{item.jabatan === null ? "-" : 'SPV'}</td>
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
                                                    {disApp.pemeriksa !== undefined && disApp.pemeriksa.map(item => {
                                                        return (
                                                            item.jabatan === 'asset' ? (
                                                                null
                                                            ) : (
                                                            <th className="headPre">
                                                                <div className="mb-2">{item.nama === null ? "-" : item.status === 0 ? 'Reject' : moment(item.updatedAt).format('LL')}</div>
                                                                <div>{item.nama === null ? "-" : item.nama}</div>
                                                            </th>
                                                            )
                                                        )
                                                    })}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    {disApp.pemeriksa !== undefined && disApp.pemeriksa.map(item => {
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
                                                    {disApp.penyetuju !== undefined && disApp.penyetuju.map(item => {
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
                                <img src={this.state.img === '' ? placeholder : `${REACT_APP_BACKEND_URL}/${this.state.img}`} className="imgRinci" />
                                <div className="secImgSmall">
                                    {dataRinci.pict !== undefined ? (
                                        dataRinci.pict.length > 0 ? (
                                            dataRinci.pict.map(item => {
                                                return (
                                                    <button className="btnSmallImg" onClick={() => this.setState({img: item.path})}>
                                                        <img src={`${REACT_APP_BACKEND_URL}/${item.path}`} className="imgSmallRinci" />
                                                    </button>
                                                )
                                            })
                                        ) : (
                                            <button className="btnSmallImg">
                                                <img src={placeholder} className="imgSmallRinci" />
                                            </button>
                                        ) 
                                    ) : (
                                        <button className="btnSmallImg">
                                            <img src={placeholder} className="imgSmallRinci" />
                                        </button>
                                    )
                                    }
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
                                    <div className="secSmallRinci">
                                        <div className="titSmallRinci">Nilai Buku</div>
                                        <div className="txtAreaRinci">{dataRinci.nilai_buku === undefined || dataRinci.nilai_buku === null ? 0 : dataRinci.nilai_buku.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</div>
                                    </div>
                                    <div className="secSmallRinci">
                                        <div className="titSmallRinci">Kategori</div>
                                        <div className="txtAreaRinci">{dataRinci.kategori}</div>
                                    </div>
                                </div>
                                <div className="footRinci">
                                    <Button className="btnFootRinci" size="lg" color="warning" onClick={() => this.addSell(dataRinci.no_asset)}>Penjualan</Button>
                                    <Button className="btnFootRinci" size="lg" color="info" onClick={() => this.addDisposal(dataRinci.no_asset)}>Pemusnahan</Button>
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
                            <img src={this.state.img === '' ? placeholder : `${REACT_APP_BACKEND_URL}/${this.state.img}`} className="imgRinci" />
                                <div className="secImgSmall">
                                    {dataRinci.pict !== undefined ? (
                                        dataRinci.pict.length > 0 ? (
                                            dataRinci.pict.map(item => {
                                                return (
                                                    <button className="btnSmallImg" onClick={() => this.setState({img: item.path})}>
                                                        <img src={`${REACT_APP_BACKEND_URL}/${item.path}`} className="imgSmallRinci" />
                                                    </button>
                                                )
                                            })
                                        ) : (
                                            <button className="btnSmallImg">
                                                <img src={placeholder} className="imgSmallRinci" />
                                            </button>
                                        ) 
                                    ) : (
                                        <button className="btnSmallImg">
                                            <img src={placeholder} className="imgSmallRinci" />
                                        </button>
                                    )
                                    }
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
                                                disabled
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
                                    <div className="footRinci4">
                                        {/* <Button className="btnFootRinci1" size="lg" color="primary" onClick={handleSubmit}>Save</Button> */}
                                        <Button className="btnFootRinci1" size="lg" color="success" onClick={this.openProsesModalDoc}>Dokumen</Button>
                                        <Button className="btnFootRinci1 ml-2" size="lg" color="secondary" onClick={() => this.openRinciAdmin()}>Close</Button>
                                    </div>
                                </div>
                            )}
                            </Formik>
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
                                        <Col md={6} lg={6} className="lsDoc">
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
                                        <div className="blue">- {detailData.find(({id}) => id === item).nama_asset}</div>
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
                                <Button color="primary" onClick={() => this.approveDisposal(detailDis[0].no_disposal)}>Ya</Button>
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
                        {level === '12' || level === '2' || level === '27'? (
                             <div>
                                 {level === '12' || level === '27'? (
                                        (fileName.status !== 0 && fileName.status !== 3) || (app[find] !== undefined && app[find - 1].status === null && fileName.status !== 0 && fileName.status !== 3) ? (
                                            <>
                                                <Button color="danger" className="mr-3" onClick={this.openModalRejectDis}>Reject</Button>
                                                <Button color="primary" onClick={this.openModalApproveDis}>Approve</Button>
                                            </>
                                        ) : (
                                            <Button color="primary" onClick={() => this.setState({openPdf: false})}>Close</Button>
                                        )
                                    ) : (
                                        app[find] !== undefined && app[find + 1].status === 1 && app[find - 1].status === null && (fileName.divisi !== '0' && fileName.divisi !== '3') ? (
                                            <>
                                                <Button color="danger" className="mr-3" onClick={this.openModalRejectDis}>Reject</Button>
                                                <Button color="primary" onClick={this.openModalApproveDis}>Approve</Button>
                                            </>
                                        ) : (
                                            <Button color="primary" onClick={() => this.setState({openPdf: false})}>Close</Button>
                                        )
                                    )}
                            </div>
                            ) : (
                                <Button color="primary" onClick={() => this.setState({openPdf: false})}>Close</Button>
                            )}
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
                                <div className="errApprove mt-2">{this.props.disposal.alertM === undefined ? '' : this.props.disposal.alertM}</div>
                            </div>
                            </div>
                        ) : this.state.confirm === 'rejReject' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Reject</div>
                                <div className="errApprove mt-2">{this.props.disposal.alertM === undefined ? '' : this.props.disposal.alertM}</div>
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
                <Modal isOpen={this.state.submitPre} toggle={this.modalSubmitPre} size="xl">
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
                                    {dataSubmit.length !== 0 ? dataSubmit.map(item => {
                                        return (
                                            <tr>
                                                <th scope="row">{dataSubmit.indexOf(item) + 1}</th>
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
                            <div className="btnFoot">
                                <Button className="mr-2" color="success" onClick={() => this.goSetDispos(dataSubmit[0] !== undefined ? dataSubmit[0] : null)}>
                                    Submit
                                </Button>
                            </div>
                        </div>
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
    setuju: state.setuju,
    notif: state.notif,
    auth: state.auth,
    user: state.user,
    tracking: state.tracking
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
    submitSetDisposal: setuju.submitSetDisposal,
    addSell: disposal.addSell,
    resAppRej: disposal.resAppRej,
    getSubmitDisposal: disposal.getSubmitDisposal,
    getNotif: notif.getNotif,
    resetAuth: auth.resetError,
    getRole: user.getRole,
    notifDisposal: notif.notifDisposal,
    getDetailDis: disposal.getDetailDisposal,
    getTrack: tracking.getTrack
}

export default connect(mapStateToProps, mapDispatchToProps)(Disposal)
