import { Component,HostListener } from "@angular/core";

import { CoreSites } from '@services/sites';
import { HttpClient } from '@angular/common/http';
import { CoreNavigator } from "@services/navigator";
import { baseUrl } from "../dashboard/dashboard";

@Component({
    selector: 'page-core-courses-orders',
    templateUrl: 'orders.html',
    styleUrls:["orders.scss"]

})

export class Orders {
    responseValue: any[] = [];
    isLoading: boolean = true;
    userId?: number;
    isMobile?: boolean;

    constructor(private http: HttpClient ) {
      this.onResize(null);
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
      this.isMobile = window.innerWidth < 768; // Adjust the breakpoint (e.g., 768) for tablets
    }
    isMobileView() {
      return this.isMobile;
    }
  ngOnInit(): void {
    // setTimeout(() => {
    //   this.isLoading = false;
    // }, 5000),
    this.userId = CoreSites.getCurrentSiteUserId();

    this.getData(this.userId);
    console.log(baseUrl);

  }

    getData(userId: number) {

        console.log("id",this.userId);

         // document.getElementById('response').textContent = data.data;
         this.http.get(baseUrl+`/webservice/rest/server.php?wstoken=9b90c397414127d3515d94173fd9ee70&wsfunction=local_mobile_store_courses_order_lists&moodlewsrestformat=json&userid=`+userId)
         .subscribe((data: any) => {
           console.log("Respoms",data.data);
            this.responseValue = data.data;
            this.isLoading = false;


         });
      }

      openPDF(r :any){
        if (r.invoice) {
            window.open(r.invoice, '_system', 'location=yes');
        } else {
            alert('No invoice available.');
          }

      }

}
