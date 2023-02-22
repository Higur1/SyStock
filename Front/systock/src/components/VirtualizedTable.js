import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso } from 'react-virtuoso';
import useCategory from '../hooks/useCategory';
import PropTypes from 'prop-types';

const columns = [
  {
    width: 150,
    label: 'Categoria',
    dataKey: 'label',
  },
  {
    width: 150,
    label: 'Categoria Pai',
    dataKey: 'father'
  },
  {
    width: 100,
    label: 'Quantidade de Produtos',
    dataKey: 'quantity',
    numeric: true,
  }
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
        <TableCell
          key={column.dataKey}
          align={column.numeric || false ? 'right' : 'left'}
          style={{ textAlign: 'left' }}
        >
          {option[column.dataKey]}
        </TableCell>
      ))}
    </React.Fragment>
  );
}

export default function VirtualizedTable({ options }) {

  return (
    <Paper style={{ height: 400, width: '100%' }}>
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