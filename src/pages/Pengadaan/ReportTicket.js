import React, { Component } from 'react'
import {  NavbarBrand, DropdownToggle, DropdownMenu,
    DropdownItem, Table, ButtonDropdown, Input, Button,
    Modal, ModalHeader, ModalBody, Alert, Spinner} from 'reactstrap'
import style from '../../assets/css/input.module.css'
import {FaSearch, FaUserCircle, FaBars} from 'react-icons/fa'
import {AiFillCheckCircle, AiOutlineFileExcel, AiOutlineInbox, AiOutlineClose} from 'react-icons/ai'
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
import Email from '../../components/Pengadaan/Email'
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

class ReportTicket extends Component {
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
            search: '',
            newIo: [],
            listIo: [],
            dataDownload: [],
            time: 'pilih',
            time1: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
            // time1: moment().startOf('month').format('YYYY-MM-DD'),
            time2: moment().endOf('month').format('YYYY-MM-DD'),
            filter: 'selesai'
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
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

    getDataReportIo = async (val) => {
        const limit = val === undefined || val.limit === undefined ? 10 : val.limit
        const token = localStorage.getItem("token")
        const search = this.props.location.state === undefined ? '' : this.props.location.state
        this.setState({limit: limit === null ? 'All' : limit})
        await this.props.getReportIo(token, limit, search, 1)
    }

    changeFilter = async (val) => {
        const role = localStorage.getItem('role')
        const level = localStorage.getItem('level')
        const { time1, time2, search, limit } = this.state
        const cekTime1 = time1 === '' ? 'undefined' : time1
        const cekTime2 = time2 === '' ? 'undefined' : time2
        const tipe = 'pengadaan'

        const status = val === 'selesai' ? '8' : 'all'
        const token = localStorage.getItem("token")
        await this.props.getReportIo(token, limit, search, 1, status, tipe, cekTime1, cekTime2)

        if (level === '2' || level === '8') {
            const {dataIo} = this.props.report
            const newIo = []
            console.log(val)
            for (let i = 0; i < dataIo.length; i++) {
                if (val === 'available') {
                    if (dataIo[i].status_reject !== 1) {
                        newIo.push(dataIo[i])
                    }
                } else if (val === 'reject') {
                    if (dataIo[i].status_reject === 1) {
                        newIo.push(dataIo[i])
                    }
                } else if (val === 'selesai') {
                    if (dataIo[i].status_form === '8') {
                        newIo.push(dataIo[i])
                    }
                } else {
                    const cek = level === '8' ? '3' : '1'
                    if (dataIo[i].status_form !== cek || (dataIo[i].status_form === cek && dataIo[i].status_reject === 1)) {
                        newIo.push(dataIo[i])
                    }
                }
            }
            this.setState({filter: val, newIo: newIo})
        } else {
            const {dataIo} = this.props.report
            if (val === 'available' && dataIo.length > 0) {
                console.log('at available')
                const newIo = []
                for (let i = 0; i < dataIo.length; i++) {
                    const app = dataIo[i].appForm ===  undefined ? [] : dataIo[i].appForm
                    const find = app.indexOf(app.find(({jabatan}) => jabatan === role))
                    if (level === '5' || level === '9') {
                        console.log('at available 2')
                        if (dataIo[i].status_reject !== 1 && dataIo[i].status_form === '2' && (app[find] === undefined || app.length === 0)) {
                            console.log('at available 3')
                            newIo.push(dataIo[i])
                        } else if (dataIo[i].status_reject !== 1 && dataIo[i].status_form === '2' && app[find].status === null ) {
                            console.log('at available 4')
                            newIo.push(dataIo[i])
                        }
                    } else if (find === 0 || find === '0') {
                        console.log('at available 8')
                        if (dataIo[i].status_reject !== 1 && app[find] !== undefined && app[find + 1].status === 1 && app[find].status !== 1) {
                            newIo.push(dataIo[i])
                        }
                    } else {
                        console.log('at available 5')
                        if (dataIo[i].status_reject !== 1 && app[find] !== undefined && app[find + 1].status === 1 && app[find - 1].status === null && app[find].status !== 1) {
                            newIo.push(dataIo[i])
                        }
                    }
                }
                this.setState({filter: val, newIo: newIo})
            } else if (val === 'reject' && dataIo.length > 0) {
                const newIo = []
                for (let i = 0; i < dataIo.length; i++) {
                    if (dataIo[i].status_reject === 1) {
                        newIo.push(dataIo[i])
                    }
                }
                this.setState({filter: val, newIo: newIo})
            } else if (val === 'selesai' && dataIo.length > 0) {
                const newIo = []
                for (let i = 0; i < dataIo.length; i++) {
                    if (dataIo[i].status_form === '8') {
                        newIo.push(dataIo[i])
                    }
                }
                this.setState({filter: val, newIo: newIo})
            } else {
                const newIo = []
                for (let i = 0; i < dataIo.length; i++) {
                    const app = dataIo[i].appForm ===  undefined ? [] : dataIo[i].appForm
                    const find = app.indexOf(app.find(({jabatan}) => jabatan === role))
                    if (level === '5' || level === '9') {
                        if (dataIo[i].status_form === '2' && (app[find] === undefined || app.length === 0)) {
                            console.log('at all 3')
                            newIo.push()
                        } else if (dataIo[i].status_form === '2' && app[find].status === null ) {
                            console.log('at all 4')
                            newIo.push()
                        } else {
                            newIo.push(dataIo[i])
                        }
                    } else if (find === 0 || find === '0') {
                        if (app[find] !== undefined && app[find + 1].status === 1 && app[find].status !== 1) {
                            newIo.push()
                        } else {
                            newIo.push(dataIo[i])
                        }
                    } else {
                        if (app[find] !== undefined && app[find + 1].status === 1 && app[find - 1].status === null && app[find].status !== 1) {
                            newIo.push()
                        } else {
                            newIo.push(dataIo[i])
                        }
                    }
                }
                this.setState({filter: val, newIo: newIo})
            }
        }
    }

