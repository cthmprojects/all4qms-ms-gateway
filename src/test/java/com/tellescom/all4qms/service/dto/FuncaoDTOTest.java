package com.tellescom.all4qms.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.tellescom.all4qms.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FuncaoDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(FuncaoDTO.class);
        FuncaoDTO funcaoDTO1 = new FuncaoDTO();
        funcaoDTO1.setId(1L);
        FuncaoDTO funcaoDTO2 = new FuncaoDTO();
        assertThat(funcaoDTO1).isNotEqualTo(funcaoDTO2);
        funcaoDTO2.setId(funcaoDTO1.getId());
        assertThat(funcaoDTO1).isEqualTo(funcaoDTO2);
        funcaoDTO2.setId(2L);
        assertThat(funcaoDTO1).isNotEqualTo(funcaoDTO2);
        funcaoDTO1.setId(null);
        assertThat(funcaoDTO1).isNotEqualTo(funcaoDTO2);
    }
}
