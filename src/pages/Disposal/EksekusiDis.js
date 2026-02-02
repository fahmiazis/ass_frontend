/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { Component } from 'react'
import {NavbarBrand, Input, Button, Row, Col,
    Modal, ModalHeader, ModalBody, ModalFooter, Container, Alert, Spinner, Table} from 'reactstrap'
import Pdf from "../../components/Pdf"
import style from '../../assets/css/input.module.css'
import {FaUserCircle, FaBars, FaSearch} from 'react-icons/fa'
import {AiOutlineCheck, AiOutlineClose, AiFillCheckCircle, AiOutlineInbox} from 'react-icons/ai'
import {BsCircle} from 'react-icons/bs'
import {Formik} from 'formik'
import * as Yup from 'yup'
import pengadaan from '../../redux/actions/pengadaan'
import disposal from '../../redux/actions/disposal'
import setuju from '../../redux/actions/setuju'
import {connect} from 'react-redux'
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
import TablePdf from "../../components/Table"
import TablePeng from '../../components/TablePeng'
import NavBar from '../../components/NavBar'
import styleTrans from '../../assets/css/transaksi.module.css'
import NewNavbar from '../../components/NewNavbar'
import TrackingDisposal from '../../components/Disposal/TrackingDisposal'
import tempmail from '../../redux/actions/tempmail'
import newnotif from '../../redux/actions/newnotif'
import Email from '../../components/Disposal/Email'
import FormDisposal from '../../components/Disposal/FormDisposal'
import FormPersetujuan from '../../components/Disposal/FormPersetujuan'
import ModalDokumen from '../../components/ModalDokumen'
import debounce from 'lodash.debounce';
import Select from 'react-select/creatable';
const {REACT_APP_BACKEND_URL} = process.env

const disposalSchema = Yup.object().shape({
    // doc_sap: Yup.string().required('must be filled'),
    doc_sap: Yup.string(),
    date_ba: Yup.string().required('must be filled')
})

const alasanSchema = Yup.object().shape({
    alasan: Yup.string()
});

class EksekusiDisposal extends Component {
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
            upload: false,
            errMsg: '',
            fileUpload: '',
            limit: 100,
            search: '',
            modalRinci: false,
            dataRinci: {},
            openModalDoc: false,
            alertSubmit: false,
            alertSubmit2: false,
            openPdf: false,
            npwp: '',
            fileName: {},
            idDoc: 0,
            date: '',
            openRejectDis: false,
            openApproveDis: false,
            preset: false,
            preview: false,
            openRejEks: false,
            dataEks: false,
            view: '',
            newDis: [],
            baseData: [],
            sidebarOpen: false,
            filter: 'available',
            time: 'pilih',
            time1: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
            // time1: moment().startOf('month').format('YYYY-MM-DD'),
            time2: moment().endOf('month').format('YYYY-MM-DD'),
            formDis: false,
            modalTrack: false,
            listMut: [],
            openDraft: false,
            subject: '',
            message: '',
            listStat: [],
            typeReject: '',
            menuRev: '',
            tipeEmail: '',
            dataRej: {},
            openApprove: false,
            openReject: false,
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
        
        const status = (filter === 'available' && level === '2') ? 4 : (filter === 'available' && (level === '5' || level === '9')) ? 15 : 'all'

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

    showAlert = () => {
        this.setState({alert: true})
       
         setTimeout(() => {
            this.setState({
                alert: false
            })
         }, 5000)
    }

    prosesSidebar = (val) => {
        this.setState({sidebarOpen: val})
    }
    
    goRoute = (val) => {
        this.props.history.push(`/${val}`)
    }

