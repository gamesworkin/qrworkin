const qrCode = new QRCodeStyling({
    width: 250, height: 250,
    data: "https://github.com",
    dotsOptions: { color: "#000000", type: "rounded" },
    backgroundOptions: { color: "#ffffff" }
});

qrCode.append(document.getElementById("qrCodeTarget"));

// Função de Geração
document.getElementById("generateBtn").addEventListener("click", () => {
    const text = document.getElementById("qrInput").value;
    const color = document.getElementById("qrColor").value;
    const type = document.getElementById("dotType").value;
    const logoFile = document.getElementById("logoInput").files[0];

    let config = {
        data: text || "https://github.com",
        dotsOptions: { color: color, type: type },
    };

    if (logoFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
            config.image = e.target.result;
            qrCode.update(config);
        };
        reader.readAsDataURL(logoFile);
    } else {
        qrCode.update(config);
    }
});

// Função de Download
document.getElementById("downloadBtn").addEventListener("click", () => {
    qrCode.download({ name: "qr-workin", extension: "png" });
});
