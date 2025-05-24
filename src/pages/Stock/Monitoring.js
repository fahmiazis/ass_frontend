/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { Component } from 'react'
import {VscAccount} from 'react-icons/vsc'
import { Container, Collapse, Nav, 
    NavbarToggler, NavbarBrand, NavItem, NavLink,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, Dropdown,
    DropdownItem, Table, ButtonDropdown, Input, Button, Col, Card, CardBody,
    Alert, Spinner, Row, Modal, ModalBody, ModalHeader, ModalFooter} from 'reactstrap'
import approve from '../../redux/actions/approve'
import {BsCircle} from 'react-icons/bs'
import {FaSearch, FaUserCircle, FaBars, FaTrash, FaFileSignature, FaCartPlus, FaTh, FaList} from 'react-icons/fa'
import {AiOutlineFileExcel, AiFillCheckCircle,  AiOutlineCheck, AiOutlineClose} from 'react-icons/ai'
import {BsDashCircleFill, BsFillCircleFill} from 'react-icons/bs'
import {MdAssignment} from 'react-icons/md'
import {FiSend, FiTruck, FiSettings, FiUpload} from 'react-icons/fi'
import Sidebar from "../../components/Header";
import {AiOutlineInbox} from 'react-icons/ai'
import MaterialTitlePanel from "../../components/material_title_panel"
import SidebarContent from "../../components/sidebar_content"
import style from '../../assets/css/input.module.css'
import placeholder from  "../../assets/img/placeholder.png"
import asset from '../../redux/actions/asset'
import report from '../../redux/actions/report'
import b from "../../assets/img/b.jpg"
import pengadaan from '../../redux/actions/pengadaan'
import tempmail from '../../redux/actions/tempmail'
import user from '../../redux/actions/user'
import e from "../../assets/img/e.jpg"
import {connect} from 'react-redux'
import moment from 'moment'
import {Formik} from 'formik'
import * as Yup from 'yup'
import auth from '../../redux/actions/auth'
import disposal from '../../redux/actions/disposal'
import notif from '../../redux/actions/notif'
import Pdf from "../../components/Pdf"
import depo from '../../redux/actions/depo'
import stock from '../../redux/actions/stock'
import newnotif from '../../redux/actions/newnotif'
import {default as axios} from 'axios'
import TableStock from '../../components/TableStock'
import ReactHtmlToExcel from "react-html-table-to-excel"
import NavBar from '../../components/NavBar'
import styleTrans from '../../assets/css/transaksi.module.css'
import NewNavbar from '../../components/NewNavbar'
import Email from '../../components/Stock/Email'
import ExcelJS from "exceljs";
import fs from "file-saver";
const {REACT_APP_BACKEND_URL} = process.env

const stockSchema = Yup.object().shape({
    merk: Yup.string().required("must be filled"),
    satuan: Yup.string().required("must be filled"),
    unit: Yup.number().required("must be filled"),
    lokasi: Yup.string().required("must be filled"),
    keterangan: Yup.string().validateSync("")
})

const addStockSchema = Yup.object().shape({
    deskripsi: Yup.string().required("must be filled"),
    merk: Yup.string().required("must be filled"),
    satuan: Yup.string().required("must be filled"),
    unit: Yup.number().required("must be filled"),
    lokasi: Yup.string().required("must be filled"),
    grouping: Yup.string().required("must be filled"),
    keterangan: Yup.string().validateSync("")
})

const alasanSchema = Yup.object().shape({
    alasan: Yup.string()
});


