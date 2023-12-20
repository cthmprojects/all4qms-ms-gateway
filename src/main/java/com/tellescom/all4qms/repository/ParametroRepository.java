package com.tellescom.all4qms.repository;

import com.tellescom.all4qms.domain.Parametro;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.relational.core.query.Criteria;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data R2DBC repository for the Parametro entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ParametroRepository extends ReactiveCrudRepository<Parametro, Long>, ParametroRepositoryInternal {
    @Override
    <S extends Parametro> Mono<S> save(S entity);

    @Override
    Flux<Parametro> findAll();

    @Override
    Mono<Parametro> findById(Long id);

    @Override
    Mono<Void> deleteById(Long id);
}

interface ParametroRepositoryInternal {
    <S extends Parametro> Mono<S> save(S entity);

    Flux<Parametro> findAllBy(Pageable pageable);

    Flux<Parametro> findAll();

    Mono<Parametro> findById(Long id);
    // this is not supported at the moment because of https://github.com/jhipster/generator-jhipster/issues/18269
    // Flux<Parametro> findAllBy(Pageable pageable, Criteria criteria);
}
