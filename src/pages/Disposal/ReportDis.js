import React, { Component } from 'react'
import {  NavbarBrand, DropdownToggle, DropdownMenu,
    DropdownItem, Table, ButtonDropdown, Input, Button,
    Modal, ModalHeader, ModalBody, Alert, Spinner} from 'reactstrap'
import style from '../../assets/css/input.module.css'
import {FaSearch, FaUserCircle, FaBars} from 'react-icons/fa'
import {AiFillCheckCircle, AiOutlineFileExcel, AiOutlineInbox} from 'react-icons/ai'
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
import NavBar from '../../components/NavBar'
import ReactHtmlToExcel from "react-html-table-to-excel"
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
            search: '',
            tipe: 'transaksi',
            time: 'pilih',
            time1: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
            // time1: moment().startOf('month').format('YYYY-MM-DD'),
            time2: moment().endOf('month').format('YYYY-MM-DD'),
            filter: '',
            newReport: [],
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

    changeTipe = (val) => {
        this.setState({tipe: val})
    }

    onSearch = async (e) => {
        this.setState({search: e.target.value})
        const token = localStorage.getItem("token")
        if(e.key === 'Enter'){
            this.changeFilter(this.state.filter)
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
        this.getDataReportDisposal()
    }

    getDataReportDisposal = async (val) => {
        this.changeFilter('finish')
    }

    changeFilter = async (val) => {
        const token = localStorage.getItem('token')
        const { time1, time2, search, limit } = this.state
        const cekTime1 = time1 === '' ? 'undefined' : time1
        const cekTime2 = time2 === '' ? 'undefined' : time2
        const status = val === 'finish' ? '8' : 'all'
        const tipe = 'disposal'

        await this.props.getReportDis(token, limit, search, 1, status, tipe, cekTime1, cekTime2)

        const { dataRep } = this.props.report
        const role = localStorage.getItem('role')
        if (val === 'reject' && dataRep.length > 0) {
            const newReport = []
            for (let i = 0; i < dataRep.length; i++) {
                if (dataRep[i].status_reject === 1) {
                    newReport.push(dataRep[i])
                }
            }
            this.setState({ filter: val, newReport: newReport })
        } else if (val === 'finish' && dataRep.length > 0) {
            const newReport = []
            for (let i = 0; i < dataRep.length; i++) {
                if (dataRep[i].status_form === 8) {
                    newReport.push(dataRep[i])
                }
            }
            this.setState({ filter: val, newReport: newReport })
        } else {
            const newReport = []
            for (let i = 0; i < dataRep.length; i++) {
                newReport.push(dataRep[i])
            }
            this.setState({ filter: val, newReport: newReport })
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


    menuButtonClick(ev) {
        ev.preventDefault();
        this.onSetOpen(!this.state.open);
    }

    onSetOpen(open) {
        this.setState({ open });
    }

    downloadHistoryReport = async (val) => {
        const {newReport} = this.state
        const dataDownload = newReport

        const workbook = new ExcelJS.Workbook();
        const ws = workbook.addWorksheet('data report')

        // await ws.protect('F1n4NcePm4')

        const borderStyles = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
        }


        ws.columns = [
            {header: 'NO', key: 'c1'},
            {header: 'No Pengajuan Disposal', key: 'c2'},
            {header: 'Nomor Asset', key: 'c3'},
            {header: 'Tgl dibuat Form  Disposal aset', key: 'c4'},
            {header: 'Tgl App BM', key: 'c5'},
            {header: 'Tgl app ISM', key: 'c6'},
            {header: 'Tgl App IRM', key: 'c7'},
            {header: 'Tgl App AM', key: 'c8'},
            {header: 'Tgl App NFAM', key: 'c9'},
            {header: 'Tgl App Head Of Ops', key: 'c10'},
            {header: 'Tgl App Head Of HC', key: 'c11'},
            {header: 'Tgl App CM', key: 'c12'},
            {header: 'Tgl dibuat form Persetujuan', key: 'c13'},
            {header: 'Tgl kirim Persetujuan disposal', key: 'c14'},
            {header: 'Selesai App Form Persetujuan', key: 'c15'},
            {header: 'Tgl area kirim kelengkapan eksekusi disposal', key: 'c16'},
            {header: 'Tgl Jurnal uang masuk', key: 'c17'},
            {header: 'Tgl Pembuatan Faktur Pajak', key: 'c18'},
            {header: 'Tgl Aset Info eksekusi disposal aset', key: 'c19'}
        ]

        dataDownload.map((item, index) => { return ( ws.addRow(
            {
                c1: index + 1,
                c2: item.no_disposal === null ? '-' : `D${item.no_disposal}`,
                c3: item.no_asset,
                c4: item.tanggalDis === null ? '-' : moment(item.tanggalDis).format('DD/MM/YYYY'),
                c5: item.appForm.length > 0 && item.appForm.find(({jabatan}) => jabatan === 'BM') !== undefined && item.appForm.find(({jabatan}) => jabatan === 'BM').status === 1 ? moment(item.appForm.find(({jabatan}) => jabatan === 'BM').updatedAt).format('DD/MM/YYYY') : '-',
                c6: item.appForm.length > 0 && item.appForm.find(({jabatan}) => jabatan === 'IT OSM') !== undefined &&item.appForm.find(({jabatan}) => jabatan === 'IT OSM').status === 1 ? moment(item.appForm.find(({jabatan}) => jabatan === 'IT OSM').updatedAt).format('DD/MM/YYYY') : '-',
                c7: item.appForm.length > 0 && item.appForm.find(({jabatan}) => jabatan === 'IRM') !== undefined && item.appForm.find(({jabatan}) => jabatan === 'IRM').status === 1 ? moment(item.appForm.find(({jabatan}) => jabatan === 'IRM').updatedAt).format('DD/MM/YYYY') : '-',
                c8: item.appForm.length > 0 && item.appForm.find(({jabatan}) => jabatan === 'AM') !== undefined && item.appForm.find(({jabatan}) => jabatan === 'AM').status === 1 ? moment(item.appForm.find(({jabatan}) => jabatan === 'AM').updatedAt).format('DD/MM/YYYY') : '-',
                c9: item.appForm.length > 0 && item.appForm.find(({jabatan}) => jabatan === 'NFAM') !== undefined && item.appForm.find(({jabatan}) => jabatan === 'NFAM').status === 1 ? moment(item.appForm.find(({jabatan}) => jabatan === 'NFAM').updatedAt).format('DD/MM/YYYY') : '-',
                c10: item.appForm.length > 0 && item.appForm.find(({jabatan}) => jabatan === 'HEAD OF OPS') !== undefined && item.appForm.find(({jabatan}) => jabatan === 'HEAD OF OPS').status === 1 ? moment(item.appForm.find(({jabatan}) => jabatan === 'HEAD OF OPS').updatedAt).format('DD/MM/YYYY') : '-',
                c11: item.appForm.length > 0 && item.appForm.find(({jabatan}) => jabatan === 'HEAD OF HC') !== undefined && item.appForm.find(({jabatan}) => jabatan === 'HEAD OF HC').status === 1 ? moment(item.appForm.find(({jabatan}) => jabatan === 'HEAD OF HC').updatedAt).format('DD/MM/YYYY') : '-',
                c12: item.appForm.length > 0 && item.appForm.find(({jabatan}) => jabatan === 'CM') !== undefined && item.appForm.find(({jabatan}) => jabatan === 'CM').status === 1 ? moment(item.appForm.find(({jabatan}) => jabatan === 'CM').updatedAt).format('DD/MM/YYYY') : '-',
                c13: item.ttdSet.length > 0 && item.ttdSet.find(({jabatan}) => jabatan === 'NFAM') !== undefined && item.ttdSet.find(({jabatan}) => jabatan === 'NFAM').status === 1 ? moment(item.ttdSet.find(({jabatan}) => jabatan === 'NFAM').createdAt).format('DD/MM/YYYY') : '-',
                c14: item.ttdSet.length > 0 && item.ttdSet.find(({jabatan}) => jabatan === 'NFAM') !== undefined && item.ttdSet.find(({jabatan}) => jabatan === 'NFAM').status === 1 ? moment(item.ttdSet.find(({jabatan}) => jabatan === 'NFAM').createdAt).format('DD/MM/YYYY') : '-',
                c15: item.ttdSet.length > 0 && item.ttdSet.find(({jabatan}) => jabatan === 'CEO') !== undefined && item.ttdSet.find(({jabatan}) => jabatan === 'CEO').status === 1 ? moment(item.ttdSet.find(({jabatan}) => jabatan === 'CEO').updatedAt).format('DD/MM/YYYY') : '-',
                c16: item.docAsset.length > 0 && item.docAsset.find(({tipe}) => tipe === 'dispose') !== undefined ? moment(item.docAsset.find(({tipe}) => tipe === 'dispose').createdAt).format('DD/MM/YYYY') : item.docAsset.find(({tipe}) => tipe === 'sell') !== undefined ? moment(item.docAsset.find(({tipe}) => tipe === 'sell').createdAt).format('DD/MM/YYYY') : '-',
                c17: item.docAsset.length > 0 && item.docAsset.find(({tipe}) => tipe === 'finance') !== undefined ? moment(item.docAsset.find(({tipe}) => tipe === 'finance').createdAt).format('DD/MM/YYYY') : '-',
                c18: item.docAsset.length > 0 && item.docAsset.find(({tipe}) => tipe === 'tax') !== undefined ? moment(item.docAsset.find(({tipe}) => tipe === 'tax').createdAt).format('DD/MM/YYYY') : '-',
                c19: item.status_form === 8 ? moment(item.updatedAt).format('DD/MM/YYYY') : '-'
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
              `Report History Disposal Asset ${moment().format('DD MMMM YYYY')}.xlsx`
            );
          });
    }


    downloadTransaksiReport = async (val) => {
        const {newReport} = this.state
        const dataDownload = newReport

        const workbook = new ExcelJS.Workbook();
        const ws = workbook.addWorksheet('data report')

        // await ws.protect('F1n4NcePm4')

        const borderStyles = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
        }


        ws.columns = [
            {header: 'NO', key: 'c1'},
            {header: 'No Pengajuan Disposal', key: 'c2'},
            {header: 'No Persetujuan Disposal', key: 'c3'},
            {header: 'Nomor Asset', key: 'c4'},
            {header: 'Nama Barang', key: 'c5'},
            {header: 'Kategori', key: 'c6'},
            {header: 'Cost Center', key: 'c7'},
            {header: 'Cost Center Name', key: 'c8'},
            {header: 'Tgl Perolehan', key: 'c9'},
            {header: 'Nilai Akuisisi', key: 'c10'},
            {header: 'Nilai Buku saat pengajuan Disposal aset', key: 'c11'},
            {header: 'Nilai jual', key: 'c12'},
            {header: 'Keterangan pengajuan disposal aset', key: 'c13'},
            {header: 'Nilai Buku saat persetujuan Disposal', key: 'c14'},
            {header: 'Keterangan persetujuan disposal aset', key: 'c15'},
            {header: 'Grouping eksekusi', key: 'c16'},
            {header: 'Akumulasi Aset', key: 'c17'},
            {header: 'Nilai Buku Saat eksekusi', key: 'c18'},
            {header: 'DPP', key: 'c19'},
            {header: 'PPN', key: 'c20'},
            {header: 'Profit/LOSS', key: 'c21'},
            {header: 'Tanggal Eksekusi disposal di SAP', key: 'c22'},
            {header: 'No Doc Jurnal Uang Masuk', key: 'c23'},
            {header: 'Nomor Faktur Pajak', key: 'c24'},
            {header: 'No Doc Disposal', key: 'c25'},
            {header: 'No Doc Clearing', key: 'c26'},
            {header: 'PIC ASET', key: 'c27'}
        ]

        dataDownload.map((item, index) => { return ( ws.addRow(
            {
                c1: index + 1,
                c2: item.no_disposal === null ? '-' : `D${item.no_disposal}`,
                c3: item.no_persetujuan,
                c4: item.no_asset,
                c5: item.nama_asset,
                c6: item.dataAsset === null ? '-' : item.dataAsset.kategori,
                c7: item.cost_center,
                c8: item.area,
                c9: item.dataAsset === null ? '-' : moment(item.dataAsset.tanggal).format('DD/MM/YYYY'),
                c10: item.dataAsset === null ? '-' : item.dataAsset.nilai_acquis === null ? '-' : item.dataAsset.nilai_acquis.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
                c11: item.nilai_buku === null ? '-' : item.nilai_buku.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
                c12: item.nilai_jual === null ? '-' : item.nilai_jual.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
                c13: item.keterangan,
                c14: item.nilai_buku === null ? '-' : item.nilai_buku.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
                c15: item.keterangan,
                c16: item.nilai_jual === '0' ? 'Dispose' : 'Sell',
                c17: item.dataAsset === null ? '-' : item.dataAsset.accum_dep === null ? '-' : item.dataAsset.accum_dep.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
                c18: item.nilai_buku_eks === null ? '-' : item.nilai_buku_eks.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
                c19: item.nilai_jual === '0' ? '-' : Math.round(parseInt(item.nilai_jual) / (11/10)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
                c20: item.nilai_jual === '0' ? '-' : Math.round(parseInt(item.nilai_jual) - Math.round(parseInt(item.nilai_jual) / (11/10))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
                c21: item.nilai_jual === '0' ? '-' : Math.round(Math.round(parseInt(item.nilai_jual) / (11/10))-parseInt(item.dataAsset === null ? 0 : item.dataAsset.nilai_buku)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
                c22: item.tgl_eksekusi === null ? '-' : moment(item.tgl_eksekusi).format('DD/MM/YYYY'),
                c23: item.no_sap,
                c24: item.no_fp,
                c25: item.doc_sap,
                c26: item.doc_clearing,
                c27: item.pic_aset === null ? item.depo.nama_pic_1 : item.pic_aset
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
              `Report Transaksi Disposal Asset ${moment().format('DD MMMM YYYY')}.xlsx`
            );
          });
    }

    downloadReport = async () => {
        const {tipe} = this.state
        if (tipe === 'transaksi'){
            this.setState({isLoading: true})
            await this.downloadTransaksiReport()
            this.setState({isLoading: false})
        } else {
            this.setState({isLoading: true})
            await this.downloadHistoryReport()
            this.setState({isLoading: false})
        }
    }

    render() {
        const {isOpen, dropOpen, dropOpenNum, detail, level, upload, errMsg, newReport} = this.state
        const {dataUser, isGet, alertM, alertMsg, alertUpload, page, dataRole} = this.props.user
        const { dataRep } = this.props.report
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
                            {levels === '2' || levels === 2 ? (
                                <div className={style.bodyDashboard}>
                                <div className={style.headMaster}>
                                    <div className={style.titleDashboard}>Report Disposal</div>
                                </div>
                                <div className={style.secHeadDashboard} >
                                    <div>
                                        <text>Show: </text>
                                        <ButtonDropdown className={style.drop} isOpen={dropOpen} toggle={this.dropDown}>
                                        <DropdownToggle caret color="light">
                                            {this.state.limit}
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem className={style.item} onClick={() => this.getDataReportDisposal({limit: 10, search: ''})}>10</DropdownItem>
                                            <DropdownItem className={style.item} onClick={() => this.getDataReportDisposal({limit: 20, search: ''})}>20</DropdownItem>
                                            <DropdownItem className={style.item} onClick={() => this.getDataReportDisposal({limit: 50, search: ''})}>50</DropdownItem>
                                            <DropdownItem className={style.item} onClick={() => this.getDataReportDisposal({limit: 100, search: ''})}>100</DropdownItem>
                                            <DropdownItem className={style.item} onClick={() => this.getDataReportDisposal({limit: 'All', search: ''})}>All</DropdownItem>
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
                                            filename={this.state.tipe === 'transaksi' ? "Report Disposal" : "Report History Disposal"}
                                            sheet="Report"
                                            buttonText="Download Report"
                                        />
                                        <Button onClick={this.ExportMaster} disabled color="success" size="lg">Download</Button>
                                    </div>
                                    <div>
                                        <text>Tipe Report: </text>
                                        <ButtonDropdown className={style.drop} isOpen={dropOpenNum} toggle={this.dropOpen}>
                                        <DropdownToggle caret color="light">
                                            Report {this.state.tipe}
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem className={style.item} onClick={() => this.changeTipe("transaksi")}>Report transaksi</DropdownItem>
                                            <DropdownItem className={style.item} onClick={() => this.changeTipe("history")}>Report history</DropdownItem>
                                        </DropdownMenu>
                                        </ButtonDropdown>
                                    </div>
                                </div>
                                {dataRep.length === 0 ? (
                                    <div className={style.tableDashboard}>
                                    <Table bordered responsive hover className={style.tab}>
                                        <thead>
                                            {this.state.tipe === 'transaksi' ? (
                                                <tr>
                                                    <th>No</th>
                                                    <th>No Pengajuan Disposal</th>
                                                    <th>No Persetujuan Disposal</th>
                                                    <th>Nomor Asset</th>
                                                    <th>Nama Barang</th>
                                                    <th>Kategori</th>
                                                    <th>Cost Center</th>
                                                    <th>Cost Center Name</th>
                                                    <th>Tgl Perolehan</th>
                                                    <th>Nilai Akuisisi</th>
                                                    <th>Nilai Buku saat pengajuan Disposal aset</th>
                                                    <th>Nilai jual</th>
                                                    <th>Keterangan pengajuan disposal aset</th>
                                                    <th>Nilai Buku saat persetujuan Disposal</th>
                                                    <th>Keteranagan persetujuan disposal aset</th>
                                                    <th>Grouping eksekusi</th>
                                                    <th>Akumulasi Aset</th>
                                                    <th>Nilai Buku Saat eksekusi</th>
                                                    <th>DPP</th>
                                                    <th>PPN</th>
                                                    <th>Profit/LOSS</th>
                                                    <th>Tanggal Eksekusi disposal di SAP</th>
                                                    <th>No Doc Jurnal Uang Masuk</th>
                                                    <th>Nomor Faktur Pajak</th>
                                                    <th>No Doc Disposal</th>
                                                    <th>No Doc Clearing</th>
                                                    <th>PIC ASET</th>
                                                </tr>
                                            ) : (
                                                <tr>
                                                    <th>No</th>
                                                    <th>No Pengajuan Disposal</th>
                                                    <th>Nomor Asset</th>
                                                    <th>Tgl dibuat Form  Disposal aset</th>
                                                    <th>Tgl App BM</th>
                                                    <th>Tgl app ISM</th>
                                                    <th>Tgl App IRM</th>
                                                    <th>Tgl App AM</th>
                                                    <th>Tgl App NFAM</th>
                                                    <th>Tgl App Head Of Ops</th>
                                                    <th>Tgl App Head Of HC</th>
                                                    <th>Tgl App CM</th>
                                                    <th>Tgl dibuat form Persetujuan</th>
                                                    <th>Tgl kirim Persetujuan disposal</th>
                                                    <th>Selesai App Form Persetujuan</th>
                                                    <th>Tgl area kirim kelengkapan eksekusi disposal</th>
                                                    <th>Tgl Jurnal uang masuk</th>
                                                    <th>Tgl Pembuatan Faktur Pajak</th>
                                                    <th>Tgl Aset Info eksekusi disposal aset</th>
                                                </tr>
                                            )}
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
                                            {this.state.tipe === 'transaksi' ? (
                                                <tr>
                                                    <th style={{backgroundColor: '#76923B'}}>No</th>
                                                    <th style={{backgroundColor: '#76923B'}}>No Pengajuan Disposal</th>
                                                    <th style={{backgroundColor: '#76923B'}}>No Persetujuan Disposal</th>
                                                    <th style={{backgroundColor: '#76923B'}}>Nomor Asset</th>
                                                    <th style={{backgroundColor: '#76923B'}}>Nama Barang</th>
                                                    <th style={{backgroundColor: '#76923B'}}>Kategori</th>
                                                    <th style={{backgroundColor: '#76923B'}}>Cost Center</th>
                                                    <th style={{backgroundColor: '#76923B'}}>Cost Center Name</th>
                                                    <th style={{backgroundColor: '#76923B'}}>Tgl Perolehan</th>
                                                    <th style={{backgroundColor: '#76923B'}}>Nilai Akuisisi</th>
                                                    <th style={{backgroundColor: '#76923B'}}>Nilai Buku saat pengajuan Disposal aset</th>
                                                    <th style={{backgroundColor: '#76923B'}}>Nilai jual</th>
                                                    <th style={{backgroundColor: '#76923B'}}>Keterangan pengajuan disposal aset</th>
                                                    <th style={{backgroundColor: '#76923B'}}>Nilai Buku saat persetujuan Disposal</th>
                                                    <th style={{backgroundColor: '#76923B'}}>Keterangan persetujuan disposal aset</th>
                                                    <th style={{backgroundColor: '#76923B'}}>Grouping eksekusi</th>
                                                    <th style={{backgroundColor: '#76923B'}}>Akumulasi Aset</th>
                                                    <th style={{backgroundColor: '#76923B'}}>Nilai Buku Saat eksekusi</th>
                                                    <th style={{backgroundColor: '#76923B'}}>DPP</th>
                                                    <th style={{backgroundColor: '#76923B'}}>PPN</th>
                                                    <th style={{backgroundColor: '#76923B'}}>Profit/LOSS</th>
                                                    <th style={{backgroundColor: '#76923B'}}>Tanggal Eksekusi disposal di SAP</th>
                                                    <th style={{backgroundColor: '#76923B'}}>No Doc Jurnal Uang Masuk</th>
                                                    <th style={{backgroundColor: '#76923B'}}>Nomor Faktur Pajak</th>
                                                    <th style={{backgroundColor: '#76923B'}}>No Doc Disposal</th>
                                                    <th style={{backgroundColor: '#76923B'}}>No Doc Clearing</th>
                                                    <th style={{backgroundColor: '#76923B'}}>PIC ASET</th>
                                                </tr>
                                            ) : (
                                                    <tr>
                                                        <th>No</th>
                                                        <th>No Pengajuan Disposal</th>
                                                        <th>Nomor Asset</th>
                                                        <th>Tgl dibuat Form  Disposal aset</th>
                                                        <th>Tgl App BM</th>
                                                        <th>Tgl app ISM</th>
                                                        <th>Tgl App IRM</th>
                                                        <th>Tgl App AM</th>
                                                        <th>Tgl App NFAM</th>
                                                        <th>Tgl App Head Of Ops</th>
                                                        <th>Tgl App Head Of HC</th>
                                                        <th>Tgl App CM</th>
                                                        <th>Tgl dibuat form Persetujuan</th>
                                                        <th>Tgl kirim Persetujuan disposal</th>
                                                        <th>Selesai App Form Persetujuan</th>
                                                        <th>Tgl area kirim kelengkapan eksekusi disposal</th>
                                                        <th>Tgl Jurnal uang masuk</th>
                                                        <th>Tgl Pembuatan Faktur Pajak</th>
                                                        <th>Tgl Aset Info eksekusi disposal aset</th>
                                                    </tr>
                                            )}
                                        </thead>
                                        <tbody>
                                        {dataRep.length !== 0 && dataRep.map(item => {
                                                return (
                                                this.state.tipe === 'transaksi' ? (
                                                    <tr>
                                                        <th scope="row">{dataRep.indexOf(item) + 1}</th>
                                                        <td>{item.no_disposal === null ? '-' : `D${item.no_disposal}`}</td>
                                                        <td>{item.no_persetujuan}</td>
                                                        <td>{item.no_asset}</td>
                                                        <td>{item.nama_asset}</td>
                                                        <td>{item.dataAsset === null ? '-' : item.dataAsset.kategori}</td>
                                                        <td>{item.cost_center}</td>
                                                        <td>{item.area}</td>
                                                        <td>{item.dataAsset === null ? '-' : moment(item.dataAsset.tanggal).format('DD/MM/YYYY')}</td>
                                                        <td>{item.dataAsset === null ? '-' : item.dataAsset.nilai_acquis === null ? '-' : item.dataAsset.nilai_acquis.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                        <td>{item.nilai_buku === null ? '-' : item.nilai_buku.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                        <td>{item.nilai_jual === null ? '-' : item.nilai_jual.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                        <td>{item.keterangan}</td>
                                                        <td>{item.nilai_buku === null ? '-' : item.nilai_buku.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                        <td>{item.keterangan}</td>
                                                        <td>{item.nilai_jual === '0' ? 'Dispose' : 'Sell'}</td>
                                                        <td>{item.dataAsset === null ? '-' : item.dataAsset.accum_dep === null ? '-' : item.dataAsset.accum_dep.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                        <td>{item.nilai_buku_eks === null ? '-' : item.nilai_buku_eks.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                        <td>{item.nilai_jual === '0' ? '-' : Math.round(parseInt(item.nilai_jual) / (11/10)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                        <td>{item.nilai_jual === '0' ? '-' : Math.round(parseInt(item.nilai_jual) - Math.round(parseInt(item.nilai_jual) / (11/10))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                        <td>{item.nilai_jual === '0' ? '-' : Math.round(Math.round(parseInt(item.nilai_jual) / (11/10))-parseInt(item.dataAsset === null ? 0 : item.dataAsset.nilai_buku)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                        <td>{item.tgl_eksekusi === null ? '-' : moment(item.tgl_eksekusi).format('DD/MM/YYYY')}</td>
                                                        <td>{item.no_sap}</td>
                                                        <td>{item.no_fp}</td>
                                                        <td>{item.doc_sap}</td>
                                                        <td>{item.doc_clearing}</td>
                                                        <td>{item.pic_aset === null ? item.depo.nama_pic_1 : item.pic_aset}</td>
                                                    </tr>
                                                ) : (
                                                    <tr>
                                                        <th scope="row">{dataRep.indexOf(item) + 1}</th>
                                                        <td>{item.no_disposal === null ? '-' : `D${item.no_disposal}`}</td>
                                                        <td>{item.no_asset}</td>
                                                        <td>{item.tanggalDis === null ? '-' : moment(item.tanggalDis).format('DD/MM/YYYY')}</td>
                                                        <td>{item.appForm.length > 0 && item.appForm.find(({jabatan}) => jabatan === 'BM') !== undefined && item.appForm.find(({jabatan}) => jabatan === 'BM').status === 1 ? moment(item.appForm.find(({jabatan}) => jabatan === 'BM').updatedAt).format('DD/MM/YYYY') : '-'}</td>
                                                        <td>{item.appForm.length > 0 && item.appForm.find(({jabatan}) => jabatan === 'IT OSM') !== undefined &&item.appForm.find(({jabatan}) => jabatan === 'IT OSM').status === 1 ? moment(item.appForm.find(({jabatan}) => jabatan === 'IT OSM').updatedAt).format('DD/MM/YYYY') : '-'}</td>
                                                        <td>{item.appForm.length > 0 && item.appForm.find(({jabatan}) => jabatan === 'IRM') !== undefined && item.appForm.find(({jabatan}) => jabatan === 'IRM').status === 1 ? moment(item.appForm.find(({jabatan}) => jabatan === 'IRM').updatedAt).format('DD/MM/YYYY') : '-'}</td>
                                                        <td>{item.appForm.length > 0 && item.appForm.find(({jabatan}) => jabatan === 'AM') !== undefined && item.appForm.find(({jabatan}) => jabatan === 'AM').status === 1 ? moment(item.appForm.find(({jabatan}) => jabatan === 'AM').updatedAt).format('DD/MM/YYYY') : '-'}</td>
                                                        <td>{item.appForm.length > 0 && item.appForm.find(({jabatan}) => jabatan === 'NFAM') !== undefined && item.appForm.find(({jabatan}) => jabatan === 'NFAM').status === 1 ? moment(item.appForm.find(({jabatan}) => jabatan === 'NFAM').updatedAt).format('DD/MM/YYYY') : '-'}</td>
                                                        <td>{item.appForm.length > 0 && item.appForm.find(({jabatan}) => jabatan === 'HEAD OF OPS') !== undefined && item.appForm.find(({jabatan}) => jabatan === 'HEAD OF OPS').status === 1 ? moment(item.appForm.find(({jabatan}) => jabatan === 'HEAD OF OPS').updatedAt).format('DD/MM/YYYY') : '-'}</td>
                                                        <td>{item.appForm.length > 0 && item.appForm.find(({jabatan}) => jabatan === 'HEAD OF HC') !== undefined && item.appForm.find(({jabatan}) => jabatan === 'HEAD OF HC').status === 1 ? moment(item.appForm.find(({jabatan}) => jabatan === 'HEAD OF HC').updatedAt).format('DD/MM/YYYY') : '-'}</td>
                                                        <td>{item.appForm.length > 0 && item.appForm.find(({jabatan}) => jabatan === 'CM') !== undefined && item.appForm.find(({jabatan}) => jabatan === 'CM').status === 1 ? moment(item.appForm.find(({jabatan}) => jabatan === 'CM').updatedAt).format('DD/MM/YYYY') : '-'}</td>
                                                        <td>{item.ttdSet.length > 0 && item.ttdSet.find(({jabatan}) => jabatan === 'NFAM') !== undefined && item.ttdSet.find(({jabatan}) => jabatan === 'NFAM').status === 1 ? moment(item.ttdSet.find(({jabatan}) => jabatan === 'NFAM').createdAt).format('DD/MM/YYYY') : '-'}</td>
                                                        <td>{item.ttdSet.length > 0 && item.ttdSet.find(({jabatan}) => jabatan === 'NFAM') !== undefined && item.ttdSet.find(({jabatan}) => jabatan === 'NFAM').status === 1 ? moment(item.ttdSet.find(({jabatan}) => jabatan === 'NFAM').createdAt).format('DD/MM/YYYY') : '-'}</td>
                                                        <td>{item.ttdSet.length > 0 && item.ttdSet.find(({jabatan}) => jabatan === 'CEO') !== undefined && item.ttdSet.find(({jabatan}) => jabatan === 'CEO').status === 1 ? moment(item.ttdSet.find(({jabatan}) => jabatan === 'CEO').updatedAt).format('DD/MM/YYYY') : '-'}</td>
                                                        <td>{item.docAsset.length > 0 && item.docAsset.find(({tipe}) => tipe === 'dispose') !== undefined ? moment(item.docAsset.find(({tipe}) => tipe === 'dispose').createdAt).format('DD/MM/YYYY') : item.docAsset.find(({tipe}) => tipe === 'sell') !== undefined ? moment(item.docAsset.find(({tipe}) => tipe === 'sell').createdAt).format('DD/MM/YYYY') : '-'}</td>
                                                        <td>{item.docAsset.length > 0 && item.docAsset.find(({tipe}) => tipe === 'finance') !== undefined ? moment(item.docAsset.find(({tipe}) => tipe === 'finance').createdAt).format('DD/MM/YYYY') : '-'}</td>
                                                        <td>{item.docAsset.length > 0 && item.docAsset.find(({tipe}) => tipe === 'tax') !== undefined ? moment(item.docAsset.find(({tipe}) => tipe === 'tax').createdAt).format('DD/MM/YYYY') : '-'}</td>
                                                        <td>{item.status_form === 8 ? moment(item.updatedAt).format('DD/MM/YYYY') : '-'}</td>
                                                    </tr>
                                                )
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
                            ) : (
                                <div className={style.headMaster}>
                                    <div className={style.titleDashboard1}>Anda tidak memiliki akses dihalaman ini</div>
                                </div>
                            )}
                        </div>
                    </MaterialTitlePanel>
                </Sidebar> */}
                <div className={styleTrans.app}>
                    <NewNavbar handleSidebar={this.prosesSidebar} handleRoute={this.goRoute} />

                    <div className={`${styleTrans.mainContent} ${this.state.sidebarOpen ? styleTrans.collapsedContent : ''}`}>
                        <h2 className={styleTrans.pageTitle}>Report Disposal</h2>
                        <div className={styleTrans.searchContainer}>
                            <Button size='md' color='success' onClick={this.downloadReport}>Download Report</Button>
                            <div></div>
                        </div>
                        <div className={styleTrans.searchContainer}>
                            <div>
                                <ButtonDropdown className={style.drop} isOpen={dropOpenNum} toggle={this.dropOpen}>
                                <DropdownToggle caret color="light">
                                    Report {this.state.tipe}
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem className={style.item} onClick={() => this.changeTipe("transaksi")}>Report transaksi</DropdownItem>
                                    <DropdownItem className={style.item} onClick={() => this.changeTipe("history")}>Report history</DropdownItem>
                                </DropdownMenu>
                                </ButtonDropdown>
                            </div>
                            <select value={this.state.filter} onChange={e => this.changeFilter(e.target.value)} className={styleTrans.searchInput}>
                                <option value="all">All</option>
                                <option value="finish">Finished</option>
                                <option value="reject">Reject</option>
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
                                {this.state.time === 'pilih' ? (
                                    <>
                                        <div className='rowCenter'>
                                            <text className='bold'>:</text>
                                            <Input
                                                type="date"
                                                className="inputRinci"
                                                value={this.state.time1}
                                                onChange={e => this.selectTime({ val: e.target.value, type: 'time1' })}
                                            />
                                            <text className='mr-1 ml-1'>To</text>
                                            <Input
                                                type="date"
                                                className="inputRinci"
                                                value={this.state.time2}
                                                onChange={e => this.selectTime({ val: e.target.value, type: 'time2' })}
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

                        <table className={`${styleTrans.table} ${styleTrans.tableFull}`}>
                            <thead>
                                {this.state.tipe === 'transaksi' ? (
                                    <tr>
                                        <th>No</th>
                                        <th>No Pengajuan Disposal</th>
                                        <th>No Persetujuan Disposal</th>
                                        <th>Nomor Asset</th>
                                        <th>Nama Barang</th>
                                        <th>Kategori</th>
                                        <th>Cost Center</th>
                                        <th>Cost Center Name</th>
                                        <th>Tgl Perolehan</th>
                                        <th>Nilai Akuisisi</th>
                                        <th>Nilai Buku saat pengajuan Disposal aset</th>
                                        <th>Nilai jual</th>
                                        <th>Keterangan pengajuan disposal aset</th>
                                        <th>Nilai Buku saat persetujuan Disposal</th>
                                        <th>Keterangan persetujuan disposal aset</th>
                                        <th>Grouping eksekusi</th>
                                        <th>Akumulasi Aset</th>
                                        <th>Nilai Buku Saat eksekusi</th>
                                        <th>DPP</th>
                                        <th>PPN</th>
                                        <th>Profit/LOSS</th>
                                        <th>Tanggal Eksekusi disposal di SAP</th>
                                        <th>No Doc Jurnal Uang Masuk</th>
                                        <th>Nomor Faktur Pajak</th>
                                        <th>No Doc Disposal</th>
                                        <th>No Doc Clearing</th>
                                        <th>PIC ASET</th>
                                    </tr>
                                ) : (
                                        <tr>
                                            <th>No</th>
                                            <th>No Pengajuan Disposal</th>
                                            <th>Nomor Asset</th>
                                            <th>Tgl dibuat Form  Disposal aset</th>
                                            <th>Tgl App BM</th>
                                            <th>Tgl app ISM</th>
                                            <th>Tgl App IRM</th>
                                            <th>Tgl App AM</th>
                                            <th>Tgl App NFAM</th>
                                            <th>Tgl App Head Of Ops</th>
                                            <th>Tgl App Head Of HC</th>
                                            <th>Tgl App CM</th>
                                            <th>Tgl dibuat form Persetujuan</th>
                                            <th>Tgl kirim Persetujuan disposal</th>
                                            <th>Selesai App Form Persetujuan</th>
                                            <th>Tgl area kirim kelengkapan eksekusi disposal</th>
                                            <th>Tgl Jurnal uang masuk</th>
                                            <th>Tgl Pembuatan Faktur Pajak</th>
                                            <th>Tgl Aset Info eksekusi disposal aset</th>
                                        </tr>
                                )}
                            </thead>
                            <tbody>
                                {newReport.length !== 0 && newReport.map(item => {
                                    return (
                                    this.state.tipe === 'transaksi' ? (
                                        <tr>
                                            <td scope="row">{newReport.indexOf(item) + 1}</td>
                                            <td>{item.no_disposal === null ? '-' : `D${item.no_disposal}`}</td>
                                            <td>{item.no_persetujuan}</td>
                                            <td>{item.no_asset}</td>
                                            <td>{item.nama_asset}</td>
                                            <td>{item.dataAsset === null ? '-' : item.dataAsset.kategori}</td>
                                            <td>{item.cost_center}</td>
                                            <td>{item.area}</td>
                                            <td>{item.dataAsset === null ? '-' : moment(item.dataAsset.tanggal).format('DD/MM/YYYY')}</td>
                                            <td>{item.dataAsset === null ? '-' : item.dataAsset.nilai_acquis === null ? '-' : item.dataAsset.nilai_acquis.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                            <td>{item.nilai_buku === null ? '-' : item.nilai_buku.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                            <td>{item.nilai_jual === null ? '-' : item.nilai_jual.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                            <td>{item.keterangan}</td>
                                            <td>{item.nilai_buku === null ? '-' : item.nilai_buku.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                            <td>{item.keterangan}</td>
                                            <td>{item.nilai_jual === '0' ? 'Dispose' : 'Sell'}</td>
                                            <td>{item.dataAsset === null ? '-' : item.dataAsset.accum_dep === null ? '-' : item.dataAsset.accum_dep.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                            <td>{item.nilai_buku_eks === null ? '-' : item.nilai_buku_eks.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                            <td>{item.nilai_jual === '0' ? '-' : Math.round(parseInt(item.nilai_jual) / (11/10)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                            <td>{item.nilai_jual === '0' ? '-' : Math.round(parseInt(item.nilai_jual) - Math.round(parseInt(item.nilai_jual) / (11/10))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                            <td>{item.nilai_jual === '0' ? '-' : Math.round(Math.round(parseInt(item.nilai_jual) / (11/10))-parseInt(item.dataAsset === null ? 0 : item.dataAsset.nilai_buku)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                            <td>{item.tgl_eksekusi === null ? '-' : moment(item.tgl_eksekusi).format('DD/MM/YYYY')}</td>
                                            <td>{item.no_sap}</td>
                                            <td>{item.no_fp}</td>
                                            <td>{item.doc_sap}</td>
                                            <td>{item.doc_clearing}</td>
                                            <td>{item.pic_aset === null ? item.depo.nama_pic_1 : item.pic_aset}</td>
                                        </tr>
                                    ) : (
                                        <tr>
                                            <td scope="row">{newReport.indexOf(item) + 1}</td>
                                            <td>{item.no_disposal === null ? '-' : `D${item.no_disposal}`}</td>
                                            <td>{item.no_asset}</td>
                                            <td>{item.tanggalDis === null ? '-' : moment(item.tanggalDis).format('DD/MM/YYYY')}</td>
                                            <td>{item.appForm.length > 0 && item.appForm.find(({jabatan}) => jabatan === 'BM') !== undefined && item.appForm.find(({jabatan}) => jabatan === 'BM').status === 1 ? moment(item.appForm.find(({jabatan}) => jabatan === 'BM').updatedAt).format('DD/MM/YYYY') : '-'}</td>
                                            <td>{item.appForm.length > 0 && item.appForm.find(({jabatan}) => jabatan === 'IT OSM') !== undefined &&item.appForm.find(({jabatan}) => jabatan === 'IT OSM').status === 1 ? moment(item.appForm.find(({jabatan}) => jabatan === 'IT OSM').updatedAt).format('DD/MM/YYYY') : '-'}</td>
                                            <td>{item.appForm.length > 0 && item.appForm.find(({jabatan}) => jabatan === 'IRM') !== undefined && item.appForm.find(({jabatan}) => jabatan === 'IRM').status === 1 ? moment(item.appForm.find(({jabatan}) => jabatan === 'IRM').updatedAt).format('DD/MM/YYYY') : '-'}</td>
                                            <td>{item.appForm.length > 0 && item.appForm.find(({jabatan}) => jabatan === 'AM') !== undefined && item.appForm.find(({jabatan}) => jabatan === 'AM').status === 1 ? moment(item.appForm.find(({jabatan}) => jabatan === 'AM').updatedAt).format('DD/MM/YYYY') : '-'}</td>
                                            <td>{item.appForm.length > 0 && item.appForm.find(({jabatan}) => jabatan === 'NFAM') !== undefined && item.appForm.find(({jabatan}) => jabatan === 'NFAM').status === 1 ? moment(item.appForm.find(({jabatan}) => jabatan === 'NFAM').updatedAt).format('DD/MM/YYYY') : '-'}</td>
                                            <td>{item.appForm.length > 0 && item.appForm.find(({jabatan}) => jabatan === 'HEAD OF OPS') !== undefined && item.appForm.find(({jabatan}) => jabatan === 'HEAD OF OPS').status === 1 ? moment(item.appForm.find(({jabatan}) => jabatan === 'HEAD OF OPS').updatedAt).format('DD/MM/YYYY') : '-'}</td>
                                            <td>{item.appForm.length > 0 && item.appForm.find(({jabatan}) => jabatan === 'HEAD OF HC') !== undefined && item.appForm.find(({jabatan}) => jabatan === 'HEAD OF HC').status === 1 ? moment(item.appForm.find(({jabatan}) => jabatan === 'HEAD OF HC').updatedAt).format('DD/MM/YYYY') : '-'}</td>
                                            <td>{item.appForm.length > 0 && item.appForm.find(({jabatan}) => jabatan === 'CM') !== undefined && item.appForm.find(({jabatan}) => jabatan === 'CM').status === 1 ? moment(item.appForm.find(({jabatan}) => jabatan === 'CM').updatedAt).format('DD/MM/YYYY') : '-'}</td>
                                            <td>{item.ttdSet.length > 0 && item.ttdSet.find(({jabatan}) => jabatan === 'NFAM') !== undefined && item.ttdSet.find(({jabatan}) => jabatan === 'NFAM').status === 1 ? moment(item.ttdSet.find(({jabatan}) => jabatan === 'NFAM').createdAt).format('DD/MM/YYYY') : '-'}</td>
                                            <td>{item.ttdSet.length > 0 && item.ttdSet.find(({jabatan}) => jabatan === 'NFAM') !== undefined && item.ttdSet.find(({jabatan}) => jabatan === 'NFAM').status === 1 ? moment(item.ttdSet.find(({jabatan}) => jabatan === 'NFAM').createdAt).format('DD/MM/YYYY') : '-'}</td>
                                            <td>{item.ttdSet.length > 0 && item.ttdSet.find(({jabatan}) => jabatan === 'CEO') !== undefined && item.ttdSet.find(({jabatan}) => jabatan === 'CEO').status === 1 ? moment(item.ttdSet.find(({jabatan}) => jabatan === 'CEO').updatedAt).format('DD/MM/YYYY') : '-'}</td>
                                            <td>{item.docAsset.length > 0 && item.docAsset.find(({tipe}) => tipe === 'dispose') !== undefined ? moment(item.docAsset.find(({tipe}) => tipe === 'dispose').createdAt).format('DD/MM/YYYY') : item.docAsset.find(({tipe}) => tipe === 'sell') !== undefined ? moment(item.docAsset.find(({tipe}) => tipe === 'sell').createdAt).format('DD/MM/YYYY') : '-'}</td>
                                            <td>{item.docAsset.length > 0 && item.docAsset.find(({tipe}) => tipe === 'finance') !== undefined ? moment(item.docAsset.find(({tipe}) => tipe === 'finance').createdAt).format('DD/MM/YYYY') : '-'}</td>
                                            <td>{item.docAsset.length > 0 && item.docAsset.find(({tipe}) => tipe === 'tax') !== undefined ? moment(item.docAsset.find(({tipe}) => tipe === 'tax').createdAt).format('DD/MM/YYYY') : '-'}</td>
                                            <td>{item.status_form === 8 ? moment(item.updatedAt).format('DD/MM/YYYY') : '-'}</td>
                                        </tr>
                                    )
                                )})}
                            </tbody>
                        </table>
                        {newReport.length === 0 && (
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
                <Modal isOpen={
                    this.props.user.isLoading || 
                    this.props.report.isLoading || 
                    this.state.isLoading ? true: false
                } 
                size="sm">
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
    getReportDis: report.getReportDisposal
}

export default connect(mapStateToProps, mapDispatchToProps)(MasterUser)
	