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
        const {detailIo} = this.props.pengadaan
        const cek = draftEmail.result
        const stat = detailIo[0].status_form
        const no = detailIo[0].no_pengadaan
        const message = cek === undefined ? '' : `${cek.message} (${no})`
        const subject = cek === undefined ? '' : `${cek.type === 'submit' ? '' : cek.type} ${cek.menu} NO ${no}`
        this.setState({message: message, subject: subject})
        this.props.handleData({message: message, subject: subject})
    }

  render() {
    const {detailIo} = this.props.pengadaan
    const { draftEmail } = this.props.tempmail
    const statMail = this.props.statMail || ''
    const {dataResmail} = this.props.tempmail

    const listMut = this.props.cekData !== undefined ? this.props.cekData : []
    const tipe = this.props.tipe !== undefined ? this.props.tipe : 'approve'
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
                <Table bordered responsive hover className={style.tab}>
                    <thead>
                        <tr>
                            <th>NO</th>
                            <th>NO AJUAN</th>
                            <th>NAMA ASSET</th>
                            <th>KATEGORI</th>
                            <th>TIPE</th>
                            <th>PRICE</th>
                            <th>KUANTITAS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {detailIo.length !== 0 && detailIo.map((item, index) => {
                            return (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{item.no_pengadaan}</td>
                                    <td>{item.nama}</td>
                                    <td>{item.kategori}</td>
                                    <td>{item.tipe === 'gudang' ? 'Sewa Gudang' : "Barang"}</td>
                                    <td>{item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                    <td>{item.qty}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
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
    pengadaan: state.pengadaan,
    menu: state.menu,
    reason: state.reason,
    tempmail: state.tempmail
})

export default connect(mapStateToProps)(TableRincian)
