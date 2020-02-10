# Views #
Views act as a view upon a specific page. 

These are intentionally light-weight as really they are only acting as wrappers 
to more complex dynamically loaded pages, whether thats a custom page or one of 
the default standard app pages, like the Database Manager or the Page Builder.

Each page gets rendered by the 'page.view' component, which uses a proxy so we 
can generate dynamic vue components from static html