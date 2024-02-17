package com.tellescom.all4qms.repository;

import com.tellescom.all4qms.domain.Usuario;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.relational.core.query.Criteria;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data R2DBC repository for the Usuario entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UsuarioRepository extends ReactiveCrudRepository<Usuario, Long>, UsuarioRepositoryInternal {
    Flux<Usuario> findAllBy(Pageable pageable);

    @Override
    Mono<Usuario> findOneWithEagerRelationships(Long id);

    @Override
    Flux<Usuario> findAllWithEagerRelationships();

    @Override
    Flux<Usuario> findAllWithEagerRelationships(Pageable page);

    @Query("SELECT * FROM usuario entity WHERE entity.funcao_id = :id")
    Flux<Usuario> findByFuncao(Long id);

    @Query("SELECT * FROM usuario entity WHERE entity.funcao_id IS NULL")
    Flux<Usuario> findAllWhereFuncaoIsNull();

    @Query("SELECT * FROM usuario entity WHERE entity.gestor_id = :id")
    Flux<Usuario> findByGestor(Long id);

    @Query("SELECT * FROM usuario entity WHERE entity.gestor_id IS NULL")
    Flux<Usuario> findAllWhereGestorIsNull();

    @Query("SELECT * FROM usuario entity WHERE entity.setor_id = :id")
    Flux<Usuario> findBySetor(Long id);

    @Query("SELECT * FROM usuario entity WHERE entity.setor_id IS NULL")
    Flux<Usuario> findAllWhereSetorIsNull();

    @Query("SELECT * FROM usuario entity WHERE entity.user_id = :id")
    Flux<Usuario> findByUser(Long id);

    @Query("SELECT * FROM usuario entity WHERE entity.user_id IS NULL")
    Flux<Usuario> findAllWhereUserIsNull();

    @Query("SELECT * FROM usuario entity WHERE entity.criado_por_id = :id")
    Flux<Usuario> findByCriadoPor(Long id);

    @Query("SELECT * FROM usuario entity WHERE entity.criado_por_id IS NULL")
    Flux<Usuario> findAllWhereCriadoPorIsNull();

    @Query("SELECT * FROM usuario entity WHERE entity.atualizado_por_id = :id")
    Flux<Usuario> findByAtualizadoPor(Long id);

    @Query("SELECT * FROM usuario entity WHERE entity.atualizado_por_id IS NULL")
    Flux<Usuario> findAllWhereAtualizadoPorIsNull();

    @Query(
        "SELECT entity.* FROM usuario entity JOIN rel_usuario__processos joinTable ON entity.id = joinTable.processos_id WHERE joinTable.processos_id = :id"
    )
    Flux<Usuario> findByProcessos(Long id);

    @Query("SELECT * FROM usuario entity WHERE entity.is_gestor is TRUE")
    Flux<Usuario> findAllIsGestor();

    @Override
    <S extends Usuario> Mono<S> save(S entity);

    @Override
    Flux<Usuario> findAll();

    @Override
    Mono<Usuario> findById(Long id);

    @Override
    Mono<Void> deleteById(Long id);
}

interface UsuarioRepositoryInternal {
    <S extends Usuario> Mono<S> save(S entity);

    Flux<Usuario> findAllBy(Pageable pageable);

    Flux<Usuario> findAll();

    Mono<Usuario> findById(Long id);
    // this is not supported at the moment because of https://github.com/jhipster/generator-jhipster/issues/18269
    // Flux<Usuario> findAllBy(Pageable pageable, Criteria criteria);

    Mono<Usuario> findOneWithEagerRelationships(Long id);

    Flux<Usuario> findAllWithEagerRelationships();

    Flux<Usuario> findAllWithEagerRelationships(Pageable page);

    Mono<Void> deleteById(Long id);
}
