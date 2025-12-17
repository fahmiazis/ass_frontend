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
    fisik: Yup.string().required('must be filled'),
    kondisi: Yup.string().required('must be filled'),
    status: Yup.string().required('must be filled'),
    isSap: Yup.string().required('must be filled')
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
            tipeModal: 'add',
            openDelete: false
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

    prosesOpenDelete = (val) => {
        this.setState({detail: val})
        this.openModalDelete()
    } 

    openModalDelete = () => {
        this.setState({openDelete: !this.state.openDelete})
    }

    prosesDelete = async () => {
        const token = localStorage.getItem("token")
        const {detail} = this.state
        await this.props.deleteStatusStock(token, detail.id)
        this.setState({confirm: 'delete'})
        this.openConfirm()
        this.openModalDelete()
        setTimeout(() => {
            this.getDataStatusStock()
        }, 500)
    }

    addStatusStock = async (values) => {
        const token = localStorage.getItem("token")
        const data = {
            ...values,
            kondisi: values.kondisi === '-' ? '' : values.kondisi
        }
        await this.props.addStatusStock(token, data)
        this.setState({confirm: 'add'})
        this.openConfirm()
        this.openModalEdit()
        setTimeout(() => {
            this.getDataStatusStock()
        }, 500)
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
        const data = {
            ...values,
            kondisi: values.kondisi === '-' ? '' : values.kondisi
        }
        await this.props.updateStatusStock(token, id, data)
        this.setState({confirm: 'edit'})
        this.openConfirm()
        this.getDataStatusStock()
        this.openModalEdit()
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
                            {/* <div>
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
                            </div> */}
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
                                    <th>No</th>
                                    <th>Status Fisik</th>
                                    <th>Kondisi</th>
                                    <th>Status Asset</th>
                                    <th>Type Asset</th>
                                    <th>Opsi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataStatusStock.length !== 0 && dataStatusStock.map((item, index) => {
                                    return (
                                        <tr>
                                            <td>{index + 1}</td>
                                            <td>{item.fisik}</td>
                                            <td>{item.kondisi === '' || !item.kondisi ? '-' : item.kondisi}</td>
                                            <td>{item.status}</td>
                                            <td>{item.isSap === 'true' ? 'SAP' : 'Asset Tambahan'}</td>
                                            <td>
                                                <Button className='ml-1 mt-1' onClick={() => this.prosesOpen(item)} color='success'>
                                                    Edit
                                                </Button>
                                                <Button className='ml-1 mt-1' onClick={() => this.prosesOpenDelete(item)} color='danger'>
                                                    Delete
                                                </Button>
                                            </td>
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
                                <text>Showing 1 of 1 pages</text>
                                <div className={style.pageButton}>
                                    <button 
                                        className={style.btnPrev} 
                                        color="info" 
                                        disabled
                                        // disabled={page.prevLink === null ? true : false}
                                        onClick={this.prev}
                                    >
                                        Prev
                                    </button>
                                    <button 
                                    className={style.btnPrev} 
                                    disabled
                                    color="info" 
                                    // disabled={page.nextLink === null ? true : false} 
                                    onClick={this.next}>
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal toggle={this.openModalEdit} isOpen={this.state.modalEdit} size="lg">
                    <ModalHeader toggle={this.openModalEdit}>{tipeModal === 'add' ? 'Add' : 'Edit'} Data Status Stock</ModalHeader>
                    <Formik
                    initialValues={{
                        fisik: tipeModal === 'add' ? '' : detail.fisik === null ? '' : detail.fisik,
                        kondisi: tipeModal === 'add' ? '' : detail.kondisi === null ? '-' : detail.kondisi,
                        status: tipeModal === 'add' ? '' : detail.status === null ? '' : detail.status,
                        isSap: tipeModal === 'add' ? '' : detail.isSap === null ? '' : detail.isSap,
                    }}
                    validationSchema={status_stockSchema}
                    onSubmit={(values) => {tipeModal === 'add' ? this.addStatusStock(values) : this.editStatusStock(values, detail.id)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                        <>
                            <ModalBody>
                                <div className={style.addModalDepo}>
                                    <text className="col-md-4">
                                        Status Fisik
                                    </text>
                                    <div className="col-md-8">
                                        <Input 
                                        type="select" 
                                        name="fisik"
                                        value={values.fisik}
                                        onChange={handleChange("fisik")}
                                        onBlur={handleBlur("fisik")}
                                        >
                                            <option>-Pilih-</option>
                                            <option value="ada">Ada</option>
                                            <option value="tidak ada">Tidak Ada</option>
                                        </Input>
                                        {errors.fisik ? (
                                            <text className={style.txtError}>{errors.fisik}</text>
                                        ) : null}
                                    </div>
                                </div>
                                <div className={style.addModalDepo}>
                                    <text className="col-md-4">
                                        Kondisi
                                    </text>
                                    <div className="col-md-8">
                                        <Input 
                                        type="select" 
                                        name="kondisi"
                                        value={values.kondisi}
                                        onChange={handleChange("kondisi")}
                                        onBlur={handleBlur("kondisi")}
                                        >
                                            <option>-Pilih-</option>
                                            <option value="baik">Baik</option>
                                            <option value="rusak">Rusak</option>
                                            <option value='-'>-</option>
                                        </Input>
                                        {errors.kondisi ? (
                                            <text className={style.txtError}>{errors.kondisi}</text>
                                        ) : null}
                                    </div>
                                </div>
                                <div className={style.addModalDepo}>
                                    <text className="col-md-4">
                                        Status Asset
                                    </text>
                                    <div className="col-md-8">
                                        <Input 
                                            type="name" 
                                            name="status"
                                            value={values.status}
                                            onBlur={handleBlur("status")}
                                            onChange={handleChange("status")}
                                        />
                                        {errors.status ? (
                                            <text className={style.txtError}>{errors.status}</text>
                                        ) : null}
                                    </div>
                                </div>
                                
                                <div className={style.addModalDepo}>
                                    <text className="col-md-4">
                                        Type Asset
                                    </text>
                                    <div className="col-md-8">
                                        <Input 
                                        type="select" 
                                        name="select"
                                        value={values.isSap}
                                        onChange={handleChange("isSap")}
                                        onBlur={handleBlur("isSap")}
                                        >
                                            <option>-Pilih-</option>
                                            <option value="true">SAP</option>
                                            <option value="false">Asset Tambahan</option>
                                        </Input>
                                        {errors.isSap ? (
                                            <text className={style.txtError}>{errors.isSap}</text>
                                        ) : null}
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
                        </>
                    )}
                    </Formik>
                </Modal>
                <Modal isOpen={this.state.openDelete} size="md" toggle={this.openModalDelete} centered={true}>
                    <ModalBody>
                        <div className={style.modalApprove}>
                            <div>
                                <text>
                                    Anda yakin untuk delete status stock ?
                                </text>
                            </div>
                            <div className={style.btnApproveIo}>
                                <Button color="primary" className='mr-2' onClick={this.prosesDelete}>Ya</Button>
                                <Button color="secondary" onClick={this.openModalDelete}>Tidak</Button>
                            </div>
                        </div>
                    </ModalBody>
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
                            <div className={style.sucUpdate}>Berhasil Memperbarui Status Stock</div>
                        </div>
                        ) : this.state.confirm === 'add' ? (
                            <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Menambahkan Status Stock</div>
                            </div>
                        ) : this.state.confirm === 'upload' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Mengupload Master Status Stock</div>
                            </div>
                            </div>
                        ) : this.state.confirm === 'delete' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Delete Status Stock</div>
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
    deleteStatusStock: status_stock.deleteStatusStock,
    resetError: status_stock.resetError,
    uploadMaster: status_stock.uploadMaster,
    nextPage: status_stock.nextPage,
    exportMaster: status_stock.exportMaster
}

export default connect(mapStateToProps, mapDispatchToProps)(MasterStatusStock)
