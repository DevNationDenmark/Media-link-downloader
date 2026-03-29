async function download() {
  const url = document.getElementById("url").value;
  const format = document.getElementById("format").value;
  const status = document.getElementById("status");

  status.innerText = "Downloading...";

  try {
    const res = await fetch("/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, format })
    });

    const data = await res.json();

    if (data.success) {
      status.innerHTML = `
        ✅ Done <br>
        <a href="${data.file}" target="_blank">Open file</a>
      `;
    } else {
      status.innerText = data.error;
    }
  } catch (err) {
    status.innerText = "Error";
  }
}

