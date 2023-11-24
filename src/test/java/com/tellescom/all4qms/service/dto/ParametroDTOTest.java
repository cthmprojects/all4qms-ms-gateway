package com.tellescom.all4qms.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.tellescom.all4qms.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ParametroDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ParametroDTO.class);
        ParametroDTO parametroDTO1 = new ParametroDTO();
        parametroDTO1.setId(1L);
        ParametroDTO parametroDTO2 = new ParametroDTO();
        assertThat(parametroDTO1).isNotEqualTo(parametroDTO2);
        parametroDTO2.setId(parametroDTO1.getId());
        assertThat(parametroDTO1).isEqualTo(parametroDTO2);
        parametroDTO2.setId(2L);
        assertThat(parametroDTO1).isNotEqualTo(parametroDTO2);
        parametroDTO1.setId(null);
        assertThat(parametroDTO1).isNotEqualTo(parametroDTO2);
    }
}
