package com.tellescom.all4qms.web.rest;

import com.tellescom.all4qms.repository.UsuarioRepository;
import com.tellescom.all4qms.service.UserService;
import com.tellescom.all4qms.service.UsuarioService;
import com.tellescom.all4qms.service.dto.AdminUserDTO;
import com.tellescom.all4qms.service.dto.UsuarioDTO;
import com.tellescom.all4qms.service.dto.UsuarioRequest;
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
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Mono;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.reactive.ResponseUtil;

/**
 * REST controller for managing {@link com.tellescom.all4qms.domain.Usuario}.
 */
@RestController
@RequestMapping("/api")
public class UsuarioResource {

    private final Logger log = LoggerFactory.getLogger(UsuarioResource.class);

    private static final String ENTITY_NAME = "usuario";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UsuarioService usuarioService;

    private final UserService userService;

    private final UsuarioRepository usuarioRepository;

    public UsuarioResource(UsuarioService usuarioService, UserService userService, UsuarioRepository usuarioRepository) {
        this.userService = userService;
        this.applicationName = applicationName;
        this.usuarioService = usuarioService;
        this.usuarioRepository = usuarioRepository;
    }

    /**
     * {@code POST  /usuarios} : Create a new usuario.
     *
     * @param usuarioDTO the usuarioDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new usuarioDTO, or with status {@code 400 (Bad Request)} if the usuario has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/usuarios")
    public Mono<ResponseEntity<UsuarioDTO>> createUsuario(@Valid @RequestBody UsuarioRequest newUsuario) throws URISyntaxException {
        log.debug("REST request to save Usuario : {}", newUsuario);

        log.debug(newUsuario.getNome());
        String[] partesDoNome = newUsuario.getNome().split(" ");
        String primeiroNome = "";
        StringBuilder sobrenome = new StringBuilder();

        if (partesDoNome.length >= 2) {
            primeiroNome = partesDoNome[0];

            for (int i = 1; i < partesDoNome.length; i++) {
                sobrenome.append(partesDoNome[i]);
                if (i < partesDoNome.length - 1) {
                    sobrenome.append(" ");
                }
            }
        }

        log.debug(primeiroNome);
        log.debug(sobrenome.toString());

        AdminUserDTO userDTO = new AdminUserDTO();
        UsuarioDTO usuarioDTO = new UsuarioDTO();

        // Criação do Usuário Jhipster
        userDTO.setId(newUsuario.getId());
        userDTO.setFirstName(primeiroNome);
        userDTO.setLastName(sobrenome.toString());
        userDTO.setEmail(newUsuario.getEmail());
        userDTO.setLogin(primeiroNome + "." + partesDoNome[partesDoNome.length - 1]);

        // Criação do Usuário ALL4QMS
        usuarioDTO.setId(newUsuario.getId());
        usuarioDTO.setEmail(newUsuario.getEmail());
        usuarioDTO.setNome(newUsuario.getNome());
        usuarioDTO.setFuncao(newUsuario.getFuncao());
        usuarioDTO.setSetor(newUsuario.getSetor());
        usuarioDTO.setIsGestor(newUsuario.getisGestor());
        usuarioDTO.setGestor(newUsuario.getGestor());
        usuarioDTO.setProcessos(newUsuario.getProcessos());

        if (usuarioDTO.getId() != null) {
            throw new BadRequestAlertException("A new usuario cannot already have an ID", ENTITY_NAME, "idexists");
        }
        log.debug("AAAAAAAAAAAA");
        userService.createUser(userDTO);

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
     * {@code PUT  /usuarios/:id} : Updates an existing usuario.
     *
     * @param id the id of the usuarioDTO to save.
     * @param usuarioDTO the usuarioDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated usuarioDTO,
     * or with status {@code 400 (Bad Request)} if the usuarioDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the usuarioDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/usuarios/{id}")
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

        return usuarioRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                return usuarioService
                    .update(usuarioDTO)
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
     * {@code PATCH  /usuarios/:id} : Partial updates given fields of an existing usuario, field will ignore if it is null
     *
     * @param id the id of the usuarioDTO to save.
     * @param usuarioDTO the usuarioDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated usuarioDTO,
     * or with status {@code 400 (Bad Request)} if the usuarioDTO is not valid,
     * or with status {@code 404 (Not Found)} if the usuarioDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the usuarioDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/usuarios/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public Mono<ResponseEntity<UsuarioDTO>> partialUpdateUsuario(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody UsuarioDTO usuarioDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Usuario partially : {}, {}", id, usuarioDTO);
        if (usuarioDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, usuarioDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return usuarioRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                Mono<UsuarioDTO> result = usuarioService.partialUpdate(usuarioDTO);

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
     * {@code GET  /usuarios} : get all the usuarios.
     *
     * @param pageable the pagination information.
     * @param request a {@link ServerHttpRequest} request.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of usuarios in body.
     */
    @GetMapping("/usuarios")
    public Mono<ResponseEntity<List<UsuarioDTO>>> getAllUsuarios(
        @org.springdoc.api.annotations.ParameterObject Pageable pageable,
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
     * {@code GET  /usuarios/:id} : get the "id" usuario.
     *
     * @param id the id of the usuarioDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the usuarioDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/usuarios/{id}")
    public Mono<ResponseEntity<UsuarioDTO>> getUsuario(@PathVariable Long id) {
        log.debug("REST request to get Usuario : {}", id);
        Mono<UsuarioDTO> usuarioDTO = usuarioService.findOne(id);
        return ResponseUtil.wrapOrNotFound(usuarioDTO);
    }

    /**
     * {@code DELETE  /usuarios/:id} : delete the "id" usuario.
     *
     * @param id the id of the usuarioDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/usuarios/{id}")
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
}
