import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    NavbarBrand, Row, Col, Button, Input, Modal, ModalBody, ModalHeader, Table,
    Container, Alert, ModalFooter, Spinner, Card, CardBody, Collapse
} from 'reactstrap'
import ExcelJS from "exceljs";
import fs from "file-saver";
import moment from 'moment'

const { REACT_APP_BACKEND_URL } = process.env

class FormMutasi extends Component {

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

    downloadForm = async (val) => {
        const { dataMut, noMut, mutApp, dataDoc, detailMut } = this.props.mutasi

        const alpha = Array.from(Array(26)).map((e, i) => i + 65)
        const alphabet = alpha.map((x) => String.fromCharCode(x))

        const colNum = detailMut.length + 14
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
        const ws = workbook.addWorksheet('form mutasi aset', {
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

        const subtitleStyle = { size: 9 }

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

        const result = await this.toDataURL(`${REACT_APP_BACKEND_URL}/masters/logo.png`);

        const imageId2 = workbook.addImage({
            base64: result.base64Url,
            extension: 'png',
        });

        ws.addImage(imageId2, {
            tl: { col: 0.55, row: 1.65 },
            ext: { width: 40, height: 60 },
        })

        //border detail form
        const borderWidthIm = 'thin'

        const borderStyleIm = {
            style: borderWidthIm
        };

        const startIm = { row: 2, col: 1 }

        const endIm = { row: 5, col: 2 }

        for (let i = startIm.row; i <= endIm.row; i++) {
            const leftBorderCell = ws.getCell(i, startIm.col);
            const rightBorderCell = ws.getCell(i, endIm.col);
            leftBorderCell.border = {
                ...leftBorderCell.border,
                left: borderStyleIm
            };
            rightBorderCell.border = {
                ...rightBorderCell.border,
                right: borderStyleIm
            };
        }

        for (let i = startIm.col; i <= endIm.col; i++) {
            const topBorderCell = ws.getCell(startIm.row, i);
            const bottomBorderCell = ws.getCell(endIm.row, i);
            topBorderCell.border = {
                ...topBorderCell.border,
                top: borderStyleIm
            };
            bottomBorderCell.border = {
                ...bottomBorderCell.border,
                bottom: borderStyleIm
            };
        }

        ws.mergeCells(`C2`, `L5`)
        ws.getCell(`C2`).value = 'FORM MUTASI ASSET / INVENTARIS'
        ws.getCell(`C2`).alignment = {
            ...alignStyle
        }
        ws.getCell(`C2`).font = {
            ...titleStyle
        }
        ws.getCell(`C2`).border = {
            ...borderStyles
        }

        //no mutasi
        ws.mergeCells(`M2`, `O2`)
        ws.getCell(`M2`).value = 'No.'
        ws.getCell(`M2`).alignment = {
            ...leftStyle,
            ...midStyle
        }
        ws.getCell(`M2`).font = {
            ...subtitleStyle
        }

        ws.mergeCells(`P2`, `R2`)
        ws.getCell(`P2`).value = `:${detailMut.length !== 0 ? detailMut[0].no_mutasi : ''}`
        ws.getCell(`P2`).alignment = {
            ...leftStyle,
            ...wrapStyle,
            ...midStyle
        }
        ws.getCell(`P2`).font = {
            ...subtitleStyle
        }

        // tanggal form
        ws.mergeCells(`M3`, `O3`)
        ws.getCell(`M3`).value = 'Tanggal Form'
        ws.getCell(`M3`).alignment = {
            ...leftStyle
        }
        ws.getCell(`M3`).font = {
            ...subtitleStyle
        }

        ws.mergeCells(`P3`, `R3`)
        ws.getCell(`P3`).value = `:${detailMut.length !== 0 ? moment(detailMut[0].tanggalMut).format('DD MMMM YYYY') : ''}`
        ws.getCell(`P3`).alignment = {
            ...leftStyle,
            ...wrapStyle
        }
        ws.getCell(`P3`).font = {
            ...subtitleStyle
        }

        // tanggal mutasi fisik
        ws.mergeCells(`M4`, `O4`)
        ws.getCell(`M4`).value = 'Tanggal Mutasi Fisik'
        ws.getCell(`M4`).alignment = {
            ...leftStyle
        }
        ws.getCell(`M4`).font = {
            ...subtitleStyle
        }

        ws.mergeCells(`P4`, `R4`)
        ws.getCell(`P4`).value = `:${detailMut.length !== 0 && detailMut[0].tgl_mutasifisik !== null ? moment(detailMut[0].tgl_mutasifisik).format('DD MMMM YYYY') : ''}`
        ws.getCell(`P4`).alignment = {
            ...leftStyle,
            ...wrapStyle
        }
        ws.getCell(`P4`).font = {
            ...subtitleStyle
        }

        // depo
        ws.mergeCells(`M5`, `O5`)
        ws.getCell(`M5`).value = 'Cabang / Depo'
        ws.getCell(`M5`).alignment = {
            ...leftStyle
        }
        ws.getCell(`M5`).font = {
            ...subtitleStyle
        }

        ws.mergeCells(`P5`, `R5`)
        ws.getCell(`P5`).value = `:${detailMut.length !== 0 ? detailMut[0].area : ''}`
        ws.getCell(`P5`).alignment = {
            ...leftStyle,
            ...wrapStyle
        }
        ws.getCell(`P5`).font = {
            ...subtitleStyle
        }

        //border detail form
        const borderWidthDet = 'thin'

        const borderStyleDet = {
            style: borderWidthDet
        };

        const startDet = { row: 2, col: 12 }

        const endDet = { row: 5, col: 17 }

        for (let i = startDet.row; i <= endDet.row; i++) {
            const leftBorderCell = ws.getCell(i, startDet.col);
            const rightBorderCell = ws.getCell(i, endDet.col);
            leftBorderCell.border = {
                ...leftBorderCell.border,
                left: borderStyleDet
            };
            rightBorderCell.border = {
                ...rightBorderCell.border,
                right: borderStyleDet
            };
        }

        for (let i = startDet.col; i <= endDet.col; i++) {
            const topBorderCell = ws.getCell(startDet.row, i);
            const bottomBorderCell = ws.getCell(endDet.row, i);
            topBorderCell.border = {
                ...topBorderCell.border,
                top: borderStyleDet
            };
            bottomBorderCell.border = {
                ...bottomBorderCell.border,
                bottom: borderStyleDet
            };
        }

        //header table mutasi
        const rowTable = 7

        ws.mergeCells(`A${rowTable}`, `B${rowTable + 1}`)
        ws.getCell(`A${rowTable}`).value = 'No. Asset / No. Inventaris'
        ws.getCell(`A${rowTable}`).alignment = {
            ...alignStyle
        }
        ws.getCell(`A${rowTable}`).border = {
            ...borderStyles
        }
        ws.getCell(`A${rowTable}`).fill = {
            ...colorStyle
        }

        ws.mergeCells(`C${rowTable}`, `F${rowTable + 1}`)
        ws.getCell(`C${rowTable}`).value = 'Nama Asset / Inventaris'
        ws.getCell(`C${rowTable}`).alignment = {
            ...alignStyle
        }
        ws.getCell(`C${rowTable}`).border = {
            ...borderStyles
        }
        ws.getCell(`C${rowTable}`).fill = {
            ...colorStyle
        }

        ws.mergeCells(`G${rowTable}`, `H${rowTable + 1}`)
        ws.getCell(`G${rowTable}`).value = 'Type / Merk'
        ws.getCell(`G${rowTable}`).alignment = {
            ...alignStyle
        }
        ws.getCell(`G${rowTable}`).border = {
            ...borderStyles
        }
        ws.getCell(`G${rowTable}`).fill = {
            ...colorStyle
        }

        ws.mergeCells(`I${rowTable}`, `J${rowTable + 1}`)
        ws.getCell(`I${rowTable}`).value = 'Kategori    (Aset/Inventaris)'
        ws.getCell(`I${rowTable}`).alignment = {
            ...alignStyle
        }
        ws.getCell(`I${rowTable}`).border = {
            ...borderStyles
        }
        ws.getCell(`I${rowTable}`).fill = {
            ...colorStyle
        }

        ws.mergeCells(`K${rowTable}`, `N${rowTable}`)
        ws.getCell(`K${rowTable}`).value = 'Cost Center Lama'
        ws.getCell(`K${rowTable}`).alignment = {
            ...alignStyle
        }
        ws.getCell(`K${rowTable}`).border = {
            ...borderStyles
        }
        ws.getCell(`K${rowTable}`).fill = {
            ...colorStyle
        }

        ws.mergeCells(`K${rowTable + 1}`, `L${rowTable + 1}`)
        ws.getCell(`K${rowTable + 1}`).value = 'Cabang / Depo'
        ws.getCell(`K${rowTable + 1}`).alignment = {
            ...alignStyle
        }
        ws.getCell(`K${rowTable + 1}`).border = {
            ...borderStyles
        }
        ws.getCell(`K${rowTable + 1}`).fill = {
            ...colorStyle
        }

        ws.mergeCells(`M${rowTable + 1}`, `N${rowTable + 1}`)
        ws.getCell(`M${rowTable + 1}`).value = 'Cost Center'
        ws.getCell(`M${rowTable + 1}`).alignment = {
            ...alignStyle
        }
        ws.getCell(`M${rowTable + 1}`).border = {
            ...borderStyles
        }
        ws.getCell(`M${rowTable + 1}`).fill = {
            ...colorStyle
        }

        ws.mergeCells(`O${rowTable}`, `R${rowTable}`)
        ws.getCell(`O${rowTable}`).value = 'Cost Center Baru'
        ws.getCell(`O${rowTable}`).alignment = {
            ...alignStyle
        }
        ws.getCell(`O${rowTable}`).border = {
            ...borderStyles
        }
        ws.getCell(`O${rowTable}`).fill = {
            ...colorStyle
        }

        ws.mergeCells(`O${rowTable + 1}`, `P${rowTable + 1}`)
        ws.getCell(`O${rowTable + 1}`).value = 'Cabang / Depo'
        ws.getCell(`O${rowTable + 1}`).alignment = {
            ...alignStyle
        }
        ws.getCell(`O${rowTable + 1}`).border = {
            ...borderStyles
        }
        ws.getCell(`O${rowTable + 1}`).fill = {
            ...colorStyle
        }

        ws.mergeCells(`Q${rowTable + 1}`, `R${rowTable + 1}`)
        ws.getCell(`Q${rowTable + 1}`).value = 'Cost Center'
        ws.getCell(`Q${rowTable + 1}`).alignment = {
            ...alignStyle
        }
        ws.getCell(`Q${rowTable + 1}`).border = {
            ...borderStyles
        }
        ws.getCell(`Q${rowTable + 1}`).fill = {
            ...colorStyle
        }

        //body table mutasi
        for (let i = 0; i < detailMut.length; i++) {
            const bodyTable = rowTable + 2 + i
            const item = detailMut[i]

            ws.mergeCells(`A${bodyTable}`, `B${bodyTable}`)
            ws.getCell(`A${bodyTable}`).value = `${item.no_asset}`
            ws.getCell(`A${bodyTable}`).alignment = {
                ...alignStyle
            }
            ws.getCell(`A${bodyTable}`).border = {
                ...borderStyles
            }

            ws.mergeCells(`C${bodyTable}`, `F${bodyTable}`)
            ws.getCell(`C${bodyTable}`).value = `${item.nama_asset}`
            ws.getCell(`C${bodyTable}`).alignment = {
                ...alignStyle
            }
            ws.getCell(`C${bodyTable}`).border = {
                ...borderStyles
            }

            ws.mergeCells(`G${bodyTable}`, `H${bodyTable}`)
            ws.getCell(`G${bodyTable}`).value = `${item.merk === null ? '-' : item.merk}`
            ws.getCell(`G${bodyTable}`).alignment = {
                ...alignStyle
            }
            ws.getCell(`G${bodyTable}`).border = {
                ...borderStyles
            }

            ws.mergeCells(`I${bodyTable}`, `J${bodyTable}`)
            ws.getCell(`I${bodyTable}`).value = `${item.kategori}`
            ws.getCell(`I${bodyTable}`).alignment = {
                ...alignStyle
            }
            ws.getCell(`I${bodyTable}`).border = {
                ...borderStyles
            }

            ws.mergeCells(`K${bodyTable}`, `L${bodyTable}`)
            ws.getCell(`K${bodyTable}`).value = `${item.area}`
            ws.getCell(`K${bodyTable}`).alignment = {
                ...alignStyle
            }
            ws.getCell(`K${bodyTable}`).border = {
                ...borderStyles
            }

            ws.mergeCells(`M${bodyTable}`, `N${bodyTable}`)
            ws.getCell(`M${bodyTable}`).value = `${item.cost_center}`
            ws.getCell(`M${bodyTable}`).alignment = {
                ...alignStyle
            }
            ws.getCell(`M${bodyTable}`).border = {
                ...borderStyles
            }

            ws.mergeCells(`O${bodyTable}`, `P${bodyTable}`)
            ws.getCell(`O${bodyTable}`).value = `${item.area_rec}`
            ws.getCell(`O${bodyTable}`).alignment = {
                ...alignStyle
            }
            ws.getCell(`O${bodyTable}`).border = {
                ...borderStyles
            }

            ws.mergeCells(`Q${bodyTable}`, `R${bodyTable}`)
            ws.getCell(`Q${bodyTable}`).value = `${item.cost_center_rec}`
            ws.getCell(`Q${bodyTable}`).alignment = {
                ...alignStyle
            }
            ws.getCell(`Q${bodyTable}`).border = {
                ...borderStyles
            }
        }

        // header alasan mutasi
        const reasonTh = rowTable + 2 + detailMut.length + 1
        ws.mergeCells(`A${reasonTh}`, `E${reasonTh}`)
        ws.getCell(`A${reasonTh}`).value = 'Alasan Mutasi : '
        ws.getCell(`A${reasonTh}`).alignment = {
            ...leftStyle
        }
        ws.getCell(`A${reasonTh}`).font = {
            ...boldStyle,
            ...underStyle
        }

        // body alasan mutasi
        ws.mergeCells(`A${reasonTh + 1}`, `E${reasonTh + 4}`)
        ws.getCell(`A${reasonTh + 1}`).value = `${detailMut.length !== 0 && detailMut[0].alasan !== null ? detailMut[0].alasan : ''}`
        ws.getCell(`A${reasonTh + 1}`).alignment = {
            ...topStyle,
            ...wrapStyle
        }

        const startReason = { row: reasonTh, col: 1 }

        const endReason = { row: reasonTh + 4, col: 5 }

        for (let i = startReason.row; i <= endReason.row; i++) {
            const leftBorderCell = ws.getCell(i, startReason.col);
            const rightBorderCell = ws.getCell(i, endReason.col);
            leftBorderCell.border = {
                ...leftBorderCell.border,
                left: borderStyleIm
            };
            rightBorderCell.border = {
                ...rightBorderCell.border,
                right: borderStyleIm
            };
        }

        for (let i = startReason.col; i <= endReason.col; i++) {
            const topBorderCell = ws.getCell(startReason.row, i);
            const bottomBorderCell = ws.getCell(endReason.row, i);
            topBorderCell.border = {
                ...topBorderCell.border,
                top: borderStyleIm
            };
            bottomBorderCell.border = {
                ...bottomBorderCell.border,
                bottom: borderStyleIm
            };
        }

        ws.getCell(`G${reasonTh}`).value = 'Matrix Otorisasi, ditandatangani oleh :'
        ws.getCell(`G${reasonTh}`).alignment = {
            ...leftStyle
        }
        ws.getCell(`G${reasonTh}`).font = {
            ...boldStyle,
            ...underStyle,
            ...fontStyle
        }

        ws.getCell(`G${reasonTh + 1}`).value = 'Area ke Area'
        ws.getCell(`G${reasonTh + 1}`).alignment = {
            ...leftStyle
        }
        ws.getCell(`G${reasonTh + 1}`).font = {
            ...boldStyle,
            ...fontStyle
        }

        ws.getCell(`G${reasonTh + 2}`).value = '1. Dibuat : AOS'
        ws.getCell(`G${reasonTh + 2}`).alignment = {
            ...leftStyle
        }
        ws.getCell(`G${reasonTh + 2}`).font = {
            ...fontStyle
        }

        ws.getCell(`G${reasonTh + 3}`).value = '2. Diperiksa : BM, ROM, GAAM/IT OSM (aset IT)'
        ws.getCell(`G${reasonTh + 3}`).alignment = {
            ...leftStyle
        }
        ws.getCell(`G${reasonTh + 3}`).font = {
            ...fontStyle
        }

        ws.mergeCells(`G${reasonTh + 4}`, `K${reasonTh + 4}`)
        ws.getCell(`G${reasonTh + 4}`).value = '3. Disetujui  : Head of Ops Excellence, Treasury Operation Senior Manager'
        ws.getCell(`G${reasonTh + 4}`).alignment = {
            ...leftStyle,
            ...wrapStyle,
            ...midStyle
        }
        ws.getCell(`G${reasonTh + 4}`).font = {
            ...fontStyle
        }


        ws.getCell(`M${reasonTh + 1}`).value = 'HO ke Area'
        ws.getCell(`M${reasonTh + 1}`).alignment = {
            ...leftStyle
        }
        ws.getCell(`M${reasonTh + 1}`).font = {
            ...boldStyle,
            ...fontStyle
        }

        ws.getCell(`M${reasonTh + 2}`).value = '1. Dibuat : GA SPV/IT SPV (aset IT)'
        ws.getCell(`M${reasonTh + 2}`).alignment = {
            ...leftStyle
        }
        ws.getCell(`M${reasonTh + 2}`).font = {
            ...fontStyle
        }

        ws.getCell(`M${reasonTh + 3}`).value = ' 2. Diperiksa : BM, ROM, NFAC, GAAM, IT OSM (aset IT)'
        ws.getCell(`M${reasonTh + 3}`).alignment = {
            ...leftStyle
        }
        ws.getCell(`M${reasonTh + 3}`).font = {
            ...fontStyle
        }

        ws.mergeCells(`M${reasonTh + 4}`, `R${reasonTh + 4}`)
        ws.getCell(`M${reasonTh + 4}`).value = '3. Disetujui : Head of Ops Excellence, Head of HC S&D Domestic, Treasury Operation Senior Manager'
        ws.getCell(`M${reasonTh + 4}`).alignment = {
            ...leftStyle,
            ...wrapStyle,
            ...midStyle
        }
        ws.getCell(`M${reasonTh + 4}`).font = {
            ...fontStyle
        }

        ws.getRow(reasonTh + 4).height = 25

        // approval mutasi
        const sumRow = reasonTh + 6
        const headRow = 1 + sumRow
        const mainRow = 3 + sumRow
        const footRow = 5 + sumRow

        const cekApp = mutApp.pembuat.length + mutApp.pemeriksa.length + mutApp.penyetuju.length
        const compCol = 'B'
        const distCol = 2
        const botRow = 8 + sumRow
        console.log(sumRow)

        // Approval Dibuat


        ws.mergeCells(`A${sumRow}`, `${compCol}${sumRow}`)
        ws.getCell(`A${sumRow}`).value = 'Dibuat oleh,'
        ws.getCell(`A${sumRow}`).alignment = { horizontal: 'center' }
        ws.getCell(`A${sumRow}`).border = {
            ...borderStyles
        }

        ws.mergeCells(`A${headRow}`, `${compCol}${botRow}`)

        mutApp.pembuat !== undefined && mutApp.pembuat.map(item => {
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

        // Approval penerima
        const cekRowRec = alphabet[alphabet.indexOf(alphabet.find(item => item === compCol.toUpperCase())) + 1]
        const cekRowRec2 = alphabet[alphabet.indexOf(alphabet.find(item => item === cekRowRec.toUpperCase())) + (distCol * (mutApp.penerima.length === 0 ? 1 : mutApp.penerima.length)) - 1]
        ws.mergeCells(`${cekRowRec}${sumRow}`, `${cekRowRec2}${sumRow}`)
        ws.getCell(`${cekRowRec}${sumRow}`).value = 'Diterima oleh,'
        ws.getCell(`${cekRowRec}${sumRow}`).alignment = { horizontal: 'center' }
        ws.getCell(`${cekRowRec}${sumRow}`).border = {
            ...borderStyles
        }

        mutApp.penerima !== undefined && mutApp.penerima.map((item, index) => {
            const name = item.nama === undefined || item.nama === null ? null
                : item.nama.length <= 15 ? item.nama.split(" ").map((word) => {
                    return word[0] === undefined ? '' : word[0].toUpperCase() + word.substring(1)
                }).join(" ")
                    : item.nama.slice(0, 13).split(" ").map((word) => {
                        return word[0] === undefined ? '' : word[0].toUpperCase() + word.substring(1)
                    }).join(" ") + '.'
            const startRow = alphabet[alphabet.indexOf(alphabet.find(item => item === cekRowRec.toUpperCase())) + (distCol * index)]
            const endRow = alphabet[alphabet.indexOf(alphabet.find(item => item === cekRowRec.toUpperCase())) + ((distCol * index) + (distCol - 1))]

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
        })

        // Approval Diperiksa
        const cekRow11 = alphabet[alphabet.indexOf(alphabet.find(item => item === cekRowRec2.toUpperCase())) + 1]
        const cekRow12 = alphabet[alphabet.indexOf(alphabet.find(item => item === cekRow11.toUpperCase())) + (distCol * (mutApp.pemeriksa.length === 0 ? 1 : mutApp.pemeriksa.length)) - 1]
        ws.mergeCells(`${cekRow11}${sumRow}`, `${cekRow12}${sumRow}`)
        ws.getCell(`${cekRow11}${sumRow}`).value = 'Diperiksa oleh,'
        ws.getCell(`${cekRow11}${sumRow}`).alignment = { horizontal: 'center' }
        ws.getCell(`${cekRow11}${sumRow}`).border = {
            ...borderStyles
        }

        mutApp.pemeriksa !== undefined && mutApp.pemeriksa.map((item, index) => {
            const name = item.nama === undefined || item.nama === null ? null
                : item.nama.length <= 15 ? item.nama.split(" ").map((word) => {
                    return word[0] === undefined ? '' : word[0].toUpperCase() + word.substring(1)
                }).join(" ")
                    : item.nama.slice(0, 13).split(" ").map((word) => {
                        return word[0] === undefined ? '' : word[0].toUpperCase() + word.substring(1)
                    }).join(" ") + '.'
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
        })


        // Approval Disetujui
        const cekRow21 = alphabet[alphabet.indexOf(alphabet.find(item => item === cekRow12.toUpperCase())) + 1]
        const cekLastRow = parseInt(alphabet.indexOf(alphabet.find(item => item === cekRow12.toUpperCase())) + (distCol * (mutApp.penyetuju.length === 0 ? 1 : mutApp.penyetuju.length)))
        const cekRow22 = cekLastRow >= alphabet.length ? `A${alphabet[cekLastRow - alphabet.length]}` : alphabet[cekLastRow]
        ws.mergeCells(`${cekRow21}${sumRow}`, `${cekRow22}${sumRow}`)
        ws.getCell(`${cekRow21}${sumRow}`).value = 'Disetujui oleh,'
        ws.getCell(`${cekRow21}${sumRow}`).alignment = { horizontal: 'center' }
        ws.getCell(`${cekRow21}${sumRow}`).border = {
            ...borderStyles
        }

        mutApp.penyetuju !== undefined && mutApp.penyetuju.map((item, index) => {
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
        })

        const start = { row: 2, col: 1 }

        const end = { row: botRow + 1, col: 18 }

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

        const topInfoRow = botRow + 3

        ws.getCell(`A${topInfoRow}`).value = 'FRM-HCD-104 REV 07'
        ws.getCell(`A${topInfoRow}`).alignment = {
            ...leftStyle
        }

        if (detailMut.length !== 0 && detailMut[0].status_form === 8) {
            const rowBox = topInfoRow

            ws.mergeCells(`L${rowBox}`, `N${rowBox + 4}`)
            ws.getCell(`L${rowBox}`).value = ` DITERIMA ASSET PMA HO \n\n\n ${detailMut.length !== 0 ? moment(detailMut[0].tgl_mutasisap).format('DD/MM/YYYY') : '-'} \n PENERIMA: ${detailMut.length !== 0 ? detailMut[0].pic_aset : '-'}`
            ws.getCell(`L${rowBox}`).alignment = {
                ...leftStyle,
                ...wrapStyle,
                ...midStyle
            }
            ws.getCell(`L${rowBox}`).border = {
                ...borderStyles
            }
            
            let docSap = ''
            
            for (let x = 0; x < detailMut.length; x++) {
                if (detailMut[x].doc_sap !== null) {
                    docSap += detailMut[x].doc_sap + ((x !== detailMut.length - 1) ? ', ' : '')
                }
            }

            ws.mergeCells(`P${rowBox}`, `R${rowBox + 4}`)
            ws.getCell(`P${rowBox}`).value = ` EKSEKUSI DI SAP \n\n ${detailMut.length !== 0 ? moment(detailMut[0].tgl_mutasisap).format('DD/MM/YYYY') : '-'} \n NO. DOC: ${detailMut.length !== 0 ? docSap : '-'} \n PENCATAT: ${detailMut.length !== 0 ? detailMut[0].pic_aset : '-'}`
            ws.getCell(`P${rowBox}`).alignment = {
                ...leftStyle,
                ...wrapStyle,
                ...midStyle
            }
            ws.getCell(`P${rowBox}`).border = {
                ...borderStyles
            }

            await ws.protect('As5etPm4')

            for (let i = 0; i < 17; i++) {
                console.log(i)
                ws.columns[i].width = 8
            }

            ws.getRow(2).height = 34

            workbook.xlsx.writeBuffer().then(function (buffer) {
                fs.saveAs(
                    new Blob([buffer], { type: "application/octet-stream" }),
                    `Form Mutasi Asset ${detailMut[0].no_mutasi} ${moment().format('DD MMMM YYYY')}.xlsx`
                )
            })
        } else {
            await ws.protect('As5etPm4')

            for (let i = 0; i < 17; i++) {
                console.log(i)
                ws.columns[i].width = 8
            }
    
            ws.getRow(2).height = 34
    
            workbook.xlsx.writeBuffer().then(function (buffer) {
                fs.saveAs(
                    new Blob([buffer], { type: "application/octet-stream" }),
                    `Form Mutasi Asset ${detailMut[0].no_mutasi} ${moment().format('DD MMMM YYYY')}.xlsx`
                )
            })
        }

    }

    render() {
        return (
            <Button color="success" onClick={this.downloadForm}>
                Download Form
            </Button>
        )
    }
}

const mapStateToProps = state => ({
    asset: state.asset,
    depo: state.depo,
    mutasi: state.mutasi,
    user: state.user,
    tempmail: state.tempmail,
    newnotif: state.newnotif,
    dokumen: state.dokumen
})


export default connect(mapStateToProps)(FormMutasi)