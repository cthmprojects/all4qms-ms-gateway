package com.tellescom.all4qms.domain.request;

import com.tellescom.all4qms.domain.Authority;
import com.tellescom.all4qms.service.dto.UsuarioDTO;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioUpdateRequest {

    private UsuarioDTO usuario;
    private String login;
    private Set<String> perfis;
}
