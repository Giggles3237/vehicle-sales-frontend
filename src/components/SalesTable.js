import React, { useMemo } from 'react';
import { useTable, useSortBy, useFilters } from 'react-table';
import DateRangePicker from './DateRangePicker';
import './SalesTable.css';

// Define a default column filter
const DefaultColumnFilter = ({
    column: { filterValue, preFilteredRows, setFilter },
}) => {
    const count = preFilteredRows.length;

    return (
        <input
            value={filterValue || ''}
            onChange={e => {
                setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
            }}
            placeholder={`Search ${count} records...`}
        />
    );
};

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
                Filter: DefaultColumnFilter,
            },
            {
                Header: 'Client Name',
                accessor: 'clientName',
                Filter: DefaultColumnFilter,
            },
            {
                Header: 'Year',
                accessor: 'year',
                Filter: DefaultColumnFilter,
            },
            {
                Header: 'Make',
                accessor: 'make',
                Filter: DefaultColumnFilter,
            },
            {
                Header: 'Model',
                accessor: 'model',
                Filter: DefaultColumnFilter,
            },
            {
                Header: 'Color',
                accessor: 'color',
                Filter: DefaultColumnFilter,
            },
            {
                Header: 'Advisor',
                accessor: 'advisor',
                Filter: DefaultColumnFilter,
            },
            {
                Header: 'Delivered',
                accessor: 'delivered',
                Cell: ({ value }) => (value ? 'Yes' : 'No'),
                Filter: DefaultColumnFilter,
            },
            {
                Header: 'Delivery Date',
                accessor: 'deliveryDate',
                Cell: ({ value }) => new Date(value).toLocaleDateString(),
                Filter: DefaultColumnFilter,
            },
            {
                Header: 'Type',
                accessor: 'type',
                Filter: ({ column: { filterValue, setFilter, preFilteredRows, id } }) => {
                    const options = new Set();
                    preFilteredRows.forEach(row => {
                        options.add(row.values[id]);
                    });

                    return (
                        <select
                            value={filterValue}
                            onChange={e => {
                                setFilter(e.target.value || undefined);
                            }}
                        >
                            <option value="">All</option>
                            {[...options.values()].map((option, i) => (
                                <option key={i} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    );
                }
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
            <div className="date-picker-container">
                <DateRangePicker
                    startDate={startDate}
                    endDate={endDate}
                    onStartDateChange={setStartDate}
                    onEndDateChange={setEndDate}
                />
            </div>
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
                                    <div>{column.canFilter ? column.render('Filter') : null}</div>
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
