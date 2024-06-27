import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit{

  selectedLicense:File[]=[];
  constructor(){

  }
  ngOnInit(): void {
      
  }
  onSelectLicense(event:Event){
    console.log(event);
    const files: FileList | null = (event.target as HTMLInputElement).files;
    if(files && files.length>0){
        const fileArray= Array.from(files);
        console.log(fileArray);
        this.selectedLicense=[...fileArray];
    }
  }
  onRemoveLicense(){
    this.selectedLicense=[];
  }
}
