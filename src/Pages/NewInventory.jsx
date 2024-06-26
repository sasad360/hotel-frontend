import React from "react";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {toast} from "react-toastify"

const NewInventory = () => {
  const [plot_Type, setPlot_Type] = useState();
  const [updateId, setUpdateId] = useState();
  const [totalPlot, setTotalPlot] = useState('');
  const [description, setDescription] = useState('');
  const [selectedProvince, setSelectedProvince] = useState("");
  const [sideModel, setSideModel] =useState(false)

  const [roomNumber, setRoomNumber] = useState();
  const [block, setBlock] = useState();
  const [floor, setFloor] = useState();
  const [type, setType] = useState();
  const [product_name, setProduct_name] = useState();
  const [quantity, setQuantity] = useState();
  const [price, setPrice] = useState();


  const [datalist, setDatalist] = useState([]);



  const hanldeSubmit = () => {

    let errorMessage = '';

    // Check each required field
    if (!roomNumber) {
      errorMessage += "item label is required.\n";
    }
  
    if (!block) {
      errorMessage += "Quantity is required.\n";
    }
  
    if (!floor) {
      errorMessage += "Price is required.\n";
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
        product_name: roomNumber,
        quantity: block,
        price: floor,
      
    };
    axiosClient.post("inventory", payload)
      .then((response) => {
        toast.success( `${roomNumber} Added Sucessfully`, {
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
        setRoomNumber(''); // Clear roomNumber state
        setBlock(''); // Clear block state
        setFloor(''); // Clear floor state
        setType(''); // Clear type state
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
  };

  const updateCity =(item)=>{
    setSideModel(true)
    setUpdateId(item.id)
    setProduct_name(item.product_name);
    setQuantity(item.quantity);
    setPrice(item.price);
  }
  const handleUpdate =(data)=>{
    setSideModel(false)

    let payload = {
        product_name: product_name,
        quantity: quantity,
        price: price,
      };
      axiosClient.put(`inventory/${updateId}`, payload)
        .then((response) => {
          toast.success( `${product_name} Updated Sucessfully`, {
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
            axiosClient.delete(`inventory/${item.id}`)
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
      .get("inventory")
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
        <h1>Inventory List</h1>
        <div className="recent-orders">
            <table>
            <thead>
                <tr>
                <th>Sr.</th>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Created AT</th>
                <th>Updated AT</th>
                <th>Action</th>
                </tr>
            </thead>
                {datalist.length > 0 ? (
                  <tbody>
                    {datalist.map((item) => (
                      <tr key={item.id}>
                        <td className="primary">{item.id}</td>
                        <td className="primary">{item.product_name}</td>
                        <td className="info">{item.quantity}</td>
                        <td className="info">{item.price}</td>
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
                  <tbody>
                    <tr>
                      <td colSpan="7">No records found</td>
                    </tr>
                  </tbody>
                )}

            </table>
        </div>
      </main>
      <main>
        <div className="" style={{margin:'5.6rem 0 0 0', display:'flex', justifyContent:'center' }}>
            <div className="form">
                <h2>Add New Item</h2>
                <div className="entry-block">
                    <label>Item</label>
                    <input type="text" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} required />

                    <label>Quantity</label>
                    <input type="text" value={block} onChange={(e) => setBlock(e.target.value)} required />

                    <label>Price</label>
                    <input type="text" value={floor} onChange={(e) => setFloor(e.target.value)} required />

                </div>
                <button className="save" onClick={hanldeSubmit}>Add Item</button>
            </div>
        </div>
      </main>
      {sideModel &&

        <div className={`model-side ${sideModel ? "model-side-show" : ""}`}>
        <div className="model-side-closebtn" onClick={() => setSideModel(false)}>
        <span className="material-symbols-outlined rotate-icon">close</span>
        </div>
        <div className="form">
          <h2>Update Item</h2>
          <div className="entry-block">
              <label>Item</label>
              <input type="text" value={product_name} onChange={(e) => setProduct_name(e.target.value)} required />

              <label>Quantity</label>
              <input type="text" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />

              <label>Price</label>
              <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} required />

          </div>
        <button className="save" onClick={handleUpdate}>Update Room</button>
        </div>
        </div>
      }
    </div>
  );
};

export default NewInventory
