import React from "react";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify"
import { InfinitySpin } from "react-loader-spinner";
import Loader from "../Components/Loader.js";

const DailyHotelReport = () => {
    const [updateId, setUpdateId] = useState();
    const [sideModel, setSideModel] = useState(false)
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [showSC, setShowSC] = useState(false);

    const [selectedOption, setSelectedOption] = useState('');

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const [dataList, setDataList] = useState([]);
    const [reportMetadata, setReportMetadata] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');


    const getdata = () => {
        axiosClient.get("hotelreports/weekly")
            .then((response) => {
                setDataList(response.data.data);
                setReportMetadata(response.data.metadata);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getDailyData = () => {
        setIsLoading(true);
        setDataList('');
        setReportMetadata('');
        axiosClient.get("hotelreports/daily")
            .then((response) => {
                setDataList(response.data.data);
                setReportMetadata(response.data.metadata);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log("Error fetching daily report:", err);
                setIsLoading(false);
            });
    };

    const getRangeData = () => {
        setIsLoading(true);
        axiosClient.get("hotelreports/interval", {
            params: {
                start_date: startDate,
                end_date: endDate
            }
        })
        .then((response) => {
            setDataList(response.data.data);
            setReportMetadata(response.data.metadata);
            setIsLoading(false);
        })
        .catch((err) => {
            console.log("Error fetching interval report:", err);
            setIsLoading(false);
        });
    };


    useEffect(() => {
        getdata();
    }, []);




    return (
        <div className="container">
            <main>
                <h1>Hotel Report</h1>
                {reportMetadata.report_type && (
                    <div className="entry-four">
                        <h4 className="color-info-dark">Report Type:</h4>
                        <p>{reportMetadata.report_type}</p>
                        <h4 className="color-info-dark">Generated At:</h4>
                        <p>{reportMetadata.generated_at}</p>
                        <h4 className="color-info-dark">Start Date:</h4>
                        <p>{reportMetadata.start_date}</p>
                        <h4 className="color-info-dark">End Date:</h4>
                        <p>{reportMetadata.end_date}</p>
                    </div>
                )}
                <div className="recent-orders">
                <table>
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Customer</th>
                                <th>Room</th>
                                <th>Stay</th>
                                <th>T. Dinning</th>
                                <th>T. Service</th>
                                <th>Rent</th>
                                <th>Grand Total</th>
                                <th>Chackout</th>
                                <th>Remarks</th>
                            </tr>
                        </thead>
                        {isLoading ? (
                            <tbody>
                                <tr>
                                    <td colSpan="9"><Loader/></td>
                                </tr>
                            </tbody>
                        ) : dataList.length > 0 ? (
                            <tbody>
                                {dataList.map((bill, index) => (
                                    <tr key={bill.bill_id}>
                                        <td className="primary">{bill.booking_id}</td>
                                        <td className="info">{bill.customer_name}</td>
                                        <td className="info">{bill.room_number}</td>
                                        <td className="info"><b>{bill.days_stayed}</b></td>
                                        <td className="info">{bill.total_bills_amount}</td>
                                        <td className="info">{bill.total_service_charges}</td>
                                        <td className="info">{bill.total_rent}</td>
                                        <td className="info"><b>{bill.grand_total}</b></td>
                                        <td className="info">{bill.checkout_time}</td>
                                        <td className="info">{bill.remarks}</td>
                                    </tr>
                                ))}
                            </tbody>
                        ) : (
                            <tbody>
                                <tr>
                                    <td colSpan="9">No records found</td>
                                </tr>
                            </tbody>
                        )}
                    </table>
                </div>
            </main>
            <main>
                <div className="" style={{ margin: '5.6rem 0 0 0', display: 'flex', justifyContent: 'center' }}>
                    <div className="form">
                        <h2>Advance Reports</h2>
                        <div className="entry-block">
                            <input type="text" placeholder="Select Daily or Get By Date Range" disabled/>
                            <select required onChange={handleOptionChange} value={selectedOption}>
                                <option value="">Choose Option</option>
                                <option value="daily">Daily Report</option>
                                <option value="weekly">Date-Range Report</option>
                            </select>

                            {selectedOption === 'weekly' && (
                                <>
                                    <label>From (older date)</label>
                                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            
                                    <label>To (recent date)</label>
                                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                                </>
                            )}
                        </div>

                        {selectedOption === 'daily' ? (
                            <button className="save" onClick={getDailyData}>Get Today's Report</button>
                        ) : (
                            <button className="save" onClick={getRangeData}>Date Range Report</button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};
export default DailyHotelReport