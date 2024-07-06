package com.tellescom.all4qms.service;

import com.tellescom.all4qms.domain.Parametro;
import com.tellescom.all4qms.repository.ParametroRepository;
import com.tellescom.all4qms.service.dto.ParametroDTO;
import com.tellescom.all4qms.service.mapper.ParametroMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service Implementation for managing {@link Parametro}.
 */
@Service
@Transactional
public class ParametroService {

    private final Logger log = LoggerFactory.getLogger(ParametroService.class);

    private final ParametroRepository parametroRepository;

    private final ParametroMapper parametroMapper;

    public ParametroService(ParametroRepository parametroRepository, ParametroMapper parametroMapper) {
        this.parametroRepository = parametroRepository;
        this.parametroMapper = parametroMapper;
    }

    /**
     * Save a parametro.
     *
     * @param parametroDTO the entity to save.
     * @return the persisted entity.
     */
    public Mono<ParametroDTO> save(ParametroDTO parametroDTO) {
        log.debug("Request to save Parametro : {}", parametroDTO);
        return parametroRepository.save(parametroMapper.toEntity(parametroDTO)).map(parametroMapper::toDto);
    }

    /**
     * Update a parametro.
     *
     * @param parametroDTO the entity to save.
     * @return the persisted entity.
     */
    public Mono<ParametroDTO> update(ParametroDTO parametroDTO) {
        log.debug("Request to update Parametro : {}", parametroDTO);
        return parametroRepository.save(parametroMapper.toEntity(parametroDTO)).map(parametroMapper::toDto);
    }

    /**
     * Partially update a parametro.
     *
     * @param parametroDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Mono<ParametroDTO> partialUpdate(ParametroDTO parametroDTO) {
        log.debug("Request to partially update Parametro : {}", parametroDTO);

        return parametroRepository
            .findById(parametroDTO.getId())
            .map(existingParametro -> {
                parametroMapper.partialUpdate(existingParametro, parametroDTO);

                return existingParametro;
            })
            .flatMap(parametroRepository::save)
            .map(parametroMapper::toDto);
    }

    /**
     * Get all the parametros.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Flux<ParametroDTO> findAll() {
        log.debug("Request to get all Parametros");
        return parametroRepository.findAll().map(parametroMapper::toDto);
    }

    /**
     * Returns the number of parametros available.
     * @return the number of entities in the database.
     *
     */
    public Mono<Long> countAll() {
        return parametroRepository.count();
    }

    /**
     * Get one parametro by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Mono<ParametroDTO> findOne(Long id) {
        log.debug("Request to get Parametro : {}", id);
        return parametroRepository.findById(id).map(parametroMapper::toDto);
    }

    /**
     * Delete the parametro by id.
     *
     * @param id the id of the entity.
     * @return a Mono to signal the deletion
     */
    public Mono<Void> delete(Long id) {
        log.debug("Request to delete Parametro : {}", id);
        return parametroRepository.deleteById(id);
    }
}
