package com.tellescom.all4qms.service;

import com.tellescom.all4qms.domain.Setor;
import com.tellescom.all4qms.repository.SetorRepository;
import com.tellescom.all4qms.service.dto.SetorDTO;
import com.tellescom.all4qms.service.mapper.SetorMapper;
import java.time.Instant;
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
 * Service Implementation for managing {@link Setor}.
 */
@Service
@Transactional
public class SetorService {

    private final Logger log = LoggerFactory.getLogger(SetorService.class);

    private final SetorRepository setorRepository;

    private final SetorMapper setorMapper;

    public SetorService(SetorRepository setorRepository, SetorMapper setorMapper) {
        this.setorRepository = setorRepository;
        this.setorMapper = setorMapper;
    }

    /**
     * Save a setor.
     *
     * @param setorDTO the entity to save.
     * @return the persisted entity.
     */
    public Mono<SetorDTO> save(SetorDTO setorDTO) {
        log.debug("Request to save Setor : {}", setorDTO);
        setorDTO.setCriadoEm(Instant.now());
        return setorRepository.save(setorMapper.toEntity(setorDTO)).map(setorMapper::toDto);
    }

    /**
     * Update a setor.
     *
     * @param setorDTO the entity to save.
     * @return the persisted entity.
     */
    public Mono<SetorDTO> update(SetorDTO setorDTO) {
        log.debug("Request to update Setor : {}", setorDTO);
        setorDTO.setAtualizadoEm(Instant.now());
        return setorRepository.save(setorMapper.toEntity(setorDTO)).map(setorMapper::toDto);
    }

    /**
     * Partially update a setor.
     *
     * @param setorDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Mono<SetorDTO> partialUpdate(SetorDTO setorDTO) {
        log.debug("Request to partially update Setor : {}", setorDTO);
        setorDTO.setAtualizadoEm(Instant.now());
        return setorRepository
            .findById(setorDTO.getId())
            .map(existingSetor -> {
                setorMapper.partialUpdate(existingSetor, setorDTO);

                return existingSetor;
            })
            .flatMap(setorRepository::save)
            .map(setorMapper::toDto);
    }

    /**
     * Get all the setors.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Flux<SetorDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Setors");
        return setorRepository.findAllBy(pageable).map(setorMapper::toDto);
    }

    /**
     * Get all the setors with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Flux<SetorDTO> findAllWithEagerRelationships(Pageable pageable) {
        return setorRepository.findAllWithEagerRelationships(pageable).map(setorMapper::toDto);
    }

    /**
     *  Get all the setors where Usuario is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Flux<SetorDTO> findAllWhereUsuarioIsNull() {
        log.debug("Request to get all setors where Usuario is null");
        return setorRepository.findAllWhereUsuarioIsNull().map(setorMapper::toDto);
    }

    /**
     * Returns the number of setors available.
     * @return the number of entities in the database.
     *
     */
    public Mono<Long> countAll() {
        return setorRepository.count();
    }

    /**
     * Get one setor by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Mono<SetorDTO> findOne(Long id) {
        log.debug("Request to get Setor : {}", id);
        return setorRepository.findOneWithEagerRelationships(id).map(setorMapper::toDto);
    }

    /**
     * Delete the setor by id.
     *
     * @param id the id of the entity.
     * @return a Mono to signal the deletion
     */
    public Mono<Void> delete(Long id) {
        log.debug("Request to delete Setor : {}", id);
        return setorRepository.deleteById(id);
    }
}
