package com.tellescom.all4qms.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.*;

import com.tellescom.all4qms.IntegrationTest;
import com.tellescom.all4qms.domain.Processo;
import com.tellescom.all4qms.repository.EntityManager;
import com.tellescom.all4qms.repository.ProcessoRepository;
import com.tellescom.all4qms.service.ProcessoService;
import com.tellescom.all4qms.service.dto.ProcessoDTO;
import com.tellescom.all4qms.service.mapper.ProcessoMapper;
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
 * Integration tests for the {@link ProcessoResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class ProcessoResourceIT {

    private static final String DEFAULT_NUMERO = "AAAAAAAAAA";
    private static final String UPDATED_NUMERO = "BBBBBBBBBB";

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRICAO = "AAAAAAAAAA";
    private static final String UPDATED_DESCRICAO = "BBBBBBBBBB";

    private static final String DEFAULT_SETOR = "AAAAAAAAAA";
    private static final String UPDATED_SETOR = "BBBBBBBBBB";

    private static final String DEFAULT_RESPONSAVEL = "AAAAAAAAAA";
    private static final String UPDATED_RESPONSAVEL = "BBBBBBBBBB";

    private static final String DEFAULT_SETOR_RESPONSAVEL = "AAAAAAAAAA";
    private static final String UPDATED_SETOR_RESPONSAVEL = "BBBBBBBBBB";

    private static final Instant DEFAULT_CRIADO_EM = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CRIADO_EM = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_ATUALIZADO_EM = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_ATUALIZADO_EM = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/processos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ProcessoRepository processoRepository;

    @Mock
    private ProcessoRepository processoRepositoryMock;

    @Autowired
    private ProcessoMapper processoMapper;

    @Mock
    private ProcessoService processoServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Processo processo;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Processo createEntity(EntityManager em) {
        Processo processo = new Processo()
            .numero(DEFAULT_NUMERO)
            .nome(DEFAULT_NOME)
            .descricao(DEFAULT_DESCRICAO)
            .setor(DEFAULT_SETOR)
            .responsavel(DEFAULT_RESPONSAVEL)
            .setorResponsavel(DEFAULT_SETOR_RESPONSAVEL)
            .criadoEm(DEFAULT_CRIADO_EM)
            .atualizadoEm(DEFAULT_ATUALIZADO_EM);
        return processo;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Processo createUpdatedEntity(EntityManager em) {
        Processo processo = new Processo()
            .numero(UPDATED_NUMERO)
            .nome(UPDATED_NOME)
            .descricao(UPDATED_DESCRICAO)
            .setor(UPDATED_SETOR)
            .responsavel(UPDATED_RESPONSAVEL)
            .setorResponsavel(UPDATED_SETOR_RESPONSAVEL)
            .criadoEm(UPDATED_CRIADO_EM)
            .atualizadoEm(UPDATED_ATUALIZADO_EM);
        return processo;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(Processo.class).block();
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
        processo = createEntity(em);
    }

    @Test
    void createProcesso() throws Exception {
        int databaseSizeBeforeCreate = processoRepository.findAll().collectList().block().size();
        // Create the Processo
        ProcessoDTO processoDTO = processoMapper.toDto(processo);
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(processoDTO))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Processo in the database
        List<Processo> processoList = processoRepository.findAll().collectList().block();
        assertThat(processoList).hasSize(databaseSizeBeforeCreate + 1);
        Processo testProcesso = processoList.get(processoList.size() - 1);
        assertThat(testProcesso.getNumero()).isEqualTo(DEFAULT_NUMERO);
        assertThat(testProcesso.getNome()).isEqualTo(DEFAULT_NOME);
        assertThat(testProcesso.getDescricao()).isEqualTo(DEFAULT_DESCRICAO);
        assertThat(testProcesso.getSetor()).isEqualTo(DEFAULT_SETOR);
        assertThat(testProcesso.getResponsavel()).isEqualTo(DEFAULT_RESPONSAVEL);
        assertThat(testProcesso.getSetorResponsavel()).isEqualTo(DEFAULT_SETOR_RESPONSAVEL);
        assertThat(testProcesso.getCriadoEm()).isEqualTo(DEFAULT_CRIADO_EM);
        assertThat(testProcesso.getAtualizadoEm()).isEqualTo(DEFAULT_ATUALIZADO_EM);
    }

    @Test
    void createProcessoWithExistingId() throws Exception {
        // Create the Processo with an existing ID
        processo.setId(1L);
        ProcessoDTO processoDTO = processoMapper.toDto(processo);

        int databaseSizeBeforeCreate = processoRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(processoDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Processo in the database
        List<Processo> processoList = processoRepository.findAll().collectList().block();
        assertThat(processoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkNumeroIsRequired() throws Exception {
        int databaseSizeBeforeTest = processoRepository.findAll().collectList().block().size();
        // set the field null
        processo.setNumero(null);

        // Create the Processo, which fails.
        ProcessoDTO processoDTO = processoMapper.toDto(processo);

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(processoDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Processo> processoList = processoRepository.findAll().collectList().block();
        assertThat(processoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllProcessos() {
        // Initialize the database
        processoRepository.save(processo).block();

        // Get all the processoList
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
            .value(hasItem(processo.getId().intValue()))
            .jsonPath("$.[*].numero")
            .value(hasItem(DEFAULT_NUMERO))
            .jsonPath("$.[*].nome")
            .value(hasItem(DEFAULT_NOME))
            .jsonPath("$.[*].descricao")
            .value(hasItem(DEFAULT_DESCRICAO))
            .jsonPath("$.[*].setor")
            .value(hasItem(DEFAULT_SETOR))
            .jsonPath("$.[*].responsavel")
            .value(hasItem(DEFAULT_RESPONSAVEL))
            .jsonPath("$.[*].setorResponsavel")
            .value(hasItem(DEFAULT_SETOR_RESPONSAVEL))
            .jsonPath("$.[*].criadoEm")
            .value(hasItem(DEFAULT_CRIADO_EM.toString()))
            .jsonPath("$.[*].atualizadoEm")
            .value(hasItem(DEFAULT_ATUALIZADO_EM.toString()));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllProcessosWithEagerRelationshipsIsEnabled() {
        when(processoServiceMock.findAllWithEagerRelationships(any())).thenReturn(Flux.empty());

        webTestClient.get().uri(ENTITY_API_URL + "?eagerload=true").exchange().expectStatus().isOk();

        verify(processoServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllProcessosWithEagerRelationshipsIsNotEnabled() {
        when(processoServiceMock.findAllWithEagerRelationships(any())).thenReturn(Flux.empty());

        webTestClient.get().uri(ENTITY_API_URL + "?eagerload=false").exchange().expectStatus().isOk();
        verify(processoRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    void getProcesso() {
        // Initialize the database
        processoRepository.save(processo).block();

        // Get the processo
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, processo.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(processo.getId().intValue()))
            .jsonPath("$.numero")
            .value(is(DEFAULT_NUMERO))
            .jsonPath("$.nome")
            .value(is(DEFAULT_NOME))
            .jsonPath("$.descricao")
            .value(is(DEFAULT_DESCRICAO))
            .jsonPath("$.setor")
            .value(is(DEFAULT_SETOR))
            .jsonPath("$.responsavel")
            .value(is(DEFAULT_RESPONSAVEL))
            .jsonPath("$.setorResponsavel")
            .value(is(DEFAULT_SETOR_RESPONSAVEL))
            .jsonPath("$.criadoEm")
            .value(is(DEFAULT_CRIADO_EM.toString()))
            .jsonPath("$.atualizadoEm")
            .value(is(DEFAULT_ATUALIZADO_EM.toString()));
    }

    @Test
    void getNonExistingProcesso() {
        // Get the processo
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_PROBLEM_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingProcesso() throws Exception {
        // Initialize the database
        processoRepository.save(processo).block();

        int databaseSizeBeforeUpdate = processoRepository.findAll().collectList().block().size();

        // Update the processo
        Processo updatedProcesso = processoRepository.findById(processo.getId()).block();
        updatedProcesso
            .numero(UPDATED_NUMERO)
            .nome(UPDATED_NOME)
            .descricao(UPDATED_DESCRICAO)
            .setor(UPDATED_SETOR)
            .responsavel(UPDATED_RESPONSAVEL)
            .setorResponsavel(UPDATED_SETOR_RESPONSAVEL)
            .criadoEm(UPDATED_CRIADO_EM)
            .atualizadoEm(UPDATED_ATUALIZADO_EM);
        ProcessoDTO processoDTO = processoMapper.toDto(updatedProcesso);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, processoDTO.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(processoDTO))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Processo in the database
        List<Processo> processoList = processoRepository.findAll().collectList().block();
        assertThat(processoList).hasSize(databaseSizeBeforeUpdate);
        Processo testProcesso = processoList.get(processoList.size() - 1);
        assertThat(testProcesso.getNumero()).isEqualTo(UPDATED_NUMERO);
        assertThat(testProcesso.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testProcesso.getDescricao()).isEqualTo(UPDATED_DESCRICAO);
        assertThat(testProcesso.getSetor()).isEqualTo(UPDATED_SETOR);
        assertThat(testProcesso.getResponsavel()).isEqualTo(UPDATED_RESPONSAVEL);
        assertThat(testProcesso.getSetorResponsavel()).isEqualTo(UPDATED_SETOR_RESPONSAVEL);
        assertThat(testProcesso.getCriadoEm()).isEqualTo(UPDATED_CRIADO_EM);
        assertThat(testProcesso.getAtualizadoEm()).isEqualTo(UPDATED_ATUALIZADO_EM);
    }

    @Test
    void putNonExistingProcesso() throws Exception {
        int databaseSizeBeforeUpdate = processoRepository.findAll().collectList().block().size();
        processo.setId(count.incrementAndGet());

        // Create the Processo
        ProcessoDTO processoDTO = processoMapper.toDto(processo);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, processoDTO.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(processoDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Processo in the database
        List<Processo> processoList = processoRepository.findAll().collectList().block();
        assertThat(processoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchProcesso() throws Exception {
        int databaseSizeBeforeUpdate = processoRepository.findAll().collectList().block().size();
        processo.setId(count.incrementAndGet());

        // Create the Processo
        ProcessoDTO processoDTO = processoMapper.toDto(processo);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(processoDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Processo in the database
        List<Processo> processoList = processoRepository.findAll().collectList().block();
        assertThat(processoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamProcesso() throws Exception {
        int databaseSizeBeforeUpdate = processoRepository.findAll().collectList().block().size();
        processo.setId(count.incrementAndGet());

        // Create the Processo
        ProcessoDTO processoDTO = processoMapper.toDto(processo);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(processoDTO))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Processo in the database
        List<Processo> processoList = processoRepository.findAll().collectList().block();
        assertThat(processoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateProcessoWithPatch() throws Exception {
        // Initialize the database
        processoRepository.save(processo).block();

        int databaseSizeBeforeUpdate = processoRepository.findAll().collectList().block().size();

        // Update the processo using partial update
        Processo partialUpdatedProcesso = new Processo();
        partialUpdatedProcesso.setId(processo.getId());

        partialUpdatedProcesso
            .descricao(UPDATED_DESCRICAO)
            .setor(UPDATED_SETOR)
            .responsavel(UPDATED_RESPONSAVEL)
            .setorResponsavel(UPDATED_SETOR_RESPONSAVEL)
            .criadoEm(UPDATED_CRIADO_EM);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedProcesso.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedProcesso))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Processo in the database
        List<Processo> processoList = processoRepository.findAll().collectList().block();
        assertThat(processoList).hasSize(databaseSizeBeforeUpdate);
        Processo testProcesso = processoList.get(processoList.size() - 1);
        assertThat(testProcesso.getNumero()).isEqualTo(DEFAULT_NUMERO);
        assertThat(testProcesso.getNome()).isEqualTo(DEFAULT_NOME);
        assertThat(testProcesso.getDescricao()).isEqualTo(UPDATED_DESCRICAO);
        assertThat(testProcesso.getSetor()).isEqualTo(UPDATED_SETOR);
        assertThat(testProcesso.getResponsavel()).isEqualTo(UPDATED_RESPONSAVEL);
        assertThat(testProcesso.getSetorResponsavel()).isEqualTo(UPDATED_SETOR_RESPONSAVEL);
        assertThat(testProcesso.getCriadoEm()).isEqualTo(UPDATED_CRIADO_EM);
        assertThat(testProcesso.getAtualizadoEm()).isEqualTo(DEFAULT_ATUALIZADO_EM);
    }

    @Test
    void fullUpdateProcessoWithPatch() throws Exception {
        // Initialize the database
        processoRepository.save(processo).block();

        int databaseSizeBeforeUpdate = processoRepository.findAll().collectList().block().size();

        // Update the processo using partial update
        Processo partialUpdatedProcesso = new Processo();
        partialUpdatedProcesso.setId(processo.getId());

        partialUpdatedProcesso
            .numero(UPDATED_NUMERO)
            .nome(UPDATED_NOME)
            .descricao(UPDATED_DESCRICAO)
            .setor(UPDATED_SETOR)
            .responsavel(UPDATED_RESPONSAVEL)
            .setorResponsavel(UPDATED_SETOR_RESPONSAVEL)
            .criadoEm(UPDATED_CRIADO_EM)
            .atualizadoEm(UPDATED_ATUALIZADO_EM);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedProcesso.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedProcesso))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Processo in the database
        List<Processo> processoList = processoRepository.findAll().collectList().block();
        assertThat(processoList).hasSize(databaseSizeBeforeUpdate);
        Processo testProcesso = processoList.get(processoList.size() - 1);
        assertThat(testProcesso.getNumero()).isEqualTo(UPDATED_NUMERO);
        assertThat(testProcesso.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testProcesso.getDescricao()).isEqualTo(UPDATED_DESCRICAO);
        assertThat(testProcesso.getSetor()).isEqualTo(UPDATED_SETOR);
        assertThat(testProcesso.getResponsavel()).isEqualTo(UPDATED_RESPONSAVEL);
        assertThat(testProcesso.getSetorResponsavel()).isEqualTo(UPDATED_SETOR_RESPONSAVEL);
        assertThat(testProcesso.getCriadoEm()).isEqualTo(UPDATED_CRIADO_EM);
        assertThat(testProcesso.getAtualizadoEm()).isEqualTo(UPDATED_ATUALIZADO_EM);
    }

    @Test
    void patchNonExistingProcesso() throws Exception {
        int databaseSizeBeforeUpdate = processoRepository.findAll().collectList().block().size();
        processo.setId(count.incrementAndGet());

        // Create the Processo
        ProcessoDTO processoDTO = processoMapper.toDto(processo);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, processoDTO.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(processoDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Processo in the database
        List<Processo> processoList = processoRepository.findAll().collectList().block();
        assertThat(processoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchProcesso() throws Exception {
        int databaseSizeBeforeUpdate = processoRepository.findAll().collectList().block().size();
        processo.setId(count.incrementAndGet());

        // Create the Processo
        ProcessoDTO processoDTO = processoMapper.toDto(processo);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(processoDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Processo in the database
        List<Processo> processoList = processoRepository.findAll().collectList().block();
        assertThat(processoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamProcesso() throws Exception {
        int databaseSizeBeforeUpdate = processoRepository.findAll().collectList().block().size();
        processo.setId(count.incrementAndGet());

        // Create the Processo
        ProcessoDTO processoDTO = processoMapper.toDto(processo);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(processoDTO))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Processo in the database
        List<Processo> processoList = processoRepository.findAll().collectList().block();
        assertThat(processoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteProcesso() {
        // Initialize the database
        processoRepository.save(processo).block();

        int databaseSizeBeforeDelete = processoRepository.findAll().collectList().block().size();

        // Delete the processo
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, processo.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Processo> processoList = processoRepository.findAll().collectList().block();
        assertThat(processoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
