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
import {FaSearch, FaUserCircle, FaBars, FaCartPlus, FaTh, FaList} from 'react-icons/fa'
import Sidebar from "../components/Header";
import { AiOutlineCheck, AiOutlineClose} from 'react-icons/ai'
import MaterialTitlePanel from "../components/material_title_panel"
import SidebarContent from "../components/sidebar_content"
import style from '../assets/css/input.module.css'
import placeholder from  "../assets/img/placeholder.png"
import asset from '../redux/actions/asset'
import b from "../assets/img/b.jpg"
import e from "../assets/img/e.jpg"
import {connect} from 'react-redux'
import moment from 'moment'
import {Formik} from 'formik'
import * as Yup from 'yup'
import auth from '../redux/actions/auth'
import disposal from '../redux/actions/disposal'
import depo from '../redux/actions/depo'
import stock from '../redux/actions/stock'
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
            alert: false
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
    }

    submitStock = async () => {
        const token = localStorage.getItem('token')
        await this.props.submitStock(token)
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
            this.getDataAsset()
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
        const {dataItem} = this.state
        const token = localStorage.getItem('token')
        await this.props.rejectStock(token, dataItem.no_stock, value)
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
        await this.props.nextPage(token, page.nextLink)
    }

    prev = async () => {
        const { page } = this.props.asset
        const token = localStorage.getItem('token')
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

    componentDidUpdate() {
        const {isUpload, isError} = this.props.stock
        if (isUpload) {
            this.props.resetStock()
             setTimeout(() => {
                this.getDataAsset()
             }, 100)
        } else if (isError) {
            this.props.resetStock()
            this.showAlert()
        }
    }

    openModalEdit = () => {
        this.setState({modalEdit: !this.state.modalEdit})
    }

    getDataAsset = async (value) => {
        const token = localStorage.getItem("token")
        const { page } = this.props.asset
        const search = value === undefined ? '' : this.state.search
        const limit = value === undefined ? this.state.limit : value.limit
        await this.props.getAsset(token, limit, search, page.currentPage)
        await this.props.getDetailDepo(token, 1)
        this.setState({limit: value === undefined ? 10 : value.limit})
    }

    getDataStock = async (value) => {
        const token = localStorage.getItem("token")
        // const { page } = this.props.disposal
        // const search = value === undefined ? '' : this.state.search
        // const limit = value === undefined ? this.state.limit : value.limit
        await this.props.getStockAll(token)
        await this.props.getNameApprove(token)
        this.setState({limit: value === undefined ? 10 : value.limit})
    }

    getDataList = async () => {
        const token = localStorage.getItem("token")
        await this.props.getDepo(token, 400, '', 1)
        await this.props.getStockAll(token)
    }

    updateAsset = async (value) => {
        const token = localStorage.getItem("token")
        const { dataRinci, fisik, kondisi } = this.state
        const data = {
            merk: value.merk,
            satuan: value.satuan,
            unit: value.unit,
            lokasi: value.lokasi,
            grouping: value.grouping,
            keterangan: value.keterangan,
            status_fisik: fisik,
            kondisi: kondisi
        }
        await this.props.updateAsset(token, dataRinci.id, data)
        this.getDataAsset()
    }

    changeView = (val) => {
        this.setState({view: val})
        if (val === 'list') {
            this.getDataList()
        } else {
            this.getDataStock()
        }
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

    render() {
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const {dataRinci, dropApp, dataItem} = this.state
        const { detailDepo, dataDepo } = this.props.depo
        const { dataName } = this.props.approve
        const {dataAsset, alertUpload, page} = this.props.asset
        const { dataStock, detailStock, stockApp, dataStatus, alertM, alertMsg } = this.props.stock
        const pages = this.props.depo.page
        const { dataDis, noDis, dataDoc, disApp } = this.props.disposal

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
                                            {/* <Button color="success" size="lg" onClick={this.openModalDis}>Open Form</Button> */}
                                            <Button onClick={this.submitStock} color="info" size="lg" className="btnGoCart">Submit</Button>
                                        </div>
                                    ) : (
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
                                    this.props.asset.isGet === false ? (
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
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dataAsset.length !== 0 && dataAsset.map(item => {
                                                    return (
                                                    <tr onClick={() => this.openModalEdit(this.setState({dataRinci: item}))}>
                                                        <th scope="row">{(dataAsset.indexOf(item) + (((page.currentPage - 1) * page.limitPerPage) + 1))}</th>
                                                        <td>{item.no_asset}</td>
                                                        <td>{item.nama_asset}</td>
                                                        <td>{item.merk}</td>
                                                        <td>{item.satuan}</td>
                                                        <td>{item.unit}</td>
                                                        <td>{item.lokasi}</td>
                                                        <td>{item.status_fisik}</td>
                                                        <td>{item.kondisi}</td>
                                                        <td>{item.grouping}</td>
                                                        <td>{item.keterangan}</td>
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
                                                            <img src={item.no_asset === '4100000150' ? b : item.no_asset === '4300001770' ? e : placeholder} className="imgCard" />
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
                                                                    <Button className="btnSell" color="primary" onClick={() => this.getDetailStock(item)}>Proses</Button>
                                                                    <Button className="btnSell ml-2" color="danger" onClick={() => this.deleteStock(item)}>Delete</Button>
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
                <Modal isOpen={this.state.modalEdit} toggle={this.openModalEdit} size="lg">
                    <ModalHeader>
                        Rincian
                    </ModalHeader>
                    <ModalBody>
                        <div className="mainRinci2">
                            <div className="leftRinci2 mb-5">
                                <div className="titRinci">{dataRinci.nama_asset}</div>
                                <img src={dataRinci.pict === undefined || dataRinci.pict.length === 0 ? placeholder : `${REACT_APP_BACKEND_URL}/${dataRinci.pict[dataRinci.pict.length - 1].path}`} className="imgRinci" />
                                <Input type="file" onChange={this.uploadPicture}>Upload Picture</Input>
                                {/* <div className="secImgSmall">
                                    <button className="btnSmallImg">
                                        <img src={placeholder} className="imgSmallRinci" />
                                    </button>
                                </div> */}
                            </div>
                            <Formik
                            initialValues = {{
                                merk: dataRinci.merk === null ? '' : dataRinci.merk,
                                satuan: dataRinci.satuan === null ? '' : dataRinci.satuan,
                                unit: 1,
                                lokasi: dataRinci.lokasi === null ? '' : dataRinci.lokasi,
                                grouping: dataRinci.grouping === null ? '' : dataRinci.grouping,
                                keterangan: dataRinci.keterangan === null ? '' : dataRinci.keterangan
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
                                                type= "select" 
                                                className="inputRinci"
                                                value={values.satuan}
                                                onBlur={handleBlur("satuan")}
                                                onChange={handleChange("satuan")}
                                                >
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
                                                type="select"
                                                className="inputRinci" 
                                                value={this.state.fisik} 
                                                onBlur={handleBlur("status_fisik")}
                                                onChange={e => { handleChange("status_fisik"); this.selectStatus(e.target.value, this.state.kondisi)} }
                                                >
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
                                                type="select"
                                                className="inputRinci" 
                                                value={this.state.kondisi} 
                                                onBlur={handleBlur("kondisi")}
                                                onChange={e => { handleChange("kondisi"); this.selectStatus(this.state.fisik, e.target.value)} }
                                                >
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
                                                type= "select" 
                                                className="inputRinci"
                                                value={values.grouping}
                                                onBlur={handleBlur("grouping")}
                                                onChange={handleChange("grouping")}
                                                >
                                                    <option>-Pilih Status Aset-</option>
                                                    {dataStatus.length > 0 && dataStatus.map(item => {
                                                        return (
                                                            <option value={item.status}>{item.status}</option>
                                                        )
                                                    })}
                                                </Input>
                                            </Col>
                                        </Row>
                                        {errors.grouping ? (
                                            <text className={style.txtError}>{errors.grouping}</text>
                                        ) : null}
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Keterangan</Col>
                                            <Col md={9} className="colRinci">:  <Input
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
                                        <Button className="btnFootRinci1 mr-3" size="md" color="primary" onClick={handleSubmit}>Save</Button>
                                        <Button className="btnFootRinci1" size="md" color="secondary" onClick={() => this.openModalEdit()}>Close</Button>
                                    </ModalFooter>
                                </div>
                            )}
                            </Formik>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalRinci} toggle={this.openModalRinci} size="xl">
                    <ModalHeader>
                        Rincian
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
                                        <tr onClick={() => this.openModalEdit(this.setState({dataRinci: item}))}>
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
                    </ModalBody>
                    <div className="modalFoot ml-3">
                        {level === '1' || level === '2' ? (
                            <div>
                                <text>Pilih Approval: </text>
                                <ButtonDropdown className={style.drop} isOpen={dropApp} toggle={this.dropApp}>
                                <DropdownToggle caret color="light">
                                    {this.state.nama}
                                </DropdownToggle>
                                <DropdownMenu>
                                    {dataName.length !== 0 && dataName.map(item => {
                                        return (
                                            <DropdownItem className={style.item} onClick={() => this.getApproveStock({nama: item.name, no: dataItem.no_stock})}>{item.name}</DropdownItem>
                                        )
                                    })}
                                </DropdownMenu>
                                </ButtonDropdown>
                                <Button color="primary" className="ml-3" onClick={() => this.openPreview(dataItem.no_stock)}>Preview</Button>
                            </div>
                        ) : (
                            <Button color="primary"  onClick={() => this.openPreview(dataItem.no_stock)}>Preview</Button>
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
                                        <tr onClick={() => this.openModalEdit(this.setState({dataRinci: item}))}>
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
                                                                <div className="mb-2">{item.nama === null ? "-" : moment(item.updatedAt).format('LL')}</div>
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
                                                                <div className="mb-2">{item.nama === null ? "-" : moment(item.updatedAt).format('LL')}</div>
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
                                                                <div className="mb-2">{item.nama === null ? "-" : moment(item.updatedAt).format('LL')}</div>
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
                <Modal isOpen={this.props.stock.isLoading || this.props.depo.isLoading ? true: false} size="sm">
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
    updateAsset: asset.updateAsset,
    resetError: asset.resetError,
    nextPage: asset.nextPage,
    getDisposal: disposal.getDisposal,
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
    resetStock: stock.resetStock
}

export default connect(mapStateToProps, mapDispatchToProps)(Stock)
