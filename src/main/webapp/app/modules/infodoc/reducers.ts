import enums from './reducers/enums.reducer';
import infodoc from './reducers/infodoc.reducer';
import movimentacao from './reducers/movimentacao.reducer';
import anexo from './reducers/anexo.reducer';
import distribuicao from './reducers/distribuicao.reducer';

const infodocReducers = {
  infodoc,
  enums,
  movimentacao,
  anexo,
  distribuicao,
};

export default infodocReducers;
