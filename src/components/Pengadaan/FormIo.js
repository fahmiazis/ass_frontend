/* eslint-disable jsx-a11y/no-distracting-elements */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react'
import { Container, NavbarBrand, Table, Input, Button, Col,
    Alert, Spinner, Row, Modal, ModalBody, ModalHeader, ModalFooter, Collapse,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Card, CardBody} from 'reactstrap'
import style from '../../assets/css/input.module.css'
import {FaSearch, FaUserCircle, FaBars, FaCartPlus, FaFileSignature, FaTh, FaList} from 'react-icons/fa'
import {BsCircle, BsBell, BsFillCircleFill} from 'react-icons/bs'
import { AiOutlineCheck, AiOutlineClose, AiFillCheckCircle} from 'react-icons/ai'
import {MdAssignment} from 'react-icons/md'
import {FiSend, FiTruck, FiSettings, FiUpload} from 'react-icons/fi'
import {Formik} from 'formik'
import * as Yup from 'yup'
import Pdf from "../../components/Pdf"
import {Form} from 'react-bootstrap'
import logo from '../../assets/img/logo.png'
import {connect} from 'react-redux'
import pengadaan from '../../redux/actions/pengadaan'
import dokumen from '../../redux/actions/dokumen'
import OtpInput from "react-otp-input";
import moment from 'moment'
import auth from '../../redux/actions/auth'
import {default as axios} from 'axios'
import Sidebar from "../../components/Header"
import MaterialTitlePanel from "../../components/material_title_panel"
import SidebarContent from "../../components/sidebar_content"
import placeholder from  "../../assets/img/placeholder.png"
import TablePeng from '../../components/TablePeng'
import notif from '../../redux/actions/notif'
import NavBar from '../../components/NavBar'
import renderHTML from 'react-render-html'
import ModalDokumen from '../../components/ModalDokumen'
const {REACT_APP_BACKEND_URL} = process.env

class FormIo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            docked: false,
            open: false,
            openBid: false,
            dataBid: '',
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
            formTrack: false,
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
            valdoc: {},
            detailTrack: [],
            collap: false, 
            tipeCol: '',
            time: '',
            typeReject: '',
            menuRev: '',
            noDoc: '',
            noTrans: ''
        }
    }

    async componentDidMount () {
        const dataCek = localStorage.getItem('printData')
        if (dataCek !== undefined && dataCek !== null) {
            const token = localStorage.getItem('token')
            const level = localStorage.getItem('level')
            await this.props.getDetail(token, dataCek)
            await this.props.getApproveIo(token, dataCek)
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
        }
    }

  render() {
    const {alert, upload, errMsg, rinciIo, total, listMut, newIo, listStat, fileName, url, detailTrack} = this.state
    const {dataAsset, alertM, alertMsg, alertUpload, page} = this.props.asset
    const pages = this.props.disposal.page 
    const {dataPeng, isLoading, isError, dataApp, dataDoc, detailIo, dataDocCart} = this.props.pengadaan
    const level = localStorage.getItem('level')
    const names = localStorage.getItem('name')
    const dataNotif = this.props.notif.data
    const role = localStorage.getItem('role')

    return (
        <div className=''>
            <div className="backWhite mb-5">
                <Container className='mb-4'>
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
                            checked
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
                        <text>{detailIo[0] === undefined ? '-' : detailIo[0].alasan}</text>
                        </Col>
                    </Row>
                </Container>
                <Container>
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
                </Container>
            </div>
        </div>
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
    auth: state.auth,
    dokumen: state.dokumen
})

const mapDispatchToProps = {
    logout: auth.logout,
    getNotif: notif.getNotif,
    resetAuth: auth.resetError,
    getPengadaan: pengadaan.getPengadaan,
    getApproveIo: pengadaan.getApproveIo,
    getDocumentIo: pengadaan.getDocumentIo,
    getDokumen: dokumen.getDokumen,
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
    testApiPods: pengadaan.testApiPods,
    submitNotAsset: pengadaan.submitNotAsset,
    podsSend: pengadaan.podsSend
}

export default connect(mapStateToProps, mapDispatchToProps)(FormIo)
