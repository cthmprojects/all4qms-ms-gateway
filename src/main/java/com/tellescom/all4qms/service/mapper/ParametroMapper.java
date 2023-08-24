package com.tellescom.all4qms.service.mapper;

import com.tellescom.all4qms.domain.Parametro;
import com.tellescom.all4qms.service.dto.ParametroDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Parametro} and its DTO {@link ParametroDTO}.
 */
@Mapper(componentModel = "spring")
public interface ParametroMapper extends EntityMapper<ParametroDTO, Parametro> {}
