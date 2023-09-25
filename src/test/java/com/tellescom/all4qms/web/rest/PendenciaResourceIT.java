package com.tellescom.all4qms.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.*;

import com.tellescom.all4qms.IntegrationTest;
import com.tellescom.all4qms.domain.Pendencia;
import com.tellescom.all4qms.domain.enumeration.EnumTipoPend;
import com.tellescom.all4qms.repository.EntityManager;
import com.tellescom.all4qms.repository.PendenciaRepository;
import com.tellescom.all4qms.service.PendenciaService;
import com.tellescom.all4qms.service.dto.PendenciaDTO;
import com.tellescom.all4qms.service.mapper.PendenciaMapper;
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
 * Integration tests for the {@link PendenciaResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class PendenciaResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final Boolean DEFAULT_STATUS = false;
    private static final Boolean UPDATED_STATUS = true;

    private static final Instant DEFAULT_LIDA_EM = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_LIDA_EM = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_LINK = "AAAAAAAAAA";
    private static final String UPDATED_LINK = "BBBBBBBBBB";

    private static final EnumTipoPend DEFAULT_TIPO = EnumTipoPend.Atividade;
    private static final EnumTipoPend UPDATED_TIPO = EnumTipoPend.Notificacao;

    private static final Instant DEFAULT_CRIADO_EM = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CRIADO_EM = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/pendencias";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PendenciaRepository pendenciaRepository;

    @Mock
    private PendenciaRepository pendenciaRepositoryMock;

    @Autowired
    private PendenciaMapper pendenciaMapper;

    @Mock
    private PendenciaService pendenciaServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Pendencia pendencia;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Pendencia createEntity(EntityManager em) {
        Pendencia pendencia = new Pendencia()
            .nome(DEFAULT_NOME)
            .status(DEFAULT_STATUS)
            .lidaEm(DEFAULT_LIDA_EM)
            .link(DEFAULT_LINK)
            .tipo(DEFAULT_TIPO)
            .criadoEm(DEFAULT_CRIADO_EM);
        return pendencia;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Pendencia createUpdatedEntity(EntityManager em) {
        Pendencia pendencia = new Pendencia()
            .nome(UPDATED_NOME)
            .status(UPDATED_STATUS)
            .lidaEm(UPDATED_LIDA_EM)
            .link(UPDATED_LINK)
            .tipo(UPDATED_TIPO)
            .criadoEm(UPDATED_CRIADO_EM);
        return pendencia;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(Pendencia.class).block();
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
        pendencia = createEntity(em);
    }

    @Test
    void createPendencia() throws Exception {
        int databaseSizeBeforeCreate = pendenciaRepository.findAll().collectList().block().size();
        // Create the Pendencia
        PendenciaDTO pendenciaDTO = pendenciaMapper.toDto(pendencia);
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(pendenciaDTO))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Pendencia in the database
        List<Pendencia> pendenciaList = pendenciaRepository.findAll().collectList().block();
        assertThat(pendenciaList).hasSize(databaseSizeBeforeCreate + 1);
        Pendencia testPendencia = pendenciaList.get(pendenciaList.size() - 1);
        assertThat(testPendencia.getNome()).isEqualTo(DEFAULT_NOME);
        assertThat(testPendencia.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testPendencia.getLidaEm()).isEqualTo(DEFAULT_LIDA_EM);
        assertThat(testPendencia.getLink()).isEqualTo(DEFAULT_LINK);
        assertThat(testPendencia.getTipo()).isEqualTo(DEFAULT_TIPO);
        assertThat(testPendencia.getCriadoEm()).isEqualTo(DEFAULT_CRIADO_EM);
    }

    @Test
    void createPendenciaWithExistingId() throws Exception {
        // Create the Pendencia with an existing ID
        pendencia.setId(1L);
        PendenciaDTO pendenciaDTO = pendenciaMapper.toDto(pendencia);

        int databaseSizeBeforeCreate = pendenciaRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(pendenciaDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Pendencia in the database
        List<Pendencia> pendenciaList = pendenciaRepository.findAll().collectList().block();
        assertThat(pendenciaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllPendencias() {
        // Initialize the database
        pendenciaRepository.save(pendencia).block();

        // Get all the pendenciaList
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
            .value(hasItem(pendencia.getId().intValue()))
            .jsonPath("$.[*].nome")
            .value(hasItem(DEFAULT_NOME))
            .jsonPath("$.[*].status")
            .value(hasItem(DEFAULT_STATUS.booleanValue()))
            .jsonPath("$.[*].lidaEm")
            .value(hasItem(DEFAULT_LIDA_EM.toString()))
            .jsonPath("$.[*].link")
            .value(hasItem(DEFAULT_LINK))
            .jsonPath("$.[*].tipo")
            .value(hasItem(DEFAULT_TIPO.toString()))
            .jsonPath("$.[*].criadoEm")
            .value(hasItem(DEFAULT_CRIADO_EM.toString()));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllPendenciasWithEagerRelationshipsIsEnabled() {
        when(pendenciaServiceMock.findAllWithEagerRelationships(any())).thenReturn(Flux.empty());

        webTestClient.get().uri(ENTITY_API_URL + "?eagerload=true").exchange().expectStatus().isOk();

        verify(pendenciaServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllPendenciasWithEagerRelationshipsIsNotEnabled() {
        when(pendenciaServiceMock.findAllWithEagerRelationships(any())).thenReturn(Flux.empty());

        webTestClient.get().uri(ENTITY_API_URL + "?eagerload=false").exchange().expectStatus().isOk();
        verify(pendenciaRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    void getPendencia() {
        // Initialize the database
        pendenciaRepository.save(pendencia).block();

        // Get the pendencia
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, pendencia.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(pendencia.getId().intValue()))
            .jsonPath("$.nome")
            .value(is(DEFAULT_NOME))
            .jsonPath("$.status")
            .value(is(DEFAULT_STATUS.booleanValue()))
            .jsonPath("$.lidaEm")
            .value(is(DEFAULT_LIDA_EM.toString()))
            .jsonPath("$.link")
            .value(is(DEFAULT_LINK))
            .jsonPath("$.tipo")
            .value(is(DEFAULT_TIPO.toString()))
            .jsonPath("$.criadoEm")
            .value(is(DEFAULT_CRIADO_EM.toString()));
    }

    @Test
    void getNonExistingPendencia() {
        // Get the pendencia
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_PROBLEM_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingPendencia() throws Exception {
        // Initialize the database
        pendenciaRepository.save(pendencia).block();

        int databaseSizeBeforeUpdate = pendenciaRepository.findAll().collectList().block().size();

        // Update the pendencia
        Pendencia updatedPendencia = pendenciaRepository.findById(pendencia.getId()).block();
        updatedPendencia
            .nome(UPDATED_NOME)
            .status(UPDATED_STATUS)
            .lidaEm(UPDATED_LIDA_EM)
            .link(UPDATED_LINK)
            .tipo(UPDATED_TIPO)
            .criadoEm(UPDATED_CRIADO_EM);
        PendenciaDTO pendenciaDTO = pendenciaMapper.toDto(updatedPendencia);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, pendenciaDTO.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(pendenciaDTO))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Pendencia in the database
        List<Pendencia> pendenciaList = pendenciaRepository.findAll().collectList().block();
        assertThat(pendenciaList).hasSize(databaseSizeBeforeUpdate);
        Pendencia testPendencia = pendenciaList.get(pendenciaList.size() - 1);
        assertThat(testPendencia.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testPendencia.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testPendencia.getLidaEm()).isEqualTo(UPDATED_LIDA_EM);
        assertThat(testPendencia.getLink()).isEqualTo(UPDATED_LINK);
        assertThat(testPendencia.getTipo()).isEqualTo(UPDATED_TIPO);
        assertThat(testPendencia.getCriadoEm()).isEqualTo(UPDATED_CRIADO_EM);
    }

    @Test
    void putNonExistingPendencia() throws Exception {
        int databaseSizeBeforeUpdate = pendenciaRepository.findAll().collectList().block().size();
        pendencia.setId(count.incrementAndGet());

        // Create the Pendencia
        PendenciaDTO pendenciaDTO = pendenciaMapper.toDto(pendencia);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, pendenciaDTO.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(pendenciaDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Pendencia in the database
        List<Pendencia> pendenciaList = pendenciaRepository.findAll().collectList().block();
        assertThat(pendenciaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchPendencia() throws Exception {
        int databaseSizeBeforeUpdate = pendenciaRepository.findAll().collectList().block().size();
        pendencia.setId(count.incrementAndGet());

        // Create the Pendencia
        PendenciaDTO pendenciaDTO = pendenciaMapper.toDto(pendencia);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(pendenciaDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Pendencia in the database
        List<Pendencia> pendenciaList = pendenciaRepository.findAll().collectList().block();
        assertThat(pendenciaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamPendencia() throws Exception {
        int databaseSizeBeforeUpdate = pendenciaRepository.findAll().collectList().block().size();
        pendencia.setId(count.incrementAndGet());

        // Create the Pendencia
        PendenciaDTO pendenciaDTO = pendenciaMapper.toDto(pendencia);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(pendenciaDTO))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Pendencia in the database
        List<Pendencia> pendenciaList = pendenciaRepository.findAll().collectList().block();
        assertThat(pendenciaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdatePendenciaWithPatch() throws Exception {
        // Initialize the database
        pendenciaRepository.save(pendencia).block();

        int databaseSizeBeforeUpdate = pendenciaRepository.findAll().collectList().block().size();

        // Update the pendencia using partial update
        Pendencia partialUpdatedPendencia = new Pendencia();
        partialUpdatedPendencia.setId(pendencia.getId());

        partialUpdatedPendencia.nome(UPDATED_NOME).status(UPDATED_STATUS).link(UPDATED_LINK);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedPendencia.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedPendencia))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Pendencia in the database
        List<Pendencia> pendenciaList = pendenciaRepository.findAll().collectList().block();
        assertThat(pendenciaList).hasSize(databaseSizeBeforeUpdate);
        Pendencia testPendencia = pendenciaList.get(pendenciaList.size() - 1);
        assertThat(testPendencia.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testPendencia.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testPendencia.getLidaEm()).isEqualTo(DEFAULT_LIDA_EM);
        assertThat(testPendencia.getLink()).isEqualTo(UPDATED_LINK);
        assertThat(testPendencia.getTipo()).isEqualTo(DEFAULT_TIPO);
        assertThat(testPendencia.getCriadoEm()).isEqualTo(DEFAULT_CRIADO_EM);
    }

    @Test
    void fullUpdatePendenciaWithPatch() throws Exception {
        // Initialize the database
        pendenciaRepository.save(pendencia).block();

        int databaseSizeBeforeUpdate = pendenciaRepository.findAll().collectList().block().size();

        // Update the pendencia using partial update
        Pendencia partialUpdatedPendencia = new Pendencia();
        partialUpdatedPendencia.setId(pendencia.getId());

        partialUpdatedPendencia
            .nome(UPDATED_NOME)
            .status(UPDATED_STATUS)
            .lidaEm(UPDATED_LIDA_EM)
            .link(UPDATED_LINK)
            .tipo(UPDATED_TIPO)
            .criadoEm(UPDATED_CRIADO_EM);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedPendencia.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedPendencia))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Pendencia in the database
        List<Pendencia> pendenciaList = pendenciaRepository.findAll().collectList().block();
        assertThat(pendenciaList).hasSize(databaseSizeBeforeUpdate);
        Pendencia testPendencia = pendenciaList.get(pendenciaList.size() - 1);
        assertThat(testPendencia.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testPendencia.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testPendencia.getLidaEm()).isEqualTo(UPDATED_LIDA_EM);
        assertThat(testPendencia.getLink()).isEqualTo(UPDATED_LINK);
        assertThat(testPendencia.getTipo()).isEqualTo(UPDATED_TIPO);
        assertThat(testPendencia.getCriadoEm()).isEqualTo(UPDATED_CRIADO_EM);
    }

    @Test
    void patchNonExistingPendencia() throws Exception {
        int databaseSizeBeforeUpdate = pendenciaRepository.findAll().collectList().block().size();
        pendencia.setId(count.incrementAndGet());

        // Create the Pendencia
        PendenciaDTO pendenciaDTO = pendenciaMapper.toDto(pendencia);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, pendenciaDTO.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(pendenciaDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Pendencia in the database
        List<Pendencia> pendenciaList = pendenciaRepository.findAll().collectList().block();
        assertThat(pendenciaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchPendencia() throws Exception {
        int databaseSizeBeforeUpdate = pendenciaRepository.findAll().collectList().block().size();
        pendencia.setId(count.incrementAndGet());

        // Create the Pendencia
        PendenciaDTO pendenciaDTO = pendenciaMapper.toDto(pendencia);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(pendenciaDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Pendencia in the database
        List<Pendencia> pendenciaList = pendenciaRepository.findAll().collectList().block();
        assertThat(pendenciaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamPendencia() throws Exception {
        int databaseSizeBeforeUpdate = pendenciaRepository.findAll().collectList().block().size();
        pendencia.setId(count.incrementAndGet());

        // Create the Pendencia
        PendenciaDTO pendenciaDTO = pendenciaMapper.toDto(pendencia);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(pendenciaDTO))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Pendencia in the database
        List<Pendencia> pendenciaList = pendenciaRepository.findAll().collectList().block();
        assertThat(pendenciaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deletePendencia() {
        // Initialize the database
        pendenciaRepository.save(pendencia).block();

        int databaseSizeBeforeDelete = pendenciaRepository.findAll().collectList().block().size();

        // Delete the pendencia
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, pendencia.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Pendencia> pendenciaList = pendenciaRepository.findAll().collectList().block();
        assertThat(pendenciaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
