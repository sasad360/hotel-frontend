import React from "react";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {toast} from "react-toastify"

const NewDepartment = () => {
  const [plot_Type, setPlot_Type] = useState();
  const [updateId, setUpdateId] = useState();
  const [totalPlot, setTotalPlot] = useState('');
  const [selectedProvince, setSelectedProvince] = useState("");
  const [sideModel, setSideModel] =useState(false)

  const [position, setPosition] = useState();
  const [description, setDescription] = useState('');

  const [updatedDescription, setUpdatedDescription] = useState();
  const [updatedPosition, setUpdatedPosition] = useState();
  const [status, setStatus] = useState();

  const [datalist, setDatalist] = useState([]);
//   set data in put fields
  const CitySet = (data) => {
    setPlot_Type(data.target.value);
  };
  const Total_Plot = (data) => {
    setTotalPlot(data.target.value);
  };
  const Desc = (data) => {
    setDescription(data.target.value);
  };


  const hanldeSubmit = () => {

    let errorMessage = '';

    // Check each required field
    if (!position) {
      errorMessage += "Room Number is required.\n";
    }
  
    // If any required field is missing, show error message
    if (errorMessage) {
      toast.error(errorMessage.trim(), { // trim() removes trailing whitespace
        position: "top-right",
        autoClose: 2500,
        theme: "colored",
      });
      return;
    }
   
    let payload = {
      department_name: position,
        description: description,

    };
    axiosClient.post("department", payload)
      .then((response) => {
        toast.success( `${position} Added Sucessfully`, {
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

        getdata();
      })
      .catch((err) => {
          let errorMessage = "An error occurred. Please try again later."; // Default error message
          
          // Check if the error response contains a "message" field
          if (err.response && err.response.data && err.response.data.message) {
              // Extract the error message from the "message" field
              errorMessage = err.response.data.message;
              
              // If there are specific errors related to the department_name field
              if (err.response.data.errors && err.response.data.errors.department_name) {
                  // Extract the error message for the department_name field
                  const errorMessages = err.response.data.errors.department_name;
                  
                  // Check if the error messages array is not empty
                  if (errorMessages.length > 0) {
                      // Use the first error message from the array as the error message
                      errorMessage = errorMessages[0];
                  }
              }
          }
    
            // Show toast notification with the error message
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 1500,
                theme: "colored",
            });
        
            console.log(errorMessage); // Print the error message to the console
        });
    
    
  };

  const updateCity =(item)=>{
    setSideModel(true)
    setUpdateId(item.id)
    setUpdatedPosition(item.department_name);
    setUpdatedDescription(item.description);
  }
  const handleUpdate =(data)=>{
    setSideModel(false)

    let payload = {
        file_no: plot_Type,
        date: totalPlot,
        description: description,
      };
      axiosClient.post(`department/${updateId}`, payload)
        .then((response) => {
          toast.success( `${plot_Type} Updated Sucessfully`, {
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
        .catch((err) => {
          console.log(err)
          var firstErrorMessage = '';
          if (err.response.data.error && Object.keys(err.response.data.error).length != 0) {
            var errors = err.response.data.error
            const errorMessages = Object.values(errors); // Get an array of all error messages
            firstErrorMessage = errorMessages.shift(); // Get the first error message
            toast.error(firstErrorMessage[0], {
              position: "top-right",
              autoClose: 1500,
              theme: "colored",
            });
          } else {
            // console.log('firstErrorMessage',firstErrorMessage[0])
            toast.error(err.response.data.message, {
              position: "top-right",
              autoClose: 1500,
              theme: "colored",
            });
          }
        });
    
  }



const deleteCity = (item) => {
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
            axiosClient.delete(`department/${item.id}`)
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
    axiosClient
      .get("department")
      .then((response) => {
        setDatalist(response.data);
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

  const Model=()=>{

  }



  return (
    <div className="container">
      <main>
        <h1>Department List</h1>
        <div className="recent-orders">
            <table>
            <thead>
                <tr>
                <th>Sr.</th>
                <th>Department</th>
                <th>Description</th>
                <th>Created AT</th>
                <th>Updated AT</th>
                <th>Action</th>
                </tr>
            </thead>
            {datalist ? (
                <tbody>
                {datalist.map((item) => (
                    <tr key={item.id}>
                    <td className="primary">{item.id}</td>
                    <td className="primary">{item.department_name}</td>
                    <td className="info">{item.description}</td>
                    <td className="info">{item.created_at?.slice(0,10)}</td>
                    <td className="info">{item.updated_at?.slice(0,10)}</td>
                    <td className="flex">
                        <a className="primary" onClick={(e)=>{ e.preventDefault(); updateCity(item); }}>Edit</a>
                        <a className="warning" onClick={(e)=>{ e.preventDefault(); deleteCity(item); }}>Delete</a>
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
        <div className="" style={{margin:'5.6rem 0 0 0', display:'flex', justifyContent:'center' }}>
            <div className="form">
                <h2>Update Room</h2>
                <div className="entry-block">
                    <label>Position Title</label>
                    <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} required />

                    <label>Description</label>
                    <textarea type="text" value={description} onChange={(e) => setDescription(e.target.value)}/>
                </div>
                <button className="save" onClick={hanldeSubmit}>Add Department</button>
            </div>
        </div>
      </main>
      {sideModel &&

        <div className={`model-side ${sideModel ? "model-side-show" : ""}`}>
        <div className="model-side-closebtn" onClick={() => setSideModel(false)}>
        <span className="material-symbols-outlined rotate-icon">close</span>
        </div>
        <div className="form">
        <h2>Update Position</h2>
        <div className="entry-block">
            <label>Department</label>
            <input type="text" value={updatedPosition} onChange={(e) => setPosition(e.target.value)} required />

            <label>Description</label>
            <input type="text" value={updatedDescription} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <button className="save" onClick={handleUpdate}>Update</button>
        </div>
        </div>
        }
    </div>
  );
};

export default NewDepartment
