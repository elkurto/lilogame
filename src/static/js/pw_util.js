"use strict";

// @dependency : underscore.js - some methods rely on underscore.js  Otherwise redundancy would occur.
// 

// init package
var pw;
if ( !window.pw ) {
  window.pw ={};
}
pw =window.pw;
if ( ! pw.util ) {
  pw.util ={};
}


pw.util.Util =function() {
  
};
  // @desc :  Conditionally, copy field-value from src_obj to dest_obj
  // 
  //     for each s_field_name in as_field_name
  //            dest_obj[s_field_name] := src_obj[s_field_name]
  //            
  // @param : src_obj  Object  source object
  // @param : dest_obj  :Object  destination object
  // @param : as_field_name  : Array<String>
  // 
  // e.g. var dest_obj = { field_a : 1
  //                , field_b : 2
  //                , field_c : 3
  //                };
  //     var as_field_name =['field_a', 'field_b']
  //     var src_obj ={ field_a : 'a'
  //                  , field_b : 'b'
  //                  , field_c : 'c'
  //                  };
  //  pw.util.UTIL.apply_options_to_data_member( src_obj, dest_obj, as_field_name );
  //     // Result dest_obj.field_a === 'a'
  //     //        dest_obj.field_b === 'b'
  //     //        dest_obj.field_c === 3
  pw.util.Util.prototype.apply_options_to_data_member =function( src_obj, dest_obj, as_field_name ) {
    if ( this.is_not_defined(src_obj) ) { return ; }
    if ( this.is_not_defined(dest_obj) ) { return ; }
    if ( this.is_not_defined(as_field_name) ) { return ; }
    
    for ( var s_field_name in as_field_name ) {
      if ( src_obj.hasOwnProperty(s_field_name) 
         && dest_obj.hasOwnProperty(s_field_name) ) {
   
        dest_obj[s_field_name] =src_obj[s_field_name];
      }
    }
  };//end-method
  
  pw.util.Util.prototype.is_defined =function(o) {
    if ( o === undefined || o === null ) {
      return false;
    }
    return true;
  };
  pw.util.Util.prototype.is_not_defined =function(o) {
    return ! this.is_defined( o );
  };  
  pw.util.Util.prototype.is_empty_str =function(s) {
  	var b_is_empty =true;
  	if ( this.is_defined(s)) {
    	s =s+'';
    	if ( s.length > 0 ) {
    		b_is_empty =false;
    	}
    }
  	return b_is_empty;
  };
  pw.util.Util.prototype.is_not_empty_str =function(s) {
  	return ! this.is_empty_str( s); 
  };
  pw.util.Util.prototype.is_nat = function(o) {
      if (o === undefined || o === null) {
          return false;
      }
      if (typeof o !== 'number' && typeof o !== 'string') {
          return false;
      }
  
      var s = o.toString();
      if (s === '') {
          return false;
      }
  
      var b_is_nat = true;
      var i = 0;
      var i_charCode_zero = '0'.charCodeAt(0);
      var i_charCode_nine = '9'.charCodeAt(0);
  
      for (var i = 0; i < s.length && b_is_nat; i++) {
          b_is_nat = (i_charCode_zero <= s.charCodeAt(i) && s.charCodeAt(i) <= i_charCode_nine);
      }//end-for
  
      return b_is_nat;
  
  };
  
  pw.util.Util.prototype.is_int =function(o) {
    if (o === undefined || o === null) {
      return false;
    }
    if (typeof o !== 'number' && typeof o !== 'string') {
        return false;
    }
    var s =o.toString();
    if ( s === '' ) {
      return false;
    }
    
    var regex_int =new RegExp('^[-+]?[0-9]+$');
    var b_is_int =regex_int.test(s);
    return b_is_int;
  };
  
  pw.util.Util.prototype.parse_int = function(_v, _default) {
  
      _default = (arguments.length > 1 ? _default : null); //default {{param}} _default to null
      if (_v === null || _v === undefined) {
          return _default;
      }
      _v = parseInt(_v);
  
      return (isNaN(_v) ? _default : _v);
  };
  
  pw.util.Util.prototype.re_float =/^[+-]?(:?\d*\.?\d+|\d+\.?)$/;
  pw.util.Util.prototype.is_float =function(o) {
    if ( o === undefined || o === null ) {
      return false;
    }
    if ( typeof o !== 'number' && typeof o !== 'string' ) {
      return false;
    }
    if ( typeof o === 'number' ) {
      return true;
    }
    var s =o+'';
    var b_is_float =this.re_float.test( s );
    return b_is_float;
  };
  
  pw.util.Util.prototype.floatval =function(s, _default) {
    s = s+'';
    s =s.replace(/[ ,]+/g,'');
    var val;
    try {
      val =parseFloat(s)
    }catch(ex) {
      val =(_default || 0.0);
      
    }
    if (isNaN(val)){
      val =(_default || 0.0);
    }
    
    return val
  }
  
  // usage: 
  //   var oquerystr =pw.util.UTIL.parse_querystr(window.location.search);
  //   var oquerystr =pw.util.UTIL.parse_querystr();
  // return :Object  - return an object whose keys are the parameter names 
  //                   and values are the corresponding parameter values.
  pw.util.Util.prototype.parse_querystr = function(_s_querystr) {
      var s_querystr = (_s_querystr ? _s_querystr : location.search);
      var oparam_rval = {};
      // 1. remove whitespace
      s_querystr = s_querystr.trim();
  
      // 2. conditionally remove leading '?'
      if (s_querystr.length > 0 && s_querystr.charAt(0) === '?') {
          s_querystr = (s_querystr.length > 1 ? s_querystr.substring(1) : '');
      }
  
      // 3. 
      var as_namevalue = s_querystr.split('&');
      for (var i = 0; i < as_namevalue.length; i++) {
  
          var index_of_first_equalsign = as_namevalue[i].indexOf('=');
          var s_name = as_namevalue[i].substring(0, index_of_first_equalsign);
          s_name = (s_name ? decodeURIComponent(s_name) : '');
          s_name = (s_name ? s_name.trim() : '');
  
          var s_value = as_namevalue[i].substring(index_of_first_equalsign + 1);
          s_value = (s_value ? decodeURIComponent(s_value) : '');
          s_value = (s_value ? s_value.trim() : '');
  
          if (s_name) {
              oparam_rval[s_name] = (s_value ? decodeURIComponent(s_value) : '');
          }
      }//end-for-i
  
      return oparam_rval;
  };
  
  pw.util.Util.prototype.intval = function(s, _default) {
      var irval = parseInt(s);
      irval = (isNaN(irval) || irval === undefined || irval === null ? _default : irval);
      return irval;
  };
  
  pw.util.Util.prototype.boolval =function(s, _default) {
    var rval =_default;
    if ( s === null || s === undefined ) {
      rval =_default;
    } 
    else if ( s === true || s === false ) {
      rval =s;
    }
    else if ( s == 1  || s == '1' || s == 'Y' || s == 'y') {
      rval =true;
    }
    else if ( s == 0 || s == '0' || s == 'N' || s == 'n') {
      rval =false;
    }
    else if ( s == 'true') {
      rval =true;
    }
    else if ( s == 'false') {
      rval =false;
    }
    
    return rval;
  }

  // oparam = { url : 'graph/boxplot_dfa.html?sessionid=A&uid=B&queryid=1&queryresultid=2' 
  //          , target_type (_blank, _top, etc) // optional. Default: _blank
  //          , selector_button : '#button_the_trigger'    // optional 
  //          , i_button_disable_timeout_ms : 1000         // optional 
  //          }
  // NB: param, url, must be 2000 characters or less (due to constraints of HTTP-GET).
  // 
  pw.util.Util.prototype.open_page_via_httpget = function(oparam) {
  
      // 1. handle input params and apply defaults.
      // 1.1. oparam.url
      var s_url = oparam.url;
      if (!s_url) {
          return -1;
      }
  
      // 1.2 oparam.i_button_disable_timeout_ms
      var i_button_disable_timeout_ms = oparam.i_button_disable_timeout_ms;
  
      // default time out to 1000
      i_button_disable_timeout_ms =
              (i_button_disable_timeout_ms && i_button_disable_timeout_ms > 0
                      ? i_button_disable_timeout_ms : 1000
                      );
  
      // 1.3 oparam.selector_button
      var selector_button = oparam.selector_button;
  
  
      // 2. disable obutton_trigger (conditionally)
      var obutton_trigger = null;
  
      if (selector_button) {
          obutton_trigger = document.querySelector(selector_button);
  
  
      }
      if (obutton_trigger) {
          obutton_trigger.disabled = 'true';
      }
  
      // 3. acquire odiv_hidden (or lazy create and acquire odiv_hidden)
      var odiv_hidden = document.getElementById('div_hidden');
      if (!odiv_hidden) {
          odiv_hidden = document.createElement('div');
          odiv_hidden.id = 'div_hidden';
          odiv_hidden.style.display = 'none';
          document.body.appendChild(odiv_hidden);
      }
      // 4. add an temporary-anchor, open target url, remove the temporary-anchor.
      var oanchor = document.createElement('a');
      oanchor.setAttribute('href', s_url);
      var target_type = oparam.target_type ? oparam.target_type : '_blank';
  
      oanchor.setAttribute('target', target_type);
  
      odiv_hidden.appendChild(oanchor);
      oanchor.click();
  
      odiv_hidden.removeChild(oanchor);
  
      // 5. re-enable obutton_trigger (condintionally).
      if (obutton_trigger) {
          setTimeout(function() {
              obutton_trigger.removeAttribute('disabled');
          }, i_button_disable_timeout_ms);
      }
  
      return 1;
  }//end-method 'open_page_via_httpget'
  
  // @return :Object - the return value is an anonymous object that contains following data-members
  //   x   the horizontal distance from document-edge to {{param}} elem`s left-edge.
  //   y   the horizontal distance from document-edge to {{param}} elem`s top-edge.
  //   w   the width of {{param}} elem (excluding border width of border-left and width of border-right
  //   wb   the width of {{param}} elem (including border width of border-left and width of border-right
  //   h    the height of {{param}} elem (excluding border height of border-top and width of border-bottom
  //   hb   the height of {{param}} elem (including border height of border-top and width of border-bottom
  // 
  pw.util.Util.prototype.get_position = function(elem) { // param, elem :HTMLDOMElementNode
      var e = null;
      if (!elem) {
          return {x: 0, y: 0, w: 0, h: 0, wb: 0, hb: 0};
      }
  
      e = (elem.jquery ? elem[0] : elem);
      if (!e) {
          return {x: 0, y: 0, w: 0, h: 0, wb: 0, hb: 0};
      }
  
      var l = 0;
      var t = 0;
      var w = this.intval(e.style.width || e.clientWidth, 0);
      var h = this.intval(e.style.height || e.clientHeight, 0);
      var wb = e.offsetWidth;
      var hb = e.offsetHeight;
  
      do {
          var ostyle = (window.chrome ? window.getComputedStyle(e) : {});
  
          //NB: In firefox (and other browsers)  e.offsetTop includes borderTopWidth, 
          //    so do not over-add borderTopWidth when in firefox.
          //NB: In chrome (and other browsers)  e.offsetTop excludes borderTopWidth 
          //    (incorrectly), so add borderTopWidth only when browser is chrome.
          l += this.intval( e.offsetLeft || e.clientLeft, 0 ) + (ostyle && ostyle.borderLeftWidth ? this.intval(ostyle.borderLeftWidth, 0) : 0);
          t += this.intval( e.offsetTop || e.clientTop ,  0 ) + (ostyle && ostyle.borderTopWidth ? this.intval(ostyle.borderTopWidth, 0) : 0);
  
//    console.log( 'e.id =' + e.id 
//               + ' ::: t =' + t 
//               + ' , l =' + l 
//               + ' , wb =' + t 
//               + ' , hb =' + t 
//               + ' , e.offsetTop =' + e.offsetTop
//               + ' , ostyle.borderTopWidth =' + ostyle.borderTopWidth
//               + ' , e.offsetLeft =' + e.offsetLeft
//               + ' , ostyle.borderLeftWidth =' + ostyle.borderLeftWidth
//               + ', e =' + e
//               + ', e =' + e.offsetParent
//               );
          e = e.offsetParent || e.parentNode;
      } while ( e && e.offsetParent );
  
      return {x: l, y: t, w: w, h: h, wb: wb, hb: hb};
  };//end-method '_getPos(...)' 
  
  
  // @return :Object - the return value is an anonymous object that contains following data-members
  //   x   the horizontal distance from document-edge to {{param}} elem`s left-edge.
  //   y   the horizontal distance from document-edge to {{param}} elem`s top-edge.
  //   w   the width of {{param}} elem (excluding border width of border-left and width of border-right
  //   wb   the width of {{param}} elem (including border width of border-left and width of border-right
  //   h    the height of {{param}} elem (excluding border height of border-top and width of border-bottom
  //   hb   the height of {{param}} elem (including border height of border-top and width of border-bottom
  // 
  pw.util.Util.prototype.get_position_relative = function(elem, elem_stop_at_parent) { // param, elem :HTMLDOMElementNode
      var e = null;
      var e_stop_at_parent = null;
  
      e = (elem.jquery ? elem[0] : elem);
      e_stop_at_parent = (elem_stop_at_parent.jquery ? elem_stop_at_parent[0] : elem_stop_at_parent);
  
      var l = 0;
      var t = 0;
      var w = this.intval(e.style.width  || e.clientWidth, 0);
      var h = this.intval(e.style.height || e.clientHeight, 0);
      var wb = e.offsetWidth;
      var hb = e.offsetHeight;
  
      do {
          var ostyle = (window.chrome ? window.getComputedStyle(e) : {});
          //NB: In firefox (and other browsers)  e.offsetTop includes borderTopWidth, 
          //    so do not over-add borderTopWidth when in firefox.
          //NB: In chrome (and other browsers)  e.offsetTop excludes borderTopWidth 
          //    (incorrectly), so add borderTopWidth only when browser is chrome.
          l += this.intval( e.offsetLeft || e.clientLeft, 0 ) + (ostyle && ostyle.borderLeftWidth ? this.intval(ostyle.borderLeftWidth, 0) : 0);
          t += this.intval( e.offsetTop || e.clientTop ,  0 ) + (ostyle && ostyle.borderTopWidth ? this.intval(ostyle.borderTopWidth, 0) : 0);
          
//          l += e.offsetLeft + (ostyle && ostyle.borderLeftWidth ? this.intval(ostyle.borderLeftWidth, 0) : 0);
//          t += e.offsetTop + (ostyle && ostyle.borderTopWidth ? this.intval(ostyle.borderTopWidth, 0) : 0);
          
          e = (e.offsetParent || e.parentNode);
      } while (e && e.offsetParent && e !== e_stop_at_parent);
  
      return {x: l, y: t, w: w, h: h, wb: wb, hb: hb};
  };//end-method '_getPos(...)' 
  

  
  pw.util.Util.prototype.binary_search_between = function(ai, key) {
    if (key == undefined || ai == undefined || key == null || ai == null || isNaN(key)) {
        console.log('bad input: one of key == undefined || ai == undefined || key == null || ai == null || isNaN( key )');
        return 0;
    }

    if (key <= ai[0]) {
        return 0;
    }
    if (key >= ai[ai.length - 1]) {
        return ai.length - 1;
    }

    var i_start = 0;
    var i_end = ai.length - 1;
    var i_mid = this.__compute_mid(i_start, i_end);
    var i_index_found_rval = this.__do_binary_search_between(ai, key, i_start, i_mid, i_end);

    return i_index_found_rval;
  };

  pw.util.Util.prototype.__do_binary_search_between = function(ai, key, i_start, i_mid, i_end) {
      // 1. halting conditions for search.
      if (ai[i_mid] == key) {
          return i_mid;
      }
      else if (i_mid == 0) {
          return 0;
      }
      else if (i_mid == ai.length - 1) {
          return i_mid;
      }
      else if (ai[i_mid - 1 ] <= key && key < ai[i_mid]) {
          return i_mid - 1;
      }
      else if (ai[i_mid] <= key && key < ai[i_mid + 1]) {
          return i_mid;
      }
      else if (i_start == i_end) {
          return i_start;
      }
  
  
      // 2. set-up another search.      
      var i_start_next = 0;
      var i_mid_next = 0;
      var i_end_next = 0;
  
      if (key < ai[i_mid]) {
          i_start_next = i_start;
          i_end_next = i_mid;
          i_mid_next = this.__compute_mid(i_start_next, i_end_next);
      } else { // key >  ai[i_mid] 
          i_start_next = i_mid;
          i_end_next = i_end;
          i_mid_next = this.__compute_mid(i_start_next, i_end_next);
      }
  
      return this.__do_binary_search_between(ai, key, i_start_next, i_mid_next, i_end_next);
  };

  pw.util.Util.prototype.__compute_mid = function(i_start, i_end) {
      var i_mid = Math.floor((i_end + i_start) / 2);
      return i_mid;
  };  
  
  /**
   * @desc This method serves one purpose; ensure that the radio-button-group`s user-interface
   *       updates after a call to 
   *          oRactive.set( s_keypath, s_newValue ); // NB: oRactive is an instance of class, Ractive.
   *          
   *       Basically, this function fixes a defect that exists between <<browser>> IE11/Mozilla and Ractive.js --
   *         In IE11/Mozilla radio-button-group-user-interface fail to update in response to
   *         programmatic calls to oRactive.set( s_keypath, s_newValue ); 
   *         
   *       As such this function is a work-around.
   *       
   * @pre: The s_keypath equals the id-attribute of the radio-button group`s parent-node.
   * @pre: There may exist a radio button whose value-attribue equals s_newValue.
   * @pre: 
   * @post: 
   *   IF s_keypath is 
   * @param newValue :String  - a. The value of the nascently-selected-radio-button (i.e. the new value)
   *                          - b. The new/current value of tail of s_keypath
   * @param oldValue :String  
   * @param keypath  :String  - 
   * 
   * e.g. 
   *   <span id="a.b.c.s_keypath_tail000">
   *     <input type="radio" name="{{a.b.c.s_keypath_tail000}}" value="a.b.c.s_keypath_tail000:1"/>
   *     <input type="radio" name="{{a.b.c.s_keypath_tail000}}" value="a.b.c.s_keypath_tail000:2"/>
   *     <input type="radio" name="{{a.b.c.s_keypath_tail000}}" value="a.b.c.s_keypath_tail000:3"/>
   *   </span>
   *   <script type="text/javascript">
   *     var oRactive =new Ractive({
   *       el : ...
   *       , template : ...
   *       , data : { a : { b : { c : { s_keypath_tail000 : '' } } }
   *                  ... 
   *                }
   *     });
   *     oRactive.observe( 'a.b.c.s_keypath_tail000', function( s_newValue, s_oldValue, s_keypath ) {
   *       modify_radio_button_in_user_interface( s_newValue, s_oldValue, s_keypath );
   *     });
   *   </script>
   *   <script type="text/javascript">
   *   	
   *   </script>
   */
  pw.util.Util.prototype.modify_radio_button_in_user_interface =function( s_newValue, s_oldValue, s_keypath ) {
  	// 1. validate input
  	if ( ! s_keypath ) { return; }
  	if ( ! s_newValue ) { return; }
  	
  	// 2. acquire the DOM element that contains the target radio-button-group.  
  	var s_id_of_parent_of_radio_button_bag =s_keypath;
  	if ( !s_id_of_parent_of_radio_button_bag ) { return; } // input-error: return if no id 
  	
  	// 3. acquire the DOM-Element that contains the radio-button-group 
  	var odom_parent_of_radio_button_bag =document.getElementById(s_id_of_parent_of_radio_button_bag);
  	if ( ! odom_parent_of_radio_button_bag ) { return; } // input-error: failed to locate DOM-node
  	
  	// 4. acquire the targeted radio-button. 
  	var odom_radio_newly_selected =
  		odom_parent_of_radio_button_bag.querySelector('input[type="radio"][value="'+ s_newValue +'"]');
  	//if ( ! odom_radio_newly_selected ) { return; } // developer-error : targeted radio button does not exist or not locate-able.
  	// odom_radio_newly_selected.checked =true;
  	if ( odom_radio_newly_selected ) { 
  		odom_radio_newly_selected.checked =true;
  	}else if ( s_oldValue ) {
  		var odom_radio_new_unselected =odom_parent_of_radio_button_bag.querySelector('input[type="radio"][value="'+ s_oldValue +'"]');
  		if ( odom_radio_new_unselected ) {
  			odom_radio_new_unselected.checked =false;
  		}
  	}
  	
  }; 
  
  // @desc: Replace the list of &lt;option&gt; in a &lt;select&gt;
  // @param : oselect : HTMLSelectElement - the select instance whose options will be set
  // @param : as_value : Array<String> - a list of values that will be assigned to option.value
  // @param : as_text  : Array<String> - a list of text values that will be assigned to option.text
  // 
  // @return undefined
  // @pre: as_value.length === as_text.length
  // @pre: oselect is defined and an instance of HTMLSelectElement 
  //        (https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement)
  // @post: oselect.options contains option instance specified by as_value and as_text. 
  // 
  pw.util.Util.prototype.set_options =function( oselect, as_value, as_text ) {
    var n_item_new =as_value.length;
    var n_option_initial =oselect.length;
    
    for ( var i =0; i < n_item_new && i < n_option_initial; i++ ) {
      oselect.options[i].value =as_value[i];
      oselect.options[i].text =as_text[i];
    }//end-for-i
    

    if ( n_item_new === n_option_initial ) {
      // case 1:
      _.noop();
    }else if ( n_item_new < n_option_initial ) { 
      // case 2:
      for ( var i =n_option_initial; i > n_item_new; i-- ) {
        //console.log( 'n_option_initial =' + n_option_initial + ', n_item_new=' + n_item_new + ', i =' + i );
        oselect.remove(i-1);
      }//end-for-i
    }else if ( n_option_initial < n_item_new ) {
      // case 3:
      for ( var i =n_option_initial; i < n_item_new ; i++ ) {
        var odom_option_new =document.createElement('OPTION');
        odom_option_new.value =as_value[i];
        odom_option_new.text =as_text[i];
        oselect.add(odom_option_new );
      }
    }
  };
  
  //@todo: use one object a input (oparam)
  //@todo: allow optional arguement; comparator  - goal: enable integer comparisons.

  pw.util.Util.prototype.binary_search_ao =function( ao_sorted, s_keypath, s_key, b_return_insert_index ) {
   var as_keypath =s_keypath.split('.');
   var index_rval =-1;
   b_return_insert_index =(b_return_insert_index ? true : false); // ensure boolean
   s_key =s_key + ''; //ensure the s_key is a string
   
   var oresult =this.__binary_search_ao_inner( ao_sorted, as_keypath, s_key, 0, ao_sorted.length -1, b_return_insert_index);
   
   // 
   if ( false === b_return_insert_index && false === oresult.matched ) {
     index_rval =-1;
   }else {
     index_rval =oresult.index;
   }
   
   return index_rval;
  };
  
  // @return - an object that contains three fields
  // 
  pw.util.Util.prototype.__binary_search_ao_inner =function( ao_sorted, as_keypath, s_key, i_start, i_end, b_return_insert_index ) {
    var orval ={index: -1, val : null, matched : false};
    b_return_insert_index =(b_return_insert_index ? true : false); // ensure boolean 
    if (s_key === null || s_key === undefined ) { return orval; } // fast fail when s_key is not defined.
   
   
   //var index_rval =-1;
   if ( i_start > i_end ) { 
     orval ={index : ( b_return_insert_index 
                      ? this.__compute_mid_ceil( i_start, i_end ) 
                      : -1 )
            ,val : null
            ,matched : false};
     return orval;
   }
   
   // 1. compute mid from i_start, i_end
   var i_mid =this.__compute_mid_ceil( i_start, i_end );
   
   // 2. acquire object value at as_keypath  =: value_temp
   var obj =ao_sorted[i_mid];
   var val =this.__get_value_of_keypath_in_object( obj, as_keypath, null );
   
   // 3. compare value_temp  and s_key
   //   3.1 [value_temp === s_key ] then return i_mid
   //   3.2 [s_key < value_temp] then search between i_start and i_mid -1
   //   3.3 [s_key > value_temp] then search between i_mid+1 and i_end
   if ( val === null ) {
     orval ={ index : -1
            , val : null
            , matched : false
            };
   } else {
     
     var i_cmp =s_key.localeCompare( val );
     if ( i_cmp === 0 ) {   // case: exact match
       //index_rval =i_mid;
       orval ={ index : i_mid   
              , val   : val
              , matched : true
              };
     }else if ( i_cmp < 0 ) { // case: key is less than mid
       if ( i_start === i_mid ) {  
         //index_rval =i_mid -1;
         orval ={ index : i_mid  // in this case splice_index equals mid
                , val   : null 
                , matched : false
                };         
       }else {
         orval =this.__binary_search_ao_inner( ao_sorted, as_keypath, s_key, i_start, i_mid -1 );
       }
     }else if ( 0 < i_cmp ) { // case: key is greater than mid
       if ( i_mid === i_end ) {
         //index_rval =i_mid+1;
         orval ={ index : i_mid+1  // in this case splice_index equals mid+1
                , val   : null
                , matched : false
                };         
       }else {
         orval =this.__binary_search_ao_inner( ao_sorted, as_keypath, s_key, i_mid +1, i_end   );
       }
     }
   }
   
   return orval; 
  };
  

  // @param : obj - any object
  // @param : keypath : String or Array - specifies the path in obj to traverse for a return value.
  // @param : _default : Any - A default return value .  returned when the keypath is not found.
  //
  // @return : returns the value of the object at the given keypath.
  // 
  // 
  pw.util.Util.prototype.get_value_of_keypath_in_object =function( obj, keypath, _default ) {
    var as_keypath =[];
    if ( _.isString( keypath ) ) {
      var as_tok =keypath.split('.');
      as_keypath =_.filter(as_tok, function(elem) { return (elem.length > 0); });
      console.log('as_keypath =' + as_keypath);
    }else if ( _.isArray( keypath )) {
      as_keypath =keypath;
    }
    
    var rval =this.__get_value_of_keypath_in_object( obj, as_keypath, _default);
    
    return rval;
  };
  
  pw.util.Util.prototype.__get_value_of_keypath_in_object =function( obj, as_keypath, _default ) {
   if ( as_keypath.length == 0 ) {
     return obj;
   }
   if ( as_keypath.length == 1 && as_keypath[0] === '' ) {
     return obj;
   }
   
   var value_rval =_default;
   var obj_temp =( obj || {} );
       as_keypath =(as_keypath || [] );
       
   for ( var i =0; i < as_keypath.length; i++ ) {
     var s_keypath_part =as_keypath[i];
     if ( obj_temp.hasOwnProperty( s_keypath_part )) {
       obj_temp =obj_temp[s_keypath_part];
       value_rval =obj_temp;
     }else {
       value_rval =_default;
     }
   }
   
   return value_rval;
  };
  

  
  
  pw.util.Util.prototype.__compute_mid_ceil =function( i, j ) {
   return Math.ceil( (i + j)/2 );
  };
  
  pw.util.Util.prototype.add_string_to_ordered_set =function( as_sorted_set, s_val_new ) {
    if ( s_val_new === undefined || s_val_new === null ) { return -1; }
    
    var index =-1;
    var b_return_insert_index =true;
    var s_keypath ='';
    
    index =this.binary_search_ao(as_sorted_set, s_keypath, s_val_new, b_return_insert_index );
    
    if ( 0 <= index && index <= as_sorted_set.length ) {
      if ( as_sorted_set[index] === s_val_new ) {
        ;
      }else {
        as_sorted_set.splice( index, 0, s_val_new );
      }
    }
    
    return index;
  };
  
  pw.util.Util.prototype.contains_array_elem =function( ary, elem ) {
    return (ary.indexOf(elem) > -1 ? true : false ); 
  };
  
  
  pw.util.Util.prototype.pad_right =function( str, len, c_pad_with ) {
    c_pad_with =( this.is_defined( c_pad_with ) ? c_pad_with +'' : ' ' );
    c_pad_with =( c_pad_with.length < 1 ? ' ' : c_pad_with.charAt(0));
    len =this.intval( len, 0 );
    
    var str_padded_rval =str;
    for ( var i =str.length; i < len; i++ ) {
      str_padded_rval +=c_pad_with;
    }
    
    return str_padded_rval;
  };
  
  pw.util.Util.prototype.pad_left =function( str, len, c_pad_with ) {
    c_pad_with =( this.is_defined( c_pad_with ) ? c_pad_with +'' : ' ' );
    c_pad_with =( c_pad_with.length < 1 ? ' ' : c_pad_with.charAt(0));
    len =this.intval( len, 0 );
    
    var str_padded_rval =str+'';
    for ( var i =str_padded_rval.length; i < len; i++ ) {
      str_padded_rval =c_pad_with + str_padded_rval;
    }
    
    return str_padded_rval;
  };
  
  
  pw.util.Util.prototype.has_nonempty_intersection =function( as_a, as_b ) {
     
  };
  
  pw.util.Util.prototype.join =function( ary, s_delimeter ) {
    if ( ! ary || false === _.isArray(ary) ) { return ''; }
    if ( ! _.isString( s_delimeter ) ) { return '';}
    
    s_delimeter =s_delimeter.toString();
    
    var s_rval ='';
    ary.forEach(function(elem,i) {
      if ( elem ) {
        s_rval +=elem +''+ s_delimeter;
      }
    });
    
    if ( s_rval.length > s_delimeter.length ) {
      s_rval =s_rval.substring( 0, s_rval.length - s_delimeter.length );
    }
    
    return s_rval;
  };
  
  pw.util.Util.prototype.get_innerHTML =function( s_selector ) {
    if ( s_selector == null || s_selector == undefined || s_selector == '') {
      return null;
    }
    var odom =document.querySelector(s_selector);
    
    return (odom && odom.innerHTML ? odom.innerHTML : null);
  };
  
  pw.util.Util.prototype.get_template =function( s_selector ) {
    return this.get_innerHTML(s_selector);
  };
  pw.util.Util.prototype.reduce_whitespace =function(str) {
    if ( ! str ) {
      return str;
    }
    var rval =str.replace(/[\s\n]+/gm, ' ');
    rval =rval.replace(/>\s+</gm,'><');
    rval =rval.replace(/}\s+</gm,'}<');
    rval =rval.replace(/>\s+{/gm,'>{');
    rval =rval.replace(/}\s+{/gm,'}{');
    return rval;
  };
  
  pw.util.Util.prototype.__regexp_newline =/(\r\n|\n\r|\n)/g;
  pw.util.Util.prototype.convert_nl_to_br =function( str_in ) {
  	if ( false === this.is_defined( str_in ) ) { return ''; }
    
    str_in =str_in +''; // ensure string
    var str_rval =str_in;    
    
    str_rval =str_rval.replace( this.__regexp_newline, '<br/>');
    
    return str_rval;
  }
  
  pw.util.Util.prototype.__regexp_match_tag_br =/<[Bb][Rr]\s*\/?>/g;  // match tag <br/>
  pw.util.Util.prototype.__s_newline ='\n'; //String.fromCharCode(10);  // newline \n
  pw.util.Util.prototype.__regexp_match_quote =/"/g;  // match character "
  
  pw.util.Util.prototype.format_attr_title =function( str_in ) {
    if ( false === this.is_defined( str_in ) ) { return ''; }
    
    str_in =str_in +''; // ensure string
    var str_rval =str_in;    
    str_rval =str_rval.replace( this.__regexp_match_tag_br, this.__s_newline );
    str_rval =str_rval.replace( this.__regexp_match_quote , '&quot;' );
    
    return str_rval;
  };
  
  pw.util.Util.prototype.compose_attr_title =function( object, keypath ) {
    // a utility function that composes the title attribute of the data-cells.
    if ( ! object ) {
      return ''
    }
    if ( ! keypath ) {
      return '';
    }
    var fieldvalue =this.fn_eval_keypath(object, keypath);
    fieldvalue =fieldvalue +'';
    if ( fieldvalue.length < 1 ) {
      return '';
    }
    var str_rval =this.format_attr_title(fieldvalue);
    str_rval =' title="' + str_rval + '" ';
    
    return str_rval;    
  };
  
  pw.util.Util.prototype.format_dollar =function( amount ) {
    if (!this.is_defined(amount) ) {return amount;}
    var i_amount =this.intval(amount, null);
    if (i_amount == null ) { return amount; }
    
    var s_amount_formatted ='';
    var remainder =0;
    do {
      remainder =Math.floor(i_amount % 1000);
      i_amount  =Math.floor(i_amount / 1000);
      
      if ( i_amount > 0 ) {
        s_amount_formatted =','+ this.pad_left(remainder, 3, '0') + s_amount_formatted;
      }else { // i_amount === 0
        s_amount_formatted ='$ '+remainder +s_amount_formatted;
      }
      
      
    }while ( i_amount > 0 );
    
    return s_amount_formatted; 
  };
  

  pw.util.Util.prototype.format_epoch_ms_to_date_utc =function( _epoch_ms ) {
    var i_epoch_ms =this.intval( _epoch_ms , null );
    if (!this.is_defined( i_epoch_ms )) {
      return null;
    }
    var date =new Date( i_epoch_ms );
    var s_yyyy_mm_dd = this.pad_left(  date.getFullYear()   , 4, '0') 
                 +'-'+ this.pad_left( (date.getMonth() + 1) , 2, '0') 
                 +'-'+ this.pad_left(  date.getDate()       , 2, '0')
                     ;
    
    return s_yyyy_mm_dd;
  };
  
  pw.util.Util.prototype.create_fn_comparator =function(s_column, b_ascending) {
    s_column =(s_column || 'id');
    b_ascending =(b_ascending || false );
    var fn_sort =null;
    
    if ( b_ascending ) {
      fn_sort =function(a,b) {
        return (a[ s_column ] == b[ s_column ] ? 0 
                 :(a[ s_column ] < b[ s_column ] ? -1 : 1)
               );
      };    
    }else {
      fn_sort =function(a,b) {
        return (a[ s_column ] == b[ s_column ] ? 0 
                 :(a[ s_column ] < b[ s_column ] ? 1 : -1)
               );
      };
    }
    
    return fn_sort;
  };

  
  pw.util.Util.prototype.create_fn_comparator_backbone_model =function(s_column, b_ascending) {
    s_column =(s_column || 'id');
    b_ascending =(b_ascending || false );
    var fn_sort =null;
    
    if ( b_ascending ) {
      fn_sort =function(a,b) {
        return (a.attributes[ s_column ] == b.attributes[ s_column ] ? 0 
                 :(a.attributes[ s_column ] < b.attributes[ s_column ] ? -1 : 1)
               );
      };    
    }else {
      fn_sort =function(a,b) {
        return (a.attributes[ s_column ] == b.attributes[ s_column ] ? 0 
                 :(a.attributes[ s_column ] < b.attributes[ s_column ] ? 1 : -1)
               );
      };
    }
    
    return fn_sort;
  };

  pw.util.Util.prototype.fn_has_cookie =function(key) {
    var re =/(?:^|.*;\s*)'+key+'\s*\=\s*([^;]*).*$/;
    var b_has_cookie =re.test(document.cookie);
    return b_has_cookie;
  }
  pw.util.Util.prototype.fn_get_cookie =function(key,s_default_value) {
    s_default_value =( s_default_value || null );
    
    var cookieValue =null; 
    if ( fn_is_alphanum(key) && fn_has_cookie(key) ) {
      cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)'+key+'\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    }
    
    return cookieValue; 
  };
  pw.util.Util.prototype.fn_get_username_from_cookie =function() {
    return fn_get_cookie('username');
  };  
  
  pw.util.Util.prototype.shallow_clone =function( obj ) {
    var rval =_.clone( obj );
    return rval; 
  };
  pw.util.Util.prototype.deep_clone =function( obj ) {
    var rval;
    if (!obj) {
      rval =obj;
    }else {
      rval =JSON.parse( JSON.stringify( obj ));
    }
    
    return obj;
  };
  
  pw.util.Util.prototype.re_contains_wildcard =RegExp('[?*]');
  pw.util.Util.prototype.contains_wildcard =function( s ) {
  	if ( s === null || s === undefined ) { return false; }
  	s =s+'';
  	var rval =this.re_contains_wildcard.test(s);
  	return rval;
  };

  pw.util.Util.prototype.cached_keypath ={};
  pw.util.Util.prototype.acquire_keypath_object =function(s_keypath_expression) {
  	var okeypath_rval =null;
  	if ( this.cached_keypath.hasOwnProperty( s_keypath_expression )) {
  		okeypath_rval =this.cached_keypath[s_keypath_expression];
  	}else {
  		okeypath_rval =new pw.util.Keypath( s_keypath_expression );
  		this.cached_keypath[ s_keypath_expression ] =okeypath_rval;
  	}
  	return okeypath_rval;
  }
  
  pw.util.Util.prototype.fn_eval_keypath =function( context, s_keypath_expression, default_value ) {
  	if (this.is_not_defined(s_keypath_expression) ) {
  		return default_value;
  	}
  	if (s_keypath_expression == '') {
  		return default_value;
  	}
  	
  	var okeypath =this.acquire_keypath_object( s_keypath_expression ); //new pw.util.Keypath( s_keypath_expression );
  	var values =okeypath.get_values(context);
  	var rval =null;
  	
  	if ( this.contains_wildcard( s_keypath_expression )) { // wildcard presentso return an array of values
  		rval =values;
  	}else {    // no wildcard so return the only value
  		rval =(values.length > 0 ? values[0] : null); 
  	}
  	return rval;
  };  
  
  pw.util.Util.prototype.fn_set_keypath =function( context, s_keypath_expression, new_value ) {
    /** set the value of the field (at keypath, s_keypath_expression) in object, context.
     * 
     */
    var okeypath =this.acquire_keypath_object( s_keypath_expression );
    
    var old_value =okeypath.set_value(context, new_value);
    
    return old_value;
  };

  pw.util.Util.prototype.fn_extract_id_from_selector =function( s_selector ) {
    var tok =/#([A-Za-z0-9_\-]+)\.?/.exec(s_selector);
    var s_id =null;
    
    if ( tok && tok.length > 1 ) {
      s_id =tok[1]
    }
    
    return s_id;
  };
  
  pw.util.Util.prototype.starts_with =function(str,prefix,position) {
    /**
     * @param str :string - the str to search
     * @param prefix :string - the key substring in str
     * @param position :int -starting position to search for prefix in str
     * 
     * @return  :boolean (str.substr(position || 0, prefix.length) == prefix);
     *    if str starts with prefix, then return true
     *    otherwise return false.
     */
    var b_starts_with =false;
  
    if (this.is_not_defined( str ) || this.is_not_defined( prefix )) {
      b_starts_with =false;
    }else {
      str =str +'';
      prefix =prefix +'';
      position =(position||0);
      b_starts_with =(str.substr( position, prefix.length ) == prefix);
    }
  
    return b_starts_with;
  };
  
  pw.util.Util.prototype.fn_remove_prefix =function(prefix, s, default_value) {
  	var rval =(this.is_defined(default_value) ? default_value : null);
  	if (!prefix || !s) {
  		return rval;
  	}
  	prefix =prefix +'';
  	s =s +'';
  	if ( prefix.length == 0 ) {
  		rval =s;
  	}
  	if ( prefix.length > s.length ) {
  		rval =default_value;
  	}
  	if ( this.starts_with(s, prefix) ) {
  		rval =s.substr(prefix.length);
  	}else {
  		rval =default_value;
  	}
  	
  	
  	return rval;
  };
  
  pw.util.Util.prototype.fn_safe_extractField =function( o, fieldname ) {
    var value =null;
    if ( o && o.hasOwnProperty(fieldname)) {
      value =o[fieldname]
    }
    return value;
  };
  pw.util.Util.prototype.fn_safe_localeCompare =function(oa,fielda,ob,fieldb) {
    var i_rval =-1;
    
    try {
      var vala =this.fn_safe_extractField(oa,fielda);
      var valb =this.fn_safe_extractField(ob,fieldb);
    
      if (vala === undefined && valb === undefined) {
        i_rval =0;
      }
      else if (vala === null && valb === null ) {
        i_rval =0;
      }
      else {
          i_rval =vala.localeCompare(valb);
      }
    }catch(ex) {
      ;
    }
    
    return i_rval;
  };


