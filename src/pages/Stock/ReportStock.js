/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { Component } from 'react'
import {FaSearch, FaUserCircle, FaBars, FaCartPlus, FaTh, FaList} from 'react-icons/fa'
import {AiOutlineInbox} from 'react-icons/ai'
import style from '../../assets/css/input.module.css'
import { NavbarBrand, Input, Table, ButtonDropdown, Spinner,
 DropdownMenu, DropdownToggle, DropdownItem, Button, Modal, ModalBody} from 'reactstrap'
import MaterialTitlePanel from "../../components/material_title_panel"
import Sidebar from "../../components/Header";
import SidebarContent from "../../components/sidebar_content"
import stock from '../../redux/actions/stock'
import auth from '../../redux/actions/auth'
import depo from '../../redux/actions/depo'
import {connect} from 'react-redux'
import NavBar from '../../components/NavBar'
import ReactHtmlToExcel from "react-html-table-to-excel"
import styleTrans from '../../assets/css/transaksi.module.css'
import NewNavbar from '../../components/NewNavbar'
import moment from 'moment'
import ExcelJS from "exceljs"
import fs from "file-saver"

class ReportStock extends Component {
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
            tipe: 'report',
            group: '',
            fisik: '',
            sap: '',
            kondisi: '',
            limit: 10,
            dropOpen: false,
            nilai_buku: 0,
            accum_dep: 0,
            nilai_acquis: 0,
            drop: false,
            dropBtn: false,
            dropCond: false,
            plant: '',
            areaDrop: false,
            time: 'pilih',
            time1: moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
            // time1: moment().startOf('month').format('YYYY-MM-DD'),
            time2: moment().endOf('month').format('YYYY-MM-DD'),
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

    menuButtonClick(ev) {
        ev.preventDefault();
        this.onSetOpen(!this.state.open);
    }

    onSetOpen(open) {
        this.setState({ open });
    }

    async componentDidMount () {
        const token = localStorage.getItem("token")
        await this.props.getDepo(token, 400, '', 1)
        this.getDataStock({limit: 10, search: '', group: 'all', sap: 'all', fisik: 'all', kondisi: 'all', plant: 'all'})
    }

    dropBut = () => {
        this.setState({dropBtn: !this.state.dropBtn})
    }

    dropKondisi = () => {
        this.setState({dropCond: !this.state.dropCond})
    }

    dropOpen = () => {
        this.setState({drop: !this.state.drop})
    }

    dropDown = () => {
        this.setState({dropOpen: !this.state.dropOpen})
    }

    dropArea = () => {
        this.setState({areaDrop: !this.state.areaDrop})
    }

    getDataStock = async (value) => {
        const token = localStorage.getItem("token")
        const {time1, time2} = this.state
        const cekTime1 = time1 === '' ? 'undefined' : time1
        const cekTime2 = time2 === '' ? 'undefined' : time2
        const { pageRep } = this.props.stock
        const search = value === undefined ? '' : value.search
        const limit = value === undefined ? this.state.limit : value.limit
        const group = value === undefined ? this.state.group : value.group
        await this.props.getReportAll(token, search, limit, pageRep === undefined ? 1 : pageRep.currentPage, group, value.fisik, value.sap, value.kondisi, value.plant, cekTime1, cekTime2)
        await this.props.getStatusAll(token)
        const {dataRep} = this.props.stock
        this.setState({group: value.group, sap: value.sap, fisik: value.fisik, kondisi: value.kondisi, plant: value.plant})
        let buku = 0
        let acquis = 0
        let accum = 0
        for (let i = 0; i < dataRep.length; i++) {
            if (dataRep[i].dataAsset !== null) {
                buku += parseInt(dataRep[i].dataAsset.nilai_buku)
                acquis += parseInt(dataRep[i].dataAsset.nilai_acquis)
                accum += parseInt(dataRep[i].dataAsset.accum_dep)
            }
        }
        this.setState({limit: value === undefined ? 10 : value.limit, nilai_buku: buku, nilai_acquis: acquis, accum_dep: accum})
    }

    downloadReport = async (val) => {
        const { dataRep, pageRep, dataAll } = this.props.stock
        const dataDownload = dataRep

        const workbook = new ExcelJS.Workbook();
        const ws = workbook.addWorksheet('report stock opname')

        // await ws.protect('F1n4NcePm4')

        const borderStyles = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
        }


