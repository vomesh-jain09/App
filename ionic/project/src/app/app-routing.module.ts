import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    children: [
      {
        path: '',
        loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'item/:id',
        children: [
          {
            path: '',
            loadChildren: () => import('./home/item-detail/item-detail.module').then(m => m.ItemDetailPageModule)
          },
          {
            path: 'cart',
            loadChildren: () => import('./home/cart/cart.module').then(m => m.CartPageModule)
          },
         
         
        ]
      },
      {
        path: 'cart',
        children: [
          {
            path: '',
            loadChildren: () => import('./home/cart/cart.module').then(m => m.CartPageModule)
          },
         
        ]
      }
    ]
  },
  {
    path: '',
    redirectTo: 'signup',
    pathMatch: 'full'
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then( m => m.SignupPageModule)
  }
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
