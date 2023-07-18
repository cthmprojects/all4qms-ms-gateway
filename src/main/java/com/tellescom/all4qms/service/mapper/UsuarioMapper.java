package com.tellescom.all4qms.service.mapper;

import com.tellescom.all4qms.domain.Funcao;
import com.tellescom.all4qms.domain.Processo;
import com.tellescom.all4qms.domain.Setor;
import com.tellescom.all4qms.domain.User;
import com.tellescom.all4qms.domain.Usuario;
import com.tellescom.all4qms.service.dto.FuncaoDTO;
import com.tellescom.all4qms.service.dto.ProcessoDTO;
import com.tellescom.all4qms.service.dto.SetorDTO;
import com.tellescom.all4qms.service.dto.UserDTO;
import com.tellescom.all4qms.service.dto.UsuarioDTO;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Usuario} and its DTO {@link UsuarioDTO}.
 */
@Mapper(componentModel = "spring")
public interface UsuarioMapper extends EntityMapper<UsuarioDTO, Usuario> {
    @Mapping(target = "funcao", source = "funcao", qualifiedByName = "funcaoNome")
    @Mapping(target = "gestor", source = "gestor", qualifiedByName = "usuarioNome")
    @Mapping(target = "setor", source = "setor", qualifiedByName = "setorNome")
    @Mapping(target = "user", source = "user", qualifiedByName = "userLogin")
    @Mapping(target = "criadoPor", source = "criadoPor", qualifiedByName = "usuarioNome")
    @Mapping(target = "atualizadoPor", source = "atualizadoPor", qualifiedByName = "usuarioNome")
    @Mapping(target = "processos", source = "processos", qualifiedByName = "processoNomeSet")
    UsuarioDTO toDto(Usuario s);

    @Mapping(target = "removeProcessos", ignore = true)
    Usuario toEntity(UsuarioDTO usuarioDTO);

    @Named("funcaoNome")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "nome", source = "nome")
    FuncaoDTO toDtoFuncaoNome(Funcao funcao);

    @Named("usuarioNome")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "nome", source = "nome")
    UsuarioDTO toDtoUsuarioNome(Usuario usuario);

    @Named("setorNome")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "nome", source = "nome")
    SetorDTO toDtoSetorNome(Setor setor);

    @Named("userLogin")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "login", source = "login")
    UserDTO toDtoUserLogin(User user);

    @Named("processoNome")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "nome", source = "nome")
    ProcessoDTO toDtoProcessoNome(Processo processo);

    @Named("processoNomeSet")
    default Set<ProcessoDTO> toDtoProcessoNomeSet(Set<Processo> processo) {
        return processo.stream().map(this::toDtoProcessoNome).collect(Collectors.toSet());
    }
}
