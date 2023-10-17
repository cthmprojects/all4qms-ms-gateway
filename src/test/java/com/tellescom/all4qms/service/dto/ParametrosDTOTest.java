package com.tellescom.all4qms.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.tellescom.all4qms.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ParametrosDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ParametrosDTO.class);
        ParametrosDTO parametrosDTO1 = new ParametrosDTO();
        parametrosDTO1.setId(1L);
        ParametrosDTO parametrosDTO2 = new ParametrosDTO();
        assertThat(parametrosDTO1).isNotEqualTo(parametrosDTO2);
        parametrosDTO2.setId(parametrosDTO1.getId());
        assertThat(parametrosDTO1).isEqualTo(parametrosDTO2);
        parametrosDTO2.setId(2L);
        assertThat(parametrosDTO1).isNotEqualTo(parametrosDTO2);
        parametrosDTO1.setId(null);
        assertThat(parametrosDTO1).isNotEqualTo(parametrosDTO2);
    }
}
