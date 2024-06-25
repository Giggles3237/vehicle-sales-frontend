import React, { useMemo } from 'react';
import { useTable, useSortBy, useFilters, useGlobalFilter } from 'react-table';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './SalesTable.css';

const GlobalFilter = ({ globalFilter, setGlobalFilter }) => (
    <span>
        Search: {' '}
        <input
            value={globalFilter || ''}
            onChange={e => setGlobalFilter(e.target.value || undefined)}
            placeholder="Type to search..."
        />
    </span>
);

const SalesTable = ({ sales, onEdit, onDelete }) => {
    const columns = useMemo(() => [
        {
            Header: 'Stock Number',
            accessor: 'stockNumber'
        },
        {
            Header: 'Client Name',
            accessor: 'clientName'
        },
        {
            Header: 'Year Make Model',
            accessor: d => `${d.year} ${d.make} ${d.model}`,
            id: 'yearMakeModel'
        },
        {
            Header: 'Color',
            accessor: 'color'
        },
        {
            Header: 'Advisor',
            accessor: 'advisor'
        },
        {
            Header: 'Delivered',
            accessor: d => (d.delivered ? 'Yes' : 'No'),
            id: 'delivered'
        },
        {
            Header: 'Delivery Date',
            accessor: 'deliveryDate'
        },
        {
            Header: 'Actions',
            Cell: ({ row }) => (
                <div>
                    <button onClick={() => onEdit(row.original)}><FaEdit /></button>
                    <button onClick={() => onDelete(row.original._id)}><FaTrash /></button>
                </div>
            )
        }
    ], [onEdit, onDelete]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
        setGlobalFilter
    } = useTable(
        {
            columns,
            data: sales
        },
        useFilters,
        useGlobalFilter,
        useSortBy
    );

    return (
        <div>
            <GlobalFilter globalFilter={state.globalFilter} setGlobalFilter={setGlobalFilter} />
            <table {...getTableProps()}>
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
