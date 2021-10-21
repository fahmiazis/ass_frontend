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

    render() {
        const {dataDis, disApp} = this.props.disposal
        const detailDis = this.props.detailDis
        console.log(detailDis)
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
                            {detailDis[0] === undefined ? (
                                <Text style={[styles.font]}>
                                    Hal     : Pengajuan Disposal Asset
                                </Text>
                            ) :
                            detailDis[0].status_depo === "Cabang Scylla" || detailDis[0].status_depo === "Cabang SAP" ? (
                                <Text style={[styles.font]}>
                                    Hal         : Pengajuan Disposal Asset
                                </Text>
                            ) : (
                                <Text style={[styles.font]}>
                                    Hal     : Pengajuan Disposal Asset
                                </Text>
                            )}
                            <Text style={[styles.font]}>
                                {detailDis[0] === undefined ? "" :
                                detailDis[0].status_depo === "Cabang Scylla" || detailDis[0].status_depo === "Cabang SAP" ? "Cabang" : "Depo"}  : {detailDis[0] !== undefined && detailDis[0].area} - {detailDis[0]!== undefined && detailDis[0].cost_center}
                            </Text>
                        </View>
                        <Text style={styles.font}>Kepada Yth.</Text>
                        <Text style={[styles.font]}>Bpk/Ibu Pimpinan</Text>
                        <Text style={[styles.marbotT, styles.font]}>Di tempat</Text>
                        <Text style={[styles.font]}>Dengan Hormat,</Text>
                        <Text style={[styles.marbotT, styles.font]}>Dengan surat ini kami mengajukan permohonan disposal aset dengan perincian sbb :</Text>
                        <Table
                            data={detailDis} style={styles.marbot}
                        >
                            <TableHeader style={styles.header}>
                                <TableCell style={[styles.font, styles.headerText, styles.number]} weighting={0.1}>No</TableCell>
                                <TableCell style={[styles.font, styles.padingTbl, styles.headerText]} weighting={0.2}>Nomor Aset</TableCell>
                                <TableCell style={[styles.font, styles.padingTbl, styles.headerText]} weighting={1}>Nama Barang</TableCell>
                                <TableCell style={[styles.font, styles.padingTbl, styles.headerText]} weighting={0.3}>Merk/Type</TableCell>
                                <TableCell style={[styles.font, styles.padingTbl, styles.headerText]} weighting={0.2}>Kategori</TableCell>
                                <TableCell style={[styles.font, styles.padingTbl, styles.headerText]} weighting={0.2}>Nilai Buku</TableCell>
                                <TableCell style={[styles.font, styles.padingTbl, styles.headerText]} weighting={0.2}>Nilai Jual</TableCell>
                                <TableCell style={[styles.font, styles.padingTbl, styles.headerText]} weighting={1}>Keterangan</TableCell>
                            </TableHeader>
                            <TableBody>
                                <DataTableCell style={[styles.font, styles.number]} weighting={0.1} getContent={(r) => detailDis.indexOf(r) + 1}/>
                                <DataTableCell style={[styles.font, styles.padingTbl]} weighting={0.2} getContent={(r) => r.no_asset}/>
                                <DataTableCell style={[styles.font, styles.padingTbl]} weighting={1} getContent={(r) => r.nama_asset}/>
                                <DataTableCell style={[styles.font, styles.padingTbl]} weighting={0.3} getContent={(r) => r.merk}/>
                                <DataTableCell style={[styles.font, styles.padingTbl]} weighting={0.2} getContent={(r) => r.kategori}/>
                                <DataTableCell style={[styles.font, styles.padingTbl]} weighting={0.2} getContent={(r) => r.nilai_buku === undefined || r.nilai_buku === null ? r.nilai_buku : r.nilai_buku.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}/>
                                <DataTableCell style={[styles.font, styles.padingTbl]} weighting={0.2} getContent={(r) => r.nilai_jual === undefined || r.nilai_jual === null ? r.nilai_jual : r.nilai_jual.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}/>
                                <DataTableCell style={[styles.font, styles.padingTbl]} weighting={1} getContent={(r) => r.keterangan}/>
                            </TableBody>
                        </Table>
                        <Text break={detailDis.length <= 18 ? false : detailDis.length > 18 && detailDis.length <= 26 ? true : (detailDis.length - 26) % 36 >= 1 && (detailDis.length - 26) % 36 <= 27 ? false : true} style={[styles.marbotT, styles.font, styles.martop]}>Demikian hal yang dapat kami sampaikan perihal persetujuan disposal aset, atas perhatiannya kami mengucapkan terima kasih.</Text>
                        <Table data={[{id: 1}]}>
                            {detailDis.find(({kategori}) => kategori === 'IT') ? (
                                <TableHeader>
                                    <TableCell style={styles.fontTtdHead}  weighting={0.228}>Dibuat Oleh,</TableCell>
                                    <TableCell style={styles.fontTtdHead} >Diperiksa Oleh,</TableCell>
                                    <TableCell style={styles.fontTtdHead} >Disetujui Oleh,</TableCell>
                                </TableHeader>
                            ) : (
                                <TableHeader>
                                    <TableCell style={styles.fontTtdHead}  weighting={0.16}>Dibuat Oleh,</TableCell>
                                    <TableCell style={styles.fontTtdHead} weighting={0.52}>Diperiksa Oleh,</TableCell>
                                    <TableCell style={styles.fontTtdHead} weighting={0.7}>Disetujui Oleh,</TableCell>
                                </TableHeader>
                            )}
                        </Table>
                        <Table data={[{id: 1}]}>
                            <TableHeader style={styles.header}>
                                {disApp.pembuat !== undefined && disApp.pembuat.map(item => {
                                    return (
                                        <TableCell style={styles.fontTtd}>{item.nama === null ? "-" : item.status === 0 ? 'Reject' + '\n\n' + item.nama : moment(item.updatedAt).format('LL') + '\n\n' + item.nama}</TableCell>
                                    )
                                })}
                                {disApp.pemeriksa !== undefined && disApp.pemeriksa.map(item => {
                                    return (
                                        item.jabatan === 'asset' ? (
                                            null
                                        ) : (
                                            <TableCell style={styles.fontTtd}>{item.nama === null ? "-" : item.status === 0 ? 'Reject' + '\n\n' + item.nama : moment(item.updatedAt).format('LL') + '\n\n' + item.nama}</TableCell>
                                        )
                                    )
                                })}
                                {disApp.penyetuju !== undefined && disApp.penyetuju.map(item => {
                                    return (
                                        <TableCell style={styles.fontTtd}>{item.nama === null ? "-" : item.status === 0 ? 'Reject' + '\n\n' + item.nama : moment(item.updatedAt).format('LL') + '\n\n' + item.nama}</TableCell>
                                    )
                                })}
                            </TableHeader>
                            <TableBody>
                                {disApp.pembuat !== undefined && disApp.pembuat.map(item => {
                                    return (
                                        <DataTableCell style={styles.fontTtd} getContent={(r) => item.jabatan === null ? "-" : item.jabatan}/>
                                    )
                                })}
                                {disApp.pemeriksa !== undefined && disApp.pemeriksa.map(item => {
                                    return (
                                        item.jabatan === 'asset' ? (
                                            null
                                        ) : (
                                            <DataTableCell style={styles.fontTtd} getContent={(r) => item.jabatan === null ? "-" : item.jabatan}/>
                                        )
                                    )
                                })}
                                {disApp.penyetuju !== undefined && disApp.penyetuju.map(item => {
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
      paddingRight: '10px',
      paddingBottom: '30px'
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1
    },
    padingTbl: {
        padding: 2,
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
        marginBottom: '7px',
    },
    martop: {
        marginTop: "10px"
    },
    font: {
        fontSize: '9px'
    },
    fontTit: {
        fontSize: '11px'
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
    marbotT: {
        marginBottom: '8px',
    },
    number: {
        textAlign: 'center',
        paddingTop: 2
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
        borderBottomWidth: 1
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
        fontWeight: "bold",
        color: "black",
        backgroundColor: 'gray',
        textAlign: 'center'
      },
      headerTxt: {
        fontSize: '9px',
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
