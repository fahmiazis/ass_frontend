/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { Component } from 'react'
import {VscAccount} from 'react-icons/vsc'
import { Container, Collapse, Nav, Navbar,
    NavbarToggler, NavbarBrand, NavItem, NavLink,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, Dropdown,
    DropdownItem, Table, ButtonDropdown, Input, Button, Col,
    Alert, Spinner, Row, Modal, ModalBody, ModalHeader, ModalFooter} from 'reactstrap'
import approve from '../redux/actions/approve'
import {BsCircle} from 'react-icons/bs'
import {FaSearch, FaUserCircle, FaBars, FaCartPlus, FaTh, FaList} from 'react-icons/fa'
import Sidebar from "../components/Header";
import { AiOutlineCheck, AiOutlineClose, AiFillCheckCircle} from 'react-icons/ai'
import MaterialTitlePanel from "../components/material_title_panel"
import SidebarContent from "../components/sidebar_content"
import style from '../assets/css/input.module.css'
import placeholder from  "../assets/img/placeholder.png"
import asset from '../redux/actions/asset'
import b from "../assets/img/b.jpg"
import pengadaan from '../redux/actions/pengadaan'
import e from "../assets/img/e.jpg"
import {connect} from 'react-redux'
import moment from 'moment'
import {Formik} from 'formik'
import * as Yup from 'yup'
import auth from '../redux/actions/auth'
import disposal from '../redux/actions/disposal'
import Pdf from "../components/Pdf"
import depo from '../redux/actions/depo'
import stock from '../redux/actions/stock'
import {default as axios} from 'axios'
const {REACT_APP_BACKEND_URL} = process.env

const stockSchema = Yup.object().shape({
    merk: Yup.string().required("must be filled"),
    satuan: Yup.string().required("must be filled"),
    unit: Yup.number().required("must be filled"),
    lokasi: Yup.string().required("must be filled"),
    grouping: Yup.string().required("must be filled"),
    keterangan: Yup.string().validateSync("")
})

const alasanSchema = Yup.object().shape({
    alasan: Yup.string().required()
});