pw.util.UTIL =new pw.util.Util();



// @desc : {{class}} pw.util.Keypath  
// @param : s_keypath_expression :String  - the keypath
// @usage : 
//     // e.g. 1
//     var okeypath =new pw.util.Keypath('a.b.c');
//     var obj ={ a : { b : { c : 0 }}};
//     var result =okeypath.get_values( obj );  // returns [0]  
//     
//     // e.g. 2
//     var okeypath =new pw.util.Keypath('a.?.b.c');
//     var obj ={ a : [{ b : { c : 0 }}
//                    ,{ b : { c : 1 }}
//                    ]
//              };
//     var result =okeypath.get_values( obj );  // returns [0,1]
// @see : the qunit-tests reside in z02-qunit-test.pw_util.js
// 
pw.util.Keypath =function( s_keypath_expression ) {
  this.s_keypath_expresssion =s_keypath_expression;
  this.as_keypath =s_keypath_expression.split('.');

  //@return :Array<Object>  
  //- returns an array of objects that match the s_keypath_expression in {{param}} obj.
  //- if no matching objects (such as keypath does not exist), then return empty array [].
  pw.util.Keypath.prototype.get_values =function( obj ) { 
    
//    for ( var i =0; i < as_keypath.length; i++ ) {
//      var obj_temp =this.__get_values_at_level_of_keypath(obj, i);
//    }
    return this.__get_values_at_level_of_keypath(obj, 0);
  };
  

  pw.util.Keypath.prototype.__get_values_at_level_of_keypath =function(obj, index) {
    // reached the end of keypath, so return obj.
    if ( index === this.as_keypath.length ) { return [obj]; }

    // validate obj
    if ( false === pw.util.UTIL.is_defined( obj ) ) { return [null]; } //NB: this method returns null elements.
    
    var ao_rval =[];
    // continue descending through the keypath and obj
    if ( this.as_keypath[index] === '?' || this.as_keypath[index] === '*' ) { //wildcards
      if ( _.isArray(obj) ) {  //if array, then recursively descend through each element
        
        for ( var i =0; i <  obj.length; i++ ) { 
          var result =this.__get_values_at_level_of_keypath( obj[i], index+1 );
          
          result.forEach( function(elem ) {
            ao_rval.push( elem );  
          });
        };
      }else if ( _.isObject(obj) ) {
        for ( var key in obj ) {
          if ( obj.hasOwnProperty(key) ) {
            var result =this.__get_values_at_level_of_keypath( obj[key], index+1 );
            
            result.forEach( function(elem ) {
              ao_rval.push( elem );  
            });
          }
        }
      }else {
        ao_rval.push(null);
      }
    }else { //then this.as_keypath[i] is a literal
      var key =this.as_keypath[index];

      if ( obj.hasOwnProperty(key) ) {
        var result =this.__get_values_at_level_of_keypath(obj[key], index+1);
        
        result.forEach( function(elem ) {
          ao_rval.push( elem );  
        });
      }else {
        ao_rval.push(null);
      }
    }
    return ao_rval;
  };
  
//  // @param : ary_list :Array<Object>  an array of objects to which this function 
//  //             applies (a) keypath and (b) fn_filter.
//  // 
//  // @param : fn_filter  :function(elem, index) with {{lvalue}} boolean - 
//  //             A function (a) that returns true when caller wants to keep elem and 
//  //                        (b) that returns false when caller rejects elem. 
//  // 
//  // @param : context :Objject - an option param that will be used as the context of fn_filter.
//  //                             {{param}} context defaults to this keypath instance.
//  // 
//  // @return :Array<Object> - return an array of objects from  {{param}} ary_list that (a) match key 
//  //          and (b) matches the filter, {{param}} fn_filter
//  pw.util.Keypath.prototype.find_where =function( obj , fn_filter, context ) {
//    
//    if ( ! fn_filter ) { fn_filter =function() { return true; }; }
//    if ( ! _.isFunction( fn_filter ) ) { return []; }
//    context =(context ? context : this );
//    
//    var as_match =[];
//    //for ( var i =0; i < ary_list.length; i++ ) {
//      var ary_result =this.__get_values_at_level_of_keypath( obj, 0 );
//
//      FOR_J:
//      for ( var j =0; j < ary_result.length; j++ ) {
//        
//        if ( fn_filter.call( context, ary_result[j], j ) ) {
//          as_match.push( ary_list[i] );
//          break FOR_J;
//        }
//      }//end-for-j
//    //}///end-for-i
//        
//    return as_match;
//  };
  
  //@TODO: make a method set_value  // only works for keypath expressions with no wildcards.
  pw.util.Keypath.prototype.set_value =function( obj, new_value ) {
    if ( pw.util.UTIL.contains_wildcard( this.s_keypath_expresssion ) ) {
      throw Error( 'refused to set keypath expression due to wildcard');
    }
    
    return this.__set_val_at_keypath_with_index(obj, new_value, 0);
  };
  
  pw.util.Keypath.prototype.__set_val_at_keypath_with_index =function(obj, new_value, index) {
    /**
     *    e.g. 
     *    k =new pw.util.Keypath('a.b.c');
     *    o ={ a : { b : { c : 1 }}};
     *    k.set_value( o , 6 ); // returns 1 // the old value
     *    // o.a.b.c === 6  // the new value
     *    
     *    Set the value at keypath of obj.  
     *    If the fields to keypath do not exist, then create nested objects to create keypath in obj.
     *    
     *    e.g. 
     *    k =new pw.util.Keypath('a.1');
     *    o ={a : ['x', 'y', 'z']};
     *    k.set_value( o, 'm' );  // returns 'y' // the old value
     *    // o.a[1] === 'm'  // the new value
     *    
     */
    var old_value =null;
    if ( index >= this.as_keypath.length ) {
      old_value =null; // something is wrong index out of bounds. :: bad input
      
    }else if ( index == this.as_keypath.length -1 ) {   
      var keypath_element =this.as_keypath[index];
      
      if ( obj.hasOwnProperty( keypath_element ) ) {
        old_value =obj[keypath_element];
      }
      
      obj[keypath_element] =new_value;
      
    }else {
      var keypath_element =this.as_keypath[index];
      
      if ( false === obj.hasOwnProperty(keypath_element) ) { 
        obj[keypath_element] ={};
      }
      // recursive call.
      old_value =this.__set_val_at_keypath_with_index(obj[keypath_element], new_value, index+1);
      
    }
    return old_value;
  };
};


