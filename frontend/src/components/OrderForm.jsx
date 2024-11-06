import React, { useState } from 'react';

const OrderForm = ({ onSubmit }) => {
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropOffLocation, setDropOffLocation] = useState('');
    const [packageDetails, setPackageDetails] = useState('');
    const [deliveryTime, setDeliveryTime] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ pickupLocation, dropOffLocation, packageDetails, deliveryTime });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Pickup Location</label>
                <input type="text" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} required />
            </div>
            <div>
                <label>Drop-off Location</label>
                <input type="text" value={dropOffLocation} onChange={(e) => setDropOffLocation(e.target.value)} required />
            </div>
            <div>
                <label>Package Details</label>
                <textarea value={packageDetails} onChange={(e) => setPackageDetails(e.target.value)} required />
            </div>
            <div>
                <label>Delivery Time</label>
                <input type="datetime-local" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} required />
            </div>
            <button type="submit">Create Order</button>
        </form>
    );
};

export default OrderForm;
