export const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString('en-GB').split('/').join('/');
    const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
    return `${formattedDate}, ${formattedTime}`;
};

export const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString('en-GB').split('/').join('/');
    return formattedDate;
};

export const normalizeInput = (input) => {
    return input.trim().toLowerCase().replace(/^\w/, c => c.toUpperCase());
};

export const groupRequestsByDate = (requests) => {
    const today = new Date().toLocaleDateString('en-GB').split('/').join('/');
    const groupedByDate = requests.reduce((acc, request) => {
        const date = formatDate(request.timestamp);
        const section = date === today ? 'Hoy' : date;
        if (!acc[section]) {
            acc[section] = [];
        }
        acc[section].push(request);
        return acc;
    }, {});

    const groupedByDateAndClass = {};
    Object.keys(groupedByDate).forEach(date => {
        const requestsByDate = groupedByDate[date];
        const groupedByClass = requestsByDate.reduce((acc, request) => {
            const key = `${request.class}-${request.group}`;
            if (!acc[key]) {
                acc[key] = { ...request, count: 1 };
            } else {
                acc[key].count += 1;
                if (new Date(request.timestamp) > new Date(acc[key].timestamp)) {
                    acc[key].timestamp = request.timestamp;
                }
            }
            return acc;
        }, {});
        groupedByDateAndClass[date] = Object.values(groupedByClass);
    });

    return groupedByDateAndClass;
};


