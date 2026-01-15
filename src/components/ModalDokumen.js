import React, { Component } from 'react'
import { Container, Collapse, Nav, Navbar,
    NavbarToggler, NavbarBrand, NavItem, NavLink, DropdownToggle, DropdownMenu, 
    Card, CardBody, Table, ButtonDropdown, Input, Button, Col, DropdownItem,
    Alert, Spinner, Row, Modal, ModalBody, ModalHeader, ModalFooter, UncontrolledTooltip} from 'reactstrap'
import Pdf from "./Pdf"
import moment from 'moment'
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from 'react-icons/md'
import { AiOutlineCheck, AiOutlineClose, AiFillCheckCircle, AiOutlineFileExcel} from 'react-icons/ai'
import {BsCircle} from 'react-icons/bs'
import pengadaan from '../redux/actions/pengadaan'
import mutasi from '../redux/actions/mutasi'
import disposal from '../redux/actions/disposal'
import dokumen from '../redux/actions/dokumen'
import {connect} from 'react-redux'
import style from '../assets/css/input.module.css'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import axios from "axios";
const {REACT_APP_BACKEND_URL} = process.env

class ModalDokumen extends Component {
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
            limit: 100,
            search: '',
            dataRinci: {},
            dataItem: {},
            modalEdit: false,
            modalRinci: false,
            dropApp: false,
            openReject: false,
            openApprove: false,
            modalFaa: false,
            modalFpd: false,
            view: 'list',
            fisik: '',
            kondisi: '',
            alert: false,
            submitPre: false,
            dataStatus: [],
            openStatus: false,
            stat: '',
            modalConfirm: false,
            confirm: '',
            modalDoc: false,
            listMut: [],
            listReason: [],
            modalStock: false,
            openPdf: false,
            modalAdd: false,
            openConfirm: false,
            modalSum: false,
            grouping: '',
            modalUpload: false,
            dataId: null,
            idTab: null,
            drop: false,
            bulan: moment().format('MMMM'),
            opendok: false,
            month: moment().format('M'),
            dropOp: false,
            noAsset: null,
            filter: '',
            newKlaim: [],
            totalfpd: 0,
            dataMenu: [],
            listMenu: [],
            collap: false,
            tipeCol: '',
            formDis: false,
            history: false,
            upload: false,
            openDraft: false,
            message: '',
            openAppDoc: false,
            openRejDoc: false,
            time: 'pilih',
            time1: moment().subtract(2, 'month').startOf('month').format('YYYY-MM-DD'),
            time2: moment().endOf('month').format('YYYY-MM-DD'),
            subject: '',
            docHist: false,
            detailDoc: {},
            docCon: false,
            jurnalArea: false,
            jurnal: [1, 2],
            jurnalPPh: [1, 2, 3],
            jurnalFull: [1, 2, 3, 4],
            tipeEmail: '',
            dataRej: {},
            tipeNilai: 'all',
            modalNilai: false,
            nilai_verif: 0,
            dataZip: [],
            listReject: [],
            statEmail: '',
            modResmail: false,
            idDoc: 0,
            dataColl: [],
            fileName: {},
            tipe: '',
            noDoc: '',
            noTrans: '',
            openRejDocZip: false,
            isLoading: false
        }
    }


    componentDidMount () {
        const {noDoc, tipe, noTrans, filter} = this.props.parDoc
        this.setState({filter: filter, noTrans: noTrans, noDoc: noDoc, tipe: tipe })
        this.getDocument()
    }


    downloadDataZip = async () => {
        const {dataZip} = this.state
        const {noDoc, tipe, noTrans, filter} = this.props.parDoc
        const dataRedux = this.props.dokumen.dataDoc
        const dataProps = this.props.dataDoc
        const dataDoc = dataRedux.length > 0 ? dataRedux : dataProps
        this.setState({isLoading: true})
        
        let zip = new JSZip();
        
        const remoteZips = await Promise.all (dataDoc.map(async (item) => {
            try {
                const cekData = dataZip.find(e => e === item.id)
                if (cekData !== undefined) {
                    if (noDoc === noTrans) {
                        const genData = item === undefined ? ['file.pdf'] : item.path.split('/')
                        const cekPr = genData.find(item => item === 'printPR')
                        const response = await fetch(`${REACT_APP_BACKEND_URL}/show/tes/${item.id}`)

                        // const response = await fetch(item.path);
                        const data = await response.blob();
                        await zip.file(`${item.nama_dokumen}${'.pdf'}`, data);
                        return data;
                    } else {
                        const response = await fetch(`${REACT_APP_BACKEND_URL}/show/doc/${item.id}`);
                        const data = await response.blob();
                        zip.file(`${item.nama_dokumen} ~ ${item.desc}`, data);
                        return data;
                    }
                }
            } catch (error) {
                console.log(error)
            }
        })
        )

        this.setState({isLoading: false})

        Promise.all(remoteZips).then(() => {
            zip.generateAsync({ type: "blob" }).then((content) => {
              saveAs(content, `Dokumen Lampiran ${this.state.noTrans} ${moment().format('DDMMYYYY h:mm:ss')}.zip`);
            })
          })
    }

    docHistory = (val) => {
        this.setState({detailDoc: val})
        this.setState({docHist: !this.state.docHist})
    }

    getDocument = async () => {
        const {noDoc, tipe, noTrans, filter} = this.props.parDoc
        const token = localStorage.getItem('token')
        const tempno = {
            no: noDoc,
            jenis: tipe
        }
        await this.props.getDokumen(token, tempno)
    }

    openConfirm = (val) => {
        if (val === false) {
            this.setState({modalConfirm: false})
        } else {
            this.setState({modalConfirm: true})
            // setTimeout(() => {
            //     this.setState({modalConfirm: false})
            //  }, 3000)
        }
    }

    approveDoc = async (val) => {
        const token = localStorage.getItem('token')
        const {noDoc, tipe, noTrans, filter, detailForm} = this.props.parDoc
        const {idDoc} = this.state
        const tempno = {
            no: noDoc,
            jenis: tipe
        }
        await this.props.approveDokumen(token, val.id)
        await this.props.getDokumen(token, tempno)
        if (noDoc === noTrans && tipe === 'pengadaan') {
            await this.props.getDocumentIo(token, noDoc)
            if (val.type === 'show') {
                // this.openModalPdf()
                this.collDoc(val.id)
            } else {
                this.collDoc(val.id)
            }
        } else {
            if (tipe === 'pengadaan') {
                await this.props.getDocCart(token, noDoc)
                if (val.type === 'show') {
                    this.collDoc(val.id)
                } else {
                    this.collDoc(val.id)
                }
            } else if (tipe === 'mutasi') {
                await this.props.getDetailMutasi(token, noDoc)
                await this.props.getDocumentMut(token, noDoc, noDoc)
                if (val.type === 'show') {
                    this.collDoc(val.id)
                } else {
                    this.collDoc(val.id)
                }
            } else if (tipe === 'disposal') {
                const data = {
                    noId: detailForm.id,
                    noAsset: detailForm.no_asset
                }
                await this.props.getDocumentDis(token, data, 'disposal', 'pengajuan')
                if (val.type === 'show') {
                    this.collDoc(val.id)
                } else {
                    this.collDoc(val.id)
                }
            } else if (tipe === 'eksekusi disposal') {
                const data = {
                    noId: detailForm.id,
                    noAsset: detailForm.no_asset
                }
                const tipeDis = detailForm.nilai_jual === "0" ? 'dispose' : 'sell'
                this.props.getDocumentDis(token, data, 'disposal', tipeDis, detailForm.npwp)
                if (val.type === 'show') {
                    this.collDoc(val.id)
                } else {
                    this.collDoc(val.id)
                }
            } else if (tipe === 'tax disposal') {
                const data = {
                    noId: detailForm.id,
                    noAsset: detailForm.no_asset
                }
                await this.props.getDocumentDis(token, data, 'disposal', 'tax')
                if (val.type === 'show') {
                    this.collDoc(val.id)
                } else {
                    this.collDoc(val.id)
                }
            } else if (tipe === 'finance disposal') {
                const data = {
                    noId: detailForm.id,
                    noAsset: detailForm.no_asset
                }
                await this.props.getDocumentDis(token, data, 'disposal', 'finance')
                if (val.type === 'show') {
                    this.collDoc(val.id)
                } else {
                    this.collDoc(val.id)
                }
            } else if (tipe === 'persetujuan disposal') {
                const data = {
                    noId: detailForm.id,
                    noAsset: detailForm.no_asset
                }
                await this.props.getDocumentDis(token, data, 'disposal', 'persetujuan')
                if (val.type === 'show') {
                    this.collDoc(val.id)
                } else {
                    this.collDoc(val.id)
                }
            }
            
        }
        
        // this.setState({confirm: 'isAppDoc'})
        // this.openConfirm()
        // this.openModalAppDoc()
        
    }

    approveDocZip = async (val) => {
        const token = localStorage.getItem('token')
        const data = {
            list: this.state.dataZip
        }
        const {noDoc, tipe, noTrans, filter, detailForm} = this.props.parDoc
        const {idDoc} = this.state
        const tempno = {
            no: noDoc,
            jenis: tipe
        }
        await this.props.approveDokumen(token, idDoc, data)
        await this.props.getDokumen(token, tempno)
        if (noDoc === noTrans) {
            if (tipe === 'pengadaan') {
                await this.props.getDocumentIo(token, noDoc)
            } else {
                await this.props.getDetailMutasi(token, noDoc)
                await this.props.getDocumentMut(token, noDoc, noDoc)
            }
            
            // if (val.type === 'show') {
            //     this.openModalPdf()
            //     this.collDoc(val.id)
            // } else {
            //     this.collDoc(val.id)
            // }
        } else if (tipe === 'disposal') {
            const data = {
                noId: detailForm.id,
                noAsset: detailForm.no_asset
            }
            await this.props.getDocumentDis(token, data, 'disposal', 'pengajuan')
        } else if (tipe === 'eksekusi disposal') {
            const data = {
                noId: detailForm.id,
                noAsset: detailForm.no_asset
            }
            const tipeDis = detailForm.nilai_jual === "0" ? 'dispose' : 'sell'
            await this.props.getDocumentDis(token, data, 'disposal', tipeDis, detailForm.npwp)
        }  else if (tipe === 'tax disposal') {
            const data = {
                noId: detailForm.id,
                noAsset: detailForm.no_asset
            }
            await this.props.getDocumentDis(token, data, 'disposal', 'tax')
        } else if (tipe === 'finance disposal') {
            const data = {
                noId: detailForm.id,
                noAsset: detailForm.no_asset
            }
            await this.props.getDocumentDis(token, data, 'disposal', 'finance')
        } else {
            await this.props.getDocCart(token, noDoc)
            // if (val.type === 'show') {
            //     this.openModalPdf()
            //     this.collDoc(val.id)
            // } else {
            //     this.collDoc(val.id)
            // }
        }
        
        // this.setState({confirm: 'isAppDoc'})
        // this.openConfirm()

        // this.openModalAppDoc()
        
    }

    rejectDoc = async () => {
        const token = localStorage.getItem('token')
        const {idDoc} = this.state
        const {noDoc, tipe, noTrans, filter, detailForm} = this.props.parDoc
        const tempno = {
            no: noDoc,
            jenis: tipe
        }
        await this.props.rejectDokumen(token, idDoc)
        await this.props.getDokumen(token, tempno)
        if (noDoc === noTrans) {
            if (tipe === 'pengadaan') {
                await this.props.getDocumentIo(token, noDoc)
            } else if (tipe === 'mutasi') {
                await this.props.getDetailMutasi(token, noDoc)
                await this.props.getDocumentMut(token, noDoc, noDoc)
            }
        } else {
            if (tipe === 'disposal') {
                const data = {
                    noId: detailForm.id,
                    noAsset: detailForm.no_asset
                }
                // await this.props.getDocCart(token, noDoc)
                await this.props.getDocumentDis(token, data, 'disposal', 'pengajuan')
            } else if (tipe === 'eksekusi disposal') {
                const data = {
                    noId: detailForm.id,
                    noAsset: detailForm.no_asset
                }
                const tipeDis = detailForm.nilai_jual === "0" ? 'dispose' : 'sell'
                this.props.getDocumentDis(token, data, 'disposal', tipeDis, detailForm.npwp)
            }  else if (tipe === 'tax disposal') {
                const data = {
                    noId: detailForm.id,
                    noAsset: detailForm.no_asset
                }
                await this.props.getDocumentDis(token, data, 'disposal', 'tax')
            } else if (tipe === 'finance disposal') {
                const data = {
                    noId: detailForm.id,
                    noAsset: detailForm.no_asset
                }
                await this.props.getDocumentDis(token, data, 'disposal', 'finance')
            } else {
                await this.props.getDocCart(token, noDoc)
            }
            
        }
        this.setState({confirm: 'isRejDoc'})
        this.openConfirm()
        this.openModalRejDoc()
    }

    rejectDocZip = async () => {
        const token = localStorage.getItem('token')
        const {idDoc} = this.state
        const {noDoc, tipe, noTrans, filter} = this.props.parDoc
        const tempno = {
            no: noDoc,
            jenis: tipe
        }
        const data = {
            list: this.state.dataZip
        }
        await this.props.rejectDokumen(token, idDoc, data)
        await this.props.getDokumen(token, tempno)
        if (noDoc === noTrans) {
            if (tipe === 'pengadaan') {
                await this.props.getDocumentIo(token, noDoc)
            } else {
                await this.props.getDetailMutasi(token, noDoc)
                await this.props.getDocumentMut(token, noDoc, noDoc)
            }
        } else {
            await this.props.getDocCart(token, noDoc)
        }
        this.setState({confirm: 'isRejDoc'})
        this.openConfirm()
        this.openModalRejDocZip()
    }

    openModalRejDoc = () => {
        this.setState({openRejDoc: !this.state.openRejDoc})
    }

    openModalRejDocZip = () => {
        this.setState({openRejDocZip: !this.state.openRejDocZip})
    }

    checkDoc = (val) => {
        const { dataZip } = this.state
        const dataDoc = this.props.dataDoc
        if (val === 'all') {
            const data = []
            for (let i = 0; i < dataDoc.length; i++) {
                if (dataDoc[i].path !== null) {
                    data.push(dataDoc[i].id)
                }
            }
            this.setState({dataZip: data})
        } else {
            dataZip.push(val)
            this.setState({dataZip: dataZip})
        }
    }

    unCheckDoc = (val) => {
        const {dataZip} = this.state
        if (val === 'all') {
            const data = []
            this.setState({dataZip: data})
        } else {
            const data = []
            for (let i = 0; i < dataZip.length; i++) {
                if (dataZip[i] === val) {
                    data.push()
                } else {
                    data.push(dataZip[i])
                }
            }
            this.setState({dataZip: data})
        }
    }

    collDoc = (val) => {
        const {dataColl} = this.state
        const dataApp = [...dataColl]
        const dataRej = []
        const cek = dataColl.find(x => x === val)
        if (cek !== undefined) {
            console.log('masuk not undefined')
            for (let i = 0; i < dataColl.length; i++) {
                if (dataColl[i] === val) {
                    dataRej.push()
                } else {
                    dataRej.push(dataColl[i])
                }
            }
            this.setState({dataColl: dataRej})
        } else {
            console.log('masuk undefined')
            dataApp.push(val)
            this.setState({dataColl: dataApp})
        }
    }

    prosesUpload = (val) => {
        this.setState({detail: val})
        this.openUpload()
    }

    openUpload = () => {
        this.setState({modalUpload: !this.state.modalUpload})
    }

    onChangeUpload = async e => {
        const {size, type} = e.target.files[0]
        const {noDoc, tipe, noTrans, filter} = this.props.parDoc
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
            const tempno = {
                no: noDoc,
                jenis: tipe
            }
            await this.props.uploadDocument(token, detail.id, data)
            await this.props.getDokumen(token, tempno)
            this.collDoc(detail.id)
            if (noDoc === noTrans) {
                await this.props.getDocumentIo(token, noDoc)
                this.openUpload()
                this.setState({confirm: 'sucUpload'})
                this.openConfirm()
            } else {
                await this.props.getDocCart(token, noDoc)
                this.openUpload()
                this.setState({confirm: 'sucUpload'})
                this.openConfirm()
            }
        }
    }

    async componentDidUpdate() {
        const {isUpload} = this.props.pengadaan
        const {noDoc, tipe, noTrans, filter} = this.props.parDoc
        const token = localStorage.getItem('token')
        const {dataRinci} = this.state
    }

  render() {
    const dataRedux = this.props.dokumen.dataDoc
    const dataProps = this.props.dataDoc
    const dataDoc = dataRedux.length > 0 ? dataRedux : dataProps
    const { dataZip, dataColl, detailDoc } = this.state
    const level = localStorage.getItem('level')
    const {noDoc, tipe, noTrans, filter, detailForm} = this.props.parDoc
    return (
      <>
        <ModalHeader>
            Kelengkapan Dokumen 
            {/* {dataDoc.length > 0 ? dataDoc[0].no_dokumen : ''} */}
        </ModalHeader>
        <ModalBody>
            <Container>
                {dataDoc.length > 0 && (
                    <Row className="mt-3 mb-4">
                        <Col md={12} lg={12} className='mb-2' >
                            <div className="btnDocIo1 mb-2 ml-4 rowCenter1" >
                                <Input 
                                    type='checkbox'
                                    className='checkSize'
                                    checked={dataZip.length === 0 ? false : dataZip.length === dataDoc.length ? true : false}
                                    onChange={() => dataZip.length > 0 ? this.unCheckDoc('all') : this.checkDoc('all')}
                                />
                                <text className='ml-2 fzDoc'>
                                    Ceklis All
                                </text>
                            </div>
                        </Col>
                    </Row>
                )}
                {dataDoc.length !== 0 && dataDoc.map(x => {
                    return (
                        x.path !== null &&
                        <Row className="mt-3 mb-4">
                            {x.path !== null && (
                                <Col md={12} lg={12} className='mb-2' >
                                    <div className="btnDocIo1 mb-2 ml-4 rowCenter1" >
                                        <Input 
                                            type='checkbox'
                                            className='checkSize'
                                            checked={dataZip.find(element => element === x.id) !== undefined ? true : false}
                                            onChange={dataZip.find(element => element === x.id) === undefined ? () => this.checkDoc(x.id) : () => this.unCheckDoc(x.id)}
                                        />
                                        <text className='ml-2 fzDoc'>
                                            {x.nama_dokumen === null ? 'Lampiran' : x.nama_dokumen}
                                        </text>
                                    </div>

                                    {/* OLD FORMAT */}

                                    {/* <div className='rowCenter1'>
                                        {x.status === 0 ? <AiOutlineCheck size={25} color="success" /> 
                                        : x.status === 0 ?  <AiOutlineClose size={25} color="danger" /> 
                                        : <BsCircle size={25} />}
                                        <button
                                            className={`btnDocIo1 fzDoc ${x.status === 3 ? 'blue' : x.status === 0 ?  'red' : 'black'}`}
                                            onClick={() => this.showDokumen(x)} 
                                        >
                                            {x.nama_dokumen + `${x.status === 3 ? ' (APPROVED)' : x.status === 0 ?  ' (REJECTED)' : ''}`}
                                        </button>
                                    </div>
                                    
                                    <div className='mt-3 mb-3'>
                                        {this.state.filter === 'available' ? (
                                            <div>
                                                <Button 
                                                color="success"
                                                onClick={
                                                    x.status === 0
                                                    ? () => this.cekFailDoc('approve') 
                                                    : () => {this.setState({idDoc: x.id}); this.approveDoc({type: 'direct', id: x.id})}}
                                                >
                                                    Approve
                                                </Button>
                                                <Button 
                                                className='ml-1' 
                                                color="danger" 
                                                onClick={
                                                    x.status === 0
                                                    ? () => this.cekFailDoc('reject') 
                                                    : () => {this.setState({idDoc: x.id}); this.openModalRejDoc()}}
                                                >
                                                    Reject
                                                </Button>
                                                <Button className='ml-1' color='warning' onClick={() => this.docHistory(x)}>history</Button>
                                            </div>
                                        ) : (
                                            <div>
                                                <Button color='warning' onClick={() => this.docHistory(x)}>history</Button>
                                            </div>
                                        )}
                                    </div>
                                    <div className='rowCenter1 borderGen'>
                                        <div id={`tool${x.id}`}>
                                            {dataColl.find(e => e === x.id) !== undefined ? (
                                                <div className='rowCenter1'>
                                                    <MdKeyboardArrowRight size={45} className='selfStart' onClick={() => this.collDoc(x.id)} />
                                                    <text>{x.nama_dokumen === null ? 'Lampiran' : x.nama_dokumen}</text>
                                                </div>
                                            ) : (
                                                <div className='rowCenter1'>
                                                    <MdKeyboardArrowDown size={45} className='selfStart' onClick={() => this.collDoc(x.id)} />
                                                    <text>{x.nama_dokumen === null ? 'Lampiran' : x.nama_dokumen}</text>
                                                </div>
                                            )}
                                        </div>
                                        <UncontrolledTooltip
                                            placement="top"
                                            target={`tool${x.id}`}
                                        >
                                                {dataColl.find(e => e === x.id) !== undefined ? `Expand` : `Collapse`}
                                        </UncontrolledTooltip>
                                    </div> */}

                                    {/* NEW FORMAT */}

                                    <div className='rowCenter'>
                                        {(x.status_dokumen === null && (level !== '5' && level !== '9')) ? (
                                            <BsCircle size={25} />
                                        ) : (x.status_dokumen !== null && x.status_dokumen !== '1' && x.status_dokumen.split(',').reverse()[0].split(';')[0] === ` level ${level}` &&
                                        x.status_dokumen.split(',').reverse()[0].split(';')[1] === ` status approve`) || ((level === '5' || level === '9') && x.status === 3) ? <AiOutlineCheck size={25} color="success" className='blue' /> 
                                        : (x.status_dokumen !== null && x.status_dokumen !== '1' && x.status_dokumen.split(',').reverse()[0].split(';')[0] === ` level ${level}` &&
                                        x.status_dokumen.split(',').reverse()[0].split(';')[1] === ` status reject`) || ((level === '5' || level === '9') && x.status === 0) ?  <AiOutlineClose size={25} color="danger" className='red'/> 
                                        : (
                                            <BsCircle size={25} />
                                        )}
                                        <button 
                                        className={`btnDocIo fzDoc ${(x.status_dokumen === null && (level !== '5' && level !== '9')) ? 'black' : (x.status_dokumen !== null && x.status_dokumen !== '1' && x.status_dokumen.split(',').reverse()[0].split(';')[0] === ` level ${level}` &&
                                        x.status_dokumen.split(',').reverse()[0].split(';')[1] === ` status approve`) || ((level === '5' || level === '9') && x.status === 3) ? 'blue'
                                        : (x.status_dokumen !== null && x.status_dokumen !== '1' && x.status_dokumen.split(',').reverse()[0].split(';')[0] === ` level ${level}` &&
                                        x.status_dokumen.split(',').reverse()[0].split(';')[1] === ` status reject`) || ((level === '5' || level === '9') && x.status === 0) ?  'red'
                                        : 'black'}`}
                                        // onClick={() => this.showDokumen(x)} 
                                        >
                                            {`${x.desc === null ? 'Lampiran' : x.desc} ${(x.status_dokumen === null && (level !== '5' && level !== '9')) ? '' : (x.status_dokumen !== null && x.status_dokumen !== '1' && x.status_dokumen.split(',').reverse()[0].split(';')[0] === ` level ${level}` &&
                                            x.status_dokumen.split(',').reverse()[0].split(';')[1] === ` status approve`) ? ' (APPROVED)' : 
                                            (x.status_dokumen !== '1' && x.status_dokumen.split(',').reverse()[0].split(';')[0] === ` level ${level}` &&
                                            x.status_dokumen.split(',').reverse()[0].split(';')[1] === ` status reject`) ?  ' (REJECTED)' : 
                                            ((level === '5' || level === '9') && x.status === 3) ? ' (APPROVED)' : 
                                            ((level === '5' || level === '9') && x.status === 0) ?  ' (REJECTED)' : ''}`}
                                        </button>
                                    </div>
                                    
                                    <div className='mt-3 mb-3'>
                                        {filter === 'available' ? (
                                            <div>
                                                <Button 
                                                color="success"
                                                onClick={() => {this.setState({idDoc: x.id}); this.approveDoc({type: 'direct', id: x.id})}}
                                                >
                                                    Approve
                                                </Button>
                                                <Button 
                                                className='ml-1' 
                                                color="danger" 
                                                onClick={() => {this.setState({idDoc: x.id}); this.openModalRejDoc()}}
                                                >
                                                    Reject
                                                </Button>
                                                <Button className='ml-1' color='warning' onClick={() => this.docHistory(x)}>History</Button>
                                            </div>
                                        ) : filter === 'revisi' ? (
                                            <div>
                                                <Button color='primary' onClick={() => this.prosesUpload(x)}>Upload</Button>
                                                <Button className='ml-1' color='warning' onClick={() => this.docHistory(x)}>History</Button>
                                            </div>
                                        ) : (
                                            <div>
                                                <Button color='warning' onClick={() => this.docHistory(x)}>History</Button>
                                            </div>
                                        )}
                                    </div>
                                    <div className='rowCenter borderGen'>
                                        <div id={`tool${x.id}`}>
                                            {dataColl.find(e => e === x.id) !== undefined ? (
                                                <div className='rowCenter'>
                                                    <MdKeyboardArrowRight size={45} className='selfStart' onClick={() => this.collDoc(x.id)} />
                                                    <text>{x.desc === null ? 'Lampiran' : x.desc}</text>
                                                </div>
                                            ) : (
                                                <div className='rowCenter'>
                                                    <MdKeyboardArrowDown size={45} className='selfStart' onClick={() => this.collDoc(x.id)} />
                                                    <text>{x.desc === null ? 'Lampiran' : x.desc}</text>
                                                </div>
                                            )}
                                        </div>
                                        <UncontrolledTooltip
                                            placement="top"
                                            target={`tool${x.id}`}
                                        >
                                                {dataColl.find(e => e === x.id) !== undefined ? `Expand` : `Collapse`}
                                        </UncontrolledTooltip>
                                    </div>

                                    {/* Show PDF */}

                                    <div className='colCenter borderGen'>
                                        {dataColl.find(e => e === x.id) === undefined ? (
                                            <Pdf pdf={`${REACT_APP_BACKEND_URL}/show/doc/${x.id}`} noTrans={noTrans} noDoc={noDoc} dataFile={x} detailForm={detailForm} tipe={tipe} />
                                        ) : (
                                            <div></div>
                                        )}
                                    </div>
                                </Col>
                            )}
                        </Row>
                    )
                })}
            </Container>
        </ModalBody>
        <ModalFooter className='modalFoot'>
            {/* {filter === 'available' && (level === '2' || level === '8') ? ( */}
            {filter === 'available' ? (
                <div className='rowCenter'>
                    <Button 
                    color="success"
                    disabled={dataZip.length === 0}
                    onClick={() => {this.approveDocZip()}}
                    >
                        Approve
                    </Button>
                    <Button 
                    className='ml-1' 
                    color="danger" 
                    disabled={dataZip.length === 0}
                    onClick={() => {this.openModalRejDocZip()}}
                    >
                        Reject
                    </Button>
                </div>
            ) : (
                <div>
                </div>
            )}
            <Button disabled={dataZip.length === 0} className="mr-2" color="primary" onClick={this.downloadDataZip}>
                Download Document
            </Button>
            {/* <Button className="" color="secondary" onClick={this.openModalDoc}>
                Close
            </Button> */}
        </ModalFooter>
        <Modal isOpen={this.state.docHist} toggle={this.docHistory}>
            <ModalBody>
                <div className='mb-4'>History Dokumen</div>
                <div className='history'>
                    {detailDoc.status_dokumen !== undefined && detailDoc.status_dokumen !== null && detailDoc.status_dokumen.split(',').map((item, index) => {
                        return (
                            item !== null && item !== 'null' && 
                            <Button className='mb-2' color='info'>{index === 1 ? item : item.split(';').map((x,y) => {return ( y === 0 ? '' : x )}).toString().replace(',', '')}</Button>
                        )
                    })}
                </div>
            </ModalBody>
        </Modal>
        <Modal isOpen={this.state.openRejDoc} toggle={this.openModalRejDoc} centered={true}>
            <ModalBody>
                <div className={style.modalApprove}>
                    <div>
                        <text>
                            Anda yakin untuk reject     
                            <text className={style.verif}> </text>
                            pada tanggal
                            <text className={style.verif}> {moment().format('DD MMMM YYYY')}</text> ?
                        </text>
                    </div>
                    <div className={style.btnApprove}>
                        <Button color="primary" onClick={() => this.rejectDoc()}>Ya</Button>
                        <Button color="secondary" onClick={this.openModalRejDoc}>Tidak</Button>
                    </div>
                </div>
            </ModalBody>
        </Modal>
        <Modal isOpen={this.state.openRejDocZip} toggle={this.openModalRejDocZip} centered={true}>
            <ModalBody>
                <div className={style.modalApprove}>
                    <div>
                        <text>
                            Anda yakin untuk reject     
                            <text className={style.verif}> </text>
                            pada tanggal
                            <text className={style.verif}> {moment().format('DD MMMM YYYY')}</text> ?
                        </text>
                    </div>
                    <div className={style.btnApprove}>
                        <Button color="primary" onClick={() => this.rejectDocZip()}>Ya</Button>
                        <Button color="secondary" onClick={this.openModalRejDocZip}>Tidak</Button>
                    </div>
                </div>
            </ModalBody>
        </Modal>
        <Modal toggle={this.openUpload} isOpen={this.state.modalUpload} >
                <ModalHeader>Upload File</ModalHeader>
                <ModalBody className={style.modalUpload}>
                    <div className={style.titleModalUpload}>
                        <text>Upload File: </text>
                        <div className={style.uploadFileInput}>
                            <AiOutlineFileExcel size={35} />
                            <div className="ml-3">
                                <Input
                                type="file"
                                name="file"
                                onChange={this.onChangeUpload}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={style.btnUpload}>
                        <div></div>
                        
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={this.openUpload}>Cancel</Button>
                </ModalFooter>
            </Modal>
        <Modal isOpen={this.state.modalConfirm} toggle={() => this.openConfirm(false)}>
            <ModalBody>
            {/* <Countdown renderer={this.rendererTime} date={Date.now() + 3000} /> */}
                {this.state.confirm === 'approve' ? (
                    <div>
                        <div className={style.cekUpdate}>
                            <AiFillCheckCircle size={80} className={style.green} />
                            <div className={[style.sucUpdate, style.green]}>Berhasil Update</div>
                        </div>
                    </div>
                ) : this.state.confirm === 'sucUpload' ?(
                    <div>
                        <div className={style.cekUpdate}>
                            <AiFillCheckCircle size={80} className={style.green} />
                            <div className={[style.sucUpdate, style.green]}>Berhasil Upload</div>
                        </div>
                    </div>
                ) : this.state.confirm === 'reject' ?(
                    <div>
                        <div className={style.cekUpdate}>
                            <AiFillCheckCircle size={80} className={style.green} />
                            <div className={[style.sucUpdate, style.green]}>Berhasil Reject</div>
                        </div>
                    </div>
                ) : this.state.confirm === 'rejApprove' ?(
                    <div>
                        <div className={style.cekUpdate}>
                        <AiOutlineClose size={80} className={style.red} />
                        <div className={[style.sucUpdate, style.green]}>Gagal Approve</div>
                    </div>
                    </div>
                ) : this.state.confirm === 'rejReject' ?(
                    <div>
                        <div className={style.cekUpdate}>
                            <AiOutlineClose size={80} className={style.red} />
                            <div className={[style.sucUpdate, style.green]}>Gagal Reject</div>
                        </div>
                    </div>
                ) : this.state.confirm === 'isApprove' ? (
                    <div>
                        <div className={style.cekUpdate}>
                            <AiFillCheckCircle size={80} className={style.green} />
                            <div className={[style.sucUpdate, style.green]}>Berhasil Approve dan Kirim Email</div>
                        </div>
                    </div>
                ) : this.state.confirm === 'rejSend' ? (
                    <div>
                        <div className={style.cekUpdate}>
                            <AiOutlineClose size={80} className={style.red} />
                            <div className={[style.sucUpdate, style.green]}>Berhasil Approve dan Gagal Kirim Email</div>
                        </div>
                    </div>
                ) : this.state.confirm === 'submit' ? (
                    <div>
                        <div className={style.cekUpdate}>
                            <AiFillCheckCircle size={80} className={style.green} />
                            <div className={[style.sucUpdate, style.green]}>Berhasil Submit</div>
                        </div>
                    </div>
                ) : this.state.confirm === 'appNotifDoc' ?(
                    <div>
                        <div className={style.cekUpdate}>
                        <AiOutlineClose size={80} className={style.red} />
                        <div className={[style.sucUpdate, style.green]}>Gagal Approve, Pastikan Dokumen Lampiran Telah Diapprove</div>
                    </div>
                    </div>
                ) : this.state.confirm === 'inputVerif' ? (
                    <div>
                        <div className={style.cekUpdate}>
                            <AiFillCheckCircle size={80} className={style.green} />
                            <div className={[style.sucUpdate, style.green]}>Berhasil Update Nilai Yang Diterima</div>
                        </div>
                    </div>
                ) : this.state.confirm === 'falseInputVerif' ? (
                    <div>
                        <div className={style.cekUpdate}>
                            <AiFillCheckCircle size={80} className={style.green} />
                            <div className={[style.sucUpdate, style.green]}>Pastikan Semua Data Telah Diisi</div>
                        </div>
                    </div>
                ) : this.state.confirm === 'isAppDoc' ? (
                    <div>
                        <div className={style.cekUpdate}>
                            <AiFillCheckCircle size={80} className={style.green} />
                            <div className={[style.sucUpdate, style.green]}>Berhasil Approve</div>
                        </div>
                    </div>
                ) : this.state.confirm === 'isRejDoc' ? (
                    <div>
                        <div className={style.cekUpdate}>
                            <AiFillCheckCircle size={80} className={style.green} />
                            <div className={[style.sucUpdate, style.green]}>Berhasil Reject</div>
                        </div>
                    </div>
                ) : this.state.confirm === 'resmail' ? (
                    <div>
                        <div className={style.cekUpdate}>
                            <AiFillCheckCircle size={80} className={style.green} />
                            <div className={[style.sucUpdate, style.green]}>Berhasil Kirim Email</div>
                        </div>
                    </div>
                ) : this.state.confirm === 'failappdoc' ? (
                    <div>
                        <div className={style.cekUpdate}>
                            <AiOutlineClose size={80} className={style.red} />
                            <div className={[style.sucUpdate, style.green]}>Gagal Approve</div>
                            <div className={[style.sucUpdate, style.green]}>Dokumen yang telah tereject tidak bisa diapprove</div>
                        </div>
                    </div>
                ) : this.state.confirm === 'failrejdoc' ? (
                    <div>
                        <div className={style.cekUpdate}>
                            <AiOutlineClose size={80} className={style.red} />
                            <div className={[style.sucUpdate, style.green]}>Gagal Reject</div>
                            <div className={[style.sucUpdate, style.green]}>Dokumen yang telah terapprove tidak bisa direject</div>
                        </div>
                    </div>
                ) : (
                    <div></div>
                )}
            </ModalBody>
            <div className='row justify-content-md-center mb-4'>
                <Button size='lg' onClick={() => this.openConfirm(false)} color='primary'>OK</Button>
            </div>
        </Modal>
        <Modal isOpen={this.props.pengadaan.isLoading || this.props.dokumen.isLoading || this.state.isLoading ? true: false} size="sm">
            <ModalBody>
                <div>
                    <div className={style.cekUpdate}>
                        <Spinner />
                        <div sucUpdate>Waiting....</div>
                    </div>
                </div>
            </ModalBody>
        </Modal>
      </>
    )
  }
}

const mapStateToProps = state => ({
    dokumen: state.dokumen,
    pengadaan: state.pengadaan,
})

const mapDispatchToProps = {
    approveDokumen: dokumen.approveDokumen,
    rejectDokumen: dokumen.rejectDokumen,
    getDokumen: dokumen.getDokumen,
    getDocCart: pengadaan.getDocCart,
    getDocumentIo: pengadaan.getDocumentIo,
    uploadDocument: pengadaan.uploadDocument,
    resetError: pengadaan.resetError,
    getDetailMutasi: mutasi.getDetailMutasi,
    getDocumentMut: mutasi.getDocumentMut,
    getDocumentDis: disposal.getDocumentDis
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalDokumen)
