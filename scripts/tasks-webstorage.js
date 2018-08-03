  storageEngine = function () {

  var initialized = false;
  var initializedObjectStores = {};

  function getStorageObject (type) {

    var item = localStorage.getItem (type);
    var parsedItem = JSON.parse (item);

    return parsedItem;
  }

  return {

    init : function ( successCallback, errorCallback ) {

      if ( window.localStorage ) {

        initialized = true;
        successCallback (null);

      } else {

        errorCallback ( 'storage_api_not_supported', 'The web storage api is not supported' );

      }
    },

    initObjectStore : function ( type, successCallback, errorCallback ) {

      if ( !initialized ) {

        errorCallback ( 'storage_api_not_initialized', 'The storage engine hasn\'t been initialised' );

      } else if ( !localStorage.getItem ( type )) {

        localStorage.setItem (type, JSON.stringify( {} ));

      }

      initializedObjectStores[type] = true;

      successCallback ( null );

    },

    save : function ( type, obj, successCallback, errorCallback ) {

       if ( !initialized ) {

         errorCallback ( 'storage_api_not_initialized', 'The storage engine has not been initialized' );

       } else if ( !initializedObjectStores [type] ) {

         errorCallback ( 'store_not_initialized', 'The object store ' + type + ' has not been initialized' );

       }

       if ( !obj.id ) {

         obj.id = $.now();

       }

       var savedTypeString = localStorage.getItem ( type );
       var storageItem = getStorageObject (type);

       storageItem [ obj.id ] = obj;

       localStorage.setItem ( type, JSON.stringify ( storageItem ));

       successCallback ( obj );
    },

    findAll : function ( type, successCallback, errorCallback ) {

      if ( !initialized ) {

        errorCallback ( 'storage_api_not_initialized', 'The storage engine has not been initialized' );

      } else if ( !initializedObjectStores [type] ) {

        errorCallback ( 'store_not_initialized', 'The object store ' + type + ' has not been initialized' );

      }

      var result = [];
      var storageItem = getStorageObject (type);

      $.each (storageItem, function ( i, v ) {
        result.push ( v );
      });

      successCallback (result);

    },

    delete : function ( type, id, successCallback, errorCallback ) {

      if ( !initialized ) {

        errorCallback ( 'storage_api_not_initialized', 'The storage engine has not been initialized' );

      } else if ( !initializedObjectStores [type] ) {

        errorCallback ( 'store_not_initialized', 'The object store ' + type + ' has not been initialized' );

      }

      var storageItem = getStorageObject ( type );

      if ( storageItem [ id ] ) {

        delete storageItem [ id ];

        localStorage.setItem ( type, JSON.stringify ( storageItem ));

        successCallback ( id );

      } else {

        errorCallback ( "object_not_found", "The object requested could not be found");

      }
    },

    findByProperty : function ( type, propertyName, propertyValue, successCallback, errorCallback ) {

      if ( !initialized ) {

        errorCallback ( 'storage_api_not_initialized', 'The storage engine has not been initialized' );

      } else if ( !initializedObjectStores [type] ) {

        errorCallback ( 'store_not_initialized', 'The object store ' + type + ' has not been initialized' );

      }

      var result = [] ;

      var storageItem = getStorageObject ( type );

      $.each ( storageItem, function ( i, v ) {

        if ( v [ propertyName ] === propertyValue ) {

          result.push ( v );
        }
      });

      successCallback ( result );

    },

    findById : function (type, id, successCallback, errorCallback ) {

      if ( !initialized ) {

        errorCallback ( 'storage_api_not_initialized', 'The storage engine has not been initialized' );

      } else if ( !initializedObjectStores [type] ) {

        errorCallback ( 'store_not_initialized', 'The object store ' + type + ' has not been initialized' );

      }

      var storageItem = getStorageObject ( type );

      var result = storageItem [ id ];

      successCallback ( result );

    }
  }

  }();
  /**
  * The client must call this to initialise the storage engine before using it.
  * It the storage engine initises successfully the successCallback will be invoked with a null object.
  * If the errorCallback is invoked then the storage engined cannot be used.
  *
  * @param {function} successCallback The callback that will be invoked if the storage engine initialises
  * @param {function} errorCallback The callback that will be invoked in error scenarios.
  */

  /**
  * The client must call thiss to initialise a specific object type in the storage engine.
  * If the storage engine supports the object type the successCallback will be invoked with a null value.
  * It should be possible to call this method multiple times, and the same result will be returned each time.
  * If the errorCallback is invoked then the object type cannot be stored.
  *
  * @param {String} type  The type of object that will be stored.
  * @param {function} successCallback The callback that will be invoked if the storage engine initialises
  * @param {function} errorCallback The callback that will be invoked in error scenarios.
  */

  /**
   * This can be used to find all the ojects for a specific type.
   * If there are no objects found for that type this will return an empty array.
   *
   * @param {String} type The type of object that should be searched for.
   * @param {function} successCallback The callback that will be invoked after the query completes.  This will be passed an array of objects confirming to the requested type.
   * @param {function} errorCallback The callback that will be invoked in error scenarios.
   */


  /**
   * This will return an object with a specific id for a specific type.
   * If no object is found this will return null
   *
   * @param {String} type The type of object that should be searched for.
   * @param {String | number} id The unique ID of the object
   * @param {Function} successCallback The callback that will be invoked after the query completes. This will be passed an object conforming to the requested type or null.
   * @param {Function} errorCallback The callback that will be invoked on error scenarios.
   */

   /**
    * This will handle adding and editing objects of a specific type.
    * If the id property of the object passed in is null or undefined, an id will be assigned for the object, and it will be saved.
    * If the id property is non-null then the object will be updated (??)
    * If the id cannot be found the error callback will be invoked.
    * On success, the newly saved object will be returned to the success callback.
    *
    * @param {String} type  The type of object that will be stored
    * @param {Object} obj  The object that will be stored.
    * @param {Function} successCallback The callback that will be invoked after the object has been committed to the storage engine - returning the stored object and it's id.
    * @param {Function} errorCallback The callback that will be invoked on error scenarios.
    */

  /**
  * This will delete an object matching the id and specified type.
  * If no object exists the errorCallback will be invoked.
  * If successful the id of the deleted object will be returned via the successCallback.
  *
  * @param {String} type  The type of object that will be deleted
  * @param {String | number} id  The unique id of the object.
  * @param {Function} successCallback The callback that will be invoked after the object has been deleted from the storage engine.  This will be passed the unique id of the deleted object.
  * @param {Function} errorCallback The callback that will be invoked on error scenarios.
  */

  /*
   function successCallback ( result )

   function errorCallback (errorCode, errorMessage )
  */