    prosesDownload = (val) => {
        const {listIo, newIo} = this.state
        if (listIo.length === 0) {
            this.setState({confirm: 'rejDownload'})
            this.openConfirm()
        } else {
            const data = []
            for (let i = 0; i < listIo.length; i++) {
                const cekData = newIo.find(x => `${x.no_asset_temp === undefined ? '-' : x.no_asset_temp}${x.id}` === listIo[i])
                if (cekData !== undefined) {
                    data.push(cekData)
                }
            }
            this.setState({dataDownload: data})
            this.downloadReport(data)
        }
    }

    openConfirm = () => {
        this.setState({modalConfirm: !this.state.modalConfirm})
    }

    downloadReport = async (val) => {
        const dataDownload = val

        const workbook = new ExcelJS.Workbook();
        const ws = workbook.addWorksheet('report pengadaan asset')

        // await ws.protect('F1n4NcePm4')

        const borderStyles = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
        }


        ws.columns = [
            {header: 'NO', key: 'c1'},
            {header: 'Area PMA', key: 'c2'},
            {header: 'Unit', key: 'c3'},
            {header: 'Deskripsi', key: 'c4'},
            {header: 'Kategori', key: 'c5'},
            {header: 'Harga', key: 'c6'},
            {header: 'Total Harga', key: 'c7'},
            {header: 'Terima Io', key: 'c8'},
            {header: 'Waktu', key: 'c9'},
            {header: 'Kekurangan', key: 'c10'},
            {header: 'tgl Rev', key: 'c11'},
            {header: 'cek sudah pengajuan', key: 'c12'},
            {header: 'Fu', key: 'c13'},
            {header: 'Ket', key: 'c14'},
            {header: 'Selesai Rev', key: 'c15'},
            {header: 'Kirim Io ke budget', key: 'c16'},
            {header: 'ket rev', key: 'c17'},
            {header: 'tgl rev', key: 'c18'},
            {header: 'Terima Io dari budget', key: 'c19'},
            {header: 'No IO', key: 'c20'},
            {header: 'No Asset', key: 'c21'},
            {header: 'No.Doc', key: 'c22'},
            {header: 'Kirim Ke IO yang APP', key: 'c23'},
            {header: 'Keterangan', key: 'c24'},
            {header: 'PIC', key: 'c25'},
            {header: 'LPB', key: 'c26'},
            {header: 'INVOICE', key: 'c27'},
            {header: 'Jenis Ajuan', key: 'c28'}
        ]

