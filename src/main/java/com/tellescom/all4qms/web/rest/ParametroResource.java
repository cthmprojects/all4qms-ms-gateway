package com.tellescom.all4qms.web.rest;

import com.tellescom.all4qms.repository.ParametroRepository;
import com.tellescom.all4qms.service.ParametroService;
import com.tellescom.all4qms.service.dto.ParametroDTO;
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
 * REST controller for managing {@link com.tellescom.all4qms.domain.Parametro}.
 */
@RestController
@RequestMapping("/api")
public class ParametroResource {

    private final Logger log = LoggerFactory.getLogger(ParametroResource.class);

    private static final String ENTITY_NAME = "parametro";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ParametroService parametroService;

    private final ParametroRepository parametroRepository;

    public ParametroResource(ParametroService parametroService, ParametroRepository parametroRepository) {
        this.parametroService = parametroService;
        this.parametroRepository = parametroRepository;
    }

    /**
     * {@code POST  /parametros} : Create a new parametro.
     *
     * @param parametroDTO the parametroDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new parametroDTO, or with status {@code 400 (Bad Request)} if the parametro has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/parametros")
    public Mono<ResponseEntity<ParametroDTO>> createParametro(@Valid @RequestBody ParametroDTO parametroDTO) throws URISyntaxException {
        log.debug("REST request to save Parametro : {}", parametroDTO);
        if (parametroDTO.getId() != null) {
            throw new BadRequestAlertException("A new parametro cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return parametroService
            .save(parametroDTO)
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
     * {@code PUT  /parametros/:id} : Updates an existing parametro.
     *
     * @param id the id of the parametroDTO to save.
     * @param parametroDTO the parametroDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated parametroDTO,
     * or with status {@code 400 (Bad Request)} if the parametroDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the parametroDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/parametros/{id}")
    public Mono<ResponseEntity<ParametroDTO>> updateParametro(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ParametroDTO parametroDTO
    ) throws URISyntaxException {
        log.debug("REST request to update Parametro : {}, {}", id, parametroDTO);
        if (parametroDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, parametroDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return parametroRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                return parametroService
                    .update(parametroDTO)
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
     * {@code PATCH  /parametros/:id} : Partial updates given fields of an existing parametro, field will ignore if it is null
     *
     * @param id the id of the parametroDTO to save.
     * @param parametroDTO the parametroDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated parametroDTO,
     * or with status {@code 400 (Bad Request)} if the parametroDTO is not valid,
     * or with status {@code 404 (Not Found)} if the parametroDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the parametroDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/parametros/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public Mono<ResponseEntity<ParametroDTO>> partialUpdateParametro(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ParametroDTO parametroDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Parametro partially : {}, {}", id, parametroDTO);
        if (parametroDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, parametroDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return parametroRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                Mono<ParametroDTO> result = parametroService.partialUpdate(parametroDTO);

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
    public Mono<List<ParametroDTO>> getAllParametros() {
        log.debug("REST request to get all Parametros");
        return parametroService.findAll().collectList();
    }

    /**
     * {@code GET  /parametros} : get all the parametros as a stream.
     * @return the {@link Flux} of parametros.
     */
    @GetMapping(value = "/parametros", produces = MediaType.APPLICATION_NDJSON_VALUE)
    public Flux<ParametroDTO> getAllParametrosAsStream() {
        log.debug("REST request to get all Parametros as a stream");
        return parametroService.findAll();
    }

    /**
     * {@code GET  /parametros/:id} : get the "id" parametro.
     *
     * @param id the id of the parametroDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the parametroDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/parametros/{id}")
    public Mono<ResponseEntity<ParametroDTO>> getParametro(@PathVariable Long id) {
        log.debug("REST request to get Parametro : {}", id);
        Mono<ParametroDTO> parametroDTO = parametroService.findOne(id);
        return ResponseUtil.wrapOrNotFound(parametroDTO);
    }

    /**
     * {@code DELETE  /parametros/:id} : delete the "id" parametro.
     *
     * @param id the id of the parametroDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/parametros/{id}")
    public Mono<ResponseEntity<Void>> deleteParametro(@PathVariable Long id) {
        log.debug("REST request to delete Parametro : {}", id);
        return parametroService
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
