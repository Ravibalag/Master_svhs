import { Component } from "@angular/core";
import { CoreDashboardHomeHandlerService } from "@features/courses/services/handlers/dashboard-home";
import { CoreNavigator } from "@services/navigator";
import { CoreSites } from "@services/sites";
import { HttpClient } from '@angular/common/http';
import { CoreCourseFormatDelegate } from "@features/course/services/format-delegate";
import { CoreCourseAnyCourseData, CoreCourses } from "@features/courses/services/courses";
import { CoreDelegate } from "@classes/delegate";
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { COURSE_INDEX_PATH } from "@features/course/course-lazy.module";
import { baseUrl } from "../dashboard/dashboard";
import { CoreCourseHelper } from "@features/course/services/course-helper";
// import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';



@Component({
    selector: 'page-core-courses-incompletedCourse',
    templateUrl: 'incompletedCourse.html',
    styleUrls: ["incompletedCourse.scss"],

})

export class incompletedCourse {
  [x: string]: any;

    userId?: number;
    inCompletedValue: any[] = [];
     GradeValue: any[] = [];
    value1: number = 0;
    progressbar: number=0;
    isLoading: boolean = true;
    constructor(private http: HttpClient, private router: Router) {

    }

    ngOnInit(): void {
      // setTimeout(() => {
      //   this.isLoading = false;
      // }, 5000),
        this.userId = CoreSites.getCurrentSiteUserId();
        this.getDashboardData(this.userId)
        console.log(baseUrl);

      }

      getcal(inCompletedValue: any) {
         const progressValue = inCompletedValue.progress_value; // Example progress value in percentage
         this.value1 = progressValue / 100;
       return this.value1;
       }

      getDashboardData(userId: number) {
        const currentSiteUrl = CoreSites.getRequiredCurrentSite().getURL();
        this.http.get(baseUrl+`/webservice/rest/server.php?wstoken=900be856a14cea6109ef1f3f675879b7&wsfunction=local_mobile_store_courses_dashboard_list&moodlewsrestformat=json&userid=`+userId)
        .subscribe((data: any) => {
           this.inCompletedValue = data.Notcompleted;
           this.isLoading = false;
           console.log("dashboard_value",this.inCompletedValue);
        });
     }
     gradebooksClick(courseId:number) {
      CoreNavigator.navigateToSitePath(`/main/home/grades/`+courseId);
     }

     async courseClick(courseId:number){
          try {
            const course = await CoreCourses.getUserCourse(courseId);
            // this.course = Object.assign(this.course, course);
            console.log("complete", course);
            CoreCourseHelper.openCourse(course, { params: { isGuest: false } });
          } catch (error) {
            console.error("Error fetching course:", error);
        }
     }

}
