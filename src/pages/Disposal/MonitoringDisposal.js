/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { Component } from 'react'
import {NavbarBrand, UncontrolledDropdown, DropdownToggle, DropdownMenu, Dropdown,
    DropdownItem, Table, ButtonDropdown, Input, Button, Row, Col,
    Modal, ModalHeader, ModalBody, ModalFooter, Container, Alert, Spinner} from 'reactstrap'
import logo from "../../assets/img/logo.png"
import Pdf from "../../components/Pdf"
import style from '../../assets/css/input.module.css'
import {FaSearch, FaUserCircle, FaBars, FaTrash} from 'react-icons/fa'
import {AiOutlineFileExcel, AiFillCheckCircle,  AiOutlineCheck, AiOutlineClose} from 'react-icons/ai'
import {BsCircle, BsDashCircleFill, BsFillCircleFill} from 'react-icons/bs'
import {Formik} from 'formik'
import * as Yup from 'yup'
import pengadaan from '../../redux/actions/pengadaan'
import disposal from '../../redux/actions/disposal'
import setuju from '../../redux/actions/setuju'
import {connect} from 'react-redux'
import moment from 'moment'
import auth from '../../redux/actions/auth'
import NumberInput from '../../components/NumberInput'
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
import TablePeng from '../../components/TablePeng'
import TablePdf from "../../components/Table"
import NavBar from '../../components/NavBar'
const {REACT_APP_BACKEND_URL} = process.env

const taxSchema = Yup.object().shape({
    no_fp: Yup.string().required('must be filled')
})

const finSchema = Yup.object().shape({
    nominal: Yup.number().required('must be filled'),
    no_sap: Yup.string().required('must be filled')
})

const assetSchema = Yup.object().shape({
    doc_sap: Yup.string().required('must be filled'),
    doc_clearing: Yup.string().required('must be filled')
})

const dokumenSchema = Yup.object().shape({
    nama_dokumen: Yup.string().required(),
    jenis_dokumen: Yup.string().required(),
    divisi: Yup.string().required(),
});

const disposalSchema = Yup.object().shape({
    merk: Yup.string().validateSync(""),
    keterangan: Yup.string().required('must be filled'),
    nilai_jual: Yup.string().required()
})

