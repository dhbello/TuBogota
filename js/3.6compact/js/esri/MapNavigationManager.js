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
define("esri/MapNavigationManager",["dojo/_base/declare","dojo/_base/lang","dojo/_base/array","dojo/_base/connect","dojo/_base/event","dojo/mouse","dojo/keys","esri/kernel","esri/MouseEvents","esri/TouchEvents","esri/PointerEvents","esri/config","esri/sniff","esri/lang","esri/fx","esri/graphic","esri/tileUtils","esri/geometry/ScreenPoint","esri/geometry/Extent","esri/geometry/Rect","esri/geometry/mathUtils","esri/symbols/SimpleFillSymbol"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c,_d,_e,_f,_10,_11,_12,_13,_14,_15,_16){var _17=_4.connect,_18=_4.disconnect,_19=1,_1a=-1,_1b=100,_1c=10,_1d=[_7.NUMPAD_PLUS,61,_7.NUMPAD_MINUS,_7.UP_ARROW,_7.NUMPAD_8,_7.RIGHT_ARROW,_7.NUMPAD_6,_7.DOWN_ARROW,_7.NUMPAD_2,_7.LEFT_ARROW,_7.NUMPAD_4,_7.PAGE_UP,_7.NUMPAD_9,_7.PAGE_DOWN,_7.NUMPAD_3,_7.END,_7.NUMPAD_1,_7.HOME,_7.NUMPAD_7];var _1e=_1(null,{declaredClass:"esri.MapNavigationManager",eventModel:"",constructor:function(map,_1f){this.map=map;_2.mixin(this,_1f);var _20=map.__container;if(_d("esri-pointer")){this.pointerEvents=new _b(_20,{map:map});this.eventModel="pointer";}else{if(_d("esri-touch")){this.touchEvents=new _a(_20,{map:map});this.mouseEvents=new _9(_20,{map:map});this.eventModel="touch";}else{this.mouseEvents=new _9(_20,{map:map});this.eventModel="mouse";}}this._zoomRect=new _10(null,new _16(_c.defaults.map.zoomSymbol));this._keyDx=this._keyDy=0;this._adjustPinch=_2.hitch(this,this._adjustPinch);this._adjustPinchEnd=_2.hitch(this,this._adjustPinchEnd);},_panInit:function(evt){var _21=this.mouseEvents;if(_6.isLeft(evt)&&this.map.isPan&&!evt.shiftKey){this._dragOrigin=new _12(0,0);_2.mixin(this._dragOrigin,evt.screenPoint);this._panStartHandle=_17(_21,"onMouseDragStart",this,this._panStart);this._panHandle=_17(_21,"onMouseDrag",this,this._pan);this._panEndHandle=_17(_21,"onMouseUp",this,this._panEnd);if(_d("chrome")){evt.preventDefault();}}},_panStart:function(evt){this.map.setCursor("move");this.map.__panStart(evt.screenPoint.x,evt.screenPoint.y);},_pan:function(evt){this.map.__pan(evt.screenPoint.x-this._dragOrigin.x,evt.screenPoint.y-this._dragOrigin.y);},_panEnd:function(evt){_18(this._panStartHandle);_18(this._panHandle);_18(this._panEndHandle);this._panStartHandle=this._panHandle=this._panEndHandle=null;var map=this.map;if(map.__panning){map.__panEnd(evt.screenPoint.x-this._dragOrigin.x,evt.screenPoint.y-this._dragOrigin.y);map.resetMapCursor();}},_zoomInit:function(evt){var map=this.map,_22=this.pointerEvents||this.mouseEvents;if((_6.isLeft(evt)||evt.pointerType)&&map.isRubberBandZoom&&evt.shiftKey){map.setCursor("crosshair");this._dragOrigin=_2.mixin({},evt.screenPoint);this._zoomDir=(evt.ctrlKey||evt.metaKey)?_1a:_19;if(this.pointerEvents){this._zoomHandle=_17(_22,"onSwipeMove",this,this._zoom);this._zoomEndHandle=_17(_22,"onSwipeEnd",this,this._zoomEnd);}else{this._zoomHandle=_17(_22,"onMouseDrag",this,this._zoom);this._zoomEndHandle=_17(_22,"onMouseUp",this,this._zoomEnd);}if(_d("chrome")){evt.preventDefault();}}},_zoom:function(evt){var map=this.map,_23=this._normalizeRect(evt).offset(map.__visibleRect.x,map.__visibleRect.y),g=map.graphics,_24=this._zoomRect;if(!_24.geometry){map.setCursor("crosshair");}if(_24.geometry){g.remove(_24,true);}var tl=map.toMap(new _12(_23.x,_23.y)),br=map.toMap(new _12(_23.x+_23.width,_23.y+_23.height));_23=new _14(tl.x,tl.y,br.x-tl.x,tl.y-br.y,map.spatialReference);_23._originOnly=true;_24.setGeometry(_23);g.add(_24,true);},_zoomEnd:function(evt){var _25=this._zoomRect,map=this.map,ext=map.extent,sr=map.spatialReference;_18(this._zoomHandle);_18(this._zoomEndHandle);this._zoomHandle=this._zoomEndHandle=null;if(map._canZoom(this._zoomDir)&&_25.getDojoShape()){map.graphics.remove(_25);_25.geometry=null;var _26=this._normalizeRect(evt);_26.x+=map.__visibleRect.x;_26.y+=map.__visibleRect.y;var _27;if(this._zoomDir===_1a){var _28=ext.getWidth(),_29=(_28*map.width)/_26.width,_2a=(_29-_28)/2;_27=new _13(ext.xmin-_2a,ext.ymin-_2a,ext.xmax+_2a,ext.ymax+_2a,sr);}else{var min=map.toMap({x:_26.x,y:(_26.y+_26.height)}),max=map.toMap({x:(_26.x+_26.width),y:_26.y});_27=new _13(min.x,min.y,max.x,max.y,sr);}map._extentUtil(null,null,_27);}if(_25.getDojoShape()){map.graphics.remove(_25,true);}this._zoomDir=0;map.resetMapCursor();},_wheelZoom:function(evt,_2b){var map=this.map;if(!_2b){if(map.smartNavigation&&!evt.shiftKey&&!map._isPanningOrZooming()){map.disableScrollWheelZoom();this._setScrollWheelPan(true);this._wheelPan(evt);return;}var _2c=evt.timeStamp;if(!_e.isDefined(_2c)||_2c<=0){_2c=(new Date()).getTime();}var _2d=this._mwts?(_2c-this._mwts):_2c;if(_2d<_1b){return;}this._mwts=_2c;}if(!map._canZoom(evt.value)){return;}map._extentUtil({numLevels:evt.value,mapAnchor:evt.mapPoint,screenAnchor:evt.screenPoint});},_wheelPan:function(evt){var map=this.map;if(evt.shiftKey&&!map._isPanningOrZooming()){this._setScrollWheelPan(false);map.enableScrollWheelZoom();this._wheelZoom(evt);return;}var dx=0,dy=0;if(_d("ff")){if(evt.axis===evt.HORIZONTAL_AXIS){dx=-evt.detail;}else{dy=-evt.detail;}}else{dx=evt.wheelDeltaX;dy=evt.wheelDeltaY;}map.translate(dx,dy);},_setScrollWheelPan:function(_2e){var map=this.map;map.isScrollWheelPan=_2e;this.mouseEvents.enableMouseWheel(_2e);_18(this._mwMacHandle);this._mwMacHandle=null;if(_2e){this._mwMacHandle=_17(this.mouseEvents,"onMouseWheel",this,this._wheelPan);}},_recenter:function(evt){if(evt.shiftKey&&!this.map._isPanningOrZooming()){this.map.centerAt(evt.mapPoint);}},_recenterZoom:function(evt){if(evt.shiftKey&&!this.map._isPanningOrZooming()){evt.value=(evt.ctrlKey||evt.metaKey)?_1a:_19;this._wheelZoom(evt,true);}},_dblClickZoom:function(evt){if(!this.map._isPanningOrZooming()){evt.value=1;this._wheelZoom(evt,true);}},_twoFingerTap:function(evt){if(!this.map._isPanningOrZooming()){evt.value=-1;this._wheelZoom(evt,true);}},_keyDown:function(evt){var _2f=evt.keyCode,map=this.map;if(_3.indexOf(_1d,_2f)!==-1){if(_2f===_7.NUMPAD_PLUS||_2f===61){map._extentUtil({numLevels:1});}else{if(_2f===_7.NUMPAD_MINUS){map._extentUtil({numLevels:-1});}else{if(!map.__panning){map.__panStart(0,0);}switch(_2f){case _7.UP_ARROW:case _7.NUMPAD_8:this._keyDy+=_1c;break;case _7.RIGHT_ARROW:case _7.NUMPAD_6:this._keyDx-=_1c;break;case _7.DOWN_ARROW:case _7.NUMPAD_2:this._keyDy-=_1c;break;case _7.LEFT_ARROW:case _7.NUMPAD_4:this._keyDx+=_1c;break;case _7.PAGE_UP:case _7.NUMPAD_9:this._keyDx-=_1c;this._keyDy+=_1c;break;case _7.PAGE_DOWN:case _7.NUMPAD_3:this._keyDx-=_1c;this._keyDy-=_1c;break;case _7.END:case _7.NUMPAD_1:this._keyDx+=_1c;this._keyDy-=_1c;break;case _7.HOME:case _7.NUMPAD_7:this._keyDx+=_1c;this._keyDy+=_1c;break;default:return;}map.__pan(this._keyDx,this._keyDy);}}_5.stop(evt);}},_keyEnd:function(evt){var map=this.map;if(map.__panning&&(evt.keyCode!==_7.SHIFT)){map.__panEnd(this._keyDx,this._keyDy);this._keyDx=this._keyDy=0;}},_swipeInit:function(evt){var map=this.map,_30=map._zoomAnim||map._panAnim;if(evt.shiftKey){return false;}if(_30&&_30._active){_30.stop();_30._fire("onEnd",[_30.node]);}this._dragOrigin=new _12(0,0);_2.mixin(this._dragOrigin,evt.screenPoint);_18(this._swipeHandle);_18(this._swipeEndHandle);this._swipeHandle=_17(this.touchEvents||this.pointerEvents,"onSwipeMove",this,this._swipe);this._swipeEndHandle=_17(this.touchEvents||this.pointerEvents,"onSwipeEnd",this,this._swipeEnd);},_swipe:function(evt){var map=this.map;if(map.__panning){this._panX=evt.screenPoint.x;this._panY=evt.screenPoint.y;map.__pan(evt.screenPoint.x-this._dragOrigin.x,evt.screenPoint.y-this._dragOrigin.y);}else{map.setCursor("move");map.__panStart(evt.screenPoint.x,evt.screenPoint.y);}},_swipeEnd:function(evt){_18(this._swipeHandle);_18(this._swipeEndHandle);this._swipeHandle=this._swipeEndHandle=null;var map=this.map;if(map.__panning){map.resetMapCursor();map.__panEnd(evt.screenPoint.x-this._dragOrigin.x,evt.screenPoint.y-this._dragOrigin.y);}},_pinchInit:function(evt){var map=this.map,_31=map._zoomAnim||map._panAnim;if(_31&&_31._active){_31.stop();_31._fire("onEnd",[_31.node]);}else{if(map.__panning){evt.screenPoint=new _12(this._panX,this._panY);evt.mapPoint=map.toMap(evt.screenPoint);this._swipeEnd(evt);}}_18(this._pinchHandle);_18(this._pinchEndHandle);this._pinchHandle=_17(this.touchEvents||this.pointerEvents,"onPinchMove",this,this._pinch);this._pinchEndHandle=_17(this.touchEvents||this.pointerEvents,"onPinchEnd",this,this._pinchEnd);},_pinch:function(evt){var map=this.map;if(evt.screenPoints){this.currLength=_15.getLength(evt.screenPoints[0],evt.screenPoints[1]);if(map.__zooming){var _32=this.currLength/this._length;this._zoomStartExtent=this.__scaleExtent(map.extent,_32,this._dragOrigin);map.__zoom(this._zoomStartExtent,_32,this._dragOrigin);}else{this._dragOrigin=new _12((evt.screenPoints[0].x+evt.screenPoints[1].x)/2,(evt.screenPoints[0].y+evt.screenPoints[1].y)/2);this._length=this.currLength;map.__zoomStart(map.extent,this._dragOrigin);}map._fireOnScale(this.currLength/this._length,this._dragOrigin,true);}},_pinchEnd:function(evt){var map=this.map;_18(this._pinchHandle);_18(this._pinchEndHandle);this._pinchHandle=this._pinchEndHandle=null;if(map.__zooming&&map._zoomAnim===null){var _33=this.currLength/this._length,_34=map.extent.getWidth();this._zoomAnimAnchor=map.toMap(this._dragOrigin);this._zoomStartExtent=this.__scaleExtent(map.extent,1/_33,this._zoomAnimAnchor);if(map.__tileInfo){var ct=_11.getCandidateTileInfo(map,map.__tileInfo,this._zoomStartExtent),_35=map.__getExtentForLevel(ct.lod.level,this._zoomAnimAnchor),_36=map.getMinZoom(),_37=map.getMaxZoom(),_38=_35.extent,_39=_35.lod,_3a=_34/_38.getWidth(),_3b=ct.lod.level;if(_33<1){if(_3a>_33){_3b--;}}else{if(_3a<_33){_3b++;}}if(_3b<_36){_3b=_36;}else{if(_3b>_37){_3b=_37;}}if(_3b!==ct.lod.level){_35=map.__getExtentForLevel(_3b,this._zoomAnimAnchor);_38=_35.extent;_39=_35.lod;}this._zoomEndExtent=_38;this._zoomEndLod=_39;map._zoomAnim=_f.animateRange({range:{start:(_34/this._zoomStartExtent.getWidth()),end:_3a},duration:_c.defaults.map.zoomDuration,rate:_c.defaults.map.zoomRate,onAnimate:this._adjustPinch,onEnd:this._adjustPinchEnd});map._zoomAnim.play();map._fireOnScale(map.extent.getWidth()/this._zoomEndExtent.getWidth(),this._dragOrigin);}else{this._zoomEndExtent=this._zoomStartExtent;map._fireOnScale(map.extent.getWidth()/this._zoomEndExtent.getWidth(),this._dragOrigin);this._adjustPinchEnd();}}},_adjustPinch:function(_3c){var _3d=this.__scaleExtent(this.map.extent,_3c,this._zoomAnimAnchor);this.map.__zoom(_3d,_3c,this._dragOrigin);},_adjustPinchEnd:function(){var map=this.map,_3e=map.extent.getWidth()/this._zoomEndExtent.getWidth(),_3f=this.__scaleExtent(map.extent,1/_3e,this._zoomAnimAnchor),_40=this._dragOrigin,lod=this._zoomEndLod;this._zoomStartExtent=this._zoomEndExtent=this._zoomEndLod=this._dragOrigin=map._zoomAnim=this._zoomAnimAnchor=null;map.__zoomEnd(_3f,_3e,_40,lod,true);},__scaleExtent:function(_41,_42,_43){var _44=_43||_41.getCenter(),_45=_41.expand(_42),_46=_41.xmin-((_45.getWidth()-_41.getWidth())*(_44.x-_41.xmin)/_41.getWidth()),_47=_41.ymax-((_45.getHeight()-_41.getHeight())*(_44.y-_41.ymax)/_41.getHeight());return new _13(_46,_47-_45.getHeight(),_46+_45.getWidth(),_47,_41.spatialReference);},_normalizeRect:function(evt){var xy=evt.screenPoint,dx=this._dragOrigin.x,dy=this._dragOrigin.y,_48=new _14((xy.x<dx?xy.x:dx)-this.map.__visibleRect.x,(xy.y<dy?xy.y:dy)-this.map.__visibleRect.y,Math.abs(xy.x-dx),Math.abs(xy.y-dy));delete _48.spatialReference;if(_48.width===0){_48.width=1;}if(_48.height===0){_48.height=1;}return _48;},setImmediateClick:function(_49){switch(this.eventModel){case "mouse":this.mouseEvents.setImmediateClick(_49);break;case "touch":case "pointer":(this.touchEvents||this.pointerEvents).setImmediateTap(_49);break;}},enablePan:function(){this.disablePan();switch(this.eventModel){case "mouse":this._panInitHandle=_17(this.mouseEvents,"onMouseDown",this,this._panInit);break;case "touch":this._panInitHandle=_17(this.mouseEvents,"onMouseDown",this,this._panInit);this._swipeInitHandle=_17(this.touchEvents,"onSwipeStart",this,this._swipeInit);break;case "pointer":this._swipeInitHandle=_17(this.pointerEvents,"onSwipeStart",this,this._swipeInit);break;}},disablePan:function(){_18(this._panInitHandle);this._panInitHandle=null;_18(this._swipeInitHandle);this._swipeInitHandle=null;},enableRubberBandZoom:function(){this.disableRubberBandZoom();this._zoomInitHandle=this.pointerEvents?_17(this.pointerEvents,"onSwipeStart",this,this._zoomInit):_17(this.mouseEvents,"onMouseDown",this,this._zoomInit);},disableRubberBandZoom:function(){_18(this._zoomInitHandle);this._zoomInitHandle=null;},enablePinchZoom:function(){this.disablePinchZoom();if(this.eventModel==="touch"||this.eventModel==="pointer"){this._pinchInitHandle=_17(this.touchEvents||this.pointerEvents,"onPinchStart",this,this._pinchInit);}},disablePinchZoom:function(){_18(this._pinchInitHandle);this._pinchInitHandle=null;},enableScrollWheelZoom:function(){this.disableScrollWheelZoom();this._wheelHandle=_17(this.mouseEvents||this.pointerEvents,"onMouseWheel",this,this._wheelZoom);},disableScrollWheelZoom:function(){_18(this._wheelHandle);this._wheelHandle=null;},enableDoubleClickZoom:function(){this.disableDoubleClickZoom();switch(this.eventModel){case "mouse":this._dblClickHandle=_17(this.mouseEvents,"onDblClick",this,this._dblClickZoom);break;case "touch":this._dblClickHandle=_17(this.mouseEvents,"onDblClick",this,this._dblClickZoom);this._dblTapHandle=_17(this.touchEvents,"onDoubleTap",this,this._dblClickZoom);this._zoomOutHandle=_17(this.touchEvents,"onTwoFingerTap",this,this._twoFingerTap);break;case "pointer":this._dblTapHandle=_17(this.pointerEvents,"onDoubleTap",this,this._dblClickZoom);this._zoomOutHandle=_17(this.pointerEvents,"onTwoFingerTap",this,this._twoFingerTap);break;}},disableDoubleClickZoom:function(){_18(this._dblClickHandle);_18(this._zoomOutHandle);if(this._dblTapHandle){_18(this._dblTapHandle);}this._dblClickHandle=this._zoomOutHandle=this._dblTapHandle=null;},enableShiftDoubleClickZoom:function(){this.disableShiftDoubleClickZoom();this._sDblClickHandle=_17(this.pointerEvents||this.mouseEvents,"onDblClick",this,this._recenterZoom);},disableShiftDoubleClickZoom:function(){_18(this._sDblClickHandle);this._sDblClickHandle=null;},enableClickRecenter:function(){this.disableClickRecenter();this._recenterHandle=_17(this.pointerEvents||this.mouseEvents,"onClick",this,this._recenter);},disableClickRecenter:function(){_18(this._recenterHandle);this._recenterHandle=null;},enableKeyboardNavigation:function(){this.disableKeyboardNavigation();this._keyHandle=_17(this.pointerEvents||this.mouseEvents,"onKeyDown",this,this._keyDown);this._keyEndHandle=_17(this.pointerEvents||this.mouseEvents,"onKeyUp",this,this._keyEnd);},disableKeyboardNavigation:function(){_18(this._keyHandle);_18(this._keyEndHandle);this._keyHandle=this._keyEndHandle=null;},enableNavigation:function(){var map=this.map;if(map&&map.loaded){map.enableDoubleClickZoom();map.enableClickRecenter();map.enablePan();map.enableRubberBandZoom();this.enablePinchZoom();map.enableKeyboardNavigation();if(map.smartNavigation){this._setScrollWheelPan(true);}else{map.enableScrollWheelZoom();}}},disableNavigation:function(){var map=this.map;if(map&&map.loaded){map.disableDoubleClickZoom();map.disableClickRecenter();map.disablePan();map.disableRubberBandZoom();this.disablePinchZoom();map.disableKeyboardNavigation();map.disableScrollWheelZoom();if(map.smartNavigation){this._setScrollWheelPan(false);}}},destroy:function(){if(this.touchEvents){this.touchEvents.destroy();}if(this.mouseEvents){this.mouseEvents.destroy();}if(this.pointerEvents){this.pointerEvents.destroy();}var i,_4a=[this._panInitHandle,this._panStartHandle,this._panHandle,this._panEndHandle,this._zoomInitHandle,this._zoomHandle,this._zoomEndHandle,this._wheelHandle,this._mwMacHandle,this._dblClickHandle,this._zoomOutHandle,this._recenterHandle,this._sDblClickHandle,this._dblTapHandle,this._keyHandle,this._keyEndHandle,this._swipeInitHandle,this._swipeHandle,this._swipeEndHandle,this._pinchInitHandle,this._pinchHandle,this._pinchEndHandle];for(i=0;i<_4a.length;i++){_18(_4a[i]);}this.map=this.touchEvents=this.mouseEvents=this.eventModel=this.pointerEvents=this._zoomRect=this._dragOrigin=this._panInitHandle=this._panStartHandle=this._panHandle=this._panEndHandle=this._zoomInitHandle=this._zoomHandle=this._zoomEndHandle=this._wheelHandle=this._mwMacHandle=this._dblClickHandle=this._zoomOutHandle=this._recenterHandle=this._sDblClickHandle=this._dblTapHandle=this._keyHandle=this._keyEndHandle=this._swipeInitHandle=this._swipeHandle=this._swipeEndHandle=this._pinchInitHandle=this._pinchHandle=this._pinchEndHandle=null;}});if(_d("extend-esri")){_8.MapNavigationManager=_1e;}return _1e;});