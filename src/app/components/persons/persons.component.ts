import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { DataService } from 'src/app/services/data.service';
import Person from '../../models/person';
import { PersonDialogComponent } from '../person-dialog/person-dialog.component';

@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.css'],
})
export class PersonsComponent implements OnInit {
  constructor(private dataService: DataService, public dialog: MatDialog) {}
  loaded: boolean = true;
  @Output() selectedPeopleEvent = new EventEmitter<Person>();
  clickedRows = new Set<Person>();

  displayedColumns: string[] = [
    'personId',
    'idNumber',
    'firstName',
    'lastName',
    'professionName',
    'action',
  ];
  dataSource: MatTableDataSource<Person> = new MatTableDataSource();

  @ViewChild(MatTable, { static: true })
  table!: MatTable<any>;

  ngOnInit() {
    this.getPersons();
  }

  getPersons() {
    this.dataService.getPersons().subscribe((data) => {
      this.dataSource.data = data;
      this.loaded = true;
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
