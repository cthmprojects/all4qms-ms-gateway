package com.tellescom.all4qms.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.tellescom.all4qms.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AnexoDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(AnexoDTO.class);
        AnexoDTO anexoDTO1 = new AnexoDTO();
        anexoDTO1.setId(1L);
        AnexoDTO anexoDTO2 = new AnexoDTO();
        assertThat(anexoDTO1).isNotEqualTo(anexoDTO2);
        anexoDTO2.setId(anexoDTO1.getId());
        assertThat(anexoDTO1).isEqualTo(anexoDTO2);
        anexoDTO2.setId(2L);
        assertThat(anexoDTO1).isNotEqualTo(anexoDTO2);
        anexoDTO1.setId(null);
        assertThat(anexoDTO1).isNotEqualTo(anexoDTO2);
    }
}
