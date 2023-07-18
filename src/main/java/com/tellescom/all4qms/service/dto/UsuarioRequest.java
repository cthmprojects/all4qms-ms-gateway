package com.tellescom.all4qms.service.dto;

import java.util.List;

public class UsuarioRequest {

    private String login; //User

    private String nome; //Usuario-User

    private String email; //Usuario-User

    private List<String> perfil; //User

    private Long funcao; //Usuario

    private Long setor; //Usuario

    private boolean isGestor; //Usuario

    private Long gestor; //Usuario

    private List<Long> processos; //Usuario
}
