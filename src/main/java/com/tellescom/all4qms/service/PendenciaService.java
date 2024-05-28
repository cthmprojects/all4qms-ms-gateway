package com.tellescom.all4qms.service;

import com.tellescom.all4qms.domain.Pendencia;
import com.tellescom.all4qms.repository.PendenciaRepository;
import com.tellescom.all4qms.service.dto.PendenciaDTO;
import com.tellescom.all4qms.service.mapper.PendenciaMapper;
import java.time.Instant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service Implementation for managing {@link Pendencia}.
 */
@Service
@Transactional
public class PendenciaService {

    private final Logger log = LoggerFactory.getLogger(PendenciaService.class);

    private final PendenciaRepository pendenciaRepository;

    private final PendenciaMapper pendenciaMapper;

    public PendenciaService(PendenciaRepository pendenciaRepository, PendenciaMapper pendenciaMapper) {
        this.pendenciaRepository = pendenciaRepository;
        this.pendenciaMapper = pendenciaMapper;
    }

    /**
     * Save a pendencia.
     *
     * @param pendenciaDTO the entity to save.
     * @return the persisted entity.
     */
    public Mono<PendenciaDTO> save(PendenciaDTO pendenciaDTO) {
        log.debug("Request to save Pendencia : {}", pendenciaDTO);
        pendenciaDTO.setCriadoEm(Instant.now());
        return pendenciaRepository.save(pendenciaMapper.toEntity(pendenciaDTO)).map(pendenciaMapper::toDto);
    }

    /**
     * Update a pendencia.
     *
     * @param pendenciaDTO the entity to save.
     * @return the persisted entity.
     */
    public Mono<PendenciaDTO> update(PendenciaDTO pendenciaDTO) {
        log.debug("Request to update Pendencia : {}", pendenciaDTO);
        return pendenciaRepository.save(pendenciaMapper.toEntity(pendenciaDTO)).map(pendenciaMapper::toDto);
    }

    /**
     * Partially update a pendencia.
     *
     * @param pendenciaDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Mono<PendenciaDTO> partialUpdate(PendenciaDTO pendenciaDTO) {
        log.debug("Request to partially update Pendencia : {}", pendenciaDTO);
        pendenciaDTO.setLidaEm(Instant.now());
        return pendenciaRepository
            .findById(pendenciaDTO.getId())
            .map(existingPendencia -> {
                pendenciaMapper.partialUpdate(existingPendencia, pendenciaDTO);

                return existingPendencia;
            })
            .flatMap(pendenciaRepository::save)
            .map(pendenciaMapper::toDto);
    }

    /**
     * Get all the pendencias.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Flux<PendenciaDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Pendencias");
        return pendenciaRepository.findAllBy(pageable).map(pendenciaMapper::toDto);
    }

    @Transactional(readOnly = true)
    public Flux<PendenciaDTO> findAllPendenciaResponsavel(Long id, Pageable pageable) {
        log.debug("Request to get all Pendencias do Responsavel");
        return pendenciaRepository.findByResponsavelPendencias(id, pageable).map(pendenciaMapper::toDto);
    }

    /**
     * Get all the pendencias with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Flux<PendenciaDTO> findAllWithEagerRelationships(Pageable pageable) {
        return pendenciaRepository.findAllWithEagerRelationships(pageable).map(pendenciaMapper::toDto);
    }

    /**
     * Returns the number of pendencias available.
     * @return the number of entities in the database.
     *
     */
    public Mono<Long> countAll() {
        return pendenciaRepository.count();
    }

    /**
     * Get one pendencia by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Mono<PendenciaDTO> findOne(Long id) {
        log.debug("Request to get Pendencia : {}", id);
        return pendenciaRepository.findOneWithEagerRelationships(id).map(pendenciaMapper::toDto);
    }

    /**
     * Delete the pendencia by id.
     *
     * @param id the id of the entity.
     * @return a Mono to signal the deletion
     */
    public Mono<Void> delete(Long id) {
        log.debug("Request to delete Pendencia : {}", id);
        return pendenciaRepository.deleteById(id);
    }
}
