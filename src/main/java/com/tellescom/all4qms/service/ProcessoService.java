package com.tellescom.all4qms.service;

import com.tellescom.all4qms.domain.Processo;
import com.tellescom.all4qms.domain.Usuario;
import com.tellescom.all4qms.domain.response.ProcessoResponse;
import com.tellescom.all4qms.repository.ProcessoRepository;
import com.tellescom.all4qms.service.dto.ProcessoDTO;
import com.tellescom.all4qms.service.dto.UsuarioDTO;
import com.tellescom.all4qms.service.mapper.ProcessoMapper;
import com.tellescom.all4qms.service.mapper.UsuarioMapper;
import com.tellescom.all4qms.web.rest.errors.BadRequestAlertException;
import java.time.Instant;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service Implementation for managing {@link Processo}.
 */
@Service
@Transactional
public class ProcessoService {

    private final Logger log = LoggerFactory.getLogger(ProcessoService.class);

    private final ProcessoRepository processoRepository;

    private final ProcessoMapper processoMapper;

    private final UsuarioMapper usuarioMapper;

    public ProcessoService(ProcessoRepository processoRepository, ProcessoMapper processoMapper, UsuarioMapper usuarioMapper) {
        this.processoRepository = processoRepository;
        this.processoMapper = processoMapper;
        this.usuarioMapper = usuarioMapper;
    }

    /**
     * Save a processo.
     *
     * @param processoDTO the entity to save.
     * @return the persisted entity.
     */
    public Mono<ProcessoDTO> save(ProcessoDTO processoDTO) {
        log.debug("Request to save Processo : {}", processoDTO);
        processoDTO.setCriadoEm(Instant.now());
        return processoRepository.save(processoMapper.toEntity(processoDTO)).map(processoMapper::toDto);
    }

    /**
     * Update a processo.
     *
     * @param processoDTO the entity to save.
     * @return the persisted entity.
     */
    public Mono<ProcessoDTO> update(ProcessoDTO processoDTO) {
        log.debug("Request to update Processo : {}", processoDTO);
        processoDTO.setAtualizadoEm(Instant.now());
        return processoRepository.save(processoMapper.toEntity(processoDTO)).map(processoMapper::toDto);
    }

    /**
     * Partially update a processo.
     *
     * @param processoDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Mono<ProcessoDTO> partialUpdate(ProcessoDTO processoDTO) {
        log.debug("Request to partially update Processo : {}", processoDTO);
        processoDTO.setAtualizadoEm(Instant.now());
        return processoRepository
            .findById(processoDTO.getId())
            .map(existingProcesso -> {
                processoMapper.partialUpdate(existingProcesso, processoDTO);

                return existingProcesso;
            })
            .flatMap(processoRepository::save)
            .map(processoMapper::toDto);
    }

    /**
     * Get all the processos.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Flux<ProcessoDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Processos");
        return processoRepository.findAllBy(pageable).map(processoMapper::toDto);
    }

    /**
     * Get all the processos with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Flux<ProcessoDTO> findAllWithEagerRelationships(Pageable pageable) {
        return processoRepository.findAllWithEagerRelationships(pageable).map(processoMapper::toDto);
    }

    /**
     * Returns the number of processos available.
     *
     * @return the number of entities in the database.
     */
    public Mono<Long> countAll() {
        return processoRepository.count();
    }

    /**
     * Get one processo by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Mono<Processo> findOneNotDTO(Long id) {
        log.debug("Request to get Processo : {}", id);
        return processoRepository.findOneWithEagerRelationships(id);
    }

    /**
     * Get one processo by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Mono<ProcessoDTO> findOne(Long id) {
        log.debug("Request to get Processo : {}", id);
        return processoRepository.findOneWithEagerRelationships(id).map(processoMapper::toDto);
    }

    /**
     * Delete the processo by id.
     *
     * @param id the id of the entity.
     * @return a Mono to signal the deletion
     */
    public Mono<Void> delete(Long id) {
        log.debug("Request to delete Processo : {}", id);
        return processoRepository
            .findByProcessos(id)
            .collectList()
            .flatMap(usuarios -> {
                if (usuarios.isEmpty()) {
                    return processoRepository.deleteById(id);
                } else {
                    return Mono.error(
                        new BadRequestAlertException(
                            "Processo não pode ser removido.\n Motivo: Sendo utilizado.",
                            "ProcessosEntity",
                            "idUsed"
                        )
                    );
                }
            });
    }

    public Flux<Processo> buscarProcessosPorIds(List<Long> processoIds) {
        log.debug("Request to findAll Processos by idList : {}", processoIds);
        return processoRepository.buscarProcessosPorIds(processoIds);
    }

    public Flux<ProcessoDTO> buscarProcessosPorIdUsuario(Long id) {
        log.debug("Request to findAll Processos by usuario id : {}", id);
        return processoRepository.findAllByUsuarioId(id).map(processoMapper::toDto);
    }

    public Flux<UsuarioDTO> buscarUsuariosPorIdProcesso(Long id) {
        log.debug("Request to findAll Usuarios by Processo id : {}", id);
        return processoRepository.findByProcessos(id).map(usuarioMapper::toDto);
    }

    public Flux<Long> buscarIdUserByIdProcesso(Long id) {
        return processoRepository.findUserIdByProcessos(id);
    }

    public Mono<List<ProcessoResponse>> buscaTodosProcessosResponse() {
        return processoRepository.findAll().map(processoMapper::toResponse).collectList();
    }
}
