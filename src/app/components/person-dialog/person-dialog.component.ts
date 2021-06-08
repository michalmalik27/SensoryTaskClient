import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
      idNumber: [this.data.person?.idNumber, [Validators.required]],
      firstName: [this.data.person?.firstName, [Validators.required]],
      lastName: [this.data.person?.lastName, [Validators.required]],
      professionId: [this.data.person?.professionId, [Validators.required]],
    });
  }

  doAction() {
    if (!this.personForm.valid) {
      return;
    }
    console.log(this.personForm.value);
    switch (this.data.action) {
      case 'Add':
        this.dataService
          .addPerson(<Person>this.personForm.value)
          .subscribe((data) => {
            this.dialogRef.close();
          });
        break;
      case 'Update':
        this.dataService
          .updatePerson(<Person>{
            personId: this.data.person!.personId,
            ...this.personForm.value,
          })
          .subscribe((data) => {
            this.dialogRef.close();
          });
        break;
      case 'Delete':
        this.dataService.deletePerson(this.data.person!).subscribe((data) => {
          this.dialogRef.close();
        });
        break;
      default:
        break;
    }
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