pw.util.OrderedSet =function(array_string) {
  this.ary =[];
  this.fn_comparator =function( a, b ) { return a.localCompare( b ); };
  
  pw.util.OrderedSet.prototype.__init_from_ary_list =function( array_string ) {
    for ( var i =0; i < array_string.length; i++ ) {
      this.add( array_string[i] );
    }//end-for-i
  };
  
  pw.util.OrderedSet.prototype.size =function() {
    return this.ary.length;
  };
  
  pw.util.OrderedSet.prototype.forEach =function( fn_iterator, context ) {
    context =( context || this );
    if ( false === _.isFunction( fn_iterator ) ) { return this; }
    
    this.ary.forEach( function(elem,i) { 
      fn_iterator.call( context, elem, i ); 
    });
    
    return this;
  };
  
  pw.util.OrderedSet.prototype.add =function( s_val_new ) {
    s_val_new =s_val_new +'';
    var index =pw.util.UTIL.add_string_to_ordered_set( this.ary, s_val_new );
    return index;
  };
  
  pw.util.OrderedSet.prototype.has_intersection =function( oOrderedSet ) {
    if ( false === ( oOrderedSet instanceof pw.util.OrderedSet )) { 
      throw new Error( "input error : argument oOrderedSet is not an instance of required type, pw.util.OrderedSet");
    }
    
    var index_this =0;
    var index_arg =0;
    var b_nonempty =false;
    
    var prev_smaller_elem =null;
    
    while( true ) {
      if ( index_this >= this.ary.length ) {  // exhausted set, oOrderedSet, without match; 
        b_nonempty =false;                    // so intersection is empty (return false)
        break;
      }
      
      if ( index_arg >= oOrderedSet.ary.length ) { // exhausted set, oOrderedSet, without match; 
        b_nonempty =false;                         // so intersection is empty (return false)
        break;
      }
      
      var i_compare =this.ary[index_this].localeCompare( oOrderedSet.ary[index_arg]);
      if ( i_compare === 0 ) {  // found two elements in intersection; so return true;
        b_nonempty =true;
        break;
      }else if ( i_compare < 0 ) { // found two elements in intersection; so return true;
        if ( prev_smaller_elem === this.ary[index_this] ) {
          b_nonempty =true;
          break;  
        }else {                                      // no match found, so keep looking
          prev_smaller_elem =this.ary[index_this];   
          index_this++;
        }
        
      }else if ( 0 < i_compare ) {
        if ( prev_smaller_elem === oOrderedSet.ary[index_arg] ) {
          b_nonempty =true;  // found two elements in intersection; so return true;
          break;                         
        }else {                                           // no match found, so keep looking
          prev_smaller_elem =oOrderedSet.ary[index_arg];  // store smallest element
          index_arg++;
        }
      }
    }//end-while
    
    return b_nonempty;
  };//end-class 
  
  this.__init_from_ary_list( array_string );
};//end-class 'pw.util.OrderedSet'  
  
