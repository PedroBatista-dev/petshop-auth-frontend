// src/app/core/auth/models/auth.model.ts

/**
 * Modelo para o payload de login.
 */
export class LoginPayload {
    email!: string;
    password!: string;
  
    constructor(data?: Partial<LoginPayload>) {
      Object.assign(this, data);
    }
  }
  
  /**
   * Modelo para a resposta de login (contém o token JWT).
   */
  export class LoginResponse {
    access_token!: string;
  
    constructor(data?: Partial<LoginResponse>) {
      Object.assign(this, data);
    }
  }
  
  /**
   * Modelo para o perfil do usuário retornado pelo backend após autenticação.
   */
  export class UserProfile {
    userId!: string;
    email!: string;
    cargoDescricao!: string;
    codigoEmpresaId?: string;
  
    constructor(data?: Partial<UserProfile>) {
      Object.assign(this, data);
    }
  }
  
  /**
   * Modelo para o payload de registro de cliente.
   */
  export class RegisterClientPayload {
    nomeCompleto!: string;
    cpf!: string;
    dataNascimento!: string; 
    sexo!: string;
    estadoCivil!: string;
    telefone!: string;
    email!: string;
    password!: string;
  
    constructor(data?: Partial<RegisterClientPayload>) {
      Object.assign(this, data);
    }
  
  }
  
  /**
   * Modelo para o payload de esqueci a senha (apenas e-mail).
   */
  export class ForgotPasswordPayload {
    email!: string;
  
    constructor(data?: Partial<ForgotPasswordPayload>) {
      Object.assign(this, data);
    }
  }
  
  /**
   * Modelo para o payload de redefinição de senha.
   */
  export class ResetPasswordPayload {
    token!: string;
    newPassword!: string;
  
    constructor(data?: Partial<ResetPasswordPayload>) {
      Object.assign(this, data);
    }
  }