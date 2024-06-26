import React from "react";
import { useEffect, useState, useMemo } from "react";
import { useTable, usePagination, useSortBy, useFilters, useGlobalFilter } from 'react-table';
import axiosClient from "../axios-client";
import { useLocation } from 'react-router-dom';
import Swal from "sweetalert2";
import {toast} from "react-toastify"

const NewRoom = () => {
  const [plot_Type, setPlot_Type] = useState();
  const [updateId, setUpdateId] = useState();
  const [totalPlot, setTotalPlot] = useState('');
  const [description, setDescription] = useState('');
  const [selectedProvince, setSelectedProvince] = useState("");
  const [sideModel, setSideModel] =useState(false)
  const [updatedRoomNumber, setUpdatedRoomNumber] = useState("");
  const [updatedBlock, setUpdatedBlock] = useState("");
  const [updatedFloor, setUpdatedFloor] = useState("");
  const [updatedType, setUpdatedType] = useState("");
  const [updatedStatus, setUpdatedStatus] = useState("");

  const [roomNumber, setRoomNumber] = useState();
  const [block, setBlock] = useState();
  const [floor, setFloor] = useState();
  const [type, setType] = useState();
  const [status, setStatus] = useState();


  const [datalist, setDatalist] = useState([]);

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
    if (!roomNumber) {
      errorMessage += "Room Number is required.\n";
    }
  
    if (!block) {
      errorMessage += "Block is required.\n";
    }
  
    if (!floor) {
      errorMessage += "Floor is required.\n";
    }
  
    if (!type) {
      errorMessage += "Type is required.\n";
    }
  
    if (!status) {
      errorMessage += "Status is required.\n";
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
        room_number: roomNumber,
        block: block,
        floor: floor,
        type: type,
        status: status
    };
    axiosClient.post("rooms", payload)
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
        setStatus(''); // Clear status state
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
    setUpdatedRoomNumber(item.room_number);
    setUpdatedBlock(item.block);
    setUpdatedFloor(item.floor);
    setUpdatedType(item.type);
  }

  const handleUpdate =(data)=>{
    setSideModel(false)

    let payload = {
        room_number: updatedRoomNumber,
        block: updatedBlock,
        floor: updatedFloor,
        type: updatedType,
        status: updatedStatus
      };
      axiosClient.put(`rooms/${updateId}`, payload)
        .then((response) => {
          toast.success( `${updatedRoomNumber} Updated Sucessfully`, {
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
              axiosClient.post(`del_new_file/${item.id}`)
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
      .get("rooms")
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

  // Define columns and data
  const columns = useMemo(
      () => [
          { Header: 'Sr.', accessor: 'id' },
          { Header: 'Room No.', accessor: 'room_number' },
          { Header: 'Block', accessor: 'block' },
          { Header: 'Floor', accessor: 'floor' },
          { Header: 'Type', accessor: 'type' },
          { Header: 'Status', accessor: 'status' },
          { Header: 'Created At', accessor: 'created_at', Cell: ({ value }) => value?.slice(0, 10) },
          { Header: 'Updated At', accessor: 'updated_at', Cell: ({ value }) => value?.slice(0, 10) },
          {
              Header: 'Action',
              Cell: ({ row }) => (
                  <div className="flex">
                      <a className="primary" onClick={() => updateCity(row.original)}>Edit</a>
                      <a className="warning" onClick={() => deleteCity(row.original)}>Delete</a>
                  </div>
              )
          }
      ],
      []
  );

  // Initialize react-table hooks
  const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      page,
      prepareRow,
      setGlobalFilter,
      gotoPage,
      previousPage,
      nextPage,
      canPreviousPage,
      canNextPage,
      pageCount,
      state: { pageIndex, pageSize, globalFilter },
      setPageSize 
  } = useTable(
      {
          columns,
          data: datalist || [],
          initialState: { pageIndex: 0, pageSize: 10 }, // Default starting page index and page size
      },
      useFilters,
      useGlobalFilter,
      useSortBy,
      usePagination
  );

  // Search handler
  const handleSearch = (e) => {
      const value = e.target.value || '';
      setGlobalFilter(value);
  };


  return (
    <div className="container">
      <main>
      <h1>Room List</h1>
        <div className="mt-1 table-search d-flex">
          <input
              type="text"
              placeholder="Search in table..."
              value={globalFilter || ''}
              onChange={handleSearch}
          />
          <div>
              <button className="py-1" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                  Previous
              </button>
              <button className="py-1" onClick={nextPage} disabled={!canNextPage}>
                  Next
              </button>
              <span className="py-1">
                  Page <strong>{pageIndex + 1} of {pageCount}</strong>
              </span>
              <select
                  className="tablePagination"
                  value={pageSize}
                  onChange={(e) => {
                      const size = Number(e.target.value);
                      gotoPage(0);
                      setPageSize(size);
                  }}
              >
                  {[10, 20, 50, 100].map((size) => (
                      <option key={size} value={size}>
                          Show {size}
                      </option>
                  ))}
              </select>
          </div>
        </div>


        <div className="recent-orders">
          {/* Table */}
          <table {...getTableProps()} className="table">
              <thead>
                  {headerGroups.map((headerGroup) => (
                      <tr {...headerGroup.getHeaderGroupProps()}>
                          {headerGroup.headers.map((column) => (
                              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                  {column.render('Header')}
                                  <span>
                                      {column.isSorted
                                          ? column.isSortedDesc
                                              ? ' 🔽'
                                              : ' 🔼'
                                          : ''}
                                  </span>
                              </th>
                          ))}
                      </tr>
                  ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                  {page.map((row, i) => {
                      prepareRow(row);
                      return (
                          <tr {...row.getRowProps()}>
                              {row.cells.map((cell) => (
                                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                              ))}
                          </tr>
                      );
                  })}
              </tbody>
          </table>
        </div>
      </main>
      <main>
        <div className="" style={{margin:'5.6rem 0 0 0', display:'flex', justifyContent:'center' }}>
            <div className="form">
                <h2>Add Room</h2>
                <div className="entry-block">
                    <label>Room Number</label>
                    <input type="text" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} required />

                    <label>Block</label>
                    <input type="text" value={block} onChange={(e) => setBlock(e.target.value)} required />

                    <label>Floor</label>
                    <input type="text" value={floor} onChange={(e) => setFloor(e.target.value)} required />

                    <label>Type</label>
                    <input type="text" value={type} onChange={(e) => setType(e.target.value)} required />

                    <label>Status</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} required>
                        <option>Chose Option</option>
                        <option value="available" selected={status === "available"}>Available</option>
                        <option value="booked" selected={status === "booked"}>Booked</option>
                        <option value="maintenance" selected={status === "maintenance"}>Under Maintenance</option>
                    </select>

                </div>
                <button className="save" onClick={hanldeSubmit}>Add Room</button>
            </div>
        </div>
      </main>
      {sideModel &&

        <div className={`model-side ${sideModel ? "model-side-show" : ""}`}>
        <div className="model-side-closebtn" onClick={() => setSideModel(false)}>
        <span className="material-symbols-outlined rotate-icon">close</span>
        </div>
        <div className="form">
        <h2>Update Room</h2>
        <div className="entry-block">
            <label>Room Number</label>
            <input type="text" value={updatedRoomNumber} onChange={(e) => setUpdatedRoomNumber(e.target.value)} required />

            <label>Block</label>
            <input type="text" value={updatedBlock} onChange={(e) => setUpdatedBlock(e.target.value)} required />

            <label>Floor</label>
            <input type="text" value={updatedFloor} onChange={(e) => setUpdatedFloor(e.target.value)} required />

            <label>Type</label>
            <input type="text" value={updatedType} onChange={(e) => setUpdatedType(e.target.value)} required />

            <label>Status</label>
            <select value={updatedStatus} onChange={(e) => setUpdatedStatus(e.target.value)} required>
            <option value="">Chose Option</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="under maintenance">Under Maintenance</option>
            </select>
        </div>
        <button className="save" onClick={handleUpdate}>Update Room</button>
        </div>
        </div>
      }
    </div>
  );
};

export default NewRoom
