import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DateRangePicker.css';

const DateRangePicker = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
    const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const currentMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    const [localStartDate, setLocalStartDate] = useState(startDate ? new Date(startDate) : currentMonthStart);
    const [localEndDate, setLocalEndDate] = useState(endDate ? new Date(endDate) : currentMonthEnd);

    useEffect(() => {
        onStartDateChange(localStartDate);
    }, [localStartDate, onStartDateChange]);

    useEffect(() => {
        onEndDateChange(localEndDate);
    }, [localEndDate, onEndDateChange]);

    return (
        <div className="date-range-picker">
            <label>
                Start Date:
                <DatePicker
                    selected={localStartDate}
                    onChange={(date) => setLocalStartDate(date)}
                    dateFormat="yyyy-MM-dd"
                />
            </label>
            <label>
                End Date:
                <DatePicker
                    selected={localEndDate}
                    onChange={(date) => setLocalEndDate(date)}
                    dateFormat="yyyy-MM-dd"
                />
            </label>
        </div>
    );
};

export default DateRangePicker;
