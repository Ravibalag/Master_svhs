import { Component } from "@angular/core";
import { CoreDashboardHomeHandlerService } from "@features/courses/services/handlers/dashboard-home";
import { CoreNavigator } from "@services/navigator";
import { CoreSites } from "@services/sites";
import { HttpClient } from '@angular/common/http';
import { baseUrl } from "../dashboard/dashboard";

@Component({
    selector: 'page-core-courses-completedCourse',
    templateUrl: 'completedCourse.html',
    styleUrls: ["completedCourse.scss"],

})

export class CompletedCourse {
    userId?: number;
    CompletedValue: any[] = [];
    value1: number = 0;
    progressbar: number=0;
    isLoading: boolean = true;


    constructor(private http: HttpClient) {}

    ngOnInit(): void {
      // setTimeout(() => {
      //    this.isLoading = false;
      //  }, 5000),
        this.userId = CoreSites.getCurrentSiteUserId();
        this.getDashboardData(this.userId)
        console.log(baseUrl);

       // const progressValue = 7.40; // Example progress value in percentage
        this.value1 =   100;
      }

      getDashboardData(userId: number) {
        this.http.get(baseUrl+`/webservice/rest/server.php?wstoken=900be856a14cea6109ef1f3f675879b7&wsfunction=local_mobile_store_courses_dashboard_list&moodlewsrestformat=json&userid=`+userId)
        .subscribe((data: any) => {

           this.CompletedValue = data.Completed;
           this.isLoading = false;
        //    this.CompletedValue.forEach((item) => {
        //     this.progressbar = item.progress_value; // Normalize the progress value
        //   });
           console.log("dashboard_value",this.CompletedValue);


        });


     }
     gradebooksClick(courseId:number) {
      CoreNavigator.navigateToSitePath(`/main/home/grades/`+courseId);
     }


}
