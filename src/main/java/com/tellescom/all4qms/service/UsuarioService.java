package com.tellescom.all4qms.service;

import com.tellescom.all4qms.domain.Authority;
import com.tellescom.all4qms.domain.User;
import com.tellescom.all4qms.domain.Usuario;
import com.tellescom.all4qms.domain.request.UsuarioRequest;
import com.tellescom.all4qms.domain.request.UsuarioUpdateRequest;
import com.tellescom.all4qms.domain.response.GestorResponse;
import com.tellescom.all4qms.repository.UsuarioRepository;
import com.tellescom.all4qms.service.dto.AdminUserDTO;
import com.tellescom.all4qms.service.dto.UserDTO;
import com.tellescom.all4qms.service.dto.UsuarioDTO;
import com.tellescom.all4qms.service.mapper.UsuarioMapper;
import com.tellescom.all4qms.web.rest.errors.BadRequestAlertException;
import io.micrometer.core.instrument.binder.db.MetricsDSLContext;
import java.time.Instant;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.function.Consumer;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import tech.jhipster.web.util.HeaderUtil;

/**
 * Service Implementation for managing {@link Usuario}.
 */
@Service
@Transactional
public class UsuarioService {

    private final Logger log = LoggerFactory.getLogger(UsuarioService.class);

    private final UsuarioRepository usuarioRepository;

    private final UsuarioMapper usuarioMapper;

    private final PasswordEncoder passwordEncoder;

    private final UserService userService;

    private final ProcessoService processoService;

    private final JavaMailSender emailSender;

    public UsuarioService(
        UsuarioRepository usuarioRepository,
        UsuarioMapper usuarioMapper,
        PasswordEncoder passwordEncoder,
        UserService userService,
        ProcessoService processoService,
        JavaMailSender emailSender
    ) {
        this.usuarioRepository = usuarioRepository;
        this.usuarioMapper = usuarioMapper;
        this.passwordEncoder = passwordEncoder;
        this.userService = userService;
        this.processoService = processoService;
        this.emailSender = emailSender;
    }

    /**
     * Save a usuario.
     *
     * @param usuarioDTO the entity to save.
     * @return the persisted entity.
     */
    public Mono<UsuarioDTO> save(UsuarioDTO usuarioDTO) {
        log.debug("Request to save Usuario : {}", usuarioDTO);
        return usuarioRepository.save(usuarioMapper.toEntity(usuarioDTO)).map(usuarioMapper::toDto);
    }

    /**
     * Update a usuario.
     *
     * @param request the entity to save.
     * @return the persisted entity.
     */
    public Mono<UsuarioDTO> update(UsuarioUpdateRequest request) {
        log.debug("Request to update Usuario : {}", request);
        return usuarioRepository
            .existsById(request.getUsuario().getId())
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", "usuario", "idnotfound"));
                }
                AdminUserDTO adminUserDTO = new AdminUserDTO();
                adminUserDTO.setId(request.getUsuario().getUser().getId());
                adminUserDTO.setActivated(true);
                adminUserDTO.setEmail(request.getUsuario().getEmail());
                String[] nome = request.getUsuario().getNome().split(" ");
                if (nome.length > 1) {
                    adminUserDTO.setFirstName(nome[0]);
                    adminUserDTO.setLastName(nome[1]);
                }
                adminUserDTO.setFirstName(nome[0]);
                adminUserDTO.setLogin(request.getLogin());
                if (request.getPerfis() != null) {
                    adminUserDTO.setAuthorities(request.getPerfis());
                }

