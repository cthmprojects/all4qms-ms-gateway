package com.tellescom.all4qms.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.tellescom.all4qms.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ParametrosTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Parametros.class);
        Parametros parametros1 = new Parametros();
        parametros1.setId(1L);
        Parametros parametros2 = new Parametros();
        parametros2.setId(parametros1.getId());
        assertThat(parametros1).isEqualTo(parametros2);
        parametros2.setId(2L);
        assertThat(parametros1).isNotEqualTo(parametros2);
        parametros1.setId(null);
        assertThat(parametros1).isNotEqualTo(parametros2);
    }
}
