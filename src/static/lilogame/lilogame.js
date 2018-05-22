var pw =window.pw =(window.pw || {});
pw.lilogame =(pw.lilogame || {});

pw.util =(pw.util || {});
pw.util.Util =function() { };


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


pw.util.UTIL =new pw.util.Util();



