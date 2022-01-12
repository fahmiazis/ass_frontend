/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { Component } from 'react'
import { FaUserCircle, FaBars, FaTrash } from 'react-icons/fa'
import style from '../assets/css/input.module.css'
import {NavbarBrand, Row, Col, Button, Input, Modal, ModalBody, ModalHeader, Spinner} from 'reactstrap'
import SidebarContent from "../components/sidebar_content"
import Sidebar from "../components/Header"
import MaterialTitlePanel from "../components/material_title_panel"
import mutasi from '../redux/actions/mutasi'
import auth from '../redux/actions/auth'
import {connect} from 'react-redux'
import placeholder from  "../assets/img/placeholder.png"
const {REACT_APP_BACKEND_URL} = process.env

class CartMutasi extends Component {
    
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
            dataRinci: {},
            rinci: false,
            img: '',
            agree: false,
            alasan: ''
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

    submitMut = async () => {
        const token = localStorage.getItem('token')
        const data = {
            alasan: this.state.alasan
        }
        await this.props.submitMutasi(token, data)
        this.getDataApprove()
        this.getDataMutasi()
        this.openAgree()
    }

    componentDidMount() {
        this.getDataMutasi()
    }

    inputAlasan = e => {
        this.setState({alasan: e.target.value})
    }

    openAgree = () => {
        this.setState({agree: !this.state.agree})
    }

    getDataMutasi = async () => {
        const token = localStorage.getItem('token')
        await this.props.getMutasi(token)
    }

    deleteItem = async (val) => {
        const token = localStorage.getItem('token')
        await this.props.deleteMutasi(token, val)
        this.getDataMutasi()
    }

    getDataApprove = async () => {
        const { nomor_mutasi } = this.props.mutasi
        const token = localStorage.getItem('token')
        await this.props.getApproveMut(token, nomor_mutasi, 'Mutasi')
    }

    prosesRinci = () => {
        this.setState({rinci: !this.state.rinci})
    }

