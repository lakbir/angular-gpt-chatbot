import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Component({
  selector: 'app-gpt',
  templateUrl: './gpt.component.html',
  styleUrls: ['./gpt.component.css']
})
export class GptComponent  implements OnInit{

  queryFormGroup! : FormGroup;
  messages=[
    {role : "system", content : "You are a helpful assistant."}
  ];
  result : any;

  constructor(private fb: FormBuilder, private httpClient: HttpClient) {
  }

  ngOnInit(): void {
    this.queryFormGroup = this.fb.group({
      query : this.fb.control("")
    })
  }


  handleAskGPT() {
    let url = "https://api.openai.com/v1/chat/completions";
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer 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`
    });
    this.messages.push({
      role:"system", content: this.queryFormGroup.value.query
    })
    let payload = {
      model : "gpt-3.5-turbo",
      messages : this.messages
    }
    this.httpClient.post(url,payload, { headers } )
      .subscribe({
        next : (resp) => {
        this.result = resp;
        this.result.choices.forEach((choice:any) => {
          this.messages.push({
            role : "assistant",
            content: choice.message.content
          })
        })
        },
        error : (err) => {
        console.error(err)
        }
      })
  }
}
