package com.tellescom.all4qms.web.rest;

import com.tellescom.all4qms.repository.FuncaoRepository;
import com.tellescom.all4qms.service.FuncaoService;
import com.tellescom.all4qms.service.dto.FuncaoDTO;
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
 * REST controller for managing {@link com.tellescom.all4qms.domain.Funcao}.
 */
@RestController
@RequestMapping("/api")
public class FuncaoResource {

    private final Logger log = LoggerFactory.getLogger(FuncaoResource.class);

    private static final String ENTITY_NAME = "funcao";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FuncaoService funcaoService;

    private final FuncaoRepository funcaoRepository;

    public FuncaoResource(FuncaoService funcaoService, FuncaoRepository funcaoRepository) {
        this.funcaoService = funcaoService;
        this.funcaoRepository = funcaoRepository;
    }

    /**
     * {@code POST  /funcaos} : Create a new funcao.
     *
     * @param funcaoDTO the funcaoDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new funcaoDTO, or with status {@code 400 (Bad Request)} if the funcao has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/funcaos")
    public Mono<ResponseEntity<FuncaoDTO>> createFuncao(@Valid @RequestBody FuncaoDTO funcaoDTO) throws URISyntaxException {
        log.debug("REST request to save Funcao : {}", funcaoDTO);
        if (funcaoDTO.getId() != null) {
            throw new BadRequestAlertException("A new funcao cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return funcaoService
            .save(funcaoDTO)
            .map(result -> {
                try {
                    return ResponseEntity
                        .created(new URI("/api/funcaos/" + result.getId()))
                        .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
                        .body(result);
                } catch (URISyntaxException e) {
                    throw new RuntimeException(e);
                }
            });
    }

    /**
     * {@code PUT  /funcaos/:id} : Updates an existing funcao.
     *
     * @param id the id of the funcaoDTO to save.
     * @param funcaoDTO the funcaoDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated funcaoDTO,
     * or with status {@code 400 (Bad Request)} if the funcaoDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the funcaoDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/funcaos/{id}")
    public Mono<ResponseEntity<FuncaoDTO>> updateFuncao(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody FuncaoDTO funcaoDTO
    ) throws URISyntaxException {
        log.debug("REST request to update Funcao : {}, {}", id, funcaoDTO);
        if (funcaoDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, funcaoDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return funcaoRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                return funcaoService
                    .update(funcaoDTO)
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
     * {@code PATCH  /funcaos/:id} : Partial updates given fields of an existing funcao, field will ignore if it is null
     *
     * @param id the id of the funcaoDTO to save.
     * @param funcaoDTO the funcaoDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated funcaoDTO,
     * or with status {@code 400 (Bad Request)} if the funcaoDTO is not valid,
     * or with status {@code 404 (Not Found)} if the funcaoDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the funcaoDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/funcaos/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public Mono<ResponseEntity<FuncaoDTO>> partialUpdateFuncao(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody FuncaoDTO funcaoDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Funcao partially : {}, {}", id, funcaoDTO);
        if (funcaoDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, funcaoDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return funcaoRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                Mono<FuncaoDTO> result = funcaoService.partialUpdate(funcaoDTO);

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
     * {@code GET  /funcaos} : get all the funcaos.
     *
     * @param pageable the pagination information.
     * @param request a {@link ServerHttpRequest} request.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of funcaos in body.
     */
    @GetMapping(value = "/funcaos", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<ResponseEntity<List<FuncaoDTO>>> getAllFuncaos(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        ServerHttpRequest request,
        @RequestParam(required = false) String filter,
        @RequestParam(required = false, defaultValue = "false") boolean eagerload
    ) {
        if ("usuario-is-null".equals(filter)) {
            log.debug("REST request to get all Funcaos where usuario is null");
            return funcaoService.findAllWhereUsuarioIsNull().collectList().map(ResponseEntity::ok);
        }
        log.debug("REST request to get a page of Funcaos");
        return funcaoService
            .countAll()
            .zipWith(funcaoService.findAll(pageable).collectList())
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
     * {@code GET  /funcaos/:id} : get the "id" funcao.
     *
     * @param id the id of the funcaoDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the funcaoDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/funcaos/{id}")
    public Mono<ResponseEntity<FuncaoDTO>> getFuncao(@PathVariable Long id) {
        log.debug("REST request to get Funcao : {}", id);
        Mono<FuncaoDTO> funcaoDTO = funcaoService.findOne(id);
        return ResponseUtil.wrapOrNotFound(funcaoDTO);
    }

    /**
     * {@code DELETE  /funcaos/:id} : delete the "id" funcao.
     *
     * @param id the id of the funcaoDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/funcaos/{id}")
    public Mono<ResponseEntity<Void>> deleteFuncao(@PathVariable Long id) {
        log.debug("REST request to delete Funcao : {}", id);
        return funcaoService
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
