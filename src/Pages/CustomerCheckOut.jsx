import React from "react";
import { useEffect, useState, useRef } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify"
import { InfinitySpin } from "react-loader-spinner";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable';
import logoImg from '../Images/visioninn.png'

const CustomerCheckOut = () => {
    const [updateId, setUpdateId] = useState();
    const [sideModel, setSideModel] = useState(false)
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [isloading, setIsloading] = useState(false);
    const [showSC, setShowSC] = useState(false);


    const [block, setBlock] = useState();
    const [room, setRoom] = useState();
    const [service, setService] = useState();
    const [serviceCharges, setServiceCharges] = useState();
    const [quantity, setQuantity] = useState();
    const [price, setPrice] = useState();
    const [uom, setUOM] = useState();
    const [name, setName] = useState();
    const [datalist, setDatalist] = useState([null]);
    const [headlist, setHeadlist] = useState([]);
    const [searchID, setSearchID] = useState('');
    const [searchCustomer, setSearchCustomer] = useState('');
    const [serviceChargeList, setServiceChargeList] = useState([]);

    const [selectedBooking, setSelectedBooking] = useState([]);
    // const [searchedRoomNo, setSearchRoomNo] = useState('null');

    const [selectedDay, setSelectedDay] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [menuItems, setMenuItems] = useState([]);
    const [checkoutRemarks, setCheckoutRemarks] = useState('');

    const clearDataList = () =>{
        Swal.fire({
            title: "please confirm?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Clear it!",
        }).then((result) => {
            if (result.isConfirmed) {
                setDatalist(['null'])
            }
        })
    }

    const confirmCheckOut = () =>{
        Swal.fire({
            title: "please confirm?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Clear it!",
        }).then((result) => {
            if (result.isConfirmed) {
                const payload = {
                    booking_id: datalist.booking_id, // Assuming datalist.booking_id is the correct ID
                    remarks: checkoutRemarks, // Assuming checkoutRemarks is the state holding the remarks
                };
            
                axiosClient.post('booking/checkoutConfirm', payload)
                    .then((response) => {
                        setDatalist(response.data);
                        setSearchID('');
                        setSearchCustomer('');
                        toast.success('Checkout successful.', {
                            position: "top-right",
                            autoClose: 2000,
                            theme: "colored",
                        });
                    })
                    .catch((error) => {
                        if (error.response && error.response.data && error.response.data.message) {
                            toast.error(error.response.data.message, {
                                position: "top-right",
                                autoClose: 5000,
                                theme: "colored",
                            });
                        } else {
                            console.error("Error during checkout:", error);
                            toast.error("An unknown error occurred", {
                                position: "top-right",
                                autoClose: 2500,
                                theme: "colored",
                            });
                        }
                    });
            }
        })
    }

    const handleSearch = (item) => {

        let errorMessage = '';

        // Validate that at least one of searchID or searchCustomer is provided
        if (!searchID && !searchCustomer) {
            errorMessage += "Please enter Room No or Booking ID or Customer Search Param\n";
            // Display the error message using toast
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000,
                theme: "colored",
            });
            return;
        }
    
        const payload = {
            booking_id: searchID,
            customer_param: searchCustomer,
        };
 
        axiosClient.post(`booking/checkout`, payload)
            .then((response) => {
                setDatalist(response.data);
                setSearchID('');
                setSearchCustomer('');
                toast.success(`Record founded successfully.`, {
                    position: "top-right",
                    autoClose: 2000,
                    theme: "colored",
                });
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.errors) {
                    const errors = error.response.data.errors;
                    let errorMessage = '';
                    errors.forEach((err) => {
                        errorMessage += err + '\n';
                    });
                    toast.error(errorMessage, {
                        position: "top-right",
                        autoClose: 5000,
                        theme: "colored",
                    });
                } else {
                    console.error("Error adding expense:", error);
                    toast.error("An unknown error occurred", {
                        position: "top-right",
                        autoClose: 2500,
                        theme: "colored",
                    });
                }
            });
            
    }
    
    const AddService = (item) => {
        setSideModel(true)
        setUpdateId(item.id);
        setName(item.customer.name);
        setRoom(item.room.room_number);
        setDescription(item.description);
        setAmount(item.price);
        setUOM(item.unit_of_measurement);
        setQuantity(item.quantity);
    }

    const handleService = (data) => {
        setSideModel(false)

        const payload = {
            booking_id: searchID,
            customer_param:searchCustomer,
        };
 
        axiosClient.post(`booking/checkout`, payload)
            .then((response) => {
                toast.success(`Data fetched Sucessfully`, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                setDatalist(response.data);
                console.log(response.data)
                setSearchID();
                setSearchCustomer();
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

    const deleteItem = (item) => {
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
                axiosClient.delete(`weekly-menu/${item.id}`)
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
                        // getdata();
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

    // const getdata = () => {
    //     axiosClient.get("booking")
    //         .then((response) => {
    //             setDatalist(response.data.bookings);
    //             setIsloading(false);
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // }

    const getexpensedata = () => {
        axiosClient.get("menuitems")
            .then((response) => {
                setMenuItems(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const printRef = useRef();

    // const generatePDF = () => {
    //     const input = printRef.current;
    //     if (!input || !datalist) {
    //         console.error('Invalid element provided as first argument or datalist is null');
    //         return;
    //     }

    //     html2canvas(input, { scale: 2 })
    //         .then((canvas) => {
    //             const imgData = canvas.toDataURL('image/png');
    //             const pdf = new jsPDF('p', 'mm', 'a4');
    //             const imgWidth = 210;
    //             const pageHeight = 297;
    //             const imgHeight = (canvas.height * imgWidth) / canvas.width;
    //             let heightLeft = imgHeight;
    //             let position = 0;

    //             // Header
    //             pdf.setFontSize(22);
    //             pdf.text('Final Bill', 15, 20);
    //             pdf.setFontSize(12);
    //             pdf.text(`Customer: ${datalist.customer_name}`, 15, 30);
    //             pdf.text(`Room Number: ${datalist.room_number}`, 15, 35);
    //             pdf.text(`Arrival Date: ${datalist.arrival_date}`, 15, 40);
    //             pdf.text(`Days Stayed: ${datalist.days_stayed}`, 15, 45);
    //             pdf.text(`Total Rent: ${datalist.total_rent}`, 15, 50);

    //             // Add content
    //             pdf.addImage(imgData, 'PNG', 0, 30, imgWidth, imgHeight);
    //             heightLeft -= pageHeight;

    //             while (heightLeft >= 0) {
    //                 position = heightLeft - imgHeight;
    //                 pdf.addPage();
    //                 pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    //                 heightLeft -= pageHeight;
    //             }

    //             // Footer
    //             const footer = () => {
    //                 pdf.setFontSize(10);
    //                 pdf.text('Thank you for staying with us!', 15, pageHeight - 10);
    //             };
    //             footer();

    //             pdf.save(`${datalist.customer_name} bill.pdf`);
    //         })
    //         .catch((err) => {
    //             console.error('Error generating PDF', err);
    //         });
    // };

    const generatePDF22 = () => {
    if (!datalist) {
            console.error('No data available to generate PDF');
            return;
        }

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageHeight = 297;
    const imgWidth = 210; // Full width of the page
    const imgHeight = 30; // Height of the header image
    const headerHeight = 40; // Adjust as needed
    let yOffset = 10;

    // Draw header background
    pdf.setFillColor(200, 200, 255); // Light blue color
    pdf.rect(0, 0, imgWidth, headerHeight, 'F');

    // Add logo
    pdf.addImage(logoImg, 'PNG', 15, 10, 30, 30); // Adjust the position and size as needed

    // Add hotel details
    pdf.setFontSize(22);
    pdf.text('VisionInn', 50, 20);
    pdf.setFontSize(12);
    pdf.text('Hotel & Restaurant Murree', 50, 30);
    pdf.setFontSize(10);
    pdf.text('Email: contact@visioninn.com', 50, 40);
    pdf.text('Phone: +1234567890', 50, 45);

    yOffset = headerHeight + 20; // Adjust yOffset after header

    pdf.setFontSize(12);
    pdf.text(`Customer: ${datalist.customer_name}`, 15, 30);
    pdf.text(`Room Number: ${datalist.room_number}`, 15, 35);
    pdf.text(`Arrival Date: ${datalist.arrival_date}`, 15, 40);
    pdf.text(`Days Stayed: ${datalist.days_stayed}`, 15, 45);
    pdf.text(`Total Rent: ${datalist.total_rent}`, 15, 50);

        // Add service charges table
        pdf.setFontSize(14);
        pdf.text('Service Charges', 15, yOffset);
        yOffset += 10;
        pdf.setFontSize(12);

        const tableColumn = ["No.", "Date", "Charges Title", "Total Charges"];
        const tableRows = [];

        datalist.service_charges.forEach((service, index) => {
            const serviceData = [
                index + 1,
                service.service_date,
                service.service_name,
                service.service_charge
            ];
            tableRows.push(serviceData);
        });

        pdf.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: yOffset,
            theme: 'plain',
            styles: {
                fontSize: 10,
                cellPadding: 2,
            },
            headStyles: {
                fillColor: [200, 200, 200],
                textColor: 0,
            }
        });

        // Add footer
        pdf.setFontSize(10);
        pdf.text('Thank you for staying with us!', 15, pageHeight - 10);

        // Save the PDF
        pdf.save(`${datalist.customer_name} bill.pdf`);
    };

    const generatePDF = () => {
        if (!datalist) {
            console.error('No data available to generate PDF');
            return;
        }
    
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageHeight = 297;
        const imgWidth = 210; // Full width of the page
        const headerHeight = 40; // Adjusted header height
        let yOffset = 10;
    
        // Draw header background
        pdf.setFillColor(150, 172, 247); // Light blue color
        pdf.rect(0, 0, imgWidth, headerHeight, 'F');
    
        // Add logo
        pdf.addImage(logoImg, 'PNG', 15, 10, 20, 20); // Adjust the position and size as needed
    
        // Add hotel details
        pdf.setFontSize(22);
        pdf.text('Visioninn Hotel & Restaurant', imgWidth / 2, 15, { align: 'center' });
        pdf.setFontSize(12);
        pdf.text('Nathiagali road, Tauheedabad', imgWidth / 2, 22, { align: 'center' });
        pdf.setFontSize(10);
        pdf.text('Email: contact@visioninn.com', imgWidth / 2, 29, { align: 'center' });
        pdf.text('Phone: +1234567890', imgWidth / 2, 34, { align: 'center' });
    
        yOffset = headerHeight + 20; // Adjust yOffset after header
    
        // Add customer details
        pdf.setFontSize(12);
        pdf.text(`Customer: ${datalist.customer_name}`, 15, yOffset);
        yOffset += 5;
        pdf.text(`Room Number: ${datalist.room_number}`, 15, yOffset);
        yOffset += 5;
        pdf.text(`Arrival Date: ${datalist.arrival_date}`, 15, yOffset);
        yOffset += 5;
        pdf.text(`Days Stayed: ${datalist.days_stayed}`, 15, yOffset);
        yOffset += 5;
        
    
        // Add top line before main items
        pdf.setLineWidth(0.5);
        pdf.line(10, yOffset, imgWidth - 10, yOffset);
        yOffset += 5;
    
        // Add service charges table
        pdf.setFontSize(14);
        pdf.text('Service Charges', imgWidth / 2, yOffset, { align: 'center' });
        yOffset += 10;
        pdf.setFontSize(12);
    
        const serviceTableColumn = ["No.", "Date", "Charges Title", "Total Charges"];
        const serviceTableRows = [];
    
        datalist.service_charges.forEach((service, index) => {
            const serviceData = [
                index + 1,
                service.service_date,
                service.service_name,
                service.service_charge
            ];
            serviceTableRows.push(serviceData);
        });
    
        pdf.autoTable({
            head: [serviceTableColumn],
            body: serviceTableRows,
            startY: yOffset,
            theme: 'plain',
            styles: {
                fontSize: 10,
                cellPadding: 2,
            },
            headStyles: {
                fillColor: [200, 200, 200],
                textColor: 0,
            }
        });
    
        // Get final Y position after service charges table
        yOffset = pdf.lastAutoTable.finalY + 10;
    
        // // Add line between tables
        // pdf.line(10, yOffset, imgWidth - 10, yOffset);
        // yOffset += 10;
    
        // Add dining bill table
        pdf.setFontSize(14);
        pdf.text('Dining Charges', imgWidth / 2, yOffset, { align: 'center' });
        yOffset += 10;
        pdf.setFontSize(12);
    
        const diningTableColumn = ["No.", "Date", "Charges Title", "Total Charges"];
        const diningTableRows = [];
    
        datalist.bills.forEach((bill, index) => {
            diningTableRows.push([
                index + 1,
                bill.bill_date,
                bill.bill_details,
                bill.total_amount,
            ]);
        });
    
        pdf.autoTable({
            head: [diningTableColumn],
            body: diningTableRows,
            startY: yOffset,
            theme: 'plain',
            styles: {
                fontSize: 10,
                cellPadding: 2,
            },
            headStyles: {
                fillColor: [200, 200, 200],
                textColor: 0,
            }
        });
    
        // Get final Y position after service charges table
        yOffset = pdf.lastAutoTable.finalY + 10;

        // yOffset = pdf.lastAutoTable.finalY + 10;

        pdf.text(`Dinning Charges: ${datalist.total_bills_amount}`, 15, yOffset);
        yOffset += 5;

        pdf.text(`Service Charges: ${datalist.total_service_charges}`, 15, yOffset);
        yOffset += 5;

        pdf.text(`Rent Charges: ${datalist.total_rent}`, 15, yOffset);
        yOffset += 5;

        pdf.text(`Total Payable: ${datalist.grand_total}`, 15, yOffset);
        yOffset += 5;
    

    
        // Add footer
        pdf.setFontSize(10);
        pdf.text('Thank you for staying with us!', imgWidth / 2, pageHeight - 20, { align: 'center' });
        pdf.setFontSize(8);
        pdf.text('Powered by: SCTechnologies', imgWidth / 2, pageHeight - 10, { align: 'center' });
    
        // Get current date and time
        const now = new Date();
        const formattedDate = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
        const formattedTime = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
        const timestamp = `${formattedDate}${formattedTime}`;

        // Save the PDF with the current date, time, and year
        pdf.save(`${datalist.customer_name}_bill_${timestamp}.pdf`);

    };
    

    useEffect(() => {
        // getdata();
        getexpensedata();
    }, []);

    return (
        <div className="container">
            <main>
                <h1>Customer Checkout</h1>
                <div className="recent-orders" ref={printRef}>
                    {datalist && datalist.service_charges && datalist.service_charges.length > 0 ? (
                        <>
                            <h2>Customer Info</h2>
                            <div className="entry-customer">
                                <p>Customer Name</p>
                                <h2>{datalist.customer_name}</h2>
                                <p>Arrival Date</p>
                                <h2>{datalist.arrival_date}</h2>
                                <p>Total Days</p>
                                <h2>{datalist.days_stayed}</h2>
                                <p>Booking ID</p>
                                <h2>{datalist.booking_id}</h2>
                                <p>Total Rent</p>
                                <h2>{datalist.total_rent}</h2>
                                <p>Service Charges</p>
                                <h2>{datalist.total_service_charges}</h2>
                                <p>Dinning Charges</p>
                                <h2>{datalist.total_bills_amount}</h2>
                                <p>Total Payable</p>
                                <h2 className="color-base">{datalist.grand_total}/PKR</h2>
                            </div>

                            <h2 className="mt-2">Service Charges</h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th>No.</th>
                                        <th>Date</th>
                                        <th>Charges Title</th>
                                        <th>Total Charges</th>
                                        <th colSpan="2">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {datalist.service_charges.map((service, index) => (
                                        <tr key={service.id}>
                                            <td className="info">{index + 1}</td>
                                            <td className="info">{service.service_date}</td>
                                            <td className="info">{service.service_name}</td>
                                            <td className="info">{service.service_charge}</td>
                                            <td>
                                                <a className="primary" onClick={(e) => { e.preventDefault(); /* Add your edit function here */ }}>Edit</a>
                                            </td>
                                            <td>
                                                <a className="warning" onClick={(e) => { e.preventDefault(); /* Add your delete function here */ }}>Delete</a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <h2 className="mt-2">Dining Bill</h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Sr.</th>
                                        <th>Bill ID.</th>
                                        <th>Date</th>
                                        <th style={{ textAlign: 'left' }}>Bill Details</th>
                                        <th style={{ textAlign: 'center' }}>Total Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {datalist.bills.map((bill, index) => (
                                        <tr key={bill.id}>
                                            <td className="info">{index+1}</td>
                                            <td className="info">{bill.id}</td>
                                            <td className="info">{bill.bill_date}</td>
                                            <td className="info" style={{ textAlign: 'left' }}>{bill.bill_details}</td>
                                            <td className="info"><b>{bill.total_amount}</b></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            
                            <div className="total-block mt-1">
                                <textarea 
                                name="remarks" 
                                id="remarks" 
                                placeholder="add final remark for checkout"
                                onChange={(e) => { setCheckoutRemarks(e.target.value); }}
                                />
                            </div>

                            <div className="d-flex">
                                <button className="save" onClick={generatePDF}>Print Bill</button>
                                <button className="save" onClick={confirmCheckOut}>Confirm Checkout</button>
                                <button className="save red" onClick={clearDataList}>Clear Data</button>
                            </div>
                        </>
                    ) : (
                        <p>please search booking ID or customer param to get data</p>
                    )}
                </div>
            </main>
            <main>
                <div className="" style={{ margin: '5.6rem 0 0 0', display: 'flex', justifyContent: 'center' }}>
                    <div className="form">
                        <h2>CheckOut</h2>
                        <div className="entry-block">

                            <label>Booking ID or Room No.</label>
                            <input onChange={(e)=>setSearchID(e.target.value)} value={searchID} placeholder="Enter BookingID or Room No. checkout"/>
                            <label>Any Customer Info</label>
                            <input onChange={(e)=>setSearchCustomer(e.target.value)} placeholder="Enter Customer ID | Name | Contact"/>

                        </div>
                        <button className="save" onClick={handleSearch}>Search Data</button>
                    </div>
                </div>
                    
                    
                
                {showSC && (
                    <div className="form mt-2">
                        <div className="entry-show">
                            <p>Customer:</p>
                            <h5>{selectedBooking.customer && selectedBooking.customer.name}</h5>
                            <p>Room:</p>
                            <h5>{selectedBooking.room && selectedBooking.room.room_number}</h5>
                            {/* {serviceChargeList.map((item)=>(
                                <>
                                    <h5>{item.service_name}</h5>
                                    <h5>{item.service_charge}</h5>
                                </>
                            )) */}
                            }
                        </div>
                    </div>
                )}
                        
                    
            </main>
            {sideModel &&

                <div className={`model-side ${sideModel ? "model-side-show" : ""}`}>
                    <div className="model-side-closebtn" onClick={() => setSideModel(false)}>
                        <span className="material-symbols-outlined rotate-icon">close</span>
                    </div>
                    <div className="form">
                        <h2>Add Service</h2>
                        <div className="entry-one">
                            <label>Customer</label>
                            <input type="text" value={name} disabled />
                            <label>Room</label>
                            <input type="text" value={room} disabled />
                            <label>Service Title</label>
                            <input type="text" value={service} onChange={(e) => setService(e.target.value)} required />
                            <label>Charges</label>
                            <input type="number" value={serviceCharges} onChange={(e) => setServiceCharges(e.target.value)} required />
                            <label>Date</label>
                            <input type="date" value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} required />                  
                        </div>
                        <button className="save" onClick={handleService}>Add Charges</button>
                    </div>
                </div>
            }
        </div>
    );
};

export default CustomerCheckOut