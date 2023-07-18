package com.tellescom.all4qms.repository;

import static org.springframework.data.relational.core.query.Criteria.where;
import static org.springframework.data.relational.core.query.Query.query;

import com.tellescom.all4qms.domain.Processo;
import com.tellescom.all4qms.domain.Usuario;
import com.tellescom.all4qms.repository.rowmapper.FuncaoRowMapper;
import com.tellescom.all4qms.repository.rowmapper.SetorRowMapper;
import com.tellescom.all4qms.repository.rowmapper.UserRowMapper;
import com.tellescom.all4qms.repository.rowmapper.UsuarioRowMapper;
import com.tellescom.all4qms.repository.rowmapper.UsuarioRowMapper;
import io.r2dbc.spi.Row;
import io.r2dbc.spi.RowMetadata;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.function.BiFunction;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.convert.R2dbcConverter;
import org.springframework.data.r2dbc.core.R2dbcEntityOperations;
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate;
import org.springframework.data.r2dbc.repository.support.SimpleR2dbcRepository;
import org.springframework.data.relational.core.query.Criteria;
import org.springframework.data.relational.core.sql.Column;
import org.springframework.data.relational.core.sql.Comparison;
import org.springframework.data.relational.core.sql.Condition;
import org.springframework.data.relational.core.sql.Conditions;
import org.springframework.data.relational.core.sql.Expression;
import org.springframework.data.relational.core.sql.Select;
import org.springframework.data.relational.core.sql.SelectBuilder.SelectFromAndJoinCondition;
import org.springframework.data.relational.core.sql.Table;
import org.springframework.data.relational.repository.support.MappingRelationalEntityInformation;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.r2dbc.core.RowsFetchSpec;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data R2DBC custom repository implementation for the Usuario entity.
 */
@SuppressWarnings("unused")
class UsuarioRepositoryInternalImpl extends SimpleR2dbcRepository<Usuario, Long> implements UsuarioRepositoryInternal {

    private final DatabaseClient db;
    private final R2dbcEntityTemplate r2dbcEntityTemplate;
    private final EntityManager entityManager;

    private final FuncaoRowMapper funcaoMapper;
    private final UsuarioRowMapper usuarioMapper;
    private final SetorRowMapper setorMapper;
    private final UserRowMapper userMapper;

    private static final Table entityTable = Table.aliased("usuario", EntityManager.ENTITY_ALIAS);
    private static final Table funcaoTable = Table.aliased("funcao", "funcao");
    private static final Table gestorTable = Table.aliased("usuario", "gestor");
    private static final Table setorTable = Table.aliased("setor", "setor");
    private static final Table userTable = Table.aliased("jhi_user", "e_user");
    private static final Table criadoPorTable = Table.aliased("usuario", "criadoPor");
    private static final Table atualizadoPorTable = Table.aliased("usuario", "atualizadoPor");

    private static final EntityManager.LinkTable processosLink = new EntityManager.LinkTable(
        "rel_usuario__processos",
        "usuario_id",
        "processos_id"
    );

    public UsuarioRepositoryInternalImpl(
        R2dbcEntityTemplate template,
        EntityManager entityManager,
        FuncaoRowMapper funcaoMapper,
        UsuarioRowMapper usuarioMapper,
        SetorRowMapper setorMapper,
        UserRowMapper userMapper,
        R2dbcEntityOperations entityOperations,
        R2dbcConverter converter
    ) {
        super(
            new MappingRelationalEntityInformation(converter.getMappingContext().getRequiredPersistentEntity(Usuario.class)),
            entityOperations,
            converter
        );
        this.db = template.getDatabaseClient();
        this.r2dbcEntityTemplate = template;
        this.entityManager = entityManager;
        this.funcaoMapper = funcaoMapper;
        this.usuarioMapper = usuarioMapper;
        this.setorMapper = setorMapper;
        this.userMapper = userMapper;
    }

    @Override
    public Flux<Usuario> findAllBy(Pageable pageable) {
        return createQuery(pageable, null).all();
    }

