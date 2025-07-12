const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const basePath = path.resolve(__dirname, '../db');


function getFilePath(name) {
    return path.join(basePath, `${name}.json`);
}

function uuidv4() {
    const bytes = crypto.randomBytes(16);

    // UUID v4 형식 맞게 비트 설정 (RFC4122 준수)
    bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant (10xxxxxx)

    const hex = [...bytes].map(b => b.toString(16).padStart(2, '0'));

    return [
        hex.slice(0, 4).join(''),
        hex.slice(4, 6).join(''),
        hex.slice(6, 8).join(''),
        hex.slice(8, 10).join(''),
        hex.slice(10, 16).join('')
    ].join('-');
}

// ✅ 전체 데이터 가져오기
function get(name) {
    const file = getFilePath(name);
    if (!fs.existsSync(file)) return [];
    try {
        const raw = fs.readFileSync(file, 'utf-8');
        return JSON.parse(raw);
    } catch (err) {
        console.error(`❌ [${name}] JSON 파싱 실패:`, err.message);
        return [];
    }
}

// ✅ 전체 데이터 저장 (유효성 검사 포함)
function save(name, data) {
    try {
        const file = getFilePath(name);

        // 1. 새 데이터 stringify 가능한지 확인
        let jsonString = '';
        try {
            jsonString = JSON.stringify(data, null, 2);
        } catch (err) {
            console.error(`❌ [${name}] 저장할 데이터 stringify 실패:`, err.message);
            return false;
        }

        // 2. 기존 파일이 있다면 JSON 파싱이 가능한지 확인 (기존 파일 보존)
        if (fs.existsSync(file)) {
            try {
                JSON.parse(fs.readFileSync(file, 'utf-8'));
            } catch (err) {
                console.error(`⚠️ [${name}] 기존 JSON 파일이 손상되어 덮어쓰기 중단됨.`);
                return false;
            }
        }

        // 3. 최종 저장
        fs.writeFileSync(file, jsonString);
        return true;
    } catch (err) {
        console.log('save error', err)
        return false
    }

}

// ✅ ID 기반 패치 업데이트
function update(name, idAttr, idVal, patch) {
    try {
        const data = get(name);
        const index = data.findIndex(item => item[idAttr] === idVal);
        if (index === -1) {
            create(name, patch)
            return false;
        }


        const now = new Date();
        const prev = data[index].updated ? new Date(data[index].updated) : now;
        const diffSeconds = Math.floor((now - prev) / 1000); // ms → 초

        data[index] = {
            ...data[index],
            ...patch,
            prevUpdated: data[index].updated || now.toISOString(),
            updated: now.toISOString(),
            diffSeconds
        };

        return save(name, data);
    } catch (err) {
        console.error(err)
        return null
    }
}

// ✅ create 함수: id 중복 없으면 추가
function create(name, item) {
    const data = get(name);
    if (!item.id) {
        item.id = uuidv4()
    }

    const exists = data.some(i => i.id === item.id);
    if (exists) {
        console.warn(`⚠️ [${name}] ID ${item.id} 이미 존재함 → 생성 안함`);
        return false;
    }

    const now = new Date().toISOString();
    const newItem = {
        ...item,
        updated: now,
        prevUpdated: now,
        diffSeconds: 0
    };

    data.push(newItem);
    return save(name, data);
}

module.exports = { get, save, update, create };
