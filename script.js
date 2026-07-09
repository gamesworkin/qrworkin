// Configuração Inicial do QR 
const qrCode = new QRCodeStyling({
    width: 280,
    height: 280,
    margin: 10,
    dotsOptions: { color: "#4f46e5", type: "extra-rounded" },
    backgroundOptions: { color: "#ffffff" },
    imageOptions: { crossOrigin: "anonymous", margin: 5 }
});

const dynamicContainer = document.getElementById('dynamicInputs');
const qrTypeSelect = document.getElementById('qrType');
const errorMsg = document.getElementById('errorMessage');

// 1. Dicionário de Campos Dinâmicos
const fieldTemplates = {
    url: `<input type="text" id="mainVal" placeholder="https://exemplo.com ou texto">`,
    wifi: `
        <input type="text" id="wifiSSID" placeholder="Nome da Rede (SSID)" class="mb-10">
        <input type="password" id="wifiPass" placeholder="Senha">
        <select id="wifiEnc" class="mt-10">
            <option value="WPA">WPA/WPA2</option>
            <option value="WEP">WEP</option>
            <option value="nopass">Sem Senha</option>
        </select>`,
    vcard: `
        <input type="text" id="vName" placeholder="Nome Completo" class="mb-10">
        <input type="tel" id="vPhone" placeholder="Telefone" class="mb-10">
        <input type="text" id="vEmail" placeholder="E-mail">`,
    whatsapp: `
        <input type="tel" id="waPhone" placeholder="Ex: 5511999999999" class="mb-10">
        <textarea id="waMsg" placeholder="Mensagem pré-definida (opcional)" rows="2"></textarea>`,
    location: `
        <input type="text" id="lat" placeholder="Latitude (Ex: -23.55)" class="mb-10">
        <input type="text" id="lng" placeholder="Longitude (Ex: -46.63)">`
};

// 2. Função para Trocar os Campos
function updateFields() {
    dynamicContainer.innerHTML = fieldTemplates[qrTypeSelect.value];
}

// 3. Gerador de Strings Formatadas (Lógica de Negócio)
function getFormattedData() {
    errorMsg.innerText = "";
    const type = qrTypeSelect.value;

    try {
        if (type === 'url') {
            const val = document.getElementById('mainVal').value;
            if (!val) throw "Por favor, digite um link ou texto.";
            return val;
        }
        if (type === 'wifi') {
            const s = document.getElementById('wifiSSID').value;
            const p = document.getElementById('wifiPass').value;
            const t = document.getElementById('wifiEnc').value;
            if (!s) throw "O nome da rede é obrigatório.";
            return `WIFI:T:${t};S:${s};P:${p};;`;
        }
        if (type === 'vcard') {
            const n = document.getElementById('vName').value;
            const p = document.getElementById('vPhone').value;
            const e = document.getElementById('vEmail').value;
            if (!n || !p) throw "Nome e Telefone são obrigatórios.";
            return `BEGIN:VCARD\nVERSION:3.0\nFN:${n}\nTEL:${p}\nEMAIL:${e}\nEND:VCARD`;
        }
        if (type === 'whatsapp') {
            const p = document.getElementById('waPhone').value;
            const m = encodeURIComponent(document.getElementById('waMsg').value);
            if (!p) throw "O número do WhatsApp é obrigatório.";
            return `https://wa.me/${p}?text=${m}`;
        }
        if (type === 'location') {
            const la = document.getElementById('lat').value;
            const lo = document.getElementById('lng').value;
            if (!la || !lo) throw "Coordenadas são obrigatórias.";
            return `geo:${la},${lo}`;
        }
    } catch (e) {
        errorMsg.innerText = e;
        return null;
    }
}

// 4. Ações Principais
document.getElementById('generateBtn').addEventListener('click', () => {
    const data = getFormattedData();
    if (!data) return;

    const logoFile = document.getElementById('logoUpload').files[0];
    const updateOptions = {
        data: data,
        dotsOptions: {
            color: document.getElementById('dotColor').value,
            type: document.getElementById('dotStyle').value
        }
    };

    if (logoFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
            updateOptions.image = e.target.result;
            qrCode.update(updateOptions);
        };
        reader.readAsDataURL(logoFile);
    } else {
        updateOptions.image = null;
        qrCode.update(updateOptions);
    }
});

document.getElementById('downloadBtn').addEventListener('click', () => {
    qrCode.download({ name: "qr_workin", extension: "png" });
});

// Inicialização
qrTypeSelect.addEventListener('change', updateFields);
updateFields();
qrCode.append(document.getElementById("qrPreview"));
