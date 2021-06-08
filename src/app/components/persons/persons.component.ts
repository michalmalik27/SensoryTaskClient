import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from 'src/app/services/data.service';
import { PersonDialogComponent } from '../person-dialog/person-dialog.component';
import Person from '../../models/person';
import { ActionState, ActionStates } from 'src/app/actionState';

@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.css'],
})
export class PersonsComponent implements OnInit {
  constructor(private dataService: DataService, public dialog: MatDialog) {}
  loadState!: ActionState;

  displayedColumns: string[] = [
    'personId',
    'idNumber',
    'firstName',
    'lastName',
    'professionName',
    'action',
  ];

  dataSource: MatTableDataSource<Person> = new MatTableDataSource();

  ngOnInit() {
    this.loadState = <ActionState>{action: ActionStates.INIT, message: ""};
    this.getPersons();
  }

  getPersons() {
    this.loadState.action = ActionStates.IN_PROCESS;
    this.loadState.message = "Load persons...";

    this.dataService.getPersons().subscribe((data) => {
      this.dataSource.data = data;
      this.loadState.action = ActionStates.IS_COMPLETED;
      this.loadState.message = "";

    });
  }

  addPerson() {
    this.openDialog('Add', undefined);
  }

  updatePerson(person: Person) {
    this.openDialog('Update', person);
  }

  deletePerson(person: Person) {
    this.openDialog('Delete', person);
  }

  openDialog(action: string, person: Person | undefined) {
    const dialogRef = this.dialog.open(PersonDialogComponent, {
      width: '600px',
      data: { action: action, person: person },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getPersons();
    });
  }
}
