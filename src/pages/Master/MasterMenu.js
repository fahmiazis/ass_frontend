/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { Component } from 'react'
import { Container, Collapse, Nav, Navbar,
    NavbarToggler, NavbarBrand, NavItem, NavLink,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, Dropdown,
    DropdownItem, Table, ButtonDropdown, Input, Button, Row, Col,
    Modal, ModalHeader, ModalBody, ModalFooter, Alert, Spinner} from 'reactstrap'
import logo from "../../assets/img/logo.png"
import style from '../../assets/css/ofr.module.css'
import {FaSearch, FaUserCircle, FaBars} from 'react-icons/fa'
import {AiOutlineFileExcel, AiFillCheckCircle, AiOutlineInbox} from 'react-icons/ai'
import {Formik} from 'formik'
import * as Yup from 'yup'
import menu from '../../redux/actions/menu'
import user from '../../redux/actions/user'
import depo from '../../redux/actions/depo'
import {connect} from 'react-redux'
import moment from 'moment'
import auth from '../../redux/actions/auth'
import sign from "../../assets/img/sign.png"
import {default as axios} from 'axios'
import Sidebar from "../../components/Header";
import MaterialTitlePanel from "../../components/material_title_panel";
import SidebarContent from "../../components/sidebar_content";
import NavBar from '../../components/NavBar'
import styleTrans from '../../assets/css/transaksi.module.css'
import NewNavbar from '../../components/NewNavbar'
const {REACT_APP_BACKEND_URL} = process.env

const menuSchema = Yup.object().shape({
    name: Yup.string().required(),
    type: Yup.string().required(),
    jenis: Yup.string(),
    routes: Yup.string(),
    timeline: Yup.number().required(),
    access: Yup.string(),
    kode_menu: Yup.string().required()
});

const nameSchema = Yup.object().shape({
    name: Yup.string().required("must be filled"),
    type: Yup.string().required("must be filled"),
    timeline: Yup.number()
})

class MasterMenu extends Component {
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
            approveName: false,
            modalMenu: false,
            detail: {},
            dataDivisi: [],
            upload: false,
            errMsg: '',
            fileUpload: '',
            limit: 10,
            search: '',
            namaMenu: '',
            tempMenu: {},
            listRole: [],
            listDepo: []
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

    openMenuName = () => {
        this.setState({approveName: !this.state.approveName})
    }

    openModalMenu = () => {
        this.setState({modalMenu: !this.state.modalMenu})
    }

    checkApp = (val) => {
        const { listRole } = this.state
        const { dataRole } = this.props.user
        if (val === 'all') {
            const data = []
            for (let i = 0; i < dataRole.length; i++) {
                data.push(dataRole[i].name)
            }
            this.setState({listRole: data})
        } else {
            listRole.push(val)
            this.setState({listRole: listRole})
        }
    }

    checkRej = (val) => {
        const { listRole } = this.state
        if (val === 'all') {
            const data = []
            this.setState({listRole: data})
        } else {
            const data = []
            for (let i = 0; i < listRole.length; i++) {
                if (listRole[i] === val) {
                    data.push()
                } else {
                    data.push(listRole[i])
                }
            }
            this.setState({listRole: data})
        }
    }

    checkDepApp = (val) => {
        const { listDepo } = this.state
        const { dataDepo } = this.props.depo
        if (val === 'all') {
            const data = []
            for (let i = 0; i < dataDepo.length; i++) {
                data.push(dataDepo[i].kode_plant)
            }
            this.setState({listDepo: data})
        } else {
            listDepo.push(val)
            this.setState({listDepo: listDepo})
        }
    }

    checkDepRej = (val) => {
        const { listDepo } = this.state
        if (val === 'all') {
            const data = []
            this.setState({listDepo: data})
        } else {
            const data = []
            for (let i = 0; i < listDepo.length; i++) {
                if (listDepo[i] === val) {
                    data.push()
                } else {
                    data.push(listDepo[i])
                }
            }
            this.setState({listDepo: data})
        }
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
        const { page } = this.props.menu
        const token = localStorage.getItem('token')
        await this.props.nextPage(token, page.nextLink)
    }

