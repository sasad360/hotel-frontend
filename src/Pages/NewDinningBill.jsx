import React, { useState, useEffect } from "react";
import axiosClient from "../axios-client";
import { toast } from 'react-toastify';

// import "./NewDinningBill.css"; // Import the CSS file


const NewDinningBill = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [customerType, setCustomerType] = useState('walkin');
    const [billDetails, setBillDetails] = useState({ customer: null, total: 0, items: [] });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        getdata();
    }, []);

    const getdata = () => {
        axiosClient.get("menuitems")
            .then((response) => {
                const updatedMenuItems = response.data.map(item => ({ ...item, quantity: 0 }));
                setMenuItems(updatedMenuItems);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleCustomerChange = (e) => {
        const { name, value } = e.target;
        setBillDetails({ ...billDetails, [name]: value });
    };

    const handleItemQuantityChange = (itemId, change) => {
        setMenuItems((prevItems) => {
            const updatedItems = prevItems.map(item => {
                if (item.id === itemId) {
                    const newQuantity = Math.max(0, item.quantity + change);
                    return { ...item, quantity: newQuantity };
                }
                return item;
            });
            updateTotal(updatedItems);
            return updatedItems;
        });
    };

    const updateTotal = (items) => {
        const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const selectedItems = items.filter(item => item.quantity > 0);
        setBillDetails((prevState) => ({
            ...prevState,
            items: selectedItems,
            total
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        if (!billDetails.customer || (customerType === 'walkin' && (!billDetails.customer || !billDetails.customerCell))) {
            toast.error("Please provide customer details.", {
                position: "top-right",
                autoClose: 2000,
                theme: "colored",
            });
            return;
        }
    
        if (!billDetails.items || billDetails.items.length === 0) {
            toast.error("Please add items to the bill.", {
                position: "top-right",
                autoClose: 2000,
                theme: "colored",
            });
            return;
        }
    
        const payload = {
            customerType: customerType,
            customer_id: customerType === 'checkedin' ? billDetails.customer.customer.id : null,
            walk_in_customer: customerType === 'walkin' ? { 
                name: billDetails.customer, 
                number: billDetails.customerCell 
            } : null,
            bill_date: new Date().toISOString().split('T')[0],
            total_amount: billDetails.total,
            items: billDetails.items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                unit_price: item.price,
                subtotal: item.quantity * item.price
            }))
        };
    
        axiosClient.post('bills', payload)
            .then(response => {
                console.log('Bill created:', response.data);
                toast.success("Bill created successfully.", {
                    position: "top-right",
                    autoClose: 2000,
                    theme: "colored",
                });
                // Clear the form after submission
                setBillDetails({
                    customer: '',
                    customerCell: '',
                    items: [],
                    total: 0
                });
                setMenuItems(menuItems.map(item => ({ ...item, quantity: 0 })));
            })
            .catch(err => {
                toast.error("Failed to create bill. Please try again.", {
                    position: "top-right",
                    autoClose: 2000,
                    theme: "colored",
                });
                console.log(err);
            });
    };
    
    const handleSearch = () => {
        axiosClient.post(`booking/${searchTerm}`)
            .then(response => {
                setBillDetails({ ...billDetails, customer: response.data });
                toast.success("Details fetched successfully.", {
                    position: "top-right",
                    autoClose: 2000,
                    theme: "colored",
                });
                console.log(response.data);
            })
            .catch(err => {
                toast.error("Failed to fetch details. Please try again.", {
                    position: "top-right",
                    autoClose: 2000,
                    theme: "colored",
                });
                console.log(err);
            });
    };

    return (
        <div className="container dinning mt-3">
            <div>
                <div className="form-group">
                    <label>Customer Type:</label>
                    <select value={customerType} onChange={(e) => setCustomerType(e.target.value)}>
                        <option value="walkin">Walk-in</option>
                        <option value="checkedin">Checked-in</option>
                    </select>
                </div>

                {customerType === 'walkin' ? (
                    <div className="entry-one">
                        <label>Customer Name:</label>
                        <input type="text" name="customer" value={billDetails.customer} onChange={handleCustomerChange} required />
                        <label>Customer Cell:</label>
                        <input type="text" name="customerCell" value={billDetails.customerCell} onChange={handleCustomerChange} required />
                    </div>
                ) : (
                    <div className="form-group">
                        <label>Search Customer:</label>
                        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <button type="button" className="save" onClick={handleSearch}>Search</button>
                        {billDetails.customer && (
                            <div className="entry-three">
                                <h3>Customer Name: {billDetails.customer.customer.name}</h3>
                                <h3>Customer Room: {billDetails.customer.room.room_number}</h3>
                                <h3>Customer ID: {billDetails.customer.customer.id}</h3>
                            </div>
                        )}
                    </div>
                )}

                <div className="menu-items">
                    <h2>Menu Items</h2>
                    <div className="menu-items-grid">
                        {menuItems.map(item => (
                            <div key={item.id} className={`menu-item-card ${item.quantity > 0 ? 'highlight' : ''}`}>
                                <h3>{item.name}</h3>
                                <h4 className="info">{item.price}</h4>
                                <div className="quantity-controls">
                                    <button type="button" onClick={() => handleItemQuantityChange(item.id, -1)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button type="button" onClick={() => handleItemQuantityChange(item.id, 1)}>+</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            <div>
                <form onSubmit={handleSubmit}>
                    <h2>Bill Items:</h2>
                    <div className="total">
                        <table className="bill-items-table">
                            <thead>
                                <tr>
                                    <th>Item Name</th>
                                    <th>Quantity</th>
                                    <th>Unit Price</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {billDetails.items.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.price}</td>
                                        <td>{(item.quantity * item.price).toFixed(2)}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <th colSpan={2}><h2>Total:</h2></th>
                                    <th colSpan={2}><h2>{billDetails.total}</h2></th>      
                                </tr>
                            </tbody>
                        </table>
                       

                    </div>
                    <div className="total-block mt-2">
                        <label htmlFor="">Payment Method</label>
                        <input type="text"  placeholder="Payment Method" />
                        <label htmlFor="" className="mt-1">Remarks</label>
                        <textarea type="text" placeholder="Add Remarks" />
                    </div>
                    <button type="submit" className="submit-button">Save Bill</button>
                </form>
            </div>
        </div>
    );
};

export default NewDinningBill;

