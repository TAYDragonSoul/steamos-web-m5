
const isoInput = document.getElementById("isoFile");
const fileName = document.getElementById("fileName");
const bootButton = document.getElementById("bootButton");
const stopButton = document.getElementById("stopButton");
const fullscreenButton = document.getElementById("fullscreenButton");
const ctrlAltDelButton = document.getElementById("ctrlAltDelButton");
const screen = document.getElementById("screen");
const statusText = document.getElementById("status");
const vmStatus = document.getElementById("vmStatus");

let isoBuffer = null;
let emulator = null;

isoInput.addEventListener("change", async () => {
  const file = isoInput.files[0];

  if (!file) return;

  fileName.textContent = file.name;
  statusText.textContent = "ISO SELECTED";

  try {
    isoBuffer = await file.arrayBuffer();
    bootButton.disabled = false;
  } catch (error) {
    statusText.textContent = "FILE ERROR";
    alert("Could not read this ISO file.");
  }
});

bootButton.addEventListener("click", async () => {
  if (!isoBuffer) return;

  if (typeof V86 === "undefined") {
    alert(
      "The emulator engine is not installed yet. " +
      "We will add the v86_64 engine in the next setup step."
    );
    return;
  }

  bootButton.disabled = true;
  statusText.textContent = "STARTING";
  vmStatus.textContent = "BOOTING";

  screen.innerHTML = "";

  try {
    emulator = new V86({
      wasm_path: "./vendor/v86.wasm",
      memory_size: 512 * 1024 * 1024,
      vga_memory_size: 8 * 1024 * 1024,
      screen_container: screen,
      bios: {
        url: "./vendor/seabios.bin"
      },
      vga_bios: {
        url: "./vendor/vgabios.bin"
      },
      cdrom: {
        buffer: isoBuffer
      },
      autostart: true
    });

    emulator.add_listener("emulator-ready", () => {
      statusText.textContent = "ENGINE READY";
      vmStatus.textContent = "RUNNING";
      stopButton.disabled = false;
    });

    emulator.add_listener("emulator-stopped", () => {
      statusText.textContent = "STOPPED";
      vmStatus.textContent = "OFFLINE";
      bootButton.disabled = false;
      stopButton.disabled = true;
    });

  } catch (error) {
    console.error(error);
    statusText.textContent = "START ERROR";
    vmStatus.textContent = "ERROR";
    bootButton.disabled = false;

    alert("The emulator could not start. Check that the engine files are installed.");
  }
});

stopButton.addEventListener("click", () => {
  if (emulator) {
    emulator.stop();
    emulator = null;
  }

  statusText.textContent = "STOPPED";
  vmStatus.textContent = "OFFLINE";
  bootButton.disabled = !isoBuffer;
  stopButton.disabled = true;
});

fullscreenButton.addEventListener("click", () => {
  if (screen.requestFullscreen) {
    screen.requestFullscreen();
  } else {
    alert("Fullscreen is not available in this browser.");
  }
});

ctrlAltDelButton.addEventListener("click", () => {
  if (emulator && emulator.keyboard) {
    emulator.keyboard.send_scancodes([
      0x1d, 0x38, 0xe0, 0x53,
      0xe0, 0xd3, 0xb8, 0x9d
    ]);
  } else {
    alert("Start the virtual machine first.");
  }
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(error => {
      console.log("Service worker registration failed:", error);
    });
  });
}
