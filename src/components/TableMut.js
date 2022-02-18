import React, { Component } from 'react'
import { Table, TableBody, TableCell, TableHeader, DataTableCell } from '@david.kucsai/react-pdf-table'
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import setuju from '../redux/actions/setuju'
import mutasi from '../redux/actions/mutasi'
import {connect} from 'react-redux'
import moment from 'moment'
import logo from '../assets/img/logo.png'

class TablePdf extends Component {

    render() {
        const {mutApp, detailMut} = this.props.mutasi
        return (
            <PDFDownloadLink className="btnDownloadForm" document={
                <Document>
                    <Page size="A4" style={styles.page} orientation="landscape">
                        <View style={styles.secNav}>
                            <Image src={logo} style={styles.img} />
                            <View style={styles.modalDis}>
                                <Text style={[styles.titleModDis, styles.fontTit]}>FORM MUTASI ASSET / INVENTARIS</Text>
                            </View>
                            <View>
                                <Text style={[styles.font]}>
                                No                                : {detailMut.length !== 0 ? detailMut[0].no_mutasi : ''}
                                </Text>
                                <Text style={[styles.font]}>
                                Tanggal Form               : {detailMut.length !== 0 ? moment(detailMut[0].createdAt).format('DD MMMM YYYY') : ''}
                                </Text>
                                <Text style={[styles.font]}>
                                Tanggal Mutasi Fisik    : {detailMut.length !== 0 ? moment(detailMut[0].tgl_mutasifisik).format('DD MMMM YYYY') : ''}
                                </Text>
                                <Text style={[styles.font]}>
                                Depo                            : {detailMut.length !== 0 ? detailMut[0].area : ''}
                                </Text>
                            </View>
                        </View>
                        <Table
                            data={detailMut} style={styles.marbot}
                        >
                            <TableHeader style={styles.header}>
                                <TableCell style={[styles.font, styles.headerText, styles.number]}  weighting={0.1}>No</TableCell>
                                <TableCell style={[styles.font, styles.padingTbl, styles.headerText]} weighting={0.2}>Nomor Aset</TableCell>
                                <TableCell style={[styles.font, styles.padingTbl, styles.headerText]} weighting={0.4} >Nama Asset</TableCell>
                                <TableCell style={[styles.font, styles.padingTbl, styles.headerText]} weighting={0.4} >Merk/Type</TableCell>
                                <TableCell style={[styles.font, styles.padingTbl, styles.headerText]} weighting={0.1}>Kategori</TableCell>
                                <TableCell style={[styles.font, styles.padingTbl, styles.headerText]} weighting={0.2}>Cabang/Depo</TableCell>
                                <TableCell style={[styles.font, styles.padingTbl, styles.headerText]} weighting={0.2}>Cost Center</TableCell>
                                <TableCell style={[styles.font, styles.padingTbl, styles.headerText]} weighting={0.2}>{"Cabang/Depo" + "\n" + "Penerima"}</TableCell>
                                <TableCell style={[styles.font, styles.padingTbl, styles.headerText]} weighting={0.2}>{"Cost Center" + "\n" + "Penerima"}</TableCell>
                            </TableHeader>
                            <TableBody>
                                <DataTableCell style={[styles.font, styles.number]} weighting={0.1} getContent={(r) => detailMut.indexOf(r) + 1}/>
                                <DataTableCell style={[styles.font, styles.padingTbl]} weighting={0.2} getContent={(r) => r.no_asset}/>
                                <DataTableCell style={[styles.font, styles.padingTbl]} weighting={0.4} getContent={(r) => r.nama_asset}/>
                                <DataTableCell style={[styles.font, styles.padingTbl]} weighting={0.4} getContent={(r) => r.merk}/>
                                <DataTableCell style={[styles.font, styles.padingTbl]} weighting={0.1} getContent={(r) => r.kategori}/>
                                <DataTableCell style={[styles.font, styles.padingTbl]} weighting={0.2} getContent={(r) => r.area}/>
                                <DataTableCell style={[styles.font, styles.padingTbl]} weighting={0.2} getContent={(r) => r.cost_center}/>
                                <DataTableCell style={[styles.font, styles.padingTbl]} weighting={0.2} getContent={(r) => r.area_rec}/>
                                <DataTableCell style={[styles.font, styles.padingTbl]} weighting={0.2} getContent={(r) => r.cost_center_rec}/>
                            </TableBody>
                        </Table>
                        <Text break={detailMut.length <= 18 ? false : detailMut.length > 18 && detailMut.length <= 26 ? true : (detailMut.length - 26) % 36 >= 1 && (detailMut.length - 26) % 36 <= 27 ? false : true} style={[styles.marbotT, styles.font, styles.martop]}>.</Text>
                        <View style={styles.alMut}>
                            <View style={styles.alasanMut}>
                                <Text style={styles.titAlasan}>Alasan Mutasi :</Text>
                                <Text style={styles.fontAl}>{detailMut.length !== 0 ? detailMut[0].alasan : ''}</Text>
                            </View>
                        </View>
                        <Table data={[{id: 1}]}>
                            {detailMut.find(({kategori}) => kategori === 'IT') ? (
                                <TableHeader>
                                    <TableCell style={styles.fontTtdHead}  weighting={0.19}>Dibuat Oleh,</TableCell>
                                    <TableCell style={styles.fontTtdHead}  weighting={0.19}>Diterima Oleh,</TableCell>
                                    <TableCell style={styles.fontTtdHead} weighting={0.61}>Diperiksa Oleh,</TableCell>
                                    <TableCell style={styles.fontTtdHead} weighting={0.4}>Disetujui Oleh,</TableCell>
                                </TableHeader>
                            ) : (
                            <TableHeader>
                                <TableCell style={styles.fontTtdHead}  weighting={0.24}>Dibuat Oleh,</TableCell>
                                <TableCell style={styles.fontTtdHead}  weighting={0.24}>Diterima Oleh,</TableCell>
                                <TableCell style={styles.fontTtdHead} weighting={0.5}>Diperiksa Oleh,</TableCell>
                                <TableCell style={styles.fontTtdHead} weighting={0.5}>Disetujui Oleh,</TableCell>
                            </TableHeader>
                            )}
                        </Table>
                        <Table data={[{id: 1}]}>
                            <TableHeader style={styles.header}>
                                {mutApp.pembuat !== undefined && mutApp.pembuat.map(item => {
                                    return (
                                        <TableCell style={styles.fontTtd}>{item.nama === null ? "-" : item.status === 0 ? 'Reject' + '\n\n' + item.nama : moment(item.updatedAt).format('LL') + '\n\n' + item.nama}</TableCell>
                                    )
                                })}
                                {mutApp.penerima !== undefined && mutApp.penerima.map(item => {
                                    return (
                                        <TableCell style={styles.fontTtd}>{item.nama === null ? "-" : item.status === 0 ? 'Reject' + '\n\n' + item.nama : moment(item.updatedAt).format('LL') + '\n\n' + item.nama}</TableCell>
                                    )
                                })}
                                {mutApp.pemeriksa !== undefined && mutApp.pemeriksa.map(item => {
                                    return (
                                        <TableCell style={styles.fontTtd}>{item.nama === null ? "-" : item.status === 0 ? 'Reject' + '\n\n' + item.nama : moment(item.updatedAt).format('LL') + '\n\n' + item.nama}</TableCell>
                                    )
                                })}
                                {mutApp.penyetuju !== undefined && mutApp.penyetuju.map(item => {
                                    return (
                                        <TableCell style={styles.fontTtd}>{item.nama === null ? "-" : item.status === 0 ? 'Reject' + '\n\n' + item.nama : moment(item.updatedAt).format('LL') + '\n\n' + item.nama}</TableCell>
                                    )
                                })}
                            </TableHeader>
                            <TableBody>
                                {mutApp.pembuat !== undefined && mutApp.pembuat.map(item => {
                                    return (
                                        <DataTableCell style={styles.fontTtd} getContent={(r) => item.jabatan === null ? "-" : item.jabatan}/>
                                    )
                                })}
                                {mutApp.penerima !== undefined && mutApp.penerima.map(item => {
                                    return (
                                        <DataTableCell style={styles.fontTtd} getContent={(r) => item.jabatan === null ? "-" : item.jabatan}/>
                                    )
                                })}
                                {mutApp.pemeriksa !== undefined && mutApp.pemeriksa.map(item => {
                                    return (
                                        <DataTableCell style={styles.fontTtd} getContent={(r) => item.jabatan === null ? "-" : item.jabatan}/>
                                    )
                                })}
                                {mutApp.penyetuju !== undefined && mutApp.penyetuju.map(item => {
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
                fileName={`Form Persetujuan Mutasi ${detailMut[0] !== undefined ? detailMut[0].no_mutasi : ''}.pdf`}>
                {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download Form')}
            </PDFDownloadLink>
        )
    }
}

const mapStateToProps = state => ({
    setuju: state.setuju,
    mutasi: state.mutasi
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
        fontSize: '11px'
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
