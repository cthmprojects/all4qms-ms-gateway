package com.tellescom.all4qms.repository.rowmapper;

import com.tellescom.all4qms.domain.Pendencia;
import com.tellescom.all4qms.domain.enumeration.EnumTipoPend;
import io.r2dbc.spi.Row;
import java.time.Instant;
import java.util.function.BiFunction;
import org.springframework.stereotype.Service;

/**
 * Converter between {@link Row} to {@link Pendencia}, with proper type conversions.
 */
@Service
public class PendenciaRowMapper implements BiFunction<Row, String, Pendencia> {

    private final ColumnConverter converter;

    public PendenciaRowMapper(ColumnConverter converter) {
        this.converter = converter;
    }

    /**
     * Take a {@link Row} and a column prefix, and extract all the fields.
     * @return the {@link Pendencia} stored in the database.
     */
    @Override
    public Pendencia apply(Row row, String prefix) {
        Pendencia entity = new Pendencia();
        entity.setId(converter.fromRow(row, prefix + "_id", Long.class));
        entity.setNome(converter.fromRow(row, prefix + "_nome", String.class));
        entity.setStatus(converter.fromRow(row, prefix + "_status", Boolean.class));
        entity.setLidaEm(converter.fromRow(row, prefix + "_lida_em", Instant.class));
        entity.setLink(converter.fromRow(row, prefix + "_link", String.class));
        entity.setTipo(converter.fromRow(row, prefix + "_tipo", EnumTipoPend.class));
        entity.setCriadoEm(converter.fromRow(row, prefix + "_criado_em", Instant.class));
        entity.setResponsavelId(converter.fromRow(row, prefix + "_responsavel_id", Long.class));
        entity.setCriadoPorId(converter.fromRow(row, prefix + "_criado_por_id", Long.class));
        entity.setAtualizadoPorId(converter.fromRow(row, prefix + "_atualizado_por_id", Long.class));
        return entity;
    }
}
