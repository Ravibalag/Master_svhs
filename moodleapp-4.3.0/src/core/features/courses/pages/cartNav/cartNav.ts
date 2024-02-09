import { Component } from "@angular/core";
import { CoreDashboardHomeHandlerService } from "@features/courses/services/handlers/dashboard-home";
import { CoreNavigator } from "@services/navigator";


@Component({
    selector: 'page-core-courses-cartNav',
    templateUrl: 'cartNav.html',
    styleUrls:["cartNav.scss"]

})
export class CartNav {

  async viewCart(): Promise<void> {
    CoreNavigator.navigateToSitePath('/courses/viewCart');
}
async store(): Promise<void> {
  CoreNavigator.navigateToSitePath('/courses/cart');
}
async orders(): Promise<void> {
  CoreNavigator.navigateToSitePath('/courses/orders');
}
async backButton(): Promise<void> {
  console.log("path",CoreDashboardHomeHandlerService.PAGE_NAME);


  CoreNavigator.navigateToSitePath('/site');
}


  }