        dataDownload.map((item, index) => { return ( ws.addRow(
            {
                c1: index + 1,
                c2: item.depo === null ? '-' : item.area === null ? item.depo.nama_area : item.area,
                c3: 1,
                c4: item.nama,
                c5: item.tipe,
                c6: item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
                c7: parseInt(item.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
                c8: moment(item.tglIo).format('DD/MM/YYYY'),
                c9: moment(item.tglIo).format('h:mm a'),
                c10: '-',
                c11: '-',
                c12: '-',
                c13: '-',
                c14: '-',
                c15: '-',
                c16: parseInt(item.status_form) > 2 && item.date_fullapp !== null ? moment(item.date_fullapp).format('DD/MM/YYYY') : parseInt(item.status_form) > 2 ? moment(item.appForm[0].updatedAt).format('DD/MM/YYYY') : '-',
                c17: '-',
                c18: '-',
                c19: parseInt(item.status_form) > 2 && item.date_budget !== null ? moment(item.date_budget).format('DD/MM/YYYY') : parseInt(item.status_form) > 2 ? moment(item.appForm[0].updatedAt).format('DD/MM/YYYY') : '-',
                c20: item.no_io,
                c21: item.no_asset_temp === undefined ? '-' : item.no_asset_temp,
                c22: item.no_pengadaan,
                c23: item.date_eksekusi !== null ? moment(item.date_eksekusi).format('DD/MM/YYYY') : moment(item.updatedAt).format('DD/MM/YYYY'),
                c24: '-',
                c25: item.pic_aset !== null ? item.pic_aset : item.depo !== null ? item.depo.nama_pic_1 : '-',
                c26: '-',
                c27: '-',
                c28: item.kategori === 'return' ? 'Pengajuan Return' : item.asset_token === null ? 'Pengajuan Asset' : 'Pengajuan PODS',
            }
        )
        ) })
        

        // ws.addRow(
        //     {
        //         c13: 'TOTAL :',
        //         c14: dataDownload.reduce((accumulator, object) => {
        //             return accumulator + parseInt(object.nilai_ajuan);
        //         }, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
        //         c15: '',
        //         c16: '',
        //         c17: '',
        //         c18: '',
        //         c19: '',
        //         c20: '',
        //         c21: '',
        //         c22: '',
        //         c23: '',
        //         c24: '',
        //         c25: '',
        //         c26: '',
        //         c27: '',
        //         c28: '',
        //         c29: '',
        //         c30: ''
        //     }
        // )

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
              `Report Pengadaan Asset ${moment().format('DD MMMM YYYY')}.xlsx`
            );
          });
    }

    menuButtonClick(ev) {
        ev.preventDefault();
        this.onSetOpen(!this.state.open);
    }

    onSetOpen(open) {
        this.setState({ open });
    }

    prosesSidebar = (val) => {
        this.setState({sidebarOpen: val})
    }
    
    goRoute = (val) => {
        this.props.history.push(`/${val}`)
    }

    chekApp = (val) => {
        const { listIo, newIo } = this.state
        if (val === 'all') {
            const data = []
            for (let i = 0; i < newIo.length; i++) {
                data.push(`${newIo[i].no_asset_temp === undefined ? '-' : newIo[i].no_asset_temp}${newIo[i].id}`)
            }
            this.setState({listIo: data})
        } else {
            listIo.push(val)
            this.setState({listIo: listIo})
        }
    }

    chekRej = (val) => {
        const {listIo} = this.state
        if (val === 'all') {
            const data = []
            this.setState({listIo: data})
        } else {
            const data = []
            for (let i = 0; i < listIo.length; i++) {
                if (listIo[i] === val) {
                    data.push()
                } else {
                    data.push(listIo[i])
                }
            }
            this.setState({listIo: data})
        }
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
        const {isOpen, dropOpen, dropOpenNum, detail, level, upload, errMsg, newIo, listIo} = this.state
        const {dataUser, isGet, alertM, alertMsg, alertUpload, page, dataRole} = this.props.user
        const { dataIo } = this.props.report
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
                                    <div className={style.titleDashboard}>Report Pengadaan Asset</div>
                                </div>
                                <div className={style.secHeadDashboard} >
                                    <div>
                                        <text>Show: </text>
                                        <ButtonDropdown className={style.drop} isOpen={dropOpen} toggle={this.dropDown}>
                                        <DropdownToggle caret color="light">
                                            {this.state.limit}
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem className={style.item} onClick={() => this.getDataReportIo({limit: 10, search: ''})}>10</DropdownItem>
                                            <DropdownItem className={style.item} onClick={() => this.getDataReportIo({limit: 20, search: ''})}>20</DropdownItem>
                                            <DropdownItem className={style.item} onClick={() => this.getDataReportIo({limit: 50, search: ''})}>50</DropdownItem>
                                            <DropdownItem className={style.item} onClick={() => this.getDataReportIo({limit: 100, search: ''})}>100</DropdownItem>
                                            <DropdownItem className={style.item} onClick={() => this.getDataReportIo({limit: 'All', search: ''})}>All</DropdownItem>
                                        </DropdownMenu>
                                        </ButtonDropdown>
                                        <text className={style.textEntries}>entries</text>
                                    </div>
                                </div>
                                <div className={style.secEmail}>
                                    <div className={style.headEmail}>
                                        <ReactHtmlToExcel
                                            id="test-table-xls-button"
                                            className="btn btn-success"
                                            table="table-to-xls"
                                            filename="Report Mutasi"
                                            sheet="Report"
                                            buttonText="Download Report"
                                        />
                                        <Button onClick={this.ExportMaster} disabled color="success" size="lg">Download</Button>
                                    </div>
                                    <div>
                                    </div>
                                </div>
                                {dataIo.length === 0 ? (
                                    <div className={style.tableDashboard}>
                                    <Table bordered responsive hover className={style.tab}>
                                        <thead>
                                            <tr>
                                                <th>NO URUT</th>
                                                <th>NO PENGAJUAN</th>
                                                <th>No ASSET</th>
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
                                    <Table bordered responsive hover id="table-to-xls" className={style.tab}>
                                        <thead>
                                            <tr>
                                                <th style={{backgroundColor: '#76923B'}}>NO URUT</th>
                                                <th style={{backgroundColor: '#76923B'}}>NO PENGAJUAN</th>
                                                <th style={{backgroundColor: '#76923B'}}>NO ASSET</th>
                                                <th style={{backgroundColor: '#76923B'}}>DESKRIPSI ASSET</th>
                                                <th style={{backgroundColor: '#76923B'}}>DARI</th>
                                                <th style={{backgroundColor: '#76923B'}}>KE</th>
                                                <th style={{backgroundColor: '#76923B'}}>KATEGORI</th>
                                                <th style={{backgroundColor: '#76923B'}}>TGL PENGAJUAN MUTASI</th>
                                                <th style={{backgroundColor: '#76923B'}}>BUKTI SERAH TERIMA</th>
                                                <th style={{backgroundColor: '#76923B'}}>TGL MUTASI FISIK</th>
                                                <th style={{backgroundColor: '#76923B'}}>TGL MUTASI SAP</th>
                                                <th style={{backgroundColor: '#76923B'}}>KETERANGAN</th>
                                                <th style={{backgroundColor: '#76923B'}}>STATUS</th>
                                                <th style={{backgroundColor: '#76923B'}}>PIC ASSET</th>
                                                <th style={{backgroundColor: '#76923B'}}>NO DOC SAP</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {dataIo.length !== 0 && dataIo.map(item => {
                                                return (
                                                <tr>
                                                    <th scope="row">{dataIo.indexOf(item) + 1}</th>
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
                        <h2 className={styleTrans.pageTitle}>Report Pengadaan Asset</h2>
                        <div className={styleTrans.searchContainer}>
                            <Button color='success' size='lg' onClick={this.prosesDownload}>Download</Button>
                            <select value={this.state.filter} onChange={e => this.changeFilter(e.target.value)} className={styleTrans.searchInput}>
                                <option value="all">All</option>
                                <option value="reject">Reject</option>
                                <option value="selesai">Finished</option>
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

                        <table className={`${styleTrans.table} ${newIo.length > 0 ? styleTrans.tableFull : ''}`}>
                            <thead>
                                <tr>
                                    <th>
                                        <Input 
                                        addon
                                        type="checkbox"
                                        className='mr-3'
                                        // disabled
                                        checked={listIo.length === newIo.length ? true : false}
                                        onClick={listIo.length === newIo.length ? () => this.chekRej('all') : () => this.chekApp('all')}
                                        />
                                        Select All
                                    </th>
                                    <th>NO</th>
                                    <th>Area PMA</th>
                                    <th>Unit</th>
                                    <th>Deskripsi</th>
                                    <th>Kategori</th>
                                    <th>Harga</th>
                                    <th>Total Harga</th>
                                    <th>Terima Io</th>
                                    <th>Waktu</th>
                                    <th>Kekurangan</th>
                                    <th>tgl Rev</th>
                                    <th>cek sudah pengajuan</th>
                                    <th>Fu</th>
                                    <th>Ket</th>
                                    <th>Selesai Rev</th>
                                    <th>Kirim Io ke budget</th>
                                    <th>ket rev</th>
                                    <th>tgl rev</th>
                                    <th>Terima Io dari budget</th>
                                    <th>No IO</th>
                                    <th>No Asset</th>
                                    <th>No.Doc</th>
                                    <th>Kirim Ke IO yang APP</th>
                                    <th>Keterangan</th>
                                    <th>PIC</th>
                                    <th>LPB</th>
                                    <th>INVOICE</th>
                                    <th>Jenis Ajuan</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {newIo.length > 0 && newIo.map(item => {
                                    return (
                                        <tr className={item.status_form === '0' ? 'fail' : item.status_reject === 0 ? 'note' : item.status_reject === 1 && 'bad'}>
                                            <td>
                                                <Input 
                                                addon
                                                type="checkbox"
                                                className=''
                                                // disabled
                                                // disabled={this.state.filter === 'not available' ? true : false}
                                                checked={listIo.find(element => element === `${item.no_asset_temp === undefined ? '-' : item.no_asset_temp}${item.id}`) !== undefined ? true : false}
                                                onClick={listIo.find(element => element === `${item.no_asset_temp === undefined ? '-' : item.no_asset_temp}${item.id}`) === undefined ? 
                                                    () => this.chekApp(`${item.no_asset_temp === undefined ? '-' : item.no_asset_temp}${item.id}`) : 
                                                    () => this.chekRej(`${item.no_asset_temp === undefined ? '-' : item.no_asset_temp}${item.id}`)
                                                }
                                                />
                                            </td>
                                            <td>{newIo.indexOf(item) + 1}</td>
                                            <td>{item.depo === null ? '' : item.area === null ? item.depo.nama_area : item.area}</td>
                                            <td>1</td>
                                            <td>{item.nama}</td>
                                            <td>{item.tipe}</td>
                                            <td>{item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                            <td>{item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                            {/* <td>{parseInt(item.price) * parseInt(item.qty)}</td> */}
                                            <td>{moment(item.tglIo).format('DD/MM/YYYY')}</td>
                                            <td>{moment(item.tglIo).format('h:mm a')}</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td>{parseInt(item.status_form) > 2 && item.date_fullapp !== null ? moment(item.date_fullapp).format('DD/MM/YYYY') : parseInt(item.status_form) > 2 ? moment(item.appForm[0].updatedAt).format('DD/MM/YYYY') : '-'}</td>
                                            <td></td>
                                            <td></td>
                                            <td>{parseInt(item.status_form) > 2 && item.date_budget !== null ? moment(item.date_budget).format('DD/MM/YYYY') : parseInt(item.status_form) > 2 ? moment(item.appForm[0].updatedAt).format('DD/MM/YYYY') : '-'}</td>
                                            <td>{item.no_io}</td>
                                            <td>{item.no_asset_temp === undefined ? '' : item.no_asset_temp}</td>
                                            <td>{item.no_pengadaan}</td>
                                            <td>{item.date_eksekusi !== null ? moment(item.date_eksekusi).format('DD/MM/YYYY') : moment(item.updatedAt).format('DD/MM/YYYY')}</td>
                                            <td></td>
                                            <td>{item.pic_aset !== null ? item.pic_aset : item.depo !== null ? item.depo.nama_pic_1 : ''}</td>
                                            <td></td>
                                            <td></td>
                                            <td>{item.kategori === 'return' ? 'Pengajuan Return' : item.asset_token === null ? 'Pengajuan Asset' : 'Pengajuan PODS'}</td>
                                            <td>{item.history !== null && item.history.split(',').reverse()[0]}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        {newIo.length === 0 && (
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
                <Modal isOpen={this.state.modalConfirm} toggle={this.openConfirm} size="md">
                    <ModalBody>
                        {this.state.confirm === 'submit' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Submit</div>
                            </div>
                            </div>
                        ) : this.state.confirm === 'isupdate' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                    <div className={[style.sucUpdate, style.green]}>Berhasil Update Nomor IO</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'approve' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                    <div className={[style.sucUpdate, style.green]}>Berhasil Approve</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'reject' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                    <div className={[style.sucUpdate, style.green]}>Berhasil Reject</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'update' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                    <div className={[style.sucUpdate, style.green]}>Berhasil Update</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'rejApprove' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Approve</div>
                            </div>
                            </div>
                        ) : this.state.confirm === 'rejReject' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Reject</div>
                            </div>
                            </div>
                        ) : this.state.confirm === 'rejSubmit' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Submit</div>
                                <div className="errApprove mt-2">Mohon isi Nomor IO terlebih dahulu</div>
                            </div>
                            </div>
                        ) : this.state.confirm === 'revdata' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Submit</div>
                                <div className="errApprove mt-2">Mohon perbaiki data ajuan terlebih dahulu</div>
                            </div>
                            </div>
                        ) : this.state.confirm === 'falseSubmit' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Submit</div>
                                <div className="errApprove mt-2">Mohon identifikasi asset terlebih dahulu</div>
                            </div>
                            </div>
                        ) : this.state.confirm === 'recent' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Permintaan gagal</div>
                                <div className="errApprove mt-2">Mohon isi alasan terlebih dahulu</div>
                            </div>
                            </div>
                        ) : this.state.confirm === 'falseAdd' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Menambahkan Item</div>
                                <div className="errApprove mt-2">Pastikan kategori dan tipe sama di setiap item</div>
                            </div>
                            </div>
                        ) : this.state.confirm === 'upreason' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                    <div className={[style.sucUpdate, style.green]}>Berhasil Update Alasan</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'rejDownload' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Download</div>
                                <div className="errApprove mt-2">Pilih data report terlebih dahulu</div>
                            </div>
                            </div>
                        ) : (
                            <div></div>
                        )}
                    </ModalBody>
                    <div className='row justify-content-md-center mb-4'>
                        <Button size='lg' onClick={this.openConfirm} color='primary'>OK</Button>
                    </div>
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
    getReportIo: report.getReportIo
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportTicket)
	