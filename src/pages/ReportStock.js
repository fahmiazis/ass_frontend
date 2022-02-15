/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { Component } from 'react'
import {FaSearch, FaUserCircle, FaBars, FaCartPlus, FaTh, FaList} from 'react-icons/fa'
import style from '../assets/css/input.module.css'
import { NavbarBrand, Input, Table, ButtonDropdown,
 DropdownMenu, DropdownToggle, DropdownItem, Button} from 'reactstrap'
import MaterialTitlePanel from "../components/material_title_panel"
import Sidebar from "../components/Header";
import SidebarContent from "../components/sidebar_content"
import stock from '../redux/actions/stock'
import auth from '../redux/actions/auth'
import {connect} from 'react-redux'

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
            limit: 10,
            dropOpen: false
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
    }

    menuButtonClick(ev) {
        ev.preventDefault();
        this.onSetOpen(!this.state.open);
    }

    onSetOpen(open) {
        this.setState({ open });
    }

    componentDidMount () {
        this.getDataStock()
    }

    dropDown = () => {
        this.setState({dropOpen: !this.state.dropOpen})
    }

    getDataStock = async (value) => {
        const token = localStorage.getItem("token")
        const { pageRep } = this.props.stock
        const search = value === undefined ? '' : value.search
        const limit = value === undefined ? this.state.limit : value.limit
        const group = value === undefined ? this.state.group : value.group
        await this.props.getReportAll(token, search, limit, pageRep === undefined ? 1 : pageRep.currentPage, group)
        await this.props.getStatusAll(token)
        this.setState({limit: value === undefined ? 10 : value.limit})
    }

    render() {
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
                <div className={style.divLogo}>
                    <marquee className={style.marquee}>
                        <span>WEB ASSET</span>
                    </marquee>
                    <div className={style.textLogo}>
                        <FaUserCircle size={24} className="mr-2" />
                        <text className="mr-3">{level === '1' ? 'Super admin' : names }</text>
                    </div>
                </div>
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
                <Sidebar {...sidebarProps}>
                    <MaterialTitlePanel title={contentHeader}>
                        <div className={style.backgroundLogo}>
                            <div className={style.bodyDashboard}>
                                <div className={style.headMaster}>
                                    <div className={style.titleDashboard}>Report Stock Opname</div>
                                </div>
                                <div className={style.secEmail}>
                                    <div>
                                        <div className={style.secHeadDashboard}>
                                            <div>
                                            <text>Status Aset: </text>
                                            <ButtonDropdown className={style.drop} isOpen={this.state.dropOpen} toggle={this.dropDown}>
                                            <DropdownToggle caret color="light">
                                                Pilih status aset
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem className={style.item} onClick={() => this.getDataStock({limit: 10, search: '', group: ''})}>All</DropdownItem>
                                                {dataAll.length !== 0 && dataAll.map(item => {
                                                    return (
                                                        <DropdownItem className={style.item} onClick={() => this.getDataStock({limit: 10, search: '', group: item.status})}>{item.status}</DropdownItem>
                                                    )
                                                })}
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
                                <div className={style.tableDashboard}>
                                    {this.state.tipe === 'report' ? (
                                        <Table bordered responsive hover className={style.tab}>
                                            <thead>
                                                <tr>
                                                    <th>No</th>
                                                    <th>NO. ASET</th>
                                                    <th>DESKRIPSI</th>
                                                    <th>MERK</th>
                                                    <th>KODE PLANT</th>
                                                    <th>SATUAN</th>
                                                    <th>UNIT</th>
                                                    <th>KONDISI</th>
                                                    <th>LOKASI</th>
                                                    <th>STATUS ASET</th>
                                                    <th>KETERANGAN</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dataRep.length !== 0 && dataRep.map(item => {
                                                    return (
                                                    <tr onClick={() => this.openModalEdit(this.setState({dataRinci: item}))}>
                                                        <th scope="row">{(dataRep.indexOf(item) + (((pageRep.currentPage - 1) * pageRep.limitPerPage) + 1))}</th>
                                                        <td>{item.no_asset}</td>
                                                        <td>{item.deskripsi}</td>
                                                        <td>{item.merk}</td>
                                                        <td>{item.kode_plant}</td>
                                                        <td>{item.satuan}</td>
                                                        <td>{item.unit}</td>
                                                        <td>{item.kondisi}</td>
                                                        <td>{item.lokasi}</td>
                                                        <td>{item.grouping}</td>
                                                        <td>{item.keterangan}</td>
                                                    </tr>
                                                    )})}
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
                                    <Button color="success">Download</Button>
                                    <div className={style.pageButton}>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </MaterialTitlePanel>
                </Sidebar>
            </>
        )
    }
}

const mapStateToProps = state => ({
    stock: state.stock
})

const mapDispatchToProps = {
    logout: auth.logout,
    getReportAll: stock.getReportAll,
    getStatusAll: stock.getStatusAll
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportStock)
