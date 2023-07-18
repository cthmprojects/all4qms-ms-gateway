package com.tellescom.all4qms.repository.rowmapper;

import com.tellescom.all4qms.domain.Funcao;
import io.r2dbc.spi.Row;
import java.time.ZonedDateTime;
import java.util.function.BiFunction;
import org.springframework.stereotype.Service;

/**
 * Converter between {@link Row} to {@link Funcao}, with proper type conversions.
 */
@Service
public class FuncaoRowMapper implements BiFunction<Row, String, Funcao> {

    private final ColumnConverter converter;

    public FuncaoRowMapper(ColumnConverter converter) {
        this.converter = converter;
    }

    /**
     * Take a {@link Row} and a column prefix, and extract all the fields.
     * @return the {@link Funcao} stored in the database.
     */
    @Override
    public Funcao apply(Row row, String prefix) {
        Funcao entity = new Funcao();
        entity.setId(converter.fromRow(row, prefix + "_id", Long.class));
        entity.setNome(converter.fromRow(row, prefix + "_nome", String.class));
        entity.setDescricao(converter.fromRow(row, prefix + "_descricao", String.class));
        entity.setCriadoEm(converter.fromRow(row, prefix + "_criado_em", ZonedDateTime.class));
        entity.setAtualizadoEm(converter.fromRow(row, prefix + "_atualizado_em", ZonedDateTime.class));
        entity.setCriadoPorId(converter.fromRow(row, prefix + "_criado_por_id", Long.class));
        entity.setAtualizadoPorId(converter.fromRow(row, prefix + "_atualizado_por_id", Long.class));
        return entity;
    }
}
