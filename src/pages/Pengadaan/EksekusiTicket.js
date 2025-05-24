/* eslint-disable jsx-a11y/no-distracting-elements */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react'
import { Container, NavbarBrand, Table, Input, Button, Col, Collapse, Card,
    Alert, Spinner, Row, Modal, ModalBody, ModalHeader, ModalFooter, CardBody,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap'
import style from '../../assets/css/input.module.css'
import {FaSearch, FaUserCircle, FaBars, FaCartPlus, FaFileSignature} from 'react-icons/fa'
import {BsCircle, BsBell, BsFillCircleFill} from 'react-icons/bs'
import { AiOutlineInfoCircle, AiOutlineCheck, AiOutlineClose, AiFillCheckCircle, AiOutlineFileExcel, AiOutlineInbox} from 'react-icons/ai'
import { MdAssignment } from 'react-icons/md'
import { FiSend, FiTruck, FiSettings, FiUpload } from 'react-icons/fi'
import {Formik} from 'formik'
import * as Yup from 'yup'
import Pdf from "../../components/Pdf"
import {Form} from 'react-bootstrap'
import logo from '../../assets/img/logo.png'
import {connect} from 'react-redux'
import pengadaan from '../../redux/actions/pengadaan'
import OtpInput from "react-otp-input";
import moment from 'moment'
import auth from '../../redux/actions/auth'
import {default as axios} from 'axios'
import Sidebar from "../../components/Header"
import MaterialTitlePanel from "../../components/material_title_panel"
import SidebarContent from "../../components/sidebar_content"
import tempmail from '../../redux/actions/tempmail'
import dokumen from '../../redux/actions/dokumen'
import newnotif from '../../redux/actions/newnotif'
import placeholder from  "../../assets/img/placeholder.png"
import TablePeng from '../../components/TablePeng'
import notif from '../../redux/actions/notif'
import NavBar from '../../components/NavBar'
import ReactHtmlToExcel from "react-html-table-to-excel"
import ModalDokumen from '../../components/ModalDokumen'
import ExcelJS from "exceljs"
import fs from "file-saver"
import styleTrans from '../../assets/css/transaksi.module.css'
import NewNavbar from '../../components/NewNavbar'
import Email from '../../components/Pengadaan/Email'
const {REACT_APP_BACKEND_URL} = process.env

const disposalSchema = Yup.object().shape({
    merk: Yup.string().validateSync(""),
    keterangan: Yup.string().required('must be filled'),
    nilai_jual: Yup.string().required()
})

const alasanSchema = Yup.object().shape({
    alasan: Yup.string().required()
});

const fillAsset = Yup.object().shape({
    no_asset: Yup.number().typeError("Hanya menerima input angka").required("no asset harus diisi")
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
            limit: 100,
            search: '',
            time: 'pilih',
            time1: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
            // time1: moment().startOf('month').format('YYYY-MM-DD'),
            time2: moment().endOf('month').format('YYYY-MM-DD'),
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
            idTab: null,
            filter: 'available',
            openSubmit: false,
            openDraft: false,
            tipeEmail: '',
            subject: '',
            message: '',
            noDoc: '',
            noTrans: '',
            collap: false,
            formTrack: false,
            detailTrack: [],
            history: false
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

    goDownload = (val) => {
        const {detailIo} = this.props.pengadaan
        localStorage.setItem('printData', detailIo[0].no_pengadaan)
        const newWindow = window.open(`/${val}`, '_blank', 'noopener,noreferrer')
        if (newWindow) {
            newWindow.opener = null
        }
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
        const { detailIo } = this.props.pengadaan
        data.append('master', this.state.fileUpload)
        await this.props.uploadMasterTemp(token, data, dataTemp[0].no_pengadaan)
        await this.props.getTempAsset(token, detailIo[0].no_pengadaan)
        await this.props.getDetail(token, detailIo[0].no_pengadaan)
        this.openModalUpload()
        this.setState({confirm: 'success'})
        this.openConfirm()
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

    openModalSubmit = () => {
        this.setState({openSubmit: !this.state.openSubmit})
    }

    cekProsesApprove = async (val) => {
        const token = localStorage.getItem('token')
        const level = localStorage.getItem('level')
        const {detailIo} = this.props.pengadaan
        
        if ((level === '5' || level === '9') && (detailIo[0].alasan === '' || detailIo[0].alasan === null || detailIo[0].alasan === '-')) {
            this.setState({confirm: 'recent'})
            this.openConfirm()
        } else if (level !== '5' && level !== '9') {
            if (detailIo[0].asset_token === null) {
                const tempdoc = []
                const arrDoc = []
                for (let i = 0; i < detailIo.length; i++) {
                    await this.props.getDocCart(token, detailIo[i].id)
                    const {dataDocCart} = this.props.pengadaan
                    for (let j = 0; j < dataDocCart.length; j++) {
                        if (dataDocCart[j].path !== null) {
                            const arr = dataDocCart[j]
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
                if (tempdoc.length === arrDoc.length) {
                    this.cekSubmit()
                } else {
                    this.setState({confirm: 'falseAppDok'})
                    this.openConfirm()
                }
            } else {
                const {dataDoc} = this.props.pengadaan
                const tempdoc = []
                const arrDoc = []
                for (let j = 0; j < dataDoc.length; j++) {
                    if (dataDoc[j].path !== null) {
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
                if (tempdoc.length === arrDoc.length) {
                    this.cekSubmit()
                } else {
                    this.setState({confirm: 'falseAppDok'})
                    this.openConfirm()
                }
            }
        } else {
            this.cekSubmit()
        }
    }

    cekSubmit = async (val) => {
        const cek = []
        const temp = []

        const { detailIo, dataTemp } = this.props.pengadaan
        for (let i = 0; i < detailIo.length; i++) {
            if (detailIo[i].jenis === null) {
                cek.push(detailIo[i])
            }
        }

        for (let i = 0; i < dataTemp.length; i++) {
            if (dataTemp[i].no_asset === null) {
                temp.push(dataTemp[i])
            }
        }

        if (cek.length > 0 || (temp.length > 0 && detailIo[0].kategori !== 'return' )) {
            this.setState({confirm: 'falseSubmit'})
            this.openConfirm()
        } else {
            this.openModalSubmit()
        }
    }

    submitAsset = async (val) => {
        const token = localStorage.getItem('token')
        const cek = []
        const temp = []

        const { detailIo, dataTemp } = this.props.pengadaan
        for (let i = 0; i < detailIo.length; i++) {
            if (detailIo[i].jenis === null) {
                cek.push(detailIo[i])
            }
        }

        for (let i = 0; i < dataTemp.length; i++) {
            if (dataTemp[i].no_asset === null) {
                temp.push(dataTemp[i])
            }
        }

        if (cek.length > 0 || (temp.length > 0 && detailIo[0].kategori !== 'return')) {
            this.setState({confirm: 'falseSubmit'})
            this.openConfirm()
        } else {
            this.prosesSendEmail(this.state.tipeEmail)
            await this.props.submitEks(token, val)
            if (detailIo[0].ticket_code === null) {
                this.prosesModalIo()
                this.getDataAsset()
                this.setState({confirm: 'submit'})
                this.openConfirm()
                this.openModalSubmit()
                this.openDraftEmail()
            } else {
                await this.props.podsSend(token, val)
                this.prosesModalIo()
                this.getDataAsset()
                this.setState({confirm: 'submit'})
                this.openConfirm()
                this.openModalSubmit()
                this.openDraftEmail()
            }
        }
    }

    prepSendEmail = async (val) => {
        const {detailIo} = this.props.pengadaan
        const token = localStorage.getItem("token")
         const level = localStorage.getItem('level')
        if (val === 'asset' || val === 'budget') {
            const menu = 'Eksekusi Pengadaan Asset (Pengadaan asset)'
            const tipe = 'submit'
            const tempno = {
                no: detailIo[0].no_pengadaan,
                kode: detailIo[0].kode_plant,
                jenis: 'pengadaan',
                tipe: tipe,
                menu: menu
            }
            this.setState({tipeEmail: val})
            await this.props.getDraftEmail(token, tempno)
            this.openDraftEmail()
        } else {
            const app = detailIo[0].appForm
            const tempApp = []
            for (let i = 0; i < app.length; i++) {
                if (app[i].status === 1){
                    tempApp.push(app[i])
                }
            }
            const tipe = tempApp.length === app.length-1 ? 'full approve' : 'approve'
            const menu = 'Pengajuan Pengadaan Asset (Pengadaan asset)'
            const tempno = {
                no: detailIo[0].no_pengadaan,
                kode: detailIo[0].kode_plant,
                jenis: 'pengadaan',
                tipe: tipe,
                menu: menu
            }
            this.setState({tipeEmail: val})
            // await this.props.getDetail(token, detailIo[0].no_pengadaan)
            await this.props.getDraftEmail(token, tempno)
            this.openDraftEmail()
        }
    }

    openDraftEmail = () => {
        this.setState({openDraft: !this.state.openDraft}) 
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
            proses: val === 'asset' || val === 'budget' ? 'submit' : val,
            route: 'pengadaan'
        }
        await this.props.sendEmail(token, sendMail)
        await this.props.addNewNotif(token, sendMail)
    }

    openForm = async (val) => {
        const token = localStorage.getItem('token')
        const level = localStorage.getItem('level')
        await this.props.getDetail(token, val.no_pengadaan)
        await this.props.getTempAsset(token, val.no_pengadaan)
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

    downloadAjuan = () => {
        const { dataTemp } = this.props.pengadaan
        const dataDownload = dataTemp

        if (dataDownload.length === 0) {
            this.setState({confirm: 'rejDownload'})
            this.openConfirm()
        } else {
    
            const workbook = new ExcelJS.Workbook();
            const ws = workbook.addWorksheet('data')
    
            // await ws.protect('F1n4NcePm4')
    
            const borderStyles = {
                top: {style:'thin'},
                left: {style:'thin'},
                bottom: {style:'thin'},
                right: {style:'thin'}
            }
            
    
            ws.columns = [
                {header: 'NO', key: 'c2'},
                {header: 'No Pengadaan', key: 'c3'},
                {header: 'Description', key: 'c4'},
                {header: 'Price/unit', key: 'c5'},
                {header: 'Total Amount', key: 'c6'},
                {header: 'No Asset', key: 'c7'},
                {header: 'ID Asset', key: 'c8'}
            ]
    
            dataDownload.map((item, index) => { return ( ws.addRow(
                {
                    c2: index + 1,
                    c3: item.no_pengadaan,
                    c4: item.nama,
                    c5: `Rp ${item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
                    c6: `Rp ${(parseInt(item.price) * parseInt(item.qty)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
                    c7: item.no_asset,
                    c8: item.id
                }
            )
            ) })
    
            ws.eachRow({ includeEmpty: true }, function(row, rowNumber) {
                row.eachCell({ includeEmpty: true }, function(cell, colNumber) {
                  cell.border = borderStyles;
                })
              })
    
              ws.columns.forEach(column => {
                const lengths = column.values.map(v => v.toString().length)
                const maxLength = Math.max(...lengths.filter(v => typeof v === 'number'))
                column.width = maxLength + 5
            })
    
            workbook.xlsx.writeBuffer().then(function(buffer) {
                fs.saveAs(
                  new Blob([buffer], { type: "application/octet-stream" }),
                  `Filling No Aset ${dataDownload[0].no_pengadaan} ${moment().format('DD MMMM YYYY')}.xlsx`
                )
            })
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
        this.setState({date: value.updatedAt, idDoc: value.id, fileName: value})
        const data = this.props.pengadaan.detailIo
        await this.props.showDokumen(token, value.id, value.no_pengadaan)
        const {isShow} = this.props.pengadaan
        if (isShow) {
            this.openModalPdf()
        }
    }

    showDokPods = async (val) => {
        this.setState({date: val.updatedAt, idDoc: val.id, fileName: val})
        const data = this.props.pengadaan.detailIo
        const url = val.path
        const cekBidding = url.search('bidding')
        if (cekBidding !== -1) {
            this.setState({dataBid: url})
            this.openModalBidding()
        } else {
            window.open(url, '_blank')
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

    updateFillAsset = async (val) => {
        const token = localStorage.getItem("token")
        const data = {
            no_asset: val.no_asset
        }
        await this.props.updateTemp(token, val.item.id, data)
        await this.props.getTempAsset(token, val.item.no_pengadaan)
        await this.props.getDetail(token, val.item.no_pengadaan)
        this.setState({confirm: 'sucUpdate'})
        this.openConfirm()
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
        } 
        // else if (uploadTemp) {
        //     this.props.getDetail(token, detailIo[0].no_pengadaan)
        //     this.props.getTempAsset(token, detailIo[0].no_pengadaan)
        //     this.setState({confirm: 'success'})
        //     this.openConfirm()
        //     this.props.resetError()
        // } 
        else if (errUpload) {
            this.setState({confirm: 'failedUpload'})
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

    componentDidMount() {
        this.getDataAsset()
    }

    getDataAsset = async (value) => {
        const token = localStorage.getItem("token")
        const {time1, time2, search, limit} = this.state
        const cekTime1 = time1 === '' ? 'undefined' : time1
        const cekTime2 = time2 === '' ? 'undefined' : time2
        this.props.getPengadaan(token, '9', cekTime1, cekTime2, search, limit)
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
        this.getDataAsset()
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

    getDetailTrack = async (value) => {
        const token = localStorage.getItem('token')
        const level = localStorage.getItem('level')
        await this.props.getDetail(token, value)
        await this.props.getApproveIo(token, value)
        const data = this.props.pengadaan.detailIo
        const detail = []
        let num = 0
        for (let i = 0; i < data.length; i++) {
            const temp = parseInt(data[i].price) * parseInt(data[i].qty)
            num += temp
            detail.push(data[i])
        }
        this.setState({ total: num, value: data[0].no_io })
        this.setState({ detailTrack: detail })
        this.openModalTrack()
    }

    openModalTrack = () => {
        this.setState({ formTrack: !this.state.formTrack })
    }


    showCollap = (val) => {
        if (val === 'close') {
            this.setState({ collap: false })
        } else {
            this.setState({ collap: false })
            setTimeout(() => {
                this.setState({ collap: true, tipeCol: val })
            }, 500)
        }
    }

    openHistory = () => {
        this.setState({ history: !this.state.history })
    }

    render() {
        const {alert, upload, errMsg, rinciIo, total, detailTrack} = this.state
        const {dataAsset, alertM, alertMsg, alertUpload, page} = this.props.asset
        const pages = this.props.disposal.page 
        const {dataPeng, isLoading, isError, dataApp, dataDoc, detailIo, dataTemp, dataDocCart} = this.props.pengadaan
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
                                    <div className={style.titleDashboard}>Eksekusi Pengadaan Asset</div>
                                </div>
                                <div className={level === '2' ? style.secEmail1 : style.secEmail}>
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
                                    <div>
                                    </div>
                                </div>
                                <div className='mt-4'>
                                    <Table bordered striped responsive hover className={style.tab}>
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
                                        {dataPeng.length > 0 && dataPeng.map(item => {
                                            return (
                                                <tr>
                                                    <td>{dataPeng.indexOf(item) + 1}</td>
                                                    <td>{item.no_pengadaan}</td>
                                                    <td>{item.kode_plant}</td>
                                                    <td>{item.depo === null ? '' : item.area === null ? item.depo.nama_area : item.area}</td>
                                                    <td>{moment(item.tglIo).format('DD MMMM YYYY')}</td>
                                                    <td>{item.kategori === 'return' ? 'Pengajuan Return' : item.asset_token === null ? 'Pengajuan Asset' : 'Pengajuan PODS'}</td>
                                                    <td>
                                                        <Button color='primary' className='mr-1 mb-1' onClick={() => this.openForm(item)}>{this.state.filter === 'available' ? 'Proses' : 'Detail'}</Button>
                                                        <Button color='warning' onClick={() => this.getDetailTrack(item.no_pengadaan)}>Tracking</Button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                        </tbody>
                                    </Table>
                                    {dataPeng.length === 0 && (
                                        <div className={style.spin}>
                                            <text className='textInfo'>Data ajuan tidak ditemukan</text>
                                        </div>
                                    )}
                                </div>
                                <div>
                                </div>
                            </div>
                        </div>
                    </MaterialTitlePanel>
                </Sidebar> */}
                <div className={styleTrans.app}>
                    <NewNavbar handleSidebar={this.prosesSidebar} handleRoute={this.goRoute} />

                    <div className={`${styleTrans.mainContent} ${this.state.sidebarOpen ? styleTrans.collapsedContent : ''}`}>
                        <h2 className={styleTrans.pageTitle}>Eksekusi Pengadaan Asset</h2>
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

                        <table className={`${styleTrans.table} ${dataPeng.length > 0 ? styleTrans.tableFull : ''}`}>
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
                                {dataPeng.length > 0 && dataPeng.map(item => {
                                    return (
                                        <tr>
                                            <td>{dataPeng.indexOf(item) + 1}</td>
                                            <td>{item.no_pengadaan}</td>
                                            <td>{item.kode_plant}</td>
                                            <td>{item.depo === null ? '' : item.area === null ? item.depo.nama_area : item.area}</td>
                                            <td>{moment(item.tglIo).format('DD MMMM YYYY')}</td>
                                            <td>{item.kategori === 'return' ? 'Pengajuan Return' : item.asset_token === null ? 'Pengajuan Asset' : 'Pengajuan PODS'}</td>
                                            <td>{item.history !== null && item.history.split(',').reverse()[0]}</td>
                                            <td>
                                                <Button color='primary' className='mr-1 mb-1' onClick={() => this.openForm(item)}>{this.state.filter === 'available' ? 'Proses' : 'Detail'}</Button>
                                                <Button color='warning' onClick={() => this.getDetailTrack(item.no_pengadaan)}>Tracking</Button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        {dataPeng.length === 0 && (
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
                                checked
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
                                isDisabled
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
                            <text>{detailIo[0] === undefined ? '-' : detailIo[0].alasan}</text>
                            </Col>
                        </Row>
                        <Row className="rowModal mt-4">
                            <Col md={12} lg={12}>
                                {detailIo[0] === undefined ? '' : `${detailIo[0].area}, ${moment(detailIo[0].tglIo).format('DD MMMM YYYY')}`}
                            </Col>
                        </Row>
                        <Table borderless responsive className="tabPreview mt-4">
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
                        <div className='mt-4 bold'>Keterangan:</div>
                        <div className=''>No. IO dan Profit Center diisi oleh Budgeting Department</div>
                        <div className=''>Cost Center diisi oleh Asset Department</div>
                        <div className=''>Untuk kategori Non Budgeted dan Return kolom alasan "Wajib" diisi</div>
                        <div className=''>* Sesuai Matriks Otorisasi, disetujui oleh :</div>
                        <div className='ml-4'>- Budgeted / Return : NFAM</div>
                        <div className='ml-4 mb-3'>- Non Budgeted : DH OPS, NFAM, DH FA, DH HC, CM</div>
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
                        <Button className="ml-2" color="warning" onClick={() => this.goDownload('formio')}>
                            Download Form
                        </Button>
                    </div>
                    {level === '2' ? (
                        <div className="btnFoot">
                            {detailIo.length > 0 && detailIo[0].kategori !== 'return' && (
                                <Button className="mr-2" color="primary" onClick={this.openTemp}>
                                    Fill No.Asset
                                </Button>
                            )}
                            
                            <Button color="success" onClick={() => this.cekProsesApprove()}>
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
                    {/* <Alert color="info" className="alertWrong" isOpen={false}>
                        <div>Gunakan tanda koma (,) sebagai pemisah antara nomor asset satu dengan yang lainnya, ex: 1000876,20006784,1000756</div>
                    </Alert> */}
                    <Table bordered stripped id="table-to-xls">
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
                                            <td>{item.no_pengadaan}</td>
                                            <td>{item.nama}</td>
                                            <td>Rp {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                            <td>Rp {(parseInt(item.price) * parseInt(item.qty)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                            <td className='fillAset'>
                                            {/* <td onClick={() => this.downloadTemp('false')}> */}
                                                {this.state.download === 'true' ? (
                                                    item.no_asset
                                                ) : (
                                                    <Formik 
                                                        initialValues={{
                                                            no_asset: item.no_asset,
                                                            item: item
                                                        }}
                                                        validationSchema={fillAsset}
                                                        onSubmit={(val) => {this.updateFillAsset(val)}}
                                                        enableReinitialize
                                                        >
                                                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                                                                <>
                                                                    <div className='filldiv'>
                                                                            <Input 
                                                                            name="no_asset"
                                                                            // value={this.state.idTab == item.id ? null : item.no_asset !== null ? item.no_asset : ''}
                                                                            // defaultValue={item.no_asset === null ? '' : item.no_asset}
                                                                            value={values.no_asset}
                                                                            onBlur={handleBlur("no_asset")}
                                                                            onChange={handleChange("no_asset")}
                                                                            // onChange={e => this.updateNoAsset({item: item, target: e.target, key: e.key})}
                                                                            // onKeyPress={e => this.updateNoAsset({item: item, target: e.target, key: e.key})}
                                                                            />
                                                                            <Button className='ml-2' color='success' onClick={handleSubmit} disabled={errors.no_asset ? true : false}>Update</Button>
                                                                    </div>
                                                                    {errors.no_asset ? (
                                                                        <text className='colred mr-4'>{errors.no_asset}</text>
                                                                    ) : null}
                                                                </>
                                                            )}
                                                    </Formik>
                                                    
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
                        <div className="btnFoot">
                            <Button className="mr-2" color="warning" onClick={() => this.downloadAjuan()}>
                                Download
                            </Button>
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
                                checked
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
                            <text>{detailIo[0] === undefined ? '-' : detailIo[0].alasan}</text>
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
                        <Button className="mr-2" color="warning" onClick={() => this.goDownload('formio')}>
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
                <ModalDokumen  
                    parDoc={{noDoc: this.state.noDoc, noTrans: this.state.noTrans, tipe: 'pengadaan', filter: this.state.filter}} 
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
                                                <button className="btnDocIo" onClick={() => this.showDokPods(x)} >{x.nama_dokumen}</button>
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
            <Modal isOpen={this.state.formTrack} toggle={() => { this.openModalTrack(); this.showCollap('close') }} size="xl">
                {/* <Alert color="danger" className={style.alertWrong} isOpen={detailTrack.find(({status_form}) => status_form == 26) === undefined ? false : true}>
                    <div>Data Penjualan Asset Sedang Dilengkapi oleh divisi purchasing</div>
                </Alert> */}
                <ModalBody>
                    <Row className='trackTitle ml-4'>
                        <Col>
                            Tracking Pengadaan Asset
                        </Col>
                    </Row>
                    <Row className='ml-4 trackSub'>
                        <Col md={3}>
                            Kode Area
                        </Col>
                        <Col md={9}>
                            : {detailTrack[0] === undefined ? '' : detailTrack[0].kode_plant}
                        </Col>
                    </Row>
                    <Row className='ml-4 trackSub'>
                        <Col md={3}>
                            Area
                        </Col>
                        <Col md={9}>
                            : {detailTrack[0] === undefined ? '' : detailTrack[0].area}
                        </Col>
                    </Row>
                    <Row className='ml-4 trackSub'>
                        <Col md={3}>
                            No Pengadaan
                        </Col>
                        <Col md={9}>
                            : {detailTrack[0] === undefined ? '' : detailTrack[0].no_pengadaan}
                        </Col>
                    </Row>
                    <Row className='ml-4 trackSub'>
                        <Col md={3}>
                            Tanggal Pengajuan
                        </Col>
                        <Col md={9}>
                            : {detailTrack[0] === undefined ? '' : moment(detailTrack[0].createdAt === null ? detailTrack[0].createdAt : detailTrack[0].createdAt).locale('idn').format('DD MMMM YYYY ')}
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
                            <h4 class="step-title">Submit</h4>
                        </div>
                        {/* {detailTrack[0] !== undefined && detailTrack[0].kategori !== 'return' && ( */}
                        {detailTrack[0] !== undefined && (
                            <div class={detailTrack[0] === undefined ? 'step' : detailTrack[0].status_form > 1 ? "step completed" : 'step'}>
                                <div class="step-icon-wrap">
                                    <button class="step-icon" onClick={() => this.showCollap('Verifikasi Aset')}><FiSettings size={40} className="center" /></button>
                                </div>
                                <h4 class="step-title">Verifikasi Aset</h4>
                            </div>
                        )}
                        <div class={detailTrack[0] === undefined ? 'step' : detailTrack[0].status_form > 2 ? "step completed" : 'step'} >
                            <div class="step-icon-wrap">
                                <button class="step-icon" onClick={() => this.showCollap('Pengajuan')}><MdAssignment size={40} className="center" /></button>
                            </div>
                            <h4 class="step-title">Approval Form IO</h4>
                        </div>
                        {/* {detailTrack[0] !== undefined && detailTrack[0].kategori === 'return' && (
                            <div class={detailTrack[0] === undefined ? 'step' : detailTrack[0].status_form > 3 ? "step completed" : 'step'}>
                                <div class="step-icon-wrap">
                                    <button class="step-icon" onClick={() => this.showCollap('Verifikasi Aset')}><FiSettings size={40} className="center" /></button>
                                </div>
                                <h4 class="step-title">Verifikasi Aset</h4>
                            </div>
                        )} */}
                        <div
                            // class={
                            //     detailTrack[0] === undefined ? 'step' :
                            //         (detailTrack[0].kategori !== 'return' && detailTrack[0].status_form > 3) || (detailTrack[0].kategori === 'return' && detailTrack[0].status_form > 4) ? "step completed"
                            //             : 'step'
                            // }
                            class={detailTrack[0] === undefined ? 'step' : detailTrack[0].status_form > 3 ? "step completed" : 'step'}
                            >
                            <div class="step-icon-wrap">
                                <button class="step-icon" onClick={() => this.showCollap('Proses Budget')}><FiSettings size={40} className="center" /></button>
                            </div>
                            <h4 class="step-title">Proses Budget</h4>
                        </div>
                        <div class={detailTrack[0] === undefined ? 'step' : detailTrack[0].status_form == 8 ? "step completed" : 'step'}>
                            <div class="step-icon-wrap">
                                <button class="step-icon" onClick={() => this.showCollap('Eksekusi')}><FiTruck size={40} className="center" /></button>
                            </div>
                            <h4 class="step-title">Eksekusi Pengadaan Aset</h4>
                        </div>
                        <div class={detailTrack[0] === undefined ? 'step' : detailTrack[0].status_form == 8 ? "step completed" : 'step'}>
                            <div class="step-icon-wrap">
                                <button class="step-icon"><AiOutlineCheck size={40} className="center" /></button>
                            </div>
                            <h4 class="step-title">Selesai</h4>
                        </div>
                    </div>
                    <Collapse isOpen={this.state.collap} className="collapBody">
                        <Card className="cardCollap">
                            <CardBody>
                                <div className='textCard1'>{this.state.tipeCol} Pengadaan Asset</div>
                                {this.state.tipeCol === 'submit' ? (
                                    <div>Tanggal submit : {detailTrack[0] === undefined ? '' : moment(detailTrack[0].createdAt === null ? detailTrack[0].createdAt : detailTrack[0].createdAt).locale('idn').format('DD MMMM YYYY ')}</div>
                                ) : (
                                    <div></div>
                                )}
                                <div>Rincian Item:</div>
                                <Table striped bordered responsive hover className="tableDis mb-3">
                                    <thead>
                                        <tr>
                                            <th>Qty</th>
                                            <th>Description</th>
                                            <th>Price/unit</th>
                                            <th>Total Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {detailTrack.length !== 0 && detailTrack.map(item => {
                                            return (
                                                <tr>
                                                    <td>{item.qty}</td>
                                                    <td>{item.nama}</td>
                                                    <td>Rp {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                    <td>Rp {(parseInt(item.price) * parseInt(item.qty)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </Table>
                                {detailTrack[0] === undefined || this.state.tipeCol === 'Submit' ? (
                                    <div></div>
                                ) : (
                                    <div>
                                        <div className="mb-4 mt-2">Tracking {this.state.tipeCol} :</div>
                                        {this.state.tipeCol === 'Pengajuan' ? (
                                            <div class="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
                                                {detailTrack[0] !== undefined && detailTrack[0].appForm.length && detailTrack[0].appForm.slice(0).reverse().map(item => {
                                                    return (
                                                        <div class={item.status === 1 ? 'step completed' : item.status === 0 ? 'step reject' : 'step'}>
                                                            <div class="step-icon-wrap">
                                                                <button class="step-icon"><FaFileSignature size={30} className="center2" /></button>
                                                            </div>
                                                            <h5 class="step-title">{item.status === null ? '' : moment(item.updatedAt).format('DD-MM-YYYY')} </h5>
                                                            <h4 class="step-title">{item.status === null ? '' : item.nama}</h4>
                                                            <h4 class="step-title">{item.jabatan}</h4>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        ) : this.state.tipeCol === 'Eksekusi' ? (
                                            <div class="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
                                                <div class={detailTrack[0] === undefined ? 'step' : detailTrack[0].status_form == 9 || detailTrack[0].status_form == 8 ? "step completed" : 'step'}>
                                                    <div class="step-icon-wrap">
                                                        <button class="step-icon" ><FaFileSignature size={30} className="center2" /></button>
                                                    </div>
                                                    <h4 class="step-title">Filling No Asset</h4>
                                                </div>
                                                <div class={detailTrack[0] === undefined ? 'step' : detailTrack[0].status_form == 8 ? "step completed" : 'step'}>
                                                    <div class="step-icon-wrap">
                                                        <button class="step-icon" ><AiOutlineCheck size={30} className="center2" /></button>
                                                    </div>
                                                    <h4 class="step-title">Selesai</h4>
                                                </div>
                                            </div>
                                        ) : this.state.tipeCol === 'Verifikasi Aset' ? (
                                            <div class="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
                                                <div class={detailTrack[0] === undefined ? 'step' : detailTrack[0].status_form === '1' || parseInt(detailTrack[0].status_form) > 1 ? "step completed" : 'step'}>
                                                    <div class="step-icon-wrap">
                                                        <button class="step-icon" ><FaFileSignature size={30} className="center2" /></button>
                                                    </div>
                                                    <h4 class="step-title">Verifikasi Aset atau Non Asset</h4>
                                                </div>
                                                <div class={detailTrack[0] === undefined ? 'step' : parseInt(detailTrack[0].status_form) > 1 ? "step completed" : 'step'}>
                                                    <div class="step-icon-wrap">
                                                        <button class="step-icon" ><AiOutlineCheck size={30} className="center2" /></button>
                                                    </div>
                                                    <h4 class="step-title">Selesai</h4>
                                                </div>
                                            </div>
                                        ) : this.state.tipeCol === 'Proses Budget' && (
                                            <div class="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
                                                <div class={detailTrack[0] === undefined ? 'step' : detailTrack[0].status_form == 3 || parseInt(detailTrack[0].status_form) > 3 ? "step completed" : 'step'}>
                                                    <div class="step-icon-wrap">
                                                        <button class="step-icon" ><FaFileSignature size={30} className="center2" /></button>
                                                    </div>
                                                    <h4 class="step-title">Filling No Io</h4>
                                                </div>
                                                <div class={detailTrack[0] === undefined ? 'step' : parseInt(detailTrack[0].status_form) > 3 ? "step completed" : 'step'}>
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
                    {/* <Button color="primary" onClick={() => this.openModPreview({nama: 'disposal pengajuan', no: detailTrack[0] !== undefined && detailTrack[0].no_pengadaan})}>Preview</Button> */}
                    <div></div>
                    <div className="btnFoot">
                        <Button color="primary" onClick={() => { this.openModalTrack(); this.showCollap('close') }}>
                            Close
                        </Button>
                    </div>
                </div>
            </Modal>
            <Modal isOpen={this.state.history} toggle={this.openHistory}>
                <ModalBody>
                    <div className='mb-4'>History Transaksi</div>
                    <div className='history'>
                        {detailTrack === undefined || detailTrack.length === 0 || detailTrack[0].history === null ? (
                            <div></div>   
                        ) 
                        : detailTrack[0].history.split(',').map(item => {
                            return (
                                item !== null && item !== 'null' &&
                                <Button className='mb-2' color='info'>{item}</Button>
                            )
                        })}
                    </div>
                </ModalBody>
            </Modal>
            <Modal isOpen={this.props.pengadaan.isLoading || this.props.dokumen.isLoading || this.props.tempmail.isLoading ? true: false} size="sm">
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
                    ) : this.state.confirm === 'sucUpdate' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Update</div>
                            </div>
                        </div>
                    )  : this.state.confirm === 'success' ?(
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
                    ) : this.state.confirm === 'failedUpload' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Upload</div>
                                {this.props.pengadaan.dataErr.length > 0 && this.props.pengadaan.dataErr.map(item => {
                                    return (
                                        <div className="errApprove mt-2">{item.mess}</div>
                                    )
                                })}
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
                    ) : this.state.confirm === 'rejDownload' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Download</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'falseAppDok' ?(
                        <div>
                            <div className={style.cekUpdate}>
                            <AiOutlineClose size={80} className={style.red} />
                            <div className={[style.sucUpdate, style.green]}>Gagal Approve</div>
                            <div className="errApprove mt-2">Mohon approve dokumen terlebih dahulu</div>
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
            <Modal isOpen={this.state.openSubmit} centered={true}>
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
                            <Button color="primary" onClick={level === '2' ? () => this.prepSendEmail('asset') : () => this.prepSendEmail('budget')}>Ya</Button>
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
                                onClick={() => this.submitAsset(detailIo[0].no_pengadaan)} 
                                color="primary"
                            >
                                Approve & Send Email
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
    approve: state.approve,
    pengadaan: state.pengadaan,
    setuju: state.setuju,
    notif: state.notif,
    auth: state.auth,
    dokumen: state.dokumen,
    tempmail: state.tempmail
})

const mapDispatchToProps = {
    logout: auth.logout,
    getNotif: notif.getNotif,
    resetAuth: auth.resetError,
    getPengadaan: pengadaan.getPengadaan,
    getApproveIo: pengadaan.getApproveIo,
    getDocumentIo: pengadaan.getDocumentIo,
    getDokumen: dokumen.getDokumen,
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
    podsSend: pengadaan.podsSend,
    getDocCart: pengadaan.getDocCart,
    getDraftEmail: tempmail.getDraftEmail,
    sendEmail: tempmail.sendEmail,
    addNewNotif: newnotif.addNewNotif,
}

export default connect(mapStateToProps, mapDispatchToProps)(EksekusiTicket)
