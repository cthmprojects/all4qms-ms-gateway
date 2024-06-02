package com.tellescom.all4qms.web.rest;

import com.tellescom.all4qms.repository.PendenciaRepository;
import com.tellescom.all4qms.service.PendenciaService;
import com.tellescom.all4qms.service.dto.PendenciaDTO;
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
 * REST controller for managing {@link com.tellescom.all4qms.domain.Pendencia}.
 */
@RestController
@RequestMapping("/api")
public class PendenciaResource {

    private final Logger log = LoggerFactory.getLogger(PendenciaResource.class);

    private static final String ENTITY_NAME = "pendencia";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PendenciaService pendenciaService;

    private final PendenciaRepository pendenciaRepository;

    public PendenciaResource(PendenciaService pendenciaService, PendenciaRepository pendenciaRepository) {
        this.pendenciaService = pendenciaService;
        this.pendenciaRepository = pendenciaRepository;
    }

    /**
     * {@code POST  /pendencias} : Create a new pendencia.
     *
     * @param pendenciaDTO the pendenciaDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new pendenciaDTO, or with status {@code 400 (Bad Request)} if the pendencia has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/pendencias")
    public Mono<ResponseEntity<PendenciaDTO>> createPendencia(@RequestBody PendenciaDTO pendenciaDTO) throws URISyntaxException {
        log.debug("REST request to save Pendencia : {}", pendenciaDTO);
        if (pendenciaDTO.getId() != null) {
            throw new BadRequestAlertException("A new pendencia cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return pendenciaService
            .save(pendenciaDTO)
            .map(result -> {
                try {
                    return ResponseEntity
                        .created(new URI("/api/pendencias/" + result.getId()))
                        .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
                        .body(result);
                } catch (URISyntaxException e) {
                    throw new RuntimeException(e);
                }
            });
    }

    /**
     * {@code PUT  /pendencias/:id} : Updates an existing pendencia.
     *
     * @param id the id of the pendenciaDTO to save.
     * @param pendenciaDTO the pendenciaDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated pendenciaDTO,
     * or with status {@code 400 (Bad Request)} if the pendenciaDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the pendenciaDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/pendencias/{id}")
    public Mono<ResponseEntity<PendenciaDTO>> updatePendencia(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody PendenciaDTO pendenciaDTO
    ) throws URISyntaxException {
        log.debug("REST request to update Pendencia : {}, {}", id, pendenciaDTO);
        if (pendenciaDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, pendenciaDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return pendenciaRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                return pendenciaService
                    .update(pendenciaDTO)
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
     * {@code PATCH  /pendencias/:id} : Partial updates given fields of an existing pendencia, field will ignore if it is null
     *
     * @param id the id of the pendenciaDTO to save.
     * @param pendenciaDTO the pendenciaDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated pendenciaDTO,
     * or with status {@code 400 (Bad Request)} if the pendenciaDTO is not valid,
     * or with status {@code 404 (Not Found)} if the pendenciaDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the pendenciaDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/pendencias/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public Mono<ResponseEntity<PendenciaDTO>> partialUpdatePendencia(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody PendenciaDTO pendenciaDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Pendencia partially : {}, {}", id, pendenciaDTO);
        if (pendenciaDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, pendenciaDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return pendenciaRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                Mono<PendenciaDTO> result = pendenciaService.partialUpdate(pendenciaDTO);

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
     * {@code GET  /pendencias} : get all the pendencias.
     *
     * @param pageable the pagination information.
     * @param request a {@link ServerHttpRequest} request.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of pendencias in body.
     */
    @GetMapping(value = "/pendencias", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<ResponseEntity<List<PendenciaDTO>>> getAllPendencias(
        Pageable pageable,
        ServerHttpRequest request,
        @RequestParam(required = false, defaultValue = "false") boolean eagerload
    ) {
        log.debug("REST request to get a page of Pendencias");
        return pendenciaService
            .countAll()
            .zipWith(pendenciaService.findAll(pageable).collectList())
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
     * {@code GET  /pendencias/:id} : get the "id" pendencia.
     *
     * @param id the id of the pendenciaDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the pendenciaDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/pendencias/{id}")
    public Mono<ResponseEntity<PendenciaDTO>> getPendencia(@PathVariable Long id) {
        log.debug("REST request to get Pendencia : {}", id);
        Mono<PendenciaDTO> pendenciaDTO = pendenciaService.findOne(id);
        return ResponseUtil.wrapOrNotFound(pendenciaDTO);
    }

    @GetMapping(value = "/pendencias/usuario/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<ResponseEntity<List<PendenciaDTO>>> getAllPendenciasResponsavel(
        @PathVariable("id") Long id,
        Pageable pageable,
        ServerHttpRequest request,
        boolean eagerload
    ) {
        log.debug("REST request to get a page of Pendencias do Responsavel");
        return pendenciaService
            .countAll()
            .zipWith(pendenciaService.findAllPendenciaResponsavel(id, pageable).collectList())
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
     * {@code DELETE  /pendencias/:id} : delete the "id" pendencia.
     *
     * @param id the id of the pendenciaDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/pendencias/{id}")
    public Mono<ResponseEntity<Void>> deletePendencia(@PathVariable Long id) {
        log.debug("REST request to delete Pendencia : {}", id);
        return pendenciaService
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
