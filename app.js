const $ = (id) => document.getElementById(id);
const settingsDialog = $("settingsDialog");
const infoDialog = $("infoDialog");
const storedUrl = localStorage.getItem("steamRemoteServer") || "";
$("serverUrl").value = storedUrl;

function normalizeUrl(value) {
  return value.trim().replace(/\/+$/, "");
}
function updateStatus() {
  const url = normalizeUrl(localStorage.getItem("steamRemoteServer") || "");
  const pill = $("connectionStatus");
  const hint = $("serverHint");
  if (url) {
    pill.classList.add("connected");
    pill.innerHTML = "<i></i> Server saved";
    hint.textContent = "Server saved: " + url;
  } else {
    pill.classList.remove("connected");
    pill.innerHTML = "<i></i> Not connected";
    hint.textContent = "Set your Steam Headless server address in Settings.";
  }
}
function showInfo(title, message) {
  $("infoTitle").textContent = title;
  $("infoText").textContent = message;
  infoDialog.showModal();
}
function connect() {
  const url = normalizeUrl(localStorage.getItem("steamRemoteServer") || "");
  if (!url) {
    settingsDialog.showModal();
    return;
  }
  // Steam Headless serves its own authenticated browser portal on port 8483.
  // This deliberate handoff avoids pretending an unsupported cross-origin embed is integrated.
  window.location.href = url;
}
$("settingsOpen").addEventListener("click", () => settingsDialog.showModal());
$("connectButton").addEventListener("click", connect);
$("saveSettings").addEventListener("click", (event) => {
  event.preventDefault();
  const value = normalizeUrl($("serverUrl").value);
  if (!value || !/^https?:\/\//i.test(value)) {
    showInfo("Check the server address", "Enter the full URL, for example https://192.168.1.150:8483");
    return;
  }
  localStorage.setItem("steamRemoteServer", value);
  settingsDialog.close();
  updateStatus();
});
$("setupButton").addEventListener("click", () => {
  showInfo("Server setup", "The gaming server must run Steam Headless on a Linux PC with a supported GPU and hardware video encoder. Install and test Steam Headless first, then enter its local HTTPS address here. Keep the iPad and server on the same Wi-Fi for the first connection.");
});
document.querySelectorAll(".tab").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active"));
    button.classList.add("active");
    const tab = button.dataset.tab;
    if (tab === "home") return;
    const messages = {
      library: "Your real Steam library will be populated from the gaming server in the next integration stage.",
      controller: "Connect a Bluetooth controller in iPad Settings → Bluetooth. Safari gamepad input and touch-to-gamepad forwarding must be tested against the server streaming client before we promise full compatibility.",
      settings: null
    };
    if (tab === "settings") settingsDialog.showModal();
    else showInfo(tab === "library" ? "Game library" : "Controls", messages[tab]);
  });
});
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}
updateStatus();
