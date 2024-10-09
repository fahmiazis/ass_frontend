/* eslint-disable jsx-a11y/no-distracting-elements */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react'
import { Container, NavbarBrand, Table, Input, Button, Col,
    Alert, Spinner, Row, Modal, ModalBody, ModalHeader, ModalFooter,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap'
import style from '../../assets/css/input.module.css'
import {FaSearch, FaUserCircle, FaBars, FaCartPlus, FaFileSignature} from 'react-icons/fa'
import {BsCircle, BsBell, BsFillCircleFill} from 'react-icons/bs'
import { AiOutlineCheck, AiOutlineClose, AiFillCheckCircle} from 'react-icons/ai'
import {Formik} from 'formik'
import * as Yup from 'yup'
import Pdf from "../../components/Pdf"
import asset from '../../redux/actions/asset'
import pengadaan from '../../redux/actions/pengadaan'
import approve from '../../redux/actions/approve'
import {connect} from 'react-redux'
import moment from 'moment'
import auth from '../../redux/actions/auth'
import setuju from '../../redux/actions/setuju'
import {default as axios} from 'axios'
import Sidebar from "../../components/Header"
import MaterialTitlePanel from "../../components/material_title_panel"
import SidebarContent from "../../components/sidebar_content"
import placeholder from  "../../assets/img/placeholder.png"
import disposal from '../../redux/actions/disposal'
import TableMut from '../../components/TableMut'
import notif from '../../redux/actions/notif'
import mutasi from '../../redux/actions/mutasi'
import NavBar from '../../components/NavBar'
import logo from '../../assets/img/logo.png'
const {REACT_APP_BACKEND_URL} = process.env

const alasanSchema = Yup.object().shape({
    alasan: Yup.string().required()
})

const ioSchema = Yup.object().shape({
    no_io: Yup.string().required()
})

const sapSchema = Yup.object().shape({
    doc_sap: Yup.string().required()
})

class EksekusiMut extends Component {

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
            dataRinci: {},
            rincian: false,
            img: '',
            newMut: [],
            formMut: false,
            detailMut: [],
            openModalDoc: false,
            openPdf: false,
            idDoc: 0,
            fileName: {},
            date: '',
            listMut: [],
            modalConfirm: false,
            openApproveDis: false,
            openRejectDis: false,
            approve: false,
            reject: false,
            preview: false,
            confirm: ''
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
    }

    menuButtonClick(ev) {
        ev.preventDefault();
        this.onSetOpen(!this.state.open);
    }

    getDataApprove = async (val) => {
        const {detailMut} = this.state
        const token = localStorage.getItem('token')
        await this.props.getApproveMut(token, detailMut[0].no_mutasi, 'Mutasi')
        this.openModalPre()
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

    chekRej = (val) => {
        const { listMut } = this.state
        listMut.push(val)
        this.setState({listMut: listMut})
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
        await this.props.rejectDocMut(token, fileName.id, value, 'edit')
        this.openModalPdf()
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

    openModalRinci = () => {
        this.setState({rincian: !this.state.rincian})
    }

    onSetOpen(open) {
        this.setState({ open });
    }

    getNotif = async () => {
        const token = localStorage.getItem("token")
        await this.props.getNotif(token)
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

    openConfirm = () => {
        this.setState({modalConfirm: !this.state.modalConfirm})
    }

    openModalPdf = () => {
        this.setState({openPdf: !this.state.openPdf})
    }

    getDataMutasi = async () => {
        const token = localStorage.getItem('token')
        await this.props.getMutasi(token, 9)
        this.changeView()
    }

    openReject = () => {
        this.setState({reject: !this.state.reject})
    }

    openDetailMut = async (value) => {
        const { dataMut } = this.props.mutasi
        const token = localStorage.getItem('token')
        await this.props.getDetailMutasi(token, value, 'eks') 
        const detail = []
        for (let i = 0; i < dataMut.length; i++) {
            if (dataMut[i].no_mutasi === value) {
                detail.push(dataMut[i])
            }
        }
        this.setState({detailMut: detail})
        this.openModalMut()
    }

    componentDidMount() {
        this.getNotif()
        this.getDataMutasi()
    }

    updateEksekusi = async (val) => {
        const token = localStorage.getItem('token')
        const { dataRinci, detailMut } = this.state
        await this.props.updateStatus(token, dataRinci.id, val)
        await this.props.getDetailMutasi(token, detailMut[0].no_mutasi)
    }

    openModalPre = () => {
        this.setState({preview: !this.state.preview})
    }

    componentDidUpdate() {
        const { errorAdd, rejReject, rejApprove, isReject, isApprove, isRejDoc, submitEks } = this.props.mutasi
        const {isAppDoc} = this.props.disposal
        const token = localStorage.getItem('token')
        const { detailMut } = this.state
        if (errorAdd) {
            this.openConfirm(this.setState({confirm: 'addmutasi'}))
            this.props.resetAddMut()
        } else if (isReject) {
            this.setState({listMut: []})
            this.openReject()
            this.openConfirm(this.setState({confirm: 'reject'}))
            this.openModalMut()
            this.props.resetAppRej()
        } else if (submitEks) {
            this.openConfirm(this.setState({confirm: 'approve'}))
            this.openApprove()
            this.props.resetAppRej()
        } else if (rejReject) {
            this.openReject()
            this.openConfirm(this.setState({confirm: 'rejReject'}))
            this.props.resetAppRej()
        } else if (rejApprove) {
            this.openConfirm(this.setState({confirm: 'rejApprove'}))
            this.openApprove()
            this.props.resetAppRej()
        } else if (isAppDoc === true || isRejDoc === true) {
            setTimeout(() => {
                this.props.resetDis()
                this.props.resetAppRej()
             }, 1000)
             setTimeout(() => {
                this.props.getDocumentMut(token, detailMut[0].no_asset, detailMut[0].no_mutasi)
                this.props.getDetailMutasi(token, detailMut[0].no_mutasi) 
                this.getDataMutasi()
             }, 1100)
        }
    }

    openApprove = () => {
        this.setState({approve: !this.state.approve})
    }

    openModalMut = () => {
        this.setState({formMut: !this.state.formMut, listMut: []})
    }

    openModalRejectDis = () => {
        this.setState({openRejectDis: !this.state.openRejectDis})
    }

    openModalApproveDis = () => {
        this.setState({openApproveDis: !this.state.openApproveDis})
    }

    changeView = async (val) => {
        const { dataMut, noMut } = this.props.mutasi
        const newMut = []
        for (let i = 0; i < noMut.length; i++) {
            const index = dataMut.indexOf(dataMut.find(({no_mutasi}) => no_mutasi === noMut[i]))
            if (dataMut[index] !== undefined) {
                newMut.push(dataMut[index])
            }
        }
        this.setState({newMut: newMut})
    }

    openProsesModalDoc = async (val) => {
        const token = localStorage.getItem('token')
        const { detailMut } = this.state
        await this.props.getDocumentMut(token, detailMut[0].no_asset, detailMut[0].no_mutasi)
        this.closeProsesModalDoc()
    }

    approveMutasi = async () => {
        const { detailMut } = this.state
        const token = localStorage.getItem("token")
        await this.props.submitEksekusi(token, detailMut[0].no_mutasi)
        this.getDataMutasi()
    }

    rejectMutasi = async (val) => {
        const { detailMut, listMut } = this.state
        const token = localStorage.getItem("token")
        const data = {
            alasan: val.alasan,
            listMut: listMut
        }
        await this.props.rejectEks(token, detailMut[0].no_mutasi, data)
        this.getDataMutasi()
    }

    closeProsesModalDoc = () => {
        this.setState({openModalDoc: !this.state.openModalDoc})
    }

    updateStatus = async (val) => {
        const token = localStorage.getItem('token')
        const { detailMut } = this.state
        await this.props.updateBudget(token, val.id, val.stat)
        await this.props.getDetailMutasi(token, detailMut[0].no_mutasi) 
    }

    render() {
        const dataNotif = this.props.notif.data
        const { dataRinci, newMut, listMut, fileName } = this.state
        const { dataDoc, detailMut, mutApp } = this.props.mutasi
        const level = localStorage.getItem('level')

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
                        <div className={style.backgroundLogo1}>
                            <div className={style.bodyDashboard}>
                                <div className={style.headMaster}> 
                                    <div className={style.titleDashboard}>Eksekusi Mutasi</div>
                                </div>
                                <div className={style.secEmail}>
                                    <div className={style.headEmail}>
                                    </div>
                                    <div className={style.searchEmail1}>
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
                                {/* <Row className="cartDisposal2">
                                    {dataMut.length === 0 ? (
                                        <Col md={8} xl={8} sm={12}>
                                            <div className="txtDisposEmpty">Tidak ada data eksekusi mutasi</div>
                                        </Col>
                                    ) : (
                                        <Col md={12} xl={12} sm={12} className="mb-5 mt-5">
                                        {dataMut.length !== 0 && dataMut.map(item => {
                                            return (
                                                <div className="cart1">
                                                    <div className="navCart">
                                                        <img src={placeholder} className="cartImg" />
                                                        <Button className="labelBut" color="warning" size="sm">{'Mutasi'}</Button>
                                                        <div className="txtCart">
                                                            <div>
                                                                <div className="nameCart mb-3">{item.nama_asset}</div>
                                                                <div className="noCart mb-3">No asset : {item.no_asset}</div>
                                                                <div className="noCart mb-3">No mutasi : {item.no_mutasi}</div>
                                                                <div className="noCart mb-3">{item.keterangan}</div>
                                                                <Button color="success" onClick={() => this.submitEksDis(item)} disabled>Submit</Button>
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
                                </Row> */}
                                <Row className="bodyDispos">
                                    {newMut.length !== 0 && newMut.map(item => {
                                        return (
                                            <div className="bodyCard">
                                                <img src={placeholder} className="imgCard1" />
                                                <Button size="sm" color="danger" className="labelBut">Mutasi</Button>
                                                <div className="ml-2">
                                                    <div className="txtDoc mb-2">
                                                        Terima Mutasi Aset
                                                    </div>
                                                    <Row className="mb-2">
                                                        <Col md={6} className="txtDoc">
                                                        Area asal
                                                        </Col>
                                                        <Col md={6} className="txtDoc">
                                                        : {item.area}
                                                        </Col>
                                                    </Row>
                                                    <Row className="mb-2">
                                                        <Col md={6} className="txtDoc">
                                                        Area tujuan
                                                        </Col>
                                                        <Col md={6} className="txtDoc">
                                                        : {item.area_rec}
                                                        </Col>
                                                    </Row>
                                                    <Row className="mb-2">
                                                        <Col md={6} className="txtDoc">
                                                        No Mutasi
                                                        </Col>
                                                        <Col md={6} className="txtDoc">
                                                        : {item.no_mutasi}
                                                        </Col>
                                                    </Row>
                                                    <Row className="mb-2">
                                                        <Col md={6} className="txtDoc">
                                                        Status Approval
                                                        </Col>
                                                        <Col md={6} className="txtDoc">
                                                        : Full approve
                                                        </Col>
                                                    </Row>
                                                </div>
                                                <Row className="footCard mb-3 mt-3">
                                                    <Col md={12} xl={12}>
                                                        <Button className="btnSell" color="primary" onClick={() => this.openDetailMut(item.no_mutasi)}>Proses</Button>
                                                    </Col>
                                                </Row>
                                            </div>
                                        )
                                    })}
                                    </Row>
                            </div>
                        </div>
                    </MaterialTitlePanel>
                </Sidebar>
                <Modal isOpen={this.state.rincian} toggle={this.openModalRinci} size="xl">
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
                            initialValues={{
                            // no_io: detailMut.find(({no_asset}) => no_asset === dataRinci.no_asset) === undefined ? null : detailMut.find(({no_asset}) => no_asset === dataRinci.no_asset).isbudget === 'tidak' ? null : dataRinci.no_io,
                            doc_sap: detailMut.find(({no_asset}) => no_asset === dataRinci.no_asset) === undefined ? null : detailMut.find(({no_asset}) => no_asset === dataRinci.no_asset).isbudget === 'ya' ? null : dataRinci.doc_sap
                            }}
                            // validationSchema={detailMut.find(({no_asset}) => no_asset === dataRinci.no_asset) === undefined ? '' : detailMut.find(({no_asset}) => no_asset === dataRinci.no_asset).isbudget === 'ya' ? ioSchema : detailMut.find(({no_asset}) => no_asset === dataRinci.no_asset).isbudget === 'tidak' ? sapSchema : ''}
                            validationSchema={detailMut.find(({no_asset}) => no_asset === dataRinci.no_asset) === undefined ? '' : detailMut.find(({isbudget}) => isbudget === 'ya') === undefined ? sapSchema : ''}
                            onSubmit={(values) => {this.updateEksekusi(values)}}
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
                                            <Col md={3}>Area Penerima</Col>
                                            <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.area_rec} disabled /></Col>
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
                                                    <div className="ml-2"><input type="checkbox" disabled checked={dataRinci.kategori === 'IT' ? true : false}/> IT</div>
                                                    <div className="ml-3"><input type="checkbox" disabled checked={dataRinci.kategori === 'NON IT' ? true : false} /> Non IT</div>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Nilai Buku</Col>
                                            <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.nilai_buku === null || dataRinci.nilai_buku === undefined ? '0' : dataRinci.nilai_buku.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} disabled /></Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Konfirmasi Budget</Col>
                                            <Col md={9} className="katCheck">:  
                                                <div className="ml-2">
                                                    <Input
                                                    addon
                                                    disabled
                                                    // disabled={listMut.find(element => element === dataRinci.no_asset) === undefined ? false : true}
                                                    type="checkbox"
                                                    checked={detailMut.find(({no_asset}) => no_asset === dataRinci.no_asset) === undefined ? false : detailMut.find(({no_asset}) => no_asset === dataRinci.no_asset).isbudget === 'ya' ? true : false}
                                                    onClick={() => this.updateStatus({id: dataRinci.id, stat: 'ya'})}
                                                    value={dataRinci.no_asset} />  Ya
                                                </div>
                                                <div className="ml-3">
                                                    <Input
                                                    addon
                                                    disabled
                                                    // disabled={listMut.find(element => element === dataRinci.no_asset) === undefined ? false : true}
                                                    type="checkbox"
                                                    checked={detailMut.find(({no_asset}) => no_asset === dataRinci.no_asset) === undefined ? false : detailMut.find(({no_asset}) => no_asset === dataRinci.no_asset).isbudget === 'tidak' ? true : false}
                                                    onClick={() => this.updateStatus({id: dataRinci.id, stat: 'tidak'})}
                                                    value={dataRinci.no_asset} />  Tidak
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Nomor IO</Col>
                                            <Col md={9} className="colRinci">:  <Input 
                                                className="inputRinci"
                                                value={dataRinci.no_io} 
                                                // onBlur={handleBlur("no_io")}
                                                // onChange={handleChange("no_io")}
                                                disabled
                                                // disabled={detailMut.find(({no_asset}) => no_asset === dataRinci.no_asset) === undefined ? true : detailMut.find(({no_asset}) => no_asset === dataRinci.no_asset).isbudget === 'ya' ? false : true} 
                                                />
                                            </Col>
                                        </Row>
                                        {/* {errors.no_io ? (
                                            <text className={style.txtError}>Must be filled</text>
                                        ) : null} */}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Cost Center IO</Col>
                                            <Col md={9} className="colRinci">:  <Input 
                                                className="inputRinci"
                                                value={dataRinci.cost_centerawal} 
                                                disabled
                                                // disabled={detailMut.find(({no_asset}) => no_asset === dataRinci.no_asset) === undefined ? true : detailMut.find(({no_asset}) => no_asset === dataRinci.no_asset).isbudget === 'ya' ? false : true} 
                                                />
                                            </Col>
                                        </Row>
                                        {detailMut[0] === undefined ? (
                                            <div></div>
                                        ) : detailMut.find(({isbudget}) => isbudget === 'ya') === undefined && (
                                            <>
                                                <Row className="mb-2 rowRinci">
                                                    <Col md={3}>Nomor Doc SAP</Col>
                                                    <Col md={9} className="colRinci">:  <Input className="inputRinci" 
                                                    value={values.doc_sap} 
                                                    onBlur={handleBlur("doc_sap")}
                                                    onChange={handleChange("doc_sap")}
                                                    // disabled={detailMut.find(({no_asset}) => no_asset === dataRinci.no_asset) === undefined ? true : detailMut.find(({no_asset}) => no_asset === dataRinci.no_asset).isbudget === 'tidak' ? false : true}
                                                    /></Col>
                                                </Row>
                                                {errors.doc_sap ? (
                                                    <text className={style.txtError}>Must be filled</text>
                                                ) : null}
                                            </>
                                        )}
                                    </div>
                                    {detailMut[0] === undefined ? (
                                        <div></div>
                                    ) : detailMut.find(({isbudget}) => isbudget === 'ya') === undefined && (
                                        <div className="footRinci4 mt-4">
                                            <Button className="btnFootRinci1" size="lg" color="primary" onClick={handleSubmit}>Save</Button>
                                            <Button className="btnFootRinci1 ml-3" size="lg" color="secondary" onClick={() => this.openModalRinci()}>Close</Button>
                                        </div>
                                    )}
                                </div>
                            )}
                            </Formik>
                        </div>
                    </ModalBody>
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
                                    <Col md={6}>: {detailMut.length !== 0 ? moment(detailMut[0].tgl_mutasifisik).format('DD MMMM YYYY') : ''}</Col>
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
                                    <th>Keterangan</th>
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
                                            <td>{item.keterangan}</td>
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
                                                                <div className="mb-2">{item.nama === null ? "-" : moment(item.updatedAt).format('LL')}</div>
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
                                                    {mutApp.penerima !== undefined && mutApp.penerima.map(item => {
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
                                                {mutApp.penerima !== undefined && mutApp.penerima.map(item => {
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
                                                    {mutApp.pemeriksa !== undefined && mutApp.pemeriksa.map(item => {
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
                                                                <div className="mb-2">{item.nama === null ? "-" : moment(item.updatedAt).format('LL')}</div>
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
                    {/* onClick={() => this.openModPreview({nama: 'disposal pengajuan', no: detailDis[0] !== undefined && detailDis[0].no_disposal})} */}
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
                <Modal isOpen={this.state.formMut} toggle={this.openModalMut} size="xl">
                    <Alert color="danger" className={style.alertWrong} isOpen={detailMut[0] === undefined || detailMut[0].docAsset.find(({divisi}) => divisi === '3') === undefined ? true : false}>
                        <div>Mohon approve dokumen terlebih dahulu sebelum approve pengajuan mutasi</div>
                    </Alert>
                    <Alert color="danger" className={style.alertWrong} isOpen={detailMut.find(({isbudget}) => isbudget === 'ya') === undefined && (detailMut.find(({doc_sap}) => doc_sap === null) !== undefined || detailMut.find(({doc_sap}) => doc_sap === '') !== undefined) ? true : false}>
                        <div>Mohon isi nomor doc sap terlebih dahulu</div>
                    </Alert>
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
                                    <Col md={6}>: {detailMut.length !== 0 ? moment(detailMut[0].tgl_mutasifisik).format('DD MMMM YYYY') : ''}</Col>
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
                                            <th onClick={() => this.openModalRinci(this.setState({dataRinci: item, kode: '', img: ''}))} scope="row">{detailMut.indexOf(item) + 1}</th>
                                            <td onClick={() => this.openModalRinci(this.setState({dataRinci: item, kode: '', img: ''}))} >{item.no_asset}</td>
                                            <td onClick={() => this.openModalRinci(this.setState({dataRinci: item, kode: '', img: ''}))} >{item.nama_asset}</td>
                                            <td onClick={() => this.openModalRinci(this.setState({dataRinci: item, kode: '', img: ''}))} >{item.merk}</td>
                                            <td onClick={() => this.openModalRinci(this.setState({dataRinci: item, kode: '', img: ''}))} >{item.kategori}</td>
                                            <td onClick={() => this.openModalRinci(this.setState({dataRinci: item, kode: '', img: ''}))} >{item.area}</td>
                                            <td onClick={() => this.openModalRinci(this.setState({dataRinci: item, kode: '', img: ''}))} >{item.cost_center}</td>
                                            <td onClick={() => this.openModalRinci(this.setState({dataRinci: item, kode: '', img: ''}))} >{item.area_rec}</td>
                                            <td onClick={() => this.openModalRinci(this.setState({dataRinci: item, kode: '', img: ''}))} >{item.cost_center_rec}</td>
                                            <td> 
                                                <Input
                                                addon
                                                type="checkbox"
                                                onClick={listMut.find(element => element === item.no_asset) === undefined ? () => this.chekRej(item.no_asset) : () => this.chekApp(item.no_asset)}
                                                value={item.no_asset} />
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
                    {/* onClick={() => this.openModPreview({nama: 'disposal pengajuan', no: detailDis[0] !== undefined && detailDis[0].no_disposal})} */}
                        <div className="btnFoot">
                            <Button className="mr-2" color="primary" onClick={this.getDataApprove}>Preview</Button>
                            <Button color="warning" onClick={this.openProsesModalDoc}>Dokumen</Button>
                        </div>
                        <div className="btnFoot">
                            <Button className="mr-2" disabled={listMut.length === 0 ? true : false} color="danger" onClick={() => this.openReject()}>
                                Reject
                            </Button>
                            {/* disabled={detailMut[0] === undefined || detailMut[0].docAsset.find(({divisi}) => divisi === '3') === undefined ? true :  detailMut.find(({isbudget}) => isbudget === null) !== undefined ? true : listMut.length === 0 ? false : true} */}
                            <Button color="success" disabled={detailMut[0] === undefined || detailMut[0].docAsset.find(({divisi}) => divisi === '3') === undefined ? true : (detailMut.find(({isbudget}) => isbudget === 'ya') === undefined && (detailMut.find(({doc_sap}) => doc_sap === null) !== undefined || detailMut.find(({doc_sap}) => doc_sap === '') !== undefined)) ? true : listMut.length === 0 ? false : true} onClick={() => this.openApprove()}>
                                Submit
                            </Button>
                        </div>
                    </div>
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
                                        </Col>
                                    ) : (
                                        <Col md={6} lg={6} className="colDoc">
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
                            <Button color="success" onClick={() => this.downloadData()}>Download</Button>
                        </div>
                        {level === '2' ? (
                            <div>
                                <Button color="danger" disabled={fileName.divisi === '3' ? true : false} className="mr-3" onClick={this.openModalRejectDis}>Reject</Button>
                                <Button color="primary" disabled={fileName.divisi === '0' ? true : false} onClick={this.openModalApproveDis}>Approve</Button>
                            </div>
                        ) : (
                            <Button color="primary" onClick={this.openModalPdf}>Close</Button>
                        )}
                    </div>
                </ModalBody>
            </Modal>
            <Modal isOpen={this.state.modalConfirm} toggle={this.openConfirm}>
                <ModalBody>
                    {this.state.confirm === 'approve' ?(
                        <div>
                            <div className={style.cekUpdate}>
                            <AiFillCheckCircle size={80} className={style.green} />
                            <div className={[style.sucUpdate, style.green]}>Berhasil Submit Eksekusi Mutasi</div>
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
            <Modal isOpen={this.state.approve} toggle={this.openApprove} centered={true}>
                <ModalBody>
                    <div className={style.modalApprove}>
                        <div>
                            <text>
                                Anda yakin untuk submit eksekusi
                                <text className={style.verif}> mutasi </text>
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
    notif: state.notif,
    disposal: state.disposal,
    pengadaan: state.pengadaan
})

const mapDispatchToProps = {
    logout: auth.logout,
    getAsset: asset.getAsset,
    resetError: asset.resetError,
    nextPage: asset.nextPage,
    addMutasi: mutasi.addMutasi,
    getMutasi: mutasi.getMutasi,
    approveMut: mutasi.approveMutasi,
    rejectMut: mutasi.rejectMutasi,
    getApproveMut: mutasi.getApproveMutasi,
    getMutasiRec: mutasi.getMutasiRec,
    getDocumentMut: mutasi.getDocumentMut,
    resetAddMut: mutasi.resetAddMut,
    resetAppRej: mutasi.resetAppRej,
    showDokumen: pengadaan.showDokumen,
    getNotif: notif.getNotif,
    rejectDocMut: mutasi.rejectDocMut,
    approveDocDis: disposal.approveDocDis,
    resetDis: disposal.reset,
    rejectEks: mutasi.rejectEksekusi,
    getDetailMutasi: mutasi.getDetailMutasi,
    updateBudget: mutasi.updateBudget,
    submitEksekusi: mutasi.submitEksekusi,
    updateStatus: mutasi.updateStatus
}

export default connect(mapStateToProps, mapDispatchToProps)(EksekusiMut)