class Stock extends Component {
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
            limit: 10,
            search: '',
            dataRinci: {},
            dataItem: {},
            modalEdit: false,
            modalRinci: false,
            dropApp: false,
            openReject: false,
            openApprove: false,
            modalPreview: false,
            view: 'card',
            fisik: '',
            kondisi: '',
            alert: false,
            submitPre: false,
            dataStatus: [],
            openStatus: false,
            stat: '',
            modalConfirm: false,
            confirm: '',
            modalDoc: false,
            listMut: [],
            modalStock: false,
            openPdf: false,
            modalAdd: false
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
    }

    submitStock = async () => {
        const token = localStorage.getItem('token')
        await this.props.submitStock(token)
        this.getDataAsset()
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

    uploadPicture = e => {
        const {size, type} = e.target.files[0]
        this.setState({fileUpload: e.target.files[0]})
        if (size >= 20000000) {
            this.setState({errMsg: "Maximum upload size 20 MB"})
            this.uploadAlert()
        } else if (type !== 'image/jpeg' && type !== 'image/png') {
            this.setState({errMsg: 'Invalid file type. Only image files are allowed.'})
            this.uploadAlert()
        } else {
            const {dataRinci} = this.state
            const token = localStorage.getItem('token')
            const data = new FormData()
            data.append('document', e.target.files[0])
            this.props.uploadPicture(token, dataRinci.no_asset, data)
        }
    }

    getApproveStock = async (value) => { 
        const token = localStorage.getItem('token')
        await this.props.getApproveStock(token, value.no, value.nama)
    }

    approveStock = async () => {
        const {dataItem} = this.state
        const token = localStorage.getItem('token')
        await this.props.approveStock(token, dataItem.no_stock)
        await this.props.getApproveStock(token, dataItem.no_stock, 'stock opname')
    }

    rejectStock = async (value) => {
        const {dataItem, listMut} = this.state
        const token = localStorage.getItem('token')
        const data = {
            alasan: value.alasan,
            listMut: listMut
        }
        await this.props.rejectStock(token, dataItem.no_stock, data)
        await this.props.getDetailStock(token, dataItem.id)
        await this.props.getApproveStock(token, dataItem.no_stock, 'stock opname')
    }

    dropApp = () => {
        this.setState({dropApp: !this.state.dropApp})
    }

    openModalPreview = () => {
        this.setState({modalPreview: !this.state.modalPreview})
    }

    openModalReject = () => {
        this.setState({openReject: !this.state.openReject})
    }

    openModalApprove = () => {
        this.setState({openApprove: !this.state.openApprove})
    }

    openPreview = async (no) => {
        const token = localStorage.getItem('token')
        await this.props.getApproveStock(token, no, 'stock opname')
        this.openModalPreview()
    }

    menuButtonClick(ev) {
        ev.preventDefault();
        this.onSetOpen(!this.state.open);
    }

    openModalRinci = () => {
        this.setState({modalRinci: !this.state.modalRinci})
    }

    next = async () => {
        const { page } = this.props.asset
        const token = localStorage.getItem('token')
        await this.props.resetData()
        await this.props.nextPage(token, page.nextLink)
    }

    prev = async () => {
        const { page } = this.props.asset
        const token = localStorage.getItem('token')
        await this.props.resetData()
        await this.props.nextPage(token, page.prevLink)
    }

    onSetOpen(open) {
        this.setState({ open });
    }

    getDetailStock = async (value) => {
        const token = localStorage.getItem("token")
        this.setState({dataItem: value})
        await this.props.getDetailStock(token, value.id)
        this.openModalRinci()
    }

    deleteStock = async (value) => {
        const token = localStorage.getItem("token")
        await this.props.deleteStock(token, value.id)
        this.getDataStock()
    }

    showAlert = () => {
        this.setState({alert: true})
       
         setTimeout(() => {
            this.setState({
                alert: false
            })
         }, 10000)
    }

    componentDidMount() {
        const level = localStorage.getItem('level')
        if (level === "5" ) {
            this.getDataAsset()
        } else {
            this.getDataStock()
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

    componentDidUpdate() {
        const {isUpload, isError, isApprove, isReject, rejReject, rejApprove} = this.props.stock
        const {dataRinci} = this.state
        const { isUpdateNew } = this.props.asset
        const errUpload = this.props.disposal.isUpload
        const token = localStorage.getItem('token')
        if (isUpload) {
            this.props.resetStock()
             setTimeout(() => {
                this.props.getDetailAsset(token, dataRinci.no_asset)
                this.getDataAsset()
             }, 100)
        } else if (errUpload) {
            setTimeout(() => {
                this.props.resetDis()
             }, 1000)
             setTimeout(() => {
                 this.cekStatus('DIPINJAM SEMENTARA')
             }, 1100)
        } else if (isUpdateNew) {
            this.openConfirm(this.setState({confirm: 'approve'}))
            this.props.resetError()
            this.props.getDetailAsset(token, dataRinci.no_asset)
            this.getDataAsset()
        } else if (isReject) {
            this.setState({listMut: []})
            this.openModalReject()
            this.openConfirm(this.setState({confirm: 'reject'}))
            this.props.resetStock()
        } else if (isApprove) {
            this.openConfirm(this.setState({confirm: 'isApprove'}))
            this.openModalApprove()
            this.props.resetStock()
        } else if (rejReject) {
            this.openModalReject()
            this.openConfirm(this.setState({confirm: 'rejReject'}))
            this.props.resetStock()
        } else if (rejApprove) {
            this.openConfirm(this.setState({confirm: 'rejApprove'}))
            this.openModalApprove()
            this.props.resetStock()
        } else if (isError) {
            this.props.resetStock()
            this.showAlert()
        }
    }

    openConfirm = () => {
        this.setState({modalConfirm: !this.state.modalConfirm})
    }

    openModalEdit = () => {
        this.setState({modalEdit: !this.state.modalEdit})
    }

    getDataAsset = async (value) => {
        const token = localStorage.getItem("token")
        const { page } = this.props.asset
        const search = value === undefined ? '' : value.search
        const limit = value === undefined ? this.state.limit : value.limit
        await this.props.getAssetAll(token, limit, search, page.currentPage, 'asset')
        await this.props.getDetailDepo(token, 1)
        this.setState({limit: value === undefined ? 10 : value.limit})
    }

    getDataStock = async (value) => {
        const token = localStorage.getItem("token")
        // const { page } = this.props.disposal
        // const search = value === undefined ? '' : this.state.search
        // const limit = value === undefined ? this.state.limit : value.limit
        await this.props.getStockAll(token)
        this.setState({limit: value === undefined ? 10 : value.limit})
    }

    getDataList = async () => {
        const token = localStorage.getItem("token")
        await this.props.getDepo(token, 400, '', 1)
        await this.props.getStockAll(token)
    }

    modalSubmitPre = () => {
        this.setState({submitPre: !this.state.submitPre})
    }

    prosesSubmitPre = async () => {
        const token = localStorage.getItem("token")
        await this.props.getAssetAll(token, 1000, '', 1, 'asset')
        this.modalSubmitPre()
    }

    onSearch = async (e) => {
        this.setState({search: e.target.value})
        const token = localStorage.getItem("token")
        if(e.key === 'Enter'){
            await this.props.getAssetAll(token, 10, e.target.value, 1)
        }
    }

    updateAsset = async (value) => {
        const token = localStorage.getItem("token")
        const { dataRinci } = this.state
        const data = {
            merk: value.merk,
            satuan: value.satuan,
            unit: value.unit,
            lokasi: value.lokasi,
            grouping: value.grouping,
            keterangan: value.keterangan,
            status_fisik: value.fisik,
            kondisi: value.kondisi
        }
        await this.props.updateAssetNew(token, dataRinci.id, data)
    }

    changeView = (val) => {
        this.setState({view: val})
        if (val === 'list') {
            this.getDataList()
        } else {
            this.getDataStock()
        }
    }

    updateNewAsset = async (value) => {
        const token = localStorage.getItem("token")
        const data = {
            [value.target.name]: value.target.value
        }
        if (value.target.name === 'lokasi' || value.target.name === 'keterangan' || value.target.name === 'merk') {
            if (value.key === 'Enter') {
                await this.props.updateAsset(token, value.item.id, data)
            } else {
                await this.props.updateAsset(token, value.item.id, data)
            }
        } else {
            await this.props.updateAsset(token, value.item.id, data)
            this.getDataAsset()
        }
    }

    updateStatus = async (val) => {
        const token = localStorage.getItem('token')
        const { detailAsset } = this.props.asset
        const { stat } = this.state
        const data = {
            grouping: stat
        }
        await this.props.updateAssetNew(token, detailAsset.id, data)
        this.getDataAsset()
    } 

    selectStatus = async (fisik, kondisi) => {
        this.setState({fisik: fisik, kondisi: kondisi})
        const token = localStorage.getItem("token")
        if (fisik === '' && kondisi === '') {
            console.log(fisik, kondisi)
        } else {
            await this.props.getStatus(token, fisik, kondisi)
        }
    }

    listStatus = async (val) => {
        const token = localStorage.getItem("token")
        await this.props.getDetailAsset(token, val)
        const { detailAsset } = this.props.asset
        if (detailAsset !== undefined) {
            this.setState({stat: detailAsset.grouping})
            if (detailAsset.kondisi === null && detailAsset.status_fisik === null) {
                await this.props.getStatus(token, '', '')
                this.modalStatus()
            } else {
                await this.props.getStatus(token, detailAsset.status_fisik === null ? '' : detailAsset.status_fisik, detailAsset.kondisi === null ? '' : detailAsset.kondisi)
                this.modalStatus()
            }
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

    openModalPdf = () => {
        this.setState({openPdf: !this.state.openPdf})
    }

    openProsesModalDoc = async () => {
        const token = localStorage.getItem("token")
        const { detailAsset } = this.props.stock
        await this.props.getDocument(token, detailAsset.no_asset)
        this.openModalDoc()
    }

    cekStatus = async (val) => {
        const token = localStorage.getItem("token")
        const { detailAsset } = this.props.asset
        if (val === 'DIPINJAM SEMENTARA') {
            await this.props.cekDokumen(token, detailAsset.no_asset)
        }
    }

    openModalDoc = () => {
        this.setState({modalDoc: !this.state.modalDoc})
    }

    openModalAdd = () => {
        this.setState({modalAdd: !this.state.modalAdd})
    }

    getRincian = async (val) => {
        const token = localStorage.getItem("token")
        this.setState({dataRinci: val})
        await this.props.getDetailAsset(token, val.no_asset)
        this.openModalEdit()
    }

    modalStatus = () => {
        this.setState({openStatus: !this.state.openStatus})
    }

    chekApp = (val) => {
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

    chekRej = (val) => {
        const { listMut } = this.state
        listMut.push(val)
        this.setState({listMut: listMut})
    }

    getRinciStock = async (val) => {
        const token = localStorage.getItem("token")
        this.setState({dataRinci: val})
        await this.props.getDetailItem(token, val.id)
        this.openModalStock()
    }

    openModalStock = () => {
        this.setState({modalStock: !this.state.modalStock})
    }

    render() {
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const {dataRinci, dropApp, dataItem, listMut} = this.state
        const { detailDepo, dataDepo } = this.props.depo
        const { alertUpload, page, detailAsset} = this.props.asset
        const dataAsset = this.props.asset.assetAll
        const detRinci = this.props.stock.detailAsset
        const { dataStock, detailStock, stockApp, dataStatus, alertM, alertMsg, dataDoc } = this.props.stock
        const pages = this.props.depo.page

        const contentHeader =  (
            <div className={style.navbar}>
                <NavbarBrand
                href="#"
                onClick={this.menuButtonClick}
                >
                    <FaBars size={20} className={style.white} />
                </NavbarBrand>
                <div className={style.divLogo}>
                    <marquee className={style.marquee}>
                        <span>WEB ASSET</span>
                    </marquee>
                    <div className={style.textLogo}>
                        <FaUserCircle size={24} className="mr-2" />
                        <text className="mr-3">{level === '1' ? 'Super admin' : names }</text>
                    </div>
                </div>
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
                        <div className={style.bodyDashboard}>
                            <Alert color="danger" className={style.alertWrong} isOpen={this.state.alert}>
                                <div>{alertM}</div>
                            </Alert>
                            <div className={style.headMaster}>
                                <div className={style.titleDashboard}>Stock Opname Asset</div>
                            </div>
                            <div className={style.secEmail}>
                                    {level === '5' ? (
                                        <div className={style.headEmail}>
                                            <Button onClick={this.prosesSubmitPre} color="info" size="lg" className="btnGoCart">Submit</Button>
                                        </div>
                                    ) : level === '2' && (
                                        <div className={style.headEmail}>
                                            {this.state.view === 'list' ? (
                                                <Button color="primary" className="transBtn ml-2" onClick={() => this.changeView('card')}><FaTh size={35} className="mr-2"/> Gallery View</Button>
                                            ) : (
                                                <Button color="primary" className="transBtn ml-3" onClick={() => this.changeView('list')}><FaList size={30} className="mr-2"/> List View</Button>
                                            )}
                                        </div>
                                        // <div className={style.secHeadDashboard}>
                                        //     <div>
                                        //         <text>Show: </text>
                                        //         <ButtonDropdown className={style.drop} isOpen={dropOpen} toggle={this.dropDown}>
                                        //         <DropdownToggle caret color="light">
                                        //             {this.state.limit}
                                        //         </DropdownToggle>
                                        //         <DropdownMenu>
                                        //         <DropdownItem className={style.item} onClick={() => this.getDataAsset({limit: 10, search: ''})}>10</DropdownItem>
                                        //             <DropdownItem className={style.item} onClick={() => this.getDataAsset({limit: 20, search: ''})}>20</DropdownItem>
                                        //             <DropdownItem className={style.item} onClick={() => this.getDataAsset({limit: 50, search: ''})}>50</DropdownItem>
                                        //         </DropdownMenu>
                                        //         </ButtonDropdown>
                                        //         <text className={style.textEntries}>entries</text>
                                        //     </div>
                                        // </div>
                                    )}
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
                                </div>
                                {level === '5' ? (
                                    <div>
                                        <div className="stockTitle">kertas kerja opname aset kantor</div>
                                        <div className="ptStock">pt. pinus merah abadi</div>
                                        <Row className="ptStock inputStock">
                                            <Col md={3} xl={3} sm={3}>kantor pusat/cabang</Col>
                                            <Col md={4} xl={4} sm={4} className="inputStock">:<Input value={dataAsset.length > 0 ? dataAsset[0].area : ''} className="ml-3"  /></Col>
                                        </Row>
                                        <Row className="ptStock inputStock">
                                            <Col md={3} xl={3} sm={3}>depo/cp</Col>
                                            <Col md={4} xl={4} sm={4} className="inputStock">:<Input value={dataAsset.length > 0 ? dataAsset[0].area : ''} className="ml-3" /></Col>
                                        </Row>
                                        <Row className="ptStock inputStock">
                                            <Col md={3} xl={3} sm={3}>opname per tanggal</Col>
                                            <Col md={4} xl={4} sm={4} className="inputStock">:<Input value={moment().format('LL')} className="ml-3"  /></Col>
                                        </Row>
                                    </div>
                                ) : (
                                    <div></div>
                                )}
                                {level === '5' ? (
                                    this.props.asset.isGetAll === false ? (
                                        <div className={style.tableDashboard}>
                                            <Table bordered responsive hover className={style.tab}>
                                                <thead>
                                                    <tr>
                                                        <th>No</th>
                                                        <th>NO. ASET</th>
                                                        <th>DESKRIPSI</th>
                                                        <th>MERK</th>
                                                        <th>SATUAN</th>
                                                        <th>UNIT</th>
                                                        <th>LOKASI</th>
                                                        <th>STATUS FISIK</th>
                                                        <th>KONDISI</th>
                                                        <th>GROUPING</th>
                                                        <th>KETERANGAN</th>
                                                    </tr>
                                                </thead>
                                            </Table>
                                            <div className={style.spin}>
                                                    <Spinner type="grow" color="primary"/>
                                                    <Spinner type="grow" className="mr-3 ml-3" color="success"/>
                                                    <Spinner type="grow" color="warning"/>
                                                    <Spinner type="grow" className="mr-3 ml-3" color="danger"/>
                                                    <Spinner type="grow" color="info"/>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={style.tableDashboard}>
                                        <Table bordered responsive hover className={style.tab}>
                                            <thead>
                                                <tr>
                                                    <th>No</th>
                                                    <th>NO. ASET</th>
                                                    <th>DESKRIPSI</th>
                                                    <th>MERK</th>
                                                    <th>SATUAN</th>
                                                    <th>UNIT</th>
                                                    <th>LOKASI</th>
                                                    <th>STATUS FISIK</th>
                                                    <th>KONDISI</th>
                                                    <th>STATUS ASET</th>
                                                    <th>KETERANGAN</th>
                                                    <th>Picture</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dataAsset.length !== 0 && dataAsset.map(item => {
                                                    return (
                                                    // <tr onClick={() => this.openModalEdit(this.setState({dataRinci: item}))}>
                                                    <tr>
                                                        <th scope="row">{(dataAsset.indexOf(item) + (((page.currentPage - 1) * page.limitPerPage) + 1))}</th>
                                                        <td>{item.no_asset}</td>
                                                        <td>{item.nama_asset}</td>
                                                        {/* <td>{item.merk}</td> */}
                                                        <td>
                                                            <Input
                                                            type= "text"
                                                            name="merk"
                                                            className="inputRinci"
                                                            defaultValue={item.merk}
                                                            onChange={e => this.updateNewAsset({item: item, target: e.target, key: e.key})}
                                                            onKeyPress={e => this.updateNewAsset({item: item, target: e.target, key: e.key})}
                                                            />
                                                            {/* <text className="enter">Tekan enter untuk menyimpan perubahan</text> */}
                                                        </td>
                                                        <td>
                                                            <Input 
                                                            type="select"
                                                            className="inputRinci"
                                                            name="satuan"
                                                            value={item.satuan}
                                                            defaultValue={item.satuan}
                                                            onChange={e => {this.updateNewAsset({item: item, target: e.target})} }
                                                            >
                                                                <option>-Pilih Satuan-</option>
                                                                <option value="Unit">UNIT</option>
                                                                <option value="Paket">PAKET</option>
                                                            </Input>
                                                        </td>
                                                        {/* <td>{item.satuan}</td> */}
                                                        <td>{item.unit}</td>
                                                        {/* <td>{item.lokasi}</td> */}
                                                        <td>
                                                            <Input
                                                            type= "text"
                                                            name="lokasi"
                                                            className="inputRinci"
                                                            defaultValue={item.lokasi}
                                                            onChange={e => this.updateNewAsset({item: item, target: e.target, key: e.key})}
                                                            onKeyPress={e => this.updateNewAsset({item: item, target: e.target, key: e.key})}
                                                            />
                                                             {/* <text className="enter">Tekan enter untuk menyimpan perubahan</text> */}
                                                        </td>
                                                        {/* <td>{item.status_fisik}</td> */}
                                                        <td>
                                                            <Input 
                                                            type="select"
                                                            className="inputRinci"
                                                            name="status_fisik"
                                                            value={item.status_fisik === null ? 'null' : item.status_fisik}
                                                            defaultValue={item.status_fisik === null ? 'null' : item.status_fisik}
                                                            // onChange={e => {this.updateNewAsset({item: item, target: e.target}); this.selectStatus(e.target.value, this.state.kondisi)} }
                                                            onChange={e => {this.updateNewAsset({item: item, target: e.target})} }
                                                            >
                                                                <option value={null}>-Pilih Status Fisik-</option>
                                                                <option value="ada">Ada</option>
                                                                <option value="tidak ada">Tidak Ada</option>
                                                            </Input>
                                                        </td>
                                                        {/* <td>{item.kondisi}</td> */}
                                                        <td>
                                                            <Input 
                                                            type="select"
                                                            name="kondisi"
                                                            className="inputRinci"
                                                            value={item.kondisi === null ? 'null' : item.kondisi}
                                                            defaultValue={item.kondisi === null ? 'null' : item.kondisi} 
                                                            // onChange={e => {this.updateNewAsset({item: item, target: e.target}); this.selectStatus(this.state.fisik, e.target.value)} }
                                                            onChange={e => {this.updateNewAsset({item: item, target: e.target})} }
                                                            >
                                                                <option>-Pilih Kondisi-</option>
                                                                <option value="baik">Baik</option>
                                                                <option value="rusak">Rusak</option>
                                                                <option value="">-</option>
                                                            </Input>
                                                        </td>
                                                        {/* <td>{item.grouping}</td> */}
                                                        <td>
                                                            <Input 
                                                            type="select"
                                                            className="inputRinci"
                                                            name="grouping"
                                                            defaultValue={item.grouping}
                                                            onClick={() => this.listStatus(item.no_asset)}
                                                            // onChange={e => this.updateNewAsset({item: item, target: e.target})}
                                                            >
                                                                <option>{item.grouping === null || '' ? "-Pilih Status Aset-" : item.grouping}</option>
                                                                {/* {dataStatus.length > 0 && dataStatus.map(x => {
                                                                    return (
                                                                        x.status === item.grouping ? (
                                                                            <div></div>
                                                                        ) : (
                                                                            <option value={x.status}>{x.status}</option>
                                                                        )
                                                                    )
                                                                })} */}
                                                            </Input>
                                                        </td>
                                                        {/* <td>{item.keterangan}</td> */}
                                                        <td>
                                                            <Input
                                                            type= "text"
                                                            name="keterangan"
                                                            className="inputRinci"
                                                            defaultValue={item.keterangan === 'proses mutasi' ? '' : item.keterangan}
                                                            onChange={e => this.updateNewAsset({item: item, target: e.target, key: e.key})}
                                                            onKeyPress={e => this.updateNewAsset({item: item, target: e.target, key: e.key})}
                                                            />
                                                             {/* <text className="enter">Tekan enter untuk menyimpan perubahan</text> */}
                                                        </td>
                                                        <td>
                                                            {item.pict === undefined || item.pict.length === 0 ? 
                                                            <Input type="file" onChange={this.uploadPicture} onClick={() => this.setState({dataRinci: item})}>Upload</Input> : 
                                                            <div className="">
                                                                <img src={`${REACT_APP_BACKEND_URL}/${item.pict[item.pict.length - 1].path}`} className="imgTable" />
                                                                <text className='textPict'>{moment(item.pict[item.pict.length - 1].createdAt).format('DD MMMM YYYY')}</text>
                                                                <Input type="file" onChange={this.uploadPicture} onClick={() => this.setState({dataRinci: item})}>Upload</Input>
                                                            </div>
                                                            }
                                                        </td>
                                                        <td><Button color="primary" onClick={() => this.getRincian(item)}>Rincian</Button></td>
                                                    </tr>
                                                    )})}
                                            </tbody>
                                        </Table>
                                    </div>
                                    )
                                ) : (
                                    dataStock.length === 0 && dataDepo.length === 0 ? (
                                        <div></div>
                                    ) : (
                                        this.state.view === 'card' ? (
                                            <Row className="bodyDispos">
                                                {dataStock.length !== 0 && dataStock.map(item => {
                                                    return (
                                                        <div className="bodyCard">
                                                            <img src={item.no_asset === '4100000150' ? b : item.no_asset === '4300001770' ? e : placeholder} className="imgCard1" />
                                                            <Button size="sm" color="success" className="labelBut">Stock Opname</Button>
                                                            {/* <button className="btnDispos" onClick={() => this.openModalRinci(this.setState({dataRinci: item}))}></button> */}
                                                            <div className="btnDispos ml-2">
                                                                <div className="txtDoc mb-2">
                                                                    Pengajuan Stock Opname
                                                                </div>
                                                                <Row className="mb-2">
                                                                    <Col md={5} className="txtDoc">
                                                                    Kode Plant
                                                                    </Col>
                                                                    <Col md={7} className="txtDoc">
                                                                    : {item.kode_plant}
                                                                    </Col>
                                                                </Row>
                                                                <Row className="mb-2">
                                                                    <Col md={5} className="txtDoc">
                                                                    Area
                                                                    </Col>
                                                                    <Col md={7} className="txtDoc">
                                                                    : {item.area}
                                                                    </Col>
                                                                </Row>
                                                                <Row className="mb-2">
                                                                    <Col md={5} className="txtDoc">
                                                                    Tanggal Stock
                                                                    </Col>
                                                                    <Col md={7} className="txtDoc">
                                                                    : {moment(item.tanggalStock).format('LL')}
                                                                    </Col>
                                                                </Row>
                                                                <Row className="mb-2">
                                                                    <Col md={5} className="txtDoc">
                                                                    No Opname
                                                                    </Col>
                                                                    <Col md={7} className="txtDoc">
                                                                    : {item.no_stock}
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                            <Row className="footCard mb-3 mt-3">
                                                                <Col md={12} xl={12} className="colFoot">
                                                                    <Button className="btnSell" color="primary" onClick={() => {this.getDetailStock(item); this.getApproveStock({nama: 'stock opname', no: item.no_stock})}}>Proses</Button>
                                                                    {/* <Button className="btnSell ml-2" color="danger" onClick={() => this.deleteStock(item)}>Delete</Button> */}
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    )
                                                })}
                                            </Row>
                                        ) : (
                                            <div className={style.tableDashboard}>
                                                <Table bordered responsive hover className={style.tab}>
                                                    <thead>
                                                        <tr>
                                                            <th>No</th>
                                                            <th>Area</th>
                                                            <th>Kode Plant</th>
                                                            <th>Tanggal Stock Opname</th>
                                                            <th>No Stock Opname</th>
                                                            <th>Status Approve</th>
                                                            <th>Dokumentasi Aset</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {dataDepo.length !== 0 && dataDepo.map(item => {
                                                            return (
                                                            <tr>
                                                                <th scope="row">{(dataDepo.indexOf(item) + (((pages.currentPage - 1) * pages.limitPerPage) + 1))}</th>
                                                                <td>{item.nama_area}</td>
                                                                <td>{item.kode_plant}</td>
                                                                <td>{dataStock.find(({kode_plant}) => kode_plant === item.kode_plant) === undefined ? "" : moment(dataStock.find(({kode_plant}) => kode_plant === item.kode_plant).tanggalStock).format('DD MMMM YYYY')}</td>
                                                                <td>{dataStock.find(({kode_plant}) => kode_plant === item.kode_plant) === undefined ? "" : dataStock.find(({kode_plant}) => kode_plant === item.kode_plant).no_stock}</td>
                                                                <td>{dataStock.find(({kode_plant}) => kode_plant === item.kode_plant) === undefined ? "" : <AiOutlineCheck color="primary" size={20} />}</td>
                                                                <td>{dataStock.find(({kode_plant}) => kode_plant === item.kode_plant) === undefined ? "" : <AiOutlineCheck color="primary" size={20} />}</td>
                                                            </tr>
                                                            )})}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        )
                                    )
                                )}
                                <div>
                                    <div className={style.infoPageEmail}>
                                        <text>Showing {page.currentPage} of {page.pages} pages</text>
                                        <div className={style.pageButton}>
                                            <button className={style.btnPrev} color="info" disabled={page.prevLink === null ? true : false} onClick={this.prev}>Prev</button>
                                            <button className={style.btnPrev} color="info" disabled={page.nextLink === null ? true : false} onClick={this.next}>Next</button>
                                        </div>
                                    </div>
                                </div>
                        </div>
                    </div>
                    </MaterialTitlePanel>
                </Sidebar>
                <Modal isOpen={this.state.modalAdd} toggle={this.openModalAdd} size="lg">
                    <ModalHeader>
                        Tambah Asset
                    </ModalHeader>
                    <ModalBody>
                        <div className="mainRinci2">
                            <div className="leftRinci2 mb-5">
                                <div className="titRinci">{dataRinci.nama_asset}</div>
                                <img src={detailAsset.pict === undefined || detailAsset.pict.length === 0 ? placeholder : `${REACT_APP_BACKEND_URL}/${detailAsset.pict[detailAsset.pict.length - 1].path}`} className="imgRinci" />
                                <Input type="file" className='mt-2' onChange={this.uploadPicture}>Upload Picture</Input>
                                {/* <div className="secImgSmall">
                                    <button className="btnSmallImg">
                                        <img src={placeholder} className="imgSmallRinci" />
                                    </button>
                                </div> */}
                            </div>
                            <Formik
                            initialValues = {{
                                merk: '',
                                satuan: '',
                                unit: 1,
                                lokasi: '',
                                grouping: '',
                                keterangan: '',
                                status_fisik: '',
                                kondisi: ''
                            }}
                            validationSchema = {stockSchema}
                            onSubmit={(values) => {this.addStock(values)}}
                            >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                                <div className="rightRinci2">
                                    <div>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>No Asset</Col>
                                            <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.no_asset} disabled /></Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Deskripsi</Col>
                                            <Col md={9} className="colRinci">:  <Input className="inputRinci" value={level === '5' ? dataRinci.nama_asset : dataRinci.deskripsi} disabled /></Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Merk</Col>
                                            <Col md={9} className="colRinci">:  <Input
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
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Satuan</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled={level === '5' ? false : true}
                                                type= "select" 
                                                className="inputRinci"
                                                value={values.satuan}
                                                onBlur={handleBlur("satuan")}
                                                onChange={handleChange("satuan")}
                                                >
                                                    <option>{values.satuan}</option>
                                                    <option>-Pilih Satuan-</option>
                                                    <option value="UNIT">UNIT</option>
                                                    <option value="PAKET">PAKET</option>
                                                </Input>
                                            </Col>
                                        </Row>
                                        {errors.satuan ? (
                                            <text className={style.txtError}>{errors.satuan}</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Unit</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled={level === '5' ? false : true}
                                                type= "text" 
                                                className="inputRinci"
                                                value={values.unit}
                                                onBlur={handleBlur("unit")}
                                                onChange={handleChange("unit")}
                                                />
                                            </Col>
                                        </Row>
                                        {errors.unit ? (
                                            <text className={style.txtError}>{errors.unit}</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Lokasi</Col>
                                            <Col md={9} className="colRinci">:
                                            <Input
                                                disabled={level === '5' ? false : true}
                                                type= "text" 
                                                className="inputRinci"
                                                value={values.lokasi}
                                                onBlur={handleBlur("lokasi")}
                                                onChange={handleChange("lokasi")}
                                                />
                                            </Col>
                                        </Row>
                                        {errors.lokasi ? (
                                            <text className={style.txtError}>{errors.lokasi}</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Status Fisik</Col>
                                            <Col md={9} className="colRinci">:  <Input 
                                                disabled={level === '5' ? false : true}
                                                type="select"
                                                className="inputRinci" 
                                                value={detailAsset.fisik} 
                                                onBlur={handleBlur("status_fisik")}
                                                onChange={e => { handleChange("status_fisik"); this.selectStatus(e.target.value, this.state.kondisi)} }
                                                >
                                                    <option>{values.status_fisik}</option>
                                                    <option>-Pilih Status Fisik-</option>
                                                    <option value="ada">Ada</option>
                                                    <option value="tidak ada">Tidak Ada</option>
                                                </Input>
                                            </Col>
                                        </Row>
                                        {errors.status_fisik ? (
                                            <text className={style.txtError}>{errors.status_fisik}</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Kondisi</Col>
                                            <Col md={9} className="colRinci">:  <Input 
                                                disabled={level === '5' ? false : true}
                                                type="select"
                                                className="inputRinci" 
                                                value={values.kondisi} 
                                                onBlur={handleBlur("kondisi")}
                                                onChange={e => { handleChange("kondisi"); this.selectStatus(this.state.fisik, e.target.value)} }
                                                >
                                                    <option>{values.kondisi}</option>
                                                    <option>-Pilih Kondisi-</option>
                                                    <option value="baik">Baik</option>
                                                    <option value="rusak">Rusak</option>
                                                    <option value="">-</option>
                                                </Input>
                                            </Col>
                                        </Row>
                                        {errors.kondisi ? (
                                            <text className={style.txtError}>{errors.kondisi}</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Status Aset</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled={level === '5' ? false : true}
                                                type= "select" 
                                                className="inputRinci"
                                                value={values.grouping}
                                                // onBlur={handleBlur("grouping")}
                                                // onChange={handleChange("grouping")}
                                                onClick={() => this.listStatus(detailAsset.no_asset)}
                                                >
                                                    <option>{values.grouping}</option>
                                                    {/* <option>-Pilih Status Aset-</option> */}
                                                    {/* {dataStatus.length > 0 && dataStatus.map(item => {
                                                        return (
                                                            <option value={item.status}>{item.status}</option>
                                                        )
                                                    })} */}
                                                </Input>
                                            </Col>
                                        </Row>
                                        {errors.grouping ? (
                                            <text className={style.txtError}>{errors.grouping}</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Keterangan</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled={level === '5' ? false : true}
                                                type= "text" 
                                                className="inputRinci"
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
                                    <ModalFooter>
                                        <Button className="btnFootRinci1 mr-3" size="md" disabled={level === '5' ? false : true} color="primary" onClick={handleSubmit}>Save</Button>
                                        <Button className="btnFootRinci1" size="md" color="secondary" onClick={() => this.openModalEdit()}>Close</Button>
                                    </ModalFooter>
                                </div>
                            )}
                            </Formik>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalEdit} toggle={this.openModalEdit} size="lg">
                    <ModalHeader>
                        Rincian
                    </ModalHeader>
                    <ModalBody>
                        <div className="mainRinci2">
                            <div className="leftRinci2 mb-5">
                                <div className="titRinci">{dataRinci.nama_asset}</div>
                                <img src={detailAsset.pict === undefined || detailAsset.pict.length === 0 ? placeholder : `${REACT_APP_BACKEND_URL}/${detailAsset.pict[detailAsset.pict.length - 1].path}`} className="imgRinci" />
                                <Input type="file" className='mt-2' onChange={this.uploadPicture}>Upload Picture</Input>
                                {/* <div className="secImgSmall">
                                    <button className="btnSmallImg">
                                        <img src={placeholder} className="imgSmallRinci" />
                                    </button>
                                </div> */}
                            </div>
                            <Formik
                            initialValues = {{
                                merk: detailAsset.merk === null ? '' : detailAsset.merk,
                                satuan: detailAsset.satuan === null ? '' : detailAsset.satuan,
                                unit: 1,
                                lokasi: detailAsset.lokasi === null ? '' : detailAsset.lokasi,
                                grouping: detailAsset.grouping === null ? '' : detailAsset.grouping,
                                keterangan: detailAsset.keterangan === null ? '' : detailAsset.keterangan,
                                status_fisik: detailAsset.status_fisik === null ? '' : detailAsset.status_fisik,
                                kondisi: detailAsset.kondisi === null ? '' : detailAsset.kondisi
                            }}
                            validationSchema = {stockSchema}
                            onSubmit={(values) => {this.updateAsset(values)}}
                            >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                                <div className="rightRinci2">
                                    <div>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>No Asset</Col>
                                            <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.no_asset} disabled /></Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Deskripsi</Col>
                                            <Col md={9} className="colRinci">:  <Input className="inputRinci" value={level === '5' ? dataRinci.nama_asset : dataRinci.deskripsi} disabled /></Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Merk</Col>
                                            <Col md={9} className="colRinci">:  <Input
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
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Satuan</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled={level === '5' ? false : true}
                                                type= "select" 
                                                className="inputRinci"
                                                value={values.satuan}
                                                onBlur={handleBlur("satuan")}
                                                onChange={handleChange("satuan")}
                                                >
                                                    <option>{values.satuan}</option>
                                                    <option>-Pilih Satuan-</option>
                                                    <option value="UNIT">UNIT</option>
                                                    <option value="PAKET">PAKET</option>
                                                </Input>
                                            </Col>
                                        </Row>
                                        {errors.satuan ? (
                                            <text className={style.txtError}>{errors.satuan}</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Unit</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled={level === '5' ? false : true}
                                                type= "text" 
                                                className="inputRinci"
                                                value={values.unit}
                                                onBlur={handleBlur("unit")}
                                                onChange={handleChange("unit")}
                                                />
                                            </Col>
                                        </Row>
                                        {errors.unit ? (
                                            <text className={style.txtError}>{errors.unit}</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Lokasi</Col>
                                            <Col md={9} className="colRinci">:
                                            <Input
                                                disabled={level === '5' ? false : true}
                                                type= "text" 
                                                className="inputRinci"
                                                value={values.lokasi}
                                                onBlur={handleBlur("lokasi")}
                                                onChange={handleChange("lokasi")}
                                                />
                                            </Col>
                                        </Row>
                                        {errors.lokasi ? (
                                            <text className={style.txtError}>{errors.lokasi}</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Status Fisik</Col>
                                            <Col md={9} className="colRinci">:  <Input 
                                                disabled={level === '5' ? false : true}
                                                type="select"
                                                className="inputRinci" 
                                                value={detailAsset.fisik} 
                                                onBlur={handleBlur("status_fisik")}
                                                onChange={e => { handleChange("status_fisik"); this.selectStatus(e.target.value, this.state.kondisi)} }
                                                >
                                                    <option>{values.status_fisik}</option>
                                                    <option>-Pilih Status Fisik-</option>
                                                    <option value="ada">Ada</option>
                                                    <option value="tidak ada">Tidak Ada</option>
                                                </Input>
                                            </Col>
                                        </Row>
                                        {errors.status_fisik ? (
                                            <text className={style.txtError}>{errors.status_fisik}</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Kondisi</Col>
                                            <Col md={9} className="colRinci">:  <Input 
                                                disabled={level === '5' ? false : true}
                                                type="select"
                                                className="inputRinci" 
                                                value={values.kondisi} 
                                                onBlur={handleBlur("kondisi")}
                                                onChange={e => { handleChange("kondisi"); this.selectStatus(this.state.fisik, e.target.value)} }
                                                >
                                                    <option>{values.kondisi}</option>
                                                    <option>-Pilih Kondisi-</option>
                                                    <option value="baik">Baik</option>
                                                    <option value="rusak">Rusak</option>
                                                    <option value="">-</option>
                                                </Input>
                                            </Col>
                                        </Row>
                                        {errors.kondisi ? (
                                            <text className={style.txtError}>{errors.kondisi}</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Status Aset</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled={level === '5' ? false : true}
                                                type= "select" 
                                                className="inputRinci"
                                                value={values.grouping}
                                                // onBlur={handleBlur("grouping")}
                                                // onChange={handleChange("grouping")}
                                                onClick={() => this.listStatus(detailAsset.no_asset)}
                                                >
                                                    <option>{values.grouping}</option>
                                                    {/* <option>-Pilih Status Aset-</option> */}
                                                    {/* {dataStatus.length > 0 && dataStatus.map(item => {
                                                        return (
                                                            <option value={item.status}>{item.status}</option>
                                                        )
                                                    })} */}
                                                </Input>
                                            </Col>
                                        </Row>
                                        {errors.grouping ? (
                                            <text className={style.txtError}>{errors.grouping}</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Keterangan</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled={level === '5' ? false : true}
                                                type= "text" 
                                                className="inputRinci"
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
                                    <ModalFooter>
                                        <Button className="btnFootRinci1 mr-3" size="md" disabled={level === '5' ? false : true} color="primary" onClick={handleSubmit}>Save</Button>
                                        <Button className="btnFootRinci1" size="md" color="secondary" onClick={() => this.openModalEdit()}>Close</Button>
                                    </ModalFooter>
                                </div>
                            )}
                            </Formik>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalStock} toggle={this.openModalStock} size="lg">
                    <ModalHeader>
                        Rincian
                    </ModalHeader>
                    <ModalBody>
                        <div className="mainRinci2">
                            <div className="leftRinci2 mb-5">
                                <div className="titRinci">{dataRinci.nama_asset}</div>
                                <img src={detRinci.pict === undefined || detRinci.pict.length === 0 ? placeholder : `${REACT_APP_BACKEND_URL}/${detRinci.pict[detRinci.pict.length - 1].path}`} className="imgRinci" />
                                {/* <Input type="file" className='mt-2' onChange={this.uploadPicture}>Upload Picture</Input> */}
                                {/* <div className="secImgSmall">
                                    <button className="btnSmallImg">
                                        <img src={placeholder} className="imgSmallRinci" />
                                    </button>
                                </div> */}
                            </div>
                            <Formik
                            initialValues = {{
                                merk: detRinci.merk === null ? '' : detRinci.merk,
                                satuan: detRinci.satuan === null ? '' : detRinci.satuan,
                                unit: 1,
                                lokasi: detRinci.lokasi === null ? '' : detRinci.lokasi,
                                grouping: detRinci.grouping === null ? '' : detRinci.grouping,
                                keterangan: detRinci.keterangan === null ? '' : detRinci.keterangan,
                                status_fisik: detRinci.status_fisik === null ? '' : detRinci.status_fisik,
                                kondisi: detRinci.kondisi === null ? '' : detRinci.kondisi
                            }}
                            validationSchema = {stockSchema}
                            onSubmit={(values) => {this.updateAsset(values)}}
                            >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                                <div className="rightRinci2">
                                    <div>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>No Asset</Col>
                                            <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.no_asset} disabled /></Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Deskripsi</Col>
                                            <Col md={9} className="colRinci">:  <Input className="inputRinci" value={level === '5' ? dataRinci.nama_asset : dataRinci.deskripsi} disabled /></Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Merk</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled={level === '5' ? false : true}
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
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Satuan</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled={level === '5' ? false : true}
                                                type= "select" 
                                                className="inputRinci"
                                                value={values.satuan}
                                                onBlur={handleBlur("satuan")}
                                                onChange={handleChange("satuan")}
                                                >
                                                    <option>{values.satuan}</option>
                                                    <option>-Pilih Satuan-</option>
                                                    <option value="UNIT">UNIT</option>
                                                    <option value="PAKET">PAKET</option>
                                                </Input>
                                            </Col>
                                        </Row>
                                        {errors.satuan ? (
                                            <text className={style.txtError}>{errors.satuan}</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Unit</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled={level === '5' ? false : true}
                                                type= "text" 
                                                className="inputRinci"
                                                value={values.unit}
                                                onBlur={handleBlur("unit")}
                                                onChange={handleChange("unit")}
                                                />
                                            </Col>
                                        </Row>
                                        {errors.unit ? (
                                            <text className={style.txtError}>{errors.unit}</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Lokasi</Col>
                                            <Col md={9} className="colRinci">:
                                            <Input
                                                disabled={level === '5' ? false : true}
                                                type= "text" 
                                                className="inputRinci"
                                                value={values.lokasi}
                                                onBlur={handleBlur("lokasi")}
                                                onChange={handleChange("lokasi")}
                                                />
                                            </Col>
                                        </Row>
                                        {errors.lokasi ? (
                                            <text className={style.txtError}>{errors.lokasi}</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Status Fisik</Col>
                                            <Col md={9} className="colRinci">:  <Input 
                                                disabled={level === '5' ? false : true}
                                                type="select"
                                                className="inputRinci" 
                                                value={detRinci.fisik} 
                                                onBlur={handleBlur("status_fisik")}
                                                onChange={e => { handleChange("status_fisik"); this.selectStatus(e.target.value, this.state.kondisi)} }
                                                >
                                                    <option>{values.status_fisik}</option>
                                                    <option>-Pilih Status Fisik-</option>
                                                    <option value="ada">Ada</option>
                                                    <option value="tidak ada">Tidak Ada</option>
                                                </Input>
                                            </Col>
                                        </Row>
                                        {errors.status_fisik ? (
                                            <text className={style.txtError}>{errors.status_fisik}</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Kondisi</Col>
                                            <Col md={9} className="colRinci">:  <Input 
                                                disabled={level === '5' ? false : true}
                                                type="select"
                                                className="inputRinci" 
                                                value={values.kondisi} 
                                                onBlur={handleBlur("kondisi")}
                                                onChange={e => { handleChange("kondisi"); this.selectStatus(this.state.fisik, e.target.value)} }
                                                >
                                                    <option>{values.kondisi}</option>
                                                    <option>-Pilih Kondisi-</option>
                                                    <option value="baik">Baik</option>
                                                    <option value="rusak">Rusak</option>
                                                    <option value="">-</option>
                                                </Input>
                                            </Col>
                                        </Row>
                                        {errors.kondisi ? (
                                            <text className={style.txtError}>{errors.kondisi}</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Status Aset</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled={level === '5' ? false : true}
                                                type= "select" 
                                                className="inputRinci"
                                                value={values.grouping}
                                                // onBlur={handleBlur("grouping")}
                                                // onChange={handleChange("grouping")}
                                                onClick={() => this.listStatus(detRinci.no_asset)}
                                                >
                                                    <option>{values.grouping}</option>
                                                    {/* <option>-Pilih Status Aset-</option> */}
                                                    {/* {dataStatus.length > 0 && dataStatus.map(item => {
                                                        return (
                                                            <option value={item.status}>{item.status}</option>
                                                        )
                                                    })} */}
                                                </Input>
                                            </Col>
                                        </Row>
                                        {errors.grouping ? (
                                            <text className={style.txtError}>{errors.grouping}</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Keterangan</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                disabled={level === '5' ? false : true}
                                                type= "text" 
                                                className="inputRinci"
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
                                    <ModalFooter>
                                        {detRinci.grouping === 'DIPINJAM SEMENTARA' ? (
                                            <Button className="btnFootRinci1 mr-3" color='success' size="md" onClick={this.openProsesModalDoc}>Dokumen</Button>
                                        ) : (
                                            <div></div>
                                        )}
                                        <Button className="btnFootRinci1 mr-3" size="md" disabled={level === '5' ? false : true} color="primary" onClick={handleSubmit}>Save</Button>
                                        <Button className="btnFootRinci1" size="md" color="secondary" onClick={() => this.openModalStock()}>Close</Button>
                                    </ModalFooter>
                                </div>
                            )}
                            </Formik>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalRinci} toggle={this.openModalRinci} size="xl">
                    <ModalBody>
                        <div>
                            <div className="stockTitle">kertas kerja opname aset kantor</div>
                            <div className="ptStock">pt. pinus merah abadi</div>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>kantor pusat/cabang</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={detailStock.length > 0 ? detailStock[0].area : ''} className="ml-3"  /></Col>
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>depo/cp</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={detailStock.length > 0 ? detailStock[0].area : ''} className="ml-3" /></Col>
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>opname per tanggal</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled className="ml-3" value={detailStock.length > 0 ? moment(detailStock[0].tanggalStock).format('DD MMMM YYYY') : ''} /></Col>
                            </Row>
                        </div>
                        {this.props.asset.stockDetail === false ? (
                            <div className={style.tableDashboard}>
                                <Table bordered responsive hover className={style.tab}>
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>NO. ASET</th>
                                            <th>DESKRIPSI</th>
                                            <th>MERK</th>
                                            <th>SATUAN</th>
                                            <th>UNIT</th>
                                            <th>KONDISI</th>
                                            <th>LOKASI</th>
                                            <th>GROUPING</th>
                                            <th>KETERANGAN</th>
                                        </tr>
                                    </thead>
                                </Table>
                                <div className={style.spin}>
                                        <Spinner type="grow" color="primary"/>
                                        <Spinner type="grow" className="mr-3 ml-3" color="success"/>
                                        <Spinner type="grow" color="warning"/>
                                        <Spinner type="grow" className="mr-3 ml-3" color="danger"/>
                                        <Spinner type="grow" color="info"/>
                                </div>
                            </div>
                        ) : (
                            <div className={style.tableDashboard}>
                            <Table bordered responsive hover className={style.tab}>
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>NO. ASET</th>
                                        <th>DESKRIPSI</th>
                                        <th>MERK</th>
                                        <th>SATUAN</th>
                                        <th>UNIT</th>
                                        <th>STATUS FISIK</th>
                                        <th>KONDISI</th>
                                        <th>LOKASI</th>
                                        <th>GROUPING</th>
                                        <th>KETERANGAN</th>
                                        <th>Select item to reject</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detailStock.length !== 0 && detailStock.map(item => {
                                        return (
                                        <tr>
                                            <th onClick={() => this.getRinciStock(item)} scope="row">{(detailStock.indexOf(item) + (((page.currentPage - 1) * page.limitPerPage) + 1))}</th>
                                            <td onClick={() => this.getRinciStock(item)} >{item.no_asset}</td>
                                            <td onClick={() => this.getRinciStock(item)} >{item.deskripsi}</td>
                                            <td onClick={() => this.getRinciStock(item)} >{item.merk}</td>
                                            <td onClick={() => this.getRinciStock(item)} >{item.satuan}</td>
                                            <td onClick={() => this.getRinciStock(item)} >{item.unit}</td>
                                            <td onClick={() => this.getRinciStock(item)} >{item.status_fisik}</td>
                                            <td onClick={() => this.getRinciStock(item)} >{item.kondisi}</td>
                                            <td onClick={() => this.getRinciStock(item)} >{item.lokasi}</td>
                                            <td onClick={() => this.getRinciStock(item)} >{item.grouping}</td>
                                            <td onClick={() => this.getRinciStock(item)} >{item.keterangan}</td>
                                            <td> 
                                                <Input
                                                addon
                                                disabled={item.status_app === 0 ? true : false}
                                                checked={item.status_app === 0 ? true : listMut.find(element => element === item.no_asset) !== undefined ? true : false}
                                                type="checkbox"
                                                onClick={listMut.find(element => element === item.no_asset) === undefined ? () => this.chekRej(item.no_asset) : () => this.chekApp(item.no_asset)}
                                                value={item.no_asset} />
                                            </td>
                                            <td>{item.status_app === 0 ? 'reject' : item.status_app === 1 ? 'revisi' : '-'}</td>
                                        </tr>
                                        )})}
                                </tbody>
                            </Table>
                        </div>
                        )}
                    </ModalBody>
                    <div className="modalFoot ml-3">
                        <Button color="primary"  onClick={() => this.openPreview(dataItem.no_stock)}>Preview</Button>
                        <div className="btnFoot">
                            <Button className="mr-2" disabled={listMut.length === 0 ? true : false} color="danger" onClick={this.openModalReject}>
                                Reject
                            </Button>
                            <Button color="success" disabled={detailStock.find(({status_app}) => status_app === 0) !== undefined ? true : listMut.length === 0 ? false : true} onClick={this.openModalApprove}>
                                Approve
                            </Button>
                        </div>
                    </div>
                </Modal>
                <Modal isOpen={this.state.modalPreview} toggle={this.openModalPreview} size="xl">
                    <ModalHeader>
                        Preview
                    </ModalHeader>
                    <ModalBody>
                        <div>
                            <div className="stockTitle">kertas kerja opname aset kantor</div>
                            <div className="ptStock">pt. pinus merah abadi</div>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>kantor pusat/cabang</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={detailStock.length > 0 ? detailStock[0].area : ''} className="ml-3"  /></Col>
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>depo/cp</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled value={detailStock.length > 0 ? detailStock[0].area : ''} className="ml-3" /></Col>
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>opname per tanggal</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input disabled className="ml-3" value={detailStock.length > 0 ? moment(detailStock[0].tanggalStock).format('DD MMMM YYYY') : ''} /></Col>
                            </Row>
                        </div>
                        {this.props.asset.stockDetail === false ? (
                            <div className={style.tableDashboard}>
                                <Table bordered responsive hover className={style.tab}>
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>NO. ASET</th>
                                            <th>DESKRIPSI</th>
                                            <th>MERK</th>
                                            <th>SATUAN</th>
                                            <th>UNIT</th>
                                            <th>KONDISI</th>
                                            <th>LOKASI</th>
                                            <th>GROUPING</th>
                                            <th>KETERANGAN</th>
                                        </tr>
                                    </thead>
                                </Table>
                                <div className={style.spin}>
                                        <Spinner type="grow" color="primary"/>
                                        <Spinner type="grow" className="mr-3 ml-3" color="success"/>
                                        <Spinner type="grow" color="warning"/>
                                        <Spinner type="grow" className="mr-3 ml-3" color="danger"/>
                                        <Spinner type="grow" color="info"/>
                                </div>
                            </div>
                        ) : (
                            <div className={style.tableDashboard}>
                            <Table bordered responsive hover className={style.tab}>
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>NO. ASET</th>
                                        <th>DESKRIPSI</th>
                                        <th>MERK</th>
                                        <th>SATUAN</th>
                                        <th>UNIT</th>
                                        <th>KONDISI</th>
                                        <th>LOKASI</th>
                                        <th>GROUPING</th>
                                        <th>KETERANGAN</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detailStock.length !== 0 && detailStock.map(item => {
                                        return (
                                        <tr onClick={() => this.getRincian(item)}>
                                            <th scope="row">{(detailStock.indexOf(item) + (((page.currentPage - 1) * page.limitPerPage) + 1))}</th>
                                            <td>{item.no_asset}</td>
                                            <td>{item.deskripsi}</td>
                                            <td>{item.merk}</td>
                                            <td>{item.satuan}</td>
                                            <td>{item.unit}</td>
                                            <td>{item.kondisi}</td>
                                            <td>{item.lokasi}</td>
                                            <td>{item.grouping}</td>
                                            <td>{item.keterangan}</td>
                                        </tr>
                                        )})}
                                </tbody>
                            </Table>
                        </div>
                        )}
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
                                                    {stockApp.pembuat !== undefined && stockApp.pembuat.map(item => {
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
                                                {stockApp.pembuat !== undefined && stockApp.pembuat.map(item => {
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
                                                    {stockApp.pemeriksa !== undefined && stockApp.pemeriksa.map(item => {
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
                                                    {stockApp.pemeriksa !== undefined && stockApp.pemeriksa.map(item => {
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
                                                    {stockApp.penyetuju !== undefined && stockApp.penyetuju.map(item => {
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
                                                    {stockApp.penyetuju !== undefined && stockApp.penyetuju.map(item => {
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
                        <div></div>
                        <div className="btnFoot">
                            <Button className="mr-2" color="warning" onClick={this.openModalPreview}>
                                Print
                            </Button>
                            <Button color="success" onClick={this.openModalPreview}>
                                Close
                            </Button>
                        </div>
                    </div>
                </Modal>
                <Modal isOpen={this.state.openReject} toggle={this.openModalReject} centered={true}>
                    <ModalBody>
                    <Formik
                    initialValues={{
                    alasan: "",
                    }}
                    validationSchema={alasanSchema}
                    onSubmit={(values) => {this.rejectStock(values)}}
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
                                name="Input" 
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
                <Modal isOpen={this.props.stock.isLoading || this.props.depo.isLoading || this.props.asset.isLoading ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className={style.cekUpdate}>
                                <Spinner />
                                <div sucUpdate>Waiting....</div>
                            </div>
                        </div>
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
                                <Button color="primary" onClick={() => this.approveStock()}>Ya</Button>
                                <Button color="secondary" onClick={this.openModalApprove}>Tidak</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.submitPre} toggle={this.modalSubmitPre} size="xl">
                    <ModalHeader>
                        Rincian
                    </ModalHeader>
                    <ModalBody>
                        <div>
                            <div className="stockTitle">kertas kerja opname aset kantor</div>
                            <div className="ptStock">pt. pinus merah abadi</div>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>kantor pusat/cabang</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input value={dataAsset.length > 0 ? dataAsset[0].area : ''} className="ml-3"  /></Col>
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>depo/cp</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input value={dataAsset.length > 0 ? dataAsset[0].area : ''} className="ml-3" /></Col>
                            </Row>
                            <Row className="ptStock inputStock">
                                <Col md={3} xl={3} sm={3}>opname per tanggal</Col>
                                <Col md={4} xl={4} sm={4} className="inputStock">:<Input value={moment().format('LL')} className="ml-3"  /></Col>
                            </Row>
                        </div>
                        {dataAsset.length === 0 ? (
                            <div className={style.tableDashboard}>
                                <Table bordered responsive hover className={style.tab}>
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>NO. ASET</th>
                                            <th>DESKRIPSI</th>
                                            <th>MERK</th>
                                            <th>SATUAN</th>
                                            <th>UNIT</th>
                                            <th>KONDISI</th>
                                            <th>LOKASI</th>
                                            <th>GROUPING</th>
                                            <th>KETERANGAN</th>
                                        </tr>
                                    </thead>
                                </Table>
                                <div className={style.spin}>
                                        <Spinner type="grow" color="primary"/>
                                        <Spinner type="grow" className="mr-3 ml-3" color="success"/>
                                        <Spinner type="grow" color="warning"/>
                                        <Spinner type="grow" className="mr-3 ml-3" color="danger"/>
                                        <Spinner type="grow" color="info"/>
                                </div>
                            </div>
                        ) : (
                            <div className={style.tableDashboard}>
                            <Table bordered responsive hover className={style.tab}>
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>NO. ASET</th>
                                        <th>DESKRIPSI</th>
                                        <th>MERK</th>
                                        <th>SATUAN</th>
                                        <th>UNIT</th>
                                        <th>KONDISI</th>
                                        <th>LOKASI</th>
                                        <th>GROUPING</th>
                                        <th>KETERANGAN</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataAsset.length !== 0 && dataAsset.map(item => {
                                        return (
                                        <tr onClick={() => this.getRincian(item)}>
                                            <th scope="row">{(dataAsset.indexOf(item) + (((page.currentPage - 1) * page.limitPerPage) + 1))}</th>
                                            <td>{item.no_asset}</td>
                                            <td>{item.deskripsi}</td>
                                            <td>{item.merk}</td>
                                            <td>{item.satuan}</td>
                                            <td>{item.unit}</td>
                                            <td>{item.kondisi}</td>
                                            <td>{item.lokasi}</td>
                                            <td>{item.grouping}</td>
                                            <td>{item.keterangan}</td>
                                        </tr>
                                        )})}
                                </tbody>
                            </Table>
                        </div>
                        )}
                    </ModalBody>
                    <Alert color="danger" className={style.alertWrong} isOpen={this.state.alert}>
                        <div>{alertM}</div>
                    </Alert>
                    <div className="modalFoot ml-3">
                        <div></div>
                        <div className="btnFoot">
                            <Button className="mr-2" color="success" onClick={this.submitStock}>
                                Submit
                            </Button>
                        </div>
                    </div>
                </Modal>
                <Modal isOpen={this.state.openStatus} toggle={this.modalStatus}>
                    <Alert color="danger" className={style.alertWrong} isOpen={this.state.stat === 'DIPINJAM SEMENTARA' && (dataDoc.length === 0 || dataDoc.find(({status}) => status === 1) === undefined) ? true : false}>
                        <div>Mohon upload dokumen terlebih dahulu</div>
                    </Alert>
                    <ModalBody>
                        <div className='mb-2 titStatus'>Pilih Status Aset</div>
                        {dataStatus.length > 0 ? dataStatus.map(item => {
                            return (
                                <div className="ml-2">
                                    <Input
                                    addon
                                    // disabled={listMut.find(element => element === dataRinci.no_asset) === undefined ? false : true}
                                    type="checkbox"
                                    checked= {this.state.stat === item.status ? true : false}
                                    onClick={() => {this.setState({stat: item.status}); this.cekStatus(item.status)}}
                                    value={item.status} />  {item.status}
                                </div>
                            )
                        }) : (
                            <div>Tidak ada opsi status asset mohon pilih ulang kondisi asset atau status fisik asset</div>
                        )}
                        {/* <div className="footRinci4 mt-4">
                            <Button color="primary" disabled={this.state.stat === '' || this.state.stat === null ? true : false} onClick={this.updateStatus}>Save</Button>
                            <Button className="ml-3" color="secondary" onClick={() => this.modalStatus()}>Close</Button>
                        </div> */}
                        <div className="modalFoot mt-3">
                            <div className="btnFoot">
                            {this.state.stat === 'DIPINJAM SEMENTARA' ? (
                                <Button color='success' onClick={this.openProsesModalDoc}>Upload dokumen</Button>
                            ) : (
                                <div></div>
                            )}
                            </div>
                            <div className="btnFoot">
                                {this.state.stat === 'DIPINJAM SEMENTARA' && (dataDoc.length === 0 || dataDoc.find(({status}) => status === 1) === undefined) ? (
                                    <Button color="primary" disabled>Save</Button>
                                ) : (
                                    <Button color="primary" disabled={this.state.stat === '' || this.state.stat === null ? true : false} onClick={this.updateStatus}>Save</Button>
                                )}
                                <Button className="ml-3" color="secondary" onClick={() => this.modalStatus()}>Close</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalConfirm} toggle={this.openConfirm}>
                <ModalBody>
                    {this.state.confirm === 'approve' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Update</div>
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
                    ) : this.state.confirm === 'isApprove' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Approve</div>
                            </div>
                        </div>
                    ) : (
                        <div></div>
                    )}
                </ModalBody>
            </Modal>
            <Modal size="xl" isOpen={this.state.modalDoc} toggle={this.openModalDoc}>
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
                    <Button className="mr-2" color="secondary" onClick={this.openModalDoc}>
                            Close
                        </Button>
                        <Button color="primary" onClick={this.openModalDoc}>
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
                        <Button color="primary" onClick={() => this.setState({openPdf: false})}>Close</Button>
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
    stock: state.stock
})

const mapDispatchToProps = {
    logout: auth.logout,
    getAsset: asset.getAsset,
    getAssetAll: asset.getAssetAll,
    updateAsset: asset.updateAsset,
    updateAssetNew: asset.updateAssetNew,
    resetError: asset.resetError,
    nextPage: asset.nextPage,
    getDisposal: disposal.getDisposal,
    uploadDocumentDis: disposal.uploadDocumentDis,
    getNameApprove: approve.getNameApprove,
    getDetailDepo: depo.getDetailDepo,
    getDepo: depo.getDepo,
    submitStock: stock.submitStock,
    getStockAll: stock.getStockAll,
    getDetailStock: stock.getDetailStock,
    getApproveStock: stock.getApproveStock,
    deleteStock: stock.deleteStock,
    approveStock: stock.approveStock,
    rejectStock: stock.rejectStock,
    uploadPicture: stock.uploadPicture,
    getStatus: stock.getStatus,
    getStatusAll: stock.getStatusAll,
    resetStock: stock.resetStock,
    getDetailAsset: asset.getDetailAsset,
    getDocument: stock.getDocumentStock,
    cekDokumen: stock.cekDocumentStock,
    resetDis: disposal.reset,
    resetData: asset.resetData,
    updateStock: stock.updateStock,
    updateStockNew: stock.updateStockNew,
    getDetailItem: stock.getDetailItem,
    showDokumen: pengadaan.showDokumen,
}

export default connect(mapStateToProps, mapDispatchToProps)(Stock)
