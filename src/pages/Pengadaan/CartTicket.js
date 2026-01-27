/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { Component } from 'react'
import { FaUserCircle, FaBars, FaTrash, FaCartPlus, FaCheck } from 'react-icons/fa'
import style from '../../assets/css/input.module.css'
import {NavbarBrand, Row, Col, Button, Input, Modal, ModalBody, UncontrolledTooltip,
    ModalHeader, Spinner, Alert, Container, ModalFooter, Table} from 'reactstrap'
import { Form } from 'react-bootstrap'
import { CiWarning } from "react-icons/ci"
import SidebarContent from "../../components/sidebar_content"
import Sidebar from "../../components/Header"
import {AiOutlineCheck, AiOutlineClose, AiFillCheckCircle, AiOutlineInbox, AiOutlineFileExcel} from 'react-icons/ai'
import { IoDocumentTextOutline } from "react-icons/io5";
import {BsCircle} from 'react-icons/bs'
import MaterialTitlePanel from "../../components/material_title_panel"
import {Formik} from 'formik'
import mutasi from '../../redux/actions/mutasi'
import pengadaan from '../../redux/actions/pengadaan'
import tempmail from '../../redux/actions/tempmail'
import depo from '../../redux/actions/depo'
import auth from '../../redux/actions/auth'
import user from '../../redux/actions/user'
import {default as axios} from 'axios'
import {connect} from 'react-redux'
import logo from '../../assets/img/logo.png'
import moment from 'moment'
import Pdf from "../../components/Pdf"
import newnotif from '../../redux/actions/newnotif'
import Select from 'react-select'
import * as Yup from 'yup'
import placeholder from  "../../assets/img/placeholder.png"
import NavBar from '../../components/NavBar'
import { MdUpload, MdDownload, MdEditSquare, MdAddCircle, MdDelete } from "react-icons/md"
import OtpInput from "react-otp-input";
import { HiOutlineUserGroup } from "react-icons/hi"
import { FiLogOut, FiUser } from 'react-icons/fi'
import styleTrans from '../../assets/css/transaksi.module.css'
import NewNavbar from '../../components/NewNavbar'
import Email from '../../components/Pengadaan/Email'
import NumberInput from '../../components/NumberInput'
import styleHome from '../../assets/css/Home.module.css'
import terbilang from '@develoka/angka-terbilang-js'
import readXlsxFile from 'read-excel-file'
import fs from "file-saver";
import ExcelJS from "exceljs";
const {REACT_APP_BACKEND_URL} = process.env

const alasanSchema = Yup.object().shape({
    alasan: Yup.string()
});

