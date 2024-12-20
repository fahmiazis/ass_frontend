/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { Component } from 'react'
import {NavbarBrand, Input, Button, Row, Col,
    Modal, ModalHeader, ModalBody, ModalFooter, Container, Alert, Spinner, Table} from 'reactstrap'
import style from '../../assets/css/input.module.css'
import {FaUserCircle, FaBars, FaTrash} from 'react-icons/fa'
import {AiOutlineCheck, AiOutlineClose} from 'react-icons/ai'
import {BsCircle} from 'react-icons/bs'
import {Formik} from 'formik'
import * as Yup from 'yup'
import disposal from '../../redux/actions/disposal'
import pengadaan from '../../redux/actions/pengadaan'
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
            isAdd: false
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
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

    openProsesModalDoc = async () => {
        const token = localStorage.getItem('token')
        const { dataRinci } = this.state
        await this.props.getDocumentDis(token, dataRinci.no_asset, 'disposal', 'pengajuan')
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

    openConfirm = () => {
        this.setState({modalConfirm: !this.state.modalConfirm})
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
        await this.props.addDisposal(token, value)
        this.getDataCart()
    }

    addSell = async (value) => {
        const token = localStorage.getItem("token")
        await this.props.addSell(token, value)
        this.getDataCart()
    }

    getDataCart = async () => {
        const token = localStorage.getItem('token')
        const page = 1
        const search = ''
        const limit = 1000
        await this.props.getAsset(token, limit, search, page, 'disposal')
        await this.props.getCartDisposal(token)
    }

    componentDidUpdate() {
        const {isError, isUpload, isSubmit} = this.props.disposal
        const token = localStorage.getItem('token')
        const {dataRinci} = this.state
        if (isError) {
            this.props.resetError()
            this.showAlert()
        } else if (isUpload) {
            setTimeout(() => {
                this.props.resetError()
             }, 1000)
             setTimeout(() => {
                this.props.getDocumentDis(token, dataRinci.no_asset, 'disposal', 'pengajuan')
             }, 1100)
        } else if (isSubmit) {
            this.props.resetError()
            setTimeout(() => {
                this.getDataDisposal()
             }, 1000)
        }
    }

    submitDis = async () => {
        const token = localStorage.getItem('token')
        const { dataCart } = this.props.disposal
        const cek = []
        for (let i = 0; i < dataCart.length; i++) {
            if (dataCart[i].keterangan === null || dataCart[i].nilai_jual === null ) {
                cek.push(dataCart[i].keterangan)              
            }
        }
        if (cek.length > 0) {
            this.setState({confirm: 'failSubmit'})
            this.openConfirm()
        } else {
            await this.props.submitDisposal(token)
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

    updateDataDis = async (value) => {
        const token = localStorage.getItem('token')
        const { dataRinci } = this.state
        await this.props.updateDisposal(token, dataRinci.id, value, 'disposal')
        this.getDataDisposal()
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
                <Sidebar {...sidebarProps}>
                    <MaterialTitlePanel title={contentHeader}>
                        <div className={style.backgroundLogo}>
                            <div className={style.bodyDashboard}>
                                {/* <Alert color="danger" className={style.alertWrong} isOpen={alert}>
                                    <div>{alertMsg}</div>
                                    <div>{alertM}</div>
                                    {alertUpload !== undefined && alertUpload.map(item => {
                                        return (
                                            <div>{item}</div>
                                        )
                                    })}
                                </Alert> */}
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
                                                    <td>{item.nilai_buku}</td>
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
                                {/* <Row className="cartDisposal">
                                    {dataCart.length === 0 ? (
                                        <Col md={8} xl={8} sm={12}>
                                            <div className="txtDisposEmpty">Disposal Data is empty</div>
                                        </Col>
                                    ) : (
                                        <Col md={8} xl={8} sm={12} className="mb-5 mt-5">
                                        {dataCart.length !== 0 && dataCart.map(item => {
                                            return (
                                                <div className="cart">
                                                    <div className="navCart">
                                                        <img src={item.pict.length > 0 ? `${REACT_APP_BACKEND_URL}/${item.pict[0].path}` : placeholder} className="cartImg" />
                                                        <Button className="labelBut" color="warning" size="sm">{item.nilai_jual === '0' ? 'Pemusnahan' : 'Penjualan'}</Button>
                                                        <div className="txtCart">
                                                            <div>
                                                                <div className="nameCart">{item.nama_asset}</div>
                                                                <div className="noCart">No asset {item.no_asset}</div>
                                                            </div>
                                                            <Button color="primary" onClick={() => this.prosesRinci(item)}>Rincian</Button>
                                                        </div>
                                                    </div>
                                                    <div className="footCart">
                                                        <div><FaTrash size={20} onClick={() => this.deleteItem(item.no_asset)} className="txtError"/></div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </Col>
                                    )}
                                    <Col md={4} xl={4} sm={12} className="mt-5">
                                        <div className="sideSum">
                                            <div className="titSum">Disposal summary</div>
                                            <div className="txtSum">
                                                <div className="totalSum">Total Item</div>
                                                <div className="angkaSum">{dataCart.length}</div>
                                            </div>
                                            <button className="btnSum" disabled={dataCart.length === 0 ? true : false } onClick={() => this.submitDis()}>Submit</button>
                                        </div>
                                    </Col>
                                </Row> */}
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
                </Sidebar>
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
                                        <Button className="btnFootRinci1" size="lg" color="primary" onClick={handleSubmit}>Save</Button>
                                        <Button className="btnFootRinci1" size="lg" color="success" onClick={this.openProsesModalDoc}>Upload Doc</Button>
                                        <Button className="btnFootRinci1" size="lg" color="secondary" onClick={() => this.openModalRinci()}>Close</Button>
                                    </div>
                                </div>
                            )}
                            </Formik>
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
                                        <td>{item.nilai_buku}</td>
                                        <td>{item.kategori}</td>
                                        <td>{item.status === '1' ? 'On Proses Disposal' : item.status === '11' ? 'On Proses Mutasi' : 'available'}</td>
                                        <td>
                                            {item.status === '1' || item.status === '11' ? '-' :
                                            (
                                                <>
                                                    <Button color="warning" onClick={() => this.addSell(item.no_asset)}>Jual</Button>
                                                    <Button className='ml-1' color="info" onClick={() => this.addDisposal(item.no_asset)}>Pemusnahan</Button>
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
                <Modal isOpen={this.props.disposal.isLoading ? true: false} size="sm">
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
                    ) : (
                        <div></div>
                    ) 
                    }
                </ModalBody>
            </Modal>
            {/* <Modal isOpen={this.state.preview} toggle={this.modalPeng} size="xl">
                <ModalBody>
                    <div>PT. Pinus Merah Abadi</div>
                    <div className="modalDis">
                        <text className="titleModDis">Form Pengajuan Disposal Asset</text>
                    </div>
                    <div className="mb-2"><text className="txtTrans">{dataCart[0] !== undefined && dataCart[0].area}</text>, {moment(dataCart[0] !== undefined && dataCart[0].createdAt).locale('idn').format('DD MMMM YYYY ')}</div>
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
                        {dataCart[0] === undefined ? "" :
                        dataCart[0].status_depo === "Cabang Scylla" || dataCart[0].status_depo === "Cabang SAP" ? "Cabang" : "Depo"}
                        </Col>
                        <Col md={10} className="txtTrans">
                        : {dataCart[0] !== undefined && dataCart[0].area}
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
                                <th>Status Depo</th>
                                <th>Cost Center</th>
                                <th>Nilai Buku</th>
                                <th>Nilai Jual</th>
                                <th>Keterangan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataCart.length !== 0 && dataCart.map(item => {
                                return (
                                    <tr>
                                        <th scope="row">{dataCart.indexOf(item) + 1}</th>
                                        <td>{item.no_asset}</td>
                                        <td>{item.nama_asset}</td>
                                        <td>{item.merk}</td>
                                        <td>{item.kategori}</td>
                                        <td>{item.status_depo}</td>
                                        <td>{item.cost_center}</td>
                                        <td>{item.nilai_buku}</td>
                                        <td>{item.nilai_jual}</td>
                                        <td>{item.keterangan}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </ModalBody>
                <hr />
                <div className="modalFoot ml-3">
                    <div></div>
                    <div className="btnFoot">
                        <Button className="mr-2" color="primary">
                            Submit
                        </Button>
                        <Button color="success" onClick={this.modalPeng}>
                            Close
                        </Button>
                    </div>
                </div>
            </Modal> */}
            </>
        )
    }
}

const mapStateToProps = state => ({
    disposal: state.disposal,
    pengadaan: state.pengadaan,
    asset: state.asset
})

const mapDispatchToProps = {
    logout: auth.logout,
    getCartDisposal: disposal.getCartDisposal,
    submitDisposal: disposal.submitDisposal,
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
}

export default connect(mapStateToProps, mapDispatchToProps)(CartDisposal)
