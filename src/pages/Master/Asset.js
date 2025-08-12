import React, { Component } from 'react'
import { Container, Collapse, Nav, Navbar,
    NavbarToggler, NavbarBrand, NavItem, NavLink, Row, Col,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, Dropdown,
    DropdownItem, Table, ButtonDropdown, Input, Button,
    Modal, ModalHeader, ModalBody, ModalFooter, Alert, Spinner} from 'reactstrap'
import logo from "../../assets/img/logo.png"
import style from '../../assets/css/input.module.css'
import {FaSearch, FaUserCircle, FaBars, FaBarcode} from 'react-icons/fa'
import {AiOutlineFileExcel, AiFillCheckCircle, AiOutlineInbox, AiOutlineClose} from 'react-icons/ai'
import {Formik} from 'formik'
import * as Yup from 'yup'
import asset from '../../redux/actions/asset'
import {connect} from 'react-redux'
import moment from 'moment'
import auth from '../../redux/actions/auth'
import {default as axios} from 'axios'
import Sidebar from "../../components/Header";
import MaterialTitlePanel from "../../components/material_title_panel";
import SidebarContent from "../../components/sidebar_content";
import NavBar from '../../components/NavBar'
import styleTrans from '../../assets/css/transaksi.module.css'
import styleHome from '../../assets/css/Home.module.css'
import NewNavbar from '../../components/NewNavbar'
import ExcelJS from "exceljs"
import fs from "file-saver"
import Barcode from 'react-barcode'
import { BsTable, BsQrCode } from "react-icons/bs";
import * as htmlToImage from 'html-to-image';
import QRCode from "react-qr-code"
const {REACT_APP_BACKEND_URL} = process.env

const dokumenSchema = Yup.object().shape({
    nama_dokumen: Yup.string().required(),
    jenis_dokumen: Yup.string().required(),
    divisi: Yup.string().required(),
});

const filterSchema = Yup.object().shape({
    no_asset:  Yup.string(),
    date1: Yup.date()
})

