import React, { Component } from 'react'
import { Table, TableBody, TableCell, TableHeader, DataTableCell } from '@david.kucsai/react-pdf-table'
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import setuju from '../redux/actions/setuju'
import {connect} from 'react-redux'
import moment from 'moment'

class TablePdf extends Component {

    render() {
        const {disApp} = this.props.setuju
        const dataDis = this.props.dataDis
        return (
            <PDFDownloadLink className="btnDownloadForm" document={
                <Document>
                    <Page size="A4" style={styles.page} orientation="landscape">
                        <Text style={styles.font}>PT. Pinus Merah Abadi</Text>
                        <View style={styles.modalDis}>
                            <Text style={[styles.titleModDis, styles.fontTit]}>Persetujuan Disposal Asset</Text>
                        </View>
                        <View style={styles.marbot}><Text style={styles.font}>Bandung, {moment().format('DD MMMM YYYY ')}</Text></View>
                        <View style={styles.marbotT}>
                            <Text style={[styles.font]}>
                            Hal : Persetujuan Disposal Asset
                            </Text>
                        </View>
                        <Text style={styles.font}>Kepada Yth.</Text>
                        <Text style={[styles.marbotT, styles.font]}>Bpk. Erwin Lesmana</Text>
                        <Text style={[styles.marbotT, styles.font]}>Dengan Hormat,</Text>
                        <Text style={styles.font}>Sehubungan dengan surat permohonan disposal aset area PMA terlampir</Text>
                        <Text style={[styles.marbotT, styles.font]}>Dengan ini kami mohon persetujuan untuk melakukan disposal aset dengan perincian sbb :</Text>
                        <Table
                            data={dataDis} style={styles.marbot}
                        >
                            <TableHeader style={styles.header}>
                                <TableCell style={[styles.font, styles.headerText, styles.number]}  weighting={0.1}>No</TableCell>
                                <TableCell style={[styles.font, styles.padingTbl, styles.headerText]} weighting={0.2}>Nomor Aset</TableCell>
                                <TableCell style={[styles.font, styles.padingTbl, styles.headerText]} weighting={0.4} >{"Area" + "\n" + "(Cabang/Depo/CP)"}</TableCell>
                                <TableCell style={[styles.font, styles.padingTbl, styles.headerText]} weighting={1} >Nama Barang</TableCell>
                                <TableCell style={[styles.font, styles.padingTbl, styles.headerText]} weighting={0.2}>Nilai Buku</TableCell>
                                <TableCell style={[styles.font, styles.padingTbl, styles.headerText]} weighting={0.2}>Nilai Jual</TableCell>
                                <TableCell style={[styles.font, styles.padingTbl, styles.headerText]} weighting={0.2}>{"Tanggal" + "\n" + "Perolehan"}</TableCell>
                                <TableCell style={[styles.font, styles.padingTbl, styles.headerText]} weighting={1} >Keterangan</TableCell>
                            </TableHeader>
                            <TableBody>
                                <DataTableCell style={[styles.font, styles.number]} weighting={0.1} getContent={(r) => dataDis.indexOf(r) + 1}/>
                                <DataTableCell style={[styles.font, styles.padingTbl]} weighting={0.2} getContent={(r) => r.no_asset}/>
                                <DataTableCell style={[styles.font, styles.padingTbl]} weighting={0.4} getContent={(r) => r.area}/>
                                <DataTableCell style={[styles.font, styles.padingTbl]} weighting={1} getContent={(r) => r.nama_asset}/>
                                <DataTableCell style={[styles.font, styles.padingTbl]} weighting={0.2} getContent={(r) => r.nilai_buku === undefined || r.nilai_buku === null ? r.nilai_buku : r.nilai_buku.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}/>
                                <DataTableCell style={[styles.font, styles.padingTbl]} weighting={0.2} getContent={(r) => r.nilai_jual === undefined || r.nilai_jual === null ? r.nilai_jual : r.nilai_jual.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}/>
                                <DataTableCell style={[styles.font, styles.padingTbl]} weighting={0.2} getContent={(r) => moment(r.dataAsset.tanggal).format('DD/MM/YYYY')}/>
                                <DataTableCell style={[styles.font, styles.padingTbl]} weighting={1} getContent={(r) => r.keterangan}/>
                            </TableBody>
                        </Table>
                        <Text break={dataDis.length <= 18 ? false : dataDis.length > 18 && dataDis.length <= 26 ? true : (dataDis.length - 26) % 36 >= 1 && (dataDis.length - 26) % 36 <= 27 ? false : true} style={[styles.marbotT, styles.font, styles.martop]}>Demikian hal yang dapat kami sampaikan perihal persetujuan disposal aset, atas perhatiannya kami mengucapkan terima kasih.</Text>
                        <Table data={[{id: 1}]}>
                            <TableHeader>
                                <TableCell style={styles.fontTtdHead}  weighting={0.321}>Diajukan Oleh,</TableCell>
                                <TableCell style={styles.fontTtdHead} >Disetujui Oleh,</TableCell>
                            </TableHeader>
                        </Table>
                        <Table data={[{id: 1}]}>
                            <TableHeader style={styles.header}>
                                {disApp.pembuat !== undefined && disApp.pembuat.map(item => {
                                    return (
                                        <TableCell style={styles.fontTtd}>{item.nama === null ? "" : item.status === 0 ? 'Reject' + '\n\n' + item.nama : moment(item.updatedAt).format('LL') + '\n\n' + item.nama}</TableCell>
                                    )
                                })}
                                {disApp.penyetuju !== undefined && disApp.penyetuju.map(item => {
                                    return (
                                        item.jabatan === 'HOC Funding And Tax' ? null :
                                        <TableCell style={styles.fontTtd}>{item.nama === null ? "" : item.status === 0 ? 'Reject' + '\n\n' + item.nama : moment(item.updatedAt).format('LL') + '\n\n' + item.nama}</TableCell>
                                    )
                                })}
                            </TableHeader>
                            <TableBody>
                                {disApp.pembuat !== undefined && disApp.pembuat.map(item => {
                                    return (
                                        <DataTableCell style={styles.fontTtd} getContent={(r) => item.jabatan === null ? "" : item.jabatan === 'NFAM' ? 'Head of Finance Accounting PMA' : item.jabatan}/>
                                    )
                                })}
                                {disApp.penyetuju !== undefined && disApp.penyetuju.map(item => {
                                    return (
                                        item.jabatan === 'HOC Funding And Tax' ? null :
                                        <DataTableCell style={styles.fontTtd} getContent={(r) => item.jabatan === null ? "" : item.jabatan}/>
                                    )
                                })}
                            </TableBody>
                        </Table>
                        {/* <View style={styles.footTtd}>
                            <View style={styles.tableTtd}>
                                <View style={[styles.row, styles.headerTtd]}>
                                    <Text style={[styles.cellrow, styles.headerTxt]}>Diajukan oleh,</Text>
                                </View>
                                <View style={[styles.row, styles.headerTtd]}>
                                    <View style={[styles.cell2]}>
                                        <View style={styles.table}>
                                            <View style={[styles.rowTtdHead]}>
                                                {disApp.pembuat !== undefined && disApp.pembuat.map(item => {
                                                    return (
                                                        <Text style={[styles.cellTtdHead]}>
                                                            {item.nama === null ? "" : item.nama}
                                                        </Text>
                                                    )
                                                })}
                                            </View>
                                            <View style={[styles.row]}>
                                                {disApp.pembuat !== undefined && disApp.pembuat.map(item => {
                                                    return (
                                                        <Text style={[styles.cellTtdBody]}>{item.jabatan === null ? "" : item.jabatan}</Text>
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
                                                            {item.nama === null ? "" : item.nama}
                                                    </Text>     
                                                )
                                            })}
                                            </View>
                                            <View style={[styles.row]}>
                                                {disApp.penyetuju !== undefined && disApp.penyetuju.map(item => {
                                                    return (
                                                        <Text style={[styles.cellTtdBody]}>{item.jabatan === null ? "" : item.jabatan}</Text>
                                                    )
                                                })}
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View> */}
                        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                            `${pageNumber} / ${totalPages}`
                        )} fixed />
                    </Page>
                </Document>
                } 
                fileName={`Form Persetujuan Disposal ${dataDis[0] !== undefined ? 'D' + dataDis[0].status_app : ''}.pdf`}>
                {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download Form')}
            </PDFDownloadLink>
        )
    }
}

const mapStateToProps = state => ({
    setuju: state.setuju
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