const approveSchema = Yup.object().shape({
    jabatan: Yup.string().required(),
    jenis: Yup.string().required(),
    sebagai: Yup.string().required(),
    id_user: Yup.string().required(),
    kategori: Yup.string(),
});

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
            listNoIo: [],
            valCart: {},
            openType: false,
            openCost: false,
            typeCost: false,
            dataItem: [],
            cost: '',
            qty: '',
            nik: '',
            openModalIo: false,
            total: 0,
            listCost: [],
            typeProfit: false,
            modalApprove: false,
            listSwitch: [],
            modalAdd: false,
            modalEdit: false,
            detailTtd: {},
            fileUpload: '',
            duplikat: [],
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
    }

    handleAdd = (val) => {
        this.setState({valCart: val})
        this.openType()
    }

    openType = () => {
        this.setState({openType: !this.state.openType})
    }

    prosesOpenCost = (val) => {
        this.setState({typeCost: val})
        this.openCost()
    }

    openCost = () => {
        this.setState({openCost: !this.state.openCost, dataItem: []})
    }

    prosesModalIo = () => {
        this.setState({ openModalIo: !this.state.openModalIo, listMut: [] })

    }

    addItem = async (val) => {
        const data = {
            cost_center: val.cost_center,
            nik: val.nik,
            qty: val.qty
        }
        const { dataItem, valCart } = this.state
        let total = parseInt(val.qty)
        const cekCost = []
        for (let i = 0; i < dataItem.length; i++) {
            total += parseInt(dataItem[i].qty)
            if (dataItem[i].cost_center === val.cost_center) {
                cekCost.push(dataItem[i])
            }
        }
        if (!val.cost_center || !val.qty || parseInt(val.qty) === 0) {
            this.setState({confirm: 'falseAddDetail'})
            this.openConfirm()
        } else if (total > parseInt(valCart.qty)) {
            this.setState({confirm: 'falseQty'})
            this.openConfirm()
            this.setState({cost: '', qty: ''})
        } else if (cekCost.length > 0) {
            this.setState({confirm: 'falseCost'})
            this.openConfirm()
            this.setState({cost: '', qty: ''})
        } else {
            if (val.pengadaan_id) {
                const send = {
                    idIo: val.pengadaan_id,
                    dataItem: [data]
                }
                const token = localStorage.getItem('token')
                await this.props.addDetailItem(token, send)
                await this.props.getDetailItem(token, val.pengadaan_id)
                const { dataDetail } = this.props.pengadaan
                this.setState({dataItem: dataDetail, cost: '', qty: ''})
            } else {
                this.setState({dataItem: [...dataItem, data], cost: '', qty: ''})
            }
        }
    }

    updateItem = async (val, index, type) => {
        const data = {
            cost_center: val.cost_center,
            nik: val.nik,
            qty: val.qty
        }
        const { dataItem, valCart } = this.state
        let total = parseInt(val.qty)
        const cekCost = []
        for (let i = 0; i < dataItem.length; i++) {
            if (i !== parseInt(index)) {
                total += parseInt(dataItem[i].qty)
                if (dataItem[i].cost_center === val.cost_center) {
                    cekCost.push(dataItem[i])
                }
            }
        }
        console.log(val, type, index)
        if (total > parseInt(valCart.qty)) {
            this.setState({confirm: 'falseQty'})
            this.openConfirm()
            this.setState({cost: '', qty: ''})
        } else if (cekCost.length > 0) {
            this.setState({confirm: 'falseCost'})
            this.openConfirm()
            this.setState({cost: '', qty: ''})
        } else {
            if (val.pengadaan_id && type && type === 'save') {
                const send = {
                    ...data,
                    idData: val.id,
                    idIo: val.pengadaan_id
                    
                }
                const token = localStorage.getItem('token')
                await this.props.updateDetailItem(token, send)
                await this.props.getDetailItem(token, val.pengadaan_id)
                const { dataDetail } = this.props.pengadaan
                this.setState({dataItem: dataDetail})
                this.setState({confirm: 'update'})
                this.openConfirm()
            } else {
                const newData = []
                for (let i = 0; i < dataItem.length; i++) {
                    if (i === parseInt(index)) {
                        newData.push(val)
                    } else {
                        newData.push(dataItem[i])
                    }
                }
                this.setState({dataItem: newData})
                if (type && type === 'save') {
                    this.setState({confirm: 'update'})
                    this.openConfirm()
                }
            }
        }
        
    }

    deleteDetail = async (val) => {
        if (val.pengadaan_id) {
            const token = localStorage.getItem('token')
            await this.props.deleteDetailItem(token, val.id)
            await this.props.getDetailItem(token, val.pengadaan_id)
            const { dataDetail } = this.props.pengadaan
            this.setState({dataItem: dataDetail})
        } else {
            const { dataItem } = this.state
            const newData = dataItem.filter(x => x.cost_center !== val.cost_center)
            this.setState({dataItem: newData})
        }
    }

    saveAdd = async () => {
        const {valCart, dataItem} = this.state
        const cek = dataItem.filter(x => x.pengadaan_id)
        if (cek.length === dataItem.length && cek.length !== 0) {
            this.setState({confirm: 'update'})
            this.openConfirm()
        } else {
            let cekQty = 0
            for (let i = 0; i < dataItem.length; i++) {
                cekQty += parseInt(dataItem[i].qty)
            }
            if (cekQty !== parseInt(valCart.qty)) {
                this.setState({confirm: 'falseQty'})
                this.openConfirm()
            } else {
                const token = localStorage.getItem('token')
                const {dataCart} = this.props.pengadaan
                const cek = []
                const cekName = []
                for (let i = 0; i < dataCart.length; i++) {
                    if (dataCart[i].kategori !== valCart.kategori || dataCart[i].tipe !== valCart.tipe || dataCart[i].jenis !== valCart.jenis) {
                        cek.push(1)
                    } else if (dataCart[i].nama.toLowerCase() === valCart.nama.toLowerCase()) {
                        cekName.push(dataCart[i])
                    }
                }

                if (cek.length > 0) {
                    this.setState({confirm: 'falseAdd'})
                    this.openConfirm()
                } else if (cekName.length > 0) {
                    this.setState({confirm: 'falseName'})
                    this.openConfirm()
                } else {
                    const data = {
                        ...valCart,
                        no_ref: valCart.kategori === 'return' ? this.state.noAjuan : '',
                        type_ajuan: this.state.typeCost
                    }
                    await this.props.addCart(token, data)
                    const {detailCart} = this.props.pengadaan
                    const send = {
                        idIo: detailCart.id,
                        dataItem
                    }
                    await this.props.addDetailItem(token, send)
                    this.getDataCart()
                    this.prosesAdd()
                    this.openCost()
                    this.openType()
                    this.setState({confirm: 'add'})
                    this.openConfirm()
                }
            }
        }
    }

    onChangeHandler = e => {
        const {size, type} = e.target.files[0]
        if (size >= 5120000) {
            this.setState({errMsg: "Maximum upload size 5 MB"})
            this.uploadAlert()
        } else if (type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && type !== 'application/vnd.ms-excel' ){
            this.setState({errMsg: 'Invalid file type. Only excel files are allowed.'})
            this.uploadAlert()
        } else {
            this.setState({fileUpload: e.target.files[0]})
        }
    }

    uploadDetailCostCenter = async (val) => {
        const { dataItem, fileUpload, modalEdit } = this.state
        const { idOps } = this.props.ops
        const token = localStorage.getItem('token')
        const dataTemp = []
        const rows = await readXlsxFile(fileUpload)
        const dataCek = []
        const count = []
        const parcek = [
            'Cost Center / Plant',
            'Qty'
        ]
        const valid = rows[0]
        for (let i = 0; i < parcek.length; i++) {
            if (valid[i] === parcek[i]) {
                count.push(1)
            }
        }
        if (count.length === parcek.length) {
            rows.shift()
            const noIdent = []
            const result = []
            for (let i = 0; i < rows.length; i++) {
                const dataCost = rows[i]
                const noid = `Cost Center / Plant : ${dataCost[0]}`
                noIdent.push(noid)
            }

            const obj = {}

            noIdent.forEach(item => {
                if (!obj[item]) { obj[item] = 0 }
                obj[item] += 1
            })

            for (const prop in obj) {
                if (obj[prop] >= 2) {
                    result.push(prop)
                }
            }
            if (result.length > 0) {
                this.setState({ confirm: 'dupUpload', duplikat: result })
                this.openConfirm()
            } else {
                for (let i = 0; i < rows.length; i++) {
                    const dataOps = rows[i]
                    const data = {
                        no_pol: dataOps[0],
                        liter: dataOps[1] ,
                        km: dataOps[2],
                        nominal: dataOps[3],
                        date_bbm: dataOps[4],
                    }

                    const noPol = dataOps[0]
                    const liter = dataOps[1]
                    const km = dataOps[2]
                    const nominal = dataOps[3]
                    const dateBbm = dataOps[4]

                    const dataNominal = nominal === null || (nominal.toString().split('').filter((item) => item !== '.' && item !== ',' && isNaN(parseFloat(item))).length > 0)
                        ? { no_transaksi: `Row ke ${i + 2}`, mess: 'Pastikan Nominal Diisi dengan Sesuai' }
                        : null
                    const dataLiter = liter === null || (liter.toString().split('').filter((item) => item !== '.' && item !== ',' && isNaN(parseFloat(item))).length > 0)
                        ? { no_transaksi: `Row ke ${i + 2}`, mess: 'Pastikan Data Liter Diisi dengan Sesuai' }
                        : null
                    const dataKm = km === null || (km.toString().split('').filter((item) => item !== '.' && item !== ',' && isNaN(parseFloat(item))).length > 0)
                        ? { no_transaksi: `Row ke ${i + 2}`, mess: 'Pastikan Data KM Diisi dengan Sesuai' }
                        : null
                    const cekDate = dateBbm === null || dateBbm === '' || dateBbm.length === 0
                        ? { no_transaksi: `Row ke ${i + 2}`, mess: `Pastikan Tgl Pengisian Bbm Diisi dengan Sesuai` }
                        : null
                    const cekNopol = noPol === null || noPol === '' || noPol.length === 0
                        ? { no_transaksi: `Row ke ${i + 2}`, mess: `Pastikan No Pol Diisi dengan Sesuai` }
                        : null

                    if (dataLiter !== null || dataKm !== null || dataNominal !== null || cekDate !== null || cekNopol !== null) {
                        const mesTemp = [dataLiter, dataKm, dataNominal, cekDate, cekNopol]
                        dataCek.push(mesTemp)
                    } else {
                        // const cek = dataItem.find(({ no_pol }) => (data.no_pol !== '' && no_pol === data.no_pol))
                        const cek = dataItem.find((item) => (data.no_pol !== '' && item.no_pol === data.no_pol && parseFloat(item.km) === parseFloat(data.km)))
                        console.log(cek)
                        if (cek !== undefined) {
                            console.log('masuk not undefined BBM')
                            cek.liter = data.liter
                            cek.nominal = data.nominal
                        } else {
                            console.log('masuk undefined BBM')
                            dataTemp.push(data)
                        }
                    }
                }
                console.log(dataCek)
                console.log(dataTemp)
                if (dataCek.length > 0 || rows.length === 0) {
                    console.log('masuk failed king')

                    this.setState({ messUpload: dataCek })
                    this.openUpBbm()
                    this.setState({ confirm: 'failUpload' })
                    this.openConfirm()
                } else {
                    console.log('masuk success king')
                    if (modalEdit === true) {
                        const comb = [...dataItem, ...dataTemp]
                        console.log(comb)
                        const send = {
                            id: idOps.id,
                            list: comb
                        }
                        await this.props.uploadBbm(token, send)
                        await this.props.getBbm(token, idOps.id)
                        const { opsBbm } = this.props.ops
                        this.setState({ dataItem: opsBbm })
                       
                        const valBbm = opsBbm.reduce((accumulator, object) => {
                            return accumulator + parseFloat(object.nominal);
                        }, 0)
                        this.setState({nilai_ajuan: valBbm})
                        setTimeout(() => {
                            this.formulaTax()
                        }, 100)
                        
                        this.openUpBbm()
                        await this.editCartOps(idOps)
                        this.setState({ confirm: 'upload' })
                        this.openConfirm()
                    } else {
                        const comb = [...dataItem, ...dataTemp]
                        this.setState({ dataItem: comb })
                        
                        const valBbm = comb.reduce((accumulator, object) => {
                            return accumulator + parseFloat(object.nominal);
                        }, 0)
                        this.setState({nilai_ajuan: valBbm})
                        setTimeout(() => {
                            this.formulaTax()
                        }, 100)

                        this.openUpBbm()
                        this.setState({ confirm: 'upload' })
                        this.openConfirm()
                    }
                }
            }
        } else {
            this.openUpBbm()
            this.setState({ confirm: 'falseUpload' })
            this.openConfirm()
        }
    }

    downloadDetailCostCenter = () => {
        const { dataItem } = this.state

        const workbook = new ExcelJS.Workbook();
        const ws = workbook.addWorksheet('data bbm')

        // await ws.protect('F1n4NcePm4')

        const borderStyles = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }


        ws.columns = [
            { header: 'Cost Center / Plant', key: 'c1' },
            { header: 'Qty', key: 'c2' }
        ]

        dataItem.map((item, index) => {
            return (ws.addRow(
                {
                    c1: item.cost_center,
                    c2: item.qty
                }
            )
            )
        })

        ws.eachRow({ includeEmpty: true }, function (row, rowNumber) {
            row.eachCell({ includeEmpty: true }, function (cell, colNumber) {
                cell.border = borderStyles;
            })
        })

        ws.columns.forEach(column => {
            const lengths = column.values.map(v => v.toString().length)
            const maxLength = Math.max(...lengths.filter(v => typeof v === 'number'))
            column.width = maxLength + 5
        })

        workbook.xlsx.writeBuffer().then(function (buffer) {
            fs.saveAs(
                new Blob([buffer], { type: "application/octet-stream" }),
                `Data Detail Cost Center ${moment().format('DD MMMM YYYY')}.xlsx`
            )
        })
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
        this.getDataDepo()
        this.getDataCart()
    }

    getDataDepo = async () => {
        const token = localStorage.getItem('token')
        await this.props.getDepo(token, 1000, '')
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
        console.log(dataCart[0].kode_plant)
        if (dataCart[0].kode_plant === 'HO') {
            await this.props.getDraftEmailHo(token, tempno)
            await this.props.saveApproval(token, noIo)
        } else {
            await this.props.getDraftEmail(token, tempno)
        }
        
        this.openDraftEmail()
    }

    openDraftEmail = () => {
        this.setState({openDraft: !this.state.openDraft}) 
    }

    prosesCek = async () => {
        const token = localStorage.getItem('token')
        const level = localStorage.getItem('level')
        await this.props.getCart(token)
        const { dataCart } = this.props.pengadaan
        const cek = []
        const cekItem = []
        for (let i = 0; i < dataCart.length; i++) {
            await this.props.getDocCart(token, dataCart[i].id)
            const {dataDocCart} = this.props.pengadaan
            for (let x = 0; x < dataDocCart.length; x++) {
                if (dataDocCart[x].path === null || !dataDocCart[x].path) {
                    cek.push(1)
                }
            }

            if (parseInt(level) !== 5 && dataCart[i].kategori !== 'return') {
                await this.props.getDetailItem(token, dataCart[i].id)
                const {dataDetail} = this.props.pengadaan
                let total = 0
                for (let x = 0; x < dataDetail.length; x++) {
                    total += parseInt(dataDetail[x].qty)
                }

                if (total !== parseInt(dataCart[i].qty)) {
                    cekItem.push(dataCart[i])
                }
            }
            
        }
        if (cek.length > 0) {
            this.setState({confirm: 'rejSubmit'})
            this.openConfirm()
        } else if (cekItem.length > 0) {
            this.setState({confirm: 'falseQty'})
            this.openConfirm()
        } else {
            this.openModalSub()
        }
    }

    updateAlasan = async (val) => {
        const token = localStorage.getItem('token')
        const { noIo } = this.props.pengadaan
        await this.props.updateReason(token, noIo, val)
        await this.props.getCart(token)
        this.setState({ confirm: 'upreason' })
        this.openConfirm()
    }

    submitCart = async () => {
        const token = localStorage.getItem('token')
        const kode = localStorage.getItem('kode')
        await this.props.getCart(token)
        const level = localStorage.getItem('level')
        const { dataCart } = this.props.pengadaan
        const cek = []
        const cekItem = []
        for (let i = 0; i < dataCart.length; i++) {
            const doc = dataCart[i].doc
            if (doc === null || doc === undefined || doc.length === 0) {
                cek.push(1)
            } else {
                await this.props.getDocCart(token, dataCart[i].id)
                const {dataDocCart} = this.props.pengadaan
                for (let x = 0; x < dataDocCart.length; x++) {
                    if (dataDocCart[x].path === null || !dataDocCart[x].path) {
                        cek.push(1)
                    }
                }

                if (parseInt(level) !== 5 && dataCart[i].kategori !== 'return') {
                    await this.props.getDetailItem(token, dataCart[i].id)
                    const {dataDetail} = this.props.pengadaan
                    let total = 0
                    for (let x = 0; x < dataDetail.length; x++) {
                        total += parseInt(dataDetail[x].qty)
                    }

                    if (total !== parseInt(dataCart[i].qty)) {
                        cekItem.push(dataCart[i])
                    }
                }
            }
        }
        if (cek.length > 0) {
            this.setState({confirm: 'rejSubmit'})
            this.openConfirm()
        } else if (cekItem.length > 0) {
            this.setState({confirm: 'falseQty'})
            this.openConfirm()
        } else {
            const { dataDepo } = this.props.depo
            let num = 0
            const listCost = []
            const cekCost = []
            const data = dataCart
            for (let i = 0; i < data.length; i++) {
                const temp = parseInt(data[i].price) * parseInt(data[i].qty)
                num += temp
                await this.props.getDetailItem(token, data[i].id)
                if (data[0].type_ajuan !== 'single' && data[0].type_ajuan !== 'multiple') {
                    cekCost.push('area')
                } else {
                    const { dataDetail } = this.props.pengadaan
                    for (let x = 0; x < dataDetail.length; x++) {
                        listCost.push(dataDetail[x])
                        cekCost.push(dataDetail[x].cost_center)
                    }
                }
            }
            const uniqueCost = [...new Set(cekCost)]
            const typeCost = cekCost[0] === 'area' ? 'area' : uniqueCost.length > 1 ? "MULTIPLE" : uniqueCost[0].split('-')[1]
            const typeProfit = cekCost[0] === 'area' ? 'area' : uniqueCost.length > 1 ? "MULTIPLE" : dataDepo.find(x => x.cost_center === typeCost).profit_center
            this.setState({ total: num, typeCost: typeCost, listCost: listCost, typeProfit: typeProfit })
            await this.props.submitIo(token)
            if (kode && kode !== 'null' && kode !== 'undefined') {
                this.prepSendEmail()
            } else {
                const { noIo } = this.props.pengadaan
                await this.props.getApproveIo(token, noIo)
                this.prosesModalIo()
            }
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
            this.setState({ openModalIo: false })
        } else {
            await this.props.submitIoFinal(token, data)
            await this.props.sendEmail(token, sendMail)
            await this.props.addNewNotif(token, sendMail)
            this.getDataCart()
            this.openModalSub()
            this.setState({confirm: 'submit'})
            this.openDraftEmail()
            this.openConfirm()
            this.setState({ openModalIo: false })
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
    
    prosesModalRinci = async (val) => {
        const token = localStorage.getItem('token')
        await this.props.getDetailItem(token, val.id)
        const { dataDetail } = this.props.pengadaan
        this.setState({dataRinci: val, noAjuan: val.no_ref, dataItem: dataDetail, valCart: val})
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
        const cekName = []
        for (let i = 0; i < dataCart.length; i++) {
            if (dataCart[i].kategori !== val.kategori || dataCart[i].tipe !== val.tipe || dataCart[i].jenis !== val.jenis) {
                cek.push(1)
            } else if (dataCart[i].nama.toLowerCase() === val.nama.toLowerCase()) {
                cekName.push(dataCart[i])
            }
        }

        if (cek.length > 0) {
            this.setState({confirm: 'falseAdd'})
            this.openConfirm()
        } else if (cekName.length > 0) {
            this.setState({confirm: 'falseName'})
            this.openConfirm()
        } else {
            const data = {
                ...val,
                no_ref: val.kategori === 'return' ? this.state.noAjuan : '',
                type_ajuan: this.state.typeCost
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
        const {dataCart} = this.props.pengadaan
        const {dataRinci} = this.state
        const cek = []
        const cekName = []
        for (let i = 0; i < dataCart.length; i++) {
            if ((dataCart[i].kategori !== val.kategori || dataCart[i].tipe !== val.tipe || dataCart[i].jenis !== val.jenis) && dataCart.length > 1) {
                cek.push(1)
            } else if (dataCart[i].nama.toLowerCase() === val.nama.toLowerCase() && dataRinci.id !== dataCart[i].id) {
                cekName.push(dataCart[i])
            }
        }

        if (cek.length > 0) {
            this.setState({confirm: 'falseUpdate'})
            this.openConfirm()
        } else if (cekName.length > 0) {
            this.setState({confirm: 'falseName'})
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

    prosesModalApprove = async (val) => {
        const token = localStorage.getItem('token')
        await this.props.getUser(token, 'all', '', 1, 'all', 'username', 'asc', 'master')
        await this.props.getRole(token)
        this.openModalApprove()
    }

    openModalApprove = () => {
        this.setState({modalApprove: !this.state.modalApprove})
    }

    switchApp = async (val) => {
        const { listSwitch } = this.state
        const { noIo } = this.props.pengadaan
        const dataUp = listSwitch
        const token = localStorage.getItem("token")
        dataUp.push(val)
        console.log(listSwitch)
        const { rawApp } = this.props.pengadaan
        if (dataUp.length === 2) {
            for (let i = 0; i < dataUp.length; i++) {
                const values = rawApp.find(item => item.id === dataUp[i === 0 ? 1 : 0])
                const data = {
                    jabatan: values.jabatan,
                    jenis: values.jenis,
                    sebagai: values.sebagai,
                    kategori: !values.kategori ? 'all' : values.kategori,
                    no_doc: noIo,
                    struktur: !values.struktur ? 'all' : values.struktur,
                    way_app: !values.way_app ? 'web' : values.way_app,
                    id_role: values.id_role,
                    status_view: !values.status_view ? 'visible' : values.status_view,
                    id_user: values.id_user
                }
                await this.props.makeApproval(token, dataUp[i], data, 'switch') 
            }
            await this.props.getApproveIo(token, noIo)
            this.setState({listSwitch: []})
        } else {
            console.log('masuk else listSwitch')
            this.setState({listSwitch: dataUp})
        }
    }

    switchRej = (val) => {
        const { listSwitch } = this.state
        const data = []
        for (let i = 0; i < listSwitch.length; i++) {
            if (listSwitch[i] === val) {
                data.push()
            } else {
                data.push(listSwitch[i])
            }
        }
        this.setState({listSwitch: data})
    }

    openModalAdd = () => {
        this.setState({modalAdd: !this.state.modalAdd})
    }

    openModalEdit = () => {
        this.setState({modalEdit: !this.state.modalEdit})
    }

    prosesMakeApproval = async (val, id) => {
        const token = localStorage.getItem('token')
        const { noIo } = this.props.pengadaan
        const { dataRole } = this.props.user
        const data = {
            jabatan: val.jabatan,
            jenis: val.jenis,
            sebagai: val.sebagai,
            kategori: !val.kategori ? 'all' : val.kategori,
            struktur: !val.struktur ? 'all' : val.struktur,
            way_app: !val.way_app ? 'web' : val.way_app,
            status_view: !val.status_view ? 'visible' : val.status_view,
            id_user: val.id_user,
            no_doc: noIo,
            id_role: dataRole.find(item => item.name === val.jabatan).nomor
        }
        await this.props.makeApproval(token, id || 'false', data)
        await this.props.getApproveIo(token, noIo)
        if (id) {
            this.openModalEdit()
        } else {
            this.openModalAdd()
        }
    }

    deleteDataApprove = async (val) => {
        const token = localStorage.getItem('token')
        const { noIo } = this.props.pengadaan
        await this.props.deleteApproval(token, val.id)
        await this.props.getApproveIo(token, noIo)
    }

    cekProsesSubmit = async () => {
        const { dataCart, dataApp } = this.props.pengadaan
        console.log(dataApp.pembuat)
        console.log(dataApp.pemeriksa)
        console.log(dataApp.penyetuju)
        if ((dataCart[0].alasan === '' || dataCart[0].alasan === null || dataCart[0].alasan === '-')) {
            this.setState({ confirm: 'reason' })
            this.openConfirm()
        } else if ((!dataApp.pembuat || dataApp.pembuat.length < 1) || (!dataApp.pemeriksa || dataApp.pemeriksa.length < 1) || (!dataApp.penyetuju || dataApp.penyetuju.length < 1)) {
            this.setState({ confirm: 'appFailed' })
            this.openConfirm()
        } else {
            this.prepSendEmail()
        }
    }

    render() {
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const {dataCart, dataDocCart, dataDetail, noIo, dataApp, rawApp } = this.props.pengadaan
        const {dataRinci, dataItem, valCart, total, typeCost, typeProfit, listSwitch, detailTtd, duplikat} = this.state
        const { dataDepo } = this.props.depo
        const { dataRole, dataUser } = this.props.user
        const listType = ['single', 'multiple']
        const loadingIo = this.props.pengadaan.isLoading
        const loadingMail = this.props.tempmail.isLoading
        const loadingDepo = this.props.depo.isLoading
        const loadingUser = this.props.user.isLoading
        const loadingAll = loadingIo || loadingMail || loadingDepo || loadingUser

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
                                                <Button id={`toolEdit${index}`} onClick={() => this.prosesModalRinci(item)} className='mt-1 mr-1' color='success'><MdEditSquare size={25}/></Button>
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
                    onSubmit={(values) => {values.kategori === 'return' || parseInt(level) === 5 ? this.addCart(values) : this.handleAdd(values)}}
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
                <Modal isOpen={this.state.rinci} size='xl' className='xl'>
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
                        end: dataRinci.end === null || dataRinci.end === undefined ? '' : dataRinci.end.slice(0, 10),
                        type_ajuan: dataRinci.type_ajuan
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

                            {values.kategori !== 'return' && (
                                <>
                                    <div className='mt-4 mb-2 bold'>Detail Cost Center {dataRinci.type_ajuan}</div>
                                    <Table>
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Cost Center</th>
                                                {dataRinci.type_ajuan === 'single' && (
                                                    <th>NIK (opsional)</th>
                                                )}
                                                <th>Qty<br></br>( {parseInt(valCart.qty) - (dataItem.reduce((sum, item) => sum + parseInt(item.qty || 0), 0))} remaining )</th>
                                                <th>Opsi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dataItem.length > 0 && dataItem.map((item, index) => {
                                                return (
                                                    <tr>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            <Select
                                                                options={
                                                                    dataDepo.length > 0 && dataDepo.map(item => {
                                                                        return (
                                                                            ({value: `${item.place_asset}-${item.cost_center}`, label: `${item.place_asset}-${item.cost_center}`})
                                                                        )
                                                                    })
                                                                }
                                                                onChange={e => this.updateItem({...item, cost_center: e.value}, index)}
                                                                isSearchable
                                                                components={
                                                                    {
                                                                        DropdownIndicator: () => null,
                                                                    }
                                                                }
                                                                value={{value: item.cost_center, label: item.cost_center}}
                                                            />
                                                        </td>
                                                        {dataRinci.type_ajuan === 'single' && (
                                                            <td>
                                                                <Input 
                                                                    name="nik"
                                                                    value={item.nik}
                                                                    onChange={e => this.updateItem({...item, nik: e.target.value}, index)}
                                                                />
                                                            </td>    
                                                        )}
                                                        <td>
                                                            <Input 
                                                                type='number'
                                                                min="1"
                                                                onKeyDown={e => {
                                                                    if (e.key === '-' || e.key === '0' || e.key === 'e') {
                                                                        e.preventDefault();
                                                                    }
                                                                }}
                                                                value={item.qty}
                                                                onChange={e => this.updateItem({...item, qty: e.target.value}, index)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <Button
                                                                onClick={() => this.updateItem(item, index, 'save')}
                                                                color='success'
                                                                className='ml-1 mt-1'
                                                            >
                                                                Save
                                                            </Button>
                                                            <Button
                                                                onClick={() => this.deleteDetail(item)}
                                                                color='danger'
                                                                className='ml-1 mt-1'
                                                            >
                                                                Delete
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                            {(parseInt(valCart.qty) - (dataItem.reduce((sum, item) => sum + parseInt(item.qty || 0), 0))) !== 0 && (
                                                <tr>
                                                    <td>{dataItem.length + 1}</td>
                                                    <td>
                                                        <Select
                                                            options={
                                                                dataDepo.length > 0 && dataDepo.map(item => {
                                                                    return (
                                                                        ({value: `${item.place_asset}-${item.cost_center}`, label: `${item.place_asset}-${item.cost_center}`})
                                                                    )
                                                                })
                                                            }
                                                            onChange={e => this.setState({cost: e.value})}
                                                            isSearchable
                                                            components={
                                                                {
                                                                    DropdownIndicator: () => null,
                                                                }
                                                            }
                                                            value={{value: this.state.cost, label: this.state.cost}}
                                                        />
                                                    </td>
                                                    {dataRinci.type_ajuan === 'single' && (
                                                        <td>
                                                            <Input 
                                                                value={this.state.nik}
                                                                onChange={e => this.setState({nik: e.target.value})}
                                                            />
                                                        </td>    
                                                    )}
                                                    <td>
                                                        <Input 
                                                            type='number'
                                                            min="1"
                                                            value={this.state.qty}
                                                            onChange={e => this.setState({qty: e.target.value})}
                                                            onKeyDown={e => {
                                                                if (e.key === '-' || e.key === '0' || e.key === 'e') {
                                                                    e.preventDefault();
                                                                }
                                                            }}
                                                        />
                                                    </td>
                                                    <td>
                                                        <Button
                                                            onClick={() => this.addItem({
                                                                cost_center: this.state.cost,
                                                                nik: this.state.nik,
                                                                qty: this.state.qty,
                                                                pengadaan_id: dataRinci.id
                                                            })}
                                                            color='success'
                                                            className='ml-1 mt-1'
                                                        >
                                                            Save
                                                        </Button>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
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
                <Modal isOpen={loadingAll} size="sm">
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
            <Modal isOpen={this.state.openType} size='xl' toggle={this.openType}>
                <ModalBody>
                    <div className={styleHome.mainContent}>
                        <main className={styleHome.mainSection}>
                        <h1 className={styleHome.title}>Tipe pengadaan asset</h1>
                        <h4 className={styleHome.subtitle}></h4>

                        <div className={`${styleHome.assetContainer} row`}>
                            {listType.length > 0 && listType.filter(x => parseInt(valCart.qty) === 1 ? x !== 'multiple' : x).map(item => {
                                return (
                                    <div 
                                    onClick={() => this.prosesOpenCost(item)} 
                                    className="col-12 col-md-6 col-lg-3 mb-4">
                                        <div className={styleHome.assetCard1}>
                                            {item === 'single' ? (
                                                <FiUser size={150} className='mt-4 mb-4' />
                                            ) : (
                                                <HiOutlineUserGroup size={150} className='mt-4 mb-4' />
                                            )}
                                            
                                            <p className='mt-2 mb-4 sizeCh text-uppercase'>
                                                {item === 'single' ? 'single cost center' : 'multiple cost center'}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        </main>
                    </div>
                </ModalBody>
            </Modal>
            <Modal size='xl' isOpen={this.state.openCost}>
                <ModalHeader>Detail Cost Center</ModalHeader>
                <ModalBody>
                    <Table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Cost Center</th>
                                {this.state.typeCost === 'single' && (
                                    <th>NIK (opsional)</th>
                                )}
                                <th>Qty<br></br>( {parseInt(valCart.qty) - (dataItem.reduce((sum, item) => sum + parseInt(item.qty || 0), 0))} remaining )</th>
                                <th>Opsi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataItem.length > 0 && dataItem.map((item, index) => {
                                return (
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>
                                            <Select
                                                options={
                                                    dataDepo.length > 0 && dataDepo.map(item => {
                                                        return (
                                                            ({value: `${item.place_asset}-${item.cost_center}`, label: `${item.place_asset}-${item.cost_center}`})
                                                        )
                                                    })
                                                }
                                                onChange={e => this.updateItem({...item, cost_center: e.value}, index)}
                                                isSearchable
                                                components={
                                                    {
                                                        DropdownIndicator: () => null,
                                                    }
                                                }
                                                value={{value: item.cost_center, label: item.cost_center}}
                                            />
                                        </td>
                                        {this.state.typeCost === 'single' && (
                                            <td>
                                                <Input 
                                                    value={item.nik}
                                                    onChange={e => this.updateItem({...item, nik: e.target.value}, index)}
                                                />
                                            </td>    
                                        )}
                                        <td>
                                            <Input 
                                                type='number'
                                                min="1"
                                                value={item.qty}
                                                onKeyDown={e => {
                                                    if (e.key === '-' || e.key === '0' || e.key === 'e') {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                onChange={e => this.updateItem({...item, qty: e.target.value}, index)}
                                            />
                                        </td>
                                        <td>
                                            <Button
                                                onClick={() => this.updateItem(item, index, 'save')}
                                                color='success'
                                                className='ml-1 mt-1'
                                            >
                                                Save
                                            </Button>
                                            <Button
                                                onClick={() => this.deleteDetail(item)}
                                                color='danger'
                                                className='ml-1 mt-1'
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                )
                            })}
                            {(parseInt(valCart.qty) - (dataItem.reduce((sum, item) => sum + parseInt(item.qty || 0), 0))) !== 0 && (
                                <tr>
                                    <td>{dataItem.length + 1}</td>
                                    <td>
                                        <Select
                                            options={
                                                dataDepo.length > 0 && dataDepo.map(item => {
                                                    return (
                                                        ({value: `${item.place_asset}-${item.cost_center}`, label: `${item.place_asset}-${item.cost_center}`})
                                                    )
                                                })
                                            }
                                            onChange={e => this.setState({cost: e.value})}
                                            isSearchable
                                            components={
                                                {
                                                    DropdownIndicator: () => null,
                                                }
                                            }
                                            value={{value: this.state.cost, label: this.state.cost}}
                                        />
                                    </td>
                                    {this.state.typeCost === 'single' && (
                                        <td>
                                            <Input 
                                                value={this.state.nik}
                                                onChange={e => this.setState({nik: e.target.value})}
                                            />
                                        </td>    
                                    )}
                                    <td>
                                        <Input 
                                            type='number'
                                            min="1"
                                            value={this.state.qty}
                                            onChange={e => this.setState({qty: e.target.value})}
                                            onKeyDown={e => {
                                                if (e.key === '-' || e.key === '0' || e.key === 'e') {
                                                    e.preventDefault();
                                                }
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <Button
                                            onClick={() => this.addItem({
                                                cost_center: this.state.cost,
                                                nik: this.state.nik,
                                                qty: this.state.qty
                                            })}
                                            color='success'
                                            className='ml-1 mt-1'
                                        >
                                            Save
                                        </Button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color='success'
                        onClick={this.saveAdd}
                    >
                        Submit
                    </Button>
                    <Button
                        color='secondary'
                        onClick={this.openCost}
                    >
                        Close
                    </Button>
                </ModalFooter>
            </Modal>
            <Modal size="xl" isOpen={this.state.openModalIo} toggle={this.prosesModalIo} className='large'>
                <ModalHeader toggle={this.prosesModalIo}>{noIo}</ModalHeader>
                <ModalBody className="mb-5">
                    <Container className='borderGen'>
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
                                checked
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
                                    numInputs={(this.state.value === undefined || this.state.value === null) ? 11 : this.state.value.length > 11 ? this.state.value.length : 11}
                                    inputStyle={style.otp}
                                    containerStyle={style.containerOtp}
                                    // isDisabled={level === '8' ? false : true}
                                    // isDisabled
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
                                            {/* <th>OPSI</th> */}
                                            {level === '2' && (
                                                <th><text className='red star'>*</text> Asset</th>
                                            )}
                                            <th>Status IT</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataCart !== undefined && dataCart.length > 0 && dataCart.map(item => {
                                            return (
                                                item.isAsset === 'false' && level !== '2' ? (
                                                    null
                                                ) : (
                                                    <tr >
                                                        <td>{item.qty}</td>
                                                        <td className='tdDesc'>{item.nama}</td>
                                                        <td>Rp {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                        <td>Rp {(parseInt(item.price) * parseInt(item.qty)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                        {/* <td><Button onClick={() => this.openModalRinci()}>Detail</Button></td> */}
                                                        {level === '2' && (
                                                            <td className='colTable'>
                                                                <div className='mb-1'>
                                                                    <Input
                                                                        addon
                                                                        disabled={item.status_app === null ? false : true}
                                                                        checked={item.isAsset === 'true' ? true : false}
                                                                        type="checkbox"
                                                                        onClick={() => this.updateIo({ item: item, value: 'true' })}
                                                                        className='mr-1'
                                                                        value={item.no_asset} />
                                                                    <text>Ya</text>
                                                                </div>
                                                                <div>
                                                                    <Input
                                                                        addon
                                                                        disabled={item.status_app === null ? false : true}
                                                                        checked={item.isAsset === 'false' ? true : false}
                                                                        type="checkbox"
                                                                        onClick={() => this.updateIo({ item: item, value: 'false' })}
                                                                        className='mr-1'
                                                                        value={item.no_asset} />
                                                                    <text>Tidak</text>
                                                                </div>
                                                            </td>
                                                        )}
                                                        <td>
                                                            {item.jenis === 'it' ? 'IT' : item.jenis === 'non-it' ? 'NON IT' : '-'}
                                                        </td>
                                                    </tr>
                                                )
                                            )
                                        })}
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
                                    value={dataCart[0] === undefined ? '' 
                                        : typeCost === 'area' ? (dataDepo.find(x => x.kode_plant === dataCart[0].kode_plant).cost_center)
                                        : typeCost}
                                    isDisabled
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
                                    value={dataCart[0] === undefined ? '' 
                                        : typeProfit === 'area' ? (dataDepo.find(x => x.kode_plant === dataCart[0].kode_plant).profit_center)
                                        : typeProfit}
                                    isDisabled
                                    numInputs={10}
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
                                        checked={dataCart[0] === undefined ? '' : dataCart[0].kategori === 'budget' ? true : false}
                                    />
                                </Col>
                                <Col md={4} lg={4}>
                                    <Form.Check
                                        type="checkbox"
                                        label="Non Budgeted"
                                        checked={dataCart[0] === undefined ? '' : dataCart[0].kategori === 'non-budget' ? true : false}
                                    />
                                </Col>
                                <Col md={4} lg={4}>
                                    <Form.Check
                                        type="checkbox"
                                        label="Return"
                                        checked={dataCart[0] === undefined ? '' : dataCart[0].kategori === 'return' ? true : false}
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
                                <text>Rp {total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</text>
                            </Col>
                        </Row>
                        <Row className="rowModal mt-4">
                            <Col md={2} lg={2}>
                            </Col>
                            <Col md={10} lg={10} className="colModal">
                                <text className="mr-3"> </text>
                                <text className='text-capitalize'>Terbilang ( {terbilang(total)} Rupiah )</text>
                            </Col>
                        </Row>
                        <Formik
                            initialValues={{
                                alasan: dataCart[0] === undefined ? '' : dataCart[0].alasan === null || dataCart[0].alasan === '' || dataCart[0].alasan === '-' ? '' : dataCart[0].alasan,
                            }}
                            validationSchema={alasanSchema}
                            onSubmit={(values) => { this.updateAlasan(values) }}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, }) => (
                                <div>
                                    <Row className="rowModal mt-4">
                                        <Col md={2} lg={2}>
                                            Alasan
                                        </Col>
                                        <Col md={10} lg={10} className="colModal">
                                            <text className="mr-3">:</text>
                                                <Input
                                                    type='textarea'
                                                    name='alasan'
                                                    className='inputRecent'
                                                    value={values.alasan}
                                                    onChange={handleChange('alasan')}
                                                    onBlur={handleBlur('alasan')}
                                                />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={2} lg={2}></Col>
                                        <Col md={10} lg={10} >
                                            <text className="mr-3"></text>
                                            {errors.alasan ? (
                                                <text className={style.txtError}>Must be filled</text>
                                            ) : null}
                                        </Col>
                                    </Row>
                                    <Row className="rowModal mt-1">
                                        <Col md={2} lg={2}>
                                        </Col>
                                        <Col md={10} lg={10} className="colModal1">
                                            <text className="mr-3"></text>
                                            <Button onClick={handleSubmit} color='success'>Update</Button>
                                        </Col>
                                    </Row>
                                </div>
                            )}
                        </Formik>
                        <Row className="rowModal mt-4">
                            <Col md={12} lg={12}>
                                {dataCart[0] === undefined ? '' : `${dataCart[0].area}, ${dataCart[0].tglIo ? moment(dataCart[0].tglIo).format('DD MMMM YYYY') : moment().format('DD MMMM YYYY')}`}
                            </Col>
                        </Row>
                        <Row className="rowModal mt-4">
                            <Col md={12} lg={12}>
                                <Button 
                                    color='warning' 
                                    onClick={() => this.prosesModalApprove()}
                                >
                                    Setting Approval
                                </Button>
                            </Col>
                        </Row>
                        <Table bordered responsive className="tabPreview mt-4">
                            <thead>
                                <tr>
                                    <th className="buatPre" colSpan={dataApp.pembuat?.length || 1}>Dibuat oleh,</th>
                                    {dataApp.pemeriksa?.filter(item => item.status_view !== 'hidden').length > 0 && (
                                        <th className="buatPre" colSpan={
                                            dataApp.pemeriksa?.filter(item => item.status_view !== 'hidden').length || 1
                                        }>
                                            Diperiksa oleh,
                                        </th>
                                    )}
                                    {dataApp.penyetuju?.filter(item => item.status_view !== 'hidden').length > 0 && (
                                        <th className="buatPre" colSpan={dataApp.penyetuju?.length || 1}>Disetujui oleh,</th>
                                    )}
                                </tr>
                                <tr>
                                    {dataApp.pembuat?.map(item => (
                                        <th className="headPre">
                                            <div>{item.status === 0 ? 'Reject' : item.status === 1 ? moment(item.updatedAt).format('LL') : '-'}</div>
                                            <div>{item.nama ?? '-'}</div>
                                        </th>
                                    ))}
                                    {dataApp.pemeriksa?.filter(item => item.status_view !== 'hidden').map(item => (
                                        <th className="headPre">
                                            <div>{item.status === 0 ? 'Reject' : item.status === 1 ? moment(item.updatedAt).format('LL') : '-'}</div>
                                            <div>{item.nama ?? '-'}</div>
                                        </th>
                                    ))}
                                    {dataApp.penyetuju?.map(item => (
                                        <th className="headPre">
                                            <div>{item.status === 0 ? 'Reject' : item.status === 1 ? moment(item.updatedAt).format('LL') : '-'}</div>
                                            <div>{item.nama ?? '-'}</div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {dataApp.pembuat?.map(item => (
                                        <td className="footPre">{item.jabatan ?? '-'}</td>
                                    ))}
                                    {dataApp.pemeriksa?.filter(item => item.status_view !== 'hidden').map(item => (
                                        <td className="footPre">{item.jabatan ?? '-'}</td>
                                    ))}
                                    {dataApp.penyetuju?.map(item => (
                                        <td className="footPre">{item.jabatan ?? '-'}</td>
                                    ))}
                                </tr>
                            </tbody>
                        </Table>
                    </Container>
                    {/* <Container>
                        <div className='mt-4'>FRM-FAD-058 REV 06</div>
                    </Container> */}
                </ModalBody>
                <hr />
                <div className="modalFoot">
                    <div className="btnFoot">
                    </div>
                    <div className="btnFoot">
                        <Button className="mr-2" color="danger" onClick={this.prosesModalIo}>
                            Close
                        </Button>
                        <Button color="success" onClick={() => this.cekProsesSubmit('submit')}>
                            Submit
                        </Button>
                    </div>
                </div>
            </Modal>
            <Modal size="xl" className='xl' toggle={this.openModalApprove} isOpen={this.state.modalApprove}>
                <ModalHeader>
                    Detail Approval
                </ModalHeader>
                <ModalBody>
                    <div className={style.headEmail}>
                        <Button color="success" size="lg" className="mb-4" onClick={this.openModalAdd}>Add</Button>
                    </div>
                    <Table striped bordered responsive className={style.tab}>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Jabatan</th>
                                <th>Jenis</th>
                                <th>Sebagai</th>
                                <th>Kategori</th>
                                <th>Struktur User</th>
                                <th>Cara Approve</th>
                                <th>View</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rawApp && rawApp.map(item => {
                                return (
                                    <tr className={listSwitch.find(x => x === item.id) && 'note'}>
                                        <td>{rawApp.indexOf(item) + 1}</td>
                                        <td>{item.jabatan}</td>
                                        <td>{item.jenis}</td>
                                        <td>{item.sebagai}</td>
                                        <td>{item.kategori}</td>
                                        <td>{item.struktur === null ? 'all' : item.struktur}</td>
                                        <td>{item.way_app === null || item.way_app === 'web' ? 'approve web' : 'upload file'}</td>
                                        <td>{item.status_view ? item.status_view : 'visible'}</td>
                                        <td>
                                            <Button className='mt-1' color="success" onClick={() => this.openModalEdit(this.setState({detailTtd: item}))}>Update</Button>
                                            <Button 
                                                className='mt-1 ml-1' 
                                                color="info" 
                                                onClick={listSwitch.find(e => e === item.id) === undefined ? () => this.switchApp(item.id) : () => this.switchRej(item.id)}
                                            >
                                                Switch
                                            </Button>
                                            <Button className='mt-1 ml-1' color="danger" onClick={() => this.deleteDataApprove(item)}>Delete</Button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={this.openModalApprove} color="secondary" size="lg">Close</Button>
                </ModalFooter>
            </Modal>
            <Modal toggle={this.openModalAdd} isOpen={this.state.modalAdd} size="lg">
                <ModalHeader toggle={this.openModalAdd}>Add Approval</ModalHeader>
                <Formik
                initialValues={{
                    jabatan: "",
                    jenis: "all",
                    sebagai: "",
                    kategori: "all",
                    struktur: "all",
                    way_app: "web",
                    status_view: "visible",
                    id_user: null
                }}
                validationSchema={approveSchema}
                onSubmit={(values) => {this.prosesMakeApproval(values)}}
                >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                <ModalBody>
                    <div className={style.addModalDepo}>
                        <text className="col-md-3">
                            Jabatan
                        </text>
                        <div className="col-md-9">
                            <Input
                            type="select" 
                            name="select"
                            value={values.jabatan}
                            onChange={handleChange("jabatan")}
                            onBlur={handleBlur("jabatan")}
                            >
                                <option>-Pilih Jabatan-</option>
                                {dataRole.length !== 0 && dataRole.map(item => {
                                    return (
                                        <option value={item.name}>{item.name}</option>
                                    )
                                })}
                            </Input>
                            {errors.jabatan ? (
                                <text className={style.txtError}>{errors.jabatan}</text>
                            ) : null}
                        </div>
                    </div>
                    <div className={style.addModalDepo}>
                        <text className="col-md-3">
                            User
                        </text>
                        <div className="col-md-9">
                            <Input
                            type="select" 
                            name="id_user"
                            value={values.id_user}
                            onChange={handleChange("id_user")}
                            onBlur={handleBlur("id_user")}
                            >
                                <option>-Pilih User-</option>
                                {dataUser.length !== 0 && dataUser.filter(x => x.user_level === (dataRole.find(item => item.name === values.jabatan)?.nomor)).map(item => {
                                    return (
                                        <option value={item.id}>{item.fullname}</option>
                                    )
                                })}
                            </Input>
                            {errors.id_user ? (
                                <text className={style.txtError}>{errors.id_user}</text>
                            ) : null}
                        </div>
                    </div>
                    <div className={style.addModalDepo}>
                        <text className="col-md-3">
                            Jenis
                        </text>
                        <div className="col-md-9">
                            <Input 
                            type="select" 
                            name="select"
                            value={values.jenis}
                            onChange={handleChange("jenis")}
                            onBlur={handleBlur("jenis")}
                            >
                                <option>-Pilih Jenis-</option>
                                <option value="it">IT</option>
                                <option value="non-it">Non IT</option>
                                <option value="all">All</option>
                            </Input>
                            {errors.jenis ? (
                                    <text className={style.txtError}>{errors.jenis}</text>
                                ) : null}
                        </div>
                    </div>
                    <div className={style.addModalDepo}>
                        <text className="col-md-3">
                            Sebagai
                        </text>
                        <div className="col-md-9">
                            <Input 
                            type="select" 
                            name="select"
                            value={values.sebagai}
                            onChange={handleChange("sebagai")}
                            onBlur={handleBlur("sebagai")}
                            >
                                <option>-Pilih Sebagai-</option>
                                <option value="pembuat">Pembuat</option>
                                <option value="pemeriksa">Pemeriksa</option>
                                <option value="penyetuju">Menyetujui</option>
                            </Input>
                            {errors.sebagai ? (
                                    <text className={style.txtError}>{errors.sebagai}</text>
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
                                <option>-Pilih Kategori-</option>
                                <option value="budget">Budget</option>
                                <option value="non-budget">Non Budget</option>
                                <option value="return">Return</option>
                                <option value="all">All</option>
                            </Input>
                            {errors.kategori ? (
                                    <text className={style.txtError}>{errors.kategori}</text>
                                ) : null}
                        </div>
                    </div>
                    <div className={style.addModalDepo}>
                        <text className="col-md-3">
                            Struktur User
                        </text>
                        <div className="col-md-9">
                            <Input 
                            type="select" 
                            name="select"
                            value={values.struktur}
                            onChange={handleChange("struktur")}
                            onBlur={handleBlur("struktur")}
                            >
                                <option>-Pilih-</option>
                                <option value="pengirim">Pengirim</option>
                                <option value="penerima">Penerima</option>
                                <option value="all">All</option>
                            </Input>
                            {errors.struktur ? (
                                <text className={style.txtError}>{errors.struktur}</text>
                            ) : null}
                        </div>
                    </div>
                    <div className={style.addModalDepo}>
                        <text className="col-md-3">
                            Cara Approve
                        </text>
                        <div className="col-md-9">
                            <Input 
                            type="select" 
                            name="select"
                            value={values.way_app}
                            onChange={handleChange("way_app")}
                            onBlur={handleBlur("way_app")}
                            >
                                <option>-Pilih-</option>
                                <option value="web">Approve web</option>
                                <option value="upload">Upload file</option>
                            </Input>
                            {errors.way_app ? (
                                <text className={style.txtError}>{errors.way_app}</text>
                            ) : null}
                        </div>
                    </div>
                    <div className={style.addModalDepo}>
                        <text className="col-md-3">
                            Status View
                        </text>
                        <div className="col-md-9">
                            <Input 
                            type="select" 
                            name="select"
                            value={values.status_view}
                            onChange={handleChange("status_view")}
                            onBlur={handleBlur("status_view")}
                            >
                                <option>-Pilih-</option>
                                <option value="visible">Visible</option>
                                <option value="hidden">Hidden</option>
                            </Input>
                            {errors.status_view ? (
                                <text className={style.txtError}>{errors.status_view}</text>
                            ) : null}
                        </div>
                    </div>
                    <hr/>
                    <div className={style.foot}>
                        <div></div>
                        <div>
                            <Button className="mr-2" onClick={handleSubmit} color="primary">Save</Button>
                            <Button className="mr-5" onClick={this.openModalAdd}>Cancel</Button>
                        </div>
                    </div>
                </ModalBody>
                )}
                </Formik>
            </Modal>
            <Modal toggle={this.openModalEdit} isOpen={this.state.modalEdit} size="lg">
                <ModalHeader>Edit Approval</ModalHeader>
                <Formik
                initialValues={{
                    jenis: detailTtd.jenis,
                    jabatan: detailTtd.jabatan,
                    sebagai: detailTtd.sebagai,
                    kategori: detailTtd.kategori,
                    struktur: detailTtd.struktur,
                    way_app: detailTtd.way_app,
                    status_view: detailTtd.status_view,
                    id_user: null
                }}
                validationSchema={approveSchema}
                onSubmit={(values) => {this.prosesMakeApproval(values, detailTtd.id)}}
                >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                <ModalBody>
                    <div className={style.addModalDepo}>
                        <text className="col-md-3">
                            Jabatan
                        </text>
                        <div className="col-md-9">
                            <Input
                            type="select" 
                            name="select"
                            value={values.jabatan}
                            onChange={handleChange("jabatan")}
                            onBlur={handleBlur("jabatan")}
                            >
                                <option>-Pilih Jabatan-</option>
                                {dataRole.length !== 0 && dataRole.map(item => {
                                    return (
                                        <option value={item.name}>{item.name}</option>
                                    )
                                })}
                            </Input>
                            {errors.jabatan ? (
                                <text className={style.txtError}>{errors.jabatan}</text>
                            ) : null}
                        </div>
                    </div>
                    <div className={style.addModalDepo}>
                        <text className="col-md-3">
                            User
                        </text>
                        <div className="col-md-9">
                            <Input
                            type="select" 
                            name="id_user"
                            value={values.id_user}
                            onChange={handleChange("id_user")}
                            onBlur={handleBlur("id_user")}
                            >
                                <option>-Pilih User-</option>
                                {dataUser.length !== 0 && dataUser.filter(x => x.user_level === (dataRole.find(item => item.name === values.jabatan)?.nomor)).map(item => {
                                    return (
                                        <option value={item.id}>{item.fullname}</option>
                                    )
                                })}
                            </Input>
                            {errors.id_user ? (
                                <text className={style.txtError}>{errors.id_user}</text>
                            ) : null}
                        </div>
                    </div>
                    <div className={style.addModalDepo}>
                        <text className="col-md-3">
                            Jenis
                        </text>
                        <div className="col-md-9">
                            <Input 
                            type="select" 
                            name="select"
                            value={values.jenis}
                            onChange={handleChange("jenis")}
                            onBlur={handleBlur("jenis")}
                            >
                                <option>-Pilih Jenis-</option>
                                <option value="it">IT</option>
                                <option value="non-it">Non IT</option>
                                <option value="all">All</option>
                            </Input>
                            {errors.jenis ? (
                                    <text className={style.txtError}>{errors.jenis}</text>
                                ) : null}
                        </div>
                    </div>
                    <div className={style.addModalDepo}>
                        <text className="col-md-3">
                            Sebagai
                        </text>
                        <div className="col-md-9">
                            <Input 
                            type="select" 
                            name="select"
                            value={values.sebagai}
                            onChange={handleChange("sebagai")}
                            onBlur={handleBlur("sebagai")}
                            >
                                <option>-Pilih Sebagai-</option>
                                <option value="pembuat">Pembuat</option>
                                <option value="pemeriksa">Pemeriksa</option>
                                <option value="penyetuju">Menyetujui</option>
                            </Input>
                            {errors.sebagai ? (
                                    <text className={style.txtError}>{errors.sebagai}</text>
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
                                <option>-Pilih Kategori-</option>
                                <option value="budget">Budget</option>
                                <option value="non-budget">Non Budget</option>
                                <option value="return">Return</option>
                                <option value="all">All</option>
                            </Input>
                            {errors.kategori ? (
                                    <text className={style.txtError}>{errors.kategori}</text>
                                ) : null}
                        </div>
                    </div>
                    <div className={style.addModalDepo}>
                        <text className="col-md-3">
                            Struktur User
                        </text>
                        <div className="col-md-9">
                            <Input 
                            type="select" 
                            name="select"
                            value={values.struktur}
                            onChange={handleChange("struktur")}
                            onBlur={handleBlur("struktur")}
                            >
                                <option>-Pilih-</option>
                                <option value="pengirim">Pengirim</option>
                                <option value="penerima">Penerima</option>
                                <option value="all">All</option>
                            </Input>
                            {errors.struktur ? (
                                <text className={style.txtError}>{errors.struktur}</text>
                            ) : null}
                        </div>
                    </div>
                    <div className={style.addModalDepo}>
                        <text className="col-md-3">
                            Cara Approve
                        </text>
                        <div className="col-md-9">
                            <Input 
                            type="select" 
                            name="select"
                            value={values.way_app}
                            onChange={handleChange("way_app")}
                            onBlur={handleBlur("way_app")}
                            >
                                <option>-Pilih-</option>
                                <option value="web">Approve web</option>
                                <option value="upload">Upload file</option>
                            </Input>
                            {errors.way_app ? (
                                <text className={style.txtError}>{errors.way_app}</text>
                            ) : null}
                        </div>
                    </div>
                    <div className={style.addModalDepo}>
                        <text className="col-md-3">
                            Status View
                        </text>
                        <div className="col-md-9">
                            <Input 
                            type="select" 
                            name="select"
                            value={values.status_view}
                            onChange={handleChange("status_view")}
                            onBlur={handleBlur("status_view")}
                            >
                                <option>-Pilih-</option>
                                <option value="visible">Visible</option>
                                <option value="hidden">Hidden</option>
                            </Input>
                            {errors.status_view ? (
                                <text className={style.txtError}>{errors.status_view}</text>
                            ) : null}
                        </div>
                    </div>
                    <hr/>
                    <div className={style.foot}>
                        <div></div>
                        <div>
                            <Button className="mr-2" onClick={handleSubmit} color="primary">Save</Button>
                            <Button className="mr-5" onClick={this.openModalEdit}>Cancel</Button>
                        </div>
                    </div>
                </ModalBody>
                )}
                </Formik>
            </Modal>
            <Modal toggle={this.openModalUpload} isOpen={this.state.modalUpload} >
                <ModalHeader>Upload Detail Cost Center</ModalHeader>
                <ModalBody className={style.modalUpload}>
                    <div className={style.titleModalUpload}>
                        <text>Upload File: </text>
                        <div className={style.uploadFileInput}>
                            <AiOutlineFileExcel size={35} />
                            <div className="ml-3">
                                <Input
                                type="file"
                                name="file"
                                accept=".xls,.xlsx"
                                onChange={this.onChangeHandler}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={style.btnUpload}>
                        <Button color="primary" disabled={this.state.fileUpload === "" ? true : false } onClick={this.uploadMaster}>Upload</Button>
                        <Button onClick={this.openModalUpload}>Cancel</Button>
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
                            <div className="errApprove mt-2">Pastikan kategori, tipe, dan jenis sama di setiap item</div>
                        </div>
                        </div>
                    ) : this.state.confirm === 'falseAddDetail' ? (
                        <div>
                            <div className={style.cekUpdate}>
                            <AiOutlineClose size={80} className={style.red} />
                            <div className={[style.sucUpdate, style.green]}>Gagal Menambahkan Detail</div>
                            <div className="errApprove mt-2">Pastikan cost center, dan qty diisi</div>
                        </div>
                        </div>
                    ) : this.state.confirm === 'falseName' ? (
                        <div>
                            <div className={style.cekUpdate}>
                            <AiOutlineClose size={80} className={style.red} />
                            <div className={[style.sucUpdate, style.green]}>Gagal</div>
                            <div className="errApprove mt-2">Nama item sudah terdaftar, silahkan update quantity di item yg sudah terdaftar</div>
                        </div>
                        </div>
                    ) : this.state.confirm === 'falseUpdate' ? (
                        <div>
                            <div className={style.cekUpdate}>
                            <AiOutlineClose size={80} className={style.red} />
                            <div className={[style.sucUpdate, style.green]}>Gagal Update Item</div>
                            <div className="errApprove mt-2">Pastikan kategori, tipe, dan jenis sama di setiap item</div>
                        </div>
                        </div>
                    ) : this.state.confirm === 'falseCost' ? (
                        <div>
                            <div className={style.cekUpdate}>
                            <AiOutlineClose size={80} className={style.red} />
                            <div className={[style.sucUpdate, style.green]}>Gagal Save</div>
                            <div className="errApprove mt-2">Cost center telah terdaftar</div>
                        </div>
                        </div>
                    ) : this.state.confirm === 'falseQty' ? (
                        <div>
                            <div className={style.cekUpdate}>
                            <AiOutlineClose size={80} className={style.red} />
                            <div className={[style.sucUpdate, style.green]}>Gagal Save</div>
                            <div className="errApprove mt-2">Pastikan quantity match</div>
                        </div>
                        </div>
                    ) : this.state.confirm === 'update' ?(
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Update</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'add' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Menambahkan Item</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'appFailed' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Submit</div>
                                <div className="errApprove mt-2">Lengkapi approval form IO, ajuan hanya bisa disubmit jika terdapat pemeriksa, dan penyetuju</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'reason' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green]}>Gagal Submit</div>
                                <div className="errApprove mt-2">Mohon isi alasan terlebih dahulu</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'upreason' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={[style.sucUpdate, style.green]}>Berhasil Update Alasan</div>
                            </div>
                        </div>
                    ) : this.state.confirm === 'dupUpload' ? (
                        <div>
                            <div className={style.cekUpdate}>
                                <AiOutlineClose size={80} className={style.red} />
                                <div className={[style.sucUpdate, style.green, style.mb4]}>Gagal Upload</div>
                                <div className={[style.sucUpdate, style.green, style.mb4]}>Terdapat Duplikasi Pada Data Berikut</div>
                                {duplikat.length > 0 ? duplikat.map(item => {
                                    return (
                                        <div className={[style.sucUpdate, style.green, style.mb3]}>{item}</div>
                                    )
                                }) : (
                                    <div></div>
                                )}
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
    tempmail: state.tempmail,
    depo: state.depo,
    user: state.user
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
    getDraftEmailHo: tempmail.getDraftEmailHo,
    sendEmail: tempmail.sendEmail,
    getDetail: pengadaan.getDetail,
    resetError: pengadaan.resetError,
    addNewNotif: newnotif.addNewNotif,
    getApproveIo: pengadaan.getApproveIo,
    updateReason: pengadaan.updateReason,
    getDepo: depo.getDepo,
    getUser: user.getUser,
    addDetailItem: pengadaan.addDetailItem,
    updateDetailItem: pengadaan.updateDetailItem,
    deleteDetailItem: pengadaan.deleteDetailItem,
    getDetailItem: pengadaan.getDetailItem,
    getRole: user.getRole,
    makeApproval: pengadaan.makeApproval,
    deleteApproval: pengadaan.deleteApproval,
    saveApproval: pengadaan.saveApproval
}

export default connect(mapStateToProps, mapDispatchToProps)(CartMutasi)
