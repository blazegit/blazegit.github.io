/*!
 * Chirpy v5.2.1 (https://github.com/cotes2020/jekyll-theme-chirpy/)
 * © 2019 Cotes Chung
 * MIT Licensed
 */
$(function(){$(window).scroll(()=>{50<$(this).scrollTop()&&"none"===$("#sidebar-trigger").css("display")?$("#back-to-top").fadeIn():$("#back-to-top").fadeOut()}),$("#back-to-top").click(()=>($("body,html").animate({scrollTop:0},800),!1))}),$(function(){$(".mode-toggle").click(t=>{const e=$(t.target);let o=e.prop("tagName")==="button".toUpperCase()?e:e.parent();o.blur(),flipMode()})});const ScrollHelper=function(){const t=$("body"),e="data-topbar-visible",o=$("#topbar-wrapper").outerHeight();let a=0,r=!1,l=!1;return{hideTopbar:()=>t.attr(e,!1),showTopbar:()=>t.attr(e,!0),addScrollUpTask:()=>{a+=1,r=r||!0},popScrollUpTask:()=>--a,hasScrollUpTask:()=>0<a,topbarLocked:()=>!0===r,unlockTopbar:()=>r=!1,getTopbarHeight:()=>o,orientationLocked:()=>!0===l,lockOrientation:()=>l=!0,unLockOrientation:()=>l=!1}}(),LocaleHelper=($(function(){const t=$("#sidebar-trigger"),e=$("#search-trigger"),o=$("#search-cancel"),a=$("#main"),r=$("#topbar-title"),l=$("#search-wrapper"),n=$("#search-result-wrapper"),i=$("#search-results"),c=$("#search-input"),s=$("#search-hints"),d=function(){let t=0;return{block(){t=window.scrollY,$("html,body").scrollTop(0)},release(){$("html,body").scrollTop(t)},getOffset(){return t}}}(),p={on(){t.addClass("unloaded"),r.addClass("unloaded"),e.addClass("unloaded"),l.addClass("d-flex"),o.addClass("loaded")},off(){o.removeClass("loaded"),l.removeClass("d-flex"),t.removeClass("unloaded"),r.removeClass("unloaded"),e.removeClass("unloaded")}},u=function(){let t=!1;return{on(){t||(d.block(),n.removeClass("unloaded"),a.addClass("unloaded"),t=!0)},off(){t&&(i.empty(),s.hasClass("unloaded")&&s.removeClass("unloaded"),n.addClass("unloaded"),a.removeClass("unloaded"),d.release(),c.val(""),t=!1)},isVisible(){return t}}}();function h(){return o.hasClass("loaded")}e.click(function(){p.on(),u.on(),c.focus()}),o.click(function(){p.off(),u.off()}),c.focus(function(){l.addClass("input-focus")}),c.focusout(function(){l.removeClass("input-focus")}),c.on("input",()=>{""===c.val()?h()?s.removeClass("unloaded"):u.off():(u.on(),h()&&s.addClass("unloaded"))})}),$(function(){var t=function(){const t="sidebar-display";let e=!1;const o=$("body");return{toggle(){!1===e?o.attr(t,""):o.removeAttr(t),e=!e}}}();$("#sidebar-trigger").click(t.toggle),$("#mask").click(t.toggle)}),$(function(){$('[data-toggle="tooltip"]').tooltip()}),$(function(){const e=$("#search-input"),o=ScrollHelper.getTopbarHeight();let t,a=0;function r(){0!==$(window).scrollTop()&&(ScrollHelper.lockOrientation(),ScrollHelper.hideTopbar())}screen.orientation?screen.orientation.onchange=()=>{var t=screen.orientation.type;"landscape-primary"!==t&&"landscape-secondary"!==t||r()}:$(window).on("orientationchange",()=>{$(window).width()<$(window).height()&&r()}),$(window).scroll(()=>{t=t||!0}),setInterval(()=>{t&&(!function(){var t=$(this).scrollTop();if(!(Math.abs(a-t)<=o)){if(t>a)ScrollHelper.hideTopbar(),e.is(":focus")&&e.blur();else if(t+$(window).height()<$(document).height()){if(ScrollHelper.hasScrollUpTask())return;ScrollHelper.topbarLocked()?ScrollHelper.unlockTopbar():ScrollHelper.orientationLocked()?ScrollHelper.unLockOrientation():ScrollHelper.showTopbar()}a=t}}(),t=!1)},250)}),$(function(){var e="div.post>h1:first-of-type";const o=$(e),n=$("#topbar-title");if(0!==o.length&&!o.hasClass("dynamic-title")&&!n.is(":hidden")){const i=n.text().trim();let a=o.text().trim(),r=!1,l=0;($("#page-category").length||$("#page-tag").length)&&/\s/.test(a)&&(a=a.replace(/[0-9]/g,"").trim()),o.offset().top<$(window).scrollTop()&&n.text(a);let t=new IntersectionObserver(t=>{var e,o;r?(o=$(window).scrollTop(),e=l<o,l=o,o=t[0],e?0===o.intersectionRatio&&n.text(a):1===o.intersectionRatio&&n.text(i)):r=!0},{rootMargin:"-48px 0px 0px 0px",threshold:[0,1]});t.observe(document.querySelector(e)),n.click(function(){$("body,html").animate({scrollTop:0},800)})}}),$(function(){var t="#main > div.row:first-child > div:first-child";if(!($(t+" img").length<=0)){var e=document.querySelectorAll(t+" img[data-src]");const o=lozad(e);o.observe(),$(t+` p > img[data-src],${t} img[data-src].preview-img`).each(function(){let t=$(this).next();var e="EM"===t.prop("tagName")?t.text():"",o=$(this).attr("data-src");$(this).wrap(`<a href="${o}" title="${e}" class="popup"></a>`)}),$(".popup").magnificPopup({type:"image",closeOnContentClick:!0,showCloseBtn:!1,zoom:{enabled:!0,duration:300,easing:"ease-in-out"}}),$(t+" a").has("img").addClass("img-link")}}),function(){const t=$('meta[name="prefer-datetime-locale"]'),e=0<t.length?t.attr("content").toLowerCase():$("html").attr("lang").substr(0,2),o="data-ts",a="data-df";return{locale:()=>e,attrTimestamp:()=>o,attrDateFormat:()=>a,getTimestamp:t=>Number(t.attr(o)),getDateFormat:t=>t.attr(a)}}());$(function(){dayjs.locale(LocaleHelper.locale()),dayjs.extend(window.dayjs_plugin_localizedFormat),$(`[${LocaleHelper.attrTimestamp()}]`).each(function(){const t=dayjs.unix(LocaleHelper.getTimestamp($(this)));var e=t.format(LocaleHelper.getDateFormat($(this))),e=($(this).text(e),$(this).removeAttr(LocaleHelper.attrTimestamp()),$(this).removeAttr(LocaleHelper.attrDateFormat()),$(this).attr("data-toggle"));void 0!==e&&"tooltip"===e&&(e=t.format("llll"),$(this).attr("data-original-title",e))})}),$(function(){$("input[type=checkbox]").addClass("unloaded"),$("input[type=checkbox][checked]").before('<i class="fas fa-check-circle checked"></i>'),$("input[type=checkbox]:not([checked])").before('<i class="far fa-circle"></i>')}),$(function(){var t=".code-header>button";const e="timeout",r="data-title-succeed",l="data-original-title";function n(t){if($(t)[0].hasAttribute(e)){t=$(t).attr(e);if(Number(t)>Date.now())return 1}}function i(t){$(t).attr(e,Date.now()+2e3)}function c(t){$(t).removeAttr(e)}const o=new ClipboardJS(t,{target(t){let e=t.parentNode.nextElementSibling;return e.querySelector("code .rouge-code")}});$(t).tooltip({trigger:"hover",placement:"left"});const s=function(t){let e=$(t).children();return e.attr("class")}(t);o.on("success",o=>{o.clearSelection();const a=o.trigger;if(!n(a)){{o=a;let t=$(o),e=t.children();e.attr("class","fas fa-check")}var t;o=a,t=$(o).attr(r),$(o).attr(l,t).tooltip("show"),i(a),setTimeout(()=>{o=a,$(o).tooltip("hide").removeAttr(l);{var o=a;let t=$(o),e=t.children();e.attr("class",s)}c(a)},2e3)}}),$("#copy-link").click(t=>{let e=$(t.target);if(!n(e)){t=window.location.href;const o=$("<input>"),a=($("body").append(o),o.val(t).select(),document.execCommand("copy"),o.remove(),e.attr(l));t=e.attr(r);e.attr(l,t).tooltip("show"),i(e),setTimeout(()=>{e.attr(l,a),c(e)},2e3)}})}),$(function(){const t=$("#topbar-title"),c="scroll-focus";$("a[href*='#']").not("[href='#']").not("[href='#0']").click(function(r){if(this.pathname.replace(/^\//,"")===location.pathname.replace(/^\//,"")&&location.hostname===this.hostname){const i=decodeURI(this.hash);let e=RegExp(/^#fnref:/).test(i),o=!e&&RegExp(/^#fn:/).test(i);var l=i.includes(":")?i.replace(/\:/g,"\\:"):i;let a=$(l);var l=t.is(":visible"),n=$(window).width()<$(window).height();if(void 0!==a){r.preventDefault(),history.pushState&&history.pushState(null,null,i);r=$(window).scrollTop();let t=a.offset().top-=8;t<r&&(ScrollHelper.hideTopbar(),ScrollHelper.addScrollUpTask()),l&&n&&(t-=ScrollHelper.getTopbarHeight()),$("html").animate({scrollTop:t},500,()=>{if(a.focus(),$(`[${c}=true]`).length&&$(`[${c}=true]`).attr(c,!1),$(":target").length&&$(":target").attr(c,!1),(o||e)&&a.attr(c,!0),a.is(":focus"))return!1;a.attr("tabindex","-1"),a.focus(),ScrollHelper.hasScrollUpTask()&&ScrollHelper.popScrollUpTask()})}}})});