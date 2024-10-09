/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { Component } from 'react'
import { FaUserCircle, FaBars, FaTrash } from 'react-icons/fa'
import style from '../../assets/css/input.module.css'
import {NavbarBrand, Row, Col, Button, Input, Modal, ModalBody, ModalHeader, Spinner, Table, ModalFooter} from 'reactstrap'
import SidebarContent from "../../components/sidebar_content"
import Sidebar from "../../components/Header"
import MaterialTitlePanel from "../../components/material_title_panel"
import mutasi from '../../redux/actions/mutasi'
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
            kode: ''
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
    }

    chooseDepo = (e) => {
        this.setState({kode: e.value})
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
        await this.props.getMutasi(token, 1)
    }

    getDataAsset = async (value) => {
        const token = localStorage.getItem("token")
        const { page } = this.props.asset
        const search = value === undefined ? '' : this.state.search
        const limit = value === undefined ? this.state.limit : value.limit
        await this.props.getAsset(token, limit, search, page.currentPage, 'mutasi')
        await this.props.getMutasi(token, 1)
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
            // dataDepo.map(item => {
            //     return (
            //         // 
            //     )
            // })
            for (let i = 0; i < dataDepo.length; i++) {
                if (dataDepo[i].kode_plant !== kode) {
                    temp.push({value: dataDepo[i].kode_plant, label: dataDepo[i].kode_plant + '-' + dataDepo[i].nama_area})
                }
            }
            this.setState({options: temp})
        }
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
        this.setState({rinci: !this.state.rinci})
    }

    addMutasi = async () => {
        const token = localStorage.getItem("token")
        const { page } = this.props.asset
        const search =  ''
        const limit = this.state.limit
        const {kode, dataRinci} = this.state
        if (kode === '') {
            console.log('pilih tujuan depo')
        } else {
            await this.props.addMutasi(token, dataRinci.no_asset, kode)
            await this.props.getAsset(token, limit, search, page.currentPage, 'mutasi')
            await this.props.getMutasi(token, 1)
            this.openRinciAdmin()
        }
    }

    render() {
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const {dataMut} = this.props.mutasi
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
                <Sidebar {...sidebarProps}>
                    <MaterialTitlePanel title={contentHeader}>
                    <div className={style.backgroundLogo}>
                            <div className={style.bodyDashboard}>
                                <div className={style.headMaster}>
                                    <div className={style.titleDashboard}>Draft Pengajuan Mutasi</div>
                                </div>
                                <div className={style.secEmail}>
                                    <div className='rowGeneral'>
                                        <Button size='lg' color="primary" onClick={this.prosesOpenAdd}>Add</Button>
                                        <Button size='lg' className='ml-2' color="success" disabled={dataMut.length === 0 ? true : false } onClick={() => this.openAgree()}>Submit</Button>
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
                                                {/* <th>STATUS</th> */}
                                                <th>OPSI</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {dataMut.length !== 0 && dataMut.map(item => {
                                            return (
                                                <tr>
                                                    <td>{dataMut.indexOf(item) + 1}</td>
                                                    <td>{item.area_rec}</td>
                                                    <td>{item.nama_asset}</td>
                                                    <td>{item.no_asset}</td>
                                                    <td>{item.dataAsset.nilai_buku === null || item.dataAsset.nilai_buku === '' ? '0' : item.dataAsset.nilai_buku}</td>
                                                    <td>{item.kategori}</td>
                                                    {/* <td>{item.status === '1' ? 'On Proses Disposal' : item.status === '11' ? 'On Proses Mutasi' : 'available'}</td> */}
                                                    <td>
                                                        <Button color="primary" onClick={() => this.prosesRinci(item)}>Rincian</Button>
                                                        <Button color="danger" className='ml-2' onClick={() => this.deleteItem(item.no_asset)}>Delete</Button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                        </tbody>
                                    </Table>
                                    {dataMut.length === 0 && (
                                        <div className={style.spin}>
                                            <text className='textInfo'>Data ajuan belum ditambahkan</text>
                                        </div>
                                    )}
                                </div>
                                {/* <Row className="cartDisposal">
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
                                                    <Button color="warning" onClick={() => this.openRinciAdmin(this.setState({dataRinci: item, kode: '', img: item.pict.length > 0 ? item.pict[0].path : ''}))}>Mutasi</Button>
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
                <Modal isOpen={this.state.rinci} toggle={this.openRinciAdmin} size="xl">
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
                            onSubmit={(values) => {this.addMutasi(values)}}
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
                                                    <div className="ml-2"><input type="checkbox" checked={dataRinci.kategori === 'IT' ? true : false}/> IT</div>
                                                    <div className="ml-3"><input type="checkbox" checked={dataRinci.kategori === 'NON IT' ? true : false}/> NON IT</div>
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
                                        <Row  className="mb-3 rowRinci">
                                            <Col md={3}>Area Tujuan</Col>
                                            <Col md={9} className="colRinci">:
                                                <Select
                                                    className="col-md-12"
                                                    options={this.state.options}
                                                    onChange={this.chooseDepo}
                                                />
                                            </Col>
                                        </Row>
                                        {this.state.kode === '' ? (
                                            <text className={style.txtError}>Must be filled</text>
                                        ) : null}
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
                {/* <Modal isOpen={this.state.rinci} toggle={this.openRinciMutasi} size="xl">
                    <ModalHeader>
                        Proses Mutasi
                    </ModalHeader>
                    <ModalBody>
                        <div className="mainRinci">
                            <div className="leftRinci">
                            <img src={placeholder} className="imgRinci" />
                                <div className="secImgSmall">
                                    <button className="btnSmallImg">
                                        <img src={placeholder} className="imgSmallRinci" />
                                    </button>
                                </div>
                            </div>
                            <Formik
                            initialValues = {{
                                kode_plant: 'king'
                            }}
                            validationSchema = {mutasiSchema}
                            onSubmit={(values) => {this.addMutasi(values)}}
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
                                                    <div className="ml-2"><input type="checkbox" checked={dataRinci.kategori === 'IT' ? true : false}/> IT</div>
                                                    <div className="ml-3"><input type="checkbox" checked={dataRinci.kategori === 'NON IT' ? true : false}/> NON IT</div>
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
                                        <Row  className="mb-3 rowRinci">
                                            <Col md={3}>Area Tujuan</Col>
                                            <Col md={9} className="colRinci">:
                                                <Select
                                                    className="col-md-12"
                                                    options={this.state.options}
                                                    onChange={this.chooseDepo}
                                                />
                                            </Col>
                                        </Row>
                                        {this.state.kode === '' ? (
                                            <text className={style.txtError}>Must be filled</text>
                                        ) : null}
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
                </Modal> */}
            </>
        )
    }
}

const mapStateToProps = state => ({
    mutasi: state.mutasi,
    asset: state.asset,
    depo: state.depo,
})

const mapDispatchToProps = {
    logout: auth.logout,
    getMutasi: mutasi.getMutasi,
    deleteMutasi: mutasi.deleteMutasi,
    submitMutasi: mutasi.submitMutasi,
    getApproveMut: mutasi.getApproveMutasi,
    getAsset: asset.getAsset,
    getDetailDepo: depo.getDetailDepo,
    getDocumentMut: mutasi.getDocumentMut,
    resetAddMut: mutasi.resetAddMut,
    getDepo: depo.getDepo,
    addMutasi: mutasi.addMutasi,
}

export default connect(mapStateToProps, mapDispatchToProps)(CartMutasi)
