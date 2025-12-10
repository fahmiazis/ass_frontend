import React, { Component } from 'react'
import {Table, Input} from 'reactstrap'
import style from '../../assets/css/input.module.css'
import {connect} from 'react-redux'
import moment from 'moment'
import {Formik} from 'formik'

class TableRincian extends Component {

    state = {
        message: '',
        subject: ''
    }

    onEnter = (val) => {
        const data = {
            [val.name]: val.value
        }
        this.setState(data)
        setTimeout(() => {
            const {message, subject} = this.state
            this.props.handleData({message: message, subject: subject})
         }, 500)
    }

    componentDidMount() {
        const { draftEmail } = this.props.tempmail
        const {detailStock} = this.props.stock
        const cek = draftEmail.result
        const stat = detailStock[0].status_form
        const no = detailStock[0].no_stock
        const message = cek === undefined ? '' : `${cek.message} (${no})`
        const subject = cek === undefined ? '' : `${cek.type === 'submit' ? '' : cek.type} ${cek.menu} NO ${no}`
        this.setState({message: message, subject: subject})
        this.props.handleData({message: message, subject: subject})
    }

  render() {
    const {detailStock} = this.props.stock
    const { draftEmail } = this.props.tempmail
    const statMail = this.props.statMail || ''
    const {dataResmail} = this.props.tempmail

    const listMut = this.props.cekData !== undefined ? this.props.cekData : []
    const tipe = this.props.tipe !== undefined ? this.props.tipe : 'approve'
    const data = this.props.data
    const level = localStorage.getItem('level')
    return (
        <>
        <Formik
        initialValues={{
            message: draftEmail.result === undefined ? '' : draftEmail.result.message
        }}
        // validationSchema={tempmailSchema}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
            <>
            {statMail === 'resend' && (
                <>
                <div className='addModalMenu'>
                    <text className="col-md-3">
                        Status
                    </text>
                    <div className="col-md-9">
                        Terkirim
                    </div>
                </div>
                <div className='addModalMenu'>
                    <text className="col-md-3">
                        Jumlah terkirim
                    </text>
                    <div className="col-md-9">
                        {dataResmail !== null && dataResmail.status !== undefined ? dataResmail.status : 1}
                    </div>
                </div>
                <hr />
                </>
            )}
            <div className='addModalMenu'>
                <text className="col-md-3">
                    To
                </text>
                <div className="col-md-9 listcek">
                    {draftEmail.to.length === undefined ? (
                        <div className='listcek mr-2'>
                            <Input
                            type="checkbox" 
                            name="access"
                            checked
                            className='ml-1'
                            // onChange={listTo.find(element => element === item.name) === undefined ? () => this.checkToApp(item.name) : () => this.checkToRej(item.name)}
                            />
                            <text className='ml-4'>{`${draftEmail.to.role.name}: ${draftEmail.to.fullname}`}</text>
                        </div>
                    ) : draftEmail.to.length > 0 && draftEmail.to.map(item => {
                        return (
                            <div className='listcek mr-2'>
                                <Input
                                type="checkbox" 
                                name="access"
                                checked
                                className='ml-1'
                                // onChange={listTo.find(element => element === item.name) === undefined ? () => this.checkToApp(item.name) : () => this.checkToRej(item.name)}
                                />
                                <text className='ml-4'>{`${item.role.name}: ${item.fullname}`}</text>
                            </div>
                        )
                    }
                    )}
                    
                </div>
            </div>
            <div className='addModalMenu'>
                <text className="col-md-3">
                    Cc
                </text>
                <div className="col-md-9 listcek">
                    {draftEmail.cc.length !== 0 && draftEmail.cc.map(item => {
                        return (
                            <div className='listcek mr-2'>
                                <Input 
                                type="checkbox"
                                name="access"
                                checked
                                className='ml-1'
                                // onChange={listCc.find(element => element === item.name) === undefined ? () => this.checkApp(item.name) : () => this.checkRej(item.name)}
                                />
                                <text className='ml-4'>{`${item.role.name}: ${item.fullname}`}</text>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className={style.addModalDepo}>
                <text className="col-md-3">
                    Subject
                </text>
                <div className="col-md-9">
                    <Input 
                    type='textarea'
                    name="subject"
                    value={this.state.subject}
                    disabled
                    onChange={e => this.onEnter(e.target)}
                    // onBlur={handleBlur("subject")}
                    // onChange={handleChange("subject")}
                    />
                    {errors.subject ? (
                        <text className={style.txtError}>{errors.subject}</text>
                    ) : null}
                </div>
            </div>
            <div className={style.addModalDepo}>
                <text className="col-md-3">
                    Message
                </text>
                <div className="col-md-9">
                    <Input 
                    type='textarea'
                    name="message"
                    value={this.state.message}
                    onChange={e => this.onEnter(e.target)}
                    // onBlur={handleBlur("message")}
                    // onChange={handleChange("message")}
                    />
                    {errors.message ? (
                        <text className={style.txtError}>{errors.message}</text>
                    ) : null}
                </div>
            </div>
            <div className={style.tableDashboard}>
                {data === undefined || data.length === 0 ? (
                    <Table bordered responsive hover className={style.tab}>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>No Stock Opname</th>
                                <th>Kode Area</th>
                                <th>Area</th>
                                <th>Tanggal Stock Opname</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>{detailStock[0].no_stock}</td>
                                <td>{detailStock[0].kode_plant}</td>
                                <td>{detailStock[0].depo === null ? '' : detailStock[0].area === null ? `${detailStock[0].depo.nama_area} ${detailStock[0].depo.channel}` : detailStock[0].area}</td>
                                <td>
                                    {
                                        detailStock[0].tanggalStock === null
                                        ? moment().format('DD MMMM YYYY')
                                        : moment(detailStock[0].tanggalStock).format('DD MMMM YYYY')
                                    }
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                ) : (
                    <Table bordered responsive hover className={style.tab}>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>NO. ASET</th>
                                <th>DESKRIPSI</th>
                                <th>MERK</th>
                                <th>SATUAN</th>
                                <th>UNIT</th>
                                <th>LOKASI</th>
                                <th>STATUS FISIK</th>
                                <th>KONDISI</th>
                                <th>STATUS ASET</th>
                                <th>KETERANGAN</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => {
                                return (
                                <tr>
                                    <td scope="row">{index + 1}</td>
                                    <td>{item.no_asset}</td>
                                    <td>{level === '5' || level === '9' ? item.nama_asset : item.deskripsi}</td>
                                    <td>{item.merk}</td>
                                    <td>{item.satuan}</td>
                                    <td>{item.unit}</td>
                                    <td>{item.lokasi}</td>
                                    <td>{item.status_fisik}</td>
                                    <td>{item.kondisi}</td>
                                    <td>{item.grouping}</td>
                                    <td>{item.keterangan}</td>
                                </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                )}
                
            </div>
            <hr/>
            </>
            )}
        </Formik>
        </>
    )
  }
}

const mapStateToProps = state => ({
    stock: state.stock,
    menu: state.menu,
    reason: state.reason,
    tempmail: state.tempmail
})

export default connect(mapStateToProps)(TableRincian)
