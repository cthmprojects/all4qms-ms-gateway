package com.tellescom.all4qms.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link com.tellescom.all4qms.domain.Parametros} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ParametrosDTO implements Serializable {

    private Long id;

    private String chave;

    private String valorChave;

    private String nomeAmigavel;

    private String descricao;

    private Instant atualizadoEm;

    @NotNull(message = "must not be null")
    private Boolean locked;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getChave() {
        return chave;
    }

    public void setChave(String chave) {
        this.chave = chave;
    }

    public String getValorChave() {
        return valorChave;
    }

    public void setValorChave(String valorChave) {
        this.valorChave = valorChave;
    }

    public String getNomeAmigavel() {
        return nomeAmigavel;
    }

    public void setNomeAmigavel(String nomeAmigavel) {
        this.nomeAmigavel = nomeAmigavel;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Instant getAtualizadoEm() {
        return atualizadoEm;
    }

    public void setAtualizadoEm(Instant atualizadoEm) {
        this.atualizadoEm = atualizadoEm;
    }

    public Boolean getLocked() {
        return locked;
    }

    public void setLocked(Boolean locked) {
        this.locked = locked;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ParametrosDTO)) {
            return false;
        }

        ParametrosDTO parametrosDTO = (ParametrosDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, parametrosDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ParametrosDTO{" +
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
