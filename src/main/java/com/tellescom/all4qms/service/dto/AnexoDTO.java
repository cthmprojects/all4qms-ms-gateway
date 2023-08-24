package com.tellescom.all4qms.service.dto;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

/**
 * A DTO for the {@link com.tellescom.all4qms.domain.Anexo} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class AnexoDTO implements Serializable {

    private Long id;

    private String nomeArquivo;

    private String nomeOriginal;

    private String extensao;

    private ZonedDateTime criadoEm;

    private ZonedDateTime atualizadoEm;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomeArquivo() {
        return nomeArquivo;
    }

    public void setNomeArquivo(String nomeArquivo) {
        this.nomeArquivo = nomeArquivo;
    }

    public String getNomeOriginal() {
        return nomeOriginal;
    }

    public void setNomeOriginal(String nomeOriginal) {
        this.nomeOriginal = nomeOriginal;
    }

    public String getExtensao() {
        return extensao;
    }

    public void setExtensao(String extensao) {
        this.extensao = extensao;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AnexoDTO)) {
            return false;
        }

        AnexoDTO anexoDTO = (AnexoDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, anexoDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AnexoDTO{" +
            "id=" + getId() +
            ", nomeArquivo='" + getNomeArquivo() + "'" +
            ", nomeOriginal='" + getNomeOriginal() + "'" +
            ", extensao='" + getExtensao() + "'" +
            ", criadoEm='" + getCriadoEm() + "'" +
            ", atualizadoEm='" + getAtualizadoEm() + "'" +
            "}";
    }
}
