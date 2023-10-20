import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../Services/auth.service";
import {Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {RoomsService} from "../../Services/rooms.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit{
  joinRoomGroup!: FormGroup;
  chatRoomGroup!: FormGroup;
  emptyJoin!: string;
  roomsList: any[] = [];
  userCreds = JSON.parse(localStorage.getItem("user") ?? "")
  activeRoom: string = "noRoom";
  roomsImmutable!: any[];
  activeMessages!: any[];
  toggle: boolean = false;
  constructor(private authService: AuthService,
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
      next: (value): void =>{
        this.roomsList = []
        value.forEach((room: any): void=>{
          this.roomsList.push(room)
        })
        this.roomsImmutable = this.roomsList
      }
    })
    this.roomsService.messagesSubject.subscribe({
      next: (value: any[]): void => {
        this.activeMessages = value
      }
    })
  }


  onSearchRoom(data: any): void {
    this.roomsList = this.roomsImmutable
    this.roomsList = this.roomsList.filter((room: any): boolean => {
      return room.includes(data.target.value);
    });
  }

  onLogout(){
    localStorage.clear()
    location.reload()
    this.router.navigate(['/'])
  }

  onJoin(): void {
    if(this.joinRoomGroup.status!="VALID"){
      this.emptyJoin = "Can't join an empty room"
      return
    }
    this.emptyJoin = ""
    this.roomsService.joinRoom(this.joinRoomGroup.value)
    this.joinRoomGroup.reset()
  }

  onLeave(index: number): void{
    this.activeRoom = "noRoom"
    this.roomsService.leaveRoom(index);
  }

  onActiveRoom(event: any): void{
    this.activeRoom = event
    this.roomsService.getRoomMessages(event)
    this.toggle = false;
  }

  onMessage(): void{
    this.roomsService.sendMessage(this.activeRoom, this.chatRoomGroup.value.text, this.userCreds)
    this.chatRoomGroup.reset()
  }

  onToggleMenu(): void{
    this.toggle = !this.toggle
    console.log(this.toggle)
  }
}
