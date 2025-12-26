/* eslint-disable jsx-a11y/no-distracting-elements */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react'
import {
    Container, NavbarBrand, Table, Input, Button, Col,
    Alert, Spinner, Row, Modal, ModalBody, ModalHeader, ModalFooter, Collapse,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Card, CardBody
} from 'reactstrap'
import style from '../../assets/css/input.module.css'
import { FaSearch, FaUserCircle, FaBars, FaCartPlus, FaFileSignature, FaTh, FaList, FaCheck } from 'react-icons/fa'
import { BsCircle, BsBell, BsFillCircleFill } from 'react-icons/bs'
import { AiOutlineCheck, AiOutlineClose, AiFillCheckCircle, AiOutlineInbox } from 'react-icons/ai'
import { CiWarning } from "react-icons/ci"
import { MdAssignment } from 'react-icons/md'
import { FiSend, FiTruck, FiSettings, FiUpload } from 'react-icons/fi'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Pdf from "../../components/Pdf"
import { Form } from 'react-bootstrap'
import logo from '../../assets/img/logo.png'
import { connect } from 'react-redux'
import pengadaan from '../../redux/actions/pengadaan'
import dokumen from '../../redux/actions/dokumen'
import tempmail from '../../redux/actions/tempmail'
import user from '../../redux/actions/user'
import depo from '../../redux/actions/depo'
import OtpInput from "react-otp-input";
import moment from 'moment'
import auth from '../../redux/actions/auth'
import { default as axios } from 'axios'
import Sidebar from "../../components/Header"
import MaterialTitlePanel from "../../components/material_title_panel"
import SidebarContent from "../../components/sidebar_content"
import placeholder from "../../assets/img/placeholder.png"
import TablePeng from '../../components/TablePeng'
import notif from '../../redux/actions/notif'
import newnotif from '../../redux/actions/newnotif'
import NavBar from '../../components/NavBar'
import renderHTML from 'react-render-html'
import ModalDokumen from '../../components/ModalDokumen'
import styleTrans from '../../assets/css/transaksi.module.css'
import NewNavbar from '../../components/NewNavbar'
import Email from '../../components/Pengadaan/Email'
import ExcelJS from "exceljs"
import fs from "file-saver"
import terbilang from '@develoka/angka-terbilang-js'
import debounce from 'lodash.debounce';
import Select from 'react-select/creatable';
import FormIo from '../../components/Pengadaan/FormIo'
const { REACT_APP_BACKEND_URL } = process.env

const disposalSchema = Yup.object().shape({
    merk: Yup.string().validateSync(""),
    keterangan: Yup.string().required('must be filled'),
    nilai_jual: Yup.string().required()
})

const alasanSchema = Yup.object().shape({
    alasan: Yup.string()
});


