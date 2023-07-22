package com.tellescom.all4qms.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.tellescom.all4qms.domain.enumeration.EnumTipoPend;
import java.io.Serializable;
import java.time.ZonedDateTime;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

/**
 * A Pendencia.
 */
@Table("pendencia")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Pendencia implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column("id")
    private Long id;

    @Column("nome")
    private String nome;

    @Column("status")
    private Boolean status;

    @Column("lida_em")
    private ZonedDateTime lidaEm;

    @Column("link")
    private String link;

    @Column("tipo")
    private EnumTipoPend tipo;

    @Column("criado_em")
    private ZonedDateTime criadoEm;

    @Transient
    private Usuario responsavel;

    @Transient
    private Usuario criadoPor;

    @Transient
    private Usuario atualizadoPor;

    @Column("responsavel_id")
    private Long responsavelId;

    @Column("criado_por_id")
    private Long criadoPorId;

    @Column("atualizado_por_id")
    private Long atualizadoPorId;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Pendencia id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return this.nome;
    }

    public Pendencia nome(String nome) {
        this.setNome(nome);
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Boolean getStatus() {
        return this.status;
    }

    public Pendencia status(Boolean status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public ZonedDateTime getLidaEm() {
        return this.lidaEm;
    }

    public Pendencia lidaEm(ZonedDateTime lidaEm) {
        this.setLidaEm(lidaEm);
        return this;
    }

    public void setLidaEm(ZonedDateTime lidaEm) {
        this.lidaEm = lidaEm;
    }

    public String getLink() {
        return this.link;
    }

    public Pendencia link(String link) {
        this.setLink(link);
        return this;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public EnumTipoPend getTipo() {
        return this.tipo;
    }

    public Pendencia tipo(EnumTipoPend tipo) {
        this.setTipo(tipo);
        return this;
    }

    public void setTipo(EnumTipoPend tipo) {
        this.tipo = tipo;
    }

    public ZonedDateTime getCriadoEm() {
        return this.criadoEm;
    }

    public Pendencia criadoEm(ZonedDateTime criadoEm) {
        this.setCriadoEm(criadoEm);
        return this;
    }

    public void setCriadoEm(ZonedDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }

    public Usuario getResponsavel() {
        return this.responsavel;
    }

    public void setResponsavel(Usuario usuario) {
        this.responsavel = usuario;
        this.responsavelId = usuario != null ? usuario.getId() : null;
    }

    public Pendencia responsavel(Usuario usuario) {
        this.setResponsavel(usuario);
        return this;
    }

    public Usuario getCriadoPor() {
        return this.criadoPor;
    }

    public void setCriadoPor(Usuario usuario) {
        this.criadoPor = usuario;
        this.criadoPorId = usuario != null ? usuario.getId() : null;
    }

    public Pendencia criadoPor(Usuario usuario) {
        this.setCriadoPor(usuario);
        return this;
    }

    public Usuario getAtualizadoPor() {
        return this.atualizadoPor;
    }

    public void setAtualizadoPor(Usuario usuario) {
        this.atualizadoPor = usuario;
        this.atualizadoPorId = usuario != null ? usuario.getId() : null;
    }

    public Pendencia atualizadoPor(Usuario usuario) {
        this.setAtualizadoPor(usuario);
        return this;
    }

    public Long getResponsavelId() {
        return this.responsavelId;
    }

    public void setResponsavelId(Long usuario) {
        this.responsavelId = usuario;
    }

    public Long getCriadoPorId() {
        return this.criadoPorId;
    }

    public void setCriadoPorId(Long usuario) {
        this.criadoPorId = usuario;
    }

    public Long getAtualizadoPorId() {
        return this.atualizadoPorId;
    }

    public void setAtualizadoPorId(Long usuario) {
        this.atualizadoPorId = usuario;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Pendencia)) {
            return false;
        }
        return id != null && id.equals(((Pendencia) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Pendencia{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            ", status='" + getStatus() + "'" +
            ", lidaEm='" + getLidaEm() + "'" +
            ", link='" + getLink() + "'" +
            ", tipo='" + getTipo() + "'" +
            ", criadoEm='" + getCriadoEm() + "'" +
            "}";
    }
}
