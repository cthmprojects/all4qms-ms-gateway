package com.tellescom.all4qms.service.mapper;

import com.tellescom.all4qms.domain.Setor;
import com.tellescom.all4qms.domain.Usuario;
import com.tellescom.all4qms.service.dto.SetorDTO;
import com.tellescom.all4qms.service.dto.UsuarioDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Setor} and its DTO {@link SetorDTO}.
 */
@Mapper(componentModel = "spring")
public interface SetorMapper extends EntityMapper<SetorDTO, Setor> {
    @Mapping(target = "criadoPor", source = "criadoPor", qualifiedByName = "usuarioNome")
    @Mapping(target = "atualizadoPor", source = "atualizadoPor", qualifiedByName = "usuarioNome")
    SetorDTO toDto(Setor s);

    @Named("usuarioNome")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "nome", source = "nome")
    UsuarioDTO toDtoUsuarioNome(Usuario usuario);
}
