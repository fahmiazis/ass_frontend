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
import notif from '../../redux/actions/notif'
import asset from '../../redux/actions/asset'
import {connect} from 'react-redux'
import placeholder from  "../../assets/img/placeholder.png"
import Select from 'react-select'
import {Formik} from 'formik'
import TableMut from '../../components/TableMut'
import * as Yup from 'yup'
import logo from '../../assets/img/logo.png'
import moment from 'moment'
import user from '../../redux/actions/user'
import NavBar from '../../components/NavBar'
import styleTrans from '../../assets/css/transaksi.module.css'
import NewNavbar from '../../components/NewNavbar'
const {REACT_APP_BACKEND_URL} = process.env


const alasanSchema = Yup.object().shape({
    alasan: Yup.string().required()
});

const mutasiSchema = Yup.object().shape({
    kode_plant: Yup.string().required("must be filled"),
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
            previtew: false,
            filter: '',
            rincian: false,
            openModalDoc: false,
            confirm: '',
            modalConfirm: false,
            newMut: [],
            listMut: []
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
    }

    prosesSidebar = (val) => {
        this.setState({sidebarOpen: val})
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
            this.props.uploadDocumentDis(token, detail.id, data)
        }
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
        this.setState({rincian: !this.state.rincian})
    }

    openConfirm = () => {
        this.setState({modalConfirm: !this.state.modalConfirm})
    }


    openModalMut = () => {
        this.setState({formMut: !this.state.formMut, listMut: []})
    }

    onSetOpen(open) {
        this.setState({ open });
    }

    componentDidMount() {
        const level = localStorage.getItem('level')
        // if (level === "5" || level === "9" ) {
        //     this.getDataAsset()
        // } else {
        this.getDataMutasi()
        // }
    }

    showDokumen = async (value) => {
        const token = localStorage.getItem('token')
        await this.props.showDokumen(token, value.id)
        this.setState({date: value.updatedAt, idDoc: value.id, fileName: value})
        console.log(value)
        const {isShow} = this.props.pengadaan
        if (isShow) {
            this.openModalPdf()
        }
    }

    componentDidUpdate() {
        const { errorAdd, rejReject, rejApprove, isReject, isApprove } = this.props.mutasi
        if (errorAdd) {
            this.openConfirm(this.setState({confirm: 'addmutasi'}))
            this.props.resetAddMut()
        } else if (isReject) {
            this.setState({listMut: []})
            this.openReject()
            this.openConfirm(this.setState({confirm: 'reject'}))
            this.openModalMut()
            this.props.resetAppRej()
            this.getDataMutasi()
        } else if (isApprove) {
            this.openConfirm(this.setState({confirm: 'approve'}))
            this.openApprove()
            this.openModalMut()
            this.props.resetAppRej()
            this.getDataMutasi()
        } else if (rejReject) {
            this.openReject()
            this.openConfirm(this.setState({confirm: 'rejReject'}))
            this.props.resetAppRej()
        } else if (rejApprove) {
            this.openConfirm(this.setState({confirm: 'rejApprove'}))
            this.openApprove()
            this.props.resetAppRej()
        }
    }

    openProsesModalDoc = async () => {
        const token = localStorage.getItem('token')
        const { dataRinci } = this.state
        await this.props.getDocumentMut(token, dataRinci.no_asset, dataRinci.no_mutasi)
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
        await this.props.getApproveMut(token, detailMut[0].no_mutasi, val.kode_plant.split('').length === 4 ? 'Mutasi' : 'Mutasi HO')
        this.openModalPre()
    }

    getDataApproveMut = async (val) => {
        const token = localStorage.getItem('token')
        await this.props.getApproveMut(token, val.no_mutasi, val.kode_plant.split('').length === 4 ? 'Mutasi' : 'Mutasi HO')
    }

    openModalPre = () => {
        this.setState({previtew: !this.state.preview})
    }

    openDetailMut = async (value) => {
        const { dataMut } = this.props.mutasi
        const detail = []
        for (let i = 0; i < dataMut.length; i++) {
            if (dataMut[i].no_mutasi === value) {
                detail.push(dataMut[i])
            }
        }
        this.setState({detailMut: detail})
        const token = localStorage.getItem('token')
        await this.props.getDetailMutasi(token, value)
        this.openModalMut()
    }

    openApprove = () => {
        this.setState({approve: !this.state.approve})
    }

    openReject = () => {
        this.setState({reject: !this.state.reject})
    }

    getDataMutasi = async () => {
        const level = localStorage.getItem('level')
        const token = localStorage.getItem('token')
        const status = level === '5' || level === '9' ? 2 : undefined
        const view = level === '5' || level === '9' ? 'all' : 'available'
        await this.props.getMutasi(token, status)
        await this.props.getRole(token)
        this.changeFilter(view)
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
        await this.props.getMutasiRec(token)
        this.changeFilter('available')
    }

    changeFilter = async (val) => {
        const { dataMut, noMut } = this.props.mutasi
        const {dataRole} = this.props.user
        const role = localStorage.getItem('role')
        const level = localStorage.getItem('level')
        const divisi = level === '16' || level === '13' ? dataRole.find(({nomor}) => nomor === '27').name : localStorage.getItem('role')
        if (val === 'available') {
            const newMut = []
            for (let i = 0; i < noMut.length; i++) {
                const index = dataMut.indexOf(dataMut.find(({no_mutasi}) => no_mutasi === noMut[i]))
                if (dataMut[index] !== undefined) {
                    const app = dataMut[index].appForm
                    const find = app.indexOf(app.find(({jabatan}) => jabatan === role))
                    const findApp = app.indexOf(app.find(({jabatan}) => jabatan === divisi))
                    if (level === '12' || level === '27') {
                        if ((app.length === 0 || app[app.length - 1].status === null) || (app[find] !== undefined && app[find + 1].status === 1 && app[find - 1].status === null && (app[find].status === null || app[find].status === 0))) {
                            newMut.push(dataMut[index])
                        }
                    } else if (level === '13' || level === '16') {
                        if ((app.length === 0 || app[app.length - 1].status === null) || (app[find] !== undefined && app[find + 1].status === 1 && (app[find].status === null))) {
                            newMut.push(dataMut[index])
                        } else if ((app.length === 0 || app[app.length - 1].status === null) || (app[findApp - 1] !== undefined && app[findApp + 2].status === 1 && (app[findApp - 1].status === null))) {
                            newMut.push(dataMut[index])
                        } else {
                            console.log(findApp - 1)
                        }
                    } else if (find === 0 || find === '0') {
                        const index = dataMut.indexOf(dataMut.find(({no_mutasi}) => no_mutasi === noMut[i]))
                        if (dataMut[index] !== undefined) {
                            newMut.push(dataMut[index])
                        }
                    } else {
                        if (app[find] !== undefined && app[find + 1].status === 1 && app[find - 1].status === null && app[find].status !== 1) {
                            newMut.push(dataMut[index])
                        }
                    }
                }
            }
            this.setState({filter: val, newMut: newMut})
        } else {
            const newMut = []
            for (let i = 0; i < noMut.length; i++) {
                const index = dataMut.indexOf(dataMut.find(({no_mutasi}) => no_mutasi === noMut[i]))
                if (dataMut[index] !== undefined) {
                    newMut.push(dataMut[index])
                }
            }
            this.setState({filter: val, newMut: newMut})
        }
    }

    chooseDepo = (e) => {
        this.setState({kode: e.value})
    }

    goCartMut = () => {
        this.props.history.push('/cartmut')
    }

    approveMutasi = async () => {
        const { detailMut } = this.state
        const level = localStorage.getItem('level')
        const token = localStorage.getItem("token")
        await this.props.approveMut(token, detailMut[0].no_mutasi)
        await this.props.notifMutasi(token, detailMut[0].no_mutasi, 'approve', level === 12 ? 'area' : 'HO', null, null)
    }

    rejectMutasi = async (val) => {
        const { detailMut, listMut } = this.state
        const token = localStorage.getItem("token")
        const data = {
            alasan: val.alasan,
            listMut: listMut
        }
        await this.props.rejectMut(token, detailMut[0].no_mutasi, data)
        await this.props.notifMutasi(token, detailMut[0].no_mutasi, 'reject', null, null, null, data)
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
            // dataDepo.map(item => {
            //     return (
            //         // 
            //     )
            // })
            for (let i = 0; i < dataDepo.length; i++) {
                if (dataDepo[i].kode_plant !== kode) {
                    temp.push({value: dataDepo[i].kode_plant, label: dataDepo[i].kode_plant + '-' + dataDepo[i].nama_area})
                }
            }
            this.setState({options: temp})
        }
    }

    render() {
        const role = localStorage.getItem('role')
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const { dataRinci, newMut, listMut } = this.state
        const { detailDepo } = this.props.depo
        const { dataRole } = this.props.user
        const { dataMut, noMut, mutApp, dataDoc, detailMut  } = this.props.mutasi
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
                {/* <Sidebar {...sidebarProps}>
                    <MaterialTitlePanel title={contentHeader}>
                        <div className={style.backgroundLogo}>
                            <div className={style.bodyDashboard}>
                                <div className={style.headMaster}> 
                                    <div className={style.titleDashboard}>Mutasi Asset</div>
                                </div>
                                <div className={style.secEmail}>
                                    {level === '5' || level === '9' ? (
                                        <div className={style.headEmail}>
                                            <Button size='lg' color="success" onClick={this.goCartMut}>Create</Button>
                                        </div>
                                    ) : (
                                        <div className={style.headEmail}>
                                            <Input type="select" value={this.state.view} onChange={e => this.changeFilter(e.target.value)}>
                                                <option value="available">Available To Approve</option>
                                                <option value="all">All</option>
                                            </Input>
                                        </div>
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
                                {level === '5' || level === '9' ? (
                                    <div>
                                        <Table bordered striped responsive hover className={style.tab}>
                                            <thead>
                                                <tr>
                                                    <th>NO</th>
                                                    <th>NO.AJUAN</th>
                                                    <th>AREA ASAL</th>
                                                    <th>AREA TUJUAN</th>
                                                    <th>TANGGAL SUBMIT</th>
                                                    <th>STATUS</th>
                                                    <th>OPSI</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {newMut !== undefined && newMut.length > 0 && newMut.map(item => {
                                                return (
                                                <tr className={item.status_reject === 0 ? 'note' : item.status_transaksi === 0 ? 'fail' : item.status_reject === 1 && 'bad'}>
                                                    <td>{newMut.indexOf(item) + 1}</td>
                                                    <td>{item.no_mutasi}</td>
                                                    <td>{item.area}</td>
                                                    <td>{item.area_rec}</td>
                                                    <td>{moment(item.tanggalMut).format('DD MMMM YYYY')}</td>
                                                    <td>On Proses</td>
                                                    <td>
                                                        <Button color="primary" className='mb-1 mr-1' onClick={() => {this.openDetailMut(item.no_mutasi); this.getDataApproveMut(item)}}>
                                                            Rincian
                                                        </Button>
                                                        <Button color="warning" onClick={() => {this.openDetailMut(item.no_mutasi); this.getDataApproveMut(item)}}>
                                                            Tracking
                                                        </Button>
                                                    </td>
                                                </tr>
                                                )
                                            })}
                                            </tbody>
                                        </Table>
                                        
                                        {newMut.length === 0 && (
                                            <div className={style.spin}>
                                                <text className='textInfo'>Data ajuan tidak ditemukan</text>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div>
                                        <Table bordered striped responsive hover className={style.tab}>
                                            <thead>
                                                <tr>
                                                    <th>NO</th>
                                                    <th>NO.AJUAN</th>
                                                    <th>AREA ASAL</th>
                                                    <th>AREA TUJUAN</th>
                                                    <th>TANGGAL SUBMIT</th>
                                                    <th>STATUS</th>
                                                    <th>OPSI</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {newMut !== undefined && newMut.length > 0 && newMut.map(item => {
                                                return (
                                                <tr className={item.status_reject === 0 ? 'note' : item.status_transaksi === 0 ? 'fail' : item.status_reject === 1 && 'bad'}>
                                                    <td>{newMut.indexOf(item) + 1}</td>
                                                    <td>{item.no_mutasi}</td>
                                                    <td>{item.area}</td>
                                                    <td>{item.area_rec}</td>
                                                    <td>{moment(item.tanggalMut).format('DD MMMM YYYY')}</td>
                                                    <td>-</td>
                                                    <td>
                                                        <Button className="btnSell" color="primary" onClick={() => {this.openDetailMut(item.no_mutasi); this.getDataApproveMut(item)}}>Proses</Button>
                                                    </td>
                                                </tr>
                                                )
                                            })}
                                            </tbody>
                                        </Table>
                                        
                                        {newMut.length === 0 && (
                                            <div className={style.spin}>
                                                <text className='textInfo'>Data ajuan tidak ditemukan</text>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div>
                                    <div className={style.infoPageEmail1}>
                                        <text>Showing {level === '5' ? page.currentPage : 1} of {level === '5' ? page.pages : 1} pages</text>
                                        <div className={style.pageButton}>
                                            {level === '5' ? (
                                                <button className={style.btnPrev} color="info" disabled={page.prevLink === null ? true : false} onClick={this.prev}>Prev</button>
                                            ) : (
                                                <div></div>
                                            )}
                                            {level === '5' ? (
                                                <button className={style.btnPrev} color="info" disabled={page.nextLink === null ? true : false} onClick={this.next}>Next</button>
                                            ) : (
                                                <div></div>
                                            )}
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
                        <h2 className={styleTrans.pageTitle}>Mutasi Asset</h2>
                        {(level === '5' || level === '9' ) && (
                            <div className={styleTrans.searchContainer}>
                                <Button size="lg" color='primary' onClick={this.goCartMut}>Create</Button>
                            </div>
                        )}
                        <div className={styleTrans.searchContainer}>
                            <input
                                type="text"
                                placeholder="Search..."
                                onChange={this.onSearch}
                                value={this.state.search}
                                onKeyPress={this.onSearch}
                                className={styleTrans.searchInput}
                            />
                            <select value={this.state.filter} onChange={e => this.changeFilter(e.target.value)} className={styleTrans.searchInput}>
                                <option value="all">All</option>
                                <option value="available">Available To Approve</option>
                                <option value="reject">Reject</option>
                                <option value="completed">Selesai</option>
                            </select>
                        </div>

                        <table className={styleTrans.table}>
                            <thead>
                                <tr>
                                    <th>NO</th>
                                    <th>NO.AJUAN</th>
                                    <th>AREA ASAL</th>
                                    <th>AREA TUJUAN</th>
                                    <th>TANGGAL SUBMIT</th>
                                    <th>STATUS</th>
                                    <th>OPSI</th>
                                </tr>
                            </thead>
                            <tbody>
                                {newMut !== undefined && newMut.length > 0 && newMut.map(item => {
                                    return (
                                    <tr className={item.status_reject === 0 ? 'note' : item.status_transaksi === 0 ? 'fail' : item.status_reject === 1 && 'bad'}>
                                        <td>{newMut.indexOf(item) + 1}</td>
                                        <td>{item.no_mutasi}</td>
                                        <td>{item.area}</td>
                                        <td>{item.area_rec}</td>
                                        <td>{moment(item.tanggalMut).format('DD MMMM YYYY')}</td>
                                        <td>-</td>
                                        <td>
                                            <Button className="btnSell" color="primary" onClick={() => {this.openDetailMut(item.no_mutasi); this.getDataApproveMut(item)}}>Proses</Button>
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
                                                    <div className="ml-3"><input type="checkbox" checked={dataRinci.kategori === 'NON IT' ? true : false}/> NON IT</div>
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
                                        <Row  className="mb-3 rowRinci">
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
                                            <Button className="btnFootRinci2" size="lg" block outline  color="secondary" onClick={() => this.openRinciAdmin()}>Close</Button>
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
                                        <Col md={6}>
                                        </Col>
                                    </div>
                                </div>
                            )}
                            </Formik>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.formMut} toggle={this.openModalMut} size="xl">
                    <ModalBody>
                        {/* <div className="mb-2"><text className="txtTrans">{detailDis[0] !== undefined && detailDis[0].area}</text>, {moment(detailDis[0] !== undefined && detailDis[0].createdAt).locale('idn').format('DD MMMM YYYY ')}</div> */}
                        <Row className="mb-5">
                            <Col md={1}>
                                <img src={logo} className="imgMut" />
                            </Col>
                            <Col md={7} className='titMut'>
                                FORM MUTASI ASSET / INVENTARIS
                            </Col>
                            <Col md={4}>
                                <Row>
                                    <Col md={6}>No</Col>
                                    <Col md={6}>: {detailMut.length !== 0 ? detailMut[0].no_mutasi : ''}</Col>
                                </Row>
                                <Row>
                                    <Col md={6}>Tanggal Form</Col>
                                    <Col md={6}>: {detailMut.length !== 0 ? moment(detailMut[0].createdAt).format('DD MMMM YYYY') : ''}</Col>
                                </Row>
                                <Row>
                                    <Col md={6}>Tanggal Mutasi Fisik</Col>
                                    <Col md={6}>:</Col>
                                </Row>
                                <Row>
                                    <Col md={6}>Depo</Col>
                                    <Col md={6}>: {detailMut.length !== 0 ? detailMut[0].area : ''}</Col>
                                </Row>
                            </Col>
                        </Row>
                        <Table striped bordered responsive hover className="tableDis mb-3">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Nomor Asset</th>
                                    <th>Nama Asset</th>
                                    <th>Merk/Type</th>
                                    <th>Kategori</th>
                                    <th>Cabang/Depo</th>
                                    <th>Cost Center</th>
                                    <th>Cabang/Depo Penerima</th>
                                    <th>Cost Center Penerima</th>
                                    <th>Select item to reject</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detailMut.length !== 0 && detailMut.map(item => {
                                    return (
                                        <tr>
                                            <th onClick={() => this.openRinci(this.setState({dataRinci: item, kode: '', img: ''}))} scope="row">{detailMut.indexOf(item) + 1}</th>
                                            <td onClick={() => this.openRinci(this.setState({dataRinci: item, kode: '', img: ''}))} >{item.no_asset}</td>
                                            <td onClick={() => this.openRinci(this.setState({dataRinci: item, kode: '', img: ''}))} >{item.nama_asset}</td>
                                            <td onClick={() => this.openRinci(this.setState({dataRinci: item, kode: '', img: ''}))} >{item.merk}</td>
                                            <td onClick={() => this.openRinci(this.setState({dataRinci: item, kode: '', img: ''}))} >{item.kategori}</td>
                                            <td onClick={() => this.openRinci(this.setState({dataRinci: item, kode: '', img: ''}))} >{item.area}</td>
                                            <td onClick={() => this.openRinci(this.setState({dataRinci: item, kode: '', img: ''}))} >{item.cost_center}</td>
                                            <td onClick={() => this.openRinci(this.setState({dataRinci: item, kode: '', img: ''}))} >{item.area_rec}</td>
                                            <td onClick={() => this.openRinci(this.setState({dataRinci: item, kode: '', img: ''}))} >{item.cost_center_rec}</td>
                                            <td> 
                                                <Input
                                                addon
                                                disabled={item.status_app === 0 ? true : false}
                                                checked={item.status_app === 0 ? true : listMut.find(element => element === item.id) !== undefined ? true : false}
                                                type="checkbox"
                                                onClick={listMut.find(element => element === item.id) === undefined ? () => this.chekApp(item.id) : () => this.chekRej(item.id)}
                                                value={item.id} />
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                        <div className="mb-3 mt-3 alMut">
                            <div className="mr-2 alasanMut">
                                <text className="titAlasan mb-3">Alasan Mutasi :</text>
                                <text>{detailMut.length !== 0 ? detailMut[0].alasan : ''}</text>
                            </div>
                        </div>
                    </ModalBody>
                    <hr />
                    <div className="modalFoot ml-3">
                    {/* onClick={() => this.openModPreview({nama: 'disposal pengajuan', no: detailDis[0] !== undefined && detailDis[0].no_mutasi})} */}
                        <Button color="primary" onClick={() => this.getDataApprove(detailMut[0])}>Preview</Button>
                        {level === '12' ? (
                            <div className="btnFoot">
                                <Button className="mr-2" disabled={this.state.filter !== 'available' ? true : listMut.length === 0 ? true : detailMut[0] === undefined ? false : detailMut[0].appForm.find(({jabatan}) => jabatan === role) === undefined ? false : detailMut[0].appForm.find(({jabatan}) => jabatan === role).status === 1 ? true : false} color="danger" onClick={() => this.openReject()}>
                                    Reject
                                </Button>
                                <Button color="success" disabled={this.state.filter !== 'available' ? true : detailMut[0] === undefined ? false : detailMut[0].appForm.find(({jabatan}) => jabatan === role) === undefined ? false : detailMut[0].appForm.find(({jabatan}) => jabatan === role).status === 0 ? true : false} onClick={() => this.openApprove()}>
                                    Approve
                                </Button>
                            </div>
                        ) : (
                            <div className="btnFoot">
                                <Button className="mr-2" disabled={this.state.filter !== 'available' ? true : listMut.length === 0 ? true : detailMut[0] === undefined ? false : detailMut[0].appForm.find(({jabatan}) => jabatan === role) === undefined ? true : detailMut[0].appForm.find(({jabatan}) => jabatan === role).status === 1 ? true : false} color="danger" onClick={() => this.openReject()}>
                                    Reject
                                </Button>
                                <Button color="success" disabled={this.state.filter !== 'available' ? true : detailMut[0] === undefined ? false : detailMut[0].appForm.find(({jabatan}) => jabatan === role) === undefined ? true : detailMut[0].appForm.find(({jabatan}) => jabatan === role).status === 0 ? true : false} onClick={() => this.openApprove()}>
                                    Approve
                                </Button>
                            </div>
                        )}
                    </div>
                </Modal>
                <Modal isOpen={this.state.preview} toggle={this.openModalPre} size="xl">
                    <ModalBody>
                        {/* <div className="mb-2"><text className="txtTrans">{detailDis[0] !== undefined && detailDis[0].area}</text>, {moment(detailDis[0] !== undefined && detailDis[0].createdAt).locale('idn').format('DD MMMM YYYY ')}</div> */}
                        <Row className="mb-5">
                            <Col md={1}>
                                <img src={logo} className="imgMut" />
                            </Col>
                            <Col md={7} className='titMut'>
                                FORM MUTASI ASSET / INVENTARIS
                            </Col>
                            <Col md={4}>
                                <Row>
                                    <Col md={6}>No</Col>
                                    <Col md={6}>: {detailMut.length !== 0 ? detailMut[0].no_mutasi : ''}</Col>
                                </Row>
                                <Row>
                                    <Col md={6}>Tanggal Form</Col>
                                    <Col md={6}>: {detailMut.length !== 0 ? moment(detailMut[0].createdAt).format('DD MMMM YYYY') : ''}</Col>
                                </Row>
                                <Row>
                                    <Col md={6}>Tanggal Mutasi Fisik</Col>
                                    <Col md={6}>:</Col>
                                </Row>
                                <Row>
                                    <Col md={6}>Depo</Col>
                                    <Col md={6}>: {detailMut.length !== 0 ? detailMut[0].area : ''}</Col>
                                </Row>
                            </Col>
                        </Row>
                        <Table striped bordered responsive hover className="tableDis mb-3">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Nomor Asset</th>
                                    <th>Nama Asset</th>
                                    <th>Merk/Type</th>
                                    <th>Kategori</th>
                                    <th>Cabang/Depo</th>
                                    <th>Cost Center</th>
                                    <th>Cabang/Depo Penerima</th>
                                    <th>Cost Center Penerima</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detailMut.length !== 0 && detailMut.map(item => {
                                    return (
                                        <tr>
                                            <th scope="row">{detailMut.indexOf(item) + 1}</th>
                                            <td>{item.no_asset}</td>
                                            <td>{item.nama_asset}</td>
                                            <td>{item.merk}</td>
                                            <td>{item.kategori}</td>
                                            <td>{item.area}</td>
                                            <td>{item.cost_center}</td>
                                            <td>{item.area_rec}</td>
                                            <td>{item.cost_center_rec}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                        <div className="mb-3 mt-3 alMut">
                            <div className="mr-2 alasanMut">
                                <text className="titAlasan mb-3">Alasan Mutasi :</text>
                                <text>{detailMut.length !== 0 ? detailMut[0].alasan : ''}</text>
                            </div>
                        </div>
                        <Table borderless responsive className="tabPreview">
                           <thead>
                               <tr>
                                   <th className="buatPre">Dibuat oleh,</th>
                                   <th className="buatPre">Diterima oleh,</th>
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
                                                    {mutApp.pembuat !== undefined && mutApp.pembuat.map(item => {
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
                                                {mutApp.pembuat !== undefined && mutApp.pembuat.map(item => {
                                                    return (
                                                        <td className="footPre">{item.jabatan === null ? "-" : item.jabatan === 'HO' ? 'SPV' : item.jabatan}</td>
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
                                                    {mutApp.penerima !== undefined && mutApp.penerima.map(item => {
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
                                                {mutApp.penerima !== undefined && mutApp.penerima.map(item => {
                                                    return (
                                                        <td className="footPre">{item.jabatan === null ? "-" : item.jabatan === 'HO' ? 'SPV' : item.jabatan}</td>
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
                                                    {mutApp.pemeriksa !== undefined && mutApp.pemeriksa.map(item => {
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
                                                    {mutApp.pemeriksa !== undefined && mutApp.pemeriksa.map(item => {
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
                                                    {mutApp.penyetuju !== undefined && mutApp.penyetuju.map(item => {
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
                                                    {mutApp.penyetuju !== undefined && mutApp.penyetuju.map(item => {
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
                    {/* onClick={() => this.openModPreview({nama: 'disposal pengajuan', no: detailDis[0] !== undefined && detailDis[0].no_mutasi})} */}
                        {/* <Button color="primary">Preview</Button> */}
                        <div className="btnFoot">
                            <Button className="mr-2" color="success">
                                <TableMut />
                            </Button>
                            <Button color="primary" onClick={this.openModalPre}>Close</Button>
                        </div>
                        <div className="btnFoot">
                        </div>
                    </div>
                </Modal>
                <Modal isOpen={this.state.approve} toggle={this.openApprove} centered={true}>
                    <ModalBody>
                        <div className={style.modalApprove}>
                            <div>
                                <text>
                                    Anda yakin untuk approve 
                                    <text className={style.verif}> pengajuan mutasi</text>
                                    pada tanggal
                                    <text className={style.verif}> {moment().format('LL')}</text> ?
                                </text>
                            </div>
                            <div className={style.btnApprove}>
                                <Button color="primary" onClick={this.approveMutasi}>Ya</Button>
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
                    onSubmit={(values) => {this.rejectMutasi(values)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                            <div className={style.modalApprove}>
                            <div className={style.quest}>Anda yakin untuk reject pengajuan mutasi ?</div>
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
                                <Button color="secondary" onClick={this.openReject}>Tidak</Button>
                            </div>
                        </div>
                        )}
                        </Formik>
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
                                            <input
                                            className="ml-4"
                                            type="file"
                                            onClick={() => this.setState({detail: x})}
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
                    <Button className="mr-2" color="secondary" onClick={this.closeProsesModalDoc}>
                            Close
                        </Button>
                        <Button color="primary" onClick={this.closeProsesModalDoc}>
                            Save 
                    </Button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={this.state.modalConfirm} toggle={this.openConfirm} size="sm">
                <ModalBody>
                    {this.state.confirm === 'approve' ?(
                        <div>
                            <div className={style.cekUpdate}>
                            <AiFillCheckCircle size={80} className={style.green} />
                            <div className={[style.sucUpdate, style.green]}>Berhasil Approve Form Mutasi</div>
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
                        </div>
                        </div>
                    ) : this.state.confirm === 'rejReject' ?(
                        <div>
                            <div className={style.cekUpdate}>
                            <AiOutlineClose size={80} className={style.red} />
                            <div className={[style.sucUpdate, style.green]}>Gagal Reject Form Mutasi</div>
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
                    ) : (
                        <div></div>
                    )}
                </ModalBody>
            </Modal>
            <Modal isOpen={this.props.mutasi.isLoading ? true: false} size="sm">
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
    notif: state.notif
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
    approveMut: mutasi.approveMutasi,
    rejectMut: mutasi.rejectMutasi,
    getApproveMut: mutasi.getApproveMutasi,
    getMutasiRec: mutasi.getMutasiRec,
    getDocumentMut: mutasi.getDocumentMut,
    resetAddMut: mutasi.resetAddMut,
    resetAppRej: mutasi.resetAppRej,
    getDetailMutasi: mutasi.getDetailMutasi,
    getRole: user.getRole,
    notifMutasi: notif.notifMutasi
}

export default connect(mapStateToProps, mapDispatchToProps)(Mutasi)
