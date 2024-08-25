import { TablePagination, Box, BoxProps, TablePaginationProps } from '@mui/material';
import { useEffect, useState } from 'react';

type Config = {
  boxProps?: BoxProps;
  paginatorProps?: Omit<TablePaginationProps, 'count' | 'onPageChange' | 'page' | 'rowsPerPage' | 'onRowsPerPageChange'>;
};

export const usePaginator = (totalItems: number, config: Config = {}) => {
  const { boxProps, paginatorProps } = config;
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
  };

  useEffect(() => {
    setPage(0);
  }, [totalItems, pageSize]);

  const paginator = (
    <Box display="flex" justifyContent="center" {...(boxProps || {})}>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
        sx={{ display: 'flex', alignContent: 'center', width: 'fit-content' }}
        {...(paginatorProps || {})}
        component="div"
        count={totalItems}
        labelDisplayedRows={displayedRowsLabel}
        labelRowsPerPage="Itens por página:"
        onPageChange={onPageChanged}
        onRowsPerPageChange={onRowsPerPageChanged}
        page={page}
        rowsPerPage={pageSize}
      />
    </Box>
  );

  return {
    paginator,
    page,
    pageSize,
  };
};
