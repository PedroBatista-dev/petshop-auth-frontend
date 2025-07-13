// src/app/shared/models/empresa.model.ts

/**
 * Modelo simples para a entidade Empresa no frontend.
 * Contém apenas os campos necessários para o autocomplete.
 */
export class Empresa {
    id!: string;
    razaoSocial!: string;
    sigla?: string;
    cnpj?: string;
  
    constructor(data?: Partial<Empresa>) {
      Object.assign(this, data);
    }
  }