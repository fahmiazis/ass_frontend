/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { Component } from 'react'
import { FaUserCircle, FaBars, FaTrash } from 'react-icons/fa'
import { AiOutlineCheck, AiOutlineClose, AiFillCheckCircle, AiOutlineInbox } from 'react-icons/ai'
import style from '../../assets/css/input.module.css'
import {NavbarBrand, Row, Col, Button, Input, Modal, ModalBody, ModalHeader, Spinner, Table, ModalFooter, UncontrolledTooltip} from 'reactstrap'
import SidebarContent from "../../components/sidebar_content"
import Sidebar from "../../components/Header"
import MaterialTitlePanel from "../../components/material_title_panel"
import mutasi from '../../redux/actions/mutasi'
import tempmail from '../../redux/actions/tempmail'
import newnotif from '../../redux/actions/newnotif'
import auth from '../../redux/actions/auth'
import {connect} from 'react-redux'
import placeholder from  "../../assets/img/placeholder.png"
import NavBar from '../../components/NavBar'
import asset from '../../redux/actions/asset'
import depo from '../../redux/actions/depo'
import {Formik} from 'formik'
import TableMut from '../../components/TableMut'
import * as Yup from 'yup'
import Select from 'react-select'
import styleTrans from '../../assets/css/transaksi.module.css'
import NewNavbar from '../../components/NewNavbar'
import Email from '../../components/Mutasi/Email'
import moment from 'moment'
import { MdUpload, MdDownload, MdEditSquare, MdAddCircle, MdDelete } from "react-icons/md"
const {REACT_APP_BACKEND_URL} = process.env

const alasanSchema = Yup.object().shape({
    alasan: Yup.string().required()
});

