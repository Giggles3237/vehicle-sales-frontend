import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SaleForm.css';

const SaleForm = ({ sale, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        stockNumber: '',
        clientName: '',
        year: '',
        make: '',
        model: '',
        color: '',
        advisor: '',
        delivered: false,
        deliveryDate: '',
        type: ''
    });

    useEffect(() => {
        if (sale) {
            setFormData({
                stockNumber: sale.stockNumber || '',
                clientName: sale.clientName || '',
                year: sale.year || '',
                make: sale.make || '',
                model: sale.model || '',
                color: sale.color || '',
                advisor: sale.advisor || '',
                delivered: sale.delivered || false,
                deliveryDate: sale.deliveryDate ? new Date(sale.deliveryDate).toISOString().split('T')[0] : '',
                type: sale.type || ''
            });
        }
    }, [sale]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (sale) {
                await axios.put(`http://localhost:5000/api/sales/${sale._id}`, formData);
            } else {
                await axios.post('http://localhost:5000/api/sales', formData);
            }
            onSave();
        } catch (error) {
            console.error('Error saving sale:', error);
        }
    };

    return (
        <div className="sale-form-container">
            <form className="sale-form" onSubmit={handleSubmit}>
                <h2>{sale ? 'Edit Sale' : 'Add Sale'}</h2>
                <label>
                    Stock Number:
                    <input
                        type="text"
                        name="stockNumber"
                        value={formData.stockNumber}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Client Name:
                    <input
                        type="text"
                        name="clientName"
                        value={formData.clientName}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Year:
                    <input
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Make:
                    <input
                        type="text"
                        name="make"
                        value={formData.make}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Model:
                    <input
                        type="text"
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Color:
                    <input
                        type="text"
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Advisor:
                    <input
                        type="text"
                        name="advisor"
                        value={formData.advisor}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Delivered:
                    <input
                        type="checkbox"
                        name="delivered"
                        checked={formData.delivered}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Delivery Date:
                    <input
                        type="date"
                        name="deliveryDate"
                        value={formData.deliveryDate}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Type:
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                    >
                        <option value="">Select Type</option>
                        <option value="new">New</option>
                        <option value="used">Used</option>
                    </select>
                </label>
                <div className="form-buttons">
                    <button type="submit">Save</button>
                    <button type="button" onClick={onCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default SaleForm;
