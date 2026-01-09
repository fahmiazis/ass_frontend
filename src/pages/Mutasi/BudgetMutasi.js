/* eslint-disable jsx-a11y/no-distracting-elements */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react'
import { Container, NavbarBrand, Table, Input, Button, Col, Card, CardBody,
    Alert, Spinner, Row, Modal, ModalBody, ModalHeader, ModalFooter, Collapse,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap'
import style from '../../assets/css/input.module.css'
import {FaSearch, FaUserCircle, FaBars, FaCartPlus, FaFileSignature} from 'react-icons/fa'
import {BsCircle, BsBell, BsFillCircleFill} from 'react-icons/bs'
import { FiSend, FiTruck, FiSettings, FiUpload } from 'react-icons/fi'
import { MdAssignment } from 'react-icons/md'
import { AiOutlineCheck, AiOutlineClose, AiFillCheckCircle, AiOutlineInbox} from 'react-icons/ai'
import {Formik} from 'formik'
import * as Yup from 'yup'
import Pdf from "../../components/Pdf"
import asset from '../../redux/actions/asset'
import pengadaan from '../../redux/actions/pengadaan'
import approve from '../../redux/actions/approve'
import {connect} from 'react-redux'
import moment from 'moment'
import auth from '../../redux/actions/auth'
import setuju from '../../redux/actions/setuju'
import {default as axios} from 'axios'
import Sidebar from "../../components/Header"
import MaterialTitlePanel from "../../components/material_title_panel"
import SidebarContent from "../../components/sidebar_content"
import placeholder from  "../../assets/img/placeholder.png"
import disposal from '../../redux/actions/disposal'
import TablePeng from '../../components/TablePeng'
import notif from '../../redux/actions/notif'
import mutasi from '../../redux/actions/mutasi'
import tempmail from '../../redux/actions/tempmail'
import newnotif from '../../redux/actions/newnotif'
import NavBar from '../../components/NavBar'
import logo from '../../assets/img/logo.png'
import styleTrans from '../../assets/css/transaksi.module.css'
import NewNavbar from '../../components/NewNavbar'
import Email from '../../components/Mutasi/Email'
import TrackingMutasi from '../../components/Mutasi/TrackingMutasi'
import debounce from 'lodash.debounce';
import Select from 'react-select/creatable';
import FormMutasi from '../../components/Mutasi/FormMutasi'
const {REACT_APP_BACKEND_URL} = process.env

const alasanSchema = Yup.object().shape({
    alasan: Yup.string()
});

const sapSchema = Yup.object().shape({
    doc_sap: Yup.string().required()
})

const budSchema = Yup.object().shape({
    cost_centerawal: Yup.string().required()
})

class BudgetMutasi extends Component {

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
            dataRinci: {},
            rincian: false,
            img: '',
            newMut: [],
            formMut: false,
            detailMut: [],
            openModalDoc: false,
            openPdf: false,
            idDoc: 0,
            fileName: {},
            date: '',
            listMut: [],
            modalConfirm: false,
            openApproveDis: false,
            openRejectDis: false,
            approve: false,
            reject: false,
            confirm: '',
            time: 'pilih',
            time1: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
            // time1: moment().startOf('month').format('YYYY-MM-DD'),
            time2: moment().endOf('month').format('YYYY-MM-DD'),
            search: '',
            listStat: [],
            typeReject: '',
            menuRev: '',
            tipeEmail: '',
            userRev: '',
            dataRej: {},
            subject: '',
            message: '',
            collap: false,
            formTrack: false,
            options: [],
            limit: 100
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
        
        const status = filter === 'selesai' ? 8 : filter === 'available' ? 3 : 'all'

        if (val === null || val === undefined || val.length === 0) {
            this.setState({ options: [] })
        } else {
            await this.props.searchMutasi(token, status, cekTime1, cekTime2, val, limit)

            const { dataSearch } = this.props.mutasi
            const firstOption = [
                {value: val, label: val}
            ]
            const secondOption = [
                {value: '', label: ''}
            ]
            
    
            for (let i = 0; i < dataSearch.length; i++) {
                const dataArea = dataSearch[i].area
                const dataNo = dataSearch[i].no_mutasi
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

    userApp = (val) => {
        this.setState({ userRev: val })
    }

    userRej = (val) => {
        const { userRev } = this.state
        if (userRev === val) {
            this.setState({ userRev: '' })
        }
    }

    chekRej = (val) => {
        const { listMut } = this.state
        const data = []
        if (val === 'all') {
            this.setState({ listMut: data })
        } else {
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

    chekApp = (val) => {
        const { listMut } = this.state
        const { detailMut } = this.props.mutasi
        const data = []
        if (val === 'all') {
            for (let i = 0; i < detailMut.length; i++) {
                data.push(detailMut[i].id)
            }
            this.setState({ listMut: data })
        } else {
            listMut.push(val)
            this.setState({ listMut: listMut })
        }
    }

    getMessage = (val) => {
        this.setState({ message: val.message, subject: val.subject })
        console.log(val)
    }

    prosesSidebar = (val) => {
        this.setState({ sidebarOpen: val })
    }

    goRoute = (val) => {
        this.props.history.push(`/${val}`)
    }

    menuButtonClick(ev) {
        ev.preventDefault();
        this.onSetOpen(!this.state.open);
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
        await this.props.rejectDocMut(token, fileName.id, value, 'edit')
        this.openModalPdf()
    }

    openModalRinci = () => {
        this.setState({rincian: !this.state.rincian})
    }

    onSetOpen(open) {
        this.setState({ open });
    }

    getNotif = async () => {
        const token = localStorage.getItem("token")
        await this.props.getNotif(token)
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

    openConfirm = () => {
        this.setState({modalConfirm: !this.state.modalConfirm})
    }

    openModalPdf = () => {
        this.setState({openPdf: !this.state.openPdf})
    }

    getDataMutasi = async () => {
        const level = localStorage.getItem('level')
        const token = localStorage.getItem('token')
        this.changeFilter('available')
    }

    changeFilter = async (val) => {
        const token = localStorage.getItem("token")
        const role = localStorage.getItem('role')
        const level = localStorage.getItem('level')
        const { time1, time2, search, limit } = this.state
        const cekTime1 = time1 === '' ? 'undefined' : time1
        const cekTime2 = time2 === '' ? 'undefined' : time2
        const status = val === 'selesai' ? 8 : val === 'available' ? 3 : 'all'

        await this.props.getMutasi(token, status, cekTime1, cekTime2, search, limit)
        const { dataMut } = this.props.mutasi
        const newMut = []
        console.log(val)
        for (let i = 0; i < dataMut.length; i++) {
            const cekBudget = dataMut[i].status_form === 3
            const cekAsset = dataMut[i].status_form === 4
            if (val === 'available') {
                if (((level === '8' && cekBudget) || (level === '2' && cekAsset)) && dataMut[i].status_reject !== 1) {
                    newMut.push(dataMut[i])
                }
            } else if (val === 'reject') {
                if (dataMut[i].status_reject === 1) {
                    newMut.push(dataMut[i])
                }
            } else if (val === 'selesai') {
                if (dataMut[i].status_form === 8) {
                    newMut.push(dataMut[i])
                }
            } else {
                if (((level === '8' && cekBudget) || (level === '2' && cekAsset)) && dataMut[i].status_reject !== 1) {
                    console.log('')
                } else {
                    newMut.push(dataMut[i])
                }
            }
        }
        this.setState({ filter: val, newMut: newMut })
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
        // const status = filter === 'selesai' ? '8' : filter === 'available' && level === '2' ? '1' : filter === 'available' && level === '8' ? '3' : 'all'
        this.changeFilter(filter)
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

    openReject = () => {
        this.setState({reject: !this.state.reject})
    }

    openDetailMut = async (val) => {
        const level = localStorage.getItem('level')
        const token = localStorage.getItem('token')
        await this.props.getDetailMutasi(token, val.no_mutasi, 'budget')
        await this.props.getApproveMut(token, val.no_mutasi, val.kode_plant.split('').length === 4 ? 'Mutasi' : 'Mutasi HO')
        this.openModalMut()
    }

    getDetailTrack = async (val) => {
        const token = localStorage.getItem("token")
        await this.props.getDetailMutasi(token, val.no_mutasi)
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

    componentDidMount() {
        // this.getNotif()
        this.getDataMutasi()
    }

    componentDidUpdate() {
        const { errorAdd, rejReject, rejApprove, isReject, isApprove, isRejDoc, submitBud } = this.props.mutasi
        const {isAppDoc} = this.props.disposal
        const token = localStorage.getItem('token')
        const level = localStorage.getItem('level')
        const { detailMut } = this.props.mutasi
        if (errorAdd) {
            this.openConfirm(this.setState({confirm: 'addmutasi'}))
            this.props.resetAddMut()
        } 
        // else if (isReject) {
        //     this.setState({listMut: []})
        //     this.openReject()
        //     this.openConfirm(this.setState({confirm: 'reject'}))
        //     this.openModalMut()
        //     this.props.resetMutasi()
        // } 
        // else if (submitBud) {
        //     this.openConfirm(this.setState({confirm: 'approve'}))
        //     this.openApprove()
        //     this.props.resetMutasi()
        // } 
        else if (rejReject) {
            this.openReject()
            this.openConfirm(this.setState({confirm: 'rejReject'}))
            this.props.resetMutasi()
        } else if (rejApprove) {
            this.openConfirm(this.setState({confirm: 'rejApprove'}))
            this.openApprove()
            this.props.resetMutasi()
        } else if (isAppDoc === true || isRejDoc === true) {
            setTimeout(() => {
                this.props.resetDis()
                this.props.resetMutasi()
             }, 1000)
             setTimeout(() => {
                this.props.getDocumentMut(token, detailMut[0].no_asset, detailMut[0].no_mutasi)
                this.props.getDetailMutasi(token, detailMut[0].no_mutasi, level === '2' ? null : 'budget') 
                this.getDataMutasi()
             }, 1100)
        }
    }

    openApprove = () => {
        this.setState({approve: !this.state.approve})
    }

    openModalMut = () => {
        this.setState({formMut: !this.state.formMut, listMut: []})
    }

    openModalRejectDis = () => {
        this.setState({openRejectDis: !this.state.openRejectDis})
    }

    openModalApproveDis = () => {
        this.setState({openApproveDis: !this.state.openApproveDis})
    }

    changeView = async (val) => {
        const { dataMut, noMut } = this.props.mutasi
        const newMut = []
        for (let i = 0; i < noMut.length; i++) {
            const index = dataMut.indexOf(dataMut.find(({no_mutasi}) => no_mutasi === noMut[i]))
            if (dataMut[index] !== undefined) {
                newMut.push(dataMut[index])
            }
        }
        this.setState({newMut: newMut})
    }

    openProsesModalDoc = async (val) => {
        const token = localStorage.getItem('token')
        const { detailMut } = this.props.mutasi
        await this.props.getDocumentMut(token, detailMut[0].no_asset, detailMut[0].no_mutasi)
        this.closeProsesModalDoc()
    }

    

    prepReject = async (val) => {
        const { detailMut } = this.props.mutasi
        const { listStat, listMut, typeReject, menuRev, userRev } = this.state
        const token = localStorage.getItem("token")
        const level = localStorage.getItem('level')
        if (typeReject === 'pembatalan' && listMut.length !== detailMut.length) {
            this.setState({ confirm: 'falseCancel' })
            this.openConfirm()
        } else {
            const tipe = 'reject'
            const menu = 'Pengajuan Mutasi Asset (Mutasi asset)'
            const tempno = {
                no: detailMut[0].no_mutasi,
                kode: userRev,
                jenis: 'mutasi',
                tipe: tipe,
                typeReject: typeReject,
                menu: menu
            }
            this.setState({ tipeEmail: 'reject', dataRej: val })
            await this.props.getDraftEmail(token, tempno)
            this.openDraftEmail()
        }

    }

    prepSendEmail = async () => {
        const { detailMut } = this.props.mutasi
        const token = localStorage.getItem("token")

        const app = detailMut[0].appForm
        const tempApp = []
        for (let i = 0; i < app.length; i++) {
            if (app[i].status === 1) {
                tempApp.push(app[i])
            }
        }
        const tipe = 'submit'

        const tempno = {
            no: detailMut[0].no_mutasi,
            kode: detailMut[0].kode_plant,
            jenis: 'mutasi',
            tipe: tipe,
            menu: 'Verifikasi Budget (Mutasi asset)'
        }
        this.setState({ tipeEmail: 'submit' })
        await this.props.getDetailMutasi(token, detailMut[0].no_mutasi)
        await this.props.getDraftEmail(token, tempno)
        this.openDraftEmail()
    }

    submitMutasi = async () => {
        const { detailMut } = this.props.mutasi
        const token = localStorage.getItem("token")
        await this.props.submitBudget(token, detailMut[0].no_mutasi)
        this.prosesSendEmail('submit')
        this.openDraftEmail()
        this.openApprove()
        this.openModalMut()
        this.setState({ confirm: 'approve' })
        this.openConfirm()
        this.getDataMutasi()
    }

    rejectMutasi = async (val) => {
        const { listStat, listMut, typeReject, menuRev, userRev } = this.state
        const { detailMut } = this.props.mutasi
        const level = localStorage.getItem('level')
        const token = localStorage.getItem("token")
        let temp = ''
        for (let i = 0; i < listStat.length; i++) {
            temp += listStat[i] + '.'
        }
        const data = {
            alasan: temp + val.alasan,
            no: detailMut[0].no_mutasi,
            menu: typeReject === 'pembatalan' ? 'Mutasi asset' : menuRev,
            list: listMut,
            type: 'verif',
            type_reject: typeReject,
            user_rev: userRev
        }
        console.log(data)
        await this.props.rejectMut(token, data)
        this.prosesSendEmail(`reject ${typeReject}`)
        this.setState({ confirm: 'reject' })
        this.openConfirm()
        this.openReject()
        this.openModalMut()
        this.getDataMutasi()
        this.openDraftEmail()
    }

    prosesSendEmail = async (val) => {
        const token = localStorage.getItem('token')
        const { draftEmail } = this.props.tempmail
        const { detailMut } = this.props.mutasi
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
            no: detailMut[0].no_mutasi,
            tipe: 'mutasi',
            menu: `mutasi asset`,
            proses: val,
            route: val === 'reject perbaikan' ? 'rev-mutasi' : val === 'submit' ? 'eks-mutasi' : 'mutasi'
        }
        await this.props.sendEmail(token, sendMail)
        await this.props.addNewNotif(token, sendMail)
    }

    openDraftEmail = () => {
        this.setState({ openDraft: !this.state.openDraft })
    }

    updateEksekusi = async (val) => {
        const token = localStorage.getItem('token')
        const { detailMut } = this.props.mutasi
        const { dataRinci } = this.state
        const level = localStorage.getItem('level')
        await this.props.updateStatus(token, dataRinci.id, val)
        await this.props.getDetailMutasi(token, detailMut[0].no_mutasi, level === '2' ? null : 'budget')
        this.setState({confirm: 'edit'})
        this.openConfirm()
    }

    closeProsesModalDoc = () => {
        this.setState({openModalDoc: !this.state.openModalDoc})
    }

    updateStatus = async (val) => {
        const token = localStorage.getItem('token')
        const { detailMut } = this.props.mutasi
        const level = localStorage.getItem('level')
        await this.props.updateBudget(token, val.no, val.stat)
        await this.props.getDetailMutasi(token, detailMut[0].no_mutasi, level === '2' ? null : 'budget') 
    }

    render() {
        const dataNotif = this.props.notif.data
        const { dataRinci, newMut, listMut, fileName, listStat, tipeEmail, dataRej } = this.state
        const { dataDoc, detailMut, mutApp, infoApp } = this.props.mutasi
        const level = localStorage.getItem('level')

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
                        <h2 className={styleTrans.pageTitle}>Verifikasi Budget Mutasi Asset</h2>

                        <div className={styleTrans.searchContainer}>
                            {(level === '5' || level === '9') ? (
                                <Button size="lg" color='primary' onClick={this.goCartMut}>Create</Button>
                            ) : (
                                <div></div>
                            )}
                            <select value={this.state.filter} onChange={e => this.changeFilter(e.target.value)} className={styleTrans.searchInput}>
                                <option value="all">All</option>
                                <option value="available">Available To Approve</option>
                                <option value="reject">Reject</option>
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
                                    <th>NO</th>
                                    <th>NO.AJUAN</th>
                                    <th>AREA ASAL</th>
                                    <th>AREA TUJUAN</th>
                                    <th>TANGGAL AJUAN</th>
                                    <th>APPROVED BY</th>
                                    <th>TGL APPROVED</th>
                                    <th>OPSI</th>
                                </tr>
                            </thead>
                            <tbody>
                                {newMut !== undefined && newMut.length > 0 && newMut.map(item => {
                                    return (
                                        <tr className={item.status_reject === 0 ? 'note' : item.status_form === 0 ? 'fail' : item.status_reject === 1 && 'bad'}>
                                            <td>{newMut.indexOf(item) + 1}</td>
                                            <td>{item.no_mutasi}</td>
                                            <td>{item.area}</td>
                                            <td>{item.area_rec}</td>
                                            <td>{moment(item.tanggalMut).format('DD MMMM YYYY')}</td>
                                            <td>{item.appForm !== null && item.appForm.length > 0 && item.appForm.find(item => item.status === 1) !== undefined ? item.appForm.find(item => item.status === 1).nama + ` (${item.appForm.find(item => item.status === 1).jabatan === 'area' ? 'AOS' : item.appForm.find(item => item.status === 1).jabatan})` : '-'}</td>
                                            <td>{item.appForm !== null && item.appForm.length > 0 && item.appForm.find(item => item.status === 1) !== undefined ? moment(item.appForm.find(item => item.status === 1).updatedAt).format('DD/MM/YYYY HH:mm:ss') : '-'}</td>
                                            {/* <td>
                                            
                                            <Button className="btnSell" color="primary" onClick={() => {this.openDetailMut(item.no_mutasi); this.getDataApproveMut(item)}}>Proses</Button>
                                        </td> */}
                                            <td>
                                                <Button
                                                    color='primary'
                                                    className='mr-1 mt-1'
                                                    onClick={() => this.openDetailMut(item)}
                                                >
                                                    {this.state.filter === 'available' ? 'Proses' : 'Detail'}
                                                </Button>
                                                <Button className='mt-1' color='warning' onClick={() => this.getDetailTrack(item)}>Tracking</Button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        {newMut.length === 0 && (
                            <div className={style.spinCol}>
                                <AiOutlineInbox size={50} className='secondary mb-4' />
                                <div className='textInfo'>Data ajuan tidak ditemukan</div>
                            </div>
                        )}
                    </div>
                </div>
                <Modal isOpen={this.state.rincian} toggle={this.openModalRinci} size="xl">
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
                            initialValues={{
                                // doc_sap: dataRinci.doc_sap,
                                cost_centerawal: dataRinci.cost_centerawal
                            }}
                            validationSchema={budSchema}
                            onSubmit={(values) => {this.updateEksekusi(values)}}
                            >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                                <div className="rightRinci">
                                    <div>
                                        <div className="titRinci">{dataRinci.nama_asset}</div>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Area Pengirim</Col>
                                            <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.area} disabled /></Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Area Penerima</Col>
                                            <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.area_rec} disabled /></Col>
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
                                                value={dataRinci.merk === null ? '-' : dataRinci.merk}
                                                disabled
                                                />
                                            </Col>
                                        </Row>
                                        <Row className="mb-2">
                                            <Col md={3}>Kategori</Col>
                                            <Col md={9} className="katCheck">: 
                                                <div className="katCheck">
                                                    <div className="ml-2"><input type="checkbox" disabled checked={dataRinci.kategori === 'IT' ? true : false}/> IT</div>
                                                    <div className="ml-3"><input type="checkbox" disabled checked={dataRinci.kategori === 'NON IT' ? true : false} /> Non IT</div>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Nilai Buku</Col>
                                            <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.nilai_buku === null || dataRinci.nilai_buku === undefined ? '0' : dataRinci.nilai_buku.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} disabled /></Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Nomor IO</Col>
                                            <Col md={9} className="colRinci">:  <Input 
                                                className="inputRinci"
                                                value={dataRinci.no_io} 
                                                onBlur={handleBlur("no_io")}
                                                onChange={handleChange("no_io")}
                                                disabled
                                                // disabled={detailMut.find(({no_asset}) => no_asset === dataRinci.no_asset) === undefined ? true : detailMut.find(({no_asset}) => no_asset === dataRinci.no_asset).isbudget === 'ya' ? false : true} 
                                                />
                                            </Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Cost Center IO</Col>
                                            <Col md={9} className="colRinci">:  <Input 
                                                className="inputRinci"
                                                value={values.cost_centerawal} 
                                                onBlur={handleBlur("cost_centerawal")}
                                                onChange={handleChange("cost_centerawal")}
                                                disabled={level === '2' ? true : false}
                                                // disabled={detailMut.find(({no_asset}) => no_asset === dataRinci.no_asset) === undefined ? true : detailMut.find(({no_asset}) => no_asset === dataRinci.no_asset).isbudget === 'ya' ? false : true} 
                                                />
                                            </Col>
                                        </Row>
                                        {errors.cost_centerawal && level !== '2' ? (
                                            <text className={style.txtError}>Must be filled</text>
                                        ) : null}
                                        {/* {level === '2' && (
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Nomor Doc SAP</Col>
                                                <Col md={9} className="colRinci">:  <Input className="inputRinci" 
                                                    value={values.doc_sap} 
                                                    onBlur={handleBlur("doc_sap")}
                                                    onChange={handleChange("doc_sap")} 
                                                    />
                                                </Col>
                                            </Row>
                                        )} */}
                                        {/* {errors.doc_sap && level === '2' ? (
                                            <text className={style.txtError}>Must be filled</text>
                                        ) : null} */}
                                    </div>
                                    <div className="footRinci4 mt-4">
                                        <Button className="btnFootRinci1" size="lg" color="primary" onClick={handleSubmit}>Save</Button>
                                        <Button className="btnFootRinci1 ml-3" size="lg" color="secondary" onClick={() => this.openModalRinci()}>Close</Button>
                                    </div>
                                </div>
                            )}
                            </Formik>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.formMut} toggle={this.openModalMut} size="xl" className='xl'>
                    {/* <Alert color="danger" className={style.alertWrong} isOpen={level === '2' && (detailMut.find(({doc_sap}) => doc_sap === null) !== undefined || detailMut.find(({doc_sap}) => doc_sap === '') !== undefined) ? true : false}>
                        <div>Mohon untuk isi no doc sap sebelum submit</div>
                    </Alert> */}
                    <Alert color="danger" className={style.alertWrong} isOpen={level !== '2' && (detailMut.find((item) => item.isbudget === 'ya' && (item.cost_centerawal === null || item.cost_centerawal === '')) !== undefined) ? true : false}>
                        <div>Mohon untuk isi cost center io sebelum submit</div>
                    </Alert>
                    <ModalBody>
                        {/* <div className="mb-2"><text className="txtTrans">{detailDis[0] !== undefined && detailDis[0].area}</text>, {moment(detailDis[0] !== undefined && detailDis[0].createdAt).locale('idn').format('DD MMMM YYYY ')}</div> */}
                        <Container className='xxl borderGen'>
                            <Row className="mb-5">
                                <Col md={1} className='borderGen colCenter'>
                                    <img src={logo} className="imgMut" />
                                </Col>
                                <Col md={7} className='titMut borderGen'>
                                    FORM MUTASI ASSET / INVENTARIS
                                </Col>
                                <Col md={4} className='borderGen'>
                                    <Row className='ml-1'>
                                        <Col className='noPad' md={4}>No</Col>
                                        <Col className='noPad rowGeneral' md={8}>
                                            <div className='mr-1'>:</div> {detailMut.length !== 0 ? detailMut[0].no_mutasi : ''}
                                        </Col>
                                    </Row>
                                    <Row className='ml-1'>
                                        <Col className='noPad' md={4}>Tanggal Form</Col>
                                        <Col className='noPad rowGeneral' md={8}>
                                            <div className='mr-1'>:</div> {detailMut.length !== 0 ? moment(detailMut[0].tanggalMut).format('DD MMMM YYYY') : ''}
                                        </Col>
                                    </Row>
                                    <Row className='ml-1'>
                                        <Col className='noPad' md={4}>Tanggal Mutasi Fisik</Col>
                                        <Col className='noPad rowGeneral' md={8}>
                                            <div className='mr-1'>:</div> {detailMut.length !== 0 ? (detailMut[0].tgl_mutasifisik ? moment(detailMut[0].tgl_mutasifisik).format('DD MMMM YYYY') : '-') : ''}
                                        </Col>
                                    </Row>
                                    <Row className='ml-1'>
                                        <Col className='noPad' md={4}>Cabang / Depo</Col>
                                        <Col className='noPad rowGeneral' md={8}>
                                            <div className='mr-1'>:</div> {detailMut.length !== 0 ? detailMut[0].area : ''}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Table bordered className="tableDis mb-3">
                                <thead>
                                    <tr>
                                        <th rowSpan={2} className='noTh'></th>
                                        <th rowSpan={2} className='noTh'>Opsi</th>
                                        {/* <th className='noTh'>No</th> */}
                                        <th rowSpan={2} className='thGen mutTableTitle'>No. Asset / No. Inventaris</th>
                                        <th rowSpan={2} className='asetTh mutTableTitle'>Nama Asset / Inventaris</th>
                                        <th rowSpan={2} className='thGen mutTableTitle'>Type / Merk</th>
                                        <th rowSpan={2} className='thGen mutTableTitle'>
                                            Kategori
                                            <br />
                                            (Aset / Inventaris)
                                        </th>
                                        <th className='thGen mutTableTitle' colSpan={2}>Cost Center Lama</th>
                                        <th className='thGen mutTableTitle' colSpan={2}>Cost Center Baru</th>
                                    </tr>
                                    <tr>
                                        <th className='thGen mutTableTitle'>Cabang / Depo</th>
                                        <th className='thGen mutTableTitle'>Cost Center</th>
                                        <th className='thGen mutTableTitle'>Cabang / Depo</th>
                                        <th className='thGen mutTableTitle'>Cost Center</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detailMut.length !== 0 && detailMut.map(item => {
                                        return (
                                            <tr >
                                                <td>
                                                    <Input
                                                        addon
                                                        disabled={item.status_app === 0 ? true : false}
                                                        checked={item.status_app === 0 ? true : listMut.find(element => element === item.id) !== undefined ? true : false}
                                                        type="checkbox"
                                                        onClick={listMut.find(element => element === item.id) === undefined ? () => this.chekApp(item.id) : () => this.chekRej(item.id)}
                                                        value={item.id} />
                                                </td>
                                                {/* <td scope="row">{detailMut.indexOf(item) + 1}</td> */}
                                                <td>
                                                    {item.isbudget === 'ya' && this.state.filter === 'available' ? (
                                                        <Button color='success' size='md'  onClick={() => this.openModalRinci(this.setState({dataRinci: item, kode: '', img: ''}))}>
                                                            Proses
                                                        </Button>
                                                    ) : (
                                                        '-'
                                                    )}
                                                </td>
                                                <td>{item.no_asset}</td>
                                                <td>{item.nama_asset}</td>
                                                <td>{item.merk}</td>
                                                <td>{item.kategori}</td>
                                                <td>{item.area}</td>
                                                <td>{item.cost_center}</td>
                                                <td>{item.area_rec}</td>
                                                <td>{item.cost_center_rec}</td>
                                                {/* <td onClick={() => this.openRinci(this.setState({ dataRinci: item, kode: '', img: '' }))} >{item.cost_center_rec}</td> */}
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                            <div className="mb-3 mt-3 rowGeneral">
                                <div className="mr-4 alasanMut">
                                    <text className="titAlasan mb-3">Alasan Mutasi :</text>
                                    <text className="contentReason" >{detailMut.length !== 0 ? detailMut[0].alasan : ''}</text>
                                </div>
                                <div className='colGeneral ml-4'>
                                    <div className='bold underline otoSize'>Matrix Otorisasi, ditandatangani oleh :</div>
                                    <div className='bold otoSize'>Area ke Area</div>
                                    <div className='otoSize'>1. Dibuat : {pembuatApp.split(';')[4] && pembuatApp.split(';')[4]}</div>
                                    <div className='otoSize'>2. Diperiksa : {pemeriksaApp.split(';')[4] && pemeriksaApp.split(';')[4]}</div>
                                    <div className='otoSize'>3. Disetujui  : {penyetujuApp.split(';')[4] && penyetujuApp.split(';')[4]}</div>
                                </div>
                                <div className='colGeneral ml-4'>
                                    <br />
                                    <div className='bold otoSize'>HO ke Area</div>
                                    <div className='otoSize'>1. Dibuat : {pembuatApp.split(';')[2] && pembuatApp.split(';')[2]}</div>
                                    <div className='otoSize'>2. Diperiksa : {pemeriksaApp.split(';')[2] && pemeriksaApp.split(';')[2]}</div>
                                    <div className='otoSize'>3. Disetujui  : {penyetujuApp.split(';')[2] && penyetujuApp.split(';')[2]}</div>
                                </div>
                            </div>
                            <Table bordered responsive className="tabPreview">
                                <thead>
                                    <tr>
                                        <th className="buatPre" colSpan={mutApp.pembuat?.length || 1}>Dibuat oleh,</th>
                                        <th className="buatPre" colSpan={mutApp.penerima?.length || 1}>Diterima oleh,</th>
                                        <th className="buatPre" rowSpan={2} colSpan={
                                            mutApp.pemeriksa?.filter(item => item.status_view !== 'hidden').length || 1
                                        }>Diperiksa oleh,</th>
                                        <th className="buatPre" rowSpan={2} colSpan={mutApp.penyetuju?.length || 1}>Disetujui oleh,</th>
                                    </tr>
                                    <tr>
                                        <th className="buatPre">Pengirim</th>
                                        <th className="buatPre">Penerima</th>
                                    </tr>
                                    <tr>
                                        {mutApp.pembuat?.map(item => (
                                            <th className="headPre">
                                                <div>{item.status === 0 ? 'Reject' : item.status === 1 ? moment(item.updatedAt).format('LL') : '-'}</div>
                                                <div>{item.nama ?? '-'}</div>
                                            </th>
                                        ))}
                                        {mutApp.penerima?.map(item => (
                                            <th className="headPre">
                                                <div>{item.status === 0 ? 'Reject' : item.status === 1 ? moment(item.updatedAt).format('LL') : '-'}</div>
                                                <div>{item.nama ?? '-'}</div>
                                            </th>
                                        ))}
                                        {mutApp.pemeriksa?.filter(item => item.status_view !== 'hidden').map(item => (
                                            <th className="headPre">
                                                <div>{item.status === 0 ? 'Reject' : item.status === 1 ? moment(item.updatedAt).format('LL') : '-'}</div>
                                                <div>{item.nama ?? '-'}</div>
                                            </th>
                                        ))}
                                        {mutApp.penyetuju?.map(item => (
                                            <th className="headPre">
                                                <div>{item.status === 0 ? 'Reject' : item.status === 1 ? moment(item.updatedAt).format('LL') : '-'}</div>
                                                <div>{item.nama ?? '-'}</div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        {mutApp.pembuat?.map(item => (
                                            <td className="footPre">{item.jabatan ?? '-'}</td>
                                        ))}
                                        {mutApp.penerima?.map(item => (
                                            <td className="footPre">{item.jabatan ?? '-'}</td>
                                        ))}
                                        {mutApp.pemeriksa?.filter(item => item.status_view !== 'hidden').map(item => (
                                            <td className="footPre">{item.jabatan ?? '-'}</td>
                                        ))}
                                        {mutApp.penyetuju?.map(item => (
                                            <td className="footPre">{item.jabatan ?? '-'}</td>
                                        ))}
                                    </tr>
                                </tbody>
                            </Table>
                        </Container>
                        <Container className='xxl'>
                            <div>FRM-HCD-104 REV 07</div>
                            {(detailMut.length > 0 && detailMut[0].status_form === 8) && (
                                <div className='justiceEnd mt-4 rowCenter'>
                                    <div className='boxRec'>
                                        <div className='mb-3'>DITERIMA ASSET PMA HO</div>
                                        <br />
                                        <div>{moment(detailMut[0].tgl_mutasisap).format('DD/MM/YYYY')}</div>
                                        <div>PENERIMA: {detailMut[0].pic_aset}</div>
                                    </div>
                                    <div className='boxRec ml-4'>
                                        <div className='mb-3'>EKSEKUSI DI SAP</div>
                                        <div>{moment(detailMut[0].tgl_mutasisap).format('DD/MM/YYYY')}</div>
                                        <div>NO. DOC: {detailMut.reduce((accumulator, object) => {
                                            return accumulator + ` ${object.doc_sap},`
                                            }, 0).slice(2, -1)}
                                        </div>
                                        <div>PENCATAT: {detailMut[0].pic_aset}</div>
                                    </div>
                                </div>
                            )}
                        </Container>
                    </ModalBody>
                    <hr />
                    <div className="modalFoot ml-3">
                    {/* onClick={() => this.openModPreview({nama: 'disposal pengajuan', no: detailDis[0] !== undefined && detailDis[0].no_disposal})} */}
                        <div className="btnFoot">
                            <FormMutasi className='mr-2' />
                        </div>
                        <div className="btnFoot">
                            {this.state.filter === 'available' ? (
                                <>
                                    <Button className="mr-2" disabled={listMut.length === 0 ? true : false} color="danger" onClick={() => this.openReject()}>
                                        Reject
                                    </Button>
                                    <Button color="success" disabled={detailMut.find((item) => item.isbudget === 'ya' && (item.cost_centerawal === null || item.cost_centerawal === '')) !== undefined ? true : false} onClick={() => this.openApprove()}>
                                        Submit
                                    </Button>
                                </>
                            ) : (
                                <Button onClick={this.openModalMut}>
                                    Close
                                </Button>
                            )}
                        </div>
                    </div>
                </Modal>
                <Modal isOpen={this.state.formTrack} toggle={() => this.openModalTrack()} size="xl">
                    <TrackingMutasi />
                    <hr />
                    <div className="modalFoot ml-3">
                        {/* <Button color="primary" onClick={() => this.openModPreview({nama: 'disposal pengajuan', no: detailMut[0] !== undefined && detailMut[0].no_mutasi})}>Preview</Button> */}
                        <div></div>
                        <div className="btnFoot">
                            <Button color="primary" onClick={() => this.openModalTrack()}>
                                Close
                            </Button>
                        </div>
                    </div>
                </Modal>
                <Modal size="xl" isOpen={this.state.openModalDoc} toggle={this.closeProsesModalDoc}>
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
                                        <Col md={6} lg={6} className="colDoc">
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
                        <Button color="primary" onClick={this.closeProsesModalDoc}>
                            Save 
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
                        {level === '2' ? (
                            <div>
                                <Button color="danger" disabled={fileName.divisi === '3' ? true : false} className="mr-3" onClick={this.openModalRejectDis}>Reject</Button>
                                <Button color="primary" disabled={fileName.divisi === '0' ? true : false} onClick={this.openModalApproveDis}>Approve</Button>
                            </div>
                        ) : (
                            <Button color="primary" onClick={this.openModalPdf}>Close</Button>
                        )}
                    </div>
                </ModalBody>
            </Modal>
            <Modal isOpen={this.state.modalConfirm} toggle={this.openConfirm}>
                <ModalBody>
                    {this.state.confirm === 'approve' ?(
                        <div>
                            <div className={style.cekUpdate}>
                            <AiFillCheckCircle size={80} className={style.green} />
                            <div className={[style.sucUpdate, style.green]}>Berhasil Submit Mutasi</div>
                        </div>
                        </div>
                    ) : this.state.confirm === 'reject' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Reject Mutasi</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'rejApprove' ?(
                        <div>
                            <div className={style.cekUpdate}>
                            <AiOutlineClose size={80} className={style.red} />
                            <div className={[style.sucUpdate, style.green]}>Gagal Approve Form Mutasi</div>
                            <div className="errApprove mt-2">{this.props.disposal.alertM === undefined ? '' : this.props.disposal.alertM}</div>
                        </div>
                        </div>
                    ) : this.state.confirm === 'rejReject' ?(
                        <div>
                            <div className={style.cekUpdate}>
                            <AiOutlineClose size={80} className={style.red} />
                            <div className={[style.sucUpdate, style.green]}>Gagal Reject Form Mutasi</div>
                            <div className="errApprove mt-2">{this.props.disposal.alertM === undefined ? '' : this.props.disposal.alertM}</div>
                        </div>
                        </div>
                    ) : this.state.confirm === 'addmutasi' ?(
                        <div>
                            <div className={style.cekUpdate}>
                            <AiOutlineClose size={80} className={style.red} />
                            <div className={[style.sucUpdate, style.green]}>Gagal Menambahkan Item Mutasi</div>
                            <div className="errApprove mt-2">{this.props.mutasi.alertM === undefined ? '' : this.props.mutasi.alertM}</div>
                        </div>
                        </div>
                    ) : this.state.confirm === 'edit' ? (
                        <div>
                            <div className={style.cekUpdate}>
                            <AiFillCheckCircle size={80} className={style.green} />
                            <div className={[style.sucUpdate, style.green]}>Berhasil Update</div>
                        </div>
                        </div>
                    ) : (
                        <div></div>
                    )}
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
            <Modal isOpen={this.state.approve} toggle={this.openApprove} centered={true}>
                <ModalBody>
                    <div className={style.modalApprove}>
                        <div>
                            <text>
                                Anda yakin untuk submit
                                <text className={style.verif}> mutasi </text>
                                pada tanggal
                                <text className={style.verif}> {moment().format('LL')}</text> ?
                            </text>
                        </div>
                        <div className={style.btnApprove}>
                            <Button color="primary" onClick={this.prepSendEmail}>Ya</Button>
                            <Button color="secondary" onClick={this.openApprove}>Tidak</Button>
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
            <Modal isOpen={this.state.reject} toggle={this.openReject} centered={true}>
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

                                {this.state.typeReject === 'perbaikan' && detailMut.length > 0 && (
                                    <>
                                        <div className='mb-2 mt-2 titStatus'>Pilih User Revisi :</div>
                                        <div className="ml-2">
                                            <Input
                                                addon
                                                type="checkbox"
                                                checked={this.state.userRev === `${detailMut[0].kode_plant}` ? true : false}
                                                onClick={this.state.userRev === `${detailMut[0].kode_plant}` ? () => this.userRej(`${detailMut[0].kode_plant}`) : () => this.userApp(`${detailMut[0].kode_plant}`)}
                                            />  {`${detailMut[0].kode_plant}-${detailMut[0].area}`} (Pengirim)
                                        </div>
                                        <div className="ml-2">
                                            <Input
                                                addon
                                                type="checkbox"
                                                checked={this.state.userRev === `${detailMut[0].kode_plant_rec}` ? true : false}
                                                onClick={this.state.userRev === `${detailMut[0].kode_plant_rec}` ? () => this.userRej(`${detailMut[0].kode_plant_rec}`) : () => this.userApp(`${detailMut[0].kode_plant_rec}`)}
                                            />  {`${detailMut[0].kode_plant_rec}-${detailMut[0].area_rec}`} (Penerima)
                                        </div>
                                        <div className='ml-2'>
                                            {this.state.userRev === '' ? (
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
                                        checked={listStat.find(element => element === 'Asset mutasi tidak sesuai') !== undefined ? true : false}
                                        onClick={listStat.find(element => element === 'Asset mutasi tidak sesuai') === undefined ? () => this.statusApp('Asset mutasi tidak sesuai') : () => this.statusRej('Asset mutasi tidak sesuai')}
                                    />  Asset mutasi tidak sesuai
                                </div>
                                <div className="ml-2">
                                    <Input
                                        addon
                                        type="checkbox"
                                        checked={listStat.find(element => element === 'Penerima mutasi tidak sesuai') !== undefined ? true : false}
                                        onClick={listStat.find(element => element === 'Penerima mutasi tidak sesuai') === undefined ? () => this.statusApp('Penerima mutasi tidak sesuai') : () => this.statusRej('Penerima mutasi tidak sesuai')}
                                    />  Penerima mutasi tidak sesuai
                                </div>
                                <div className="ml-2">
                                    <Input
                                        addon
                                        type="checkbox"
                                        checked={listStat.find(element => element === 'Alasan mutasi tidak sesuai') !== undefined ? true : false}
                                        onClick={listStat.find(element => element === 'Alasan mutasi tidak sesuai') === undefined ? () => this.statusApp('Alasan mutasi tidak sesuai') : () => this.statusRej('Alasan mutasi tidak sesuai')}
                                    />  Alasan mutasi tidak sesuai
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
                                    <Button className='ml-2' color="secondary" onClick={this.openReject}>Close</Button>
                                </div>
                            </div>
                        )}
                    </Formik>
                </ModalBody>
            </Modal>
            <Modal isOpen={
                this.props.mutasi.isLoading ||
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
                                onClick={tipeEmail === 'reject' 
                                    ? () => this.rejectMutasi(dataRej)
                                    : () => this.submitMutasi()
                                }
                                color="primary"
                            >
                                {tipeEmail === 'reject' ? 'Reject' : 'Submit'} & Send Email
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
    depo: state.depo,
    mutasi: state.mutasi,
    notif: state.notif,
    disposal: state.disposal,
    pengadaan: state.pengadaan,
    tempmail: state.tempmail,
    newnotif: state.newnotif,
})

const mapDispatchToProps = {
    logout: auth.logout,
    getAsset: asset.getAsset,
    resetError: asset.resetError,
    nextPage: asset.nextPage,
    addMutasi: mutasi.addMutasi,
    getMutasi: mutasi.getMutasi,
    approveMut: mutasi.approveMutasi,
    rejectMut: mutasi.rejectMutasi,
    getApproveMut: mutasi.getApproveMutasi,
    getMutasiRec: mutasi.getMutasiRec,
    getDocumentMut: mutasi.getDocumentMut,
    resetAddMut: mutasi.resetAddMut,
    resetMutasi: mutasi.resetMutasi,
    showDokumen: pengadaan.showDokumen,
    getNotif: notif.getNotif,
    rejectDocMut: mutasi.rejectDocMut,
    approveDocDis: disposal.approveDocDis,
    resetDis: disposal.reset,
    rejectEks: mutasi.rejectEksekusi,
    getDetailMutasi: mutasi.getDetailMutasi,
    updateBudget: mutasi.updateBudget,
    submitEksekusi: mutasi.submitEksekusi,
    submitBudget: mutasi.submitBudget,
    updateStatus: mutasi.updateStatus,
    addNewNotif: newnotif.addNewNotif,
    getDraftEmail: tempmail.getDraftEmail,
    sendEmail: tempmail.sendEmail,
    searchMutasi: mutasi.searchMutasi
}

export default connect(mapStateToProps, mapDispatchToProps)(BudgetMutasi)