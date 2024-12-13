/* eslint-disable jsx-a11y/no-distracting-elements */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react'
import { Container, NavbarBrand, Table, Input, Button, Col,
    Alert, Spinner, Row, Modal, ModalBody, ModalHeader, ModalFooter, Collapse,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Card, CardBody} from 'reactstrap'
import style from '../../assets/css/input.module.css'
import {FaSearch, FaUserCircle, FaBars, FaCartPlus, FaFileSignature, FaTh, FaList} from 'react-icons/fa'
import {BsCircle, BsBell, BsFillCircleFill} from 'react-icons/bs'
import { AiOutlineCheck, AiOutlineClose, AiFillCheckCircle} from 'react-icons/ai'
import {MdAssignment} from 'react-icons/md'
import {FiSend, FiTruck, FiSettings, FiUpload} from 'react-icons/fi'
import {Formik} from 'formik'
import * as Yup from 'yup'
import Pdf from "../../components/Pdf"
import {Form} from 'react-bootstrap'
import logo from '../../assets/img/logo.png'
import {connect} from 'react-redux'
import pengadaan from '../../redux/actions/pengadaan'
import dokumen from '../../redux/actions/dokumen'
import OtpInput from "react-otp-input";
import moment from 'moment'
import auth from '../../redux/actions/auth'
import {default as axios} from 'axios'
import Sidebar from "../../components/Header"
import MaterialTitlePanel from "../../components/material_title_panel"
import SidebarContent from "../../components/sidebar_content"
import placeholder from  "../../assets/img/placeholder.png"
import TablePeng from '../../components/TablePeng'
import notif from '../../redux/actions/notif'
import NavBar from '../../components/NavBar'
import renderHTML from 'react-render-html'
import ModalDokumen from '../../components/ModalDokumen'
import ExcelJS from "exceljs";
import fs from "file-saver";
import * as path from 'path';
const {REACT_APP_BACKEND_URL} = process.env

