import React, { Component } from 'react'
import {
    NavbarBrand, DropdownToggle, DropdownMenu,
    DropdownItem, Table, ButtonDropdown, Input, Button,
    Modal, ModalHeader, ModalBody, Alert, Spinner, UncontrolledDropdown
} from 'reactstrap'
import style from '../../assets/css/ofr.module.css'
import { FaSearch, FaBars } from 'react-icons/fa'
import { AiFillCheckCircle, AiOutlineFileExcel, AiOutlineInbox } from 'react-icons/ai'
import depo from '../../redux/actions/depo'
import user from '../../redux/actions/user'
import tempmail from '../../redux/actions/tempmail'
import menu from '../../redux/actions/menu'
import { connect } from 'react-redux'
import { Formik } from 'formik'
import * as Yup from 'yup'
import auth from '../../redux/actions/auth'
import { default as axios } from 'axios'
import Sidebar from "../../components/Header";
import MaterialTitlePanel from "../../components/material_title_panel";
import SidebarContent from "../../components/sidebar_content";
import NavBar from '../../components/NavBar'
import Select from 'react-select'
import styleTrans from '../../assets/css/transaksi.module.css'
import NewNavbar from '../../components/NewNavbar'
const { REACT_APP_BACKEND_URL } = process.env

const emailSchema = Yup.object().shape({
    type: Yup.string().required(),
    menu: Yup.string().required(),
    message: Yup.string().required(),
    status: Yup.string().required(),
});

const emailEditSchema = Yup.object().shape({
    type: Yup.string().required(),
    menu: Yup.string().required(),
    message: Yup.string().required(),
    status: Yup.string().required(),
});

const changeSchema = Yup.object().shape({
    confirm_password: Yup.string().required('must be filled'),
    new_password: Yup.string().required('must be filled')
});

