import React from 'react'
import {BsBell, BsFillCircleFill} from 'react-icons/bs'
import { Input, Button, UncontrolledDropdown, DropdownToggle,
    DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody } from 'reactstrap'
import style from '../assets/css/input.module.css'
import {FaBars, FaFileSignature, FaUserCircle} from 'react-icons/fa'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import notif from '../redux/actions/notif'

export default function Bell({dataNotif, color}) {
    const dispatch = useDispatch()
    const history = useHistory()

    async function goRoute(val) {
        const token = localStorage.getItem('token')
        if (val === 'notif') {
            history.push(`/${val}`)
        } else {
            dispatch(notif.upNotif(token, val.id))
            dispatch(notif.getNotif(token))
            const ket = val.keterangan === null
            const jenis = (val.jenis === '' || val.jenis === null) && val.no_proses.split('')[0] === 'O' ? 'Stock Opname' : val.jenis
            console.log(val.route)
            const route = val.route !== undefined && val.route !== null && val.route !== 'null' ? val.route : ket === 'tax' || ket === 'finance' || ket === 'tax and finance' ? 'taxfin' : ket === 'eksekusi' && jenis === 'disposal' ? 'eksdis' : jenis === 'disposal' && ket === 'pengajuan' ? 'disposal' : jenis === 'mutasi' && ket === 'pengajuan' ? 'mutasi' : jenis === 'Stock Opname' && ket === 'pengajuan' ? 'stock' : jenis === 'disposal' ? 'navdis' : jenis === 'mutasi' ? 'navmut' : jenis === 'Stock Opname' && 'navstock' 
            history.push(`/${route}`)
        }
    }

  return (
    <UncontrolledDropdown>
        <DropdownToggle nav>
            <div className={style.optionType}>
                <BsBell size={30} className={color === undefined ? 'white' : color} />
                {dataNotif.find(({status}) => status === null) !== undefined ? (
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
            <DropdownItem>
                <div className='allnotif' onClick={() => goRoute('notif')}>
                    See all notifications
                </div>        
            </DropdownItem>
            {dataNotif.length > 0 ? (
                dataNotif.map(item => {
                    return (
                        <DropdownItem 
                            onClick={() => goRoute(item)}
                        >
                            <div className={style.notif}>
                                <FaFileSignature size={90} className="mr-4"/>
                                <Button className="labelBut" color={item.status === null ? "danger" : "success"} size="sm">{item.status === null ? 'unread' : 'read'}</Button>
                                <div>
                                    <div>Request</div>
                                    <div className="textNotif">{item.keterangan} {item.jenis}</div>
                                    <div className="textNotif">No transaksi: {item.no_proses}</div>
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
