package com.tellescom.all4qms.service.mapper;

import com.tellescom.all4qms.domain.Pendencia;
import com.tellescom.all4qms.domain.Usuario;
import com.tellescom.all4qms.service.dto.PendenciaDTO;
import com.tellescom.all4qms.service.dto.UsuarioDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Pendencia} and its DTO {@link PendenciaDTO}.
 */
@Mapper(componentModel = "spring")
public interface PendenciaMapper extends EntityMapper<PendenciaDTO, Pendencia> {
    @Mapping(target = "responsavel", source = "responsavel", qualifiedByName = "usuarioNome")
    @Mapping(target = "criadoPor", source = "criadoPor", qualifiedByName = "usuarioNome")
    @Mapping(target = "atualizadoPor", source = "atualizadoPor", qualifiedByName = "usuarioNome")
    PendenciaDTO toDto(Pendencia s);

    @Named("usuarioNome")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "nome", source = "nome")
    UsuarioDTO toDtoUsuarioNome(Usuario usuario);
}
