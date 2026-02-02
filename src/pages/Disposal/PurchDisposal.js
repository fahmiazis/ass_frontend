/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { Component } from 'react'
import {NavbarBrand, Input, Button, Row, Col, Table,
    Modal, ModalHeader, ModalBody, ModalFooter, Container, Alert, Spinner} from 'reactstrap'
import style from '../../assets/css/input.module.css'
import {FaUserCircle, FaBars} from 'react-icons/fa'
import {AiOutlineCheck, AiOutlineClose, AiOutlineInbox, AiFillCheckCircle} from 'react-icons/ai'
import {BsCircle} from 'react-icons/bs'
import {Formik} from 'formik'
import * as Yup from 'yup'
import disposal from '../../redux/actions/disposal'
import setuju from '../../redux/actions/setuju'
import pengadaan from '../../redux/actions/pengadaan'
import {connect} from 'react-redux'
import Pdf from "../../components/Pdf"
import moment from 'moment'
import auth from '../../redux/actions/auth'
import {default as axios} from 'axios'
import Sidebar from "../../components/Header";
import MaterialTitlePanel from "../../components/material_title_panel";
import SidebarContent from "../../components/sidebar_content";
import placeholder from  "../../assets/img/placeholder.png"
import a from "../../assets/img/a.jpg"
import b from "../../assets/img/b.jpg"
import c from "../../assets/img/c.jpg"
import d from "../../assets/img/d.jpg"
import e from "../../assets/img/e.jpg"
import f from "../../assets/img/f.png"
import g from "../../assets/img/g.png"
import NumberInput from "../../components/NumberInput";
import NavBar from '../../components/NavBar'
import notif from '../../redux/actions/notif'
import styleTrans from '../../assets/css/transaksi.module.css'
import NewNavbar from '../../components/NewNavbar'
import TrackingDisposal from '../../components/Disposal/TrackingDisposal'
import Email from '../../components/Disposal/Email'
import tempmail from '../../redux/actions/tempmail'
import newnotif from '../../redux/actions/newnotif'
import FormDisposal from '../../components/Disposal/FormDisposal'
import FormPersetujuan from '../../components/Disposal/FormPersetujuan'
import ModalDokumen from '../../components/ModalDokumen'
import debounce from 'lodash.debounce';
import Select from 'react-select/creatable';
const {REACT_APP_BACKEND_URL} = process.env

const disposalSchema = Yup.object().shape({
    merk: Yup.string().validateSync(""),
    keterangan: Yup.string().required('must be filled'),
    nilai_jual: Yup.number().required('must be filled')
})

const alasanSchema = Yup.object().shape({
    alasan: Yup.string()
});

class PurchDisposal extends Component {
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
            newDis: [],
            upload: false,
            errMsg: '',
            fileUpload: '',
            limit: 100,
            search: '',
            modalRinci: false,
            dataRinci: {},
            openModalDoc: false,
            alertSubmit: false,
            fileName: {},
            openRejectDis: false,
            openApproveDis: false,
            sidebarOpen: false,
            listMut: [],
            openDraft: false,
            modalSubmit: false,
            subject: '',
            message: '',
            listStat: [],
            typeReject: '',
            menuRev: '',
            tipeEmail: '',
            dataRej: {},
            openReject: false,
            filter: 'available',
            time: 'pilih',
            time1: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
            // time1: moment().startOf('month').format('YYYY-MM-DD'),
            time2: moment().endOf('month').format('YYYY-MM-DD'),
            openDoc: false,
            noDoc: '',
            noTrans: '',
            valdoc: {},
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
        
        const status = filter === 'available' ? 26 : 'all'

