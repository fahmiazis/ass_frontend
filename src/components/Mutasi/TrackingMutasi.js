import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    NavbarBrand, Row, Col, Button, Input, Modal, ModalBody, ModalHeader, Table,
    Container, Alert, ModalFooter, Spinner, Card, CardBody, Collapse
} from 'reactstrap'
import { BsCircle } from 'react-icons/bs'
import { AiOutlineCheck, AiOutlineClose, AiFillCheckCircle, AiOutlineInbox } from 'react-icons/ai'
import { MdAssignment } from 'react-icons/md'
import { FiSend, FiTruck, FiSettings, FiUpload } from 'react-icons/fi'
import {FaSearch, FaUserCircle, FaBars, FaCartPlus, FaFileSignature} from 'react-icons/fa'
import moment from 'moment'


class TrackingMutasi extends Component {
    state={
        collap: false,
        history: false
    }

    showCollap = (val) => {
        if (val === 'close') {
            this.setState({collap: false})
        } else {
            this.setState({collap: false})
            setTimeout(() => {
                this.setState({collap: true, tipeCol: val})
             }, 500)
        }
    }

    openHistory = () => {
        this.setState({ history: !this.state.history })
    }


  render() {
    const { dataMut, noMut, mutApp, dataDoc, detailMut } = this.props.mutasi
    const statusList = [
        { status_form: 2, title: 'proses approval'},
        { status_form: 3, title: 'verifikasi budget'},
        { status_form: 4, title: 'eksekusi mutasi'},
        { status_form: 8, title: 'completed'},
    ]
    return (
        <>
        <ModalBody>
            <Row className='trackTitle ml-4'>
                <Col>
                    Tracking Mutasi
                </Col>
            </Row>
            <Row className='ml-4 trackSub'>
                <Col md={3}>
                    Area asal
                </Col>
                <Col md={9}>
                    : {detailMut[0] === undefined ? '' : detailMut[0].area}
                </Col>
            </Row>
            <Row className='ml-4 trackSub'>
                <Col md={3}>
                    Area tujuan
                </Col>
                <Col md={9}>
                    : {detailMut[0] === undefined ? '' : detailMut[0].area_rec}
                </Col>
            </Row>
            <Row className='ml-4 trackSub'>
                <Col md={3}>
                    No Mutasi
                </Col>
                <Col md={9}>
                    : {detailMut[0] === undefined ? '' : detailMut[0].no_mutasi}
                </Col>
            </Row>
            <Row className='ml-4 trackSub'>
                <Col md={3}>
                    Tanggal Pengajuan Mutasi
                </Col>
                <Col md={9}>
                    : {detailMut[0] === undefined ? '' : moment(detailMut[0].tanggalMut === null ? detailMut[0].createdAt : detailMut[0].tanggalMut).locale('idn').format('DD MMMM YYYY ')}
                </Col>
            </Row>
            <Row className='ml-4 mt-3 trackSub1'>
                <Col md={12}>
                    <Button color='success' size='md' onClick={this.openHistory}>Full History</Button>
                </Col>
            </Row>
            <div class="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
                <div class="step completed">
                    <div class="step-icon-wrap">
                        <button class="step-icon" onClick={() => this.showCollap('Submit')} ><FiSend size={40} className="center1" /></button>
                    </div>
                    <h4 class="step-title">Submit Mutasi</h4>
                </div>
                <div class={detailMut[0] === undefined ? 'step' : detailMut[0].status_form > 2 ? "step completed" : 'step'} >
                    <div class="step-icon-wrap">
                        <button class="step-icon" onClick={() => this.showCollap('Pengajuan')}><MdAssignment size={40} className="center" /></button>
                    </div>
                    <h4 class="step-title">Pengajuan Mutasi</h4>
                </div>
                {detailMut[0] === undefined ? (
                    <div></div>
                ) : detailMut.find(({ isbudget }) => isbudget === 'ya') && (
                    <div class={detailMut[0] === undefined ? 'step' : detailMut[0].status_form > 3 ? "step completed" : 'step'}>
                        <div class="step-icon-wrap">
                            <button class="step-icon" onClick={() => this.showCollap('Verifikasi Budget')}><FiSettings size={40} className="center" /></button>
                        </div>
                        <h4 class="step-title">Verifikasi Budget</h4>
                    </div>
                )}
                <div class={detailMut[0] === undefined ? 'step' : detailMut[0].status_form > 4 ? "step completed" : 'step'}>
                    <div class="step-icon-wrap">
                        <button class="step-icon" onClick={() => this.showCollap('Eksekusi')}><FiTruck size={40} className="center" /></button>
                    </div>
                    <h4 class="step-title">Eksekusi Mutasi</h4>
                </div>
                <div class={detailMut[0] === undefined ? 'step' : detailMut[0].status_form === 8 ? "step completed" : 'step'}>
                    <div class="step-icon-wrap">
                        <button class="step-icon"><AiOutlineCheck size={40} className="center" /></button>
                    </div>
                    <h4 class="step-title">Selesai</h4>
                </div>
            </div>
            <Collapse isOpen={this.state.collap} className="collapBody">
                <Card className="cardCollap">
                    <CardBody>
                        <div className='textCard1'>{this.state.tipeCol} Mutasi</div>
                        {this.state.tipeCol === 'submit' ? (
                            <div>Tanggal submit : {detailMut[0] === undefined ? '' : moment(detailMut[0].tanggalMut === null ? detailMut[0].createdAt : detailMut[0].tanggalMut).locale('idn').format('DD MMMM YYYY ')}</div>
                        ) : (
                            <div></div>
                        )}
                        <div>Rincian Asset:</div>
                        <Table striped bordered responsive hover className="tableDis mb-3">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Nomor Asset</th>
                                    <th>Nama Barang</th>
                                    <th>Merk/Type</th>
                                    <th>Kategori</th>
                                    <th>Keterangan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detailMut.length !== 0 && detailMut.map(item => {
                                    return (
                                        <tr>
                                            <th scope="row">{detailMut.indexOf(item) + 1}</th>
                                            <td>{item.no_asset}</td>
                                            <td>{item.nama_asset}</td>
                                            <td>{item.merk}</td>
                                            <td>{item.kategori}</td>
                                            <td>{item.keterangan}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                        {detailMut[0] === undefined || this.state.tipeCol === 'Submit' ? (
                            <div></div>
                        ) : (
                            <div>
                                <div className="mb-4 mt-2">Tracking {this.state.tipeCol} :</div>
                                {this.state.tipeCol === 'Pengajuan' ? (
                                    <div class="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
                                        {detailMut[0] !== undefined && detailMut[0].appForm.length && detailMut[0].appForm.slice(0).reverse().map(item => {
                                            return (
                                                <div class={item.status === 1 ? 'step completed' : item.status === 0 ? 'step reject' : 'step'}>
                                                    <div class="step-icon-wrap">
                                                        <button class="step-icon"><FaFileSignature size={30} className="center2" /></button>
                                                    </div>
                                                    <h5 class="step-title">{moment(item.updatedAt).format('DD-MM-YYYY')} </h5>
                                                    <h4 class="step-title">{item.status === null ? '' : item.nama}</h4>
                                                    <h4 class="step-title">{item.jabatan}</h4>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : this.state.tipeCol === 'Eksekusi' ? (
                                    <div class="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
                                        <div class={detailMut[0] === undefined ? 'step' : detailMut[0].status_form !== 9 && detailMut[0].status_form > 4 ? "step completed" : 'step'}>
                                            <div class="step-icon-wrap">
                                                <button class="step-icon" ><FaFileSignature size={30} className="center2" /></button>
                                            </div>
                                            <h4 class="step-title">Check Dokumen Terima Mutasi</h4>
                                        </div>
                                        <div class={detailMut[0] === undefined ? 'step' : detailMut[0].status_form !== 9 && detailMut[0].status_form > 4 ? "step completed" : 'step'}>
                                            <div class="step-icon-wrap">
                                                <button class="step-icon" ><FiSettings size={30} className="center2" /></button>
                                            </div>
                                            <h4 class="step-title">Proses SAP</h4>
                                        </div>
                                        <div class={detailMut[0] === undefined ? 'step' : detailMut[0].status_form !== 9 && detailMut[0].status_form > 4 ? "step completed" : 'step'}>
                                            <div class="step-icon-wrap">
                                                <button class="step-icon" ><AiOutlineCheck size={30} className="center2" /></button>
                                            </div>
                                            <h4 class="step-title">Selesai</h4>
                                        </div>
                                    </div>
                                ) : this.state.tipeCol === 'Verifikasi Budget' && (
                                    <div class="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
                                        <div class={detailMut[0] === undefined ? 'step' : detailMut[0].status_form !== 9 && detailMut[0].status_form > 3 ? "step completed" : 'step'}>
                                            <div class="step-icon-wrap">
                                                <button class="step-icon" ><FiSettings size={30} className="center2" /></button>
                                            </div>
                                            <h4 class="step-title">Proses Ubah Cost Center</h4>
                                        </div>
                                        <div class={detailMut[0] === undefined ? 'step' : detailMut[0].status_form !== 9 && detailMut[0].status_form > 3 ? "step completed" : 'step'}>
                                            <div class="step-icon-wrap">
                                                <button class="step-icon" ><AiOutlineCheck size={30} className="center2" /></button>
                                            </div>
                                            <h4 class="step-title">Selesai</h4>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardBody>
                </Card>
            </Collapse>
        </ModalBody>
        <Modal isOpen={this.state.history} toggle={this.openHistory}>
            <ModalBody>
                <div className='mb-4'>History Transaksi</div>
                <div className='history'>
                    {detailMut === undefined || detailMut.length === 0 || detailMut[0].history === null ? (
                        <div></div>   
                    ) 
                    : detailMut[0].history.split(',').map(item => {
                        return (
                            item !== null && item !== 'null' &&
                            <Button className='mb-2' color='info'>{item}</Button>
                        )
                    })}
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

export default connect(mapStateToProps)(TrackingMutasi)
