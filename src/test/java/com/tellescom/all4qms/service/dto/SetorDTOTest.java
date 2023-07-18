package com.tellescom.all4qms.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.tellescom.all4qms.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SetorDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(SetorDTO.class);
        SetorDTO setorDTO1 = new SetorDTO();
        setorDTO1.setId(1L);
        SetorDTO setorDTO2 = new SetorDTO();
        assertThat(setorDTO1).isNotEqualTo(setorDTO2);
        setorDTO2.setId(setorDTO1.getId());
        assertThat(setorDTO1).isEqualTo(setorDTO2);
        setorDTO2.setId(2L);
        assertThat(setorDTO1).isNotEqualTo(setorDTO2);
        setorDTO1.setId(null);
        assertThat(setorDTO1).isNotEqualTo(setorDTO2);
    }
}
