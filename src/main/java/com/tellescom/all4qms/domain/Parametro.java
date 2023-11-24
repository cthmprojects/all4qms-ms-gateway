package com.tellescom.all4qms.domain;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

/**
 * A Parametro.
 */
@Table("parametro")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Parametro implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column("id")
    private Long id;

    @NotNull(message = "must not be null")
    @Column("chave")
    private String chave;

    @Column("descricao")
    private String descricao;

    @Column("valor")
    private String valor;

    @Column("atualizado_em")
    private Instant atualizadoEm;

    @Column("atualizado_por")
    private Long atualizadoPor;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Parametro id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getChave() {
        return this.chave;
    }

    public Parametro chave(String chave) {
        this.setChave(chave);
        return this;
    }

    public void setChave(String chave) {
        this.chave = chave;
    }

    public String getDescricao() {
        return this.descricao;
    }

    public Parametro descricao(String descricao) {
        this.setDescricao(descricao);
        return this;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getValor() {
        return this.valor;
    }

    public Parametro valor(String valor) {
        this.setValor(valor);
        return this;
    }

    public void setValor(String valor) {
        this.valor = valor;
    }

    public Instant getAtualizadoEm() {
        return this.atualizadoEm;
    }

    public Parametro atualizadoEm(Instant atualizadoEm) {
        this.setAtualizadoEm(atualizadoEm);
        return this;
    }

    public void setAtualizadoEm(Instant atualizadoEm) {
        this.atualizadoEm = atualizadoEm;
    }

    public Long getAtualizadoPor() {
        return this.atualizadoPor;
    }

    public Parametro atualizadoPor(Long atualizadoPor) {
        this.setAtualizadoPor(atualizadoPor);
        return this;
    }

    public void setAtualizadoPor(Long atualizadoPor) {
        this.atualizadoPor = atualizadoPor;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Parametro)) {
            return false;
        }
        return id != null && id.equals(((Parametro) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Parametro{" +
            "id=" + getId() +
            ", chave='" + getChave() + "'" +
            ", descricao='" + getDescricao() + "'" +
            ", valor='" + getValor() + "'" +
            ", atualizadoEm='" + getAtualizadoEm() + "'" +
            ", atualizadoPor=" + getAtualizadoPor() +
            "}";
    }
}
