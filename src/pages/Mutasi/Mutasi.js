/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { Component } from 'react'
import { FaUserCircle, FaBars, FaSearch, FaCartPlus, FaFileSignature } from 'react-icons/fa'
import style from '../../assets/css/input.module.css'
import {
    NavbarBrand, Row, Col, Button, Input, Modal, ModalBody, ModalHeader, Table,
    Container, Alert, ModalFooter, Spinner, Card, CardBody, Collapse
} from 'reactstrap'
import { BsCircle } from 'react-icons/bs'
import { AiOutlineCheck, AiOutlineClose, AiFillCheckCircle, AiOutlineInbox } from 'react-icons/ai'
import { MdAssignment } from 'react-icons/md'
import { FiSend, FiTruck, FiSettings, FiUpload } from 'react-icons/fi'
import SidebarContent from "../../components/sidebar_content"
import Sidebar from "../../components/Header"
import MaterialTitlePanel from "../../components/material_title_panel"
import auth from '../../redux/actions/auth'
import depo from '../../redux/actions/depo'
import mutasi from '../../redux/actions/mutasi'
import tempmail from '../../redux/actions/tempmail'
import newnotif from '../../redux/actions/newnotif'
import asset from '../../redux/actions/asset'
import { connect } from 'react-redux'
import placeholder from "../../assets/img/placeholder.png"
import Select from 'react-select'
import { Formik } from 'formik'
import TableMut from '../../components/TableMut'
import * as Yup from 'yup'
import logo from '../../assets/img/logo.png'
import moment from 'moment'
import user from '../../redux/actions/user'
import NavBar from '../../components/NavBar'
import Email from '../../components/Mutasi/Email'
import styleTrans from '../../assets/css/transaksi.module.css'
import NewNavbar from '../../components/NewNavbar'
import dokumen from '../../redux/actions/dokumen'
import Pdf from "../../components/Pdf"
import FormMutasi from '../../components/Mutasi/FormMutasi'
import TrackingMutasi from '../../components/Mutasi/TrackingMutasi'
import debounce from 'lodash.debounce';
import SelectCreate from 'react-select/creatable';
const { REACT_APP_BACKEND_URL } = process.env


const alasanSchema = Yup.object().shape({
    alasan: Yup.string()
});

const mutasiSchema = Yup.object().shape({
    kode_plant: Yup.string().required("must be filled"),
})

const dateSchema = Yup.object().shape({
    tgl_mutasifisik: Yup.date().required()
})

class Mutasi extends Component {

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
            limit: 100,
            dataRinci: {},
            rinci: false,
            img: '',
            options: [],
            kode: '',
            formMut: false,
            detailMut: [],
            reject: false,
            approve: false,
            previtew: false,
            filter: 'available',
            rincian: false,
            openModalDoc: false,
            confirm: '',
            modalConfirm: false,
            newMut: [],
            listMut: [],
            preview: false,
            formTrack: false,
            collap: false,
            tipeCol: '',
            time: 'pilih',
            time1: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
            // time1: moment().startOf('month').format('YYYY-MM-DD'),
            time2: moment().endOf('month').format('YYYY-MM-DD'),
            search: '',
            subject: '',
            message: '',
            modalDate: false,
            openPdf: false,
            idDoc: 0,
            listStat: [],
            typeReject: '',
            menuRev: '',
            tipeEmail: '',
            dataRej: {},
            loading: false,
            arrApp: [],
            selApp: {},
            errMsg: '',
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
        
        const status = filter === 'finish' ? '8' : 'all'

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

    onChangeUpload = e => {
        const { size, type } = e.target.files[0]
        this.setState({ fileUpload: e.target.files[0] })
        if (size >= 20000000) {
            this.setState({ errMsg: "Maximum upload size 20 MB", confirm: 'errMsg' })
            this.openConfirm()
        } else if (type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && type !== 'application/vnd.ms-excel' && type !== 'application/pdf' && type !== 'application/x-7z-compressed' && type !== 'application/vnd.rar' && type !== 'application/zip' && type !== 'application/x-zip-compressed' && type !== 'application/octet-stream' && type !== 'multipart/x-zip' && type !== 'application/x-rar-compressed') {
            this.setState({ errMsg: 'Invalid file type. Only excel, pdf, zip, and rar files are allowed.', confirm: 'errMsg' })
            this.openConfirm()
        } else {
            const { detail } = this.state
            const token = localStorage.getItem('token')
            const data = new FormData()
            data.append('document', e.target.files[0])
            this.props.uploadDocument(token, detail.id, data)
        }
    }

    chekApp = (val) => {
        const { listMut } = this.state
        listMut.push(val)
        this.setState({ listMut: listMut })
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
        this.setState({ listMut: data })
    }

