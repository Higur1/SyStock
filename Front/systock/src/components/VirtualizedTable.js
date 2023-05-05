import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso } from 'react-virtuoso';
import PropTypes from 'prop-types';
import { CellContainer, ColumnTable, RowDiv, RowTable } from '../pages/Category/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton } from '@mui/material';

const columns = [
  {
    width: 450,
    label: 'Categoria',
    dataKey: 'name',
    icon: null,
    isText: true,
    isIcon: false
  },
  // {
  //   width: 150,
  //   label: 'Categoria Pai',
  //   dataKey: 'parent'
  // },
  // {
  //   width: 100,
  //   label: 'Quantidade de Produtos',
  //   dataKey: 'quantity',
  //   numeric: true,
  // },
  {
    width: 50,
    label: '',
    dataKey: null,
    icon: <MoreVertIcon fontSize='small' />,
    isText: false,
    isIcon: true
  },
];

const VirtuosoTableComponents = {
  Scroller: React.forwardRef((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
  ),
  TableHead,
  TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
  TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
};

function fixedHeaderContent() {
  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          variant="head"
          align={column.numeric || false ? 'right' : 'left'}
          style={{ width: column.width, fontWeight: 700, textAlign: 'left' }}
          sx={{
            backgroundColor: 'background.paper',
          }}
        >
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );
}

function rowContent(option) {
  return (
    <React.Fragment>
      {columns.map((column) => (
        <ColumnTable
          key={column.dataKey}
        >
          <CellContainer style={{justifyContent: column.isIcon ? 'flex-end' : 'flex-start'}}>
            {column.isText && option[column.dataKey]}
            {column.isIcon && (
              <IconButton>
                {column.icon}
              </IconButton>
            )}
          </CellContainer>
        </ColumnTable>
        // <RowDiv>
        //   {option[column.dataKey]}
        // </RowDiv>
      ))}
    </React.Fragment>
  );
}

export default function VirtualizedTable({ options }) {

  return (
    <Paper style={{ height: '100%', width: '100%' }}>
      <TableVirtuoso
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={index => rowContent(options[index])}
        totalCount={options.length}
      />
    </Paper>
  );
}

VirtualizedTable.propTypes = {
  selectedOption: PropTypes.string,
  options: PropTypes.array
};