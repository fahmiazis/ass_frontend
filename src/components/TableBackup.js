import React, { Component } from 'react'
import { Table, TableBody, TableCell, TableHeader, DataTableCell } from '@david.kucsai/react-pdf-table'
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import setuju from '../redux/actions/setuju'
import mutasi from '../redux/actions/mutasi'
import {connect} from 'react-redux'
import moment from 'moment'
const {REACT_APP_BACKEND_URL} = process.env

class TablePdf extends Component {


    state = {
        num: 1,
        dataStock: []
    }

    componentDidMount() {
        const { detailStock } = this.props.stock
        if (detailStock.length <= 18) {
            this.setState({num: 1, dataStock: [detailStock]})
        } else if (detailStock.length > 18) {
            const temp = (detailStock - 18)/36
            const dataStock = []
            for (let i = 0; i < Math.ceil(temp) + 1; i++) {
                if (i === 0) {
                    const data = []
                    for (let j = 0; j < 18; j++) {
                        if (detailStock[j] !== undefined) {
                            data.push(detailStock[i])
                        }
                    }
                    dataStock.push(data)
                } else if (i === 1) {
                    const data = []
                    for (let j = 18; j < 54 ; j++) {
                        if (detailStock[j] !== undefined) {
                            data.push(detailStock[i])
                        }
                    }
                    dataStock.push(data)
                } else {
                    const data = []
                    for (let j = (36 * i) - 18; j < (36 * i) + 18; j++) {
                        if (detailStock[j] !== undefined) {
                            data.push(detailStock[i])
                        }
                    }
                    dataStock.push(data)
                }
            }
            this.setState({num: (Math.ceil(temp) + 1), dataStock: dataStock})
        }
    }

