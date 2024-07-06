package com.tellescom.all4qms.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.tellescom.all4qms.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProcessoDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ProcessoDTO.class);
        ProcessoDTO processoDTO1 = new ProcessoDTO();
        processoDTO1.setId(1L);
        ProcessoDTO processoDTO2 = new ProcessoDTO();
        assertThat(processoDTO1).isNotEqualTo(processoDTO2);
        processoDTO2.setId(processoDTO1.getId());
        assertThat(processoDTO1).isEqualTo(processoDTO2);
        processoDTO2.setId(2L);
        assertThat(processoDTO1).isNotEqualTo(processoDTO2);
        processoDTO1.setId(null);
        assertThat(processoDTO1).isNotEqualTo(processoDTO2);
    }
}