pw.util.fn_compare_number = function(oa,ob) {
  // - compare two objects as number via numerical less than e.g. ( oa < ob ))
  // - sort null-values, undefined-values, NaN-values to the end of the list.
  var i_rval =0;
  if ( oa == ob ) {
    i_rval =0;
  }else if ( (oa === null || oa === undefined || oa === NaN ) && (ob === null || ob === undefined || ob === NaN )) {
    i_rval =0;  //treat null and undef the same ; so oa === ob 
  }else if ( (oa === null || oa === undefined || oa === NaN ) && !(ob === null || ob === undefined || ob === NaN )) {
    i_rval =1;  //sort nulls last   so ob comes before oa 
  }else if ( !(oa === null || oa === undefined|| oa === NaN ) && (ob === null || ob === undefined || ob === NaN )) {
    i_rval =-1;  //sort nulls last  so oa comes before ob 
  }else {
    i_rval =(oa < ob ? -1 : 1 );
  }
    
  return i_rval;
};

pw.util.fn_compare_string = function(oa,ob) {
  // - compare two objects as strings via localeCompare
  // - sort nulls to the end of the list.
  var i_rval =0;
  if ( oa === ob ) {
    i_rval =0;
  }else if ( (oa === null || oa === undefined) && (ob === null || ob === undefined )) {
    i_rval =0;  //treat null and undef the same ; so oa === ob 
  }else if ( (oa === null || oa === undefined) && !(ob === null || ob === undefined )) {
    i_rval =1;  //sort nulls last   so ob comes before oa 
  }else if ( !(oa === null || oa === undefined) && (ob === null || ob === undefined )) {
    i_rval =-1;  //sort nulls last  so oa comes before ob 
  }else {
    i_rval =(oa+'').localeCompare(ob+'');
    i_rval =(i_rval === 0 ? 0 : ( i_rval < 0 ? -1 : 1));
  }
    
  return i_rval;
};



