/* eslint-disable jsx-a11y/no-distracting-elements */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react'
import { Container, Collapse, Nav, Navbar,
    NavbarToggler, NavbarBrand, NavItem, NavLink,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, Dropdown,
    DropdownItem, Table, ButtonDropdown, Input, Button, Col,
    Alert, Spinner, Row, ModalBody, ModalHeader, Modal, ModalFooter} from 'reactstrap'
import logo from "../../assets/img/logo.png"
import style from '../../assets/css/input.module.css'
import {FaSearch, FaUserCircle, FaBars, FaCartPlus, FaUpload, FaFileSignature} from 'react-icons/fa'
import {BsCircle, BsDashCircleFill, BsFillCircleFill} from 'react-icons/bs'
import { AiOutlineCheck, AiOutlineClose, AiFillCheckCircle, AiOutlineInbox} from 'react-icons/ai'
import { FiUser } from 'react-icons/fi'
import {Formik} from 'formik'
import * as Yup from 'yup'
import Pdf from "../../components/Pdf"
import asset from '../../redux/actions/asset'
import pengadaan from '../../redux/actions/pengadaan'
import approve from '../../redux/actions/approve'
import {connect} from 'react-redux'
import moment from 'moment'
import TablePeng from '../../components/TablePeng'
import TablePdf from "../../components/Table"
import auth from '../../redux/actions/auth'
import setuju from '../../redux/actions/setuju'
import {default as axios} from 'axios'
import Sidebar from "../../components/Header";
import MaterialTitlePanel from "../../components/material_title_panel";
import SidebarContent from "../../components/sidebar_content";
import placeholder from  "../../assets/img/placeholder.png"
import disposal from '../../redux/actions/disposal'
import notif from '../../redux/actions/notif'
import a from "../../assets/img/a.jpg"
import b from "../../assets/img/b.jpg"
import c from "../../assets/img/c.jpg"
import d from "../../assets/img/d.jpg"
import e from "../../assets/img/e.jpg"
import f from "../../assets/img/f.png"
import g from "../../assets/img/g.png"
import tempmail from '../../redux/actions/tempmail'
import newnotif from '../../redux/actions/newnotif'
import depo from '../../redux/actions/depo'
import user from '../../redux/actions/user'
import NavBar from '../../components/NavBar'
import styleTrans from '../../assets/css/transaksi.module.css'
import NewNavbar from '../../components/NewNavbar'
import TrackingDisposal from '../../components/Disposal/TrackingDisposal'
import Email from '../../components/Disposal/Email'
import styleHome from '../../assets/css/Home.module.css'
import FormDisposal from '../../components/Disposal/FormDisposal'
import FormPersetujuan from '../../components/Disposal/FormPersetujuan'
import debounce from 'lodash.debounce';
import Select from 'react-select/creatable';
import ModalDokumen from '../../components/ModalDokumen'
const docAccess = [1, 32, 17]
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
            view: '',
            sidebarOpen: false,
            tipeTrack: '',
            filter: 'available',
            time: 'pilih',
            time1: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
            // time1: moment().startOf('month').format('YYYY-MM-DD'),
            time2: moment().endOf('month').format('YYYY-MM-DD'),
            arrApp: [],
            openDraft: false,
            subject: '',
            message: '',
            listStat: [],
            typeReject: '',
            menuRev: '',
            tipeEmail: '',
            dataRej: {},
            chooseApp: false,
            select: false,
            userApp: [],
            submitPre: false,
            listDis: [],
            newSubmit: [],
            options: [],
            noDoc: '',
            noTrans: '',
            valdoc: {},
            tipeDoc: '',
            appData: []
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
        
        const status = filter === 'available' ? 3 : filter === 'submit' ? 9 : 'all'
        const tipe =  filter === 'submit' ? undefined : 'persetujuan'

        if (val === null || val === undefined || val.length === 0) {
            this.setState({ options: [] })
        } else {
            await this.props.searchDisposal(token, limit, search, 1, status, tipe, cekTime1, cekTime2)

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
        this.setState({nama: value.nama})
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
        this.setState({openApprove: !this.state.openApprove, userApp: []})
    }

    chooseApprove = () => {
        this.setState({chooseApp: !this.state.chooseApp, select: false})
    }

    cekSubmit = async (val) => {
        const token = localStorage.getItem('token')
        const {detailDis} = this.props.disposal
        const cekDoc = []
        const data = {
            noId: detailDis[0].id,
            noAsset: detailDis[0].no_asset
        }
        await this.props.getDocumentDis(token, data, 'disposal', 'persetujuan')
        const {dataDoc} = this.props.disposal
        for (let j = 0; j < dataDoc.length; j++) {
            if (dataDoc[j].path === null) {
                cekDoc.push(dataDoc[j])
            }
        }
        if (cekDoc.length > 0) {
            this.setState({confirm: 'falseDoc'})
            this.openConfirm()
        } else {
            if (val === 'upload') {
                this.chooseApprove()
            } else {
                this.openModalApprove()
            }
        }
    } 

    selectUser = (val) => {
        const {detailDis} = this.props.disposal
        let data = []
        if (val === 'open' && detailDis.length > 0 && detailDis[0].ttdSet.length > 0) {
            data = detailDis[0].ttdSet.reverse().filter(item => item.status !== 1 && item.way_app === 'upload')
            this.setState({select: !this.state.select, appData: data})
        } else {
            this.setState({select: !this.state.select})
        }
        
    }

    chooseUser = (val) => {
        const { userApp, arrApp, appData } = this.state
        const { detailDis } = this.props.disposal
        const app = detailDis[0].ttdSet
        // const app = appData

        const idUser = arrApp.find(item => item.noDis === detailDis[0].no_persetujuan).app.id
        const dataUser = app.find(item => item.id === idUser)
        const indexUser = app.indexOf(dataUser)

        const dataNow = app.find(item => item.id === userApp[userApp.length - 1])
        const indexNow = app.indexOf(dataNow)

        const dataVal = app.find(item => item.id === val)
        const indexVal = app.indexOf(dataVal)

        const cekData = userApp.length === 0 && indexUser === indexVal ? val : (indexNow + 1) === indexVal ? val : 'wrong'
        if (cekData === 'wrong') {
            this.setState({confirm: 'wrongApp'})
            this.openConfirm()
        }  else {
            userApp.push(cekData)
            this.setState({userApp: userApp})
        }
        
    }

    declineUser = (val) => {
        const { userApp, arrApp } = this.state
        const { detailDis } = this.props.disposal
        const dataUser = arrApp.find(item => item.noDis === detailDis[0].no_persetujuan)
        const idUser = dataUser.app.id
        if (idUser === val) {
            this.setState({userApp: []})
        } else {
            const data = []
            const cekIndex = userApp.indexOf(val)
            for (let i = 0; i < userApp.length; i++) {
                if (userApp[i] === val) {
                    data.push()
                } else if (cekIndex !== userApp.length - 1 && i === userApp.length - 1) {
                    data.push()
                } else {
                    data.push(userApp[i])
                }
            }
            this.setState({userApp: data})
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
        await this.props.rejectDocDis(token, fileName.id, value)
        this.setState({openRejectDis: !this.state.openRejectDis})
        this.openModalPdf()
    }

    prosesOpenDokumen = async (val) => {
        const token = localStorage.getItem('token')
        this.setState({ noDoc: val.no_asset, noTrans: val.no_disposal, valdoc: val, tipeDoc: 'disposal' })
        const data = {
            noId: val.id,
            noAsset: val.no_asset
        }
        await this.props.getDocumentDis(token, data, 'disposal', 'pengajuan')
        this.modalDocEks()
    }

    allDocSet = async (val) => {
        const token = localStorage.getItem('token')
        this.setState({ noDoc: val.no_asset, noTrans: val.no_disposal, valdoc: val, tipeDoc: 'persetujuan disposal' })
        const data = {
            noId: val.id,
            noAsset: val.no_asset
        }
        await this.props.getDocumentDis(token, data, 'disposal', 'persetujuan')
        this.modalDocEks()
    }

    modalDocEks = () => {
        this.setState({modalDoc: !this.state.modalDoc})
    }

    openDocSet = async (val) => {
        const token = localStorage.getItem('token')
        const data = {
            noId: val.id,
            noAsset: val.no_asset
        }
        await this.props.getDocumentDis(token, data, 'disposal', 'persetujuan')
        this.closeProsesModalDoc()
    }


    approveDisposal = async (value) => {
        const token = localStorage.getItem('token')
        await this.props.approveDisposal(token, value)
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

    getDetailDisposal = async (val) => {
        const { detailDis } = this.props.disposal
        const token = localStorage.getItem('token')
        await this.props.getApproveDisposal(token, val, 'disposal pengajuan')
        const detail = []
        for (let i = 0; i < detailDis.length; i++) {
            if (detailDis[i].no_persetujuan === val) {
                detail.push(detailDis[i])
            }
        }
        this.setState({detailData: detail})
        this.openModalDis()
    }

    prosesOpenDisposal = async (val) => {
        const token = localStorage.getItem('token')
        await this.props.getApproveSetDisposal(token, val.no_persetujuan)
        await this.props.getDetailDisposal(token, val.no_persetujuan, 'persetujuan')
        this.openFormSet()
    }

    prosesOpenTracking = async (val) => {
        const token = localStorage.getItem('token')
        await this.props.getApproveSetDisposal(token, val.no_persetujuan)
        await this.props.getDetailDisposal(token, val.no_persetujuan, 'persetujuan')
        this.setState({tipeTrack: 'persetujuan'})
        this.openModalTrack()
    }

    openModalTrack = () => {
        this.setState({modalTrack: !this.state.modalTrack})
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

    approveUpload = async e => {
        const {detailDis} = this.props.disposal
        const { userApp, arrApp } = this.state
        const token = localStorage.getItem("token")
        const app = detailDis[0].ttdSet
        const cekApp = arrApp.find(item => item.noDis === detailDis[0].no_persetujuan)
        const dataUser = app.find(item => item.id === Math.max(...userApp))
        const indexUser =  app.indexOf(dataUser)
        const indexApp = userApp.length > 0 ? indexUser : cekApp.index

        const data = new FormData()
        data.append('document', e.target.files[0])
        data.append('no', detailDis[0].no_persetujuan)
        data.append('indexApp', indexApp)
        data.append('userApp', userApp.toString())
        // const send = {
        //     data: data,
        //     no: detailDis[0].no_persetujuan,
        //     type: 'upload',
        //     indexApp: indexApp,
        //     userApp: userApp
        // }
        // await this.props.approveSetDisposal(token, detailDis[0].no_persetujuan, data)
        await this.props.approveSetDisposal(token, 'upload', data)
        // await this.props.approveSetDisposal(token, send)
        this.prosesSendEmail('approve')
        this.getDataDisposal()
        this.openFormSet()
        this.setState({confirm: 'approve'})
        this.openConfirm()
        this.chooseApprove()
        this.openDraftEmail()
    }

    prosesApprove = async () => {
        const {detailDis} = this.props.disposal
        const { arrApp } = this.state
        const token = localStorage.getItem("token")
        const cekApp = arrApp.find(item => item.noDis === detailDis[0].no_persetujuan)
        const data = {
            no: detailDis[0].no_persetujuan,
            indexApp: cekApp.index
        }
        await this.props.approveSetDisposal(token, 'web', data)
        this.prosesSendEmail('approve')
        this.getDataDisposal()
        this.openModalApprove()
        this.openFormSet()
        this.setState({confirm: 'approve'})
        this.openConfirm()
        this.openDraftEmail()
        if (cekApp.app.way_app === 'upload') {
            this.chooseApprove()
        }
    }

    rejectDisposal = async (val) => {
        const { detailDis } = this.props.disposal
        const { listStat, listMut, typeReject, menuRev } = this.state
        const { arrApp } = this.state
        const cekApp = arrApp.find(item => item.noDis === detailDis[0].no_persetujuan)
        console.log(arrApp)
        console.log(cekApp)
        const token = localStorage.getItem('token')
        let temp = ''
        for (let i = 0; i < listStat.length; i++) {
            temp += listStat[i] + '.'
        }
        const data = {
            alasan: temp + val.alasan,
            no: detailDis[0].no_persetujuan,
            menu: typeReject === 'pembatalan' ? 'Disposal asset' : menuRev,
            list: listMut,
            type: 'form',
            type_reject: typeReject,
            user_rev: detailDis[0].kode_plant,
            indexApp: `${cekApp.index}`,
            form: 'persetujuan'
        }
        await this.props.rejectDisposal(token, data)
        this.prosesSendEmail(`reject ${typeReject}`)
        this.openDraftEmail()
        this.getDataDisposal()
        this.openModalReject()
        this.openFormSet()
        this.setState({confirm: 'reject'})
        this.openConfirm()
    }

    prepSendEmail = async (val) => {
        const token = localStorage.getItem("token")
        const { detailDis } = this.props.disposal
        const { arrApp, userApp } = this.state

        const app = detailDis[0].ttdSet
        const cekWay = app.filter(item => item.way_app === 'upload' && item.status !== 1)
        const cekApp = arrApp.find(item => item.noDis === detailDis[0].no_persetujuan)
        const dataUser = app.find(item => item.id === Math.max(...userApp))
        const indexUser =  app.indexOf(dataUser)
        const indexApp = val === 'submit' ? 'first' : cekApp.app.way_app === 'upload' && userApp.length > 0 ? indexUser : cekApp.index

        const tempApp = []
        for (let i = 0; i < app.length; i++) {
            if (app[i].status === 1) {
                tempApp.push(app[i])
            }
        }
        
        const tipe = val === 'submit' ? 'approve' : tempApp.length === app.length - 1 || cekWay.length === userApp.length ? 'full approve' : 'approve'
        const menu = 'Persetujuan Disposal Asset (Disposal asset)'
        const no = detailDis[0].no_persetujuan

        const tempData = []

        for (let i = 0; i < detailDis.length; i++) {
            tempData.push(detailDis[i].kode_plant)
        }

        const set = new Set(tempData)
        const listData = [...set]

        const tempno = {
            indexApp: indexApp,
            no: no,
            kode: detailDis[0].kode_plant,
            jenis: 'persetujuan',
            tipe: tipe,
            menu: menu,
            listData: listData
        }
        this.setState({ tipeEmail: val })
        await this.props.getDetailDisposal(token, no, 'persetujuan')
        await this.props.getApproveSetDisposal(token, no)
        await this.props.getDraftEmail(token, tempno)
        this.openDraftEmail()
    }

    prepReject = async (val) => {
        const { detailDis } = this.props.disposal
        const { listStat, listMut, typeReject, menuRev } = this.state
        const token = localStorage.getItem("token")
        const level = localStorage.getItem('level')

        const tempData = []

        for (let i = 0; i < listMut.length; i++) {
            const cekData = detailDis.find(item => item.id === listMut[i])
            tempData.push(cekData.kode_plant)
        }

        const set = new Set(tempData)
        const listData = [...set]

        if (typeReject === 'pembatalan' && listMut.length !== detailDis.length) {
            this.setState({ confirm: 'falseCancel' })
            this.openConfirm()
        } else {
            const tipe = 'reject'
            const menu = 'Pengajuan Disposal Asset (Disposal asset)'
            const tempno = {
                no: detailDis[0].no_persetujuan,
                kode: detailDis[0].kode_plant,
                jenis: 'persetujuan',
                tipe: tipe,
                typeReject: typeReject,
                menu: menu,
                listData: listData
            }
            this.setState({ tipeEmail: 'reject', dataRej: val })
            await this.props.getDraftEmail(token, tempno)
            this.openDraftEmail()
        }
    }

    openDraftEmail = () => {
        this.setState({ openDraft: !this.state.openDraft })
    }

    prosesSendEmail = async (val) => {
        const token = localStorage.getItem('token')
        const { draftEmail } = this.props.tempmail
        const { detailDis } = this.props.disposal
        const { message, subject, arrApp, userApp } = this.state
        const cc = draftEmail.cc
        const to = draftEmail.to
        const tempto = []
        const tempcc = []
        for (let i = 0; i < cc.length; i++) {
            tempcc.push(cc[i].email)
        }

        for (let i = 0; i < to.length; i++) {
            tempto.push(to[i].email)
        }

        const app = detailDis[0].ttdSet
        const cekWay = app.filter(item => item.way_app === 'upload' && item.status !== 1)
        const cekApp = arrApp.find(item => item.noDis === detailDis[0].no_persetujuan)
        // const indexApp = cekApp.app.way_app === 'upload' ?  app.indexOf(Math.max(...userApp)) : cekApp.index

        const tempApp = []
        for (let i = 0; i < app.length; i++) {
            if (app[i].status === 1) {
                tempApp.push(app[i])
            }
        }
        
        const tipe = tempApp.length === app.length - 1 || cekWay.length === userApp.length ? 'full approve' : 'approve'

        const sendMail = {
            draft: draftEmail,
            nameTo: draftEmail.to.length === undefined ? draftEmail.to.fullname : 'Pengaju',
            to: draftEmail.to.length === undefined ? draftEmail.to.email : tempto.toString(),
            cc: tempcc.toString(),
            message: message,
            subject: subject,
            no: detailDis[0].no_persetujuan,
            jenis: tipe === 'full approve' ? 'full approve persetujuan' : val === 'approve' ? 'approve persetujuan' : 'reject persetujuan',
            tipe: 'persetujuan',
            menu: `disposal asset`,
            proses: val,
            route: val === 'reject perbaikan' ? 'rev-disposal' : tipe === 'full approve' ? 'disposal' : 'persetujuan-disposal',
            filter: val === 'reject perbaikan' ? 'all' : 'available'
        }
        await this.props.sendEmail(token, sendMail)
        await this.props.addNewNotif(token, sendMail)
        if (val === 'submit') {
            this.openDraftEmail()
            this.getDataDisposal()
            this.openSubmit()
            this.modalSubmitPre()
            this.setState({confirm: 'submit'})
            this.openConfirm()
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
        const {isAdd, isDelete, isAppDoc, isRejDoc, detailDis} = this.props.disposal
        const statUpload = this.props.disposal.isUpload
        const {errorRej, errorApp} = this.props.setuju
        const token = localStorage.getItem('token')
        const { dataRinci } = this.state
        const data = {
            noId: dataRinci.id,
            noAsset: dataRinci.no_asset
        }
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
            // setTimeout(() => {
            //     this.props.resetDis()
            //  }, 1000)
            //  setTimeout(() => {
            //     this.props.getDocumentDis(token, data)
            //  }, 1100)
             this.props.resetDis()
             this.props.getDocumentDis(token, data)
        } if (errorRej) {
            this.openConfirm(this.setState({confirm: 'rejReject'}))
            this.props.resetAppSet()
        } else if (errorApp) {
            this.openConfirm(this.setState({confirm: 'rejApprove'}))
            this.props.resetAppSet()
        } else if (statUpload) {
            this.props.resetErrorDis()
            const send = {
                noId: detailDis[0].id,
                noAsset: detailDis[0].no_asset
            }
            setTimeout(() => {
            this.props.getDocumentDis(token, send, 'disposal', 'persetujuan')
            }, 110)
        }
    }

    onSearch = async (e) => {
        this.setState({search: e.target.value})
        const token = localStorage.getItem("token")
        if(e.key === 'Enter'){
            this.changeFilter(this.state.filter)
        }
    }

    async componentDidMount() {
        const token = localStorage.getItem("token")
        const id = localStorage.getItem('id')
        await this.props.getRole(token)
        await this.props.getDepo(token, 1000, '')
        await this.props.getDetailUser(token, id)
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
        const level = localStorage.getItem('level')
        this.changeFilter(level === '2' || level === '32' ? 'submit' : 'available')
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
        const status = val === 'available' ? 3 : val === 'submit' ? 9 : 'all'
        const tipe =  val === 'submit' ? undefined : 'persetujuan'
        await this.props.getDisposal(token, limit, search, 1, status, tipe, cekTime1, cekTime2)
        
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
                    const app = dataDis[i].ttdSet === undefined ? [] : dataDis[i].ttdSet
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
                                if (newDis.find(item => item.no_persetujuan === dataDis[i].no_persetujuan) === undefined) {
                                    newDis.push(dataDis[i])
                                    arrApp.push({index: find, noDis: dataDis[i].no_persetujuan, app: app[find]})
                                }
                            }
                        } else {
                            console.log('at available 4')
                            if (find !== app.length - 1) {
                                if (dataDis[i].status_reject !== 1 && app[find] !== undefined && app[find + 1].status === 1 && app[find - 1].status === null && app[find].status !== 1) {
                                    if (newDis.find(item => item.no_persetujuan === dataDis[i].no_persetujuan) === undefined) {
                                        newDis.push(dataDis[i])
                                        arrApp.push({index: find, noDis: dataDis[i].no_persetujuan, app: app[find]})
                                    }
                                }
                            }
                        }
                    } else if (find === 0 || find === '0') {
                        console.log('at available 8')
                        if (dataDis[i].status_reject !== 1 && app[find] !== undefined && app[find + 1].status === 1 && app[find].status !== 1) {
                            if (newDis.find(item => item.no_persetujuan === dataDis[i].no_persetujuan) === undefined) {
                                newDis.push(dataDis[i])
                                arrApp.push({index: find, noDis: dataDis[i].no_persetujuan, app: app[find]})
                            }
                        }
                    } else {
                        console.log('at available 5')
                        if (dataDis[i].status_reject !== 1 && app[find] !== undefined && (find !== (app.length - 1) ? app[find + 1].status === 1 : app[find - 1].status === null) && app[find - 1].status === null && app[find].status !== 1) {
                            if (newDis.find(item => item.no_persetujuan === dataDis[i].no_persetujuan) === undefined) {
                                newDis.push(dataDis[i])
                                arrApp.push({index: find, noDis: dataDis[i].no_persetujuan, app: app[find]})
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
        }  else if (val === 'finish') {
            const newDis = []
            for (let i = 0; i < dataDis.length; i++) {
                if (dataDis[i].status_form === 8) {
                    newDis.push(dataDis[i])
                }
            }
            this.setState({filter: val, newDis: newDis, baseData: newDis})
        } else if (val === 'submit') {
            const newDis = []
            for (let i = 0; i < dataDis.length; i++) {
                if (dataDis[i].status_form === 9) {
                    newDis.push(dataDis[i])
                }
            }
            this.setState({filter: val, newDis: newDis, baseData: newDis})
        } else {
            this.setState({filter: val, newDis: dataDis, baseData: dataDis})
        }
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
        await this.props.getDetailDisposal(token, value, 'persetujuan')
        await this.props.getApproveSetDisposal(token, value, 'disposal persetujuan')
        this.modalPers()
    }

    prosesSetDisposal = async (value) => {
        const token = localStorage.getItem('token')
        await this.props.getDetailDisposal(token, value, 'persetujuan')
        await this.props.getApproveSetDisposal(token, value, 'disposal persetujuan')
        this.openFormSet()
    }

    openFormSet = () => {
        this.setState({formset: !this.state.formset})
    }

    prosesOpenSubmit = async () => {
        const token = localStorage.getItem("token")
        const {listDis} = this.state
        // const { page } = this.props.disposal
        // await this.props.getSubmitDisposal(token, 1000, '', page.currentPage, 9)
        if (listDis.length === 0) {
            this.setState({confirm: 'falseSubmit'})
            this.openConfirm()
        } else {
            const data = []
            for (let i = 0; i < listDis.length; i++) {
                await this.props.getDetailDisposal(token, listDis[i], 'pengajuan')
                const { detailDis } = this.props.disposal
                for (let j = 0; j < detailDis.length; j++) {
                    data.push(detailDis[j])
                }
            }
            this.setState({newSubmit: data})
            await this.props.getUser(token, 10, '', 1, 22)
            await this.props.getApproveSetDisposal(token, 'prepare', 'disposal persetujuan')
            this.modalSubmitPre()
        }
    }

    modalSubmitPre = () => {
        this.setState({submitPre: !this.state.submitPre})
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

    onChangeUpload = e => {
        const {size, type} = e.target.files[0]
        this.setState({fileUpload: e.target.files[0]})
        if (size >= 20000000) {
            this.setState({errMsg: "Maximum upload size 20 MB"})
            this.uploadAlert()
        } else if (type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && type !== 'application/vnd.ms-excel' && type !== 'application/pdf' && type !== 'application/x-7z-compressed' && type !== 'application/vnd.rar' && type !== 'application/zip' && type !== 'application/x-zip-compressed' && type !== 'application/octet-stream' && type !== 'multipart/x-zip' && type !== 'application/x-rar-compressed' && type !== 'image/jpeg' && type !== 'image/png') {
            this.setState({errMsg: 'Invalid file type. Only excel, pdf, zip, rar, and image files are allowed.'})
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
        const {listMut, alert, upload, errMsg, newDis, listStat, detailData, arrApp, typeReject, tipeEmail, userApp, listDis, newSubmit, appData} = this.state
        const { alertM, alertMsg, alertUpload} = this.props.asset
        const page = this.props.disposal.page
        const role = localStorage.getItem('role')
        const { dataDis, noDis, dataDoc, detailDis } = this.props.disposal
        const {dataRole, dataUser} = this.props.user
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
                <div className={styleTrans.app}>
                    <NewNavbar handleSidebar={this.prosesSidebar} handleRoute={this.goRoute} />

                    <div className={`${styleTrans.mainContent} ${this.state.sidebarOpen ? styleTrans.collapsedContent : ''}`}>
                        <h2 className={styleTrans.pageTitle}>Persetujuan Disposal Asset</h2>
                        <div className={styleTrans.searchContainer}>
                            {((level === '2' || level === '32') && this.state.filter === 'submit' ) ? (
                                <Button onClick={this.prosesOpenSubmit} color="info" size="lg">Submit</Button>
                            ) : (
                                <div></div>
                            )}
                            <select value={this.state.filter} onChange={e => this.changeFilter(e.target.value)} className={styleTrans.searchInput}>
                                <option value="all">All</option>
                                {level === '2' || level === '32' ? (
                                    <option value="submit">Available Submit</option>
                                ) : (
                                    <option value="available">Available Approve</option>
                                )}
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
                                {((level === '2' || level === '32') && this.state.filter === "submit" ) ? (
                                    <tr>
                                        <th>
                                            <Input
                                            addon
                                            disabled={this.state.filter !== 'submit' ? true : false}
                                            checked={(listDis.length === newDis.length) && newDis.length > 0 ? true : false}
                                            type="checkbox"
                                            className='mr-1'
                                            onClick={listDis.length !== newDis.length ? () => this.chekDisApp('all') : () => this.chekDisRej('all')}
                                            />
                                            Select
                                        </th>
                                        <th className='noTb'>NO</th>
                                        <th>NO.AJUAN</th>
                                        <th>AREA</th>
                                        <th>KODE PLANT</th>
                                        <th>COST CENTER</th>
                                        <th>TANGGAL AJUAN</th>
                                        <th>APPROVED BY</th>
                                        <th>TGL APPROVED</th>
                                    </tr>
                                ) : (
                                    <tr>
                                        <th>NO</th>
                                        <th>NO.PERSETUJUAN</th>
                                        {/* <th>AREA</th>
                                        <th>KODE PLANT</th>
                                        <th>COST CENTER</th> */}
                                        <th>TANGGAL PERSETUJUAN</th>
                                        <th>APPROVED BY</th>
                                        <th>TGL APPROVED</th>
                                        <th>OPSI</th>
                                    </tr>
                                )}
                            </thead>
                            <tbody>
                                {newDis.length !== 0 && newDis.filter(x => ((level === '2' || level === '32') && this.state.filter === "submit") ? x.no_disposal !== null : (x.no_persetujuan !== null && x.status_form !== 9)).map((item, index) => {
                                    return (
                                        ((level === '2' || level === '32') && this.state.filter === "submit" ) ? (
                                            <tr className={item.status_reject === 0 ? 'note' : item.status_transaksi === 0 ? 'fail' : item.status_reject === 1 && 'bad'}>
                                                <td> 
                                                    <Input
                                                    addon
                                                    disabled={this.state.filter !== 'submit' ? true : false}
                                                    checked={listDis.find(element => element === item.no_disposal) !== undefined ? true : false}
                                                    type="checkbox"
                                                    onClick={listDis.find(element => element === item.no_disposal) === undefined ? () => this.chekDisApp(item.no_disposal) : () => this.chekDisRej(item.no_disposal)}
                                                    value={item.no_disposal} />
                                                </td>
                                                <td className='noTb'>{index + 1}</td>
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
                                            </tr>
                                        ) : (
                                            <tr className={item.status_reject === 0 ? 'note' : item.status_transaksi === 0 ? 'fail' : item.status_reject === 1 && 'bad'}>
                                                <td>{index + 1}</td>
                                                <td>{item.no_persetujuan}</td>
                                                {/* <td>{item.area}</td>
                                                <td>{item.kode_plant}</td>
                                                <td>{item.cost_center}</td> */}
                                                <td>{moment(item.date_persetujuan).format('DD MMMM YYYY')}</td>
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
                                                <td>
                                                    <Button 
                                                    className="mr-1 mt-1" 
                                                    color="primary" 
                                                    onClick={() => this.prosesOpenDisposal(item)}>
                                                        {this.state.filter === 'available' ? 'Proses' : 'Detail'}
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
                                    )
                                })}
                            </tbody>
                        </table>
                        {newDis.filter(x => ((level === '2' || level === '32') && this.state.filter === "submit") ? x.no_disposal !== null : (x.no_persetujuan !== null && x.status_form !== 9)).length === 0 && (
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
                <Modal isOpen={this.props.disposal.isAdd ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className={style.cekUpdate}>
                                <div sucUpdate>Berhasil menambahkan item disposal</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
                <Modal isOpen={this.state.formset} toggle={this.openFormSet} size="xl" className='xl'>
                    <ModalBody>
                        <div>PT. Pinus Merah Abadi</div>
                        <div className="modalDis">
                            <text className="titleModDis">Persetujuan Disposal Asset</text>
                        </div>
                        <div className="mb-2"><text className="txtTrans">Bandung</text>, {moment(detailDis.length !== 0 && detailDis[0].date_persetujuan).format('DD MMMM YYYY ')}</div>
                        <Row>
                            <Col md={2} className="mb-3">
                            Hal : Persetujuan Disposal Asset
                            </Col>
                        </Row>
                        <div>Kepada Yth.</div>
                        <div className="mb-3">Bpk/Ibu. {detailDis.length !== 0 && detailDis[0].ceo}</div>
                        <div className="mb-3">Dengan Hormat,</div>
                        <div>Sehubungan dengan surat permohonan disposal aset area PMA terlampir</div>
                        <div className="mb-3">Dengan ini kami mohon persetujuan untuk melakukan disposal aset dengan perincian sbb :</div>
                        <Table striped bordered responsive hover className="tableDis mb-3">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>No</th>
                                    <th>Nomor Aset / Inventaris</th>
                                    <th>Area (Cabang/Depo/CP)</th>
                                    <th>Nama Barang</th>
                                    <th>Nilai Buku</th>
                                    <th>Nilai Jual</th>
                                    <th>Tanggal Perolehan</th>
                                    <th>Keterangan</th>
                                    <th>Dokumen</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detailDis.length !== 0 ? detailDis.map(item => {
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
                                            <td scope="row">{detailDis.indexOf(item) + 1}</td>
                                            <td>{item.no_asset}</td>
                                            <td>{item.area}</td>
                                            <td>{item.nama_asset}</td>
                                            <td>{item.nilai_buku === null || item.nilai_buku === undefined ? 0 : item.nilai_buku.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                            <td>{item.nilai_jual === null || item.nilai_jual === undefined ? 0 : item.nilai_jual.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                            <td>{moment(item.dataAsset.tanggal).format('DD/MM/YYYY')}</td>
                                            <td>{item.keterangan}</td>
                                            <td>
                                                <Button color='success' onClick={() => this.prosesOpenDokumen(item)}>Dokumen</Button>
                                            </td>
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
                        {/* <Table borderless responsive className="tabPreview">
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
                                                        {disApp.pembuat !== undefined && disApp.pembuat.map(item => {
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
                                                        {disApp.pembuat !== undefined && disApp.pembuat.map(item => {
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
                        </Table> */}
                        <Table bordered responsive className="tabPreview">
                            <thead>
                                <tr>
                                    <th className="buatPre" colSpan={disApp.pembuat?.length || 1}>Diajukan oleh,</th>
                                    <th className="buatPre" colSpan={disApp.penyetuju?.length || 1}>Disetujui oleh,</th>
                                </tr>
                                <tr>
                                    {disApp.pembuat?.map(item => (
                                        <th className="headPre">
                                            <div>{item.status === 0 ? 'Reject' : item.status === 1 ? moment(item.updatedAt).format('LL') : '-'}</div>
                                            <div>{item.status === 0 ? '-' : item.nama ?? '-'}</div>
                                        </th>
                                    ))}
                                    {disApp.penyetuju?.map(item => (
                                        <th className="headPre">
                                            <div>{item.status === 0 ? 'Reject' : item.status === 1 ? moment(item.updatedAt).format('LL') : '-'}</div>
                                            <div>{item.status === 0 ? '-' : item.nama ?? '-'}</div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {disApp.pembuat?.map(item => (
                                        <td className="footPre">{item.jabatan ?? '-'}</td>
                                    ))}
                                    {disApp.penyetuju?.map(item => (
                                        <td className="footPre">{item.jabatan ?? '-'}</td>
                                    ))}
                                </tr>
                            </tbody>
                        </Table>
                        <div className="rowBetween mt-4 mb-3">
                            <div className="rowGeneral">
                                {detailDis.length > 0 && detailDis[0].status_form !== 26 && detailDis[0].status_form !== 9 && detailDis[0].status_form >= 3 && (
                                    <>
                                    {(this.state.filter === 'available' || docAccess.find(item => item === parseInt(level))) && (
                                        <Button 
                                            color='success' 
                                            onClick={
                                                this.state.filter === 'available' ? 
                                                () => this.openDocSet(detailDis[0]) :
                                                () => this.allDocSet(detailDis[0])
                                            } 
                                        >
                                            Dokumen Persetujuan
                                        </Button>
                                    )}
                                    <FormPersetujuan />
                                    </>
                                )}
                            </div>
                            <div className="btnfootapp">
                                {this.state.filter === 'available' ? (
                                    <>
                                        <Button disabled={listMut.length === 0 ? true : false} className="mr-2" color="danger" onClick={this.openModalReject}>
                                            Reject
                                        </Button>
                                        <Button 
                                            color="success" 
                                            onClick={arrApp.length > 0 && detailDis.length > 0 && arrApp.find(item => item.noDis === detailDis[0].no_persetujuan).app.way_app === 'upload' ? () => this.cekSubmit('upload') : () => this.cekSubmit('digital')}
                                        >
                                            Approve
                                        </Button>
                                    </>
                                ) : (
                                    null
                                )}
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.submitPre} toggle={this.modalSubmitPre} size="xl" className='xl'>
                    <ModalHeader>Submit Persetujuan Disposal</ModalHeader>
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
                            <Table bordered responsive className="tabPreview">
                                <thead>
                                    <tr>
                                        <th className="buatPre" colSpan={disApp.pembuat?.length || 1}>Diajukan oleh,</th>
                                        <th className="buatPre" colSpan={disApp.penyetuju?.length || 1}>Disetujui oleh,</th>
                                    </tr>
                                    <tr>
                                        {disApp.pembuat?.map(item => (
                                            <th className="headPre">
                                                <div>{item.status === 0 ? 'Reject' : moment(item.updatedAt).format('LL')}</div>
                                                <div>{item.status === 0 ? '-' : item.nama ?? '-'}</div>
                                            </th>
                                        ))}
                                        {disApp.penyetuju?.map(item => (
                                            <th className="headPre">
                                                <div>{item.status === 0 ? 'Reject' : moment(item.updatedAt).format('LL')}</div>
                                                <div>{item.status === 0 ? '-' : item.nama ?? '-'}</div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        {disApp.pembuat?.map(item => (
                                            <td className="footPre">{item.jabatan ?? '-'}</td>
                                        ))}
                                        {disApp.penyetuju?.map(item => (
                                            <td className="footPre">{item.jabatan ?? '-'}</td>
                                        ))}
                                    </tr>
                                </tbody>
                            </Table>
                            <hr />
                            <div className="rowBetween">
                                <div className="">
                                    {/* <Button color='primary' onClick={this.downloadFormSet}>Download Form</Button> */}
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
                                <Button color="primary" onClick={this.prosesSubmit}>Ya</Button>
                                <Button color="secondary" onClick={this.openSubmit}>Tidak</Button>
                            </div>
                        </div>
                    </ModalBody>
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
                                        {/* <Button className="btnFootRinci1" size="lg" color="success" onClick={this.openProsesModalDoc}>Dokumen</Button> */}
                                        <Button className="btnFootRinci1" size="lg" color="secondary" onClick={() => this.openRinciAdmin()}>Close</Button>
                                    </div>
                                </div>
                            )}
                            </Formik>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal size="xl" isOpen={this.state.modalDoc} toggle={this.modalDocEks}>
                    <ModalDokumen
                        parDoc={{ 
                            noDoc: this.state.noDoc, 
                            noTrans: this.state.noTrans, 
                            tipe: this.state.tipeDoc, 
                            filter: this.state.filter, 
                            detailForm: this.state.valdoc 
                        }}
                        dataDoc={dataDoc}
                    />
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
                                            {level === '2' ? (
                                                <text>-</text>
                                            ) : (
                                                <input
                                                className="ml-4"
                                                type="file"
                                                onClick={() => this.setState({detail: x})}
                                                onChange={this.onChangeUpload}
                                                />
                                            )}
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
                <Modal isOpen={this.state.chooseApp} toggle={this.chooseApprove} size='xl'>
                    <ModalBody>
                        <div className={styleHome.mainContent}>
                            <main className={styleHome.mainSection}>
                            <h1 className={styleHome.title}>Select {this.state.select ? 'user approve' : 'your type approve'} </h1>
                            <h4 className={styleHome.subtitle}></h4>

                            <div className={`${styleHome.assetContainer} row`}>
                                {!this.state.select ? (
                                    <>
                                        <div 
                                        onClick={() => this.openModalApprove()} 
                                        className="col-12 col-md-6 col-lg-3 mb-4">
                                            <div className={styleHome.assetCard1}>
                                                <FaFileSignature size={150} className='mt-4 mb-4' />
                                                <p className='mt-2 mb-4 sizeCh'>Digital approve</p>
                                            </div>
                                        </div>
                                        <div 
                                        onClick={() => this.selectUser('open')} 
                                        className="col-12 col-md-6 col-lg-3 mb-4">
                                            <div className={styleHome.assetCard1}>
                                                <FaUpload size={150} className='mt-4 mb-4' />
                                                <p className='mt-2 mb-4 sizeCh'>Upload File Approve</p>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    appData.map(item => {
                                        return (
                                            <div 
                                            onClick={userApp.find(x => x === item.id) ? () => this.declineUser(item.id) : () => this.chooseUser(item.id) } 
                                            className="col-12 col-md-6 col-lg-3 mb-4">
                                                <div className={userApp.find(x => x === item.id) ? styleHome.userSelect : styleHome.assetCard1}>
                                                    <FiUser size={150} className='mt-4 mb-4' />
                                                    <p className='mt-2 mb-4 sizeCh'>{item.jabatan}</p>
                                                </div>
                                            </div>
                                        )
                                     })
                                )}
                            </div>
                            </main>
                        </div>
                        <hr />
                        <div className='rowBetween'>
                            <div className='rowGeneral'>
                                {this.state.select && (
                                    <div className='red sizeNote'>* Dapat memilih sebagian atau semua user</div>
                                )}
                            </div>
                            <div className='rowGeneral'>
                                {this.state.select && (
                                    <Button disabled={userApp.length === 0 ? true : false} onClick={() => this.prepSendEmail('approve')} className='mr-1' color='primary'>Approve</Button>
                                )}
                                <Button onClick={this.chooseApprove} color='secondary'>Close</Button>
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
                <Modal isOpen={this.state.modalTrack} toggle={() => {this.openModalTrack()}} size="xl" className='xl'>
                    <TrackingDisposal tipe={this.state.tipeTrack} />
                    <hr />
                    <div className="modalFoot ml-3">
                        {/* <Button color="primary" onClick={() => this.openModPreview({nama: 'disposal pengajuan', no: detailDis[0] !== undefined && detailDis[0].no_persetujuan})}>Preview</Button> */}
                        <div></div>
                        <div className="btnFoot">
                            <Button color="primary" onClick={() => {this.openModalTrack()}}>
                                Close
                            </Button>
                        </div>
                    </div>
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
                        ) : this.state.confirm === 'wrongApp' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Pilih User</div>
                                <div className="errApprove mt-2">Pilih data user secara berurutan</div>
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
                        ) : this.state.confirm === 'falseSubmit' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                    <div className={[style.sucUpdate, style.green]}>Gagal Submit</div>
                                    <div className="errApprove mt-2">Pilih data disposal terlebih dahulu</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'falseDoc' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                    <div className={[style.sucUpdate, style.green]}>Gagal Approve</div>
                                    <div className="errApprove mt-2">Mohon upload dokumen terlebih dahulu</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'submit' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Submit</div>
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
                <Modal isOpen={this.state.openDraft} size='xl'>
                    <ModalHeader>Email Pemberitahuan</ModalHeader>
                    <ModalBody>
                        <Email handleData={this.getMessage} tipe={'persetujuan'}/>
                        <div className={style.foot}>
                            <div></div>
                            <div>
                                {userApp.length > 0 && arrApp.length > 0 && detailDis.length > 0 && arrApp.find(item => item.noDis === detailDis[0].no_persetujuan).app.way_app === 'upload' ? (
                                    <Button color="success" className="mr-2">
                                        <label>
                                            <input type="file" className="file-upload2" onChange={this.approveUpload}/>
                                            Approve Upload & Send Email
                                        </label>
                                    </Button>
                                ) : (
                                <Button
                                    disabled={this.state.message === '' ? true : false} 
                                    className="mr-2"
                                    onClick={tipeEmail === 'reject' 
                                    ? () => this.rejectDisposal(this.state.dataRej)
                                    : tipeEmail === 'submit' ? () => this.prosesSendEmail('submit')
                                    : () => this.prosesApprove()
                                    } 
                                    color="primary"
                                >
                                    {tipeEmail === 'reject' ? 'Reject' : tipeEmail === 'submit' ? 'Submit' : 'Approve'} & Send Email
                                </Button>
                                )}
                                {tipeEmail !== 'submit' && (
                                    <Button className="mr-3" onClick={this.openDraftEmail}>Cancel</Button>
                                )}
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
    depo: state.depo,
    tempmail: state.tempmail,
    newnotif: state.newnotif,
    user: state.user,
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
    getDetailDisposal: disposal.getDetailDisposal,
    getNewDetailDis: disposal.getNewDetailDisposal,
    getApproveSetDisposal: setuju.getApproveSetDisposal,
    approveSetDisposal: setuju.approveSetDisposal,
    rejectSetDisposal: setuju.rejectSetDisposal,
    notifDisposal: notif.notifDisposal,
    getNotif: notif.getNotif,
    resetAppSet: setuju.resetAppSet,
    getDraftEmail: tempmail.getDraftEmail,
    sendEmail: tempmail.sendEmail,
    addNewNotif: newnotif.addNewNotif,
    getDetailUser: user.getDetailUser,
    getDetailDepo: depo.getDetailDepo,
    getDepo: depo.getDepo,
    getRole: user.getRole,
    submitSetDisposal: setuju.submitSetDisposal,
    genNoSetDisposal: setuju.genNoSetDisposal,
    getUser: user.getUser,
    searchDisposal: disposal.searchDisposal,
    uploadDocumentDis: disposal.uploadDocumentDis,
}

export default connect(mapStateToProps, mapDispatchToProps)(Disposal)
