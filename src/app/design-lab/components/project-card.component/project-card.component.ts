import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Project } from '../../model/project.entity';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-project-card',
    standalone: true,
    imports: [CommonModule, MatCardModule, RouterLink, MatIconModule, MatButtonModule],
    templateUrl: './project-card.component.html',
    styleUrl: './project-card.component.css',
})
export class ProjectCardComponent {
    @Input() project!: Project;
    @Output() deleted = new EventEmitter<string>();
    constructor() {}

    deleteProject() {
        this.deleted.emit(this.project.id);
    }

    isValidDate(date: any): boolean {
        return date instanceof Date && !isNaN(date.getTime());
    }

    getSize(project: any): string {
        // Busca garmentSize o tshirt_size, y valida que no sea vacío
        const size = project.garmentSize || project.tshirt_size;
        if (!size || (typeof size === 'string' && size.trim() === '')) {
            return 'N/A';
        }
        return size;
    }

    getLastModified(project: any): string {
        // Busca lastModified o last_modified, y createdAt o created_at
        const getDate = (val: any) => {
            if (!val) return null;
            if (val instanceof Date && !isNaN(val.getTime())) return val;
            const d = new Date(val);
            return isNaN(d.getTime()) ? null : d;
        };
        let date = getDate(project.lastModified || project.last_modified);
        if (!date) {
            date = getDate(project.createdAt || project.created_at);
        }
        if (date) {
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        }
        return 'N/A';
    }
}