pw.util.fn_mergesort =function(array,sort_column,b_ascending) {
  /**
   * @desc Given an array of objects and the field by which to sort, 
   *       this method applies an in-place mergesort to an array of objects 
   *       
   *       This method will only mutate the ordering of array (and nothing else)
   *       
   * @param array :An array of objects
   * @param sort_column :String - The name of the immediate field of array.
   *                             -The column name on which to sort.
   *                             -e.g. array[sort_column] should exist.
   * @param b_ascending : Boolean  true implies apply an ascending sort  (1,2,3);  
   *                               false implies desceding sort (3,2,1)
   */
  
  var sorter =new pw.util.MergeSorter()
  
  sorter.fn_compare =pw.util.fn_compare_number;
  sorter.data =array;
  sorter.column =sort_column;
  sorter.ascending =b_ascending;
  sorter.sort();
  
  return array;
};

pw.util.MergeSorter =function() {
  this.fn_compare =pw.util.fn_compare_number;
  this.column     =null;
  this.data       =null;
  this.ascending  =null;
  
  pw.util.MergeSorter.prototype.sort =function() {
    var ary_aux =new Array(this.data.length);
    this.__mergesort_sort_lo_hi( this.data, ary_aux, 0, this.data.length -1);
  };
  
  pw.util.MergeSorter.prototype.__mergesort_sort_lo_hi = function(ary_value, ary_aux, lo, hi) {
    if ( hi <= lo ) { return ; }
    var mid = lo + Math.floor((hi -lo)/2) ;
    this.__mergesort_sort_lo_hi(ary_value, ary_aux, lo, mid);
    this.__mergesort_sort_lo_hi(ary_value, ary_aux, mid+1, hi);
    
    //console.log( 'lo,mid,hi =' + lo +','+ mid +','+ hi );
    this.__mergesort_merge(ary_value, ary_aux, lo, mid, hi);
  };
  
  pw.util.MergeSorter.prototype.__mergesort_merge = function(ary_value, ary_aux, lo, mid, hi) {
    // copy to aux[]
    for (var k = lo; k <= hi; k++) {
      ary_aux[k] = ary_value[k]; 
    }

    // merge back to a[]
    var i = lo, j = mid+1;
    for (var k = lo; k <= hi; k++) {
      //console.log( 'i,j,k =' + i +','+ j +','+k);
      if      (i > mid) {  //then we exhausted ary_aux[lo..mid], so just copy from ary_aux[mid+1..hi]
        ary_value[k] = ary_aux[j];
        j++;
      
      }else if (j > hi) {  //then we exhausted ary_aux[lo..mid], so just copy from ary_aux[lo..mid]
        ary_value[k] = ary_aux[i];
        i++;
      
      }else {
        var val_i =pw.util.UTIL.fn_eval_keypath( ary_aux[i], this.column );
        var val_j =pw.util.UTIL.fn_eval_keypath( ary_aux[j], this.column );
        
        if ( (  this.ascending  &&  this.__lessThanOrEqualTo(   val_i, val_j ))
           ||( !this.ascending  &&  this.__moreThanOrEqualTo( val_i, val_j   )) ) {
               // case02: ascending (.oO) so put bigger items later in the list.
               // case02.a: IF ascending_order  and  strictly  ary_aux[i]  <= ary_aux[j], then copy from ary_aux[lo..mid]
               // case02.b: IF ascending_order  and            ary_aux[i]  >  ary_aux[j], then copy from ary_aux[mid+1..hi]
               // 
               // case01: descending (Oo.) so put smaller items later in the list.    
               // case01.a: IF descending_order and  strictly  ary_aux[i]  > ary_aux[j], then copy from ary_aux[lo..mid]
               // case01.b: IF descending_order and            ary_aux[i] <= ary_aux[j], then copy from ary_aux[mid+1..hi]
               // /////////
               
               //
          ary_value[k] = ary_aux[i];
          i++;
          
        }else {                           // otherwise ary_aux[i] >= ary_aux[j], so copy from ary_aux[mid+1..hi] 
          ary_value[k] = ary_aux[j];
          j++;
        }//end-fi inner
      }//end-fi outer
    }//end-for-k    
  };
  
  pw.util.MergeSorter.prototype.__lessThanOrEqualTo = function( oa, ob ) {
    var b_lessThanOrEqualTo =false;
    
    b_lessThanOrEqualTo =( this.fn_compare(oa,ob) <= 0 );
    //console.log('a ='+ oa  + ' : b ='+ ob + ' : b_lessThanOrEqualTo =' + b_lessThanOrEqualTo );
    
    return b_lessThanOrEqualTo;
  };
  
  pw.util.MergeSorter.prototype.__moreThanOrEqualTo = function( oa, ob ) {
    var b_moreThanOrEqualTo =false;
    
    b_moreThanOrEqualTo =( this.fn_compare(oa,ob) >= 0 );
    //console.log('a ='+ oa  + ' : b ='+ ob + ' : b_moreThanOrEqualTo =' + b_moreThanOrEqualTo );
    
    return b_moreThanOrEqualTo;
  };
  
  pw.util.MergeSorter.prototype.__more = function( oa, ob ) {
    var b_is_more =false;
    
    b_is_more =( this.fn_compare(oa,ob) > 0 );
    //console.log('a ='+ oa  + ' : b ='+ ob + ' : b_is_more =' + b_is_more );
    
    return b_is_more;
  };
  
  pw.util.MergeSorter.prototype.__less = function( oa, ob ) {
    var b_is_less =false;
    
    b_is_less =( this.fn_compare(oa,ob) < 0 );
    //console.log('a ='+ oa  + ' : b ='+ ob + ' : b_is_less =' + b_is_less );
    return b_is_less;
  };
  
  pw.util.MergeSorter.prototype.__swap_model_elements = function( index_a, index_b ) {
   
    // swap the model elements.
    var temp =this.data[index_a];
    this.data[index_a] =this.data[index_b];
    this.data[index_b] =temp;
  };  
  
  
}



