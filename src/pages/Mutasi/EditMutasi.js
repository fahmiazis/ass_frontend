/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { Component } from 'react'
import { FaUserCircle, FaBars, FaSearch, FaCartPlus } from 'react-icons/fa'
import style from '../../assets/css/input.module.css'
import {NavbarBrand, Row, Col, Button, Input, Modal, ModalBody, ModalHeader, Table,
        Container, Alert, ModalFooter, Spinner} from 'reactstrap'
import {BsCircle} from 'react-icons/bs'
import { AiOutlineCheck, AiOutlineClose, AiFillCheckCircle, AiOutlineInbox} from 'react-icons/ai'
import SidebarContent from "../../components/sidebar_content"
import Sidebar from "../../components/Header"
import MaterialTitlePanel from "../../components/material_title_panel"
import auth from '../../redux/actions/auth'
import depo from '../../redux/actions/depo'
import mutasi from '../../redux/actions/mutasi'
import asset from '../../redux/actions/asset'
import tempmail from '../../redux/actions/tempmail'
import newnotif from '../../redux/actions/newnotif'
import {connect} from 'react-redux'
import placeholder from  "../../assets/img/placeholder.png"
import Select from 'react-select'
import {Formik} from 'formik'
import * as Yup from 'yup'
import logo from '../../assets/img/logo.png'
import moment from 'moment'
import disposal from '../../redux/actions/disposal'
import pengadaan from '../../redux/actions/pengadaan'
import dokumen from '../../redux/actions/dokumen'
import Pdf from "../../components/Pdf"
import {default as axios} from 'axios'
import NavBar from '../../components/NavBar'
import styleTrans from '../../assets/css/transaksi.module.css'
import NewNavbar from '../../components/NewNavbar'
import FormMutasi from '../../components/Mutasi/FormMutasi'
import Email from '../../components/Mutasi/Email'
import TrackingMutasi from '../../components/Mutasi/TrackingMutasi'
const {REACT_APP_BACKEND_URL} = process.env


const alasanSchema = Yup.object().shape({
    alasan: Yup.string().required()
});

const mutasiSchema = Yup.object().shape({
    kode_plant: Yup.string().required("must be filled"),
})

const dateSchema = Yup.object().shape({
    tgl_mutasifisik: Yup.date().required()
})

