// src/components/Chip.js
import React from 'react';
import './Chip.css';

const Chip = ({ sale, onClick }) => {
    return (
        <div
            className={`chip ${sale.delivered ? 'delivered' : 'pending'} ${sale.type.includes('Used') || sale.type.includes('CPO') ? 'used' : ''}`}
            onClick={() => onClick(sale)}
        >
            <div className="stock-number">
                {sale.stockNumber}
            </div>
            <div className="chip-details">
                <p>Client: {sale.clientName}</p>
                <p>{sale.year} {sale.make} {sale.model}</p>
                <p>Color: {sale.color}</p>
                <p>Advisor: {sale.advisor}</p>
            </div>
        </div>
    );
};

export default Chip;
