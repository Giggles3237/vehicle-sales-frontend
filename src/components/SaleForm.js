import React, { useState } from 'react';
import './SaleForm.css';

const SaleForm = ({ sale, onSave, onCancel }) => {
    const currentYear = new Date().getFullYear();
    const years = Array.from(new Array(20), (val, index) => currentYear + 1 - index);

    const [formData, setFormData] = useState({
        stockNumber: sale ? sale.stockNumber : '',
        clientName: sale ? sale.clientName : '',
        year: sale ? sale.year : currentYear + 1,
        make: sale ? sale.make : '',
        model: sale ? sale.model : '',
        color: sale ? sale.color : '',
        advisor: sale ? sale.advisor : '',
        delivered: sale ? sale.delivered : false,
        deliveryDate: sale ? sale.deliveryDate.split('T')[0] : '',
        type: sale ? sale.type : ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form className="sale-form" onSubmit={handleSubmit}>
            <h2>{sale ? 'Edit Sale' : 'Add Sale'}</h2>
            <div className="form-group">
                <label>Stock Number</label>
                <input
                    type="text"
                    name="stockNumber"
                    value={formData.stockNumber}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group">
                <label>Client Name</label>
                <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group">
                <label>Year</label>
                <select name="year" value={formData.year} onChange={handleChange}>
                    {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label>Make</label>
                <input
                    type="text"
                    name="make"
                    value={formData.make}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group">
                <label>Model</label>
                <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group">
                <label>Color</label>
                <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group">
                <label>Advisor</label>
                <input
                    type="text"
                    name="advisor"
                    value={formData.advisor}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group">
                <label>Delivered</label>
                <input
                    type="checkbox"
                    name="delivered"
                    checked={formData.delivered}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group">
                <label>Delivery Date</label>
                <input
                    type="date"
                    name="deliveryDate"
                    value={formData.deliveryDate}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group">
                <label>Type</label>
                <select name="type" value={formData.type} onChange={handleChange}>
                    <option value="">Select Type</option>
                    <option value="New BMW">New BMW</option>
                    <option value="Used BMW">Used BMW</option>
                    <option value="CPO BMW">CPO BMW</option>
                    <option value="New MINI">New MINI</option>
                    <option value="CPO MINI">CPO MINI</option>
                    <option value="Used MINI">Used MINI</option>
                </select>
            </div>
            <div className="form-actions">
                <button type="submit">Save</button>
                <button type="button" onClick={onCancel}>Cancel</button>
            </div>
        </form>
    );
};

export default SaleForm;
