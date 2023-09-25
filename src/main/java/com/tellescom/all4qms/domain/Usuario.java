package com.tellescom.all4qms.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.validation.constraints.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

/**
 * A Usuario.
 */
@Table("usuario")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Usuario implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column("id")
    private Long id;

    @NotNull(message = "must not be null")
    @Column("nome")
    private String nome;

    @Column("email")
    private String email;

    @Column("is_gestor")
    private Boolean isGestor;

    @Column("criado_em")
    private Instant criadoEm;

    @Column("atualizado_em")
    private Instant atualizadoEm;

    @Transient
    private Funcao funcao;

    @Transient
    private Usuario gestor;

    @Transient
    private Setor setor;

    @Transient
    private User user;

    @Transient
    private Usuario criadoPor;

    @Transient
    private Usuario atualizadoPor;

    @Transient
    @JsonIgnoreProperties(value = { "criadoPor", "atualizadoPor", "usuarios" }, allowSetters = true)
    private Set<Processo> processos = new HashSet<>();

    @Column("funcao_id")
    private Long funcaoId;

    @Column("gestor_id")
    private Long gestorId;

    @Column("setor_id")
    private Long setorId;

    @Column("user_id")
    private Long userId;

    @Column("criado_por_id")
    private Long criadoPorId;

    @Column("atualizado_por_id")
    private Long atualizadoPorId;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Usuario id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return this.nome;
    }

    public Usuario nome(String nome) {
        this.setNome(nome);
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return this.email;
    }

    public Usuario email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Boolean getIsGestor() {
        return this.isGestor;
    }

    public Usuario isGestor(Boolean isGestor) {
        this.setIsGestor(isGestor);
        return this;
    }

    public void setIsGestor(Boolean isGestor) {
        this.isGestor = isGestor;
    }

    public Instant getCriadoEm() {
        return this.criadoEm;
    }

    public Usuario criadoEm(Instant criadoEm) {
        this.setCriadoEm(criadoEm);
        return this;
    }

    public void setCriadoEm(Instant criadoEm) {
        this.criadoEm = criadoEm;
    }

    public Instant getAtualizadoEm() {
        return this.atualizadoEm;
    }

    public Usuario atualizadoEm(Instant atualizadoEm) {
        this.setAtualizadoEm(atualizadoEm);
        return this;
    }

    public void setAtualizadoEm(Instant atualizadoEm) {
        this.atualizadoEm = atualizadoEm;
    }

    public Funcao getFuncao() {
        return this.funcao;
    }

    public void setFuncao(Funcao funcao) {
        this.funcao = funcao;
        this.funcaoId = funcao != null ? funcao.getId() : null;
    }

    public Usuario funcao(Funcao funcao) {
        this.setFuncao(funcao);
        return this;
    }

    public Usuario getGestor() {
        return this.gestor;
    }

    public void setGestor(Usuario usuario) {
        this.gestor = usuario;
        this.gestorId = usuario != null ? usuario.getId() : null;
    }

    public Usuario gestor(Usuario usuario) {
        this.setGestor(usuario);
        return this;
    }

    public Setor getSetor() {
        return this.setor;
    }

    public void setSetor(Setor setor) {
        this.setor = setor;
        this.setorId = setor != null ? setor.getId() : null;
    }

    public Usuario setor(Setor setor) {
        this.setSetor(setor);
        return this;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
        this.userId = user != null ? user.getId() : null;
    }

    public Usuario user(User user) {
        this.setUser(user);
        return this;
    }

    public Usuario getCriadoPor() {
        return this.criadoPor;
    }

    public void setCriadoPor(Usuario usuario) {
        this.criadoPor = usuario;
        this.criadoPorId = usuario != null ? usuario.getId() : null;
    }

    public Usuario criadoPor(Usuario usuario) {
        this.setCriadoPor(usuario);
        return this;
    }

    public Usuario getAtualizadoPor() {
        return this.atualizadoPor;
    }

    public void setAtualizadoPor(Usuario usuario) {
        this.atualizadoPor = usuario;
        this.atualizadoPorId = usuario != null ? usuario.getId() : null;
    }

    public Usuario atualizadoPor(Usuario usuario) {
        this.setAtualizadoPor(usuario);
        return this;
    }

    public Set<Processo> getProcessos() {
        return this.processos;
    }

    public void setProcessos(Set<Processo> processos) {
        this.processos = processos;
    }

    public Usuario processos(Set<Processo> processos) {
        this.setProcessos(processos);
        return this;
    }

    public Usuario addProcessos(Processo processo) {
        this.processos.add(processo);
        processo.getUsuarios().add(this);
        return this;
    }

    public Usuario removeProcessos(Processo processo) {
        this.processos.remove(processo);
        processo.getUsuarios().remove(this);
        return this;
    }

    public Long getFuncaoId() {
        return this.funcaoId;
    }

    public void setFuncaoId(Long funcao) {
        this.funcaoId = funcao;
    }

    public Long getGestorId() {
        return this.gestorId;
    }

    public void setGestorId(Long usuario) {
        this.gestorId = usuario;
    }

    public Long getSetorId() {
        return this.setorId;
    }

    public void setSetorId(Long setor) {
        this.setorId = setor;
    }

    public Long getUserId() {
        return this.userId;
    }

    public void setUserId(Long user) {
        this.userId = user;
    }

    public Long getCriadoPorId() {
        return this.criadoPorId;
    }

    public void setCriadoPorId(Long usuario) {
        this.criadoPorId = usuario;
    }

    public Long getAtualizadoPorId() {
        return this.atualizadoPorId;
    }

    public void setAtualizadoPorId(Long usuario) {
        this.atualizadoPorId = usuario;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Usuario)) {
            return false;
        }
        return id != null && id.equals(((Usuario) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Usuario{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            ", email='" + getEmail() + "'" +
            ", isGestor='" + getIsGestor() + "'" +
            ", criadoEm='" + getCriadoEm() + "'" +
            ", atualizadoEm='" + getAtualizadoEm() + "'" +
            "}";
    }
}
