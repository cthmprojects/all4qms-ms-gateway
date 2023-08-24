package com.tellescom.all4qms.web.rest;

import static com.tellescom.all4qms.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;

import com.tellescom.all4qms.IntegrationTest;
import com.tellescom.all4qms.domain.Anexo;
import com.tellescom.all4qms.repository.AnexoRepository;
import com.tellescom.all4qms.repository.EntityManager;
import com.tellescom.all4qms.service.dto.AnexoDTO;
import com.tellescom.all4qms.service.mapper.AnexoMapper;
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;

/**
 * Integration tests for the {@link AnexoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient(timeout = IntegrationTest.DEFAULT_ENTITY_TIMEOUT)
@WithMockUser
class AnexoResourceIT {

    private static final String DEFAULT_NOME_ARQUIVO = "AAAAAAAAAA";
    private static final String UPDATED_NOME_ARQUIVO = "BBBBBBBBBB";

    private static final String DEFAULT_NOME_ORIGINAL = "AAAAAAAAAA";
    private static final String UPDATED_NOME_ORIGINAL = "BBBBBBBBBB";

    private static final String DEFAULT_EXTENSAO = "AAAAAAAAAA";
    private static final String UPDATED_EXTENSAO = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CRIADO_EM = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CRIADO_EM = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);
    private static final ZonedDateTime SMALLER_CRIADO_EM = ZonedDateTime.ofInstant(Instant.ofEpochMilli(-1L), ZoneOffset.UTC);

    private static final ZonedDateTime DEFAULT_ATUALIZADO_EM = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_ATUALIZADO_EM = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);
    private static final ZonedDateTime SMALLER_ATUALIZADO_EM = ZonedDateTime.ofInstant(Instant.ofEpochMilli(-1L), ZoneOffset.UTC);

    private static final String ENTITY_API_URL = "/api/anexos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AnexoRepository anexoRepository;

    @Autowired
    private AnexoMapper anexoMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Anexo anexo;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Anexo createEntity(EntityManager em) {
        Anexo anexo = new Anexo()
            .nomeArquivo(DEFAULT_NOME_ARQUIVO)
            .nomeOriginal(DEFAULT_NOME_ORIGINAL)
            .extensao(DEFAULT_EXTENSAO)
            .criadoEm(DEFAULT_CRIADO_EM)
            .atualizadoEm(DEFAULT_ATUALIZADO_EM);
        return anexo;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Anexo createUpdatedEntity(EntityManager em) {
        Anexo anexo = new Anexo()
            .nomeArquivo(UPDATED_NOME_ARQUIVO)
            .nomeOriginal(UPDATED_NOME_ORIGINAL)
            .extensao(UPDATED_EXTENSAO)
            .criadoEm(UPDATED_CRIADO_EM)
            .atualizadoEm(UPDATED_ATUALIZADO_EM);
        return anexo;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(Anexo.class).block();
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
        anexo = createEntity(em);
    }

    @Test
    void createAnexo() throws Exception {
        int databaseSizeBeforeCreate = anexoRepository.findAll().collectList().block().size();
        // Create the Anexo
        AnexoDTO anexoDTO = anexoMapper.toDto(anexo);
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(anexoDTO))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Anexo in the database
        List<Anexo> anexoList = anexoRepository.findAll().collectList().block();
        assertThat(anexoList).hasSize(databaseSizeBeforeCreate + 1);
        Anexo testAnexo = anexoList.get(anexoList.size() - 1);
        assertThat(testAnexo.getNomeArquivo()).isEqualTo(DEFAULT_NOME_ARQUIVO);
        assertThat(testAnexo.getNomeOriginal()).isEqualTo(DEFAULT_NOME_ORIGINAL);
        assertThat(testAnexo.getExtensao()).isEqualTo(DEFAULT_EXTENSAO);
        assertThat(testAnexo.getCriadoEm()).isEqualTo(DEFAULT_CRIADO_EM);
        assertThat(testAnexo.getAtualizadoEm()).isEqualTo(DEFAULT_ATUALIZADO_EM);
    }

    @Test
    void createAnexoWithExistingId() throws Exception {
        // Create the Anexo with an existing ID
        anexo.setId(1L);
        AnexoDTO anexoDTO = anexoMapper.toDto(anexo);

        int databaseSizeBeforeCreate = anexoRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(anexoDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Anexo in the database
        List<Anexo> anexoList = anexoRepository.findAll().collectList().block();
        assertThat(anexoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllAnexos() {
        // Initialize the database
        anexoRepository.save(anexo).block();

        // Get all the anexoList
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
            .value(hasItem(anexo.getId().intValue()))
            .jsonPath("$.[*].nomeArquivo")
            .value(hasItem(DEFAULT_NOME_ARQUIVO))
            .jsonPath("$.[*].nomeOriginal")
            .value(hasItem(DEFAULT_NOME_ORIGINAL))
            .jsonPath("$.[*].extensao")
            .value(hasItem(DEFAULT_EXTENSAO))
            .jsonPath("$.[*].criadoEm")
            .value(hasItem(sameInstant(DEFAULT_CRIADO_EM)))
            .jsonPath("$.[*].atualizadoEm")
            .value(hasItem(sameInstant(DEFAULT_ATUALIZADO_EM)));
    }

    @Test
    void getAnexo() {
        // Initialize the database
        anexoRepository.save(anexo).block();

        // Get the anexo
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, anexo.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(anexo.getId().intValue()))
            .jsonPath("$.nomeArquivo")
            .value(is(DEFAULT_NOME_ARQUIVO))
            .jsonPath("$.nomeOriginal")
            .value(is(DEFAULT_NOME_ORIGINAL))
            .jsonPath("$.extensao")
            .value(is(DEFAULT_EXTENSAO))
            .jsonPath("$.criadoEm")
            .value(is(sameInstant(DEFAULT_CRIADO_EM)))
            .jsonPath("$.atualizadoEm")
            .value(is(sameInstant(DEFAULT_ATUALIZADO_EM)));
    }

    @Test
    void getAnexosByIdFiltering() {
        // Initialize the database
        anexoRepository.save(anexo).block();

        Long id = anexo.getId();

        defaultAnexoShouldBeFound("id.equals=" + id);
        defaultAnexoShouldNotBeFound("id.notEquals=" + id);

        defaultAnexoShouldBeFound("id.greaterThanOrEqual=" + id);
        defaultAnexoShouldNotBeFound("id.greaterThan=" + id);

        defaultAnexoShouldBeFound("id.lessThanOrEqual=" + id);
        defaultAnexoShouldNotBeFound("id.lessThan=" + id);
    }

    @Test
    void getAllAnexosByNomeArquivoIsEqualToSomething() {
        // Initialize the database
        anexoRepository.save(anexo).block();

        // Get all the anexoList where nomeArquivo equals to DEFAULT_NOME_ARQUIVO
        defaultAnexoShouldBeFound("nomeArquivo.equals=" + DEFAULT_NOME_ARQUIVO);

        // Get all the anexoList where nomeArquivo equals to UPDATED_NOME_ARQUIVO
        defaultAnexoShouldNotBeFound("nomeArquivo.equals=" + UPDATED_NOME_ARQUIVO);
    }

    @Test
    void getAllAnexosByNomeArquivoIsInShouldWork() {
        // Initialize the database
        anexoRepository.save(anexo).block();

        // Get all the anexoList where nomeArquivo in DEFAULT_NOME_ARQUIVO or UPDATED_NOME_ARQUIVO
        defaultAnexoShouldBeFound("nomeArquivo.in=" + DEFAULT_NOME_ARQUIVO + "," + UPDATED_NOME_ARQUIVO);

        // Get all the anexoList where nomeArquivo equals to UPDATED_NOME_ARQUIVO
        defaultAnexoShouldNotBeFound("nomeArquivo.in=" + UPDATED_NOME_ARQUIVO);
    }

    @Test
    void getAllAnexosByNomeArquivoIsNullOrNotNull() {
        // Initialize the database
        anexoRepository.save(anexo).block();

        // Get all the anexoList where nomeArquivo is not null
        defaultAnexoShouldBeFound("nomeArquivo.specified=true");

        // Get all the anexoList where nomeArquivo is null
        defaultAnexoShouldNotBeFound("nomeArquivo.specified=false");
    }

    @Test
    void getAllAnexosByNomeArquivoContainsSomething() {
        // Initialize the database
        anexoRepository.save(anexo).block();

        // Get all the anexoList where nomeArquivo contains DEFAULT_NOME_ARQUIVO
        defaultAnexoShouldBeFound("nomeArquivo.contains=" + DEFAULT_NOME_ARQUIVO);

        // Get all the anexoList where nomeArquivo contains UPDATED_NOME_ARQUIVO
        defaultAnexoShouldNotBeFound("nomeArquivo.contains=" + UPDATED_NOME_ARQUIVO);
    }

    @Test
    void getAllAnexosByNomeArquivoNotContainsSomething() {
        // Initialize the database
        anexoRepository.save(anexo).block();

        // Get all the anexoList where nomeArquivo does not contain DEFAULT_NOME_ARQUIVO
        defaultAnexoShouldNotBeFound("nomeArquivo.doesNotContain=" + DEFAULT_NOME_ARQUIVO);

        // Get all the anexoList where nomeArquivo does not contain UPDATED_NOME_ARQUIVO
        defaultAnexoShouldBeFound("nomeArquivo.doesNotContain=" + UPDATED_NOME_ARQUIVO);
    }

    @Test
    void getAllAnexosByNomeOriginalIsEqualToSomething() {
        // Initialize the database
        anexoRepository.save(anexo).block();

        // Get all the anexoList where nomeOriginal equals to DEFAULT_NOME_ORIGINAL
        defaultAnexoShouldBeFound("nomeOriginal.equals=" + DEFAULT_NOME_ORIGINAL);

        // Get all the anexoList where nomeOriginal equals to UPDATED_NOME_ORIGINAL
        defaultAnexoShouldNotBeFound("nomeOriginal.equals=" + UPDATED_NOME_ORIGINAL);
    }

    @Test
    void getAllAnexosByNomeOriginalIsInShouldWork() {
        // Initialize the database
        anexoRepository.save(anexo).block();

        // Get all the anexoList where nomeOriginal in DEFAULT_NOME_ORIGINAL or UPDATED_NOME_ORIGINAL
        defaultAnexoShouldBeFound("nomeOriginal.in=" + DEFAULT_NOME_ORIGINAL + "," + UPDATED_NOME_ORIGINAL);

        // Get all the anexoList where nomeOriginal equals to UPDATED_NOME_ORIGINAL
        defaultAnexoShouldNotBeFound("nomeOriginal.in=" + UPDATED_NOME_ORIGINAL);
    }

    @Test
    void getAllAnexosByNomeOriginalIsNullOrNotNull() {
        // Initialize the database
        anexoRepository.save(anexo).block();

        // Get all the anexoList where nomeOriginal is not null
        defaultAnexoShouldBeFound("nomeOriginal.specified=true");

        // Get all the anexoList where nomeOriginal is null
        defaultAnexoShouldNotBeFound("nomeOriginal.specified=false");
    }

    @Test
    void getAllAnexosByNomeOriginalContainsSomething() {
        // Initialize the database
        anexoRepository.save(anexo).block();

        // Get all the anexoList where nomeOriginal contains DEFAULT_NOME_ORIGINAL
        defaultAnexoShouldBeFound("nomeOriginal.contains=" + DEFAULT_NOME_ORIGINAL);

        // Get all the anexoList where nomeOriginal contains UPDATED_NOME_ORIGINAL
        defaultAnexoShouldNotBeFound("nomeOriginal.contains=" + UPDATED_NOME_ORIGINAL);
    }

    @Test
    void getAllAnexosByNomeOriginalNotContainsSomething() {
        // Initialize the database
        anexoRepository.save(anexo).block();

        // Get all the anexoList where nomeOriginal does not contain DEFAULT_NOME_ORIGINAL
        defaultAnexoShouldNotBeFound("nomeOriginal.doesNotContain=" + DEFAULT_NOME_ORIGINAL);

        // Get all the anexoList where nomeOriginal does not contain UPDATED_NOME_ORIGINAL
        defaultAnexoShouldBeFound("nomeOriginal.doesNotContain=" + UPDATED_NOME_ORIGINAL);
    }

    @Test
    void getAllAnexosByExtensaoIsEqualToSomething() {
        // Initialize the database
        anexoRepository.save(anexo).block();

        // Get all the anexoList where extensao equals to DEFAULT_EXTENSAO
        defaultAnexoShouldBeFound("extensao.equals=" + DEFAULT_EXTENSAO);

        // Get all the anexoList where extensao equals to UPDATED_EXTENSAO
        defaultAnexoShouldNotBeFound("extensao.equals=" + UPDATED_EXTENSAO);
    }

    @Test
    void getAllAnexosByExtensaoIsInShouldWork() {
        // Initialize the database
        anexoRepository.save(anexo).block();

        // Get all the anexoList where extensao in DEFAULT_EXTENSAO or UPDATED_EXTENSAO
        defaultAnexoShouldBeFound("extensao.in=" + DEFAULT_EXTENSAO + "," + UPDATED_EXTENSAO);

        // Get all the anexoList where extensao equals to UPDATED_EXTENSAO
        defaultAnexoShouldNotBeFound("extensao.in=" + UPDATED_EXTENSAO);
    }

    @Test
    void getAllAnexosByExtensaoIsNullOrNotNull() {
        // Initialize the database
        anexoRepository.save(anexo).block();

        // Get all the anexoList where extensao is not null
        defaultAnexoShouldBeFound("extensao.specified=true");

        // Get all the anexoList where extensao is null
        defaultAnexoShouldNotBeFound("extensao.specified=false");
    }

    @Test
    void getAllAnexosByExtensaoContainsSomething() {
        // Initialize the database
        anexoRepository.save(anexo).block();

        // Get all the anexoList where extensao contains DEFAULT_EXTENSAO
        defaultAnexoShouldBeFound("extensao.contains=" + DEFAULT_EXTENSAO);

        // Get all the anexoList where extensao contains UPDATED_EXTENSAO
        defaultAnexoShouldNotBeFound("extensao.contains=" + UPDATED_EXTENSAO);
    }

    @Test
    void getAllAnexosByExtensaoNotContainsSomething() {
        // Initialize the database
        anexoRepository.save(anexo).block();

        // Get all the anexoList where extensao does not contain DEFAULT_EXTENSAO
        defaultAnexoShouldNotBeFound("extensao.doesNotContain=" + DEFAULT_EXTENSAO);

        // Get all the anexoList where extensao does not contain UPDATED_EXTENSAO
        defaultAnexoShouldBeFound("extensao.doesNotContain=" + UPDATED_EXTENSAO);
    }

    @Test
    void getAllAnexosByCriadoEmIsEqualToSomething() {
        // Initialize the database
        anexoRepository.save(anexo).block();

        // Get all the anexoList where criadoEm equals to DEFAULT_CRIADO_EM
        defaultAnexoShouldBeFound("criadoEm.equals=" + DEFAULT_CRIADO_EM);

        // Get all the anexoList where criadoEm equals to UPDATED_CRIADO_EM
        defaultAnexoShouldNotBeFound("criadoEm.equals=" + UPDATED_CRIADO_EM);
    }

    @Test
    void getAllAnexosByCriadoEmIsInShouldWork() {
        // Initialize the database
        anexoRepository.save(anexo).block();

        // Get all the anexoList where criadoEm in DEFAULT_CRIADO_EM or UPDATED_CRIADO_EM
        defaultAnexoShouldBeFound("criadoEm.in=" + DEFAULT_CRIADO_EM + "," + UPDATED_CRIADO_EM);

        // Get all the anexoList where criadoEm equals to UPDATED_CRIADO_EM
        defaultAnexoShouldNotBeFound("criadoEm.in=" + UPDATED_CRIADO_EM);
    }

    @Test
    void getAllAnexosByCriadoEmIsNullOrNotNull() {
        // Initialize the database
        anexoRepository.save(anexo).block();

        // Get all the anexoList where criadoEm is not null
        defaultAnexoShouldBeFound("criadoEm.specified=true");

        // Get all the anexoList where criadoEm is null
        defaultAnexoShouldNotBeFound("criadoEm.specified=false");
    }

    @Test
    void getAllAnexosByCriadoEmIsGreaterThanOrEqualToSomething() {
        // Initialize the database
        anexoRepository.save(anexo).block();

        // Get all the anexoList where criadoEm is greater than or equal to DEFAULT_CRIADO_EM
        defaultAnexoShouldBeFound("criadoEm.greaterThanOrEqual=" + DEFAULT_CRIADO_EM);

        // Get all the anexoList where criadoEm is greater than or equal to UPDATED_CRIADO_EM
        defaultAnexoShouldNotBeFound("criadoEm.greaterThanOrEqual=" + UPDATED_CRIADO_EM);
    }

    @Test
    void getAllAnexosByCriadoEmIsLessThanOrEqualToSomething() {
        // Initialize the database
        anexoRepository.save(anexo).block();

        // Get all the anexoList where criadoEm is less than or equal to DEFAULT_CRIADO_EM
        defaultAnexoShouldBeFound("criadoEm.lessThanOrEqual=" + DEFAULT_CRIADO_EM);

        // Get all the anexoList where criadoEm is less than or equal to SMALLER_CRIADO_EM
        defaultAnexoShouldNotBeFound("criadoEm.lessThanOrEqual=" + SMALLER_CRIADO_EM);
    }

    @Test
    void getAllAnexosByCriadoEmIsLessThanSomething() {
        // Initialize the database
        anexoRepository.save(anexo).block();

        // Get all the anexoList where criadoEm is less than DEFAULT_CRIADO_EM
        defaultAnexoShouldNotBeFound("criadoEm.lessThan=" + DEFAULT_CRIADO_EM);

        // Get all the anexoList where criadoEm is less than UPDATED_CRIADO_EM
        defaultAnexoShouldBeFound("criadoEm.lessThan=" + UPDATED_CRIADO_EM);
    }

    @Test
    void getAllAnexosByCriadoEmIsGreaterThanSomething() {
        // Initialize the database
        anexoRepository.save(anexo).block();

        // Get all the anexoList where criadoEm is greater than DEFAULT_CRIADO_EM
        defaultAnexoShouldNotBeFound("criadoEm.greaterThan=" + DEFAULT_CRIADO_EM);

        // Get all the anexoList where criadoEm is greater than SMALLER_CRIADO_EM
        defaultAnexoShouldBeFound("criadoEm.greaterThan=" + SMALLER_CRIADO_EM);
    }

    @Test
    void getAllAnexosByAtualizadoEmIsEqualToSomething() {
        // Initialize the database
        anexoRepository.save(anexo).block();

        // Get all the anexoList where atualizadoEm equals to DEFAULT_ATUALIZADO_EM
        defaultAnexoShouldBeFound("atualizadoEm.equals=" + DEFAULT_ATUALIZADO_EM);

        // Get all the anexoList where atualizadoEm equals to UPDATED_ATUALIZADO_EM
        defaultAnexoShouldNotBeFound("atualizadoEm.equals=" + UPDATED_ATUALIZADO_EM);
    }

    @Test
    void getAllAnexosByAtualizadoEmIsInShouldWork() {
        // Initialize the database
        anexoRepository.save(anexo).block();

        // Get all the anexoList where atualizadoEm in DEFAULT_ATUALIZADO_EM or UPDATED_ATUALIZADO_EM
        defaultAnexoShouldBeFound("atualizadoEm.in=" + DEFAULT_ATUALIZADO_EM + "," + UPDATED_ATUALIZADO_EM);

        // Get all the anexoList where atualizadoEm equals to UPDATED_ATUALIZADO_EM
        defaultAnexoShouldNotBeFound("atualizadoEm.in=" + UPDATED_ATUALIZADO_EM);
    }

    @Test
    void getAllAnexosByAtualizadoEmIsNullOrNotNull() {
        // Initialize the database
        anexoRepository.save(anexo).block();

        // Get all the anexoList where atualizadoEm is not null
        defaultAnexoShouldBeFound("atualizadoEm.specified=true");

        // Get all the anexoList where atualizadoEm is null
        defaultAnexoShouldNotBeFound("atualizadoEm.specified=false");
    }

    @Test
    void getAllAnexosByAtualizadoEmIsGreaterThanOrEqualToSomething() {
        // Initialize the database
        anexoRepository.save(anexo).block();

        // Get all the anexoList where atualizadoEm is greater than or equal to DEFAULT_ATUALIZADO_EM
        defaultAnexoShouldBeFound("atualizadoEm.greaterThanOrEqual=" + DEFAULT_ATUALIZADO_EM);

        // Get all the anexoList where atualizadoEm is greater than or equal to UPDATED_ATUALIZADO_EM
        defaultAnexoShouldNotBeFound("atualizadoEm.greaterThanOrEqual=" + UPDATED_ATUALIZADO_EM);
    }

    @Test
    void getAllAnexosByAtualizadoEmIsLessThanOrEqualToSomething() {
        // Initialize the database
        anexoRepository.save(anexo).block();

        // Get all the anexoList where atualizadoEm is less than or equal to DEFAULT_ATUALIZADO_EM
        defaultAnexoShouldBeFound("atualizadoEm.lessThanOrEqual=" + DEFAULT_ATUALIZADO_EM);

        // Get all the anexoList where atualizadoEm is less than or equal to SMALLER_ATUALIZADO_EM
        defaultAnexoShouldNotBeFound("atualizadoEm.lessThanOrEqual=" + SMALLER_ATUALIZADO_EM);
    }

    @Test
    void getAllAnexosByAtualizadoEmIsLessThanSomething() {
        // Initialize the database
        anexoRepository.save(anexo).block();

        // Get all the anexoList where atualizadoEm is less than DEFAULT_ATUALIZADO_EM
        defaultAnexoShouldNotBeFound("atualizadoEm.lessThan=" + DEFAULT_ATUALIZADO_EM);

        // Get all the anexoList where atualizadoEm is less than UPDATED_ATUALIZADO_EM
        defaultAnexoShouldBeFound("atualizadoEm.lessThan=" + UPDATED_ATUALIZADO_EM);
    }

    @Test
    void getAllAnexosByAtualizadoEmIsGreaterThanSomething() {
        // Initialize the database
        anexoRepository.save(anexo).block();

        // Get all the anexoList where atualizadoEm is greater than DEFAULT_ATUALIZADO_EM
        defaultAnexoShouldNotBeFound("atualizadoEm.greaterThan=" + DEFAULT_ATUALIZADO_EM);

        // Get all the anexoList where atualizadoEm is greater than SMALLER_ATUALIZADO_EM
        defaultAnexoShouldBeFound("atualizadoEm.greaterThan=" + SMALLER_ATUALIZADO_EM);
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultAnexoShouldBeFound(String filter) {
        webTestClient
            .get()
            .uri(ENTITY_API_URL + "?sort=id,desc&" + filter)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.[*].id")
            .value(hasItem(anexo.getId().intValue()))
            .jsonPath("$.[*].nomeArquivo")
            .value(hasItem(DEFAULT_NOME_ARQUIVO))
            .jsonPath("$.[*].nomeOriginal")
            .value(hasItem(DEFAULT_NOME_ORIGINAL))
            .jsonPath("$.[*].extensao")
            .value(hasItem(DEFAULT_EXTENSAO))
            .jsonPath("$.[*].criadoEm")
            .value(hasItem(sameInstant(DEFAULT_CRIADO_EM)))
            .jsonPath("$.[*].atualizadoEm")
            .value(hasItem(sameInstant(DEFAULT_ATUALIZADO_EM)));

        // Check, that the count call also returns 1
        webTestClient
            .get()
            .uri(ENTITY_API_URL + "/count?sort=id,desc&" + filter)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$")
            .value(is(1));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultAnexoShouldNotBeFound(String filter) {
        webTestClient
            .get()
            .uri(ENTITY_API_URL + "?sort=id,desc&" + filter)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$")
            .isArray()
            .jsonPath("$")
            .isEmpty();

        // Check, that the count call also returns 0
        webTestClient
            .get()
            .uri(ENTITY_API_URL + "/count?sort=id,desc&" + filter)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$")
            .value(is(0));
    }

    @Test
    void getNonExistingAnexo() {
        // Get the anexo
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_PROBLEM_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putExistingAnexo() throws Exception {
        // Initialize the database
        anexoRepository.save(anexo).block();

        int databaseSizeBeforeUpdate = anexoRepository.findAll().collectList().block().size();

        // Update the anexo
        Anexo updatedAnexo = anexoRepository.findById(anexo.getId()).block();
        updatedAnexo
            .nomeArquivo(UPDATED_NOME_ARQUIVO)
            .nomeOriginal(UPDATED_NOME_ORIGINAL)
            .extensao(UPDATED_EXTENSAO)
            .criadoEm(UPDATED_CRIADO_EM)
            .atualizadoEm(UPDATED_ATUALIZADO_EM);
        AnexoDTO anexoDTO = anexoMapper.toDto(updatedAnexo);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, anexoDTO.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(anexoDTO))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Anexo in the database
        List<Anexo> anexoList = anexoRepository.findAll().collectList().block();
        assertThat(anexoList).hasSize(databaseSizeBeforeUpdate);
        Anexo testAnexo = anexoList.get(anexoList.size() - 1);
        assertThat(testAnexo.getNomeArquivo()).isEqualTo(UPDATED_NOME_ARQUIVO);
        assertThat(testAnexo.getNomeOriginal()).isEqualTo(UPDATED_NOME_ORIGINAL);
        assertThat(testAnexo.getExtensao()).isEqualTo(UPDATED_EXTENSAO);
        assertThat(testAnexo.getCriadoEm()).isEqualTo(UPDATED_CRIADO_EM);
        assertThat(testAnexo.getAtualizadoEm()).isEqualTo(UPDATED_ATUALIZADO_EM);
    }

    @Test
    void putNonExistingAnexo() throws Exception {
        int databaseSizeBeforeUpdate = anexoRepository.findAll().collectList().block().size();
        anexo.setId(count.incrementAndGet());

        // Create the Anexo
        AnexoDTO anexoDTO = anexoMapper.toDto(anexo);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, anexoDTO.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(anexoDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Anexo in the database
        List<Anexo> anexoList = anexoRepository.findAll().collectList().block();
        assertThat(anexoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchAnexo() throws Exception {
        int databaseSizeBeforeUpdate = anexoRepository.findAll().collectList().block().size();
        anexo.setId(count.incrementAndGet());

        // Create the Anexo
        AnexoDTO anexoDTO = anexoMapper.toDto(anexo);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(anexoDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Anexo in the database
        List<Anexo> anexoList = anexoRepository.findAll().collectList().block();
        assertThat(anexoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamAnexo() throws Exception {
        int databaseSizeBeforeUpdate = anexoRepository.findAll().collectList().block().size();
        anexo.setId(count.incrementAndGet());

        // Create the Anexo
        AnexoDTO anexoDTO = anexoMapper.toDto(anexo);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(anexoDTO))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Anexo in the database
        List<Anexo> anexoList = anexoRepository.findAll().collectList().block();
        assertThat(anexoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateAnexoWithPatch() throws Exception {
        // Initialize the database
        anexoRepository.save(anexo).block();

        int databaseSizeBeforeUpdate = anexoRepository.findAll().collectList().block().size();

        // Update the anexo using partial update
        Anexo partialUpdatedAnexo = new Anexo();
        partialUpdatedAnexo.setId(anexo.getId());

        partialUpdatedAnexo.nomeArquivo(UPDATED_NOME_ARQUIVO).extensao(UPDATED_EXTENSAO).criadoEm(UPDATED_CRIADO_EM);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedAnexo.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedAnexo))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Anexo in the database
        List<Anexo> anexoList = anexoRepository.findAll().collectList().block();
        assertThat(anexoList).hasSize(databaseSizeBeforeUpdate);
        Anexo testAnexo = anexoList.get(anexoList.size() - 1);
        assertThat(testAnexo.getNomeArquivo()).isEqualTo(UPDATED_NOME_ARQUIVO);
        assertThat(testAnexo.getNomeOriginal()).isEqualTo(DEFAULT_NOME_ORIGINAL);
        assertThat(testAnexo.getExtensao()).isEqualTo(UPDATED_EXTENSAO);
        assertThat(testAnexo.getCriadoEm()).isEqualTo(UPDATED_CRIADO_EM);
        assertThat(testAnexo.getAtualizadoEm()).isEqualTo(DEFAULT_ATUALIZADO_EM);
    }

    @Test
    void fullUpdateAnexoWithPatch() throws Exception {
        // Initialize the database
        anexoRepository.save(anexo).block();

        int databaseSizeBeforeUpdate = anexoRepository.findAll().collectList().block().size();

        // Update the anexo using partial update
        Anexo partialUpdatedAnexo = new Anexo();
        partialUpdatedAnexo.setId(anexo.getId());

        partialUpdatedAnexo
            .nomeArquivo(UPDATED_NOME_ARQUIVO)
            .nomeOriginal(UPDATED_NOME_ORIGINAL)
            .extensao(UPDATED_EXTENSAO)
            .criadoEm(UPDATED_CRIADO_EM)
            .atualizadoEm(UPDATED_ATUALIZADO_EM);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedAnexo.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedAnexo))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Anexo in the database
        List<Anexo> anexoList = anexoRepository.findAll().collectList().block();
        assertThat(anexoList).hasSize(databaseSizeBeforeUpdate);
        Anexo testAnexo = anexoList.get(anexoList.size() - 1);
        assertThat(testAnexo.getNomeArquivo()).isEqualTo(UPDATED_NOME_ARQUIVO);
        assertThat(testAnexo.getNomeOriginal()).isEqualTo(UPDATED_NOME_ORIGINAL);
        assertThat(testAnexo.getExtensao()).isEqualTo(UPDATED_EXTENSAO);
        assertThat(testAnexo.getCriadoEm()).isEqualTo(UPDATED_CRIADO_EM);
        assertThat(testAnexo.getAtualizadoEm()).isEqualTo(UPDATED_ATUALIZADO_EM);
    }

    @Test
    void patchNonExistingAnexo() throws Exception {
        int databaseSizeBeforeUpdate = anexoRepository.findAll().collectList().block().size();
        anexo.setId(count.incrementAndGet());

        // Create the Anexo
        AnexoDTO anexoDTO = anexoMapper.toDto(anexo);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, anexoDTO.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(anexoDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Anexo in the database
        List<Anexo> anexoList = anexoRepository.findAll().collectList().block();
        assertThat(anexoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchAnexo() throws Exception {
        int databaseSizeBeforeUpdate = anexoRepository.findAll().collectList().block().size();
        anexo.setId(count.incrementAndGet());

        // Create the Anexo
        AnexoDTO anexoDTO = anexoMapper.toDto(anexo);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(anexoDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Anexo in the database
        List<Anexo> anexoList = anexoRepository.findAll().collectList().block();
        assertThat(anexoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamAnexo() throws Exception {
        int databaseSizeBeforeUpdate = anexoRepository.findAll().collectList().block().size();
        anexo.setId(count.incrementAndGet());

        // Create the Anexo
        AnexoDTO anexoDTO = anexoMapper.toDto(anexo);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(anexoDTO))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Anexo in the database
        List<Anexo> anexoList = anexoRepository.findAll().collectList().block();
        assertThat(anexoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteAnexo() {
        // Initialize the database
        anexoRepository.save(anexo).block();

        int databaseSizeBeforeDelete = anexoRepository.findAll().collectList().block().size();

        // Delete the anexo
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, anexo.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Anexo> anexoList = anexoRepository.findAll().collectList().block();
        assertThat(anexoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
