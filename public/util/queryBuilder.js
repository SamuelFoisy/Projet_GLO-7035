$(document).ready(function () {
    var template_subquery = $('#template-subquery').html(),
        template_query = $('#template-query').html()
    $(document).bind('initialize_advanced_search', function (e, el) {
        $(el).on('click', '.js-add', function (e) {
            addQuery($(this).parents('.js-subquery').first().find('.query').first(), false)
            e.preventDefault()
            e.stopPropagation()
        })
        $(el).on('click', '.js-add_subquery', function (e) {
            addQuery($(this).parents('.js-subquery').first().find('.query').first(), true)
            e.preventDefault()
            e.stopPropagation()
        })
        $(el).on('click', '.js-remove', function (e) {
            removeQuery($(this).parent())
            e.preventDefault()
            e.stopPropagation()
        })
        $(el).on('click', '.js-remove_subquery', function (e) {
            removeQuery($(this).parents('.js-subquery').first())
            e.preventDefault()
            e.stopPropagation()
        })
        $('body').on('click', '#btnCondition', function () {
            var query = getCondition($(el).find('table.js-subquery').first())
            console.log(query)
        })
        $('body').on('click', '#btnQuery', function () {
            var con = getQuery(getCondition($(el).find('table.js-subquery').first()))
            console.log(con)
        });
        addQuery(el, true)
    })

    function addQuery(el, subquery) {
        if (subquery) {
            $(el).append(template_subquery)
            $(el).find('.js-add').last().trigger('click')
        } else {
            $(el).append(template_query)
        }
    }

    function removeQuery(el) {
        $(el).remove()
    }

    function getCondition(el) {
        var q = {},
            column, operator, value
        q.operator = $(el).find('td.separator option:selected').first().val()
        q.expressions = []
        $(el).find('td.query').first().children().each(function (i, child) {
            if ($(child).hasClass('js-query')) {
                column = $(child).find('.col :selected').text()
                operator = $(child).find('.op :selected').text()
                value = $(child).find('input').val()
                q.expressions.push([column, operator, value])
            } else {
                q.expressions.push(getCondition($(child)))
            }
        })
        return q
    }

    function getQuery(condition) {
        var query = '',
            tmp = [], i
        if (condition.expressions.length == 1) {
            return buildExpression(condition.expressions[0])
        } else {
            for (i = 0; i < condition.expressions.length; i++) {
                if (_.isArray(condition.expressions[i])) {
                    tmp.push(buildExpression(condition.expressions[i]))
                } else {
                    tmp.push(getQuery(condition.expressions[i]))
                }
            }
            return '(' + tmp.join(' ' + condition.operator + ' ') + ')'
        }
    }

    function buildExpression(expression) {
        return '("{0}" {1} "{2}")'
            .replace('{0}', expression[0])
            .replace('{1}', expression[1])
            .replace('{2}', expression[2])
    }
})