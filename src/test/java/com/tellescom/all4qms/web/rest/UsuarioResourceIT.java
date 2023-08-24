package com.tellescom.all4qms.web.rest;

import static com.tellescom.all4qms.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.*;

import com.tellescom.all4qms.IntegrationTest;
import com.tellescom.all4qms.domain.Usuario;
import com.tellescom.all4qms.repository.EntityManager;
import com.tellescom.all4qms.repository.UsuarioRepository;
import com.tellescom.all4qms.service.UsuarioService;
import com.tellescom.all4qms.service.dto.UsuarioDTO;
import com.tellescom.all4qms.service.mapper.UsuarioMapper;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Integration tests for the {@link UsuarioResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class UsuarioResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final Boolean DEFAULT_IS_GESTOR = false;
    private static final Boolean UPDATED_IS_GESTOR = true;

    private static final ZonedDateTime DEFAULT_CRIADO_EM = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CRIADO_EM = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_ATUALIZADO_EM = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_ATUALIZADO_EM = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/usuarios";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Mock
    private UsuarioRepository usuarioRepositoryMock;

    @Autowired
    private UsuarioMapper usuarioMapper;

    @Mock
    private UsuarioService usuarioServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Usuario usuario;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Usuario createEntity(EntityManager em) {
        Usuario usuario = new Usuario()
            .nome(DEFAULT_NOME)
            .email(DEFAULT_EMAIL)
            .isGestor(DEFAULT_IS_GESTOR)
            .criadoEm(DEFAULT_CRIADO_EM)
            .atualizadoEm(DEFAULT_ATUALIZADO_EM);
        return usuario;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Usuario createUpdatedEntity(EntityManager em) {
        Usuario usuario = new Usuario()
            .nome(UPDATED_NOME)
            .email(UPDATED_EMAIL)
            .isGestor(UPDATED_IS_GESTOR)
            .criadoEm(UPDATED_CRIADO_EM)
            .atualizadoEm(UPDATED_ATUALIZADO_EM);
        return usuario;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll("rel_usuario__processos").block();
            em.deleteAll(Usuario.class).block();
        } catch (Exception e) {
            // It can fail, if other entities are still referring this - it will be removed later.
        }
    }

    @AfterEach
    public void cleanup() {
        deleteEntities(em);
    }

    @BeforeEach
    public void initTest() {
        deleteEntities(em);
        usuario = createEntity(em);
    }

    @Test
    void createUsuario() throws Exception {
        int databaseSizeBeforeCreate = usuarioRepository.findAll().collectList().block().size();
        // Create the Usuario
        UsuarioDTO usuarioDTO = usuarioMapper.toDto(usuario);
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(usuarioDTO))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Usuario in the database
        List<Usuario> usuarioList = usuarioRepository.findAll().collectList().block();
        assertThat(usuarioList).hasSize(databaseSizeBeforeCreate + 1);
        Usuario testUsuario = usuarioList.get(usuarioList.size() - 1);
        assertThat(testUsuario.getNome()).isEqualTo(DEFAULT_NOME);
        assertThat(testUsuario.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testUsuario.getIsGestor()).isEqualTo(DEFAULT_IS_GESTOR);
        assertThat(testUsuario.getCriadoEm()).isEqualTo(DEFAULT_CRIADO_EM);
        assertThat(testUsuario.getAtualizadoEm()).isEqualTo(DEFAULT_ATUALIZADO_EM);
    }

    @Test
    void createUsuarioWithExistingId() throws Exception {
        // Create the Usuario with an existing ID
        usuario.setId(1L);
        UsuarioDTO usuarioDTO = usuarioMapper.toDto(usuario);

        int databaseSizeBeforeCreate = usuarioRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(usuarioDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Usuario in the database
        List<Usuario> usuarioList = usuarioRepository.findAll().collectList().block();
        assertThat(usuarioList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkNomeIsRequired() throws Exception {
        int databaseSizeBeforeTest = usuarioRepository.findAll().collectList().block().size();
        // set the field null
        usuario.setNome(null);

        // Create the Usuario, which fails.
        UsuarioDTO usuarioDTO = usuarioMapper.toDto(usuario);

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(usuarioDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Usuario> usuarioList = usuarioRepository.findAll().collectList().block();
        assertThat(usuarioList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllUsuarios() {
        // Initialize the database
        usuarioRepository.save(usuario).block();

        // Get all the usuarioList
        webTestClient
            .get()
            .uri(ENTITY_API_URL + "?sort=id,desc")
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.[*].id")
            .value(hasItem(usuario.getId().intValue()))
            .jsonPath("$.[*].nome")
            .value(hasItem(DEFAULT_NOME))
            .jsonPath("$.[*].email")
            .value(hasItem(DEFAULT_EMAIL))
            .jsonPath("$.[*].isGestor")
            .value(hasItem(DEFAULT_IS_GESTOR.booleanValue()))
            .jsonPath("$.[*].criadoEm")
            .value(hasItem(sameInstant(DEFAULT_CRIADO_EM)))
            .jsonPath("$.[*].atualizadoEm")
            .value(hasItem(sameInstant(DEFAULT_ATUALIZADO_EM)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllUsuariosWithEagerRelationshipsIsEnabled() {
        when(usuarioServiceMock.findAllWithEagerRelationships(any())).thenReturn(Flux.empty());

        webTestClient.get().uri(ENTITY_API_URL + "?eagerload=true").exchange().expectStatus().isOk();

        verify(usuarioServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllUsuariosWithEagerRelationshipsIsNotEnabled() {
        when(usuarioServiceMock.findAllWithEagerRelationships(any())).thenReturn(Flux.empty());

        webTestClient.get().uri(ENTITY_API_URL + "?eagerload=false").exchange().expectStatus().isOk();
        verify(usuarioRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    void getUsuario() {
        // Initialize the database
        usuarioRepository.save(usuario).block();

        // Get the usuario
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, usuario.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(usuario.getId().intValue()))
            .jsonPath("$.nome")
            .value(is(DEFAULT_NOME))
            .jsonPath("$.email")
            .value(is(DEFAULT_EMAIL))
            .jsonPath("$.isGestor")
            .value(is(DEFAULT_IS_GESTOR.booleanValue()))
            .jsonPath("$.criadoEm")
            .value(is(sameInstant(DEFAULT_CRIADO_EM)))
            .jsonPath("$.atualizadoEm")
            .value(is(sameInstant(DEFAULT_ATUALIZADO_EM)));
    }

    @Test
    void getNonExistingUsuario() {
        // Get the usuario
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_PROBLEM_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingUsuario() throws Exception {
        // Initialize the database
        usuarioRepository.save(usuario).block();

        int databaseSizeBeforeUpdate = usuarioRepository.findAll().collectList().block().size();

        // Update the usuario
        Usuario updatedUsuario = usuarioRepository.findById(usuario.getId()).block();
        updatedUsuario
            .nome(UPDATED_NOME)
            .email(UPDATED_EMAIL)
            .isGestor(UPDATED_IS_GESTOR)
            .criadoEm(UPDATED_CRIADO_EM)
            .atualizadoEm(UPDATED_ATUALIZADO_EM);
        UsuarioDTO usuarioDTO = usuarioMapper.toDto(updatedUsuario);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, usuarioDTO.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(usuarioDTO))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Usuario in the database
        List<Usuario> usuarioList = usuarioRepository.findAll().collectList().block();
        assertThat(usuarioList).hasSize(databaseSizeBeforeUpdate);
        Usuario testUsuario = usuarioList.get(usuarioList.size() - 1);
        assertThat(testUsuario.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testUsuario.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testUsuario.getIsGestor()).isEqualTo(UPDATED_IS_GESTOR);
        assertThat(testUsuario.getCriadoEm()).isEqualTo(UPDATED_CRIADO_EM);
        assertThat(testUsuario.getAtualizadoEm()).isEqualTo(UPDATED_ATUALIZADO_EM);
    }

    @Test
    void putNonExistingUsuario() throws Exception {
        int databaseSizeBeforeUpdate = usuarioRepository.findAll().collectList().block().size();
        usuario.setId(count.incrementAndGet());

        // Create the Usuario
        UsuarioDTO usuarioDTO = usuarioMapper.toDto(usuario);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, usuarioDTO.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(usuarioDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Usuario in the database
        List<Usuario> usuarioList = usuarioRepository.findAll().collectList().block();
        assertThat(usuarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchUsuario() throws Exception {
        int databaseSizeBeforeUpdate = usuarioRepository.findAll().collectList().block().size();
        usuario.setId(count.incrementAndGet());

        // Create the Usuario
        UsuarioDTO usuarioDTO = usuarioMapper.toDto(usuario);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(usuarioDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Usuario in the database
        List<Usuario> usuarioList = usuarioRepository.findAll().collectList().block();
        assertThat(usuarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamUsuario() throws Exception {
        int databaseSizeBeforeUpdate = usuarioRepository.findAll().collectList().block().size();
        usuario.setId(count.incrementAndGet());

        // Create the Usuario
        UsuarioDTO usuarioDTO = usuarioMapper.toDto(usuario);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(usuarioDTO))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Usuario in the database
        List<Usuario> usuarioList = usuarioRepository.findAll().collectList().block();
        assertThat(usuarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateUsuarioWithPatch() throws Exception {
        // Initialize the database
        usuarioRepository.save(usuario).block();

        int databaseSizeBeforeUpdate = usuarioRepository.findAll().collectList().block().size();

        // Update the usuario using partial update
        Usuario partialUpdatedUsuario = new Usuario();
        partialUpdatedUsuario.setId(usuario.getId());

        partialUpdatedUsuario.nome(UPDATED_NOME).isGestor(UPDATED_IS_GESTOR);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedUsuario.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedUsuario))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Usuario in the database
        List<Usuario> usuarioList = usuarioRepository.findAll().collectList().block();
        assertThat(usuarioList).hasSize(databaseSizeBeforeUpdate);
        Usuario testUsuario = usuarioList.get(usuarioList.size() - 1);
        assertThat(testUsuario.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testUsuario.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testUsuario.getIsGestor()).isEqualTo(UPDATED_IS_GESTOR);
        assertThat(testUsuario.getCriadoEm()).isEqualTo(DEFAULT_CRIADO_EM);
        assertThat(testUsuario.getAtualizadoEm()).isEqualTo(DEFAULT_ATUALIZADO_EM);
    }

    @Test
    void fullUpdateUsuarioWithPatch() throws Exception {
        // Initialize the database
        usuarioRepository.save(usuario).block();

        int databaseSizeBeforeUpdate = usuarioRepository.findAll().collectList().block().size();

        // Update the usuario using partial update
        Usuario partialUpdatedUsuario = new Usuario();
        partialUpdatedUsuario.setId(usuario.getId());

        partialUpdatedUsuario
            .nome(UPDATED_NOME)
            .email(UPDATED_EMAIL)
            .isGestor(UPDATED_IS_GESTOR)
            .criadoEm(UPDATED_CRIADO_EM)
            .atualizadoEm(UPDATED_ATUALIZADO_EM);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedUsuario.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedUsuario))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Usuario in the database
        List<Usuario> usuarioList = usuarioRepository.findAll().collectList().block();
        assertThat(usuarioList).hasSize(databaseSizeBeforeUpdate);
        Usuario testUsuario = usuarioList.get(usuarioList.size() - 1);
        assertThat(testUsuario.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testUsuario.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testUsuario.getIsGestor()).isEqualTo(UPDATED_IS_GESTOR);
        assertThat(testUsuario.getCriadoEm()).isEqualTo(UPDATED_CRIADO_EM);
        assertThat(testUsuario.getAtualizadoEm()).isEqualTo(UPDATED_ATUALIZADO_EM);
    }

    @Test
    void patchNonExistingUsuario() throws Exception {
        int databaseSizeBeforeUpdate = usuarioRepository.findAll().collectList().block().size();
        usuario.setId(count.incrementAndGet());

        // Create the Usuario
        UsuarioDTO usuarioDTO = usuarioMapper.toDto(usuario);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, usuarioDTO.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(usuarioDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Usuario in the database
        List<Usuario> usuarioList = usuarioRepository.findAll().collectList().block();
        assertThat(usuarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchUsuario() throws Exception {
        int databaseSizeBeforeUpdate = usuarioRepository.findAll().collectList().block().size();
        usuario.setId(count.incrementAndGet());

        // Create the Usuario
        UsuarioDTO usuarioDTO = usuarioMapper.toDto(usuario);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(usuarioDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Usuario in the database
        List<Usuario> usuarioList = usuarioRepository.findAll().collectList().block();
        assertThat(usuarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamUsuario() throws Exception {
        int databaseSizeBeforeUpdate = usuarioRepository.findAll().collectList().block().size();
        usuario.setId(count.incrementAndGet());

        // Create the Usuario
        UsuarioDTO usuarioDTO = usuarioMapper.toDto(usuario);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(usuarioDTO))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Usuario in the database
        List<Usuario> usuarioList = usuarioRepository.findAll().collectList().block();
        assertThat(usuarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteUsuario() {
        // Initialize the database
        usuarioRepository.save(usuario).block();

        int databaseSizeBeforeDelete = usuarioRepository.findAll().collectList().block().size();

        // Delete the usuario
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, usuario.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Usuario> usuarioList = usuarioRepository.findAll().collectList().block();
        assertThat(usuarioList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
