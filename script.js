const qrCode = new QRCodeStyling({ width: 250, height: 250, dotsOptions: { type: "extra-rounded" } });
qrCode.append(document.getElementById("qrPreview"));

const dynamicInputs = document.getElementById('dynamicInputs');
const qrType = document.getElementById('qrType');

function updateFields() {
    const type = qrType.value;
    if (type === 'url') dynamicInputs.innerHTML = '<input type="text" id="val" placeholder="URL ou Texto">';
    else if (type === 'wifi') dynamicInputs.innerHTML = '<input type="text" id="wifiS" placeholder="Nome da Rede"><input type="password" id="wifiP" placeholder="Senha">';
    else if (type === 'vcard') dynamicInputs.innerHTML = '<input type="text" id="vN" placeholder="Nome"><input type="tel" id="vT" placeholder="Telefone">';
    else if (type === 'whatsapp') dynamicInputs.innerHTML = '<input type="text" id="waN" placeholder="Número (com DDD)">';
    else if (type === 'location') dynamicInputs.innerHTML = '<input type="text" id="lat" placeholder="Latitude"><input type="text" id="lng" placeholder="Longitude">';
}

qrType.addEventListener('change', updateFields);
updateFields(); // Inicializa

document.getElementById('generateBtn').addEventListener('click', () => {
    let data = "";
    const type = qrType.value;
    try {
        if (type === 'url') data = document.getElementById('val').value;
        else if (type === 'wifi') data = `WIFI:T:WPA;S:${document.getElementById('wifiS').value};P:${document.getElementById('wifiP').value};;`;
        else if (type === 'vcard') data = `BEGIN:VCARD\nFN:${document.getElementById('vN').value}\nTEL:${document.getElementById('vT').value}\nEND:VCARD`;
        else if (type === 'whatsapp') data = `https://wa.me/${document.getElementById('waN').value}`;
        else if (type === 'location') data = `geo:${document.getElementById('lat').value},${document.getElementById('lng').value}`;
        
        const file = document.getElementById('logoUpload').files[0];
        const config = { data, dotsOptions: { color: document.getElementById('dotColor').value, type: document.getElementById('dotStyle').value } };
        
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => { config.image = e.target.result; qrCode.update(config); };
            reader.readAsDataURL(file);
        } else { qrCode.update(config); }
    } catch (e) { alert("Preencha todos os campos corretamente."); }
});

document.getElementById('downloadBtn').addEventListener('click', () => qrCode.download({ name: "qr-workin", extension: "png" }));
