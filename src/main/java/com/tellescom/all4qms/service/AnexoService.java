package com.tellescom.all4qms.service;

import com.tellescom.all4qms.domain.Anexo;
import com.tellescom.all4qms.domain.criteria.AnexoCriteria;
import com.tellescom.all4qms.repository.AnexoRepository;
import com.tellescom.all4qms.service.dto.AnexoDTO;
import com.tellescom.all4qms.service.mapper.AnexoMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service Implementation for managing {@link Anexo}.
 */
@Service
@Transactional
public class AnexoService {

    private final Logger log = LoggerFactory.getLogger(AnexoService.class);

    private final AnexoRepository anexoRepository;

    private final AnexoMapper anexoMapper;

    public AnexoService(AnexoRepository anexoRepository, AnexoMapper anexoMapper) {
        this.anexoRepository = anexoRepository;
        this.anexoMapper = anexoMapper;
    }

    /**
     * Save a anexo.
     *
     * @param anexoDTO the entity to save.
     * @return the persisted entity.
     */
    public Mono<AnexoDTO> save(AnexoDTO anexoDTO) {
        log.debug("Request to save Anexo : {}", anexoDTO);
        return anexoRepository.save(anexoMapper.toEntity(anexoDTO)).map(anexoMapper::toDto);
    }

    /**
     * Update a anexo.
     *
     * @param anexoDTO the entity to save.
     * @return the persisted entity.
     */
    public Mono<AnexoDTO> update(AnexoDTO anexoDTO) {
        log.debug("Request to update Anexo : {}", anexoDTO);
        return anexoRepository.save(anexoMapper.toEntity(anexoDTO)).map(anexoMapper::toDto);
    }

    /**
     * Partially update a anexo.
     *
     * @param anexoDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Mono<AnexoDTO> partialUpdate(AnexoDTO anexoDTO) {
        log.debug("Request to partially update Anexo : {}", anexoDTO);

        return anexoRepository
            .findById(anexoDTO.getId())
            .map(existingAnexo -> {
                anexoMapper.partialUpdate(existingAnexo, anexoDTO);

                return existingAnexo;
            })
            .flatMap(anexoRepository::save)
            .map(anexoMapper::toDto);
    }

    /**
     * Get all the anexos.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Flux<AnexoDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Anexos");
        return anexoRepository.findAllBy(pageable).map(anexoMapper::toDto);
    }

    /**
     * Find anexos by Criteria.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Flux<AnexoDTO> findByCriteria(AnexoCriteria criteria, Pageable pageable) {
        log.debug("Request to get all Anexos by Criteria");
        return anexoRepository.findByCriteria(criteria, pageable);
    }

    /**
     * Find the count of anexos by criteria.
     * @param criteria filtering criteria
     * @return the count of anexos
     */
    public Mono<Long> countByCriteria(AnexoCriteria criteria) {
        log.debug("Request to get the count of all Anexos by Criteria");
        return anexoRepository.countByCriteria(criteria);
    }

    /**
     * Returns the number of anexos available.
     * @return the number of entities in the database.
     *
     */
    public Mono<Long> countAll() {
        return anexoRepository.count();
    }

    /**
     * Get one anexo by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Mono<AnexoDTO> findOne(Long id) {
        log.debug("Request to get Anexo : {}", id);
        return anexoRepository.findById(id).map(anexoMapper::toDto);
    }

    /**
     * Delete the anexo by id.
     *
     * @param id the id of the entity.
     * @return a Mono to signal the deletion
     */
    public Mono<Void> delete(Long id) {
        log.debug("Request to delete Anexo : {}", id);
        return anexoRepository.deleteById(id);
    }
}
