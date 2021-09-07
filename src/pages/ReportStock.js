/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { Component } from 'react'
import {FaSearch, FaUserCircle, FaBars, FaCartPlus, FaTh, FaList} from 'react-icons/fa'
import style from '../assets/css/input.module.css'
import { NavbarBrand, Input, Table } from 'reactstrap'
import MaterialTitlePanel from "../components/material_title_panel"
import Sidebar from "../components/Header";
import SidebarContent from "../components/sidebar_content"

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

    render() {
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
                                    <div></div>
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
                                </div>
                            </div>
                        </div>
                    </MaterialTitlePanel>
                </Sidebar>
            </>
        )
    }
}

export default ReportStock
