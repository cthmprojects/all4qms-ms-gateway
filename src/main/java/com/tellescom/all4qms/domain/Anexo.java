package com.tellescom.all4qms.domain;

import java.io.Serializable;
import java.time.ZonedDateTime;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

/**
 * A Anexo.
 */
@Table("anexo")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Anexo implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column("id")
    private Long id;

    @Column("nome_arquivo")
    private String nomeArquivo;

    @Column("nome_original")
    private String nomeOriginal;

    @Column("extensao")
    private String extensao;

    @Column("criado_em")
    private ZonedDateTime criadoEm;

    @Column("atualizado_em")
    private ZonedDateTime atualizadoEm;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Anexo id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomeArquivo() {
        return this.nomeArquivo;
    }

    public Anexo nomeArquivo(String nomeArquivo) {
        this.setNomeArquivo(nomeArquivo);
        return this;
    }

    public void setNomeArquivo(String nomeArquivo) {
        this.nomeArquivo = nomeArquivo;
    }

    public String getNomeOriginal() {
        return this.nomeOriginal;
    }

    public Anexo nomeOriginal(String nomeOriginal) {
        this.setNomeOriginal(nomeOriginal);
        return this;
    }

    public void setNomeOriginal(String nomeOriginal) {
        this.nomeOriginal = nomeOriginal;
    }

    public String getExtensao() {
        return this.extensao;
    }

    public Anexo extensao(String extensao) {
        this.setExtensao(extensao);
        return this;
    }

    public void setExtensao(String extensao) {
        this.extensao = extensao;
    }

    public ZonedDateTime getCriadoEm() {
        return this.criadoEm;
    }

    public Anexo criadoEm(ZonedDateTime criadoEm) {
        this.setCriadoEm(criadoEm);
        return this;
    }

    public void setCriadoEm(ZonedDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }

    public ZonedDateTime getAtualizadoEm() {
        return this.atualizadoEm;
    }

    public Anexo atualizadoEm(ZonedDateTime atualizadoEm) {
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
        if (!(o instanceof Anexo)) {
            return false;
        }
        return id != null && id.equals(((Anexo) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Anexo{" +
            "id=" + getId() +
            ", nomeArquivo='" + getNomeArquivo() + "'" +
            ", nomeOriginal='" + getNomeOriginal() + "'" +
            ", extensao='" + getExtensao() + "'" +
            ", criadoEm='" + getCriadoEm() + "'" +
            ", atualizadoEm='" + getAtualizadoEm() + "'" +
            "}";
    }
}
