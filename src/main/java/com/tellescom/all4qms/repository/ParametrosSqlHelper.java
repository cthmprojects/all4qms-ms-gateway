package com.tellescom.all4qms.repository;

import java.util.ArrayList;
import java.util.List;
import org.springframework.data.relational.core.sql.Column;
import org.springframework.data.relational.core.sql.Expression;
import org.springframework.data.relational.core.sql.Table;

public class ParametrosSqlHelper {

    public static List<Expression> getColumns(Table table, String columnPrefix) {
        List<Expression> columns = new ArrayList<>();
        columns.add(Column.aliased("id", table, columnPrefix + "_id"));
        columns.add(Column.aliased("chave", table, columnPrefix + "_chave"));
        columns.add(Column.aliased("valor_chave", table, columnPrefix + "_valor_chave"));
        columns.add(Column.aliased("nome_amigavel", table, columnPrefix + "_nome_amigavel"));
        columns.add(Column.aliased("descricao", table, columnPrefix + "_descricao"));
        columns.add(Column.aliased("atualizado_em", table, columnPrefix + "_atualizado_em"));
        columns.add(Column.aliased("locked", table, columnPrefix + "_locked"));

        return columns;
    }
}
