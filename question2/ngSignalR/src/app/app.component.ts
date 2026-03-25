import { Component } from '@angular/core';
import * as signalR from "@microsoft/signalr"
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [MatButtonModule]
})
export class AppComponent {
  title = 'Pizza Hub';

  private hubConnection?: signalR.HubConnection;
  isConnected: boolean = false;

  selectedChoice: number = -1;
  nbUsers: number = 0;

  pizzaPrice: number = 0;
  money: number = 0;
  nbPizzas: number = 0;

  constructor() {
    this.connect();
  }

 connect() {
  this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl('http://localhost:5282/hubs/pizza')
    .build();

  this.hubConnection.start().then(() => {
    console.log("Connected to SignalR hub");
    this.isConnected = true;
  }).catch(err => console.error(err));

  // EVENTS
  this.hubConnection.on("UpdateNbUsers", (nbUsers) => {
    console.log("NbUsers:", nbUsers);
    this.nbUsers = nbUsers;
  });

  this.hubConnection.on("UpdatePizzaPrice", (price) => {
    this.pizzaPrice = price;
  });

  this.hubConnection.on("UpdateMoney", (money) => {
    this.money = money;
  });

  this.hubConnection.on("UpdateNbPizzasAndMoney", (nbPizzas, money) => {
    this.nbPizzas = nbPizzas;
    this.money = money;
  });
}

  selectChoice(selectedChoice: number) {
    this.selectedChoice = selectedChoice;

    this.hubConnection?.invoke("SelectChoice", selectedChoice);
  }

  unselectChoice() {
    this.hubConnection?.invoke("UnselectChoice", this.selectedChoice);

    this.selectedChoice = -1;
  }

  addMoney() {
     console.log("Clicked add money");
     this.hubConnection?.invoke("AddMoney", this.selectedChoice);      
    }

  buyPizza() {
    console.log("Clicked buy pizza");
     this.hubConnection?.invoke("BuyPizza", this.selectedChoice);
  }
}