    RowsFetchSpec<Usuario> createQuery(Pageable pageable, Condition whereClause) {
        List<Expression> columns = UsuarioSqlHelper.getColumns(entityTable, EntityManager.ENTITY_ALIAS);
        columns.addAll(FuncaoSqlHelper.getColumns(funcaoTable, "funcao"));
        columns.addAll(UsuarioSqlHelper.getColumns(gestorTable, "gestor"));
        columns.addAll(SetorSqlHelper.getColumns(setorTable, "setor"));
        columns.addAll(UserSqlHelper.getColumns(userTable, "user"));
        columns.addAll(UsuarioSqlHelper.getColumns(criadoPorTable, "criadoPor"));
        columns.addAll(UsuarioSqlHelper.getColumns(atualizadoPorTable, "atualizadoPor"));
        SelectFromAndJoinCondition selectFrom = Select
            .builder()
            .select(columns)
            .from(entityTable)
            .leftOuterJoin(funcaoTable)
            .on(Column.create("funcao_id", entityTable))
            .equals(Column.create("id", funcaoTable))
            .leftOuterJoin(gestorTable)
            .on(Column.create("gestor_id", entityTable))
            .equals(Column.create("id", gestorTable))
            .leftOuterJoin(setorTable)
            .on(Column.create("setor_id", entityTable))
            .equals(Column.create("id", setorTable))
            .leftOuterJoin(userTable)
            .on(Column.create("user_id", entityTable))
            .equals(Column.create("id", userTable))
            .leftOuterJoin(criadoPorTable)
            .on(Column.create("criado_por_id", entityTable))
            .equals(Column.create("id", criadoPorTable))
            .leftOuterJoin(atualizadoPorTable)
            .on(Column.create("atualizado_por_id", entityTable))
            .equals(Column.create("id", atualizadoPorTable));
        // we do not support Criteria here for now as of https://github.com/jhipster/generator-jhipster/issues/18269
        String select = entityManager.createSelect(selectFrom, Usuario.class, pageable, whereClause);
        return db.sql(select).map(this::process);
    }

    @Override
    public Flux<Usuario> findAll() {
        return findAllBy(null);
    }

    @Override
    public Mono<Usuario> findById(Long id) {
        Comparison whereClause = Conditions.isEqual(entityTable.column("id"), Conditions.just(id.toString()));
        return createQuery(null, whereClause).one();
    }

    @Override
    public Mono<Usuario> findOneWithEagerRelationships(Long id) {
        return findById(id);
    }

    @Override
    public Flux<Usuario> findAllWithEagerRelationships() {
        return findAll();
    }

    @Override
    public Flux<Usuario> findAllWithEagerRelationships(Pageable page) {
        return findAllBy(page);
    }

    private Usuario process(Row row, RowMetadata metadata) {
        Usuario entity = usuarioMapper.apply(row, "e");
        entity.setFuncao(funcaoMapper.apply(row, "funcao"));
        entity.setGestor(usuarioMapper.apply(row, "gestor"));
        entity.setSetor(setorMapper.apply(row, "setor"));
        entity.setUser(userMapper.apply(row, "user"));
        entity.setCriadoPor(usuarioMapper.apply(row, "criadoPor"));
        entity.setAtualizadoPor(usuarioMapper.apply(row, "atualizadoPor"));
        return entity;
    }

    @Override
    public <S extends Usuario> Mono<S> save(S entity) {
        return super.save(entity).flatMap((S e) -> updateRelations(e));
    }

    protected <S extends Usuario> Mono<S> updateRelations(S entity) {
        Mono<Void> result = entityManager
            .updateLinkTable(processosLink, entity.getId(), entity.getProcessos().stream().map(Processo::getId))
            .then();
        return result.thenReturn(entity);
    }

    @Override
    public Mono<Void> deleteById(Long entityId) {
        return deleteRelations(entityId).then(super.deleteById(entityId));
    }

    protected Mono<Void> deleteRelations(Long entityId) {
        return entityManager.deleteFromLinkTable(processosLink, entityId);
    }
}