    goReport = (val) => {
        this.props.history.push({
            pathname: '/report-disposal',
            state: val
        })
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

    openModalApproveDis = () => {
        this.setState({openApproveDis: !this.state.openApproveDis})
    }
    openModalRejectDis = () => {
        this.setState({openRejectDis: !this.state.openRejectDis})
    }

    openModalPdf = () => {
        this.setState({openPdf: !this.state.openPdf})
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

    closeProsesModalDoc = () => {
        this.setState({openModalDoc: !this.state.openModalDoc})
    }

    prosesOpenDokumen = (val) => {
        this.setState({dataRinci: val})
        this.setState({ noDoc: val.no_asset, noTrans: val.no_disposal, valdoc: val })
        setTimeout(() => {
            // this.openProsesDocPeng(val)
            this.openProsesDocEks(val)
         }, 100)
    }

    openProsesDocPeng = async (val) => {
        const token = localStorage.getItem('token')
        const data = {
            noId: val.id,
            noAsset: val.no_asset
        }
        await this.props.getDocumentDis(token, data, 'disposal', 'pengajuan')
        this.closeProsesModalDoc()
    }

    openProsesDocEks = async (value) => {
        const token = localStorage.getItem('token')
        this.setState({dataRinci: value})
        const data = {
            noId: value.id,
            noAsset: value.no_asset
        }
        const tipeDis = value.nilai_jual === "0" ? 'dispose' : 'sell'
        this.props.getDocumentDis(token, data, 'disposal', tipeDis, value.npwp)
        this.closeProsesModalDoc()
    }

    prosesOpenRinci = (val) => {
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
         }, 5000)
    }

    toggle = () => {
        this.setState({isOpen: !this.state.isOpen})
    }
    
