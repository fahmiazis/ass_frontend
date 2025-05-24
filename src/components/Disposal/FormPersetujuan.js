import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    NavbarBrand, Row, Col, Button, Input, Modal, ModalBody, ModalHeader, Table,
    Container, Alert, ModalFooter, Spinner, Card, CardBody, Collapse
} from 'reactstrap'
import ExcelJS from "exceljs";
import fs from "file-saver";
import moment from 'moment'
import disposal from '../../redux/actions/disposal'
import setuju from '../../redux/actions/setuju'

const { REACT_APP_BACKEND_URL } = process.env

class FormPersetujuan extends Component {

    state = {

    }

    componentDidMount() {
        // this.downloadForm()
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

    prosesDownload = async () => {
        const token = localStorage.getItem('token')
        const { detailDis } = this.props.disposal
        await this.props.getApproveSetDisposal(token, detailDis[0].no_persetujuan)
        await this.props.getNewDetailDisposal(token, detailDis[0].no_persetujuan, 'persetujuan')
        this.downloadForm()
    }

    downloadForm = async (val) => {
        const { detailNew } = this.props.disposal
        const { disApp } = this.props.setuju

        const alpha = Array.from(Array(26)).map((e, i) => i + 65)
        const alphabet = alpha.map((x) => String.fromCharCode(x))

        const colNum = detailNew.length + 14
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
        const ws = workbook.addWorksheet('form disposal aset', {
            pageSetup: { orientation: 'landscape', paperSize: 9 }
        })

        ws.pageSetup.margins = {
            left: 0.2, right: 0,
            top: 0.1, bottom: 0.1,
            header: 0.1, footer: 0.1
        };

        const borderStyles = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }

        const leftStyle = {
            horizontal: 'left'
        }

        const midStyle = {
            vertical: 'middle'
        }

        const topStyle = {
            vertical: 'top'
        }

        const rightStyle = {
            horizontal: 'right'
        }

        const wrapStyle = {
            wrapText: true
        }

        const alignStyle = {
            horizontal: 'center',
            wrapText: true,
            vertical: 'middle'
        }

        const fontStyle = { size: 8 }
        const fontTb = { size: 8 }

        const compStyle = { size: 11 }

        const subtitleStyle = { size: 9 }

        const fontTtd = { size: 9 }

        const titleStyle = {
            bold: true,
            size: 13,
            underline: true
        }

        const boldStyle = {
            bold: true
        }

        const underStyle = {
            underline: true
        }

        const colorStyle = {
            type: 'pattern',
            pattern: 'darkTrellis',
            fgColor: { argb: 'C0BCBC' },
            bgColor: { argb: 'C0BCBC' }
        }

        // const result = await this.toDataURL(`${REACT_APP_BACKEND_URL}/masters/logo.png`);

        // const imageId2 = workbook.addImage({
        //     base64: result.base64Url,
        //     extension: 'png',
        // });

        // ws.addImage(imageId2, {
        //     tl: { col: 0.55, row: 1.65 },
        //     ext: { width: 40, height: 60 },
        // })

        //border detail form
        const borderWidthIm = 'thin'

        const borderStyleIm = {
            style: borderWidthIm
        };

        ws.getCell(`A1`).value = 'PT. Pinus Merah Abadi'
        ws.getCell(`A1`).alignment = {
            ...leftStyle
        }
        ws.getCell(`A1`).font = {
            ...compStyle
        }

        ws.mergeCells(`M2`, `X2`)
        ws.getCell(`M2`).value = 'PERSETUJUAN DISPOSAL ASET'
        ws.getCell(`M2`).alignment = {
            ...alignStyle
        }
        ws.getCell(`M2`).font = {
            ...titleStyle
        }

        ws.getCell(`A4`).value = `Bandung, ${moment(detailNew[0] !== undefined && detailNew[0].date_persetujuan).locale('idn').format('DD MMMM YYYY ')}`
        ws.getCell(`A4`).alignment = {
            ...leftStyle
        }
        ws.getCell(`A4`).font = {
            ...subtitleStyle
        }

        ws.getCell(`A6`).value = 'Hal'
        ws.getCell(`A6`).alignment = {
            ...leftStyle
        }
        ws.getCell(`A6`).font = {
            ...subtitleStyle
        }

        ws.getCell(`E6`).value = `: Persetujuan Disposal Asset`
        ws.getCell(`E6`).alignment = {
            ...leftStyle
        }
        ws.getCell(`E6`).font = {
            ...subtitleStyle
        }

        ws.getCell(`A8`).value = 'Kepada Yth.'
        ws.getCell(`A8`).alignment = {
            ...leftStyle
        }
        ws.getCell(`A8`).font = {
            ...subtitleStyle
        }

        ws.getCell(`A9`).value = `Bpk/Ibu ${detailNew.length !== 0 && detailNew[0].ceo}`
        ws.getCell(`A9`).alignment = {
            ...leftStyle
        }
        ws.getCell(`A9`).font = {
            ...subtitleStyle
        }

        ws.getCell(`A11`).value = 'Dengan Hormat,'
        ws.getCell(`A11`).alignment = {
            ...leftStyle
        }
        ws.getCell(`A11`).font = {
            ...subtitleStyle
        }

        ws.getCell(`A12`).value = 'Sehubungan dengan surat permohonan disposal aset area PMA terlampir'
        ws.getCell(`A12`).alignment = {
            ...leftStyle
        }
        ws.getCell(`A12`).font = {
            ...subtitleStyle
        }

        ws.getCell(`A13`).value = 'Dengan ini kami mohon persetujuan untuk melakukan disposal aset dengan perincian sbb :'
        ws.getCell(`A13`).alignment = {
            ...leftStyle
        }
        ws.getCell(`A13`).font = {
            ...subtitleStyle
        }


        //border detail form
        const borderWidthDet = 'thin'

        const borderStyleDet = {
            style: borderWidthDet
        };

        //header table mutasi
        const rowTable = 16

        ws.mergeCells(`A${rowTable}`, `A${rowTable + 1}`)
        ws.getCell(`A${rowTable}`).value = 'No.'
        ws.getCell(`A${rowTable}`).alignment = {
            ...alignStyle
        }
        ws.getCell(`A${rowTable}`).border = {
            ...borderStyles
        }
        ws.getCell(`A${rowTable}`).fill = {
            ...colorStyle
        }
        ws.getCell(`A${rowTable}`).font = {
            ...fontTb
        }

        ws.mergeCells(`B${rowTable}`, `E${rowTable + 1}`)
        ws.getCell(`B${rowTable}`).value = 'Nomor \n Aset / Inventaris'
        ws.getCell(`B${rowTable}`).alignment = {
            ...alignStyle
        }
        ws.getCell(`B${rowTable}`).border = {
            ...borderStyles
        }
        ws.getCell(`B${rowTable}`).fill = {
            ...colorStyle
        }
        ws.getCell(`B${rowTable}`).font = {
            ...fontTb
        }

        ws.mergeCells(`F${rowTable}`, `I${rowTable + 1}`)
        ws.getCell(`F${rowTable}`).value = 'Area \n (Cabang/Depo/CP)'
        ws.getCell(`F${rowTable}`).alignment = {
            ...alignStyle
        }
        ws.getCell(`F${rowTable}`).border = {
            ...borderStyles
        }
        ws.getCell(`F${rowTable}`).fill = {
            ...colorStyle
        }
        ws.getCell(`F${rowTable}`).font = {
            ...fontTb
        }

        ws.mergeCells(`J${rowTable}`, `O${rowTable + 1}`)
        ws.getCell(`J${rowTable}`).value = 'Nama Barang'
        ws.getCell(`J${rowTable}`).alignment = {
            ...alignStyle
        }
        ws.getCell(`J${rowTable}`).border = {
            ...borderStyles
        }
        ws.getCell(`J${rowTable}`).fill = {
            ...colorStyle
        }
        ws.getCell(`J${rowTable}`).font = {
            ...fontTb
        }

        ws.mergeCells(`P${rowTable}`, `R${rowTable + 1}`)
        ws.getCell(`P${rowTable}`).value = 'Nilai Buku'
        ws.getCell(`P${rowTable}`).alignment = {
            ...alignStyle
        }
        ws.getCell(`P${rowTable}`).border = {
            ...borderStyles
        }
        ws.getCell(`P${rowTable}`).fill = {
            ...colorStyle
        }
        ws.getCell(`P${rowTable}`).font = {
            ...fontTb
        }

        ws.mergeCells(`S${rowTable}`, `U${rowTable + 1}`)
        ws.getCell(`S${rowTable}`).value = 'Nilai Jual'
        ws.getCell(`S${rowTable}`).alignment = {
            ...alignStyle
        }
        ws.getCell(`S${rowTable}`).border = {
            ...borderStyles
        }
        ws.getCell(`S${rowTable}`).fill = {
            ...colorStyle
        }
        ws.getCell(`S${rowTable}`).font = {
            ...fontTb
        }

        ws.mergeCells(`V${rowTable}`, `Y${rowTable + 1}`)
        ws.getCell(`V${rowTable}`).value = 'Tanggal Perolehan'
        ws.getCell(`V${rowTable}`).alignment = {
            ...alignStyle
        }
        ws.getCell(`V${rowTable}`).border = {
            ...borderStyles
        }
        ws.getCell(`V${rowTable}`).fill = {
            ...colorStyle
        }
        ws.getCell(`V${rowTable}`).font = {
            ...fontTb
        }

        ws.mergeCells(`Z${rowTable}`, `AE${rowTable + 1}`)
        ws.getCell(`Z${rowTable}`).value = 'Keterangan'
        ws.getCell(`Z${rowTable}`).alignment = {
            ...alignStyle
        }
        ws.getCell(`Z${rowTable}`).border = {
            ...borderStyles
        }
        ws.getCell(`Z${rowTable}`).fill = {
            ...colorStyle
        }
        ws.getCell(`Z${rowTable}`).font = {
            ...fontTb
        }

        //body table mutasi
        for (let i = 0; i < detailNew.length; i++) {
            const bodyTable = rowTable + 2 + i
            const item = detailNew[i]

            ws.getRow(`${bodyTable}`).height = 25

            ws.mergeCells(`A${bodyTable}`)
            ws.getCell(`A${bodyTable}`).value = `${i + 1}`
            ws.getCell(`A${bodyTable}`).alignment = {
                ...alignStyle
            }
            ws.getCell(`A${bodyTable}`).border = {
                ...borderStyles
            }
            ws.getCell(`A${bodyTable}`).font = {
                ...fontTb
            }

            ws.mergeCells(`B${bodyTable}`, `E${bodyTable}`)
            ws.getCell(`B${bodyTable}`).value = `${item.no_asset}`
            ws.getCell(`B${bodyTable}`).alignment = {
                ...alignStyle
            }
            ws.getCell(`B${bodyTable}`).border = {
                ...borderStyles
            }
            ws.getCell(`B${bodyTable}`).font = {
                ...fontTb
            }

            ws.mergeCells(`F${bodyTable}`, `I${bodyTable}`)
            ws.getCell(`F${bodyTable}`).value = `${item.area}`
            ws.getCell(`F${bodyTable}`).alignment = {
                ...alignStyle
            }
            ws.getCell(`F${bodyTable}`).border = {
                ...borderStyles
            }
            ws.getCell(`F${bodyTable}`).font = {
                ...fontTb
            }

            ws.mergeCells(`J${bodyTable}`, `O${bodyTable}`)
            ws.getCell(`J${bodyTable}`).value = `${item.nama_asset === null ? '-' : item.nama_asset}`
            ws.getCell(`J${bodyTable}`).alignment = {
                ...alignStyle
            }
            ws.getCell(`J${bodyTable}`).border = {
                ...borderStyles
            }
            ws.getCell(`J${bodyTable}`).font = {
                ...fontTb
            }

            ws.mergeCells(`P${bodyTable}`, `R${bodyTable}`)
            ws.getCell(`P${bodyTable}`).value = `${item.nilai_buku === null || item.nilai_buku === undefined ? 0 : item.nilai_buku.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
            ws.getCell(`P${bodyTable}`).alignment = {
                ...alignStyle
            }
            ws.getCell(`P${bodyTable}`).border = {
                ...borderStyles
            }
            ws.getCell(`P${bodyTable}`).font = {
                ...fontTb
            }

            ws.mergeCells(`S${bodyTable}`, `U${bodyTable}`)
            ws.getCell(`S${bodyTable}`).value = `${item.nilai_jual === null || item.nilai_jual === undefined ? 0 : item.nilai_jual.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
            ws.getCell(`S${bodyTable}`).alignment = {
                ...alignStyle
            }
            ws.getCell(`S${bodyTable}`).border = {
                ...borderStyles
            }
            ws.getCell(`S${bodyTable}`).font = {
                ...fontTb
            }

            ws.mergeCells(`V${bodyTable}`, `Y${bodyTable}`)
            ws.getCell(`V${bodyTable}`).value = `${moment(item.dataAsset.tanggal).format('DD/MM/YYYY')}`
            ws.getCell(`V${bodyTable}`).alignment = {
                ...alignStyle
            }
            ws.getCell(`V${bodyTable}`).border = {
                ...borderStyles
            }
            ws.getCell(`V${bodyTable}`).font = {
                ...fontTb
            }

            ws.mergeCells(`Z${bodyTable}`, `AE${bodyTable}`)
            ws.getCell(`Z${bodyTable}`).value = `${item.keterangan}`
            ws.getCell(`Z${bodyTable}`).alignment = {
                ...alignStyle
            }
            ws.getCell(`Z${bodyTable}`).border = {
                ...borderStyles
            }
            ws.getCell(`Z${bodyTable}`).font = {
                ...fontTb
            }
        }

        // header alasan mutasi
        const reasonTh = rowTable + detailNew.length + 3
        // ws.mergeCells(`A${reasonTh}`, `E${reasonTh}`)
        // ws.getCell(`A${reasonTh}`).value = 'Alasan Mutasi : '
        // ws.getCell(`A${reasonTh}`).alignment = {
        //     ...leftStyle
        // }
        // ws.getCell(`A${reasonTh}`).font = {
        //     ...boldStyle,
        //     ...underStyle
        // }

        // // body alasan mutasi
        // ws.mergeCells(`A${reasonTh + 1}`, `E${reasonTh + 4}`)
        // ws.getCell(`A${reasonTh + 1}`).value = `${detailNew.length !== 0 && detailNew[0].alasan !== null ? detailNew[0].alasan : ''}`
        // ws.getCell(`A${reasonTh + 1}`).alignment = {
        //     ...topStyle,
        //     ...wrapStyle
        // }

        // const startReason = { row: reasonTh, col: 1 }

        // const endReason = { row: reasonTh + 4, col: 5 }

        // for (let i = startReason.row; i <= endReason.row; i++) {
        //     const leftBorderCell = ws.getCell(i, startReason.col);
        //     const rightBorderCell = ws.getCell(i, endReason.col);
        //     leftBorderCell.border = {
        //         ...leftBorderCell.border,
        //         left: borderStyleIm
        //     };
        //     rightBorderCell.border = {
        //         ...rightBorderCell.border,
        //         right: borderStyleIm
        //     };
        // }

        // for (let i = startReason.col; i <= endReason.col; i++) {
        //     const topBorderCell = ws.getCell(startReason.row, i);
        //     const bottomBorderCell = ws.getCell(endReason.row, i);
        //     topBorderCell.border = {
        //         ...topBorderCell.border,
        //         top: borderStyleIm
        //     };
        //     bottomBorderCell.border = {
        //         ...bottomBorderCell.border,
        //         bottom: borderStyleIm
        //     };
        // }

        // demikian
        ws.getCell(`A${reasonTh}`).value = 'Demikian hal yang kami sampaikan, atas perhatiannya kami mengucapkan terima kasih'
        ws.getCell(`A${reasonTh}`).alignment = {
            ...leftStyle
        }
        ws.getCell(`A${reasonTh}`).font = {
            ...subtitleStyle
        }


        // approval mutasi
        const sumRow = reasonTh + 2
        const headRow = 1 + sumRow
        const mainRow = 3 + sumRow
        const footRow = 5 + sumRow
        const cekPemeriksa = disApp.pemeriksa !== undefined && disApp.pemeriksa.length > 0 ? disApp.pemeriksa.filter(x => x.id_role !== 2).length : 0

        const cekApp = disApp.pembuat.length + cekPemeriksa + disApp.penyetuju.length
        const compCol = 'D'
        const distCol = 4
        const botRow = 6 + sumRow
        console.log(sumRow)

        // Approval Dibuat

        ws.mergeCells(`A${sumRow}`, `${compCol}${sumRow}`)
        ws.getCell(`A${sumRow}`).value = 'Dibuat oleh,'
        ws.getCell(`A${sumRow}`).alignment = { horizontal: 'center' }
        ws.getCell(`A${sumRow}`).border = {
            ...borderStyles
        }
        ws.getCell(`A${sumRow}`).font = {
            ...fontTtd
        }

        ws.mergeCells(`A${headRow}`, `${compCol}${botRow}`)

        disApp.pembuat !== undefined && disApp.pembuat.map(item => {
            const name = item.nama === undefined || item.nama === null ? null
                : item.nama.length <= 15 ? item.nama.split(" ").map((word) => {
                    return word[0] === undefined ? '' : word[0].toUpperCase() + word.substring(1)
                }).join(" ")
                    : item.nama.slice(0, 13).split(" ").map((word) => {
                        return word[0] === undefined ? '' : word[0].toUpperCase() + word.substring(1)
                    }).join(" ") + '.'

            ws.getCell(`A${headRow}`).value = name === null
                ? `\n - \n\n\n ${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}`
                : item.status === 0
                    ? `Reject (${moment(item.updatedAt).format('DD/MM/YYYY')}) \n\n ${name} \n ${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}`
                    : `Approve (${moment(item.updatedAt).format('DD/MM/YYYY')}) \n\n ${name} \n ${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}`
        })

        ws.getCell(`A${headRow}`).alignment = {
            ...alignStyle
        }
        ws.getCell(`A${headRow}`).border = {
            ...borderStyles
        }
        ws.getCell(`A${headRow}`).font = {
            ...fontTtd
        }

        // Approval Diperiksa
        // const cekRowRec = alphabet[alphabet.indexOf(alphabet.find(item => item === compCol.toUpperCase())) + 1]
        // const cekRowRec2 = alphabet[alphabet.indexOf(alphabet.find(item => item === cekRowRec.toUpperCase())) + (distCol * (disApp.pemeriksa.filter(x => x.id_role !== 2).length === 0 ? 1 : disApp.pemeriksa.filter(x => x.id_role !== 2).length)) - 1]
        // ws.mergeCells(`${cekRowRec}${sumRow}`, `${cekRowRec2}${sumRow}`)
        // ws.getCell(`${cekRowRec}${sumRow}`).value = 'Diperiksa oleh,'
        // ws.getCell(`${cekRowRec}${sumRow}`).alignment = { horizontal: 'center' }
        // ws.getCell(`${cekRowRec}${sumRow}`).border = {
        //     ...borderStyles
        // }
        // ws.getCell(`${cekRowRec}${sumRow}`).font = {
        //     ...fontTtd
        // }

        // disApp.pemeriksa !== undefined && disApp.pemeriksa.filter(x => x.id_role !== 2).map((item, index) => {
        //     const name = item.nama === undefined || item.nama === null ? null
        //         : item.nama.length <= 15 ? item.nama.split(" ").map((word) => {
        //             return word[0] === undefined ? '' : word[0].toUpperCase() + word.substring(1)
        //         }).join(" ")
        //             : item.nama.slice(0, 13).split(" ").map((word) => {
        //                 return word[0] === undefined ? '' : word[0].toUpperCase() + word.substring(1)
        //             }).join(" ") + '.'
        //     const startRow = alphabet[alphabet.indexOf(alphabet.find(item => item === cekRowRec.toUpperCase())) + (distCol * index)]
        //     const endRow = alphabet[alphabet.indexOf(alphabet.find(item => item === cekRowRec.toUpperCase())) + ((distCol * index) + (distCol - 1))]

        //     // console.log(alphabet.indexOf(alphabet.find(item => item === str.toUpperCase())))
        //     // console.log(`${startRow}${headRow}`, `${endRow}${botRow} Quenn`)

        //     ws.mergeCells(`${startRow}${headRow}`, `${endRow}${botRow}`)
        //     ws.getCell(`${startRow}${headRow}`).value = name === null
        //         ? `\n - \n\n\n${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}`
        //         : item.status === 0
        //             ? `Reject (${moment(item.updatedAt).format('DD/MM/YYYY')}) \n\n  ${name} \n ${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}`
        //             : `Approve (${moment(item.updatedAt).format('DD/MM/YYYY')}) \n\n ${name} \n ${item.jabatan === null ? "-" : item.jabatan.toUpperCase()}`

        //     ws.getCell(`${startRow}${headRow}`).alignment = {
        //         ...alignStyle,
        //     }
        //     ws.getCell(`${startRow}${headRow}`).border = {
        //         ...borderStyles
        //     }
        //     ws.getCell(`${startRow}${headRow}`).font = {
        //         ...fontTtd
        //     }
        //     // ws.getCell(`${startRow}${headRow}`).font = { 
        //     //     ...fontStyle,
        //     // }
        // })


        // Approval Disetujui
        const cekRow21 = alphabet[alphabet.indexOf(alphabet.find(item => item === compCol.toUpperCase())) + 1]
        const cekLastRow = parseInt(alphabet.indexOf(alphabet.find(item => item === compCol.toUpperCase())) + (distCol * (disApp.penyetuju.length === 0 ? 1 : disApp.penyetuju.length)))
        const cekRow22 = cekLastRow >= alphabet.length ? `A${alphabet[cekLastRow - alphabet.length]}` : alphabet[cekLastRow]
        ws.mergeCells(`${cekRow21}${sumRow}`, `${cekRow22}${sumRow}`)
        ws.getCell(`${cekRow21}${sumRow}`).value = 'Disetujui oleh,'
        ws.getCell(`${cekRow21}${sumRow}`).alignment = { horizontal: 'center' }
        ws.getCell(`${cekRow21}${sumRow}`).border = {
            ...borderStyles
        }
        ws.getCell(`${cekRow21}${sumRow}`).font = {
            ...fontTtd
        }

        disApp.penyetuju !== undefined && disApp.penyetuju.map((item, index) => {
            const name = item.nama === undefined || item.nama === null ? null
                : item.nama.length <= 15 ? item.nama.split(" ").map((word) => {
                    return word[0] === undefined ? '' : word[0].toUpperCase() + word.substring(1)
                }).join(" ")
                    : item.nama.slice(0, 13).split(" ").map((word) => {
                        return word[0] === undefined ? '' : word[0].toUpperCase() + word.substring(1)
                    }).join(" ") + '.'
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
            ws.getCell(`${startRow}${headRow}`).border = {
                ...borderStyles
            }
            ws.getCell(`${startRow}${headRow}`).font = {
                ...fontTtd
            }
        })

        const expRow = botRow + 2

        // ws.getCell(`A${expRow}`).value = 'Matrix Otorisasi ditandatangani oleh:'
        // ws.getCell(`A${expRow}`).alignment = {
        //     ...leftStyle
        // }
        // ws.getCell(`A${expRow}`).font = {
        //     ...boldStyle,
        //     ...underStyle,
        //     ...fontStyle
        // }

        // ws.getCell(`A${expRow + 1}`).value = 'Aset (Nilai ≥ Rp 1.000.00, Barang IT) '
        // ws.getCell(`A${expRow + 1}`).alignment = {
        //     ...leftStyle
        // }
        // ws.getCell(`A${expRow + 1}`).font = {
        //     ...boldStyle,
        //     ...fontStyle
        // }

        // ws.getCell(`A${expRow + 2}`).value = '1. Area :  AOS, BM GT/MT, IT OSM, IRM, AM, NFAM, HEAD OF OPS, HEAD OF HC, CM'
        // ws.getCell(`A${expRow + 2}`).alignment = {
        //     ...leftStyle
        // }
        // ws.getCell(`A${expRow + 2}`).font = {
        //     ...fontStyle
        // }

        // ws.getCell(`A${expRow + 3}`).value = '2. Head Office : IT SPV , IT OSM, IRM, AM, NFAM, HEAD OF OPS, HEAD OF HC, CM'
        // ws.getCell(`A${expRow + 3}`).alignment = {
        //     ...leftStyle
        // }
        // ws.getCell(`A${expRow + 3}`).font = {
        //     ...fontStyle
        // }

        // ws.getCell(`P${expRow + 1}`).value = 'Aset (Nilai ≥ Rp 1.000.00, Barang Non IT)'
        // ws.getCell(`P${expRow + 1}`).alignment = {
        //     ...leftStyle
        // }
        // ws.getCell(`P${expRow + 1}`).font = {
        //     ...boldStyle,
        //     ...fontStyle
        // }

        // ws.getCell(`P${expRow + 2}`).value = '1. Area :  AOS, BM GT/MT, IRM, AM, NFAM, HEAD OF OPS, HEAD OF  HC, CM'
        // ws.getCell(`P${expRow + 2}`).alignment = {
        //     ...leftStyle
        // }
        // ws.getCell(`P${expRow + 2}`).font = {
        //     ...fontStyle
        // }

        // ws.getCell(`P${expRow + 3}`).value = ' 2. Head Office : GA SPV,  IRM, AM, NFAM, HEAD OF OPS, HEAD OF HC, CM'
        // ws.getCell(`P${expRow + 3}`).alignment = {
        //     ...leftStyle
        // }
        // ws.getCell(`P${expRow + 3}`).font = {
        //     ...fontStyle
        // }

        // ws.getRow(botRow + 4).height = 25

        const start = { row: 1, col: 1 }

        const end = { row: expRow, col: 36 }

        for (let i = start.row; i <= end.row; i++) {
            const leftBorderCell = ws.getCell(i, start.col);
            const rightBorderCell = ws.getCell(i, end.col);
            leftBorderCell.border = {
                ...leftBorderCell.border,
                left: borderStyleIm
            };
            rightBorderCell.border = {
                ...rightBorderCell.border,
                right: borderStyleIm
            };
        }

        for (let i = start.col; i <= end.col; i++) {
            const topBorderCell = ws.getCell(start.row, i);
            const bottomBorderCell = ws.getCell(end.row, i);
            topBorderCell.border = {
                ...topBorderCell.border,
                top: borderStyleIm
            };
            bottomBorderCell.border = {
                ...bottomBorderCell.border,
                bottom: borderStyleIm
            };
        }

        const topInfoRow = expRow + 2

        ws.getCell(`A${topInfoRow}`).value = 'FRM-FAD-121 REV 01'
        ws.getCell(`A${topInfoRow}`).alignment = {
            ...leftStyle
        }

        await ws.protect('As5etPm4')
        for (let i = 0; i < (cekLastRow > 36 ? cekLastRow + 1 : 36); i++) {
            console.log(i)
            ws.columns[i].width = 4
        }

        ws.getRow(2).height = 25

        workbook.xlsx.writeBuffer().then(function (buffer) {
            fs.saveAs(
                new Blob([buffer], { type: "application/octet-stream" }),
                `Form Persetujuan Disposal ${detailNew[0].no_persetujuan} ${moment().format('DD MMMM YYYY')}.xlsx`
            )
        })

    }

    render() {
        return (
            <Button color="warning" className='ml-2' onClick={this.prosesDownload}>
                Download Form Persetujuan
            </Button>
        )
    }
}

const mapStateToProps = state => ({
    asset: state.asset,
    depo: state.depo,
    mutasi: state.mutasi,
    disposal: state.disposal,
    setuju: state.setuju,
    user: state.user,
    tempmail: state.tempmail,
    newnotif: state.newnotif,
    dokumen: state.dokumen
})

const mapDispatchToProps = {
    getApproveDisposal: disposal.getApproveDisposal,
    getNewDetailDisposal: disposal.getNewDetailDisposal,
    getApproveSetDisposal: setuju.getApproveSetDisposal
}


export default connect(mapStateToProps, mapDispatchToProps)(FormPersetujuan)