import {Outlet, Navigate} from 'react-router-dom'
import {useStateContext} from "../Context/ContextProvider";
import { useEffect } from 'react';

export default function GuestLayout() {
    const {token} = useStateContext();

    useEffect(() => {

        // document.body.classList.add('bg-auth');
        // document.body.classList.remove('bg-app');

    }, [])

    if(token){
        return <Navigate to="/" />
    }

    return (
        <div>
            <Outlet/>
        </div>
    )
}