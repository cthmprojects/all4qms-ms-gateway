import { TablePagination, Box, BoxProps, TablePaginationProps } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

type Config = {
  boxProps?: BoxProps;
  paginatorProps?: Omit<TablePaginationProps, 'count' | 'onPageChange' | 'page' | 'rowsPerPage' | 'onRowsPerPageChange'>;
};

export const usePaginator = (totalItems: number, config: Config = {}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { boxProps, paginatorProps } = config;
  const [page, setPage] = useState(Number(searchParams.get('page')) || 0);
  const [pageSize, setPageSize] = useState<number>(Number(searchParams.get('pageSize')) || 5);

  const [isInitialized, setIsInitialized] = useState(false);

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
    isInitialized && setPage(0);
  }, [totalItems, pageSize]);

  function setPaginationInUrl() {
    if (isInitialized) {
      searchParams.set('page', `${page}`);
      searchParams.set('pageSize', `${pageSize}`);
      setSearchParams(searchParams, { replace: true });
    }
  }

  useEffect(setPaginationInUrl, [page, pageSize]);

  useEffect(() => {
    setTimeout(() => {
      const uPage = searchParams.get('page');
      uPage && setPage(Number(uPage));

      const uPageSize = searchParams.get('pageSize');
      uPageSize && setPageSize(Number(uPageSize));
      setIsInitialized(true);
    }, 400);
  }, []);

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