class FormIo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            docked: false,
            open: false,
            openBid: false,
            dataBid: '',
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
            dropApp: false,
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
            rinciAdmin: false,
            upload: false,
            errMsg: '',
            fileUpload: '',
            limit: 12,
            search: '',
            formDis: false,
            formTrack: false,
            openModalDoc: false,
            modalRinci: false,
            dataRinci: {},
            detailDis: [],
            nama: "Pilih Approval",
            openReject: false,
            openApprove: false,
            preview: false,
            openPdf: false,
            idDoc: 0,
            openApproveIo: false,
            openRejectDis: false,
            fileName: {},
            dataApp: {},
            img: '',
            limImage: 20000,
            submitPre: false,
            date: '',
            view: 'card',
            newDis: [],
            app: [],
            find: null,
            openModalIo: false,
            openModalTtd: false,
            profit: "",
            io: "",
            data: [],
            index: 0,
            rinciIo: {},
            total: 0,
            listMut: [],
            newIo: [],
            filter: 'available',
            isAppall: false,
            stat: '',
            listStat: [],
            url: '',
            valdoc: {},
            detailTrack: [],
            collap: false, 
            tipeCol: '',
            time: '',
            typeReject: '',
            menuRev: '',
            noDoc: '',
            noTrans: ''
        }
    }

    async componentDidMount () {
        const dataCek = localStorage.getItem('printData')
        const detailForm = this.props.detailForm
        const tipe = this.props.tipe
        const dataValid = dataCek
        if (dataValid || (dataCek !== undefined && dataCek !== null)) {
            const token = localStorage.getItem('token')
            const level = localStorage.getItem('level')
            await this.props.getDetail(token, dataValid)
            await this.props.getApproveIo(token, dataValid)
            const data = this.props.pengadaan.detailIo
            if (data[0].status_form === '8') {
                await this.props.getTempAsset(token, data[0].no_pengadaan)
            }
            let num = 0
            for (let i = 0; i < data.length; i++) {
                // if (data[i].isAsset !== 'true' && level !== '2' ) {
                //     const temp = 0
                //     num += temp
                // } else {
                const temp = parseInt(data[i].price) * parseInt(data[i].qty)
                num += temp
                // }
            }
            this.setState({total: num, value: data[0].no_io})
            // if (tipe !== undefined && tipe === 'access') {
            //     console.log()
            // } else {
            this.downloadForm()
            // }
        }
    }

    toDataURL = (url) => {
        const promise = new Promise((resolve, reject) => {
          var xhr = new XMLHttpRequest();
          xhr.onload = function () {
            var reader = new FileReader();
            reader.readAsDataURL(xhr.response);
            reader.onloadend = function () {
              resolve({ base64Url: reader.result });
            };
          };
          xhr.open("GET", url);
          xhr.responseType = "blob";
          xhr.send();
        });
      
        return promise;
    }

    downloadForm = async () => {
        const {dataPeng, isLoading, isError, dataApp, dataDoc, detailIo, dataDocCart} = this.props.pengadaan
        const {total} = this.state
        
        const alpha = Array.from(Array(26)).map((e, i) => i + 65)
        const alphabet = alpha.map((x) => String.fromCharCode(x))
        
        const colNum = detailIo.length + 14
        const lengthAll = []
        const lengthDesk = []
        const lengthIo = []
        const lengthCost = []
        const lengthProfit = []

        for (let i = 1; i <= 20; i++) {
            if (i <= 10) {
                lengthIo.push(i)
                lengthCost.push(i)
                lengthProfit.push(i)
                lengthDesk.push(i)
                lengthAll.push(i)
            } else if (i <= 11) {
                lengthIo.push(i)
                lengthDesk.push(i)
                lengthAll.push(i)
            } else if (i <= 12) {
                lengthDesk.push(i)
                lengthAll.push(i)
            } else {
                lengthAll.push(i)
            }
            
        }

        const workbook = new ExcelJS.Workbook();
        const ws = workbook.addWorksheet('form internal order', {
            pageSetup: { orientation:'portrait', paperSize: 8 }
        })

        const borderStyles = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
        }

        const leftStyle = {
            horizontal:'left'
        }

        const rightStyle = {
            horizontal:'right'
        }

        const alignStyle = {
            horizontal:'center',
            wrapText: true,
            vertical: 'middle'
        }

        const fontStyle = { size: 10 }

        const titleStyle = {
            bold: true,
            size: 15,
            underline: true
        }

        const boldStyle = {
            bold: true
        }

        const result = await this.toDataURL(`${REACT_APP_BACKEND_URL}/masters/logo.png`);

        const imageId2 = workbook.addImage({
          base64: result.base64Url,
          extension: 'png',
        });

        ws.addImage(imageId2, {
          tl: { col: 1, row: 1 },
          ext: { width: 60, height: 80 },
        });

        ws.getCell(`${alphabet[lengthAll.length]}1`).value = ''

        ws.mergeCells(`D4`, `L4`)
        ws.getCell(`D4`).value = 'FORM INTERNAL ORDER ASSET'
        ws.getCell(`D4`).alignment = { 
            ...alignStyle
        }
        ws.getCell(`D4`).font = { 
            ...titleStyle
        }

        ws.getCell(`B8`).value = 'Io Type:'
        ws.getCell(`B8`).alignment = { 
            ...leftStyle
        }

        ws.getCell(`B10`).value = 'V     CB-20 IO Capex'
        ws.getCell(`B10`).alignment = { 
            ...leftStyle
        }

        // Nomor IO
        ws.getCell(`B12`).value = 'Nomor IO'
        ws.getCell(`B12`).alignment = { 
            ...leftStyle
        }

        ws.getCell(`C12`).value = ':'
        ws.getCell(`C12`).alignment = { 
            ...rightStyle
        }

        for (let i = 0; i < (detailIo.length > 0 && detailIo[0].no_io !== null ? detailIo[0].no_io.split('').length : lengthIo.length); i++) {
            ws.getCell(`${alphabet[i + 3]}12`).value = detailIo.length > 0 && detailIo[0].no_io !== null ? detailIo[0].no_io.split('')[i] : ''
            ws.getCell(`${alphabet[i + 3]}12`).alignment = { 
                ...alignStyle
            }
            ws.getCell(`${alphabet[i + 3]}12`).border = { 
                ...borderStyles
            }
        }

        // Deskripsi
        ws.getCell(`B14`).value = 'Deskripsi'
        ws.getCell(`B14`).alignment = { 
            ...leftStyle
        }

        ws.getCell(`C14`).value = ':'
        ws.getCell(`C14`).alignment = { 
            ...rightStyle
        }
        
        // Table
        ws.mergeCells(`D14`, `E14`)
        ws.getCell(`D14`).value = 'Qty'
        ws.getCell(`D14`).alignment = { 
            ...alignStyle
        }
        ws.getCell(`D14`).border = { 
            ...borderStyles
        }
        ws.getCell(`D14`).font = { 
            ...boldStyle
        }

        ws.mergeCells(`F14`, `I14`)
        ws.getCell(`F14`).value = 'Description'
        ws.getCell(`F14`).alignment = { 
            ...alignStyle
        }
        ws.getCell(`F14`).border = { 
            ...borderStyles
        }
        ws.getCell(`F14`).font = { 
            ...boldStyle
        }
        
        ws.mergeCells(`J14`, `L14`)
        ws.getCell(`J14`).value = 'Price/unit'
        ws.getCell(`J14`).alignment = { 
            ...alignStyle
        }
        ws.getCell(`J14`).border = { 
            ...borderStyles
        }
        ws.getCell(`J14`).font = { 
            ...boldStyle
        }

        ws.mergeCells(`M14`, `O14`)
        ws.getCell(`M14`).value = 'Total Amount'
        ws.getCell(`M14`).alignment = { 
            ...alignStyle
        }
        ws.getCell(`M14`).border = { 
            ...borderStyles
        }
        ws.getCell(`M14`).font = { 
            ...boldStyle
        }

        for (let i = 0; i < detailIo.length; i++) {
            ws.mergeCells(`D${i + 15}`, `E${i + 15}`)
            ws.getCell(`D${i + 15}`).value = detailIo[i].qty
            ws.getCell(`D${i + 15}`).alignment = { 
                ...alignStyle
            }
            ws.getCell(`D${i + 15}`).border = { 
                ...borderStyles
            }

            ws.mergeCells(`F${i + 15}`, `I${i + 15}`)
            ws.getCell(`F${i + 15}`).value = detailIo[i].nama
            ws.getCell(`F${i + 15}`).alignment = { 
                ...alignStyle
            }
            ws.getCell(`F${i + 15}`).border = { 
                ...borderStyles
            }
            
            ws.mergeCells(`J${i + 15}`, `L${i + 15}`)
            ws.getCell(`J${i + 15}`).value = `Rp.${detailIo[i].price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
            ws.getCell(`J${i + 15}`).alignment = { 
                ...alignStyle
            }
            ws.getCell(`J${i + 15}`).border = { 
                ...borderStyles
            }

            ws.mergeCells(`M${i + 15}`, `O${i + 15}`)
            ws.getCell(`M${i + 15}`).value = `Rp.${((parseInt(detailIo[i].price) * parseInt(detailIo[i].qty)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."))}`
            ws.getCell(`M${i + 15}`).alignment = { 
                ...alignStyle
            }
            ws.getCell(`M${i + 15}`).border = { 
                ...borderStyles
            }
        }

        // Cost Center
        ws.getCell(`B${colNum + 2}`).value = 'Cost Centre'
        ws.getCell(`B${colNum + 2}`).alignment = { 
            ...leftStyle
        }

        ws.getCell(`C${colNum + 2}`).value = ':'
        ws.getCell(`C${colNum + 2}`).alignment = { 
            ...rightStyle
        }

        const cekCost = detailIo.length === 0 || detailIo[0].depo === undefined || detailIo[0].depo === null ? 'length' : 'cost'
        for (let i = 0; i < (cekCost === 'length' ? lengthCost.length : detailIo[0].depo.cost_center.split('').length); i++) {
            ws.getCell(`${alphabet[i + 3]}${colNum + 2}`).value = cekCost === 'length' ? '' : detailIo[0].depo.cost_center.split('')[i]
            ws.getCell(`${alphabet[i + 3]}${colNum + 2}`).alignment = { 
                ...alignStyle
            }
            ws.getCell(`${alphabet[i + 3]}${colNum + 2}`).border = { 
                ...borderStyles
            }
        }

        // Profit Center
        ws.getCell(`B${colNum + 4}`).value = 'Profit Centre'
        ws.getCell(`B${colNum + 4}`).alignment = { 
            ...leftStyle
        }

        ws.getCell(`C${colNum + 4}`).value = ':'
        ws.getCell(`C${colNum + 4}`).alignment = { 
            ...rightStyle
        }

        const cekProfit = detailIo.length === 0 || detailIo[0].depo === undefined || detailIo[0].depo === null ? 'length' : 'cost'
        for (let i = 0; i < (cekProfit === 'length' ? lengthProfit.length : detailIo[0].depo.profit_center.split('').length); i++) {
            ws.getCell(`${alphabet[i + 3]}${colNum + 4}`).value = cekProfit === 'length' ? '' : detailIo[0].depo.profit_center.split('')[i]
            ws.getCell(`${alphabet[i + 3]}${colNum + 4}`).alignment = { 
                ...alignStyle
            }
            ws.getCell(`${alphabet[i + 3]}${colNum + 4}`).border = { 
                ...borderStyles
            }
        }

        // Kategori Budget
        ws.getCell(`B${colNum + 6}`).value = 'Kategori Budget'
        ws.getCell(`B${colNum + 6}`).alignment = { 
            ...leftStyle
        }

        ws.getCell(`C${colNum + 6}`).value = ':'
        ws.getCell(`C${colNum + 6}`).alignment = { 
            ...rightStyle
        }

        ws.getCell(`D${colNum + 6}`).value = detailIo[0] === undefined ? '' : detailIo[0].kategori === 'budget' ? 'V' : ''
        ws.getCell(`D${colNum + 6}`).alignment = { 
            ...alignStyle
        }
        ws.getCell(`D${colNum + 6}`).border = { 
            ...borderStyles
        }

        ws.getCell(`E${colNum + 6}`).value = 'Budget'
        ws.getCell(`E${colNum + 6}`).alignment = { 
            ...leftStyle
        }

        ws.getCell(`H${colNum + 6}`).value = detailIo[0] === undefined ? '' : detailIo[0].kategori === 'non-budget' ? 'V' : ''
        ws.getCell(`H${colNum + 6}`).alignment = { 
            ...alignStyle
        }
        ws.getCell(`H${colNum + 6}`).border = { 
            ...borderStyles
        }

        ws.getCell(`I${colNum + 6}`).value = 'Non Budgeted'
        ws.getCell(`I${colNum + 6}`).alignment = { 
            ...leftStyle
        }

        ws.getCell(`L${colNum + 6}`).value = detailIo[0] === undefined ? '' : detailIo[0].kategori === 'return' ? 'V' : ''
        ws.getCell(`L${colNum + 6}`).alignment = { 
            ...alignStyle
        }
        ws.getCell(`L${colNum + 6}`).border = { 
            ...borderStyles
        }

        ws.getCell(`M${colNum + 6}`).value = 'Return'
        ws.getCell(`M${colNum + 6}`).alignment = { 
            ...leftStyle
        }

        // Amount
        ws.getCell(`B${colNum + 8}`).value = 'Amount'
        ws.getCell(`B${colNum + 8}`).alignment = { 
            ...leftStyle
        }

        ws.getCell(`C${colNum + 8}`).value = ':'
        ws.getCell(`C${colNum + 8}`).alignment = { 
            ...rightStyle
        }

        ws.getCell(`D${colNum + 8}`).value = `Rp.${total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
        ws.getCell(`D${colNum + 8}`).alignment = { 
            ...leftStyle
        }

        //Alasan
        ws.getCell(`B${colNum + 10}`).value = 'Alasan'
        ws.getCell(`B${colNum + 10}`).alignment = { 
            ...leftStyle
        }

        ws.getCell(`C${colNum + 10}`).value = ':'
        ws.getCell(`C${colNum + 10}`).alignment = { 
            ...rightStyle
        }

        ws.getCell(`D${colNum + 10}`).value = `${detailIo[0] === undefined || detailIo[0].alasan === null ? '-' : detailIo[0].alasan}`
        ws.getCell(`D${colNum + 10}`).alignment = { 
            ...leftStyle
        }

        const dateRow = detailIo.length + 27
        ws.getCell(`B${dateRow}`).value = `${detailIo[0].area}, ${moment(detailIo.tglIo).format('DD MMMM YYYY')}`
        ws.getCell(`B${dateRow}`).alignment = { 
            ...leftStyle
        }

        const sumRow = detailIo.length + 29
        const headRow = 1 + sumRow
        const mainRow = 3 + sumRow
        const footRow = 5 + sumRow

        const cekApp = dataApp.pembuat.length + dataApp.pemeriksa.length + dataApp.penyetuju.length
        const compCol = cekApp > 5 ? 'B' : 'C'
        const distCol = cekApp > 5 ? 3 : 4
        const botRow = 5 + sumRow
        console.log(sumRow)

        // Approval Dibuat
        

        ws.mergeCells(`B${sumRow}`, `${compCol}${sumRow}`)
        ws.getCell(`B${sumRow}`).value = 'Dibuat oleh,'
        ws.getCell(`B${sumRow}`).alignment = { horizontal:'center'}
        ws.getCell(`B${sumRow}`).border = { 
            ...borderStyles
        }

        ws.mergeCells(`B${headRow}`, `${compCol}${botRow}`)

        dataApp.pembuat !== undefined && dataApp.pembuat.map(item => {
                const name = item.nama === undefined || item.nama === null ? null 
                :item.nama.length <= 15 ?item.nama.split(" ").map((word) => { 
                    return word[0] === undefined ? '' : word[0].toUpperCase() + word.substring(1)
                }).join(" ")
                :item.nama.slice(0, 13).split(" ").map((word) => { 
                    return word[0] === undefined ? '' : word[0].toUpperCase() + word.substring(1)
                }).join(" ") + '.'

                ws.getCell(`B${headRow}`).value = name === null 
                ? `\n - \n\n\n ${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}` 
                : item.status === 0 
                ? `Reject (${moment(item.updatedAt).format('DD/MM/YYYY')}) \n\n ${name} \n ${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}` 
                : `Approve (${moment(item.updatedAt).format('DD/MM/YYYY')}) \n\n ${name} \n ${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}`
        })

        ws.getCell(`B${headRow}`).alignment = { 
            ...alignStyle
        }
        ws.getCell(`B${headRow}`).border = { 
            ...borderStyles
        }

        // Approval Diperiksa
        const cekRow11 = alphabet[alphabet.indexOf(alphabet.find(item => item === compCol.toUpperCase())) + 1]
        const cekRow12 = alphabet[alphabet.indexOf(alphabet.find(item => item === cekRow11.toUpperCase())) + (distCol * (dataApp.pemeriksa.length === 0 ? 1 : dataApp.pemeriksa.length)) - 1]
        ws.mergeCells(`${cekRow11}${sumRow}`, `${cekRow12}${sumRow}`)
        ws.getCell(`${cekRow11}${sumRow}`).value = 'Diperiksa oleh,'
        ws.getCell(`${cekRow11}${sumRow}`).alignment = { horizontal:'center'}
        ws.getCell(`${cekRow11}${sumRow}`).border = { 
            ...borderStyles
        }

        dataApp.pemeriksa !== undefined && dataApp.pemeriksa.map((item, index) => {
            const name = item.nama === undefined || item.nama === null ? null 
                :item.nama.length <= 15 ?item.nama.split(" ").map((word) => { 
                    return word[0] === undefined ? '' : word[0].toUpperCase() + word.substring(1)
                }).join(" ")
                :item.nama.slice(0, 13).split(" ").map((word) => { 
                    return word[0] === undefined ? '' : word[0].toUpperCase() + word.substring(1)
                }).join(" ") + '.'
            if (dataApp.pemeriksa.length > 1) {
                const startRow = alphabet[alphabet.indexOf(alphabet.find(item => item === cekRow11.toUpperCase())) + (distCol * index)]
                const endRow = alphabet[alphabet.indexOf(alphabet.find(item => item === cekRow11.toUpperCase())) + ((distCol * index) + (distCol - 1))]
                
                // console.log(alphabet.indexOf(alphabet.find(item => item === str.toUpperCase())))
                // console.log(`${startRow}${headRow}`, `${endRow}${botRow} Quenn`)

                ws.mergeCells(`${startRow}${headRow}`, `${endRow}${botRow}`)
                ws.getCell(`${startRow}${headRow}`).value = name === null 
                ? `\n - \n\n\n${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}` 
                : item.status === 0 
                ? `Reject (${moment(item.updatedAt).format('DD/MM/YYYY')}) \n\n  ${name} \n ${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}` 
                : `Approve (${moment(item.updatedAt).format('DD/MM/YYYY')}) \n\n ${name} \n ${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}`

                ws.getCell(`${startRow}${headRow}`).alignment = { 
                    ...alignStyle,
                }
                ws.getCell(`${startRow}${headRow}`).border = { 
                    ...borderStyles
                }
                // ws.getCell(`${startRow}${headRow}`).font = { 
                //     ...fontStyle,
                // }
            } else {
                ws.mergeCells(`D${headRow}`, `I${botRow}`)
                ws.getCell(`D${headRow}`).value = name === null 
                ? `\n - \n\n\n${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}` 
                : item.status === 0 
                ? `Reject (${moment(item.updatedAt).format('DD/MM/YYYY')}) \n\n ${name} \n ${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}` 
                : `Approve (${moment(item.updatedAt).format('DD/MM/YYYY')}) \n\n ${name} \n ${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}`
                
                ws.getCell(`D${headRow}`).alignment = { 
                    ...alignStyle
                }
                ws.getCell(`D${headRow}`).border = { 
                    ...borderStyles
                }
            }
        })


        // Approval Disetujui
        const cekRow21 = alphabet[alphabet.indexOf(alphabet.find(item => item === cekRow12.toUpperCase())) + 1]
        const cekLastRow = parseInt(alphabet.indexOf(alphabet.find(item => item === cekRow12.toUpperCase())) + (distCol * (dataApp.penyetuju.length === 0 ? 1 : dataApp.penyetuju.length)))
        const cekRow22 = cekLastRow >= alphabet.length ? `A${alphabet[cekLastRow - alphabet.length]}` : alphabet[cekLastRow]
        ws.mergeCells(`${cekRow21}${sumRow}`, `${cekRow22}${sumRow}`)
        ws.getCell(`${cekRow21}${sumRow}`).value = 'Disetujui oleh,'
        ws.getCell(`${cekRow21}${sumRow}`).alignment = { horizontal:'center'}
        ws.getCell(`${cekRow21}${sumRow}`).border= { 
            ...borderStyles
        }

        dataApp.penyetuju !== undefined && dataApp.penyetuju.map((item, index) => {
            const name = item.nama === undefined || item.nama === null ? null 
                :item.nama.length <= 15 ?item.nama.split(" ").map((word) => { 
                    return word[0] === undefined ? '' : word[0].toUpperCase() + word.substring(1)
                }).join(" ")
                :item.nama.slice(0, 13).split(" ").map((word) => { 
                    return word[0] === undefined ? '' : word[0].toUpperCase() + word.substring(1)
                }).join(" ") + '.'
            if (dataApp.penyetuju.length > 1) {
                const cekStart = parseInt(alphabet.indexOf(alphabet.find(item => item === cekRow21.toUpperCase())) + (distCol * index))
                const startRow = cekStart >= alphabet.length - 1 ? `A${alphabet[cekStart - alphabet.length]}` : alphabet[cekStart]
                const cekEnd = parseInt(alphabet.indexOf(alphabet.find(item => item === cekRow21.toUpperCase())) + ((distCol * index) + (distCol - 1)))
                const endRow = cekEnd >= alphabet.length - 1 ? `A${alphabet[cekEnd - alphabet.length]}` : alphabet[cekEnd]
                console.log(cekStart)
                console.log(cekEnd)
                console.log((distCol * index) + (distCol - 1))
                
                // console.log(alphabet.indexOf(alphabet.find(item => item === str2.toUpperCase())))
                // console.log(`${startRow}${headRow}`, `${endRow}${botRow} King`)

                ws.mergeCells(`${startRow}${headRow}`, `${endRow}${botRow}`)
                ws.getCell(`${startRow}${headRow}`).value = name === null 
                ? `\n - \n\n\n${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}` 
                : item.status === 0
                ? `Reject (${moment(item.updatedAt).format('DD/MM/YYYY')}) \n\n ${name} \n\ ${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}` 
                : `Approve (${moment(item.updatedAt).format('DD/MM/YYYY')}) \n\n ${name} \n\ ${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}`

                ws.getCell(`${startRow}${headRow}`).alignment = { 
                    ...alignStyle
                }
                ws.getCell(`${startRow}${headRow}`).border= { 
                    ...borderStyles
                }
            } else {
                ws.mergeCells(`${cekRow21}${headRow}`, `${cekRow22}${botRow}`)
                ws.getCell(`${cekRow21}${headRow}`).value = name === null 
                ? `\n\n - \n\n\n${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}` 
                : item.status === 0 
                ? `Reject (${moment(item.updatedAt).format('DD/MM/YYYY')}) \n\n ${name} \n ${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}` 
                : `Approve (${moment(item.updatedAt).format('DD/MM/YYYY')}) \n\n ${name} \n ${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}`
                
                ws.getCell(`${cekRow21}${headRow}`).alignment = { 
                    ...alignStyle
                }
                ws.getCell(`${cekRow21}${headRow}`).border = { 
                    ...borderStyles
                }
            }
        })

        // width kolom B
        ws.columns[1].width = 16
        
        for (let i = 0; i < (cekLastRow < 16 ? 16 : cekLastRow - 1); i++) {
            console.log(i)
            ws.columns[2+i].width = 5.5
        }

        for (let i = 0; i < detailIo.length; i++) {
            ws.getRow(i + 15).height = 30
        }

        await ws.protect('As5etPm4')

        if (detailIo[0].status_form === '8') {
            const { dataTemp } = this.props.pengadaan
            const dataDownload = dataTemp
            
            const ws2 = workbook.addWorksheet('List No.Aset', {
                pageSetup: { orientation:'portrait', paperSize: 8 }
            })
            ws2.columns = [
                {header: 'NO', key: 'c2'},
                {header: 'No Pengadaan', key: 'c3'},
                {header: 'Description', key: 'c4'},
                {header: 'Price/unit', key: 'c5'},
                {header: 'Total Amount', key: 'c6'},
                {header: 'No Asset', key: 'c7'},
                {header: 'ID Asset', key: 'c8'}
            ]
    
            dataDownload.map((item, index) => { return ( ws2.addRow(
                {
                    c2: index + 1,
                    c3: item.no_pengadaan,
                    c4: item.nama,
                    c5: `Rp ${item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
                    c6: `Rp ${(parseInt(item.price) * parseInt(item.qty)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
                    c7: item.no_asset,
                    c8: item.id
                }
            )
            ) })
    
            ws2.eachRow({ includeEmpty: true }, function(row, rowNumber) {
                row.eachCell({ includeEmpty: true }, function(cell, colNumber) {
                  cell.border = borderStyles;
                })
              })
    
              ws2.columns.forEach(column => {
                const lengths = column.values.map(v => v.toString().length)
                const maxLength = Math.max(...lengths.filter(v => typeof v === 'number'))
                column.width = maxLength + 5
            })
            workbook.xlsx.writeBuffer().then(function(buffer) {
                fs.saveAs(
                  new Blob([buffer], { type: "application/octet-stream" }),
                  `Form Internal Order Asset ${detailIo[0].no_pengadaan} ${moment().format('DD MMMM YYYY')}.xlsx`
                )
            })
        } else {
            workbook.xlsx.writeBuffer().then(function(buffer) {
                fs.saveAs(
                  new Blob([buffer], { type: "application/octet-stream" }),
                  `Form Internal Order Asset ${detailIo[0].no_pengadaan} ${moment().format('DD MMMM YYYY')}.xlsx`
                )
            })
        }
    }

  render() {
    const {alert, upload, errMsg, rinciIo, total, listMut, newIo, listStat, fileName, url, detailTrack} = this.state
    const {dataAsset, alertM, alertMsg, alertUpload, page} = this.props.asset
    const pages = this.props.disposal.page 
    const {dataPeng, isLoading, isError, dataApp, dataDoc, detailIo, dataDocCart} = this.props.pengadaan
    const level = localStorage.getItem('level')
    const names = localStorage.getItem('name')
    const dataNotif = this.props.notif.data
    const role = localStorage.getItem('role')

    return (
        <>
        <div className="backWhite mb-5">
            <Container className='mb-4'>
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
                        checked
                        type="checkbox"
                        label="CB-20 IO Capex"
                    />
                </div>
                <Row className="rowModal">
                    <Col md={2} lg={2} sm={2} xl={2}>
                        Nomor IO
                    </Col>
                    <Col md={10} lg={10} sm={10} xl={10} className="colModal">
                    <text className="">:</text>
                    <OtpInput
                        value={this.state.value}
                        onChange={this.onChange}
                        numInputs={11}
                        inputStyle={style.otp}
                        containerStyle={style.containerOtp}
                        isDisabled
                    />
                    </Col>
                </Row>
                
                <Row className="mt-4">
                    <Col md={2} lg={2} sm={2} xl={2}>
                        Deskripsi
                    </Col>
                    <Col md={10} lg={10} sm={10} xl={10} className="colModalTab">
                        <text className="">:</text>
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
                                {detailIo !== undefined && detailIo.length > 0 && detailIo.map(item => {
                                    return (
                                        item.isAsset === 'false' && level !== '2' ? (
                                            null
                                        ) : (
                                        <tr>
                                            <td>{item.qty}</td>
                                            <td>{item.nama}</td>
                                            <td>Rp {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                            <td>Rp {((parseInt(item.price) * parseInt(item.qty)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."))}</td>
                                        </tr>
                                        )
                                    )
                                })}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
                <Row className="rowModal mt-4">
                    <Col md={2} lg={2} sm={2} xl={2}>
                        Cost Center
                    </Col>
                    <Col md={10} lg={10} sm={10} xl={10} className="colModal">
                    <text className="">:</text>
                    <OtpInput
                        value={detailIo[0] === undefined ? '' : detailIo[0].depo === undefined ? '' : detailIo[0].depo === null ? '' : detailIo[0].depo.cost_center}
                        isDisabled
                        numInputs={10}
                        inputStyle={style.otp}
                        containerStyle={style.containerOtp}
                    />
                    </Col>
                </Row>
                <Row className="rowModal mt-2">
                    <Col md={2} lg={2} sm={2} xl={2}>
                        Profit Center
                    </Col>
                    <Col md={10} lg={10} sm={10} xl={10} className="colModal">
                    <text className="">:</text>
                    <OtpInput
                        value={detailIo[0] === undefined ? '' : detailIo[0].depo === undefined ? '' : detailIo[0].depo === null ? '' : detailIo[0].depo.profit_center}
                        isDisabled
                        numInputs={10}
                        inputStyle={style.otp}
                        containerStyle={style.containerOtp}
                    />
                    </Col>
                </Row>
                <Row className="rowModal mt-4">
                    <Col md={2} lg={2} sm={2} xl={2}>
                        Kategori
                    </Col>
                    <Col md={10} lg={10} sm={10} xl={10} className="colModal">
                    <text className="">:</text>
                        <Col md={4} lg={4}>
                            <Form.Check 
                                type="checkbox"
                                label="Budget"
                                checked={detailIo[0] === undefined ? '' : detailIo[0].kategori === 'budget' ? true : false}
                            />
                        </Col>
                        <Col md={4} lg={4}>
                            <Form.Check 
                                type="checkbox"
                                label="Non Budgeted"
                                checked={detailIo[0] === undefined ? '' : detailIo[0].kategori === 'non-budget' ? true : false}
                            />
                        </Col>
                        <Col md={4} lg={4}>
                            <Form.Check 
                                type="checkbox"
                                label="Return"
                                checked={detailIo[0] === undefined ? '' : detailIo[0].kategori === 'return' ? true : false}
                            />
                        </Col>
                    </Col>
                </Row>
                <Row className="rowModal mt-4">
                    <Col md={2} lg={2} sm={2} xl={2}>
                        Amount
                    </Col>
                    <Col md={10} lg={10} sm={10} xl={10} className="colModal">
                    <text className="">:</text>
                    <text>Rp {total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</text>
                    </Col>
                </Row>
                <Row className="rowModal mt-4">
                    <Col md={2} lg={2} sm={2} xl={2}>
                        Alasan
                    </Col>
                    <Col md={10} lg={10} sm={10} xl={10} className="colModal">
                    <text className="">:</text>
                    <text>{detailIo[0] === undefined || detailIo[0].alasan === null ? '-' : detailIo[0].alasan }</text>
                    </Col>
                </Row>
            </Container>
            <Container>
                <Table borderless responsive className="tabPreview">
                    <thead>
                        <tr>
                            <th className="buatPre">Dibuat oleh,</th>
                            <th className="buatPre">Diperiksa oleh,</th>
                            <th className="buatPre">Disetujui oleh,</th>
                        </tr>
                    </thead>
                    <tbody className="tbodyPre">
                        <tr>
                            <td className="restTable">
                                <Table bordered responsive className="divPre">
                                    <thead>
                                        <tr>
                                            {dataApp.pembuat !== undefined && dataApp.pembuat.map(item => {
                                                return (
                                                    <th className="headPre">
                                                        <div className="mb-2">{item.nama === null ? "-" : item.status === 0 ? 'Reject' : moment(item.updatedAt).format('LL')}</div>
                                                        <div>{item.nama === null ? "-" : item.nama}</div>
                                                    </th>
                                                )
                                            })}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                        {dataApp.pembuat !== undefined && dataApp.pembuat.map(item => {
                                            return (
                                                <td className="footPre">{item.jabatan === null ? "-" : item.jabatan === 'area' ? 'AOS' : item.jabatan}</td>
                                            )
                                        })}
                                        </tr>
                                    </tbody>
                                </Table>
                            </td>
                            <td className="restTable">
                                <Table bordered responsive className="divPre">
                                    <thead>
                                        <tr>
                                            {dataApp.pemeriksa !== undefined && dataApp.pemeriksa.map(item => {
                                                return (
                                                    <th className="headPre">
                                                        <div className="mb-2">{item.nama === null ? "-" : item.status === 0 ? 'Reject' : moment(item.updatedAt).format('LL')}</div>
                                                        <div>{item.nama === null ? "-" : item.nama}</div>
                                                    </th>
                                                )
                                            })}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            {dataApp.pemeriksa !== undefined && dataApp.pemeriksa.map(item => {
                                                return (
                                                    <td className="footPre">{item.jabatan === null ? "-" : item.jabatan}</td>
                                                )
                                            })}
                                        </tr>
                                    </tbody>
                                </Table>
                            </td>
                            <td className="restTable">
                                <Table bordered responsive className="divPre">
                                    <thead>
                                        <tr>
                                            {dataApp.penyetuju !== undefined && dataApp.penyetuju.map(item => {
                                                return (
                                                    <th className="headPre">
                                                        <div className="mb-2">{item.nama === null ? "-" : item.status === 0 ? 'Reject' : moment(item.updatedAt).format('LL')}</div>
                                                        <div>{item.nama === null ? "-" : item.nama}</div>
                                                    </th>
                                                )
                                            })}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            {dataApp.penyetuju !== undefined && dataApp.penyetuju.map(item => {
                                                return (
                                                    <td className="footPre">{item.jabatan === null ? "-" : item.jabatan}</td>
                                                )
                                            })}
                                        </tr>
                                    </tbody>
                                </Table>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Container>
        </div>
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
        </>
    )
  }
}

const mapStateToProps = state => ({
    asset: state.asset,
    disposal: state.disposal,
    approve: state.approve,
    pengadaan: state.pengadaan,
    setuju: state.setuju,
    notif: state.notif,
    auth: state.auth,
    dokumen: state.dokumen
})

const mapDispatchToProps = {
    logout: auth.logout,
    getNotif: notif.getNotif,
    resetAuth: auth.resetError,
    getPengadaan: pengadaan.getPengadaan,
    getApproveIo: pengadaan.getApproveIo,
    getDocumentIo: pengadaan.getDocumentIo,
    getDokumen: dokumen.getDokumen,
    uploadDocument: pengadaan.uploadDocument,
    approveDocument: pengadaan.approveDocument,
    rejectDocument: pengadaan.rejectDocument,
    resetError: pengadaan.resetError,
    showDokumen: pengadaan.showDokumen,
    getDetail: pengadaan.getDetail,
    updateDataIo: pengadaan.updateDataIo,
    submitIsAsset: pengadaan.submitIsAsset,
    updateNoIo: pengadaan.updateNoIo,
    submitBudget: pengadaan.submitBudget,
    approveIo: pengadaan.approveIo,
    rejectIo: pengadaan.rejectIo,
    resetApp: pengadaan.resetApp,
    getDocCart: pengadaan.getDocCart,
    approveAll: pengadaan.approveAll,
    updateRecent: pengadaan.updateRecent,
    testApiPods: pengadaan.testApiPods,
    submitNotAsset: pengadaan.submitNotAsset,
    getTempAsset: pengadaan.getTempAsset,
    podsSend: pengadaan.podsSend
}

export default connect(mapStateToProps, mapDispatchToProps)(FormIo)
