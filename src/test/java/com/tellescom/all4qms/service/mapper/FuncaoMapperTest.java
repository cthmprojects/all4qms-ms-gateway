package com.tellescom.all4qms.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class FuncaoMapperTest {

    private FuncaoMapper funcaoMapper;

    @BeforeEach
    public void setUp() {
        funcaoMapper = new FuncaoMapperImpl();
    }
}
