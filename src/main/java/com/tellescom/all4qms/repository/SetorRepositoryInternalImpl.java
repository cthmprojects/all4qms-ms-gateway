package com.tellescom.all4qms.repository;

import static org.springframework.data.relational.core.query.Criteria.where;

import com.tellescom.all4qms.domain.Setor;
import com.tellescom.all4qms.repository.rowmapper.SetorRowMapper;
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
 * Spring Data R2DBC custom repository implementation for the Setor entity.
 */
@SuppressWarnings("unused")
class SetorRepositoryInternalImpl extends SimpleR2dbcRepository<Setor, Long> implements SetorRepositoryInternal {

    private final DatabaseClient db;
    private final R2dbcEntityTemplate r2dbcEntityTemplate;
    private final EntityManager entityManager;

    private final UsuarioRowMapper usuarioMapper;
    private final SetorRowMapper setorMapper;

    private static final Table entityTable = Table.aliased("setor", EntityManager.ENTITY_ALIAS);
    private static final Table criadoPorTable = Table.aliased("usuario", "criadoPor");
    private static final Table atualizadoPorTable = Table.aliased("usuario", "atualizadoPor");

    public SetorRepositoryInternalImpl(
        R2dbcEntityTemplate template,
        EntityManager entityManager,
        UsuarioRowMapper usuarioMapper,
        SetorRowMapper setorMapper,
        R2dbcEntityOperations entityOperations,
        R2dbcConverter converter
    ) {
        super(
            new MappingRelationalEntityInformation(converter.getMappingContext().getRequiredPersistentEntity(Setor.class)),
            entityOperations,
            converter
        );
        this.db = template.getDatabaseClient();
        this.r2dbcEntityTemplate = template;
        this.entityManager = entityManager;
        this.usuarioMapper = usuarioMapper;
        this.setorMapper = setorMapper;
    }

    @Override
    public Flux<Setor> findAllBy(Pageable pageable) {
        return createQuery(pageable, null).all();
    }

    RowsFetchSpec<Setor> createQuery(Pageable pageable, Condition whereClause) {
        List<Expression> columns = SetorSqlHelper.getColumns(entityTable, EntityManager.ENTITY_ALIAS);
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
        String select = entityManager.createSelect(selectFrom, Setor.class, pageable, whereClause);
        return db.sql(select).map(this::process);
    }

    @Override
    public Flux<Setor> findAll() {
        return findAllBy(null);
    }

    @Override
    public Mono<Setor> findById(Long id) {
        Comparison whereClause = Conditions.isEqual(entityTable.column("id"), Conditions.just(id.toString()));
        return createQuery(null, whereClause).one();
    }

    @Override
    public Mono<Setor> findOneWithEagerRelationships(Long id) {
        return findById(id);
    }

    @Override
    public Flux<Setor> findAllWithEagerRelationships() {
        return findAll();
    }

    @Override
    public Flux<Setor> findAllWithEagerRelationships(Pageable page) {
        return findAllBy(page);
    }

    private Setor process(Row row, RowMetadata metadata) {
        Setor entity = setorMapper.apply(row, "e");
        entity.setCriadoPor(usuarioMapper.apply(row, "criadoPor"));
        entity.setAtualizadoPor(usuarioMapper.apply(row, "atualizadoPor"));
        return entity;
    }

    @Override
    public <S extends Setor> Mono<S> save(S entity) {
        return super.save(entity);
    }
}
