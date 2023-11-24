package com.tellescom.all4qms.domain;

import java.io.Serializable;
import java.time.Instant;
import javax.validation.constraints.NotNull;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

/**
 * A Setor.
 */
@Table("setor")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Setor implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column("id")
    private Long id;

    @NotNull(message = "must not be null")
    @Column("nome")
    private String nome;

    @Column("descricao")
    private String descricao;

    @Column("criado_em")
    private Instant criadoEm;

    @Column("atualizado_em")
    private Instant atualizadoEm;

    @Transient
    private Usuario criadoPor;

    @Transient
    private Usuario atualizadoPor;

    @Transient
    private Usuario usuario;

    @Column("criado_por_id")
    private Long criadoPorId;

    @Column("atualizado_por_id")
    private Long atualizadoPorId;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Setor id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return this.nome;
    }

    public Setor nome(String nome) {
        this.setNome(nome);
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return this.descricao;
    }

    public Setor descricao(String descricao) {
        this.setDescricao(descricao);
        return this;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Instant getCriadoEm() {
        return this.criadoEm;
    }

    public Setor criadoEm(Instant criadoEm) {
        this.setCriadoEm(criadoEm);
        return this;
    }

    public void setCriadoEm(Instant criadoEm) {
        this.criadoEm = criadoEm;
    }

    public Instant getAtualizadoEm() {
        return this.atualizadoEm;
    }

    public Setor atualizadoEm(Instant atualizadoEm) {
        this.setAtualizadoEm(atualizadoEm);
        return this;
    }

    public void setAtualizadoEm(Instant atualizadoEm) {
        this.atualizadoEm = atualizadoEm;
    }

    public Usuario getCriadoPor() {
        return this.criadoPor;
    }

    public void setCriadoPor(Usuario usuario) {
        this.criadoPor = usuario;
        this.criadoPorId = usuario != null ? usuario.getId() : null;
    }

    public Setor criadoPor(Usuario usuario) {
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

    public Setor atualizadoPor(Usuario usuario) {
        this.setAtualizadoPor(usuario);
        return this;
    }

    public Usuario getUsuario() {
        return this.usuario;
    }

    public void setUsuario(Usuario usuario) {
        if (this.usuario != null) {
            this.usuario.setSetor(null);
        }
        if (usuario != null) {
            usuario.setSetor(this);
        }
        this.usuario = usuario;
    }

    public Setor usuario(Usuario usuario) {
        this.setUsuario(usuario);
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
        if (!(o instanceof Setor)) {
            return false;
        }
        return id != null && id.equals(((Setor) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Setor{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            ", descricao='" + getDescricao() + "'" +
            ", criadoEm='" + getCriadoEm() + "'" +
            ", atualizadoEm='" + getAtualizadoEm() + "'" +
            "}";
    }
}
