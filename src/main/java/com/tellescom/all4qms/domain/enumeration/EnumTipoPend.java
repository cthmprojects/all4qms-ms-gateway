package com.tellescom.all4qms.domain.enumeration;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * The EnumTipoPend enumeration.
 */
public enum EnumTipoPend {
    ATIVIDADE("Atividade"),
    NOTIFICACAO("Notificação");

    private final String value;

    EnumTipoPend(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
