/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { Component } from 'react'
import {NavbarBrand, Input, Button, Row, Col,
    Modal, ModalHeader, ModalBody, ModalFooter, UncontrolledTooltip,
    Container, Alert, Spinner, Table} from 'reactstrap'
import style from '../../assets/css/input.module.css'
import {FaUserCircle, FaBars, FaTrash} from 'react-icons/fa'
import {AiOutlineCheck, AiOutlineClose, AiOutlineInbox, AiFillCheckCircle} from 'react-icons/ai'
import {BsCircle} from 'react-icons/bs'
import {Formik} from 'formik'
import * as Yup from 'yup'
import disposal from '../../redux/actions/disposal'
import pengadaan from '../../redux/actions/pengadaan'
import tempmail from '../../redux/actions/tempmail'
import newnotif from '../../redux/actions/newnotif'
import {connect} from 'react-redux'
import auth from '../../redux/actions/auth'
import {default as axios} from 'axios'
import moment from 'moment'
import Sidebar from "../../components/Header";
import MaterialTitlePanel from "../../components/material_title_panel";
import SidebarContent from "../../components/sidebar_content";
import placeholder from  "../../assets/img/placeholder.png"
import Pdf from "../../components/Pdf"
import NavBar from '../../components/NavBar'
import asset from '../../redux/actions/asset'
import styleTrans from '../../assets/css/transaksi.module.css'
import NewNavbar from '../../components/NewNavbar'
import Email from '../../components/Disposal/Email'
import { MdUpload, MdDownload, MdEditSquare, MdAddCircle, MdDelete } from "react-icons/md"
import { IoDocumentTextOutline } from "react-icons/io5";
const {REACT_APP_BACKEND_URL} = process.env

const disposalSchema = Yup.object().shape({
    merk: Yup.string().validateSync(""),
    keterangan: Yup.string().required('must be filled'),
    nilai_jual: Yup.string().required()
})

class CartDisposal extends Component {
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
            modalSubmit: false,
            openDraft: false,
            subject: '',
            message: '',
            modalNpwp: false,
            selAset: '',
            typeNpwp: ''
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

    showAlert = () => {
        this.setState({alert: true})
       
         setTimeout(() => {
            this.setState({
                alert: false
            })
         }, 10000)
    }

    onChangeUpload = e => {
        const {size, type} = e.target.files[0]
        this.setState({fileUpload: e.target.files[0]})
        if (size >= this.state.limImage) {
            this.setState({errMsg: "Maximum upload size 20 MB"})
            this.uploadAlert()
        } else if (type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && type !== 'application/vnd.ms-excel' && type !== 'application/pdf' && type !== 'application/x-7z-compressed' && type !== 'application/vnd.rar' && type !== 'application/zip' && type !== 'application/x-zip-compressed' && type !== 'application/octet-stream' && type !== 'multipart/x-zip' && type !== 'application/x-rar-compressed') {
            this.setState({errMsg: 'Invalid file type. Only excel, pdf, zip, and rar files are allowed.'})
            this.uploadAlert()
        } else {
            const {detail} = this.state
            const token = localStorage.getItem('token')
            const data = new FormData()
            data.append('document', e.target.files[0])
            this.props.uploadDocumentDis(token, detail.id, data)
        }
    }

    closeProsesModalDoc = () => {
        this.setState({openModalDoc: !this.state.openModalDoc})
    }

    openProsesModalDoc = async (val) => {
        const token = localStorage.getItem('token')
        this.setState({dataRinci: val})
        const data = {
            noId: val.id,
            noAsset: val.no_asset
        }
        await this.props.getDocumentDis(token, data, 'disposal', 'pengajuan')
        this.closeProsesModalDoc()
    }

