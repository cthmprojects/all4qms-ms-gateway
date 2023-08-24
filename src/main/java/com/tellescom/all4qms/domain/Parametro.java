package com.tellescom.all4qms.domain;

import java.io.Serializable;
import java.time.ZonedDateTime;
import org.springframework.data.annotation.Id;
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

    @Column("chave")
    private String chave;

    @Column("valor")
    private String valor;

    @Column("nome_amigavel")
    private String nomeAmigavel;

    @Column("atualizado_em")
    private ZonedDateTime atualizadoEm;

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

    public String getNomeAmigavel() {
        return this.nomeAmigavel;
    }

    public Parametro nomeAmigavel(String nomeAmigavel) {
        this.setNomeAmigavel(nomeAmigavel);
        return this;
    }

    public void setNomeAmigavel(String nomeAmigavel) {
        this.nomeAmigavel = nomeAmigavel;
    }

    public ZonedDateTime getAtualizadoEm() {
        return this.atualizadoEm;
    }

    public Parametro atualizadoEm(ZonedDateTime atualizadoEm) {
        this.setAtualizadoEm(atualizadoEm);
        return this;
    }

    public void setAtualizadoEm(ZonedDateTime atualizadoEm) {
        this.atualizadoEm = atualizadoEm;
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
            ", valor='" + getValor() + "'" +
            ", nomeAmigavel='" + getNomeAmigavel() + "'" +
            ", atualizadoEm='" + getAtualizadoEm() + "'" +
            "}";
    }
}
