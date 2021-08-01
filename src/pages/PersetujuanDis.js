/* eslint-disable jsx-a11y/no-distracting-elements */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react'
import { Container, Collapse, Nav, Navbar,
    NavbarToggler, NavbarBrand, NavItem, NavLink,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, Dropdown,
    DropdownItem, Table, ButtonDropdown, Input, Button, Col,
    Alert, Spinner, Row} from 'reactstrap'
import logo from "../assets/img/logo.png"
import style from '../assets/css/input.module.css'
import {Modal} from 'react-bootstrap'
import {FaSearch, FaUserCircle, FaBars, FaCartPlus} from 'react-icons/fa'
import {BsCircle, BsDashCircleFill, BsFillCircleFill} from 'react-icons/bs'
import { AiOutlineCheck, AiOutlineClose} from 'react-icons/ai'
import {Formik} from 'formik'
import * as Yup from 'yup'
import Pdf from "../components/Pdf"
import asset from '../redux/actions/asset'
import pengadaan from '../redux/actions/pengadaan'
import approve from '../redux/actions/approve'
import {connect} from 'react-redux'
import moment from 'moment'
import auth from '../redux/actions/auth'
import setuju from '../redux/actions/setuju'
import {default as axios} from 'axios'
import Sidebar from "../components/Header";
import MaterialTitlePanel from "../components/material_title_panel";
import SidebarContent from "../components/sidebar_content";
import placeholder from  "../assets/img/placeholder.png"
import disposal from '../redux/actions/disposal'
import a from "../assets/img/a.jpg"
import b from "../assets/img/b.jpg"
import c from "../assets/img/c.jpg"
import d from "../assets/img/d.jpg"
import e from "../assets/img/e.jpg"
import f from "../assets/img/f.png"
import g from "../assets/img/g.png"
const {REACT_APP_BACKEND_URL} = process.env

const disposalSchema = Yup.object().shape({
    merk: Yup.string().validateSync(""),
    keterangan: Yup.string().required('must be filled'),
    nilai_jual: Yup.string().required()
})

