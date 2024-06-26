package com.tellescom.all4qms.repository;

import com.tellescom.all4qms.domain.Pendencia;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.relational.core.query.Criteria;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data R2DBC repository for the Pendencia entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PendenciaRepository extends ReactiveCrudRepository<Pendencia, Long>, PendenciaRepositoryInternal {
    Flux<Pendencia> findAllBy(Pageable pageable);

    @Override
    Mono<Pendencia> findOneWithEagerRelationships(Long id);

    @Override
    Flux<Pendencia> findAllWithEagerRelationships();

    @Override
    Flux<Pendencia> findAllWithEagerRelationships(Pageable page);

    @Query("SELECT * FROM pendencia entity WHERE entity.responsavel_id = :id")
    Flux<Pendencia> findByResponsavel(Long id);

    @Query("SELECT COUNT(*) FROM pendencia entity WHERE entity.responsavel_id = :id and entity.status = false")
    Flux<Integer> findByResponsavelCount(Long id);

    @Query("SELECT * FROM pendencia entity WHERE entity.responsavel_id = :id")
    Flux<Pendencia> findByResponsavelPendencias(Long id, Pageable pageable);

    @Query("SELECT * FROM pendencia entity WHERE entity.responsavel_id IS NULL")
    Flux<Pendencia> findAllWhereResponsavelIsNull();

    @Query("SELECT * FROM pendencia entity WHERE entity.criado_por_id = :id")
    Flux<Pendencia> findByCriadoPor(Long id);

    @Query("SELECT * FROM pendencia entity WHERE entity.criado_por_id IS NULL")
    Flux<Pendencia> findAllWhereCriadoPorIsNull();

    @Query("SELECT * FROM pendencia entity WHERE entity.atualizado_por_id = :id")
    Flux<Pendencia> findByAtualizadoPor(Long id);

    @Query("SELECT * FROM pendencia entity WHERE entity.atualizado_por_id IS NULL")
    Flux<Pendencia> findAllWhereAtualizadoPorIsNull();

    @Override
    <S extends Pendencia> Mono<S> save(S entity);

    @Override
    Flux<Pendencia> findAll();

    @Override
    Mono<Pendencia> findById(Long id);

    @Override
    Mono<Void> deleteById(Long id);
}

interface PendenciaRepositoryInternal {
    <S extends Pendencia> Mono<S> save(S entity);

    Flux<Pendencia> findAllBy(Pageable pageable);

    Flux<Pendencia> findAll();

    Mono<Pendencia> findById(Long id);
    // this is not supported at the moment because of https://github.com/jhipster/generator-jhipster/issues/18269
    // Flux<Pendencia> findAllBy(Pageable pageable, Criteria criteria);

    Mono<Pendencia> findOneWithEagerRelationships(Long id);

    Flux<Pendencia> findAllWithEagerRelationships();

    Flux<Pendencia> findAllWithEagerRelationships(Pageable page);

    Mono<Void> deleteById(Long id);
}
