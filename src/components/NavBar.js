/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { Component } from 'react'
import notif from '../redux/actions/notif'
import auth from '../redux/actions/auth'
import user from '../redux/actions/user'
import {connect} from 'react-redux'
import { Input, Button, UncontrolledDropdown, DropdownToggle,
DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody } from 'reactstrap'
import {FaBars, FaFileSignature, FaUserCircle} from 'react-icons/fa'
import {BsBell, BsFillCircleFill} from 'react-icons/bs'
import { FiLogOut } from 'react-icons/fi'
import style from '../assets/css/input.module.css'
import moment from 'moment'
import {Formik} from 'formik'
import * as Yup from 'yup'
import {AiOutlineClose} from 'react-icons/ai'

const changeSchema = Yup.object().shape({
    current_password: Yup.string().required('must be filled'),
    confirm_password: Yup.string().required('must be filled'),
    new_password: Yup.string().required('must be filled')
});

class NavBar extends Component {

    state = {
        modalEdit: false,
        relog: false,
        alert: false,
        setting: false,
        modalConfirm: false
    }

    getNotif = async () => {
        const token = localStorage.getItem("token")
        await this.props.getNotif(token)
    }

    logout = () => {
        this.props.logout()
    }

     editUser = async (val) => {
        const token = localStorage.getItem("token")
        const data = {
            new: val.new_password,
            current: val.current_password
        }
        await this.props.changePassword(token, data)
     }

     openModalEdit = () => {
        this.setState({modalEdit: !this.state.modalEdit})
    }

    openConfirm = () => {
        this.setState({modalConfirm: !this.state.modalConfirm})
    }

    componentDidUpdate() {
        const {isChange, isError} = this.props.user
        if (isChange) {
            this.openModalEdit()
            this.setState({relog: true})
            this.props.reset()
        } else if (isError) {
            this.openConfirm()
            this.props.reset()
        }
    }

    render() {
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const dataNotif = this.props.dataNotif
        const id = localStorage.getItem('id')
        return (
            <>
            <div className={style.divLogo}>
                <marquee className={style.marquee}>
                    <span>WEB ASSET</span>
                </marquee>
                <div className={style.textLogo}>
                <UncontrolledDropdown>
                        <DropdownToggle nav>
                            <div className={style.optionType}>
                                <BsBell size={30} className="white" />
                                {dataNotif.length > 0 ? (
                                    <BsFillCircleFill className="red ball" size={10} />
                                ) : (
                                    <div></div>
                                ) }
                            </div>
                        </DropdownToggle>
                        <DropdownMenu right
                        modifiers={{
                            setMaxHeight: {
                                enabled: true,
                                order: 890,
                                fn: (data) => {
                                return {
                                    ...data,
                                    styles: {
                                    ...data.styles,
                                    overflow: 'auto',
                                    maxHeight: '600px',
                                    },
                                };
                                },
                            },
                        }}>
                            {dataNotif.length > 0 ? (
                                dataNotif.map(item => {
                                    return (
                                        <DropdownItem>
                                            <div className={style.notif}>
                                                <FaFileSignature size={90} className="mr-4"/>
                                                <div>
                                                    <div>Request</div>
                                                    <div className="textNotif">{item.keterangan} {item.jenis}</div>
                                                    <div className="textNotif">No {item.jenis}: {item.no_proses}</div>
                                                    <div>{moment(item.createdAt).format('LLL')}</div>
                                                </div>
                                            </div>
                                            <hr/>
                                        </DropdownItem>
                                    )
                                })
                            ) : (
                                <DropdownItem>
                                    <div className={style.grey}>
                                        You don't have any notifications 
                                    </div>        
                                </DropdownItem>
                            )}
                        </DropdownMenu>
                    </UncontrolledDropdown>
                    <UncontrolledDropdown>
                            <DropdownToggle nav>
                                <FaUserCircle size={30} className="mr-2 white" />
                                <text className="mr-3 white">{level === '1' ? 'Super Admin' : names}</text>
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem onClick={this.openModalEdit}>
                                    Change Password
                                </DropdownItem>
                                <DropdownItem onClick={() => this.logout()}>
                                    <FiLogOut size={15} />
                                    <text className="txtMenu2">Logout</text>
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                </div>
            </div>
            <Modal isOpen={this.state.modalEdit} toggle={this.openModalEdit}>
                <ModalHeader>Change Password</ModalHeader>
                <Formik
                initialValues={{
                current_password: '',
                confirm_password: '',
                new_password: ''
                }}
                validationSchema={changeSchema}
                onSubmit={(values) => {this.editUser(values)}}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                <ModalBody>
                    {/* <Alert color="danger" className={style.alertWrong} isOpen={this.state.alert}>
                        <div>{alertMsg}</div>
                        <div>{alertM}</div>
                    </Alert> */}
                    <div className={style.addModalDepo}>
                        <text className="col-md-4">
                            Current password
                        </text>
                        <div className="col-md-8">
                            <Input 
                            type='password' 
                            name="current_password"
                            value={values.current_password}
                            onBlur={handleBlur("current_password")}
                            onChange={handleChange("current_password")}
                            />
                            {errors.current_password ? (
                                <text className={style.txtError}>{errors.current_password}</text>
                            ) : null}
                        </div>
                    </div>
                    <div className={style.addModalDepo}>
                        <text className="col-md-4">
                            New password
                        </text>
                        <div className="col-md-8">
                            <Input 
                            type='password' 
                            name="new_password"
                            value={values.new_password}
                            onBlur={handleBlur("new_password")}
                            onChange={handleChange("new_password")}
                            />
                            {errors.new_password ? (
                                <text className={style.txtError}>{errors.new_password}</text>
                            ) : null}
                        </div>
                    </div>
                    <div className={style.addModalDepo}>
                        <text className="col-md-4">
                            Confirm password
                        </text>
                        <div className="col-md-8">
                            <Input 
                            type='password' 
                            name="confirm_password"
                            value={values.confirm_password}
                            onBlur={handleBlur("confirm_password")}
                            onChange={handleChange("confirm_password")}
                            />
                            {values.confirm_password !== values.new_password ? (
                                <text className={style.txtError}>Password do not match</text>
                            ) : null}
                        </div>
                    </div>
                    <hr/>
                    <div className={style.foot}>
                        <div></div>
                        <div>
                            <Button className="mr-2" onClick={handleSubmit} color="primary">Save</Button>
                            <Button className="mr-3" onClick={this.openModalEdit} color="danger">Close</Button>
                        </div>
                    </div>
                </ModalBody>
                    )}
                </Formik>
            </Modal>
            <Modal isOpen={this.state.relog}>
                <ModalBody>
                    <div className={style.modalApprove}>
                        <div className="relogin">
                            System membutuhkan anda untuk login ulang
                        </div>
                        <div className={style.btnApprove}>
                            <Button color="primary" onClick={this.logout}>Relogin</Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
            <Modal isOpen={this.state.modalConfirm} toggle={this.openConfirm} size="sm">
                <div>
                    <div className={style.cekUpdate}>
                        <AiOutlineClose size={80} className={style.red} />
                        <div className={[style.sucUpdate, style.green]}>Failed Change Password</div>
                    </div>
                </div>
            </Modal>
            </>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    user: state.user,
    notif: state.notif
})

const mapDispatchToProps = {
    updateUser: user.updateUser,
    reset: user.resetError,
    logout: auth.logout,
    getNotif: notif.getNotif,
    changePassword: user.changePassword
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)
