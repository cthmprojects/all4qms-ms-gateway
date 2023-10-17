package com.tellescom.all4qms.service;

import com.tellescom.all4qms.domain.Parametros;
import com.tellescom.all4qms.repository.ParametrosRepository;
import com.tellescom.all4qms.service.dto.ParametrosDTO;
import com.tellescom.all4qms.service.mapper.ParametrosMapper;
import java.time.Instant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service Implementation for managing {@link Parametros}.
 */
@Service
@Transactional
public class ParametrosService {

    private final Logger log = LoggerFactory.getLogger(ParametrosService.class);

    private final ParametrosRepository parametrosRepository;

    private final ParametrosMapper parametrosMapper;

    public ParametrosService(ParametrosRepository parametrosRepository, ParametrosMapper parametrosMapper) {
        this.parametrosRepository = parametrosRepository;
        this.parametrosMapper = parametrosMapper;
    }

    /**
     * Save a parametros.
     *
     * @param parametrosDTO the entity to save.
     * @return the persisted entity.
     */
    public Mono<ParametrosDTO> save(ParametrosDTO parametrosDTO) {
        log.debug("Request to save Parametros : {}", parametrosDTO);
        return parametrosRepository.save(parametrosMapper.toEntity(parametrosDTO)).map(parametrosMapper::toDto);
    }

    /**
     * Update a parametros.
     *
     * @param parametrosDTO the entity to save.
     * @return the persisted entity.
     */
    public Mono<ParametrosDTO> update(ParametrosDTO parametrosDTO) {
        log.debug("Request to update Parametros : {}", parametrosDTO);
        parametrosDTO.setAtualizadoEm(Instant.now());
        return parametrosRepository.save(parametrosMapper.toEntity(parametrosDTO)).map(parametrosMapper::toDto);
    }

    /**
     * Partially update a parametros.
     *
     * @param parametrosDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Mono<ParametrosDTO> partialUpdate(ParametrosDTO parametrosDTO) {
        log.debug("Request to partially update Parametros : {}", parametrosDTO);
        parametrosDTO.setAtualizadoEm(Instant.now());
        return parametrosRepository
            .findById(parametrosDTO.getId())
            .map(existingParametros -> {
                parametrosMapper.partialUpdate(existingParametros, parametrosDTO);

                return existingParametros;
            })
            .flatMap(parametrosRepository::save)
            .map(parametrosMapper::toDto);
    }

    /**
     * Get all the parametros.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Flux<ParametrosDTO> findAll() {
        log.debug("Request to get all Parametros");
        return parametrosRepository.findAll().map(parametrosMapper::toDto);
    }

    /**
     * Returns the number of parametros available.
     * @return the number of entities in the database.
     *
     */
    public Mono<Long> countAll() {
        return parametrosRepository.count();
    }

    /**
     * Get one parametros by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Mono<ParametrosDTO> findOne(Long id) {
        log.debug("Request to get Parametros : {}", id);
        return parametrosRepository.findById(id).map(parametrosMapper::toDto);
    }

    /**
     * Delete the parametros by id.
     *
     * @param id the id of the entity.
     * @return a Mono to signal the deletion
     */
    public Mono<Void> delete(Long id) {
        log.debug("Request to delete Parametros : {}", id);
        return parametrosRepository.deleteById(id);
    }
}
