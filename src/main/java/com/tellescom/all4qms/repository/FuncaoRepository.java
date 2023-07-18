package com.tellescom.all4qms.repository;

import com.tellescom.all4qms.domain.Funcao;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.relational.core.query.Criteria;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data R2DBC repository for the Funcao entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FuncaoRepository extends ReactiveCrudRepository<Funcao, Long>, FuncaoRepositoryInternal {
    Flux<Funcao> findAllBy(Pageable pageable);

    @Override
    Mono<Funcao> findOneWithEagerRelationships(Long id);

    @Override
    Flux<Funcao> findAllWithEagerRelationships();

    @Override
    Flux<Funcao> findAllWithEagerRelationships(Pageable page);

    @Query("SELECT * FROM funcao entity WHERE entity.criado_por_id = :id")
    Flux<Funcao> findByCriadoPor(Long id);

    @Query("SELECT * FROM funcao entity WHERE entity.criado_por_id IS NULL")
    Flux<Funcao> findAllWhereCriadoPorIsNull();

    @Query("SELECT * FROM funcao entity WHERE entity.atualizado_por_id = :id")
    Flux<Funcao> findByAtualizadoPor(Long id);

    @Query("SELECT * FROM funcao entity WHERE entity.atualizado_por_id IS NULL")
    Flux<Funcao> findAllWhereAtualizadoPorIsNull();

    @Override
    <S extends Funcao> Mono<S> save(S entity);

    @Override
    Flux<Funcao> findAll();

    @Override
    Mono<Funcao> findById(Long id);

    @Override
    Mono<Void> deleteById(Long id);
}

interface FuncaoRepositoryInternal {
    <S extends Funcao> Mono<S> save(S entity);

    Flux<Funcao> findAllBy(Pageable pageable);

    Flux<Funcao> findAll();

    Mono<Funcao> findById(Long id);
    // this is not supported at the moment because of https://github.com/jhipster/generator-jhipster/issues/18269
    // Flux<Funcao> findAllBy(Pageable pageable, Criteria criteria);

    Mono<Funcao> findOneWithEagerRelationships(Long id);

    Flux<Funcao> findAllWithEagerRelationships();

    Flux<Funcao> findAllWithEagerRelationships(Pageable page);

    Mono<Void> deleteById(Long id);
}
