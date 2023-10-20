import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";
import {UserData} from "../Interfaces/user-data.interface";

@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  roomsSubject: Subject<any[]> = new Subject<any[]>();
  messagesSubject: Subject<any[]> = new Subject<any[]>()
  roomsList: any[] = [];
  userRoomsList: any[] = []
  currentUser!: UserData;
  key: string = JSON.parse(localStorage.getItem("user") ?? "").key
  activeToken: string = JSON.parse(localStorage.getItem("auth") ?? "").localId
  roomKeyPairs: any[] = []

  constructor(private http: HttpClient) {
  }

  joinRoom(roomName: any): void {
    if (!this.roomsList.includes(roomName.name)) {
      this.http.post("https://angularcourse-b6e28-default-rtdb.europe-west1.firebasedatabase.app/rooms.json", roomName)
        .subscribe({
          next: (): void => {
            this.getAllRooms()
          }
        })
    }
    if (!this.userRoomsList.includes(roomName.name)) {
      if (this.currentUser.rooms == undefined) {
        this.currentUser.rooms = []
      }
      this.currentUser.rooms.push(roomName)
      this.http.put(`https://angularcourse-b6e28-default-rtdb.europe-west1.firebasedatabase.app/users/${this.key}.json`, this.currentUser).subscribe({
        next: (): void => {
          this.getUserRooms()
        }
      })
    }
  }

  getCurrentUserData(): void {
    this.http.get(`https://angularcourse-b6e28-default-rtdb.europe-west1.firebasedatabase.app/users.json?orderBy="localId"&equalTo="${this.activeToken}"`)
      .subscribe({
        next: (user: any): void => {
          this.currentUser = user[this.key]
        }
      })
  }

  getUserRooms(): void {
    this.http.get(`https://angularcourse-b6e28-default-rtdb.europe-west1.firebasedatabase.app/users/${this.key}.json`)
      .subscribe({
        next: (data: any): void => {
          this.userRoomsList = []
          data.rooms?.forEach((room: any): void => {
            this.userRoomsList.push(room.name)
          })
          this.roomsSubject.next(this.userRoomsList)
        }
      })
  }

  getAllRooms(): void {
    this.http.get(`https://angularcourse-b6e28-default-rtdb.europe-west1.firebasedatabase.app/rooms.json`)
      .subscribe({
        next: (data: any): void => {
          for (let key in data) {
            this.roomsList.push(data[key].name)
            this.roomKeyPairs.push({name: data[key].name, key: key})
          }
        }
      })
  }

  leaveRoom(index: number): void {
    this.currentUser.rooms.splice(index, 1)
    this.http.put(`https://angularcourse-b6e28-default-rtdb.europe-west1.firebasedatabase.app/users/${this.key}.json`, this.currentUser).subscribe({
      next: (): void => {
        this.getUserRooms()
      }
    })
  }

  sendMessage(room: string, message: string, creds: UserData): void {
    const randomId: string = Math.floor(Math.random() * Date.now()).toString(16)
    const payload = {message: message, sender: creds.username, date: new Date().toLocaleString()}
    const roomKey: any[] = this.roomKeyPairs.filter((value: any): boolean => {
      return value.name == room
    })
    this.http.post(`https://angularcourse-b6e28-default-rtdb.europe-west1.firebasedatabase.app/rooms/${roomKey[0].key}/messages.json`, payload).subscribe({
      next: (): void => {
        console.log("success")
      }
    })

  }

  getRoomMessages(roomName: string): void {
    const roomKey: any[] = this.roomKeyPairs.filter((value: any): boolean => {
      return value.name == roomName
    })
    this.http.get(`https://angularcourse-b6e28-default-rtdb.europe-west1.firebasedatabase.app/rooms/${roomKey[0].key}/messages.json`)
      .subscribe({
        next: (messages: any): void => {
          const messagesArray: any[] = []
          for (let key in messages) {
            messagesArray.unshift(messages[key])
          }
          this.messagesSubject.next(messagesArray)
        }
      })
  }
}
