import React, {useEffect, useState} from 'react';
import {BASE_API_URL} from "./constants";
import TableComponent from "./components/TableComponent";
import moment from "moment";
import './App.css';

const App = () => {
  const [apiPayload, setApiPayload] = useState([]);

  useEffect(()=>{
    setTimeout(()=> {
      fetch(BASE_API_URL)
          .then((response) => response.json())
          .then((data) => setApiPayload(data.transactions));
    }, 1000)
  },[]);

  const columnData = React.useMemo(
      () => [
        {
          Header: 'Name',
          accessor: 'name',
          type: 'Text'
        },
        {
          Header: 'Ticket Ref',
          accessor: 'ticketref',
          type: 'Text'
        },
        {
          Header: 'Trade Date',
          accessor: 'traded_on',
          type: 'Date',
          Cell : (props)=>{
              return <span>{moment(props.value, ["DD-MM-YYYY"]).format("DD/MM/YYYY")}</span>
          }
        },
        {
          Header: 'QTY',
          accessor: 'quantity',
          type: 'Amount',
            Cell : (props)=>{
                return <span>{props.value && props.value.toLocaleString('en-US' ,{ minimumFractionDigits: 2 })}</span>
            }
        },
        {
          Header: 'CCY',
          accessor: 'currency',
          type: 'Amount'
        },
      ],[]);

  const defaultColumn = React.useMemo(
      () => ({
        minWidth: 50,
        width: 100,
        maxWidth: 400,
      }),
      []
  );

  const hiddenCol = columnData.filter((val,index) => (index > 2) && val.accessor).map((val) => val.accessor);


  return (
    <div className="App">
      <TableComponent data={apiPayload} columns={columnData} defaultColumn={defaultColumn} hiddenColumnMobile={hiddenCol} />
    </div>
  );
};

export default App;
