import React, { Component } from 'react'
import { Container, Collapse, Nav, Navbar,
    NavbarToggler, NavbarBrand, NavItem, NavLink,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, Dropdown,
    DropdownItem, Table, ButtonDropdown, Input, Button,
    Modal, ModalHeader, ModalBody, ModalFooter, Alert, Spinner} from 'reactstrap'
import logo from "../assets/img/logo.png"
import style from '../assets/css/input.module.css'
import {FaSearch, FaUserCircle, FaBars} from 'react-icons/fa'
import {AiOutlineFileExcel, AiFillCheckCircle} from 'react-icons/ai'
import {Formik} from 'formik'
import * as Yup from 'yup'
import depo from '../redux/actions/depo'
import {connect} from 'react-redux'
import auth from '../redux/actions/auth'
import {default as axios} from 'axios'
import Sidebar from "../components/Header";
import MaterialTitlePanel from "../components/material_title_panel";
import SidebarContent from "../components/sidebar_content";
const {REACT_APP_BACKEND_URL} = process.env

const depoSchema = Yup.object().shape({
    kode_plant: Yup.string().required('must be filled'),
    nama_area: Yup.string().required('must be filled'),
    channel: Yup.string().required('must be filled'),
    distribution: Yup.string().required('must be filled'),
    status_area: Yup.string().required('must be filled'),
    profit_center: Yup.string().required('must be filled'),
    cost_center: Yup.string().required('must be filled'),
    kode_sap_1: Yup.string().required('must be filled'),
    kode_sap_2: Yup.string().required('must be filled'),
    nama_grom: Yup.string().required('must be filled'),
    nama_rom: Yup.string().required('must be filled'),
    nama_aos: Yup.string(),
    nama_pic_1: Yup.string(),
    nama_pic_2: Yup.string(),
    nama_pic_3: Yup.string(),
    nama_pic_4: Yup.string()
});

