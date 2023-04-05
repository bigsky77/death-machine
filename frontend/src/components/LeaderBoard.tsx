import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useGameCompleteEvents } from "../../lib/api";
import { number, address } from 'starknet';
import BigNumber from 'bignumber.js';

const columns = [
  { field: 'id', headerName: 'Rank', width: 30 },
  { field: 'Address', headerName: 'Address', width: 80 },
  { field: 'Score', headerName: 'Score', width: 30 },
];

const xrows = [
  { id: 1, Address: 'Snow', Score: 'Jon'},
  { id: 2, Address: 'Lannister', Score: 'Cersei'},
  { id: 3, Address: 'Lannister', Score: 'Jaime'},
  { id: 4, Address: 'Stark', Score: 'Arya'},
  { id: 5, Address: 'Targaryen', Score: 'Daenerys'},
  { id: 6, Address: 'Melisandre', Score: "x" },
  { id: 7, Address: 'Clifford', Score: 'Ferrara' },
  { id: 8, Address: 'Frances', Score: 'Rossini'},
  { id: 9, Address: 'Roxie', Score: 'Harvey' },
];

export default function LeaderBoard() {
  const { data } = useGameCompleteEvents();
  const [rows, setRows] = useState([]);

  // Sort the data array by score in descending order and update rows state
  useEffect(() => {
    if (data) {
      console.log("gameComplete", data.gameComplete);
      const sortedData = data.gameComplete.sort((a, b) => b.score - a.score);
      const mappedData = sortedData.map((item, index) => ({
        id: index + 1,
        Address: hex_convert(item.address),
        //Address: address.validateAndParseAddress(item.address),
        Score: item.score
      }));
      console.log("mappedData", mappedData);
      setRows(mappedData);
    }
  }, [data]);
  
  function hex_convert(number){
  const bigNumber = new BigNumber(number);
  const hexAddress = "0x" + bigNumber.toString(16);
  return hexAddress;
  }

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[]}
        components={{
          Toolbar: () => (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 20px', backgroundColor: '#f5f5f5' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>LeaderBoard</div>
            </div>
          ),
        }}
        componentsProps={{
          toolbar: {
            disableDensitySelector: true,
            disableColumnFilter: true,
            disableColumnMenu: true,
          },
        }}
      />
    </div>
  );
}
