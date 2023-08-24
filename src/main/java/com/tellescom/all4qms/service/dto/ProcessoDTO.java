package com.tellescom.all4qms.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

/**
 * A DTO for the {@link com.tellescom.all4qms.domain.Processo} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ProcessoDTO implements Serializable {

    private Long id;

    @NotNull(message = "must not be null")
    private String numero;

    private String nome;

    private String descricao;

    private String setor;

    private String responsavel;

    private String setorResponsavel;

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

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
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

    public String getSetor() {
        return setor;
    }

    public void setSetor(String setor) {
        this.setor = setor;
    }

    public String getResponsavel() {
        return responsavel;
    }

    public void setResponsavel(String responsavel) {
        this.responsavel = responsavel;
    }

    public String getSetorResponsavel() {
        return setorResponsavel;
    }

    public void setSetorResponsavel(String setorResponsavel) {
        this.setorResponsavel = setorResponsavel;
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
        if (!(o instanceof ProcessoDTO)) {
            return false;
        }

        ProcessoDTO processoDTO = (ProcessoDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, processoDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProcessoDTO{" +
            "id=" + getId() +
            ", numero='" + getNumero() + "'" +
            ", nome='" + getNome() + "'" +
            ", descricao='" + getDescricao() + "'" +
            ", setor='" + getSetor() + "'" +
            ", responsavel='" + getResponsavel() + "'" +
            ", setorResponsavel='" + getSetorResponsavel() + "'" +
            ", criadoEm='" + getCriadoEm() + "'" +
            ", atualizadoEm='" + getAtualizadoEm() + "'" +
            ", criadoPor=" + getCriadoPor() +
            ", atualizadoPor=" + getAtualizadoPor() +
            "}";
    }
}