const mutasiSchema = Yup.object().shape({
    kode_plant: Yup.string().required("must be filled"),
})

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
            alasan: '',
            limit: 10,
            confirm: "",
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
            modalRinci: false,
            dataRinci: {},
            openModalDoc: false,
            alertSubmit: false,
            limImage: 20000000,
            date: '',
            idDoc: 0,
            fileName: {},
            openPdf: false,
            isAdd: false,
            options: [],
            kode: '',
            area: '',
            rinciAdmin: false,
            modalSubmit: false,
            openDraft: false,
            subject: '',
            message: '',
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
    }

    getMessage = (val) => {
        this.setState({ message: val.message, subject: val.subject })
        console.log(val)
    }

    prosesSidebar = (val) => {
        this.setState({sidebarOpen: val})
    }
    
    goRoute = (val) => {
        this.props.history.push(`/${val}`)
    }

    chooseDepo = (e) => {
        const data = e.value.split('-')[0]
        this.setState({kode: data, area: e.value})
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
        this.prepSendEmail()
    }

    prepSendEmail = async () => {
        const {dataCart, nomor_mutasi} = this.props.mutasi
        const token = localStorage.getItem("token")
        const tipe = 'approve'
        const tempno = {
            no: nomor_mutasi,
            kode: dataCart[0].kode_plant,
            jenis: 'mutasi',
            tipe: tipe,
            menu: 'Pengajuan Mutasi Asset (Mutasi asset)',
            indexApp: 'first'
        }
        await this.props.getDetailMutasi(token, nomor_mutasi)
        await this.props.getApproveMut(token, nomor_mutasi, 'Mutasi')
        await this.props.getDraftEmail(token, tempno)
        this.openDraftEmail()
    }

    openDraftEmail = () => {
        this.setState({openDraft: !this.state.openDraft}) 
    }

    submitFinal = async () => {
        const token = localStorage.getItem('token')
        const { nomor_mutasi } = this.props.mutasi
        const { draftEmail } = this.props.tempmail
        const { message, subject } = this.state
        const data = { 
            no: nomor_mutasi
        }
        const cc = draftEmail.cc
        const tempcc = []
        for (let i = 0; i < cc.length; i++) {
            tempcc.push(cc[i].email)
        }
        const sendMail = {
            draft: draftEmail,
            nameTo: draftEmail.to.fullname,
            to: draftEmail.to.email,
            cc: tempcc.toString(),
            message: message,
            subject: subject,
            no: nomor_mutasi,
            tipe: 'mutasi',
            menu: `mutasi asset`,
            proses: 'approve',
            route: 'mutasi'
        }
        await this.props.submitMutasiFinal(token, data)
        await this.props.sendEmail(token, sendMail)
        await this.props.addNewNotif(token, sendMail)
        this.openAgree()
        this.openModalSub()
        this.getDataMutasi()
        this.openDraftEmail()
        this.setState({confirm: 'submit'})
        this.openConfirm()
    }

    componentDidMount() {
        this.getDataAsset()
    }

    inputAlasan = e => {
        this.setState({alasan: e.target.value})
    }

    openAgree = () => {
        this.setState({agree: !this.state.agree})
    }

    getDataMutasi = async () => {
        const token = localStorage.getItem('token')
        await this.props.getCart(token)
    }

    getDataAsset = async (value) => {
        const token = localStorage.getItem("token")
        const { page } = this.props.asset
        const search = value === undefined ? '' : this.state.search
        const limit = value === undefined ? this.state.limit : value.limit
        await this.props.getAsset(token, limit, search, page.currentPage, 'mutasi')
        await this.props.getCart(token)
        await this.props.getDetailDepo(token, 1)
        this.prepareSelect()
        this.setState({limit: value === undefined ? 12 : value.limit})
    }

    prepareSelect = async () => {
        const token = localStorage.getItem("token")
        const kode = localStorage.getItem('kode')
        await this.props.getDepo(token, 1000, '')
        const { dataDepo } = this.props.depo
        const temp = [
            {value: '', label: '-Pilih Area-'}
        ]
        if (dataDepo.length !== 0) {
            for (let i = 0; i < dataDepo.length; i++) {
                if (dataDepo[i].kode_plant !== kode) {
                    const data = `${dataDepo[i].kode_plant}-${dataDepo[i].nama_area}`
                    temp.push({value: data, label: data})
                }
            }
            this.setState({options: temp})
        }
    }

    deleteItem = async (val) => {
        const token = localStorage.getItem('token')
        console.log(val)
        await this.props.deleteMutasi(token, val.id)
        this.getDataMutasi()
    }

    getDataApprove = async () => {
        const { nomor_mutasi } = this.props.mutasi
        const token = localStorage.getItem('token')
        await this.props.getApproveMut(token, nomor_mutasi, 'Mutasi')
    }

    prosesOpenRinci = (val) => {
        const img = val.pict === undefined || val.pict.length === 0 ? placeholder : `${val.pict[val.pict.length - 1].path}`
        const data = `${val.kode_plant_rec}-${val.area_rec}`
        this.setState({dataRinci: val, img: img, kode: val.kode_plant_rec, area: data})
        this.prosesRinci()
    }

    prosesRinci = () => {
        this.setState({rinci: !this.state.rinci})
    }

    prosesOpenAdd = async () => {
        const token = localStorage.getItem('token')
        const page = 1
        const search = ''
        const limit = 1000
        await this.props.getAsset(token, limit, search, page, 'mutasi')
        this.openAdd()
    }

    openAdd = () => {
        this.setState({isAdd: !this.state.isAdd})
    }

    openRinciAdmin = async () => {
        this.setState({rinciAdmin: !this.state.rinciAdmin})
    }

    prosesAddMutasi = async () => {
        const token = localStorage.getItem("token")
        const { page } = this.props.asset
        const search =  ''
        const limit = this.state.limit
        const {kode, dataRinci} = this.state
        if (kode === '') {
            console.log('pilih tujuan depo')
        } else {
            const { dataCart } = this.props.mutasi
            if (dataCart.length > 0) {
                if (dataCart.find(item => item.kode_plant_rec === kode)) {
                    if (dataCart.find(item => item.kategori === dataRinci.kategori)) {
                        await this.props.addMutasi(token, dataRinci.no_asset, kode)
                        await this.props.getAsset(token, limit, search, page.currentPage, 'mutasi')
                        await this.props.getCart(token)
                        this.openRinciAdmin()
                        this.setState({confirm: 'add'})
                        this.openConfirm()
                    } else {
                        this.setState({confirm: 'falseKat'})
                        this.openConfirm()
                    }
                } else {
                    this.setState({confirm: 'falseAdd'})
                    this.openConfirm()
                }
            } else {
                await this.props.addMutasi(token, dataRinci.no_asset, kode)
                await this.props.getAsset(token, limit, search, page.currentPage, 'mutasi')
                await this.props.getCart(token)
                this.openRinciAdmin()
                this.setState({confirm: 'add'})
                this.openConfirm()
            }
            
        }
    }

    updateDataMutasi = async (val) => {
        const token = localStorage.getItem("token")
        const { kode } = this.state
        const data = {
            id: val.id,
            kodeRec: kode
        }
        const { dataCart } = this.props.mutasi
        if (dataCart.length > 1 && dataCart.find(item => item.kode_plant_rec !== kode && val.id !== item.id)) {
            this.setState({confirm: 'falseUpdate'})
            this.openConfirm()
        } else {
            await this.props.updateMutasi(token, data)
            await this.props.getCart(token)
            this.prosesRinci()
            this.setState({confirm: 'update'})
            this.openConfirm()
        }
    }

    openModalSub = () => {
        this.setState({ modalSubmit: !this.state.modalSubmit })
    }

    openConfirm = () => {
        this.setState({modalConfirm: !this.state.modalConfirm})
    }

    render() {
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const {dataCart} = this.props.mutasi
        const {dataAsset} = this.props.asset
        const { detailDepo } = this.props.depo
        const {dataRinci} = this.state

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
                                    <div className={style.titleDashboard}>Draft Pengajuan Mutasi</div>
                                </div>
                                <div className={style.secEmail}>
                                    <div className='rowGeneral'>
                                        <Button size='lg' color="primary" onClick={this.prosesOpenAdd}>Add</Button>
                                        <Button size='lg' className='ml-2' color="success" disabled={dataCart.length === 0 ? true : false } onClick={() => this.openAgree()}>Submit</Button>
                                    </div>
                                </div>
                                <div className={style.tableDashboard}>
                                    <Table bordered striped responsive hover className={style.tab}>
                                        <thead>
                                            <tr>
                                                <th>NO</th>
                                                <th>AREA TUJUAN</th>
                                                <th>NAMA ASET</th>
                                                <th>NOMOR ASET</th>
                                                <th>NILAI BUKU</th>
                                                <th>KATEGORI</th>
                                                <th>STATUS</th>
                                                <th>OPSI</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {dataCart.length !== 0 && dataCart.map(item => {
                                            return (
                                                <tr>
                                                    <td>{dataCart.indexOf(item) + 1}</td>
                                                    <td>{item.area_rec}</td>
                                                    <td>{item.nama_asset}</td>
                                                    <td>{item.no_asset}</td>
                                                    <td>{item.dataAsset.nilai_buku === null || item.dataAsset.nilai_buku === '' ? '0' : item.dataAsset.nilai_buku}</td>
                                                    <td>{item.kategori}</td>
                                                    <td>{item.status === '1' ? 'On Proses Disposal' : item.status === '11' ? 'On Proses Mutasi' : 'available'}</td>
                                                    <td>
                                                        <Button color="primary" onClick={() => this.prosesRinci(item)}>Rincian</Button>
                                                        <Button color="danger" className='ml-2' onClick={() => this.deleteItem(item.no_asset)}>Delete</Button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                        </tbody>
                                    </Table>
                                    {dataCart.length === 0 && (
                                        <div className={style.spin}>
                                            <text className='textInfo'>Data ajuan belum ditambahkan</text>
                                        </div>
                                    )}
                                </div> */}
                                {/* <Row className="cartDisposal">
                                    {dataCart.length === 0 ? (
                                        <Col md={8} xl={8} sm={12}>
                                            <div className="txtDisposEmpty">Mutasi Data is empty</div>
                                        </Col>
                                    ) : (
                                        <Col md={8} xl={8} sm={12} className="mb-5 mt-5">
                                        {dataCart.length !== 0 && dataCart.map(item => {
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
                                                <div className="angkaSum">{dataCart.length}</div>
                                            </div>
                                            <button className="btnSum" disabled={dataCart.length === 0 ? true : false } onClick={() => this.openAgree()}>Submit</button>
                                        </div>
                                    </Col>
                                </Row> */}
                                {/* <div className='mt-4'>
                                    <div className={style.infoPageEmail1}>
                                        <text>Showing 1 of 1 pages</text>
                                        <div className={style.pageButton}>
                                            <button className={style.btnPrev} color="info" disabled>Prev</button>
                                            <button className={style.btnPrev} color="info" disabled>Next</button>
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
                        <h2 className={styleTrans.pageTitle}>Draft Mutasi Aset</h2>

                        <div className='rowGeneral mb-4'>
                            <Button 
                            className='mr-2' 
                            onClick={this.prosesOpenAdd} 
                            color="primary" 
                            size="lg">
                                Add
                            </Button>
                            <Button 
                            size='lg' 
                            className='ml-2' 
                            color="success" 
                            disabled={dataCart.length === 0 ? true : false } 
                            onClick={() => this.openModalSub()}>
                                Submit
                            </Button>
                        </div>

                        <table className={styleTrans.table}>
                            <thead>
                                <tr>
                                    <th>NO</th>
                                    <th>AREA TUJUAN</th>
                                    <th>NAMA ASET</th>
                                    <th>NOMOR ASET</th>
                                    <th>NILAI BUKU</th>
                                    <th>KATEGORI</th>
                                    <th>OPSI</th>
                                </tr>
                            </thead>
                            <tbody>
                            {dataCart.length !== 0 && dataCart.map((item, index) => {
                                return (
                                    <tr>
                                        <td>{dataCart.indexOf(item) + 1}</td>
                                        <td>{item.kode_plant_rec} - {item.area_rec}</td>
                                        <td>{item.nama_asset}</td>
                                        <td>{item.no_asset}</td>
                                        <td>{item.dataAsset.nilai_buku === null || item.dataAsset.nilai_buku === '' ? '0' : item.dataAsset.nilai_buku}</td>
                                        <td>{item.kategori}</td>
                                        <td>
                                            <Button id={`toolEdit${index}`} onClick={() => this.prosesOpenRinci(item)} className='mt-1 mr-1' color='success'><MdEditSquare size={25}/></Button>
                                                <Button id={`toolDelete${index}`} onClick={() => this.deleteItem(item)} className='mt-1' color='danger'><MdDelete size={25}/></Button>
                                            <UncontrolledTooltip
                                                placement="top"
                                                target={`toolEdit${index}`}
                                            >
                                                Update
                                            </UncontrolledTooltip>
                                            <UncontrolledTooltip
                                                placement="top"
                                                target={`toolDelete${index}`}
                                            >
                                                Delete
                                            </UncontrolledTooltip>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                        {dataCart.length === 0 && (
                            <div className={style.spinCol}>
                                <AiOutlineInbox size={50} className='mb-4' />
                                <div className='textInfo'>Data ajuan tidak ditemukan</div>
                            </div>
                        )}
                    </div>
                </div>
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
                                            <Col md={3}>Nilai Buku</Col>
                                            <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.dataAsset === undefined || dataRinci.dataAsset.nilai_buku === null ? '-' : dataRinci.dataAsset.nilai_buku} disabled /></Col>
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
                                        {/* <Row  className="mb-3 rowRinci">
                                            <Col md={3}>Area Tujuan</Col>
                                            <Col md={9} className="colRinci">:
                                                <Input className="inputRinci" value={`${dataRinci.kode_plant_rec}-${dataRinci.area_rec}`} disabled />
                                            </Col>
                                        </Row> */}
                                        <Row  className="mb-1 rowRinci">
                                            <Col md={3}>Area Tujuan</Col>
                                            <Col md={9} className="colRinci">:
                                                <Select
                                                    className='inputRinci3'
                                                    options={this.state.options}
                                                    onChange={this.chooseDepo}
                                                    value={{value: this.state.area, label: this.state.area}}
                                                />
                                            </Col>
                                        </Row>
                                        <Row  className="mb-3 rowRinci">
                                            <Col md={3}></Col>
                                            <Col md={9} className="colRinci">
                                                <div className='ml-3'>
                                                    {this.state.kode === '' ? (
                                                        <text className={style.txtError}>Must be filled</text>
                                                    ) : null}
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                    <div className="footRinci3 mt-4">
                                        <Col md={6}>
                                            <Button className="btnFootRinci2" size="lg" block color="success" onClick={() => this.updateDataMutasi(dataRinci)}>Save</Button>
                                        </Col>
                                        <Col md={6}>
                                            <Button className="btnFootRinci2" size="lg" block outline  color="secondary" onClick={() => this.prosesRinci()}>Close</Button>
                                        </Col>
                                    </div>
                                </div>
                            </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.isAdd} toggle={this.openAdd} size='xl'>
                    <ModalHeader>List Asset</ModalHeader>
                    <ModalBody>
                        <Table bordered striped responsive hover className={style.tab}>
                            <thead>
                                <tr>
                                    <th>NO</th>
                                    <th>NAMA ASET</th>
                                    <th>NOMOR ASET</th>
                                    <th>NILAI BUKU</th>
                                    <th>KATEGORI</th>
                                    <th>STATUS</th>
                                    <th>OPSI</th>
                                </tr>
                            </thead>
                            <tbody>
                            {dataAsset.length !== 0 && dataAsset.map(item => {
                                return (
                                    <tr>
                                        <td>{dataAsset.indexOf(item) + 1}</td>
                                        <td>{item.nama_asset}</td>
                                        <td>{item.no_asset}</td>
                                        <td>{item.nilai_buku === null || item.nilai_buku === '' ? '0' : item.nilai_buku}</td>
                                        <td>{item.kategori}</td>
                                        <td>{item.status === '1' ? 'On Proses Disposal' : item.status === '11' ? 'On Proses Mutasi' : 'available'}</td>
                                        <td>
                                            {item.status === '1' || item.status === '11' ? '-' :
                                            (
                                                <>
                                                    <Button color="warning" onClick={() => this.openRinciAdmin(this.setState({dataRinci: item, kode: '', img: item.pict.length > 0 ? item.pict[item.pict.length - 1].path : ''}))}>Mutasi</Button>
                                                </>
                                            )
                                            }
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </Table>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={this.openAdd}>Close</Button>
                    </ModalFooter>
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
                <Modal isOpen={this.props.mutasi.isLoading || this.props.tempmail.isLoading || this.props.depo.isLoading || this.props.asset.isLoading ? true: false} size="sm">
                    <ModalBody>
                        <div>
                            <div className={style.cekUpdate}>
                                <Spinner />
                                <div sucUpdate>Waiting....</div>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.rinciAdmin} toggle={this.openRinciAdmin} size="xl">
                    <ModalHeader>
                        Proses Mutasi
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
                            <Formik
                            initialValues = {{
                                kode_plant: 'king'
                            }}
                            validationSchema = {mutasiSchema}
                            onSubmit={(values) => {this.prosesAddMutasi(values)}}
                            >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
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
                                                    <div className="ml-2"><input type="checkbox" disabled checked={dataRinci.kategori === 'IT' ? true : false}/> IT</div>
                                                    <div className="ml-3"><input type="checkbox" disabled checked={dataRinci.kategori === 'NON IT' ? true : false}/> NON IT</div>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Cost Center</Col>
                                            <Col md={9} className="colRinci">:  <Input className="inputRinci" value={detailDepo.cost_center} disabled /></Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Nilai Buku</Col>
                                            <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.nilai_buku === null ? '-' : dataRinci.nilai_buku} disabled /></Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Keterangan</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                className="inputRinci" 
                                                type="text" 
                                                value={dataRinci.keterangan === null ? '-' : dataRinci.keterangan} 
                                                disabled
                                                />
                                            </Col>
                                        </Row>
                                        <Row  className="mb-1 rowRinci">
                                            <Col md={3}>Area Tujuan</Col>
                                            <Col md={9} className="colRinci">:
                                                <Select
                                                    className='inputRinci3'
                                                    options={this.state.options}
                                                    onChange={this.chooseDepo}
                                                    
                                                />
                                            </Col>
                                        </Row>
                                        <Row  className="mb-3 rowRinci">
                                            <Col md={3}></Col>
                                            <Col md={9} className="colRinci">
                                                <div className='ml-3'>
                                                    {this.state.kode === '' ? (
                                                        <text className={style.txtError}>Must be filled</text>
                                                    ) : null}
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                    <div className="footRinci3 mt-4">
                                        <Col md={6}>
                                            <Button className="btnFootRinci2" size="lg" block color="success" onClick={handleSubmit}>Add</Button>
                                        </Col>
                                        <Col md={6}>
                                            <Button className="btnFootRinci2" size="lg" block outline  color="secondary" onClick={() => this.openRinciAdmin()}>Close</Button>
                                        </Col>
                                    </div>
                                </div>
                            )}
                            </Formik>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalSubmit} toggle={this.openModalSub} centered={true}>
                    <ModalBody>
                        <div className={style.modalApprove}>
                            <div>
                                <text>
                                    Anda yakin untuk submit
                                    <text className={style.verif}> </text>
                                    pada tanggal
                                    <text className={style.verif}> {moment().format('LL')}</text> ?
                                </text>
                            </div>
                            <div className={style.btnApprove}>
                                <Button color="primary" onClick={() => this.openAgree()}>Ya</Button>
                                <Button color="secondary" onClick={this.openModalSub}>Tidak</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalConfirm} toggle={this.openConfirm} size="md">
                    <ModalBody>
                        {this.state.confirm === 'submit' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Submit</div>
                            </div>
                            </div>
                        ) : this.state.confirm === 'rejSubmit' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                    <div className={[style.sucUpdate, style.green]}>Gagal Submit</div>
                                    <div className="errApprove mt-2">Mohon upload dokumen terlebih dahulu</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'falseAdd' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                    <div className={[style.sucUpdate, style.green]}>Gagal Menambahkan Item</div>
                                    <div className="errApprove mt-2">Pastikan tujuan mutasi sama dengan item yang lain</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'falseKat' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiOutlineClose size={80} className={style.red} />
                                    <div className={[style.sucUpdate, style.green]}>Gagal Menambahkan Item</div>
                                    <div className="errApprove mt-2">Pastikan kategori it atau non-it sama dengan item yang lain</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'falseUpdate' ? (
                            <div>
                                <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Update Item</div>
                                <div className="errApprove mt-2">Pastikan tujuan mutasi sama dengan item yang lain</div>
                            </div>
                            </div>
                        ) : this.state.confirm === 'update' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                    <div className={[style.sucUpdate, style.green]}>Berhasil Update</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'add' ?(
                            <div>
                                <div className={style.cekUpdate}>
                                    <AiFillCheckCircle size={80} className={style.green} />
                                    <div className={[style.sucUpdate, style.green]}>Berhasil Menambahkan Data</div>
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
                <Modal isOpen={this.state.openDraft} size='xl'>
                    <ModalHeader>Email Pemberitahuan</ModalHeader>
                    <ModalBody>
                        <Email handleData={this.getMessage}/>
                        <div className={style.foot}>
                            <div></div>
                            <div>
                                <Button
                                    disabled={this.state.message === '' ? true : false} 
                                    className="mr-2"
                                    onClick={() => this.submitFinal()} 
                                    color="primary"
                                >
                                    Approve & Send Email
                                </Button>
                                <Button className="mr-3" onClick={this.openDraftEmail}>Cancel</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </>
        )
    }
}

const mapStateToProps = state => ({
    mutasi: state.mutasi,
    asset: state.asset,
    depo: state.depo,
    tempmail: state.tempmail
})

const mapDispatchToProps = {
    logout: auth.logout,
    getCart: mutasi.getCart,
    deleteMutasi: mutasi.deleteMutasi,
    submitMutasi: mutasi.submitMutasi,
    getApproveMut: mutasi.getApproveMutasi,
    getAsset: asset.getAsset,
    getDetailDepo: depo.getDetailDepo,
    getDocumentMut: mutasi.getDocumentMut,
    resetAddMut: mutasi.resetAddMut,
    getDepo: depo.getDepo,
    addMutasi: mutasi.addMutasi,
    updateMutasi: mutasi.updateMutasi,
    getDetailMutasi: mutasi.getDetailMutasi,
    getDraftEmail: tempmail.getDraftEmail,
    sendEmail: tempmail.sendEmail,
    addNewNotif: newnotif.addNewNotif,
    submitMutasiFinal: mutasi.submitMutasiFinal
}

export default connect(mapStateToProps, mapDispatchToProps)(CartMutasi)
