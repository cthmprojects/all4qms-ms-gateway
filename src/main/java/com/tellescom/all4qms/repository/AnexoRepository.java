package com.tellescom.all4qms.repository;

import com.tellescom.all4qms.domain.Anexo;
import com.tellescom.all4qms.domain.criteria.AnexoCriteria;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.relational.core.query.Criteria;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data R2DBC repository for the Anexo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AnexoRepository extends ReactiveCrudRepository<Anexo, Long>, AnexoRepositoryInternal {
    Flux<Anexo> findAllBy(Pageable pageable);

    @Override
    <S extends Anexo> Mono<S> save(S entity);

    @Override
    Flux<Anexo> findAll();

    @Override
    Mono<Anexo> findById(Long id);

    @Override
    Mono<Void> deleteById(Long id);
}

interface AnexoRepositoryInternal {
    <S extends Anexo> Mono<S> save(S entity);

    Flux<Anexo> findAllBy(Pageable pageable);

    Flux<Anexo> findAll();

    Mono<Anexo> findById(Long id);
    // this is not supported at the moment because of https://github.com/jhipster/generator-jhipster/issues/18269
    // Flux<Anexo> findAllBy(Pageable pageable, Criteria criteria);
    Flux<Anexo> findByCriteria(AnexoCriteria criteria, Pageable pageable);

    Mono<Long> countByCriteria(AnexoCriteria criteria);
}
