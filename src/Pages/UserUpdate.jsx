import React from "react";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import {InfinitySpin} from 'react-loader-spinner';
import Loader from 'react-loader-spinner';



const UserUpdate = () => {
    const [updateId, setUpdateId] = useState();
    const [sideModel, setSideModel] = useState(false);
    const [isloading, setIsloading] = useState(false);
    const [bookingCustomer, setBookingCustomer] = useState([]);
    const [customerSearchID, setCustomerSearchID] = useState();
    const[userInfo, setUserInfo] =useState([]);
    const [showForm, setShowForm] = useState(false);
    const [buttonText, setButtonText] = useState('Update Info');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');

    const handleNew = () => {
        setShowForm(!showForm); // Toggle the visibility of the form block
        setButtonText(showForm ? 'Update Info' : 'Hide Form'); // Change button text based on visibility
    };   

    const getdata = () => {
        setIsloading(true);
        axiosClient.get("user")
            .then((response) => {
            setIsloading(false);
            setUserInfo(response.data);
            console.log(response.data)
        })
        .catch((err) => {
            console.log(err);
        });
    };

    const handleSubmit = () => {

        let errorMessage = '';

        // Validate arrival date and time
        if (!oldPassword) {
            errorMessage += "Old Password is required.\n";
        }

        if(!newEmail || !newName || !newEmail){
            errorMessage += "Please Add Any thing to update.\n";
        }

    
        // If any validation fails, show error message and return
        if (errorMessage) {
            toast.error(errorMessage.trim(), {
                position: "top-right",
                autoClose: 2500,
                theme: "colored",
            });
            return;
        }

        const payload = {
            current_password:oldPassword,
            new_password: newPassword,
            confirm_new_password: confirmPassword,
            name: newName,
            email: newEmail
        };

        axiosClient.put('/user/update', payload)
            .then((response) => {
                // Handle success
                toast.success("Info Updated, successfully.", {
                    position: "top-right",
                    autoClose: 2000,
                    theme: "colored",
                });
    
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setNewName('');
                setNewEmail('');
                setShowForm(false);
                setButtonText('Update Info');
                getdata();

            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.errors) {
                    const errors = error.response.data.errors;
                    let errorMessage = '';
                    for (const key in errors) {
                        if (errors.hasOwnProperty(key)) {
                            errorMessage += errors[key].join('\n') + '\n';
                        }
                    }
                    toast.error(errorMessage, {
                        position: "top-right",
                        autoClose: 5000,
                        theme: "colored",
                    });
                } else {
                    console.error("Error adding expense:", error);
                    toast.error("Password Not Matched.", {
                        position: "top-right",
                        autoClose: 2500,
                        theme: "colored",
                    });
                }
            });
        setIsloading(false);
    }

    const getcustomer = () => {

        let errorMessage = '';
    
   
        // Validate expense head
        if (!customerSearchID) {
            errorMessage += "customer SearchID is required.\n";
        }
    
        // If any validation fails, show error message and return
        if (errorMessage) {
            toast.error(errorMessage.trim(), {
                position: "top-right",
                autoClose: 2500,
                theme: "colored",
            });
            return;
        }
        setIsloading(true);
        let payload={
            SearchID: customerSearchID,
        }
        // Send POST request to backend to add expense
        axiosClient.post(`customer/bookingcustomer/${customerSearchID}`, payload)
            .then((response) => {
                // Handle success
                toast.success("customer found successfully.", {
                    position: "top-right",
                    autoClose: 2000,
                    theme: "colored",
                });
    
                // Clear form fields after successful submission
                setBookingCustomer(response.data);
                console.log(bookingCustomer)
                setCustomerSearchID('');

            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.errors) {
                    const errors = error.response.data.errors;
                    let errorMessage = '';
                    for (const key in errors) {
                        if (errors.hasOwnProperty(key)) {
                            errorMessage += errors[key].join('\n') + '\n';
                        }
                    }
                    toast.error(errorMessage, {
                        position: "top-right",
                        autoClose: 5000,
                        theme: "colored",
                    });
                } else {
                    console.error("Error adding expense:", error);
                    toast.error("Failed to get customer. Please try again later.", {
                        position: "top-right",
                        autoClose: 2500,
                        theme: "colored",
                    });
                }
            });
        setIsloading(false);
    }
    

    useEffect(() => {
        getdata();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
        ];
        const dateParts = dateString.slice(0, 10).split('-'); // Split the date string into an array [yyyy, mm, dd]
        const year = dateParts[0];
        const monthIndex = parseInt(dateParts[1], 10) - 1; // Convert month to zero-based index
        const day = dateParts[2];
        const monthName = monthNames[monthIndex]; // Get the month name

        return `${day} ${monthName} ${year}`; // Format the date as dd Month yyyy
    }


  return (
      <div className='container'>
          
      {/* <!-------------main body----------------> */}
      <main>
          <h1>Account Info</h1>
          {isloading ? <td colSpan="7">
            <InfinitySpin
                visible={true}
                width="200"
                color="#4fa94d"
                ariaLabel="infinity-spin-loading"
            />
            </td>:<></>}
            <div class="recent-orders form">
                <h2 className="mt-1 pl-2">user info</h2>
                <div class="entry-four">
                    <h3>Name:</h3>
                    <input type="text" value={userInfo.name} disabled/>
                    <h3>Email:</h3>
                    <input type="text" value={userInfo.email} disabled/>
                    <h3>DOC:</h3>
                    <input type="text" value={formatDate(userInfo.created_at)} disabled/>
                    <h3>Role:</h3>
                    {userInfo.roles && userInfo.roles.length > 0 ? (
                        userInfo.roles.map((role, index) => (
                            <input key={index} type="text" value={role.display_name} disabled/>
                        ))
                    ) : (
                        <p>No roles assigned.</p>
                    )}
                </div>
              </div>
              
              <button className="save" onClick={handleNew}>{buttonText}</button>
              
            {showForm ?        
              <div class="recent-orders form">
                <h2 className="mt-1 pl-2">Update User</h2>
                <div class="entry-four">
                    <h3>Old Password:</h3>
                    <input type="paswsord" value={oldPassword} onChange={(e)=>setOldPassword(e.target.value)}/>
                </div>
                <div class="entry-four">
                    <h3>New Password:</h3>
                    <input type="paswsord" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} />
                    <h3>Confirm Password</h3>
                    <input type="paswsord" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
                    <h3>New Name:</h3>
                    <input type="text" value={newName} onChange={(e)=>setNewName(e.target.value)}/>
                    <h3>New Email:</h3>
                    <input type="text" value={newEmail} onChange={(e)=>setNewEmail(e.target.value)}/>
                </div>
                <button class="save" onClick={handleSubmit}>Save</button>
              </div>
              :
              <div style={{marginLeft:'41%'}}>
                <p>do you want to update any thing</p>
              </div>
            }
      </main>
      
                  
        <div class="right">
            <main class="form" style={{marginTop:'5.6rem'}}>
                <h2 style={{margin:'5px'}}>Create New User</h2>
                <div class="entry-one">
                    <p>Name:</p>
                    <input type="text" />
                    <p>Email:</p>
                    <input type="text" />
                    <p>Password</p>
                    <input type="text" />
                    <p>confirm Password</p>
                    <input type="text"/>
                    <label htmlFor="">Role</label>
                    <select name="" id="">
                        <option value="manager">Manager</option>
                        <option value="manager">Cashier</option>
                    </select>
                </div>
            </main>
        </div>
    </div>
  )
}

export default UserUpdate