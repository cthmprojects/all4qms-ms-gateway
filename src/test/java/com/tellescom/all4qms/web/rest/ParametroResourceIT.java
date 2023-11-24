package com.tellescom.all4qms.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;

import com.tellescom.all4qms.IntegrationTest;
import com.tellescom.all4qms.domain.Parametro;
import com.tellescom.all4qms.repository.EntityManager;
import com.tellescom.all4qms.repository.ParametroRepository;
import com.tellescom.all4qms.service.dto.ParametroDTO;
import com.tellescom.all4qms.service.mapper.ParametroMapper;
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
 * Integration tests for the {@link ParametroResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class ParametroResourceIT {

    private static final String DEFAULT_CHAVE = "AAAAAAAAAA";
    private static final String UPDATED_CHAVE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRICAO = "AAAAAAAAAA";
    private static final String UPDATED_DESCRICAO = "BBBBBBBBBB";

    private static final String DEFAULT_VALOR = "AAAAAAAAAA";
    private static final String UPDATED_VALOR = "BBBBBBBBBB";

    private static final Instant DEFAULT_ATUALIZADO_EM = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_ATUALIZADO_EM = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Long DEFAULT_ATUALIZADO_POR = 1L;
    private static final Long UPDATED_ATUALIZADO_POR = 2L;

    private static final String ENTITY_API_URL = "/api/parametros";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ParametroRepository parametroRepository;

    @Autowired
    private ParametroMapper parametroMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Parametro parametro;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Parametro createEntity(EntityManager em) {
        Parametro parametro = new Parametro()
            .chave(DEFAULT_CHAVE)
            .descricao(DEFAULT_DESCRICAO)
            .valor(DEFAULT_VALOR)
            .atualizadoEm(DEFAULT_ATUALIZADO_EM)
            .atualizadoPor(DEFAULT_ATUALIZADO_POR);
        return parametro;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Parametro createUpdatedEntity(EntityManager em) {
        Parametro parametro = new Parametro()
            .chave(UPDATED_CHAVE)
            .descricao(UPDATED_DESCRICAO)
            .valor(UPDATED_VALOR)
            .atualizadoEm(UPDATED_ATUALIZADO_EM)
            .atualizadoPor(UPDATED_ATUALIZADO_POR);
        return parametro;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(Parametro.class).block();
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
        parametro = createEntity(em);
    }

    @Test
    void createParametro() throws Exception {
        int databaseSizeBeforeCreate = parametroRepository.findAll().collectList().block().size();
        // Create the Parametro
        ParametroDTO parametroDTO = parametroMapper.toDto(parametro);
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(parametroDTO))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Parametro in the database
        List<Parametro> parametroList = parametroRepository.findAll().collectList().block();
        assertThat(parametroList).hasSize(databaseSizeBeforeCreate + 1);
        Parametro testParametro = parametroList.get(parametroList.size() - 1);
        assertThat(testParametro.getChave()).isEqualTo(DEFAULT_CHAVE);
        assertThat(testParametro.getDescricao()).isEqualTo(DEFAULT_DESCRICAO);
        assertThat(testParametro.getValor()).isEqualTo(DEFAULT_VALOR);
        assertThat(testParametro.getAtualizadoEm()).isEqualTo(DEFAULT_ATUALIZADO_EM);
        assertThat(testParametro.getAtualizadoPor()).isEqualTo(DEFAULT_ATUALIZADO_POR);
    }

    @Test
    void createParametroWithExistingId() throws Exception {
        // Create the Parametro with an existing ID
        parametro.setId(1L);
        ParametroDTO parametroDTO = parametroMapper.toDto(parametro);

        int databaseSizeBeforeCreate = parametroRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(parametroDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Parametro in the database
        List<Parametro> parametroList = parametroRepository.findAll().collectList().block();
        assertThat(parametroList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkChaveIsRequired() throws Exception {
        int databaseSizeBeforeTest = parametroRepository.findAll().collectList().block().size();
        // set the field null
        parametro.setChave(null);

        // Create the Parametro, which fails.
        ParametroDTO parametroDTO = parametroMapper.toDto(parametro);

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(parametroDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Parametro> parametroList = parametroRepository.findAll().collectList().block();
        assertThat(parametroList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllParametrosAsStream() {
        // Initialize the database
        parametroRepository.save(parametro).block();

        List<Parametro> parametroList = webTestClient
            .get()
            .uri(ENTITY_API_URL)
            .accept(MediaType.APPLICATION_NDJSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentTypeCompatibleWith(MediaType.APPLICATION_NDJSON)
            .returnResult(ParametroDTO.class)
            .getResponseBody()
            .map(parametroMapper::toEntity)
            .filter(parametro::equals)
            .collectList()
            .block(Duration.ofSeconds(5));

        assertThat(parametroList).isNotNull();
        assertThat(parametroList).hasSize(1);
        Parametro testParametro = parametroList.get(0);
        assertThat(testParametro.getChave()).isEqualTo(DEFAULT_CHAVE);
        assertThat(testParametro.getDescricao()).isEqualTo(DEFAULT_DESCRICAO);
        assertThat(testParametro.getValor()).isEqualTo(DEFAULT_VALOR);
        assertThat(testParametro.getAtualizadoEm()).isEqualTo(DEFAULT_ATUALIZADO_EM);
        assertThat(testParametro.getAtualizadoPor()).isEqualTo(DEFAULT_ATUALIZADO_POR);
    }

    @Test
    void getAllParametros() {
        // Initialize the database
        parametroRepository.save(parametro).block();

        // Get all the parametroList
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
            .value(hasItem(parametro.getId().intValue()))
            .jsonPath("$.[*].chave")
            .value(hasItem(DEFAULT_CHAVE))
            .jsonPath("$.[*].descricao")
            .value(hasItem(DEFAULT_DESCRICAO))
            .jsonPath("$.[*].valor")
            .value(hasItem(DEFAULT_VALOR))
            .jsonPath("$.[*].atualizadoEm")
            .value(hasItem(DEFAULT_ATUALIZADO_EM.toString()))
            .jsonPath("$.[*].atualizadoPor")
            .value(hasItem(DEFAULT_ATUALIZADO_POR.intValue()));
    }

    @Test
    void getParametro() {
        // Initialize the database
        parametroRepository.save(parametro).block();

        // Get the parametro
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, parametro.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(parametro.getId().intValue()))
            .jsonPath("$.chave")
            .value(is(DEFAULT_CHAVE))
            .jsonPath("$.descricao")
            .value(is(DEFAULT_DESCRICAO))
            .jsonPath("$.valor")
            .value(is(DEFAULT_VALOR))
            .jsonPath("$.atualizadoEm")
            .value(is(DEFAULT_ATUALIZADO_EM.toString()))
            .jsonPath("$.atualizadoPor")
            .value(is(DEFAULT_ATUALIZADO_POR.intValue()));
    }

    @Test
    void getNonExistingParametro() {
        // Get the parametro
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_PROBLEM_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingParametro() throws Exception {
        // Initialize the database
        parametroRepository.save(parametro).block();

        int databaseSizeBeforeUpdate = parametroRepository.findAll().collectList().block().size();

        // Update the parametro
        Parametro updatedParametro = parametroRepository.findById(parametro.getId()).block();
        updatedParametro
            .chave(UPDATED_CHAVE)
            .descricao(UPDATED_DESCRICAO)
            .valor(UPDATED_VALOR)
            .atualizadoEm(UPDATED_ATUALIZADO_EM)
            .atualizadoPor(UPDATED_ATUALIZADO_POR);
        ParametroDTO parametroDTO = parametroMapper.toDto(updatedParametro);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, parametroDTO.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(parametroDTO))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Parametro in the database
        List<Parametro> parametroList = parametroRepository.findAll().collectList().block();
        assertThat(parametroList).hasSize(databaseSizeBeforeUpdate);
        Parametro testParametro = parametroList.get(parametroList.size() - 1);
        assertThat(testParametro.getChave()).isEqualTo(UPDATED_CHAVE);
        assertThat(testParametro.getDescricao()).isEqualTo(UPDATED_DESCRICAO);
        assertThat(testParametro.getValor()).isEqualTo(UPDATED_VALOR);
        assertThat(testParametro.getAtualizadoEm()).isEqualTo(UPDATED_ATUALIZADO_EM);
        assertThat(testParametro.getAtualizadoPor()).isEqualTo(UPDATED_ATUALIZADO_POR);
    }

    @Test
    void putNonExistingParametro() throws Exception {
        int databaseSizeBeforeUpdate = parametroRepository.findAll().collectList().block().size();
        parametro.setId(count.incrementAndGet());

        // Create the Parametro
        ParametroDTO parametroDTO = parametroMapper.toDto(parametro);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, parametroDTO.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(parametroDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Parametro in the database
        List<Parametro> parametroList = parametroRepository.findAll().collectList().block();
        assertThat(parametroList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchParametro() throws Exception {
        int databaseSizeBeforeUpdate = parametroRepository.findAll().collectList().block().size();
        parametro.setId(count.incrementAndGet());

        // Create the Parametro
        ParametroDTO parametroDTO = parametroMapper.toDto(parametro);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(parametroDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Parametro in the database
        List<Parametro> parametroList = parametroRepository.findAll().collectList().block();
        assertThat(parametroList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamParametro() throws Exception {
        int databaseSizeBeforeUpdate = parametroRepository.findAll().collectList().block().size();
        parametro.setId(count.incrementAndGet());

        // Create the Parametro
        ParametroDTO parametroDTO = parametroMapper.toDto(parametro);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(parametroDTO))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Parametro in the database
        List<Parametro> parametroList = parametroRepository.findAll().collectList().block();
        assertThat(parametroList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateParametroWithPatch() throws Exception {
        // Initialize the database
        parametroRepository.save(parametro).block();

        int databaseSizeBeforeUpdate = parametroRepository.findAll().collectList().block().size();

        // Update the parametro using partial update
        Parametro partialUpdatedParametro = new Parametro();
        partialUpdatedParametro.setId(parametro.getId());

        partialUpdatedParametro.atualizadoEm(UPDATED_ATUALIZADO_EM);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedParametro.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedParametro))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Parametro in the database
        List<Parametro> parametroList = parametroRepository.findAll().collectList().block();
        assertThat(parametroList).hasSize(databaseSizeBeforeUpdate);
        Parametro testParametro = parametroList.get(parametroList.size() - 1);
        assertThat(testParametro.getChave()).isEqualTo(DEFAULT_CHAVE);
        assertThat(testParametro.getDescricao()).isEqualTo(DEFAULT_DESCRICAO);
        assertThat(testParametro.getValor()).isEqualTo(DEFAULT_VALOR);
        assertThat(testParametro.getAtualizadoEm()).isEqualTo(UPDATED_ATUALIZADO_EM);
        assertThat(testParametro.getAtualizadoPor()).isEqualTo(DEFAULT_ATUALIZADO_POR);
    }

    @Test
    void fullUpdateParametroWithPatch() throws Exception {
        // Initialize the database
        parametroRepository.save(parametro).block();

        int databaseSizeBeforeUpdate = parametroRepository.findAll().collectList().block().size();

        // Update the parametro using partial update
        Parametro partialUpdatedParametro = new Parametro();
        partialUpdatedParametro.setId(parametro.getId());

        partialUpdatedParametro
            .chave(UPDATED_CHAVE)
            .descricao(UPDATED_DESCRICAO)
            .valor(UPDATED_VALOR)
            .atualizadoEm(UPDATED_ATUALIZADO_EM)
            .atualizadoPor(UPDATED_ATUALIZADO_POR);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedParametro.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedParametro))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Parametro in the database
        List<Parametro> parametroList = parametroRepository.findAll().collectList().block();
        assertThat(parametroList).hasSize(databaseSizeBeforeUpdate);
        Parametro testParametro = parametroList.get(parametroList.size() - 1);
        assertThat(testParametro.getChave()).isEqualTo(UPDATED_CHAVE);
        assertThat(testParametro.getDescricao()).isEqualTo(UPDATED_DESCRICAO);
        assertThat(testParametro.getValor()).isEqualTo(UPDATED_VALOR);
        assertThat(testParametro.getAtualizadoEm()).isEqualTo(UPDATED_ATUALIZADO_EM);
        assertThat(testParametro.getAtualizadoPor()).isEqualTo(UPDATED_ATUALIZADO_POR);
    }

    @Test
    void patchNonExistingParametro() throws Exception {
        int databaseSizeBeforeUpdate = parametroRepository.findAll().collectList().block().size();
        parametro.setId(count.incrementAndGet());

        // Create the Parametro
        ParametroDTO parametroDTO = parametroMapper.toDto(parametro);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, parametroDTO.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(parametroDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Parametro in the database
        List<Parametro> parametroList = parametroRepository.findAll().collectList().block();
        assertThat(parametroList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchParametro() throws Exception {
        int databaseSizeBeforeUpdate = parametroRepository.findAll().collectList().block().size();
        parametro.setId(count.incrementAndGet());

        // Create the Parametro
        ParametroDTO parametroDTO = parametroMapper.toDto(parametro);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(parametroDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Parametro in the database
        List<Parametro> parametroList = parametroRepository.findAll().collectList().block();
        assertThat(parametroList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamParametro() throws Exception {
        int databaseSizeBeforeUpdate = parametroRepository.findAll().collectList().block().size();
        parametro.setId(count.incrementAndGet());

        // Create the Parametro
        ParametroDTO parametroDTO = parametroMapper.toDto(parametro);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(parametroDTO))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Parametro in the database
        List<Parametro> parametroList = parametroRepository.findAll().collectList().block();
        assertThat(parametroList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteParametro() {
        // Initialize the database
        parametroRepository.save(parametro).block();

        int databaseSizeBeforeDelete = parametroRepository.findAll().collectList().block().size();

        // Delete the parametro
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, parametro.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Parametro> parametroList = parametroRepository.findAll().collectList().block();
        assertThat(parametroList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
