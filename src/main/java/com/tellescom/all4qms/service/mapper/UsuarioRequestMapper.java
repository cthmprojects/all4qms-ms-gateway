package com.tellescom.all4qms.service.mapper;

import com.tellescom.all4qms.domain.Funcao;
import com.tellescom.all4qms.domain.Processo;
import com.tellescom.all4qms.domain.Setor;
import com.tellescom.all4qms.domain.User;
import com.tellescom.all4qms.domain.Usuario;
import com.tellescom.all4qms.service.dto.*;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import org.springframework.stereotype.Component;

@Component
public class UsuarioRequestMapper {

    public List<UsuarioRequest> toEntity(List<UsuarioDTO> dtoList) {
        if (dtoList == null) {
            return null;
        }

        List<UsuarioRequest> list = new ArrayList<UsuarioRequest>(dtoList.size());
        for (UsuarioDTO usuarioDTO : dtoList) {
            list.add(toEntity(usuarioDTO));
        }

        return list;
    }

    public List<UsuarioDTO> toDto(List<UsuarioRequest> entityList) {
        if (entityList == null) {
            return null;
        }

        List<UsuarioDTO> list = new ArrayList<UsuarioDTO>(entityList.size());
        for (UsuarioRequest usuario : entityList) {
            list.add(toDto(usuario));
        }

        return list;
    }

    public void partialUpdate(UsuarioRequest entity, UsuarioDTO dto) {
        if (dto == null) {
            return;
        }

        if (dto.getId() != null) {
            entity.setId(dto.getId());
        }
        if (dto.getNome() != null) {
            entity.setNome(dto.getNome());
        }
        if (dto.getEmail() != null) {
            entity.setEmail(dto.getEmail());
        }
        if (dto.getIsGestor() != null) {
            entity.setIsGestor(dto.getIsGestor());
        }
        if (dto.getCriadoEm() != null) {
            entity.setCriadoEm(dto.getCriadoEm());
        }
        if (dto.getAtualizadoEm() != null) {
            entity.setAtualizadoEm(dto.getAtualizadoEm());
        }
        if (dto.getFuncao() != null) {
            if (entity.getFuncao() == null) {
                entity.funcao(new Funcao());
            }
            funcaoDTOToFuncao(dto.getFuncao(), entity.getFuncao());
        }
        if (dto.getGestor() != null) {
            entity.gestor(toEntity(dto.getGestor()));
        }
        if (dto.getSetor() != null) {
            if (entity.getSetor() == null) {
                entity.setor(new Setor());
            }
            setorDTOToSetor(dto.getSetor(), entity.getSetor());
        }
        if (dto.getUser() != null) {
            if (entity.getUser() == null) {
                entity.user(new User());
            }
            userDTOToUser(dto.getUser(), entity.getUser());
        }
        if (dto.getCriadoPor() != null) {
            entity.criadoPor(toEntity(dto.getCriadoPor()));
        }
        if (dto.getAtualizadoPor() != null) {
            entity.atualizadoPor(toEntity(dto.getAtualizadoPor()));
        }
        if (entity.getProcessos() != null) {
            Set<Processo> set = processoDTOSetToProcessoSet(dto.getProcessos());
            if (set != null) {
                entity.getProcessos().clear();
                entity.getProcessos().addAll(set);
            }
        } else {
            Set<Processo> set = processoDTOSetToProcessoSet(dto.getProcessos());
            if (set != null) {
                entity.processos(set);
            }
        }
    }

    public UsuarioDTO toDto(Usuario s) {
        if (s == null) {
            return null;
        }

        UsuarioDTO usuarioDTO = new UsuarioDTO();

        usuarioDTO.setFuncao(toDtoFuncaoNome(s.getFuncao()));
        usuarioDTO.setGestor(toDtoUsuarioNome(s.getGestor()));
        usuarioDTO.setSetor(toDtoSetorNome(s.getSetor()));
        usuarioDTO.setUser(toDtoUserLogin(s.getUser()));
        usuarioDTO.setCriadoPor(toDtoUsuarioNome(s.getCriadoPor()));
        usuarioDTO.setAtualizadoPor(toDtoUsuarioNome(s.getAtualizadoPor()));
        usuarioDTO.setProcessos(toDtoProcessoNomeSet(s.getProcessos()));
        usuarioDTO.setId(s.getId());
        usuarioDTO.setNome(s.getNome());
        usuarioDTO.setEmail(s.getEmail());
        usuarioDTO.setIsGestor(s.getIsGestor());
        usuarioDTO.setCriadoEm(s.getCriadoEm());
        usuarioDTO.setAtualizadoEm(s.getAtualizadoEm());

        return usuarioDTO;
    }