class MasterEmail extends Component {
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
            level: "",
            upload: false,
            errMsg: '',
            fileUpload: '',
            limit: 10,
            search: '',
            modalReset: false,
            filter: null,
            filterName: 'All',
            modalDel: false,
            page: 1,
            depoList: [],
            plant: '',
            listCc: [],
            listTo: []
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
    }

    prosesSidebar = (val) => {
        this.setState({ sidebarOpen: val })
    }

    goRoute = (val) => {
        this.props.history.push(`/${val}`)
    }

    showAlert = () => {
        this.setState({ alert: true, modalEdit: false, modalAdd: false, modalUpload: false })

        setTimeout(() => {
            this.setState({
                alert: false
            })
        }, 10000)
    }
    uploadAlert = () => {
        this.setState({ upload: true, modalUpload: false })

        setTimeout(() => {
            this.setState({
                upload: false
            })
        }, 10000)
    }

    resetPass = async (val) => {
        const token = localStorage.getItem("token")
        const { detail } = this.state
        const data = {
            new: val.new_password
        }
        await this.props.resetPassword(token, detail.id, data)
    }

    DownloadMaster = () => {
        const { link } = this.props.tempmail
        axios({
            url: `${link}`,
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "master email.xlsx"); //or any other extension
            document.body.appendChild(link);
            link.click();
        });
    }

    toggle = () => {
        this.setState({ isOpen: !this.state.isOpen })
    }

    openConfirm = () => {
        this.setState({ modalConfirm: !this.state.modalConfirm })
    }

    dropDown = () => {
        this.setState({ dropOpen: !this.state.dropOpen })
    }
    dropOpen = () => {
        this.setState({ dropOpenNum: !this.state.dropOpenNum })
    }
    onSetSidebarOpen = () => {
        this.setState({ sidebarOpen: !this.state.sidebarOpen });
    }
    openModalAdd = () => {
        this.setState({ modalAdd: !this.state.modalAdd })
    }
    openModalEdit = () => {
        this.setState({ modalEdit: !this.state.modalEdit })
    }
    openModalUpload = () => {
        this.setState({ modalUpload: !this.state.modalUpload })
    }
    openModalDownload = () => {
        this.setState({ modalUpload: !this.state.modalUpload })
    }

    prosesModalEdit = (val) => {
        const { to, cc, access } = val
        const emailTo = to.split(',')
        const emailCc = cc.split(',')
        this.setState({ detail: val, listTo: emailTo, listCc: emailCc, plant: access })
        this.openModalEdit()
    }

    DownloadTemplate = () => {
        axios({
            url: `${REACT_APP_BACKEND_URL}/masters/bank.xlsx`,
            method: 'GET',
            responseType: 'blob',
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "master email.xlsx");
            document.body.appendChild(link);
            link.click();
        });
    }

    addEmail = async (val) => {
        const token = localStorage.getItem("token")
        const { listCc, listTo, plant } = this.state
        const data = {
            ...val,
            access: plant,
            to: val.type === 'reject' ? listTo.toString() : '',
            cc: listCc.toString()
        }
        await this.props.addEmail(token, data)
        const { isAdd } = this.props.tempmail
        if (isAdd) {
            this.setState({ confirm: 'add' })
            this.openConfirm()
            await this.getDataCount()
            this.openModalAdd()
        }
    }

    delEmail = async () => {
        const token = localStorage.getItem("token")
        const { detail } = this.state
        await this.props.deleteEmail(token, detail.id)
        this.openModalEdit()
        this.setState({ confirm: 'del' })
        this.openConfirm()
        await this.getDataCount()
        this.openModalDel()
    }

    next = async () => {
        const { page } = this.props.tempmail
        const token = localStorage.getItem('token')
        await this.props.nextPage(token, page.nextLink)
    }

    prev = async () => {
        const { page } = this.props.tempmail
        const token = localStorage.getItem('token')
        await this.props.nextPage(token, page.prevLink)
    }

    onSearch = (e) => {
        this.setState({ search: e.target.value })
        if (e.key === 'Enter') {
            this.getDataCount({ limit: 10, search: this.state.search })
        }
    }

    prepareSelect = () => {
        const { dataDepo } = this.props.depo
        const temp = [
            { value: '', label: '-Pilih-' },
            { value: 'all', label: 'All' }
        ]
        dataDepo.map(item => {
            return (
                temp.push({ value: item.kode_plant, label: `${item.kode_plant} ~ ${item.nama_area}` })
            )
        })
        this.setState({ depoList: temp })
    }

    onChangeHandler = e => {
        const { size, type } = e.target.files[0]
        if (size >= 5120000) {
            this.setState({ errMsg: "Maximum upload size 5 MB" })
            this.uploadAlert()
        } else if (type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && type !== 'application/vnd.ms-excel') {
            this.setState({ errMsg: 'Invalid file type. Only excel files are allowed.' })
            this.uploadAlert()
        } else {
            this.setState({ fileUpload: e.target.files[0] })
        }
    }

    checkApp = (val) => {
        const { listCc, listTo } = this.state
        const { dataRole } = this.props.user
        if (val === 'all') {
            const data = []
            for (let i = 0; i < dataRole.length; i++) {
                if (dataRole[i].name !== listTo[0]) {
                    data.push(dataRole[i].name)
                }
            }
            this.setState({ listCc: data })
        } else {
            if (val !== listTo[0]) {
                listCc.push(val)
                this.setState({ listCc: listCc })
            }
        }
    }

    checkRej = (val) => {
        const { listCc } = this.state
        if (val === 'all') {
            const data = []
            this.setState({ listCc: data })
        } else {
            const data = []
            for (let i = 0; i < listCc.length; i++) {
                if (listCc[i] === val) {
                    data.push()
                } else {
                    data.push(listCc[i])
                }
            }
            this.setState({ listCc: data })
        }
    }

    checkToApp = (val) => {
        this.setState({ listTo: [val] })
    }

    checkToRej = (val) => {
        console.log('masuk to rej')
        this.setState({ listTo: [] })
    }

    uploadMaster = async () => {
        const token = localStorage.getItem('token')
        const data = new FormData()
        data.append('master', this.state.fileUpload)
        await this.props.uploadMaster(token, data)
    }

    editEmail = async (val, id) => {
        const token = localStorage.getItem("token")
        const { listCc, listTo, plant } = this.state
        const data = {
            ...val,
            access: plant,
            to: val.type === 'reject' ? listTo.toString() : '',
            cc: listCc.toString()
        }
        await this.props.updateEmail(token, data, id)
        const { isUpdate } = this.props.tempmail
        if (isUpdate) {
            this.setState({ confirm: 'edit' })
            this.openConfirm()
            this.getDataCount()
            this.openModalEdit()
        }
    }

    ExportMaster = async () => {
        const token = localStorage.getItem('token')
        await this.props.exportMaster(token)
    }

    componentDidUpdate() {
        const { isError, isUpload, isExport, isReset } = this.props.tempmail
        if (isError) {
            this.props.resetError()
            this.showAlert()
        } else if (isReset) {
            this.setState({ confirm: 'reset' })
            this.props.resetError()
            this.openModalReset()
            this.openConfirm()
        } else if (isUpload) {
            setTimeout(() => {
                this.props.resetError()
                this.setState({ modalUpload: false })
            }, 2000)
            setTimeout(() => {
                this.getDataCount()
            }, 2100)
        } else if (isExport) {
            this.DownloadMaster()
            this.props.resetError()
        }
    }

    async componentDidMount() {
        const token = localStorage.getItem("token")
        await this.props.getAllMenu(token, 'all')
        await this.props.getDepo(token, 1000, '')
        await this.props.getRole(token)
        this.prepareSelect()
        this.getDataCount()
    }

    getDataCount = async (value) => {
        const { page } = this.props.tempmail
        const pages = value === undefined || value.page === undefined ? page.currentPage : value.page
        const token = localStorage.getItem("token")
        const search = value === undefined ? '' : this.state.search
        const limit = value === undefined ? this.state.limit : value.limit
        const filter = value === undefined || value.filter === undefined ? this.state.filter : value.filter
        await this.props.getEmail(token, limit, search, pages, filter)
        this.setState({ limit: value === undefined ? 10 : value.limit, search: search, filter: filter, page: pages })
    }

    changeFilter = async (val) => {
        this.setState({ filter: val.level, filterName: val.name })
        this.getDataCount({ limit: this.state.limit, search: this.state.search, filter: val.level, page: 1 })
    }

    menuButtonClick(ev) {
        ev.preventDefault();
        this.onSetOpen(!this.state.open);
    }

    onSetOpen(open) {
        this.setState({ open });
    }

    openModalReset = () => {
        this.setState({ modalReset: !this.state.modalReset })
    }

    openModalDel = () => {
        this.setState({ modalDel: !this.state.modalDel })
    }

    selectDepo = (e) => {
        this.setState({ plant: e.value })
    }

    prosesModalAdd = () => {
        this.setState({ listTo: [], listCc: [] })
        this.openModalAdd()
    }

    render() {
        const { isOpen, dropOpen, dropOpenNum, detail, level, upload, errMsg, listCc, listTo } = this.state
        const { dataEmail, isAll, alertM, alertMsg, alertUpload, page, dataAll } = this.props.tempmail
        const dataMenu = this.props.menu.dataAll
        const levels = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const { dataDepo } = this.props.depo
        const { dataRole } = this.props.user

        const contentHeader = (
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
                                    <div className={style.titleDashboard}>Master Template Email</div>
                                </div>
                                <div className={style.secHeadDashboard} >
                                    <div className={style.headEmail}>
                                        <Button className='mr-1' onClick={this.prosesModalAdd} color="primary" size="lg">Add</Button>
                                    </div>
                                    
                                    <div className='filterReason'>
                                    </div>
                                </div>
                                <div className='secEmail'>
                                    <div>
                                        <text>Show: </text>
                                        <ButtonDropdown className={style.drop} isOpen={dropOpen} toggle={this.dropDown}>
                                        <DropdownToggle caret color="light">
                                            {this.state.limit}
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem className={style.item} onClick={() => this.getDataCount({limit: 10, search: ''})}>10</DropdownItem>
                                            <DropdownItem className={style.item} onClick={() => this.getDataCount({limit: 20, search: ''})}>20</DropdownItem>
                                            <DropdownItem className={style.item} onClick={() => this.getDataCount({limit: 50, search: ''})}>50</DropdownItem>
                                            <DropdownItem className={style.item} onClick={() => this.getDataCount({limit: 'all', search: ''})}>All</DropdownItem>
                                        </DropdownMenu>
                                        </ButtonDropdown>
                                        <text className={style.textEntries}>entries</text>
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
                                {dataEmail.length === 0? (
                                    <div className={style.tableDashboard}>
                                    <Table bordered responsive hover className={style.tab}>
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Message</th>
                                                <th>Type</th>
                                                <th>Menu</th>
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
                                                <th>Message</th>
                                                <th>Type</th>
                                                <th>Menu</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dataEmail.length !== 0 && dataEmail.map(item => {
                                                return (
                                                <tr onClick={()=>this.prosesModalEdit(item)}>
                                                    <th scope="row">{(dataEmail.indexOf(item) + (((page.currentPage - 1) * page.limitPerPage) + 1))}</th>
                                                    <td>{item.message}</td>
                                                    <td>{item.type}</td>
                                                    <td>{item.menu}</td>
                                                </tr>
                                            )})}
                                        </tbody>
                                    </Table>
                                </div>  
                                )}
                                <div>
                                    <div className='infoPageEmail'>
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
                        <h2 className={styleTrans.pageTitle}>Master Template Email</h2>

                        <div className={styleTrans.searchContainer}>
                            <div>
                                <Button className='mr-1' onClick={this.prosesModalAdd} color="primary" size="lg">Add</Button>
                            </div>
                            <div></div>
                        </div>
                        <div className={styleTrans.searchContainer}>
                            <div>
                                <text>Show: </text>
                                <ButtonDropdown className={style.drop} isOpen={dropOpen} toggle={this.dropDown}>
                                    <DropdownToggle caret color="light">
                                        {this.state.limit}
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem className={style.item} onClick={() => this.getDataCount({ limit: 10, search: '' })}>10</DropdownItem>
                                        <DropdownItem className={style.item} onClick={() => this.getDataCount({ limit: 20, search: '' })}>20</DropdownItem>
                                        <DropdownItem className={style.item} onClick={() => this.getDataCount({ limit: 50, search: '' })}>50</DropdownItem>
                                        <DropdownItem className={style.item} onClick={() => this.getDataCount({ limit: 'all', search: '' })}>All</DropdownItem>
                                    </DropdownMenu>
                                </ButtonDropdown>
                                <text className={style.textEntries}>entries</text>
                            </div>
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

                        <table className={`${styleTrans.table} ${dataEmail.length > 0 ? styleTrans.tableFull : ''}`}>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Message</th>
                                    <th>Type</th>
                                    <th>Menu</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataEmail.length !== 0 && dataEmail.map((item, index) => {
                                    return (
                                        <tr onClick={() => this.prosesModalEdit(item)}>
                                            <td scope="row">{(dataEmail.indexOf(item) + (((page.currentPage - 1) * page.limitPerPage) + 1))}</td>
                                            <td>{item.message}</td>
                                            <td>{item.type}</td>
                                            <td>{item.menu}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        {dataEmail.length === 0 && (
                            <div className={style.spinCol}>
                                <AiOutlineInbox size={50} className='mb-4' />
                                <div className='textInfo'>Data email tidak ditemukan</div>
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
                <Modal toggle={this.openModalAdd} isOpen={this.state.modalAdd}>
                    <ModalHeader toggle={this.openModalAdd}>Add Master Email</ModalHeader>
                    <Formik
                        initialValues={{
                            type: '',
                            menu: '',
                            message: '',
                            status: ''
                        }}
                        validationSchema={emailSchema}
                        onSubmit={(values) => { this.addEmail(values) }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                            <ModalBody>
                                <div className={style.addModalDepo}>
                                    <text className="col-md-3">
                                        Access
                                    </text>
                                    <div className="col-md-9">
                                        <Select
                                            className=""
                                            options={this.state.depoList}
                                            onChange={this.selectDepo}
                                        />
                                        {this.state.plant === '' ? (
                                            <text className={style.txtError}>{errors.access}</text>
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
                                            value={values.type}
                                            onBlur={() => { handleBlur("type"); this.checkToRej('val') }}
                                            onChange={handleChange("type")}
                                        >
                                            <option>-Pilih-</option>
                                            <option value='approve'>Approve</option>
                                            <option value='full approve'>Full Approve</option>
                                            <option value='reject'>Reject</option>
                                            <option value='submit'>Submit</option>
                                        </Input>
                                        {errors.type ? (
                                            <text className={style.txtError}>{errors.type}</text>
                                        ) : null}
                                    </div>
                                </div>
                                <div className={style.addModalDepo}>
                                    <text className="col-md-3">
                                        Menu
                                    </text>
                                    <div className="col-md-9">
                                        <Input
                                            type="select"
                                            name="menu"
                                            disabled={values.menu === "master" ? true : false}
                                            value={values.menu}
                                            onChange={handleChange("menu")}
                                            onBlur={handleBlur("menu")}
                                        >
                                            <option>-Pilih-</option>
                                            {dataMenu.length > 0 && dataMenu.map(item => {
                                                return (
                                                    <option value={item.name + ` (${item.kode_menu})`}>{item.name + ` (${item.kode_menu})`}</option>
                                                )
                                            })}
                                        </Input>
                                        {errors.menu ? (
                                            <text className={style.txtError}>{errors.menu}</text>
                                        ) : null}
                                    </div>
                                </div>
                                <div className={style.addModalDepo}>
                                    <text className="col-md-3">
                                        Message
                                    </text>
                                    <div className="col-md-9">
                                        <Input
                                            type='textarea'
                                            name="message"
                                            value={values.message}
                                            onBlur={handleBlur("message")}
                                            onChange={handleChange("message")}
                                        />
                                        {errors.message ? (
                                            <text className={style.txtError}>{errors.message}</text>
                                        ) : null}
                                    </div>
                                </div>
                                <div className={style.addModalDepo}>
                                    <text className="col-md-3">
                                        Status
                                    </text>
                                    <div className="col-md-9">
                                        <Input
                                            type="select"
                                            name="status"
                                            value={values.status}
                                            onBlur={handleBlur("status")}
                                            onChange={handleChange("status")}
                                        >
                                            <option>-Pilih-</option>
                                            <option value='active'>Active</option>
                                            <option value='inactive'>Inactive</option>
                                        </Input>
                                        {errors.status ? (
                                            <text className={style.txtError}>{errors.status}</text>
                                        ) : null}
                                    </div>
                                </div>
                                {values.type !== 'reject' ? null : (
                                    <div className='addModalMenu'>
                                        <text className="col-md-3">
                                            To
                                        </text>
                                        <div className="col-md-9 listcek">
                                            {dataRole.length !== 0 && dataRole.map(item => {
                                                return (
                                                    item.level === 1 ? null :
                                                        <div className='listcek mr-2'>
                                                            <Input
                                                                type="checkbox"
                                                                name="access"
                                                                checked={listTo.find(element => element === item.name) !== undefined ? true : false}
                                                                className='ml-1'
                                                                onChange={listTo.find(element => element === item.name) === undefined ? () => this.checkToApp(item.name) : () => this.checkToRej(item.name)}
                                                            />
                                                            <text className='ml-4'>{item.name}</text>
                                                        </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                                <div className='addModalMenu'>
                                    <text className="col-md-3">
                                        Cc
                                    </text>
                                    <div className="col-md-9 listcek">
                                        <div className='listcek mr-2'>
                                            <Input
                                                disabled={(values.type !== 'reject') ? false : listTo.length === 0 ? true : false}
                                                type="checkbox"
                                                name="access"
                                                className='ml-1'
                                                checked={listCc.length === 0 ? false : listCc.length === dataRole.length - listTo.length ? true : false}
                                                onChange={() => listCc.length === dataRole.length - listTo.length ? this.checkRej('all') : this.checkApp('all')}
                                            />
                                            <text className='ml-4'>all</text>
                                        </div>
                                        {dataRole.length !== 0 && dataRole.map(item => {
                                            return (
                                                values.type !== 'approve' && item.name === listTo[0] ? null :
                                                    <div className='listcek mr-2'>
                                                        <Input
                                                            type="checkbox"
                                                            disabled={(values.type !== 'reject') ? false : listTo.length === 0 ? true : false}
                                                            name="access"
                                                            checked={listCc.find(element => element === item.name) !== undefined ? true : false}
                                                            className='ml-1'
                                                            onChange={listCc.find(element => element === item.name) === undefined ? () => this.checkApp(item.name) : () => this.checkRej(item.name)}
                                                        />
                                                        <text className='ml-4'>{item.name}</text>
                                                    </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                <hr />
                                <div className={style.foot}>
                                    <div></div>
                                    <div>
                                        <Button
                                            className="mr-2"
                                            disabled={
                                                this.state.plant === '' ? true
                                                    : (values.type === 'reject') && listTo.length === 0 ? true
                                                        : false
                                            }
                                            onClick={handleSubmit}
                                            color="primary">Save</Button>
                                        <Button className="mr-3" onClick={this.openModalAdd}>Cancel</Button>
                                    </div>
                                </div>
                            </ModalBody>
                        )}
                    </Formik>
                </Modal>
                <Modal toggle={this.openModalEdit} isOpen={this.state.modalEdit}>
                    <ModalHeader toggle={this.openModalEdit}>Edit Master Email</ModalHeader>
                    <Formik
                        initialValues={{
                            type: detail.type === null ? '' : detail.type,
                            menu: detail.menu === null ? '' : detail.menu,
                            message: detail.message === null ? '' : detail.message,
                            status: detail.status === null ? '' : detail.status,
                        }}
                        validationSchema={emailEditSchema}
                        onSubmit={(values) => { this.editEmail(values, detail.id) }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, }) => (
                            <ModalBody>
                                <div className={style.addModalDepo}>
                                    <text className="col-md-3">
                                        Access
                                    </text>
                                    <div className="col-md-9">
                                        <Select
                                            className=""
                                            options={this.state.depoList}
                                            defaultValue={this.state.depoList.filter(option =>
                                                option.value === detail.access)}
                                            onChange={this.selectDepo}
                                        />
                                        {this.state.plant === '' ? (
                                            <text className={style.txtError}>{errors.access}</text>
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
                                            value={values.type}
                                            onBlur={() => { handleBlur("type"); this.checkToRej('val') }}
                                            onChange={handleChange("type")}
                                        >
                                            <option>-Pilih-</option>
                                            <option value='approve'>Approve</option>
                                            <option value='full approve'>Full Approve</option>
                                            <option value='reject'>Reject</option>
                                            <option value='submit'>Submit</option>
                                        </Input>
                                        {errors.type ? (
                                            <text className={style.txtError}>{errors.type}</text>
                                        ) : null}
                                    </div>
                                </div>
                                <div className={style.addModalDepo}>
                                    <text className="col-md-3">
                                        Menu
                                    </text>
                                    <div className="col-md-9">
                                        <Input
                                            type="select"
                                            name="menu"
                                            disabled={values.menu === "master" ? true : false}
                                            value={values.menu}
                                            onChange={handleChange("menu")}
                                            onBlur={handleBlur("menu")}
                                        >
                                            <option>-Pilih-</option>
                                            {dataMenu.length > 0 && dataMenu.map(item => {
                                                return (
                                                    <option value={item.name + ` (${item.kode_menu})`}>{item.name + ` (${item.kode_menu})`}</option>
                                                )
                                            })}
                                        </Input>
                                        {errors.menu ? (
                                            <text className={style.txtError}>{errors.menu}</text>
                                        ) : null}
                                    </div>
                                </div>
                                <div className={style.addModalDepo}>
                                    <text className="col-md-3">
                                        Message
                                    </text>
                                    <div className="col-md-9">
                                        <Input
                                            type='textarea'
                                            name="message"
                                            value={values.message}
                                            onBlur={handleBlur("message")}
                                            onChange={handleChange("message")}
                                        />
                                        {errors.message ? (
                                            <text className={style.txtError}>{errors.message}</text>
                                        ) : null}
                                    </div>
                                </div>
                                <div className={style.addModalDepo}>
                                    <text className="col-md-3">
                                        Status
                                    </text>
                                    <div className="col-md-9">
                                        <Input
                                            type="select"
                                            name="status"
                                            value={values.status}
                                            onBlur={handleBlur("status")}
                                            onChange={handleChange("status")}
                                        >
                                            <option>-Pilih-</option>
                                            <option value='active'>Active</option>
                                            <option value='inactive'>Inactive</option>
                                        </Input>
                                        {errors.status ? (
                                            <text className={style.txtError}>{errors.status}</text>
                                        ) : null}
                                    </div>
                                </div>
                                {values.type !== 'reject' ? null : (
                                    <div className='addModalMenu'>
                                        <text className="col-md-3">
                                            To
                                        </text>
                                        <div className="col-md-9 listcek">
                                            {dataRole.length !== 0 && dataRole.map(item => {
                                                return (
                                                    item.level === 1 ? null :
                                                        <div className='listcek mr-2'>
                                                            <Input
                                                                type="checkbox"
                                                                name="access"
                                                                checked={listTo.find(element => element === item.name) !== undefined ? true : false}
                                                                className='ml-1'
                                                                onChange={listTo.find(element => element === item.name) === undefined ? () => this.checkToApp(item.name) : () => this.checkToRej(item.name)}
                                                            />
                                                            <text className='ml-4'>{item.name}</text>
                                                        </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                                <div className='addModalMenu'>
                                    <text className="col-md-3">
                                        Cc
                                    </text>
                                    <div className="col-md-9 listcek">
                                        <div className='listcek mr-2'>
                                            <Input
                                                disabled={(values.type !== 'reject') ? false : listTo.length === 0 ? true : false}
                                                type="checkbox"
                                                name="access"
                                                className='ml-1'
                                                checked={listCc.length === 0 ? false : listCc.length === dataRole.length - listTo.length ? true : false}
                                                onChange={() => listCc.length === dataRole.length - listTo.length ? this.checkRej('all') : this.checkApp('all')}
                                            />
                                            <text className='ml-4'>all</text>
                                        </div>
                                        {dataRole.length !== 0 && dataRole.map(item => {
                                            return (
                                                values.type !== 'approve' && item.name === listTo[0] ? null :
                                                    <div className='listcek mr-2'>
                                                        <Input
                                                            type="checkbox"
                                                            disabled={(values.type !== 'reject') ? false : listTo.length === 0 ? true : false}
                                                            name="access"
                                                            checked={listCc.find(element => element === item.name) !== undefined ? true : false}
                                                            className='ml-1'
                                                            onChange={listCc.find(element => element === item.name) === undefined ? () => this.checkApp(item.name) : () => this.checkRej(item.name)}
                                                        />
                                                        <text className='ml-4'>{item.name}</text>
                                                    </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                <hr />
                                <div className={style.foot}>
                                    <div>
                                        <Button className="mr-2" onClick={this.openModalDel} color='danger'>Delete</Button>
                                    </div>
                                    <div>
                                        <Button onClick={handleSubmit} color="primary">Save</Button>
                                    </div>
                                </div>
                            </ModalBody>
                        )}
                    </Formik>
                </Modal>
                <Modal toggle={this.openModalUpload} isOpen={this.state.modalUpload} >
                    <ModalHeader>Upload Master Email</ModalHeader>
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
                            <Button color="primary" disabled={this.state.fileUpload === "" ? true : false} onClick={this.uploadMaster}>Upload</Button>
                            <Button onClick={this.openModalUpload}>Cancel</Button>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalConfirm} toggle={this.openConfirm} size="sm">
                    <ModalBody>
                        {this.state.confirm === 'edit' ? (
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Memperbarui Email</div>
                            </div>
                        ) : this.state.confirm === 'add' ? (
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Menambahkan Email</div>
                            </div>
                        ) : this.state.confirm === 'del' ? (
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Menghapus Email</div>
                            </div>
                        ) : this.state.confirm === 'upload' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                    <div className={style.sucUpdate}>Berhasil Mengupload Master Email</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'reset' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                    <div className={style.sucUpdate}>Berhasil Mereset Password</div>
                                </div>
                            </div>
                        ) : (
                            <div></div>
                        )}
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.props.tempmail.isLoading ? true : false} size="sm">
                    <ModalBody>
                        <div>
                            <div className={style.cekUpdate}>
                                <Spinner />
                                <div sucUpdate>Waiting....</div>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.props.tempmail.isUpload ? true : false} size="sm">
                    <ModalBody>
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Mengupload Master</div>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalDel} toggle={this.openModalDel} centered={true}>
                    <ModalBody>
                        <div className={style.modalApprove}>
                            <div>
                                <text>
                                    Anda yakin untuk delete {detail.name} ?
                                </text>
                            </div>
                            <div className={style.btnApprove}>
                                <Button color="primary" onClick={() => this.delEmail()}>Ya</Button>
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
    user: state.user,
    tempmail: state.tempmail,
    menu: state.menu,
    depo: state.depo
})

const mapDispatchToProps = {
    logout: auth.logout,
    addEmail: tempmail.addEmail,
    updateEmail: tempmail.updateEmail,
    getEmail: tempmail.getEmail,
    nextPage: tempmail.nextPage,
    resetError: tempmail.resetError,
    resetPassword: user.resetPassword,
    deleteEmail: tempmail.deleteEmail,
    getAllMenu: menu.getAllMenu,
    getRole: user.getRole,
    getDepo: depo.getDepo,
}

export default connect(mapStateToProps, mapDispatchToProps)(MasterEmail)