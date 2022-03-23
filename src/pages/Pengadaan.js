import React, { Component } from 'react'
import {VscAccount} from 'react-icons/vsc'
import Sidebar from '../components/Sidebar'
import {Table, Modal, Container, Col, Row, Form, Button} from 'react-bootstrap'
import {Alert, Spinner, Input} from 'reactstrap'
import logo from '../assets/img/logo.png'
import OtpInput from "react-otp-input";
import {connect} from 'react-redux'
import pengadaan from '../redux/actions/pengadaan'
import style from '../assets/css/input.module.css'
import {Formik} from 'formik'
import * as Yup from 'yup'
import Pdf from "../components/Pdf"
import moment from 'moment'
import {BsCircle, BsDashCircleFill, BsFillCircleFill} from 'react-icons/bs'
import {AiOutlineFileExcel, AiFillCheckCircle, AiOutlineCheck, AiOutlineClose} from 'react-icons/ai'

const {REACT_APP_BACKEND_URL} = process.env

const alasanSchema = Yup.object().shape({
    alasan: Yup.string().required()
});

class Pengadaan extends Component {
    state = {
        openModalIo: false,
        openModalTtd: false,
        openModalDoc: false,
        value: "",
        profit: "",
        io: "",
        data: [],
        index: 0,
        detail: {},
        errMsg: '',
        upload: false,
        openApprove: false,
        openReject: false,
        openPdf: false,
        fileName: {},
        date: '',
        idDoc: 0,
        alert: false
    }

    openModalPdf = () => {
        this.setState({openPdf: !this.state.openPdf})
        this.setState({openModalDoc: !this.state.openModalDoc})
    }

    showAlert = () => {
        this.setState({alert: true})
       
         setTimeout(() => {
            this.setState({
                alert: false
            })
         }, 10000)
    }

    prosesModalIo = () => {
        this.setState({openModalIo: !this.state.openModalIo})
    }

