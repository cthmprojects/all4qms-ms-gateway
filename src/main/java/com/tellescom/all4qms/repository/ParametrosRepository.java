package com.tellescom.all4qms.repository;

import com.tellescom.all4qms.domain.Parametros;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.relational.core.query.Criteria;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data R2DBC repository for the Parametros entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ParametrosRepository extends ReactiveCrudRepository<Parametros, Long>, ParametrosRepositoryInternal {
    @Override
    <S extends Parametros> Mono<S> save(S entity);

    @Override
    Flux<Parametros> findAll();

    @Override
    Mono<Parametros> findById(Long id);

    @Override
    Mono<Void> deleteById(Long id);
}

interface ParametrosRepositoryInternal {
    <S extends Parametros> Mono<S> save(S entity);

    Flux<Parametros> findAllBy(Pageable pageable);

    Flux<Parametros> findAll();

    Mono<Parametros> findById(Long id);
    // this is not supported at the moment because of https://github.com/jhipster/generator-jhipster/issues/18269
    // Flux<Parametros> findAllBy(Pageable pageable, Criteria criteria);
}