    rejectEks = async (val) => {
        const token = localStorage.getItem('token')
        const {dataEks} = this.state
        const data = {
            reason: val.alasan
        }
        await this.props.rejectEks(token, dataEks.id, data)
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

    rejectDokumen = async (value) => {
        const {fileName, dataRinci} = this.state
        const token = localStorage.getItem('token')
        this.setState({openRejectDis: !this.state.openRejectDis})
        await this.props.rejectDocDis(token, fileName.id, value, 'edit', 'eks')
        await this.props.getDocumentDis(token, dataRinci.no_asset, 'disposal', dataRinci.nilai_jual === "0" ? 'dispose' : 'sell', 'ada')
        this.openModalPdf()
    }

    openModalRejEks = () => {
        this.setState({openRejEks: !this.state.openRejEks})
    }

    openModEks = (val, tipe) => {
        this.setState({dataEks: val})
        if (tipe === 'reject') {
            this.openModalRejEks()
        }
    }

    modalPers = () => {
        this.setState({preset: !this.state.preset})
    }

    modalPeng = () => {
        this.setState({preview: !this.state.preview})
    } 

    persetujuanDisposal = async (value) => {
        const token = localStorage.getItem('token')
        await this.props.getDetailDisposal(token, value, 'persetujuan')
        await this.props.getApproveSetDisposal(token, value, 'disposal persetujuan')
        this.modalPers()
    }

    pengajuanDisposal = async (value) => {
        const token = localStorage.getItem('token')
        await this.props.getDetailDisposal(token, value, 'pengajuan')
        await this.props.getApproveDisposal(token, value, 'disposal pengajuan')
        this.modalPeng()
    }

    approveDokumen = async () => {
        const {fileName, dataRinci} = this.state
        const token = localStorage.getItem('token')
        await this.props.approveDocDis(token, fileName.id)
        await this.props.getDocumentDis(token, dataRinci.no_asset, 'disposal', dataRinci.nilai_jual === "0" ? 'dispose' : 'sell', 'ada')
        this.setState({openApproveDis: !this.state.openApproveDis})
        this.openModalPdf()
    }

    deleteItem = async (value) => {
        const token = localStorage.getItem('token')
        await this.props.deleteDisposal(token, value)
        this.getDataDisposal()
    }

    getMessage = (val) => {
        this.setState({ message: val.message, subject: val.subject })
        console.log(val)
    }

    cekSubmit = async () => {
        const level = localStorage.getItem('level')
        const token = localStorage.getItem('token')
        const {detailDis} = this.props.disposal
        const cekSap = []
        const cekNo = []
        const tempdoc = []
        const arrDoc = []
        for (let i = 0; i < detailDis.length; i++) {
            if (detailDis[i].nilai_jual === "0" && (detailDis[i].doc_sap === null || detailDis[i].doc_sap === '')) {
                // cekNo.push(detailDis[i])
            } else if (detailDis[i].nilai_jual === "0" && (detailDis[i].date_ba === null || detailDis[i].date_ba === '')) {
                cekSap.push(detailDis[i])
            } else {
                const tipeDis = detailDis[i].nilai_jual === "0" ? 'dispose' : 'sell'
                const data = {
                    noId: detailDis[i].id,
                    noAsset: detailDis[i].no_asset
                }
                await this.props.getDocumentDis(token, data, 'disposal', tipeDis, detailDis[i].npwp)
                const {dataDoc} = this.props.disposal
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
            }
        }
        if (cekNo.length > 0) {
            this.setState({confirm: 'falseNodoc'})
            this.openConfirm()
        } else if (cekSap.length > 0) {
            this.setState({confirm: 'falseDateBa'})
            this.openConfirm()
        } else if (tempdoc.length !== arrDoc.length) {
            this.setState({ confirm: 'falsubmit' })
            this.openConfirm()
        } else {
            this.openModalApprove()
        }
    }

    prosesSubmit = async (val) => {
        const token = localStorage.getItem('token')
        const level = localStorage.getItem('level')
        const {detailDis} = this.props.disposal
        // if (value.nilai_jual === '0' && level === '2') {
        //     if (value.doc_sap === null || value.doc_sap === '') {
        //         this.setState({alertSubmit: true})
       
        //         setTimeout(() => {
        //            this.setState({
        //                alertSubmit: false
        //            })
        //         }, 5000)
        //     } else {
        //         await this.props.submitEksDisposal(token, value.no_asset)
        //     }
        // } else if (value.nilai_jual !== '0' && level === '5' ) {
        //     if (value.npwp === null || value.npwp === '') {
        //         this.setState({alertSubmit2: true})
       
        //         setTimeout(() => {
        //            this.setState({
        //                 alertSubmit2: false
        //            })
        //         }, 5000)
        //     } else {
        //         await this.props.submitEksDisposal(token, value.no_asset)
        //     }
        // } else {
        //     await this.props.submitEksDisposal(token, value.no_asset)
        // }
        const data = {
            no: detailDis[0].no_disposal
        }
        await this.props.submitEksDisposal(token, data)
        this.prosesSendEmail('submit')
        this.openModalApprove()
        this.openModalDis()
        this.openDraftEmail()
        this.setState({confirm: 'submit'})
        this.openConfirm()
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

    prepSendEmail = async () => {
        const token = localStorage.getItem("token")
        const { detailDis } = this.props.disposal

        const tipe =  'submit'

        const tempno = {
            no: detailDis[0].no_disposal,
            kode: detailDis[0].kode_plant,
            jenis: 'disposal',
            tipe: tipe,
            menu: 'Eksekusi Disposal Asset (Disposal asset)'
        }
        this.setState({ tipeEmail: 'submit' })
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
            route: val === 'reject perbaikan' ? 'rev-disposal' : 'taxfin-disposal'
        }
        await this.props.sendEmail(token, sendMail)
        await this.props.addNewNotif(token, sendMail)
    }

    componentDidUpdate() {
        const {isError, isUpload, isSubmit, isEditEks, rejEks} = this.props.disposal
        const { isSubmitEks } = this.props.setuju
        const error = this.props.setuju.isError
        const token = localStorage.getItem('token')
        const {dataRinci} = this.state
        if (isError) {
            this.props.resetError()
            this.showAlert()
        } else if (isUpload) {
            this.props.resetError()
            const data = {
                noId: dataRinci.id,
                noAsset: dataRinci.no_asset
            }
            const tipeDis = dataRinci.nilai_jual === "0" ? 'dispose' : 'sell'
            this.props.getDocumentDis(token, data, 'disposal', tipeDis, dataRinci.npwp)
        } else if (isSubmit) {
            this.props.resetError()
            setTimeout(() => {
                this.getDataDisposal()
             }, 1000)
        } else if (error) {
            this.props.resetSetuju()
            this.showAlert()
        } 
        // else if (isSubmitEks === true) {
        //     this.getDataDisposal()
        //     this.setState({confirm: 'submit'})
        //     this.openConfirm()
        //     this.props.resetSetuju()
        // } 
        else if (isSubmitEks === false) {
            this.setState({confirm: 'falsubmit'})
            this.openConfirm()
            this.props.resetSetuju()
        } else if (rejEks === true) {
            this.getDataDisposal()
            this.openModalRejEks()
            this.setState({confirm: 'rejeks'})
            this.openConfirm()
            this.props.resetError()
        } else if (rejEks === false) {
            this.openModalRejEks()
            this.setState({confirm: 'rejrejeks'})
            this.openConfirm()
            this.props.resetError()
        }
    }

    componentDidMount() {
        this.getDataDisposal()
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

    getDataDisposal = async () => {
        // const token = localStorage.getItem('token')
        // const level = localStorage.getItem('level')
        // await this.props.getDisposal(token, 10, '',  1, level === '5' ? 4 : 5)
        this.changeFilter('available')
    }

    menuButtonClick(ev) {
        ev.preventDefault();
        this.onSetOpen(!this.state.open);
    }

    onSetOpen(open) {
        this.setState({ open });
    }

    updateDataDis = async (val) => {
        const token = localStorage.getItem('token')
        const { dataRinci } = this.state
        const data = {
            date_ba: val.date_ba,
            doc_sap: val.doc_sap
        }
        // const data = {
        //     doc_sap: val.doc_sap
        // }
        await this.props.updateDisposal(token, dataRinci.id, data)
        await this.props.getDetailDisposal(token, dataRinci.no_disposal, 'pengajuan')
        this.setState({confirm: 'update'})
        this.openConfirm()
    }

    onSearch = async (e) => {
        this.setState({search: e.target.value})
        const token = localStorage.getItem("token")
        if(e.key === 'Enter'){
            this.changeFilter(this.state.filter)
        }
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
        const status = (val === 'available' && level === '2') ? 4 : (val === 'available' && (level === '5' || level === '9')) ? 15 : 'all'
        await this.props.getDisposal(token, limit, search, 1, status, undefined, cekTime1, cekTime2)

        const { dataDis, noDis } = this.props.disposal
        if (val === 'available') {
            const newDis = []
            for (let i = 0; i < dataDis.length; i++) {
                if (dataDis[i].status_form === 4 && level === '2' && dataDis[i].status_reject !== 1) {
                    newDis.push(dataDis[i])
                } else if (dataDis[i].status_form === 15 && (level === '5' || level === '9') && dataDis[i].status_reject !== 1) {
                    newDis.push(dataDis[i])
                }
            }
            this.setState({filter: val, newDis: newDis, baseData: newDis})
        } else if (val === 'reject') {
            const newDis = []
            for (let i = 0; i < dataDis.length; i++) {
                if (dataDis[i].status_reject === 1) {
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

    updateNpwp = async (value) => {
        this.setState({npwp: value})
        const token =localStorage.getItem('token')
        const data = {
            npwp: value
        }
        const { dataRinci } = this.state
        await this.props.updateDisposal(token, dataRinci.id, data)
        this.getDataDisposal()
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

    openModalDis = () => {
        this.setState({formDis: !this.state.formDis})
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

    openModalApprove = () => {
        this.setState({openApprove: !this.state.openApprove})
    }

    openModalReject = () => {
        this.setState({listStat: [], openReject: !this.state.openReject})
    }

    render() {
        const {alert, dataRinci, newDis, view, tipeEmail, listMut, listStat} = this.state
        const {dataDis, dataDoc, detailDis, disApp} = this.props.disposal
        const msgAlert = this.props.setuju.alertM
        const disSet = this.props.setuju.disApp
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
                            <div className={style.bodyDashboard}>
                                <div className={style.headMaster}>
                                    <div className={style.titleDashboard}>Eksekusi Disposal </div>
                                </div>
                                <Alert color="danger" className={style.alertWrong} isOpen={this.state.alertSubmit}>
                                    <div>Lengkapi no dokumen SAP sebelum submit</div>
                                </Alert>
                                <Alert color="danger" className={style.alertWrong} isOpen={this.state.alertSubmit2}>
                                    <div>Pilih Status npwp terlebih dahulu</div>
                                </Alert>
                                <Alert color="danger" className={style.alertWrong} isOpen={alert}>
                                    <div>{msgAlert}</div>
                                </Alert>
                                <div className={[style.secEmail2]}>
                                    <div className="mt-5">
                                        <Input type="select" value={this.state.view} onChange={e => this.changeFilter(e.target.value)}>
                                            <option value="all">All</option>
                                            <option value="available">Available Submit</option>
                                            <option value="revisi">Available Resubmit (Revisi)</option>
                                            <option value="reject">Reject</option>
                                        </Input>
                                    </div>
                                    <div className={[style.searchEmail]}>
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
                                <Row className="cartDisposal2">
                                    {newDis.length === 0 ? (
                                        <Col md={8} xl={8} sm={12}>
                                            <div className="txtDisposEmpty"></div>
                                        </Col>
                                    ) : (
                                        <Col md={12} xl={12} sm={12} className="mb-5 mt-5">
                                        {newDis.length !== 0 && newDis.map(item => {
                                            return (
                                                <div className="cart1">
                                                    <div className="navCart">
                                                        <img src={item.no_asset === '4100000150' ? b : item.no_asset === '4300001770' ? e : placeholder} className="cartImg" />
                                                        <Button className="labelBut" color="warning" size="sm">{item.nilai_jual === '0' ? 'Pemusnahan' : 'Penjualan'}</Button>
                                                        <div className="txtCart">
                                                            <div>
                                                                <div className="nameCart mb-3">{item.nama_asset}</div>
                                                                <div className="noCart mb-3">No asset : {item.no_asset}</div>
                                                                <div className="noCart mb-3">No disposal : D{item.no_disposal}</div>
                                                                <div className="noCart mb-3">{item.keterangan}</div>
                                                                <Row className="noCart mb-3">
                                                                    <Button disabled={view === 'reject' || view === 'all' ? true : false} className='ml-3' color="success" onClick={() => this.submitEksDis(item)}>Submit</Button>
                                                                    <Button disabled={view === 'reject' || view === 'all' ? true : false} className='ml-3' color="danger" onClick={() => this.openModEks(item, 'reject')}>Reject</Button>
                                                                </Row>
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
                        </div>
                    </MaterialTitlePanel>
                </Sidebar> */}
                 <div className={styleTrans.app}>
                    <NewNavbar handleSidebar={this.prosesSidebar} handleRoute={this.goRoute} />

                    <div className={`${styleTrans.mainContent} ${this.state.sidebarOpen ? styleTrans.collapsedContent : ''}`}>
                        <h2 className={styleTrans.pageTitle}>Eksekusi Disposal Asset</h2>
                        <div className={styleTrans.searchContainer}>
                            <div></div>
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
                                                className="mt-1"
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
                <Modal size="xl" isOpen={this.state.openModalDoc} toggle={this.closeProsesModalDoc}>
                    <ModalDokumen
                        parDoc={{ noDoc: this.state.noDoc, noTrans: this.state.noTrans, tipe: 'eksekusi disposal', filter: this.state.filter, detailForm: this.state.valdoc }}
                        dataDoc={dataDoc}
                        onClose={() => this.closeProsesModalDoc()}
                    />
                </Modal>
                <Modal size="xl" 
                // isOpen={this.state.openModalDoc} 
                // toggle={this.closeProsesModalDoc}
                >
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
                                        <Col md={6} lg={6} className="docCol" >
                                            {x.divisi === '0' ? (
                                                <AiOutlineClose size={20} />
                                            ) : x.divisi === '3' ? (
                                                <AiOutlineCheck size={20} />
                                            ) : (
                                                <BsCircle size={20} />
                                            )}
                                            <div className='docRes'>
                                                <button className="btnDocIo" onClick={() => this.showDokumen(x)} >{x.nama_dokumen}</button>
                                                <div>
                                                    {level === '5' ? (
                                                        <input
                                                        className="ml-2"
                                                        type="file"
                                                        onClick={() => this.setState({detail: x})}
                                                        onChange={this.onChangeUpload}
                                                        />
                                                    ) : (
                                                        <text></text>
                                                    )}
                                                </div>
                                            </div>
                                        </Col>
                                    ) : (
                                        <Col md={6} lg={6} >
                                            {level === '5' ? (
                                                <input
                                                className="ml-4"
                                                type="file"
                                                onClick={() => this.setState({detail: x})}
                                                onChange={this.onChangeUpload}
                                                />
                                            ) : (
                                                <text>-</text>
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
            <Modal isOpen={this.state.openPdf} size="xl" toggle={this.openModalPdf} centered={true}>
                <ModalHeader>Dokumen</ModalHeader>
                    <ModalBody>
                        <div className={style.readPdf}>
                            <Pdf pdf={`${REACT_APP_BACKEND_URL}/show/doc/${this.state.idDoc}`} />
                        </div>
                        <hr/>
                        <div className={style.foot}>
                            <div>
                                <Button color="success"  onClick={() => this.downloadData()}>Download</Button>
                            </div>
                        {level === '5' ? (
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
                                nilai_jual: dataRinci.nilai_jual,
                                date_ba: dataRinci.date_ba === null ? '' : moment(dataRinci.date_ba).format('YYYY-MM-DD')
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
                                                disabled
                                                value={this.state.npwp === '' ? dataRinci.npwp : this.state.npwp} 
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
                                        
                                        {(level === '2' && dataRinci.nilai_jual === '0') && (
                                            <>
                                                <div>
                                                    <Row className="mb-2">
                                                        <Col md={3}>No Doc SAP</Col>
                                                        <Col md={9} className="colRinci">:  <Input 
                                                        className="inputRinci"
                                                        type="text"
                                                        value={values.doc_sap}
                                                        onChange={handleChange("doc_sap")}
                                                        onBlur={handleBlur("doc_sap")}
                                                        />
                                                        </Col>
                                                    </Row>
                                                    {errors.doc_sap ? (
                                                        <text className={style.txtError}>{errors.doc_sap}</text>
                                                    ) : null}
                                                </div>
                                                <div>
                                                    <Row className="mb-2">
                                                        <Col md={3}>Tgl BA Pemusnahan Asset</Col>
                                                        <Col md={9} className="colRinci">:  <Input 
                                                        className="inputRinci"
                                                        type="date"
                                                        value={values.date_ba}
                                                        onChange={handleChange("date_ba")}
                                                        onBlur={handleBlur("date_ba")}
                                                        />
                                                        </Col>
                                                    </Row>
                                                    {errors.date_ba ? (
                                                        <text className={style.txtError}>{errors.date_ba}</text>
                                                    ) : null}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <Row className="footRinci1 mt-4">
                                        {/* <Button className="btnFootRinci3" size="md" color="primary" outline onClick={handleSubmit}>Save</Button> */}
                                        {/* <Button className="btnFootRinci3" size="md" color="warning" outline onClick={() => this.openProsesDocEks(dataRinci)}>Doc Eksekusi</Button>
                                        <Button className="btnFootRinci3" size="md" color="success" outline onClick={() => this.openProsesDocPeng()}>Doc Pengajuan</Button>
                                        <Button className="btnFootRinci3" size="md" color="danger" outline onClick={() => this.pengajuanDisposal(dataRinci.no_disposal)}>Form Pengajuan</Button>
                                        <Button className="btnFootRinci3" size="md" color="info" outline onClick={() => this.persetujuanDisposal(dataRinci.no_persetujuan)}>Form Persetujuan</Button>
                                        {level === '2' ? (
                                            <>
                                                <Button className="btnFootRinci3 mb-5" size="md" color="danger" outline onClick={() => this.goReport(dataRinci.no_asset)}>Show Report</Button>
                                                <Button className="btnFootRinci3 mb-5" size="md" color="secondary" outline onClick={() => this.openModalRinci()}>Close</Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button className="btnFootRinci3 mb-5" size="md" color="secondary" outline onClick={() => this.openModalRinci()}>Close</Button>
                                                <div className="btnFootRinci3" size="md"></div>
                                            </>
                                        )} */}
                                        <div className='rowGeneral'>
                                        </div>
                                        <div className='rowGeneral'>
                                            <Button 
                                                disabled={
                                                    (level === '2' && dataRinci.nilai_jual === '0') && 
                                                    (values.doc_sap === '' || values.date_ba === '') ? true : false
                                                } 
                                                onClick={handleSubmit} 
                                                className='mr-1' 
                                                color='primary'
                                            >
                                                Save
                                            </Button>
                                            <Button onClick={this.openModalRinci}>Close</Button>
                                        </div>
                                    </Row>
                                </div>
                            )}
                            </Formik>
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
                <Modal isOpen={this.state.openRejEks} toggle={this.openModalRejEks} centered={true}>
                    <ModalBody>
                    <Formik
                    initialValues={{
                    alasan: "",
                    }}
                    validationSchema={alasanSchema}
                    onSubmit={(values) => {this.rejectEks(values)}}
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
                                <Button color="secondary" onClick={this.openModalRejectDis}>Tidak</Button>
                            </div>
                        </div>
                        )}
                        </Formik>
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
                <Modal isOpen={this.state.modalConfirm} toggle={this.openConfirm} size="md">
                    <ModalBody>
                        {this.state.confirm === 'reject' ? (
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Reject</div>
                            </div>
                        ) : this.state.confirm === 'rejrejeks' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                    <div className={[style.sucUpdate, style.green]}>Gagal Reject</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'submit' ? (
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Submit</div>
                            </div>
                        ) : this.state.confirm === 'update' ? (
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Update</div>
                            </div>
                        ) : this.state.confirm === 'falsubmit' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Submit</div>
                                <div className="errApprove mt-2">Pastikan dokumen lampiran telah diapprove</div>
                            </div>
                            </div>
                        ) : this.state.confirm === 'falseNodoc' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Submit</div>
                                <div className="errApprove mt-2">Pastikan nomor document SAP telah diinput</div>
                            </div>
                            </div>
                        ) : this.state.confirm === 'falseDateBa' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Submit</div>
                                <div className="errApprove mt-2">Pastikan Tanggal BA telah diinput</div>
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
                <Modal isOpen={this.state.formDis} toggle={this.openModalDis} size="xl" className='xl'>
                    {/* <Alert color="danger" className={style.alertWrong} isOpen={detailDis.find(({status_form}) => status_form === 26) === undefined ? false : true}>
                        <div>Data Penjualan Asset Sedang Dilengkapi oleh divisi purchasing</div>
                    </Alert> */}
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
                                                {(this.state.filter === 'available' || this.state.filter === 'finish') && (
                                                    <Button className='ml-1 mt-1' color='warning' onClick={() => this.prosesOpenRinci(item)}>Proses</Button>
                                                )}
                                                <Button className='ml-1 mt-1' color='success' onClick={() => this.prosesOpenDokumen(item)}>Dokumen</Button>
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
                        {this.state.filter !== 'available' ? (
                            <div className="btnFoot">
                            </div>
                        ) : (
                        <div className="btnFoot">
                            <Button className="mr-2" onClick={this.openModalReject} color="danger" disabled={this.state.filter !== 'available' ? true : listMut.length === 0 ? true : false}>
                                Reject
                            </Button>
                            <Button color="success" onClick={this.cekSubmit} disabled={this.state.filter === 'available' ? false : true}>
                                Submit
                            </Button>
                        </div>
                        )}
                    </div>
                </Modal>
                <Modal isOpen={this.state.openApprove} toggle={this.openModalApprove} centered={true}>
                    <ModalBody>
                        <div className={style.modalApprove}>
                            <div>
                                <text>
                                    Anda yakin untuk submit disposal    
                                    <text className={style.verif}> </text>
                                    pada tanggal
                                    <text className={style.verif}> {moment().format('LL')}</text> ?
                                </text>
                            </div>
                            <div className={style.btnApprove}>
                                <Button color="primary" onClick={() => this.prepSendEmail('submit')}>Ya</Button>
                                <Button color="secondary" onClick={this.openModalApprove}>Tidak</Button>
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
                                    : () => this.prosesSubmit('submit')
                                    } 
                                    color="primary"
                                >
                                    {tipeEmail === 'submit' ? 'Submit' : tipeEmail === 'reject' && 'Reject'} & Send Email
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
    depo: state.depo,
    tempmail: state.tempmail,
    newnotif: state.newnotif,
    user: state.user,
})

const mapDispatchToProps = {
    logout: auth.logout,
    getDisposal: disposal.getDisposal,
    submitDisposal: disposal.submitDisposal,
    resetError: disposal.reset,
    resetSetuju: setuju.resetSetuju,
    deleteDisposal: disposal.deleteDisposal,
    updateDisposal: disposal.updateDisposal,
    getDocumentDis: disposal.getDocumentDis,
    uploadDocumentDis: disposal.uploadDocumentDis,
    submitEksDisposal: setuju.submitEksDisposal,
    showDokumen: pengadaan.showDokumen,
    approveDocDis: disposal.approveDocDis,
    rejectDocDis: disposal.rejectDocDis,
    rejectDisposal: disposal.rejectDisposal,
    getApproveSetDisposal: setuju.getApproveSetDisposal,
    getDetailDisposal: disposal.getDetailDisposal,
    getApproveDisposal: disposal.getApproveDisposal,
    submitEditEks: disposal.submitEditEks,
    rejectEks: disposal.rejectEks,
    getDraftEmail: tempmail.getDraftEmail,
    sendEmail: tempmail.sendEmail,
    addNewNotif: newnotif.addNewNotif,
    searchDisposal: disposal.searchDisposal
}

export default connect(mapStateToProps, mapDispatchToProps)(EksekusiDisposal)