class Pengadaan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            docked: false,
            open: false,
            openBid: false,
            dataBid: '',
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
            formDis: false,
            formTrack: false,
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
            newIo: [],
            filter: 'available',
            isAppall: false,
            stat: '',
            listStat: [],
            url: '',
            valdoc: {},
            detailTrack: [],
            collap: false,
            tipeCol: '',
            time: 'pilih',
            time1: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
            // time1: moment().startOf('month').format('YYYY-MM-DD'),
            time2: moment().endOf('month').format('YYYY-MM-DD'),
            limit: 100,
            search: '',
            typeReject: '',
            menuRev: '',
            noDoc: '',
            noTrans: '',
            openSubmit: false,
            openDraft: false,
            tipeEmail: '',
            subject: '',
            message: '',
            openFill: false,
            dataRej: {},
            history: false,
            options: []
        }
        this.onSetOpen = this.onSetOpen.bind(this)
        this.menuButtonClick = this.menuButtonClick.bind(this)
        this.debouncedLoadOptions = debounce(this.prosesSearch, 500)
    }

    prosesSearch = async (val) => {
        const token = localStorage.getItem("token")
        const level = localStorage.getItem('level')
        const { time1, time2, search, limit, filter } = this.state
        const cekTime1 = time1 === '' ? 'undefined' : time1
        const cekTime2 = time2 === '' ? 'undefined' : time2
        const statusBudget = level === '8' && filter === 'available' ? '3' : 'all'
        const statusAset = level === '2' && filter === 'available' ? '1' : 'all'
        const statusApp = (level !== '8' && level !== '2') && filter === 'available' ? '2' : 'all'
        const status = filter === 'finish' ? '8' : level === '2' ? statusAset : level === '8' ? statusBudget : (level !== '2' && level !== '8' ) ? statusApp : 'all'

        if (val === null || val === undefined || val.length === 0) {
            this.setState({ options: [] })
        } else {
            await this.props.searchIo(token, status, cekTime1, cekTime2, val, limit)

            const { dataSearch } = this.props.pengadaan
            const firstOption = [
                {value: val, label: val}
            ]
            const secondOption = [
                {value: '', label: ''}
            ]
            
    
            for (let i = 0; i < dataSearch.length; i++) {
                const dataArea = dataSearch[i].area
                const dataNo = dataSearch[i].no_pengadaan
                const dataItem = dataSearch[i].nama
    
                // const cekArea = dataArea.includes(val)
                // const cekNo = dataNo.includes(val)
                // const cekItem = dataItem.includes(val)
    
                // const cekAll = cekArea ? dataArea : cekNo ? dataNo : cekItem ? dataItem : null
                // if (cekAll !== null) {
                //     const data = {
                //         value: dataNo, label: cekAll
                //     }
                //     firstOption.push(data)
                // } else {
                //     const cekFirst = firstOption.find(item => item.value === dataNo)
                const cekSecond = secondOption.find(item => item.value === dataNo)
                if (cekSecond === undefined) {
                    const data = {
                        value: dataNo, label: dataNo
                    }
                    secondOption.push(data)
                }
                // }
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

    openHistory = () => {
        this.setState({ history: !this.state.history })
    }

    getMessage = (val) => {
        this.setState({ message: val.message, subject: val.subject })
        console.log(val)
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

    getApproveDis = async (value) => {
        const token = localStorage.getItem('token')
        await this.props.getApproveDisposal(token, value.no, value.nama)
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

    openModalRinci = () => {
        this.setState({ modalRinci: !this.state.modalRinci })
    }

    openRinciAdmin = () => {
        this.setState({ rinciAdmin: !this.state.rinciAdmin })
    }

    openPreview = () => {
        this.setState({ preview: !this.state.preview })
    }

    openModPreview = async (val) => {
        const token = localStorage.getItem('token')
        await this.props.getApproveIo(token, val.no_pengadaan)
        this.openPreview()
    }

    onChange = value => {
        this.setState({ value: value })
    }

    updateNomorIo = async (val) => {
        const { value } = this.state
        const token = localStorage.getItem('token')
        const data = {
            no_io: val.type === 'sap' ? val.val.no_pengadaan : value,
            no: val.val.no_pengadaan,
            type: val.type
        }
        await this.props.updateNoIo(token, data)
        await this.props.getDetail(token, val.val.no_pengadaan)
        const { detailIo } = this.props.pengadaan
        this.setState({ confirm: 'isupdate', value: detailIo[0].no_io })
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
        if (cek.length > 0) {
            this.setState({ confirm: 'rejSubmit' })
            this.openConfirm()
        } else {
            this.prosesSendEmail('budget')
            await this.props.submitBudget(token, detailIo[0].no_pengadaan)
            this.prosesModalIo()
            this.getDataAsset()
            this.setState({ confirm: 'submit' })
            this.openConfirm()
            this.openModalSubmit()
            this.openDraftEmail()
        }
    }

    goCartTicket = () => {
        this.props.history.push('/carttick')
    }

    closeProsesModalDoc = () => {
        this.setState({ openModalDoc: !this.state.openModalDoc })
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
        this.setState({ openApproveIo: !this.state.openApproveIo })
    }

    openModalSubmit = () => {
        this.setState({ openSubmit: !this.state.openSubmit })
    }

    cekProsesApprove = async (val) => {
        const token = localStorage.getItem('token')
        const level = localStorage.getItem('level')
        const { detailIo } = this.props.pengadaan

        if ((level === '5' || level === '9') && (detailIo[0].alasan === '' || detailIo[0].alasan === null || detailIo[0].alasan === '-')) {
            this.setState({ confirm: 'reason' })
            this.openConfirm()
        } else if (level !== '5' && level !== '9') {
            if (detailIo[0].asset_token === null) {
                const tempdoc = []
                const arrDoc = []
                for (let i = 0; i < detailIo.length; i++) {
                    await this.props.getDocCart(token, detailIo[i].id)
                    const { dataDocCart } = this.props.pengadaan
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
                    if (val === 'submit') {
                        if (level === '2') {
                            const cek = []
                            const dataFalse = []
                            for (let i = 0; i < detailIo.length; i++) {
                                if (detailIo[i].isAsset !== 'true' && detailIo[i].isAsset !== 'false') {
                                    cek.push(detailIo[i])
                                } else if (detailIo[i].isAsset === 'false') {
                                    dataFalse.push(detailIo[i])
                                }
                            }
                            if (cek.length > 0) {
                                this.setState({ confirm: 'falseSubmit' })
                                this.openConfirm()
                            } else if (dataFalse.length === detailIo.length) {
                                this.setState({ confirm: 'falseItem' })
                                this.openConfirm()
                            } else {
                                this.openModalSubmit()
                            }
                        } else if (level === '8') {
                            const cek = []
                            for (let i = 0; i < detailIo.length; i++) {
                                if (detailIo[i].no_io === null || detailIo[i].no_io === '') {
                                    cek.push(detailIo[i])
                                }
                            }
                            if (cek.length > 0) {
                                this.setState({ confirm: 'rejSubmit' })
                                this.openConfirm()
                            } else {
                                this.openModalSubmit()
                            }
                        }
                    } else {
                        this.openModalApproveIo()
                    }
                } else {
                    this.setState({ confirm: 'falseAppDok' })
                    this.openConfirm()
                }
            } else {
                const { dataDoc } = this.props.pengadaan
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
                    if (val === 'submit') {
                        this.openModalSubmit()
                    } else {
                        this.openModalApproveIo()
                    }
                } else {
                    this.setState({ confirm: 'falseAppDok' })
                    this.openConfirm()
                }
            }
        } else {
            this.openModalApproveIo()
        }
    }

    openModalRejectDis = () => {
        this.setState({ openRejectDis: !this.state.openRejectDis })
    }

    openModalReject = () => {
        const level = localStorage.getItem('level')
        const { detailIo } = this.props.pengadaan
        if ((level === '5' || level === '9') && (detailIo[0].alasan === '' || detailIo[0].alasan === null || detailIo[0].alasan === '-')) {
            this.setState({ confirm: 'reason' })
            this.openConfirm()
        } else {
            this.setState({ listStat: [], openReject: !this.state.openReject })
        }
    }

    openModalApprove = () => {
        this.setState({ openApprove: !this.state.openApprove })
    }

    modalSubmitPre = () => {
        this.setState({ submitPre: !this.state.submitPre })
    }

    prosesModalDoc = async (val) => {
        const data = this.props.pengadaan.detailIo
        const token = localStorage.getItem('token')
        this.setState({ valdoc: val })

        if (val.asset_token === null || val.asset_token === '') {
            const tempno = {
                no: val.id,
                jenis: 'pengadaan'
            }
            await this.props.getDokumen(token, tempno)
            await this.props.getDocCart(token, val.id)
            this.setState({ noDoc: val.id, noTrans: data[0].no_pengadaan })
            this.closeProsesModalDoc()
        } else {
            const tempno = {
                no: data[0].no_pengadaan,
                jenis: 'pengadaan'
            }
            await this.props.getDokumen(token, tempno)
            await this.props.getDocumentIo(token, data[0].no_pengadaan)
            this.setState({ noDoc: data[0].no_pengadaan, noTrans: data[0].no_pengadaan })
            this.closeProsesModalDoc()
        }
    }

    prosesDoc = async (val) => {
        const data = this.props.pengadaan.detailIo
        const token = localStorage.getItem('token')
        if (val.asset_token === null || val.asset_token === '') {
            this.props.getDocCart(token, val.id)
        } else {
            await this.props.getDocumentIo(token, data[0].no_pengadaan)
        }
    }

    approveDokumen = async () => {
        const { fileName } = this.state
        const token = localStorage.getItem('token')
        await this.props.approveDocument(token, fileName.id)
        this.setState({ openApprove: !this.state.openApprove })
        this.setState({ openPdf: false, openBid: false })
    }

    rejectDokumen = async (value) => {
        const { fileName } = this.state
        const token = localStorage.getItem('token')
        this.setState({ openRejectDis: !this.state.openRejectDis })
        await this.props.rejectDocument(token, fileName.id, value)
        this.setState({ openPdf: false, openBid: false })
    }

    rejectIo = async (value) => {
        const { detailIo } = this.props.pengadaan
        const level = localStorage.getItem('level')
        const { listStat, listMut, typeReject, menuRev } = this.state
        const token = localStorage.getItem('token')
        let temp = ''
        for (let i = 0; i < listStat.length; i++) {
            temp += listStat[i] + '.'
        }
        const data = {
            alasan: temp + value.alasan,
            no: detailIo[0].no_pengadaan,
            menu: typeReject === 'pembatalan' ? 'Pengadaan asset' : menuRev,
            list: listMut,
            type: level === '2' || level === '8' ? 'verif' : 'form',
            type_reject: typeReject
        }
        await this.props.rejectIo(token, detailIo[0].no_pengadaan, data)
        this.prosesSendEmail(`reject ${typeReject}`)
        this.prosesModalIo()
        this.getDataAsset()
        this.setState({ confirm: 'reject' })
        this.openConfirm()
        this.openModalReject()
        this.openDraftEmail()
    }


    approveIo = async () => {
        const token = localStorage.getItem('token')
        const { detailIo } = this.props.pengadaan
        const app = detailIo[0].appForm
        const tempApp = []
        app.map(item => {
            return (
                item.status === 1 && tempApp.push(item)
            )
        })
        const tipe = tempApp.length === app.length - 1 ? 'full approve' : 'approve'
        this.prosesSendEmail(tipe)
        await this.props.approveIo(token, detailIo[0].no_pengadaan)
        this.prosesModalIo()
        this.getDataAsset()
        this.setState({ confirm: 'approve' })
        this.openConfirm()
        this.openModalApproveIo()
        this.openDraftEmail()
    }

    submitAsset = async (val) => {
        const token = localStorage.getItem('token')
        const dataFalse = []
        const cek = []
        const cekDok = []
        const { detailIo } = this.props.pengadaan
        for (let i = 0; i < detailIo.length; i++) {
            if (detailIo[i].isAsset !== 'true' && detailIo[i].isAsset !== 'false') {
                cek.push(detailIo[i])
            } else if (detailIo[i].isAsset === 'false') {
                dataFalse.push(detailIo[i])
            } else if (detailIo[i].asset_token === null) {
                await this.props.getDocCart(token, detailIo[i].id)
                const { dataDocCart } = this.props.pengadaan
                if (dataDocCart.find(({ status }) => status === null) || dataDocCart.find(({ status }) => status === 0)) {
                    cekDok.push(dataDocCart)
                }
            } else if (detailIo[i].asset_token !== null) {
                await this.props.getDocumentIo(token, detailIo[i].no_pengadaan)
                const { dataDoc } = this.props.pengadaan
                if (dataDoc.find(({ status }) => status === null) || dataDoc.find(({ status }) => status === 0)) {
                    cekDok.push(dataDoc)
                }
            }
        }
        if (cek.length > 0) {
            this.setState({ confirm: 'falseSubmit' })
            this.openConfirm()
        } else if (cekDok.length > 0) {
            this.setState({ confirm: 'falseSubmitDok' })
            this.openConfirm()
        } else {
            if (dataFalse.length === detailIo.length) {
                this.prosesSendEmail('asset')
                await this.props.submitNotAsset(token, val)
                await this.props.podsSend(token, val)
                this.getDataAsset()
                this.prosesModalIo()
                this.setState({ confirm: 'submitnot' })
                this.openConfirm()
                this.openModalSubmit()
                this.openDraftEmail()
            } else {
                this.prosesSendEmail('asset')
                await this.props.submitIsAsset(token, val)
                this.getDataAsset()
                this.prosesModalIo()
                this.setState({ confirm: 'submit' })
                this.openConfirm()
                this.openModalSubmit()
                this.openDraftEmail()
            }
        }
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
            route: val === 'reject perbaikan' ? 'revtick' : val === 'budget' ? 'ekstick' : 'pengadaan'
        }
        await this.props.sendEmail(token, sendMail)
        await this.props.addNewNotif(token, sendMail)
    }

    prepSendEmail = async (val) => {
        const { detailIo } = this.props.pengadaan
        const token = localStorage.getItem("token")
        const level = localStorage.getItem('level')
        if (val === 'asset' || val === 'budget') {
            const menu = val === 'asset' ? 'Verifikasi asset (Pengadaan asset)' : 'Verifikasi Budget (Pengadaan asset)'
            const tipe = 'submit'
            const tempno = {
                no: detailIo[0].no_pengadaan,
                kode: detailIo[0].kode_plant,
                jenis: 'pengadaan',
                tipe: tipe,
                menu: menu
            }
            this.setState({ tipeEmail: val })
            await this.props.getDetail(token, detailIo[0].no_pengadaan)
            await this.props.getDraftEmail(token, tempno)
            this.openDraftEmail()
        } else {
            const app = detailIo[0].appForm
            const tempApp = []
            for (let i = 0; i < app.length; i++) {
                if (app[i].status === 1) {
                    tempApp.push(app[i])
                }
            }
            const tipe = tempApp.length === app.length - 1 ? 'full approve' : 'approve'
            const menu = 'Pengajuan Pengadaan Asset (Pengadaan asset)'
            const tempno = {
                no: detailIo[0].no_pengadaan,
                kode: detailIo[0].kode_plant,
                jenis: 'pengadaan',
                tipe: tipe,
                menu: menu
            }
            this.setState({ tipeEmail: val })
            // await this.props.getDetail(token, detailIo[0].no_pengadaan)
            await this.props.getDraftEmail(token, tempno)
            this.openDraftEmail()
        }
    }

    prepReject = async (val) => {
        const { detailIo } = this.props.pengadaan
        const { listStat, listMut, typeReject, menuRev } = this.state
        const token = localStorage.getItem("token")
        const level = localStorage.getItem('level')
        if (typeReject === 'pembatalan' && listMut.length !== detailIo.length) {
            this.setState({ confirm: 'falseCancel' })
            this.openConfirm()
        } else {
            const tipe = 'reject'
            const menu = 'Pengajuan Pengadaan Asset (Pengadaan asset)'
            const tempno = {
                no: detailIo[0].no_pengadaan,
                kode: detailIo[0].kode_plant,
                jenis: 'pengadaan',
                tipe: tipe,
                typeReject: typeReject,
                menu: menu
            }
            this.setState({ tipeEmail: 'reject', dataRej: val })
            await this.props.getDraftEmail(token, tempno)
            this.openDraftEmail()
        }

    }

    openDraftEmail = () => {
        this.setState({ openDraft: !this.state.openDraft })
    }

    changeView = (val) => {
        this.setState({ view: val })
        if (val === 'list') {
            // this.getDataList()
        } else {
            // this.getDataStock()
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
            // if (data[i].isAsset !== 'true' && level !== '2' ) {
            //     const temp = 0
            //     num += temp
            // } else {
            const temp = parseInt(data[i].price) * parseInt(data[i].qty)
            num += temp
            // }
        }
        setTimeout(() => {
            this.setState({ total: num, value: data[0].no_io })
            this.prosesModalIo()
        }, 100)
    }

    showAlert = () => {
        this.setState({ alert: true, modalEdit: false, modalAdd: false, modalUpload: false })

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
        this.setState({ upload: true, modalUpload: false })

        setTimeout(() => {
            this.setState({
                upload: false
            })
        }, 10000)
    }

    prosesModalIo = () => {
        this.setState({ openModalIo: !this.state.openModalIo, listMut: [] })

    }

    getDetailDisposal = async (value) => {
        const { dataDis } = this.props.disposal
        const detail = []
        for (let i = 0; i < dataDis.length; i++) {
            if (dataDis[i].no_disposal === value) {
                detail.push(dataDis[i])
            }
        }
        this.setState({ detailDis: detail })
        this.openModalDis()
    }

    toggle = () => {
        this.setState({ isOpen: !this.state.isOpen })
    }

    updateAlasan = async (val) => {
        const token = localStorage.getItem('token')
        const { detailIo } = this.props.pengadaan
        await this.props.updateReason(token, detailIo[0].no_pengadaan, val)
        await this.props.getDetail(token, detailIo[0].no_pengadaan)
        this.setState({ confirm: 'upreason' })
        this.openConfirm()
    }

    openConfirm = () => {
        this.setState({ modalConfirm: !this.state.modalConfirm })
    }

    openModalDis = () => {
        this.setState({ formDis: !this.state.formDis })
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
        this.setState({ dropOpen: !this.state.dropOpen })
    }
    dropApp = () => {
        this.setState({ dropApp: !this.state.dropApp })
    }
    dropOpen = () => {
        this.setState({ dropOpenNum: !this.state.dropOpenNum })
    }
    onSetSidebarOpen = () => {
        this.setState({ sidebarOpen: !this.state.sidebarOpen });
    }
    openModalAdd = () => {
        this.setState({ modalAdd: !this.state.modalAdd })
    }
    openModalEdit = () => {
        this.setState({ modalEdit: !this.state.modalEdit })
    }
    openModalUpload = () => {
        this.setState({ modalUpload: !this.state.modalUpload })
    }
    openModalDownload = () => {
        this.setState({ modalUpload: !this.state.modalUpload })
    }

    openModalPdf = () => {
        this.setState({ openPdf: !this.state.openPdf })
    }

    addDokumen = async (values) => {
        const token = localStorage.getItem("token")
        await this.props.addDokumen(token, values)
        const { isAdd } = this.props.asset
        if (isAdd) {
            this.setState({ confirm: 'add' })
            this.openConfirm()
            this.openModalAdd()
            setTimeout(() => {
                this.getDataAsset()
            }, 500)
        }
    }

    showDokumen = async (value) => {
        const token = localStorage.getItem('token')
        this.setState({ date: value.updatedAt, idDoc: value.id, fileName: value })
        const data = this.props.pengadaan.detailIo
        await this.props.showDokumen(token, value.id, value.no_pengadaan)
        const { isShow } = this.props.pengadaan
        if (isShow) {
            this.prosesDoc(data)
            this.openModalPdf()
        }
    }

    showDokPods = async (val) => {
        this.setState({ date: val.updatedAt, idDoc: val.id, fileName: val })
        const data = this.props.pengadaan.detailIo
        const url = val.path
        const cekBidding = url.search('bidding')
        if (cekBidding !== -1) {
            this.setState({ dataBid: url })
            this.openModalBidding()
        } else {
            window.open(url, '_blank')
            this.prosesDoc(data)
            this.openModalPdf()
        }
    }

    openModalBidding = () => {
        this.setState({ openBid: !this.state.openBid })
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
        // const cek = download[2].split('.')
        // const arr = fileName.path.split('localhost:8000')
        // if (arr.length >= 2) {
        //     const urln = 'https://devpods.pinusmerahabadi.co.id' + arr[1]
        //     console.log(urln)
        //     axios({
        //         url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        //         method: 'GET',
        //         responseType: 'blob', // important
        //     }).then((response) => {
        //         const url = window.URL.createObjectURL(new Blob([response.data]));
        //         const link = document.createElement('a');
        //         link.href = url;
        //         link.setAttribute('download', `${fileName.nama_dokumen}`); //or any other extension
        //         document.body.appendChild(link);
        //         link.click();
        //     });
        // } else {
        //     axios({
        //         url: `${REACT_APP_BACKEND_URL}/uploads/${download[2]}`,
        //         method: 'GET',
        //         responseType: 'blob', // important
        //     }).then((response) => {
        //         const url = window.URL.createObjectURL(new Blob([response.data]));
        //         const link = document.createElement('a');
        //         link.href = url;
        //         link.setAttribute('download', `${fileName.nama_dokumen}.${cek[1]}`); //or any other extension
        //         document.body.appendChild(link);
        //         link.click();
        //     });
        // }
    }


    onChangeHandler = e => {
        const { size, type } = e.target.files[0]
        if (size >= 5120000) {
            this.setState({ errMsg: "Maximum upload size 5 MB" })
            this.uploadAlert()
        } else if (type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && type !== 'application/vnd.ms-excel') {
            this.setState({ errMsg: 'Invalid file type. Only excel files are allowed.' })
            this.uploadAlert()
        } else {
            this.setState({ fileUpload: e.target.files[0] })
        }
    }

    approveAll = async () => {
        const { newIo, listMut } = this.state
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

    downloadAjuan = () => {
        const { dataTemp } = this.props.pengadaan
        const dataDownload = dataTemp

        if (dataDownload.length === 0) {
            this.setState({ confirm: 'rejDownload' })
            this.openConfirm()
        } else {

            const workbook = new ExcelJS.Workbook();
            const ws = workbook.addWorksheet('data')

            // await ws.protect('F1n4NcePm4')

            const borderStyles = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            }


            ws.columns = [
                { header: 'NO', key: 'c2' },
                { header: 'No Pengadaan', key: 'c3' },
                { header: 'Description', key: 'c4' },
                { header: 'Price/unit', key: 'c5' },
                { header: 'Total Amount', key: 'c6' },
                { header: 'No Asset', key: 'c7' },
                { header: 'ID Asset', key: 'c8' }
            ]

            dataDownload.map((item, index) => {
                return (ws.addRow(
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
                )
            })

            ws.eachRow({ includeEmpty: true }, function (row, rowNumber) {
                row.eachCell({ includeEmpty: true }, function (cell, colNumber) {
                    cell.border = borderStyles;
                })
            })

            ws.columns.forEach(column => {
                const lengths = column.values.map(v => v.toString().length)
                const maxLength = Math.max(...lengths.filter(v => typeof v === 'number'))
                column.width = maxLength + 5
            })

            workbook.xlsx.writeBuffer().then(function (buffer) {
                fs.saveAs(
                    new Blob([buffer], { type: "application/octet-stream" }),
                    `Filling No Aset ${dataDownload[0].no_pengadaan} ${moment().format('DD MMMM YYYY')}.xlsx`
                )
            })
        }
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

    goDownload = (val) => {
        const { detailIo } = this.props.pengadaan
        localStorage.setItem('printData', detailIo[0].no_pengadaan)
        const newWindow = window.open(`/${val}`, '_blank', 'noopener,noreferrer')
        if (newWindow) {
            newWindow.opener = null
        }
    }

    componentDidUpdate() {
        const { isError, isUpload, isUpdate, approve, rejApprove, reject, rejReject, detailIo, testPods, appdoc, rejdoc } = this.props.pengadaan
        const { rinciIo, listMut, newIo } = this.state
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
        }
        // else if (approve) {
        //     this.setState({confirm: 'approve'})
        //     this.openConfirm()
        //     this.props.resetApp()
        //     this.prosesModalIo()
        //     this.props.getApproveIo(token, detailIo[0].no_pengadaan)
        // } 
        else if (rejApprove) {
            this.setState({ confirm: 'rejApprove' })
            this.openConfirm()
            this.props.resetApp()
        }
        // else if (reject) {
        //     this.setState({confirm: 'reject'})
        //     this.openConfirm()
        //     this.props.resetApp()
        //     this.prosesModalIo()
        //     this.props.getApproveIo(token, detailIo[0].no_pengadaan)
        // } 
        else if (rejReject) {
            this.setState({ confirm: 'rejReject' })
            this.openConfirm()
            this.props.resetApp()
        } else if (testPods === 'true') {
            this.setState({ confirm: 'apitrue' })
            this.openConfirm()
            this.props.resetApp()
        } else if (testPods === 'false') {
            this.setState({ confirm: 'apifalse' })
            this.openConfirm()
            this.props.resetApp()
        } else if (appdoc === true) {
            this.setState({ confirm: 'appDocTrue' })
            this.openConfirm()
            this.props.resetApp()
            this.prosesDoc(this.state.valdoc)
        } else if (appdoc === false) {
            this.setState({ confirm: 'appDocFalse' })
            this.openConfirm()
            this.props.resetApp()
        } else if (rejdoc === true) {
            this.setState({ confirm: 'rejDocTrue' })
            this.openConfirm()
            this.props.resetApp()
            this.prosesDoc(this.state.valdoc)
        } else if (rejdoc === false) {
            this.setState({ confirm: 'rejDocFalse' })
            this.openConfirm()
            this.props.resetApp()
        }
    }

    openTemp = async () => {
        const token = localStorage.getItem('token')
        const { detailIo } = this.props.pengadaan
        await this.props.getTempAsset(token, detailIo[0].no_pengadaan)
        this.openFill()
    }

    openFill = () => {
        this.setState({ openFill: !this.state.openFill })
    }

    onSearch = async (e) => {
        this.setState({ search: e.target.value })
        const token = localStorage.getItem("token")
        const { filter } = this.state
        if (e.key === 'Enter') {
            // await this.props.getAsset(token, 10, e.target.value, 1)
            // this.getDataAsset({limit: 10, search: this.state.search})
            this.changeFilter(filter)
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

    goRevisi = () => {
        this.props.history.push('/revtick')
    }

    async componentDidMount() {
        // this.getNotif()
        const token = localStorage.getItem("token")
        const id = localStorage.getItem('id')
        const filter = this.props.location.state === undefined ? '' : this.props.location.state.filter
        console.log(filter)
        if (filter === 'finish' || filter === 'all') {
            this.setState({filter: filter})
        }
        await this.props.getRole(token)
        await this.props.getDepo(token, 1000, '')
        await this.props.getDetailUser(token, id)
        this.getDataAsset()
    }

    getDataAsset = async (value) => {
        const level = localStorage.getItem('level')
        const { filter } = this.state
        console.log(filter)
        this.changeFilter(filter)
    }

    getDataMount = () => {
        this.changeFilter('available')
    }

    openAppall = () => {
        this.setState({ isAppall: !this.state.isAppall })
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
        const statusBudget = level === '8' && val === 'available' ? '3' : 'all'
        const statusAset = level === '2' && val === 'available' ? '1' : 'all'
        const statusApp = (level !== '8' && level !== '2') && val === 'available' ? '2' : 'all'
        const status = val === 'finish' ? '8' : level === '2' ? statusAset : level === '8' ? statusBudget : (level !== '2' && level !== '8' ) ? statusApp : 'all'

        await this.props.getPengadaan(token, status, cekTime1, cekTime2, search, limit)

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
        if (level === '2' || level === '8') {
            const { dataPeng } = this.props.pengadaan
            const newIo = []
            console.log(val)
            for (let i = 0; i < dataPeng.length; i++) {
                const cekBudget = dataPeng[i].status_form === '3'
                const cekAsset = dataPeng[i].status_form === '1'
                if (val === 'available') {
                    if (((level === '8' && cekBudget) || (level === '2' && cekAsset)) && dataPeng[i].status_reject !== 1) {
                        newIo.push(dataPeng[i])
                    }
                } else if (val === 'reject') {
                    if (dataPeng[i].status_reject === 1) {
                        newIo.push(dataPeng[i])
                    }
                } else if (val === 'finish') {
                    if (dataPeng[i].status_form === '8') {
                        newIo.push(dataPeng[i])
                    }
                } else {
                    if ((!cekAsset && level === '2') || (!cekBudget && level === '8')) {
                        newIo.push(dataPeng[i])
                    } else if (((level === '8' && cekBudget) || (level === '2' && cekAsset)) && dataPeng[i].status_reject === 1) {

                    }
                }
            }
            this.setState({ filter: val, newIo: newIo })
        } else {
            const { dataPeng } = this.props.pengadaan
            if (val === 'available' && dataPeng.length > 0) {
                console.log('at available')
                const newIo = []
                const arrApp = []
                for (let i = 0; i < dataPeng.length; i++) {
                    const depoFrm = dataDepo.find(item => item.kode_plant === dataPeng[i].kode_plant)
                    for (let x = 0; x < listRole.length; x++) {
                        // console.log(listRole)
                        const app = dataPeng[i].appForm === undefined ? [] : dataPeng[i].appForm
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
                            console.log('at available 2 area')
                            if (dataPeng[i].status_reject !== 1 && dataPeng[i].status_form === '2' && (app[find] === undefined || app.length === 0)) {
                                console.log('at available 3 area')
                                newIo.push(dataPeng[i])
                            } else if (dataPeng[i].status_reject !== 1 && dataPeng[i].status_form === '2' && app[find].status === null) {
                                console.log('at available 4 area')
                                newIo.push(dataPeng[i])
                            }
                        } else if (find === 0 || find === '0') {
                            console.log('at available 8')
                            if (dataPeng[i].status_reject !== 1 && app[find] !== undefined && app[find + 1].status === 1 && app[find].status !== 1) {
                                if (newIo.find(item => item.no_pengadaan === dataPeng[i].no_pengadaan) === undefined) {
                                    newIo.push(dataPeng[i])
                                    arrApp.push({index: find, noDis: dataPeng[i].no_pengadaan})
                                }
                            }
                        } else {
                            console.log('at available 5')
                            if (dataPeng[i].status_reject !== 1 && app[find] !== undefined && app[find + 1].status === 1 && app[find - 1].status === null && app[find].status !== 1) {
                                if (newIo.find(item => item.no_pengadaan === dataPeng[i].no_pengadaan) === undefined) {
                                    newIo.push(dataPeng[i])
                                    arrApp.push({index: find, noDis: dataPeng[i].no_pengadaan})
                                }
                            }
                        }
                    }
                }
                this.setState({ filter: val, newIo: newIo })
            } else if (val === 'reject' && dataPeng.length > 0) {
                const newIo = []
                for (let i = 0; i < dataPeng.length; i++) {
                    if (dataPeng[i].status_reject === 1) {
                        newIo.push(dataPeng[i])
                    }
                }
                this.setState({ filter: val, newIo: newIo })
            } else if (val === 'finish' && dataPeng.length > 0) {
                const newIo = []
                for (let i = 0; i < dataPeng.length; i++) {
                    if (dataPeng[i].status_form === '8') {
                        newIo.push(dataPeng[i])
                    }
                }
                this.setState({ filter: val, newIo: newIo })
            } else {
                const newIo = []
                for (let i = 0; i < dataPeng.length; i++) {
                    const app = dataPeng[i].appForm === undefined ? [] : dataPeng[i].appForm
                    const find = app.indexOf(app.find(({ jabatan }) => jabatan === role))
                    if (level === '5' || level === '9') {
                        if (dataPeng[i].status_form === '2' && (app[find] === undefined || app.length === 0)) {
                            console.log('at all 3')
                            newIo.push()
                        } else if (dataPeng[i].status_form === '2' && app[find].status === null) {
                            console.log('at all 4')
                            newIo.push()
                        } else {
                            newIo.push(dataPeng[i])
                        }
                    } else if (find === 0 || find === '0') {
                        if (app[find] !== undefined && app[find + 1].status === 1 && app[find].status !== 1) {
                            newIo.push()
                        } else {
                            newIo.push(dataPeng[i])
                        }
                    } else {
                        if (app[find] !== undefined && app[find + 1].status === 1 && app[find - 1].status === null && app[find].status !== 1) {
                            newIo.push()
                        } else {
                            newIo.push(dataPeng[i])
                        }
                    }
                }
                this.setState({ filter: val, newIo: newIo })
            }
        }
    }

    // changeFilter = async (val) => {
    //     const token = localStorage.getItem("token")
    //     const role = localStorage.getItem('role')
    //     const level = localStorage.getItem('level')
    //     const { time1, time2, search, limit } = this.state
    //     const cekTime1 = time1 === '' ? 'undefined' : time1
    //     const cekTime2 = time2 === '' ? 'undefined' : time2
    //     // const status = val === 'finish' ? '8' : val === 'available' && level === '2' ? '1' : val === 'available' && level === '8' ? '3' : 'all'
    //     const status = val === 'finish' ? '8' : 'all'

    //     await this.props.getPengadaan(token, status, cekTime1, cekTime2, search, limit)

    //     if (level === '2' || level === '8') {
    //         const { dataPeng } = this.props.pengadaan
    //         const newIo = []
    //         console.log(val)
    //         for (let i = 0; i < dataPeng.length; i++) {
    //             // const cekBudget = (dataPeng[i].status_form === '3' && dataPeng[i].kategori !== 'return') || (dataPeng[i].status_form === '4' && dataPeng[i].kategori === 'return')
    //             // const cekAsset = dataPeng[i].status_form === '1' || (dataPeng[i].status_form === '3' && dataPeng[i].kategori === 'return')
    //             const cekBudget = dataPeng[i].status_form === '3'
    //             const cekAsset = dataPeng[i].status_form === '1'
    //             if (val === 'available' ) {
    //                 if (((level === '8' && cekBudget) || (level === '2' && cekAsset)) && dataPeng[i].status_reject !== 1) {
    //                     newIo.push(dataPeng[i])
    //                 }
    //             } else if (val === 'reject') {
    //                 if (dataPeng[i].status_reject === 1) {
    //                     newIo.push(dataPeng[i])
    //                 }
    //             } else if (val === 'finish') {
    //                 if (dataPeng[i].status_form === '8') {
    //                     newIo.push(dataPeng[i])
    //                 }
    //             } else {
    //                 if ((!cekAsset && level === '2') || (!cekBudget && level === '8')) {
    //                     newIo.push(dataPeng[i])
    //                 } else if (((level === '8' && cekBudget) || (level === '2' && cekAsset)) && dataPeng[i].status_reject === 1) {

    //                 }
    //             }
    //         }
    //         this.setState({ filter: val, newIo: newIo })
    //     } else {
    //         const { dataPeng } = this.props.pengadaan
    //         if (val === 'available' && dataPeng.length > 0) {
    //             console.log('at available')
    //             const newIo = []
    //             for (let i = 0; i < dataPeng.length; i++) {
    //                 const app = dataPeng[i].appForm === undefined ? [] : dataPeng[i].appForm
    //                 const find = app.indexOf(app.find(({ jabatan }) => jabatan === role))
    //                 if (level === '5' || level === '9') {
    //                     console.log('at available 2')
    //                     if (dataPeng[i].status_reject !== 1 && dataPeng[i].status_form === '2' && (app[find] === undefined || app.length === 0)) {
    //                         console.log('at available 3')
    //                         newIo.push(dataPeng[i])
    //                     } else if (dataPeng[i].status_reject !== 1 && dataPeng[i].status_form === '2' && app[find].status === null) {
    //                         console.log('at available 4')
    //                         newIo.push(dataPeng[i])
    //                     }
    //                 } else if (find === 0 || find === '0') {
    //                     console.log('at available 8')
    //                     if (dataPeng[i].status_reject !== 1 && app[find] !== undefined && app[find + 1].status === 1 && app[find].status !== 1) {
    //                         newIo.push(dataPeng[i])
    //                     }
    //                 } else {
    //                     console.log('at available 5')
    //                     if (dataPeng[i].status_reject !== 1 && app[find] !== undefined && app[find + 1].status === 1 && app[find - 1].status === null && app[find].status !== 1) {
    //                         newIo.push(dataPeng[i])
    //                     }
    //                 }
    //             }
    //             this.setState({ filter: val, newIo: newIo })
    //         } else if (val === 'reject' && dataPeng.length > 0) {
    //             const newIo = []
    //             for (let i = 0; i < dataPeng.length; i++) {
    //                 if (dataPeng[i].status_reject === 1) {
    //                     newIo.push(dataPeng[i])
    //                 }
    //             }
    //             this.setState({ filter: val, newIo: newIo })
    //         } else if (val === 'finish' && dataPeng.length > 0) {
    //             const newIo = []
    //             for (let i = 0; i < dataPeng.length; i++) {
    //                 if (dataPeng[i].status_form === '8') {
    //                     newIo.push(dataPeng[i])
    //                 }
    //             }
    //             this.setState({ filter: val, newIo: newIo })
    //         } else {
    //             const newIo = []
    //             for (let i = 0; i < dataPeng.length; i++) {
    //                 const app = dataPeng[i].appForm === undefined ? [] : dataPeng[i].appForm
    //                 const find = app.indexOf(app.find(({ jabatan }) => jabatan === role))
    //                 if (level === '5' || level === '9') {
    //                     if (dataPeng[i].status_form === '2' && (app[find] === undefined || app.length === 0)) {
    //                         console.log('at all 3')
    //                         newIo.push()
    //                     } else if (dataPeng[i].status_form === '2' && app[find].status === null) {
    //                         console.log('at all 4')
    //                         newIo.push()
    //                     } else {
    //                         newIo.push(dataPeng[i])
    //                     }
    //                 } else if (find === 0 || find === '0') {
    //                     if (app[find] !== undefined && app[find + 1].status === 1 && app[find].status !== 1) {
    //                         newIo.push()
    //                     } else {
    //                         newIo.push(dataPeng[i])
    //                     }
    //                 } else {
    //                     if (app[find] !== undefined && app[find + 1].status === 1 && app[find - 1].status === null && app[find].status !== 1) {
    //                         newIo.push()
    //                     } else {
    //                         newIo.push(dataPeng[i])
    //                     }
    //                 }
    //             }
    //             this.setState({ filter: val, newIo: newIo })
    //         }
    //     }
    // }

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
        // const status = filter === 'finish' ? '8' : filter === 'available' && level === '2' ? '1' : filter === 'available' && level === '8' ? '3' : 'all'
        this.changeFilter(filter)
    }


    prosesSidebar = (val) => {
        this.setState({ sidebarOpen: val })
    }

    goRoute = (val) => {
        this.props.history.push(`/${val}`)
    }

    testConnect = async () => {
        const token = localStorage.getItem("token")
        await this.props.testApiPods(token)
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
        this.setState({ dataRinci: val })
        const role = localStorage.getItem('role')
        const app = val.appForm
        const find = app.indexOf(app.find(({ jabatan }) => jabatan === role))
        this.setState({ app: app, find: find })
        this.openRinciAdmin()
    }

    chekApp = (val) => {
        const { detailIo } = this.props.pengadaan
        if (val === 'all') {
            const data = []
            for (let i = 0; i < detailIo.length; i++) {
                data.push(detailIo[i].id)
            }
            this.setState({ listMut: data })
        } else {
            const { listMut } = this.state
            listMut.push(val)
            this.setState({ listMut: listMut })
        }
    }

    chekRej = (val) => {
        const { listMut } = this.state
        if (val === 'all') {
            const data = []
            this.setState({ listMut: data })
        } else {
            const data = []
            for (let i = 0; i < listMut.length; i++) {
                if (listMut[i] === val) {
                    data.push()
                } else {
                    data.push(listMut[i])
                }
            }
            this.setState({ listMut: data })
        }
    }

    render() {
        const { alert, upload, errMsg, rinciIo, total, listMut, newIo, listStat, fileName, url, detailTrack, sidebarOpen, tipeEmail } = this.state
        const { dataAsset, alertM, alertMsg, alertUpload, page } = this.props.asset
        const pages = this.props.disposal.page
        const { dataPeng, isLoading, isError, dataApp, dataDoc, detailIo, dataDocCart, dataTemp, infoApp } = this.props.pengadaan
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const dataNotif = this.props.notif.data
        const role = localStorage.getItem('role')

        const splitApp = infoApp.info ? infoApp.info.split(']') : []
        const pembuatApp = splitApp.length > 0 ? splitApp[0] : ''
        const pemeriksaApp = splitApp.length > 0 ? splitApp[1] : ''
        const penyetujuApp = splitApp.length > 0 ? splitApp[2] : ''

        const cekKode = detailIo[0] && detailIo[0].kode_plant.length > 4 ? 9 : 5

        const contentHeader = (
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
                                    <div className={style.titleDashboard}>Pengadaan Asset</div>
                                </div>
                                <div className={style.secEmail}>
                                    {level === '5' || level === '9' ? (
                                        <div className={style.headEmail}>
                                            <Button size="lg" color='info' onClick={this.goCartTicket}>Create</Button>
                                        </div>
                                    ) : (
                                        <div></div>
                                    )}
                                    <div className='rowCenter'>
                                        <text>Filter: </text>
                                        <Input className={style.filter} type="select" value={this.state.filter} onChange={e => this.changeFilter(e.target.value)}>
                                            <option value="all">All</option>
                                            <option value="available">Available To Approve</option>
                                            <option value="reject">Reject</option>
                                            <option value="completed">Selesai</option>
                                        </Input>
                                    </div>
                                </div>
                                <div className={style.secEmail}>
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
                                    </div>
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
                                <div>
                                    <Table bordered striped responsive hover className={style.tab}>
                                        <thead>
                                            <tr>
                                                <th>NO</th>
                                                <th>NO AJUAN</th>
                                                <th>KODE AREA</th>
                                                <th>NAMA AREA</th>
                                                <th>TGL AJUAN</th>
                                                <th>STATUS</th>
                                                <th>OPSI</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {newIo.length > 0 && newIo.map(item => {
                                            return (
                                                <tr>
                                                    <td>{newIo.indexOf(item) + 1}</td>
                                                    <td>{item.no_pengadaan}</td>
                                                    <td>{item.kode_plant}</td>
                                                    <td>{item.depo === null ? '' : item.area === null ? item.depo.nama_area : item.area}</td>
                                                    <td>{moment(item.tglIo).format('DD MMMM YYYY')}</td>
                                                    <td>{item.asset_token === null ? 'Pengajuan Asset' : 'Pengajuan PODS'}</td>
                                                    <td>
                                                        <Button color='primary' className='mr-1 mb-1' onClick={() => this.openForm(item)}>{this.state.filter === 'available' ? 'Proses' : 'Detail'}</Button>
                                                        <Button color='warning' onClick={() => this.getDetailTrack(item.no_pengadaan)}>Tracking</Button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                        </tbody>
                                    </Table>
                                    {newIo.length === 0 && (
                                        <div className={style.spin}>
                                            <text className='textInfo'>Data ajuan tidak ditemukan</text>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </MaterialTitlePanel>
                </Sidebar> */}
                <div className={styleTrans.app}>
                    <NewNavbar handleSidebar={this.prosesSidebar} handleRoute={this.goRoute} />

                    <div className={`${styleTrans.mainContent} ${this.state.sidebarOpen ? styleTrans.collapsedContent : ''}`}>
                        <h2 className={styleTrans.pageTitle}>{level === '2' ? 'Verifikasi Asset' : level === '8' ? 'Verifikasi Budget' : 'Pengadaan Asset'}</h2>
                        <div className={styleTrans.searchContainer}>
                            {(level === '5' || level === '9') ? (
                                <Button size="lg" color='primary' onClick={this.goCartTicket}>Create</Button>
                            ) : (
                                <div></div>
                            )}
                            <select value={this.state.filter} onChange={e => this.changeFilter(e.target.value)} className={styleTrans.searchInput}>
                                <option value="all">All</option>
                                <option value="available">Available To Approve</option>
                                <option value="reject">Reject</option>
                                <option value="finish">Finished</option>
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

                        <table className={`${styleTrans.table} ${newIo.length > 0 ? styleTrans.tableFull : ''}`}>
                            <thead>
                                <tr>
                                    <th>NO</th>
                                    <th>NO AJUAN</th>
                                    <th>KATEGORI</th>
                                    <th>KODE AREA</th>
                                    <th>NAMA AREA</th>
                                    <th>TGL AJUAN</th>
                                    <th>JENIS AJUAN</th>
                                    <th>APPROVED BY</th>
                                    <th>TGL APPROVED</th>
                                    <th>LAST STATUS</th>
                                    <th>OPSI</th>
                                </tr>
                            </thead>
                            <tbody>
                                {newIo.length > 0 && newIo.map(item => {
                                    return (
                                        <tr className={item.status_form === '0' ? 'fail' : item.status_reject === 0 ? 'note' : item.status_reject === 1 && 'bad'}>
                                            <td>{newIo.indexOf(item) + 1}</td>
                                            <td>{item.no_pengadaan}</td>
                                            <td className='tdKat'>{item.kategori}</td>
                                            <td className='tdPlant'>{item.kode_plant}</td>
                                            <td>{item.depo === null ? '' : item.area === null ? `${item.depo.nama_area} ${item.depo.channel}` : item.area}</td>
                                            <td className='tdDate'>{moment(item.tglIo).format('DD MMMM YYYY')}</td>
                                            <td>{item.kategori === 'return' ? 'Pengajuan Return' : item.asset_token === null ? 'Pengajuan Asset' : 'Pengajuan PODS'}</td>
                                            <td>{item.appForm !== null && item.appForm.length > 0 && item.appForm.find(item => item.status === 1) !== undefined ? item.appForm.find(item => item.status === 1).nama + ` (${item.appForm.find(item => item.status === 1).jabatan === 'area' ? 'AOS' : item.appForm.find(item => item.status === 1).jabatan})` : '-'}</td>
                                            <td>{item.appForm !== null && item.appForm.length > 0 && item.appForm.find(item => item.status === 1) !== undefined ? moment(item.appForm.find(item => item.status === 1).updatedAt).format('DD/MM/YYYY HH:mm:ss') : '-'}</td>
                                            {/* <td>{}</td> */}
                                            <td>{item.history !== null ? item.history.split(',').reverse()[0] : '-'}</td>
                                            <td>
                                                <Button
                                                    color='primary'
                                                    className='mr-1 mt-1'
                                                    onClick={item.status_reject === 1 && item.status_form !== '0' && level === '5' ? this.goRevisi : () => this.openForm(item)}>
                                                    {this.state.filter === 'available' ? 'Proses' : item.status_reject === 1 && item.status_form !== '0' && level === '5' ? 'Revisi' : 'Detail'}
                                                </Button>
                                                <Button className='mt-1' color='warning' onClick={() => this.getDetailTrack(item.no_pengadaan)}>Tracking</Button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        {newIo.length === 0 && (
                            <div className={style.spinCol}>
                                <AiOutlineInbox size={50} className='secondary mb-4' />
                                <div className='textInfo'>Data ajuan tidak ditemukan</div>
                            </div>
                        )}
                    </div>
                </div>
                <Modal size="xl" isOpen={this.state.openModalIo} toggle={this.prosesModalIo} className='large'>
                    <ModalHeader toggle={this.prosesModalIo}>{detailIo.length > 0 && detailIo[0].no_pengadaan}</ModalHeader>
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
                                    checked
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
                                        // isDisabled={level === '8' ? false : true}
                                        // isDisabled
                                    />
                                    {level === '8' && (
                                        <div className='rowGeneral'>
                                            {/* <Button className='ml-3' size='sm' color='success' onClick={() => this.updateNomorIo({val: detailIo[0], type: 'web'})}>Save</Button> */}
                                            <Button className='ml-3' size='sm' color='success' onClick={() => this.updateNomorIo({val: detailIo[0], type: 'sap'})}>Generate By SAP</Button>
                                            {detailIo.length > 0 &&  detailIo[0].no_io !== null && detailIo[0].no_io.length > 0 ? (
                                                <FaCheck size={30} className='green ml-2' />
                                            ) : (
                                                <CiWarning size={30} className='red ml-2' />
                                            )}
                                        </div>
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
                                                <th>
                                                    <Input
                                                        addon
                                                        type="checkbox"
                                                        className='mr-3'
                                                        disabled={this.state.filter === 'available' ? false : true}
                                                        checked={listMut.length === detailIo.length ? true : false}
                                                        onClick={listMut.length === detailIo.length ? () => this.chekRej('all') : () => this.chekApp('all')}
                                                    />
                                                </th>
                                                <th>Qty</th>
                                                <th>Description</th>
                                                <th>Price/unit</th>
                                                <th>Total Amount</th>
                                                {/* <th>OPSI</th> */}
                                                {level === '2' && (
                                                    <th><text className='red star'>*</text> Asset</th>
                                                )}
                                                <th>Status IT</th>
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
                                                        <tr >
                                                            <td>
                                                                <Input
                                                                    addon
                                                                    type="checkbox"
                                                                    className=''
                                                                    disabled={this.state.filter === 'not available' ? true : false}
                                                                    checked={listMut.find(element => element === item.id) !== undefined ? true : false}
                                                                    onClick={listMut.find(element => element === item.id) === undefined ? () => this.chekApp(item.id) : () => this.chekRej(item.id)}
                                                                />
                                                            </td>
                                                            <td>{item.qty}</td>
                                                            <td className='tdDesc'>{item.nama}</td>
                                                            <td>Rp {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                            <td>Rp {(parseInt(item.price) * parseInt(item.qty)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                            {/* <td><Button onClick={() => this.openModalRinci()}>Detail</Button></td> */}
                                                            {level === '2' && (
                                                                <td className='colTable'>
                                                                    <div className='mb-1'>
                                                                        <Input
                                                                            addon
                                                                            disabled={item.status_app === null ? false : true}
                                                                            checked={item.isAsset === 'true' ? true : false}
                                                                            type="checkbox"
                                                                            onClick={() => this.updateIo({ item: item, value: 'true' })}
                                                                            className='mr-1'
                                                                            value={item.no_asset} />
                                                                        <text>Ya</text>
                                                                    </div>
                                                                    <div>
                                                                        <Input
                                                                            addon
                                                                            disabled={item.status_app === null ? false : true}
                                                                            checked={item.isAsset === 'false' ? true : false}
                                                                            type="checkbox"
                                                                            onClick={() => this.updateIo({ item: item, value: 'false' })}
                                                                            className='mr-1'
                                                                            value={item.no_asset} />
                                                                        <text>Tidak</text>
                                                                    </div>
                                                                </td>
                                                            )}
                                                            <td>
                                                                {item.jenis === 'it' ? 'IT' : item.jenis === 'non-it' ? 'NON IT' : '-'}
                                                            </td>
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
                                </Col>
                                <Col md={10} lg={10} className="colModal">
                                    <text className="mr-3"> </text>
                                    <text className='text-capitalize'>Terbilang ( {terbilang(total)} Rupiah )</text>
                                </Col>
                            </Row>
                            <Formik
                                initialValues={{
                                    alasan: detailIo[0] === undefined ? '' : detailIo[0].alasan === null || detailIo[0].alasan === '' || detailIo[0].alasan === '-' ? '' : detailIo[0].alasan,
                                }}
                                validationSchema={alasanSchema}
                                onSubmit={(values) => { this.updateAlasan(values) }}
                            >
                                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, }) => (
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
                                        {this.state.filter === 'available' ? (
                                            <Row className="rowModal mt-1">
                                                <Col md={2} lg={2}>
                                                </Col>
                                                <Col md={10} lg={10} className="colModal1">
                                                    <text className="mr-3"></text>
                                                    {level === '5' || level === '9' ? (
                                                        <Button onClick={handleSubmit} color='success'>Update</Button>
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
                                            dataApp.pemeriksa?.filter(item => item.id_role !== 2 && item.jabatan !== 'asset').length || 1
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
                                        {dataApp.pemeriksa?.filter(item => item.id_role !== 2 && item.jabatan !== 'asset').map(item => (
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
                                        {dataApp.pemeriksa?.filter(item => item.id_role !== 2 && item.jabatan !== 'asset').map(item => (
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
                            <FormIo className='ml-2'/>
                            {detailIo !== undefined && detailIo.length > 0 && detailIo[0].status_form === '8' && (
                                <Button className="ml-2" color="primary" onClick={() => this.openTemp()}>
                                    List No.Aset
                                </Button>
                            )}
                        </div>
                        {(level === '2' || level === '8') && this.state.filter === 'available' ? (
                            <div className="btnFoot">
                                <Button className="mr-2" color="danger" disabled={listMut.length === 0 ? true : false} onClick={this.openModalReject}>
                                    Reject
                                </Button>
                                <Button color="success" onClick={() => this.cekProsesApprove('submit')}>
                                    Submit
                                </Button>
                            </div>
                        ) : (
                            this.state.filter === 'available' ? (
                                <div className="btnFoot">
                                    <Button className="mr-2" color="danger" disabled={listMut.length === 0 ? true : false} onClick={this.openModalReject}>
                                        Reject
                                    </Button>
                                    <Button color="primary" onClick={this.cekProsesApprove}>
                                        Approve
                                    </Button>
                                </div>
                            ) : (
                                <div></div>
                            )
                        )}
                    </div>
                </Modal>
                <Modal size="xl" isOpen={this.state.preview} toggle={this.openPreview}>
                    <ModalHeader toggle={this.openPreview}>{detailIo.length > 0 && detailIo[0].no_pengadaan}</ModalHeader>
                    <ModalBody className="mb-5">
                        <Container className='mb-4'>
                            <Row className="rowModal">
                                <Col md={3} lg={3}>
                                    <img src={logo} className="imgModal" />
                                </Col>
                                <Col md={9} lg={9}>
                                    <text className="titModal">FORM INTERNAL ORDER ASSET</text>
                                </Col>
                            </Row>
                            <div className="mt-4 mb-3">IO type:</div>
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
                                        numInputs={(this.state.value === undefined || this.state.value === null) ? 11 : this.state.value.length > 11 ? this.state.value.length : 11}
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
                                                            <td>Rp {((parseInt(item.price) * parseInt(item.qty)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."))}</td>
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
                                    
                                </Col>
                                <Col md={10} lg={10} className="colModal">
                                    <text className="mr-3"> </text>
                                    <text className='text-capitalize'>Terbilang ( {terbilang(total)} Rupiah )</text>
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
                        <Table bordered responsive className="tabPreview mt-4">
                            <thead>
                                <tr>
                                    <th className="buatPre" colSpan={dataApp.pembuat?.length || 1}>Dibuat oleh,</th>
                                    <th className="buatPre" colSpan={
                                        dataApp.pemeriksa?.filter(item => item.id_role !== 2 && item.jabatan !== 'asset').length || 1
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
                                    {dataApp.pemeriksa?.filter(item => item.id_role !== 2 && item.jabatan !== 'asset').map(item => (
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
                                    {dataApp.pemeriksa?.filter(item => item.id_role !== 2 && item.jabatan !== 'asset').map(item => (
                                        <td className="footPre">{item.jabatan ?? '-'}</td>
                                    ))}
                                    {dataApp.penyetuju?.map(item => (
                                        <td className="footPre">{item.jabatan ?? '-'}</td>
                                    ))}
                                </tr>
                            </tbody>
                        </Table>
                    </ModalBody>
                    <hr />
                    <div className="modalFoot">
                        <div className="btnFoot">
                        </div>
                        <div className="btnFoot">
                            {/* <Button className="mr-2" color="warning" onClick={() => this.goDownload('formio')}>
                                Download
                            </Button> */}
                            <FormIo className='mr-2'/>
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
                        <Button color="secondary" onClick={this.prosesModalTtd}>
                            Close
                        </Button>
                        <Button color="primary" onClick={this.prosesModalTtd}>
                            Save
                        </Button>
                    </ModalFooter>
                </Modal>
                <Modal size="xl" isOpen={this.state.openModalDoc} toggle={this.closeProsesModalDoc}>
                    <ModalDokumen
                        parDoc={{ noDoc: this.state.noDoc, noTrans: this.state.noTrans, tipe: 'pengadaan', filter: this.state.filter, detailForm: this.state.valdoc }}
                        dataDoc={detailIo !== undefined && detailIo.length > 0 && detailIo[0].asset_token === null ? dataDocCart : dataDoc}
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
                <Modal 
                isOpen={
                    this.props.pengadaan.isLoading ||
                    this.props.dokumen.isLoading ||
                    this.props.user.isLoading ||
                    this.props.depo.isLoading ||
                    this.props.newnotif.isLoading ||
                    this.props.tempmail.isLoading ? true : false
                } 
                size="sm"
                >
                    <ModalBody>
                        <div>
                            <div className={style.cekUpdate}>
                                <Spinner />
                                <div sucUpdate>Waiting....</div>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.props.pengadaan.isUpload ? true : false} size="sm">
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
                            <Pdf pdf={`${REACT_APP_BACKEND_URL}/show/doc/${this.state.idDoc}?no=${fileName.no_pengadaan}`} />
                        </div>
                        <hr />
                        <div className={style.foot}>
                            <div>
                                {/* <div>{moment(this.state.date).format('LLL')}</div> */}
                                <Button color="success" onClick={this.downloadData}>Download</Button>
                            </div>
                            {level === '2' ? (
                                <div>
                                    <Button color="danger" className="mr-3" onClick={this.openModalRejectDis}>Reject</Button>
                                    <Button color="primary" onClick={this.openModalApprove}>Approve</Button>
                                </div>
                            ) : (
                                <Button color="primary" onClick={() => this.setState({ openPdf: false })}>Close</Button>
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
                <Modal className='modalBid' isOpen={this.state.openBid} size="xl" toggle={this.openModalBidding} centered={true}>
                    <ModalHeader>Dokumen</ModalHeader>
                    <ModalBody className='bodyBid'>
                        {/* <div className={style.readPdf}>
                        </div> */}
                        <iframe
                            allowfullscreen={true}
                            height="600"
                            className='bidding'
                            src={fileName.path}
                            title="Dokumen Bidding"
                        />
                        <hr />
                        <div className={style.foot}>
                            <div>
                                {/* <Button color="success" onClick={this.downloadData}>Download</Button> */}
                            </div>
                            {level === '2' ? (
                                <div>
                                    <Button color="danger" className="mr-3" onClick={this.openModalRejectDis}>Reject</Button>
                                    <Button color="primary" onClick={this.openModalApprove}>Approve</Button>
                                </div>
                            ) : (
                                <Button color="primary" onClick={() => this.setState({ openPdf: false })}>Close</Button>
                            )}
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.openApprove} size="lg" toggle={this.openModalApprove} centered={true}>
                    <ModalBody>
                        <div className={style.modalApprove}>
                            <div>
                                <text>
                                    Anda yakin untuk approve
                                    <text className={style.verif}> {fileName.nama_dokumen} </text>
                                    pada tanggal
                                    <text className={style.verif}> {moment().format('LL')}</text> ?
                                </text>
                            </div>
                            <div className={style.btnApproveIo}>
                                <Button color="primary" onClick={this.approveDokumen}>Ya</Button>
                                <Button color="secondary" onClick={this.openModalApprove}>Tidak</Button>
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
                            onSubmit={(values) => { this.rejectDokumen(values) }}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, }) => (
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
                <Modal isOpen={this.state.isAppall} toggle={this.openAppall} centered={true}>
                    <ModalBody>
                        <div className={style.modalApprove}>
                            <div>
                                <text>
                                    Anda yakin untuk approve
                                    <text className={style.verif}> Pengadaan {newIo.map(item => { return (listMut.find(element => element === item.id) !== undefined ? `${item.no_pengadaan},` : null) })} </text>
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
                            onSubmit={(values) => {
                                // this.rejectIo(values)
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
                                            checked={listStat.find(element => element === 'Deskripsi, kuantitas, dan harga tidak sesuai') !== undefined ? true : false}
                                            onClick={listStat.find(element => element === 'Deskripsi, kuantitas, dan harga tidak sesuai') === undefined ? () => this.statusApp('Deskripsi, kuantitas, dan harga tidak sesuai') : () => this.statusRej('Deskripsi, kuantitas, dan harga tidak sesuai')}
                                        />  Deskripsi, kuantitas, dan harga tidak sesuai
                                    </div>
                                    <div className="ml-2">
                                        <Input
                                            addon
                                            type="checkbox"
                                            checked={listStat.find(element => element === 'Dokumen lampiran tidak sesuai') !== undefined ? true : false}
                                            onClick={listStat.find(element => element === 'Dokumen lampiran tidak sesuai') === undefined ? () => this.statusApp('Dokumen lampiran tidak sesuai') : () => this.statusRej('Dokumen lampiran tidak sesuai')}
                                        />  Dokumen lampiran tidak sesuai
                                    </div>
                                    <div className="ml-2">
                                        <Input
                                            addon
                                            type="checkbox"
                                            checked={listStat.find(element => element === 'Alasan di form io yang tidak sesuai') !== undefined ? true : false}
                                            onClick={listStat.find(element => element === 'Alasan di form io yang tidak sesuai') === undefined ? () => this.statusApp('Alasan di form io yang tidak sesuai') : () => this.statusRej('Alasan di form io yang tidak sesuai')}
                                        />  Alasan di form io yang tidak sesuai
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
                <Modal isOpen={this.state.openApproveIo} centered={true}>
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
                                {/* <Button color="primary" onClick={this.approveIo}>Ya</Button> */}
                                <Button color="primary" onClick={() => this.prepSendEmail('approve')}>Ya</Button>
                                <Button color="secondary" onClick={this.openModalApproveIo}>Tidak</Button>
                            </div>
                        </div>
                    </ModalBody>
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
                                {/* <Button color="primary" onClick={level === '2' ? () => this.submitAsset(detailIo[0].no_pengadaan) : this.submitBudget}>Ya</Button> */}
                                <Button color="primary" onClick={level === '2' ? () => this.prepSendEmail('asset') : () => this.prepSendEmail('budget')}>Ya</Button>
                                <Button color="secondary" onClick={this.openModalSubmit}>Tidak</Button>
                            </div>
                        </div>
                    </ModalBody>
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
                        <Row className='ml-4 trackSub1'>
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
                <Modal isOpen={this.state.modalConfirm} toggle={this.openConfirm} size="md">
                    <ModalBody>
                        {this.state.confirm === 'submit' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                    <div className={[style.sucUpdate, style.green]}>Berhasil Submit</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'submitnot' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                    <div className={[style.sucUpdate, style.green]}>Berhasil Submit</div>
                                    {/* <div className="errApprove mt-2">Transaksi dibatalkan</div> */}
                                </div>
                            </div>
                        ) : this.state.confirm === 'isupdate' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                    <div className={[style.sucUpdate, style.green]}>Berhasil Update Nomor IO</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'approve' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                    <div className={[style.sucUpdate, style.green]}>Berhasil Approve</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'upreason' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                    <div className={[style.sucUpdate, style.green]}>Berhasil Update Alasan</div>
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
                                </div>
                            </div>
                        ) : this.state.confirm === 'rejReject' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                    <div className={[style.sucUpdate, style.green]}>Gagal Reject</div>
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
                        ) : this.state.confirm === 'rejSubmit' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                    <div className={[style.sucUpdate, style.green]}>Gagal Submit</div>
                                    <div className="errApprove mt-2">Mohon isi Nomor IO terlebih dahulu</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'falseSubmit' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                    <div className={[style.sucUpdate, style.green]}>Gagal Submit</div>
                                    <div className="errApprove mt-2">Mohon identifikasi asset terlebih dahulu</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'falseItem' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                    <div className={[style.sucUpdate, style.green]}>Gagal Submit</div>
                                    <div className="errApprove mt-2">Ajuan hanya bisa direject karena seluruh data teridentifikasi bukan aset</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'falseSubmitDok' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                    <div className={[style.sucUpdate, style.green]}>Gagal Submit</div>
                                    <div className="errApprove mt-2">Mohon approve dokumen terlebih dahulu</div>
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
                        ) : this.state.confirm === 'reason' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                    <div className={[style.sucUpdate, style.green]}>Permintaan gagal</div>
                                    <div className="errApprove mt-2">Mohon isi alasan terlebih dahulu</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'apitrue' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                    <div className={[style.sucUpdate, style.green]}>Connection Success</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'apifalse' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                    <div className={[style.sucUpdate, style.green]}>Connection Failed</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'appDocTrue' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                    <div className={[style.sucUpdate, style.green]}>Berhasil Approve Dokumen</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'rejDocTrue' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                    <div className={[style.sucUpdate, style.green]}>Berhasil Reject Dokumen</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'appDocFalse' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                    <div className={[style.sucUpdate, style.green]}>Gagal Approve Dokumen</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'rejDocFalse' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                    <div className={[style.sucUpdate, style.green]}>Gagal Reject Dokumen</div>
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
                <Modal isOpen={this.state.openDraft} size='xl'>
                    <ModalHeader>Email Pemberitahuan</ModalHeader>
                    <ModalBody>
                        <Email handleData={this.getMessage} />
                        <div className={style.foot}>
                            <div></div>
                            <div>
                                <Button
                                    disabled={this.state.message === '' ? true : false}
                                    className="mr-2"
                                    onClick={tipeEmail === 'asset' ? () => this.submitAsset(detailIo[0].no_pengadaan)
                                        : tipeEmail === 'budget' ? this.submitBudget
                                            : tipeEmail === 'reject' ? () => this.rejectIo(this.state.dataRej)
                                                : this.approveIo
                                    }
                                    color="primary"
                                >
                                    {tipeEmail === 'reject' ? 'Reject' : 'Approve'} & Send Email
                                </Button>
                                <Button className="mr-3" onClick={this.openDraftEmail}>Cancel</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal size="xl" isOpen={this.state.openFill} toggle={this.openFill}>
                    <ModalHeader>
                        Filling No. Asset
                    </ModalHeader>
                    <ModalBody>
                        {/* <Alert color="info" className="alertWrong" isOpen={false}>
                        <div>Gunakan tanda koma (,) sebagai pemisah antara nomor asset satu dengan yang lainnya, ex: 1000876,20006784,1000756</div>
                    </Alert> */}
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
                                            <td>{item.no_asset}</td>
                                            <td>{item.id}</td>
                                        </tr>
                                        // )
                                    )
                                })}
                            </tbody>
                        </Table>
                        <div className="mt-3 modalFoot">
                            <div className="btnFoot">
                            </div>
                            <div className="btnFoot">
                                <Button className="mr-2" color="warning" onClick={() => this.downloadAjuan()}>
                                    Download
                                </Button>
                                <Button color="secondary" onClick={this.openFill}>
                                    Close
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
    dokumen: state.dokumen,
    tempmail: state.tempmail,
    newnotif: state.newnotif,
    depo: state.depo,
    user: state.user,
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
    getDocCart: pengadaan.getDocCart,
    approveAll: pengadaan.approveAll,
    updateReason: pengadaan.updateReason,
    testApiPods: pengadaan.testApiPods,
    submitNotAsset: pengadaan.submitNotAsset,
    getDraftEmail: tempmail.getDraftEmail,
    sendEmail: tempmail.sendEmail,
    getTempAsset: pengadaan.getTempAsset,
    podsSend: pengadaan.podsSend,
    addNewNotif: newnotif.addNewNotif,
    getRole: user.getRole,
    getDetailUser: user.getDetailUser,
    getDepo: depo.getDepo,
    searchIo: pengadaan.searchIo,
}

export default connect(mapStateToProps, mapDispatchToProps)(Pengadaan)
