# TODO

+ [X] Mostrar Planta-Detall
+ [X] Hacer Login

  Con validators y formulario, conectar login a supabase, y que valide
  hacer resource en "supaservice.ts" para algo, pero ni puta idea para que..

  Al hacer login hay que modificar en supabase modificar la "policy" de "Enable users to view their own data only" y cambiamos después del "=" en vez de "user_id" a "user" pero entre 		comillas ya que la palabra user está reservada.

* [ ] Botó de return de plantes detall
* [X] PROFILE
* [ ] CRUD de plantes en component Administrar
* [X] habilitar/deshabilitar botons del menú
* [ ] mostrar registres en la planta-detall
* [ ] recercador: +info per a saber qué ha de recercar
* [ ] DECISIÓ: en el plantes del menú arrepleguem les dades des del user de supabase que es guarda en localstorage o li'l passem per paràmetre?
* [ ] Implementació de destacats
* [X] Fer Logout:

+ [X] Fer registre
+ [ ] Mostrar u ocultar plantes
  Utilizar el Resource para mostrar o ocultar plantas al hacer login o logout con la función "this.supaservice.plantesResource.reload()" en plantes-list.ts
+ [ ] Assegurar el logueig abans de carregar la planta
  en Header, hay que suscribirse a un authChangesObservable() que en teoría sabe que usuario está logeado y hace cambios si se cambia de usuario o se hace logout

* [X] Escoltar els login y logout en el Header

- Header: UTILIZA SIGNALS Y OBSERVABLES. sap fer logout, suscrito a observable que le dice si el usuario ha cambiado o no, sabe si existe una sesión con signal
- Supaservice.ts: Convertir función especifica del service a una función del componente en especifico. PROMESAS PARA LAS PLANTAS, PERO TRANSFORMANDOLAS A SIGNALS YA QUE NO QUEREMOS TRABAJAR CON PROMESAS, POR ESOS SE UTILIZAN ->RESOURCE Y ESTE RESOURCE SE CONVIERTE A SIGNAL CON UN "COMPUTED" PARA NO EXPONERLO (QUE SE QUEDE TIPO "PRIVATE"). CALLBACKS Y OBSERVABLES (convertir callbacks en observables).

Table-Editor/Registres/RLS policy/
((SELECT auth.uid() AS uid) = (SELECT plantes."user" FROM plantes WHERE (plantes.id = registres.planta)))

+ [ ] Gràfica en planta-detall

  En Planta detall: Hacer el grafico Chart, con los datos del archivo "register-service" de su GitHub https://github.com/xxjcaxx/exemples-dwec/tree/master/09-angular/2526/solar/codi_compartit.

* mARKDOWN All in one
* Office viwe
  <app-hijo [atribut]="vlalor">
  padre:
  atribut;
