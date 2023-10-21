import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";
import {UserData} from "../Interfaces/user-data.interface";
import {RoomKey} from "../Interfaces/room-key.interface";
import {Messages} from "../Interfaces/messages.interface";
import {Payload} from "../Interfaces/payload.interface";

@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  roomsSubject: Subject<string[]> = new Subject<string[]>();
  messagesSubject: Subject<Messages[]> = new Subject<Messages[]>()
  roomsList: string[] = [];
  userRoomsList: string[] = []
  currentUser!: UserData;
  key: string = JSON.parse(localStorage.getItem("user") ?? "").key
  activeToken: string = JSON.parse(localStorage.getItem("auth") ?? "").localId
  roomKeyPairs: RoomKey[] = []

  constructor(private http: HttpClient) {
  }
  baseUrl: string = "https://angularcourse-b6e28-default-rtdb.europe-west1.firebasedatabase.app"

  joinRoom(roomName: {name: string}): void {
    if (!this.roomsList.includes(roomName.name)) {
      this.http.post(`${this.baseUrl}/rooms.json`, roomName)
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
      this.http.put(`${this.baseUrl}/users/${this.key}.json`, this.currentUser).subscribe({
        next: (): void => {
          this.getUserRooms()
        }
      })
    }
  }

  getCurrentUserData(): void {
    this.http.get<UserData>(`${this.baseUrl}/users.json?orderBy="localId"&equalTo="${this.activeToken}"`)
      .subscribe({
        next: (user: any): void => {
          this.currentUser = user[this.key]
        }
      })
  }

  getUserRooms(): void {
    this.http.get<UserData>(`${this.baseUrl}/users/${this.key}.json`)
      .subscribe({
        next: (data: UserData): void => {
          this.userRoomsList = []
          data.rooms?.forEach((room: {name: string}): void => {
            this.userRoomsList.push(room.name)
          })
          this.roomsSubject.next(this.userRoomsList)
        }
      })
  }

  getAllRooms(): void {
    this.http.get(`${this.baseUrl}/rooms.json`)
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
    this.currentUser.rooms?.splice(index, 1)
    this.http.put(`${this.baseUrl}/users/${this.key}.json`, this.currentUser).subscribe({
      next: (): void => {
        this.getUserRooms()
      }
    })
  }

  getRoomkeys(roomName: string): RoomKey[]{
    return this.roomKeyPairs.filter((value: RoomKey): boolean => {
      return value.name == roomName
    })
  }

  sendMessage(room: string, message: string, creds: UserData): void {
    const payload: Payload = {message: message, sender: creds.username, date: new Date().toLocaleString()}
    const roomKey: RoomKey[] = this.getRoomkeys(room)

    this.http.post(`${this.baseUrl}/rooms/${roomKey[0].key}/messages.json`, payload)
      .subscribe()

  }

  getRoomMessages(roomName: string): void {
    const roomKey: RoomKey[] = this.getRoomkeys(roomName)
    this.http.get<Messages>(`${this.baseUrl}/rooms/${roomKey[0].key}/messages.json`)
      .subscribe({
        next: (messages: any): void => {
          const messagesArray: Messages[] = []
          for (let key in messages) {
            messagesArray.unshift(messages[key])
          }
          this.messagesSubject.next(messagesArray)
        }
      })
  }
}
