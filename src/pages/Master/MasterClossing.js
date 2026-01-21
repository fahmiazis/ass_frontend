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
import clossing from '../../redux/actions/clossing'
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

const clossingSchema = Yup.object().shape({
    type_clossing: Yup.string().required('must be filled'),
    periode: Yup.string(),
    start: Yup.string().required('must be filled'),
    end: Yup.string().required('must be filled')
});

class MasterClossing extends Component {
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
            selectMonth: moment().month() + 1,
            selectYear: moment().year(),
            listClossing: [],
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
        const { listClossing } = this.state
        const {dataClossing} = this.props.clossing
        if (val === 'all') {
            const data = []
            for (let i = 0; i < dataClossing.length; i++) {
                data.push(dataClossing[i].id)
            }
            this.setState({listClossing: data})
        } else {
            listClossing.push(val)
            this.setState({listClossing: listClossing})
        }
    }

    chekRej = (val) => {
        const {listClossing} = this.state
        if (val === 'all') {
            const data = []
            this.setState({listClossing: data})
        } else {
            const data = []
            for (let i = 0; i < listClossing.length; i++) {
                if (listClossing[i] === val) {
                    data.push()
                } else {
                    data.push(listClossing[i])
                }
            }
            this.setState({listClossing: data})
        }
    }

    downloadTemplate = () => {
        const {listClossing} = this.state
        const {dataClossing} = this.props.clossing
        const dataDownload = []

        const workbook = new ExcelJS.Workbook();
        const ws = workbook.addWorksheet('data clossing')

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
            {header: 'Status Clossing', key: 'c7'},
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
              `Template Master Clossing.xlsx`
            );
          });
    }

    downloadData = () => {
        const {listClossing} = this.state
        const {dataClossing} = this.props.clossing
        const dataDownload = []
        for (let i = 0; i < listClossing.length; i++) {
            for (let j = 0; j < dataClossing.length; j++) {
                if (dataClossing[j].id === listClossing[i]) {
                    dataDownload.push(dataClossing[j])
                }
            }
        }

        const workbook = new ExcelJS.Workbook();
        const ws = workbook.addWorksheet('data clossing')

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
            {header: 'Status Clossing', key: 'c7'},
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
                c7: item.type_clossing_area,
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
              `Master Clossing ${moment().format('DD MMMM YYYY')}.xlsx`
            );
          });
    }

    next = async () => {
        const { page } = this.props.clossing
        const token = localStorage.getItem('token')
        await this.props.nextPage(token, page.nextLink)
    }

    prev = async () => {
        const { page } = this.props.clossing
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
            this.setState({
                tipeModal: 'edit', 
                detail: val, 
                selectYear: moment(val.periode).year(), 
                selectMonth: moment(val.periode).month() + 1
            })
            console.log(moment(val.periode).month())
            console.log(moment(val.periode).year())
            setTimeout(() => {
                this.openModalEdit()
            }, 100)
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
        await this.props.deleteClossing(token, detail.id)
        this.setState({confirm: 'delete'})
        this.openConfirm()
        this.openModalDelete()
        setTimeout(() => {
            this.getDataClossing()
        }, 500)
    }

    handleMonth = (e) => {
        this.setState({ selectMonth: e.target.value });
    };

    handleYear = (e) => {
        this.setState({ selectYear: e.target.value });
    };

    addClossing = async (values) => {
        const token = localStorage.getItem("token")
        const { selectYear, selectMonth } = this.state
        const data = {
            ...values,
            periode: values.type_clossing === 'all' ? moment().format('YYYY-MM-DD') : `${selectYear}-${selectMonth}-${values.start}`,
            jenis: 'stock'
        }
        await this.props.addClossing(token, data)
        this.setState({confirm: 'add'})
        this.openConfirm()
        this.openModalEdit()
        setTimeout(() => {
            this.getDataClossing()
        }, 100)
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

    editClossing = async (values, id) => {
        const token = localStorage.getItem("token")
        const { selectYear, selectMonth } = this.state
        const data = {
            ...values,
            periode: values.type_clossing === 'all' ? moment().format('YYYY-MM-DD') : `${selectYear}-${selectMonth}-${values.start}`,
            jenis: 'stock'
        }
        await this.props.updateClossing(token, id, data)
        this.setState({confirm: 'edit'})
        this.openConfirm()
        this.getDataClossing()
        this.openModalEdit()
    }

    componentDidUpdate() {
        const {isError, isUpload, isExport} = this.props.clossing
        // if (isError) {
        //     this.props.resetError()
        //     this.showAlert()
        // } else if (isUpload) {
        //     setTimeout(() => {
        //         this.props.resetError()
        //         this.setState({modalUpload: false})
        //      }, 2000)
        //      setTimeout(() => {
        //         this.getDataClossing()
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
        const {link} = this.props.clossing
        axios({
            url: `${link}`,
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "master clossing.xlsx"); //or any other extension
            document.body.appendChild(link);
            link.click();
        });
    }

    componentDidMount() {
        this.getDataClossing()
    }

    onSearch = (e) => {
        this.setState({search: e.target.value})
        if(e.key === 'Enter'){
            this.getDataClossing({limit: 10, search: this.state.search})
        }
    }

    getDataClossing = async (value) => {
        const token = localStorage.getItem("token")
        const { page } = this.props.clossing
        const search = value === undefined ? '' : this.state.search
        const limit = value === undefined ? this.state.limit : value.limit
        await this.props.getClossing(token, limit, search, page.currentPage)
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
        const {dropOpen, detail, upload, errMsg, listClossing, tipeModal, selectMonth, selectYear} = this.state
        const {dataClossing, isGet, alertM, alertMsg, alertUpload, page } = this.props.clossing
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const months = moment.locale("id") && moment.months();
        const currentYear = moment().year(); 
        const days = Array.from({ length: 31 }, (_, i) => i + 1)
        const years = [];

        for (let year = 2000; year <= currentYear; year++) {
            years.push(year);
        }

        console.log(selectMonth)
        console.log(selectYear)

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
                        <h2 className={styleTrans.pageTitle}>Setting Closing Stock Opname</h2>
                        
                        <div className={styleTrans.searchContainer}>
                        </div>
                        <div className={styleTrans.searchContainer}>
                            <div className='rowCenter'>
                                <Button onClick={() => this.prosesOpen('add')} color="primary" size="lg" className='mr-1'>Add</Button>
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

                        <table className={`${styleTrans.table} ${dataClossing.length > 0 ? styleTrans.tableFull : ''}`}>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Type Clossing</th>
                                    <th>Periode</th>
                                    <th>Start Opname</th>
                                    <th>End Opname</th>
                                    <th>Opsi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataClossing.length !== 0 && dataClossing.map((item, index) => {
                                    return (
                                        <tr>
                                            <td>{index + 1}</td>
                                            <td>{item.type_clossing}</td>
                                            <td>{item.type_clossing === 'all' ? 'All periode' : moment(item.periode).format('MMMM YYYY')}</td>
                                            <td>{item.type_clossing === 'all' ? 'Tgl' : ''} {item.start} {item.type_clossing === 'all' ? 'Bulan Stock Opname' : moment(item.periode).format('MMMM YYYY')}</td>
                                            <td>{item.type_clossing === 'all' ? 'Tgl' : ''} {item.end} {item.type_clossing === 'all' ? 'H + 1 Bulan Stock Opname' : moment(item.periode).add(1, 'month').format('MMMM YYYY')}</td>
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
                        {dataClossing.length === 0 && (
                            <div className={style.spinCol}>
                                <AiOutlineInbox size={50} className='mb-4' />
                                <div className='textInfo'>Data clossing tidak ditemukan</div>
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
                    <ModalHeader toggle={this.openModalEdit}>{tipeModal === 'add' ? 'Add' : 'Edit'} Data Clossing</ModalHeader>
                    <Formik
                    initialValues={{
                        end: tipeModal === 'add' ? '' : detail.end === null ? '' : detail.end,
                        periode: tipeModal === 'add' ? '' : detail.periode === null ? '-' : detail.periode,
                        type_clossing: tipeModal === 'add' ? '' : detail.type_clossing === null ? '' : detail.type_clossing,
                        start: tipeModal === 'add' ? '' : detail.start === null ? '' : detail.start,
                    }}
                    validationSchema={clossingSchema}
                    onSubmit={(values) => {tipeModal === 'add' ? this.addClossing(values) : this.editClossing(values, detail.id)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                        <>
                            <ModalBody>
                                <div className={style.addModalDepo}>
                                    <text className="col-md-4">
                                        Jenis Transaksi
                                    </text>
                                    <div className="col-md-8">
                                        <Input 
                                        type="select" 
                                        value='stock'
                                        disabled
                                        >
                                            <option>-Pilih-</option>
                                            <option value="stock">Stock Opname</option>
                                            <option value="disposal">Disposal Aset</option>
                                            <option value="mutasi">Mutasi Aset</option>
                                            <option value="pengadaan">Pengadaan Aset</option>
                                        </Input>
                                    </div>
                                </div>
                                <div className={style.addModalDepo}>
                                    <text className="col-md-4">
                                        Type Clossing
                                    </text>
                                    <div className="col-md-8">
                                        <Input 
                                        type="select" 
                                        name="type_clossing"
                                        value={values.type_clossing}
                                        onChange={handleChange("type_clossing")}
                                        onBlur={handleBlur("type_clossing")}
                                        >
                                            <option>-Pilih-</option>
                                            <option value="all">All</option>
                                            <option value="periode">Periode</option>
                                        </Input>
                                        {errors.type_clossing ? (
                                            <text className={style.txtError}>{errors.type_clossing}</text>
                                        ) : null}
                                    </div>
                                </div>
                                {values.type_clossing === 'periode' && (
                                    <div className={style.addModalDepo}>
                                        <text className="col-md-4">
                                            Periode
                                        </text>
                                        <div className="col-md-8">
                                            {/* <Input 
                                            type="date" 
                                            name="periode"
                                            value={values.periode}
                                            onChange={handleChange("periode")}
                                            onBlur={handleBlur("periode")}
                                            /> */}
                                            <div className='rowCenter'>
                                                <Input
                                                    type="select"
                                                    name="month"
                                                    value={this.state.selectMonth}
                                                    onChange={this.handleMonth}
                                                >
                                                    <option value="">Pilih Bulan</option>
                                                    {months.map((month, index) => (
                                                        <option key={index} value={index + 1}>
                                                            {month}
                                                        </option>
                                                    ))}
                                                </Input>
                                                <Input
                                                    type="select"
                                                    className='ml-2'
                                                    name="month"
                                                    value={this.state.selectYear}
                                                    onChange={this.handleYear}
                                                >
                                                    <option value="">Pilih Tahun</option>
                                                    {years.map((item, index) => (
                                                        <option key={item} value={item}>
                                                            {item}
                                                        </option>
                                                    ))}
                                                </Input>
                                            </div>
                                            {errors.periode ? (
                                                <text className={style.txtError}>{errors.periode}</text>
                                            ) : null}
                                        </div>
                                    </div>
                                )}
                                
                                
                                <div className={style.addModalDepo}>
                                    <text className="col-md-4">
                                        Start Opname
                                    </text>
                                    <div className="col-md-8">
                                        <Input 
                                        type="select" 
                                        name="select"
                                        value={values.start}
                                        onChange={handleChange("start")}
                                        onBlur={handleBlur("start")}
                                        >
                                            <option>-Pilih-</option>
                                            {days.map(item => {
                                                return (
                                                    <option value={item}>{item}</option>
                                                )
                                            })}
                                            
                                        </Input>
                                        {errors.start ? (
                                            <text className={style.txtError}>{errors.start}</text>
                                        ) : null}
                                    </div>
                                </div>
                                <div className={style.addModalDepo}>
                                    <text className="col-md-4">
                                        End Opname
                                    </text>
                                    <div className="col-md-8">
                                        <Input 
                                        type="select" 
                                        name="end"
                                        value={values.end}
                                        onChange={handleChange("end")}
                                        onBlur={handleBlur("end")}
                                        >
                                            <option>-Pilih-</option>
                                            {days.map(item => {
                                                return (
                                                    <option value={item}>{item}</option>
                                                )
                                            })}
                                        </Input>
                                        {errors.end ? (
                                            <text className={style.txtError}>{errors.end}</text>
                                        ) : null}
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <div></div>
                                <div>
                                    <Button disabled={values.type_clossing === 'periode' && !selectMonth && !selectYear} className="mr-2" onClick={handleSubmit} color="primary">Save</Button>
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
                                    Anda yakin untuk delete clossing ?
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
                    <ModalHeader>Upload Master Clossing</ModalHeader>
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
                            <div className={style.sucUpdate}>Berhasil Memperbarui Clossing</div>
                        </div>
                        ) : this.state.confirm === 'add' ? (
                            <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Menambahkan Clossing</div>
                            </div>
                        ) : this.state.confirm === 'upload' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Mengupload Master Clossing</div>
                            </div>
                            </div>
                        ) : this.state.confirm === 'delete' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Delete Clossing</div>
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
                <Modal isOpen={this.props.clossing.isLoading ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className={style.cekUpdate}>
                                <Spinner />
                                <div sucUpdate>Waiting....</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
                <Modal isOpen={this.props.clossing.isUpload ? true: false} size="sm">
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
    clossing: state.clossing
})

const mapDispatchToProps = {
    logout: auth.logout,
    addClossing: clossing.addClossing,
    updateClossing: clossing.updateClossing,
    getClossing: clossing.getClossing,
    deleteClossing: clossing.deleteClossing,
    resetError: clossing.resetError,
    nextPage: clossing.nextPage,
}

export default connect(mapStateToProps, mapDispatchToProps)(MasterClossing)
