/* eslint-disable jsx-a11y/no-distracting-elements */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react'
import { Container, NavbarBrand, Table, Input, Button, Col,
    Alert, Spinner, Row, Modal, ModalBody, ModalHeader, ModalFooter,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap'
import style from '../assets/css/input.module.css'
import {FaSearch, FaUserCircle, FaBars, FaCartPlus, FaFileSignature} from 'react-icons/fa'
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
            openApproveDis: false,
            openRejectDis: false,
            fileName: {},
            dataApp: {},
            img: '',
            limImage: 20000,
            submitPre: false,
            date: '',
            view: '',
            newDis: [],
            app: [],
            find: null,
            openModalIo: false,
            openModalTtd: false,
            profit: "",
            io: "",
            data: [],
            index: 0,
            rinciPeng: {}
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
    }

    getApproveDis = async (value) => {
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

    onChange = value => {
        this.setState({value: value})
    }

    goCartDispos = () => {
        this.props.history.push('/cart')
    }

    closeProsesModalDoc = () => {
        this.setState({openModalDoc: !this.state.openModalDoc})
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
        this.setState({openApprove: !this.state.openApprove})
    }

    modalSubmitPre = () => {
        this.setState({submitPre: !this.state.submitPre})
    }

    prosesModalDoc = async () => {
        const {rinciPeng} = this.state
        const token = localStorage.getItem('token')
        await this.props.getDocumentIo(token, rinciPeng.no_pengadaan)
        this.closeProsesModalDoc()
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
        await this.props.rejectDocDis(token, fileName.id, value, 'edit', 'peng')
        this.openModalPdf()
    }

    openProsesModalDoc = async () => {
        const token = localStorage.getItem('token')
        const { dataRinci } = this.state
        await this.props.getDocumentDis(token, dataRinci.no_asset, 'disposal', 'pengajuan')
        this.closeProsesModalDoc()
    }


    approveDisposal = async (value) => {
        const token = localStorage.getItem('token')
        await this.props.approveDisposal(token, value)
        this.openModalApprove()
        this.getDataDisposal()
    }

    prepareFormIo = async (x) => {
        const {dataPeng} = this.props.pengadaan
        this.setState({rinciPeng: dataPeng[x]})
        const data = dataPeng[x]
        const token = localStorage.getItem('token')
        await this.props.getApproveIo(token, data.no_pengadaan)
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
        await this.props.showDokumen(token, value.id)
        this.setState({date: value.updatedAt, idDoc: value.id, fileName: value})
        console.log(value)
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
        const {isError, isUpload, isUpdate} = this.props.pengadaan
        const {rinciPeng} = this.state
        const token = localStorage.getItem('token')
        if (isError) {
            this.props.resetError()
            this.showAlert()
        } else if (isUpload) {
            setTimeout(() => {
                this.props.resetError()
             }, 2000)
             setTimeout(() => {
                this.props.getDocumentIo(token, rinciPeng.no_pengadaan)
             }, 2100)
        } else if (isUpdate) {
            setTimeout(() => {
                this.props.resetError()
             }, 2000)
             setTimeout(() => {
                this.props.getDocumentIo(token, rinciPeng.no_pengadaan)
             }, 2100)
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
        const token = localStorage.getItem("token")
        this.props.getPengadaan(token)
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

    render() {
        const {alert, upload, errMsg, rinciPeng} = this.state
        const {dataAsset, alertM, alertMsg, alertUpload, page} = this.props.asset
        const pages = this.props.disposal.page 
        const { dataDis, noDis, disApp, dataSubmit } = this.props.disposal
        const {dataRinci, newDis} = this.state
        const {dataPeng, isLoading, isError, dataApp, dataDoc} = this.props.pengadaan
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
                                    <div className={style.titleDashboard}>Pengadaan Asset</div>
                                </div>
                                <div className={level === '2' ? style.secEmail1 : style.secEmail}>
                                    {level === '5' || level === '9' ? (
                                        <div className={style.headEmail}>
                                            <button onClick={this.goCartDispos} className="btnGoCart"><FaCartPlus size={60} className="green ml-2" /></button>
                                        </div>
                                    ) : level === '2' || level === '12' ? (
                                        <div className="mt-5">
                                            {/* <Button onClick={this.getSubmitDisposal} color="info" size="lg" className="btnGoCart mb-4">Submit</Button>
                                            <Input type="select" value={this.state.view} onChange={e => this.changeView(e.target.value)}>
                                                <option value="not available">All</option>
                                                <option value="available">Available To Approve</option>
                                                <option value="revisi">Revisi</option>
                                            </Input> */}
                                        </div>
                                    ) : (
                                        <div className="mt-3">
                                            {/* <Input type="select" value={this.state.view} onChange={e => this.changeView(e.target.value)}>
                                                <option value="not available">All</option>
                                                <option value="available">Available To Approve</option>
                                            </Input> */}
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
                                {level === '5' || level === '9' ? (
                                    dataPeng === undefined ? (
                                        <div></div>
                                    ) : (
                                        <Row className="bodyDispos">
                                        {dataPeng.length !== 0 && dataPeng.map(item => {
                                            return (
                                                dataPeng.length === 0 ? (
                                                    <div></div>
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
                                                            <Button className="btnSell" color="primary" onClick={() => this.prepareFormIo(dataPeng.indexOf(item))}>Proses</Button>
                                                        </Col>
                                                    </Row>
                                                </div>
                                                )
                                            )
                                        })}
                                        </Row>
                                    )
                                ) : (
                                    dataPeng === undefined ? (
                                        <div></div>
                                    ) : (
                                        <Row className="bodyDispos">
                                        {dataPeng.length !== 0 && dataPeng.map(item => {
                                            return (
                                                dataPeng.length === 0 ? (
                                                    <div></div>
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
                                                        <Button className="btnSell" color="primary" onClick={() => this.prepareFormIo(dataPeng.indexOf(item))}>Proses</Button>
                                                        </Col>
                                                    </Row>
                                                </div>
                                                )
                                            )
                                        })}
                                        </Row>
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
                                        {/* <tr>
                                            <td>4300002670</td>
                                            <td>1</td>
                                            <td>Printer Epson L3110 PMA Banyuwangi</td>
                                            <td>2.200.000</td>
                                            <td>Rp 2.200.000</td>
                                        </tr> */}
                                            <tr>
                                                <td>{rinciPeng.qty}</td>
                                                <td>{rinciPeng.nama}</td>
                                                <td>{rinciPeng.price}</td>
                                                <td>Rp {parseInt(rinciPeng.price) * parseInt(rinciPeng.qty)}</td>
                                            </tr>
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
                                value={rinciPeng.depo === undefined ? '' : rinciPeng.depo === null ? '' : rinciPeng.depo.cost_center}
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
                                value={rinciPeng.depo === undefined ? '' : rinciPeng.depo === null ? '' : rinciPeng.depo.profit_center}
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
                                    />
                                </Col>
                                <Col md={4} lg={4}>
                                    <Form.Check 
                                        type="checkbox"
                                        label="Non Budgeted"
                                    />
                                </Col>
                                <Col md={4} lg={4}>
                                    <Form.Check 
                                        type="checkbox"
                                        label="Return"
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
                            <text>Rp 2.200.000</text>
                            </Col>
                        </Row>
                        <Row className="rowModal mt-4">
                            <Col md={2} lg={2}>
                                Alasan
                            </Col>
                            <Col md={10} lg={10} className="colModal">
                            <text className="mr-3">:</text>
                            <text>Pengganti printer yang rusak</text>
                            </Col>
                        </Row>
                    </Container>
                </ModalBody>
                <hr />
                <div className="modalFoot">
                    <div className="btnFoot">
                        <Button className="ml-4" color="success" onClick={this.prosesModalDoc}>
                            Dokumen 
                        </Button>
                        <Button className="ml-2" color="warning">
                            Preview
                        </Button>
                    </div>
                    <div className="btnFoot">
                        <Button className="mr-2" color="primary" onClick={this.prosesModalIo}>
                            Approve
                        </Button>
                        <Button color="danger" onClick={this.prosesModalIo}>
                            Reject 
                        </Button>
                    </div>
                </div>
            </Modal>
            <Modal size="md" isOpen={this.state.openModalTtd} toggle={this.prosesModalTtd}>
                <Modal.Header>
                    Proses Tanda Tangan
                </Modal.Header>
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
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.prosesModalTtd}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={this.prosesModalTtd}>
                        Save 
                    </Button>
                </Modal.Footer>
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
                                            <div>
                                                <input
                                                // className="ml-4"
                                                type="file"
                                                onClick={() => this.setState({detail: x})}
                                                onChange={this.onChangeUpload}
                                                />
                                            </div>
                                        </Col>
                                    ) : (
                                        <Col md={12} lg={12} >
                                            <input
                                            // className="ml-4"
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
                <Modal.Header>Dokumen</Modal.Header>
                    <ModalBody>
                        <div className={style.readPdf}>
                            <Pdf pdf={`${REACT_APP_BACKEND_URL}/show/doc/${this.state.idDoc}`} />
                        </div>
                        <hr/>
                        <div className={style.foot}>
                            <div>
                                {/* <div>{moment(this.state.date).format('LLL')}</div> */}
                                <Button variant="success">Download</Button>
                            </div>
                        {level === '1' || level === '2' || level === '3' ? (
                            <div>
                                <Button variant="danger" className="mr-3" onClick={this.openModalReject}>Reject</Button>
                                <Button variant="primary" onClick={this.openModalApprove}>Approve</Button>
                            </div>
                            ) : (
                                <Button variant="primary" onClick={() => this.setState({openPdf: false})}>Close</Button>
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
                <Modal isOpen={this.state.openApprove} toggle={this.openModalApprove} centered={true}>
                    <ModalBody>
                        <div className={style.modalApprove}>
                            <div>
                                <text>
                                    Anda yakin untuk approve 
                                    <text className={style.verif}> {this.state.fileName.nama_dokumen} </text>
                                    pada tanggal
                                    <text className={style.verif}> {moment().format('LL')}</text> ?
                                </text>
                            </div>
                            <div className={style.btnApprove}>
                                <Button variant="primary" onClick={this.approveDokumen}>Ya</Button>
                                <Button variant="secondary" onClick={this.openModalApprove}>Tidak</Button>
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
                                <Button variant="primary" onClick={handleSubmit}>Ya</Button>
                                <Button variant="secondary" onClick={this.openModalReject}>Tidak</Button>
                            </div>
                        </div>
                        )}
                        </Formik>
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
}

export default connect(mapStateToProps, mapDispatchToProps)(Pengadaan)
