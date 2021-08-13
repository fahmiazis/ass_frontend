/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { Component } from 'react'
import { FaUserCircle, FaBars, FaSearch, FaCartPlus } from 'react-icons/fa'
import style from '../assets/css/input.module.css'
import {NavbarBrand, Row, Col, Button, Input} from 'reactstrap'
import SidebarContent from "../components/sidebar_content"
import Sidebar from "../components/Header"
import MaterialTitlePanel from "../components/material_title_panel"
import auth from '../redux/actions/auth'
import asset from '../redux/actions/asset'
import {connect} from 'react-redux'
import placeholder from  "../assets/img/placeholder.png"
const {REACT_APP_BACKEND_URL} = process.env

class Mutasi extends Component {

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
            limit: 12
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

    componentDidMount() {
        const level = localStorage.getItem('level')
        if (level === "5" ) {
            this.getDataAsset()
        } else {
            console.log('nanti dulu')
        }
    }

    getDataAsset = async (value) => {
        const token = localStorage.getItem("token")
        const { page } = this.props.asset
        const search = value === undefined ? '' : this.state.search
        const limit = value === undefined ? this.state.limit : value.limit
        await this.props.getAsset(token, limit, search, page.currentPage)
        this.setState({limit: value === undefined ? 12 : value.limit})
    }

    render() {
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')

        const {dataAsset} = this.props.asset

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
                                        <div className={style.titleDashboard}>Mutasi Asset</div>
                                    </div>
                                    <div className={style.secEmail}>
                                    {level === '5' ? (
                                        <div className={style.headEmail}>
                                            <button onClick={this.goCartDispos} className="btnGoCart"><FaCartPlus size={60} className="green ml-2" /></button>
                                        </div>
                                    ) : (
                                        <div className={style.headEmail}>
                                            <Button onClick={this.goSetDispos} color="info" size="lg" className="btnGoCart">Submit</Button>
                                        </div>
                                    )}
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
                                {level === '5' ? (
                                    this.props.asset.isGet === false ? (
                                        <div></div>
                                    ) : (
                                        <Row className="bodyDispos">
                                        {dataAsset.length !== 0 && dataAsset.map(item => {
                                            return (
                                                <div className="bodyCard">
                                                    <button className="btnDispos" disabled={item.status === '1' ? true : false} onClick={() => this.openModalRinci(this.setState({dataRinci: item, img: item.pict.length > 0 ? item.pict[0].path : ''}))}>
                                                        <img src={item.pict.length > 0 ? `${REACT_APP_BACKEND_URL}/${item.pict[0].path}` : placeholder} className="imgCard" />
                                                        <div className="txtDoc mb-2">
                                                            {item.nama_asset}
                                                        </div>
                                                        <Row className="mb-2">
                                                            <Col md={4}>
                                                            No Asset
                                                            </Col>
                                                            <Col md={8} className="txtDoc">
                                                            : {item.no_asset}
                                                            </Col>
                                                        </Row>
                                                        <Row className="mb-2">
                                                            <Col md={4}>
                                                            No Doc
                                                            </Col>
                                                            <Col md={8} className="txtDoc">
                                                            : {item.no_doc}
                                                            </Col>
                                                        </Row>
                                                    </button>
                                                    {item.status === '1' ? (
                                                        <Row className="footCard">
                                                            <Col md={12} xl={12}>
                                                                <Button disabled className="btnSell" color="secondary">On Proses Disposal</Button>
                                                            </Col>
                                                        </Row>
                                                    ) : item.status === '11' ? (
                                                        <Row className="footCard">
                                                            <Col md={12} xl={12}>
                                                                <Button disabled className="btnSell" color="secondary">On Proses Mutasi</Button>
                                                            </Col>
                                                        </Row>
                                                    ) : (
                                                        <Row className="footCard">
                                                            <Col md={12} xl={12}>
                                                                <Button className="btnSell" color="primary">Mutasi</Button>
                                                            </Col>
                                                        </Row>
                                                    )}
                                                </div>
                                            )
                                        })}
                                        </Row>
                                    )
                                ) : (
                                    <div></div>
                                )}
                            </div>
                        </div>
                    </MaterialTitlePanel>
                </Sidebar>
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
    nextPage: asset.nextPage
}

export default connect(mapStateToProps, mapDispatchToProps)(Mutasi)
