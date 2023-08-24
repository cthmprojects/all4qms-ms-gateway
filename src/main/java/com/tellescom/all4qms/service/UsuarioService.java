package com.tellescom.all4qms.service;

import com.tellescom.all4qms.domain.Usuario;
import com.tellescom.all4qms.repository.UsuarioRepository;
import com.tellescom.all4qms.service.dto.UsuarioDTO;
import com.tellescom.all4qms.service.mapper.UsuarioMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service Implementation for managing {@link Usuario}.
 */
@Service
@Transactional
public class UsuarioService {

    private final Logger log = LoggerFactory.getLogger(UsuarioService.class);

    private final UsuarioRepository usuarioRepository;

    private final UsuarioMapper usuarioMapper;

    public UsuarioService(UsuarioRepository usuarioRepository, UsuarioMapper usuarioMapper) {
        this.usuarioRepository = usuarioRepository;
        this.usuarioMapper = usuarioMapper;
    }

    /**
     * Save a usuario.
     *
     * @param usuarioDTO the entity to save.
     * @return the persisted entity.
     */
    public Mono<UsuarioDTO> save(UsuarioDTO usuarioDTO) {
        log.debug("Request to save Usuario : {}", usuarioDTO);
        return usuarioRepository.save(usuarioMapper.toEntity(usuarioDTO)).map(usuarioMapper::toDto);
    }

    /**
     * Update a usuario.
     *
     * @param usuarioDTO the entity to save.
     * @return the persisted entity.
     */
    public Mono<UsuarioDTO> update(UsuarioDTO usuarioDTO) {
        log.debug("Request to update Usuario : {}", usuarioDTO);
        return usuarioRepository.save(usuarioMapper.toEntity(usuarioDTO)).map(usuarioMapper::toDto);
    }

    /**
     * Partially update a usuario.
     *
     * @param usuarioDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Mono<UsuarioDTO> partialUpdate(UsuarioDTO usuarioDTO) {
        log.debug("Request to partially update Usuario : {}", usuarioDTO);

        return usuarioRepository
            .findById(usuarioDTO.getId())
            .map(existingUsuario -> {
                usuarioMapper.partialUpdate(existingUsuario, usuarioDTO);

                return existingUsuario;
            })
            .flatMap(usuarioRepository::save)
            .map(usuarioMapper::toDto);
    }

    /**
     * Get all the usuarios.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Flux<UsuarioDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Usuarios");
        return usuarioRepository.findAllBy(pageable).map(usuarioMapper::toDto);
    }

    /**
     * Get all the usuarios with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Flux<UsuarioDTO> findAllWithEagerRelationships(Pageable pageable) {
        return usuarioRepository.findAllWithEagerRelationships(pageable).map(usuarioMapper::toDto);
    }

    /**
     *  Get all the usuarios where Usuario is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Flux<UsuarioDTO> findAllWhereUsuarioIsNull() {
        log.debug("Request to get all usuarios where Usuario is null");
        return usuarioRepository.findAllWhereUsuarioIsNull().map(usuarioMapper::toDto);
    }

    /**
     *  Get all the usuarios where Usuario is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Flux<UsuarioDTO> findAllWhereUsuarioIsNull() {
        log.debug("Request to get all usuarios where Usuario is null");
        return usuarioRepository.findAllWhereUsuarioIsNull().map(usuarioMapper::toDto);
    }

    /**
     *  Get all the usuarios where Usuario is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Flux<UsuarioDTO> findAllWhereUsuarioIsNull() {
        log.debug("Request to get all usuarios where Usuario is null");
        return usuarioRepository.findAllWhereUsuarioIsNull().map(usuarioMapper::toDto);
    }

    /**
     *  Get all the usuarios where Funcao is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Flux<UsuarioDTO> findAllWhereFuncaoIsNull() {
        log.debug("Request to get all usuarios where Funcao is null");
        return usuarioRepository.findAllWhereFuncaoIsNull().map(usuarioMapper::toDto);
    }

    /**
     *  Get all the usuarios where Funcao is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Flux<UsuarioDTO> findAllWhereFuncaoIsNull() {
        log.debug("Request to get all usuarios where Funcao is null");
        return usuarioRepository.findAllWhereFuncaoIsNull().map(usuarioMapper::toDto);
    }

    /**
     *  Get all the usuarios where Setor is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Flux<UsuarioDTO> findAllWhereSetorIsNull() {
        log.debug("Request to get all usuarios where Setor is null");
        return usuarioRepository.findAllWhereSetorIsNull().map(usuarioMapper::toDto);
    }

    /**
     *  Get all the usuarios where Setor is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Flux<UsuarioDTO> findAllWhereSetorIsNull() {
        log.debug("Request to get all usuarios where Setor is null");
        return usuarioRepository.findAllWhereSetorIsNull().map(usuarioMapper::toDto);
    }

    /**
     *  Get all the usuarios where Processo is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Flux<UsuarioDTO> findAllWhereProcessoIsNull() {
        log.debug("Request to get all usuarios where Processo is null");
        return usuarioRepository.findAllWhereProcessoIsNull().map(usuarioMapper::toDto);
    }

    /**
     *  Get all the usuarios where Processo is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Flux<UsuarioDTO> findAllWhereProcessoIsNull() {
        log.debug("Request to get all usuarios where Processo is null");
        return usuarioRepository.findAllWhereProcessoIsNull().map(usuarioMapper::toDto);
    }

    /**
     *  Get all the usuarios where Pendencia is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Flux<UsuarioDTO> findAllWherePendenciaIsNull() {
        log.debug("Request to get all usuarios where Pendencia is null");
        return usuarioRepository.findAllWherePendenciaIsNull().map(usuarioMapper::toDto);
    }

    /**
     *  Get all the usuarios where Pendencia is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Flux<UsuarioDTO> findAllWherePendenciaIsNull() {
        log.debug("Request to get all usuarios where Pendencia is null");
        return usuarioRepository.findAllWherePendenciaIsNull().map(usuarioMapper::toDto);
    }

    /**
     *  Get all the usuarios where Pendencia is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Flux<UsuarioDTO> findAllWherePendenciaIsNull() {
        log.debug("Request to get all usuarios where Pendencia is null");
        return usuarioRepository.findAllWherePendenciaIsNull().map(usuarioMapper::toDto);
    }

    /**
     * Returns the number of usuarios available.
     * @return the number of entities in the database.
     *
     */
    public Mono<Long> countAll() {
        return usuarioRepository.count();
    }

    /**
     * Get one usuario by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Mono<UsuarioDTO> findOne(Long id) {
        log.debug("Request to get Usuario : {}", id);
        return usuarioRepository.findOneWithEagerRelationships(id).map(usuarioMapper::toDto);
    }

    /**
     * Delete the usuario by id.
     *
     * @param id the id of the entity.
     * @return a Mono to signal the deletion
     */
    public Mono<Void> delete(Long id) {
        log.debug("Request to delete Usuario : {}", id);
        return usuarioRepository.deleteById(id);
    }
}
