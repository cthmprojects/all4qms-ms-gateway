package com.tellescom.all4qms.repository;

import static org.springframework.data.relational.core.query.Criteria.where;

import com.tellescom.all4qms.domain.Anexo;
import com.tellescom.all4qms.domain.criteria.AnexoCriteria;
import com.tellescom.all4qms.repository.rowmapper.AnexoRowMapper;
import com.tellescom.all4qms.repository.rowmapper.ColumnConverter;
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
import org.springframework.data.relational.core.sql.SelectBuilder.SelectFromAndJoin;
import org.springframework.data.relational.core.sql.Table;
import org.springframework.data.relational.repository.support.MappingRelationalEntityInformation;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.r2dbc.core.RowsFetchSpec;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import tech.jhipster.service.ConditionBuilder;

/**
 * Spring Data R2DBC custom repository implementation for the Anexo entity.
 */
@SuppressWarnings("unused")
class AnexoRepositoryInternalImpl extends SimpleR2dbcRepository<Anexo, Long> implements AnexoRepositoryInternal {

    private final DatabaseClient db;
    private final R2dbcEntityTemplate r2dbcEntityTemplate;
    private final EntityManager entityManager;

    private final AnexoRowMapper anexoMapper;
    private final ColumnConverter columnConverter;

    private static final Table entityTable = Table.aliased("anexo", EntityManager.ENTITY_ALIAS);

    public AnexoRepositoryInternalImpl(
        R2dbcEntityTemplate template,
        EntityManager entityManager,
        AnexoRowMapper anexoMapper,
        R2dbcEntityOperations entityOperations,
        R2dbcConverter converter,
        ColumnConverter columnConverter
    ) {
        super(
            new MappingRelationalEntityInformation(converter.getMappingContext().getRequiredPersistentEntity(Anexo.class)),
            entityOperations,
            converter
        );
        this.db = template.getDatabaseClient();
        this.r2dbcEntityTemplate = template;
        this.entityManager = entityManager;
        this.anexoMapper = anexoMapper;
        this.columnConverter = columnConverter;
    }

    @Override
    public Flux<Anexo> findAllBy(Pageable pageable) {
        return createQuery(pageable, null).all();
    }

    RowsFetchSpec<Anexo> createQuery(Pageable pageable, Condition whereClause) {
        List<Expression> columns = AnexoSqlHelper.getColumns(entityTable, EntityManager.ENTITY_ALIAS);
        SelectFromAndJoin selectFrom = Select.builder().select(columns).from(entityTable);
        // we do not support Criteria here for now as of https://github.com/jhipster/generator-jhipster/issues/18269
        String select = entityManager.createSelect(selectFrom, Anexo.class, pageable, whereClause);
        return db.sql(select).map(this::process);
    }

    @Override
    public Flux<Anexo> findAll() {
        return findAllBy(null);
    }

    @Override
    public Mono<Anexo> findById(Long id) {
        Comparison whereClause = Conditions.isEqual(entityTable.column("id"), Conditions.just(id.toString()));
        return createQuery(null, whereClause).one();
    }

    private Anexo process(Row row, RowMetadata metadata) {
        Anexo entity = anexoMapper.apply(row, "e");
        return entity;
    }

    @Override
    public <S extends Anexo> Mono<S> save(S entity) {
        return super.save(entity);
    }

    @Override
    public Flux<Anexo> findByCriteria(AnexoCriteria anexoCriteria, Pageable page) {
        return createQuery(page, buildConditions(anexoCriteria)).all();
    }

    @Override
    public Mono<Long> countByCriteria(AnexoCriteria criteria) {
        return findByCriteria(criteria, null)
            .collectList()
            .map(collectedList -> collectedList != null ? (long) collectedList.size() : (long) 0);
    }

    private Condition buildConditions(AnexoCriteria criteria) {
        ConditionBuilder builder = new ConditionBuilder(this.columnConverter);
        List<Condition> allConditions = new ArrayList<Condition>();
        if (criteria != null) {
            if (criteria.getId() != null) {
                builder.buildFilterConditionForField(criteria.getId(), entityTable.column("id"));
            }
            if (criteria.getNomeArquivo() != null) {
                builder.buildFilterConditionForField(criteria.getNomeArquivo(), entityTable.column("nome_arquivo"));
            }
            if (criteria.getNomeOriginal() != null) {
                builder.buildFilterConditionForField(criteria.getNomeOriginal(), entityTable.column("nome_original"));
            }
            if (criteria.getExtensao() != null) {
                builder.buildFilterConditionForField(criteria.getExtensao(), entityTable.column("extensao"));
            }
            if (criteria.getCriadoEm() != null) {
                builder.buildFilterConditionForField(criteria.getCriadoEm(), entityTable.column("criado_em"));
            }
            if (criteria.getAtualizadoEm() != null) {
                builder.buildFilterConditionForField(criteria.getAtualizadoEm(), entityTable.column("atualizado_em"));
            }
        }
        return builder.buildConditions();
    }
}
