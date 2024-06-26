import React from "react";
import { useEffect, useState ,useMemo} from "react";
import { useTable, usePagination, useSortBy, useFilters, useGlobalFilter } from 'react-table';

import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {toast} from "react-toastify"

const NewPosition = () => {
  const [updateId, setUpdateId] = useState();
  const [sideModel, setSideModel] =useState(false)

  const [position, setPosition] = useState();
  const [description, setDescription] = useState('');
  const [updatedPosition, setUpdatedPosition] = useState();
  const [updatedDescription, setUpdatedDescription] = useState('');


  const [datalist, setDatalist] = useState();

  const hanldeSubmit = () => {

    let errorMessage = '';

    // Check each required field
    if (!position) {
      errorMessage += "position is required.\n";
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
        position_title: position,
        description: description,

    };
    axiosClient.post("position", payload)
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
        setDescription('');
        setPosition('')
      })
      .catch((err) => {
        let errorMessage = "An error occurred. Please try again later."; // Default error message
        
        // Check if the error response contains a "data" object with a "position_title" field
        if (err.response && err.response.data && err.response.data.position_title) {
            // Extract the error message for the "position_title" field
            const errorMessages = err.response.data.position_title;
            
            // Check if the error messages array is not empty
            if (errorMessages.length > 0) {
                // Use the first error message from the array as the error message
                errorMessage = errorMessages[0];
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

  const updateData =(item)=>{
    setSideModel(true)
    setUpdateId(item.id)
    setUpdatedPosition(item.position_title);
    setUpdatedDescription(item.description);
  }
  const handleUpdate =(data)=>{
    setSideModel(false)

    let payload = {
        position_title: position,
        description: description,
        // description: description,
      };
      axiosClient.put(`position/${updateId}`, payload)
        .then((response) => {
          toast.success( `${payload.position_title} Updated Sucessfully`, {
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
          setUpdatedDescription('');
          setUpdatedPosition('');
        })
        .catch((err) => {
          console.log(err)
          var firstErrorMessage = '';
          if (err.response.data.error && Object.keys(err.response.data.error).length !== 0) {
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
            axiosClient.delete(`position/${item.id}`)
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
      .get("position")
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
        <h1>Position List</h1>
        <div className="recent-orders">
            <table>
            <thead>
                <tr>
                <th>Sr.</th>
                <th>Position</th>
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
                    <td className="primary">{item.position_title}</td>
                    <td className="info">{item.description}</td>
                    <td className="info">{item.created_at?.slice(0,10)}</td>
                    <td className="info">{item.updated_at?.slice(0,10)}</td>
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
        <div className="" style={{margin:'5.6rem 0 0 0', display:'flex', justifyContent:'center' }}>
            <div className="form">
                <h2>Add New Position</h2>
                <div className="entry-block">
                    <label>Position Title</label>
                    <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} required />

                    <label>Description</label>
                    <textarea type="text" value={description} onChange={(e) => setDescription(e.target.value)}/>
                </div>
                <button className="save" onClick={hanldeSubmit}>Add Position</button>
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
            <label>Position Title</label>
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

export default NewPosition
