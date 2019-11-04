# Model View ViewModel (MVVM)

## ASCII UML Diagram

+----------------+              +----------------+
| IComponent     |              | View           |
+----------------+              +----------------+
| @Input()       |              | vm properties  |
| @Output()      |              | vm methods     |
|                |              |                |
+--------+-------+              +----+------+----+
         |                           |      |
         |                      owns |      |
         |                  instance |      | owns
         |  implements               |      | instance
         |                           |      |
+--------+-------+              +----+------+----+
| ComponentClass |              | ViewModel      |
+----------------+    owns      +----------------+
| viewModel      |    instance  | properties     |
| @Iput()        +--------------+ methods        |
| @Output()      |              | format/parse   |
| format/parse   |              |                |
+----------------+              +----------------+


## What it is for

Makes the UI exchangeable. 
It separates the view from the component class.



In the view the only variable we want to touch is `vm`

- map incoming data to the a shae the view can receive
  - validates the incoming values
- contains form objects, and other view related stuff
- map data from the view to commands to the model or output bindings

## What is contained
 - state of the view
  - `list: string[]` or `list: Observable<string[]>`
- UI login of view
  i.e. `onRefreshClick(e: Event): void`
- Data Handling
  - filter i.e. `isList(l: any): boolean`
  - formatter i.e. `formatDate(d: Date): string`
  - parserDate i.e. `parseDate(s: string): Date`

## What it NOT contained
- coupling to Angular (@Input, @Output, ngOnInit)
- coupling to GlobalState (ngrx/store)
- coupling to DataAccess (HTTP Service)