class Asset extends Component {
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
            dataDivisi: [],
            upload: false,
            errMsg: '',
            fileUpload: '',
            limit: 10,
            search: '',
            listAsset: [],
            openChoose: false,
            images: [],
            isLoading: false
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
        this.canvasRefs = []
        this.barcodeRefs = {};
    }

    prosesSidebar = (val) => {
        this.setState({sidebarOpen: val})
    }
    
    goRoute = (val) => {
        this.props.history.push(`/${val}`)
    }

    chekApp = (val) => {
        const { listAsset } = this.state
        const {dataAsset} = this.props.asset
        if (val === 'all') {
            const data = []
            for (let i = 0; i < dataAsset.length; i++) {
                data.push(dataAsset[i].id)
            }
            this.setState({listAsset: data})
        } else {
            listAsset.push(val)
            this.setState({listAsset: listAsset})
        }
    }

    chekRej = (val) => {
        const {listAsset} = this.state
        if (val === 'all') {
            const data = []
            this.setState({listAsset: data})
        } else {
            const data = []
            for (let i = 0; i < listAsset.length; i++) {
                if (listAsset[i] === val) {
                    data.push()
                } else {
                    data.push(listAsset[i])
                }
            }
            this.setState({listAsset: data})
        }
    }

    downloadData = () => {
        const {listAsset} = this.state
        const {dataAsset} = this.props.asset
        const dataDownload = []
        for (let i = 0; i < listAsset.length; i++) {
            for (let j = 0; j < dataAsset.length; j++) {
                if (dataAsset[j].id === listAsset[i]) {
                    dataDownload.push(dataAsset[j])
                }
            }
        }

        const workbook = new ExcelJS.Workbook();
        const ws = workbook.addWorksheet('data aset')

        // await ws.protect('F1n4NcePm4')

        const borderStyles = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
        }
        

        ws.columns = [
            {header: 'Asset', key: 'c2'},
            {header: 'SNo.', key: 'c3'},
            {header: 'Cap.Date', key: 'c4'},
            {header: 'Asset Description', key: 'c5'},
            {header: 'Acquis.val.', key: 'c6'},
            {header: 'Accum.dep.', key: 'c7'},
            {header: 'Book val.', key: 'c8'},
            {header: 'Plant', key: 'c9'},
            {header: 'Cost Ctr', key: 'c10'},
            {header: 'Cost Ctr Name', key: 'c11'},
            {header: 'MERK', key: 'c12'},
            {header: 'SATUAN', key: 'c13'},
            {header: 'JUMLAH', key: 'c14'},
            {header: 'LOKASI', key: 'c15'},
            {header: 'KATEGORI', key: 'c16'},
            {header: 'STATUS', key: 'c17'}
        ]

        dataDownload.map((item, index) => { return ( ws.addRow(
            {
                c2: item.no_asset,
                c3: item.no_doc,
                c4: moment(item.tanggal).format('DD/MM/YYYY'),
                c5: item.nama_asset,
                c6: item.nilai_acquis,
                c7: item.accum_dep,
                c8: item.nilai_buku,
                c9: item.kode_plant,
                c10: item.cost_center,
                c11: item.area,
                c12: item.merk,
                c13: item.satuan,
                c14: item.unit,
                c15: item.lokasi,
                c16: item.kategori,
                c17: item.status === '100' ? 'Asset belum di GR' : item.status === '0' ? 'Asset telah didisposal' : 'available'
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
              `Data Asset ${moment().format('DD MMMM YYYY')}.xlsx`
            );
          });
    }

    downloadBarcode = async () => {
        this.setState({isLoading: true})
        const {listAsset} = this.state
        const {dataAsset} = this.props.asset
        const dataDownload = []
        for (let i = 0; i < listAsset.length; i++) {
            for (let j = 0; j < dataAsset.length; j++) {
                if (dataAsset[j].id === listAsset[i]) {
                    dataDownload.push(dataAsset[j])
                }
            }
        }

        const workbook = new ExcelJS.Workbook();
        const ws = workbook.addWorksheet('qr code', {
            pageSetup: { 
                orientation:'portrait', 
                paperSize: 9,
                // margins: {
                //     top: 0.1,
                //     bottom: 0.1
                // } 
            }
        })

        const tbStyle = {
            horizontal:'center',
            wrapText: true,
            vertical: 'middle',
            shrinkToFit: true
        }

        const textImgStyle = {
            vertical: 'bottom',
            horizontal: 'center',
            wrapText: true
        }

        const boldStyle = {
            bold: true
        }

        const imgStyle = {
            wrapText: true,
            vertical: 'middle',
            shrinkToFit: true,
            horizontal: 'center'
        }

        const borderStyles = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
        }

        ws.pageSetup.printTitlesRow = '1:2';

        ws.mergeCells(`A${2}`, `H${2}`)
        ws.getCell(`A${2}`).value = 'Qr Code'
        ws.getCell(`A${2}`).alignment = { 
            ...tbStyle
        }
        ws.getCell(`A${2}`).border = { 
            ...borderStyles
        }
        ws.getCell(`A${2}`).font = { 
            ...boldStyle
        }
    
        for (let i = 0; i < dataDownload.length; i++) {
            const item = dataDownload[i]

            const colFirst = (i % 2) === 0 ? 'A' : 'E'
            const colLast = (i % 2) === 0 ? 'D' : 'H'
            const numContent = colFirst === 'E' ? 3 + (i - 1) : 3 + i

            ws.mergeCells(`${colFirst}${numContent}`, `${colLast}${numContent}`)
            ws.getCell(`${colFirst}${numContent}`).value = `${item.nama_asset}\nNO ASSET: ${item.no_asset}\nCOST CENTER: ${item.cost_center}\n`
            ws.getCell(`${colFirst}${numContent}`).alignment = { 
                ...textImgStyle
            }
            ws.getCell(`${colFirst}${numContent}`).border = { 
                ...borderStyles
            }
            ws.getRow(numContent).height = 230
            
            const node = this.barcodeRefs[item.no_asset];
            if (!node) continue;
        
            const dataUrl = await htmlToImage.toPng(node);
            const imageId = workbook.addImage({
                base64: dataUrl,
                extension: 'png',
            });

            const rowImg = colFirst === 'E' ? (i - 1) : i
        
            ws.addImage(imageId, {
                tl: { col: colFirst === 'A' ? 0.5 : 4.5, row: rowImg + 2.4 },
                ext: { width: 200, height: 200 },
            });
        }
    
        const buffer = await workbook.xlsx.writeBuffer();
        fs.saveAs(
            new Blob([buffer], { type: "application/octet-stream" }),
            `Data Qr Code ${moment().format('DD MMMM YYYY')}.xlsx`
        );
        this.setState({isLoading: false})
    }

    setImageBarcode = () => {
        setTimeout(() => {
            const images = this.canvasRefs.map((ref, index) => {
                const canvas = ref?.querySelector('canvas');
                if (!canvas) return null;

                const base64 = canvas.toDataURL('image/png');
                return { index, base64 };
            }).filter(Boolean);
    
          this.setState({ images });
        }, 1000);
      }

    showAlert = () => {
        this.setState({alert: true, modalEdit: false, modalAdd: false, modalUpload: false })
       
         setTimeout(() => {
            this.setState({
                alert: false
            })
         }, 10000)
    }

    next = async () => {
        const { page } = this.props.asset
        const token = localStorage.getItem('token')
        await this.props.nextPage(token, page.nextLink)
    }

    prev = async () => {
        const { page } = this.props.asset
        const token = localStorage.getItem('token')
        await this.props.nextPage(token, page.prevLink)
    }

    uploadAlert = () => {
        this.setState({upload: true, modalUpload: false })
       
         setTimeout(() => {
            this.setState({
                upload: false
            })
         }, 10000)
    }

    toggle = () => {
        this.setState({isOpen: !this.state.isOpen})
    }

    openConfirm = () => {
        this.setState({modalConfirm: !this.state.modalConfirm})
    }

    downloadTemplate = () => {
        const {listAsset} = this.state
        const {dataAsset} = this.props.asset
        const dataDownload = []

        const workbook = new ExcelJS.Workbook();
        const ws = workbook.addWorksheet('data aset')

        // await ws.protect('F1n4NcePm4')

        const borderStyles = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
        }
        

        ws.columns = [
            {header: 'Asset', key: 'c2'},
            {header: 'SNo.', key: 'c3'},
            {header: 'Cap.Date', key: 'c4'},
            {header: 'Asset Description', key: 'c5'},
            {header: 'Acquis.val.', key: 'c6'},
            {header: 'Accum.dep.', key: 'c7'},
            {header: 'Book val.', key: 'c8'},
            {header: 'Plant', key: 'c9'},
            {header: 'Cost Ctr', key: 'c10'},
            {header: 'Cost Ctr Name', key: 'c11'},
            {header: 'MERK', key: 'c12'},
            {header: 'SATUAN', key: 'c13'},
            {header: 'JUMLAH', key: 'c14'},
            {header: 'LOKASI', key: 'c15'},
            {header: 'KATEGORI', key: 'c16'},
            {header: 'STATUS', key: 'c17'}
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
              `Template Upload Asset.xlsx`
            );
          });
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

    addDokumen = async (values) => {
        const token = localStorage.getItem("token")
        await this.props.addDokumen(token, values)
        const {isAdd} = this.props.asset
        if (isAdd) {
            this.setState({confirm: 'add'})
            this.openConfirm()
            this.openModalAdd()
            setTimeout(() => {
                this.getDataAsset()
            }, 500)
        }
    }

    DownloadMaster = () => {
        const {link} = this.props.asset
        axios({
            url: `${link}`,
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "master dokumen.xlsx"); //or any other extension
            document.body.appendChild(link);
            link.click();
        });
    }

    prosesSync = async (val) => {
        const token = localStorage.getItem("token")
        await this.props.syncAsset(token, val.type_sync, val.no_asset, val.date1)
        this.setState({confirm: 'sync'})
        this.openConfirm()
        this.openModsync()
        this.getDataAsset()
    }

    openModsync = () => {
        this.setState({openSync: !this.state.openSync})
    }


    ExportMaster = () => {
        const token = localStorage.getItem('token')
        this.props.exportMaster(token)
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
        await this.props.uploadMasterAsset(token, data)
        this.props.resetError()
        this.setState({modalUpload: false})
        this.setState({confirm: 'upload'})
        this.openConfirm()
        this.getDataAsset()
    }

    editDokumen = async (values, id) => {
        const token = localStorage.getItem("token")
        await this.props.updateDokumen(token, id, values)
        const {isUpdate} = this.props.asset
        if (isUpdate) {
            this.setState({confirm: 'edit'})
            this.openConfirm()
            this.openModalEdit()
            setTimeout(() => {
                this.getDataAsset()
            }, 700)
        }
    }

    componentDidUpdate() {
        const {isError, isUpload, isExport, isSync} = this.props.asset
        if (isError) {
            this.props.resetError()
            this.showAlert()
        } 
        // else if (isUpload) {
        //     setTimeout(() => {
        //         this.props.resetError()
        //         this.setState({modalUpload: false})
        //      }, 2000)
        //      setTimeout(() => {
        //         this.getDataAsset()
        //      }, 2100)
        // } 
        else if (isExport) {
            this.props.resetError()
            this.DownloadMaster()
        } else if (isSync === false) {
            this.setState({confirm: 'syncfalse'})
            this.openConfirm()
            this.props.resetError()
        }
    }

    onSearch = (e) => {
        this.setState({search: e.target.value})
        if(e.key === 'Enter'){
            this.getDataAsset({limit: 10, search: this.state.search})
        }
    }

    componentDidMount() {
        this.getDataAsset()
    }

    cekDownload = () => {
        const {listAsset} = this.state
        if (listAsset.length > 0) {
            this.chooseDownload()
        } else {
            this.setState({confirm: 'failList'})
            this.openConfirm()
        }
    }

    chooseDownload = () => {
        this.setState({openChoose: !this.state.openChoose})
    }

    getDataAsset = async (value) => {
        const token = localStorage.getItem("token")
        const { page } = this.props.asset
        const search = value === undefined ? '' : this.state.search
        const limit = value === undefined ? this.state.limit : value.limit
        await this.props.getAsset(token, limit, search, page.currentPage)
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
        const {isOpen, dropOpen, dropOpenNum, detail, alert, upload, errMsg, listAsset} = this.state
        const {dataAsset, isGet, alertM, alertMsg, alertUpload, page} = this.props.asset
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
                        <h2 className={styleTrans.pageTitle}>My Asset</h2>
                        
                        <div className={styleTrans.searchContainer}>
                            <div>
                                <text>Show: </text>
                                <ButtonDropdown className={style.drop} isOpen={dropOpen} toggle={this.dropDown}>
                                <DropdownToggle caret color="light">
                                    {this.state.limit}
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem className={style.item} onClick={() => this.getDataAsset({limit: 10, search: ''})}>10</DropdownItem>
                                    <DropdownItem className={style.item} onClick={() => this.getDataAsset({limit: 20, search: ''})}>20</DropdownItem>
                                    <DropdownItem className={style.item} onClick={() => this.getDataAsset({limit: 50, search: ''})}>50</DropdownItem>
                                    <DropdownItem className={style.item} onClick={() => this.getDataAsset({limit: 100, search: ''})}>100</DropdownItem>
                                    <DropdownItem className={style.item} onClick={() => this.getDataAsset({limit: 200, search: ''})}>200</DropdownItem>
                                    <DropdownItem className={style.item} onClick={() => this.getDataAsset({limit: 500, search: ''})}>500</DropdownItem>
                                    <DropdownItem className={style.item} onClick={() => this.getDataAsset({limit: 1000, search: ''})}>1000</DropdownItem>
                                    <DropdownItem className={style.item} onClick={() => this.getDataAsset({limit: 'all', search: ''})}>All</DropdownItem>
                                </DropdownMenu>
                                </ButtonDropdown>
                            </div>
                        </div>
                        
                        <div className={styleTrans.searchContainer}>
                            <div className='rowGeneral'>
                                <Button color="success" size="lg" onClick={this.cekDownload}>Download</Button>
                                {level === '1' && (
                                    <>
                                        <Button className='ml-1' color="warning" size="lg" onClick={this.openModalUpload}>Upload</Button>
                                        <Button className='ml-1' onClick={this.openModsync} color="primary" size="lg">Synchronize</Button>
                                    </>
                                )}
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

                        <table className={`${styleTrans.table} ${dataAsset.length > 0 ? styleTrans.tableFull : ''}`}>
                            <thead>
                                <tr>
                                    <th>
                                        <input  
                                        className='mr-2'
                                        type='checkbox'
                                        checked={listAsset.length === 0 ? false : listAsset.length === dataAsset.length ? true : false}
                                        onChange={() => listAsset.length === dataAsset.length ? this.chekRej('all') : this.chekApp('all')}
                                        />
                                        {/* Select */}
                                    </th>
                                    <th>No</th>
                                    <th className='indexStat'>Qr code</th>
                                    <th>Asset</th>
                                    <th>SNo.</th>
                                    <th>Cap.Date</th>
                                    <th>Asset Description</th>
                                    <th>Acquis.val.</th>
                                    <th>Accum.dep.</th>
                                    <th>Book val.</th>
                                    <th>Plant</th>
                                    <th>Cost Ctr</th>
                                    <th>Cost Ctr Name</th>
                                    <th>MERK</th>
                                    <th>SATUAN</th>
                                    <th>JUMLAH</th>
                                    <th>LOKASI</th>
                                    <th>KATEGORI</th>
                                    <th>STATUS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataAsset.length !== 0 && dataAsset.map((item, index) => {
                                    return (
                                        <tr className={item.status === '100' ? 'yellow' : item.status === '0' && 'fail'}>
                                            <td>
                                                <input 
                                                type='checkbox'
                                                checked={listAsset.find(element => element === item.id) !== undefined ? true : false}
                                                onChange={listAsset.find(element => element === item.id) === undefined ? () => this.chekApp(item.id) : () => this.chekRej(item.id)}
                                                />
                                            </td>
                                            <td scope="row">{(dataAsset.indexOf(item) + (((page.currentPage - 1) * page.limitPerPage) + 1))}</td>
                                            <td key={item.no_asset} ref={(el) => (this.barcodeRefs[item.no_asset] = el)}>
                                                <div style={{ position: "relative", width: 192, height: 192 }}>
                                                    <QRCode value={JSON.stringify({no: item.no_asset, cost: item.cost_center})} size={192} />
                                                    <img
                                                        src={logo}
                                                        alt="logo"
                                                        style={{
                                                            position: "absolute",
                                                            top: "50%",
                                                            left: "50%",
                                                            transform: "translate(-50%, -50%)",
                                                            width: 32,
                                                            height: 32,
                                                            borderRadius: "8px",
                                                            backgroundColor: "white",
                                                            padding: "4px",
                                                        }}
                                                    />
                                                </div>
                                                {/* <Barcode 
                                                width={1}
                                                value={JSON.stringify({no: item.no_asset, cost: item.cost_center})} 
                                                displayValue={false} /> */}
                                            </td>
                                            <td>{item.no_asset}</td>
                                            <td>{item.no_doc}</td>
                                            <td>{moment(item.tanggal).format('DD/MM/YYYY')}</td>
                                            <td>{item.nama_asset}</td>
                                            <td>{item.nilai_acquis === null || item.nilai_acquis === undefined ? 0 : item.nilai_acquis.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") }</td>
                                            <td>{item.accum_dep === null || item.accum_dep === undefined ? 0 : item.accum_dep.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                            <td>{item.nilai_buku === null || item.nilai_buku === undefined ? 0 : item.nilai_buku.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                            <td>{item.kode_plant}</td>
                                            <td>{item.cost_center}</td>
                                            <td>{item.area}</td>
                                            <td>{item.merk}</td>
                                            <td>{item.satuan}</td>
                                            <td>{item.unit}</td>
                                            <td>{item.lokasi}</td>
                                            <td>{item.kategori}</td>
                                            <td>{item.status === '100' ? 'Asset belum di GR' : item.status === '0' ? 'Asset telah didisposal' : 'available'}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        {dataAsset.length === 0 && (
                            <div className={style.spinCol}>
                                <AiOutlineInbox size={50} className='mb-4' />
                                <div className='textInfo'>Data asset tidak ditemukan</div>
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
                <Modal isOpen={this.state.openChoose} toggle={this.chooseDownload} size='xl'>
                    <ModalBody>
                        <div className={styleHome.mainContent}>
                            <main className={styleHome.mainSection}>
                            <h1 className={styleHome.title}>Pilih Download Data</h1>
                            <h4 className={styleHome.subtitle}></h4>

                            <div className={`${styleHome.assetContainer} row`}>
                                <>
                                    <div 
                                    onClick={() => this.downloadData()} 
                                    className="col-12 col-md-6 col-lg-3 mb-4">
                                        <div className={styleHome.assetCard1}>
                                            <BsTable size={150} className='mt-4 mb-4' />
                                            <p className='mt-2 mb-4 sizeCh'>Download Master Data</p>
                                        </div>
                                    </div>
                                    <div 
                                    onClick={() => this.downloadBarcode()} 
                                    className="col-12 col-md-6 col-lg-3 mb-4">
                                        <div className={styleHome.assetCard1}>
                                            <BsQrCode size={150} className='mt-4 mb-4' />
                                            <p className='mt-2 mb-4 sizeCh'>Download Qr Code</p>
                                        </div>
                                    </div>
                                </>
                            </div>
                            </main>
                        </div>
                        <hr />
                        <div className='rowBetween'>
                            <div className='rowGeneral'>
                            </div>
                            <div className='rowGeneral'>
                                <Button onClick={this.chooseDownload} color='secondary'>Close</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal toggle={this.openModalAdd} isOpen={this.state.modalAdd} size="lg">
                    <ModalHeader toggle={this.openModalAdd}>Add Master Dokumen</ModalHeader>
                    <Formik
                    initialValues={{
                        nama_dokumen: "", 
                        jenis_dokumen: "",
                        divisi: "",
                    }}
                    validationSchema={dokumenSchema}
                    onSubmit={(values) => {this.addDokumen(values)}}
                    >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                    <ModalBody>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Nama Dokumen
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="textarea" 
                                name="nama_pic"
                                value={values.nama_dokumen}
                                onChange={handleChange("nama_dokumen")}
                                onBlur={handleBlur("nama_dokumen")}
                                />
                                {errors.nama_dokumen ? (
                                    <text className={style.txtError}>{errors.nama_dokumen}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Jenis Dokumen
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="select" 
                                name="select"
                                value={values.jenis_dokumen}
                                onChange={handleChange("jenis_dokumen")}
                                onBlur={handleBlur("jenis_dokumen")}
                                >
                                    <option>-Pilih Jenis Dokumen-</option>
                                    <option value="it">IT</option>
                                    <option value="non_it">Non-It</option>
                                </Input>
                                {errors.jenis_dokumen ? (
                                        <text className={style.txtError}>{errors.jenis_dokumen}</text>
                                    ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Divisi
                            </text>
                            <div className="col-md-9">
                                <Input
                                type="select" 
                                name="select"
                                value={values.divisi}
                                onChange={handleChange("divisi")}
                                onBlur={handleBlur("divisi")}
                                >
                                    <option>-Pilih Divisi-</option>
                                    <option value="all">All</option>
                                </Input>
                                {errors.divisi ? (
                                    <text className={style.txtError}>{errors.divisi}</text>
                                ) : null}
                            </div>
                        </div>
                        <hr/>
                        <div className={style.foot}>
                            <div></div>
                            <div>
                                <Button className="mr-2" onClick={handleSubmit} color="primary">Save</Button>
                                <Button className="mr-5" onClick={this.openModalAdd}>Cancel</Button>
                            </div>
                        </div>
                    </ModalBody>
                    )}
                    </Formik>
                </Modal>
                <Modal toggle={this.openModalUpload} isOpen={this.state.modalUpload} >
                    <ModalHeader>Upload Master Asset</ModalHeader>
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
                <Modal toggle={this.openModalEdit} isOpen={this.state.modalEdit} size="lg">
                    <ModalHeader toggle={this.openModalEdit}>Edit Master Dokumen</ModalHeader>
                    <Formik
                    initialValues={{
                        nama_dokumen: detail.nama_dokumen, 
                        jenis_dokumen: detail.jenis_dokumen,
                        divisi: detail.divisi,
                    }}
                    validationSchema={dokumenSchema}
                    onSubmit={(values) => {this.editDokumen(values, detail.id)}}
                    >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                    <ModalBody>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Nama Dokumen
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="textarea" 
                                name="nama_pic"
                                value={values.nama_dokumen}
                                onChange={handleChange("nama_dokumen")}
                                onBlur={handleBlur("nama_dokumen")}
                                />
                                {errors.nama_dokumen ? (
                                    <text className={style.txtError}>{errors.nama_dokumen}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Jenis Dokumen
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="select" 
                                name="select"
                                value={values.jenis_dokumen}
                                onChange={handleChange("jenis_dokumen")}
                                onBlur={handleBlur("jenis_dokumen")}
                                >
                                    <option>-Pilih Jenis Dokumen-</option>
                                    <option value="it">IT</option>
                                    <option value="non_it">Non-It</option>
                                </Input>
                                {errors.jenis_dokumen ? (
                                        <text className={style.txtError}>{errors.jenis_dokumen}</text>
                                    ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Divisi
                            </text>
                            <div className="col-md-9">
                                <Input
                                type="select" 
                                name="select"
                                value={values.divisi}
                                onChange={handleChange("divisi")}
                                onBlur={handleBlur("divisi")}
                                >
                                    <option>-Pilih Divisi-</option>
                                    <option value="all">All</option>
                                </Input>
                                {errors.divisi ? (
                                    <text className={style.txtError}>{errors.divisi}</text>
                                ) : null}
                            </div>
                        </div>
                        <hr/>
                        <div className={style.foot}>
                            <div></div>
                            <div>
                                <Button className="mr-2" onClick={handleSubmit} color="primary">Save</Button>
                                <Button className="mr-5" onClick={this.openModalEdit}>Cancel</Button>
                            </div>
                        </div>
                    </ModalBody>
                    )}
                    </Formik>
                </Modal>
                <Modal toggle={this.openModsync} isOpen={this.state.openSync} size='lg'>
                    <ModalHeader>Synchronize Data Asset</ModalHeader>
                    <Formik
                    initialValues={{
                        type_sync: '',
                        no_asset: '',
                        date1: ''
                    }}
                    validationSchema={filterSchema}
                    onSubmit={(values) => {this.prosesSync(values)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                        <ModalBody>
                            <Row className="mb-2 rowRinci">
                                <Col md={3}>Pilih Tipe Synchronize</Col>
                                <Col md={9} className="colRinci">:  <Input
                                    type="select"
                                    className="inputRinci"
                                    value={values.type_sync}
                                    onBlur={handleBlur("type_sync")}
                                    onChange={handleChange('type_sync')}
                                >
                                    <option value=''>Pilih</option>
                                    <option value="no">No Asset</option>
                                    <option value="time">Periode</option>
                                </Input>
                                </Col>
                            </Row>
                            <Row className="mb-2 rowRinci">
                                <Col md={3}>No Asset</Col>
                                <Col md={9} className="colRinci">:  <Input
                                    type="text"
                                    className="inputRinci"
                                    disabled={values.type_sync === 'no' ? false : true}
                                    value={values.no_asset}
                                    onBlur={handleBlur("no_asset")}
                                    onChange={handleChange("no_asset")}
                                />
                                </Col>
                            </Row>
                            <Row className="mb-2 rowRinci">
                                <Col md={3}>Periode</Col>
                                <Col md={9} className="colRinci">:
                                    <Input
                                        type="date"
                                        className="inputRinci"
                                        disabled={values.type_sync === 'time' ? false : true}
                                        value={values.date1}
                                        onBlur={handleBlur("date1")}
                                        onChange={handleChange("date1")}
                                    />
                                    {/* <text className='mr-1 ml-1'>To</text>
                                    <Input
                                        type="date"
                                        className="inputRinci"
                                        disabled={values.type_sync === 'time' ? false : true}
                                        value={values.date2}
                                        onBlur={handleBlur("date2")}
                                        onChange={handleChange("date2")}
                                    /> */}
                                </Col>
                            </Row>
                            <hr/>
                            <div className={style.foot}>
                                <div></div>
                                <div>
                                    <Button 
                                    disabled={
                                    // values.type_sync === 'time' && (values.date1 === '' || values.date2 === '') ? true 
                                    values.type_sync === 'time' && (values.date1 === '') ? true 
                                    : (values.type_sync === 'no' && values.no_asset === '') ? true 
                                    : values.type_sync === '' ? true
                                    : false}
                                    className="mr-2" onClick={handleSubmit} 
                                    color="primary">
                                        Synchronize
                                    </Button>
                                    <Button className="mr-3" onClick={this.openModsync}>Cancel</Button>
                                </div>
                            </div>
                        </ModalBody>
                        )}
                    </Formik>
                </Modal>
                <Modal isOpen={this.props.asset.isLoading || this.state.isLoading ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className={style.cekUpdate}>
                                <Spinner />
                                <div sucUpdate>Waiting....</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalConfirm} toggle={this.openConfirm} size="sm">
                    <ModalBody>
                        {this.state.confirm === 'edit' ? (
                        <div className={style.cekUpdate}>
                            <AiFillCheckCircle size={80} className={style.green} />
                            <div className={style.sucUpdate}>Berhasil Memperbarui Asset</div>
                        </div>
                        ) : this.state.confirm === 'add' ? (
                            <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Menambahkan Asset</div>
                            </div>
                        ) : this.state.confirm === 'upload' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Mengupload Master Asset</div>
                            </div>
                            </div>
                        ) : this.state.confirm === 'reset' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Mereset Password</div>
                            </div>
                            </div>
                        ) : this.state.confirm === 'sync' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Synchronize Data Asset</div>
                            </div>
                            </div>
                        ) : this.state.confirm === 'syncfalse' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                    <div className={[style.sucUpdate, style.green]}>Gagal Synchronize Data</div>
                                    <div className={[style.sucUpdate, style.green]}>Data Asset Tidak Ditemukan</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'failList' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                    <div className={[style.sucUpdate, style.green]}>Gagal Download</div>
                                    <div className={[style.sucUpdate, style.green]}>Ceklist Data Asset Terlebih Dahulu</div>
                                </div>
                            </div>
                        ) : (
                            <div></div>
                        )}
                    </ModalBody>
                </Modal>
            </>
        )
    }
}

const mapStateToProps = state => ({
    asset: state.asset
})

const mapDispatchToProps = {
    logout: auth.logout,
    getAsset: asset.getAsset,
    resetError: asset.resetError,
    uploadMasterAsset: asset.uploadMasterAsset,
    nextPage: asset.nextPage,
    syncAsset: asset.syncAsset
}

export default connect(mapStateToProps, mapDispatchToProps)(Asset)
