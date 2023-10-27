package com.tellescom.all4qms.service.dto;

import java.time.Instant;
import java.util.List;

public class UsuarioRequest {

    private Long id;

    private String login; //User

    private String nome; //Usuario-User

    private String email; //Usuario-User

    private List<String> perfil; //User

    private Long funcao; //Usuario

    private Long setor; //Usuario

    private boolean isGestor; //Usuario

    private Long gestor; //Usuario

    private List<Long> processos; //Usuario
    private Instant criadoEm;

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

    public Long getFuncao() {
        return funcao;
    }

    public void setFuncao(Long funcao) {
        this.funcao = funcao;
    }

    public Long getSetor() {
        return setor;
    }

    public void setSetor(Long setor) {
        this.setor = setor;
    }

    public Boolean getIsGestor() {
        return isGestor;
    }

    public void setIsGestor(Boolean isGestor) {
        this.isGestor = isGestor;
    }

    public Long getGestor() {
        return gestor;
    }

    public void setGestor(Long gestor) {
        this.gestor = gestor;
    }

    public List<Long> getProcessos() {
        return processos;
    }

    public void setProcessos(List<Long> processos) {
        this.processos = processos;
    }
}
