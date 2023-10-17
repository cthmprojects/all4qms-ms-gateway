package com.tellescom.all4qms.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;

import com.tellescom.all4qms.IntegrationTest;
import com.tellescom.all4qms.domain.Parametros;
import com.tellescom.all4qms.repository.EntityManager;
import com.tellescom.all4qms.repository.ParametrosRepository;
import com.tellescom.all4qms.service.dto.ParametrosDTO;
import com.tellescom.all4qms.service.mapper.ParametrosMapper;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link ParametrosResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class ParametrosResourceIT {

    private static final String DEFAULT_CHAVE = "AAAAAAAAAA";
    private static final String UPDATED_CHAVE = "BBBBBBBBBB";

    private static final String DEFAULT_VALOR_CHAVE = "AAAAAAAAAA";
    private static final String UPDATED_VALOR_CHAVE = "BBBBBBBBBB";

    private static final String DEFAULT_NOME_AMIGAVEL = "AAAAAAAAAA";
    private static final String UPDATED_NOME_AMIGAVEL = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRICAO = "AAAAAAAAAA";
    private static final String UPDATED_DESCRICAO = "BBBBBBBBBB";

    private static final Instant DEFAULT_ATUALIZADO_EM = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_ATUALIZADO_EM = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Boolean DEFAULT_LOCKED = false;
    private static final Boolean UPDATED_LOCKED = true;

    private static final String ENTITY_API_URL = "/api/parametros";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ParametrosRepository parametrosRepository;

    @Autowired
    private ParametrosMapper parametrosMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Parametros parametros;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Parametros createEntity(EntityManager em) {
        Parametros parametros = new Parametros()
            .chave(DEFAULT_CHAVE)
            .valorChave(DEFAULT_VALOR_CHAVE)
            .nomeAmigavel(DEFAULT_NOME_AMIGAVEL)
            .descricao(DEFAULT_DESCRICAO)
            .atualizadoEm(DEFAULT_ATUALIZADO_EM)
            .locked(DEFAULT_LOCKED);
        return parametros;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Parametros createUpdatedEntity(EntityManager em) {
        Parametros parametros = new Parametros()
            .chave(UPDATED_CHAVE)
            .valorChave(UPDATED_VALOR_CHAVE)
            .nomeAmigavel(UPDATED_NOME_AMIGAVEL)
            .descricao(UPDATED_DESCRICAO)
            .atualizadoEm(UPDATED_ATUALIZADO_EM)
            .locked(UPDATED_LOCKED);
        return parametros;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(Parametros.class).block();
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
        parametros = createEntity(em);
    }

    @Test
    void createParametros() throws Exception {
        int databaseSizeBeforeCreate = parametrosRepository.findAll().collectList().block().size();
        // Create the Parametros
        ParametrosDTO parametrosDTO = parametrosMapper.toDto(parametros);
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(parametrosDTO))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Parametros in the database
        List<Parametros> parametrosList = parametrosRepository.findAll().collectList().block();
        assertThat(parametrosList).hasSize(databaseSizeBeforeCreate + 1);
        Parametros testParametros = parametrosList.get(parametrosList.size() - 1);
        assertThat(testParametros.getChave()).isEqualTo(DEFAULT_CHAVE);
        assertThat(testParametros.getValorChave()).isEqualTo(DEFAULT_VALOR_CHAVE);
        assertThat(testParametros.getNomeAmigavel()).isEqualTo(DEFAULT_NOME_AMIGAVEL);
        assertThat(testParametros.getDescricao()).isEqualTo(DEFAULT_DESCRICAO);
        assertThat(testParametros.getAtualizadoEm()).isEqualTo(DEFAULT_ATUALIZADO_EM);
        assertThat(testParametros.getLocked()).isEqualTo(DEFAULT_LOCKED);
    }

    @Test
    void createParametrosWithExistingId() throws Exception {
        // Create the Parametros with an existing ID
        parametros.setId(1L);
        ParametrosDTO parametrosDTO = parametrosMapper.toDto(parametros);

        int databaseSizeBeforeCreate = parametrosRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(parametrosDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Parametros in the database
        List<Parametros> parametrosList = parametrosRepository.findAll().collectList().block();
        assertThat(parametrosList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkLockedIsRequired() throws Exception {
        int databaseSizeBeforeTest = parametrosRepository.findAll().collectList().block().size();
        // set the field null
        parametros.setLocked(null);

        // Create the Parametros, which fails.
        ParametrosDTO parametrosDTO = parametrosMapper.toDto(parametros);

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(parametrosDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Parametros> parametrosList = parametrosRepository.findAll().collectList().block();
        assertThat(parametrosList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllParametrosAsStream() {
        // Initialize the database
        parametrosRepository.save(parametros).block();

        List<Parametros> parametrosList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(ParametrosDTO.class)
            .getResponseBody()
            .map(parametrosMapper::toEntity)
            .filter(parametros::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(parametrosList).isNotNull();
        assertThat(parametrosList).hasSize(1);
        Parametros testParametros = parametrosList.get(0);
        assertThat(testParametros.getChave()).isEqualTo(DEFAULT_CHAVE);
        assertThat(testParametros.getValorChave()).isEqualTo(DEFAULT_VALOR_CHAVE);
        assertThat(testParametros.getNomeAmigavel()).isEqualTo(DEFAULT_NOME_AMIGAVEL);
        assertThat(testParametros.getDescricao()).isEqualTo(DEFAULT_DESCRICAO);
        assertThat(testParametros.getAtualizadoEm()).isEqualTo(DEFAULT_ATUALIZADO_EM);
        assertThat(testParametros.getLocked()).isEqualTo(DEFAULT_LOCKED);
    }

    @Test
    void getAllParametros() {
        // Initialize the database
        parametrosRepository.save(parametros).block();

        // Get all the parametrosList
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
            .value(hasItem(parametros.getId().intValue()))
            .jsonPath("$.[*].chave")
            .value(hasItem(DEFAULT_CHAVE))
            .jsonPath("$.[*].valorChave")
            .value(hasItem(DEFAULT_VALOR_CHAVE))
            .jsonPath("$.[*].nomeAmigavel")
            .value(hasItem(DEFAULT_NOME_AMIGAVEL))
            .jsonPath("$.[*].descricao")
            .value(hasItem(DEFAULT_DESCRICAO))
            .jsonPath("$.[*].atualizadoEm")
            .value(hasItem(DEFAULT_ATUALIZADO_EM.toString()))
            .jsonPath("$.[*].locked")
            .value(hasItem(DEFAULT_LOCKED.booleanValue()));
    }

    @Test
    void getParametros() {
        // Initialize the database
        parametrosRepository.save(parametros).block();

        // Get the parametros
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, parametros.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(parametros.getId().intValue()))
            .jsonPath("$.chave")
            .value(is(DEFAULT_CHAVE))
            .jsonPath("$.valorChave")
            .value(is(DEFAULT_VALOR_CHAVE))
            .jsonPath("$.nomeAmigavel")
            .value(is(DEFAULT_NOME_AMIGAVEL))
            .jsonPath("$.descricao")
            .value(is(DEFAULT_DESCRICAO))
            .jsonPath("$.atualizadoEm")
            .value(is(DEFAULT_ATUALIZADO_EM.toString()))
            .jsonPath("$.locked")
            .value(is(DEFAULT_LOCKED.booleanValue()));
    }

    @Test
    void getNonExistingParametros() {
        // Get the parametros
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_PROBLEM_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingParametros() throws Exception {
        // Initialize the database
        parametrosRepository.save(parametros).block();

        int databaseSizeBeforeUpdate = parametrosRepository.findAll().collectList().block().size();

        // Update the parametros
        Parametros updatedParametros = parametrosRepository.findById(parametros.getId()).block();
        updatedParametros
            .chave(UPDATED_CHAVE)
            .valorChave(UPDATED_VALOR_CHAVE)
            .nomeAmigavel(UPDATED_NOME_AMIGAVEL)
            .descricao(UPDATED_DESCRICAO)
            .atualizadoEm(UPDATED_ATUALIZADO_EM)
            .locked(UPDATED_LOCKED);
        ParametrosDTO parametrosDTO = parametrosMapper.toDto(updatedParametros);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, parametrosDTO.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(parametrosDTO))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Parametros in the database
        List<Parametros> parametrosList = parametrosRepository.findAll().collectList().block();
        assertThat(parametrosList).hasSize(databaseSizeBeforeUpdate);
        Parametros testParametros = parametrosList.get(parametrosList.size() - 1);
        assertThat(testParametros.getChave()).isEqualTo(UPDATED_CHAVE);
        assertThat(testParametros.getValorChave()).isEqualTo(UPDATED_VALOR_CHAVE);
        assertThat(testParametros.getNomeAmigavel()).isEqualTo(UPDATED_NOME_AMIGAVEL);
        assertThat(testParametros.getDescricao()).isEqualTo(UPDATED_DESCRICAO);
        assertThat(testParametros.getAtualizadoEm()).isEqualTo(UPDATED_ATUALIZADO_EM);
        assertThat(testParametros.getLocked()).isEqualTo(UPDATED_LOCKED);
    }

    @Test
    void putNonExistingParametros() throws Exception {
        int databaseSizeBeforeUpdate = parametrosRepository.findAll().collectList().block().size();
        parametros.setId(count.incrementAndGet());

        // Create the Parametros
        ParametrosDTO parametrosDTO = parametrosMapper.toDto(parametros);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, parametrosDTO.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(parametrosDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Parametros in the database
        List<Parametros> parametrosList = parametrosRepository.findAll().collectList().block();
        assertThat(parametrosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchParametros() throws Exception {
        int databaseSizeBeforeUpdate = parametrosRepository.findAll().collectList().block().size();
        parametros.setId(count.incrementAndGet());

        // Create the Parametros
        ParametrosDTO parametrosDTO = parametrosMapper.toDto(parametros);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(parametrosDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Parametros in the database
        List<Parametros> parametrosList = parametrosRepository.findAll().collectList().block();
        assertThat(parametrosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamParametros() throws Exception {
        int databaseSizeBeforeUpdate = parametrosRepository.findAll().collectList().block().size();
        parametros.setId(count.incrementAndGet());

        // Create the Parametros
        ParametrosDTO parametrosDTO = parametrosMapper.toDto(parametros);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(parametrosDTO))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Parametros in the database
        List<Parametros> parametrosList = parametrosRepository.findAll().collectList().block();
        assertThat(parametrosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateParametrosWithPatch() throws Exception {
        // Initialize the database
        parametrosRepository.save(parametros).block();

        int databaseSizeBeforeUpdate = parametrosRepository.findAll().collectList().block().size();

        // Update the parametros using partial update
        Parametros partialUpdatedParametros = new Parametros();
        partialUpdatedParametros.setId(parametros.getId());

        partialUpdatedParametros.nomeAmigavel(UPDATED_NOME_AMIGAVEL).atualizadoEm(UPDATED_ATUALIZADO_EM).locked(UPDATED_LOCKED);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedParametros.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedParametros))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Parametros in the database
        List<Parametros> parametrosList = parametrosRepository.findAll().collectList().block();
        assertThat(parametrosList).hasSize(databaseSizeBeforeUpdate);
        Parametros testParametros = parametrosList.get(parametrosList.size() - 1);
        assertThat(testParametros.getChave()).isEqualTo(DEFAULT_CHAVE);
        assertThat(testParametros.getValorChave()).isEqualTo(DEFAULT_VALOR_CHAVE);
        assertThat(testParametros.getNomeAmigavel()).isEqualTo(UPDATED_NOME_AMIGAVEL);
        assertThat(testParametros.getDescricao()).isEqualTo(DEFAULT_DESCRICAO);
        assertThat(testParametros.getAtualizadoEm()).isEqualTo(UPDATED_ATUALIZADO_EM);
        assertThat(testParametros.getLocked()).isEqualTo(UPDATED_LOCKED);
    }

    @Test
    void fullUpdateParametrosWithPatch() throws Exception {
        // Initialize the database
        parametrosRepository.save(parametros).block();

        int databaseSizeBeforeUpdate = parametrosRepository.findAll().collectList().block().size();

        // Update the parametros using partial update
        Parametros partialUpdatedParametros = new Parametros();
        partialUpdatedParametros.setId(parametros.getId());

        partialUpdatedParametros
            .chave(UPDATED_CHAVE)
            .valorChave(UPDATED_VALOR_CHAVE)
            .nomeAmigavel(UPDATED_NOME_AMIGAVEL)
            .descricao(UPDATED_DESCRICAO)
            .atualizadoEm(UPDATED_ATUALIZADO_EM)
            .locked(UPDATED_LOCKED);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedParametros.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedParametros))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Parametros in the database
        List<Parametros> parametrosList = parametrosRepository.findAll().collectList().block();
        assertThat(parametrosList).hasSize(databaseSizeBeforeUpdate);
        Parametros testParametros = parametrosList.get(parametrosList.size() - 1);
        assertThat(testParametros.getChave()).isEqualTo(UPDATED_CHAVE);
        assertThat(testParametros.getValorChave()).isEqualTo(UPDATED_VALOR_CHAVE);
        assertThat(testParametros.getNomeAmigavel()).isEqualTo(UPDATED_NOME_AMIGAVEL);
        assertThat(testParametros.getDescricao()).isEqualTo(UPDATED_DESCRICAO);
        assertThat(testParametros.getAtualizadoEm()).isEqualTo(UPDATED_ATUALIZADO_EM);
        assertThat(testParametros.getLocked()).isEqualTo(UPDATED_LOCKED);
    }

    @Test
    void patchNonExistingParametros() throws Exception {
        int databaseSizeBeforeUpdate = parametrosRepository.findAll().collectList().block().size();
        parametros.setId(count.incrementAndGet());

        // Create the Parametros
        ParametrosDTO parametrosDTO = parametrosMapper.toDto(parametros);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, parametrosDTO.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(parametrosDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Parametros in the database
        List<Parametros> parametrosList = parametrosRepository.findAll().collectList().block();
        assertThat(parametrosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchParametros() throws Exception {
        int databaseSizeBeforeUpdate = parametrosRepository.findAll().collectList().block().size();
        parametros.setId(count.incrementAndGet());

        // Create the Parametros
        ParametrosDTO parametrosDTO = parametrosMapper.toDto(parametros);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(parametrosDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Parametros in the database
        List<Parametros> parametrosList = parametrosRepository.findAll().collectList().block();
        assertThat(parametrosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamParametros() throws Exception {
        int databaseSizeBeforeUpdate = parametrosRepository.findAll().collectList().block().size();
        parametros.setId(count.incrementAndGet());

        // Create the Parametros
        ParametrosDTO parametrosDTO = parametrosMapper.toDto(parametros);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(parametrosDTO))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Parametros in the database
        List<Parametros> parametrosList = parametrosRepository.findAll().collectList().block();
        assertThat(parametrosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteParametros() {
        // Initialize the database
        parametrosRepository.save(parametros).block();

        int databaseSizeBeforeDelete = parametrosRepository.findAll().collectList().block().size();

        // Delete the parametros
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, parametros.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Parametros> parametrosList = parametrosRepository.findAll().collectList().block();
        assertThat(parametrosList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
