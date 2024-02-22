import { Component, ViewChild } from "@angular/core";
import { CoreNavigator } from '@services/navigator';
import { HttpClient } from '@angular/common/http';
import { CoreSites } from "@services/sites";
import { NavController } from '@ionic/angular';
import { log } from "console";
import { CartPage } from "../cart/cart";
import { IonSearchbar } from '@ionic/angular';
import { baseUrl } from "../dashboard/dashboard";

@Component({
    selector: 'page-core-courses-filterCart',
    templateUrl: 'filterCart.html',
    styleUrls:["filterCart.scss"]

})

export class FilterCart{
  @ViewChild('searchbar') searchbar!: IonSearchbar;
      userId?: number;
    filteredResults: any[]=[];
    responseValue: any[] = [];
    convertedString: string = '';
    searchText:string='';
    searchQuery: string = '';
    ucCheckboxValue: number = 0;
    ncaaCheckboxValue: number = 0;
    type:string='';




    constructor(private http: HttpClient ,public navCtrl: NavController) {}


    search(query: string) {
      if(query){
        this.ucCheckboxValue=0
        this.ncaaCheckboxValue=0
        this.clearRadioOptions()
        query = query.toLowerCase();
        this.searchText=query;
        this.type='search';
        console.log("searchtext",this.searchText);
      }
      }

    ngOnInit(): void {
        this.userId = CoreSites.getCurrentSiteUserId();
        this.getData(this.userId);
        console.log(baseUrl);

      }


      getData(userId: number) {
        console.log("id",this.userId);
         // document.getElementById('response').textContent = data.data;
         this.http.get(baseUrl+`/webservice/rest/server.php?wstoken=900be856a14cea6109ef1f3f675879b7&wsfunction=local_mobile_store_courses_store_course_data&moodlewsrestformat=json&userid=`+userId)
         .subscribe((data: any) => {

           console.log("Response",data.data);
            this.responseValue = data.data;
         });
      }
      clearRadioOptions() {
        this.searchText = '';
        this.type='';
        // Get all radio buttons within the filter div
        const radioButtons = document.querySelectorAll('.filter input[type="radio"]');
        // Loop through each radio button and clear the selection
        radioButtons.forEach((radioButton: any) => {
          radioButton.checked = false;
        });
      }


      onRadioButtonChange(event: any) {
         this.searchText = '';
        this.searchQuery='';
        this.type='radio'
        this.searchText = event.target.value;
        console.log('Selected option:', this.searchText);
      }

      updateUCCheckboxValue(event: CustomEvent) {
        this.ucCheckboxValue = event.detail.checked ? 1 : 0;
        console.log("uc..",this.ucCheckboxValue);
      }

      updateNCAACheckboxValue(event: CustomEvent) {
        this.ncaaCheckboxValue = event.detail.checked ? 1 : 0;
        console.log("ncaa..",this.ncaaCheckboxValue);
      }




     apply() {
       this.convertedString = this.ucCheckboxValue + "|" + this.ncaaCheckboxValue + "|" + this.searchText + "|" + this.type;
       console.log("sending_values",this.convertedString);


      CoreNavigator.navigateToSitePath('/courses/cart',{ params : { filter: this.convertedString } });
    }
}
