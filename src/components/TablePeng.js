import React, { Component } from 'react'
import { Table, TableBody, TableCell, TableHeader, DataTableCell } from '@david.kucsai/react-pdf-table'
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import disposal from '../redux/actions/disposal'
import setuju from '../redux/actions/setuju'
import {connect} from 'react-redux'
import moment from 'moment'

class TablePdf extends Component {

    state = {
        detailDis: []
    }

    componentDidMount(){

    }

    render() {
        const {dataDis, disApp} = this.props.disposal
        const detailDis = this.props.detailDis

        return (
            <PDFDownloadLink className="btnDownloadForm" document={
                <Document>
                    <Page size="A4" style={styles.page} orientation="landscape">
                        <Text style={styles.font}>PT. Pinus Merah Abadi</Text>
                        <View style={styles.modalDis}>
                            <Text style={[styles.titleModDis, styles.fontTit]}>Form Pengajuan Disposal Asset</Text>
                        </View>
                        <View style={styles.marbot}><Text style={styles.font}>{detailDis[0] !== undefined && detailDis[0].area}, {moment(detailDis[0] !== undefined && detailDis[0].createdAt).format('DD MMMM YYYY ')}</Text></View>
                        <View style={styles.marbotT}>
                            <Text style={[styles.font]}>
                                Hal         : Pengajuan Disposal Asset
                            </Text>
                            <Text style={[styles.font]}>
                                {detailDis[0] === undefined ? "" :
                                detailDis[0].status_depo === "Cabang Scylla" || detailDis[0].status_depo === "Cabang SAP" ? "Cabang" : "Depo"}  : {detailDis[0] !== undefined && detailDis[0].area}
                            </Text>
                        </View>
                        <Text style={styles.font}>Kepada Yth.</Text>
                        <Text style={[styles.font]}>Bpk/Ibu Pimpinan</Text>
                        <Text style={[styles.marbotT, styles.font]}>Di tempat</Text>
                        <Text style={[styles.font]}>Dengan Hormat,</Text>
                        <Text style={[styles.marbotT, styles.font]}>Dengan surat ini kami mengajukan permohonan disposal aset dengan perincian sbb :</Text>
                        <Table
                            data={this.props.detailDis} style={styles.marbot}
                        >
                            <TableHeader style={styles.header}>
                                <TableCell style={[styles.font, styles.headerText]}  weighting={0.2}>No</TableCell>
                                <TableCell style={[styles.font, styles.padingTbl, styles.headerText]} >Nomor Aset</TableCell>
                                <TableCell style={[styles.font, styles.padingTbl, styles.headerText]} >Nama Barang</TableCell>
                                <TableCell style={[styles.font, styles.padingTbl, styles.headerText]} >Merk/Type</TableCell>
                                <TableCell style={[styles.font, styles.padingTbl, styles.headerText]} >Kategori</TableCell>
                                <TableCell style={[styles.font, styles.padingTbl, styles.headerText]} >Status Depo</TableCell>
                                <TableCell style={[styles.font, styles.padingTbl, styles.headerText]} >Cost center</TableCell>
                                <TableCell style={[styles.font, styles.padingTbl, styles.headerText]} >Nilai Buku</TableCell>
                                <TableCell style={[styles.font, styles.padingTbl, styles.headerText]} >Nilai Jual</TableCell>
                                <TableCell style={[styles.font, styles.padingTbl, styles.headerText]} >Keterangan</TableCell>
                            </TableHeader>
                            <TableBody>
                                <DataTableCell style={styles.font} weighting={0.2} getContent={(r) => detailDis.indexOf(r) + 1}/>
                                <DataTableCell style={[styles.font, styles.padingTbl]} getContent={(r) => r.no_asset}/>
                                <DataTableCell style={[styles.font, styles.padingTbl]} getContent={(r) => r.nama_asset}/>
                                <DataTableCell style={[styles.font, styles.padingTbl]} getContent={(r) => r.merk}/>
                                <DataTableCell style={[styles.font, styles.padingTbl]} getContent={(r) => r.kategori}/>
                                <DataTableCell style={[styles.font, styles.padingTbl]} getContent={(r) => r.status_depo}/>
                                <DataTableCell style={[styles.font, styles.padingTbl]} getContent={(r) => r.cost_center}/>
                                <DataTableCell style={[styles.font, styles.padingTbl]} getContent={(r) => r.nilai_buku}/>
                                <DataTableCell style={[styles.font, styles.padingTbl]} getContent={(r) => r.nilai_jual}/>
                                <DataTableCell style={[styles.font, styles.padingTbl]} getContent={(r) => r.keterangan}/>
                            </TableBody>
                        </Table>
                        <Text style={[styles.marbotT, styles.font, styles.martop]}>Demikian hal yang dapat kami sampaikan perihal persetujuan disposal aset, atas perhatiannya kami mengucapkan terima kasih.</Text>
                        <View style={styles.footTtd}>
                            <View style={styles.tableTtd}>
                                <View style={[styles.row, styles.headerTtd]}>
                                    <Text style={[styles.cellrow, styles.headerTxt]}>Dibuat oleh,</Text>
                                </View>
                                <View style={[styles.row, styles.headerTtd]}>
                                    <View style={[styles.cell2]}>
                                        <View style={styles.table}>
                                            <View style={[styles.rowTtdHead]}>
                                                {disApp.pembuat !== undefined && disApp.pembuat.map(item => {
                                                    return (
                                                        <Text style={[styles.cellTtdHead]}>
                                                            {item.nama === null ? "-" : item.nama}
                                                        </Text>
                                                    )
                                                })}
                                            </View>
                                            <View style={[styles.row]}>
                                                {disApp.pembuat !== undefined && disApp.pembuat.map(item => {
                                                    return (
                                                        <Text style={[styles.cellTtdBody]}>{item.jabatan === null ? "-" : item.jabatan}</Text>
                                                    )
                                                })}
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.tablePem}>
                                <View style={[styles.row, styles.headerTtd]}>
                                    <Text style={[styles.cellrow, styles.headerTxt]}>Diperiksa oleh,</Text>
                                </View>
                                <View style={[styles.row, styles.headerTtd]}>
                                    <View style={[styles.cell2]}>
                                        <View style={styles.table}>
                                            <View style={[styles.rowTtdHead]}>
                                                {disApp.pemeriksa !== undefined && disApp.pemeriksa.map(item => {
                                                    return (
                                                        item.jabatan === 'asset' ? (
                                                            null
                                                        ) : (
                                                        <Text style={[styles.cellTtdHead]}>
                                                            {item.nama === null ? "-" : item.nama}
                                                        </Text>
                                                        )
                                                    )
                                                })}
                                            </View>
                                            <View style={[styles.row]}>
                                                {disApp.pemeriksa !== undefined && disApp.pemeriksa.map(item => {
                                                    return (
                                                        item.jabatan === 'asset' ? (
                                                            null
                                                        ) : (
                                                        <Text style={[styles.cellTtdBody]}>{item.jabatan === null ? "-" : item.jabatan}</Text>
                                                        )
                                                    )
                                                })}
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.table}>
                                <View style={[styles.row, styles.headerTtd]}>
                                    <Text style={[styles.cellrow, styles.headerTxt]}>Disetujui oleh,</Text>
                                </View>
                                <View style={[styles.row, styles.headerTtd]}>
                                    <View style={[styles.cell2]}>
                                        <View style={styles.table}>
                                            <View style={[styles.rowTtdHead]}>
                                            {disApp.penyetuju !== undefined && disApp.penyetuju.map(item => {
                                                return (
                                                    <Text style={[styles.cellTtdHead]}>
                                                            {item.nama === null ? "-" : item.nama}
                                                    </Text>     
                                                )
                                            })}
                                            </View>
                                            <View style={[styles.row]}>
                                                {disApp.penyetuju !== undefined && disApp.penyetuju.map(item => {
                                                    return (
                                                        <Text style={[styles.cellTtdBody]}>{item.jabatan === null ? "-" : item.jabatan}</Text>
                                                    )
                                                })}
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Page>
                </Document>
                } 
                fileName={`Form Pengajuan Disposal ${detailDis[0] !== undefined ? "D" + detailDis[0].no_disposal : ''}.pdf`}>
                {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download Form')}
            </PDFDownloadLink>
        )
    }
}

const mapStateToProps = state => ({
    disposal: state.disposal,
    setuju: state.setuju
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(TablePdf)

const styles = StyleSheet.create({
    page: {
      backgroundColor: '#FFFFFF',
      paddingTop: '20px',
      paddingLeft: '10px',
      paddingRight: '10px'
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1
    },
    padingTbl: {
        padding: 5,
    },
    modalDis: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    titleModDis: {
        fontWeight: 'bold',
        textDecoration: 'underline'
    },
    marbot: {
        marginBottom: '10px',
    },
    martop: {
        marginTop: "10px"
    },
    font: {
        fontSize: '11px'
    },
    fontTit: {
        fontSize: '14px'
    },
    marbotT: {
        marginBottom: '15px',
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
      tablePem: {
        fontSize: 10,
        width: '65%',
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
        borderBottomWidth: 1
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
        borderLeftWidth: 0,
        borderBottomWidth: 0,
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
        borderTopWidth: 0,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: "auto",
        alignSelf: "center",
        padding: 10,
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
        fontSize: 11,
        fontWeight: "bold",
        color: "black",
        backgroundColor: 'gray'
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
      }
})
