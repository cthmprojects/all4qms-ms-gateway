package com.tellescom.all4qms.repository;

import static org.springframework.data.relational.core.query.Criteria.where;

import com.tellescom.all4qms.domain.Funcao;
import com.tellescom.all4qms.repository.rowmapper.FuncaoRowMapper;
import com.tellescom.all4qms.repository.rowmapper.UsuarioRowMapper;
import io.r2dbc.spi.Row;
import io.r2dbc.spi.RowMetadata;
import java.time.Instant;
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
 * Spring Data R2DBC custom repository implementation for the Funcao entity.
 */
@SuppressWarnings("unused")
class FuncaoRepositoryInternalImpl extends SimpleR2dbcRepository<Funcao, Long> implements FuncaoRepositoryInternal {

    private final DatabaseClient db;
    private final R2dbcEntityTemplate r2dbcEntityTemplate;
    private final EntityManager entityManager;

    private final UsuarioRowMapper usuarioMapper;
    private final FuncaoRowMapper funcaoMapper;

    private static final Table entityTable = Table.aliased("funcao", EntityManager.ENTITY_ALIAS);
    private static final Table criadoPorTable = Table.aliased("usuario", "criadoPor");
    private static final Table atualizadoPorTable = Table.aliased("usuario", "atualizadoPor");

    public FuncaoRepositoryInternalImpl(
        R2dbcEntityTemplate template,
        EntityManager entityManager,
        UsuarioRowMapper usuarioMapper,
        FuncaoRowMapper funcaoMapper,
        R2dbcEntityOperations entityOperations,
        R2dbcConverter converter
    ) {
        super(
            new MappingRelationalEntityInformation(converter.getMappingContext().getRequiredPersistentEntity(Funcao.class)),
            entityOperations,
            converter
        );
        this.db = template.getDatabaseClient();
        this.r2dbcEntityTemplate = template;
        this.entityManager = entityManager;
        this.usuarioMapper = usuarioMapper;
        this.funcaoMapper = funcaoMapper;
    }

    @Override
    public Flux<Funcao> findAllBy(Pageable pageable) {
        return createQuery(pageable, null).all();
    }

    RowsFetchSpec<Funcao> createQuery(Pageable pageable, Condition whereClause) {
        List<Expression> columns = FuncaoSqlHelper.getColumns(entityTable, EntityManager.ENTITY_ALIAS);
        columns.addAll(UsuarioSqlHelper.getColumns(criadoPorTable, "criadoPor"));
        columns.addAll(UsuarioSqlHelper.getColumns(atualizadoPorTable, "atualizadoPor"));
        SelectFromAndJoinCondition selectFrom = Select
            .builder()
            .select(columns)
            .from(entityTable)
            .leftOuterJoin(criadoPorTable)
            .on(Column.create("criado_por_id", entityTable))
            .equals(Column.create("id", criadoPorTable))
            .leftOuterJoin(atualizadoPorTable)
            .on(Column.create("atualizado_por_id", entityTable))
            .equals(Column.create("id", atualizadoPorTable));
        // we do not support Criteria here for now as of https://github.com/jhipster/generator-jhipster/issues/18269
        String select = entityManager.createSelect(selectFrom, Funcao.class, pageable, whereClause);
        return db.sql(select).map(this::process);
    }

    @Override
    public Flux<Funcao> findAll() {
        return findAllBy(null);
    }

    @Override
    public Mono<Funcao> findById(Long id) {
        Comparison whereClause = Conditions.isEqual(entityTable.column("id"), Conditions.just(id.toString()));
        return createQuery(null, whereClause).one();
    }

    @Override
    public Mono<Funcao> findOneWithEagerRelationships(Long id) {
        return findById(id);
    }

    @Override
    public Flux<Funcao> findAllWithEagerRelationships() {
        return findAll();
    }

    @Override
    public Flux<Funcao> findAllWithEagerRelationships(Pageable page) {
        return findAllBy(page);
    }

    private Funcao process(Row row, RowMetadata metadata) {
        Funcao entity = funcaoMapper.apply(row, "e");
        entity.setCriadoPor(usuarioMapper.apply(row, "criadoPor"));
        entity.setAtualizadoPor(usuarioMapper.apply(row, "atualizadoPor"));
        return entity;
    }

    @Override
    public <S extends Funcao> Mono<S> save(S entity) {
        return super.save(entity);
    }
}
