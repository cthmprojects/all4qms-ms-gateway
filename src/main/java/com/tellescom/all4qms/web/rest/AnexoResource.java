package com.tellescom.all4qms.web.rest;

import com.tellescom.all4qms.domain.criteria.AnexoCriteria;
import com.tellescom.all4qms.repository.AnexoRepository;
import com.tellescom.all4qms.service.AnexoService;
import com.tellescom.all4qms.service.dto.AnexoDTO;
import com.tellescom.all4qms.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.reactive.ResponseUtil;

/**
 * REST controller for managing {@link com.tellescom.all4qms.domain.Anexo}.
 */
@RestController
@RequestMapping("/api")
public class AnexoResource {

    private final Logger log = LoggerFactory.getLogger(AnexoResource.class);

    private static final String ENTITY_NAME = "anexo";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AnexoService anexoService;

    private final AnexoRepository anexoRepository;

    public AnexoResource(AnexoService anexoService, AnexoRepository anexoRepository) {
        this.anexoService = anexoService;
        this.anexoRepository = anexoRepository;
    }

    /**
     * {@code POST  /anexos} : Create a new anexo.
     *
     * @param anexoDTO the anexoDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new anexoDTO, or with status {@code 400 (Bad Request)} if the anexo has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/anexos")
    public Mono<ResponseEntity<AnexoDTO>> createAnexo(@RequestBody AnexoDTO anexoDTO) throws URISyntaxException {
        log.debug("REST request to save Anexo : {}", anexoDTO);
        if (anexoDTO.getId() != null) {
            throw new BadRequestAlertException("A new anexo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return anexoService
            .save(anexoDTO)
            .map(result -> {
                try {
                    return ResponseEntity
                        .created(new URI("/api/anexos/" + result.getId()))
                        .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
                        .body(result);
                } catch (URISyntaxException e) {
                    throw new RuntimeException(e);
                }
            });
    }

    /**
     * {@code PUT  /anexos/:id} : Updates an existing anexo.
     *
     * @param id the id of the anexoDTO to save.
     * @param anexoDTO the anexoDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated anexoDTO,
     * or with status {@code 400 (Bad Request)} if the anexoDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the anexoDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/anexos/{id}")
    public Mono<ResponseEntity<AnexoDTO>> updateAnexo(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AnexoDTO anexoDTO
    ) throws URISyntaxException {
        log.debug("REST request to update Anexo : {}, {}", id, anexoDTO);
        if (anexoDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, anexoDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return anexoRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                return anexoService
                    .update(anexoDTO)
                    .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
                    .map(result ->
                        ResponseEntity
                            .ok()
                            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
                            .body(result)
                    );
            });
    }

    /**
     * {@code PATCH  /anexos/:id} : Partial updates given fields of an existing anexo, field will ignore if it is null
     *
     * @param id the id of the anexoDTO to save.
     * @param anexoDTO the anexoDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated anexoDTO,
     * or with status {@code 400 (Bad Request)} if the anexoDTO is not valid,
     * or with status {@code 404 (Not Found)} if the anexoDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the anexoDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/anexos/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public Mono<ResponseEntity<AnexoDTO>> partialUpdateAnexo(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AnexoDTO anexoDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Anexo partially : {}, {}", id, anexoDTO);
        if (anexoDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, anexoDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return anexoRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                Mono<AnexoDTO> result = anexoService.partialUpdate(anexoDTO);

                return result
                    .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
                    .map(res ->
                        ResponseEntity
                            .ok()
                            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, res.getId().toString()))
                            .body(res)
                    );
            });
    }

    /**
     * {@code GET  /anexos} : get all the anexos.
     *
     * @param pageable the pagination information.
     * @param request a {@link ServerHttpRequest} request.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of anexos in body.
     */
    @GetMapping(value = "/anexos", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<ResponseEntity<List<AnexoDTO>>> getAllAnexos(
        AnexoCriteria criteria,
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        ServerHttpRequest request
    ) {
        log.debug("REST request to get Anexos by criteria: {}", criteria);
        return anexoService
            .countByCriteria(criteria)
            .zipWith(anexoService.findByCriteria(criteria, pageable).collectList())
            .map(countWithEntities ->
                ResponseEntity
                    .ok()
                    .headers(
                        PaginationUtil.generatePaginationHttpHeaders(
                            UriComponentsBuilder.fromHttpRequest(request),
                            new PageImpl<>(countWithEntities.getT2(), pageable, countWithEntities.getT1())
                        )
                    )
                    .body(countWithEntities.getT2())
            );
    }

    /**
     * {@code GET  /anexos/count} : count all the anexos.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @GetMapping("/anexos/count")
    public Mono<ResponseEntity<Long>> countAnexos(AnexoCriteria criteria) {
        log.debug("REST request to count Anexos by criteria: {}", criteria);
        return anexoService.countByCriteria(criteria).map(count -> ResponseEntity.status(HttpStatus.OK).body(count));
    }

    /**
     * {@code GET  /anexos/:id} : get the "id" anexo.
     *
     * @param id the id of the anexoDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the anexoDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/anexos/{id}")
    public Mono<ResponseEntity<AnexoDTO>> getAnexo(@PathVariable Long id) {
        log.debug("REST request to get Anexo : {}", id);
        Mono<AnexoDTO> anexoDTO = anexoService.findOne(id);
        return ResponseUtil.wrapOrNotFound(anexoDTO);
    }

    /**
     * {@code DELETE  /anexos/:id} : delete the "id" anexo.
     *
     * @param id the id of the anexoDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/anexos/{id}")
    public Mono<ResponseEntity<Void>> deleteAnexo(@PathVariable Long id) {
        log.debug("REST request to delete Anexo : {}", id);
        return anexoService
            .delete(id)
            .then(
                Mono.just(
                    ResponseEntity
                        .noContent()
                        .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
                        .build()
                )
            );
    }
}
