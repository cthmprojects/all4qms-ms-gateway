package com.tellescom.all4qms.domain;

import java.io.Serializable;
import java.time.Instant;
import javax.validation.constraints.NotNull;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

/**
 * A Parametros.
 */
@Table("parametros")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Parametros implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column("id")
    private Long id;

    @Column("chave")
    private String chave;

    @Column("valor_chave")
    private String valorChave;

    @Column("nome_amigavel")
    private String nomeAmigavel;

    @Column("descricao")
    private String descricao;

    @Column("atualizado_em")
    private Instant atualizadoEm;

    @NotNull(message = "must not be null")
    @Column("locked")
    private Boolean locked;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Parametros id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getChave() {
        return this.chave;
    }

    public Parametros chave(String chave) {
        this.setChave(chave);
        return this;
    }

    public void setChave(String chave) {
        this.chave = chave;
    }

    public String getValorChave() {
        return this.valorChave;
    }

    public Parametros valorChave(String valorChave) {
        this.setValorChave(valorChave);
        return this;
    }

    public void setValorChave(String valorChave) {
        this.valorChave = valorChave;
    }

    public String getNomeAmigavel() {
        return this.nomeAmigavel;
    }

    public Parametros nomeAmigavel(String nomeAmigavel) {
        this.setNomeAmigavel(nomeAmigavel);
        return this;
    }

    public void setNomeAmigavel(String nomeAmigavel) {
        this.nomeAmigavel = nomeAmigavel;
    }

    public String getDescricao() {
        return this.descricao;
    }

    public Parametros descricao(String descricao) {
        this.setDescricao(descricao);
        return this;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Instant getAtualizadoEm() {
        return this.atualizadoEm;
    }

    public Parametros atualizadoEm(Instant atualizadoEm) {
        this.setAtualizadoEm(atualizadoEm);
        return this;
    }

    public void setAtualizadoEm(Instant atualizadoEm) {
        this.atualizadoEm = atualizadoEm;
    }

    public Boolean getLocked() {
        return this.locked;
    }

    public Parametros locked(Boolean locked) {
        this.setLocked(locked);
        return this;
    }

    public void setLocked(Boolean locked) {
        this.locked = locked;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Parametros)) {
            return false;
        }
        return id != null && id.equals(((Parametros) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Parametros{" +
            "id=" + getId() +
            ", chave='" + getChave() + "'" +
            ", valorChave='" + getValorChave() + "'" +
            ", nomeAmigavel='" + getNomeAmigavel() + "'" +
            ", descricao='" + getDescricao() + "'" +
            ", atualizadoEm='" + getAtualizadoEm() + "'" +
            ", locked='" + getLocked() + "'" +
            "}";
    }
}
