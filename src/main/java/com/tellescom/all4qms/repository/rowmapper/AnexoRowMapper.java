package com.tellescom.all4qms.repository.rowmapper;

import com.tellescom.all4qms.domain.Anexo;
import io.r2dbc.spi.Row;
import java.time.ZonedDateTime;
import java.util.function.BiFunction;
import org.springframework.stereotype.Service;

/**
 * Converter between {@link Row} to {@link Anexo}, with proper type conversions.
 */
@Service
public class AnexoRowMapper implements BiFunction<Row, String, Anexo> {

    private final ColumnConverter converter;

    public AnexoRowMapper(ColumnConverter converter) {
        this.converter = converter;
    }

    /**
     * Take a {@link Row} and a column prefix, and extract all the fields.
     * @return the {@link Anexo} stored in the database.
     */
    @Override
    public Anexo apply(Row row, String prefix) {
        Anexo entity = new Anexo();
        entity.setId(converter.fromRow(row, prefix + "_id", Long.class));
        entity.setNomeArquivo(converter.fromRow(row, prefix + "_nome_arquivo", String.class));
        entity.setNomeOriginal(converter.fromRow(row, prefix + "_nome_original", String.class));
        entity.setExtensao(converter.fromRow(row, prefix + "_extensao", String.class));
        entity.setCriadoEm(converter.fromRow(row, prefix + "_criado_em", ZonedDateTime.class));
        entity.setAtualizadoEm(converter.fromRow(row, prefix + "_atualizado_em", ZonedDateTime.class));
        return entity;
    }
}
