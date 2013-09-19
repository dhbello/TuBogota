/*
 COPYRIGHT 2009 ESRI

 TRADE SECRETS: ESRI PROPRIETARY AND CONFIDENTIAL
 Unpublished material - all rights reserved under the
 Copyright Laws of the United States and applicable international
 laws, treaties, and conventions.

 For additional information, contact:
 Environmental Systems Research Institute, Inc.
 Attn: Contracts and Legal Services Department
 380 New York Street
 Redlands, California, 92373
 USA

 email: contracts@esri.com
 */
//>>built
require({cache:{"url:esri/dijit/templates/Geocoder.html":"<div class=\"${theme}\" role=\"presentation\">\r\n    <div class=\"${_GeocoderContainerClass}\" role=\"presentation\">\r\n    \t<div class=\"${_GeocoderClass}\" data-dojo-attach-point=\"containerNode\" role=\"presentation\">\r\n    \t\t<div title=\"${_i18n.widgets.Geocoder.main.searchButtonTitle}\" tabindex=\"0\" class=\"${_searchButtonClass} ${_GeocoderIconClass}\" data-dojo-attach-point=\"submitNode\" data-dojo-attach-event=\"ondijitclick:_findThenSelect\" role=\"button\"></div>\r\n    \t\t<div aria-haspopup=\"true\" id=\"${id}_menu_button\" title=\"${_i18n.widgets.Geocoder.main.geocoderMenuButtonTitle}\" tabindex=\"0\" class=\"${_geocoderMenuArrowClass} ${_GeocoderIconClass}\" data-dojo-attach-point=\"geocoderMenuArrowNode\" role=\"button\" aria-expanded=\"false\" data-dojo-attach-event=\"ondijitclick:_toggleGeolocatorMenu\"></div>\r\n    \t\t<input aria-haspopup=\"true\" id=\"${id}_input\" tabindex=\"0\" placeholder=\"\" value=\"${value}\" autocomplete=\"off\" type=\"text\" data-dojo-attach-point=\"inputNode\" data-dojo-attach-event=\"ondijitclick:_inputClick\" role=\"textbox\">\r\n    \t\t<div tabindex=\"0\" class=\"${_clearButtonClass} ${_GeocoderIconClass}\" data-dojo-attach-point=\"clearNode\" data-dojo-attach-event=\"ondijitclick:clear\" role=\"button\"></div>\r\n    \t\t<div class=\"${_GeocoderClearClass}\" role=\"presentation\"></div>\r\n    \t</div>\r\n    \t<div class=\"${_resultsContainerClass}\" data-dojo-attach-point=\"resultsNode\" aria-labelledby=\"${id}_input\" role=\"menu\" aria-hidden=\"true\"></div>\r\n    \t<div class=\"${_geocoderMenuClass}\" data-dojo-attach-point=\"geocoderMenuNode\" role=\"presentation\">\r\n    \t\t<div class=\"${_geocoderMenuHeaderClass}\">\r\n    \t\t\t${_i18n.widgets.Geocoder.main.geocoderMenuHeader}\r\n    \t\t\t<div role=\"button\" data-dojo-attach-point=\"geocoderMenuCloseNode\" data-dojo-attach-event=\"ondijitclick:_hideGeolocatorMenu\" title=\"${_i18n.widgets.Geocoder.main.geocoderMenuCloseTitle}\" tabindex=\"0\" class=\"${_geocoderMenuCloseClass}\"></div>\r\n    \t\t\t<div class=\"${_GeocoderClearClass}\" role=\"presentation\"></div>\r\n    \t\t</div>\r\n    \t\t<div data-dojo-attach-point=\"geocoderMenuInsertNode\" aria-labelledby=\"${id}_menu_button\" role=\"menu\" aria-hidden=\"true\"></div>\r\n    \t</div>\r\n    </div>\r\n</div>"}});define("esri/dijit/Geocoder",["dojo/_base/declare","dojo/_base/lang","dojo/_base/Deferred","dojo/_base/event","dojo/dom-attr","dojo/dom-class","dojo/dom-style","dojo/dom-construct","dojo/json","dojo/keys","dojo/on","dojo/query","dojo/i18n!esri/nls/jsapi","dojo/text!esri/dijit/templates/Geocoder.html","dojo/uacss","dijit/_OnDijitClickMixin","dijit/_TemplatedMixin","dijit/_WidgetBase","dijit/focus","esri/kernel","esri/SpatialReference","esri/graphic","esri/request","esri/dijit/_EventedWidget","esri/geometry/Point","esri/geometry/Extent","esri/tasks/locator"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,on,_b,_c,_d,_e,_f,_10,_11,_12,_13,_14,_15,_16,_17,_18,_19,_1a){var _1b=_1([_17,_f,_10],{declaredClass:"esri.dijit.Geocoder",templateString:_d,_eventMap:{"select":["result"],"find-results":["results"],"auto-complete":["results"],"geocoder-select":["geocoder"],"clear":true,"enter-key-select":true,"load":true},constructor:function(_1c,_1d){var _1e=this;_1e._setPublicDefaults();_1.safeMixin(_1e,_1c);_1e._setPrivateDefaults();_1e.watch("value",_1e._updateValue);_1e.watch("theme",_1e._updateTheme);_1e.watch("activeGeocoder",_1e._setActiveGeocoder);_1e.watch("activeGeocoderIndex",_1e._setActiveGeocoderIndex);_1e.watch("geocoder",_1e._updateGeocoder);_1e.watch("arcgisGeocoder",_1e._updateGeocoder);_1e.domNode=_1d;},startup:function(){var _1f=this;if(!_1f._geocoders.length){console.log("No geocoders defined.");_1f.destroy();return;}if(!_1f.domNode){console.log("domNode is undefined.");_1f.destroy();return;}if(_1f.get("value")){_1f._checkStatus();}if(_1f.map){if(_1f.map.loaded){_1f._init();}else{on(_1f.map,"load",function(){_1f._init();});}}else{_1f._init();}},postCreate:function(){var _20=this;_20._updateGeocoder();_20._setDelegations();},destroy:function(){var i;var _21=this;if(_21._delegations){for(i=0;i<_21._delegations.length;i++){_21._delegations[i].remove();}}_8.empty(_21.domNode);_21.inherited(arguments);},clear:function(){var _22=this;_22.onClear();_5.set(_22.inputNode,"value","");_22.set("value","");_22.results=[];_6.remove(_22.containerNode,_22._hasValueClass);_5.set(_22.clearNode,"title","");_22._hideMenus();_22._hideLoading();},show:function(){var _23=this;_7.set(_23.domNode,"display","block");},hide:function(){var _24=this;_7.set(_24.domNode,"display","none");},find:function(_25){var _26=this;var def=new _3();if(_25){if(typeof _25==="string"){_26._queryDeferred(_25).then(function(_27){def.resolve(_27);});}else{if(typeof _25==="object"&&_25.hasOwnProperty("geometry")){var _28;switch(_25.geometry.type){case "extent":_28=_25.geometry.getCenter();break;case "multipoint":_28=_25.geometry.getExtent().getCenter();break;case "point":_28=_25.geometry;break;case "polygon":_28=_25.geometry.getExtent().getCenter();break;case "polyline":_28=_25.geometry.getExtent().getCenter();break;}if(_28){_26._reverseGeocodePoint(_28,_25.geometry).then(function(_29){if(_29.results[0]){if(_25.hasOwnProperty("attributes")){_29.results[0].feature.setAttributes(_2.mixin(_29.results[0].feature.attributes,_25.attributes));}if(_25.hasOwnProperty("infoTemplate")){_29.results[0].feature.setInfoTemplate(_25.infoTemplate);}if(_25.hasOwnProperty("symbol")){_29.results[0].feature.setSymbol(_25.symbol);}}def.resolve(_29);},function(_2a){def.reject(_2a);});}}else{if(typeof _25==="object"&&_25.type==="point"){_26._reverseGeocodePoint(_25).then(function(_2b){def.resolve(_2b);},function(_2c){def.reject(_2c);});}else{if(_25 instanceof Array&&_25.length===2){var pt=new _18(_25,new _14({wkid:4326}));_26._reverseGeocodePoint(pt).then(function(_2d){def.resolve(_2d);},function(_2e){def.reject(_2e);});}else{def.reject("Invalid find type");}}}}}else{_26._queryDeferred(_26.get("value")).then(function(_2f){def.resolve(_2f);});}return def;},focus:function(){var _30=this;_12.focus(_30.inputNode);},blur:function(){if(_12.curNode){_12.curNode.blur();}},select:function(e){var _31=this;_31.onSelect(e);_31._hideMenus();_31._hideLoading();if(_31.autoNavigate&&e&&e.hasOwnProperty("extent")&&_31.map){_31.map.setExtent(e.extent);}},onSelect:function(){},onFindResults:function(){},onAutoComplete:function(){},onGeocoderSelect:function(){},onClear:function(){},onEnterKeySelect:function(){},onLoad:function(){},_init:function(){var _32=this;_32.loaded=true;_32.onLoad();_32._hideMenus();},_queryDeferred:function(_33){var _34=this;var def=new _3();_34._query({delay:0,search:_33}).then(function(_35){_34.onFindResults(_35);def.resolve(_35);},function(_36){_34.onFindResults(_36);def.reject(_36);});return def;},_reverseGeocodePoint:function(pt,_37){var def=new _3();var _38=this;if(pt&&_38.activeGeocoder){var geo=_37||pt;_38._reverseTask=new _1a(_38.activeGeocoder.url);_38._reverseTask.outSpatialReference=_38._defaultSR;if(_38.map){_38._reverseTask.outSpatialReference=_38.map.spatialReference;}var _39=_38.activeGeocoder.distance||1500;_38._reverseTask.locationToAddress(pt,_39,function(_3a){var _3b=_38._hydrateResult(_3a);var obj={"results":[_3b],"geometry":geo};_38.onFindResults(obj);def.resolve(obj);},function(_3c){def.reject(_3c);});}else{def.reject("no point or active geocoder defined");}return def;},_setPublicDefaults:function(){var _3d=this;_3d.autoComplete=false;_3d.arcgisGeocoder=true;_3d.set("value","");_3d.set("theme","simpleGeocoder");_3d.activeGeocoderIndex=0;_3d.maxLocations=6;_3d.minCharacters=3;_3d.searchDelay=350;_3d.geocoderMenu=true;_3d.autoNavigate=true;_3d.showResults=true;},_setPrivateDefaults:function(){var _3e=this;_3e._i18n=_c;_3e._deferreds=[];_3e.results=[];_3e._defaultSR=new _14(4326);_3e._GeocoderContainerClass="esriGeocoderContainer";_3e._GeocoderClass="esriGeocoder";_3e._GeocoderMultipleClass="esriGeocoderMultiple";_3e._GeocoderIconClass="esriGeocoderIcon";_3e._GeocoderActiveClass="esriGeocoderActive";_3e._loadingClass="esriGeocoderLoading";_3e._resultsContainerClass="esriGeocoderResults";_3e._resultsItemClass="esriGeocoderResult";_3e._resultsItemEvenClass="esriGeocoderResultEven";_3e._resultsItemOddClass="esriGeocoderResultOdd";_3e._resultsItemFirstClass="esriGeocoderResultFirst";_3e._resultsItemLastClass="esriGeocoderResultLast";_3e._resultsPartialMatchClass="esriGeocoderResultPartial";_3e._searchButtonClass="esriGeocoderSearch";_3e._clearButtonClass="esriGeocoderReset";_3e._hasValueClass="esriGeocoderHasValue";_3e._geocoderMenuClass="esriGeocoderMenu";_3e._geocoderMenuHeaderClass="esriGeocoderMenuHeader";_3e._geocoderMenuCloseClass="esriGeocoderMenuClose";_3e._activeMenuClass="esriGeocoderMenuActive";_3e._geocoderMenuArrowClass="esriGeocoderMenuArrow";_3e._geocoderSelectedClass="esriGeocoderSelected";_3e._geocoderSelectedCheckClass="esriGeocoderSelectedCheck";_3e._GeocoderClearClass="esriGeocoderClearFloat";},_setEsriGeocoder:function(){var _3f=this;if(_3f.arcgisGeocoder){if(typeof _3f.arcgisGeocoder==="object"){_3f._arcgisGeocoder=_3f.arcgisGeocoder;}else{_3f._arcgisGeocoder={};}if(!_3f._arcgisGeocoder.url){_3f._arcgisGeocoder.url=location.protocol+"//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer";}if(!_3f._arcgisGeocoder.name){_3f._arcgisGeocoder.name=_c.widgets.Geocoder.esriGeocoderName;}if(!_3f._arcgisGeocoder.hasOwnProperty("localSearchOptions")){_3f._arcgisGeocoder.localSearchOptions={minScale:150000,distance:12000};}_3f.arcgisGeocoder=_3f._arcgisGeocoder;}else{_3f.arcgisGeocoder=false;}},_setActiveGeocoder:function(){var _40=this;_40.activeGeocoder=_40._geocoders[_40.activeGeocoderIndex];_40._updatePlaceholder();},_setGeocoderList:function(){var _41=this;var _42=[];if(_41.arcgisGeocoder){_42=_42.concat([_41._arcgisGeocoder]);}if(_41.geocoders&&_41.geocoders.length){_42=_42.concat(_41.geocoders);}_41._geocoders=_42;},_updateGeocoder:function(){var _43=this;_43.set("activeGeocoderIndex",0);_43._setEsriGeocoder();_43._setGeocoderList();_43._setActiveGeocoder();_43._insertGeocoderMenuItems();},_updatePlaceholder:function(){var _44=this;_44._placeholder="";if(_44.activeGeocoder&&_44.activeGeocoder.placeholder){_44._placeholder=_44.activeGeocoder.placeholder;}_5.set(_44.inputNode,"placeholder",_44._placeholder);_5.set(_44.submitNode,"title",_44._placeholder);},_updateValue:function(_45,_46,_47){var _48=this;if(!_48._ignoreUpdateValue){_5.set(_48.inputNode,"value",_47);_48._checkStatus();}},_updateTheme:function(_49,_4a,_4b){var _4c=this;_6.remove(_4c.domNode,_4a);_6.add(_4c.domNode,_4b);},_setActiveGeocoderIndex:function(_4d,_4e,_4f){var _50=this;_50.activeGeocoderIndex=_4f;_50._setActiveGeocoder();_50._hideMenus();_50._insertGeocoderMenuItems();var evt={attr:_50.activeGeocoder,oldVal:_4e,newVal:_4f};_50.onGeocoderSelect(evt);},_query:function(e){var _51=this;if(!e){e={delay:0};}if(!e.search){e.search=_51.get("value");}var def=new _3();_51._deferreds.push(def);_51._queryTimer=setTimeout(function(){_51._performQuery(def,e);},e.delay);return def;},_performQuery:function(def,e){var _52=this;if(e.search){_52._hideGeolocatorMenu();_52._showLoading();var _53;var _54=_52.activeGeocoder.outFields||"";var _55="";if(_52.activeGeocoder.prefix){_55+=_52.activeGeocoder.prefix;}_55+=e.search;if(_52.activeGeocoder.suffix){_55+=_52.activeGeocoder.suffix;}if(_52.activeGeocoder===_52._arcgisGeocoder){var _56=_52._defaultSR;if(_52.map){_56=_52.map.spatialReference;}_53={"text":_55,"outSR":_56.wkid||_9.stringify(_56.toJson()),"f":"json"};if(_52.map&&_52.activeGeocoder.localSearchOptions&&_52.activeGeocoder.localSearchOptions.hasOwnProperty("distance")&&_52.activeGeocoder.localSearchOptions.hasOwnProperty("minScale")){var _57=_52.map.extent.getCenter().normalize();var _58=_52.map.getScale();if(!_52.activeGeocoder.localSearchOptions.minScale||(_58&&_58<=parseFloat(_52.activeGeocoder.localSearchOptions.minScale))){_53.location=_9.stringify(_57.toJson());_53.distance=_52.activeGeocoder.localSearchOptions.distance;}}if(_54){_53.outFields=_54;}if(_52.maxLocations){_53.maxLocations=_52.maxLocations;}if(_52.activeGeocoder.sourceCountry){_53.sourceCountry=_52.activeGeocoder.sourceCountry;}if(_52.activeGeocoder.searchExtent){var _59={"xmin":_52.activeGeocoder.searchExtent.xmin,"ymin":_52.activeGeocoder.searchExtent.ymin,"xmax":_52.activeGeocoder.searchExtent.xmax,"ymax":_52.activeGeocoder.searchExtent.ymax,"spatialReference":_52.activeGeocoder.searchExtent.spatialReference.toJson()};_53.bbox=_9.stringify(_59);}_16({url:_52.activeGeocoder.url+"/find",content:_53,handleAs:"json",callbackParamName:"callback",load:function(_5a){_52._receivedResults(_5a.locations,def);}});}else{_53={address:{}};if(_52.activeGeocoder.singleLineFieldName){_53.address[_52.activeGeocoder.singleLineFieldName]=_55;}else{_53.address["Single Line Input"]=_55;}if(_54){_53.outFields=[_54];}if(_52.activeGeocoder.searchExtent){_53.searchExtent=_52.activeGeocoder.searchExtent;}_52._task=new _1a(_52.activeGeocoder.url);_52._task.outSpatialReference=_52._defaultSR;if(_52.map){_52._task.outSpatialReference=_52.map.spatialReference;}_52._task.addressToLocations(_53,function(_5b){_52._receivedResults(_5b,def);},function(_5c){_52._receivedResults(_5c,def);});}}else{_52._hideLoading();def.reject("no search to perform");}},_showResults:function(){var _5d=this;_5d._hideGeolocatorMenu();var _5e="";if(_5d.results&&_5d.results.length&&_5d.resultsNode){var _5f=_5d.get("value"),i;var _60=new RegExp("("+_5f+")","gi");_5e+="<ul role=\"presentation\">";for(i=0;i<_5d.results.length;++i){var _61=_5d._resultsItemClass+" ";if(i%2===0){_61+=_5d._resultsItemOddClass;}else{_61+=_5d._resultsItemEvenClass;}if(i===0){_61+=" "+_5d._resultsItemFirstClass;}else{if(i===(_5d.results.length-1)){_61+=" "+_5d._resultsItemLastClass;}}_5e+="<li data-text=\""+_5d.results[i].name+"\" data-item=\"true\" data-index=\""+i+"\" role=\"menuitem\" tabindex=\"0\" class=\""+_61+"\">"+_5d.results[i].name.replace(_60,"<strong class=\""+_5d._resultsPartialMatchClass+"\">"+_5f+"</strong>")+"</li>";}_5e+="</ul>";if(_5d.resultsNode){_5d.resultsNode.innerHTML=_5e;}_5d._showResultsMenu();}},_autocomplete:function(){var _62=this;_62._query({delay:_62.searchDelay,search:_62.get("value")}).then(function(_63){_62.onAutoComplete(_63);if(_62.showResults){_62._showResults(_63);}});},_receivedResults:function(_64,def){var _65=this;_65._hideLoading();var _66=_65._hydrateResults(_64);_65.results=_66;var obj={"results":_66,"value":_65.get("value")};def.resolve(obj);},_showLoading:function(){var _67=this;_6.add(_67.containerNode,_67._loadingClass);},_hideLoading:function(){var _68=this;_6.remove(_68.containerNode,_68._loadingClass);},_showGeolocatorMenu:function(){var _69=this;_6.add(_69.containerNode,_69._activeMenuClass);_7.set(_69.geocoderMenuNode,"display","block");_5.set(_69.geocoderMenuInsertNode,"aria-hidden","false");_5.set(_69.geocoderMenuArrowNode,"aria-expanded","true");},_hideGeolocatorMenu:function(){var _6a=this;_6.remove(_6a.containerNode,_6a._activeMenuClass);_7.set(_6a.geocoderMenuNode,"display","none");_5.set(_6a.geocoderMenuInsertNode,"aria-hidden","true");_5.set(_6a.geocoderMenuArrowNode,"aria-expanded","false");},_toggleGeolocatorMenu:function(){var _6b=this;_6b._hideResultsMenu();var _6c=_7.get(_6b.geocoderMenuNode,"display");if(_6c==="block"){_6b._hideGeolocatorMenu();}else{_6b._showGeolocatorMenu();}},_showResultsMenu:function(){var _6d=this;_6.add(_6d.containerNode,_6d._GeocoderActiveClass);_7.set(_6d.resultsNode,"display","block");_5.set(_6d.resultsNode,"aria-hidden","false");},_hideResultsMenu:function(){var _6e=this;_7.set(_6e.resultsNode,"display","none");_6.remove(_6e.containerNode,_6e._GeocoderActiveClass);_5.set(_6e.resultsNode,"aria-hidden","true");},_hideMenus:function(){var _6f=this;_6f._hideGeolocatorMenu();_6f._hideResultsMenu();},_insertGeocoderMenuItems:function(){var _70=this;if(_70.geocoderMenu&&_70._geocoders.length>1){var _71="";var _72="",i;_71+="<ul role=\"presentation\">";for(i=0;i<_70._geocoders.length;i++){_72=_70._resultsItemClass+" ";if(i%2===0){_72+=_70._resultsItemOddClass;}else{_72+=_70._resultsItemEvenClass;}if(i===_70.activeGeocoderIndex){_72+=" "+_70._geocoderSelectedClass;}if(i===0){_72+=" "+_70._resultsItemFirstClass;}else{if(i===(_70._geocoders.length-1)){_72+=" "+_70._resultsItemLastClass;}}var _73=_70._geocoders[i].name||_c.widgets.Geocoder.main.untitledGeocoder;_71+="<li data-index=\""+i+"\" data-item=\"true\" role=\"menuitem\" tabindex=\"0\" class=\""+_72+"\">";_71+="<div class=\""+_70._geocoderSelectedCheckClass+"\"></div>";_71+=_73;_71+="<div class=\""+_70._GeocoderClearClass+"\"></div>";_71+="</li>";}_71+="</ul>";_70.geocoderMenuInsertNode.innerHTML=_71;_7.set(_70.geocoderMenuNode,"display","none");_7.set(_70.geocoderMenuArrowNode,"display","block");_6.add(_70.containerNode,_70._GeocoderMultipleClass);}else{_70.geocoderMenuInsertNode.innerHTML="";_7.set(_70.geocoderMenuNode,"display","none");_7.set(_70.geocoderMenuArrowNode,"display","none");_6.remove(_70.containerNode,_70._GeocoderMultipleClass);}},_checkStatus:function(){var _74=this;if(_74.get("value")){_6.add(_74.containerNode,_74._hasValueClass);_5.set(_74.clearNode,"title",_c.widgets.Geocoder.main.clearButtonTitle);}else{_74.clear();}},_setDelegations:function(){var _75=this;_75._delegations=[];var _76=on(document,"click",function(e){_75._hideResultsMenu(e);});_75._delegations.push(_76);var _77=on(_75.inputNode,"keyup",function(e){_75._inputKeyUp(e);});_75._delegations.push(_77);var _78=on(_75.inputNode,"keydown",function(e){_75._inputKeyDown(e);});_75._delegations.push(_78);var _79=on(_75.geocoderMenuArrowNode,"keydown",_75._geocoderMenuButtonKeyDown());_75._delegations.push(_79);var _7a=on(_75.resultsNode,"[data-item=\"true\"]:click, [data-item=\"true\"]:keydown",function(e){clearTimeout(_75._queryTimer);var _7b=_b("[data-item=\"true\"]",_75.resultsNode);var _7c=parseInt(_5.get(this,"data-index"),10);var _7d=_5.get(this,"data-text");var _7e;if(e.type==="click"||(e.type==="keydown"&&e.keyCode===_a.ENTER)){_5.set(_75.inputNode,"value",_7d);_75.set("value",_7d);if(_75.results&&_75.results[_7c]){_75.select(_75.results[_7c]);}}else{if(e.type==="keydown"&&e.keyCode===_a.UP_ARROW){_4.stop(e);_7e=_7c-1;if(_7e<0){_75.inputNode.focus();}else{_7b[_7e].focus();}}else{if(e.type==="keydown"&&e.keyCode===_a.DOWN_ARROW){_4.stop(e);_7e=_7c+1;if(_7e>=_7b.length){_75.inputNode.focus();}else{_7b[_7e].focus();}}else{if(e.keyCode===_a.ESCAPE){_75._hideMenus();}}}}});_75._delegations.push(_7a);var _7f=on(_75.geocoderMenuInsertNode,"[data-item=\"true\"]:click, [data-item=\"true\"]:keydown",function(e){var _80=_b("[data-item=\"true\"]",_75.geocoderMenuInsertNode);var _81=parseInt(_5.get(this,"data-index"),10);var _82;if(e.type==="click"||(e.type==="keydown"&&e.keyCode===_a.ENTER)){_75._setActiveGeocoderIndex(null,null,_81);_75._hideGeolocatorMenu();}else{if(e.type==="keydown"&&e.keyCode===_a.UP_ARROW){_4.stop(e);_82=_81-1;if(_82<0){_75.geocoderMenuArrowNode.focus();}else{_80[_82].focus();}}else{if(e.type==="keydown"&&e.keyCode===_a.DOWN_ARROW){_4.stop(e);_82=_81+1;if(_82>=_80.length){_75.geocoderMenuArrowNode.focus();}else{_80[_82].focus();}}else{if(e.keyCode===_a.ESCAPE){_75._hideGeolocatorMenu();}}}}});_75._delegations.push(_7f);},_findThenSelect:function(){var _83=this;_83.find().then(function(_84){if(_84.results&&_84.results.length){_83.select(_84.results[0]);_83.onEnterKeySelect();}});},_inputKeyUp:function(e){var _85=this;if(e){clearTimeout(_85._queryTimer);var _86=_85.inputNode.value;_85._ignoreUpdateValue=true;_85.set("value",_86);_85._ignoreUpdateValue=false;var _87=0;if(_86){_87=_86.length;}if(e.keyCode===e.copyKey||e.ctrlKey||e.shiftKey||e.metaKey||e.altKey||e.keyCode===e.ALT||e.keyCode===e.CTRL||e.keyCode===e.META||e.keyCode===e.shiftKey||e.keyCode===_a.UP_ARROW||e.keyCode===_a.DOWN_ARROW||e.keyCode===_a.LEFT_ARROW||e.keyCode===_a.RIGHT_ARROW){return;}else{if(e&&e.keyCode===_a.ENTER){_85._cancelDeferreds();_85._findThenSelect();}else{if(e&&e.keyCode===_a.ESCAPE){_85._cancelDeferreds();_85._hideMenus();}else{if(e&&e.keyCode===_a.TAB){_85._cancelDeferreds();_85._hideMenus();}else{if(_85.autoComplete&&_87>=_85.minCharacters){_85._autocomplete();}else{_85._hideMenus();}}}}}_85._checkStatus();}},_cancelDeferreds:function(){var _88=this;if(_88._deferreds.length){for(var i=0;i<_88._deferreds.length;i++){_88._deferreds[i].cancel("stop query");}_88._deferreds=[];}},_inputKeyDown:function(e){var _89=this;var _8a=_b("[data-item=\"true\"]",_89.resultsNode);if(e&&e.keyCode===_a.TAB){_89._cancelDeferreds();_89._hideMenus();return;}else{if(e&&e.keyCode===_a.UP_ARROW){_4.stop(e);_89._cancelDeferreds();var _8b=_8a.length;if(_8b){_8a[_8b-1].focus();}}else{if(e&&e.keyCode===_a.DOWN_ARROW){_4.stop(e);_89._cancelDeferreds();if(_8a[0]){_8a[0].focus();}}}}},_geocoderMenuButtonKeyDown:function(e){var _8c=this;var _8d=_b("[data-item=\"true\"]",_8c.geocoderMenuInsertNode);if(e&&e.keyCode===_a.UP_ARROW){_4.stop(e);_8c._showGeolocatorMenu();var _8e=_8d.length;if(_8e){_8d[_8e-1].focus();}}else{if(e&&e.keyCode===_a.DOWN_ARROW){_4.stop(e);_8c._showGeolocatorMenu();if(_8d[0]){_8d[0].focus();}}}},_inputClick:function(){var _8f=this;_8f._hideGeolocatorMenu();if(!_8f.get("value")){_8f.clear();_8f._hideMenus();}_8f._checkStatus();},_hydrateResult:function(e){var _90=this;var sR=_90._defaultSR;if(_90.map){sR=_90.map.spatialReference;}var _91={},_92;if(e.hasOwnProperty("extent")){_91.extent=new _19(e.extent);_91.extent.setSpatialReference(new _14(sR));if(e.hasOwnProperty("name")){_91.name=e.name;}if(e.hasOwnProperty("feature")){_91.feature=new _15(e.feature);_92=_91.feature.geometry;if(_92){_92.setSpatialReference(sR);}}}else{if(e.hasOwnProperty("location")){var _93=new _18(e.location.x,e.location.y,sR);if(_90.map){_91.extent=_90.map.extent.centerAt(_93);}else{_91.extent=new _19({"xmin":_93.x-0.25,"ymin":_93.y-0.25,"xmax":_93.x+0.25,"ymax":_93.y+0.25,"spatialReference":{"wkid":4326}});}if(e.hasOwnProperty("address")&&typeof e.address==="string"){_91.name=e.address;}else{if(e.hasOwnProperty("address")&&typeof e.address==="object"){var _94="";if(e.address.Address){_94+=e.address.Address+" ";}if(e.address.City){_94+=e.address.City+" ";}if(e.address.Region){_94+=e.address.Region+" ";}if(e.address.Postal){_94+=e.address.Postal+" ";}if(e.address.CountryCode){_94+=e.address.CountryCode+" ";}_91.name=_2.trim(_94);}}var _95={};if(e.hasOwnProperty("attributes")){_95=e.attributes;}if(e.hasOwnProperty("score")){_95.score=e.score;}_91.feature=new _15(_93,null,_95,null);}}return _91;},_hydrateResults:function(e){var _96=this;var _97=[];if(e&&e.length){var i=0;for(i;i<e.length&&i<_96.maxLocations;i++){var _98=_96._hydrateResult(e[i]);_97.push(_98);}}return _97;}});if(_e("extend-esri")){_2.setObject("dijit.Geocoder",_1b,_13);}return _1b;});