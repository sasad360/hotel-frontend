import { Outlet, Navigate, NavLink , Link } from 'react-router-dom';
import axiosClient from "../axios-client.js";
import { useStateContext } from "../Context/ContextProvider";
import { useEffect, useState } from 'react';

// import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';
// import '../CSS/styles.css';
// import * as Icon from 'react-feather';
// import MapLocation from './MapLocation.jsx';
// import { Modal, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";

// import LocationSearchInput from './LocationSearchInput.jsx';
// import LocationAutoComplete from './LocationAutoComplete.jsx';

// import PlacesAutoComplete from '../Components/PlacesAutocomplete';

export default function DefaultLayout() {

    const { user, token, role, setUser, setToken, setRole, notification } = useStateContext();

    // Subscription Modal
    const [showLocationModal, setLocationModal] = useState(false);
    const handleLocationModalClose = () => setLocationModal(false);
    const handleSubscriptionModalShow = () => setLocationModal(true);
    
    const [btnLoading, setBtnLoading] = useState(false)
    const [userInfo, setUserInfo] = useState([])
    
  const [getRequestLoading, setRequestLoading] = useState(true)

    const getUser = () => {
        axiosClient.get('/user')
            .then(({ data }) => {
                setRequestLoading(false)
                setUser(data.user)
                setRole(data.role)
                setUserInfo(data);
                
                // console.log('role ----',data.role)
                // console.log('user data ---',data.user)
            })
            .catch(err => {
                setRequestLoading(false)
            });
    }

    useEffect(() => {

        // document.body.classList.remove('bg-auth');
        // document.body.classList.add('bg-app');
        // document.body.classList.add('layout-menu-fixed');

        getUser();

        // window.addEventListener('refreshProfile', (event) => {
        //     if (event['detail'].value) {
        //         getUser();
        //     }
        // })
        
    }, [])

    

    if (!token) {
        return <Navigate to="/login" />
    }
    
    
    const onLogout = (e) => {
        e.preventDefault()

        axiosClient.post('/logout')
            .then(() => {
                setUser({})
                setRole(null)
                setToken(null)
            })
    }
  


    return (
        <>
            {/* <Navbar/> */}
            <Sidebar user={userInfo}/>
            <div className="layout-page">
                
                <div className="content-wrapper">
                    <Outlet />
                </div>
            </div>

        </>
    )
}