const alasanSchema = Yup.object().shape({
    alasan: Yup.string().required()
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
            openApproveDis: false,
            openRejectDis: false,
            fileName: {},
            dataApp: {}
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
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
        this.setState({openModalDoc: !this.state.openModalDoc})
        this.setState({formDis: !this.state.formDis})
    }

    openModalApproveDis = () => {
        this.setState({openApproveDis: !this.state.openApproveDis})
    }
    openModalRejectDis = () => {
        this.setState({openRejectDis: !this.state.openRejectDis})
    }

    openModalReject = () => {
        this.setState({openReject: !this.state.openReject})
        this.openModalDis()
    }

    openModalApprove = () => {
        this.setState({openApprove: !this.state.openApprove})
        this.openModalDis()
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

    openProsesModalDoc = async () => {
        const token = localStorage.getItem('token')
        const { dataRinci } = this.state
        await this.props.getDocumentDis(token, dataRinci.no_asset)
        this.closeProsesModalDoc()
        this.openRinciAdmin()
    }


    approveDisposal = async (value) => {
        const token = localStorage.getItem('token')
        await this.props.approveDisposal(token, value)
        this.getDataDisposal()
    }

    rejectDisposal = async (value) => {
        const token = localStorage.getItem('token')
        await this.props.rejectDisposal(token, value.no, value.value)
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

    getDetailDisposal = async (value) => {
        const { dataDis } = this.props.disposal
        const detail = []
        for (let i = 0; i < dataDis.length; i++) {
            if (dataDis[i].status_app === value) {
                detail.push(dataDis[i])
            }
        }
        this.setState({detailDis: detail})
        this.openModalDis()
    }

    toggle = () => {
        this.setState({isOpen: !this.state.isOpen})
    }

    openConfirm = () => {
        this.setState({modalConfirm: !this.state.modalConfirm})
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
        this.setState({openModalDoc: !this.state.openModalDoc})
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

    goFormSet = async (val) => {
        const token = localStorage.getItem('token')
        await this.props.getSetDisposal(token, 100, "", 1, val, 'persetujuan')
        this.props.history.push('/formset')
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
        const {isAdd, isDelete, isAppDoc, isRejDoc} = this.props.disposal
        const token = localStorage.getItem('token')
        const { dataRinci } = this.state
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
            setTimeout(() => {
                this.props.resetDis()
             }, 1000)
             setTimeout(() => {
                this.props.getDocumentDis(token, dataRinci.no_asset)
             }, 1100)
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

    componentDidMount() {
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
        const { page } = this.props.disposal
        const search = value === undefined ? '' : this.state.search
        const limit = value === undefined ? this.state.limit : value.limit
        await this.props.getDisposal(token, limit, search, page.currentPage, 3, 'persetujuan')
        this.setState({limit: value === undefined ? 12 : value.limit})
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

    deleteDisposal = async (value) => {
        const token = localStorage.getItem("token")
    }

    render() {
        const {isOpen, dropOpen, dropApp, dropOpenNum, detail, alert, upload, errMsg, detailDis} = this.state
        const {dataAsset, alertM, alertMsg, alertUpload, page} = this.props.asset
        const pages = this.props.disposal.page 
        const { dataDis, noDis, dataDoc, disApp } = this.props.disposal
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
                            <Alert color="danger" className={style.alertWrong} isOpen={alert}>
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
                            </Alert>
                            <div className={style.bodyDashboard}>
                                <div className={style.headMaster}> 
                                    <div className={style.titleDashboard}>Persetujuan Disposal Asset</div>
                                </div>
                                <div className={style.secEmail}>
                                    {level === '5' ? (
                                        <div className={style.headEmail}>
                                            {/* <Button color="success" size="lg" onClick={this.openModalDis}>Open Form</Button> */}
                                            <button onClick={this.goCartDispos} className="btnGoCart"><FaCartPlus size={60} className="green ml-2" /></button>
                                        </div>
                                    ) : (
                                        <div className={style.secHeadDashboard}>
                                            <div>
                                                <text>Show: </text>
                                                <ButtonDropdown className={style.drop} isOpen={dropOpen} toggle={this.dropDown}>
                                                <DropdownToggle caret color="light">
                                                    {this.state.limit}
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                <DropdownItem className={style.item} onClick={() => this.getDataAsset({limit: 10, search: ''})}>10</DropdownItem>
                                                    <DropdownItem className={style.item} onClick={() => this.getDataAsset({limit: 20, search: ''})}>20</DropdownItem>
                                                    <DropdownItem className={style.item} onClick={() => this.getDataAsset({limit: 50, search: ''})}>50</DropdownItem>
                                                </DropdownMenu>
                                                </ButtonDropdown>
                                                <text className={style.textEntries}>entries</text>
                                            </div>
                                        </div>
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
                                    {this.props.disposal.isGet === false ? (
                                        <div></div>
                                    ) : (
                                        <Row className="bodyDispos">
                                        {noDis.length !== 0 && noDis.map(x => {
                                            return (
                                                <div className="bodyCard">
                                                    <img src={dataDis.find(({status_app}) => status_app === x).no_asset === '4100000150' ? b : dataDis.find(({status_app}) => status_app === x).no_asset === '4300001770' ? e : placeholder} className="imgCard" />
                                                    
                                                    {dataDis.find(({status_app}) => status_app === x).nilai_jual === '0' ? 
                                                     (
                                                        <Button size="sm" color="success" className="labelBut">Pemusnahan</Button>
                                                     ) : (
                                                         <div></div>
                                                     )}
                                                     {dataDis.find(({status_app}) => status_app === x).nilai_jual !== '0' ?
                                                     (
                                                        <Button size="sm" color="warning" className="labelBut">Penjualan</Button>
                                                     ) : (
                                                         <div></div>
                                                     )}
                                                    {/* <button className="btnDispos" onClick={() => this.openModalRinci(this.setState({dataRinci: item}))}></button> */}
                                                    <div className="btnDispos ml-2">
                                                        <div className="txtDoc mb-2">
                                                            Pengajuan Disposal Asset
                                                        </div>
                                                        <Row className="mb-2">
                                                            <Col md={6} className="txtDoc">
                                                            Kode Plant
                                                            </Col>
                                                            <Col md={6} className="txtDoc">
                                                            : {dataDis.find(({status_app}) => status_app === x).kode_plant}
                                                            </Col>
                                                        </Row>
                                                        <Row className="mb-2">
                                                            <Col md={6} className="txtDoc">
                                                        2    Area
                                                            </Col>
                                                            <Col md={6} className="txtDoc">
                                                            : {dataDis.find(({status_app}) => status_app === x).area}
                                                            </Col>
                                                        </Row>
                                                        <Row className="mb-2">
                                                            <Col md={6} className="txtDoc">
                                                            No Disposal
                                                            </Col>
                                                            <Col md={6} className="txtDoc">
                                                            : D{dataDis.find(({status_app}) => status_app === x).status_app}
                                                            </Col>
                                                        </Row>
                                                        <Row className="mb-2">
                                                            <Col md={6} className="txtDoc">
                                                            Status Approval
                                                            </Col>
                                                            {dataDis.find(({status_app}) => status_app === x).appForm.find(({status}) => status === 0) !== undefined ? (
                                                                <Col md={6} className="txtDoc">
                                                                : Reject {dataDis.find(({status_app}) => status_app === x).appForm.find(({status}) => status === 0).jabatan}
                                                                </Col>
                                                            ) : dataDis.find(({status_app}) => status_app === x).appForm.find(({status}) => status === 1) !== undefined ? (
                                                                <Col md={6} className="txtDoc">
                                                                : Approve {dataDis.find(({status_app}) => status_app === x).appForm.find(({status}) => status === 1).jabatan}
                                                                </Col>
                                                            ) : (
                                                                <Col md={6} className="txtDoc">
                                                                : -
                                                                </Col>
                                                            )}
                                                            
                                                        </Row>
                                                    </div>
                                                    <Row className="footCard mb-3 mt-3">
                                                        <Col md={12} xl={12}>
                                                            <Button className="btnSell" color="primary" onClick={() => this.goFormSet(x)}>Proses</Button>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            )
                                        })}
                                        </Row>
                                    )}
                                <div>
                                    <div className={style.infoPageEmail}>
                                        <text>Showing {level === '5' ? page.currentPage : pages.currentPage} of {level === '5' ? page.pages : pages.pages} pages</text>
                                        <div className={style.pageButton}>
                                            {level === '5' ? (
                                                <button className={style.btnPrev} color="info" disabled={page.prevLink === null ? true : false} onClick={this.prev}>Prev</button>
                                            ) : (
                                                <button className={style.btnPrev} color="info" disabled={pages.prevLink === null ? true : false} onClick={this.prev}>Prev</button>
                                            )}
                                            {level === '5' ? (
                                                <button className={style.btnPrev} color="info" disabled={page.nextLink === null ? true : false} onClick={this.next}>Next</button>
                                            ) : (
                                                <button className={style.btnPrev} color="info" disabled={pages.nextLink === null ? true : false} onClick={this.next}>Next</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </MaterialTitlePanel>
                </Sidebar>
                <Modal show={this.props.asset.isLoading ? true: false} size="sm">
                        <Modal.Body>
                        <div>
                            <div className={style.cekUpdate}>
                                <Spinner />
                                <div sucUpdate>Waiting....</div>
                            </div>
                        </div>
                        </Modal.Body>
                </Modal>
                <Modal show={this.props.disposal.isAdd ? true: false} size="sm">
                        <Modal.Body>
                        <div>
                            <div className={style.cekUpdate}>
                                <div sucUpdate>Berhasil menambahkan item disposal</div>
                            </div>
                        </div>
                        </Modal.Body>
                </Modal>
                <Modal show={this.state.formDis} onHide={this.openModalDis} size="xl">
                    <Modal.Body>
                        <div className="preDis">
                            <text>PT. Pinus Merah Abadi</text>
                            <text></text>
                        </div>
                        <div className="modalDis">
                            <text className="titleModDis">Form Pengajuan Disposal Asset</text>
                        </div>
                        <div className="mb-2"><text className="txtTrans">{detailDis[0] !== undefined && detailDis[0].area}</text>, {moment(detailDis[0] !== undefined && detailDis[0].createdAt).locale('idn').format('DD MMMM YYYY ')}</div>
                        <Row>
                            <Col md={2}>
                            Hal
                            </Col>
                            <Col md={10}>
                            : Pengajuan Disposal Asset
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col md={2}>
                            {detailDis[0] === undefined ? "" :
                            detailDis[0].status_depo === "Cabang Scylla" || detailDis.status_depo === "Cabang SAP" ? "Cabang" : "Depo"}
                            </Col>
                            <Col md={10} className="txtTrans">
                            : {detailDis[0] !== undefined && detailDis[0].area}
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
                                    <th>No</th>
                                    <th>Nomor Asset</th>
                                    <th>Nama Barang</th>
                                    <th>Merk/Type</th>
                                    <th>Kategori</th>
                                    <th>Status Depo</th>
                                    <th>Cost Center</th>
                                    <th>Nilai Buku</th>
                                    <th>Nilai Jual</th>
                                    <th>Keterangan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detailDis.length !== 0 && detailDis.map(item => {
                                    return (
                                        <tr onClick={() => this.openRinciAdmin(this.setState({dataRinci: item}))}>
                                            <th scope="row">{detailDis.indexOf(item) + 1}</th>
                                            <td>{item.no_asset}</td>
                                            <td>{item.nama_asset}</td>
                                            <td>{item.merk}</td>
                                            <td>{item.kategori}</td>
                                            <td>{item.status_depo}</td>
                                            <td>{item.cost_center}</td>
                                            <td>{item.nilai_buku}</td>
                                            <td>{item.nilai_jual}</td>
                                            <td>{item.keterangan}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                        <div className="mb-3">Demikianlah hal yang kami sampaikan, atas perhatiannya kami mengucapkan terima kasih</div>
                    </Modal.Body>
                    <hr />
                    <div className="modalFoot ml-3">
                        {level === '1' ? (
                            <div>
                                <text>Pilih Approval: </text>
                                <ButtonDropdown className={style.drop} isOpen={dropApp} toggle={this.dropApp}>
                                <DropdownToggle caret color="light">
                                    {this.state.nama}
                                </DropdownToggle>
                                <DropdownMenu>
                                    {dataName.length !== 0 && dataName.map(item => {
                                        return (
                                            <DropdownItem className={style.item} onClick={() => this.getApproveDis({nama: item.name, no: detailDis[0] !== undefined && detailDis[0].no_disposal})} >{item.name}</DropdownItem>
                                        )
                                    })}
                                </DropdownMenu>
                                </ButtonDropdown>
                            </div>
                        ) : (
                            <Button color="primary" onClick={() => this.openModPreview({nama: 'disposal pengajuan', no: detailDis[0] !== undefined && detailDis[0].no_disposal})}>Preview</Button>
                        )}
                        <div className="btnFoot">
                            <Button className="mr-2" color="danger" onClick={this.openModalReject}>
                                Reject
                            </Button>
                            <Button color="success" onClick={this.openModalApprove}>
                                Approve
                            </Button>
                        </div>
                    </div>
                </Modal>
                <Modal show={this.state.preview} onHide={this.openPreview} size="xl">
                    <Modal.Body>
                        <div>PT. Pinus Merah Abadi</div>
                        <div className="modalDis">
                            <text className="titleModDis">Form Pengajuan Disposal Asset</text>
                        </div>
                        <div className="mb-2"><text className="txtTrans">{detailDis[0] !== undefined && detailDis[0].area}</text>, {moment(detailDis[0] !== undefined && detailDis[0].createdAt).locale('idn').format('DD MMMM YYYY ')}</div>
                        <Row>
                            <Col md={2}>
                            Hal
                            </Col>
                            <Col md={10}>
                            : Pengajuan Disposal Asset
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col md={2}>
                            {detailDis[0] === undefined ? "" :
                            detailDis[0].status_depo === "Cabang Scylla" || detailDis.status_depo === "Cabang SAP" ? "Cabang" : "Depo"}
                            </Col>
                            <Col md={10} className="txtTrans">
                            : {detailDis[0] !== undefined && detailDis[0].area}
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
                                    <th>No</th>
                                    <th>Nomor Asset</th>
                                    <th>Nama Barang</th>
                                    <th>Merk/Type</th>
                                    <th>Kategori</th>
                                    <th>Status Depo</th>
                                    <th>Cost Center</th>
                                    <th>Nilai Buku</th>
                                    <th>Nilai Jual</th>
                                    <th>Keterangan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detailDis.length !== 0 && detailDis.map(item => {
                                    return (
                                        <tr>
                                            <th scope="row">{detailDis.indexOf(item) + 1}</th>
                                            <td>{item.no_asset}</td>
                                            <td>{item.nama_asset}</td>
                                            <td>{item.merk}</td>
                                            <td>{item.kategori}</td>
                                            <td>{item.status_depo}</td>
                                            <td>{item.cost_center}</td>
                                            <td>{item.nilai_buku}</td>
                                            <td>{item.nilai_jual}</td>
                                            <td>{item.keterangan}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                        <div className="mb-3">Demikianlah hal yang kami sampaikan, atas perhatiannya kami mengucapkan terima kasih</div>
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
                                                    {disApp.pembuat !== undefined && disApp.pembuat.map(item => {
                                                        return (
                                                            <th className="headPre">
                                                                <div className="mb-2">{item.nama === null ? "-" : moment(item.updatedAt).format('LL')}</div>
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
                                                    {disApp.pemeriksa !== undefined && disApp.pemeriksa.map(item => {
                                                        return (
                                                            <th className="headPre">
                                                                <div className="mb-2">{item.nama === null ? "-" : moment(item.updatedAt).format('LL')}</div>
                                                                <div>{item.nama === null ? "-" : item.nama}</div>
                                                            </th>
                                                        )
                                                    })}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    {disApp.pemeriksa !== undefined && disApp.pemeriksa.map(item => {
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
                                                                <div className="mb-2">{item.nama === null ? "-" : moment(item.updatedAt).format('LL')}</div>
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
                       </Table>
                    </Modal.Body>
                    <hr />
                    <div className="modalFoot ml-3">
                        <div></div>
                        <div className="btnFoot">
                            <Button className="mr-2" color="warning" onClick={this.openPreview}>
                                Print
                            </Button>
                            <Button color="success" onClick={this.openPreview}>
                                Close
                            </Button>
                        </div>
                    </div>
                </Modal>
                <Modal show={this.state.modalRinci} onHide={this.openModalRinci} size="xl">
                    <Modal.Header>
                        Rincian
                    </Modal.Header>
                    <Modal.Body>
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
                    </Modal.Body>
                </Modal>
                <Modal show={this.state.rinciAdmin} onHide={this.openRinciAdmin} size="xl">
                    <Modal.Header>
                        Rincian
                    </Modal.Header>
                    <Modal.Body>
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
                                        <Button className="btnFootRinci1" size="lg" color="success" onClick={this.openProsesModalDoc}>Dokumen</Button>
                                        <Button className="btnFootRinci1" size="lg" color="secondary" onClick={() => this.openRinciAdmin()}>Close</Button>
                                    </div>
                                </div>
                            )}
                            </Formik>
                        </div>
                    </Modal.Body>
                </Modal>
                <Modal size="xl" show={this.state.openModalDoc} onHide={this.closeProsesModalDoc}>
                <Modal.Header>
                   Kelengkapan Dokumen
                </Modal.Header>
                <Modal.Body>
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
                                        </Col>
                                    ) : (
                                        <Col md={6} lg={6} >
                                            -
                                        </Col>
                                    )}
                                </Row>
                            )
                        })}
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="mr-2" color="secondary" onClick={this.closeProsesModalDoc}>
                            Close
                        </Button>
                        <Button color="primary" onClick={this.closeProsesModalDoc}>
                            Save 
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={this.state.openReject} onHide={this.openModalReject} centered={true}>
                    <Modal.Body>
                    <Formik
                    initialValues={{
                    alasan: "",
                    }}
                    validationSchema={alasanSchema}
                    onSubmit={(values) => {this.rejectDisposal({value: values, no: detailDis[0].no_disposal})}}
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
                                <Button color="secondary" onClick={this.openModalReject}>Tidak</Button>
                            </div>
                        </div>
                        )}
                        </Formik>
                    </Modal.Body>
                </Modal>
                <Modal show={this.state.openApprove} onHide={this.openModalApprove} centered={true}>
                    <Modal.Body>
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
                                <Button color="primary" onClick={() => this.approveDisposal(detailDis[0].no_disposal)}>Ya</Button>
                                <Button color="secondary" onClick={this.openModalApprove}>Tidak</Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
                <Modal show={this.state.openPdf} size="xl" onHide={this.openModalPdf} centered={true}>
                <Modal.Header>Dokumen</Modal.Header>
                    <Modal.Body>
                        <div className={style.readPdf}>
                            <Pdf pdf={`${REACT_APP_BACKEND_URL}/show/doc/${this.state.idDoc}`} />
                        </div>
                        <hr/>
                        <div className={style.foot}>
                            <div>
                                <Button color="success">Download</Button>
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
                    </Modal.Body>
                </Modal>
                <Modal show={this.state.openApproveDis} onHide={this.openModalApproveDis} centered={true}>
                    <Modal.Body>
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
                    </Modal.Body>
                </Modal>
                <Modal show={this.state.openRejectDis} onHide={this.openModalRejectDis} centered={true}>
                    <Modal.Body>
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
                    </Modal.Body>
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
    setuju: state.setuju
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
    getSetDisposal: setuju.getSetDisposal
}

export default connect(mapStateToProps, mapDispatchToProps)(Disposal)
