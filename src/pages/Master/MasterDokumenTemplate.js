import React, { Component } from 'react'
import {  NavbarBrand, DropdownToggle, DropdownMenu,
    DropdownItem, Table, ButtonDropdown, Input, Button,
    Modal, ModalHeader, ModalBody, Alert, Spinner, UncontrolledDropdown} from 'reactstrap'
import style from '../../assets/css/input.module.css'
import {FaSearch, FaUserCircle, FaBars, FaSortAlphaDown, FaSortAlphaUpAlt} from 'react-icons/fa'
import {AiFillCheckCircle, AiOutlineFileExcel, AiOutlineInbox, AiOutlineClose} from 'react-icons/ai'
import depo from '../../redux/actions/depo'
import user from '../../redux/actions/user'
import {connect} from 'react-redux'
import {Formik} from 'formik'
import * as Yup from 'yup'
import auth from '../../redux/actions/auth'
import apk from '../../redux/actions/apk'
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

const apkSchema = Yup.object().shape({
    name: Yup.string().required(),
    versi: Yup.string().required(),
    compatible: Yup.string().required(),
    date: Yup.date().required(),
    note: Yup.string().required()
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

class MasterDokumenTemplate extends Component {
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
            listApk: [],
            listRole: [],
            sortType: 'asc',
            sortName: 'username',
            isLoading: false
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
        this.openModalAdd()
    }

    prosesOpenEdit = async (val) => {
        const token = localStorage.getItem("token")
        this.setState({detail: val})
        await this.props.getDetailApk(token, val.id)
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

    addApk = async (val) => {
        const token = localStorage.getItem("token")
        const { listRole } = this.state
        // const destruct = values.depo === "-Pilih Area-" ? ["", ""] : values.depo.split('-')
        const data = new FormData()
        data.append('file', this.state.fileUpload)
        data.append('name', val.name)
        data.append('versi', val.versi)
        data.append('compatible', val.compatible)
        data.append('date', val.date)
        data.append('note', val.note)
        console.log(val)
        await this.props.addApk(token, data)
        this.setState({confirm: 'add'})
        this.openConfirm()
        await this.getDataApk()
        this.openModalAdd()
    }

    downloadFile = async (val) => {
        try {
          this.setState({isLoading: true})
          const url = `${REACT_APP_BACKEND_URL}/${val.path}`;
          const res = await axios.get(url, {
            responseType: "blob",
            // headers: { Authorization: 'Bearer ' + token }
          });
    
          // dapat filename jika server set header
          const disposition = res.headers["content-disposition"];
          let filename = `${val.name}-v${val.versi}.apk`;
          if (disposition && disposition.includes("filename=")) {
            filename = disposition.split("filename=")[1].replace(/['"]/g, "").trim();
          }
    
          const blob = new Blob([res.data]);
          const blobUrl = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = blobUrl;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(blobUrl);
          this.setState({isLoading: false})
        } catch (err) {
          console.error(err);
          alert("Download gagal: " + err.message);
        }
      };

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
            this.getDataApk()
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
            this.getDataApk({limit: 10, search: this.state.search})
        }
    }

    onChangeHandler = e => {
        const {size, type} = e.target.files[0]
        if (size >= 75000000) {
            this.setState({errMsg: "Maximum upload size 75 MB"})
            this.uploadAlert()
        } else if (type !== 'application/vnd.android.package-archive'){
            this.setState({errMsg: 'Invalid file type. Only apk files are allowed.'})
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
            this.getDataApk()
        } else if (isUpload === false) {
            this.props.resetError()
            this.setState({confirm: 'failUpload'})
            this.openConfirm()
        } else if (isExport) {
            this.DownloadMaster()
            this.props.resetError()
        }
    }

    async componentDidMount() {
        const token = localStorage.getItem("token")
        this.getDataApk()
    }

    getDataApk = async (value) => {
        const { page } = this.props.user
        const token = localStorage.getItem("token")
        const search = value === undefined ? '' : this.state.search
        const limit = value === undefined ? this.state.limit : value.limit
        const filter = value === undefined || value.filter === undefined ? this.state.filter : value.filter
        const {sortName, sortType} = this.state
        await this.props.getApk(token, limit, search, page.currentPage, filter)
        this.setState({limit: value === undefined ? 10 : value.limit, search: search, filter: filter})
    }

    changeFilter = async (val) => {
        this.setState({filter: val.nomor, filterName: val.name})
        this.getDataApk({limit: this.state.limit, search: this.state.search, filter: val.nomor})
    }

    changeSort = async (val) => {
        this.setState({sortType: val.type, sortName: val.name})
        this.getDataApk({limit: this.state.limit, search: this.state.search})
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
        const { listApk } = this.state
        const {dataApk} = this.props.apk
        if (val === 'all') {
            const data = []
            for (let i = 0; i < dataApk.length; i++) {
                data.push(dataApk[i].id)
            }
            this.setState({listApk: data})
        } else {
            listApk.push(val)
            this.setState({listApk: listApk})
        }
    }

    chekRej = (val) => {
        const {listApk} = this.state
        if (val === 'all') {
            const data = []
            this.setState({listApk: data})
        } else {
            const data = []
            for (let i = 0; i < listApk.length; i++) {
                if (listApk[i] === val) {
                    data.push()
                } else {
                    data.push(listApk[i])
                }
            }
            this.setState({listApk: data})
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
        const {listApk} = this.state
        const {dataApk} = this.props.apk
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
        const {listApk} = this.state
        const {dataApk} = this.props.apk
        const { dataRole } = this.props.user
        const dataDownload = []
        for (let i = 0; i < listApk.length; i++) {
            for (let j = 0; j < dataApk.length; j++) {
                if (dataApk[j].id === listApk[i]) {
                    dataDownload.push(dataApk[j])
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
        const {isOpen, dropOpen, dropOpenNum, detail, level, upload, errMsg, listApk, listRole} = this.state
        const {isGet, alertM, alertMsg, alertUpload, page, dataRole} = this.props.user
        const {dataApk} = this.props.apk
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
                <div className={styleTrans.app}>
                    <NewNavbar handleSidebar={this.prosesSidebar} handleRoute={this.goRoute} />

                    <div className={`${styleTrans.mainContent} ${this.state.sidebarOpen ? styleTrans.collapsedContent : ''}`}>
                        <h2 className={styleTrans.pageTitle}>Master Dokumen Template</h2>
                        
                        <div className={styleTrans.searchContainer}>
                        </div>
                        <div className={styleTrans.searchContainer}>
                            <div className='rowGeneral'>
                                {levels === '1' ? (
                                    <>
                                        {/* <Button onClick={this.prosesOpenAdd} color="primary" size="lg">Add</Button> */}
                                        <Button onClick={this.prosesOpenAdd} className='ml-2' color="warning" size="lg">Upload</Button>
                                    </>
                                ) : (
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
                                )}
                            </div>
                            {levels === '1' && (
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
                            )}
                        </div>

                        <table className={`${styleTrans.table} ${dataApk.length > 0 ? styleTrans.tableFull : ''}`}>
                            <thead>
                                <tr>
                                    <th className='tdNo'>No</th>
                                    <th>
                                        Name
                                    </th>
                                    <th>Release Note</th>
                                    <th>Release Date</th>
                                    <th>Compatible</th>
                                    <th>Version</th>
                                    <th>Opsi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataApk.length !== 0 && dataApk.map((item, index) => {
                                    return (
                                        <tr>
                                            <td className='tdNo' scope="row">
                                                {index + 1}
                                            </td>
                                            <td>{item.name}</td>
                                            <td>{item.note_release}</td>
                                            <td>{moment(item.date_release).format('DD MMMM YYYY')}</td>
                                            <td>{item.compatible}</td>
                                            <td>{item.versi}</td>
                                            <td>
                                                {/* <Button className='ml-1' onClick={()=>this.prosesOpenEdit(item)} color='warning'>Detail</Button> */}
                                                <Button className='ml-1 mt-1' onClick={()=>this.downloadFile(item)} color='success'>Download</Button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        {dataApk.length === 0 && (
                            <div className={style.spinCol}>
                                <AiOutlineInbox size={50} className='mb-4' />
                                <div className='textInfo'>Data apk tidak ditemukan</div>
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
                    <ModalHeader toggle={this.openModalAdd}>Upload APK</ModalHeader>
                    <Formik
                    initialValues={{
                        name: "",
                        versi: "",
                        compatible: "",
                        date: "",
                        note: ""
                    }}
                    validationSchema={apkSchema}
                    onSubmit={(values) => {this.addApk(values)}}
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
                                Version
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="versi"
                                value={values.versi}
                                onBlur={handleBlur("versi")}
                                onChange={handleChange("versi")}
                                />
                                {errors.versi ? (
                                    <text className={style.txtError}>{errors.versi}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Compatible
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="text" 
                                name="compatible"
                                value={values.compatible}
                                onBlur={handleBlur("compatible")}
                                onChange={handleChange("compatible")}
                                />
                                {errors.compatible ? (
                                    <text className={style.txtError}>{errors.compatible}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Release Date
                            </text>
                            <div className="col-md-9">
                            <Input 
                            type="date" 
                            name="date" 
                            value={values.date}
                            onChange={handleChange("date")}
                            onBlur={handleBlur("date")}
                            />
                            {errors.date ? (
                                <text className={style.txtError}>{errors.date}</text>
                            ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Release Note
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="text" 
                                name="note"
                                value={values.note}
                                onBlur={handleBlur("note")}
                                onChange={handleChange("note")}
                                />
                                {errors.note ? (
                                    <text className={style.txtError}>{errors.note}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Upload APK
                            </text>
                            <div className="col-md-9">
                                <Input
                                type="file"
                                name="file"
                                accept=".apk"
                                onChange={this.onChangeHandler}
                                />
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
                <Modal isOpen={this.state.modalConfirm} toggle={this.openConfirm} size="md">
                    <ModalBody>
                        {this.state.confirm === 'edit' ? (
                        <div className={style.cekUpdate}>
                            <AiFillCheckCircle size={80} className={style.green} />
                            <div className={style.sucUpdate}>Berhasil Memperbarui APK</div>
                        </div>
                        ) : this.state.confirm === 'add' ? (
                            <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Menambahkan APK</div>
                            </div>
                        ) : this.state.confirm === 'upload' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Mengupload Master APK</div>
                            </div>
                            </div>
                        ) : this.state.confirm === 'reset' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Mereset Password</div>
                            </div>
                            </div>
                        ) : this.state.confirm === 'failUpload' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                    <div className={[style.sucUpdate, style.green, style.mb4]}>Gagal Upload</div>

                                    {alertUpload !== undefined && alertUpload.length > 0 ? alertUpload.map(item => {
                                        return (
                                            <div className={[style.sucUpdate, style.green, style.mb3]}>{`${item}`}</div>
                                        )
                                    }) : (
                                        <div></div>
                                    )}
                                </div>
                            </div>
                        ): (
                            <div></div>
                        )}
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.props.apk.isLoading || this.state.isLoading ? true: false} size="sm">
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
    apk: state.apk
})

const mapDispatchToProps = {
    logout: auth.logout,
    addApk: apk.addApk,
    updateUser: user.updateUser,
    getApk: apk.getApk,
    resetError: apk.resetError,
    getDepo: depo.getDepo,
    uploadMaster: user.uploadMaster,
    nextPage: user.nextPage,
    resetPassword: user.resetPassword,
    getDetailApk: apk.getDetailApk
}

export default connect(mapStateToProps, mapDispatchToProps)(MasterDokumenTemplate)
	