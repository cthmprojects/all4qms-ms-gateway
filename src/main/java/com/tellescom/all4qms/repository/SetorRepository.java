package com.tellescom.all4qms.repository;

import com.tellescom.all4qms.domain.Setor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.relational.core.query.Criteria;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data R2DBC repository for the Setor entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SetorRepository extends ReactiveCrudRepository<Setor, Long>, SetorRepositoryInternal {
    Flux<Setor> findAllBy(Pageable pageable);

    @Override
    Mono<Setor> findOneWithEagerRelationships(Long id);

    @Override
    Flux<Setor> findAllWithEagerRelationships();

    @Override
    Flux<Setor> findAllWithEagerRelationships(Pageable page);

    @Query("SELECT * FROM setor entity WHERE entity.criado_por_id = :id")
    Flux<Setor> findByCriadoPor(Long id);

    @Query("SELECT * FROM setor entity WHERE entity.criado_por_id IS NULL")
    Flux<Setor> findAllWhereCriadoPorIsNull();

    @Query("SELECT * FROM setor entity WHERE entity.atualizado_por_id = :id")
    Flux<Setor> findByAtualizadoPor(Long id);

    @Query("SELECT * FROM setor entity WHERE entity.atualizado_por_id IS NULL")
    Flux<Setor> findAllWhereAtualizadoPorIsNull();

    @Query("SELECT * FROM setor entity WHERE entity.id not in (select usuario_id from usuario)")
    Flux<Setor> findAllWhereUsuarioIsNull();

    @Override
    <S extends Setor> Mono<S> save(S entity);

    @Override
    Flux<Setor> findAll();

    @Override
    Mono<Setor> findById(Long id);

    @Override
    Mono<Void> deleteById(Long id);
}

interface SetorRepositoryInternal {
    <S extends Setor> Mono<S> save(S entity);

    Flux<Setor> findAllBy(Pageable pageable);

    Flux<Setor> findAll();

    Mono<Setor> findById(Long id);
    // this is not supported at the moment because of https://github.com/jhipster/generator-jhipster/issues/18269
    // Flux<Setor> findAllBy(Pageable pageable, Criteria criteria);

    Mono<Setor> findOneWithEagerRelationships(Long id);

    Flux<Setor> findAllWithEagerRelationships();

    Flux<Setor> findAllWithEagerRelationships(Pageable page);

    Mono<Void> deleteById(Long id);
}
