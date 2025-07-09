// src/app/shared/services/notification.service.ts
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  success(title: string, text: string = '') {
    Swal.fire({
      icon: 'success',
      title: title,
      text: text,
      confirmButtonText: 'Ok'
    });
  }

  error(title: string, text: string = '') {
    Swal.fire({
      icon: 'error',
      title: title,
      text: text,
      confirmButtonText: 'Ok'
    });
  }

  warning(title: string, text: string = '') {
    Swal.fire({
      icon: 'warning',
      title: title,
      text: text,
      confirmButtonText: 'Ok'
    });
  }

  confirm(title: string, text: string = 'Você tem certeza?') {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, continuar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      return result.isConfirmed;
    });
  }

  loading(title: string = 'Carregando...') {
    Swal.fire({
      title: title,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  closeLoading() {
    Swal.close();
  }
}