let chartMap = {};

function generateCustomBarChart(selector, title, labels, values, showLegend = false) {
    generateCustomChart('bar', selector, title, labels, values, showLegend);
}

function generateCustomPieChart(selector, title, labels, values, showLegend = true) {
    generateCustomChart('pie', selector, title, labels, values, showLegend);
}

function generateCustomChart(type, selector, title, labels, values, showLegend = true) {
    generateChart(selector, {
        type: type,
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: generateBackgroundColors(values.length),
                borderColor: generateBorderColors(values.length),
                borderWidth: 1
            }]
        },
        options: {
            title: {
                display: true,
                text: title,
                fontSize: 22,
                fontColor: '#000'
            },
            legend: {
                display: showLegend,
                position: 'bottom'
            }
        }
    });
}

function generateChart(selector, parameters) {
    if (chartMap[selector]) {
        chartMap[selector].destroy();
    }

    chartMap[selector] = new Chart($(selector).get(0).getContext('2d'), parameters);
    return chartMap[selector];
}

function generateBackgroundColors(count) {
    const AVAILABLE_BACKGROUND_COLORS = [
        'rgba(58, 222, 6, 0.3)',
        'rgba(54, 162, 235, 0.3)',
        'rgba(245, 100, 69, 0.3)',
        'rgba(240, 220, 3, 0.3)',
        'rgba(153, 102, 255, 0.3)',
        'rgba(0, 160, 73, 0.3)',
        'rgba(255, 159, 64, 0.3)',
        'rgba(38, 116, 169, 0.3)',
        'rgba(220, 69, 180, 0.3)',
        'rgba(119, 247, 224, 0.3)',
        'rgba(255, 90, 120, 0.3)',
        'rgba(86, 56, 137, 0.3)'];

    let colors = AVAILABLE_BACKGROUND_COLORS;

    for (let concatCounts = Math.ceil(count / AVAILABLE_BACKGROUND_COLORS.length) - 1; concatCounts > 0; concatCounts--) {
        colors = colors.concat(AVAILABLE_BACKGROUND_COLORS);
    }

    return colors;
}

function generateBorderColors(count) {
    const AVAILABLE_BORDER_COLORS = [
        'rgba(58, 222, 6, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(245, 100, 69, 1)',
        'rgba(240, 220, 3, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(0, 160, 73, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(38, 116, 169, 1)',
        'rgba(220, 69, 180, 1)',
        'rgba(119, 247, 224, 1)',
        'rgba(255, 90, 120, 1)',
        'rgba(86, 56, 137, 1)'];

    let borderColors = AVAILABLE_BORDER_COLORS;

    for (let concatCounts = Math.ceil(count / borderColors.length) - 1; concatCounts > 0; concatCounts--) {
        borderColors = borderColors.concat(AVAILABLE_BORDER_COLORS);
    }

    return borderColors;
}