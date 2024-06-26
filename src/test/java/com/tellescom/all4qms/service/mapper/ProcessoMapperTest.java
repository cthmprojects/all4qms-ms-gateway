package com.tellescom.all4qms.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ProcessoMapperTest {

    private ProcessoMapper processoMapper;

    @BeforeEach
    public void setUp() {
        processoMapper = new ProcessoMapperImpl();
    }
}
