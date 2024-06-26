import { React, useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {toast} from "react-toastify";
// import DatePicker from 'react-datepicker';
// import "react-datepicker/dist/react-datepicker.css";


const NewEmployee = () => {
    const [employeelist, setEmployeelist] = useState();
    const [sideModel, setSideModel] = useState(false);
    const [employeeId, setEmployeeId] = useState();
    const [employeeUpdateId, setEmployeeUpdateId] = useState();
    const [formData, setFormData] = useState({
        name: '',
        date_of_birth: '',
        gender: '',
        contact_number: '',
        email: '',
        address: '',
        department_id: '',
        position_id: '',
        salary: '',
        hire_date: '',
        identy_number: '',
        salary_type: '',
    });
    const [formUpdateData, setFormUpdateData] = useState({
        id: '',
        name: '',
        date_of_birth: '',
        gender: '',
        contact_number: '',
        email: '',
        address: '',
        department_id: '',
        position_id: '',
        salary: '',
        hire_date: '',
        identy_number: '',
        salary_type: '',
    });
    
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setFormUpdateData({
          ...formUpdateData,
          [name]: value
        });
    };

    const hanldeSubmit = () => {
        let errorMessage = '';
      
        // Check if any required field is empty
        for (const field in formData) {
          if (!formData[field].trim()) {
            errorMessage += `${field.replace('_', ' ').toUpperCase()} is required.\n`;
          }
        }
      
        // If any required field is missing, show error message
        if (errorMessage) {
          toast.error(errorMessage.trim(), {
            position: "top-right",
            autoClose: 2500,
            theme: "colored",
          });
          return;
        }
      
        // Construct FormData object from formData state
        let formDataObj = new FormData();
        for (const key in formData) {
          formDataObj.append(key, formData[key]);
        }
        // alert(formDataObj);
        // Send POST request to the backend API
        axiosClient.post("employee", formDataObj)
          .then((response) => {
            // Show success toast notification
            toast.success(`${formData.name} added successfully`, {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
      
            // Clear fields after successful submission
            setFormData({
              name: '',
              date_of_birth: '',
              gender: '',
              contact_number: '',
              email: '',
              address: '',
              department_id: '',
              position_id: '',
              salary: '',
              hire_date: '',
              identy_number: '',
              salary_type: '',
            });
      
            // Optionally, fetch updated data or perform any other actions
            getdata();
          })
          .catch((error) => {
            // Default error message
            let errorMessage = "An error occurred. Please try again later.";
      
            // Check if the error response contains a "message" field
            if (error.response && error.response.data && error.response.data.message) {
              errorMessage = error.response.data.message;
            }
      
            // Show toast notification with the error message
            toast.error(errorMessage, {
              position: "top-right",
              autoClose: 1500,
              theme: "colored",
            });
      
            // Print the error message to the console
            console.error(errorMessage);
          });
    };

    const updateData =(item)=>{
        setSideModel(true)
        setFormUpdateData(item)
        setEmployeeUpdateId(item.id);
    }

    const handleUpdate =(data)=>{


        axiosClient.put(`employee/${employeeUpdateId}`, formUpdateData)
        .then((response) => {
            toast.success( `${employeeId} Updated Sucessfully`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
            getdata();
            setSideModel(false)

            
        })
        .catch((error) => {
            let firstErrorMessage = '';
            
            if (error.response && error.response.data && error.response.data.errors && Object.keys(error.response.data.errors).length !== 0) {
                const errors = error.response.data.errors;
                const errorMessages = Object.values(errors); // Get an array of all error messages
                firstErrorMessage = errorMessages[0][0]; // Get the first error message
                
                toast.error(firstErrorMessage, {
                    position: "top-right",
                    autoClose: 1500,
                    theme: "colored",
                });
            } else if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message, {
                    position: "top-right",
                    autoClose: 1500,
                    theme: "colored",
                });
            } else {
                toast.error('An unexpected error occurred. Please try again.', {
                    position: "top-right",
                    autoClose: 1500,
                    theme: "colored",
                });
            }
        });
        
    
    }

    const deleteData = (item) => {
        Swal.fire({
        title: "please confirm?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                axiosClient.delete(`employee/${item.id}`)
                .then((response) => {
                    toast.success(response.data.message, {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                    getdata();
                })
            .catch((error) => {
                toast.error("record not found", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                });
        });
    };
        })
    }
    
    //receive data
    const getdata = () => {
        axiosClient.get("employee")
            .then((response) => {
                setEmployeelist(response.data);
                // console.log(employeelist);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const hanldeEdit = (data) => {
    alert(data);
    };
    useEffect(() => {
     getdata();
    }, []);
      
    const [departments, setDepartments] = useState([]); // State variable for departments
    const [positions, setPositions] = useState([]); // State variable for positions

    useEffect(() => {
        // Fetch departments
        axiosClient.get('department')
            .then(response => {
                setDepartments(response.data);
            })
            .catch(error => {
                console.error('Error fetching departments:', error);
                toast.error('Error fetching departments. Please try again later.');
            });

        // Fetch positions
        axiosClient.get('position')
            .then(response => {
                setPositions(response.data);
            })
            .catch(error => {
                console.error('Error fetching positions:', error);
                toast.error('Error fetching positions. Please try again later.');
            });
    }, []); // Run this effect only once on component mount

    
  return (
    <div className='container'>
        <main>
            <h1>Employees List</h1>
            <div className="recent-orders">
                <table>
                    <thead>
                        <tr>
                        <th>Sr.</th>
                        <th>Name</th>
                        <th>Mobile</th>
                        <th>Type</th>
                        <th>Role</th>
                        <th>Department</th>
                        <th>Joining</th>
                        <th>Salary</th>
                        <th>Action</th>
                        </tr>
                    </thead>

                {employeelist ? (
                    <tbody>
                    {employeelist.map((item,nu) => (
                        <tr key={item.id}>
                        <td className="primary">{nu+1}</td>
                        <td className="primary">{item.name}</td>
                        <td className="info">{item.contact_number}</td>
                        <td className="info">{item.salary_type}</td>
                        <td className="info">{item.position_title}</td>
                        <td className="info">{item.department_title}</td>
                        <td className="info">{item.hire_date?.slice(0,10)}</td>
                        <td className="info">{item.salary}</td>
                        <td className="flex">
                            <a className="primary" onClick={(e)=>{ e.preventDefault(); updateData(item); }}>Edit</a>
                            <a className="warning" onClick={(e)=>{ e.preventDefault(); deleteData(item); }}>Delete</a>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                ) : (
                    <td>no Record found</td>
                )}
                </table>
            </div>
        </main>
        <main>
            <div className="" style={{margin:'5.6rem 0 0 0'}}>
                <div className="form">
                    <h2>Add Employee</h2>
                    <div className="entry-one">
                        <label>Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

                        <label>Date of Birth</label>
                        <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} required />

                        <label>Gender</label>
                        {/* <input type="text" name="gender" value={formData.gender} onChange={handleChange} required /> */}
                        <select name='gender' onChange={handleChange}>
                            <option>Chose and Option</option>
                            <option value='Male'>Male</option>
                            <option value='Female'>Female</option>
                        </select>
                        <label>Contact Number</label>
                        <input type="text" name="contact_number" value={formData.contact_number} onChange={handleChange} required />

                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

                        <label>Address</label>
                        <textarea type="text" name="address" value={formData.address} onChange={handleChange} required />

                        <label>Department</label>
                        <select name="department_id" value={formData.department_id} onChange={handleChange} required>
                            <option value="">Select Department</option>
                            {departments.map(department => (
                                <option key={department.id} value={department.id}>{department.department_name}</option>
                            ))}
                        </select>

                        <label>Position</label>
                        <select name="position_id" value={formData.position_id} onChange={handleChange} required>
                            <option value="">Select Position</option>
                            {positions.map(position => (
                                <option key={position.id} value={position.id}>{position.position_title}</option>
                            ))}
                        </select>
                        <label>Salary</label>
                        <input type="text" name="salary" value={formData.salary} onChange={handleChange} required />

                        <label>Hire Date</label>
                        <input type="date" name="hire_date" value={formData.hire_date} onChange={handleChange} required />
                        {/* <DatePicker
                            selected={formData.hire_date}
                            onChange={handleChange}
                            dateFormat="dd/MM/yyyy" // Customize the date format if needed
                            placeholderText="Select hire date" // Placeholder text for the input field
                            required
                        /> */}
                        <label>Identity Number</label>
                        <input type="text" name="identy_number" value={formData.identy_number} onChange={handleChange} required />

                        <label>Salary Type</label>
                        {/* <input type="text" name="salary_type" value={formData.salary_type} onChange={handleChange} required /> */}
                        <select name='salary_type' onChange={handleChange}>
                            <option>Chose and Option</option>
                            <option value='Hourly'>Hourly</option>
                            <option value='Monthly'>Monthly</option>
                        </select>
                    </div>

                    <button className="save" onClick={hanldeSubmit}>Add Employee</button>
                </div>
            </div>
        </main>

        {sideModel &&
            <div className={`model-side ${sideModel ? "model-side-show" : ""}`}>
                <div className="model-side-closebtn" onClick={() => setSideModel(false)}>
                    <span className="material-symbols-outlined rotate-icon">close</span>
                </div>
                <div className="form">
                    <h2>Edit Employee</h2>
                    <div className="entry-one">
                        <label>Name</label>
                        <input type="text" name="name" value={formUpdateData.name} onChange={handleUpdateChange} required />

                        <label>Date of Birth</label>
                        <input type="date" name="date_of_birth" value={formUpdateData.date_of_birth} onChange={handleUpdateChange} required />

                        <label>Gender</label>
                        {/* <input type="text" name="gender" value={formData.gender} onChange={handleUpdateChange} required /> */}
                        <select name='gender' onChange={handleUpdateChange}>
                            <option>Chose and Option</option>
                            <option value='Male'>Male</option>
                            <option value='Female'>Female</option>
                        </select>
                        <label>Contact Number</label>
                        <input type="text" name="contact_number" value={formUpdateData.contact_number} onChange={handleUpdateChange} required />

                        <label>Email</label>
                        <input type="email" name="email" value={formUpdateData.email} onChange={handleUpdateChange} required />

                        <label>Address</label>
                        <textarea type="text" name="address" value={formUpdateData.address} onChange={handleUpdateChange} required />

                        <label>Department</label>
                        <select name="department_id" value={formUpdateData.department_id} onChange={handleUpdateChange} required>
                            <option value="">Select Department</option>
                            {departments.map(department => (
                                <option key={department.id} value={department.id}>{department.department_name}</option>
                            ))}
                        </select>

                        <label>Position</label>
                        <select name="position_id" value={formUpdateData.position_id} onChange={handleUpdateChange} required>
                            <option value="">Select Position</option>
                            {positions.map(position => (
                                <option key={position.id} value={position.id}>{position.position_title}</option>
                            ))}
                        </select>

                        <label>Salary</label>
                        <input type="text" name="salary" value={formUpdateData.salary} onChange={handleUpdateChange} required />

                        <label>Hire Date</label>
                        <input type="date" name="hire_date" value={formUpdateData.hire_date} onChange={handleUpdateChange} required />

                        <label>Identity Number</label>
                        <input type="text" name="identy_number" value={formUpdateData.identy_number} onChange={handleUpdateChange} required />

                        <label>Salary Type</label>
                        {/* <input type="text" name="salary_type" value={formData.salary_type} onChange={handleUpdateChange} required /> */}
                        <select name='salary_type' onChange={handleUpdateChange}>
                            <option>Chose and Option</option>
                            <option value='Hourly'>Hourly</option>
                            <option value='Monthly'>Monthly</option>
                        </select>
                    </div>
                    
                    <button className="save" onClick={handleUpdate}>Update Employee</button>

                </div>
            </div>
        }

    </div>
  )
}

export default NewEmployee
