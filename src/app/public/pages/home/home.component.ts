import { Component } from '@angular/core';
import { RoleSwitcherComponent } from '../../../access-security/components/role-switcher/role-switcher.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RoleSwitcherComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent  {

}