        if (val === null || val === undefined || val.length === 0) {
            this.setState({ options: [] })
        } else {
            await this.props.searchDisposal(token, limit, search, 1, status, undefined, cekTime1, cekTime2)

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

    showAlert = () => {
        this.setState({alert: true, modalEdit: false, modalAdd: false, modalUpload: false })
       
         setTimeout(() => {
            this.setState({
                alert: false
            })
         }, 10000)
    }

    rejectDokumen = async (value) => {
        const {fileName} = this.state
        const token = localStorage.getItem('token')
        await this.props.rejectDocDis(token, fileName.id, value, 'edit', 'peng')
        this.setState({openRejectDis: !this.state.openRejectDis})
        this.openModalPdf()
    }

    approveDokumen = async () => {
        const {fileName} = this.state
        const token = localStorage.getItem('token')
        await this.props.approveDocDis(token, fileName.id)
        this.setState({openApproveDis: !this.state.openApproveDis})
        this.openModalPdf()
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

    openModalPdf = () => {
        this.setState({openPdf: !this.state.openPdf})
    }

    cekSubmit = async () => {
        const token = localStorage.getItem('token')
        const { detailDis } = this.props.disposal
        const validate = ['-', null, '', '.', undefined]
        const cek = detailDis.find(item => item.status_form === 26 && (validate.find(x => x === item.nilai_jual) !== undefined))
        if (cek !== undefined) {
            this.setState({confirm: 'falseVal'})
            this.openConfirm()
        } else {
            this.openSubmit()
        }
    }

    openSubmit = () => {
        this.setState({modalSubmit: !this.state.modalSubmit})
    }

    prepSendEmail = async () => {
        const token = localStorage.getItem("token")
        const { detailDis } = this.props.disposal

        const tipe =  'approve'

        const tempno = {
            no: detailDis[0].no_disposal,
            kode: detailDis[0].kode_plant,
            jenis: 'disposal',
            tipe: tipe,
            menu: 'Purchasing Disposal Asset (Disposal asset)'
        }
        this.setState({ tipeEmail: 'approve' })
        await this.props.getDetailDisposal(token, detailDis[0].no_disposal)
        await this.props.getApproveDisposal(token, detailDis[0].no_disposal, 'Disposal')
        await this.props.getDraftEmail(token, tempno)
        this.openDraftEmail()
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

    openDraftEmail = () => {
        this.setState({ openDraft: !this.state.openDraft })
    }

    submitPurchDisposal = async () => {
        const token = localStorage.getItem('token')
        const { detailDis } = this.props.disposal
        // if (value.nilai_jual === '-') {
        //     this.setState({alertSubmit: true})
        //     setTimeout(() => {
        //         this.setState({
        //             alertSubmit: false
        //         })
        //     }, 10000)
        // } else {
        //     await this.props.submitPurch(token, value.no_asset)
        //     this.getDataDisposal()
        // }
        const data = {
            no: detailDis[0].no_disposal
        }
        await this.props.submitPurch(token, data)
        this.prosesSendEmail(`submit`)
        this.openSubmit()
        this.openDraftEmail()
        this.setState({confirm: 'submit'})
        this.openConfirm()
        this.openModalDis()
        this.getDataDisposal()
    }

    rejectDisposal = async (val) => {
        const { detailDis } = this.props.disposal
        const { listStat, listMut, typeReject, menuRev } = this.state
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
            type: 'verif',
            type_reject: typeReject,
            user_rev: detailDis[0].kode_plant
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
            route: val === 'reject perbaikan' ? 'rev-disposal' : 'disposal'
        }
        await this.props.sendEmail(token, sendMail)
        await this.props.addNewNotif(token, sendMail)
    }

    openModalApproveDis = () => {
        this.setState({openApproveDis: !this.state.openApproveDis})
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

    openModalRejectDis = () => {
        this.setState({openRejectDis: !this.state.openRejectDis})
    }

    closeProsesModalDoc = () => {
        this.setState({openModalDoc: !this.state.openModalDoc})
        // this.setState({modalRinci: !this.state.modalRinci})
    }

    modalNewDoc = () => {
        this.setState({openDoc: !this.state.openDoc})
        // this.setState({modalRinci: !this.state.modalRinci})
    }

    openProsesModalDoc = async () => {
        const token = localStorage.getItem('token')
        const { dataRinci } = this.state
        const data = {
            noId: dataRinci.id,
            noAsset: dataRinci.no_asset
        }
        this.setState({ noDoc: dataRinci.no_asset, noTrans: dataRinci.no_disposal, valdoc: dataRinci })
        await this.props.getDocumentDis(token, data, 'disposal', 'pengajuan')
        this.modalNewDoc()
    }

    openProsesDoc = async () => {
        const token = localStorage.getItem('token')
        const { dataRinci } = this.state
        const data = {
            noId: dataRinci.id,
            noAsset: dataRinci.no_asset
        }
        await this.props.getDocumentDis(token, data, 'disposal', 'purch')
        this.closeProsesModalDoc()
    }

    prosesOpenDisposal = async (val) => {
        const token = localStorage.getItem('token')
        await this.props.getDetailDisposal(token, val.no_disposal, 'pengajuan')
        await this.props.getApproveDisposal(token, val.no_disposal, 'Disposal')
        this.openModalDis()
    }

    openModalDis = () => {
        this.setState({formDis: !this.state.formDis})
    }

    openModalReject = () => {
        this.setState({openReject: !this.state.openReject})
    }

    prosesOpenDetail = (val) => {
        this.setState({dataRinci: val})
        this.openModalRinci()
    }

    openModalRinci = () => {
        this.setState({modalRinci: !this.state.modalRinci})
    }

    uploadAlert = () => {
        this.setState({upload: true, modalUpload: false })
       
         setTimeout(() => {
            this.setState({
                upload: false
            })
         }, 10000)
    }

    toggle = () => {
        this.setState({isOpen: !this.state.isOpen})
    }

    openConfirm = (val) => {
        this.setState({modalConfirm: val === undefined || val === null || val === '' ? !this.state.modalConfirm : val})
    }

    dropDown = () => {
        this.setState({dropOpen: !this.state.dropOpen})
    }
    dropOpen = () => {
        this.setState({dropOpenNum: !this.state.dropOpenNum})
    }
    onSetSidebarOpen = () => {
        this.setState({ sidebarOpen: !this.state.sidebarOpen });
    }

    openModalDownload = () => {
        this.setState({modalUpload: !this.state.modalUpload})
    }

    deleteItem = async (value) => {
        const token = localStorage.getItem('token')
        await this.props.deleteDisposal(token, value)
        this.getDataDisposal()
    }

    componentDidUpdate() {
        const {isError, isUpload, isSubmit, isAppDoc, isRejDoc} = this.props.disposal
        const error = this.props.setuju.isError
        const token = localStorage.getItem('token')
        const {dataRinci} = this.state
        const data = {
            noId: dataRinci.id,
            noAsset: dataRinci.no_asset
        }
        if (isError) {
            this.props.resetError()
            this.showAlert()
        } else if (isUpload) {
            // setTimeout(() => {
            //     this.props.resetError()
            //     this.setState({modalUpload: false})
            //  }, 1000)
            //  setTimeout(() => {
            //     this.props.getDocumentDis(token, data, 'disposal', 'purch')
            //  }, 1100)
             this.props.resetError()
             this.props.getDocumentDis(token, data, 'disposal', 'purch')
        } else if (error) {
            this.props.resetSetuju()
            this.showAlert()
        } else if (isAppDoc === true || isRejDoc === true) {
            // setTimeout(() => {
            //     this.props.resetDis()
            //  }, 1000)
            //  setTimeout(() => {
            //     this.props.getDocumentDis(token, data, 'disposal', 'pengajuan')
            //  }, 1100)
             this.props.resetDis()
             this.props.getDocumentDis(token, data, 'disposal', 'pengajuan')
        }
    }

    onSearch = (e) => {
        this.setState({search: e.target.value})
        if(e.key === 'Enter'){
            this.changeFilter(this.state.filter)
        }
    }

    componentDidMount() {
        this.getDataDisposal()
    }

    getDataDisposal = async () => {
        const token = localStorage.getItem('token')
        this.changeFilter('available')
    }

    menuButtonClick(ev) {
        ev.preventDefault();
        this.onSetOpen(!this.state.open);
    }

    onSetOpen(open) {
        this.setState({ open });
    }

    cekUpdate = async (val) => {
        const token = localStorage.getItem('token')
        const {dataRinci} = this.state
        const data = {
            noId: dataRinci.id,
            noAsset: dataRinci.no_asset
        }
        await this.props.getDocumentDis(token, data, 'disposal', 'purch')
        const { dataDoc } = this.props.disposal
        const cek = []
        for (let i = 0; i < dataDoc.length; i++) {
           if (dataDoc[i].path !== null) {
            cek.push(dataDoc[i])
           }
        }
        if (dataDoc.length !== cek.length) {
            this.setState({confirm: 'falseDoc'})
            this.openConfirm()
        } else {
            this.updateDataDis(val)
        }
    }

    updateDataDis = async (value) => {
        const token = localStorage.getItem('token')
        const { dataRinci } = this.state
        await this.props.updateDisposal(token, dataRinci.id, value, 'disposal')
        await this.props.getDetailDisposal(token, dataRinci.no_disposal, 'pengajuan')
        this.setState({confirm: 'update'})
        this.openConfirm()
        // this.getDataDisposal()
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

    changeFilter = async (val) => {
        const token = localStorage.getItem('token')
        const role = localStorage.getItem('role')
        const level = localStorage.getItem('level')

        const { time1, time2, search, limit } = this.state
        const cekTime1 = time1 === '' ? 'undefined' : time1
        const cekTime2 = time2 === '' ? 'undefined' : time2
        const status = val === 'available' ? 26 : 'all'
        await this.props.getDisposal(token, limit, search, 1, status, undefined, cekTime1, cekTime2)
        const { dataDis, noDis } = this.props.disposal
        const dataTemp =  dataDis
        const noTemp = noDis
        if (val === 'available') {
            const newDis = []
            for (let i = 0; i < dataDis.length; i++) {
                if (dataDis[i].status_form === 26 && dataDis[i].status_reject !== 1) {
                    newDis.push(dataDis[i])
                }
            }
            this.setState({filter: val, newDis: newDis, baseData: newDis})
        }  else if (val === 'reject') {
            const newDis = []
            for (let i = 0; i < noTemp.length; i++) {
                const index = dataTemp.indexOf(dataTemp.find(({no_disposal}) => no_disposal === noTemp[i]))
                if (dataTemp[index] !== undefined && dataTemp[index].status_reject === 1) {
                    newDis.push(dataTemp[index])
                }
            }
            this.setState({filter: val, newDis: newDis, baseData: newDis})
        } else if (val === 'finish') {
            const newDis = []
            for (let i = 0; i < noTemp.length; i++) {
                const index = dataTemp.indexOf(dataTemp.find(({no_disposal}) => no_disposal === noTemp[i]))
                if (dataTemp[index] !== undefined && dataTemp[index].status_form === 8) {
                    newDis.push(dataTemp[index])
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

    prosesOpenTracking = async (val) => {
        const token = localStorage.getItem('token')
        const cekApp = {
            nama: val.kode_plant.split('').length === 4 ? 'disposal pengajuan' :  'disposal pengajuan HO',
            no: val.no_disposal
        }
        await this.props.getDetailDisposal(token, val.no_disposal, 'pengajuan')
        this.openModalTrack()
    }

    openModalTrack = () => {
        this.setState({modalTrack: !this.state.modalTrack})
    }

    render() {
        const {alert, dataRinci, newDis, listMut, tipeEmail, listStat} = this.state
        const {dataDis, alertM, dataDoc, detailDis, disApp} = this.props.disposal
        const msgAlert = this.props.setuju.alertM
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
                {/* <Sidebar {...sidebarProps}>
                    <MaterialTitlePanel title={contentHeader}>
                        <div className={style.backgroundLogo}>
                            {level === '6' ? (
                                <div className={style.bodyDashboard}>
                                <div className={style.headMaster}>
                                    <div className={style.titleDashboard1}>Purchasing Disposal</div>
                                </div>
                                <Alert color="danger" className={style.alertWrong} isOpen={this.state.alertSubmit}>
                                    <div>Lengkapi nilai jual asset terlebih dahulu</div>
                                </Alert>
                                <Alert color="danger" className={style.alertWrong} isOpen={alert}>
                                    <div>{msgAlert}</div>
                                </Alert>
                                <Row className="cartDisposal2">
                                    {dataDis.length === 0 ? (
                                        <Col md={8} xl={8} sm={12}>
                                            <div className="txtDisposEmpty">Tidak ada data disposal</div>
                                        </Col>
                                    ) : (
                                        <Col md={12} xl={12} sm={12} className="mb-5 mt-5">
                                        {dataDis.length !== 0 && dataDis.map(item => {
                                            return (
                                                <div className="cart1">
                                                    <div className="navCart">
                                                        <img src={item.no_asset === '4100000150' ? b : item.no_asset === '4300001770' ? e : placeholder} className="cartImg" />
                                                        <Button size="sm" color="warning" className="labelBut">Penjualan</Button>
                                                        <div className="txtCart">
                                                            <div>
                                                                <div className="nameCart mb-3">{iemt.nama_asset}</div>
                                                                <div className="noCart mb-3">No asset : {item.no_asset}</div>
                                                                <div className="noCart mb-3">No disposal : D{item.no_disposal}</div>
                                                                <div className="noCart mb-3">{item.keterangan}</div>
                                                                <Button color="success" onClick={() => this.submitPurchDisposal(item)}>Submit</Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="footCart">
                                                        <Button color="primary" onClick={() => this.openModalRinci(this.setState({dataRinci: item}))}>Rincian</Button>
                                                        <div></div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </Col>
                                    )}
                                </Row>
                            </div>
                            ) : (
                                <div className={style.headMaster}>
                                    <div className={style.titleDashboard1}>Anda tidak memiliki akses dihalaman ini</div>
                                </div>
                            )}
                        </div>
                    </MaterialTitlePanel>
                </Sidebar> */}
                <div className={styleTrans.app}>
                    <NewNavbar handleSidebar={this.prosesSidebar} handleRoute={this.goRoute} />

                    <div className={`${styleTrans.mainContent} ${this.state.sidebarOpen ? styleTrans.collapsedContent : ''}`}>
                        <h2 className={styleTrans.pageTitle}>Verifikasi Purchasing Disposal Asset</h2>
                        <div className={styleTrans.searchContainer}>
                            {(level === '5' || level === '9' ) ? (
                                <Button size="lg" color='primary' onClick={this.goCartDispos}>Create</Button>
                            ) : (
                                <div></div>
                            )}
                            <select value={this.state.filter} onChange={e => this.changeFilter(e.target.value)} className={styleTrans.searchInput}>
                                <option value="all">All</option>
                                <option value="available">Available Approve</option>
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
                                    <th>NO</th>
                                    <th>NO.AJUAN</th>
                                    <th>AREA</th>
                                    <th>KODE PLANT</th>
                                    <th>COST CENTER</th>
                                    <th>TANGGAL AJUAN</th>
                                    <th>APPROVED BY</th>
                                    <th>TGL APPROVED</th>
                                    <th>OPSI</th>
                                </tr>
                            </thead>
                            <tbody>
                                {newDis.length !== 0 && newDis.map(item => {
                                    return (
                                        <tr className={item.status_reject === 0 ? 'note' : item.status_form == 0 ? 'fail' : item.status_reject === 1 && 'bad'}>
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
                    this.props.tempmail.isLoading ||
                    this.props.newnotif.isLoading
                    ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className={style.cekUpdate}>
                                <Spinner />
                                <div sucUpdate>Waiting....</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
                <Modal size="xl" isOpen={this.state.openDoc} toggle={this.modalNewDoc}>
                    <ModalDokumen
                        parDoc={{ noDoc: this.state.noDoc, noTrans: this.state.noTrans, tipe: 'disposal', filter: this.state.filter, detailForm: this.state.valdoc }}
                        dataDoc={dataDoc}
                        onClose={() => this.modalNewDoc()}
                    />
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
                <Modal isOpen={this.state.formDis} toggle={this.openModalDis} size="xl" className='xl'>
                    <ModalBody>
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
                                    <th>Opsi</th>
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
                                                <Button color='success' onClick={() => this.prosesOpenDetail(item)}>Proses</Button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                        <div className="mb-3">Demikianlah hal yang kami sampaikan, atas perhatiannya kami mengucapkan terima kasih</div>
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
                                    {disApp.penyetuju?.map(item => (
                                        <th className="headPre">
                                            <div>{item.status === 0 ? 'Reject' : item.status === 1 ? moment(item.updatedAt).format('LL') : '-'}</div>
                                            <div>{item.nama ?? '-'}</div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {disApp.pembuat?.map(item => (
                                        <td className="footPre">{item.jabatan ?? '-'}</td>
                                    ))}
                                    {disApp.pemeriksa?.filter(item => item.status_view !== 'hidden').map(item => (
                                        <td className="footPre">{item.jabatan ?? '-'}</td>
                                    ))}
                                    {disApp.penyetuju?.map(item => (
                                        <td className="footPre">{item.jabatan ?? '-'}</td>
                                    ))}
                                </tr>
                            </tbody>
                        </Table>
                    </ModalBody>
                    <hr />
                    <div className="modalFoot ml-3">
                        <div className="btnFoot">
                            <FormDisposal />
                            {detailDis.length > 0 && detailDis[0].status_form !== 26 && detailDis[0].status_form !== 9 && detailDis[0].status_form >= 3 && (
                                <FormPersetujuan />
                            )}
                        </div>
                        
                        <div className="btnFoot">
                        {this.state.filter === 'available' ? (
                            <>
                            <Button className="mr-2" color="danger" disabled={this.state.filter !== 'available' ? true : listMut.length === 0 ? true : false} onClick={this.openModalReject}>
                                Reject
                            </Button>
                            <Button color="success" onClick={this.cekSubmit} disabled={this.state.filter !== 'available' ? true : false}>
                                Submit
                            </Button>
                            </>
                        ) : (
                            <Button className="" color="secondary" onClick={this.openModalDis}>
                                Close
                            </Button>
                        )}
                            
                        </div>
                    </div>
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
                                <Button color="primary" onClick={this.prepSendEmail}>Ya</Button>
                                <Button color="secondary" onClick={this.openSubmit}>Tidak</Button>
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
                <Modal isOpen={this.state.modalRinci} toggle={this.openModalRinci} size="xl">
                    <ModalHeader>
                        Rincian
                    </ModalHeader>
                    <ModalBody>
                        <Alert color="danger" className={style.alertWrong} isOpen={alert}>
                            <div>{alertM}</div>
                        </Alert>
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
                                keterangan: dataRinci.keterangan === null ? '' : dataRinci.keterangan,
                                nilai_jual: dataRinci.nilai_jual,
                                merk: dataRinci.merk
                            }}
                            validationSchema = {disposalSchema}
                            onSubmit={(values) => {this.cekUpdate(values)}}
                            >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue}) => (
                                <div className="rightRinci">
                                    <div>
                                        <div className="titRinci">{dataRinci.nama_asset}</div>
                                        <Row className="mb-2">
                                            <Col md={3}>Area</Col>
                                            <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.area} disabled /></Col>
                                        </Row>
                                        <Row className="mb-2">
                                            <Col md={3}>No Asset</Col>
                                            <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.no_asset} disabled /></Col>
                                        </Row>
                                        <Row className="mb-2">
                                            <Col md={3}>Merk / Type</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                type= "text" 
                                                className="inputRinci"
                                                value={values.merk}
                                                onBlur={handleBlur("merk")}
                                                onChange={handleChange("merk")}
                                                disabled
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
                                                    <div className="ml-2"><input type="checkbox" checked={dataRinci.kategori === 'IT' ? true : false}/> IT</div>
                                                    <div className="ml-3"><input type="checkbox" checked={dataRinci.kategori === 'NON IT' ? true : false}/> Non IT</div>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row className="mb-2">
                                            <Col md={3}>Status Area</Col>
                                            <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.status_depo} disabled /></Col>
                                        </Row>
                                        <Row className="mb-2">
                                            <Col md={3}>Cost Center</Col>
                                            <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.cost_center} disabled /></Col>
                                        </Row>
                                        <Row className="mb-2">
                                            <Col md={3}>Nilai Buku</Col>
                                            <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.nilai_buku === null || dataRinci.nilai_buku === undefined ? 0 : dataRinci.nilai_buku.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} disabled /></Col>
                                        </Row>
                                        <Row className="mb-2">
                                            <Col md={3}>Nilai Jual</Col>
                                            <Col md={9} className="colRinci">:  <NumberInput 
                                                value={values.nilai_jual}
                                                className="inputRinci1"
                                                onValueChange={val => setFieldValue("nilai_jual", val.floatValue)}
                                            />
                                            </Col>
                                        </Row>
                                        {errors.nilai_jual ? (
                                            <text className={style.txtError}>{errors.nilai_jual}</text>
                                        ) : null}
                                        <Row className="mb-2">
                                            <Col md={3}>Keterangan</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                className="inputRinci" 
                                                type="text" 
                                                value={values.keterangan} 
                                                onBlur={handleBlur("keterangan")}
                                                onChange={handleChange("keterangan")}
                                                disabled
                                                />
                                            </Col>
                                        </Row>
                                        {errors.keterangan ? (
                                            <text className={style.txtError}>{errors.keterangan}</text>
                                        ) : null}
                                    </div>
                                    <div className="footRinci1 mt-3">
                                        <div className='rowGeneral'>
                                            <Button className="" size="md" color="success" onClick={() => this.openProsesDoc()}>Upload dokumen</Button>
                                            <Button className="ml-2" size="md" color="warning" onClick={() => this.openProsesModalDoc()}>Dokumen area</Button>
                                        </div>
                                        <div>
                                            <Button className="mr-2" size="md" color="primary" onClick={handleSubmit}>Save</Button>
                                            {/* <Button className="" size="md" color="secondary" onClick={this.openModalRinci}>Close</Button> */}
                                        </div>
                                    </div>
                                </div>
                            )}
                            </Formik>
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
                            {level === '5' ? (
                                <Button color="primary" onClick={() => this.setState({openPdf: false})}>Close</Button>
                            ) : this.state.fileName.nama_dokumen === 'Form Seleksi Vendor' ? (
                                <Button color="primary" onClick={() => this.setState({openPdf: false})}>Close</Button>
                            ) : (
                                <div>
                                    <Button color="danger" className="mr-3" onClick={this.openModalRejectDis}>Reject</Button>
                                    <Button color="primary" onClick={this.openModalApproveDis}>Approve</Button>
                                </div>
                            )}
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
                <Modal isOpen={this.state.modalTrack} toggle={() => this.openModalTrack()} size="xl" className='xl'>
                    <TrackingDisposal />
                    <hr />
                    <div className="modalFoot ml-3">
                        {/* <Button color="primary" onClick={() => this.openModPreview({nama: 'disposal pengajuan', no: detailDis[0] !== undefined && detailDis[0].no_disposal})}>Preview</Button> */}
                        <div></div>
                        <div className="btnFoot">
                            <Button color="primary" onClick={() => this.openModalTrack()}>
                                Close
                            </Button>
                        </div>
                    </div>
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
                        ) : this.state.confirm === 'submit' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Submit</div>
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
                        ) : this.state.confirm === 'falseDoc' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Update</div>
                                <div className="errApprove mt-2">Mohon untuk upload dokumen terlebih dulu</div>
                            </div>
                            </div>
                        ) : this.state.confirm === 'falseVal' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Submit</div>
                                <div className="errApprove mt-2">Mohon untuk isi nilai jual terlebih dulu</div>
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
                        <Email handleData={this.getMessage}/>
                        <div className={style.foot}>
                            <div></div>
                            <div>
                                <Button
                                    disabled={this.state.message === '' ? true : false} 
                                    className="mr-2"
                                    onClick={tipeEmail === 'reject' 
                                    ? () => this.rejectDisposal(this.state.dataRej) 
                                    : () => this.submitPurchDisposal()
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
        </>
        )
    }
}

const mapStateToProps = state => ({
    disposal: state.disposal,
    setuju: state.setuju,
    pengadaan: state.pengadaan,
    notif: state.notif,
    tempmail: state.tempmail,
    newnotif: state.newnotif,
})

const mapDispatchToProps = {
    logout: auth.logout,
    getDisposal: disposal.getDisposal,
    resetError: disposal.reset,
    deleteDisposal: disposal.deleteDisposal,
    updateDisposal: disposal.updateDisposal,
    getDocumentDis: disposal.getDocumentDis,
    uploadDocumentDis: disposal.uploadDocumentDis,
    approveDocDis: disposal.approveDocDis,
    rejectDocDis: disposal.rejectDocDis,
    rejectDisposal: disposal.rejectDisposal,
    submitPurch: setuju.submitPurchDisposal,
    resetSetuju: setuju.resetSetuju,
    showDokumen: pengadaan.showDokumen,
    resetDis: disposal.reset,
    notifDisposal: notif.notifDisposal,
    getDetailDisposal: disposal.getDetailDisposal,
    getApproveDisposal: disposal.getApproveDisposal,
    getDraftEmail: tempmail.getDraftEmail,
    sendEmail: tempmail.sendEmail,
    addNewNotif: newnotif.addNewNotif,
    searchDisposal: disposal.searchDisposal
}

export default connect(mapStateToProps, mapDispatchToProps)(PurchDisposal)