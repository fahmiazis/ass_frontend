import React, { Component } from 'react'
import {  NavbarBrand, DropdownToggle, DropdownMenu,
    DropdownItem, Table, ButtonDropdown, Input, Button,
    Modal, ModalHeader, ModalBody, Alert, Spinner} from 'reactstrap'
import style from '../../assets/css/input.module.css'
import {FaSearch, FaUserCircle, FaBars} from 'react-icons/fa'
import {AiFillCheckCircle, AiOutlineFileExcel} from 'react-icons/ai'
import {AiOutlineInbox} from 'react-icons/ai'
import depo from '../../redux/actions/depo'
import report from '../../redux/actions/report'
import disposal from '../../redux/actions/disposal'
import user from '../../redux/actions/user'
import moment from 'moment'
import {connect} from 'react-redux'
import {Formik} from 'formik'
import * as Yup from 'yup'
import auth from '../../redux/actions/auth'
import {default as axios} from 'axios'
import Sidebar from "../../components/Header";
import MaterialTitlePanel from "../../components/material_title_panel";
import SidebarContent from "../../components/sidebar_content";
import ReactHtmlToExcel from "react-html-table-to-excel"
import NavBar from '../../components/NavBar'
import styleTrans from '../../assets/css/transaksi.module.css'
import NewNavbar from '../../components/NewNavbar'
import ExcelJS from "exceljs"
import fs from "file-saver"
const {REACT_APP_BACKEND_URL} = process.env

const userSchema = Yup.object().shape({
    username: Yup.string().required(),
    fullname: Yup.string().required(),
    password: Yup.string().required(),
    depo: Yup.string(),
    user_level: Yup.string().required(),
    status: Yup.string().required()
});