class Stock extends Component {
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
            limit: 10,
            search: '',
            time1: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-26'),
            // time1: moment().startOf('month').format('YYYY-MM-DD'),
            time2: moment().endOf('month').format('YYYY-MM-25'),
            time: 'pilih',
            dataRinci: {},
            dataItem: {},
            modalEdit: false,
            modalRinci: false,
            dropApp: false,
            openReject: false,
            openApprove: false,
            modalPreview: false,
            view: 'card',
            fisik: '',
            kondisi: '',
            alert: false,
            submitPre: false,
            dataStatus: [],
            openStatus: false,
            stat: '',
            modalConfirm: false,
            confirm: '',
            modalDoc: false,
            listMut: [],
            modalStock: false,
            openPdf: false,
            modalAdd: false,
            openConfirm: false,
            modalSum: false,
            grouping: '',
            modalUpload: false,
            dataId: null,
            idTab: null,
            drop: false,
            bulan: moment().format('MMMM'),
            opendok: false,
            month: moment().format('M'),
            dropOp: false,
            noAsset: null,
            filter: 'all',
            newStock: [],
            formDis: false,
            openDraft: false,
            tipeEmail: '',
            subject: '',
            message: '',
            typeReject: '',
            menuRev: '',
            dataRej: {},
            listStat: [],
            history: false,
            isLoading: false,
            listMon: []
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
    }
    
    openHistory = () => {
        this.setState({history: !this.state.history})
    }

    getMessage = (val) => {
        this.setState({ message: val.message, subject: val.subject })
        console.log(val)
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

    rejectApp = (val) => {
        this.setState({typeReject: val})
    }

    rejectRej = (val) => {
        const {typeReject} = this.state
        if (typeReject === val) {
            this.setState({typeReject: ''})
        }
    }

    menuApp = (val) => {
        this.setState({menuRev: val})
    }

    menuRej = (val) => {
        const {menuRev} = this.state
        if (menuRev === val) {
            this.setState({menuRev: ''})
        }
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

    prosesSidebar = (val) => {
        this.setState({sidebarOpen: val})
    }
    
    goRoute = (val) => {
        this.props.history.push(`/${val}`)
    }

    submitStock = async () => {
        const token = localStorage.getItem('token')
        await this.props.submitStock(token)
        this.getDataAsset()
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

    uploadPicture = e => {
        const {size, type} = e.target.files[0]
        this.setState({fileUpload: e.target.files[0]})
        if (size >= 20000000) {
            this.setState({errMsg: "Maximum upload size 20 MB"})
            this.uploadAlert()
        } else if (type !== 'image/jpeg' && type !== 'image/png') {
            this.setState({errMsg: 'Invalid file type. Only image files are allowed.'})
            this.uploadAlert()
        } else {
            const {dataRinci} = this.state
            const token = localStorage.getItem('token')
            const data = new FormData()
            data.append('document', e.target.files[0])
            this.props.uploadPicture(token, dataRinci.no_asset, data)
        }
    }

    uploadGambar = e => {
        const {size, type} = e.target.files[0]
        this.setState({fileUpload: e.target.files[0]})
        if (size >= 20000000) {
            this.setState({errMsg: "Maximum upload size 20 MB"})
            this.uploadAlert()
        } else if (type !== 'image/jpeg' && type !== 'image/png') {
            this.setState({errMsg: 'Invalid file type. Only image files are allowed.'})
            this.uploadAlert()
        } else {
            const { dataId } = this.state
            const token = localStorage.getItem('token')
            const data = new FormData()
            data.append('document', e.target.files[0])
            this.props.uploadImage(token, dataId, data)
        }
    }

    prepSendEmail = async (val) => {
        const {detailStock} = this.props.stock
        const token = localStorage.getItem("token")
        if (val === 'approve') {
            const app = detailStock[0].appForm
            const tempApp = []
                for (let i = 0; i < app.length; i++) {
                    if (app[i].status === 1){
                        tempApp.push(app[i])
                    }
                }
            const tipe = tempApp.length === app.length-1 ? 'full approve' : 'approve'
            const tempno = {
                no: detailStock[0].no_stock,
                kode: detailStock[0].kode_plant,
                jenis: 'stock',
                tipe: tipe,
                menu: 'Pengajuan Stock Opname (Stock Opname asset)'
            }
            this.setState({tipeEmail: val})
            await this.props.getDraftEmail(token, tempno)
            this.openDraftEmail()
        } else {
            const tipe = 'submit'
            const tempno = {
                no: detailStock[0].no_stock,
                kode: detailStock[0].kode_plant,
                jenis: 'stock',
                tipe: tipe,
                menu: 'Terima Stock Opname (Stock Opname asset)'
            }
            this.setState({tipeEmail: val})
            await this.props.getDraftEmail(token, tempno)
            this.openDraftEmail()
        }
        
    }

    prepReject = async (val) => {
        const {detailStock} = this.props.stock
        const {listStat, listMut, typeReject, menuRev} = this.state
        const token = localStorage.getItem("token")
        const level = localStorage.getItem('level')
        if (typeReject === 'pembatalan' && listMut.length !== detailStock.length) {
            this.setState({confirm: 'falseCancel'})
            this.openConfirm()
        } else {
            const tipe = 'reject'
            const menu = 'Pengajuan Stock Opname (Stock Opname asset)'
            const tempno = {
                no: detailStock[0].no_stock,
                kode: detailStock[0].kode_plant,
                jenis: 'stock',
                tipe: tipe,
                typeReject: typeReject,
                menu: menu
            }
            this.setState({tipeEmail: 'reject', dataRej: val})
            await this.props.getDraftEmail(token, tempno)
            this.openDraftEmail()
        }
        
    }

    openDraftEmail = () => {
        this.setState({openDraft: !this.state.openDraft}) 
    }

    approveStock = async () => {
        const {dataItem} = this.state
        const token = localStorage.getItem('token')
        await this.props.approveStock(token, dataItem.no_stock)
        await this.props.getApproveStock(token, dataItem.id)
        // await this.props.notifStock(token, dataItem.no_stock, 'approve', 'HO', null, null)
        this.prosesSendEmail('approve')
        this.openConfirm(this.setState({confirm: 'isApprove'}))
        this.openModalApprove()
        this.getDataStock()
        this.openModalRinci()
    }

    rejectStock = async (value) => {
        const {dataItem, listStat, listMut, typeReject, menuRev} = this.state
        const token = localStorage.getItem('token')
        const level = localStorage.getItem('level')
        let temp = ''
        for (let i = 0; i < listStat.length; i++) {
            temp += listStat[i] + '.'
        }
        const data = {
            alasan: temp + value.alasan,
            no: dataItem.no_stock,
            menu: typeReject === 'pembatalan' ? 'Pengadaan asset' : menuRev,
            list: listMut,
            type: level === '2' ? 'verif' : 'form',
            type_reject: typeReject
        }
        await this.props.rejectStock(token, data)
        this.prosesSendEmail(`reject ${typeReject}`)
        this.setState({confirm: 'reject'})
        this.openConfirm()
        this.openModalReject()
        this.getDataStock()
        this.openModalRinci()
        // await this.props.getDetailStock(token, dataItem.no_stock)
        // await this.props.getApproveStock(token, dataItem.id)
        // await this.props.notifStock(token, dataItem.no_stock, 'reject', null, null, null, data)
    }

    prosesSendEmail = async (val) => {
        const token = localStorage.getItem('token')
        const { draftEmail } = this.props.tempmail
        const { detailStock } = this.props.stock
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
            no: detailStock[0].no_stock,
            tipe: 'stock',
            menu: val === 'asset' ? 'Terima Stock Opname (Stock Opname asset)' : `Pengajuan Stock Opname (Stock Opname asset)`,
            proses: val === 'asset' ? 'submit' : val,
            route: val === 'reject perbaikan' ? 'editstock' : 'stock'
        }
        await this.props.sendEmail(token, sendMail)
        await this.props.addNewNotif(token, sendMail)
        this.openDraftEmail()
    }

    dropApp = () => {
        this.setState({dropApp: !this.state.dropApp})
    }

    openModalConfirm = () => {
        this.setState({openConfirm: !this.state.openConfirm})
    }

    openModalPreview = () => {
        this.setState({modalPreview: !this.state.modalPreview})
    }

    openModalReject = () => {
        this.setState({listStat: []})
        this.setState({openReject: !this.state.openReject})
    }

    openModalApprove = () => {
        this.setState({openApprove: !this.state.openApprove})
    }

    openPreview = async (val) => {
        const token = localStorage.getItem('token')
        await this.props.getApproveStock(token, val.id)
        this.openModalPreview()
    }

    menuButtonClick(ev) {
        ev.preventDefault();
        this.onSetOpen(!this.state.open);
    }

    openModalRinci = () => {
        this.setState({modalRinci: !this.state.modalRinci})
    }

    next = async () => {
        const { page } = this.props.asset
        const token = localStorage.getItem('token')
        await this.props.resetData()
        await this.props.nextPage(token, page.nextLink)
    }

    prev = async () => {
        const { page } = this.props.asset
        const token = localStorage.getItem('token')
        await this.props.resetData()
        await this.props.nextPage(token, page.prevLink)
    }

    onSetOpen(open) {
        this.setState({ open });
    }

    getDetailStock = async (val) => {
        const token = localStorage.getItem("token")
        this.setState({dataItem: val})
        await this.props.getDetailStock(token, val.no_stock)
        await this.props.getApproveStock(token, val.id)
        this.openModalRinci()
    }

    getDetailTrack = async (value) => {
        const token = localStorage.getItem("token")
        this.setState({dataItem: value})
        await this.props.getDetailStock(token, value.no_stock)
        this.openModalDis()
    }

    openModalDis = () => {
        this.setState({formDis: !this.state.formDis})
    }

    deleteStock = async (value) => {
        const token = localStorage.getItem("token")
        await this.props.deleteStock(token, value.id)
        this.getDataStock()
    }

    showAlert = () => {
        this.setState({alert: true})
       
         setTimeout(() => {
            this.setState({
                alert: false
            })
         }, 2000)
    }

    submitAset = async () => {
        const token = localStorage.getItem('token')
        const { detailStock } = this.props.stock
        await this.props.submitAsset(token, detailStock[0].no_stock)
        this.prosesSendEmail('asset')
        this.openConfirm(this.setState({confirm: 'submit'}))
        this.openModalSub()
        this.getDataStock()
        this.openModalRinci()
    }

    componentDidMount() {
        const level = localStorage.getItem('level')
        // if (level === "5" || level === "9") {
        //     this.getDataAsset()
        // } else {
            this.getDataStock()
        // }
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

    componentDidUpdate() {
        const {isUpload, isError, isApprove, isReject, rejReject, rejApprove, isImage, isSubmit, isSubaset} = this.props.stock
        const {dataRinci, dataId, dataItem} = this.state
        const { isUpdateNew } = this.props.asset
        const errUpload = this.props.disposal.isUpload
        const token = localStorage.getItem('token')
        if (isUpload) {
            this.props.resetStock()
             setTimeout(() => {
                this.props.getDetailAsset(token, dataRinci.id)
                this.getDataAsset()
             }, 100)
        } else if (errUpload) {
            setTimeout(() => {
                this.props.resetDis()
             }, 1000)
             setTimeout(() => {
                 this.cekStatus('DIPINJAM SEMENTARA')
             }, 1100)
        } else if (isUpdateNew) {
            this.openConfirm(this.setState({confirm: 'approve'}))
            this.props.resetError()
            this.props.getDetailAsset(token, dataRinci.id)
            this.getDataAsset()
        } 
        // else if (isReject) {
        //     this.setState({listMut: []})
        //     this.openModalReject()
        //     this.openConfirm(this.setState({confirm: 'reject'}))
        //     this.props.resetStock()
        //     this.getDataStock()
        //     this.openModalRinci()
        // } 
        // else if (isSubaset) {
        //     this.openConfirm(this.setState({confirm: 'submit'}))
        //     this.props.resetStock()
        //     this.openModalSub()
        //     this.getDataStock()
        //     this.openModalRinci()
        // } 
        else if (isSubmit) {
            this.openConfirm(this.setState({confirm: 'submit'}))
            this.openModalApprove()
            this.props.resetStock()
        } else if (isImage) {
            this.props.getDetailItem(token, dataId)
            this.props.resetStock()
        } 
        // else if (isApprove) {
        //     this.openConfirm(this.setState({confirm: 'isApprove'}))
        //     this.openModalApprove()
        //     this.props.resetStock()
        //     this.getDataStock()
        //     this.openModalRinci()
        // } 
        else if (rejReject) {
            this.openModalReject()
            this.openConfirm(this.setState({confirm: 'rejReject'}))
            this.props.resetStock()
        } else if (rejApprove) {
            this.openConfirm(this.setState({confirm: 'rejApprove'}))
            this.openModalApprove()
            this.props.resetStock()
        } else if (isError) {
            this.props.resetStock()
            this.showAlert()
        }
    }

    openConfirm = () => {
        this.setState({modalConfirm: !this.state.modalConfirm})
    }

    dropOpen = async (val) => {
        if (this.state.dropOp === false) {
            const token = localStorage.getItem("token")
            await this.props.getDetailAsset(token, val.id)
            const { detailAsset } = this.props.asset
            if (detailAsset !== undefined) {
                this.setState({stat: detailAsset.grouping})
                if (detailAsset.kondisi === null && detailAsset.status_fisik === null) {
                    await this.props.getStatus(token, '', '', 'true')
                    this.modalStatus()
                } else {
                    await this.props.getStatus(token, detailAsset.status_fisik === null ? '' : detailAsset.status_fisik, detailAsset.kondisi === null ? '' : detailAsset.kondisi, 'true')
                    const { dataStatus } = this.props.stock
                    if (dataStatus.length === 0) {
                        this.modalStatus()
                    } else {
                        this.setState({noAsset: val.no_asset, dropOp: !this.state.dropOp})
                    }
                }
            } else {
                await this.props.getStatus(token, '', '', 'true')
                this.modalStatus()
            }
        } else {
            this.setState({dropOp: !this.state.dropOp})   
        }
    }

    downloadForm = async (val) => {
        this.setState({isLoading: true})
        const { detailStock, stockApp } = this.props.stock
        const dataApp = stockApp

        const alpha = Array.from(Array(26)).map((e, i) => i + 65)
        const alphabet = alpha.map((x) => String.fromCharCode(x))

        const colNum = detailStock.length + 14
        const lengthAll = []
        const lengthDesk = []
        const lengthIo = []
        const lengthCost = []
        const lengthProfit = []

        for (let i = 1; i <= 25; i++) {
            if (i <= 10) {
                lengthIo.push(i)
                lengthCost.push(i)
                lengthProfit.push(i)
                lengthDesk.push(i)
                lengthAll.push(i)
            } else if (i <= 11) {
                lengthIo.push(i)
                lengthDesk.push(i)
                lengthAll.push(i)
            } else if (i <= 12) {
                lengthDesk.push(i)
                lengthAll.push(i)
            } else {
                lengthAll.push(i)
            }
            
        }

        const workbook = new ExcelJS.Workbook();
        const ws = workbook.addWorksheet('form stock opname', {
            pageSetup: { orientation:'landscape', paperSize: 8 }
        })

        const borderStyles = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
        }

        const leftStyle = {
            horizontal:'left'
        }

        const rightStyle = {
            horizontal:'right'
        }

        const alignStyle = {
            horizontal:'left',
            // wrapText: true,
            vertical: 'middle'
        }

        const titleStyle = {
            bold: true,
            size: 12,
            
        }

        const tbStyle = {
            // horizontal:'center',
            wrapText: true,
            vertical: 'middle',
            shrinkToFit: true
        }

        const appStyle = {
            horizontal:'center',
            wrapText: true,
            vertical: 'middle'
        }

        const boldStyle = {
            bold: true
        }
        ws.getCell(`${alphabet[lengthAll.length]}1`).value = ''

        ws.getCell(`B2`).value = 'KERTAS KERJA OPNAME ASET'
        ws.getCell(`B2`).alignment = { 
            ...alignStyle
        }
        ws.getCell(`B2`).font = { 
            ...titleStyle
        }

        ws.getCell(`B4`).value = 'PT. PINUS MERAH ABADI'
        ws.getCell(`B4`).alignment = { 
            ...alignStyle
        }
        ws.getCell(`B4`).font = { 
            ...titleStyle
        }

        ws.getCell(`B6`).value = 'KANTOR PUSAT/CABANG'
        ws.getCell(`B6`).alignment = { 
            ...alignStyle
        }
        ws.getCell(`B6`).font = { 
            ...titleStyle
        }

        ws.getCell(`E6`).value = `: ${detailStock[0].area.toUpperCase()}`
        ws.getCell(`E6`).alignment = { 
            ...alignStyle
        }
        ws.getCell(`E6`).font = { 
            ...titleStyle
        }

        ws.getCell(`B8`).value = 'DEPO/CP'
        ws.getCell(`B8`).alignment = { 
            ...alignStyle
        }
        ws.getCell(`B8`).font = { 
            ...titleStyle
        }

        ws.getCell(`E8`).value = `: ${detailStock[0].area.toUpperCase()}`
        ws.getCell(`E8`).alignment = { 
            ...alignStyle
        }
        ws.getCell(`E8`).font = { 
            ...titleStyle
        }

        ws.getCell(`B10`).value = 'OPNAME PER TANGGAL'
        ws.getCell(`B10`).alignment = { 
            ...alignStyle
        }
        ws.getCell(`B10`).font = { 
            ...titleStyle
        }

        ws.getCell(`E10`).value = `: ${moment(detailStock[0].tanggalStock).format('DD MMMM YYYY')}`
        ws.getCell(`E10`).alignment = { 
            ...alignStyle
        }
        ws.getCell(`E10`).font = { 
            ...titleStyle
        }

        // table stock
        const limitTb = 37
        const residu = detailStock.length % limitTb
        const section = Math.ceil(detailStock.length / limitTb)
        const finDistance = residu > 27 ? limitTb - residu : 0
        
        for (let i = 0; i < section; i++) {
            const numTb = 12 + (i * (limitTb + 1)) 
            console.log(numTb)
            ws.mergeCells(`B${numTb}`, `B${numTb}`)
            ws.getCell(`B${numTb}`).value = 'NO'
            ws.getCell(`B${numTb}`).alignment = { 
                ...tbStyle
            }
            ws.getCell(`B${numTb}`).border = { 
                ...borderStyles
            }
            ws.getCell(`B${numTb}`).font = { 
                ...boldStyle
            }

            ws.mergeCells(`C${numTb}`, `D${numTb}`)
            ws.getCell(`C${numTb}`).value = 'NO. ASET'
            ws.getCell(`C${numTb}`).alignment = { 
                ...tbStyle
            }
            ws.getCell(`C${numTb}`).border = { 
                ...borderStyles
            }
            ws.getCell(`C${numTb}`).font = { 
                ...boldStyle
            }

            ws.mergeCells(`E${numTb}`, `H${numTb}`)
            ws.getCell(`E${numTb}`).value = 'DESKRIPSI'
            ws.getCell(`E${numTb}`).alignment = { 
                ...tbStyle
            }
            ws.getCell(`E${numTb}`).border = { 
                ...borderStyles
            }
            ws.getCell(`E${numTb}`).font = { 
                ...boldStyle
            }

            ws.mergeCells(`I${numTb}`, `J${numTb}`)
            ws.getCell(`I${numTb}`).value = 'MERK'
            ws.getCell(`I${numTb}`).alignment = { 
                ...tbStyle
            }
            ws.getCell(`I${numTb}`).border = { 
                ...borderStyles
            }
            ws.getCell(`I${numTb}`).font = { 
                ...boldStyle
            }

            ws.mergeCells(`K${numTb}`, `K${numTb}`)
            ws.getCell(`K${numTb}`).value = 'SATUAN'
            ws.getCell(`K${numTb}`).alignment = { 
                ...tbStyle
            }
            ws.getCell(`K${numTb}`).border = { 
                ...borderStyles
            }
            ws.getCell(`K${numTb}`).font = { 
                ...boldStyle
            }

            ws.mergeCells(`L${numTb}`, `L${numTb}`)
            ws.getCell(`L${numTb}`).value = 'UNIT'
            ws.getCell(`L${numTb}`).alignment = { 
                ...tbStyle
            }
            ws.getCell(`L${numTb}`).border = { 
                ...borderStyles
            }
            ws.getCell(`L${numTb}`).font = { 
                ...boldStyle
            }

            ws.mergeCells(`M${numTb}`, `M${numTb}`)
            ws.getCell(`M${numTb}`).value = 'KONDISI'
            ws.getCell(`M${numTb}`).alignment = { 
                ...tbStyle
            }
            ws.getCell(`M${numTb}`).border = { 
                ...borderStyles
            }
            ws.getCell(`M${numTb}`).font = { 
                ...boldStyle
            }

            ws.mergeCells(`N${numTb}`, `O${numTb}`)
            ws.getCell(`N${numTb}`).value = 'LOKASI'
            ws.getCell(`N${numTb}`).alignment = { 
                ...tbStyle
            }
            ws.getCell(`N${numTb}`).border = { 
                ...borderStyles
            }
            ws.getCell(`N${numTb}`).font = { 
                ...boldStyle
            }

            ws.mergeCells(`P${numTb}`, `Q${numTb}`)
            ws.getCell(`P${numTb}`).value = 'GROUPING'
            ws.getCell(`P${numTb}`).alignment = { 
                ...tbStyle
            }
            ws.getCell(`P${numTb}`).border = { 
                ...borderStyles
            }
            ws.getCell(`P${numTb}`).font = { 
                ...boldStyle
            }

            ws.mergeCells(`R${numTb}`, `T${numTb}`)
            ws.getCell(`R${numTb}`).value = 'KETERANGAN'
            ws.getCell(`R${numTb}`).alignment = { 
                ...tbStyle
            }
            ws.getCell(`R${numTb}`).border = { 
                ...borderStyles
            }
            ws.getCell(`R${numTb}`).font = { 
                ...boldStyle
            }
        }

        for (let i = 0; i < detailStock.length; i++) {
            // console.log(i)
            const numTb = 13 + (i + (i >= limitTb ? 1 : 0))
            console.log(numTb)
            ws.mergeCells(`B${numTb}`, `B${numTb}`)
            ws.getCell(`B${numTb}`).value = `${i + 1}`
            ws.getCell(`B${numTb}`).alignment = { 
                ...tbStyle
            }
            ws.getCell(`B${numTb}`).border = { 
                ...borderStyles
            }
    
            ws.mergeCells(`C${numTb}`, `D${numTb}`)
            ws.getCell(`C${numTb}`).value = `${detailStock[i].no_asset === null ? '' : detailStock[i].no_asset}`
            ws.getCell(`C${numTb}`).alignment = { 
                ...tbStyle
            }
            ws.getCell(`C${numTb}`).border = { 
                ...borderStyles
            }
    
            ws.mergeCells(`E${numTb}`, `H${numTb}`)
            ws.getCell(`E${numTb}`).value = `${detailStock[i].deskripsi === null ? '' : detailStock[i].deskripsi }`
            ws.getCell(`E${numTb}`).alignment = { 
                ...tbStyle
            }
            ws.getCell(`E${numTb}`).border = { 
                ...borderStyles
            }
    
            ws.mergeCells(`I${numTb}`, `J${numTb}`)
            ws.getCell(`I${numTb}`).value = `${detailStock[i].merk === null ? '' : detailStock[i].merk}`
            ws.getCell(`I${numTb}`).alignment = { 
                ...tbStyle
            }
            ws.getCell(`I${numTb}`).border = { 
                ...borderStyles
            }
    
            ws.mergeCells(`K${numTb}`, `K${numTb}`)
            ws.getCell(`K${numTb}`).value = `${detailStock[i].satuan === null ? '' : detailStock[i].satuan }`
            ws.getCell(`K${numTb}`).alignment = { 
                ...tbStyle
            }
            ws.getCell(`K${numTb}`).border = { 
                ...borderStyles
            }
    
            ws.mergeCells(`L${numTb}`, `L${numTb}`)
            ws.getCell(`L${numTb}`).value = `${detailStock[i].unit === null ? '' : detailStock[i].unit}`
            ws.getCell(`L${numTb}`).alignment = { 
                ...tbStyle
            }
            ws.getCell(`L${numTb}`).border = { 
                ...borderStyles
            }
    
            ws.mergeCells(`M${numTb}`, `M${numTb}`)
            ws.getCell(`M${numTb}`).value = `${detailStock[i].kondisi === null ? '' : detailStock[i].kondisi}`
            ws.getCell(`M${numTb}`).alignment = { 
                ...tbStyle
            }
            ws.getCell(`M${numTb}`).border = { 
                ...borderStyles
            }
    
            ws.mergeCells(`N${numTb}`, `O${numTb}`)
            ws.getCell(`N${numTb}`).value = `${detailStock[i].lokasi === null ? '' : detailStock[i].lokasi}`
            ws.getCell(`N${numTb}`).alignment = { 
                ...tbStyle
            }
            ws.getCell(`N${numTb}`).border = { 
                ...borderStyles
            }
    
            ws.mergeCells(`P${numTb}`, `Q${numTb}`)
            ws.getCell(`P${numTb}`).value = `${detailStock[i].grouping === null ? '' : detailStock[i].grouping}`
            ws.getCell(`P${numTb}`).alignment = { 
                ...tbStyle
            }
            ws.getCell(`P${numTb}`).border = { 
                ...borderStyles
            }
    
            ws.mergeCells(`R${numTb}`, `T${numTb}`)
            ws.getCell(`R${numTb}`).value = `${detailStock[i].keterangan === null ? '' : detailStock[i].keterangan}`
            ws.getCell(`R${numTb}`).alignment = { 
                ...tbStyle
            }
            ws.getCell(`R${numTb}`).border = { 
                ...borderStyles
            }
        }

        const sumRow = detailStock.length + 15 + finDistance
        const headRow = 1 + sumRow
        const mainRow = 3 + sumRow
        const footRow = 5 + sumRow

        const cekApp = dataApp.pembuat.length + dataApp.pemeriksa.length + dataApp.penyetuju.length
        const compCol = cekApp > 5 ? 'D' : 'E'
        const distCol = cekApp > 5 ? 3 : 4
        const botRow = 7 + sumRow
        console.log(sumRow)

        // Approval Dibuat
        

        ws.mergeCells(`B${sumRow}`, `${compCol}${sumRow}`)
        ws.getCell(`B${sumRow}`).value = 'Dibuat oleh,'
        ws.getCell(`B${sumRow}`).alignment = { horizontal:'center'}
        ws.getCell(`B${sumRow}`).border = { 
            ...borderStyles
        }

        ws.mergeCells(`B${headRow}`, `${compCol}${botRow}`)

        dataApp.pembuat !== undefined && dataApp.pembuat.map(item => {
                const name = item.nama === undefined || item.nama === null ? null 
                :item.nama.length <= 30 ?item.nama.split(" ").map((word) => { 
                    return word[0] === undefined ? '' : word[0].toUpperCase() + word.substring(1)
                }).join(" ")
                :item.nama.slice(0, 29).split(" ").map((word) => { 
                    return word[0] === undefined ? '' : word[0].toUpperCase() + word.substring(1)
                }).join(" ") + '.'

                ws.getCell(`B${headRow}`).value = name === null 
                ? `\n\n\n - \n\n\n ${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}` 
                : item.status === 0 
                ? `\n Reject (${moment(item.updatedAt).format('DD/MM/YYYY')}) \n\n ${name} \n ${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}` 
                : `\n Approve (${moment(item.updatedAt).format('DD/MM/YYYY')}) \n\n ${name} \n ${item.jabatan === null ? "-" : item.jabatan === 'area' ? 'AOS' : item.jabatan.toUpperCase()}`
        })

        ws.getCell(`B${headRow}`).alignment = { 
            ...appStyle
        }
        ws.getCell(`B${headRow}`).border = { 
            ...borderStyles
        }

        // Approval Diperiksa
        const cekRow11 = alphabet[alphabet.indexOf(alphabet.find(item => item === compCol.toUpperCase())) + 1]
        const cekRow12 = alphabet[alphabet.indexOf(alphabet.find(item => item === cekRow11.toUpperCase())) + (distCol * (dataApp.pemeriksa.length === 0 ? 1 : dataApp.pemeriksa.length)) - 1]
        ws.mergeCells(`${cekRow11}${sumRow}`, `${cekRow12}${sumRow}`)
        ws.getCell(`${cekRow11}${sumRow}`).value = 'Diperiksa oleh,'
        ws.getCell(`${cekRow11}${sumRow}`).alignment = { horizontal:'center'}
        ws.getCell(`${cekRow11}${sumRow}`).border = { 
            ...borderStyles
        }

        dataApp.pemeriksa !== undefined && dataApp.pemeriksa.map((item, index) => {
            const name = item.nama === undefined || item.nama === null ? null 
            :item.nama.length <= 30 ?item.nama.split(" ").map((word) => { 
                return word[0] === undefined ? '' : word[0].toUpperCase() + word.substring(1)
            }).join(" ")
            :item.nama.slice(0, 29).split(" ").map((word) => { 
                return word[0] === undefined ? '' : word[0].toUpperCase() + word.substring(1)
            }).join(" ") + '.'
            const startRow = alphabet[alphabet.indexOf(alphabet.find(item => item === cekRow11.toUpperCase())) + (distCol * index)]
            const endRow = alphabet[alphabet.indexOf(alphabet.find(item => item === cekRow11.toUpperCase())) + ((distCol * index) + (distCol - 1))]
            
            // console.log(alphabet.indexOf(alphabet.find(item => item === str.toUpperCase())))
            // console.log(`${startRow}${headRow}`, `${endRow}${botRow} Quenn`)

            ws.mergeCells(`${startRow}${headRow}`, `${endRow}${botRow}`)
            ws.getCell(`${startRow}${headRow}`).value = name === null 
            ? `\n\n\n - \n\n\n${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}` 
            : item.status === 0 
            ? `\n Reject (${moment(item.updatedAt).format('DD/MM/YYYY')}) \n\n  ${name} \n ${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}` 
            : `\n Approve (${moment(item.updatedAt).format('DD/MM/YYYY')}) \n\n ${name} \n ${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}`

            ws.getCell(`${startRow}${headRow}`).alignment = { 
                ...appStyle,
            }
            ws.getCell(`${startRow}${headRow}`).border = { 
                ...borderStyles
            }
            // ws.getCell(`${startRow}${headRow}`).font = { 
            //     ...fontStyle,
            // }
        })


        // Approval Disetujui
        const cekRow21 = alphabet[alphabet.indexOf(alphabet.find(item => item === cekRow12.toUpperCase())) + 1]
        const cekLastRow = parseInt(alphabet.indexOf(alphabet.find(item => item === cekRow12.toUpperCase())) + (distCol * (dataApp.penyetuju.length === 0 ? 1 : dataApp.penyetuju.length)))
        const cekRow22 = cekLastRow >= alphabet.length ? `A${alphabet[cekLastRow - alphabet.length]}` : alphabet[cekLastRow]
        ws.mergeCells(`${cekRow21}${sumRow}`, `${cekRow22}${sumRow}`)
        ws.getCell(`${cekRow21}${sumRow}`).value = 'Disetujui oleh,'
        ws.getCell(`${cekRow21}${sumRow}`).alignment = { horizontal:'center'}
        ws.getCell(`${cekRow21}${sumRow}`).border= { 
            ...borderStyles
        }

        dataApp.penyetuju !== undefined && dataApp.penyetuju.map((item, index) => {
            const name = item.nama === undefined || item.nama === null ? null 
            :item.nama.length <= 30 ?item.nama.split(" ").map((word) => { 
                return word[0] === undefined ? '' : word[0].toUpperCase() + word.substring(1)
            }).join(" ")
            :item.nama.slice(0, 29).split(" ").map((word) => { 
                return word[0] === undefined ? '' : word[0].toUpperCase() + word.substring(1)
            }).join(" ") + '.'
            const cekStart = parseInt(alphabet.indexOf(alphabet.find(item => item === cekRow21.toUpperCase())) + (distCol * index))
            const startRow = cekStart >= alphabet.length - 1 ? `A${alphabet[cekStart - alphabet.length]}` : alphabet[cekStart]
            const cekEnd = parseInt(alphabet.indexOf(alphabet.find(item => item === cekRow21.toUpperCase())) + ((distCol * index) + (distCol - 1)))
            const endRow = cekEnd >= alphabet.length - 1 ? `A${alphabet[cekEnd - alphabet.length]}` : alphabet[cekEnd]
            console.log(cekStart)
            console.log(cekEnd)
            console.log((distCol * index) + (distCol - 1))
            
            // console.log(alphabet.indexOf(alphabet.find(item => item === str2.toUpperCase())))
            // console.log(`${startRow}${headRow}`, `${endRow}${botRow} King`)

            ws.mergeCells(`${startRow}${headRow}`, `${endRow}${botRow}`)
            ws.getCell(`${startRow}${headRow}`).value = name === null 
            ? `\n\n\n - \n\n\n${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}` 
            : item.status === 0
            ? `\n Reject (${moment(item.updatedAt).format('DD/MM/YYYY')}) \n\n ${name} \n\ ${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}` 
            : `\n Approve (${moment(item.updatedAt).format('DD/MM/YYYY')}) \n\n ${name} \n\ ${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}`

            ws.getCell(`${startRow}${headRow}`).alignment = { 
                ...appStyle
            }
            ws.getCell(`${startRow}${headRow}`).border= { 
                ...borderStyles
            }
        })

        // width kolom B
        ws.getRow(12).height = 20
        
        // for (let i = 0; i < (cekLastRow < 16 ? 16 : cekLastRow - 1); i++) {
        //     console.log(i)
        //     ws.columns[2+i].width = 5.5
        // }

        // for (let i = 0; i < detailStock.length; i++) {
        //     ws.getRow(i + 12).height = 20
        // }

        await ws.protect('As5etPm4')

        workbook.xlsx.writeBuffer().then(function(buffer) {
            fs.saveAs(
              new Blob([buffer], { type: "application/octet-stream" }),
              `Form Stock Opname Asset ${detailStock[0].no_stock} ${moment().format('DD MMMM YYYY')}.xlsx`
            )
        })
        this.setState({isLoading: false})
    }

    toDataURL = (url) => {
        const promise = new Promise((resolve, reject) => {
          var xhr = new XMLHttpRequest();
          xhr.onload = function () {
            var reader = new FileReader();
            reader.readAsDataURL(xhr.response);
            reader.onloadend = function () {
              resolve({ base64Url: reader.result });
            };
          };
          xhr.open("GET", url);
          xhr.responseType = "blob";
          xhr.send();
        });
      
        return promise;
    }

    openModalEdit = () => {
        this.setState({modalEdit: !this.state.modalEdit})
    }

    getDataAsset = async (value) => {
        const token = localStorage.getItem("token")
        const { page } = this.props.asset
        const search = value === undefined ? '' : value.search
        const limit = value === undefined ? this.state.limit : value.limit
        await this.props.getAssetAll(token, limit, search, page.currentPage, 'asset')
        await this.props.getDetailDepo(token, 1)
        this.setState({limit: value === undefined ? 10 : value.limit})
    }

    getDataStock = async (value) => {
        const token = localStorage.getItem("token")
        const level = localStorage.getItem('level')
        // const { page } = this.props.disposal
        // const search = value === undefined ? '' : this.state.search
        // const limit = value === undefined ? this.state.limit : value.limit
        await this.props.getRole(token)
        this.setState({limit: value === undefined ? 10 : value.limit})
        const filter = this.state.filter
        this.changeFilter(filter)
    }

    openModalUpload = () => {
        this.setState({modalUpload: !this.state.modalUpload})
    }

    openModalDok = () => {
        this.setState({opendok: !this.state.opendok})
    }

    getDokumentasi = async (val) => {
        const token = localStorage.getItem("token")
        await this.props.exportStock(token, val.no_stock, this.state.month)
        this.openModalDok()
    }

    addStock = async (val) => {
        const token = localStorage.getItem("token")
        const dataAsset = this.props.asset.assetAll
        const { detailDepo } = this.props.depo
        const { kondisi, fisik } = this.state
        const data = {
            area: detailDepo.nama_area,
            kode_plant: dataAsset[0].kode_plant,
            deskripsi: val.deskripsi,
            merk: val.merk,
            satuan: val.satuan,
            unit: val.unit,
            lokasi: val.lokasi,
            grouping: val.grouping,
            keterangan: val.keterangan,
            kondisi: kondisi,
            status_fisik: fisik
        }
        await this.props.addOpname(token, data)
        await this.props.getStockArea(token, '', 1000, 1, 'null')
        const { dataAdd } = this.props.stock
        this.setState({kondisi: '', fisik: '', dataId: dataAdd.id})
        this.openModalAdd()
        this.openModalUpload()
    }

    openModalSum = async () => {
        const token = localStorage.getItem('token')
        await this.props.getStockArea(token, '', 1000, 1, 'null')
        this.openSum()
    }

    openModalSub = () => {
        this.setState({modalSubmit: !this.state.modalSubmit})
    }

    openSum = () => {
        this.setState({modalSum: !this.state.modalSum})
    }

    modalSubmitPre = () => {
        this.setState({submitPre: !this.state.submitPre})
    }

    selectTime = (val) => {
        this.setState({[val.type]: val.val})
    }

    changeTime = async (val) => {
        const token = localStorage.getItem("token")
        this.setState({time: val})
        if (val === 'all') {
            this.setState({time1: '', time2: ''})
            setTimeout(() => {
                this.getDataTime()
             }, 500)
        }
    }

    getDataTime = async () => {
        const {time1, time2, filter, search, limit} = this.state
        const cekTime1 = time1 === '' ? 'undefined' : time1
        const cekTime2 = time2 === '' ? 'undefined' : time2
        const token = localStorage.getItem("token")
        const level = localStorage.getItem("level")
        // const status = filter === 'selesai' ? '8' : filter === 'available' && level === '2' ? '1' : filter === 'available' && level === '8' ? '3' : 'all'
        this.changeFilter(filter)
    }

    changeFilter = async (val) => {
        this.setState({isLoading: true, listMon: []})
        const token = localStorage.getItem("token")
        const {time1, time2, search, limit} = this.state
        const cekTime1 = time1 === '' ? 'undefined' : time1
        const cekTime2 = time2 === '' ? 'undefined' : time2

        await this.props.getStockAll(token, search, 100, 1, '', val, cekTime1, cekTime2)

        const {dataStock, dataDepo} = this.props.stock
        const {dataRole} = this.props.user
        const level = localStorage.getItem('level')
        const role = level === '16' || level === '13' ? dataRole.find(({nomor}) => nomor === '27').name : localStorage.getItem('role')
        
        if (level === '2') {
            this.setState({filter: val, newStock: dataStock})
            if (val === 'available') {
                const newStock = []
                for (let i = 0; i < dataStock.length; i++) {
                    if (dataStock[i].status_reject !== 1 && dataStock[i].status_form === 9) {
                        newStock.push(dataStock[i])
                    }
                }
                this.setState({filter: val, newStock: newStock})
            } else if (val === 'sent') {
                const newStock = []
                for (let i = 0; i < dataDepo.length; i++) {
                    const cek = dataStock.find(item => item.kode_plant === dataDepo[i].kode_plant)
                    if (cek !== undefined) {
                        newStock.push(cek)
                    }
                }
                this.setState({filter: val, newStock: newStock})
            } else if (val === 'selesai') {
                const newStock = []
                for (let i = 0; i < dataDepo.length; i++) {
                    const cek = dataStock.find(item => item.kode_plant === dataDepo[i].kode_plant)
                    if (cek !== undefined && cek.status_form === 8) {
                        newStock.push(cek)
                    }
                }
                this.setState({filter: val, newStock: newStock})
            } else if (val === 'reject') {
                const newStock = []
                for (let i = 0; i < dataDepo.length; i++) {
                    const cek = dataStock.find(item => item.kode_plant === dataDepo[i].kode_plant)
                    if (cek !== undefined && cek.status_reject === 1) {
                        newStock.push(cek)
                    }
                }
                this.setState({filter: val, newStock: newStock})
            } else {
                console.log('masuk else king')
                const newStock = []
                for (let i = 0; i < dataDepo.length; i++) {
                    const cek = dataStock.find(item => item.kode_plant === dataDepo[i].kode_plant)
                    if (cek !== undefined) {
                        newStock.push(cek)
                    } else {
                        const data = {
                            status_form: 'false',
                            ...dataDepo[i]
                        }
                        newStock.push(data)
                    }
                }
                this.setState({filter: val, newStock: newStock})
            }
        } else {
            if (val === 'available') {
                const newStock = []
                for (let i = 0; i < dataStock.length; i++) {
                    const app = dataStock[i].appForm
                    const find = app.indexOf(app.find(({jabatan}) => jabatan === role))
                    console.log(app[find])
                    if (app[find] === undefined) {
                        console.log()
                    } else if (level === '7' || level === 7) {
                        if (dataStock[i].status_reject !== 1 && ((app.length === 0 || app[app.length - 1].status === null) || (app[find] !== undefined && app[find + 1].status === 1 && app[find - 1].status === null && (app[find].status === null || app[find].status === 0)))) {
                            newStock.push(dataStock[i])
                        }
                    } else if (find === 0 || find === '0') {
                        if ((dataStock[i].status_reject !== 1) && app[find] !== undefined && app[find + 1].status === 1 && app[find].status !== 1) {
                            newStock.push(dataStock[i])
                        }
                    } else {
                        if (app[find] !== undefined || app[find + 1].status === undefined) {
                            console.log('user cannt approve')
                        } else if ((dataStock[i].status_reject !== 1) && app[find] !== undefined && app[find + 1].status === 1 && app[find - 1].status === null && app[find].status !== 1) {
                            newStock.push(dataStock[i])
                        }
                    }
                }
                this.setState({filter: val, newStock: newStock})
            } else if (val === 'sent') {
                const newStock = []
                for (let i = 0; i < dataDepo.length; i++) {
                    const cek = dataStock.find(item => item.kode_plant === dataDepo[i].kode_plant)
                    if (cek !== undefined) {
                        newStock.push(cek)
                    }
                }
                this.setState({filter: val, newStock: newStock})
            } else if (val === 'selesai') {
                const newStock = []
                for (let i = 0; i < dataDepo.length; i++) {
                    const cek = dataStock.find(item => item.kode_plant === dataDepo[i].kode_plant)
                    if (cek !== undefined && cek.status_form === 8) {
                        newStock.push(cek)
                    }
                }
                this.setState({filter: val, newStock: newStock})
            } else if (val === 'reject') {
                const newStock = []
                for (let i = 0; i < dataDepo.length; i++) {
                    const cek = dataStock.find(item => item.kode_plant === dataDepo[i].kode_plant)
                    if (cek !== undefined && cek.status_reject === 1) {
                        newStock.push(cek)
                    }
                }
                this.setState({filter: val, newStock: newStock})
            } else {
                const newStock = []
                for (let i = 0; i < dataDepo.length; i++) {
                    const cek = dataStock.find(item => item.kode_plant === dataDepo[i].kode_plant)
                    if (cek !== undefined) {
                        newStock.push(cek)
                    } else {
                        const data = {
                            status_form: 'false',
                            ...dataDepo[i]
                        }
                        newStock.push(data)
                    }
                }
                this.setState({filter: val, newStock: newStock})
            }
        }
        this.setState({isLoading: false})
    }

    prosesSubmitPre = async () => {
        const token = localStorage.getItem("token")
        await this.props.getAssetAll(token, 1000, '', 1, 'asset')
        this.modalSubmitPre()
    }

    onSearch = async (e) => {
        this.setState({search: e.target.value})
        const token = localStorage.getItem("token")
        if(e.key === 'Enter'){
           this.changeFilter(this.state.filter)
        }
    }

    updateAsset = async (value) => {
        const token = localStorage.getItem("token")
        const { dataRinci } = this.state
        const { detailAsset } = this.props.asset
        const data = {
            merk: value.merk,
            satuan: value.satuan,
            unit: value.unit,
            lokasi: value.lokasi,
            grouping: detailAsset.grouping,
            keterangan: value.keterangan,
            status_fisik: detailAsset.fisik,
            kondisi: detailAsset.kondisi
        }
        await this.props.updateAssetNew(token, dataRinci.id, data)
    }

    updateGrouping = async (val) => {
        const token = localStorage.getItem("token")
        const data = {
            grouping: val.target
        }
        if (val.target === 'DIPINJAM SEMENTARA') {
            this.setState({stat: val.target, })
            await this.props.getDetailAsset(token, val.item.id)
            this.openProsesModalDoc()
        } else {
            await this.props.updateAsset(token, val.item.id, data)
            this.getDataAsset()
        }
    }

    changeView = (val) => {
        this.setState({view: val})
        if (val === 'list') {
            this.getDataList()
        } else {
            this.getDataStock()
        }
    }

    updateNewAsset = async (value) => {
        const token = localStorage.getItem("token")
        const data = {
            [value.target.name]: value.target.value
        }
        const target = value.target.name
        if (target === 'lokasi' || target === 'keterangan' || target === 'merk') {
            if (value.key === 'Enter') {
                await this.props.updateAsset(token, value.item.id, data)
                this.setState({idTab: null})
                this.getDataAsset()
            } else {
                this.setState({idTab: value.item.id})
            }
        } else {
            if (target === "status_fisik" || target === "kondisi") {
                const data = {
                    [value.target.name]: value.target.value,
                    grouping: null
                }
                await this.props.updateAsset(token, value.item.id, data)
                this.getDataAsset()
            } else {
                await this.props.updateAsset(token, value.item.id, data)
                this.getDataAsset()
            }
        }
    }

    downloadDokumentasi = async () => {
        const {dataExp} = this.props.report
        this.setState({isLoading: true})

        const borderStyles = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
        }

        const titleStyle = {
            bold: true,
            size: 12,
            underline: true
        }

        const alignStyle = {
            horizontal:'left',
            // wrapText: true,
            vertical: 'middle'
        }

        const boldStyle = {
            bold: true
        }

        const tbStyle = {
            // horizontal:'center',
            wrapText: true,
            vertical: 'middle',
            shrinkToFit: true
        }

        const imgStyle = {
            wrapText: true,
            vertical: 'middle',
            shrinkToFit: true,
            horizontal: 'center'
        }

        const workbook = new ExcelJS.Workbook();
        const ws = workbook.addWorksheet('dokumentasi asset', {
            pageSetup: { orientation:'landscape', paperSize: 8 }
        })

        ws.mergeCells(`B2`, `B2`)
        ws.getCell(`B2`).value = `DOKUMENTASI ASSET STOCK OPNAME ${dataExp[0].no_stock}`
        ws.getCell(`B2`).alignment = { 
            ...alignStyle
        }
        ws.getCell(`B2`).font = { 
            ...titleStyle
        }

        ws.pageSetup.printTitlesRow = '1:4';

        //table
        ws.mergeCells(`B4`, `B4`)
        ws.getCell(`B4`).value = 'NO'
        ws.getCell(`B4`).alignment = { 
            ...tbStyle
        }
        ws.getCell(`B4`).border = { 
            ...borderStyles
        }
        ws.getCell(`B4`).font = { 
            ...boldStyle
        }

        ws.mergeCells(`C4`, `D4`)
        ws.getCell(`C4`).value = 'NO. ASET'
        ws.getCell(`C4`).alignment = { 
            ...tbStyle
        }
        ws.getCell(`C4`).border = { 
            ...borderStyles
        }
        ws.getCell(`C4`).font = { 
            ...boldStyle
        }

        ws.mergeCells(`E4`, `H4`)
        ws.getCell(`E4`).value = 'DESKRIPSI'
        ws.getCell(`E4`).alignment = { 
            ...tbStyle
        }
        ws.getCell(`E4`).border = { 
            ...borderStyles
        }
        ws.getCell(`E4`).font = { 
            ...boldStyle
        }

        ws.mergeCells(`I4`, `I4`)
        ws.getCell(`I4`).value = 'PLANT'
        ws.getCell(`I4`).alignment = { 
            ...tbStyle
        }
        ws.getCell(`I4`).border = { 
            ...borderStyles
        }
        ws.getCell(`I4`).font = { 
            ...boldStyle
        }

        ws.mergeCells(`J4`, `K4`)
        ws.getCell(`J4`).value = 'AREA'
        ws.getCell(`J4`).alignment = { 
            ...tbStyle
        }
        ws.getCell(`J4`).border = { 
            ...borderStyles
        }
        ws.getCell(`J4`).font = { 
            ...boldStyle
        }

        ws.mergeCells(`L4`, `L4`)
        ws.getCell(`L4`).value = 'SATUAN'
        ws.getCell(`L4`).alignment = { 
            ...tbStyle
        }
        ws.getCell(`L4`).border = { 
            ...borderStyles
        }
        ws.getCell(`L4`).font = { 
            ...boldStyle
        }

        ws.mergeCells(`M4`, `M4`)
        ws.getCell(`M4`).value = 'KONDISI'
        ws.getCell(`M4`).alignment = { 
            ...tbStyle
        }
        ws.getCell(`M4`).border = { 
            ...borderStyles
        }
        ws.getCell(`M4`).font = { 
            ...boldStyle
        }

        ws.mergeCells(`N4`, `O4`)
        ws.getCell(`N4`).value = 'GROUPING'
        ws.getCell(`N4`).alignment = { 
            ...tbStyle
        }
        ws.getCell(`N4`).border = { 
            ...borderStyles
        }
        ws.getCell(`N4`).font = { 
            ...boldStyle
        }

        ws.mergeCells(`P4`, `S4`)
        ws.getCell(`P4`).value = 'PICTURE'
        ws.getCell(`P4`).alignment = { 
            ...tbStyle
        }
        ws.getCell(`P4`).border = { 
            ...borderStyles
        }
        ws.getCell(`P4`).font = { 
            ...boldStyle
        }

        for (let i = 0; i < dataExp.length; i++) {
            ws.mergeCells(`B${i + 5}`, `B${i + 5}`)
            ws.getCell(`B${i + 5}`).value = `${i + 1}`
            ws.getCell(`B${i + 5}`).alignment = { 
                ...tbStyle
            }
            ws.getCell(`B${i + 5}`).border = { 
                ...borderStyles
            }
    
            ws.mergeCells(`C${i + 5}`, `D${i + 5}`)
            ws.getCell(`C${i + 5}`).value = `${dataExp[i].no_asset === null ? '' : dataExp[i].no_asset}`
            ws.getCell(`C${i + 5}`).alignment = { 
                ...tbStyle
            }
            ws.getCell(`C${i + 5}`).border = { 
                ...borderStyles
            }
    
            ws.mergeCells(`E${i + 5}`, `H${i + 5}`)
            ws.getCell(`E${i + 5}`).value = `${dataExp[i].deskripsi === null ? '' : dataExp[i].deskripsi }`
            ws.getCell(`E${i + 5}`).alignment = { 
                ...tbStyle
            }
            ws.getCell(`E${i + 5}`).border = { 
                ...borderStyles
            }
    
            ws.mergeCells(`I${i + 5}`, `I${i + 5}`)
            ws.getCell(`I${i + 5}`).value = `${dataExp[i].kode_plant === null ? '' : dataExp[i].kode_plant}`
            ws.getCell(`I${i + 5}`).alignment = { 
                ...tbStyle
            }
            ws.getCell(`I${i + 5}`).border = { 
                ...borderStyles
            }
    
            ws.mergeCells(`J${i + 5}`, `K${i + 5}`)
            ws.getCell(`J${i + 5}`).value = `${dataExp[i].area === null ? '' : dataExp[i].area }`
            ws.getCell(`J${i + 5}`).alignment = { 
                ...tbStyle
            }
            ws.getCell(`J${i + 5}`).border = { 
                ...borderStyles
            }
    
            ws.mergeCells(`L${i + 5}`, `L${i + 5}`)
            ws.getCell(`L${i + 5}`).value = `${dataExp[i].satuan === null ? '' : dataExp[i].satuan}`
            ws.getCell(`L${i + 5}`).alignment = { 
                ...tbStyle
            }
            ws.getCell(`L${i + 5}`).border = { 
                ...borderStyles
            }
    
            ws.mergeCells(`M${i + 5}`, `M${i + 5}`)
            ws.getCell(`M${i + 5}`).value = `${dataExp[i].kondisi === null ? '' : dataExp[i].kondisi}`
            ws.getCell(`M${i + 5}`).alignment = { 
                ...tbStyle
            }
            ws.getCell(`M${i + 5}`).border = { 
                ...borderStyles
            }
    
            ws.mergeCells(`N${i + 5}`, `O${i + 5}`)
            ws.getCell(`N${i + 5}`).value = `${dataExp[i].grouping === null ? '' : dataExp[i].grouping}`
            ws.getCell(`N${i + 5}`).alignment = { 
                ...tbStyle
            }
            ws.getCell(`N${i + 5}`).border = { 
                ...borderStyles
            }
    
            ws.mergeCells(`P${i + 5}`, `S${i + 5}`)
            // ws.getCell(`P${i + 5}`).value = `${dataExp[i].grouping === null ? '' : dataExp[i].grouping}`
            ws.getCell(`P${i + 5}`).alignment = { 
                ...imgStyle
            }
            ws.getCell(`P${i + 5}`).border = { 
                ...borderStyles
            }

            ws.getRow(i + 5).height = 200

            const cekPict = dataExp[i].image !== null && dataExp.image !== ''
            const pict = cekPict ? dataExp[i].image : dataExp[i].pict[dataExp[i].pict.length - 1].path

            const result = await this.toDataURL(`${REACT_APP_BACKEND_URL}/${pict}`);

            const imageId2 = workbook.addImage({
            base64: result.base64Url,
            extension: 'png',
            });

            ws.addImage(imageId2, {
                tl: { col: 15.2, row: i + 4.2 },
                ext: { width: 230, height: 150 },
            });
        }

        await ws.protect('As5etPm4')

        workbook.xlsx.writeBuffer().then(function(buffer) {
            fs.saveAs(
              new Blob([buffer], { type: "application/octet-stream" }),
              `Dokumentasi Asset Stock Opname ${dataExp[0].no_stock} ${moment().format('DD MMMM YYYY')}.xlsx`
            )
        })

        this.setState({isLoading: false})
    }

    downloadMonitoring = async () => {
        this.setState({isLoading: true})
        const { newStock, listMon } = this.state
        const dataDownload = []
        for (let i = 0; i < listMon.length; i++) {
            const cek = newStock.find(item => item.kode_plant === listMon[i])
            if (cek !== undefined) {
                dataDownload.push(cek)
            }
        }

        const borderStyles = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
        }

        const titleStyle = {
            bold: true,
            size: 12,
            underline: true
        }

        const alignStyle = {
            horizontal:'left',
            // wrapText: true,
            vertical: 'middle'
        }

        const boldStyle = {
            bold: true
        }

        const tbStyle = {
            // horizontal:'center',
            wrapText: true,
            vertical: 'middle',
            shrinkToFit: true
        }

        const imgStyle = {
            wrapText: true,
            vertical: 'middle',
            shrinkToFit: true,
            horizontal: 'center'
        }

        const workbook = new ExcelJS.Workbook();
        const ws = workbook.addWorksheet('monitoring', {
            pageSetup: { orientation:'landscape', paperSize: 8 }
        })

        ws.mergeCells(`B2`, `B2`)
        ws.getCell(`B2`).value = `MONITORING STOCK OPNAME ASSET`
        ws.getCell(`B2`).alignment = { 
            ...alignStyle
        }
        ws.getCell(`B2`).font = { 
            ...titleStyle
        }

        //table
        ws.mergeCells(`B4`, `B4`)
        ws.getCell(`B4`).value = 'NO'
        ws.getCell(`B4`).alignment = { 
            ...tbStyle
        }
        ws.getCell(`B4`).border = { 
            ...borderStyles
        }
        ws.getCell(`B4`).font = { 
            ...boldStyle
        }

        ws.mergeCells(`C4`, `C4`)
        ws.getCell(`C4`).value = 'No Stock Opname'
        ws.getCell(`C4`).alignment = { 
            ...tbStyle
        }
        ws.getCell(`C4`).border = { 
            ...borderStyles
        }
        ws.getCell(`C4`).font = { 
            ...boldStyle
        }

        ws.mergeCells(`D4`, `D4`)
        ws.getCell(`D4`).value = 'Kode Area'
        ws.getCell(`D4`).alignment = { 
            ...tbStyle
        }
        ws.getCell(`D4`).border = { 
            ...borderStyles
        }
        ws.getCell(`D4`).font = { 
            ...boldStyle
        }

        ws.mergeCells(`E4`, `E4`)
        ws.getCell(`E4`).value = 'Area'
        ws.getCell(`E4`).alignment = { 
            ...tbStyle
        }
        ws.getCell(`E4`).border = { 
            ...borderStyles
        }
        ws.getCell(`E4`).font = { 
            ...boldStyle
        }

        ws.mergeCells(`F4`, `F4`)
        ws.getCell(`F4`).value = 'Tanggal Stock Opname'
        ws.getCell(`F4`).alignment = { 
            ...tbStyle
        }
        ws.getCell(`F4`).border = { 
            ...borderStyles
        }
        ws.getCell(`F4`).font = { 
            ...boldStyle
        }

        ws.mergeCells(`G4`, `G4`)
        ws.getCell(`G4`).value = 'Dokumentasi Aset'
        ws.getCell(`G4`).alignment = { 
            ...tbStyle
        }
        ws.getCell(`G4`).border = { 
            ...borderStyles
        }
        ws.getCell(`G4`).font = { 
            ...boldStyle
        }

        ws.mergeCells(`H4`, `H4`)
        ws.getCell(`H4`).value = 'Nama ROM'
        ws.getCell(`H4`).alignment = { 
            ...tbStyle
        }
        ws.getCell(`H4`).border = { 
            ...borderStyles
        }
        ws.getCell(`H4`).font = { 
            ...boldStyle
        }

        ws.mergeCells(`I4`, `I4`)
        ws.getCell(`I4`).value = 'Nama BM'
        ws.getCell(`I4`).alignment = { 
            ...tbStyle
        }
        ws.getCell(`I4`).border = { 
            ...borderStyles
        }
        ws.getCell(`I4`).font = { 
            ...boldStyle
        }

        ws.mergeCells(`J4`, `J4`)
        ws.getCell(`J4`).value = 'APPROVED BY'
        ws.getCell(`J4`).alignment = { 
            ...tbStyle
        }
        ws.getCell(`J4`).border = { 
            ...borderStyles
        }
        ws.getCell(`J4`).font = { 
            ...boldStyle
        }

        ws.mergeCells(`K4`, `K4`)
        ws.getCell(`K4`).value = 'TGL APPROVED'
        ws.getCell(`K4`).alignment = { 
            ...tbStyle
        }
        ws.getCell(`K4`).border = { 
            ...borderStyles
        }
        ws.getCell(`K4`).font = { 
            ...boldStyle
        }

        ws.mergeCells(`L4`, `L4`)
        ws.getCell(`L4`).value = 'STATUS WAKTU'
        ws.getCell(`L4`).alignment = { 
            ...tbStyle
        }
        ws.getCell(`L4`).border = { 
            ...borderStyles
        }
        ws.getCell(`L4`).font = { 
            ...boldStyle
        }

        for (let i = 0; i < dataDownload.length; i++) {
            const item = dataDownload[i]
            if (item.status_form === 'false') {
                ws.mergeCells(`B${i + 5}`, `B${i + 5}`)
                ws.getCell(`B${i + 5}`).value = `${i + 1}`
                ws.getCell(`B${i + 5}`).alignment = { 
                    ...tbStyle
                }
                ws.getCell(`B${i + 5}`).border = { 
                    ...borderStyles
                }

                ws.mergeCells(`C${i + 5}`, `C${i + 5}`)
                ws.getCell(`C${i + 5}`).value = '-'
                ws.getCell(`C${i + 5}`).alignment = { 
                    ...tbStyle
                }
                ws.getCell(`C${i + 5}`).border = { 
                    ...borderStyles
                }
                ws.getCell(`C${i + 5}`).font = { 
                    ...boldStyle
                }

                ws.mergeCells(`D${i + 5}`, `D${i + 5}`)
                ws.getCell(`D${i + 5}`).value = item.kode_plant
                ws.getCell(`D${i + 5}`).alignment = { 
                    ...tbStyle
                }
                ws.getCell(`D${i + 5}`).border = { 
                    ...borderStyles
                }
                ws.getCell(`D${i + 5}`).font = { 
                    ...boldStyle
                }

                ws.mergeCells(`E${i + 5}`, `E${i + 5}`)
                ws.getCell(`E${i + 5}`).value = item.nama_area
                ws.getCell(`E${i + 5}`).alignment = { 
                    ...tbStyle
                }
                ws.getCell(`E${i + 5}`).border = { 
                    ...borderStyles
                }
                ws.getCell(`E${i + 5}`).font = { 
                    ...boldStyle
                }

                ws.mergeCells(`F${i + 5}`, `F${i + 5}`)
                ws.getCell(`F${i + 5}`).value = '-'
                ws.getCell(`F${i + 5}`).alignment = { 
                    ...tbStyle
                }
                ws.getCell(`F${i + 5}`).border = { 
                    ...borderStyles
                }
                ws.getCell(`F${i + 5}`).font = { 
                    ...boldStyle
                }

                ws.mergeCells(`G${i + 5}`, `G${i + 5}`)
                ws.getCell(`G${i + 5}`).value = '-'
                ws.getCell(`G${i + 5}`).alignment = { 
                    ...tbStyle
                }
                ws.getCell(`G${i + 5}`).border = { 
                    ...borderStyles
                }
                ws.getCell(`G${i + 5}`).font = { 
                    ...boldStyle
                }

                ws.mergeCells(`H${i + 5}`, `H${i + 5}`)
                ws.getCell(`H${i + 5}`).value = item.nama_om
                ws.getCell(`H${i + 5}`).alignment = { 
                    ...tbStyle
                }
                ws.getCell(`H${i + 5}`).border = { 
                    ...borderStyles
                }
                ws.getCell(`H${i + 5}`).font = { 
                    ...boldStyle
                }

                ws.mergeCells(`I${i + 5}`, `I${i + 5}`)
                ws.getCell(`I${i + 5}`).value = item.nama_bm
                ws.getCell(`I${i + 5}`).alignment = { 
                    ...tbStyle
                }
                ws.getCell(`I${i + 5}`).border = { 
                    ...borderStyles
                }
                ws.getCell(`I${i + 5}`).font = { 
                    ...boldStyle
                }

                ws.mergeCells(`J${i + 5}`, `J${i + 5}`)
                ws.getCell(`J${i + 5}`).value = '-'
                ws.getCell(`J${i + 5}`).alignment = { 
                    ...tbStyle
                }
                ws.getCell(`J${i + 5}`).border = { 
                    ...borderStyles
                }
                ws.getCell(`J${i + 5}`).font = { 
                    ...boldStyle
                }

                ws.mergeCells(`K${i + 5}`, `K${i + 5}`)
                ws.getCell(`K${i + 5}`).value = '-'
                ws.getCell(`K${i + 5}`).alignment = { 
                    ...tbStyle
                }
                ws.getCell(`K${i + 5}`).border = { 
                    ...borderStyles
                }
                ws.getCell(`K${i + 5}`).font = { 
                    ...boldStyle
                }

                ws.mergeCells(`L${i + 5}`, `L${i + 5}`)
                ws.getCell(`L${i + 5}`).value = 'Belum Mengajukan Stock Opname'
                ws.getCell(`L${i + 5}`).alignment = { 
                    ...tbStyle
                }
                ws.getCell(`L${i + 5}`).border = { 
                    ...borderStyles
                }
                ws.getCell(`L${i + 5}`).font = { 
                    ...boldStyle
                }
            } else {
                ws.mergeCells(`B${i + 5}`, `B${i + 5}`)
                ws.getCell(`B${i + 5}`).value = `${i + 1}`
                ws.getCell(`B${i + 5}`).alignment = { 
                    ...tbStyle
                }
                ws.getCell(`B${i + 5}`).border = { 
                    ...borderStyles
                }

                ws.mergeCells(`C${i + 5}`, `C${i + 5}`)
                ws.getCell(`C${i + 5}`).value = item.no_stock
                ws.getCell(`C${i + 5}`).alignment = { 
                    ...tbStyle
                }
                ws.getCell(`C${i + 5}`).border = { 
                    ...borderStyles
                }
                ws.getCell(`C${i + 5}`).font = { 
                    ...boldStyle
                }

                ws.mergeCells(`D${i + 5}`, `D${i + 5}`)
                ws.getCell(`D${i + 5}`).value = item.kode_plant
                ws.getCell(`D${i + 5}`).alignment = { 
                    ...tbStyle
                }
                ws.getCell(`D${i + 5}`).border = { 
                    ...borderStyles
                }
                ws.getCell(`D${i + 5}`).font = { 
                    ...boldStyle
                }

                ws.mergeCells(`E${i + 5}`, `E${i + 5}`)
                ws.getCell(`E${i + 5}`).value = item.depo === null ? '' : item.area === null ? `${item.depo.nama_area} ${item.depo.channel}` : item.area
                ws.getCell(`E${i + 5}`).alignment = { 
                    ...tbStyle
                }
                ws.getCell(`E${i + 5}`).border = { 
                    ...borderStyles
                }
                ws.getCell(`E${i + 5}`).font = { 
                    ...boldStyle
                }

                ws.mergeCells(`F${i + 5}`, `F${i + 5}`)
                ws.getCell(`F${i + 5}`).value = moment(item.tanggalStock).format('DD MMMM YYYY')
                ws.getCell(`F${i + 5}`).alignment = { 
                    ...tbStyle
                }
                ws.getCell(`F${i + 5}`).border = { 
                    ...borderStyles
                }
                ws.getCell(`F${i + 5}`).font = { 
                    ...boldStyle
                }

                ws.mergeCells(`G${i + 5}`, `G${i + 5}`)
                ws.getCell(`G${i + 5}`).value = 'V'
                ws.getCell(`G${i + 5}`).alignment = { 
                    ...tbStyle
                }
                ws.getCell(`G${i + 5}`).border = { 
                    ...borderStyles
                }
                ws.getCell(`G${i + 5}`).font = { 
                    ...boldStyle
                }

                ws.mergeCells(`H${i + 5}`, `H${i + 5}`)
                ws.getCell(`H${i + 5}`).value = item.depo === null ? '-' :  `${item.depo.nama_om}`
                ws.getCell(`H${i + 5}`).alignment = { 
                    ...tbStyle
                }
                ws.getCell(`H${i + 5}`).border = { 
                    ...borderStyles
                }
                ws.getCell(`H${i + 5}`).font = { 
                    ...boldStyle
                }

                ws.mergeCells(`I${i + 5}`, `I${i + 5}`)
                ws.getCell(`I${i + 5}`).value = item.depo === null ? '-' :  `${item.depo.nama_bm}`
                ws.getCell(`I${i + 5}`).alignment = { 
                    ...tbStyle
                }
                ws.getCell(`I${i + 5}`).border = { 
                    ...borderStyles
                }
                ws.getCell(`I${i + 5}`).font = { 
                    ...boldStyle
                }

                ws.mergeCells(`J${i + 5}`, `J${i + 5}`)
                ws.getCell(`J${i + 5}`).value = item.appForm !== null && item.appForm.length > 0 && item.appForm.find(item => item.status === 1) !== undefined ? item.appForm.find(item => item.status === 1).nama + ` (${item.appForm.find(item => item.status === 1).jabatan === 'area' ? 'AOS' : item.appForm.find(item => item.status === 1).jabatan})` : '-' 
                ws.getCell(`J${i + 5}`).alignment = { 
                    ...tbStyle
                }
                ws.getCell(`J${i + 5}`).border = { 
                    ...borderStyles
                }
                ws.getCell(`J${i + 5}`).font = { 
                    ...boldStyle
                }

                ws.mergeCells(`K${i + 5}`, `K${i + 5}`)
                ws.getCell(`K${i + 5}`).value = item.appForm !== null && item.appForm.length > 0 && item.appForm.find(item => item.status === 1) !== undefined ? moment(item.appForm.find(item => item.status === 1).updatedAt).format('DD/MM/YYYY HH:mm:ss') : '-'
                ws.getCell(`K${i + 5}`).alignment = { 
                    ...tbStyle
                }
                ws.getCell(`K${i + 5}`).border = { 
                    ...borderStyles
                }
                ws.getCell(`K${i + 5}`).font = { 
                    ...boldStyle
                }

                ws.mergeCells(`L${i + 5}`, `L${i + 5}`)
                ws.getCell(`L${i + 5}`).value = moment(item.tanggalStock).format('DD') > 5 && moment(item.tanggalStock).format('DD') < 26 ? 'TELAT' : 'Tepat Waktu'
                ws.getCell(`L${i + 5}`).alignment = { 
                    ...tbStyle
                }
                ws.getCell(`L${i + 5}`).border = { 
                    ...borderStyles
                }
                ws.getCell(`L${i + 5}`).font = { 
                    ...boldStyle
                }
            }
        }

        for (let i = 0; i < 10; i++) {
            console.log(i)
            if (i === 1) {
                ws.columns[2+i].width = 10
            } else {
                ws.columns[2+i].width = 25
            }
        }

        // await ws.protect('As5etPm4')

        workbook.xlsx.writeBuffer().then(function(buffer) {
            fs.saveAs(
              new Blob([buffer], { type: "application/octet-stream" }),
              `Monitoring Stock Opname Asset ${moment().format('DD MMMM YYYY')}.xlsx`
            )
        })

        this.setState({isLoading: false})
    }

    updateStatus = async (val) => {
        const token = localStorage.getItem('token')
        const { detailAsset } = this.props.asset
        const { stat } = this.state
        const data = {
            grouping: stat === 'null' ? null : stat
        }
        await this.props.updateAssetNew(token, detailAsset.id, data)
        this.getDataAsset()
    } 

    selectStatus = async (fisik, kondisi) => {
        this.setState({fisik: fisik, kondisi: kondisi})
        const token = localStorage.getItem("token")
        if (fisik === '' && kondisi === '') {
            console.log(fisik, kondisi)
        } else {
            await this.props.getStatus(token, fisik, kondisi, 'false')
        }
    }

    updateCond = async (val) => {
        const token = localStorage.getItem("token")
        const data = {
            [val.tipe]: val.val
        }
        const {detailAsset} = this.props.asset
        await this.props.updateAsset(token, detailAsset.id, data)
        this.getDataAsset()
    }

    listStatus = async (val) => {
        const token = localStorage.getItem("token")
        await this.props.getDetailAsset(token, val.id)
        const { detailAsset } = this.props.asset
        if (detailAsset !== undefined) {
            this.setState({stat: detailAsset.grouping})
            if (detailAsset.kondisi === null && detailAsset.status_fisik === null) {
                await this.props.getStatus(token, '', '', 'true')
                this.modalStatus()
            } else {
                await this.props.getStatus(token, detailAsset.status_fisik === null ? '' : detailAsset.status_fisik, detailAsset.kondisi === null ? '' : detailAsset.kondisi, 'true')
                this.modalStatus()
            }
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
    }

    openProsesModalDoc = async () => {
        const token = localStorage.getItem("token")
        const { detailAsset } = this.props.asset
        await this.props.getDocument(token, detailAsset.no_asset, detailAsset.id)
        this.openModalDoc()
    }

    cekStatus = async (val) => {
        const token = localStorage.getItem("token")
        const { detailAsset } = this.props.asset
        if (val === 'DIPINJAM SEMENTARA') {
            await this.props.cekDokumen(token, detailAsset.no_asset, detailAsset.id)
        }
    }

    openModalDoc = () => {
        this.setState({modalDoc: !this.state.modalDoc})
    }

    openModalAdd = () => {
        this.setState({modalAdd: !this.state.modalAdd})
    }

    getRincian = async (val) => {
        const token = localStorage.getItem("token")
        this.setState({dataRinci: val})
        await this.props.getDetailAsset(token, val.id)
        this.openModalEdit()
    }

    modalStatus = () => {
        this.setState({openStatus: !this.state.openStatus})
    }

    chekApp = (val) => {
        const { listMut } = this.state
        const { detailStock } = this.props.stock
        if (val === 'all') {
            const data = []
            for (let i = 0; i < detailStock.length; i++) {
                data.push(detailStock[i].id)
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

    monApp = (val) => {
        const { listMon, newStock } = this.state
        if (val === 'all') {
            const data = []
            for (let i = 0; i < newStock.length; i++) {
                data.push(newStock[i].kode_plant)
            }
            this.setState({listMon: data})
        } else {
            listMon.push(val)
            this.setState({listMon: listMon})
        }
    }

    monRej = (val) => {
        const { listMon } = this.state
        if (val === 'all') {
            const data = []
            this.setState({listMon: data})
        } else {
            const data = []
            for (let i = 0; i < listMon.length; i++) {
                if (listMon[i] === val) {
                    data.push()
                } else {
                    data.push(listMon[i])
                }
            }
            this.setState({listMon: data})
        }
    }

    getRinciStock = async (val) => {
        const token = localStorage.getItem("token")
        this.setState({dataRinci: val, dataId: val.id})
        await this.props.getDetailItem(token, val.id)
        this.openModalStock()
    }

    openModalStock = () => {
        this.setState({modalStock: !this.state.modalStock})
    }

    dropDown = () => {
        this.setState({drop: !this.state.drop})
    }

    goCartStock = () => {
        this.props.history.push('/cartstock')
    }

    goRevisi = () => {
        this.props.history.push('/editstock')
    }


    render() {
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const {dataRinci, dropApp, dataItem, listMut, drop, newStock, tipeEmail, listStat, listMon} = this.state
        const { detailDepo } = this.props.depo
        const { alertUpload, page, detailAsset} = this.props.asset
        const dataAsset = this.props.asset.assetAll
        const detRinci = this.props.stock.detailAsset
        const { dataStock, detailStock, stockApp, dataStatus, alertM, alertMsg, dataDoc, stockArea, dataDepo } = this.props.stock
        const pages = this.props.depo.page
        const {dataExp} = this.props.report

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
                            <div className={style.headMaster}>
                                <div className={style.titleDashboard}>Stock Opname Asset</div>
                            </div>
                            <div className={style.secEmail3}>
                                {level === '5' || level === '9' ? (
                                    <div className={style.headEmail}>
                                        <Button onClick={this.prosesSubmitPre} color="info" size="lg">Create</Button>
                                    </div>
                                ) : (level === '2' || level === '12' || level === '7') && (
                                    <div className={style.headEmail}>
                                    </div>
                                )}
                                {this.state.view === 'list' ? (
                                    <div>
                                        <Button className='marDown' color='primary' onClick={() => this.getDokumentasi({no: 'all'})} >Download All</Button>
                                        <ReactHtmlToExcel
                                            id="test-table-xls-button"
                                            className="btn btn-success marDown ml-2"
                                            table="table-tracking"
                                            filename="Dokumentasi Tracking Stock Opname"
                                            sheet="Dokumentasi"
                                            buttonText="Download Tracking"
                                        />
                                    </div>
                                ) : level !== '5' && level !== '9' && level !== '2' && (
                                    <div className='mt-4'>
                                        <Input type="select" value={this.state.filter} onChange={e => this.changeFilter(e.target.value)}>
                                            <option value="available">Available To Approve</option>
                                            <option value="not available">All</option>
                                        </Input>
                                    </div>
                                )}
                            </div>
                            <div className={style.secEmail3}>
                                {level !== '5' && level !== '9' ? (
                                    <div className='mt-4 ml-3'>
                                        <text>Periode: </text>
                                        <ButtonDropdown className={style.drop} isOpen={drop} toggle={this.dropDown}>
                                        <DropdownToggle caret color="light">
                                            {this.state.bulan}
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            {moment.months().map(item => {
                                                return (
                                                    <DropdownItem className={style.item} onClick={() => this.getDataAsset({limit: 10, search: ''})}>{item}</DropdownItem>
                                                )
                                            })}
                                        </DropdownMenu>
                                        </ButtonDropdown>
                                    </div>
                                ) : (
                                    <div></div>
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
                            {newStock.length === 0 && dataDepo.length === 0 ? (
                                <div></div>
                            ) : (
                                <div className={style.tableDashboard}>
                                    <Table bordered responsive hover className={style.tab} id="table-tracking">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Area</th>
                                                <th>Kode Area</th>
                                                <th>Tanggal Stock Opname</th>
                                                <th>No Stock Opname</th>
                                                {level === '2' ? (
                                                    <>
                                                        <th>Status Approve</th>
                                                        <th>Dokumentasi Aset</th>
                                                    </>
                                                ) : (
                                                    <th>Status Approve</th>
                                                )}
                                                <th>Nama OM</th>
                                                <th>Nama BM</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dataDepo.length !== 0 && dataDepo.map(item => {
                                                return (
                                                <tr>
                                                    <th scope="row">{(dataDepo.indexOf(item) + (((pages.currentPage - 1) * pages.limitPerPage) + 1))}</th>
                                                    <td>{item.nama_area}</td>
                                                    <td>{item.kode_plant}</td>
                                                    <td>{dataStock.find(({kode_plant}) => kode_plant === item.kode_plant) === undefined ? "" : moment(dataStock.find(({kode_plant}) => kode_plant === item.kode_plant).tanggalStock).format('DD MMMM YYYY')}</td>
                                                    <td>{dataStock.find(({kode_plant}) => kode_plant === item.kode_plant) === undefined ? "" : dataStock.find(({kode_plant}) => kode_plant === item.kode_plant).no_stock}</td>
                                                    {level === '2' ? (
                                                        <>
                                                            <td>{dataStock.find(({kode_plant}) => kode_plant === item.kode_plant) === undefined ? "" : <AiOutlineCheck color="primary" size={20} />}</td>
                                                            <td>{dataStock.find(({kode_plant}) => kode_plant === item.kode_plant) === undefined ? "" : <AiOutlineCheck color="primary" size={20} />}</td>
                                                        </>
                                                    ) : (
                                                        <td>{dataStock.find(({kode_plant}) => kode_plant === item.kode_plant) === undefined ? "" : dataStock.find(({kode_plant}) => kode_plant === item.kode_plant).appForm.find(({status}) => status === 0) !== undefined ? 'Reject ' + dataStock.find(({kode_plant}) => kode_plant === item.kode_plant).appForm.find(({status}) => status === 0).jabatan : dataStock.find(({kode_plant}) => kode_plant === item.kode_plant).appForm.find(({status}) => status === 1) !== undefined ? 'Approve ' + dataStock.find(({kode_plant}) => kode_plant === item.kode_plant).appForm.find(({status}) => status === 1).jabatan : '-'}</td>
                                                    )}
                                                    <td>{item.nama_om}</td>
                                                    <td>{item.nama_bm}</td>
                                                    <td>
                                                        <Button size='small' className='mb-2 btnprev' color="primary" disabled={dataStock.find(({kode_plant}) => kode_plant === item.kode_plant) === undefined ? true : false} onClick={() => {this.getDetailStock(dataStock.find(({kode_plant}) => kode_plant === item.kode_plant)); this.getApproveStock({nama: item.kode_plant.split('').length === 4 ? 'stock opname' : 'stock opname HO', no: dataStock.find(({kode_plant}) => kode_plant === item.kode_plant).no_stock})}}>Preview</Button>
                                                        <Button className='btnprev' size='small' color="success" onClick={() => this.getDokumentasi({no: dataStock.find(({kode_plant}) => kode_plant === item.kode_plant) === undefined ? '' : dataStock.find(({kode_plant}) => kode_plant === item.kode_plant).no_stock})} disabled={dataStock.find(({kode_plant}) => kode_plant === item.kode_plant) === undefined ? true : false}>Download</Button>
                                                    </td>
                                                </tr>
                                                )})}
                                        </tbody>
                                    </Table>
                                </div>
                            )}
                            <div>
                                <div className={style.infoPageEmail1}>
                                    <text>Showing {page.currentPage} of {page.pages} pages</text>
                                    <div className={style.pageButton}>
                                        <button className={style.btnPrev} color="info" disabled={page.prevLink === null ? true : false} onClick={this.prev}>Prev</button>
                                        <button className={style.btnPrev} color="info" disabled={page.nextLink === null ? true : false} onClick={this.next}>Next</button>
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
                        <h2 className={styleTrans.pageTitle}>Monitoring Stock Opname Asset</h2>
                        <div className={styleTrans.searchContainer}>
                            <Button size="lg" color='primary' disabled={listMon.length === 0 ? true : false} onClick={this.downloadMonitoring}>Download</Button>
                            <select value={this.state.filter} onChange={e => this.changeFilter(e.target.value)} className={styleTrans.searchInput}>
                                <option value="all">All</option>
                                <option value="sent">Sent</option>
                                {/* <option value="available">Available To Approve</option> */}
                                <option value="reject">Rejected</option>
                                <option value="selesai">Finished</option>
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
                                {this.state.time === 'pilih' ?  (
                                    <>
                                        <div className='rowCenter'>
                                            <text className='bold'>:</text>
                                            <Input
                                                type= "date" 
                                                className="inputRinci"
                                                value={this.state.time1}
                                                onChange={e => this.selectTime({val: e.target.value, type: 'time1'})}
                                            />
                                            <text className='mr-1 ml-1'>To</text>
                                            <Input
                                                type= "date" 
                                                className="inputRinci"
                                                value={this.state.time2}
                                                onChange={e => this.selectTime({val: e.target.value, type: 'time2'})}
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
                            <input
                                type="text"
                                placeholder="Search..."
                                onChange={this.onSearch}
                                value={this.state.search}
                                onKeyPress={this.onSearch}
                                className={styleTrans.searchInput}
                            />
                        </div>

                        <table className={`${styleTrans.table} ${newStock.length > 0 ? styleTrans.tableFull : ''}`}>
                            <thead>
                                <tr>
                                    <th>
                                        <Input 
                                            addon
                                            type="checkbox"
                                            className='mr-3'
                                            checked={listMon.length === newStock.length ? true : false}
                                            onClick={listMon.length === newStock.length ? () => this.monRej('all') : () => this.monApp('all')}
                                        />
                                    </th>
                                    <th>No</th>
                                    <th>No Stock Opname</th>
                                    <th>Kode Area</th>
                                    <th>Area</th>
                                    <th>Tanggal Stock Opname</th>
                                    {level === '2' && (
                                        <>
                                            {/* <th>Status Approve</th> */}
                                            <th>Dokumentasi Aset</th>
                                        </>
                                    )}
                                    <th>Nama ROM</th>
                                    <th>Nama BM</th>
                                    <th>APPROVED BY</th>
                                    <th>TGL APPROVED</th>
                                    <th>STATUS WAKTU</th>
                                    {/* <th>STATUS</th> */}
                                    <th>OPSI</th>
                                </tr>
                            </thead>
                            <tbody>
                                {newStock.length > 0 && newStock.map((item, index) => {
                                    return (
                                        item.status_form === 'false' ? (
                                        <tr className={item.status_form === 0 ? 'fail' : item.status_reject === 0 ? 'note' : item.status_reject === 1 && 'bad'}>
                                            <td> 
                                                <Input
                                                    addon
                                                    checked={listMon.find(element => element === item.kode_plant) ? true : false}
                                                    type="checkbox"
                                                    onClick={listMon.find(element => element === item.kode_plant) === undefined ? () => this.monApp(item.kode_plant) : () => this.monRej(item.kode_plant)}
                                                />
                                            </td>
                                            <td>{index + 1}</td>
                                            <td>-</td>
                                            <td className='tdPlant'>{item.kode_plant}</td>
                                            <td className='tdArea'>{item.nama_area}</td>
                                            <td className='tdTime'>-</td>
                                            {level === '2' && (
                                                <>
                                                    {/* <td>{parseInt(item.status_form) > 1 ? 'Full Approve' : item.history !== null && item.history.split(',').reverse()[0]}</td> */}
                                                    <td>{'-'}</td>
                                                </>
                                            )}
                                            <td className='tdPlant'>{item.nama_om}</td>
                                            <td className='tdPlant'>{item.nama_bm}</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>Belum Mengajukan Stock Opname</td>
                                            {/* <td>{item.history !== null && item.history.split(',').reverse()[0]}</td> */}
                                            <td className='tdOpsi'>
                                                -
                                            </td>
                                        </tr>
                                        ) : (
                                        <tr className={item.status_form === 0 ? 'fail' : item.status_reject === 0 ? 'note' : item.status_reject === 1 && 'bad'}>
                                            <td> 
                                                <Input
                                                    addon
                                                    checked={listMon.find(element => element === item.kode_plant) ? true : false}
                                                    type="checkbox"
                                                    onClick={listMon.find(element => element === item.kode_plant) === undefined ? () => this.monApp(item.kode_plant) : () => this.monRej(item.kode_plant)}
                                                />
                                            </td>
                                            <td>{index + 1}</td>
                                            <td>{item.no_stock}</td>
                                            <td className='tdPlant'>{item.kode_plant}</td>
                                            <td className='tdArea'>{item.depo === null ? '' : item.area === null ? `${item.depo.nama_area} ${item.depo.channel}` : item.area}</td>
                                            <td className='tdTime'>{moment(item.tanggalStock).format('DD MMMM YYYY')}</td>
                                            {level === '2' && (
                                                <>
                                                    {/* <td>{parseInt(item.status_form) > 1 ? 'Full Approve' : item.history !== null && item.history.split(',').reverse()[0]}</td> */}
                                                    <td>{<AiOutlineCheck color="primary" size={20} />}</td>
                                                </>
                                            )}
                                            <td className='tdPlant'>{item.depo === null ? '-' :  `${item.depo.nama_om}`}</td>
                                            <td className='tdPlant'>{item.depo === null ? '-' :  `${item.depo.nama_bm}`}</td>
                                            <td>{item.appForm !== null && item.appForm.length > 0 && item.appForm.find(item => item.status === 1) !== undefined ? item.appForm.find(item => item.status === 1).nama + ` (${item.appForm.find(item => item.status === 1).jabatan === 'area' ? 'AOS' : item.appForm.find(item => item.status === 1).jabatan})` : '-' }</td>
                                            <td>{item.appForm !== null && item.appForm.length > 0 && item.appForm.find(item => item.status === 1) !== undefined ? moment(item.appForm.find(item => item.status === 1).updatedAt).format('DD/MM/YYYY HH:mm:ss') : '-' }</td>
                                            <td>{moment(item.tanggalStock).format('DD') > 5 && moment(item.tanggalStock).format('DD') < 26 ? 'TELAT' : 'Tepat Waktu'}</td>
                                            {/* <td>{item.history !== null && item.history.split(',').reverse()[0]}</td> */}
                                            <td className='tdOpsi'>
                                                <Button 
                                                color='primary' 
                                                className='mr-1 mt-1'
                                                onClick={() => this.getDetailStock(item)}>
                                                    Detail
                                                </Button>
                                                <Button className='mt-1' color='warning' onClick={() => this.getDetailTrack(item)}>Tracking</Button>
                                            </td>
                                        </tr>
                                        )
                                    )
                                })}
                            </tbody>
                        </table>
                        {newStock.length === 0 && (
                            <div className={style.spinCol}>
                                <AiOutlineInbox size={50} className='secondary mb-4' />
                                <div className='textInfo'>Data ajuan tidak ditemukan</div>
                            </div>
                        )}
                    </div>
                </div>
                <Modal isOpen={this.state.modalAdd} toggle={this.openModalAdd} size="lg">
                    <ModalHeader>
                        Tambah Data Asset
                    </ModalHeader>
                    {/* <Alert color="danger" className={style.alertWrong} isOpen={this.state.alert}>
                        <div>{alertM}</div>
                    </Alert> */}
                    <ModalBody>
                        <div className="mainRinci2">
                            <Formik
                            initialValues = {{
                                deskripsi: '',
                                merk: '',
                                satuan: '',
                                unit: 1,
                                lokasi: '',
                                grouping: '',
                                keterangan: '',
                            }}
                            validationSchema = {addStockSchema}
                            onSubmit={(values) => {this.addStock(values)}}
                            >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                                <div className="rightRinci2">
                                    <div>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Deskripsi</Col>
                                            <Col md={9} className="colRinci">:  <Input 
                                                type='text'
                                                className="inputRinci" 
                                                value={values.deskripsi}
                                                onBlur={handleBlur("deskripsi")}
                                                onChange={handleChange("deskripsi")}
                                                />
                                            </Col>
                                        </Row>
                                        {errors.deskripsi ? (
                                            <text className={style.txtError}>must be filled</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Merk</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                type= "text" 
                                                className="inputRinci"
                                                value={values.merk}
                                                onBlur={handleBlur("merk")}
                                                onChange={handleChange("merk")}
                                                />
                                            </Col>
                                        </Row>
                                        {errors.merk ? (
                                            <text className={style.txtError}>must be filled</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Satuan</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled={level === '5' || level === '9' ? false : true}
                                                type= "select" 
                                                className="inputRinci"
                                                value={values.satuan}
                                                onBlur={handleBlur("satuan")}
                                                onChange={handleChange("satuan")}
                                                >
                                                    <option>{values.satuan}</option>
                                                    <option>-Pilih Satuan-</option>
                                                    <option value="UNIT">UNIT</option>
                                                    <option value="PAKET">PAKET</option>
                                                </Input>
                                            </Col>
                                        </Row>
                                        {errors.satuan ? (
                                            <text className={style.txtError}>{errors.satuan}</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Unit</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled={level === '5' || level === '9' ? false : true}
                                                type= "text" 
                                                className="inputRinci"
                                                value={values.unit}
                                                onBlur={handleBlur("unit")}
                                                onChange={handleChange("unit")}
                                                />
                                            </Col>
                                        </Row>
                                        {errors.unit ? (
                                            <text className={style.txtError}>{errors.unit}</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Lokasi</Col>
                                            <Col md={9} className="colRinci">:
                                            <Input
                                                disabled={level === '5' || level === '9' ? false : true}
                                                type= "text" 
                                                className="inputRinci"
                                                value={values.lokasi}
                                                onBlur={handleBlur("lokasi")}
                                                onChange={handleChange("lokasi")}
                                                />
                                            </Col>
                                        </Row>
                                        {errors.lokasi ? (
                                            <text className={style.txtError}>{errors.lokasi}</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Status Fisik</Col>
                                            <Col md={9} className="colRinci">:  <Input 
                                                disabled={level === '5' || level === '9' ? false : true}
                                                type="select"
                                                className="inputRinci" 
                                                value={this.state.fisik} 
                                                onBlur={handleBlur("status_fisik")}
                                                onChange={e => { handleChange("status_fisik"); this.selectStatus(e.target.value, this.state.kondisi)} }
                                                >
                                                    {/* <option>{values.status_fisik}</option> */}
                                                    <option>-Pilih Status Fisik-</option>
                                                    <option value="ada">Ada</option>
                                                    {/* <option value="tidak ada">Tidak Ada</option> */}
                                                </Input>
                                            </Col>
                                        </Row>
                                        {this.state.fisik === '' ? (
                                            <text className={style.txtError}>Must be filled</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Kondisi</Col>
                                            <Col md={9} className="colRinci">:  <Input 
                                                disabled={level === '5' || level === '9' ? false : true}
                                                type="select"
                                                className="inputRinci" 
                                                value={this.state.kondisi} 
                                                onBlur={handleBlur("kondisi")}
                                                onChange={e => { handleChange("kondisi"); this.selectStatus(this.state.fisik, e.target.value)} }
                                                >
                                                    {/* <option>{values.kondisi}</option> */}
                                                    <option>-Pilih Kondisi-</option>
                                                    <option value="baik">Baik</option>
                                                    {/* <option value="rusak">Rusak</option>
                                                    <option value="">-</option> */}
                                                </Input>
                                            </Col>
                                        </Row>
                                        {this.state.kondisi === '' ? (
                                            <text className={style.txtError}>Must be filled</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Status Aset</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled={level === '5' || level === '9' ? false : true}
                                                type= "select" 
                                                className="inputRinci"
                                                value={values.grouping}
                                                onBlur={handleBlur("grouping")}
                                                onChange={handleChange("grouping")}
                                                // onClick={() => this.listStatus(detailAsset.no_asset)}
                                                >
                                                    <option>{values.grouping}</option>
                                                    {/* <option>-Pilih Status Aset-</option> */}
                                                    {dataStatus.length > 0 && dataStatus.map(item => {
                                                        return (
                                                            <option value={item.status}>{item.status}</option>
                                                        )
                                                    })}
                                                </Input>
                                            </Col>
                                        </Row>
                                        {errors.grouping ? (
                                            <text className={style.txtError}>Must be filled</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Keterangan</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled={level === '5' || level === '9' ? false : true}
                                                type= "text" 
                                                className="inputRinci"
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
                                    <ModalFooter>
                                        <Button className="btnFootRinci1 mr-3" size="md" disabled={level === '5' || level === '9' ? false : true} color="primary" onClick={handleSubmit}>Save</Button>
                                        <Button className="btnFootRinci1" size="md" color="secondary" onClick={() => this.openModalAdd()}>Close</Button>
                                    </ModalFooter>
                                </div>
                            )}
                            </Formik>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalUpload} toggle={this.openModalUpload} size="lg">
                    <ModalHeader>
                        Upload gambar asset
                    </ModalHeader>
                    <ModalBody>
                        <div className="mainRinci2">
                            <div className="leftRinci2 mb-5">
                                <div className="titRinci">{dataRinci.nama_asset}</div>
                                <img src={detRinci.img === undefined || detRinci.img.length === 0 ? placeholder : `${REACT_APP_BACKEND_URL}/${detRinci.img[detRinci.img.length - 1].path}`} className="imgRinci" />
                                <Input type="file" className='mt-2' onChange={this.uploadGambar}>Upload Picture</Input>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color='primary' onClick={this.openModalUpload}>Done</Button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.modalEdit} toggle={this.openModalEdit} size="lg">
                    <ModalHeader>
                        Rincian
                    </ModalHeader>
                    <ModalBody>
                        <div className="mainRinci2">
                            <div className="leftRinci2 mb-5">
                                <div className="titRinci">{dataRinci.nama_asset}</div>
                                <img src={detailAsset.pict === undefined || detailAsset.pict.length === 0 ? placeholder : `${REACT_APP_BACKEND_URL}/${detailAsset.pict[detailAsset.pict.length - 1].path}`} className="imgRinci" />
                                <Input type="file" className='mt-2' onChange={this.uploadPicture}>Upload Picture</Input>
                                {/* <div className="secImgSmall">
                                    <button className="btnSmallImg">
                                        <img src={placeholder} className="imgSmallRinci" />
                                    </button>
                                </div> */}
                            </div>
                            <Formik
                            initialValues = {{
                                merk: detailAsset.merk === null ? '' : detailAsset.merk,
                                satuan: detailAsset.satuan === null ? '' : detailAsset.satuan,
                                unit: 1,
                                lokasi: detailAsset.lokasi === null ? '' : detailAsset.lokasi,
                                keterangan: detailAsset.keterangan === null ? '' : detailAsset.keterangan,
                                status_fisik: detailAsset.status_fisik === null ? '' : detailAsset.status_fisik,
                                kondisi: detailAsset.kondisi === null ? '' : detailAsset.kondisi
                            }}
                            validationSchema = {stockSchema}
                            onSubmit={(values) => {this.updateAsset(values)}}
                            >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                                <div className="rightRinci2">
                                    <div>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>No Asset</Col>
                                            <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.no_asset} disabled /></Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Deskripsi</Col>
                                            <Col md={9} className="colRinci">:  <Input className="inputRinci" value={level === '5' || level === '9' ? dataRinci.nama_asset : dataRinci.deskripsi} disabled /></Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Merk</Col>
                                            <Col md={9} className="colRinci">:  <Input
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
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Satuan</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled={level === '5' || level === '9' ? false : true}
                                                type= "select" 
                                                className="inputRinci"
                                                value={values.satuan}
                                                onBlur={handleBlur("satuan")}
                                                onChange={handleChange("satuan")}
                                                >
                                                    <option>{values.satuan}</option>
                                                    <option>-Pilih Satuan-</option>
                                                    <option value="UNIT">UNIT</option>
                                                    <option value="PAKET">PAKET</option>
                                                </Input>
                                            </Col>
                                        </Row>
                                        {errors.satuan ? (
                                            <text className={style.txtError}>{errors.satuan}</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Unit</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled={level === '5' || level === '9' ? false : true}
                                                type= "text" 
                                                className="inputRinci"
                                                value={values.unit}
                                                onBlur={handleBlur("unit")}
                                                onChange={handleChange("unit")}
                                                />
                                            </Col>
                                        </Row>
                                        {errors.unit ? (
                                            <text className={style.txtError}>{errors.unit}</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Lokasi</Col>
                                            <Col md={9} className="colRinci">:
                                            <Input
                                                disabled={level === '5' || level === '9' ? false : true}
                                                type= "text" 
                                                className="inputRinci"
                                                value={values.lokasi}
                                                onBlur={handleBlur("lokasi")}
                                                onChange={handleChange("lokasi")}
                                                />
                                            </Col>
                                        </Row>
                                        {errors.lokasi ? (
                                            <text className={style.txtError}>{errors.lokasi}</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Status Fisik</Col>
                                            <Col md={9} className="colRinci">:  <Input 
                                                disabled={(level === '5' || level === '9') && (detailAsset.grouping === null || detailAsset.grouping === '') ? false : true}
                                                type="select"
                                                className="inputRinci" 
                                                value={detailAsset.fisik} 
                                                onBlur={handleBlur("status_fisik")}
                                                onChange={e => {handleChange("status_fisik"); this.updateCond({tipe: "status_fisik", val: e.target.value})}}
                                                // onChange={e => { handleChange("status_fisik"); this.selectStatus(e.target.value, this.state.kondisi)} }
                                                >
                                                    <option>{values.status_fisik}</option>
                                                    <option>-Pilih Status Fisik-</option>
                                                    <option value="ada">Ada</option>
                                                    <option value="tidak ada">Tidak Ada</option>
                                                </Input>
                                            </Col>
                                        </Row>
                                        {errors.status_fisik ? (
                                            <text className={style.txtError}>{errors.status_fisik}</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Kondisi</Col>
                                            <Col md={9} className="colRinci">:  <Input 
                                                disabled={(level === '5' || level === '9') && (detailAsset.grouping === null || detailAsset.grouping === '') ? false : true}
                                                type="select"
                                                className="inputRinci" 
                                                value={detailAsset.fisik} 
                                                onBlur={handleBlur("kondisi")}
                                                onChange={e => {handleChange("kondisi"); this.updateCond({tipe: "kondisi", val: e.target.value})}}
                                                // onChange={e => { handleChange("kondisi"); this.selectStatus(this.state.fisik, e.target.value)} }
                                                >
                                                    <option>{values.kondisi === "" ? "-" : values.kondisi}</option>
                                                    <option>-Pilih Kondisi-</option>
                                                    <option value="baik">Baik</option>
                                                    <option value="rusak">Rusak</option>
                                                    <option value="">-</option>
                                                </Input>
                                            </Col>
                                        </Row>
                                        {errors.kondisi ? (
                                            <text className={style.txtError}>{errors.kondisi}</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Status Aset</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled={level === '5' || level === '9' ? false : true}
                                                type= "select" 
                                                className="inputRinci"
                                                value={detailAsset.grouping}
                                                // onBlur={handleBlur("grouping")}
                                                // onChange={handleChange("grouping")}
                                                onClick={() => this.listStatus(detailAsset)}
                                                >
                                                    <option>{detailAsset.grouping}</option>
                                                    {/* <option>-Pilih Status Aset-</option> */}
                                                    {/* {dataStatus.length > 0 && dataStatus.map(item => {
                                                        return (
                                                            <option value={item.status}>{item.status}</option>
                                                        )
                                                    })} */}
                                                </Input>
                                            </Col>
                                        </Row>
                                        {detailAsset.grouping === null || detailAsset.grouping ===  "" ? (
                                            <text className={style.txtError}>Must be filled</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Keterangan</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled={level === '5' || level === '9' ? false : true}
                                                type= "text" 
                                                className="inputRinci"
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
                                    <ModalFooter>
                                        <Button className="btnFootRinci1 mr-3" size="md" disabled={(level === '5' || level === '9') && (detailAsset.grouping !== null && detailAsset.grouping !==  "") ? false : true} color="primary" onClick={handleSubmit}>Save</Button>
                                        <Button className="btnFootRinci1" size="md" color="secondary" onClick={() => this.openModalEdit()}>Close</Button>
                                    </ModalFooter>
                                </div>
                            )}
                            </Formik>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalStock} toggle={this.openModalStock} size="lg">
                    <ModalHeader>
                        Rincian
                    </ModalHeader>
                    <ModalBody>
                        <div className="mainRinci2">
                            <div className="leftRinci2 mb-5">
                                <div className="titRinci">{dataRinci.nama_asset}</div>
                                {detRinci.image !== undefined && detRinci.image !== null && detRinci.image !== '' ? (
                                    <img src={`${REACT_APP_BACKEND_URL}/${detRinci.image}`} className="imgRinci" />
                                ) : detRinci.pict === undefined || detRinci.pict.length === 0 ? (
                                    <img src={detRinci.img === undefined || detRinci.img.length === 0 ? placeholder : `${REACT_APP_BACKEND_URL}/${detRinci.img[detRinci.img.length - 1].path}`} className="imgRinci" />
                                ) : (
                                    <img src={detRinci.pict === undefined || detRinci.pict.length === 0 ? placeholder : `${REACT_APP_BACKEND_URL}/${detRinci.pict[detRinci.pict.length - 1].path}`} className="imgRinci" />
                                )}
                                {(level === '5' || level === '9') && (
                                    <Input type="file" className='mt-2' onChange={this.uploadGambar}>Upload Picture</Input>
                                )}
                                {/* <div className="secImgSmall">
                                    <button className="btnSmallImg">
                                        <img src={placeholder} className="imgSmallRinci" />
                                    </button>
                                </div> */}
                            </div>
                            <Formik
                            initialValues = {{
                                merk: detRinci.merk === null ? '' : detRinci.merk,
                                satuan: detRinci.satuan === null ? '' : detRinci.satuan,
                                unit: 1,
                                lokasi: detRinci.lokasi === null ? '' : detRinci.lokasi,
                                grouping: detRinci.grouping === null ? '' : detRinci.grouping,
                                keterangan: detRinci.keterangan === null ? '' : detRinci.keterangan,
                                status_fisik: detRinci.status_fisik === null ? '' : detRinci.status_fisik,
                                kondisi: detRinci.kondisi === null ? '' : detRinci.kondisi
                            }}
                            validationSchema = {stockSchema}
                            onSubmit={(values) => {this.updateAsset(values)}}
                            >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                                <div className="rightRinci2">
                                    <div>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>No Asset</Col>
                                            <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.no_asset} disabled /></Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Deskripsi</Col>
                                            <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.deskripsi} disabled /></Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Merk</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled={level === '5' || level === '9' ? false : true}
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
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Satuan</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled={level === '5' || level === '9' ? false : true}
                                                type= "select" 
                                                className="inputRinci"
                                                value={values.satuan}
                                                onBlur={handleBlur("satuan")}
                                                onChange={handleChange("satuan")}
                                                >
                                                    <option>{values.satuan}</option>
                                                    <option>-Pilih Satuan-</option>
                                                    <option value="UNIT">UNIT</option>
                                                    <option value="PAKET">PAKET</option>
                                                </Input>
                                            </Col>
                                        </Row>
                                        {errors.satuan ? (
                                            <text className={style.txtError}>{errors.satuan}</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Unit</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled={level === '5' || level === '9' ? false : true}
                                                type= "text" 
                                                className="inputRinci"
                                                value={values.unit}
                                                onBlur={handleBlur("unit")}
                                                onChange={handleChange("unit")}
                                                />
                                            </Col>
                                        </Row>
                                        {errors.unit ? (
                                            <text className={style.txtError}>{errors.unit}</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Lokasi</Col>
                                            <Col md={9} className="colRinci">:
                                            <Input
                                                disabled={level === '5' || level === '9' ? false : true}
                                                type= "text" 
                                                className="inputRinci"
                                                value={values.lokasi}
                                                onBlur={handleBlur("lokasi")}
                                                onChange={handleChange("lokasi")}
                                                />
                                            </Col>
                                        </Row>
                                        {errors.lokasi ? (
                                            <text className={style.txtError}>{errors.lokasi}</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Status Fisik</Col>
                                            <Col md={9} className="colRinci">:  <Input 
                                                disabled={level === '5' || level === '9' ? false : true}
                                                type="select"
                                                className="inputRinci" 
                                                value={detRinci.fisik} 
                                                onBlur={handleBlur("status_fisik")}
                                                // onChange={e => { handleChange("status_fisik"); this.selectStatus(e.target.value, this.state.kondisi)} }
                                                >
                                                    <option>{values.status_fisik}</option>
                                                    <option>-Pilih Status Fisik-</option>
                                                    <option value="ada">Ada</option>
                                                    <option value="tidak ada">Tidak Ada</option>
                                                </Input>
                                            </Col>
                                        </Row>
                                        {errors.status_fisik ? (
                                            <text className={style.txtError}>{errors.status_fisik}</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Kondisi</Col>
                                            <Col md={9} className="colRinci">:  <Input 
                                                disabled={level === '5' || level === '9' ? false : true}
                                                type="select"
                                                className="inputRinci" 
                                                value={values.kondisi} 
                                                onBlur={handleBlur("kondisi")}
                                                // onChange={e => { handleChange("kondisi"); this.selectStatus(this.state.fisik, e.target.value)} }
                                                >
                                                    <option>{values.kondisi}</option>
                                                    <option>-Pilih Kondisi-</option>
                                                    <option value="baik">Baik</option>
                                                    <option value="rusak">Rusak</option>
                                                    <option value="">-</option>
                                                </Input>
                                            </Col>
                                        </Row>
                                        {errors.kondisi ? (
                                            <text className={style.txtError}>{errors.kondisi}</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Status Aset</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled={level === '5' || level === '9' ? false : true}
                                                type= "select" 
                                                className="inputRinci"
                                                value={values.grouping}
                                                // onBlur={handleBlur("grouping")}
                                                // onChange={handleChange("grouping")}
                                                onClick={() => this.listStatus(detRinci)}
                                                >
                                                    <option>{values.grouping}</option>
                                                    {/* <option>-Pilih Status Aset-</option> */}
                                                    {/* {dataStatus.length > 0 && dataStatus.map(item => {
                                                        return (
                                                            <option value={item.status}>{item.status}</option>
                                                        )
                                                    })} */}
                                                </Input>
                                            </Col>
                                        </Row>
                                        {errors.grouping ? (
                                            <text className={style.txtError}>{errors.grouping}</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Keterangan</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled={level === '5' || level === '9' ? false : true}
                                                type= "text" 
                                                className="inputRinci"
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
                                    <ModalFooter>
                                        {detRinci.grouping === 'DIPINJAM SEMENTARA' ? (
                                            <Button className="btnFootRinci1 mr-3" color='success' size="md" onClick={this.openProsesModalDoc}>Dokumen</Button>
                                        ) : (
                                            <div></div>
                                        )}
                                        <Button className="btnFootRinci1 mr-3" size="md" disabled={level === '5' || level === '9' ? false : true} color="primary" onClick={handleSubmit}>Save</Button>
                                        <Button className="btnFootRinci1" size="md" color="secondary" onClick={() => this.openModalStock()}>Close</Button>
                                    </ModalFooter>
                                </div>
                            )}
                            </Formik>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalRinci} toggle={this.openModalRinci} size="xl" className='xl'>
                    <ModalBody>
                        <div>
                            <div className="stockTitle">kertas kerja opname aset kantor</div>
                            <div className="ptStock">pt. pinus merah abadi</div>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>kantor pusat/cabang</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={detailStock.length > 0 ? detailStock[0].area : ''} className="ml-3"  /></Col>
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>depo/cp</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={detailStock.length > 0 ? detailStock[0].area : ''} className="ml-3" /></Col>
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>opname per tanggal</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled className="ml-3" value={detailStock.length > 0 ? moment(detailStock[0].tanggalStock).format('DD MMMM YYYY') : ''} /></Col>
                            </Row>
                        </div>
                        {this.props.asset.stockDetail === false ? (
                            <div className={style.tableDashboard}>
                                <Table bordered responsive hover className={style.tab}>
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>NO. ASET</th>
                                            <th>DESKRIPSI</th>
                                            <th>MERK</th>
                                            <th>SATUAN</th>
                                            <th>UNIT</th>
                                            <th>KONDISI</th>
                                            <th>LOKASI</th>
                                            <th>GROUPING</th>
                                            <th>KETERANGAN</th>
                                        </tr>
                                    </thead>
                                </Table>
                                <div className={style.spin}>
                                        <Spinner type="grow" color="primary"/>
                                        <Spinner type="grow" className="mr-3 ml-3" color="success"/>
                                        <Spinner type="grow" color="warning"/>
                                        <Spinner type="grow" className="mr-3 ml-3" color="danger"/>
                                        <Spinner type="grow" color="info"/>
                                </div>
                            </div>
                        ) : (
                            <div className={style.tableDashboard}>
                            <Table bordered responsive hover className={style.tab}>
                                <thead>
                                    <tr>
                                        <th>
                                            <Input 
                                                addon
                                                type="checkbox"
                                                className='mr-3'
                                                disabled={this.state.filter === 'available' ? false : true}
                                                checked={listMut.length === detailStock.length ? true : false}
                                                onClick={listMut.length === detailStock.length ? () => this.chekRej('all') : () => this.chekApp('all')}
                                            />
                                            Select All
                                        </th>
                                        <th>No</th>
                                        <th>NO. ASET</th>
                                        <th>DESKRIPSI</th>
                                        <th>MERK</th>
                                        <th>SATUAN</th>
                                        <th>UNIT</th>
                                        <th>STATUS FISIK</th>
                                        <th>KONDISI</th>
                                        <th>LOKASI</th>
                                        <th>GROUPING</th>
                                        <th>KETERANGAN</th>
                                        <th>Picture</th>
                                        {/* <th>Status</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {detailStock.length !== 0 && detailStock.map((item, index) => {
                                        return (
                                        item.status_doc === 1 ? (
                                            null
                                        ) : (
                                            <tr>
                                                <td> 
                                                    <Input
                                                        addon
                                                        disabled={this.state.filter === 'available' ? false : true}
                                                        checked={listMut.find(element => element === item.id) ? true : false}
                                                        type="checkbox"
                                                        onClick={listMut.find(element => element === item.id) === undefined ? () => this.chekApp(item.id) : () => this.chekRej(item.id)}
                                                    />
                                                </td>
                                                <td onClick={() => this.getRinciStock(item)} scope="row">{index + 1}</td>
                                                <td onClick={() => this.getRinciStock(item)} >{item.no_asset}</td>
                                                <td onClick={() => this.getRinciStock(item)} >{item.deskripsi}</td>
                                                <td onClick={() => this.getRinciStock(item)} >{item.merk}</td>
                                                <td onClick={() => this.getRinciStock(item)} >{item.satuan}</td>
                                                <td onClick={() => this.getRinciStock(item)} >{item.unit}</td>
                                                <td onClick={() => this.getRinciStock(item)} >{item.status_fisik}</td>
                                                <td onClick={() => this.getRinciStock(item)} >{item.kondisi}</td>
                                                <td onClick={() => this.getRinciStock(item)} >{item.lokasi}</td>
                                                <td onClick={() => this.getRinciStock(item)} >{item.grouping}</td>
                                                <td onClick={() => this.getRinciStock(item)} >{item.keterangan}</td>
                                                <td onClick={() => this.getRinciStock(item)} >
                                                    {item.image !== '' && item.image !== null 
                                                    ? <div className="">
                                                        <img src={`${REACT_APP_BACKEND_URL}/${item.image}`} className="imgTable" />
                                                        <text className='textPict'>{moment(item.date_img).format('DD MMMM YYYY')}</text>
                                                    </div> 
                                                    : item.pict !== undefined && item.pict.length !== 0 
                                                    ? <div className="">
                                                        <img src={`${REACT_APP_BACKEND_URL}/${item.pict[item.pict.length - 1].path}`} className="imgTable" />
                                                        <text className='textPict'>{moment(item.pict[item.pict.length - 1].createdAt).format('DD MMMM YYYY')}</text>
                                                    </div> 
                                                    : item.img !== undefined && item.img.length !== 0 
                                                    ? <div className="">
                                                        <img src={`${REACT_APP_BACKEND_URL}/${item.img[item.img.length - 1].path}`} className="imgTable" />
                                                        <text className='textPict'>{moment(item.img[item.img.length - 1].createdAt).format('DD MMMM YYYY')}</text>
                                                    </div> : null
                                                    }
                                                </td>
                                                {/* <td>{item.status_app === 0 ? 'reject' : item.status_app === 1 ? 'revisi' : '-'}</td> */}
                                            </tr>
                                        )
                                        )})}
                                </tbody>
                            </Table>
                        </div>
                        )}
                        {detailStock.length !== 0 && detailStock.find(({status_doc}) => status_doc === 1) !== undefined && (
                            <>
                                <h3>Asset tambahan</h3>
                                <div className={style.tableDashboard}>
                                    <Table bordered responsive hover className={style.tab}>
                                        <thead>
                                            <tr>
                                                <th>Select</th>
                                                <th>No</th>
                                                <th>DESKRIPSI</th>
                                                <th>MERK</th>
                                                <th>SATUAN</th>
                                                <th>UNIT</th>
                                                <th>STATUS FISIK</th>
                                                <th>KONDISI</th>
                                                <th>LOKASI</th>
                                                <th>GROUPING</th>
                                                <th>KETERANGAN</th>
                                                {/* <th>Status</th> */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {detailStock.length !== 0 && detailStock.map((item, index) => {
                                                return (
                                                item.status_doc === 1 && (
                                                    <tr>
                                                        <td> 
                                                            <Input
                                                            addon
                                                            disabled={item.status_app === 0 ? true : false}
                                                            checked={item.status_app === 0 ? true : listMut.find(element => element === item.id) !== undefined ? true : false}
                                                            type="checkbox"
                                                            onClick={listMut.find(element => element === item.id) === undefined ? () => this.chekRej(item.id) : () => this.chekApp(item.id)}
                                                            value={item.no_asset} />
                                                        </td>
                                                        <td onClick={() => this.getRinciStock(item)} scope="row">*</td>
                                                        <td onClick={() => this.getRinciStock(item)} >{item.deskripsi}</td>
                                                        <td onClick={() => this.getRinciStock(item)} >{item.merk}</td>
                                                        <td onClick={() => this.getRinciStock(item)} >{item.satuan}</td>
                                                        <td onClick={() => this.getRinciStock(item)} >{item.unit}</td>
                                                        <td onClick={() => this.getRinciStock(item)} >{item.status_fisik}</td>
                                                        <td onClick={() => this.getRinciStock(item)} >{item.kondisi}</td>
                                                        <td onClick={() => this.getRinciStock(item)} >{item.lokasi}</td>
                                                        <td onClick={() => this.getRinciStock(item)} >{item.grouping}</td>
                                                        <td onClick={() => this.getRinciStock(item)} >{item.keterangan}</td>
                                                        {/* <td>{item.status_app === 0 ? 'reject' : item.status_app === 1 ? 'revisi' : '-'}</td> */}
                                                    </tr>
                                                )
                                                )})}
                                        </tbody>
                                    </Table>
                                </div>
                            </>
                        )}
                    </ModalBody>
                    <div className="modalFoot ml-3">
                        <div className='rowGeneral'>
                            <Button color="primary"  onClick={() => this.openPreview(dataItem)}>Download Kertas Kerja</Button>
                            <Button className='ml-2' color="success" onClick={() => this.getDokumentasi(detailStock[0])} >Download Dokumentasi</Button>
                        </div>
                        
                        <div className="btnFoot">
                        </div>
                    </div>
                </Modal>
                <Modal isOpen={this.state.modalPreview} toggle={this.openModalPreview} size="xl" className='xl'>
                    <ModalHeader>
                        Preview
                    </ModalHeader>
                    <ModalBody>
                        <div>
                            <div className="stockTitle">kertas kerja opname aset kantor</div>
                            <div className="ptStock">pt. pinus merah abadi</div>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>kantor pusat/cabang</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={detailStock.length > 0 ? detailStock[0].area : ''} className="ml-3"  /></Col>
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>depo/cp</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={detailStock.length > 0 ? detailStock[0].area : ''} className="ml-3" /></Col>
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>opname per tanggal</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled className="ml-3" value={detailStock.length > 0 ? moment(detailStock[0].tanggalStock).format('DD MMMM YYYY') : ''} /></Col>
                            </Row>
                        </div>
                        {this.props.asset.stockDetail === false ? (
                            <div className={style.tableDashboard}>
                                <Table bordered responsive hover className={style.tab}>
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>NO. ASET</th>
                                            <th>DESKRIPSI</th>
                                            <th>MERK</th>
                                            <th>SATUAN</th>
                                            <th>UNIT</th>
                                            <th>KONDISI</th>
                                            <th>LOKASI</th>
                                            <th>GROUPING</th>
                                            <th>KETERANGAN</th>
                                        </tr>
                                    </thead>
                                </Table>
                                <div className={style.spin}>
                                        <Spinner type="grow" color="primary"/>
                                        <Spinner type="grow" className="mr-3 ml-3" color="success"/>
                                        <Spinner type="grow" color="warning"/>
                                        <Spinner type="grow" className="mr-3 ml-3" color="danger"/>
                                        <Spinner type="grow" color="info"/>
                                </div>
                            </div>
                        ) : (
                            <div className={style.tableDashboard}>
                            <Table bordered responsive hover className={style.tab}>
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>NO. ASET</th>
                                        <th>DESKRIPSI</th>
                                        <th>MERK</th>
                                        <th>SATUAN</th>
                                        <th>UNIT</th>
                                        <th>KONDISI</th>
                                        <th>LOKASI</th>
                                        <th>GROUPING</th>
                                        <th>KETERANGAN</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detailStock.length !== 0 && detailStock.map(item => {
                                        return (
                                        <tr onClick={() => this.getRincian(item)}>
                                            <th scope="row">{(detailStock.indexOf(item) + (((page.currentPage - 1) * page.limitPerPage) + 1))}</th>
                                            <td>{item.no_asset}</td>
                                            <td>{item.deskripsi}</td>
                                            <td>{item.merk}</td>
                                            <td>{item.satuan}</td>
                                            <td>{item.unit}</td>
                                            <td>{item.kondisi}</td>
                                            <td>{item.lokasi}</td>
                                            <td>{item.grouping}</td>
                                            <td>{item.keterangan}</td>
                                        </tr>
                                        )})}
                                </tbody>
                            </Table>
                        </div>
                        )}
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
                                                    {stockApp.pembuat !== undefined && stockApp.pembuat.map(item => {
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
                                                {stockApp.pembuat !== undefined && stockApp.pembuat.map(item => {
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
                                                    {stockApp.pemeriksa !== undefined && stockApp.pemeriksa.length === 0 ? (
                                                        <th className="headPre">
                                                            <div className="mb-2">-</div>
                                                            <div>-</div>
                                                        </th>
                                                    ) : stockApp.pemeriksa !== undefined && stockApp.pemeriksa.map(item => {
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
                                                    {stockApp.pemeriksa !== undefined && stockApp.pemeriksa.length === 0 ? (
                                                        <td className="footPre">-</td>
                                                    ) : stockApp.pemeriksa !== undefined && stockApp.pemeriksa.map(item => {
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
                                                    {stockApp.penyetuju !== undefined && stockApp.penyetuju.map(item => {
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
                                                    {stockApp.penyetuju !== undefined && stockApp.penyetuju.map(item => {
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
                            <Button className="mr-2" color="warning" onClick={this.downloadForm}>
                                {/* <TableStock /> */}
                                Download
                            </Button>
                            <Button color="success" onClick={this.openModalPreview}>
                                Close
                            </Button>
                        </div>
                    </div>
                </Modal>
                <Modal isOpen={this.state.openReject} toggle={this.openModalReject} centered={true}>
                    <ModalBody>
                    <Formik
                    initialValues={{
                        alasan: "",
                    }}
                    validationSchema={alasanSchema}
                    onSubmit={(values) => {
                        // this.rejectStock(values)
                        this.prepReject(values)
                    }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                            <div className={style.modalApprove}>
                                <div className='mb-2 quest'>Anda yakin untuk reject ?</div>
                                <div className='mb-2 titStatus'>Pilih reject :</div>
                                <div className="ml-2">
                                    <Input
                                    addon
                                    type="checkbox"
                                    checked= {this.state.typeReject === 'perbaikan' ? true : false}
                                    onClick={this.state.typeReject === 'perbaikan' ? () => this.rejectRej('perbaikan') : () => this.rejectApp('perbaikan')}
                                    />  Perbaikan
                                </div>
                                <div className="ml-2">
                                    <Input
                                    addon
                                    type="checkbox"
                                    checked= {this.state.typeReject === 'pembatalan' ? true : false}
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
                                            checked= {this.state.menuRev === 'Revisi Area' ? true : false}
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
                                    checked= {listStat.find(element => element === 'Kondisi, status fisik, dan keterangan tidak sesuai') !== undefined ? true : false}
                                    onClick={listStat.find(element => element === 'Kondisi, status fisik, dan keterangan tidak sesuai') === undefined ? () => this.statusApp('Kondisi, status fisik, dan keterangan tidak sesuai') : () => this.statusRej('Kondisi, status fisik, dan keterangan tidak sesuai')}
                                    />  Kondisi, status fisik, dan keterangan tidak sesuai
                                </div>
                                <div className="ml-2">
                                    <Input
                                    addon
                                    type="checkbox"
                                    checked= {listStat.find(element => element === 'Photo asset tidak sesuai') !== undefined ? true : false}
                                    onClick={listStat.find(element => element === 'Photo asset tidak sesuai') === undefined ? () => this.statusApp('Photo asset tidak sesuai') : () => this.statusRej('Photo asset tidak sesuai')}
                                    />  Photo asset tidak sesuai
                                </div>
                                <div className="ml-2">
                                    <Input
                                    addon
                                    type="checkbox"
                                    checked= {listStat.find(element => element === 'Tambahan asset tidak sesuai') !== undefined ? true : false}
                                    onClick={listStat.find(element => element === 'Tambahan asset tidak sesuai') === undefined ? () => this.statusApp('Tambahan asset tidak sesuai') : () => this.statusRej('Tambahan asset tidak sesuai')}
                                    />  Tambahan asset tidak sesuai
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
                                    {listStat.length === 0 && (values.alasan.length < 3)? (
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
                <Modal isOpen={this.props.stock.isLoading || this.props.depo.isLoading || this.props.asset.isLoading || this.props.tempmail.isLoading || this.state.isLoading ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className={style.cekUpdate}>
                                <Spinner />
                                <div sucUpdate>Waiting....</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
                <Modal isOpen={this.state.openApprove && level !== '5'} toggle={this.openModalApprove} centered={true}>
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
                                <Button color="primary" onClick={() => this.prepSendEmail('approve')}>Ya</Button>
                                <Button color="secondary" onClick={this.openModalApprove}>Tidak</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalSubmit} toggle={this.openModalSub} centered={true}>
                    <ModalBody>
                        <div className={style.modalApprove}>
                            <div>
                                <text>
                                    Anda yakin untuk submit     
                                    <text className={style.verif}> </text>
                                    pada tanggal
                                    <text className={style.verif}> {moment().format('LL')}</text> ?
                                </text>
                            </div>
                            <div className={style.btnApprove}>
                                <Button color="primary" 
                                onClick={
                                    // () => this.submitAset()
                                    () => this.prepSendEmail('asset')
                                }
                                >
                                    Ya
                                </Button>
                                <Button color="secondary" onClick={this.openModalSub}>Tidak</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.openApprove && (level === '5' || level === '9')} toggle={this.openModalApprove} centered={true}>
                    <ModalBody>
                        <div className={style.modalApprove}>
                            <div>
                                <text>
                                    Anda yakin untuk mengajukan  
                                    <text className={style.verif}> stock opname </text>
                                    pada tanggal
                                    <text className={style.verif}> {moment().format('DD MMMM YYYY')}</text> ?
                                </text>
                            </div>
                            <div className={style.btnApprove}>
                                <Button color="primary" onClick={() => this.submitStock()}>Ya</Button>
                                <Button color="secondary" onClick={this.openModalApprove}>Tidak</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.openConfirm} toggle={this.openModalConfirm} centered={true}>
                    <ModalBody>
                        <div className={style.modalApprove}>
                            <div>
                                <text>
                                    Apakah anda ingin menambahkan data asset yang lain ?
                                </text>
                            </div>
                            <div className={style.btnApprove}>
                                <Button color="primary" onClick={() => this.openModalSum()}>Ya</Button>
                                <Button color="secondary" onClick={() => {this.openModalConfirm(); this.openModalApprove()}}>Tidak</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.submitPre} toggle={this.modalSubmitPre} size="xl" className='xl'>
                    <ModalBody>
                        <div>
                            <div className="stockTitle">kertas kerja opname aset kantor</div>
                            <div className="ptStock">pt. pinus merah abadi</div>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>kantor pusat/cabang</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input value={detailDepo.nama_area} className="ml-3"  /></Col>
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>depo/cp</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input value={detailDepo.nama_area} className="ml-3" /></Col>
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>opname per tanggal</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input value={moment().format('LL')} className="ml-3"  /></Col>
                            </Row>
                        </div>
                        {dataAsset.length === 0 ? (
                            <div className={style.tableDashboard}>
                                <Table bordered responsive hover className={style.tab}>
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>NO. ASET</th>
                                            <th>DESKRIPSI</th>
                                            <th>MERK</th>
                                            <th>SATUAN</th>
                                            <th>UNIT</th>
                                            <th>KONDISI</th>
                                            <th>LOKASI</th>
                                            <th>GROUPING</th>
                                            <th>KETERANGAN</th>
                                        </tr>
                                    </thead>
                                </Table>
                                <div className={style.spin}>
                                        <Spinner type="grow" color="primary"/>
                                        <Spinner type="grow" className="mr-3 ml-3" color="success"/>
                                        <Spinner type="grow" color="warning"/>
                                        <Spinner type="grow" className="mr-3 ml-3" color="danger"/>
                                        <Spinner type="grow" color="info"/>
                                </div>
                            </div>
                        ) : (
                            <div className={style.tableDashboard}>
                            <Table bordered responsive hover className={style.tab}>
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>NO. ASET</th>
                                        <th>DESKRIPSI</th>
                                        <th>MERK</th>
                                        <th>SATUAN</th>
                                        <th>UNIT</th>
                                        <th>LOKASI</th>
                                        <th>STATUS FISIK</th>
                                        <th>KONDISI</th>
                                        <th>STATUS ASET</th>
                                        <th>KETERANGAN</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataAsset.length !== 0 && dataAsset.map(item => {
                                        return (
                                        <tr onClick={() => this.getRincian(item)}>
                                            <th scope="row">{(dataAsset.indexOf(item) + (((page.currentPage - 1) * page.limitPerPage) + 1))}</th>
                                            <td>{item.no_asset}</td>
                                            <td>{level === '5' || level === '9' ? item.nama_asset : item.deskripsi}</td>
                                            <td>{item.merk}</td>
                                            <td>{item.satuan}</td>
                                            <td>{item.unit}</td>
                                            <td>{item.lokasi}</td>
                                            <td>{item.status_fisik}</td>
                                            <td>{item.kondisi}</td>
                                            <td>{item.grouping}</td>
                                            <td>{item.keterangan}</td>
                                        </tr>
                                        )})}
                                </tbody>
                            </Table>
                        </div>
                        )}
                    </ModalBody>
                    {/* <Alert color="danger" className={style.alertWrong} isOpen={this.state.alert}>
                        <div>{alertM}</div>
                    </Alert> */}
                    <div className="modalFoot ml-3">
                        <div></div>
                        <div className="btnFoot">
                            <Button className="mr-2" color="success" onClick={this.openModalConfirm}>
                                Submit
                            </Button>
                        </div>
                    </div>
                </Modal>
                <Modal size='xl' isOpen={this.state.opendok} toggle={this.openModalDok} className='xl'>
                    <ModalBody>
                        {dataExp.length === 0 ? (
                            <div className={style.tableDashboard}>
                                <Table bordered responsive hover className={style.tab}>
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>NO. ASET</th>
                                            <th>DESKRIPSI</th>
                                            <th>SATUAN</th>
                                            <th>KONDISI</th>
                                            <th>GROUPING</th>
                                            <th>PICTURE</th>
                                        </tr>
                                    </thead>
                                </Table>
                                <div className={style.spin}>
                                        <Spinner type="grow" color="primary"/>
                                        <Spinner type="grow" className="mr-3 ml-3" color="success"/>
                                        <Spinner type="grow" color="warning"/>
                                        <Spinner type="grow" className="mr-3 ml-3" color="danger"/>
                                        <Spinner type="grow" color="info"/>
                                </div>
                            </div>
                        ) : (
                            <div className={style.tableDashboard}>
                            <Table bordered responsive hover className={style.tab} id="table-to-xls">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>NO. ASET</th>
                                        <th>DESKRIPSI</th>
                                        <th>PLANT</th>
                                        <th>AREA</th>
                                        <th>SATUAN</th>
                                        <th>KONDISI</th>
                                        <th>GROUPING</th>
                                        <th style={{width: 200}}>PICTURE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataExp.length !== 0 && dataExp.map(item => {
                                        return (
                                        <tr onClick={() => this.getRincian(item)}>
                                            <th scope="row">{(dataExp.indexOf(item) + 1)}</th>
                                            <td>{item.no_asset}</td>
                                            <td>{level === '5' || level === '9' ? item.nama_asset : item.deskripsi}</td>
                                            <td>{item.kode_plant}</td>
                                            <td>{item.area}</td>
                                            <td>{item.satuan}</td>
                                            <td>{item.kondisi}</td>
                                            <td>{item.grouping}</td>
                                            <td style={{height: 200}}>
                                                {item.image !== null && item.image.length !== '' 
                                                ? <img src={`${REACT_APP_BACKEND_URL}/${item.image}`} style={{objectFit: 'cover'}} height={'auto'} width={200} />
                                                : item.pict !== undefined && item.pict.length !== 0 
                                                ? <img src={`${REACT_APP_BACKEND_URL}/${item.pict[item.pict.length - 1].path}`} style={{objectFit: 'cover'}} height={'auto'} width={200} />
                                                : item.img !== undefined && item.img.length !== 0 
                                                ? <img src={`${REACT_APP_BACKEND_URL}/${item.img[item.img.length - 1].path}`} style={{objectFit: 'cover'}} height={'auto'} width={200} />
                                                : null
                                                }
                                            </td>
                                        </tr>
                                        )})}
                                </tbody>
                            </Table>
                        </div>
                        )}
                    </ModalBody>
                    <hr />
                    <div className="modalFoot ml-3">
                        <div></div>
                        <div className="btnFoot">
                            <Button className='mr-1' color='success' onClick={this.downloadDokumentasi}>Download</Button>
                            <Button color="warning" onClick={this.openModalDok}>
                                Close
                            </Button>
                        </div>
                    </div>
                </Modal>
                <Modal isOpen={this.state.modalSum} toggle={this.openSum} size="xl">
                    <ModalHeader>
                        <div className="stockTitle">asset tambahan</div>
                    </ModalHeader>
                    <ModalBody>
                        <div className={style.headEmail}>
                            <Button onClick={this.openModalAdd} color="primary" size="lg">Add</Button>
                        </div>
                        {stockArea.length === 0 ? (
                            <div className={style.tableDashboard}>
                                <Table bordered responsive hover className={style.tab}>
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>DESKRIPSI</th>
                                            <th>MERK</th>
                                            <th>SATUAN</th>
                                            <th>UNIT</th>
                                            <th>STATUS FISIK</th>
                                            <th>KONDISI</th>
                                            <th>LOKASI</th>
                                            <th>GROUPING</th>
                                            <th>KETERANGAN</th>
                                        </tr>
                                    </thead>
                                </Table>
                                <div className={style.spin}>
                                    <h3>Tidak ada data asset tambahan</h3>
                                </div>
                            </div>
                        ) : (
                            <div className={style.tableDashboard}>
                            <Table bordered responsive hover className={style.tab}>
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>DESKRIPSI</th>
                                        <th>MERK</th>
                                        <th>SATUAN</th>
                                        <th>UNIT</th>
                                        <th>STATUS FISIK</th>
                                        <th>KONDISI</th>
                                        <th>LOKASI</th>
                                        <th>GROUPING</th>
                                        <th>KETERANGAN</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stockArea.length !== 0 && stockArea.map(item => {
                                        return (
                                            item.status_doc === 1 && (
                                                <tr onClick={() => this.getRinciStock(item)}>
                                                    <th scope="row">{stockArea.indexOf(item) + 1}</th>
                                                    <td>{item.deskripsi}</td>
                                                    <td>{item.merk}</td>
                                                    <td>{item.satuan}</td>
                                                    <td>{item.unit}</td>
                                                    <td>{item.status_fisik}</td>
                                                    <td>{item.kondisi}</td>
                                                    <td>{item.lokasi}</td>
                                                    <td>{item.grouping}</td>
                                                    <td>{item.keterangan}</td>
                                                </tr>
                                            )
                                        )})}
                                </tbody>
                            </Table>
                        </div>
                        )}
                    </ModalBody>
                    {/* <Alert color="danger" className={style.alertWrong} isOpen={this.state.alert}>
                        <div>{alertM}</div>
                    </Alert> */}
                    <div className="modalFoot ml-3">
                        <div></div>
                        <div className="btnFoot">
                            <Button className="mr-2" color="success" onClick={this.openModalApprove}>
                                Submit
                            </Button>
                        </div>
                    </div>
                </Modal>
                <Modal isOpen={this.state.openStatus} toggle={this.modalStatus}>
                    <Alert color="danger" className={style.alertWrong} isOpen={this.state.stat === 'DIPINJAM SEMENTARA' && (dataDoc.length === 0 || dataDoc.find(({status}) => status === 1) === undefined) ? true : false}>
                        <div>Mohon upload dokumen terlebih dahulu</div>
                    </Alert>
                    <ModalBody>
                        <div className='mb-2 titStatus'>Pilih Status Aset</div>
                        {dataStatus.length > 0 ? dataStatus.map(item => {
                            return (
                                <div className="ml-2">
                                    <Input
                                    addon
                                    // disabled={listMut.find(element => element === dataRinci.no_asset) === undefined ? false : true}
                                    type="checkbox"
                                    checked= {this.state.stat === item.status ? true : false}
                                    onClick={() => {this.setState({stat: item.status}); this.cekStatus(item.status)}}
                                    value={item.status} />  {item.status}
                                </div>
                            )
                        }) : (
                            <div>Tidak ada opsi mohon pilih ulang kondisi atau status fisik</div>
                        )}
                        {dataStatus.length > 0 && (
                            <div className="ml-2">
                                <Input
                                addon
                                // disabled={listMut.find(element => element === dataRinci.no_asset) === undefined ? false : true}
                                type="checkbox"
                                checked= {this.state.stat === 'null' ? true : false}
                                onClick={() => {this.setState({stat: 'null'}); this.cekStatus('null')}}
                                value={'null'} /> RESET (Untuk bisa memilih ulang kondisi atau status fisik)
                            </div>
                        )}
                        {/* <div className="footRinci4 mt-4">
                            <Button color="primary" disabled={this.state.stat === '' || this.state.stat === null ? true : false} onClick={this.updateStatus}>Save</Button>
                            <Button className="ml-3" color="secondary" onClick={() => this.modalStatus()}>Close</Button>
                        </div> */}
                        <div className="modalFoot mt-3">
                            <div className="btnFoot">
                            {this.state.stat === 'DIPINJAM SEMENTARA' ? (
                                <Button color='success' onClick={this.openProsesModalDoc}>Upload dokumen</Button>
                            ) : (
                                <Button color="secondary" onClick={() => this.modalStatus()}>Close</Button>
                            )}
                            </div>
                            <div className="btnFoot">
                                {this.state.stat === 'DIPINJAM SEMENTARA' && (dataDoc.length === 0 || dataDoc.find(({status}) => status === 1) === undefined) ? (
                                    // <Button color="primary" disabled>Save</Button>
                                    <div></ div>
                                ) : dataStatus.length === 0 ? (
                                    <div></ div>
                                ) : (
                                    <Button color="primary" disabled={this.state.stat === '' || this.state.stat === null ? true : false} onClick={this.updateStatus}>Save</Button>
                                )}
                                {this.state.stat === 'DIPINJAM SEMENTARA' ? (
                                    <Button className="ml-3" color="secondary" onClick={() => this.modalStatus()}>Close</Button>
                                ) : (
                                    <div></div>
                                )}
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalConfirm} toggle={this.openConfirm}>
                <ModalBody>
                    {this.state.confirm === 'approve' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Update</div>
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
                    ) : this.state.confirm === 'isApprove' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Approve</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'submit' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Submit</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'falseCancel' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Reject</div>
                                <div className="errApprove mt-2">Reject pembatalan hanya bisa dilakukan jika semua data ajuan terceklis</div>
                            </div>
                        </div>
                    ) : (
                        <div></div>
                    )}
                </ModalBody>
            </Modal>
            <Modal isOpen={this.state.formDis} toggle={() => {this.openModalDis(); this.showCollap('close')}} size="xl">
                {/* <Alert color="danger" className={style.alertWrong} isOpen={detailMut.find(({status_form}) => status_form === 26) === undefined ? false : true}>
                    <div>Data Penjualan Asset Sedang Dilengkapi oleh divisi purchasing</div>
                </Alert> */}
                <ModalBody>
                    <Row className='trackTitle ml-4'>
                        <Col>
                            Tracking Stock Opname Asset
                        </Col>
                    </Row>
                    <Row className='ml-4 mb-2 trackSub'>
                        <Col md={2}>
                            Kode Area
                        </Col>
                        <Col md={10}>
                        : {detailStock[0] === undefined ? '' : detailStock[0].kode_plant}
                        </Col>
                    </Row>
                    <Row className='ml-4 mb-2 trackSub'>
                        <Col md={2}>
                            Area
                        </Col>
                        <Col md={10}>
                        : {detailStock[0] === undefined ? '' : detailStock[0].area}
                        </Col>
                    </Row>
                    <Row className='ml-4 mb-2 trackSub'>
                        <Col md={2}>
                        No Stock Opname
                        </Col>
                        <Col md={10}>
                        : {detailStock[0] === undefined ? '' : detailStock[0].no_stock}
                        </Col>
                    </Row>
                    <Row className='ml-4 trackSub'>
                        <Col md={2}>
                        Tanggal Pengajuan
                        </Col>
                        <Col md={10}>
                        : {detailStock[0] === undefined ? '' : moment(detailStock[0].tanggalStock === null ? detailStock[0].createdAt : detailStock[0].tanggalStock).locale('idn').format('DD MMMM YYYY ')}
                        </Col>
                    </Row>
                    <Row className='mt-2 ml-4 trackSub1'>
                        <Col md={12}>
                            <Button color='success' size='md' onClick={this.openHistory}>Full History</Button>
                        </Col>
                    </Row>
                    <div class="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
                        <div class="step completed">
                            <div class="step-icon-wrap">
                                <button class="step-icon" onClick={() => this.showCollap('Submit')} ><FiSend size={40} className="center1" /></button>
                            </div>
                            <h4 class="step-title">Submit Stock Opname</h4>
                        </div>
                        <div class={detailStock[0] === undefined ? 'step' : detailStock[0].status_form > 2 ? "step completed" : 'step'} >
                            <div class="step-icon-wrap">
                                <button class="step-icon" onClick={() => this.showCollap('Pengajuan')}><MdAssignment size={40} className="center" /></button>
                            </div>
                            <h4 class="step-title">Pengajuan Stock Opname</h4>
                        </div> 
                        <div class={detailStock[0] === undefined ? 'step' : detailStock[0].status_form !== 9 && detailStock[0].status_form >= 8 ? "step completed" : 'step'}>
                            <div class="step-icon-wrap">
                                <button class="step-icon" onClick={() => this.showCollap('Eksekusi')}><FiTruck size={40} className="center" /></button>
                            </div>
                            <h4 class="step-title">Terima Stock Opname</h4>
                        </div>
                        <div class={detailStock[0] === undefined ? 'step' : detailStock[0].status_form === 8 ? "step completed" : 'step'}>
                            <div class="step-icon-wrap">
                                <button class="step-icon"><AiOutlineCheck size={40} className="center" /></button>
                            </div>
                            <h4 class="step-title">Selesai</h4>
                        </div>
                    </div>
                    <Collapse isOpen={this.state.collap} className="collapBody">
                        <Card className="cardCollap">
                            <CardBody>
                                <div className='textCard1'>{this.state.tipeCol} Stock Opname</div>
                                {this.state.tipeCol === 'submit' ? (
                                    <div>Tanggal submit : {detailStock[0] === undefined ? '' : moment(detailStock[0].tanggalStock === null ? detailStock[0].createdAt : detailStock[0].tanggalStock).locale('idn').format('DD MMMM YYYY ')}</div>
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
                                            <th>Status Fisik</th>
                                            <th>Kondisi</th>
                                            <th>Status Aset</th>
                                            <th>Keterangan</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {detailStock.length !== 0 && detailStock.map(item => {
                                            return (
                                                <tr>
                                                    <th scope="row">{detailStock.indexOf(item) + 1}</th>
                                                    <td>{item.no_asset}</td>
                                                    <td>{item.nama_asset}</td>
                                                    <td>{item.merk}</td>
                                                    <td>{item.kategori}</td>
                                                    <td>{item.status_fisik}</td>
                                                    <td>{item.kondisi}</td>
                                                    <td>{item.grouping}</td>
                                                    <td>{item.keterangan}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </Table>
                                {detailStock[0] === undefined || this.state.tipeCol === 'Submit' ? (
                                    <div></div>
                                ) : (
                                    <div>
                                        <div className="mb-4 mt-2">Tracking {this.state.tipeCol} :</div>
                                        {this.state.tipeCol === 'Pengajuan' ? (
                                            <div class="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
                                                {detailStock[0] !== undefined && detailStock[0].appForm.length && detailStock[0].appForm.slice(0).map(item => {
                                                    return (
                                                        <div class={item.status === 1 ? 'step completed' : item.status === 0 ? 'step reject' : 'step'}>
                                                            <div class="step-icon-wrap">
                                                            <button class="step-icon"><FaFileSignature size={30} className="center2" /></button>
                                                            </div>
                                                            <h5 class="step-title">{moment(item.updatedAt).format('DD-MM-YYYY')} </h5>
                                                            <h4 class="step-title">{item.jabatan}</h4>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        ) :  this.state.tipeCol === 'Eksekusi' && (
                                            <div class="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
                                                <div class={detailStock[0] === undefined ? 'step' : detailStock[0].status_form !== 9 && detailStock[0].status_form > 2 ? "step completed" : 'step'}>
                                                    <div class="step-icon-wrap">
                                                    <button class="step-icon" ><FaFileSignature size={30} className="center2" /></button>
                                                    </div>
                                                    <h4 class="step-title">Check Data Stock Opname</h4>
                                                </div>
                                                <div class={detailStock[0] === undefined ? 'step' : detailStock[0].status_form !== 9 && detailStock[0].status_form >= 8 ? "step completed" : 'step'}>
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
                    {/* <Button color="primary" onClick={() => this.openModPreview({nama: 'disposal pengajuan', no: detailMut[0] !== undefined && detailMut[0].no_stock})}>Preview</Button> */}
                    <div></div>
                    <div className="btnFoot">
                        <Button color="primary" onClick={() => {this.openModalDis(); this.showCollap('close')}}>
                            Close
                        </Button>
                    </div>
                </div>
            </Modal>
            <Modal isOpen={this.state.history} toggle={this.openHistory}>
                <ModalBody>
                    <div className='mb-4'>History Transaksi</div>
                    <div className='history'>
                        {detailStock.length > 0 && detailStock[0].history !== null && detailStock[0].history.split(',').map(item => {
                            return (
                                item !== null && item !== 'null' && 
                                <Button className='mb-2' color='info'>{item}</Button>
                            )
                        })}
                    </div>
                </ModalBody>
            </Modal>
            <Modal isOpen={this.state.alert} size="sm">
                <ModalBody>
                    <div>
                        <div className={style.cekUpdate}>
                            <AiOutlineClose size={80} className={style.red} />
                            <div className={[style.sucUpdate, style.green]}>{alertM}</div>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
            <Modal size="xl" isOpen={this.state.modalDoc} toggle={this.openModalDoc}>
                <ModalHeader>
                   Kelengkapan Dokumen
                </ModalHeader>
                <ModalBody>
                    <Container>
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
                                            <div className="colDoc">
                                                <input
                                                className="ml-4"
                                                type="file"
                                                onClick={() => this.setState({detail: x})}
                                                onChange={this.onChangeUpload}
                                                />
                                                <text className="txtError ml-4">Maximum file upload is 20 Mb</text>
                                            </div>
                                        </Col>
                                    ) : (
                                        <Col md={6} lg={6} className="colDoc">
                                            <input
                                            className="ml-4"
                                            type="file"
                                            onClick={() => this.setState({detail: x})}
                                            onChange={this.onChangeUpload}
                                            />
                                            <text className="txtError ml-4">Maximum file upload is 20 Mb</text>
                                        </Col>
                                    )}
                                </Row>
                            )
                        })}
                    </Container>
                </ModalBody>
                <ModalFooter>
                    <Button className="mr-2" color="secondary" onClick={this.openModalDoc}>
                        Close
                    </Button>
                    {this.state.stat === 'DIPINJAM SEMENTARA' && (dataDoc.length === 0 || dataDoc.find(({status}) => status === 1) === undefined) ? (
                        <Button color="primary" disabled onClick={this.updateStatus}>
                            Save 
                        </Button>
                    ) : this.state.stat === 'DIPINJAM SEMENTARA' && (
                        <Button color="primary" onClick={this.updateStatus}>
                            Save 
                        </Button>
                    )}
                    {this.state.stat !== 'DIPINJAM SEMENTARA' && (
                        <Button color="primary" onClick={this.openModalDoc}>
                            Save 
                        </Button>
                    )}
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
                                onClick={tipeEmail === 'approve' ? () => this.approveStock()
                                : tipeEmail === 'reject' ? () => this.rejectStock(this.state.dataRej)
                                : () => this.submitAset()} 
                                color="primary"
                            >
                               {tipeEmail === 'approve' ? 'Approve' : tipeEmail === 'reject' ? 'Reject' : 'Submit'} & Send Email
                            </Button>
                            <Button className="mr-3" onClick={this.openDraftEmail}>Cancel</Button>
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
                        <Button color="primary" onClick={() => this.setState({openPdf: false})}>Close</Button>
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
    depo: state.depo,
    stock: state.stock,
    report: state.report,
    user: state.user,
    notif: state.notif,
    tempmail: state.tempmail
})

const mapDispatchToProps = {
    logout: auth.logout,
    getAsset: asset.getAsset,
    getAssetAll: asset.getAssetAll,
    updateAsset: asset.updateAsset,
    updateAssetNew: asset.updateAssetNew,
    resetError: asset.resetError,
    nextPage: asset.nextPage,
    getDisposal: disposal.getDisposal,
    uploadDocumentDis: disposal.uploadDocumentDis,
    getNameApprove: approve.getNameApprove,
    getDetailDepo: depo.getDetailDepo,
    getDepo: depo.getDepo,
    submitStock: stock.submitStock,
    getStockAll: stock.getStockAll,
    getDetailStock: stock.getDetailStock,
    getApproveStock: stock.getApproveStock,
    deleteStock: stock.deleteStock,
    approveStock: stock.approveStock,
    rejectStock: stock.rejectStock,
    uploadPicture: stock.uploadPicture,
    getStatus: stock.getStatus,
    getStatusAll: stock.getStatusAll,
    resetStock: stock.resetStock,
    getDetailAsset: asset.getDetailAsset,
    getDocument: stock.getDocumentStock,
    cekDokumen: stock.cekDocumentStock,
    resetDis: disposal.reset,
    resetData: asset.resetData,
    updateStock: stock.updateStock,
    updateStockNew: stock.updateStockNew,
    getDetailItem: stock.getDetailItem,
    showDokumen: pengadaan.showDokumen,
    getStockArea: stock.getStockArea,
    addOpname: stock.addStock,
    uploadImage: stock.uploadImage,
    submitAsset: stock.submitAsset,
    exportStock: report.getExportStock,
    getRole: user.getRole,
    getDraftEmail: tempmail.getDraftEmail,
    sendEmail: tempmail.sendEmail,
    notifStock: notif.notifStock,
    addNewNotif: newnotif.addNewNotif,
}

export default connect(mapStateToProps, mapDispatchToProps)(Stock)