        ws.columns = [
            {header: 'No', key: 'c1'},
            {header: 'ASSET', key: 'c2'},
            {header: 'DESKRIPSI', key: 'c3'},
            {header: 'MERK', key: 'c4'},
            {header: 'PLANT', key: 'c5'},
            {header: 'COST CENTER', key: 'c6'},
            {header: 'AREA', key: 'c7'},
            {header: 'SATUAN', key: 'c8'},
            {header: 'UNIT', key: 'c9'},
            {header: 'LOKASI', key: 'c10'},
            {header: 'STATUS SAP', key: 'c11'},
            {header: 'STATUS FISIK', key: 'c12'},
            {header: 'KONDISI', key: 'c13'},
            {header: 'GROUPING', key: 'c14'},
            {header: 'ACQUIS VAL', key: 'c15'},
            {header: 'ACCUM DEP', key: 'c16'},
            {header: 'BOOK VAL', key: 'c17'},
            {header: 'KETERANGAN', key: 'c18'}
        ]

        dataDownload.map((item, index) => { return ( ws.addRow(
            {
                c1: index + 1,
                c2: item.no_asset,
                c3: item.deskripsi,
                c4: item.merk,
                c5: item.kode_plant,
                c6: item.depo.cost_center,
                c7: item.depo.nama_area,
                c8: item.satuan,
                c9: item.unit,
                c10: item.lokasi,
                c11: item.no_asset === null ? 'TIDAK ADA' : 'ADA',
                c12: item.status_fisik,
                c13: item.kondisi,
                c14: item.grouping,
                c15: item.dataAsset === null ? '-' : item.dataAsset.nilai_acquis,
                c16: item.dataAsset === null ? '-' : item.dataAsset.accum_dep,
                c17: item.dataAsset === null ? '-' : item.dataAsset.nilai_buku,
                c18: item.keterangan
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
              `Report Stock Opname ${moment().format('DD MMMM YYYY')}.xlsx`
            );
          });
    }

    render() {
        const { dataDepo } = this.props.depo
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const { dataRep, pageRep, dataAll } = this.props.stock

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
                            <div className={style.bodyDashboard}>
                                <div className={style.headMaster}>
                                    <div className={style.titleDashboard}>Report Stock Opname</div>
                                </div>
                                <div className={style.secEmail}>
                                    <div className='mt-4'>
                                        <div className={style.secHeadDashboard2}>
                                            <div>
                                                <text>Status Fisik: </text>
                                                <ButtonDropdown className={style.drop} isOpen={this.state.drop} toggle={this.dropOpen}>
                                                <DropdownToggle caret color="light">
                                                    {this.state.fisik === '' ? 'Pilih status fisik' : this.state.fisik}
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    <DropdownItem className={style.item} onClick={() => this.getDataStock({limit: 10, search: '', group: this.state.group, sap: this.state.sap, fisik: 'all', kondisi: this.state.kondisi, plant: this.state.plant})}>All</DropdownItem>
                                                    <DropdownItem className={style.item} onClick={() => this.getDataStock({limit: 10, search: '', group: this.state.group, sap: this.state.sap, fisik: 'ada', kondisi: this.state.kondisi, plant: this.state.plant})}>Ada</DropdownItem>
                                                    <DropdownItem className={style.item} onClick={() => this.getDataStock({limit: 10, search: '', group: this.state.group, sap: this.state.sap, fisik: 'tidak ada', kondisi: this.state.kondisi, plant: this.state.plant})}>Tidak Ada</DropdownItem>
                                                </DropdownMenu>
                                                </ButtonDropdown>
                                            </div>
                                            <div className='ml-3' >
                                                <text>Kondisi: </text>
                                                <ButtonDropdown className={style.drop} isOpen={this.state.dropCond} toggle={this.dropKondisi}>
                                                <DropdownToggle caret color="light">
                                                    {this.state.kondisi === '' ? 'Pilih status fisik' : this.state.kondisi}
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    <DropdownItem className={style.item} onClick={() => this.getDataStock({limit: 10, search: '', group: this.state.group, sap: this.state.sap, fisik: this.state.fisik, kondisi: 'all', plant: this.state.plant})}>All</DropdownItem>
                                                    <DropdownItem className={style.item} onClick={() => this.getDataStock({limit: 10, search: '', group: this.state.group, sap: this.state.sap, fisik: this.state.fisik, kondisi: '', plant: this.state.plant})}>-</DropdownItem>
                                                    <DropdownItem className={style.item} onClick={() => this.getDataStock({limit: 10, search: '', group: this.state.group, sap: this.state.sap, fisik: this.state.fisik, kondisi: 'baik', plant: this.state.plant})}>Baik</DropdownItem>
                                                    <DropdownItem className={style.item} onClick={() => this.getDataStock({limit: 10, search: '', group: this.state.group, sap: this.state.sap, fisik: this.state.fisik, kondisi: 'rusak', plant: this.state.plant})}>Rusak</DropdownItem>
                                                </DropdownMenu>
                                                </ButtonDropdown>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={style.searchEmail}>
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
                                <div className='sec2Head'>
                                    <div className={style.secHeadDashboard2}>
                                        <div className='' >
                                            <text>Status SAP: </text>
                                            <ButtonDropdown className={style.drop} isOpen={this.state.dropBtn} toggle={this.dropBut}>
                                            <DropdownToggle caret color="light">
                                                {this.state.sap === '' ? 'Pilih status sap' : this.state.sap === 'null' ? 'Tidak ada' : this.state.sap}
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem className={style.item} onClick={() => this.getDataStock({limit: 10, search: '', group: this.state.group, sap: 'all', fisik: this.state.fisik, kondisi: this.state.kondisi, plant: this.state.plant})}>All</DropdownItem>
                                                <DropdownItem className={style.item} onClick={() => this.getDataStock({limit: 10, search: '', group: this.state.group, sap: 'ada', fisik: this.state.fisik, kondisi: this.state.kondisi, plant: this.state.plant})}>Ada</DropdownItem>
                                                <DropdownItem className={style.item} onClick={() => this.getDataStock({limit: 10, search: '', group: this.state.group, sap: 'null', fisik: this.state.fisik, kondisi: this.state.kondisi, plant: this.state.plant})}>Tidak Ada</DropdownItem>
                                            </DropdownMenu>
                                            </ButtonDropdown>
                                        </div>
                                        <div className='ml-3'>
                                            <text>Status Aset: </text>
                                            <ButtonDropdown className={style.drop} isOpen={this.state.dropOpen} toggle={this.dropDown}>
                                            <DropdownToggle caret color="light">
                                                {this.state.group === '' ? 'Pilih status aset' :  this.state.group}
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem className={style.item} onClick={() => this.getDataStock({limit: 10, search: '', group: 'all', sap: this.state.sap, fisik: this.state.fisik, kondisi: this.state.kondisi, plant: this.state.plant})}>All</DropdownItem>
                                                {dataAll.length !== 0 && dataAll.map(item => {
                                                    return (
                                                        <DropdownItem className={style.item} onClick={() => this.getDataStock({limit: 10, search: '', group: item.status, sap: this.state.sap, fisik: this.state.fisik, kondisi: this.state.kondisi, plant: this.state.plant})}>{item.status}</DropdownItem>
                                                    )
                                                })}
                                            </DropdownMenu>
                                            </ButtonDropdown>
                                        </div>
                                    </div>
                                    <div className='ml-3'>
                                        <text>Area: </text>
                                        <ButtonDropdown className={style.drop} isOpen={this.state.areaDrop} toggle={this.dropArea}>
                                        <DropdownToggle caret color="light">
                                            {this.state.plant === '' ? 'Pilih Area' :  this.state.plant}
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem className={style.item} onClick={() => this.getDataStock({limit: 10, search: '', group: this.state.group, sap: this.state.sap, fisik: this.state.fisik, kondisi: this.state.kondisi, plant: 'all'})}>All</DropdownItem>
                                            {dataDepo.length !== 0 && dataDepo.map(item => {
                                                return (
                                                    <DropdownItem className={style.item} onClick={() => this.getDataStock({limit: 10, search: '', group: this.state.group, sap: this.state.sap, fisik: this.state.fisik, kondisi: this.state.kondisi, plant: item.kode_plant})}>{item.nama_area}</DropdownItem>
                                                )
                                            })}
                                        </DropdownMenu>
                                        </ButtonDropdown>
                                    </div>
                                </div>
                                <div className={style.tableDashboard}>
                                    {this.state.tipe === 'report' ? (
                                        <Table bordered responsive hover className={style.tab} id="table-to-xls">
                                            <thead>
                                                <tr>
                                                    <th>No</th>
                                                    <th>ASSET</th>
                                                    <th>DESKRIPSI</th>
                                                    <th>MERK</th>
                                                    <th>PLANT</th>
                                                    <th>COST CENTER</th>
                                                    <th>AREA</th>
                                                    <th>SATUAN</th>
                                                    <th>UNIT</th>
                                                    <th>LOKASI</th>
                                                    <th>STATUS SAP</th>
                                                    <th>STATUS FISIK</th>
                                                    <th>KONDISI</th>
                                                    <th>GROUPING</th>
                                                    <th>ACQUIS VAL</th>
                                                    <th>ACCUM DEP</th>
                                                    <th>BOOK VAL</th>
                                                    <th>KETERANGAN</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dataRep.length !== 0 && dataRep.map(item => {
                                                    return (
                                                    <tr>
                                                        <th scope="row">{(dataRep.indexOf(item) + (((pageRep.currentPage - 1) * pageRep.limitPerPage) + 1))}</th>
                                                        <td>{item.no_asset}</td>
                                                        <td>{item.deskripsi}</td>
                                                        <td>{item.merk}</td>
                                                        <td>{item.kode_plant}</td>
                                                        <td>{item.depo.cost_center}</td>
                                                        <td>{item.depo.nama_area}</td>
                                                        <td>{item.satuan}</td>
                                                        <td>{item.unit}</td>
                                                        <td>{item.lokasi}</td>
                                                        <td>{item.no_asset === null ? 'TIDAK ADA' : 'ADA'}</td>
                                                        <td style={{textTransform: 'uppercase'}}>{item.status_fisik}</td>
                                                        <td style={{textTransform: 'uppercase'}}>{item.kondisi}</td>
                                                        <td>{item.grouping}</td>
                                                        <td>{item.dataAsset === null ? '-' : item.dataAsset.nilai_acquis}</td>
                                                        <td>{item.dataAsset === null ? '-' : item.dataAsset.accum_dep}</td>
                                                        <td>{item.dataAsset === null ? '-' : item.dataAsset.nilai_buku}</td>
                                                        <td>{item.keterangan}</td>
                                                    </tr>
                                                    )})}
                                                    <tr>
                                                        <td colSpan={12} style={{textAlign: "center", fontSize: 'medium'}}>Jumlah</td>
                                                        <td>{this.state.nilai_acquis}</td>
                                                        <td>{this.state.accum_dep}</td>
                                                        <td>{this.state.nilai_buku}</td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                    </tr>
                                            </tbody>
                                        </Table>
                                    ) : (
                                        <Table bordered responsive hover className={style.tab}>
                                            <thead>
                                                <tr>
                                                    <th>No</th>
                                                    <th>Rekapitulasi</th>
                                                    <th>Acquis.val.</th>
                                                    <th>Accum.dep.</th>
                                                    <th>Book val.</th>
                                                    <th>Eksekusi</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                    <tr>
                                                        <th scope="row">1</th>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                    </tr>
                                            </tbody>
                                        </Table>
                                    )}
                                </div>
                            </div>
                            <div className="mb-3">
                                <div className={style.infoPageEmail}>
                                    <ReactHtmlToExcel
                                        id="test-table-xls-button"
                                        className="btn btn-success"
                                        table="table-to-xls"
                                        filename="Report Stock Opname"
                                        sheet="Report"
                                        buttonText="Download"
                                    />
                                    <div className={style.pageButton}>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </MaterialTitlePanel>
                </Sidebar> */}
                <div className={styleTrans.app}>
                    <NewNavbar handleSidebar={this.prosesSidebar} handleRoute={this.goRoute} />