class EditMutasi extends Component {

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
            limit: 12,
            dataRinci: {},
            rinci: false,
            img: '',
            options: [],
            kode: '',
            formMut: false,
            detailMut: [],
            reject: false,
            approve: false,
            preview: false,
            view: '',
            rincian: false,
            openModalDoc: false,
            confirm: '',
            modalConfirm: false,
            newMut: [],
            openPdf: false,
            idDoc: 0,
            fileName: {},
            date: '',
            listMut: [],
            modalDate: false,
            reason: false,
            alasan: '',
            modalSubmit: false,
            openDraft: false,
            formTrack: false
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
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
            this.props.uploadDocument(token, detail.id, data)
        }
    }

    menuButtonClick(ev) {
        ev.preventDefault();
        this.onSetOpen(!this.state.open);
    }

    showDokumen = async (value) => {
        const token = localStorage.getItem('token')
        await this.props.showDokumen(token, value.id)
        this.setState({date: value.updatedAt, idDoc: value.id, fileName: value})
        const { isShow } = this.props.dokumen
        if (isShow) {
            this.openModalPdf()
        }
    }

    openModalPdf = () => {
        this.setState({openPdf: !this.state.openPdf})
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
        this.setState({rincian: !this.state.rincian})
    }

    prosesOpenRinci = (val) => {
        this.prepareSelect()
        const data = `${val.kode_plant_rec}-${val.area_rec}`
        this.setState({dataRinci: val, kode: val.kode_plant_rec, area: data})
        this.openRinci()
    }

    openConfirm = () => {
        this.setState({modalConfirm: !this.state.modalConfirm})
    }


    openModalMut = () => {
        this.setState({formMut: !this.state.formMut})
    }

    onSetOpen(open) {
        this.setState({ open });
    }

    componentDidMount() {
        this.getDataMutasi()
    }
    

    async componentDidUpdate() {
        const { errorAdd, rejReject, rejApprove, isReject, isApprove, submitEdit, isUpload } = this.props.mutasi
        const token = localStorage.getItem('token')
        const { detailMut } = this.props.mutasi
        if (errorAdd) {
            this.openConfirm(this.setState({confirm: 'addmutasi'}))
            this.props.resetAddMut()
        } else if (isUpload) {
            this.props.resetMutasi()
            await this.props.getDocumentMut(token, detailMut[0].no_asset, detailMut[0].no_mutasi)
            await this.props.getDetailMutasi(token, detailMut[0].no_mutasi)
        } else if (isReject) {
            this.setState({listMut: []})
            this.openReject()
            this.openConfirm(this.setState({confirm: 'reject'}))
            this.openModalMut()
            this.props.resetMutasi()
        } else if (submitEdit) {
            this.openConfirm(this.setState({confirm: 'approve'}))
            this.openApprove()
            this.props.resetMutasi()
        } else if (rejReject) {
            this.openReject()
            this.openConfirm(this.setState({confirm: 'rejReject'}))
            this.props.resetMutasi()
        } else if (rejApprove) {
            this.openConfirm(this.setState({confirm: 'rejApprove'}))
            this.openApprove()
            this.props.resetMutasi()
        }
    }

    openProsesModalDoc = async (val) => {
        const token = localStorage.getItem('token')
        const { detailMut } = this.props.mutasi
        await this.props.getDocumentMut(token, detailMut[0].no_asset, detailMut[0].no_mutasi)
        this.closeProsesModalDoc()
    }

    closeProsesModalDoc = () => {
        this.setState({openModalDoc: !this.state.openModalDoc})
    }

    openRinciAdmin = async () => {
        this.setState({rinci: !this.state.rinci})
    }

    getDataApprove = async (val) => {
        const {detailMut} = this.state
        const token = localStorage.getItem('token')
        await this.props.getApproveMutasi(token, detailMut[0].no_mutasi, 'Mutasi')
        this.openModalPre()
    }

    openModalPre = () => {
        this.setState({preview: !this.state.preview})
    }

    openForm = async (val) => {
        const { dataMut } = this.props.mutasi
        const token = localStorage.getItem('token')
        await this.props.getDetailMutasi(token, val.no_mutasi) 
        await this.props.getApproveMutasi(token, val.no_mutasi, 'Mutasi')
        const {detailMut} = this.props.mutasi
        // if (detailMut[0].tgl_mutasifisik === null || detailMut[0].tgl_mutasifisik === 'null' || detailMut[0].tgl_mutasifisik === '') {
        //     this.openModalMut()
        //     this.openModalDate()
        // } else {
        this.openModalMut()
        // }
    }

    openModalDate = () => {
        this.setState({modalDate: !this.state.modalDate})
    }

    closeDate = () => {
        this.openModalMut()
        this.openModalDate()
    }

    reOpenDetailMut = () => {
        const { detailMut } = this.state
        this.closeDate()
        this.openForm(detailMut[0].no_mutasi)
    }

    prepSendEmail = async (val) => {
        const {detailMut} = this.props.mutasi
        const token = localStorage.getItem("token")
        const level = localStorage.getItem('level')
        const menu = 'Revisi (Mutasi asset)'
        const tipe = 'revisi'
        const tempno = {
            no: detailMut[0].no_mutasi,
            kode: detailMut[0].kode_plant,
            jenis: 'mutasi',
            tipe: tipe,
            menu: menu
        }
        this.setState({tipeEmail: val})
        await this.props.getDraftEmail(token, tempno)
        this.openDraftEmail()
    }

    openDraftEmail = () => {
        this.setState({ openDraft: !this.state.openDraft })
    }

    submitEditRevisi = async () => {
        const { detailMut } = this.props.mutasi
        const token = localStorage.getItem('token')
        const data = {
            no: detailMut[0].no_mutasi
        }
        await this.props.submitRevisi(token, data)
        this.prosesSendEmail('budget')
        this.openSubmit()
        this.openModalMut()
        this.getDataMutasi()
        this.setState({confirm: 'submit'})
        this.openConfirm()
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
            proses: 'submit',
            route: detailMut[0].status_form === 2 ? 'mutasi' : detailMut[0].status_form === 3 ? 'budget-mutasi' : 'eks-mutasi'
        }
        await this.props.sendEmail(token, sendMail)
        await this.props.addNewNotif(token, sendMail)
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

    openApprove = () => {
        this.setState({approve: !this.state.approve})
    }

    openReject = () => {
        this.setState({reject: !this.state.reject})
    }

    prosesOpenSubmit = () => {
        const {detailMut} = this.props.mutasi
        const cekRec = []
        const cekRej = []
        for (let i = 0; i < detailMut.length; i++) {
            const kodeRec = detailMut[0].kode_plant_rec
            if (detailMut[i].isreject === 1) {
                cekRej.push(detailMut[i])
            } else if (detailMut[i].kode_plant_rec !== kodeRec) {
                cekRec.push(detailMut[i])
            }
        }
        if (cekRej.length > 0) {
            this.setState({confirm: 'apprev'})
            this.openConfirm()
        } else if (cekRec.length > 0) {
            this.setState({confirm: 'recfalse'})
            this.openConfirm()
        } else {
            this.openSubmit()
        }

    }
    

    openSubmit = () => {
        this.setState({modalSubmit: !this.state.modalSubmit})
    }

    getDataAsset = async (value) => {
        const token = localStorage.getItem("token")
        const { page } = this.props.asset
        const search = value === undefined ? '' : this.state.search
        const limit = value === undefined ? this.state.limit : value.limit
        await this.props.getAsset(token, limit, search, page.currentPage, 'mutasi')
        await this.props.getDetailDepo(token, 1)
        this.prepareSelect()
        this.setState({limit: value === undefined ? 12 : value.limit})
    }

    addMutasi = async () => {
        const token = localStorage.getItem("token")
        const { page } = this.props.asset
        const search =  ''
        const limit = this.state.limit
        const {kode, dataRinci} = this.state
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
        await this.props.getMutasiRec(token, 'editdoc')
        this.changeView('available')
    }

    getDataMutasi = async () => {
        const token = localStorage.getItem('token')
        await this.props.getMutasi(token, 'revisi', 'all', 'all', '', 100)
        this.changeView('revisi')
    }

    changeView = async (val) => {
        const { dataMut, noMut } = this.props.mutasi
        const role = localStorage.getItem('role')
        const newMut = []
        this.setState({view: val, newMut: dataMut})
    }

    chooseDepo = (e) => {
        console.log(e.value)
        const data = e.value.split('-')[0]
        this.setState({kode: data, area: e.value})
    }

    goCartMut = () => {
        this.props.history.push('/cartmut')
    }

    approveMutasi = async () => {
        const { detailMut } = this.state
        const token = localStorage.getItem("token")
        await this.props.approveMut(token, detailMut[0].no_mutasi)
        this.getDataMutasi()
    }

    rejectMutasi = async (val) => {
        const { detailMut } = this.state
        const token = localStorage.getItem("token")
        await this.props.rejectMut(token, detailMut[0].no_mutasi, val)
        this.getDataMutasi()
    }

    prepareSelect = async () => {
        const token = localStorage.getItem("token")
        const kode = localStorage.getItem('kode')
        await this.props.getDepo(token, 1000, '')
        const { dataDepo } = this.props.depo
        const temp = [
            {value: '', label: '-Pilih Area-'}
        ]
        if (dataDepo.length !== 0) {
            for (let i = 0; i < dataDepo.length; i++) {
                if (dataDepo[i].kode_plant !== kode) {
                    temp.push({value: dataDepo[i].kode_plant, label: dataDepo[i].kode_plant + '-' + dataDepo[i].nama_area})
                }
            }
            this.setState({options: temp})
        }
    }

    editDate = async (val) => {
        const token = localStorage.getItem('token')
        const { detailMut } = this.props.mutasi
        await this.props.changeDate(token, detailMut[0].no_mutasi, val)
        await this.props.appRevisi(token, detailMut[0].id, 'reason')
        await this.props.getDetailMutasi(token, detailMut[0].no_mutasi)
        this.openModalDate()
        this.setState({confirm: 'update'})
        this.openConfirm()
    }

    updateDataMutasi = async (val) => {
        const token = localStorage.getItem("token")
        const { kode } = this.state
        const {detailMut} = this.props.mutasi
        const data = {
            id: val.id,
            kodeRec: kode
        }
        // const { dataCart } = this.props.mutasi
        // if (dataCart.length > 1 && dataCart.find(item => item.kode_plant_rec !== kode && val.id !== item.id)) {
        //     this.setState({confirm: 'falseUpdate'})
        //     this.openConfirm()
        // } else {
        //     await this.props.updateMutasi(token, data)
        //     await this.props.getCart(token)
        //     this.prosesRinci()
        //     this.setState({confirm: 'update'})
        //     this.openConfirm()
        // }
        await this.props.updateMutasi(token, data)
        await this.props.appRevisi(token, val.id, 'kode')
        await this.props.getDetailMutasi(token, detailMut[0].no_mutasi)
        this.openRinci()
        this.setState({confirm: 'update'})
        this.openConfirm()
    }

    revReason = async () => {
        const token = localStorage.getItem("token")
        const {detailMut} = this.props.mutasi
        const {alasan} = this.state
        const data = {
            alasan: alasan,
            no: detailMut[0].no_mutasi
        }
        await this.props.updateReason(token, data)
        await this.props.appRevisi(token, detailMut[0].id, 'reason')
        await this.props.getDetailMutasi(token, detailMut[0].no_mutasi)
        this.setState({confirm: 'update'})
        this.openConfirm()
        this.openReason()
    }

    prosesOpenReason = () => {
        const {detailMut} = this.props.mutasi
        this.setState({alasan: detailMut[0].alasan})
        setTimeout(() => {
            this.openReason()
         }, 100)
    }

    openReason = () => {
        this.setState({reason: !this.state.reason})
    }

    inputAlasan = e => {
        this.setState({alasan: e.target.value})
    }

    getDetailTrack = async (val) => {
        const token = localStorage.getItem("token")
        await this.props.getDetailMutasi(token, val.no_mutasi)
        this.openModalTrack()
    }

    openModalTrack = () => {
        this.setState({ formTrack: !this.state.formTrack })
    }

    render() {
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const kode = localStorage.getItem('kode')
        const { dataRinci, newMut } = this.state
        const { detailDepo } = this.props.depo
        const { dataMut, noMut, mutApp, detailMut, dataDoc } = this.props.mutasi
        const { dataAsset, page } = this.props.asset
        const pages = this.props.mutasi.page

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
                        <h2 className={styleTrans.pageTitle}>Revisi Mutasi Asset</h2>

                        <div className={styleTrans.searchContainer}>
                            {/* <div className='rowCenter'>
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
                            </ div> */}
                            <input
                                type="text"
                                placeholder="Search..."
                                onChange={this.onSearch}
                                value={this.state.search}
                                onKeyPress={this.onSearch}
                                className={styleTrans.searchInput}
                            />
                        </div>

                        <table className={styleTrans.table}>
                            <thead>
                                <tr>
                                    <th>NO</th>
                                    <th>NO.AJUAN</th>
                                    <th>AREA ASAL</th>
                                    <th>AREA TUJUAN</th>
                                    <th>TANGGAL AJUAN</th>
                                    <th className='statTb'>STATUS</th>
                                    <th>OPSI</th>
                                </tr>
                            </thead>
                            <tbody>
                                {newMut !== undefined && newMut.length > 0 && newMut.map(item => {
                                    return (
                                        kode === item.user_rev && (
                                        <tr>
                                            <td>{newMut.indexOf(item) + 1}</td>
                                            <td>{item.no_mutasi}</td>
                                            <td>{item.area}</td>
                                            <td>{item.area_rec}</td>
                                            <td>{moment(item.tanggalMut).format('DD MMMM YYYY')}</td>
                                            <td>{item.history.split(',')[(item.history.split(',').length) - 1]}</td>
                                            <td>
                                                <Button
                                                    color='primary'
                                                    className='mr-1 mt-1'
                                                    onClick={() => this.openForm(item)}>
                                                    Proses
                                                </Button>
                                                <Button className='mt-1' color='warning' onClick={() => this.getDetailTrack(item)}>Tracking</Button>
                                            </td>
                                        </tr>
                                        )
                                    )
                                })}
                            </tbody>
                        </table>
                        {(newMut.length === 0 || newMut.filter(item => kode === item.user_rev).length === 0) && (
                            <div className={style.spinCol}>
                                <AiOutlineInbox size={50} className='secondary mb-4' />
                                <div className='textInfo'>Data ajuan tidak ditemukan</div>
                            </div>
                        )}
                    </div>
                </div>
                <Modal isOpen={this.state.rincian} toggle={this.openRinci} size="xl">
                    <ModalHeader>
                        Revisi Data
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
                                                <div className="ml-2"><input type="checkbox" checked={dataRinci.kategori === 'IT' ? true : false}/> IT</div>
                                                    <div className="ml-3"><input type="checkbox" checked={dataRinci.kategori === 'NON IT' ? true : false}/> Non IT</div>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Cost Center</Col>
                                            <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.cost_center} disabled /></Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Nilai Buku</Col>
                                            <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.dataAsset === undefined || dataRinci.dataAsset.nilai_buku === null ? '-' : dataRinci.dataAsset.nilai_buku} disabled /></Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Keterangan</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                className="inputRinci" 
                                                type="text" 
                                                value={'-'} 
                                                disabled
                                                />
                                            </Col>
                                        </Row>
                                        {/* <Row  className="mb-3 rowRinci">
                                            <Col md={3}>Area Tujuan</Col>
                                            <Col md={9} className="colRinci">:
                                                <Input className="inputRinci" value={`${dataRinci.kode_plant_rec}-${dataRinci.area_rec}`} disabled />
                                            </Col>
                                        </Row> */}
                                        <Row  className="mb-1 rowRinci">
                                            <Col md={3}>Area Tujuan</Col>
                                            <Col md={9} className="colRinci">:
                                                <Select
                                                    className='inputRinci3'
                                                    options={this.state.options}
                                                    onChange={this.chooseDepo}
                                                    value={{value: this.state.area, label: this.state.area}}
                                                />
                                            </Col>
                                        </Row>
                                        <Row  className="mb-3 rowRinci">
                                            <Col md={3}></Col>
                                            <Col md={9} className="colRinci">
                                                <div className='ml-3'>
                                                    {this.state.kode === '' ? (
                                                        <text className={style.txtError}>Must be filled</text>
                                                    ) : null}
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                    <div className="footRinci3 mt-4">
                                        <Col md={6}>
                                            <Button className="btnFootRinci2" size="lg" block color="success" onClick={() => this.updateDataMutasi(dataRinci)}>Save</Button>
                                        </Col>
                                        <Col md={6}>
                                            <Button className="btnFootRinci2" size="lg" block outline  color="secondary" onClick={() => this.openRinci()}>Close</Button>
                                        </Col>
                                    </div>
                                </div>
                            </div>
                    </ModalBody>
                </Modal>
                <Modal 
                // isOpen={this.state.rincian} 
                // toggle={this.openRinci} 
                size="xl">
                    <ModalHeader>
                        Terima Mutasi
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
                            initialValues = {{
                                kode_plant: 'king'
                            }}
                            validationSchema = {mutasiSchema}
                            onSubmit={(values) => {this.addMutasi(values)}}
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
                                            <Col md={3}>Cost Center Pengirim</Col>
                                            <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.cost_center} disabled /></Col>
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
                                                    <div className="ml-2"><input type="checkbox" checked={dataRinci.kategori === 'IT' ? true : false}/> IT</div>
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
                                    </div>
                                </div>
                            )}
                            </Formik>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.formMut} toggle={this.openModalMut} size="xl" className='xl'>
                    {/* <Alert color="danger" className={style.alertWrong} isOpen={detailMut[0] === undefined || detailMut[0].docAsset.find(({divisi}) => divisi === '0') !== undefined ? true : false}>
                        <div>Mohon revisi dokumen terlebih dahulu sebelum submit</div>
                    </Alert> */}
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
                                    <Col className='noPad rowGeneral' md={6}>
                                        <div className='mr-1'>:</div> {detailMut.length !== 0 ? detailMut[0].no_mutasi : ''}
                                    </Col>
                                </Row>
                                <Row className='ml-1'>
                                    <Col className='noPad' md={4}>Tanggal Form</Col>
                                    <Col className='noPad rowGeneral' md={6}>
                                        <div className='mr-1'>:</div> {detailMut.length !== 0 ? moment(detailMut[0].tanggalMut).format('DD MMMM YYYY') : ''}
                                    </Col>
                                </Row>
                                <Row className='ml-1'>
                                    <Col className='noPad' md={4}>Tanggal Mutasi Fisik</Col>
                                    <Col className='noPad rowGeneral' md={6}>
                                        <div className='mr-1'>:</div> {detailMut.length !== 0 ? moment(detailMut[0].tgl_mutasifisik).format('DD MMMM YYYY') : ''}
                                    </Col>
                                </Row>
                                <Row className='ml-1'>
                                    <Col className='noPad' md={4}>Cabang / Depo</Col>
                                    <Col className='noPad rowGeneral' md={6}>
                                        <div className='mr-1'>:</div> {detailMut.length !== 0 ? detailMut[0].area : ''}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Table bordered className="tableDis mb-3">
                            <thead>
                                <tr>
                                    <th rowSpan={2} className='thGen mutTableTitle'>Opsi</th>
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
                                            <td className='colGeneral'>
                                            {detailMut.length !== 0 && (kode === detailMut[0].user_rev || detailMut[0].user_rev === null) && (kode === detailMut[0].kode_plant) ? 
                                                <>
                                                    {item.isreject === 1 ? 'Perlu Diperbaiki' : item.isreject === null ? 'Data tidak direject' : 'Telah diperbaiki'}
                                                    {item.isreject === null ? null : (
                                                        <Button className='mt-2' color="info" size='sm' onClick={() => this.prosesOpenRinci(item)}>Update</Button>
                                                    )}
                                                </>
                                                :
                                            '-'}
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
                                <div className='otoSize'>1. Dibuat : AOS</div>
                                <div className='otoSize'>2. Diperiksa : BM, ROM, GAAM/IT OSM (aset IT)</div>
                                <div className='otoSize'>3. Disetujui  : Head of Ops Excellence, Treasury Operation Senior Manager</div>
                            </div>
                            <div className='colGeneral ml-4'>
                                <br />
                                <div className='bold otoSize'>HO ke Area</div>
                                <div className='otoSize'>1. Dibuat : GA SPV/IT SPV (aset IT)</div>
                                <div className='otoSize'>2. Diperiksa : BM, ROM, NFAC, GAAM, IT OSM (aset IT)</div>
                                <div className='otoSize'>3. Disetujui : Head of Ops Excellence, Head of HC S&D Domestic, Treasury Operation Senior Manager</div>
                            </div>
                        </div>
                        {detailMut.length !== 0 && (kode === detailMut[0].user_rev || detailMut[0].user_rev === null) && (kode === detailMut[0].kode_plant) && (
                            <Button className="mb-3" color='primary' onClick={this.prosesOpenReason}>Update Alasan</Button>
                        )}
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
                    </Container>
                    </ModalBody>
                    <hr />
                    <Container className='xxl'>
                        <div className="modalFoot">
                        {/* onClick={() => this.openModPreview({nama: 'disposal pengajuan', no: detailDis[0] !== undefined && detailDis[0].no_disposal})} */}
                            <div className="btnFoot">
                                <FormMutasi className='mr-2' />
                                {detailMut.length !== 0 && (detailMut[0].status_form === 3 || detailMut[0].status_form === 4) && (kode === detailMut[0].user_rev) && (kode === detailMut[0].kode_plant_rec) ? (
                                    <Button className="ml-2" color='primary' onClick={this.openProsesModalDoc}>Dokumen</Button>
                                ) : (
                                    <div></div>
                                )}
                            </div>
                            <div className="btnFoot">
                                {detailMut.length !== 0 && (detailMut[0].status_form === 3 || detailMut[0].status_form === 4) && (kode === detailMut[0].user_rev) && (kode === detailMut[0].kode_plant_rec) && (
                                    <Button className="mr-2" color='primary' onClick={this.openModalDate}>Update Tgl Mutasi Fisik</Button>
                                )}
                                <Button color="success" onClick={() => this.prosesOpenSubmit()}>
                                    Submit
                                </Button>
                            </div>
                        </div>
                    </Container>
                </Modal>
                <Modal isOpen={this.state.modalSubmit} toggle={this.openSubmit} centered={true}>
                    <ModalBody>
                        <div className={style.modalApprove}>
                            <div>
                                <text>
                                    Anda yakin untuk submit
                                    <text className={style.verif}>  revisi mutasi </text>
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
                <Modal isOpen={this.state.reason} toggle={this.openReason} centered>
                    <ModalBody>
                        <div className="mb-3">
                            Alasan Mutasi :
                        </div>
                        <div className="mb-1">
                            <Input 
                            type='textarea'
                            name="alasan"
                            value={this.state.alasan}
                            onChange={this.inputAlasan}
                            />
                        </div>
                        <div className="mb-5">
                            <text className={style.txtError}>{this.state.alasan === '' ? "Must be filled" : ''}</text>
                        </div>
                        <div className='rowCenter justiceCenter'>
                            <Button className='mr-2' size='lg' color='primary' disabled={this.state.alasan === '' ? true : false } onClick={() => this.revReason()} >Save</Button>
                            <Button size='lg' color='secondary' onClick={() => this.openReason()}>Close</Button>
                        </div>
                    </ModalBody>
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
                    <Button className="mr-2" color="secondary" onClick={this.closeProsesModalDoc}>
                            Close
                        </Button>
                        <Button color="primary" onClick={this.closeProsesModalDoc}>
                            Save 
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
            <Modal isOpen={this.state.modalConfirm} toggle={this.openConfirm}>
                <ModalBody>
                    {this.state.confirm === 'approve' ?(
                        <div>
                            <div className={style.cekUpdate}>
                            <AiFillCheckCircle size={80} className={style.green} />
                            <div className={[style.sucUpdate, style.green]}>Berhasil Submit Revisi Mutasi</div>
                        </div>
                        </div>
                    ) : this.state.confirm === 'reject' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Reject Form Mutasi</div>
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
                    ) : this.state.confirm === 'submit' ?(
                        <div>
                            <div className={style.cekUpdate}>
                            <AiFillCheckCircle size={80} className={style.green} />
                            <div className={[style.sucUpdate, style.green]}>Berhasil Submit</div>
                        </div>
                        </div>
                    ) : this.state.confirm === 'update' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Update</div>
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
                    ) : this.state.confirm === 'apprev' ?(
                        <div>
                            <div className={style.cekUpdate}>
                            <AiOutlineClose size={80} className={style.red} />
                            <div className={[style.sucUpdate, style.green]}>Gagal Submit Revisi</div>
                            <div className="errApprove mt-2">Mohon perbaiki data ajuan terlebih dahulu</div>
                        </div>
                        </div>
                    ) : this.state.confirm === 'recfalse' ?(
                        <div>
                            <div className={style.cekUpdate}>
                            <AiOutlineClose size={80} className={style.red} />
                            <div className={[style.sucUpdate, style.green]}>Gagal Submit Revisi</div>
                            <div className="errApprove mt-2">Pastikan area tujuan mutasi sama</div>
                        </div>
                        </div>
                    ) : (
                        <div></div>
                    )}
                </ModalBody>
            </Modal>
            <Modal isOpen={
                this.props.mutasi.isLoading || 
                this.props.tempmail.isLoading || 
                this.props.depo.isLoading || 
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
                            <Button color="success" onClick={() => this.downloadData()}>Download</Button>
                        </div>
                        <Button color="primary" onClick={this.openModalPdf}>Close</Button>
                    </div>
                </ModalBody>
            </Modal>
            <Modal isOpen={this.state.modalDate} toggle={this.openModalDate} centered>
                <ModalHeader>Revisi tanggal mutasi fisik</ModalHeader>
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
                            <Button className="mr-3" onClick={this.openModalDate} color="danger">Close</Button>
                        </div>
                    </div>
                </ModalBody>
                    )}
                </Formik>
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
                                    () => this.submitEditRevisi()
                                }
                                color="primary"
                            >
                                Submit & Send Email
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
    disposal: state.disposal,
    pengadaan: state.pengadaan,
    tempmail: state.tempmail,
    newnotif: state.newnotif,
    dokumen: state.dokumen
})

