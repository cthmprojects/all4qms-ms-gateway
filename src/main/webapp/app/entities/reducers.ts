import usuario from 'app/entities/usuario/usuario.reducer';
import funcao from 'app/entities/funcao/funcao.reducer';
import setor from 'app/entities/setor/setor.reducer';
import processo from 'app/entities/processo/processo.reducer';
import pendencia from 'app/entities/pendencia/pendencia.reducer';
import anexo from 'app/entities/anexo/anexo.reducer';
import parametro from 'app/entities/parametro/parametro.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const entitiesReducers = {
  usuario,
  funcao,
  setor,
  processo,
  pendencia,
  anexo,
  parametro,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
};

export default entitiesReducers;
