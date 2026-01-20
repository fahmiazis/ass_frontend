/* eslint-disable jsx-a11y/no-distracting-elements */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react'
import { Container, NavbarBrand, Table, Input, Button, Col,
    Alert, Spinner, Row, Modal, ModalBody, ModalHeader, ModalFooter,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap'
import style from '../../assets/css/input.module.css'
import {FaSearch, FaUserCircle, FaBars, FaCartPlus, FaFileSignature, FaTh, FaList} from 'react-icons/fa'
import {BsCircle, BsBell, BsFillCircleFill} from 'react-icons/bs'
import { AiOutlineCheck, AiOutlineClose, AiFillCheckCircle, AiOutlineInbox} from 'react-icons/ai'
import {Formik} from 'formik'
import * as Yup from 'yup'
import Pdf from "../../components/Pdf"
import {Form} from 'react-bootstrap'
import logo from '../../assets/img/logo.png'
import {connect} from 'react-redux'
import pengadaan from '../../redux/actions/pengadaan'
import dokumen from '../../redux/actions/dokumen'
import tempmail from '../../redux/actions/tempmail'
import newnotif from '../../redux/actions/newnotif'
import OtpInput from "react-otp-input";
import moment from 'moment'
import auth from '../../redux/actions/auth'
import depo from '../../redux/actions/depo'
import {default as axios} from 'axios'
import Sidebar from "../../components/Header"
import MaterialTitlePanel from "../../components/material_title_panel"
import SidebarContent from "../../components/sidebar_content"
import placeholder from  "../../assets/img/placeholder.png"
import TablePeng from '../../components/TablePeng'
import notif from '../../redux/actions/notif'
import NavBar from '../../components/NavBar'
import styleTrans from '../../assets/css/transaksi.module.css'
import NewNavbar from '../../components/NewNavbar'
import Email from '../../components/Pengadaan/Email'
import ModalDokumen from '../../components/ModalDokumen'
import Select from 'react-select'
import FormIo from '../../components/Pengadaan/FormIo'
const {REACT_APP_BACKEND_URL} = process.env

const disposalSchema = Yup.object().shape({
    merk: Yup.string().validateSync(""),
    keterangan: Yup.string().required('must be filled'),
    nilai_jual: Yup.string().required()
})

const alasanSchema = Yup.object().shape({
    alasan: Yup.string().required()
})

const alasanDisSchema = Yup.object().shape({
    alasan: Yup.string().required(),
    jenis_reject: Yup.string().required()
})

const cartSchema = Yup.object().shape({
    nama: Yup.string().required(),
    qty: Yup.string().required(),
    price: Yup.string().required(),
    kategori: Yup.string().required(),
    tipe: Yup.string().required(),
    jenis: Yup.string().required(),
    akta: Yup.string().nullable(true),
    start: Yup.date().nullable(true),
    end: Yup.date().nullable(true)
})

class EditTicket extends Component {
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
            view: 'card',
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
            listMut: [],
            noDoc: '',
            noTrans: '',
            newIo: [],
            filter: 'available',
            isAppall: false,
            openDraft: false,
            openSubmit: false,
            tipeEmail: '',
            subject: '',
            message: '',
            noAjuan: '',
            showOptions: false,
            listNoIo: [],
            dataItem: [],
            typeCost: '',
            listCost: [],
            openCost: false,
            valCart: {},
            typeProfit: ''
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
            isAsset: val.value
        }
        await this.props.updateDataIo(token, val.item.id, data)
        await this.props.getDetail(token, val.item.no_pengadaan)
    }

    openModalApproveIo = () => {
        const level = localStorage.getItem('level')
        const {detailIo} = this.props.pengadaan
        if ((level === '5' || level === '9') && (detailIo[0].alasan === '' || detailIo[0].alasan === null || detailIo[0].alasan === '-')) {
            this.setState({confirm: 'recent'})
            this.openConfirm()
        } else {
            this.setState({openApproveIo: !this.state.openApproveIo})
        }
    }

    openModalRejectDis = () => {
        this.setState({openRejectDis: !this.state.openRejectDis})
    }

    openModalReject = () => {
        const level = localStorage.getItem('level')
        const {detailIo} = this.props.pengadaan
        if ((level === '5' || level === '9') && (detailIo[0].alasan === '' || detailIo[0].alasan === null || detailIo[0].alasan === '-')) {
            this.setState({confirm: 'recent'})
            this.openConfirm()
        } else {
            this.setState({openReject: !this.state.openReject})
        }
    }

    openModalApprove = () => {
        this.setState({openApprove: !this.state.openApprove})
    }

    modalSubmitPre = () => {
        this.setState({submitPre: !this.state.submitPre})
    }

    prosesModalDoc = async (val) => {
        const data = this.props.pengadaan.detailIo
        const token = localStorage.getItem('token')
        this.setState({valdoc: val})
        
        if (val.asset_token === null || val.asset_token === '') {
            const tempno = {
                no: val.id,
                jenis: 'pengadaan'
            }
            await this.props.getDokumen(token, tempno)
            await this.props.getDocCart(token, val.id)
            this.setState({noDoc: val.id, noTrans: data[0].no_pengadaan})
            this.closeProsesModalDoc()
        } else {
            const tempno = {
                no: data[0].no_pengadaan,
                jenis: 'pengadaan'
            }
            await this.props.getDokumen(token, tempno)
            await this.props.getDocumentIo(token, data[0].no_pengadaan)
            this.setState({noDoc: data[0].no_pengadaan, noTrans: data[0].no_pengadaan})
            this.closeProsesModalDoc()
        }
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
            if (detailIo[i].isAsset !== 'true' && detailIo[i].isAsset !== 'false') {
                cek.push(detailIo[i])  
            }
        }
        if (cek.length > 0) {
            this.setState({confirm: 'falseSubmit'})
            this.openConfirm()
        } else {
            await this.props.submitIsAsset(token, val)
            this.getDataAsset()
            this.setState({confirm: 'submit'})
            this.openConfirm()
        }
    }

    changeView = (val) => {
        this.setState({view: val})
        if (val === 'list') {
            // this.getDataList()
        } else {
            // this.getDataStock()
        }
    }

    openForm = async (val) => {
        const token = localStorage.getItem('token')
        const level = localStorage.getItem('level')
        const { dataDepo } = this.props.depo
        await this.props.getDetail(token, val.no_pengadaan)
        await this.props.getApproveIo(token, val.no_pengadaan)
        const data = this.props.pengadaan.detailIo
        let num = 0
        const listCost = []
        const cekCost = []
        for (let i = 0; i < data.length; i++) {
            if (data[i].isAsset !== 'true' && level !== '2' ) {
                const temp = 0
                num += temp
            } else {
                const temp = parseInt(data[i].price) * parseInt(data[i].qty)
                num += temp
            }
            await this.props.getDetailItem(token, data[i].id)
            if (data[0].type_ajuan !== 'single' && data[0].type_ajuan !== 'multiple') {
                cekCost.push('area')
            } else {
                const { dataDetail } = this.props.pengadaan
                for (let x = 0; x < dataDetail.length; x++) {
                    listCost.push(dataDetail[x])
                    cekCost.push(dataDetail[x].cost_center)
                }
            }
        }
        const uniqueCost = [...new Set(cekCost)]
        const typeCost = cekCost[0] === 'area' ? 'area' : uniqueCost.length > 1 ? "MULTIPLE" : uniqueCost[0].split('-')[1]
        const typeProfit = cekCost[0] === 'area' ? 'area' : uniqueCost.length > 1 ? "MULTIPLE" : dataDepo.find(x => x.cost_center === typeCost).profit_center
        setTimeout(() => {
            console.log(typeCost)
            this.setState({ total: num, value: data[0].no_io, typeCost: typeCost, typeProfit: typeProfit, listCost: listCost })
            this.prosesModalIo()
        }, 100)
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

    updateAlasan = async (val) => {
        const token = localStorage.getItem('token')
        const {detailIo} = this.props.pengadaan
        await this.props.updateReason(token, detailIo[0].no_pengadaan, val)
        await this.props.getDetail(token, detailIo[0].no_pengadaan)
        this.setState({confirm: 'upreason'})
        this.openConfirm()
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

    goDownload = (val) => {
        const {detailIo} = this.props.pengadaan
        localStorage.setItem('printData', detailIo[0].no_pengadaan)
        const newWindow = window.open(`/${val}`, '_blank', 'noopener,noreferrer')
        if (newWindow) {
            newWindow.opener = null
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

    approveAll = async () => {
        const {newIo, listMut} = this.state
        const token = localStorage.getItem('token')
        const data = []
        for (let i = 0; i < newIo.length; i++) {
            for (let j = 0; j < listMut.length; j++) {
                if (newIo[i].id === listMut[j]) {
                    data.push(newIo[i].no_pengadaan)
                }
            }
        }
        await this.props.approveAll(token, data)
        this.openAppall()
    }

    componentDidUpdate() {
        const {isError, isUpload, isUpdate, approve, rejApprove, reject, rejReject, detailIo} = this.props.pengadaan
        const {rinciIo, listMut, newIo} = this.state
        const token = localStorage.getItem('token')
        if (isError) {
            this.props.resetError()
            this.showAlert()
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
        } else if (listMut.length > newIo.length) {
            this.setState({listMut: []})
        }
    }

    onSearch = async (e) => {
        this.setState({search: e.target.value})
        const token = localStorage.getItem("token")
        if(e.key === 'Enter'){
            // await this.props.getAsset(token, 10, e.target.value, 1)
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

    async componentDidMount() {
        // this.getNotif()
        const token = localStorage.getItem("token")
        this.getDataAsset()
        await this.props.getDepo(token, 1000, '')
    }

    getDataAsset = async (value) => {
        const level = localStorage.getItem('level')
        const status = ''
        const token = localStorage.getItem("token")
        await this.props.getRevisi(token, status)
        this.changeFilter('available')
    }

    openAppall = () => {
        this.setState({isAppall: !this.state.isAppall})
    }

    changeFilter = (val) => {
        const {revPeng} = this.props.pengadaan
        // const role = localStorage.getItem('role')
        const level = localStorage.getItem('level')
        if (level === '2') {
            this.setState({filter: val, newIo: revPeng})
        } else {
            this.setState({filter: val, newIo: revPeng})
            // if (val === 'available') {
            //     const newIo = []
            //     for (let i = 0; i < revPeng.length; i++) {
            //         const app = revPeng[i].appForm ===  undefined ? [] : revPeng[i].appForm
            //         const find = app.indexOf(app.find(({jabatan}) => jabatan === role))
            //         if (level === '5' || level === '9') {
            //             if (app[find] === undefined || (app[find - 1].status === null && (app[find].status === null || app[find].status === 0))) {
            //                 newIo.push(revPeng[i])
            //             }
            //         } else if (find === 0 || find === '0') {
            //             if (app[find] !== undefined && app[find + 1].status === 1 && app[find].status !== 1) {
            //                 newIo.push(revPeng[i])
            //             }
            //         } else {
            //             if (app[find] !== undefined && app[find + 1].status === 1 && app[find - 1].status === null && app[find].status !== 1) {
            //                 newIo.push(revPeng[i])
            //             }
            //         }
            //     }
            //     this.setState({filter: val, newIo: newIo})
            // } else {
            //     const newIo = []
            //     for (let i = 0; i < revPeng.length; i++) {
            //         const app = revPeng[i].appForm ===  undefined ? [] : revPeng[i].appForm
            //         const find = app.indexOf(app.find(({jabatan}) => jabatan === role))
            //         if (level === '5' || level === '9') {
            //             if (app[find] === undefined || (app[find - 1].status === null && (app[find].status === null || app[find].status === 0))) {
            //                 newIo.push()
            //             } else {
            //                 newIo.push(revPeng[i])
            //             }
            //         } else if (find === 0 || find === '0') {
            //             if (app[find] !== undefined && app[find + 1].status === 1 && app[find].status !== 1) {
            //                 newIo.push()
            //             } else {
            //                 newIo.push(revPeng[i])
            //             }
            //         } else {
            //             if (app[find] !== undefined && app[find + 1].status === 1 && app[find - 1].status === null && app[find].status !== 1) {
            //                 newIo.push()
            //             } else {
            //                 newIo.push(revPeng[i])
            //             }
            //         }
            //     }
            //     this.setState({filter: val, newIo: newIo})
            // }
        }
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
        this.setState({dataRinci: val, valCart: val})
        const role = localStorage.getItem('role')
        const app = val.appForm
        const find = app.indexOf(app.find(({jabatan}) => jabatan === role))
        this.setState({app: app, find: find})
        this.openRinciAdmin()
    }

    chekApp = (val) => {
        const { listMut, newIo } = this.state
        if (val === 'all') {
            const data = []
            for (let i = 0; i < newIo.length; i++) {
                data.push(newIo[i].id)
            }
            this.setState({listMut: data})
        } else {
            listMut.push(val)
            this.setState({listMut: listMut})
        }
    }

    chekRej = (val) => {
        const { listMut } = this.state
        if (val === 'all') {
            const data = []
            this.setState({listMut: data})
        } else {
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
    }

    prosesModalRinci = (val) => {
        console.log(val)
        this.setState({dataRinci: val, valCart: val})
        this.prosesRinci()
    }

    prosesRinci = () => {
        this.setState({rinci: !this.state.rinci})
    }

    selectNoIo = async (e) => {
        console.log('masuk ke select')
        console.log(e)
        const { dataSearch } = this.props.pengadaan
        const idVal = e.val.value
        const data = dataSearch.find((item) => item.no_pengadaan === idVal)
        if (data === undefined) {
            console.log('undefined')
        } else {
            this.setState({noAjuan: data.no_pengadaan})
        }
    }

    inputNoIo = (val) => {
        console.log(val)
        const { noAjuan } = this.state
        // this.setState({noAjuan: noAjuan.length > 3 && val === '' ? noAjuan : val })
        if(val !== undefined && val.length > 10) {
            this.getDataIo(val)
        } else {
            this.setState({ showOptions: false })
            console.log('please press enter {} {}')
        }
    }

    getDataIo = async (val) => {
        const token = localStorage.getItem("token")
        const search = val
        await this.props.searchIo(token, '8', 'all', 'all', search, 100)
        const {dataSearch} = this.props.pengadaan
        console.log(dataSearch)
        if (dataSearch.length > 0) {
            const listNoIo = [
                {value: '', label: '-Pilih-'}
            ]

            for (let i = 0; i < dataSearch.length; i++) {
                // if (dataSearch[i].no_asset !== null) {
                    listNoIo.push({value: dataSearch[i].no_pengadaan, label: dataSearch[i].no_pengadaan})
                // }
            }
            console.log(listNoIo)
            this.setState({listNoIo: listNoIo, showOptions: true})
        } else {
            this.setState({listNoIo: [], showOptions: true})
        }
    }

    editCart = async (val) => {
        const token = localStorage.getItem('token')
        const {detailIo} = this.props.pengadaan
        const {dataRinci} = this.state
        const cek = []
        for (let i = 0; i < detailIo.length; i++) {
            if ((detailIo[i].kategori !== val.kategori || detailIo[i].tipe !== val.tipe) && detailIo.length > 1) {
                cek.push(1)
            }
        }
        if (cek.length > 0) {
            this.setState({confirm: 'falseAdd'})
            this.openConfirm()
        } else {
            const data = {
                ...val,
                type_ajuan: dataRinci.type_ajuan,
                no_ref: val.kategori === 'return' ? this.state.noAjuan : ''
            }
            await this.props.updateCart(token, dataRinci.id, data)
            if (dataRinci.kategori !== val.kategori) {
                await this.props.getApproveIo(token, dataRinci.no_pengadaan, 'revisi')
            }
            await this.props.getApproveIo(token, dataRinci.no_pengadaan)
            await this.props.appRevisi(token, dataRinci.id)
            await this.props.getDetail(token, detailIo[0].no_pengadaan)
            this.prosesRinci()
            this.setState({confirm: 'update'})
            this.openConfirm()
        }
    }

    prepSendEmail = async (val) => {
        const {detailIo} = this.props.pengadaan
        const token = localStorage.getItem("token")
        const level = localStorage.getItem('level')
        const menu = 'Revisi (Pengadaan asset)'
        const tipe = 'revisi'
        const tempno = {
            no: detailIo[0].no_pengadaan,
            kode: detailIo[0].kode_plant,
            jenis: 'pengadaan',
            tipe: tipe,
            menu: menu
        }
        this.setState({tipeEmail: val})
        await this.props.getDetail(token, detailIo[0].no_pengadaan)
        if (detailIo[0].kode_plant === 'HO') {
            await this.props.getDraftEmailHo(token, tempno)
        } else {
            await this.props.getDraftEmail(token, tempno)
        }
        this.openDraftEmail()
    }

    openDraftEmail = () => {
        this.setState({openDraft: !this.state.openDraft}) 
    }

    submitRevisi = async (val) => {
        const token = localStorage.getItem("token")
        const {detailIo} = this.props.pengadaan
        const data = {
            no: detailIo[0].no_pengadaan
        }
        this.prosesSendEmail('budget')
        await this.props.submitRevisi(token, data)
        this.prosesModalIo()
        this.openModalSubmit()
        this.getDataAsset()
        this.setState({confirm: 'submit'})
        this.openConfirm()
        this.openDraftEmail()
    }

    prosesSendEmail = async (val) => {
        const token = localStorage.getItem('token')
        const { draftEmail } = this.props.tempmail
        const { detailIo } = this.props.pengadaan
        const { message, subject } = this.state
        const cc = draftEmail.cc
        const tempcc = []
        for (let i = 0; i < cc.length; i++) {
            tempcc.push(cc[i].email)
        }
        const sendMail = {
            draft: draftEmail,
            nameTo: draftEmail.to.fullname,
            to: draftEmail.to.email,
            cc: tempcc.toString(),
            message: message,
            subject: subject,
            no: detailIo[0].no_pengadaan,
            tipe: 'pengadaan',
            menu: `pengadaan asset`,
            proses: 'submit revisi',
            route: 'pengadaan'
        }
        await this.props.sendEmail(token, sendMail)
        await this.props.addNewNotif(token, sendMail)
    }

    cekSubmit = () => {
        const {detailIo} = this.props.pengadaan
        const cek = []
        detailIo.map(item => {
            return (item.isreject !== 1 && cek.push(item))
        })
        if (cek.length === detailIo.length) {
            this.openModalSubmit()
        } else {
            this.setState({confirm: 'revdata'})
            this.openConfirm()
        }
    }

    openModalSubmit = () => {
        this.setState({openSubmit: !this.state.openSubmit})
    }

    openCost = () => {
        this.setState({openCost: !this.state.openCost})
    }

    render() {
        const {alert, upload, errMsg, rinciIo, total, listMut, newIo, dataRinci, typeCost, listCost, dataItem, valCart, typeProfit} = this.state
        const {dataAsset, alertM, alertMsg, alertUpload, page} = this.props.asset
        const pages = this.props.disposal.page 
        const {revPeng, isLoading, isError, dataApp, dataDoc, detailIo, dataDocCart, infoApp} = this.props.pengadaan
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const dataNotif = this.props.notif.data
        const { dataDepo } = this.props.depo
        const role = localStorage.getItem('role')
        const cekKode = detailIo[0] && (detailIo[0].kode_plant.length > 4 || detailIo[0].kode_plant === 'HO') ? 9 : 5

        const splitApp = infoApp.info ? infoApp.info.split(']') : []
        const pembuatApp = splitApp.length > 0 ? splitApp[0] : ''
        const pemeriksaApp = splitApp.length > 0 ? splitApp[1] : ''
        const penyetujuApp = splitApp.length > 0 ? splitApp[2] : ''

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
                        <h2 className={styleTrans.pageTitle}>Revisi Pengadaan Asset</h2>
                        <div className={styleTrans.searchContainer}>
                            <input
                                type="text"
                                placeholder="Search..."
                                onChange={this.onSearch}
                                value={this.state.search}
                                onKeyPress={this.onSearch}
                                className={styleTrans.searchInput}
                            />
                            <div></div>
                        </div>

                        <table className={styleTrans.table}>
                            <thead>
                                <tr>
                                    <th>NO</th>
                                    <th>NO AJUAN</th>
                                    <th>KODE AREA</th>
                                    <th>NAMA AREA</th>
                                    <th>TANGGAL AJUAN</th>
                                    <th>JENIS AJUAN</th>
                                    <th>STATUS</th>
                                    <th>OPSI</th>
                                </tr>
                            </thead>
                            <tbody>
                                {newIo !== undefined && newIo.map(item => {
                                    return (
                                        item.status_reject === 1 && (
                                            <tr>
                                                <td>{newIo.indexOf(item) + 1}</td>
                                                <td>{item.no_pengadaan}</td>
                                                <td>{item.kode_plant}</td>
                                                <td>{item.area ? item.area : item.depo ? `${item.depo.nama_area} ${item.depo.channel}` : ''}</td>
                                                <td>{moment(item.tglIo).format('DD MMMM YYYY')}</td>
                                                <td>{item.kategori === 'return' ? 'Pengajuan Return' : item.asset_token === null ? 'Pengajuan Asset' : 'Pengajuan PODS'}</td>
                                                <td>{item.history !== null && item.history.split(',').reverse()[0]}</td>
                                                <td><Button color='primary' onClick={() => this.openForm(item)}>Proses</Button></td>
                                            </tr>
                                        )
                                    )
                                })}
                            </tbody>
                        </table>
                        {newIo.filter(item => item.status_reject === 1).length === 0 && (
                            <div className={style.spinCol}>
                                <AiOutlineInbox size={50} className='mb-4' />
                                <div className='textInfo'>Data ajuan tidak ditemukan</div>
                            </div>
                        )}
                    </div>
                </div>
                <Modal size="xl" isOpen={this.state.openModalIo} toggle={this.prosesModalIo} className='large'>
                    <ModalBody className="mb-5">
                        <Container className='borderGen'>
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
                                    numInputs={(this.state.value === undefined || this.state.value === null) ? 11 : this.state.value.length > 11 ? this.state.value.length : 11}
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
                                                <th>Opsi</th>
                                                <th>Qty</th>
                                                <th>Description</th>
                                                <th>Price/unit</th>
                                                <th>Total Amount</th>
                                                {detailIo !== undefined && detailIo.length > 0 && detailIo[0].asset_token === null ? (
                                                    <th>Dokumen</th>
                                                ) : (
                                                    null
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {detailIo !== undefined && detailIo.length > 0 && detailIo.map(item => {
                                                return (
                                                    item.isAsset === 'false' && level !== '2' ? (
                                                        null
                                                    ) : (
                                                        <tr onClick={() => this.openModalRinci()}>
                                                            <td className='colGeneral'>
                                                                {item.isreject === 1 || item.isreject === 0 ? 
                                                                <>
                                                                    {item.isreject === 1 ? 'Perlu Diperbaiki' : 'Telah diperbaiki'}
                                                                    <Button className='mt-2' color="info" size='sm' onClick={() => this.prosesModalRinci(item)}>Update</Button>
                                                                </>
                                                                :'-'}
                                                            </td>
                                                            <td>{item.qty}</td>
                                                            <td>{item.nama}</td>
                                                            <td>Rp {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                            <td>Rp {(parseInt(item.price) * parseInt(item.qty)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                            {detailIo !== undefined && detailIo.length > 0 && detailIo[0].asset_token === null ? (
                                                                <td>
                                                                    <Button color='success' size='sm' onClick={() => this.prosesModalDoc(item)}>Show Dokumen</Button>
                                                                </td>
                                                            ) : (
                                                                null
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
                                    value={detailIo[0] === undefined ? '' 
                                    : typeCost === 'area' ? (detailIo[0].depo === undefined ? '' : detailIo[0].depo === null ? '' : detailIo[0].depo.cost_center)
                                    : typeCost}
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
                                    value={detailIo[0] === undefined ? '' 
                                        : typeProfit === 'area' ? (dataDepo.find(x => x.kode_plant === detailIo[0].kode_plant)?.profit_center)
                                        : typeProfit}
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
                            <Formik
                                initialValues={{
                                alasan: detailIo[0] === undefined ? '' : detailIo[0].alasan === null || detailIo[0].alasan === '' || detailIo[0].alasan === '-' ? '' : detailIo[0].alasan,
                                }}
                                validationSchema={alasanSchema}
                                onSubmit={(values) => {this.updateAlasan(values)}}
                                >
                                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                                        <div>
                                            <Row className="rowModal mt-4">
                                                <Col md={2} lg={2}>
                                                    Alasan
                                                </Col>
                                                <Col md={10} lg={10} className="colModal">
                                                <text className="mr-3">:</text>
                                                {level === '5' || level === '9' ? (
                                                    <>
                                                        <Input 
                                                            type='textarea'
                                                            name='alasan'
                                                            className='inputRecent'
                                                            value={values.alasan}
                                                            disabled={detailIo[0].status_form === '1' ? true : false}
                                                            onChange={handleChange('alasan')}
                                                            onBlur={handleBlur('alasan')} 
                                                        />
                                                    </>
                                                ) : (
                                                    <text>{detailIo[0] === undefined ? '-' : detailIo[0].alasan}</text>
                                                )}
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={2} lg={2}></Col>
                                                <Col md={10} lg={10} >
                                                    <text className="mr-3"></text>
                                                    {errors.alasan ? (
                                                        <text className={style.txtError}>Must be filled</text>
                                                    ) : null}
                                                </Col>
                                            </Row>
                                            {this.state.filter === 'available' && detailIo[0].status_form !== '1' ? (
                                                <Row className="rowModal mt-1">
                                                    <Col md={2} lg={2}>
                                                    </Col>
                                                    <Col md={10} lg={10} className="colModal1">
                                                    <text className="mr-3"></text>
                                                    {level === '5' || level === '9' ? (
                                                        <Button 
                                                        onClick={handleSubmit} 
                                                        disabled={detailIo[0].status_form === '1' ? true : false}
                                                        color='success'>
                                                            Update
                                                        </Button>
                                                    ) : (
                                                        null
                                                    )}
                                                    </Col>
                                                </Row>
                                                ) : (
                                                <Row></Row>
                                            )}
                                        </div>
                                    )}
                            </Formik>
                            <Row className="rowModal mt-4">
                                <Col md={12} lg={12}>
                                    {detailIo[0] === undefined ? '' : `${detailIo[0].area}, ${moment(detailIo[0].tglIo).format('DD MMMM YYYY')}`}
                                </Col>
                            </Row>
                            <Table bordered responsive className="tabPreview mt-4">
                                <thead>
                                    <tr>
                                        <th className="buatPre" colSpan={dataApp.pembuat?.length || 1}>Dibuat oleh,</th>
                                        <th className="buatPre" colSpan={
                                            dataApp.pemeriksa?.filter(item => item.status_view !== 'hidden').length || 1
                                        }>Diperiksa oleh,</th>
                                        <th className="buatPre" colSpan={dataApp.penyetuju?.length || 1}>Disetujui oleh,</th>
                                    </tr>
                                    <tr>
                                        {dataApp.pembuat?.map(item => (
                                            <th className="headPre">
                                                <div>{item.status === 0 ? 'Reject' : item.status === 1 ? moment(item.updatedAt).format('LL') : '-'}</div>
                                                <div>{item.nama ?? '-'}</div>
                                            </th>
                                        ))}
                                        {dataApp.pemeriksa?.filter(item => item.status_view !== 'hidden').map(item => (
                                            <th className="headPre">
                                                <div>{item.status === 0 ? 'Reject' : item.status === 1 ? moment(item.updatedAt).format('LL') : '-'}</div>
                                                <div>{item.nama ?? '-'}</div>
                                            </th>
                                        ))}
                                        {dataApp.penyetuju?.map(item => (
                                            <th className="headPre">
                                                <div>{item.status === 0 ? 'Reject' : item.status === 1 ? moment(item.updatedAt).format('LL') : '-'}</div>
                                                <div>{item.nama ?? '-'}</div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        {dataApp.pembuat?.map(item => (
                                            <td className="footPre">{item.jabatan ?? '-'}</td>
                                        ))}
                                        {dataApp.pemeriksa?.filter(item => item.status_view !== 'hidden').map(item => (
                                            <td className="footPre">{item.jabatan ?? '-'}</td>
                                        ))}
                                        {dataApp.penyetuju?.map(item => (
                                            <td className="footPre">{item.jabatan ?? '-'}</td>
                                        ))}
                                    </tr>
                                </tbody>
                            </Table>
                            <div className='mt-4 bold'>Keterangan:</div>
                            <div className=''>No. IO dan Profit Center diisi oleh Budgeting Department</div>
                            <div className=''>Cost Center diisi oleh Asset Department</div>
                            <div className=''>Untuk kategori Non Budgeted dan Return kolom alasan "Wajib" diisi</div>
                            <div className=''>* Sesuai Matriks Otorisasi, disetujui oleh :</div>
                            <div className='ml-4'>- Budgeted / Return : {cekKode === 5 ? (penyetujuApp.split(';')[1] && penyetujuApp.split(';')[1]) : (penyetujuApp.split(';')[3] && penyetujuApp.split(';')[3])}</div>
                            <div className='ml-4 mb-3'>- Non Budgeted : {cekKode === 5 ? (penyetujuApp.split(';')[2] && penyetujuApp.split(';')[2]) : (penyetujuApp.split(';')[4] && penyetujuApp.split(';')[4])}</div>
                        </Container>
                        <Container>
                            <div className='mt-4'>FRM-FAD-058 REV 06</div>
                        </Container>
                    </ModalBody>
                    <hr />
                    <div className="modalFoot">
                        <div className="btnFoot">
                            {detailIo !== undefined && detailIo.length > 0 && detailIo[0].asset_token === null ? (
                                null
                            ) : (
                                <Button className="ml-4" color="info" onClick={this.prosesModalDoc}>
                                    Dokumen 
                                </Button>
                            )}
                            {/* <Button className="ml-2" color="warning" onClick={() => this.goDownload('formio')}>
                                Download Form
                            </Button> */}
                            <FormIo />
                        </div>
                        <div className="btnFoot">
                            <div></div>
                            <Button color="success" onClick={this.cekSubmit}>
                                Submit
                            </Button>
                        </div>
                    </div>
                </Modal>
                <Modal size='xl' isOpen={this.state.openCost}>
                    <ModalHeader>Detail Cost Center</ModalHeader>
                    <ModalBody>
                        <Table>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Cost Center</th>
                                    {this.state.typeCost === 'single' && (
                                        <th>NIK (opsional)</th>
                                    )}
                                    <th>Qty<br></br>( {parseInt(valCart.qty) - (dataItem.reduce((sum, item) => sum + parseInt(item.qty || 0), 0))} remaining )</th>
                                    <th>Opsi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataItem.length > 0 && dataItem.map((item, index) => {
                                    return (
                                        <tr>
                                            <td>{index + 1}</td>
                                            <td>
                                                <Input 
                                                    type="select"
                                                    name="cost_center"
                                                    value={item.cost_center}
                                                    onChange={e => this.updateItem({...item, cost_center: e.target.value}, index)}
                                                >
                                                    <option value="">---Pilih---</option>
                                                    {dataDepo.length > 0 && dataDepo.map(item => {
                                                        return (
                                                            <option value={`${item.place_asset}-${item.cost_center}`}>{item.place_asset}-{item.cost_center}</option>
                                                        )
                                                    })}
                                                </Input>
                                            </td>
                                            {this.state.typeCost === 'single' && (
                                                <td>
                                                    <Input 
                                                        value={item.nik}
                                                    />
                                                </td>    
                                            )}
                                            <td>
                                                <Input 
                                                    type='number'
                                                    value={item.qty}
                                                    onChange={e => this.updateItem({...item, qty: e.target.value}, index)}
                                                />
                                            </td>
                                            <td>
                                                <Button
                                                    onClick={() => this.updateItem(item, index, 'save')}
                                                    color='success'
                                                    className='ml-1 mt-1'
                                                >
                                                    Save
                                                </Button>
                                                <Button
                                                    onClick={() => this.deleteDetail(item)}
                                                    color='danger'
                                                    className='ml-1 mt-1'
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    )
                                })}
                                {(parseInt(valCart.qty) - (dataItem.reduce((sum, item) => sum + parseInt(item.qty || 0), 0))) !== 0 && (
                                    <tr>
                                        <td>{dataItem.length + 1}</td>
                                        <td>
                                            <Input 
                                                type="select"
                                                name="cost_center"
                                                value={this.state.cost}
                                                onChange={e => this.setState({cost: e.target.value})}
                                            >
                                                <option value="">---Pilih---</option>
                                                {dataDepo.length > 0 && dataDepo.map(item => {
                                                    return (
                                                        <option value={`${item.place_asset}-${item.cost_center}`}>{item.place_asset}-{item.cost_center}</option>
                                                    )
                                                })}
                                            </Input>
                                        </td>
                                        {this.state.typeCost === 'single' && (
                                            <td>
                                                <Input 
                                                    value={this.state.nik}
                                                    onChange={e => this.setState({nik: e.target.value})}
                                                />
                                            </td>    
                                        )}
                                        <td>
                                            <Input 
                                                type='number'
                                                value={this.state.qty}
                                                onChange={e => this.setState({qty: e.target.value})}
                                            />
                                        </td>
                                        <td>
                                            <Button
                                                onClick={() => this.addItem({
                                                    cost_center: this.state.cost,
                                                    nik: this.state.nik,
                                                    qty: this.state.qty
                                                })}
                                                color='success'
                                                className='ml-1 mt-1'
                                            >
                                                Save
                                            </Button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color='secondary'
                            onClick={this.openCost}
                        >
                            Close
                        </Button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.openSubmit} centered={true}>
                    <ModalBody>
                        <div className={style.modalApprove}>
                            <div>
                                <text>
                                    Anda yakin untuk submit revisi
                                    <text className={style.verif}>  </text>
                                    pada tanggal
                                    <text className={style.verif}> {moment().format('LL')}</text> ?
                                </text>
                            </div>
                            <div className={style.btnApprove}>
                                {/* <Button color="primary" onClick={level === '2' ? () => this.submitAsset(detailIo[0].no_pengadaan) : this.submitBudget}>Ya</Button> */}
                                <Button color="primary" onClick={this.prepSendEmail}>Ya</Button>
                                <Button color="secondary" onClick={this.openModalSubmit}>Tidak</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.rinci} toggle={this.prosesRinci} size='lg'>
                    <ModalHeader toggle={this.openModalAdd}>Rincian item</ModalHeader>
                    <Formik
                    initialValues={{
                        nama: dataRinci.nama,
                        price: dataRinci.price,
                        qty: dataRinci.qty,
                        kategori: dataRinci.kategori,
                        tipe: dataRinci.tipe,
                        jenis: dataRinci.jenis,
                        akta: dataRinci.akta,
                        start: dataRinci.start === null || dataRinci.start === undefined ? '' : dataRinci.start.slice(0, 10),
                        end: dataRinci.end === null || dataRinci.end === undefined ? '' : dataRinci.end.slice(0, 10)
                    }}
                    validationSchema={cartSchema}
                    onSubmit={(values) => {this.editCart(values)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                        <ModalBody>
                            <div className={style.addModalDepo}>
                                <text className="col-md-3">
                                    Deskripsi
                                </text>
                                <div className="col-md-9">
                                    <Input 
                                    type="name" 
                                    name="nama"
                                    value={values.nama}
                                    onBlur={handleBlur("nama")}
                                    onChange={handleChange("nama")}
                                    />
                                    {errors.nama ? (
                                        <text className={style.txtError}>Must be filled</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-3">
                                    Tipe
                                </text>
                                <div className="col-md-9">
                                <Input 
                                    type="select"
                                    name="select"
                                    value={values.tipe}
                                    onChange={handleChange("tipe")}
                                    onBlur={handleBlur("tipe")}
                                    >   
                                        <option value="">-Pilih Tipe-</option>
                                        {/* <option value="gudang">Sewa Gudang</option> */}
                                        <option value="barang">Barang</option>
                                    </Input>
                                    {errors.tipe ? (
                                        <text className={style.txtError}>Must be filled</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-3">
                                    Jenis IT / NON IT
                                </text>
                                <div className="col-md-9">
                                <Input 
                                    type="select"
                                    name="select"
                                    value={values.jenis}
                                    onChange={handleChange("jenis")}
                                    onBlur={handleBlur("jenis")}
                                    >   
                                        <option value="">---Pilih---</option>
                                        <option value="it">IT</option>
                                        <option value="non-it">NON IT</option>
                                    </Input>
                                    {errors.jenis ? (
                                        <text className={style.txtError}>Must be filled</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-3">
                                    Price
                                </text>
                                <div className="col-md-9">
                                    <Input 
                                    type="name" 
                                    name="price"
                                    value={values.price}
                                    onBlur={handleBlur("price")}
                                    onChange={handleChange("price")}
                                    />
                                    {errors.price ? (
                                        <text className={style.txtError}>Must be filled</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-3">
                                    Qty
                                </text>
                                <div className="col-md-9">
                                    <Input 
                                    type="name" 
                                    name="qty"
                                    value={values.qty}
                                    onBlur={handleBlur("qty")}
                                    onChange={handleChange("qty")}
                                    />
                                    {errors.qty ? (
                                        <text className={style.txtError}>Must be filled</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-3">
                                    Kategori
                                </text>
                                <div className="col-md-9">
                                <Input 
                                    type="select"
                                    name="select"
                                    value={values.kategori}
                                    onChange={handleChange("kategori")}
                                    onBlur={handleBlur("kategori")}
                                    >   
                                        <option value="">-Pilih Kategori-</option>
                                        <option value="budget">Budget</option>
                                        <option value="non-budget">Non Budget</option>
                                        <option value="return">Return</option>
                                    </Input>
                                    {errors.kategori ? (
                                        <text className={style.txtError}>Must be filled</text>
                                    ) : null}
                                </div>
                            </div>
                            {values.kategori === 'return' && (
                                <div className={style.addModalDepo}>
                                    <text className="col-md-3">
                                        No Ajuan Return
                                    </text>
                                    <div className="col-md-9">
                                        {/* <Input 
                                        type="name" 
                                        name="no_ref"
                                        value={values.no_ref}
                                        onBlur={handleBlur("no_ref")}
                                        onChange={handleChange("no_ref")}
                                        /> */}
                                        <Select
                                            // className="inputRinci2"
                                            options={this.state.showOptions ? this.state.listNoIo : []}
                                            onChange={e => this.selectNoIo({val: e, type: 'noIo'})}
                                            onInputChange={e => this.inputNoIo(e)}
                                            isSearchable
                                            components={
                                                {
                                                    DropdownIndicator: () => null,
                                                }
                                            }
                                            value={(values.kategori === 'return') ? {value: this.state.noAjuan, label: this.state.noAjuan} : { value: '', label: '' } }
                                        />
                                        {this.state.noAjuan === '' && values.kategori === 'return' ? (
                                            <text className={style.txtError}>Must be filled</text>
                                        ) : null}
                                    </div>
                                </div>
                            )}
                            {values.tipe === 'gudang' && (
                                <>
                                    <div className="headReport">
                                        <text className="col-md-3">Periode</text>
                                        <div className="optionType col-md-9">
                                            <Input 
                                            type="date" 
                                            name="start" 
                                            onChange={handleChange("start")}
                                            onBlur={handleBlur("start")}
                                            value={values.start}
                                            ></Input>
                                            <text className="toColon">To</text>
                                            <Input 
                                            type="date" 
                                            name="end" 
                                            value={values.end}
                                            onChange={handleChange("end")}
                                            onBlur={handleBlur("end")} 
                                            ></Input>
                                        </div>
                                    </div>
                                    <div className={style.addModalDepo}>
                                        <div className="col-md-3"></div>
                                        <div className="col-md-9">
                                            {values.tipe === 'gudang' && (values.start === 'null' || values.end === 'null' || values.start === null || values.end === null) ? (
                                                <text className={style.txtError}>Must be filled</text>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className={style.addModalDepo}>
                                        <text className="col-md-3">
                                            Dokumen Akta
                                        </text>
                                        <div className="col-md-9">
                                            <Input 
                                            type="select"
                                            name="select"
                                            value={values.akta}
                                            onChange={handleChange("akta")}
                                            onBlur={handleBlur("akta")}
                                            >   
                                                <option value="null">-Pilih-</option>
                                                <option value="ada">Ada</option>
                                                <option value="tidak">Tidak ada</option>
                                            </Input>
                                            {values.tipe === 'gudang' && (values.akta === null || values.akta === "null") ? (
                                                <text className={style.txtError}>Must be filled</text>
                                            ) : null}
                                        </div>
                                    </div>
                                </>
                            )}
                            <hr/>
                            <div className={style.foot}>
                                <div>
                                    {typeCost === 'MULTIPLE' && (
                                        <Button color="success" className="mr-3" onClick={() => this.openCost()}>Detail Cost Center</Button>
                                    )}
                                </div>
                                <div>
                                    <Button 
                                        className="mr-2" 
                                        disabled={values.tipe === 'gudang' && (values.akta === null || values.akta === "null" || values.start === null || values.end === null)  ? true : false} 
                                        onClick={handleSubmit} color="primary"
                                    >
                                        Save
                                    </Button>
                                    <Button className="mr-3" onClick={this.prosesRinci}>Cancel</Button>
                                </div>
                            </div>
                        </ModalBody>
                        )}
                    </Formik>
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
                        <Button color="secondary" onClick={this.prosesModalTtd}>
                            Close
                        </Button>
                        <Button color="primary" onClick={this.prosesModalTtd}>
                            Save 
                        </Button>
                    </ModalFooter>
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
                                    onClick={this.submitRevisi} 
                                    color="primary"
                                >
                                    Submit & Send Email
                                </Button>
                                <Button className="mr-3" onClick={this.openDraftEmail}>Cancel</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal size="xl" isOpen={this.state.openModalDoc} toggle={this.closeProsesModalDoc}>
                    <ModalDokumen  
                        parDoc={{noDoc: this.state.noDoc, noTrans: this.state.noTrans, tipe: 'pengadaan', filter: 'revisi'}} 
                        dataDoc={detailIo !== undefined && detailIo.length > 0 && detailIo[0].asset_token === null ? dataDocCart : dataDoc } 
                    />
                </Modal>
                <Modal size="xl">
                    <ModalHeader>
                    Kelengkapan Dokumen
                    </ModalHeader>
                    <ModalBody>
                        <Container>
                            <Alert color="danger" className="alertWrong" isOpen={this.state.upload}>
                                <div>{this.state.errMsg}</div>
                            </Alert>
                            {detailIo !== undefined && detailIo.length > 0 && detailIo[0].asset_token === null ? (
                                dataDocCart !== undefined && dataDocCart.map(x => {
                                    return (
                                        <Row className="mt-3 mb-4">
                                            <Col md={12} lg={12} >
                                                <text>{dataDocCart.indexOf(x) + 1}. {x.nama_dokumen}</text>
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
                                                    {/* <div>
                                                        <input
                                                        // className="ml-4"
                                                        type="file"
                                                        onClick={() => this.setState({detail: x})}
                                                        onChange={this.onChangeUpload}
                                                        />
                                                    </div> */}
                                                </Col>
                                            ) : (
                                                <Col md={12} lg={12} >
                                                    -
                                                </Col>
                                            )}
                                        </Row>
                                    )
                                })
                            ) : (
                                dataDoc !== undefined && dataDoc.map(x => {
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
                                                    {/* <div>
                                                        <input
                                                        // className="ml-4"
                                                        type="file"
                                                        onClick={() => this.setState({detail: x})}
                                                        onChange={this.onChangeUpload}
                                                        />
                                                    </div> */}
                                                </Col>
                                            ) : (
                                                <Col md={12} lg={12} >
                                                    -
                                                </Col>
                                            )}
                                        </Row>
                                    )
                                })
                            )}
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
                <Modal isOpen={
                    this.props.pengadaan.isLoading || 
                    this.props.dokumen.isLoading || 
                    this.props.tempmail.isLoading || 
                    this.props.newnotif.isLoading ? true: false} size="sm">
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
                                    {/* <div>{moment(this.state.date).format('LLL')}</div> */}
                                    <Button color="success">Download</Button>
                                </div>
                            {level === '1' || level === '2' || level === '3' ? (
                                <div>
                                    <Button color="danger" className="mr-3" onClick={this.openModalReject}>Reject</Button>
                                    <Button color="primary" onClick={this.openModalApprove}>Approve</Button>
                                </div>
                                ) : (
                                    <Button color="primary" onClick={() => this.setState({openPdf: false})}>Close</Button>
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
                                    <Button color="primary" onClick={this.approveDokumen}>Ya</Button>
                                    <Button color="secondary" onClick={this.openModalApprove}>Tidak</Button>
                                </div>
                            </div>
                        </ModalBody>
                    </Modal>
                    <Modal isOpen={this.state.isAppall} toggle={this.openAppall} centered={true}>
                        <ModalBody>
                            <div className={style.modalApprove}>
                                <div>
                                    <text>
                                        Anda yakin untuk approve 
                                        <text className={style.verif}> Pengadaan {newIo.map(item => { return (listMut.find(element => element === item.id) !== undefined ? `${item.no_pengadaan},` : null)})} </text>
                                        pada tanggal
                                        <text className={style.verif}> {moment().format('LL')}</text> ?
                                    </text>
                                </div>
                                <div className={style.btnApprove}>
                                    <Button color="primary" onClick={this.approveAll}>Ya</Button>
                                    <Button color="secondary" onClick={this.openAppall}>Tidak</Button>
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
                    <Modal isOpen={this.state.modalConfirm} toggle={this.openConfirm} size="md">
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
                        ) : this.state.confirm === 'reject' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                    <div className={[style.sucUpdate, style.green]}>Berhasil Reject</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'update' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                    <div className={[style.sucUpdate, style.green]}>Berhasil Update</div>
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
                        ) : this.state.confirm === 'rejSubmit' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Submit</div>
                                <div className="errApprove mt-2">Mohon isi Nomor IO terlebih dahulu</div>
                            </div>
                            </div>
                        ) : this.state.confirm === 'revdata' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Submit</div>
                                <div className="errApprove mt-2">Mohon perbaiki data ajuan terlebih dahulu</div>
                            </div>
                            </div>
                        ) : this.state.confirm === 'falseSubmit' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Submit</div>
                                <div className="errApprove mt-2">Mohon identifikasi asset terlebih dahulu</div>
                            </div>
                            </div>
                        ) : this.state.confirm === 'recent' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Permintaan gagal</div>
                                <div className="errApprove mt-2">Mohon isi alasan terlebih dahulu</div>
                            </div>
                            </div>
                        ) : this.state.confirm === 'falseAdd' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Menambahkan Item</div>
                                <div className="errApprove mt-2">Pastikan kategori dan tipe sama di setiap item</div>
                            </div>
                            </div>
                        ) : this.state.confirm === 'upreason' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                    <div className={[style.sucUpdate, style.green]}>Berhasil Update Alasan</div>
                                </div>
                            </div>
                        ) : (
                            <div></div>
                        )}
                    </ModalBody>
                    <div className='row justify-content-md-center mb-4'>
                        <Button size='lg' onClick={this.openConfirm} color='primary'>OK</Button>
                    </div>
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
    dokumen: dokumen,
    tempmail: state.tempmail,
    newnotif: state.newnotif,
    depo: state.depo
})

const mapDispatchToProps = {
    logout: auth.logout,
    getNotif: notif.getNotif,
    resetAuth: auth.resetError,
    getRevisi: pengadaan.getRevisi,
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
    getDocCart: pengadaan.getDocCart,
    approveAll: pengadaan.approveAll,
    updateReason: pengadaan.updateReason,
    submitRevisi: pengadaan.submitRevisi,
    appRevisi: pengadaan.appRevisi,
    updateCart: pengadaan.updateCart,
    getDokumen: dokumen.getDokumen,
    getDraftEmail: tempmail.getDraftEmail,
    getDraftEmailHo: tempmail.getDraftEmailHo,
    sendEmail: tempmail.sendEmail,
    addNewNotif: newnotif.addNewNotif,
    searchIo: pengadaan.searchIo,
    addDetailItem: pengadaan.addDetailItem,
    updateDetailItem: pengadaan.updateDetailItem,
    deleteDetailItem: pengadaan.deleteDetailItem,
    getDetailItem: pengadaan.getDetailItem,
    getDepo: depo.getDepo,
}

export default connect(mapStateToProps, mapDispatchToProps)(EditTicket)
