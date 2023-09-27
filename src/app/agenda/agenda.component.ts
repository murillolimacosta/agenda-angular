import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../confirm/confirm.component';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss']
})
export class AgendaComponent {

  agenda: any[] = [];

  titleNew: string = "Novo contato";
  titleEdit: string = "Edição de contato";

  newContact: boolean = true;

  contactSelected: any;

  contatoForm = new FormGroup({
    nome: new FormControl(''),
    telefone: new FormControl(''),
    email: new FormControl(''),
    endereco: new FormControl(''),
  });

  displayedColumns: string[] = ['nome', 'telefone', 'email', 'endereco', 'acoes'];
  dataSource = new MatTableDataSource<any>(this.agenda);

  constructor(private dialog: MatDialog) { 

    const storedAgendaString = window.localStorage.getItem('agenda');
    const storedAgenda = storedAgendaString ? JSON.parse(storedAgendaString) : null;

    if (storedAgenda) {
      this.agenda = storedAgenda;
      this.dataSource.data = this.agenda;
    }
  }

  onSubmit() {

    if (this.newContact) {
      this.insert();
    } else {
      this.edit();
    }
  }

  insert() {

    this.agenda.push(this.contatoForm.value);
    this.saveLocalStorage();

    this.dataSource.data = this.agenda; 
    this.contatoForm.reset();
  }

  edit() {

    const index = this.agenda.indexOf(this.contactSelected);

    if (index !== -1) {

      this.agenda[index] = this.contatoForm.value;
      this.dataSource.data = this.agenda; 
      this.newContact = true;

      this.saveLocalStorage();
      this.contatoForm.reset();
    }
  }

  saveLocalStorage() {
    window.localStorage.setItem('agenda', JSON.stringify(this.agenda));
  }

  setForm(contact: any) {
    this.contatoForm.setValue(contact);
    this.newContact = false;

    this.contactSelected = contact;
  }

  abrirDialog(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const dialogRef = this.dialog.open(ConfirmComponent, {
        width: '400px', // Defina a largura desejada
        data: { /* Dados para o diálogo, se necessário */ },
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }
  

  async delete(contact: any) {
    
    const resultadoDialog = await this.abrirDialog();
  
    if (resultadoDialog === true) {
      const index = this.agenda.indexOf(contact);
  
      if (index !== -1) {
        this.agenda.splice(index, 1);
        this.saveLocalStorage();
        this.dataSource.data = this.agenda;
      }
    }
  }

  new() {
    this.newContact = true;
    this.contatoForm.reset();
    this.contactSelected = [];
  }

}