    prev = async () => {
        const { page } = this.props.menu
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

    openEdit = (val) => {
        const { access_depo, access } = val
        const arrdep = access_depo.split(',')
        const arrrole = access.split(',')
        this.setState({detail: val, listRole: arrrole, listDepo: arrdep})
        this.openModalEdit()
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
    openModalAdd = () => {
        this.setState({listRole: [], listDepo: []})
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

    deleteDataMenu = async (values) => {
        const token = localStorage.getItem("token")
        await this.props.deleteMenu(token, values)
        await this.props.getDetailMenu(token, this.state.namaMenu)
    }

    addMenu = async (values) => {
        const token = localStorage.getItem("token")
        const { listDepo, listRole } = this.state
        const data = {
            name: values.name,
            type: values.type,
            jenis: values.jenis,
            routes: values.routes,
            timeline: values.timeline,
            access: listRole.toString(),
            access_depo: listDepo.toString(),
            kode_menu: values.kode_menu
        }
        await this.props.createMenu(token, data)
        await this.props.getDetailMenu(token, this.state.namaMenu)
        this.openModalAdd()
    }

    addMenuName = async (value) => {
        const token = localStorage.getItem("token")
        await this.props.createNameMenu(token, value) 
    }

    editMenu = async (values, id) => {
        const token = localStorage.getItem("token")
        const { listDepo, listRole } = this.state
        const data = {
            name: values.name,
            type: values.type,
            jenis: values.jenis,
            routes: values.routes,
            timeline: values.timeline,
            access: listRole.toString(),
            access_depo: listDepo.toString(),
            kode_menu: values.kode_menu
        }
        await this.props.updateMenu(token, id, data)
        await this.props.getDetailMenu(token, this.state.namaMenu)
        this.openModalEdit()
    }

    componentDidUpdate() {
        const {isError, isUpload, isExport, isAdd} = this.props.menu
        if (isError) {
            this.showAlert()
            this.props.resetError()
        } else if (isUpload) {
            setTimeout(() => {
                this.props.resetError()
                this.setState({modalUpload: false})
             }, 2000)
             setTimeout(() => {
                this.getDataMenu()
             }, 2100)
        } else if (isExport) {
            this.props.resetError()
            this.DownloadMaster()
        } else if (isAdd) {
            setTimeout(() => {
                this.props.resetError()
                this.setState({approveName: false})
             }, 1000)
             setTimeout(() => {
                this.getDataMenu()
             }, 1100)
        }
    }

    onSearch = (e) => {
        this.setState({search: e.target.value})
        if(e.key === 'Enter'){
            this.getDataMenu({limit: 10, search: this.state.search})
        }
    }

    componentDidMount() {
        this.getDataMenu()
    }

    getDataMenu = async (value) => {
        const token = localStorage.getItem("token")
        await this.props.getNameMenu(token)
        await this.props.getRole(token)
        await this.props.getDepo(token, 1000, '')
        this.setState({limit: value === undefined ? 10 : value.limit})   
    }

    getDataDetailMenu = async (value) => {
        this.setState({namaMenu: value.name, tempMenu: value})
        console.log(value)
        const token = localStorage.getItem("token")
        await this.props.getDetailMenu(token, value.name)
        this.openModalMenu()
    }

    menuButtonClick(ev) {
        ev.preventDefault();
        this.onSetOpen(!this.state.open);
    }

    onSetOpen(open) {
        this.setState({ open });
    }

    render() {
        const {listDepo, isOpen, dropOpen, dropOpenNum, detail, alert, upload, errMsg, tempMenu, listRole} = this.state
        const {dataMenu, dataName, isGet, alertM, alertMsg, alertUpload, page, detailApp} = this.props.menu
        const { dataRole } = this.props.user
        const { dataDepo } = this.props.depo
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
                                    <div className={style.titleDashboard}>Master Menu</div>
                                </div>
                                <div className='secEmail'>
                                    <div className={style.headEmail}>
                                        <Button color="success" size="lg" onClick={() => this.openMenuName()}>Add</Button>
                                    </div>
                                    <div className={style.searchEmail}>
                                    </div>
                                </div>
                                {dataName.length === 0 ? (
                                    <div className={style.tableDashboard}>
                                        <Table bordered responsive hover className={style.tab}>
                                            <thead>
                                                <tr>
                                                    <th>No</th>
                                                    <th>Nama Menu</th>
                                                    <th>Tipe</th>
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
                                                    <th>Nama Menu</th>
                                                    <th>Tipe</th>
                                                    <th>Opsi</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dataName.length !== 0 && dataName.map(item => {
                                                    return (
                                                    <tr>
                                                        <th scope="row">{(dataName.indexOf(item) + 1)}</th>
                                                        <td>{item.name}</td>
                                                        <td>{item.type}</td>
                                                        <td>
                                                            <Button color='primary' onClick={() => this.getDataDetailMenu(item)}>Detail</Button>
                                                        </td>
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
                </Sidebar> */}
                <div className={styleTrans.app}>
                    <NewNavbar handleSidebar={this.prosesSidebar} handleRoute={this.goRoute} />

                    <div className={`${styleTrans.mainContent} ${this.state.sidebarOpen ? styleTrans.collapsedContent : ''}`}>
                        <h2 className={styleTrans.pageTitle}>Master Menu</h2>

                        <div className={styleTrans.searchContainer}>
                            <div>
                                <Button color="success" size="lg" onClick={() => this.openMenuName()}>Add</Button>
                            </div>
                            <div></div>
                        </div>
                        <table className={`${styleTrans.table} ${dataName.length > 0 ? styleTrans.tableFull : ''}`}>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Nama Menu</th>
                                    <th>Tipe</th>
                                    <th>Opsi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataName.length !== 0 && dataName.map(item => {
                                    return (
                                    <tr>
                                        <td scope="row">{(dataName.indexOf(item) + 1)}</td>
                                        <td>{item.name}</td>
                                        <td>{item.type}</td>
                                        <td>
                                            <Button color='primary' onClick={() => this.getDataDetailMenu(item)}>Detail</Button>
                                        </td>
                                    </tr>
                                )})}
                            </tbody>
                        </table>
                        {dataName.length === 0 && (
                            <div className={style.spinCol}>
                                <AiOutlineInbox size={50} className='mb-4' />
                                <div className='textInfo'>Data menu tidak ditemukan</div>
                            </div>
                        )}
                        <div>
                            <div className={style.infoPageEmail1}>
                                <text>Showing {page.currentPage} of {page.pages} pages</text>
                                <div className={style.pageButton}>
                                    <button className={style.btnPrev} color="info" disabled={page.prevLink === null ? true : false} onClick={this.prev}>Prev</button>
                                    <button className={style.btnPrev} color="info" disabled={page.nextLink === null ? true : false} onClick={this.next}>Next</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal toggle={this.openMenuName} isOpen={this.state.approveName} size="lg">
                    <ModalHeader toggle={this.openMenuName}>Add Master Menu</ModalHeader>
                    <Formik
                    initialValues={{
                        name: "",
                        type: "",
                        timeline: 0
                    }}
                    validationSchema={nameSchema}
                    onSubmit={(values) => {this.addMenuName(values)}}
                    >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                    <ModalBody>
                        <div className={style.addModalDepo}>
                            <text className="col-md-4">
                                Nama Menu
                            </text>
                            <div className="col-md-8">
                                <Input 
                                type="text" 
                                name="name"
                                value={values.name}
                                onChange={handleChange("name")}
                                onBlur={handleBlur("name")}
                                />
                                {errors.name ? (
                                    <text className={style.txtError}>{errors.name}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-4">
                                Tipe
                            </text>
                            <div className="col-md-8">
                                <Input 
                                type="select" 
                                name="type"
                                value={values.type}
                                onChange={handleChange("type")}
                                onBlur={handleBlur("type")}
                                >
                                    <option>-Pilih-</option>
                                    <option value='master'>Master Data</option>
                                    <option value='transaksi'>Transaksi</option>
                                </Input>
                                {errors.type ? (
                                    <text className={style.txtError}>{errors.type}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-4">
                                Timeline
                            </text>
                            <div className="col-md-8">
                                <Row>
                                    <div className='col-md-10'>
                                        <Input 
                                        type="text" 
                                        name="timeline"
                                        disabled={values.type === 'master' || values.type === '' ? true : false}
                                        value={values.timeline}
                                        onChange={handleChange("timeline")}
                                        onBlur={handleBlur("timeline")}
                                        />
                                    </div>
                                    <div className='col-md-2'>
                                        Days
                                    </div>
                                </Row>
                                {errors.timeline ? (
                                    <text className={style.txtError}>{errors.timeline}</text>
                                ) : null}
                            </div>
                        </div>
                        <hr/>
                        <div className={style.foot}>
                            <div></div>
                            <div>
                                <Button className="mr-2" onClick={handleSubmit} color="primary">Save</Button>
                                <Button className="mr-5" onClick={this.openMenuName}>Cancel</Button>
                            </div>
                        </div>
                    </ModalBody>
                    )}
                    </Formik>
                </Modal>
                <Modal size="xl" toggle={this.openModalMenu} isOpen={this.state.modalMenu}>
                    <ModalHeader>
                        List Sub Menu
                    </ModalHeader>
                    <ModalBody>
                        <div className={style.headEmail}>
                            <Button color="success" size="lg" className="mb-4" onClick={this.openModalAdd} >Add</Button>
                        </div>
                        <Table striped bordered hover responsive className={style.tab}>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Nama Sub Menu</th>
                                    <th>Tipe</th>
                                    <th>Hak akses</th>
                                    <th>Timeline</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detailApp.length !== 0 && detailApp.map(item => {
                                    return (
                                        <tr>
                                        <th>{detailApp.indexOf(item) + 1}</th>
                                        <td>{item.name}</td>
                                        <td>{item.type}</td>
                                        <td>{item.access}</td>
                                        <td>{item.timeline} days</td>
                                        <td>
                                            <Button color="danger" className="mr-1 mb-1" onClick={() => this.deleteDataMenu(item.id)}>Delete</Button>
                                            <Button color="info" onClick={() => this.openEdit(item)}>Update</Button>
                                        </td>
                                    </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </ModalBody>
                </Modal>
                <Modal toggle={this.openModalAdd} isOpen={this.state.modalAdd} size="lg">
                    <ModalHeader toggle={this.openModalAdd}>Add Menu</ModalHeader>
                    <Formik
                    initialValues={{
                        name: "",
                        type: tempMenu.type === "master" ? tempMenu.type : "",
                        jenis: "",
                        routes: "",
                        timeline: 0,
                        access: "",
                        kode_menu: tempMenu.name
                    }}
                    validationSchema={menuSchema}
                    onSubmit={(values) => {this.addMenu(values)}}
                    >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                    <ModalBody>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Nama Sub Menu
                            </text>
                            <div className="col-md-9">
                                <Input
                                type="name" 
                                name="name"
                                value={values.name}
                                onChange={handleChange("name")}
                                onBlur={handleBlur("name")}
                                />
                                {errors.name ? (
                                    <text className={style.txtError}>{errors.name}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Tipe
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="select" 
                                name="type"
                                disabled={values.type === "master" ? true : false}
                                value={values.type}
                                onChange={handleChange("type")}
                                onBlur={handleBlur("type")}
                                >
                                    <option>-Pilih-</option>
                                    {values.type === "master" && <option value='master'>Master Data</option>}
                                    <option value='proses'>Proses</option>
                                    <option value='reject'>Reject</option>
                                </Input>
                                {errors.type ? (
                                        <text className={style.txtError}>{errors.type}</text>
                                    ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Timeline
                            </text>
                            <div className="col-md-9">
                                <Row>
                                    <div className='col-md-10'>
                                        <Input 
                                        type="text" 
                                        name="timeline"
                                        disabled={values.type === 'master' || values.type === '' ? true : false}
                                        value={values.timeline}
                                        onChange={handleChange("timeline")}
                                        onBlur={handleBlur("timeline")}
                                        />
                                    </div>
                                    <div className='col-md-2'>
                                        Days
                                    </div>
                                </Row>
                                {errors.timeline ? (
                                    <text className={style.txtError}>{errors.timeline}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className='addModalMenu'>
                            <text className="col-md-3">
                                Hak akses role
                            </text>
                            <div className="col-md-9 listcek">
                                <div className='listcek mr-2'>
                                    <Input 
                                    type="checkbox" 
                                    name="access"
                                    className='ml-1'
                                    checked={listRole.length === 0 ? false : listRole.length === dataRole.length ? true : false}
                                    onChange={() => listRole.length === dataRole.length ? this.checkRej('all') : this.checkApp('all')}
                                    />
                                    <text className='ml-4'>all</text>
                                </div>
                                {dataRole.length !== 0 && dataRole.map(item => {
                                    return (
                                        <div className='listcek mr-2'>
                                            <Input 
                                            type="checkbox" 
                                            name="access"
                                            checked={listRole.find(element => element === item.name) !== undefined ? true : false}
                                            className='ml-1'
                                            onChange={listRole.find(element => element === item.name) === undefined ? () => this.checkApp(item.name) : () => this.checkRej(item.name)}
                                            />
                                            <text className='ml-4'>{item.name}</text>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className='addModalMenu'>
                            <text className="col-md-3">
                                Hak akses depo
                            </text>
                            <div className="col-md-9 listcek">
                                <div className='listcek mr-2'>
                                    <Input 
                                    type="checkbox" 
                                    name="access"
                                    className='ml-1'
                                    checked={listDepo.length === 0 ? false : listDepo.length === dataDepo.length ? true : false}
                                    onChange={() => listDepo.length === dataDepo.length ? this.checkDepRej('all') : this.checkDepApp('all')}
                                    />
                                    <text className='ml-4'>all</text>
                                </div>
                                {dataDepo.length !== 0 && dataDepo.map(item => {
                                    return (
                                        <div className='listcek mr-2'>
                                            <Input 
                                            type="checkbox" 
                                            name="access"
                                            checked={listDepo.find(element => element === item.kode_plant) !== undefined ? true : false}
                                            className='ml-1'
                                            onChange={listDepo.find(element => element === item.kode_plant) === undefined ? () => this.checkDepApp(item.kode_plant) : () => this.checkDepRej(item.kode_plant)}
                                            />
                                            <text className='ml-4'>{item.nama_area}</text>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <hr/>
                        <div className={style.foot}>
                            <div></div>
                            <div>
                                <Button className="mr-2" onClick={handleSubmit} color="primary">Save</Button>
                                <Button className="mr-5" onClick={this.openModalAdd}>Cancel</Button>
                            </div>
                        </div>
                    </ModalBody>
                    )}
                    </Formik>
                </Modal>
                <Modal toggle={this.openModalEdit} isOpen={this.state.modalEdit} size="lg">
                    <ModalHeader toggle={this.openModalEdit}>Edit Menu</ModalHeader>
                    <Formik
                    initialValues={{
                        name: detail.name,
                        type: detail.type,
                        jenis: detail.jenis,
                        routes: detail.routes,
                        timeline: detail.timeline,
                        access: detail.access,
                        kode_menu: detail.kode_menu
                    }}
                    validationSchema={menuSchema}
                    onSubmit={(values) => {this.editMenu(values, detail.id)}}
                    >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                    <ModalBody>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Nama Sub Menu
                            </text>
                            <div className="col-md-9">
                                <Input
                                type="name" 
                                name="name"
                                value={values.name}
                                onChange={handleChange("name")}
                                onBlur={handleBlur("name")}
                                />
                                {errors.name ? (
                                    <text className={style.txtError}>{errors.name}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Tipe
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="select" 
                                name="type"
                                disabled={values.type === "master" ? true : false}
                                value={values.type}
                                onChange={handleChange("type")}
                                onBlur={handleBlur("type")}
                                >
                                    <option>-Pilih-</option>
                                    {values.type === "master" && <option value='master'>Master Data</option>}
                                    <option value='proses'>Proses</option>
                                    <option value='reject'>Reject</option>
                                </Input>
                                {errors.type ? (
                                        <text className={style.txtError}>{errors.type}</text>
                                    ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Timeline
                            </text>
                            <div className="col-md-9">
                                <Row>
                                    <div className='col-md-10'>
                                        <Input 
                                        type="text" 
                                        name="timeline"
                                        disabled={values.type === 'master' || values.type === '' ? true : false}
                                        value={values.timeline}
                                        onChange={handleChange("timeline")}
                                        onBlur={handleBlur("timeline")}
                                        />
                                    </div>
                                    <div className='col-md-2'>
                                        Days
                                    </div>
                                </Row>
                                {errors.timeline ? (
                                    <text className={style.txtError}>{errors.timeline}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className='addModalMenu'>
                            <text className="col-md-3">
                                Hak akses role
                            </text>
                            <div className="col-md-9 listcek">
                                <div className='listcek mr-2'>
                                    <Input 
                                    type="checkbox" 
                                    name="access"
                                    className='ml-1'
                                    checked={listRole.length === 0 ? false : listRole.length === dataRole.length ? true : false}
                                    onChange={() => listRole.length === dataRole.length ? this.checkRej('all') : this.checkApp('all')}
                                    />
                                    <text className='ml-4'>all</text>
                                </div>
                                {dataRole.length !== 0 && dataRole.map(item => {
                                    return (
                                        <div className='listcek mr-2'>
                                            <Input 
                                            type="checkbox" 
                                            name="access"
                                            checked={listRole.find(element => element === item.name) !== undefined ? true : false}
                                            className='ml-1'
                                            onChange={listRole.find(element => element === item.name) === undefined ? () => this.checkApp(item.name) : () => this.checkRej(item.name)}
                                            />
                                            <text className='ml-4'>{item.name}</text>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className='addModalMenu'>
                            <text className="col-md-3">
                                Hak akses depo
                            </text>
                            <div className="col-md-9 listcek">
                                <div className='listcek mr-2'>
                                    <Input 
                                    type="checkbox" 
                                    name="access"
                                    className='ml-1'
                                    checked={listDepo.length === 0 ? false : listDepo.length === dataDepo.length ? true : false}
                                    onChange={() => listDepo.length === dataDepo.length ? this.checkDepRej('all') : this.checkDepApp('all')}
                                    />
                                    <text className='ml-4'>all</text>
                                </div>
                                {dataDepo.length !== 0 && dataDepo.map(item => {
                                    return (
                                        <div className='listcek mr-2'>
                                            <Input 
                                            type="checkbox" 
                                            name="access"
                                            checked={listDepo.find(element => element === item.kode_plant) !== undefined ? true : false}
                                            className='ml-1'
                                            onChange={listDepo.find(element => element === item.kode_plant) === undefined ? () => this.checkDepApp(item.kode_plant) : () => this.checkDepRej(item.kode_plant)}
                                            />
                                            <text className='ml-4'>{item.nama_area}</text>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <hr/>
                        <div className={style.foot}>
                            <div></div>
                            <div>
                                <Button className="mr-2" onClick={handleSubmit} color="primary">Save</Button>
                                <Button className="mr-5" onClick={this.openModalAdd}>Cancel</Button>
                            </div>
                        </div>
                    </ModalBody>
                    )}
                    </Formik>
                </Modal>
                <Modal isOpen={this.props.menu.isLoading ? true: false} size="sm">
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
    menu: state.menu,
    user: state.user,
    depo: state.depo
})

const mapDispatchToProps = {
    logout: auth.logout,
    resetError: menu.resetError,
    createMenu: menu.createMenu,
    createNameMenu: menu.createNameMenu,
    getMenu: menu.getMenu,
    getDetailMenu: menu.getDetailMenu,
    getNameMenu: menu.getNameMenu,
    deleteMenu: menu.deleteMenu,
    updateMenu: menu.updateMenu,
    getRole: user.getRole,
    getDepo: depo.getDepo,
}

export default connect(mapStateToProps, mapDispatchToProps)(MasterMenu)
