package com.tellescom.all4qms.service.dto;

import com.tellescom.all4qms.domain.Funcao;
import com.tellescom.all4qms.domain.Setor;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class UsuarioRequest {

    private Long id; //Usuario - User

    private String login; //User

    private String nome; //Usuario-User

    private String email; //Usuario-User

    private List<String> perfil; //User

    private FuncaoDTO funcao; //Usuario

    private SetorDTO setor; //Usuario

    private Boolean isGestor; //Usuario

    private UsuarioDTO gestor; //Usuario

    private Set<ProcessoDTO> processos = new HashSet<>(); //Usuario

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<String> getPerfil() {
        return perfil;
    }

    public void setPerfil(List<String> perfil) {
        this.perfil = perfil;
    }

    public FuncaoDTO getFuncao() {
        return funcao;
    }

    public void setFuncao(FuncaoDTO funcao) {
        this.funcao = funcao;
    }

    public SetorDTO getSetor() {
        return setor;
    }

    public void setSetor(SetorDTO setor) {
        this.setor = setor;
    }

    public Boolean isGestor() {
        return isGestor;
    }

    public UsuarioDTO getGestor() {
        return gestor;
    }

    public void setGestor(UsuarioDTO gestor) {
        this.gestor = gestor;
    }

    public Boolean getisGestor() {
        return isGestor;
    }

    public void setIsGestor(Boolean isGestor) {
        this.isGestor = isGestor;
    }

    public Set<ProcessoDTO> getProcessos() {
        return processos;
    }

    public void setProcessos(Set<ProcessoDTO> processos) {
        this.processos = processos;
    }
}
