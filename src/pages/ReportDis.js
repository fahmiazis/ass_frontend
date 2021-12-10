import React, { Component } from 'react'
import {  NavbarBrand, DropdownToggle, DropdownMenu,
    DropdownItem, Table, ButtonDropdown, Input, Button,
    Modal, ModalHeader, ModalBody, Alert, Spinner} from 'reactstrap'
import style from '../assets/css/input.module.css'
import {FaSearch, FaUserCircle, FaBars} from 'react-icons/fa'
import {AiFillCheckCircle, AiOutlineFileExcel} from 'react-icons/ai'
import depo from '../redux/actions/depo'
import report from '../redux/actions/report'
import disposal from '../redux/actions/disposal'
import user from '../redux/actions/user'
import moment from 'moment'
import {connect} from 'react-redux'
import {Formik} from 'formik'
import * as Yup from 'yup'
import auth from '../redux/actions/auth'
import {default as axios} from 'axios'
import Sidebar from "../components/Header";
import MaterialTitlePanel from "../components/material_title_panel";
import SidebarContent from "../components/sidebar_content";
const {REACT_APP_BACKEND_URL} = process.env

const userSchema = Yup.object().shape({
    username: Yup.string().required(),
    fullname: Yup.string().required(),
    password: Yup.string().required(),
    depo: Yup.string(),
    user_level: Yup.string().required(),
    status: Yup.string().required()
});

const userEditSchema = Yup.object().shape({
    username: Yup.string().required(),
    fullname: Yup.string().required(),
    password: Yup.string(),
    depo: Yup.string(),
    user_level: Yup.string().required(),
    status: Yup.string().required()
});

class MasterUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            docked: false,
            open: false,
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
            level: "",
            upload: false,
            errMsg: '',
            fileUpload: '',
            limit: 10,
            search: ''
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
    }

    showAlert = () => {
        this.setState({alert: true, modalEdit: false, modalAdd: false, modalUpload: false })
       
         setTimeout(() => {
            this.setState({
                alert: false
            })
         }, 10000)
    }
    uploadAlert = () => {
        this.setState({upload: true, modalUpload: false })
       
         setTimeout(() => {
            this.setState({
                upload: false
            })
         }, 10000)
    }

    DownloadMaster = () => {
        const {link} = this.props.user
        axios({
            url: `${link}`,
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "master user.xlsx"); //or any other extension
            document.body.appendChild(link);
            link.click();
        });
    }

    toggle = () => {
        this.setState({isOpen: !this.state.isOpen})
    }

    dropDown = () => {
        this.setState({dropOpen: !this.state.dropOpen})
    }
    dropOpen = () => {
        this.setState({dropOpenNum: !this.state.dropOpenNum})
    }
    onSetSidebarOpen = () => {
        this.setState({ sidebarOpen: !this.state.sidebarOpen });
    }
    openModalAdd = () => {
        this.setState({modalAdd: !this.state.modalAdd})
    }
    openModalEdit = () => {
        this.setState({modalEdit: !this.state.modalEdit})
    }
    openModalUpload = () => {
        this.setState({modalUpload: !this.state.modalUpload})
    }
    openModalDownload = () => {
        this.setState({modalUpload: !this.state.modalUpload})
    }

    DownloadTemplate = () => {
        axios({
            url: `${REACT_APP_BACKEND_URL}/masters/user.xlsx`,
            method: 'GET',
            responseType: 'blob',
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "user.xlsx");
            document.body.appendChild(link);
            link.click();
        });
    }

    next = async () => {
        const { page } = this.props.user
        const token = localStorage.getItem('token')
        await this.props.nextPage(token, page.nextLink)
    }

    prev = async () => {
        const { page } = this.props.user
        const token = localStorage.getItem('token')
        await this.props.nextPage(token, page.prevLink)
    }

    onSearch = (e) => {
        this.setState({search: e.target.value})
        if(e.key === 'Enter'){
            this.getDataUser({limit: 10, search: this.state.search})
        }
    }

    onChangeHandler = e => {
        const {size, type} = e.target.files[0]
        if (size >= 5120000) {
            this.setState({errMsg: "Maximum upload size 5 MB"})
            this.uploadAlert()
        } else if (type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && type !== 'application/vnd.ms-excel' ){
            this.setState({errMsg: 'Invalid file type. Only excel files are allowed.'})
            this.uploadAlert()
        } else {
            this.setState({fileUpload: e.target.files[0]})
        }
    }

    uploadMaster = async () => {
        const token = localStorage.getItem('token')
        const data = new FormData()
        data.append('master', this.state.fileUpload)
        await this.props.uploadMaster(token, data)
    }

    ExportMaster = () => {
        const token = localStorage.getItem('token')
        this.props.exportMaster(token)
    }

    componentDidUpdate() {
        const {isError, isUpload, isExport} = this.props.user
        if (isError) {
            this.props.resetError()
            this.showAlert()
        } else if (isUpload) {
            setTimeout(() => {
                this.props.resetError()
                this.setState({modalUpload: false})
             }, 2000)
             setTimeout(() => {
                this.getDataUser()
             }, 2100)
        } else if (isExport) {
            this.DownloadMaster()
            this.props.resetError()
        }
    }

    componentDidMount() {
        this.getDataReportDisposal()
    }

    getDataReportDisposal = async () => {
        const token = localStorage.getItem("token")
        const search = this.props.location.state === undefined ? '' : this.props.location.state
        await this.props.getReportDis(token, 1, search, 1)
    }

    menuButtonClick(ev) {
        ev.preventDefault();
        this.onSetOpen(!this.state.open);
    }

    onSetOpen(open) {
        this.setState({ open });
    }

    render() {
        const {isOpen, dropOpen, dropOpenNum, detail, level, upload, errMsg} = this.state
        const {dataUser, isGet, alertM, alertMsg, alertUpload, page, dataRole} = this.props.user
        const { dataRep } = this.props.report
        const { dataDepo } = this.props.depo
        const levels = localStorage.getItem('level')
        const names = localStorage.getItem('name')

        const contentHeader =  (
            <div className={style.navbar}>
                <NavbarBrand
                href="#"
                onClick={this.menuButtonClick}
                >
                    <FaBars size={20} className={style.white} />
                </NavbarBrand>
                <div className={style.divLogo}>
                    <marquee className={style.marquee}>
                        <span>WEB ASSET</span>
                    </marquee>
                    <div className={style.textLogo}>
                        <FaUserCircle size={24} className="mr-2" />
                        <text className="mr-3">{levels === '1' ? 'Super admin' : names }</text>
                    </div>
                </div>
            </div>
        )

        const sidebar = <SidebarContent />
        const sidebarProps = {
            sidebar,
            docked: this.state.docked,
            sidebarClassName: "custom-sidebar-class",
            contentId: "custom-sidebar-content-id",
            open: this.state.open,
            touch: this.state.touch,
            shadow: this.state.shadow,
            pullRight: this.state.pullRight,
            touchHandleWidth: this.state.touchHandleWidth,
            dragToggleDistance: this.state.dragToggleDistance,
            transitions: this.state.transitions,
            onSetOpen: this.onSetOpen
          };
        return (
            <>
                <Sidebar {...sidebarProps}>
                    <MaterialTitlePanel title={contentHeader}>
                        <div className={style.backgroundLogo}>
                            <Alert color="danger" className={style.alertWrong} isOpen={this.state.alert}>
                                <div>{alertMsg}</div>
                                <div>{alertM}</div>
                                {alertUpload !== undefined && alertUpload.map(item => {
                                    return (
                                        <div>{item}</div>
                                    )
                                })}
                            </Alert>
                            <Alert color="danger" className={style.alertWrong} isOpen={upload}>
                                <div>{errMsg}</div>
                            </Alert>
                            <div className={style.bodyDashboard}>
                                <div className={style.headMaster}>
                                    <div className={style.titleDashboard}>Report Disposal</div>
                                </div>
                                <div className={style.secHeadDashboard} >
                                    <div>
                                        <text>Show: </text>
                                        <ButtonDropdown className={style.drop} isOpen={dropOpen} toggle={this.dropDown}>
                                        <DropdownToggle caret color="light">
                                            {this.state.limit}
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem className={style.item} onClick={() => this.getDataUser({limit: 10, search: ''})}>10</DropdownItem>
                                            <DropdownItem className={style.item} onClick={() => this.getDataUser({limit: 20, search: ''})}>20</DropdownItem>
                                            <DropdownItem className={style.item} onClick={() => this.getDataUser({limit: 50, search: ''})}>50</DropdownItem>
                                        </DropdownMenu>
                                        </ButtonDropdown>
                                        <text className={style.textEntries}>entries</text>
                                    </div>
                                </div>
                                <div className={style.secEmail}>
                                    <div className={style.headEmail}>
                                        <Button onClick={this.ExportMaster} disabled color="success" size="lg">Download</Button>
                                    </div>
                                    <div>
                                    </div>
                                </div>
                                {dataRep.length === 0 ? (
                                    <div className={style.tableDashboard}>
                                    <Table bordered responsive hover className={style.tab}>
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>No Pengajuan Disposal</th>
                                                <th>No Persetujuan Disposal</th>
                                                <th>Nomor Asset</th>
                                                <th>Nama Barang</th>
                                                <th>Kategori</th>
                                                <th>Cost Center</th>
                                                <th>Cost Center Name</th>
                                                <th>Tgl Perolehan</th>
                                                <th>Nilai Akuisisi</th>
                                                <th>Nilai Buku saat pengajuan Disposal aset</th>
                                                <th>Nilai jual</th>
                                                <th>Keterangan pengajuan disposal aset</th>
                                                <th>Nilai Buku saat persetujuan Disposal</th>
                                                <th>Keteranagan persetujuan disposal aset</th>
                                                <th>Grouping eksekusi</th>
                                                <th>Akumulasi Aset</th>
                                                <th>Nilai Buku Saat eksekusi</th>
                                                <th>DPP</th>
                                                <th>PPN</th>
                                                <th>Profit/LOSS</th>
                                                <th>Tanggal Eksekusi disposal di SAP</th>
                                                <th>No Doc Jurnal Uang Masuk</th>
                                                <th>Nomor Faktur Pajak</th>
                                                <th>No Doc Disposal</th>
                                                <th>No Doc Clearing</th>
                                                <th>PIC ASET</th>
                                            </tr>
                                        </thead>
                                    </Table>
                                        <div className={style.spin}>
                                            <Spinner type="grow" color="primary"/>
                                            <Spinner type="grow" className="mr-3 ml-3" color="success"/>
                                            <Spinner type="grow" color="warning"/>
                                            <Spinner type="grow" className="mr-3 ml-3" color="danger"/>
                                            <Spinner type="grow" color="info"/>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={style.tableDashboard}>
                                    <Table bordered responsive hover className={style.tab}>
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>No Pengajuan Disposal</th>
                                                <th>No Persetujuan Disposal</th>
                                                <th>Nomor Asset</th>
                                                <th>Nama Barang</th>
                                                <th>Kategori</th>
                                                <th>Cost Center</th>
                                                <th>Cost Center Name</th>
                                                <th>Tgl Perolehan</th>
                                                <th>Nilai Akuisisi</th>
                                                <th>Nilai Buku saat pengajuan Disposal aset</th>
                                                <th>Nilai jual</th>
                                                <th>Keterangan pengajuan disposal aset</th>
                                                <th>Nilai Buku saat persetujuan Disposal</th>
                                                <th>Keterangan persetujuan disposal aset</th>
                                                <th>Grouping eksekusi</th>
                                                <th>Akumulasi Aset</th>
                                                <th>Nilai Buku Saat eksekusi</th>
                                                <th>DPP</th>
                                                <th>PPN</th>
                                                <th>Profit/LOSS</th>
                                                <th>Tanggal Eksekusi disposal di SAP</th>
                                                <th>No Doc Jurnal Uang Masuk</th>
                                                <th>Nomor Faktur Pajak</th>
                                                <th>No Doc Disposal</th>
                                                <th>No Doc Clearing</th>
                                                <th>PIC ASET</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {dataRep.length !== 0 && dataRep.map(item => {
                                                return (
                                                <tr>
                                                    <th scope="row">1</th>
                                                    <td>D{item.no_disposal}</td>
                                                    <td>{item.status_app}</td>
                                                    <td>{item.no_asset}</td>
                                                    <td>{item.nama_asset}</td>
                                                    <td>{item.dataAsset.kategori}</td>
                                                    <td>{item.cost_center}</td>
                                                    <td>{item.area}</td>
                                                    <td>{moment(item.dataAsset.tanggal).format('DD/MM/YYYY')}</td>
                                                    <td>{item.dataAsset.nilai_acquis === null ? '-' : item.dataAsset.nilai_acquis.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                    <td>{item.nilai_buku === null ? '-' : item.nilai_buku.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                    <td>{item.nilai_jual.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                    <td>{item.keterangan}</td>
                                                    <td>{item.dataAsset.nilai_buku}</td>
                                                    <td>{item.keterangan}</td>
                                                    <td>{item.nilai_jual === '0' ? 'Dispose' : 'Sell'}</td>
                                                    <td>{item.dataAsset.accum_dep === null ? '-' : item.dataAsset.accum_dep.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                    <td>{item.nilai_buku === null ? '-' : item.nilai_buku.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                    <td>{item.nilai_jual === '0' ? '-' : Math.round(parseInt(item.nilai_jual) / (11/10)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                    <td>{item.nilai_jual === '0' ? '-' : Math.round(parseInt(item.nilai_jual) - Math.round(parseInt(item.nilai_jual) / (11/10))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                    <td>{item.nilai_jual === '0' ? '-' : Math.round(Math.round(parseInt(item.nilai_jual) / (11/10))-parseInt(item.dataAsset.nilai_buku)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
                                                    <td>{}</td>
                                                    <td>{item.no_sap}</td>
                                                    <td>{item.no_fp}</td>
                                                    <td>{item.doc_sap}</td>
                                                    <td>{item.doc_clearing}</td>
                                                    <td>{item.depo.nama_pic_1}</td>
                                                </tr>
                                                )})}
                                        </tbody>
                                    </Table>
                                </div>  
                                )}
                                <div>
                                    {/* <div className={style.infoPageEmail}>
                                        <text>Showing {page.currentPage} of {page.pages} pages</text>
                                        <div className={style.pageButton}>
                                            <button className={style.btnPrev} color="info" disabled={page.prevLink === null ? true : false} onClick={this.prev}>Prev</button>
                                            <button className={style.btnPrev} color="info" disabled={page.nextLink === null ? true : false} onClick={this.next}>Next</button>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </MaterialTitlePanel>
                </Sidebar>
                <Modal toggle={this.openModalAdd} isOpen={this.state.modalAdd}>
                    <ModalHeader toggle={this.openModalAdd}>Add Master User</ModalHeader>
                    <Formik
                    initialValues={{
                    username: "",
                    fullname: "",
                    password: "",
                    depo: "",
                    user_level: "", 
                    status: ""
                    }}
                    validationSchema={userSchema}
                    onSubmit={(values) => {this.addUser(values)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                    <ModalBody>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                User Name
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="username"
                                value={values.username}
                                onBlur={handleBlur("username")}
                                onChange={handleChange("username")}
                                />
                                {errors.username ? (
                                    <text className={style.txtError}>{errors.username}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Full Name
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="fullname"
                                value={values.fullname}
                                onBlur={handleBlur("fullname")}
                                onChange={handleChange("fullname")}
                                />
                                {errors.fullname ? (
                                    <text className={style.txtError}>{errors.fullname}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Password
                            </text>
                            <div className="col-md-9">
                            <Input 
                            type="password" 
                            name="nama_spv" 
                            value={values.password}
                            onChange={handleChange("password")}
                            onBlur={handleBlur("password")}
                            />
                            {errors.password ? (
                                <text className={style.txtError}>{errors.password}</text>
                            ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                User Level
                            </text>
                            <div className="col-md-9">
                            <Input 
                                type="select" 
                                name="select"
                                value={values.user_level}
                                onChange={handleChange("user_level")}
                                onBlur={handleBlur("user_level")}
                                >
                                    <option>-Pilih Level-</option>
                                    {dataRole.length !== 0 && dataRole.map(item => {
                                        return (
                                            <option value={item.nomor}>{item.name}</option>
                                        )
                                    })}
                                </Input>
                                {errors.user_level ? (
                                    <text className={style.txtError}>{errors.user_level}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Depo
                            </text>
                            <div className="col-md-9">
                            <Input 
                                type="select"
                                name="select"
                                disabled={values.user_level === "5" ? false : true}
                                value={values.depo}
                                onChange={handleChange("depo")}
                                onBlur={handleBlur("depo")}
                                >
                                    <option>-Pilih Depo-</option>
                                    {dataDepo.length !== 0 && dataDepo.map(item => {
                                        return (
                                            <option value={item.kode_plant + '-' + item.nama_depo}>{item.kode_plant + '-' + item.nama_depo}</option>
                                        )
                                    })}
                                </Input>
                                {errors.depo ? (
                                    <text className={style.txtError}>{errors.depo}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Status
                            </text>
                            <div className="col-md-9">
                            <Input 
                                type="select"
                                name="select"
                                value={values.status}
                                onChange={handleChange("status")}
                                onBlur={handleBlur("status")}
                                >   
                                    <option>-Pilih Status-</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </Input>
                                {errors.status ? (
                                    <text className={style.txtError}>{errors.status}</text>
                                ) : null}
                            </div>
                        </div>
                        <hr/>
                        <div className={style.foot}>
                            <div></div>
                            <div>
                                <Button className="mr-2" onClick={handleSubmit} color="primary">Save</Button>
                                <Button className="mr-3" onClick={this.openModalAdd}>Cancel</Button>
                            </div>
                        </div>
                    </ModalBody>
                        )}
                    </Formik>
                </Modal>
                <Modal toggle={this.openModalEdit} isOpen={this.state.modalEdit}>
                    <ModalHeader toggle={this.openModalEdit}>Edit Master User</ModalHeader>
                    <Formik
                    initialValues={{
                    username: detail.username,
                    depo: detail.kode_plant + "-" + detail.nama_depo,
                    user_level: detail.user_level, 
                    status: detail.status,
                    email: detail.email,
                    fullname: detail.fullname
                    }}
                    validationSchema={userEditSchema}
                    onSubmit={(values) => {this.editUser(values, detail.id)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                    <ModalBody>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                User Name
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="username"
                                value={values.username}
                                onBlur={handleBlur("username")}
                                onChange={handleChange("username")}
                                />
                                {errors.username ? (
                                    <text className={style.txtError}>{errors.username}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Full Name
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="fullname"
                                value={values.fullname}
                                onBlur={handleBlur("fullname")}
                                onChange={handleChange("fullname")}
                                />
                                {errors.fullname ? (
                                    <text className={style.txtError}>{errors.fullname}</text>
                                ) : null}
                            </div>
                        </div>
                        {detail.user_level === '5' || detail.user_level === 5 ? (
                            <div className={style.addModalDepo}>
                                <text className="col-md-3">
                                    Depo
                                </text>
                                <div className="col-md-9">
                                <Input 
                                    type="select" 
                                    name="select"
                                    value={values.depo}
                                    onChange={handleChange("depo")}
                                    onBlur={handleBlur("depo")}
                                    >
                                        <option>-Pilih Depo-</option>
                                        {dataDepo.length !== 0 && dataDepo.map(item => {
                                            return (
                                                <option value={item.kode_plant + '-' + item.nama_depo}>{item.kode_plant + '-' + item.nama_depo}</option>
                                            )
                                        })}
                                        {/* <option value="50-MEDAN TIMUR">50-MEDAN TIMUR</option>
                                        <option value="53-MEDAN BARAT">53-MEDAN BARAT</option> */}
                                    </Input>
                                    {errors.depo ? (
                                        <text className={style.txtError}>{errors.depo}</text>
                                    ) : null}
                                </div>
                            </div>
                        ) : (
                            <div></div>
                        )}
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                User Level
                            </text>
                            <div className="col-md-9">
                            <Input 
                                type="select" 
                                name="select"
                                value={values.user_level}
                                onChange={handleChange("user_level")}
                                onBlur={handleBlur("user_level")}
                                >
                                    <option>-Pilih Level-</option>
                                    {dataRole.length !== 0 && dataRole.map(item => {
                                        return (
                                            <option value={item.nomor}>{item.name}</option>
                                        )
                                    })}
                                </Input>
                                {errors.user_level ? (
                                    <text className={style.txtError}>{errors.user_level}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Email
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="email"
                                value={values.email}
                                onBlur={handleBlur("email")}
                                onChange={handleChange("email")}
                                />
                                {errors.email ? (
                                    <text className={style.txtError}>{errors.email}</text>
                                ) : null}
                            </div>
                        </div>
                        {/* <div className={style.addModalDepo}>
                            <text className="col-md-3">
                                Status
                            </text>
                            <div className="col-md-9">
                            <Input 
                                type="select"
                                name="select"
                                value={values.status}
                                onChange={handleChange("status")}
                                onBlur={handleBlur("status")}
                                >   
                                    <option>-Pilih Status-</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </Input>
                                {errors.status ? (
                                    <text className={style.txtError}>{errors.status}</text>
                                ) : null}
                            </div>
                        </div> */}
                        <hr/>
                        <div className={style.foot}>
                            <div></div>
                            <div>
                                <Button className="mr-2" onClick={handleSubmit} color="primary">Save</Button>
                                <Button className="mr-3" onClick={this.openModalEdit}>Cancel</Button>
                            </div>
                        </div>
                    </ModalBody>
                        )}
                    </Formik>
                </Modal>
                <Modal toggle={this.openModalUpload} isOpen={this.state.modalUpload} >
                    <ModalHeader>Upload Master User</ModalHeader>
                    <ModalBody className={style.modalUpload}>
                        <div className={style.titleModalUpload}>
                            <text>Upload File: </text>
                            <div className={style.uploadFileInput}>
                                <AiOutlineFileExcel size={35} />
                                <div className="ml-3">
                                    <Input
                                    type="file"
                                    name="file"
                                    accept=".xls,.xlsx"
                                    onChange={this.onChangeHandler}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={style.btnUpload}>
                            <Button color="info" onClick={this.DownloadTemplate}>Download Template</Button>
                            <Button color="primary" disabled={this.state.fileUpload === "" ? true : false } onClick={this.uploadMaster}>Upload</Button>
                            <Button onClick={this.openModalUpload}>Cancel</Button>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.props.user.isLoading ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className={style.cekUpdate}>
                                <Spinner />
                                <div sucUpdate>Waiting....</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
                <Modal isOpen={this.props.user.isUpload ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className={style.cekUpdate}>
                                <AiFillCheckCircle size={80} className={style.green} />
                                <div className={style.sucUpdate}>Berhasil Mengupload Master</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
            </>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
    depo: state.depo,
    disposal: state.disposal,
    report: state.report
})

const mapDispatchToProps = {
    logout: auth.logout,
    addUser: user.addUser,
    updateUser: user.updateUser,
    getUser: user.getUser,
    resetError: user.resetError,
    getDepo: depo.getDepo,
    uploadMaster: user.uploadMaster,
    nextPage: user.nextPage,
    exportMaster: user.exportMaster,
    getRole: user.getRole,
    getDisposal: disposal.getDisposal,
    getReportDis: report.getReportDisposal
}

export default connect(mapStateToProps, mapDispatchToProps)(MasterUser)
	