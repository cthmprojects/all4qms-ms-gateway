package com.tellescom.all4qms.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.*;

import com.tellescom.all4qms.IntegrationTest;
import com.tellescom.all4qms.domain.Setor;
import com.tellescom.all4qms.repository.EntityManager;
import com.tellescom.all4qms.repository.SetorRepository;
import com.tellescom.all4qms.service.SetorService;
import com.tellescom.all4qms.service.dto.SetorDTO;
import com.tellescom.all4qms.service.mapper.SetorMapper;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
 * Integration tests for the {@link SetorResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class SetorResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRICAO = "AAAAAAAAAA";
    private static final String UPDATED_DESCRICAO = "BBBBBBBBBB";

    private static final Instant DEFAULT_CRIADO_EM = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CRIADO_EM = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_ATUALIZADO_EM = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_ATUALIZADO_EM = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/setors";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SetorRepository setorRepository;

    @Mock
    private SetorRepository setorRepositoryMock;

    @Autowired
    private SetorMapper setorMapper;

    @Mock
    private SetorService setorServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Setor setor;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Setor createEntity(EntityManager em) {
        Setor setor = new Setor()
            .nome(DEFAULT_NOME)
            .descricao(DEFAULT_DESCRICAO)
            .criadoEm(DEFAULT_CRIADO_EM)
            .atualizadoEm(DEFAULT_ATUALIZADO_EM);
        return setor;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Setor createUpdatedEntity(EntityManager em) {
        Setor setor = new Setor()
            .nome(UPDATED_NOME)
            .descricao(UPDATED_DESCRICAO)
            .criadoEm(UPDATED_CRIADO_EM)
            .atualizadoEm(UPDATED_ATUALIZADO_EM);
        return setor;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(Setor.class).block();
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
        setor = createEntity(em);
    }

    @Test
    void createSetor() throws Exception {
        int databaseSizeBeforeCreate = setorRepository.findAll().collectList().block().size();
        // Create the Setor
        SetorDTO setorDTO = setorMapper.toDto(setor);
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(setorDTO))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Setor in the database
        List<Setor> setorList = setorRepository.findAll().collectList().block();
        assertThat(setorList).hasSize(databaseSizeBeforeCreate + 1);
        Setor testSetor = setorList.get(setorList.size() - 1);
        assertThat(testSetor.getNome()).isEqualTo(DEFAULT_NOME);
        assertThat(testSetor.getDescricao()).isEqualTo(DEFAULT_DESCRICAO);
        assertThat(testSetor.getCriadoEm()).isEqualTo(DEFAULT_CRIADO_EM);
        assertThat(testSetor.getAtualizadoEm()).isEqualTo(DEFAULT_ATUALIZADO_EM);
    }

    @Test
    void createSetorWithExistingId() throws Exception {
        // Create the Setor with an existing ID
        setor.setId(1L);
        SetorDTO setorDTO = setorMapper.toDto(setor);

        int databaseSizeBeforeCreate = setorRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(setorDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Setor in the database
        List<Setor> setorList = setorRepository.findAll().collectList().block();
        assertThat(setorList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkNomeIsRequired() throws Exception {
        int databaseSizeBeforeTest = setorRepository.findAll().collectList().block().size();
        // set the field null
        setor.setNome(null);

        // Create the Setor, which fails.
        SetorDTO setorDTO = setorMapper.toDto(setor);

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(setorDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Setor> setorList = setorRepository.findAll().collectList().block();
        assertThat(setorList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllSetors() {
        // Initialize the database
        setorRepository.save(setor).block();

        // Get all the setorList
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
            .value(hasItem(setor.getId().intValue()))
            .jsonPath("$.[*].nome")
            .value(hasItem(DEFAULT_NOME))
            .jsonPath("$.[*].descricao")
            .value(hasItem(DEFAULT_DESCRICAO))
            .jsonPath("$.[*].criadoEm")
            .value(hasItem(DEFAULT_CRIADO_EM.toString()))
            .jsonPath("$.[*].atualizadoEm")
            .value(hasItem(DEFAULT_ATUALIZADO_EM.toString()));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllSetorsWithEagerRelationshipsIsEnabled() {
        when(setorServiceMock.findAllWithEagerRelationships(any())).thenReturn(Flux.empty());

        webTestClient.get().uri(ENTITY_API_URL + "?eagerload=true").exchange().expectStatus().isOk();

        verify(setorServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllSetorsWithEagerRelationshipsIsNotEnabled() {
        when(setorServiceMock.findAllWithEagerRelationships(any())).thenReturn(Flux.empty());

        webTestClient.get().uri(ENTITY_API_URL + "?eagerload=false").exchange().expectStatus().isOk();
        verify(setorRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    void getSetor() {
        // Initialize the database
        setorRepository.save(setor).block();

        // Get the setor
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, setor.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(setor.getId().intValue()))
            .jsonPath("$.nome")
            .value(is(DEFAULT_NOME))
            .jsonPath("$.descricao")
            .value(is(DEFAULT_DESCRICAO))
            .jsonPath("$.criadoEm")
            .value(is(DEFAULT_CRIADO_EM.toString()))
            .jsonPath("$.atualizadoEm")
            .value(is(DEFAULT_ATUALIZADO_EM.toString()));
    }

    @Test
    void getNonExistingSetor() {
        // Get the setor
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_PROBLEM_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingSetor() throws Exception {
        // Initialize the database
        setorRepository.save(setor).block();

        int databaseSizeBeforeUpdate = setorRepository.findAll().collectList().block().size();

        // Update the setor
        Setor updatedSetor = setorRepository.findById(setor.getId()).block();
        updatedSetor.nome(UPDATED_NOME).descricao(UPDATED_DESCRICAO).criadoEm(UPDATED_CRIADO_EM).atualizadoEm(UPDATED_ATUALIZADO_EM);
        SetorDTO setorDTO = setorMapper.toDto(updatedSetor);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, setorDTO.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(setorDTO))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Setor in the database
        List<Setor> setorList = setorRepository.findAll().collectList().block();
        assertThat(setorList).hasSize(databaseSizeBeforeUpdate);
        Setor testSetor = setorList.get(setorList.size() - 1);
        assertThat(testSetor.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testSetor.getDescricao()).isEqualTo(UPDATED_DESCRICAO);
        assertThat(testSetor.getCriadoEm()).isEqualTo(UPDATED_CRIADO_EM);
        assertThat(testSetor.getAtualizadoEm()).isEqualTo(UPDATED_ATUALIZADO_EM);
    }

    @Test
    void putNonExistingSetor() throws Exception {
        int databaseSizeBeforeUpdate = setorRepository.findAll().collectList().block().size();
        setor.setId(count.incrementAndGet());

        // Create the Setor
        SetorDTO setorDTO = setorMapper.toDto(setor);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, setorDTO.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(setorDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Setor in the database
        List<Setor> setorList = setorRepository.findAll().collectList().block();
        assertThat(setorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchSetor() throws Exception {
        int databaseSizeBeforeUpdate = setorRepository.findAll().collectList().block().size();
        setor.setId(count.incrementAndGet());

        // Create the Setor
        SetorDTO setorDTO = setorMapper.toDto(setor);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(setorDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Setor in the database
        List<Setor> setorList = setorRepository.findAll().collectList().block();
        assertThat(setorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamSetor() throws Exception {
        int databaseSizeBeforeUpdate = setorRepository.findAll().collectList().block().size();
        setor.setId(count.incrementAndGet());

        // Create the Setor
        SetorDTO setorDTO = setorMapper.toDto(setor);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(setorDTO))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Setor in the database
        List<Setor> setorList = setorRepository.findAll().collectList().block();
        assertThat(setorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateSetorWithPatch() throws Exception {
        // Initialize the database
        setorRepository.save(setor).block();

        int databaseSizeBeforeUpdate = setorRepository.findAll().collectList().block().size();

        // Update the setor using partial update
        Setor partialUpdatedSetor = new Setor();
        partialUpdatedSetor.setId(setor.getId());

        partialUpdatedSetor.nome(UPDATED_NOME).descricao(UPDATED_DESCRICAO).criadoEm(UPDATED_CRIADO_EM);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedSetor.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedSetor))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Setor in the database
        List<Setor> setorList = setorRepository.findAll().collectList().block();
        assertThat(setorList).hasSize(databaseSizeBeforeUpdate);
        Setor testSetor = setorList.get(setorList.size() - 1);
        assertThat(testSetor.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testSetor.getDescricao()).isEqualTo(UPDATED_DESCRICAO);
        assertThat(testSetor.getCriadoEm()).isEqualTo(UPDATED_CRIADO_EM);
        assertThat(testSetor.getAtualizadoEm()).isEqualTo(DEFAULT_ATUALIZADO_EM);
    }

    @Test
    void fullUpdateSetorWithPatch() throws Exception {
        // Initialize the database
        setorRepository.save(setor).block();

        int databaseSizeBeforeUpdate = setorRepository.findAll().collectList().block().size();

        // Update the setor using partial update
        Setor partialUpdatedSetor = new Setor();
        partialUpdatedSetor.setId(setor.getId());

        partialUpdatedSetor.nome(UPDATED_NOME).descricao(UPDATED_DESCRICAO).criadoEm(UPDATED_CRIADO_EM).atualizadoEm(UPDATED_ATUALIZADO_EM);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedSetor.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedSetor))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Setor in the database
        List<Setor> setorList = setorRepository.findAll().collectList().block();
        assertThat(setorList).hasSize(databaseSizeBeforeUpdate);
        Setor testSetor = setorList.get(setorList.size() - 1);
        assertThat(testSetor.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testSetor.getDescricao()).isEqualTo(UPDATED_DESCRICAO);
        assertThat(testSetor.getCriadoEm()).isEqualTo(UPDATED_CRIADO_EM);
        assertThat(testSetor.getAtualizadoEm()).isEqualTo(UPDATED_ATUALIZADO_EM);
    }

    @Test
    void patchNonExistingSetor() throws Exception {
        int databaseSizeBeforeUpdate = setorRepository.findAll().collectList().block().size();
        setor.setId(count.incrementAndGet());

        // Create the Setor
        SetorDTO setorDTO = setorMapper.toDto(setor);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, setorDTO.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(setorDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Setor in the database
        List<Setor> setorList = setorRepository.findAll().collectList().block();
        assertThat(setorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchSetor() throws Exception {
        int databaseSizeBeforeUpdate = setorRepository.findAll().collectList().block().size();
        setor.setId(count.incrementAndGet());

        // Create the Setor
        SetorDTO setorDTO = setorMapper.toDto(setor);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(setorDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Setor in the database
        List<Setor> setorList = setorRepository.findAll().collectList().block();
        assertThat(setorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamSetor() throws Exception {
        int databaseSizeBeforeUpdate = setorRepository.findAll().collectList().block().size();
        setor.setId(count.incrementAndGet());

        // Create the Setor
        SetorDTO setorDTO = setorMapper.toDto(setor);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(setorDTO))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Setor in the database
        List<Setor> setorList = setorRepository.findAll().collectList().block();
        assertThat(setorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteSetor() {
        // Initialize the database
        setorRepository.save(setor).block();

        int databaseSizeBeforeDelete = setorRepository.findAll().collectList().block().size();

        // Delete the setor
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, setor.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Setor> setorList = setorRepository.findAll().collectList().block();
        assertThat(setorList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
