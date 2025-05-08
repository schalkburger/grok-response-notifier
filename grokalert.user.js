// ==UserScript==
// @name         Grok Response Complete Notifier
// @namespace    https://github.com/schalkburger/website-enhancements
// @version      1.0.6
// @description  Plays an audible notification when Grok finishes generating a response
// @author       Schalk Burger
// @match        https://grok.com/*
// @grant        GM_info
// @grant        GM_notification
// ==/UserScript==

(function () {
  "use strict";

  const VERSION = GM_info.script.version;
  console.log(`[Response Notifier ${VERSION}] Initializing...`);

  // GM_notification({
  //   title: "Grok Response Complete Notifier",
  //   text: "Script has initialized",
  //   image: "https://i.imgur.com/MU0gwFg.png",
  //   silent: true,
  //   timeout: 3000,
  // });

  // SVG path for "send" state (arrow up)
  const SEND_SVG_PATH = "M5 11L12 4M12 4L19 11M12 4V21";

  // Watch for send button SVG changes
  let wasGenerating = false;
  const observer = new MutationObserver(() => {
    const sendButton = document.querySelector(".h-10.aspect-square.flex.flex-col.items-center.justify-center.rounded-full");
    if (!sendButton) return;

    const svgPath = sendButton.querySelector("path")?.getAttribute("d");
    const isGenerating = svgPath !== SEND_SVG_PATH;

    console.log(`[Debug] Generation state: ${isGenerating ? "active" : "inactive"}`);

    if (wasGenerating && !isGenerating) {
      console.log("[Status] Response completed - showing notification");
      GM_notification({
        title: "Response Completed",
        text: "Grok has finished responding",
        image: "https://i.imgur.com/MU0gwFg.png",
        silent: true,
        timeout: 3000,
      });
    }

    wasGenerating = isGenerating;
  });

  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "d"],
  });

  console.log("[Debug] Now watching for send button SVG changes");
  console.log(`[Response Notifier ${VERSION}] Active - monitoring responses`);
})();
