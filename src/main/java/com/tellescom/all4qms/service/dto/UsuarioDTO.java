package com.tellescom.all4qms.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link com.tellescom.all4qms.domain.Usuario} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class UsuarioDTO implements Serializable {

    private Long id;

    @NotNull(message = "must not be null")
    private String nome;

    private String email;
    private Boolean isGestor;
    private Instant criadoEm;
    private Instant atualizadoEm;
    private FuncaoDTO funcao;
    private UsuarioDTO gestor;
    private SetorDTO setor;
    private UserDTO user;
    private UsuarioDTO criadoPor;
    private UsuarioDTO atualizadoPor;

    private Set<ProcessoDTO> processos = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Boolean getIsGestor() {
        return isGestor;
    }

    public void setIsGestor(Boolean isGestor) {
        this.isGestor = isGestor;
    }

    public Instant getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(Instant criadoEm) {
        this.criadoEm = criadoEm;
    }

    public Instant getAtualizadoEm() {
        return atualizadoEm;
    }

    public void setAtualizadoEm(Instant atualizadoEm) {
        this.atualizadoEm = atualizadoEm;
    }

    public FuncaoDTO getFuncao() {
        return funcao;
    }

    public void setFuncao(FuncaoDTO funcao) {
        this.funcao = funcao;
    }

    public UsuarioDTO getGestor() {
        return gestor;
    }

    public void setGestor(UsuarioDTO gestor) {
        this.gestor = gestor;
    }

    public SetorDTO getSetor() {
        return setor;
    }

    public void setSetor(SetorDTO setor) {
        this.setor = setor;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    public UsuarioDTO getCriadoPor() {
        return criadoPor;
    }

    public void setCriadoPor(UsuarioDTO criadoPor) {
        this.criadoPor = criadoPor;
    }

    public UsuarioDTO getAtualizadoPor() {
        return atualizadoPor;
    }

    public void setAtualizadoPor(UsuarioDTO atualizadoPor) {
        this.atualizadoPor = atualizadoPor;
    }

    public Set<ProcessoDTO> getProcessos() {
        return processos;
    }

    public void setProcessos(Set<ProcessoDTO> processos) {
        this.processos = processos;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UsuarioDTO)) {
            return false;
        }

        UsuarioDTO usuarioDTO = (UsuarioDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, usuarioDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UsuarioDTO{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            ", email='" + getEmail() + "'" +
            ", isGestor='" + getIsGestor() + "'" +
            ", criadoEm='" + getCriadoEm() + "'" +
            ", atualizadoEm='" + getAtualizadoEm() + "'" +
            ", funcao=" + getFuncao() +
            ", gestor=" + getGestor() +
            ", setor=" + getSetor() +
            ", user=" + getUser() +
            ", criadoPor=" + getCriadoPor() +
            ", atualizadoPor=" + getAtualizadoPor() +
            ", processos=" + getProcessos() +
            "}";
    }
}