class MonitoringDisposal extends Component {
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
            limit: 10,
            search: '',
            modalRinci: false,
            dataRinci: {},
            openModalDoc: false,
            alertSubmit: false,
            openPdf: false,
            tipeDoc: ''
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
    }

    showAlert = () => {
        this.setState({alert: true, modalEdit: false, modalAdd: false, modalUpload: false })
       
         setTimeout(() => {
            this.setState({
                alert: false
            })
         }, 10000)
    }

    openProsesDocFinance = async (value) => {
        const token = localStorage.getItem('token')
        this.setState({tipeDoc: 'finance'})
        await this.props.getDocumentDis(token, value.no_asset, 'disposal', 'finance')
        this.closeProsesModalDoc()
    }

    openProsesDocTax = async (value) => {
        const token = localStorage.getItem('token')
        this.setState({tipeDoc: 'tax'})
        await this.props.getDocumentDis(token, value.no_asset, 'disposal', 'tax')
        this.closeProsesModalDoc()
    }

    pengajuanDisposal = async (value) => {
        const token = localStorage.getItem('token')
        await this.props.getDetailDis(token, value, 'pengajuan')
        await this.props.getApproveDisposal(token, value, 'disposal pengajuan')
        this.modalPeng()
    }

    persetujuanDisposal = async (value) => {
        const token = localStorage.getItem('token')
        await this.props.getDetailDis(token, value, 'persetujuan')
        await this.props.getApproveSetDisposal(token, value, 'disposal persetujuan')
        this.modalPers()
    }

    openDocEksekusi = async () => {
        const token = localStorage.getItem('token')
        this.setState({tipeDoc: 'sell'})
        const { dataRinci } = this.state
        await this.props.getDocumentDis(token, dataRinci.no_asset, 'disposal', 'sell', 'ada')
        this.closeProsesModalDoc()
    }

    goReport = (val) => {
        this.props.history.push({
            pathname: '/report',
            state: val
        })
    }

    modalPers = () => {
        this.setState({preset: !this.state.preset})
    }

    modalPeng = () => {
        this.setState({preview: !this.state.preview})
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
        this.setState({openModalDoc: !this.state.openModalDoc})
    }

    openProsesDocPeng = async () => {
        const token = localStorage.getItem('token')
        const { dataRinci } = this.state
        await this.props.getDocumentDis(token, dataRinci.no_asset, 'disposal', 'pengajuan')
        this.closeProsesModalDoc()
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

    closeProsesModalDoc = () => {
        this.setState({openModalDoc: !this.state.openModalDoc})
    }

    openProsesModalDoc = async (value) => {
        const token = localStorage.getItem('token')
        this.setState({dataRinci: value})
        console.log(value)
        await this.props.getDocumentDis(token, value.no_asset, 'disposal', value.nilai_jual === "0" ? 'dispose' : 'sell')
        this.closeProsesModalDoc()
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

    openConfirm = () => {
        this.setState({modalConfirm: !this.state.modalConfirm})
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

    submitEksDis = async (value) => {
        const token = localStorage.getItem('token')
        await this.props.submitEksDisposal(token, value)
        this.getDataDisposal()
    }

    componentDidUpdate() {
        const {isError, isGet, isUpload, isSubmit} = this.props.disposal
        const token = localStorage.getItem('token')
        const {dataRinci} = this.state
        if (isError) {
            this.props.resetError()
            this.showAlert()
        } else if (isUpload) {
            setTimeout(() => {
                this.props.resetError()
                this.setState({modalUpload: false})
             }, 1000)
             setTimeout(() => {
                this.props.getDocumentDis(token, dataRinci.no_asset)
             }, 1100)
        } else if (isSubmit) {
            this.props.resetError()
            setTimeout(() => {
                this.getDataDisposal()
             }, 1000)
        }
    }

    componentDidMount() {
        this.getDataDisposal()
    }

    getDataDisposal = async () => {
        const token = localStorage.getItem('token')
        await this.props.getDisposal(token, 10, '',  1, 8)
    }

    menuButtonClick(ev) {
        ev.preventDefault();
        this.onSetOpen(!this.state.open);
    }

    onSetOpen(open) {
        this.setState({ open });
    }

    updateDataDis = async (value) => {
        const token = localStorage.getItem('token')
        const { dataRinci } = this.state
        await this.props.updateDisposal(token, dataRinci.id, value)
        this.getDataDisposal()
    }

    render() {
        const {isOpen, dropOpen, dropOpenNum, detail, alert, upload, errMsg, dataRinci} = this.state
        const {dataDis, isGet, alertM, alertMsg, alertUpload, page, dataDoc, detailDis} = this.props.disposal
        const level = localStorage.getItem('level')
        const { disApp } = this.props.setuju
        const names = localStorage.getItem('name')
        const appPeng = this.props.disposal.disApp

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
                <Sidebar {...sidebarProps}>
                    <MaterialTitlePanel title={contentHeader}>
                        <div className={style.backgroundLogo}>
                            <div className={style.bodyDashboard}>
                                <Alert color="danger" className={style.alertWrong} isOpen={alert}>
                                    <div>{alertMsg}</div>
                                    <div>{alertM}</div>
                                    {alertUpload !== undefined && alertUpload.map(item => {
                                        return (
                                            <div>{item}</div>
                                        )
                                    })}
                                </Alert>
                                <div className={style.headMaster}>
                                    <div className={style.titleDashboard1}>Monitoring Disposal</div>
                                </div>
                                <Alert color="danger" className={style.alertWrong} isOpen={this.state.alertSubmit}>
                                    <div>Lengkapi rincian data asset yang ingin diajukan</div>
                                </Alert>
                                <Row className="cartDisposal2">
                                    {isGet === false || dataDis.length === 0 ? (
                                        <Col md={8} xl={8} sm={12}>
                                            <div className="txtDisposEmpty">Tidak ada data monitoring disposal</div>
                                        </Col>
                                    ) : (
                                        <Col md={12} xl={12} sm={12} className="mb-5 mt-5">
                                        {dataDis.length !== 0 && dataDis.map(item => {
                                            return (
                                                <div className="cart1">
                                                    <div className="navCart">
                                                        <img src={item.no_asset === '4100000150' ? b : item.no_asset === '4300001770' ? e : placeholder} className="cartImg" />
                                                        <div className="txtCart">
                                                            <div>
                                                                <div className="nameCart mb-3">{item.nama_asset}</div>
                                                                <div className="noCart mb-3">No asset : {item.no_asset}</div>
                                                                <div className="noCart mb-3">No disposal : D{item.no_disposal}</div>
                                                                <div className="noCart mb-3">{item.keterangan}</div>
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
                </Sidebar>
                <Modal isOpen={this.props.disposal.isLoading ? true: false} size="sm">
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
                                            </div>
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
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalRinci} toggle={this.openModalRinci} size="xl">
                <ModalHeader>
                    Rincian
                </ModalHeader>
                <ModalBody className="space">
                    <Alert color="danger" className={style.alertWrong} isOpen={alert}>
                        <div>{alertM}</div>
                    </Alert>
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
                            merk: dataRinci.merk,
                            no_sap: dataRinci.no_sap === null ? '' : dataRinci.no_sap,
                            nominal: dataRinci.nominal === null ? '' : dataRinci.nominal,
                            doc_sap: dataRinci.doc_sap === null ? '' : dataRinci.doc_sap,
                            doc_clearing: dataRinci.doc_clearing === null ? '' : dataRinci.doc_clearing,
                            no_fp: dataRinci.no_fp === null ? '' : dataRinci.no_fp
                        }}
                        validationSchema = {level === '2' ? assetSchema : level === '3' ? taxSchema : level === '4' ? finSchema : disposalSchema}
                        onSubmit={(values) => {this.updateDataDis(values)}}
                        >
                        {({ setFieldValue, handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                            <div className="rightRinci">
                                <div>
                                    <div className="titRinci">{dataRinci.nama_asset}</div>
                                    <Row className="mb-2 rowRinci">
                                        <Col md={3}>Area</Col>
                                        <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.area} disabled /></Col>
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
                                    <Row className="mb-2 rowRinci">
                                        <Col md={3}>Kategori</Col>
                                        <Col md={9} className="katCheck">: 
                                            <div className="katCheck">
                                                <div className="ml-2"><input type="checkbox" checked={dataRinci.kategori === 'IT' ? true : false}/> IT</div>
                                                <div className="ml-3"><input type="checkbox" checked={dataRinci.kategori === 'NON IT' ? true : false}/> Non IT</div>
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
                                    <Row className="mb-2 rowRinci">
                                            <Col md={3}>Nilai Buku Eksekusi</Col>
                                            <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.nilai_buku_eks === null || dataRinci.nilai_buku_eks === undefined ? 0 : dataRinci.nilai_buku_eks.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} disabled /></Col>
                                        </Row>
                                    <Row className="mb-2 rowRinci">
                                        <Col md={3}>Nilai Jual</Col>
                                        <Col md={9} className="colRinci">:  <Input 
                                            className="inputRinci" 
                                            value={values.nilai_jual === null ? values.nilai_jual : values.nilai_jual.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} 
                                            onBlur={handleBlur("nilai_jual")}
                                            onChange={handleChange("nilai_jual")}
                                            disabled
                                            />
                                        </Col>
                                    </Row>
                                    {errors.nilai_jual ? (
                                        <text className={style.txtError}>{errors.nilai_jual}</text>
                                    ) : null}
                                    <Row className="mb-2 rowRinci">
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
                                    {level === '2' ? (
                                        <div>
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>No Doc Finance</Col>
                                                <Col md={9} className="colRinci">:  <Input className="inputRinci" value = {dataRinci.no_sap} disabled/></Col>
                                            </Row>
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Nominal uang masuk</Col>
                                                <Col md={9} className="colRinci">:  <Input className="inputRinci" value = {dataRinci.nominal === null ? dataRinci.nominal : dataRinci.nominal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} disabled/></Col>
                                            </Row>
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Faktur Pajak</Col>
                                                <Col md={9} className="colRinci">:  <Input className="inputRinci" value = {dataRinci.no_fp} disabled/></Col>
                                            </Row>
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>No Doc SAP</Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    type="text" 
                                                    className="inputRinci" 
                                                    value={values.doc_sap}
                                                    disabled
                                                    onBlur={handleBlur("doc_sap")}
                                                    onChange={handleChange("doc_sap")}
                                                    />
                                                </Col>
                                            </Row>
                                            {errors.doc_sap ? (
                                                <text className={style.txtError}>{errors.doc_sap}</text>
                                            ) : null}
                                            <Row className="mb-5 rowRinci">
                                                <Col md={3}>No Doc Clearing</Col>
                                                <Col md={9} className="colRinci">:  <Input
                                                    type="text" 
                                                    className="inputRinci"
                                                    disabled
                                                    value={values.doc_clearing} 
                                                    onBlur={handleBlur("doc_clearing")}
                                                    onChange={handleChange("doc_clearing")}
                                                    />
                                                </Col>
                                            </Row>
                                            {errors.doc_clearing ? (
                                                <text className={style.txtError}>{errors.doc_clearing}</text>
                                            ) : null}
                                        </div>
                                    ) : level === '3' ? (
                                        <div>
                                            <Row className="mb-5 rowRinci">
                                                <Col md={3}>Faktur Pajak</Col>
                                                <Col md={9} className="colRinci">:  <Input 
                                                    type="text" 
                                                    className="inputRinci" 
                                                    value={values.no_fp} 
                                                    onBlur={handleBlur("no_fp")}
                                                    onChange={handleChange("no_fp")}
                                                    />
                                                </Col>
                                                {errors.no_fp ? (
                                                    <text className={style.txtError}>{errors.no_fp}</text>
                                                ) : null}
                                            </Row>
                                        </div>
                                    ) : level === '4' ? (
                                        <div>
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>No Doc Finance</Col>
                                                <Col md={9} className="colRinci">:  <Input 
                                                    type="text" 
                                                    className="inputRinci" 
                                                    value={values.no_sap} 
                                                    onBlur={handleBlur("no_sap")}
                                                    onChange={handleChange("no_sap")}
                                                    />
                                                </Col>
                                            </Row>
                                            {errors.no_sap ? (
                                                <text className={style.txtError}>{errors.no_sap}</text>
                                            ) : null}
                                            <Row className="mb-2 rowRinci">
                                                <Col md={3}>Nominal uang masuk</Col>
                                                <Col md={9} className="colRinci">:  <NumberInput 
                                                    value={values.nominal}
                                                    className="inputRinci1"
                                                    onValueChange={val => setFieldValue("nominal", val.floatValue)}
                                                />
                                                </Col>
                                            </Row>
                                            {errors.nominal ? (
                                                <text className='txtError mb-5'>{errors.nominal}</text>
                                            ) : null}
                                        </div>
                                    ) : (
                                        <Row></Row>
                                    )}
                                </div>
                                {level === '2' ? (
                                    <Row className="footRinci1 ml-2 mb-2">
                                        <Button className="btnFootRinci3" size="md" color="warning" outline onClick={() => this.openProsesDocFinance(dataRinci)}>Doc Finance</Button>
                                        <Button className="btnFootRinci3" size="md" color="success" outline onClick={() => this.openProsesDocTax(dataRinci)}>Doc Tax</Button>
                                        <Button className="btnFootRinci3" size="md" color="danger" outline onClick={() => this.pengajuanDisposal(dataRinci.no_disposal)}>Form Pengajuan</Button>
                                        <Button className="btnFootRinci3" size="md" color="info" outline onClick={() => this.persetujuanDisposal(dataRinci.status_app)}>Form Persetujuan</Button>
                                        <Button className="btnFootRinci3" size="md" color="primary" outline onClick={() => this.openDocEksekusi()}>Doc Eksekusi</Button>
                                        <Button className="btnFootRinci3" size="md" color="success" outline onClick={() => this.openProsesDocPeng()}>Doc Pengajuan</Button>
                                        <Button className="btnFootRinci3 mb-5" size="md" color="danger" outline onClick={() => this.goReport(dataRinci.no_asset)}>Show Report</Button>
                                        <Button className="btnFootRinci3 mb-5" size="md" color="secondary" outline onClick={() => this.openModalRinci()}>Close</Button>
                                        <div className="btnFootRinci3 mb-5"></div>
                                    </Row>
                                ) : (
                                    <Row className="footRinci1 ml-2">
                                        {level === "3" ? (
                                            <Button className="btnFootRinci3" size="md" color="success" outline onClick={() => this.openProsesDocTax(dataRinci)}>Upload Doc</Button>
                                        ) : level === '4' && (
                                            <Button className="btnFootRinci3" size="md" color="success" outline onClick={() => this.openProsesDocFinance(dataRinci)}>Upload Doc</Button>
                                        )}
                                        <Button className="btnFootRinci3" size="md" color="warning" outline onClick={() => this.pengajuanDisposal(dataRinci.no_disposal)}>Form Pengajuan</Button>
                                        <Button className="btnFootRinci3" size="md" color="info" outline onClick={() => this.persetujuanDisposal(dataRinci.status_app)}>Form Persetujuan</Button>
                                        <Button className="btnFootRinci3" size="md" color="danger" outline onClick={() => this.openDocEksekusi()}>Doc Eksekusi</Button>
                                        <Button className="btnFootRinci3" size="md" color="primary" outline onClick={() => this.openProsesDocPeng()}>Doc Pengajuan</Button>
                                    </Row>
                                )}
                            </div>
                        )}
                        </Formik>
                    </div>
                </ModalBody>
            </Modal>
            <Modal isOpen={this.state.preview} toggle={this.modalPeng} size="xl">
                <ModalBody>
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
                                <th>No</th>
                                <th>Nomor Asset</th>
                                <th>Nama Barang</th>
                                <th>Merk/Type</th>
                                <th>Kategori</th>
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
                                        <td>{item.nilai_buku === null || item.nilai_buku === undefined ? 0 : item.nilai_buku.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                        <td>{item.nilai_jual === null || item.nilai_jual === undefined ? 0 : item.nilai_jual.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
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
                                                {appPeng.pembuat !== undefined && appPeng.pembuat.map(item => {
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
                                            {appPeng.pembuat !== undefined && appPeng.pembuat.map(item => {
                                                return (
                                                    <td className="footPre">{item.jabatan === null ? "-" : 'SPV'}</td>
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
                                                {appPeng.pemeriksa !== undefined && appPeng.pemeriksa.map(item => {
                                                    return (
                                                        item.jabatan === 'asset' ? (
                                                            null
                                                        ) : (
                                                            <th className="headPre">
                                                                <div className="mb-2">{item.nama === null ? "-" : moment(item.updatedAt).format('LL')}</div>
                                                                <div>{item.nama === null ? "-" : item.nama}</div>
                                                            </th>
                                                        )
                                                    )
                                                })}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                {appPeng.pemeriksa !== undefined && appPeng.pemeriksa.map(item => {
                                                    return (
                                                        item.jabatan === 'asset' ? (
                                                            null
                                                        ) : (
                                                            <td className="footPre">{item.jabatan === null ? "-" : item.jabatan}</td>
                                                        )
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
                                                {appPeng.penyetuju !== undefined && appPeng.penyetuju.map(item => {
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
                                                {appPeng.penyetuju !== undefined && appPeng.penyetuju.map(item => {
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
                        <Button className="mr-2" color="warning">
                            <TablePeng detailDis={detailDis} />
                        </Button>
                        <Button color="success" onClick={this.modalPeng}>
                            Close
                        </Button>
                    </div>
                </div>
            </Modal>
            <Modal isOpen={this.state.preset} toggle={this.modalPers} centered={true} size="xl">
                <ModalBody>
                    <div className="bodyPer">
                        <div>PT. Pinus Merah Abadi</div>
                        <div className="modalDis">
                            <text className="titleModDis">Persetujuan Disposal Asset</text>
                        </div>
                        <div className="mb-2"><text className="txtTrans">Bandung</text>, {moment().format('DD MMMM YYYY ')}</div>
                        <Row>
                            <Col md={2} className="mb-3">
                            Hal : Persetujuan Disposal Asset
                            </Col>
                        </Row>
                        <div>Kepada Yth.</div>
                        <div className="mb-3">Bpk. Erwin Lesmana</div>
                        <div className="mb-3">Dengan Hormat,</div>
                        <div>Sehubungan dengan surat permohonan disposal aset area PMA terlampir</div>
                        <div className="mb-3">Dengan ini kami mohon persetujuan untuk melakukan disposal aset dengan perincian sbb :</div>
                        <Table striped bordered responsive hover className="tableDis mb-3">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Nomor Aset / Inventaris</th>
                                    <th>Area (Cabang/Depo/CP)</th>
                                    <th>Nama Barang</th>
                                    <th>Nilai Buku</th>
                                    <th>Nilai Jual</th>
                                    <th>Tanggal Perolehan</th>
                                    <th>Keterangan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detailDis.length !== 0 ? detailDis.map(item => {
                                    return (
                                        // <tr onClick={() => this.openProsesModalDoc(item)}></tr>
                                        <tr onClick={() => this.getDetailDisposal(item.no_disposal)}>
                                            <th scope="row">{detailDis.indexOf(item) + 1}</th>
                                            <td>{item.no_asset}</td>
                                            <td>{item.area}</td>
                                            <td>{item.nama_asset}</td>
                                            <td>{item.nilai_buku === null || item.nilai_buku === undefined ? 0 : item.nilai_buku.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                            <td>{item.nilai_jual === null || item.nilai_jual === undefined ? 0 : item.nilai_jual.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                            <td>{moment(item.dataAsset.tanggal).format('DD/MM/YYYY')}</td>
                                            <td>{item.keterangan}</td>
                                        </tr>
                                    )
                                }) : (
                                    <tr>
                                        <th scope="row">1</th>
                                        <td> </td>
                                        <td> </td>
                                        <td> </td>
                                        <td> </td>
                                        <td> </td>
                                        <td> </td>
                                        <td> </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                        <div className="mb-3">Demikian hal yang dapat kami sampaikan perihal persetujuan disposal aset, atas perhatiannya kami mengucapkan terima kasih.</div>
                        <Table borderless className="tabPreview">
                            <thead>
                                <tr>
                                    <th className="buatPre">Diajukan oleh,</th>
                                    <th className="buatPre">Disetujui oleh,</th>
                                </tr>
                            </thead>
                            <tbody className="tbodyPre">
                                <tr>
                                    <td className="restTable">
                                        <Table bordered className="divPre">
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
                                                            <td className="footPre">{item.jabatan === null ? "-" : item.jabatan === 'NFAM' ? 'Head of Finance Accounting PMA' : item.jabatan}</td>
                                                        )
                                                    })}
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </td>
                                    <td className="restTable">
                                        <Table bordered className="divPre">
                                            <thead>
                                                <tr>
                                                    {disApp.penyetuju !== undefined && disApp.penyetuju.map(item => {
                                                        return (
                                                            item.jabatan === 'HOC Funding And Tax' ? null :
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
                                                            item.jabatan === 'HOC Funding And Tax' ? null :
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
                        <div className="btnFoot">
                            <Button className="mr-2" color="warning">
                                <TablePdf dataDis={detailDis} />
                            </Button>
                            <Button color="success" onClick={this.modalPers}>
                                Close
                            </Button>
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
    pengadaan: state.pengadaan
})

const mapDispatchToProps = {
    logout: auth.logout,
    getDisposal: disposal.getDisposal,
    submitDisposal: disposal.submitDisposal,
    resetError: disposal.reset,
    deleteDisposal: disposal.deleteDisposal,
    updateDisposal: disposal.updateDisposal,
    getDocumentDis: disposal.getDocumentDis,
    uploadDocumentDis: disposal.uploadDocumentDis,
    submitEksDisposal: setuju.submitEksDisposal,
    showDokumen: pengadaan.showDokumen,
    getDetailDis: disposal.getDetailDisposal,
    getApproveDisposal: disposal.getApproveDisposal,
    getApproveSetDisposal: setuju.getApproveSetDisposal,
}

export default connect(mapStateToProps, mapDispatchToProps)(MonitoringDisposal)
