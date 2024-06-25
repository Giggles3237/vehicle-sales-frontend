import React from 'react';
import './Chip.css';

const Chip = ({ sale, onClick }) => {
    const chipStyle = !sale.delivered ? { transform: 'rotate(10deg)' } : {};
    const chipClass = sale.type === 'used' ? 'chip chip-used' : 'chip';

    return (
        <div className={chipClass} style={chipStyle} onClick={() => onClick(sale)}>
            <div className="chip-content">
                <div className="chip-stock">{sale.stockNumber}</div>
                <div className="chip-hover">
                    {sale.year} {sale.make} {sale.model} - {sale.color} - {sale.clientName}
                </div>
            </div>
        </div>
    );
};

export default Chip;