pw.util.MergeSorter2dArrayRowMajorOrder =function() {
  this.fn_strategy_compare = pw.util.fn_compare_string;   // the compare function
  this.keypath             = '?.0';                      // a keypath that refers to zeroth column in the data grid.
  this.data                = null;                       // entity to sort
  this.ascending           = true;
  
  pw.util.MergeSorter2dArrayRowMajorOrder.prototype.sort =function(options) {
    options =(options || {});
    this.fn_strategy_compare =(options.fn_compare || null);
    this.s_keypath_sort =(options.keypath || null);
    this.data =(options.data || null );
    this.ascending =(options.ascending || false);
    
    if ( this.fn_strategy_compare === null ) { throw Error('options.fn_compare not specified'); }
    if ( this.s_keypath_sort      === null ) { throw Error('options.keypath not specified'); }
    if ( this.data                === null ) { return this; }
    
    this.__mergesort_sort_outer(options);
    
    return this;    
  };
  
  pw.util.MergeSorter2dArrayRowMajorOrder.prototype.__mergesort_sort_outer =function( ) {
    // 1. create a keypath object
    var oKeypath =new pw.util.Keypath( this.s_keypath_sort);
    
    // 2. setup 
    // 2.1 create a dummy array that this method will sort.
    var ary_value =oKeypath.get_values(this.data);
    
    for ( var i =0; i < ary_value.length; i++ ) {
      var value =ary_value[i];
      ary_value[i] ={index: i, value: value};
    }
     
    // 2.2 make another dummy array as a swap-buffer.
    var ary_aux   =new Array(ary_value.length);
    
    // 3. perform mergsort on the dummy array, ary_value.
    this.__mergesort_sort_inner( ary_value, ary_aux, 0, ary_value.length -1);
    
    var s_printit ='';
    for ( var i =0; i < ary_value.length; i++ ) {
      s_printit +=','+ ary_value[i].value
    }
    console.log('a. s_printit =' + s_printit);
    // 4. now actually sort this.data
    //var ary_temp =[];
    for ( var i =0; i < ary_value.length; i++ ) {
      //ary_temp.push( this.models[ary_value[i].index]);
      if ( i < ary_value[i].index) { //then swap
        this.__swap_model_elements( i, ary_value[i].index );
      }// otherwise element is already in order.
    }//end-for-i
    
    var s_printit ='';
    for ( var i =0; i < this.data.length; i++ ) {
      s_printit +=','+ this.data[i][this.sort_column];
    }
    console.log('b. s_printit =' + s_printit);
  };
  pw.util.MergeSorter2dArrayRowMajorOrder.prototype.__mergesort_sort_inner = function(ary_value, ary_aux, lo, hi) {
    if ( hi <= lo ) { return ; }
    var mid = lo + Math.floor((hi -lo)/2) ;
    this.__mergesort_sort_inner(ary_value, ary_aux, lo, mid);
    this.__mergesort_sort_inner(ary_value, ary_aux, mid+1, hi);
    
    //console.log( 'lo,mid,hi =' + lo +','+ mid +','+ hi );
    this.__mergesort_merge(ary_value, ary_aux, lo, mid, hi);
  };
  pw.util.MergeSorter2dArrayRowMajorOrder.prototype.__mergesort_merge = function(ary_value, ary_aux, lo, mid, hi) {
    // copy to aux[]
    for (var k = lo; k <= hi; k++) {
      ary_aux[k] = ary_value[k]; 
    }

    // merge back to a[]
    var i = lo, j = mid+1;
    for (var k = lo; k <= hi; k++) {
      //console.log( 'i,j,k =' + i +','+ j +','+k);
      if      (i > mid) {  //then we exhausted ary_aux[lo..mid], so just copy from ary_aux[mid+1..hi]
        ary_value[k] = ary_aux[j];
        j++;
      
      }else if (j > hi) {  //then we exhausted ary_aux[lo..mid], so just copy from ary_aux[lo..mid]
        ary_value[k] = ary_aux[i];
        i++;
      
      }else if ( ( this.ascending  && this.__less(ary_aux[i].value, ary_aux[j].value))
               ||(!this.ascending  && this.__more(ary_aux[i].value, ary_aux[j].value)) ) { // if ary_aux[i] < ary_aux[j] then copy from ary_aux[lo..mid]
        ary_value[k] = ary_aux[i];
        i++;
      }else {                           // otherwise ary_aux[i] >= ary_aux[j], so copy from ary_aux[mid+1..hi] 
        ary_value[k] = ary_aux[j];
        j++;
      }
    }    
  };
  pw.util.MergeSorter2dArrayRowMajorOrder.prototype.__more = function( oa, ob ) {
    var b_is_more =false;
    
    b_is_more =( this.fn_strategy_compare(oa,ob) > 0 );
    
    return b_is_more;
  };
  pw.util.MergeSorter2dArrayRowMajorOrder.prototype.__less = function( oa, ob ) {
    var b_is_less =false;
    
    b_is_less =( this.fn_strategy_compare(oa,ob) < 0 );
    
    return b_is_less;
  };
  pw.util.MergeSorter2dArrayRowMajorOrder.prototype.__swap_model_elements = function( index_a, index_b ) {
   
    // swap the model elements.
    var temp =this.data[index_a];
    this.data[index_a] =this.data[index_b];
    this.data[index_b] =temp;
  };
  
  
};//end-class 'pw.util.MergeSorter2dArrayRowMajorOrder'

