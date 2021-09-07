/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./config/web.js":
/*!***********************!*\
  !*** ./config/web.js ***!
  \***********************/
/***/ (function(module) {

/**
 * 前端接口配置抽取
 */

module.exports = {
  dev: {
    qihuo: function(){ //期货接口
      return 'http://static.futsse.eastmoney.com/'
    },
    quotepush: function(){ //行情接口
      return '//push2.eastmoney.com/'
    },
    quoteut: function(){ //行情接口ut
      return '7eea3edcaed734bea9cbfc24409ed989'
    }
  },
  test: {
    qihuo: function(){
      return 'http://static.futssetest.eastmoney.com/'
    },
    quotepush: function(){
      return '//push2.eastmoney.com/'
    },
    quoteut: function(){
      return '7eea3edcaed734bea9cbfc24409ed989'
    }
  },
  production: {
    qihuo: function(){
      return 'http://static.futsse.eastmoney.com/'
    },
    quotepush: function(){
      return '//push2.eastmoney.com/'
    },
    quoteut: function(){
      return '7eea3edcaed734bea9cbfc24409ed989'
    }
  },
  getParam: function(name){
    var urlpara = location.search;
    var par = {};
    if (urlpara != "") {
      urlpara = urlpara.substring(1, urlpara.length);
      var para = urlpara.split("&");
      var parname;
      var parvalue;
      for (var i = 0; i < para.length; i++) {
        parname = para[i].substring(0, para[i].indexOf("="));
        parvalue = para[i].substring(para[i].indexOf("=") + 1, para[i].length);
        par[parname] = parvalue;
      }
    }
    if(typeof (par[name]) != "undefined"){
      return par[name];
    }
    else{
      return null;
    }
  },
  getPath: function (name) {
    if (this.getParam('env')) {
      return this[this.getParam('env')][name]()
    }
    return this.production[name]()
  }
}

/***/ }),

/***/ "./node_modules/dot/doT.js":
/*!*********************************!*\
  !*** ./node_modules/dot/doT.js ***!
  \*********************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;// doT.js
// 2011-2014, Laura Doktorova, https://github.com/olado/doT
// Licensed under the MIT license.

(function () {
	"use strict";

	var doT = {
		name: "doT",
		version: "1.1.1",
		templateSettings: {
			evaluate:    /\{\{([\s\S]+?(\}?)+)\}\}/g,
			interpolate: /\{\{=([\s\S]+?)\}\}/g,
			encode:      /\{\{!([\s\S]+?)\}\}/g,
			use:         /\{\{#([\s\S]+?)\}\}/g,
			useParams:   /(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,
			define:      /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
			defineParams:/^\s*([\w$]+):([\s\S]+)/,
			conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
			iterate:     /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
			varname:	"it",
			strip:		true,
			append:		true,
			selfcontained: false,
			doNotSkipEncoded: false
		},
		template: undefined, //fn, compile template
		compile:  undefined, //fn, for express
		log: true
	}, _globals;

	doT.encodeHTMLSource = function(doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	};

	_globals = (function(){ return this || (0,eval)("this"); }());

	/* istanbul ignore else */
	if ( true && module.exports) {
		module.exports = doT;
	} else if (true) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(){return doT;}).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}

	var startend = {
		append: { start: "'+(",      end: ")+'",      startencode: "'+encodeHTML(" },
		split:  { start: "';out+=(", end: ");out+='", startencode: "';out+=encodeHTML(" }
	}, skip = /$^/;

	function resolveDefs(c, block, def) {
		return ((typeof block === "string") ? block : block.toString())
		.replace(c.define || skip, function(m, code, assign, value) {
			if (code.indexOf("def.") === 0) {
				code = code.substring(4);
			}
			if (!(code in def)) {
				if (assign === ":") {
					if (c.defineParams) value.replace(c.defineParams, function(m, param, v) {
						def[code] = {arg: param, text: v};
					});
					if (!(code in def)) def[code]= value;
				} else {
					new Function("def", "def['"+code+"']=" + value)(def);
				}
			}
			return "";
		})
		.replace(c.use || skip, function(m, code) {
			if (c.useParams) code = code.replace(c.useParams, function(m, s, d, param) {
				if (def[d] && def[d].arg && param) {
					var rw = (d+":"+param).replace(/'|\\/g, "_");
					def.__exp = def.__exp || {};
					def.__exp[rw] = def[d].text.replace(new RegExp("(^|[^\\w$])" + def[d].arg + "([^\\w$])", "g"), "$1" + param + "$2");
					return s + "def.__exp['"+rw+"']";
				}
			});
			var v = new Function("def", "return " + code)(def);
			return v ? resolveDefs(c, v, def) : v;
		});
	}

	function unescape(code) {
		return code.replace(/\\('|\\)/g, "$1").replace(/[\r\t\n]/g, " ");
	}

	doT.template = function(tmpl, c, def) {
		c = c || doT.templateSettings;
		var cse = c.append ? startend.append : startend.split, needhtmlencode, sid = 0, indv,
			str  = (c.use || c.define) ? resolveDefs(c, tmpl, def || {}) : tmpl;

		str = ("var out='" + (c.strip ? str.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g," ")
					.replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g,""): str)
			.replace(/'|\\/g, "\\$&")
			.replace(c.interpolate || skip, function(m, code) {
				return cse.start + unescape(code) + cse.end;
			})
			.replace(c.encode || skip, function(m, code) {
				needhtmlencode = true;
				return cse.startencode + unescape(code) + cse.end;
			})
			.replace(c.conditional || skip, function(m, elsecase, code) {
				return elsecase ?
					(code ? "';}else if(" + unescape(code) + "){out+='" : "';}else{out+='") :
					(code ? "';if(" + unescape(code) + "){out+='" : "';}out+='");
			})
			.replace(c.iterate || skip, function(m, iterate, vname, iname) {
				if (!iterate) return "';} } out+='";
				sid+=1; indv=iname || "i"+sid; iterate=unescape(iterate);
				return "';var arr"+sid+"="+iterate+";if(arr"+sid+"){var "+vname+","+indv+"=-1,l"+sid+"=arr"+sid+".length-1;while("+indv+"<l"+sid+"){"
					+vname+"=arr"+sid+"["+indv+"+=1];out+='";
			})
			.replace(c.evaluate || skip, function(m, code) {
				return "';" + unescape(code) + "out+='";
			})
			+ "';return out;")
			.replace(/\n/g, "\\n").replace(/\t/g, '\\t').replace(/\r/g, "\\r")
			.replace(/(\s|;|\}|^|\{)out\+='';/g, '$1').replace(/\+''/g, "");
			//.replace(/(\s|;|\}|^|\{)out\+=''\+/g,'$1out+=');

		if (needhtmlencode) {
			if (!c.selfcontained && _globals && !_globals._encodeHTML) _globals._encodeHTML = doT.encodeHTMLSource(c.doNotSkipEncoded);
			str = "var encodeHTML = typeof _encodeHTML !== 'undefined' ? _encodeHTML : ("
				+ doT.encodeHTMLSource.toString() + "(" + (c.doNotSkipEncoded || '') + "));"
				+ str;
		}
		try {
			return new Function(c.varname, str);
		} catch (e) {
			/* istanbul ignore else */
			if (typeof console !== "undefined") console.log("Could not create a template function: " + str);
			throw e;
		}
	};

	doT.compile = function(tmpl, def) {
		return doT.template(tmpl, null, def);
	};
}());


/***/ }),

/***/ "./src/modules/newzxg/myfavorlist_concept.dot":
/*!****************************************************!*\
  !*** ./src/modules/newzxg/myfavorlist_concept.dot ***!
  \****************************************************/
/***/ (function(module) {

module.exports = "{{? it.list.length }}\r\n{{~it.list :item:index}}\r\n<tr id=\"favor-{{= item.market}}_{{= item.code}}\">\r\n    <td class=\"first-td\">\r\n        <a title=\"{{= item.name}}-{{= item.code}}\" href=\"{{= item.href}}\" target=\"_blank\">{{= it.txt.txtLeft(item.name, 8, true, '..')}}<br>{{= it.txt.txtLeft(item.code, 8, true, '..')}}</a>\r\n    </td>\r\n    <td class=\"data\">{{= it.txt.textNumColor(it.txt.showNumberWithZoom(item.price, item.price_fixnumber, true), item.zdf)}}<br>{{= it.txt.textNumColor(it.txt.showPercentWithZoom(item.zdf, item.zdf_fixnumber, true), item.zdf)}}</td>\r\n    <td class=\"img-td\">\r\n        <a href=\"{{= item.href}}\" target=\"_blank\" title=\"点击查看{{= item.name}}分时图\">\r\n            <img data-src=\"//webquotepic.eastmoney.com/GetPic.aspx?nid={{= item.newcode}}&imageType=RJY&token=44c9d251add88e27b65ed86506f6e5da92\" src=\"//webquotepic.eastmoney.com/GetPic.aspx?nid={{= item.newcode}}&imageType=RJY&token=44c9d251add88e27b65ed86506f6e5da92\">\r\n        </a>\r\n    </td>\r\n</tr>\r\n{{~}}\r\n{{??}}\r\n<tr>\r\n  <td colspan=\"3\" style=\"height: 320px; text-align: center;\" class=\"waiting \">您暂无自选股</td>\r\n</tr>\r\n{{?}}"

/***/ }),

/***/ "./src/modules/old_concept/components/companyprofile/business.popup.art":
/*!******************************************************************************!*\
  !*** ./src/modules/old_concept/components/companyprofile/business.popup.art ***!
  \******************************************************************************/
/***/ (function(module) {

module.exports = "<p>{{businessRange}}</p>\r\n<div class=\"report-date\">{{rdate| formatDate 'yyyy-MM-dd'}}</div>\r\n{{each constitutes val idx}}\r\n<div class=\"business-wrapper\">\r\n    <div class=\"business-chart\"><div id=\"{{val.key}}-chart\"></div></div>\r\n    <div class=\"business-word\">\r\n        <div class=\"business-title\">按{{val.key === 'industry'?'行业':val.key === 'product'?'产品':'地域'}}分类</div>\r\n        {{each val.value}}\r\n        {{if $index < 10}}<div class=\"business-tag\"><i class=\"palette\" style=\"background: {{colors[$index]}}\"></i>{{$value.MainForm}}</div>{{/if}}\r\n        {{/each}}\r\n    </div>\r\n</div>\r\n{{if constitutes.length-1 !== $index}}<div class=\"line\"></div>{{/if}}\r\n{{/each}}"

/***/ }),

/***/ "./src/modules/old_concept/components/customfields/customfields.art":
/*!**************************************************************************!*\
  !*** ./src/modules/old_concept/components/customfields/customfields.art ***!
  \**************************************************************************/
/***/ (function(module) {

module.exports = "<table>\r\n    {{each configs}} \r\n    {{if $index %5===0}}<tr>{{/if}}\r\n        <td class=\"field-area {{$value.css}}\" title=\"{{$value.titleTips || $value.title}}\" style=\"{{$value.width? 'max-width:'+$value.width: ''}}\">\r\n            <label>{{$value.label}}</label>\r\n            <span id=\"{{$value.id || 'quote-'+$value.key+'-custom'}}\">-</span>\r\n            <b data-idx=\"{{$index}}\" class=\"icon-delData\"></b>\r\n        </td>\r\n    {{if $index %5===4}}</tr>{{/if}} \r\n    {{/each}}\r\n</table>"

/***/ }),

/***/ "./src/modules/old_concept/components/dragbox/templates/box.art":
/*!**********************************************************************!*\
  !*** ./src/modules/old_concept/components/dragbox/templates/box.art ***!
  \**********************************************************************/
/***/ (function(module) {

module.exports = "<div id=\"opt-{{id}}-wrapper\" class=\"drag-list {{css || id + '-box'}}-wrapper\" data-key=\"{{id}}\" data-occupied='{{occupy || 1}}'>\r\n    <div class=\"drag-title\">\r\n        <div class=\"draggable\" title=\"鼠标点击可拖动\"><span class=\"drag-item\"><i></i><i></i><i></i></span></div>\r\n        {{if link}}<a class=\"title-content\" title=\"点击查看更多\" href=\"{{link}}\" target=\"_blank\">{{@ title}}</a>{{else}}<span class=\"title-content\">{{title}}</span>{{/if}}        \r\n        {{if unit}}<span class=\"gbjg-unit\">单位：{{unit}}</span>{{/if}}\r\n        <b class=\"close-btn icon-closeBtn\"></b>\r\n        <b class=\"close-btn close-btn-hover\">不感兴趣<em>×</em></b>\r\n    </div>\r\n    <div id=\"opt-{{id}}\" class=\"{{css || id + '-box'}}\">\r\n        {{@ content}}\r\n    </div>\r\n</div>\r\n"

/***/ }),

/***/ "./src/modules/old_concept/components/dragbox/templates/capitalflow.art":
/*!******************************************************************************!*\
  !*** ./src/modules/old_concept/components/dragbox/templates/capitalflow.art ***!
  \******************************************************************************/
/***/ (function(module) {

module.exports = "{{if state}}\r\n<div class=\"capitalflow-left fl\">\r\n    <table class=\"zllcr-table\">\r\n        <tr>\r\n            <td class=\"label\">主力流入</td>\r\n            <td align=\"right\" class=\"red\">{{BalFlowIn}}万元</td>\r\n        </tr>\r\n        <tr>\r\n            <td class=\"label\">主力流出</td>\r\n            <td align=\"right\" class=\"green\">{{BalFlowOut*-1}}万元</td>\r\n        </tr>\r\n        <tr>\r\n            <td class=\"label\">主力净流入</td>\r\n            <td align=\"right\" class=\"{{(BalFlowIn*1+BalFlowOut*1) | getColor}}\">{{BalFlowIn*1+BalFlowOut*1}}万元</td>\r\n        </tr>\r\n    </table>\r\n    <table class=\"order-table\">\r\n        <tr><th>(元)</th><th>流入</th><th>流出</th></tr>\r\n        <tr>\r\n            <td>超大</td>\r\n            <td class=\"red\">{{AmtOfBuy3 | numbericFormat}}</td>\r\n            <td class=\"green\">{{AmtOfSel3*-1| numbericFormat}}</td>\r\n        </tr>\r\n        <tr>\r\n            <td>大单</td>\r\n            <td class=\"red\">{{AmtOfBuy2| numbericFormat}}</td>\r\n            <td class=\"green\">{{AmtOfSel2*-1| numbericFormat}}</td>\r\n        </tr>\r\n        <tr>\r\n            <td>中单</td>\r\n            <td class=\"red\">{{AmtOfBuy1 | numbericFormat}}</td>\r\n            <td class=\"green\">{{AmtOfSel1*-1| numbericFormat}}</td>\r\n        </tr>\r\n        <tr>\r\n            <td>小单</td>\r\n            <td class=\"red\">{{AmtOfBuy0 | numbericFormat}}</td>\r\n            <td class=\"green\">{{AmtOfSel0*-1 | numbericFormat}}</td>\r\n        </tr>\r\n    </table>\r\n</div>\r\n<div class=\"capitalflow-right fr\">\r\n    <div>当日实时资金流<span class=\"fr\">单位：万元</span></div>\r\n    <table>\r\n        <tbody>\r\n            {{set arr = [1,-1]}}{{each arr}}\r\n            <tr class=\"{{$index===0?'up':'down'}}\">\r\n                <td>\r\n                {{if AmtNet3*$value>=0}}\r\n                    <div class=\"bar\" style=\"height: {{(AmtNet3/MaxAmtNetABS*100).toFixed(1)| Math.abs}}%\"></div>\r\n                {{else}}\r\n                    <span class=\"text{{AmtNet3==0?' plain':''}}\">{{AmtNet3|fixnum 0}}</span>\r\n                {{/if}}\r\n                </td>\r\n                <td>\r\n                {{if AmtNet2*$value>=0}}\r\n                    <div class=\"bar\" style=\"height: {{(AmtNet2/MaxAmtNetABS*100).toFixed(1)| Math.abs}}%\"></div>\r\n                {{else}}\r\n                    <span class=\"text{{AmtNet2==0?' plain':''}}\">{{AmtNet2|fixnum 0}}</span>\r\n                {{/if}}\r\n                </td>\r\n                <td>\r\n                {{if AmtNet1*$value>=0}}\r\n                    <div class=\"bar\" style=\"height: {{(AmtNet1/MaxAmtNetABS*100).toFixed(1)| Math.abs}}%\"></div>\r\n                {{else}}\r\n                    <span class=\"text{{AmtNet1==0?' plain':''}}\">{{AmtNet1|fixnum 0}}</span>\r\n                {{/if}}\r\n                </td>\r\n                <td>\r\n                {{if AmtNet0*$value>=0}}\r\n                    <div class=\"bar\" style=\"height: {{(AmtNet0/MaxAmtNetABS*100).toFixed(1)| Math.abs}}%\"></div>\r\n                {{else}}\r\n                    <span class=\"text{{AmtNet0==0?' plain':''}}\">{{AmtNet0|fixnum 0}}</span>\r\n                {{/if}}                    \r\n                </td>\r\n            </tr>\r\n            {{/each}}\r\n        </tbody>\r\n        <tfoot>\r\n            <tr><td>净超大</td><td>净大单</td><td>净中单</td><td>净小单</td></tr>\r\n        </tfoot>      \r\n    </table>\r\n    <!--<img src=\"images/zjl.jpg\" alt=\"\">-->\r\n</div>\r\n{{else}}\r\n<div class=\"capitalflow-left fl\">\r\n    <table class=\"zllcr-table\">\r\n        <tr>\r\n            <td class=\"label\">主力流入</td><td align=\"right\">-</td>\r\n        </tr>\r\n        <tr>\r\n            <td class=\"label\">主力流出</td><td align=\"right\">-</td>\r\n        </tr>\r\n        <tr>\r\n            <td class=\"label\">主力净流入</td><td align=\"right\">-</td>\r\n        </tr>\r\n    </table>\r\n    <table class=\"order-table\">\r\n        <tr>\r\n            <th>(元)</th><th>流入</th><th>流出</th>\r\n        </tr>\r\n        <tr>\r\n            <td>超大</td><td>-</td><td>-</td>\r\n        </tr>\r\n        <tr>\r\n            <td>大单</td><td>-</td><td>-</td>\r\n        </tr>\r\n        <tr>\r\n            <td>中单</td><td>-</td><td>-</td>\r\n        </tr>\r\n        <tr>\r\n            <td>小单</td><td>-</td><td>-</td>\r\n        </tr>\r\n    </table>\r\n</div>\r\n<div class=\"capitalflow-right fr\">\r\n    <div>当日实时资金流<span class=\"fr\">单位：万元</span></div>\r\n</div>\r\n{{/if}}\r\n"

/***/ }),

/***/ "./src/modules/old_concept/components/dragbox/templates/companydigest.art":
/*!********************************************************************************!*\
  !*** ./src/modules/old_concept/components/dragbox/templates/companydigest.art ***!
  \********************************************************************************/
/***/ (function(module) {

module.exports = "{{if state}}\r\n<table width=\"100%\">\r\n    <tr>\r\n        <td title=\"第{{Season}}季度每股收益\" class=\"showtips\">收益(<span title=\"第{{Season}}季度\">{{Season}}</span>)：<span id=\"data-EPS\">{{LatestBasicEps}}</span></td>\r\n        <td title=\"加权净资产收益率\" class=\"showtips\">ROE<b class=\"icon-help2\"></b>：<span>{{WeightedYieldOnNetAssets | percentRender}}</span></td>\r\n        <td title=\"净利润同比\">同比：<span>{{NetProfitAttributableToEquityHoldersYOY | percentRender}}</span></td>\r\n    </tr>\r\n    <tr>\r\n        <td title=\"每股净资产\">净资产：<span>{{LatestNetAssetPerShare}}</span></td>\r\n        <td>总股本：<span id=\"data-totalShare\">{{TotalCapital| numbericFormat}}</span></td>\r\n        <td>净利率：<span>{{FinancialAssessmentSalesMargin| percentRender}}</span></td>\r\n    </tr>\r\n    <tr>\r\n        <td>总营收：<span>{{TotalOperatingIncome| numbericFormat}}</span></td>\r\n        <td>流通股：<span>{{FlowCapital| numbericFormat}}</span></td>\r\n        <td>负债率：<span>{{AssetLiabilityRatio| percentRender}}</span></td>\r\n    </tr>\r\n    <tr>\r\n        <td>净利润：<span>{{NetProfitAttributableToEquityHolders| numbericFormat}}</span></td>\r\n        <td>PE(动)：<span id=\"data-PERation\">{{PERation}}</span></td>\r\n        <td>总值：<span id=\"data-marketValue\">{{MarketValue| numbericFormat}}</span></td>\r\n    </tr>\r\n    <tr>\r\n        <td>毛利率：<span>{{SalesGrossMargin| percentRender}}</span></td>\r\n        <td>市净率：<span id=\"data-PB\">{{PB}}</span></td>\r\n        <td>流值：<span id=\"data-flowCapitalValue\">{{FlowCapitalValue| numbericFormat}}</span></td>\r\n    </tr>\r\n    <tr>\r\n        <td colspan=\"3\">每股未分配利润：<span>{{RetainedEarningsPerShare}}元</span></td>\r\n    </tr>\r\n    <tr>\r\n        <td colspan=\"3\">上市时间：<span>{{IPODate}}</span></td>\r\n    </tr>\r\n</table>\r\n{{else}}\r\n<table width=\"100%\">\r\n    <tr>\r\n        <td title=\"每股收益\">收益：<span id=\"data-EPS\">-</span></td>\r\n        <td title=\"加权净资产收益率\">ROE<b class=\"icon-help2\"></b>：<span>-</span></td>\r\n        <td title=\"净利润同比\">同比：<span>-</span></td>\r\n    </tr>\r\n    <tr>\r\n        <td>净资产：<span>-</span></td>\r\n        <td>总股本：<span id=\"data-totalShare\">-</span></td>\r\n        <td>净利率：<span>-</span></td>\r\n    </tr>\r\n    <tr>\r\n        <td>总营收：<span>-</span></td>\r\n        <td>流通股：<span id=\"data-flowCapital\">-</span></td>\r\n        <td>负债率：<span>-</span></td>\r\n    </tr>\r\n    <tr>\r\n        <td>净利润：<span>-</span></td>\r\n        <td>PE(动)：<span id=\"data-PERation\">-</span></td>\r\n        <td>总值：<span id=\"data-marketValue\">-</span></td>\r\n    </tr>\r\n    <tr>\r\n        <td>毛利率：<span>-</span></td>\r\n        <td>市净率：<span id=\"data-PB\">-</span></td>\r\n        <td>流值：<span id=\"data-flowCapitalValue\">-</span></td>\r\n    </tr>\r\n    <tr>\r\n        <td colspan=\"3\">每股未分配利润：<span>-</span></td>\r\n    </tr>\r\n    <tr>\r\n        <td colspan=\"3\">上市时间：<span>-</span></td>\r\n    </tr>\r\n</table>\r\n{{/if}}\r\n"

/***/ }),

/***/ "./src/modules/old_concept/components/dragbox/templates/largeshareholders.art":
/*!************************************************************************************!*\
  !*** ./src/modules/old_concept/components/dragbox/templates/largeshareholders.art ***!
  \************************************************************************************/
/***/ (function(module) {

module.exports = "{{if state}}\r\n<div class=\"gbjg-box \">\r\n    <table width=\"100%\">\r\n        <thead>\r\n            <tr>\r\n            <th>日期</th>\r\n            <th>总股本</th>\r\n            <th>已上市流通<br>A股</th>\r\n            <th>限售流通<br>A股</th>        \r\n            </tr>\r\n        </thead>\r\n        <tbody>\r\n        {{each data}}\r\n            <tr>\r\n                <td>{{$value.date}}</td>\r\n                <td>{{$value.totalEquity}}</td>\r\n                <td>{{$value.aShares}}</td>\r\n                <td>{{$value.restrictedCirculationShares}}</td>\r\n            </tr>  \r\n        {{/each}}          \r\n        </tbody>\r\n        <tfoot>\r\n            <tr><td colspan=\"4\" align=\"center\"><a href=\"http://emweb.securities.eastmoney.com/f10_v2/CapitalStockStructure.aspx?type=web&code={{shortmarket}}{{code}}\" target=\"_blank\">点击查看更多</a></td></tr>\r\n        </tfoot>\r\n    </table>\r\n</div>\r\n{{else}}\r\n<div class=\"nocontent\">\r\n    {{if loading}}<div class=\"loading\"></div>{{else}}暂无股本结构数据{{/if}}\r\n</div>\r\n{{/if}}\r\n\r\n\r\n"

/***/ }),

/***/ "./src/modules/old_concept/components/dragbox/templates/profittrend.art":
/*!******************************************************************************!*\
  !*** ./src/modules/old_concept/components/dragbox/templates/profittrend.art ***!
  \******************************************************************************/
/***/ (function(module) {

module.exports = "{{if loading}}<div class=\"loading\"></div>\r\n{{else}}\r\n<div class=\"nocontent\">暂无数据</div>\r\n<div id=\"profittrend-chart\" class=\"trends-chart\"></div>\r\n<a class=\"lrqc-btn\" href=\"http://data.eastmoney.com/stockdata/{{stockinfo.code}}.html#cwsj\" target=\"_blank\">点击查看更多</a>\r\n{{/if}}\r\n"

/***/ }),

/***/ "./src/modules/old_concept/components/dragbox/templates/quartile.art":
/*!***************************************************************************!*\
  !*** ./src/modules/old_concept/components/dragbox/templates/quartile.art ***!
  \***************************************************************************/
/***/ (function(module) {

module.exports = "{{if state}}\r\n<table width=\"100%\">\r\n    <thead>\r\n        <tr>\r\n            <th></th>\r\n            <th>总市值</th>\r\n            <th>净资产</th>\r\n            <th>净利润</th>\r\n            <th>市盈率(动)</th>\r\n            <th>市净率</th>\r\n            <th>毛利率</th>\r\n            <th>净利率</th>\r\n            <th title=\"加权净资产收益率\" class=\"showtips\">ROE<b class=\"icon-help2\"></b></th>\r\n        </tr>\r\n    </thead>\r\n    <tbody>\r\n        <tr>\r\n            <td><a href=\"http://data.eastmoney.com/stockdata/{{stockinfo.code}}.html\" target=\"_blank\">{{stockinfo.name}}</a></td>\r\n            <td>{{MarketValue.value| numbericFormat}}</td>\r\n            <td>{{NetAssetsPerShare.value| numbericFormat}}</td>\r\n            <td>{{NetProfitAttributableToEquityHolders.value| numbericFormat}}</td>\r\n            <td>{{PERation.value}}</td>\r\n            <td>{{PB.value}}</td>\r\n            <td>{{SalesGrossMargin.value}}</td>\r\n            <td>{{FinancialAssessmentSalesMargin.value}}</td>\r\n            <td>{{WeightedYieldOnNetAssets.value}}</td>\r\n        </tr>\t\t\r\n        <tr>\r\n            <td><a href=\"http://quote.eastmoney.com/center/boardlist.html#boards-{{stockinfo.board.code}}1\" target=\"_blank\">{{stockinfo.board.name}}</a></td>\r\n            <td>{{MarketValue.board| numbericFormat}}</td>\r\n            <td>{{NetAssetsPerShare.board| numbericFormat}}</td>\r\n            <td>{{NetProfitAttributableToEquityHolders.board| numbericFormat}}</td>\r\n            <td>{{PERation.board}}</td>\r\n            <td>{{PB.board}}</td>\r\n            <td>{{SalesGrossMargin.board}}</td>\r\n            <td>{{FinancialAssessmentSalesMargin.board}}</td>\r\n            <td>{{WeightedYieldOnNetAssets.board}}</td>\r\n        </tr>\r\n        <tr>\r\n            <td>行业排名</td>\r\n            <td>{{MarketValue.position}}|{{MarketValue.total}}</td>\r\n            <td>{{NetAssetsPerShare.position}}|{{NetAssetsPerShare.total}}</td>\r\n            <td>{{NetProfitAttributableToEquityHolders.position}}|{{NetProfitAttributableToEquityHolders.total}}</td>\r\n            <td>{{PERation.position}}|{{PERation.total}}</td>\r\n            <td>{{PB.position}}|{{PB.total}}</td>\r\n            <td>{{SalesGrossMargin.position}}|{{SalesGrossMargin.total}}</td>\r\n            <td>{{FinancialAssessmentSalesMargin.position}}|{{FinancialAssessmentSalesMargin.total}}</td>\r\n            <td>{{WeightedYieldOnNetAssets.position}}|{{WeightedYieldOnNetAssets.total}}</td>\r\n        </tr>\r\n        <tr>\r\n            <td class=\"quartile-title\">四分位属性<b class=\"icon-help2\"></b></td>\r\n            <td>\r\n                <ul  class=\"quartile-mv\">\r\n                    <li style=\"{{MarketValue.rank<=1?'background-color:#78b1ff':''}}\"></li>\r\n                    <li style=\"{{MarketValue.rank<=2?'background-color:#a3cbff':''}}\"></li>\r\n                    <li style=\"{{MarketValue.rank<=3?'background-color:#c4ddff':''}}\"></li>\r\n                    <li style=\"{{MarketValue.rank<=4?'border-bottom:none;background-color:#deecff':''}}\"></li>\r\n                </ul>\r\n                <p>{{@MarketValue.rank_desc}}</p>\r\n            </td>\r\n            <td >\r\n                <ul class=\"quartile-naps\">\r\n                    <li style=\"{{NetAssetsPerShare.rank<=1?'background-color:#78b1ff':''}}\"></li>\r\n                    <li style=\"{{NetAssetsPerShare.rank<=2?'background-color:#a3cbff':''}}\"></li>\r\n                    <li style=\"{{NetAssetsPerShare.rank<=3?'background-color:#c4ddff':''}}\"></li>\r\n                    <li style=\"{{NetAssetsPerShare.rank<=4?'border-bottom:none;background-color:#deecff':''}}\"></li>\r\n                </ul>\r\n                <p>{{@NetAssetsPerShare.rank_desc}}</p>\r\n            </td>\r\n            <td >\r\n                <ul class=\"quartile-npeh\">\r\n                    <li style=\"{{NetProfitAttributableToEquityHolders.rank<=1?'background-color:#78b1ff':''}}\"></li>\r\n                    <li style=\"{{NetProfitAttributableToEquityHolders.rank<=2?'background-color:#a3cbff':''}}\"></li>\r\n                    <li style=\"{{NetProfitAttributableToEquityHolders.rank<=3?'background-color:#c4ddff':''}}\"></li>\r\n                    <li style=\"{{NetProfitAttributableToEquityHolders.rank<=4?'border-bottom:none;background-color:#deecff':''}}\"></li>\r\n                </ul>\r\n                <p>{{@NetProfitAttributableToEquityHolders.rank_desc}}</p>\r\n            </td>\r\n            <td>\r\n                <ul class=\"quartile-pe\">\r\n                    <li style=\"{{PERation.rank>=4?'background-color:#78b1ff':''}}\"></li>\r\n                    <li style=\"{{PERation.rank>=3?'background-color:#a3cbff':''}}\"></li>\r\n                    <li style=\"{{PERation.rank>=2?'background-color:#c4ddff':''}}\"></li>\r\n                    <li style=\"{{PERation.rank>=1?'border-bottom:none;background-color:#deecff':''}}\"></li>\r\n                </ul>\r\n                <p>{{@PERation.rank_desc}}</p>\r\n            </td>\r\n            <td>\r\n                <ul  class=\"quartile-pb\">\r\n                    <li style=\"{{PB.rank>=4?'background-color:#78b1ff':''}}\"></li>\r\n                    <li style=\"{{PB.rank>=3?'background-color:#a3cbff':''}}\"></li>\r\n                    <li style=\"{{PB.rank>=2?'background-color:#c4ddff':''}}\"></li>\r\n                    <li style=\"{{PB.rank>=1?'border-bottom:none;background-color:#deecff':''}}\"></li>\r\n                </ul>\r\n                <p>{{@PB.rank_desc}}</p>\r\n            </td>\r\n            <td>\r\n                <ul class=\"quartile-sgm\">\r\n                    <li style=\"{{SalesGrossMargin.rank<=1?'background-color:#78b1ff':''}}\"></li>\r\n                    <li style=\"{{SalesGrossMargin.rank<=2?'background-color:#a3cbff':''}}\"></li>\r\n                    <li style=\"{{SalesGrossMargin.rank<=3?'background-color:#c4ddff':''}}\"></li>\r\n                    <li style=\"{{SalesGrossMargin.rank<=4?'border-bottom:none;background-color:#deecff':''}}\"></li>\r\n                </ul>\r\n                <p>{{@SalesGrossMargin.rank_desc}}</p>\r\n            </td>\r\n            <td>\r\n                <ul class=\"quartile-fasm\">\r\n                    <li style=\"{{FinancialAssessmentSalesMargin.rank<=1?'background-color:#78b1ff':''}}\"></li>\r\n                    <li style=\"{{FinancialAssessmentSalesMargin.rank<=2?'background-color:#a3cbff':''}}\"></li>\r\n                    <li style=\"{{FinancialAssessmentSalesMargin.rank<=3?'background-color:#c4ddff':''}}\"></li>\r\n                    <li style=\"{{FinancialAssessmentSalesMargin.rank<=4?'border-bottom:none;background-color:#deecff':''}}\"></li>\r\n                </ul>\r\n                <p>{{@FinancialAssessmentSalesMargin.rank_desc}}</p>\r\n            </td>\r\n            <td>\r\n                <ul class=\"quartile-wyna\">\r\n                    <li style=\"{{WeightedYieldOnNetAssets.rank<=1?'background-color:#78b1ff':''}}\"></li>\r\n                    <li style=\"{{WeightedYieldOnNetAssets.rank<=2?'background-color:#a3cbff':''}}\"></li>\r\n                    <li style=\"{{WeightedYieldOnNetAssets.rank<=3?'background-color:#c4ddff':''}}\"></li>\r\n                    <li style=\"{{WeightedYieldOnNetAssets.rank<=4?'border-bottom:none;background-color:#deecff':''}}\"></li>\r\n                </ul>\r\n                <p>{{@WeightedYieldOnNetAssets.rank_desc}}</p>\r\n            </td>\r\n        </tr>\r\n    </tbody>\r\n</table>\r\n{{else}}\r\n<table width=\"100%\">\r\n    <thead>\r\n        <tr>\r\n            <th></th>\r\n            <th>总市值</th>\r\n            <th>净资产</th>\r\n            <th>净利润</th>\r\n            <th>市盈率</th>\r\n            <th>市净率</th>\r\n            <th>毛利率</th>\r\n            <th>净利率</th>\r\n            <th title=\"加权净资产收益率\">ROE<b class=\"icon-help2\"></b></th>\r\n        </tr>\r\n    </thead>\r\n    <tbody>\r\n        <tr>\r\n            <td><a href=\"http://data.eastmoney.com/stockdata/{{stockinfo.code}}.html\" target=\"_blank\">{{stockinfo.name}}</a></td>\r\n            <td>-</td>\r\n            <td>-</td>\r\n            <td>-</td>\r\n            <td>-</td>\r\n            <td>-</td>\r\n            <td>-</td>\r\n            <td>-</td>\r\n            <td>-</td>\r\n        </tr>\r\n        <tr>\r\n            <td><a href=\"//quote.eastmoney.com/web/{{stockinfo.board.id}}.html\" target=\"_blank\">{{stockinfo.board.name}}</a></td>\r\n            <td>-</td>\r\n            <td>-</td>\r\n            <td>-</td>\r\n            <td>-</td>\r\n            <td>-</td>\r\n            <td>-</td>\r\n            <td>-</td>\r\n            <td>-</td>\r\n        </tr>\r\n        <tr>\r\n            <td>行业排名</td>\r\n            <td>-|-</td>\r\n            <td>-|-</td>\r\n            <td>-|-</td>\r\n            <td>-|-</td>\r\n            <td>-|-</td>\r\n            <td>-|-</td>\r\n            <td>-|-</td>\r\n            <td>-|-</td>\r\n        </tr>\r\n        <tr>\r\n            <td class=\"quartile-title\">四分位属性<b class=\"icon-help2\"></b></td>\r\n            <td class=\"quartile-mv\">\r\n                <ul class=\"\">\r\n                    <li style=\"\"></li>\r\n                    <li style=\"\"></li>\r\n                    <li style=\"\"></li>\r\n                    <li style=\"\"></li>\r\n                </ul>\r\n                <p></p>\r\n            </td>\r\n            <td class=\"quartile-naps\">\r\n                <ul>\r\n                    <li style=\"\"></li>\r\n                    <li style=\"\"></li>\r\n                    <li style=\"\"></li>\r\n                    <li style=\"\"></li>\r\n                </ul>\r\n                <p></p>\r\n            </td>\r\n            <td class=\"quartile-npeh\">\r\n                <ul>\r\n                    <li style=\"\"></li>\r\n                    <li style=\"\"></li>\r\n                    <li style=\"\"></li>\r\n                    <li style=\"\"></li>\r\n                </ul>\r\n                <p></p>\r\n            </td>\r\n            <td class=\"quartile-pe\">\r\n                <ul>\r\n                    <li style=\"\"></li>\r\n                    <li style=\"\"></li>\r\n                    <li style=\"\"></li>\r\n                    <li style=\"\"></li>\r\n                </ul>\r\n                <p></p>\r\n            </td>\r\n            <td class=\"quartile-pb\">\r\n                <ul>\r\n                    <li style=\"\"></li>\r\n                    <li style=\"\"></li>\r\n                    <li style=\"\"></li>\r\n                    <li style=\"\"></li>\r\n                </ul>\r\n                <p></p>\r\n            </td>\r\n            <td class=\"quartile-sgm\">\r\n                <ul>\r\n                    <li style=\"\"></li>\r\n                    <li style=\"\"></li>\r\n                    <li style=\"\"></li>\r\n                    <li style=\"\"></li>\r\n                </ul>\r\n                <p></p>\r\n            </td>\r\n            <td class=\"quartile-fasm\">\r\n                <ul>\r\n                    <li style=\"\"></li>\r\n                    <li style=\"\"></li>\r\n                    <li style=\"\"></li>\r\n                    <li style=\"\"></li>\r\n                </ul>\r\n                <p></p>\r\n            </td>\r\n            <td class=\"quartile-wyna\">\r\n                <ul>\r\n                    <li style=\"\"></li>\r\n                    <li style=\"\"></li>\r\n                    <li style=\"\"></li>\r\n                    <li style=\"\"></li>\r\n                </ul>\r\n                <p></p>\r\n            </td>\r\n        </tr>\r\n    </tbody>\r\n</table>\r\n{{/if}}\r\n"

/***/ }),

/***/ "./src/modules/old_concept/components/dragbox/templates/relatedboards.art":
/*!********************************************************************************!*\
  !*** ./src/modules/old_concept/components/dragbox/templates/relatedboards.art ***!
  \********************************************************************************/
/***/ (function(module) {

module.exports = "{{if state}}\r\n{{each data}}\r\n    <div class=\"bk-item\">\r\n        <a href=\"//quote.eastmoney.com/web/{{$value.code}}{{$value.marketType}}.html\" target=\"_blank\" title=\"{{$value.name}}\">\r\n            {{$value.name|cutstr 8,'...'}}\r\n        </a>\r\n        <span class=\"{{$value.changePercent | getColor}}\">{{$value.changePercent}}</span>\r\n        <a href=\"http://quote.eastmoney.com/concept/{{$value.market}}{{$value.BKCPLEADCODE}}.html\" target=\"_blank\" title=\"{{$value.BKCPLEADNAME}}\">\r\n            {{$value.BKCPLEADNAME|cutstr 8,'...'}}\r\n        </a>\r\n    </div>\r\n{{/each}}\r\n{{else}}\r\n<div class=\"nocontent\">\r\n    {{if loading}}<div class=\"loading\"></div>{{else}}暂无板块数据{{/if}}\r\n</div>\r\n{{/if}}"

/***/ }),

/***/ "./src/modules/old_concept/components/dragbox/templates/relatedstocks.art":
/*!********************************************************************************!*\
  !*** ./src/modules/old_concept/components/dragbox/templates/relatedstocks.art ***!
  \********************************************************************************/
/***/ (function(module) {

module.exports = "{{if state}}\r\n{{each data}}\r\n{{if $index === 0 || $index === 5}}\r\n<table class=\"{{$index === 0?'relatedstocks-left fl':'relatedstocks-right fr'}}\"><thead><tr><th>名称</th><th>最新价</th><th>涨跌幅</th></tr></thead><tbody>\r\n{{/if}}\r\n<tr>\r\n    <td><a title=\"{{$value.name}}\" href=\"http://quote.eastmoney.com/concept/{{$value.marketType}}{{$value.code}}.html\" target=\"_blank\">{{$value.name|cutstr 8,'...'}}</a></td>\r\n    <td class=\"{{$value.change | getColor}}\">{{$value.close}}</td>\r\n    <td class=\"{{$value.change | getColor}}\">{{$value.changePercent}}</td>\r\n</tr>\r\n{{if $index === 4 || $index === 10}}</tbody></table>{{/if}}\r\n{{/each}}\r\n{{else}}\r\n<div class=\"nocontent\">\r\n    {{if loading}}<div class=\"loading\"></div>{{else}}暂无相关个股数据{{/if}}\r\n</div>\r\n{{/if}}\r\n"

/***/ }),

/***/ "./src/modules/old_concept/components/dragbox/templates/stagechange.art":
/*!******************************************************************************!*\
  !*** ./src/modules/old_concept/components/dragbox/templates/stagechange.art ***!
  \******************************************************************************/
/***/ (function(module) {

module.exports = "{{if state}}\r\n<table width=\"100%\">\r\n    <thead>\r\n        <tr>\r\n            <th>阶段</th>\r\n            {{each names}}\r\n                <th title=\"{{$value}}\">{{$value| cutstr 8}}</th>\r\n            {{/each}}\r\n        </tr>\r\n    </thead>\r\n    <tbody>\r\n        {{each data}}\r\n        <tr>\r\n            <td>{{$value.label}}</td>\r\n            <td id=\"{{$value.id}}\" class=\"{{$value.changePercent.stock | getColor}}\">{{$value.changePercent.stock}}</td>\r\n            <td class=\"{{$value.changePercent.industry | getColor}}\">{{$value.changePercent.industry}}</td>\r\n            <td class=\"{{$value.changePercent.concept | getColor}}\">{{$value.changePercent.concept}}</td>\r\n            <td class=\"{{$value.changePercent.region | getColor}}\">{{$value.changePercent.region}}</td>\r\n        </tr>\r\n        {{/each}}\r\n    </tbody>\r\n</table>\r\n{{else}}\r\n<div class=\"nocontent\">\r\n    {{if loading}}<div class=\"loading\"></div>{{else}}暂无涨幅数据{{/if}}\r\n</div>\r\n{{/if}}\r\n"

/***/ }),

/***/ "./src/modules/old_concept/components/dragbox/templates/stockcalendar.art":
/*!********************************************************************************!*\
  !*** ./src/modules/old_concept/components/dragbox/templates/stockcalendar.art ***!
  \********************************************************************************/
/***/ (function(module) {

module.exports = "{{if state}}\r\n<table>\r\n{{each data val key}}\r\n<tr class=\"item clearfix\">\r\n    <td class=\"date\"><div>{{val.reportdate | formatDate 'MM-dd'}}</div><div class=\"year\">{{val.reportdate | formatDate 'yyyy'}}</div></td>\r\n    <td class=\"event\">\r\n    {{each val.data}}\r\n        {{if $index===0}}<b class=\"circle-b{{key===0?' orange':''}}\">●</b>{{/if}}\r\n        <a href=\"{{$value.link}}\" target=\"_blank\">\r\n            <div class=\"title\">{{$value.sjlx}}</div>\r\n            <div class=\"description\" title=\"{{$value.sjms}}\">{{$value.sjms| cutstr 76}}</div>\r\n        </a>\r\n        <!--{{if val.length - 1 !== $index}}<br />{{/if}}-->\r\n    {{/each}}\r\n    </td>\r\n</tr>\r\n{{/each}}\r\n</table>\r\n{{else}}\r\n<div class=\"nocontent\">\r\n    {{if loading}}<div class=\"loading\"></div>{{else}}暂无数据{{/if}}\r\n</div>\r\n{{/if}}\r\n"

/***/ }),

/***/ "./src/modules/old_concept/components/dragbox/templates/stocknews.art":
/*!****************************************************************************!*\
  !*** ./src/modules/old_concept/components/dragbox/templates/stocknews.art ***!
  \****************************************************************************/
/***/ (function(module) {

module.exports = "{{if Datalength}}\r\n<table width=\"100%\">\r\n    <tbody>\r\n        {{each Data}}\r\n        <tr>\r\n            <td><a href=\"{{$value.Art_Url}}\" target=\"_blank\" title=\"{{$value.Art_Title}}\"><i></i>{{$value.Art_Title| cutstr 38}}</a></td>\r\n            <td class=\"rq-color\">{{$value.Art_ShowTime| formatDate 'MM-dd'}}</td>\r\n        </tr>\r\n        {{/each}}\r\n    </tbody>\r\n</table>\r\n{{else}}\r\n<div class=\"nocontent\">\r\n    {{if loading}}<div class=\"loading\"></div>{{else}}暂无该股新闻{{/if}}\r\n</div>\r\n{{/if}}\r\n"

/***/ }),

/***/ "./src/modules/old_concept/components/dragbox/templates/stocknotice.art":
/*!******************************************************************************!*\
  !*** ./src/modules/old_concept/components/dragbox/templates/stocknotice.art ***!
  \******************************************************************************/
/***/ (function(module) {

module.exports = "{{if rc === 1}}\r\n<table width=\"100%\">\r\n    <tbody>\r\n        {{each data}}\r\n        <tr>\r\n            <td title=\"{{$value.NOTICETITLE}}\"><a target=\"_blank\" href=\"{{$value.Url}}\"><i></i>{{$value.NOTICETITLE| cutstr 40}}</a></td>\r\n            <td class=\"rq-color\">{{$value.NOTICEDATE | formatDate 'MM-dd'}}</td>\r\n        </tr>\r\n        {{/each}}\r\n    </tbody>\r\n</table>\r\n{{else}}\r\n<div class=\"nocontent\">\r\n    {{if loading}}<div class=\"loading\"></div>{{else}}暂无该股公告{{/if}}\r\n</div>\r\n{{/if}}\r\n"

/***/ }),

/***/ "./src/modules/old_concept/components/dragbox/templates/stocknoticenew.art":
/*!*********************************************************************************!*\
  !*** ./src/modules/old_concept/components/dragbox/templates/stocknoticenew.art ***!
  \*********************************************************************************/
/***/ (function(module) {

module.exports = "{{if page_size > 0}}\r\n<table width=\"100%\">\r\n    <tbody>\r\n        {{each list}}\r\n        <tr>\r\n            <td title=\"{{$value.title}}\"><a target=\"_blank\" href=\"http://data.eastmoney.com/notices/detail/{{$value.codes[0].stock_code}}/{{$value.art_code}}.html\"><i></i>{{$value.title| cutstr 40}}</a></td>\r\n            <td class=\"rq-color\">{{$value.notice_date | formatDate 'MM-dd'}}</td>\r\n        </tr>\r\n        {{/each}} \r\n    </tbody>\r\n</table>\r\n{{else}}\r\n<div class=\"nocontent\">\r\n    {{if loading}}<div class=\"loading\"></div>{{else}}暂无该股公告{{/if}}\r\n</div>\r\n{{/if}}\r\n"

/***/ }),

/***/ "./src/modules/old_concept/components/favourite/favourite.art":
/*!********************************************************************!*\
  !*** ./src/modules/old_concept/components/favourite/favourite.art ***!
  \********************************************************************/
/***/ (function(module) {

module.exports = "{{each data}}\r\n<tr id=\"{{container}}-{{$value.id}}\">\r\n    <td class=\"first-td\">\r\n        <a title=\"{{$value.name}}-{{$value.code}}\"href=\"{{$value.link}}\" target=\"_blank\">{{$value.name| cutstr 8,'..'}}<br>{{$value.code | cutstr 8,'..'}}</a>\r\n    </td>\r\n    <td class=\"data {{$value.changePercent | getColor}}\">{{$value.close}}<br>{{$value.changePercent}}</td>\r\n    <td class=\"img-td\">\r\n        <a href=\"{{$value.link}}\" target=\"_blank\" title=\"点击查看{{$value.name}}分时图\">\r\n            <img  data-src=\"{{$value.dataSrc}}\" src=\"{{$value.dataSrc}}\" />\r\n        </a>\r\n    </td>\r\n</tr>\r\n{{/each}}"

/***/ }),

/***/ "./src/modules/old_concept/components/mocktrade/mock.art":
/*!***************************************************************!*\
  !*** ./src/modules/old_concept/components/mocktrade/mock.art ***!
  \***************************************************************/
/***/ (function(module) {

module.exports = "<div id=\"mocktrade-wrapper\" class=\"ifreme-wrapper\">\r\n    <div class=\"iframe-box\">\r\n        <div class=\"iframe-btn\">\r\n            <span class=\"btn-switch\" title=\"最小化\"><b class=\"icon-yc1\"></b></span>\r\n            <b class=\"btn-close\" title=\"关闭\">×</b>\r\n        </div>        \r\n        <iframe id=\"mocktrade-window\" src=\"\" class=\"iframe\"></iframe>\r\n    </div>\r\n</div>\r\n"

/***/ }),

/***/ "./src/modules/old_concept/components/popup/popup.art":
/*!************************************************************!*\
  !*** ./src/modules/old_concept/components/popup/popup.art ***!
  \************************************************************/
/***/ (function(module) {

module.exports = "<div class=\"showModal {{css?css+'-wrapper':''}}\">\r\n    <div class=\"showModal-title\">\r\n        <div class=\"draggable\">{{@ title}}</div>\r\n        <b class=\"icon-tc-btn fr tc-close\"></b>\r\n    </div>\r\n    <div class=\"showModal-con {{css}}\">{{@ content}}</div>\r\n    <div class=\"showModal-bottom\">{{@ confirm}}</div>\r\n</div>"

/***/ }),

/***/ "./src/modules/old_concept/components/quote-push/deals.art":
/*!*****************************************************************!*\
  !*** ./src/modules/old_concept/components/quote-push/deals.art ***!
  \*****************************************************************/
/***/ (function(module) {

module.exports = "{{if state}}\r\n<tbody>\r\n    {{each data}}\r\n    <tr>\r\n        <td>{{$value.t}}</td>\r\n        <td class=\"{{$value.priceColor}}\">{{$value.p}}</td>\r\n        <td style='text-align:right'>          \r\n            <span style=color:{{$value.volumnColor}}>{{$value.v}}</span>     \r\n            <b class=\"{{$value.pch > 0 ?'icon-change-up':$value.pch < 0?'icon-change-down':''}}\" style='width: 8px;height: 14px;display: inline-block;vertical-align:middle'></b>  \r\n        </td>\r\n    </tr>\r\n    {{/each}}\r\n</tbody> \r\n<tfoot>\r\n    <tr>\r\n        <td colspan=\"3\" align=\"right\">\r\n            <a href=\"//quote.eastmoney.com/f1.html?id={{id}}\" target=\"_blank\" class=\"moreLink\">点击查看更多分时成交</a>\r\n        </td>\r\n    </tr>\r\n</tfoot>\r\n{{else}}\r\n<tbody><tr><td class=\"nolist\">暂无数据</td></tr></tbody> \r\n{{/if}}\r\n"

/***/ }),

/***/ "./src/modules/old_concept/components/quote-push/positionchanges.art":
/*!***************************************************************************!*\
  !*** ./src/modules/old_concept/components/quote-push/positionchanges.art ***!
  \***************************************************************************/
/***/ (function(module) {

module.exports = "{{each data}}\r\n    <font>{{$value.time}}</font>\r\n    <a href=\"//quote.eastmoney.com/changes/stocks/{{$value.id}}.html\" target=\"_blank\" class=\"\">\r\n        <span>{{$value.name}}</span><span class=\"{{$value.color}}\">{{$value.type}}</span><span class=\"{{$value.color}}\">{{$value.desc}}</span>\r\n    </a>\r\n{{/each}}"

/***/ }),

/***/ "./src/modules/old_concept/components/relatedquote/relatedquote.art":
/*!**************************************************************************!*\
  !*** ./src/modules/old_concept/components/relatedquote/relatedquote.art ***!
  \**************************************************************************/
/***/ (function(module) {

module.exports = "{{each data}}\r\n    <div class=\"fl\">\r\n        <a title=\"{{$value.name}}\" href=\"{{$value.link}}\" target=\"_blank\">{{$value.name | cutstr 8}}{{types[$value.type]}}</a>\r\n        {{if $value.close}}<span class=\"{{$value.color}}\">{{$value.close}}</span>{{/if}}\r\n        {{if data.length === 1 && $value.change}}<span class=\"{{$value.color}}\">{{$value.change}}</span>{{/if}}\r\n        {{if $value.changePercent}}<span class=\"{{$value.color}}\">{{$value.changePercent|percentRender}}</span>{{/if}}\r\n        {{if $value.type === 0}}\r\n            {{if $value.premium}}<span>溢价率: <i class=\"{{$value.premium |getColor}}\">{{$value.premium|percentRender}}</i></span>{{/if}}\r\n        {{else if $value.type === 1}}\r\n            <span>比价(A/H)：{{$value.comparison || '-'}}</span>\r\n        {{else}}\r\n            <span>比价(A/B)：{{$value.comparison || '-'}}</span>\r\n        {{/if}}\r\n        {{if data.length === 1}}\r\n            {{if $value.type === 0}}<span>转股价值：{{$value.conversionValue}}元</span>{{/if}}\r\n            {{if $value.type === 1 && $value.premium}}<span>溢价(A/H)：<i class=\"{{$value.premium |getColor}}\">{{$value.premium}}%</i></span>{{/if}}\r\n        {{/if}}\r\n    </div>\r\n    {{if $index < data.length - 1}}<span class=\"line-box fl\">|</span>{{/if}}\r\n{{/each}}"

/***/ }),

/***/ "./src/modules/old_concept/components/relatedquote/stockcalender.art":
/*!***************************************************************************!*\
  !*** ./src/modules/old_concept/components/relatedquote/stockcalender.art ***!
  \***************************************************************************/
/***/ (function(module) {

module.exports = "{{each data}}\r\n    <li class=\"calender-msg\">\r\n        {{$value.sjlx}}&nbsp;<a href=\"{{$value.href}}\"title=\"{{$value.sjms}}\" target=\"_blank\">{{$value.sjms| cutstr 90}}</a>\r\n    </li>\r\n{{/each}}"

/***/ }),

/***/ "./src/modules/old_concept/components/toolbox/tool-box.art":
/*!*****************************************************************!*\
  !*** ./src/modules/old_concept/components/toolbox/tool-box.art ***!
  \*****************************************************************/
/***/ (function(module) {

module.exports = "<div class=\"tool-box\">\r\n  <a id=\"tool-box-gnb\" class=\"gnb\" target=\"_self\"\r\n        href=\"javascript:;\">\r\n    <span style=\"display:inline;\">\r\n      行情单<br/>页设置\r\n    </span>\r\n    <div class=\"icon-set\" style=\"display:none\"></div>\r\n  </a>\r\n  \r\n    <a id=\"tool-box-classic\" class=\"classic\" target=\"_self\" \r\n        href=\"//{{environment === 'production'?'quote.eastmoney.com':'quotationtest.eastmoney.com'}}/{{shortmarket}}{{code}}.html?from=beta\">\r\n        <span>返回<br />经典版</span>\r\n        <div class=\"icon-fh\" style=\"display:none\"></div>\r\n    </a>\r\n    <a id=\"tool-box-feedback\" class=\"feedback\" href=\"http://corp.eastmoney.com/liuyan.html\" target=\"_blank\">\r\n        <span>意见反馈</span>\r\n        <div class=\"feedback-left icon-yjfk-1\" style=\"display:none\"></div>\r\n        <div class=\"feedback-right icon-yjfk-2\" style=\"display:none\"></div>\r\n    </a>\r\n    <a id=\"tool-box-guide\" class=\"guide\" href=\"/concept/guidance.html#concept-{{shortmarket}}{{code}}\" target=\"_self\">\r\n        <span>功能引导</span>\r\n        <div class=\"icon-gnyd\" style=\"display:none\"></div>\r\n    </a>\r\n    <a id=\"tool-box-sreach\" class=\"stock-search icon-fdj\" style=\"display:none\">\r\n        <div class=\"search-left\" style=\"display:none\">行情</div>\r\n        <div class=\"search-right\" style=\"display:none\">搜索</div>\r\n    </a>\r\n    <a id=\"tool-box-gotop\" class=\"gotop icon-zhiding\" style=\"display:none\"></a>\r\n</div>"

/***/ }),

/***/ "./src/modules/old_concept/components/vote/vote.art":
/*!**********************************************************!*\
  !*** ./src/modules/old_concept/components/vote/vote.art ***!
  \**********************************************************/
/***/ (function(module) {

module.exports = "{{if state}}\r\n<div class=\"look-box\">\r\n    <span id=\"vote-bullish\" class=\"kzh-span\">看涨</span>\r\n    <span class=\"look-data-box\">\r\n        <div class=\"data\">\r\n            <b id=\"vote-data-bullish\" class=\"fl kzh-b\">{{bullishPercent}}%</b>\r\n            <b id=\"vote-data-bearish\" class=\"fr kd-b\">{{bearishPercent}}%</b>\r\n        </div>\r\n        <div id=\"vote-bar\" class=\"look-bar\">\r\n            <div class=\"look-up\" style=\"width: {{bullishPercent}}%;\"></div><div class=\"look-down\" style=\"width: {{bearishPercent}}%;\"></div>\r\n        </div>\r\n    </span>\r\n    <span id=\"vote-bearish\" class=\"kd-span\">看跌</span>\r\n</div>\r\n{{else}}\r\n<div class=\"look-box\">\r\n    <span id=\"vote-bullish\" class=\"kzh-span\">看涨</span>\r\n    <span class=\"look-data-box\">\r\n        <div class=\"data\">\r\n            <b id=\"vote-data-bullish\" class=\"fl kzh-b\">50%</b>\r\n            <b id=\"vote-data-bearish\" class=\"fr kd-b\">50%</b>\r\n        </div>\r\n        <div id=\"vote-bar\" class=\"look-bar\">\r\n            <div class=\"look-up\" style=\"width: 50%;\"></div><div class=\"look-down\" style=\"width: 50%;\"></div>\r\n        </div>\r\n    </span>\r\n    <span id=\"vote-bearish\" class=\"kd-span\">看跌</span>\r\n</div>\r\n{{/if}}"

/***/ }),

/***/ "./jssrc/concept.ts":
/*!**************************!*\
  !*** ./jssrc/concept.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/**
 * 概念版行情单页主JS
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var utils_1 = __importDefault(__webpack_require__(/*! ../src/modules/utils */ "./src/modules/utils/index.ts"));
var gotowap_1 = __importDefault(__webpack_require__(/*! ../src/modules/gotowap */ "./src/modules/gotowap/index.ts"));
var scrollnotic_1 = __importDefault(__webpack_require__(/*! ../src/modules/scrollnotic */ "./src/modules/scrollnotic/index.ts")); //跑马灯消息提示
gotowap_1["default"](stockentry.code, stockentry.mktnum);
__webpack_require__(/*! ../src/modules/old_concept/index */ "./src/modules/old_concept/index.js");
scrollnotic_1["default"].init(stockentry.code, '20200831', '300059');
window.onload = function () {
    var myDate = new Date();
    var hh = myDate.getHours();
    var mm = myDate.getMinutes() > 9 ? myDate.getMinutes() : '0' + myDate.getMinutes();
    if (900 < Number(hh + '' + mm) && Number(hh + '' + mm) < 930) {
        var dom = $("#type-selector");
        var tabs = dom.find(".dataType");
        $(tabs[0]).click();
        $(tabs[0]).addClass('cur').siblings().removeClass('cur');
    }
};
/**
 * 自选股相关功能
 */
var quote_zxg_concept_1 = __importDefault(__webpack_require__(/*! ../src/modules/newzxg/quote_zxg_concept */ "./src/modules/newzxg/quote_zxg_concept.ts"));
quote_zxg_concept_1["default"](stockentry.mktnum + '.' + stockentry.code);
/**
 * 404 过滤模块
*/
var filterblackstock_1 = __importDefault(__webpack_require__(/*! ../src/modules/filterblackstock */ "./src/modules/filterblackstock/index.ts"));
function dealblack() {
    return __awaiter(this, void 0, void 0, function () {
        var isblack, stylestr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, filterblackstock_1["default"]()];
                case 1:
                    isblack = _a.sent();
                    //创业板404黑名单相关
                    if (isblack) {
                        $(".tab-list-1").hide();
                        $(".tab-list-2").hide();
                        stylestr = "#opt-stockcalendar-wrapper{display:none !important};";
                        utils_1["default"].addstyle(stylestr);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
;
dealblack();


/***/ }),

/***/ "./src/config/web.ts":
/*!***************************!*\
  !*** ./src/config/web.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/**
 * web接口配置
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var url_1 = __importDefault(__webpack_require__(/*! ../modules/url */ "./src/modules/url/index.ts"));
var rnd = Math.floor(Math.random() * 99 + 1);
var config = {
    dev: {
        old_zixun_api: "//cmsdataapi.eastmoney.com/",
        new_zixun_api: "http://np-listapi.uat.emapd.com/",
        new_notice_api: "//np-anotice-stock.eastmoney.com/",
        quote_api: "//push2.eastmoney.com/",
        quote_push_api: "//" + rnd + ".push2.eastmoney.com/"
    },
    test: {
        old_zixun_api: "//cmsdataapi.eastmoney.com/",
        new_zixun_api: "http://np-listapi.uat.emapd.com/",
        new_notice_api: "//np-anotice-stock-test.eastmoney.com/",
        quote_api: "//push2test.eastmoney.com/",
        quote_push_api: "//push2test.eastmoney.com/"
    },
    prod: {
        old_zixun_api: "//cmsdataapi.eastmoney.com/",
        new_zixun_api: "//np-listapi.eastmoney.com/",
        new_notice_api: "//np-anotice-stock.eastmoney.com/",
        quote_api: "//push2.eastmoney.com/",
        quote_push_api: "//" + rnd + ".push2.eastmoney.com/"
    },
    getUrl: function (name) {
        var env = url_1["default"].getQuery('env');
        if (env == "dev") {
            return this.dev[name];
        }
        else if (env == "test") {
            return this.test[name];
        }
        return this.prod[name];
    }
};
exports.default = config;


/***/ }),

/***/ "./src/modules/browser_fingerprint/bid.ts":
/*!************************************************!*\
  !*** ./src/modules/browser_fingerprint/bid.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/**
 * 浏览器id cookie
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var cookie_1 = __importDefault(__webpack_require__(/*! ../cookie */ "./src/modules/cookie/index.ts"));
exports.default = {
    get: function () {
        return cookie_1["default"].get('qgqp_b_id');
    },
    make: function () {
        var newid = Math.floor(Math.random() * 9 + 1).toString();
        for (var i = 0; i < 19; i++) {
            newid += Math.floor(Math.random() * 9).toString();
        }
        cookie_1["default"].set('qgqp_b_id', newid, 10000, '.eastmoney.com');
        return newid;
    },
    save: function (fingerprint) {
        cookie_1["default"].set('qgqp_b_id', fingerprint, 10000, '.eastmoney.com');
        return fingerprint;
    },
    init: function () {
        if (this.get() == null || this.get() == '') {
            return this.make();
        }
        else {
            return this.get();
        }
    }
};


/***/ }),

/***/ "./src/modules/browser_fingerprint/index.ts":
/*!**************************************************!*\
  !*** ./src/modules/browser_fingerprint/index.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/**
 * 浏览器指纹
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var fingerprint = __webpack_require__(/*! ./fingerprint2 */ "./src/modules/browser_fingerprint/fingerprint2.js");
var bid_1 = __importDefault(__webpack_require__(/*! ./bid */ "./src/modules/browser_fingerprint/bid.ts"));
/**
 * 是否支持canvas
 *
 * @returns
 */
function isSupportCanvas() {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
}
exports.default = {
    get: function () {
        return __awaiter(this, void 0, void 0, function () {
            var bid_str;
            return __generator(this, function (_a) {
                bid_str = bid_1["default"].get();
                if (bid_str != null) { //cookie中已经有了
                    return [2 /*return*/, bid_str];
                }
                if (isSupportCanvas()) { //支持canvas
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            new fingerprint({
                                dontUseFakeFontInCanvas: true,
                                swfContainerId: true,
                                swfPath: true,
                                // userDefinedFonts : true,
                                excludeUserAgent: true,
                                // excludeLanguage : true,
                                // excludeColorDepth : true,
                                excludeScreenResolution: true,
                                excludeAvailableScreenResolution: true,
                                // excludeTimezoneOffset : true,
                                // excludeSessionStorage : true,
                                // excludeIndexedDB : true,
                                // excludeAddBehavior : true,
                                // excludeOpenDatabase : true,
                                // excludeCpuClass : true,
                                // excludePlatform : true,
                                // excludeDoNotTrack : true,
                                // excludeCanvas : true,
                                // excludeWebGL : true,
                                excludeAdBlock: true,
                                // excludeHasLiedLanguages : true,
                                // excludeHasLiedResolution : true,
                                // excludeHasLiedOs : true,
                                // excludeHasLiedBrowser : true,
                                // excludeJsFonts : true,
                                excludeFlashFonts: true,
                                excludePlugins: true,
                                excludeIEPlugins: true
                                // excludeTouchSupport : true,
                                // excludePixelRatio : true,
                                // excludeHardwareConcurrency : true,
                            }).get(function (result, components) {
                                bid_1["default"].save(result);
                                resolve(result);
                                return;
                            });
                        })];
                }
                else {
                    return [2 /*return*/, bid_1["default"].make()]; // 不支持canvas 生成一个随机数
                }
                return [2 /*return*/];
            });
        });
    }
};


/***/ }),

/***/ "./src/modules/cookie/index.ts":
/*!*************************************!*\
  !*** ./src/modules/cookie/index.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

/**
 * 浏览器操作cookie
 */
exports.__esModule = true;
exports.default = {
    /**
     * 获取cookie
     * @param name cookie名称
     */
    get: function (name) {
        var xarr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (xarr != null)
            return decodeURIComponent(xarr[2]);
        return null;
    },
    /**
     * 获取cookie,使用老旧的unescape
     * @param name cookie名称
     */
    get_old: function (name) {
        var xarr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (xarr != null)
            return unescape(xarr[2]);
        return null;
    },
    /**
     * 设置cookie
     * @param key cookie名称
     * @param value cookie的值
     * @param expiredays 过期时间（天）
     * @param domain cookie的domain
     */
    set: function (key, value, expiredays, domain) {
        var cookiestr = key + "=" + encodeURIComponent(value);
        if (expiredays != undefined) {
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + expiredays);
            cookiestr += ";expires=" + exdate.toUTCString();
        }
        if (domain != undefined) {
            cookiestr += ";domain=" + domain;
        }
        cookiestr += ';path=/';
        document.cookie = cookiestr;
    },
    /**
     * 设置cookie 用的老的escape
     * @param key cookie名称
     * @param value cookie的值
     * @param expiredays 过期时间（天）
     * @param domain cookie的domain
     */
    set_old: function (key, value, expiredays, domain) {
        var cookiestr = key + "=" + escape(value);
        if (expiredays != undefined) {
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + expiredays);
            cookiestr += ";expires=" + exdate.toUTCString();
        }
        if (domain != undefined) {
            cookiestr += ";domain=" + domain;
        }
        cookiestr += ';path=/';
        document.cookie = cookiestr;
    },
    /**
     * 删除cookie
     * @param key cookie名称
     * @param domain cookie的domain
     */
    del: function (key, domain) {
        var exdate = new Date((new Date).getTime() - 1);
        if (domain) {
            document.cookie = key + '=;path=/;expires=' + exdate.toUTCString() + ';domain=' + domain;
        }
        else {
            document.cookie = key + '=;path=/;expires=' + exdate.toUTCString();
        }
    }
};


/***/ }),

/***/ "./src/modules/data/index.ts":
/*!***********************************!*\
  !*** ./src/modules/data/index.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/**
 * 获取数据
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var quote_1 = __importDefault(__webpack_require__(/*! ./quote */ "./src/modules/data/quote.ts"));
/**
 * 获取数据
 */
exports.default = {
    quote: quote_1["default"]
};


/***/ }),

/***/ "./src/modules/data/k.ts":
/*!*******************************!*\
  !*** ./src/modules/data/k.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/**
 * K线图行情
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var webconfig = __webpack_require__(/*! ../../../config/web */ "./config/web.js");
function getQuery(name) {
    var urlpara = location.search;
    var par = {};
    if (urlpara != "") {
        urlpara = urlpara.substring(1, urlpara.length);
        var para = urlpara.split("&");
        var parname;
        var parvalue;
        for (var i = 0; i < para.length; i++) {
            parname = para[i].substring(0, para[i].indexOf("="));
            parvalue = para[i].substring(para[i].indexOf("=") + 1, para[i].length);
            par[parname] = parvalue;
        }
    }
    if (typeof (par[name]) != "undefined") {
        return par[name];
    }
    else {
        return null;
    }
}
exports.default = {
    /**
     * 获取分时行情数据
     * @param newcode 新代码 如 0.300059
     * @param days 天数 默认1天
     * @param iscr 0 没有盘前 1 有盘前
     */
    getOldKDataFromNew: function (newcode, fqtype, ktype) {
        return __awaiter(this, void 0, void 0, function () {
            var fqtypestr, ktypestr, push2his, backdata, yc, ycindex, tempdata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (fqtype === undefined)
                            fqtype = 'qfq';
                        if (ktype === undefined)
                            ktype = 'rk';
                        fqtypestr = '0';
                        if (fqtype == 'qfq') {
                            fqtypestr = '1';
                        }
                        else if (fqtype == 'hfq') {
                            fqtypestr = '2';
                        }
                        ktypestr = '101';
                        if (ktype == 'wk') {
                            ktypestr = '102';
                        }
                        else if (ktype == 'mk') {
                            ktypestr = '103';
                        }
                        else if (ktype == 'qk') {
                            ktypestr = '104';
                        }
                        else if (ktype == 'hyk') {
                            ktypestr = '105';
                        }
                        else if (ktype == 'yk') {
                            ktypestr = '106';
                        }
                        else if (ktype == 'm5k') {
                            ktypestr = '5';
                        }
                        else if (ktype == 'm15k') {
                            ktypestr = '15';
                        }
                        else if (ktype == 'm30k') {
                            ktypestr = '30';
                        }
                        else if (ktype == 'm60k') {
                            ktypestr = '60';
                        }
                        push2his = '//push2his.eastmoney.com/api/qt/stock/kline/get?cb=?';
                        if (getQuery('env') == 'test') {
                            push2his = 'http://61.152.230.207/api/qt/stock/kline/get?cb=?';
                        }
                        return [4 /*yield*/, $.ajax({
                                url: push2his,
                                type: 'GET',
                                dataType: 'jsonp',
                                data: {
                                    fields1: 'f1,f2,f3,f4,f5,f6',
                                    fields2: 'f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61',
                                    ut: webconfig.getPath('quoteut'),
                                    klt: ktypestr,
                                    fqt: fqtypestr,
                                    secid: newcode,
                                    beg: 0,
                                    end: 20500000
                                }
                            })];
                    case 1:
                        backdata = _a.sent();
                        if (backdata.rc == 0 && backdata.data) {
                            yc = '1';
                            ycindex = backdata.data.klines.length - 2;
                            if (backdata.data.klines.length == 1) {
                                ycindex = 0;
                            }
                            if (backdata.data.klines.length > 0) {
                                //@ts-ignore
                                yc = backdata.data.klines[ycindex].split(',')[2];
                            }
                            tempdata = {
                                name: backdata.data.name,
                                code: backdata.data.code,
                                info: {
                                    yc: yc,
                                    // yc: backdata.data.prePrice,
                                    // ticks: "34200|54000|1|34200|41400|46800|54000",
                                    // total: backdata.data.trendsTotal,
                                    // pricedigit: "0.00",
                                    mk: (backdata.data.market == 0) ? '2' : 1
                                },
                                data: []
                            };
                            tempdata.data = backdata.data.klines.map(function (v) {
                                var temparray = v.split(',');
                                var backarray = [
                                    temparray[0],
                                    temparray[1],
                                    temparray[2],
                                    temparray[3],
                                    temparray[4],
                                    temparray[5],
                                    temparray[6],
                                    temparray[7] + '%',
                                    temparray[10],
                                    temparray[8],
                                    temparray[9]
                                ];
                                return backarray.join(',');
                                // return v
                            });
                            return [2 /*return*/, tempdata];
                        }
                        else {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
};


/***/ }),

/***/ "./src/modules/data/pkyd.ts":
/*!**********************************!*\
  !*** ./src/modules/data/pkyd.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
/**
 * 行情盘口异动数据
 */
var webconfig = __webpack_require__(/*! ../../../config/web */ "./config/web.js");
/**
 * 类型和文字的对应关系
 */
var pkdsstrnum = {
    "1": "有大买盘",
    "101": "有大卖盘",
    "2": "大笔买入",
    "102": "大笔卖出",
    "201": "封涨停板",
    "301": "封跌停板",
    "202": "打开涨停",
    "302": "打开跌停",
    "203": "高开5日线",
    "303": "低开5日线",
    "204": "60日新高",
    "304": "60日新低",
    "401": "向上缺口",
    "501": "向下缺口",
    "402": "火箭发射",
    "502": "高台跳水",
    "403": "快速反弹",
    "503": "快速下跌",
    "404": "竞价上涨",
    "504": "竞价下跌",
    "405": "60日大幅上涨",
    "505": "60日大幅下跌"
};
exports.default = {
    /**
     * 获取单个股票的盘口异动数据
     * @param newcode 新码表，例如0.300049
     * @param limit 最大条数，不传则是无限
     */
    getOne: function (newcode, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var api, backdata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (limit == undefined) {
                            limit = -1; //无限
                        }
                        api = webconfig.getPath('quotepush');
                        if (window.location.search.indexOf("env=test") > -1) {
                            api = "http://61.152.230.207/";
                        }
                        return [4 /*yield*/, $.ajax({
                                url: api + "api/qt/pkyd/get?cb=?",
                                type: 'GET',
                                dataType: 'jsonp',
                                data: {
                                    fields: 'f2,f1,f3,f4,f5,f6,f7',
                                    ut: webconfig.getPath('quoteut'),
                                    lmt: limit,
                                    secids: newcode
                                }
                            })];
                    case 1:
                        backdata = _a.sent();
                        if (backdata.rc == 0 && backdata.data && backdata.data.pkyd) {
                            return [2 /*return*/, backdata.data.pkyd];
                        }
                        else {
                            return [2 /*return*/, []];
                        }
                        return [2 /*return*/];
                }
            });
        });
    },
    /**
     * 用新的盘口异动接口获取老的接口格式的数据
     * @param newcode 新代码 如 0.300059
     * @param oldcode 老代码 如 3000592
     */
    getOldDataFromNewOne: function (newcode, oldcode) {
        return __awaiter(this, void 0, void 0, function () {
            var newback, oldback;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getOne(newcode)];
                    case 1:
                        newback = _a.sent();
                        if (newback.length == 0) {
                            return [2 /*return*/, []];
                        }
                        oldback = [];
                        newback.forEach(function (item) {
                            var newarray = item.split(',');
                            var oldarray = [];
                            oldarray.push(oldcode);
                            oldarray.push(newarray[0].substring(0, 5));
                            oldarray.push(newarray[3]);
                            //@ts-ignore
                            oldarray.push(pkdsstrnum[newarray[4]]);
                            oldarray.push(newarray[5]);
                            oldarray.push(newarray[6] == '1' ? '1' : '0');
                            oldback.push(oldarray.join(','));
                        });
                        return [2 /*return*/, oldback.reverse()];
                }
            });
        });
    }
};


/***/ }),

/***/ "./src/modules/data/quote.ts":
/*!***********************************!*\
  !*** ./src/modules/data/quote.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/**
 * 行情类数据
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var pkyd_1 = __importDefault(__webpack_require__(/*! ./pkyd */ "./src/modules/data/pkyd.ts"));
var time_1 = __importDefault(__webpack_require__(/*! ./time */ "./src/modules/data/time.ts"));
var k_1 = __importDefault(__webpack_require__(/*! ./k */ "./src/modules/data/k.ts"));
exports.default = {
    pkyd: pkyd_1["default"],
    time: time_1["default"],
    k: k_1["default"]
};


/***/ }),

/***/ "./src/modules/data/time.ts":
/*!**********************************!*\
  !*** ./src/modules/data/time.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/**
 * 分时行情
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var webconfig = __webpack_require__(/*! ../../../config/web */ "./config/web.js");
exports.default = {
    /**
     * 获取分时行情数据
     * @param newcode 新代码 如 0.300059
     * @param days 天数 默认1天
     * @param iscr 0 没有盘前 1 有盘前
     */
    getTimeData: function (newcode, days, iscr) {
        return __awaiter(this, void 0, void 0, function () {
            var backdata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (days === undefined)
                            days = 1;
                        if (iscr === undefined)
                            iscr = 0;
                        return [4 /*yield*/, $.ajax({
                                url: '//push2his.eastmoney.com/api/qt/stock/trends2/get?cb=?',
                                type: 'GET',
                                dataType: 'jsonp',
                                data: {
                                    fields1: 'f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13',
                                    fields2: 'f51,f52,f53,f54,f55,f56,f57,f58',
                                    ut: webconfig.getPath('quoteut'),
                                    ndays: days,
                                    iscr: iscr,
                                    secid: newcode
                                }
                            })];
                    case 1:
                        backdata = _a.sent();
                        if (backdata.rc == 0 && backdata.data) {
                            return [2 /*return*/, backdata.data];
                        }
                        else {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/];
                }
            });
        });
    },
    /**
     * 获取分时行情数据
     * @param newcode 新代码 如 0.300059
     * @param days 天数 默认1天
     * @param iscr 0 没有盘前 1 有盘前
     */
    getOldTimeDataFromNew: function (newcode, days, iscr, isph) {
        return __awaiter(this, void 0, void 0, function () {
            var url, backdata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (days === undefined)
                            days = 1;
                        if (iscr === undefined)
                            iscr = 0;
                        if (isph === undefined)
                            isph = 0;
                        url = '//push2his.eastmoney.com/api/qt/stock/trends2/get';
                        if (days == 1) {
                            url = '//push2.eastmoney.com/api/qt/stock/trends2/get';
                        }
                        if (window.location.search == "?env=test") {
                            url = "http://61.152.230.207/api/qt/stock/trends2/get";
                        }
                        return [4 /*yield*/, $.ajax({
                                url: url,
                                type: 'GET',
                                dataType: 'jsonp',
                                jsonp: "cb",
                                data: {
                                    fields1: 'f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13',
                                    fields2: 'f51,f52,f53,f54,f55,f56,f57,f58',
                                    // ut: webconfig.getPath('quoteut'),
                                    ut: "fa5fd1943c7b386f172d6893dbfba10b",
                                    ndays: days,
                                    iscr: iscr,
                                    iscca: isph,
                                    secid: newcode
                                }
                            })];
                    case 1:
                        backdata = _a.sent();
                        if (backdata.rc == 0 && backdata.data) {
                            // let tempdata = {
                            //   name: backdata.data.name,
                            //   code: backdata.data.code,
                            //   info: {
                            //       yc: backdata.data.prePrice,
                            //       ticks: "34200|54000|1|34200|41400|46800|54000",
                            //       total: backdata.data.trendsTotal,
                            //       pricedigit: "0.00",
                            //       mk: (backdata.data.market == 0)?'2':1
                            //   },
                            //   data: []
                            // }
                            // tempdata.data = backdata.data.trends.map((v:string)=>{
                            //   let temparray = v.split(',')
                            //   let backarray:any = [
                            //     temparray[0],
                            //     temparray[2],
                            //     temparray[5],
                            //     temparray[7]
                            //   ]
                            //   return backarray.join(',')
                            // })
                            // return tempdata
                            return [2 /*return*/, backdata];
                        }
                        else {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
};


/***/ }),

/***/ "./src/modules/filterblackstock/index.ts":
/*!***********************************************!*\
  !*** ./src/modules/filterblackstock/index.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

/*
 *@description:  404过滤处理
 *@modifyContent:
 *@author: qiuhongyang
 *@date: 2020-10-29 10:52:46
 *
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
/**
 * 获取404列表
*/
function getempblist() {
    return $.ajax({
        type: "GET",
        url: '//emres.eastmoney.com/60/empblist.js',
        dataType: "jsonp",
        jsonpCallback: 'empblist2020'
    });
}
;
/**
 * 判断是不是屏蔽页面
 * @return
*/
function filterblack() {
    return __awaiter(this, void 0, void 0, function () {
        var backstatus, thisurl, empinfo, dataList, index, element, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    backstatus = false;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    thisurl = location.href.substring(location.href.indexOf('//') + 2).toLowerCase();
                    return [4 /*yield*/, getempblist()];
                case 2:
                    empinfo = _a.sent();
                    dataList = empinfo === null || empinfo === void 0 ? void 0 : empinfo.dataList;
                    for (index = 0; index < dataList.length; index++) {
                        element = dataList[index];
                        element = element.substring(element.indexOf('//') + 2);
                        if (element.toLowerCase() == thisurl) {
                            backstatus = true;
                            break;
                        }
                    }
                    ;
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    return [3 /*break*/, 4];
                case 4: 
                // console.log(backstatus)
                return [2 /*return*/, backstatus];
            }
        });
    });
}
;
exports.default = filterblack;


/***/ }),

/***/ "./src/modules/gotowap/index.ts":
/*!**************************************!*\
  !*** ./src/modules/gotowap/index.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/**
 * 跳转wap网站
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var url_1 = __importDefault(__webpack_require__(/*! ../url */ "./src/modules/url/index.ts"));
function isMobile() {
    var ua = navigator.userAgent;
    var res = false;
    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/), isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/), isAndroid = ua.match(/(Android)\s+([\d.]+)/) && ua.match(/(Mobile)\s+/), isMobile = isIphone || isAndroid;
    if (isMobile) {
        res = true;
    }
    else {
        res = false;
    }
    return res;
}
/**
 * 跳转wap
 * @param code 代码
 * @param market 市场
 */
function gotowap(code, market) {
    if (url_1["default"].getQuery('jump_to_web') == 'true') {
        return false;
    }
    if (isMobile()) {
        self.location.href = "https://wap.eastmoney.com/quote/stock/" + market + "." + code + ".html";
    }
}
exports.default = gotowap;


/***/ }),

/***/ "./src/modules/new_news/web.ts":
/*!*************************************!*\
  !*** ./src/modules/new_news/web.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/**
 * 新版资讯
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.oldGetNewsByCodeName = void 0;
var web_1 = __importDefault(__webpack_require__(/*! ../../config/web */ "./src/config/web.ts"));
function oldGetNewsByCodeName(market, code, name) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, $.ajax({
                    url: web_1["default"].getUrl('old_zixun_api') + "api/StockNews?returnFields=Art_Title,Art_Showtime,Art_Url&cb=?",
                    type: 'GET',
                    dataType: 'jsonp',
                    data: {
                        mktNum: market,
                        stockCode: code,
                        stockName: name
                    }
                }).then(function (back) {
                    if (back.Data instanceof Array) {
                        return back.Data.map(function (v) {
                            return __assign({ Art_ShowTime: v.Art_Showtime }, v);
                        });
                    }
                    else {
                        return [];
                    }
                }, function (error) {
                    console.error(error);
                    return [];
                })];
        });
    });
}
exports.oldGetNewsByCodeName = oldGetNewsByCodeName;
exports.default = {
    /**
     * 根据市场代码获取资讯
     * @param code 代码 比如 1.600000
     * @param pagesize
     */
    getNews: function (code, pagesize) {
        if (pagesize === void 0) { pagesize = 5; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, $.ajax({
                        url: web_1["default"].getUrl('new_zixun_api') + "comm/web/getListInfo?client=web&mTypeAndCode=" + code + "&type=1&pageSize=" + pagesize + "&callback=?",
                        type: 'GET',
                        dataType: 'jsonp',
                        data: {
                            traceId: Math.floor(Math.random() * 10000000000 + 1)
                        }
                    }).then(function (back) {
                        if (back.code == 1 && back.data && back.data.list && back.data.list instanceof Array) {
                            return back.data.list.slice(0, pagesize);
                        }
                        else {
                            return [];
                        }
                    })];
            });
        });
    },
    /**
     * 更具栏目id获取资讯
     * @param column_id
     */
    getNewsByColumn: function (column_id, pagesize) {
        if (pagesize === void 0) { pagesize = 5; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.info(web_1["default"].getUrl('new_zixun_api'));
                console.info(web_1["default"].getUrl('new_zixun_api') + "comm/adpt/getlist?client=web&biz=web_quote_other&fcolType=1&type=1&fcolName=columns&fcolValue=" + column_id + "&order=2&pageSize=" + pagesize);
                return [2 /*return*/, $.ajax({
                        url: web_1["default"].getUrl('new_zixun_api') + "comm/adpt/getlist?client=web&biz=web_quote_other&fcolType=1&type=1&fcolName=columns&fcolValue=" + column_id + "&order=2&pageSize=" + pagesize,
                        type: 'GET',
                        dataType: 'jsonp',
                        data: {}
                    }).then(function (back) {
                        if (back.code == 1 && back.data && back.data.list && back.data.list instanceof Array) {
                            return back.data.list.slice(0, pagesize);
                        }
                        else {
                            return [];
                        }
                    }, function (error) {
                        console.error(error);
                        return [];
                    })];
            });
        });
    }
};


/***/ }),

/***/ "./src/modules/newzxg/quote_zxg_concept.ts":
/*!*************************************************!*\
  !*** ./src/modules/newzxg/quote_zxg_concept.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/**
 * 行情页面 概念版 自选股相关功能
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var web_1 = __importDefault(__webpack_require__(/*! ../newzxg/web */ "./src/modules/newzxg/web.ts"));
var web_2 = __importDefault(__webpack_require__(/*! ../quote_info/web */ "./src/modules/quote_info/web.ts"));
var dot_1 = __importDefault(__webpack_require__(/*! dot */ "./node_modules/dot/doT.js"));
var myfavorlist_concept_dot_1 = __importDefault(__webpack_require__(/*! ./myfavorlist_concept.dot */ "./src/modules/newzxg/myfavorlist_concept.dot"));
var txt_1 = __importDefault(__webpack_require__(/*! ../txt */ "./src/modules/txt/index.ts"));
/**
 * 左侧我的自选股
 */
function showLeftMyFavor(favorlist) {
    return __awaiter(this, void 0, void 0, function () {
        var hqlist;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, web_2["default"].simpleInfo(favorlist)];
                case 1:
                    hqlist = _a.sent();
                    $('#favor').html(dot_1["default"].compile(myfavorlist_concept_dot_1["default"])({
                        list: hqlist.slice(0, 8).map(function (v) {
                            var marketstr = (v.market == '0') ? 'sz' : 'sh';
                            return Object.assign(v, {
                                href: v.ishsstock ? "//quote.eastmoney.com/concept/" + (marketstr + v.code) + ".html" : "//quote.eastmoney.com/unify/r/" + v.newcode
                            });
                        }),
                        txt: txt_1["default"]
                    }));
                    return [2 /*return*/];
            }
        });
    });
}
function default_1(code) {
    return __awaiter(this, void 0, void 0, function () {
        var favorlist;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, web_1["default"].defaultGroupList(code)];
                case 1:
                    favorlist = _a.sent();
                    showLeftMyFavor(favorlist.result.list.slice(0, 10));
                    setInterval(function () {
                        showLeftMyFavor(favorlist.result.list.slice(0, 10));
                    }, 60 * 1000);
                    //加自选按钮
                    if (favorlist.result.check) { //已加自选
                        $('#btn-favor').text('- 删自选').addClass('delZx-box');
                    }
                    $('#btn-favor').attr('href', '//quote.eastmoney.com/zixuan/?from=add');
                    $("#btn-favor").on('click', function () {
                        if (!favorlist.result.check) {
                            web_1["default"].addDefaultStock(code);
                            favorlist.result.check = true;
                            $(this).text('- 删自选').addClass('delZx-box');
                            return true;
                        }
                        else {
                            web_1["default"].deleteDefaultStock(code);
                            favorlist.result.check = false;
                            $(this).text('+ 加自选').removeClass('delZx-box');
                            return false;
                        }
                    });
                    return [2 /*return*/];
            }
        });
    });
}
exports.default = default_1;


/***/ }),

/***/ "./src/modules/newzxg/web.ts":
/*!***********************************!*\
  !*** ./src/modules/newzxg/web.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/**
 * 新版自选股接口
 *
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var browser_fingerprint_1 = __importDefault(__webpack_require__(/*! ../browser_fingerprint */ "./src/modules/browser_fingerprint/index.ts"));
var user_1 = __importDefault(__webpack_require__(/*! ../user */ "./src/modules/user/index.ts"));
var apiurl = '//myfavor.eastmoney.com/v4/'; //正式环境
var appkey = 'd41d8cd98f00b204e9800998ecf8427e';
if (user_1["default"].get() == null) {
    apiurl += 'anonymwebouter/';
}
else {
    apiurl += 'webouter/';
}
exports.default = {
    /**
     * 获取自选股接口通用参数
     */
    getParams: function () {
        return __awaiter(this, void 0, void 0, function () {
            var fp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(user_1["default"].get() == null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, browser_fingerprint_1["default"].get()];
                    case 1:
                        fp = _a.sent();
                        return [2 /*return*/, "appkey=" + appkey + "&bid=" + fp];
                    case 2: return [2 /*return*/, "appkey=" + appkey];
                }
            });
        });
    },
    /**
     * 获取默认分组股票，检测是否加了自选
     * @param {*} code 股票代码 0.300059
     */
    defaultGroupList: function (code) {
        if (code === void 0) { code = ''; }
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getParams()];
                    case 1:
                        params = _a.sent();
                        code = code.replace('.', '$');
                        return [2 /*return*/, $.ajax({
                                url: apiurl + "gsaandcheck?" + params + "&cb=?",
                                type: 'GET',
                                dataType: 'jsonp',
                                data: {
                                    sc: code
                                }
                            })
                                .then(function (json) {
                                if (json.state == 0 && json.data && json.data.stkstarlist instanceof Array) {
                                    return {
                                        re: true,
                                        result: {
                                            check: json.data.check,
                                            list: json.data.stkstarlist.map(function (v) {
                                                return v.security.substring(0, v.security.lastIndexOf('$')).replace('$', '.');
                                            })
                                        }
                                    };
                                }
                                else {
                                    return {
                                        re: true,
                                        result: {
                                            check: false,
                                            list: []
                                        }
                                    };
                                }
                            })];
                }
            });
        });
    },
    /**
     * 加自选到默认分组
     * @param {*} code 股票代码
     */
    addDefaultStock: function (code) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getParams()];
                    case 1:
                        params = _a.sent();
                        code = code.replace('.', '$');
                        return [2 /*return*/, $.ajax({
                                url: apiurl + "asz?" + params + "&cb=?",
                                type: 'GET',
                                dataType: 'jsonp',
                                data: {
                                    sc: code
                                }
                            }).then(function (back) {
                                if (back.state == 0) {
                                    return {
                                        re: true
                                    };
                                }
                                else {
                                    return {
                                        re: false,
                                        message: back.message
                                    };
                                }
                            })];
                }
            });
        });
    },
    /**
     * 删除默认分组的自选
     * @param {*} code 股票代码
     */
    deleteDefaultStock: function (code) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getParams()];
                    case 1:
                        params = _a.sent();
                        code = code.replace('.', '$');
                        return [2 /*return*/, $.ajax({
                                url: apiurl + "dsz?" + params + "&cb=?",
                                type: 'GET',
                                dataType: 'jsonp',
                                data: {
                                    sc: code
                                }
                            }).then(function (back) {
                                if (back.state == 0) {
                                    return {
                                        re: true
                                    };
                                }
                                else {
                                    return {
                                        re: false,
                                        message: back.message
                                    };
                                }
                            })];
                }
            });
        });
    }
};


/***/ }),

/***/ "./src/modules/quote_info/tools.ts":
/*!*****************************************!*\
  !*** ./src/modules/quote_info/tools.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/**
 * 行情相关工具
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var txt_1 = __importDefault(__webpack_require__(/*! ../txt */ "./src/modules/txt/index.ts"));
exports.default = {
    /**
     * 是否是沪深A股票
     * @param {*} f13
     * @param {*} f19
     */
    isHSStock: function (f13, f19) {
        return (f13 == 1 && f19 == 2) || (f13 == 1 && f19 == 23) || ((f13 == 0) && (f19 == 6 || f19 == 13 || f19 == 80));
    },
    /**
     * 转化行情数据为需要的格式
     * @param input 输入数据
     * @param fixed 缩小倍数并保留小数位数
     * @param colornumber 颜色 大于0红色 小于0 绿色 等于0 灰色 null不设置颜色
     * @param format_number 格式化数据 万 亿 万亿 并设置最大宽度
     * @param hz 后缀
     * @param tofixed 保留小数位数
     * @returns
     */
    quoteItem: function (input, fixed, colornumber, format_number, hz, tofixed) {
        // if(typeof input == 'string'){
        //   if(isNaN(parseFloat(input)) ){
        //     input = undefined
        //   } 
        //   else{
        //     input = parseFloat(input)
        //   }
        // }
        if (input == undefined) {
            return {
                txt: '',
                color: '',
                html: '',
                blink_html: ''
            };
        }
        if (input == '-') {
            return {
                txt: '-',
                color: '',
                html: '-',
                blink_html: '-'
            };
        }
        var return_obj = {
            txt: input.toString(),
            color: 'price_draw',
            html: '',
            blink_html: ''
        };
        var blink_color = '';
        //处理放大倍数
        if (typeof input == 'number' && fixed > 0) {
            return_obj.txt = (input / (Math.pow(10, fixed))).toFixed(fixed);
        }
        if (typeof input == 'number' && tofixed != undefined && tofixed > 0) {
            return_obj.txt = input.toFixed(tofixed);
        }
        //格式化
        if (typeof input == 'number' && format_number > 0) {
            return_obj.txt = txt_1["default"].formatNumMaxWidth(input, format_number);
        }
        //颜色
        if (colornumber != null && colornumber > 0) {
            return_obj.color = 'price_up';
            blink_color = 'blinkred';
        }
        else if (colornumber != null && colornumber < 0) {
            return_obj.color = 'price_down';
            blink_color = 'blinkgreen';
        }
        else if (colornumber != null && colornumber == 0) {
            return_obj.color = 'price_draw';
            blink_color = 'blinkblue';
        }
        else {
            return_obj.color = '';
            blink_color = '';
        }
        //后缀
        if (hz != undefined) {
            return_obj.txt += hz;
        }
        return_obj.html = "<span class=\"" + return_obj.color + "\">" + return_obj.txt + "</span>";
        return_obj.blink_html = "<span class=\"" + return_obj.color + " " + blink_color + "\">" + return_obj.txt + "</span>";
        return return_obj;
    },
    /** 处理交易时间 */
    transTradeTime: function (trade_time) {
        if (isNaN(trade_time)) {
            return '-';
        }
        try {
            var d = new Date(trade_time * 1000);
            var jysj = d.getFullYear() + '-' + (("0" + (d.getMonth() + 1)).slice(-2)) + '-' + (("0" + (d.getDate())).slice(-2)) + ' ' + ("0" + (d.getHours())).slice(-2) + ':' + ("0" + (d.getMinutes())).slice(-2) + ':' + ("0" + (d.getSeconds())).slice(-2);
            return '（' + jysj + '）';
        }
        catch (e) {
            return '-';
        }
    }
};


/***/ }),

/***/ "./src/modules/quote_info/web.ts":
/*!***************************************!*\
  !*** ./src/modules/quote_info/web.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
/**
 * 前端直接获取行情信息
 */
var tools_1 = __importDefault(__webpack_require__(/*! ./tools */ "./src/modules/quote_info/tools.ts"));
var tools_2 = __importDefault(__webpack_require__(/*! ./tools */ "./src/modules/quote_info/tools.ts"));
var web_1 = __importDefault(__webpack_require__(/*! ../../config/web */ "./src/config/web.ts"));
var ut = 'fa5fd1943c7b386f172d6893dbfba10b';
/**
 * 转换分时成交数据
 * @param list
 * @param preprice
 * @returns
 */
function tradeToData(list, preprice) {
    return list.map(function (v, index) {
        var arr = v.split(',');
        var c1 = 0;
        if (arr[4] == '1') {
            c1 = -1;
        }
        else if (arr[4] == '2') {
            c1 = 1;
        }
        var jt = '&ensp;';
        var jtcolor = 0;
        if (index > 0) {
            var preitem = list[index - 1].split(',');
            if (arr[1] - preitem[1] > 0) {
                jt = '↑';
                jtcolor = 1;
            }
            else if (arr[1] - preitem[1] < 0) {
                jt = '↓';
                jtcolor = -1;
            }
        }
        else {
        }
        return {
            cjsj: arr[0],
            cjj: tools_1["default"].quoteItem(arr[1], -1, parseFloat(arr[1]) - preprice, -1),
            cjl: tools_1["default"].quoteItem(parseFloat(arr[2]), -1, c1, 4),
            price_zd: tools_1["default"].quoteItem(jt, -1, jtcolor, -1)
        };
    });
}
exports.default = {
    /**
     * 获取简单行情信息
     * @param codes
     */
    simpleInfo: function (codes) {
        return __awaiter(this, void 0, void 0, function () {
            var secids;
            return __generator(this, function (_a) {
                secids = '';
                if (typeof codes == "string") {
                    secids = codes;
                }
                else {
                    secids = codes.join(',');
                }
                return [2 /*return*/, $.ajax({
                        url: web_1["default"].getUrl('quote_api') + 'api/qt/ulist.np/get?fields=f1,f2,f3,f4,f6,f14,f12,f13,f19,f104,f105,f106,f152&invt=2&cb=?',
                        type: 'GET',
                        dataType: 'jsonp',
                        data: {
                            secids: secids,
                            ut: ut
                        }
                    }).then(function (back) {
                        var _a;
                        if (((_a = back === null || back === void 0 ? void 0 : back.data) === null || _a === void 0 ? void 0 : _a.diff) && back.data.diff instanceof Array) {
                            return back.data.diff.map(function (v) {
                                return {
                                    name: v.f14,
                                    newcode: v.f13 + '.' + v.f12,
                                    market: v.f13,
                                    code: v.f12,
                                    price: v.f2,
                                    price_str: tools_1["default"].quoteItem(v.f2, v.f1, v.f4, -1),
                                    price_fixnumber: v.f1,
                                    zdf: v.f3,
                                    zdf_str: tools_1["default"].quoteItem(v.f3, v.f152, v.f4, -1, '%'),
                                    zde_str: tools_1["default"].quoteItem(v.f4, v.f1, v.f4, -1),
                                    zdf_fixnumber: v.f152,
                                    ishsstock: tools_2["default"].isHSStock(v.f13, v.f19),
                                    z_number_str: tools_1["default"].quoteItem(v.f104, -1, 1, -1),
                                    p_number_str: tools_1["default"].quoteItem(v.f106, -1, 1, -1),
                                    d_number_str: tools_1["default"].quoteItem(v.f105, -1, 1, -1),
                                    cje: v.f6
                                };
                            });
                        }
                        else {
                            return [];
                        }
                    })];
            });
        });
    },
    /**
     * 带fs过滤功能的行情列表信息
     * @param fs fs过滤字符串
     * @param fid 排序字符串
     * @param pi 第几页 0开始
     * @param pz 每页多少条 默认10
     * @param po 排序 1 倒叙 0 正序 默认0
     * @returns
     */
    filterStockList: function (fs, fid, pi, pz, po) {
        if (pi === void 0) { pi = 0; }
        if (pz === void 0) { pz = 10; }
        if (po === void 0) { po = 1; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, $.ajax({
                        url: web_1["default"].getUrl('quote_api') + 'api/qt/clist/get?fltt=1&fields=f1,f2,f3,f4,f12,f13,f14,f152&np=1&invt=2&cb=?',
                        type: 'GET',
                        dataType: 'jsonp',
                        data: {
                            fs: fs,
                            fid: fid,
                            pi: pi,
                            pz: pz,
                            po: po,
                            ut: ut
                        }
                    }).then(function (back) {
                        var _a;
                        if (((_a = back === null || back === void 0 ? void 0 : back.data) === null || _a === void 0 ? void 0 : _a.diff) && back.data.diff instanceof Array) {
                            return back.data.diff.map(function (v) {
                                return {
                                    name: v.f14,
                                    quotecode: v.f13 + '.' + v.f12,
                                    market: v.f13,
                                    code: v.f12,
                                    price: tools_1["default"].quoteItem(v.f2, v.f1, v.f4, -1),
                                    zdf: tools_1["default"].quoteItem(v.f3, v.f152, v.f4, -1, '%'),
                                    zde: tools_1["default"].quoteItem(v.f4, v.f1, v.f4, -1)
                                };
                            });
                        }
                        else {
                            return [];
                        }
                    })];
            });
        });
    },
    /**
     * 单个股票行情信息，带格式化
     * @param market_code 市场+代码
     * @returns
     */
    stockInfo: function (market_code) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, $.ajax({
                        url: web_1["default"].getUrl('quote_api') + 'api/qt/stock/get?fields=f19,f39,f43,f44,f45,f46,f47,f48,f49,f50,f57,f58,f59,f60,f71,f84,f85,f86,f92,f108,f116,f117,f152,f154,f161,f164,f167,f168,f169,f170,f171,f532,f600,f601&invt=2&fltt=1&cb=?',
                        type: 'GET',
                        dataType: 'jsonp',
                        data: {
                            secid: market_code,
                            ut: ut
                        }
                    }).then(function (back) {
                        if (back === null || back === void 0 ? void 0 : back.data) {
                            return {
                                name: back.data.f58,
                                code: back.data.f57,
                                price: tools_1["default"].quoteItem(back.data.f43, back.data.f59, back.data.f169, -1),
                                zde: tools_1["default"].quoteItem(back.data.f169, back.data.f59, back.data.f169, -1),
                                zdf: tools_1["default"].quoteItem(back.data.f170, back.data.f152, back.data.f169, -1, '%'),
                                jk: tools_1["default"].quoteItem(back.data.f46, back.data.f59, back.data.f46 - back.data.f60, -1),
                                zs: tools_1["default"].quoteItem(back.data.f60, back.data.f59, 0, -1),
                                high_price: tools_1["default"].quoteItem(back.data.f44, back.data.f59, back.data.f44 - back.data.f60, -1),
                                low_price: tools_1["default"].quoteItem(back.data.f45, back.data.f59, back.data.f45 - back.data.f60, -1),
                                cjl: tools_1["default"].quoteItem(back.data.f47, -1, 0, 4),
                                cje: tools_1["default"].quoteItem(back.data.f48, -1, 0, 4),
                                mrj: tools_1["default"].quoteItem(back.data.f19, back.data.f59, back.data.f19 - back.data.f60, -1),
                                mcj: tools_1["default"].quoteItem(back.data.f39, back.data.f59, back.data.f39 - back.data.f60, -1),
                                np: tools_1["default"].quoteItem(back.data.f161, -1, -1, 4),
                                wp: tools_1["default"].quoteItem(back.data.f49, -1, 1, 4),
                                zf: tools_1["default"].quoteItem(back.data.f171, back.data.f152, 0, -1, '%'),
                                lb: tools_1["default"].quoteItem(back.data.f50, back.data.f152, 0, -1),
                                jysj: tools_1["default"].transTradeTime(back.data.f86),
                                jybz: back.data.f600,
                                jybz_hy: tools_1["default"].quoteItem(back.data.f601, back.data.f154, 0, -1),
                                zgb: tools_1["default"].quoteItem(back.data.f84, -1, 0, 4),
                                ltgb: tools_1["default"].quoteItem(back.data.f85, -1, 0, 4),
                                hsy: tools_1["default"].quoteItem(back.data.f168, back.data.f152, 0, -1, '%'),
                                mgsy_ttm: tools_1["default"].quoteItem(back.data.f108, -1, 0, -1, undefined, 2),
                                zsz: tools_1["default"].quoteItem(back.data.f116, -1, 0, 4),
                                zsz_short: tools_1["default"].quoteItem(back.data.f116, -1, 0, 2),
                                ltsz: tools_1["default"].quoteItem(back.data.f117, -1, 0, 4),
                                ltsz_short: tools_1["default"].quoteItem(back.data.f117, -1, 0, 2),
                                sjl: tools_1["default"].quoteItem(back.data.f167, back.data.f152, 0, -1),
                                syl_ttm: tools_1["default"].quoteItem(back.data.f164, back.data.f152, 0, -1),
                                jj: tools_1["default"].quoteItem(back.data.f71, back.data.f59, back.data.f71 - back.data.f60, -1),
                                mgjzc: tools_1["default"].quoteItem(back.data.f92, -1, 0, -1, undefined, 2),
                            };
                        }
                        else {
                            return null;
                        }
                    })];
            });
        });
    },
    /**
     * 沪深港通
     * @returns
     */
    hsgt: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, $.ajax({
                        url: web_1["default"].getUrl('quote_api') + 'api/qt/kamt/get?fields1=f1,f2,f3,f4&fields2=f51,f52,f53,f54&cb=?',
                        type: 'GET',
                        dataType: 'jsonp',
                        data: {
                            ut: ut
                        }
                    }).then(function (back) {
                        if (back === null || back === void 0 ? void 0 : back.data) {
                            return back.data;
                        }
                        return null;
                    }, function () {
                        return null;
                    })];
            });
        });
    },
    /**
     * 分时成交数据
     * @param quotecode
     * @returns
     */
    fscj: function (quotecode, size) {
        if (size === void 0) { size = 13; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, $.ajax({
                        url: web_1["default"].getUrl('quote_api') + 'api/qt/stock/details/get?fields1=f1,f2,f3,f4&fields2=f51,f52,f53,f54,f55&fltt=2&cb=?',
                        type: 'GET',
                        dataType: 'jsonp',
                        data: {
                            pos: '-' + (size + 1),
                            secid: quotecode,
                            ut: ut
                        }
                    }).then(function (back) {
                        if (back === null || back === void 0 ? void 0 : back.data) {
                            return tradeToData(back.data.details, back.data.prePrice).reverse().slice(0, size);
                        }
                        return [];
                    }, function () {
                        return [];
                    })];
            });
        });
    },
    /**
     * 分时成交推送数据
     * @param quotecode
     * @param size
     */
    fscj_sse: function (quotecode, callback, size) {
        if (size === void 0) { size = 13; }
        var backlist = [];
        var prePrice = 0;
        function dealData(data) {
            if ((data.full != 1 && data.full != 0) || !(data.data.details instanceof Array)) {
                return false;
            }
            if (data.full == 1) { //全量数据
                backlist = data.data.details;
                prePrice = data.data.prePrice;
            }
            if (data.full == 0) { //增量
                backlist = backlist.concat(data.data.details).slice(-(size + 1));
            }
            callback(tradeToData(backlist, prePrice).reverse().slice(0, size));
        }
        var url = web_1["default"].getUrl('quote_push_api') + "api/qt/stock/details/sse?fields1=f1,f2,f3,f4&fields2=f51,f52,f53,f54,f55&ut=bd1d9ddb04089700cf9c27f6f7426281&fltt=2&pos=-" + (size + 1) + "&secid=" + quotecode;
        var fscj_sse = new EventSource(url);
        fscj_sse.onmessage = function (e) {
            var data = JSON.parse(e.data);
            if (data.data != null)
                dealData(data);
        };
    },
    /**
     * 个股行情信息—推送
     * @param quotecode
     * @param callback
     */
    stockInfo_sse: function (quotecode, callback) {
        var quote_data = {};
        function dealData(data) {
            if (!data.data)
                return false;
            if (data.full == 1) { //全量数据
                quote_data = data.data;
            }
            if (data.full == 0) { //增量数据
                quote_data = Object.assign(quote_data, data.data);
            }
            var returndata = {
                name: quote_data.f58,
                code: quote_data.f57,
                price: tools_1["default"].quoteItem(quote_data.f43, quote_data.f59, quote_data.f169, -1),
                zde: tools_1["default"].quoteItem(quote_data.f169, quote_data.f59, quote_data.f169, -1),
                zdf: tools_1["default"].quoteItem(quote_data.f170, quote_data.f152, quote_data.f169, -1, '%'),
                jk: tools_1["default"].quoteItem(quote_data.f46, quote_data.f59, quote_data.f46 - quote_data.f60, -1),
                zs: tools_1["default"].quoteItem(quote_data.f60, quote_data.f59, 0, -1),
                high_price: tools_1["default"].quoteItem(quote_data.f44, quote_data.f59, quote_data.f44 - quote_data.f60, -1),
                low_price: tools_1["default"].quoteItem(quote_data.f45, quote_data.f59, quote_data.f45 - quote_data.f60, -1),
                cjl: tools_1["default"].quoteItem(quote_data.f47, -1, 0, 4),
                cje: tools_1["default"].quoteItem(quote_data.f48, -1, 0, 4),
                mrj: tools_1["default"].quoteItem(quote_data.f19, quote_data.f59, quote_data.f19 - quote_data.f60, -1),
                mcj: tools_1["default"].quoteItem(quote_data.f39, quote_data.f59, quote_data.f39 - quote_data.f60, -1),
                np: tools_1["default"].quoteItem(quote_data.f161, -1, -1, 4),
                wp: tools_1["default"].quoteItem(quote_data.f49, -1, 1, 4),
                zf: tools_1["default"].quoteItem(quote_data.f171, quote_data.f152, 0, -1, '%'),
                lb: tools_1["default"].quoteItem(quote_data.f50, quote_data.f152, 0, -1),
                jysj: tools_1["default"].transTradeTime(quote_data.f86),
                jybz: quote_data.f600,
                jybz_hy: tools_1["default"].quoteItem(quote_data.f601, quote_data.f154, 0, -1),
                zgb: tools_1["default"].quoteItem(quote_data.f84, -1, 0, 4),
                ltgb: tools_1["default"].quoteItem(quote_data.f85, -1, 0, 4),
                hsy: tools_1["default"].quoteItem(quote_data.f168, quote_data.f152, 0, -1, '%'),
                mgsy_ttm: tools_1["default"].quoteItem(quote_data.f108, -1, 0, -1, undefined, 2),
                zsz: tools_1["default"].quoteItem(quote_data.f116, -1, 0, 4),
                zsz_short: tools_1["default"].quoteItem(quote_data.f116, -1, 0, 2),
                ltsz: tools_1["default"].quoteItem(quote_data.f117, -1, 0, 4),
                ltsz_short: tools_1["default"].quoteItem(quote_data.f117, -1, 0, 2),
                sjl: tools_1["default"].quoteItem(quote_data.f167, quote_data.f152, 0, -1),
                syl_ttm: tools_1["default"].quoteItem(quote_data.f164, quote_data.f152, 0, -1),
                jj: tools_1["default"].quoteItem(quote_data.f71, quote_data.f59, quote_data.f71 - quote_data.f60, -1),
                mgjzc: tools_1["default"].quoteItem(quote_data.f92, -1, 0, -1, undefined, 2),
            };
            callback(returndata);
        }
        var url = web_1["default"].getUrl('quote_push_api') + "api/qt/stock/sse?fields=f19,f39,f43,f44,f45,f46,f47,f48,f49,f50,f57,f58,f59,f60,f71,f84,f85,f86,f92,f108,f116,f117,f152,f154,f161,f164,f167,f168,f169,f170,f171,f532,f600,f601&invt=2&fltt=1&secid=" + quotecode + "&ut=fa5fd1943c7b386f172d6893dbfba10b";
        var sse = new EventSource(url);
        sse.onmessage = function (e) {
            var data = JSON.parse(e.data);
            if (data.data != null)
                dealData(data);
        };
    }
};


/***/ }),

/***/ "./src/modules/scrolldom/animation_polifill.ts":
/*!*****************************************************!*\
  !*** ./src/modules/scrolldom/animation_polifill.ts ***!
  \*****************************************************/
/***/ (function(module) {

var define = false;
module.exports = (function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    var mywindow = window;
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = mywindow[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = mywindow[vendors[x] + 'CancelAnimationFrame'] || mywindow[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame)
        mywindow.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
}());


/***/ }),

/***/ "./src/modules/scrolldom/index.ts":
/*!****************************************!*\
  !*** ./src/modules/scrolldom/index.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
__webpack_require__(/*! ./animation_polifill */ "./src/modules/scrolldom/animation_polifill.ts");
var domScroll = /** @class */ (function () {
    function domScroll(opt) {
        this.element = ''; //滚动区域的id
        this.container = null;
        this.slider = null;
        this.run = true;
        this.animateId = 0;
        this.speedtime = 200;
        this.element = opt.element;
        this.speedtime = opt.speedtime;
        this.container = document.createElement('div');
        this.slider = document.createElement('div');
        this.init();
    }
    domScroll.prototype.init = function () {
        var width = 0;
        var _this = this;
        var element = this.element;
        var slider = this.slider;
        var container = this.container;
        slider.innerHTML = element.innerHTML;
        slider.style.cssText = 'float: left; overflow: hidden; zoom: 1;';
        container.appendChild(slider);
        element.innerHTML = '';
        element.appendChild(container);
        //获取元素真实宽度
        container.style.cssText = 'position: absolute !important; white-space:nowrap !important;visibility: hidden !important; left: 0';
        width = container.offsetWidth;
        container.style.cssText = '';
        container.style.width = width + 2 + 'px';
        container.onmouseover = function () {
            _this.run = false;
            cancelAnimationFrame(_this.animateId);
        };
        container.onmouseout = function () {
            _this.run = true;
            clearTimeout(_this.timer);
            _this.timer = setTimeout(function () {
                cancelAnimationFrame(_this.animateId);
                _this.animate();
            }, 200);
        };
    };
    ;
    /**
     * 启用动画
     * @returns {number} 动画ID
     */
    domScroll.prototype.animate = function () {
        var run = this.run;
        var element = this.element;
        var _this = this;
        _animate();
        return _this;
        function _animate() {
            if (!_this.run)
                return;
            _this.animateId = null;
            element.scrollLeft++;
            if (element.scrollLeft + element.clientWidth >= element.scrollWidth) {
                element.scrollLeft = 0;
            }
            _this.animateId = requestAnimationFrame(_animate);
        }
    };
    /**
     * 取消动画
     * @param {number} id 动画ID
     */
    domScroll.prototype.cancel = function (id) {
        var _this = this;
        cancelAnimationFrame(id || _this.animateId);
    };
    return domScroll;
}());
exports.default = domScroll;


/***/ }),

/***/ "./src/modules/scrollnotic/index.ts":
/*!******************************************!*\
  !*** ./src/modules/scrollnotic/index.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var scrolldom_1 = __importDefault(__webpack_require__(/*! ../scrolldom */ "./src/modules/scrolldom/index.ts")); //跑马灯
//sz123041特殊处理 
var noticeblock = {
    /**
     * @param curstock  当前code
     * @param datastr  期限
     * @param code  需处理的code
     */
    init: function (curstock, datastr, code) {
        var that = this;
        var curdate = that.getcurdate();
        if ((curdate < datastr || curdate == datastr) && curstock == code) {
            $("#tip-wrap-contain").show();
        }
        ;
        setTimeout(function () {
            var pmd = new scrolldom_1["default"]({
                element: $('#tip-scroll-wrap')[0],
                speedtime: 1500
            }).animate();
        }, 0);
        that.bindevent();
    },
    getcurdate: function () {
        var date = new Date();
        var back = "";
        var yy = date.getFullYear();
        var mm = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        var dd = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        back = yy + '' + mm + '' + dd;
        return back;
    },
    bindevent: function () {
        $("#notice-tip-icon").on("click", function (event) {
            event.stopPropagation();
            $("#notice-det-wrap").toggle();
            return false;
        });
        $("html").on("click", function (e) {
            var target = $(e.target);
            var tp = target.parents("#notice-det-wrap");
            if (!tp.length) {
                $("#notice-det-wrap").css({ "display": "none" });
            }
        });
    }
};
exports.default = noticeblock;


/***/ }),

/***/ "./src/modules/txt/index.ts":
/*!**********************************!*\
  !*** ./src/modules/txt/index.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

/**
 * 操作字符串
 */
exports.__esModule = true;
var txt = {
    /**
     * 字符串长度 一个汉字算2个
     *
     * @param {any} txt
     * @returns
     */
    txtLength: function (txt) {
        var thislength = 0;
        for (var i = 0; i < txt.length; i++) {
            if (txt.charCodeAt(i) > 255) {
                thislength += 2;
            }
            else {
                thislength++;
            }
        }
        return thislength;
    },
    /**
   * 字符串截取 (一个汉字算2个)
   *
   * @param {string} txt 输入文本
   * @param {int} n 截取多少个字 一个汉字算2个
   * @param {boolean} needtip 是否需要全文提示
   * @param {string} postfix 自定义截断后缀，默认...
   * @returns
   */
    txtLeft: function (txt, n, needtip, postfix) {
        if (needtip === void 0) { needtip = false; }
        if (postfix === void 0) { postfix = '...'; }
        if (txt == null || txt == "") {
            return "";
        }
        var thislength = 0;
        for (var i = 0; i < txt.length; i++) {
            if (txt.charCodeAt(i) > 255) {
                thislength += 2;
            }
            else {
                thislength++;
            }
            if (thislength > n) {
                if (needtip) {
                    return '<span title="' + txt + '">' + txt.substring(0, i) + postfix + "</span>";
                }
                else {
                    return txt.substring(0, i) + postfix;
                }
                break;
            }
        }
        return txt;
    },
    /**
     * 根据数字颜色化文字
     * @param text 文字
     * @param num 数字
     * @param hz 后缀
     */
    textNumColor: function (text, num, hz) {
        if (hz == undefined) {
            hz = '';
        }
        if (num == null || isNaN(num)) {
            return '<span class="quotenone">' + text + '</span>';
        }
        else {
            num = num / 1;
        }
        if (num > 0) {
            return '<span class="quoteup red">' + text + hz + '</span>';
        }
        else if (num < 0) {
            return '<span class="quotedown green">' + text + hz + '</span>';
        }
        else if (num == 0) {
            return '<span class="quotedraw">' + text + hz + '</span>';
        }
        else {
            return '<span class="quotenone">' + text + '</span>';
        }
    },
    /**
     * 对放大的行情数字缩小处理
     * @param number1
     * @param zoom
     */
    quoteNumZoomOut: function (number1, zoom) {
        if (number1 == null || number1 === '' || isNaN(number1) || zoom == null || zoom === '' || isNaN(zoom)) {
            return '-';
        }
        return (number1 / (Math.pow(10, zoom))).toFixed(zoom);
    },
    formatNum: function (num) {
        if (num == 0) {
            return num;
        }
        if (num == undefined || num === '' || isNaN(num)) {
            return '';
        }
        var hz = '';
        if (num >= 100000000 || num <= -100000000) {
            num = num / 100000000;
            hz = '亿';
        }
        else if (num >= 10000 || num <= -10000) {
            num = num / 10000;
            hz = '万';
        }
        else {
            return num;
        }
        var num2 = num.toFixed(2);
        // if(parseInt(num) >= 1000){ //整数部分超过4位
        //   num2 = num.toFixed(1);
        // }
        return num2.toString() + hz;
    },
    /**
     * 数字保留小数位数
     */
    numberWithFixed: function (num, fixnum) {
        if (isNaN(num) || num === '' || fixnum == undefined) {
            return num;
        }
        if (fixnum != undefined) {
            return parseFloat(num).toFixed(fixnum);
        }
    },
    /**
     * 百分比数字显示
     * @param num 数字
     * @param zoom 放大倍数
     * @param needformat 是否需要倍数显示
     */
    showPercentWithZoom: function (num, zoom, needformat) {
        if (isNaN(num) || num === '') {
            return num;
        }
        num = parseFloat(num) / (Math.pow(10, zoom));
        if (needformat) {
            if (num >= 1000 || num <= -1000) {
                return (num / 100).toFixed(zoom) + '倍';
            }
        }
        return num.toFixed(zoom) + '%';
    },
    /**
     * 显示放大倍数之后的正确数字,行情接口的放大逻辑，同时保留小数
     * @param num 数字
     * @param zoom 放大倍数
     * @param needformat 是否需要格式化
     */
    showNumberWithZoom: function (num, zoom, needformat) {
        if (isNaN(num) || num === '') {
            return num;
        }
        if (needformat) {
            return txt.formatNumWithFixed((parseFloat(num) / (Math.pow(10, zoom))), zoom);
        }
        return (parseFloat(num) / (Math.pow(10, zoom))).toFixed(zoom);
    },
    /**
     * 格式化数字
     * @param num
     */
    formatNumWithFixed: function (num, fixnum) {
        if (isNaN(num) || num === '') {
            return num;
        }
        var hz = '';
        if (num >= 100000000 || num <= -100000000) {
            num = num / 100000000;
            hz = '亿';
        }
        else if (num >= 10000 || num <= -10000) {
            num = num / 10000;
            hz = '万';
        }
        else {
            if (fixnum != undefined) {
                return parseFloat(num).toFixed(fixnum);
            }
            return num;
        }
        if (fixnum != undefined) {
            return parseFloat(num).toFixed(fixnum) + hz;
        }
        return num + hz;
    },
    /**
     * 格式化数字
     * @param num
     */
    formatNumWithFixedReturnData: function (num, fixnum) {
        if (isNaN(num) || num === '') {
            return {
                num: num,
                hz: ''
            };
        }
        var hz = '';
        if (num >= 100000000 || num <= -100000000) {
            num = num / 100000000;
            hz = '亿';
        }
        else if (num >= 10000 || num <= -10000) {
            num = num / 10000;
            hz = '万';
        }
        else {
            if (fixnum != undefined) {
                return {
                    num: parseFloat(num).toFixed(fixnum),
                    hz: ''
                };
            }
            return {
                num: num,
                hz: ''
            };
        }
        if (fixnum != undefined) {
            return {
                num: parseFloat(num).toFixed(fixnum),
                hz: hz
            };
        }
        return {
            num: num,
            hz: hz
        };
    },
    numToFixed: function (input, fixnum) {
        try {
            return input.toFixed(fixnum);
        }
        catch (error) {
            return input;
        }
    },
    /**
     * 全角转半角
     * @param str
     */
    ToCDB: function (str) {
        var tmp = "";
        for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) == 12288) {
                tmp += String.fromCharCode(str.charCodeAt(i) - 12256);
                continue;
            }
            if (str.charCodeAt(i) > 65280 && str.charCodeAt(i) < 65375) {
                tmp += String.fromCharCode(str.charCodeAt(i) - 65248);
            }
            else {
                tmp += String.fromCharCode(str.charCodeAt(i));
            }
        }
        return tmp;
    },
    /**
     * 全角转半角，并删除空白字符
     * @param str
     */
    ToCDBRemoveBlank: function (str) {
        str = this.ToCDB(str);
        return str.replace(/\s/g, '');
    },
    format: function (str) {
        var values = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            values[_i - 1] = arguments[_i];
        }
        if (values.length > 0) {
            for (var i = 0; i < values.length; i++) {
                if (values[i] != undefined) {
                    var reg = new RegExp("(\\{" + i + "\\})", "g");
                    str = str.replace(reg, values[i]);
                }
            }
        }
        return str;
    },
    /**
   * 控制宽度的格式化数字
   * @param num
   */
    formatNumMaxWidth: function (num, maxwidth) {
        if (maxwidth < 0) {
            return num;
        }
        if (isNaN(num) || num === '') {
            return num;
        }
        var hz = '';
        if (num >= 1000000000000 || num <= -100000000) {
            num = num / 1000000000000;
            hz = '万亿';
        }
        if (num >= 100000000 || num <= -100000000) {
            num = num / 100000000;
            hz = '亿';
        }
        else if (num >= 10000 || num <= -10000) {
            num = num / 10000;
            hz = '万';
        }
        //整数部分长度
        var zs_length = num.toString().indexOf('.');
        if (zs_length == -1) {
            return num + hz;
        }
        var fixed = maxwidth - zs_length;
        if (fixed < 0)
            fixed = 0;
        num = num.toFixed(fixed);
        return num + hz;
    },
};
exports.default = txt;


/***/ }),

/***/ "./src/modules/url/index.ts":
/*!**********************************!*\
  !*** ./src/modules/url/index.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

/**
 * url相关功能
 */
exports.__esModule = true;
exports.default = {
    /**
     * 获取url search参数
     * @param name 名称
     */
    getQuery: function (name) {
        var urlpara = location.search;
        var par = {};
        if (urlpara != "") {
            urlpara = urlpara.substring(1, urlpara.length);
            var para = urlpara.split("&");
            var parname;
            var parvalue;
            for (var i = 0; i < para.length; i++) {
                parname = para[i].substring(0, para[i].indexOf("="));
                parvalue = para[i].substring(para[i].indexOf("=") + 1, para[i].length);
                par[parname] = parvalue;
            }
        }
        if (typeof (par[name]) != "undefined") {
            return par[name];
        }
        else {
            return null;
        }
    }
};


/***/ }),

/***/ "./src/modules/user/index.ts":
/*!***********************************!*\
  !*** ./src/modules/user/index.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/**
 * 用户信息
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var cookie_1 = __importDefault(__webpack_require__(/*! ../cookie */ "./src/modules/cookie/index.ts"));
var thisuser = undefined;
/**
 * 用户
 */
var user = {
    /**
     * 获取用户信息
     */
    get: function () {
        if (thisuser != undefined)
            return thisuser;
        if (cookie_1["default"].get('ut') && cookie_1["default"].get('ct') && cookie_1["default"].get('uidal')) {
            thisuser = {
                id: cookie_1["default"].get('uidal').substring(0, 16),
                nick: cookie_1["default"].get('uidal').substring(16)
            };
        }
        else {
            thisuser = null;
        }
        return thisuser;
    },
    /**
     * 退出登录
     * @param  {function} 退出之后回调
     */
    logOut: function (callback) {
        var date = new Date();
        document.cookie = "pi=;path=/;domain=eastmoney.com;expires=" + date.toUTCString();
        document.cookie = "ct=;path=/;domain=eastmoney.com;expires=" + date.toUTCString();
        document.cookie = "ut=;path=/;domain=eastmoney.com;expires=" + date.toUTCString();
        document.cookie = "uidal=;path=/;domain=eastmoney.com;expires=" + date.toUTCString();
        if (callback) {
            callback();
        }
    },
    isLogin: function () {
        if (this.get()) {
            return true;
        }
        else {
            return false;
        }
    },
    /**
     * 跳转登录页面
     */
    goLoginPage: function () {
        self.location.href = "https://passport2.eastmoney.com/pub/login?backurl=" + encodeURIComponent(self.location.href);
    }
};
exports.default = user;


/***/ }),

/***/ "./src/modules/utils/index.ts":
/*!************************************!*\
  !*** ./src/modules/utils/index.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

/**
 * 实用工具
 */
exports.__esModule = true;
exports.default = {
    /**
     * 把新市场代码转换为旧市场代码
     * @param newmarket 新市场代码
     */
    converNewMarketToOldMarket: function (newmarket) {
        if (newmarket == 0) { //深圳
            return '2';
        }
        else if (newmarket == 1) { //上海
            return '1';
        }
        else if (newmarket == 90) { //沪深板块
            return '1';
        }
        return '';
    },
    /*
     *
     *@Title: 校验是否支持canvas
     *@description:
     *@return:
     *@author: qiuhongyang
     *@date: 2020-05-09 09:08:13
     *
    */
    checkCanvas: function () {
        var back = false;
        var tempcanvs = document.createElement('canvas');
        if (tempcanvs.getContext) {
            back = true;
        }
        return back;
    },
    /*
     *
     *@Title:   js
     *@params1: num  原始数据
     *@params2: suffix  后缀：如 %
     *@params3: tofix 保留的位数
     *@description:
     *@return:
     *@author: qiuhongyang
     *@date: 2020-06-09 10:37:03
     *
    */
    formatHqData: function (num, suffix, tofix) {
        var back = "";
        if (num === '' || num == null || num == undefined) {
            return back;
        }
        if (num == '-')
            return num;
        back = num;
        if (tofix === 0 || tofix) {
            back = back.toFixed(tofix);
        }
        if (suffix) {
            back = back + '' + suffix;
        }
        return back;
    },
    /**
     * css注入
    */
    addstyle: function (css) {
        var head = document.head || document.getElementsByTagName('head')[0], style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        }
        else {
            style.appendChild(document.createTextNode(css));
        }
        head.appendChild(style);
    }
};


/***/ }),

/***/ "./src/modules/browser_fingerprint/fingerprint2.js":
/*!*********************************************************!*\
  !*** ./src/modules/browser_fingerprint/fingerprint2.js ***!
  \*********************************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
* Fingerprintjs2 1.5.1 - Modern & flexible browser fingerprint library v2
* https://github.com/Valve/fingerprintjs2
* Copyright (c) 2015 Valentin Vasilyev (valentin.vasilyev@outlook.com)
* Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
* AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
* IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
* ARE DISCLAIMED. IN NO EVENT SHALL VALENTIN VASILYEV BE LIABLE FOR ANY
* DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
* (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
* LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
* ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
* (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
* THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

(function (name, context, definition) {
  "use strict";
  if (true) { !(__WEBPACK_AMD_DEFINE_FACTORY__ = (definition),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
		__WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); }
  else {}
})("Fingerprint2", this, function() {
  "use strict";
  var Fingerprint2 = function(options) {

    if (!(this instanceof Fingerprint2)) {
      return new Fingerprint2(options);
    }

    var defaultOptions = {
      swfContainerId: "fingerprintjs2",
      swfPath: "flash/compiled/FontList.swf",
      detectScreenOrientation: true,
      sortPluginsFor: [/palemoon/i],
      userDefinedFonts: []
    };
    this.options = this.extend(options, defaultOptions);
    this.nativeForEach = Array.prototype.forEach;
    this.nativeMap = Array.prototype.map;
  };
  Fingerprint2.prototype = {
    extend: function(source, target) {
      if (source == null) { return target; }
      for (var k in source) {
        if(source[k] != null && target[k] !== source[k]) {
          target[k] = source[k];
        }
      }
      return target;
    },
    get: function(done){
      var keys = [];
      keys = this.userAgentKey(keys);
      keys = this.languageKey(keys);
      keys = this.colorDepthKey(keys);
      keys = this.pixelRatioKey(keys);
      keys = this.hardwareConcurrencyKey(keys);
      keys = this.screenResolutionKey(keys);
      keys = this.availableScreenResolutionKey(keys);
      keys = this.timezoneOffsetKey(keys);
      keys = this.sessionStorageKey(keys);
      keys = this.localStorageKey(keys);
      keys = this.indexedDbKey(keys);
      keys = this.addBehaviorKey(keys);
      keys = this.openDatabaseKey(keys);
      keys = this.cpuClassKey(keys);
      keys = this.platformKey(keys);
      keys = this.doNotTrackKey(keys);
      keys = this.pluginsKey(keys);
      keys = this.canvasKey(keys);
      keys = this.webglKey(keys);
      keys = this.adBlockKey(keys);
      keys = this.hasLiedLanguagesKey(keys);
      keys = this.hasLiedResolutionKey(keys);
      keys = this.hasLiedOsKey(keys);
      keys = this.hasLiedBrowserKey(keys);
      keys = this.touchSupportKey(keys);
      keys = this.customEntropyFunction(keys);
      var that = this;
      this.fontsKey(keys, function(newKeys){
        var values = [];
        that.each(newKeys, function(pair) {
          var value = pair.value;
          if (typeof pair.value.join !== "undefined") {
            value = pair.value.join(";");
          }
          values.push(value);
        });
        var murmur = that.x64hash128(values.join("~~~"), 31);
        return done(murmur, newKeys);
      });
    },
    customEntropyFunction: function (keys) {
      if (typeof this.options.customFunction === "function") {
        keys.push({key: "custom", value: this.options.customFunction()});
      }
      return keys;
    },
    userAgentKey: function(keys) {
      if(!this.options.excludeUserAgent) {
        keys.push({key: "user_agent", value: this.getUserAgent()});
      }
      return keys;
    },
    // for tests
    getUserAgent: function(){
      return navigator.userAgent;
    },
    languageKey: function(keys) {
      if(!this.options.excludeLanguage) {
        // IE 9,10 on Windows 10 does not have the `navigator.language` property any longer
        keys.push({ key: "language", value: navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage || "" });
      }
      return keys;
    },
    colorDepthKey: function(keys) {
      if(!this.options.excludeColorDepth) {
        keys.push({key: "color_depth", value: screen.colorDepth || -1});
      }
      return keys;
    },
    pixelRatioKey: function(keys) {
      if(!this.options.excludePixelRatio) {
        keys.push({key: "pixel_ratio", value: this.getPixelRatio()});
      }
      return keys;
    },
    getPixelRatio: function() {
      return window.devicePixelRatio || "";
    },
    screenResolutionKey: function(keys) {
      if(!this.options.excludeScreenResolution) {
        return this.getScreenResolution(keys);
      }
      return keys;
    },
    getScreenResolution: function(keys) {
      var resolution;
      if(this.options.detectScreenOrientation) {
        resolution = (screen.height > screen.width) ? [screen.height, screen.width] : [screen.width, screen.height];
      } else {
        resolution = [screen.width, screen.height];
      }
      if(typeof resolution !== "undefined") { // headless browsers
        keys.push({key: "resolution", value: resolution});
      }
      return keys;
    },
    availableScreenResolutionKey: function(keys) {
      if (!this.options.excludeAvailableScreenResolution) {
        return this.getAvailableScreenResolution(keys);
      }
      return keys;
    },
    getAvailableScreenResolution: function(keys) {
      var available;
      if(screen.availWidth && screen.availHeight) {
        if(this.options.detectScreenOrientation) {
          available = (screen.availHeight > screen.availWidth) ? [screen.availHeight, screen.availWidth] : [screen.availWidth, screen.availHeight];
        } else {
          available = [screen.availHeight, screen.availWidth];
        }
      }
      if(typeof available !== "undefined") { // headless browsers
        keys.push({key: "available_resolution", value: available});
      }
      return keys;
    },
    timezoneOffsetKey: function(keys) {
      if(!this.options.excludeTimezoneOffset) {
        keys.push({key: "timezone_offset", value: new Date().getTimezoneOffset()});
      }
      return keys;
    },
    sessionStorageKey: function(keys) {
      if(!this.options.excludeSessionStorage && this.hasSessionStorage()) {
        keys.push({key: "session_storage", value: 1});
      }
      return keys;
    },
    localStorageKey: function(keys) {
      if(!this.options.excludeSessionStorage && this.hasLocalStorage()) {
        keys.push({key: "local_storage", value: 1});
      }
      return keys;
    },
    indexedDbKey: function(keys) {
      if(!this.options.excludeIndexedDB && this.hasIndexedDB()) {
        keys.push({key: "indexed_db", value: 1});
      }
      return keys;
    },
    addBehaviorKey: function(keys) {
      //body might not be defined at this point or removed programmatically
      if(document.body && !this.options.excludeAddBehavior && document.body.addBehavior) {
        keys.push({key: "add_behavior", value: 1});
      }
      return keys;
    },
    openDatabaseKey: function(keys) {
      if(!this.options.excludeOpenDatabase && window.openDatabase) {
        keys.push({key: "open_database", value: 1});
      }
      return keys;
    },
    cpuClassKey: function(keys) {
      if(!this.options.excludeCpuClass) {
        keys.push({key: "cpu_class", value: this.getNavigatorCpuClass()});
      }
      return keys;
    },
    platformKey: function(keys) {
      if(!this.options.excludePlatform) {
        keys.push({key: "navigator_platform", value: this.getNavigatorPlatform()});
      }
      return keys;
    },
    doNotTrackKey: function(keys) {
      if(!this.options.excludeDoNotTrack) {
        keys.push({key: "do_not_track", value: this.getDoNotTrack()});
      }
      return keys;
    },
    canvasKey: function(keys) {
      if(!this.options.excludeCanvas && this.isCanvasSupported()) {
        keys.push({key: "canvas", value: this.getCanvasFp()});
      }
      return keys;
    },
    webglKey: function(keys) {
      if(this.options.excludeWebGL) {
        return keys;
      }
      if(!this.isWebGlSupported()) {
        return keys;
      }
      keys.push({key: "webgl", value: this.getWebglFp()});
      return keys;
    },
    adBlockKey: function(keys){
      if(!this.options.excludeAdBlock) {
        keys.push({key: "adblock", value: this.getAdBlock()});
      }
      return keys;
    },
    hasLiedLanguagesKey: function(keys){
      if(!this.options.excludeHasLiedLanguages){
        keys.push({key: "has_lied_languages", value: this.getHasLiedLanguages()});
      }
      return keys;
    },
    hasLiedResolutionKey: function(keys){
      if(!this.options.excludeHasLiedResolution){
        keys.push({key: "has_lied_resolution", value: this.getHasLiedResolution()});
      }
      return keys;
    },
    hasLiedOsKey: function(keys){
      if(!this.options.excludeHasLiedOs){
        keys.push({key: "has_lied_os", value: this.getHasLiedOs()});
      }
      return keys;
    },
    hasLiedBrowserKey: function(keys){
      if(!this.options.excludeHasLiedBrowser){
        keys.push({key: "has_lied_browser", value: this.getHasLiedBrowser()});
      }
      return keys;
    },
    fontsKey: function(keys, done) {
      if (this.options.excludeJsFonts) {
        return this.flashFontsKey(keys, done);
      }
      return this.jsFontsKey(keys, done);
    },
    // flash fonts (will increase fingerprinting time 20X to ~ 130-150ms)
    flashFontsKey: function(keys, done) {
      if(this.options.excludeFlashFonts) {
        return done(keys);
      }
      // we do flash if swfobject is loaded
      if(!this.hasSwfObjectLoaded()){
        return done(keys);
      }
      if(!this.hasMinFlashInstalled()){
        return done(keys);
      }
      if(typeof this.options.swfPath === "undefined"){
        return done(keys);
      }
      this.loadSwfAndDetectFonts(function(fonts){
        keys.push({key: "swf_fonts", value: fonts.join(";")});
        done(keys);
      });
    },
    // kudos to http://www.lalit.org/lab/javascript-css-font-detect/
    jsFontsKey: function(keys, done) {
      var that = this;
      // doing js fonts detection in a pseudo-async fashion
      return setTimeout(function(){

        // a font will be compared against all the three default fonts.
        // and if it doesn't match all 3 then that font is not available.
        var baseFonts = ["monospace", "sans-serif", "serif"];

        var fontList = [
                        "Andale Mono", "Arial", "Arial Black", "Arial Hebrew", "Arial MT", "Arial Narrow", "Arial Rounded MT Bold", "Arial Unicode MS",
                        "Bitstream Vera Sans Mono", "Book Antiqua", "Bookman Old Style",
                        "Calibri", "Cambria", "Cambria Math", "Century", "Century Gothic", "Century Schoolbook", "Comic Sans", "Comic Sans MS", "Consolas", "Courier", "Courier New",
                        "Garamond", "Geneva", "Georgia",
                        "Helvetica", "Helvetica Neue",
                        "Impact",
                        "Lucida Bright", "Lucida Calligraphy", "Lucida Console", "Lucida Fax", "LUCIDA GRANDE", "Lucida Handwriting", "Lucida Sans", "Lucida Sans Typewriter", "Lucida Sans Unicode",
                        "Microsoft Sans Serif", "Monaco", "Monotype Corsiva", "MS Gothic", "MS Outlook", "MS PGothic", "MS Reference Sans Serif", "MS Sans Serif", "MS Serif", "MYRIAD", "MYRIAD PRO",
                        "Palatino", "Palatino Linotype",
                        "Segoe Print", "Segoe Script", "Segoe UI", "Segoe UI Light", "Segoe UI Semibold", "Segoe UI Symbol",
                        "Tahoma", "Times", "Times New Roman", "Times New Roman PS", "Trebuchet MS",
                        "Verdana", "Wingdings", "Wingdings 2", "Wingdings 3"
                      ];
        var extendedFontList = [
                        "Abadi MT Condensed Light", "Academy Engraved LET", "ADOBE CASLON PRO", "Adobe Garamond", "ADOBE GARAMOND PRO", "Agency FB", "Aharoni", "Albertus Extra Bold", "Albertus Medium", "Algerian", "Amazone BT", "American Typewriter",
                        "American Typewriter Condensed", "AmerType Md BT", "Andalus", "Angsana New", "AngsanaUPC", "Antique Olive", "Aparajita", "Apple Chancery", "Apple Color Emoji", "Apple SD Gothic Neo", "Arabic Typesetting", "ARCHER",
                         "ARNO PRO", "Arrus BT", "Aurora Cn BT", "AvantGarde Bk BT", "AvantGarde Md BT", "AVENIR", "Ayuthaya", "Bandy", "Bangla Sangam MN", "Bank Gothic", "BankGothic Md BT", "Baskerville",
                        "Baskerville Old Face", "Batang", "BatangChe", "Bauer Bodoni", "Bauhaus 93", "Bazooka", "Bell MT", "Bembo", "Benguiat Bk BT", "Berlin Sans FB", "Berlin Sans FB Demi", "Bernard MT Condensed", "BernhardFashion BT", "BernhardMod BT", "Big Caslon", "BinnerD",
                        "Blackadder ITC", "BlairMdITC TT", "Bodoni 72", "Bodoni 72 Oldstyle", "Bodoni 72 Smallcaps", "Bodoni MT", "Bodoni MT Black", "Bodoni MT Condensed", "Bodoni MT Poster Compressed",
                        "Bookshelf Symbol 7", "Boulder", "Bradley Hand", "Bradley Hand ITC", "Bremen Bd BT", "Britannic Bold", "Broadway", "Browallia New", "BrowalliaUPC", "Brush Script MT", "Californian FB", "Calisto MT", "Calligrapher", "Candara",
                        "CaslonOpnface BT", "Castellar", "Centaur", "Cezanne", "CG Omega", "CG Times", "Chalkboard", "Chalkboard SE", "Chalkduster", "Charlesworth", "Charter Bd BT", "Charter BT", "Chaucer",
                        "ChelthmITC Bk BT", "Chiller", "Clarendon", "Clarendon Condensed", "CloisterBlack BT", "Cochin", "Colonna MT", "Constantia", "Cooper Black", "Copperplate", "Copperplate Gothic", "Copperplate Gothic Bold",
                        "Copperplate Gothic Light", "CopperplGoth Bd BT", "Corbel", "Cordia New", "CordiaUPC", "Cornerstone", "Coronet", "Cuckoo", "Curlz MT", "DaunPenh", "Dauphin", "David", "DB LCD Temp", "DELICIOUS", "Denmark",
                        "DFKai-SB", "Didot", "DilleniaUPC", "DIN", "DokChampa", "Dotum", "DotumChe", "Ebrima", "Edwardian Script ITC", "Elephant", "English 111 Vivace BT", "Engravers MT", "EngraversGothic BT", "Eras Bold ITC", "Eras Demi ITC", "Eras Light ITC", "Eras Medium ITC",
                        "EucrosiaUPC", "Euphemia", "Euphemia UCAS", "EUROSTILE", "Exotc350 Bd BT", "FangSong", "Felix Titling", "Fixedsys", "FONTIN", "Footlight MT Light", "Forte",
                        "FrankRuehl", "Fransiscan", "Freefrm721 Blk BT", "FreesiaUPC", "Freestyle Script", "French Script MT", "FrnkGothITC Bk BT", "Fruitger", "FRUTIGER",
                        "Futura", "Futura Bk BT", "Futura Lt BT", "Futura Md BT", "Futura ZBlk BT", "FuturaBlack BT", "Gabriola", "Galliard BT", "Gautami", "Geeza Pro", "Geometr231 BT", "Geometr231 Hv BT", "Geometr231 Lt BT", "GeoSlab 703 Lt BT",
                        "GeoSlab 703 XBd BT", "Gigi", "Gill Sans", "Gill Sans MT", "Gill Sans MT Condensed", "Gill Sans MT Ext Condensed Bold", "Gill Sans Ultra Bold", "Gill Sans Ultra Bold Condensed", "Gisha", "Gloucester MT Extra Condensed", "GOTHAM", "GOTHAM BOLD",
                        "Goudy Old Style", "Goudy Stout", "GoudyHandtooled BT", "GoudyOLSt BT", "Gujarati Sangam MN", "Gulim", "GulimChe", "Gungsuh", "GungsuhChe", "Gurmukhi MN", "Haettenschweiler", "Harlow Solid Italic", "Harrington", "Heather", "Heiti SC", "Heiti TC", "HELV",
                        "Herald", "High Tower Text", "Hiragino Kaku Gothic ProN", "Hiragino Mincho ProN", "Hoefler Text", "Humanst 521 Cn BT", "Humanst521 BT", "Humanst521 Lt BT", "Imprint MT Shadow", "Incised901 Bd BT", "Incised901 BT",
                        "Incised901 Lt BT", "INCONSOLATA", "Informal Roman", "Informal011 BT", "INTERSTATE", "IrisUPC", "Iskoola Pota", "JasmineUPC", "Jazz LET", "Jenson", "Jester", "Jokerman", "Juice ITC", "Kabel Bk BT", "Kabel Ult BT", "Kailasa", "KaiTi", "Kalinga", "Kannada Sangam MN",
                        "Kartika", "Kaufmann Bd BT", "Kaufmann BT", "Khmer UI", "KodchiangUPC", "Kokila", "Korinna BT", "Kristen ITC", "Krungthep", "Kunstler Script", "Lao UI", "Latha", "Leelawadee", "Letter Gothic", "Levenim MT", "LilyUPC", "Lithograph", "Lithograph Light", "Long Island",
                        "Lydian BT", "Magneto", "Maiandra GD", "Malayalam Sangam MN", "Malgun Gothic",
                        "Mangal", "Marigold", "Marion", "Marker Felt", "Market", "Marlett", "Matisse ITC", "Matura MT Script Capitals", "Meiryo", "Meiryo UI", "Microsoft Himalaya", "Microsoft JhengHei", "Microsoft New Tai Lue", "Microsoft PhagsPa", "Microsoft Tai Le",
                        "Microsoft Uighur", "Microsoft YaHei", "Microsoft Yi Baiti", "MingLiU", "MingLiU_HKSCS", "MingLiU_HKSCS-ExtB", "MingLiU-ExtB", "Minion", "Minion Pro", "Miriam", "Miriam Fixed", "Mistral", "Modern", "Modern No. 20", "Mona Lisa Solid ITC TT", "Mongolian Baiti",
                        "MONO", "MoolBoran", "Mrs Eaves", "MS LineDraw", "MS Mincho", "MS PMincho", "MS Reference Specialty", "MS UI Gothic", "MT Extra", "MUSEO", "MV Boli",
                        "Nadeem", "Narkisim", "NEVIS", "News Gothic", "News GothicMT", "NewsGoth BT", "Niagara Engraved", "Niagara Solid", "Noteworthy", "NSimSun", "Nyala", "OCR A Extended", "Old Century", "Old English Text MT", "Onyx", "Onyx BT", "OPTIMA", "Oriya Sangam MN",
                        "OSAKA", "OzHandicraft BT", "Palace Script MT", "Papyrus", "Parchment", "Party LET", "Pegasus", "Perpetua", "Perpetua Titling MT", "PetitaBold", "Pickwick", "Plantagenet Cherokee", "Playbill", "PMingLiU", "PMingLiU-ExtB",
                        "Poor Richard", "Poster", "PosterBodoni BT", "PRINCETOWN LET", "Pristina", "PTBarnum BT", "Pythagoras", "Raavi", "Rage Italic", "Ravie", "Ribbon131 Bd BT", "Rockwell", "Rockwell Condensed", "Rockwell Extra Bold", "Rod", "Roman", "Sakkal Majalla",
                        "Santa Fe LET", "Savoye LET", "Sceptre", "Script", "Script MT Bold", "SCRIPTINA", "Serifa", "Serifa BT", "Serifa Th BT", "ShelleyVolante BT", "Sherwood",
                        "Shonar Bangla", "Showcard Gothic", "Shruti", "Signboard", "SILKSCREEN", "SimHei", "Simplified Arabic", "Simplified Arabic Fixed", "SimSun", "SimSun-ExtB", "Sinhala Sangam MN", "Sketch Rockwell", "Skia", "Small Fonts", "Snap ITC", "Snell Roundhand", "Socket",
                        "Souvenir Lt BT", "Staccato222 BT", "Steamer", "Stencil", "Storybook", "Styllo", "Subway", "Swis721 BlkEx BT", "Swiss911 XCm BT", "Sylfaen", "Synchro LET", "System", "Tamil Sangam MN", "Technical", "Teletype", "Telugu Sangam MN", "Tempus Sans ITC",
                        "Terminal", "Thonburi", "Traditional Arabic", "Trajan", "TRAJAN PRO", "Tristan", "Tubular", "Tunga", "Tw Cen MT", "Tw Cen MT Condensed", "Tw Cen MT Condensed Extra Bold",
                        "TypoUpright BT", "Unicorn", "Univers", "Univers CE 55 Medium", "Univers Condensed", "Utsaah", "Vagabond", "Vani", "Vijaya", "Viner Hand ITC", "VisualUI", "Vivaldi", "Vladimir Script", "Vrinda", "Westminster", "WHITNEY", "Wide Latin",
                        "ZapfEllipt BT", "ZapfHumnst BT", "ZapfHumnst Dm BT", "Zapfino", "Zurich BlkEx BT", "Zurich Ex BT", "ZWAdobeF"];

        if(that.options.extendedJsFonts) {
            fontList = fontList.concat(extendedFontList);
        }

        fontList = fontList.concat(that.options.userDefinedFonts);

        //we use m or w because these two characters take up the maximum width.
        // And we use a LLi so that the same matching fonts can get separated
        var testString = "mmmmmmmmmmlli";

        //we test using 72px font size, we may use any size. I guess larger the better.
        var testSize = "72px";

        var h = document.getElementsByTagName("body")[0];

        // div to load spans for the base fonts
        var baseFontsDiv = document.createElement("div");

        // div to load spans for the fonts to detect
        var fontsDiv = document.createElement("div");

        var defaultWidth = {};
        var defaultHeight = {};

        // creates a span where the fonts will be loaded
        var createSpan = function() {
            var s = document.createElement("span");
            /*
             * We need this css as in some weird browser this
             * span elements shows up for a microSec which creates a
             * bad user experience
             */
            s.style.position = "absolute";
            s.style.left = "-9999px";
            s.style.fontSize = testSize;
            s.style.lineHeight = "normal";
            s.innerHTML = testString;
            return s;
        };

        // creates a span and load the font to detect and a base font for fallback
        var createSpanWithFonts = function(fontToDetect, baseFont) {
            var s = createSpan();
            s.style.fontFamily = "'" + fontToDetect + "'," + baseFont;
            return s;
        };

        // creates spans for the base fonts and adds them to baseFontsDiv
        var initializeBaseFontsSpans = function() {
            var spans = [];
            for (var index = 0, length = baseFonts.length; index < length; index++) {
                var s = createSpan();
                s.style.fontFamily = baseFonts[index];
                baseFontsDiv.appendChild(s);
                spans.push(s);
            }
            return spans;
        };

        // creates spans for the fonts to detect and adds them to fontsDiv
        var initializeFontsSpans = function() {
            var spans = {};
            for(var i = 0, l = fontList.length; i < l; i++) {
                var fontSpans = [];
                for(var j = 0, numDefaultFonts = baseFonts.length; j < numDefaultFonts; j++) {
                    var s = createSpanWithFonts(fontList[i], baseFonts[j]);
                    fontsDiv.appendChild(s);
                    fontSpans.push(s);
                }
                spans[fontList[i]] = fontSpans; // Stores {fontName : [spans for that font]}
            }
            return spans;
        };

        // checks if a font is available
        var isFontAvailable = function(fontSpans) {
            var detected = false;
            for(var i = 0; i < baseFonts.length; i++) {
                detected = (fontSpans[i].offsetWidth !== defaultWidth[baseFonts[i]] || fontSpans[i].offsetHeight !== defaultHeight[baseFonts[i]]);
                if(detected) {
                    return detected;
                }
            }
            return detected;
        };

        // create spans for base fonts
        var baseFontsSpans = initializeBaseFontsSpans();

        // add the spans to the DOM
        h.appendChild(baseFontsDiv);

        // get the default width for the three base fonts
        for (var index = 0, length = baseFonts.length; index < length; index++) {
            defaultWidth[baseFonts[index]] = baseFontsSpans[index].offsetWidth; // width for the default font
            defaultHeight[baseFonts[index]] = baseFontsSpans[index].offsetHeight; // height for the default font
        }

        // create spans for fonts to detect
        var fontsSpans = initializeFontsSpans();

        // add all the spans to the DOM
        h.appendChild(fontsDiv);

        // check available fonts
        var available = [];
        for(var i = 0, l = fontList.length; i < l; i++) {
            if(isFontAvailable(fontsSpans[fontList[i]])) {
                available.push(fontList[i]);
            }
        }

        // remove spans from DOM
        h.removeChild(fontsDiv);
        h.removeChild(baseFontsDiv);

        keys.push({key: "js_fonts", value: available});
        done(keys);
      }, 1);
    },
    pluginsKey: function(keys) {
      if(!this.options.excludePlugins){
        if(this.isIE()){
          if(!this.options.excludeIEPlugins) {
            keys.push({key: "ie_plugins", value: this.getIEPlugins()});
          }
        } else {
          keys.push({key: "regular_plugins", value: this.getRegularPlugins()});
        }
      }
      return keys;
    },
    getRegularPlugins: function () {
      var plugins = [];
      for(var i = 0, l = navigator.plugins.length; i < l; i++) {
        plugins.push(navigator.plugins[i]);
      }
      // sorting plugins only for those user agents, that we know randomize the plugins
      // every time we try to enumerate them
      if(this.pluginsShouldBeSorted()) {
        plugins = plugins.sort(function(a, b) {
          if(a.name > b.name){ return 1; }
          if(a.name < b.name){ return -1; }
          return 0;
        });
      }
      return this.map(plugins, function (p) {
        var mimeTypes = this.map(p, function(mt){
          return [mt.type, mt.suffixes].join("~");
        }).join(",");
        return [p.name, p.description, mimeTypes].join("::");
      }, this);
    },
    getIEPlugins: function () {
      var result = [];
      if((Object.getOwnPropertyDescriptor && Object.getOwnPropertyDescriptor(window, "ActiveXObject")) || ("ActiveXObject" in window)) {
        var names = [
          "AcroPDF.PDF", // Adobe PDF reader 7+
          "Adodb.Stream",
          "AgControl.AgControl", // Silverlight
          "DevalVRXCtrl.DevalVRXCtrl.1",
          "MacromediaFlashPaper.MacromediaFlashPaper",
          "Msxml2.DOMDocument",
          "Msxml2.XMLHTTP",
          "PDF.PdfCtrl", // Adobe PDF reader 6 and earlier, brrr
          "QuickTime.QuickTime", // QuickTime
          "QuickTimeCheckObject.QuickTimeCheck.1",
          "RealPlayer",
          "RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)",
          "RealVideo.RealVideo(tm) ActiveX Control (32-bit)",
          "Scripting.Dictionary",
          "SWCtl.SWCtl", // ShockWave player
          "Shell.UIHelper",
          "ShockwaveFlash.ShockwaveFlash", //flash plugin
          "Skype.Detection",
          "TDCCtl.TDCCtl",
          "WMPlayer.OCX", // Windows media player
          "rmocx.RealPlayer G2 Control",
          "rmocx.RealPlayer G2 Control.1"
        ];
        // starting to detect plugins in IE
        result = this.map(names, function(name) {
          try {
            new ActiveXObject(name); // eslint-disable-no-new
            return name;
          } catch(e) {
            return null;
          }
        });
      }
      if(navigator.plugins) {
        result = result.concat(this.getRegularPlugins());
      }
      return result;
    },
    pluginsShouldBeSorted: function () {
      var should = false;
      for(var i = 0, l = this.options.sortPluginsFor.length; i < l; i++) {
        var re = this.options.sortPluginsFor[i];
        if(navigator.userAgent.match(re)) {
          should = true;
          break;
        }
      }
      return should;
    },
    touchSupportKey: function (keys) {
      if(!this.options.excludeTouchSupport){
        keys.push({key: "touch_support", value: this.getTouchSupport()});
      }
      return keys;
    },
    hardwareConcurrencyKey: function(keys){
      if(!this.options.excludeHardwareConcurrency){
        keys.push({key: "hardware_concurrency", value: this.getHardwareConcurrency()});
      }
      return keys;
    },
    hasSessionStorage: function () {
      try {
        return !!window.sessionStorage;
      } catch(e) {
        return true; // SecurityError when referencing it means it exists
      }
    },
    // https://bugzilla.mozilla.org/show_bug.cgi?id=781447
    hasLocalStorage: function () {
      try {
        return !!window.localStorage;
      } catch(e) {
        return true; // SecurityError when referencing it means it exists
      }
    },
    hasIndexedDB: function (){
      try {
        return !!window.indexedDB;
      } catch(e) {
        return true; // SecurityError when referencing it means it exists
      }
    },
    getHardwareConcurrency: function(){
      if(navigator.hardwareConcurrency){
        return navigator.hardwareConcurrency;
      }
      return "unknown";
    },
    getNavigatorCpuClass: function () {
      if(navigator.cpuClass){
        return navigator.cpuClass;
      } else {
        return "unknown";
      }
    },
    getNavigatorPlatform: function () {
      if(navigator.platform) {
        return navigator.platform;
      } else {
        return "unknown";
      }
    },
    getDoNotTrack: function () {
      if(navigator.doNotTrack) {
        return navigator.doNotTrack;
      } else if (navigator.msDoNotTrack) {
        return navigator.msDoNotTrack;
      } else if (window.doNotTrack) {
        return window.doNotTrack;
      } else {
        return "unknown";
      }
    },
    // This is a crude and primitive touch screen detection.
    // It's not possible to currently reliably detect the  availability of a touch screen
    // with a JS, without actually subscribing to a touch event.
    // http://www.stucox.com/blog/you-cant-detect-a-touchscreen/
    // https://github.com/Modernizr/Modernizr/issues/548
    // method returns an array of 3 values:
    // maxTouchPoints, the success or failure of creating a TouchEvent,
    // and the availability of the 'ontouchstart' property
    getTouchSupport: function () {
      var maxTouchPoints = 0;
      var touchEvent = false;
      if(typeof navigator.maxTouchPoints !== "undefined") {
        maxTouchPoints = navigator.maxTouchPoints;
      } else if (typeof navigator.msMaxTouchPoints !== "undefined") {
        maxTouchPoints = navigator.msMaxTouchPoints;
      }
      try {
        document.createEvent("TouchEvent");
        touchEvent = true;
      } catch(_) { /* squelch */ }
      var touchStart = "ontouchstart" in window;
      return [maxTouchPoints, touchEvent, touchStart];
    },
    // https://www.browserleaks.com/canvas#how-does-it-work
    getCanvasFp: function() {
      var result = [];
      // Very simple now, need to make it more complex (geo shapes etc)
      var canvas = document.createElement("canvas");
      canvas.width = 2000;
      canvas.height = 200;
      canvas.style.display = "inline";
      var ctx = canvas.getContext("2d");
      // detect browser support of canvas winding
      // http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
      // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas/winding.js
      ctx.rect(0, 0, 10, 10);
      ctx.rect(2, 2, 6, 6);
      result.push("canvas winding:" + ((ctx.isPointInPath(5, 5, "evenodd") === false) ? "yes" : "no"));

      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#f60";
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = "#069";
      // https://github.com/Valve/fingerprintjs2/issues/66
      if(this.options.dontUseFakeFontInCanvas) {
        ctx.font = "11pt Arial";
      } else {
        ctx.font = "11pt no-real-font-123";
      }
      ctx.fillText("Cwm fjordbank glyphs vext quiz, \ud83d\ude03", 2, 15);
      ctx.fillStyle = "rgba(102, 204, 0, 0.2)";
      ctx.font = "18pt Arial";
      ctx.fillText("Cwm fjordbank glyphs vext quiz, \ud83d\ude03", 4, 45);

      // canvas blending
      // http://blogs.adobe.com/webplatform/2013/01/28/blending-features-in-canvas/
      // http://jsfiddle.net/NDYV8/16/
      ctx.globalCompositeOperation = "multiply";
      ctx.fillStyle = "rgb(255,0,255)";
      ctx.beginPath();
      ctx.arc(50, 50, 50, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "rgb(0,255,255)";
      ctx.beginPath();
      ctx.arc(100, 50, 50, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "rgb(255,255,0)";
      ctx.beginPath();
      ctx.arc(75, 100, 50, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "rgb(255,0,255)";
      // canvas winding
      // http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
      // http://jsfiddle.net/NDYV8/19/
      ctx.arc(75, 75, 75, 0, Math.PI * 2, true);
      ctx.arc(75, 75, 25, 0, Math.PI * 2, true);
      ctx.fill("evenodd");

      result.push("canvas fp:" + canvas.toDataURL());
      return result.join("~");
    },

    getWebglFp: function() {
      var gl;
      var fa2s = function(fa) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        return "[" + fa[0] + ", " + fa[1] + "]";
      };
      var maxAnisotropy = function(gl) {
        var anisotropy, ext = gl.getExtension("EXT_texture_filter_anisotropic") || gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic") || gl.getExtension("MOZ_EXT_texture_filter_anisotropic");
        return ext ? (anisotropy = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT), 0 === anisotropy && (anisotropy = 2), anisotropy) : null;
      };
      gl = this.getWebglCanvas();
      if(!gl) { return null; }
      // WebGL fingerprinting is a combination of techniques, found in MaxMind antifraud script & Augur fingerprinting.
      // First it draws a gradient object with shaders and convers the image to the Base64 string.
      // Then it enumerates all WebGL extensions & capabilities and appends them to the Base64 string, resulting in a huge WebGL string, potentially very unique on each device
      // Since iOS supports webgl starting from version 8.1 and 8.1 runs on several graphics chips, the results may be different across ios devices, but we need to verify it.
      var result = [];
      var vShaderTemplate = "attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}";
      var fShaderTemplate = "precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}";
      var vertexPosBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
      var vertices = new Float32Array([-.2, -.9, 0, .4, -.26, 0, 0, .732134444, 0]);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
      vertexPosBuffer.itemSize = 3;
      vertexPosBuffer.numItems = 3;
      var program = gl.createProgram(), vshader = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(vshader, vShaderTemplate);
      gl.compileShader(vshader);
      var fshader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(fshader, fShaderTemplate);
      gl.compileShader(fshader);
      gl.attachShader(program, vshader);
      gl.attachShader(program, fshader);
      gl.linkProgram(program);
      gl.useProgram(program);
      program.vertexPosAttrib = gl.getAttribLocation(program, "attrVertex");
      program.offsetUniform = gl.getUniformLocation(program, "uniformOffset");
      gl.enableVertexAttribArray(program.vertexPosArray);
      gl.vertexAttribPointer(program.vertexPosAttrib, vertexPosBuffer.itemSize, gl.FLOAT, !1, 0, 0);
      gl.uniform2f(program.offsetUniform, 1, 1);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexPosBuffer.numItems);
      if (gl.canvas != null) { result.push(gl.canvas.toDataURL()); }
      result.push("extensions:" + gl.getSupportedExtensions().join(";"));
      result.push("webgl aliased line width range:" + fa2s(gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE)));
      result.push("webgl aliased point size range:" + fa2s(gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE)));
      result.push("webgl alpha bits:" + gl.getParameter(gl.ALPHA_BITS));
      result.push("webgl antialiasing:" + (gl.getContextAttributes().antialias ? "yes" : "no"));
      result.push("webgl blue bits:" + gl.getParameter(gl.BLUE_BITS));
      result.push("webgl depth bits:" + gl.getParameter(gl.DEPTH_BITS));
      result.push("webgl green bits:" + gl.getParameter(gl.GREEN_BITS));
      result.push("webgl max anisotropy:" + maxAnisotropy(gl));
      result.push("webgl max combined texture image units:" + gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS));
      result.push("webgl max cube map texture size:" + gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE));
      result.push("webgl max fragment uniform vectors:" + gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS));
      result.push("webgl max render buffer size:" + gl.getParameter(gl.MAX_RENDERBUFFER_SIZE));
      result.push("webgl max texture image units:" + gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS));
      result.push("webgl max texture size:" + gl.getParameter(gl.MAX_TEXTURE_SIZE));
      result.push("webgl max varying vectors:" + gl.getParameter(gl.MAX_VARYING_VECTORS));
      result.push("webgl max vertex attribs:" + gl.getParameter(gl.MAX_VERTEX_ATTRIBS));
      result.push("webgl max vertex texture image units:" + gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS));
      result.push("webgl max vertex uniform vectors:" + gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS));
      result.push("webgl max viewport dims:" + fa2s(gl.getParameter(gl.MAX_VIEWPORT_DIMS)));
      result.push("webgl red bits:" + gl.getParameter(gl.RED_BITS));
      result.push("webgl renderer:" + gl.getParameter(gl.RENDERER));
      result.push("webgl shading language version:" + gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
      result.push("webgl stencil bits:" + gl.getParameter(gl.STENCIL_BITS));
      result.push("webgl vendor:" + gl.getParameter(gl.VENDOR));
      result.push("webgl version:" + gl.getParameter(gl.VERSION));

      try {
        // Add the unmasked vendor and unmasked renderer if the debug_renderer_info extension is available
        var extensionDebugRendererInfo = gl.getExtension("WEBGL_debug_renderer_info");
        if (extensionDebugRendererInfo) {
          result.push("webgl unmasked vendor:" + gl.getParameter(extensionDebugRendererInfo.UNMASKED_VENDOR_WEBGL));
          result.push("webgl unmasked renderer:" + gl.getParameter(extensionDebugRendererInfo.UNMASKED_RENDERER_WEBGL));
        }
      } catch(e) { /* squelch */ }

      if (!gl.getShaderPrecisionFormat) {
        return result.join("~");
      }

      result.push("webgl vertex shader high float precision:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT ).precision);
      result.push("webgl vertex shader high float precision rangeMin:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT ).rangeMin);
      result.push("webgl vertex shader high float precision rangeMax:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT ).rangeMax);
      result.push("webgl vertex shader medium float precision:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT ).precision);
      result.push("webgl vertex shader medium float precision rangeMin:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT ).rangeMin);
      result.push("webgl vertex shader medium float precision rangeMax:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT ).rangeMax);
      result.push("webgl vertex shader low float precision:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_FLOAT ).precision);
      result.push("webgl vertex shader low float precision rangeMin:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_FLOAT ).rangeMin);
      result.push("webgl vertex shader low float precision rangeMax:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_FLOAT ).rangeMax);
      result.push("webgl fragment shader high float precision:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT ).precision);
      result.push("webgl fragment shader high float precision rangeMin:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT ).rangeMin);
      result.push("webgl fragment shader high float precision rangeMax:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT ).rangeMax);
      result.push("webgl fragment shader medium float precision:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT ).precision);
      result.push("webgl fragment shader medium float precision rangeMin:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT ).rangeMin);
      result.push("webgl fragment shader medium float precision rangeMax:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT ).rangeMax);
      result.push("webgl fragment shader low float precision:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT ).precision);
      result.push("webgl fragment shader low float precision rangeMin:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT ).rangeMin);
      result.push("webgl fragment shader low float precision rangeMax:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT ).rangeMax);
      result.push("webgl vertex shader high int precision:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT ).precision);
      result.push("webgl vertex shader high int precision rangeMin:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT ).rangeMin);
      result.push("webgl vertex shader high int precision rangeMax:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT ).rangeMax);
      result.push("webgl vertex shader medium int precision:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_INT ).precision);
      result.push("webgl vertex shader medium int precision rangeMin:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_INT ).rangeMin);
      result.push("webgl vertex shader medium int precision rangeMax:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_INT ).rangeMax);
      result.push("webgl vertex shader low int precision:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_INT ).precision);
      result.push("webgl vertex shader low int precision rangeMin:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_INT ).rangeMin);
      result.push("webgl vertex shader low int precision rangeMax:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_INT ).rangeMax);
      result.push("webgl fragment shader high int precision:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT ).precision);
      result.push("webgl fragment shader high int precision rangeMin:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT ).rangeMin);
      result.push("webgl fragment shader high int precision rangeMax:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT ).rangeMax);
      result.push("webgl fragment shader medium int precision:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_INT ).precision);
      result.push("webgl fragment shader medium int precision rangeMin:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_INT ).rangeMin);
      result.push("webgl fragment shader medium int precision rangeMax:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_INT ).rangeMax);
      result.push("webgl fragment shader low int precision:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_INT ).precision);
      result.push("webgl fragment shader low int precision rangeMin:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_INT ).rangeMin);
      result.push("webgl fragment shader low int precision rangeMax:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_INT ).rangeMax);
      return result.join("~");
    },
    getAdBlock: function(){
      var ads = document.createElement("div");
      ads.innerHTML = "&nbsp;";
      ads.className = "adsbox";
      var result = false;
      try {
        // body may not exist, that's why we need try/catch
        document.body.appendChild(ads);
        result = document.getElementsByClassName("adsbox")[0].offsetHeight === 0;
        document.body.removeChild(ads);
      } catch (e) {
        result = false;
      }
      return result;
    },
    getHasLiedLanguages: function(){
      //We check if navigator.language is equal to the first language of navigator.languages
      if(typeof navigator.languages !== "undefined"){
        try {
          var firstLanguages = navigator.languages[0].substr(0, 2);
          if(firstLanguages !== navigator.language.substr(0, 2)){
            return true;
          }
        } catch(err) {
          return true;
        }
      }
      return false;
    },
    getHasLiedResolution: function(){
      if(screen.width < screen.availWidth){
        return true;
      }
      if(screen.height < screen.availHeight){
        return true;
      }
      return false;
    },
    getHasLiedOs: function(){
      var userAgent = navigator.userAgent.toLowerCase();
      var oscpu = navigator.oscpu;
      var platform = navigator.platform.toLowerCase();
      var os;
      //We extract the OS from the user agent (respect the order of the if else if statement)
      if(userAgent.indexOf("windows phone") >= 0){
        os = "Windows Phone";
      } else if(userAgent.indexOf("win") >= 0){
        os = "Windows";
      } else if(userAgent.indexOf("android") >= 0){
        os = "Android";
      } else if(userAgent.indexOf("linux") >= 0){
        os = "Linux";
      } else if(userAgent.indexOf("iphone") >= 0 || userAgent.indexOf("ipad") >= 0 ){
        os = "iOS";
      } else if(userAgent.indexOf("mac") >= 0){
        os = "Mac";
      } else{
        os = "Other";
      }
      // We detect if the person uses a mobile device
      var mobileDevice;
      if (("ontouchstart" in window) ||
           (navigator.maxTouchPoints > 0) ||
           (navigator.msMaxTouchPoints > 0)) {
            mobileDevice = true;
      } else{
        mobileDevice = false;
      }

      if(mobileDevice && os !== "Windows Phone" && os !== "Android" && os !== "iOS" && os !== "Other"){
        return true;
      }

      // We compare oscpu with the OS extracted from the UA
      if(typeof oscpu !== "undefined"){
        oscpu = oscpu.toLowerCase();
        if(oscpu.indexOf("win") >= 0 && os !== "Windows" && os !== "Windows Phone"){
          return true;
        } else if(oscpu.indexOf("linux") >= 0 && os !== "Linux" && os !== "Android"){
          return true;
        } else if(oscpu.indexOf("mac") >= 0 && os !== "Mac" && os !== "iOS"){
          return true;
        } else if(oscpu.indexOf("win") === 0 && oscpu.indexOf("linux") === 0 && oscpu.indexOf("mac") >= 0 && os !== "other"){
          return true;
        }
      }

      //We compare platform with the OS extracted from the UA
      if(platform.indexOf("win") >= 0 && os !== "Windows" && os !== "Windows Phone"){
        return true;
      } else if((platform.indexOf("linux") >= 0 || platform.indexOf("android") >= 0 || platform.indexOf("pike") >= 0) && os !== "Linux" && os !== "Android"){
        return true;
      } else if((platform.indexOf("mac") >= 0 || platform.indexOf("ipad") >= 0 || platform.indexOf("ipod") >= 0 || platform.indexOf("iphone") >= 0) && os !== "Mac" && os !== "iOS"){
        return true;
      } else if(platform.indexOf("win") === 0 && platform.indexOf("linux") === 0 && platform.indexOf("mac") >= 0 && os !== "other"){
        return true;
      }

      if(typeof navigator.plugins === "undefined" && os !== "Windows" && os !== "Windows Phone"){
        //We are are in the case where the person uses ie, therefore we can infer that it's windows
        return true;
      }

      return false;
    },
    getHasLiedBrowser: function () {
      var userAgent = navigator.userAgent.toLowerCase();
      var productSub = navigator.productSub;

      //we extract the browser from the user agent (respect the order of the tests)
      var browser;
      if(userAgent.indexOf("firefox") >= 0){
        browser = "Firefox";
      } else if(userAgent.indexOf("opera") >= 0 || userAgent.indexOf("opr") >= 0){
        browser = "Opera";
      } else if(userAgent.indexOf("chrome") >= 0){
        browser = "Chrome";
      } else if(userAgent.indexOf("safari") >= 0){
        browser = "Safari";
      } else if(userAgent.indexOf("trident") >= 0){
        browser = "Internet Explorer";
      } else{
        browser = "Other";
      }

      if((browser === "Chrome" || browser === "Safari" || browser === "Opera") && productSub !== "20030107"){
        return true;
      }

      var tempRes = eval.toString().length;
      if(tempRes === 37 && browser !== "Safari" && browser !== "Firefox" && browser !== "Other"){
        return true;
      } else if(tempRes === 39 && browser !== "Internet Explorer" && browser !== "Other"){
        return true;
      } else if(tempRes === 33 && browser !== "Chrome" && browser !== "Opera" && browser !== "Other"){
        return true;
      }

      //We create an error to see how it is handled
      var errFirefox;
      try {
        throw "a";
      } catch(err){
        try{
          err.toSource();
          errFirefox = true;
        } catch(errOfErr){
          errFirefox = false;
        }
      }
      if(errFirefox && browser !== "Firefox" && browser !== "Other"){
        return true;
      }
      return false;
    },
    isCanvasSupported: function () {
      var elem = document.createElement("canvas");
      return !!(elem.getContext && elem.getContext("2d"));
    },
    isWebGlSupported: function() {
      // code taken from Modernizr
      if (!this.isCanvasSupported()) {
        return false;
      }

      var canvas = document.createElement("canvas"),
          glContext;

      try {
        glContext = canvas.getContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
      } catch(e) {
        glContext = false;
      }

      return !!window.WebGLRenderingContext && !!glContext;
    },
    isIE: function () {
      if(navigator.appName === "Microsoft Internet Explorer") {
        return true;
      } else if(navigator.appName === "Netscape" && /Trident/.test(navigator.userAgent)) { // IE 11
        return true;
      }
      return false;
    },
    hasSwfObjectLoaded: function(){
      return typeof window.swfobject !== "undefined";
    },
    hasMinFlashInstalled: function () {
      return swfobject.hasFlashPlayerVersion("9.0.0");
    },
    addFlashDivNode: function() {
      var node = document.createElement("div");
      node.setAttribute("id", this.options.swfContainerId);
      document.body.appendChild(node);
    },
    loadSwfAndDetectFonts: function(done) {
      var hiddenCallback = "___fp_swf_loaded";
      window[hiddenCallback] = function(fonts) {
        done(fonts);
      };
      var id = this.options.swfContainerId;
      this.addFlashDivNode();
      var flashvars = { onReady: hiddenCallback};
      var flashparams = { allowScriptAccess: "always", menu: "false" };
      swfobject.embedSWF(this.options.swfPath, id, "1", "1", "9.0.0", false, flashvars, flashparams, {});
    },
    getWebglCanvas: function() {
      var canvas = document.createElement("canvas");
      var gl = null;
      try {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      } catch(e) { /* squelch */ }
      if (!gl) { gl = null; }
      return gl;
    },
    each: function (obj, iterator, context) {
      if (obj === null) {
        return;
      }
      if (this.nativeForEach && obj.forEach === this.nativeForEach) {
        obj.forEach(iterator, context);
      } else if (obj.length === +obj.length) {
        for (var i = 0, l = obj.length; i < l; i++) {
          if (iterator.call(context, obj[i], i, obj) === {}) { return; }
        }
      } else {
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (iterator.call(context, obj[key], key, obj) === {}) { return; }
          }
        }
      }
    },

    map: function(obj, iterator, context) {
      var results = [];
      // Not using strict equality so that this acts as a
      // shortcut to checking for `null` and `undefined`.
      if (obj == null) { return results; }
      if (this.nativeMap && obj.map === this.nativeMap) { return obj.map(iterator, context); }
      this.each(obj, function(value, index, list) {
        results[results.length] = iterator.call(context, value, index, list);
      });
      return results;
    },

    /// MurmurHash3 related functions

    //
    // Given two 64bit ints (as an array of two 32bit ints) returns the two
    // added together as a 64bit int (as an array of two 32bit ints).
    //
    x64Add: function(m, n) {
      m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
      n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
      var o = [0, 0, 0, 0];
      o[3] += m[3] + n[3];
      o[2] += o[3] >>> 16;
      o[3] &= 0xffff;
      o[2] += m[2] + n[2];
      o[1] += o[2] >>> 16;
      o[2] &= 0xffff;
      o[1] += m[1] + n[1];
      o[0] += o[1] >>> 16;
      o[1] &= 0xffff;
      o[0] += m[0] + n[0];
      o[0] &= 0xffff;
      return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
    },

    //
    // Given two 64bit ints (as an array of two 32bit ints) returns the two
    // multiplied together as a 64bit int (as an array of two 32bit ints).
    //
    x64Multiply: function(m, n) {
      m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
      n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
      var o = [0, 0, 0, 0];
      o[3] += m[3] * n[3];
      o[2] += o[3] >>> 16;
      o[3] &= 0xffff;
      o[2] += m[2] * n[3];
      o[1] += o[2] >>> 16;
      o[2] &= 0xffff;
      o[2] += m[3] * n[2];
      o[1] += o[2] >>> 16;
      o[2] &= 0xffff;
      o[1] += m[1] * n[3];
      o[0] += o[1] >>> 16;
      o[1] &= 0xffff;
      o[1] += m[2] * n[2];
      o[0] += o[1] >>> 16;
      o[1] &= 0xffff;
      o[1] += m[3] * n[1];
      o[0] += o[1] >>> 16;
      o[1] &= 0xffff;
      o[0] += (m[0] * n[3]) + (m[1] * n[2]) + (m[2] * n[1]) + (m[3] * n[0]);
      o[0] &= 0xffff;
      return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
    },
    //
    // Given a 64bit int (as an array of two 32bit ints) and an int
    // representing a number of bit positions, returns the 64bit int (as an
    // array of two 32bit ints) rotated left by that number of positions.
    //
    x64Rotl: function(m, n) {
      n %= 64;
      if (n === 32) {
        return [m[1], m[0]];
      }
      else if (n < 32) {
        return [(m[0] << n) | (m[1] >>> (32 - n)), (m[1] << n) | (m[0] >>> (32 - n))];
      }
      else {
        n -= 32;
        return [(m[1] << n) | (m[0] >>> (32 - n)), (m[0] << n) | (m[1] >>> (32 - n))];
      }
    },
    //
    // Given a 64bit int (as an array of two 32bit ints) and an int
    // representing a number of bit positions, returns the 64bit int (as an
    // array of two 32bit ints) shifted left by that number of positions.
    //
    x64LeftShift: function(m, n) {
      n %= 64;
      if (n === 0) {
        return m;
      }
      else if (n < 32) {
        return [(m[0] << n) | (m[1] >>> (32 - n)), m[1] << n];
      }
      else {
        return [m[1] << (n - 32), 0];
      }
    },
    //
    // Given two 64bit ints (as an array of two 32bit ints) returns the two
    // xored together as a 64bit int (as an array of two 32bit ints).
    //
    x64Xor: function(m, n) {
      return [m[0] ^ n[0], m[1] ^ n[1]];
    },
    //
    // Given a block, returns murmurHash3's final x64 mix of that block.
    // (`[0, h[0] >>> 1]` is a 33 bit unsigned right shift. This is the
    // only place where we need to right shift 64bit ints.)
    //
    x64Fmix: function(h) {
      h = this.x64Xor(h, [0, h[0] >>> 1]);
      h = this.x64Multiply(h, [0xff51afd7, 0xed558ccd]);
      h = this.x64Xor(h, [0, h[0] >>> 1]);
      h = this.x64Multiply(h, [0xc4ceb9fe, 0x1a85ec53]);
      h = this.x64Xor(h, [0, h[0] >>> 1]);
      return h;
    },

    //
    // Given a string and an optional seed as an int, returns a 128 bit
    // hash using the x64 flavor of MurmurHash3, as an unsigned hex.
    //
    x64hash128: function (key, seed) {
      key = key || "";
      seed = seed || 0;
      var remainder = key.length % 16;
      var bytes = key.length - remainder;
      var h1 = [0, seed];
      var h2 = [0, seed];
      var k1 = [0, 0];
      var k2 = [0, 0];
      var c1 = [0x87c37b91, 0x114253d5];
      var c2 = [0x4cf5ad43, 0x2745937f];
      for (var i = 0; i < bytes; i = i + 16) {
        k1 = [((key.charCodeAt(i + 4) & 0xff)) | ((key.charCodeAt(i + 5) & 0xff) << 8) | ((key.charCodeAt(i + 6) & 0xff) << 16) | ((key.charCodeAt(i + 7) & 0xff) << 24), ((key.charCodeAt(i) & 0xff)) | ((key.charCodeAt(i + 1) & 0xff) << 8) | ((key.charCodeAt(i + 2) & 0xff) << 16) | ((key.charCodeAt(i + 3) & 0xff) << 24)];
        k2 = [((key.charCodeAt(i + 12) & 0xff)) | ((key.charCodeAt(i + 13) & 0xff) << 8) | ((key.charCodeAt(i + 14) & 0xff) << 16) | ((key.charCodeAt(i + 15) & 0xff) << 24), ((key.charCodeAt(i + 8) & 0xff)) | ((key.charCodeAt(i + 9) & 0xff) << 8) | ((key.charCodeAt(i + 10) & 0xff) << 16) | ((key.charCodeAt(i + 11) & 0xff) << 24)];
        k1 = this.x64Multiply(k1, c1);
        k1 = this.x64Rotl(k1, 31);
        k1 = this.x64Multiply(k1, c2);
        h1 = this.x64Xor(h1, k1);
        h1 = this.x64Rotl(h1, 27);
        h1 = this.x64Add(h1, h2);
        h1 = this.x64Add(this.x64Multiply(h1, [0, 5]), [0, 0x52dce729]);
        k2 = this.x64Multiply(k2, c2);
        k2 = this.x64Rotl(k2, 33);
        k2 = this.x64Multiply(k2, c1);
        h2 = this.x64Xor(h2, k2);
        h2 = this.x64Rotl(h2, 31);
        h2 = this.x64Add(h2, h1);
        h2 = this.x64Add(this.x64Multiply(h2, [0, 5]), [0, 0x38495ab5]);
      }
      k1 = [0, 0];
      k2 = [0, 0];
      switch(remainder) {
        case 15:
          k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 14)], 48));
        case 14:
          k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 13)], 40));
        case 13:
          k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 12)], 32));
        case 12:
          k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 11)], 24));
        case 11:
          k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 10)], 16));
        case 10:
          k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 9)], 8));
        case 9:
          k2 = this.x64Xor(k2, [0, key.charCodeAt(i + 8)]);
          k2 = this.x64Multiply(k2, c2);
          k2 = this.x64Rotl(k2, 33);
          k2 = this.x64Multiply(k2, c1);
          h2 = this.x64Xor(h2, k2);
        case 8:
          k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 7)], 56));
        case 7:
          k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 6)], 48));
        case 6:
          k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 5)], 40));
        case 5:
          k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 4)], 32));
        case 4:
          k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 3)], 24));
        case 3:
          k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 2)], 16));
        case 2:
          k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 1)], 8));
        case 1:
          k1 = this.x64Xor(k1, [0, key.charCodeAt(i)]);
          k1 = this.x64Multiply(k1, c1);
          k1 = this.x64Rotl(k1, 31);
          k1 = this.x64Multiply(k1, c2);
          h1 = this.x64Xor(h1, k1);
      }
      h1 = this.x64Xor(h1, [0, key.length]);
      h2 = this.x64Xor(h2, [0, key.length]);
      h1 = this.x64Add(h1, h2);
      h2 = this.x64Add(h2, h1);
      h1 = this.x64Fmix(h1);
      h2 = this.x64Fmix(h2);
      h1 = this.x64Add(h1, h2);
      h2 = this.x64Add(h2, h1);
      return ("00000000" + (h1[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (h1[1] >>> 0).toString(16)).slice(-8) + ("00000000" + (h2[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (h2[1] >>> 0).toString(16)).slice(-8);
    }
  };
  Fingerprint2.VERSION = "1.5.1";
  return Fingerprint2;
});


/***/ }),

/***/ "./src/modules/old_concept/components/companyprofile/profile.js":
/*!**********************************************************************!*\
  !*** ./src/modules/old_concept/components/companyprofile/profile.js ***!
  \**********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "jquery");
var utils = __webpack_require__(/*! ../../modules/utils */ "./src/modules/old_concept/modules/utils.js");
var template = __webpack_require__(/*! ../../modules/template-web */ "./src/modules/old_concept/modules/template-web.js");
var popup = __webpack_require__(/*! ../popup/popup */ "./src/modules/old_concept/components/popup/popup.js");
var biz_popup = __webpack_require__(/*! ./business.popup.art */ "./src/modules/old_concept/components/companyprofile/business.popup.art");
// require('./profile.css');

module.exports = profile;

function profile(args) {
    var self = this;
    this.options = $.extend({
        entry: window.profileentry,
        stockinfo: window.stockentry,
        company: {
            container: '#company-profile',
            template: '<p><span>{{corpSummary | cutstr 200}}</span><a class="detail" href="javascript:void(0);">【详细】</a></p>'
        },
        business: {
            container: '#business-profile',
            template: '<p><span>{{businessRange| cutstr 200}}</span><a class="detail" href="javascript:void(0);">【详细】</a></p>'
        }
    }, args);
    this.container = {
        company: $(this.options.company.container),
        business: $(this.options.business.container)
    }
    this.companyRender = template.compile(this.options.company.template);
    this.businessRender = template.compile(this.options.business.template);
}

profile.prototype.load = function () {
    return this.companyLoader().businessLoader();
}

profile.prototype.companyLoader = function () {
    try {
        var self = this;
        if (!this.options.entry.company || !this.options.entry.company.corpSummary) return this;
        var $company = $(this.companyRender(this.options.entry.company));
        var link = 'http://emweb.securities.eastmoney.com/CompanySurvey/Index?type=web&code=' + self.options.stockinfo.market + self.options.stockinfo.code;
        var tips = new popup({
            title: template.render('{{name}}公司简介', self.options.stockinfo),
            content: self.options.entry.company.corpSummary,
            css: 'company-profile',
            confirm: '<a href="' + link + '" target="_blank" class="showModal-confirm">点击查看更多</a>',
            destroy: false
        });
        $('a.detail', $company).click(function (e) {
            tips.show();
            return false;
        });
        $(this.container.company).html($company);
    } catch (e) {
        console.error(e);
    }
    return this;
}
profile.colors = ['#29a3e3', '#ffa83a', '#e65b41', '#fb3030', '#ffd33a', '#0074e6', '#2806f5', '#7106f5', '#af06f5', '#ff803a'];
profile.prototype.businessLoader = function () {
    try {
        var self = this;
        var $business = $(this.businessRender(this.options.entry.company));
        var models = $.extend({
            colors: profile.colors,
            businessRange: this.options.entry.company.businessRange
        }, this.options.entry.business);
        // if (!this.options.entry.business.rdate) return this;
        if (!_.has(this, 'options.entry.business.rdate')) return this;
        var $popup = $(template.render(biz_popup, models)),
            chart_loaded = false;
        $('a.detail', $business).click(function (e) {
            var link = 'http://emweb.securities.eastmoney.com/BusinessAnalysis/Index?type=web&code=' + self.options.stockinfo.market + self.options.stockinfo.code;
            var pop = new popup({
                title: template.render('{{name}}业务介绍', self.options.stockinfo),
                content: $popup,
                css: 'business-profile',
                confirm: '<a href="' + link + '" target="_blank" class="showModal-confirm">点击查看更多</a>'
            }).show();
            if (!chart_loaded) loadPieChart.apply(self);
            chart_loaded = true;
            pop.repositioning();
            return false;
        });
        $(this.container.business).html($business);
    } catch (e) {
        console.error(e)
    }
    return this;
}

function loadPieChart() {
    var option = {
        width: 380,
        height: 240,
        radiusIn: 20
        // radiusOut: 100,
        // radiusHover: 108
    };
    this.pies = {};
    var constitutes = this.options.entry.business.constitutes;
    for (var i = 0; i < constitutes.length; i++) {
        var kv = constitutes[i];
        var _opt = $.extend({}, option, {
            container: '#' + kv.key + '-chart'
        });
        var pie = this.pies[kv.key] = new emcharts3.pie(_opt);
        pie.start();
        var data = [],
            tpl = '<table class="chart-tips">' +
            '<tr><td>主营收入（元）</td><td>{{MainIncome| numbericFormat}}</td></tr>' +
            '<tr><td>收入比例</td><td>{{IncomeRatio| percentRender 2}}</td></tr>' +
            '{{if MainCost}}<tr><td>主营成本（元）</td><td>{{MainCost| numbericFormat}}</td></tr>{{/if}}' +
            '{{if MainProfit}}<tr><td>主营利润（元）</td><td>{{MainProfit| numbericFormat}}</td></tr>{{/if}}' +
            '{{if ProfitRatio}}<tr><td>毛利率</td><td>{{ProfitRatio| percentRender 2}}</td></tr>{{/if}}' +
            '</table>';
        for (var j = 0; j < kv.value.length && j < 10; j++) {
            var element = kv.value[j];
            if (!element || !element.MainIncome) continue;
            data.push({
                name: element.mainForm,
                data: Math.abs(element.MainIncome),
                color: profile.colors[j],
                type: Math.abs(element.IncomeRatio) < 10 ? 'out' : 'in',
                popContent: template.render(tpl, element),
            });
        }
        pie.setData({
            data: data
        });
        pie.stop();
    }
}

/***/ }),

/***/ "./src/modules/old_concept/components/customfields/main.js":
/*!*****************************************************************!*\
  !*** ./src/modules/old_concept/components/customfields/main.js ***!
  \*****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "jquery");
var popup = __webpack_require__(/*! ../popup/popup */ "./src/modules/old_concept/components/popup/popup.js");
// var fieldscfg = require('./quotefields.cfg.json');
var fieldscfgnew = __webpack_require__(/*! ./quotefileds.cfg */ "./src/modules/old_concept/components/customfields/quotefileds.cfg.js");
var template = __webpack_require__(/*! ../../modules/template-web */ "./src/modules/old_concept/modules/template-web.js");
var tpl = __webpack_require__(/*! ./customfields.art */ "./src/modules/old_concept/components/customfields/customfields.art");
var supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
var eventName =  supportsTouch ? 'touchstart' : 'click'; 
// require('./customfields.css');
//判断是否是创业板
var iscyb = stockentry.jys;  //f112 == 80  (f107 == 0 && f111 == 80)
var fieldscfg = fieldscfgnew.fields;

if (iscyb == "80") { 
    fieldscfg = fieldscfgnew.cybfields;
};

function fieldsRender(options) {
    var _opt = $.extend({
        container: '#quote-fields',
        maxcount: 15, 
        tpl: tpl,
        storageKey: 'quote-custom-fields',
        onfieldsloading: null,
        onsaving: null
    }, options);
    var fields = [],
        self = this;
    
    //创业板领取storekey
    if (iscyb == "80"){
        _opt.storageKey = 'quotecyb-custom-fields'
    };
    
    var qfs = loadcfg(_opt.storageKey);
    if (!qfs) {
        fields = fieldscfg.defaultfields;
        save();
    } else fields = qfs.split(',');
    var render = template.compile(_opt.tpl);
    var load = this.load = function () {
        var configs = [];
        for (var i = 0; i < fields.length; i++) {
            var key = fields[i],
                cfg = fieldscfg.fields[key];
            if (cfg && cfg.show !== false) {
                configs.push(cfg);
                cfg.key = key;
            }
        }
        var html = render({
                configs: configs
            }),
            $dom = $(html);
        $('.icon-delData', $dom).click(function (e) {
            var idx = $(this).data('idx');
            fields.splice(idx, 1);
            self.load();
            self.save();
            return false;
        });
        $(_opt.container).html($dom);
        showadd.apply(this);
        if (typeof _opt.onfieldsloading === 'function') {
            _opt.onfieldsloading.apply(self, [fields, _opt]);
        }
    };
    this.fields = fields;
    this.save = save;


    function loadcfg(key) {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            console.error(e);
        }
        return false;
    }
    /**
     * 保存字段修改
     */
    function save() {
        try {
            if (typeof onsaving === 'function') {
                onsaving.apply(self, [fields, _opt.storageKey, _opt]);
            }
            localStorage.setItem(_opt.storageKey, fields.join(','));
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * 显示加号逻辑
     */
    function showadd() {
        if (fields.length < _opt.maxcount && $('.btn-add', $(_opt.container)).length <= 0) {
            $add = $('<td class="btn-add"><span class="add-data">+</span></td>').click(function (e) {
                var $dom = $('<ul class="clearfix"></ul>');
                var tpl = '{{each cfgs}}<li data-key="{{$value.id}}" class="showModal-list {{$value.show}}">{{$value.title || $value.label}}</li>{{/each}}';
                var models = [];
                var iscyb = stockentry.jys;  //f112 == 80  (f107 == 0 && f111 == 80)
                // 区分创业板20200616
                if (iscyb ==" 80"){ 

                };
                for (var key in fieldscfg.fields) {
                    if (fieldscfg.fields.hasOwnProperty(key)) {
                        var cfg = fieldscfg.fields[key];
                        if (!cfg || cfg.show === false) continue;
                        models.push({
                            id: key,
                            show: fields.indexOf(key) >= 0 ? 'select-li' : '',
                            label: cfg.label,
                            title: cfg.title
                        });
                    }
                }
                $dom.html(template.render(tpl, {
                    cfgs: models
                }));
                if (!supportsTouch){
                    $('.showModal-list', $dom).hover(function(){
                        $(this).addClass('hover');
                    },function () {  
                        $(this).removeClass('hover');
                    });
                }
                
                $('.showModal-list', $dom).click(function (e) {
                    if ($(this).hasClass('select-li')) {
                        var key = $(this).data('key'),
                            index = fields.indexOf(key);
                        fields.splice(index, 1);
                        $(this).removeClass('select-li');
                    } else {
                        if (_opt.maxcount > 0 && fields.length >= _opt.maxcount) {
                            var key = fields.pop();
                            $('[data-key=' + key + ']', $dom).removeClass('select-li');
                        }
                        fields.push($(this).data('key'));
                        $(this).addClass('select-li');
                    }
                    return false;
                });
                new popup({
                    title: '添加行情数据',
                    content: $dom,
                    onconfirm: function (container) {
                        $(_opt.container).html('');
                        save.apply(self);
                        self.load();
                        container.remove();
                        return false;
                    }
                }).show();
                return false;
            });
            if ($('table tr', _opt.container).length > 0 && $('table tr:last td', _opt.container).length < 5) {
                $('table tr:last', _opt.container).append($add);
            } else {
                var $tr = $('<tr></tr>').html($add);
                $('table', _opt.container).append($tr);
            }
        }
    }
}

module.exports = fieldsRender;

/***/ }),

/***/ "./src/modules/old_concept/components/customfields/quotefileds.cfg.js":
/*!****************************************************************************!*\
  !*** ./src/modules/old_concept/components/customfields/quotefileds.cfg.js ***!
  \****************************************************************************/
/***/ (function(module) {

/*
 *
 *@description:
 *@modifyContent: 区分创业板和其它
 *@author: qiuhongyang
 *@date: 2020-06-16 17:20:24
 *
*/
var fields = {
    "fields": {
        "close": {
            "label": "最新",
                "width": "",
                    "css": ""
        },
        "averagePrice": {
            "id": "quote-avg",
                "label": "均价",
                    "width": "",
                        "css": ""
        },
        "volume": {
            "label": "成交量",
                "width": "",
                    "css": ""
        },
        "open": {
            "label": "今开",
                "width": "",
                    "css": ""
        },
        "previousClose": {
            "id": "quote-pc",
                "label": "昨收",
                    "width": "",
                        "css": ""
        },
        "amount": {
            "label": "成交额",
                "width": "",
                    "css": ""
        },
        "high": {
            "label": "最高",
                "width": "",
                    "css": ""
        },
        "low": {
            "label": "最低",
                "width": "",
                    "css": ""
        },
        "raisePrice": {
            "label": "涨停价",
                "width": "",
                    "css": ""
        },
        "fallPrice": {
            "label": "跌停价",
                "width": "",
                    "css": ""
        },
        "volumeRate": {
            "label": "量比"
        },
        "turnoverRate": {
            "label": "换手率"
        },
        "amplitude": {
            "label": "振幅"
        },
        "sellOrder": {
            "label": "内盘"
        },
        "buyOrder": {
            "label": "外盘"
        },
        "flowCapital": {
            "label": "流通股本"
        },
        "totalShare": {
            "label": "总股本"
        },
        "flowCapitalValue": {
            "label": "流通市值"
        },
        "marketValue": {
            "label": "总市值"
        },
        "PB": {
            "label": "市净率"
        },
        "PERation": {
            "label": "市盈率(动)",
                "title": "动态市盈率",
                    "titleTips": "动态市盈率，总市值除以全年预估净利润，例如当前一季度净利润1000万，则预估全年净利润4000万"
        },
        "staticPERation": {
            "label": "市盈率(静)",
                "title": "静态市盈率",
                    "titleTips": "静态市盈率，总市值除以上一年度净利润"
        },
        "RollingPERations": {
            "label": "市盈率(TTM)",
                "title": "滚动市盈率",
                    "titleTips": "滚动市盈率，最新价除以最近4个季度的每股收益"
        },
        "EPS": {
            "label": "每股收益"
        },
        "NAPS": {
            "label": "NAVPS",
                "title": "每股净资产"
        },
        "StageChange52-Highest": {
            "id": "quote-52highest-custom",
                "label": "52周最高"
        },
        "StageChange52-Lowest": {
            "id": "quote-52lowest-custom",
                "label": "52周最低"
        },
        "BalFlowInOriginal": {
            "label": "主力流入"
        },
        "BalFlowOutOriginal": {
            "label": "主力流出"
        },
        "ChangeStartPrice20Day": {
            "id": "quote-20cp-custom",
                "label": "20日涨幅"
        },
        "ChangeStartPrice60Day": {
            "id": "quote-60cp-custom",
                "label": "60日涨幅"
        },
        "ChangeStartPrice360Day": {
            "id": "quote-360cp-custom",
                "label": "今年以来",
                    "title": "今年以来涨跌幅"
        },
        "sell": {
            "show": false,
                "label": "市销率",
                    "title": "市销率TTM"
        },
        "cash": {
            "show": false,
                "label": "市现率",
                    "title": "市现率TTM"
        }
    },
    "defaultfields": [
        "close", "averagePrice", "volume",
        "open", "previousClose", "amount",
        "high", "low", "raisePrice", "fallPrice",
        "volumeRate", "turnoverRate", "amplitude",
        "PERation"
    ]
}

var cybfields = {
    "fields": {
        "close": {
            "label": "最新",
            "width": "",
            "css": ""
        },
        "averagePrice": {
            "id": "quote-avg",
            "label": "均价",
            "width": "",
            "css": ""
        },
        "volume": {
            "label": "成交量",
            "width": "",
            "css": ""
        },
        "open": {
            "label": "今开",
            "width": "",
            "css": ""
        },
        "previousClose": {
            "id": "quote-pc",
            "label": "昨收",
            "width": "",
            "css": ""
        },
        "amount": {
            "label": "成交额",
            "width": "",
            "css": ""
        },
        "high": {
            "label": "最高",
            "width": "",
            "css": ""
        },
        "low": {
            "label": "最低",
            "width": "",
            "css": ""
        },
        "raisePrice": {
            "label": "涨停价",
            "width": "",
            "css": ""
        },
        "fallPrice": {
            "label": "跌停价",
            "width": "",
            "css": ""
        },
        "volumeRate": {
            "label": "量比"
        },
        "turnoverRate": {
            "label": "换手率"
        },
        "amplitude": {
            "label": "振幅"
        },
        "sellOrder": {
            "label": "内盘"
        },
        "buyOrder": {
            "label": "外盘"
        },
        "flowCapital": {
            "label": "流通股本"
        },
        "totalShare": {
            "label": "总股本"
        },
        "flowCapitalValue": {
            "label": "流通市值"
        },
        "marketValue": {
            "label": "总市值"
        },
        "PB": {
            "label": "市净率"
        },
        "PERation": {
            "label": "市盈率(动)",
            "title": "动态市盈率",
            "titleTips": "动态市盈率，总市值除以全年预估净利润，例如当前一季度净利润1000万，则预估全年净利润4000万"
        },
        "staticPERation": {
            "label": "市盈率(静)",
            "title": "静态市盈率",
            "titleTips": "静态市盈率，总市值除以上一年度净利润"
        },
        "RollingPERations": {
            "label": "市盈率(TTM)",
            "title": "滚动市盈率",
            "titleTips": "滚动市盈率，最新价除以最近4个季度的每股收益"
        },
        "EPS": {
            "label": "每股收益"
        },
        "NAPS": {
            "label": "NAVPS",
            "title": "每股净资产"
        },
        "StageChange52-Highest": {
            "id": "quote-52highest-custom",
            "label": "52周最高"
        },
        "StageChange52-Lowest": {
            "id": "quote-52lowest-custom",
            "label": "52周最低"
        },
        "BalFlowInOriginal": {
            "label": "主力流入"
        },
        "BalFlowOutOriginal": {
            "label": "主力流出"
        },
        "ChangeStartPrice20Day": {
            "id": "quote-20cp-custom",
            "label": "20日涨幅"
        },
        "ChangeStartPrice60Day": {
            "id": "quote-60cp-custom",
            "label": "60日涨幅"
        },
        "ChangeStartPrice360Day": {
            "id": "quote-360cp-custom",
            "label": "今年以来",
            "title": "今年以来涨跌幅"
        },
        "sell": {
            "show": false,
            "label": "市销率",
            "title": "市销率TTM"
        },
        "cash": {
            "show": false,
            "label": "市现率",
            "title": "市现率TTM"
        },
        "IsZCZ": {
            "show": true,
            "label": "是否注册制",
            "title": "是否注册制",
            "titleTips": "公司是否以注册制方式进行上市"
        },
        "IsXYJG": {
            "show": true,
            "label": "协议控制架构",
            "title": "协议控制架构",
            "titleTips": "公司是否具有协议控制架构"
        },
        // "IsTGTQ": {
        //     "show": true,
        //     "label": "同股同权",
        //     "title": "同股同权",
        //     "titleTips": "公司是否具有表决权差异安排"
        // },
        "IsBJCY": {
            "show": true,
            "label": "表决差异",
            "title": "表决差异",
            "titleTips": "公司是否具有表决权差异安排"
        },
        "IsYL": {
            "show": true,
            "label": "是否盈利",
            "title": "是否盈利",
            "titleTips": "公司当前是否盈利"
        }
    },
    "defaultfields": [
        "averagePrice", "volume","open", "previousClose", "amount",
        "high", "low", "raisePrice", "fallPrice",
        "RollingPERations", "IsZCZ", "IsXYJG",
        "IsTGTQ","IsYL"
    ]
}

module.exports = {
    fields: fields,
    cybfields: cybfields
}

/***/ }),

/***/ "./src/modules/old_concept/components/dragbox/dragbox.cfg.json":
/*!*********************************************************************!*\
  !*** ./src/modules/old_concept/components/dragbox/dragbox.cfg.json ***!
  \*********************************************************************/
/***/ (function(module) {

"use strict";
module.exports = JSON.parse('{"companydigest":{"type":"公司基本资料","default":true,"title":"公司核心数据","linktpl":"http://data.eastmoney.com/stockdata/{{code}}.html"},"largeshareholders":{"type":"公司基本资料","default":true,"title":"股本结构","unit":"万股","css":"gbjg-box","linktpl":"http://emweb.securities.eastmoney.com/f10_v2/CapitalStockStructure.aspx?type=web&code={{shortmarket}}{{code}}"},"relatedboards":{"type":"行业信息","default":true,"title":"所属板块","css":"bk-list"},"relatedstocks":{"type":"行业信息","default":true,"label":"相关个股","titletpl":"<b>|{{board.name|cutstr 8}}|</b>相关个股","linktpl":"//quote.eastmoney.com/web/{{board.id}}.html"},"profittrend":{"type":"财务数据","default":true,"title":"利润趋势","linktpl":"http://data.eastmoney.com/stockdata/{{code}}.html#cwsj"},"capitalflow":{"type":"行情数据","default":true,"title":"资金流向","linktpl":"http://data.eastmoney.com/zjlx/{{code}}.html"},"stagechange":{"type":"行情数据","default":true,"title":"阶段涨幅"},"stockcalendar":{"type":"重大事项提醒","default":true,"title":"大事提醒","linktpl":"http://data.eastmoney.com/stockcalendar/{{code}}.html"},"industrynews":{"type":"行业信息","default":true,"title":"行业资讯","linktpl":"http://stock.eastmoney.com/hangye/hy{{board.code.replace(\'BK0\',\'\')}}.html","css":"article-list-cnt"},"stocknotice":{"type":"资讯公告","default":true,"title":"公司公告","css":"article-list-cnt","linktpl":"http://data.eastmoney.com/notices/stock/{{code}}.html"},"stocknews":{"type":"资讯公告","default":true,"title":"个股资讯","titletpl":"","link":"","linktpl":"http://so.eastmoney.com/News/s?keyword={{name | encodeURIComponent}}","css":"article-list-cnt","loader":""}}');

/***/ }),

/***/ "./src/modules/old_concept/components/dragbox/jquery-dad/jquery.dad.js":
/*!*****************************************************************************!*\
  !*** ./src/modules/old_concept/components/dragbox/jquery-dad/jquery.dad.js ***!
  \*****************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/*!
 * jquery.dad.js v1 (http://konsolestudio.com/dad)
 * Author William Lima
 */
module.exports = (function ($, throttle) {
  'use strict';
  var supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;

  $.fn.dad = function (opts) {
    var _this = this;

    var defaults = {
      target: '>div',
      draggable: false,
      placeholder: '',
      callback: false,
      containerClass: 'dad-container',
      childrenClass: 'dads-children',
      cloneClass: 'dads-children-clone',
      active: true,
    };

    var options = $.extend({}, defaults, opts);

    $(this).each(function () {
      var active = options.active;
      var $daddy = $(this);
      var childrenClass = options.childrenClass;
      var cloneClass = options.cloneClass;
      var jQclass = '.' + childrenClass;
      var $target = $daddy.find(options.target);
      var placeholder = options.placeholder;
      var callback = options.callback;
      var dragClass = 'dad-draggable-area';
      var holderClass = 'dads-children-placeholder';

      // HANDLE MOUSE
      var mouse = {
        x: 0,
        y: 0,
        target: false,
        clone: false,
        placeholder: false,
        cloneoffset: {
          x: 0,
          y: 0,
        },
        updatePosition: function (e) {
          this.x = e.pageX;
          this.y = e.pageY;
        },

        move: function (e) {
          this.updatePosition(e);
          if (this.clone !== false && _this.target !== false) {
            this.clone.css({
              left: this.x - this.cloneoffset.x,
              top: this.y - this.cloneoffset.y,
            });
          }
        },
      };
      var fun_move;
      $(window).on('mousemove touchmove', throttle(function (e) {
        var ev = e;

        if (mouse.clone !== false && mouse.target !== false) e.preventDefault();

        if (supportsTouch && e.type == 'touchmove') {
          ev = e.originalEvent.touches[0];
          var mouseTarget = document.elementFromPoint(ev.clientX, ev.clientY);

          $(mouseTarget).trigger('touchenter');
        }

        mouse.move(ev);
      }, 50));

      $daddy.addClass(options.containerClass);

      if (!$daddy.hasClass('dad-active') && active === true) {
        $daddy.addClass('dad-active');
      };

      _this.addDropzone = function (selector, func) {
        $(selector).on('mouseenter touchenter', function () {
          if (mouse.target !== false) {
            mouse.placeholder.css({
              display: 'none'
            });
            mouse.target.css({
              display: 'none'
            });
            $(this).addClass('active');
          }
        }).on('mouseup touchend', function () {
          if (mouse.target != false) {
            mouse.placeholder.css({
              display: 'block'
            });
            mouse.target.css({
              display: 'block'
            });
            func(mouse.target);
            dadEnd();
          };

          $(this).removeClass('active');
        }).on('mouseleave touchleave', function () {
          if (mouse.target !== false) {
            mouse.placeholder.css({
              display: 'block'
            });
            mouse.target.css({
              display: 'block'
            });
          }

          $(this).removeClass('active');
        });
      };

      // GET POSITION FUNCTION
      _this.getPosition = function () {
        var positionArray = [];
        $(this).find(jQclass).each(function () {
          positionArray[$(this).data('dad-id')] = parseInt($(this).data('dad-position'));
        });

        return positionArray;
      };

      _this.activate = function () {
        active = true;
        if (!$daddy.hasClass('dad-active')) {
          $daddy.addClass('dad-active');
        }

        return _this;
      };

      // DEACTIVATE FUNCTION
      _this.deactivate = function () {
        active = false;
        $daddy.removeClass('dad-active');
        return _this;
      };

      // DEFAULT DROPPING
      $daddy.on('DOMNodeInserted', function (e) {
        var $thisTarget = $(e.target);
        if ($thisTarget.parent().is($(this)) && !$thisTarget.hasClass(childrenClass) && !$thisTarget.hasClass(holderClass)) {
          var $draggable = $thisTarget.find(options.draggable !== false ? options.draggable : jQclass);
          if ($draggable.length > 0) {
            $thisTarget.addClass(childrenClass);
            $draggable.addClass(dragClass);
          }

        }
      });
      $daddy.on('DOMNodeRemoved', function (e) {
        updatePosition($daddy);
      });
      $(document).on('mouseup touchend', function () {
        dadEnd();
      });

      // ORDER ELEMENTS
      var order = 1;
      $target.addClass(childrenClass).each(function () {
        if ($(this).data('dad-id') == undefined) {
          $(this).attr('data-dad-id', order);
        }

        $(this).attr('data-dad-position', order).data('dad-position', order);
        order++;
      });

      // CREATE REORDER FUNCTION
      function updatePosition(e) {
        var order = 1;
        e.find(jQclass).each(function () {
          $(this).attr('data-dad-position', order).data('dad-position', order);
          order++;
        });
      }

      // END EVENT
      function dadEnd() {
        if (mouse.target != false && mouse.clone != false) {
          if (typeof callback === 'function') {
            callback.call(_this, mouse.target);
          }

          var appear = mouse.target;
          var desappear = mouse.clone;
          var holder = mouse.placeholder;
          var bLeft = 0;
          var bTop = 0;

          // Maybe we will use this in the future
          //Math.floor(parseFloat($daddy.css('border-left-width')));
          //Math.floor(parseFloat($daddy.css('border-top-width')));
          if ($.contains($daddy[0], mouse.target[0])) {
            mouse.clone.animate({
              top: mouse.target.offset().top - $daddy.offset().top - bTop,
              left: mouse.target.offset().left - $daddy.offset().left - bLeft,
            }, 300, function () {
              appear.css({
                visibility: 'visible',
              }).removeClass('active');
              desappear.remove();
            });
          } else {
            mouse.clone.fadeOut(300, function () {
              desappear.remove();
            });
          }

          holder.remove();
          mouse.clone = false;
          mouse.placeholder = false;
          mouse.target = false;
          updatePosition($daddy);
        }

        $('html, body').removeClass('dad-noSelect');
      }

      // UPDATE EVENT
      function dadUpdate(obj) {
        if (mouse.target !== false && mouse.clone !== false) {
          var $origin = $('<span style="display:none"></span>');
          var $newplace = $('<span style="display:none"></span>');

          if (obj.prevAll().hasClass('active')) {
            obj.after($newplace);
          } else {
            obj.before($newplace);
          }

          mouse.target.before($origin);
          $newplace.before(mouse.target);

          // UPDATE PLACEHOLDER
          mouse.placeholder.css({
            top: mouse.target.offset().top - $daddy.offset().top,
            left: mouse.target.offset().left - $daddy.offset().left,
            width: mouse.target.outerWidth() - 10,
            height: mouse.target.outerHeight() - 10,
          });

          $origin.remove();
          $newplace.remove();
        }
      }

      // GRABBING EVENT
      var jq = (options.draggable !== false) ? options.draggable : jQclass;
      $daddy.find(jq).addClass(dragClass);
      $daddy.on('mousedown touchstart', jq, function (e) {
        // For touchstart we must update "mouse" position
        if (e.type == 'touchstart') {
          mouse.updatePosition(e.originalEvent.touches[0]);
        }

        if (mouse.target == false && active == true && (e.which == 1 || e.type == 'touchstart')) {
          var $self = $(this);

          // GET TARGET
          if (options.draggable !== false) {
            mouse.target = $daddy.find(jQclass).has(this);
          } else {
            mouse.target = $self;
          }

          // ADD CLONE
          mouse.clone = mouse.target.clone();
          mouse.target.css({
            visibility: 'hidden'
          }).addClass('active');
          mouse.clone.addClass(cloneClass);
          $daddy.append(mouse.clone);

          // ADD PLACEHOLDER
          var $placeholder = $('<div></div>');
          mouse.placeholder = $placeholder;
          mouse.placeholder.addClass(holderClass);
          mouse.placeholder.css({
            top: mouse.target.offset().top - $daddy.offset().top,
            left: mouse.target.offset().left - $daddy.offset().left,
            width: mouse.target.outerWidth() - 10,
            height: mouse.target.outerHeight() - 10,
            lineHeight: mouse.target.height() - 18 + 'px',
            textAlign: 'center',
          }).text(placeholder);

          $daddy.append(mouse.placeholder);

          // GET OFFSET FOR CLONE
          var bLeft = Math.floor(parseFloat($daddy.css('border-left-width')));
          var bTop = Math.floor(parseFloat($daddy.css('border-top-width')));
          var difx = mouse.x - mouse.target.offset().left + $daddy.offset().left + bLeft;
          var dify = mouse.y - mouse.target.offset().top + $daddy.offset().top + bTop;
          mouse.cloneoffset.x = difx;
          mouse.cloneoffset.y = dify;

          // REMOVE THE CHILDREN DAD CLASS AND SET THE POSITION ON SCREEN
          mouse.clone.removeClass(childrenClass).css({
            position: 'absolute',
            top: mouse.y - mouse.cloneoffset.y,
            left: mouse.x - mouse.cloneoffset.x,
          });

          // UNABLE THE TEXT SELECTION AND SET THE GRAB CURSOR
          $('html,body').addClass('dad-noSelect');
        }
        return true;
      });

      $daddy.on('mouseenter touchenter', jQclass, function () {
        dadUpdate($(this));
      });
    });

    return this;
  };
})(__webpack_require__(/*! jquery */ "jquery"), _.throttle);

/***/ }),

/***/ "./src/modules/old_concept/components/dragbox/loaders/capitalflow.render.js":
/*!**********************************************************************************!*\
  !*** ./src/modules/old_concept/components/dragbox/loaders/capitalflow.render.js ***!
  \**********************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "jquery");
var template = __webpack_require__(/*! ../../../modules/template-web */ "./src/modules/old_concept/modules/template-web.js");
var tpl = __webpack_require__(/*! ../templates/capitalflow.art */ "./src/modules/old_concept/components/dragbox/templates/capitalflow.art");
var render = template.compile(tpl);

template.defaults.imports.fixnum = function (data, fixed) {
    return isNaN(data) ? '-' : parseFloat(data).toFixed(fixed);
}
module.exports = {
    load: function (container, config, stockinfo, cache) {
        var _loader = cache[config.key] = new loader(container, config, stockinfo);
        return _loader.init();
    },
    destroy: function (container, config, stockinfo, cache) {
        var _loader = cache[config.key];
        _loader.destroy();
        $(container).remove();
    }
}

function loader(container, config, stockinfo) {
    var timer;
    this.load = function () {
        // $.ajax({
        //     url: '//nufm.dfcfw.com/EM_Finance2014NumericApplication/JS.aspx?type=CT&js=((x))&sty=DCFF&st=z&token=4f1862fc3b5e77c150a2b985b12db0fd',
        //     data: {
        //         cmd: stockinfo.id
        //     },
        //     dataType: 'jsonp',
        //     jsonp: 'cb',
        //     success: function (json) {
        //         if (typeof json === 'string') {
        //             var items = json.split(',');
        //             var model = {
        //                 state: true,
        //                 BalFlowIn: surpriseValueHandler(items[2]),
        //                 BalFlowOut: surpriseValueHandler(items[3]),
        //                 AmtOfBuy3: surpriseValueHandler(items[4]),
        //                 AmtOfSel3: surpriseValueHandler(items[5]),
        //                 AmtOfBuy2: surpriseValueHandler(items[6]),
        //                 AmtOfSel2: surpriseValueHandler(items[7]),
        //                 AmtOfBuy1: surpriseValueHandler(items[8]),
        //                 AmtOfSel1: surpriseValueHandler(items[9]),
        //                 AmtOfBuy0: surpriseValueHandler(items[10]),
        //                 AmtOfSel0: surpriseValueHandler(items[11]),
        //                 AmtNet3: surpriseValueHandler(items[13]),
        //                 AmtNet2: surpriseValueHandler(items[14]),
        //                 AmtNet1: surpriseValueHandler(items[15]),
        //                 AmtNet0: surpriseValueHandler(items[16])
        //             };
        //             model.MaxAmtNetABS = Math.max(Math.abs(model.AmtNet0), Math.abs(model.AmtNet1), Math.abs(model.AmtNet2), Math.abs(model.AmtNet3));
        //             model.TotalAmtNetABS = Math.abs(model.AmtNet0) + Math.abs(model.AmtNet1) + Math.abs(model.AmtNet2) + Math.abs(model.AmtNet3);
        //             $(container).html(render(model));
        //         }
        //     }
        // });
        var market_01=stockentry.marketnum==1?1:0;
        var apistr = "//push2.eastmoney.com/"
        if (window.location.search.indexOf("env=test") > 0) {
            apistr = "http://61.152.230.207/"
        }
        $.ajax({
            // url: '//nufm.dfcfw.com/EM_Finance2014NumericApplication/JS.aspx?type=CT&js=((x))&sty=DCFF&st=z&token=4f1862fc3b5e77c150a2b985b12db0fd',
            // url:'http://61.129.249.233:18665/api/qt/stock/get?ut=fa5fd1943c7b386f172d6893dbfba10b&fltt=2&invt=2&fields=f135,f136,f137,f138,f139,f141,f142,f144,f145,f147,f148,f140,f143,f146,f149,f193,f196,f194,f195,f197&secid=1.' +stockentry.code,
            url: apistr + 'api/qt/stock/get?ut=fa5fd1943c7b386f172d6893dbfba10b&fltt=2&invt=2&fields=f135,f136,f137,f138,f139,f141,f142,f144,f145,f147,f148,f140,f143,f146,f149,f193,f196,f194,f195,f197&secid='+market_01+'.'+stockentry.code,            
            // data: {
            //     cmd: stockinfo.id
            // },
            dataType: 'jsonp',
            jsonp: 'cb',
            success: function (json) {
                // console.log(json.data)
                if (json.data) {
                    var items = json.data;
                    var model = {
                        state: true,
                        BalFlowIn: surpriseValueHandler(Math.floor(items.f135/10000)),
                        BalFlowOut: surpriseValueHandler(-Math.floor(items.f136/10000)),
                        AmtOfBuy3: surpriseValueHandler(items.f138),
                        AmtOfSel3: surpriseValueHandler(-items.f139),
                        AmtOfBuy2: surpriseValueHandler(items.f141),
                        AmtOfSel2: surpriseValueHandler(-items.f142),
                        AmtOfBuy1: surpriseValueHandler(items.f144),
                        AmtOfSel1: surpriseValueHandler(-items.f145),
                        AmtOfBuy0: surpriseValueHandler(items.f147),
                        AmtOfSel0: surpriseValueHandler(-Math.floor(items.f148)),
                        AmtNet3: surpriseValueHandler(items.f140/10000),
                        AmtNet2: surpriseValueHandler(items.f143/10000),
                        AmtNet1: surpriseValueHandler(items.f146/10000),
                        AmtNet0: surpriseValueHandler(items.f149/10000)
                    };
                    model.MaxAmtNetABS = Math.max(Math.abs(model.AmtNet0), Math.abs(model.AmtNet1), Math.abs(model.AmtNet2), Math.abs(model.AmtNet3));
                    model.TotalAmtNetABS = Math.abs(model.AmtNet0) + Math.abs(model.AmtNet1) + Math.abs(model.AmtNet2) + Math.abs(model.AmtNet3);
                    $(container).html(render(model));
                }
            }
        });
    }
    this.init = function () {
        clearInterval(timer);
        timer = setInterval(this.load, 60000 * 1000);
        this.load();
        return render({
            state: false
        });
    }
    this.destroy =function () {  
        clearInterval(timer);
    }
    function surpriseValueHandler(value) {
        return isNaN(value) ? 0 : value;
    }
}

/***/ }),

/***/ "./src/modules/old_concept/components/dragbox/loaders/companydigest.render.js":
/*!************************************************************************************!*\
  !*** ./src/modules/old_concept/components/dragbox/loaders/companydigest.render.js ***!
  \************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "jquery");
var template = __webpack_require__(/*! ../../../modules/template-web */ "./src/modules/old_concept/modules/template-web.js");
var tpl = __webpack_require__(/*! ../templates/companydigest.art */ "./src/modules/old_concept/components/dragbox/templates/companydigest.art");
var util = __webpack_require__(/*! ../../../modules/utils */ "./src/modules/old_concept/modules/utils.js");
var render = template.compile(tpl);
__webpack_require__(/*! ../../../modules/jquery-plugins/jquery.tooltip */ "./src/modules/old_concept/modules/jquery-plugins/jquery.tooltip.js");
// require('../../../modules/jquery-plugins/jquery.tooltip.css');
module.exports = {
    load: function (container, config, stockinfo, cache) {
        var market_01=stockentry.marketnum==1?1:0;
        var apiurl = "//push2.eastmoney.com/";
        if(window.location.search.indexOf('env=test')>-1){
            apiurl = "http://61.152.230.207/";
        }
        $.ajax({
            // url: '//nufm.dfcfw.com/EM_Finance2014NumericApplication/JS.aspx?type=CT&sty=FDCCD&st=z&js=((x))&token=4f1862fc3b5e77c150a2b985b12db0fd',
            url: apiurl + 'api/qt/stock/get?ut=fa5fd1943c7b386f172d6893dbfba10b&fltt=2&invt=2&fields=f55,f62,f84,f85,f92,f173,f103,f104,f105,f108,f109,f116,f117,f126,f160,f183,f184,f185,f186,f187,f188,f190,f162,f167,f189&secid=' +market_01+'.' +stockentry.code,    
            // data: {
            //     cmd: stockinfo.id
            // },
            dataType: 'jsonp',
            jsonp: 'cb',
            success: function (json) {
                // console.log('999999999999999999999999')
                // console.log(json)
                if (json && json.data) {
                    var items = json.data;
                    var model = {
                        state: true,
                        LatestBasicEps:util.toFixedFun(items.f55,3), //items.f55.toFixed(3),
                        LatestReportDate: items.f62,
                        PERation: items.f162,
                        LatestNetAssetPerShare:util.toFixedFun(items.f92,4),//items.f92.toFixed(4),
                        PB: items.f167,
                        TotalOperatingIncome: items.f183,
                        IncomeYOYGrowthRate:util.toFixedFun(items.f184,2),// items.f184.toFixed(2),
                        NetProfitAttributableToEquityHolders: items.f105,
                        NetProfitAttributableToEquityHoldersYOY:util.toFixedFun(items.f185,2),// items.f185.toFixed(2),
                        SalesGrossMargin: !!items.f186 ? util.toFixedFun(items.f186,2) : "-",//当为0 时 写成-
                        FinancialAssessmentSalesMargin:util.toFixedFun(items.f187,2),// items.f187.toFixed(2),
                        // WeightedYieldOnNetAssets: items[12],
                        WeightedYieldOnNetAssets:util.toFixedFun(items.f173,2),// items.f173.toFixed(2),
                        AssetLiabilityRatio:util.toFixedFun(items.f188,2),// items.f188.toFixed(2),
                        TotalCapital: items.f84,
                        MarketValue: items.f116,
                        FlowCapital: items.f85,
                        FlowCapitalValue: items.f117,
                        RetainedEarningsPerShare: util.toFixedFun(items.f190,4),//items.f190.toFixed(4),
                        IPODate:util.formatHqData(json.data.f189) // json.data.f189.toString().substring(0,4)+'--'+json.data.f189.toString().substring(4,6)+'-'+json.data.f189.toString().substring(6,8)
                    };
                    model.Season = GetSeason(model.LatestReportDate);
                    var $html = $(render(model));
                    showtips.apply($(container), [$html]);
                    $(container).html($html);
                }
            }
        });
        return render({
            state: false
        });
    }
}

function showtips(container) {
    $('.showtips', container).tooltip({
        deltaY: -10
    });
}

// function GetSeason(date) {
//     if (typeof date === 'string') date = new Date((date || '').replace(/-/g, '/').replace('T', ' '));
//     if (isNaN(date.getTime())) date = Date();
//     if (date.getMonth() + 1 <= 3) {
//         return '一';
//     } else if (date.getMonth() + 1 <= 6) {
//         return '二';
//     } else if (date.getMonth() + 1 <= 9) {
//         return '三';
//     } else if (date.getMonth() + 1 <= 12) {
//         return '四';
//     }
// }
function GetSeason(section){
    // console.log(section/10)
    var chnNumChar = ["零","一","二","三","四","五","六","七","八","九"];
    var chnUnitSection = ["","万","亿","万亿","亿亿"];
    var chnUnitChar = ["","十","百","千"];
    if(section/10<2&&section/10>1){
        return("十"+chnNumChar[section%10])
    }else if(section/10==1){
        return("十")
    }else{
        var strIns = '', chnStr = '';
        var unitPos = 0;
        var zero = true;
        while(section > 0){
            var v = section % 10;
            if(v === 0){
                if(!zero){
                    zero = true;
                    chnStr = chnNumChar[v] + chnStr;
                }
            }else{
                zero = false;
                strIns = chnNumChar[v];
                strIns += chnUnitChar[unitPos];
                chnStr = strIns + chnStr;
            }
            unitPos++;
            section = Math.floor(section / 10);
            // console.log(section);
        }      
        return chnStr;
        }      
}

/***/ }),

/***/ "./src/modules/old_concept/components/dragbox/loaders/fake.render.js":
/*!***************************************************************************!*\
  !*** ./src/modules/old_concept/components/dragbox/loaders/fake.render.js ***!
  \***************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "jquery");
var template = __webpack_require__(/*! ../../../modules/template-web */ "./src/modules/old_concept/modules/template-web.js");
var tpls = __webpack_require__("./src/modules/old_concept/components/dragbox/templates sync recursive \\.art$");

module.exports = {
    load: function ($dom, config, stockinfo, cache) {
        var self = this;
        var tk = './' + config.key + '.art';
        if (tpls.keys().indexOf(tk) > 0) {
            var tpl = tpls(tk);
            var models = $.extend({}, this.entry);
            return template.render(tpl, models);
        }
    }
}

/***/ }),

/***/ "./src/modules/old_concept/components/dragbox/loaders/industrynews.render.js":
/*!***********************************************************************************!*\
  !*** ./src/modules/old_concept/components/dragbox/loaders/industrynews.render.js ***!
  \***********************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "jquery");
var template = __webpack_require__(/*! ../../../modules/template-web */ "./src/modules/old_concept/modules/template-web.js");
var tpl = __webpack_require__(/*! ../templates/stocknews.art */ "./src/modules/old_concept/components/dragbox/templates/stocknews.art");
var render = template.compile(tpl);
var new_news = __webpack_require__(/*! ../../../../new_news/web */ "./src/modules/new_news/web.ts").default

module.exports = {
    load: function (container, config, stockinfo, cache) {
        new_news.getNews(stockinfo.board.market + '.' + stockinfo.board.code, 6).then(function(list){
                var html = render({
                    Data: list,
                    Datalength: list.length
                });
                $(container).html(html);
        })


        return render({
            loading: true
        });
        // $.ajax({
        //     url: '//cmsdataapi.eastmoney.com/api/StockNews/GetIndustryNews',
        //     data: {
        //         returnFields: 'Art_Title,Art_ShowTime,Art_Url',
        //         id: stockinfo.board.id,
        //         count: 6
        //     },
        //     dataType: 'jsonp',
        //     jsonp: 'cb',
        //     success: function (json) {
        //         var html = render(json);
        //         $(container).html(html);
        //     },
        //     error: function (evt, xhr, opt, err) {
        //         $(container).html(render({
        //             loading: false
        //         }));
        //     }
        // });
        // return render({
        //     loading: true
        // });
    }
}

/***/ }),

/***/ "./src/modules/old_concept/components/dragbox/loaders/largeshareholders.render.js":
/*!****************************************************************************************!*\
  !*** ./src/modules/old_concept/components/dragbox/loaders/largeshareholders.render.js ***!
  \****************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "jquery");
var template = __webpack_require__(/*! ../../../modules/template-web */ "./src/modules/old_concept/modules/template-web.js");
var tpl = __webpack_require__(/*! ../templates/largeshareholders.art */ "./src/modules/old_concept/components/dragbox/templates/largeshareholders.art");
var utils = __webpack_require__(/*! ../../../modules/utils */ "./src/modules/old_concept/modules/utils.js");
var render = template.compile(tpl);

module.exports = {
    load: function (container, config, stockinfo, cache) {
        var options = $.extend({
            state: true,
            data: []           
        }, stockinfo);

        // $.ajax({
        //     url: 'api/f10/RptConstituteCapital',
        //     type: 'post',
        //     contentType: 'application/json',
        //     data: JSON.stringify({
        //         SecurityCode: (stockinfo.code + '.' + stockinfo.shortmarket).toUpperCase(),
        //         date: 20140805,
        //         count: 4
        //     }),
        //     dataType: 'json',
        //     success: function (json) {               
                if(window.ConstituteCapital){
                    options.state = true;

                    var zdlist = window.ConstituteCapital.FieldName.split(',')
                    var data = window.ConstituteCapital.Data.map(function(v){
                        var obj = {}
                        v.split('|').forEach(function(strvalue, i){
                          obj[zdlist[i]] = strvalue
                        })
                        return obj
                    }); 

                    //data = [{"date":"2019/9/30 0:00:00","totalEquity":"671560.8655","aShares":"544607.9097","restrictedCirculationShares":"126952.9558"},{"date":"2019/6/30 0:00:00","totalEquity":"671560.8655","aShares":"543539.737","restrictedCirculationShares":"128021.1285"},{"date":"2019/5/22 0:00:00","totalEquity":"671560.8655","aShares":"548475.2822","restrictedCirculationShares":"123085.5833"},{"date":"2019/5/14 0:00:00","totalEquity":"559634.0546","aShares":"457062.7352","restrictedCirculationShares":"102571.3194"}]

                    var module={};                     
                    for(var i in data ){
                        if(typeof data[i] == "object"){
                            options.data.push({
                                date:utils.formatDate(data[i].date,"yyyy-MM-dd"),
                                totalEquity:Number(data[i].TotalEquity).toFixed(2),
                                aShares:Number(data[i].AShares).toFixed(2),
                                restrictedCirculationShares:Number(data[i].RestrictedCirculationShares).toFixed(2)
                            });                          
                           
                        }                       
                    }
                }   
                // console.info(render(options))
                setTimeout(function(){
                    $(container).html(render(options)); 
                }, 100);
                             
        //     }
        // });

        return render($.extend({
            state: false
        }, stockinfo));
    }
}

/***/ }),

/***/ "./src/modules/old_concept/components/dragbox/loaders/profittrend.render.js":
/*!**********************************************************************************!*\
  !*** ./src/modules/old_concept/components/dragbox/loaders/profittrend.render.js ***!
  \**********************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "jquery");
var emcharts = __webpack_require__(/*! ../../../modules/quotecharts */ "./src/modules/old_concept/modules/quotecharts.js")
var utils = __webpack_require__(/*! ../../../modules/utils */ "./src/modules/old_concept/modules/utils.js");
var template = __webpack_require__(/*! ../../../modules/template-web */ "./src/modules/old_concept/modules/template-web.js");
var tpl = __webpack_require__(/*! ../templates/profittrend.art */ "./src/modules/old_concept/components/dragbox/templates/profittrend.art");
var render = template.compile(tpl);

module.exports = {
    load: function (container, config, stockinfo) {
        $.ajax({
            method: 'GET',
            //url: '//dcfmcdn.eastmoney.com/api/dispatcher/LRQS/lrqs/default/ptcb((x))/' + stockinfo.code + '.html?token=70f12f2f4f091e459a279469fe49eca5',
            url: '/newapi/getlrqs?code=' + stockinfo.code,
            dataType: 'json',
            success: function (json) {
                $(container).html(render({
                    loading: false,
                    stockinfo: stockinfo
                }));
                if (json instanceof Array && json.length > 0) {
                    loadBarChart.apply(this, [container, json]);
                }
            },
            error: function (evt, xhr, opt, err) {
                $(container).html(render({
                    loading: false,
                    stockinfo: stockinfo
                }));
            }
        });
        return render({
            loading: true,
            stockinfo: stockinfo
        });
    }
}

function loadBarChart(container, json) {
    var years = [],
        mappings = {},
        data = [],
        seasons = [3, 6, 9, 12];
    var chartdata = {
        colors: ['#ffc962', '#ffb527', '#ff9c00', '#ff7e00'],
        names: ["1季度", "2季度", "3季度", "4季度"],
        format: function (data) {
            return utils.numbericFormat(data);
        },
        datas: data
    }
    for (var i = 0; i < json.length; i++) {
        var date = new Date(json[i].RptDate.replace(/-/g, "/").replace("T", " "));
        var year = date.getFullYear(),
            month = date.getMonth() + 1;
        if (years.indexOf(year) < 0) {
            years.push(year);
            if (!mappings[year]) mappings[year] = [0, 0, 0, 0];
            data.push({
                title: year + '年',
                data: mappings[year],
                isStatis: true
            });
        }

        var idx = seasons.indexOf(month);
        if (idx >= 0) {
            mappings[year][idx] = isNaN(json[i].Profit) ? '-' : json[i].Profit;
        }
    }
    for (var key in mappings) {
        var len = 4 - mappings[key].length;
        for (var i = 0; i < len; i++) {
            mappings[key].push('-');
        }
    }
    try {
        $('.nocontent', container).remove();
        var chart = new emcharts('bargroup', {
            container: "#profittrend-chart",
            width: 365,
            height: 155
        }).create();
        chart.setData(chartdata);
        chart.draw();
    } catch (e) {
        console.error(e);
    }
}

/***/ }),

/***/ "./src/modules/old_concept/components/dragbox/loaders/quartile.render.js":
/*!*******************************************************************************!*\
  !*** ./src/modules/old_concept/components/dragbox/loaders/quartile.render.js ***!
  \*******************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "jquery");
var template = __webpack_require__(/*! ../../../modules/template-web */ "./src/modules/old_concept/modules/template-web.js");
var tpl = __webpack_require__(/*! ../templates/quartile.art */ "./src/modules/old_concept/components/dragbox/templates/quartile.art");
var render = template.compile(tpl);
var utils = __webpack_require__(/*! ../../../modules/utils */ "./src/modules/old_concept/modules/utils.js");
__webpack_require__(/*! ../../../modules/jquery-plugins/jquery.tooltip */ "./src/modules/old_concept/modules/jquery-plugins/jquery.tooltip.js");
// require('../../../modules/jquery-plugins/jquery.tooltip.css');
module.exports = {    
    load: function (container, config, stockinfo) {       
        var self = this;
        $.ajax({            
            // //nufm.dfcfw.com/EM_Finance2014NumericApplication/JS.aspx?type=CT&sty=FDPFLTBDHKL2TB&js=((x))&token=4f1862fc3b5e77c150a2b985b12db0fd
            url: '//push2.eastmoney.com/api/qt/slist/get?spt=1&np=3&fltt=2&invt=2&fields=f9,f12,f13,f14,f20,f23,f37,f45,f49,f134,f135,f129,f1000,f2000,f3000&ut=bd1d9ddb04089700cf9c27f6f7426281',
            data: {
                secid: stockentry.mktnum + '.' + stockentry.code                
            },
            dataType: 'jsonp',           
            jsonp: 'cb',
            success: function (json) {
                if (json && json.data) {
                    var items = json.data.diff;
                    if (items && items.length > 0) {      
                        var obj = items[0], obj_1 = items[1];
                        // console.log(items, "四分位数据")
                        //debugger:;
                         var model = {
                            state: true,
                            stockinfo: stockinfo,
                            MarketValue: { //总市值
                                value:obj.f20, // 总额
                                position: obj.f1020, //行业排名
                                total: obj_1.f134, //板块总股数
                                rank:obj.f3020, //四分位属性
                                rank_desc: getDesc(obj.f3020), //四分位属性高低
                                board: obj_1.f2020  //行业平均
                            },
                            NetAssetsPerShare: { //净资产
                                value: obj.f135,
                                position: obj.f1135,
                                total: obj_1.f134,
                                rank: obj.f3135,
                                rank_desc: getDesc(obj.f3135),
                                board: obj_1.f2135
                            },
                            NetProfitAttributableToEquityHolders: { //净利润
                                value: obj.f45,
                                position: obj.f1045,
                                total: obj_1.f134,
                                rank: obj.f3045,
                                rank_desc: getDesc(obj.f3045),
                                board: obj_1.f2045
                            },
                            PERation: {//市盈率
                                value: specialData(obj.f9),
                                position: specialData(obj.f9,obj.f1009,true),
                                total: obj_1.f134,
                                rank: getDesc(obj.f3009, obj.f9, "市盈率")[1],
                                rank_desc: getDesc(obj.f3009, obj.f9, "市盈率")[0],
                                board: utils.toFixedFun(obj_1.f2009)
                            },
                            PB: {//市净率
                                value: specialData(obj.f23),
                                position: specialData(obj.f23,obj.f1023,true),
                                total: obj_1.f134,
                                rank: getDesc(obj.f3023, obj.f23, "市净率")[1],
                                rank_desc: getDesc(obj.f3023, obj.f23,"市净率")[0],
                                board: utils.toFixedFun(obj_1.f2023)
                            },
                            SalesGrossMargin: {//毛利率
                                value: utils.addPercent(obj.f49),
                                position: obj.f1049,
                                total: obj_1.f134,
                                rank:obj.f3049,
                                rank_desc: getDesc(obj.f3049),
                                board: utils.addPercent(obj_1.f2049)
                             },
                            FinancialAssessmentSalesMargin: {//净利率
                                value: utils.addPercent(obj.f129),
                                position: obj.f1129,
                                total: obj_1.f134,
                                rank: obj.f3129,
                                rank_desc: getDesc(obj.f3129),
                                board: utils.addPercent(obj_1.f2129)
                             },
                            WeightedYieldOnNetAssets: {//ROE
                                value: utils.addPercent(obj.f37),
                                position: obj.f1037,
                                total: obj_1.f134,
                                rank: obj.f3037,
                                rank_desc: getDesc(obj.f3037),
                                board: utils.addPercent(obj_1.f2037)
                            }
                         };
                        var $dom = $(render(model));
                        settips.apply(self, [$dom]);
                        $(container).html($dom);
                    }
                }

              
            },
            error: function (evt, xhr, opt, err) {
                $(container).html(render({
                    state: false,
                    loading: false,
                    stockinfo: stockinfo
                }));
            }
        });
        return render({
            state: false,
            loading: true,
            stockinfo: stockinfo
        });
    }
}
//市盈率市净率特殊处理
function specialData(num, pm, status) {
    var syl = parseFloat(num), item = "";
    if (!status) {
        if (syl >= 0 || syl < 0) {
            syl >= 0 ? item = syl.toFixed(2) : item = "负值";
        } else {
            syl ? item = syl.toFixed(2) : item = "-";
        }
    } else {
        if (syl >= 0) {
            item = parseFloat(pm);
        } else {
            item = "-";
        }
    }
    return item;
}
function settips(container) {
    $('.showtips', container).tooltip({
        deltaY: -10
    });
    $('td.quartile-title', container).tooltip({
        position: 'right',
        trackMouse: true,
        content: '<div class="quartile-tips">四分位属性是指根据每个指标的属性，进行数值大小排序，然后分为四等分，每个部分大约包含排名的四分之一。将属性分为高、较高、较低、低四类。<br/><span class="red">注：鼠标移至四分位图标上时，会出现每个指标的说明和用途。</span></div>'
    });
    $('.quartile-mv', container).tooltip({
        position: 'right',
        trackMouse: true,
        content: '<div class="quartile-tips">公式为公司总股本乘以市价。该指标侧面反映出一家公司的规模和行业地位。总市值越大，公司规模越大，相应的行业地位也越高。<br><span class="red">注：四分位属性以行业排名为比较基准。</span></div>'
    });
    $('.quartile-naps', container).tooltip({
        position: 'right',
        trackMouse: true,
        content: '<div class="quartile-tips">公式为资产总额减去负债后的净额。该指标由实收资本、资本公积、盈余公积和未分配利润等构成，反映企业所有者在企业中的财产价值。净资产越大，信用风险越低。<br><span class="red">注：四分位属性以行业排名为比较基准。</span></div>'
    });
    $('.quartile-npeh', container).tooltip({
        position: 'right',
        trackMouse: true,
        content: '<div class="quartile-tips">公式为：净利润=利润总额-所得税费用。净利润是一个企业经营的最终成果，净利润多，企业的经营效益就好。<br><span class="red">注：四分位属性以行业排名为比较基准。</span></div>'
    });
    $('.quartile-pe', container).tooltip({
        position: 'right',
        trackMouse: true,
        content: '<div class="quartile-tips">公式为公司股票价格除以每股利润。该指标主要是衡量公司的价值，高市盈率一般是由高成长支撑着。市盈率越低，股票越便宜，相对投资价值越大。<br><span class="red">注：四分位属性以行业排名为比较基准。</span></div>'
    });
    $('.quartile-pb', container).tooltip({
        position: 'left',
        trackMouse: true,
        content: '<div class="quartile-tips">公式为每股股价与每股净资产的比率。市净率越低，每股内含净资产值越高，投资价值越高。<br><span class="red">注：四分位属性以行业排名为比较基准。</span></div>'
    });
    $('.quartile-sgm', container).tooltip({
        position: 'left',
        trackMouse: true,
        content: '<div class="quartile-tips">公式为毛利与销售收入的比率。毛利率越高，公司产品附加值越高，赚钱效率越高。<br><span class="red">注：四分位属性以行业排名为比较基准。</span></div>'
    });
    $('.quartile-fasm', container).tooltip({
        position: 'left',
        trackMouse: true,
        content: '<div class="quartile-tips">公式为净利润与主营业务收入的比率。该指标表示企业每单位资产能获得净利润的数量，这一比率越高，说明企业全部资产的盈利能力越强。<br><span class="red">注：四分位属性以行业排名为比较基准。</span></div>'
    });
    $('.quartile-wyna', container).tooltip({
        position: 'left',
        trackMouse: true,
        content: '<div class="quartile-tips">公式为税后利润与净资产的比率。该指标反映股东权益的收益水平，用以衡量公司运用自有资本的效率。指标值越高，说明投资带来的收益越高。<br><span class="red">注：四分位属性以行业排名为比较基准。</span></div>'
    });
}

function getDesc(rank, num, dir) { //市盈率市净率还要重新考虑
    var item = "", item2 = 0;
    var $html = '- - <b class="icon-help2" style = "margin-top: 5px;" title = "'+dir+'为负值，不参与四分位排名"></b>';
    if (dir) {
        //市盈率市净率四分位属性判断之前先判断市净率市盈率值的正负，正的话直接用rank判断，负值直接--加title
        var _num = parseFloat(num);
        if (_num >= 0) {
            if (parseInt(rank)) {
                if (0 < rank && rank < 5) {
                    var desc = ['高', '较高', '较低', '低'];
                    item = desc[rank - 1];
                } else {
                    item = '--';
                }
            } else {
                item = $html;

            }
            item2 = rank;
        } else if (_num < 0) {
            item = $html;           
        } else {
            item = '--';
            
        }
        return [item, item2];
    } else {
        if (parseInt(rank)) {
            if (0 < rank && rank < 5) {
                var desc = ['高', '较高', '较低', '低'];
                item = desc[rank - 1];
            } else {
                item = '--';
            }
        } else {
            item = $html;
        }
        return item;
    }
   
}


/***/ }),

/***/ "./src/modules/old_concept/components/dragbox/loaders/relatedboards.render.js":
/*!************************************************************************************!*\
  !*** ./src/modules/old_concept/components/dragbox/loaders/relatedboards.render.js ***!
  \************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "jquery");
var template = __webpack_require__(/*! ../../../modules/template-web */ "./src/modules/old_concept/modules/template-web.js");
var tpl = __webpack_require__(/*! ../templates/relatedboards.art */ "./src/modules/old_concept/components/dragbox/templates/relatedboards.art");
var pathConfig = __webpack_require__(/*! ../../../config.js */ "./src/modules/old_concept/config.js");
var render = template.compile(tpl);

module.exports = {
    load: function (container, config, stockinfo, cache) {
        var _loader = cache[config.key] = new loader(container, config, stockinfo);
        return _loader.init();
    },
    destroy: function (container, config, stockinfo, cache) {
        var _loader = cache[config.key];
        $(container).remove();
        _loader.destroy();
    }
}

function loader(container, config, stockinfo) {
    var timer;
    this.load = function () {
        var market_01=stockentry.marketnum==1?1:0;
        // var url = "http://push2.eastmoney.com/api/qt/slist/get?ut=fa5fd1943c7b386f172d6893dbfba10b&spt=3&pi=0&po=1&invt=2&fields=f14,f3,f128,f12,f13,f100,f102,f103&secid="+market_01+'.' +stockentry.code;

        var url = pathConfig.getEnvPath("commonApi")+"api/qt/slist/get?ut=fa5fd1943c7b386f172d6893dbfba10b&spt=3&pi=0&po=1&invt=2&fields=f14,f3,f128,f12,f13,f100,f102,f103&secid="+market_01+'.' +stockentry.code;

        $.ajax({
            // url: '//nufm.dfcfw.com/EM_Finance2014NumericApplication/JS.aspx?type=CT&sty=DCRRBKCPALTB&st=z&sr=-1&p=&ps=10&js=([(x)])&token=4f1862fc3b5e77c150a2b985b12db0fd',
            url:url,            
            // data: {
            //     cmd: 'E.' + stockinfo.id
            // },
            jsonp: 'cb',
            dataType: 'jsonp',
            success: function (json) {
                // console.log(json)
                if (json.data) {
                    var models = [];
                    for (var i = 0; i < json.data.total && i < 10; i++) {
                        // if (typeof json[i] !== 'string') continue;
                        var items = json.data.diff[i];
                        // console.log(items)
                        models.push({
                            marketType: 1,
                            market: (items.f141=='-')?'-':items.f141 == '1' ? 'sh' : 'sz',
                            code: items.f12,
                            name: items.f14,
                            changePercent: items.f3=='-'?'-':(items.f3/100).toFixed(2)+'%',
                            BKCPLEADMKT: items.f141=='-'?'-':items.f141,
                            BKCPLEADCODE: items.f140=='-'?'-':items.f140,
                            BKCPLEADNAME: items.f128=='-'?'-':items.f128
                        });
                    }
                    var html = render({
                        state: true,
                        data: models
                    });
                    $(container).html(html);
                }
            },
            error: function (evt, xhr, opt, err) {
                $(container).html(render({
                    state: false,
                    loading: false
                }));
            }
        });
    }
    this.init = function () {
        clearInterval(timer);
        timer = setInterval(this.load, 40 * 1000);
        this.load();
        return render({
            state: false,
            loading: true
        });
    }
    this.destroy = function () {
        clearInterval(timer);
    }
}

/***/ }),

/***/ "./src/modules/old_concept/components/dragbox/loaders/relatedstocks.render.js":
/*!************************************************************************************!*\
  !*** ./src/modules/old_concept/components/dragbox/loaders/relatedstocks.render.js ***!
  \************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "jquery");
var template = __webpack_require__(/*! ../../../modules/template-web */ "./src/modules/old_concept/modules/template-web.js");
var tpl = __webpack_require__(/*! ../templates/relatedstocks.art */ "./src/modules/old_concept/components/dragbox/templates/relatedstocks.art");
var render = template.compile(tpl);
var pathConfig = __webpack_require__(/*! ../../../config */ "./src/modules/old_concept/config.js");

module.exports = {
    load: function (container, config, stockinfo, cache) {
        var _loader = cache[config.key] = new loader(container, config, stockinfo);
        return _loader.init();
    },
    destroy: function (container, config, stockinfo, cache) {
        var _loader = cache[config.key];
        $(container).remove();
        _loader.destroy();
    }
}

function loader(container, config, stockinfo) {
    var timer;
    this.load = function () {
        var market_01=stockentry.marketnum==1?1:0;
        // var url = 'http://push2.eastmoney.com/api/qt/slist/get?pi=0&pz=10&po=1&spt=4&invt=2&fields=f12,f13,f14,f2,f3,f4,f6,f5,f11,f10&ut=fa5fd1943c7b386f172d6893dbfba10b&secid='+market_01+'.'+stockentry.code+'&fid=f3';
        
        var url = pathConfig.getEnvPath("commonApi")+'api/qt/slist/get?pi=0&pz=10&po=1&spt=4&invt=2&fields=f12,f13,f14,f2,f3,f4,f6,f5,f11,f10&ut=fa5fd1943c7b386f172d6893dbfba10b&secid='+market_01+'.'+stockentry.code+'&fid=f3';

        $.ajax({
            url: url,
            // data: {
            //     cmd: 'C.' + stockinfo.board.id
            // },
            jsonp: 'cb',
            dataType: 'jsonp',
            success: function (json) {
                if (json.data) {
                    var models = [];
                    for (var i = 0; i < json.data.total && i < 10; i++) {
                        // if (typeof json[i] !== 'string') continue;
                        var items =json.data.diff[i];
                        // console.log(items)
                        models.push({
                            marketType: items.f13=='1'?'sh':'sz',
                            code: items.f12,
                            name: items.f14,
                            close: items.f2=='-'?'-':(items.f2/100).toFixed(2),
                            change: items.f4=='-'?'-':(items.f4/100).toFixed(2),
                            changePercent: items.f3=='-'?'-':(items.f3/100).toFixed(2)+'%'
                        });
                    }
                    // console.log(models)
                    var html = render({
                        state: true,
                        loading: false,
                        data: models
                    });
                    $(container).html(html);
                }
            },
            error: function (evt, xhr, opt, err)  {
                $(container).html(render({
                    state: false,
                    loading: false
                }));
            }
        });
    }
    this.init = function () {
        clearInterval(timer);
        timer = setInterval(this.load, 40 * 1000);
        this.load();
        return render({
            state: false,
            loading: true
        });
    }
    this.destroy = function () {  
        clearInterval(timer);
    }
}

/***/ }),

/***/ "./src/modules/old_concept/components/dragbox/loaders/stagechange.render.js":
/*!**********************************************************************************!*\
  !*** ./src/modules/old_concept/components/dragbox/loaders/stagechange.render.js ***!
  \**********************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "jquery");
var template = __webpack_require__(/*! ../../../modules/template-web */ "./src/modules/old_concept/modules/template-web.js");
var tpl = __webpack_require__(/*! ../templates/stagechange.art */ "./src/modules/old_concept/components/dragbox/templates/stagechange.art");
var render = template.compile(tpl);
var utils = __webpack_require__(/*! ../../../modules/utils */ "./src/modules/old_concept/modules/utils.js")

module.exports = {
    load: function (container, config, stockinfo) {
        var apistr = "//push2.eastmoney.com/"
        if (window.location.search.indexOf("env=test") > 0){
            apistr = "http://61.152.230.207/"
        }
        var _url = apistr + 'api/qt/slist/get?np=3&fields=f12,f13,f14,f3,f127,f109,f149,f160&spt=7&fltt=2&invt=2&ut=bd1d9ddb04089700cf9c27f6f7426281&secid='+stockinfo.mktnum+'.'+stockinfo.code;
        var labels = ['stock', 'industry', 'concept', 'region'];
        $.ajax({
            type: "GET",
            url: _url,
            dataType: "jsonp",
            jsonp: 'cb',
            success: function (json) {
                var models = $.extend({
                    state: true,
                    stock: stockinfo,
                    names:[],
                    data: [new stagechange('今日'), new stagechange('3日'), new stagechange('5日'), new stagechange('6日'), new stagechange('10日')]
                }, boardentites);
                if (json && json.data && json.data.diff) {
                    var data = [];
                    var arr = json.data.diff
                    for (var i = 0; i < arr.length; i++) {
                        var items = arr[i];
                        models.names[i] = items.f14;
                        models.data[0].changePercent[labels[i]] = utils.toPercent(items['f3']);
                        if(i === 0) models.data[0].id = 'quote-changePercent-block';
                        models.data[1].changePercent[labels[i]] = utils.toPercent(items['f127']);
                        models.data[2].changePercent[labels[i]] = utils.toPercent(items['f109']);
                        models.data[3].changePercent[labels[i]] = utils.toPercent(items['f149']);
                        models.data[4].changePercent[labels[i]] = utils.toPercent(items['f160']);
                    }
                }
                $(container).html(render(models)); 
            }
        })
        return render();
        // var cmds = [stockinfo.id, boardentites.industry.id, boardentites.concept.id, boardentites.region.id];
        // var labels = ['stock', 'industry', 'concept', 'region'];
        // $.ajax({
        //     url: '//nufm.dfcfw.com/EM_Finance2014NumericApplication/JS.aspx?type=CT&st=z&token=4f1862fc3b5e77c150a2b985b12db0fd',
        //     data: {
        //         cmd: cmds.join(','),
        //         sty: 'FDPSUD'
        //     },
        //     dataType: 'jsonp',
        //     jsonp: 'cb',
        //     success: function (json) {
        //         var models = $.extend({
        //             state: true,
        //             stock: stockinfo,
        //             data: [new stagechange('今日'), new stagechange('3日'), new stagechange('5日'), new stagechange('6日'), new stagechange('10日')]
        //         }, boardentites);
        //         if (json instanceof Array) {
        //             var data = [];
        //             for (var i = 0; i < json.length; i++) {
        //                 var line = json[i];
        //                 if (typeof line !== 'string') continue;
        //                 var items = line.split(','),
        //                     id = items[1] + items[0],
        //                     idx = cmds.indexOf(id);
        //                 if (idx >= 0) {
        //                     models.data[0].changePercent[labels[idx]] = items[3];
        //                     if(idx === 0) models.data[0].id = 'quote-changePercent-block';
        //                     models.data[1].changePercent[labels[idx]] = items[4];
        //                     models.data[2].changePercent[labels[idx]] = items[5];
        //                     models.data[3].changePercent[labels[idx]] = items[6];
        //                     models.data[4].changePercent[labels[idx]] = items[7];
        //                 }
        //             }
        //         }
        //         $(container).html(render(models));
        //     }
        // });
        // return render();
    }
}

function stagechange(label) {
    this.label = label || '';
    this.changePercent = {
        stock: '-',
        industry: '-',
        concept: '-',
        region: ''
    };
}

/***/ }),

/***/ "./src/modules/old_concept/components/dragbox/loaders/stockcalendar.render.js":
/*!************************************************************************************!*\
  !*** ./src/modules/old_concept/components/dragbox/loaders/stockcalendar.render.js ***!
  \************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "jquery");
var template = __webpack_require__(/*! ../../../modules/template-web */ "./src/modules/old_concept/modules/template-web.js");
var tpl = __webpack_require__(/*! ../templates/stockcalendar.art */ "./src/modules/old_concept/components/dragbox/templates/stockcalendar.art");
var utils = __webpack_require__(/*! ../../../modules/utils */ "./src/modules/old_concept/modules/utils.js");
var render = template.compile(tpl);

module.exports = {
    load: function (container, config, stockinfo) {
        var st = $('#quote-time').html();
        // console.log(st)
        if (!st) {
            $('#quote-time').one('tick', function (e, time, status) {
                _load(time);
            });
        } else {
            _load(new Date(st.replace(/-/g, '/')));
        }
        return render({
            state: false,
            loading: true
        });

        function _load(time) {
            var region = getRegion(time, 'yyyy-MM-dd');
            $.ajax({
                url: '//dcfm.eastmoney.com/em_mutisvcexpandinterface/api/js?type=GGSJ20_ZDGZ&token=70f12f2f4f091e459a279469fe49eca5&st=rq&sr=-1&p=1',
                data: {
                    filter: '(gpdm=\'' + stockinfo.code + '\')(rq>=^' + region.begin + '^ and rq<=^' + region.end + '^)',
                    ps: 3
                },
                cache: true,
                dataType: 'jsonp',
                jsonpCallback: 'stockcalendarhandler',
                success: function (json) {
                    if (json instanceof Array) {
                        var data = {},
                            models = [];
                        for (var i = 0; i < json.length; i++) {
                            var line = json[i];
                            var reportdate = utils.formatDate(line.rq, 'yyyy-MM-dd');
                            if (!data[reportdate]) {
                                data[reportdate] = [];
                                models.push({
                                    reportdate: reportdate,
                                    data: data[reportdate]
                                });
                            }
                            data[reportdate].push(line);
                            line.link = getLink(line, stockinfo);
                        }

                        var html = render({
                            state: true,
                            today: utils.formatDate(new Date, 'yyyy-MM-dd'),
                            data: models
                        });
                        $(container).html(html);
                    }
                },
                error: function (evt, xhr, opt, err) {
                    $(container).html(render({
                        state: false,
                        loading: false
                    }));
                }
            });
        }
    }
}

function getRegion(time, fmt) {
    var begin = new Date(time),
        end = new Date(time);
    begin.setDate(time.getDate() + 180);
    end.setDate(time.getDate() - 180);
    return {
        begin: utils.formatDate(end, fmt),
        end: utils.formatDate(begin, fmt)
    };
}

function getLink(item, stockinfo) {
    var href = "";
    switch (item.sjlxz) {
        // 停牌日期
        case "TFP":
            href = "http://data.eastmoney.com/tfpxx/";
            break;
        // 龙虎榜
        case "LHB":
            href = "http://data.eastmoney.com/stock/lhb/" + item.gpdm + ".html";
            break;
        // 大宗交易
        case "DZJY":
            href = "http://data.eastmoney.com/dzjy/detail/" + item.gpdm + ".html";
            break;
        // 公告
        case "GG":
            href = "http://data.eastmoney.com/notices/stock/" + item.gpdm + ".html";
            break;
        // 研报
        case "YB":
            href = "http://data.eastmoney.com/report/" + item.gpdm + ".html";
            break;
        // 机构调研
        case "JGDY":
            href = "http://data.eastmoney.com/jgdy/gsjsdy/" + item.gpdm + ".html";
            break;
        // 股东增减持日
        case "GDZJC":
            href = "http://data.eastmoney.com/executive/gdzjc/" + item.gpdm + ".html";
            break;
        // 限售解禁日
        case "XSJJ":
            href = "http://data.eastmoney.com/dxf/q/" + item.gpdm + ".html";
            break;
        // 高管持股
        case "GGZJC":
            href = "http://data.eastmoney.com/executive/" + item.gpdm + ".html";
            break;
        // 高管关联人持股
        case "GGXGZJC":
            href = "http://data.eastmoney.com/executive/" + item.gpdm + ".html";
            break;
        // 预约披露日
        case "YYPL":
            href = "http://data.eastmoney.com/bbsj/" + item.gpdm + ".html";
            break;
        // 业绩预告
        case "YJYG":
            href = "http://data.eastmoney.com/bbsj/" + item.gpdm + ".html";
            break;
        // 业绩快报
        case "YJKB":
            href = "http://data.eastmoney.com/bbsj/" + item.gpdm + ".html";
            break;
        // 业绩报表
        case "YJBB":
            href = "http://data.eastmoney.com/bbsj/" + item.gpdm + ".html";
            break;
        // 股本变动
        case "GBBD":
            href = "http://emweb.securities.eastmoney.com/f10_v2/CapitalStockStructure.aspx?type=web&code=" + stockinfo.market + item.gpdm;
            break;
        // 新股
        case "XGSG":
            href = "http://data.eastmoney.com/xg/xg/detail/" + item.gpdm + ".html";
            break;
        // 分红
        case "FHPS":
            href = "http://data.eastmoney.com/yjfp/detail/" + item.gpdm + ".html";
            break;
        // 股东大会
        case "GDDH":
            href = "http://data.eastmoney.com/gddh/list/" + item.gpdm + ".html";
            break;
        // 股东户数
        case "GDHS":
            href = "http://data.eastmoney.com/gdhs/detail/" + item.gpdm + ".html";
            break;
        case "BGCZ":
            href = "http://data.eastmoney.com/bgcz/detail/" + item.gpdm + ".html";
            break;
        //公司投资
        case "GSTZ":
            href = " http://data.eastmoney.com/gstz/stock/" + item.gpdm + ".html";
            break;
        //股权质押
        case "GQZY":
            href = "http://data.eastmoney.com/gpzy/detail/" + item.gpdm + ".html";
            break;
        //委托理财
        case "WTLC":
            href = "http://data.eastmoney.com/wtlc/detail/" + item.gpdm + ".html";
            break;
        //重大合同
        case "ZDHT":
            href = " http://data.eastmoney.com/zdht/detail/" + item.gpdm + ".html";
            break;
        //股票回购
        case "GPHG":
            href = "http://data.eastmoney.com/gphg/" + item.gpdm + ".html";
            break;
        //关联交易
        case "GLJY":
            href = "http://data.eastmoney.com/gljy/detail/" + item.gpdm + ".html";
            break;
        default:
            break;
    }
    return href;
}

/***/ }),

/***/ "./src/modules/old_concept/components/dragbox/loaders/stocknews.render.js":
/*!********************************************************************************!*\
  !*** ./src/modules/old_concept/components/dragbox/loaders/stocknews.render.js ***!
  \********************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "jquery");
var template = __webpack_require__(/*! ../../../modules/template-web */ "./src/modules/old_concept/modules/template-web.js");
var tpl = __webpack_require__(/*! ../templates/stocknews.art */ "./src/modules/old_concept/components/dragbox/templates/stocknews.art");
var render = template.compile(tpl);
var new_news = __webpack_require__(/*! ../../../../new_news/web */ "./src/modules/new_news/web.ts").default

module.exports = {
    load: function (container, config, stockinfo) {
        if (stockinfo.id === '3000592') {
            $.ajax({
                url: '//quote.eastmoney.com/api/static/bulletin/1032',
                dataType: 'jsonp',
                jsonp: 'cb',
                cache: true,
                success: function (data) {
                    if (!data) return false;
                    var $context = $(data);
                    var models = {
                        Status: 0,
                        Data: [],
                        Datalength: $context.find('li').length
                    };
                    $context.find('li').each(function (idx, ele) {
                        var $link = $('a', ele);
                        models.Data.push({
                            Art_Url: $link.prop('href'),
                            Art_Title: $link.text(),
                            Art_ShowTime: ''
                        });
                    });
                    $(container).html(render(models));
                },
                error: function (evt, xhr, opt, err) {
                    $(container).html(render({
                        loading: false
                    }));
                }
            });
        } else {
            new_news.getNews(stockinfo.mktnum + '.' + stockinfo.code, 6).then(function(list){
                var html = render({
                    Data:list,
                    Datalength: list.length
                });
                $(container).html(html);              
            })
            // $.ajax({
            //     url: '//cmsdataapi.eastmoney.com/api/StockNews',
            //     data: {
            //         returnFields: 'Art_Title,Art_ShowTime,Art_Url',
            //         stockCode: stockinfo.code,
            //         stockName: stockinfo.name,
            //         marketType: stockinfo.marketnum,
            //         count: 6
            //     },
            //     dataType: 'jsonp',
            //     jsonp: 'cb',
            //     success: function (json) {
            //         var html = render(json);
            //         $(container).html(html);
            //     },
            //     error: function (evt, xhr, opt, err) {
            //         $(container).html(render({
            //             loading: false
            //         }));
            //     }
            // });
        }
        return render({
            loading: true
        });
    }
}

/***/ }),

/***/ "./src/modules/old_concept/components/dragbox/loaders/stocknotice.render.js":
/*!**********************************************************************************!*\
  !*** ./src/modules/old_concept/components/dragbox/loaders/stocknotice.render.js ***!
  \**********************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "jquery");
var template = __webpack_require__(/*! ../../../modules/template-web */ "./src/modules/old_concept/modules/template-web.js");
// var tpl = require('../templates/stocknotice.art');
var tpl = __webpack_require__(/*! ../templates/stocknoticenew.art */ "./src/modules/old_concept/components/dragbox/templates/stocknoticenew.art");
var render = template.compile(tpl);

module.exports = { 
    // load: function (container, config, stockinfo) {
    //     $.ajax({
    //         url: '//newsnotice.eastmoney.com/webapi/api/Notice?Time=&FirstNodeType=0&SecNodeType=0&PageIndex=1',
    //         data: {
    //             CodeType: stockinfo.jys === '3' ? 6 : stockinfo.jys === '7' ? 7 : 1,
    //             StockCode: stockinfo.code,
    //             PageSize: 6
    //         },
    //         cache: true,
    //         dataType: 'jsonp',
    //         jsonpCallback: 'stocknoticehandler',
    //         success: function (json) { 
    //             var html = render(json);
    //             $(container).html(html);
    //         },
    //         error: function (evt, xhr, opt, err) {
    //             $(container).html(render({
    //                 loading: false
    //             }));
    //         }
    //     });
    //     return render({
    //         loading: true
    //     }); 
    // }

    load: function (container, config, stockinfo) {
        $.ajax({
            url: 'https://np-anotice-stock.eastmoney.com/api/security/ann?cb=?',
            type: 'GET',
            dataType: 'jsonp',
            data: {
                page_size: 6,
                page_index: 1,
                market_code: stockinfo.mktnum,
                stock_list: stockinfo.code,
                client_source: 'web'
            },
            success: function (json) { 
                var html = render(json.data);
                $(container).html(html);
            },
            error: function (evt, xhr, opt, err) {
                $(container).html(render({
                    loading: false
                }));
            }
        })
        return render({
            loading: true
        });
    }
}

/***/ }),

/***/ "./src/modules/old_concept/components/dragbox/loaders sync recursive \\.render.js$":
/*!*******************************************************************************!*\
  !*** ./src/modules/old_concept/components/dragbox/loaders/ sync \.render.js$ ***!
  \*******************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var map = {
	"./capitalflow.render.js": "./src/modules/old_concept/components/dragbox/loaders/capitalflow.render.js",
	"./companydigest.render.js": "./src/modules/old_concept/components/dragbox/loaders/companydigest.render.js",
	"./fake.render.js": "./src/modules/old_concept/components/dragbox/loaders/fake.render.js",
	"./industrynews.render.js": "./src/modules/old_concept/components/dragbox/loaders/industrynews.render.js",
	"./largeshareholders.render.js": "./src/modules/old_concept/components/dragbox/loaders/largeshareholders.render.js",
	"./profittrend.render.js": "./src/modules/old_concept/components/dragbox/loaders/profittrend.render.js",
	"./quartile.render.js": "./src/modules/old_concept/components/dragbox/loaders/quartile.render.js",
	"./relatedboards.render.js": "./src/modules/old_concept/components/dragbox/loaders/relatedboards.render.js",
	"./relatedstocks.render.js": "./src/modules/old_concept/components/dragbox/loaders/relatedstocks.render.js",
	"./stagechange.render.js": "./src/modules/old_concept/components/dragbox/loaders/stagechange.render.js",
	"./stockcalendar.render.js": "./src/modules/old_concept/components/dragbox/loaders/stockcalendar.render.js",
	"./stocknews.render.js": "./src/modules/old_concept/components/dragbox/loaders/stocknews.render.js",
	"./stocknotice.render.js": "./src/modules/old_concept/components/dragbox/loaders/stocknotice.render.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/modules/old_concept/components/dragbox/loaders sync recursive \\.render.js$";

/***/ }),

/***/ "./src/modules/old_concept/components/dragbox/main.js":
/*!************************************************************!*\
  !*** ./src/modules/old_concept/components/dragbox/main.js ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "jquery");
var template = __webpack_require__(/*! ../../modules/template-web */ "./src/modules/old_concept/modules/template-web.js");
var popup = __webpack_require__(/*! ../popup/popup */ "./src/modules/old_concept/components/popup/popup.js");
var configs = __webpack_require__(/*! ./dragbox.cfg.json */ "./src/modules/old_concept/components/dragbox/dragbox.cfg.json");
var maintpl = __webpack_require__(/*! ./templates/box.art */ "./src/modules/old_concept/components/dragbox/templates/box.art");
var loaders = __webpack_require__("./src/modules/old_concept/components/dragbox/loaders sync recursive \\.render.js$");
var utils = __webpack_require__(/*! ../../modules/utils */ "./src/modules/old_concept/modules/utils.js");
var supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;

// require('./dragbox.css');
__webpack_require__(/*! ./jquery-dad/jquery.dad */ "./src/modules/old_concept/components/dragbox/jquery-dad/jquery.dad.js");
// require('./jquery-dad/jquery.dad.css');

$.extend(template.defaults.imports, utils);

function blocks(args) {
    var self = this;
    this.keys = [], this.occupied = 0;
    this.options = $.extend({
        container: '#optional-blocks',
        addbtn: '<div id="modules-plus" class="add-list"><div class="add-modal">+</div></div>',
        popup: '{{each cfgs[0]}}<dl class="clearfix"><dt class="items-type">{{$value.type}}</dt>{{each $value.data}}<dd data-key="{{$value.id}}" class="showModal-list {{$value.show}}">{{@ $value.title}}</dd>{{/each}}</dl>{{/each}}',
        storageKey: 'optional',
        onmoved: function () {
            self.save.apply(self);
        },
        stockentry: window.stockentry
    }, args);
    this.entry = this.options.stockentry;
    this.container = $(this.options.container);
    this.templateRender = template.compile(maintpl);

    this.addevent = function (event) {
        var $this = $(this);
        if ($this.hasClass('active')) return false;
        $this.addClass('active');
        var selected = [],
            model = {};
        models = [];
        for (var key in configs) {
            if (configs.hasOwnProperty(key)) {
                var cfg = configs[key];
                if (!model[cfg.type]) {
                    model[cfg.type] = {
                        type: cfg.type,
                        data: [{
                            id: key,
                            title: cfg.label || cfg.title || template.render(cfg.titletpl, self.entry),
                            show: self.keys.indexOf(key) >= 0 ? 'select-li' : ''
                        }]
                    };
                } else {
                    model[cfg.type].data.push({
                        id: key,
                        title: cfg.label || cfg.title || template.render(cfg.titletpl, self.entry),
                        show: self.keys.indexOf(key) >= 0 ? 'select-li' : ''
                    }); 
                }
            }
        }

        models.push(model);        
        console.log(models,'测试')
        var html = template.render(self.options.popup, {
                cfgs: models
            }),
            $dom = $(html);   
        var dels = [],
            adds = [];
        if (!supportsTouch) {
            $('.showModal-list', $dom).hover(function () {
                $(this).addClass('hover');
            }, function () {
                $(this).removeClass('hover');
            });
        }

        $('.showModal-list', $dom).click(function (e) {
            var key = $(this).data('key'),
                idx = self.keys.indexOf(key);
            if ($(this).hasClass('select-li')) {
                $(this).removeClass('select-li');
                if (dels.indexOf(key) < 0) dels.push(key);
            } else {
                $(this).addClass('select-li');
                if (adds.indexOf(key) < 0) adds.push(key);
            }
            return false;
        });
        new popup({
            title: '添加模块',
            content: $dom,
            onconfirm: function (container) {
                for (var i = 0; i < adds.length; i++) {
                    self.add(adds[i], true);
                    self.keys.push(adds[i]);
                }
                for (var i = 0; i < dels.length; i++) {
                    self.remove(dels[i], true);
                }
                self.save();
                showadd.apply(self);
                $this.removeClass('active');
                container.remove();
                return false;
            },
            oncancel: function (container) {
                $this.removeClass('active');
            }
        }).show();
        return false;
    }

    var quartile = loaders('./quartile.render.js');

    if (quartile && typeof quartile.load === 'function') {
        var cnt = '<div class="nocontent">暂无数据</div>';
        try {
            cnt = quartile.load.apply(this, ['#quartile_wrap .quartile-content', '', self.entry]);
        } catch (e) {
            console.error(e);
            $('#quartile_wrap .quartile-content').html(cnt)
        }
    }
}

/**
 * 默认显示模块的键
 */
blocks.defaultKeys = (function () {
    var keys = [];
    for (var key in configs) {
        if (configs.hasOwnProperty(key)) {
            var element = configs[key];
            if (element.default) keys.push(key);
        }
    }
    return keys;
})();

/**
 * 特殊模块的键
 */
blocks.specialBlocks = (function () {
    var keys = [];
    for (var key in configs) {
        if (configs.hasOwnProperty(key)) {
            var element = configs[key];
            if (element.occupy > 1) keys.push(key);
        }
    }
    return keys;
})();

blocks.modulecache = new utils.ObjectCache();

/**
 * 加载模块
 */
blocks.prototype.load = function () {
    this.occupied = 0;
    var sks = loadcfg(this.options.storageKey),
        keys = this.keys = $.extend([], blocks.defaultKeys);
    if (typeof sks === 'string') {
        keys = this.keys = sks.split(',');
    }
    if ($(this.container).length <= 0) return false;
    this.container.unbind().html('');
    for (var i = 0; i < keys.length; i++) {
        this.add(keys[i], true);
    }
    this.save();
    showadd.apply(this);
    dadevent.apply(this);
    return this;

    function loadcfg(key) {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            console.error(e);
        }
        return false;
    }
}

/**
 * 添加模块
 * @param {string} key 唯一键
 * @param {boolean} reload 是否重新加载，是则不检查添加按钮
 */
blocks.prototype.add = function (key, reload) {
    if (!reload && this.keys.indexOf(key) > 0) return this;
    var self = this,
        cfg = configs[key];
    if (!cfg) return false;
    cfg.key = key;
    if (cfg.linktpl) cfg.link = template.render(cfg.linktpl, this.entry);
    if (cfg.titletpl) cfg.title = template.render(cfg.titletpl, this.entry);
    var loaderkey = cfg.loader || './' + key + '.render.js',
        loader = loadModules(loaderkey);
    if (loader && typeof loader.load === 'function') {
        $('#modules-plus').hide();
        var cnt = '<div class="nocontent">暂无数据</div>';
        try {
            cnt = loader.load.apply(this, ['#opt-' + key, cfg, self.entry, blocks.modulecache]);
        } catch (e) {
            console.error(e);
        }
        var _opt = $.extend({
            id: key,
            content: cnt
        }, cfg);
        var $html = $(this.templateRender(_opt));
        $('.close-btn', $html).click(function (e) {
            var $box = $(this).parents('.drag-list');
            var opt = {
                loader: loader,
                dom: $box
            };
            self.remove.apply(self, [key, opt]);
            return false;
        });
        this.occupied += cfg.occupy || 1;
        this.container.append($html);
        if (!reload) {
            this.keys.push(key);
            this.save();
        }
    }
    if (!reload) {
        showadd.apply(this);
    }
    return this;
}

/**
 * 移除模块
 * @param {string} key 唯一键
 * @param {Object} options 配置项
 * @param {HTMLElement|string|JQuery<HTMLElement>} options.dom 当前对象
 * @param {Object} options.loader 模块记载器
 * @param {boolean} options.reload 是否重新加载，是则不检查添加按钮
 */
blocks.prototype.remove = function (key, options) {
    var _opt = $.extend({
        reload: false
    }, options);
    var idx = this.keys.indexOf(key);
    if (idx >= 0 && configs.hasOwnProperty(key)) {
        this.keys.splice(idx, 1);
        this.save();
    }
    var cfg = configs[key],
        id = cfg.id ? cfg.id + '-wrapper' : 'opt-' + key + '-wrapper';
    this.occupied -= cfg.occupy || 1;
    var loader = !_opt.loader ? loadModules(cfg.loader || './' + key + '.render.js') : _opt.loader,
        $dom = !_opt.dom ? $('#' + id) : $(_opt.dom);
    if (loader && typeof loader.destroy === 'function') {
        loader.destroy.apply(this, [$dom, cfg, this.entry, blocks.modulecache])
    } else {
        $dom.remove();
    }
    if (!_opt.reload) showadd.apply(this);
}

/**
 * 重置模块
 */
blocks.prototype.reset = function () {
    this.keys = $.extend([], blocks.defaultKeys);
    this.save();
    this.load();
    return this;
}

/**
 * 保存配置
 */
blocks.prototype.save = function () {
    try {
        localStorage.setItem(this.options.storageKey, this.keys.join(','));
    } catch (e) {
        console.error(e);
    }
    return this;
}

/**
 * 动态加载模块
 * @param {string} key 关键字
 */
function loadModules(key) {
    var cache = blocks.modulecache;
    if (cache.hasOwnProperty(key)) return cache[key];
    var loader = loaders.keys().indexOf(key) >= 0 ? loaders(key) : loaders('./fake.render.js');
    cache[key] = loader;
    return loader;
}

function showadd() {
    var self = this;
    specialBlockReposioning.apply(self);
    //原来逻辑是一排排三个，当为3的倍数时，隐藏添加按钮，if (this.occupied % 3 !== 0) {
    //现在只有一排拍一个，该逻辑去除
    if (true) {
        if ($('#modules-plus').length <= 0) {
            var $btn = $(this.options.addbtn).click(function (e) {
                self.addevent.apply(this, [e]);
            });
            this.container.append($btn);
        } else {
            var $doms = $('.drag-list', this.container);
            $doms.after(function (idx) {
                if ($doms.length - 1 === idx)
                    return $('#modules-plus');
            });
            $('#modules-plus').show();
        }
    } else {}
}

function specialBlockReposioning() {
    var self = this;
    var container = this.container,
        items = $('.drag-list', container).not('.dads-children-clone');
    for (var i = 0; i < blocks.specialBlocks.length; i++) {
        var key = blocks.specialBlocks[i],
            cfg = configs[key];
        var $dom = $('#opt-' + (cfg.id || key) + '-wrapper');
        if ($dom.length > 0) {
            var position;
            items.each(function (idx, ele) {
                if ($(ele).is($dom)) position = idx + 1;
            });
            if (position % 3 === 0) {
                if (items.length !== position) {
                    $dom.insertAfter(items.eq(position));
                }
            }
        }
    }
}

/**
 * 拖动事件
 */
function dadevent() {
    var self = this;
    this.dragarea = this.container.dad({
        target: '.drag-list',
        draggable: '.draggable',
        callback: function (e) {
            var $dom = $(e),
                key = $dom.data('key'),
                idx = self.keys.indexOf(key);
            var newidx;
            $('.drag-list', self.container).each(function (idx, ele) {
                if ($(ele).data('key').indexOf(key) >= 0) {
                    newidx = idx;
                    return false;
                }
            });
            if (newidx < 0) newidx = self.keys.length - 1;
            self.keys.splice(idx, 1);
            self.keys.splice(newidx, 0, key);
            specialBlockReposioning.apply(self);
            self.save.apply(self);
        }
    });
}

module.exports = blocks;

/***/ }),

/***/ "./src/modules/old_concept/components/dragbox/templates sync recursive \\.art$":
/*!***************************************************************************!*\
  !*** ./src/modules/old_concept/components/dragbox/templates/ sync \.art$ ***!
  \***************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var map = {
	"./box.art": "./src/modules/old_concept/components/dragbox/templates/box.art",
	"./capitalflow.art": "./src/modules/old_concept/components/dragbox/templates/capitalflow.art",
	"./companydigest.art": "./src/modules/old_concept/components/dragbox/templates/companydigest.art",
	"./largeshareholders.art": "./src/modules/old_concept/components/dragbox/templates/largeshareholders.art",
	"./profittrend.art": "./src/modules/old_concept/components/dragbox/templates/profittrend.art",
	"./quartile.art": "./src/modules/old_concept/components/dragbox/templates/quartile.art",
	"./relatedboards.art": "./src/modules/old_concept/components/dragbox/templates/relatedboards.art",
	"./relatedstocks.art": "./src/modules/old_concept/components/dragbox/templates/relatedstocks.art",
	"./stagechange.art": "./src/modules/old_concept/components/dragbox/templates/stagechange.art",
	"./stockcalendar.art": "./src/modules/old_concept/components/dragbox/templates/stockcalendar.art",
	"./stocknews.art": "./src/modules/old_concept/components/dragbox/templates/stocknews.art",
	"./stocknotice.art": "./src/modules/old_concept/components/dragbox/templates/stocknotice.art",
	"./stocknoticenew.art": "./src/modules/old_concept/components/dragbox/templates/stocknoticenew.art"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/modules/old_concept/components/dragbox/templates sync recursive \\.art$";

/***/ }),

/***/ "./src/modules/old_concept/components/favourite/main.js":
/*!**************************************************************!*\
  !*** ./src/modules/old_concept/components/favourite/main.js ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "jquery");
var cookie = __webpack_require__(/*! ../../modules/utils.cookie */ "./src/modules/old_concept/modules/utils.cookie.js");
var template = __webpack_require__(/*! ../../modules/template-web */ "./src/modules/old_concept/modules/template-web.js");
var tpl = __webpack_require__(/*! ./favourite.art */ "./src/modules/old_concept/components/favourite/favourite.art");
//var favourite = require('../../modules/favouriteclient');
// var HistoryView = require('../../modules/historyview');
var imgLoader = __webpack_require__(/*! ../../modules/jquery-plugins/jquery.imageloader */ "./src/modules/old_concept/modules/jquery-plugins/jquery.imageloader.js");
var utils = __webpack_require__(/*! ../../modules/utils */ "./src/modules/old_concept/modules/utils.js");
var datatpl = '{{close}}<br>{{changePercent}}';
var user = __webpack_require__(/*! ../../modules/user */ "./src/modules/old_concept/modules/user/index.js");
var getuid = __webpack_require__(/*! ../../modules/user/getuid */ "./src/modules/old_concept/modules/user/getuid.js");
var config = __webpack_require__(/*! ../../config */ "./src/modules/old_concept/config.js");
    
// require('./sidebar.css');
var historyIds = [];
var zxrc = 0; //未登陆用户自选不自刷
var isAbroadIp = false;
module.exports = {
    load: function () {
        var hv = new historyRender();   
        // GetFavorList();  
        // var timer = null;
        // timer = setInterval(function () {
        //     GetFavorList();
        // }, 30000);
        // $("#btn-favor").click(function () {
        //     //clearInterval(timer)
        //     FavorEvent();
        // }); 
        
    }
}

//function imgRender(context) {
//    $('.img-td img', context).each(function (idx, ele) {
//        var src = $(ele).data('src');
//        var newimg = imgLoader({
//            url: src,
//            width: 75,
//            height: 36,
//            success: function (img) {
//                $(ele).replaceWith($(img));
//            }
//        });
//        $(newimg).attr('alt', $(ele).attr('alt')).data('src', src);
//    });
//}
function addPercent(vs) {
    var num = parseFloat(vs), item; 
    if (num == 0) {
        item = num.toFixed(2) + "%"
    } else if (num) {
        var abs = Math.abs(num);
        if (abs >= 1000) { //大于10倍的用倍来表示
           item = (num / 100).toFixed(2)+"倍"
        } else {
           item = num.toFixed(2) + "%";
        }        
    } else {
        item = vs;
    }  
    return item
}


  

// 最近访问跟老版A股一致
function historyRender(options) {
    var self = this;
    var _opt = $.extend({
        container: '#history',
        stockinfo: window.stockentry,
        count: 9,
        update: 30 * 1000
    }, options);
    var ab = ['2', '3', '6', '7', '13', '80'];
    var timer, ids = [],
        stockinfo = _opt.stockinfo,
        arg = { def:'',set:  "a-" + stockinfo.shortmarket + "-" + stockinfo.code+'-'+stockinfo.name , lns: 13}
        hv =  new HistoryViews('history-items',arg),        
        $container = $(_opt.container);       
        $('#history-items').html();
    var hvArr = hv.ret;     
    var $context = null;
    for(var i = 0;i<hvArr.length;i++){
        var arr = hvArr[i].split('-');        
        if (arr[0] && arr[0] !== 'undefined') {
            if (arr[0] === 'sh') {
                var market = "1";
            } else if (arr[0] === 'sz') {
                // var market = "2";
                var market = "0";
            } else {
                var market = arr[0];
            }                 
        };
        if( arr[1] ){ var code  =  arr[1] };

        // ids.push(code + market);
        ids.push(market+'.'+code);
            
    }  
    historyIds = ids;    
    this.load = function () {   
        // var url = '//push2.eastmoney.com/api/qt/ulist.np/get?fields=f12,f13,f14,f2,f1,f3,f152&invt=2&ut=bd1d9ddb04089700cf9c27f6f7426281';
        
        var url = config.getEnvPath("commonApi") + 'api/qt/ulist.np/get?fields=f12,f13,f14,f2,f1,f3,f152&invt=2&ut=bd1d9ddb04089700cf9c27f6f7426281';
        

        $.ajax({
            // url: '//nufm.dfcfw.com/EM_Finance2014NumericApplication/JS.aspx?type=CT&sty=FC20RI&st=z&token=4f1862fc3b5e77c150a2b985b12db0fd&ps=8',
            url:url,
            // data: {
            //     cmd: ids.join(',')
            // },
            data: {
                secids: ids.join(',')
            },
            dataType: 'jsonp',
            jsonp: 'cb',
            success: function (json) {
                // if (json instanceof Array) {
                //     var models = [],historyHtml='';
                //     // 最多显示9条
                //     var mathNum = Math.floor(Math.random() * 100);
                //     for (var i = 0; i < json.length ;i++) {
                //         if (typeof json[i] !== 'string') break;
                //         var items = json[i].split(',');
                //         var model;                         
                //         model = {
                //             id: items[1] + items[0],
                //             code: items[1],
                //             market: items[0] === '1' ? 'sh' : 'sz',
                //             name: items[2],
                //             close: Number(items[3]) >= 0 ? Number(items[3]).toFixed(2) : items[3],
                //             changePercent: addPercent(items[4]),                        
                //             jys: items[6],
                //             dataSrc: "//webquotepic.eastmoney.com/GetPic.aspx?id=" + items[1] + items[0]+"&imageType=RJY&token=44c9d251add88e27b65ed86506f6e5da"+mathNum
                //         }                      
                //         var link = model.market + model.code + '.html';                        
                //         model.link = ab.indexOf(model.jys) >= 0 ? window.root + link : '//quote.eastmoney.com/web/r/' + model.id;
                //         if ($context) {
                //             $('#history-' + model.id + ' .data', $container)
                //                 .removeClass('red green')
                //                 .addClass(utils.getColor(model.changePercent))
                //                 .html(template.render(datatpl, model));
                //         }
                //         historyHtml += ' <a href="' + model.link + '" target="_blank">' + model.name + '</a>';
                //         if(i < _opt.count){
                //             models.push(model);
                //         }
                //     }     
                //     $('#history-items').html(historyHtml);                                
                //     if (!$context) {
                //         var html = template.render(tpl, {
                //             data: models,
                //             container: 'history'
                //         })
                //         var $context = $(html);
                //         $container.html($context);
                //     }
                //     //imgRender($context);
                // }
                if (json && json.data && json.data.diff && json.data.diff instanceof Array) {
                    var models = [],historyHtml='';
                    // 最多显示9条
                    var mathNum = Math.floor(Math.random() * 100);
                    for (var i = 0; i < json.data.total ;i++) {
                        // if (typeof json[i] !== 'string') break;
                        var items = json.data.diff[i];
                        var model;                         
                        model = {
                            nid: items.f13 + '.'+items.f12,
                            code: items.f12,
                            market: items.f13 === '1' ? 'sh' : 'sz',
                            name: items.f14,
                            close: items.f2=='-'?'-':(items.f2*Math.pow(10,-items.f1)).toFixed(items.f1),
                            changePercent: addPercent(items.f3=='-'?'-':items.f3*Math.pow(10,-items.f152).toFixed(items.f152)),                        
                            jys: items.f152,
                            dataSrc: "//webquotepic.eastmoney.com/GetPic.aspx?nid=" + items.f13 + '.'+items.f12+"&imageType=RJY&token=44c9d251add88e27b65ed86506f6e5da"+mathNum
                        }                      
                        var link = model.market + model.code + '.html';                        
                        model.link = ab.indexOf(model.jys) >= 0 ? window.root + link : '//quote.eastmoney.com/unify/cr/' + model.nid;
                        if ($context) {
                            $('#history-' + model.nid + ' .data', $container)
                                .removeClass('red green')
                                .addClass(utils.getColor(model.changePercent))
                                .html(template.render(datatpl, model));
                        }
                        historyHtml += ' <a href="' + model.link + '" target="_blank">' + model.name + '</a>';
                        if(i < _opt.count){
                            models.push(model);
                        }
                    }     
                    $('#history-items').html(historyHtml);                                
                    if (!$context) {
                        var html = template.render(tpl, {
                            data: models,
                            container: 'history'
                        })
                        var $context = $(html);
                        $container.html($context);
                    }
                    //imgRender($context);
                }
            }
        });
        return this;        
    }

    this.init = function () {
        clearInterval(timer);
        if (_opt.update > 0) {
            timer = setInterval(this.load, _opt.update);
            var _this = this;
            $('#quote-time').on('tick', function (e, time, status) {                     
                if (status === 'close') {
                    clearInterval(timer); 
                    $("#favor-his-wrapper .tab-nav li").eq(1).mouseover(function () {
                        _this.load();
                    });
                }
            });    
           
        }           
        this.load();
       
    }
    this.init();
}






/***/ }),

/***/ "./src/modules/old_concept/components/fullscreenchart/fschart.js":
/*!***********************************************************************!*\
  !*** ./src/modules/old_concept/components/fullscreenchart/fschart.js ***!
  \***********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// require('./fschart.css');

var $ = __webpack_require__(/*! jquery */ "jquery");
/**
 * 全屏大图加载器
 * @typedef {{code: string, id: string, name: string, market: string, marketnum: number}} StockInfo
 * @param {object} options 配置
 * @param {StockInfo} options.stockentry 股票入口
 * @param {object} options.chartOptions 行情图配置
 * @param {string|JQuery<HTMLElement>} options.btn 按钮
 * @param {string|JQuery<HTMLElement>} options.content 内容
 */
module.exports = function (options) {
    var orgin = location.protocol + '//' + location.host;
    var _opt = $.extend({
        btn: $('#full-screen-btn'),
        content: $('<div class="fs-wrapper"><div class="mark-box"></div><div class="full-box"><span class="full-close">×</span><iframe></iframe></div><div>')
    }, options);
    var self = this;

    /**
     * 绑定
     */
    this.bind = function () {
        $(_opt.btn).click(self.open);
        if (location.hash.toLowerCase().indexOf('#fschart') === 0 && _opt.chartOptions) {
            var type = location.hash.split('-')[1];
            if (type === 'cr') {
                _opt.chartOptions.type = 'r';
                _opt.chartOptions.iscr = true;
            } else if (type) {
                _opt.chartOptions.type = type;
            }
            $(_opt.btn).click();
        }
        return this;
    }

    /**
     * 关闭
     */
    this.close = function () {
        $(_opt.content).remove();
        $(document).unbind('keyup', keyupevt);
        $(window).unbind('message', receiveMsg);
        location.hash = '';
    }
    
    /**
     * 打开
     * @param {Event} e 事件
     */
    this.open = function (e) {
        var $ctx = $(_opt.content);
        var height = $(window).height() - 33 - 10;
        var type = _opt.chartOptions.iscr ? 'cr' : _opt.chartOptions.type; 

        var iframe_src = '//quote.eastmoney.com/basic/h5chart-iframe.html?code=' + _opt.stockentry.code + '&market=' + _opt.stockentry.marketnum + '&type=' + type;
        //测试用
        // if (window.location.host != 'quote.eastmoney.com'){
        //     iframe_src = window.location.origin + '/fullscreen/h5chart.html?code=' + _opt.stockentry.code + '&market=' + _opt.stockentry.marketnum + '&type=' + type;
        // } 
        
        if (window.location.host != 'quote.eastmoney.com' && window.location.host != 'quotetest.eastmoney.com'){
            if (stockentry && stockentry.jys == '80'){
            iframe_src = window.location.origin + '/fullscreen/h5chart.html?code=' + _opt.stockentry.code + '&market=' + _opt.stockentry.marketnum + '&type=' + type;
        };
        }
        //创业板
        


        $('iframe', $ctx).height(height).attr('src', iframe_src).load(function () {
            this.contentWindow.postMessage('connecting', orgin);
        });
        $('.full-close', $ctx).click(function () {
            self.close();
        });
        $(document).keyup(keyupevt);
        $(window).on('message', receiveMsg);
        $('body').append($ctx);
        location.hash = 'fschart-' + type;
    }

    function keyupevt(e) {
        if (e.which === 27) {
            self.close();
        }
    }

    function receiveMsg(evt) {
        var event = evt.origin ? evt : evt.originalEvent;
        if (event.origin !== orgin) return;
        switch (event.data) {
            case '--close':
                self.close();
                break;
        }
    }
}

/***/ }),

/***/ "./src/modules/old_concept/components/mocktrade/mock.js":
/*!**************************************************************!*\
  !*** ./src/modules/old_concept/components/mocktrade/mock.js ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "jquery");
var html = __webpack_require__(/*! ./mock.art */ "./src/modules/old_concept/components/mocktrade/mock.art");
var cache = __webpack_require__(/*! ../../modules/utils.cache */ "./src/modules/old_concept/modules/utils.cache.js");
var isProd = environment === 'production';
var domain = isProd ? 'group.eastmoney.com' : 'grouptest.eastmoney.com';
// require('./mock.css');

function open(args) {
    var _opt = $.extend({
        code: stockentry.code,
        mkt: stockentry.marketnum,
        jys: stockentry.jys,
        zt: $('#quote-raisePrice-main').html(),
        dt: $('#quote-fallPrice-main').html(),
        dir: 1,
        price: cache.default[43] || cache.default[60]
    }, args);

    var $dom = $('#mocktrade-wrapper');
    if ($('#mocktrade-wrapper').length === 0) {
        $dom = $(html);
        $(window).resize(function () {
            setposition($dom);
        });
        $('.btn-close', $dom).click(function () {
            close();
            return false;
        });
        $('.btn-switch', $dom).click(function () {
            switchstate.apply(this);
            return false;
        });
        var url = '//' + domain + '/plug/';
        $('iframe', $dom).attr('src', url).load(function (e) {
            sendMessage.apply(this, [_opt]);
        });
        $('body').append($dom);
        setposition($dom);
        $(window).on('message', receiveMessage);
    } else {
        $dom.show();
        stretch.apply(this);
        sendMessage.apply($('iframe', $dom), [_opt]);
    }
}

function sendMessage(args) {
    if ($(this).length <= 0) return false;
    var client = $(this)[0].contentWindow;
    if (!client) return false;
    if (isNaN(args.price)) args.price = cache.default[43] || cache.default[60];
    var cmd = JSON.stringify(args);
    client.postMessage(cmd, '*');
}

function receiveMessage(e) {
    var event = e.origin ? e : e.originalEvent;
    if (event.origin !== location.protocol + '//' + domain) return;
    switch (event.data.toLowerCase()) {
        case '--login':
            location.hash = '#mocktrading';
            location.href = 'https://passport2.eastmoney.com/pub/login?backurl=' + encodeURIComponent(location.href);
            break;
        case '--nozjzh':
            window.open('http://group.eastmoney.com/CreateCom.html');
            close();
            break;
        case '--restore':
            stretch();
            break;
        case '--close':
            close();
            break;
        default:
            break;
    }
}

function setposition(context) {
    var cw = document.body.scrollWidth;
    var pos = (cw - 1200) / 2;
    $('.iframe-btn', context).css('right', pos < 0 ? 0 : pos);
}

function close() {
    $('#mocktrade-wrapper').remove();
    $(window).unbind('message', receiveMessage);
    if (location.hash === '#mocktrading') {
        location.hash = '';
    }
}

function switchstate() {
    if ($(this).find('b').hasClass('icon-yc1')) {
        $(this).find('b').removeClass('icon-yc1').addClass('icon-yc2');
        $('.iframe-box', $('#mocktrade-wrapper')).animate({
            height: 50
        });
        $('.btn-switch b', $('#mocktrade-wrapper')).attr('title', '还原');
    } else {
        $(this).find('b').removeClass('icon-yc2').addClass('icon-yc1');
        $('.iframe-box', $('#mocktrade-wrapper')).animate({
            height: 320
        });
        $('.btn-switch b', $('#mocktrade-wrapper')).attr('title', '最小化');
    }
}

function stretch() {
    var $dom = $('#mocktrade-wrapper');
    if (!$('.btn-switch b', $dom).hasClass('icon-yc1')) {
        $('.btn-switch b', $dom).removeClass('icon-yc2').addClass('icon-yc1');
        $('.iframe-box', $('#mocktrade-wrapper')).animate({
            height: 320
        });
        $('.btn-switch b', $dom).attr('title', '最小化');
    }
}

function shrink() {
    var $dom = $('#mocktrade-wrapper');
    if ($('.btn-switch b', $dom).hasClass('icon-yc1')) {
        $('.btn-switch b', $dom).removeClass('icon-yc1').addClass('icon-yc2');
        $('.iframe-box', $('#mocktrade-wrapper')).animate({
            height: 50
        });
        $('.btn-switch b', $dom).attr('title', '还原');
    }
}

module.exports = {
    open: open,
    stretch: stretch,
    shrink: shrink,
    close: close
};

/***/ }),

/***/ "./src/modules/old_concept/components/popup/drag.js":
/*!**********************************************************!*\
  !*** ./src/modules/old_concept/components/popup/drag.js ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "jquery");
var supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
//定义的构造函数
var Drag = function (ele, opt) {
	this.$ele = ele,
		this.x = 0,
		this.y = 0,
		this.defaults = {
			parent: 'parent',
			randomPosition: false,
			direction: 'all',
			handler: false,
			dragStart: function (x, y) {},
			dragEnd: function (x, y) {},
			dragMove: function (x, y) {}
		},
		this.options = $.extend({}, this.defaults, opt)
}
//定义方法
Drag.prototype = {
	run: function () {
		var $this = this;
		var element = this.$ele;
		var randomPosition = this.options.randomPosition; //位置
		var direction = this.options.direction; //方向
		var handler = this.options.handler;
		var parent = this.options.parent;
		var isDown = false; //记录鼠标是否按下
		var fun = this.options; //使用外部函数
		var X = 0,
			Y = 0,
			moveX,
			moveY;
		// 阻止冒泡
		element.find('*').not('img').mousedown(function (e) {
			e.stopPropagation();
		});
		//初始化判断
		if (parent == 'parent') {
			parent = element.parent();
		} else {
			parent = element.parents(parent);
		}
		if (!handler) {
			handler = element;
		} else {
			handler = element.find(handler);
		}
		//初始化
		parent.css({
			//position: 'relative'
		});
		element.css({
			position: 'absolute'
		});
		var boxWidth = 0,
			boxHeight = 0,
			sonWidth = 0,
			sonHeight = 0;
		//盒子 和 元素大小初始化
		initSize();
		if (randomPosition) {
			randomPlace();
		}
		$(window).resize(function () {
			initSize();
			if (randomPosition) {
				randomPlace();
			}
		});
		//盒子 和 元素大小初始化函数
		function initSize() {
			boxWidth = parent.outerWidth();
			boxHeight = parent.outerHeight();
			sonWidth = element.outerWidth();
			sonHeight = element.outerHeight();
		}
		//位置随机函数
		function randomPlace() {
			if (randomPosition) {
				var randX = parseInt(Math.random() * (boxWidth - sonWidth));
				var randY = parseInt(Math.random() * (boxHeight - sonHeight));
				if (direction.toLowerCase() == 'x') {
					element.css({
						left: randX
					});
				} else if (direction.toLowerCase() == 'y') {
					element.css({
						top: randY
					});
				} else {
					element.css({
						left: randX,
						top: randY
					});
				}
			}
		}
		handler.css({
			cursor: 'move'
		}).on('mousedown touchstart', function (e) {
			var evt = e;
			if (supportsTouch && e.type == 'touchstart') {
				evt = e.originalEvent.touches[0];
			}
			isDown = true;
			X = evt.pageX;
			Y = evt.pageY;
			$this.x = element.position().left;
			$this.y = element.position().top;
			element.addClass('on');
			fun.dragStart.apply(this, [parseInt(element.css('left')), parseInt(element.css('top'))]);
			$(document).bind('mousemove touchmove', onmove);
			return false;
		})
		$(document).on('mouseup touchend', function (e) {
			fun.dragEnd.apply(this, [parseInt(element.css('left')), parseInt(element.css('top'))]);
			element.removeClass('on');
			$(document).unbind('mousemove touchmove', onmove);
			isDown = false;
		});

		function onmove(e) {
			var evt = e;
			if (supportsTouch && e.type == 'touchmove') {
				evt = e.originalEvent.touches[0];
			}
			moveX = $this.x + evt.pageX - X;
			moveY = $this.y + evt.pageY - Y;

			function thisXMove() { //x轴移动
				if (isDown == true) {
					element.css({
						left: moveX
					});
				} else {
					return;
				}
				if (moveX < 0) {
					element.css({
						left: 0
					});
				}
				if (moveX > (boxWidth - sonWidth)) {
					element.css({
						left: boxWidth - sonWidth
					});
				}
				return moveX;
			}

			function thisYMove() { //y轴移动
				if (isDown == true) {
					element.css({
						top: moveY
					});
				} else {
					return;
				}
				if (moveY < 0) {
					element.css({
						top: 0
					});
				}
				if (moveY > (boxHeight - sonHeight)) {
					element.css({
						top: boxHeight - sonHeight
					});
				}
				return moveY;
			}

			function thisAllMove() { //全部移动
				if (isDown == true) {
					element.css({
						left: moveX,
						top: moveY
					});
				} else {
					return;
				}
				if (moveX < 0) {
					element.css({
						left: 0
					});
				}
				if (moveX > (boxWidth - sonWidth)) {
					element.css({
						left: boxWidth - sonWidth
					});
				}
				if (moveY < 0) {
					element.css({
						top: 0
					});
				}
				if (moveY > (boxHeight - sonHeight)) {
					element.css({
						top: boxHeight - sonHeight
					});
				}
			}
			if (isDown) {
				fun.dragMove.apply(element, [parseInt(element.css('left')), parseInt(element.css('top'))]);
			} else {
				return true;
			}
			if (direction.toLowerCase() == "x") {
				thisXMove();
			} else if (direction.toLowerCase() == "y") {
				thisYMove();
			} else {
				thisAllMove();
			}
			
		}
		//$(document).mousemove(fnm = );
	}
}

//插件
$.fn.dragging = function (options) {
	//创建实体
	var drag = new Drag(this, options);
	//调用方法
	drag.run();
	return this;
}

module.exports = Drag;

/***/ }),

/***/ "./src/modules/old_concept/components/popup/popup.js":
/*!***********************************************************!*\
  !*** ./src/modules/old_concept/components/popup/popup.js ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// require('./popup.css');

var $ = __webpack_require__(/*! jquery */ "jquery");
var template = __webpack_require__(/*! ../../modules/template-web */ "./src/modules/old_concept/modules/template-web.js");
var tpl = __webpack_require__(/*! ./popup.art */ "./src/modules/old_concept/components/popup/popup.art");

__webpack_require__(/*! ./drag */ "./src/modules/old_concept/components/popup/drag.js");

var render = template.compile(tpl);

/**
 * 弹窗
 * @param {object} options 选项
 * @param {string} options.title 标题(HTML)
 * @param {string} options.content 内容(HTML)
 * @param {string} options.confirm 确认按钮(HTML) [必须包含.showModal-confirm]
 * @param {boolean} options.closeOnConfirmed 确认后是否关闭窗口
 * @param {string} options.css 类
 * @param {boolean} options.destroy 关闭是否销毁
 * @param {function} options.onconfirm 确认回调
 * @param {function} options.oncancel 关闭回调
 */
function popup(options) {
    var self = this;
    var _opt = $.extend({
        title: '',
        content: '',
        confirm: '<a href="" class="showModal-confirm" target="_blank">确定</a>',
        closeOnConfirmed: true,
        css: '',
        dragable: true,
        destroy: true,
        onconfirm: null,
        oncancel: null
    }, options);
    var $container;
    /**
     * 预加载，生成DOM
     */
    this.preload = function () {
        if (_opt.content instanceof $) {
            var $cnt = _opt.content;
            _opt.content = '';
            $container = $(render(_opt)).hide();
            $('.showModal-con', $container).append($cnt);
        } else {
            var html = render(_opt);
            $container = $(html).hide();
        }
        $('.tc-close', $container).click(function (e) {
            if (typeof _opt.oncancel === 'function') {
                _opt.oncancel.apply(this, [$container]);
            }
            self.close();
            return false;
        });
        $('.showModal-confirm', $container).click(function () {
            if (typeof _opt.onconfirm === 'function') {
                var ret = _opt.onconfirm.apply(this, [$container]);
                if (typeof ret === 'boolean' && !ret) return false;
            }
            if(_opt.closeOnConfirmed) self.close();
            return !!$(this).attr('href');
        });
        $('body').append($container);
        return this;
    }
    /**
     * 显示弹窗
     */
    this.show = function () {
        if (!$container) self.preload();
        $container.show();
        this.repositioning();
        if (_opt.dragable) {
            $container.dragging({
                direction: 'all',
                handler: '.showModal-title .draggable'
            });
        }
        return this;
    }
    /**
     * 重新定位，屏幕局长
     */
    this.repositioning = function () {
        var margin = parseFloat($('body').css('margin-top')),
            top = ($(window).height() - $container.outerHeight(true)) / 2 + $(document).scrollTop();
        $container.css({
            'position': 'absolute',
            'top': top < margin ? margin : top,
            'left': (document.body.scrollWidth - $container.outerWidth(true)) / 2
        });
        return this;
    }
    /**
     * 关闭
     */
    this.close = function () {
        if ($container) {
            if (_opt.destroy) $container.remove();
            else $container.hide();
        }
        return this;
    }
}

module.exports = popup;

/***/ }),

/***/ "./src/modules/old_concept/components/quote-push/changes.js":
/*!******************************************************************!*\
  !*** ./src/modules/old_concept/components/quote-push/changes.js ***!
  \******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "jquery");
var utils = __webpack_require__(/*! ../../modules/utils.extend */ "./src/modules/old_concept/modules/utils.extend.js");
var qcscroll = __webpack_require__(/*! ../../modules/qcsroll */ "./src/modules/old_concept/modules/qcsroll.js");
var template = __webpack_require__(/*! ../../modules/template-web */ "./src/modules/old_concept/modules/template-web.js");
var tpl = __webpack_require__(/*! ./positionchanges.art */ "./src/modules/old_concept/components/quote-push/positionchanges.art");

// require('./scrollmsg.css');

function changes(args) {
    var _opt = getoptions(args);
    var self = this;
    var timer, scroller;
    this.load = function () {
        this.stop();
        var jqXHR = $.ajax(_opt.ajax);
        if (_opt.update > 0) {
            timer = setInterval(function () {
                if (jqXHR) jqXHR.abort();
                jqXHR = $.ajax(_opt.ajax);
            }, _opt.update);
        }
    }

    this.stop = function () {
        clearInterval(timer);
    }

    function render(json) {
        if ($(_opt.container).length === 0) return false;
        if (json.data.pkyd instanceof Array) {
            var models = {};
            models.data = [];
            for (var i = 0; i < json.data.pkyd.length; i++) {
                var line = json.data.pkyd[i];
                if (typeof line !== 'string') continue;
                var items = line.split(',');
                if(items[4]==1){
                    ydtype = '有大买盘'
                }
                if(items[4]==2){
                    ydtype = '大笔买入'
                }
                if(items[4]==101){
                    ydtype = '有大卖盘'
                }
                if(items[4]==102){
                    ydtype = '大笔卖出'
                }
                if(items[4]==201){
                    ydtype = '封涨停板'
                }
                if(items[4]==202){
                    ydtype = '打开涨停'
                }
                if(items[4]==203){
                    ydtype = '高开5日线'
                }
                if(items[4]==204){
                    ydtype = '60日新高'
                }
                if(items[4]==301){
                    ydtype = '封跌停板'
                }
                if(items[4]==302){
                    ydtype = '打开跌停'
                }
                if(items[4]==303){
                    ydtype = '低开5日线'
                }
                if(items[4]==304){
                    ydtype = '60日新低'
                }
                if(items[4]==401){
                    ydtype = '向上缺口'
                }
                if(items[4]==402){
                    ydtype = '火箭发射'
                }
                if(items[4]==403){
                    ydtype = '快速反弹'
                }
                if(items[4]==404){
                    ydtype = '竞价上涨'
                }
                if(items[4]==405){
                    // ydtype = '60日大幅上涨'
                    ydtype = '大幅上涨'
                }
                if(items[4]==501){
                    ydtype = '向下缺口'
                }
                if(items[4]==502){
                    ydtype = '高台跳水'
                }
                if(items[4]==503){
                    ydtype = '快速下跌'
                }
                if(items[4]==504){
                    ydtype = '竞价下跌'
                }
                if(items[4]==505){
                    // ydtype = '60日大幅下跌'
                    ydtype = '大幅下跌'
                }
                var markets = items[2]=='1'?'sh':'sz'
                models.data.unshift({
                    id: markets+items[1],
                    time: items[0],
                    name: items[3],
                    type: ydtype,
                    desc: items[5],
                    color: items[6] === '1' ? 'red' : 'green'
                });
            }
            $(_opt.container).html(template.render(tpl, models));
            if (scroller) scroller.cancel();
            scroller = new qcscroll($(_opt.container)[0]);
            scroller.animate();
        }
        if (typeof _opt.oncomplete === 'function') {
            _opt.oncomplete.apply(self, [json, _opt]);
        }
    }

    function onerror(jqXHR, textStatus, error) {
        console.error(error);
    }

    function getoptions(args) {
        return utils.extend({
            container: '#scroll-changes',
            ajax: {
                // url: '//nuyd.eastmoney.com/EM_UBG_PositionChangesInterface/api/js?style=top&ac=normal&check=itntcd&dtformat=HH:mm:ss&num=50&js=([(x)])',
                url:'//push2.eastmoney.com/api/qt/pkyd/get?ut=fa5fd1943c7b386f172d6893dbfba10b&lmt=50&fields=f1,f2,f3,f4,f5,f6,f7',
                dataType: 'jsonp',
                jsonp: 'cb',
                success: render,
                error: onerror
            },
            oncomplete: null,
            update: 20 * 1000,
        }, args);
    }
}

module.exports = changes;

/***/ }),

/***/ "./src/modules/old_concept/components/quote-push/configs.js":
/*!******************************************************************!*\
  !*** ./src/modules/old_concept/components/quote-push/configs.js ***!
  \******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "jquery");
var utils = __webpack_require__(/*! ../../modules/utils */ "./src/modules/old_concept/modules/utils.js");
var cache = utils.ObjectCache.default;

/**
 * 默认数据比较器
 * @param {string|number} data 数据
 */
function defaultComparer(data) {
    return data - cache[60];
}

function beforePageLoad(data, fields) {
    var self = this;
    var $doms = cache.getOrAdd('__doms__', $('#quote-s5d,#quote-s4d,#quote-s3d,#quote-s2d,#quote-s1d,#quote-b1d,#quote-b2d,#quote-b3d,#quote-b4d,#quote-b5d'));
    var amounts = ['2', '4', '6', '8', '10', '12', '14', '16', '18', '20', '22', '24', '26', '28', '30', '32', '34', '36', '38', '40'];
    var changed = false;
    for (key in data) {
        if (amounts.indexOf(key) >= 0) {
            changed = true;
            break;
        }
    }
    if (changed) {
        $doms.html('');
    }
}

/**
 * 默认字段定义
 */
var fields = [{
        // 代码
        idx: 57,
        dom: $('#quote-code'),
        handler: function (data) {
            if (typeof data === 'string') return data.substr(2, data.length - 2);
            else return data;
        }
    }, {
        // 名称
        idx: 58,
        dom: $('#quote-name')
    }, {
        // 小数位数
        idx: 59,
        handler: function (data) {
            cache.set('offset', data || 2);
            cache.set('fact', (1 / Math.pow(10, data)) || 0.01);
            return data || 2;
        }
    }, {
        // 交易时间
        idx: 80
    }, {
        // 昨收
        idx: 60,
        dom: '#quote-pc',
        decimal: true,
        render:function($dom, data){
            if (!cache[43] || isNaN(cache[43])){
                $('#quote-close-main').html(data);
            }
            $($dom).html(data);
        }
    }, {
        //停牌标识
        idx: 78,
        dom: $("#quote-close-tp"),
        render: function ($dom, data) {            
            if (!cache[60] || isNaN(data)) return;
            if (data != 0) {
                $dom.html("停牌");
                $('#quote-close-main').html(cache[60]);               
            }
        }

    }, {
        // 现价
        idx: 43,
        dom: '#quote-close-main, #quote-close-custom',
        decimal: true,
        hasColor: true,
        blink: {
            doms: [$('#quote-close-main')[0], $('#quote-change-main')[0], $('#quote-changePercent-main')[0], $('#quote-close')[0]]
        },
        comparer: defaultComparer,
        render: function ($dom, data, fields, context) {           
            if (!cache[60] || isNaN(data)) return;   
            $dom.html(data).trigger('tsq.change', [data, fields, context]);
            var zd = defaultComparer(data),
                change = (data - cache[60]).toFixed(cache['offset']),
                changePercent = (change / cache[60] * 100).toFixed(cache['offset']);
            if (zd > 0) {
                $('#quote-arrow').removeClass().addClass('icon-big-arrow-up');
            } else if (zd < 0) {
                $('#quote-arrow').removeClass().addClass('icon-big-arrow-down');
            } else {
                $('#quote-arrow').removeClass();
            }
            $('#quote-change-main').html(change).removeClass('red green').addClass(utils.getColor(zd));
            $('#quote-changePercent-main,#quote-changePercent-block')
                .html(changePercent + '%')
                .removeClass('red green')
                .addClass(utils.getColor(zd));
            document.title = cache[58] + data + ' ' + change + '(' + changePercent + '%)' + '_股票价格_行情_走势图—东方财富网';



        }
    }, {
        // 行情时间
        idx: 86,
        dom: $('#quote-time'),
        handler: function (data) {
            if (!data) return NaN;
            return new Date(data * 1000);
        },
        render: function ($dom, data, field, handler) {
            $dom.html(utils.formatDate(data, 'yyyy-MM-dd HH:mm:ss')); //yyyy-MM-dd EEE HH:mm:ss
            var stopped = false;
            if (cache[80]) {
                var hm = utils.formatDate(data, 'HHmm');
                if (hm < cache[80]['ocat'] || hm > cache[80]['ctpm']) {
                    handler.status = cache['status'] = 'close';
                    stopped = hm > cache[80]['ctpm'];
                } else if (hm > cache[80]['ctam'] && hm < cache[80]['otpm']) {
                    handler.status = cache['status'] = 'middle-close';
                } else if (hm >= cache[80]['ocat'] && hm < cache[80]['otam']) {
                    handler.status = cache['status'] = 'pre';
                } else if (hm >= cache[80]['otam'] && hm <= cache[80]['ctam'] || hm >= cache[80]['otpm'] && hm <= cache[80]['ctpm']) {
                    handler.status = cache['status'] = 'open';
                }
            }
            $dom.trigger('tick', [data, cache['status']]);
            if (handler.stopWithoutQuote && stopped) {
                handler.stop();
            }
        }
    }, {
        // 开盘价
        idx: 46,
        dom: '#quote-open-custom',
        hasColor: true,
        decimal: true,
        comparer: defaultComparer
    }, {
        // 最高价
        idx: 44,
        dom: '#quote-high-custom',
        hasColor: true,
        blink: true,
        decimal: true,
        comparer: defaultComparer
    }, {
        // 最低价
        idx: 45,
        dom: '#quote-low-custom',
        hasColor: true,
        blink: true,
        decimal: true,
        comparer: defaultComparer
    }, {
        // 涨停
        idx: 51,
        dom: '#quote-raisePrice-main,#quote-raisePrice-custom',
        hasColor: true,
        blink: true,
        decimal: true,
        comparer: defaultComparer
    }, {
        // 跌停
        idx: 52,
        dom: '#quote-fallPrice-main,#quote-fallPrice-custom',
        hasColor: true,
        blink: true,
        decimal: true,
        comparer: defaultComparer
    }, {
        // 量比
        idx: 50,
        dom: '#quote-volumeRate, #quote-volumeRate-custom',
        blink: true,
        handler: function (data) {
            return (data / 10000).toFixed(2);
        }
    }, {
        // 成交量
        idx: 47,
        dom: '#quote-volume-custom',
        blink: true,
        numbericFormat: true,
        render: function ($dom, data) {
            $dom.html(data + '手');
        }
    }, {
        // 成交额
        idx: 48,
        dom: '#quote-amount-custom',
        blink: true,
        numbericFormat: true
    }, {
        // 外盘
        idx: 49,
        dom: '#quote-buyOrder, #quote-buyOrder-custom',
        blink: true,
        hasColor: true,
        comparer: 1,
        numbericFormat: true
    }, {
        // 均价
        idx: 71,
        dom: '#quote-avg',
        blink: true,
        hasColor: true,
        decimal: true,
        comparer: defaultComparer
    }, {
        // 总股本
        idx: 84,
        dom: '#quote-totalShare,#quote-totalShare-custom,#data-totalShare',
        blink: true,
        numbericFormat: true
    }, {
        // 流通股本
        idx: 85,
        dom: '#quote-flowCapital,#quote-flowCapital-custom,#data-flowCapital',
        blink: true,
        numbericFormat: true
    }, {
        // 买一价
        idx: 19,
        dom: $('#quote-b1p'),
        decimal: true,
        hasColor: true,
        blink: true,
        onerror: SuppressedValueHanlder,
        comparer: defaultComparer,
        render: QuotePriceRender
    }, {
        // 买一量
        idx: 20,
        dom: $('#quote-b1v'),
        onerror: SuppressedValueHanlder,
        blink: true,
        render: QuoteVolumnRender
    }, {
        // 买一差量
        idx: 98,
        dom: $('#quote-b1d'),
        hasColor: true,
        //onerror: SuppressedValueHanlder,
        render: OrderDiff
    }, {
        // 买二价
        idx: 17,
        dom: $('#quote-b2p'),
        hasColor: true,
        decimal: true,
        blink: true,
        onerror: SuppressedValueHanlder,
        comparer: defaultComparer,
        render: QuotePriceRender
    }, {
        // 买二量
        idx: 18,
        dom: $('#quote-b2v'),
        onerror: SuppressedValueHanlder,
        blink: true,
        render: QuoteVolumnRender
    }, {
        // 买二差量
        idx: 99,
        dom: $('#quote-b2d'),
        hasColor: true,
        //onerror: SuppressedValueHanlder,
        render: OrderDiff
    }, {
        // 买三价
        idx: 15,
        dom: $('#quote-b3p'),
        hasColor: true,
        decimal: true,
        blink: true,
        onerror: SuppressedValueHanlder,
        comparer: defaultComparer,
        render: QuotePriceRender
    }, {
        // 买三量
        idx: 16,
        dom: $('#quote-b3v'),
        onerror: SuppressedValueHanlder,
        blink: true,
        render: QuoteVolumnRender
    }, {
        // 买三差量
        idx: 100,
        dom: $('#quote-b3d'),
        hasColor: true,
        //onerror: SuppressedValueHanlder,
        render: OrderDiff
    }, {
        // 买四价
        idx: 13,
        dom: $('#quote-b4p'),
        hasColor: true,
        decimal: true,
        blink: true,
        onerror: SuppressedValueHanlder,
        comparer: defaultComparer,
        render: QuotePriceRender
    }, {
        // 买四量
        idx: 14,
        dom: $('#quote-b4v'),
        onerror: SuppressedValueHanlder,
        blink: true,
        render: QuoteVolumnRender
    }, {
        // 买四差量
        idx: 101,
        dom: $('#quote-b4d'),
        hasColor: true,
        //onerror: SuppressedValueHanlder,
        render: OrderDiff
    }, {
        // 买五价
        idx: 11,
        dom: $('#quote-b5p'),
        hasColor: true,
        decimal: true,
        blink: true,
        onerror: SuppressedValueHanlder,
        comparer: defaultComparer,
        render: QuotePriceRender
    }, {
        // 买五量
        idx: 12,
        dom: $('#quote-b5v'),
        onerror: SuppressedValueHanlder,
        blink: true,
        render: QuoteVolumnRender
    }, {
        // 买五差量
        idx: 102,
        dom: $('#quote-b5d'),
        hasColor: true,
        //onerror: SuppressedValueHanlder,
        render: OrderDiff
    }, {
        // 卖五价
        idx: 31,
        dom: $('#quote-s5p'),
        hasColor: true,
        decimal: true,
        blink: true,
        onerror: SuppressedValueHanlder,
        comparer: defaultComparer,
        render: QuotePriceRender
    }, {
        // 卖五量
        idx: 32,
        dom: $('#quote-s5v'),
        onerror: SuppressedValueHanlder,
        blink: true,
        render: QuoteVolumnRender
    }, {
        // 卖五差量
        idx: 93,
        dom: $('#quote-s5d'),
        hasColor: true,
        //onerror: SuppressedValueHanlder,
        render: OrderDiff
    }, {
        // 卖四价
        idx: 33,
        dom: $('#quote-s4p'),
        hasColor: true,
        decimal: true,
        blink: true,
        onerror: SuppressedValueHanlder,
        comparer: defaultComparer,
        render: QuotePriceRender
    }, {
        // 卖四量
        idx: 34,
        dom: $('#quote-s4v'),
        onerror: SuppressedValueHanlder,
        blink: true,
        render: QuoteVolumnRender
    }, {
        // 卖四差量
        idx: 94,
        dom: $('#quote-s4d'),
        hasColor: true,
        //onerror: SuppressedValueHanlder,
        render: OrderDiff
    }, {
        // 卖三价
        idx: 35,
        dom: $('#quote-s3p'),
        hasColor: true,
        decimal: true,
        blink: true,
        onerror: SuppressedValueHanlder,
        comparer: defaultComparer,
        render: QuotePriceRender
    }, {
        // 卖三量
        idx: 36,
        dom: $('#quote-s3v'),
        onerror: SuppressedValueHanlder,
        blink: true,
        render: QuoteVolumnRender
    }, {
        // 卖三差量
        idx: 95,
        dom: $('#quote-s3d'),
        hasColor: true,
        //onerror: SuppressedValueHanlder,
        render: OrderDiff
    }, {
        // 卖二价
        idx: 37,
        dom: $('#quote-s2p'),
        hasColor: true,
        decimal: true,
        blink: true,
        onerror: SuppressedValueHanlder,
        comparer: defaultComparer,
        render: QuotePriceRender
    }, {
        // 卖二量
        idx: 38,
        dom: $('#quote-s2v'),
        onerror: SuppressedValueHanlder,
        blink: true,
        render: QuoteVolumnRender
    }, {
        // 卖二差量
        idx: 96,
        dom: $('#quote-s2d'),
        hasColor: true,
        //onerror: SuppressedValueHanlder,
        render: OrderDiff
    }, {
        // 卖一价
        idx: 39,
        dom: $('#quote-s1p'),
        hasColor: true,
        decimal: true,
        blink: true,
        onerror: SuppressedValueHanlder,
        comparer: defaultComparer,
        render: QuotePriceRender
    }, {
        // 卖一量
        idx: 40,
        dom: $('#quote-s1v'),
        onerror: SuppressedValueHanlder,
        blink: true,
        render: QuoteVolumnRender
    }, {
        // 卖一差量
        idx: 97,
        dom: $('#quote-s1d'),
        hasColor: true,
        //onerror: SuppressedValueHanlder,
        render: OrderDiff
    }, {
        // 每股净资产
        idx: 92,
        dom: '#quote-NAPS, #quote-NAPS-custom',
        handler: function (data) {
            return isNaN(data) ? NaN : data / Math.pow(10, 7);
        },
        render: function ($dom, data, fields, context) {
            $dom.html(data.toFixed(cache['offset']));
        }
    }, {
        // 每股收益
        idx: 55,
        dom: '#quote-EPS,#quote-EPS-custom,#data-EPS',
        handler: function (data) {
            if (isNaN(data)) return data;
            else {
                return data / Math.pow(10, 9);
            }
        },
        render: function ($dom, data, fields, context) {
            $dom.html(data.toFixed(3));
        }
    }, {
        // 季度
        idx: 62
    }, {
        // 经营活动产生的现金流量（TTM）
        idx: 103
    }, {
        // 营业总收入（TTM）
        idx: 104
    }, {
        // 净利润
        idx: 105
    }, {
        // 最新年度归属母公司净利润
        idx: 109
    }, {
        // 内盘
        idx: 'np',
        dom: '#quote-sellOrder,#quote-sellOrder-custom',
        extend: {
            deps: [47, 49],
            compute: function (amount, buycount) {
                return amount - buycount;
            }
        },
        blink: true,
        hasColor: true,
        comparer: -1,
        numbericFormat: true
    }, {
        // 总市值
        idx: 'tmv',
        dom: '#quote-marketValue, #quote-marketValue-custom,#data-marketValue',
        extend: {
            deps: [84, 43, 60],
            compute: MarketValueCalculator
        },
        numbericFormat: true,
        blink: true
    }, {
        // 流通市值
        idx: 'fmv',
        dom: '#quote-flowCapitalValue,#quote-flowCapitalValue-custom,#data-flowCapitalValue',
        extend: {
            deps: [85, 43, 60],
            compute: MarketValueCalculator
        },
        numbericFormat: true,
        blink: true
    }, {
        // 动态市盈率
        idx: 'pe',
        dom: '#quote-PERation,#quote-PERation-custom,#data-PERation',
        extend: {
            deps: [43, 84, 105, 62, 60],
            compute: PECalculator
        },
        blink: true
    }, {
        // 静态市盈率
        idx: 'staticpe',
        dom: '#quote-staticPERation,#quote-staticPERation-custom',
        extend: {
            deps: [43, 84, 109, 60],
            compute: StaticPECalculator
        },
        blink: true
    }, {
        // 市净率
        idx: 'pb',
        dom: '#quote-PB,#quote-PB-custom,#data-PB',
        extend: {
            deps: [43, 92, 60],
            compute: PBCalculator
        },
        blink: true
    }, {
        // 市销率
        idx: 'PTS',
        dom: '#quote-sell-custom',
        extend: {
            deps: [104, 84, 43, 60],
            compute: function (sell, shares, close, pc) {
                if (!sell) return NaN;
                var mv = shares * (close || pc);
                return (mv / sell).toFixed(cache['offset']);
            }
        }
    }, {
        // 市现率
        idx: 'PTC',
        dom: '#quote-cash-custom',
        extend: {
            deps: [103, 84, 43, 60],
            compute: function (cash, shares, close, pc) {
                if (!cash) return NaN;
                var mv = shares * (close || pc);
                return (mv / cash).toFixed(cache['offset']);
            }
        }
    },
    {
        // 换手率
        idx: 'tr',
        dom: '#quote-turnoverRate, #quote-turnoverRate-custom',
        blink: true,
        extend: {
            deps: [47, 85],
            compute: TurnoverRatioCalculator
        },
        render: function ($dom, data) {
            $dom.html(!data ? '-' : data + '%');
        }
    }, {
        // 委差
        idx: 'cd',
        dom: $('#quote-cd'),
        blink: true,
        hasColor: true,
        extend: {
            deps: [40, 38, 36, 34, 32, 20, 18, 16, 14, 12],
            compute: CommissionDiffCalculator
        }
    }, {
        // 委比
        idx: 'cr',
        dom: $('#quote-cr'),
        blink: true,
        hasColor: true,
        extend: {
            deps: [40, 38, 36, 34, 32, 20, 18, 16, 14, 12],
            compute: CommissionRateCalculator
        },
        render: PercentRender
    }, {
        // 振幅
        idx: 'amplitude',
        dom: '#quote-amplitude-custom',
        blink: true,
        extend: {
            deps: [44, 45, 60],
            compute: AmplitudeCalculator
        },
        render: PercentRender
    }, {
        // 20日涨幅
        idx: 'changePercent20',
        dom: '#quote-20cp-custom',
        hasColor: true,
        extend: {
            deps: [43, 60],
            compute: function (close, pc) {
                return StageChangePercentCalculator(cache['ChangeStartPrice20Day'], close, pc);
            }
        },
        render: PercentRender
    }, {
        // 60日涨幅
        idx: 'changePercent60',
        dom: '#quote-60cp-custom',
        hasColor: true,
        extend: {
            deps: [43, 60],
            compute: function (close, pc) {
                return StageChangePercentCalculator(cache['ChangeStartPrice60Day'], close, pc);
            }
        },
        render: PercentRender
    }, {
        // 今年以来涨幅
        idx: 'changeStartPrice360',
        dom: '#quote-360cp-custom',
        hasColor: true,
        extend: {
            deps: [43, 60],
            compute: function (close, pc) {
                return StageChangePercentCalculator(cache['ChangeStartPrice360Day'], close, pc);
            }
        },
        render: PercentRender
    }, {
        // 买卖力道
        idx: 'power',
        dom: '#buy-table,#sell-table',
        extend: {
            deps: [40, 38, 36, 34, 32, 20, 18, 16, 14, 12, 39, 37, 35, 33, 31, 19, 17, 15, 13, 11, 60],
            compute: function () {
                var args = [],
                    volumes = [],
                    pc = arguments[20];
                for (var i = 0; i < 10; i++) {
                    var vol = arguments[i],
                        price = arguments[i + 10];
                    volumes.push(isNaN(vol) ? 0 : vol);
                    args.push({
                        pc: pc,
                        close: price,
                        volumn: isNaN(vol) ? 0 : vol,
                        percent: 0
                    });
                }
                var mv = Math.max.apply(this, volumes);
                return args.map(function (param) {
                    param.percent = param.volumn / mv;
                    return param;
                });
            }
        },
        render: function ($dom, data) {
            if (cache['status'] === 'pre') return;
            for (var i = 0; i < data.length; i++) {
                var $ele, n = i + 1;
                if (n < 6) {
                    $ele = $('#quote-s' + n + 'vp', $dom);
                } else {
                    $ele = $('#quote-b' + (n - 5) + 'vp', $dom);
                }
                $ele.width(data[i].percent * 100 + '%')
                    .removeClass('red green')
                    .addClass((data[i].close - data[i].pc) >= 0 ? 'red' : 'green');
            }
        }
    }
];

/**
 * 默认数据比较器
 * @param {string|number} data 数据
 */
function defaultComparer(data) {
    return data - cache[60];
}

/**
 * 意外的错误数据
 * @param {string|number} data 数据
 */
function SuppressedValueHanlder(data) {
    return '-';
}

/**
 * 市值计算器
 * @param {number} shares 股本
 * @param {number} close 现价
 * @param {number} pc 昨收
 */
function MarketValueCalculator(shares, close, pc) {
    if (!shares || !pc) return NaN;
    return shares * (close || pc);
}
/**
 * 动态市盈率计算器
 * @param {number} close 最新价
 * @param {number} shares 总股本
 * @param {number} profit 净利润
 * @param {number} season 季度
 * @param {number} pc 昨收
 */
function PECalculator(close, shares, profit, season, pc) {
    if (!shares || !profit || !season || !pc) return NaN;
    var data = ((close || pc) * shares / profit * season / 4).toFixed(cache['offset']);
    return data < 0 ? '-' : data;
}

/**
 * 静态市盈率计算器
 * @param {number} close 最新价
 * @param {number} shares 总股本
 * @param {number} profit 净利润
 * @param {number} pc 昨收
 */
function StaticPECalculator(close, shares, profit, pc) {
    if (!shares || !profit || !pc) return NaN;
    var data = ((close || pc) * shares / profit).toFixed(cache['offset']);
    return data < 0 ? '-' : data;
}

/**
 * 市净率计算器
 * @param {number} close 最新价
 * @param {number} ncps 每股净资产
 * @param {number} pc 昨收
 */
function PBCalculator(close, ncps, pc) {
    if (!ncps || !pc) return NaN;
    return ((close || pc) / ncps).toFixed(cache['offset']);
}
/**
 * 换手率计算器
 * @param {number} amount 成交量
 * @param {number} fs 流通股本
 */
function TurnoverRatioCalculator(amount, fs) {
    return amount && fs ? (amount * 100 / fs * 100).toFixed(cache['offset']) : NaN;
}

/**
 * 委差计算器
 * @param {number} sv1 买一量
 * @param {number} sv2 买二量
 * @param {number} sv3 买三量
 * @param {number} sv4 买四量
 * @param {number} sv5 买五量
 * @param {number} bv1 卖一量
 * @param {number} bv2 卖二量
 * @param {number} bv3 卖三量
 * @param {number} bv4 卖四量
 * @param {number} bv5 卖五量
 */
function CommissionDiffCalculator(sv1, sv2, sv3, sv4, sv5, bv1, bv2, bv3, bv4, bv5) {
    //if (cache['status'] === 'pre') return NaN;
    var sv = sv1 + sv2 + sv3 + sv4 + sv5,
        bv = bv1 + bv2 + bv3 + bv4 + bv5;
    return bv - sv;
}

/**
 * 委比计算器
 * @param {number} sv1 买一量
 * @param {number} sv2 买二量
 * @param {number} sv3 买三量
 * @param {number} sv4 买四量
 * @param {number} sv5 买五量
 * @param {number} bv1 卖一量
 * @param {number} bv2 卖二量
 * @param {number} bv3 卖三量
 * @param {number} bv4 卖四量
 * @param {number} bv5 卖五量
 */
function CommissionRateCalculator(sv1, sv2, sv3, sv4, sv5, bv1, bv2, bv3, bv4, bv5) {
    //if (cache['status'] === 'pre') return NaN;
    var sv = sv1 + sv2 + sv3 + sv4 + sv5,
        bv = bv1 + bv2 + bv3 + bv4 + bv5;
    if (!(sv + bv)) return NaN;
    return ((bv - sv) / (bv + sv) * 100).toFixed(cache['offset']);
}

/**
 * 振幅计算器
 * @param {number} highest 最高
 * @param {number} lowest 最低
 * @param {number} pc 昨收
 */
function AmplitudeCalculator(highest, lowest, pc) {
    if (!pc || !highest || !lowest) return NaN;
    return ((highest - lowest) / pc * 100).toFixed(cache['offset']);
}

/**
 * 阶段涨跌幅计算器
 * @param {number} start 起始价
 * @param {number} close 现价
 * @param {number} pc 昨收
 */
function StageChangePercentCalculator(start, close, pc) {
    if (!start && !pc) return NaN;
    var change = (close || pc) - start;
    return (change / start * 100).toFixed(cache['offset']);
}

/**
 * 当前档位委托单的差值显示处理
 * @param {JQuery<HTMLElement>} $dom jquery对象
 * @param {number|string} data 数据
 */
function OrderDiff($dom, data) {
    if (data) {
        var fd = data;
        if (Math.abs(fd) > 10e6) {
            fd = utils.numbericFormat(data);
        } else if (Math.abs(fd) > 10e5) {
            fd = (data / 10e5).toFixed(2) + '万';
        }
        $dom.html(data > 0 ? '+' + fd : fd);
    }
}

/**
 * 添加百分号
 * @param {JQuery<HTMLElement>} $dom jquery对象
 * @param {number|string} data 数据
 */
function PercentRender($dom, data) {
    data = parseFloat(data);
    $dom.html(isNaN(data) ? '-' : (Math.abs(data) > 100 ? data.toFixed(0) : data) + '%');
}

/**
 * 5档报价展示
 * @param {JQuery<HTMLElement>} $dom jquery对象
 * @param {number|string} data 数据
 */
function QuotePriceRender($dom, data) {
    if (!$dom) return false;
    if (isNaN(data)) {
        $dom.parent().removeClass('mr');
    } else {
        $dom.parent().addClass('mr');
    }
    $dom.html(data || '-');
}

/**
 * 5档挂单量展示
 * @param {JQuery<HTMLElement>} $dom jquery对象
 * @param {number|string} data 数据
 */
function QuoteVolumnRender($dom, data) {
    if (!$dom) return false;
    if (isNaN(data)) {
        $dom.parent().removeClass('mc');
    } else {
        $dom.parent().addClass('mc');
    }
    $dom.html(data || '-');
}

module.exports = {
    fields: fields,
    pageLoadEvents: {
        beforeLoading: beforePageLoad
    }
};

/***/ }),

/***/ "./src/modules/old_concept/components/quote-push/deals.js":
/*!****************************************************************!*\
  !*** ./src/modules/old_concept/components/quote-push/deals.js ***!
  \****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "jquery");
var utils = __webpack_require__(/*! ../../modules/utils */ "./src/modules/old_concept/modules/utils.js");
var template = __webpack_require__(/*! ../../modules/template-web */ "./src/modules/old_concept/modules/template-web.js");
var tpl = __webpack_require__(/*! ./deals.art */ "./src/modules/old_concept/components/quote-push/deals.art");

function deals(args) {
    var _opt = getoptions(args);
    var self = this;
    var timer;
    var pageRender = template.compile(tpl);
    this.load = function () {
        this.stop();
        utils.extend(_opt.ajax.data, {
            id: _opt.id
        });
        var jqXHR = $.ajax(_opt.ajax);
        if (_opt.update > 0) {
            timer = setInterval(function () {
                if (jqXHR) jqXHR.abort();
                jqXHR = $.ajax(_opt.ajax);
            }, _opt.update);
        }
    }

    this.stop = function () {
        clearInterval(timer);
    }

    function render(json) {
        var big = 2 * Math.pow(10, 6);
        var modules = {};
        //t-时间，p-价格，v-成交量，bs-内外盘，wh-仓差，type-性质，vc-成交笔数或增仓量,pch-方向
        //内外盘：1:内盘(流出) 2:外盘(流入) 3:未知 4:集合竞价
        // if (json && json.result) {
        //     for (var i = 0; i < json.value.data.length; i++) {
        //         var item = json.value.data[i];
        //         item.priceColor = item.bs === 4 ? '' : utils.getColor(item.p, json.value.pc);
        //         item.v = item.bs === 4 ? '-' : item.v;
        //         var vp = parseInt(item.v * item.p * 100) * (item.pch > 0 ? 1 : -1);
        //         item.volumnColor = item.bs != 4 ? vp >= 200000 ? 'purple' : vp > 0 ? 'red' : vp <= -200000 ? 'blue' : vp < 0 ? 'green' : '' : ''
        //     }
        //     modules = {
        //         state: json.result,
        //         id: _opt.id,
        //         data: json.value.data
        //     }
        //     console.log(json.value.data)
        // } else {
        //     modules = {
        //         state: json.result,
        //         id: _opt.id,
        //         data: []
        //     }
        // }
        if (json.data && json.data.details.length) {
            var pc = parseFloat(json.data.prePrice);
            var price =[]; 
            for(var i = 0; i < json.data.details.length; i++){
                price.push(parseFloat(json.data.details[i].substring(9,14)))
            }
            var pch=[];
            for(var i = 0; i < price.length-1; i++){
                pch[i]=price[i+1]-price[i];
            }
            var item={};
            var singledata=[];
            var data =[];
            for (var i = 1; i < json.data.details.length; i++) {
                singledata = JSON.stringify(json.data.details[i]);
                item = singledata.split(',');           
                item.t=item[0].substring(1);
                item.p = item[1];
                item.v = item[2];
                item.pch = pch[i-1]
                item[4]=item[4].substring(0,1);
                item.priceColor = item[4] != 4 ? item[1] - pc > 0 ? "red" : item[1] - pc < 0 ? "green" : "#333333" : "";
                item.dir = pch[i-1] < 0 ? "↓" : pch[i-1] > 0 ? "↑" : "";
                item.dir_c = pch[i-1] < 0 ? "green" : pch[i-1] > 0 ? "red" : "";
                var vp = item[2] * item[1] * 100 * (item[4] == 1 ? -1 : item[4] == 2 ? 1 : 0);
                item.volumnColor = item[4] != 4 ? vp >= 200000 ? "#ff00ff" : vp > 0 ? "red" : vp <= -200000 ? "#14c3dc" : vp < 0 ? "green" : "" : "";
                data.push(item)           
            }
            modules = {
                state: json.lt,
                id: _opt.id,
                data: data
            }
        } else {
            if(!json.data) return;
            modules = {
                state: json.data.details.length,
                id: _opt.id,
                data: []
            }
        }
        $(_opt.container).html(pageRender(modules));
        if (typeof _opt.oncomplete === 'function') {
            _opt.oncomplete.apply(self, [json, _opt]);
        }
    }

    function onerror(jqXHR, textStatus, error) {
        console.error(error);
    }

    function getoptions(args) {
        var market_01=stockentry.marketnum==1?1:0;
        var apiurl = "//push2.eastmoney.com/"
        if (window.location.search.indexOf('env=test') > -1) {
            apiurl = "http://61.152.230.207/"
        }
        return utils.extend({
            container: '#deal-detail-table',
            id: stockentry.id,
            ajax: {
                // url: '//mdfm.eastmoney.com/EsM_UBG_MinuteApi/Js/Get?dtype=25&style=tail&check=st&dtformat=HH:mm:ss&num=6',
                // url:'http://61.129.249.233:18665/api/qt/stock/details/get?ut=fa5fd1943c7b386f172d6893dbfba10b&fields1=f1,f2,f3,f4&fields2=f51,f52,f53,f54,f55&pos=-7&secid=1.'+stockentry.id.substring(0,6),
                //url:'http://push2.eastmoney.com/api/qt/stock/details/get?ut=fa5fd1943c7b386f172d6893dbfba10b&fields1=f1,f2,f3,f4&fields2=f51,f52,f53,f54,f55&pos=-7&secid='+market_01+'.'+stockentry.code,
                url: apiurl + 'api/qt/stock/details/get?ut=fa5fd1943c7b386f172d6893dbfba10b&fields1=f1,f2,f3,f4&fields2=f51,f52,f53,f54,f55&pos=-7&secid='+market_01+'.'+stockentry.code,
                dataType: 'jsonp',
                data: {},
                jsonp: 'cb',
                success: render,
                error: onerror
            },
            oncomplete: null,
            update: 20 * 1000,
        }, args);
    }
}

module.exports = deals;

/***/ }),

/***/ "./src/modules/old_concept/components/quote-push/icomet.js":
/*!*****************************************************************!*\
  !*** ./src/modules/old_concept/components/quote-push/icomet.js ***!
  \*****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var jsonp = __webpack_require__(/*! ../../modules/jsonp */ "./src/modules/old_concept/modules/jsonp.js");
/*
config = {
	channel: 'abc',
	// [optional]
	// sign_url usually link to a app server to get a token,
	// if icomet do not need athentication, this parameter could be omitted.
	signUrl: 'http://...',
	// sub_url link directly to icomet server
	subUrl: 'http://...',
	[pubUrl: 'http://...',]
	// be called when receive a msg
	callback: function(content, type){}
};
*/
function iComet(config) {
    var self = this;
    // callback timeout id
    var cid;
    if (iComet.id__ == undefined) {
        iComet.id__ = 0;
    }
    config.sub_url = config.sub_url || config.subUrl;
    config.pub_url = config.pub_url || config.pubUrl;
    config.sign_url = config.sign_url || config.signUrl;
    config.data_seq = config.data_seq || config.dataSeq;
    config.delay = config.delay || 0;
    config.onerror = config.onerror || new Function();
    this.cname = config.channel;
    self.sub_cb = function (msg) {
        self.log('proc', JSON.stringify(msg));
        var cb = config.callback || config.sub_callback;
        if (cb) {
            try {
                cb(msg.content, msg.type);
            } catch (e) {
                self.log(e);
            }
        }
    }
    this.sub_timeout = config.sub_timeout || (60 * 1000);

    this.id = iComet.id__++;
    this.cb = 'icomet_cb_' + (+new Date()) + "_" + this.id;
    this.timer = null;
    this.stopped = true;
    this.last_msg_time = 0;
    this.token = '';

    this.data_seq = config.data_seq;
    this.noop_seq = 0;
    this.sign_cb = null;

    this.pub_url = config.pub_url;
    if (config.sub_url.indexOf('?') == -1) {
        this.sub_url = config.sub_url + '?';
    } else {
        this.sub_url = config.sub_url + '&';
    }
    this.sub_url += 'cb=' + self.cb;
    if (config.sign_url) {
        if (config.sign_url.indexOf('?') == -1) {
            this.sign_url = config.sign_url + '?';
        } else {
            this.sign_url = config.sign_url + '&';
        }
        this.sign_url += 'cb=' + this.cb + '&cname=' + this.cname;
    }

    this.onmessage = function (msg) {
        // batch repsonse
        if (msg instanceof Array) {
            self.log('batch response', msg.length);
            self.long_polling_pause = true;
            for (var i = 0; i < msg.length; i++) {
                if (i === msg.length - 1) {
                    self.long_polling_pause = false;
                }
                self.proc_message(msg[i]);
            }
            // go on subscribing
            //self.long_polling_pause = false;
            self.proc_message({
                type: "next_seq",
                seq: self.data_seq
            });
        } else {
            self.proc_message(msg);
        }
    }

    this.proc_message = function (msg) {
        self.log('resp', JSON.stringify(msg));
        if (self.stopped) {
            return;
        }
        if (!msg) {
            return;
        }
        self.last_msg_time = (new Date()).getTime();

        if (msg.type == '404') {
            // TODO channel id error!
            console.error('channel not exists!');
            return;
        }
        if (msg.type == '401') {
            // TODO token error!
            console.error('token error!');
            return;
        }
        if (msg.type == '429') {
            //alert('too many connections');
            self_sub(5000 + Math.random() * 5000);
            return;
        }
        if (msg.type == 'sign') {
            self.sign_cb(msg);
            return;
        }
        if (msg.type == 'noop') {
            self.onmessage_noop(msg);
            return;
        }
        if (msg.type == 'next_seq') {
            self.onmessage_next_seq(msg);
            return;
        }
        if (msg.type == 'data' || msg.type == 'broadcast') {
            self.onmessage_data(msg);
            return;
        }
    }

    this.onmessage_noop = function (msg) {
        if (msg.seq == self.noop_seq) {
            if (self.noop_seq == 2147483647) {
                self.noop_seq = -2147483648;
            } else {
                self.noop_seq++;
            }
            // if the channel is empty, it is probably empty next time,
            // so pause some seconds before sub again
            self_sub(Math.random() * 1000);
        } else {
            // we have created more than one connection, ignore it
            self.log('ignore exceeded connections');
        }
    }

    this.onmessage_next_seq = function (msg) {
        self.data_seq = msg.seq;
        // disconnect & connect
        self_sub();
    }

    this.onmessage_data = function (msg) {
        if (msg.seq != self.data_seq) {
            if (msg.seq == 0 || msg.seq == 1) {
                self.log('server restarted');
                // TODO: lost_cb(msg);
                self.sub_cb(msg);
            } else if (msg.seq < self.data_seq) {
                self.log('drop', msg);
            } else {
                self.log('msg lost', msg);
                // TODO: lost_cb(msg);
                self.sub_cb(msg);
            }

            self.data_seq = msg.seq;
        } else {
            self.sub_cb(msg);
        }
        if (self.data_seq == 2147483647) {
            self.data_seq = -2147483648;
        } else {
            self.data_seq++;
        }
        self_sub();
    }

    var self_sub = function (delay) {
        if (self.stopped) return;
        var url = self.sub_url +
            '&cname=' + self.cname +
            '&seq=' + self.data_seq +
            '&noop=' + self.noop_seq +
            '&token=' + self.token +
            '&_=' + new Date().getTime();
        if (typeof (EventSource) !== "undefined") {
            if (self.EventSource) {
                return;
            }
            self.stopped = false;
            self.last_msg_time = (new Date()).getTime();
            url = url.replace('/sub?', '/sse?');
            //console.info(url);
            self.log('sub SSE ' + url);
            try {
                self.EventSource = new EventSource(url);
                self.EventSource.onmessage = function (e) {
                    self.onmessage(JSON.parse(e.data));
                }
                self.EventSource.onerror = function () {
                    self.log('EventSource error');
                    self.EventSource.close();
                    self.EventSource = null;
                    config.onerror();
                }
            } catch (e) {
                self.log(e.message);
            }
        } else {
            if (self.long_polling_pause) {
                return;
            }
            delay = delay || config.delay;
            clearTimeout(cid);
            self.stopped = false;
            cid = setTimeout(function () {
                self.last_msg_time = (new Date()).getTime();
                self.log('sub Long-Polling ' + url);
                jsonp(url, {}, self.cb, function (data) {
                    //console.info(data);
                }, config.onerror);
            }, delay);
        }
    }

    this.sign_cb = function (msg) {
        if (self.stopped) {
            return;
        }
        self.cname = msg.cname;
        self.token = msg.token;
        try {
            var a = parseInt(msg.sub_timeout) || 0;
            self.sub_timeout = (a * 1.3) * 1000;
        } catch (e) {}
        self_sub();
    }

    this.start = function () {
        // sign, long-polling 需要注册此函数
        // 网络异常后, 函数注册会丢失, 需要重新注册.
        window[self.cb] = self.onmessage;

        self.log('start');
        self.stopped = false;
        self.last_msg_time = (new Date()).getTime();

        if (!self.timer) {
            self.timer = setInterval(function () {
                var now = (new Date()).getTime();
                if (now - self.last_msg_time > self.sub_timeout) {
                    self.log('timeout');
                    self.stop();
                    self.start();
                }
            }, 1000);
        }

        if (self.sign_url) {
            self.log('sign in icomet server...');
            var url = self.sign_url + '&_=' + new Date().getTime();
            jsonp(url, {}, self.cb, function (data) {
                //console.info(data);
            }, config.onerror);
        } else {
            self_sub();
        }
    }

    this.stop = function () {
        self.log('stop');
        self.stopped = true;
        self.last_msg_time = 0;
        if (self.timer) {
            clearTimeout(self.timer);
            self.timer = null;
        }
        if (self.EventSource) {
            self.EventSource.close();
            self.EventSource = undefined;
        }
    }

    // msg must be string
    this.pub = function (content, callback) {
        if (typeof (content) != 'string' || !self.pub_url) {
            alert(self.pub_url);
            return false;
        }
        if (callback == undefined) {
            callback = function () {};
        }
        var data = {};
        data.cname = self.cname;
        data.content = content;

        jsonp(self.pub_url, data, self.cb, callback, config.onerror);
    }

    this.log = function () {
        try {
            var v = arguments;
            var p = 'icomet[' + self.id + ']';
            var t = new Date().toTimeString().substr(0, 8);
            if (v.length == 1) {
                console.log(t, p, v[0]);
            } else if (v.length == 2) {
                console.log(t, p, v[0], v[1]);
            } else if (v.length == 3) {
                console.log(t, p, v[0], v[1], v[2]);
            } else if (v.length == 4) {
                console.log(t, p, v[0], v[1], v[2], v[3]);
            } else if (v.length == 5) {
                console.log(t, p, v[0], v[1], v[2], v[3], v[4]);
            } else {
                console.log(t, p, v);
            }
        } catch (e) {}
    }

    this.start();
}
module.exports = iComet;

/***/ }),

/***/ "./src/modules/old_concept/components/quote-push/push.js":
/*!***************************************************************!*\
  !*** ./src/modules/old_concept/components/quote-push/push.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var jsonp = __webpack_require__(/*! ../../modules/jsonp */ "./src/modules/old_concept/modules/jsonp.js");
var utils = __webpack_require__(/*! ../../modules/utils */ "./src/modules/old_concept/modules/utils.js");
var iComet = __webpack_require__(/*! ./icomet */ "./src/modules/old_concept/components/quote-push/icomet.js");
var cache = utils.ObjectCache.default;
__webpack_require__(/*! ../../modules/polyfills/json-polyfill */ "./src/modules/old_concept/modules/polyfills/json-polyfill.js");

var defaultConfigs = __webpack_require__(/*! ./configs */ "./src/modules/old_concept/components/quote-push/configs.js");

/**
 * 快速行情报价推送
 */
function TopSpeedQuote(channel, config) {
    var self = this,
        stopped = false,
        retryId = -1,
        error_counter = 0;
    this.config = config = config || {};
    this.enableMutiDomain = config.enableMutiDomain || false;
    this.host = config.host || "push1.eastmoney.com";
    this.auto_start = config.start || false;
    this.fields = utils.extend(config.fields || new Array(), defaultConfigs.fields);
    this.pageLoadEvents = config.pageLoadEvents || defaultConfigs.pageLoadEvents;
    this.load_page = typeof config.loadPage === "boolean" ? config.loadPage : true;
    this.stopWithoutQuote = typeof config.stopWithoutQuote === "undefined" ? true : config.stopWithoutQuote;
    this.fieldmap = {};
    for (var i = 0; i < this.fields.length; i++) {
        var element = this.fields[i];
        if (element) this.fieldmap[element.idx] = element;
    }
    var render = this.render = config.render || pageLoader;
    var _channel = this.channel = channel || "TSQ_SZ300059",
        data_seq = 0,
        icomet;
    var perfix = self.enableMutiDomain ? Math.floor(Math.random() * 99 + 1).toString() : "";
    var sub_url = perfix ? "//" + perfix + "." + self.host + "/sub" : "//" + self.host + "/sub";
    self.start = function () {
        jsonp(sub_url, {
            cname: channel
        }, "cb", sub_handler(render), onEventError);
    }
    self.stop = function () {
        stopped = true;
        if (icomet) icomet.stop();
    }
    /**
     * 请求异常重连处理
     */
    function onEventError() {
        if (++error_counter < (config.maxRetryCount || 5)) {
            retryId = setTimeout(function () {
                var data = {
                    cname: channel
                };
                if (data_seq) data.seq = data_seq;
                jsonp(sub_url, data, "cb", sub_handler(render), onEventError);
            }, config.retryInterval || 2000);
        }
    }
    /**
     * 行情报价icomet订阅处理器
     * @param {function} sub_func 订阅回调
     */
    function sub_handler(sub_func) {
        var callback = typeof sub_func === "function" ? sub_func : new Function();
        /**
         * icomet行情全量处理逻辑
         * @param {object} json icomet响应
         */
        function handler(json) {
            if (!json) return false;
            if (json instanceof Array) {
                for (var i = json.length - 1; i >= 0; i--) {
                    if (typeof json[i] === "object" && json[i].type === "data") {
                        var content = JSON.parse(json[i].content),
                            full = cache.getOrAdd("__full__", content);
                        // 以seq字段作为标识，获取到seq，追溯到上一笔全量数据
                        if (!content["seq"]) {
                            data_seq = json[i].seq + 1;
                            callback(content, self.fields, self);
                        } else {
                            data_seq = content["seq"];
                        }
                        // 停止或已生成icomet请求，直接返回
                        if (stopped || icomet) return false;
                        var current = {};
                        // 创建icomet并开始监听
                        icomet = self.icomet = new iComet({
                            channel: _channel,
                            subUrl: sub_url,
                            dataSeq: data_seq,
                            onerror: onEventError,
                            delay:  false ? 0 : 0, // 低版本浏览器使用慢速队列延时5000ms
                            callback: function (content) {
                                error_counter = 0;
                                clearTimeout(retryId);
                                if (!content) return false;
                                try {
                                    var data = utils.extend(current, JSON.parse(content), true);
                                    utils.extend(full, data, true);
                                    if (!icomet.long_polling_pause) {
                                        callback(data, self.fields, self);
                                        current = {};
                                    }
                                } catch (e) {
                                    console.error(e);
                                }
                            }
                        });
                        break;
                    }
                }
            } else if (json.type === "next_seq") {
                if (json.seq <= 1) return false;
                jsonp(sub_url, {
                    cname: json.cname,
                    seq: json.seq - 1
                }, "cb", sub_handler(callback), onEventError);
            } else {
                // 重试
                setTimeout(function () {
                    jsonp(sub_url, {
                        cname: json.cname
                    }, "cb", sub_handler(callback), onEventError);
                }, 200);
            }
        }
        return handler;
    }

    if (self.auto_start) self.start();
}

// 附加扩展方法
TopSpeedQuote.utils = utils;
TopSpeedQuote.iComet = iComet;

/**
 * 默认页面绑定加载器
 * @param {Object} data 数据
 * @param {Array} fields 字段配置
 * @param {TopSpeedQuote} sender 上下文
 */
function pageLoader(data, fields, sender) {
    if (!sender.load_page) return;
    for (var key in data) {
        if (typeof data[key] === "object") {
            for (var i in data[key]) {
                if (!data[i]) data[i] = data[key][i];
            }
        }
    }
    if (typeof sender.pageLoadEvents.beforeLoading === "function") {
        sender.pageLoadEvents.beforeLoading.apply(sender, [data, fields]);
    }
    for (var i = 0; i < fields.length; i++) {
        if (!fields[i]) continue;
        var field = fields[i],
            item = data[field.idx || 0];
        // 衍生计算处理
        if (!item && typeof field.extend === "object") {
            item = extendCompute(data, field.extend, sender);
        }
        if (!item && item != 0) continue;
        //if (isNaN(item) && !item && !parseFloat(item)) continue;
        fieldHandler(field, item, data, sender);
    }
    if (typeof sender.pageLoadEvents.afterPageLoaded === "function") {
        sender.pageLoadEvents.afterPageLoaded.apply(sender, [data, fields]);
    }
}

/**
 * 字段扩展运算
 * @param {object} data 数据
 * @param {object} extend 字段扩展定义
 * @param {TopSpeedQuote} sender 上下文对象
 * @returns {number|""} 计算结果
 */
function extendCompute(data, extend, sender) {
    if (!data || !(extend.deps instanceof Array)) return "";
    var deps = extend.deps,
        _deps = [],
        any = false;
    for (var i = 0; i < deps.length; i++) {
        var key = deps[i],
            val = data[key];
        if (val) any = true;
        if (sender.fieldmap[key].caching && sender.fieldmap[key].caching.enable) {
            val = cache[sender.fieldmap[key].caching.key];
        } else {
            val = cache[key];
        }
        _deps.push(val);
    }
    if (any && typeof extend.compute === "function")
        return extend.compute.apply(sender, _deps);
}

/**
 * 数据字段处理器
 * @param {object} field 字段定义
 * @param {string|number} item 数据项
 * @param {object} data 数据
 * @param {TopSpeedQuote} sender 
 */
function fieldHandler(field, item, data, sender) {
    var $dom = field.$dom = jselector(field.dom, field.idx),
        _item = item,
        cached = typeof field.caching === "boolean" ? field.caching : true,
        caching = typeof field.caching === "object" ? field.caching : {},
        changed = false,
        last = cached ? cache[caching.key || field.idx] : $dom.text();
    // 数据预处理
    if (typeof field.handler === "function") {
        item = _item = field.handler(item, data, sender);
    }
    // 默认小数处理
    if (field.decimal) {
        item = _item = decimalHandler(item);
    }
    // 枚举映射
    if (typeof (field.map) === "object" && field.map[item]) {
        item = field.map[item];
    }
    // 是否科学计数
    if (field.numbericFormat) {
        item = utils.numbericFormat(item);
    }
    var regex = /^[\d\.\-]+$/;
    // 异常数据处理
    if (!item || (isNaN(item) && regex.test(item) && !parseFloat(item))) {
        var handler = typeof field.onerror === "function" ? field.onerror : ErrorValueHandler;
        item = handler(item);
        if (!item) return false;
    }
    if ($dom.length > 0) {
        changed = last ? last != _item : false;
        //if (!changed) return;
        if (typeof field.render !== "function")
            $dom.html(item);
        // 颜色处理
        var blink_model = 0;
        if (field.hasColor) {
            var css = "";
            if (!isNaN(field.comparer)) {
                css = field.comparer < 0 ? "green" : field.comparer > 0 ? "red" : "";
                blink_model = field.comparer > 0 ? 1 : field.comparer < 0 ? -1 : 0;
            } else if (typeof field.comparer === "function") {
                var c = field.comparer(item, data, sender);
                css = c < 0 ? "green" : c > 0 ? "red" : "";
                blink_model = c > 0 ? 1 : c < 0 ? -1 : 0;
            } else {
                css = utils.getColor(item);
                item = typeof item === "string" ? item : item.toString();
                blink_model = item == "0" || item == "-" ? 0 : item.isPositive() ? 1 : -1;
            }
            $dom.removeClass("red green").addClass(css);
        }
        // 闪烁效果
        if (field.blink && changed) {
            var enable = true,
                _options = {
                    doms: [],
                    circle: field.hasColor ? 2 : 1
                };
            for (var i = 0; i < $dom.length; i++) {
                _options.doms.push($dom[i]);
            }
            if (typeof field.blink === "object") {
                enable = !field.blink.disable;
                _options = utils.extend(_options, field.blink, true);
            }
            if (!sender.twinkle) sender.twinkle = {};
            var twinkle = sender.twinkle[field.idx];
            if (!twinkle && enable) {
                twinkle = sender.twinkle[field.idx] = new utils.blinker(_options);
            }
            if (enable) {
                twinkle.comparer = blink_model;
                twinkle.raise = enable;
            }
        }
        // 字段呈现回调
        if (typeof field.render === "function") {
            field.render($dom, item, field, sender);
        }
    }
    // 缓存
    if (cached) {
        var ck = caching.key || field.idx,
            val = _item;
        if (typeof caching.handler === "function")
            val = caching.handler(_item, data, sender);
        cache.set(ck, val);
    }

    /**
     * dom对象，兼容ie7加载慢的问题
     * @param {object} dom 
     * @param {number} index 
     */
    function jselector(dom, index) {
        var _dom;
        if (dom instanceof $) {
            _dom = dom;
        } else if (utils.isDOM(dom) || typeof dom === "string") {
            _dom = $(dom);
        }
        if (!_dom || !_dom.length)
            _dom = $("[data-bind=" + index + "]");
        return _dom;
    }
    /**
     * 小数处理器
     * @param {number} data 数据
     */
    function decimalHandler(data) {
        if (!cache["fact"] || !cache["offset"] || !data) return NaN;
        return (data * cache["fact"]).toFixed(cache["offset"]);
    }

    function ErrorValueHandler(data) {
        return false;
    }
}

module.exports = TopSpeedQuote;

/***/ }),

/***/ "./src/modules/old_concept/components/relatedquote/relatedquote.js":
/*!*************************************************************************!*\
  !*** ./src/modules/old_concept/components/relatedquote/relatedquote.js ***!
  \*************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// require('./relatedquote.css');

var $ = __webpack_require__(/*! jquery */ "jquery");
var utils = __webpack_require__(/*! ../../modules/utils */ "./src/modules/old_concept/modules/utils.js");
var template = __webpack_require__(/*! ../../modules/template-web */ "./src/modules/old_concept/modules/template-web.js");
var tpl = __webpack_require__(/*! ./relatedquote.art */ "./src/modules/old_concept/components/relatedquote/relatedquote.art");
var user = __webpack_require__(/*! ../../modules/user */ "./src/modules/old_concept/modules/user/index.js")

/**
 * 相关行情
 * @param {object} options 选项
 * @param {object} options.stockentry 股票入口
 * @param {string} options.stockentry.code 代码
 * @param {object} options.stockentry.tags 属性标签
 * @param {string|HTMLElement} options.container 容器
 * @param {number} options.update 自刷间隔
 */
function relatedquote(options) {
    var _opt = $.extend({
        stockentry: window.stockentry,
        container: '#related-quote',
        update: 40 * 1000
    }, options);
    var $dom = $(_opt.container);
    var request = buildrequest(_opt.stockentry.tags);
    var render = template.compile(tpl);
    var timer;
    this.isAbroadIp = false;
    var that = this;
    this.load = function () {
        _load.apply(this);
        var islogin = user.get() ? true : false
        if (_opt.update > 0 && islogin && !that.isAbroadIp ) {
            timer = setInterval(_load, _opt.update);
        }
        return this;
    }
    this.reload = function () {
        _load.apply(this);
        return this;
    }
    this.stop = function () {
        if (timer) clearInterval(timer);
        return this;
    }

    /**
     * 构建请求
     * @param {object} tags 个股标签
     * @param {string} tags.bStockId B股ID
     * @param {string} tags.bondId 可转债ID
     * @param {string} tags.hStockId H股ID
     */
    function buildrequest(tags) {
        var stymap = {
            bond: 'FC20DPTD',
            b: 'FC20DPABHLR',
            hk: 'FC20DPABHLR'
        }
        var ids = [],
            styles = [],
            fmts = [];
        if (tags.bondId) {
            ids.push(tags.bondId);
            styles.push(stymap['bond']);
            fmts.push('{TYPE:0,DATA:(x)}');
        }
        if (tags.hStockId) {
            ids.push(tags.hStockId);
            styles.push(stymap['hk']);
            fmts.push('{TYPE:1,DATA:(x)}');
        }
        if (tags.bStockId) {
            ids.push(tags.bStockId);
            styles.push(stymap['b']);
            fmts.push('{TYPE:2,DATA:(x)}');
        }
        return {
            cmd: 'P.' + fmts.slice(0, 2).join(',') + '|' + ids.slice(0, 2).join('|'),
            sty: styles.slice(0, 2).join('|')
        }
    }
    
    function _load() {
        var that = this;
        var market_01=stockentry.marketnum==1?1:0;
        $.ajax({
            // url: '//nufm.dfcfw.com/EM_Finance2014NumericApplication/JS.aspx?type=CT&st=z&js=([(x)])&token=de1161e2380d231908d46298ae339369',
            url: '//push2.eastmoney.com/api/qt/stock/get?ut=fa5fd1943c7b386f172d6893dbfba10b&fltt=2&invt=2&fields=f152,f154,f255,f250,f251,f252,f253,f254,f255,f256,f257,f258,f269,f270,f271,f272,f273,f274,f275,f276,f262,f263,f264,f265,f266,f267,f268,f289,f290&secid='+market_01+'.'+stockentry.code,
            data: request,
            dataType: 'jsonp',
            jsonp: 'cb',
            success: function (json) {
                // console.log('AH股')
                // console.log(json)
                var models = {
                    data: [],
                    types: [''/* 转债不显示 */, '(HK)', '(B股)']
                };
                if (!(json.data)) return false;  
                if(json.lt == "2") that.isAbroadIp = true;             
                var dateline=[];               
                var msg = [];
                if (json.data.f262!='-') {
                    msg[0]=[json.data.f263,json.data.f262,json.data.f264,json.data.f267=='-'?'-':(json.data.f267).toFixed(json.data.f265),json.data.f267=='-'?'-':(json.data.f267-json.data.f266).toFixed(json.data.f265),json.data.f268=='-'?'-':json.data.f268.toFixed(json.data.f152),json.data.f289.toFixed(json.data.f154),json.data.f290.toFixed(json.data.f152)];               
                    dateline.push({'TYPE':0,'DATA':msg[0].toString()});
                }
                if (json.data.f256!='-') {
                    msg[1]=[json.data.f257,json.data.f256,json.data.f258,json.data.f251.toFixed(json.data.f255),(json.data.f251-json.data.f250).toFixed(json.data.f255),json.data.f252.toFixed(json.data.f152),json.data.f253,json.data.f254.toFixed(json.data.f152),json.data.f152,json.data.f253.toFixed(json.data.f152)];                
                    dateline.push({'TYPE':1,'DATA':msg[1].toString()});
                }
                if (json.data.f269!='-') {
                    msg[2]=[json.data.f270,json.data.f269,json.data.f271,json.data.f274=='-'?'-':json.data.f274.toFixed(json.data.f272),json.data.f274=='-'?'-':(json.data.f274-json.data.f273).toFixed(json.data.f272),json.data.f275=='-'?'-':json.data.f275.toFixed(json.data.f152),,json.data.f276=='-'?'-':json.data.f276.toFixed(json.data.f152)];                
                    dateline.push({'TYPE':2,'DATA':msg[2].toString()});
                }
                // console.log(dateline)
                
                for (var i = 0; i < dateline.length; i++) {             
                    var line = dateline[i].DATA;
                    // console.log(line)
                    if (typeof line !== 'string') continue;
                    var items = line.split(',');
                    for (var j = 0; j < items.length; j++) {
                        var item = items[j];
                        if (item === '-') items[j] = '';
                    }
                    var data = {
                        type: dateline[i].TYPE,
                        marketType: items[0],
                        code: items[1],
                        name: items[2],
                        close: items[3],
                        change: items[4],
                        changePercent: items[5],
                        color: utils.getColor(items[4]),
                        link: '//quote.eastmoney.com/' + (items[0] === '1' ? 'sh' : 'sz') + items[1] + '.html'
                    };
                    if (dateline[i].TYPE === 0) {
                        data.link = '//quote.eastmoney.com/bond/' +  (data.marketType === '1' ? 'sh' : 'sz') + data.code + '.html';
                        data.close = data.close || items[16];
                        data.conversionValue = items[6];
                        data.premium = items[7];
                    } else if (dateline[i].TYPE === 1) {
                        data.link = '//quote.eastmoney.com/hk/' + data.code + '.html';
                        data.close = data.close || items[11];
                        data.tag = items[10];
                        data.comparison = data.marketType === '1' ? items[6] : items[7];
                        data.premium = data.marketType === '1' ? items[8] : items[9];
                    } else {
                        data.close = data.close || items[11];
                        data.tag = items[10];
                        data.comparison = items[7];
                    }
                    models.data.push(data);
                }
                // if (!(json instanceof Array)) return false;
                // for (var i = 0; i < json.length; i++) {             
                //     var line = json[i].DATA;
                //     console.log(line)
                //     if (typeof line !== 'string') continue;
                //     var items = line.split(',');
                //     for (var j = 0; j < items.length; j++) {
                //         var item = items[j];
                //         if (item === '-') items[j] = '';
                //     }
                //     var data = {
                //         type: json[i].TYPE,
                //         marketType: items[0],
                //         code: items[1],
                //         name: items[2],
                //         close: items[3],
                //         change: items[4],
                //         changePercent: items[5],
                //         color: utils.getColor(items[4]),
                //         link: '//quote.eastmoney.com/' + (items[0] === '1' ? 'sh' : 'sz') + items[1] + '.html'
                //     };
                //     if (json[i].TYPE === 0) {
                //         data.link = '//quote.eastmoney.com/bond/' +  (data.marketType === '1' ? 'sh' : 'sz') + data.code + '.html';
                //         data.close = data.close || items[16];
                //         data.conversionValue = items[14];
                //         data.premium = items[7];
                //     } else if (json[i].TYPE === 1) {
                //         data.link = '//quote.eastmoney.com/hk/' + data.code + '.html';
                //         data.close = data.close || items[11];
                //         data.tag = items[10];
                //         data.comparison = data.marketType === '1' ? items[6] : items[7];
                //         data.premium = data.marketType === '1' ? items[8] : items[9];
                //     } else {
                //         data.close = data.close || items[11];
                //         data.tag = items[10];
                //         data.comparison = data.marketType === '1' ? items[6] : items[7];
                //     }
                //     models.data.push(data);
                // }
                var html = render(models);
                $dom.html(html);
            }
        });
    }
}

module.exports = relatedquote;

/***/ }),

/***/ "./src/modules/old_concept/components/relatedquote/render.js":
/*!*******************************************************************!*\
  !*** ./src/modules/old_concept/components/relatedquote/render.js ***!
  \*******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var calender = __webpack_require__( /*! ./stockcalender */ "./src/modules/old_concept/components/relatedquote/stockcalender.js");
var related = __webpack_require__(/*! ./relatedquote */ "./src/modules/old_concept/components/relatedquote/relatedquote.js");
module.exports = {         
    load: function () {
        var entry = window.stockentry,
            tags = entry.tags;
        if (tags.bStockId || tags.hStockId || tags.bondId) {
            $('#stock-calender, #stock-calender-title').addClass('single');
            $('#related-quote').show();
            new calender({
                stockentry: entry,
                displayCount: 1
            }).load();
            new related({
                stockentry: entry
            }).load();
        } else {
            new calender({
                stockentry: entry,
                displayCount: 2
            }).load();
        }
    }
}

/***/ }),

/***/ "./src/modules/old_concept/components/relatedquote/stockcalender.js":
/*!**************************************************************************!*\
  !*** ./src/modules/old_concept/components/relatedquote/stockcalender.js ***!
  \**************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// require('./stockcalender.css');

var $ = __webpack_require__(/*! jquery */ "jquery");
var utils = __webpack_require__(/*! ../../modules/utils */ "./src/modules/old_concept/modules/utils.js");
var template = __webpack_require__(/*! ../../modules/template-web */ "./src/modules/old_concept/modules/template-web.js");
var tpl = __webpack_require__(/*! ./stockcalender.art */ "./src/modules/old_concept/components/relatedquote/stockcalender.art");

__webpack_require__(/*! ../../modules/jquery-plugins/jquery.vticker */ "./src/modules/old_concept/modules/jquery-plugins/jquery.vticker.js");

/**
 * 个股日历
 * @param {object} options 选项
 * @param {object} options.stockentry 股票入口
 * @param {string} options.stockentry.code 代码
 * @param {object} options.stockentry.tags 属性标签
 * @param {string|HTMLElement} options.container 容器
 * @param {number} options.displayCount 显示条数
 */
function stockcalender(options) {
    var defaults = {
        stockentry: window.stockentry,
        container: '#stock-calender'
    };
    var _opt = $.extend(defaults, options);
    var render = template.compile(tpl);
    this.load = function () {
        var $dom = $('.calender-box', _opt.container);       
    // $('#quote-time').one('tick', function (e, time, status) {
        var time = new Date();
        var region = getRegion(time, "yyyy-MM-dd");
        var url = '//dcfm.eastmoney.com/em_mutisvcexpandinterface/api/js/get?type=GGSJ20_ZDGZ&token=70f12f2f4f091e459a279469fe49eca5&&st=rq&sr=-1&p=1&ps=10';
        $.ajax({
            url: url,
            data: {
                filter: '(gpdm=\'' + _opt.stockentry.code + '\' and rq>=^' + region.begin + '^ and rq < ^' + region.end + '^)'
            },
            dataType: 'jsonp',
            success: function (json) {
                // console.log('111111111111111111111111111111111')
                // console.log(json)
                if (!json || !(json instanceof Array)) return false;
                for (var i = 0; i < json.length; i++) {
                    if (!json[i]) continue;
                    json[i].href = getLink(json[i], _opt.stockentry);
                }
                var html = render({
                    data: json
                });
                $dom.find('ul').html(html);
                $dom.vTicker({
                    pause: 10 * 1000,
                    direction: 'down',
                    showItems: _opt.displayCount,
                    height: _opt.displayCount === 1 ? 25 : 54
                });

                $('.scroll-btn', _opt.container).click(function () {
                    $dom.trigger('stop.vticker')
                        .trigger('moveup.vticker')
                        .trigger('start.vticker');
                });
            }
        });
    // });
    }
}

/**
 * 获取时间区间
 * @param {Date} time 时间
 * @param {string} fmt 格式化
 */
function getRegion(time, fmt) {
    var begin = new Date(time),
        end = new Date(time);
    begin.setDate(time.getDate() + 180);
    end.setDate(time.getDate() - 180);
    return {
        begin: utils.formatDate(end, fmt),
        end: utils.formatDate(begin, fmt)
    };
}

function getLink(item, stockinfo) {
    var href='';
    switch (item.sjlxz) {
        // 停牌日期
        case "TFP":
            href = "http://data.eastmoney.com/tfpxx/";
            break;
            // 龙虎榜
        case "LHB":
            href = "http://data.eastmoney.com/stock/lhb/" + item.gpdm + ".html";
            break;
            // 大宗交易
        case "DZJY":
            href = "http://data.eastmoney.com/dzjy/detail/" + item.gpdm + ".html";
            break;
            // 公告
        case "GG":
            href = "http://data.eastmoney.com/notices/stock/" + item.gpdm + ".html";
            break;
            // 研报
        case "YB":
            href = "http://data.eastmoney.com/report/" + item.gpdm + ".html";
            break;
            // 机构调研
        case "JGDY":
            href = "http://data.eastmoney.com/jgdy/gsjsdy/" + item.gpdm + ".html";
            break;
            // 股东增减持日
        case "GDZJC":
            href = "http://data.eastmoney.com/executive/gdzjc/" + item.gpdm + ".html";
            break;
            // 限售解禁日
        case "XSJJ":
            href = "http://data.eastmoney.com/dxf/q/" + item.gpdm + ".html";
            break;
            // 高管持股
        case "GGZJC":
            href = "http://data.eastmoney.com/executive/" + item.gpdm + ".html";
            break;
            // 高管关联人持股
        case "GGXGZJC":
            href = "http://data.eastmoney.com/executive/" + item.gpdm + ".html";
            break;
            // 预约披露日
        case "YYPL":
            href = "http://data.eastmoney.com/bbsj/" + item.gpdm + ".html";
            break;
            // 业绩预告
        case "YJYG":
            href = "http://data.eastmoney.com/bbsj/" + item.gpdm + ".html";
            break;
            // 业绩快报
        case "YJKB":
            href = "http://data.eastmoney.com/bbsj/" + item.gpdm + ".html";
            break;
            // 业绩报表
        case "YJBB":
            href = "http://data.eastmoney.com/bbsj/" + item.gpdm + ".html";
            break;
            // 股本变动
        case "GBBD":
            href = "http://emweb.securities.eastmoney.com/f10_v2/CapitalStockStructure.aspx?type=web&code=" + stockinfo.market + item.gpdm;
            break;
            // 新股
        case "XGSG":
            href = "http://data.eastmoney.com/xg/xg/detail/" + item.gpdm + ".html";
            break;
            // 分红
        case "FHPS":
            href = "http://data.eastmoney.com/yjfp/detail/" + item.gpdm + ".html";
            break;
            // 股东大会
        case "GDDH":
            href = "http://data.eastmoney.com/gddh/list/" + item.gpdm + ".html";
            break;
            // 股东户数
        case "GDHS":
            href = "http://data.eastmoney.com/gdhs/detail/" + item.gpdm + ".html";
            break;
            //并购重组
        case "BGCZ":
            href = "http://data.eastmoney.com/bgcz/detail/" + item.gpdm + ".html";
            break;
            //公司投资
        case "GSTZ":
            href = " http://data.eastmoney.com/gstz/stock/" + item.gpdm + ".html";
            break;
            //股权质押
        case "GQZY":
            href = "http://data.eastmoney.com/gpzy/detail/" + item.gpdm + ".html";
            break;
            //委托理财
        case "WTLC":
            href = "http://data.eastmoney.com/wtlc/detail/" + item.gpdm + ".html";
            break;
            //重大合同
        case "ZDHT":
            href = " http://data.eastmoney.com/zdht/detail/" + item.gpdm + ".html";
            break;
            //股票回购
        case "GPHG":
            href = "http://data.eastmoney.com/gphg/" + item.gpdm + ".html";
            break;
            //关联交易
        case "GLJY":
            href = "http://data.eastmoney.com/gljy/detail/" + item.gpdm + ".html";
            break;
        default:
            break;
    }
    return href;
}

module.exports = stockcalender;

/***/ }),

/***/ "./src/modules/old_concept/components/toolbox/toolbox.js":
/*!***************************************************************!*\
  !*** ./src/modules/old_concept/components/toolbox/toolbox.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// require('./tool-box.css');
var $ = __webpack_require__(/*! jquery */ "jquery");
var throttle = _.throttle;
var template = __webpack_require__(/*! ../../modules/template-web */ "./src/modules/old_concept/modules/template-web.js");
var tpl = __webpack_require__(/*! ./tool-box.art */ "./src/modules/old_concept/components/toolbox/tool-box.art");
//var guidance = require('../guidance/guidance');
var cookie = __webpack_require__(/*! ../../modules/utils.cookie */ "./src/modules/old_concept/modules/utils.cookie.js");
var modal = __webpack_require__(/*! ../../modules/modal */ "./src/modules/old_concept/modules/modal/index.js");
var modalright = __webpack_require__(/*! ../../modules/modalright */ "./src/modules/old_concept/modules/modalright/index.js");
module.exports = toolbox;

function toolbox(options) {
    var _opt = $.extend({}, toolbox.defaults, options);
    this.load = function () {
        var html = template.render(tpl, _opt.stockinfo);
        var $dom = $(html);
        $('#container_wrapper').append($dom);

        
       var mixHieght = 160;
       var tHeight = $(document).scrollTop() + $(window).height() - mixHieght;

        $dom.css("top",(tHeight-mixHieght)+'px');
        $dom.show();
        var seter = null;
        var seterTime = 100;
        $(window).scroll(function(){
            if(seter){
                window.clearTimeout(seter);
            }
            seter = setTimeout(function(){
                var tHeight = $(document).scrollTop() + $(window).height() - mixHieght;
                $dom.css("top",(tHeight-mixHieght)+'px');
            },seterTime)
        })



        this.bindevents($dom);
        if (localStorage) {
            if (localStorage.getItem('rememberme') === '1') {
                // $('#tool-box-gnb span').html('行情单<br/>页设置');
                $("#paixu1").attr("checked","checked");
            } else {
                // $('#tool-box-gnb span').html('行情单<br/>页设置');
                $("#paixu2").attr("checked","checked");
            }
        }
    }

    this.bindevents = function (context) {
        //默认概念版行情
        gnbRender(context);
        // 返回经典版
        classicRender(context);
        // 意见反馈
        feedbackRender(context);
        // 搜索
        searchRender(context);
        // 功能引导
        guidanceRender(context);
        // 返回顶部
        gotopRender(context);
    }
    this.load();


    function gnbRender(conatiner) {
        $('#tool-box-gnb', conatiner).hover(function (e) {
            $('span', this).hide();
            $('.icon-gnb', this).animate({
                left: 11
            }).show();
        }, function (e) {
            $('span', this).css("display","inline");
            $('.icon-gnb', this).css('left', 50).hide();
        });
        $('#tool-box-gnb', conatiner).hover(function (e) {
            $('span', this).hide();
            $('.icon-set', this).animate({
                left: 11
            }).show();
        }, function (e) {
            $('span', this).css("display","inline");
            $('.icon-set', this).css('left', 50).hide();
        });
        $('#tool-box-gnb', conatiner).click(function (e) {
            $('.__em_modalright').show();        
            $('#tool-box-gnb').addClass('icon-set1');
            $('#tool-box-gnb .icon-set').show();
            $('#tool-box-gnb .icon-gnb').show();
            $('#tool-box-gnb span').hide();  
            $('#tool-box-gnb span').html('')       
        });
        $('.__em_dialogright_head span').click(function (e) {
            $('.__em_modalright').hide();    
            if (localStorage.getItem('rememberme') === '1') {
                $('#tool-box-gnb span').html('行情单<br/>页设置');
            } else {
                $('#tool-box-gnb span').html('行情单<br/>页设置');
            }   
            $('#tool-box-gnb').removeClass('icon-set1'); 
        }) 
        $('.__em_dialogright_foot .__em_dialogright_confirm').click(function (e) {
            $('.__em_modalright').hide(); 
            var val=$('input:radio[id="paixu1"]:checked').val();
            var val1=$('input:radio[id="paixu2"]:checked').val();
            // console.log(val)
            // console.log(val1)
            if (val == 'on') {               
                localStorage.setItem('rememberme', 0);              
                console.log('默认概念版行情')             
                var collect = new modal.confirm({
                    shade: 1,
                    p1: "您已成功设置默认打开概念版行情单页"
                });
                collect.show();
                collect.onConfirm = function (e, modal) {
                    $('#tool-box-gnb span').html('行情单<br/>页设置');
                    modal.hide();
                    $('#tool-box-gnb').removeClass('icon-set1'); 
                }
            } 

            if(val1 == 'on') {
                localStorage.setItem('rememberme', 1);                              
                console.log('默认经典版行情')
                var collect = new modal.confirm({
                    shade: 1,
                    p1: "您已取消设置默认打开概念版行情单页"
                }); 
                collect.show();          
                collect.onConfirm = function (e, modal) {
                    $('#tool-box-gnb span').html('行情单<br/>页设置');
                    modal.hide();
                    $('#tool-box-gnb').removeClass('icon-set1'); 
                }
                
            }  
        })
        if (!_opt.gnb.show) $('#tool-box-gnb', conatiner).hide();
    }


    function classicRender(conatiner) {
        $('#tool-box-classic', conatiner).hover(function (e) {
            $('span', this).hide();
            $('.icon-fh', this).animate({
                left:11
            }).show();
        }, function (e) {
            $('span', this).show();
            $('.icon-fh', this).css('left', 50).hide();
        });
        $('#tool-box-classic', conatiner).click(function (e) {  
            localStorage.setItem('rememberme', 1);  
            cookie('em-quote-version', 'classic', {
                expires: 24 * 365 * 100,
                path: '/',
                domain: 'eastmoney.com'
            });
            return true;
        });
        if (!_opt.classic.show) $('#tool-box-classic', conatiner).hide();
    }

    function feedbackRender(conatiner) {
        $('#tool-box-feedback', conatiner).hover(function (e) {
            var ctx = this;
            $('span', ctx).hide();
            $('div', ctx).show();
            $('.feedback-left', ctx).animate({
                left: 12
            }, {
                duration: 250,
                complete: function () {
                    $('.feedback-right', ctx).animate({
                        left: 24
                    }, 250);
                }
            });
        }, function (e) {
            $('span', this).show();
            $('div', this).hide();
            $('.feedback-left', this).css('left', -36);
            $('.feedback-right', this).css('left', 50);
        });
        if (!_opt.feedback.show) $('#tool-box-feedback', conatiner).hide();
    }

    function searchRender(conatiner) {
        $('#tool-box-sreach', conatiner).hover(function () {
            $(this).removeClass('icon-fdj');
            $('div', this).show();
            $('.search-left', this).animate({
                left: 11
            });
            $('.search-right', this).animate({
                left: 11
            });
        }, function () {
            $('div', this).hide();
            $('.search-left', this).css('left', -33);
            $('.search-right', this).css('left', 50);
            $(this).addClass('icon-fdj');
        });
        if (!_opt.search.show) $('#tool-box-sreach', conatiner).hide();
    }

    function guidanceRender(conatiner) {
        $('#tool-box-guide', conatiner).hover(function (e) {
            var ctx = this;
            $('span', ctx).hide();
            $('.icon-gnyd', ctx).fadeIn();
        }, function (e) {
            var ctx = this;
            $('span', ctx).show();
            $('.icon-gnyd', ctx).hide();
        });
        $('#tool-box-guide', conatiner).click(function (e) {
            //new guidance().show();
        });
        if (!_opt.guidance.show) $('#tool-box-guide', conatiner).hide();
    }

    function gotopRender(conatiner) {
        var threshold = $(window).height();
        $(window).resize(function (e) {
            threshold = $(window).height()
        });
        $(window).scroll(throttle(function (e) {
            if ($(document).scrollTop() >= threshold) $('#tool-box-gotop').show();
            else $('#tool-box-gotop').hide();
        }, 500));
        $('#tool-box-gotop', conatiner).hover(function (e) {
            $(this).removeClass('icon-zhiding');
            $(this).text('回到顶部');
        }, function (e) {
            $(this).addClass('icon-zhiding');
            $(this).text('');
        });
        $('#tool-box-gotop', conatiner).click(function (e) {
            $(document).scrollTop(0);
            return false;
        });
        if (!_opt.gotop.show) $('#tool-box-gotop', conatiner).hide();
    }
}

toolbox.defaults = {
    stockinfo: stockentry,
    classic: {
        show: true
    },
    feedback: {
        show: true
    },
    search: {
        show: true
    },
    guidance: {
        show: true
    },
    gotop: {
        show: true
    },
    gnb: {
        show: true
    }
}

/***/ }),

/***/ "./src/modules/old_concept/components/vote/vote.js":
/*!*********************************************************!*\
  !*** ./src/modules/old_concept/components/vote/vote.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "jquery");
var COOKIE = __webpack_require__(/*! ../../modules/utils.cookie */ "./src/modules/old_concept/modules/utils.cookie.js");
var template = __webpack_require__(/*! ../../modules/template-web */ "./src/modules/old_concept/modules/template-web.js");
var popup = __webpack_require__(/*! ../popup/popup */ "./src/modules/old_concept/components/popup/popup.js");
var tpl = __webpack_require__(/*! ./vote.art */ "./src/modules/old_concept/components/vote/vote.art");
// require('./look-box.css');

function vote(args) {
    var self = this;
    var _opt = this.options = $.extend({
        container: '#vote-box',
        entry: window.stockentry
    }, args);
    this.container = $(_opt.container);
    this.tplRender = template.compile(tpl);
}

vote.prototype.preload = function (data) {
    var html = this.tplRender({
        state: false
    });
    this.container.html(html);
    return this;
}

vote.prototype.load = function () {
    var self = this;
    $.ajax({
        method: 'GET',
        url: '/newapi/getstockvote',
        data: {
            code: this.options.entry.market + this.options.entry.code
        },
        dataType: 'json',
        success: function (json) {
            if (json && json.Status == 1) {
                var total = json.stockbar_look_high_count + json.stockbar_look_low_count;
                var html = self.tplRender({
                    state: true,
                    bullishPercent: parseFloat(json.Data.TapeZ * 100).toFixed(2) || 50,
                    bearishPercent: parseFloat(json.Data.TapeD * 100).toFixed(2) || 50
                });
                var $dom = $(html).data('bullish', json.Data.TapeZ)
                    .data('bearish', json.Data.TapeD);
                bindevent.apply(self, [$dom]);                
                self.container.html($dom);
            }
        }
    });
    return this.preload();
}
var tid;
vote.prototype.vote = function (direction, callback) {
    var self = this,
        uid = COOKIE('uidal') || COOKIE('qgqp_b_id');
    clearInterval(tid);
    tid = setTimeout(function () {
        $.ajax({
            method: 'POST',
            url: '/newapi/votestock',
            data: {
                code: self.options.entry.market + self.options.entry.code,
                tapetype: direction,
                uid: uid
            },
            dataType: 'json',
            success: function (json) {
                if (json) {
                    var $container = self.container;
                    new popup({
                        title: '投票' + (json.Status == 1 ? '成功' : '失败'),
                        css: 'popup-alert',
                        content: json.Message
                    }).show();
                    if (typeof callback === 'function') callback.apply(self, [json]);
                }
            }
        });
    }, 150);
}

function bindevent(context) {
    var self = this;
    $('#vote-bullish', context).hover(function () {
        $(this).addClass('kzh-span-hover');
        $('.look-up', context).addClass('look-up-hover');
    }, function () {
        $(this).removeClass('kzh-span-hover');
        $('.look-up', context).removeClass('look-up-hover');
    });
    $('#vote-bearish', context).hover(function () {
        $(this).addClass('kd-span-hover');
        $('.look-down', context).addClass('look-down-hover');
    }, function () {
        $(this).removeClass('kd-span-hover');
        $('.look-down', context).removeClass('look-down-hover');
    });
    $('#vote-bullish', context).click(function (e) {
        self.vote(1, function (json) {
            if (json.Status == 1) {
                context.data('bullish', json.Data.TapeZ);
                $('#vote-bullish').text('已看涨').mouseenter();
                recaculate();
            }
        });
        unbindevent(context);
        return false;
    });
    $('#vote-bearish', context).click(function (e) {
        self.vote(-1, function (json) {
            if (json.Status == 1) {
                context.data('bearish', json.Data.TapeD);
                $('#vote-bearish').text('已看跌').mouseenter();
                recaculate();
            }
        });
        unbindevent(context);
        return false;
    });

    function recaculate() {
        var bullish = parseFloat(context.data('bullish')) || 0,
            bearish = 1 - bullish,
            _width;
        $('.look-up', '#vote-bar').width((bullish * 100).toFixed(1) + '%');
        $('.look-down', '#vote-bar').width((bearish * 100).toFixed(1) + '%');        
    }

    function unbindevent() {
        $('#vote-bearish,#vote-bullish', context)
            .addClass('disable')
            .unbind('mouseenter')
            .unbind('mouseleave')
            .unbind('click');
    }
}

module.exports = vote;

/***/ }),

/***/ "./src/modules/old_concept/config.js":
/*!*******************************************!*\
  !*** ./src/modules/old_concept/config.js ***!
  \*******************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var utils = __webpack_require__(/*! ./modules/utils */ "./src/modules/old_concept/modules/utils.js");

var cache = new utils.ObjectCache();
/**
 * 获取url参数
 * @param {string} variable 参数名
 */
function getQueryString(variable) {
    try {
        //增加缓存
        if (cache.hasOwnProperty(variable)) {
            return cache[variable];
        }
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                cache[variable] = pair[1];
                return pair[1];
            }
        }
        return false;
    } catch (error) {
        return false;
    }
}


module.exports = {
    "development":{
        commonApi:"//push2.eastmoney.com/",
        tsApi:"//"+(Math.floor(Math.random() * 99) + 1)+".push2.eastmoney.com/"
    },
    "production":{
        commonApi:"//push2.eastmoney.com/",
        tsApi:"//"+(Math.floor(Math.random() * 99) + 1)+".push2.eastmoney.com/"
    },
    "test":{ 
        // commonApi:"http://61.129.249.233:18665/",
        // tsApi:"http://61.129.249.233:18665/"
        commonApi: "http://61.152.230.207/",
        tsApi: "http://61.152.230.207/"
    },
    getEnvPath:function(name,value){
        //特殊情况设置默认值
        if(!!value){
            return value;
        }
        //防止名称误传
        if(!this.production[name]){
            return this.production.commonApi
        }
        //根据参数hq-env值，来区分环境
        var env = getQueryString("env");
        // console.log("env:"+env)
        if(!env){
            return this.production[name] || "";
        }
        if(env === "development" || env === "production" || env === "test" ){
            return this[env][name]
        }else{
            return  this.production[name] || "";
        }
    }
}

/***/ }),

/***/ "./src/modules/old_concept/head.js":
/*!*****************************************!*\
  !*** ./src/modules/old_concept/head.js ***!
  \*****************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "jquery");
var merge = _.merge;
var utils = __webpack_require__(/*! ./modules/utils */ "./src/modules/old_concept/modules/utils.js");
var emcharts = __webpack_require__(/*! ./modules/quotecharts */ "./src/modules/old_concept/modules/quotecharts.js");
//var HistoryView = require('./modules/historyview');
var searchurl = '//emcharts.eastmoney.com/suggest/stocksuggest2017.min.js';
var supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;

var suggest2017;
module.exports = {
    loadChart: function () {
        chartsRender.apply(this);
    },
    loadSearch: function () {
        if (typeof suggest2017 !== 'function') {
            $.getScript(searchurl, function () {
                suggest2017 = __webpack_require__(/*! suggest2017 */ "suggest2017");
                searchRender.apply(this);
            });
        } else {
            searchRender.apply(this);
        }
    },
    loadQuote: function () {
        _load();

        var timer = setInterval(_load, 20 * 1000);
        var context = $('#index-boards');
        $('#quote-time').on('tick', function (e, time, status) {
            if (status === 'close') {
                clearInterval(timer);
            }
        });
        gethgts();

        function _load() {
            $.ajax({
                // url: '//nufm.dfcfw.com/EM_Finance2014NumericApplication/JS.aspx?type=CT&sty=CVPFF&st=z&token=4f1862fc3b5e77c150a2b985b12db0fd',              
                url:'//push2.eastmoney.com/api/qt/ulist.np/get?ut=fa5fd1943c7b386f172d6893dbfba10b&fltt=2&invt=2&fields=f1,f2,f3,f4,f12,f13,f152',
                dataType: 'jsonp',
                jsonp: 'cb',
                // data: {
                //     cmd: '0000011,3990012,3990062,' + $('#ralated_board').data('id')
                // },
                data:{
                    secids:'1.000001,0.399001,0.399006,' + $('#ralated_board').data('nid')
                },
                success: function (json) {
                    // if (json instanceof Array) {
                    //     for (var i = 0; i < json.length; i++) {
                    //         var item = json[i].split(',');
                    //         var $dom = $('li[data-id=' + item[0] + ']', context);
                    //         if ($dom.length > 0) {
                    //             var color = item[2] > 0 ? 'red' : item[2] < 0 ? 'green' : '';
                    //             $dom.find('[data-quote=close]').removeClass().html(item[1]).addClass(color);
                    //             $dom.find('[data-quote=change]').removeClass().html(item[2]).addClass(color);
                    //             $dom.find('[data-quote=changePercent]').removeClass().html(item[3] + '%').addClass(color);
                    //             $dom.find('b').removeClass().addClass(item[2] > 0 ? 'icon-arrow-up' : item[2] < 0 ? 'icon-arrow-down' : '');
                    //         }
                    //     }
                    // }
                    // console.log(json)
                    var datas = ['0000011','3990012','3990062',$('#ralated_board').data('id')]
                    if (json.data.diff instanceof Array) {
                        for (var i = 0; i < json.data.total; i++) {
                            var item = json.data.diff[i];
                            var $dom = $('li[data-id=' +datas[i] + ']', context);
                            if ($dom.length > 0) {
                                var color = item.f4 > 0 ? 'red' : item.f4 < 0 ? 'green' : '';
                                if(item.f2){
                                    // $dom.find('[data-quote=close]').removeClass().html(item.f2.toFixed(item.f1)).addClass(color);  
                                    $dom.find('[data-quote=close]').removeClass().html(utils.toFixedFun(item.f2,item.f1)).addClass(color);  
                                }
                                if(item.f4){
                                    // $dom.find('[data-quote=change]').removeClass().html(item.f4.toFixed(item.f1)).addClass(color);
                                    $dom.find('[data-quote=change]').removeClass().html(utils.toFixedFun(item.f4,item.f1)).addClass(color);
                                }
                                if(item.f3){
                                    // $dom.find('[data-quote=changePercent]').removeClass().html(item.f3.toFixed(item.f152) + '%').addClass(color);                                    
                                    $dom.find('[data-quote=changePercent]').removeClass().html(utils.toPercent(item.f3,item.f152)).addClass(color);                                    
                                }
                                $dom.find('b').removeClass().addClass(item.f4 > 0 ? 'icon-arrow-up' : item.f4 < 0 ? 'icon-arrow-down' : '');
                            }
                        }
                    }
                }
            });
        }

        // 沪深港股
        function gethgts() {
            var timer;
            clearTimeout(timer);
            $.ajax({
                url: "//push2.eastmoney.com/api/qt/kamt/get?fields1=f1,f2,f3,f4&fields2=f51,f52,f53,f54&ut=b2884a393a59ad64002292a3e90d46a5",
                jsonp: "cb",
                dataType: "jsonp",
                success: function (json) {
                    if (json) {       
                        var items = json.data;
                        if (items) {
                            var hgtzj = items.hk2sh.dayNetAmtIn == 0 ? '-' : utils.numbericFormat(items.hk2sh.dayNetAmtIn * 10000),
                                sgtzj = items.hk2sz.dayNetAmtIn == 0 ? '-' : utils.numbericFormat(items.hk2sz.dayNetAmtIn * 10000),
                                ggthzj = items.sh2hk.dayNetAmtIn == 0 ? '-' : utils.numbericFormat(items.sh2hk.dayNetAmtIn * 10000),
                                ggtszj = items.sz2hk.dayNetAmtIn == 0 ? '-' : utils.numbericFormat(items.sz2hk.dayNetAmtIn * 10000);

                            $('#hgtzj').html(hgtzj).removeClass('red green').addClass(utils.getColor(items.hk2sh.dayNetAmtIn)); // 沪股通
                            $("#sgtzj").html(sgtzj).removeClass('red green').addClass(utils.getColor(items.hk2sz.dayNetAmtIn)); // 深股通
                            $("#ggthzj").html(ggthzj).removeClass('red green').addClass(utils.getColor(items.sh2hk.dayNetAmtIn));// 港股通(沪)
                            $("#ggtszj").html(ggtszj).removeClass('red green').addClass(utils.getColor(items.sz2hk.dayNetAmtIn)); // 港股通(深) 
                            
                            if(items.hk2sh.status === 4){
                                $("#hgtzj").html("- -").removeClass('red green');
                            }

                            if(items.hk2sz.status === 4){
                                $("#sgtzj").html("- -").removeClass('red green');
                             }

                            if(items.sh2hk.status === 4){
                                $("#ggthzj").html("- -").removeClass('red green');
                            }
        
                            if(items.sz2hk.status === 4){
                               $("#ggtszj").html("- -").removeClass('red green');
                            }

                            $('#hgtrun').html(getstatus(items.hk2sh.status));
                            $('#sgtrun').html(getstatus(items.hk2sz.status));
                            $('#ggthrun').html(getstatus(items.sh2hk.status));
                            $('#ggtsrun').html(getstatus(items.sz2hk.status));
                        }
                       
                       
                    }
                },
                complete: function () {
                    timer = setTimeout(gethgts, 20 * 1000);
                }
            });
        }
        getstatus = function (number) {
            // 额度可用->有额度, 午盘休息->午休, 早盘清空->清空, 额度用完->无额度, 今日停牌->停牌, 股市收盘->收盘, 今日休市->休市, 限制买入->限买, 限制卖出->限卖, 暂停
            var typeStr = "";
            var type = parseFloat(number);
            if (type == "NaN" || isNaN(type)) {
                typeStr = '<b></b>';
                return typeStr;
            }
            switch (type) {
                case 1:
                    typeStr = '<b class="ksp-box icon-kp"></b>有额度';
                    break;
                case 2:
                    typeStr = '<b class="ksp-box  icon-sp"></b>无额度';
                    break;
                case 3:
                    typeStr = '<b class="ksp-box  icon-sp"></b>收盘';
                    break;
                case 4:
                    typeStr = '<b class="ksp-box  icon-sp"></b>休市';
                    break;
            }        
            return typeStr;
        }

        //最近访问在main.js文件跟最近访问列表一起       

        //面包屑
        bannarNav();
    }
}

var chartcfg = {
    width: 280,
    height: 160,
    token: 'e1e6871893c6386c5ff6967026016627',
    padding: {
        left: 1,
        right: 0,
        top: 1,
        bottom: 0
    },
    show: {
        title: false
    },
    color: {
        border: '#e6e6e6'
    },
    timeline: [{
        time: '11:30/13:00',
        position: 0.5
    }],
    bigImg: {
        stauts: 'show'
    },
    update: 20 * 1000
};

/**
 * 下拉搜索
 */
function searchRender() {
    function getSearchLink(result) {
        if (result.MarketType === '6') {
            return '//so.eastmoney.com/link?input=' + result.Code +
                '&returnurl=http://fund.eastmoney.com/' + result.Code +
                '.html&marketType=' + result.MarketType;
        } else if (result.Classify === 'AStock' /*|| result.Classify === 'BStock'*/ ) {
            var link = location.protocol + '//' + location.host + window.root + (result.MarketType === '1' ? 'sh' : 'sz') + result.Code + '.html';
            return '//so.eastmoney.com/link?input=' + result.Code + '&returnurl=' + link + '&marketType=' + result.MarketType;
        } else {
            // return '//so.eastmoney.com/link?input=' + result.Code +
            //     '&returnurl=' + location.protocol + '//quote.eastmoney.com/web/r/' + result.Code + result.MarketType +
            //     '&marketType=' + result.MarketType;

            var newMarketNum = result.MarketType == '1' ? '1':'0';
            return '//so.eastmoney.com/link?input=' + result.Code +
                '&returnurl=' + location.protocol + '//quote.eastmoney.com/unify/r/' + newMarketNum + '.' + result.Code +'&marketType=' + result.MarketType;;
        }
    }
    var suggest = new suggest2017({
        inputid: 'seach_box',
        placeholder: '输代码、名称或简拼',
        width: 280,
        position: {
            left: 10
        },
        shownewtips: true,
        newtipsoffset: {
            left: 15,
            top: 1
        },
        onConfirmStock: function (result) {
            if (!result || typeof result.stock !== 'object') return true;
            if (result.stock.Classify === 'AStock') {
                window.open(window.root + (result.stock.MarketType === '1' ? 'sh' : 'sz') + result.stock.Code + '.html');
            } else {
                // window.open('//quote.eastmoney.com/web/r/' + result.stock.ID);
                //http://quote.eastmoney.com/unify/r/{行情部市场号}.{股票代码}
                window.open('//quote.eastmoney.com/unify/r/' + result.stock.QuoteID);
            }
        }//,
        // quoteLink: getSearchLink,
        // hotStockLink: getSearchLink
    });
}

function chartsRender() {
    var _loaded = false;

    var shindex = new emcharts('timemini', merge({}, chartcfg, {
        container: '#sh_index_chart',
        code: $('#sh_index').data('nid')
    }));
    var szindex = new emcharts('timemini', merge({}, chartcfg, {
        container: '#sz_index_chart',
        code: $('#sz_index').data('nid')
    }));
    var gemindex = new emcharts('timemini', merge({}, chartcfg, {
        container: '#gem_chart',
        code: $('#gem_index').data('nid')
    }));
    var ralatedboard = new emcharts('timemini', merge({}, chartcfg, {
        container: '#ralated_board_chart',
        code: $('#ralated_board').data('nid')
    }));

    var context = $('#index-boards');
    var show = true;
    try {
        show = localStorage.getItem('headcharts') === '0';
    } catch (e) {
        console.error(e);
    }

    if (show) {
        $(context).find('.js-box').hide();
        $('#btn-headcharts').html('展开<b class="icon-slide-up"></b>')
        //$('#btn-headcharts').removeClass('icon-slide-down').addClass('icon-slide-up');
    } else {
        $(context).find('.js-box').show();
        start();
    }
    // 触屏端兼容
    if (supportsTouch) {
        $('li a', context).on('touchend', function (e) {
            window.open($(this).attr('href'));
            return false;
        }).click(function (e) {
            return false;
        });
    }

    //导航下面的js图展开和隐藏
    $('#btn-headcharts').click(function () {
        var delay;
        if ($('#btn-headcharts b').hasClass('icon-slide-down')) {
            $('#btn-headcharts').html('展开<b class="icon-slide-up"></b>')
            //$('#btn-headcharts b').removeClass('icon-slide-down').addClass('icon-slide-up');
            $('.js-box', context).css('margin-top', 10).slideUp(function (e) {
                if (delay) clearTimeout(delay);
                delay = setTimeout(function () {
                    save('0');
                    stop();
                }, 20);
            });
        } else {
            $('#btn-headcharts').html('收起<b class="icon-slide-down"></b>')
            //$('#btn-headcharts b').addClass('icon-slide-down').removeClass('icon-slide-up');
            $('.js-box', context).slideDown(function (e) {
                if (delay) clearTimeout(delay);
                delay = setTimeout(function () {
                    save('1');
                    if (!_loaded) {
                        start();
                    } else reload();
                }, 20);
            });
        }
        return false;
    });
    $('#quote-time').on('tick', function (e, time, status) {
        if (status === 'close') {
            stop();
        }
    });

    function save(value) {
        try {
            localStorage.setItem('headcharts', value);
        } catch (e) {
            console.error(e);
        }
    }

    function reload() {
        shindex.reload();
        szindex.reload();
        gemindex.reload();
        ralatedboard.reload();
    }

    function start() {
        shindex.load();
        szindex.load();
        gemindex.load();
        ralatedboard.load();
        _loaded = true;
    }

    function stop() {
        shindex.stop();
        szindex.stop();
        gemindex.stop();
        ralatedboard.stop();
        _started = false;
    }
}


//面包屑
function bannarNav() {
    var _stock = window.stockentry
    $("#brendnav-item-5").html(_stock.name);
    $("#brendnav-item-4").html(_stock.board.name).attr("href", "/center/boardlist.html#boards-" + _stock.board.id);
    var ab = ['6', '13', '80'];
    var _href = "//quote.eastmoney.com/center/gridlist.html";
    if (ab.indexOf(_stock.jys) < 0) {
        $("#brendnav-item-3").html("上证A股").attr("href", _href + "#sh_a_board");
    } else {
        $("#brendnav-item-3").html("深证A股").attr("href", _href + "#sz_a_board");
    }
}

/***/ }),

/***/ "./src/modules/old_concept/index.js":
/*!******************************************!*\
  !*** ./src/modules/old_concept/index.js ***!
  \******************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/**
 * huangzhen.js
 * 2018-3-7
 */
// css
// require('./css/reset.css');
// require('./css/incompatible-icons.css');
// require('./css/quote-icons.css');
// require('./css/index.css');

var mock = __webpack_require__(/*! ./components/mocktrade/mock */ "./src/modules/old_concept/components/mocktrade/mock.js");
var popup = __webpack_require__(/*! ./components/popup/popup */ "./src/modules/old_concept/components/popup/popup.js");
var customfields = __webpack_require__(/*! ./components/customfields/main */ "./src/modules/old_concept/components/customfields/main.js");
var dragblocks = __webpack_require__(/*! ./components/dragbox/main */ "./src/modules/old_concept/components/dragbox/main.js");
var votebox = __webpack_require__(/*! ./components/vote/vote */ "./src/modules/old_concept/components/vote/vote.js");
var profile = __webpack_require__(/*! ./components/companyprofile/profile */ "./src/modules/old_concept/components/companyprofile/profile.js");
var favor = __webpack_require__(/*! ./components/favourite/main */ "./src/modules/old_concept/components/favourite/main.js");
var toolbox = __webpack_require__(/*! ./components/toolbox/toolbox */ "./src/modules/old_concept/components/toolbox/toolbox.js");
var cookie = __webpack_require__(/*! ./modules/utils.cookie */ "./src/modules/old_concept/modules/utils.cookie.js");
var template = __webpack_require__(/*! ./modules/template-web */ "./src/modules/old_concept/modules/template-web.js");
var utils = __webpack_require__(/*! ./modules/utils */ "./src/modules/old_concept/modules/utils.js");
var chartManager = __webpack_require__(/*! ./modules/quotecharts */ "./src/modules/old_concept/modules/quotecharts.js");
var header = __webpack_require__(/*! ./head */ "./src/modules/old_concept/head.js");
var mainquote = __webpack_require__(/*! ./quote */ "./src/modules/old_concept/quote.js");
var related = __webpack_require__(/*! ./components/relatedquote/render */ "./src/modules/old_concept/components/relatedquote/render.js");

__webpack_require__(/*! ./modules/jquery-plugins/jquery.lazyloader */ "./src/modules/old_concept/modules/jquery-plugins/jquery.lazyloader.js");

__webpack_require__(/*! ./modules/jquery-plugins/jquery.tooltip */ "./src/modules/old_concept/modules/jquery-plugins/jquery.tooltip.js");
// require('./modules/jquery-plugins/jquery.tooltip.css');
var utils = __webpack_require__(/*! ./modules/utils */ "./src/modules/old_concept/modules/utils.js");

$.extend(template.defaults.imports, utils, {
    setDefault: function (data, dft) {
        if (!data) return dft;
        else return data;
    },
    percentRender: function (data, fix) {
        return !data || isNaN(data) ? '-' : isNaN(fix) ? data + '%' : parseFloat(data).toFixed(fix) + '%'
    },
    shortMarketMappings: {
        '1': 'sh',
        '2': 'sz',
    }
});
var cache = utils.ObjectCache.default;

function index() {
    this.id = stockentry.id;
    this.code = stockentry.code;
    this.name = stockentry.name;
    this.marketnum = stockentry.marketnum;
    this.shortmarket = stockentry.shortmarket;
    this.jys = stockentry.jys;
}

/**
 * 页面初始化入口
 */
index.prototype.init = function () {
    var self = this;
    favor.load();
    var quote = new mainquote({
        entry: stockentry
    });
    // 行情报价
    var tsq = this.tsq = quote.renderQuote();
    // 自定义模块
    this.dragbox = new dragblocks();
    chartManager.preload(function () {
        // 头部动态图
        header.loadChart();
        // 加载行情动图
        // quote.timefigure();
        quote.renderChart();
        // 公司简介等数据
        new profile().load();
        $('#optional-blocks').lazyload(function (e, args) {
            self.dragbox.load();
        });
    });
    // 加载头部行情报价
    header.loadQuote();
    // 自定义字段
    new customfields({
        onfieldsloading: function (fields, configs) {
            // 当行情数据已加载时，从缓存中获取
            if (cache['__full__']) {
                tsq.render(cache['__full__'], tsq.fields, tsq);
            }
            // quote.nufmLoader();
            quote.disquote();
            quote.disquote_sse();
            
        },
        onsaving: function (fields, key, configs) {

        }
    }).load();
    // 股票更名标签
    changeNameTagRender.apply(this);
    // 休市提醒
    // holidayRender.apply(this);    //该功能下线时间：20200628
    // 分笔明细
    quote.renderDeals();
    // 股吧评论区
    gubaCommetRender.apply(this);
    // 右侧工具栏
    new toolbox();
    // 投票区域
    new votebox().load();
    // 相关行情&个股日历
    related.load();
    // 盘口异动
    quote.renderChanges();
    // 头部下拉搜索
    header.loadSearch();
    // 页面事件绑定
    bindevents.apply(this);
    // 功能引导
    //guidanceRender.apply(this);
    defaultQuote.apply(this);

    window.onstorage = function(e){};
}

/** 
 * 绑定事件
 */
function bindevents() {
    var self = this;
    // f10
    var f10_tips = new popup({
        title: stockentry.name + 'F10资料',
        css: 'f10-zl',
        content: template('tmp-f10-popup', stockentry),
        confirm: '',
        destroy: false
    })
    $('#btn-f10-more').click(function (e) {
        f10_tips.show();
        return false;
    });

    //自选股和最近访问tab
    $('.tab-nav li', $('#favor-his-wrapper')).mouseover(function () {
        var i = $(this).index();
        $(this).addClass('cur').siblings('li').removeClass('cur')
        $('.tab-pane').eq(i).show().siblings('.tab-pane').hide();
    });

    //行情数据、公司简介滑动效果
    $('.tab-list', $('#digest-wrapper')).mouseover(function () {
        if ($(this).width() < 40) {
            $(this).stop().animate({
                width: '633px'
            });
            $(this).siblings().stop().animate({
                width: '39px'
            });
        }
    });

    // 自定义模块
    $('#btn-add-module').click(this.dragbox.addevent);
    $('.help-box', $('#btn-add-module')).tooltip();
    $('#btn-reset-module').click(function (e) {
        self.dragbox.reset();
    });

    // 模拟交易
    var mock_tips = new popup({
        title: '模拟交易',
        css: 'popup-alert',
        content: '暂不支持B股模拟交易',
        destroy: false
    });
    var isbstock = ['3', '7'].indexOf(self.jys) >= 0;
    var mockcontext = $('#buy-table,#sell-table');
    var args = {
        code: self.code,
        mkt: self.marketnum,
        dir: 1
    };
    if (location.hash === '#mocktrading') {
        var event = this.tsq.pageLoadEvents;
        event.afterPageLoaded = function (data, fields) {
            mock.open();
            event.afterPageLoaded = null;
        }
    }
    $('#mock-trading').click(function (e) {
        if (!isbstock) {
            mock.open();
        } else {
            mock_tips.show();
        }
        return false;
    });
    $('.mr-span', mockcontext).click(function (e) {
        if (isbstock) {
            mock_tips.show();
            return false;
        }
        args.dir = 1;
        args.price = $(this).siblings('span').html();
        mock.open(args);
        return false;
    });
    $('.mc-span', mockcontext).click(function (e) {
        if (isbstock) {
            mock_tips.show();
            return false;
        }
        args.dir = 2;
        var sibling = $(this).siblings('span');
        if (sibling.data('bind') === 'price') {
            args.price = sibling.html();
        } else {
            args.price = $('#quote-' + $(this).parent().parent().data('bind') + 'p').html();
        }
        mock.open(args);
        return false;
    });
    $('#btn-flashbuy').click(function (e) {
        if (isbstock) {
            mock_tips.show();
            return false;
        }
        args.dir = 1;
        args.zt = $('#quote-raisePrice-main').html();
        args.dt = $('#quote-fallPrice-main').html();
        args.price = $('#quote-raisePrice-main').html();
        mock.open(args);
        return false;
    });
    $('#btn-flashsell').click(function (e) {
        if (isbstock) {
            mock_tips.show();
            return false;
        }
        args.dir = 2;
        args.zt = $('#quote-raisePrice-main').html();
        args.dt = $('#quote-fallPrice-main').html();
        args.price = $('#quote-fallPrice-main').html();
        mock.open(args);
        return false;
    });
    $('#defaultQuoteBox-close').click(function () {
        $('#defaultQuoteBox').hide();
    })
    $('#defaultQuoteCancel').click(function () {
        $('#defaultQuoteBox').hide();
    })
    $('#defaultQuoteSure').click(function () {
        if (localStorage) {
            if (localStorage.getItem('rememberme') === '1') {
                localStorage.setItem('rememberme', 0);
                $('#tool-box-gnb span').html('默认<br>概念版<br>行情');
            } else {
                localStorage.setItem('rememberme', 1);
                $('#tool-box-gnb span').html('默认<br>经典版<br>行情');
            }     
        }       
        $('#defaultQuoteBox').hide();
       
    })   
    $('#tucaoBtn').click(function(){
        $('#defaultQuoteBox').hide();
    })

}

/**
 * 股吧评论区
 * http://gubawebcs.eastmoney.com/gubawebapi/new_reply/new_reply.js 测试
 * http://gbfek.eastmoney.com/gubawebapi/new_reply/new_reply.js 正式
 */
function gubaCommetRender() {
    var self = this;
    var url = environment !== 'production' ?
        '//gubawebcs.eastmoney.com/gubawebapi/new_reply/new_reply.js' :
        '//gbfek.eastmoney.com/deploy/module_newreply/work/new_reply.js';
    $.getScript(url, function () {
        var guba_new_reply = __webpack_require__(/*! guba_new_reply */ "guba_new_reply");
        guba_new_reply({
            se: '.commentguba',
            code: self.code,
            market: self.shortmarket,
            baseUrl: window.root
        });
    });
}

/**
 * 功能引导 ver 2
 */
//function guidanceRender() {
//    var ver = parseInt(localStorage.getItem('guidance'));
//    console.log(ver)
//    if (isNaN(ver) || ver < guidanceRender.version) {
//        var $html = $('<div class="ydy"><div class="ydy-box"><a class="ydy-close"></a></div></div>');
//        $('.ydy-close', $html).click(function () {
//            $html.remove();
//        });
//        $('body').append($html);
//        localStorage.setItem('guidance', guidanceRender.version)
//    }
//}
//guidanceRender.version = 2;


/**
 * 默认行情设置
 */
function defaultQuote() {
    var ver = parseInt(localStorage.getItem('tanchuan'));      
    var rem = parseInt(localStorage.getItem('rememberme'));      
    if (isNaN(ver) &&  rem != '1'  || ver < defaultQuote.version) {
        setTimeout(function () {
            // $('#defaultQuoteBox').show();
            localStorage.setItem('tanchuan', defaultQuote.version);                       
        }, 1000 * 60);   
        
    }
}
defaultQuote.version = 2;


/**
 * 股票更名
 */
function changeNameTagRender() {
    var _html = $('<div class="exNameMsg" id="exNameMsg"></div>');
    var tpl = '{{each data}}<span class="usedName">{{$value.changeName}} <span class="hasDate">({{$value.time}})</span></span>{{$index!=(data.length-1)? ">>>":""}}{{/each}}';
    $.ajax({
        // url: "//nufm.dfcfw.com/EM_Finance2014NumericApplication/JS.aspx?type=CT&sty=FDPNHC&js=([(x)])&st=z&token=4f1862fc3b5e77c150a2b985b12db0fd",
        url:'//dcfm.eastmoney.com/em_mutisvcexpandinterface/api/js/get?type=ABLS_MB&token=70f12f2f4f091e459a279469fe49eca5&filter=(scode='+stockentry.code+')&st=rn&sr=-1',
        // data: {
        //     cmd: stockentry.id
        // },
        dataType: 'jsonp',
        scriptCharset: "utf-8",
        // jsonp: 'cb',
        accept:"json",
        success: function (json) {
            // var changName = json[0].split(',');
            // if (changName[3] != '-' || !changName[3]) {
            //     $("#stock_change_name").css("display", "inline-block");
            //     var changNameArr = changName[3].split("/");
            //     var modules = {
            //         data: []
            //     };
            //     for (var i = 0; i < changNameArr.length; i++) {
            //         var changNameitem = changNameArr[i].split("|");
            //         modules.data.push({
            //             "time": changNameitem[0],
            //             "useName": changNameitem[1],
            //             "changeName": changNameitem[2]
            //         })
            //     }
            //     _html.html(template.render(tpl, modules))
            //     $("#stock_change_name").tooltip({
            //         content: _html
            //     });
            // }
            // var changName = json[0].split(',');
            if (json.length>1) {
                $("#stock_change_name").css("display", "inline-block");
                var modules = {
                    data: []
                };
                var usedname =  json[json.length-1].sname;
                for (var i = 0; i < json.length; i++) {
                    var changNameitem = json[i];
                    modules.data.push({
                        "time": changNameitem.changedate.substring(0,10),
                        "useName": usedname,
                        "changeName": changNameitem.sname
                    })
                }
                _html.html(template.render(tpl, modules))
                $("#stock_change_name").tooltip({
                    content: _html
                });
            }
        }

    })

};

//节假日判断:1601481600000
function checkHoliday(){
    var today = "'" + moment(window.emutc.UTCTIME).format('YYYY/MM/DD') + "'";  //日期要求加单引号，字符串要加双引号 
    // var today = "'2020/10/08'";
    $.ajax({
        url: encodeURI('//datacenter.eastmoney.com/api/data/get?type=RPTA_WEB_XSRQ&sty=ALL&source=WEB&filter=(mktcode="069001001")(scal='+ today +')'),
        dataType: 'jsonp',
        jsonp: "callback",
        jsonpCallback: "data",
        // jsonp: 'jsonp_callback',
        success: function (json) {
            if (json && json.code === 0) {
                var data = json['result'].data;
                if (data instanceof Array && data.length > 0) {
                    var time = utils.formatDate(new Date(data[0].scal), "yyyy年MM月dd日"),
                        holiday = data[0].holiday;
                    $('#close-tips').show();
                    $('#quote-time').hide();
                    $('#close-tips .close-tips-msg').text(time + '因' + holiday + '休市');
                } else {
                    $('#close-tips').hide();
                    $('#quote-time').show();
                }
            }
        }
    });
};

//节假日休市提醒
function holidayRender() {
    $.ajax({
        url: '//cmsjs.eastmoney.com/TimeZone/Default.aspx?type=utctime&ids=41,2,78,53&jn=emutc',
        dataType: 'script',
        success: function () {
            if (window.emutc) {
                checkHoliday();
                // var today = moment(window.emutc.UTCTIME).format('YYYY-MM-DD')
                // $.ajax({
                //     url: '//api.dataide.eastmoney.com/data/get_xsrq?mktcode=069001001',
                //     data: {
                //         date: today
                //     },
                //     dataType: 'jsonp',
                //     jsonp: 'jsonp_callback',
                //     success: function (json) {
                //         if (json && json.code === 0) {
                //             var data = json['data'];
                //             if (data instanceof Array && data.length > 0) {
                //                 var time = utils.formatDate(new Date(data[0].scal), "yyyy年MM月dd日"),
                //                     holiday = data[0].holiday;
                //                 $('#close-tips').show();
                //                 $('#quote-time').hide();
                //                 $('#close-tips .close-tips-msg').text(time +'因'+holiday + '休市');
                //             } else {
                //                 $('#close-tips').hide();
                //                 $('#quote-time').show();
                //             }
                //         }
                //     }
                // });
            }

        }
    });
}



$(document).ready(function (e) {
    new index().init();
    // 录入浏览版本
    cookie('em-quote-version', 'topspeed', {
        expires: 24 * 365 * 100,
        path: '/',
        domain: 'eastmoney.com'
    });


});
// var market_01=stockentry.marketnum==1?1:0;
// tempah()
// function tempah() {
    
//     $.ajax({
//         url: 'http://push2.eastmoney.com/api/qt/stock/get?ut=fa5fd1943c7b386f172d6893dbfba10b&fltt=2&invt=2&fields=f152,f253&secid='+market_01+'.'+stockentry.code,
//         scriptCharset: "utf-8",
//         dataType: "jsonp",
//         jsonp: "cb",
//         success: function (json) {
//             if(json.data.f253!='-'){
//                 var color= json.data.f253>0?'red':(json.data.f253<0?'green':''); 
//                 $('#ahcompare').html(json.data.f253.toFixed(json.data.f152)).addClass(color) 
//                 tempah_sse(json.data.f152);
//             }
//         }
//     });
// }

// function tempah_sse(valuefigure) {
//     var url='http://'+(Math.floor(Math.random() * 99) + 1)+'.push2.eastmoney.com/api/qt/stock/sse?ut=fa5fd1943c7b386f172d6893dbfba10b&fltt=2&invt=2&fields=f152,f253&secid='+market_01+'.'+stockentry.code
//     var evtSource = new EventSource(url);
//     evtSource.onmessage = function (msg) {
//         var json = JSON.parse(msg.data);
//         if(json.data){
//             if(json.data.f253){
//                 var color= json.data.f253>0?'red':(json.data.f253<0?'green':''); 
//                 $('#ahcompare').html(json.data.f253.toFixed(valuefigure)).addClass(color) 
//             }
//         }
//     }
// }
//分时图临时安放处
// var thissse = null;
// var market_01=stockentry.marketnum==1?1:0;
// $.ajax({
//     url: "//emcharts.eastmoney.com/ec/3.14.2/emcharts.min.js",
//     method: "GET",
//     cache: true,
//     scriptCharset: "UTF-8",
//     dataType: "script"
// }).success(function () {
//     var tps = ['r','t2','t3','t4','t5']
//     timechart(0,1,'r');
//     timechart_sse(0,1,'r');
//     $("#cr").click(function (e) {
//         timechart(1,1,'r');
//         timechart_sse(1,1,'r');
//     })
//     $("#r").click(function (e) {
//         timechart(0,1,'r');
//         timechart_sse(0,1,'r');
//     })
//     $("#day-selector").click(function (e) {
//         var ndays=$("#day-selector .selected-box").html().substring(0,1);
//         timechart(0,ndays,tps[parseInt(ndays)-1])
//         timechart_sse(0,ndays,tps[parseInt(ndays)-1]);
//     })
//     $("#t1").click(function (e) {
//         timechart(0,1,'r');
//         timechart_sse(0,1,'r');
//     })
//     $("#t2").click(function (e) {
//         timechart(0,2,'t2');
//         timechart_sse(0,2,'t2');
//     })
//     $("#t3").click(function (e) {
//         timechart(0,3,'t3');
//         timechart_sse(0,3,'t3');
//     })
//     $("#t4").click(function (e) {
//         timechart(0,4,'t4');
//         timechart_sse(0,4,'t4');
//     })
//     $("#t5").click(function (e) {
//         timechart(0,5,'t5');
//         timechart_sse(0,5,'t5');
//     })
//     function timechart(iscr,ndays,type){
//         var _opt =({
//             container: '#chart-container',
//             width: 720,
//             height: 600,
//             type: type,
//             iscr: iscr,
//             ndays:ndays,
//             gridwh: {
//                 //height: 25,
//                 width: 720
//             },
//             padding: {
//                 top: 0,
//                 bottom: 5
//             },
//             color: {
//                 line: '#326fb2',
//                 fill: ['rgba(101,202,254, 0.2)', 'rgba(101,202,254, 0.1)']
//             },
//             // data: {
//             //     time: [],
//             //     positionChanges: []
//             // },
//             tip: {
//                 show: true,
//                 trading: true
//             },
//             show: {
//                 indicatorArea: true, // 分时指标
//                 CMA: true,
//                 // ddx: args.type === 'r',
//                 // cf: args.type === 'r'
//             },
//             onClickChanges: function () {
//                 window.open('//quote.eastmoney.com/changes/stocks/' + args.entry.shortmarket + args.entry.code + '.html');
//             },
//             onComplete: function () {
    
//             },
//             onError: function (err) {
//                 console.error(err);
//             },
//             update: 40 * 1000
//         });
        
//         //请求分时数据
//         var urltime = 'http://push2.eastmoney.com/api/qt/stock/trends2/get?fields1=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13&fields2=f51,f52,f53,f54,f55,f56,f57,f58&ut=fa5fd1943c7b386f172d6893dbfba10b&ndays='+ndays+'&iscr='+iscr+'&secid='+market_01+'.' +stockentry.code;
//         var urlntime = 'http://push2his.eastmoney.com/api/qt/stock/trends2/get?fields1=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13&fields2=f51,f52,f53,f54,f55,f56,f57,f58&ut=fa5fd1943c7b386f172d6893dbfba10b&ndays='+ndays+'&iscr='+iscr+'&secid='+market_01+'.' +stockentry.code;
//         function timedata(url) {
//             $.ajax({
//                 type: "get",
//                 url: url,
//                 // url: 'http://61.129.249.233:18665/api/qt/stock/trends2/get?fields1=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13&fields2=f51,f52,f53,f54,f55,f56,f57,f58&ut=fa5fd1943c7b386f172d6893dbfba10b&ndays='+ndays+'&iscr='+iscr+'&iscca='+iscca+'&secid=1.'+stockentry.code,
//                 dataType: "jsonp",
//                 jsonp: "cb",
//                 success: function (msg) {
//                     // msg.data.trendsTotal = 482
//                     // console.log(time)
//                     // console.log(msg)
//                     var chart = new emcharts3.time(_opt);    
//                     chart.setData({
//                         time: msg
//                     });
//                     chart.redraw();
//                     bb(chart);
//                 }
//             });
//         }
//         if(ndays==1){
//            timedata(urltime); 
//         }else{
//             timedata(urlntime);
//         }
        
        
//     }
//     function timechart_sse(iscr,ndays,type) {
//         try {
//             thissse.close()
//         } catch (error) {
            
//         }
//         var _opt =({
//             container: '#chart-container',
//             width: 720,
//             height: 600,
//             type: type,
//             iscr: iscr,
//             ndays:ndays,
//             gridwh: {
//                 //height: 25,
//                 width: 720
//             },
//             padding: {
//                 top: 0,
//                 bottom: 5
//             },
//             color: {
//                 line: '#326fb2',
//                 fill: ['rgba(101,202,254, 0.2)', 'rgba(101,202,254, 0.1)']
//             },
//             // data: {
//             //     time: [],
//             //     positionChanges: []
//             // },
//             tip: {
//                 show: true,
//                 trading: true
//             },
//             show: {
//                 indicatorArea: true, // 分时指标
//                 CMA: true,
//                 // ddx: args.type === 'r',
//                 // cf: args.type === 'r'
//             },
//             onClickChanges: function () {
//                 window.open('//quote.eastmoney.com/changes/stocks/' + args.entry.shortmarket + args.entry.code + '.html');
//             },
//             onComplete: function () {
    
//             },
//             onError: function (err) {
//                 console.error(err);
//             },
//             update: 40 * 1000
//         });
//         // var timer
       
//         var fullurl = 'http://'+(Math.floor(Math.random() * 99) + 1)+'.push2.eastmoney.com/api/qt/stock/trends2/sse?fields1=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13&fields2=f51,f52,f53,f54,f55,f56,f57,f58&ut=fa5fd1943c7b386f172d6893dbfba10b&ndays='+ndays+'&iscr='+iscr+'&secid='+market_01+'.' +stockentry.code;
//         var nfullurl = 'http://'+(Math.floor(Math.random() * 99) + 1)+'.push2his.eastmoney.com/api/qt/stock/trends2/sse?fields1=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13&fields2=f51,f52,f53,f54,f55,f56,f57,f58&ut=fa5fd1943c7b386f172d6893dbfba10b&ndays='+ndays+'&iscr='+iscr+'&secid='+market_01+'.' +stockentry.code;
//         if(ndays==1){
//             thissse = new EventSource(fullurl);
//         }else{
//             thissse = new EventSource(nfullurl);
//         }
//         var chart = new emcharts3.time(_opt);
//         // var fullurl = 'http://61.129.249.233:18665/api/qt/stock/trends2/sse?fields1=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13&fields2=f51,f52,f53,f54,f55,f56,f57,f58&ut=fa5fd1943c7b386f172d6893dbfba10b&ndays='+ndays+'&iscr='+iscr+'&iscca='+iscca+'&secid=1.'+stockentry.code;
//         // thissse = new EventSource(fullurl);
//         thissse.onmessage = function (msg) {
//             // console.log(chart)
//             // console.log(msg)
//             var fdata = JSON.parse(msg.data)
//             // console.log(fdata);
//             var fulldata = '';
//             if (fdata.rc == 0 && fdata.data) {
    
//                 var data = fdata.data;
    
//                 if (data.beticks) {
//                     fullData = fdata;
//                 } else {
    
//                     var source = fullData.data.trends;
//                     var last = source[source.length - 1].split(",");
                    
//                     var trends = data.trends;
//                     var frist = trends[0].split(",");
    
//                     if (last[0] == frist[0]) {
//                         source.pop();
//                     }
//                     for(var i = 0, len = trends.length ; i < len ; i++){
//                         source.push(trends[i]);
//                     }
//                 }
                
//                 // console.log(that.fullData);
//                 chart.setData({
//                     time: fullData
//                 });
                
//                 chart.redraw();
//                 bb(chart);
//             }
    
//         }
        
//     }
    
//     function aa(chart) {
//         $.ajax({
//             type: "get",
//             url: "http://nuyd.eastmoney.com/EM_UBG_PositionChangesInterface/api/js",
//             data: {
//                 id: "3005042",
//                 style: "top",
//                 ac: "normal",
//                 check: "itntcd",
//                 // dtformat: "HH:mm:ss",
//                 js: "changeData15125388([(x)])"
//             },
//             dataType: "jsonp",
//             jsonp: "changeData15125388",
//             jsonpCallback: "changeData15125388",
//             success: function (msg) {
//                 try {
//                     if (msg[0].state) {
//                         dataPositionChanges = [];
//                     } else {
//                         dataPositionChanges = msg;
//                     }
//                 } catch (error) {
//                     dataPositionChanges = [];
//                 }
//                 chart.setData({
//                     positionChanges: dataPositionChanges
//                 });
//                 chart.redraw();
//             }
//         });
//     }

   
//     function bb(chart) {

//         var types = {
//             "1": "有大买盘",
//             "101": "有大卖盘",
//             "2": "大笔买入",
//             "102": "大笔卖出",
//             "201": "封涨停板",
//             "301": "封跌停板",
//             "202": "打开涨停",
//             "302": "打开跌停",
//             "203": "高开5日线",
//             "303": "低开5日线",
//             "204": "60日新高",
//             "304": "60日新低",
//             "401": "向上缺口",
//             "501": "向下缺口",
//             "402": "火箭发射",
//             "502": "高台跳水",
//             "403": "快速反弹",
//             "503": "快速下跌",
//             "404": "竞价上涨",
//             "504": "竞价下跌",
//             "405": "60日大幅上涨",
//             "505": "60日大幅下跌"
//         }

//         $.ajax({
//             type: "get",
//             url: "http://push2.eastmoney.com/api/qt/pkyd/get?fields=f2,f1,f4,f5,f6,f7&lmt=-1&ut=fa5fd1943c7b386f172d6893dbfba10b&secids=" +market_01+'.' +stockentry.code,
//             dataType: "jsonp",
//             jsonp: "cb",
//             success: function (msg) {   
//                 if (msg.rc == 0 && msg.data) {   
//                     var pkyd = msg.data.pkyd;  
//                     var newarr = [];  
//                     for (var i = 0, len = pkyd.length; i < len; i++) {
//                         var s = pkyd[i].split(",");  
//                         var ar = [s[1], s[0].substr(0, 5), s[2], types[s[3]], s[4], s[5]];
//                         newarr.push(ar.join(","));
//                     }
//                     chart.setData({
//                         positionChanges: newarr
//                     });
//                     chart.redraw();
//                 }
//             }
//         });
//     }
// })

 
module.exports = index;

/***/ }),

/***/ "./src/modules/old_concept/modules/browser_fingerprint/fingerprint2.js":
/*!*****************************************************************************!*\
  !*** ./src/modules/old_concept/modules/browser_fingerprint/fingerprint2.js ***!
  \*****************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
* Fingerprintjs2 1.5.1 - Modern & flexible browser fingerprint library v2
* https://github.com/Valve/fingerprintjs2
* Copyright (c) 2015 Valentin Vasilyev (valentin.vasilyev@outlook.com)
* Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
* AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
* IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
* ARE DISCLAIMED. IN NO EVENT SHALL VALENTIN VASILYEV BE LIABLE FOR ANY
* DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
* (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
* LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
* ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
* (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
* THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

(function (name, context, definition) {
  "use strict";
  if (true) { !(__WEBPACK_AMD_DEFINE_FACTORY__ = (definition),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
		__WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); }
  else {}
})("Fingerprint2", this, function() {
  "use strict";
  var Fingerprint2 = function(options) {

    if (!(this instanceof Fingerprint2)) {
      return new Fingerprint2(options);
    }

    var defaultOptions = {
      swfContainerId: "fingerprintjs2",
      swfPath: "flash/compiled/FontList.swf",
      detectScreenOrientation: true,
      sortPluginsFor: [/palemoon/i],
      userDefinedFonts: []
    };
    this.options = this.extend(options, defaultOptions);
    this.nativeForEach = Array.prototype.forEach;
    this.nativeMap = Array.prototype.map;
  };
  Fingerprint2.prototype = {
    extend: function(source, target) {
      if (source == null) { return target; }
      for (var k in source) {
        if(source[k] != null && target[k] !== source[k]) {
          target[k] = source[k];
        }
      }
      return target;
    },
    get: function(done){
      var keys = [];
      keys = this.userAgentKey(keys);
      keys = this.languageKey(keys);
      keys = this.colorDepthKey(keys);
      keys = this.pixelRatioKey(keys);
      keys = this.hardwareConcurrencyKey(keys);
      keys = this.screenResolutionKey(keys);
      keys = this.availableScreenResolutionKey(keys);
      keys = this.timezoneOffsetKey(keys);
      keys = this.sessionStorageKey(keys);
      keys = this.localStorageKey(keys);
      keys = this.indexedDbKey(keys);
      keys = this.addBehaviorKey(keys);
      keys = this.openDatabaseKey(keys);
      keys = this.cpuClassKey(keys);
      keys = this.platformKey(keys);
      keys = this.doNotTrackKey(keys);
      keys = this.pluginsKey(keys);
      keys = this.canvasKey(keys);
      keys = this.webglKey(keys);
      keys = this.adBlockKey(keys);
      keys = this.hasLiedLanguagesKey(keys);
      keys = this.hasLiedResolutionKey(keys);
      keys = this.hasLiedOsKey(keys);
      keys = this.hasLiedBrowserKey(keys);
      keys = this.touchSupportKey(keys);
      keys = this.customEntropyFunction(keys);
      var that = this;
      this.fontsKey(keys, function(newKeys){
        var values = [];
        that.each(newKeys, function(pair) {
          var value = pair.value;
          if (typeof pair.value.join !== "undefined") {
            value = pair.value.join(";");
          }
          values.push(value);
        });
        var murmur = that.x64hash128(values.join("~~~"), 31);
        return done(murmur, newKeys);
      });
    },
    customEntropyFunction: function (keys) {
      if (typeof this.options.customFunction === "function") {
        keys.push({key: "custom", value: this.options.customFunction()});
      }
      return keys;
    },
    userAgentKey: function(keys) {
      if(!this.options.excludeUserAgent) {
        keys.push({key: "user_agent", value: this.getUserAgent()});
      }
      return keys;
    },
    // for tests
    getUserAgent: function(){
      return navigator.userAgent;
    },
    languageKey: function(keys) {
      if(!this.options.excludeLanguage) {
        // IE 9,10 on Windows 10 does not have the `navigator.language` property any longer
        keys.push({ key: "language", value: navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage || "" });
      }
      return keys;
    },
    colorDepthKey: function(keys) {
      if(!this.options.excludeColorDepth) {
        keys.push({key: "color_depth", value: screen.colorDepth || -1});
      }
      return keys;
    },
    pixelRatioKey: function(keys) {
      if(!this.options.excludePixelRatio) {
        keys.push({key: "pixel_ratio", value: this.getPixelRatio()});
      }
      return keys;
    },
    getPixelRatio: function() {
      return window.devicePixelRatio || "";
    },
    screenResolutionKey: function(keys) {
      if(!this.options.excludeScreenResolution) {
        return this.getScreenResolution(keys);
      }
      return keys;
    },
    getScreenResolution: function(keys) {
      var resolution;
      if(this.options.detectScreenOrientation) {
        resolution = (screen.height > screen.width) ? [screen.height, screen.width] : [screen.width, screen.height];
      } else {
        resolution = [screen.width, screen.height];
      }
      if(typeof resolution !== "undefined") { // headless browsers
        keys.push({key: "resolution", value: resolution});
      }
      return keys;
    },
    availableScreenResolutionKey: function(keys) {
      if (!this.options.excludeAvailableScreenResolution) {
        return this.getAvailableScreenResolution(keys);
      }
      return keys;
    },
    getAvailableScreenResolution: function(keys) {
      var available;
      if(screen.availWidth && screen.availHeight) {
        if(this.options.detectScreenOrientation) {
          available = (screen.availHeight > screen.availWidth) ? [screen.availHeight, screen.availWidth] : [screen.availWidth, screen.availHeight];
        } else {
          available = [screen.availHeight, screen.availWidth];
        }
      }
      if(typeof available !== "undefined") { // headless browsers
        keys.push({key: "available_resolution", value: available});
      }
      return keys;
    },
    timezoneOffsetKey: function(keys) {
      if(!this.options.excludeTimezoneOffset) {
        keys.push({key: "timezone_offset", value: new Date().getTimezoneOffset()});
      }
      return keys;
    },
    sessionStorageKey: function(keys) {
      if(!this.options.excludeSessionStorage && this.hasSessionStorage()) {
        keys.push({key: "session_storage", value: 1});
      }
      return keys;
    },
    localStorageKey: function(keys) {
      if(!this.options.excludeSessionStorage && this.hasLocalStorage()) {
        keys.push({key: "local_storage", value: 1});
      }
      return keys;
    },
    indexedDbKey: function(keys) {
      if(!this.options.excludeIndexedDB && this.hasIndexedDB()) {
        keys.push({key: "indexed_db", value: 1});
      }
      return keys;
    },
    addBehaviorKey: function(keys) {
      //body might not be defined at this point or removed programmatically
      if(document.body && !this.options.excludeAddBehavior && document.body.addBehavior) {
        keys.push({key: "add_behavior", value: 1});
      }
      return keys;
    },
    openDatabaseKey: function(keys) {
      if(!this.options.excludeOpenDatabase && window.openDatabase) {
        keys.push({key: "open_database", value: 1});
      }
      return keys;
    },
    cpuClassKey: function(keys) {
      if(!this.options.excludeCpuClass) {
        keys.push({key: "cpu_class", value: this.getNavigatorCpuClass()});
      }
      return keys;
    },
    platformKey: function(keys) {
      if(!this.options.excludePlatform) {
        keys.push({key: "navigator_platform", value: this.getNavigatorPlatform()});
      }
      return keys;
    },
    doNotTrackKey: function(keys) {
      if(!this.options.excludeDoNotTrack) {
        keys.push({key: "do_not_track", value: this.getDoNotTrack()});
      }
      return keys;
    },
    canvasKey: function(keys) {
      if(!this.options.excludeCanvas && this.isCanvasSupported()) {
        keys.push({key: "canvas", value: this.getCanvasFp()});
      }
      return keys;
    },
    webglKey: function(keys) {
      if(this.options.excludeWebGL) {
        return keys;
      }
      if(!this.isWebGlSupported()) {
        return keys;
      }
      keys.push({key: "webgl", value: this.getWebglFp()});
      return keys;
    },
    adBlockKey: function(keys){
      if(!this.options.excludeAdBlock) {
        keys.push({key: "adblock", value: this.getAdBlock()});
      }
      return keys;
    },
    hasLiedLanguagesKey: function(keys){
      if(!this.options.excludeHasLiedLanguages){
        keys.push({key: "has_lied_languages", value: this.getHasLiedLanguages()});
      }
      return keys;
    },
    hasLiedResolutionKey: function(keys){
      if(!this.options.excludeHasLiedResolution){
        keys.push({key: "has_lied_resolution", value: this.getHasLiedResolution()});
      }
      return keys;
    },
    hasLiedOsKey: function(keys){
      if(!this.options.excludeHasLiedOs){
        keys.push({key: "has_lied_os", value: this.getHasLiedOs()});
      }
      return keys;
    },
    hasLiedBrowserKey: function(keys){
      if(!this.options.excludeHasLiedBrowser){
        keys.push({key: "has_lied_browser", value: this.getHasLiedBrowser()});
      }
      return keys;
    },
    fontsKey: function(keys, done) {
      if (this.options.excludeJsFonts) {
        return this.flashFontsKey(keys, done);
      }
      return this.jsFontsKey(keys, done);
    },
    // flash fonts (will increase fingerprinting time 20X to ~ 130-150ms)
    flashFontsKey: function(keys, done) {
      if(this.options.excludeFlashFonts) {
        return done(keys);
      }
      // we do flash if swfobject is loaded
      if(!this.hasSwfObjectLoaded()){
        return done(keys);
      }
      if(!this.hasMinFlashInstalled()){
        return done(keys);
      }
      if(typeof this.options.swfPath === "undefined"){
        return done(keys);
      }
      this.loadSwfAndDetectFonts(function(fonts){
        keys.push({key: "swf_fonts", value: fonts.join(";")});
        done(keys);
      });
    },
    // kudos to http://www.lalit.org/lab/javascript-css-font-detect/
    jsFontsKey: function(keys, done) {
      var that = this;
      // doing js fonts detection in a pseudo-async fashion
      return setTimeout(function(){

        // a font will be compared against all the three default fonts.
        // and if it doesn't match all 3 then that font is not available.
        var baseFonts = ["monospace", "sans-serif", "serif"];

        var fontList = [
                        "Andale Mono", "Arial", "Arial Black", "Arial Hebrew", "Arial MT", "Arial Narrow", "Arial Rounded MT Bold", "Arial Unicode MS",
                        "Bitstream Vera Sans Mono", "Book Antiqua", "Bookman Old Style",
                        "Calibri", "Cambria", "Cambria Math", "Century", "Century Gothic", "Century Schoolbook", "Comic Sans", "Comic Sans MS", "Consolas", "Courier", "Courier New",
                        "Garamond", "Geneva", "Georgia",
                        "Helvetica", "Helvetica Neue",
                        "Impact",
                        "Lucida Bright", "Lucida Calligraphy", "Lucida Console", "Lucida Fax", "LUCIDA GRANDE", "Lucida Handwriting", "Lucida Sans", "Lucida Sans Typewriter", "Lucida Sans Unicode",
                        "Microsoft Sans Serif", "Monaco", "Monotype Corsiva", "MS Gothic", "MS Outlook", "MS PGothic", "MS Reference Sans Serif", "MS Sans Serif", "MS Serif", "MYRIAD", "MYRIAD PRO",
                        "Palatino", "Palatino Linotype",
                        "Segoe Print", "Segoe Script", "Segoe UI", "Segoe UI Light", "Segoe UI Semibold", "Segoe UI Symbol",
                        "Tahoma", "Times", "Times New Roman", "Times New Roman PS", "Trebuchet MS",
                        "Verdana", "Wingdings", "Wingdings 2", "Wingdings 3"
                      ];
        var extendedFontList = [
                        "Abadi MT Condensed Light", "Academy Engraved LET", "ADOBE CASLON PRO", "Adobe Garamond", "ADOBE GARAMOND PRO", "Agency FB", "Aharoni", "Albertus Extra Bold", "Albertus Medium", "Algerian", "Amazone BT", "American Typewriter",
                        "American Typewriter Condensed", "AmerType Md BT", "Andalus", "Angsana New", "AngsanaUPC", "Antique Olive", "Aparajita", "Apple Chancery", "Apple Color Emoji", "Apple SD Gothic Neo", "Arabic Typesetting", "ARCHER",
                         "ARNO PRO", "Arrus BT", "Aurora Cn BT", "AvantGarde Bk BT", "AvantGarde Md BT", "AVENIR", "Ayuthaya", "Bandy", "Bangla Sangam MN", "Bank Gothic", "BankGothic Md BT", "Baskerville",
                        "Baskerville Old Face", "Batang", "BatangChe", "Bauer Bodoni", "Bauhaus 93", "Bazooka", "Bell MT", "Bembo", "Benguiat Bk BT", "Berlin Sans FB", "Berlin Sans FB Demi", "Bernard MT Condensed", "BernhardFashion BT", "BernhardMod BT", "Big Caslon", "BinnerD",
                        "Blackadder ITC", "BlairMdITC TT", "Bodoni 72", "Bodoni 72 Oldstyle", "Bodoni 72 Smallcaps", "Bodoni MT", "Bodoni MT Black", "Bodoni MT Condensed", "Bodoni MT Poster Compressed",
                        "Bookshelf Symbol 7", "Boulder", "Bradley Hand", "Bradley Hand ITC", "Bremen Bd BT", "Britannic Bold", "Broadway", "Browallia New", "BrowalliaUPC", "Brush Script MT", "Californian FB", "Calisto MT", "Calligrapher", "Candara",
                        "CaslonOpnface BT", "Castellar", "Centaur", "Cezanne", "CG Omega", "CG Times", "Chalkboard", "Chalkboard SE", "Chalkduster", "Charlesworth", "Charter Bd BT", "Charter BT", "Chaucer",
                        "ChelthmITC Bk BT", "Chiller", "Clarendon", "Clarendon Condensed", "CloisterBlack BT", "Cochin", "Colonna MT", "Constantia", "Cooper Black", "Copperplate", "Copperplate Gothic", "Copperplate Gothic Bold",
                        "Copperplate Gothic Light", "CopperplGoth Bd BT", "Corbel", "Cordia New", "CordiaUPC", "Cornerstone", "Coronet", "Cuckoo", "Curlz MT", "DaunPenh", "Dauphin", "David", "DB LCD Temp", "DELICIOUS", "Denmark",
                        "DFKai-SB", "Didot", "DilleniaUPC", "DIN", "DokChampa", "Dotum", "DotumChe", "Ebrima", "Edwardian Script ITC", "Elephant", "English 111 Vivace BT", "Engravers MT", "EngraversGothic BT", "Eras Bold ITC", "Eras Demi ITC", "Eras Light ITC", "Eras Medium ITC",
                        "EucrosiaUPC", "Euphemia", "Euphemia UCAS", "EUROSTILE", "Exotc350 Bd BT", "FangSong", "Felix Titling", "Fixedsys", "FONTIN", "Footlight MT Light", "Forte",
                        "FrankRuehl", "Fransiscan", "Freefrm721 Blk BT", "FreesiaUPC", "Freestyle Script", "French Script MT", "FrnkGothITC Bk BT", "Fruitger", "FRUTIGER",
                        "Futura", "Futura Bk BT", "Futura Lt BT", "Futura Md BT", "Futura ZBlk BT", "FuturaBlack BT", "Gabriola", "Galliard BT", "Gautami", "Geeza Pro", "Geometr231 BT", "Geometr231 Hv BT", "Geometr231 Lt BT", "GeoSlab 703 Lt BT",
                        "GeoSlab 703 XBd BT", "Gigi", "Gill Sans", "Gill Sans MT", "Gill Sans MT Condensed", "Gill Sans MT Ext Condensed Bold", "Gill Sans Ultra Bold", "Gill Sans Ultra Bold Condensed", "Gisha", "Gloucester MT Extra Condensed", "GOTHAM", "GOTHAM BOLD",
                        "Goudy Old Style", "Goudy Stout", "GoudyHandtooled BT", "GoudyOLSt BT", "Gujarati Sangam MN", "Gulim", "GulimChe", "Gungsuh", "GungsuhChe", "Gurmukhi MN", "Haettenschweiler", "Harlow Solid Italic", "Harrington", "Heather", "Heiti SC", "Heiti TC", "HELV",
                        "Herald", "High Tower Text", "Hiragino Kaku Gothic ProN", "Hiragino Mincho ProN", "Hoefler Text", "Humanst 521 Cn BT", "Humanst521 BT", "Humanst521 Lt BT", "Imprint MT Shadow", "Incised901 Bd BT", "Incised901 BT",
                        "Incised901 Lt BT", "INCONSOLATA", "Informal Roman", "Informal011 BT", "INTERSTATE", "IrisUPC", "Iskoola Pota", "JasmineUPC", "Jazz LET", "Jenson", "Jester", "Jokerman", "Juice ITC", "Kabel Bk BT", "Kabel Ult BT", "Kailasa", "KaiTi", "Kalinga", "Kannada Sangam MN",
                        "Kartika", "Kaufmann Bd BT", "Kaufmann BT", "Khmer UI", "KodchiangUPC", "Kokila", "Korinna BT", "Kristen ITC", "Krungthep", "Kunstler Script", "Lao UI", "Latha", "Leelawadee", "Letter Gothic", "Levenim MT", "LilyUPC", "Lithograph", "Lithograph Light", "Long Island",
                        "Lydian BT", "Magneto", "Maiandra GD", "Malayalam Sangam MN", "Malgun Gothic",
                        "Mangal", "Marigold", "Marion", "Marker Felt", "Market", "Marlett", "Matisse ITC", "Matura MT Script Capitals", "Meiryo", "Meiryo UI", "Microsoft Himalaya", "Microsoft JhengHei", "Microsoft New Tai Lue", "Microsoft PhagsPa", "Microsoft Tai Le",
                        "Microsoft Uighur", "Microsoft YaHei", "Microsoft Yi Baiti", "MingLiU", "MingLiU_HKSCS", "MingLiU_HKSCS-ExtB", "MingLiU-ExtB", "Minion", "Minion Pro", "Miriam", "Miriam Fixed", "Mistral", "Modern", "Modern No. 20", "Mona Lisa Solid ITC TT", "Mongolian Baiti",
                        "MONO", "MoolBoran", "Mrs Eaves", "MS LineDraw", "MS Mincho", "MS PMincho", "MS Reference Specialty", "MS UI Gothic", "MT Extra", "MUSEO", "MV Boli",
                        "Nadeem", "Narkisim", "NEVIS", "News Gothic", "News GothicMT", "NewsGoth BT", "Niagara Engraved", "Niagara Solid", "Noteworthy", "NSimSun", "Nyala", "OCR A Extended", "Old Century", "Old English Text MT", "Onyx", "Onyx BT", "OPTIMA", "Oriya Sangam MN",
                        "OSAKA", "OzHandicraft BT", "Palace Script MT", "Papyrus", "Parchment", "Party LET", "Pegasus", "Perpetua", "Perpetua Titling MT", "PetitaBold", "Pickwick", "Plantagenet Cherokee", "Playbill", "PMingLiU", "PMingLiU-ExtB",
                        "Poor Richard", "Poster", "PosterBodoni BT", "PRINCETOWN LET", "Pristina", "PTBarnum BT", "Pythagoras", "Raavi", "Rage Italic", "Ravie", "Ribbon131 Bd BT", "Rockwell", "Rockwell Condensed", "Rockwell Extra Bold", "Rod", "Roman", "Sakkal Majalla",
                        "Santa Fe LET", "Savoye LET", "Sceptre", "Script", "Script MT Bold", "SCRIPTINA", "Serifa", "Serifa BT", "Serifa Th BT", "ShelleyVolante BT", "Sherwood",
                        "Shonar Bangla", "Showcard Gothic", "Shruti", "Signboard", "SILKSCREEN", "SimHei", "Simplified Arabic", "Simplified Arabic Fixed", "SimSun", "SimSun-ExtB", "Sinhala Sangam MN", "Sketch Rockwell", "Skia", "Small Fonts", "Snap ITC", "Snell Roundhand", "Socket",
                        "Souvenir Lt BT", "Staccato222 BT", "Steamer", "Stencil", "Storybook", "Styllo", "Subway", "Swis721 BlkEx BT", "Swiss911 XCm BT", "Sylfaen", "Synchro LET", "System", "Tamil Sangam MN", "Technical", "Teletype", "Telugu Sangam MN", "Tempus Sans ITC",
                        "Terminal", "Thonburi", "Traditional Arabic", "Trajan", "TRAJAN PRO", "Tristan", "Tubular", "Tunga", "Tw Cen MT", "Tw Cen MT Condensed", "Tw Cen MT Condensed Extra Bold",
                        "TypoUpright BT", "Unicorn", "Univers", "Univers CE 55 Medium", "Univers Condensed", "Utsaah", "Vagabond", "Vani", "Vijaya", "Viner Hand ITC", "VisualUI", "Vivaldi", "Vladimir Script", "Vrinda", "Westminster", "WHITNEY", "Wide Latin",
                        "ZapfEllipt BT", "ZapfHumnst BT", "ZapfHumnst Dm BT", "Zapfino", "Zurich BlkEx BT", "Zurich Ex BT", "ZWAdobeF"];

        if(that.options.extendedJsFonts) {
            fontList = fontList.concat(extendedFontList);
        }

        fontList = fontList.concat(that.options.userDefinedFonts);

        //we use m or w because these two characters take up the maximum width.
        // And we use a LLi so that the same matching fonts can get separated
        var testString = "mmmmmmmmmmlli";

        //we test using 72px font size, we may use any size. I guess larger the better.
        var testSize = "72px";

        var h = document.getElementsByTagName("body")[0];

        // div to load spans for the base fonts
        var baseFontsDiv = document.createElement("div");

        // div to load spans for the fonts to detect
        var fontsDiv = document.createElement("div");

        var defaultWidth = {};
        var defaultHeight = {};

        // creates a span where the fonts will be loaded
        var createSpan = function() {
            var s = document.createElement("span");
            /*
             * We need this css as in some weird browser this
             * span elements shows up for a microSec which creates a
             * bad user experience
             */
            s.style.position = "absolute";
            s.style.left = "-9999px";
            s.style.fontSize = testSize;
            s.style.lineHeight = "normal";
            s.innerHTML = testString;
            return s;
        };

        // creates a span and load the font to detect and a base font for fallback
        var createSpanWithFonts = function(fontToDetect, baseFont) {
            var s = createSpan();
            s.style.fontFamily = "'" + fontToDetect + "'," + baseFont;
            return s;
        };

        // creates spans for the base fonts and adds them to baseFontsDiv
        var initializeBaseFontsSpans = function() {
            var spans = [];
            for (var index = 0, length = baseFonts.length; index < length; index++) {
                var s = createSpan();
                s.style.fontFamily = baseFonts[index];
                baseFontsDiv.appendChild(s);
                spans.push(s);
            }
            return spans;
        };

        // creates spans for the fonts to detect and adds them to fontsDiv
        var initializeFontsSpans = function() {
            var spans = {};
            for(var i = 0, l = fontList.length; i < l; i++) {
                var fontSpans = [];
                for(var j = 0, numDefaultFonts = baseFonts.length; j < numDefaultFonts; j++) {
                    var s = createSpanWithFonts(fontList[i], baseFonts[j]);
                    fontsDiv.appendChild(s);
                    fontSpans.push(s);
                }
                spans[fontList[i]] = fontSpans; // Stores {fontName : [spans for that font]}
            }
            return spans;
        };

        // checks if a font is available
        var isFontAvailable = function(fontSpans) {
            var detected = false;
            for(var i = 0; i < baseFonts.length; i++) {
                detected = (fontSpans[i].offsetWidth !== defaultWidth[baseFonts[i]] || fontSpans[i].offsetHeight !== defaultHeight[baseFonts[i]]);
                if(detected) {
                    return detected;
                }
            }
            return detected;
        };

        // create spans for base fonts
        var baseFontsSpans = initializeBaseFontsSpans();

        // add the spans to the DOM
        h.appendChild(baseFontsDiv);

        // get the default width for the three base fonts
        for (var index = 0, length = baseFonts.length; index < length; index++) {
            defaultWidth[baseFonts[index]] = baseFontsSpans[index].offsetWidth; // width for the default font
            defaultHeight[baseFonts[index]] = baseFontsSpans[index].offsetHeight; // height for the default font
        }

        // create spans for fonts to detect
        var fontsSpans = initializeFontsSpans();

        // add all the spans to the DOM
        h.appendChild(fontsDiv);

        // check available fonts
        var available = [];
        for(var i = 0, l = fontList.length; i < l; i++) {
            if(isFontAvailable(fontsSpans[fontList[i]])) {
                available.push(fontList[i]);
            }
        }

        // remove spans from DOM
        h.removeChild(fontsDiv);
        h.removeChild(baseFontsDiv);

        keys.push({key: "js_fonts", value: available});
        done(keys);
      }, 1);
    },
    pluginsKey: function(keys) {
      if(!this.options.excludePlugins){
        if(this.isIE()){
          if(!this.options.excludeIEPlugins) {
            keys.push({key: "ie_plugins", value: this.getIEPlugins()});
          }
        } else {
          keys.push({key: "regular_plugins", value: this.getRegularPlugins()});
        }
      }
      return keys;
    },
    getRegularPlugins: function () {
      var plugins = [];
      for(var i = 0, l = navigator.plugins.length; i < l; i++) {
        plugins.push(navigator.plugins[i]);
      }
      // sorting plugins only for those user agents, that we know randomize the plugins
      // every time we try to enumerate them
      if(this.pluginsShouldBeSorted()) {
        plugins = plugins.sort(function(a, b) {
          if(a.name > b.name){ return 1; }
          if(a.name < b.name){ return -1; }
          return 0;
        });
      }
      return this.map(plugins, function (p) {
        var mimeTypes = this.map(p, function(mt){
          return [mt.type, mt.suffixes].join("~");
        }).join(",");
        return [p.name, p.description, mimeTypes].join("::");
      }, this);
    },
    getIEPlugins: function () {
      var result = [];
      if((Object.getOwnPropertyDescriptor && Object.getOwnPropertyDescriptor(window, "ActiveXObject")) || ("ActiveXObject" in window)) {
        var names = [
          "AcroPDF.PDF", // Adobe PDF reader 7+
          "Adodb.Stream",
          "AgControl.AgControl", // Silverlight
          "DevalVRXCtrl.DevalVRXCtrl.1",
          "MacromediaFlashPaper.MacromediaFlashPaper",
          "Msxml2.DOMDocument",
          "Msxml2.XMLHTTP",
          "PDF.PdfCtrl", // Adobe PDF reader 6 and earlier, brrr
          "QuickTime.QuickTime", // QuickTime
          "QuickTimeCheckObject.QuickTimeCheck.1",
          "RealPlayer",
          "RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)",
          "RealVideo.RealVideo(tm) ActiveX Control (32-bit)",
          "Scripting.Dictionary",
          "SWCtl.SWCtl", // ShockWave player
          "Shell.UIHelper",
          "ShockwaveFlash.ShockwaveFlash", //flash plugin
          "Skype.Detection",
          "TDCCtl.TDCCtl",
          "WMPlayer.OCX", // Windows media player
          "rmocx.RealPlayer G2 Control",
          "rmocx.RealPlayer G2 Control.1"
        ];
        // starting to detect plugins in IE
        result = this.map(names, function(name) {
          try {
            new ActiveXObject(name); // eslint-disable-no-new
            return name;
          } catch(e) {
            return null;
          }
        });
      }
      if(navigator.plugins) {
        result = result.concat(this.getRegularPlugins());
      }
      return result;
    },
    pluginsShouldBeSorted: function () {
      var should = false;
      for(var i = 0, l = this.options.sortPluginsFor.length; i < l; i++) {
        var re = this.options.sortPluginsFor[i];
        if(navigator.userAgent.match(re)) {
          should = true;
          break;
        }
      }
      return should;
    },
    touchSupportKey: function (keys) {
      if(!this.options.excludeTouchSupport){
        keys.push({key: "touch_support", value: this.getTouchSupport()});
      }
      return keys;
    },
    hardwareConcurrencyKey: function(keys){
      if(!this.options.excludeHardwareConcurrency){
        keys.push({key: "hardware_concurrency", value: this.getHardwareConcurrency()});
      }
      return keys;
    },
    hasSessionStorage: function () {
      try {
        return !!window.sessionStorage;
      } catch(e) {
        return true; // SecurityError when referencing it means it exists
      }
    },
    // https://bugzilla.mozilla.org/show_bug.cgi?id=781447
    hasLocalStorage: function () {
      try {
        return !!window.localStorage;
      } catch(e) {
        return true; // SecurityError when referencing it means it exists
      }
    },
    hasIndexedDB: function (){
      try {
        return !!window.indexedDB;
      } catch(e) {
        return true; // SecurityError when referencing it means it exists
      }
    },
    getHardwareConcurrency: function(){
      if(navigator.hardwareConcurrency){
        return navigator.hardwareConcurrency;
      }
      return "unknown";
    },
    getNavigatorCpuClass: function () {
      if(navigator.cpuClass){
        return navigator.cpuClass;
      } else {
        return "unknown";
      }
    },
    getNavigatorPlatform: function () {
      if(navigator.platform) {
        return navigator.platform;
      } else {
        return "unknown";
      }
    },
    getDoNotTrack: function () {
      if(navigator.doNotTrack) {
        return navigator.doNotTrack;
      } else if (navigator.msDoNotTrack) {
        return navigator.msDoNotTrack;
      } else if (window.doNotTrack) {
        return window.doNotTrack;
      } else {
        return "unknown";
      }
    },
    // This is a crude and primitive touch screen detection.
    // It's not possible to currently reliably detect the  availability of a touch screen
    // with a JS, without actually subscribing to a touch event.
    // http://www.stucox.com/blog/you-cant-detect-a-touchscreen/
    // https://github.com/Modernizr/Modernizr/issues/548
    // method returns an array of 3 values:
    // maxTouchPoints, the success or failure of creating a TouchEvent,
    // and the availability of the 'ontouchstart' property
    getTouchSupport: function () {
      var maxTouchPoints = 0;
      var touchEvent = false;
      if(typeof navigator.maxTouchPoints !== "undefined") {
        maxTouchPoints = navigator.maxTouchPoints;
      } else if (typeof navigator.msMaxTouchPoints !== "undefined") {
        maxTouchPoints = navigator.msMaxTouchPoints;
      }
      try {
        document.createEvent("TouchEvent");
        touchEvent = true;
      } catch(_) { /* squelch */ }
      var touchStart = "ontouchstart" in window;
      return [maxTouchPoints, touchEvent, touchStart];
    },
    // https://www.browserleaks.com/canvas#how-does-it-work
    getCanvasFp: function() {
      var result = [];
      // Very simple now, need to make it more complex (geo shapes etc)
      var canvas = document.createElement("canvas");
      canvas.width = 2000;
      canvas.height = 200;
      canvas.style.display = "inline";
      var ctx = canvas.getContext("2d");
      // detect browser support of canvas winding
      // http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
      // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas/winding.js
      ctx.rect(0, 0, 10, 10);
      ctx.rect(2, 2, 6, 6);
      result.push("canvas winding:" + ((ctx.isPointInPath(5, 5, "evenodd") === false) ? "yes" : "no"));

      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#f60";
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = "#069";
      // https://github.com/Valve/fingerprintjs2/issues/66
      if(this.options.dontUseFakeFontInCanvas) {
        ctx.font = "11pt Arial";
      } else {
        ctx.font = "11pt no-real-font-123";
      }
      ctx.fillText("Cwm fjordbank glyphs vext quiz, \ud83d\ude03", 2, 15);
      ctx.fillStyle = "rgba(102, 204, 0, 0.2)";
      ctx.font = "18pt Arial";
      ctx.fillText("Cwm fjordbank glyphs vext quiz, \ud83d\ude03", 4, 45);

      // canvas blending
      // http://blogs.adobe.com/webplatform/2013/01/28/blending-features-in-canvas/
      // http://jsfiddle.net/NDYV8/16/
      ctx.globalCompositeOperation = "multiply";
      ctx.fillStyle = "rgb(255,0,255)";
      ctx.beginPath();
      ctx.arc(50, 50, 50, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "rgb(0,255,255)";
      ctx.beginPath();
      ctx.arc(100, 50, 50, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "rgb(255,255,0)";
      ctx.beginPath();
      ctx.arc(75, 100, 50, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "rgb(255,0,255)";
      // canvas winding
      // http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
      // http://jsfiddle.net/NDYV8/19/
      ctx.arc(75, 75, 75, 0, Math.PI * 2, true);
      ctx.arc(75, 75, 25, 0, Math.PI * 2, true);
      ctx.fill("evenodd");

      result.push("canvas fp:" + canvas.toDataURL());
      return result.join("~");
    },

    getWebglFp: function() {
      var gl;
      var fa2s = function(fa) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        return "[" + fa[0] + ", " + fa[1] + "]";
      };
      var maxAnisotropy = function(gl) {
        var anisotropy, ext = gl.getExtension("EXT_texture_filter_anisotropic") || gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic") || gl.getExtension("MOZ_EXT_texture_filter_anisotropic");
        return ext ? (anisotropy = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT), 0 === anisotropy && (anisotropy = 2), anisotropy) : null;
      };
      gl = this.getWebglCanvas();
      if(!gl) { return null; }
      // WebGL fingerprinting is a combination of techniques, found in MaxMind antifraud script & Augur fingerprinting.
      // First it draws a gradient object with shaders and convers the image to the Base64 string.
      // Then it enumerates all WebGL extensions & capabilities and appends them to the Base64 string, resulting in a huge WebGL string, potentially very unique on each device
      // Since iOS supports webgl starting from version 8.1 and 8.1 runs on several graphics chips, the results may be different across ios devices, but we need to verify it.
      var result = [];
      var vShaderTemplate = "attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}";
      var fShaderTemplate = "precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}";
      var vertexPosBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
      var vertices = new Float32Array([-.2, -.9, 0, .4, -.26, 0, 0, .732134444, 0]);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
      vertexPosBuffer.itemSize = 3;
      vertexPosBuffer.numItems = 3;
      var program = gl.createProgram(), vshader = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(vshader, vShaderTemplate);
      gl.compileShader(vshader);
      var fshader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(fshader, fShaderTemplate);
      gl.compileShader(fshader);
      gl.attachShader(program, vshader);
      gl.attachShader(program, fshader);
      gl.linkProgram(program);
      gl.useProgram(program);
      program.vertexPosAttrib = gl.getAttribLocation(program, "attrVertex");
      program.offsetUniform = gl.getUniformLocation(program, "uniformOffset");
      gl.enableVertexAttribArray(program.vertexPosArray);
      gl.vertexAttribPointer(program.vertexPosAttrib, vertexPosBuffer.itemSize, gl.FLOAT, !1, 0, 0);
      gl.uniform2f(program.offsetUniform, 1, 1);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexPosBuffer.numItems);
      if (gl.canvas != null) { result.push(gl.canvas.toDataURL()); }
      result.push("extensions:" + gl.getSupportedExtensions().join(";"));
      result.push("webgl aliased line width range:" + fa2s(gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE)));
      result.push("webgl aliased point size range:" + fa2s(gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE)));
      result.push("webgl alpha bits:" + gl.getParameter(gl.ALPHA_BITS));
      result.push("webgl antialiasing:" + (gl.getContextAttributes().antialias ? "yes" : "no"));
      result.push("webgl blue bits:" + gl.getParameter(gl.BLUE_BITS));
      result.push("webgl depth bits:" + gl.getParameter(gl.DEPTH_BITS));
      result.push("webgl green bits:" + gl.getParameter(gl.GREEN_BITS));
      result.push("webgl max anisotropy:" + maxAnisotropy(gl));
      result.push("webgl max combined texture image units:" + gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS));
      result.push("webgl max cube map texture size:" + gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE));
      result.push("webgl max fragment uniform vectors:" + gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS));
      result.push("webgl max render buffer size:" + gl.getParameter(gl.MAX_RENDERBUFFER_SIZE));
      result.push("webgl max texture image units:" + gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS));
      result.push("webgl max texture size:" + gl.getParameter(gl.MAX_TEXTURE_SIZE));
      result.push("webgl max varying vectors:" + gl.getParameter(gl.MAX_VARYING_VECTORS));
      result.push("webgl max vertex attribs:" + gl.getParameter(gl.MAX_VERTEX_ATTRIBS));
      result.push("webgl max vertex texture image units:" + gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS));
      result.push("webgl max vertex uniform vectors:" + gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS));
      result.push("webgl max viewport dims:" + fa2s(gl.getParameter(gl.MAX_VIEWPORT_DIMS)));
      result.push("webgl red bits:" + gl.getParameter(gl.RED_BITS));
      result.push("webgl renderer:" + gl.getParameter(gl.RENDERER));
      result.push("webgl shading language version:" + gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
      result.push("webgl stencil bits:" + gl.getParameter(gl.STENCIL_BITS));
      result.push("webgl vendor:" + gl.getParameter(gl.VENDOR));
      result.push("webgl version:" + gl.getParameter(gl.VERSION));

      try {
        // Add the unmasked vendor and unmasked renderer if the debug_renderer_info extension is available
        var extensionDebugRendererInfo = gl.getExtension("WEBGL_debug_renderer_info");
        if (extensionDebugRendererInfo) {
          result.push("webgl unmasked vendor:" + gl.getParameter(extensionDebugRendererInfo.UNMASKED_VENDOR_WEBGL));
          result.push("webgl unmasked renderer:" + gl.getParameter(extensionDebugRendererInfo.UNMASKED_RENDERER_WEBGL));
        }
      } catch(e) { /* squelch */ }

      if (!gl.getShaderPrecisionFormat) {
        return result.join("~");
      }

      result.push("webgl vertex shader high float precision:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT ).precision);
      result.push("webgl vertex shader high float precision rangeMin:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT ).rangeMin);
      result.push("webgl vertex shader high float precision rangeMax:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT ).rangeMax);
      result.push("webgl vertex shader medium float precision:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT ).precision);
      result.push("webgl vertex shader medium float precision rangeMin:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT ).rangeMin);
      result.push("webgl vertex shader medium float precision rangeMax:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT ).rangeMax);
      result.push("webgl vertex shader low float precision:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_FLOAT ).precision);
      result.push("webgl vertex shader low float precision rangeMin:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_FLOAT ).rangeMin);
      result.push("webgl vertex shader low float precision rangeMax:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_FLOAT ).rangeMax);
      result.push("webgl fragment shader high float precision:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT ).precision);
      result.push("webgl fragment shader high float precision rangeMin:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT ).rangeMin);
      result.push("webgl fragment shader high float precision rangeMax:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT ).rangeMax);
      result.push("webgl fragment shader medium float precision:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT ).precision);
      result.push("webgl fragment shader medium float precision rangeMin:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT ).rangeMin);
      result.push("webgl fragment shader medium float precision rangeMax:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT ).rangeMax);
      result.push("webgl fragment shader low float precision:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT ).precision);
      result.push("webgl fragment shader low float precision rangeMin:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT ).rangeMin);
      result.push("webgl fragment shader low float precision rangeMax:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT ).rangeMax);
      result.push("webgl vertex shader high int precision:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT ).precision);
      result.push("webgl vertex shader high int precision rangeMin:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT ).rangeMin);
      result.push("webgl vertex shader high int precision rangeMax:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT ).rangeMax);
      result.push("webgl vertex shader medium int precision:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_INT ).precision);
      result.push("webgl vertex shader medium int precision rangeMin:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_INT ).rangeMin);
      result.push("webgl vertex shader medium int precision rangeMax:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_INT ).rangeMax);
      result.push("webgl vertex shader low int precision:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_INT ).precision);
      result.push("webgl vertex shader low int precision rangeMin:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_INT ).rangeMin);
      result.push("webgl vertex shader low int precision rangeMax:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_INT ).rangeMax);
      result.push("webgl fragment shader high int precision:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT ).precision);
      result.push("webgl fragment shader high int precision rangeMin:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT ).rangeMin);
      result.push("webgl fragment shader high int precision rangeMax:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT ).rangeMax);
      result.push("webgl fragment shader medium int precision:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_INT ).precision);
      result.push("webgl fragment shader medium int precision rangeMin:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_INT ).rangeMin);
      result.push("webgl fragment shader medium int precision rangeMax:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_INT ).rangeMax);
      result.push("webgl fragment shader low int precision:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_INT ).precision);
      result.push("webgl fragment shader low int precision rangeMin:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_INT ).rangeMin);
      result.push("webgl fragment shader low int precision rangeMax:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_INT ).rangeMax);
      return result.join("~");
    },
    getAdBlock: function(){
      var ads = document.createElement("div");
      ads.innerHTML = "&nbsp;";
      ads.className = "adsbox";
      var result = false;
      try {
        // body may not exist, that's why we need try/catch
        document.body.appendChild(ads);
        result = document.getElementsByClassName("adsbox")[0].offsetHeight === 0;
        document.body.removeChild(ads);
      } catch (e) {
        result = false;
      }
      return result;
    },
    getHasLiedLanguages: function(){
      //We check if navigator.language is equal to the first language of navigator.languages
      if(typeof navigator.languages !== "undefined"){
        try {
          var firstLanguages = navigator.languages[0].substr(0, 2);
          if(firstLanguages !== navigator.language.substr(0, 2)){
            return true;
          }
        } catch(err) {
          return true;
        }
      }
      return false;
    },
    getHasLiedResolution: function(){
      if(screen.width < screen.availWidth){
        return true;
      }
      if(screen.height < screen.availHeight){
        return true;
      }
      return false;
    },
    getHasLiedOs: function(){
      var userAgent = navigator.userAgent.toLowerCase();
      var oscpu = navigator.oscpu;
      var platform = navigator.platform.toLowerCase();
      var os;
      //We extract the OS from the user agent (respect the order of the if else if statement)
      if(userAgent.indexOf("windows phone") >= 0){
        os = "Windows Phone";
      } else if(userAgent.indexOf("win") >= 0){
        os = "Windows";
      } else if(userAgent.indexOf("android") >= 0){
        os = "Android";
      } else if(userAgent.indexOf("linux") >= 0){
        os = "Linux";
      } else if(userAgent.indexOf("iphone") >= 0 || userAgent.indexOf("ipad") >= 0 ){
        os = "iOS";
      } else if(userAgent.indexOf("mac") >= 0){
        os = "Mac";
      } else{
        os = "Other";
      }
      // We detect if the person uses a mobile device
      var mobileDevice;
      if (("ontouchstart" in window) ||
           (navigator.maxTouchPoints > 0) ||
           (navigator.msMaxTouchPoints > 0)) {
            mobileDevice = true;
      } else{
        mobileDevice = false;
      }

      if(mobileDevice && os !== "Windows Phone" && os !== "Android" && os !== "iOS" && os !== "Other"){
        return true;
      }

      // We compare oscpu with the OS extracted from the UA
      if(typeof oscpu !== "undefined"){
        oscpu = oscpu.toLowerCase();
        if(oscpu.indexOf("win") >= 0 && os !== "Windows" && os !== "Windows Phone"){
          return true;
        } else if(oscpu.indexOf("linux") >= 0 && os !== "Linux" && os !== "Android"){
          return true;
        } else if(oscpu.indexOf("mac") >= 0 && os !== "Mac" && os !== "iOS"){
          return true;
        } else if(oscpu.indexOf("win") === 0 && oscpu.indexOf("linux") === 0 && oscpu.indexOf("mac") >= 0 && os !== "other"){
          return true;
        }
      }

      //We compare platform with the OS extracted from the UA
      if(platform.indexOf("win") >= 0 && os !== "Windows" && os !== "Windows Phone"){
        return true;
      } else if((platform.indexOf("linux") >= 0 || platform.indexOf("android") >= 0 || platform.indexOf("pike") >= 0) && os !== "Linux" && os !== "Android"){
        return true;
      } else if((platform.indexOf("mac") >= 0 || platform.indexOf("ipad") >= 0 || platform.indexOf("ipod") >= 0 || platform.indexOf("iphone") >= 0) && os !== "Mac" && os !== "iOS"){
        return true;
      } else if(platform.indexOf("win") === 0 && platform.indexOf("linux") === 0 && platform.indexOf("mac") >= 0 && os !== "other"){
        return true;
      }

      if(typeof navigator.plugins === "undefined" && os !== "Windows" && os !== "Windows Phone"){
        //We are are in the case where the person uses ie, therefore we can infer that it's windows
        return true;
      }

      return false;
    },
    getHasLiedBrowser: function () {
      var userAgent = navigator.userAgent.toLowerCase();
      var productSub = navigator.productSub;

      //we extract the browser from the user agent (respect the order of the tests)
      var browser;
      if(userAgent.indexOf("firefox") >= 0){
        browser = "Firefox";
      } else if(userAgent.indexOf("opera") >= 0 || userAgent.indexOf("opr") >= 0){
        browser = "Opera";
      } else if(userAgent.indexOf("chrome") >= 0){
        browser = "Chrome";
      } else if(userAgent.indexOf("safari") >= 0){
        browser = "Safari";
      } else if(userAgent.indexOf("trident") >= 0){
        browser = "Internet Explorer";
      } else{
        browser = "Other";
      }

      if((browser === "Chrome" || browser === "Safari" || browser === "Opera") && productSub !== "20030107"){
        return true;
      }

      var tempRes = eval.toString().length;
      if(tempRes === 37 && browser !== "Safari" && browser !== "Firefox" && browser !== "Other"){
        return true;
      } else if(tempRes === 39 && browser !== "Internet Explorer" && browser !== "Other"){
        return true;
      } else if(tempRes === 33 && browser !== "Chrome" && browser !== "Opera" && browser !== "Other"){
        return true;
      }

      //We create an error to see how it is handled
      var errFirefox;
      try {
        throw "a";
      } catch(err){
        try{
          err.toSource();
          errFirefox = true;
        } catch(errOfErr){
          errFirefox = false;
        }
      }
      if(errFirefox && browser !== "Firefox" && browser !== "Other"){
        return true;
      }
      return false;
    },
    isCanvasSupported: function () {
      var elem = document.createElement("canvas");
      return !!(elem.getContext && elem.getContext("2d"));
    },
    isWebGlSupported: function() {
      // code taken from Modernizr
      if (!this.isCanvasSupported()) {
        return false;
      }

      var canvas = document.createElement("canvas"),
          glContext;

      try {
        glContext = canvas.getContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
      } catch(e) {
        glContext = false;
      }

      return !!window.WebGLRenderingContext && !!glContext;
    },
    isIE: function () {
      if(navigator.appName === "Microsoft Internet Explorer") {
        return true;
      } else if(navigator.appName === "Netscape" && /Trident/.test(navigator.userAgent)) { // IE 11
        return true;
      }
      return false;
    },
    hasSwfObjectLoaded: function(){
      return typeof window.swfobject !== "undefined";
    },
    hasMinFlashInstalled: function () {
      return swfobject.hasFlashPlayerVersion("9.0.0");
    },
    addFlashDivNode: function() {
      var node = document.createElement("div");
      node.setAttribute("id", this.options.swfContainerId);
      document.body.appendChild(node);
    },
    loadSwfAndDetectFonts: function(done) {
      var hiddenCallback = "___fp_swf_loaded";
      window[hiddenCallback] = function(fonts) {
        done(fonts);
      };
      var id = this.options.swfContainerId;
      this.addFlashDivNode();
      var flashvars = { onReady: hiddenCallback};
      var flashparams = { allowScriptAccess: "always", menu: "false" };
      swfobject.embedSWF(this.options.swfPath, id, "1", "1", "9.0.0", false, flashvars, flashparams, {});
    },
    getWebglCanvas: function() {
      var canvas = document.createElement("canvas");
      var gl = null;
      try {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      } catch(e) { /* squelch */ }
      if (!gl) { gl = null; }
      return gl;
    },
    each: function (obj, iterator, context) {
      if (obj === null) {
        return;
      }
      if (this.nativeForEach && obj.forEach === this.nativeForEach) {
        obj.forEach(iterator, context);
      } else if (obj.length === +obj.length) {
        for (var i = 0, l = obj.length; i < l; i++) {
          if (iterator.call(context, obj[i], i, obj) === {}) { return; }
        }
      } else {
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (iterator.call(context, obj[key], key, obj) === {}) { return; }
          }
        }
      }
    },

    map: function(obj, iterator, context) {
      var results = [];
      // Not using strict equality so that this acts as a
      // shortcut to checking for `null` and `undefined`.
      if (obj == null) { return results; }
      if (this.nativeMap && obj.map === this.nativeMap) { return obj.map(iterator, context); }
      this.each(obj, function(value, index, list) {
        results[results.length] = iterator.call(context, value, index, list);
      });
      return results;
    },

    /// MurmurHash3 related functions

    //
    // Given two 64bit ints (as an array of two 32bit ints) returns the two
    // added together as a 64bit int (as an array of two 32bit ints).
    //
    x64Add: function(m, n) {
      m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
      n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
      var o = [0, 0, 0, 0];
      o[3] += m[3] + n[3];
      o[2] += o[3] >>> 16;
      o[3] &= 0xffff;
      o[2] += m[2] + n[2];
      o[1] += o[2] >>> 16;
      o[2] &= 0xffff;
      o[1] += m[1] + n[1];
      o[0] += o[1] >>> 16;
      o[1] &= 0xffff;
      o[0] += m[0] + n[0];
      o[0] &= 0xffff;
      return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
    },

    //
    // Given two 64bit ints (as an array of two 32bit ints) returns the two
    // multiplied together as a 64bit int (as an array of two 32bit ints).
    //
    x64Multiply: function(m, n) {
      m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
      n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
      var o = [0, 0, 0, 0];
      o[3] += m[3] * n[3];
      o[2] += o[3] >>> 16;
      o[3] &= 0xffff;
      o[2] += m[2] * n[3];
      o[1] += o[2] >>> 16;
      o[2] &= 0xffff;
      o[2] += m[3] * n[2];
      o[1] += o[2] >>> 16;
      o[2] &= 0xffff;
      o[1] += m[1] * n[3];
      o[0] += o[1] >>> 16;
      o[1] &= 0xffff;
      o[1] += m[2] * n[2];
      o[0] += o[1] >>> 16;
      o[1] &= 0xffff;
      o[1] += m[3] * n[1];
      o[0] += o[1] >>> 16;
      o[1] &= 0xffff;
      o[0] += (m[0] * n[3]) + (m[1] * n[2]) + (m[2] * n[1]) + (m[3] * n[0]);
      o[0] &= 0xffff;
      return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
    },
    //
    // Given a 64bit int (as an array of two 32bit ints) and an int
    // representing a number of bit positions, returns the 64bit int (as an
    // array of two 32bit ints) rotated left by that number of positions.
    //
    x64Rotl: function(m, n) {
      n %= 64;
      if (n === 32) {
        return [m[1], m[0]];
      }
      else if (n < 32) {
        return [(m[0] << n) | (m[1] >>> (32 - n)), (m[1] << n) | (m[0] >>> (32 - n))];
      }
      else {
        n -= 32;
        return [(m[1] << n) | (m[0] >>> (32 - n)), (m[0] << n) | (m[1] >>> (32 - n))];
      }
    },
    //
    // Given a 64bit int (as an array of two 32bit ints) and an int
    // representing a number of bit positions, returns the 64bit int (as an
    // array of two 32bit ints) shifted left by that number of positions.
    //
    x64LeftShift: function(m, n) {
      n %= 64;
      if (n === 0) {
        return m;
      }
      else if (n < 32) {
        return [(m[0] << n) | (m[1] >>> (32 - n)), m[1] << n];
      }
      else {
        return [m[1] << (n - 32), 0];
      }
    },
    //
    // Given two 64bit ints (as an array of two 32bit ints) returns the two
    // xored together as a 64bit int (as an array of two 32bit ints).
    //
    x64Xor: function(m, n) {
      return [m[0] ^ n[0], m[1] ^ n[1]];
    },
    //
    // Given a block, returns murmurHash3's final x64 mix of that block.
    // (`[0, h[0] >>> 1]` is a 33 bit unsigned right shift. This is the
    // only place where we need to right shift 64bit ints.)
    //
    x64Fmix: function(h) {
      h = this.x64Xor(h, [0, h[0] >>> 1]);
      h = this.x64Multiply(h, [0xff51afd7, 0xed558ccd]);
      h = this.x64Xor(h, [0, h[0] >>> 1]);
      h = this.x64Multiply(h, [0xc4ceb9fe, 0x1a85ec53]);
      h = this.x64Xor(h, [0, h[0] >>> 1]);
      return h;
    },

    //
    // Given a string and an optional seed as an int, returns a 128 bit
    // hash using the x64 flavor of MurmurHash3, as an unsigned hex.
    //
    x64hash128: function (key, seed) {
      key = key || "";
      seed = seed || 0;
      var remainder = key.length % 16;
      var bytes = key.length - remainder;
      var h1 = [0, seed];
      var h2 = [0, seed];
      var k1 = [0, 0];
      var k2 = [0, 0];
      var c1 = [0x87c37b91, 0x114253d5];
      var c2 = [0x4cf5ad43, 0x2745937f];
      for (var i = 0; i < bytes; i = i + 16) {
        k1 = [((key.charCodeAt(i + 4) & 0xff)) | ((key.charCodeAt(i + 5) & 0xff) << 8) | ((key.charCodeAt(i + 6) & 0xff) << 16) | ((key.charCodeAt(i + 7) & 0xff) << 24), ((key.charCodeAt(i) & 0xff)) | ((key.charCodeAt(i + 1) & 0xff) << 8) | ((key.charCodeAt(i + 2) & 0xff) << 16) | ((key.charCodeAt(i + 3) & 0xff) << 24)];
        k2 = [((key.charCodeAt(i + 12) & 0xff)) | ((key.charCodeAt(i + 13) & 0xff) << 8) | ((key.charCodeAt(i + 14) & 0xff) << 16) | ((key.charCodeAt(i + 15) & 0xff) << 24), ((key.charCodeAt(i + 8) & 0xff)) | ((key.charCodeAt(i + 9) & 0xff) << 8) | ((key.charCodeAt(i + 10) & 0xff) << 16) | ((key.charCodeAt(i + 11) & 0xff) << 24)];
        k1 = this.x64Multiply(k1, c1);
        k1 = this.x64Rotl(k1, 31);
        k1 = this.x64Multiply(k1, c2);
        h1 = this.x64Xor(h1, k1);
        h1 = this.x64Rotl(h1, 27);
        h1 = this.x64Add(h1, h2);
        h1 = this.x64Add(this.x64Multiply(h1, [0, 5]), [0, 0x52dce729]);
        k2 = this.x64Multiply(k2, c2);
        k2 = this.x64Rotl(k2, 33);
        k2 = this.x64Multiply(k2, c1);
        h2 = this.x64Xor(h2, k2);
        h2 = this.x64Rotl(h2, 31);
        h2 = this.x64Add(h2, h1);
        h2 = this.x64Add(this.x64Multiply(h2, [0, 5]), [0, 0x38495ab5]);
      }
      k1 = [0, 0];
      k2 = [0, 0];
      switch(remainder) {
        case 15:
          k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 14)], 48));
        case 14:
          k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 13)], 40));
        case 13:
          k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 12)], 32));
        case 12:
          k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 11)], 24));
        case 11:
          k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 10)], 16));
        case 10:
          k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 9)], 8));
        case 9:
          k2 = this.x64Xor(k2, [0, key.charCodeAt(i + 8)]);
          k2 = this.x64Multiply(k2, c2);
          k2 = this.x64Rotl(k2, 33);
          k2 = this.x64Multiply(k2, c1);
          h2 = this.x64Xor(h2, k2);
        case 8:
          k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 7)], 56));
        case 7:
          k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 6)], 48));
        case 6:
          k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 5)], 40));
        case 5:
          k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 4)], 32));
        case 4:
          k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 3)], 24));
        case 3:
          k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 2)], 16));
        case 2:
          k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 1)], 8));
        case 1:
          k1 = this.x64Xor(k1, [0, key.charCodeAt(i)]);
          k1 = this.x64Multiply(k1, c1);
          k1 = this.x64Rotl(k1, 31);
          k1 = this.x64Multiply(k1, c2);
          h1 = this.x64Xor(h1, k1);
      }
      h1 = this.x64Xor(h1, [0, key.length]);
      h2 = this.x64Xor(h2, [0, key.length]);
      h1 = this.x64Add(h1, h2);
      h2 = this.x64Add(h2, h1);
      h1 = this.x64Fmix(h1);
      h2 = this.x64Fmix(h2);
      h1 = this.x64Add(h1, h2);
      h2 = this.x64Add(h2, h1);
      return ("00000000" + (h1[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (h1[1] >>> 0).toString(16)).slice(-8) + ("00000000" + (h2[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (h2[1] >>> 0).toString(16)).slice(-8);
    }
  };
  Fingerprint2.VERSION = "1.5.1";
  return Fingerprint2;
});


/***/ }),

/***/ "./src/modules/old_concept/modules/browser_fingerprint/index.js":
/*!**********************************************************************!*\
  !*** ./src/modules/old_concept/modules/browser_fingerprint/index.js ***!
  \**********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/**
 * 浏览器指纹
 */

var fingerprint = __webpack_require__(/*! ./fingerprint2 */ "./src/modules/old_concept/modules/browser_fingerprint/fingerprint2.js");
//var bid = require('../bid');
var save = __webpack_require__(/*! ./save */ "./src/modules/old_concept/modules/browser_fingerprint/save.js");


/**
 * 是否支持canvas
 * 
 * @returns 
 */
var cookie = {
    get: function (name) {
        var xarr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (xarr != null)
            return decodeURIComponent(xarr[2]);
        return null;
    },
    set: function (key, value, expiredays, domain) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        document.cookie = key + "=" + escape(value) + ";expires=" + exdate.toGMTString() + ";path=/;domain=" + domain;
    },
    del: function (key, domain) {
        var exdate = new Date((new Date).getTime() - 1);
        if (domain) {
            document.cookie = key + '=;path=/;expires=' + exdate.toGMTString() + ';domain=' + domain;
        }
        else {
            document.cookie = key + '=;path=/;expires=' + exdate.toGMTString();
        }

    }
};

function isSupportCanvas(){
  var elem = document.createElement('canvas');
  return !!(elem.getContext && elem.getContext('2d'));
}
var bid = {
    get: function () {
        var zw = cookie.get('qgqp_b_id')
        if (zw == null) {
            return this.make()
        }
        else {
            return zw;
        }

    },
    make: function () {
        var newid = Math.floor(Math.random() * 9 + 1).toString();
        for (var i = 0; i < 19; i++) {
            newid += Math.floor(Math.random() * 9).toString();

        }
        cookie.set('qgqp_b_id', newid, 10000, '.eastmoney.com');
        return newid;
    },
    init: function () {
        if (this.get() == null || this.get() == '') {
            return this.make();
        }
        else {
            return this.get();
        }
    }
}

module.exports = {
  get: function(callback){
    if(cookie.get('qgqp_b_id')){
        callback(cookie.get('qgqp_b_id'))
        return
    }
    if (isSupportCanvas()) {
      new fingerprint({
          dontUseFakeFontInCanvas: true,
          swfContainerId: true,
          swfPath: true,
          // userDefinedFonts : true,
          excludeUserAgent: true,
          // excludeLanguage : true,
          // excludeColorDepth : true,
          excludeScreenResolution: true,
          excludeAvailableScreenResolution: true,
          // excludeTimezoneOffset : true,
          // excludeSessionStorage : true,
          // excludeIndexedDB : true,
          // excludeAddBehavior : true,
          // excludeOpenDatabase : true,
          // excludeCpuClass : true,
          // excludePlatform : true,
          // excludeDoNotTrack : true,
          // excludeCanvas : true,
          // excludeWebGL : true,
          excludeAdBlock: true,
          // excludeHasLiedLanguages : true,
          // excludeHasLiedResolution : true,
          // excludeHasLiedOs : true,
          // excludeHasLiedBrowser : true,
          // excludeJsFonts : true,
          excludeFlashFonts: true,
          excludePlugins: true,
          excludeIEPlugins: true
        // excludeTouchSupport : true,
        // excludePixelRatio : true,
        // excludeHardwareConcurrency : true,
      }).get(function(result, components){
        save(result);
        callback(result, components);
        return;
      });
    }
    else{
      callback(bid.init());
      return;
    }
  }
}

/***/ }),

/***/ "./src/modules/old_concept/modules/browser_fingerprint/save.js":
/*!*********************************************************************!*\
  !*** ./src/modules/old_concept/modules/browser_fingerprint/save.js ***!
  \*********************************************************************/
/***/ (function(module) {

/**
 * 保存浏览器指纹
 */

//var cookie = require('../utils.cookie');
var cookie = {
    get: function (name) {
        var xarr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (xarr != null)
            return decodeURIComponent(xarr[2]);
        return null;
    },
    set: function (key, value, expiredays, domain) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        document.cookie = key + "=" + escape(value) + ";expires=" + exdate.toGMTString() + ";path=/;domain=" + domain;
    },
    del: function (key, domain) {
        var exdate = new Date((new Date).getTime() - 1);
        if (domain) {
            document.cookie = key + '=;path=/;expires=' + exdate.toGMTString() + ';domain=' + domain;
        }
        else {
            document.cookie = key + '=;path=/;expires=' + exdate.toGMTString();
        }

    }
};

module.exports = function(fingerprint){
  if (fingerprint) {
      cookie.set('qgqp_b_id', fingerprint, 10000, '.eastmoney.com');
  }
}

/***/ }),

/***/ "./src/modules/old_concept/modules/jquery-plugins/jquery.imageloader.js":
/*!******************************************************************************!*\
  !*** ./src/modules/old_concept/modules/jquery-plugins/jquery.imageloader.js ***!
  \******************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "jquery");

function imgLoader(setting) {
    if (typeof (setting) !== "object" || !setting["url"]) return false;
    var fCallback = typeof (setting["success"]) === "function" ? setting["success"] : null;
    var _url = setting["url"];
    if (setting["data"]) {
        var _data = $.param(setting["data"]);
        _url = _url.indexOf("?") > 0 ? _url + "&" + _data : _url + "?" + _data;
    }
    if (!setting["cache"]) {
        _url += _url.indexOf("?") > 0 ? "&_=" + (+new Date()) : "?_=" + (+new Date());
    }
    var _image = document.createElement("img");
    if (typeof (setting["height"]) === "number" && setting["height"] > 0) {
        _image.setAttribute("height", setting["height"] + "px");
    }
    if (typeof (setting["width"]) === "number" && setting["width"] > 0) {
        _image.setAttribute("width", setting["width"] + "px");
    }
    _image.setAttribute('src', _url);
    if (typeof (setting["error"]) === "function")
        $(_image).error(function () {
            setting["error"](_image);
        });
    _image.onload = _image.onreadystatechange = function (evt) {
        if (!_image.readyState || /loaded|complete/.test(_image.readyState)) {
            // Handle memory leak in IE
            _image.onload = _image.onreadystatechange = null;
            // Callback if not abort
            if (fCallback) fCallback(_image);
        }
    };
    return _image;
}
$.extend({
    //异步动态图片加载
    imgLoader: imgLoader
});
module.exports = imgLoader;

/***/ }),

/***/ "./src/modules/old_concept/modules/jquery-plugins/jquery.lazyloader.js":
/*!*****************************************************************************!*\
  !*** ./src/modules/old_concept/modules/jquery-plugins/jquery.lazyloader.js ***!
  \*****************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "jquery");
var throttle = _.throttle;

/**
 * 滚动懒加载
 * @param {string|HTMLElement|JQuery<HTMLElement>} dom DOM对象
 * @param {Object} options 配置项
 * @param {string} options.trigger 触发事件
 * @param {number} options.scrollTop 滚动位置
 * @param {number} options.throttle 节流阀
 * @param {Function} options.onloading 加载时回调
 * @param {Object} options.eventArgs 回调事件参数
 */
function lazyloader(dom, options) {
    var $dom = $(dom);
    if ($dom.length <= 0) return false;
    var loaded = false;
    var _opt = $.extend({
        trigger: 'scroll',
        scrollTop: $dom.offset().top,
        eventArgs: null,
        throttle: 200
    }, options);
    var event = throttle(_load, _opt.throttle);
    $(window).on(_opt.trigger, event);
    _load();
    function _load(e) {
        if (loaded) return false;
        var pos = $(window).height() + $(window).scrollTop();
        if (pos >= _opt.scrollTop) {
            if (typeof options.onloading === 'function') {
                options.onloading.apply(dom, [e, _opt.eventArgs]);
            }
            loaded = true;
            $(window).unbind(_opt.trigger, event);
        }
    }
}

/**
 * 滚动懒加载
 * @param {Function} onloading 加载回调
 * @param {Object} options 配置项
 * @param {string} options.trigger 触发事件
 * @param {number} options.scrollTop 滚动位置
 * @param {number} options.throttle 节流阀
 * @param {Object} options.eventArgs 回调事件参数
 */
$.fn.lazyload = function (onloading, options) {
    var $dom = $(this);
    var _opt = options || {};
    if ($dom.length > 0) {
        if (typeof onloading === 'function') {
            _opt.onloading = onloading;
            lazyloader($dom, _opt);
        }
    }
    return this;
}

module.exports = lazyloader;

/***/ }),

/***/ "./src/modules/old_concept/modules/jquery-plugins/jquery.parser.js":
/*!*************************************************************************!*\
  !*** ./src/modules/old_concept/modules/jquery-plugins/jquery.parser.js ***!
  \*************************************************************************/
/***/ (function(module) {

/**
 * EasyUI for jQuery 1.5.4.2
 * 
 * Copyright (c) 2009-2018 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the freeware license: http://www.jeasyui.com/license_freeware.php
 * To use it on other terms please contact us: info@jeasyui.com
 *
 */
/**
 * parser - EasyUI for jQuery
 * 
 */

module.exports = (function($){
	$.easyui = {
		/**
		 * Get the index of array item, return -1 when the item is not found.
		 */
		indexOfArray: function(a, o, id){
			for(var i=0,len=a.length; i<len; i++){
				if (id == undefined){
					if (a[i] == o){return i;}
				} else {
					if (a[i][o] == id){return i;}
				}
			}
			return -1;
		},
		/**
		 * Remove array item, 'o' parameter can be item object or id field name.
		 * When 'o' parameter is the id field name, the 'id' parameter is valid.
		 */
		removeArrayItem: function(a, o, id){
			if (typeof o == 'string'){
				for(var i=0,len=a.length; i<len; i++){
					if (a[i][o] == id){
						a.splice(i, 1);
						return;
					}
				}
			} else {
				var index = this.indexOfArray(a,o);
				if (index != -1){
					a.splice(index, 1);
				}
			}
		},
		/**
		 * Add un-duplicate array item, 'o' parameter is the id field name, if the 'r' object is exists, deny the action.
		 */
		addArrayItem: function(a, o, r){
			var index = this.indexOfArray(a, o, r ? r[o] : undefined);
			if (index == -1){
				a.push(r ? r : o);
			} else {
				a[index] = r ? r : o;
			}
		},
		getArrayItem: function(a, o, id){
			var index = this.indexOfArray(a, o, id);
			return index==-1 ? null : a[index];
		},
		forEach: function(data, deep, callback){
			var nodes = [];
			for(var i=0; i<data.length; i++){
				nodes.push(data[i]);
			}
			while(nodes.length){
				var node = nodes.shift();
				if (callback(node) == false){return;}
				if (deep && node.children){
					for(var i=node.children.length-1; i>=0; i--){
						nodes.unshift(node.children[i]);
					}
				}
			}
		}
	};

	$.parser = {
		auto: true,
		onComplete: function(context){},
		plugins:['draggable','droppable','resizable','pagination','tooltip',
		         'linkbutton','menu','menubutton','splitbutton','switchbutton','progressbar',
				 'tree','textbox','passwordbox','filebox','combo','combobox','combotree','combogrid','combotreegrid','tagbox','numberbox','validatebox','searchbox',
				 'spinner','numberspinner','timespinner','datetimespinner','calendar','datebox','datetimebox','slider',
				 'layout','panel','datagrid','propertygrid','treegrid','datalist','tabs','accordion','window','dialog','form'
		],
		parse: function(context){
			var aa = [];
			for(var i=0; i<$.parser.plugins.length; i++){
				var name = $.parser.plugins[i];
				var r = $('.easyui-' + name, context);
				if (r.length){
					if (r[name]){
						r.each(function(){
							$(this)[name]($.data(this, 'options')||{});
						});
					} else {
						aa.push({name:name,jq:r});
					}
				}
			}
			if (aa.length && window.easyloader){
				var names = [];
				for(var i=0; i<aa.length; i++){
					names.push(aa[i].name);
				}
				easyloader.load(names, function(){
					for(var i=0; i<aa.length; i++){
						var name = aa[i].name;
						var jq = aa[i].jq;
						jq.each(function(){
							$(this)[name]($.data(this, 'options')||{});
						});
					}
					$.parser.onComplete.call($.parser, context);
				});
			} else {
				$.parser.onComplete.call($.parser, context);
			}
		},
		
		parseValue: function(property, value, parent, delta){
			delta = delta || 0;
			var v = $.trim(String(value||''));
			var endchar = v.substr(v.length-1, 1);
			if (endchar == '%'){
				v = parseFloat(v.substr(0, v.length-1));
				if (property.toLowerCase().indexOf('width') >= 0){
					v = Math.floor((parent.width()-delta) * v / 100.0);
				} else {
					v = Math.floor((parent.height()-delta) * v / 100.0);
				}
			} else {
				v = parseInt(v) || undefined;
			}
			return v;
		},
		
		/**
		 * parse options, including standard 'data-options' attribute.
		 * 
		 * calling examples:
		 * $.parser.parseOptions(target);
		 * $.parser.parseOptions(target, ['id','title','width',{fit:'boolean',border:'boolean'},{min:'number'}]);
		 */
		parseOptions: function(target, properties){
			var t = $(target);
			var options = {};
			
			var s = $.trim(t.attr('data-options'));
			if (s){
				if (s.substring(0, 1) != '{'){
					s = '{' + s + '}';
				}
				options = (new Function('return ' + s))();
			}
			$.map(['width','height','left','top','minWidth','maxWidth','minHeight','maxHeight'], function(p){
				var pv = $.trim(target.style[p] || '');
				if (pv){
					if (pv.indexOf('%') == -1){
						pv = parseInt(pv);
						if (isNaN(pv)){
							pv = undefined;
						}
					}
					options[p] = pv;
				}
			});
				
			if (properties){
				var opts = {};
				for(var i=0; i<properties.length; i++){
					var pp = properties[i];
					if (typeof pp == 'string'){
						opts[pp] = t.attr(pp);
					} else {
						for(var name in pp){
							var type = pp[name];
							if (type == 'boolean'){
								opts[name] = t.attr(name) ? (t.attr(name) == 'true') : undefined;
							} else if (type == 'number'){
								opts[name] = t.attr(name)=='0' ? 0 : parseFloat(t.attr(name)) || undefined;
							}
						}
					}
				}
				$.extend(options, opts);
			}
			return options;
		}
	};
	$(function(){
		var d = $('<div style="position:absolute;top:-1000px;width:100px;height:100px;padding:5px"></div>').appendTo('body');
		$._boxModel = d.outerWidth()!=100;
		d.remove();
		d = $('<div style="position:fixed"></div>').appendTo('body');
		$._positionFixed = (d.css('position') == 'fixed');
		d.remove();
		
		if (!window.easyloader && $.parser.auto){
			$.parser.parse();
		}
	});
	
	/**
	 * extend plugin to set box model width
	 */
	$.fn._outerWidth = function(width){
		if (width == undefined){
			if (this[0] == window){
				return this.width() || document.body.clientWidth;
			}
			return this.outerWidth()||0;
		}
		return this._size('width', width);
	};
	
	/**
	 * extend plugin to set box model height
	 */
	$.fn._outerHeight = function(height){
		if (height == undefined){
			if (this[0] == window){
				return this.height() || document.body.clientHeight;
			}
			return this.outerHeight()||0;
		}
		return this._size('height', height);
	};
	
	$.fn._scrollLeft = function(left){
		if (left == undefined){
			return this.scrollLeft();
		} else {
			return this.each(function(){$(this).scrollLeft(left)});
		}
	};
	
	$.fn._propAttr = $.fn.prop || $.fn.attr;
	
	$.fn._size = function(options, parent){
		if (typeof options == 'string'){
			if (options == 'clear'){
				return this.each(function(){
					$(this).css({width:'',minWidth:'',maxWidth:'',height:'',minHeight:'',maxHeight:''});
				});
			} else if (options == 'fit'){
				return this.each(function(){
					_fit(this, this.tagName=='BODY' ? $('body') : $(this).parent(), true);
				});
			} else if (options == 'unfit'){
				return this.each(function(){
					_fit(this, $(this).parent(), false);
				});
			} else {
				if (parent == undefined){
					return _css(this[0], options);
				} else {
					return this.each(function(){
						_css(this, options, parent);
					});
				}
			}
		} else {
			return this.each(function(){
				parent = parent || $(this).parent();
				$.extend(options, _fit(this, parent, options.fit)||{});
				var r1 = _setSize(this, 'width', parent, options);
				var r2 = _setSize(this, 'height', parent, options);
				if (r1 || r2){
					$(this).addClass('easyui-fluid');
				} else {
					$(this).removeClass('easyui-fluid');
				}
			});
		}
		
		function _fit(target, parent, fit){
			if (!parent.length){return false;}
			var t = $(target)[0];
			var p = parent[0];
			var fcount = p.fcount || 0;
			if (fit){
				if (!t.fitted){
					t.fitted = true;
					p.fcount = fcount + 1;
					$(p).addClass('panel-noscroll');
					if (p.tagName == 'BODY'){
						$('html').addClass('panel-fit');
					}
				}
				return {
					width: ($(p).width()||1),
					height: ($(p).height()||1)
				};
			} else {
				if (t.fitted){
					t.fitted = false;
					p.fcount = fcount - 1;
					if (p.fcount == 0){
						$(p).removeClass('panel-noscroll');
						if (p.tagName == 'BODY'){
							$('html').removeClass('panel-fit');
						}
					}
				}
				return false;
			}
		}
		function _setSize(target, property, parent, options){
			var t = $(target);
			var p = property;
			var p1 = p.substr(0,1).toUpperCase() + p.substr(1);
			var min = $.parser.parseValue('min'+p1, options['min'+p1], parent);// || 0;
			var max = $.parser.parseValue('max'+p1, options['max'+p1], parent);// || 99999;
			var val = $.parser.parseValue(p, options[p], parent);
			var fluid = (String(options[p]||'').indexOf('%') >= 0 ? true : false);
			
			if (!isNaN(val)){
				var v = Math.min(Math.max(val, min||0), max||99999);
				if (!fluid){
					options[p] = v;
				}
				t._size('min'+p1, '');
				t._size('max'+p1, '');
				t._size(p, v);
			} else {
				t._size(p, '');
				t._size('min'+p1, min);
				t._size('max'+p1, max);
			}
			return fluid || options.fit;
		}
		function _css(target, property, value){
			var t = $(target);
			if (value == undefined){
				value = parseInt(target.style[property]);
				if (isNaN(value)){return undefined;}
				if ($._boxModel){
					value += getDeltaSize();
				}
				return value;
			} else if (value === ''){
				t.css(property, '');
			} else {
				if ($._boxModel){
					value -= getDeltaSize();
					if (value < 0){value = 0;}
				}
				t.css(property, value+'px');
			}
			function getDeltaSize(){
				if (property.toLowerCase().indexOf('width') >= 0){
					return t.outerWidth() - t.width();
				} else {
					return t.outerHeight() - t.height();
				}
			}
		}
	};
	
})(jQuery);

/**
 * support for mobile devices
 */
(function($){
	var longTouchTimer = null;
	var dblTouchTimer = null;
	var isDblClick = false;
	
	function onTouchStart(e){
		if (e.touches.length != 1){return}
		if (!isDblClick){
			isDblClick = true;
			dblClickTimer = setTimeout(function(){
				isDblClick = false;
			}, 500);
		} else {
			clearTimeout(dblClickTimer);
			isDblClick = false;
			fire(e, 'dblclick');
//			e.preventDefault();
		}
		longTouchTimer = setTimeout(function(){
			fire(e, 'contextmenu', 3);
		}, 1000);
		fire(e, 'mousedown');
		if ($.fn.draggable.isDragging || $.fn.resizable.isResizing){
			e.preventDefault();
		}
	}
	function onTouchMove(e){
		if (e.touches.length != 1){return}
		if (longTouchTimer){
			clearTimeout(longTouchTimer);
		}
		fire(e, 'mousemove');
		if ($.fn.draggable.isDragging || $.fn.resizable.isResizing){
			e.preventDefault();
		}
	}
	function onTouchEnd(e){
//		if (e.touches.length > 0){return}
		if (longTouchTimer){
			clearTimeout(longTouchTimer);
		}
		fire(e, 'mouseup');
		if ($.fn.draggable.isDragging || $.fn.resizable.isResizing){
			e.preventDefault();
		}
	}
	
	function fire(e, name, which){
		var event = new $.Event(name);
		event.pageX = e.changedTouches[0].pageX;
		event.pageY = e.changedTouches[0].pageY;
		event.which = which || 1;
		$(e.target).trigger(event);
	}
	
	if (document.addEventListener){
		document.addEventListener("touchstart", onTouchStart, true);
		document.addEventListener("touchmove", onTouchMove, true);
		document.addEventListener("touchend", onTouchEnd, true);
	}
});



/***/ }),

/***/ "./src/modules/old_concept/modules/jquery-plugins/jquery.tooltip.js":
/*!**************************************************************************!*\
  !*** ./src/modules/old_concept/modules/jquery-plugins/jquery.tooltip.js ***!
  \**************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/**
 * EasyUI for jQuery 1.5.4.2
 * 
 * Copyright (c) 2009-2018 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the freeware license: http://www.jeasyui.com/license_freeware.php
 * To use it on other terms please contact us: info@jeasyui.com
 *
 */
var jq = __webpack_require__(/*! jquery */ "jquery");
__webpack_require__(/*! ./jquery.parser */ "./src/modules/old_concept/modules/jquery-plugins/jquery.parser.js");
module.exports = (function ($) {
    function _1(_2) {
        $(_2).addClass("tooltip-f");
    };

    function _3(_4) {
        var _5 = $.data(_4, "tooltip").options;
        $(_4).unbind(".tooltip").bind(_5.showEvent + ".tooltip", function (e) {
            $(_4).tooltip("show", e);
        }).bind(_5.hideEvent + ".tooltip", function (e) {
            $(_4).tooltip("hide", e);
        }).bind("mousemove.tooltip", function (e) {
            if (_5.trackMouse) {
                _5.trackMouseX = e.pageX;
                _5.trackMouseY = e.pageY;
                $(_4).tooltip("reposition");
            }
        });
    };

    function _6(_7) {
        var _8 = $.data(_7, "tooltip");
        if (_8.showTimer) {
            clearTimeout(_8.showTimer);
            _8.showTimer = null;
        }
        if (_8.hideTimer) {
            clearTimeout(_8.hideTimer);
            _8.hideTimer = null;
        }
    };

    function _9(_a) {
        var _b = $.data(_a, "tooltip");
        if (!_b || !_b.tip) {
            return;
        }
        var _c = _b.options;
        var _d = _b.tip;
        var _e = {
            left: -100000,
            top: -100000
        };
        if ($(_a).is(":visible")) {
            _e = _f(_c.position);
            if (_c.position == "top" && _e.top < 0) {
                _e = _f("bottom");
            } else {
                if ((_c.position == "bottom") && (_e.top + _d._outerHeight() > $(window)._outerHeight() + $(document).scrollTop())) {
                    _e = _f("top");
                }
            }
            if (_e.left < 0) {
                if (_c.position == "left") {
                    _e = _f("right");
                } else {
                    $(_a).tooltip("arrow").css("left", _d._outerWidth() / 2 + _e.left);
                    _e.left = 0;
                }
            } else {
                if (_e.left + _d._outerWidth() > $(window)._outerWidth() + $(document)._scrollLeft()) {
                    if (_c.position == "right") {
                        _e = _f("left");
                    } else {
                        var _10 = _e.left;
                        _e.left = $(window)._outerWidth() + $(document)._scrollLeft() - _d._outerWidth();
                        $(_a).tooltip("arrow").css("left", _d._outerWidth() / 2 - (_e.left - _10));
                    }
                }
            }
        }
        _d.css({
            left: _e.left,
            top: _e.top,
            zIndex: (_c.zIndex != undefined ? _c.zIndex : ($.fn.window ? $.fn.window.defaults.zIndex++ : ""))
        });
        _c.onPosition.call(_a, _e.left, _e.top);

        function _f(_11) {
            _c.position = _11 || "bottom";
            _d.removeClass("tooltip-top tooltip-bottom tooltip-left tooltip-right").addClass("tooltip-" + _c.position);
            var _12, top;
            var _13 = $.isFunction(_c.deltaX) ? _c.deltaX.call(_a, _c.position) : _c.deltaX;
            var _14 = $.isFunction(_c.deltaY) ? _c.deltaY.call(_a, _c.position) : _c.deltaY;
            if (_c.trackMouse) {
                t = $();
                _12 = _c.trackMouseX + _13;
                top = _c.trackMouseY + _14;
            } else {
                var t = $(_a);
                _12 = t.offset().left + _13;
                top = t.offset().top + _14;
            }
            switch (_c.position) {
                case "right":
                    _12 += t._outerWidth() + 12 + (_c.trackMouse ? 12 : 0);
                    top -= (_d._outerHeight() - t._outerHeight()) / 2;
                    break;
                case "left":
                    _12 -= _d._outerWidth() + 12 + (_c.trackMouse ? 12 : 0);
                    top -= (_d._outerHeight() - t._outerHeight()) / 2;
                    break;
                case "top":
                    _12 -= (_d._outerWidth() - t._outerWidth()) / 2;
                    top -= _d._outerHeight() + 12 + (_c.trackMouse ? 12 : 0);
                    break;
                case "bottom":
                    _12 -= (_d._outerWidth() - t._outerWidth()) / 2;
                    top += t._outerHeight() + 12 + (_c.trackMouse ? 12 : 0);
                    break;
            }
            return {
                left: _12,
                top: top
            };
        };
    };

    function _15(_16, e) {
        var _17 = $.data(_16, "tooltip");
        var _18 = _17.options;
        var tip = _17.tip;
        if (!tip) {
            tip = $("<div tabindex=\"-1\" class=\"tooltip\">" + "<div class=\"tooltip-content\"></div>" + "<div class=\"tooltip-arrow-outer\"></div>" + "<div class=\"tooltip-arrow\"></div>" + "</div>").appendTo("body");
            _17.tip = tip;
            _19(_16);
        }
        _6(_16);
        _17.showTimer = setTimeout(function () {
            $(_16).tooltip("reposition");
            tip.show();
            _18.onShow.call(_16, e);
            var _1a = tip.children(".tooltip-arrow-outer");
            var _1b = tip.children(".tooltip-arrow");
            var bc = "border-" + _18.position + "-color";
            _1a.add(_1b).css({
                borderTopColor: "",
                borderBottomColor: "",
                borderLeftColor: "",
                borderRightColor: ""
            });
            _1a.css(bc, tip.css(bc));
            _1b.css(bc, tip.css("backgroundColor"));
        }, _18.showDelay);
    };

    function _1c(_1d, e) {
        var _1e = $.data(_1d, "tooltip");
        if (_1e && _1e.tip) {
            _6(_1d);
            _1e.hideTimer = setTimeout(function () {
                _1e.tip.hide();
                _1e.options.onHide.call(_1d, e);
            }, _1e.options.hideDelay);
        }
    };

    function _19(_1f, _20) {
        var _21 = $.data(_1f, "tooltip");
        var _22 = _21.options;
        if (_20) {
            _22.content = _20;
        }
        if (!_21.tip) {
            return;
        }
        var cc = typeof _22.content == "function" ? _22.content.call(_1f) : _22.content;
        _21.tip.children(".tooltip-content").html(cc);
        _22.onUpdate.call(_1f, cc);
    };

    function _23(_24) {
        var _25 = $.data(_24, "tooltip");
        if (_25) {
            _6(_24);
            var _26 = _25.options;
            if (_25.tip) {
                _25.tip.remove();
            }
            if (_26._title) {
                $(_24).attr("title", _26._title);
            }
            $.removeData(_24, "tooltip");
            $(_24).unbind(".tooltip").removeClass("tooltip-f");
            _26.onDestroy.call(_24);
        }
    };
    $.fn.tooltip = function (_27, _28) {
        if (typeof _27 == "string") {
            return $.fn.tooltip.methods[_27](this, _28);
        }
        _27 = _27 || {};
        return this.each(function () {
            var _29 = $.data(this, "tooltip");
            if (_29) {
                $.extend(_29.options, _27);
            } else {
                $.data(this, "tooltip", {
                    options: $.extend({}, $.fn.tooltip.defaults, $.fn.tooltip.parseOptions(this), _27)
                });
                _1(this);
            }
            _3(this);
            _19(this);
        });
    };
    $.fn.tooltip.methods = {
        options: function (jq) {
            return $.data(jq[0], "tooltip").options;
        },
        tip: function (jq) {
            return $.data(jq[0], "tooltip").tip;
        },
        arrow: function (jq) {
            return jq.tooltip("tip").children(".tooltip-arrow-outer,.tooltip-arrow");
        },
        show: function (jq, e) {
            return jq.each(function () {
                _15(this, e);
            });
        },
        hide: function (jq, e) {
            return jq.each(function () {
                _1c(this, e);
            });
        },
        update: function (jq, _2a) {
            return jq.each(function () {
                _19(this, _2a);
            });
        },
        reposition: function (jq) {
            return jq.each(function () {
                _9(this);
            });
        },
        destroy: function (jq) {
            return jq.each(function () {
                _23(this);
            });
        }
    };
    $.fn.tooltip.parseOptions = function (_2b) {
        var t = $(_2b);
        var _2c = $.extend({}, $.parser.parseOptions(_2b, ["position", "showEvent", "hideEvent", "content", {
            trackMouse: "boolean",
            deltaX: "number",
            deltaY: "number",
            showDelay: "number",
            hideDelay: "number"
        }]), {
            _title: t.attr("title")
        });
        t.attr("title", "");
        if (!_2c.content) {
            _2c.content = _2c._title;
        }
        return _2c;
    };
    $.fn.tooltip.defaults = {
        position: "bottom",
        content: null,
        trackMouse: false,
        deltaX: 0,
        deltaY: 0,
        showEvent: "mouseenter",
        hideEvent: "mouseleave",
        showDelay: 200,
        hideDelay: 100,
        onShow: function (e) {},
        onHide: function (e) {},
        onUpdate: function (_2d) {},
        onPosition: function (_2e, top) {},
        onDestroy: function () {}
    };
})(jq);

/***/ }),

/***/ "./src/modules/old_concept/modules/jquery-plugins/jquery.vticker.js":
/*!**************************************************************************!*\
  !*** ./src/modules/old_concept/modules/jquery-plugins/jquery.vticker.js ***!
  \**************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "jquery");
var throttle = _.throttle;
/**
 * vertical news ticker
 * Tadas Juozapaitis ( kasp3rito@gmail.com )
 * http://www.jugbit.com/jquery-vticker-vertical-news-ticker/
 * v 1.4
 * @param {object} options 选项
 * @param {number} options.speed 滚动速度
 * @param {number} options.pause 停留时间
 * @param {number} options.showItems 显示条数
 * @param {string} options.animation 动画效果
 * @param {boolean} options.mousePause 鼠标经过暂停
 * @param {"up"|"down"} options.direction 滚动方向
 * @param {number} options.height 高度
 */
$.fn.vTicker = function (options) {
    var defaults = {
        speed: 700,
        pause: 4000,
        showItems: 3,
        animation: '',
        mousePause: true,
        isPaused: false,
        direction: 'up',
        height: 0
    };

    var options = $.extend(defaults, options);

    function moveUp(obj2, height, options) {
        if (options.isPaused)
            return;

        var obj = obj2.children('ul');

        //var clone = obj.children('li:first').clone(true);

        if (options.height > 0) {
            height = obj.children('li:first').height();
        }

        obj.finish().animate({
            top: '-=' + height + 'px'
        }, options.speed, function () {
            //$(this).children('li:first').remove();
            $(this).children('li:first').appendTo(this);
            $(this).css('top', '0px');
        });

        if (options.animation == 'fade') {
            obj.children('li:first').fadeOut(options.speed);
            if (options.height == 0) {
                obj.children('li:eq(' + options.showItems + ')').hide().fadeIn(options.speed).show();
            }
        }

        //clone.appendTo(obj);
    };

    function moveDown(obj2, height, options) {
        if (options.isPaused)
            return;

        var obj = obj2.children('ul');

        // var clone = obj.children('li:last').clone(true);

        if (options.height > 0) {
            height = obj.children('li:first').height();
        }

        // obj.css('top', '-' + height + 'px').prepend(clone);
        obj.css('top', '-' + height + 'px').prepend(obj.children('li:last'));

        obj.finish().animate({
            top: 0
        }, options.speed, function () {
            //$(this).children('li:last').remove();
            //$(this).children('li:last').prependTo(this);
        });

        if (options.animation == 'fade') {
            if (options.height == 0) {
                obj.children('li:eq(' + options.showItems + ')').fadeOut(options.speed);
            }
            obj.children('li:first').hide().fadeIn(options.speed).show();
        }
    };
    return this.each(function () {
        var obj = $(this);
        var maxHeight = 0;

        obj.css({
                overflow: 'hidden',
                position: 'relative'
            })
            .children('ul').css({
                position: 'absolute',
                margin: 0,
                padding: 0
            })
            .children('li').css({
                margin: 0,
                padding: 0
            });

        if (options.height == 0) {
            obj.children('ul').children('li').each(function () {
                if ($(this).height() > maxHeight) {
                    maxHeight = $(this).height();
                }
            });

            obj.children('ul').children('li').each(function () {
                $(this).height(maxHeight);
            });

            obj.height(maxHeight * options.showItems);
        } else {
            obj.height(options.height);
        }
        function rolling() {
            if (options.direction == 'up') {
                moveUp(obj, maxHeight, options);
            } else {
                moveDown(obj, maxHeight, options);
            }
        }
        var interval = setInterval(rolling, options.pause);

        if (options.mousePause) {
            obj.bind("mouseenter", function () {
                options.isPaused = true;
            }).bind("mouseleave", function () {
                options.isPaused = false;
            });
        }
        obj.on('moveup.vticker', throttle(function () {
            moveUp(obj, maxHeight, options);
        }, options.speed)).on('movedown.vticker', throttle(function () {
            moveDown(obj, maxHeight, options);
        }, options.speed)).on('pause.vticker', function () {  
            options.isPaused = true;
        }).on('start.vticker', function () {  
            interval = setInterval(rolling, options.pause);
        }).on('stop.vticker', function () {  
            $(this).finish();
            clearInterval(interval);
        });
    });
};

module.exports = $.fn.vTicker;

/***/ }),

/***/ "./src/modules/old_concept/modules/jsonp.js":
/*!**************************************************!*\
  !*** ./src/modules/old_concept/modules/jsonp.js ***!
  \**************************************************/
/***/ (function(module) {

/**
 * 原生jsonp
 */
var JSONP = function (url, data, method, callback, error) {
    //Set the defaults
    url = url || '';
    data = data || {};
    method = method || '';
    callback = callback || function () {};

    //Gets all the keys that belong
    //to an object
    var getKeys = function (obj) {
        var keys = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                keys.push(key);
            }
        }
        return keys;
    }

    //Turn the data object into a query string.
    //Add check to see if the second parameter is indeed
    //a data object. If not, keep the default behaviour
    if (typeof data == 'object') {
        var queryString = '';
        var keys = getKeys(data);
        for (var i = 0; i < keys.length; i++) {
            queryString += encodeURIComponent(keys[i]) + '=' + encodeURIComponent(data[keys[i]])
            if (i != keys.length - 1) {
                queryString += '&';
            }
        }
        url += queryString ? (url.indexOf('?') > 0 ? '&' : '?') + queryString : '';
    } else if (typeof data == 'function') {
        method = data;
        callback = method;
    }

    //If no method was set and they used the callback param in place of
    //the method param instead, we say method is callback and set a
    //default method of "callback"
    if (typeof method == 'function') {
        callback = method;
        method = 'callback';
    }

    //Check to see if we have Date.now available, if not shim it for older browsers
    if (!Date.now) {
        Date.now = function () {
            return new Date().getTime();
        };
    }

    //Use timestamp + a random factor to account for a lot of requests in a short time
    //e.g. jsonp1394571775161 
    var timestamp = Date.now();
    var generatedFunction = 'jsonp' + Math.round(timestamp + Math.random() * 1000001)

    //Generate the temp JSONP function using the name above
    //First, call the function the user defined in the callback param [callback(json)]
    //Then delete the generated function from the window [delete window[generatedFunction]]
    window[generatedFunction] = function (json) {



        callback(json);

        // IE8 throws an exception when you try to delete a property on window
        // http://stackoverflow.com/a/1824228/751089
        try {
            delete window[generatedFunction];
        } catch (e) {
            window[generatedFunction] = undefined;
        }

        try {
            document.getElementById(generatedFunction).parentNode.removeChild(document.getElementById(generatedFunction));
        } catch (error) {
            throw error;
        }

    };

    //Check if the user set their own params, and if not add a ? to start a list of params
    //If in fact they did we add a & to add onto the params
    //example1: url = http://url.com THEN http://url.com?callback=X
    //example2: url = http://url.com?example=param THEN http://url.com?example=param&callback=X
    if (url.indexOf('?') === -1) {
        url = url + '?';
    } else {
        url = url + '&';
    }

    //This generates the <script> tag
    var jsonpScript = document.createElement('script');
    jsonpScript.id = generatedFunction;
    jsonpScript.className = 'jsonp';
    jsonpScript.setAttribute("src", url + method + '=' + generatedFunction);
    if (typeof error === "function")
        jsonpScript.onerror = function (e) {
            remove();
            error(e);
        };
    remove();
    jsonpScript.abort = function () {
        remove();
        trigger(jsonpScript, 'error');
    }
    return jsonpScript;

    function remove() {
        document.getElementsByTagName("head")[0].appendChild(jsonpScript);
    }
}

/**
 * 事件触发器
 * @param {HTMLElement} element DOM元素
 * @param {string} event 事件类型
 */
function trigger(element, event) {
    if (typeof event !== 'string') throw 'Unknown event type' + event;
    if (element.dispatchEvent) {
        var evt = document.createEvent('Events'); // initEvent接受3个参数
        evt.initEvent(event, true, true);
        element.dispatchEvent(evt);
    } else if (element.fireEvent) { //IE
        element.fireEvent('on' + event);
    } else {
        element['on' + event]();
    }
}


module.exports = JSONP;

/***/ }),

/***/ "./src/modules/old_concept/modules/modal/confirm.js":
/*!**********************************************************!*\
  !*** ./src/modules/old_concept/modules/modal/confirm.js ***!
  \**********************************************************/
/***/ (function(module) {



function modal(op) {
    this.onConfirm = null;
    this.onCancle = null;
    this.ops = {
        shade: false,
        shadeColor: "rgba(0,0,0,0.5)",
        title: "股友您好",
        p1: "",
        p2: ""
    }
    _.merge(this.ops, op);
    this._init();
    this._addEvn();
}


modal.prototype._init = function () {

    var box = $("<div></div>").addClass("__em_modal");

    var html = '<div class="__em_dialog">' +
        '<div class="__em_dialog_head">' +
        '<h3></h3>' +
        '<span>×</span>' +
        '</div>' +
        '<div class="__em_dialog_body">' +
        '<p class="__em_dialog_p1"></p>' +
        '<p class="__em_dialog_p2"></p>' +
        '</div>' +
        '<div class="__em_dialog_foot">' +
        '<div class="__em_dialog_confirm">确&nbsp;定</div>' +
        // '<div class="__em_dialog_cancle">取消</div>' +
        '</div>' +
        '</div>';

    html = $(html);

    this.ops.shade && box.css("background-color", this.ops.shadeColor);
    html.find("h3").text(this.ops.title);
    html.find(".__em_dialog_p1").text(this.ops.p1);
    html.find(".__em_dialog_p2").text(this.ops.p2);

    box.html(html);
    $("body").append(box);

    this.dom = box;
}


modal.prototype._addEvn = function () {
    var that = this;
    this.dom.find(".__em_dialog_head span").on("click", function () {
        that.onCancle && that.onCancle(that);
        that.hide();
    });
    this.dom.find(".__em_dialog_cancle").on("click", function () {
        that.onCancle && that.onCancle(that);
        that.hide();
    });
    this.dom.find(".__em_dialog_confirm").on("click", function (e) {
        that.onConfirm && that.onConfirm(e, that);
    });
}

modal.prototype.show = function () {
    this.dom.show();
}

modal.prototype.hide = function () {
    this.dom.hide();
}

module.exports = modal;

/***/ }),

/***/ "./src/modules/old_concept/modules/modal/index.js":
/*!********************************************************!*\
  !*** ./src/modules/old_concept/modules/modal/index.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var confirm = __webpack_require__(/*! ./confirm */ "./src/modules/old_concept/modules/modal/confirm.js");

module.exports = {
    confirm: confirm
};

/***/ }),

/***/ "./src/modules/old_concept/modules/modalright/confirm.js":
/*!***************************************************************!*\
  !*** ./src/modules/old_concept/modules/modalright/confirm.js ***!
  \***************************************************************/
/***/ (function(module) {



function modal(op) {
    this.onConfirm = null;
    this.onCancle = null;
    this.ops = {
        shade: false,
        shadeColor: "rgba(0,0,0,0.5)",
        title: "设置",
        p1: "",
        p2: ""
    }
    _.merge(this.ops, op);
    this._init();
    this._addEvn();
}


modal.prototype._init = function () {

    var box = $("<div></div>").addClass("__em_modalright");

    var html = '<div class="__em_dialogright">' +
        '<div class="__em_dialogright_head">' +
        '<h3></h3>' +
        '<span>×</span>' +
        '</div>' +
        '<div class="__em_dialogright_body">' +
        '<p class="__em_dialogright_p0">行情单页设置</p>' +
        '<p class="__em_dialogright_p1">设置默认概念版行情单页</p>' +
        '<p class="__em_dialogright_p2">取消默认概念版行情单页</p>' +
        '</div>' +
        '<div class="__em_dialogright_foot">' +
        '<div class="__em_dialogright_confirm">确&nbsp;认</div>' +
        // '<div class="__em_dialogright_cancle">取消</div>' +
        '</div>' +
        '</div>';

    html = $(html);

    this.ops.shade && box.css("background-color", this.ops.shadeColor);
    html.find("h3").text(this.ops.title);
    html.find(".__em_dialogright_p1").text(this.ops.p1);
    html.find(".__em_dialogright_p2").text(this.ops.p2);

    box.html(html);
    $("body").append(box);

    this.dom = box;
}


modal.prototype._addEvn = function () {
    var that = this;
    this.dom.find(".__em_dialogright_head span").on("click", function () {
        that.onCancle && that.onCancle(that);
        that.hide();
    });
    this.dom.find(".__em_dialogright_cancle").on("click", function () {
        that.onCancle && that.onCancle(that);
        that.hide();
    });
    this.dom.find(".__em_dialogright_confirm").on("click", function (e) {
        that.onConfirm && that.onConfirm(e, that);
    });
}

modal.prototype.show = function () {
    this.dom.show();
}

modal.prototype.hide = function () {
    this.dom.hide();
}

module.exports = modal;

/***/ }),

/***/ "./src/modules/old_concept/modules/modalright/index.js":
/*!*************************************************************!*\
  !*** ./src/modules/old_concept/modules/modalright/index.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var confirm = __webpack_require__(/*! ./confirm */ "./src/modules/old_concept/modules/modalright/confirm.js");

module.exports = {
    confirm: confirm
};

/***/ }),

/***/ "./src/modules/old_concept/modules/polyfills/jpromise.js":
/*!***************************************************************!*\
  !*** ./src/modules/old_concept/modules/polyfills/jpromise.js ***!
  \***************************************************************/
/***/ (function(module) {

/**
 * jquery版的promise
 * 为了保证兼容性
 * 使用then不使用done
 * 使用fail不使用catch
 * 还可以使用always
 */
var $ = jQuery;

/**
 * jquery版的promise
 * 
 * @param {any} callfun 
 * @returns 
 */
function jpromise(callfun){
  var dtd = $.Deferred();
  callfun(dtd.resolve, dtd.reject);
  return dtd.promise();
}

jpromise.all = function(jpromise_list){
  var plist = [];
  if(!plist instanceof Array){
    throw new Error('不是数组')
  }
  if(jpromise_list.length == 0){
    return new jpromise(function(resolve, reject){
      resolve([])
    })
  }


  return new jpromise(function(resolve, reject){
    $.when.apply(this, jpromise_list)
    .then(function(){
      var back = [];

      if(jpromise_list.length == 1){
        back.push(arguments[0])
      }
      else{
        for (var i = 0; i < arguments.length; i++) {
          back.push(arguments[i][0])
        }        
      }

      resolve(back)
    })
    .fail(function(error){
      reject(error)
    })
  })
}

jpromise.reject = function(error){
  return new jpromise(function(resolve, reject){
    reject(error)
  })
}

jpromise.resolve = function(data){
  return new jpromise(function(resolve, reject){
    resolve(data)
  })
}


module.exports = jpromise

/***/ }),

/***/ "./src/modules/old_concept/modules/polyfills/json-polyfill.js":
/*!********************************************************************!*\
  !*** ./src/modules/old_concept/modules/polyfills/json-polyfill.js ***!
  \********************************************************************/
/***/ (function(module) {

if (!window.JSON) {
    window.JSON = {
        parse: function (sJSON) {
            return eval('(' + sJSON + ')');
        },
        stringify: (function () {
            var toString = Object.prototype.toString;
            var isArray = Array.isArray || function (a) {
                return toString.call(a) === '[object Array]';
            };
            var escMap = {
                '"': '\\"',
                '\\': '\\\\',
                '\b': '\\b',
                '\f': '\\f',
                '\n': '\\n',
                '\r': '\\r',
                '\t': '\\t'
            };
            var escFunc = function (m) {
                return escMap[m] || '\\u' + (m.charCodeAt(0) + 0x10000).toString(16).substr(1);
            };
            var escRE = /[\\"\u0000-\u001F\u2028\u2029]/g;
            return function stringify(value) {
                if (value == null) {
                    return 'null';
                } else if (typeof value === 'number') {
                    return isFinite(value) ? value.toString() : 'null';
                } else if (typeof value === 'boolean') {
                    return value.toString();
                } else if (typeof value === 'object') {
                    if (typeof value.toJSON === 'function') {
                        return stringify(value.toJSON());
                    } else if (isArray(value)) {
                        var res = '[';
                        for (var i = 0; i < value.length; i++)
                            res += (i ? ', ' : '') + stringify(value[i]);
                        return res + ']';
                    } else if (toString.call(value) === '[object Object]') {
                        var tmp = [];
                        for (var k in value) {
                            if (value.hasOwnProperty(k))
                                tmp.push(stringify(k) + ': ' + stringify(value[k]));
                        }
                        return '{' + tmp.join(', ') + '}';
                    }
                }
                return '"' + value.toString().replace(escRE, escFunc) + '"';
            };
        })()
    };
}

module.exports = window.JSON;

/***/ }),

/***/ "./src/modules/old_concept/modules/polyfills/requestAnimationFrame-polyfill.js":
/*!*************************************************************************************!*\
  !*** ./src/modules/old_concept/modules/polyfills/requestAnimationFrame-polyfill.js ***!
  \*************************************************************************************/
/***/ (function(module) {

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// MIT license
module.exports = (function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function () {
            callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };
    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
    };
}());

/***/ }),

/***/ "./src/modules/old_concept/modules/qcsroll.js":
/*!****************************************************!*\
  !*** ./src/modules/old_concept/modules/qcsroll.js ***!
  \****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

__webpack_require__(/*! ./polyfills/requestAnimationFrame-polyfill */ "./src/modules/old_concept/modules/polyfills/requestAnimationFrame-polyfill.js");
/**
 * 区域滚动栏
 * @param {HTMLElement} element DOM元素
 */
function QCScroll(element) {
    var width = 0;
    var container = document.createElement('div'),
        slider = document.createElement('div');
    var _this = this;
    _this.element = element;
    _this.run = true;
    slider.innerHTML = element.innerHTML;

    slider.style.cssText = 'float: left; overflow: hidden; zoom: 1;';
    container.appendChild(slider);
    container.style.cssText = 'overflow: hidden; zoom: 1;';
    container.appendChild(slider);
    container.appendChild(slider.cloneNode(true));

    element.innerHTML = '';
    element.appendChild(container);

    //获取元素真实宽度
    container.style.cssText = 'position: absolute; visibility:hidden; left:0; white-space:nowrap;';
    width = container.offsetWidth;
    container.style.cssText = '';
    container.style.width = width + 'px';
    container.onmouseover = function () {
        _this.run = false;
    };

    container.onmouseout = function () {
        _this.run = true;
        clearTimeout(_this.timer);
        _this.timer = setTimeout(function () {
            cancelAnimationFrame(_this.animateId);
            _this.animate();
        }, 200)
    };

    /**
     * 启用动画
     * @returns {number} 动画ID
     */
    this.animate = function () {
        var _this = this;
        var element = _this.element;
        if (!_this.run) return;
        element.scrollLeft++;

        if (element.scrollLeft + element.clientWidth >= element.scrollWidth) {
            element.scrollLeft = 0;

        }
        clearTimeout(_this.timer);
        _this.animateId = requestAnimationFrame(function () {
            _this.animate();
        });
        return _this.animateId;
    }

    /**
     * 取消动画
     * @param {number} id 动画ID
     */
    this.cancel = function (id) {
        cancelAnimationFrame(id || _this.animateId);
    }
}

module.exports = QCScroll;

/***/ }),

/***/ "./src/modules/old_concept/modules/quotecharts.js":
/*!********************************************************!*\
  !*** ./src/modules/old_concept/modules/quotecharts.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// var merge = require('lodash/merge');
// var jsonp = require('./jsonp');
// var isProd = environment === 'production';
// var emchartscdn = isProd ? '//emcharts.eastmoney.com/ec/3.14.2/emcharts.min.js' : '//172.16.58.95/emchart_test/EMCharts3/bundle/emcharts.js';
// var chartdataurl = '//pdfm.eastmoney.com/EM_UBG_PDTI_Fast/api/js?token=4f1862fc3b5e77c150a2b985b12db0fd';
// var changedataurl = '//nuyd.eastmoney.com/EM_UBG_PositionChangesInterface/api/js?style=top&js=([(x)])&ac=normal&check=itntcd';
// var newsapiurl = isProd ? '//cmsdataapi.eastmoney.com/api/infomine' : '//cmsdataapi.test.emapd.com/api/infomine';
// var exrightsurl = isProd ? '//push2.eastmoney.com/api/qt/stock/cqcx/get' : '//61.152.230.32:38618/api/qt/stock/cqcx/get';
// // var emcharts3 = window.emcharts3 || null;

// var emcharts3='//emcharts.eastmoney.com/ec/3.14.2/emcharts.min.js';
// function charts(type, args) {
//     var self = this;
//     var timer, chart;
//     this.args = args;
//     this.inited = false;
//     this.datacache = false;
//     this.chartType = type;
//     this.load = function () {
//         this.inited = false;
//         this.stop().reload();
//         return chart;
//     }

//     this.create = function () {
//         return _init.apply(this, [type, emcharts3]);
//     }

//     this.reload = function () {
//         _load.apply(this);

//         if (this.args.update > 0) {
//             timer = setInterval(function () {
//                 _load.apply(self);
//             }, this.args.update);
//         }
//         return this;
//     }

//     this.stop = function () {
//         clearInterval(timer);
//         chart = null;
//         return this;
//     }

//     function _load() {
//         console.log(chart)
//         if (!chart) {
//             chart = this.create();
//             // if (!this.inited) chart.start();
//         }
//         if (typeof this.dataloader === 'function') {
//             this.dataloader.apply(this);
//         } 
//         else chart.draw();
//     }

//     function _init(type, emcharts3) {
//         switch (type) {
//             case 'compatible':
//                 return pictureLoader.apply(this, [args]);
//             case 'time':
//                 return timeLoader.apply(this, [args]);

//             case 'k':
//                 return kLoader.apply(this, [args]);
//             default:
//                 if (typeof emcharts3[type] === 'function') {
//                     this.inited = true;
//                     return new emcharts3[type](args);
//                 } else return null;
//         }
//     }
// }

// charts.preload = function (callback, error) { //异步加载
//     if (typeof emcharts3 === 'function') {
//         if (typeof callback === 'function') callback(emcharts3);
//         return emcharts3;
//     }
//     try {
//         var script = document.createElement('script');
//         script.id = 'emcharts3-script';
//         script.setAttribute('src', emchartscdn);
//         if (typeof error === 'function')
//             script.onerror = error;
//         script.async = true;
//         script.defer = true;
//         script.onload = script.onreadystatechange = function (evt) {
//             if (!script.readyState || /loaded|complete/.test(script.readyState)) {
//                 script.onload = script.onreadystatechange = null;
//                 emcharts3 = require('emcharts3');
//                 if (typeof callback === 'function') callback.call(emcharts3);
//             }
//         }
//         document.getElementsByTagName("head")[0].appendChild(script);
//     } catch (e) {
//         console.error(e);
//     }
// }

// /**
//  * 分时图加载器
//  * @param {*} args 分时图参数
//  */
// function timeLoader(args) {
//     var self = this;
//     var _opt = this.args = merge({
//         entry: {},
//         container: '#chart-container',
//         width: 720,
//         height: 600,
//         type: 'r',
//         iscr: false,
//         gridwh: {
//             //height: 25,
//             width: 720
//         },
//         padding: {
//             top: 0,
//             bottom: 5
//         },
//         color: {
//             line: '#326fb2',
//             fill: ['rgba(101,202,254, 0.2)', 'rgba(101,202,254, 0.1)']
//         },
//         data: {
//             time: [],
//             positionChanges: []
//         },
//         tip: {
//             show: true,
//             trading: true
//         },
//         show: {
//             indicatorArea: true, // 分时指标
//             CMA: true,
//             ddx: args.type === 'r',
//             cf: args.type === 'r'
//         },
//         onClickChanges: function () {
//             window.open('//quote.eastmoney.com/changes/stocks/' + args.entry.shortmarket + args.entry.code + '.html');
//         },
//         onComplete: function () {

//         },
//         onError: function (err) {
//             console.error(err);
//         },
//         update: 40 * 1000
//     }, args);
//     // var timer
//     // var chart = new emcharts3.time(_opt);
//     var chart = '';
//     // 加载数据
//     // this.dataloader = function () {
//     //     if (!this.datacache) {
//     //         this.datacache = {
//     //             time: {},
//     //             positionChanges: []
//     //         };
//     //     }
//     //     jsonp(chartdataurl, {
//     //         id: args.entry.id,
//     //         type: args.type,
//     //         iscr: args.iscr,
//     //         rtntype: 5
//     //     }, 'cb', function (json) {
//     //         // chart.stop();
//     //         if (!json || json.stats === false) return false;
//     //         self.datacache.time = json;
//     //         self.datacache.datak = false;
//     //         // chart.setData(self.datacache);
//     //         // clearTimeout(timer);
//     //         // timer = setTimeout(function () {
//     //         //     // 打点
//     //         //     makepoints.apply(self, [chart, args, 'infomine']);
//     //         //     // 盘口异动
//     //         //     drawPositionChange();
//     //         // }, 500);
//     //         // 分钟K线
//     //         if (_opt.show && _opt.show.indicatorArea) {
//     //             drawIndicators();
//     //         }
//     //         if (self.inited) chart.redraw();
//     //         else {
//     //             // chart.draw();
//     //             self.inited = true;
//     //         }
//     //     }, function (e) {
//     //         console.error(e);
//     //     });
//     // }
//     // return chart;
//     /**
//      * 盘口异动
//      */
//     function drawPositionChange() {
//         jsonp(changedataurl, {
//             id: args.entry.id,
//         }, 'cb', function (changes) {
//             if (!changes) return false;
//             if (typeof changes[0] !== 'string') return false;
//             self.datacache.positionChanges = changes;
//             chart.setData(self.datacache);
//             if (self.inited) chart.redraw();
//             else chart.draw();
//         }, function () {

//         });
//     }

//     /**
//      * 分时指标
//      */
//     function drawIndicators() {
//         jsonp(chartdataurl, {
//             rtntype: 5,
//             id: args.entry.id,
//             type: _opt.type + 'k',
//             iscr: false
//         }, 'cb', function (datak) {
//             if (!datak) return false;
//             if (datak.stats != false) {
//                 self.datacache.datak = datak;
//                 // chart.setData(self.datacache);
//                 // if (self.inited) chart.redraw();
//                 // else chart.draw();
//             }
//         }, function () {

//         });
//     }
// }

// /**
//  * K图加载器
//  * @param {*} args K图参数
//  */
// function kLoader(args) {
//     var self = this;
//     var timer, chart;
//     var _opt = this.args = merge({
//         entry: {},
//         container: "#chart-container",
//         width: 720,
//         height: 600,
//         padding: {
//             top: 10,
//             //right: 0,
//             bottom: 0
//         },
//         kgap: {
//             top: 18 + 9,
//             bottom: 18 + 13
//         },
//         color: {
//             border: '#eee'
//         },
//         show: {
//             CMA: true,
//             // 除权除息打点
//             cqcx: true,
//             lr: args.type === 'k',
//             cf: args.type === 'k'
//         },
//         scale: {
//             pillar: 60,
//             min: 10
//         },
//         popWin: {
//             type: "move"
//         },
//         yAxisType: 1,
//         maxin: {
//             //show: true,
//             lineWidth: 30, // 线长
//             skewx: 0, // x偏移   
//             skewy: 0, // y偏移
//         },
//         data: {
//             k: []
//         },
//         onComplete: function () {

//         },
//         onDragEnd: function () {
//             timer = setTimeout(function () {
//                 makepoints.apply(self, [chart, args, 'infomine']);
//             }, 500);
//         },
//         onClick: function () { },
//         onError: function (err) {
//             console.error(err);
//         },
//         update: 60 * 1000
//     }, args);
//     chart = new emcharts3.k2(_opt);
//     this.dataloader = function () {
//         chart.stop(); // remove loading
//         jsonp(chartdataurl, {
//             rtntype: 6,
//             id: args.entry.id,
//             type: args.type,
//             authorityType: args.authorityType
//         }, 'cb', function (json) {
//             // chart.stop();
//             if (!json || json.stats === false) return false;
//             chart.setData({
//                 k: json
//             }, _opt);
//             if (self.inited) chart.redraw();
//             else chart.draw();
//             clearTimeout(timer)
//             timer = setTimeout(function () {
//                 makepoints.apply(self, [chart, args]);
//             }, 500);
//         }, function (e) {

//         });
//     }
//     return chart;
// }


// /**
//  * 打点功能
//  * @param {*} chart emchart
//  * @param {*} args 参数
//  * @param {string} type 打点类型
//  */
// function makepoints(chart, args, type) {
//     var self = this;
//     var displayInfomine = ['r', 't2', 't3', 't4', 't5', 'k', 'wk', 'mk'].indexOf(args.type) >= 0;
//     var displayExrights = ['k', 'wk', 'mk'].indexOf(args.type) >= 0;
//     var enabled = [];
//     if (!type || ['all', '*'].indexOf(type) >= 0) {
//         enabled.push('infomine', 'exrights');
//     } else
//         enabled.push(type);
//     if (displayInfomine && enabled.indexOf('infomine') >= 0)
//         newsnoticepoints.apply(this);
//     if (displayExrights && enabled.indexOf('exrights') >= 0)
//         exrightspoints.apply(this);

//     /**
//      * 新闻公告打点
//      */
//     function newsnoticepoints() {
//         var istimechart = ['r', 't2', 't3', 't4', 't5'].indexOf(args.type) >= 0;
//         var data = istimechart ? chart.getData() : chart.getData().data;
//         if (data.length&&data instanceof Array) {
//             var starttime = data[0][0],
//                 endtime = data[data.length - 1][0];
//             var param = {
//                 code: args.entry.code,
//                 marketType: args.entry.marketnum,
//                 types: '1,2',
//                 startTime: starttime,
//                 endTime: endtime,
//                 format: istimechart ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd'
//             };
//             jsonp(newsapiurl, param, 'cb', function (json) {
//                 if (json && json.Data instanceof Array) {
//                     /** 
//                      * @typedef {{type: string, url: string, title: string, date: string}} InfoMine
//                      * @type {Array.<InfoMine>} 
//                      */
//                     var points = [];
//                     for (var i = 0; i < json.Data.length; i++) {
//                         /** @type {{Time: string, Type: number, Title: string, Url: string, Code: string}} */
//                         var element = json.Data[i];
//                         if (!element.Time) continue;
//                         points.push({
//                             type: makepoints.newsTypeMap[element.Type],
//                             date: element.Time,
//                             content: element.Title,
//                             url: element.Url
//                         });
//                     }
//                     var newstpl = '<a href="{{url}}" title="{{content}}" target="_blank">{{date}}&nbsp;{{type}}&nbsp;{{content}}</a>';
//                     chart.setData({
//                         dot: {
//                             infomine: {
//                                 position: 'top',
//                                 width: 9,
//                                 height: 9,
//                                 className: 'icon-dl',
//                                 /**
//                                  * @param {InfoMine} point
//                                  */
//                                 formatter: function (point) {
//                                     if (!point) return '';
//                                     return simpleTemplate(newstpl, point);
//                                 },
//                                 multiple: {
//                                     className: 'icon-dl2'
//                                 },
//                                 points: points
//                             }
//                         }
//                     });
//                     if (istimechart) chart.redraw();
//                     else chart.draw();
//                     //chart.redraw();
//                 }
//             }, function (err) {
//                 console.error('新闻打点异常', err);
//             });
//         }
//     }

//     /**
//      * 除权除息打点
//      */
//     function exrightspoints() {
//         if (self.exrightsdata) {
//             draw(self.exrightsdata);
//         }
//         if (!exrightsurl) return false;
//         // type: 1（派现）2（送股，转增）4（拆细合并）8（配股，供股）16（增发）
//         jsonp(exrightsurl, {
//             id: (args.entry.marketnum == 1 ? 'SH' : 'SZ') + args.entry.code,
//             ut: 'e1e6871893c6386c5ff6967026016627'
//         }, 'cb', function (json) {
//             if (!json) return false;
//             if (json.rc === 0 && json.data) {
//                 self.exrightsdata = json.data.records;
//                 draw(json.data.records);
//             }
//         }, function (err) {
//             console.error('除权除息打点异常', err);
//         });

//         function draw(data) {
//             chart.setData({
//                 dot: {
//                     exrights: {
//                         position: 'bottom',
//                         width: 7,
//                         height: 13,
//                         className: 'icon-exrights',
//                         formatter: formatter,
//                         points: data
//                     }
//                 }
//             });
//             chart.draw();
//         }

//         /**
//          * 格式化器
//          * @param {object} point 除权除息数据
//          * @param {string} point.date 日期
//          * @param {number} point.type 1:派现,2:送股、转增,4:拆细、合并,8:配股、供股,16:增发
//          * @param {number} point.pxbl 派现比例
//          * @param {number} point.sgbl 送股（转增）比例
//          * @param {number} point.cxbl 拆细比例
//          * @param {number} point.pgbl 配股（供股）比例
//          * @param {number} point.pgjg 配股（供股）价格
//          * @param {number} point.zfbl 增发比例
//          * @param {number} point.zfgs 增发股数（万股）
//          * @param {number} point.zfjg 增发价格
//          * @param {number} point.ggflag 为1表示外盘供股价格高于除净日前一日收盘价，此时不做前复权
//          */
//         function formatter(point) {
//             var px = 1,
//                 sg = 2,
//                 pg = 8,
//                 zf = 16;
//             if (!point || !point.date) return '';
//             var data = merge({}, point);
//             var result = '<p>' + data.date + '</p>';
//             if ((data.type & px) === px) {
//                 data.name = '派息';
//                 data.pxbl = (data.pxbl * 10).toFixed(2);
//                 result += simpleTemplate('<p>{{name}}: 每10股派{{pxbl}}元</p>', data);
//             }
//             if ((data.type & sg) === sg) {
//                 data.name = '送股';
//                 data.sgbl = (data.sgbl * 10).toFixed(2);
//                 result += simpleTemplate('<p>{{name}}: 每10股送{{sgbl}}股</p>', data);
//             }
//             if ((data.type & pg) === pg) {
//                 data.name = '配股';
//                 data.pgbl = (data.pgbl * 10).toFixed(2);
//                 data.pgjg = data.pgjg.toFixed(2);
//                 result += simpleTemplate('<p>{{name}}: 每10股配{{pgbl}}股&nbsp;配股价格{{pgjg}}元</p>', data);
//             }
//             if ((data.type & zf) === zf) {
//                 data.name = '增发';
//                 data.zfgs = data.zfgs > 100 ? data.zfgs.toFixed(0) : data.zfgs;
//                 data.zfjg = data.zfjg.toFixed(2);
//                 result += simpleTemplate('<p>{{name}}: {{zfgs}}万股&nbsp;增发价格{{zfjg}}元</p>', data);
//             }
//             return result;
//         }
//     }
// }

// makepoints.newsTypeMap = {
//     '1': '[新闻]',
//     '2': '[公告]',
//     '3': '[研报]'
// };

// /**
//  * 模板处理器
//  * @param {string} tpl 模板
//  * @param {object} data 数据
//  */
// function simpleTemplate(tpl, data) {
//     if (!data) return tpl;
//     try {
//         var result = tpl || '';
//         var regex = new RegExp('{{(\\w+)}}', 'g');
//         var matches, cacheKeys = [];
//         while ((matches = regex.exec(tpl)) !== null) {
//             var partten = matches[0],
//                 key = matches[1];
//             if (cacheKeys.indexOf(key) >= 0) continue;
//             cacheKeys.push(key);
//             if (data.hasOwnProperty(key)) {
//                 result = result.replace(new RegExp(partten, 'g'), data[key]);
//             }
//         }
//         return result;
//     } catch (error) {
//         console.error(error);
//     }
//     return '';
// }

// module.exports = charts;
var merge = _.merge;
var jsonp = __webpack_require__(/*! ./jsonp */ "./src/modules/old_concept/modules/jsonp.js");
var isProd = environment === 'production';
// var emchartscdn = isProd ? '//hqres.eastmoney.com/emcharts/v3/lts/emcharts.min.js' : '//hqres.eastmoney.com/emcharts/v3/lts/emcharts.min.js';
// var emchartscdn = '//emcharts.eastmoney.com/ec/3.11.6/emcharts.min.js';
var emchartscdn = '//emcharts.eastmoney.com/ec/3.16.1/emcharts.min.js';

// var emchartscdn = 'http://auth.eastmoney.com:8080/bundle/emcharts.js'
// var chartdataurl = '//pdfm.eastmoney.com/EM_UBG_PDTI_Fast/api/js?token=4f1862fc3b5e77c150a2b985b12db0fd';
// var changedataurl = '//nuyd.eastmoney.com/EM_UBG_PositionChangesInterface/api/js?style=top&js=([(x)])&ac=normal&check=itntcd';
var newsapiurl = isProd ? '//cmsdataapi.eastmoney.com/api/infomine' : '//cmsdataapi.test.emapd.com/api/infomine';
var exrightsurl = isProd ? '//push2.eastmoney.com/api/qt/stock/cqcx/get' : '//61.152.230.32:38618/api/qt/stock/cqcx/get';
var emcharts3 = window.emcharts3 || null;
var data = __webpack_require__(/*! ../../data */ "./src/modules/data/index.ts").default


function charts(type, args) {
    var self = this;
    var timer, chart;
    this.args = args;
    this.inited = false;
    this.datacache = false;
    this.chartType = type;
    this.load = function () {
        this.inited = false;
        this.stop().reload();
        return chart;
    }

    this.create = function () {
        return _init.apply(this, [type, emcharts3]);
    }

    this.reload = function () {
        _load.apply(this);

        if (this.args.update > 0) {
            timer = setInterval(function () {
                _load.apply(self);
            }, this.args.update);
        }
        return this;
    }

    this.stop = function () {
        clearInterval(timer);
        chart = null;
        return this;
    }

    function _load() {
        if (!chart) {
            chart = this.create();
            if (!this.inited) chart.start();
        }
        if (typeof this.dataloader === 'function') {
            this.dataloader.apply(this);
        } else chart.draw();
    }

    function _init(type, emcharts3) {
        switch (type) {
            case 'compatible':
                return pictureLoader.apply(this, [args]);
            case 'time':
                return timeLoader.apply(this, [args]);
            case 'k':
                return kLoader.apply(this, [args]);
            default:
                if (typeof emcharts3[type] === 'function') {
                    this.inited = true;
                    return new emcharts3[type](args);
                } else return null;
        }
    }
}

charts.preload = function (callback, error) { //异步加载
    if (typeof emcharts3 === 'function') {
        if (typeof callback === 'function') callback(emcharts3);
        return emcharts3;
    }
    try {
        var script = document.createElement('script');
        script.id = 'emcharts3-script';
        script.setAttribute('src', emchartscdn);
        if (typeof error === 'function')
            script.onerror = error;
        script.async = true;
        script.defer = true;
        script.onload = script.onreadystatechange = function (evt) {
            if (!script.readyState || /loaded|complete/.test(script.readyState)) {
                script.onload = script.onreadystatechange = null;
                emcharts3 = __webpack_require__(/*! emcharts3 */ "emcharts3");
                if (typeof callback === 'function') callback.call(emcharts3);
            }
        }
        document.getElementsByTagName("head")[0].appendChild(script);
    } catch (e) {
        console.error(e);
    }
}

/**
 * 分时图加载器
 * @param {*} args 分时图参数
 */
function timeLoader(args) {
    var self = this;
    var _opt = this.args = merge({
        entry: {},
        container: '#chart-container',
        width: 720,
        height: 600,
        type: 'r',
        iscr: false,
        iscca: args.isph,
        gridwh: {
            //height: 25,
            width: 720
        },
        padding: {
            top: 0,
            bottom: 5,
            right:70
        },
        color: {
            line: '#326fb2',
            fill: ['rgba(101,202,254, 0.2)', 'rgba(101,202,254, 0.1)'],
            dashedColorY: '#ddd'
        },
        data: {
            time: [],
            positionChanges: []
        },
        tip: {
            show: true,
            trading: true
        },
        show: {
            indicatorArea: true, // 分时指标
            CMA: true,
            ddx: false,
            cf: false
        },
        onClickChanges: function () {
            window.open('//quote.eastmoney.com/changes/stocks/' + args.entry.shortmarket + args.entry.code + '.html');
        },
        onComplete: function () {

        },
        onError: function (err) {
            console.error(err);
        },
        update: 40 * 1000
    }, args);
    var timer
    var chart = new emcharts3.time(_opt);
    // 加载数据
    this.dataloader = function () {
        if (!this.datacache) {
            this.datacache = {
                time: {},
                positionChanges: []
            };
        }

        var ispq = 0 //是否盘前
        var isph = 0 //是否盘后 
        if (args.iscr) {
            ispq = 1
        }
        if (args.isph) {
            ispq = 0
            isph = 1
        }
        var days = 1
        if(args.type == 't2') {
            days = 2
        }
        else if(args.type == 't3') {
            days = 3
        }
        else if(args.type == 't4') {
            days = 4
        }
        else if(args.type == 't5') {
            days = 5
        } 
        
        data.quote.time.getOldTimeDataFromNew(stockentry.mktnum + '.' + stockentry.code, days, ispq, isph).then(function(json){
           chart.stop();

            if (json == null) return false;
            self.datacache.time = json;
            self.datacache.datak = false;
            chart.setData(self.datacache);
            clearTimeout(timer);
            timer = setTimeout(function () {
                // 打点
                makepoints.apply(self, [chart, args, 'infomine']);
                // 盘口异动
                drawPositionChange();
            }, 500);
            // 分钟K线
            if (_opt.show && _opt.show.indicatorArea) {
                drawIndicators();
            }
            if (self.inited) chart.redraw();
            else {
                // console.info(chart)
                chart.draw();
                self.inited = true;
            }          
        })

        // jsonp(chartdataurl, {
        //     id: args.entry.id,
        //     type: args.type,
        //     iscr: args.iscr,
        //     rtntype: 5
        // }, 'cb', function (json) {
 
        // }, function (e) {
        //     console.error(e);
        // });


        // jsonp(chartdataurl, {
        //     id: args.entry.id,
        //     type: args.type,
        //     iscr: args.iscr,
        //     rtntype: 5
        // }, 'cb', function (json) {
        //     chart.stop();
        //     if (!json || json.stats === false) return false;
        //     json.info = {
        //         // c: "45.05",
        //         // h: "49.88",
        //         // l: "44.44",
        //         // o: "47.38",
        //         // a: "532876016",
        //         // v: "112827",
        //         yc: "48.77",
        //         // time: "2020-03-18 15:00:00",
        //         ticks: "34200|54000|1|34200|41400|46800|54000",
        //         total: "241",
        //         pricedigit: "0.00",
        //         // jys: "13",
        //         // Settlement: "-",
        //         // mk: 2,
        //         // sp: "19.01",
        //         // isrzrq: false
        //     }
        //     self.datacache.time = json;
        //     self.datacache.datak = false;
        //     chart.setData(self.datacache);
        //     clearTimeout(timer);
        //     timer = setTimeout(function () {
        //         // 打点
        //         makepoints.apply(self, [chart, args, 'infomine']);
        //         // 盘口异动
        //         drawPositionChange();
        //     }, 500);
        //     // 分钟K线
        //     if (_opt.show && _opt.show.indicatorArea) {
        //         drawIndicators();
        //     }
        //     if (self.inited) chart.redraw();
        //     else {
        //         chart.draw();
        //         self.inited = true;
        //     }
        // }, function (e) {
        //     console.error(e);
        // });
    }
    return chart;
    /**
     * 盘口异动
     */
    function drawPositionChange() {
        data.quote.pkyd.getOldDataFromNewOne(stockentry.mktnum + '.' + stockentry.code, args.entry.id).then(function(data){
            if (data.length == 0) return false;
            self.datacache.positionChanges = data;
            chart.setData(self.datacache);
            if (self.inited) chart.redraw();
            else chart.draw();
        })
        // jsonp(changedataurl, {
        //     id: args.entry.id,
        // }, 'cb', function (changes) {
        //     if (!changes) return false;
        //     if (typeof changes[0] !== 'string') return false;
        //     self.datacache.positionChanges = changes;
        //     console.info(self.datacache.positionChanges)
        //     chart.setData(self.datacache);
        //     if (self.inited) chart.redraw();
        //     else chart.draw();
        // }, function () {

        // });
    }

    /**
     * 分时指标
     */
    function drawIndicators() {
        // jsonp(chartdataurl, {
        //     rtntype: 5,
        //     id: args.entry.id,
        //     type: _opt.type + 'k',
        //     iscr: false
        // }, 'cb', function (datak) {
        //     if (!datak) return false;
        //     if (datak.stats != false) {
        //         self.datacache.datak = datak;
        //         chart.setData(self.datacache);
        //         if (self.inited) chart.redraw();
        //         else chart.draw();
        //     }
        // }, function () {

        // });

        var days = 1
        if(_opt.type == 't2') {
            days = 2
        }
        else if(_opt.type == 't3') {
            days = 3
        }
        else if(_opt.type == 't4') {
            days = 4
        }
        else if(_opt.type == 't5') {
            days = 5
        }        
        


        data.quote.time.getTimeData(stockentry.mktnum + '.' + stockentry.code, days).then(function(backdata){
            if (backdata == null || backdata.trends.length == 0) return false;

            var datak = {
                data: backdata.trends
            }

            self.datacache.datak = datak;
            chart.setData(self.datacache);
            if (self.inited) chart.redraw();
            else chart.draw();
       
        })

    }
}

/**
 * K图加载器
 * @param {*} args K图参数
 */
function kLoader(args) {
    var self = this;
    var timer, chart;
    var _opt = this.args = merge({
        entry: {},
        container: "#chart-container",
        width: 720,
        height: 600,
        padding: {
            top: 10,
            //right: 0,
            bottom: 0
        },
        kgap: {
            top: 18 + 9,
            bottom: 18 + 13
        },
        color: {
            border: '#eee'
        },
        show: {
            CMA: true,
            // 除权除息打点
            cqcx: true,
            //lr: args.type === 'k',
            lr: false,
            cf: false
        },
        scale: {
            pillar: 60,
            min: 10
        },
        popWin: {
            type: "move"
        },
        yAxisType: 1,
        maxin: {
            //show: true,
            lineWidth: 30, // 线长
            skewx: 0, // x偏移   
            skewy: 0, // y偏移
        },
        data: {
            k: []
        },
        onComplete: function () {

        },
        onDragEnd: function () {
            timer = setTimeout(function () {
                makepoints.apply(self, [chart, args, 'infomine']);
            }, 500);
        },
        onClick: function () { },
        onError: function (err) {
            console.error(err);
        },
        update: 60 * 1000
    }, args);
    chart = new emcharts3.k2(_opt);
    this.dataloader = function () {
        chart.stop(); // remove loading

        var ktype = 'dk'
        var fqtype = 'qfq'
        
        if(args.authorityType == ''){
            fqtype = 'bfq'
        }
        else if(args.authorityType == 'ba'){
            fqtype = 'hfq'
        }        

        if (args.type == 'wk') {
            ktype = 'wk'
        }
        else if (args.type == 'mk') {
            ktype = 'mk'
        }
        else if (args.type == 'm5k') {
            ktype = 'm5k'
        }
        else if (args.type == 'm15k') {
            ktype = 'm15k'
        }
        else if (args.type == 'm30k') {
            ktype = 'm30k'
        }
        else if (args.type == 'm60k') {
            ktype = 'm60k'
        }


        data.quote.k.getOldKDataFromNew(stockentry.mktnum + '.' + stockentry.code, fqtype, ktype).then(function(json){
            console.info(json)
            // chart.stop();
            if (!json || json.stats === false) return false;
            chart.setData({
                k: json
            }, _opt);
            if (self.inited) chart.redraw();
            else chart.draw();
            clearTimeout(timer)
            timer = setTimeout(function () {
                makepoints.apply(self, [chart, args]);
            }, 500);          
        })

        // jsonp(chartdataurl, {
        //     rtntype: 6,
        //     id: args.entry.id,
        //     type: args.type,
        //     authorityType: args.authorityType
        // }, 'cb', function (json) {
        //     console.info(json)

        // }, function (e) {

        // });

        // jsonp(chartdataurl, {
        //     rtntype: 6,
        //     id: args.entry.id,
        //     type: args.type,
        //     authorityType: args.authorityType
        // }, 'cb', function (json) {
        //     console.info(json)
        //     json.flow = []
        //     json.info = {}
        //     // chart.stop();
        //     if (!json || json.stats === false) return false;
        //     chart.setData({
        //         k: json
        //     }, _opt);
        //     if (self.inited) chart.redraw();
        //     else chart.draw();
        //     clearTimeout(timer)
        //     timer = setTimeout(function () {
        //         makepoints.apply(self, [chart, args]);
        //     }, 500);
        // }, function (e) {

        // });
    }
    return chart;
}


/**
 * 打点功能
 * @param {*} chart emchart
 * @param {*} args 参数
 * @param {string} type 打点类型
 */
function makepoints(chart, args, type) {
    var self = this;
    var displayInfomine = ['r', 't2', 't3', 't4', 't5', 'k', 'wk', 'mk'].indexOf(args.type) >= 0;
    var displayExrights = ['k', 'wk', 'mk'].indexOf(args.type) >= 0;
    var enabled = [];
    if (!type || ['all', '*'].indexOf(type) >= 0) {
        enabled.push('infomine', 'exrights');
    } else
        enabled.push(type);
    if (displayInfomine && enabled.indexOf('infomine') >= 0)
        newsnoticepoints.apply(this);
    if (displayExrights && enabled.indexOf('exrights') >= 0)
        exrightspoints.apply(this);

    /**
     * 新闻公告打点
     */
    function newsnoticepoints() {
        var istimechart = ['r', 't2', 't3', 't4', 't5'].indexOf(args.type) >= 0;
        var data = istimechart ? chart.getData() : chart.getData().data;
        if (data instanceof Array && data.length > 0) {
            // console.info(data)
            var starttime = data[0][0],
                endtime = data[data.length - 1][0];
            var param = {
                code: args.entry.code,
                marketType: args.entry.marketnum,
                types: '1,2',
                startTime: starttime,
                endTime: endtime,
                format: istimechart ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd'
            };
            jsonp(newsapiurl, param, 'cb', function (json) {
                if (json && json.Data instanceof Array) {
                    /** 
                     * @typedef {{type: string, url: string, title: string, date: string}} InfoMine
                     * @type {Array.<InfoMine>} 
                     */
                    var points = [];
                    for (var i = 0; i < json.Data.length; i++) {
                        /** @type {{Time: string, Type: number, Title: string, Url: string, Code: string}} */
                        var element = json.Data[i];
                        if (!element.Time) continue;
                        points.push({
                            type: makepoints.newsTypeMap[element.Type],
                            date: element.Time,
                            content: element.Title,
                            url: element.Url
                        });
                    }
                    var newstpl = '<a href="{{url}}" title="{{content}}" target="_blank">{{date}}&nbsp;{{type}}&nbsp;{{content}}</a>';
                    chart.setData({
                        dot: {
                            infomine: {
                                position: 'top',
                                width: 9,
                                height: 9,
                                className: 'icon-dl',
                                /**
                                 * @param {InfoMine} point
                                 */
                                formatter: function (point) {
                                    if (!point) return '';
                                    return simpleTemplate(newstpl, point);
                                },
                                multiple: {
                                    className: 'icon-dl2'
                                },
                                points: points
                            }
                        }
                    });
                    if (istimechart) chart.redraw();
                    else chart.draw();
                    //chart.redraw();
                }
            }, function (err) {
                console.error('新闻打点异常', err);
            });
        }
    }

    /**
     * 除权除息打点
     */
    function exrightspoints() {
        if (self.exrightsdata) {
            draw(self.exrightsdata);
        }
        if (!exrightsurl) return false;
        // type: 1（派现）2（送股，转增）4（拆细合并）8（配股，供股）16（增发）
        jsonp(exrightsurl, {
            id: (args.entry.marketnum == 1 ? 'SH' : 'SZ') + args.entry.code,
            ut: 'e1e6871893c6386c5ff6967026016627'
        }, 'cb', function (json) {
            if (!json) return false;
            if (json.rc === 0 && json.data) {
                self.exrightsdata = json.data.records;
                draw(json.data.records);
            }
        }, function (err) {
            console.error('除权除息打点异常', err);
        });

        function draw(data) {
            chart.setData({
                dot: {
                    exrights: {
                        position: 'bottom',
                        width: 7,
                        height: 13,
                        className: 'icon-exrights',
                        formatter: formatter,
                        points: data
                    }
                }
            });
            chart.draw();
        }

        /**
         * 格式化器
         * @param {object} point 除权除息数据
         * @param {string} point.date 日期
         * @param {number} point.type 1:派现,2:送股、转增,4:拆细、合并,8:配股、供股,16:增发
         * @param {number} point.pxbl 派现比例
         * @param {number} point.sgbl 送股（转增）比例
         * @param {number} point.cxbl 拆细比例
         * @param {number} point.pgbl 配股（供股）比例
         * @param {number} point.pgjg 配股（供股）价格
         * @param {number} point.zfbl 增发比例
         * @param {number} point.zfgs 增发股数（万股）
         * @param {number} point.zfjg 增发价格
         * @param {number} point.ggflag 为1表示外盘供股价格高于除净日前一日收盘价，此时不做前复权
         */
        function formatter(point) {
            var px = 1,
                sg = 2,
                pg = 8,
                zf = 16;
            if (!point || !point.date) return '';
            var data = merge({}, point);
            var result = '<p>' + data.date + '</p>';
            if ((data.type & px) === px) {
                data.name = '派息';
                data.pxbl = (data.pxbl * 10).toFixed(2);
                result += simpleTemplate('<p>{{name}}: 每10股派{{pxbl}}元</p>', data);
            }
            if ((data.type & sg) === sg) {
                data.name = '送股';
                data.sgbl = (data.sgbl * 10).toFixed(2);
                result += simpleTemplate('<p>{{name}}: 每10股送{{sgbl}}股</p>', data);
            }
            if ((data.type & pg) === pg) {
                data.name = '配股';
                data.pgbl = (data.pgbl * 10).toFixed(2);
                data.pgjg = data.pgjg.toFixed(2);
                result += simpleTemplate('<p>{{name}}: 每10股配{{pgbl}}股&nbsp;配股价格{{pgjg}}元</p>', data);
            }
            if ((data.type & zf) === zf) {
                data.name = '增发';
                data.zfgs = data.zfgs > 100 ? data.zfgs.toFixed(0) : data.zfgs;
                data.zfjg = data.zfjg.toFixed(2);
                result += simpleTemplate('<p>{{name}}: {{zfgs}}万股&nbsp;增发价格{{zfjg}}元</p>', data);
            }
            return result;
        }
    }
}

makepoints.newsTypeMap = {
    '1': '[新闻]',
    '2': '[公告]',
    '3': '[研报]'
};

/**
 * 模板处理器
 * @param {string} tpl 模板
 * @param {object} data 数据
 */
function simpleTemplate(tpl, data) {
    if (!data) return tpl;
    try {
        var result = tpl || '';
        var regex = new RegExp('{{(\\w+)}}', 'g');
        var matches, cacheKeys = [];
        while ((matches = regex.exec(tpl)) !== null) {
            var partten = matches[0],
                key = matches[1];
            if (cacheKeys.indexOf(key) >= 0) continue;
            cacheKeys.push(key);
            if (data.hasOwnProperty(key)) {
                result = result.replace(new RegExp(partten, 'g'), data[key]);
            }
        }
        return result;
    } catch (error) {
        console.error(error);
    }
    return '';
}

module.exports = charts;

/***/ }),

/***/ "./src/modules/old_concept/modules/template-web.js":
/*!*********************************************************!*\
  !*** ./src/modules/old_concept/modules/template-web.js ***!
  \*********************************************************/
/***/ (function(module) {

/*! art-template@4.12.2 for browser | https://github.com/aui/art-template */
!function(e,t){ true?module.exports=t():0}(this,function(){return function(e){function t(r){if(n[r])return n[r].exports;var i=n[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e["default"]}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=6)}([function(e,t,n){(function(t){e.exports=!1;try{e.exports="[object process]"===Object.prototype.toString.call(t.process)}catch(n){}}).call(t,n(4))},function(e,t,n){"use strict";var r=n(8),i=n(3),o=n(23),s=function(e,t){t.onerror(e,t);var n=function(){return"{Template Error}"};return n.mappings=[],n.sourcesContent=[],n},a=function c(e){var t=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{};"string"!=typeof e?t=e:t.source=e,t=i.$extend(t),e=t.source,!0===t.debug&&(t.cache=!1,t.minimize=!1,t.compileDebug=!0),t.compileDebug&&(t.minimize=!1),t.filename&&(t.filename=t.resolveFilename(t.filename,t));var n=t.filename,a=t.cache,u=t.caches;if(a&&n){var p=u.get(n);if(p)return p}if(!e)try{e=t.loader(n,t),t.source=e}catch(d){var l=new o({name:"CompileError",path:n,message:"template not found: "+d.message,stack:d.stack});if(t.bail)throw l;return s(l,t)}var f=void 0,h=new r(t);try{f=h.build()}catch(l){if(l=new o(l),t.bail)throw l;return s(l,t)}var m=function(e,n){try{return f(e,n)}catch(l){if(!t.compileDebug)return t.cache=!1,t.compileDebug=!0,c(t)(e,n);if(l=new o(l),t.bail)throw l;return s(l,t)()}};return m.mappings=f.mappings,m.sourcesContent=f.sourcesContent,m.toString=function(){return f.toString()},a&&n&&u.set(n,m),m};a.Compiler=r,e.exports=a},function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=/((['"])(?:(?!\2|\\).|\\(?:\r\n|[\s\S]))*(\2)?|`(?:[^`\\$]|\\[\s\S]|\$(?!\{)|\$\{(?:[^{}]|\{[^}]*\}?)*\}?)*(`)?)|(\/\/.*)|(\/\*(?:[^*]|\*(?!\/))*(\*\/)?)|(\/(?!\*)(?:\[(?:(?![\]\\]).|\\.)*\]|(?![\/\]\\]).|\\.)+\/(?:(?!\s*(?:\b|[\u0080-\uFFFF$\\'"~({]|[+\-!](?!=)|\.?\d))|[gmiyu]{1,5}\b(?![\u0080-\uFFFF$\\]|\s*(?:[+\-*%&|^<>!=?({]|\/(?![\/*])))))|(0[xX][\da-fA-F]+|0[oO][0-7]+|0[bB][01]+|(?:\d*\.\d+|\d+\.?)(?:[eE][+-]?\d+)?)|((?!\d)(?:(?!\s)[$\w\u0080-\uFFFF]|\\u[\da-fA-F]{4}|\\u\{[\da-fA-F]+\})+)|(--|\+\+|&&|\|\||=>|\.{3}|(?:[+\-\/%&|^]|\*{1,2}|<{1,2}|>{1,3}|!=?|={1,2})=?|[?~.,:;[\](){}])|(\s+)|(^$|[\s\S])/g,t.matchToToken=function(e){var t={type:"invalid",value:e[0]};return e[1]?(t.type="string",t.closed=!(!e[3]&&!e[4])):e[5]?t.type="comment":e[6]?(t.type="comment",t.closed=!!e[7]):e[8]?t.type="regex":e[9]?t.type="number":e[10]?t.type="name":e[11]?t.type="punctuator":e[12]&&(t.type="whitespace"),t}},function(e,t,n){"use strict";function r(){this.$extend=function(e){return e=e||{},s(e,e instanceof r?e:this)}}var i=n(0),o=n(12),s=n(13),a=n(14),c=n(15),u=n(16),p=n(17),l=n(18),f=n(19),h=n(20),m=n(22),d={source:null,filename:null,rules:[f,l],escape:!0,debug:!!i&&"production"!=="development",bail:!0,cache:!0,minimize:!0,compileDebug:!1,resolveFilename:m,include:a,htmlMinifier:h,htmlMinifierOptions:{collapseWhitespace:!0,minifyCSS:!0,minifyJS:!0,ignoreCustomFragments:[]},onerror:c,loader:p,caches:u,root:"/",extname:".art",ignore:[],imports:o};r.prototype=d,e.exports=new r},function(e,t){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(r){"object"==typeof window&&(n=window)}e.exports=n},function(e,t){},function(e,t,n){"use strict";var r=n(7),i=n(1),o=n(24),s=function(e,t){return t instanceof Object?r({filename:e},t):i({filename:e,source:t})};s.render=r,s.compile=i,s.defaults=o,e.exports=s},function(e,t,n){"use strict";var r=n(1),i=function(e,t,n){return r(e,n)(t)};e.exports=i},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var i=n(9),o=n(11),s="$data",a="$imports",c="print",u="include",p="extend",l="block",f="$$out",h="$$line",m="$$blocks",d="$$slice",v="$$from",g="$$options",y=function(e,t){return Object.hasOwnProperty.call(e,t)},b=JSON.stringify,x=function(){function e(t){var n,i,y=this;r(this,e);var b=t.source,x=t.minimize,w=t.htmlMinifier;if(this.options=t,this.stacks=[],this.context=[],this.scripts=[],this.CONTEXT_MAP={},this.ignore=[s,a,g].concat(t.ignore),this.internal=(n={},n[f]="''",n[h]="[0,0]",n[m]="arguments[1]||{}",n[v]="null",n[c]="function(){var s=''.concat.apply('',arguments);"+f+"+=s;return s}",n[u]="function(src,data){var s="+g+".include(src,data||"+s+",arguments[2]||"+m+","+g+");"+f+"+=s;return s}",n[p]="function(from){"+v+"=from}",n[d]="function(c,p,s){p="+f+";"+f+"='';c();s="+f+";"+f+"=p+s;return s}",n[l]="function(){var a=arguments,s;if(typeof a[0]==='function'){return "+d+"(a[0])}else if("+v+"){if(!"+m+"[a[0]]){"+m+"[a[0]]="+d+"(a[1])}else{"+f+"+="+m+"[a[0]]}}else{s="+m+"[a[0]];if(typeof s==='string'){"+f+"+=s}else{s="+d+"(a[1])}return s}}",n),this.dependencies=(i={},i[c]=[f],i[u]=[f,g,s,m],i[p]=[v,u],i[l]=[d,v,f,m],i),this.importContext(f),t.compileDebug&&this.importContext(h),x)try{b=w(b,t)}catch(E){}this.source=b,this.getTplTokens(b,t.rules,this).forEach(function(e){e.type===o.TYPE_STRING?y.parseString(e):y.parseExpression(e)})}return e.prototype.getTplTokens=function(){return o.apply(undefined,arguments)},e.prototype.getEsTokens=function(e){return i(e)},e.prototype.getVariables=function(e){var t=!1;return e.filter(function(e){return"whitespace"!==e.type&&"comment"!==e.type}).filter(function(e){return"name"===e.type&&!t||(t="punctuator"===e.type&&"."===e.value,!1)}).map(function(e){return e.value})},e.prototype.importContext=function(e){var t=this,n="",r=this.internal,i=this.dependencies,o=this.ignore,c=this.context,u=this.options,p=u.imports,l=this.CONTEXT_MAP;y(l,e)||-1!==o.indexOf(e)||(y(r,e)?(n=r[e],y(i,e)&&i[e].forEach(function(e){return t.importContext(e)})):n="$escape"===e||"$each"===e||y(p,e)?a+"."+e:s+"."+e,l[e]=n,c.push({name:e,value:n}))},e.prototype.parseString=function(e){var t=e.value;if(t){var n=f+"+="+b(t);this.scripts.push({source:t,tplToken:e,code:n})}},e.prototype.parseExpression=function(e){var t=this,n=e.value,r=e.script,i=r.output,s=this.options.escape,a=r.code;i&&(a=!1===s||i===o.TYPE_RAW?f+"+="+r.code:f+"+=$escape("+r.code+")");var c=this.getEsTokens(a);this.getVariables(c).forEach(function(e){return t.importContext(e)}),this.scripts.push({source:n,tplToken:e,code:a})},e.prototype.checkExpression=function(e){for(var t=[[/^\s*}[\w\W]*?{?[\s;]*$/,""],[/(^[\w\W]*?\([\w\W]*?(?:=>|\([\w\W]*?\))\s*{[\s;]*$)/,"$1})"],[/(^[\w\W]*?\([\w\W]*?\)\s*{[\s;]*$)/,"$1}"]],n=0;n<t.length;){if(t[n][0].test(e)){var r;e=(r=e).replace.apply(r,t[n]);break}n++}try{return new Function(e),!0}catch(i){return!1}},e.prototype.build=function(){var e=this.options,t=this.context,n=this.scripts,r=this.stacks,i=this.source,c=e.filename,l=e.imports,d=[],x=y(this.CONTEXT_MAP,p),w=0,E=function(e,t){var n=t.line,i=t.start,o={generated:{line:r.length+w+1,column:1},original:{line:n+1,column:i+1}};return w+=e.split(/\n/).length-1,o},k=function(e){return e.replace(/^[\t ]+|[\t ]$/g,"")};r.push("function("+s+"){"),r.push("'use strict'"),r.push(s+"="+s+"||{}"),r.push("var "+t.map(function(e){return e.name+"="+e.value}).join(",")),e.compileDebug?(r.push("try{"),n.forEach(function(e){e.tplToken.type===o.TYPE_EXPRESSION&&r.push(h+"=["+[e.tplToken.line,e.tplToken.start].join(",")+"]"),d.push(E(e.code,e.tplToken)),r.push(k(e.code))}),r.push("}catch(error){"),r.push("throw {"+["name:'RuntimeError'","path:"+b(c),"message:error.message","line:"+h+"[0]+1","column:"+h+"[1]+1","source:"+b(i),"stack:error.stack"].join(",")+"}"),r.push("}")):n.forEach(function(e){d.push(E(e.code,e.tplToken)),r.push(k(e.code))}),x&&(r.push(f+"=''"),r.push(u+"("+v+","+s+","+m+")")),r.push("return "+f),r.push("}");var T=r.join("\n");try{var O=new Function(a,g,"return "+T)(l,e);return O.mappings=d,O.sourcesContent=[i],O}catch(F){for(var $=0,j=0,S=0,_=void 0;$<n.length;){var C=n[$];if(!this.checkExpression(C.code)){j=C.tplToken.line,S=C.tplToken.start,_=C.code;break}$++}throw{name:"CompileError",path:c,message:F.message,line:j+1,column:S+1,source:i,generated:_,stack:F.stack}}},e}();x.CONSTS={DATA:s,IMPORTS:a,PRINT:c,INCLUDE:u,EXTEND:p,BLOCK:l,OPTIONS:g,OUT:f,LINE:h,BLOCKS:m,SLICE:d,FROM:v,ESCAPE:"$escape",EACH:"$each"},e.exports=x},function(e,t,n){"use strict";var r=n(10),i=n(2)["default"],o=n(2).matchToToken,s=function(e){return e.match(i).map(function(e){return i.lastIndex=0,o(i.exec(e))}).map(function(e){return"name"===e.type&&r(e.value)&&(e.type="keyword"),e})};e.exports=s},function(e,t,n){"use strict";var r={"abstract":!0,await:!0,"boolean":!0,"break":!0,"byte":!0,"case":!0,"catch":!0,"char":!0,"class":!0,"const":!0,"continue":!0,"debugger":!0,"default":!0,"delete":!0,"do":!0,"double":!0,"else":!0,"enum":!0,"export":!0,"extends":!0,"false":!0,"final":!0,"finally":!0,"float":!0,"for":!0,"function":!0,"goto":!0,"if":!0,"implements":!0,"import":!0,"in":!0,"instanceof":!0,"int":!0,"interface":!0,"let":!0,"long":!0,"native":!0,"new":!0,"null":!0,"package":!0,"private":!0,"protected":!0,"public":!0,"return":!0,"short":!0,"static":!0,"super":!0,"switch":!0,"synchronized":!0,"this":!0,"throw":!0,"transient":!0,"true":!0,"try":!0,"typeof":!0,"var":!0,"void":!0,"volatile":!0,"while":!0,"with":!0,"yield":!0};e.exports=function(e){return r.hasOwnProperty(e)}},function(e,t,n){"use strict";function r(e,t,n,r){var i=new String(e);return i.line=t,i.start=n,i.end=r,i}var i=function(e,t){for(var n=arguments.length>2&&arguments[2]!==undefined?arguments[2]:{},i=[{type:"string",value:e,line:0,start:0,end:e.length}],o=0;o<t.length;o++)!function(e){for(var t=e.test.ignoreCase?"ig":"g",o=e.test.source+"|^$|[\\w\\W]",s=new RegExp(o,t),a=0;a<i.length;a++)if("string"===i[a].type){for(var c=i[a].line,u=i[a].start,p=i[a].end,l=i[a].value.match(s),f=[],h=0;h<l.length;h++){var m=l[h];e.test.lastIndex=0;var d=e.test.exec(m),v=d?"expression":"string",g=f[f.length-1],y=g||i[a],b=y.value;u=y.line===c?g?g.end:u:b.length-b.lastIndexOf("\n")-1,p=u+m.length;var x={type:v,value:m,line:c,start:u,end:p};if("string"===v)g&&"string"===g.type?(g.value+=m,g.end+=m.length):f.push(x);else{d[0]=new r(d[0],c,u,p);var w=e.use.apply(n,d);x.script=w,f.push(x)}c+=m.split(/\n/).length-1}i.splice.apply(i,[a,1].concat(f)),a+=f.length-1}}(t[o]);return i};i.TYPE_STRING="string",i.TYPE_EXPRESSION="expression",i.TYPE_RAW="raw",i.TYPE_ESCAPE="escape",e.exports=i},function(e,t,n){"use strict";(function(t){function r(e){return"string"!=typeof e&&(e=e===undefined||null===e?"":"function"==typeof e?r(e.call(e)):JSON.stringify(e)),e}function i(e){var t=""+e,n=a.exec(t);if(!n)return e;var r="",i=void 0,o=void 0,s=void 0;for(i=n.index,o=0;i<t.length;i++){switch(t.charCodeAt(i)){case 34:s="&#34;";break;case 38:s="&#38;";break;case 39:s="&#39;";break;case 60:s="&#60;";break;case 62:s="&#62;";break;default:continue}o!==i&&(r+=t.substring(o,i)),o=i+1,r+=s}return o!==i?r+t.substring(o,i):r}/*! art-template@runtime | https://github.com/aui/art-template */
var o=n(0),s=Object.create(o?t:window),a=/["&'<>]/;s.$escape=function(e){return i(r(e))},s.$each=function(e,t){if(Array.isArray(e))for(var n=0,r=e.length;n<r;n++)t(e[n],n);else for(var i in e)t(e[i],i)},e.exports=s}).call(t,n(4))},function(e,t,n){"use strict";var r=Object.prototype.toString,i=function(e){return null===e?"Null":r.call(e).slice(8,-1)},o=function s(e,t){var n=void 0,r=i(e);if("Object"===r?n=Object.create(t||{}):"Array"===r&&(n=[].concat(t||[])),n){for(var o in e)Object.hasOwnProperty.call(e,o)&&(n[o]=s(e[o],n[o]));return n}return e};e.exports=o},function(e,t,n){"use strict";var r=function(e,t,r,i){var o=n(1);return i=i.$extend({filename:i.resolveFilename(e,i),bail:!0,source:null}),o(i)(t,r)};e.exports=r},function(e,t,n){"use strict";var r=function(e){console.error(e.name,e.message)};e.exports=r},function(e,t,n){"use strict";var r={__data:Object.create(null),set:function(e,t){this.__data[e]=t},get:function(e){return this.__data[e]},reset:function(){this.__data={}}};e.exports=r},function(e,t,n){"use strict";var r=n(0),i=function(e){if(r){return n(5).readFileSync(e,"utf8")}var t=document.getElementById(e);return t.value||t.innerHTML};e.exports=i},function(e,t,n){"use strict";var r={test:/{{([@#]?)[ \t]*(\/?)([\w\W]*?)[ \t]*}}/,use:function(e,t,n,i){var o=this,s=o.options,a=o.getEsTokens(i),c=a.map(function(e){return e.value}),u={},p=void 0,l=!!t&&"raw",f=n+c.shift(),h=function(t,n){console.warn((s.filename||"anonymous")+":"+(e.line+1)+":"+(e.start+1)+"\nTemplate upgrade: {{"+t+"}} -> {{"+n+"}}")};switch("#"===t&&h("#value","@value"),f){case"set":i="var "+c.join("").trim();break;case"if":i="if("+c.join("").trim()+"){";break;case"else":var m=c.indexOf("if");~m?(c.splice(0,m+1),i="}else if("+c.join("").trim()+"){"):i="}else{";break;case"/if":i="}";break;case"each":p=r._split(a),p.shift(),"as"===p[1]&&(h("each object as value index","each object value index"),p.splice(1,1));i="$each("+(p[0]||"$data")+",function("+(p[1]||"$value")+","+(p[2]||"$index")+"){";break;case"/each":i="})";break;case"block":p=r._split(a),p.shift(),i="block("+p.join(",").trim()+",function(){";break;case"/block":i="})";break;case"echo":f="print",h("echo value","value");case"print":case"include":case"extend":if(0!==c.join("").trim().indexOf("(")){p=r._split(a),p.shift(),i=f+"("+p.join(",")+")";break}default:if(~c.indexOf("|")){var d=a.reduce(function(e,t){var n=t.value,r=t.type;return"|"===n?e.push([]):"whitespace"!==r&&"comment"!==r&&(e.length||e.push([]),":"===n&&1===e[e.length-1].length?h("value | filter: argv","value | filter argv"):e[e.length-1].push(t)),e},[]).map(function(e){return r._split(e)});i=d.reduce(function(e,t){var n=t.shift();return t.unshift(e),"$imports."+n+"("+t.join(",")+")"},d.shift().join(" ").trim())}l=l||"escape"}return u.code=i,u.output=l,u},_split:function(e){e=e.filter(function(e){var t=e.type;return"whitespace"!==t&&"comment"!==t});for(var t=0,n=e.shift(),r=/\]|\)/,i=[[n]];t<e.length;){var o=e[t];"punctuator"===o.type||"punctuator"===n.type&&!r.test(n.value)?i[i.length-1].push(o):i.push([o]),n=o,t++}return i.map(function(e){return e.map(function(e){return e.value}).join("")})}};e.exports=r},function(e,t,n){"use strict";var r={test:/<%(#?)((?:==|=#|[=-])?)[ \t]*([\w\W]*?)[ \t]*(-?)%>/,use:function(e,t,n,r){return n={"-":"raw","=":"escape","":!1,"==":"raw","=#":"raw"}[n],t&&(r="/*"+r+"*/",n=!1),{code:r,output:n}}};e.exports=r},function(e,t,n){"use strict";var r=n(0),i=function(e,t){if(r){var i,o=n(21).minify,s=t.htmlMinifierOptions,a=t.rules.map(function(e){return e.test});(i=s.ignoreCustomFragments).push.apply(i,a),e=o(e,s)}return e};e.exports=i},function(e,t){!function(e){e.noop=function(){}}("object"==typeof e&&"object"==typeof e.exports?e.exports:window)},function(e,t,n){"use strict";var r=n(0),i=/^\.+\//,o=function(e,t){if(r){var o=n(5),s=t.root,a=t.extname;if(i.test(e)){var c=t.filename,u=!c||e===c,p=u?s:o.dirname(c);e=o.resolve(p,e)}else e=o.resolve(s,e);o.extname(e)||(e+=a)}return e};e.exports=o},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function o(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function s(e){var t=e.name,n=e.source,r=e.path,i=e.line,o=e.column,s=e.generated,a=e.message;if(!n)return a;var c=n.split(/\n/),u=Math.max(i-3,0),p=Math.min(c.length,i+3),l=c.slice(u,p).map(function(e,t){var n=t+u+1;return(n===i?" >> ":"    ")+n+"| "+e}).join("\n");return(r||"anonymous")+":"+i+":"+o+"\n"+l+"\n\n"+t+": "+a+(s?"\n   generated: "+s:"")}var a=function(e){function t(n){r(this,t);var o=i(this,e.call(this,n.message));return o.name="TemplateError",o.message=s(n),Error.captureStackTrace&&Error.captureStackTrace(o,o.constructor),o}return o(t,e),t}(Error);e.exports=a},function(e,t,n){"use strict";e.exports=n(3)}])});

/***/ }),

/***/ "./src/modules/old_concept/modules/user/getuid.js":
/*!********************************************************!*\
  !*** ./src/modules/old_concept/modules/user/getuid.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/**
 * 登录用户获取uid,未登录用户获取指纹
 */

var user = __webpack_require__(/*! ./index */ "./src/modules/old_concept/modules/user/index.js")
var fingerprint = __webpack_require__(/*! ../browser_fingerprint */ "./src/modules/old_concept/modules/browser_fingerprint/index.js")
var jpromise = __webpack_require__(/*! ../polyfills/jpromise */ "./src/modules/old_concept/modules/polyfills/jpromise.js")

module.exports = {
  get: function(){
      return jpromise(function(resolve, reject){
      if (user.get() != null) {
        resolve(user.get().id)
        return
      }
      
      fingerprint.get(function(zw){
        resolve(zw)
      })
    })
  }
}

/***/ }),

/***/ "./src/modules/old_concept/modules/user/index.js":
/*!*******************************************************!*\
  !*** ./src/modules/old_concept/modules/user/index.js ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/**
 * 用户信息
 */

var cookie = __webpack_require__(/*! ../utils.cookie */ "./src/modules/old_concept/modules/utils.cookie.js");

/**
 * 用户
 */
var user = {
    /**
     * 获取用户信息
     */
    get: function(){
        if (cookie('ut') && cookie('ct') && cookie('uidal')) {
            
            //获取加v信息
            var jiav = {vtype:null, state: null, name: ''};
            if (cookie('vtpst') && cookie('vtpst') != '|') {
                var jiavarr = cookie('vtpst').split('|');
                if( jiavarr.length > 1 ){
                    //console.info(typeof jiavarr[0]);
                    if (jiavarr[1] == "0" || jiavarr[1] == "3") {
                        switch (jiavarr[0]) {
                            case "301":
                                jiav.vtype = 1;
                                jiav.name = '理财师';
                                break;
                            case "302":
                                jiav.vtype = 2;
                                jiav.name = '非理财师';
                                break;
                            case "303":
                                jiav.vtype = 3;
                                jiav.name = '企业';
                                break;
                            default:
                                break;
                        }
                    }

                    switch (jiavarr[1]) {
                        case "0":
                            jiav.state = 0; //审核通过
                            break;                        
                        case "1":
                            jiav.state = 11; //审核未通过
                            break;
                        case "2":
                            jiav.state = 12; //审核中
                            break;
                        case "3":
                            jiav.state = 13; //加v用户修改审核
                            break;
                        case "8":
                            jiav.state = 18; //加v用户修改审核
                            break;
                        case "9":
                            jiav.state = 19; //加v用户修改审核
                            break;
                        default:
                            break;
                    }
                    
                    //console.info(jiav);

                }
            }
            
            return {
              id: cookie('uidal').substring(0,16),
              nick: cookie('uidal').substring(16),
              jiav: jiav
            };
        }
        return null; 
    },
    /**
     * 退出登录
     * @param  {function} 退出之后回调
     */
    logOut: function (callback) {
        var date = new Date();
        document.cookie = "pi=;path=/;domain=eastmoney.com;expires=" + date.toGMTString();
        document.cookie = "ct=;path=/;domain=eastmoney.com;expires=" + date.toGMTString();
        document.cookie = "ut=;path=/;domain=eastmoney.com;expires=" + date.toGMTString();
        document.cookie = "uidal=;path=/;domain=eastmoney.com;expires=" + date.toGMTString();
        if (callback) {
            callback();
        }
    },
    isLogin: function (){
        if( this.get() ){
            return true;
        }
        else{
            return false;
        }
    }
};

module.exports = user;





/***/ }),

/***/ "./src/modules/old_concept/modules/utils.cache.js":
/*!********************************************************!*\
  !*** ./src/modules/old_concept/modules/utils.cache.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var utils = __webpack_require__(/*! ./utils.extend */ "./src/modules/old_concept/modules/utils.extend.js");
// /**
//  * 对象缓存容器
//  * @param {object} obj 缓存对象
//  */
function ObjectCache(obj) {
    if (obj) utils.extend(this, obj, false);
    this.getOrAdd = function (key, val) {
        if (typeof this[key] === "undefined") {
            this[key] = val;
        }
        return this[key];
    };
    this.set = function (key, val) {
        if (typeof val !== "undefined") {
            this[key] = val;
        }
        return this[key];
    };
    this.remove = function (key) {
        var value = this[key];
        try {
            delete this[key];
        } catch (e) {
            this[key] = undefined;
        }
        return value;
    };
    this.clear = function () {
        for (var key in this) {
            if (this.hasOwnProperty(key)) {
                this.remove(key);
            }
        }
    }
}
ObjectCache.default = new ObjectCache();

module.exports = ObjectCache;

/***/ }),

/***/ "./src/modules/old_concept/modules/utils.cookie.js":
/*!*********************************************************!*\
  !*** ./src/modules/old_concept/modules/utils.cookie.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var utils = __webpack_require__(/*! ./utils.extend */ "./src/modules/old_concept/modules/utils.extend.js");

var pluses = /\+/g;

function encode(s) {
	return _cookie.raw ? s : encodeURIComponent(s);
}

function decode(s) {
	return _cookie.raw ? s : decodeURIComponent(s);
}

function stringifyCookieValue(value) {
	return encode(_cookie.json ? JSON.stringify(value) : String(value));
}

function parseCookieValue(s) {
	if (s.indexOf('"') === 0) {
		// This is a quoted cookie as according to RFC2068, unescape...
		s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
	}

	try {
		// Replace server-side written pluses with spaces.
		// If we can't decode the cookie, ignore it, it's unusable.
		// If we can't parse the cookie, ignore it, it's unusable.
		s = decodeURIComponent(s.replace(pluses, ' '));
		return _cookie.json ? JSON.parse(s) : s;
	} catch (e) {}
}

function read(s, converter) {
	var value = _cookie.raw ? s : parseCookieValue(s);
	return typeof converter === 'function' ? converter(value) : value;
}

function _cookie(key, value, options) {

	// Write

	if (value !== undefined && typeof value !== 'function') {
		options = utils.extend(utils.clone(_cookie.defaults || {}, true), options);

		if (typeof options.expires === 'number') {
			var days = options.expires,
				t = options.expires = new Date();
			t.setTime(+t + days * 864e+5);
		}

		return (document.cookie = [
			encode(key), '=', stringifyCookieValue(value),
			options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
			options.path ? '; path=' + options.path : '',
			options.domain ? '; domain=' + options.domain : '',
			options.secure ? '; secure' : ''
		].join(''));
	}

	// Read

	var result = key ? undefined : {};

	// To prevent the for loop in the first place assign an empty array
	// in case there are no cookies at all. Also prevents odd result when
	// calling cookie().
	var cookies = document.cookie ? document.cookie.split('; ') : [];

	for (var i = 0, l = cookies.length; i < l; i++) {
		var parts = cookies[i].split('=');
		var name = decode(parts.shift());
		var cookie = parts.join('=');

		if (key && key === name) {
			// If second argument (value) is a function it's a converter...
			result = read(cookie, value);
			break;
		}

		// Prevent storing a cookie that we couldn't decode.
		if (!key && (cookie = read(cookie)) !== undefined) {
			result[name] = cookie;
		}
	}

	return result;
};

_cookie.defaults = {};

_cookie.remove = function (key, options) {
	if (_cookie(key) === undefined) {
		return false;
	}

	// Must not alter options, thus extending a fresh object...
	_cookie(key, '', utils.extend(options || {}, {
		expires: -1
	}));
	return !_cookie(key);
};

_cookie.hasOwnProperty = function (key) {
	return (new RegExp("(?:^|;\\s*)" + escape(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
}

_cookie.key = function (n) {
	return unescape(document.cookie.replace(/\s*\=(?:.(?!;))*$/, "").split(/\s*\=(?:[^;](?!;))*[^;]?;\s*/)[n]);
}

module.exports = _cookie;

/***/ }),

/***/ "./src/modules/old_concept/modules/utils.extend.js":
/*!*********************************************************!*\
  !*** ./src/modules/old_concept/modules/utils.extend.js ***!
  \*********************************************************/
/***/ (function(module) {

module.exports = {
    extend: extend,
    clone: clone
}

/**
 * 扩展方法
 * @param {Object} target 目标对象。 
 * @param {Object} source 源对象。 
 * @param {boolean} deep 是否复制(继承)对象中的对象。 
 * @returns {Object} 返回继承了source对象属性的新对象。 
 */
function extend(target, /*optional*/ source, /*optional*/ deep) {
    target = target || {};
    var sType = typeof source,
        i = 1,
        options;
    if (sType === 'undefined' || sType === 'boolean') {
        deep = sType === 'boolean' ? source : false;
        source = target;
        target = this;
    }
    if (typeof source !== 'object' && Object.prototype.toString.call(source) !== '[object Function]')
        source = {};
    while (i <= 2) {
        options = i === 1 ? target : source;
        if (options != null) {
            for (var name in options) {
                var src = target[name],
                    copy = options[name];
                if (target === copy)
                    continue;
                if (deep && copy && typeof copy === 'object' && !copy.nodeType)
                    target[name] = extend(src || (copy.length != null ? [] : {}), copy, deep);
                else if (copy !== undefined)
                    target[name] = copy;
            }
        }
        i++;
    }
    return target;
}

/**
 * 克隆指定对象
 * @param {*} obj 对象
 * @param {boolen} deep  是否复制(继承)对象中的对象。 
 */
function clone(obj, deep) {
    var buf;
    if (typeof deep !== 'boolean') deep = true;
    if (obj instanceof Array) {
        buf = [];
        var i = obj.length;
        while (i--) {
            buf[i] = deep ? clone(obj[i]) : obj[i];
        }
    } else if (obj instanceof Object) {
        buf = {};
        for (var k in obj) {
            buf[k] = deep ? clone(obj[k]) : obj[k];
        }
    } else {
        buf = obj;
    }
    return buf;
}

/***/ }),

/***/ "./src/modules/old_concept/modules/utils.js":
/*!**************************************************!*\
  !*** ./src/modules/old_concept/modules/utils.js ***!
  \**************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var extend_utils = __webpack_require__(/*! ./utils.extend */ "./src/modules/old_concept/modules/utils.extend.js");
var cache_utils = __webpack_require__(/*! ./utils.cache */ "./src/modules/old_concept/modules/utils.cache.js");
var extend = extend_utils.extend;
module.exports = {
    extend: extend_utils.extend,
    clone: extend_utils.clone,
    isDOM: isDOM,
    ObjectCache: cache_utils,
    formatDate: formatDate,
    getQueryString: getQueryString,
    urlResolver: urlResolver,
    parseQuery: parseQuery,
    cutstr: cutstr,
    getMarketCode: getMarketCode,
    getColor: getColor,
    fixMarket: fixMarket,
    numbericFormat: numbericFormat,
    blinker: blinker,
    addPercent: addPercent,
    toPercent:toPercent,
    toFixedFun: toFixedFun,
    formatHqData:formatHqData,
    bigPriceFun: bigPriceFun
};


/** 
 * js截取字符串，中英文都能用 
 * @param {string} str: 需要截取的字符串 
 * @param {number} len: 需要截取的长度
 * @param {string} ellipsis: 溢出文字
 * @returns {string} 截取后的字符串
 */
function cutstr(str, len, ellipsis) {
    if (typeof ellipsis != "string") ellipsis = "...";
    var str_length = 0;
    var str_len = 0;
    str_cut = new String();
    for (var i = 0; i < str.length; i++) {
        a = str.charAt(i);
        str_length++;
        if (escape(a).length > 4) {
            //中文字符的长度经编码之后大于4  
            str_length++;
        }
        //str_cut = str_cut.concat(a);
        if (str_length <= len) {
            str_len++;
        }
    }
    //如果给定字符串小于指定长度，则返回源字符串；  
    if (str_length <= len) {
        return str.toString();
    } else {
        return str.substr(0, str_len).concat(ellipsis);
    }
}

/**
 * 格式化时间
 * @param {String|Date} date 时间
 * @param {string} fmt 时间格式
 * @param {string} dft 默认值
 * @returns {string} 格式化时间
 */
function formatDate(date, fmt, dft) {
    fmt = fmt || "yyyy-MM-dd HH:mm:ss"
    if (typeof date === "string")
        date = new Date(date.replace(/-/g, '/').replace('T', ' ').split('+')[0]);
    if (isNaN(date.getTime())) return dft || '';
    var o = {
        "M+": date.getMonth() + 1, //月份         
        "d+": date.getDate(), //日         
        "h+": date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, //小时         
        "H+": date.getHours(), //小时         
        "m+": date.getMinutes(), //分         
        "s+": date.getSeconds(), //秒         
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度         
        "S": date.getMilliseconds() //毫秒         
    };
    var week = {
        "0": "\u65e5",
        "1": "\u4e00",
        "2": "\u4e8c",
        "3": "\u4e09",
        "4": "\u56db",
        "5": "\u4e94",
        "6": "\u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[date.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

/**
 *行情push2接口，时间格式化
 *
 * @param {string} date YYYYMMDD格式
 * @param {string} fmt 时间分隔符
 * @returns
 */
function formatHqData(date,fmt){
    try {
        date = date.toString();
        if(!date || date.length != 8){
            return "-"
        }
        fmt = fmt || "-";//分隔符
       
        return date.substring(0,4) + fmt + date.substring(4,6) + fmt + date.substring(6,8);
    } catch (error) {
        return "-"
    }
    
}

/**
 * 添加百分号
 * 
 */
function addPercent(vs) {
    var num = parseFloat(vs), item;
    if (num == 0) {
        item = num.toFixed(2) + "%";
    } else if (num) {
        item = num.toFixed(2) + "%";
    } else {
        item = vs;
    }   
    return item
}


/**
 *换算成百分比
 *
 * @param {number} data 数据
 * @param {number} num 保留小位数
 * @returns
 */
function toPercent(data, num){
    if (data === '-' || isNaN(parseInt(data))) {
        return '-';
    }
    num = isNaN(parseInt(num)) ? 2 : parseInt(num);
    return !isNaN(parseFloat(data)) ? parseFloat(data).toFixed(num) + '%' : '-';
}


/**
 * 大额现价处理
 * 
 */
function bigPriceFun(vs) {
    var num = parseFloat(vs), item;
    if (num >= 0) {
        if (num >= 10000) {
            item = (num / 10000).toFixed(2) + "万"
        } else {
            item = num.toFixed(2);
        }
    } else {
        item = vs
    } 
    return item;
   
}

/**
 * 保留两位小数
 * 
 */
function toFixedFun(vs, tfx) {
    var num = parseFloat(vs), item = "-";
    var tofixed = tfx ? tfx : 2;
    if (num >= 0 || num <= 0) {
        item = num.toFixed(tofixed);
    }
    return item;
}


/**
 * 获取链接地址中的参数
 * @param {string} name 参数名
 * @returns {string} 参数值
 */
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

/**
 * 将查新字符串转为对象
 * @param {string} url URL链接
 * @returns {object} 对象
 */
function parseQueryString(url) {
    var query = !url ? window.location.search : url.indexOf('?') >= 0 ?
        url.substr(url.indexOf('?'), url.length - url.indexOf('?')) : url;
    if (query) {
        return parseQuery(query);
    }
    return false;
}

var specialValues = {
    "null": null,
    "true": true,
    "false": false
};

function parseQuery(query) {
    if (query.substr(0, 1) !== "?") {
        throw new Error("A valid query string passed to parseQuery should begin with '?'");
    }
    query = query.substr(1);
    if (!query) {
        return {};
    }
    if (query.substr(0, 1) === "{" && query.substr(-1) === "}") {
        return JSON.parse(query);
    }
    var queryArgs = query.split(/[,&]/g);
    var result = {};
    for (var i = 0; i < queryArgs.length; i++) {
        var arg = queryArgs[i],
            idx = arg.indexOf("=");
        if (idx >= 0) {
            var name = arg.substr(0, idx);
            var value = decodeURIComponent(arg.substr(idx + 1));
            if (specialValues.hasOwnProperty(value)) {
                value = specialValues[value];
            }
            if (name.substr(-2) === "[]") {
                name = decodeURIComponent(name.substr(0, name.length - 2));
                if (!Array.isArray(result[name]))
                    result[name] = [];
                result[name].push(value);
            } else {
                name = decodeURIComponent(name);
                result[name] = value;
            }
        } else {
            if (arg.substr(0, 1) === "-") {
                result[decodeURIComponent(arg.substr(1))] = false;
            } else if (arg.substr(0, 1) === "+") {
                result[decodeURIComponent(arg.substr(1))] = true;
            } else {
                result[decodeURIComponent(arg)] = true;
            }
        }

    }
    return result;
}

/**
 * URL解析器
 * @param {string} urlTemplate 路径模板
 * @param {string} baseUrl 基路径
 * @param {object} data 模板数据
 */
function urlResolver(urlTemplate, baseUrl, data) {
    var _url = baseUrl || '';
    if (!urlTemplate) return _url;
    if (_url.indexOf('/') !== _url.length - 1 && urlTemplate.indexOf('/') !== 0) {
        _url += '/';
    }
    _url += urlTemplate;
    var _data = !data ? null : extend({}, data, true);
    for (var key in _data) {
        if (_data.hasOwnProperty(key)) {
            var regex = new RegExp('\\[' + key + '\\]', 'g');
            _url = _url.replace(regex, _data[key]);
            _data[key] = undefined;
        }
    }
    if (data) {
        var _params = extend(parseQueryString(_url.split('?')[1]), _data);
        if (_params) {
            var array = [];
            for (var name in _params) {
                if (_params.hasOwnProperty(name)) {
                    var value = _params[name];
                    if (value) {
                        array.push(name + '=' + value);
                    }
                }
            }
            if (array.length > 0) {
                if (_url.indexOf('?') > 0) _url += '&' + encodeURIComponent(array.join('&'));
                else _url += '?' + encodeURIComponent(array.join('&'));
            }
        }
    }
    return _url;
}

/**
 * (弃用的)根据股票代码获取股票名称
 * @param {string} code 
 * @returns {"1"|"2"} 市场代码，上海1，深圳2
 */
function getMarketCode(code) {
    var i = sc.substring(0, 1);
    var j = sc.substring(0, 3);
    if (i == "5" || i == "6" || i == "9") {
        return "1"; //上证股票
    } else {
        if (j == "009" || j == "126" || j == "110") {
            return "1"; //上证股票
        } else {
            return "2"; //深圳股票
        }
    }
}

/**
 * 根据数据获取颜色样式
 * @returns {"red"|"green"|""} 颜色样式
 */
function getColor() {
    var num = 0;
    if (arguments[1]) {
        num = parseFloat(arguments[0]) - parseFloat(arguments[1]);
    } else if (arguments[0]) {
        num = parseFloat(arguments[0]);
    }
    return num > 0 ? "red" : num < 0 ? "green" : "";
}

/**
 * 判断对象是否为dom
 * @param {object} obj 对象
 * @returns {Boolean} true表示是dom对象，否则不是
 */
function isDOM(obj) {
    //首先要对HTMLElement进行类型检查，因为即使在支持HTMLElement
    //的浏览器中，类型却是有差别的，在Chrome,Opera中HTMLElement的
    //类型为function，此时就不能用它来判断了
    if (typeof HTMLElement === 'object') {
        return obj instanceof HTMLElement;
    } else {
        return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
    }
}

/**
 * 科学计数格式化数据(加单位)
 * @param {string|number} data 数据
 * @returns {string} 格式化结果
 */
function numbericFormat(data) {
    var item = parseFloat(data);
    if (!isNaN(item)) {
        var symbol = item < 0 ? -1 : item > 0 ? 1 : 0;
        if (item < 0) item = item * -1;
        if ((item > 0 && item < 1e4) || (item < 0 && item > -1e4)) {
            return (item * symbol).toString();
        } else if ((item > 0 && item < 1e6) || (item < 0 && item > -1e6)) {
            item = item / 10000;
            return item.toFixed(2) * symbol + "万";
        } else if ((item > 0 && item < 1e7) || (item < 0 && item > -1e7)) {
            item = item / 10000;
            return item.toFixed(1) * symbol + "万";
        } else if ((item > 0 && item < 1e8) || (item < 0 && item > -1e8)) {
            item = item / 10000;
            return item.toFixed(0) * symbol + "万";
        } else if ((item > 0 && item < 1e10) || (item < 0 && item > -1e10)) {
            item = item / 1e8;
            return item.toFixed(2) * symbol + "亿";
        } else if ((item > 0 && item < 1e11) || (item < 0 && item > -1e11)) {
            item = item / 1e8;
            return item.toFixed(1) * symbol + "亿";
        } else if ((item > 0 && item < 1e12) || (item < 0 && item > -1e12)) {
            item = item / 1e8;
            return item.toFixed(0) * symbol + "亿";
        } else if ((item > 0 && item < 1e14) || (item < 0 && item > -1e14)) {
            item = item / 1e12;
            return item.toFixed(2) + "万亿";
        } else if ((item > 0 && item < 1e15) || (item < 0 && item > -1e15)) {
            item = item / 1e12;
            return item.toFixed(1) * symbol + "万亿";
        } else if ((item > 0 && item < 1e16) || (item < 0 && item > -1e16)) {
            item = item / 1e12;
            return item.toFixed(0) * symbol + "万亿";
        } else {
            return item;
        }
    }
    return '-';
}

/**
 * 闪烁器
 * @param {object} options 配置
 */
function blinker(options) {
    var _opt = extend({
        doms: [],
        color: {
            up: ["#FFDDDD", "#FFEEEE", ""], //红
            down: ["#b4f7af", "#ccffcc", ""], //绿
            others: ["#b2c3ea", "#cedaf5", ""] //浅蓝
        },
        interval: 300,
        blinktime: 150, //每帧时间 毫秒
        circle: 2 //闪烁次数
    }, options);
    var instance = this;
    instance.raise = false, instance.loop = 0;
    var tid;
    var _doms = [];
    for (var i = 0; i < _opt.doms.length; i++) {
        var obj = _opt.doms[i];
        if (isDOM(obj)) _doms.push(obj);
        else if (typeof _opt.doms[i] === "string") {
            obj = mini(_opt.doms[i]);
            if (obj) _doms.push(obj);
        }
    }
    tid = setInterval(function () {
        if (!instance.raise) return;
        var color = instance.comparer > 0 ? _opt.color.up : instance.comparer < 0 ?
            _opt.color.down : _opt.color.others;
        for (var i = 0; i < color.length * _opt.circle; i++) {
            setTimeout(function () {
                for (var i = 0; i < _doms.length; i++) {
                    _doms[i].style["background-color"] = color[instance.loop];
                    //_options.doms[i].css("background-color", color[instance.loop]);
                }
                instance.loop++;
                instance.loop = instance.loop % color.length;
            }, _opt.blinktime * i);
        }
        instance.raise = false;
    }, _opt.interval);
    this.stop = function () {
        clearInterval(tid);
    }
}

function fixMarket(code) {
    var one = code.substr(0, 1);
    var three = code.substr(0, 3);
    if (one == "5" || one == "6" || one == "9") {
        //上证股票
        return "1";
    }
    else {
        if (three == "009" || three == "126" || three == "110" || three == "201" || three == "202" || three == "203" || three == "204") {
            //上证股票
            return "1";
        }
        else {
            //深圳股票
            return "2";
        }
    }
}

Number.prototype.toFixedFit = function (num) {
    var s = this.toPrecision(num + 1);
    return s.substr(0, s.indexOf('.') + num);
}

String.prototype.cutstr = function (len, ellipsis) {
    return cutstr(this, len, ellipsis);
}

/**
 * 判断数据是否为正数
 * @returns {boolen} true表示正数,false表示负数,NaN表示非数字
 */
String.prototype.isPositive = function () {
    var context = this;
    if (typeof (context).toLowerCase() === "string") {
        context = context.replace("%", "");
        var regNum = new RegExp("^([\\-\\+]?\\d+(\\.\\d+)?)$");
        if (regNum.test(context)) {
            var reg = new RegExp("^-");
            return !reg.test(context);
        } else return Number.NaN;
    }
}

String.prototype.numbericFormat = function () {
    return numbericFormat(this.toString());
}

Date.prototype.pattern = function (format) {
    return formatDate(this, format);
}


/***/ }),

/***/ "./src/modules/old_concept/quote.js":
/*!******************************************!*\
  !*** ./src/modules/old_concept/quote.js ***!
  \******************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var $ = __webpack_require__(/*! jquery */ "jquery");
var utils = __webpack_require__(/*! ./modules/utils */ "./src/modules/old_concept/modules/utils.js");
var COOKIE = __webpack_require__(/*! ./modules/utils.cookie */ "./src/modules/old_concept/modules/utils.cookie.js");
var TopSpeedQuote = __webpack_require__(/*! ./components/quote-push/push */ "./src/modules/old_concept/components/quote-push/push.js");
var PositionChanges = __webpack_require__(/*! ./components/quote-push/changes */ "./src/modules/old_concept/components/quote-push/changes.js");
var DealsDetail = __webpack_require__(/*! ./components/quote-push/deals */ "./src/modules/old_concept/components/quote-push/deals.js");
var chartManger = __webpack_require__(/*! ./modules/quotecharts */ "./src/modules/old_concept/modules/quotecharts.js");
var fullscreenchart = __webpack_require__(/*! ./components/fullscreenchart/fschart */ "./src/modules/old_concept/components/fullscreenchart/fschart.js");
var pathConfig = __webpack_require__(/*! ./config */ "./src/modules/old_concept/config.js");

__webpack_require__(/*! ./modules/jquery-plugins/jquery.tooltip */ "./src/modules/old_concept/modules/jquery-plugins/jquery.tooltip.js");
// require('./modules/jquery-plugins/jquery.tooltip.css');

var isprod = environment === 'production';
var cache = utils.ObjectCache.default;

function quote(args) {
    var _opt = getoptions(args);
    var tsq;
    this.renderQuote = function () {
        var cname = 'TSQ_' + (_opt.entry.shortmarket + _opt.entry.code).toUpperCase();
        if (tsq) tsq.stop();
        tsq = this.quoteLoader = new TopSpeedQuote(cname, {
            host: 'push1.eastmoney.com', //isprod ? 'push1.eastmoney.com' : 'pushtest.eastmoney.com:18645',
            stopWithoutQuote: true,
            enableMutiDomain: true
        });
        // tsq.start();
        nufmLoader.apply(this);
        return tsq;
    }
    // this.timefigure=timefigure;
    //分时图
    function timefigure(iscrdata,ndaysdata,typedata) {
        var market_01=stockentry.marketnum==1?1:0;
        var thissse = null;
        $.ajax({
            url: "//emcharts.eastmoney.com/ec/3.14.2/emcharts.min.js",
            method: "GET",
            cache: true,
            scriptCharset: "UTF-8",
            dataType: "script"
            }).success(function () {
            function getQueryString(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                var r = window.location.search.substr(1).match(reg);
                if (r != null) return decodeURIComponent(r[2]);
                return null;
            }
            var c = market_01+'.'+stockentry.code;
            var sc = getQueryString("sc") || "";
            var sm = getQueryString("sm") || "";
            var type = typedata || "r";
            var iscr = iscrdata||0;
            var nd = ndaysdata||1;
            console.log(nd)
            console.log(typeof(nd))
            var option = {
                container: '#chart-container',
                width: 720,
                height: 600,
                type: type,
                iscr: iscr,
                ndays:nd,
                gridwh: {
                    //height: 25,
                    width: 720
                },
                padding: {
                    top: 0,
                    bottom: 5
                },
                color: {
                    line: '#326fb2',
                    fill: ['rgba(101,202,254, 0.2)', 'rgba(101,202,254, 0.1)']
                },
                // data: {
                //     time: [],
                //     positionChanges: []
                // },
                tip: {
                    show: true,
                    trading: true
                },
                show: {
                    indicatorArea: true, // 分时指标
                    CMA: true,
                    // ddx: args.type === 'r',
                    // cf: args.type === 'r'
                },
                onClickChanges: function () {
                    window.open('//quote.eastmoney.com/changes/stocks/' + args.entry.shortmarket + args.entry.code + '.html');
                },
                onComplete: function () {
        
                },
                onError: function (err) {
                    console.error(err);
                },
                update: 40 * 1000
            }
            var time;
            time = new emcharts3.time(option);
            // console.log(time)
            var tps = {
                r: 1,
                t2: 2,
                t3: 3,
                t4: 4,
                t5: 5
            }
            test(iscrdata,ndaysdata);
            function test(iscr,ndays) {
                if (typeof iscr === "number" && iscr) time.option.iscr = iscr;
                if (typeof ndays === "number" && ndays) time.option.ndays = ndays;
                if (typeof iscr === "number" && iscr) time.options.iscr = iscr;
                if (typeof ndays === "number" && ndays) time.options.ndays = ndays;
                // var url = "http://61.129.249.233:18665/api/qt/stock/trends2/get";
                if(ndays==1){
                    var url = "http://push2.eastmoney.com/api/qt/stock/trends2/get" 
                }else{
                    var url = "http://push2his.eastmoney.com/api/qt/stock/trends2/get"
                }
                var data = {
                    fields1: "f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13",
                    fields2: "f51,f52,f53,f54,f55,f56,f57,f58",
                    ut: "fa5fd1943c7b386f172d6893dbfba10b",
                    ndays: time.option.ndays,
                    iscr: time.option.iscr,
                };
        
                if (c) {
                    data.secid = c;
                }
                
        
        
                var arr = [];
                for (var k in data) {
                    arr.push(k + "=" + data[k]);
                }
                // console.log(url + "?" + arr.join("&"))
                // 请求分时数据
                $.ajax({
                    type: "get",
                    url: url + "?" + arr.join("&"),
                    // data: data,
                    dataType: "jsonp",
                    jsonp: "cb",
                    success: function (msg) {
                        // msg.data.trendsTotal = 482
                        // console.log(time)
                        time.setData({
                            time: msg
                        });
                        console.log(time)
                        time.redraw();
                    }
                });
        
            }
        
            // aa();
            // function aa() {
            //     $.ajax({
            //         type: "get",
            //         url: "http://nuyd.eastmoney.com/EM_UBG_PositionChangesInterface/api/js",
            //         data: {
            //             id: "3005042",
            //             style: "top",
            //             ac: "normal",
            //             check: "itntcd",
            //             // dtformat: "HH:mm:ss",
            //             js: "changeData15125388([(x)])"
            //         },
            //         dataType: "jsonp",
            //         jsonp: "changeData15125388",
            //         jsonpCallback: "changeData15125388",
            //         success: function (msg) {
            //             try {
            //                 if (msg[0].state) {
            //                     dataPositionChanges = [];
            //                 } else {
            //                     dataPositionChanges = msg;
            //                 }
            //             } catch (error) {
            //                 dataPositionChanges = [];
            //             }
            //             time.setData({
            //                 positionChanges: dataPositionChanges
            //             });
            //             time.redraw();
            //         }
            //     });
            // }
        
            bb();
            function bb() {
        
                var types = {
                    "1": "有大买盘",
                    "101": "有大卖盘",
                    "2": "大笔买入",
                    "102": "大笔卖出",
                    "201": "封涨停板",
                    "301": "封跌停板",
                    "202": "打开涨停",
                    "302": "打开跌停",
                    "203": "高开5日线",
                    "303": "低开5日线",
                    "204": "60日新高",
                    "304": "60日新低",
                    "401": "向上缺口",
                    "501": "向下缺口",
                    "402": "火箭发射",
                    "502": "高台跳水",
                    "403": "快速反弹",
                    "503": "快速下跌",
                    "404": "竞价上涨",
                    "504": "竞价下跌",
                    "405": "60日大幅上涨",
                    "505": "60日大幅下跌"
                }
        
                $.ajax({
                    type: "get",
                    // url: "http://61.129.249.233:18665/api/qt/pkyd/get?fields=f2,f1,f4,f5,f6,f7&lmt=20&ut=fa5fd1943c7b386f172d6893dbfba10b&secids="+c,
                    url: "http://push2.eastmoney.com/api/qt/pkyd/get?fields=f2,f1,f4,f5,f6,f7&lmt=-1&ut=fa5fd1943c7b386f172d6893dbfba10b&secids=" + c,
                    dataType: "jsonp",
                    jsonp: "cb",
                    success: function (msg) {
        
                        if (msg.rc == 0 && msg.data) {
        
                            var pkyd = msg.data.pkyd;
        
                            var newarr = [];
        
                            for (var i = 0, len = pkyd.length; i < len; i++) {
                                var s = pkyd[i].split(",");
        
                                var ar = [s[1], s[0].substr(0, 5), s[2], types[s[3]], s[4], s[5]];
                                newarr.push(ar.join(","));
                            }
        
                            console.log(newarr);
                            time.setData({ 
                                positionChanges: newarr
                            });
                            console.log(time)
                            time.redraw();
                        }
        
        
        
                    }
                });
            }
            function events() {
                // $(".timetime a").click(function (e) {
                //     var word=$("#day-selector .selected-box").html().substring(0,1);
                //     console.log(word)
                //     if(word==5){
                //         $("#day-selector").attr('type','fiveday')
                //     }else if(word==4){
                //         $("#day-selector").attr('type','fourday')
                //     }else if(word==3){
                //         $("#day-selector").attr('type','threeday')
                //     }else if(word==2){
                //         $("#day-selector").attr('type','twoday')
                //     }else if(word==1){
                //         $("#day-selector").attr('type','oneday')
                //     }
                //     var params = time.option;
                //     var paramspic = time.options;
                //     params.iscr = 0;
                //     params.ndays = 1;
                //     paramspic.iscr = 0;
                //     paramspic.ndays = 1;
                //     $("#type-selector a").removeClass("cur");
                //     $(this).addClass("cur");
                //     switch ($(this).attr("type")) {
                //         case "panqian":
                //             params.iscr = 1;
                //             params.ndays = 1;
                //             params.type = "r";
                //             paramspic.iscr = 1;
                //             paramspic.ndays = 1;
                //             paramspic.type = "r";
                //             break;
                //         case "oneday":
                //             params.ndays = 1;
                //             params.type = "r";
                //             paramspic.ndays = 1;
                //             paramspic.type = "r";
                //             break;
                //         case "twoday":
                //             params.ndays = 2;
                //             params.type = "t2";
                //             paramspic.ndays = 2;
                //             paramspic.type = "t2";
                //             break;
                //         case "threeday":
                //             params.ndays = 3;
                //             params.type = "t3";
                //             paramspic.ndays = 3;
                //             paramspic.type = "t3";
                //             break;
                //         case "fourday":
                //             params.ndays = 4;
                //             params.type = "t4";
                //             paramspic.ndays = 4;
                //             paramspic.type = "t4";
                //             break;
                //         case "fiveday":
                //             params.ndays = 5;
                //             params.type = "t5";
                //             paramspic.ndays = 5;
                //             paramspic.type = "t5";
                //             break;
                //     }
                //     test(params.ndays);
                //     load_sse(iscrdata,ndaysdata);
                //     return false;
                // });
                $("#type-selector i").click(function (e) {
                    var params = time.option;
                    var paramspic = time.options;
                    params.iscr = 0;
                    params.iscca = 0;
                    params.ndays = 1;
                    paramspic.iscr = 0;
                    paramspic.iscca = 0;
                    paramspic.ndays = 1;
                    switch ($(this).attr("type")) {
                        case "oneday":
                            params.ndays = 1;
                            params.type = "r";
                            paramspic.ndays = 1;
                            paramspic.type = "r";
                            break;
                        case "twoday":
                            params.ndays = 2;
                            params.type = "t2";
                            paramspic.ndays = 2;
                            paramspic.type = "t2";
                            break;
                        case "threeday":
                            params.ndays = 3;
                            params.type = "t3";
                            paramspic.ndays = 3;
                            paramspic.type = "t3";
                            break;
                        case "fourday":
                            params.ndays = 4;
                            params.type = "t4";
                            paramspic.ndays = 4;
                            paramspic.type = "t4";
                            break;
                        case "fiveday":
                            params.ndays = 5;
                            params.type = "t5";
                            paramspic.ndays = 5;
                            paramspic.type = "t5";
                            break;
                    }
                    test(params.ndays);
                    load_sse(iscrdata,ndaysdata);
                    return false;
                });

            }
            function init() {
                events();
                load_sse(iscrdata,ndaysdata);      
            }
            function load_sse(iscrdata,ndaysdata) {       
                try {
                    thissse.close()
                } catch (error) {
                    
                }
                if (typeof iscr === "number" && iscr) time.option.iscr = iscrdata;
                if (typeof ndays === "number" && ndays) time.option.ndays = ndaysdata;
                var data={
                    ndays: time.option.ndays,
                    iscr: time.option.iscr,
                };
                var arr = [];
                for (var k in data) {
                    arr.push(k + "=" + data[k]);
                } 
                // var fullurl = 'http://61.129.249.233:18665/api/qt/stock/trends2/sse?fields1=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13&fields2=f51,f52,f53,f54,f55,f56,f57,f58&ut=fa5fd1943c7b386f172d6893dbfba10b&secid=1.'+ stockEnity.Code + "&" + arr.join("&");
                // thissse=new EventSource(fullurl);
                var fullurl = 'http://'+(Math.floor(Math.random() * 99) + 1)+'.push2.eastmoney.com/api/qt/stock/trends2/sse?fields1=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13&fields2=f51,f52,f53,f54,f55,f56,f57,f58&ut=fa5fd1943c7b386f172d6893dbfba10b&secid='+ c + "&" + arr.join("&");
                var nfullurl = 'http://'+(Math.floor(Math.random() * 99) + 1)+'.push2his.eastmoney.com/api/qt/stock/trends2/sse?fields1=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13&fields2=f51,f52,f53,f54,f55,f56,f57,f58&ut=fa5fd1943c7b386f172d6893dbfba10b&secid='+ c + "&" + arr.join("&");
                if(data.ndays==1){
                    thissse = new EventSource(fullurl);
                }else{
                    thissse = new EventSource(nfullurl);
                }
                
                thissse.onmessage = function (msg) {
                    // console.log(msg);
                    var fdata = JSON.parse(msg.data)
                    // console.log(fdata);
                    var fulldata = '';
                    if (fdata.rc == 0 && fdata.data) {
            
                        var data = fdata.data;
            
                        if (data.beticks) {
                            fullData = fdata;
                        } else {
            
                            var source = fullData.data.trends;
                            var last = source[source.length - 1].split(",");
                            
                            var trends = data.trends;
                            var frist = trends[0].split(",");
            
                            if (last[0] == frist[0]) {
                                source.pop();
                            }
                            for(var i = 0, len = trends.length ; i < len ; i++){
                                source.push(trends[i]);
                            }
                        }
            
                        // console.log(that.fullData);
                        time.setData({
                            time: fullData
                        });
                        console.log(time)
                        time.redraw();
                    }
            
                }
            }
        
            init();
        });
    };
    /*
     *@Title:     jsf
     *@description: 交易状态
     *@return: 
     *@author: qiuhongyang
     *@date: 2020-07-16 14:41:15
     *
    */
    function tradestatus(json){
        if (json.data.f86 && json.data.f86 != '-' && json.data.f292 && json.data.f292 != '-') {
            var time = formateDate(new Date(json.data.f86 * 1000), "yyyy-MM-dd");
            var minute = (new Date(json.data.f86 * 1000).toString()).split(" ");
            $("#quote-time").html(time + ' ' + minute[4]);
            //交易状态
            if (json.data.f292) {
                var jycontent = '';
                if (json.data.f292 == 1) {
                    jycontent = "开盘竞价"
                }
                else if (json.data.f292 == 2) {
                    jycontent = "交易中"
                }
                else if (json.data.f292 == 3) {
                    jycontent = "盘中休市"
                }
                else if (json.data.f292 == 4) {
                    jycontent = "收盘竞价"
                }
                else if (json.data.f292 == 5) {
                    jycontent = "已收盘"
                }
                else if (json.data.f292 == 6) {
                    jycontent = "停牌"
                }
                else if (json.data.f292 == 7) {
                    jycontent = "退市"
                }
                else if (json.data.f292 == 8) {
                    jycontent = "暂停上市"
                }
                else if (json.data.f292 == 9) {
                    jycontent = "未上市"
                }
                else if (json.data.f292 == 10) {
                    jycontent = "未开盘"
                }
                else if (json.data.f292 == 11) {
                    jycontent = "盘前"
                }
                else if (json.data.f292 == 12) {
                    jycontent = "盘后"
                }
                else if (json.data.f292 == 13) {
                    jycontent = "节假日休市"
                }
                else if (json.data.f292 == 14) {
                    jycontent = "盘中停牌"
                }
                else if (json.data.f292 == 15) {
                    jycontent = "非交易代码"
                }
                else if (json.data.f292 == 16) {
                    jycontent = "波动性中断"
                }
                else if (json.data.f292 == 17) {
                    jycontent = "盘后交易启动"
                }
                else if (json.data.f292 == 18) {
                    jycontent = "盘后集中撮合交易"
                }
                else if (json.data.f292 == 19) {
                    jycontent = "盘后固定价格交易"
                }
                $('#tradestatus').html(jycontent)
            }             
        }
    };
    this.disquote = disquote;
    //个股行情
    function disquote() {
        var that = this;
        var market_01=stockentry.marketnum==1?1:0;

        // var url= 'http://push2.eastmoney.com/api/qt/stock/get?ut=fa5fd1943c7b386f172d6893dbfba10b&fltt=2&invt=2&fields=f120,f121,f122,f174,f175,f59,f163,f43,f57,f58,f169,f170,f46,f44,f51,f168,f47,f164,f116,f60,f45,f52,f50,f48,f167,f117,f71,f161,f49,f530,f135,f136,f137,f138,f139,f141,f142,f144,f145,f147,f148,f140,f143,f146,f149,f55,f62,f162,f92,f173,f104,f105,f84,f85,f183,f184,f185,f186,f187,f188,f189,f190,f191,f192,f107,f111,f86,f177,f78,f110,f262,f263,f264,f267,f268,f255,f256,f257,f258,f127,f199,f128,f198,f259,f260,f261,f171,f277,f278,f279,f288,f152,f250,f251,f252,f253,f254,f269,f270,f271,f272,f273,f274,f275,f276,f265,f266,f289,f290,f286,f285&secid='+market_01+'.' +stockentry.code

        var url = pathConfig.getEnvPath("commonApi") + 'api/qt/stock/get?ut=fa5fd1943c7b386f172d6893dbfba10b&fltt=2'
        +'&invt=2&fields=f120,f121,f122,f174,f175,f59,f163,f43,f57,f58,f169,f170,f46,f44,f51,f168,f47,f164,f116,f60,'
        +'f45,f52,f50,f48,f167,f117,f71,f161,f49,f530,f135,f136,f137,f138,f139,f141,f142,f144,f145,f147,f148,f140,f143,'
        +'f146,f149,f55,f62,f162,f92,f173,f104,f105,f84,f85,f183,f184,f185,f186,f187,f188,f189,f190,f191,f192,f107,f111,'
        +'f86,f177,f78,f110,f262,f263,f264,f267,f268,f255,f256,f257,f258,f127,f199,f128,f198,f259,f260,f261,f171,f277,f278,'
        +'f279,f288,f152,f250,f251,f252,f253,f254,f269,f270,f271,f272,f273,f274,f275,f276,f265,f266,f289,f290,f286,f285,'
        +'f292,f293,f294,f295&secid='+market_01+'.' +stockentry.code; 


        //测试地址
        // url = 'http://61.152.230.207/api/qt/stock/get?ut=fa5fd1943c7b386f172d6893dbfba10b&invt=2&fltt=2&fields=f120,f121,f122,f174,f175,f59,f163,f43,f57,f58,f169,f170,f46,f44,f51,f168,f47,f164,f116,f60,'
        //     + 'f45,f52,f50,f48,f167,f117,f71,f161,f49,f530,f135,f136,f137,f138,f139,f141,f142,f144,f145,f147,f148,f140,f143,'
        //     + 'f146,f149,f55,f62,f162,f92,f173,f104,f105,f84,f85,f183,f184,f185,f186,f187,f188,f189,f190,f191,f192,f107,f111,'
        //     + 'f86,f177,f78,f110,f262,f263,f264,f267,f268,f255,f256,f257,f258,f127,f199,f128,f198,f259,f260,f261,f171,f277,f278,'
        //     + 'f279,f288,f152,f250,f251,f252,f253,f254,f269,f270,f271,f272,f273,f274,f275,f276,f265,f266,f289,f290,f286,f285,'
        //     +'f292,f294,f295&secid=0.302004'
        
        $.ajax({
            url:url,
            scriptCharset: "utf-8",
            dataType: "jsonp",
            jsonp: "cb",
            success: function (json) {  
                // console.log('个股行情')
                // console.log(json) 
                if(!json.data) return
                var titlename = json.data.f58;
                var titleprice;
                var titlezdf;
                var titlezde;
                //新版时间
                var timehq = formateDate(new Date(json.data.f86*1000), "HH:mm");
                if(time_range('9:15','9:30',timehq)){
                    setTimeout(function(){
                        $("#cr").click()
                    }, 3000);
                }
                if(time_range('15:00','15:30',timehq)){
                    setTimeout(function(){
                        $("#ar").click()
                    }, 3000);
                } 
                //交易状态
                tradestatus(json);

                if (json.data.f292 == 8) {
                    $('.stock-data').html('<span title="暂停上市" class="tp-box" id="quote-close-tp" style=margin-top:20px;color:red;>暂停上市</span>')
                } 
                else if (json.data.f292 == 6) {
                    $('.stock-data').html('<span title="停牌" class="tp-box" id="quote-close-tp" style=margin-top:20px;color:red;>停牌</span>')  
                } 
                else if (json.data.f292 == 9) {
                    $('.stock-data').html('<span title="未上市" class="tp-box" id="quote-close-tp" style=margin-top:20px;color:red;>未上市</span>')
                }
                else{
                    if(json.data.f43 === 0){
                        $("#quote-close-main").html(json.data.f43.toFixed(2)) 
                    }
                    else if(json.data.f43!='-'){ 
                        // console.info(22222222)
                        $(".stock-data-zxj").html('<b id="quote-close-main" class="zxj" style="">'+json.data.f43.toFixed(2)+'</b><b id="quote-arrow" class=""></b>')
                        titleprice = json.data.f43.toFixed(2)
                    }else{
                        $(".stock-data-zxj").html('-')
                    }
                    if(json.data.f169!='-'){
                        $("#quote-change-main").html(json.data.f169.toFixed(2)).addClass('zdf');
                        titlezde=json.data.f169.toFixed(2)

                        if (titlezde.length > 6) {
                            $("#quote-change-main").css({ "font-size": "12px" })
                            $("#quote-changePercent-main").css({ "font-size": "12px" })
                        }
                    }
                    if(json.data.f170!='-'){
                        titlezdf = json.data.f170.toFixed(2);
                        var zdfstr = (json.data.f170 / 100).toFixed(2) + "倍";
                        if(json.data.f170>=1000){
                            $("#quote-changePercent-main").html(zdfstr).addClass('zdf'); 
                            
                        }else{
                            zdfstr = json.data.f170.toFixed(2) + "%"
                            $("#quote-changePercent-main").html(zdfstr).addClass('zdf');                     
                        }

                        if (zdfstr.length > 6) {
                            $("#quote-change-main").css({ "font-size": "12px" })
                            $("#quote-changePercent-main").css({ "font-size": "12px" })
                        }
                    }    
                    if(json.data.f169){
                        if(json.data.f169<0){
                            $("#quote-close-main").css('color','green');
                            $("#quote-arrow").removeClass('icon-big-arrow-up')
                            $("#quote-arrow").addClass('icon-big-arrow-down');
                            $("#quote-change-main").css('color','green');
                            $("#quote-changePercent-main").css('color','green');
                        }else if(json.data.f169>0){
                            $("#quote-close-main").css('color','red');
                            $("#quote-arrow").removeClass('icon-big-arrow-down')
                            $("#quote-arrow").addClass('icon-big-arrow-up');
                            $("#quote-change-main").css('color','red');
                            $("#quote-changePercent-main").css('color','red');
                        }
                    } else {
                        $("#quote-close-main").css('color', '');
                        $("#quote-arrow").removeClass('icon-big-arrow-up icon-big-arrow-down')
                        $("#quote-change-main").css('color', '');
                        $("#quote-changePercent-main").css('color', '');
                    }
                    if(json.data.f43!='-'){
                        document.title = (json.data.f58 + " " + json.data.f43.toFixed(2) + " " + json.data.f169.toFixed(2) + "(" + json.data.f170.toFixed(2) + "%) _ 股票行情 _ 东方财富网");   
                    } 
                         
                }  
                //判断GDR
                if(json.data.f177 & 32768){
                    //接口稳定后改回来
                    $("#gdr").show()
                    $("#gdr").attr("href", "http://quote.eastmoney.com/uk/"+json.data.f286+"."+json.data.f285+".html");
                }
                //判断AH股，AB股，可转债
                // $('#related-quote').html()
                if(json.data.f60!='-'){
                    $("#quote-pc").html(json.data.f60.toFixed(2));//昨收
                }
                if(json.data.f43!='-'){
                    $("#quote-close-custom").html(json.data.f43.toFixed(2)).addClass(udcls(json.data.f44,json.data.f60));//最新            
                }
                if(json.data.f46!='-'){
                    $("#quote-open-custom").html(json.data.f46.toFixed(2)).addClass(udcls(json.data.f46,json.data.f60));$("#gt1").addClass('txtl');//今开            
                }
                if(json.data.f44!='-'){
                    $("#quote-high-custom").html(json.data.f44.toFixed(2)).addClass(udcls(json.data.f44,json.data.f60));$("#gt2").addClass('txtl');//最高            
                }
                if(json.data.f168!='-'){
                    $("#quote-turnoverRate-custom").html(json.data.f168.toFixed(2)+"%");//换手
                    $("#quote-turnoverRate").html(json.data.f168.toFixed(2)+"%");                                            
                }
                if(json.data.f277!='-'){
                    $("#quote-signin-price-custom").html(fmtdig(json.data.f277, 1, 2, "", true));//注册资本
                }
                if(json.data.f51!='-'){
                    $("#quote-raisePrice-custom").html(json.data.f51.toFixed(2)).addClass('red');//涨停
                    $("#quote-raisePrice-main").html(json.data.f51.toFixed(2)).addClass('red');//涨停
                }
                if(json.data.f260!='-'){
                    $("#quote-aftervolume-custom").html(fmtdig(json.data.f260, 1, 2, "", true) + "手");//盘后成交量
                }
                if(json.data.f47!='-'){
                    if(json.data.f47<10000){
                        $("#quote-volume-custom").html(json.data.f47+ "手")
                    }else{
                        $("#quote-volume-custom").html(fmtdig(json.data.f47, 1, 2, "", true) + "手");//成交量                               
                    }
                }
                if(json.data.f45!='-'){
                    $("#quote-low-custom").html(json.data.f45.toFixed(2)).addClass(udcls(json.data.f45,json.data.f60));//最低            
                }
                if(json.data.f50!='-'){
                    $("#quote-volumeRate-custom").html(json.data.f50.toFixed(2));//量比       
                    $("#quote-volumeRate").html(json.data.f50.toFixed(2));     
                }
                if(json.data.f278!='-'){
                    $("#quote-publishprice-custom").html(fmtdig(json.data.f278, 1, 2, "", true));//发行股本
                }
                if(json.data.f52!='-'){
                    $("#quote-fallPrice-custom").html(json.data.f52.toFixed(2)).addClass("txtl green");//跌停
                    $("#quote-fallPrice-main").html(json.data.f52.toFixed(2)).addClass("txtl green");//跌停              
                }
                if(json.data.f261!='-'){
                    $("#quote-afteramount-custom").html(fmtdig(json.data.f261, 1, 2, "", true));//盘后成交额
                }
                if(json.data.f48!='-'){
                    $("#quote-amount-custom").html(fmtdig(json.data.f48, 1, 2, "", true));//成交额            
                }
                if(json.data.f171!='-'){
                    $("#quote-amplitude-custom").html(json.data.f171.toFixed(2)+'%');//振幅
                }
                if(json.data.f71!='-'){
                    $("#quote-avg").html(json.data.f71.toFixed(2)).addClass(udcls(json.data.f71,json.data.f60));//均价            
                }
                if(json.data.f162!='-'){
                    $("#quote-PERation-custom").html(json.data.f162.toFixed(2));//市盈动  
                    $("#quote-PERation").html(json.data.f162.toFixed(2));//市盈            
                }

                if(json.data.f164!='-'){
                    $("#quote-RollingPERations-custom").html(json.data.f164.toFixed(2));//滚动市盈  
                }

                if(json.data.f85!='-'){
                    $("#quote-flowCapital-custom").html((json.data.f85/100000000).toFixed(2)+'亿');//流通股本  
                    $("#quote-flowCapital").html((json.data.f85/100000000).toFixed(2)+'亿');//流通股本           
                }
                if(json.data.f279!='-'){
                    $("#quote-sameratio-custom").html((json.data.f279==1)?'是':'否');//同权同股比例
                } 
                if(json.data.f173!='-'){
                    $("#quote-ROE").html(json.data.f173+'%');//ROE
                }  
                //行情报价
                if(json.data.f191!='-'){
                    $("#quote-cr").html(json.data.f191.toFixed(2) + "%").addClass(udcls(json.data.f191));//委比            
                }
                if(json.data.f192!='-'){
                    $("#quote-cd").html(json.data.f192).addClass(udcls(json.data.f192));//委差   
                }
                if (json.data.f31 != '-' && json.data.f31 != 0){
                    $("#quote-s5p").html(json.data.f31.toFixed(2)).addClass(udcls(json.data.f31, json.data.f60)); 
                }
                if (json.data.f32 != '-'){
                    $("#quote-s5v").html(json.data.f32).addClass('fright'); 
                }
                if (json.data.f33 != '-' && json.data.f33 != 0){
                    $("#quote-s4p").html(json.data.f33.toFixed(2)).addClass(udcls(json.data.f33, json.data.f60));  
                }
                if(json.data.f34!='-'){
                    $("#quote-s4v").html(json.data.f34).addClass('fright');
                }
                if (json.data.f35 != '-' && json.data.f35 != 0){
                    $("#quote-s3p").html(json.data.f35.toFixed(2)).addClass(udcls(json.data.f35, json.data.f60));
                }
                if(json.data.f36!='-'){
                    $("#quote-s3v").html(json.data.f36).addClass('fright'); 
                }
                if (json.data.f37 != '-' && json.data.f37 != 0){
                    $("#quote-s2p").html(json.data.f37.toFixed(2)).addClass(udcls(json.data.f37, json.data.f60)); 
                }
                if(json.data.f38!='-'){
                    $("#quote-s2v").html(json.data.f38).addClass('fright'); 
                }
                if (json.data.f39 != '-' && json.data.f39 != 0){
                    $("#quote-s1p").html(json.data.f39.toFixed(2)).addClass(udcls(json.data.f39, json.data.f60)); 
                }
                if(json.data.f40!='-'){
                    $("#quote-s1v").html(json.data.f40).addClass('fright'); 
                }
                if (json.data.f19 != '-' && json.data.f19 != 0){
                    $("#quote-b1p").html(json.data.f19.toFixed(2)).addClass(udcls(json.data.f19, json.data.f60)); 
                }
                if(json.data.f20!='-'){
                    $("#quote-b1v").html(json.data.f20).addClass('fright');
                }
                if (json.data.f17 != '-' && json.data.f17 != 0){
                    $("#quote-b2p").html(json.data.f17.toFixed(2)).addClass(udcls(json.data.f17, json.data.f60));  
                }
                if(json.data.f18!='-'){
                    $("#quote-b2v").html(json.data.f18).addClass('fright');
                }
                if (json.data.f15 != '-' && json.data.f15 != 0){
                    $("#quote-b3p").html(json.data.f15.toFixed(2)).addClass(udcls(json.data.f15, json.data.f60));  
                }
                if(json.data.f16!='-'){
                    $("#quote-b3v").html(json.data.f16).addClass('fright');
                }
                if (json.data.f13 != '-' && json.data.f13 != 0){
                    $("#quote-b4p").html(json.data.f13.toFixed(2)).addClass(udcls(json.data.f13, json.data.f60)); 
                }
                if(json.data.f34!='-'){
                    $("#quote-b4v").html(json.data.f14).addClass('fright'); 
                }
                if (json.data.f11 != '-' && json.data.f11 != 0){
                    $("#quote-b5p").html(json.data.f11.toFixed(2)).addClass(udcls(json.data.f11, json.data.f60));  
                }
                if(json.data.f12!='-'){
                    $("#quote-b5v").html(json.data.f12).addClass('fright');
                }
                if(json.data.f49!='-'){
                    if(json.data.f49<10000){
                        $("#quote-buyOrder-custom").html(json.data.f49).addClass('red');//外盘
                        $("#quote-buyOrder").html(json.data.f49).addClass('red');//外盘
                    }else{
                        $("#quote-buyOrder-custom").html(fmtdig(json.data.f49, 1, 2, "", true)).addClass('red');//外盘
                        $("#quote-buyOrder").html(fmtdig(json.data.f49, 1, 2, "", true)).addClass('red');//外盘
                    }
                }
                if(json.data.f161!='-'){
                    if(json.data.f161<10000){
                        $("#quote-sellOrder-custom").html(json.data.f161).addClass('green');//内盘
                        $("#quote-sellOrder").html(json.data.f161).addClass('green');//内盘
                    }else{
                        $("#quote-sellOrder-custom").html(fmtdig(json.data.f161, 1, 2, "", true)).addClass('green');
                        $("#quote-sellOrder").html(fmtdig(json.data.f161, 1, 2, "", true)).addClass('green');
                    }
                }
                if(json.data.f84!='-'){
                    $("#quote-totalShare-custom").html(fmtdig(json.data.f84, 1, 2, "", true));//总股本
                    $("#quote-totalShare").html(fmtdig(json.data.f84, 1, 2, "", true));
                }
                if(json.data.f117!='-'){
                    $("#quote-flowCapitalValue-custom").html(fmtdig(json.data.f117, 1, 2, "", true));//流通市值
                    $("#quote-flowCapitalValue").html(fmtdig(json.data.f117, 1, 2, "", true));
                }
                if(json.data.f116!='-'){
                    $("#quote-marketValue-custom").html(fmtdig(json.data.f116, 1, 2, "", true));//总市值
                    $("#quote-marketValue").html(fmtdig(json.data.f116, 1, 2, "", true))
                }
                if(json.data.f167!='-'){
                    $("#quote-PB-custom").html(json.data.f167);//市净率
                    $("#quote-PB").html(json.data.f167);
                }
                if(json.data.f163!='-'){
                    $("#quote-staticPERation-custom").html(json.data.f163);//静态市盈
                    $("#quote-staticPERation").html(json.data.f163);
                }
                if(json.data.f55!='-'){
                    $("#quote-EPS-custom").html(json.data.f55.toFixed(3));//每股收益
                    $("#quote-EPS").html(json.data.f55.toFixed(3));
                }
                if(json.data.f92!='-'){
                    $("#quote-NAPS-custom").html(json.data.f92.toFixed(2));//净资本
                    $("#quote-NAPS").html(json.data.f92.toFixed(2));
                }
                if(json.data.f174!='-'){
                    $("#quote-52highest-custom").html(json.data.f174.toFixed(json.data.f59));
                }
                if(json.data.f175!='-'){
                    $("#quote-52lowest-custom").html(json.data.f175.toFixed(json.data.f59));
                }
                if(json.data.f135!='-'){
                    if(json.data.f135<10000){
                        $("#quote-BalFlowInOriginal-custom").html(ForDight(parseFloat(json.data.f135/10000), 2)+'万').addClass('red');
                    }else{
                        $("#quote-BalFlowInOriginal-custom").html(fmtdig(json.data.f135, 1, 2, "", true)).addClass('red');//外盘
                    }
                }
                if(json.data.f136!='-'){
                    if(json.data.f136<10000){
                        $("#quote-BalFlowOutOriginal-custom").html(ForDight(parseFloat(json.data.f136/10000), 2)+'万').addClass('green');
                    }else{
                        $("#quote-BalFlowOutOriginal-custom").html(fmtdig(json.data.f136, 1, 2, "", true)).addClass('green');//外盘
                    }
                }
                if(json.data.f120!='-'){
                    if(json.data.f120>=1000){
                        $("#quote-20cp-custom").html((json.data.f120/100).toFixed(2)+"倍").addClass('zdf').addClass(udcls(json.data.f120)); 
                        $("#quote-20cp-custom").addClass
                    }else{
                        $("#quote-20cp-custom").html(json.data.f120.toFixed(2)+"%").addClass('zdf').addClass(udcls(json.data.f120));                     
                    }
                }
                if(json.data.f121!='-'){
                    if(json.data.f121>=1000){
                        $("#quote-60cp-custom").html((json.data.f121/100).toFixed(2)+"倍").addClass('zdf').addClass(udcls(json.data.f121)); 
                    }else{
                        $("#quote-60cp-custom").html(json.data.f121.toFixed(2)+"%").addClass('zdf').addClass(udcls(json.data.f121));                     
                    }
                }
                if(json.data.f122!='-'){
                    if(json.data.f122>=1000){
                        $("#quote-360cp-custom").html((json.data.f122/100).toFixed(2)+"倍").addClass('zdf').addClass(udcls(json.data.f122)); 
                    }else{
                        $("#quote-360cp-custom").html(json.data.f122.toFixed(2)+"%").addClass('zdf').addClass(udcls(json.data.f122));                     
                    }
                }
                if(json.data.f288!=-1){
                    var profit = json.data.f288>0?'否':'是'
                    $('#quote-profit-custom').html(profit)
                }
                //是否创业板:展示盘后分时切换tab
                if (json.data.f107 == 0 && json.data.f111 == 80){  
                    $("#fs_panhou_tab").css({"display":"block"});
                }
                //是否注册制、协议控制架构、同股同权、是否盈利
                if (json.data.f294 != '-') { //是否注册制
                    var t1 = json.data.f294 == 1 ? "是" : "否";
                    $("#quote-IsZCZ-custom").html(t1);
                }
                if (json.data.f295 != '-') { //协议机构
                    var t2 = json.data.f295 == 1 ? "是" : "否";
                    $("#quote-IsXYJG-custom").html(t2);
                }
                // if (json.data.f279 != '-') { //是否同股同权
                //     var t3 = json.data.f279 == 1 ? "是" : "否"; 
                //     $("#quote-IsTGTQ-custom").html(t3); 
                // }

                if (json.data.f293 != '-') { //是否有表决权差异293 
                    var t3 = json.data.f293 == 1 ? "是" : "否"; 
                    $("#quote-IsBJCY-custom").html(t3); 
                }

                if (json.data.f288 == '0' || json.data.f288 == '1') { //是否盈利
                    var t4 = json.data.f288 == 1 ? "否" : "是";
                    $("#quote-IsYL-custom").html(t4);
                }
                //买卖量条
                var MaxCount = [];
                MaxCount.push(json.data.f32, json.data.f34, json.data.f36, json.data.f38, json.data.f40, json.data.f20, json.data.f18, json.data.f16, json.data.f14, json.data.f12);
                if(json.data.f31 > json.data.f60) {
                    $("#quote-s5vp").css('background','red');         
                }else if(json.data.f31 < json.data.f60) {
                    $("#quote-s5vp").css('background','green');
                }else if(json.data.f31 == json.data.f60){
                    $("#quote-s5vp").css('background','red');
                }
                //sell 4
                if(json.data.f33 > json.data.f60) {
                    $("#quote-s4vp").css('background','red');
                }else if(json.data.f33 < json.data.f60) {
                    $("#quote-s4vp").css('background','green');
                }else if(json.data.f33 == json.data.f60){
                    $("#quote-s4vp").css('background','red');
                }
                //sell 3
                if(json.data.f35 > json.data.f60) {
                    $("#quote-s3vp").css('background','red');
                }else if(json.data.f35 < json.data.f60) {
                    $("#quote-s3vp").css('background','green');
                }else if(json.data.f35 == json.data.f60){
                    $("#quote-s3vp").css('background','red');
                }
                //sell 2
                if(json.data.f37 > json.data.f60) {
                    $("#quote-s2vp").css('background','red');
                }else if(json.data.f37 < json.data.f60) {
                    $("#quote-s2vp").css('background','green');
                }else if(json.data.f37 == json.data.f60){
                    $("#quote-s2vp").css('background','red');
                }
                //sell 1
                if(json.data.f39 > json.data.f60) {
                    $("#quote-s1vp").css('background','red');
                }else if(json.data.f39 < json.data.f60) {
                    $("#quote-s1vp").css('background','green');
                }else if(json.data.f39 == json.data.f60){
                    $("#quote-s1vp").css('background','red');
                }
                //buy 1
                if(json.data.f19 > json.data.f60) {
                    $("#quote-b1vp").css('background','red');
                }else if(json.data.f19 < json.data.f60) {
                    $("#quote-b1vp").css('background','green');
                }else if(json.data.f19 == json.data.f60) {
                    $("#quote-b1vp").css('background','red');
                }
                //buy 2
                if(json.data.f17 > json.data.f60) {
                    $("#quote-b2vp").css('background','red');
                }else if(json.data.f17 < json.data.f60) {
                    $("#quote-b2vp").css('background','green');
                }else if(json.data.f17 == json.data.f60) {
                    $("#quote-b2vp").css('background','red');
                }
                //buy 3
                if(json.data.f15 > json.data.f60) {
                    $("#quote-b3vp").css('background','red');
                }else if(json.data.f15 < json.data.f60) {
                    $("#quote-b3vp").css('background','green');
                }else if(json.data.f15 == json.data.f60) {
                    $("#quote-b3vp").css('background','red');
                }
                //buy 4
                if(json.data.f13 > json.data.f60) {
                    $("#quote-b4vp").css('background','red');
                }else if(json.data.f13 < json.data.f60) {
                    $("#quote-b4vp").css('background','green');
                }else if(json.data.f13 == json.data.f60) {
                    $("#quote-b4vp").css('background','red');
                }
                //buy 5
                if(json.data.f11 > json.data.f60) {
                    $("#quote-b5vp").css('background','red');
                }else if(json.data.f11 < json.data.f60) {
                    $("#quote-b5vp").css('background','green');
                }else if(json.data.f13 == json.data.f60) {
                    $("#quote-b5vp").css('background','red');
                }
                sellbuyp(MaxCount)
                // console.info(2)
                if(json.data.f58&&json.data.f43&&json.data.f170&&json.data.f169&&json.data.f43!='-'&&json.data.f170!='-'&&json.data.f169!='-'){
                    document.title = (json.data.f58 + " " + json.data.f43.toFixed(2) + " " + json.data.f169.toFixed(2) + "(" + json.data.f170.toFixed(2) + "%) _ 股票行情 _ 东方财富网");                      
                }else{
                    document.title = (json.data.f58 + " _ 股票行情 _ 东方财富网");                                          
                }
            }      
        });
        
    }
    setInterval(function () {
        disquote()                            
    },24000); 
    this.disquote_sse = disquote_sse;
    //个股行情推送
    function disquote_sse(){     
        var market_01=stockentry.marketnum==1?1:0; var market_01=stockentry.marketnum==1?1:0;

        // var url = "http://"+(Math.floor(Math.random() * 99) + 1)+".push2.eastmoney.com/api/qt/stock/sse?ut=fa5fd1943c7b386f172d6893dbfba10b&fltt=2&fields=f120,f121,f122,f174,f175,f59,f163,f43,f57,f58,f169,f170,f46,f44,f51,f168,f47,f164,f116,f60,f45,f52,f50,f48,f167,f117,f71,f161,f49,f530,f135,f136,f137,f138,f139,f141,f142,f144,f145,f147,f148,f140,f143,f146,f149,f55,f62,f162,f92,f173,f104,f105,f84,f85,f183,f184,f185,f186,f187,f188,f189,f190,f191,f192,f107,f111,f86,f177,f78,f110,f262,f263,f264,f267,f268,f255,f256,f257,f258,f127,f199,f128,f198,f259,f260,f261,f171,f277,f278,f279,f288,f152,f250,f251,f252,f253,f254,f269,f270,f271,f272,f273,f274,f275,f276,f265,f266,f289,f290&secid="+market_01+'.' +stockentry.code;

        var url = pathConfig.getEnvPath("tsApi")+"api/qt/stock/sse?ut=fa5fd1943c7b386f172d6893dbfba10b&fltt=2&fields=f120,f121,f122,"
        +"f174,f175,f59,f163,f43,f57,f58,f169,f170,f46,f44,f51,f168,f47,f164,f116,f60,f45,f52,f50,f48,f167,f117,f71,f161,f49,f530,f135,"
        +"f136,f137,f138,f139,f141,f142,f144,f145,f147,f148,f140,f143,f146,f149,f55,f62,f162,f92,f173,f104,f105,f84,f85,f183,f184,f185,"
        +"f186,f187,f188,f189,f190,f191,f192,f107,f111,f86,f177,f78,f110,f262,f263,f264,f267,f268,f255,f256,f257,f258,f127,f199,f128,f198,"
        +"f259,f260,f261,f171,f277,f278,f279,f288,f152,f250,f251,f252,f253,f254,f269,f270,f271,f272,f273,f274,f275,f276,f265,f266,f289,f290"
        +",f294,f295&secid="+market_01+'.' +stockentry.code;

        //测试地址
        // url = 'http://61.152.230.207/api/qt/stock/sse?ut=fa5fd1943c7b386f172d6893dbfba10b&invt=2&fltt=2&fields=f120,f121,f122,f174,f175,f59,f163,f43,f57,f58,f169,f170,f46,f44,f51,f168,f47,f164,f116,f60,'
        //     + 'f45,f52,f50,f48,f167,f117,f71,f161,f49,f530,f135,f136,f137,f138,f139,f141,f142,f144,f145,f147,f148,f140,f143,'
        //     + 'f146,f149,f55,f62,f162,f92,f173,f104,f105,f84,f85,f183,f184,f185,f186,f187,f188,f189,f190,f191,f192,f107,f111,'
        //     + 'f86,f177,f78,f110,f262,f263,f264,f267,f268,f255,f256,f257,f258,f127,f199,f128,f198,f259,f260,f261,f171,f277,f278,'
        //     + 'f279,f288,f152,f250,f251,f252,f253,f254,f269,f270,f271,f272,f273,f274,f275,f276,f265,f266,f289,f290,f286,f285,'
        //     + 'f292,f294,f295&secid=0.302004'

       

        // var url = "http://61.129.249.233:18665/api/qt/stock/sse?ut=fa5fd1943c7b386f172d6893dbfba10b&fltt=2&fields=f120,f121,f122,f174,f175,f59,f163,f43,f57,f58,f169,f170,f46,f44,f51,f168,f47,f164,f116,f60,f45,f52,f50,f48,f167,f117,f71,f161,f49,f530,f135,f136,f137,f138,f139,f141,f142,f144,f145,f147,f148,f140,f143,f146,f149,f55,f62,f162,f92,f173,f104,f105,f84,f85,f183,f184,f185,f186,f187,f188,f189,f190,f191,f192,f107,f111,f86,f177,f78,f110,f262,f263,f264,f267,f268,f255,f256,f257,f258,f127,f199,f128,f198,f259,f260,f261,f171,f277,f278,f279,f288,f152,f250,f251,f252,f253,f254,f269,f270,f271,f272,f273,f274,f275,f276,f265,f266,f289,f290&secid="+market_01+'.' +stockentry.code;
        // var url = "http://"+(Math.floor(Math.random() * 99) + 1)+".push2.eastmoney.com/api/qt/stock/sse?ut=fa5fd1943c7b386f172d6893dbfba10b&fltt=2&fields=f120,f121,f122,f174,f175,f59,f163,f43,f57,f58,f169,f170,f46,f44,f51,f168,f47,f164,f116,f60,f45,f52,f50,f48,f167,f117,f71,f161,f49,f530,f135,f136,f137,f138,f139,f141,f142,f144,f145,f147,f148,f140,f143,f146,f149,f55,f62,f162,f92,f173,f104,f105,f84,f85,f183,f184,f185,f186,f187,f188,f189,f190,f191,f192,f107,f111,f86,f177,f78,f110,f262,f263,f264,f267,f268,f255,f256,f257,f258,f127,f199,f128,f198,f259,f260,f261,f171,f277,f278,f279,f288,f152,f250,f251,f252,f253,f254,f269,f270,f271,f272,f273,f274,f275,f276,f265,f266,f289,f290&secid="+market_01+'.' +stockentry.code;
        var evtSource = new EventSource(url);
        // console.info('-----------------------' + url)
        // console.info(EventSource)
        var yestoday,maxvolume=[],titlename,titleprice,titlezdf,titlezde;
        evtSource.onmessage = function (msg) {
            // console.log('886886886886886')
            var json = JSON.parse(msg.data);
            var data = json.data;
            if(!json.data) return
            //交易状态
            tradestatus(json);
            
            // console.info(json.data)
            if(json.data.f60){
                yestoday=json.data.f60;
            }
            if(json.data.f32&&json.data.f34&&json.data.f36&&json.data.f38&&json.data.f40&&json.data.f20&&json.data.f18&&json.data.f16&&json.data.f14&&json.data.f12){
                maxvolume.push(json.data.f32, json.data.f34, json.data.f36, json.data.f38, json.data.f40, json.data.f20, json.data.f18, json.data.f16, json.data.f14, json.data.f12);                
            }
            if(json.data.f58){
                titlename = json.data.f58;
            }

            if (json.data.f43 != undefined && json.data.f43!='-') {
                titleprice = json.data.f43.toFixed(2)
            }
            if (json.data.f170 != undefined && json.data.f170!='-') {
                titlezdf = json.data.f170.toFixed(2)
            }
            if (json.data.f169 != undefined && json.data.f169!='-') {
                titlezde = json.data.f169.toFixed(2);
            }

            if(json.data.f43 != undefined && json.data.f43!='-'){
                //titleprice = json.data.f43.toFixed(2);
                //debugger
                document.title = (titlename + " " + titleprice + " " + titlezde + "(" + titlezdf + "%) _ 股票行情 _ 东方财富网");
            }
            if(json.data.f170 != undefined && json.data.f170!='-'){
                //titlezdf = json.data.f170.toFixed(2);
                document.title = (titlename + " " + titleprice + " " + titlezde + "(" + titlezdf + "%) _ 股票行情 _ 东方财富网");
            }
            if(json.data.f169 != undefined && json.data.f169!='-'){
                //titlezde = json.data.f169.toFixed(2);
                document.title = (titlename + " " + titleprice + " " + titlezde + "(" + titlezdf + "%) _ 股票行情 _ 东方财富网");
            }
             
            if(json.data.f86){
                //新版时间
                var time = formateDate(new Date(json.data.f86*1000), "yyyy-MM-dd");
                var minute = (new Date(json.data.f86*1000).toString()).split(" ");
                var d = new Date();
                $("#quote-time").html(time+' '+minute[4]);
            }
            if(json.data.f43){
                $("#quote-close-main").html(json.data.f43.toFixed(2)) 
                blinker(json.data.f169,$("#quote-close-main"))    
                $("#quote-close-custom").html(json.data.f43.toFixed(2));//最新   
                blinker(json.data.f169,$("#quote-close-custom"));  
                var titlepricesse=json.data.f43.toFixed(2);
                document.title = (titlename + " " + titlepricesse + " " + titlezde + "(" + titlezdf + "%) _ 股票行情 _ 东方财富网");
            }
            else if(json.data.f43 === 0){
                $("#quote-close-main").html(json.data.f43.toFixed(2)) 
                // console.info(222)
            }

            if(json.data.f169&&json.data.f169!='-'){
                var titlezdesse =json.data.f169.toFixed(2);

                document.title = (titlename + " " + titleprice + " " + titlezdesse + "(" + titlezdf + "%) _ 股票行情 _ 东方财富网");                
                $("#quote-change-main").html(json.data.f169.toFixed(2));
                if (json.data.f169.toFixed(2).length > 6) {
                    $("#quote-change-main").css({ "font-size": "12px" })
                    $("#quote-changePercent-main").css({ "font-size": "12px" })
                }
                blinker(json.data.f169,$("#quote-change-main")) 
                if(json.data.f169<0){
                    $("#quote-close-main").css('color','green');
                    $("#quote-arrow").removeClass('icon-big-arrow-up');
                    $("#quote-arrow").addClass('icon-big-arrow-down');
                    $("#quote-change-main").css('color','green');
                    $("#quote-changePercent-main").css('color','green');
                    $("#quote-close-custom").css('color','green');
                }else if(json.data.f169>0){
                    $("#quote-close-main").css('color','red');
                    $("#quote-arrow").removeClass('icon-big-arrow-down')
                    $("#quote-arrow").addClass('icon-big-arrow-up');
                    $("#quote-change-main").css('color','red');
                    $("#quote-changePercent-main").css('color','red');
                    $("#quote-close-custom").css('color','red');
                }
            }
            else if(json.data.f169 === 0){
                $("#quote-change-main").html(json.data.f169.toFixed(2));
            }

            if (json.data.f169 == 0 || json.data.f169 == "-"){
                $("#quote-close-main").css('color', '');
                $("#quote-arrow").removeClass('icon-big-arrow-up icon-big-arrow-down')
                $("#quote-change-main").css('color', '');
                $("#quote-changePercent-main").css('color', '');
                $("#quote-close-custom").css('color', '');
            }

            if(json.data.f170&&json.data.f170!='-'){
                var titlezdfsse =json.data.f170.toFixed(2);
                document.title = (titlename + " " + titleprice + " " + titlezde + "(" + titlezdfsse + "%) _ 股票行情 _ 东方财富网"); 
                var zdfstr = json.data.f170.toFixed(2) + "%"
                if(json.data.f170>=1000){
                    zdfstr = (json.data.f170 / 100).toFixed(2) + "倍"
                    $("#quote-changePercent-main").html(zdfstr) //.addClass(udcls(json.data.f170));   
                }else{
                    $("#quote-changePercent-main").html(zdfstr) //.addClass(udcls(json.data.f170));            
                }
                blinker(json.data.f170,$("#quote-changePercent-main")) 
                if (zdfstr.length>6){
                    $("#quote-change-main").css({"font-size":"12px"})
                    $("#quote-changePercent-main").css({ "font-size": "12px" })
                }
            }
            else if(json.data.f170 === 0){
                $("#quote-changePercent-main").html(json.data.f170.toFixed(2)+"%") //.addClass(udcls(json.data.f170));  
            }

            if(json.data.f168){
                $("#quote-turnoverRate-custom").html(json.data.f168.toFixed(2)+"%")//换手
                $("#quote-turnoverRate").html(json.data.f168.toFixed(2)+"%")
                blinker(0,$("#quote-turnoverRate-custom"))
                blinker(0,$("#quote-turnoverRate"))
            }
            if(json.data.f47){
                if(json.data.f47<10000){
                    $("#quote-volume-custom").html(json.data.f47+ "手")
                }else{
                    $("#quote-volume-custom").html(fmtdig(json.data.f47, 1, 2, "", true) + "手");//成交量                               
                }
                blinker(0,$("#quote-volume-custom"))
            }
            if(json.data.f162){
                $("#quote-PERation-custom").html(json.data.f162.toFixed(2));//市盈
                blinker(0,$("#quote-PERation-custom"))
                $("#quote-PERation").html(json.data.f162.toFixed(2));//市盈
                blinker(0,$("#quote-PERation"))
            }
            if(json.data.f45){
                $("#quote-low-custom").html(json.data.f45.toFixed(2)).addClass(udcls(json.data.f45,yestoday));//最低        
                blinker(json.data.f169,$("#quote-low-custom"))
            }
            if(json.data.f50){
                $("#quote-volumeRate-custom").html(json.data.f50.toFixed(2));//量比
                $("#quote-volumeRate").html(json.data.f50.toFixed(2));//量比
                blinker(0,$("#quote-volumeRate-custom"))
                blinker(0,$("#quote-volumeRate"))
            }
            if(json.data.f48){
                $("#quote-amount-custom").html(fmtdig(json.data.f48, 1, 2, "", true));//成交额
                blinker(0,$("#quote-amount-custom"))                    
            }
            if(json.data.f44){
                $("#quote-high-custom").html(json.data.f44.toFixed(2)).addClass(udcls(json.data.f44,yestoday));//最高
                blinker(0,$("#quote-high-custom"))                    
            }
            if(json.data.f260){
                $("#quote-aftervolume-custom").html(fmtdig(json.data.f260, 1, 2, "", true) + "手");//盘后成交量        
                blinker(0,$("#quote-aftervolume-custom"))                    
            }
            if(json.data.f261){
                $("#quote-afteramount-custom").html(fmtdig(json.data.f261, 1, 2, "", true));//盘后成交额     
                blinker(0,$("#quote-afteramount-custom"))                    
            }
            if(json.data.f171){
                $("#quote-amplitude-custom").html(json.data.f171.toFixed(2)+'%');//振幅
                blinker(0,$("#quote-amplitude-custom"))                    
            }

            if(json.data.f71){
                $("#quote-avg").removeClass('red')
                $("#quote-avg").removeClass('green')
                $("#quote-avg").html(json.data.f71.toFixed(2)).addClass(udcls(json.data.f71,yestoday));//均价    
                blinker(0,$("#quote-avg"))                    
            }
            if(json.data.f191){
                $("#quote-cr").removeClass('red')
                $("#quote-cr").removeClass('green')
                $("#quote-cr").html(json.data.f191.toFixed(2) + "%").addClass(udcls(json.data.f191));//委比        
                blinker(json.data.f191,$("#quote-cr")) 
            }
            if(json.data.f192){
                $("#quote-cd").removeClass('red')
                $("#quote-cd").removeClass('green')
                $("#quote-cd").html(json.data.f192).addClass(udcls(json.data.f192));//委差        
                blinker(json.data.f192,$("#quote-cd"))      
            }
            if(json.data.f49){
                if(json.data.f49<10000){
                    $("#quote-buyOrder-custom").html(json.data.f49).addClass('red');//外盘
                    $("#quote-buyOrder").html(json.data.f49).addClass('red');//外盘
                }else{
                    $("#quote-buyOrder-custom").html(fmtdig(json.data.f49, 1, 2, "", true)).addClass('red');//外盘
                    $("#quote-buyOrder").html(fmtdig(json.data.f49, 1, 2, "", true)).addClass('red');//外盘
                }
                blinker(1,$("#quote-buyOrder-custom"))
                blinker(1,$("#quote-buyOrder"))
            }
            if(json.data.f161){
                if(json.data.f161<10000){
                    $("#quote-sellOrder-custom").html(json.data.f161).addClass('green');//内盘
                    $("#quote-sellOrder").html(json.data.f161).addClass('green');//内盘
                }else{
                    $("#quote-sellOrder-custom").html(fmtdig(json.data.f161, 1, 2, "", true)).addClass('green');
                    $("#quote-sellOrder").html(fmtdig(json.data.f161, 1, 2, "", true)).addClass('green');
                }
                blinker(-1,$("#quote-sellOrder-custom"))
                blinker(-1,$("#quote-sellOrder"))
            }
            if(json.data.f84){
                $("#quote-totalShare-custom").html(fmtdig(json.data.f84, 1, 2, "", true));
                $("#quote-totalShare").html(fmtdig(json.data.f84, 1, 2, "", true));
            }
            if(json.data.f117){
                $("#quote-flowCapitalValue-custom").html(fmtdig(json.data.f117, 1, 2, "", true));
                blinker(0,$("#quote-flowCapitalValue-custom")) 
                $("#quote-flowCapitalValue").html(fmtdig(json.data.f117, 1, 2, "", true));
                blinker(0,$("#quote-flowCapitalValue")) 
            }
            if(json.data.f116){
                $("#quote-marketValue-custom").html(fmtdig(json.data.f116, 1, 2, "", true));
                blinker(0,$("#quote-marketValue-custom")) 
                $("#quote-marketValue").html(fmtdig(json.data.f116, 1, 2, "", true));
                blinker(0,$("#quote-marketValue")) 
            }
            if(json.data.f167){
                $("#quote-PB-custom").html(json.data.f167);//市净率
                blinker(0,$("#quote-PB-custom")) 
                $("#quote-PB").html(json.data.f167);
                blinker(0,$("#quote-PB")) 
            }
            if(json.data.f163){
                $("#quote-staticPERation-custom").html(json.data.f163);//静态市盈
                blinker(0,$("#quote-staticPERation-custom")) 
                $("#quote-staticPERation").html(json.data.f163);//静态市盈
                blinker(0,$("#quote-staticPERation")) 
            }
            if(json.data.f173){
                $("#quote-ROE").html(json.data.f173+'%');//ROE
            }  
            if(json.data.f55){
                $("#quote-EPS-custom").html(json.data.f55.toFixed(3));
                $("#quote-EPS").html(json.data.f55.toFixed(3));
            }
            if(json.data.f92){
                $("#quote-NAPS-custom").html(json.data.f92.toFixed(2));
                $("#quote-NAPS").html(json.data.f92.toFixed(2));
            }
            if(json.data.f174){
                $("#quote-52highest-custom").html(json.data.f174.toFixed(json.data.f59));
                blinker(0,$("#quote-52highest-custom")) 
            }
            if(json.data.f175){
                $("quote-52lowest-custom").html(json.data.f175.toFixed(json.data.f59));
                blinker(0,$("#quote-52lowest-custom")) 
            }
            if(json.data.f135){
                if(json.data.f135<10000){
                    $("#quote-BalFlowInOriginal-custom").html(ForDight(parseFloat(json.data.f135/10000), 2)+'万').addClass('red');
                }else{
                    $("#quote-BalFlowInOriginal-custom").html(fmtdig(json.data.f135, 1, 2, "", true)).addClass('red');//外盘
                }
                blinker(1,$("#quote-BalFlowInOriginal-custom")) 
            }
            if(json.data.f136){
                if(json.data.f136<10000){
                    $("#quote-BalFlowOutOriginal-custom").html(ForDight(parseFloat(json.data.f136/10000), 2)+'万').addClass('green');
                }else{
                    $("#quote-BalFlowOutOriginal-custom").html(fmtdig(json.data.f136, 1, 2, "", true)).addClass('green');//外盘
                }
                blinker(-1,$("#quote-BalFlowOutOriginal-custom")) 
            }
            if(json.data.f120){
                if(json.data.f120>=1000){
                    $("#quote-20cp-custom").html((json.data.f120/100).toFixed(2)+"倍").addClass('zdf').addClass(udcls(json.data.f120));            
                }else{
                    $("#quote-20cp-custom").html(json.data.f120.toFixed(2)+"%").addClass('zdf').addClass(udcls(json.data.f120));                     
                }
                blinker(json.data.f120,$("#quote-20cp-custom"))
            }
            if(json.data.f121){
                if(json.data.f121>=1000){
                    $("#quote-60cp-custom").html((json.data.f121/100).toFixed(2)+"倍").addClass('zdf').addClass(udcls(json.data.f121)); 
                }else{
                    $("#quote-60cp-custom").html(json.data.f121.toFixed(2)+"%").addClass('zdf').addClass(udcls(json.data.f121));                     
                }
                blinker(json.data.f121,$("#quote-60cp-custom"))
            }
            if(json.data.f122){
                if(json.data.f122>=1000){
                    $("#quote-360cp-custom").html((json.data.f122/100).toFixed(2)+"倍").addClass('zdf').addClass(udcls(json.data.f122)); 
                }else{
                    $("#quote-360cp-custom").html(json.data.f122.toFixed(2)+"%").addClass('zdf').addClass(udcls(json.data.f122));                     
                }
                blinker(json.data.f122,$("#quote-360cp-custom"))
            }

            // //行情报价
            if(json.data.f31&&json.data.f32){
                $("#quote-s5p").removeClass('red')
                $("#quote-s5p").removeClass('green')
                $("#quote-s5p").html(json.data.f31.toFixed(2)).addClass(udcls(json.data.f31, yestoday)); 
                $("#quote-s5v").html(json.data.f32); 
                blinker(json.data.f31-yestoday,$("#quote-s5p"))  
                blinker(0,$("#quote-s5v"))
                maxvolume[0]=json.data.f32
                sellbuyp(maxvolume)
            }
            if(json.data.f33&&json.data.f34){
                $("#quote-s4p").removeClass('red')
                $("#quote-s4p").removeClass('green')
                $("#quote-s4p").html(json.data.f33.toFixed(2)).addClass(udcls(json.data.f33, yestoday)); $("#quote-s4v").html(json.data.f34); 
                blinker(json.data.f33-yestoday,$("#quote-s4p"))  
                blinker(0,$("#quote-s4v"))
                maxvolume[1]=json.data.f34
                sellbuyp(maxvolume)
            }
            if(json.data.f35&&json.data.f36){
                $("#quote-s3p").removeClass('red')
                $("#quote-s3p").removeClass('green')
                $("#quote-s3p").html(json.data.f35.toFixed(2)).addClass(udcls(json.data.f35, yestoday)); $("#quote-s3v").html(json.data.f36); 
                blinker(json.data.f35-yestoday,$("#quote-s3p"))  
                blinker(0,$("#quote-s3v"))
                maxvolume[2]=json.data.f36
                sellbuyp(maxvolume)
            }
            if(json.data.f37&&json.data.f38){
                $("#quote-s2p").removeClass('red')
                $("#quote-s2p").removeClass('green')
                $("#quote-s2p").html(json.data.f37.toFixed(2)).addClass(udcls(json.data.f37, yestoday)); $("#quote-s2v").html(json.data.f38); 
                blinker(json.data.f37-yestoday,$("#quote-s2p"))  
                blinker(0,$("#quote-s2v"))
                maxvolume[3]=json.data.f38
                sellbuyp(maxvolume)
            }
            if(json.data.f39&&json.data.f40){
                $("#quote-s1p").removeClass('red')
                $("#quote-s1p").removeClass('green')
                $("#quote-s1p").html(json.data.f39.toFixed(2)).addClass(udcls(json.data.f39, yestoday)); $("#quote-s1v").html(json.data.f40); 
                blinker(json.data.f39-yestoday,$("#quote-s1p"))  
                blinker(0,$("#quote-s1v"))
                maxvolume[4]=json.data.f40
                sellbuyp(maxvolume)
            }
            if(json.data.f19&&json.data.f20){
                $("#quote-b1p").removeClass('red')
                $("#quote-b1p").removeClass('green')
                $("#quote-b1p").html(json.data.f19.toFixed(2)).addClass(udcls(json.data.f19, yestoday)); $("#quote-b1v").html(json.data.f20); 
                blinker(json.data.f19-yestoday,$("#quote-b1p"))  
                blinker(0,$("#quote-b1v"))
                maxvolume[5]=json.data.f20
                sellbuyp(maxvolume)
            }
            if(json.data.f17&&json.data.f18){
                $("#quote-b2p").removeClass('red')
                $("#quote-b2p").removeClass('green')
                $("#quote-b2p").html(json.data.f17.toFixed(2)).addClass(udcls(json.data.f17, yestoday)); $("#quote-b2v").html(json.data.f18); 
                blinker(json.data.f17-yestoday,$("#quote-b2p"))  
                blinker(0,$("#quote-b2v"))
                maxvolume[6]=json.data.f18
                sellbuyp(maxvolume)
            }
            if(json.data.f15&&json.data.f16){
                $("#quote-b3p").removeClass('red')
                $("#quote-b3p").removeClass('green')
                $("#quote-b3p").html(json.data.f15.toFixed(2)).addClass(udcls(json.data.f15, yestoday)); $("#quote-b3v").html(json.data.f16); 
                blinker(json.data.f15-yestoday,$("#quote-b3p"))  
                blinker(0,$("#quote-b3v"))
                maxvolume[7]=json.data.f16
                sellbuyp(maxvolume)
            }
            if(json.data.f13&&json.data.f14){
                $("#quote-b4p").removeClass('red')
                $("#quote-b4p").removeClass('green')
                $("#quote-b4p").html(json.data.f13.toFixed(2)).addClass(udcls(json.data.f13, yestoday)); $("#quote-b4v").html(json.data.f14); 
                blinker(json.data.f13-yestoday,$("#quote-b4p"))  
                blinker(0,$("#quote-b4v"))
                maxvolume[8]=json.data.f14
                sellbuyp(maxvolume)
            }
            if(json.data.f11&&json.data.f12){
                $("#quote-b5p").removeClass('red')
                $("#quote-b5p").removeClass('green')
                $("#quote-b5p").html(json.data.f11.toFixed(2)).addClass(udcls(json.data.f11, yestoday)); $("#quote-b5v").html(json.data.f12); 
                blinker(json.data.f11-yestoday,$("#quote-b5p"))  
                blinker(0,$("#quote-b5v"))
                maxvolume[9]=json.data.f12
                sellbuyp(maxvolume)
            } 
            if(json.data.f31 > yestoday) {
                $("#quote-s5vp").css('background','red');         
            }else if(json.data.f31 < yestoday) {
                $("#quote-s5vp").css('background','green');
            }else if(json.data.f31 == yestoday){
                $("#quote-s5vp").css('background','red');
            }
            //sell 4
            if(json.data.f33 > yestoday) {
                $("#quote-s4vp").css('background','red');
            }else if(json.data.f33 < yestoday) {
                $("#quote-s4vp").css('background','green');
            }else if(json.data.f33 == yestoday){
                $("#quote-s4vp").css('background','red');
            }
            //sell 3
            if(json.data.f35 > yestoday) {
                $("#quote-s3vp").css('background','red');
            }else if(json.data.f35 < yestoday) {
                $("#quote-s3vp").css('background','green');
            }else if(json.data.f35 == yestoday){
                $("#quote-s3vp").css('background','red');
            }
            //sell 2
            if(json.data.f37 > yestoday) {
                $("#quote-s2vp").css('background','red');
            }else if(json.data.f37 < yestoday) {
                $("#quote-s2vp").css('background','green');
            }else if(json.data.f37 == yestoday){
                $("#quote-s2vp").css('background','red');
            }
            //sell 1
            if(json.data.f39 > yestoday) {
                $("#quote-s1vp").css('background','red');
            }else if(json.data.f39 < yestoday) {
                $("#quote-s1vp").css('background','green');
            }else if(json.data.f39 == yestoday){
                $("#quote-s1vp").css('background','red');
            }
            //buy 1
            if(json.data.f19 > yestoday) {
                $("#quote-b1vp").css('background','red');
            }else if(json.data.f19 < yestoday) {
                $("#quote-b1vp").css('background','green');
            }else if(json.data.f19 == yestoday) {
                $("#quote-b1vp").css('background','red');
            }
            //buy 2
            if(json.data.f17 > yestoday) {
                $("#quote-b2vp").css('background','red');
            }else if(json.data.f17 < yestoday) {
                $("#quote-b2vp").css('background','green');
            }else if(json.data.f17 == yestoday) {
                $("#quote-b2vp").css('background','red');
            }
            //buy 3
            if(json.data.f15 > yestoday) {
                $("#quote-b3vp").css('background','red');
            }else if(json.data.f15 < yestoday) {
                $("#quote-b3vp").css('background','green');
            }else if(json.data.f15 == yestoday) {
                $("#quote-b3vp").css('background','red');
            }
            //buy 4
            if(json.data.f13 > yestoday) {
                $("#quote-b4vp").css('background','red');
            }else if(json.data.f13 < yestoday) {
                $("#quote-b4vp").css('background','green');
            }else if(json.data.f13 == yestoday) {
                $("#quote-b4vp").css('background','red');
            }
            //buy 5
            if(json.data.f11 > yestoday) {
                $("#quote-b5vp").css('background','red');
            }else if(json.data.f11 < yestoday) {
                $("#quote-b5vp").css('background','green');
            }else if(json.data.f13 == yestoday) {
                $("#quote-b5vp").css('background','red');
            }
            //买卖差量 
            if(json.data.f206 ==0) {
                $("#quote-s5d").html('')
            }   
            if(json.data.f206) {
                $("#quote-s5d").removeClass('red')
                $("#quote-s5d").removeClass('green')
                $("#quote-s5d").html(addfigure(json.data.f206)).addClass(udcls(json.data.f206))
            }
            if(json.data.f207 ==0) {
                $("#quote-s4d").html('')
            }
            if(json.data.f207) {
                $("#quote-s4d").removeClass('red')
                $("#quote-s4d").removeClass('green')
                $("#quote-s4d").html(addfigure(json.data.f207)).addClass(udcls(json.data.f207)) 
            }
            if(json.data.f208 ==0) {
                $("#quote-s3d").html('')
            }
            if(json.data.f208) {
                $("#quote-s3d").removeClass('red')
                $("#quote-s3d").removeClass('green')
                $("#quote-s3d").html(addfigure(json.data.f208)).addClass(udcls(json.data.f208)) 
            }
            if(json.data.f209 ==0) {
                $("#quote-s2d").html('')
            }
            if(json.data.f209) {
                $("#quote-s2d").removeClass('red')
                $("#quote-s2d").removeClass('green')
                $("#quote-s2d").html(addfigure(json.data.f209)).addClass(udcls(json.data.f209))
            }
            if(json.data.f210 ==0) {
                $("#quote-s1d").html('')
            }
            if(json.data.f210) {
                $("#quote-s1d").removeClass('red')
                $("#quote-s1d").removeClass('green')
                $("#quote-s1d").html(addfigure(json.data.f210)).addClass(udcls(json.data.f210))
            }
            if(json.data.f211 ==0) {
                $("#quote-b1d").html('')
            }
            if(json.data.f211) {
                $("#quote-b1d").removeClass('red')
                $("#quote-b1d").removeClass('green')
                $("#quote-b1d").html(addfigure(json.data.f211)).addClass(udcls(json.data.f211))
            }
            if(json.data.f212 ==0) {
                $("#quote-b2d").html('')
            }
            if(json.data.f212) {
                $("#quote-b2d").removeClass('red')
                $("#quote-b2d").removeClass('green')
                $("#quote-b2d").html(addfigure(json.data.f212)).addClass(udcls(json.data.f212))
            }
            if(json.data.f213 ==0) {
                $("#quote-b3d").html('')
            }
            if(json.data.f213) {
                $("#quote-b3d").removeClass('red')
                $("#quote-b3d").removeClass('green')
                $("#quote-b3d").html(addfigure(json.data.f213)).addClass(udcls(json.data.f213)) 
            }
            if(json.data.f214 ==0) {
                $("#quote-b4d").html('')
            }
            if(json.data.f214) {
                $("#quote-b4d").removeClass('red')
                $("#quote-b4d").removeClass('green')
                $("#quote-b4d").html(addfigure(json.data.f214)).addClass(udcls(json.data.f214)) 
            } 
            if(json.data.f215 == 0) {
                $("#quote-b5d").html('')
            }
            if(json.data.f215) {
                $("#quote-b5d").removeClass('red')
                $("#quote-b5d").removeClass('green')
                $("#quote-b5d").html(addfigure(json.data.f215)).addClass(udcls(json.data.f215)) 
            }
        }
    }
    this.nufmLoader = nufmLoader;
    // this.renderChart = function () {
    //     var authority = new stockAuthorityType(),
    //         at = authority.get();

    //     /**
    //      * 筹码显示类型
    //      */
    //     var cyqtypes = ['k', 'wk', 'mk', 'm5k', 'm15k', 'm30k', 'm60k'];
    //     var options = {
    //         entry: stockentry,
    //         type: 'r',
    //         iscr: tsq.status === 'pre',
    //         authorityType: at,
    //         onError: function (err) {
    //             console.error(err);
    //         },
    //         onComplete: function () {
    //             $('#chart-container').trigger('drawComplete.emchart');
    //         },
    //         padding: {
    //             top: 10,
    //             bottom: 0
    //         },
    //         update: tsq.status === 'close' ? -1 : 60 * 1000
    //     };

    //     this.chartType = options.type;
        
    //     // var timeloader = new chartManger('time', options),
    //     var  kloader = new chartManger('k', options),
    //         //timechart = timeloader.load(),
    //         kchart;
    //     var fschart = new fullscreenchart({
    //         stockentry: args.entry,
    //         chartOptions: options
    //     }).bind();
    //     $('#quote-time').on('tick', function (e, time, status) {
    //         if (status === 'close') {
    //             // timeloader.stop();
    //             kloader.stop();
    //         }
    //     });
    //     var $cr = $('#type-selector a[data-type=cr]');
    //     $('#quote-time').one('tick', function (e, time, status) {
    //         if (status === 'pre') {
    //             if (!$cr.hasClass('cur')) $cr.click();
    //         }
    //     });
    //     $('#quote-close-main').on('tsq.change', function (e, data) {
    //         if (!timechart) return false;
    //         var chartdata = timeloader.datacache.time;
    //         if (chartdata && chartdata.data instanceof Array) {
    //             var minute = chartdata.data.pop();
    //             if (typeof minute === 'string') {
    //                 var items = minute.split(',');
    //                 if (items[1] != data) {
    //                     items[1] = data;
    //                     // chartdata.data.push(items.join(','));
    //                     // timechart.setData(timeloader.datacache);
    //                     // timechart.redraw();
    //                 } else {
    //                     // chartdata.data.push(minute);
    //                 }
    //             }
    //         }
    //     });
    //     $('#kr-box').on('selectstart', function (e) {
    //         return false;
    //     });

    //     $('#type-selector .dataType').click(function (e) {
    //         var ndays=$("#day-selector .selected-box").html().substring(0,1);
    //         $('#authority-options').hide();
    //         $('#kr-box .rk-options').hide();
    //         $('#kr-box .select-icon').removeClass("select-up");
    //         $('#select-authority').removeClass('cur');
    //         // var chartloader = timeloader;
    //         var $dom = $(this);
    //         if ($dom.hasClass('cur')) return false;
    //         var type = $dom.data('type');
    //         var displayTools = false;
    //         $('#type-selector .dataType.cur').removeClass('cur');
    //         options.type = type;
    //         options.iscr = false;
    //         if (type === 'r') {
    //         } else if (type === 'cr') {
    //             options.iscr = true;
    //             options.type = 'r';
    //         } else if (['t2', 't3', 't4', 't5'].indexOf(type) >= 0) {
    //             $('#day-selector').addClass('cur');
    //             $('#day-selector .rk-options').hide();
    //         } else {
    //             displayTools = true;
    //             $('#day-selector').removeClass('cur');
    //             if (cyqtypes.indexOf(type) < 0) {
    //                 $('#btn-cyq').hide();
    //                 if ($('#btn-cyq').hasClass('cur')) {
    //                     $('#btn-cyq').click();
    //                 }
    //                 $('#select-authority').hide();
    //                 options.yAxisType = 2;
    //             } else {
    //                 $('#btn-cyq').show();
    //                 $('#select-authority').show();
    //             }
    //             chartloader = kloader;
    //         }
    //         // $('#chart-container').data('chartType', options.type);
    //         displayKChartToolBar(displayTools);
    //         $dom.addClass('cur');
    //         var currentchart = chartloader.load();
    //         console.log(options.type)
    //         console.log(type)
    //         if (options.type === 'r'||options.type === 'cr'||options.type === 'nr'||options.type == 't1'||options.type == 't2'||options.type == 't3'||options.type == 't4'||options.type == 't5') {
    //             if(type === 'r'){
    //                 timefigure(0,1);
    //             }
    //             else if(type === 'cr'){
    //                 timefigure(1,1);
    //             }
    //             else if(type === 'nr'){
    //                 console.log(parseInt(ndays))
    //                 timefigure(0,parseInt(ndays),'t'+ndays);
    //             }else if(type == 't1'){
    //                 timefigure(0,1);
    //             }else if(type == 't2'){
    //                 timefigure(0,2,'t2');
    //             }else if(type == 't3'){
    //                 console.log('33333333333333333333333333')
    //                 timefigure(0,3,'t3');
    //             }else if(type == 't4'){
    //                 timefigure(0,4,'t4');
    //             }else if(type == 't5'){
    //                 timefigure(0,5,'t5');
    //             }
               
    //         } else {
    //             kchart = chartloader.load();
    //         }
    //         return false;
    //     });


    //     // 多日分时逻辑
    //     $('#day-selector .click-icon').click(function (event) {
    //         if ($('#day-selector .select-icon').hasClass('select-up')) {
    //             $('#day-selector .rk-options').hide();
    //             $('#day-selector .select-icon').removeClass("select-up");
    //         } else {
    //             $('#day-selector .rk-options').show();
    //             $('#day-selector .select-icon').addClass("select-up");
    //         }
    //         return false;
    //     });

    //     $('#day-selector i').click(function () {
    //         displayKChartToolBar(false);
    //         var $dom = $(this);
    //         $('#day-selector .rk-options').hide();
    //         $('#day-selector .select-icon').removeClass("select-up");
    //         if ($dom.hasClass('cur')) return false;
    //         var type = $dom.data('type');
    //         var curhtml = $dom.html();
    //         //var dayhtml = $('#day-selector i.cur').html();
    //         if (type == "r") {
    //             //$('#day-selector .selected-box').html(dayhtml).attr('data-type', type);
    //             $("#day-selector").removeClass("cur");
    //             $('#type-selector .dataType').removeClass('cur');
    //             $('#type-selector .fshBox').addClass("cur");
    //         } else {
    //             $('#type-selector .dataType').removeClass("cur");
    //             $('#day-selector').addClass("cur").data('type', type);
    //             $('#day-selector .selected-box').html(curhtml);
    //             $('#day-selector i').removeClass('cur');
    //             $dom.addClass('cur');
    //         }
    //         options.iscr = false;
    //         options.type = type;
    //         // timechart = timeloader.load();
    //         return false;
    //     });

    //     // 拉长缩短
    //     $('#btn-stretchout').click(function (e) {
    //         $('.rk-options').hide();
    //         $('.select-icon').removeClass("select-up");
    //         $('#select-authority').removeClass('cur');
    //         if (typeof kchart.elongate === 'function')
    //             kchart.elongate();
    //         return false;
    //     });
    //     $('#btn-drawback').click(function (e) {
    //         $('.rk-options').hide();
    //         $('.select-icon').removeClass("select-up");
    //         $('#select-authority').removeClass('cur');
    //         if (typeof kchart.shorten === 'function')
    //             kchart.shorten();
    //         return false;
    //     });

    //     // 默认逻辑
    //     if (typeof at === 'string') {
    //         $('#authority-options i').removeClass('cur')
    //         $('#authority-options i').each(function () {
    //             if ($(this).attr('value') == at) {
    //                 var html = $(this).html();
    //                 var val = $(this).attr('value');
    //                 $(this).addClass('cur');
    //                 $("#authority-options i.cur").html();
    //                 $("#select-authority .selected-box").html(html).attr('value', val);
    //             }
    //         });
    //     }

    //     // 除复权下拉框
    //     $('#select-authority').click(function (event) {
    //         $('#day-selector .rk-options').hide();
    //         $('#day-selector .select-icon').removeClass("select-up");

    //         if ($('#select-authority .select-icon').hasClass("select-up")) {
    //             $('#authority-options').hide();
    //             $('#select-authority').removeClass('cur');
    //             $('#select-authority .select-icon').removeClass("select-up");
    //         } else {
    //             $('#authority-options').show();
    //             $('#select-authority').addClass('cur');
    //             $('#select-authority .select-icon').addClass("select-up");
    //         }
    //         return false;
    //     });

    //     $('#authority-options i').click(function (e) {
    //         var html = $(this).html();
    //         var val = $(this).attr('value');
    //         //var selected_val = $('#select-authority .selected-box').attr('value');
    //         var _html = $('#authority-options i.cur').html();
    //         $('#authority-options').hide();
    //         $('#select-authority').removeClass('cur');
    //         $('#select-authority .select-icon').removeClass("select-up");
    //         if (html == _html) {
    //             return false;
    //         };
    //         $('#authority-options i').removeClass("cur");
    //         $(this).addClass('cur');
    //         $("#select-authority .selected-box").html(html).attr('value', val);
    //         authority.set(val);
    //         options.authorityType = val;
    //         kchart = kloader.load();
    //         return false;
    //     });

    //     $(document).click(function () {
    //         $('#rk-box .rk-options').hide();
    //         $('#rk-box .select-icon').removeClass("select-up");
    //         $('#select-authority').removeClass('cur');
    //         if ($('#day-selector').hasClass('cur') && $('#type-selector .dataType').not(".selected-box").hasClass('cur')) {
    //             $('#day-selector').removeClass('cur');
    //         }
    //     });

    //     var $cyqtips = $('<div class="cyq-tips">' +
    //         '<span class="tips fl">筹码分布<b class="icon-help3"></b></span>' +
    //         '<a class="close fr"><b class="icon-leave"></b>离开</a></div>');
    //     $cyqtips.find('.tips').tooltip({
    //         content: '红色筹码表示低于收盘价的获利筹码，蓝色筹码表示高于收盘价的套牢筹码'
    //     });
    //     $cyqtips.find('.close').click(function (e) {
    //         $('#btn-cyq').click();
    //         return false;
    //     });

    //     //筹码分布点击事件
    //     $('#btn-cyq').click(function (e, redraw) {
    //         choumafenbu(this, redraw, kloader);
            
    //         // if (!$(this).hasClass('cur')) {
    //         //     $(this).addClass('cur');
    //         //     $('.is-hide', $('#primary-quote')).hide();
    //         //     $('#vote-box').addClass('vote-box2');
    //         //     $('#chart-container').trigger('loadcyq.emchart');
    //         // } else {
    //         //     $(this).removeClass('cur');
    //         //     $('.is-hide', $('#primary-quote')).show();
    //         //     $('#vote-box').removeClass('vote-box2');
    //         //     $('#chart-container').trigger('destorycyq.emchart');
    //         // }

    //         // if (redraw !== false) {
    //         //     kchart = kloader.load();
    //         // }
    //         // return false;
    //     });


    //     // 盘前 分页 多日上的筹码分布
    //     $("#cmfb-btn").on("click", function(e, redraw){
    //         $("#type-selector .cur").removeClass("cur");
    //         $("#type-selector .dataType[data-type='k']").addClass("cur");
    //         displayKChartToolBar(true);

    //         $('#chart-container').data('chartType', "k");
    //         options.type = "k";
    //         options.iscr = false;

    //         var chartloader = kloader;
    //         kchart = chartloader.load();

    //         $("#btn-cyq").removeClass("cur");
    //         choumafenbu("#btn-cyq", redraw, kloader);
    //     });

    //     $('#chart-container').on('loadcyq.emchart', function (e) {
    //         $('#chart-container').data('cyq', true);
    //         options.width = 990;
    //         options.cyq = {
    //             width: 270,
    //             gap: 10,
    //             accuracyFactor: 150,
    //             range: 120
    //         }
    //         options.padding.right = 0;
    //     }).on('destorycyq.emchart', function (e) {
    //         var ct = $('#chart-container').data('chartType');
    //         if (cyqtypes.indexOf(ct) >= 0) {
    //             $('#chart-container').data('cyq', false);
    //         }
    //         $cyqtips.hide();
    //         options.width = 720;
    //         options.cyq = false;
    //         options.padding.right = 65;
    //     });
    //     // JS图画图完成事件
    //     $('#chart-container').on('drawComplete.emchart', function (e) {
    //         var opt = $(this).data();
    //         // 筹码分布提示栏 'm5k', 'm15k', 'm30k', 'm60k'
    //         if (opt.cyq && cyqtypes.indexOf(opt.chartType) >= 0) {
    //             $('#chart-container').append($cyqtips.show());
    //         }
    //     }).dblclick(fschart.open);

    //     // hash 控制图表显示状态
    //     var cmds = location.hash.toLowerCase().split('-');
    //     if (cmds.indexOf('#chart') === 0) {
    //         if (cmds.indexOf('cyq') > 0) {
    //             $('#btn-cyq').trigger('click', [false]);
    //         }
    //         if (cmds[1]) $('#type-selector [data-type=' + cmds[1] + ']').click();
    //         location.hash = '';
    //     }

    //     /**
    //      * 显示K图工具栏
    //      * @param {boolean} show 是否显示
    //      */
    //     function displayKChartToolBar(show) {
    //         var displayed = $('#btn-cyq').hasClass('cur');
    //         var cyq = $('#chart-container').data('cyq');
    //         if (show) {
    //             $('#kchart-toolbar').show();
    //             $("#cmfb-btn").hide();
    //             if (cyq && !displayed) {
    //                 $('#btn-cyq').trigger('click', [false]);
    //             }
    //         } else {
    //             $('#kchart-toolbar').hide();
    //             $("#cmfb-btn").show();
    //             if (displayed) {
    //                 $('#btn-cyq').trigger('click', [false]);
    //             }
    //         }
    //     }
    // }
    this.renderChart = function () {
        var authority = new stockAuthorityType(),
            at = authority.get();

        /**
         * 筹码显示类型
         */
        var cyqtypes = ['k', 'wk', 'mk', 'm5k', 'm15k', 'm30k', 'm60k'];
        var options = {
            entry: stockentry,
            type: 'r',
            iscr: tsq.status === 'pre',
            authorityType: at,
            onError: function (err) {
                console.error(err);
            },
            onComplete: function () {
                $('#chart-container').trigger('drawComplete.emchart');
            },
            padding: {
                top: 10,
                bottom: 0
            },
            update: tsq.status === 'close' ? -1 : 60 * 1000
        };

        this.chartType = options.type; 
        
        var timeloader = new chartManger('time', options),
            kloader = new chartManger('k', options),
            timechart = timeloader.load(),
            kchart;
        var fschart = new fullscreenchart({
            stockentry: args.entry,
            chartOptions: options
        }).bind();
        $('#quote-time').on('tick', function (e, time, status) {
            if (status === 'close') {
                timeloader.stop();
                kloader.stop();
            }
        });

        //cr盘前
        var $cr = $('#type-selector a[data-type=cr]'); 
        $('#quote-time').one('tick', function (e, time, status) {
            if (status === 'pre') {
                if (!$cr.hasClass('cur')) $cr.click();
            }
        });
        
        $('#quote-close-main').on('tsq.change', function (e, data) {
            if (!timechart) return false;
            var chartdata = timeloader.datacache.time;
            if (chartdata && chartdata.data instanceof Array) {
                var minute = chartdata.data.pop();
                if (typeof minute === 'string') {
                    var items = minute.split(',');
                    if (items[1] != data) {
                        items[1] = data;
                        chartdata.data.push(items.join(','));
                        timechart.setData(timeloader.datacache);
                        timechart.redraw();
                    } else {
                        chartdata.data.push(minute);
                    }
                }
            }
        });
        $('#kr-box').on('selectstart', function (e) {
            return false;
        });

        
 
        $('#type-selector .dataType').click(function (e) {
            $('#authority-options').hide();
            $('#kr-box .rk-options').hide();
            $('#kr-box .select-icon').removeClass("select-up");
            $('#select-authority').removeClass('cur');

            var chartloader = timeloader;
            var $dom = $(this);
            if ($dom.hasClass('cur')) return false;
            var type = $dom.data('type');
            var displayTools = false;
            $dom.addClass("cur").siblings().removeClass("cur");
            $('#type-selector .dataType.cur').removeClass('cur');
            options.type = type;
            options.iscr = false;
            options.isph = false;
            if (type === 'r') {
            } else if (type === 'cr') {
                options.isph = false;
                options.iscr = true;
                options.type = 'r';
            } else if (type === 'ar') { //盘后
                options.iscr = false;
                options.isph = true;
                options.type = 'r';
            } else if (['t2', 't3', 't4', 't5'].indexOf(type) >= 0) {
                $('#day-selector').addClass('cur');
                $('#day-selector .rk-options').hide();
            } else {
                displayTools = true;
                $('#day-selector').removeClass('cur');
                if (cyqtypes.indexOf(type) < 0) {
                    $('#btn-cyq').hide();
                    if ($('#btn-cyq').hasClass('cur')) {
                        $('#btn-cyq').click();
                    }
                    $('#select-authority').hide();
                    options.yAxisType = 2;
                } else {
                    $('#btn-cyq').show();
                    $('#select-authority').show();
                }
                chartloader = kloader;
            }
            $('#chart-container').data('chartType', options.type);
            displayKChartToolBar(displayTools);
            $dom.addClass('cur');
            var currentchart = chartloader.load();
            if (options.type === 'r') {
                timechart = currentchart;
            } else {
                kchart = currentchart;
            }
            return false;
        });


        // 多日分时逻辑
        $('#day-selector .click-icon').click(function (event) {
            if ($('#day-selector .select-icon').hasClass('select-up')) {
                $('#day-selector .rk-options').hide();
                $('#day-selector .select-icon').removeClass("select-up");
            } else {
                $('#day-selector .rk-options').show();
                $('#day-selector .select-icon').addClass("select-up");
            }
            return false;
        });

        $('#day-selector i').click(function () {
            displayKChartToolBar(false);
            var $dom = $(this);
            $('#day-selector .rk-options').hide();
            $('#day-selector .select-icon').removeClass("select-up");
            if ($dom.hasClass('cur')) return false;
            var type = $dom.data('type');
            var curhtml = $dom.html();
            //var dayhtml = $('#day-selector i.cur').html();
            if (type == "r") {
                //$('#day-selector .selected-box').html(dayhtml).attr('data-type', type);
                $("#day-selector").removeClass("cur");
                $('#type-selector .dataType').removeClass('cur');
                $('#type-selector .fshBox').addClass("cur");
            } else {
                $('#type-selector .dataType').removeClass("cur");
                $('#day-selector').addClass("cur").data('type', type);
                $('#day-selector .selected-box').html(curhtml);
                $('#day-selector i').removeClass('cur');
                $dom.addClass('cur');
            }
            options.iscr = false;
            options.type = type;
            timechart = timeloader.load();
            return false;
        });

        // 拉长缩短
        $('#btn-stretchout').click(function (e) {
            $('.rk-options').hide();
            $('.select-icon').removeClass("select-up");
            $('#select-authority').removeClass('cur');
            if (typeof kchart.elongate === 'function')
                kchart.elongate();
            return false;
        });
        $('#btn-drawback').click(function (e) {
            $('.rk-options').hide();
            $('.select-icon').removeClass("select-up");
            $('#select-authority').removeClass('cur');
            if (typeof kchart.shorten === 'function')
                kchart.shorten();
            return false;
        });

        // 默认逻辑
        if (typeof at === 'string') {
            $('#authority-options i').removeClass('cur')
            $('#authority-options i').each(function () {
                if ($(this).attr('value') == at) {
                    var html = $(this).html();
                    var val = $(this).attr('value');
                    $(this).addClass('cur');
                    $("#authority-options i.cur").html();
                    $("#select-authority .selected-box").html(html).attr('value', val);
                }
            });
        }

        // 除复权下拉框
        $('#select-authority').click(function (event) {
            $('#day-selector .rk-options').hide();
            $('#day-selector .select-icon').removeClass("select-up");

            if ($('#select-authority .select-icon').hasClass("select-up")) {
                $('#authority-options').hide();
                $('#select-authority').removeClass('cur');
                $('#select-authority .select-icon').removeClass("select-up");
            } else {
                $('#authority-options').show();
                $('#select-authority').addClass('cur');
                $('#select-authority .select-icon').addClass("select-up");
            }
            return false;
        });

        $('#authority-options i').click(function (e) {
            var html = $(this).html();
            var val = $(this).attr('value');
            //var selected_val = $('#select-authority .selected-box').attr('value');
            var _html = $('#authority-options i.cur').html();
            $('#authority-options').hide();
            $('#select-authority').removeClass('cur');
            $('#select-authority .select-icon').removeClass("select-up");
            if (html == _html) {
                return false;
            };
            $('#authority-options i').removeClass("cur");
            $(this).addClass('cur');
            $("#select-authority .selected-box").html(html).attr('value', val);
            authority.set(val);
            options.authorityType = val;
            kchart = kloader.load();
            return false;
        });

        $(document).click(function () {
            $('#rk-box .rk-options').hide();
            $('#rk-box .select-icon').removeClass("select-up");
            $('#select-authority').removeClass('cur');
            if ($('#day-selector').hasClass('cur') && $('#type-selector .dataType').not(".selected-box").hasClass('cur')) {
                // $('#day-selector').removeClass('cur');
            }
        });

        var $cyqtips = $('<div class="cyq-tips">' +
            '<span class="tips fl">筹码分布<b class="icon-help3"></b></span>' +
            '<a class="close fr"><b class="icon-leave"></b>离开</a></div>');
        $cyqtips.find('.tips').tooltip({
            content: '红色筹码表示低于收盘价的获利筹码，蓝色筹码表示高于收盘价的套牢筹码'
        });
        $cyqtips.find('.close').click(function (e) {
            $('#btn-cyq').click();
            return false;
        });

        //筹码分布点击事件
        $('#btn-cyq').click(function (e, redraw) {
            choumafenbu(this, redraw, kloader);
            
            // if (!$(this).hasClass('cur')) {
            //     $(this).addClass('cur');
            //     $('.is-hide', $('#primary-quote')).hide();
            //     $('#vote-box').addClass('vote-box2');
            //     $('#chart-container').trigger('loadcyq.emchart');
            // } else {
            //     $(this).removeClass('cur');
            //     $('.is-hide', $('#primary-quote')).show();
            //     $('#vote-box').removeClass('vote-box2');
            //     $('#chart-container').trigger('destorycyq.emchart');
            // }

            // if (redraw !== false) {
            //     kchart = kloader.load();
            // }
            // return false;
        });


        // 盘前 分页 多日上的筹码分布
        $("#cmfb-btn").on("click", function(e, redraw){ 
            $("#type-selector .cur").removeClass("cur");
            $("#type-selector .dataType[data-type='k']").addClass("cur");
            displayKChartToolBar(true);

            $('#chart-container').data('chartType', "k");
            options.type = "k";
            options.iscr = false;

            var chartloader = kloader;
            kchart = chartloader.load();

            $("#btn-cyq").removeClass("cur");
            choumafenbu("#btn-cyq", redraw, kloader);
        });

        $('#chart-container').on('loadcyq.emchart', function (e) {
            $('#chart-container').data('cyq', true);
            options.width = 990;
            options.cyq = {
                width: 270,
                gap: 10,
                accuracyFactor: 150,
                range: 120
            }
            options.padding.right = 0;
        }).on('destorycyq.emchart', function (e) {
            var ct = $('#chart-container').data('chartType');
            if (cyqtypes.indexOf(ct) >= 0) {
                $('#chart-container').data('cyq', false);
            }
            $cyqtips.hide();
            options.width = 720;
            options.cyq = false;
            options.padding.right = 65;
        });
        // JS图画图完成事件
        $('#chart-container').on('drawComplete.emchart', function (e) {
            var opt = $(this).data();
            // 筹码分布提示栏 'm5k', 'm15k', 'm30k', 'm60k'
            if (opt.cyq && cyqtypes.indexOf(opt.chartType) >= 0) {
                $('#chart-container').append($cyqtips.show());
            }
        }).dblclick(fschart.open);

        // hash 控制图表显示状态
        var cmds = location.hash.toLowerCase().split('-');
        if (cmds.indexOf('#chart') === 0) {
            if (cmds.indexOf('cyq') > 0) {
                $('#btn-cyq').trigger('click', [false]);
            }
            if (cmds[1]) $('#type-selector [data-type=' + cmds[1] + ']').click();
            location.hash = '';
        }

        /**
         * 显示K图工具栏
         * @param {boolean} show 是否显示
         */
        function displayKChartToolBar(show) {
            var displayed = $('#btn-cyq').hasClass('cur');
            var cyq = $('#chart-container').data('cyq');
            if (show) {
                $('#kchart-toolbar').show();
                $("#cmfb-btn").hide();
                if (cyq && !displayed) {
                    $('#btn-cyq').trigger('click', [false]);
                }
            } else {
                $('#kchart-toolbar').hide();
                $("#cmfb-btn").show();
                if (displayed) {
                    $('#btn-cyq').trigger('click', [false]);
                }
            }
        }
    }
    this.renderChanges = function () {
        /** @type {PositionChanges} */
        var pc;
        pc = new PositionChanges({
            oncomplete: function (data, configs) {
                if (cache['status'] === 'close') {
                    pc.stop();
                }
            }
        });
        pc.load();
    }
    this.renderDeals = function () {
        /**@type {DealsDetail} */
        var dd;
        dd = new DealsDetail({
            oncomplete: function (data, configs) {
                if (cache['status'] === 'close') {
                    dd.stop();
                }
            }
        });
        dd.load();
    }

    function nufmLoader() {
        /** @type {number} */
        var timer;
        _opt.basic.ajax.data = {
            cmd: _opt.entry.id
        };

        _opt.basic.ajax.success = function (json) {
            //(0)市场(MarketType)
            //(1)代码(Code)
            //(2)52周最高最低值(StageChange52)
            //(3)20日涨跌起始价(ChangeStartPrice20Day)
            //(4)60日涨跌起始价(ChangeStartPrice60Day)
            //(5)今年以来涨跌起始价(ChangeStartPrice360Day)
            //(6)加权净资产收益率(ROE)(WeightedYieldOnNetAssets)
            //(7)主力流入(BalFlowInOriginal)
            //(8)主力流出(BalFlowOutOriginal)
            //(9)5日涨跌起始价(ChangeStartPrice5Day)
            //(10)5日涨跌起始价(ChangeStartPrice10Day)
            if (typeof json === 'string') {
                var items = json.split(',');
                var stageChange52 = items[2].split('|');
                $('#quote-ROE').html(isNaN(items[6]) ? '-' : items[6] + '%');
                $('#quote-52highest-custom').html(stageChange52[0] || '-');
                $('#quote-52lowest-custom').html(stageChange52[1] || '-');
                $('#quote-BalFlowInOriginal-custom')
                    .removeClass('red green').addClass('red')
                    .html(utils.numbericFormat(items[7]));
                $('#quote-BalFlowOutOriginal-custom')
                    .removeClass('red green').addClass('green')
                    .html(utils.numbericFormat(items[8]));
                cache['ChangeStartPrice20Day'] = items[3];
                cache['ChangeStartPrice60Day'] = items[4];
                cache['ChangeStartPrice360Day'] = items[5];
                cache['ChangeStartPrice5Day'] = items[9];
                cache['ChangeStartPrice10Day'] = items[10];
            }
        }
        var jqXhr = $.ajax(_opt.basic.ajax);
        if (_opt.basic.update > 0) {
            clearInterval(timer);
            timer = setInterval(function () {
                if (jqXhr) jqXhr.abort();
                jqXhr = $.ajax(_opt.basic.ajax);
                if (cache['status'] === 'close') clearInterval(timer);
            }, _opt.basic.update);
        }
    }
}

// 筹码分布
function choumafenbu(that, redraw, kloader){
    if (!$(that).hasClass('cur')) {
        $(that).addClass('cur');
        $('.is-hide', $('#primary-quote')).hide();
        $('#vote-box').addClass('vote-box2');
        $('#chart-container').trigger('loadcyq.emchart');
    } else {
        $(that).removeClass('cur');
        $('.is-hide', $('#primary-quote')).show();
        $('#vote-box').removeClass('vote-box2');
        $('#chart-container').trigger('destorycyq.emchart');
    }

    if (redraw !== false) {
        kchart = kloader.load();
    }
    return false;
}

function stockAuthorityType() {
    /**
     * 获取行情图除复权类型
     */
    this.get = function () {
        var type = COOKIE('emhq_picfq');
        switch (type) {
            case '0':
                return '';
            case '1':
                return 'fa';
            case '2':
                return 'ba';
            default:
                return 'fa';
        }
    }
    /**
     * 设置行情图除复权类型
     * @param {''|'fa'|'ba'} type 类型
     */
    this.set = function (type) {
        var val = type;
        switch (type) {
            case '':
                val = '0';
                break;
            case 'fa':
                val = '1';
                break;
            case 'ba':
                val = '2';
                break;
        }
        COOKIE('emhq_picfq', val, {
            expires: 365, //天
            path: '/',
            domain: '.eastmoney.com'
        });
    }
}

function getoptions(args) {
    return utils.extend({
        entry: window.stockentry || {
            id: '3000592',
            code: '300059',
            marketnum: '2',
            shortmarket: 'sz'
        },
        basic: {
            ajax: {
                // url: '//nufm.dfcfw.com/EM_Finance2014NumericApplication/JS.aspx?type=CT&sty=CFPCD&js=((x))&token=4f1862fc3b5e77c150a2b985b12db0fd',
                data: {},
                dataType: 'jsonp',
                jsonp: 'cb'
            },
            update: 1000 * 60 * 2
        }
    }, args, true);
}

function sellbuyp(maxvolume) {
    var mv = Math.max.apply(this, maxvolume);
    $("#quote-s5vp").css('width', (maxvolume[0] / mv)*100+'%');
    $("#quote-s4vp").css('width', (maxvolume[1] / mv)*100+'%');
    $("#quote-s3vp").css('width', (maxvolume[2] / mv)*100+'%');
    $("#quote-s2vp").css('width', (maxvolume[3] / mv)*100+'%');
    $("#quote-s1vp").css('width', (maxvolume[4] / mv)*100+'%');
    if((maxvolume[0] / mv)*100 < 2&&maxvolume[0]) {
        $("#quote-s5vp").css('width', '2%');
    }
    if((maxvolume[1] / mv)*100 < 2&&maxvolume[1]) {
        $("#quote-s4vp").css('width', '2%');
    }   
    if((maxvolume[2] / mv)*100 < 2&&maxvolume[2]) {
        $("#quote-s3vp").css('width', '2%');
    }   
    if((maxvolume[3] / mv)*100 < 2&&maxvolume[3]) {
        $("#quote-s2vp").css('width', '2%');
    } 
    if((maxvolume[4] / mv)*100 < 2&&maxvolume[4]) {
        $("#quote-s1vp").css('width', '2%');
    }
    $("#quote-b1vp").css('width', (maxvolume[5] / mv)*100+'%');
    $("#quote-b2vp").css('width', (maxvolume[6] / mv)*100+'%');
    $("#quote-b3vp").css('width', (maxvolume[7] / mv)*100+'%');
    $("#quote-b4vp").css('width', (maxvolume[8] / mv)*100+'%');
    $("#quote-b5vp").css('width', (maxvolume[9] / mv)*100+'%');    
    if((maxvolume[5] / mv)*100 < 2&&maxvolume[5]) {
        $("#quote-b1vp").css('width', '2%');
    }
    if((maxvolume[6] / mv)*100 < 2&&maxvolume[6]) {
        $("#quote-b2vp").css('width', '2%');
    }
    if((maxvolume[7] / mv)*100 < 2&&maxvolume[7]) {
        $("#quote-b3vp").css('width', '2%');
    }
    if((maxvolume[8] / mv)*100 < 2&&maxvolume[8]) {
        $("#quote-b4vp").css('width', '2%');
    }
    if((maxvolume[9] / mv)*100 < 2&&maxvolume[9]) {
        $("#quote-b5vp").css('width', '2%');
    }
}
//涨跌颜色
function udcls(vsa, vsb) {
    // vsa = String(vsa).replace("%", "");
    // console.log(vsa)
    // console.log(vsb)
    if (arguments.length == 1) {
        if (vsa > 0) { 
            return "red"; 
        } else if (vsa < 0) { 
            return "green"; 
        } else { 
            return "";
        }
    } else {
        // vsb = vsb.replace("%", "");
        
        if (vsa - vsb > 0) {
            return "red";
        } else if (vsa - vsb < 0) {
            return "green";
        } else {
            return "";
        }
    }
}
//数据格式
function fmtdig(Data, Mat, F, Unit, AutoF) {
    var res = Data;
    if (Data != "" && Data != "--" && Data != "-") {       
        var _temp = Math.abs(parseFloat(Data));
        var temp = parseFloat(Data);
        if (AutoF) {
            if (_temp > 1000000000000)//万亿
            {
                Mat = 100000000; Unit = "亿"; F = "0";
            }
            else if (_temp > 100000000000)//千亿
            {
                Mat = 100000000; Unit = "亿"; F = "0";
            }
            else if (_temp > 10000000000)//百亿
            {
                Mat = 100000000; Unit = "亿"; F = "1";
            }
            else if (_temp > 1000000000)//十亿
            {
                Mat = 100000000; Unit = "亿"; F = "2";
            }
            else if (_temp > 100000000)//亿
            {
                Mat = 100000000; Unit = "亿"; F = "2";
            }
            else if (_temp > 10000000)//千万
            {
                Mat = 10000; Unit = "万"; F = "0";
            }
            else if (_temp > 1000000)//百万
            {
                Mat = 10000; Unit = "万"; F = "1";
            }
            else if (_temp > 100000)//十万
            {
                Mat = 10000; Unit = "万"; F = "2";
            }
            else if (_temp > 10000) {
                Mat = 10000; Unit = "万"; F = "2";
            }
            else if (_temp > 1000) {
                Mat = 1; Unit = ""; F = "2";
            }
            else if (_temp > 100) {
                Mat = 1; Unit = ""; F = "2";
            }
            else if (_temp > 10) {
                Mat = 1; Unit = ""; F = "2";
            }
            else {
                Mat = 1; Unit = ""; F = "3";
            }
        }
        res = ForDight((temp / Mat), F);
    }
    return res + Unit;
}
function ForDight(Dight, How) { rDight = parseFloat(Dight).toFixed(How); if (rDight == "NaN") { rDight = "--"; } return rDight; }
//新版闪烁
function blinker(num,dom) {
    if(num>0){
        dom.addClass('blinkred');
        setTimeout(function(){
           dom.removeClass('blinkred')
        }, 500);
    }else if(num<0){
        dom.addClass('blinkgreen');
        setTimeout(function(){
           dom.removeClass('blinkgreen')
        }, 500);
    }else{
        dom.addClass('blinkblue');
        setTimeout(function(){
           dom.removeClass('blinkblue')
        }, 500);
    }
    
}
//正数添加加号
function addfigure(figure){
    if(figure>0) return '+'+figure;
    else return figure;
}
//时间日期格式
function formateDate(date, fmt) {
    fmt = fmt || "yyyy-MM-dd HH:mm:ss"
    if (typeof date === "string"){
        if(date.length == 23){
            date = date.substring(0,19)
        }
        date = new Date(date.replace(/-/g, '/').replace('T', ' ').split('+')[0]);
    }
    var o = {
        "M+": date.getMonth() + 1, //月份         
        "d+": date.getDate(), //日         
        "h+": date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, //小时         
        "H+": date.getHours(), //小时         
        "m+": date.getMinutes(), //分         
        "s+": date.getSeconds(), //秒         
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度         
        "S": date.getMilliseconds() //毫秒         
    };
    var week = {
        "0": "\u65e5",
        "1": "\u4e00",
        "2": "\u4e8c",
        "3": "\u4e09",
        "4": "\u56db",
        "5": "\u4e94",
        "6": "\u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[date.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}
//当前时间段
function time_range(beginTime, endTime, nowTime) {
    var strb = beginTime.split (":");
    if (strb.length != 2) {
      return false;
    }
   
    var stre = endTime.split (":");
    if (stre.length != 2) {
      return false;
    }
   
    var strn = nowTime.split (":");
    if (stre.length != 2) {
      return false;
    }
    var b = new Date ();
    var e = new Date ();
    var n = new Date ();
    // console.log(b)
    b.setHours (strb[0]);
    b.setMinutes (strb[1]);
    e.setHours (stre[0]);
    e.setMinutes (stre[1]);
    n.setHours (strn[0]);
    n.setMinutes (strn[1]);
   
    if (n.getTime () - b.getTime () > 0 && n.getTime () - e.getTime () < 0) {
      return true;
    } else {
    //   alert ("当前时间是：" + n.getHours () + ":" + n.getMinutes () + "，不在该时间范围内！");
      return false;
    }
}

module.exports = quote;

/***/ }),

/***/ "emcharts3":
/*!****************************!*\
  !*** external "emcharts3" ***!
  \****************************/
/***/ (function(module) {

"use strict";
module.exports = emcharts3;

/***/ }),

/***/ "guba_new_reply":
/*!*********************************!*\
  !*** external "guba_new_reply" ***!
  \*********************************/
/***/ (function(module) {

"use strict";
module.exports = guba_new_reply;

/***/ }),

/***/ "jquery":
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
/***/ (function(module) {

"use strict";
module.exports = jQuery;

/***/ }),

/***/ "suggest2017":
/*!******************************!*\
  !*** external "suggest2017" ***!
  \******************************/
/***/ (function(module) {

"use strict";
module.exports = suggest2017;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./jssrc/concept.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=concept.js.map