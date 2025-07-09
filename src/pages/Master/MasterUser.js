import React, { Component } from 'react'
import {  NavbarBrand, DropdownToggle, DropdownMenu,
    DropdownItem, Table, ButtonDropdown, Input, Button,
    Modal, ModalHeader, ModalBody, Alert, Spinner, UncontrolledDropdown} from 'reactstrap'
import style from '../../assets/css/input.module.css'
import {FaSearch, FaUserCircle, FaBars, FaSortAlphaDown, FaSortAlphaUpAlt} from 'react-icons/fa'
import {AiFillCheckCircle, AiOutlineFileExcel, AiOutlineInbox} from 'react-icons/ai'
import depo from '../../redux/actions/depo'
import user from '../../redux/actions/user'
import {connect} from 'react-redux'
import {Formik} from 'formik'
import * as Yup from 'yup'
import auth from '../../redux/actions/auth'
import {default as axios} from 'axios'
import Sidebar from "../../components/Header";
import MaterialTitlePanel from "../../components/material_title_panel";
import SidebarContent from "../../components/sidebar_content";
import NavBar from '../../components/NavBar'
import ExcelJS from "exceljs"
import fs from "file-saver"
import moment from 'moment'
import styleTrans from '../../assets/css/transaksi.module.css'
import NewNavbar from '../../components/NewNavbar'
const {REACT_APP_BACKEND_URL} = process.env

const userSchema = Yup.object().shape({
    username: Yup.string().required(),
    fullname: Yup.string().required(),
    password: Yup.string().required(),
    email: Yup.string().email().required(),
    depo: Yup.string(),
    user_level: Yup.string().required(),
    status: Yup.string().required(),
    status_it: Yup.string()
});

const userEditSchema = Yup.object().shape({
    username: Yup.string().required(),
    fullname: Yup.string().required(),
    email: Yup.string().email().required(),
    depo: Yup.string(),
    user_level: Yup.string().required(),
    status: Yup.string().required(),
    status_it: Yup.string()
});

const changeSchema = Yup.object().shape({
    confirm_password: Yup.string().required('must be filled'),
    new_password: Yup.string().required('must be filled')
});

class MasterUser extends Component {
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
            listUser: [],
            listRole: [],
            sortType: 'asc',
            sortName: 'username'
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

    showAlert = () => {
        this.setState({alert: true, modalEdit: false, modalAdd: false, modalUpload: false })
       
         setTimeout(() => {
            this.setState({
                alert: false
            })
         }, 10000)
    }
    uploadAlert = () => {
        this.setState({upload: true, modalUpload: false })
       
         setTimeout(() => {
            this.setState({
                upload: false
            })
         }, 10000)
    }

    resetPass = async (val) => {
        const token = localStorage.getItem("token")
        const {detail} = this.state
        const data = {
            new: val.new_password
        }
        await this.props.resetPassword(token, detail.id, data)
     }

    DownloadMaster = () => {
        const {link} = this.props.user
        axios({
            url: `${link}`,
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "master user.xlsx"); //or any other extension
            document.body.appendChild(link);
            link.click();
        });
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
    
    prosesOpenAdd = async (val) => {
        this.setState({listRole: []})
        const token = localStorage.getItem("token")
        await this.props.getRole(token, '')
        this.openModalAdd()
    }

    prosesOpenEdit = async (val) => {
        const token = localStorage.getItem("token")
        this.setState({detail: val})
        await this.props.getRole(token, '')
        await this.props.getDetailUser(token, val.id)
        const { detailUser } = this.props.user
        if (detailUser.detail_role !== null && detailUser.detail_role !== undefined && detailUser.detail_role.length > 0) {
            const multiRole = detailUser.detail_role
            console.log(multiRole)
            const listRole = []
            for (let i = 0; i < multiRole.length; i++) {
                listRole.push(multiRole[i].id_role)
                console.log(multiRole[i].id_role)
            }
            this.setState({listRole: listRole})
            this.openModalEdit()
        } else {
            this.setState({listRole: []})
            this.openModalEdit()
        }
    }

    addUser = async (values) => {
        const token = localStorage.getItem("token")
        const { listRole } = this.state
        // const destruct = values.depo === "-Pilih Area-" ? ["", ""] : values.depo.split('-') 
        const data = {
            username: values.username,
            fullname: values.fullname,
            password: values.password,
            user_level: values.user_level,
            kode_plant: values.user_level == '5' || values.user_level == '9' ? values.depo : '',
            email: values.email,
            status: values.status,
            status_it: values.user_level == '9' ? values.status_it : '',
            multi_role: values.user_level == '5' || values.user_level == '9' ? '' : listRole.toString()
        }
        await this.props.addUser(token, data)
        const {isAdd} = this.props.user
        if (isAdd) {
            this.setState({confirm: 'add'})
            this.openConfirm()
            await this.getDataUser()
            this.openModalAdd()
        }
    }