/////////
/////////
// Usage of pw.util.List_FieldSimple :
// e.g.
//      var s_celltemplate_can_edit =''
//							+'{{#if datarow.b_can_edit}}'
//							+'<span on-click="open_dialog_cell_edit:datarow,field">{{{content_icon_can_edit}}}</span>'
//							+'{{else}}'
//							+'<span></span>'
//							+'{{/if}}'
//							;	
//		var list_option =[ {name:''                              , width: 30,   fieldname: 'content_icon_can_edit'       , fieldsort: 'b_can_edit'                         ,kpedit: null                                , type:'text'         , celltemplate:s_celltemplate_can_edit}
//		,{name:'Primavera<br/>Id'              , width: 75,   fieldname: 'primaveraid'                 , fieldsort: 'evmdata.primaveraid'                ,kpedit: 'evmdata.primaveraid'               , type:'long'         , class_data:'cell_data_numeric', class_title: 'cell_collabel_numeric'}
//		,{name:'Title'                         , width: 175,  fieldname: 'title'                       , fieldsort: 'title'                              ,kpedit: 'title'                             , type:'text'  }
//		,{name:'Approved<br/>To<br/>Start'     , width: 70,   fieldname: 'bool_approved_to_start'      , fieldsort: 'b_approved_to_start'                ,kpedit: 'b_approved_to_start'               , type:'bool'  }
//		,{name:'Above<br/>Waterline'           , width: 70,   fieldname: 'bool_above_waterline'        , fieldsort: 'b_above_waterline'                  ,kpedit: 'b_above_waterline'                 , type:'bool'  }
//		,{name:'Planned<br/>Value'             , width: 100,  fieldname: 's_planned_value'             , fieldsort: 'evmdata.planned_value'              ,kpedit: 'evmdata.planned_value'             , type:'money'        , class_data:'cell_data_numeric', class_title: 'cell_collabel_numeric'}
//		,{name:'Actual<br/>Value'              , width: 100,  fieldname: 's_actual_spend'              , fieldsort: 'evmdata.actual_spend'               ,kpedit: 'evmdata.actual_spend'              , type:'money'        , class_data:'cell_data_numeric', class_title: 'cell_collabel_numeric'}
//		,{name: 'F135'                         , width: 100,  fieldname: 'evmdata.f135'                , fieldsort: 'evmdata.f135'                       ,kpedit: 'evmdata.f135'                      , type:'money'        , class_data:'cell_data_numeric', class_title: 'cell_collabel_numeric'}
//		,{name: 'F119'                         , width: 100,  fieldname: 'evmdata.f119'                , fieldsort: 'evmdata.f119'                       ,kpedit: 'evmdata.f119'                      , type:'money'        , class_data:'cell_data_numeric', class_title: 'cell_collabel_numeric'}
//		,{name: 'F117'                         , width: 100,  fieldname: 'evmdata.f117'                , fieldsort: 'evmdata.f117'                       ,kpedit: 'evmdata.f117'                      , type:'money'        , class_data:'cell_data_numeric', class_title: 'cell_collabel_numeric'}
//		,{name: 'F100'                         , width: 100,  fieldname: 'evmdata.f100'                , fieldsort: 'evmdata.f100'                       ,kpedit: 'evmdata.f100'                      , type:'money'        , class_data:'cell_data_numeric', class_title: 'cell_collabel_numeric'}
//		,{name: 'APU'                          , width: 100,  fieldname: 'evmdata.apu'                 , fieldsort: 'evmdata.apu'                        ,kpedit: 'evmdata.apu'                       , type:'money'        , class_data:'cell_data_numeric', class_title: 'cell_collabel_numeric'}
//		,{name: 'Hpw4000'                      , width: 100,  fieldname: 'evmdata.hpw4000'             , fieldsort: 'evmdata.hpw4000'                    ,kpedit: 'evmdata.hpw4000'                   , type:'money'        , class_data:'cell_data_numeric', class_title: 'cell_collabel_numeric'}
//		,{name: 'Indirect'                     , width: 100,  fieldname: 'evmdata.indirect'            , fieldsort: 'evmdata.indirect'                   ,kpedit: 'evmdata.indirect'                  , type:'money'        , class_data:'cell_data_numeric', class_title: 'cell_collabel_numeric'}
//		,{name: 'MOS'                          , width: 100,  fieldname: 'evmdata.mos'                 , fieldsort: 'evmdata.mos'                        ,kpedit: 'evmdata.mos'                       , type:'money'        , class_data:'cell_data_numeric', class_title: 'cell_collabel_numeric'}
//		,{name:'As<br/>Of<br/>Date'            , width: 70,   fieldname: 's_asof_ms'                   , fieldsort: 'asof_ms'                            ,kpedit: 'asof_ms'                           , type:'ymdepochymd'  , class_data:'cell_data_numeric', class_title: 'cell_collabel_numeric'}
//		,{name:'Original<br/>Planned<br/>Value', width: 100,  fieldname: 's_planned_value_orig'        , fieldsort: 'evmdata.planned_value_orig'         ,kpedit: 'evmdata.planned_value_orig'        , type:'money'        , class_data:'cell_data_numeric', class_title: 'cell_collabel_numeric'}
//		,{name:'Charge-<br/>back<br/>Type'     , width: 70,   fieldname: 'chargebacktype_name'         , fieldsort: 'evmdata.chargebacktype_id'          ,kpedit: 'evmdata.chargebacktype_id'         , type:'select:1=Direct,2=Indirect,3=MOS'          }
//		,{name:'mandate'                       , width: 30,   fieldname: 'content_doc_mandate'         , fieldsort: 'b_has_doc_mandate'                  ,kpedit: null                                , type:'text'         , class_title:'docname' , celltemplate:'DEFAULT'}
//		,{name:'requirement'                   , width: 30,   fieldname: 'content_doc_requirement'     , fieldsort: 'b_has_doc_requirement'              ,kpedit: null                                , type:'text'         , class_title:'docname' , celltemplate:'DEFAULT'}
//		,{name:'testplan'                      , width: 30,   fieldname: 'content_doc_testplan'        , fieldsort: 'b_has_doc_testplan'                 ,kpedit: null                                , type:'text'         , class_title:'docname' , celltemplate:'DEFAULT'}
//		,{name:'design'                        , width: 30,   fieldname: 'content_doc_design'          , fieldsort: 'b_has_doc_design'                   ,kpedit: null                                , type:'text'         , class_title:'docname' , celltemplate:'DEFAULT'}
//		,{name:'implementat`n'                 , width: 30,   fieldname: 'content_doc_implementation'  , fieldsort: 'b_has_doc_implementation'           ,kpedit: null                                , type:'text'         , class_title:'docname' , celltemplate:'DEFAULT'}
//		,{name:'testresult'                    , width: 30,   fieldname: 'content_doc_testresult'      , fieldsort: 'b_has_doc_testresult'               ,kpedit: null                                , type:'text'         , class_title:'docname' , celltemplate:'DEFAULT'}
//		,{name:'cust.accept'                   , width: 30,   fieldname: 'content_doc_custaccept'      , fieldsort: 'b_has_doc_custaccept'               ,kpedit: null                                , type:'text'         , class_title:'docname' , celltemplate:'DEFAULT'}
//		,{name:'biz.case'                      , width: 30,   fieldname: 'content_doc_bizcase'         , fieldsort: 'b_has_doc_bizcase'                  ,kpedit: null                                , type:'text'         , class_title:'docname' , celltemplate:'DEFAULT'}
//		,{name:'other'                         , width: 30,   fieldname: 'content_doc_other'           , fieldsort: 'b_has_doc_other'                    ,kpedit: null                                , type:'text'         , class_title:'docname' , celltemplate:'DEFAULT'}
//		,{name:'Business<br/>Owner'            , width: 200,  fieldname: 's_list_bizowner'             , fieldsort: 's_list_bizowner'                    ,kpedit: 's_list_bizowner'                   , type:'text'  }
//		,{name:'Executive<br/>Sponsor'         , width: 200,  fieldname: 's_list_execowner'            , fieldsort: 's_list_execowner'                   ,kpedit: 's_list_execowner'                  , type:'text'  }
//		,{name:'IT<br/>Owner'                  , width: 200,  fieldname: 's_list_itowner'              , fieldsort: 's_list_itowner'                     ,kpedit: 's_list_itowner'                    , type:'text'  }
//		,{name:'Total Capital'                 , width: 70,   fieldname: 's_capital_total'             , fieldsort: 'capital_total'                      ,kpedit: 'capital_total'                     , type:'money'        , class_data:'cell_data_numeric', class_title: 'cell_collabel_numeric'}
//		,{name:'Non-Labor Capital'             , width: 70,   fieldname: 's_capital_nonlaborcap'       , fieldsort: 'capital_nonlaborcap'                ,kpedit: 'capital_nonlaborcap'               , type:'money'        , class_data:'cell_data_numeric', class_title: 'cell_collabel_numeric'}
//		,{name:'Capital Labor'                 , width: 70,   fieldname: 's_capital_caplabor'          , fieldsort: 'capital_caplabor'                   ,kpedit: 'capital_caplabor'                  , type:'money'        , class_data:'cell_data_numeric', class_title: 'cell_collabel_numeric'}
//		,{name:'Non-Capital Labor'             , width: 70,   fieldname: 's_capital_noncaplabor'       , fieldsort: 'capital_noncaplabor'                ,kpedit: 'capital_noncaplabor'               , type:'money'        , class_data:'cell_data_numeric', class_title: 'cell_collabel_numeric'}
//		,{name:'Functional Project Group'      , width: 70,   fieldname: 'projgroup_name'              , fieldsort: 'projgroup_name'                     ,kpedit: 'projgroup_name'                    , type:'text'  }       
//		,{name:'Project Deployment Initiative' , width: 90,   fieldname: 'b_policy_deploy_initiative'  , fieldsort: 'evmdata.b_policy_deploy_initiative' ,kpedit: 'evmdata.b_policy_deploy_initiative', type:'bool'  } 
//		,{name:'IT Only Project'               , width: 70,   fieldname: 'b_it'                        , fieldsort: 'evmdata.b_it'                       ,kpedit: 'evmdata.b_it'                      , type:'bool'  }
//		,{name:'Business Managed Project'      , width: 70,   fieldname: 'b_edandf'                    , fieldsort: 'evmdata.b_edandf'                   ,kpedit: 'evmdata.b_edandf'                  , type:'bool'  }
//		,{name:'Priority Category'             , width: 70,   fieldname: 'prioritycatid'               , fieldsort: 'evmdata.prioritycatid'              ,kpedit: 'evmdata.prioritycatid'             , type:'list:A,B,C,D,E'  }
//		,{name:'Fidelity Of Estim.'            , width: 70,   fieldname: 'fidelity_of_estim_id'        , fieldsort: 'evmdata.fidelity_of_estim_id'       ,kpedit: 'evmdata.fidelity_of_estim_id'      , type:'list:1,2,3'   , class_data:'cell_data_numeric', class_title: 'cell_collabel_numeric' }
//		,{name:'Start Date'                    , width: 70,   fieldname: 'start_date_yyyymmdd'         , fieldsort: 'evmdata.start_date_yyyymmdd'        ,kpedit: 'evmdata.start_date_yyyymmdd'       , type:'yyyymmdd'     , class_data:'cell_data_numeric', class_title: 'cell_collabel_numeric' }
//		,{name:'Duration (days)'               , width: 70,   fieldname: 'duration_days'               , fieldsort: 'evmdata.duration_days'              ,kpedit: 'evmdata.duration_days'             , type:'long'         , class_data:'cell_data_numeric', class_title: 'cell_collabel_numeric' }
//		,{name:'Description'                   , width: 250,  fieldname: 'description'                 , fieldsort: 'description'                        ,kpedit: 'description'                       , type:'text'         , fieldtitle:'description' }
//		,{name:'Id'                            , width: 70,   fieldname: 'id'                          , fieldsort: 'id'                                 ,kpedit: null                                , type:'long'  }
//		];
// var olist_fieldsimple =new pw.util.List_FieldSimple();
// olist_fieldsimple.push_all_option( list_option );
// 
pw.util.List_FieldSimple =function() {
	this.list =[];
	this.cum_sum_width =0;
	
	this.push_all_option =function(list_option) {
		for (var i =0; i < list_option.length; i++) {
			var ofieldsimple =new pw.util.FieldSimple( list_option[i] );
			this.list.push(ofieldsimple);
		}
		
		// re-compute cumulative sum width and left 
		var cum_sum_width =0;
		for (var i=0; i < this.list.length; i++ ) {
			this.list[i].left =cum_sum_width;
			cum_sum_width += this.list[i].width;
		}//end-for-i
		this.cum_sum_width =cum_sum_width;
	}
};

