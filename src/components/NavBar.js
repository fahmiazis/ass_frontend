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

const changeSchema = Yup.object().shape({
    old_password: Yup.string().required('must be filled'),
    new_password: Yup.string().required('must be filled')
});

class NavBar extends Component {

    state = {
        modalEdit: false,
        relog: false,
        alert: false,
        setting: false
    }

    getNotif = async () => {
        const token = localStorage.getItem("token")
        await this.props.getNotif(token)
    }

    logout = () => {
        this.props.logout()
    }

     componentDidMount() {
         this.getNotif()
     }

     openModalEdit = () => {
        this.setState({modalEdit: !this.state.modalEdit})
    }

    render() {
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const dataNotif = this.props.notif.data
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
                old_password: '',
                new_password: ''
                }}
                validationSchema={changeSchema}
                onSubmit={(values) => {this.editUser(values, id)}}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                <ModalBody>
                    {/* <Alert color="danger" className={style.alertWrong} isOpen={this.state.alert}>
                        <div>{alertMsg}</div>
                        <div>{alertM}</div>
                    </Alert> */}
                    <div className={style.addModalDepo}>
                        <text className="col-md-3">
                            New Password
                        </text>
                        <div className="col-md-9">
                            <Input 
                            type="name" 
                            name="old_password"
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
                        <text className="col-md-3">
                            Old Password
                        </text>
                        <div className="col-md-9">
                            <Input 
                            type="name" 
                            name="old_password"
                            value={values.old_password}
                            onBlur={handleBlur("old_password")}
                            onChange={handleChange("old_password")}
                            />
                            {errors.old_password ? (
                                <text className={style.txtError}>{errors.old_password}</text>
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
    getNotif: notif.getNotif
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)
