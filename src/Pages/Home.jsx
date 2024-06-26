import React, { useState, useEffect } from 'react'
import axiosClient from '../axios-client';
import { Link } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner';
import BookingModal from './BookingModal';

const Home = () => {
    const[number, setNumber] =useState(1);
    const[total, setTotalNumber] =useState(1);
    const[roomlist, setRoomlist] =useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleBookRoomClick = (e, room) => {
        setSelectedRoom(room);
        console.log(room)
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRoom(null);
    };

    const getStatusTooltip = (status) => {
        switch (status) {
            case 'available':
                return 'Available';
            case 'occupied':
                return 'Occupied';
            case 'maintenance':
                return 'Under Maintenance';
            default:
                return '';
        }
    };

      //receive data
    const getRoomStatus = () => {
        axiosClient.get("rooms")
            .then((response) => {
                setRoomlist(response.data);
                setIsLoading(false);
        })
        .catch((err) => {
            console.log(err);
        });
    };
    
    useEffect(() => {
        getRoomStatus();
    }, []);

    if (isLoading) {
        return (
            <div className="loader">
                <ThreeDots
                    visible={true}
                    height="80"
                    width="80"
                    color="#4fa94d"
                    radius="9"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                />
            </div>
        );
    }

  return (
    <div className="containerfull">

    <main>
         <h1>Dashboard</h1>

        
         <div className="insights">
            {roomlist.map((room, index) => (
                <div className={`room ${room.status}`} key={index} title={getStatusTooltip(room.status)}>
                    <div className="sales">
                        <div className="d-flex">
                            <span className="material-symbols-outlined">bed</span>
                            <h2>{room.room_number}</h2>
                        </div>
                        <div className="middle mt-1">
                            <div className="left">
                                <p>Type: {room.type}</p>
                                <p>Block: {room.block}</p>
                                <p>Floor: {room.floor}</p>
                                <p>Status: {room.status}</p>
                            </div>
                            <div className="actionList">
                                {room.status === 'occupied' ? (
                                    <div className="actions">
                                        <Link to={`/customerlist`} className="action-link">Customer Details</Link>
                                        <Link to={`/dinning_bill`} className="action-link">Dinning Bill</Link>
                                        <Link to={`/servicetocheckin`} className="action-link">Add Service</Link>
                                        <Link to={`/customercheckout`} className="action-link">Checkout</Link>
                                    </div>
                                ) : (
                                    <div className="actions">
                                        <Link to= {{
                                                    pathname: '/newroom',
                                                    state: { dashRoomId: room.id },
                                                }} className="action-link">Change Room Status</Link>
                                        <Link to="#" onClick={(e) => handleBookRoomClick(e, room)} className="action-link">Book Room</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>

    </main>

    {isModalOpen && 
        <BookingModal room={selectedRoom} onClose={closeModal} />
    }

    </div>
  )
}

export default Home