import { Component } from '@angular/core';
import { AuthService } from '../../../../../projects/core-auth/src/lib/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  constructor(
    private authService: AuthService,
  ) {
  }

  sair(): void {
    this.authService.logout();
  }
}
