import React, { Component } from 'react'
import {connect} from 'react-redux'
import {MdAssignment, MdDomainVerification} from 'react-icons/md'
import { AiOutlineCheck, AiOutlineClose, AiFillCheckCircle, AiOutlineInbox} from 'react-icons/ai'
import {FaSearch, FaUserCircle, FaBars, FaCartPlus, FaFileSignature} from 'react-icons/fa'
import {FiSend, FiTruck, FiSettings, FiUpload} from 'react-icons/fi'
import { Container, NavbarBrand, Table, Input, Button, Col, Card, CardBody,
    Alert, Spinner, Row, Modal, ModalBody, ModalHeader, ModalFooter, Collapse,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap'
import moment from 'moment'

class TrackingDisposal extends Component {
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
    const { dataDis, noDis, dataDoc, disApp, dataSubmit, detailDis } = this.props.disposal
    const tipeTrack = this.props.tipe || ''
    return (
        <>
        <ModalBody>
            <Row className='trackTitle ml-4'>
                <Col>
                    Tracking Disposal
                </Col>
            </Row>
            {(tipeTrack === 'persetujuan') ? (
                <div></div>
            ) : (
                <Row className='ml-4 trackSub'>
                    <Col md={3}>
                        Area
                    </Col>
                    <Col md={9}>
                    : {detailDis[0] === undefined ? '' : detailDis[0].area}
                    </Col>
                </Row>
            )}
            <Row className='ml-4 trackSub'>
                <Col md={3}>
                No {tipeTrack === 'persetujuan' ? 'Persetujuan' : 'Pengajuan'} Disposal
                </Col>
                <Col md={9}>
                : {detailDis[0] === undefined ? '' : (tipeTrack === 'persetujuan' ? detailDis[0].no_persetujuan : detailDis[0].no_disposal)}
                </Col>
            </Row>
            <Row className='ml-4 trackSub'>
                <Col md={3}>
                Tanggal {tipeTrack === 'persetujuan' ? 'Persetujuan' : 'Pengajuan'} Disposal
                </Col>
                <Col md={9}>
                : {detailDis[0] === undefined ? '' : moment(tipeTrack === 'persetujuan' ? detailDis[0].date_persetujuan : detailDis[0].tanggalDis).locale('idn').format('DD MMMM YYYY ')}
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
                    <h4 class="step-title">Submit Disposal</h4>
                </div>
                {detailDis[0] === undefined ? (
                    <div></div>
                ) : detailDis.find(({nilai_jual}) => nilai_jual !== '0') && (
                    <div class={detailDis[0] === undefined ? 'step' : detailDis[0].status_form !== 26 && (detailDis[0].status_form >= 2) ? "step completed" : 'step'}>
                        <div class="step-icon-wrap">
                            <button class="step-icon" onClick={() => this.showCollap('Purchasing')}><FiSettings size={40} className="center" /></button>
                        </div>
                        <h4 class="step-title">Proses Purchasing</h4>
                    </div>
                )}
                <div class={detailDis[0] === undefined ? 'step' : detailDis[0].status_form !== 26 && detailDis[0].status_form > 2 ? "step completed" : 'step'} >
                    <div class="step-icon-wrap">
                        <button class="step-icon" onClick={() => this.showCollap('Pengajuan')}><MdAssignment size={40} className="center" /></button>
                    </div>
                    <h4 class="step-title">Approval Pengajuan Disposal</h4>
                </div>
                <div class={detailDis[0] === undefined ? 'step' : detailDis[0].status_form !== 26 && detailDis[0].status_form !== 9 && detailDis[0].status_form > 3 ? "step completed" : 'step'}>
                    <div class="step-icon-wrap">
                        <button  class="step-icon" onClick={() => this.showCollap('Persetujuan')}><MdAssignment size={40} className="center" /></button >
                    </div>
                    <h4 class="step-title">Approval Persetujuan Disposal</h4>
                </div>
                <div class={detailDis[0] === undefined ? 'step' : detailDis[0].status_form !== 15 && detailDis[0].status_form !== 26 && detailDis[0].status_form !== 9 && detailDis[0].status_form > 4 ? "step completed" : 'step'}>
                    <div class="step-icon-wrap">
                        <button class="step-icon" onClick={() => this.showCollap('Eksekusi')}><FiTruck size={40} className="center" /></button>
                    </div>
                    <h4 class="step-title">Eksekusi Disposal</h4>
                </div>
                {detailDis[0] === undefined ? (
                    <div></div>
                ) : detailDis.find(({nilai_jual}) => nilai_jual !== '0') && (
                    <>
                        <div class={detailDis[0] === undefined ? 'step' : detailDis[0].status_form !== 15 && detailDis[0].status_form !== 26 && detailDis[0].status_form !== 9 && detailDis[0].status_form > 5 ? "step completed" : 'step'}>
                            <div class="step-icon-wrap">
                                <button class="step-icon" onClick={() => this.showCollap('Proses Tax')}><FiSettings size={40} className="center" /></button>
                            </div>
                            <h4 class="step-title">Proses Tax</h4>
                        </div>
                        <div class={detailDis[0] === undefined ? 'step' : detailDis[0].status_form !== 15 && detailDis[0].status_form !== 26 && detailDis[0].status_form !== 9 && detailDis[0].status_form > 6 ? "step completed" : 'step'}>
                            <div class="step-icon-wrap">
                                <button class="step-icon" onClick={() => this.showCollap('Proses Finance')}><FiSettings size={40} className="center" /></button>
                            </div>
                            <h4 class="step-title">Proses Finance</h4>
                        </div>
                        <div class={detailDis[0] === undefined ? 'step' : detailDis[0].status_form !== 15 && detailDis[0].status_form !== 26 && detailDis[0].status_form !== 9 && detailDis[0].status_form > 7 ? "step completed" : 'step'}>
                            <div class="step-icon-wrap">
                                <button class="step-icon" onClick={() => this.showCollap('Verifikasi Final')}><MdDomainVerification size={40} className="center" /></button>
                            </div>
                            <h4 class="step-title">Verifikasi Final Disposal</h4>
                        </div>
                    </>
                )}
                <div class={detailDis[0] === undefined ? 'step' :  detailDis[0].status_form === 8 ? "step completed" : 'step'}>
                    <div class="step-icon-wrap">
                        <button class="step-icon"><AiOutlineCheck size={40} className="center" /></button>
                    </div>
                    <h4 class="step-title">Selesai</h4>
                </div>
            </div>
            <Collapse isOpen={this.state.collap} className="collapBody">
                <Card className="cardCollap">
                    <CardBody>
                        <div className='textCard1'>{this.state.tipeCol} Disposal</div>
                        {this.state.tipeCol === 'submit' ? (
                            <div>Tanggal submit : {detailDis[0] === undefined ? '' : moment(detailDis[0].tanggalDis === null ? detailDis[0].createdAt : detailDis[0].tanggalDis).locale('idn').format('DD MMMM YYYY ')}</div>
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
                                    <th>Nilai Buku</th>
                                    <th>Nilai Jual</th>
                                    <th>Keterangan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detailDis.length !== 0 && detailDis.map(item => {
                                    return (
                                        <tr>
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
                        {detailDis[0] === undefined || this.state.tipeCol === 'Submit' ? (
                            <div></div>
                        ) : (
                            <div>
                                <div className="mb-4 mt-2">Tracking {this.state.tipeCol} :</div>
                                {this.state.tipeCol === 'Pengajuan' ? (
                                    <div class="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
                                        {detailDis[0] !== undefined && detailDis[0].appForm.length && detailDis[0].appForm.slice(0).reverse().map(item => {
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
                                ) : this.state.tipeCol === 'Persetujuan' ? (
                                    <div class="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
                                        {detailDis[0] !== undefined && detailDis[0].ttdSet.length > 0 && detailDis[0].ttdSet.slice(0).reverse().map(item => {
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
                                        <div class={detailDis[0] === undefined ? 'step' : (detailDis[0].status_form !== 26 && detailDis[0].status_form !== 9 && detailDis[0].status_form !== 15) && (detailDis[0].status_form >= 4) ? "step completed" : 'step'}>
                                            <div class="step-icon-wrap">
                                            <button class="step-icon" ><FiSettings size={30} className="center2" /></button>
                                            </div>
                                            <h4 class="step-title">Proses Eksekusi Area</h4>
                                        </div>
                                        <div class={detailDis[0] === undefined ? 'step' : (detailDis[0].status_form !== 26 && detailDis[0].status_form !== 9 && detailDis[0].status_form !== 15) && (detailDis[0].status_form > 4) ? "step completed" : 'step'}>
                                            <div class="step-icon-wrap">
                                            <button class="step-icon" ><FiSettings size={30} className="center2" /></button>
                                            </div>
                                            <h4 class="step-title">Proses Eksekusi Tim Aset</h4>
                                        </div>
                                        {/* <div class={detailDis[0] === undefined ? 'step' : (detailDis[0].status_form !== 26 && detailDis[0].status_form !== 9 && detailDis[0].status_form !== 15) && detailDis[0].status_form > 5 ? "step completed" : 'step'}>
                                            <div class="step-icon-wrap">
                                            <button class="step-icon" ><FaFileSignature size={30} className="center2" /></button>
                                            </div>
                                            <h4 class="step-title">Check Dokumen Eksekusi Oleh Asset</h4>
                                        </div> */}
                                        <div class={detailDis[0] === undefined ? 'step' : (detailDis[0].status_form !== 26 && detailDis[0].status_form !== 9 && detailDis[0].status_form !== 15) && detailDis[0].status_form > 4 ? "step completed" : 'step'}>
                                            <div class="step-icon-wrap">
                                            <button class="step-icon" ><AiOutlineCheck size={30} className="center2" /></button>
                                            </div>
                                            <h4 class="step-title">Selesai</h4>
                                        </div>
                                    </div>
                                ) : this.state.tipeCol === 'Proses Tax' ? (
                                    <div class="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
                                        <div class={detailDis[0] === undefined ? 'step' : (detailDis[0].status_form !== 26 && detailDis[0].status_form !== 9 && detailDis[0].status_form !== 15) && (detailDis[0].status_form > 5 || detailDis[0].status_form === 5) ? "step completed" : 'step'}>
                                            <div class="step-icon-wrap">
                                            <button class="step-icon" ><FiUpload size={30} className="center2" /></button>
                                            </div>
                                            <h4 class="step-title">Upload Dokumen oleh Tax</h4>
                                        </div>
                                        <div class={detailDis[0] === undefined ? 'step' : (detailDis[0].status_form !== 26 && detailDis[0].status_form !== 9 && detailDis[0].status_form !== 15) && detailDis[0].status_form > 5 ? "step completed" : 'step'}>
                                            <div class="step-icon-wrap">
                                            <button class="step-icon" ><AiOutlineCheck size={30} className="center2" /></button>
                                            </div>
                                            <h4 class="step-title">Selesai</h4>
                                        </div>
                                    </div>
                                ) : this.state.tipeCol === 'Proses Finance' ? (
                                    <div class="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
                                        <div class={detailDis[0] === undefined ? 'step' : (detailDis[0].status_form !== 26 && detailDis[0].status_form !== 9 && detailDis[0].status_form !== 15) && (detailDis[0].status_form > 6 || detailDis[0].status_form === 6) ? "step completed" : 'step'}>
                                            <div class="step-icon-wrap">
                                            <button class="step-icon" ><FiUpload size={30} className="center2" /></button>
                                            </div>
                                            <h4 class="step-title">Upload Dokumen oleh Finance</h4>
                                        </div>
                                        <div class={detailDis[0] === undefined ? 'step' : (detailDis[0].status_form !== 26 && detailDis[0].status_form !== 9 && detailDis[0].status_form !== 15) && detailDis[0].status_form > 6 ? "step completed" : 'step'}>
                                            <div class="step-icon-wrap">
                                            <button class="step-icon" ><AiOutlineCheck size={30} className="center2" /></button>
                                            </div>
                                            <h4 class="step-title">Selesai</h4>
                                        </div>
                                    </div>
                                )  : this.state.tipeCol === 'Verifikasi Final' ? (
                                    <div class="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
                                        <div class={detailDis[0] === undefined ? 'step' : (detailDis[0].status_form !== 26 && detailDis[0].status_form !== 9 && detailDis[0].status_form !== 15) && detailDis[0].status_form > 7 ? "step completed" : 'step'}>
                                            <div class="step-icon-wrap">
                                            <button class="step-icon" ><FaFileSignature size={30} className="center2" /></button>
                                            </div>
                                            <h4 class="step-title">Check Dokumen Tax and Finance Oleh Asset</h4>
                                        </div>
                                        <div class={detailDis[0] === undefined ? 'step' : (detailDis[0].status_form !== 26 && detailDis[0].status_form !== 9 && detailDis[0].status_form !== 15) && detailDis[0].status_form > 7 ? "step completed" : 'step'}>
                                            <div class="step-icon-wrap">
                                            <button class="step-icon" ><AiOutlineCheck size={30} className="center2" /></button>
                                            </div>
                                            <h4 class="step-title">Selesai</h4>
                                        </div>
                                    </div>
                                ) : this.state.tipeCol === 'Purchasing' && (
                                    <div class="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
                                        <div class={detailDis[0] === undefined ? 'step' : detailDis[0].status_form === 26 || (detailDis[0].status_form > 2 || detailDis[0].status_form === 2) ? "step completed" : 'step'}>
                                            <div class="step-icon-wrap">
                                            <button class="step-icon" ><FiUpload size={30} className="center2" /></button>
                                            </div>
                                            <h4 class="step-title">Upload Dokumen oleh Purchasing</h4>
                                        </div>
                                        <div class={detailDis[0] === undefined ? 'step' : detailDis[0].status_form !== 26 && (detailDis[0].status_form > 2 || detailDis[0].status_form === 2) ? "step completed" : 'step'}>
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
                    {detailDis === undefined || detailDis.length === 0 || detailDis[0].history === null ? (
                        <div></div>   
                    ) 
                    : detailDis[0].history.split(',').map(item => {
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
    disposal: state.disposal
})

export default connect(mapStateToProps)(TrackingDisposal)
