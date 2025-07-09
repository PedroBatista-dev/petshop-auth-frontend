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
  
    // Método para limpar o CPF antes de enviar
    getCleanedCpf(): string {
      return this.cpf ? this.cpf.replace(/[^\d]+/g, '') : '';
    }
  
    // Método para limpar o Telefone antes de enviar
    getCleanedTelefone(): string {
      return this.telefone ? String(this.telefone).replace(/[^\d]+/g, '') : '';
    }
  
    // Método para formatar a data de nascimento para o backend
    getFormattedDataNascimento(): string {
      if (!this.dataNascimento) return '';
      const parts = this.dataNascimento.split('/');
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`; // AAAA-MM-DD
      }
      return this.dataNascimento; // Retorna original se não estiver no formato esperado
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