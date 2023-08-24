package com.tellescom.all4qms.repository.rowmapper;

import com.tellescom.all4qms.domain.Parametro;
import io.r2dbc.spi.Row;
import java.time.ZonedDateTime;
import java.util.function.BiFunction;
import org.springframework.stereotype.Service;

/**
 * Converter between {@link Row} to {@link Parametro}, with proper type conversions.
 */
@Service
public class ParametroRowMapper implements BiFunction<Row, String, Parametro> {

    private final ColumnConverter converter;

    public ParametroRowMapper(ColumnConverter converter) {
        this.converter = converter;
    }

    /**
     * Take a {@link Row} and a column prefix, and extract all the fields.
     * @return the {@link Parametro} stored in the database.
     */
    @Override
    public Parametro apply(Row row, String prefix) {
        Parametro entity = new Parametro();
        entity.setId(converter.fromRow(row, prefix + "_id", Long.class));
        entity.setChave(converter.fromRow(row, prefix + "_chave", String.class));
        entity.setValor(converter.fromRow(row, prefix + "_valor", String.class));
        entity.setNomeAmigavel(converter.fromRow(row, prefix + "_nome_amigavel", String.class));
        entity.setAtualizadoEm(converter.fromRow(row, prefix + "_atualizado_em", ZonedDateTime.class));
        return entity;
    }
}
