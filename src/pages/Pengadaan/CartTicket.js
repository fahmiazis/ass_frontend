/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { Component } from 'react'
import { FaUserCircle, FaBars, FaTrash, FaCartPlus } from 'react-icons/fa'
import style from '../../assets/css/input.module.css'
import {NavbarBrand, Row, Col, Button, Input, Modal, ModalBody, UncontrolledTooltip,
    ModalHeader, Spinner, Alert, Container, ModalFooter, Table} from 'reactstrap'
import SidebarContent from "../../components/sidebar_content"
import Sidebar from "../../components/Header"
import {AiOutlineCheck, AiOutlineClose, AiFillCheckCircle, AiOutlineInbox} from 'react-icons/ai'
import { IoDocumentTextOutline } from "react-icons/io5";
import {BsCircle} from 'react-icons/bs'
import MaterialTitlePanel from "../../components/material_title_panel"
import {Formik} from 'formik'
import mutasi from '../../redux/actions/mutasi'
import pengadaan from '../../redux/actions/pengadaan'
import tempmail from '../../redux/actions/tempmail'
import auth from '../../redux/actions/auth'
import {default as axios} from 'axios'
import {connect} from 'react-redux'
import moment from 'moment'
import Pdf from "../../components/Pdf"
import newnotif from '../../redux/actions/newnotif'
import Select from 'react-select'
import * as Yup from 'yup'
import placeholder from  "../../assets/img/placeholder.png"
import NavBar from '../../components/NavBar'
import { MdUpload, MdDownload, MdEditSquare, MdAddCircle, MdDelete } from "react-icons/md"
import styleTrans from '../../assets/css/transaksi.module.css'
import NewNavbar from '../../components/NewNavbar'
import Email from '../../components/Pengadaan/Email'
import NumberInput from '../../components/NumberInput'
const {REACT_APP_BACKEND_URL} = process.env

