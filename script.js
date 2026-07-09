const qrCode = new QRCodeStyling({ width: 250, height: 250, dotsOptions: { type: "extra-rounded" } });
qrCode.append(document.getElementById("qrPreview"));

const dynamicInputs = document.getElementById('dynamicInputs');
const qrType = document.getElementById('qrType');

const templates = {
    url: '<input type="text" id="mainVal" placeholder="Cole sua URL ou escreva algo...">',
    wifi: '<input type="text" id="wifiSSID" placeholder="Nome da rede (SSID)"><input type="password" id="wifiPass" placeholder="Senha da rede">',
    vcard: '<input type="text" id="vName" placeholder="Nome completo"><input type="tel" id="vTel" placeholder="Telefone">',
    whatsapp: '<input type="text" id="waNum" placeholder="Número (Ex: 5511999999999)">',
    location: '<input type="text" id="lat" placeholder="Latitude"><input type="text" id="lng" placeholder="Longitude">'
};

function updateFields() {
    dynamicInputs.innerHTML = templates[qrType.value] || "";
}

qrType.addEventListener('change', updateFields);
updateFields();

document.getElementById('generateBtn').addEventListener('click', () => {
    let data = "";
    const type = qrType.value;
    
    try {
        if (type === 'url') data = document.getElementById('mainVal').value;
        else if (type === 'wifi') data = `WIFI:T:WPA;S:${document.getElementById('wifiSSID').value};P:${document.getElementById('wifiPass').value};;`;
        else if (type === 'vcard') data = `BEGIN:VCARD\nVERSION:3.0\nFN:${document.getElementById('vName').value}\nTEL:${document.getElementById('vTel').value}\nEND:VCARD`;
        else if (type === 'whatsapp') data = `https://wa.me/${document.getElementById('waNum').value}`;
        else if (type === 'location') data = `geo:${document.getElementById('lat').value},${document.getElementById('lng').value}`;
        
        if (!data) throw "Por favor, preencha os campos.";

        const logoFile = document.getElementById('logoUpload').files[0];
        const config = {
            data: data,
            dotsOptions: { color: document.getElementById('dotColor').value, type: document.getElementById('dotStyle').value }
        };
        
        if (logoFile) {
            const reader = new FileReader();
            reader.onload = (e) => { config.image = e.target.result; qrCode.update(config); };
            reader.readAsDataURL(logoFile);
        } else { qrCode.update(config); }
    } catch (e) { alert(e); }
});

document.getElementById('downloadBtn').addEventListener('click', () => {
    const size = parseInt(document.getElementById('resSelect').value);
    qrCode.update({ width: size, height: size });
    
    // Pequeno timeout para garantir a re-renderização do canvas antes do download
    setTimeout(() => {
        qrCode.download({ name: "qr-workin-hq", extension: "png" });
        // Retorna ao tamanho de preview
        qrCode.update({ width: 250, height: 250 });
    }, 500);
});
