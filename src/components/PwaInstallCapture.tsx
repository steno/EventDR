import Script from "next/script";

/**
 * Capture beforeinstallprompt before React hydrates.
 * Chrome often fires it early when a SW already controls the page; a useEffect
 * listener is too late and the event is lost for that navigation.
 */
const CAPTURE = `(function(){try{var w=window;if(w.__POP_BIP_BOUND__)return;w.__POP_BIP_BOUND__=1;w.__POP_BIP__=w.__POP_BIP__||null;w.addEventListener("beforeinstallprompt",function(e){e.preventDefault();w.__POP_BIP__=e;w.dispatchEvent(new Event("pop:beforeinstallprompt"))});w.addEventListener("appinstalled",function(){w.__POP_BIP__=null;w.dispatchEvent(new Event("pop:appinstalled"))})}catch(e){}})()`;

export function PwaInstallCapture() {
  return (
    <Script id="pwa-install-capture" strategy="beforeInteractive">
      {CAPTURE}
    </Script>
  );
}