const userEditSchema = Yup.object().shape({
    username: Yup.string().required(),
    fullname: Yup.string().required(),
    password: Yup.string(),
    depo: Yup.string(),
    user_level: Yup.string().required(),
    status: Yup.string().required()
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
            limit: 100,
            newMut: [],
            search: '',
            time: 'pilih',
            time1: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
            // time1: moment().startOf('month').format('YYYY-MM-DD'),
            time2: moment().endOf('month').format('YYYY-MM-DD')
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

    DownloadTemplate = () => {
        axios({
            url: `${REACT_APP_BACKEND_URL}/masters/user.xlsx`,
            method: 'GET',
            responseType: 'blob',
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "user.xlsx");
            document.body.appendChild(link);
            link.click();
        });
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

    onSearch = async (e) => {
        this.setState({ search: e.target.value })
        const token = localStorage.getItem("token")
        const { filter } = this.state
        if (e.key === 'Enter') {
            this.changeFilter(filter)
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
        const {isError, isUpload, isExport} = this.props.user
        if (isError) {
            this.props.resetError()
            this.showAlert()
        } else if (isUpload) {
            setTimeout(() => {
                this.props.resetError()
                this.setState({modalUpload: false})
             }, 2000)
             setTimeout(() => {
                this.getDataUser()
             }, 2100)
        } else if (isExport) {
            this.DownloadMaster()
            this.props.resetError()
        }
    }

    componentDidMount() {
        this.changeFilter('selesai')
    }

    getDataReportMutasi = async (val) => {
        const limit = val === undefined || val.limit === undefined ? 10 : val.limit
        const token = localStorage.getItem("token")
        this.setState({limit: limit === null ? 'All' : limit})
        const { time1, time2, search} = this.state
        const cekTime1 = time1 === '' ? 'undefined' : time1
        const cekTime2 = time2 === '' ? 'undefined' : time2
        const status = 8
        const tipe = 'mutasi'
        await this.props.getReportMutasi(token, limit, search, 1, status, tipe, cekTime1, cekTime2)
    }

    changeFilter = async (val) => {
        const token = localStorage.getItem('token')
        const { time1, time2, search, limit } = this.state
        const cekTime1 = time1 === '' ? 'undefined' : time1
        const cekTime2 = time2 === '' ? 'undefined' : time2
        const status = val === 'selesai' ? '8' : 'all'
        const tipe = 'mutasi'

        await this.props.getReportMutasi(token, limit, search, 1, status, tipe, cekTime1, cekTime2)

        const { dataMut } = this.props.report
        const role = localStorage.getItem('role')
        if (val === 'reject' && dataMut.length > 0) {
            const newMut = []
            for (let i = 0; i < dataMut.length; i++) {
                if (dataMut[i].status_reject === 1) {
                    newMut.push(dataMut[i])
                }
            }
            this.setState({ filter: val, newMut: newMut })
        } else if (val === 'selesai' && dataMut.length > 0) {
            const newMut = []
            for (let i = 0; i < dataMut.length; i++) {
                if (dataMut[i].status_form === 8) {
                    newMut.push(dataMut[i])
                }
            }
            this.setState({ filter: val, newMut: newMut })
        } else {
            const newMut = []
            for (let i = 0; i < dataMut.length; i++) {
                newMut.push(dataMut[i])
            }
            this.setState({ filter: val, newMut: newMut })
        }
    }

    menuButtonClick(ev) {
        ev.preventDefault();
        this.onSetOpen(!this.state.open);
    }

    onSetOpen(open) {
        this.setState({ open });
    }

    downloadReport = async (val) => {
        const { dataMut } = this.props.report
        const { newMut } = this.state
        const dataDownload = newMut

        const workbook = new ExcelJS.Workbook();
        const ws = workbook.addWorksheet('report mutasi asset')

        // await ws.protect('F1n4NcePm4')

        const borderStyles = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
        }


        ws.columns = [
            {header: 'No', key: 'c1'},
            {header: 'NO PENGAJUAN', key: 'c2'},
            {header: 'NO ASSET', key: 'c3'},
            {header: 'DESKRIPSI ASSET', key: 'c4'},
            {header: 'DARI', key: 'c5'},
            {header: 'KE', key: 'c6'},
            {header: 'KATEGORI', key: 'c7'},
            {header: 'TGL PENGAJUAN MUTASI', key: 'c8'},
            {header: 'BUKTI SERAH TERIMA', key: 'c9'},
            {header: 'TGL MUTASI FISIK', key: 'c10'},
            {header: 'TGL MUTASI SAP', key: 'c11'},
            {header: 'KETERANGAN', key: 'c12'},
            {header: 'STATUS', key: 'c13'},
            {header: 'PIC ASSET', key: 'c14'},
            {header: 'NO DOC SAP', key: 'c15'}
        ]

        dataDownload.map((item, index) => { return ( ws.addRow(
            {
                c1: index + 1,
                c2: item.no_mutasi,
                c3: item.no_asset,
                c4: item.nama_asset,
                c5: item.area,
                c6: item.area_rec,
                c7: item.kategori,
                c8: item.tanggalMut === null ? '-' : moment(item.tanggalMut).format('DD/MM/YYYY'),
                c9: item.status_form > 2 ? 'V' : '-',
                c10: item.tgl_mutasifisik === null ? '-' : moment(item.tgl_mutasifisik).format('DD/MM/YYYY'),
                c11: item.tgl_mutasisap === null ? '-' : moment(item.tgl_mutasisap).format('DD/MM/YYYY'),
                c12: '',
                c13: item.status_form === 2 ? 'Proses Approval' : item.status_form === 3 ? 'Proses Budget' : item.status_form === 5 ? 'Proses Final' : item.status_form === 9 ? 'Proses Ekseskusi' : item.status_form === 8 ? 'Finish' : '-',
                c14: item.depo.nama_pic_1,
                c15: item.doc_sap
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
              `Report Mutasi Asset ${moment().format('DD MMMM YYYY')}.xlsx`
            );
          });
    }

    selectTime = (val) => {
        this.setState({ [val.type]: val.val })
    }

    changeTime = async (val) => {
        const token = localStorage.getItem("token")
        this.setState({ time: val })
        if (val === 'all') {
            this.setState({ time1: '', time2: '' })
            setTimeout(() => {
                this.getDataTime()
            }, 500)
        }
    }

    getDataTime = async () => {
        const { time1, time2, filter, search, limit } = this.state
        const cekTime1 = time1 === '' ? 'undefined' : time1
        const cekTime2 = time2 === '' ? 'undefined' : time2
        const token = localStorage.getItem("token")
        const level = localStorage.getItem("level")
        // const status = filter === 'selesai' ? '8' : filter === 'available' && level === '2' ? '1' : filter === 'available' && level === '8' ? '3' : 'all'
        this.changeFilter(filter)
    }

    render() {
        const {isOpen, dropOpen, dropOpenNum, detail, level, upload, errMsg, newMut} = this.state
        const {dataUser, isGet, alertM, alertMsg, alertUpload, page, dataRole} = this.props.user
        const { dataMut } = this.props.report
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
                        <h2 className={styleTrans.pageTitle}>Report Mutasi Asset</h2>
                        <div className='mb-4'></div>
                        <div className={styleTrans.searchContainer}>
                            {/* <div className={style.secHeadDashboard} >
                                <div>
                                    <text>Show: </text>
                                    <ButtonDropdown className={style.drop} isOpen={dropOpen} toggle={this.dropDown}>
                                    <DropdownToggle caret color="light">
                                        {this.state.limit}
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem className={style.item} onClick={() => this.getDataReportMutasi({limit: 10, search: ''})}>10</DropdownItem>
                                        <DropdownItem className={style.item} onClick={() => this.getDataReportMutasi({limit: 20, search: ''})}>20</DropdownItem>
                                        <DropdownItem className={style.item} onClick={() => this.getDataReportMutasi({limit: 50, search: ''})}>50</DropdownItem>
                                        <DropdownItem className={style.item} onClick={() => this.getDataReportMutasi({limit: 100, search: ''})}>100</DropdownItem>
                                        <DropdownItem className={style.item} onClick={() => this.getDataReportMutasi({limit: 'All', search: ''})}>All</DropdownItem>
                                    </DropdownMenu>
                                    </ButtonDropdown>
                                    <text className={style.textEntries}>entries</text>
                                </div>
                            </div> */}
                            {/* <div>
                                <Button color='success' size='lg' onClick={this.downloadReport}>
                                    Download
                                </Button>
                            </div> */}
                        </div>
                        <div className={styleTrans.searchContainer}>
                            <Button color='success' size='lg' onClick={this.downloadReport}>
                                Download
                            </Button>
                            <select value={this.state.filter} onChange={e => this.changeFilter(e.target.value)} className={styleTrans.searchInput}>
                                <option value="all">All</option>
                                <option value="reject">Reject</option>
                                <option value="selesai">Selesai</option>
                            </select>
                        </div>
                        
                        <div className={styleTrans.searchContainer}>
                            <div className='rowCenter'>
                                <div className='rowCenter'>
                                    <Input className={style.filter3} type="select" value={this.state.time} onChange={e => this.changeTime(e.target.value)}>
                                        <option value="all">Time (All)</option>
                                        <option value="pilih">Periode</option>
                                    </Input>
                                </div>
                                {this.state.time === 'pilih' ?  (
                                    <>
                                        <div className='rowCenter'>
                                            <text className='bold'>:</text>
                                            <Input
                                                type= "date" 
                                                className="inputRinci"
                                                value={this.state.time1}
                                                onChange={e => this.selectTime({val: e.target.value, type: 'time1'})}
                                            />
                                            <text className='mr-1 ml-1'>To</text>
                                            <Input
                                                type= "date" 
                                                className="inputRinci"
                                                value={this.state.time2}
                                                onChange={e => this.selectTime({val: e.target.value, type: 'time2'})}
                                            />
                                            <Button
                                            disabled={this.state.time1 === '' || this.state.time2 === '' ? true : false} 
                                            color='primary' 
                                            onClick={this.getDataTime} 
                                            className='ml-1'>
                                                Go
                                            </Button>
                                        </div>
                                    </>
                                ) : null}
                            </ div>
                            <input
                                type="text"
                                placeholder="Search..."
                                onChange={this.onSearch}
                                value={this.state.search}
                                onKeyPress={this.onSearch}
                                className={styleTrans.searchInput}
                            />
                        </div>

                        <table className={`${styleTrans.table} ${newMut.length > 0 ? styleTrans.tableFull : ''}`}>
                            <thead>
                                <tr>
                                    <th>NO</th>
                                    <th>NO PENGAJUAN</th>
                                    <th>NO ASSET</th>
                                    <th>DESKRIPSI ASSET</th>
                                    <th>DARI</th>
                                    <th>KE</th>
                                    <th>KATEGORI</th>
                                    <th>TGL PENGAJUAN MUTASI</th>
                                    <th>BUKTI SERAH TERIMA</th>
                                    <th>TGL MUTASI FISIK</th>
                                    <th>TGL MUTASI SAP</th>
                                    <th>KETERANGAN</th>
                                    <th>STATUS</th>
                                    <th>PIC ASSET</th>
                                    <th>NO DOC SAP</th>
                                </tr>
                            </thead>
                            <tbody>
                                {newMut.length !== 0 && newMut.map(item => {
                                    return (
                                    <tr className={item.status_form === 0 ? 'fail' : item.status_reject === 0 ? 'note' : item.status_reject === 1 && 'bad'}>
                                        <td scope="row">{newMut.indexOf(item) + 1}</td>
                                        <td>{item.no_mutasi}</td>
                                        <td>{item.no_asset}</td>
                                        <td>{item.nama_asset}</td>
                                        <td>{item.area}</td>
                                        <td>{item.area_rec}</td>
                                        <td>{item.kategori}</td>
                                        <td>{item.tanggalMut === null ? '-' : moment(item.tanggalMut).format('DD/MM/YYYY')}</td>
                                        <td>{item.status_form > 2 ? 'V' : '-'}</td>
                                        <td>{item.tgl_mutasifisik === null ? '-' : moment(item.tgl_mutasifisik).format('DD/MM/YYYY')}</td>
                                        <td>{item.tgl_mutasisap === null ? '-' : moment(item.tgl_mutasisap).format('DD/MM/YYYY')}</td>
                                        <td>.....</td>
                                        <td>{item.status_form === 1 ? 'Masih Dikeranjang' : item.status_form === 2 ? 'Proses Approve Pengajuan' : item.status_form === 3 ? 'Proses Budget' : item.status_form === 5 ? 'Proses Final' : item.status_form === 9 ? 'Proses Ekseskusi' : item.status_form === 8 ? 'Finish' : '-'}</td>
                                        <td>{item.depo.nama_pic_1}</td>
                                        <td>{item.doc_sap}</td>
                                    </tr>
                                )})}
                            </tbody>
                        </table>
                        {newMut.length === 0 && (
                            <div className={style.spinCol}>
                                <AiOutlineInbox size={50} className='secondary mb-4' />
                                <div className='textInfo'>Data ajuan tidak ditemukan</div>
                            </div>
                        )}
                    </div>
                </div>
                <Modal toggle={this.openModalAdd} isOpen={this.state.modalAdd}>
                    <ModalHeader toggle={this.openModalAdd}>Add Master User</ModalHeader>
                    <Formik
                    initialValues={{
                    username: "",
                    fullname: "",
                    password: "",
                    depo: "",
                    user_level: "", 
                    status: ""
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
                                User Level
                            </text>
                            <div className="col-md-9">
                            <Input 
                                type="select" 
                                name="select"
                                value={values.user_level}
                                onChange={handleChange("user_level")}
                                onBlur={handleBlur("user_level")}
                                >
                                    <option>-Pilih Level-</option>
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
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Depo
                            </text>
                            <div className="col-md-9">
                            <Input 
                                type="select"
                                name="select"
                                disabled={values.user_level === "5" ? false : true}
                                value={values.depo}
                                onChange={handleChange("depo")}
                                onBlur={handleBlur("depo")}
                                >
                                    <option>-Pilih Depo-</option>
                                    {dataDepo.length !== 0 && dataDepo.map(item => {
                                        return (
                                            <option value={item.kode_plant + '-' + item.nama_depo}>{item.kode_plant + '-' + item.nama_depo}</option>
                                        )
                                    })}
                                </Input>
                                {errors.depo ? (
                                    <text className={style.txtError}>{errors.depo}</text>
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
                <Modal toggle={this.openModalEdit} isOpen={this.state.modalEdit}>
                    <ModalHeader toggle={this.openModalEdit}>Edit Master User</ModalHeader>
                    <Formik
                    initialValues={{
                    username: detail.username,
                    depo: detail.kode_plant + "-" + detail.nama_depo,
                    user_level: detail.user_level, 
                    status: detail.status,
                    email: detail.email,
                    fullname: detail.fullname
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
                        {detail.user_level === '5' || detail.user_level === 5 ? (
                            <div className={style.addModalDepo}>
                                <text className="col-md-3">
                                    Depo
                                </text>
                                <div className="col-md-9">
                                <Input 
                                    type="select" 
                                    name="select"
                                    value={values.depo}
                                    onChange={handleChange("depo")}
                                    onBlur={handleBlur("depo")}
                                    >
                                        <option>-Pilih Depo-</option>
                                        {dataDepo.length !== 0 && dataDepo.map(item => {
                                            return (
                                                <option value={item.kode_plant + '-' + item.nama_depo}>{item.kode_plant + '-' + item.nama_depo}</option>
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
                                User Level
                            </text>
                            <div className="col-md-9">
                            <Input 
                                type="select" 
                                name="select"
                                value={values.user_level}
                                onChange={handleChange("user_level")}
                                onBlur={handleBlur("user_level")}
                                >
                                    <option>-Pilih Level-</option>
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
                        <hr/>
                        <div className={style.foot}>
                            <div></div>
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
                            <Button color="info" onClick={this.DownloadTemplate}>Download Template</Button>
                            <Button color="primary" disabled={this.state.fileUpload === "" ? true : false } onClick={this.uploadMaster}>Upload</Button>
                            <Button onClick={this.openModalUpload}>Cancel</Button>
                        </div>
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
                <Modal isOpen={this.props.report.isLoading ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className={style.cekUpdate}>
                                <Spinner />
                                <div sucUpdate>Waiting....</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
                <Modal isOpen={this.props.user.isUpload ? true: false} size="sm">
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
    user: state.user,
    depo: state.depo,
    disposal: state.disposal,
    report: state.report
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
    getDisposal: disposal.getDisposal,
    getReportDis: report.getReportDisposal,
    getReportMutasi: report.getReportMutasi
}

export default connect(mapStateToProps, mapDispatchToProps)(MasterUser)
	