    editUser = async (values,id) => {
        const token = localStorage.getItem("token")
        // const destruct = values.depo === "" ? ["", ""] : values.depo.split('-')
        const { listRole } = this.state
        console.log(values)
        const data = {
            username: values.username,
            fullname: values.fullname,
            user_level: values.user_level,
            email: values.email,
            kode_plant: (values.user_level == '5' || values.user_level == '9') ? values.depo : '',
            status: values.status,
            status_it: values.user_level == '9' ? values.status_it : '',
            multi_role: values.user_level == '5' || values.user_level == '9' ? '' : listRole.toString()
        }
        await this.props.updateUser(token, id, data)
        const {isUpdate} = this.props.user
        if (isUpdate) {
            this.setState({confirm: 'edit'})
            this.openConfirm()
            this.getDataUser()
            this.openModalEdit()
        }
    }

    next = async () => {
        const { page } = this.props.user
        const token = localStorage.getItem('token')
        await this.props.nextPage(token, page.nextLink)
    }

    prev = async () => {
        const { page } = this.props.user
        const token = localStorage.getItem('token')
        await this.props.nextPage(token, page.prevLink)
    }

    onSearch = (e) => {
        this.setState({search: e.target.value})
        if(e.key === 'Enter'){
            this.getDataUser({limit: 10, search: this.state.search})
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

    ExportMaster = () => {
        const token = localStorage.getItem('token')
        this.props.exportMaster(token)
    }

    componentDidUpdate() {
        const {isError, isUpload, isExport, isReset} = this.props.user
        if (isError) {
            this.props.resetError()
            this.showAlert()
        } else if (isReset) {
            this.setState({confirm: 'reset'})
            this.props.resetError()
            this.openModalReset()
            this.openConfirm()
        } else if (isUpload) {
            this.props.resetError()
            this.setState({modalUpload: false})
            this.setState({confirm: 'upload'})
            this.openConfirm()
            this.getDataUser()
        } else if (isExport) {
            this.DownloadMaster()
            this.props.resetError()
        }
    }

    async componentDidMount() {
        const token = localStorage.getItem("token")
        await this.props.getRole(token)
        this.getDataUser()
        this.getDataDepo()
    }

    getDataUser = async (value) => {
        const { page } = this.props.user
        const token = localStorage.getItem("token")
        const search = value === undefined ? '' : this.state.search
        const limit = value === undefined ? this.state.limit : value.limit
        const filter = value === undefined || value.filter === undefined ? this.state.filter : value.filter
        const {sortName, sortType} = this.state
        await this.props.getUser(token, limit, search, page.currentPage, filter, sortName, sortType)
        this.setState({limit: value === undefined ? 10 : value.limit, search: search, filter: filter})
    }

    changeFilter = async (val) => {
        this.setState({filter: val.nomor, filterName: val.name})
        this.getDataUser({limit: this.state.limit, search: this.state.search, filter: val.nomor})
    }

    changeSort = async (val) => {
        this.setState({sortType: val.type, sortName: val.name})
        this.getDataUser({limit: this.state.limit, search: this.state.search})
    }

    getDataDepo = async () => {
        const token = localStorage.getItem("token")
        await this.props.getDepo(token, 1000, '')
        // const { dataDepo } = this.props.depo
    }

    menuButtonClick(ev) {
        ev.preventDefault();
        this.onSetOpen(!this.state.open);
    }

    onSetOpen(open) {
        this.setState({ open });
    }

    openModalReset = () => {
        this.setState({modalReset: !this.state.modalReset})
    }

    chekApp = (val) => {
        const { listUser } = this.state
        const {dataUser} = this.props.user
        if (val === 'all') {
            const data = []
            for (let i = 0; i < dataUser.length; i++) {
                data.push(dataUser[i].id)
            }
            this.setState({listUser: data})
        } else {
            listUser.push(val)
            this.setState({listUser: listUser})
        }
    }

    chekRej = (val) => {
        const {listUser} = this.state
        if (val === 'all') {
            const data = []
            this.setState({listUser: data})
        } else {
            const data = []
            for (let i = 0; i < listUser.length; i++) {
                if (listUser[i] === val) {
                    data.push()
                } else {
                    data.push(listUser[i])
                }
            }
            this.setState({listUser: data})
        }
    }


    roleApp = (val) => {
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

    roleRej = (val) => {
        const { listRole } = this.state
        if (val === 'all') {
            const data = []
            this.setState({listRole: data})
        } else {
            const data = []
            for (let i = 0; i < listRole.length; i++) {
                if (listRole[i] == val) {
                    data.push()
                } else {
                    data.push(listRole[i])
                }
            }
            this.setState({listRole: data})
        }
    }

    downloadTemplate = () => {
        const {listUser} = this.state
        const {dataUser} = this.props.user
        const dataDownload = []

        const workbook = new ExcelJS.Workbook();
        const ws = workbook.addWorksheet('data user')

        // await ws.protect('F1n4NcePm4')

        const borderStyles = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
        }
        

        ws.columns = [
            {header: 'User Name', key: 'c2'},
            {header: 'Full Name', key: 'c3'},
            {header: 'Kode Area', key: 'c4'},
            {header: 'Email', key: 'c5'},
            {header: 'User Level', key: 'c6'},
        ]

        ws.eachRow({ includeEmpty: true }, function(row, rowNumber) {
            row.eachCell({ includeEmpty: true }, function(cell, colNumber) {
              cell.border = borderStyles;
            })
          })

          ws.columns.forEach(column => {
            const lengths = column.values.map(v => v.toString().length)
            const maxLength = Math.max(...lengths.filter(v => typeof v === 'number'))
            column.width = maxLength + 5
        })

        workbook.xlsx.writeBuffer().then(function(buffer) {
            fs.saveAs(
              new Blob([buffer], { type: "application/octet-stream" }),
              `Template Master User.xlsx`
            );
          });
    }

    downloadData = () => {
        const {listUser} = this.state
        const {dataUser, dataRole} = this.props.user
        const dataDownload = []
        for (let i = 0; i < listUser.length; i++) {
            for (let j = 0; j < dataUser.length; j++) {
                if (dataUser[j].id === listUser[i]) {
                    dataDownload.push(dataUser[j])
                }
            }
        }

        const workbook = new ExcelJS.Workbook();
        const ws = workbook.addWorksheet('data user')

        // await ws.protect('F1n4NcePm4')

        const borderStyles = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
        }
        

        ws.columns = [
            {header: 'User Name', key: 'c2'},
            {header: 'Full Name', key: 'c3'},
            {header: 'Kode Area', key: 'c4'},
            {header: 'Email', key: 'c5'},
            {header: 'User Level', key: 'c6'},
        ]

        dataDownload.map((item, index) => { return ( ws.addRow(
            {
                c2: item.username,
                c3: item.fullname,
                c4: item.kode_plant === 0 ? "" : item.kode_plant,
                c5: item.email,
                c6: `${item.user_level}-${dataRole.find(({nomor}) => nomor == item.user_level).name}`,
            }
        )
        ) })

        ws.eachRow({ includeEmpty: true }, function(row, rowNumber) {
            row.eachCell({ includeEmpty: true }, function(cell, colNumber) {
              cell.border = borderStyles;
            })
          })

          ws.columns.forEach(column => {
            const lengths = column.values.map(v => v.toString().length)
            const maxLength = Math.max(...lengths.filter(v => typeof v === 'number'))
            column.width = maxLength + 5
        })

        workbook.xlsx.writeBuffer().then(function(buffer) {
            fs.saveAs(
              new Blob([buffer], { type: "application/octet-stream" }),
              `Master User ${moment().format('DD MMMM YYYY')}.xlsx`
            );
          });
    }

    render() {
        const {isOpen, dropOpen, dropOpenNum, detail, level, upload, errMsg, listUser, listRole} = this.state
        const {dataUser, isGet, alertM, alertMsg, alertUpload, page, dataRole} = this.props.user
        const { dataDepo } = this.props.depo
        const levels = localStorage.getItem('level')
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
                                    <div className={style.titleDashboard}>Master User</div>
                                </div>
                                <div className={style.secHeadDashboard} >
                                    <div>
                                        <text>Show: </text>
                                        <ButtonDropdown className={style.drop} isOpen={dropOpen} toggle={this.dropDown}>
                                        <DropdownToggle caret color="light">
                                            {this.state.limit}
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem className={style.item} onClick={() => this.getDataUser({limit: 10, search: ''})}>10</DropdownItem>
                                            <DropdownItem className={style.item} onClick={() => this.getDataUser({limit: 20, search: ''})}>20</DropdownItem>
                                            <DropdownItem className={style.item} onClick={() => this.getDataUser({limit: 50, search: ''})}>50</DropdownItem>
                                        </DropdownMenu>
                                        </ButtonDropdown>
                                        <text className={style.textEntries}>entries</text>
                                    </div>
                                    <div className='filterUser'>
                                        <text className='mr-2'>Filter:</text>
                                        <UncontrolledDropdown className={style.drop}>
                                            <DropdownToggle caret color="light">
                                                {this.state.filterName}
                                            </DropdownToggle>
                                            <DropdownMenu 
                                                right
                                                modifiers={{
                                                setMaxHeight: {
                                                    enabled: true,
                                                    order: 890,
                                                    fn: (data) => {
                                                    return {
                                                        ...data,
                                                        styles: {
                                                        ...data.styles,
                                                        overflow: 'auto',
                                                        maxHeight: '400px',
                                                        },
                                                    };
                                                    },
                                                },
                                            }}
                                            >
                                                {dataRole !== undefined && dataRole.map(item => {
                                                    return (
                                                        <DropdownItem onClick={() => {this.setState({filter: item.id, filterName: item.name}); this.changeFilter({name: item.name, nomor: item.id})}}>{item.name}</DropdownItem>
                                                    )
                                                })}
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                                <div className='mb-4'></div>
                                <div className={style.secEmail2}>
                                    <div className='rowGeneral'>
                                        <Button onClick={this.openModalAdd} color="primary" size="lg">Add</Button>
                                        <Button onClick={this.openModalUpload} className='ml-1' color="warning" size="lg">Upload</Button>
                                        <Button onClick={this.ExportMaster} className='ml-1' color="success" size="lg">Download</Button>
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
                                {isGet === false ? (
                                    <div className={style.tableDashboard}>
                                    <Table bordered responsive hover className={style.tab}>
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>User Name</th>
                                                <th>Full Name</th>
                                                <th>Kode Plant</th>
                                                <th>Email</th>
                                                <th>User Level</th>
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
                                                <th>User Name</th>
                                                <th>Full Name</th>
                                                <th>Kode Plant</th>
                                                <th>Email</th>
                                                <th>User Level</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {dataUser.length !== 0 && dataUser.map(item => {
                                                return (
                                                <tr onClick={()=>this.openModalEdit(this.setState({detail: item}))}>
                                                    <th scope="row">{(dataUser.indexOf(item) + (((page.currentPage - 1) * page.limitPerPage) + 1))}</th>
                                                    <td>{item.username}</td>
                                                    <td>{item.fullname}</td>
                                                    <td>{item.kode_plant === 0 ? "" : item.kode_plant}</td>
                                                    <td>{item.email}</td>
                                                    <td>{dataRole.find(({nomor}) => nomor == item.user_level).name}</td>
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
                        <h2 className={styleTrans.pageTitle}>Master User</h2>
                        
                        <div className={styleTrans.searchContainer}>
                            <div>
                                <text>Show: </text>
                                <ButtonDropdown className={style.drop} isOpen={dropOpen} toggle={this.dropDown}>
                                <DropdownToggle caret color="light">
                                    {this.state.limit}
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem className={style.item} onClick={() => this.getDataUser({limit: 10, search: ''})}>10</DropdownItem>
                                    <DropdownItem className={style.item} onClick={() => this.getDataUser({limit: 20, search: ''})}>20</DropdownItem>
                                    <DropdownItem className={style.item} onClick={() => this.getDataUser({limit: 50, search: ''})}>50</DropdownItem>
                                    <DropdownItem className={style.item} onClick={() => this.getDataUser({limit: 'all', search: ''})}>All</DropdownItem>
                                </DropdownMenu>
                                </ButtonDropdown>
                                <text className={style.textEntries}>entries</text>
                            </div>
                            <div className='filterUser'>
                                <text className='mr-2'>Filter:</text>
                                <UncontrolledDropdown className={style.drop}>
                                    <DropdownToggle caret color="light">
                                        {this.state.filterName}
                                    </DropdownToggle>
                                    <DropdownMenu 
                                        right
                                        modifiers={{
                                        setMaxHeight: {
                                            enabled: true,
                                            order: 890,
                                            fn: (data) => {
                                            return {
                                                ...data,
                                                styles: {
                                                ...data.styles,
                                                overflow: 'auto',
                                                maxHeight: '400px',
                                                },
                                            };
                                            },
                                        },
                                    }}
                                    >
                                        <DropdownItem onClick={() => {this.setState({filter: 'All', filterName: 'All'}); this.changeFilter({name: 'All', nomor: 'All'})}}>All</DropdownItem>
                                        {dataRole !== undefined && dataRole.map(item => {
                                            return (
                                                <DropdownItem onClick={() => {this.setState({filter: item.id, filterName: item.name}); this.changeFilter({name: item.name, nomor: item.nomor})}}>{item.name}</DropdownItem>
                                            )
                                        })}
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </div>
                        </div>
                        <div className={styleTrans.searchContainer}>
                            <div className='rowGeneral'>
                                <Button onClick={this.prosesOpenAdd} color="primary" size="lg">Add</Button>
                                <Button onClick={this.openModalUpload} className='ml-2' color="warning" size="lg">Upload</Button>
                                <Button onClick={this.downloadData} className='ml-2' color="success" size="lg">Download</Button>
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

                        <table className={`${styleTrans.table} ${dataUser.length > 0 ? styleTrans.tableFull : ''}`}>
                            <thead>
                                <tr>
                                    <th>
                                        <input  
                                        className='mr-2'
                                        type='checkbox'
                                        checked={listUser.length === 0 ? false : listUser.length === dataUser.length ? true : false}
                                        onChange={() => listUser.length === dataUser.length ? this.chekRej('all') : this.chekApp('all')}
                                        />
                                        {/* Select */}
                                    </th>
                                    <th>No</th>
                                    <th>
                                        {this.state.sortType === 'desc' ? (
                                            <FaSortAlphaDown onClick={() => this.changeSort({name: 'username', type: 'asc'})} className='mr-1' size={20} />
                                        ) : (
                                            <FaSortAlphaUpAlt onClick={() => this.changeSort({name: 'username', type: 'desc'})} className='mr-1' size={20} />
                                        )}
                                        User Name
                                    </th>
                                    <th>Full Name</th>
                                    <th>Kode Area</th>
                                    <th>Email</th>
                                    <th>User Level</th>
                                    <th>Opsi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataUser.length !== 0 && dataUser.map((item, index) => {
                                    return (
                                        <tr>
                                             <td>
                                                <input 
                                                type='checkbox'
                                                checked={listUser.find(element => element === item.id) !== undefined ? true : false}
                                                onChange={listUser.find(element => element === item.id) === undefined ? () => this.chekApp(item.id) : () => this.chekRej(item.id)}
                                                />
                                            </td>
                                            <td scope="row">{(dataUser.indexOf(item) + (((page.currentPage - 1) * page.limitPerPage) + 1))}</td>
                                            <td>{item.username}</td>
                                            <td>{item.fullname}</td>
                                            <td>{item.kode_plant === 0 ? "" : item.kode_plant}</td>
                                            <td>{item.email}</td>
                                            <td>{dataRole.find(({nomor}) => nomor == item.user_level).name}</td>
                                            <td>
                                                <Button onClick={()=>this.prosesOpenEdit(item)} color='success'>Detail</Button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        {dataUser.length === 0 && (
                            <div className={style.spinCol}>
                                <AiOutlineInbox size={50} className='mb-4' />
                                <div className='textInfo'>Data user tidak ditemukan</div>
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
                <Modal toggle={this.openModalAdd} isOpen={this.state.modalAdd} size='lg'>
                    <ModalHeader toggle={this.openModalAdd}>Add Master User</ModalHeader>
                    <Formik
                    initialValues={{
                        username: "",
                        fullname: "",
                        password: "",
                        email: "",
                        depo: "",
                        user_level: "", 
                        status: "",
                        status_it: ""
                    }}
                    validationSchema={userSchema}
                    onSubmit={(values) => {this.addUser(values)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                    <ModalBody>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                User Name
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="username"
                                value={values.username}
                                onBlur={handleBlur("username")}
                                onChange={handleChange("username")}
                                />
                                {errors.username ? (
                                    <text className={style.txtError}>{errors.username}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Full Name
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="fullname"
                                value={values.fullname}
                                onBlur={handleBlur("fullname")}
                                onChange={handleChange("fullname")}
                                />
                                {errors.fullname ? (
                                    <text className={style.txtError}>{errors.fullname}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Email
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="email"
                                value={values.email}
                                onBlur={handleBlur("email")}
                                onChange={handleChange("email")}
                                />
                                {errors.email ? (
                                    <text className={style.txtError}>{errors.email}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Password
                            </text>
                            <div className="col-md-9">
                            <Input 
                            type="password" 
                            name="nama_spv" 
                            value={values.password}
                            onChange={handleChange("password")}
                            onBlur={handleBlur("password")}
                            />
                            {errors.password ? (
                                <text className={style.txtError}>{errors.password}</text>
                            ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Role Utama
                            </text>
                            <div className="col-md-9">
                            <Input 
                                type="select" 
                                name="select"
                                value={values.user_level}
                                onChange={handleChange("user_level")}
                                onBlur={handleBlur("user_level")}
                                >
                                    <option>-Pilih Role-</option>
                                    {dataRole.length !== 0 && dataRole.map(item => {
                                        return (
                                            <option value={item.nomor}>{item.name}</option>
                                        )
                                    })}
                                </Input>
                                {errors.user_level ? (
                                    <text className={style.txtError}>{errors.user_level}</text>
                                ) : null}
                            </div>
                        </div>
                        {(values.user_level == '5' || values.user_level == '9') && (
                            <div className={style.addModalDepo}>
                                <text className="col-md-3">
                                    Area
                                </text>
                                <div className="col-md-9">
                                <Input 
                                    type="select"
                                    name="select"
                                    disabled={values.user_level == '5' || values.user_level == '9' ? false : true}
                                    value={values.depo}
                                    onChange={handleChange("depo")}
                                    onBlur={handleBlur("depo")}
                                    >
                                        <option>-Pilih Area-</option>
                                        {dataDepo.length !== 0 && dataDepo.map(item => {
                                            return (
                                                (values.user_level == '5' && item.kode_plant.length === 4) ? (
                                                    <option value={item.kode_plant}>{item.kode_plant + '-' + item.nama_area}</option>
                                                ) : (values.user_level == '9' && item.kode_plant.length > 4) && (
                                                    <option value={item.kode_plant}>{item.kode_plant + '-' + item.nama_area}</option>
                                                )
                                                
                                            )
                                        })}
                                    </Input>
                                    {errors.depo ? (
                                        <text className={style.txtError}>{errors.depo}</text>
                                    ) : null}
                                </div>
                            </div>
                        )}
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Status
                            </text>
                            <div className="col-md-9">
                            <Input 
                                type="select"
                                name="select"
                                value={values.status}
                                onChange={handleChange("status")}
                                onBlur={handleBlur("status")}
                                >   
                                    <option>-Pilih Status-</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </Input>
                                {errors.status ? (
                                    <text className={style.txtError}>{errors.status}</text>
                                ) : null}
                            </div>
                        </div>
                        {values.user_level == '9' && (
                            <div className={style.addModalDepo}>
                                <text className="col-md-3">
                                    Status IT
                                </text>
                                <div className="col-md-9">
                                <Input 
                                    type="select"
                                    name="select"
                                    value={values.status_it}
                                    onChange={handleChange("status_it")}
                                    onBlur={handleBlur("status_it")}
                                    >   
                                        <option>-Pilih Status-</option>
                                        <option value="it">IT</option>
                                        <option value="non-it">NON IT</option>
                                    </Input>
                                    {errors.status_it ? (
                                        <text className={style.txtError}>{errors.status_it}</text>
                                    ) : null}
                                </div>
                            </div>
                        )}
                        {(values.user_level != '1' && values.user_level != '9' && values.user_level != '5' && values.user_level !== '') && (
                            <div className='addModalMenu'>
                                <text className="col-md-3">
                                    Role Tambahan
                                </text>
                                <div className="col-md-9 listcek">
                                    {dataRole.length !== 0 && dataRole.filter(item => (item.nomor != '1' && item.nomor != '9' && item.nomor != '5' && item.nomor != values.user_level)).map(item => {
                                        return (
                                            <div className='listcek mr-2'>
                                                <Input 
                                                type="checkbox" 
                                                name="access"
                                                checked={listRole.find(element => element == item.nomor) !== undefined ? true : false}
                                                className='ml-1'
                                                onChange={listRole.find(element => element == item.nomor) === undefined ? () => this.roleApp(item.nomor) : () => this.roleRej(item.nomor)}
                                                />
                                                <text className='ml-4'>{item.name}</text>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                        <hr/>
                        <div className={style.foot}>
                            <div></div>
                            <div>
                                <Button className="mr-2" onClick={handleSubmit} color="primary">Save</Button>
                                <Button className="mr-3" onClick={this.openModalAdd}>Cancel</Button>
                            </div>
                        </div>
                    </ModalBody>
                        )}
                    </Formik>
                </Modal>
                <Modal toggle={this.openModalEdit} isOpen={this.state.modalEdit} size='lg'>
                    <ModalHeader toggle={this.openModalEdit}>Edit Master User</ModalHeader>
                    <Formik
                    initialValues={{
                        username: detail.username === null ? '' : detail.username,
                        depo: (detail.user_level == '5' || detail.user_level == '9') ? detail.kode_plant : '',
                        user_level: detail.user_level === null ? '' : detail.user_level, 
                        status: 'active',
                        email: detail.email === null ? '' : detail.email,
                        fullname: detail.fullname === null ? '' : detail.fullname,
                        status_it: detail.status_it === null ? '' : detail.status_it
                    }}
                    validationSchema={userEditSchema}
                    onSubmit={(values) => {this.editUser(values, detail.id)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                    <ModalBody>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                User Name
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="username"
                                value={values.username}
                                onBlur={handleBlur("username")}
                                onChange={handleChange("username")}
                                />
                                {errors.username ? (
                                    <text className={style.txtError}>{errors.username}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Full Name
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="fullname"
                                value={values.fullname}
                                onBlur={handleBlur("fullname")}
                                onChange={handleChange("fullname")}
                                />
                                {errors.fullname ? (
                                    <text className={style.txtError}>{errors.fullname}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Email
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="email"
                                value={values.email}
                                onBlur={handleBlur("email")}
                                onChange={handleChange("email")}
                                />
                                {errors.email ? (
                                    <text className={style.txtError}>{errors.email}</text>
                                ) : null}
                            </div>
                        </div>
                        {(detail.user_level == '5' || detail.user_level === 5) || (detail.user_level == '9' || detail.user_level === 9) ? (
                            <div className={style.addModalDepo}>
                                <text className="col-md-3">
                                    Area
                                </text>
                                <div className="col-md-9">
                                <Input 
                                    type="select" 
                                    name="select"
                                    value={values.depo}
                                    onChange={handleChange("depo")}
                                    onBlur={handleBlur("depo")}
                                    >
                                        <option>-Pilih Area-</option>
                                        {dataDepo.length !== 0 && dataDepo.map(item => {
                                            return (
                                                (detail.user_level == '5' || detail.user_level === 5) && item.kode_plant.length === 4 ? (
                                                    <option value={item.kode_plant}>{item.kode_plant + '-' + item.nama_area}</option>
                                                ) : (detail.user_level == '9' || detail.user_level === 9) && item.kode_plant.length > 4 && (
                                                    <option value={item.kode_plant}>{item.kode_plant + '-' + item.nama_area}</option>
                                                )
                                            )
                                        })}
                                        {/* <option value="50-MEDAN TIMUR">50-MEDAN TIMUR</option>
                                        <option value="53-MEDAN BARAT">53-MEDAN BARAT</option> */}
                                    </Input>
                                    {errors.depo ? (
                                        <text className={style.txtError}>{errors.depo}</text>
                                    ) : null}
                                </div>
                            </div>
                        ) : (
                            <div></div>
                        )}
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Role Utama
                            </text>
                            <div className="col-md-9">
                            <Input 
                                type="select" 
                                name="select"
                                value={values.user_level}
                                onChange={handleChange("user_level")}
                                onBlur={handleBlur("user_level")}
                                >
                                    <option>-Pilih Role-</option>
                                    {dataRole.length !== 0 && dataRole.map(item => {
                                        return (
                                            <option value={item.nomor}>{item.name}</option>
                                        )
                                    })}
                                </Input>
                                {errors.user_level ? (
                                    <text className={style.txtError}>{errors.user_level}</text>
                                ) : null}
                            </div>
                        </div>
                        {/* <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Status
                            </text>
                            <div className="col-md-9">
                            <Input 
                                type="select"
                                name="select"
                                value={values.status}
                                onChange={handleChange("status")}
                                onBlur={handleBlur("status")}
                                >   
                                    <option>-Pilih Status-</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </Input>
                                {errors.status ? (
                                    <text className={style.txtError}>{errors.status}</text>
                                ) : null}
                            </div>
                        </div> */}
                        {(detail.user_level == '9' || detail.user_level === 9) && (
                            <div className={style.addModalDepo}>
                                <text className="col-md-3">
                                    Status IT
                                </text>
                                <div className="col-md-9">
                                <Input 
                                    type="select"
                                    name="select"
                                    value={values.status_it}
                                    onChange={handleChange("status_it")}
                                    onBlur={handleBlur("status_it")}
                                    >   
                                        <option>-Pilih Status-</option>
                                        <option value="it">IT</option>
                                        <option value="non-it">NON IT</option>
                                    </Input>
                                    {errors.status_it ? (
                                        <text className={style.txtError}>{errors.status_it}</text>
                                    ) : null}
                                </div>
                            </div>
                        )}
                        {(values.user_level != '1' && values.user_level != '9' && values.user_level != '5' && values.user_level !== '') && (
                            <div className='addModalMenu'>
                                <text className="col-md-3">
                                    Role Tambahan
                                </text>
                                <div className="col-md-9 listcek">
                                    {dataRole.length !== 0 && dataRole.filter(item => (item.nomor != '1' && item.nomor != '9' && item.nomor != '5' && item.nomor != values.user_level)).map(item => {
                                        return (
                                            <div className='listcek mr-2'>
                                                <Input 
                                                type="checkbox" 
                                                name="access"
                                                checked={listRole.find(element => element == item.nomor) !== undefined ? true : false}
                                                className='ml-1'
                                                onChange={listRole.find(element => element == item.nomor) === undefined ? () => this.roleApp(item.nomor) : () => this.roleRej(item.nomor)}
                                                />
                                                <text className='ml-4'>{item.name}</text>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                        <hr/>
                        <div className={style.foot}>
                            <div>
                                <Button onClick={this.openModalReset} color='warning'>Reset Password</Button>
                            </div>
                            <div>
                                <Button className="mr-2" onClick={handleSubmit} color="primary">Save</Button>
                                <Button className="mr-3" onClick={this.openModalEdit}>Cancel</Button>
                            </div>
                        </div>
                    </ModalBody>
                        )}
                    </Formik>
                </Modal>
                <Modal toggle={this.openModalUpload} isOpen={this.state.modalUpload} >
                    <ModalHeader>Upload Master User</ModalHeader>
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
                            <Button color="info" onClick={this.downloadTemplate}>Download Template</Button>
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
                            <div className={style.sucUpdate}>Berhasil Memperbarui User</div>
                        </div>
                        ) : this.state.confirm === 'add' ? (
                            <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Menambahkan User</div>
                            </div>
                        ) : this.state.confirm === 'upload' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Mengupload Master User</div>
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
                <Modal isOpen={this.props.user.isLoading ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className={style.cekUpdate}>
                                <Spinner />
                                <div sucUpdate>Waiting....</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalReset} toggle={this.openModalReset}>
                    <ModalHeader>Reset Password</ModalHeader>
                    <Formik
                    initialValues={{
                    confirm_password: '',
                    new_password: ''
                    }}
                    validationSchema={changeSchema}
                    onSubmit={(values) => {this.resetPass(values)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                    <ModalBody>
                        {/* <Alert color="danger" className={style.alertWrong} isOpen={this.state.alert}>
                            <div>{alertMsg}</div>
                            <div>{alertM}</div>
                        </Alert> */}
                        <div className={style.addModalDepo}>
                            <text className="col-md-4">
                                New password
                            </text>
                            <div className="col-md-8">
                                <Input 
                                type='password' 
                                name="new_password"
                                value={values.new_password}
                                onBlur={handleBlur("new_password")}
                                onChange={handleChange("new_password")}
                                />
                                {errors.new_password ? (
                                    <text className={style.txtError}>Must be filled</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-4">
                                Confirm password
                            </text>
                            <div className="col-md-8">
                                <Input 
                                type='password' 
                                name="confirm_password"
                                value={values.confirm_password}
                                onBlur={handleBlur("confirm_password")}
                                onChange={handleChange("confirm_password")}
                                />
                                {values.confirm_password !== values.new_password ? (
                                    <text className={style.txtError}>Password do not match</text>
                                ) : null}
                            </div>
                        </div>
                        <hr/>
                        <div className={style.foot}>
                            <div></div>
                            <div>
                                <Button className="mr-2" onClick={handleSubmit} color="primary">Save</Button>
                                <Button className="mr-3" onClick={this.openModalReset} color="danger">Close</Button>
                            </div>
                        </div>
                    </ModalBody>
                    )}
                </Formik>
            </Modal>
            </>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
    depo: state.depo
})

const mapDispatchToProps = {
    logout: auth.logout,
    addUser: user.addUser,
    updateUser: user.updateUser,
    getUser: user.getUser,
    resetError: user.resetError,
    getDepo: depo.getDepo,
    uploadMaster: user.uploadMaster,
    nextPage: user.nextPage,
    exportMaster: user.exportMaster,
    getRole: user.getRole,
    resetPassword: user.resetPassword,
    getDetailUser: user.getDetailUser
}

export default connect(mapStateToProps, mapDispatchToProps)(MasterUser)
	