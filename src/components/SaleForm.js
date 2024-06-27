import React, { useState, useEffect } from 'react';

const SaleForm = ({ sale, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        stockNumber: '',
        clientName: '',
        deliveryDate: '',
        advisor: '',
        type: '',
        delivered: false,
    });

    useEffect(() => {
        if (sale) {
            setFormData({
                stockNumber: sale.stockNumber || '',
                clientName: sale.clientName || '',
                deliveryDate: sale.deliveryDate ? sale.deliveryDate.substring(0, 10) : '',
                advisor: sale.advisor || '',
                type: sale.type || '',
                delivered: sale.delivered || false,
            });
        }
    }, [sale]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData({
            ...formData,
            [name]: checked,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="sale-form">
            <form onSubmit={handleSubmit}>
                <label>
                    Stock Number:
                    <input
                        type="text"
                        name="stockNumber"
                        value={formData.stockNumber}
                        onChange={handleChange}
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
                    Delivery Date:
                    <input
                        type="date"
                        name="deliveryDate"
                        value={formData.deliveryDate}
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
                    Type:
                    <input
                        type="text"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Delivered:
                    <input
                        type="checkbox"
                        name="delivered"
                        checked={formData.delivered}
                        onChange={handleCheckboxChange}
                    />
                </label>
                <button type="submit">Save</button>
                <button type="button" onClick={onCancel}>Cancel</button>
            </form>
        </div>
    );
};

export default SaleForm;
