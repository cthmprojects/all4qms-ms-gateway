package com.tellescom.all4qms.web.rest;

import com.tellescom.all4qms.domain.request.UsuarioRequest;
import com.tellescom.all4qms.domain.request.UsuarioUpdateRequest;
import com.tellescom.all4qms.domain.response.GestorResponse;
import com.tellescom.all4qms.domain.response.UsuarioResponse;
import com.tellescom.all4qms.repository.UsuarioRepository;
import com.tellescom.all4qms.security.AuthoritiesConstants;
import com.tellescom.all4qms.service.UsuarioService;
import com.tellescom.all4qms.service.dto.UserDTO;
import com.tellescom.all4qms.service.dto.UsuarioDTO;
import com.tellescom.all4qms.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springdoc.api.annotations.ParameterObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.reactive.ResponseUtil;

/**
 * REST controller for managing {@link com.tellescom.all4qms.domain.Usuario}.
 */
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioResource {

    private final Logger log = LoggerFactory.getLogger(UsuarioResource.class);

    private static final String ENTITY_NAME = "usuario";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UsuarioService usuarioService;

    private final UsuarioRepository usuarioRepository;

    public UsuarioResource(UsuarioService usuarioService, UsuarioRepository usuarioRepository) {
        this.usuarioService = usuarioService;
        this.usuarioRepository = usuarioRepository;
    }

    /**
     * {@code POST  } : Create a new usuario.
     *
     * @param usuarioDTO the usuarioDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new usuarioDTO, or with status {@code 400 (Bad Request)} if the usuario has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public Mono<ResponseEntity<UsuarioDTO>> createUsuario(@Valid @RequestBody UsuarioDTO usuarioDTO) throws URISyntaxException {
        log.debug("REST request to save Usuario : {}", usuarioDTO);
        if (usuarioDTO.getId() != null) {
            throw new BadRequestAlertException("A new usuario cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return usuarioService
            .save(usuarioDTO)
            .map(result -> {
                try {
                    return ResponseEntity
                        .created(new URI("/api/usuarios/" + result.getId()))
                        .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
                        .body(result);
                } catch (URISyntaxException e) {
                    throw new RuntimeException(e);
                }
            });
    }

    /**
     * {@code PUT  /:id} : Updates an existing usuario.
     *
     * @param id         the id of the usuarioDTO to save.
     * @param usuarioDTO the usuarioDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated usuarioDTO,
     * or with status {@code 400 (Bad Request)} if the usuarioDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the usuarioDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public Mono<ResponseEntity<UsuarioDTO>> updateUsuario(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody UsuarioDTO usuarioDTO
    ) throws URISyntaxException {
        log.debug("REST request to update Usuario : {}, {}", id, usuarioDTO);
        if (usuarioDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, usuarioDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return usuarioService
            .updatePut(usuarioDTO)
            .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
            .map(result ->
                ResponseEntity
                    .ok()
                    .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
                    .body(result)
            );
    }

    /**
     * {@code PATCH  /:id} : Partial updates given fields of an existing usuario, field will ignore if it is null
     *
     * @param id      the id of the usuarioDTO to save.
     * @param request the usuarioDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated usuarioDTO,
     * or with status {@code 400 (Bad Request)} if the usuarioDTO is not valid,
     * or with status {@code 404 (Not Found)} if the usuarioDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the usuarioDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public Mono<ResponseEntity<UsuarioDTO>> partialUpdateUsuario(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody UsuarioUpdateRequest request
    ) throws URISyntaxException {
        log.debug("REST request to partial update Usuario partially : {}, {}", id, request);
        if (request.getUsuario().getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, request.getUsuario().getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return usuarioRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }
                return usuarioService
                    .update(request)
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
     * {@code GET  } : get all the usuarios.
     *
     * @param pageable  the pagination information.
     * @param request   a {@link ServerHttpRequest} request.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of usuarios in body.
     */
    @GetMapping("")
    public Mono<ResponseEntity<List<UsuarioDTO>>> getAllUsuarios(
        @ParameterObject Pageable pageable,
        ServerHttpRequest request,
        @RequestParam(required = false, defaultValue = "false") boolean eagerload
    ) {
        log.debug("REST request to get a page of Usuarios");
        return usuarioService
            .countAll()
            .zipWith(usuarioService.findAll(pageable).collectList())
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
     * {@code GET  /:id} : get the "id" usuario.
     *
     * @param id the id of the usuarioDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the usuarioDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public Mono<ResponseEntity<UsuarioDTO>> getUsuario(@PathVariable Long id) {
        log.debug("REST request to get Usuario : {}", id);
        Mono<UsuarioDTO> usuarioDTO = usuarioService.findOne(id);
        return ResponseUtil.wrapOrNotFound(usuarioDTO);
    }

    /**
     * {@code DELETE  /:id} : delete the "id" usuario.
     *
     * @param id the id of the usuarioDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<Void>> deleteUsuario(@PathVariable Long id) {
        log.debug("REST request to delete Usuario : {}", id);
        return usuarioService
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

    /**
     * {@code POST  /create} : Create a new usuario.
     *
     * @param request the usuarioRequest to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new usuarioDTO, or with status {@code 400 (Bad Request)} if the usuario has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/create")
    public Mono<ResponseEntity<UsuarioDTO>> criaUsuario(@RequestBody UsuarioRequest request) {
        log.debug("REST request to create Usuario : {}", request);
        if (request.getLogin() == null) {
            throw new BadRequestAlertException("Login requerido", ENTITY_NAME, "loginnotfound");
        }
        if (request.getEmail() == null) {
            throw new BadRequestAlertException("Email requerido", ENTITY_NAME, "emailnotfound");
        }
        if (request.getPerfil() == null) {
            throw new BadRequestAlertException("Perfil requerido", ENTITY_NAME, "perfilnotfound");
        } else if (request.getPerfil().isEmpty()) {
            throw new BadRequestAlertException("Perfil não pode ser vazio", ENTITY_NAME, "perfilinvalid");
        }
        return usuarioService
            .saveRequest(request)
            .map(result -> {
                try {
                    return ResponseEntity
                        .created(new URI("/api/usuarios/" + result.getId()))
                        .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
                        .body(result);
                } catch (URISyntaxException e) {
                    throw new RuntimeException(e);
                }
            });
    }

    @GetMapping("/gestores")
    public Mono<List<GestorResponse>> buscarTodosGestores() {
        return usuarioService.findAllManagers();
    }

    @GetMapping("/byuserid/{id}")
    public Mono<ResponseEntity<UsuarioDTO>> getByUserJhId(@PathVariable("id") Long id) {
        return usuarioService.findAllByUserJhId(id).map(ResponseEntity::ok);
    }

    @GetMapping("/byprocesso/{id}")
    public Flux<UsuarioDTO> getByProcessoId(@PathVariable("id") Long id) {
        return usuarioService.processarUsuariosPorIdProcesso(id);
    }

    @GetMapping("/users-by-role")
    public Mono<ResponseEntity<Flux<UserDTO>>> getAllUsersByAuthority(@RequestParam(required = true) String role) {
        log.debug("REST request to get all User for an admin");
        if (role == null || role.isBlank()) {
            throw new BadRequestAlertException("O parametro role é obrigatório", "user", "emptyparam");
        }

        return usuarioService.getByRole(role);
    }

    @GetMapping("/minimo")
    public Mono<List<UsuarioResponse>> buscarTodosUsuariosMinimo() {
        return usuarioService.findAllUsuariosMinimos();
    }
}
