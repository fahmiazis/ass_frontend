import React from 'react'
import {BsBell, BsFillCircleFill} from 'react-icons/bs'
import { Input, Button, UncontrolledDropdown, DropdownToggle,
    DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody } from 'reactstrap'
import style from '../assets/css/input.module.css'
import {FaBars, FaFileSignature, FaUserCircle, FaBell} from 'react-icons/fa'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import notifAct from '../redux/actions/newnotif'

export default function Bell({dataPass, color}) {
    const dispatch = useDispatch()

    const notifDucer = useSelector((state) => state.newnotif)
    const dataAllNotif = notifDucer.dataAllNotif

    const history = useHistory()

    const goRoute = async (val) => {
        const token = localStorage.getItem('token')
        if (val === 'notif') {
            history.push(`/${val}`)
        } else {
            const typeNotif = val.tipe === 'pengajuan area' && val.transaksi === 'vendor' ? 'approve' : val.tipe
            const data = {
                route: val.routes, 
                type: typeNotif, 
                item: val
            }
            await localStorage.setItem('typeNotif', typeNotif)
            const route = val.routes
            await dispatch(notifAct.readNewNotif(token, val.id))
            history.push({
                pathname: `/${route}`,
                state: data
            })
        }
    }

  return (
    <UncontrolledDropdown>
        <DropdownToggle nav>
            <div className={style.optionType}>
                <FaBell size={25} className={color === undefined ? 'white' : color} />
                {dataAllNotif.find(({status}) => status === null) !== undefined ? (
                    // <BsFillCircleFill className="red ball" size={10} />
                    <div className={`white divNotif ${dataAllNotif.filter(e => e.status === null).length >= 100 ? 'sizeNotif2' : 'sizeNotif'}`}>{dataAllNotif.filter(e => e.status === null).length}</div>
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
            <DropdownItem>
                <div className='allnotif' onClick={() => goRoute('notif')}>
                    See all notifications
                </div>        
            </DropdownItem>
            {dataAllNotif.length > 0 && dataAllNotif.find(({status}) => status === null) !== undefined ? (
                dataAllNotif.filter(e => e.status === null).map(item => {
                    return (
                        <DropdownItem 
                            onClick={() => goRoute(item)}
                        >
                            <div className={style.notif}>
                                <FaFileSignature size={90} className="mr-4"/>
                                <Button className="labelBut" color={item.status === null ? "danger" : "success"} size="sm">{item.status === null ? 'unread' : 'read'}</Button>
                                <div>
                                    <div className="textNotif">{item.proses} ({item.tipe})</div>
                                    <div className="textNotif">No transaksi: {item.no_transaksi}</div>
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
  )
}
