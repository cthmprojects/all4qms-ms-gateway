package com.tellescom.all4qms.service;

import com.tellescom.all4qms.domain.Funcao;
import com.tellescom.all4qms.repository.FuncaoRepository;
import com.tellescom.all4qms.service.dto.FuncaoDTO;
import com.tellescom.all4qms.service.mapper.FuncaoMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service Implementation for managing {@link Funcao}.
 */
@Service
@Transactional
public class FuncaoService {

    private final Logger log = LoggerFactory.getLogger(FuncaoService.class);

    private final FuncaoRepository funcaoRepository;

    private final FuncaoMapper funcaoMapper;

    public FuncaoService(FuncaoRepository funcaoRepository, FuncaoMapper funcaoMapper) {
        this.funcaoRepository = funcaoRepository;
        this.funcaoMapper = funcaoMapper;
    }

    /**
     * Save a funcao.
     *
     * @param funcaoDTO the entity to save.
     * @return the persisted entity.
     */
    public Mono<FuncaoDTO> save(FuncaoDTO funcaoDTO) {
        log.debug("Request to save Funcao : {}", funcaoDTO);
        return funcaoRepository.save(funcaoMapper.toEntity(funcaoDTO)).map(funcaoMapper::toDto);
    }

    /**
     * Update a funcao.
     *
     * @param funcaoDTO the entity to save.
     * @return the persisted entity.
     */
    public Mono<FuncaoDTO> update(FuncaoDTO funcaoDTO) {
        log.debug("Request to update Funcao : {}", funcaoDTO);
        return funcaoRepository.save(funcaoMapper.toEntity(funcaoDTO)).map(funcaoMapper::toDto);
    }

    /**
     * Partially update a funcao.
     *
     * @param funcaoDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Mono<FuncaoDTO> partialUpdate(FuncaoDTO funcaoDTO) {
        log.debug("Request to partially update Funcao : {}", funcaoDTO);

        return funcaoRepository
            .findById(funcaoDTO.getId())
            .map(existingFuncao -> {
                funcaoMapper.partialUpdate(existingFuncao, funcaoDTO);

                return existingFuncao;
            })
            .flatMap(funcaoRepository::save)
            .map(funcaoMapper::toDto);
    }

    /**
     * Get all the funcaos.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Flux<FuncaoDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Funcaos");
        return funcaoRepository.findAllBy(pageable).map(funcaoMapper::toDto);
    }

    /**
     * Get all the funcaos with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Flux<FuncaoDTO> findAllWithEagerRelationships(Pageable pageable) {
        return funcaoRepository.findAllWithEagerRelationships(pageable).map(funcaoMapper::toDto);
    }

    /**
     * Returns the number of funcaos available.
     * @return the number of entities in the database.
     *
     */
    public Mono<Long> countAll() {
        return funcaoRepository.count();
    }

    /**
     * Get one funcao by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Mono<FuncaoDTO> findOne(Long id) {
        log.debug("Request to get Funcao : {}", id);
        return funcaoRepository.findOneWithEagerRelationships(id).map(funcaoMapper::toDto);
    }

    /**
     * Delete the funcao by id.
     *
     * @param id the id of the entity.
     * @return a Mono to signal the deletion
     */
    public Mono<Void> delete(Long id) {
        log.debug("Request to delete Funcao : {}", id);
        return funcaoRepository.deleteById(id);
    }
}
