package com.tellescom.all4qms.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.tellescom.all4qms.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FuncaoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Funcao.class);
        Funcao funcao1 = new Funcao();
        funcao1.setId(1L);
        Funcao funcao2 = new Funcao();
        funcao2.setId(funcao1.getId());
        assertThat(funcao1).isEqualTo(funcao2);
        funcao2.setId(2L);
        assertThat(funcao1).isNotEqualTo(funcao2);
        funcao1.setId(null);
        assertThat(funcao1).isNotEqualTo(funcao2);
    }
}
