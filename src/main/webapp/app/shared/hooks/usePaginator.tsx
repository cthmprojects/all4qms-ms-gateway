import { TablePagination } from '@mui/material';
import { useState } from 'react';

export const usePaginator = (totalItems: number) => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(5);
  function displayedRowsLabel({ from, to, count }) {
    return `${from}–${to} de ${count !== -1 ? count : `mais de ${to}`}`;
  }

  const onPageChanged = (event: React.ChangeEvent<unknown>, page: number) => {
    setPage(page);
  };

  const onRowsPerPageChanged = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPageSize(parseInt(event.target.value, 10));
    // setPage(1);
  };

  const paginator = (
    <TablePagination
      component="div"
      count={totalItems}
      labelDisplayedRows={displayedRowsLabel}
      labelRowsPerPage="Itens por página:"
      onPageChange={onPageChanged}
      onRowsPerPageChange={onRowsPerPageChanged}
      page={page}
      rowsPerPage={pageSize}
      rowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
      style={{ display: 'flex', alignContent: 'center', width: '390px' }}
    />
  );

  return {
    paginator,
    page,
    pageSize,
  };
};