    render() {
        const { num, dataStock } = this.state
        const { detailStock, stockApp } = this.props.stock
        return (
            <PDFDownloadLink className="btnDownloadForm" document={
                <Document>
                    <Page size="A4" style={styles.page} orientation="landscape">
                        <View>
                            <Text style={[styles.titleModDis, styles.fontTit]}>KERTAS KERJA OPNAME ASET KANTOR</Text>
                        </View>
                        <View>
                            <Text style={[styles.fontAl]}>
                            KANTOR PUSAT/CABANG     : {detailStock.length !== 0 ? detailStock[0].area : ''}
                            </Text>
                            <Text style={[styles.fontAl]}>
                            DEPO/CP                                 : {detailStock.length !== 0 ? detailStock[0].area : ''}
                            </Text>
                            <Text style={[styles.fontAl]}>
                            OPNAME PER TANGGAL       : {detailStock.length !== 0 ? moment(detailStock[0].createdAt).format('DD MMMM YYYY') : ''}
                            </Text>
                        </View>
                        {dataStock.map(item => {
                            return (
                                <Table
                                    data={item} style={styles.marbot}
                                >
                                    <TableHeader style={styles.header}>
                                        <TableCell style={[styles.font, styles.headerText, styles.number]}  weighting={0.1}>No</TableCell>
                                        <TableCell style={[styles.font, styles.padingTbl, styles.headerText]} weighting={0.2}>NO. ASET</TableCell>
                                        <TableCell style={[styles.font, styles.padingTbl, styles.headerText]} weighting={0.4} >DESKRIPSI</TableCell>
                                        <TableCell style={[styles.font, styles.padingTbl, styles.headerText]} weighting={0.2} >MERK</TableCell>
                                        <TableCell style={[styles.font, styles.padingTbl, styles.headerText]} weighting={0.2}>SATUAN</TableCell>
                                        <TableCell style={[styles.font, styles.padingTbl, styles.headerText]} weighting={0.1}>UNIT</TableCell>
                                        <TableCell style={[styles.font, styles.padingTbl, styles.headerText]} weighting={0.2}>STATUS FISIK</TableCell>
                                        <TableCell style={[styles.font, styles.padingTbl, styles.headerText]} weighting={0.2}>KONDISI</TableCell>
                                        <TableCell style={[styles.font, styles.padingTbl, styles.headerText]} weighting={0.2}>LOKASI</TableCell>
                                        <TableCell style={[styles.font, styles.padingTbl, styles.headerText]} weighting={0.2}>GROUPING</TableCell>
                                        <TableCell style={[styles.font, styles.padingTbl, styles.headerText]} weighting={0.2}>KETERANGAN</TableCell>
                                    </TableHeader>
                                    <TableBody>
                                        <DataTableCell style={[styles.font, styles.number]} weighting={0.1} getContent={(r) => detailStock.indexOf(r) + 1}/>
                                        <DataTableCell style={[styles.font, styles.padingTbl]} weighting={0.2} getContent={(r) => r.no_asset}/>
                                        <DataTableCell style={[styles.font, styles.padingTbl]} weighting={0.4} getContent={(r) => r.deskripsi}/>
                                        <DataTableCell style={[styles.font, styles.padingTbl]} weighting={0.2} getContent={(r) => r.merk}/>
                                        <DataTableCell style={[styles.font, styles.padingTbl]} weighting={0.2} getContent={(r) => r.satuan}/>
                                        <DataTableCell style={[styles.font, styles.padingTbl]} weighting={0.1} getContent={(r) => r.unit}/>
                                        <DataTableCell style={[styles.font, styles.padingTbl]} weighting={0.2} getContent={(r) => r.status_fisik}/>
                                        <DataTableCell style={[styles.font, styles.padingTbl]} weighting={0.2} getContent={(r) => r.kondisi}/>
                                        <DataTableCell style={[styles.font, styles.padingTbl]} weighting={0.2} getContent={(r) => r.lokasi}/>
                                        <DataTableCell style={[styles.font, styles.padingTbl]} weighting={0.2} getContent={(r) => r.grouping}/>
                                        <DataTableCell style={[styles.font, styles.padingTbl]} weighting={0.2} getContent={(r) => r.keterangan}/>
                                    </TableBody>
                                </Table>
                            )
                        })}
                        <Text break={detailStock.length <= 13 ? false : detailStock.length > 13 && detailStock.length <= 18 ? true : (detailStock.length - 18) % 36 >= 1 && (detailStock.length - 18) % 36 <= 27 ? false : true} style={[styles.marbotT, styles.font, styles.martop]}>.</Text>
                        <Table data={[{id: 1}]}>
                            <TableHeader>
                                <TableCell style={styles.fontTtdHead}>Dibuat Oleh,</TableCell>
                                <TableCell style={styles.fontTtdHead}>Diperiksa Oleh,</TableCell>
                                <TableCell style={styles.fontTtdHead}>Disetujui Oleh,</TableCell>
                            </TableHeader>
                        </Table>
                        <Table data={[{id: 1}]}>
                            <TableHeader style={styles.header}>
                                {stockApp.pembuat !== undefined && stockApp.pembuat.map(item => {
                                    return (
                                        <TableCell style={styles.fontTtd}>{item.nama === null ? "-" : item.status === 0 ? 'Reject' + '\n\n' + item.nama : moment(item.updatedAt).format('LL') + '\n\n' + item.nama}</TableCell>
                                    )
                                })}
                                {stockApp.pemeriksa !== undefined && stockApp.pemeriksa.map(item => {
                                    return (
                                        <TableCell style={styles.fontTtd}>{item.nama === null ? "-" : item.status === 0 ? 'Reject' + '\n\n' + item.nama : moment(item.updatedAt).format('LL') + '\n\n' + item.nama}</TableCell>
                                    )
                                })}
                                {stockApp.penyetuju !== undefined && stockApp.penyetuju.map(item => {
                                    return (
                                        <TableCell style={styles.fontTtd}>{item.nama === null ? "-" : item.status === 0 ? 'Reject' + '\n\n' + item.nama : moment(item.updatedAt).format('LL') + '\n\n' + item.nama}</TableCell>
                                    )
                                })}
                            </TableHeader>
                            <TableBody>
                                {stockApp.pembuat !== undefined && stockApp.pembuat.map(item => {
                                    return (
                                        <DataTableCell style={styles.fontTtd} getContent={(r) => item.jabatan === null ? "-" : item.jabatan}/>
                                    )
                                })}
                                {stockApp.pemeriksa !== undefined && stockApp.pemeriksa.map(item => {
                                    return (
                                        <DataTableCell style={styles.fontTtd} getContent={(r) => item.jabatan === null ? "-" : item.jabatan}/>
                                    )
                                })}
                                {stockApp.penyetuju !== undefined && stockApp.penyetuju.map(item => {
                                    return (
                                        <DataTableCell style={styles.fontTtd} getContent={(r) => item.jabatan === null ? "-" : item.jabatan}/>
                                    )
                                })}
                            </TableBody>
                        </Table>
                        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                            `${pageNumber} / ${totalPages}`
                        )} fixed />
                    </Page>
                </Document>
                } 
                fileName={`Form Stock Opname ${detailStock[0] !== undefined ? detailStock[0].no_stock : ''}.pdf`}>
                {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download Form')}
            </PDFDownloadLink>
        )
    }
}

const mapStateToProps = state => ({
    setuju: state.setuju,
    mutasi: state.mutasi,
    stock: state.stock
})