    prosesRinci = async (val) => {
        const token = localStorage.getItem('token')
        this.setState({dataRinci: val})
        await this.props.getKeterangan(token, val.nilai_jual)
        this.openModalRinci()
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

    openModalRinci = () => {
        this.setState({modalRinci: !this.state.modalRinci})
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

    openConfirm = (val) => {
        this.setState({modalConfirm: val === undefined || val === null || val === '' ? !this.state.modalConfirm : val})
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

    openModalDownload = () => {
        this.setState({modalUpload: !this.state.modalUpload})
    }

    deleteItem = async (value) => {
        const token = localStorage.getItem('token')
        await this.props.deleteDisposal(token, value)
        this.getDataDisposal()
    }

    prosesOpenAdd = async () => {
        const token = localStorage.getItem('token')
        const page = 1
        const search = ''
        const limit = 1000
        await this.props.getAsset(token, limit, search, page, 'disposal')
        this.openAdd()
    }

    openAdd = () => {
        this.setState({isAdd: !this.state.isAdd})
    }

    addDisposal = async (value) => {
        const token = localStorage.getItem("token")
        const {dataCart} = this.props.disposal
        const cek = dataCart.find(item => item.nilai_jual !== '0' && item.nilai_jual !== 0)
        if (cek !== undefined) {
            this.setState({confirm: 'falseAdd'})
            this.openConfirm()
        } else {
            await this.props.addDisposal(token, value)
            this.setState({confirm: 'add'})
            this.openConfirm()
            this.getDataCart()
        }
        
    }

    prosesOpenNpwp = (val) => {
        this.setState({selAset: val})
        this.openModalNpwp()
    }

    openModalNpwp = () => {
        this.setState({modalNpwp: !this.state.modalNpwp})
    }
    
    npwpApp = (val) => {
        this.setState({ typeNpwp: val })
    }

    npwpRej = (val) => {
        const { typeNpwp } = this.state
        if (typeNpwp === val) {
            this.setState({ typeNpwp: '' })
        }
    }

    prosesAddSell = (val) => {
        this.setState({selAset: val})
        setTimeout(() => {
            this.addSell()
        }, 100)
    }

    addSell = async () => {
        const token = localStorage.getItem("token")
        const {dataCart} = this.props.disposal
        const cek = dataCart.find(item => item.nilai_jual === '0' || item.nilai_jual === 0)
        if (cek !== undefined) {
            this.setState({confirm: 'falseAdd'})
            this.openConfirm()
        } else {
            const {typeNpwp, selAset} = this.state
            const data = {
                no: selAset
                // tipeNpwp: typeNpwp
            }
            await this.props.addSell(token, data)
            this.setState({confirm: 'add', selAset: ''})
            this.openConfirm()
            // this.openModalNpwp()
            this.getDataCart()
        }
    }

    getDataCart = async () => {
        const token = localStorage.getItem('token')
        const page = 1
        const search = ''
        const limit = 1000
        await this.props.getAsset(token, limit, search, page, 'disposal')
        await this.props.getCartDisposal(token)
    }

    async componentDidUpdate() {
        const {isError, isUpload, isSubmit} = this.props.disposal
        const token = localStorage.getItem('token')
        const {dataRinci} = this.state
        const data = {
            noId: dataRinci.id,
            noAsset: dataRinci.no_asset
        }
        if (isError) {
            this.props.resetError()
            this.showAlert()
        } else if (isUpload) {
            this.props.resetError()
            await this.props.getDocumentDis(token, data, 'disposal', 'pengajuan')
        }
        // else if (isSubmit) {
        //     this.props.resetError()
        //     setTimeout(() => {
        //         this.getDataDisposal()
        //      }, 1000)
        // }
    }

    cekSubmit = async () => {
        const token = localStorage.getItem('token')
        const { dataCart } = this.props.disposal
        const cek = []
        const cekDoc = []
        for (let i = 0; i < dataCart.length; i++) {
            if (dataCart[i].keterangan === null || dataCart[i].nilai_jual === null ) {
                cek.push(dataCart[i].keterangan)
            } else {
                const data = {
                    noId: dataCart[i].id,
                    noAsset: dataCart[i].no_asset
                }
                await this.props.getDocumentDis(token, data, 'disposal', 'pengajuan')
                const {dataDoc} = this.props.disposal
                for (let j = 0; j < dataDoc.length; j++) {
                    if (dataDoc[j].path === null) {
                        cekDoc.push(dataDoc[j])
                    }
                }
            }
        }
        
        if (cek.length > 0) {
            this.setState({confirm: 'failSubmit'})
            this.openConfirm()
        } else if (cekDoc.length > 0) {
            this.setState({confirm: 'falseDoc'})
            this.openConfirm()
        } else {
            this.openModalSub()
        }
    }

    onSearch = (e) => {
        this.setState({search: e.target.value})
        if(e.key === 'Enter'){
            this.getDataDisposal({limit: 10, search: this.state.search})
        }
    }

    componentDidMount() {
        this.getDataDisposal()
    }

    getDataDisposal = async () => {
        const token = localStorage.getItem('token')
        await this.props.getCartDisposal(token)
        // await this.props.getKeterangan(token)
    }

    menuButtonClick(ev) {
        ev.preventDefault();
        this.onSetOpen(!this.state.open);
    }

    onSetOpen(open) {
        this.setState({ open });
    }

    submitDataDisposal = async () => {
        const token = localStorage.getItem('token')
        await this.props.submitDisposal(token)
        this.prepSendEmail()
    }

    submitFinal = async () => {
        const token = localStorage.getItem('token')
        const { no_disposal, dataCart } = this.props.disposal
        const { draftEmail } = this.props.tempmail
        const { message, subject } = this.state
        const data = { 
            no: no_disposal
        }
        const cc = draftEmail.cc
        const tempcc = []
        for (let i = 0; i < cc.length; i++) {
            tempcc.push(cc[i].email)
        }

        const cekJual = dataCart[0].nilai_jual === '0' || dataCart[0].nilai_jual === 0
        const proses =  cekJual ? 'approve' : 'verifikasi'
        const route =  cekJual ? 'disposal' : 'purchdis'

        const sendMail = {
            draft: draftEmail,
            nameTo: draftEmail.to.fullname,
            to: draftEmail.to.email,
            cc: tempcc.toString(),
            message: message,
            subject: subject,
            no: no_disposal,
            tipe: 'disposal',
            menu: `disposal asset`,
            proses: proses,
            route: route
        }
        await this.props.submitDisposalFinal(token, data)
        await this.props.sendEmail(token, sendMail)
        await this.props.addNewNotif(token, sendMail)
        this.openModalSub()
        this.getDataDisposal()
        this.openDraftEmail()
        this.setState({confirm: 'submit'})
        this.openConfirm()
    }

    prepSendEmail = async () => {
        const {dataCart, no_disposal} = this.props.disposal
        const token = localStorage.getItem("token")
        const cekJual = dataCart.find((item) => item.nilai_jual === '0' || item.nilai_jual === 0)
        const tipe =  cekJual ? 'approve' : 'submit'
         const tempno = {
            no: no_disposal,
            kode: dataCart[0].kode_plant,
            jenis: 'disposal',
            tipe: tipe,
            menu: 'Pengajuan Disposal Asset (Disposal asset)'
        }

        const cekApp = {
            nama: dataCart[0].kode_plant.split('').length === 4 ? 'disposal pengajuan' :  'disposal pengajuan HO',
            no: no_disposal
        }
        await this.props.getDetailDisposal(token, no_disposal, 'pengajuan')
        await this.props.getApproveDisposal(token, cekApp.no, cekApp.nama)
        await this.props.getDraftEmail(token, tempno)
        this.openDraftEmail()
    }

    openDraftEmail = () => {
        this.setState({openDraft: !this.state.openDraft}) 
    }

    updateDataDis = async (value) => {
        const token = localStorage.getItem('token')
        const { dataRinci } = this.state
        await this.props.updateDisposal(token, dataRinci.id, value, 'disposal')
        this.getDataDisposal()
        this.setState({confirm: 'update'})
        this.openConfirm()
    }

    openModalSub = () => {
        this.setState({ modalSubmit: !this.state.modalSubmit })
    }

    render() {
        const {alert, dataRinci} = this.state
        const {dataCart, alertM, alertMsg, alertUpload, dataDoc, dataKet} = this.props.disposal
        const {dataAsset} = this.props.asset
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
                {/* <Sidebar {...sidebarProps}>
                    <MaterialTitlePanel title={contentHeader}>
                        <div className={style.backgroundLogo}>
                            <div className={style.bodyDashboard}>
                                <div className={style.headMaster}> 
                                    <div className={style.titleDashboard}>Draft Pengajuan Disposal</div>
                                </div>
                                <div className={style.secEmail}>
                                    <div className='rowGeneral'>
                                        <Button size='lg' color="primary" onClick={this.prosesOpenAdd}>Add</Button>
                                        <Button size='lg' className='ml-2' color="success" disabled={dataCart.length === 0 ? true : false } onClick={() => this.submitDis()}>Submit</Button>
                                    </div>
                                </div>
                                <div className={style.tableDashboard}>
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
                                        {dataCart.length !== 0 && dataCart.map(item => {
                                            return (
                                                <tr>
                                                    <td>{dataCart.indexOf(item) + 1}</td>
                                                    <td>{item.nama_asset}</td>
                                                    <td>{item.no_asset}</td>
                                                    <td>{item.nilai_buku === null || item.nilai_buku === undefined ? 0 : item.nilai_buku.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
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
                                </div>
                                <div className='mt-4'>
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
                        <h2 className={styleTrans.pageTitle}>Draft Disposal Aset</h2>

                        <div className='rowGeneral mb-4'>
                            <Button 
                            size='lg' 
                            color="primary" 
                            onClick={this.prosesOpenAdd}
                            >
                                Add
                            </Button>
                            <Button 
                            size='lg' 
                            className='ml-2' color="success" 
                            disabled={dataCart.length === 0 ? true : false } 
                            onClick={() => this.cekSubmit()}>
                                Submit
                            </Button>
                        </div>

                        <table className={styleTrans.table}>
                            <thead>
                                <tr>
                                    <th>NO</th>
                                    <th>NAMA ASET</th>
                                    <th>NOMOR ASET</th>
                                    <th>NILAI BUKU</th>
                                    <th>KATEGORI</th>
                                    <th>TIPE</th>
                                    <th>OPSI</th>
                                </tr>
                            </thead>
                            <tbody>
                            {dataCart.length !== 0 && dataCart.map((item, index) => {
                                return (
                                    <tr>
                                        <td>{dataCart.indexOf(item) + 1}</td>
                                        <td>{item.nama_asset}</td>
                                        <td>{item.no_asset}</td>
                                        <td>{item.nilai_buku === null || item.nilai_buku === undefined ? 0 : item.nilai_buku.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                        <td>{item.kategori}</td>
                                        <td>{item.nilai_jual === 0 || item.nilai_jual === '0' ? 'Pemusnahan' : 'Penjualan'}</td>
                                        <td>
                                            {/* <Button color="primary" onClick={() => this.prosesRinci(item)}>Rincian</Button>
                                            <Button color="danger" className='ml-2' onClick={() => this.deleteItem(item.no_asset)}>Delete</Button> */}

                                            <Button id={`tool${index}`} onClick={() => this.openProsesModalDoc(item)} className='mt-1 mr-1' color='primary'><IoDocumentTextOutline size={25}/></Button>
                                            <Button id={`toolEdit${index}`} onClick={() => this.prosesRinci(item)} className='mt-1 mr-1' color='success'><MdEditSquare size={25}/></Button>
                                            <Button id={`toolDelete${index}`} onClick={() => this.deleteItem(item.no_asset)} className='mt-1' color='danger'><MdDelete size={25}/></Button>
                                            <UncontrolledTooltip
                                                    placement="top"
                                                    target={`tool${index}`}
                                                >
                                                    Dokumen
                                            </UncontrolledTooltip>
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
                                <Button color="primary" onClick={() => this.submitDataDisposal()}>Ya</Button>
                                <Button color="secondary" onClick={this.openModalSub}>Tidak</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalNpwp} toggle={this.openModalNpwp} centered={true}>
                    <ModalBody>
                        <div className={style.modalApprove}>
                            <div>
                                <text>
                                    Apakah asset yg dijual memiliki Npwp ?
                                    <div className="ml-1 mt-2">
                                        <Input
                                            addon
                                            type="checkbox"
                                            checked={this.state.typeNpwp === 'ya' ? true : false}
                                            onClick={this.state.typeNpwp === 'ya' ? () => this.npwpRej('ya') : () => this.npwpApp('ya')}
                                        />  Ya
                                    </div>
                                    <div className="ml-1">
                                        <Input
                                            addon
                                            type="checkbox"
                                            checked={this.state.typeNpwp === 'tidak' ? true : false}
                                            onClick={this.state.typeNpwp === 'tidak' ? () => this.npwpRej('tidak') : () => this.npwpApp('tidak')}
                                        />  Tidak
                                    </div>
                                </text>
                            </div>
                            <div className={style.btnApprove}>
                                <Button disabled={this.state.typeNpwp === '' ? true : false} color="primary" onClick={() => this.addSell()}>Save</Button>
                                <Button color="secondary" onClick={this.openModalNpwp}>Close</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalRinci} toggle={this.openModalRinci} size="xl">
                    <ModalHeader>
                        Rincian {dataRinci.nilai_jual === '0' ? 'Pemusnahan' : 'Penjualan'} Asset
                    </ModalHeader>
                    <ModalBody>
                        <Alert color="danger" className={style.alertWrong} isOpen={alert}>
                            <div>{alertM}</div>
                        </Alert>
                        <div className="mainRinci">
                            <div className="leftRinci">
                                <img src={dataRinci.pict === undefined || dataRinci.pict.length === 0 ? placeholder : `${REACT_APP_BACKEND_URL}/${dataRinci.pict[dataRinci.pict.length - 1].path}`} className="imgRinci" />
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
                                keterangan: dataRinci.keterangan === null ? '' : dataRinci.keterangan,
                                nilai_jual: dataRinci.nilai_jual === null ? '-' : dataRinci.nilai_jual,
                                merk: dataRinci.merk === null ? '' : dataRinci.merk
                            }}
                            validationSchema = {disposalSchema}
                            onSubmit={(values) => {this.updateDataDis(values)}}
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
                                                value={values.merk}
                                                disabled
                                                onBlur={handleBlur("merk")}
                                                onChange={handleChange("merk")}
                                                />
                                            </Col>
                                        </Row>
                                        {errors.merk ? (
                                            <text className={style.txtError}>{errors.merk}</text>
                                        ) : null}
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
                                            <Col md={3}>Status Area</Col>
                                            <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.status_depo} disabled /></Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Cost Center</Col>
                                            <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.cost_center} disabled /></Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Nilai Buku</Col>
                                            <Col md={9} className="colRinci">:  <Input className="inputRinci" value={dataRinci.nilai_buku === null || dataRinci.nilai_buku === undefined ? 0 : dataRinci.nilai_buku.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} disabled /></Col>
                                        </Row>
                                        <Row className="mb-2 rowRinci">
                                            <Col md={3}>Nilai Jual</Col>
                                            <Col md={9} className="colRinci">:  <Input 
                                                className="inputRinci" 
                                                value={values.nilai_jual === null || values.nilai_jual === undefined ? 0 : values.nilai_jual.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} 
                                                onBlur={handleBlur("nilai_jual")}
                                                onChange={handleChange("nilai_jual")}
                                                disabled
                                                />
                                            </Col>
                                        </Row>
                                        {errors.nilai_jual ? (
                                            <text className={style.txtError}>{errors.nilai_jual}</text>
                                        ) : null}
                                        <Row className="mb-4 rowRinci">
                                            <Col md={3}>Keterangan</Col>
                                            <Col md={9} className="colRinci">:  <Input
                                                className="inputRinci"
                                                type="select"
                                                value={values.keterangan} 
                                                onBlur={handleBlur("keterangan")}
                                                onChange={handleChange("keterangan")}
                                                >
                                                    <option>-Pilih Keterangan-</option>
                                                    {dataKet.length !== 0 && dataKet.map(item => {
                                                        return (
                                                            <option value={item.nama}>{item.nama}</option>
                                                        )
                                                    })}
                                                </Input>
                                            </Col>
                                        </Row>
                                        {errors.keterangan ? (
                                            <text className={style.txtError}>{errors.keterangan}</text>
                                        ) : null}
                                    </div>
                                    <div className="footRinci1">
                                        {/* <Button className="btnFootRinci1" size="md" color="success" onClick={() => this.openProsesModalDoc(this.state.dataRinci)}>Upload Doc</Button> */}
                                        <div></div>
                                        <div>
                                            <Button className="mr-2" size="md" color="primary" onClick={handleSubmit}>Save</Button>
                                            <Button className="" size="md" color="secondary" onClick={() => this.openModalRinci()}>Close</Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            </Formik>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.isAdd} toggle={this.openAdd} size='xl' className='xl'>
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
                            {dataAsset.length !== 0 && dataAsset.filter(x => (x.status === null)).map((item, index) => {
                                return (
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>{item.nama_asset}</td>
                                        <td>{item.no_asset}</td>
                                        <td>{item.nilai_buku === null || item.nilai_buku === undefined ? 0 : item.nilai_buku.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                        <td>{item.kategori}</td>
                                        <td>{item.status === '1' ? 'On Proses Disposal' : item.status === '11' ? 'On Proses Mutasi' : 'available'}</td>
                                        <td>
                                            {item.status === '1' || item.status === '11' ? '-' :
                                            (
                                                <>
                                                    <Button 
                                                    className='ml-1 mt-1' 
                                                    color="warning" 
                                                    // onClick={() => this.prosesOpenNpwp(item.no_asset)}
                                                    onClick={() => this.prosesAddSell(item.no_asset)}
                                                    >Jual
                                                    </Button>
                                                    <Button className='ml-1 mt-1' color="info" onClick={() => this.addDisposal(item.no_asset)}>Pemusnahan</Button>
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
                <Modal isOpen={
                    this.props.disposal.isLoading ||
                    this.props.asset.isLoading || 
                    this.props.tempmail.isLoading || 
                    this.props.newnotif.isLoading
                    ? true: false
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
                <Modal size="xl" isOpen={this.state.openModalDoc} toggle={this.closeProsesModalDoc}>
                <ModalHeader>
                   Kelengkapan Dokumen
                </ModalHeader>
                <ModalBody>
                    <Container>
                        <Alert color="danger" className="alertWrong" isOpen={this.state.upload}>
                            <div>{this.state.errMsg}</div>
                        </Alert>
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
                                            <div className="colDoc">
                                                <input
                                                className="ml-4"
                                                type="file"
                                                onClick={() => this.setState({detail: x})}
                                                onChange={this.onChangeUpload}
                                                />
                                                <text className="txtError ml-4">Maximum file upload is 20 Mb</text>
                                            </div>
                                        </Col>
                                    ) : (
                                        <Col md={6} lg={6} className="colDoc">
                                            <input
                                            className="ml-4"
                                            type="file"
                                            onClick={() => this.setState({detail: x})}
                                            onChange={this.onChangeUpload}
                                            />
                                            <text className="txtError ml-4">Maximum file upload is 20 Mb</text>
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
                </ModalFooter>
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
                        <Button color="primary" onClick={this.openModalPdf}>Close</Button>
                    </div>
                </ModalBody>
            </Modal>
            <Modal isOpen={this.state.modalConfirm} toggle={() => this.openConfirm(false)}>
                <ModalBody>
                    {this.state.confirm === 'failSubmit' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Submit</div>
                                <div className={[style.sucUpdate, style.green]}>Lengkapi rincian data asset yang ingin diajukan</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'update' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Update</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'submit' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Submit</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'add' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Menambahkan Data</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'falseAdd' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Menambahkan Data</div>
                                <div className={[style.sucUpdate, style.green]}>Pastikan data yang ditambahkan memiliki tipe yang sama</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'falseDoc' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Submit</div>
                                <div className="errApprove mt-2">Mohon upload dokumen terlebih dahulu</div>
                            </div>
                        </div>
                    ) : (
                        <div></div>
                    ) 
                    }
                </ModalBody>
                <div className='row justify-content-md-center mb-4'>
                    <Button size='lg' onClick={() => this.openConfirm(false)} color='primary'>OK</Button>
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
    disposal: state.disposal,
    pengadaan: state.pengadaan,
    asset: state.asset,
    tempmail: state.tempmail,
    newnotif: state.newnotif
})

const mapDispatchToProps = {
    logout: auth.logout,
    getCartDisposal: disposal.getCartDisposal,
    submitDisposal: disposal.submitDisposal,
    submitDisposalFinal: disposal.submitDisposalFinal,
    resetError: disposal.reset,
    deleteDisposal: disposal.deleteDisposal,
    updateDisposal: disposal.updateDisposal,
    getDocumentDis: disposal.getDocumentDis,
    uploadDocumentDis: disposal.uploadDocumentDis,
    getKeterangan: disposal.getKeterangan,
    showDokumen: pengadaan.showDokumen,
    getAsset: asset.getAsset,
    addSell: disposal.addSell,
    addDisposal: disposal.addDisposal,
    getDetailDisposal: disposal.getDetailDisposal,
    getDraftEmail: tempmail.getDraftEmail,
    sendEmail: tempmail.sendEmail,
    addNewNotif: newnotif.addNewNotif,
    getApproveDisposal: disposal.getApproveDisposal,
}

export default connect(mapStateToProps, mapDispatchToProps)(CartDisposal)