    menuButtonClick(ev) {
        ev.preventDefault();
        this.onSetOpen(!this.state.open);
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

    openRinci = () => {
        this.setState({ rincian: !this.state.rincian })
    }

    openConfirm = () => {
        this.setState({ modalConfirm: !this.state.modalConfirm })
    }


    openModalMut = () => {
        this.setState({ formMut: !this.state.formMut, listMut: [] })
    }

    onSetOpen(open) {
        this.setState({ open });
    }

    async componentDidMount() {
        const level = localStorage.getItem('level')
        const token = localStorage.getItem('token')
        const id = localStorage.getItem('id')
        const filter = this.props.location.state === undefined ? '' : this.props.location.state.filter
        if (filter === 'finish' || filter === 'all') {
            this.setState({filter: filter})
        }
        await this.props.getRole(token)
        await this.props.getDepo(token, 1000, '')
        await this.props.getDetailUser(token, id)
        this.getDataMutasi()
    }

    showDokumen = async (value) => {
        const token = localStorage.getItem('token')
        const {detailMut} = this.props.mutasi
        await this.props.showDokumen(token, value.id)
        this.setState({ date: value.updatedAt, idDoc: value.id, fileName: value })
        console.log(value)
        const { isShow } = this.props.dokumen
        if (isShow) {
            this.openModalPdf()
        }
    }

    openModalPdf = () => {
        this.setState({openPdf: !this.state.openPdf})
    }

    async componentDidUpdate() {
        const token = localStorage.getItem('token')
        const { errorAdd, rejReject, rejApprove, isReject, isApprove, isUpload, detailMut } = this.props.mutasi
        if (errorAdd) {
            this.openConfirm(this.setState({ confirm: 'addmutasi' }))
            this.props.resetAddMut()
        } 
        // else if (isReject) {
        //     this.setState({ listMut: [] })
        //     this.openReject()
        //     this.openConfirm(this.setState({ confirm: 'reject' }))
        //     this.openModalMut()
        //     this.props.resetMutasi()
        //     this.getDataMutasi()
        // }
        //  else if (isApprove) {
        //     this.openConfirm(this.setState({ confirm: 'approve' }))
        //     this.openApprove()
        //     this.openModalMut()
        //     this.props.resetMutasi()
        //     this.getDataMutasi()
        // } 
        else if (rejReject) {
            this.openReject()
            this.openConfirm(this.setState({ confirm: 'rejReject' }))
            this.props.resetMutasi()
        } else if (rejApprove) {
            this.openConfirm(this.setState({ confirm: 'rejApprove' }))
            this.openApprove()
            this.props.resetMutasi()
        } else if (isUpload) {
            this.props.resetMutasi()
            await this.props.getDocumentMut(token, detailMut[0].no_asset, detailMut[0].no_mutasi)
            await this.props.getDetailMutasi(token, detailMut[0].no_mutasi)
        }
    }

    goRevisi = () => {
        this.props.history.push('/rev-mutasi')
    }

    openProsesModalDoc = async () => {
        const token = localStorage.getItem('token')
        const { detailMut } = this.props.mutasi
        await this.props.getDocumentMut(token, detailMut[0].no_asset, detailMut[0].no_mutasi)
        this.openModalDokumen()
    }

    openModalDokumen = () => {
        this.setState({ openModalDoc: !this.state.openModalDoc })
    }

    openRinciAdmin = async () => {
        this.setState({ rinci: !this.state.rinci })
    }

    prosesOpenPreview = async (val) => {
        const { detailMut } = this.props.mutasi
        const token = localStorage.getItem('token')
        await this.props.getApproveMut(token, detailMut[0].no_mutasi, val.kode_plant.split('').length === 4 ? 'Mutasi' : 'Mutasi HO')
        this.openModalPre()
    }

    getDataApproveMut = async (val) => {
        const token = localStorage.getItem('token')
        await this.props.getApproveMut(token, val.no_mutasi, val.kode_plant.split('').length === 4 ? 'Mutasi' : 'Mutasi HO')
    }

    openModalPre = () => {
        this.setState({ preview: !this.state.preview })
    }

    openDetailMut = async (value) => {
        const { dataMut } = this.props.mutasi
        const detail = []
        for (let i = 0; i < dataMut.length; i++) {
            if (dataMut[i].no_mutasi === value) {
                detail.push(dataMut[i])
            }
        }
        this.setState({ detailMut: detail })
        const token = localStorage.getItem('token')
        await this.props.getDetailMutasi(token, value)
        this.openModalMut()
    }

    openApprove = () => {
        this.setState({ approve: !this.state.approve })
    }

    openReject = () => {
        this.setState({ reject: !this.state.reject, listStat: [] })
    }

    cekApprove = () => {
        const level = localStorage.getItem('level')
        const { detailMut } = this.props.mutasi
        const totalDoc = []
        const uploadDoc = []
        for (let i = 0; i < detailMut.length; i++) {
            const docMutasi = detailMut[i].docAsset
            for (let j = 0; j < docMutasi.length; j++) {
                const dokumen = docMutasi[j]
                totalDoc.push(dokumen)
                if (dokumen.path !== null) {
                    uploadDoc.push(dokumen)
                }
            }
        }
        if ((level === '5' || level === '9') && (totalDoc.length !== uploadDoc.length || detailMut[0].docAsset.length === 0)) {
            this.setState({confirm: 'docFirst'})
            this.openConfirm()
        } else {
            this.openApprove()
        }
    }

    getDataMutasi = async () => {
        const level = localStorage.getItem('level')
        const token = localStorage.getItem('token')
        const { filter } = this.state
        this.changeFilter(filter)
    }

    getDataAsset = async (value) => {
        const token = localStorage.getItem("token")
        const { page } = this.props.asset
        const search = value === undefined ? '' : this.state.search
        const limit = value === undefined ? this.state.limit : value.limit
        await this.props.getAsset(token, limit, search, page.currentPage, 'mutasi')
        await this.props.getDetailDepo(token, 1)
        this.prepareSelect()
        this.setState({ limit: value === undefined ? 12 : value.limit })
    }

    addMutasi = async () => {
        const token = localStorage.getItem("token")
        const { page } = this.props.asset
        const search = ''
        const limit = this.state.limit
        const { kode, dataRinci } = this.state
        if (kode === '') {
            console.log('pilih tujuan depo')
        } else {
            await this.props.addMutasi(token, dataRinci.no_asset, kode)
            await this.props.getAsset(token, limit, search, page.currentPage, 'mutasi')
            this.openRinciAdmin()
        }
    }

    getDataMutasiRec = async () => {
        const token = localStorage.getItem('token')
        await this.props.getMutasiRec(token)
        this.changeFilter('available')
    }

    changeFilter = async (val) => {
        const level = localStorage.getItem('level')
        const kode = localStorage.getItem('kode')
        const token = localStorage.getItem('token')
        const { dataDepo } = this.props.depo
        const { detailUser, dataRole } = this.props.user
        const { time1, time2, search, limit } = this.state
        const cekTime1 = time1 === '' ? 'undefined' : time1
        const cekTime2 = time2 === '' ? 'undefined' : time2
        const status = val === 'finish' ? '8' : 'all'

        await this.props.getMutasi(token, status, cekTime1, cekTime2, search, 100)

        const { dataMut, noMut } = this.props.mutasi
        const role = localStorage.getItem('role')
        // const divisi = level === '16' || level === '13' ? dataRole.find(({ nomor }) => nomor === '27').name : localStorage.getItem('role')
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
        console.log(listRole)
        if (val === 'available') {
            const newMut = []
            const arrApp = []
            for (let i = 0; i < dataMut.length; i++) {
                // if (dataMut[index] !== undefined) {
                //     const app = dataMut[index].appForm
                //     const find = app.indexOf(app.find(({jabatan}) => jabatan === role))
                //     const findApp = app.indexOf(app.find(({jabatan}) => jabatan === divisi))
                //     if (level === '12' || level === '27') {
                //         if ((app.length === 0 || app[app.length - 1].status === null) || (app[find] !== undefined && app[find + 1].status === 1 && app[find - 1].status === null && (app[find].status === null || app[find].status === 0))) {
                //             newMut.push(dataMut[index])
                //         }
                //     } else if (level === '13' || level === '16') {
                //         if ((app.length === 0 || app[app.length - 1].status === null) || (app[find] !== undefined && app[find + 1].status === 1 && (app[find].status === null))) {
                //             newMut.push(dataMut[index])
                //         } else if ((app.length === 0 || app[app.length - 1].status === null) || (app[findApp - 1] !== undefined && app[findApp + 2].status === 1 && (app[findApp - 1].status === null))) {
                //             newMut.push(dataMut[index])
                //         } else {
                //             console.log(findApp - 1)
                //         }
                //     } else if (find === 0 || find === '0') {
                //         const index = dataMut.indexOf(dataMut.find(({no_mutasi}) => no_mutasi === noMut[i]))
                //         if (dataMut[index] !== undefined) {
                //             newMut.push(dataMut[index])
                //         }
                //     } else {
                //         if (app[find] !== undefined && app[find + 1].status === 1 && app[find - 1].status === null && app[find].status !== 1) {
                //             newMut.push(dataMut[index])
                //         }
                //     }
                // }
                const depoFrm = dataDepo.find(item => item.kode_plant === dataMut[i].kode_plant)
                const depoTo = dataDepo.find(item => item.kode_plant === dataMut[i].kode_plant_rec)
                for (let x = 0; x < listRole.length; x++) {
                    console.log(listRole)
                    const app = dataMut[i].appForm === undefined ? [] : dataMut[i].appForm
                    const cekFrm = listRole[x].type === 'area' && depoFrm !== undefined ? (depoFrm.nama_bm.toLowerCase() === detailUser.fullname.toLowerCase() || depoFrm.nama_om.toLowerCase() === detailUser.fullname.toLowerCase() || depoFrm.nama_aos.toLowerCase() === detailUser.fullname.toLowerCase() ? 'pengirim' : 'not found') : 'all'
                    const cekTo = listRole[x].type === 'area' && depoTo !== undefined ? (depoTo.nama_bm.toLowerCase() === detailUser.fullname.toLowerCase() || depoTo.nama_om.toLowerCase() === detailUser.fullname.toLowerCase() || depoTo.nama_aos.toLowerCase() === detailUser.fullname.toLowerCase() ? 'penerima' : 'not found') : 'all'
                    const cekFin = cekFrm === 'pengirim' ? 'pengirim' : cekTo === 'penerima' ? 'penerima' : 'all'
                    const cekApp = app.find(item => (item.jabatan === listRole[x].name) && (cekFin === 'all' ? (item.struktur === null || item.struktur === 'all') : (item.struktur === cekFin)))
                    const find = app.indexOf(cekApp)
                    console.log(dataDepo)
                    console.log(depoFrm)
                    console.log(detailUser)
                    console.log(app)
                    console.log(listRole[x])
                    console.log(cekApp)
                    console.log(cekFrm)
                    console.log(cekTo)
                    console.log(cekFin)
                    if (level === '5' || level === '9') {
                        console.log('at available 2')
                        if (find === 0 || find === '0') {
                            console.log('at available 3')
                            if (dataMut[i].status_reject !== 1 && app[find] !== undefined && app[find + 1].status === 1 && app[find].status !== 1 && dataMut[i].kode_plant_rec === kode) {
                                if (newMut.find(item => item.no_mutasi === dataMut[i].no_mutasi) === undefined) {
                                    newMut.push(dataMut[i])
                                    arrApp.push({index: find, noMut: dataMut[i].no_mutasi})
                                }
                            }
                        } else {
                            console.log('at available 4')
                            if (find !== app.length - 1) {
                                if (dataMut[i].status_reject !== 1 && app[find] !== undefined && app[find + 1].status === 1 && app[find - 1].status === null && app[find].status !== 1 && dataMut[i].kode_plant_rec === kode) {
                                    if (newMut.find(item => item.no_mutasi === dataMut[i].no_mutasi) === undefined) {
                                        newMut.push(dataMut[i])
                                        arrApp.push({index: find, noMut: dataMut[i].no_mutasi})
                                    }
                                }
                            }
                        }
                    } else if (find === 0 || find === '0') {
                        console.log('at available 8')
                        if (dataMut[i].status_reject !== 1 && app[find] !== undefined && app[find + 1].status === 1 && app[find].status !== 1) {
                            if (newMut.find(item => item.no_mutasi === dataMut[i].no_mutasi) === undefined) {
                                newMut.push(dataMut[i])
                                arrApp.push({index: find, noMut: dataMut[i].no_mutasi})
                            }
                        }
                    } else {
                        console.log('at available 5')
                        // console.log(find)
                        console.log(app[find])
                        if (dataMut[i].status_reject !== 1 && app[find] !== undefined && app[find + 1].status === 1 && app[find - 1].status === null && app[find].status !== 1) {
                            console.log('if first available 5')
                            if (newMut.find(item => item.no_mutasi === dataMut[i].no_mutasi) === undefined) {
                                console.log('if second available 5')
                                newMut.push(dataMut[i])
                                arrApp.push({index: find, noMut: dataMut[i].no_mutasi})
                            }
                        }
                    }
                }
            }
            this.setState({ filter: val, newMut: newMut, arrApp: arrApp })
        } else if (val === 'reject' && dataMut.length > 0) {
            const newMut = []
            for (let i = 0; i < dataMut.length; i++) {
                if (dataMut[i].status_reject === 1) {
                    newMut.push(dataMut[i])
                }
            }
            this.setState({ filter: val, newMut: newMut })
        } else if (val === 'finish' && dataMut.length > 0) {
            const newMut = []
            for (let i = 0; i < dataMut.length; i++) {
                if (dataMut[i].status_form === 8) {
                    newMut.push(dataMut[i])
                }
            }
            this.setState({ filter: val, newMut: newMut })
        } else {
            const newMut = []
            for (let i = 0; i < dataMut.length; i++) {
                newMut.push(dataMut[i])
                // const app = dataMut[i].appForm === undefined ? [] : dataMut[i].appForm
                // const find = app.indexOf(app.find(({ jabatan }) => jabatan === role))
                // if (find === 0 || find === '0') {
                //     console.log('at available 8')
                //     if (dataMut[i].status_reject !== 1 && app[find] !== undefined && app[find + 1].status === 1 && app[find].status !== 1) {
                //         newMut.push()
                //     } else {
                //         newMut.push(dataMut[i])
                //     }
                // } else {
                //     console.log('at available 5')
                //     if (dataMut[i].status_reject !== 1 && app[find] !== undefined && app[find + 1].status === 1 && app[find - 1].status === null && app[find].status !== 1) {
                //         newMut.push()
                //     } else {
                //         newMut.push(dataMut[i])
                //     }
                // }
            }
            this.setState({ filter: val, newMut: newMut })
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
        // const status = filter === 'finish' ? '8' : filter === 'available' && level === '2' ? '1' : filter === 'available' && level === '8' ? '3' : 'all'
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

    chooseDepo = (e) => {
        this.setState({ kode: e.value })
    }

    goCartMut = () => {
        this.props.history.push('/cart-mutasi')
    }

    prepReject = async (val) => {
        const { detailMut } = this.props.mutasi
        const { listStat, listMut, typeReject, menuRev } = this.state
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
                kode: detailMut[0].kode_plant,
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
        const token = localStorage.getItem("token")
        const { detailMut } = this.props.mutasi
        const { selApp } = this.state

        const app = detailMut[0].appForm
        const tempApp = []
        for (let i = 0; i < app.length; i++) {
            if (app[i].status === 1) {
                tempApp.push(app[i])
            }
        }
        const tipe = tempApp.length === app.length - 1 ? 'full approve' : 'approve'

        const tempno = {
            no: detailMut[0].no_mutasi,
            kode: detailMut[0].kode_plant,
            jenis: 'mutasi',
            tipe: tipe,
            menu: 'Pengajuan Mutasi Asset (Mutasi asset)',
            indexApp: selApp.index
        }
        this.setState({ tipeEmail: 'approve' })
        await this.props.getDetailMutasi(token, detailMut[0].no_mutasi)
        await this.props.getApproveMut(token, detailMut[0].no_mutasi, 'Mutasi')
        await this.props.getDraftEmail(token, tempno)
        this.openDraftEmail()
    }

    openDraftEmail = () => {
        this.setState({ openDraft: !this.state.openDraft })
    }

    approveMutasi = async () => {
        const { detailMut } = this.props.mutasi
        const { selApp } = this.state
        const level = localStorage.getItem('level')
        const token = localStorage.getItem("token")
        await this.props.approveMutasi(token, detailMut[0].no_mutasi, selApp.index)
        this.prosesSendEmail('approve')
        this.setState({ confirm: 'approve' })
        this.openConfirm()
        this.openApprove()
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

        const app = detailMut[0].appForm
        const tempApp = []
        for (let i = 0; i < app.length; i++) {
            if (app[i].status === 1) {
                tempApp.push(app[i])
            }
        }
        
        const tipe = (tempApp.length === app.length - 1 || tempApp.length === app.length) ? 'full approve' : 'approve'
        const cekBudget = detailMut.find(item => item.isbudget === 'ya') !== undefined

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
            route: val === 'reject perbaikan' ? 'rev-mutasi' : (tipe === 'full approve' && val === 'approve' && !cekBudget) ? 'eks-mutasi' : (tipe === 'full approve' && val === 'approve' && cekBudget) ? 'budget-mutasi': 'mutasi'
        }
        await this.props.sendEmail(token, sendMail)
        await this.props.addNewNotif(token, sendMail)
    }

    rejectMutasi = async (val) => {
        const { listStat, listMut, typeReject, menuRev, selApp } = this.state
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
            type: level === '2' || level === '8' ? 'verif' : 'form',
            type_reject: typeReject,
            user_rev: detailMut[0].kode_plant,
            indexApp: `${selApp.index}`
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

    openHistory = () => {
        this.setState({ history: !this.state.history })
    }

    prepareSelect = async () => {
        const token = localStorage.getItem("token")
        const kode = localStorage.getItem('kode')
        await this.props.getDepo(token, 1000, '')
        const { dataDepo } = this.props.depo
        const temp = [
            { value: '', label: '-Pilih Area-' }
        ]
        if (dataDepo.length !== 0) {
            // dataDepo.map(item => {
            //     return (
            //         // 
            //     )
            // })
            for (let i = 0; i < dataDepo.length; i++) {
                if (dataDepo[i].kode_plant !== kode) {
                    temp.push({ value: dataDepo[i].kode_plant, label: dataDepo[i].kode_plant + '-' + dataDepo[i].nama_area })
                }
            }
            this.setState({ options: temp })
        }
    }

    openForm = async (val) => {
        this.setState({loading: true})
        const { filter } = this.state
        console.log(val)
        const token = localStorage.getItem('token')
        const level = localStorage.getItem('level')
        await this.props.getApproveMut(token, val.no_mutasi, val.kode_plant.split('').length === 4 ? 'Mutasi' : 'Mutasi HO')
        await this.props.getDetailMutasi(token, val.no_mutasi)
        if (filter === 'available') {
            const {detailMut} = this.props.mutasi
            const { arrApp } = this.state
            const cekApp = arrApp.find(item => item.noMut === detailMut[0].no_mutasi)
            this.setState({selApp: cekApp})
            if ((level === '5' || level === '9') && (detailMut[0].tgl_mutasifisik === null || detailMut[0].tgl_mutasifisik === 'null' || detailMut[0].tgl_mutasifisik === '')) {
                this.openModalMut()
                this.openModalDate()
            } else {
                this.openModalMut()
            }
        } else {
            this.openModalMut()
        }
        this.setState({loading: false})
    }

    openModalDate = () => {
        this.setState({modalDate: !this.state.modalDate})
    }

    closeDate = () => {
        this.openModalMut()
        this.openModalDate()
    }

    editDate = async (val) => {
        const token = localStorage.getItem('token')
        const { detailMut } = this.props.mutasi
        await this.props.changeDate(token, detailMut[0].no_mutasi, val)
        await this.props.getDetailMutasi(token, detailMut[0].no_mutasi)
        this.openModalDate()
        // this.reOpenDetailMut()
    }

    reOpenDetailMut = () => {
        const { detailMut } = this.props.mutasi
        this.closeDate()
        this.openForm(detailMut[0])
    }

    render() {
        const role = localStorage.getItem('role')
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const kode = localStorage.getItem('kode')
        const { dataRinci, newMut, listMut, listStat, tipeEmail, dataRej } = this.state
        const { detailDepo, dataDepo } = this.props.depo
        const { dataRole } = this.props.user
        const { dataMut, noMut, mutApp, dataDoc, detailMut, infoApp } = this.props.mutasi
        const { dataAsset, page } = this.props.asset
        const pages = this.props.mutasi.page

        const splitApp = infoApp.info ? infoApp.info.split(']') : []
        const pembuatApp = splitApp.length > 0 ? splitApp[0] : ''
        const pemeriksaApp = splitApp.length > 0 ? splitApp[1] : ''
        const penyetujuApp = splitApp.length > 0 ? splitApp[2] : ''

        const cekFrm = detailMut[0] && detailMut[0].kode_plant.length > 4 ? 9 : 5
        const cekTo = detailMut[0] && detailMut[0].kode_plant_rec.length > 4 ? 9 : 5
        const codeApp = cekFrm === 9 && cekTo === 9 ? 1 : cekFrm === 9 && cekTo === 5 ? 2 : cekFrm === 5 && cekTo === 9 ? 3 : 4

        const contentHeader = (
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
                        <h2 className={styleTrans.pageTitle}>Mutasi Asset</h2>

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
                            <SelectCreate
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
                                                    onClick={item.status_reject === 1 && item.status_form !== 0 && (level === '5' || level === '9') && item.user_rev === kode ? this.goRevisi : () => this.openForm(item)}>
                                                    {this.state.filter === 'available' ? 'Proses' : item.status_reject === 1 && item.status_form !== 0 && (level === '5' || level === '9') && item.user_rev === kode ? 'Revisi' : 'Detail'}
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
                <Modal isOpen={this.state.rinci} toggle={this.openRinciAdmin} size="xl">
                    <ModalHeader>
                        Proses Mutasi
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
                                                    <button className="btnSmallImg" onClick={() => this.setState({ img: item.path })}>
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
                                    kode_plant: 'king'
                                }}
                                validationSchema={mutasiSchema}
                                onSubmit={(values) => { this.addMutasi(values) }}
                            >
                                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, }) => (
                                    <div className="rightRinci">
                                        <div>
                                            <div className="titRinci">{dataRinci.nama_asset}</div>
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>No Asset</Col>
                                                <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.no_asset} disabled /></Col>
                                            </Row>
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Merk / Type</Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    type="text"
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
                                                        <div className="ml-2"><input type="checkbox" checked={dataRinci.kategori === 'IT' ? true : false} /> IT</div>
                                                        <div className="ml-3"><input type="checkbox" checked={dataRinci.kategori === 'NON IT' ? true : false} /> NON IT</div>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Cost Center</Col>
                                                <Col md={9} className="colRinci">:  <Input className="inputRinci" value={detailDepo.cost_center} disabled /></Col>
                                            </Row>
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Nilai Buku</Col>
                                                <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.nilai_buku === null ? '-' : dataRinci.nilai_buku} disabled /></Col>
                                            </Row>
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Keterangan</Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    className="inputRinci"
                                                    type="text"
                                                    value={dataRinci.keterangan === null ? '-' : dataRinci.keterangan}
                                                    disabled
                                                />
                                                </Col>
                                            </Row>
                                            <Row className="mb-3 rowRinci">
                                                <Col md={3}>Area Tujuan</Col>
                                                <Col md={9} className="colRinci">:
                                                    <Select
                                                        className="col-md-12"
                                                        options={this.state.options}
                                                        onChange={this.chooseDepo}
                                                    />
                                                </Col>
                                            </Row>
                                            {this.state.kode === '' ? (
                                                <text className={style.txtError}>Must be filled</text>
                                            ) : null}
                                        </div>
                                        <div className="footRinci3 mt-4">
                                            <Col md={6}>
                                                <Button className="btnFootRinci2" size="lg" block color="success" onClick={handleSubmit}>Add</Button>
                                            </Col>
                                            <Col md={6}>
                                                <Button className="btnFootRinci2" size="lg" block outline color="secondary" onClick={() => this.openRinciAdmin()}>Close</Button>
                                            </Col>
                                        </div>
                                    </div>
                                )}
                            </Formik>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.rincian} toggle={this.openRinci} size="xl">
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
                                                    <button className="btnSmallImg" onClick={() => this.setState({ img: item.path })}>
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
                                    kode_plant: 'king'
                                }}
                                validationSchema={mutasiSchema}
                                onSubmit={(values) => { this.addMutasi(values) }}
                            >
                                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, }) => (
                                    <div className="rightRinci">
                                        <div>
                                            <div className="titRinci">{dataRinci.nama_asset}</div>
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Area Pengirim</Col>
                                                <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.area} disabled /></Col>
                                            </Row>
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Cost Center Pengirim</Col>
                                                <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.cost_center} disabled /></Col>
                                            </Row>
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Area Penerima</Col>
                                                <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.area_rec} disabled /></Col>
                                            </Row>
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Cost Center Penerima</Col>
                                                <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.cost_center_rec} disabled /></Col>
                                            </Row>
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>No Asset</Col>
                                                <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.no_asset} disabled /></Col>
                                            </Row>
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Merk / Type</Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    type="text"
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
                                                        <div className="ml-2"><input type="checkbox" checked={dataRinci.kategori === 'IT' ? true : false} /> IT</div>
                                                        <div className="ml-3"><input type="checkbox" checked={dataRinci.kategori === 'NON IT' ? true : false} /> Non IT</div>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Nilai Buku</Col>
                                                <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.nilai_buku === null || dataRinci.nilai_buku === undefined ? '0' : dataRinci.nilai_buku.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} disabled /></Col>
                                            </Row>
                                        </div>
                                        <div className="footRinci3 mt-4">
                                            <Col md={6}>
                                            </Col>
                                            <Col md={6}>
                                            </Col>
                                        </div>
                                    </div>
                                )}
                            </Formik>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.formMut} toggle={this.openModalMut} size="xl" className='xl'>
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
                                        <div className='mr-1'>:</div> {detailMut.length !== 0 ? (detailMut[0].tgl_mutasifisik ? moment(detailMut[0].tgl_mutasifisik).format('DD MMMM YYYY') : '-') : '-'}
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
                                        <tr>
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
                                        mutApp.pemeriksa?.filter(item => item.id_role !== 2 && item.jabatan !== 'asset').length || 1
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
                                    {mutApp.pemeriksa?.filter(item => item.id_role !== 2 && item.jabatan !== 'asset').map(item => (
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
                                    {mutApp.pemeriksa?.filter(item => item.id_role !== 2 && item.jabatan !== 'asset').map(item => (
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
                        <div className="btnFoot">
                            <FormMutasi className='mr-2' />
                            {(level === '5' || level === '9') && (
                                <Button color='warning' className='ml-2' onClick={this.openProsesModalDoc}>Dokumen Terima Mutasi</Button>
                            )}
                        </div>
                        {/* {level === '12' && this.state.filter === 'available' ? (
                            <div className="btnFoot">
                                <Button className="mr-2" disabled={this.state.filter !== 'available' ? true : listMut.length === 0 ? true : false} color="danger" onClick={() => this.openReject()}>
                                    Reject
                                </Button>
                                <Button color="success" disabled={this.state.filter !== 'available' ? true : false} onClick={() => this.openApprove()}>
                                    Approve
                                </Button>
                            </div>
                        ) :  */}
                        {this.state.filter === 'available' ? (
                            <div className="btnFoot">
                                <Button className="mr-2" disabled={this.state.filter !== 'available' ? true : listMut.length === 0 ? true : false} color="danger" onClick={() => this.openReject()}>
                                    Reject
                                </Button>
                                <Button color="success" disabled={this.state.filter !== 'available' ? true : false} onClick={() => this.cekApprove()}>
                                    Approve
                                </Button>
                            </div>
                        ) : (
                            <div className="btnFoot">
                                <Button onClick={this.openModalMut}>Close</Button>
                            </div>
                        )}
                    </div>
                </Modal>
                <Modal isOpen={this.state.approve} toggle={this.openApprove} centered={true}>
                    <ModalBody>
                        <div className={style.modalApprove}>
                            <div>
                                <text>
                                    Anda yakin untuk approve
                                    <text className={style.verif}> pengajuan mutasi </text>
                                    pada tanggal
                                    <text className={style.verif}> {moment().format('LL')}</text> ?
                                </text>
                            </div>
                            <div className={style.btnApprove}>
                                <Button color="primary" onClick={() => this.prepSendEmail()}>Ya</Button>
                                <Button color="secondary" onClick={this.openApprove}>Tidak</Button>
                            </div>
                        </div>
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
                <Modal size="xl" isOpen={this.state.openModalDoc} toggle={this.openModalDokumen}>
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
                                                <button className="btnDocIo" onClick={() => this.showDokumen(x)} >{x.desc}</button>
                                                <div>
                                                    <input
                                                        className="ml-4"
                                                        type="file"
                                                        onClick={() => this.setState({ detail: x })}
                                                        onChange={this.onChangeUpload}
                                                    />
                                                </div>
                                            </Col>
                                        ) : (
                                            <Col md={6} lg={6} >
                                                <input
                                                    className="ml-4"
                                                    type="file"
                                                    onClick={() => this.setState({ detail: x })}
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
                        <Button className="mr-2" color="secondary" onClick={this.openModalDokumen}>
                            Close
                        </Button>
                    </ModalFooter>
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
                <Modal isOpen={this.state.history} toggle={this.openHistory}>
                    <ModalBody>
                        <div className='mb-4'>History Transaksi</div>
                        <div className='history'>
                            {detailMut === undefined || detailMut.length === 0 || detailMut[0].history === null ? (
                                <div></div>   
                            ) 
                            : detailMut[0].history.split(',').map(item => {
                                return (
                                    item !== null && item !== 'null' &&
                                    <Button className='mb-2' color='info'>{item}</Button>
                                )
                            })}
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
                                    onClick={
                                        tipeEmail === 'reject' ? 
                                        () => this.rejectMutasi(dataRej) : 
                                        () => this.approveMutasi()
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
                <Modal isOpen={this.state.modalConfirm} toggle={this.openConfirm} size="sm">
                    <ModalBody>
                        {this.state.confirm === 'approve' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                    <div className={[style.sucUpdate, style.green]}>Berhasil Approve Form Mutasi</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'reject' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                    <div className={[style.sucUpdate, style.green]}>Berhasil Reject Mutasi</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'rejApprove' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                    <div className={[style.sucUpdate, style.green]}>Gagal Approve Form Mutasi</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'rejReject' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                    <div className={[style.sucUpdate, style.green]}>Gagal Reject Form Mutasi</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'addmutasi' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                    <div className={[style.sucUpdate, style.green]}>Gagal Menambahkan Item Mutasi</div>
                                    <div className="errApprove mt-2">{this.props.mutasi.alertM === undefined ? '' : this.props.mutasi.alertM}</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'docFirst' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                    <div className={[style.sucUpdate, style.green]}>Gagal Approve</div>
                                    <div className="errApprove mt-2">Mohon untuk upload dokumen terlebih dahulu</div>
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
                        ) : this.state.confirm === 'errMsg' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                    <div className={[style.sucUpdate, style.green]}>Gagal Upload</div>
                                    <div className="errApprove mt-2">{this.state.errMsg}</div>
                                </div>
                            </div>
                        ) : (
                            <div></div>
                        )}
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.openPdf} size="xl" toggle={this.openModalPdf} centered={true}>
                    <ModalHeader>Dokumen</ModalHeader>
                    <ModalBody>
                        <div className={style.readPdf}>
                            <Pdf pdf={`${REACT_APP_BACKEND_URL}/show/doc/${this.state.idDoc}`} tipe='mutasi' />
                        </div>
                        <hr/>
                        <div className={style.foot}>
                            <div>
                                <Button color="success" onClick={() => this.downloadData()}>Download</Button>
                            </div>
                            <Button color="primary" onClick={this.openModalPdf}>Close</Button>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalDate} centered>
                    <ModalHeader>Lengkapi tanggal mutasi fisik terlebih dahulu</ModalHeader>
                    <Formik
                    initialValues={{
                    tgl_mutasifisik: detailMut.length !== 0 ? detailMut[0].tgl_mutasifisik : '',
                    }}
                    validationSchema={dateSchema}
                    onSubmit={(values) => {this.editDate(values)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                    <ModalBody>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Tanggal Mutasi Fisik
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="date" 
                                name="tgl_mutasifisik"
                                value={values.tgl_mutasifisik}
                                onBlur={handleBlur("tgl_mutasifisik")}
                                onChange={handleChange("tgl_mutasifisik")}
                                />
                                {errors.tgl_mutasifisik ? (
                                    <text className={style.txtError}>Must be filled</text>
                                ) : null}
                            </div>
                        </div>
                        <hr/>
                        <div className={style.foot}>
                            <div></div>
                            <div>
                                <Button className="mr-2" onClick={handleSubmit} color="primary">Save</Button>
                                <Button className="mr-3" onClick={this.closeDate} color="danger">Close</Button>
                            </div>
                        </div>
                    </ModalBody>
                        )}
                    </Formik>
                </Modal>
                <Modal
                    isOpen={
                        this.props.mutasi.isLoading
                            || this.props.depo.isLoading
                            || this.props.asset.isLoading
                            || this.props.newnotif.isLoading
                            || this.props.tempmail.isLoading 
                            || this.state.loading ? true : false
                    } size="sm"
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
            </>
        )
    }
}

