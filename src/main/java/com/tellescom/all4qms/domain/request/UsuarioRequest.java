package com.tellescom.all4qms.domain.request;

import com.tellescom.all4qms.domain.Authority;
import java.util.List;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UsuarioRequest {

    private long idUsrCreator;

    private String login; //User

    private String nome; //Usuario-User

    private String email; //Usuario-User

    private Set<Authority> perfil; //User

    private Long funcao; //Usuario

    private Long setor; //Usuario

    private boolean isGestor; //Usuario

    private Long gestor; //Usuario

    private List<Long> processos; //Usuario
}
