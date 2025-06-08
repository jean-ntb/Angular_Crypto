import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ApiService } from '../../../services/api.service';
import { User } from '../../../models/user.interface';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-container">
      <h2>Mon Profil</h2>
      <div *ngIf="user" class="profile-card">
        <div class="profile-item">
          <strong>Nom:</strong> {{ user.name }}
        </div>
        <div class="profile-item">
          <strong>Email:</strong> {{ user.email }}
        </div>
        <div class="profile-item">
          <strong>ID:</strong> {{ user.id }}
        </div>
        <div *ngIf="additionalData">
          <div class="profile-item">
            <strong>Société:</strong> {{ additionalData.company?.name }}
          </div>
          <div class="profile-item">
            <strong>Téléphone:</strong> {{ additionalData.phone }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 0 1rem;
    }
    .profile-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .profile-item {
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;
    }
    .profile-item:last-child {
      border-bottom: none;
    }
  `]
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  additionalData: any = null;

  constructor(
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.apiService.getMockUser().subscribe({
      next: (data: any) => {
        this.additionalData = data;
      }
    });
  }
}