import {AuthService} from "./auth/auth.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Injectable} from "@angular/core";
import { environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class ClipboardService {

  constructor(private snackBar: MatSnackBar) {}

  public  getQuizUrl(quizID: string){
    const baseUrl = window.location.origin + environment.baseHref;
    return `${baseUrl}/quiz?id=${quizID}`;
  }

  public  copyQuizUrl(quizID: string){
    this.copyToClipboard(this.getQuizUrl(quizID));
  }

  private SnackBarCopied(){
    console.log("SnackBAR")
    this.snackBar.open('Copied!', "OK", {
      duration: 5000
    })
  }
  public copyToClipboard(text: string) {

    if (!navigator.clipboard){
      const input = document.createElement('input');
      input.style.position = 'fixed';
      input.style.opacity = '0';
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      this.SnackBarCopied()
    } else{
      navigator.clipboard.writeText(text).then(
        () =>{
          this.SnackBarCopied()
        })
        .catch(
          function() {
            // err
          });
    }
  }
}
