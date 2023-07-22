package com.tellescom.all4qms.service.dto;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link com.tellescom.all4qms.domain.Setor} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class SetorDTO implements Serializable {

    private Long id;

    @NotNull(message = "must not be null")
    private String nome;

    private String descricao;

    private ZonedDateTime criadoEm;

    private ZonedDateTime atualizadoEm;

    private UsuarioDTO criadoPor;

    private UsuarioDTO atualizadoPor;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public ZonedDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(ZonedDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }

    public ZonedDateTime getAtualizadoEm() {
        return atualizadoEm;
    }

    public void setAtualizadoEm(ZonedDateTime atualizadoEm) {
        this.atualizadoEm = atualizadoEm;
    }

    public UsuarioDTO getCriadoPor() {
        return criadoPor;
    }

    public void setCriadoPor(UsuarioDTO criadoPor) {
        this.criadoPor = criadoPor;
    }

    public UsuarioDTO getAtualizadoPor() {
        return atualizadoPor;
    }

    public void setAtualizadoPor(UsuarioDTO atualizadoPor) {
        this.atualizadoPor = atualizadoPor;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SetorDTO)) {
            return false;
        }

        SetorDTO setorDTO = (SetorDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, setorDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SetorDTO{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            ", descricao='" + getDescricao() + "'" +
            ", criadoEm='" + getCriadoEm() + "'" +
            ", atualizadoEm='" + getAtualizadoEm() + "'" +
            ", criadoPor=" + getCriadoPor() +
            ", atualizadoPor=" + getAtualizadoPor() +
            "}";
    }
}
