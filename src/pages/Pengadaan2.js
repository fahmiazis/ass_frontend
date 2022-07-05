/* eslint-disable jsx-a11y/no-distracting-elements */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react'
import { Container, NavbarBrand, Table, Input, Button, Col,
    Alert, Spinner, Row, Modal, ModalBody, ModalHeader, ModalFooter,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap'
import style from '../assets/css/input.module.css'
import {FaSearch, FaUserCircle, FaBars, FaCartPlus, FaFileSignature, FaTh, FaList} from 'react-icons/fa'
import {BsCircle, BsBell, BsFillCircleFill} from 'react-icons/bs'
import { AiOutlineCheck, AiOutlineClose, AiFillCheckCircle} from 'react-icons/ai'
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

class Pengadaan extends Component {
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
            newIo: [],
            filter: 'available',
            isAppall: false,
            stat: '',
            listStat: [],
            url: '',
            valdoc: {}
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
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
            this.setState({listStat: [], openReject: !this.state.openReject})
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
            this.props.getDocCart(token, val.id)
            this.closeProsesModalDoc()
        } else {
            await this.props.getDocumentIo(token, data[0].no_pengadaan)
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
        const {fileName} = this.state
        const token = localStorage.getItem('token')
        await this.props.approveDocument(token, fileName.id)
        this.setState({openApprove: !this.state.openApprove})
        this.openModalPdf()
    }

    rejectDokumen = async (value) => {
        const {fileName} = this.state
        const token = localStorage.getItem('token')
        this.setState({openRejectDis: !this.state.openRejectDis})
        await this.props.rejectDocument(token, fileName.id, value)
        this.openModalPdf()
    }

    rejectIo = async (value) => {
        const { detailIo } = this.props.pengadaan
        const {listStat} = this.state
        const token = localStorage.getItem('token')
        let temp = ''
        let status = ''
        for (let i = 0; i < listStat.length; i++) {
            temp += listStat[i] + '.'
            if ('Deskripsi, kuantitas, dan harga tidak sesuai' === listStat[i]) {
                status += '1'
            } else if ('Dokumen lampiran tidak sesuai' === listStat[i]) {
                status += '5'
            } else if ('Alasan di form io yang tidak sesuai' === listStat[i]) {
                status += '5'
            }
        }
        const data = {
            alasan: temp + value.alasan,
            status: parseInt(status)
        }
        this.openModalReject()
        await this.props.rejectIo(token, detailIo[0].no_pengadaan, data)
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
        const cekDok = []
        const { detailIo } = this.props.pengadaan
        for (let i = 0; i < detailIo.length; i++) {
            if (detailIo[i].isAsset !== 'true' && detailIo[i].isAsset !== 'false') {
                cek.push(detailIo[i])  
            } else if (detailIo[i].asset_token === null) {
                await this.props.getDocCart(token, detailIo[i].id)
                const {dataDocCart} = this.props.pengadaan
                if (dataDocCart.find(({status}) => status === null) || dataDocCart.find(({status}) => status === 0)) {
                    cekDok.push(dataDocCart)
                }
            } else {
                await this.props.getDocumentIo(token, detailIo[i].no_pengadaan)
                const {dataDoc} = this.props.pengadaan
                if (dataDoc.find(({status}) => status === null) || dataDoc.find(({status}) => status === 0)) {
                    cekDok.push(dataDoc)
                }
            }
        }
        if (cek.length > 0) {
            this.setState({confirm: 'falseSubmit'})
            this.openConfirm()
        } else if (cekDok.length > 0) {
            this.setState({confirm: 'falseSubmitDok'})
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

    updateAlasan = async (val) => {
        const token = localStorage.getItem('token')
        const {detailIo} = this.props.pengadaan
        await this.props.updateRecent(token, detailIo[0].no_pengadaan, val)
        await this.props.getDetail(token, detailIo[0].no_pengadaan)
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
        await this.props.showDokumen(token, value.id, value.no_pengadaan)
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
        const {isError, isUpload, isUpdate, approve, rejApprove, reject, rejReject, detailIo, testPods, appdoc, rejdoc} = this.props.pengadaan
        const {rinciIo, listMut, newIo} = this.state
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
        } else if (listMut.length > newIo.length) {
            this.setState({listMut: []})
        } else if (testPods === 'true') {
            this.setState({confirm: 'apitrue'})
            this.openConfirm()
            this.props.resetApp()
        } else if (testPods === 'false') {
            this.setState({confirm: 'apifalse'})
            this.openConfirm()
            this.props.resetApp()
        } else if (appdoc === true) {
            this.setState({confirm: 'appDocTrue'})
            this.openConfirm()
            this.props.resetApp()
            this.prosesDoc(this.state.valdoc)
        } else if (appdoc === false) {
            this.setState({confirm: 'appDocFalse'})
            this.openConfirm()
            this.props.resetApp()
        } else if (rejdoc === true) {
            this.setState({confirm: 'rejDocTrue'})
            this.openConfirm()
            this.props.resetApp()
            this.prosesDoc(this.state.valdoc)
        } else if (rejdoc === false) {
            this.setState({confirm: 'rejDocFalse'})
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
        const level = localStorage.getItem('level')
        const status = level === '2' ? '1' : level === '8' ? '3' : '2'
        const token = localStorage.getItem("token")
        await this.props.getPengadaan(token, status)
        this.changeFilter('available')
    }

    openAppall = () => {
        this.setState({isAppall: !this.state.isAppall})
    }

    changeFilter = (val) => {
        const {dataPeng} = this.props.pengadaan
        const role = localStorage.getItem('role')
        const level = localStorage.getItem('level')
        if (level === '2' || level === '8') {
            this.setState({filter: val, newIo: dataPeng})
        } else {
            if (val === 'available') {
                const newIo = []
                for (let i = 0; i < dataPeng.length; i++) {
                    const app = dataPeng[i].appForm ===  undefined ? [] : dataPeng[i].appForm
                    const find = app.indexOf(app.find(({jabatan}) => jabatan === role))
                    if (level === '5' || level === '9') {
                        if (app[find] === undefined || (app[find - 1].status === null && (app[find].status === null || app[find].status === 0))) {
                            newIo.push(dataPeng[i])
                        }
                    } else if (find === 0 || find === '0') {
                        if (app[find] !== undefined && app[find + 1].status === 1 && app[find].status !== 1) {
                            newIo.push(dataPeng[i])
                        }
                    } else {
                        if (app[find] !== undefined && app[find + 1].status === 1 && app[find - 1].status === null && app[find].status !== 1) {
                            newIo.push(dataPeng[i])
                        }
                    }
                }
                this.setState({filter: val, newIo: newIo})
            } else {
                const newIo = []
                for (let i = 0; i < dataPeng.length; i++) {
                    const app = dataPeng[i].appForm ===  undefined ? [] : dataPeng[i].appForm
                    const find = app.indexOf(app.find(({jabatan}) => jabatan === role))
                    if (level === '5' || level === '9') {
                        if (app[find] === undefined || (app[find - 1].status === null && (app[find].status === null || app[find].status === 0))) {
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
                this.setState({filter: val, newIo: newIo})
            }
        }
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
        this.setState({dataRinci: val})
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

    render() {
        const {alert, upload, errMsg, rinciIo, total, listMut, newIo, listStat, fileName, url} = this.state
        const {dataAsset, alertM, alertMsg, alertUpload, page} = this.props.asset
        const pages = this.props.disposal.page 
        const {dataPeng, isLoading, isError, dataApp, dataDoc, detailIo, dataDocCart} = this.props.pengadaan
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
                            {/* <Alert color="danger" className={style.alertWrong} isOpen={alert}>
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
                            </Alert> */}
                            <div className={style.bodyDashboard}>
                                <div className={style.headMaster}> 
                                    <div className={style.titleDashboard}>Pengadaan Asset</div>
                                </div>
                                <div className={level === '2' ? style.secEmail1 : style.secEmail}>
                                    {level === '5' || level === '9' ? (
                                        <div className={style.headEmail}>
                                            <button className="btnGoCart" onClick={() => this.props.history.push('/carttick')}><FaCartPlus size={60} className="green ml-2" /></button>
                                        </div>
                                    ) : level === '2' || level === '8' ? (
                                        <div className="mt-5">
                                            {/* <Button onClick={this.getSubmitDisposal} color="info" size="lg" className="btnGoCart mb-4">Submit</Button>
                                            <Input type="select" value={this.state.view} onChange={e => this.changeView(e.target.value)}>
                                                <option value="not available">All</option>
                                                <option value="available">Available To Approve</option>
                                                <option value="revisi">Revisi</option>
                                            </Input> */}
                                        </div>
                                    ) : level === '1' ? (
                                        <div className={style.headEmail}>
                                            <Button color="primary" className="transBtn" onClick={this.testConnect}>Test Api Pods</Button>
                                        </div>
                                    ) : (
                                        <div className={style.headEmail}>
                                            {this.state.view === 'list' ? (
                                                <>
                                                <Button color="primary" className="transBtn" onClick={() => this.changeView('card')}><FaTh size={35} className="mr-2"/> Gallery View</Button>
                                                </>
                                            ) : (
                                                <Button color="primary" className="transBtn" onClick={() => this.changeView('list')}><FaList size={30} className="mr-2"/> List View</Button>
                                            )}
                                        </div>
                                    )}
                                    {this.state.view === 'card' ? (
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
                                    ) : (
                                        <div className={style.searchEmail}>
                                            <Button disabled={listMut.length === 0 || listMut.length > newIo.length || this.state.filter === 'not available' ? true : false} color='success' className='mr-3' onClick={this.openAppall} >Approve</Button>
                                            <Button disabled={listMut.length === 0 || listMut.length > newIo.length || this.state.filter === 'not available' ? true : false} color='danger'>Reject</Button>
                                        </div>
                                    )}
                                </div>
                                {level === '2' || level === '8' ? (
                                    null
                                ) : (
                                    <div className={style.headEmail1}>
                                        <Input type="select" value={this.state.filter} onChange={e => this.changeFilter(e.target.value)}>
                                            <option value="not available">All</option>
                                            <option value="available">Available To Approve</option>
                                        </Input>
                                    </div>
                                )}
                                {level === '5' || level === '9' ? (
                                    newIo === undefined ? (
                                        <div></div>
                                    ) : (
                                        <Row className="bodyDispos">
                                        {newIo.length !== 0 && newIo.map(item => {
                                            return (
                                                item.status_form !== '2' ? (
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
                                ) : level === '8' ? (
                                    newIo === undefined ? (
                                        <div></div>
                                    ) : (
                                        <Row className="bodyDispos">
                                        {newIo.length !== 0 && newIo.map(item => {
                                            return (
                                                newIo.length === 0 ? (
                                                    <div></div>
                                                ) : (
                                                    item.status_form === '3' ? (
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
                                                    ) : (
                                                        null
                                                    )
                                                )
                                            )
                                        })}
                                        </Row>
                                    )
                                ) : level === '2' ? (
                                    newIo === undefined ? (
                                        <div></div>
                                    ) : (
                                        <Row className="bodyDispos">
                                        {newIo.length !== 0 && newIo.map(item => {
                                            return (
                                                newIo.length === 0 ? (
                                                    <div></div>
                                                ) : (
                                                    item.status_form === '1' && (
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
                                ) : (
                                    newIo === undefined ? (
                                        <div></div>
                                    ) : (
                                        this.state.view === 'card' ? (
                                            <Row className="bodyDispos">
                                                {newIo.length !== 0 && newIo.map(item => {
                                                    return (
                                                        newIo.length === 0 ? (
                                                            <div></div>
                                                        ) : (
                                                            item.status_form === '2' && (
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
                                        ) : (
                                            <div className="mt-4">
                                                <Table bordered striped responsive hover className={style.tab}>
                                                    <thead>
                                                        <tr>
                                                            <th>No</th>
                                                            <th>No Pengadaan</th>
                                                            <th>Kode Area</th>
                                                            <th>Area</th>
                                                            <th>Status</th>
                                                            <th>
                                                                <Input 
                                                                addon
                                                                type="checkbox"
                                                                className='mr-3'
                                                                disabled={this.state.filter === 'not available' ? true : false}
                                                                checked={listMut.length === 0 ? false : listMut.length === newIo.length ? true : false}
                                                                onClick={listMut.length === newIo.length ? () => this.chekRej('all') : () => this.chekApp('all')}
                                                                />
                                                                Select All
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    {newIo !== undefined && newIo.map(item => {
                                                        return (
                                                            <tbody>
                                                                {item.status_form === '2' ? (
                                                                    <tr>
                                                                        <td onClick={() => this.openForm(item)}>{newIo.indexOf(item) + 1}</td>
                                                                        <td onClick={() => this.openForm(item)}>{item.no_pengadaan}</td>
                                                                        <td onClick={() => this.openForm(item)}>{item.kode_plant}</td>
                                                                        <td onClick={() => this.openForm(item)}>{item.depo === null ? '' : item.area === null ? item.depo.nama_area : item.area}</td>
                                                                        <td onClick={() => this.openForm(item)}>{item.asset_token === null ? 'Pengajuan Asset' : 'Pengajuan PODS'}</td>
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
                                                                    </tr>
                                                                ) : (
                                                                    null
                                                                )}
                                                            </tbody>
                                                        )
                                                    })}
                                                </Table>
                                            </div>
                                        )
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
                                isDisabled={level === '8' ? false : true}
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
                                                <>
                                                    <th>Asset</th>
                                                    {detailIo !== undefined && detailIo.length > 0 && detailIo[0].asset_token === null ? (
                                                        <th>Dokumen</th>
                                                    ) : (
                                                        null
                                                    )}
                                                </>
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
                                                        <td>{item.qty}</td>
                                                        <td>{item.nama}</td>
                                                        <td>Rp {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                        <td>Rp {(parseInt(item.price) * parseInt(item.qty)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                        {level === '2' && (
                                                            <>
                                                                <td className='colTable'>
                                                                    <div>
                                                                        <Input
                                                                        addon
                                                                        disabled={item.status_app === null ? false : true}
                                                                        checked={item.isAsset === 'true' ? true : false}
                                                                        type="checkbox"
                                                                        onClick={() => this.updateIo({item: item, value: 'true'})}
                                                                        value={item.no_asset} />
                                                                        <text className='ml-2'>Ya</text>
                                                                    </div>
                                                                    <div>
                                                                        <Input
                                                                        addon
                                                                        disabled={item.status_app === null ? false : true}
                                                                        checked={item.isAsset === 'false' ? true : false}
                                                                        type="checkbox"
                                                                        onClick={() => this.updateIo({item: item, value: 'false'})}
                                                                        value={item.no_asset} />
                                                                        <text className='ml-2'>Tidak</text>
                                                                    </div>
                                                                </td>
                                                                {detailIo !== undefined && detailIo.length > 0 && detailIo[0].asset_token === null ? (
                                                                    <td>
                                                                        <Button color='success' size='sm' onClick={() => this.prosesModalDoc(item)}>Show Dokumen</Button>
                                                                    </td>
                                                                ) : (
                                                                    null
                                                                )}
                                                            </>
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
                                    </div>
                                )}
                        </Formik>
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
                        <Button className="ml-2" color="warning" onClick={() => this.openModPreview(detailIo[0])}>
                            Preview
                        </Button>
                    </div>
                    {level === '2' || level === '8' ? (
                        <div className="btnFoot">
                            <div></div>
                            <Button color="success" onClick={level === '2' ? () => this.submitAsset(detailIo[0].no_pengadaan) : this.submitBudget}>
                                Submit
                            </Button>
                        </div>
                    ) : (
                    <div className="btnFoot">
                        <Button className="mr-2" color="primary" onClick={this.openModalApproveIo}>
                            Approve
                        </Button>
                        <Button color="danger" onClick={this.openModalReject}>
                            Reject 
                        </Button>
                    </div>
                    )}
                </div>
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
                    <Button color="secondary" onClick={this.prosesModalTtd}>
                        Close
                    </Button>
                    <Button color="primary" onClick={this.prosesModalTtd}>
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
                            <Pdf pdf={`${REACT_APP_BACKEND_URL}/show/doc/${this.state.idDoc}?no=${fileName.no_pengadaan}`} />
                        </div>
                        <hr/>
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
                    alasan: ".",
                    }}
                    validationSchema={alasanSchema}
                    onSubmit={(values) => {this.rejectIo(values)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                            <div className={style.modalApprove}>
                            <div className='mb-2 quest'>Anda yakin untuk reject ?</div>
                            <div className='mb-2 titStatus'>Pilih alasan :</div>
                            <div className="ml-2">
                                <Input
                                addon
                                type="checkbox"
                                checked= {listStat.find(element => element === 'Deskripsi, kuantitas, dan harga tidak sesuai') !== undefined ? true : false}
                                onClick={listStat.find(element => element === 'Deskripsi, kuantitas, dan harga tidak sesuai') === undefined ? () => this.statusApp('Deskripsi, kuantitas, dan harga tidak sesuai') : () => this.statusRej('Deskripsi, kuantitas, dan harga tidak sesuai')}
                                />  Deskripsi, kuantitas, dan harga tidak sesuai
                            </div>
                            <div className="ml-2">
                                <Input
                                addon
                                type="checkbox"
                                checked= {listStat.find(element => element === 'Dokumen lampiran tidak sesuai') !== undefined ? true : false}
                                onClick={listStat.find(element => element === 'Dokumen lampiran tidak sesuai') === undefined ? () => this.statusApp('Dokumen lampiran tidak sesuai') : () => this.statusRej('Dokumen lampiran tidak sesuai')}
                                />  Dokumen lampiran tidak sesuai
                            </div>
                            <div className="ml-2">
                                <Input
                                addon
                                type="checkbox"
                                checked= {listStat.find(element => element === 'Alasan di form io yang tidak sesuai') !== undefined ? true : false}
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
                                {errors.alasan ? (
                                    <text className={style.txtError}>{errors.alasan}</text>
                                ) : null}
                            </div>
                            <div className={style.btnApprove}>
                                <Button color="primary" disabled={(values.alasan === '.' || values.alasan === '') && listStat.length === 0 ? true : false} onClick={handleSubmit}>Submit</Button>
                                <Button className='ml-2' color="secondary" onClick={this.openModalReject}>Close</Button>
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
                            <div className="errApprove mt-2">Mohon identifikasi asset terlebih dahulu</div>
                        </div>
                        </div>
                    ) : this.state.confirm === 'falseSubmitDok' ?(
                        <div>
                            <div className={style.cekUpdate}>
                            <AiOutlineClose size={80} className={style.red} />
                            <div className={[style.sucUpdate, style.green]}>Gagal Submit</div>
                            <div className="errApprove mt-2">Mohon approve dokumen terlebih dahulu</div>
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
                    ) : this.state.confirm === 'apitrue' ?(
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
                    ) : this.state.confirm === 'appDocTrue' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Approve Dokumen</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'rejDocTrue' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Reject Dokumen</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'appDocFalse' ?(
                        <div>
                            <div className={style.cekUpdate}>
                            <AiOutlineClose size={80} className={style.red} />
                            <div className={[style.sucUpdate, style.green]}>Gagal Approve Dokumen</div>
                        </div>
                        </div>
                    ) : this.state.confirm === 'rejDocFalse' ?(
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
    getDocCart: pengadaan.getDocCart,
    approveAll: pengadaan.approveAll,
    updateRecent: pengadaan.updateRecent,
    testApiPods: pengadaan.testApiPods
}

export default connect(mapStateToProps, mapDispatchToProps)(Pengadaan)
