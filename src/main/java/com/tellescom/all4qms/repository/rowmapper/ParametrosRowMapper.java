package com.tellescom.all4qms.repository.rowmapper;

import com.tellescom.all4qms.domain.Parametros;
import io.r2dbc.spi.Row;
import java.time.Instant;
import java.util.function.BiFunction;
import org.springframework.stereotype.Service;

/**
 * Converter between {@link Row} to {@link Parametros}, with proper type conversions.
 */
@Service
public class ParametrosRowMapper implements BiFunction<Row, String, Parametros> {

    private final ColumnConverter converter;

    public ParametrosRowMapper(ColumnConverter converter) {
        this.converter = converter;
    }

    /**
     * Take a {@link Row} and a column prefix, and extract all the fields.
     * @return the {@link Parametros} stored in the database.
     */
    @Override
    public Parametros apply(Row row, String prefix) {
        Parametros entity = new Parametros();
        entity.setId(converter.fromRow(row, prefix + "_id", Long.class));
        entity.setChave(converter.fromRow(row, prefix + "_chave", String.class));
        entity.setValorChave(converter.fromRow(row, prefix + "_valor_chave", String.class));
        entity.setNomeAmigavel(converter.fromRow(row, prefix + "_nome_amigavel", String.class));
        entity.setDescricao(converter.fromRow(row, prefix + "_descricao", String.class));
        entity.setAtualizadoEm(converter.fromRow(row, prefix + "_atualizado_em", Instant.class));
        entity.setLocked(converter.fromRow(row, prefix + "_locked", Boolean.class));
        return entity;
    }
}
