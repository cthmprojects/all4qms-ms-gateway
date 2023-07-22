package com.tellescom.all4qms.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.validation.constraints.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

/**
 * A Processo.
 */
@Table("processo")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Processo implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column("id")
    private Long id;

    @NotNull(message = "must not be null")
    @Column("numero")
    private String numero;

    @Column("nome")
    private String nome;

    @Column("descricao")
    private String descricao;

    @Column("setor")
    private String setor;

    @Column("responsavel")
    private String responsavel;

    @Column("setor_responsavel")
    private String setorResponsavel;

    @Column("criado_em")
    private ZonedDateTime criadoEm;

    @Column("atualizado_em")
    private ZonedDateTime atualizadoEm;

    @Transient
    private Usuario criadoPor;

    @Transient
    private Usuario atualizadoPor;

    @Transient
    @JsonIgnoreProperties(value = { "funcao", "gestor", "setor", "user", "criadoPor", "atualizadoPor", "processos" }, allowSetters = true)
    private Set<Usuario> usuarios = new HashSet<>();

    @Column("criado_por_id")
    private Long criadoPorId;

    @Column("atualizado_por_id")
    private Long atualizadoPorId;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Processo id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumero() {
        return this.numero;
    }

    public Processo numero(String numero) {
        this.setNumero(numero);
        return this;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getNome() {
        return this.nome;
    }

    public Processo nome(String nome) {
        this.setNome(nome);
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return this.descricao;
    }

    public Processo descricao(String descricao) {
        this.setDescricao(descricao);
        return this;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getSetor() {
        return this.setor;
    }

    public Processo setor(String setor) {
        this.setSetor(setor);
        return this;
    }

    public void setSetor(String setor) {
        this.setor = setor;
    }

    public String getResponsavel() {
        return this.responsavel;
    }

    public Processo responsavel(String responsavel) {
        this.setResponsavel(responsavel);
        return this;
    }

    public void setResponsavel(String responsavel) {
        this.responsavel = responsavel;
    }

    public String getSetorResponsavel() {
        return this.setorResponsavel;
    }

    public Processo setorResponsavel(String setorResponsavel) {
        this.setSetorResponsavel(setorResponsavel);
        return this;
    }

    public void setSetorResponsavel(String setorResponsavel) {
        this.setorResponsavel = setorResponsavel;
    }

    public ZonedDateTime getCriadoEm() {
        return this.criadoEm;
    }

    public Processo criadoEm(ZonedDateTime criadoEm) {
        this.setCriadoEm(criadoEm);
        return this;
    }

    public void setCriadoEm(ZonedDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }

    public ZonedDateTime getAtualizadoEm() {
        return this.atualizadoEm;
    }

    public Processo atualizadoEm(ZonedDateTime atualizadoEm) {
        this.setAtualizadoEm(atualizadoEm);
        return this;
    }

    public void setAtualizadoEm(ZonedDateTime atualizadoEm) {
        this.atualizadoEm = atualizadoEm;
    }

    public Usuario getCriadoPor() {
        return this.criadoPor;
    }

    public void setCriadoPor(Usuario usuario) {
        this.criadoPor = usuario;
        this.criadoPorId = usuario != null ? usuario.getId() : null;
    }

    public Processo criadoPor(Usuario usuario) {
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

    public Processo atualizadoPor(Usuario usuario) {
        this.setAtualizadoPor(usuario);
        return this;
    }

    public Set<Usuario> getUsuarios() {
        return this.usuarios;
    }

    public void setUsuarios(Set<Usuario> usuarios) {
        if (this.usuarios != null) {
            this.usuarios.forEach(i -> i.removeProcessos(this));
        }
        if (usuarios != null) {
            usuarios.forEach(i -> i.addProcessos(this));
        }
        this.usuarios = usuarios;
    }

    public Processo usuarios(Set<Usuario> usuarios) {
        this.setUsuarios(usuarios);
        return this;
    }

    public Processo addUsuario(Usuario usuario) {
        this.usuarios.add(usuario);
        usuario.getProcessos().add(this);
        return this;
    }

    public Processo removeUsuario(Usuario usuario) {
        this.usuarios.remove(usuario);
        usuario.getProcessos().remove(this);
        return this;
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
        if (!(o instanceof Processo)) {
            return false;
        }
        return id != null && id.equals(((Processo) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Processo{" +
            "id=" + getId() +
            ", numero='" + getNumero() + "'" +
            ", nome='" + getNome() + "'" +
            ", descricao='" + getDescricao() + "'" +
            ", setor='" + getSetor() + "'" +
            ", responsavel='" + getResponsavel() + "'" +
            ", setorResponsavel='" + getSetorResponsavel() + "'" +
            ", criadoEm='" + getCriadoEm() + "'" +
            ", atualizadoEm='" + getAtualizadoEm() + "'" +
            "}";
    }
}
