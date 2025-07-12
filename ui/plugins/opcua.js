
export function processStationData(data, stationMap) {
    const { value, name, nodeClass, nodeId } = data;

    const ids = nodeId.split(';')[1];
    const id = ids.substring(2, 8);
    const nodeValueId = ids.substring(8);
    const station = stationMap.get(id);

    if (station) {
        switch (nodeValueId) {
            case '51':
                station.rug = value;
                break;

            case '52':
                station.ea = value;
                if (station.status !== 'requested') {
                    station.status = value < 1 ? 'empty' : 'ok';
                }
                break;
        }
    }
}

export function checkRequestUpdated(data) {
    const { value, name, nodeClass, nodeId } = data;
    const ids = nodeId.split(';')[1];
    const id = ids.substring(2, 8);
    const nodeValueId = ids.substring(8);

    if (value || value === 'true' || value === 1) {

        switch (nodeValueId) {
            case '55':
                return true
                break;
            case '59':
                return true
            case '56':
                return true
                break;
            case '60':
                return true
                break;
        }
    }
    return false
}