const mapDispatchToProps = {
    getSetDisposal: setuju.getSetDisposal,
    getApproveSetDisposal: setuju.getApproveSetDisposal,
    approveSetDisposal: setuju.approveSetDisposal,
    rejectSetDisposal: setuju.rejectSetDisposal
}

export default connect(mapStateToProps, mapDispatchToProps)(TablePdf)

const styles = StyleSheet.create({
    page: {
      backgroundColor: '#FFFFFF',
      paddingTop: '20px',
      paddingLeft: '10px',
      paddingRight: '10px',
      paddingBottom: '30px'
    },
    alMut: {
        display: 'flex',
        flexDirection: 'row',
        borderRadius: '10px',
        marginBottom: '20px'
    },
    alasanMut: {
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: '#9b9b9b',
        width: '25%',
        padding: '2%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '10px'
    },
    titAlasan: {
        fontWeight: 'bold',
        textDecoration: 'underline',
        fontSize: '12px',
        marginBottom: '10px'
    },
    fontAl: {
        fontSize: '9px',
        marginBottom: '10px'
    },
    img: {
        width: 'auto',
        height: '50px'
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1
    },
    padingTbl: {
        padding: 2,
    },
    secNav: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: '20px'
    },
    modalDis: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    titleModDis: {
        fontWeight: 'bold'
    },
    marbot: {
        marginBottom: '7px',
    },
    martop: {
        marginTop: "10px"
    },
    font: {
        fontSize: '9px'
    },
    fontTit: {
        fontSize: '11px',
        marginBottom: '20px'
    },
    number: {
        textAlign: 'center',
        paddingTop: 2
    },
    marbotT: {
        marginBottom: '8px',
    },
    table: {
        fontSize: 10,
        width: '100%',
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignContent: "stretch",
        flexWrap: "nowrap",
        alignItems: "stretch"
      },
      fontTtd: {
        fontSize: '9px',
        textAlign: 'center',
        textTransform: 'uppercase',
        padding: 5
    },
    fontTtdHead: {
        fontSize: '9px',
        textAlign: 'center',
        textTransform: 'capitalize',
        padding: 5
    },
      tableTtd: {
        fontSize: 10,
        width: '20%',
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignContent: "stretch",
        flexWrap: "nowrap",
        alignItems: "stretch"
      },
      footTtd: {
        display: 'flex',
        flexDirection: 'row'
      },
      row: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignContent: "stretch",
        flexWrap: "nowrap",
        alignItems: "stretch",
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: 35,
        marginBottom: 0,
      },
      rowTtdHead: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignContent: "stretch",
        flexWrap: "nowrap",
        alignItems: "stretch",
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: 35,
        marginBottom: 0,
      },
      cell: {
        borderColor: "gray",
        borderStyle: "solid",
        borderLeftWidth: 0.5,
        borderRightWidth: 0.5,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: "auto",
        alignSelf: "stretch",
        padding: 8,
        paddingBottom: 10
      },
      cellrow: {
        borderColor: "black",
        borderStyle: "solid",
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderBottomWidth: 0,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: "auto",
        alignSelf: "center",
        textAlign: 'center',
        padding: 14,
        marginBottom: 2
      },
      cell2: {
        borderColor: "black",
        borderStyle: "solid",
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderBottomWidth: 1,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: "auto",
        alignSelf: "stretch",
        padding: 0,
        marginBottom: 2
      },
      cellTtdHead: {
        borderColor: "black",
        borderStyle: "solid",
        borderBottomWidth: 0,
        borderLeftWidth: 1,
        borderRightWidth: 0,
        borderTopWidth: 0,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: "auto",
        alignSelf: "center",
        padding: 14,
        textAlign: 'center',
      },
      cellTtdBody: {
        borderColor: "black",
        borderStyle: "solid",
        borderBottomWidth: 0,
        borderLeftWidth: 1,
        borderRightWidth: 0,
        borderTopWidth: 1,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: "auto",
        alignSelf: "center",
        padding: 8,
        textAlign: 'center'
      },
      header: {
        backgroundColor: "gray",
        color: "gray"
      },
      headerTtd: {
          backgroundColor: "#FFFFFF"
      },
      headerText: {
        fontWeight: "bold",
        color: "black",
        backgroundColor: 'gray',
        textAlign: 'center'
      },
      headerTxt: {
        fontSize: 11,
        fontWeight: "bold",
        color: "black",
        textAlign: 'center'
      },
      tableText: {
        margin: 10,
        fontSize: 10,
        color: 'neutralDark'
      },
      pageNumber: {
        position: 'absolute',
        fontSize: 10,
        bottom: 10,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'grey',
        marginTop: '10px'
      },
})
