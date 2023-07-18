package com.tellescom.all4qms.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.tellescom.all4qms.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PendenciaDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(PendenciaDTO.class);
        PendenciaDTO pendenciaDTO1 = new PendenciaDTO();
        pendenciaDTO1.setId(1L);
        PendenciaDTO pendenciaDTO2 = new PendenciaDTO();
        assertThat(pendenciaDTO1).isNotEqualTo(pendenciaDTO2);
        pendenciaDTO2.setId(pendenciaDTO1.getId());
        assertThat(pendenciaDTO1).isEqualTo(pendenciaDTO2);
        pendenciaDTO2.setId(2L);
        assertThat(pendenciaDTO1).isNotEqualTo(pendenciaDTO2);
        pendenciaDTO1.setId(null);
        assertThat(pendenciaDTO1).isNotEqualTo(pendenciaDTO2);
    }
}
