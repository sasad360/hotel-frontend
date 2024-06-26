import React, { useState } from "react"
import {createBrowserRouter} from "react-router-dom"
import Index from '../Pages/Home'
import Login from '../Components/LoginComponent'
import Logout from '../Components/Logout'

import AddNewRoom from '../Pages/NewRoom.jsx';
import AddNewEmployee from '../Pages/NewEmployee.jsx';
import AddNewPosition from '../Pages/NewPosition.jsx';
import AddDepartment from '../Pages/NewDepartment.jsx';
import NewInventory from '../Pages/NewInventory.jsx';
import Expense from '../Pages/Expense.jsx';
import ExpenseHead from '../Pages/ExpenseHead.jsx';
import MenuItems from '../Pages/MenuItems.jsx';
import CustomerList from '../Pages/CustomerList.jsx';
import Booking from '../Pages/Booking.jsx';
import WeeklyMenu from '../Pages/WeeklyMenu.jsx';
import ServiceToCheckIn from '../Pages/ServiceToCheckIn.jsx';
import CustomerCheckOut from '../Pages/CustomerCheckOut.jsx';
import AllDinningBills from '../Pages/AllDinningBills.jsx';
import SalaryPayment from '../Pages/SalaryPayment.jsx';
import NewDinningBill from '../Pages/NewDinningBill.jsx';
import UserUpdate from '../Pages/UserUpdate.jsx';
import NewUser from '../Pages/NewUser.jsx';
import Summary from '../Pages/Summary.jsx';
import DailyDinningReport from '../Pages/DailyDinningReport.jsx';
import DailyHotelReport from '../Pages/DailyHotelReport.jsx'


import Not404 from '../Pages/Not404.jsx'



import { useStateContext } from '../Context/ContextProvider'


import DefaultLayout from "../Components/DefaultLayout";
import GuestLayout from "../Components/GuestLayout";
// import PageNotFound from "../views/PageNotFound"
const router = createBrowserRouter([
    {
      path: '/',
      element: <DefaultLayout/>,
        children: [
            {
                path: '/',
                element: <Index/>
            },
            {
                path: '/newroom',
                element: <AddNewRoom/>
            },
            {
                path: '/newemployee',
                element: <AddNewEmployee/>
            },
            {
                path: '/newposition',
                element: <AddNewPosition/>
            },
            {
                path: '/newdepartment',
                element: <AddDepartment/>
            },
            {
                path: '/newinventory',
                element: <NewInventory/>
            },
            {
                path: '/expensehead',
                element: <ExpenseHead/>
            },
            {
                path: '/expense',
                element: <Expense/>
            },
            {
                path: '/menuitems',
                element: <MenuItems/>
            },
            {
                path: '/customerlist',
                element: <CustomerList/>
            },
            {
                path: '/bookinglist',
                element: <Booking/>
            },
            {
                path: '/weeklymenu',
                element: <WeeklyMenu/>
            },
            {
                path: '/servicetocheckin',
                element: <ServiceToCheckIn/>
            },
            {
                path: '/customercheckout',
                element: <CustomerCheckOut/>
            },
            {
                path: '/all_bills',
                element: <AllDinningBills/>
            },
            {
                path: '/dinning_bill',
                element: <NewDinningBill/>
            },
            {
                path: '/salarypayment',
                element: <SalaryPayment/>
            },
            {
                path: '/userupdate',
                element: <UserUpdate/>
            },
            {
                path: '/newuser',
                element: <NewUser/>
            },
            {
                path: '/summary',
                element: <Summary/>
            },
            {
                path: '/dailyrestaurant',
                element: <DailyDinningReport/>
            },
            {
                path: '/dailyhotel',
                element: <DailyHotelReport/>
            },
            {
                path: '*',
                element: <Not404/>
            },
            {
                path: '/logout',
                element: <Logout/>
            },
           
    
        ]
    },
    {
        path:'/',
        element: <GuestLayout/>,
        children: [
            {
                path: '/login',
                element: <Login/>
            },
            // {
            //     path: '/verification/:userId/:token',
            //     element: <Verification/>
            // },
            // {
            //     path: '/register',
            //     element: <DealerSignup/>
            // },
            // {
            //     path: '/forgot-password',
            //     element: <ForgotPassword/>
            // },
            // {
            //     path: '/reset-password/:userId/:token',
            //     element: <ResetPassword/>
            // },
            // {
            //     path: '/verify/:token',
            //     element: <VerifyUser/>
            // },
            // {
            //     path: '/invitation/:userId/:token',
            //     element: <Invitation/>
            // },
        ]
    }
   

])

export default router;

