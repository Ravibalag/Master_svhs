// (C) Copyright 2015 Moodle Pty Ltd.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Component, OnDestroy, OnInit } from '@angular/core';
import { CoreCoursesHelper, CoreEnrolledCourseDataWithExtraInfo } from '@features/courses/services/courses-helper';
import { IonRefresher,NavController,Platform } from '@ionic/angular';
import { CoreNavigator } from '@services/navigator';
import { CoreSites } from '@services/sites';
import { CoreDomUtils } from '@services/utils/dom';
import { CoreEventObserver, CoreEvents } from '@singletons/events';
import { CoreCourseBasicSearchedData, CoreCourses, CoreCoursesProvider } from '../../services/courses';
import { InAppBrowser } from '@ionic-native/in-app-browser';
type CoreCoursesListMode = 'search' | 'all' | 'my';
import { HttpClient } from '@angular/common/http';
import { CoreSiteInfo } from '@classes/site';
import { CartService } from '../cartService';
import { ActivatedRoute } from '@angular/router';
import { baseUrl } from '../dashboard/dashboard';
/**
 * Page that shows a list of courses.
 */
@Component({
    selector: 'page-core-courses-cart',
    templateUrl: 'cart.html',
    styleUrls:["cart.scss"]
})
export class CartPage {
  userId?: number;
  id:any;
  responseValue: any[] = [];
  courseId?:any;
  count?:number;
  filteredResults:string='';
  U_california :string='';
  Ncaa :string='';
  type:string='';
  isLoading: boolean = true;



 async toggleDesign() {
  CoreNavigator.navigateToSitePath('/courses/filterCart');
  }
    constructor(private http: HttpClient ,public platform: Platform,public navCtrl: NavController,private cartService: CartService,private route: ActivatedRoute) {}
    async viewCart(): Promise<void> {
      CoreNavigator.navigateToSitePath('/courses/viewCart');
  }
//   openCourseList() {

//     window.open('https://svhs.co/course-catalog/', '_blank');
// }
// openCourseCatalog() {

//   window.open('https://svhs.co/pdf/svhs-flyer.pdf', '_blank');
// }
// openAbout() {

//   window.open('https://svhs.co/about/', '_blank');
// }
// openQuestions() {

//   window.open('https://svhs.co/support/', '_blank');
// }

ionViewDidEnter() {

  this.route.queryParams.subscribe(params => {

      const filterString = params.filter.toLowerCase();

    let separatedStrings = filterString.split("|");
    this.U_california=separatedStrings[0]
    this.Ncaa=separatedStrings[1]
    this.filteredResults=separatedStrings[2]
    this.type=separatedStrings[3]
        this.filterStore()
      // Use the filterString as needed
      console.log("getting_value",this.filteredResults);
      console.log("getting_value_u_cal",this.U_california);
      console.log("getting_value_Ncaa",this.Ncaa);
      console.log("getting_value_Type",this.type);


  });

}
ionViewWillLeave(){
  this.userId = CoreSites.getCurrentSiteUserId();
  this.getData(this.userId);
}

filterStore(){

  this.responseValue = this.responseValue.filter(item => {
    // Perform filtering based on your criteria
    // For example, if you have a 'name' property in the API response:
       const itemName = item.Course_Name.toLowerCase();
        const itemSubject = item.Branch_Name.toLowerCase();
        const approved_Califorina=item.U_california;
        const approved_Ncaa=item.Ncaa;
if(this.type === 'radio'){
  console.log("radioin");
  if(this.U_california ==='0' && this.Ncaa === '0'){
    return  itemSubject.includes(this.filteredResults)
  }else{
    if(this.U_california === '1' && this.Ncaa ==='0'){
      return  itemSubject.includes(this.filteredResults) && (approved_Califorina.includes(this.U_california));

    } else if(this.U_california === '0' && this.Ncaa ==='1'){
      return  itemSubject.includes(this.filteredResults) && (approved_Ncaa.includes(this.Ncaa));

    }else{
      return  itemSubject.includes(this.filteredResults) && (approved_Califorina.includes(this.U_california) || approved_Ncaa.includes(this.Ncaa));

    }

  }
}else{
  console.log("searchin");
  if(this.U_california ==='0' && this.Ncaa === '0'){
    return  itemName.includes(this.filteredResults)
  }else{
    if(this.U_california === '1' && this.Ncaa ==='0'){
      return  itemName.includes(this.filteredResults) || (approved_Califorina.includes(this.U_california));

    } else if(this.U_california === '0' && this.Ncaa ==='1'){
      return  itemName.includes(this.filteredResults) || (approved_Ncaa.includes(this.Ncaa));

    }else{
      return  itemName.includes(this.filteredResults) || (approved_Califorina.includes(this.U_california) || approved_Ncaa.includes(this.Ncaa));

    }

  }

}

});
   console.log("getting_value",this.responseValue);
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
       this.http.get(baseUrl+`/webservice/rest/server.php?wstoken=9b90c397414127d3515d94173fd9ee70&wsfunction=local_mobile_store_courses_store_course_data&moodlewsrestformat=json&userid=`+userId)
       .subscribe((data: any) => {

         console.log("Response",data.data);
          this.responseValue = data.data;
          this.count=data.Cartcount
          this.isLoading = false;
          this.cartService.updateCartCount(data.Cartcount);
          console.log("Cart total count",this.count);

       });
    }
    updateButton(r: any) {
       this.courseId = r.Course_ID;
       console.log("course_id",this.courseId);
       this.http.get(baseUrl+`/webservice/rest/server.php?wstoken=9b90c397414127d3515d94173fd9ee70&wsfunction=local_mobile_store_courses_added_to_cart&moodlewsrestformat=json&courseid=`+this.courseId+`&userid=`+this.userId)
       .subscribe((data: any) => {
        this.userId = CoreSites.getCurrentSiteUserId();
        this.getData(this.userId);


       });

      // use the courseId as needed
    }

  }
