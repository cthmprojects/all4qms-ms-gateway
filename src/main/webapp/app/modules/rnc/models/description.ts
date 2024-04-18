export type RncDescription = {
  details: string;
  evidence: string;
  requirement: string;
  rncId: number;
  anexos: Array<File>;
};

export type DescriptionResponse = {
  id?: number;
  detalhesNaoConformidade?: string;
  requisitoDescumprido?: string;
  evidenciaObjetiva?: string;
  idNaoConformidade: number;
  anexos?: [
    {
      id?: number;
      nomeArquivoFisico?: string;
      nomeArquivoOriginal?: string;
      idDescricaoNaoConformidade?: string;
      idReclamacao?: number;
    }
  ];

  anexosRequest?: File;
};

export type EvidenciaAnexo = {
  anexos?: [
    {
      id?: number;
      nomeArquivoFisico?: string;
      nomeArquivoOriginal?: string;
      idDescricaoNaoConformidade?: string;
      idReclamacao?: number;
    }
  ];
  evidenciaObjetiva?: string;
};
