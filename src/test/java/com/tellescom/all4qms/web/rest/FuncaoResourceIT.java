package com.tellescom.all4qms.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.*;

import com.tellescom.all4qms.IntegrationTest;
import com.tellescom.all4qms.domain.Funcao;
import com.tellescom.all4qms.repository.EntityManager;
import com.tellescom.all4qms.repository.FuncaoRepository;
import com.tellescom.all4qms.service.FuncaoService;
import com.tellescom.all4qms.service.dto.FuncaoDTO;
import com.tellescom.all4qms.service.mapper.FuncaoMapper;
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
 * Integration tests for the {@link FuncaoResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class FuncaoResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRICAO = "AAAAAAAAAA";
    private static final String UPDATED_DESCRICAO = "BBBBBBBBBB";

    private static final Instant DEFAULT_CRIADO_EM = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CRIADO_EM = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_ATUALIZADO_EM = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_ATUALIZADO_EM = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/funcaos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FuncaoRepository funcaoRepository;

    @Mock
    private FuncaoRepository funcaoRepositoryMock;

    @Autowired
    private FuncaoMapper funcaoMapper;

    @Mock
    private FuncaoService funcaoServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Funcao funcao;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Funcao createEntity(EntityManager em) {
        Funcao funcao = new Funcao()
            .nome(DEFAULT_NOME)
            .descricao(DEFAULT_DESCRICAO)
            .criadoEm(DEFAULT_CRIADO_EM)
            .atualizadoEm(DEFAULT_ATUALIZADO_EM);
        return funcao;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Funcao createUpdatedEntity(EntityManager em) {
        Funcao funcao = new Funcao()
            .nome(UPDATED_NOME)
            .descricao(UPDATED_DESCRICAO)
            .criadoEm(UPDATED_CRIADO_EM)
            .atualizadoEm(UPDATED_ATUALIZADO_EM);
        return funcao;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(Funcao.class).block();
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
        funcao = createEntity(em);
    }

    @Test
    void createFuncao() throws Exception {
        int databaseSizeBeforeCreate = funcaoRepository.findAll().collectList().block().size();
        // Create the Funcao
        FuncaoDTO funcaoDTO = funcaoMapper.toDto(funcao);
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(funcaoDTO))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Funcao in the database
        List<Funcao> funcaoList = funcaoRepository.findAll().collectList().block();
        assertThat(funcaoList).hasSize(databaseSizeBeforeCreate + 1);
        Funcao testFuncao = funcaoList.get(funcaoList.size() - 1);
        assertThat(testFuncao.getNome()).isEqualTo(DEFAULT_NOME);
        assertThat(testFuncao.getDescricao()).isEqualTo(DEFAULT_DESCRICAO);
        assertThat(testFuncao.getCriadoEm()).isEqualTo(DEFAULT_CRIADO_EM);
        assertThat(testFuncao.getAtualizadoEm()).isEqualTo(DEFAULT_ATUALIZADO_EM);
    }

    @Test
    void createFuncaoWithExistingId() throws Exception {
        // Create the Funcao with an existing ID
        funcao.setId(1L);
        FuncaoDTO funcaoDTO = funcaoMapper.toDto(funcao);

        int databaseSizeBeforeCreate = funcaoRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(funcaoDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Funcao in the database
        List<Funcao> funcaoList = funcaoRepository.findAll().collectList().block();
        assertThat(funcaoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkNomeIsRequired() throws Exception {
        int databaseSizeBeforeTest = funcaoRepository.findAll().collectList().block().size();
        // set the field null
        funcao.setNome(null);

        // Create the Funcao, which fails.
        FuncaoDTO funcaoDTO = funcaoMapper.toDto(funcao);

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(funcaoDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Funcao> funcaoList = funcaoRepository.findAll().collectList().block();
        assertThat(funcaoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllFuncaos() {
        // Initialize the database
        funcaoRepository.save(funcao).block();

        // Get all the funcaoList
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
            .value(hasItem(funcao.getId().intValue()))
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
    void getAllFuncaosWithEagerRelationshipsIsEnabled() {
        when(funcaoServiceMock.findAllWithEagerRelationships(any())).thenReturn(Flux.empty());

        webTestClient.get().uri(ENTITY_API_URL + "?eagerload=true").exchange().expectStatus().isOk();

        verify(funcaoServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllFuncaosWithEagerRelationshipsIsNotEnabled() {
        when(funcaoServiceMock.findAllWithEagerRelationships(any())).thenReturn(Flux.empty());

        webTestClient.get().uri(ENTITY_API_URL + "?eagerload=false").exchange().expectStatus().isOk();
        verify(funcaoRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    void getFuncao() {
        // Initialize the database
        funcaoRepository.save(funcao).block();

        // Get the funcao
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, funcao.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(funcao.getId().intValue()))
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
    void getNonExistingFuncao() {
        // Get the funcao
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_PROBLEM_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingFuncao() throws Exception {
        // Initialize the database
        funcaoRepository.save(funcao).block();

        int databaseSizeBeforeUpdate = funcaoRepository.findAll().collectList().block().size();

        // Update the funcao
        Funcao updatedFuncao = funcaoRepository.findById(funcao.getId()).block();
        updatedFuncao.nome(UPDATED_NOME).descricao(UPDATED_DESCRICAO).criadoEm(UPDATED_CRIADO_EM).atualizadoEm(UPDATED_ATUALIZADO_EM);
        FuncaoDTO funcaoDTO = funcaoMapper.toDto(updatedFuncao);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, funcaoDTO.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(funcaoDTO))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Funcao in the database
        List<Funcao> funcaoList = funcaoRepository.findAll().collectList().block();
        assertThat(funcaoList).hasSize(databaseSizeBeforeUpdate);
        Funcao testFuncao = funcaoList.get(funcaoList.size() - 1);
        assertThat(testFuncao.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testFuncao.getDescricao()).isEqualTo(UPDATED_DESCRICAO);
        assertThat(testFuncao.getCriadoEm()).isEqualTo(UPDATED_CRIADO_EM);
        assertThat(testFuncao.getAtualizadoEm()).isEqualTo(UPDATED_ATUALIZADO_EM);
    }

    @Test
    void putNonExistingFuncao() throws Exception {
        int databaseSizeBeforeUpdate = funcaoRepository.findAll().collectList().block().size();
        funcao.setId(count.incrementAndGet());

        // Create the Funcao
        FuncaoDTO funcaoDTO = funcaoMapper.toDto(funcao);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, funcaoDTO.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(funcaoDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Funcao in the database
        List<Funcao> funcaoList = funcaoRepository.findAll().collectList().block();
        assertThat(funcaoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchFuncao() throws Exception {
        int databaseSizeBeforeUpdate = funcaoRepository.findAll().collectList().block().size();
        funcao.setId(count.incrementAndGet());

        // Create the Funcao
        FuncaoDTO funcaoDTO = funcaoMapper.toDto(funcao);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(funcaoDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Funcao in the database
        List<Funcao> funcaoList = funcaoRepository.findAll().collectList().block();
        assertThat(funcaoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamFuncao() throws Exception {
        int databaseSizeBeforeUpdate = funcaoRepository.findAll().collectList().block().size();
        funcao.setId(count.incrementAndGet());

        // Create the Funcao
        FuncaoDTO funcaoDTO = funcaoMapper.toDto(funcao);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(funcaoDTO))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Funcao in the database
        List<Funcao> funcaoList = funcaoRepository.findAll().collectList().block();
        assertThat(funcaoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateFuncaoWithPatch() throws Exception {
        // Initialize the database
        funcaoRepository.save(funcao).block();

        int databaseSizeBeforeUpdate = funcaoRepository.findAll().collectList().block().size();

        // Update the funcao using partial update
        Funcao partialUpdatedFuncao = new Funcao();
        partialUpdatedFuncao.setId(funcao.getId());

        partialUpdatedFuncao.atualizadoEm(UPDATED_ATUALIZADO_EM);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedFuncao.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedFuncao))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Funcao in the database
        List<Funcao> funcaoList = funcaoRepository.findAll().collectList().block();
        assertThat(funcaoList).hasSize(databaseSizeBeforeUpdate);
        Funcao testFuncao = funcaoList.get(funcaoList.size() - 1);
        assertThat(testFuncao.getNome()).isEqualTo(DEFAULT_NOME);
        assertThat(testFuncao.getDescricao()).isEqualTo(DEFAULT_DESCRICAO);
        assertThat(testFuncao.getCriadoEm()).isEqualTo(DEFAULT_CRIADO_EM);
        assertThat(testFuncao.getAtualizadoEm()).isEqualTo(UPDATED_ATUALIZADO_EM);
    }

    @Test
    void fullUpdateFuncaoWithPatch() throws Exception {
        // Initialize the database
        funcaoRepository.save(funcao).block();

        int databaseSizeBeforeUpdate = funcaoRepository.findAll().collectList().block().size();

        // Update the funcao using partial update
        Funcao partialUpdatedFuncao = new Funcao();
        partialUpdatedFuncao.setId(funcao.getId());

        partialUpdatedFuncao
            .nome(UPDATED_NOME)
            .descricao(UPDATED_DESCRICAO)
            .criadoEm(UPDATED_CRIADO_EM)
            .atualizadoEm(UPDATED_ATUALIZADO_EM);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedFuncao.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedFuncao))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Funcao in the database
        List<Funcao> funcaoList = funcaoRepository.findAll().collectList().block();
        assertThat(funcaoList).hasSize(databaseSizeBeforeUpdate);
        Funcao testFuncao = funcaoList.get(funcaoList.size() - 1);
        assertThat(testFuncao.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testFuncao.getDescricao()).isEqualTo(UPDATED_DESCRICAO);
        assertThat(testFuncao.getCriadoEm()).isEqualTo(UPDATED_CRIADO_EM);
        assertThat(testFuncao.getAtualizadoEm()).isEqualTo(UPDATED_ATUALIZADO_EM);
    }

    @Test
    void patchNonExistingFuncao() throws Exception {
        int databaseSizeBeforeUpdate = funcaoRepository.findAll().collectList().block().size();
        funcao.setId(count.incrementAndGet());

        // Create the Funcao
        FuncaoDTO funcaoDTO = funcaoMapper.toDto(funcao);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, funcaoDTO.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(funcaoDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Funcao in the database
        List<Funcao> funcaoList = funcaoRepository.findAll().collectList().block();
        assertThat(funcaoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchFuncao() throws Exception {
        int databaseSizeBeforeUpdate = funcaoRepository.findAll().collectList().block().size();
        funcao.setId(count.incrementAndGet());

        // Create the Funcao
        FuncaoDTO funcaoDTO = funcaoMapper.toDto(funcao);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(funcaoDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Funcao in the database
        List<Funcao> funcaoList = funcaoRepository.findAll().collectList().block();
        assertThat(funcaoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamFuncao() throws Exception {
        int databaseSizeBeforeUpdate = funcaoRepository.findAll().collectList().block().size();
        funcao.setId(count.incrementAndGet());

        // Create the Funcao
        FuncaoDTO funcaoDTO = funcaoMapper.toDto(funcao);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(funcaoDTO))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Funcao in the database
        List<Funcao> funcaoList = funcaoRepository.findAll().collectList().block();
        assertThat(funcaoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteFuncao() {
        // Initialize the database
        funcaoRepository.save(funcao).block();

        int databaseSizeBeforeDelete = funcaoRepository.findAll().collectList().block().size();

        // Delete the funcao
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, funcao.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Funcao> funcaoList = funcaoRepository.findAll().collectList().block();
        assertThat(funcaoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
