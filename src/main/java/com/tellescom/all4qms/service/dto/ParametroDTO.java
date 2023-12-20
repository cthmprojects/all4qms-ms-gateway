package com.tellescom.all4qms.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link com.tellescom.all4qms.domain.Parametro} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ParametroDTO implements Serializable {

    private Long id;

    @NotNull(message = "must not be null")
    private String chave;

    private String descricao;

    private String valor;

    private Instant atualizadoEm;

    private Long atualizadoPor;

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

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getValor() {
        return valor;
    }

    public void setValor(String valor) {
        this.valor = valor;
    }

    public Instant getAtualizadoEm() {
        return atualizadoEm;
    }

    public void setAtualizadoEm(Instant atualizadoEm) {
        this.atualizadoEm = atualizadoEm;
    }

    public Long getAtualizadoPor() {
        return atualizadoPor;
    }

    public void setAtualizadoPor(Long atualizadoPor) {
        this.atualizadoPor = atualizadoPor;
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
            ", descricao='" + getDescricao() + "'" +
            ", valor='" + getValor() + "'" +
            ", atualizadoEm='" + getAtualizadoEm() + "'" +
            ", atualizadoPor=" + getAtualizadoPor() +
            "}";
    }
}
