package com.tellescom.all4qms.repository;

import java.util.ArrayList;
import java.util.List;
import org.springframework.data.relational.core.sql.Column;
import org.springframework.data.relational.core.sql.Expression;
import org.springframework.data.relational.core.sql.Table;

public class FuncaoSqlHelper {

    public static List<Expression> getColumns(Table table, String columnPrefix) {
        List<Expression> columns = new ArrayList<>();
        columns.add(Column.aliased("id", table, columnPrefix + "_id"));
        columns.add(Column.aliased("nome", table, columnPrefix + "_nome"));
        columns.add(Column.aliased("descricao", table, columnPrefix + "_descricao"));
        columns.add(Column.aliased("criado_em", table, columnPrefix + "_criado_em"));
        columns.add(Column.aliased("atualizado_em", table, columnPrefix + "_atualizado_em"));

        columns.add(Column.aliased("criado_por_id", table, columnPrefix + "_criado_por_id"));
        columns.add(Column.aliased("atualizado_por_id", table, columnPrefix + "_atualizado_por_id"));
        return columns;
    }
}