    render() {
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const {dataMut} = this.props.mutasi
        const {dataRinci} = this.state

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
                                    <div className={style.titleDashboard1}>Cart Mutasi</div>
                                </div>
                                <Row className="cartDisposal">
                                    {dataMut.length === 0 ? (
                                        <Col md={8} xl={8} sm={12}>
                                            <div className="txtDisposEmpty">Mutasi Data is empty</div>
                                        </Col>
                                    ) : (
                                        <Col md={8} xl={8} sm={12} className="mb-5 mt-5">
                                        {dataMut.length !== 0 && dataMut.map(item => {
                                            return (
                                                <div className="cart">
                                                    <div className="navCart">
                                                        <img src={item.pict.length > 0 ? `${REACT_APP_BACKEND_URL}/${item.pict[item.pict.length - 1].path}` : placeholder} className="cartImg" />
                                                        <Button className="labelBut" color="danger" size="sm">Mutasi</Button>
                                                        <div className="txtCart">
                                                            <div>
                                                                <div className="nameCart">{item.nama_asset}</div>
                                                                <div className="noCart">No asset {item.no_asset}</div>
                                                            </div>
                                                            <Button color="primary" onClick={() => this.prosesRinci(this.setState({dataRinci: item, img: item.pict.length > 0 ? item.pict[item.pict.length - 1].path : ''}))}>Rincian</Button>
                                                        </div>
                                                    </div>
                                                    <div className="footCart">
                                                        <div><FaTrash size={20} onClick={() => this.deleteItem(item.id)} className="txtError"/></div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </Col>
                                    )}
                                    <Col md={4} xl={4} sm={12} className="mt-5">
                                        <div className="sideSum">
                                            <div className="titSum">Mutasi summary</div>
                                            <div className="txtSum">
                                                <div className="totalSum">Total Item</div>
                                                <div className="angkaSum">{dataMut.length}</div>
                                            </div>
                                            <button className="btnSum" disabled={dataMut.length === 0 ? true : false } onClick={() => this.openAgree()}>Submit</button>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </MaterialTitlePanel>
                </Sidebar>
                <Modal isOpen={this.state.rinci} toggle={this.prosesRinci} size="xl">
                    <ModalHeader>
                        Rincian Mutasi
                    </ModalHeader>
                    <ModalBody>
                        <div className="mainRinci">
                            <div className="leftRinci">
                            <img src={this.state.img === '' ? placeholder : `${REACT_APP_BACKEND_URL}/${this.state.img}`} className="imgRinci" />
                                <div className="secImgSmall">
                                    {dataRinci.pict !== undefined ? (
                                        dataRinci.pict.length > 0 ? (
                                            dataRinci.pict.map(item => {
                                                return (
                                                    <button className="btnSmallImg" onClick={() => this.setState({img: item.path})}>
                                                        <img src={`${REACT_APP_BACKEND_URL}/${item.path}`} className="imgSmallRinci" />
                                                    </button>
                                                )
                                            })
                                        ) : (
                                            <button className="btnSmallImg">
                                                <img src={placeholder} className="imgSmallRinci" />
                                            </button>
                                        ) 
                                    ) : (
                                        <button className="btnSmallImg">
                                            <img src={placeholder} className="imgSmallRinci" />
                                        </button>
                                    )
                                    }
                                </div>
                            </div>
                                <div className="rightRinci">
                                    <div>
                                        <div className="titRinci">{dataRinci.nama_asset}</div>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>No Asset</Col>
                                            <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.no_asset} disabled /></Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Merk / Type</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                type= "text" 
                                                className="inputRinci"
                                                value={dataRinci.merk === null ? '-' : dataRinci.merk}
                                                disabled
                                                />
                                            </Col>
                                        </Row>
                                        <Row className="mb-2">
                                            <Col md={3}>Kategori</Col>
                                            <Col md={9} className="katCheck">: 
                                                <div className="katCheck">
                                                <div className="ml-2"><input type="checkbox" checked={dataRinci.kategori === 'IT' ? true : false}/> IT</div>
                                                    <div className="ml-3"><input type="checkbox" checked={dataRinci.kategori === 'NON IT' ? true : false}/> Non IT</div>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Cost Center</Col>
                                            <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.cost_center} disabled /></Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Keterangan</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                className="inputRinci" 
                                                type="text" 
                                                value={'-'} 
                                                disabled
                                                />
                                            </Col>
                                        </Row>
                                        <Row  className="mb-3 rowRinci">
                                            <Col md={3}>Area Tujuan</Col>
                                            <Col md={9} className="colRinci">:
                                                <Input className="inputRinci" value={`${dataRinci.kode_plant_rec}-${dataRinci.area_rec}`} disabled />
                                            </Col>
                                        </Row>
                                    </div>
                                    <div className="footRinci3 mt-4">
                                        <Col md={6}>
                                            {/* <Button className="btnFootRinci2" size="lg" block outline  color="secondary" onClick={() => this.prosesRinci()}>Close</Button> */}
                                        </Col>
                                    </div>
                                </div>
                            </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.agree} toggle={this.openAgree} centered>
                    <ModalBody>
                        <div className="mb-3">
                            Alasan Mutasi :
                        </div>
                        <div className="mb-1">
                            <Input 
                            type='textarea'
                            name="alasan"
                            onChange={this.inputAlasan}
                            />
                        </div>
                        <div className="mb-5">
                            <text className={style.txtError}>{this.state.alasan === '' ? "Must be filled" : ''}</text>
                        </div>
                        <button className="btnSum" disabled={this.state.alasan === '' ? true : false } onClick={() => this.submitMut()}>Submit</button>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.props.mutasi.isLoading ? true: false} size="sm">
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
    mutasi: state.mutasi
})

const mapDispatchToProps = {
    logout: auth.logout,
    getMutasi: mutasi.getMutasi,
    deleteMutasi: mutasi.deleteMutasi,
    submitMutasi: mutasi.submitMutasi,
    getApproveMut: mutasi.getApproveMutasi
}

export default connect(mapStateToProps, mapDispatchToProps)(CartMutasi)
