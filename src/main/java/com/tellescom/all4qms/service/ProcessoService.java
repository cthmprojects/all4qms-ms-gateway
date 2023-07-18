package com.tellescom.all4qms.service;

import com.tellescom.all4qms.domain.Processo;
import com.tellescom.all4qms.repository.ProcessoRepository;
import com.tellescom.all4qms.service.dto.ProcessoDTO;
import com.tellescom.all4qms.service.mapper.ProcessoMapper;
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

    public ProcessoService(ProcessoRepository processoRepository, ProcessoMapper processoMapper) {
        this.processoRepository = processoRepository;
        this.processoMapper = processoMapper;
    }

    /**
     * Save a processo.
     *
     * @param processoDTO the entity to save.
     * @return the persisted entity.
     */
    public Mono<ProcessoDTO> save(ProcessoDTO processoDTO) {
        log.debug("Request to save Processo : {}", processoDTO);
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
     * @return the number of entities in the database.
     *
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
        return processoRepository.deleteById(id);
    }
}
