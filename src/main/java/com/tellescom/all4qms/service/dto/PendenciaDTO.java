package com.tellescom.all4qms.service.dto;

import com.tellescom.all4qms.domain.enumeration.EnumTipoPend;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link com.tellescom.all4qms.domain.Pendencia} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class PendenciaDTO implements Serializable {

    private Long id;

    private String nome;

    private Boolean status;

    private Instant lidaEm;

    private String link;

    private EnumTipoPend tipo;

    private Instant criadoEm;

    private UsuarioDTO responsavel;

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

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public Instant getLidaEm() {
        return lidaEm;
    }

    public void setLidaEm(Instant lidaEm) {
        this.lidaEm = lidaEm;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public EnumTipoPend getTipo() {
        return tipo;
    }

    public void setTipo(EnumTipoPend tipo) {
        this.tipo = tipo;
    }

    public Instant getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(Instant criadoEm) {
        this.criadoEm = criadoEm;
    }

    public UsuarioDTO getResponsavel() {
        return responsavel;
    }

    public void setResponsavel(UsuarioDTO responsavel) {
        this.responsavel = responsavel;
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
        if (!(o instanceof PendenciaDTO)) {
            return false;
        }

        PendenciaDTO pendenciaDTO = (PendenciaDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, pendenciaDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PendenciaDTO{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            ", status='" + getStatus() + "'" +
            ", lidaEm='" + getLidaEm() + "'" +
            ", link='" + getLink() + "'" +
            ", tipo='" + getTipo() + "'" +
            ", criadoEm='" + getCriadoEm() + "'" +
            ", responsavel=" + getResponsavel() +
            ", criadoPor=" + getCriadoPor() +
            ", atualizadoPor=" + getAtualizadoPor() +
            "}";
    }
}
