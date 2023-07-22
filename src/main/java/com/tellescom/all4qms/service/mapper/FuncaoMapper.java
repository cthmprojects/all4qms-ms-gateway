package com.tellescom.all4qms.service.mapper;

import com.tellescom.all4qms.domain.Funcao;
import com.tellescom.all4qms.domain.Usuario;
import com.tellescom.all4qms.service.dto.FuncaoDTO;
import com.tellescom.all4qms.service.dto.UsuarioDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Funcao} and its DTO {@link FuncaoDTO}.
 */
@Mapper(componentModel = "spring")
public interface FuncaoMapper extends EntityMapper<FuncaoDTO, Funcao> {
    @Mapping(target = "criadoPor", source = "criadoPor", qualifiedByName = "usuarioNome")
    @Mapping(target = "atualizadoPor", source = "atualizadoPor", qualifiedByName = "usuarioNome")
    FuncaoDTO toDto(Funcao s);

    @Named("usuarioNome")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "nome", source = "nome")
    UsuarioDTO toDtoUsuarioNome(Usuario usuario);
}
