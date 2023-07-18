package com.tellescom.all4qms.service.mapper;

import com.tellescom.all4qms.domain.Processo;
import com.tellescom.all4qms.domain.Usuario;
import com.tellescom.all4qms.service.dto.ProcessoDTO;
import com.tellescom.all4qms.service.dto.UsuarioDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Processo} and its DTO {@link ProcessoDTO}.
 */
@Mapper(componentModel = "spring")
public interface ProcessoMapper extends EntityMapper<ProcessoDTO, Processo> {
    @Mapping(target = "criadoPor", source = "criadoPor", qualifiedByName = "usuarioNome")
    @Mapping(target = "atualizadoPor", source = "atualizadoPor", qualifiedByName = "usuarioNome")
    ProcessoDTO toDto(Processo s);

    @Named("usuarioNome")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "nome", source = "nome")
    UsuarioDTO toDtoUsuarioNome(Usuario usuario);
}