const cartSchema = Yup.object().shape({
    nama: Yup.string().required(),
    qty: Yup.string().required(),
    price: Yup.string().required(),
    kategori: Yup.string().required(),
    tipe: Yup.string().required(),
    jenis: Yup.string().required(),
    akta: Yup.string().nullable(true),
    start: Yup.date().nullable(true),
    end: Yup.date().nullable(true)
});

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
            add: false,
            openModalDoc: false,
            date: '',
            idDoc: 0,
            fileName: {},
            openPdf: false,
            detail: {},
            modalConfirm: false,
            confirm: '',
            modalSubmit: false,
            openDraft: false,
            subject: '',
            message: '',
            noAjuan: '',
            showOptions: false,
            listNoIo: []
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

    closeProsesModalDoc = () => {
        this.setState({openModalDoc: !this.state.openModalDoc})
    }

    onChangeUpload = async e => {
        const {size, type} = e.target.files[0]
        this.setState({fileUpload: e.target.files[0]})
        if (size >= this.state.limImage) {
            this.setState({errMsg: "Maximum upload size 20 MB"})
            // this.uploadAlert()
        } else if (type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && type !== 'application/vnd.ms-excel' && type !== 'application/pdf' && type !== 'application/x-7z-compressed' && type !== 'application/vnd.rar' && type !== 'application/zip' && type !== 'application/x-zip-compressed' && type !== 'application/octet-stream' && type !== 'multipart/x-zip' && type !== 'application/x-rar-compressed') {
            this.setState({errMsg: 'Invalid file type. Only excel, pdf, zip, and rar files are allowed.'})
            // this.uploadAlert()
        } else {
            const {detail, dataRinci} = this.state
            const token = localStorage.getItem('token')
            const data = new FormData()
            data.append('document', e.target.files[0])
            await this.props.uploadDocument(token, detail.id, data)
            await this.props.getDocCart(token, dataRinci.id)
        }
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

    openModalPdf = () => {
        this.setState({openPdf: !this.state.openPdf})
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


    openDoc = async (val) => {
        const token = localStorage.getItem('token')
        const {dataRinci} = this.state
        this.setState({dataRinci: val})
        await this.props.getDocCart(token, val.id)
        this.closeProsesModalDoc()
    }

    componentDidMount() {
        this.getDataCart()
    }

    async componentDidUpdate() {
        const {isUpload} = this.props.pengadaan
        const token = localStorage.getItem('token')
        const {dataRinci} = this.state
        // if (isUpload) {
        //     this.props.resetError()
        //     this.props.getDocCart(token, dataRinci.id)
        // }
    }

    inputAlasan = e => {
        this.setState({alasan: e.target.value})
    }

    prepSendEmail = async () => {
        const {dataCart, noIo} = this.props.pengadaan
        const token = localStorage.getItem("token")
        // const tipe = dataCart[0].kategori === 'return' ? 'approve' : 'submit'
        const tipe = 'submit'
        const tempno = {
            no: noIo,
            kode: dataCart[0].kode_plant,
            jenis: 'pengadaan',
            tipe: tipe,
            menu: 'Pengajuan Pengadaan Asset (Pengadaan asset)'
        }
        await this.props.getDetail(token, noIo)
        await this.props.getApproveIo(token, noIo)
        await this.props.getDraftEmail(token, tempno)
        this.openDraftEmail()
    }

    openDraftEmail = () => {
        this.setState({openDraft: !this.state.openDraft}) 
    }

    prosesCek = async () => {
        const token = localStorage.getItem('token')
        await this.props.getCart(token)
        const { dataCart } = this.props.pengadaan
        const cek = []
        for (let i = 0; i < dataCart.length; i++) {
            const doc = dataCart[i].doc
            if (doc === null || doc === undefined || doc.length === 0) {
                cek.push(1)
            } else {
                for (let j = 0; j < doc.length; j++) {
                    if (doc[j].path === null || doc[j].path === '') {
                        cek.push(1)
                    }
                }
            }
        }
        if (cek.length > 0) {
            this.setState({confirm: 'rejSubmit'})
            this.openConfirm()
        } else {
            this.openModalSub()
        }
    }

    submitCart = async () => {
        const token = localStorage.getItem('token')
        await this.props.getCart(token)
        const { dataCart } = this.props.pengadaan
        const cek = []
        for (let i = 0; i < dataCart.length; i++) {
            const doc = dataCart[i].doc
            if (doc === null || doc === undefined || doc.length === 0) {
                cek.push(1)
            } else {
                for (let j = 0; j < doc.length; j++) {
                    if (doc[j].path === null || doc[j].path === '') {
                        cek.push(1)
                    }
                }
            }
        }
        if (cek.length > 0) {
            this.setState({confirm: 'rejSubmit'})
            this.openConfirm()
        } else {
            await this.props.submitIo(token)
            this.prepSendEmail()
        }
    }

    submitFinal = async () => {
        const token = localStorage.getItem('token')
        const { noIo, dataCart } = this.props.pengadaan
        const { draftEmail } = this.props.tempmail
        const { message, subject, alasan } = this.state
        const data = { 
            no: noIo
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
            no: noIo,
            tipe: 'pengadaan',
            menu: `pengadaan asset`,
            proses: 'submit',
            route: 'pengadaan'
        }
        const dataReason = {
            alasan: alasan
        }
        if (dataCart[0].kategori === 'return') {
            await this.props.submitIoFinal(token, data)
            await this.props.updateReason(token, noIo, dataReason)
            await this.props.sendEmail(token, sendMail)
            await this.props.addNewNotif(token, sendMail)
            this.getDataCart()
            this.openModalSub()
            this.openAgree()
            this.setState({confirm: 'submit'})
            this.openDraftEmail()
            this.openConfirm()
        } else {
            await this.props.submitIoFinal(token, data)
            await this.props.sendEmail(token, sendMail)
            await this.props.addNewNotif(token, sendMail)
            this.getDataCart()
            this.openModalSub()
            this.setState({confirm: 'submit'})
            this.openDraftEmail()
            this.openConfirm()
        }
        
    }

    openConfirm = () => {
        this.setState({modalConfirm: !this.state.modalConfirm})
    }

    prosesAdd = () => {
        this.setState({add: !this.state.add, noAjuan: ''})
    }

    openAgree = () => {
        this.setState({agree: !this.state.agree})
    }

    getDataCart = async () => {
        const token = localStorage.getItem('token')
        await this.props.getCart(token)
    }

    deleteItem = async (val) => {
        const token = localStorage.getItem('token')
        await this.props.deleteCart(token, val)
        this.getDataCart()
    }

    getDataApprove = async () => {
        const { nomor_mutasi } = this.props.mutasi
        const token = localStorage.getItem('token')
        await this.props.getApproveMut(token, nomor_mutasi, 'Mutasi')
    }
    
    proseModalRinci = (val) => {
        console.log(val)
        this.setState({dataRinci: val, noAjuan: val.no_ref})
        this.prosesRinci()
    }

    prosesRinci = () => {
        this.setState({rinci: !this.state.rinci})
    }

    openModalSub = () => {
        this.setState({ modalSubmit: !this.state.modalSubmit })
    }

    addCart = async (val) => {
        const token = localStorage.getItem('token')
        const {dataCart} = this.props.pengadaan
        const cek = []
        for (let i = 0; i < dataCart.length; i++) {
            if (dataCart[i].kategori !== val.kategori || dataCart[i].tipe !== val.tipe) {
                cek.push(1)
            }
        }
        if (cek.length > 0) {
            this.setState({confirm: 'falseAdd'})
            this.openConfirm()
        } else {
            const data = {
                ...val,
                no_ref: val.kategori === 'return' ? this.state.noAjuan : ''
            }
            await this.props.addCart(token, data)
            this.getDataCart()
            this.prosesAdd()
        }
    }

    selectNoIo = async (e) => {
        console.log('masuk ke select')
        console.log(e)
        const { dataSearch } = this.props.pengadaan
        const idVal = e.val.value
        const data = dataSearch.find((item) => item.no_pengadaan === idVal)
        if (data === undefined) {
            console.log('undefined')
        } else {
            this.setState({noAjuan: data.no_pengadaan})
        }
    }

    inputNoIo = (val) => {
        console.log(val)
        const { noAjuan } = this.state
        // this.setState({noAjuan: noAjuan.length > 3 && val === '' ? noAjuan : val })
        if(val !== undefined && val.length > 10) {
            this.getDataIo(val)
        } else {
            this.setState({ showOptions: false })
            console.log('please press enter {} {}')
        }
    }

    getDataIo = async (val) => {
        const token = localStorage.getItem("token")
        const search = val
        await this.props.searchIo(token, '8', 'all', 'all', search, 100)
        const {dataSearch} = this.props.pengadaan
        console.log(dataSearch)
        if (dataSearch.length > 0) {
            const listNoIo = [
                {value: '', label: '-Pilih-'}
            ]

            for (let i = 0; i < dataSearch.length; i++) {
                // if (dataSearch[i].no_asset !== null) {
                    listNoIo.push({value: dataSearch[i].no_pengadaan, label: dataSearch[i].no_pengadaan})
                // }
            }
            console.log(listNoIo)
            this.setState({listNoIo: listNoIo, showOptions: true})
        } else {
            this.setState({listNoIo: [], showOptions: true})
        }
    }

    selectTes = (val) => {
        console.log(val)
    }

    inputTes = (val) => {
        console.log(val)
    }

    editCart = async (val) => {
        const token = localStorage.getItem('token')
        const {detailIo} = this.props.pengadaan
        const {dataRinci} = this.state
        const cek = []
        for (let i = 0; i < detailIo.length; i++) {
            if ((detailIo[i].kategori !== val.kategori || detailIo[i].tipe !== val.tipe) && detailIo.length > 1) {
                cek.push(1)
            }
        }
        if (cek.length > 0) {
            this.setState({confirm: 'falseUpdate'})
            this.openConfirm()
        } else {
            const data = {
                ...val,
                no_ref: val.kategori === 'return' ? this.state.noAjuan : ''
            }
            await this.props.updateCart(token, dataRinci.id, data)
            await this.props.getDocCart(token, dataRinci.id)
            this.getDataCart()
            this.prosesRinci()
            this.setState({confirm: 'update'})
            this.openConfirm()
        }
    }

    getMessage = (val) => {
        this.setState({ message: val.message, subject: val.subject })
        console.log(val)
    }

    render() {
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const {dataCart, dataDocCart} = this.props.pengadaan
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
                                    <div className={style.titleDashboard}>Draft Pengadaan Asset</div>
                                </div>
                                <div className='pagu'></div>
                                <div className={style.secklaim}>
                                    <Button className='mr-2 mb-2' onClick={this.prosesAdd} color="info" size="lg">Add</Button>
                                    <Button className='mb-2' disabled={dataCart.length === 0 ? true : false } onClick={() => this.submitCart()} color="success" size="lg">Submit</Button>
                                </div>
                                <div className={style.tableDashboard}>
                                    <Table bordered responsive hover className={style.tab}>
                                        <thead>
                                            <tr>
                                                <th>NO</th>
                                                <th>NAMA ASSET</th>
                                                <th>KATEGORI</th>
                                                <th>PRICE</th>
                                                <th>KUANTITAS</th>
                                                <th>OPSI</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {dataCart.length !== 0 && dataCart.map((item, index) => {
                                            return (
                                                <tr>
                                                    <td>{index + 1}</td>
                                                    <td>{item.nama}</td>
                                                    <td>{item.kategori}</td>
                                                    <td>{item.tipe === 'gudang' ? 'Sewa Gudang' : "Barang"}</td>
                                                    <td>{item.qty}</td>
                                                    <td className='rowCenter'>
                                                        <Button onClick={() => this.proseModalRinci(item)} className='mb-1 mr-1' color='success'><MdEditSquare size={25}/></Button>
                                                        <Button onClick={() => this.deleteItem(item.id)} color='danger'><MdDelete size={25}/></Button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                        </tbody>
                                    </Table>
                                    {dataCart.length === 0 && (
                                        <div className={style.spin}>
                                            <text className='textInfo'>Data ajuan tidak ditemukan</text>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </MaterialTitlePanel>
                </Sidebar> */}
                <div className={styleTrans.app}>
                    <NewNavbar handleSidebar={this.prosesSidebar} handleRoute={this.goRoute} />

                    <div className={`${styleTrans.mainContent} ${this.state.sidebarOpen ? styleTrans.collapsedContent : ''}`}>
                        <h2 className={styleTrans.pageTitle}>Draft Pengadaan Aset</h2>

                        <div className='rowGeneral mb-4'>
                            <Button className='mr-2' onClick={this.prosesAdd} color="primary" size="lg">Add</Button>
                            <Button className='' disabled={dataCart.length === 0 ? true : false } onClick={() => this.prosesCek()} color="success" size="lg">Submit</Button>
                        </div>

                        <table className={styleTrans.table}>
                            <thead>
                                <tr>
                                    <th>NO</th>
                                    <th>NAMA ASSET</th>
                                    <th>KATEGORI</th>
                                    <th>TIPE</th>
                                    <th>JENIS</th>
                                    <th>KUANTITAS</th>
                                    <th>PRICE / UNIT</th>
                                    <th>TOTAL AMOUNT</th>
                                    <th>OPSI</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataCart.length !== 0 && dataCart.map((item, index) => {
                                    return (
                                        <tr>
                                            <td>{index + 1}</td>
                                            <td>{item.nama}</td>
                                            <td>{item.kategori}</td>
                                            <td>{item.tipe === 'gudang' ? 'Sewa Gudang' : "Barang"}</td>
                                            <td className='text-uppercase tdIt'>{item.jenis}</td>
                                            <td>{item.qty}</td>
                                            <td>Rp {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                            <td>Rp {(parseInt(item.price) * parseInt(item.qty)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                            <td>
                                                <Button id={`tool${index}`} onClick={() => this.openDoc(item)} className='mt-1 mr-1' color='primary'><IoDocumentTextOutline size={25}/></Button>
                                                <Button id={`toolEdit${index}`} onClick={() => this.proseModalRinci(item)} className='mt-1 mr-1' color='success'><MdEditSquare size={25}/></Button>
                                                <Button id={`toolDelete${index}`} onClick={() => this.deleteItem(item.id)} className='mt-1' color='danger'><MdDelete size={25}/></Button>
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
                
                <Modal isOpen={this.state.add} size='lg'>
                    <ModalHeader>Add Item</ModalHeader>
                    <Formik
                    initialValues={{
                        nama: "",
                        price: "",
                        qty: "",
                        kategori: "",
                        tipe: "",
                        jenis: "",
                        akta: null,
                        start: null,
                        end: null
                    }}
                    validationSchema={cartSchema}
                    onSubmit={(values) => {this.addCart(values)}}
                    >
                        {({ setFieldValue, handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                    <ModalBody>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Deskripsi
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="nama"
                                value={values.nama}
                                onBlur={handleBlur("nama")}
                                onChange={handleChange("nama")}
                                />
                                {errors.nama ? (
                                    <text className={style.txtError}>Must be filled</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Tipe
                            </text>
                            <div className="col-md-9">
                            <Input 
                                type="select"
                                name="select"
                                value={values.tipe}
                                onChange={handleChange("tipe")}
                                onBlur={handleBlur("tipe")}
                                >   
                                    <option value="">---Pilih---</option>
                                    {/* <option value="gudang">Sewa Gudang</option> */}
                                    <option value="barang">Barang</option>
                                </Input>
                                {errors.tipe ? (
                                    <text className={style.txtError}>Must be filled</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Jenis IT / NON IT
                            </text>
                            <div className="col-md-9">
                            <Input 
                                type="select"
                                name="select"
                                value={values.jenis}
                                onChange={handleChange("jenis")}
                                onBlur={handleBlur("jenis")}
                                >   
                                    <option value="">---Pilih---</option>
                                    <option value="it">IT</option>
                                    <option value="non-it">NON IT</option>
                                </Input>
                                {errors.jenis ? (
                                    <text className={style.txtError}>Must be filled</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Price
                            </text>
                            <div className="col-md-9">
                                <NumberInput
                                    value={values.price}
                                    className="inputRinci2"
                                    onValueChange={val => setFieldValue("price", val.floatValue)}
                                />
                                {/* <Input 
                                type="name" 
                                name="price"
                                value={values.price}
                                onBlur={handleBlur("price")}
                                onChange={handleChange("price")}
                                /> */}
                                {errors.price ? (
                                    <text className={style.txtError}>Must be filled</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Qty
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="qty"
                                value={values.qty}
                                onBlur={handleBlur("qty")}
                                onChange={handleChange("qty")}
                                />
                                {errors.qty ? (
                                    <text className={style.txtError}>Must be filled</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Kategori
                            </text>
                            <div className="col-md-9">
                            <Input 
                                type="select"
                                name="select"
                                value={values.kategori}
                                onChange={handleChange("kategori")}
                                onBlur={handleBlur("kategori")}
                                >   
                                    <option value="">-Pilih Kategori-</option>
                                    <option value="budget">Budget</option>
                                    <option value="non-budget">Non Budget</option>
                                    <option value="return">Return</option>
                                </Input>
                                {errors.kategori ? (
                                    <text className={style.txtError}>Must be filled</text>
                                ) : null}
                            </div>
                        </div>
                        {values.kategori === 'return' && (
                            <div className={style.addModalDepo}>
                                <text className="col-md-3">
                                    No Ajuan Return
                                </text>
                                <div className="col-md-9">
                                    {/* <Input 
                                    type="name" 
                                    name="no_ref"
                                    value={values.no_ref}
                                    onBlur={handleBlur("no_ref")}
                                    onChange={handleChange("no_ref")}
                                    /> */}
                                    <Select
                                        // className="inputRinci2"
                                        options={this.state.showOptions ? this.state.listNoIo : []}
                                        onChange={e => this.selectNoIo({val: e, type: 'noIo'})}
                                        onInputChange={e => this.inputNoIo(e)}
                                        isSearchable
                                        components={
                                            {
                                                DropdownIndicator: () => null,
                                            }
                                        }
                                        value={(values.kategori === 'return') ? {value: this.state.noAjuan, label: this.state.noAjuan} : { value: '', label: '' } }
                                    />
                                    {this.state.noAjuan === '' && values.kategori === 'return' ? (
                                        <text className={style.txtError}>Must be filled</text>
                                    ) : null}
                                </div>
                            </div>
                        )}
                        {values.tipe === 'gudang' && (
                            <>
                                <div className="headReport">
                                    <text className="col-md-3">Periode</text>
                                    <div className="optionType col-md-9">
                                        <Input 
                                        type="date" 
                                        name="start" 
                                        onChange={handleChange("start")}
                                        onBlur={handleBlur("start")}
                                        value={values.start}
                                        ></Input>
                                        <text className="toColon">To</text>
                                        <Input 
                                        type="date" 
                                        name="end" 
                                        value={values.end}
                                        onChange={handleChange("end")}
                                        onBlur={handleBlur("end")} 
                                        ></Input>
                                    </div>
                                </div>
                                <div className={style.addModalDepo}>
                                    <div className="col-md-3"></div>
                                    <div className="col-md-9">
                                        {values.tipe === 'gudang' && (values.start === 'null' || values.end === 'null' || values.start === null || values.end === null) ? (
                                            <text className={style.txtError}>Must be filled</text>
                                        ) : null}
                                    </div>
                                </div>
                                <div className={style.addModalDepo}>
                                    <text className="col-md-3">
                                        Dokumen Akta
                                    </text>
                                    <div className="col-md-9">
                                        <Input 
                                        type="select"
                                        name="select"
                                        value={values.akta}
                                        onChange={handleChange("akta")}
                                        onBlur={handleBlur("akta")}
                                        >   
                                            <option value="null">-Pilih-</option>
                                            <option value="ada">Ada</option>
                                            <option value="tidak">Tidak ada</option>
                                        </Input>
                                        {values.tipe === 'gudang' && (values.akta === null || values.akta === "null") ? (
                                            <text className={style.txtError}>Must be filled</text>
                                        ) : null}
                                    </div>
                                </div>
                            </>
                        )}
                        <hr/>
                        <div className={style.foot}>
                            <div></div>
                            <div>
                                <Button 
                                className="mr-2" 
                                disabled={
                                    (values.tipe === 'gudang' && 
                                    (values.akta === null || values.akta === "null" || values.start === null || values.end === null)) ||
                                    (values.kategori === 'return' && (this.state.noAjuan === '' || this.state.noAjuan === null))  
                                    ? true : false
                                } 
                                onClick={handleSubmit} 
                                color="primary">
                                    Save
                                </Button>
                                <Button className="mr-3" onClick={this.prosesAdd}>Cancel</Button>
                            </div>
                        </div>
                    </ModalBody>
                        )}
                    </Formik>
                </Modal>
                <Modal isOpen={this.state.rinci} size='lg'>
                    <ModalHeader>Rincian item</ModalHeader>
                    <Formik
                    initialValues={{
                        nama: dataRinci.nama,
                        price: dataRinci.price,
                        qty: dataRinci.qty,
                        kategori: dataRinci.kategori,
                        tipe: dataRinci.tipe,
                        jenis: dataRinci.jenis,
                        akta: dataRinci.akta,
                        start: dataRinci.start === null || dataRinci.start === undefined ? '' : dataRinci.start.slice(0, 10),
                        end: dataRinci.end === null || dataRinci.end === undefined ? '' : dataRinci.end.slice(0, 10)
                    }}
                    validationSchema={cartSchema}
                    onSubmit={(values) => {this.editCart(values)}}
                    >
                        {({ setFieldValue, handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                        <ModalBody>
                            <div className={style.addModalDepo}>
                                <text className="col-md-3">
                                    Deskripsi
                                </text>
                                <div className="col-md-9">
                                    <Input 
                                    type="name" 
                                    name="nama"
                                    value={values.nama}
                                    onBlur={handleBlur("nama")}
                                    onChange={handleChange("nama")}
                                    />
                                    {errors.nama ? (
                                        <text className={style.txtError}>Must be filled</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-3">
                                    Tipe
                                </text>
                                <div className="col-md-9">
                                <Input 
                                    type="select"
                                    name="select"
                                    value={values.tipe}
                                    onChange={handleChange("tipe")}
                                    onBlur={handleBlur("tipe")}
                                    >   
                                        <option value="">-Pilih Tipe-</option>
                                        {/* <option value="gudang">Sewa Gudang</option> */}
                                        <option value="barang">Barang</option>
                                    </Input>
                                    {errors.tipe ? (
                                        <text className={style.txtError}>Must be filled</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-3">
                                    Jenis IT / NON IT
                                </text>
                                <div className="col-md-9">
                                <Input 
                                    type="select"
                                    name="select"
                                    value={values.jenis}
                                    onChange={handleChange("jenis")}
                                    onBlur={handleBlur("jenis")}
                                    >   
                                        <option value="">---Pilih---</option>
                                        <option value="it">IT</option>
                                        <option value="non-it">NON IT</option>
                                    </Input>
                                    {errors.jenis ? (
                                        <text className={style.txtError}>Must be filled</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-3">
                                    Price
                                </text>
                                <div className="col-md-9">
                                    <NumberInput
                                        value={values.price}
                                        className="inputRinci2"
                                        onValueChange={val => setFieldValue("price", val.floatValue)}
                                    />
                                    {/* <Input 
                                    type="name" 
                                    name="price"
                                    value={values.price}
                                    onBlur={handleBlur("price")}
                                    onChange={handleChange("price")}
                                    /> */}
                                    {errors.price ? (
                                        <text className={style.txtError}>Must be filled</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-3">
                                    Qty
                                </text>
                                <div className="col-md-9">
                                    <Input 
                                    type="name" 
                                    name="qty"
                                    value={values.qty}
                                    onBlur={handleBlur("qty")}
                                    onChange={handleChange("qty")}
                                    />
                                    {errors.qty ? (
                                        <text className={style.txtError}>Must be filled</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className={style.addModalDepo}>
                                <text className="col-md-3">
                                    Kategori
                                </text>
                                <div className="col-md-9">
                                <Input 
                                    type="select"
                                    name="select"
                                    value={values.kategori}
                                    onChange={handleChange("kategori")}
                                    onBlur={handleBlur("kategori")}
                                    >   
                                        <option value="">-Pilih Kategori-</option>
                                        <option value="budget">Budget</option>
                                        <option value="non-budget">Non Budget</option>
                                        <option value="return">Return</option>
                                    </Input>
                                    {errors.kategori ? (
                                        <text className={style.txtError}>Must be filled</text>
                                    ) : null}
                                </div>
                            </div>
                            {values.kategori === 'return' && (
                                <div className={style.addModalDepo}>
                                    <text className="col-md-3">
                                        No Ajuan Return
                                    </text>
                                    <div className="col-md-9">
                                        {/* <Input 
                                        type="name" 
                                        name="no_ref"
                                        value={values.no_ref}
                                        onBlur={handleBlur("no_ref")}
                                        onChange={handleChange("no_ref")}
                                        /> */}
                                        <Select
                                            // className="inputRinci2"
                                            options={this.state.showOptions ? this.state.listNoIo : []}
                                            onChange={e => this.selectNoIo({val: e, type: 'noIo'})}
                                            onInputChange={e => this.inputNoIo(e)}
                                            isSearchable
                                            components={
                                                {
                                                    DropdownIndicator: () => null,
                                                }
                                            }
                                            value={(values.kategori === 'return') ? {value: this.state.noAjuan, label: this.state.noAjuan} : { value: '', label: '' } }
                                        />
                                        {this.state.noAjuan === '' && values.kategori === 'return' ? (
                                            <text className={style.txtError}>Must be filled</text>
                                        ) : null}
                                    </div>
                                </div>
                            )}
                            {values.tipe === 'gudang' && (
                                <>
                                    <div className="headReport">
                                        <text className="col-md-3">Periode</text>
                                        <div className="optionType col-md-9">
                                            <Input 
                                            type="date" 
                                            name="start" 
                                            onChange={handleChange("start")}
                                            onBlur={handleBlur("start")}
                                            value={values.start}
                                            ></Input>
                                            <text className="toColon">To</text>
                                            <Input 
                                            type="date" 
                                            name="end" 
                                            value={values.end}
                                            onChange={handleChange("end")}
                                            onBlur={handleBlur("end")} 
                                            ></Input>
                                        </div>
                                    </div>
                                    <div className={style.addModalDepo}>
                                        <div className="col-md-3"></div>
                                        <div className="col-md-9">
                                            {values.tipe === 'gudang' && (values.start === 'null' || values.end === 'null' || values.start === null || values.end === null) ? (
                                                <text className={style.txtError}>Must be filled</text>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className={style.addModalDepo}>
                                        <text className="col-md-3">
                                            Dokumen Akta
                                        </text>
                                        <div className="col-md-9">
                                            <Input 
                                            type="select"
                                            name="select"
                                            value={values.akta}
                                            onChange={handleChange("akta")}
                                            onBlur={handleBlur("akta")}
                                            >   
                                                <option value="null">-Pilih-</option>
                                                <option value="ada">Ada</option>
                                                <option value="tidak">Tidak ada</option>
                                            </Input>
                                            {values.tipe === 'gudang' && (values.akta === null || values.akta === "null") ? (
                                                <text className={style.txtError}>Must be filled</text>
                                            ) : null}
                                        </div>
                                    </div>
                                </>
                            )}
                            <hr/>
                            <div className={style.foot}>
                                <div>
                                    {/* <Button color="success" className="mr-3" onClick={this.openDoc}>Dokumen</Button> */}
                                </div>
                                <div>
                                    <Button 
                                        className="mr-2" 
                                        disabled={
                                            (values.tipe === 'gudang' && 
                                            (values.akta === null || values.akta === "null" || values.start === null || values.end === null)) ||
                                            (values.kategori === 'return' && (this.state.noAjuan === '' || this.state.noAjuan === null))  
                                            ? true : false
                                        } 
                                        onClick={handleSubmit} color="primary"
                                    >
                                        Save
                                    </Button>
                                    <Button className="mr-3" onClick={this.prosesRinci}>Cancel</Button>
                                </div>
                            </div>
                        </ModalBody>
                        )}
                    </Formik>
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
                                <Button color="primary" onClick={() => dataCart.length !== 0 && dataCart[0].kategori === 'return' ? this.openAgree() : this.submitCart()}>Ya</Button>
                                <Button color="secondary" onClick={this.openModalSub}>Tidak</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.props.pengadaan.isLoading || this.props.tempmail.isLoading ? true: false} size="sm">
                <ModalBody>
                    <div>
                        <div className={style.cekUpdate}>
                            <Spinner />
                            <div sucUpdate>Waiting....</div>
                        </div>
                    </div>
                </ModalBody>
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
            <Modal size="xl" isOpen={this.state.openModalDoc} toggle={this.closeProsesModalDoc}>
                <ModalHeader>
                   Kelengkapan Dokumen
                </ModalHeader>
                <ModalBody>
                    <Container>
                        <Alert color="danger" className="alertWrong" isOpen={false}>
                            <div>{this.state.errMsg}</div>
                        </Alert>
                        {dataDocCart !== undefined && dataDocCart.map(x => {
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
                                            <button 
                                            className="btnDocIo" 
                                            // onClick={() => this.showDokumen(x)} 
                                            >
                                                {x.desc}
                                            </button>
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
                    <Button color="primary" onClick={this.closeProsesModalDoc}>
                        Save 
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
                            <div className="errApprove mt-2">Pastikan kategori dan tipe sama di setiap item</div>
                        </div>
                        </div>
                    ) : this.state.confirm === 'falseUpdate' ? (
                        <div>
                            <div className={style.cekUpdate}>
                            <AiOutlineClose size={80} className={style.red} />
                            <div className={[style.sucUpdate, style.green]}>Gagal Update Item</div>
                            <div className="errApprove mt-2">Pastikan kategori dan tipe sama di setiap item</div>
                        </div>
                        </div>
                    ) : this.state.confirm === 'update' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Update</div>
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
            <Modal isOpen={this.state.agree} toggle={this.openAgree} centered>
                <ModalBody>
                    <div className="mb-3">
                        Alasan Return :
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
                    <button className="btnSum" disabled={this.state.alasan === '' ? true : false } onClick={() => this.submitCart()}>Submit</button>
                </ModalBody>
            </Modal>
            </>
        )
    }
}

const mapStateToProps = state => ({
    mutasi: state.mutasi,
    pengadaan: state.pengadaan,
    tempmail: state.tempmail
})

const mapDispatchToProps = {
    logout: auth.logout,
    searchIo: pengadaan.searchIo,
    getCart: pengadaan.getCart,
    deleteCart: pengadaan.deleteCart,
    submitCart: pengadaan.submitCart,
    submitIo: pengadaan.submitIo,
    submitIoFinal: pengadaan.submitIoFinal,
    addCart: pengadaan.addCart,
    updateCart: pengadaan.updateCart,
    showDokumen: pengadaan.showDokumen,
    getDocCart: pengadaan.getDocCart,
    uploadDocument: pengadaan.uploadDocument,
    getDraftEmail: tempmail.getDraftEmail,
    sendEmail: tempmail.sendEmail,
    getDetail: pengadaan.getDetail,
    resetError: pengadaan.resetError,
    addNewNotif: newnotif.addNewNotif,
    getApproveIo: pengadaan.getApproveIo,
    updateReason: pengadaan.updateReason,
}

export default connect(mapStateToProps, mapDispatchToProps)(CartMutasi)