class MasterDepo extends Component {
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
            upload: false,
            errMsg: '',
            fileUpload: '',
            limit: 10,
            search: ''
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
    }

    next = async () => {
        const { page } = this.props.depo
        const token = localStorage.getItem('token')
        await this.props.nextPage(token, page.nextLink)
    }

    prev = async () => {
        const { page } = this.props.depo
        const token = localStorage.getItem('token')
        await this.props.nextPage(token, page.prevLink)
    }

    showAlert = () => {
        this.setState({alert: true, modalEdit: false, modalAdd: false, modalUpload: false })
       
         setTimeout(() => {
            this.setState({
                alert: false
            })
         }, 10000)
    }

    DownloadTemplate = () => {
        axios({
            url: `${REACT_APP_BACKEND_URL}/masters/depo.xlsx`,
            method: 'GET',
            responseType: 'blob',
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "depo.xlsx");
            document.body.appendChild(link);
            link.click();
        });
    }

    uploadAlert = () => {
        this.setState({upload: true, modalUpload: false })
       
         setTimeout(() => {
            this.setState({
                upload: false
            })
         }, 10000)
    }

    openConfirm = () => {
        this.setState({modalConfirm: !this.state.modalConfirm})
    }

    ExportMaster = () => {
        const token = localStorage.getItem('token')
        this.props.exportMaster(token)
    }

    toggle = () => {
        this.setState({isOpen: !this.state.isOpen})
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

    addDepo = async (values) => {
        const token = localStorage.getItem("token")
        await this.props.addDepo(token, values)
        const {isAdd} = this.props.depo
        if (isAdd) {
            this.setState({confirm: 'add'})
            this.openConfirm()
            this.openModalAdd()
            setTimeout(() => {
                this.getDataDepo()
            }, 500)
        }
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

    uploadMaster = async () => {
        const token = localStorage.getItem('token')
        const data = new FormData()
        data.append('master', this.state.fileUpload)
        await this.props.uploadMaster(token, data)
    }

    editDepo = async (values, id) => {
        const token = localStorage.getItem("token")
        await this.props.updateDepo(token, id, values)
        const {isUpdate} = this.props.depo
        if (isUpdate) {
            this.setState({confirm: 'edit'})
            this.openConfirm()
            this.getDataDepo()
            this.openModalEdit()
        }
    }

    componentDidUpdate() {
        const {isError, isUpload, isExport} = this.props.depo
        if (isError) {
            this.props.resetError()
            this.showAlert()
        } else if (isUpload) {
            setTimeout(() => {
                this.props.resetError()
                this.setState({modalUpload: false})
             }, 2000)
             setTimeout(() => {
                this.getDataDepo()
             }, 2100)
        } else if (isExport) {
            this.props.resetError()
            this.DownloadMaster()
        }
    }

    DownloadMaster = () => {
        const {link} = this.props.depo
        axios({
            url: `${link}`,
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "master depo.xlsx"); //or any other extension
            document.body.appendChild(link);
            link.click();
        });
    }

    componentDidMount() {
        this.getDataDepo()
    }

    onSearch = (e) => {
        this.setState({search: e.target.value})
        if(e.key === 'Enter'){
            this.getDataDepo({limit: 10, search: this.state.search})
        }
    }

    getDataDepo = async (value) => {
        const token = localStorage.getItem("token")
        const { page } = this.props.depo
        const search = value === undefined ? '' : this.state.search
        const limit = value === undefined ? this.state.limit : value.limit
        await this.props.getDepo(token, limit, search, page.currentPage)
        this.setState({limit: value === undefined ? 10 : value.limit})
    }

    menuButtonClick(ev) {
        ev.preventDefault();
        this.onSetOpen(!this.state.open);
    }

    onSetOpen(open) {
        this.setState({ open });
    }

    render() {
        const {isOpen, dropOpen, dropOpenNum, detail, alert, upload, errMsg} = this.state
        const {dataDepo, isGet, alertM, alertMsg, alertUpload, page} = this.props.depo
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
                            <Alert color="danger" className={style.alertWrong} isOpen={this.state.alert}>
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
                                    <div className={style.titleDashboard}>Master Depo</div>
                                </div>
                                <div className={style.secHeadDashboard}>
                                    <div>
                                        <text>Show: </text>
                                        <ButtonDropdown className={style.drop} isOpen={dropOpen} toggle={this.dropDown}>
                                        <DropdownToggle caret color="light">
                                            {this.state.limit}
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem className={style.item} onClick={() => this.getDataDepo({limit: 10, search: ''})}>10</DropdownItem>
                                            <DropdownItem className={style.item} onClick={() => this.getDataDepo({limit: 20, search: ''})}>20</DropdownItem>
                                            <DropdownItem className={style.item} onClick={() => this.getDataDepo({limit: 50, search: ''})}>50</DropdownItem>
                                        </DropdownMenu>
                                        </ButtonDropdown>
                                        <text className={style.textEntries}>entries</text>
                                    </div>
                                </div>
                                <div className={style.secEmail}>
                                    <div className={style.headEmail}>
                                        <Button onClick={this.openModalAdd} color="primary" size="lg">Add</Button>
                                        <Button onClick={this.openModalUpload} color="warning" size="lg">Upload</Button>
                                        <Button color="success" size="lg" onClick={this.ExportMaster}>Download</Button>
                                    </div>
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
                                {isGet === false ? (
                                    <div className={style.tableDashboard}>
                                    <Table bordered responsive hover className={style.tab}>
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Kode Plant</th>
                                                <th>Nama Area</th>
                                                <th>Channel</th>
                                                <th>Distribution</th>
                                                <th>Status Depo</th>
                                                <th>Profit Center</th>
                                                <th>Cost Center</th>
                                                <th>Kode SAP 1</th>
                                                <th>Kode SAP 2</th>
                                                <th>Nama GROM</th>
                                                <th>Nama ROM</th>
                                                <th>Nama AOS</th>
                                                <th>Nama PIC 1</th>
                                                <th>Nama PIC 2</th>
                                                <th>Nama PIC 3</th>
                                                <th>Nama PIC 4</th>
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
                                                <th>Kode Plant</th>
                                                <th>Nama Area</th>
                                                <th>Channel</th>
                                                <th>Distribution</th>
                                                <th>Status Depo</th>
                                                <th>Profit Center</th>
                                                <th>Cost Center</th>
                                                <th>Kode SAP 1</th>
                                                <th>Kode SAP 2</th>
                                                <th>Nama GROM</th>
                                                <th>Nama ROM</th>
                                                <th>Nama AOS</th>
                                                <th>Nama PIC 1</th>
                                                <th>Nama PIC 2</th>
                                                <th>Nama PIC 3</th>
                                                <th>Nama PIC 4</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dataDepo.length !== 0 && dataDepo.map(item => {
                                                return (
                                                <tr onClick={() => this.openModalEdit(this.setState({detail: item}))}>
                                                    <th scope="row">{(dataDepo.indexOf(item) + (((page.currentPage - 1) * page.limitPerPage) + 1))}</th>
                                                    <td>{item.kode_plant}</td>
                                                    <td>{item.nama_area}</td>
                                                    <td>{item.channel}</td>
                                                    <td>{item.distribution}</td>
                                                    <td>{item.status_area}</td>
                                                    <td>{item.profit_center}</td>
                                                    <td>{item.cost_center}</td>
                                                    <td>{item.kode_sap_1}</td>
                                                    <td>{item.kode_sap_2}</td>
                                                    <td>{item.nama_grom}</td>
                                                    <td>{item.nama_rom}</td>
                                                    <td>{item.nama_aos}</td>
                                                    <td>{item.nama_pic_1}</td>
                                                    <td>{item.nama_pic_2}</td>
                                                    <td>{item.nama_pic_3}</td>
                                                    <td>{item.nama_pic_4}</td>
                                                </tr>
                                                )})}
                                        </tbody>
                                    </Table>
                                </div>
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
                <Modal toggle={this.openModalAdd} isOpen={this.state.modalAdd} size="lg">
                    <ModalHeader toggle={this.openModalAdd}>Add Master Depo</ModalHeader>
                    <Formik
                    initialValues={{
                        nama_area: "",
                        channel: "",
                        distribution: "",
                        status_area: "",
                        profit_center: "",
                        cost_center: "",
                        kode_sap_1: "",
                        kode_sap_2: "",
                        kode_plant: "",
                        nama_grom: "",
                        nama_rom: "",
                        nama_aos: "",
                        nama_pic_1: "",
                        nama_pic_2: "",
                        nama_pic_3: "",
                        nama_pic_4: ""
                    }}
                    validationSchema={depoSchema}
                    onSubmit={(values) => {this.addDepo(values)}}
                    >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                    <div className={style.bodyDepo}>
                    <ModalBody className={style.addDepo}>
                        <div className="col-md-6">
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Kode Plant
                                </text>
                                <div className="col-md-8">
                                    <Input
                                    type="text" 
                                    name="kode_plant"
                                    value={values.kode_plant}
                                    onBlur={handleBlur("kode_plant")}
                                    onChange={handleChange("kode_plant")}
                                    />
                                    {errors.kode_plant ? (
                                        <text className={style.txtError}>{errors.kode_plant}</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Nama Area
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="nama_area"
                                value={values.nama_area}
                                onBlur={handleBlur("nama_area")}
                                onChange={handleChange("nama_area")}
                                />
                                {errors.nama_area ? (
                                    <text className={style.txtError}>{errors.nama_area}</text>
                                ) : null}
                                </div>    
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Channel
                                </text>
                                <div className="col-md-8">
                                    <Input 
                                    type="select" 
                                    name="select"
                                    value={values.channel}
                                    onChange={handleChange("channel")}
                                    onBlur={handleBlur("channel")}
                                    >
                                        <option>-Pilih Channel-</option>
                                        <option value="GT">GT</option>
                                        <option value="MT">MT</option>
                                    </Input>
                                    {errors.channel ? (
                                        <text className={style.txtError}>{errors.channel}</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Distribution
                                </text>
                                <div className="col-md-8">
                                    <Input 
                                    type="select" 
                                    name="select"
                                    value={values.distribution}
                                    onChange={handleChange("distribution")}
                                    onBlur={handleBlur("distribution")}
                                    >
                                        <option>-Pilih Distribution-</option>
                                        <option value="PMA">PMA</option>
                                        <option value="SUB">SUB</option>
                                    </Input>
                                    {errors.distribution ? (
                                        <text className={style.txtError}>{errors.distribution}</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Status Area
                                </text>
                                <div className="col-md-8">
                                    <Input 
                                    type="select" 
                                    name="select"
                                    value={values.status_area}
                                    onChange={handleChange("status_area")}
                                    onBlur={handleBlur("status_area")}
                                    >
                                        <option>-Pilih Status Depo-</option>
                                        <option value="Cabang SAP">Cabang SAP</option>
                                        <option value="Cabang Scylla">Cabang Scylla</option>
                                        <option value="Depo SAP">Depo SAP</option>
                                        <option value="Depo Scylla">Depo Scylla</option>
                                    </Input>
                                    {errors.status_area ? (
                                        <text className={style.txtError}>{errors.status_area}</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Profit Center
                                </text>
                                <div className="col-md-8">
                                    <Input 
                                    type="name" 
                                    name="nama_spv"
                                    value={values.profit_center}
                                    onBlur={handleBlur("profit_center")}
                                    onChange={handleChange("profit_center")}
                                    />
                                    {errors.profit_center ? (
                                        <text className={style.txtError}>{errors.profit_center}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Cost Center
                                </text>
                                <div className="col-md-8">
                                    <Input 
                                    type="name" 
                                    name="nama_spv"
                                    value={values.cost_center}
                                    onBlur={handleBlur("cost_center")}
                                    onChange={handleChange("cost_center")}
                                    />
                                    {errors.cost_center ? (
                                        <text className={style.txtError}>{errors.cost_center}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Kode SAP 1
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="nama_spv"
                                value={values.kode_sap_1}
                                onBlur={handleBlur("kode_sap_1")}
                                onChange={handleChange("kode_sap_1")}
                                />
                                   {errors.kode_sap_1 ? (
                                        <text className={style.txtError}>{errors.kode_sap_1}</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Kode SAP 2
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="nama_spv"
                                value={values.kode_sap_2}
                                onBlur={handleBlur("kode_sap_2")}
                                onChange={handleChange("kode_sap_2")}
                                />
                                   {errors.kode_sap_2 ? (
                                        <text className={style.txtError}>{errors.kode_sap_2}</text>
                                    ) : null}
                                </div>    
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Nama GROM
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="nama_spv"
                                value={values.nama_grom}
                                onBlur={handleBlur("nama_grom")}
                                onChange={handleChange("nama_grom")}
                                />
                                   {errors.nama_grom ? (
                                        <text className={style.txtError}>{errors.nama_grom}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Nama ROM
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="nama_spv"
                                value={values.nama_rom}
                                onBlur={handleBlur("nama_rom")}
                                onChange={handleChange("nama_rom")}
                                />
                                    {errors.nama_rom ? (
                                        <text className={style.txtError}>{errors.nama_rom}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Nama AOS
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="nama_spv"
                                value={values.nama_aos}
                                onBlur={handleBlur("nama_aos")}
                                onChange={handleChange("nama_aos")}
                                />
                                    {errors.nama_aos ? (
                                        <text className={style.txtError}>{errors.nama_aos}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Nama PIC 1
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="nama_spv"
                                value={values.nama_pic_1}
                                onBlur={handleBlur("nama_pic_1")}
                                onChange={handleChange("nama_pic_1")}
                                />
                                    {errors.nama_pic_1 ? (
                                        <text className={style.txtError}>{errors.nama_pic_1}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Nama PIC 2
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="nama_spv"
                                value={values.nama_pic_2}
                                onBlur={handleBlur("nama_pic_2")}
                                onChange={handleChange("nama_pic_2")}
                                />
                                    {errors.nama_pic_2 ? (
                                        <text className={style.txtError}>{errors.nama_pic_2}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Nama PIC 3
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="nama_spv"
                                value={values.nama_pic_3}
                                onBlur={handleBlur("nama_pic_3")}
                                onChange={handleChange("nama_pic_3")}
                                />
                                    {errors.nama_pic_3 ? (
                                        <text className={style.txtError}>{errors.nama_pic_3}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Nama PIC 4
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="nama_spv"
                                value={values.nama_pic_4}
                                onBlur={handleBlur("nama_pic_4")}
                                onChange={handleChange("nama_pic_4")}
                                />
                                    {errors.nama_pic_4 ? (
                                        <text className={style.txtError}>{errors.nama_pic_4}</text>
                                    ) : null}
                                </div>    
                            </div>
                        </div>
                    </ModalBody>
                        <hr/>
                        <div className={style.foot, "mb-3"}>
                            <div></div>
                            <div>
                                <Button className="mr-2" onClick={handleSubmit} color="primary">Save</Button>
                                <Button className="mr-5" onClick={this.openModalAdd}>Cancel</Button>
                            </div>
                        </div>
                    </div>
                    )}
                    </Formik>
                </Modal>
                <Modal toggle={this.openModalEdit} isOpen={this.state.modalEdit} size="lg">
                    <ModalHeader toggle={this.openModalEdit}>Edit Master Depo</ModalHeader>
                    <Formik
                    initialValues={{
                        nama_area: detail.nama_area,
                        channel: detail.channel,
                        distribution: detail.distribution,
                        status_area: detail.status_area,
                        profit_center: detail.profit_center,
                        cost_center: detail.cost_center,
                        kode_sap_1: detail.kode_sap_1,
                        kode_sap_2: detail.kode_sap_2,
                        kode_plant: detail.kode_plant,
                        nama_grom: detail.nama_grom,
                        nama_rom: detail.nama_rom,
                        nama_aos: detail.nama_aos,
                        nama_pic_1: detail.nama_pic_1,
                        nama_pic_2: detail.nama_pic_2,
                        nama_pic_3: detail.nama_pic_3,
                        nama_pic_4: detail.nama_pic_4
                    }}
                    validationSchema={depoSchema}
                    onSubmit={(values) => {this.editDepo(values, detail.id)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                        <div className={style.bodyDepo}>
                        <ModalBody className={style.addDepo}>
                        <div className="col-md-6">
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Kode Plant
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name"
                                name="nama_spv"
                                value={values.kode_plant}
                                onBlur={handleBlur("kode_plant")}
                                onChange={handleChange("kode_plant")}
                                />
                                   {errors.kode_plant ? (
                                        <text className={style.txtError}>{errors.kode_plant}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Nama Area
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="nama_area"
                                value={values.nama_area}
                                onBlur={handleChange("nama_area")}
                                onChange={handleBlur("nama_area")}
                                />
                                {errors.nama_area ? (
                                    <text className={style.txtError}>{errors.nama_area}</text>
                                ) : null}
                                </div>    
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Channel
                                </text>
                                <div className="col-md-8">
                                    <Input 
                                    type="select" 
                                    name="select"
                                    value={values.channel}
                                    onChange={handleChange("channel")}
                                    onBlur={handleBlur("channel")}
                                    >
                                        <option>-Pilih Channel-</option>
                                        <option value="GT">GT</option>
                                        <option value="MT">MT</option>
                                    </Input>
                                    {errors.channel ? (
                                        <text className={style.txtError}>{errors.channel}</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Distribution
                                </text>
                                <div className="col-md-8">
                                    <Input 
                                    type="select" 
                                    name="select"
                                    value={values.distribution}
                                    onChange={handleChange("distribution")}
                                    onBlur={handleBlur("distribution")}
                                    >
                                        <option>-Pilih Distribution-</option>
                                        <option value="PMA">PMA</option>
                                        <option value="SUB">SUB</option>
                                    </Input>
                                    {errors.distribution ? (
                                        <text className={style.txtError}>{errors.distribution}</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Status Depo
                                </text>
                                <div className="col-md-8">
                                    <Input 
                                    type="select" 
                                    name="select"
                                    value={values.status_area}
                                    onChange={handleChange("status_area")}
                                    onBlur={handleBlur("status_area")}
                                    >
                                        <option>-Pilih Status Depo-</option>
                                        <option value="Cabang SAP">Cabang SAP</option>
                                        <option value="Cabang Scylla">Cabang Scylla</option>
                                        <option value="Depo SAP">Depo SAP</option>
                                        <option value="Depo Scylla">Depo Scylla</option>
                                    </Input>
                                    {errors.status_area ? (
                                        <text className={style.txtError}>{errors.status_area}</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Profit Center
                                </text>
                                <div className="col-md-8">
                                    <Input 
                                    type="name" 
                                    name="nama_spv"
                                    value={values.profit_center}
                                    onBlur={handleBlur("profit_center")}
                                    onChange={handleChange("profit_center")}
                                    />
                                    {errors.profit_center ? (
                                        <text className={style.txtError}>{errors.profit_center}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Cost Center
                                </text>
                                <div className="col-md-8">
                                    <Input 
                                    type="name" 
                                    name="nama_spv"
                                    value={values.cost_center}
                                    onBlur={handleBlur("cost_center")}
                                    onChange={handleChange("cost_center")}
                                    />
                                    {errors.cost_center ? (
                                        <text className={style.txtError}>{errors.cost_center}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Kode SAP 1
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="nama_spv"
                                value={values.kode_sap_1}
                                onBlur={handleBlur("kode_sap_1")}
                                onChange={handleChange("kode_sap_1")}
                                />
                                   {errors.kode_sap_1 ? (
                                        <text className={style.txtError}>{errors.kode_sap_1}</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Kode SAP 2
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="nama_spv"
                                value={values.kode_sap_2}
                                onBlur={handleBlur("kode_sap_2")}
                                onChange={handleChange("kode_sap_2")}
                                />
                                   {errors.kode_sap_2 ? (
                                        <text className={style.txtError}>{errors.kode_sap_2}</text>
                                    ) : null}
                                </div>    
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Nama GROM
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="nama_spv"
                                value={values.nama_grom}
                                onBlur={handleBlur("nama_grom")}
                                onChange={handleChange("nama_grom")}
                                />
                                   {errors.nama_grom ? (
                                        <text className={style.txtError}>{errors.nama_grom}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Nama ROM
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="nama_spv"
                                value={values.nama_rom}
                                onBlur={handleBlur("nama_rom")}
                                onChange={handleChange("nama_rom")}
                                />
                                    {errors.nama_rom ? (
                                        <text className={style.txtError}>{errors.nama_rom}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Nama AOS
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="nama_spv"
                                value={values.nama_aos}
                                onBlur={handleBlur("nama_aos")}
                                onChange={handleChange("nama_aos")}
                                />
                                    {errors.nama_aos ? (
                                        <text className={style.txtError}>{errors.nama_aos}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Nama PIC 1
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="nama_spv"
                                value={values.nama_pic_1}
                                onBlur={handleBlur("nama_pic_1")}
                                onChange={handleChange("nama_pic_1")}
                                />
                                    {errors.nama_pic_1 ? (
                                        <text className={style.txtError}>{errors.nama_pic_1}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Nama PIC 2
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="nama_spv"
                                value={values.nama_pic_2}
                                onBlur={handleBlur("nama_pic_2")}
                                onChange={handleChange("nama_pic_2")}
                                />
                                    {errors.nama_pic_2 ? (
                                        <text className={style.txtError}>{errors.nama_pic_2}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Nama PIC 3
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="nama_spv"
                                value={values.nama_pic_3}
                                onBlur={handleBlur("nama_pic_3")}
                                onChange={handleChange("nama_pic_3")}
                                />
                                    {errors.nama_pic_3 ? (
                                        <text className={style.txtError}>{errors.nama_pic_3}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-4">
                                    Nama PIC 4
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="nama_spv"
                                value={values.nama_pic_4}
                                onBlur={handleBlur("nama_pic_4")}
                                onChange={handleChange("nama_pic_4")}
                                />
                                    {errors.nama_pic_4 ? (
                                        <text className={style.txtError}>{errors.nama_pic_4}</text>
                                    ) : null}
                                </div>    
                            </div>
                        </div>
                    </ModalBody>
                    <hr/>
                        <div className={style.foot}>
                            <div></div>
                            <div>
                                <Button className="mr-2" onClick={handleSubmit} color="primary">Save</Button>
                                <Button className="mr-5" onClick={this.openModalEdit}>Cancel</Button>
                            </div>
                        </div>
                    </div>
                    )}
                    </Formik>
                </Modal>
                <Modal toggle={this.openModalUpload} isOpen={this.state.modalUpload} >
                    <ModalHeader>Upload Master Depo</ModalHeader>
                    <ModalBody className={style.modalUpload}>
                        <div className={style.titleModalUpload}>
                            <text>Upload File: </text>
                            <div className={style.uploadFileInput}>
                                <AiOutlineFileExcel size={35} />
                                <div className="ml-3">
                                    <Input
                                    type="file"
                                    name="file"
                                    accept=".xls,.xlsx"
                                    onChange={this.onChangeHandler}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={style.btnUpload}>
                            <Button color="info" onClick={this.DownloadTemplate}>Download Template</Button>
                            <Button color="primary" disabled={this.state.fileUpload === "" ? true : false } onClick={this.uploadMaster}>Upload</Button>
                            <Button onClick={this.openModalUpload}>Cancel</Button>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalConfirm} toggle={this.openConfirm} size="sm">
                    <ModalBody>
                        {this.state.confirm === 'edit' ? (
                        <div className={style.cekUpdate}>
                            <AiFillCheckCircle size={80} className={style.green} />
                            <div className={style.sucUpdate}>Berhasil Memperbarui Depo</div>
                        </div>
                        ) : this.state.confirm === 'add' ? (
                            <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Menambahkan Depo</div>
                            </div>
                        ) : this.state.confirm === 'upload' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Mengupload Master Depo</div>
                            </div>
                            </div>
                        ) : (
                            <div></div>
                        )}
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.props.depo.isLoading ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className={style.cekUpdate}>
                                <Spinner />
                                <div sucUpdate>Waiting....</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
                <Modal isOpen={this.props.depo.isUpload ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Mengupload Master</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
            </>
        )
    }
}

const mapStateToProps = state => ({
    depo: state.depo
})

const mapDispatchToProps = {
    logout: auth.logout,
    addDepo: depo.addDepo,
    updateDepo: depo.updateDepo,
    getDepo: depo.getDepo,
    resetError: depo.resetError,
    uploadMaster: depo.uploadMaster,
    nextPage: depo.nextPage,
    exportMaster: depo.exportMaster
}

export default connect(mapStateToProps, mapDispatchToProps)(MasterDepo)