const mapStateToProps = state => ({
    asset: state.asset,
    depo: state.depo,
    mutasi: state.mutasi,
    user: state.user,
    tempmail: state.tempmail,
    newnotif: state.newnotif,
    dokumen: state.dokumen
})

const mapDispatchToProps = {
    logout: auth.logout,
    getAsset: asset.getAsset,
    resetError: asset.resetError,
    nextPage: asset.nextPage,
    getDetailDepo: depo.getDetailDepo,
    getDepo: depo.getDepo,
    addMutasi: mutasi.addMutasi,
    getMutasi: mutasi.getMutasi,
    approveMutasi: mutasi.approveMutasi,
    rejectMut: mutasi.rejectMutasi,
    getApproveMut: mutasi.getApproveMutasi,
    getMutasiRec: mutasi.getMutasiRec,
    getDocumentMut: mutasi.getDocumentMut,
    resetAddMut: mutasi.resetAddMut,
    resetMutasi: mutasi.resetMutasi,
    getDetailMutasi: mutasi.getDetailMutasi,
    getRole: user.getRole,
    addNewNotif: newnotif.addNewNotif,
    getDraftEmail: tempmail.getDraftEmail,
    sendEmail: tempmail.sendEmail,
    uploadDocument: mutasi.uploadDocument,
    showDokumen: dokumen.showDokumen,
    changeDate: mutasi.changeDate,
    getDetailUser: user.getDetailUser,
    searchMutasi: mutasi.searchMutasi
}

export default connect(mapStateToProps, mapDispatchToProps)(Mutasi)
