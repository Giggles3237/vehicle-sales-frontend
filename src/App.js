import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Chip from './components/Chip';
import SaleForm from './components/SaleForm';
import DateRangePicker from './components/DateRangePicker';
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

    return (
        <div className="app">
            <nav>
                <Link to="/">Home</Link>
                <Link to="/add">Add Sale</Link>
            </nav>
            <input 
                type="text" 
                placeholder="Search by stock number or client name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Routes>
                <Route path="/" element={
                    <>
                        <DateRangePicker
                            startDate={startDate}
                            endDate={endDate}
                            onStartDateChange={setStartDate}
                            onEndDateChange={setEndDate}
                        />
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
            </Routes>
        </div>
    );
};

export default App;
