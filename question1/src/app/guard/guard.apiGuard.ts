import { CanActivateFn, createUrlTreeFromSnapshot } from "@angular/router";

export const apiGuard: CanActivateFn = (route, state) => {
  // On inject le service pour regarder si l'utilisateur est connecté
 let cat  = localStorage.getItem("user")
 const user = cat ? JSON.parse(cat) : null;
 
 console.log("Guard activated");
  console.log(cat); 
   
  if(user?.prefercat){
    return true; // allow access to cat page
  }

  return createUrlTreeFromSnapshot(route, ['/dog']);
};