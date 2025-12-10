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
import status_stock from '../../redux/actions/status_stock'
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

const status_stockSchema = Yup.object().shape({
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

class MasterStatusStock extends Component {
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
            listStatusStock: [],
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
        const { listStatusStock } = this.state
        const {dataStatusStock} = this.props.status_stock
        if (val === 'all') {
            const data = []
            for (let i = 0; i < dataStatusStock.length; i++) {
                data.push(dataStatusStock[i].id)
            }
            this.setState({listStatusStock: data})
        } else {
            listStatusStock.push(val)
            this.setState({listStatusStock: listStatusStock})
        }
    }

    chekRej = (val) => {
        const {listStatusStock} = this.state
        if (val === 'all') {
            const data = []
            this.setState({listStatusStock: data})
        } else {
            const data = []
            for (let i = 0; i < listStatusStock.length; i++) {
                if (listStatusStock[i] === val) {
                    data.push()
                } else {
                    data.push(listStatusStock[i])
                }
            }
            this.setState({listStatusStock: data})
        }
    }

    downloadTemplate = () => {
        const {listStatusStock} = this.state
        const {dataStatusStock} = this.props.status_stock
        const dataDownload = []

        const workbook = new ExcelJS.Workbook();
        const ws = workbook.addWorksheet('data status_stock')

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
            {header: 'Status StatusStock', key: 'c7'},
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
              `Template Master StatusStock.xlsx`
            );
          });
    }

    downloadData = () => {
        const {listStatusStock} = this.state
        const {dataStatusStock} = this.props.status_stock
        const dataDownload = []
        for (let i = 0; i < listStatusStock.length; i++) {
            for (let j = 0; j < dataStatusStock.length; j++) {
                if (dataStatusStock[j].id === listStatusStock[i]) {
                    dataDownload.push(dataStatusStock[j])
                }
            }
        }

        const workbook = new ExcelJS.Workbook();
        const ws = workbook.addWorksheet('data status_stock')

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
            {header: 'Place Asset', key: 'c4'},
            {header: 'Channel', key: 'c5'},
            {header: 'Distribution', key: 'c6'},
            {header: 'Status StatusStock', key: 'c7'},
            {header: 'Profit Center', key: 'c8'},
            {header: 'Cost Center', key: 'c9'},
            {header: 'Kode SAP 1', key: 'c10'},
            {header: 'Kode SAP 2', key: 'c11'},
            {header: 'Nama AOS', key: 'c12'},
            {header: 'Nama BM', key: 'c13'},
            {header: 'Nama OM', key: 'c14'},
            {header: 'Nama NOM', key: 'c15'},
            {header: 'PIC Asset', key: 'c16'},
            {header: 'SPV Asset', key: 'c17'},
            {header: 'Asman Asset', key: 'c18'},
            {header: 'Manager Asset', key: 'c19'},
            {header: 'PIC Budget', key: 'c20'},
            {header: 'PIC Finance', key: 'c21'},
            {header: 'PIC Tax', key: 'c22'},
            {header: 'PIC Purchasing', key: 'c23'},
            {header: 'Asman HO', key: 'c24'},
            {header: 'Manager HO', key: 'c5'}
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
                c12: item.nama_aos,
                c13: item.nama_bm,
                c14: item.nama_om,
                c15: item.nama_nom,
                c16: item.nama_pic_1,
                c17: item.nama_pic_2,
                c18: item.nama_pic_3,
                c19: item.nama_pic_4,
                c20: item.pic_budget,
                c21: item.pic_finance,
                c22: item.pic_tax,
                c23: item.pic_purchasing,
                c24: item.asman_ho,
                c25: item.manager_ho,
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
              `Master StatusStock ${moment().format('DD MMMM YYYY')}.xlsx`
            );
          });
    }

    next = async () => {
        const { page } = this.props.status_stock
        const token = localStorage.getItem('token')
        await this.props.nextPage(token, page.nextLink)
    }

    prev = async () => {
        const { page } = this.props.status_stock
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

    addStatusStock = async (values) => {
        const token = localStorage.getItem("token")
        await this.props.addStatusStock(token, values)
        const {isAdd} = this.props.status_stock
        if (isAdd) {
            this.setState({confirm: 'add'})
            this.openConfirm()
            this.openModalEdit()
            setTimeout(() => {
                this.getDataStatusStock()
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

    editStatusStock = async (values, id) => {
        const token = localStorage.getItem("token")
        await this.props.updateStatusStock(token, id, values)
        const {isUpdate} = this.props.status_stock
        if (isUpdate) {
            this.setState({confirm: 'edit'})
            this.openConfirm()
            this.getDataStatusStock()
            this.openModalEdit()
        }
    }

    componentDidUpdate() {
        const {isError, isUpload, isExport} = this.props.status_stock
        // if (isError) {
        //     this.props.resetError()
        //     this.showAlert()
        // } else if (isUpload) {
        //     setTimeout(() => {
        //         this.props.resetError()
        //         this.setState({modalUpload: false})
        //      }, 2000)
        //      setTimeout(() => {
        //         this.getDataStatusStock()
        //      }, 2100)
        // } else if (isUpload === false) {
        //     this.props.resetError()
        //     this.setState({confirm: 'failUpload'})
        //     this.openConfirm()
        // } else if (isExport) {
        //     this.props.resetError()
        //     this.DownloadMaster()
        // }
    }

    DownloadMaster = () => {
        const {link} = this.props.status_stock
        axios({
            url: `${link}`,
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "master status_stock.xlsx"); //or any other extension
            document.body.appendChild(link);
            link.click();
        });
    }

    componentDidMount() {
        this.getDataStatusStock()
    }

    onSearch = (e) => {
        this.setState({search: e.target.value})
        if(e.key === 'Enter'){
            this.getDataStatusStock({limit: 10, search: this.state.search})
        }
    }

    getDataStatusStock = async (value) => {
        const token = localStorage.getItem("token")
        const { page } = this.props.status_stock
        const search = value === undefined ? '' : this.state.search
        const limit = value === undefined ? this.state.limit : value.limit
        await this.props.getStatusStock(token, limit, search, page.currentPage)
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
        const {dropOpen, detail, upload, errMsg, listStatusStock, tipeModal} = this.state
        const {dataStatusStock, isGet, alertM, alertMsg, alertUpload, page } = this.props.status_stock
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
                        <h2 className={styleTrans.pageTitle}>Master Status Stock Opname</h2>
                        
                        <div className={styleTrans.searchContainer}>
                            <div>
                                <text>Show: </text>
                                <ButtonDropdown className={style.drop} isOpen={dropOpen} toggle={this.dropDown}>
                                <DropdownToggle caret color="light">
                                    {this.state.limit}
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem className={style.item} onClick={() => this.getDataStatusStock({limit: 10, search: ''})}>10</DropdownItem>
                                    <DropdownItem className={style.item} onClick={() => this.getDataStatusStock({limit: 20, search: ''})}>20</DropdownItem>
                                    <DropdownItem className={style.item} onClick={() => this.getDataStatusStock({limit: 50, search: ''})}>50</DropdownItem>
                                    <DropdownItem className={style.item} onClick={() => this.getDataStatusStock({limit: 'all', search: ''})}>All</DropdownItem>
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

                        <table className={`${styleTrans.table} ${dataStatusStock.length > 0 ? styleTrans.tableFull : ''}`}>
                            <thead>
                                <tr>
                                    <th>
                                        <input  
                                        className='mr-2'
                                        type='checkbox'
                                        checked={listStatusStock.length === 0 ? false : listStatusStock.length === dataStatusStock.length ? true : false}
                                        onChange={() => listStatusStock.length === dataStatusStock.length ? this.chekRej('all') : this.chekApp('all')}
                                        />
                                        {/* Select */}
                                    </th>
                                    <th>Opsi</th>
                                    <th>No</th>
                                    <th>Kondisi</th>
                                    <th>Status Fisik</th>
                                    <th>Status Asset</th>
                                    <th>Type Asset</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataStatusStock.length !== 0 && dataStatusStock.map((item, index) => {
                                    return (
                                        <tr>
                                             <td>
                                                <input 
                                                type='checkbox'
                                                checked={listStatusStock.find(element => element === item.id) !== undefined ? true : false}
                                                onChange={listStatusStock.find(element => element === item.id) === undefined ? () => this.chekApp(item.id) : () => this.chekRej(item.id)}
                                                />
                                            </td>
                                            <td>
                                                <Button onClick={() => this.prosesOpen(item)} color='success'>
                                                    Edit
                                                </Button>
                                            </td>
                                            <td>{(dataStatusStock.indexOf(item) + (((page.currentPage - 1) * page.limitPerPage) + 1))}</td>
                                            <td>{item.kondisi}</td>
                                            <td>{item.fisik}</td>
                                            <td>{item.status}</td>
                                            <td>{item.isSap === 'true' ? 'SAP' : 'Asset Tambahan'}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        {dataStatusStock.length === 0 && (
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
                    <ModalHeader toggle={this.openModalEdit}>{tipeModal === 'add' ? 'Add' : 'Edit'} Data StatusStock</ModalHeader>
                    <Formik
                    initialValues={{
                        kode_plant: tipeModal === 'add' ? '' : detail.kode_plant === null ? '' : detail.kode_plant,
                        nama_area: tipeModal === 'add' ? '' : detail.nama_area === null ? '' : detail.nama_area,
                        place_asset: tipeModal === 'add' ? '' : detail.place_asset === null ? '' : detail.place_asset,
                        channel: tipeModal === 'add' ? '' : detail.channel === null ? '' : detail.channel,
                    }}
                    validationSchema={status_stockSchema}
                    onSubmit={(values) => {tipeModal === 'add' ? this.addStatusStock(values) : this.editStatusStock(values, detail.id)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                        <div className={style.bodyStatusStock}>
                            <ModalBody className={style.addStatusStock}>
                                <div className="col-md-6">
                                    <div className={style.addModalStatusStock}>
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
                                    <div className={style.addModalStatusStock}>
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
                                    <div className={style.addModalStatusStock}>
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
                                    <div className={style.addModalStatusStock}>
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
                    <ModalHeader>Upload Master StatusStock</ModalHeader>
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
                            <div className={style.sucUpdate}>Berhasil Memperbarui StatusStock</div>
                        </div>
                        ) : this.state.confirm === 'add' ? (
                            <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Menambahkan StatusStock</div>
                            </div>
                        ) : this.state.confirm === 'upload' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Mengupload Master StatusStock</div>
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
                <Modal isOpen={this.props.status_stock.isLoading ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className={style.cekUpdate}>
                                <Spinner />
                                <div sucUpdate>Waiting....</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
                <Modal isOpen={this.props.status_stock.isUpload ? true: false} size="sm">
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
    status_stock: state.status_stock
})

const mapDispatchToProps = {
    logout: auth.logout,
    addStatusStock: status_stock.addStatusStock,
    updateStatusStock: status_stock.updateStatusStock,
    getStatusStock: status_stock.getStatusStock,
    resetError: status_stock.resetError,
    uploadMaster: status_stock.uploadMaster,
    nextPage: status_stock.nextPage,
    exportMaster: status_stock.exportMaster
}

export default connect(mapStateToProps, mapDispatchToProps)(MasterStatusStock)
