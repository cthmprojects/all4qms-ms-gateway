package com.tellescom.all4qms.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.tellescom.all4qms.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PendenciaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Pendencia.class);
        Pendencia pendencia1 = new Pendencia();
        pendencia1.setId(1L);
        Pendencia pendencia2 = new Pendencia();
        pendencia2.setId(pendencia1.getId());
        assertThat(pendencia1).isEqualTo(pendencia2);
        pendencia2.setId(2L);
        assertThat(pendencia1).isNotEqualTo(pendencia2);
        pendencia1.setId(null);
        assertThat(pendencia1).isNotEqualTo(pendencia2);
    }
}
