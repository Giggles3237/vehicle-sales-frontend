import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Chip from './components/Chip';
import SaleForm from './components/SaleForm';
import DateRangePicker from './components/DateRangePicker';
import SalesTable from './components/SalesTable';
import './App.css';

const App = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
};

const AppContent = () => {
    const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const currentMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    const [sales, setSales] = useState([]);
    const [filteredSales, setFilteredSales] = useState([]);
    const [selectedSale, setSelectedSale] = useState(null);
    const [startDate, setStartDate] = useState(currentMonthStart);
    const [endDate, setEndDate] = useState(currentMonthEnd);
    const [searchQuery, setSearchQuery] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/sales');
            setSales(response.data);
        } catch (error) {
            console.error('Error fetching sales data:', error);
        }
    };

    const filterSales = useCallback(() => {
        let filtered = sales.filter(sale => {
            const saleDate = new Date(sale.deliveryDate);
            const start = new Date(startDate);
            const end = new Date(endDate);

            return (!startDate || saleDate >= start) && (!endDate || saleDate <= end);
        });

        if (searchQuery) {
            filtered = filtered.filter(sale => 
                sale.stockNumber.includes(searchQuery) ||
                sale.clientName.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredSales(filtered);
    }, [sales, startDate, endDate, searchQuery]);

    useEffect(() => {
        filterSales();
    }, [sales, startDate, endDate, searchQuery, filterSales]);

    const handleSaleClick = (sale) => {
        setSelectedSale(sale);
        navigate('/edit');
    };

    const handleSave = () => {
        fetchSales();
        navigate('/');
    };

    const getAdvisorSummary = () => {
        const advisorMap = {};

        filteredSales.forEach(sale => {
            const advisor = sale.advisor;
            if (!advisorMap[advisor]) {
                advisorMap[advisor] = { delivered: 0, pending: 0, sales: [] };
            }
            if (sale.delivered) {
                advisorMap[advisor].delivered += 1;
            } else {
                advisorMap[advisor].pending += 1;
            }
            advisorMap[advisor].sales.push(sale);
        });

        Object.values(advisorMap).forEach(data => {
            data.sales.sort((a, b) => (a.delivered === b.delivered) ? 0 : a.delivered ? -1 : 1);
        });

        return Object.entries(advisorMap).sort((a, b) => b[1].delivered - a[1].delivered);
    };

    const getTotalCounts = () => {
        const totals = {
            newBMWDelivered: 0,
            newBMWPending: 0,
            usedBMWDelivered: 0,
            usedBMWPending: 0,
            cpoBMWDelivered: 0,
            cpoBMWPending: 0,
            newMINIDelivered: 0,
            newMINIPending: 0,
            cpoMINIDelivered: 0,
            cpoMINIPending: 0,
            usedMINIDelivered: 0,
            usedMINIPending: 0,
        };

        filteredSales.forEach(sale => {
            if (sale.type === 'New BMW') {
                if (sale.delivered) totals.newBMWDelivered += 1;
                else totals.newBMWPending += 1;
            } else if (sale.type === 'Used BMW') {
                if (sale.delivered) totals.usedBMWDelivered += 1;
                else totals.usedBMWPending += 1;
            } else if (sale.type === 'CPO BMW') {
                if (sale.delivered) totals.cpoBMWDelivered += 1;
                else totals.cpoBMWPending += 1;
            } else if (sale.type === 'New MINI') {
                if (sale.delivered) totals.newMINIDelivered += 1;
                else totals.newMINIPending += 1;
            } else if (sale.type === 'CPO MINI') {
                if (sale.delivered) totals.cpoMINIDelivered += 1;
                else totals.cpoMINIPending += 1;
            } else if (sale.type === 'Used MINI') {
                if (sale.delivered) totals.usedMINIDelivered += 1;
                else totals.usedMINIPending += 1;
            }
        });

        return totals;
    };

    const {
        newBMWDelivered, newBMWPending,
        usedBMWDelivered, usedBMWPending,
        cpoBMWDelivered, cpoBMWPending,
        newMINIDelivered, newMINIPending,
        cpoMINIDelivered, cpoMINIPending,
        usedMINIDelivered, usedMINIPending
    } = getTotalCounts();

    return (
        <div className="app">
            <nav className="nav-buttons">
                <button onClick={() => navigate('/')}>Home</button>
                <button onClick={() => navigate('/add')}>Add Sale</button>
                <button onClick={() => navigate('/table')}>Sales Table</button>
            </nav>
            <h1>Vehicle Sales Tracking</h1>
            <div className="totals">
                <span>New BMW: {newBMWDelivered} ({newBMWPending})</span>
                <span>Used BMW: {usedBMWDelivered} ({usedBMWPending})</span>
                <span>CPO BMW: {cpoBMWDelivered} ({cpoBMWPending})</span>
                <span>New MINI: {newMINIDelivered} ({newMINIPending})</span>
                <span>CPO MINI: {cpoMINIDelivered} ({cpoMINIPending})</span>
                <span>Used MINI: {usedMINIDelivered} ({usedMINIPending})</span>
            </div>
            <div className="date-picker-container">
                <DateRangePicker
                    startDate={startDate}
                    endDate={endDate}
                    onStartDateChange={setStartDate}
                    onEndDateChange={setEndDate}
                />
            </div>
            <input 
                type="text" 
                placeholder="Search by stock number or client name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Routes>
                <Route path="/" element={
                    <>
                        {getAdvisorSummary().map(([advisor, data]) => (
                            <div key={advisor}>
                                <div className="advisor-summary">
                                    {advisor}: {data.delivered} ({data.pending})
                                </div>
                                <div className="sales-list">
                                    {data.sales.map(sale => (
                                        <Chip key={sale._id} sale={sale} onClick={handleSaleClick} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </>
                } />
                <Route path="/add" element={<SaleForm onSave={handleSave} onCancel={() => navigate('/')} />} />
                <Route path="/edit" element={<SaleForm sale={selectedSale} onSave={handleSave} onCancel={() => navigate('/')} />} />
                <Route path="/table" element={<SalesTable sales={filteredSales} />} />
            </Routes>
        </div>
    );
};

export default App;
