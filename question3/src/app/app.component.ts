import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CloseScrollStrategy } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';

interface Questions {
  nom?: String | null 
}
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [CommonModule,MatToolbarModule, MatIconModule, MatCardModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule]
})
export class AppComponent {
  title = 'reactive.form';
  formGroup: FormGroup<any>;
  data : Questions | null = null;

  constructor(private formBuilder: FormBuilder)    
   { 
    this.formGroup = this.formBuilder.group(
      {
        nom: ['', Validators.required],  
       roadnumber: ['', [Validators.required, Validators.min(1000), Validators.max(9999)]],
      rue: [''],
      postalcode: ['', Validators.pattern(/^[A-Z][0-9][A-Z][ ]?[0-9][A-Z][0-9]$/)],
      comments: ['', this.commentValidator.bind(this)]
      }, {validators: this.objValidation});

    this.formGroup.valueChanges.subscribe(() => {
      this.data = this.formGroup.value;
    });
  }

  commentValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
    const words = value.trim().split(/\s+/).filter((w: string | any[]) => w.length > 0);
    if (value && words.length < 10) {
      return { minWords: true };
    }
    return null;
  }
  
  objValidation(control: AbstractControl): ValidationErrors | null {
    // On récupère les valeurs de nos champs textes
    const questionNom = control.get('nom')?.value?.toLowerCase()|| '';
    const comments = control.get('comments')?.value?.toLowerCase() || '';

     if (comments && questionNom && comments.includes(questionNom)) {
      return { commentContainsName: true };
    }
    return null;
  }

  submitForm() {
    if (this.formGroup.valid) {
      console.log('Form submitted', this.formGroup.value);
      alert('Formulaire soumis avec succès !');
    } else {
      this.formGroup.markAllAsTouched(); // Affiche toutes les erreurs
    }
  }
}

