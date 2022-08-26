/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { Component } from 'react'
import { NavbarBrand, Row, Col, Table, Button, Modal, ModalBody, 
    ModalFooter, Container, Alert, Input, Spinner, ModalHeader,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import style from '../assets/css/input.module.css'
import { AiOutlineClose, AiOutlineCheck, AiFillCheckCircle } from 'react-icons/ai'
import { BsCircle, BsBell, BsFillCircleFill } from 'react-icons/bs'
import { FaBars, FaUserCircle, FaFileSignature } from 'react-icons/fa'
import Sidebar from "../components/Header"
import MaterialTitlePanel from "../components/material_title_panel"
import {connect} from 'react-redux'
import {Formik} from 'formik'
import * as Yup from 'yup'
import moment from 'moment'
import disposal from '../redux/actions/disposal'
import pengadaan from '../redux/actions/pengadaan'
import setuju from '../redux/actions/setuju'
import {default as axios} from 'axios'
import auth from '../redux/actions/auth'
import SidebarContent from "../components/sidebar_content"
import Pdf from "../components/Pdf"
import TablePdf from "../components/Table"
import TablePeng from '../components/TablePeng'
import notif from '../redux/actions/notif'
import NavBar from '../components/NavBar'
const {REACT_APP_BACKEND_URL} = process.env

const alasanDisSchema = Yup.object().shape({
    alasan: Yup.string().required(),
    jenis_reject: Yup.string().required()
});

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
            dataRinci: {},
            detailDis: [],
            preview: false,
            date: '',
            modalConfirm: false,
            confirm: "",
            idDoc: null,
            fileName: {},
            openPdf: false,
            openReject: false
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
    }


    openModalReject = () => {
        this.setState({openReject: !this.state.openReject})
    }

    rejectDisposal = async (value) => {
        const token = localStorage.getItem('token')
        const {dataDis} = this.props.setuju
        const data = {
            alasan: value.value.alasan
        }
        await this.props.rejectSetDisposal(token, dataDis[0].status_app, data, value.value.jenis_reject)
        await this.props.notifDisposal(token, dataDis[0].status_app, 'reject', value.value.jenis_reject, null, 'persetujuan')
        this.getApproveSet(dataDis[0].status_app)
        this.openModalReject()
    }

    menuButtonClick(ev) {
        ev.preventDefault();
        this.onSetOpen(!this.state.open);
    }

    getDetailDisposal = async (value) => {
        const { dataDis } = this.props.disposal
        const token = localStorage.getItem('token')
        const detail = []
        for (let i = 0; i < dataDis.length; i++) {
            if (dataDis[i].no_disposal === value) {
                detail.push(dataDis[i])
            }
        }
        await this.props.getApproveDisposal(token, value, 'disposal pengajuan')
        this.setState({detailDis: detail})
        this.openPreview()
    }

    openConfirm = () => {
        this.setState({modalConfirm: !this.state.modalConfirm})
    }

    showDokumen = async (value) => {
        const token = localStorage.getItem('token')
        await this.props.showDokumen(token, value.id)
        this.setState({date: value.updatedAt, idDoc: value.id, fileName: value})
        const {isShow} = this.props.pengadaan
        if (isShow) {
            this.openModalPdf()
        }
    }

    downloadData = () => {
        const { fileName } = this.state
        const download = fileName.path.split('/')
        const cek = download[2].split('.')
        axios({
            url: `${REACT_APP_BACKEND_URL}/uploads/${download[2]}`,
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${fileName.nama_dokumen}.${cek[1]}`); //or any other extension
            document.body.appendChild(link);
            link.click();
        });
    }

    openModalPdf = () => {
        this.setState({openPdf: !this.state.openPdf})
    }

    openPreview = () => {
        this.setState({preview: !this.state.preview})
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

    getNotif = async () => {
        const token = localStorage.getItem("token")
        await this.props.getNotif(token)
    }

    componentDidMount () {
        const {dataDis} = this.props.setuju
        this.setState({idStatus: dataDis[0].status_app})
        this.getApproveSet(dataDis[0].status_app)
        this.getNotif()
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

    componentDidUpdate() {
        const {dataDis, errorRej, errorApp, approve, reject} = this.props.setuju
        if (errorRej) {
            this.openConfirm(this.setState({confirm: 'rejReject'}))
            this.props.resetAppSet()
        } else if (errorApp) {
            this.openConfirm(this.setState({confirm: 'rejApprove'}))
            this.props.resetAppSet()
        } else if (approve) {
            this.openConfirm(this.setState({confirm: 'approve'}))
            this.props.resetAppSet()
        } else if (reject) {
            this.openConfirm(this.setState({confirm: 'reject'}))
            this.props.resetAppSet()
        }
    }

    approveSet = async () => {
        const {dataDis} = this.props.setuju
        const token = localStorage.getItem("token")
        await this.props.approveSetDisposal(token, dataDis[0].status_app)
        await this.props.notifDisposal(token, dataDis[0].status_app, 'approve', null, null, 'persetujuan')
        this.getApproveSet(dataDis[0].status_app)
    }

    render() {
        const level = localStorage.getItem('level')
        const role = localStorage.getItem('role')
        const names = localStorage.getItem('name')
        const {dataDis, disApp} = this.props.setuju
        const { dataDoc } = this.props.disposal
        const appPeng = this.props.disposal.disApp
        const { detailDis } = this.state
        const dataNotif = this.props.notif.data
        
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
                                            // <tr onClick={() => this.openProsesModalDoc(item)}></tr>
                                            <tr onClick={() => this.getDetailDisposal(item.no_disposal)}>
                                                <th scope="row">{dataDis.indexOf(item) + 1}</th>
                                                <td>{item.no_asset}</td>
                                                <td>{item.area}</td>
                                                <td>{item.nama_asset}</td>
                                                <td>{item.nilai_buku === null || item.nilai_buku === undefined ? 0 : item.nilai_buku.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                <td>{item.nilai_jual === null || item.nilai_jual === undefined ? 0 : item.nilai_jual.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                <td>{moment(item.dataAsset.tanggal).format('DD/MM/YYYY')}</td>
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
                                                                    <div className="mb-2">{item.nama === null ? "" : item.status === 0 ? 'Reject' : moment(item.updatedAt).format('LL')}</div>
                                                                    <div>{item.nama === null ? "" : item.nama}</div>
                                                                </th>
                                                            )
                                                        })}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        {disApp.pembuat !== undefined && disApp.pembuat.map(item => {
                                                            return (
                                                                <td className="footPre">{item.jabatan === null ? "" : item.jabatan === 'NFAM' ? 'Head of Finance Accounting PMA' : item.jabatan}</td>
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
                                                                item.jabatan === 'HOC Funding And Tax' ? null :
                                                                <th className="headPre">
                                                                    <div className="mb-2">{item.nama === null ? "" : item.status === 0 ? 'Reject' : moment(item.updatedAt).format('LL')}</div>
                                                                    <div>{item.nama === null ? "" : item.nama}</div>
                                                                </th>
                                                            )
                                                        })}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        {disApp.penyetuju !== undefined && disApp.penyetuju.map(item => {
                                                            return (
                                                                item.jabatan === 'HOC Funding And Tax' ? null :
                                                                <td className="footPre">{item.jabatan === null ? "" : item.jabatan}</td>
                                                            )
                                                        })}
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                            <div className="btnFoot1">
                                <div className="btnfootapp">
                                    {disApp.pembuat.find(({jabatan}) => jabatan === role) !== undefined || disApp.penyetuju.find(({jabatan}) => jabatan === role) !== undefined ? (
                                        <>
                                            <Button className="mr-2" color="danger" onClick={this.openModalReject}>
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
                                        </>
                                    ) : (
                                        null
                                    )}
                                </div>
                                <Button color="primary" className="btnDownloadForm">
                                        <TablePdf dataDis={dataDis} />
                                </Button>
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
                                        </Col>
                                    ) : (
                                        <Col md={6} lg={6} >
                                            -
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
            <Modal isOpen={this.props.setuju.isLoading ? true: false} size="sm">
                <ModalBody>
                <div>
                    <div className={style.cekUpdate}>
                        <Spinner />
                        <div sucUpdate>Waiting....</div>
                    </div>
                </div>
                </ModalBody>
            </Modal>
            <Modal isOpen={this.state.preview} toggle={this.openPreview} size="xl">
                    <ModalBody>
                        <div>PT. Pinus Merah Abadi</div>
                        <div className="modalDis">
                            <text className="titleModDis">Form Pengajuan Disposal Asset</text>
                        </div>
                        <div className="mb-2"><text className="txtTrans">{detailDis[0] !== undefined && detailDis[0].area}</text>, {moment(detailDis[0] !== undefined && detailDis[0].createdAt).locale('idn').format('DD MMMM YYYY ')}</div>
                        <Row>
                            <Col md={2}>
                            Hal
                            </Col>
                            <Col md={10}>
                            : Pengajuan Disposal Asset
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col md={2}>
                            {detailDis[0] === undefined ? "" :
                            detailDis[0].status_depo === "Cabang Scylla" || detailDis[0].status_depo === "Cabang SAP" ? "Cabang" : "Depo"}
                            </Col>
                            <Col md={10} className="txtTrans">
                            : {detailDis[0] !== undefined && detailDis[0].area + ' - ' + detailDis[0].cost_center}
                            </Col>
                        </Row>
                        <div>Kepada Yth.</div>
                        <div>Bpk/Ibu Pimpinan</div>
                        <div className="mb-2">Di tempat</div>
                        <div>Dengan Hormat,</div>
                        <div className="mb-3">Dengan surat ini kami mengajukan permohonan disposal aset dengan perincian sbb :</div>
                        <Table striped bordered responsive hover className="tableDis mb-3">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Nomor Asset</th>
                                    <th>Nama Barang</th>
                                    <th>Merk/Type</th>
                                    <th>Kategori</th>
                                    <th>Nilai Buku</th>
                                    <th>Nilai Jual</th>
                                    <th>Keterangan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detailDis.length !== 0 && detailDis.map(item => {
                                    return (
                                        <tr  onClick={() => this.openProsesModalDoc(item)}>
                                            <th scope="row">{detailDis.indexOf(item) + 1}</th>
                                            <td>{item.no_asset}</td>
                                            <td>{item.nama_asset}</td>
                                            <td>{item.merk}</td>
                                            <td>{item.kategori}</td>
                                            <td>{item.nilai_buku === null || item.nilai_buku === undefined ? 0 : item.nilai_buku.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                            <td>{item.nilai_jual === null || item.nilai_jual === undefined ? 0 : item.nilai_jual.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                            <td>{item.keterangan}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                        <div className="mb-3">Demikianlah hal yang kami sampaikan, atas perhatiannya kami mengucapkan terima kasih</div>
                       <Table borderless responsive className="tabPreview">
                           <thead>
                               <tr>
                                   <th className="buatPre">Dibuat oleh,</th>
                                   <th className="buatPre">Diperiksa oleh,</th>
                                   <th className="buatPre">Disetujui oleh,</th>
                               </tr>
                           </thead>
                           <tbody className="tbodyPre">
                               <tr>
                                   <td className="restTable">
                                       <Table bordered responsive className="divPre">
                                            <thead>
                                                <tr>
                                                    {appPeng.pembuat !== undefined && appPeng.pembuat.map(item => {
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
                                                {appPeng.pembuat !== undefined && appPeng.pembuat.map(item => {
                                                    return (
                                                        <td className="footPre">{item.jabatan === null ? "-" : item.jabatan}</td>
                                                    )
                                                })}
                                                </tr>
                                            </tbody>
                                       </Table>
                                   </td>
                                   <td className="restTable">
                                       <Table bordered responsive className="divPre">
                                            <thead>
                                                <tr>
                                                    {appPeng.pemeriksa !== undefined && appPeng.pemeriksa.map(item => {
                                                        return (
                                                            item.jabatan === 'asset' ? (
                                                                <text></text>
                                                            ) : (
                                                                <th className="headPre">
                                                                    <div className="mb-2">{item.nama === null ? "-" : moment(item.updatedAt).format('LL')}</div>
                                                                    <div>{item.nama === null ? "-" : item.nama}</div>
                                                                </th>
                                                            )
                                                        )
                                                    })}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    {appPeng.pemeriksa !== undefined && appPeng.pemeriksa.map(item => {
                                                        return (
                                                            item.jabatan === 'asset' ? (
                                                                <text></text>
                                                            ) : (
                                                                <td className="footPre">{item.jabatan === null ? "-" : item.jabatan}</td>
                                                            )
                                                        )
                                                    })}
                                                </tr>
                                            </tbody>
                                       </Table>
                                   </td>
                                   <td className="restTable">
                                       <Table bordered responsive className="divPre">
                                            <thead>
                                                <tr>
                                                    {appPeng.penyetuju !== undefined && appPeng.penyetuju.map(item => {
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
                                                    {appPeng.penyetuju !== undefined && appPeng.penyetuju.map(item => {
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
                    </ModalBody>
                    <hr />
                    <div className="modalFoot ml-3">
                        <div></div>
                        <div className="btnFoot">
                            <Button className="mr-2" color="warning">
                                <TablePeng detailDis={detailDis}/>
                            </Button>
                            <Button color="success" onClick={this.openPreview}>
                                Close
                            </Button>
                        </div>
                    </div>
                </Modal>
                <Modal isOpen={this.state.openPdf} size="xl" toggle={this.openModalPdf} centered={true}>
                <ModalHeader>Dokumen</ModalHeader>
                    <ModalBody>
                        <div className={style.readPdf}>
                            <Pdf pdf={`${REACT_APP_BACKEND_URL}/show/doc/${this.state.idDoc}`} />
                        </div>
                        <hr/>
                        <div className={style.foot}>
                            <div>
                                <Button color="success" onClick={() => this.downloadData()}>Download</Button>
                            </div>
                        {level === '5' ? (
                            <Button color="primary" onClick={() => this.setState({openPdf: false})}>Close</Button>
                            ) : (
                                <div>
                                    {/* <Button color="danger" className="mr-3" onClick={this.openModalRejectDis}>Reject</Button>
                                    <Button color="primary" onClick={this.openModalApproveDis}>Approve</Button> */}
                                </div>
                            )}
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.openReject} toggle={this.openModalReject} centered={true}>
                    <ModalBody>
                    <Formik
                    initialValues={{
                    alasan: "",
                    jenis_reject: "revisi"
                    }}
                    validationSchema={alasanDisSchema}
                    onSubmit={(values) => {this.rejectDisposal({value: values, no: dataDis[0].status_app})}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                            <div className={style.modalApprove}>
                            <div className={style.quest}>Anda yakin untuk reject ?</div>
                            <div className={style.alasan}>
                                <text className="col-md-3">
                                    Reject
                                </text>
                                <Input 
                                type="select" 
                                name="jenis_reject" 
                                className="col-md-9"
                                value={values.jenis_reject}
                                onChange={handleChange('jenis_reject')}
                                onBlur={handleBlur('jenis_reject')}
                                >
                                    <option value="batal">Pembatalan </option>
                                    <option value="revisi">Perbaikan </option>
                                </Input>
                            </div>
                            {errors.jenis_reject ? (
                                <text className={style.txtError}>{errors.jenis_reject}</text>
                            ) : null}
                            <div className={style.alasan}>
                                <text className="col-md-3">
                                    Alasan
                                </text>
                                <Input 
                                type="name" 
                                name="alasan" 
                                className="col-md-9"
                                value={values.alasan}
                                onChange={handleChange('alasan')}
                                onBlur={handleBlur('alasan')}
                                />
                            </div>
                            {errors.alasan ? (
                                <text className={style.txtError}>{errors.alasan}</text>
                            ) : null}
                            <div className={style.btnApprove}>
                                <Button color="primary" onClick={handleSubmit}>Ya</Button>
                                <Button color="secondary" onClick={this.openModalReject}>Tidak</Button>
                            </div>
                        </div>
                        )}
                        </Formik>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalConfirm} toggle={this.openConfirm} size="sm">
                    <ModalBody>
                        {this.state.confirm === 'edit' ? (
                        <div className={style.cekUpdate}>
                            <AiFillCheckCircle size={80} className={style.green} />
                            <div className={[style.sucUpdate, style.green]}>Berhasil Update Dokumen</div>
                        </div>
                        ) : this.state.confirm === 'add' ? (
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Menambah Dokumen</div>
                            </div>
                        ) : this.state.confirm === 'approve' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Approve Dokumen</div>
                            </div>
                            </div>
                        ) : this.state.confirm === 'reject' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Reject Dokumen</div>
                            </div>
                            </div>
                        ) : this.state.confirm === 'rejApprove' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Approve Dokumen</div>
                                <div className="errApprove mt-2">{this.props.setuju.alertM === undefined ? '' : this.props.setuju.alertM}</div>
                            </div>
                            </div>
                        ) : this.state.confirm === 'rejReject' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Reject Dokumen</div>
                                <div className="errApprove mt-2">{this.props.setuju.alertM === undefined ? '' : this.props.setuju.alertM}</div>
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
    asset: state.asset,
    disposal: state.disposal,
    pengadaan: state.pengadaan,
    setuju: state.setuju,
    notif: state.notif
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
    getApproveDisposal: disposal.getApproveDisposal,
    rejectSetDisposal: setuju.rejectSetDisposal,
    resetAppSet: setuju.resetAppSet,
    getNotif: notif.getNotif,
    notifDisposal: notif.notifDisposal
}

export default connect(mapStateToProps, mapDispatchToProps)(PersetujuanDis)
