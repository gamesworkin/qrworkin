const qrCode = new QRCodeStyling({ width: 250, height: 250, dotsOptions: { type: "rounded" } }); 
qrCode.append(document.getElementById("qrCodeTarget"));

function formatData() {
    const type = document.getElementById("dataType").value;
    const val = document.getElementById("qrInput").value;

    switch(type) {
        case 'wifi': return `WIFI:T:WPA;S:${val};P:SUA_SENHA;;`; // Simplificado
        case 'contact': return `BEGIN:VCARD\nVERSION:3.0\nFN:${val}\nEND:VCARD`;
        case 'location': return `https://www.google.com/maps/search/?api=1&query=${val}`;
        default: return val;
    }
}

document.getElementById("generateBtn").addEventListener("click", () => {
    const config = {
        data: formatData(),
        dotsOptions: { color: document.getElementById("qrColor").value, type: document.getElementById("dotType").value }
    };

    const logoFile = document.getElementById("logoInput").files[0];
    if (logoFile) {
        const reader = new FileReader();
        reader.onload = (e) => { config.image = e.target.result; qrCode.update(config); };
        reader.readAsDataURL(logoFile);
    } else {
        qrCode.update(config);
    }
});

document.getElementById("downloadBtn").addEventListener("click", () => qrCode.download({ name: "qr-workin", extension: "png" }));
