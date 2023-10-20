import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private http: HttpClient) {
  }

  ngOnInit(): void {
    if (!localStorage.getItem("auth")) {
      this.router.navigate(['/auth'])
    } else {
      this.router.navigate(['/chat'])
    }
  }
}
