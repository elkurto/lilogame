"use strict";

var pw;
if ( ! window.pw ) {
  window.pw ={};
}
pw =window.pw;

if ( !pw.xhr) {
  pw.xhr ={};
}

pw.xhr.OFFLINEMODE =true;


pw.xhr.XhrSimple =function() {
  this.httpObject =null;    // a ref to an XMLHttp{X} object (see method , __createHTTPObject)
  this.fn_on_success =null; // a function with the prototype, function( s_resp, oXhrSimple,options) { ... }
  this.fn_on_error =null;   // a function with the prototype, function( s_resp, oXhrSimple,options) { ... }
  this.fn_on_always =null;  // a function with the prototype, function( s_resp, oXhrSimple,options) { ... }
  this.responseText =null;  // on success this field contains the DataEntity of the HTTP-Response.
  this.status =0;
  this.statusMessage =null;
  this.exception =null;
  this.options =null;
  this.url =null;
    
  pw.xhr.XhrSimple.prototype.__createHTTPObject =function() {
    if (typeof XMLHttpRequest !== 'undefined') {
        return new XMLHttpRequest();
    } try {
        return new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
        try {
            return new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {}
    }
    return false;
  };
  
  
  
  pw.xhr.XhrSimple.prototype.__init =function(oparam) {
    if ( oparam.options) {
      this.options =oparam.options;
    }
    if ( oparam.url ) {
      this.url =oparam.url;
    }
    // set param this.fn_on_success
    if ( oparam.success ) {
      this.fn_on_success =oparam.success;
    }
    
    // set param this.fn_on_error
    if ( oparam.error ) {
      this.fn_on_error =oparam.error;
      
    }
    if ( oparam.always ) {
      this.fn_on_always =oparam.always;
    }
    
    this.httpObject =this.__createHTTPObject ();
    
    return this;
  };



  
  // oparam.url =
  // oparam.async =true or false
  // oparam.method ="GET"  // or "POST","GET","DELETE","PUT","PATCH"
  // oparam.headers ={}
  // oparam.data =""
  // oparam.success =function(responseText :String, oXhr :pw.xhr.XhrSimple, options :Object)
  // oparam.error =function(oXhrReally :XhrReally, statusText:String, errmsg:String )  
  pw.xhr.XhrSimple.ajax =function( oparam ) {
    var oXhrSimple =(new pw.xhr.XhrSimple()).__init(oparam);
    
    oXhrSimple.__transmit( oparam ); 
    
    return oXhrSimple;
  };  
  
  
  
  pw.xhr.XhrSimple.prototype.__transmit =function( oparam ) {
    
    oparam.async = ( oparam.async === true || oparam.async === false ? oparam.async : true );
    
    try {
      // execute an xhr.
      this.httpObject.open( oparam.method, oparam.url, oparam.async );  
      

      // set default headers
      if ( oparam.data && oparam.data.length > 0 ) {
        if (  false === (  oparam.headers.hasOwnProperty("Content-type")  // common mis-spelling
                        || oparam.headers.hasOwnProperty("Content-Type")
                        )
          ) {
          oparam.headers['Content-type'] ='application/x-www-form-urlencoded';
        }
      }
      
      // set custom headers
      if ( oparam.headers ) {
        for (var name in oparam.headers) {
          this.httpObject.setRequestHeader( name , oparam.headers[name] );
        }
      }
      
      var this_obj =this;
      if ( oparam.async ) {
        this.httpObject.onreadystatechange =function() { this_obj.callback_onreadystatechange(); };
      }
    
      
      
      
      if ( oparam.method === "GET" ) {
        this.httpObject.send( ) ;
      }else {  // POST, DELETE, PATCH, PUT, OPTION
        oparam.data =(oparam.data === null || oparam.data === undefined ? "" : oparam.data );
        this.httpObject.send( oparam.data ) ;
      }
      if ( false === oparam.async) {
        this.responseText =this.httpObject.responseText;
        this.status =this.httpObject.status;
        //console.log( 'this.responseText =' + this.responseText );
      }
    } catch ( ex ) {
      this.status =this.httpObject.status;
      if (  this.fn_on_error ) {
        
        this.fn_on_error( '{"errmsg":"transport error"}', this, this.options );
      }
      if ( this.fn_on_always ) {
        this.fn_on_always( '{"errmsg":"transport error"}', this, this.options );
      }
    }
    return this;
  };//end-method 'transmit'
  
  
  
    // set-up the intermediate callbacks
    //// invoke completion callbacks.
  pw.xhr.XhrSimple.prototype.callback_onreadystatechange =function() {
    if ( this.httpObject.readyState === 4 ) {
      this.status =this.httpObject.status;
      
      try {
        if ( (200 <= this.httpObject.status && this.httpObject.status < 400 )
           ) {

          if ( this.responseText === null || this.responseText === undefined ) {
            this.responseText =this.httpObject.responseText;
          }
          if ( this.fn_on_success ) {
            this.fn_on_success( this.httpObject.responseText, this, this.options );
          }else if ( this.options.success ) {
            this.options.success( this.httpObject.responseText, this, this.options );
          }
          
        
        } else {
          if ( this.fn_on_error ) {
            var s_resp =this.httpObject.responseText; 
            this.fn_on_error( s_resp, this , this.options );
          }else if ( this.options.error ) {
            this.options.error( this.httpObject.responseText, this, this.options );
          }

        }
      } finally {
        var s_resp =this.httpObject.responseText;
        if ( this.fn_on_always ) {
          this.fn_on_always(s_resp, this , this.options );
        }else if ( this.options.always ) {
          this.options.always( s_resp, this , this.options );
        }
      }//end-try-finally
    }//end-
  };

};//end-class 'pw.xhr.XhrSimple'

(new pw.xhr.XhrSimple());

pw.xhr.Request =function() {
 
  pw.xhr.Request.prototype.init =function() {
    
    return this;
  };
  
  /**
   * 
   * @param {javascript-object} oparam
   *   oparam.url = rest/resource/1   // any relative or absolute URL
   *   oparam.async =true or false
   *   oparam.method ="GET"  // or "POST","GET","DELETE","PUT","PATCH"
   *   oparam.data ='your stringified data'
   *   oparam.headers ={}   // specify your own.
   *   oparam.data =""
   *   oparam.success =function(responseText :String, statusText :String, oXhrSimple ::pw.xhr.XhrSimple)
   *   oparam.error =function(oXhrSimple :pw.xhr.XhrSimple, statusText:String, errmsg:String )
   *    
   * @returns oXhrSimple :pw.xhr.XhrSimple
   */  
  pw.xhr.Request.prototype.get =function( oparam  ) {
    if ( ! oparam.url ) { throw Error( 'missing required param, url, is missing' ); }
    
    oparam.method ='GET';
    
    var oXhrSimple =this.ajax( oparam );

    return oXhrSimple;
  };  
  
  /**
   * 
   * @param {javascript-object} oparam
   *   oparam.url = rest/resource/1   // any relative or absolute URL
   *   oparam.async =true or false
   *   oparam.method ="GET"  // or "POST","GET","DELETE","PUT","PATCH"
   *   oparam.data ='your stringified data'
   *   oparam.headers ={}   // specify your own.
   *   oparam.data =""
   *   oparam.success =function(responseText :String, statusText :String, oXhrSimple ::pw.xhr.XhrSimple)
   *   oparam.error =function(oXhrSimple :pw.xhr.XhrSimple, statusText:String, errmsg:String )
   *    
   * @returns oXhrSimple :pw.xhr.XhrSimple
   */
  pw.xhr.Request.prototype.post =function( oparam  ) {
    if ( ! oparam.url ) { throw Error( 'missing required param, url, is missing' ); }
    
    oparam.method ='POST';
    
    var oXhrSimple =this.ajax( oparam );

    return oXhrSimple;
  };    
  
  pw.xhr.Request.counter =0;
  /**
   * 
   * @param {javascript-object} oparam
   *   oparam.url = rest/resource/1   // any relative or absolute URL            //(required ;no default]
   *   oparam.async =true or false                                               //[optional ;default true]
   *   oparam.method ="GET"  // or "POST","GET","DELETE","PUT","PATCH"           //[optional ;default "GET"]
   *   oparam.data ='your stringified data'                                      //[optional ;default null] 
   *   oparam.headers ={}   // specify your own.                                 //[optional ;default null]
   *   oparam.success =function(responseText :String, oXhrSimple :pw.xhr.XhrSimple, options:Object) // [optional ;default pw.xhr.fn_fetch_success_stock_mvvm]
   *   oparam.error =function(responseText :String, oXhrSimple :pw.xhr.XhrSimple, options:Object)   // [optional ;default pw.xhr.fn_fetch_error_stock_mvvm]  
   *   oparam.always =function(responseText :String, oXhrSimple :pw.xhr.XhrSimple, options:Object)  // [optional ;default null]
   *   oparam.options ={ [caller : <ref to viewmodel that called the ajax(...) method>]                           //[optional ;no default]
   *                   [, success : function(responseText :String, oXhrSimple :pw.xhr.XhrSimple, options:Object)  //[optional ;no default]
   *                   [, error   : function(responseText :String, oXhrSimple :pw.xhr.XhrSimple, options:Object)  //[optional ;no default]
   *                   }
   *                        
   * @returns oXhrSimple :pw.xhr.XhrSimple
   */
  pw.xhr.Request.prototype.ajax =function( oparam  ) {
    if ( ! oparam.url ) { throw Error( 'missing required param, url, is missing' ); }
    if ( ! oparam.method ) { throw Error( 'missing required param, method, is missing' ); }
      
    oparam.headers =( oparam.headers ? oparam.headers : {} );

    oparam.options =(oparam.options || {});
    //oparam.options.caller =(oparam.options.caller || pw.xhr.Request.prototype.ajax.caller);  # does not work in strict mode.
    
    // conditionally set some stock callbacks for event, on-success
    if ( false === oparam.hasOwnProperty('success') ) {
      if ( !oparam.hasOwnProperty('method') 
         || oparam.method === 'GET' ) {
        oparam.success =pw.xhr.fn_fetch_success_stock_mvvm;
      }else if (oparam.method === 'POST') {
        oparam.success =pw.xhr.fn_create_success_stock_mvvm;
      }else if (oparam.method === 'PUT') {
        oparam.success =pw.xhr.fn_put_success_stock_mvvm;
      }else if (oparam.method === 'PATCH') {
        oparam.success =pw.xhr.fn_patch_success_stock_mvvm;
      }else if (oparam.method === 'DELETE') {
        oparam.success =pw.xhr.fn_remove_success_stock_mvvm;
      }
    }
    
    // conditionally set some stock callbacks for event, on-error
    if ( false === oparam.hasOwnProperty('error') ) {
      if ( !oparam.hasOwnProperty('method') 
         || oparam.method === 'GET' ) {
        oparam.error =pw.xhr.fn_fetch_error_stock_mvvm;
      }else if (oparam.method === 'POST') {
        oparam.error =pw.xhr.fn_create_error_stock_mvvm;
      }else if (oparam.method === 'PUT') {
        oparam.error =pw.xhr.fn_put_error_stock_mvvm;
      }else if (oparam.method === 'PATCH') {
        oparam.error =pw.xhr.fn_patch_error_stock_mvvm;
      }else if (oparam.method === 'DELETE') {
        oparam.error =pw.xhr.fn_remove_error_stock_mvvm;
      }
    }
    
    var oXhrSimple =pw.xhr.XhrSimple.ajax( oparam );
    
    return oXhrSimple;
  };  
  

//  pw.xhr.Request.prototype.report_unknown_xhr_error =function(oXhrSimple, status, error ) {
//    alert('Please try again: :::\n' 
//         + 'There was an error with the remote server: :::\n' 
//         + '  status =' + status + '\n'
//         + '  error =' + error + '\n'
//         );
//  };
//  
//  pw.xhr.Request.prototype.make_anon_fn_success =function( ocontext, function_ref ) {
//    var anonymous_function =function( responseText, status, oXhrSimple ) {
//      function_ref.call( ocontext, responseText, status, oXhrSimple );
//      return oXhrSimple;
//    };
//    return anonymous_function;
//  };
//  
//  pw.xhr.Request.prototype.make_anon_fn_error =function( ocontext, function_ref ) {
//    var anonymous_function =function( oXhrSimple, status, responseText ) {
//      function_ref.call( ocontext, oXhrSimple, status, responseText );
//      return oXhrSimple;
//    };
//    return anonymous_function;
//  };
};

pw.xhr.REQUEST =(new pw.xhr.Request()).init();



pw.xhr.fn_remove_success_stock_mvvm =function(s_resp,oXhr,options) {
  var resp =null;
  options =(options || {});
  oXhr =(oXhr || {});
  try {
    resp =JSON.parse( s_resp );
  }catch( ex ) {
    console.log( 'Unable to parse response from url ='+ oXhr.url +' :::\n s_resp =' + s_resp );
    resp  ={errmsg:'Unable to parse response from url =' + oXhr.url }; 
  }
  
  if ( ! resp.errmsg || resp.errmsg == '' ) {
    console.log( 'success ');
    
    if ( options.success ) {
      options.success(s_resp,oXhr,options);
    }
  }else if ( resp.errmsg ) {
    if ( pw.dialog && pw.dialog.oDialogConfirmation ) {
      pw.dialog.oDialogConfirmation.show_msg({msg : resp.errmsg });
    }
    
    if ( options.error ) {
      options.error(s_resp,oXhr,options);
    }
  }  
};


//// form of use:
// pw.sample.ViewModel_Sample =function() {
//   this.model =null;
//
//   pw.sample..ViewModel_Sample.prototype.fetch =function(options) {
//      var id =this.model.id;
//      options =(options || {});
//      options.fn_fake_resp =function() { return {id: id, name:'foo', a:1, b:2, c:3}};
//      
//      var oXhr =pw.xhr.REQUEST.ajax({
//        url      : '../../rest/model_event/'+ id +'/'
//        ,method  : 'GET'
//        ,async   : true
//        ,success : pw.xhr.fn_fetch_success_stock.bind(this)
//        ,error   : pw.xhr.fn_fetch_error_stock.bind(this)
//        ,options : options
//      });
//      return oXhr;
//   };  
// };
// 
// var oviewmodel_sample =new pw.sample.ViewModel_Sample();
// oviewmodel_sample.id =12345;
// var options ={success : function(s_resp,oXhr,options) { alert('success'); }
//              ,failure : function(s_resp,oXhr,options) { alert('failure'); }
//              };
// oviewmodel_sample.fetch(options);  
// // in the normal case: sends ajax request, populates model w/ response, invokes method options.success(...).
// 

pw.xhr.fn_create_success_stock_mvvm =function(s_resp,oXhr,options) {
  var resp =null;
  options =(options || {});
  oXhr =(oXhr || {});
  try {
    resp =JSON.parse( s_resp );
  }catch( ex ) {
    console.log( 'Unable to parse response from url ='+ oXhr.url +' :::\n s_resp =' + s_resp );
    resp  ={errmsg:'Unable to parse response from url =' + oXhr.url }; 
  }
  
  if ( ! resp.errmsg || resp.errmsg == '' ) {
    console.log( 'success ');
    // merge the model with the response.
    if ( options.caller && options.caller.hasOwnProperty( 'model') ) {
       
      options.caller.model =(options.caller.model ? _.extend(options.caller.model, resp) : resp );
      
//      if ( options.caller.list_view && options.caller.list_view.update ) {
//        options.caller.list_view.update('viewmodel');
//      }
    }
    
    if ( options.success ) {
      options.success(s_resp,oXhr,options);
    }
  }else if ( resp.errmsg ) {
    if ( pw.dialog && pw.dialog.oDialogConfirmation ) {
      pw.dialog.oDialogConfirmation.show_err_msg({msg : resp.errmsg });
    }
    
    if ( options.error ) {
      options.error(s_resp,oXhr,options);
    }
  }  
};

pw.xhr.fn_fetch_success_stock_mvvm =pw.xhr.fn_create_success_stock_mvvm;
pw.xhr.fn_patch_success_stock_mvvm =pw.xhr.fn_create_success_stock_mvvm;
pw.xhr.fn_put_success_stock_mvvm =pw.xhr.fn_create_success_stock_mvvm;

//NB: need to bind this function to an instance of viewmodel

pw.xhr.fn_create_error_stock_mvvm =function(s_resp,oXhr,options) {
  options =(options || {});
  if (pw.xhr.OFFLINEMODE) {
    var resp_fake =null; 
    var s_resp_fake =s_resp;
    if ( options.fn_fake_resp ) {
      resp_fake =options.fn_fake_resp();
      s_resp_fake =JSON.stringify( resp_fake );
    }
    //this.on_fetch_success(s_resp_fake,oXhr,options);
    if ( oXhr.fn_on_success ) {
      oXhr.fn_on_success(s_resp_fake,oXhr,options);
    }else {
      console.log( 'oXhr.fn_on_success is null' );
    }
  }else {
    pw.xhr.fn_handle_errmsg(s_resp,oXhr,options);
  }
};
pw.xhr.fn_remove_error_stock_mvvm =pw.xhr.fn_create_error_stock_mvvm;
pw.xhr.fn_fetch_error_stock_mvvm =pw.xhr.fn_create_error_stock_mvvm;
pw.xhr.fn_put_error_stock_mvvm =pw.xhr.fn_create_error_stock_mvvm;
pw.xhr.fn_patch_error_stock_mvvm =pw.xhr.fn_create_error_stock_mvvm;

pw.xhr.fn_handle_errmsg =function(s_resp,oXhr,options) {
  var resp =null;
  try {
    resp =JSON.parse(s_resp);
  }catch (ex ) {
    console.log( 'failed to parse response s_resp ' + s_resp );
  }
  
  resp =(resp || {});
  if ( !resp.errmsg || resp.errmsg == '') {
    resp ={errmsg:'Error: Failed request :::\n oXhr.url =\n' + oXhr.url };
  }
  
  if ( pw.dialog && pw.dialog.oDialogConfirmation ) {
    pw.dialog.oDialogConfirmation.show_err_msg({msg : resp.errmsg });
  }
  
  if ( options.error ) {
    options.error(s_resp,oXhr,options,this);
  }
  
};