                    <div className={`${styleTrans.mainContent} ${this.state.sidebarOpen ? styleTrans.collapsedContent : ''}`}>
                        <h2 className={styleTrans.pageTitle}>Report Stock Opname</h2>
                        <div className='mb-4'></div>
                        <div className={styleTrans.searchContainer}>
                            <div className='rowGeneral'>
                                <div>
                                    <text>Status Fisik: </text>
                                    <ButtonDropdown className={style.drop} isOpen={this.state.drop} toggle={this.dropOpen}>
                                    <DropdownToggle caret color="light">
                                        {this.state.fisik === '' ? 'Pilih status fisik' : this.state.fisik}
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem className={style.item} onClick={() => this.getDataStock({limit: 10, search: '', group: this.state.group, sap: this.state.sap, fisik: 'all', kondisi: this.state.kondisi, plant: this.state.plant})}>All</DropdownItem>
                                        <DropdownItem className={style.item} onClick={() => this.getDataStock({limit: 10, search: '', group: this.state.group, sap: this.state.sap, fisik: 'ada', kondisi: this.state.kondisi, plant: this.state.plant})}>Ada</DropdownItem>
                                        <DropdownItem className={style.item} onClick={() => this.getDataStock({limit: 10, search: '', group: this.state.group, sap: this.state.sap, fisik: 'tidak ada', kondisi: this.state.kondisi, plant: this.state.plant})}>Tidak Ada</DropdownItem>
                                    </DropdownMenu>
                                    </ButtonDropdown>
                                </div>
                                <div className='ml-3' >
                                    <text>Kondisi: </text>
                                    <ButtonDropdown className={style.drop} isOpen={this.state.dropCond} toggle={this.dropKondisi}>
                                    <DropdownToggle caret color="light">
                                        {this.state.kondisi === '' ? 'Pilih status fisik' : this.state.kondisi}
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem className={style.item} onClick={() => this.getDataStock({limit: 10, search: '', group: this.state.group, sap: this.state.sap, fisik: this.state.fisik, kondisi: 'all', plant: this.state.plant})}>All</DropdownItem>
                                        <DropdownItem className={style.item} onClick={() => this.getDataStock({limit: 10, search: '', group: this.state.group, sap: this.state.sap, fisik: this.state.fisik, kondisi: '', plant: this.state.plant})}>-</DropdownItem>
                                        <DropdownItem className={style.item} onClick={() => this.getDataStock({limit: 10, search: '', group: this.state.group, sap: this.state.sap, fisik: this.state.fisik, kondisi: 'baik', plant: this.state.plant})}>Baik</DropdownItem>
                                        <DropdownItem className={style.item} onClick={() => this.getDataStock({limit: 10, search: '', group: this.state.group, sap: this.state.sap, fisik: this.state.fisik, kondisi: 'rusak', plant: this.state.plant})}>Rusak</DropdownItem>
                                    </DropdownMenu>
                                    </ButtonDropdown>
                                </div>
                            </div>
                            <div>
                                <Button color='success' size='lg' onClick={this.downloadReport}>
                                    Download
                                </Button>
                            </div>
                        </div>
                        <div className={styleTrans.searchContainer}>
                            <div className='rowGeneral'>
                                <div className='' >
                                    <text>Status SAP: </text>
                                    <ButtonDropdown className={style.drop} isOpen={this.state.dropBtn} toggle={this.dropBut}>
                                    <DropdownToggle caret color="light">
                                        {this.state.sap === '' ? 'Pilih status sap' : this.state.sap === 'null' ? 'Tidak ada' : this.state.sap}
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem className={style.item} onClick={() => this.getDataStock({limit: 10, search: '', group: this.state.group, sap: 'all', fisik: this.state.fisik, kondisi: this.state.kondisi, plant: this.state.plant})}>All</DropdownItem>
                                        <DropdownItem className={style.item} onClick={() => this.getDataStock({limit: 10, search: '', group: this.state.group, sap: 'ada', fisik: this.state.fisik, kondisi: this.state.kondisi, plant: this.state.plant})}>Ada</DropdownItem>
                                        <DropdownItem className={style.item} onClick={() => this.getDataStock({limit: 10, search: '', group: this.state.group, sap: 'null', fisik: this.state.fisik, kondisi: this.state.kondisi, plant: this.state.plant})}>Tidak Ada</DropdownItem>
                                    </DropdownMenu>
                                    </ButtonDropdown>
                                </div>
                                <div className='ml-3'>
                                    <text>Status Aset: </text>
                                    <ButtonDropdown className={style.drop} isOpen={this.state.dropOpen} toggle={this.dropDown}>
                                    <DropdownToggle caret color="light">
                                        {this.state.group === '' ? 'Pilih status aset' :  this.state.group}
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem className={style.item} onClick={() => this.getDataStock({limit: 10, search: '', group: 'all', sap: this.state.sap, fisik: this.state.fisik, kondisi: this.state.kondisi, plant: this.state.plant})}>All</DropdownItem>
                                        {dataAll.length !== 0 && dataAll.map(item => {
                                            return (
                                                <DropdownItem className={style.item} onClick={() => this.getDataStock({limit: 10, search: '', group: item.status, sap: this.state.sap, fisik: this.state.fisik, kondisi: this.state.kondisi, plant: this.state.plant})}>{item.status}</DropdownItem>
                                            )
                                        })}
                                    </DropdownMenu>
                                    </ButtonDropdown>
                                </div>
                            </div>
                            <select value={this.state.filter} onChange={e => this.changeFilter(e.target.value)} className={styleTrans.searchInput}>
                                <option value="all">All</option>
                                <option value="available">Available To Approve</option>
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

