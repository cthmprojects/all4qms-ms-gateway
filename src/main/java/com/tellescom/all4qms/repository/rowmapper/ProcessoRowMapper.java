package com.tellescom.all4qms.repository.rowmapper;

import com.tellescom.all4qms.domain.Processo;
import io.r2dbc.spi.Row;
import java.time.ZonedDateTime;
import java.util.function.BiFunction;
import org.springframework.stereotype.Service;

/**
 * Converter between {@link Row} to {@link Processo}, with proper type conversions.
 */
@Service
public class ProcessoRowMapper implements BiFunction<Row, String, Processo> {

    private final ColumnConverter converter;

    public ProcessoRowMapper(ColumnConverter converter) {
        this.converter = converter;
    }

    /**
     * Take a {@link Row} and a column prefix, and extract all the fields.
     * @return the {@link Processo} stored in the database.
     */
    @Override
    public Processo apply(Row row, String prefix) {
        Processo entity = new Processo();
        entity.setId(converter.fromRow(row, prefix + "_id", Long.class));
        entity.setNumero(converter.fromRow(row, prefix + "_numero", String.class));
        entity.setNome(converter.fromRow(row, prefix + "_nome", String.class));
        entity.setDescricao(converter.fromRow(row, prefix + "_descricao", String.class));
        entity.setSetor(converter.fromRow(row, prefix + "_setor", String.class));
        entity.setResponsavel(converter.fromRow(row, prefix + "_responsavel", String.class));
        entity.setSetorResponsavel(converter.fromRow(row, prefix + "_setor_responsavel", String.class));
        entity.setCriadoEm(converter.fromRow(row, prefix + "_criado_em", ZonedDateTime.class));
        entity.setAtualizadoEm(converter.fromRow(row, prefix + "_atualizado_em", ZonedDateTime.class));
        entity.setCriadoPorId(converter.fromRow(row, prefix + "_criado_por_id", Long.class));
        entity.setAtualizadoPorId(converter.fromRow(row, prefix + "_atualizado_por_id", Long.class));
        return entity;
    }
}