                // Encadear as operações reativas
                return userService
                    .updateUser(adminUserDTO) // Executa o updateUser primeiro
                    .flatMap(updatedUser -> { // Após o updateUser ser concluído, continua com o próximo processamento
                        return usuarioRepository
                            .save(usuarioMapper.toEntity(request.getUsuario())) // Salva o usuário no repository
                            .map(usuarioMapper::toDto); // Mapeia o resultado para UsuarioDTO
                    });
            });
    }

    public Mono<UsuarioDTO> updatePut(UsuarioDTO request) {
        log.debug("Request to update Usuario : {}", request);
        return usuarioRepository.save(usuarioMapper.toEntity(request)).map(usuarioMapper::toDto);
    }

    /**
     * Partially update a usuario.
     *
     * @param usuarioDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Mono<UsuarioDTO> partialUpdate(UsuarioDTO usuarioDTO) {
        log.debug("Request to partially update Usuario : {}", usuarioDTO);

        return usuarioRepository
            .findById(usuarioDTO.getId())
            .map(existingUsuario -> {
                usuarioMapper.partialUpdate(existingUsuario, usuarioDTO);

                return existingUsuario;
            })
            .flatMap(usuarioRepository::save)
            .map(usuarioMapper::toDto);
    }

    /**
     * Get all the usuarios.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Flux<UsuarioDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Usuarios");
        return usuarioRepository
            .findAllBy(pageable)
            .flatMap(usuario -> {
                return processoService
                    .buscarProcessosPorIdUsuario(usuario.getId())
                    .collectList()
                    .map(processos -> {
                        UsuarioDTO usuarioDTO = usuarioMapper.toDto(usuario);
                        usuarioDTO.setProcessos(new HashSet<>(processos));
                        return usuarioDTO;
                    });
            });
    }

    /**
     * Get all the usuarios with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Flux<UsuarioDTO> findAllWithEagerRelationships(Pageable pageable) {
        return usuarioRepository.findAllWithEagerRelationships(pageable).map(usuarioMapper::toDto);
    }

    /**
     * Returns the number of usuarios available.
     *
     * @return the number of entities in the database.
     */
    public Mono<Long> countAll() {
        return usuarioRepository.count();
    }

    /**
     * Get one usuario by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    public Mono<UsuarioDTO> findOne(Long id) {
        log.debug("Request to get Usuario : {}", id);
        return processoService
            .buscarProcessosPorIdUsuario(id)
            .collect(Collectors.toSet())
            .flatMap(processos ->
                usuarioRepository
                    .findById(id)
                    .map(usuario -> {
                        UsuarioDTO usuarioDTO = usuarioMapper.toDto(usuario);
                        usuarioDTO.setProcessos(processos);
                        return usuarioDTO;
                    })
            );
    }

    /**
     * Delete the usuario by id.
     *
     * @param id the id of the entity.
     * @return a Mono to signal the deletion
     */
    public Mono<Void> delete(Long id) {
        log.debug("Request to delete Usuario : {}", id);
        return usuarioRepository.deleteById(id);
    }

    public Mono<UsuarioDTO> saveRequest(UsuarioRequest request) {
        //criar user
        User userJh = new User();
        userJh.setActivated(true);
        userJh.setEmail(request.getEmail());
        String[] nome = request.getNome().split(" ");
        if (nome.length > 1) {
            userJh.setFirstName(nome[0]);
            userJh.setLastName(nome[1]);
        }
        userJh.setFirstName(nome[0]);
        userJh.setLogin(request.getLogin());
        userJh.setCreatedDate(Instant.now());
        userJh.setCreatedBy("System");
        userJh.setLangKey("pt-br");
        userJh.setAuthorities(request.getPerfil());
        userJh.setPassword(passwordEncoder.encode("all4qms" + LocalDate.now().getYear()));

        AdminUserDTO adminUserDTO = new AdminUserDTO(userJh);

        return userService
            .createUser(adminUserDTO)
            .flatMap(user -> {
                Usuario usuario = new Usuario();
                usuario.setCriadoPorId((request.getIdUsrCreator() == null) ? null : request.getIdUsrCreator());
                usuario.setNome(request.getNome());
                usuario.setCriadoEm(Instant.now());
                usuario.setEmail(request.getEmail());
                usuario.setIsGestor(request.isGestor());
                usuario.setFuncaoId(request.getFuncao());
                usuario.setSetorId(request.getSetor());
                // Busca os ProcessoDTOs por IDs
                if (request.getProcessos() != null) {
                    List<Long> processoIds = request.getProcessos();
                    return processoService
                        .buscarProcessosPorIds(processoIds)
                        .collectList()
                        .flatMap(processos -> {
                            usuario.setProcessos(new HashSet<>(processos));
                            usuario.setUserId(user.getId());
                            return usuarioRepository.save(usuario).map(usuarioMapper::toDto);
                        });
                }
                usuario.setUserId(user.getId());
                return usuarioRepository.save(usuario).map(usuarioMapper::toDto);
            });
    }

    public Mono<List<GestorResponse>> findAllManagers() {
        log.debug("Busca somente por gestores");
        return usuarioRepository.findAllIsGestor().map(usuarioMapper::toGestorResponse).collectList();
    }

    public Flux<UsuarioDTO> findByProcessos(Long id) {
        log.debug("Busca somente por usuarios do processo");
        return usuarioRepository.findByProcessos(id).map(usuarioMapper::toDto);
    }

    public Mono<UsuarioDTO> findAllByUserJhId(Long id) {
        log.debug("Request to get all Usuarios");
        return usuarioRepository.findByUser(id).flatMap(usuario -> findOne(usuario.getId()));
    }

    public Flux<UsuarioDTO> processarUsuariosPorIdProcesso(Long processoId) {
        return processoService.buscarIdUserByIdProcesso(processoId).collectList().flatMapMany(ids -> findMany(Flux.fromIterable(ids)));
    }

    public Flux<UsuarioDTO> findMany(Flux<Long> idFlux) {
        return idFlux.flatMap(id ->
            processoService
                .buscarProcessosPorIdUsuario(id)
                .collect(Collectors.toSet())
                .flatMap(processos ->
                    usuarioRepository
                        .findById(id)
                        .map(usuario -> {
                            UsuarioDTO usuarioDTO = usuarioMapper.toDto(usuario);
                            usuarioDTO.setProcessos(processos);
                            return usuarioDTO;
                        })
                )
        );
    }

    public Mono<ResponseEntity<Flux<UserDTO>>> getByRole(String role) {
        return userService.countManagedUsers().map(headers -> ResponseEntity.ok().body(userService.getUsersByAuthority(role)));
    }
}
