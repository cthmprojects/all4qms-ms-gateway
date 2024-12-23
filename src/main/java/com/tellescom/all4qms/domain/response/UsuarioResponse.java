package com.tellescom.all4qms.domain.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UsuarioResponse {

    private Long id;
    private String nome;
    private String email;

    public UsuarioResponse(Long id, String nome) {
        this.id = id;
        this.nome = nome;
    }
}
