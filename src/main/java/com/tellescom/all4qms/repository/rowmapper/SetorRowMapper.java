package com.tellescom.all4qms.repository.rowmapper;

import com.tellescom.all4qms.domain.Setor;
import io.r2dbc.spi.Row;
import java.time.Instant;
import java.util.function.BiFunction;
import org.springframework.stereotype.Service;

/**
 * Converter between {@link Row} to {@link Setor}, with proper type conversions.
 */
@Service
public class SetorRowMapper implements BiFunction<Row, String, Setor> {

    private final ColumnConverter converter;

    public SetorRowMapper(ColumnConverter converter) {
        this.converter = converter;
    }

    /**
     * Take a {@link Row} and a column prefix, and extract all the fields.
     * @return the {@link Setor} stored in the database.
     */
    @Override
    public Setor apply(Row row, String prefix) {
        Setor entity = new Setor();
        entity.setId(converter.fromRow(row, prefix + "_id", Long.class));
        entity.setNome(converter.fromRow(row, prefix + "_nome", String.class));
        entity.setDescricao(converter.fromRow(row, prefix + "_descricao", String.class));
        entity.setCriadoEm(converter.fromRow(row, prefix + "_criado_em", Instant.class));
        entity.setAtualizadoEm(converter.fromRow(row, prefix + "_atualizado_em", Instant.class));
        entity.setCriadoPorId(converter.fromRow(row, prefix + "_criado_por_id", Long.class));
        entity.setAtualizadoPorId(converter.fromRow(row, prefix + "_atualizado_por_id", Long.class));
        return entity;
    }
}