                        <table className={`${styleTrans.table} ${dataRep.length > 0 ? styleTrans.tableFull : ''}`}>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>ASSET</th>
                                    <th>DESKRIPSI</th>
                                    <th>MERK</th>
                                    <th>PLANT</th>
                                    <th>COST CENTER</th>
                                    <th>AREA</th>
                                    <th>SATUAN</th>
                                    <th>UNIT</th>
                                    <th>LOKASI</th>
                                    <th>STATUS SAP</th>
                                    <th>STATUS FISIK</th>
                                    <th>KONDISI</th>
                                    <th>GROUPING</th>
                                    <th>ACQUIS VAL</th>
                                    <th>ACCUM DEP</th>
                                    <th>BOOK VAL</th>
                                    <th>KETERANGAN</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataRep.length > 0 && dataRep.map(item => {
                                    return (
                                        <tr className={item.status_form === '0' ? 'fail' : item.status_reject === 0 ? 'note' : item.status_reject === 1 && 'bad'}>
                                            <td scope="row">{(dataRep.indexOf(item) + (((pageRep.currentPage - 1) * pageRep.limitPerPage) + 1))}</td>
                                            <td>{item.no_asset}</td>
                                            <td>{item.deskripsi}</td>
                                            <td>{item.merk}</td>
                                            <td>{item.kode_plant}</td>
                                            <td>{item.depo.cost_center}</td>
                                            <td>{item.depo.nama_area}</td>
                                            <td>{item.satuan}</td>
                                            <td>{item.unit}</td>
                                            <td>{item.lokasi}</td>
                                            <td>{item.no_asset === null ? 'TIDAK ADA' : 'ADA'}</td>
                                            <td style={{textTransform: 'uppercase'}}>{item.status_fisik}</td>
                                            <td style={{textTransform: 'uppercase'}}>{item.kondisi}</td>
                                            <td>{item.grouping}</td>
                                            <td>{item.dataAsset === null ? '-' : item.dataAsset.nilai_acquis}</td>
                                            <td>{item.dataAsset === null ? '-' : item.dataAsset.accum_dep}</td>
                                            <td>{item.dataAsset === null ? '-' : item.dataAsset.nilai_buku}</td>
                                            <td>{item.keterangan}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        {dataRep.length === 0 && (
                            <div className={style.spinCol}>
                                <AiOutlineInbox size={50} className='secondary mb-4' />
                                <div className='textInfo'>Data ajuan tidak ditemukan</div>
                            </div>
                        )}
                    </div>
                </div>
                <Modal isOpen={this.props.stock.isLoading || this.props.depo.isLoading ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className={style.cekUpdate}>
                                <Spinner />
                                <div sucUpdate>Waiting....</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
            </>
        )
    }
}

const mapStateToProps = state => ({
    stock: state.stock,
    depo: state.depo
})

const mapDispatchToProps = {
    logout: auth.logout,
    getReportAll: stock.getReportAll,
    getStatusAll: stock.getStatusAll,
    getDepo: depo.getDepo,
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportStock)