    public UsuarioRequest toEntity(UsuarioDTO usuarioDTO) {
        if (usuarioDTO == null) {
            return null;
        }

        Usuario usuario = new Usuario();

        usuario.setId(usuarioDTO.getId());
        usuario.setNome(usuarioDTO.getNome());
        usuario.setEmail(usuarioDTO.getEmail());
        usuario.setIsGestor(usuarioDTO.getIsGestor());
        usuario.setCriadoEm(usuarioDTO.getCriadoEm());
        usuario.setAtualizadoEm(usuarioDTO.getAtualizadoEm());
        usuario.funcao(funcaoDTOToFuncao1(usuarioDTO.getFuncao()));
        usuario.gestor(toEntity(usuarioDTO.getGestor()));
        usuario.setor(setorDTOToSetor1(usuarioDTO.getSetor()));
        usuario.user(userDTOToUser1(usuarioDTO.getUser()));
        usuario.criadoPor(toEntity(usuarioDTO.getCriadoPor()));
        usuario.atualizadoPor(toEntity(usuarioDTO.getAtualizadoPor()));
        usuario.processos(processoDTOSetToProcessoSet(usuarioDTO.getProcessos()));

        return usuario;
    }

    public FuncaoDTO toDtoFuncaoNome(Funcao funcao) {
        if (funcao == null) {
            return null;
        }

        FuncaoDTO funcaoDTO = new FuncaoDTO();

        funcaoDTO.setId(funcao.getId());
        funcaoDTO.setNome(funcao.getNome());

        return funcaoDTO;
    }

    public UsuarioDTO toDtoUsuarioNome(Usuario usuario) {
        if (usuario == null) {
            return null;
        }

        UsuarioDTO usuarioDTO = new UsuarioDTO();

        usuarioDTO.setId(usuario.getId());
        usuarioDTO.setNome(usuario.getNome());

        return usuarioDTO;
    }

    public SetorDTO toDtoSetorNome(Setor setor) {
        if (setor == null) {
            return null;
        }

        SetorDTO setorDTO = new SetorDTO();

        setorDTO.setId(setor.getId());
        setorDTO.setNome(setor.getNome());

        return setorDTO;
    }

    public UserDTO toDtoUserLogin(User user) {
        if (user == null) {
            return null;
        }

        UserDTO userDTO = new UserDTO();

        userDTO.setId(user.getId());
        userDTO.setLogin(user.getLogin());

        return userDTO;
    }

    public ProcessoDTO toDtoProcessoNome(Processo processo) {
        if (processo == null) {
            return null;
        }

        ProcessoDTO processoDTO = new ProcessoDTO();

        processoDTO.setId(processo.getId());
        processoDTO.setNome(processo.getNome());

        return processoDTO;
    }

    protected void funcaoDTOToFuncao(FuncaoDTO funcaoDTO, Funcao mappingTarget) {
        if (funcaoDTO == null) {
            return;
        }

        if (funcaoDTO.getId() != null) {
            mappingTarget.setId(funcaoDTO.getId());
        }
        if (funcaoDTO.getNome() != null) {
            mappingTarget.setNome(funcaoDTO.getNome());
        }
        if (funcaoDTO.getDescricao() != null) {
            mappingTarget.setDescricao(funcaoDTO.getDescricao());
        }
        if (funcaoDTO.getCriadoEm() != null) {
            mappingTarget.setCriadoEm(funcaoDTO.getCriadoEm());
        }
        if (funcaoDTO.getAtualizadoEm() != null) {
            mappingTarget.setAtualizadoEm(funcaoDTO.getAtualizadoEm());
        }
        if (funcaoDTO.getCriadoPor() != null) {
            mappingTarget.criadoPor(toEntity(funcaoDTO.getCriadoPor()));
        }
        if (funcaoDTO.getAtualizadoPor() != null) {
            mappingTarget.atualizadoPor(toEntity(funcaoDTO.getAtualizadoPor()));
        }
    }

