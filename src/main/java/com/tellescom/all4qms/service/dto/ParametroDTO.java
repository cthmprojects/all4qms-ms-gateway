package com.tellescom.all4qms.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

/**
 * A DTO for the {@link com.tellescom.all4qms.domain.Parametro} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ParametroDTO implements Serializable {

    private Long id;

    @NotNull(message = "must not be null")
    private String chave;

    private String valor;

    private String nomeAmigavel;

    private ZonedDateTime atualizadoEm;

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

    public String getValor() {
        return valor;
    }

    public void setValor(String valor) {
        this.valor = valor;
    }

    public String getNomeAmigavel() {
        return nomeAmigavel;
    }

    public void setNomeAmigavel(String nomeAmigavel) {
        this.nomeAmigavel = nomeAmigavel;
    }

    public ZonedDateTime getAtualizadoEm() {
        return atualizadoEm;
    }

    public void setAtualizadoEm(ZonedDateTime atualizadoEm) {
        this.atualizadoEm = atualizadoEm;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ParametroDTO)) {
            return false;
        }

        ParametroDTO parametroDTO = (ParametroDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, parametroDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ParametroDTO{" +
            "id=" + getId() +
            ", chave='" + getChave() + "'" +
            ", valor='" + getValor() + "'" +
            ", nomeAmigavel='" + getNomeAmigavel() + "'" +
            ", atualizadoEm='" + getAtualizadoEm() + "'" +
            "}";
    }
}
