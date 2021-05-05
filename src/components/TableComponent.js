import React from 'react';
import styled from 'styled-components'
import { useTable, useFlexLayout, useColumnOrder, useResizeColumns, useSortBy, usePagination } from 'react-table';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import {isMobile} from 'react-device-detect';
const Styles = styled.div`
          .pagination {
            padding: 0.5rem;
          }
          .resizer {
            display: inline-block;
            background: blue;
            width: 10px;
            height: 100%;
            position: absolute;
            right: 0;
            top: 0;
            transform: translateX(50%);
            z-index: 1;
            touch-action:none;
    
            &.isResizing {
              background: red;
            }
          }
        `;

const TableComponent = ({data, columns, defaultColumn, hiddenColumnMobile}) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        visibleColumns,
        prepareRow,
        setColumnOrder,
        resetResizing,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable(
            {
                columns,
                data,
                defaultColumn,
                initialState: {
                    pageIndex: 0,
                    pageSize: 10,
                    // sortBy: [{id : 'name', desc: false}],
                    hiddenColumns: isMobile ? hiddenColumnMobile : [],
                },
            },
            useResizeColumns,
            useSortBy,
            usePagination,
            useFlexLayout,
            useColumnOrder
        );

    // const headerProps = (props, { column }) => getStyles(props, column.align);

    const cellProps = (props, { cell }) => getStyles(props, cell.column.align);

    const getStyles = (props, align = 'left') => [
        props,
        {
            style: {
                justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
                alignItems: 'flex-start',
                display: 'flex',
            },
        },
    ];

    const shuffle = (arr) => {
        arr = [...arr];
        const shuffled = [];
        while (arr.length) {
            const rand = Math.floor(Math.random() * arr.length);
            shuffled.push(arr.splice(rand, 1)[0])
        }
        return shuffled
    };

    const randomizeColumns = () => {
        setColumnOrder(shuffle(visibleColumns.map(d => d.id)))
    };

    return (
        <Styles>
            <button onClick={resetResizing}>Reset Resizing</button>
            <button onClick={() => randomizeColumns()}>Randomize Columns</button>
            <Table responsive striped bordered hover size="sm" {...getTableProps()}>
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
                                <div
                                    {...column.getResizerProps()}
                                    className={`resizer ${
                                        column.isResizing ? 'isResizing' : ''
                                        }`}
                                />
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {page.map((row, i) => {
                    prepareRow(row)
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return <td {...cell.getCellProps(cellProps)}>{cell.render('Cell')}</td>
                            })}
                        </tr>
                    )
                })}
                </tbody>
            </Table>
            <div className="pagination">
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {'<<'}
                </button>{' '}
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {'<'}
                </button>{' '}
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    {'>'}
                </button>{' '}
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {'>>'}
                </button>{' '}
                <span>
                  Page{' '}
                            <strong>
                    {pageIndex + 1} of {pageOptions.length}
                  </strong>{' '}
                </span>
                        <span>
                  | Go to page:{' '}
                            <input
                                type="number"
                                defaultValue={pageIndex + 1}
                                onChange={e => {
                                    const page = e.target.value ? Number(e.target.value) - 1 : 0
                                    gotoPage(page)
                                }}
                                style={{ width: '100px' }}
                            />
                </span>{' '}
                <select
                    value={pageSize}
                    onChange={e => {
                        setPageSize(Number(e.target.value))
                    }}
                >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </Styles>
    )
};

export default TableComponent;