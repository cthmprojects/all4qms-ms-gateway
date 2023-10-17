package com.tellescom.all4qms.service.mapper;

import com.tellescom.all4qms.domain.Parametros;
import com.tellescom.all4qms.service.dto.ParametrosDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Parametros} and its DTO {@link ParametrosDTO}.
 */
@Mapper(componentModel = "spring")
public interface ParametrosMapper extends EntityMapper<ParametrosDTO, Parametros> {}
