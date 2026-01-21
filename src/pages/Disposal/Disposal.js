/* eslint-disable jsx-a11y/no-distracting-elements */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react'
import { Container, NavbarBrand, Table, Input, Button, Col, Card, CardBody,
    Alert, Spinner, Row, Modal, ModalBody, ModalHeader, ModalFooter, Collapse,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap'
import style from '../../assets/css/input.module.css'
import {FaSearch, FaUserCircle, FaBars, FaCartPlus, FaFileSignature} from 'react-icons/fa'
import {BsCircle, BsBell, BsFillCircleFill} from 'react-icons/bs'
import { AiOutlineCheck, AiOutlineClose, AiFillCheckCircle, AiOutlineInbox} from 'react-icons/ai'
import {MdAssignment} from 'react-icons/md'
import {FiSend, FiTruck, FiSettings, FiUpload} from 'react-icons/fi'
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
import depo from '../../redux/actions/depo'
import {default as axios} from 'axios'
import Sidebar from "../../components/Header"
import MaterialTitlePanel from "../../components/material_title_panel"
import SidebarContent from "../../components/sidebar_content"
import placeholder from  "../../assets/img/placeholder.png"
import disposal from '../../redux/actions/disposal'
import setuju from '../../redux/actions/setuju'
import b from "../../assets/img/b.jpg"
import e from "../../assets/img/e.jpg"
import TablePeng from '../../components/TablePeng'
import notif from '../../redux/actions/notif'
import NavBar from '../../components/NavBar'
import styleTrans from '../../assets/css/transaksi.module.css'
import NewNavbar from '../../components/NewNavbar'
import dokumen from '../../redux/actions/dokumen'
import tempmail from '../../redux/actions/tempmail'
import newnotif from '../../redux/actions/newnotif'
import Email from '../../components/Disposal/Email'
import ModalDokumen from '../../components/ModalDokumen'
import TrackingDisposal from '../../components/Disposal/TrackingDisposal'
import FormDisposal from '../../components/Disposal/FormDisposal'
import FormPersetujuan from '../../components/Disposal/FormPersetujuan'
import debounce from 'lodash.debounce';
import Select from 'react-select/creatable';

const {REACT_APP_BACKEND_URL} = process.env

const disposalSchema = Yup.object().shape({
    merk: Yup.string().validateSync(""),
    keterangan: Yup.string().required('must be filled'),
    nilai_jual: Yup.string().required()
})

const alasanSchema = Yup.object().shape({
    alasan: Yup.string()
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
            limImage: 20000000,
            submitPre: false,
            date: '',
            filter: 'available',
            newDis: [],
            app: [],
            find: null,
            listMut: [],
            listStat: [],
            baseData: [],
            time: 'pilih',
            time1: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
            // time1: moment().startOf('month').format('YYYY-MM-DD'),
            time2: moment().endOf('month').format('YYYY-MM-DD'),
            modalTrack: false,
            collap: false,
            openDraft: false,
            subject: '',
            message: '',
            typeReject: '',
            menuRev: '',
            tipeEmail: '',
            dataRej: {},
            loading: false,
            noDoc: '',
            noTrans: '',
            valdoc: {},
            arrApp: [],
            listDis: [],
            newSubmit: [],
            modalSubmit: false,
            openDoc: false,
            options: []
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
        this.debouncedLoadOptions = debounce(this.prosesSearch, 500)
    }

    prosesSearch = async (val) => {
        const token = localStorage.getItem("token")
        const level = localStorage.getItem('level')
        const { time1, time2, search, limit, filter } = this.state
        
        const cekTime1 = time1 === '' ? 'undefined' : time1
        const cekTime2 = time2 === '' ? 'undefined' : time2
        
        const status = filter === 'available' ? 2 : filter === 'full' ? 9 : 'all'

        if (val === null || val === undefined || val.length === 0) {
            this.setState({ options: [] })
        } else {
            await this.props.searchDisposal(token, limit, val, 1, status, undefined, cekTime1, cekTime2)

            const { dataSearch } = this.props.disposal
            const firstOption = [
                {value: val, label: val}
            ]
            const secondOption = [
                {value: '', label: ''}
            ]
            
    
            for (let i = 0; i < dataSearch.length; i++) {
                const dataArea = dataSearch[i].area
                const dataNo = dataSearch[i].no_disposal
                const dataItem = dataSearch[i].nama_asset
    
                const cekSecond = secondOption.find(item => item.value === dataNo)
                if (cekSecond === undefined) {
                    const data = {
                        value: dataNo, label: dataNo
                    }
                    secondOption.push(data)
                }
            }
    
            const dataOption = [
                ...firstOption,
                ...secondOption
            ]
    
            this.setState({ options: dataOption })
        }
    }
    
    handleInputChange = (val) => {
        this.debouncedLoadOptions(val)
        return val
    }

    goSearch = async (e) => {
        if (e === null || e === undefined) {
            console.log(e)
        } else {
            this.setState({ search: e.value })
            const { filter } = this.state
            setTimeout(() => {
                this.changeFilter(filter)
            }, 100)
        }
    }

    statusApp = (val) => {
        const { listStat } = this.state
        listStat.push(val)
        this.setState({ listStat: listStat })
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
        this.setState({ listStat: data })
    }

    rejectApp = (val) => {
        this.setState({ typeReject: val })
    }

    rejectRej = (val) => {
        const { typeReject } = this.state
        if (typeReject === val) {
            this.setState({ typeReject: '' })
        }
    }

    menuApp = (val) => {
        this.setState({ menuRev: val })
    }

    menuRej = (val) => {
        const { menuRev } = this.state
        if (menuRev === val) {
            this.setState({ menuRev: '' })
        }
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

    prosesOpenRinci = (val) => {
        this.setState({dataRinci: val})
        this.openModalRinci()
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

    cekApprove = async () => {
        console.log('masuk cek approvesss')
        const token = localStorage.getItem('token')
        const level = localStorage.getItem('level')
        const { detailDis } = this.props.disposal
        const { detailUser } = this.props.user
        const tempdoc = []
        const arrDoc = []
        const uploadDoc = []
        console.log(detailDis)
        for (let i = 0; i < detailDis.length; i++) {
            const data = {
                noId: detailDis[i].id,
                noAsset: detailDis[i].no_asset
            }
            console.log(`masuk perulangan ${i}`)
            await this.props.getDocumentDis(token, data, 'disposal', 'pengajuan')
            const {dataDoc} = this.props.disposal
            for (let j = 0; j < dataDoc.length; j++) {
                if (dataDoc[j].jenis_dokumen === 'it' && detailUser.user_level == '41' && dataDoc[j].path === null) {
                    uploadDoc.push(dataDoc[j])
                } else if (dataDoc[j].path !== null) {
                    const arr = dataDoc[j]
                    const stat = arr.status_dokumen
                    const cekLevel = stat !== null && stat !== '1' ? stat.split(',').reverse()[0].split(';')[0] : ''
                    const cekStat = stat !== null && stat !== '1' ? stat.split(',').reverse()[0].split(';')[1] : ''
                    if (cekLevel === ` level ${level}` && cekStat === ` status approve`) {
                        tempdoc.push(arr)
                        arrDoc.push(arr)
                    } else {
                        arrDoc.push(arr)
                    }
                }
            }
        }
        if (uploadDoc.length > 0) {
            this.setState({ confirm: 'falseUploadDok' })
            this.openConfirm()
        } else if (tempdoc.length === arrDoc.length) {
            this.openModalApprove()
        } else {
            this.setState({ confirm: 'falseAppDok' })
            this.openConfirm()
        }
    }

    cekSubmit = async () => {
        const token = localStorage.getItem('token')
        const {detailDis} = this.props.disposal
        const cekNpwp = []
        const cekDoc = []
        for (let i = 0; i < detailDis.length; i++) {
            if (detailDis[i].nilai_jual !== '0' && detailDis[i].npwp !== 'ada' &&  detailDis[i].npwp !== 'tidak') {
                cekNpwp.push(detailDis[i])
            } else {
                const tipeDis = detailDis[i].nilai_jual === "0" ? 'dispose' : 'sell'
                const data = {
                    noId: detailDis[i].id,
                    noAsset: detailDis[i].no_asset
                }
                await this.props.getDocumentDis(token, data, 'disposal', tipeDis, detailDis[i].npwp)
                const {dataDoc} = this.props.disposal
                for (let j = 0; j < dataDoc.length; j++) {
                    if (dataDoc[j].path === null) {
                        cekDoc.push(dataDoc[j])
                    }
                }
            }
        }
        if (cekNpwp.length > 0) {
            this.setState({confirm: 'falseNpwp'})
            this.openConfirm()
        } else if (cekDoc.length > 0) {
            this.setState({confirm: 'falseDoc'})
            this.openConfirm()
        } else {
            this.openSubmit()
        }
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

    openProsesModalDoc = async (val) => {
        const token = localStorage.getItem('token')
        const { dataRinci } = this.state
        const data = {
            noId: dataRinci.id,
            noAsset: dataRinci.no_asset
        }
        await this.props.getDocumentDis(token, data, 'disposal', 'pengajuan')
        if (val === 'upload') {
            this.modalUploadDoc()
        } else {
            this.closeProsesModalDoc()
        }
    }

    uploadDocIt = (val) => {
        this.setState({dataRinci: val})
        setTimeout(() => {
            this.openProsesModalDoc('upload')
         }, 100)
    }

    prosesOpenDokumen = (val) => {
        this.setState({dataRinci: val})
        const role = localStorage.getItem('role')
        const app = val.appForm
        const find = app.indexOf(app.find(({jabatan}) => jabatan === role))
        this.setState({app: app, find: find})
        this.setState({ noDoc: val.no_asset, noTrans: val.no_disposal, valdoc: val })
        setTimeout(() => {
            this.openProsesModalDoc()
         }, 100)
    }

    getMessage = (val) => {
        this.setState({ message: val.message, subject: val.subject })
        console.log(val)
    }

    prepReject = async (val) => {
        const { detailDis } = this.props.disposal
        const { listStat, listMut, typeReject, menuRev } = this.state
        const token = localStorage.getItem("token")
        const level = localStorage.getItem('level')
        if (typeReject === 'pembatalan' && listMut.length !== detailDis.length) {
            this.setState({ confirm: 'falseCancel' })
            this.openConfirm()
        } else {
            const tipe = 'reject'
            const menu = 'Pengajuan Disposal Asset (Disposal asset)'
            const tempno = {
                no: detailDis[0].no_disposal,
                kode: detailDis[0].kode_plant,
                jenis: 'disposal',
                tipe: tipe,
                typeReject: typeReject,
                menu: menu
            }
            this.setState({ tipeEmail: 'reject', dataRej: val })
            await this.props.getDraftEmail(token, tempno)
            this.openDraftEmail()
        }

    }

    openSubmit = () => {
        this.setState({modalSubmit: !this.state.modalSubmit})
    }

    prosesSubmit = async () => {
        const token = localStorage.getItem("token")
        const { listDis } = this.state
        await this.props.genNoSetDisposal(token)
        const { no_setdis } = this.props.setuju
        const data = {
            no: no_setdis,
            list: listDis
        }
        console.log(data)
        await this.props.submitSetDisposal(token, data)
        await this.props.getDetailDisposal(token, no_setdis, 'persetujuan')
        await this.props.getApproveSetDisposal(token, no_setdis)
        this.prepSendEmail('submit')
    }

    prosesSubmitEks = async () => {
        const token = localStorage.getItem("token")
        const {detailDis} = this.props.disposal
        const data = {
            no: detailDis[0].no_disposal
        }
        await this.props.submitEksDisposal(token, data)
        this.openModalDis()
        this.prosesSendEmail('submit')
        this.openDraftEmail()
        this.getDataDisposal()
        this.openSubmit()
        this.setState({confirm: 'submit'})
        this.openConfirm()
    }

    prepSendEmail = async (val) => {
        const token = localStorage.getItem("token")
        const { detailDis } = this.props.disposal

        const app = detailDis[0].appForm
        const tempApp = []
        for (let i = 0; i < app.length; i++) {
            if (app[i].status === 1) {
                tempApp.push(app[i])
            }
        }
        const tipe = val === 'submit' ? 'submit' : tempApp.length === app.length - 1 ? 'full approve' : 'approve'
        const menu = val === 'submit' ? 'Eksekusi Disposal Area (Disposal asset)' : 'Pengajuan Disposal Asset (Disposal asset)'
        const no = detailDis[0].no_disposal

        const tempno = {
            no: no,
            kode: detailDis[0].kode_plant,
            jenis: 'disposal',
            tipe: tipe,
            menu: menu
        }
        this.setState({ tipeEmail: val })
        // if (val === 'submit') {
        //     await this.props.getDraftEmail(token, tempno)
        //     this.openDraftEmail()
        // } else {
        await this.props.getDetailDisposal(token, detailDis[0].no_disposal)
        await this.props.getApproveDisposal(token, detailDis[0].no_disposal, 'Disposal')
        await this.props.getDraftEmail(token, tempno)
        this.openDraftEmail()
        // }
    }

    openDraftEmail = () => {
        this.setState({ openDraft: !this.state.openDraft })
    }


    approveDisposal = async () => {
        const token = localStorage.getItem('token')
        const {detailDis} = this.props.disposal
        const { arrApp } = this.state
        const cekApp = arrApp.find(item => item.noDis === detailDis[0].no_disposal)
        const data = {
            no: detailDis[0].no_disposal,
            indexApp: cekApp.index
        }
        await this.props.approveDisposal(token, data)
        this.prosesSendEmail('approve')
        this.openDraftEmail()
        this.getDataDisposal()
        this.openModalApprove()
        this.openConfirm(this.setState({confirm: 'approve'}))
        this.openModalDis()
    }

    rejectDisposal = async (val) => {
        const { detailDis } = this.props.disposal
        const { listStat, listMut, typeReject, menuRev } = this.state
        const { arrApp } = this.state
        const cekApp = arrApp.find(item => item.noDis === detailDis[0].no_disposal)
        const token = localStorage.getItem('token')
        let temp = ''
        for (let i = 0; i < listStat.length; i++) {
            temp += listStat[i] + '.'
        }
        const data = {
            alasan: temp + val.alasan,
            no: detailDis[0].no_disposal,
            menu: typeReject === 'pembatalan' ? 'Disposal asset' : menuRev,
            list: listMut,
            type: 'form',
            type_reject: typeReject,
            user_rev: detailDis[0].kode_plant,
            indexApp: `${cekApp.index}`
        }
        await this.props.rejectDisposal(token, data)
        this.prosesSendEmail(`reject ${typeReject}`)
        this.openDraftEmail()
        this.getDataDisposal()
        this.openModalReject()
        this.openModalDis()
        this.setState({confirm: 'reject'})
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

        const app = detailDis[0].appForm
        const tempApp = []
        for (let i = 0; i < app.length; i++) {
            if (app[i].status === 1) {
                tempApp.push(app[i])
            }
        }
        const tipe = ((tempApp.length === app.length - 1) || (tempApp.length === app.length)) ? 'full approve' : 'approve'

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
            proses: val,
            route: val === 'submit' ? 'eksdis' : tipe === 'full approve' ? 'persetujuan-disposal' : val === 'reject perbaikan' ? 'rev-disposal' : 'disposal'
        }
        await this.props.sendEmail(token, sendMail)
        await this.props.addNewNotif(token, sendMail)
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

    prosesOpenDisposal = async (val) => {
        const token = localStorage.getItem('token')
        const cekApp = {
            nama: val.kode_plant.split('').length === 4 ? 'disposal pengajuan' :  'disposal pengajuan HO',
            no: val.no_disposal
        }
        await this.props.getApproveDisposal(token, cekApp.no, cekApp.nama)
        await this.props.getDetailDisposal(token, val.no_disposal, 'pengajuan')
        this.openModalDis()
    }

    toggle = () => {
        this.setState({isOpen: !this.state.isOpen})
    }

    openConfirm = (val) => {
        this.setState({modalConfirm: val === undefined || val === null || val === '' ? !this.state.modalConfirm : val})
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

    openDocEksekusi = async () => {
        const token = localStorage.getItem("token")
        const { dataRinci } = this.state
        if (dataRinci.npwp !== 'ada' &&  dataRinci.npwp !== 'tidak' && dataRinci.nilai_jual !== "0") {
            this.setState({confirm: 'falseNpwp'})
            this.openConfirm()
        } else {
            const tipeDis = dataRinci.nilai_jual === "0" ? 'dispose' : 'sell'
            const data = {
                noId: dataRinci.id,
                noAsset: dataRinci.no_asset
            }
            await this.props.getDocumentDis(token, data, 'disposal', tipeDis, dataRinci.npwp)
            this.modalUploadDoc()
        }
    }

    modalUploadDoc = () => {
        this.setState({openDoc: !this.state.openDoc})
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
        const {isError, isExport} = this.props.asset
        const {isRoute} = this.props.auth
        const {isAdd, isAppDoc, isRejDoc, approve, reject, rejReject, rejApprove, isUpload} = this.props.disposal
        const { detailUser } = this.props.user
        const token = localStorage.getItem('token')
        const { dataRinci } = this.state
        const data = {
            noId: dataRinci.id,
            noAsset: dataRinci.no_asset
        }
        if (isError) {
            this.props.resetError()
            this.showAlert()
        } else if (isRoute) {
            const route = localStorage.getItem('route')
            this.props.resetAuth()
            this.props.history.push(`/${route}`)
        }  else if (isAdd) {
            setTimeout(() => {
                this.props.resetDis()
             }, 2000)
        } else if (isExport) {
            this.props.resetError()
            this.DownloadMaster()
        } else if (isAppDoc === true || isRejDoc === true) {
            this.props.resetDis()
            this.props.getDocumentDis(token, data, 'disposal', 'pengajuan')
        } else if (isUpload) {
            this.props.resetDis()
            if (detailUser.user_level == '41') {
                this.props.getDocumentDis(token, data, 'disposal', 'pengajuan')
            } else {
                const tipeDis = dataRinci.nilai_jual === "0" ? 'dispose' : 'sell'
                this.props.getDocumentDis(token, data, 'disposal', tipeDis, dataRinci.npwp)
            }
            
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
            // this.openModalReject()
            this.props.resAppRej()
        } else if (rejApprove) {
            this.openConfirm(this.setState({confirm: 'rejApprove'}))
            // this.openModalApprove()
            this.props.resAppRej()
        }
    }

    onSearch = async (e) => {
        this.setState({search: e.target.value})
        const token = localStorage.getItem("token")
        if(e.key === 'Enter'){
            this.changeFilter(this.state.filter)
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

    prosesOpenTracking = async (val) => {
        const token = localStorage.getItem('token')
        const cekApp = {
            nama: val.kode_plant.split('').length === 4 ? 'disposal pengajuan' :  'disposal pengajuan HO',
            no: val.no_disposal
        }
        await this.props.getApproveDisposal(token, cekApp.no, cekApp.nama)
        await this.props.getDetailDisposal(token, val.no_disposal, 'pengajuan')
        this.openModalTrack()
    }

    openModalTrack = () => {
        this.setState({modalTrack: !this.state.modalTrack})
    }

    getDataAsset = async (value) => {
        const token = localStorage.getItem("token")
        const { page } = this.props.asset
        const search = value === undefined ? '' : this.state.search
        const limit = value === undefined ? this.state.limit : value.limit
        await this.props.getAsset(token, limit, search, page === undefined || page.currentPage === undefined ? 1 : page.currentPage, 'disposal')
        this.setState({limit: value === undefined ? 10 : value.limit})
    }

    selectTime = (val) => {
        this.setState({ [val.type]: val.val })
    }

    changeTime = async (val) => {
        const token = localStorage.getItem("token")
        this.setState({ time: val })
        if (val === 'all') {
            this.setState({ time1: '', time2: '' })
            setTimeout(() => {
                this.getDataTime()
            }, 500)
        }
    }

    getDataTime = async () => {
        const { time1, time2, filter, search, limit } = this.state
        const cekTime1 = time1 === '' ? 'undefined' : time1
        const cekTime2 = time2 === '' ? 'undefined' : time2
        const token = localStorage.getItem("token")
        const level = localStorage.getItem("level")
        this.changeFilter(filter)
    }

    

    prosesOpenSubmit = async () => {
        const token = localStorage.getItem("token")
        // const { page } = this.props.disposal
        // await this.props.getSubmitDisposal(token, 1000, '', page.currentPage, 9)
        await this.props.getUser(token, 10, '', 1, 22)
        await this.props.getApproveSetDisposal(token, 'prepare', 'disposal persetujuan')
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

    chekDisApp = (val) => {
        const { listDis, newDis } = this.state
        console.log('app')
        if (val === 'all') {
            const arr = []
            const data = []
            for (let i = 0; i < newDis.length; i++) {
                arr.push(newDis[i].no_disposal)
                data.push(newDis[i])
            }
            this.setState({listDis: arr, newSubmit: data })
        } else {
            listDis.push(val)
            const cekData = newDis.find(item => item.no_disposal === val)
            const data = [cekData]
            this.setState({listDis: listDis, newSubmit: data})
        }
    }

    chekDisRej = (val) => {
        const { listDis, newSubmit } = this.state
        if (val === 'all') {
            this.setState({listDis: [], newSubmit: []})
        } else {
            const arr = []
            const data = []
            for (let i = 0; i < listDis.length; i++) {
                if (listDis[i] === val) {
                    arr.push()
                } else {
                    arr.push(listDis[i])
                    const cekData = newSubmit.find(item => item.no_disposal === listDis[i])
                    data.push(cekData)
                }
            }
            this.setState({listDis: arr, newSubmit: data})
        }
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

    async componentDidMount() {
        const level = localStorage.getItem('level')
        const token = localStorage.getItem("token")
        const id = localStorage.getItem('id')
        console.log(this.props.location.state)
        const filter = this.props.location.state === undefined ? '' : this.props.location.state.filter
        if (filter === 'finish' || filter === 'all') {
            this.setState({filter: filter})
        }
        await this.props.getRole(token)
        await this.props.getDepo(token, 1000, '')
        await this.props.getDetailUser(token, id)
        this.getDataDisposal()
    }

    getDataDisposal = async () => {
        const level = localStorage.getItem('level')
        const token = localStorage.getItem("token")
        const {filter} = this.state
        const finFilter = (level === '5' || level === '9') && filter !== 'finish' ? 'submit' : filter
        this.changeFilter(finFilter)
    }

    changeFilter = async (val) => {
        const token = localStorage.getItem("token")
        const role = localStorage.getItem('role')
        const level = localStorage.getItem('level')
        const { detailUser, dataRole } = this.props.user
        const { dataDepo } = this.props.depo

        const { time1, time2, search, limit } = this.state
        const cekTime1 = time1 === '' ? 'undefined' : time1
        const cekTime2 = time2 === '' ? 'undefined' : time2
        const status = val === 'available' ? 2 : val === 'full' ? 9 : 'all'
        await this.props.getDisposal(token, limit, search, 1, status, undefined, cekTime1, cekTime2)
        
        const arrRole = detailUser.detail_role
        const listRole = []
        for (let i = 0; i < arrRole.length + 1; i++) {
            if (detailUser.user_level === 1) {
                const data = {fullname: 'admin', name: 'admin', nomor: '1', type: 'all'}
                listRole.push(data)
            } else if (i === arrRole.length) {
                const cek = dataRole.find(item => parseInt(item.nomor) === detailUser.user_level)
                if (cek !== undefined) {
                    listRole.push(cek)
                }
            } else {
                const cek = dataRole.find(item => parseInt(item.nomor) === arrRole[i].id_role)
                if (cek !== undefined) {
                    listRole.push(cek)
                }
            }
        }

        const { dataDis, noDis } = this.props.disposal
        if (val === 'available') {
            const newDis = []
            const arrApp = []
            for (let i = 0; i < dataDis.length; i++) {
                const depoFrm = dataDepo.find(item => item.kode_plant === dataDis[i].kode_plant)
                for (let x = 0; x < listRole.length; x++) {
                    // console.log(listRole)
                    const app = dataDis[i].appForm === undefined ? [] : dataDis[i].appForm
                    const cekFrm = listRole[x].type === 'area' && depoFrm !== undefined ? (depoFrm.nama_bm.toLowerCase() === detailUser.fullname.toLowerCase() || depoFrm.nama_om.toLowerCase() === detailUser.fullname.toLowerCase() || depoFrm.nama_aos.toLowerCase() === detailUser.fullname.toLowerCase() ? 'pengirim' : 'not found') : 'all'
                    // const cekFin = cekFrm === 'pengirim' ? 'pengirim' : 'all'
                    const cekFin = cekFrm === 'pengirim' ? 'all' : 'all'
                    const cekApp = app.find(item => (item.jabatan === listRole[x].name) && (cekFin === 'all' ? (item.struktur === null || item.struktur === 'all') : (item.struktur === cekFin)))
                    const find = app.indexOf(cekApp)
                    // console.log(listRole[x])
                    // console.log(cekApp)
                    // console.log(cekFrm)
                    // console.log(cekTo)
                    // console.log(cekFin)
                    if (level === '5' || level === '9') {
                        console.log('at available 2')
                        if (find === 0 || find === '0') {
                            console.log('at available 3')
                            if (dataDis[i].status_reject !== 1 && app[find] !== undefined && app[find + 1].status === 1 && app[find].status !== 1) {
                                if (newDis.find(item => item.no_disposal === dataDis[i].no_disposal) === undefined) {
                                    newDis.push(dataDis[i])
                                    arrApp.push({index: find, noDis: dataDis[i].no_disposal})
                                }
                            }
                        } else {
                            console.log('at available 4')
                            if (find !== app.length - 1) {
                                if (dataDis[i].status_reject !== 1 && app[find] !== undefined && app[find + 1].status === 1 && app[find - 1].status === null && app[find].status !== 1) {
                                    if (newDis.find(item => item.no_disposal === dataDis[i].no_disposal) === undefined) {
                                        newDis.push(dataDis[i])
                                        arrApp.push({index: find, noDis: dataDis[i].no_disposal})
                                    }
                                }
                            }
                        }
                    } else if (find === 0 || find === '0') {
                        console.log('at available 8')
                        if (dataDis[i].status_reject !== 1 && app[find] !== undefined && app[find + 1].status === 1 && app[find].status !== 1) {
                            if (newDis.find(item => item.no_disposal === dataDis[i].no_disposal) === undefined) {
                                newDis.push(dataDis[i])
                                arrApp.push({index: find, noDis: dataDis[i].no_disposal})
                            }
                        }
                    } else {
                        console.log('at available 5')
                        if (dataDis[i].status_reject !== 1 && app[find] !== undefined && app[find + 1].status === 1 && app[find - 1].status === null && app[find].status !== 1) {
                            if (newDis.find(item => item.no_disposal === dataDis[i].no_disposal) === undefined) {
                                newDis.push(dataDis[i])
                                arrApp.push({index: find, noDis: dataDis[i].no_disposal})
                            }
                        }
                    }
                }
            }
            this.setState({filter: val, newDis: newDis, baseData: newDis, arrApp: arrApp})
        } else if (val === 'reject') {
            const newDis = []
            for (let i = 0; i < dataDis.length; i++) {
                if (dataDis[i].status_reject === 1) {
                    newDis.push(dataDis[i])
                }
            }
            this.setState({filter: val, newDis: newDis, baseData: newDis})
        } else if (val === 'full') {
            const newDis = []
            for (let i = 0; i < dataDis.length; i++) {
                if (dataDis[i].status_form === 9) {
                    newDis.push(dataDis[i])
                }
            }
            this.setState({filter: val, newDis: newDis, baseData: newDis})
        } else if (val === 'submit') {
            const newDis = []
            for (let i = 0; i < dataDis.length; i++) {
                if (dataDis[i].status_form === 15) {
                    newDis.push(dataDis[i])
                }
            }
            this.setState({filter: val, newDis: newDis, baseData: newDis})
        } else if (val === 'finish') {
            const newDis = []
            for (let i = 0; i < dataDis.length; i++) {
                if (dataDis[i].status_form === 8) {
                    newDis.push(dataDis[i])
                }
            }
            this.setState({filter: val, newDis: newDis, baseData: newDis})
        } else {
            this.setState({filter: val, newDis: dataDis, baseData: dataDis})
        }
    }

    goRevisi = () => {
        this.props.history.push('/rev-disposal')
    }

    updateNpwp = async (value) => {
        this.setState({npwp: value})
        const token =localStorage.getItem('token')
        const data = {
            npwp: value
        }
        const { dataRinci } = this.state
        await this.props.updateDisposal(token, dataRinci.id, data)
        await this.props.getDetailDisposal(token, dataRinci.no_disposal, 'pengajuan')
        const { detailDis } = this.props.disposal
        const cekId = detailDis.find(item => item.id === dataRinci.id)
        if (cekId !== undefined) {
            this.setState({dataRinci: cekId})
            this.setState({confirm: 'upNpwp'})
            this.openConfirm()
        }
    }

    onChangeUpload = e => {
        const {size, type} = e.target.files[0]
        this.setState({fileUpload: e.target.files[0]})
        if (size >= this.state.limImage) {
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

    render() {
        const {alert, upload, errMsg, app, find, fileName, listMut, listStat, listDis, newSubmit} = this.state
        const {dataAsset, alertM, alertMsg, alertUpload, page} = this.props.asset
        const pages = this.props.disposal.page 
        const { dataDis, noDis, dataDoc, disApp, dataSubmit, detailDis, infoApp } = this.props.disposal
        const {dataRinci, newDis, tipeEmail} = this.state
        const {dataRole, dataUser} = this.props.user
        const disSet = this.props.setuju.disApp
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const kode = localStorage.getItem('kode')
        const dataNotif = this.props.notif.data
        const role = localStorage.getItem('role')
        const {detailUser} = this.props.user

        const splitApp = infoApp.info ? infoApp.info.split(']') : []
        const pembuatApp = splitApp.length > 0 ? splitApp[0] : ''
        const pemeriksaApp = splitApp.length > 0 ? splitApp[1] : ''
        const penyetujuApp = splitApp.length > 0 ? splitApp[2] : ''

        const areaAppIt = `${pembuatApp.split(';')[4] && pembuatApp.split(';')[4]}, ${pemeriksaApp.split(';')[4] && pemeriksaApp.split(';')[4]}, ${penyetujuApp.split(';')[4] && penyetujuApp.split(';')[4]}`
        const areaApp = `${pembuatApp.split(';')[3] && pembuatApp.split(';')[3]}, ${pemeriksaApp.split(';')[3] && pemeriksaApp.split(';')[3]}, ${penyetujuApp.split(';')[3] && penyetujuApp.split(';')[3]}`
        const hoAppIt = `${pembuatApp.split(';')[2] && pembuatApp.split(';')[2]}, ${pemeriksaApp.split(';')[2] && pemeriksaApp.split(';')[2]}, ${penyetujuApp.split(';')[2] && penyetujuApp.split(';')[2]}`
        const hoApp = `${pembuatApp.split(';')[1] && pembuatApp.split(';')[1]}, ${pemeriksaApp.split(';')[1] && pemeriksaApp.split(';')[1]}, ${penyetujuApp.split(';')[1] && penyetujuApp.split(';')[1]}`

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
                <div className={styleTrans.app}>
                    <NewNavbar handleSidebar={this.prosesSidebar} handleRoute={this.goRoute} />

                    <div className={`${styleTrans.mainContent} ${this.state.sidebarOpen ? styleTrans.collapsedContent : ''}`}>
                        <h2 className={styleTrans.pageTitle}>Disposal Asset</h2>
                        <div className={styleTrans.searchContainer}>
                            {(level === '5' || level === '9' ) ? (
                                <Button size="lg" color='primary' onClick={this.goCartDispos}>Create</Button>
                            ) : (level === '2' && this.state.filter === "full" ) ?(
                                <Button onClick={this.prosesOpenSubmit} color="info" size="lg">Submit</Button>
                            ) : (
                                <div></div>
                            )}
                            <select value={this.state.filter} onChange={e => this.changeFilter(e.target.value)} className={styleTrans.searchInput}>
                                <option value="all">All</option>
                                {(level === '5' || level === '9' ) ? (
                                    <option value="submit">Eksekusi Disposal</option>
                                ) : (
                                    <option value="available">Available Approve</option>
                                )}
                                
                                {/* <option value="full">Full Approve</option> */}
                                <option value="finish">Finished</option>
                                <option value="reject">Reject</option>
                            </select>
                         </div>
                        <div className={styleTrans.searchContainer}>
                            <div className='rowCenter'>
                                <div className='rowCenter'>
                                    <Input className={style.filter3} type="select" value={this.state.time} onChange={e => this.changeTime(e.target.value)}>
                                        <option value="all">Time (All)</option>
                                        <option value="pilih">Periode</option>
                                    </Input>
                                </div>
                                {this.state.time === 'pilih' ? (
                                    <>
                                        <div className='rowCenter'>
                                            <text className='bold'>:</text>
                                            <Input
                                                type="date"
                                                className="inputRinci"
                                                value={this.state.time1}
                                                onChange={e => this.selectTime({ val: e.target.value, type: 'time1' })}
                                            />
                                            <text className='mr-1 ml-1'>To</text>
                                            <Input
                                                type="date"
                                                className="inputRinci"
                                                value={this.state.time2}
                                                onChange={e => this.selectTime({ val: e.target.value, type: 'time2' })}
                                            />
                                            <Button
                                                disabled={this.state.time1 === '' || this.state.time2 === '' ? true : false}
                                                color='primary'
                                                onClick={this.getDataTime}
                                                className='ml-1'>
                                                Go
                                            </Button>
                                        </div>
                                    </>
                                ) : null}
                            </ div>
                            <Select
                                className={styleTrans.searchSelect}
                                options={this.state.options}
                                onInputChange={this.handleInputChange}
                                onChange={e => this.goSearch(e)}
                                formatCreateLabel={(inputValue) => `"${inputValue}"`}
                                isClearable
                            />
                            {/* <input
                                type="text"
                                placeholder="Search..."
                                onChange={this.onSearch}
                                value={this.state.search}
                                onKeyPress={this.onSearch}
                                className={styleTrans.searchInput}
                            /> */}
                        </div>

                        <table className={styleTrans.table}>
                            <thead>
                                <tr>
                                    {(level === '2' && this.state.filter === "full" ) && (
                                        <th>
                                            <Input
                                            addon
                                            disabled={this.state.filter !== 'full' ? true : false}
                                            checked={(listDis.length === newDis.length) && newDis.length > 0 ? true : false}
                                            type="checkbox"
                                            className='mr-1'
                                            onClick={listDis.length !== newDis.length ? () => this.chekDisApp('all') : () => this.chekDisRej('all')}
                                            />
                                            Select
                                        </th>
                                    )}
                                    <th>NO</th>
                                    <th>NO.AJUAN</th>
                                    <th>AREA</th>
                                    <th>KODE PLANT</th>
                                    <th>COST CENTER</th>
                                    <th>TANGGAL AJUAN</th>
                                    <th>APPROVED BY</th>
                                    <th>TGL APPROVED</th>
                                    <th>LAST STATUS</th>
                                    <th>OPSI</th>
                                </tr>
                            </thead>
                            <tbody>
                                {newDis.length !== 0 && newDis.map(item => {
                                    return (
                                        <tr className={item.status_reject === 0 ? 'note' : item.status_form === 8 ? 'success' : item.status_form === 0 ? 'fail' : item.status_reject === 1 && 'bad'}>
                                            {(level === '2' && this.state.filter === "full" ) && (
                                                <td> 
                                                    <Input
                                                    addon
                                                    disabled={this.state.filter !== 'full' ? true : false}
                                                    checked={listDis.find(element => element === item.no_disposal) !== undefined ? true : false}
                                                    type="checkbox"
                                                    onClick={listDis.find(element => element === item.no_disposal) === undefined ? () => this.chekDisApp(item.no_disposal) : () => this.chekDisRej(item.no_disposal)}
                                                    value={item.no_disposal} />
                                                </td>
                                            )}
                                            <td>{newDis.indexOf(item) + 1}</td>
                                            <td>{item.no_disposal}</td>
                                            <td>{item.area}</td>
                                            <td>{item.kode_plant}</td>
                                            <td>{item.cost_center}</td>
                                            <td>{moment(item.tanggalDis).format('DD MMMM YYYY')}</td>
                                            <td>
                                                {(item.ttdSet !== null && item.ttdSet.length > 0 && item.ttdSet.find(item => item.status === 1) !== undefined )
                                                ? (item.ttdSet.find(item => item.status === 1).nama + ` (${item.ttdSet.find(item => item.status === 1).jabatan === 'area' ? 'AOS' : item.ttdSet.find(item => item.status === 1).jabatan})`)
                                                : (item.appForm !== null && item.appForm.length > 0 && item.appForm.find(item => item.status === 1) !== undefined ? item.appForm.find(item => item.status === 1).nama + ` (${item.appForm.find(item => item.status === 1).jabatan === 'area' ? 'AOS' : item.appForm.find(item => item.status === 1).jabatan})` : '-')
                                                }
                                            </td>
                                            <td>
                                                {(item.ttdSet !== null && item.ttdSet.length > 0 && item.ttdSet.find(item => item.status === 1) !== undefined )
                                                 ? (moment(item.ttdSet.find(item => item.status === 1).updatedAt).format('DD/MM/YYYY HH:mm:ss'))
                                                 : (item.appForm !== null && item.appForm.length > 0 && item.appForm.find(item => item.status === 1) !== undefined ? moment(item.appForm.find(item => item.status === 1).updatedAt).format('DD/MM/YYYY HH:mm:ss') : '-')
                                                }
                                            </td>
                                            <td>{item.history !== null ? item.history.split(',').reverse()[0] : '-'}</td>
                                            <td>
                                                <Button 
                                                className="mr-1 mt-1" 
                                                color="primary" 
                                                onClick={item.status_reject === 1 && item.status_form !== 0 && (level === '5' || level === '9') && item.user_rev === kode ? () => this.goRevisi() : () => this.prosesOpenDisposal(item)}>
                                                    {(this.state.filter === 'available' || this.state.filter === 'submit') ? 'Proses' : item.status_reject === 1 && item.status_form !== 0 && (level === '5' || level === '9') && item.user_rev === kode ? 'Revisi' : 'Detail'}
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
                        {newDis.length === 0 && (
                            <div className={style.spinCol}>
                                <AiOutlineInbox size={50} className='secondary mb-4' />
                                <div className='textInfo'>Data ajuan tidak ditemukan</div>
                            </div>
                        )}
                    </div>
                </div>
                <Modal isOpen={
                    this.props.disposal.isLoading ||
                    this.props.setuju.isLoading || 
                    this.props.newnotif.isLoading ||
                    this.props.user.isLoading ||
                    this.props.depo.isLoading ||
                    this.props.tempmail.isLoading ? true: false
                } 
                    size="sm">
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
                <Modal isOpen={this.state.formDis} toggle={this.openModalDis} size="xl" className='xl'>
                    {/* <Alert color="danger" className={style.alertWrong} isOpen={detailDis.find(({status_form}) => status_form === 26) === undefined ? false : true}>
                        <div>Data Penjualan Asset Sedang Dilengkapi oleh divisi purchasing</div>
                    </Alert> */}
                    <ModalBody>
                        <Container className='xxl borderGen'>
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
                                        <th></th>
                                        <th>No</th>
                                        <th>Nomor Asset</th>
                                        <th>Nama Barang</th>
                                        <th>Merk/Type</th>
                                        <th>Kategori</th>
                                        <th>Nilai Buku</th>
                                        <th>Nilai Jual</th>
                                        <th>Keterangan</th>
                                        <th>{this.state.filter === 'submit' ? 'Opsi' : 'Dokumen'}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detailDis.length !== 0 && detailDis.map(item => {
                                        return (
                                            <tr>
                                                <td> 
                                                    <Input
                                                    addon
                                                    disabled={this.state.filter !== 'available' && this.state.filter !== 'revisi' ? true : false}
                                                    checked={listMut.find(element => element === item.id) !== undefined ? true : false}
                                                    type="checkbox"
                                                    onClick={listMut.find(element => element === item.id) === undefined ? () => this.chekApp(item.id) : () => this.chekRej(item.id)}
                                                    value={item.id} />
                                                </td>
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
                                                    {this.state.filter === 'submit' ? (
                                                        <Button color='primary' onClick={() => this.prosesOpenRinci(item)}>Proses</Button>
                                                    ) : (
                                                        <>
                                                            <Button className='mr-1 mt-1' color='success' onClick={() => this.prosesOpenDokumen(item)}>Dokumen Area</Button>
                                                            {(this.state.filter === 'available' && detailUser.user_level == '41') && (
                                                                <Button className='mr-1 mt-1' onClick={() => this.uploadDocIt(item)} color='warning'>Upload Dokumen</Button>
                                                            )}
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                            <div className="mb-3">Demikianlah hal yang kami sampaikan, atas perhatiannya kami mengucapkan terima kasih king</div>
                            <Table bordered responsive className="tabPreview">
                                <thead>
                                    <tr>
                                        <th className="buatPre" colSpan={disApp.pembuat?.length || 1}>Dibuat oleh,</th>
                                        <th className="buatPre" colSpan={
                                            disApp.pemeriksa?.filter(item => item.status_view !== 'hidden').length || 1
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
                                        {disApp.pemeriksa?.filter(item => item.status_view !== 'hidden').map(item => (
                                            <th className="headPre">
                                                <div>{item.status === 0 ? 'Reject' : item.status === 1 ? moment(item.updatedAt).format('LL') : '-'}</div>
                                                <div>{item.nama ?? '-'}</div>
                                            </th>
                                        ))}
                                        {disApp.penyetuju?.filter(item => item.status_view !== 'hidden').map(item => (
                                            <th className="headPre">
                                                <div>{item.status === 0 ? 'Reject' : item.status === 1 ? moment(item.updatedAt).format('LL') : '-'}</div>
                                                <div>{item.nama ?? '-'}</div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        {disApp.pembuat?.filter(item => item.status_view !== 'hidden').map(item => (
                                            <td className="footPre">{item.jabatan ?? '-'}</td>
                                        ))}
                                        {disApp.pemeriksa?.filter(item => item.status_view !== 'hidden').map(item => (
                                            <td className="footPre">{item.jabatan ?? '-'}</td>
                                        ))}
                                        {disApp.penyetuju?.filter(item => item.status_view !== 'hidden').map(item => (
                                            <td className="footPre">{item.jabatan ?? '-'}</td>
                                        ))}
                                    </tr>
                                </tbody>
                            </Table>
                            <div className='underline bold'>Matrix Otorisasi ditandatangani oleh:</div>
                            <Row className='mb-4'>
                                <Col md={6} xl={6} lg={6}>
                                    <div className='bold'>Aset (Nilai &ge; 1000.000, Barang IT)</div>
                                    <div className='txtDisInfo'>1. Area : {areaAppIt}</div>
                                    <div className='txtDisInfo'>2. Head Office : {hoAppIt}</div>
                                </Col>
                                <Col md={6} xl={6} lg={6}>
                                    <div className='bold'>Aset (Nilai &ge; 1000.000, Barang Non IT)</div>
                                    <div className='txtDisInfo'>1. Area : {areaApp}</div>
                                    <div className='txtDisInfo'>2. Head Office : {hoApp}</div>
                                </Col>
                            </Row>
                        </Container>
                        <Container className='xxl'>
                            <div>FRM-HCD-105(1) REV 04</div>
                            {(detailDis.length > 0 && detailDis[0].status_form === 8) && (
                                <div className='justiceEnd mt-4 rowStart'>
                                    <div className='boxRec'>
                                        <div className='mb-3'>DITERIMA ASSET PMA HO</div>
                                        <br />
                                        <div>{moment(detailDis[0].date_finish).format('DD/MM/YYYY')}</div>
                                        <div>PENERIMA: {detailDis[0].pic_aset}</div>
                                    </div>
                                    <div className='boxRec ml-4'>
                                        <div className='mb-3'>EKSEKUSI DI SAP</div>
                                        <div>{moment(detailDis[0].tgl_eksekusi).format('DD/MM/YYYY')}</div>
                                        <div>NO. DOC SAP: {detailDis.reduce((accumulator, object) => {
                                            return accumulator + ` ${object.doc_sap},`
                                            }, 0).slice(2, -1)}
                                        </div>
                                        <div>NO. DOC CLEARING: {detailDis.reduce((accumulator, object) => {
                                            return accumulator + ` ${object.doc_clearing},`
                                            }, 0).slice(2, -1)}
                                        </div>
                                        <div>PENCATAT: {detailDis[0].pic_aset}</div>
                                    </div>
                                </div>
                            )}
                        </Container>
                    </ModalBody>
                    <hr />
                    <div className="modalFoot ml-3">
                        <div className="btnFoot">
                            <FormDisposal />
                            {detailDis.length > 0 && detailDis[0].status_form !== 26 && detailDis[0].status_form !== 9 && detailDis[0].status_form >= 3 && (
                                <FormPersetujuan />
                            )}
                        </div>
                        {this.state.filter === 'available' ? (
                            <div className="btnFoot">
                                <Button className="mr-2" color="danger" disabled={this.state.filter !== 'available' && this.state.filter !== 'revisi' ? true : listMut.length === 0 ? true : false} onClick={this.openModalReject}>
                                    Reject
                                </Button>
                                <Button color="success" onClick={() => this.cekApprove()} disabled={this.state.filter !== 'available' && this.state.filter !== 'revisi' ? true : false}>
                                    Approve
                                </Button>
                            </div>
                        ) : this.state.filter === 'submit' ? (
                            <div className="btnFoot">
                                <Button className='mr-2' color="success" onClick={() => this.cekSubmit()}>
                                    Submit
                                </Button>
                                <Button color="secondary" onClick={() => this.openModalDis()}>
                                    Close
                                </Button>
                            </div>
                        ) : (
                            <div className="btnFoot">
                            </div>
                        )}
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
                                doc_sap: dataRinci.doc_sap === null ? '' : dataRinci.doc_sap,
                                keterangan: dataRinci.keterangan,
                                nilai_jual: dataRinci.nilai_jual
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
                                            <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.kode_plant + '-' + dataRinci.area} disabled /></Col>
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
                                                value={dataRinci.merk}
                                                disabled
                                                />
                                            </Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
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
                                            <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.nilai_buku === null || dataRinci.nilai_buku === undefined ? 0 : dataRinci.nilai_buku.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} disabled /></Col>
                                        </Row>
                                        {level === '2' && dataRinci.nilai_jual === '0' ? (
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Nilai Buku Eksekusi</Col>
                                                <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.nilai_buku_eks === null || dataRinci.nilai_buku_eks === undefined ? 0 : dataRinci.nilai_buku_eks.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} disabled /></Col>
                                            </Row>
                                        ) : (
                                            <div></div>
                                        )}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Nilai Jual</Col>
                                            <Col md={9} className="colRinci">:  <Input 
                                                className="inputRinci" 
                                                value={dataRinci.nilai_jual === null || dataRinci.nilai_jual === undefined ? 0 : dataRinci.nilai_jual.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} 
                                                disabled
                                                />
                                            </Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Keterangan</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                className="inputRinci" 
                                                type="textarea" 
                                                value={dataRinci.keterangan} 
                                                disabled
                                                />
                                            </Col>
                                        </Row>
                                        {dataRinci.nilai_jual !== '0' ? (
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Status NPWP</Col>
                                                <Col md={9} className="colRinci">:
                                                <Input 
                                                type="select"
                                                className="inputRinci"
                                                name="npwp"
                                                disabled={dataRinci.nilai_jual === '0' ? true : false}
                                                // value={this.state.npwp === '' ? dataRinci.npwp : this.state.npwp} 
                                                value={dataRinci.npwp} 
                                                onChange={e => {this.updateNpwp(e.target.value)} }
                                                >
                                                    <option value={null}>-Pilih Status NPWP-</option>
                                                    <option value="ada">Ada</option>
                                                    <option value="tidak">Tidak Ada</option>
                                                </Input>
                                                </Col>
                                            </Row>
                                        ) : (
                                            <Row></Row>
                                        )}
                                    </div>
                                    <Row className="footRinci1 mt-4">
                                        <div className='rowGeneral'>
                                        </div>
                                        <div className='rowGeneral'>
                                            {/* <Button disabled={values.doc_sap === ''} onClick={handleSubmit} className='mr-1' color='primary'>Save</Button> */}
                                            <Button className='mr-2' color='success' onClick={this.openDocEksekusi}>Upload Dokumen</Button>
                                            <Button onClick={this.openModalRinci}>Close</Button>
                                        </div>
                                    </Row>
                                </div>
                            )}
                            </Formik>
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
                    <ModalDokumen
                        parDoc={{ noDoc: this.state.noDoc, noTrans: this.state.noTrans, tipe: 'disposal', filter: this.state.filter, detailForm: this.state.valdoc }}
                        dataDoc={dataDoc}
                    />
                </Modal>
                <Modal 
                    size="xl" 
                    isOpen={this.state.openDoc} 
                    toggle={this.modalUploadDoc}
                >
                    <ModalHeader>
                    Kelengkapan Dokumen
                    </ModalHeader>
                    <ModalBody>
                        <Container>
                            <Alert color="danger" className="alertWrong" isOpen={this.state.upload}>
                                <div>{this.state.errMsg}</div>
                            </Alert>
                            {dataDoc !== undefined && dataDoc.filter(item => detailUser.user_level == '41' ? item.jenis_dokumen === 'it' : item.id !== null).map(x => {
                                return (
                                    <Row className="mt-3 mb-4">
                                        <Col md={12} lg={12} >
                                            <text className='mb-2'>{x.nama_dokumen}</text>
                                            {x.path !== null ? (
                                            <div >
                                                {x.status === 0 ? (
                                                    <AiOutlineClose size={20} />
                                                ) : x.status === 3 ? (
                                                    <AiOutlineCheck size={20} />
                                                ) : (
                                                    <BsCircle size={20} />
                                                )}
                                                <button className="btnDocIo" onClick={() => this.showDokumen(x)} >{x.nama_dokumen}</button>
                                                <div className="colDoc">
                                                    <input
                                                    className="mb-1 mt-1"
                                                    type="file"
                                                    onClick={() => this.setState({detail: x})}
                                                    onChange={this.onChangeUpload}
                                                    />
                                                    <text className="txtError mb-1">Maximum file upload is 20 Mb</text>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="colDoc">
                                                <input
                                                className="mb-1 mt-1"
                                                type="file"
                                                onClick={() => this.setState({detail: x})}
                                                onChange={this.onChangeUpload}
                                                />
                                                <text className="txtError mb-1">Maximum file upload is 20 Mb</text>
                                            </div>
                                        )}
                                        </Col>
                                    </Row>
                                )
                            })}
                        </Container>
                    </ModalBody>
                    <ModalFooter>
                        <Button className="mr-2" color="secondary" onClick={this.modalUploadDoc}>
                            Close
                        </Button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.openReject} toggle={this.openModalReject} centered={true}>
                    <ModalBody>
                        <Formik
                            initialValues={{
                                alasan: "",
                            }}
                            validationSchema={alasanSchema}
                            onSubmit={(values) => {
                                // this.rejectMutasi(values)
                                this.prepReject(values)
                            }}
                        >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, }) => (
                            <div className={style.modalApprove}>
                                <div className='mb-2 quest'>Anda yakin untuk reject ?</div>
                                <div className='mb-2 titStatus'>Pilih reject :</div>
                                <div className="ml-2">
                                    <Input
                                        addon
                                        type="checkbox"
                                        checked={this.state.typeReject === 'perbaikan' ? true : false}
                                        onClick={this.state.typeReject === 'perbaikan' ? () => this.rejectRej('perbaikan') : () => this.rejectApp('perbaikan')}
                                    />  Perbaikan
                                </div>
                                <div className="ml-2">
                                    <Input
                                        addon
                                        type="checkbox"
                                        checked={this.state.typeReject === 'pembatalan' ? true : false}
                                        onClick={this.state.typeReject === 'pembatalan' ? () => this.rejectRej('pembatalan') : () => this.rejectApp('pembatalan')}
                                    />  Pembatalan
                                </div>
                                <div className='ml-2'>
                                    {this.state.typeReject === '' ? (
                                        <text className={style.txtError}>Must be filled</text>
                                    ) : null}
                                </div>
                                {this.state.typeReject === 'perbaikan' && (
                                    <>
                                        <div className='mb-2 mt-2 titStatus'>Pilih Menu Revisi :</div>
                                        <div className="ml-2">
                                            <Input
                                                addon
                                                type="checkbox"
                                                checked={this.state.menuRev === 'Revisi Area' ? true : false}
                                                onClick={this.state.menuRev === 'Revisi Area' ? () => this.menuRej('Revisi Area') : () => this.menuApp('Revisi Area')}
                                            />  Revisi Area
                                        </div>
                                        {/* <div className="ml-2">
                                        <Input
                                        addon
                                        type="checkbox"
                                        checked= {this.state.menuRev === 'pembatalan' ? true : false}
                                        onClick={this.state.menuRev === 'pembatalan' ? () => this.menuRej('pembatalan') : () => this.menuApp('pembatalan')}
                                        />  Revisi Asset
                                    </div> */}
                                        <div className='ml-2'>
                                            {this.state.menuRev === '' ? (
                                                <text className={style.txtError}>Must be filled</text>
                                            ) : null}
                                        </div>
                                    </>
                                )}

                                <div className='mb-2 mt-2 titStatus'>Pilih alasan :</div>
                                    <div className="ml-2">
                                        <Input
                                            addon
                                            type="checkbox"
                                            checked={listStat.find(element => element === 'Nilai jual tidak sesuai') !== undefined ? true : false}
                                            onClick={listStat.find(element => element === 'Nilai jual tidak sesuai') === undefined ? () => this.statusApp('Nilai jual tidak sesuai') : () => this.statusRej('Nilai jual tidak sesuai')}
                                        />  Nilai jual tidak sesuai
                                    </div>
                                    <div className="ml-2">
                                        <Input
                                            addon
                                            type="checkbox"
                                            checked={listStat.find(element => element === 'Keterangan tidak sesuai') !== undefined ? true : false}
                                            onClick={listStat.find(element => element === 'Keterangan tidak sesuai') === undefined ? () => this.statusApp('Keterangan tidak sesuai') : () => this.statusRej('Keterangan tidak sesuai')}
                                        />  Keterangan tidak sesuai
                                    </div>
                                    <div className="ml-2">
                                        <Input
                                            addon
                                            type="checkbox"
                                            checked={listStat.find(element => element === 'Dokumen lampiran tidak sesuai') !== undefined ? true : false}
                                            onClick={listStat.find(element => element === 'Dokumen lampiran tidak sesuai') === undefined ? () => this.statusApp('Dokumen lampiran tidak sesuai') : () => this.statusRej('Dokumen lampiran tidak sesuai')}
                                        />  Dokumen lampiran tidak sesuai
                                    </div>
                                    <div className={style.alasan}>
                                        <text className='ml-2'>
                                            Lainnya
                                        </text>
                                    </div>
                                    <Input
                                        type="name"
                                        name="select"
                                        className="ml-2 inputRec"
                                        value={values.alasan}
                                        onChange={handleChange('alasan')}
                                        onBlur={handleBlur('alasan')}
                                    />
                                    <div className='ml-2'>
                                        {listStat.length === 0 && (values.alasan.length < 3) ? (
                                            <text className={style.txtError}>Must be filled</text>
                                        ) : null}
                                    </div>
                                    <div className={style.btnApprove}>
                                        <Button color="primary" disabled={(((values.alasan === '.' || values.alasan === '') && listStat.length === 0) || this.state.typeReject === '' || (this.state.typeReject === 'perbaikan' && this.state.menuRev === '')) ? true : false} onClick={handleSubmit}>Submit</Button>
                                        <Button className='ml-2' color="secondary" onClick={this.openModalReject}>Close</Button>
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
                                    Anda yakin untuk approve disposal    
                                    <text className={style.verif}> </text>
                                    pada tanggal
                                    <text className={style.verif}> {moment().format('LL')}</text> ?
                                </text>
                            </div>
                            <div className={style.btnApprove}>
                                <Button color="primary" onClick={() => this.prepSendEmail('approve')}>Ya</Button>
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
                <Modal isOpen={this.state.modalConfirm} toggle={this.openConfirm} size="md">
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
                        ) : this.state.confirm === 'submit' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Submit</div>
                            </div>
                            </div>
                        ) : this.state.confirm === 'upNpwp' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Update</div>
                            </div>
                            </div>
                        ) : this.state.confirm === 'reject' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                    <div className={[style.sucUpdate, style.green]}>Berhasil Reject</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'rejApprove' ? (
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
                        ) : this.state.confirm === 'falseCancel' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                    <div className={[style.sucUpdate, style.green]}>Gagal Reject</div>
                                    <div className="errApprove mt-2">Reject pembatalan hanya bisa dilakukan jika semua data ajuan terceklis</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'falseUploadDok' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                    <div className={[style.sucUpdate, style.green]}>Gagal Approve</div>
                                    <div className="errApprove mt-2">Mohon upload dokumen terlebih dahulu</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'falseAppDok' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                    <div className={[style.sucUpdate, style.green]}>Gagal Approve</div>
                                    <div className="errApprove mt-2">Mohon approve dokumen terlebih dahulu</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'falseNpwp' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                    <div className={[style.sucUpdate, style.green]}>Gagal</div>
                                    <div className="errApprove mt-2">Mohon isi status NPWP terlebih dahulu</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'falseDoc' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                    <div className={[style.sucUpdate, style.green]}>Gagal Submit</div>
                                    <div className="errApprove mt-2">Mohon upload dokumen eksekusi terlebih dahulu</div>
                                </div>
                            </div>
                        ) : (
                            <div></div>
                        )}
                    </ModalBody>
                    <div className='row justify-content-md-center mb-4'>
                        <Button size='lg' onClick={() => this.openConfirm(false)} color='primary'>OK</Button>
                    </div>
                </Modal>
                <Modal isOpen={this.state.submitPre} toggle={this.modalSubmitPre} size="xl" className='xl'>
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
                            <div className="mb-3">Bpk/Ibu. {dataUser.length > 0 && dataUser[0].fullname}</div>
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
                                    {newSubmit.length !== 0 ? newSubmit.map(item => {
                                        return (
                                            <tr>
                                                <th scope="row">{newSubmit.indexOf(item) + 1}</th>
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
                            <Table borderless responsive className="tabPreview">
                                <thead>
                                    <tr>
                                        <th className="buatPre">Diajukan oleh,</th>
                                        <th className="buatPre">Disetujui oleh,</th>
                                    </tr>
                                </thead>
                                <tbody className="tbodyPre">
                                    <tr>
                                        <td className="restTable">
                                            <Table bordered responsive className="divPre">
                                                <thead>
                                                    <tr>
                                                        {disSet.pembuat !== undefined && disSet.pembuat.map(item => {
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
                                                        {disSet.pembuat !== undefined && disSet.pembuat.map(item => {
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
                                                        {disSet.penyetuju !== undefined && disSet.penyetuju.map(item => {
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
                                                        {disSet.penyetuju !== undefined && disSet.penyetuju.map(item => {
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
                            <hr />
                            <div className="rowBetween">
                                <div className="">
                                    <Button color='primary' onClick={this.downloadFormSet}>Download Form</Button>
                                </div>
                                <div className="rowGeneral">
                                    <Button className='mr-2' color="success" onClick={() => this.openSubmit()}>
                                        Submit
                                    </Button>
                                    <Button color="secondary" onClick={() => this.modalSubmitPre()}>
                                        Close
                                    </Button>
                                </div>
                            </div>
                            
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalSubmit} toggle={this.openSubmit} centered={true}>
                    <ModalBody>
                        <div className={style.modalApprove}>
                            <div>
                                <text>
                                    Anda yakin untuk submit 
                                    <text className={style.verif}>  </text>
                                    pada tanggal
                                    <text className={style.verif}> {moment().format('LL')}</text> ?
                                </text>
                            </div>
                            <div className={style.btnApprove}>
                                <Button color="primary" onClick={() => this.prepSendEmail('submit')}>Ya</Button>
                                <Button color="secondary" onClick={this.openSubmit}>Tidak</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalTrack} toggle={() => {this.openModalTrack()}} size="xl" className='xl'>
                    <TrackingDisposal />
                    <hr />
                    <div className="modalFoot ml-3">
                        {/* <Button color="primary" onClick={() => this.openModPreview({nama: 'disposal pengajuan', no: detailDis[0] !== undefined && detailDis[0].no_disposal})}>Preview</Button> */}
                        <div></div>
                        <div className="btnFoot">
                            <Button color="primary" onClick={() => {this.openModalTrack()}}>
                                Close
                            </Button>
                        </div>
                    </div>
                </Modal>
                <Modal isOpen={this.state.openDraft} size='xl'>
                    <ModalHeader>Email Pemberitahuan</ModalHeader>
                    <ModalBody>
                        <Email handleData={this.getMessage} tipe={'pengajuan'}/>
                        <div className={style.foot}>
                            <div></div>
                            <div>
                                <Button
                                    disabled={this.state.message === '' ? true : false} 
                                    className="mr-2"
                                    onClick={tipeEmail === 'reject' 
                                    ? () => this.rejectDisposal(this.state.dataRej) 
                                    : tipeEmail === 'submit' ? () => this.prosesSubmitEks()
                                    : () => this.approveDisposal()
                                    } 
                                    color="primary"
                                >
                                    {tipeEmail === 'submit' ? 'Submit' : tipeEmail === 'reject' ? 'Reject' : 'Approve'} & Send Email
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
    asset: state.asset,
    disposal: state.disposal,
    setuju: state.setuju,
    approve: state.approve,
    pengadaan: state.pengadaan,
    setuju: state.setuju,
    notif: state.notif,
    auth: state.auth,
    user: state.user,
    tracking: state.tracking,
    tempmail: state.tempmail,
    newnotif: state.newnotif,
    dokumen: state.dokumen,
    depo: state.depo
})

const mapDispatchToProps = {
    logout: auth.logout,
    getDetailDepo: depo.getDetailDepo,
    getDepo: depo.getDepo,
    getAsset: asset.getAsset,
    resetError: asset.resetError,
    nextPage: asset.nextPage,
    getDisposal: disposal.getDisposal,
    addDisposal: disposal.addDisposal,
    deleteDisposal: disposal.deleteDisposal,
    resetDis: disposal.reset,
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
    getDetailDisposal: disposal.getDetailDisposal,
    getTrack: tracking.getTrack,
    getDraftEmail: tempmail.getDraftEmail,
    sendEmail: tempmail.sendEmail,
    addNewNotif: newnotif.addNewNotif,
    getDetailUser: user.getDetailUser,
    getApproveSetDisposal: setuju.getApproveSetDisposal,
    getUser: user.getUser,
    genNoSetDisposal: setuju.genNoSetDisposal,
    updateDisposal: disposal.updateDisposal,
    uploadDocumentDis: disposal.uploadDocumentDis,
    submitEksDisposal: setuju.submitEksDisposal,
    searchDisposal: disposal.searchDisposal
}

export default connect(mapStateToProps, mapDispatchToProps)(Disposal)
