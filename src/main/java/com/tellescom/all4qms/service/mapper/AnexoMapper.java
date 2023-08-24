package com.tellescom.all4qms.service.mapper;

import com.tellescom.all4qms.domain.Anexo;
import com.tellescom.all4qms.service.dto.AnexoDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Anexo} and its DTO {@link AnexoDTO}.
 */
@Mapper(componentModel = "spring")
public interface AnexoMapper extends EntityMapper<AnexoDTO, Anexo> {}
