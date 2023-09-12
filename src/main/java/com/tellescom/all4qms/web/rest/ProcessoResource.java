package com.tellescom.all4qms.web.rest;

import com.tellescom.all4qms.repository.ProcessoRepository;
import com.tellescom.all4qms.service.ProcessoService;
import com.tellescom.all4qms.service.dto.ProcessoDTO;
import com.tellescom.all4qms.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
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
 * REST controller for managing {@link com.tellescom.all4qms.domain.Processo}.
 */
@RestController
@RequestMapping("/api")
public class ProcessoResource {

    private final Logger log = LoggerFactory.getLogger(ProcessoResource.class);

    private static final String ENTITY_NAME = "processo";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProcessoService processoService;

    private final ProcessoRepository processoRepository;

    public ProcessoResource(ProcessoService processoService, ProcessoRepository processoRepository) {
        this.processoService = processoService;
        this.processoRepository = processoRepository;
    }

    /**
     * {@code POST  /processos} : Create a new processo.
     *
     * @param processoDTO the processoDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new processoDTO, or with status {@code 400 (Bad Request)} if the processo has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/processos")
    public Mono<ResponseEntity<ProcessoDTO>> createProcesso(@Valid @RequestBody ProcessoDTO processoDTO) throws URISyntaxException {
        log.debug("REST request to save Processo : {}", processoDTO);
        if (processoDTO.getId() != null) {
            throw new BadRequestAlertException("A new processo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return processoService
            .save(processoDTO)
            .map(result -> {
                try {
                    return ResponseEntity
                        .created(new URI("/api/processos/" + result.getId()))
                        .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
                        .body(result);
                } catch (URISyntaxException e) {
                    throw new RuntimeException(e);
                }
            });
    }

    /**
     * {@code PUT  /processos/:id} : Updates an existing processo.
     *
     * @param id the id of the processoDTO to save.
     * @param processoDTO the processoDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated processoDTO,
     * or with status {@code 400 (Bad Request)} if the processoDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the processoDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/processos/{id}")
    public Mono<ResponseEntity<ProcessoDTO>> updateProcesso(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ProcessoDTO processoDTO
    ) throws URISyntaxException {
        log.debug("REST request to update Processo : {}, {}", id, processoDTO);
        if (processoDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, processoDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return processoRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                return processoService
                    .update(processoDTO)
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
     * {@code PATCH  /processos/:id} : Partial updates given fields of an existing processo, field will ignore if it is null
     *
     * @param id the id of the processoDTO to save.
     * @param processoDTO the processoDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated processoDTO,
     * or with status {@code 400 (Bad Request)} if the processoDTO is not valid,
     * or with status {@code 404 (Not Found)} if the processoDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the processoDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/processos/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public Mono<ResponseEntity<ProcessoDTO>> partialUpdateProcesso(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ProcessoDTO processoDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Processo partially : {}, {}", id, processoDTO);
        if (processoDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, processoDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return processoRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                Mono<ProcessoDTO> result = processoService.partialUpdate(processoDTO);

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
     * {@code GET  /processos} : get all the processos.
     *
     * @param pageable the pagination information.
     * @param request a {@link ServerHttpRequest} request.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of processos in body.
     */
    @GetMapping(value = "/processos", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<ResponseEntity<List<ProcessoDTO>>> getAllProcessos(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        ServerHttpRequest request,
        @RequestParam(required = false, defaultValue = "false") boolean eagerload
    ) {
        log.debug("REST request to get a page of Processos");
        return processoService
            .countAll()
            .zipWith(processoService.findAll(pageable).collectList())
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
     * {@code GET  /processos/:id} : get the "id" processo.
     *
     * @param id the id of the processoDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the processoDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/processos/{id}")
    public Mono<ResponseEntity<ProcessoDTO>> getProcesso(@PathVariable Long id) {
        log.debug("REST request to get Processo : {}", id);
        Mono<ProcessoDTO> processoDTO = processoService.findOne(id);
        return ResponseUtil.wrapOrNotFound(processoDTO);
    }

    /**
     * {@code DELETE  /processos/:id} : delete the "id" processo.
     *
     * @param id the id of the processoDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/processos/{id}")
    public Mono<ResponseEntity<Void>> deleteProcesso(@PathVariable Long id) {
        log.debug("REST request to delete Processo : {}", id);
        return processoService
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