    protected void setorDTOToSetor(SetorDTO setorDTO, Setor mappingTarget) {
        if (setorDTO == null) {
            return;
        }

        if (setorDTO.getId() != null) {
            mappingTarget.setId(setorDTO.getId());
        }
        if (setorDTO.getNome() != null) {
            mappingTarget.setNome(setorDTO.getNome());
        }
        if (setorDTO.getDescricao() != null) {
            mappingTarget.setDescricao(setorDTO.getDescricao());
        }
        if (setorDTO.getCriadoEm() != null) {
            mappingTarget.setCriadoEm(setorDTO.getCriadoEm());
        }
        if (setorDTO.getAtualizadoEm() != null) {
            mappingTarget.setAtualizadoEm(setorDTO.getAtualizadoEm());
        }
        if (setorDTO.getCriadoPor() != null) {
            mappingTarget.criadoPor(toEntity(setorDTO.getCriadoPor()));
        }
        if (setorDTO.getAtualizadoPor() != null) {
            mappingTarget.atualizadoPor(toEntity(setorDTO.getAtualizadoPor()));
        }
    }

    protected void userDTOToUser(UserDTO userDTO, User mappingTarget) {
        if (userDTO == null) {
            return;
        }

        if (userDTO.getId() != null) {
            mappingTarget.setId(userDTO.getId());
        }
        if (userDTO.getLogin() != null) {
            mappingTarget.setLogin(userDTO.getLogin());
        }
    }

    protected Processo processoDTOToProcesso(ProcessoDTO processoDTO) {
        if (processoDTO == null) {
            return null;
        }

        Processo processo = new Processo();

        processo.setId(processoDTO.getId());
        processo.setNumero(processoDTO.getNumero());
        processo.setNome(processoDTO.getNome());
        processo.setDescricao(processoDTO.getDescricao());
        processo.setSetor(processoDTO.getSetor());
        processo.setResponsavel(processoDTO.getResponsavel());
        processo.setSetorResponsavel(processoDTO.getSetorResponsavel());
        processo.setCriadoEm(processoDTO.getCriadoEm());
        processo.setAtualizadoEm(processoDTO.getAtualizadoEm());
        processo.criadoPor(toEntity(processoDTO.getCriadoPor()));
        processo.atualizadoPor(toEntity(processoDTO.getAtualizadoPor()));

        return processo;
    }

    protected Set<Processo> processoDTOSetToProcessoSet(Set<ProcessoDTO> set) {
        if (set == null) {
            return null;
        }

        Set<Processo> set1 = new LinkedHashSet<Processo>(Math.max((int) (set.size() / .75f) + 1, 16));
        for (ProcessoDTO processoDTO : set) {
            set1.add(processoDTOToProcesso(processoDTO));
        }

        return set1;
    }

    protected Funcao funcaoDTOToFuncao1(FuncaoDTO funcaoDTO) {
        if (funcaoDTO == null) {
            return null;
        }

        Funcao funcao = new Funcao();

        funcao.setId(funcaoDTO.getId());
        funcao.setNome(funcaoDTO.getNome());
        funcao.setDescricao(funcaoDTO.getDescricao());
        funcao.setCriadoEm(funcaoDTO.getCriadoEm());
        funcao.setAtualizadoEm(funcaoDTO.getAtualizadoEm());
        funcao.criadoPor(toEntity(funcaoDTO.getCriadoPor()));
        funcao.atualizadoPor(toEntity(funcaoDTO.getAtualizadoPor()));

        return funcao;
    }

    protected Setor setorDTOToSetor1(SetorDTO setorDTO) {
        if (setorDTO == null) {
            return null;
        }

        Setor setor = new Setor();

        setor.setId(setorDTO.getId());
        setor.setNome(setorDTO.getNome());
        setor.setDescricao(setorDTO.getDescricao());
        setor.setCriadoEm(setorDTO.getCriadoEm());
        setor.setAtualizadoEm(setorDTO.getAtualizadoEm());
        setor.criadoPor(toEntity(setorDTO.getCriadoPor()));
        setor.atualizadoPor(toEntity(setorDTO.getAtualizadoPor()));

        return setor;
    }

    protected User userDTOToUser1(UserDTO userDTO) {
        if (userDTO == null) {
            return null;
        }

        User user = new User();

        user.setId(userDTO.getId());
        user.setLogin(userDTO.getLogin());

        return user;
    }
}
