package com.tellescom.all4qms.web.rest;

import com.tellescom.all4qms.repository.ParametrosRepository;
import com.tellescom.all4qms.service.ParametrosService;
import com.tellescom.all4qms.service.dto.ParametrosDTO;
import com.tellescom.all4qms.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.reactive.ResponseUtil;

/**
 * REST controller for managing {@link com.tellescom.all4qms.domain.Parametros}.
 */
@RestController
@RequestMapping("/api")
public class ParametrosResource {

    private final Logger log = LoggerFactory.getLogger(ParametrosResource.class);

    private static final String ENTITY_NAME = "parametros";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ParametrosService parametrosService;

    private final ParametrosRepository parametrosRepository;

    public ParametrosResource(ParametrosService parametrosService, ParametrosRepository parametrosRepository) {
        this.parametrosService = parametrosService;
        this.parametrosRepository = parametrosRepository;
    }

    /**
     * {@code POST  /parametros} : Create a new parametros.
     *
     * @param parametrosDTO the parametrosDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new parametrosDTO, or with status {@code 400 (Bad Request)} if the parametros has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/parametros")
    public Mono<ResponseEntity<ParametrosDTO>> createParametros(@Valid @RequestBody ParametrosDTO parametrosDTO) throws URISyntaxException {
        log.debug("REST request to save Parametros : {}", parametrosDTO);
        if (parametrosDTO.getId() != null) {
            throw new BadRequestAlertException("A new parametros cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return parametrosService
            .save(parametrosDTO)
            .map(result -> {
                try {
                    return ResponseEntity
                        .created(new URI("/api/parametros/" + result.getId()))
                        .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
                        .body(result);
                } catch (URISyntaxException e) {
                    throw new RuntimeException(e);
                }
            });
    }

    /**
     * {@code PUT  /parametros/:id} : Updates an existing parametros.
     *
     * @param id            the id of the parametrosDTO to save.
     * @param parametrosDTO the parametrosDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated parametrosDTO,
     * or with status {@code 400 (Bad Request)} if the parametrosDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the parametrosDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/parametros/{id}")
    public Mono<ResponseEntity<ParametrosDTO>> updateParametros(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ParametrosDTO parametrosDTO
    ) throws URISyntaxException {
        log.debug("REST request to update Parametros : {}, {}", id, parametrosDTO);
        if (parametrosDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, parametrosDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }
        if (parametrosDTO.getLocked()) {
            throw new BadRequestAlertException("Register Locker", ENTITY_NAME, "lockedTrue");
        }

        return parametrosRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                return parametrosService
                    .update(parametrosDTO)
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
     * {@code PATCH  /parametros/:id} : Partial updates given fields of an existing parametros, field will ignore if it is null
     *
     * @param id            the id of the parametrosDTO to save.
     * @param parametrosDTO the parametrosDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated parametrosDTO,
     * or with status {@code 400 (Bad Request)} if the parametrosDTO is not valid,
     * or with status {@code 404 (Not Found)} if the parametrosDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the parametrosDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/parametros/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public Mono<ResponseEntity<ParametrosDTO>> partialUpdateParametros(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ParametrosDTO parametrosDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Parametros partially : {}, {}", id, parametrosDTO);
        if (parametrosDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, parametrosDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }
        if (parametrosDTO.getLocked()) {
            throw new BadRequestAlertException("Register Locker", ENTITY_NAME, "lockedTrue");
        }

        return parametrosRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                Mono<ParametrosDTO> result = parametrosService.partialUpdate(parametrosDTO);

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
     * {@code GET  /parametros} : get all the parametros.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of parametros in body.
     */
    @GetMapping(value = "/parametros", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<List<ParametrosDTO>> getAllParametros() {
        log.debug("REST request to get all Parametros");
        return parametrosService.findAll().collectList();
    }

    /**
     * {@code GET  /parametros} : get all the parametros as a stream.
     *
     * @return the {@link Flux} of parametros.
     */
    @GetMapping(value = "/parametros", produces = MediaType.APPLICATION_NDJSON_VALUE)
    public Flux<ParametrosDTO> getAllParametrosAsStream() {
        log.debug("REST request to get all Parametros as a stream");
        return parametrosService.findAll();
    }

    /**
     * {@code GET  /parametros/:id} : get the "id" parametros.
     *
     * @param id the id of the parametrosDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the parametrosDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/parametros/{id}")
    public Mono<ResponseEntity<ParametrosDTO>> getParametros(@PathVariable Long id) {
        log.debug("REST request to get Parametros : {}", id);
        Mono<ParametrosDTO> parametrosDTO = parametrosService.findOne(id);
        return ResponseUtil.wrapOrNotFound(parametrosDTO);
    }

    /**
     * {@code DELETE  /parametros/:id} : delete the "id" parametros.
     *
     * @param id the id of the parametrosDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/parametros/{id}")
    public Mono<ResponseEntity<Void>> deleteParametros(@PathVariable Long id) {
        log.debug("REST request to delete Parametros : {}", id);
        return parametrosService
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