const mapDispatchToProps = {
    logout: auth.logout,
    getAsset: asset.getAsset,
    resetError: asset.resetError,
    resetDis: disposal.reset,
    nextPage: asset.nextPage,
    getDetailDepo: depo.getDetailDepo,
    getDepo: depo.getDepo,
    addMutasi: mutasi.addMutasi,
    getMutasi: mutasi.getMutasi,
    approveMut: mutasi.approveMutasi,
    rejectMut: mutasi.rejectMutasi,
    getApproveMutasi: mutasi.getApproveMutasi,
    getMutasiRec: mutasi.getMutasiRec,
    getDocumentMut: mutasi.getDocumentMut,
    uploadDocument: mutasi.uploadDocument,
    resetAddMut: mutasi.resetAddMut,
    showDokumen: dokumen.showDokumen,
    resetMutasi: mutasi.resetMutasi,
    getDetailMutasi: mutasi.getDetailMutasi,
    changeDate: mutasi.changeDate,
    submitEdit: mutasi.submitEdit,
    appRevisi: mutasi.appRevisi,
    submitRevisi: mutasi.submitRevisi,
    updateReason: mutasi.updateReason,
    updateMutasi: mutasi.updateMutasi,
    getDraftEmail: tempmail.getDraftEmail,
    addNewNotif: newnotif.addNewNotif,
    sendEmail: tempmail.sendEmail,
}

export default connect(mapStateToProps, mapDispatchToProps)(EditMutasi)
