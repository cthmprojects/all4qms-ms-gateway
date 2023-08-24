package com.tellescom.all4qms.repository;

import java.util.ArrayList;
import java.util.List;
import org.springframework.data.relational.core.sql.Column;
import org.springframework.data.relational.core.sql.Expression;
import org.springframework.data.relational.core.sql.Table;

public class AnexoSqlHelper {

    public static List<Expression> getColumns(Table table, String columnPrefix) {
        List<Expression> columns = new ArrayList<>();
        columns.add(Column.aliased("id", table, columnPrefix + "_id"));
        columns.add(Column.aliased("nome_arquivo", table, columnPrefix + "_nome_arquivo"));
        columns.add(Column.aliased("nome_original", table, columnPrefix + "_nome_original"));
        columns.add(Column.aliased("extensao", table, columnPrefix + "_extensao"));
        columns.add(Column.aliased("criado_em", table, columnPrefix + "_criado_em"));
        columns.add(Column.aliased("atualizado_em", table, columnPrefix + "_atualizado_em"));

        return columns;
    }
}
