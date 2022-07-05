/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { Component } from 'react'
import { FaUserCircle, FaBars, FaTrash, FaCartPlus } from 'react-icons/fa'
import style from '../assets/css/input.module.css'
import {NavbarBrand, Row, Col, Button, Input, Modal, ModalBody, ModalHeader, Spinner, Alert, Container, ModalFooter} from 'reactstrap'
import SidebarContent from "../components/sidebar_content"
import Sidebar from "../components/Header"
import {AiOutlineCheck, AiOutlineClose, AiFillCheckCircle} from 'react-icons/ai'
import {BsCircle} from 'react-icons/bs'
import MaterialTitlePanel from "../components/material_title_panel"
import {Formik} from 'formik'
import mutasi from '../redux/actions/mutasi'
import pengadaan from '../redux/actions/pengadaan'
import auth from '../redux/actions/auth'
import {default as axios} from 'axios'
import {connect} from 'react-redux'
import Pdf from "../components/Pdf"
import * as Yup from 'yup'
import placeholder from  "../assets/img/placeholder.png"
const {REACT_APP_BACKEND_URL} = process.env

const cartSchema = Yup.object().shape({
    nama: Yup.string().required(),
    qty: Yup.string().required(),
    price: Yup.string().required(),
    kategori: Yup.string().required(),
    tipe: Yup.string().required(),
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
            confirm: ''
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

    closeProsesModalDoc = () => {
        this.setState({openModalDoc: !this.state.openModalDoc})
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
            const {detail, dataRinci} = this.state
            const token = localStorage.getItem('token')
            const data = new FormData()
            data.append('document', e.target.files[0])
            this.props.uploadDocument(token, detail.id, data)
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

    submitMut = async () => {
        const token = localStorage.getItem('token')
        const data = {
            alasan: this.state.alasan
        }
        await this.props.submitMutasi(token, data)
        this.getDataApprove()
        this.getDataCart()
        this.openAgree()
    }

    openDoc = async () => {
        const token = localStorage.getItem('token')
        const {dataRinci} = this.state
        this.props.getDocCart(token, dataRinci.id)
        this.closeProsesModalDoc()
    }

    componentDidMount() {
        this.getDataCart()
    }

    componentDidUpdate() {
        const {isUpload} = this.props.pengadaan
        const token = localStorage.getItem('token')
        const {dataRinci} = this.state
        if (isUpload) {
            this.props.getDocCart(token, dataRinci.id)
            this.props.resetError()
        }
    }

    inputAlasan = e => {
        this.setState({alasan: e.target.value})
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
            await this.props.submitCart(token)
            this.getDataCart()
            this.setState({confirm: 'submit'})
            this.openConfirm()
        }
    }

    openConfirm = () => {
        this.setState({modalConfirm: !this.state.modalConfirm})
    }

    prosesAdd = () => {
        this.setState({add: !this.state.add})
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
        this.setState({dataRinci: val})
        this.prosesRinci()
    }

    prosesRinci = () => {
        this.setState({rinci: !this.state.rinci})
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
            await this.props.addCart(token, val)
            this.getDataCart()
            this.prosesAdd()
        }
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
                                    <div className={style.titleDashboard1}>Cart Pengadaan Asset</div>
                                    {/* <div className={style.titleDashboard4}>
                                        <button className="btnGoCart" onClick={this.prosesAdd}><FaCartPlus size={60} className="green ml-2" /></button>
                                    </div> */}
                                </div>
                                <Row className="cartDisposal">
                                    {dataCart.length === 0 ? (
                                        <Col md={8} xl={8} sm={12}>
                                            <Button color='warning' size='lg' className="txtDisposEmpty" onClick={this.prosesAdd}>Add</Button>
                                        </Col>
                                    ) : (
                                        <Col md={8} xl={8} sm={12} className="mb-5 mt-5">
                                            <Button color='warning' size='lg' className="txtDisposEmpty1" onClick={this.prosesAdd}>Add</Button>
                                        {dataCart.length !== 0 && dataCart.map(item => {
                                            return (
                                                <div className="cart ml-4">
                                                    <div className="navCart">
                                                        <img src={placeholder} className="cartImg" />
                                                        <Button className="labelBut" color="danger" size="sm">Pengadaan</Button>
                                                        <div className="txtCart">
                                                            <div>
                                                                <div className="nameCart">{item.nama}</div>
                                                                <div className="noCart">kategori: {item.kategori}</div>
                                                                <div className="noCart">Price: {item.price}</div>
                                                                <div className="noCart">Tipe: {item.tipe === 'gudang' ? 'Sewa Gudang' : "Barang"}</div>
                                                                <div className="noCart">Qty: {item.qty}</div>
                                                            </div>
                                                            <Button color="primary" onClick={() => this.proseModalRinci(item)}>Rincian</Button>
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
                                    {dataCart.length === 0 ? (
                                        <div></div>
                                    ) : (
                                        <Col md={4} xl={4} sm={12} className="mt-5">
                                            <div className="sideSum">
                                                <div className="titSum">Cart summary</div>
                                                <div className="txtSum">
                                                    <div className="totalSum">Total Item</div>
                                                    <div className="angkaSum">{dataCart.length}</div>
                                                </div>
                                                <button className="btnSum" disabled={dataCart.length === 0 ? true : false } onClick={() => this.submitCart()}>Submit</button>
                                            </div>
                                        </Col>
                                    )}
                                </Row>
                            </div>
                        </div>
                    </MaterialTitlePanel>
                </Sidebar>
                <Modal isOpen={this.state.add} toggle={this.prosesAdd}>
                    <ModalHeader>Add Item</ModalHeader>
                    <Formik
                    initialValues={{
                    nama: "",
                    price: "",
                    qty: "",
                    kategori: "",
                    tipe: "",
                    akta: null,
                    start: null,
                    end: null
                    }}
                    validationSchema={cartSchema}
                    onSubmit={(values) => {this.addCart(values)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
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
                                    <option value="gudang">Sewa Gudang</option>
                                    <option value="barang">Barang</option>
                                </Input>
                                {errors.tipe ? (
                                    <text className={style.txtError}>Must be filled</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Price
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="price"
                                value={values.price}
                                onBlur={handleBlur("price")}
                                onChange={handleChange("price")}
                                />
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
                                <Button className="mr-2" disabled={values.tipe === 'gudang' && (values.akta === null || values.akta === "null" || values.start === null || values.end === null)  ? true : false} onClick={handleSubmit} color="primary">Save</Button>
                                <Button className="mr-3" onClick={this.prosesAdd}>Cancel</Button>
                            </div>
                        </div>
                    </ModalBody>
                        )}
                    </Formik>
                </Modal>
                <Modal isOpen={this.state.rinci} toggle={this.prosesRinci}>
                <ModalHeader toggle={this.openModalAdd}>Rincian item</ModalHeader>
                    <Formik
                    initialValues={{
                    nama: "",
                    price: "",
                    qty: "",
                    kategori: "",
                    }}
                    validationSchema={cartSchema}
                    onSubmit={(values) => {this.addCart(values)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                    <ModalBody>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Deskripsi
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="nama"
                                value={dataRinci.nama}
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
                                value={dataRinci.tipe}
                                onChange={handleChange("tipe")}
                                onBlur={handleBlur("tipe")}
                                >   
                                    <option>-Pilih Tipe-</option>
                                    <option value="gudang">Sewa Gudang</option>
                                    <option value="barang">Barang</option>
                                </Input>
                                {errors.tipe ? (
                                    <text className={style.txtError}>Must be filled</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Price
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="price"
                                value={dataRinci.price}
                                onBlur={handleBlur("price")}
                                onChange={handleChange("price")}
                                />
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
                                value={dataRinci.qty}
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
                                value={dataRinci.kategori}
                                onChange={handleChange("kategori")}
                                onBlur={handleBlur("kategori")}
                                >   
                                    <option>-Pilih Status-</option>
                                    <option value="budget">Budget</option>
                                    <option value="non-budget">Non Budget</option>
                                    <option value="return">Return</option>
                                </Input>
                                {errors.kategori ? (
                                    <text className={style.txtError}>Must be filled</text>
                                ) : null}
                            </div>
                        </div>
                        {dataRinci.tipe === 'gudang' && (
                            <>
                                <div className="headReport">
                                    <text className="col-md-3">Periode</text>
                                    <div className="optionType col-md-9">
                                        <Input 
                                        type="name" 
                                        name="start" 
                                        onChange={handleChange("start")}
                                        onBlur={handleBlur("start")}
                                        value={dataRinci.start.slice(0, 10)}
                                        ></Input>
                                        <text className="toColon mr-2 ml-2">To</text>
                                        <Input 
                                        type="name" 
                                        name="end" 
                                        value={dataRinci.end.slice(0, 10)}
                                        onChange={handleChange("end")}
                                        onBlur={handleBlur("end")}
                                        ></Input>
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
                                        value={dataRinci.akta}
                                        onChange={handleChange("akta")}
                                        onBlur={handleBlur("akta")}
                                        >   
                                            <option value="null">-Pilih-</option>
                                            <option value="ada">Ada</option>
                                            <option value="tidak">Tidak ada</option>
                                        </Input>
                                    </div>
                                </div>
                            </>
                        )}
                        <hr/>
                        <div className={style.foot}>
                            <div>
                                <Button color="success" className="mr-3" onClick={this.openDoc}>Dokumen</Button>
                            </div>
                            <div>
                                {/* <Button className="mr-2" onClick={handleSubmit} color="primary">Save</Button> */}
                                <Button className="mr-3" onClick={this.prosesRinci}>Cancel</Button>
                            </div>
                        </div>
                    </ModalBody>
                        )}
                    </Formik>
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
                <Modal isOpen={this.props.pengadaan.isLoading ? true: false} size="sm">
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
            <Modal isOpen={this.state.modalConfirm} toggle={this.openConfirm} size="sm">
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
    mutasi: state.mutasi,
    pengadaan: state.pengadaan
})

const mapDispatchToProps = {
    logout: auth.logout,
    getCart: pengadaan.getCart,
    deleteCart: pengadaan.deleteCart,
    submitCart: pengadaan.submitCart,
    addCart: pengadaan.addCart,
    updateCart: pengadaan.updateCart,
    showDokumen: pengadaan.showDokumen,
    getDocCart: pengadaan.getDocCart,
    uploadDocument: pengadaan.uploadDocument,
    resetError: pengadaan.resetError
}

export default connect(mapStateToProps, mapDispatchToProps)(CartMutasi)
