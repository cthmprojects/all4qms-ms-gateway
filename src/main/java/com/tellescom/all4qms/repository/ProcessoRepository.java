package com.tellescom.all4qms.repository;

import com.tellescom.all4qms.domain.Processo;
import com.tellescom.all4qms.domain.Usuario;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.relational.core.query.Criteria;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data R2DBC repository for the Processo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProcessoRepository extends ReactiveCrudRepository<Processo, Long>, ProcessoRepositoryInternal {
    Flux<Processo> findAllBy(Pageable pageable);

    @Override
    Mono<Processo> findOneWithEagerRelationships(Long id);

    @Override
    Flux<Processo> findAllWithEagerRelationships();

    @Override
    Flux<Processo> findAllWithEagerRelationships(Pageable page);

    @Query("SELECT * FROM processo entity WHERE entity.criado_por_id = :id")
    Flux<Processo> findByCriadoPor(Long id);

    @Query("SELECT * FROM processo entity WHERE entity.criado_por_id IS NULL")
    Flux<Processo> findAllWhereCriadoPorIsNull();

    @Query("SELECT * FROM processo entity WHERE entity.atualizado_por_id = :id")
    Flux<Processo> findByAtualizadoPor(Long id);

    @Query("SELECT * FROM processo entity WHERE entity.atualizado_por_id IS NULL")
    Flux<Processo> findAllWhereAtualizadoPorIsNull();

    @Override
    <S extends Processo> Mono<S> save(S entity);

    @Override
    Flux<Processo> findAll();

    @Override
    Mono<Processo> findById(Long id);

    @Override
    Mono<Void> deleteById(Long id);

    @Query("SELECT * FROM processo entity WHERE entity.id IN (:processoIds)")
    Flux<Processo> buscarProcessosPorIds(List<Long> processoIds);

    @Query(
        "SELECT entity.* FROM usuario entity JOIN rel_usuario__processos joinTable ON entity.id = joinTable.usuario_id WHERE joinTable.processos_id = :id"
    )
    Flux<Usuario> findByProcessos(Long id);

    @Query(
        "SELECT entity.id FROM usuario entity JOIN rel_usuario__processos joinTable ON entity.id = joinTable.usuario_id WHERE joinTable.processos_id = :id"
    )
    Flux<Long> findUserIdByProcessos(Long id);

    @Query(
        "SELECT processo.* FROM processo JOIN rel_usuario__processos joinTable ON processo.id = joinTable.processos_id WHERE joinTable.usuario_id = :id"
    )
    Flux<Processo> findAllByUsuarioId(Long id);
}

interface ProcessoRepositoryInternal {
    <S extends Processo> Mono<S> save(S entity);

    Flux<Processo> findAllBy(Pageable pageable);

    Flux<Processo> findAll();

    Mono<Processo> findById(Long id);
    // this is not supported at the moment because of https://github.com/jhipster/generator-jhipster/issues/18269
    // Flux<Processo> findAllBy(Pageable pageable, Criteria criteria);

    Mono<Processo> findOneWithEagerRelationships(Long id);

    Flux<Processo> findAllWithEagerRelationships();

    Flux<Processo> findAllWithEagerRelationships(Pageable page);

    Mono<Void> deleteById(Long id);
}
