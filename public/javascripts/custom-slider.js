let generateSliders = function () {
    $(".bootstrap-slider[data-slider-value*='[']").slider({
        "tooltip_split": "true"
    });

    $(".bootstrap-slider:not([data-slider-value*='['])").slider({});
};