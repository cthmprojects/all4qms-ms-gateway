package com.tellescom.all4qms.domain.criteria;

import java.io.Serializable;
import java.util.Objects;
import org.springdoc.core.annotations.ParameterObject;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.*;

/**
 * Criteria class for the {@link com.tellescom.all4qms.domain.Anexo} entity. This class is used
 * in {@link com.tellescom.all4qms.web.rest.AnexoResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /anexos?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
@ParameterObject
@SuppressWarnings("common-java:DuplicatedBlocks")
public class AnexoCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter nomeArquivo;

    private StringFilter nomeOriginal;

    private StringFilter extensao;

    private ZonedDateTimeFilter criadoEm;

    private ZonedDateTimeFilter atualizadoEm;

    private Boolean distinct;

    public AnexoCriteria() {}

    public AnexoCriteria(AnexoCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.nomeArquivo = other.nomeArquivo == null ? null : other.nomeArquivo.copy();
        this.nomeOriginal = other.nomeOriginal == null ? null : other.nomeOriginal.copy();
        this.extensao = other.extensao == null ? null : other.extensao.copy();
        this.criadoEm = other.criadoEm == null ? null : other.criadoEm.copy();
        this.atualizadoEm = other.atualizadoEm == null ? null : other.atualizadoEm.copy();
        this.distinct = other.distinct;
    }

    @Override
    public AnexoCriteria copy() {
        return new AnexoCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public LongFilter id() {
        if (id == null) {
            id = new LongFilter();
        }
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public StringFilter getNomeArquivo() {
        return nomeArquivo;
    }

    public StringFilter nomeArquivo() {
        if (nomeArquivo == null) {
            nomeArquivo = new StringFilter();
        }
        return nomeArquivo;
    }

    public void setNomeArquivo(StringFilter nomeArquivo) {
        this.nomeArquivo = nomeArquivo;
    }

    public StringFilter getNomeOriginal() {
        return nomeOriginal;
    }

    public StringFilter nomeOriginal() {
        if (nomeOriginal == null) {
            nomeOriginal = new StringFilter();
        }
        return nomeOriginal;
    }

    public void setNomeOriginal(StringFilter nomeOriginal) {
        this.nomeOriginal = nomeOriginal;
    }

    public StringFilter getExtensao() {
        return extensao;
    }

    public StringFilter extensao() {
        if (extensao == null) {
            extensao = new StringFilter();
        }
        return extensao;
    }

    public void setExtensao(StringFilter extensao) {
        this.extensao = extensao;
    }

    public ZonedDateTimeFilter getCriadoEm() {
        return criadoEm;
    }

    public ZonedDateTimeFilter criadoEm() {
        if (criadoEm == null) {
            criadoEm = new ZonedDateTimeFilter();
        }
        return criadoEm;
    }

    public void setCriadoEm(ZonedDateTimeFilter criadoEm) {
        this.criadoEm = criadoEm;
    }

    public ZonedDateTimeFilter getAtualizadoEm() {
        return atualizadoEm;
    }

    public ZonedDateTimeFilter atualizadoEm() {
        if (atualizadoEm == null) {
            atualizadoEm = new ZonedDateTimeFilter();
        }
        return atualizadoEm;
    }

    public void setAtualizadoEm(ZonedDateTimeFilter atualizadoEm) {
        this.atualizadoEm = atualizadoEm;
    }

    public Boolean getDistinct() {
        return distinct;
    }

    public void setDistinct(Boolean distinct) {
        this.distinct = distinct;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final AnexoCriteria that = (AnexoCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(nomeArquivo, that.nomeArquivo) &&
            Objects.equals(nomeOriginal, that.nomeOriginal) &&
            Objects.equals(extensao, that.extensao) &&
            Objects.equals(criadoEm, that.criadoEm) &&
            Objects.equals(atualizadoEm, that.atualizadoEm) &&
            Objects.equals(distinct, that.distinct)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, nomeArquivo, nomeOriginal, extensao, criadoEm, atualizadoEm, distinct);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AnexoCriteria{" +
            (id != null ? "id=" + id + ", " : "") +
            (nomeArquivo != null ? "nomeArquivo=" + nomeArquivo + ", " : "") +
            (nomeOriginal != null ? "nomeOriginal=" + nomeOriginal + ", " : "") +
            (extensao != null ? "extensao=" + extensao + ", " : "") +
            (criadoEm != null ? "criadoEm=" + criadoEm + ", " : "") +
            (atualizadoEm != null ? "atualizadoEm=" + atualizadoEm + ", " : "") +
            (distinct != null ? "distinct=" + distinct + ", " : "") +
            "}";
    }
}
