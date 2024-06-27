import React, { useMemo } from 'react';
import { useTable, useSortBy, useFilters } from 'react-table';
import DateRangePicker from './DateRangePicker';
import './SalesTable.css';

const SalesTable = ({ sales }) => {
    const [filteredSales, setFilteredSales] = React.useState(sales);
    const [startDate, setStartDate] = React.useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
    const [endDate, setEndDate] = React.useState(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0));

    const filterSalesByDate = React.useCallback(() => {
        const filtered = sales.filter(sale => {
            const saleDate = new Date(sale.deliveryDate);
            const start = new Date(startDate);
            const end = new Date(endDate);

            return (!startDate || saleDate >= start) && (!endDate || saleDate <= end);
        });

        setFilteredSales(filtered);
    }, [sales, startDate, endDate]);

    React.useEffect(() => {
        filterSalesByDate();
    }, [sales, startDate, endDate, filterSalesByDate]);

    const data = useMemo(() => filteredSales, [filteredSales]);

    const columns = useMemo(
        () => [
            {
                Header: 'Stock Number',
                accessor: 'stockNumber',
            },
            {
                Header: 'Client Name',
                accessor: 'clientName',
            },
            {
                Header: 'Year',
                accessor: 'year',
            },
            {
                Header: 'Make',
                accessor: 'make',
            },
            {
                Header: 'Model',
                accessor: 'model',
            },
            {
                Header: 'Color',
                accessor: 'color',
            },
            {
                Header: 'Advisor',
                accessor: 'advisor',
            },
            {
                Header: 'Delivered',
                accessor: 'delivered',
                Cell: ({ value }) => (value ? 'Yes' : 'No'),
            },
            {
                Header: 'Delivery Date',
                accessor: 'deliveryDate',
                Cell: ({ value }) => new Date(value).toLocaleDateString(),
            },
            {
                Header: 'Type',
                accessor: 'type',
            },
        ],
        []
    );

    const tableInstance = useTable({ columns, data }, useFilters, useSortBy);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance;

    return (
        <div className="sales-table-container">
            <h2>Sales Table</h2>
            <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
            />
            <table className="sales-table" {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render('Header')}
                                    <span>
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? ' 🔽'
                                                : ' 🔼'
                                            : ''}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map(row => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => (
                                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default SalesTable;
