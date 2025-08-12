/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { Component } from 'react'
import { Container, Collapse, Nav, Navbar,
    NavbarToggler, NavbarBrand, NavItem, NavLink,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, Dropdown,
    DropdownItem, Table, ButtonDropdown, Input, Button,
    Modal, ModalHeader, ModalBody, ModalFooter, Alert, Spinner} from 'reactstrap'
import logo from "../../assets/img/logo.png"
import style from '../../assets/css/input.module.css'
import {FaSearch, FaUserCircle, FaBars} from 'react-icons/fa'
import {AiOutlineFileExcel, AiFillCheckCircle, AiOutlineInbox, AiOutlineClose} from 'react-icons/ai'
import {Formik} from 'formik'
import * as Yup from 'yup'
import depo from '../../redux/actions/depo'
import {connect} from 'react-redux'
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

const depoSchema = Yup.object().shape({
    kode_plant: Yup.string().required('must be filled'),
    nama_area: Yup.string().required('must be filled'),
    place_asset: Yup.string().required('must be filled'),
    channel: Yup.string().required('must be filled'),
    distribution: Yup.string().required('must be filled'),
    status_area: Yup.string().required('must be filled'),
    profit_center: Yup.string().required('must be filled'),
    cost_center: Yup.string().required('must be filled'),
    kode_sap_1: Yup.string().required('must be filled'),
    kode_sap_2: Yup.string(),
    nama_nom: Yup.string().required('must be filled'),
    nama_om: Yup.string().required('must be filled'),
    nama_bm: Yup.string().required('must be filled'),
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
            search: '',
            listDepo: [],
            tipeModal: 'add'
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

    chekApp = (val) => {
        const { listDepo } = this.state
        const {dataDepo} = this.props.depo
        if (val === 'all') {
            const data = []
            for (let i = 0; i < dataDepo.length; i++) {
                data.push(dataDepo[i].id)
            }
            this.setState({listDepo: data})
        } else {
            listDepo.push(val)
            this.setState({listDepo: listDepo})
        }
    }

    chekRej = (val) => {
        const {listDepo} = this.state
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

    downloadTemplate = () => {
        const {listDepo} = this.state
        const {dataDepo} = this.props.depo
        const dataDownload = []

        const workbook = new ExcelJS.Workbook();
        const ws = workbook.addWorksheet('data depo')

        // await ws.protect('F1n4NcePm4')

        const borderStyles = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
        }
        

        ws.columns = [
            {header: 'Kode Area', key: 'c2'},
            {header: 'Home Town', key: 'c3'},
            {header: 'Place Aset', key: 'c4'},
            {header: 'Channel', key: 'c5'},
            {header: 'Distribution', key: 'c6'},
            {header: 'Status Depo', key: 'c7'},
            {header: 'Profit Center', key: 'c8'},
            {header: 'Cost Center', key: 'c9'},
            {header: 'Kode SAP 1', key: 'c10'},
            {header: 'Kode SAP 2', key: 'c11'},
            {header: 'Nama NOM', key: 'c12'},
            {header: 'Nama OM', key: 'c13'},
            {header: 'Nama BM', key: 'c14'},
            {header: 'Nama AOS', key: 'c15'},
            {header: 'Nama PIC 1', key: 'c16'},
            {header: 'Nama PIC 2', key: 'c17'},
            {header: 'Nama PIC 3', key: 'c18'},
            {header: 'Nama PIC 4', key: 'c19'},
            {header: 'Nama Assistant Manager', key: 'c20'},
            {header: 'PIC Budget', key: 'c21'},
            {header: 'PIC Finance', key: 'c22'},
            {header: 'PIC Tax', key: 'c23'},
            {header: 'PIC Purchasing', key: 'c24'}
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
              `Template Master Depo.xlsx`
            );
          });
    }

    downloadData = () => {
        const {listDepo} = this.state
        const {dataDepo} = this.props.depo
        const dataDownload = []
        for (let i = 0; i < listDepo.length; i++) {
            for (let j = 0; j < dataDepo.length; j++) {
                if (dataDepo[j].id === listDepo[i]) {
                    dataDownload.push(dataDepo[j])
                }
            }
        }

        const workbook = new ExcelJS.Workbook();
        const ws = workbook.addWorksheet('data depo')

        // await ws.protect('F1n4NcePm4')

        const borderStyles = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
        }
        

        ws.columns = [
            {header: 'Kode Area', key: 'c2'},
            {header: 'Home Town', key: 'c3'},
            {header: 'Place Aset', key: 'c4'},
            {header: 'Channel', key: 'c5'},
            {header: 'Distribution', key: 'c6'},
            {header: 'Status Depo', key: 'c7'},
            {header: 'Profit Center', key: 'c8'},
            {header: 'Cost Center', key: 'c9'},
            {header: 'Kode SAP 1', key: 'c10'},
            {header: 'Kode SAP 2', key: 'c11'},
            {header: 'Nama NOM', key: 'c12'},
            {header: 'Nama OM', key: 'c13'},
            {header: 'Nama BM', key: 'c14'},
            {header: 'Nama AOS', key: 'c15'},
            {header: 'Nama PIC 1', key: 'c16'},
            {header: 'Nama PIC 2', key: 'c17'},
            {header: 'Nama PIC 3', key: 'c18'},
            {header: 'Nama PIC 4', key: 'c19'},
            {header: 'Nama Assistant Manager', key: 'c20'},
            {header: 'PIC Budget', key: 'c21'},
            {header: 'PIC Finance', key: 'c22'},
            {header: 'PIC Tax', key: 'c23'},
            {header: 'PIC Purchasing', key: 'c24'}
        ]

        dataDownload.map((item, index) => { return ( ws.addRow(
            {
                c2: item.kode_plant,
                c3: item.nama_area,
                c4: item.place_asset,
                c5: item.channel,
                c6: item.distribution,
                c7: item.status_area,
                c8: item.profit_center,
                c9: item.cost_center,
                c10: item.kode_sap_1,
                c11: item.kode_sap_2,
                c12: item.nama_nom,
                c13: item.nama_om,
                c14: item.nama_bm,
                c15: item.nama_aos,
                c16: item.nama_pic_1,
                c17: item.nama_pic_2,
                c18: item.nama_pic_3,
                c19: item.nama_pic_4,
                c20: item.nama_asman,
                c21: item.pic_budget,
                c22: item.pic_finance,
                c23: item.pic_tax,
                c24: item.pic_purchasing
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
              `Master Depo ${moment().format('DD MMMM YYYY')}.xlsx`
            );
          });
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

    prosesOpen = (val) => {
        if (val === 'add') {
            this.setState({tipeModal: val})
            this.openModalEdit()
        } else {
            this.setState({tipeModal: 'edit', detail: val})
            this.openModalEdit()
        }
    }

    addDepo = async (values) => {
        const token = localStorage.getItem("token")
        await this.props.addDepo(token, values)
        const {isAdd} = this.props.depo
        if (isAdd) {
            this.setState({confirm: 'add'})
            this.openConfirm()
            this.openModalEdit()
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
        } else if (isUpload === false) {
            this.props.resetError()
            this.setState({confirm: 'failUpload'})
            this.openConfirm()
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
        const {dropOpen, detail, upload, errMsg, listDepo, tipeModal} = this.state
        const {dataDepo, isGet, alertM, alertMsg, alertUpload, page } = this.props.depo
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
                    <Navbar />
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
                        <h2 className={styleTrans.pageTitle}>Master Depo</h2>
                        
                        <div className={styleTrans.searchContainer}>
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
                                    <DropdownItem className={style.item} onClick={() => this.getDataDepo({limit: 100, search: ''})}>100</DropdownItem>
                                    <DropdownItem className={style.item} onClick={() => this.getDataDepo({limit: 200, search: ''})}>200</DropdownItem>
                                    <DropdownItem className={style.item} onClick={() => this.getDataDepo({limit: 500, search: ''})}>500</DropdownItem>
                                    <DropdownItem className={style.item} onClick={() => this.getDataDepo({limit: 1000, search: ''})}>1000</DropdownItem>
                                    <DropdownItem className={style.item} onClick={() => this.getDataDepo({limit: 'all', search: ''})}>All</DropdownItem>
                                </DropdownMenu>
                                </ButtonDropdown>
                                <text className={style.textEntries}>entries</text>
                            </div>
                        </div>
                        <div className={styleTrans.searchContainer}>
                            <div className='rowCenter'>
                                <Button onClick={() => this.prosesOpen('add')} color="primary" size="lg" className='mr-1'>Add</Button>
                                <Button onClick={this.openModalUpload} color="warning" size="lg" className='mr-1'>Upload</Button>
                                <Button color="success" size="lg" onClick={this.downloadData}>Download</Button>
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

                        <table className={`${styleTrans.table} ${dataDepo.length > 0 ? styleTrans.tableFull : ''}`}>
                            <thead>
                                <tr>
                                    <th>
                                        <input  
                                        className='mr-2'
                                        type='checkbox'
                                        checked={listDepo.length === 0 ? false : listDepo.length === dataDepo.length ? true : false}
                                        onChange={() => listDepo.length === dataDepo.length ? this.chekRej('all') : this.chekApp('all')}
                                        />
                                        {/* Select */}
                                    </th>
                                    <th>Opsi</th>
                                    <th>No</th>
                                    <th>Kode Area</th>
                                    <th>Home Town</th>
                                    <th>Place Asset</th>
                                    <th>Channel</th>
                                    <th>Distribution</th>
                                    <th>Status Depo</th>
                                    <th>Profit Center</th>
                                    <th>Cost Center</th>
                                    <th>Kode SAP 1</th>
                                    <th>Kode SAP 2</th>
                                    <th>Nama AOS</th>
                                    <th>Nama BM</th>
                                    <th>Nama OM</th>
                                    <th>Nama NOM</th>
                                    <th>PIC Asset</th>
                                    <th>SPV Asset</th>
                                    <th>Asman Asset</th>
                                    <th>Manager Asset</th>
                                    <th>PIC Budget</th>
                                    <th>PIC Finance</th>
                                    <th>PIC Tax</th>
                                    <th>PIC Purchasing</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataDepo.length !== 0 && dataDepo.map((item, index) => {
                                    return (
                                        <tr>
                                             <td>
                                                <input 
                                                type='checkbox'
                                                checked={listDepo.find(element => element === item.id) !== undefined ? true : false}
                                                onChange={listDepo.find(element => element === item.id) === undefined ? () => this.chekApp(item.id) : () => this.chekRej(item.id)}
                                                />
                                            </td>
                                            <td>
                                                <Button onClick={() => this.prosesOpen(item)} color='success'>
                                                    Edit
                                                </Button>
                                            </td>
                                            <td scope="row">{(dataDepo.indexOf(item) + (((page.currentPage - 1) * page.limitPerPage) + 1))}</td>
                                            <td>{item.kode_plant}</td>
                                            <td>{item.nama_area}</td>
                                            <td>{item.place_asset}</td>
                                            <td>{item.channel}</td>
                                            <td>{item.distribution}</td>
                                            <td>{item.status_area}</td>
                                            <td>{item.profit_center}</td>
                                            <td>{item.cost_center}</td>
                                            <td>{item.kode_sap_1}</td>
                                            <td>{item.kode_sap_2}</td>
                                            <td>{item.nama_aos}</td>
                                            <td>{item.nama_bm}</td>
                                            <td>{item.nama_om}</td>
                                            <td>{item.nama_nom}</td>
                                            <td>{item.nama_pic_1}</td>
                                            <td>{item.nama_pic_2}</td>
                                            <td>{item.nama_pic_3 === null ? item.nama_asman : item.nama_pic_3}</td>
                                            <td>{item.nama_pic_4}</td>
                                            <td>{item.pic_budget}</td>
                                            <td>{item.pic_finance}</td>
                                            <td>{item.pic_tax}</td>
                                            <td>{item.pic_purchasing}</td>
                                            
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        {dataDepo.length === 0 && (
                            <div className={style.spinCol}>
                                <AiOutlineInbox size={50} className='mb-4' />
                                <div className='textInfo'>Data area tidak ditemukan</div>
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
                <Modal toggle={this.openModalEdit} isOpen={this.state.modalEdit} size="xl">
                    <ModalHeader toggle={this.openModalEdit}>{tipeModal === 'add' ? 'Add' : 'Edit'} Data Depo</ModalHeader>
                    <Formik
                    initialValues={{
                        kode_plant: tipeModal === 'add' ? '' : detail.kode_plant === null ? '' : detail.kode_plant,
                        nama_area: tipeModal === 'add' ? '' : detail.nama_area === null ? '' : detail.nama_area,
                        place_asset: tipeModal === 'add' ? '' : detail.place_asset === null ? '' : detail.place_asset,
                        channel: tipeModal === 'add' ? '' : detail.channel === null ? '' : detail.channel,
                        distribution: tipeModal === 'add' ? '' : detail.distribution === null ? '' : detail.distribution,
                        status_area: tipeModal === 'add' ? '' : detail.status_area === null ? '' : detail.status_area,
                        profit_center: tipeModal === 'add' ? '' : detail.profit_center === null ? '' : detail.profit_center,
                        cost_center: tipeModal === 'add' ? '' : detail.cost_center === null ? '' : detail.cost_center,
                        kode_sap_1: tipeModal === 'add' ? '' : detail.kode_sap_1 === null ? '' : detail.kode_sap_1,
                        kode_sap_2: tipeModal === 'add' ? '' : detail.kode_sap_2 === null ? '' : detail.kode_sap_2,
                        nama_nom: tipeModal === 'add' ? '' : detail.nama_nom === null ? '' : detail.nama_nom,
                        nama_om: tipeModal === 'add' ? '' : detail.nama_om === null ? '' : detail.nama_om,
                        nama_bm: tipeModal === 'add' ? '' : detail.nama_bm === null ? '' : detail.nama_bm,
                        nama_aos: tipeModal === 'add' ? '' : detail.nama_aos === null ? '' : detail.nama_aos,
                        nama_pic_1: tipeModal === 'add' ? '' : detail.nama_pic_1 === null ? '' : detail.nama_pic_1,
                        nama_pic_2: tipeModal === 'add' ? '' : detail.nama_pic_2 === null ? '' : detail.nama_pic_2,
                        nama_pic_3: tipeModal === 'add' ? '' : detail.nama_pic_3 === null ? (detail.nama_asman === null ? '' : detail.nama_asman) : detail.nama_pic_3,
                        nama_pic_4: tipeModal === 'add' ? '' : detail.nama_pic_4 === null ? '' : detail.nama_pic_4,
                        pic_budget: tipeModal === 'add' ? '' : detail.pic_budget === null ? '' : detail.pic_budget,
                        pic_finance: tipeModal === 'add' ? '' : detail.pic_finance === null ? '' : detail.pic_finance,
                        pic_tax: tipeModal === 'add' ? '' : detail.pic_tax === null ? '' : detail.pic_tax,
                        pic_purchasing: tipeModal === 'add' ? '' : detail.pic_purchasing === null ? '' : detail.pic_purchasing
                    }}
                    validationSchema={depoSchema}
                    onSubmit={(values) => {tipeModal === 'add' ? this.addDepo(values) : this.editDepo(values, detail.id)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                        <div className={style.bodyDepo}>
                            <ModalBody className={style.addDepo}>
                                <div className="col-md-6">
                                    <div className={style.addModalDepo}>
                                        <text className="col-md-4">
                                            Kode Area
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
                                            Home Town
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
                                            Place Asset
                                        </text>
                                        <div className="col-md-8">
                                        <Input 
                                        type="name" 
                                        name="place_asset"
                                        value={values.place_asset}
                                        onBlur={handleChange("place_asset")}
                                        onChange={handleBlur("place_asset")}
                                        />
                                        {errors.place_asset ? (
                                            <text className={style.txtError}>{errors.place_asset}</text>
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
                                            Nama BM
                                        </text>
                                        <div className="col-md-8">
                                        <Input 
                                        type="name" 
                                        name="nama_bm"
                                        value={values.nama_bm}
                                        onBlur={handleBlur("nama_bm")}
                                        onChange={handleChange("nama_bm")}
                                        />
                                            {errors.nama_bm ? (
                                                <text className={style.txtError}>{errors.nama_bm}</text>
                                            ) : null}
                                        </div>    
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className={style.addModalDepo}>
                                        <text className="col-md-4">
                                            Nama OM
                                        </text>
                                        <div className="col-md-8">
                                        <Input 
                                        type="name" 
                                        name="nama_om"
                                        value={values.nama_om}
                                        onBlur={handleBlur("nama_om")}
                                        onChange={handleChange("nama_om")}
                                        />
                                            {errors.nama_om ? (
                                                <text className={style.txtError}>{errors.nama_om}</text>
                                            ) : null}
                                        </div>    
                                    </div>
                                    <div className={style.addModalDepo}>
                                        <text className="col-md-4">
                                            Nama NOM
                                        </text>
                                        <div className="col-md-8">
                                        <Input 
                                        type="name" 
                                        name="nama_spv"
                                        value={values.nama_nom}
                                        onBlur={handleBlur("nama_nom")}
                                        onChange={handleChange("nama_nom")}
                                        />
                                        {errors.nama_nom ? (
                                                <text className={style.txtError}>{errors.nama_nom}</text>
                                            ) : null}
                                        </div>    
                                    </div>
                                    <div className={style.addModalDepo}>
                                        <text className="col-md-4">
                                            PIC Asset
                                        </text>
                                        <div className="col-md-8">
                                        <Input 
                                        type="name" 
                                        name="nama_pic_1"
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
                                            SPV Asset
                                        </text>
                                        <div className="col-md-8">
                                        <Input 
                                        type="name" 
                                        name="nama_pic_2"
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
                                            Asman Asset
                                        </text>
                                        <div className="col-md-8">
                                        <Input 
                                        type="name" 
                                        name="nama_pic_3"
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
                                            Manager Asset
                                        </text>
                                        <div className="col-md-8">
                                        <Input 
                                        type="name" 
                                        name="nama_pic_4"
                                        value={values.nama_pic_4}
                                        onBlur={handleBlur("nama_pic_4")}
                                        onChange={handleChange("nama_pic_4")}
                                        />
                                            {errors.nama_pic_4 ? (
                                                <text className={style.txtError}>{errors.nama_pic_4}</text>
                                            ) : null}
                                        </div>    
                                    </div>
                                    <div className={style.addModalDepo}>
                                        <text className="col-md-4">
                                            PIC Budget
                                        </text>
                                        <div className="col-md-8">
                                        <Input 
                                        type="name" 
                                        name="pic_budget"
                                        value={values.pic_budget}
                                        onBlur={handleBlur("pic_budget")}
                                        onChange={handleChange("pic_budget")}
                                        />
                                            {errors.pic_budget ? (
                                                <text className={style.txtError}>{errors.pic_budget}</text>
                                            ) : null}
                                        </div>    
                                    </div>
                                    <div className={style.addModalDepo}>
                                        <text className="col-md-4">
                                            PIC Finance
                                        </text>
                                        <div className="col-md-8">
                                        <Input 
                                        type="name" 
                                        name="pic_finance"
                                        value={values.pic_finance}
                                        onBlur={handleBlur("pic_finance")}
                                        onChange={handleChange("pic_finance")}
                                        />
                                            {errors.pic_finance ? (
                                                <text className={style.txtError}>{errors.pic_finance}</text>
                                            ) : null}
                                        </div>    
                                    </div>
                                    <div className={style.addModalDepo}>
                                        <text className="col-md-4">
                                            PIC Tax
                                        </text>
                                        <div className="col-md-8">
                                        <Input 
                                        type="name" 
                                        name="pic_tax"
                                        value={values.pic_tax}
                                        onBlur={handleBlur("pic_tax")}
                                        onChange={handleChange("pic_tax")}
                                        />
                                            {errors.pic_tax ? (
                                                <text className={style.txtError}>{errors.pic_tax}</text>
                                            ) : null}
                                        </div>    
                                    </div>
                                    <div className={style.addModalDepo}>
                                        <text className="col-md-4">
                                            PIC Purchasing
                                        </text>
                                        <div className="col-md-8">
                                        <Input 
                                        type="name" 
                                        name="pic_purchasing"
                                        value={values.pic_purchasing}
                                        onBlur={handleBlur("pic_purchasing")}
                                        onChange={handleChange("pic_purchasing")}
                                        />
                                            {errors.pic_purchasing ? (
                                                <text className={style.txtError}>{errors.pic_purchasing}</text>
                                            ) : null}
                                        </div>    
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <div></div>
                                <div>
                                    <Button className="mr-2" onClick={handleSubmit} color="primary">Save</Button>
                                    <Button className="mr-5" onClick={this.openModalEdit}>Cancel</Button>
                                </div>
                            </ModalFooter>
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
