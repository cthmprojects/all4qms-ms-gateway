import usuario from 'app/entities/usuario/usuario.reducer';
import funcao from 'app/entities/funcao/funcao.reducer';
import setor from 'app/entities/setor/setor.reducer';
import processo from 'app/entities/processo/processo.reducer';
import pendencia from 'app/entities/pendencia/pendencia.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const entitiesReducers = {
  usuario,
  funcao,
  setor,
  processo,
  pendencia,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
};

export default entitiesReducers;
