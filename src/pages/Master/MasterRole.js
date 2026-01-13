import React, { Component } from 'react'
import {  NavbarBrand, DropdownToggle, DropdownMenu, Row, Col,
    DropdownItem, Table, ButtonDropdown, Input, Button,
    Modal, ModalHeader, ModalBody, Alert, Spinner, UncontrolledDropdown} from 'reactstrap'
import style from '../../assets/css/input.module.css'
import {FaSearch, FaUserCircle, FaBars} from 'react-icons/fa'
import {AiFillCheckCircle, AiOutlineFileExcel, AiOutlineInbox} from 'react-icons/ai'
import depo from '../../redux/actions/depo'
import user from '../../redux/actions/user'
import {connect} from 'react-redux'
import {Formik} from 'formik'
import * as Yup from 'yup'
import auth from '../../redux/actions/auth'
import menu from '../../redux/actions/menu'
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

const roleSchema = Yup.object().shape({
    name: Yup.string().required(),
    fullname: Yup.string().required(),
    type: Yup.string().required(),
    nomor: Yup.number('must be filled').required('must be filled')
});

const userEditSchema = Yup.object().shape({
    username: Yup.string().required(),
    fullname: Yup.string().required(),
    depo: Yup.string(),
    user_level: Yup.string().required(),
    status: Yup.string().required()
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
            listUser: []
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
            link.setAttribute('download', "master Role.xlsx"); //or any other extension
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

    addRole = async (values) => {
        const token = localStorage.getItem("token")
        const data = {
            ...values
        }
        await this.props.addRole(token, data)
        this.setState({confirm: 'add'})
        this.openConfirm()
        await this.getDataRole()
        this.openModalAdd()
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
            this.getDataRole({search: this.state.search})
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

    editRole = async (values,id) => {
        const token = localStorage.getItem("token")
        const data = {
            ...values
        }
        await this.props.updateRole(token, id, data)
        this.setState({confirm: 'edit'})
        this.openConfirm()
        this.getDataRole()
        this.openModalEdit()
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
            this.getDataRole()
        } else if (isExport) {
            this.DownloadMaster()
            this.props.resetError()
        }
    }

    async componentDidMount() {
        const token = localStorage.getItem("token")
        this.getDataRole()
        this.getDataMenu()
    }

    getDataRole = async (value) => {
        const { page } = this.props.user
        const token = localStorage.getItem("token")
        const search = value === undefined ? '' : this.state.search
        await this.props.getRole(token, search)
        this.setState({search: search})
    }

    getDataMenu = async (value) => {
        const token = localStorage.getItem("token")
        await this.props.getNameMenu(token)
        await this.props.getDepo(token, 1000, '')
        this.setState({limit: value === undefined ? 10 : value.limit})   
    }

    changeFilter = async (val) => {
        this.setState({filter: val.nomor, filterName: val.name})
        this.getDataRole({limit: this.state.limit, search: this.state.search, filter: val.nomor})
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
        const {dataRole} = this.props.user
        if (val === 'all') {
            const data = []
            for (let i = 0; i < dataRole.length; i++) {
                data.push(dataRole[i].id)
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

    updateAccess = async (val, id) => {
        const token = localStorage.getItem('token')
        const { detail } = this.state
        const data = {
            idRole: detail.nomor,
            idMenu: val.id,
            access: 3
        }
        await this.props.updateRoleMenu(token, id, data)
        await this.props.getRoleMenu(token, detail.nomor)
    }

    downloadTemplate = () => {
        const {listUser} = this.state
        const {dataRole} = this.props.user
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
              `Template Master Role.xlsx`
            );
          });
    }

    downloadData = () => {
        const {listUser} = this.state
        const {dataRole} = this.props.user
        const dataDownload = []
        for (let i = 0; i < listUser.length; i++) {
            for (let j = 0; j < dataRole.length; j++) {
                if (dataRole[j].id === listUser[i]) {
                    dataDownload.push(dataRole[j])
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
                c6: `${item.user_level}-${item.role.name}`,
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
              `Master Role ${moment().format('DD MMMM YYYY')}.xlsx`
            );
          });
    }

    prosesOpenSetting = async (val) => {
        const token = localStorage.getItem("token")
        const {dataMenu, dataName, detailApp} = this.props.menu
        await this.props.getSubMenu(token)
        await this.props.getRoleMenu(token, val.nomor)
        this.setState({detail: val})
        this.openModalEdit()
    }

    getDataDetailMenu = async (value) => {
        this.setState({namaMenu: value.name, tempMenu: value})
        console.log(value)
        const token = localStorage.getItem("token")
        await this.props.getDetailMenu(token, value.name)
        this.openModalMenu()
    }

    render() {
        const {isOpen, dropOpen, dropOpenNum, detail, level, upload, errMsg, listUser} = this.state
        const {dataRole, isGet, alertM, alertMsg, alertUpload, page, menuRole} = this.props.user
        const { dataDepo } = this.props.depo
        const {dataMenu, dataName, detailApp, subMenu} = this.props.menu
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
                <div className={styleTrans.app}>
                    <NewNavbar handleSidebar={this.prosesSidebar} handleRoute={this.goRoute} />

                    <div className={`${styleTrans.mainContent} ${this.state.sidebarOpen ? styleTrans.collapsedContent : ''}`}>
                        <h2 className={styleTrans.pageTitle}>Master Role</h2>
                        
                        <div className={styleTrans.searchContainer}>
                            <Button className='mr-1' onClick={this.openModalAdd} color="primary" size="lg">Add</Button>
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

                        <table className={`${styleTrans.table} ${dataRole.length > 0 ? styleTrans.tableFull : ''}`}>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Name</th>
                                    <th>Full Name</th>
                                    <th>Type</th>
                                    <th>Level</th>
                                    <th>Opsi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataRole.length !== 0 && dataRole.map((item, index) => {
                                    return (
                                        <tr>
                                            <td scope="row">{index + 1}</td>
                                            <td>{item.name}</td>
                                            <td>{item.fullname}</td>
                                            <td>{item.type === null ? 'nasional' : item.type}</td>
                                            <td>{item.nomor}</td>
                                            <td>
                                                <Button 
                                                    onClick={() => this.prosesOpenSetting(item)} 
                                                    color='success'
                                                >
                                                    Setting
                                                </Button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        {dataRole.length === 0 && (
                            <div className={style.spinCol}>
                                <AiOutlineInbox size={50} className='mb-4' />
                                <div className='textInfo'>Data role tidak ditemukan</div>
                            </div>
                        )}
                        <div>
                            <div className={style.infoPageEmail1}>
                                <text>Showing 1 of 1 pages</text>
                                <div className={style.pageButton}>
                                    <button className={style.btnPrev} color="info" disabled onClick={this.prev}>Prev</button>
                                    <button className={style.btnPrev} color="info" disabled onClick={this.next}>Next</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal toggle={this.openModalAdd} isOpen={this.state.modalAdd}>
                    <ModalHeader toggle={this.openModalAdd}>Add Master Role</ModalHeader>
                    <Formik
                    initialValues={{
                        name: "",
                        fullname: "",
                        type: "",
                        nomor: null
                    }}
                    validationSchema={roleSchema}
                    onSubmit={(values) => {this.addRole(values)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                    <ModalBody>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Name
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="name"
                                value={values.name}
                                onBlur={handleBlur("name")}
                                onChange={handleChange("name")}
                                />
                                {errors.name ? (
                                    <text className={style.txtError}>{errors.name}</text>
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
                                Type
                            </text>
                            <div className="col-md-9">
                            <Input 
                                type="select" 
                                value={values.type}
                                onChange={handleChange("type")}
                                onBlur={handleBlur("type")}
                                >
                                    <option>-Pilih Level-</option>
                                    <option value='nasional'>Nasional</option>
                                    <option value='area'>Area</option>
                                </Input>
                                {errors.type ? (
                                    <text className={style.txtError}>{errors.type}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Level
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type='text'
                                name="nomor"
                                value={values.nomor}
                                onBlur={handleBlur("nomor")}
                                onChange={handleChange("nomor")}
                                />
                                {errors.nomor ? (
                                    <text className={style.txtError}>{errors.nomor}</text>
                                ) : null}
                            </div>
                        </div>
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
                <Modal toggle={this.openModalEdit} isOpen={this.state.modalEdit} size='xl'>
                    <ModalHeader>Setting Hak Akses Role</ModalHeader>
                    <Formik
                    initialValues={{
                        name: detail.name,
                        fullname: detail.fullname,
                        type: detail.type,
                        nomor: detail.nomor
                    }}
                    validationSchema={roleSchema}
                    onSubmit={(values) => {this.editRole(values, detail.id)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                    <ModalBody>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Name
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="name"
                                value={values.name}
                                onBlur={handleBlur("name")}
                                onChange={handleChange("name")}
                                />
                                {errors.name ? (
                                    <text className={style.txtError}>{errors.name}</text>
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
                                Type
                            </text>
                            <div className="col-md-9">
                            <Input 
                                type="select" 
                                value={values.type}
                                onChange={handleChange("type")}
                                onBlur={handleBlur("type")}
                                >
                                    <option>-Pilih Level-</option>
                                    <option value='nasional'>Nasional</option>
                                    <option value='area'>Area</option>
                                </Input>
                                {errors.type ? (
                                    <text className={style.txtError}>{errors.type}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Level
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type='text'
                                name="nomor"
                                disabled
                                value={values.nomor}
                                onBlur={handleBlur("nomor")}
                                onChange={handleChange("nomor")}
                                />
                                {errors.nomor ? (
                                    <text className={style.txtError}>{errors.nomor}</text>
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
                        {dataName.length !== 0 && dataName.filter(x => x.type === 'transaksi').map((item, index) => {
                            const dataSub = subMenu.filter(x => x.kode_menu === item.name)
                            const halfIndex = Math.ceil(dataSub.length / 2);
                            const halfFirst = dataSub.slice(0, halfIndex);
                            const halfEnd = dataSub.slice(halfIndex);
                            
                            return (
                                <div key={index} className='mt-4 mb-4 ml-4'>
                                    <div>{item.name}</div>
                                    <Row>
                                        {/* Kolom Kiri */}
                                        {halfFirst.map((x, idx) => (
                                            <Col xl={6} lg={6} md={6} key={`left-${idx}`}>
                                                <Input 
                                                    type='checkbox' 
                                                    checked={menuRole.length > 0 && menuRole.find(y => y.menu_id === x.id)} 
                                                    onChange={() => this.updateAccess(x, menuRole.length > 0 && menuRole.find(y => y.menu_id === x.id)?.id)}
                                                />
                                                <span>{x.name}</span>
                                            </Col>
                                        ))}
                                        
                                        {/* Kolom Kanan */}
                                        {halfEnd.map((x, idx) => (
                                            <Col xl={6} lg={6} md={6} key={`right-${idx}`}>
                                                <Input type='checkbox' />
                                                <span>{x.name}</span>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            )
                        })}

                        <hr/>
                        <div className={style.foot}>
                            <div>
                                {/* <Button onClick={this.openModalReset} color='warning'>Reset Password</Button> */}
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
                    <ModalHeader>Upload Master Role</ModalHeader>
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
                            <div className={style.sucUpdate}>Berhasil Memperbarui Role</div>
                        </div>
                        ) : this.state.confirm === 'add' ? (
                            <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Menambahkan Role</div>
                            </div>
                        ) : this.state.confirm === 'upload' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Mengupload Master Role</div>
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
    depo: state.depo,
    menu: state.menu
})

const mapDispatchToProps = {
    logout: auth.logout,
    addRole: user.addRole,
    updateRole: user.updateRole,
    getRole: user.getRole,
    resetError: user.resetError,
    getDepo: depo.getDepo,
    uploadMaster: user.uploadMaster,
    nextPage: user.nextPage,
    exportMaster: user.exportMaster,
    resetPassword: user.resetPassword,
    getNameMenu: menu.getNameMenu,
    getDetailMenu: menu.getDetailMenu,
    getRoleMenu: user.getRoleMenu,
    updateRoleMenu: user.updateRoleMenu,
    getSubMenu: menu.getSubMenu
}

export default connect(mapStateToProps, mapDispatchToProps)(MasterUser)
	