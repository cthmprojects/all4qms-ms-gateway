package com.tellescom.all4qms.service;

import com.tellescom.all4qms.domain.Processo;
import com.tellescom.all4qms.domain.User;
import com.tellescom.all4qms.domain.Usuario;
import com.tellescom.all4qms.domain.request.UsuarioRequest;
import com.tellescom.all4qms.domain.response.GestorResponse;
import com.tellescom.all4qms.repository.UsuarioRepository;
import com.tellescom.all4qms.service.dto.AdminUserDTO;
import com.tellescom.all4qms.service.dto.ProcessoDTO;
import com.tellescom.all4qms.service.dto.UsuarioDTO;
import com.tellescom.all4qms.service.mapper.UsuarioMapper;
import java.time.Instant;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

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

    public UsuarioService(
        UsuarioRepository usuarioRepository,
        UsuarioMapper usuarioMapper,
        PasswordEncoder passwordEncoder,
        UserService userService,
        ProcessoService processoService
    ) {
        this.usuarioRepository = usuarioRepository;
        this.usuarioMapper = usuarioMapper;
        this.passwordEncoder = passwordEncoder;
        this.userService = userService;
        this.processoService = processoService;
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
     * @param usuarioDTO the entity to save.
     * @return the persisted entity.
     */
    public Mono<UsuarioDTO> update(UsuarioDTO usuarioDTO) {
        log.debug("Request to update Usuario : {}", usuarioDTO);
        return usuarioRepository.save(usuarioMapper.toEntity(usuarioDTO)).map(usuarioMapper::toDto);
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
        return usuarioRepository.findAllBy(pageable).map(usuarioMapper::toDto);
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
    @Transactional(readOnly = true)
    public Mono<UsuarioDTO> findOne(Long id) {
        log.debug("Request to get Usuario : {}", id);
        return usuarioRepository.findOneWithEagerRelationships(id).map(usuarioMapper::toDto);
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
                usuario.setCriadoPorId(request.getIdUsrCreator());
                usuario.setNome(request.getNome());
                usuario.setCriadoEm(Instant.now());
                usuario.setEmail(request.getEmail());
                usuario.setIsGestor(request.isGestor());
                usuario.setFuncaoId(request.getFuncao());
                usuario.setSetorId(request.getSetor());
                // Busca os ProcessoDTOs por IDs
                List<Long> processoIds = request.getProcessos();
                return processoService
                    .buscarProcessosPorIds(processoIds)
                    .collectList()
                    .flatMap(processos -> {
                        usuario.setProcessos(new HashSet<>(processos));
                        usuario.setUserId(user.getId());
                        return usuarioRepository.save(usuario).map(usuarioMapper::toDto);
                    });
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
}
