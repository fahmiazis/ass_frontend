/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { Component } from 'react'
import { NavbarBrand, Row, Col, Table, Button, Modal, ModalBody, ModalFooter, Container, Alert, ModalHeader } from 'reactstrap'
import style from '../assets/css/input.module.css'
import { AiOutlineClose, AiOutlineCheck } from 'react-icons/ai'
import { BsCircle } from 'react-icons/bs'
import { FaBars, FaUserCircle } from 'react-icons/fa'
import Sidebar from "../components/Header"
import MaterialTitlePanel from "../components/material_title_panel"
import {connect} from 'react-redux'
import moment from 'moment'
import disposal from '../redux/actions/disposal'
import pengadaan from '../redux/actions/pengadaan'
import setuju from '../redux/actions/setuju'
import auth from '../redux/actions/auth'
import SidebarContent from "../components/sidebar_content"

class PersetujuanDis extends Component {

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
            search: '',
            limit: 100,
            idStatus: 0,
            openModalDoc: false,
            dataRinci: {}
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
    }

    menuButtonClick(ev) {
        ev.preventDefault();
        this.onSetOpen(!this.state.open);
    }

    closeProsesModalDoc = () => {
        this.setState({openModalDoc: !this.state.openModalDoc})
    }

    openProsesModalDoc = async (value) => {
        const token = localStorage.getItem('token')
        await this.props.getDocumentDis(token, value.no_asset, 'disposal', 'pengajuan')
        this.closeProsesModalDoc()
    }

    onSetOpen(open) {
        this.setState({ open });
    }

    componentDidMount () {
        const {dataDis} = this.props.setuju
        this.setState({idStatus: dataDis[0].status_app})
        this.getApproveSet(dataDis[0].status_app)
    }

    getDataDisposal = async (value) => {
        const token = localStorage.getItem("token")
        const {dataDis} = this.props.setuju
        await this.props.getSetDisposal(token, 100, "", 1, dataDis[0].status_app, 'persetujuan')
    }

    getApproveSet = async (val) => {
        const token = localStorage.getItem("token")
        await this.props.getApproveSetDisposal(token, val, 'disposal persetujuan')
    }

    approveSet = async () => {
        const {dataDis} = this.props.setuju
        const token = localStorage.getItem("token")
        await this.props.approveSetDisposal(token, dataDis[0].status_app)
        this.getApproveSet(dataDis[0].status_app)
    }

    render() {
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const {dataDis, disApp} = this.props.setuju
        const { dataDoc } = this.props.disposal
        
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
          }
        return (
            <>
                <Sidebar {...sidebarProps}>
                    <MaterialTitlePanel title={contentHeader}>
                        <div className="bodyPer">
                            <div>PT. Pinus Merah Abadi</div>
                            <div className="modalDis">
                                <text className="titleModDis">Persetujuan Disposal Asset</text>
                            </div>
                            <div className="mb-2"><text className="txtTrans">Bandung</text>, {moment().format('DD MMMM YYYY ')}</div>
                            <Row>
                                <Col md={2} className="mb-3">
                                Hal : Persetujuan Disposal Asset
                                </Col>
                            </Row>
                            <div>Kepada Yth.</div>
                            <div className="mb-3">Bpk. Erwin Lesmana</div>
                            <div className="mb-3">Dengan Hormat,</div>
                            <div>Sehubungan dengan surat permohonan disposal aset area PMA terlampir</div>
                            <div className="mb-3">Dengan ini kami mohon persetujuan untuk melakukan disposal aset dengan perincian sbb :</div>
                            <Table striped bordered responsive hover className="tableDis mb-3">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Nomor Aset / Inventaris</th>
                                        <th>Area (Cabang/Depo/CP)</th>
                                        <th>Nama Barang</th>
                                        <th>Nilai Buku</th>
                                        <th>Nilai Jual</th>
                                        <th>Tanggal Perolehan</th>
                                        <th>Keterangan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataDis.length !== 0 ? dataDis.map(item => {
                                        return (
                                            <tr onClick={() => this.openProsesModalDoc(item)}>
                                                <th scope="row">{dataDis.indexOf(item) + 1}</th>
                                                <td>{item.no_asset}</td>
                                                <td>{item.area}</td>
                                                <td>{item.nama_asset}</td>
                                                <td>{item.nilai_buku}</td>
                                                <td>{item.nilai_jual}</td>
                                                <td>{item.createdAt}</td>
                                                <td>{item.keterangan}</td>
                                            </tr>
                                        )
                                    }) : (
                                        <tr>
                                            <th scope="row">1</th>
                                            <td> </td>
                                            <td> </td>
                                            <td> </td>
                                            <td> </td>
                                            <td> </td>
                                            <td> </td>
                                            <td> </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                            <div className="mb-3">Demikian hal yang dapat kami sampaikan perihal persetujuan disposal aset, atas perhatiannya kami mengucapkan terima kasih.</div>
                            <Table borderless className="tabPreview">
                                <thead>
                                    <tr>
                                        <th className="buatPre">Diajukan oleh,</th>
                                        <th className="buatPre">Disetujui oleh,</th>
                                    </tr>
                                </thead>
                                <tbody className="tbodyPre">
                                    <tr>
                                        <td className="restTable">
                                            <Table bordered className="divPre">
                                                <thead>
                                                    <tr>
                                                        {disApp.pembuat !== undefined && disApp.pembuat.map(item => {
                                                            return (
                                                                <th className="headPre">
                                                                    <div className="mb-2">{item.nama === null ? "-" : moment(item.updatedAt).format('LL')}</div>
                                                                    <div>{item.nama === null ? "-" : item.nama}</div>
                                                                </th>
                                                            )
                                                        })}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        {disApp.pembuat !== undefined && disApp.pembuat.map(item => {
                                                            return (
                                                                <td className="footPre">{item.jabatan === null ? "-" : item.jabatan}</td>
                                                            )
                                                        })}
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </td>
                                        <td className="restTable">
                                            <Table bordered className="divPre">
                                                <thead>
                                                    <tr>
                                                        {disApp.penyetuju !== undefined && disApp.penyetuju.map(item => {
                                                            return (
                                                                <th className="headPre">
                                                                    <div className="mb-2">{item.nama === null ? "-" : moment(item.updatedAt).format('LL')}</div>
                                                                    <div>{item.nama === null ? "-" : item.nama}</div>
                                                                </th>
                                                            )
                                                        })}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        {disApp.penyetuju !== undefined && disApp.penyetuju.map(item => {
                                                            return (
                                                                <td className="footPre">{item.jabatan === null ? "-" : item.jabatan}</td>
                                                            )
                                                        })}
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                            <div className="btnFoot">
                                <Button className="mr-2" color="danger" disabled>
                                    Reject
                                </Button>
                                {level === '23' || level === '22' || level === '25' ? (
                                    <Button color="success">
                                        <label>
                                            <input type="file" className="file-upload2" onChange={this.approveSet}/>
                                            Approve
                                        </label>
                                    </Button>
                                ) : (
                                    <Button color="success" onClick={this.approveSet}>
                                        Approve
                                    </Button>
                                )}
                            </div>
                        </div>
                    </MaterialTitlePanel>
                </Sidebar>
                <Modal size="xl" isOpen={this.state.openModalDoc} toggle={this.closeProsesModalDoc}>
                <ModalHeader>
                   Kelengkapan Dokumen
                </ModalHeader>
                <ModalBody>
                    <Container>
                        {dataDoc !== undefined && dataDoc.map(x => {
                            return (
                                <Row className="mt-3 mb-4">
                                    <Col md={6} lg={6} >
                                        <text>{x.nama_dokumen}</text>
                                    </Col>
                                    {x.path !== null ? (
                                        <Col md={6} lg={6} >
                                            {x.status === 0 ? (
                                                <AiOutlineClose size={20} />
                                            ) : x.status === 3 ? (
                                                <AiOutlineCheck size={20} />
                                            ) : (
                                                <BsCircle size={20} />
                                            )}
                                            <button className="btnDocIo" onClick={() => this.showDokumen(x)} >{x.nama_dokumen}</button>
                                            <div>
                                                <input
                                                className="ml-4"
                                                type="file"
                                                onClick={() => this.setState({detail: x})}
                                                onChange={this.onChangeUpload}
                                                />
                                            </div>
                                        </Col>
                                    ) : (
                                        <Col md={6} lg={6} >
                                            <input
                                            className="ml-4"
                                            type="file"
                                            onClick={() => this.setState({detail: x})}
                                            onChange={this.onChangeUpload}
                                            />
                                        </Col>
                                    )}
                                </Row>
                            )
                        })}
                    </Container>
                </ModalBody>
                <ModalFooter>
                    <Button className="mr-2" color="secondary" onClick={this.closeProsesModalDoc}>
                            Close
                        </Button>
                        <Button color="primary" onClick={this.closeProsesModalDoc}>
                            Save 
                    </Button>
                </ModalFooter>
            </Modal>
            </>
        )
    }
}

const mapStateToProps = state => ({
    asset: state.asset,
    disposal: state.disposal,
    pengadaan: state.pengadaan,
    setuju: state.setuju
})

const mapDispatchToProps = {
    logout: auth.logout,
    getDisposal: disposal.getDisposal,
    addDisposal: disposal.addDisposal,
    deleteDisposal: disposal.deleteDisposal,
    resetErrorDis: disposal.reset,
    showDokumen: pengadaan.showDokumen,
    resetDis: disposal.reset,
    getSetDisposal: setuju.getSetDisposal,
    getApproveSetDisposal: setuju.getApproveSetDisposal,
    approveSetDisposal: setuju.approveSetDisposal,
    getDocumentDis: disposal.getDocumentDis,
}

export default connect(mapStateToProps, mapDispatchToProps)(PersetujuanDis)