    openModalApprove = () => {
        this.setState({openApprove: !this.state.openApprove})
    }
    openModalReject = () => {
        this.setState({openReject: !this.state.openReject})
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

    approveDokumen = async () => {
        const {fileName} = this.state
        const {isUpdate} = this.props.pengadaan
        const token = localStorage.getItem('token')
        await this.props.approveDocument(token, fileName.id)
        this.setState({openApprove: !this.state.openApprove})
        this.openModalPdf()
    }

    rejectDokumen = async (value) => {
        const {fileName} = this.state
        const {isUpdate} = this.props.pengadaan
        const token = localStorage.getItem('token')
        await this.props.rejectDocument(token, fileName.id, value)
        this.setState({openReject: !this.state.openReject})
        this.openModalPdf()
    }

    onChangeUpload = e => {
        const {size, type} = e.target.files[0]
        this.setState({fileUpload: e.target.files[0]})
        if (size >= 20000000) {
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
            this.props.uploadDocument(token, detail.id, data)
        }
    }

    uploadAlert = () => {
        this.setState({upload: true})
       
         setTimeout(() => {
            this.setState({
                upload: false
            })
         }, 10000)
    }

    closeProsesModalDoc = () => {
        this.setState({openModalDoc: !this.state.openModalDoc})
        this.setState({openModalIo: !this.state.openModalIo})
    }

    prosesModalDoc = async () => {
        const {data} = this.state
        const token = localStorage.getItem('token')
        await this.props.getDocumentIo(token, data[0].no_pengadaan)
        this.setState({openModalDoc: !this.state.openModalDoc})
        this.setState({openModalIo: !this.state.openModalIo})
    }

    prosesModalTtd = () => {
        this.setState({openModalTtd: !this.state.openModalTtd})
        this.setState({openModalIo: !this.state.openModalIo})
    }

    prepareFormIo = async (x) => {
        const {dataPeng} = this.props.pengadaan
        this.setState({data: dataPeng[x]})
        const data = dataPeng[x]
        const token = localStorage.getItem('token')
        await this.props.getApproveIo(token, data.no_pengadaan)
        this.prosesModalIo()
    }

    onChange = value => {
        this.setState({value: value})
    }

    componentDidMount() {
        this.getPengadaan()
    }

    getPengadaan = async () => {
        const token = localStorage.getItem('token')
        this.props.getPengadaan(token)
    }

    componentDidUpdate() {
        const {isError, isUpload, isUpdate} = this.props.pengadaan
        const {data} = this.state
        const token = localStorage.getItem('token')
        if (isError) {
            this.props.resetError()
            this.showAlert()
        } else if (isUpload) {
            setTimeout(() => {
                this.props.resetError()
                // this.setState({modalUpload: false})
             }, 2000)
             setTimeout(() => {
                this.props.getDocumentIo(token, data[0].no_pengadaan)
             }, 2100)
        } else if (isUpdate) {
            setTimeout(() => {
                this.props.resetError()
                // this.setState({modalUpload: false})
             }, 2000)
             setTimeout(() => {
                this.props.getDocumentIo(token, data[0].no_pengadaan)
             }, 2100)
        }
    }

    render() {
        const {dataPeng, isLoading, isError, dataApp, dataDoc} = this.props.pengadaan
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        return (
            <>
            <div className="bodyHome">
                <div className="leftHome">
                    <Sidebar />
                </div>
                <div className="rightHome">
                    <div className="bodyAkun">
                        <div></div>
                        <div className="akun">
                            <VscAccount size={30} className="mr-2" />
                            <text>{level === '1' ? 'Super Admin' : names}</text>
                        </div>
                    </div>
                    <div>
                        <div className="titHome">Pengadaan asset</div>
                        <div className="mainPeng">
                            <Table bordered striped responsive hover className="tab">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Description</th>
                                        <th>Price/Unit</th>
                                        <th>Quantity</th>
                                        <th>Total Amount</th>
                                        <th>Kode Plant</th>
                                        <th>Kelengkapan Dokumen</th>
                                        <th>Approvement</th>
                                    </tr>
                                </thead>
                                {dataPeng !== undefined && dataPeng.map(x => {
                                    return (
                                <tbody>
                                    <tr onClick={() => this.prepareFormIo(dataPeng.indexOf(x))}>
                                        <td>{dataPeng.indexOf(x) + 1}</td>
                                        <td>{x.nama}</td>
                                        <td>{x.price}</td>
                                        <td>{x.qty}</td>
                                        <td>Rp {x.price}</td>
                                        <td>{x.kode_plant}</td>
                                        <td>-</td>
                                        <td>0/8</td>
                                    </tr>
                                </tbody>
                                )
                            })}
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
            <Modal size="xl" show={this.state.openModalIo} onHide={this.prosesModalIo}>
                <Modal.Body className="mb-5">
                    <Container>
                        <Row className="rowModal">
                            <Col md={3} lg={3}>
                                <img src={logo} className="imgModal" />
                            </Col>
                            <Col md={9} lg={9}>
                                <text className="titModal">FORM INTERNAL ORDER ASSET</text>
                            </Col>
                        </Row>
                        <div className="mt-4 mb-3">Io type:</div>
                        <div className="mb-4">
                            <Form.Check 
                                type="checkbox"
                                label="CB-20 IO Capex"
                            />
                        </div>
                        <Row className="rowModal">
                            <Col md={2} lg={2}>
                                Nomor IO
                            </Col>
                            <Col md={10} lg={10} className="colModal">
                            <text className="mr-3">:</text>
                            <OtpInput
                                value={this.state.value}
                                onChange={this.onChange}
                                numInputs={11}
                                inputStyle={style.otp}
                                containerStyle={style.containerOtp}
                            />
                            </Col>
                        </Row>
                        <Row className="mt-4">
                            <Col md={2} lg={2}>
                                Deskripsi
                            </Col>
                            <Col md={10} lg={10} className="colModalTab">
                                <text className="mr-3">:</text>
                                <Table bordered stripped responsive>
                                    <thead>
                                        <tr>
                                            <th>Qty</th>
                                            <th>Description</th>
                                            <th>Price/unit</th>
                                            <th>Total Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* <tr>
                                            <td>4300002670</td>
                                            <td>1</td>
                                            <td>Printer Epson L3110 PMA Banyuwangi</td>
                                            <td>2.200.000</td>
                                            <td>Rp 2.200.000</td>
                                        </tr> */}
                                            <tr>
                                                <td>{this.state.data.qty}</td>
                                                <td>{this.state.data.nama}</td>
                                                <td>{this.state.data.price}</td>
                                                <td>Rp {parseInt(this.state.data.price) * parseInt(this.state.data.qty)}</td>
                                            </tr>
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                        <Row className="rowModal mt-4">
                            <Col md={2} lg={2}>
                                Cost Center
                            </Col>
                            <Col md={10} lg={10} className="colModal">
                            <text className="mr-3">:</text>
                            <OtpInput
                                value={this.state.value}
                                onChange={this.onChange}
                                numInputs={10}
                                inputStyle={style.otp}
                                containerStyle={style.containerOtp}
                            />
                            </Col>
                        </Row>
                        <Row className="rowModal mt-2">
                            <Col md={2} lg={2}>
                                Profit Center
                            </Col>
                            <Col md={10} lg={10} className="colModal">
                            <text className="mr-3">:</text>
                            <OtpInput
                                value={this.state.value}
                                onChange={this.onChange}
                                numInputs={7}
                                inputStyle={style.otp}
                                containerStyle={style.containerOtp}
                            />
                            </Col>
                        </Row>
                        <Row className="rowModal mt-4">
                            <Col md={2} lg={2}>
                                Kategori
                            </Col>
                            <Col md={10} lg={10} className="colModal">
                            <text className="mr-3">:</text>
                                <Col md={4} lg={4}>
                                    <Form.Check 
                                        type="checkbox"
                                        label="Budget"
                                    />
                                </Col>
                                <Col md={4} lg={4}>
                                    <Form.Check 
                                        type="checkbox"
                                        label="Non Budgeted"
                                    />
                                </Col>
                                <Col md={4} lg={4}>
                                    <Form.Check 
                                        type="checkbox"
                                        label="Return"
                                    />
                                </Col>
                            </Col>
                        </Row>
                        <Row className="rowModal mt-4">
                            <Col md={2} lg={2}>
                                Amount
                            </Col>
                            <Col md={10} lg={10} className="colModal">
                            <text className="mr-3">:</text>
                            <text>Rp 2.200.000</text>
                            </Col>
                        </Row>
                        <Row className="rowModal mt-4">
                            <Col md={2} lg={2}>
                                Alasan
                            </Col>
                            <Col md={10} lg={10} className="colModal">
                            <text className="mr-3">:</text>
                            <text>Pengganti printer yang rusak</text>
                            </Col>
                        </Row>
                        <div className="titik mt-4">.............................., ..................</div>
                        <Row className="rowModal mt-1">
                                <Col lg={2} xl={2}>
                                    <div className="ml-3">Dibuat oleh</div>
                                    <div className="nameTtd2">
                                    <div className="btnTtd">
                                        <button className="file-upload" onClick={this.prosesModalTtd}>
                                            Approve
                                        </button>
                                    </div>
                                        <div>
                                            <text className="kurung">(....................)</text>
                                        </div>
                                        <div>
                                            AOS
                                        </div>
                                    </div>
                                </Col>
                            <Col lg={3} xl={3}>
                                <div>Diperiksa oleh</div>
                                <Row>
                                    <div>
                                        <div className="nameTtd2">
                                            <div className="btnTtd">
                                                <button className="file-upload" onClick={this.prosesModalTtd}>
                                                    Approve
                                                </button>
                                            </div>
                                            <div>
                                                <text className="kurung">(....................)</text>
                                            </div>
                                            <div>
                                                ROM
                                            </div>
                                        </div>
                                    </div>
                                    <div className="marTtd">
                                        <div className="nameTtd2">
                                            <div className="btnTtd">
                                                <button className="file-upload" onClick={this.prosesModalTtd}>
                                                    Approve
                                                </button>
                                            </div>
                                            <div>
                                                <text className="kurung">(....................)</text>
                                            </div>
                                            <div>
                                                GROM
                                            </div>
                                        </div>
                                    </div>
                                </Row>
                            </Col>
                            <Col lg={7} xl={7}>
                                <div className="setujuTtd">
                                    <text className="txtSetuju">Disetujui oleh</text>
                                </div>
                                <Row>
                                    <div className="marTtd">
                                        <div className="nameTtd2">
                                            <div className="btnTtd">
                                                <button className="file-upload" onClick={this.prosesModalTtd}>
                                                    Approve
                                                </button>
                                            </div>
                                            <div>
                                                <text className="kurung">(....................)</text>
                                            </div>
                                            <div>
                                                DH OPS
                                            </div>
                                        </div>
                                    </div>
                                    <div className="marTtd">
                                        <div className="nameTtd2">
                                            <div className="btnTtd">
                                                <button className="file-upload" onClick={this.prosesModalTtd}>
                                                    Approve
                                                </button>
                                            </div>
                                            <div>
                                                <text className="kurung">(....................)</text>
                                            </div>
                                            <div>
                                                NFAM
                                            </div>
                                        </div>
                                    </div>
                                    <div className="marTtd">
                                        <div className="nameTtd2">
                                            <div className="btnTtd">
                                                <button className="file-upload" onClick={this.prosesModalTtd}>
                                                    Approve
                                                </button>
                                            </div>
                                            <div>
                                                <text className="kurung">(....................)</text>
                                            </div>
                                            <div>
                                                DH FA
                                            </div>
                                        </div>
                                    </div>
                                    <div className="marTtd">
                                        <div className="nameTtd2">
                                            <div className="btnTtd">
                                                <button className="file-upload" onClick={this.prosesModalTtd}>
                                                    Approve
                                                </button>
                                            </div>
                                            <div>
                                                <text className="kurung">(....................)</text>
                                            </div>
                                            <div>
                                                DH HC
                                            </div>
                                        </div>
                                    </div>
                                    <div className="marTtd">
                                        <div className="nameTtd2">
                                            <div className="btnTtd">
                                                <button className="file-upload" onClick={this.prosesModalTtd}>
                                                    Approve
                                                </button>
                                            </div>
                                            <div>
                                                <text className="kurung">(....................)</text>
                                            </div>
                                            <div>
                                                CM
                                            </div>
                                        </div>
                                    </div>
                                </Row>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
                <hr />
                <div className="modalFoot">
                    <div>
                        <Button className="ml-4" variant="success" onClick={this.prosesModalDoc}>
                            Dokumen 
                        </Button>
                    </div>
                    <div className="btnFoot">
                        <Button className="mr-2" variant="secondary" onClick={this.prosesModalIo}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.prosesModalIo}>
                            Save 
                        </Button>
                    </div>
                </div>
            </Modal>
            <Modal size="md" show={this.state.openModalTtd} onHide={this.prosesModalTtd}>
                <Modal.Header>
                    Proses Tanda Tangan
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col md={3} lg={3}>
                            Nama
                        </Col>
                        <Col md={9} lg={9}>
                            : <input />
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.prosesModalTtd}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={this.prosesModalTtd}>
                        Save 
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal size="xl" show={this.state.openModalDoc} onHide={this.closeProsesModalDoc}>
                <Modal.Header>
                   Kelengkapan Dokumen
                </Modal.Header>
                <Modal.Body>
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
                                            <input
                                            className="ml-4"
                                            type="file"
                                            onClick={() => this.setState({detail: x})}
                                            onChange={this.onChangeUpload}
                                            />
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
                </Modal.Body>
                <Modal.Footer>
                    <Button className="mr-2" variant="secondary" onClick={this.closeProsesModalDoc}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.closeProsesModalDoc}>
                            Save 
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={this.props.pengadaan.isLoading ? true: false} size="sm">
                <Modal.Body>
                    <div>
                        <div className={style.cekUpdate}>
                            <Spinner />
                            <div sucUpdate>Waiting....</div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal show={this.props.pengadaan.isUpload ? true: false} size="sm">
                <Modal.Body>
                    <div>
                        <div className={style.cekUpdate}>
                            <AiFillCheckCircle size={80} className={style.green} />
                            <div className={[style.sucUpdate, style.green]}>Success</div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal show={this.state.openPdf} size="xl" onHide={this.openModalPdf} centered={true}>
                <Modal.Header>Dokumen</Modal.Header>
                    <Modal.Body>
                        <div className={style.readPdf}>
                            <Pdf pdf={`${REACT_APP_BACKEND_URL}/show/doc/${this.state.idDoc}`} />
                        </div>
                        <hr/>
                        <div className={style.foot}>
                            <div>
                                {/* <div>{moment(this.state.date).format('LLL')}</div> */}
                                <Button variant="success">Download</Button>
                            </div>
                        {level === '1' || level === '2' || level === '3' ? (
                            <div>
                                <Button variant="danger" className="mr-3" onClick={this.openModalReject}>Reject</Button>
                                <Button variant="primary" onClick={this.openModalApprove}>Approve</Button>
                            </div>
                            ) : (
                                <Button variant="primary" onClick={() => this.setState({openPdf: false})}>Close</Button>
                            )}
                        </div>
                    </Modal.Body>
                    {/* {level === '1' || level === '2' || level === '3' ? (
                    
                    <ModalFooter>
                        <div>{moment(this.state.date).format('LL')}</div>
                        <Button color="danger" onClick={this.openModalReject}>Reject</Button>
                        <Button color="primary" onClick={this.openModalApprove}>Approve</Button>
                    </ModalFooter>
                    ) : (
                    <ModalFooter>
                        <Button color="primary" onClick={() => this.setState({openPdf: false})}>Close</Button>
                    </ModalFooter>)} */}
                </Modal>
                <Modal show={this.state.openApprove} onHide={this.openModalApprove} centered={true}>
                    <Modal.Body>
                        <div className={style.modalApprove}>
                            <div>
                                <text>
                                    Anda yakin untuk approve 
                                    <text className={style.verif}> {this.state.fileName.nama_dokumen} </text>
                                    pada tanggal
                                    <text className={style.verif}> {moment().format('LL')}</text> ?
                                </text>
                            </div>
                            <div className={style.btnApprove}>
                                <Button variant="primary" onClick={this.approveDokumen}>Ya</Button>
                                <Button variant="secondary" onClick={this.openModalApprove}>Tidak</Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
                <Modal show={this.state.openReject} onHide={this.openModalReject} centered={true}>
                    <Modal.Body>
                    <Formik
                    initialValues={{
                    alasan: "",
                    }}
                    validationSchema={alasanSchema}
                    onSubmit={(values) => {this.rejectDokumen(values)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                            <div className={style.modalApprove}>
                            <div className={style.quest}>Anda yakin untuk reject {this.state.fileName.nama_dokumen} ?</div>
                            <div className={style.alasan}>
                                <text className="col-md-3">
                                    Alasan
                                </text>
                                <Input 
                                type="name" 
                                name="select" 
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
                                <Button variant="primary" onClick={handleSubmit}>Ya</Button>
                                <Button variant="secondary" onClick={this.openModalReject}>Tidak</Button>
                            </div>
                        </div>
                        )}
                        </Formik>
                    </Modal.Body>
                </Modal>
            </>
        )
    }
}

const mapStateToProps = state => ({
    pengadaan: state.pengadaan
})

const mapDispatchToProps = {
    getPengadaan: pengadaan.getPengadaan,
    getApproveIo: pengadaan.getApproveIo,
    getDocumentIo: pengadaan.getDocumentIo,
    uploadDocument: pengadaan.uploadDocument,
    approveDocument: pengadaan.approveDocument,
    rejectDocument: pengadaan.rejectDocument,
    resetError: pengadaan.resetError,
    showDokumen: pengadaan.showDokumen,
}

export default connect(mapStateToProps, mapDispatchToProps)(Pengadaan)
