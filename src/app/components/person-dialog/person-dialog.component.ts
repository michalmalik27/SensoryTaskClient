import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ActionState, ActionStates } from 'src/app/actionState';
import Person from 'src/app/models/person';
import Profession from 'src/app/models/profession';
import { DataService } from 'src/app/services/data.service';

interface personDialogData {
  action: string;
  person: Person | undefined;
}

@Component({
  selector: 'app-person-dialog',
  templateUrl: './person-dialog.component.html',
  styleUrls: ['./person-dialog.component.css'],
})
export class PersonDialogComponent implements OnInit {
  personForm: FormGroup = this.formBuilder.group({});
  professions: Profession[] = [];
  actionState: ActionState = <ActionState>{
    action: ActionStates.INIT,
    message: '',
  };

  http$: Observable<any> | undefined;

  constructor(
    public dialogRef: MatDialogRef<PersonDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: personDialogData,
    private dataService: DataService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.dataService.getProfessions().subscribe((data) => {
      this.professions = data;
    });

    this.personForm = this.formBuilder.group({
      idNumber: [
        this.data.person?.idNumber,
        [
          Validators.required,
          Validators.minLength(9),
          Validators.maxLength(9),
          Validators.pattern(/^[\d]+$/i),
        ],
      ],
      firstName: [
        this.data.person?.firstName,
        [
          Validators.required,
          Validators.pattern(/^[\u0590-\u05feA-Za-z-\s]+$/i),
          Validators.maxLength(20),
        ],
      ],
      lastName: [
        this.data.person?.lastName,
        [
          Validators.required,
          Validators.pattern(/^[\u0590-\u05feA-Za-z-\s]+$/i),
          Validators.maxLength(20),
        ],
      ],
      professionId: [this.data.person?.professionId, [Validators.required]],
    });
  }

  showFormControlError(key: string) {
    return (
      this.personForm.controls[key].touched &&
      this.personForm.controls[key].invalid
    );
  }

  showFormControlErrorType(key: string, error: string) {
    const errors = this.personForm.controls[key].errors;
    return errors && errors[error];
  }

  doAction() {
    if (!this.personForm.valid) {
      return;
    }

    this.actionState.action = ActionStates.IN_PROCESS;
    this.actionState.message = "Please wait to complete you'r action...";

    switch (this.data.action) {
      case 'Add':
        this.http$ = this.dataService.addPerson(
          <Person>(<Person>this.personForm.value)
        );
        break;
      case 'Update':
        this.http$ = this.dataService.updatePerson(<Person>{
          personId: this.data.person!.personId,
          ...this.personForm.value,
        });
        break;
      case 'Delete':
        this.http$ = this.dataService.deletePerson(this.data.person!);
        break;
      default:
        break;
    }
    this.http$!.subscribe(
      (data) => {
        this.dialogRef.close();
      },
      (err) => {
        console.log(err);
        this.actionState.message = err.error.title;
        this.actionState.action = ActionStates.IS_FAILED;
      }
    );
  }

  closeDialog() {
    this.actionState.action = ActionStates.INIT;
    this.actionState.message = '';

    this.dialogRef.close({ event: 'Cancel' });
  }
}