pw.util.FieldSimple =function(options) {
  this.compute_class_title =function(options) {
    var s_class =(options.class_title || null);
    if ( ! s_class ) {
      if ( options.type === 'money' || options.type === 'long' || options.type === 'yyyymmdd' ) {
        s_class ='cell_collabel_numeric';
      }
    }
    return s_class;
  };
  this.compute_class_data =function(options) {
    var s_class =(options.class_title || null);
    if ( ! s_class ) {
      if ( options.type === 'money' || options.type === 'long' || options.type === 'yyyymmdd' ) {
        s_class ='cell_data_numeric';
      }
    }
    return s_class;
  };
  
  this.fn_data_patch =function(datarow,field,new_value,old_value) {
    var fieldsort =field.fieldsort;
    var as_tok =fieldsort.split('.');
    as_tok =(as_tok || [null]);
    var s_fieldname =as_tok.slice(-1);
    
    var data ={}
    data.id =datarow.id;
    data[s_fieldname] =new_value;
    
    return data;
  }
  
	options =(options || {});
	this.name             =(options.name || null);        // display name in column header
	this.width            =(options.width || 0);          // column width
	this.fieldname        =(options.fieldname || null);   // keypath of the field that contains the display value
	this.fieldsort        =(options.fieldsort	|| null);   // keypath of the field that contains the sort value
	this.left             =(options.left || 0);               // left postion of the column
	this.class_title      =(options.class_title || null);     // css class-attribute-value of column-label
	this.class_data       =(options.class_data  || null);     // css class-attribute-value of data-field    
	this.fieldtitle       =(options.fieldtitle  || null);     // populate HTML-attribute with cell`s value or not.
	this.kpedit           =(options.kpedit      || null);     // the keypath to the field to edit.
	this.b_cell_edit      =(this.kpedit ? true : false );     // true implies column is editable : false implies that column is not editable
	this.type             =(options.type        || 'text');   // the data type of the editable field value
	this.celltemplate     =(options.celltemplate || null);
	this.url_patch        =(options.url_patch    || null);
	this.fn_data_patch    =(options.fn_data_patch || this.fn_data_patch);
};

pw.util.fn_extract_id_from_selector =function( s_selector ) {
	return pw.util.UTIL.fn_extract_id_from_selector(s_selector);
};


pw.util.MatcherWildcard =function(expr, b_case_insensitive) {
  this.expr =expr;
  this.expr =this.expr.replace(/\*\?/g,'*');
  this.expr =this.expr.replace(/\*+/g,'*');
  this.expr =this.expr.replace(/\*$/g,'');
  this.b_case_insensitive =(b_case_insensitive === false ? false : true);
  
  if (this.b_case_insensitive) {
    this.expr =this.expr.toLocaleLowerCase();
  }
};
pw.util.MatcherWildcard.prototype.test =function(str) {
  var b_star =false;
  var i_expr =0;
  
  if (this.expr.length == 0) {
    return true;
  }
  
  if (pw.util.UTIL.is_empty_str(str)) {
    return false;
  }
  str =str+'';
  if (this.b_case_insensitive) {
    str =str.toLocaleLowerCase();
  }
  for (var i =0; i < str.length; i++ ) {
    if (this.expr[i_expr] == '*' ) {
      i_expr++;
      b_star =true
    }
    if (str[i] == this.expr[i_expr] || this.expr[i_expr] == '?') {
      if (i_expr + 1 == this.expr.length) {
        return true;
      }
      b_star =false;
      i_expr++;
    }else if (b_star) {
      //i_expr++;
    }else {
      i_expr =0;
      b_star =false;
    }
    
  }//end-for-i 
  
  return false;
};

