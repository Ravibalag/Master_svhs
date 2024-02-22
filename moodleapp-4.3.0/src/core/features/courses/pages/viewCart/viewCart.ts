import { Component } from "@angular/core";
import { CoreSites } from '@services/sites';
import { HttpClient } from '@angular/common/http';
import { CoreNavigator } from "@services/navigator";
import { CartService } from '../cartService';
import { CorePath } from '@singletons/path';
import { Translate } from "@singletons";
import { CoreDomUtils } from "@services/utils/dom";
import { Platform } from '@ionic/angular';
import { baseUrl } from "../dashboard/dashboard";


@Component({
    selector: 'page-core-courses-viewCart',
    templateUrl: 'viewCart.html',
    styleUrls:["viewCart.scss"]
})
export class ViewCart {
  userId?: number;
  id:any;
  responseValue: any[] = [];
  courseId?:any;
  total?:number;
  protected enrolUrl = '';
  protected waitingForBrowserEnrol = false;
  courseIds?: string[];
  isLoading: boolean = true;




  constructor(private http: HttpClient,private cartService: CartService,  private platform: Platform ) {}

  ngOnInit(): void {
    // setTimeout(() => {
    //   this.isLoading = false;
    // }, 5000),
    this.userId = CoreSites.getCurrentSiteUserId();
    this.getData(this.userId);
    console.log(baseUrl);




  }

  ionViewDidEnter() {
    console.log("didicart");

    document.addEventListener("visibilitychange", this.handleVisibilityChange);
  }

  ionViewWillLeave() {
    console.log("willcart");

    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
  }

  handleVisibilityChange = () => {
    if (!document.hidden) {
      console.log("App became visible");
      this.userId = CoreSites.getCurrentSiteUserId();
      this.getData(this.userId);
    }
  }

  getData(userId: number) {

    console.log("id",this.userId);

     // document.getElementById('response').textContent = data.data;
     this.http.get(baseUrl+`/webservice/rest/server.php?wstoken=900be856a14cea6109ef1f3f675879b7&wsfunction=local_mobile_store_courses_cart_lists&moodlewsrestformat=json&userid=`+userId)
     .subscribe((data: any) => {

       console.log("Respoms",data.data);
        this.responseValue = data.data;
        this.courseIds=data.data.Course_ID;
        this.isLoading = false;
        console.log("ids",this.courseIds);

        this.total=data.Totalcost;
        this.cartService.updateCartCount(data.Cartcount);

     });
  }

  async backButton(): Promise<void> {
    CoreNavigator.navigateToSitePath('/courses/cartNav');
    }

  deleteButton(r: any) {
    this.courseId = r.Course_ID;
    console.log("course_id",this.courseId);
    this.http.get(baseUrl+`/webservice/rest/server.php?wstoken=900be856a14cea6109ef1f3f675879b7&wsfunction=local_mobile_store_courses_delete_course&moodlewsrestformat=json&courseid=`+this.courseId+`&userid=`+this.userId)
    .subscribe((data: any) => {
     this.userId = CoreSites.getCurrentSiteUserId();
     this.getData(this.userId);


    });



   // use the courseId as needed
 }
 async pay() {
  if(this.responseValue.length>0){
    console.log("course_id",this.courseId);
    try {
      await CoreDomUtils.showConfirm(
          Translate.instant('core.courses.browserenrolinstructions'),
          // Translate.instant('core.courses.completeenrolmentbrowser'),
          Translate.instant('Purchase In Your Browser'),
          Translate.instant('core.openinbrowser'),
      );
  } catch {
      // User canceled.
      return;
  }
  this.waitingForBrowserEnrol = true;
   const currentSiteUrl = CoreSites.getRequiredCurrentSite().getURL();
    this.enrolUrl = CorePath.concatenatePaths(currentSiteUrl, 'store/coursescheckout.php?mode=mobile');
    console.log(this.enrolUrl);

  await CoreSites.getRequiredCurrentSite().openInBrowserWithAutoLogin(
      this.enrolUrl,
      undefined,
      {
          showBrowserWarning: false,
      },
  );
  }else{
alert('No Subjects In Cart')
  }


 }

  }
