import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {RoomsService} from "../../Services/rooms.service";
import {Messages} from "../../Interfaces/messages.interface";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  joinRoomGroup!: FormGroup;
  chatRoomGroup!: FormGroup;
  emptyJoin!: string;
  roomsList: string[] = [];
  userCreds = JSON.parse(localStorage.getItem("user") ?? "")
  activeRoom: string = "";
  roomsImmutable!: string[];
  activeMessages!: Messages[];
  toggle: boolean = false;

  constructor(
    private router: Router,
    private roomsService: RoomsService) {
  }

  ngOnInit(): void {
    this.roomsService.getCurrentUserData()
    this.joinRoomGroup = new FormGroup({
      name: new FormControl('', Validators.required)
    })
    this.chatRoomGroup = new FormGroup({
      text: new FormControl('', Validators.required)
    })

    this.roomsService.getUserRooms()
    this.roomsService.getAllRooms()

    this.roomsService.roomsSubject.subscribe({
      next: (value: string[]): void => {
        this.roomsList = []
        value.forEach((room: string): void => {
          this.roomsList.push(room)
        })
        this.roomsImmutable = this.roomsList
      }
    })

    this.roomsService.messagesSubject.subscribe({
      next: (value: Messages[]): void => {
        this.activeMessages = value
      }
    })
  }

  onSearchRoom(data: Event): void {
    this.roomsList = this.roomsImmutable
    this.roomsList = this.roomsList.filter((room: string): boolean => {
      return room.includes((<HTMLInputElement>data.target).value);
    });
  }

  onLogout(): void {
    localStorage.clear()
    location.reload()
    this.router.navigate(['/'])
  }

  onJoin(): void {
    if (this.joinRoomGroup.status != "VALID") {
      this.emptyJoin = "Can't join an empty room"
      return
    }
    this.emptyJoin = ""
    this.roomsService.joinRoom(this.joinRoomGroup.value)
    this.joinRoomGroup.reset()
  }

  onLeave(index: number): void {
    this.activeRoom = ""
    this.roomsService.leaveRoom(index);
  }

  getMessageInterval!: ReturnType<typeof setInterval>
  onActiveRoom(event: string): void {
    clearInterval(this.getMessageInterval)
    this.getMessageInterval = setInterval((): void=>{
      this.roomsService.getRoomMessages(event)
    }, 250)
    this.activeRoom = event
    this.toggle = false;
  }

  onMessage(): void {
    this.roomsService.sendMessage(this.activeRoom, this.chatRoomGroup.value.text, this.userCreds)
    this.chatRoomGroup.reset()
  }

  onToggleMenu(): void {
    this.toggle = !this.toggle;
  }
}
