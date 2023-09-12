package com.tellescom.all4qms.repository.rowmapper;

import com.tellescom.all4qms.domain.Usuario;
import io.r2dbc.spi.Row;
import java.time.Instant;
import java.util.function.BiFunction;
import org.springframework.stereotype.Service;

/**
 * Converter between {@link Row} to {@link Usuario}, with proper type conversions.
 */
@Service
public class UsuarioRowMapper implements BiFunction<Row, String, Usuario> {

    private final ColumnConverter converter;

    public UsuarioRowMapper(ColumnConverter converter) {
        this.converter = converter;
    }

    /**
     * Take a {@link Row} and a column prefix, and extract all the fields.
     * @return the {@link Usuario} stored in the database.
     */
    @Override
    public Usuario apply(Row row, String prefix) {
        Usuario entity = new Usuario();
        entity.setId(converter.fromRow(row, prefix + "_id", Long.class));
        entity.setNome(converter.fromRow(row, prefix + "_nome", String.class));
        entity.setEmail(converter.fromRow(row, prefix + "_email", String.class));
        entity.setIsGestor(converter.fromRow(row, prefix + "_is_gestor", Boolean.class));
        entity.setCriadoEm(converter.fromRow(row, prefix + "_criado_em", Instant.class));
        entity.setAtualizadoEm(converter.fromRow(row, prefix + "_atualizado_em", Instant.class));
        entity.setFuncaoId(converter.fromRow(row, prefix + "_funcao_id", Long.class));
        entity.setGestorId(converter.fromRow(row, prefix + "_gestor_id", Long.class));
        entity.setSetorId(converter.fromRow(row, prefix + "_setor_id", Long.class));
        entity.setUserId(converter.fromRow(row, prefix + "_user_id", Long.class));
        entity.setCriadoPorId(converter.fromRow(row, prefix + "_criado_por_id", Long.class));
        entity.setAtualizadoPorId(converter.fromRow(row, prefix + "_atualizado_por_id", Long.class));
        return entity;
    }
}
