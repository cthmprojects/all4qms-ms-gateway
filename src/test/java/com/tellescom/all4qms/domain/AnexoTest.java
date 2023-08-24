package com.tellescom.all4qms.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.tellescom.all4qms.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AnexoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Anexo.class);
        Anexo anexo1 = new Anexo();
        anexo1.setId(1L);
        Anexo anexo2 = new Anexo();
        anexo2.setId(anexo1.getId());
        assertThat(anexo1).isEqualTo(anexo2);
        anexo2.setId(2L);
        assertThat(anexo1).isNotEqualTo(anexo2);
        anexo1.setId(null);
        assertThat(anexo1).isNotEqualTo(anexo2);
    }
}
